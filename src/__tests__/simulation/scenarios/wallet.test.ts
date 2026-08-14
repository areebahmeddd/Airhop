/**
 * @jest-environment node
 */
// Money.
//
// Every other feature can lose a message and be forgiven. This one cannot lose
// a sat, and it cannot claim a sat it does not have. The scenarios here are
// therefore written against conservation rather than against outcomes: the sum
// of what everybody holds, plus what is reserved, plus what is in flight, must
// equal what the mint actually put into circulation - under every interleaving,
// every crash, and every mint failure.
//
// The mint is real BDHKE against a real secp256k1 keyset, so a double-spend is
// refused by the same arithmetic a real mint uses rather than by a flag in a
// stub.

jest.mock("expo-location", () => ({}));
jest.mock("react-native/Libraries/EventEmitter/RCTDeviceEventEmitter", () =>
  // Every phone needs its own listener set. See harness/event-router.ts: this
  // is the only interception point that reliably catches every path by which
  // mesh-service and the native modules reach the emitter.
  (
    require("../harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
jest.mock("@bridge/NativeAirhopBLE", () => {
  const shim = require("../../harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../../harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import { getDecodedToken, getEncodedToken, type Token } from "@cashu/cashu-ts";
import { SimDevice, type DeviceSpec } from "../harness/device";
import { noCrashes } from "../harness/invariants";
import { MintFabric, simInvoice } from "../harness/mint-fabric";
import { RadioFabric } from "../harness/radio-fabric";
import { RelayFabric } from "../harness/relay-fabric";
import { Scenario, waitFor } from "../harness/scenario";

// Driving a fake clock while awaiting real app promises costs real seconds.
jest.setTimeout(120_000);

let scenario: Scenario | null = null;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  scenario?.close();
  scenario = null;
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

const android = (id: string, seedByte: number): DeviceSpec => ({
  id,
  platform: "android",
  seedByte,
});

// Rewrite a token so it claims twice what the mint signed, which is the forgery
// worth defending against: the payload still decodes and still names a real
// keyset, so nothing short of checking the witness against the mint's keys can
// tell it apart from the genuine article.
function tamperToken(raw: string): string {
  const decoded = getDecodedToken(raw, []);
  const proofs = decoded.proofs.map((p, i) => ({
    id: p.id,
    amount: i === 0 ? Number(p.amount) * 2 : Number(p.amount),
    secret: p.secret,
    C: p.C,
    ...(p.dleq === undefined ? {} : { dleq: p.dleq }),
  }));
  return getEncodedToken({
    mint: decoded.mint,
    unit: decoded.unit,
    proofs,
  } as unknown as Token);
}

function room(
  s: Scenario,
  specs: DeviceSpec[],
): { radio: RadioFabric; devices: SimDevice[] } {
  const radio = new RadioFabric(s.world);
  const devices = specs.map((spec) => SimDevice.create(s.world, spec));
  for (const d of devices) radio.add(d);
  s.track(...devices);
  for (const d of devices) d.launch();
  return { radio, devices };
}

test("W01 a mint that speaks real BDHKE issues verifiable ecash", async () => {
  const s = (scenario = new Scenario({
    id: "W01",
    title: "deposit over Lightning, then hold spendable proofs",
    seed: 101,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;

  const ready = await alice.walletReady();
  s.check("the wallet opened its encrypted storage", ready);

  const added = await alice.addMint(mint.url);
  s.check(
    "the mint was accepted after validation",
    added,
    `added=${String(added)}`,
  );

  const minted = await alice.depositSats(500);
  s.check("500 sats were minted", minted, `balance=${alice.balance()}`);
  s.check(
    "the balance reflects exactly what was minted",
    alice.balance() === 500,
    `balance=${alice.balance()} mint issued ${mint.totalIssued}`,
  );
  // Minted proofs come straight from the mint, so nothing is pending its word
  // on whether they are unspent. The offline DLEQ check is a separate question
  // and is covered by W14.
  s.check(
    "nothing is left waiting on the mint to confirm it",
    alice.unverifiedBalance() === 0,
    `unverified=${alice.unverifiedBalance()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W02 ecash moves device to device with the radio off", async () => {
  const s = (scenario = new Scenario({
    id: "W02",
    title: "offline send over BLE, redeemed later when online",
    seed: 102,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  await alice.walletReady();
  await bob.walletReady();
  await alice.addMint(mint.url);
  await bob.addMint(mint.url);
  await alice.depositSats(500);
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);

  const before = { alice: alice.balance(), bob: bob.balance() };
  s.check(
    "alice starts with money and bob with none",
    before.alice === 500 && before.bob === 0,
    `alice=${before.alice} bob=${before.bob}`,
  );

  // The mint goes away entirely: this is the dead-zone case the whole feature
  // exists for.
  mint.setConditions({ offline: true });

  const prepared = await alice.prepareSend(120);
  s.check(
    "a token can be built with no mint reachable",
    prepared !== null,
    prepared === null
      ? "prepareSend returned nothing"
      : `${prepared.length} chars`,
  );
  s.check(
    "the sent value is reserved, not deleted",
    alice.reservedBalance() >= 120,
    `reserved=${alice.reservedBalance()} spendable=${alice.balance()}`,
  );

  // Hand it over as a chat message, which is how a payment actually travels.
  if (prepared !== null) {
    alice.send(`dm:${bob.peerID}`, prepared);
    await waitFor(
      s.world,
      () => bob.texts(`dm:${alice.peerID}`).length > 0,
      20_000,
    );
  }
  // Offline there is no change, so the amount that actually moves is whatever
  // the wallet had to reserve to cover 120. Asserting on 120 would be asserting
  // that change exists offline, which is the one thing Cashu cannot do.
  const handedOver = alice.reservedBalance();
  const received = await bob.receiveToken(prepared ?? "", {
    preferOffline: true,
  });
  s.check("bob could claim the token with no internet", received);
  s.check(
    "and it is held as UNVERIFIED, not presented as confirmed money",
    bob.totalHeld() === handedOver && bob.unverifiedBalance() === handedOver,
    `bob holds ${bob.totalHeld()} (unverified ${bob.unverifiedBalance()}), alice handed over ${handedOver}`,
  );

  // Bob gets internet back and redeems. Alice's send is confirmed, which is
  // what the Wallet screen does once delivery is acknowledged - until then her
  // reserve is still legitimately hers.
  mint.setConditions({ offline: false });
  alice.confirmLastSend();
  await bob.refreshWallet();
  s.check(
    "once online the mint confirms it and it becomes spendable",
    bob.balance() === handedOver && bob.unverifiedBalance() === 0,
    `bob balance=${bob.balance()} unverified=${bob.unverifiedBalance()}`,
  );

  // Conservation, now that the send is settled on both sides.
  const total = alice.totalHeld() + bob.totalHeld();
  s.check(
    "no value was created or destroyed by the transfer",
    total === 500,
    `alice held ${alice.totalHeld()} + bob held ${bob.totalHeld()} = ${total}, minted 500`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W03 the same token cannot be redeemed twice", async () => {
  const s = (scenario = new Scenario({
    id: "W03",
    title: "two people race to the mint with one bearer token",
    seed: 103,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
    android("carol", 33),
  ]);
  const [alice, bob, carol] = devices;
  for (const d of devices) await d.walletReady();
  for (const d of devices) await d.addMint(mint.url);
  await alice.depositSats(500);

  // A bearer token is exactly that: whoever holds the string can try to spend
  // it. Alice hands the same one to two people, which the docs are explicit
  // about being possible - the mint is the only thing that resolves it.
  const token = await alice.prepareSend(64);
  s.check("a token was produced", token !== null);
  if (token === null) {
    s.assert();
    return;
  }

  const handedOver = alice.reservedBalance();
  const bobGot = await bob.receiveToken(token);
  const carolGot = await carol.receiveToken(token);
  // Alice handed the token over and one of them took it, so the send is done
  // from her side. Until confirmSend runs, her reserve is still counted as hers
  // - correctly, because an unconfirmed send is reclaimable.
  alice.confirmLastSend();

  s.check(
    "exactly one of them ended up with the money",
    (bobGot ? 1 : 0) + (carolGot ? 1 : 0) === 1,
    `bob=${String(bobGot)} (${bob.totalHeld()}) carol=${String(carolGot)} (${carol.totalHeld()})`,
  );
  s.check(
    "the mint refused the second attempt rather than signing it",
    mint.doubleSpendRefusals >= 1,
    `refusals=${mint.doubleSpendRefusals}`,
  );
  s.check(
    "the loser's balance was not credited",
    bob.totalHeld() + carol.totalHeld() === handedOver,
    `bob=${bob.totalHeld()} carol=${carol.totalHeld()} handed over ${handedOver}`,
  );
  s.check(
    "no sat was created across the whole world",
    alice.totalHeld() + bob.totalHeld() + carol.totalHeld() === 500,
    `alice=${alice.totalHeld()} bob=${bob.totalHeld()} carol=${carol.totalHeld()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W04 an undelivered send is reclaimable rather than lost", async () => {
  const s = (scenario = new Scenario({
    id: "W04",
    title: "the sheet is dismissed after the token was built",
    seed: 104,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);
  await alice.depositSats(300);

  const token = await alice.prepareSend(100);
  s.check("a token was prepared", token !== null);
  // Offline there is no change: the wallet cannot make exactly 100 out of
  // {256, 32, 8, 4}, so it spends the smallest set that covers it and the
  // difference goes to the recipient. That is the documented behaviour, and the
  // number to assert is "something left the balance and is accounted for", not
  // a figure that assumes change exists.
  const reserved = alice.reservedBalance();
  s.check(
    "the value left the spendable balance",
    alice.balance() < 300,
    `spendable=${alice.balance()}`,
  );
  s.check(
    "but is held in reserve, not deleted, and covers the amount",
    reserved >= 100 && alice.balance() + reserved === 300,
    `reserved=${reserved} spendable=${alice.balance()}`,
  );
  s.check(
    "so the total is unchanged",
    alice.totalHeld() === 300,
    `total=${alice.totalHeld()}`,
  );

  // The user backs out. Nothing was ever handed over.
  const reclaimed = alice.reclaimLastSend();
  s.check("the send could be reclaimed", reclaimed);
  s.check(
    "and the money came back to the spendable balance",
    alice.balance() === 300 && alice.reservedBalance() === 0,
    `spendable=${alice.balance()} reserved=${alice.reservedBalance()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W05 a mint that dies mid-swap does not destroy the input proofs", async () => {
  const s = (scenario = new Scenario({
    id: "W05",
    title: "the nastiest failure: inputs burned, outputs never returned",
    seed: 105,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  for (const d of devices) await d.walletReady();
  for (const d of devices) await d.addMint(mint.url);
  await alice.depositSats(400);

  const token = await alice.prepareSend(80);
  s.check("a token was prepared", token !== null);

  // The mint accepts the swap, marks the inputs spent, then times out.
  mint.setConditions({ swapVanishes: true });
  await bob.receiveToken(token ?? "");
  // The swap did not complete, so bob cannot know the proofs are still good.
  // Storing them as UNVERIFIED is the honest outcome and the one the design
  // asks for; what must never happen is presenting them as confirmed money.
  s.check(
    "nothing bob holds is claimed as verified",
    bob.unverifiedBalance() === bob.balance(),
    `bob balance=${bob.balance()} unverified=${bob.unverifiedBalance()}`,
  );
  s.check(
    "and the mint really did refuse to complete the swap",
    bob.balance() === 0 || bob.unverifiedBalance() > 0,
    `bob holds ${bob.totalHeld()}`,
  );

  // The honest position afterwards: alice's reserve still shows the value as
  // hers until the mint says otherwise, and the app must not report it twice.
  s.check(
    "alice's books still balance",
    alice.totalHeld() === 400,
    `alice holds ${alice.totalHeld()} (spendable ${alice.balance()}, reserved ${alice.reservedBalance()})`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W06 a locked nutzap that reached its owner late stops looking pending", async () => {
  const s = (scenario = new Scenario({
    id: "W06",
    title:
      "reconcile closes a nutzap delivered by something other than a relay",
    seed: 106,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  await alice.walletReady();
  await bob.walletReady();
  await alice.addMint(mint.url);
  await bob.addMint(mint.url);
  await alice.depositSats(500);

  // The state a nutzap lands in when the relay refuses the kind 9321 and no
  // transport carries the token either: the proofs are gone from alice's wallet
  // (locked to bob's key, so not hers to reclaim), there is no reservation, and
  // the transaction sits pending holding the token as the only way to the money.
  //
  // Staged rather than driven, because the fabric cannot make a relay refuse a
  // publish. Everything after this point is real: a real token, a real mint, and
  // the real reconcile.
  //
  // 200 is not a sum of the denominations alice holds, so the token is the
  // smallest one that covers it. Asserting on the real figure rather than the
  // requested one is the point: an inexact offline send overpays, and a test
  // that pretended otherwise would be hiding it.
  const token = await alice.prepareSend(200);
  const sent = 224;
  const txId = alice.lastSendTxId();
  alice.confirmLastSend();
  alice.updateTx(txId ?? "", {
    kind: "nutzap-out",
    status: "pending",
    token,
    error: "locked but undelivered",
  });

  s.check(
    "the payment starts out parked as pending",
    alice.txStatus(txId ?? "") === "pending",
    `status=${String(alice.txStatus(txId ?? ""))}`,
  );
  s.check(
    "and alice cannot reclaim it, because it is not hers",
    !alice.reclaimLastSend(),
  );

  // The outbox gets it there eventually and bob redeems it. Nothing tells
  // alice's wallet that happened: no receipt, no relay event, no reservation for
  // the old sweep to notice. Without the nutzap pass in reconcile, alice's
  // Pending list shows this payment forever, and the only way she can act on it
  // is to hand over a token that has already been spent.
  await bob.receiveToken(token ?? "");
  s.check(
    "bob really did redeem it",
    bob.balance() === sent,
    `bob=${bob.balance()}`,
  );

  await alice.reconcile();

  s.check(
    "reconcile closed it out once the mint said the proofs were spent",
    alice.txStatus(txId ?? "") === "completed",
    `status=${String(alice.txStatus(txId ?? ""))}`,
  );
  s.check(
    "and the money is counted once, on bob's side only",
    alice.totalHeld() === 500 - sent && bob.totalHeld() === sent,
    `alice=${alice.totalHeld()} bob=${bob.totalHeld()} issued=${mint.totalIssued}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W07 a nutzap crosses the internet, locked to a key only the recipient holds", async () => {
  const s = (scenario = new Scenario({
    id: "W07",
    title: "NIP-61 end to end: 10019 discovery, P2PK lock, 9321, redemption",
    seed: 107,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const relay = new RelayFabric(s.world);
  const radio = new RadioFabric(s.world);
  // No radio link between them on purpose: this is the rail for someone you
  // cannot reach over Bluetooth, which is the only time the ladder reaches for
  // NIP-61 at all.
  const alice = SimDevice.create(
    s.world,
    { ...android("alice", 11), internetEnabled: true },
    relay,
  );
  const bob = SimDevice.create(
    s.world,
    { ...android("bob", 22), internetEnabled: true },
    relay,
  );
  radio.add(alice);
  s.track(alice, bob);
  alice.launch();
  bob.launch();
  await waitFor(s.world, () => relay.connectionCount("alice") > 0, 20_000);
  await waitFor(s.world, () => relay.connectionCount("bob") > 0, 20_000);

  await alice.walletReady();
  await bob.walletReady();
  await alice.addMint(mint.url);
  await bob.addMint(mint.url);
  await alice.depositSats(500);

  // Bob announces how to pay him and starts watching. Without the kind 10019
  // there is nothing to discover and the ladder correctly refuses this rail.
  const ready = await bob.startNutzapReceiving();
  s.check("bob published his nutzap info and is watching", ready);

  const bobPubkey = bob.nostrPubkey;
  s.check("bob has a Nostr identity to be paid at", bobPubkey.length > 0);

  const result = await alice.pay({
    nostrPubkey: bobPubkey,
    amount: 128,
    memo: "over the internet",
  });

  s.check(
    "alice's payment took the nutzap rail",
    result?.rail === "nutzap",
    `rail=${String(result?.rail)}`,
  );
  s.check(
    "and it is reported as final, because locked proofs are not hers to recall",
    result?.final === true,
  );
  // Nothing is reserved on a nutzap: the coins were swapped into new ones bound
  // to bob's key. Offering a reclaim here would be offering money that is gone.
  s.check(
    "alice holds no reservation against it",
    alice.reservedBalance() === 0,
    `reserved=${alice.reservedBalance()}`,
  );

  await waitFor(s.world, () => bob.balance() > 0, 30_000);

  s.check(
    "bob's watcher redeemed it without him doing anything",
    bob.balance() === 128,
    `bob=${bob.balance()}`,
  );
  s.check(
    "and the mint's books balance across both phones",
    alice.totalHeld() + bob.totalHeld() === 500,
    `alice=${alice.totalHeld()} bob=${bob.totalHeld()}`,
  );
  s.check(
    "bob swapped the locked proofs, so only he can spend them now",
    bob.unverifiedBalance() === 0,
    `unverified=${bob.unverifiedBalance()}`,
  );
  s.expectNone("process health", noCrashes([alice, bob]));
  s.assert(true);
});

test("W08 withdrawing to Lightning returns the unused routing reserve", async () => {
  const s = (scenario = new Scenario({
    id: "W08",
    title: "melt with a fee reserve, change credited back (NUT-05 / NUT-08)",
    seed: 108,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  // A real mint cannot know the Lightning fee before it routes, so it holds
  // back a reserve and refunds what it did not spend. Quoting exactly is the
  // easy case; this is the one where sats go missing if the change path is
  // wrong, because the reserve leaves the wallet either way.
  mint.setConditions({ meltFeeReserve: 16, meltActualFee: 3 });
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);
  await alice.depositSats(500);

  const quote = await alice.withdrawQuote(simInvoice(100));
  s.check(
    "the quote separates what they receive from what it may cost",
    quote?.amount === 100 && quote?.feeReserve === 16 && quote?.total === 116,
    `amount=${String(quote?.amount)} reserve=${String(quote?.feeReserve)} total=${String(quote?.total)}`,
  );

  const before = alice.totalHeld();
  const result = await alice.withdraw(simInvoice(100));

  s.check(
    "the invoice was paid",
    result?.paid === 100,
    `paid=${String(result?.paid)}`,
  );
  s.check(
    "the unused reserve came back as change",
    result?.changeReturned === 13,
    `change=${String(result?.changeReturned)} (reserve 16 - actual fee 3)`,
  );
  s.check(
    "the fee reported is what the route really cost, not the reserve",
    result?.fee === 3,
    `fee=${String(result?.fee)}`,
  );
  // The arithmetic that matters: exactly amount + real fee left the wallet.
  s.check(
    "alice is down the invoice plus the real fee, and nothing else",
    alice.totalHeld() === before - 103,
    `before=${before} after=${alice.totalHeld()}`,
  );
  s.check(
    "nothing is left reserved against a finished withdrawal",
    alice.reservedBalance() === 0,
    `reserved=${alice.reservedBalance()}`,
  );
  s.check(
    "and the change is verified money, not an unconfirmed IOU",
    alice.unverifiedBalance() === 0,
    `unverified=${alice.unverifiedBalance()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W09 a Lightning payment that fails gives the money back", async () => {
  const s = (scenario = new Scenario({
    id: "W09",
    title: "melt refused by the mint: proofs survive, balance intact",
    seed: 109,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  mint.setConditions({ meltFeeReserve: 8, meltFails: true });
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);
  await alice.depositSats(500);

  const before = alice.totalHeld();
  const result = await alice.withdraw(simInvoice(100));

  s.check(
    "the withdrawal reports failure rather than success",
    result === null,
  );
  // The mint paid nobody, so the proofs it was offered are still good. A wallet
  // that left them reserved would show the user a balance they cannot spend,
  // and one that dropped them would have burned the money for a payment that
  // never happened.
  s.check(
    "every sat is still alice's",
    alice.totalHeld() === before,
    `before=${before} after=${alice.totalHeld()}`,
  );
  s.check(
    "and spendable, not stranded in a reservation",
    alice.balance() === before && alice.reservedBalance() === 0,
    `spendable=${alice.balance()} reserved=${alice.reservedBalance()}`,
  );

  // And it must be genuinely spendable, not merely counted: the mint never
  // marked those proofs spent, so a real withdrawal should now succeed.
  mint.setConditions({ meltFails: false, meltActualFee: 2 });
  const retry = await alice.withdraw(simInvoice(100));
  s.check(
    "a retry after the outage goes through",
    retry?.paid === 100,
    `paid=${String(retry?.paid)}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W10 a wiped phone gets its money back from twelve words", async () => {
  const s = (scenario = new Scenario({
    id: "W10",
    title: "NUT-13 deterministic secrets, NUT-09 restore, counters advanced",
    seed: 110,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);

  // Backup FIRST. Coins minted before the phrase exists have random secrets
  // and are not derivable from it, which is exactly what the Wallet screen
  // means by "not covered yet".
  const phrase = await alice.enableBackup();
  s.check(
    "backup produced a twelve word phrase",
    (phrase ?? "").split(" ").length === 12,
    `words=${(phrase ?? "").split(" ").length}`,
  );

  await alice.depositSats(500);
  s.check(
    "alice has money to lose",
    alice.balance() === 500,
    `${alice.balance()}`,
  );

  // Losing the phone. Keys, proofs, history, everything.
  alice.panicWipe();
  alice.launch();
  await alice.walletReady();
  s.check(
    "the wipe really emptied the wallet",
    alice.totalHeld() === 0,
    `held=${alice.totalHeld()}`,
  );

  await alice.addMint(mint.url);
  const restored = await alice.restoreFrom(phrase ?? "", [mint.url]);

  s.check(
    "the words brought the balance back",
    alice.balance() === 500,
    `balance=${alice.balance()} restored=${String(restored?.recovered)}`,
  );
  s.check(
    "and it is verified money the mint confirmed unspent",
    alice.unverifiedBalance() === 0,
    `unverified=${alice.unverifiedBalance()}`,
  );

  // The counter test. Restore has to push the derivation cursor past everything
  // the mint has already signed, or the very next swap re-derives a blinded
  // message the mint has seen and is refused as a duplicate. That failure does
  // not show up in the balance: it shows up the first time the user tries to
  // spend, which is the worst possible moment to discover it.
  const token = await alice.prepareSend(64);
  s.check(
    "and spending after a restore still works",
    token !== null && token.startsWith("cashu"),
    token === null ? "prepareSend returned nothing" : "token built",
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W11 a withdrawal whose answer never arrives is resolved, not guessed", async () => {
  const s = (scenario = new Scenario({
    id: "W11",
    title:
      "melt response lost after payment: reservation held, then reconciled",
    seed: 111,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  // The mint pays, burns the inputs, signs the change, and then the connection
  // drops. The wallet cannot know any of that happened.
  mint.setConditions({
    meltFeeReserve: 16,
    meltActualFee: 3,
    meltVanishes: true,
  });
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);
  await alice.depositSats(500);

  const before = alice.totalHeld();
  const result = await alice.withdraw(simInvoice(100));
  s.check("the withdrawal could not report success", result === null);

  // The only honest position: the money is neither spendable nor written off.
  // Releasing it would let the user spend proofs the mint has already burned;
  // dropping it would throw away the routing reserve the mint is holding.
  s.check(
    "the coins stay reserved rather than being handed back",
    alice.reservedBalance() > 0,
    `reserved=${alice.reservedBalance()} spendable=${alice.balance()}`,
  );
  s.check(
    "and nothing has been written off yet",
    alice.totalHeld() === before,
    `before=${before} after=${alice.totalHeld()}`,
  );

  // Later, on any launch, the wallet asks the mint what actually happened.
  await alice.reconcile();

  s.check(
    "reconcile closed it out once the quote said PAID",
    alice.reservedBalance() === 0,
    `reserved=${alice.reservedBalance()}`,
  );
  // 13 of the 16 sat reserve comes back, recovered from the blank outputs the
  // wallet stored BEFORE the request. Without those it would be gone for good.
  s.check(
    "and recovered the unused routing reserve from the stored blanks",
    alice.totalHeld() === before - 103,
    `held=${alice.totalHeld()} expected=${before - 103}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W12 a balance split across two mints can be moved onto one", async () => {
  const s = (scenario = new Scenario({
    id: "W12",
    title: "consolidate: melt at the source, mint at the destination",
    seed: 112,
  }));
  // Two mints at once. A Cashu token names exactly one mint, so a balance split
  // between them genuinely cannot pay a sum neither covers: that is a protocol
  // fact, not a UI limitation, and moving value between them means a real
  // Lightning round trip.
  const mintA = new MintFabric(s.world, "https://mint-a.test");
  const mintB = new MintFabric(s.world, "https://mint-b.test");
  // A non-zero reserve at the source is what makes this realistic. Consolidate
  // deliberately under-shoots to leave room for the Lightning fee, and with no
  // reserve there are no blank outputs, so that headroom would be lost to the
  // mint rather than refunded. Real mints quote a reserve; so does this one.
  mintA.setConditions({ meltFeeReserve: 8, meltActualFee: 1 });
  mintA.install();
  mintB.install();
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mintA.url);
  await alice.addMint(mintB.url);
  await alice.depositSats(256, mintA.url);
  await alice.depositSats(128, mintB.url);

  s.check(
    "alice starts with a genuinely split balance",
    alice.balanceAt(mintA.url) === 256 && alice.balanceAt(mintB.url) === 128,
    `A=${alice.balanceAt(mintA.url)} B=${alice.balanceAt(mintB.url)}`,
  );

  const before = alice.totalHeld();
  const beforeB = alice.balanceAt(mintB.url);
  const moved = await alice.consolidate(mintA.url, mintB.url);

  s.check("the move reported a result", moved !== null);
  s.check(
    "the destination grew by exactly what the mint says arrived",
    alice.balanceAt(mintB.url) === beforeB + (moved?.received ?? -1),
    `B=${alice.balanceAt(mintB.url)} was ${beforeB} received=${String(moved?.received)}`,
  );
  // Consolidate has to under-shoot: it cannot know the Lightning fee before
  // quoting, so it holds a buffer back and the unused part returns as change to
  // the SOURCE mint. The user ends up heavily weighted onto one mint rather
  // than perfectly emptied, which is the honest outcome of a fee it cannot
  // predict, not a bug.
  s.check(
    "the bulk of the source balance made it across",
    (moved?.received ?? 0) >= 230,
    `received=${String(moved?.received)} of 256`,
  );
  // The only sat that may go missing is the one Lightning actually charged.
  // Everything else - the safety buffer consolidate holds back, the unused
  // routing reserve - has to come back, or a user loses money every time they
  // tidy up a split balance.
  s.check(
    "and nothing was lost beyond the real routing fee",
    alice.totalHeld() === before - (moved?.fee ?? 0),
    `held=${alice.totalHeld()} before=${before} fee=${String(moved?.fee)}`,
  );
  // The reserve was 8 and the route cost 1. Reporting 8 would be telling the
  // user a move cost eight times what it did, and would disagree with the
  // balance in front of them.
  s.check(
    "and the fee reported is what the route charged, not the reserve held",
    moved?.fee === 1,
    `fee=${String(moved?.fee)} reserve=8 actual=1`,
  );
  s.check(
    "nothing is left reserved against the transfer",
    alice.reservedBalance() === 0,
    `reserved=${alice.reservedBalance()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W13 Tor on iOS blocks mint traffic instead of leaking it", async () => {
  const s = (scenario = new Scenario({
    id: "W13",
    title: "clearnet mint calls refused while Tor is up on iOS",
    seed: 113,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const radio = new RadioFabric(s.world);
  // iOS specifically. Arti wraps WebSockets, not fetch, so a mint request made
  // while Tor is up would leave the device in the clear while the user believes
  // everything is routed. Android hands the whole socket to Orbot, so it does
  // not have this problem and must NOT be blocked.
  const iphone = SimDevice.create(s.world, {
    id: "iphone",
    platform: "ios",
    seedByte: 31,
  });
  //
  // Only the iPhone here: `Platform.OS` is one global inside the harness, so
  // two devices cannot disagree about it. The Android side of the branch is
  // covered in services/__tests__/mint-network-gate.test.ts, which can mock it.
  radio.add(iphone);
  s.track(iphone);
  iphone.launch();
  await iphone.walletReady();
  await iphone.addMint(mint.url);
  await iphone.depositSats(500);

  s.check(
    "with Tor down, mint calls are allowed",
    !iphone.mintNetworkBlocked(),
  );

  iphone.setTorActive(true);

  s.check(
    "Tor up on iOS blocks mint traffic",
    iphone.mintNetworkBlocked(),
    "the UI greys the buttons off this",
  );

  // Blocked means refused, not merely discouraged: a deposit must not reach the
  // network, and must not deduct anything on the way to failing.
  const before = iphone.totalHeld();
  const withdrew = await iphone.withdraw(simInvoice(100));
  s.check("a withdrawal while blocked fails", withdrew === null);
  s.check(
    "and takes nothing with it",
    iphone.totalHeld() === before && iphone.reservedBalance() === 0,
    `held=${iphone.totalHeld()} reserved=${iphone.reservedBalance()}`,
  );

  // The offline paths are the whole point of the app and must be unaffected:
  // building a token touches no mint.
  const token = await iphone.prepareSend(64);
  s.check(
    "but handing ecash to someone still works with Tor up",
    token !== null,
    token === null ? "prepareSend refused" : "token built",
  );

  iphone.setTorActive(false);
  s.check("and it unblocks when Tor drops", !iphone.mintNetworkBlocked());
  s.expectNone("process health", noCrashes([iphone]));
  s.assert(true);
});

test("W14 a tampered token is refused in a dead zone, a real one is not", async () => {
  // The offline forgery check, which is the only defence when there is no mint
  // to ask whether a proof is unspent. It could not be written until the mint
  // issued NUT-12 witnesses: without one every verdict is "unchecked", so a
  // forgery and a legitimate offline transfer looked identical from here.
  const s = (scenario = new Scenario({
    id: "W14",
    title: "offline DLEQ accepts real ecash and refuses a forged proof",
    seed: 114,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  await alice.walletReady();
  await bob.walletReady();
  await alice.addMint(mint.url);
  // Bob must know the mint's keys BEFORE the lights go out. Cached keys are
  // what makes the check possible offline, and fetching them is an online act.
  await bob.addMint(mint.url);
  await alice.depositSats(500);
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);

  const genuine = await alice.prepareSend(64);
  s.check("alice built a token to hand over", genuine !== null);
  if (genuine === null) {
    s.assert(false);
    return;
  }

  // The dead zone. Everything from here is decided on this phone alone.
  mint.setConditions({ offline: true });

  const accepted = await bob.receiveTokenResult(genuine, {
    preferOffline: true,
  });
  s.check(
    "a genuinely signed token is accepted with no mint reachable",
    accepted !== null && accepted.outcome === "stored",
    accepted === null ? "refused" : `outcome=${accepted.outcome}`,
  );
  // The branch that had no coverage at all before this scenario existed. The
  // mint really signed it, and the phone can prove that without the mint.
  s.check(
    "and its witness verifies against the cached mint keys",
    accepted?.dleq === "valid",
    `dleq=${accepted?.dleq ?? "none"}`,
  );

  // The attack, built from a SECOND token bob has never seen. Tampering with
  // the one he just accepted would prove nothing: those secrets are already in
  // his wallet, so the duplicate check refuses it before the witness is ever
  // examined, and the forgery gate could be removed entirely without the
  // scenario noticing.
  const second = await alice.prepareSend(32);
  s.check("alice built a second, unseen token", second !== null);
  if (second === null) {
    s.assert(false);
    return;
  }
  const forged = tamperToken(second);
  s.check("the forgery still looks like a token", forged !== second);

  const before = bob.totalHeld();
  const refused = await bob.receiveTokenResult(forged, { preferOffline: true });
  s.check(
    "a tampered token is refused rather than credited",
    refused === null,
    refused === null ? "refused" : `outcome=${refused.outcome}`,
  );
  s.check(
    "and the balance did not move",
    bob.totalHeld() === before,
    `held ${bob.totalHeld()}, was ${before}`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W15 an unpaid invoice mints nothing, however hard the user taps", async () => {
  // Tapping "I've paid" before the payment settles, or after it failed. The
  // mint has had no money, so the only correct outcome is a refusal. Minting
  // here would create coins backed by nothing, and the wallet would show a
  // balance that no mint will honour.
  const s = (scenario = new Scenario({
    id: "W15",
    title: "claiming a deposit whose invoice was never paid",
    seed: 115,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);

  mint.setConditions({ depositUnpaid: true });

  const claimed = await alice.depositSats(500);
  s.check(
    "claiming an unpaid invoice is refused",
    !claimed,
    `depositSats returned ${String(claimed)}`,
  );
  s.check(
    "and no coins were created",
    alice.totalHeld() === 0,
    `held ${alice.totalHeld()}`,
  );
  s.check(
    "the mint agrees it issued nothing",
    mint.totalIssued === 0,
    `mint issued ${mint.totalIssued}`,
  );

  // The invoice is paid for real, and the same tap now works. This is what
  // makes the refusal a "not yet" rather than a dead end.
  mint.setConditions({ depositUnpaid: false });
  const retried = await alice.depositSats(500);
  s.check("paying the invoice makes the same claim succeed", retried);
  s.check(
    "and the balance is exactly what was paid for",
    alice.balance() === 500,
    `balance=${alice.balance()} issued=${mint.totalIssued}`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W16 a balance the mint has already spent does not linger", async () => {
  // The phantom balance a lost swap response leaves behind. The mint took the
  // inputs, the answer never arrived, so the wallet still lists proofs the mint
  // considers spent. Nothing pending records it, which is why the other
  // reconcile passes cannot find it: they all follow a transaction.
  //
  // Left alone the number is not merely stale, it is a trap. The next send
  // selects those proofs and fails at the mint, and the user is told they have
  // money they cannot spend.
  const s = (scenario = new Scenario({
    id: "W16",
    title: "reconcile drops proofs the mint reports spent",
    seed: 116,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);
  await alice.depositSats(500);
  s.check("alice starts with the deposit", alice.balance() === 500);

  // Spend half of them behind the wallet's back, which is exactly what the mint
  // sees after a swap whose response was lost.
  const secrets = alice.secrets();
  const stolen = secrets.slice(0, Math.floor(secrets.length / 2));
  for (const secret of stolen) mint.markSpent(secret);
  s.check(
    "the wallet has not noticed and still reports the full balance",
    alice.balance() === 500,
    `balance=${alice.balance()}`,
  );

  await alice.reconcile();

  s.check(
    "reconcile drops what the mint says is gone",
    alice.balance() < 500,
    `balance=${alice.balance()}`,
  );
  s.check(
    "and keeps everything the mint still honours",
    alice.balance() > 0,
    `balance=${alice.balance()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W17 a swap whose answer never came back is replayed, not written off", async () => {
  // The failure the rest of the wallet has no answer for. A melt can ask its
  // quote what happened and a deposit can ask its; a swap has neither. The mint
  // takes the inputs, signs the outputs, and answers exactly once, so a
  // connection that gives out on the way back leaves the money spent at the mint
  // and the outputs nowhere: the blinding factors that would unblind them were
  // only ever in the memory of the call that sent the request.
  //
  // What makes it survivable is that the prepared swap is written to disk before
  // the request leaves, so both the exact request and the blinding factors
  // outlive the process. Replaying that request against a mint implementing
  // NUT-19 is answered from its cache with the signatures it produced the first
  // time.
  const s = (scenario = new Scenario({
    id: "W17",
    title: "lost swap response recovered from the persisted preview (NUT-19)",
    seed: 117,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  for (const d of devices) await d.walletReady();
  for (const d of devices) await d.addMint(mint.url);
  await alice.depositSats(500);

  const token = await alice.prepareSend(120);
  s.check("alice built a token to hand over", token !== null);
  if (token === null) {
    s.assert(false);
    return;
  }
  const handedOver = alice.reservedBalance();
  alice.confirmLastSend();

  // The network goes down for longer than cashu-ts will retry. That bound
  // matters: a single dropped response is already handled inside the library
  // against a NUT-19 mint, so an outage is the only thing that reaches the
  // wallet's own recovery.
  mint.setConditions({ swapResponseLost: true });
  const received = await bob.receiveTokenResult(token);

  s.check(
    "bob is told the mint could not be reached, not that it worked",
    received?.outcome === "stored",
    `outcome=${received?.outcome ?? "refused"}`,
  );
  s.check(
    "the mint really did take the inputs",
    mint.isSpent(getDecodedToken(token, []).proofs[0]?.secret ?? ""),
    "the first proof of the token is spent at the mint",
  );
  s.check(
    "nothing bob holds is presented as confirmed money",
    bob.unverifiedBalance() === bob.balance() && bob.balance() === handedOver,
    `balance=${bob.balance()} unverified=${bob.unverifiedBalance()}`,
  );
  // The bit that makes the rest possible. Without a preview on disk there is
  // nothing to replay and nothing that names the outputs the mint is holding.
  s.check(
    "and the swap is on disk, waiting to be replayed",
    bob.pendingSwapPreviews() === 1,
    `previews=${bob.pendingSwapPreviews()}`,
  );

  // The OS reclaims the process and bob opens the app again later. Everything
  // in memory is gone; only what was written survives.
  bob.relaunch();
  await bob.walletReady();
  mint.setConditions({ swapResponseLost: false });

  // Bob pulls to refresh before anything has reconciled, which is one tap away
  // on the Wallet screen. The mint will call these proofs spent, because they
  // are, and a refresh that acted on that would empty the balance seconds
  // before the replay refilled it.
  await bob.refreshWallet();
  s.check(
    "a refresh before the replay does not take the money away and give it back",
    bob.balance() === handedOver && bob.pendingSwapPreviews() === 1,
    `balance=${bob.balance()} previews=${bob.pendingSwapPreviews()}`,
  );

  await bob.reconcile();

  s.check(
    "the replay was answered from the mint's cache, not processed again",
    mint.cacheHits > 0,
    `cacheHits=${mint.cacheHits}`,
  );
  s.check(
    "the money came back, and as proofs the mint has confirmed",
    bob.balance() === handedOver && bob.unverifiedBalance() === 0,
    `balance=${bob.balance()} unverified=${bob.unverifiedBalance()} expected=${handedOver}`,
  );
  s.check(
    "nothing is left claiming to be in flight",
    bob.pendingSwapPreviews() === 0,
    `previews=${bob.pendingSwapPreviews()}`,
  );
  // The proofs bob now holds have to be the swap's OUTPUTS, not the burned
  // inputs he stored while the answer was in doubt. A balance made of spent
  // proofs looks identical until he tries to spend it, so ask the mint: the
  // NUT-07 pass inside a refresh drops anything it says is gone.
  await bob.refreshWallet();
  s.check(
    "and it is genuinely spendable, not a balance of proofs the mint burned",
    bob.balance() === handedOver,
    `balance after a state check=${bob.balance()}`,
  );
  s.check(
    "no sat was created or destroyed by any of it",
    alice.totalHeld() + bob.totalHeld() === 500,
    `alice=${alice.totalHeld()} bob=${bob.totalHeld()} issued=${mint.totalIssued}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W20 a mint that charges input fees is paid what it asks, and no more", async () => {
  // Every scenario before this one ran against a mint charging nothing, so the
  // wallet's fee arithmetic was written, reviewed, and never once exercised.
  // Real mints do charge: Nutshell's default is 100 parts per thousand per
  // input, which under NUT-02's round-the-total-up rule is a whole sat on any
  // spend of ten proofs or fewer.
  //
  // Two claims are on the line, and both are things the wallet says out loud.
  // The Send sheet promises "they receive N" while showing a larger figure
  // leaving the balance, which is only true if the sender covers the fee the
  // RECIPIENT will pay on their swap. And a melt has to be funded for the
  // invoice, the routing reserve and the input fee together, or the mint
  // refuses it a sat short after the user has already confirmed.
  const s = (scenario = new Scenario({
    id: "W20",
    title: "NUT-02 input fees priced into a send and funded on a melt",
    seed: 120,
  }));
  const mint = new MintFabric(s.world);
  // Before anybody adds the mint: the fee rides on the keyset, and the wallet
  // caches that to price sends with no signal.
  mint.setConditions({ inputFeePpk: 100, meltFeeReserve: 8, meltActualFee: 1 });
  mint.install();
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  for (const d of devices) await d.walletReady();
  for (const d of devices) await d.addMint(mint.url);
  await alice.depositSats(511);
  s.check(
    "a deposit costs nothing, because it spends no inputs",
    alice.balance() === 511 && mint.feesCollected === 0,
    `balance=${alice.balance()} fees=${mint.feesCollected}`,
  );

  const quote = await alice.sendQuote(100);
  s.check(
    "the quote says the mint will take a fee",
    (quote?.fee ?? 0) > 0,
    `fee=${String(quote?.fee)}`,
  );
  s.check(
    "and that what leaves the balance is the amount plus that fee",
    quote?.spend === (quote?.amount ?? 0) + (quote?.fee ?? 0),
    `spend=${String(quote?.spend)} amount=${String(quote?.amount)} fee=${String(quote?.fee)}`,
  );
  s.check(
    "priced offline, from the keyset the wallet cached when the mint was added",
    quote?.exact === true,
    `exact=${String(quote?.exact)}`,
  );

  const token = await alice.prepareSend(100);
  s.check("a token was built", token !== null);
  if (token === null) {
    s.assert(false);
    return;
  }
  const handedOver = alice.reservedBalance();
  const received = await bob.receiveToken(token);
  alice.confirmLastSend();

  s.check("bob redeemed it at the mint", received);
  // The claim the Send sheet makes. Bob asked for nothing and reads 100.
  s.check(
    "so 'send 100' really did mean 'they get 100'",
    bob.balance() === 100,
    `bob=${bob.balance()} alice handed over ${handedOver}`,
  );
  s.check(
    "the mint kept the fee bob's swap owed it",
    mint.feesCollected === handedOver - 100,
    `fees=${mint.feesCollected} handed over ${handedOver}`,
  );
  // Conservation, with the term that only exists once a mint charges. Nothing
  // was created or destroyed; the difference is not lost, it is the mint's.
  s.check(
    "and every sat is accounted for",
    alice.totalHeld() + bob.totalHeld() + mint.feesCollected === 511,
    `alice=${alice.totalHeld()} bob=${bob.totalHeld()} fees=${mint.feesCollected}`,
  );

  // The melt side. Getting this wrong is worse than a mispriced send, because
  // the refusal lands after the user has confirmed the payment.
  const feesBefore = mint.feesCollected;
  const heldBefore = alice.totalHeld();
  const withdrawn = await alice.withdraw(simInvoice(64));
  s.check(
    "a withdrawal funded for the fee as well as the invoice goes through",
    withdrawn?.paid === 64,
    `paid=${String(withdrawn?.paid)}`,
  );
  s.check(
    "the mint charged for the melt's own inputs too",
    mint.feesCollected > feesBefore,
    `fees=${mint.feesCollected} was ${feesBefore}`,
  );
  // 64 left over Lightning, 1 went to the route, and the rest of what the mint
  // took is fees. Anything else on either side is a sat invented or destroyed.
  s.check(
    "and the books still close across the mint, both phones and Lightning",
    alice.totalHeld() ===
      heldBefore - 64 - 1 - (mint.feesCollected - feesBefore),
    `held=${alice.totalHeld()} was ${heldBefore} fees charged=${mint.feesCollected - feesBefore}`,
  );
  s.check(
    "with nothing left reserved against a finished withdrawal",
    alice.reservedBalance() === 0,
    `reserved=${alice.reservedBalance()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W19 a withdrawal does not lock the whole balance while Lightning routes", async () => {
  // Cashu denominations are powers of two, so a balance straight out of a
  // deposit is coarse: 512 sats is one coin. Paying 100 of it means handing the
  // mint the whole 512 and waiting for 404 to come back as change, and a melt
  // can sit in routing for minutes.
  //
  // Nothing is lost by that - `prepareMelt` sizes the NUT-08 blanks from the
  // real overage, so the excess does return - but on this app "waiting" is
  // usually "waiting with no signal", and a user who walks out of range with
  // four fifths of their money locked behind a payment cannot hand anybody
  // ecash. That is the one thing the app exists for, so the selection is broken
  // up first and only what the payment needs is tied up.
  const s = (scenario = new Scenario({
    id: "W19",
    title: "an oversized melt selection is swapped down before it is reserved",
    seed: 119,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  // The melt is left hanging on purpose. A payment that settles immediately
  // never shows what was tied up, and the whole point is what the user can do
  // while it is still in flight.
  mint.setConditions({
    meltFeeReserve: 8,
    meltActualFee: 1,
    meltVanishes: true,
  });
  const { devices } = room(s, [android("alice", 11)]);
  const [alice] = devices;
  await alice.walletReady();
  await alice.addMint(mint.url);
  await alice.depositSats(512);
  s.check(
    "alice's balance is one coarse coin",
    alice.balance() === 512,
    `balance=${alice.balance()}`,
  );

  const result = await alice.withdraw(simInvoice(100));
  s.check("the withdrawal is still in flight", result === null);

  // 108 is the invoice plus the quoted routing reserve. Without the swap down
  // this reads 512: the entire balance, held against a 100 sat payment.
  s.check(
    "only what the payment needs is reserved",
    alice.reservedBalance() === 108,
    `reserved=${alice.reservedBalance()} (invoice 100 + reserve 8)`,
  );
  s.check(
    "and the rest is still spendable",
    alice.balance() === 404,
    `spendable=${alice.balance()}`,
  );
  s.check(
    "with nothing created or destroyed by breaking the coin up",
    alice.totalHeld() === 512,
    `held=${alice.totalHeld()}`,
  );

  // The part that matters: the remainder is usable in the dead zone, while the
  // payment is still unresolved and no mint can be reached.
  mint.setConditions({ offline: true });
  const token = await alice.prepareSend(16);
  s.check(
    "so ecash can still be handed over with no signal",
    token !== null,
    token === null ? "prepareSend refused" : "token built",
  );
  alice.reclaimLastSend();
  mint.setConditions({ offline: false });

  // And the payment itself still settles the way it always did.
  await alice.reconcile();
  s.check(
    "the withdrawal settles once the mint can be asked",
    alice.reservedBalance() === 0,
    `reserved=${alice.reservedBalance()}`,
  );
  s.check(
    "costing the invoice plus the fee the route really charged",
    alice.totalHeld() === 512 - 101,
    `held=${alice.totalHeld()} expected=${512 - 101}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("W18 a mint with no response cache still gives the outputs back", async () => {
  // NUT-19 is the fast path, not the guarantee. Plenty of mints do not cache,
  // and against one of those an identical replay is simply a second spend: the
  // inputs are gone and the request is refused.
  //
  // The backstop is NUT-09, used in a way a seed scan cannot manage. The exact
  // blinded messages are on the transaction, so the mint can be asked whether it
  // ever signed THESE, and a signature coming back is proof the swap completed
  // along with everything needed to unblind it. It does not depend on the
  // secrets having been derived from a phrase, because the blinding factors were
  // persisted rather than re-derived.
  const s = (scenario = new Scenario({
    id: "W18",
    title: "lost swap recovered by NUT-09 from a mint that does not cache",
    seed: 118,
  }));
  const mint = new MintFabric(s.world);
  mint.install();
  mint.setConditions({ nut19: false });
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  for (const d of devices) await d.walletReady();
  for (const d of devices) await d.addMint(mint.url);
  await alice.depositSats(500);

  const token = await alice.prepareSend(120);
  s.check("alice built a token to hand over", token !== null);
  if (token === null) {
    s.assert(false);
    return;
  }
  const handedOver = alice.reservedBalance();
  alice.confirmLastSend();

  mint.setConditions({ swapResponseLost: true });
  await bob.receiveTokenResult(token);
  s.check(
    "the swap is on disk after the answer went missing",
    bob.pendingSwapPreviews() === 1,
    `previews=${bob.pendingSwapPreviews()}`,
  );

  bob.relaunch();
  await bob.walletReady();
  mint.setConditions({ swapResponseLost: false });

  await bob.reconcile();

  s.check(
    "the mint never served a cached response, so the replay was refused",
    mint.cacheHits === 0,
    `cacheHits=${mint.cacheHits}`,
  );
  s.check(
    "and the outputs came back from NUT-09 instead",
    bob.balance() === handedOver && bob.unverifiedBalance() === 0,
    `balance=${bob.balance()} unverified=${bob.unverifiedBalance()} expected=${handedOver}`,
  );
  s.check(
    "nothing is left claiming to be in flight",
    bob.pendingSwapPreviews() === 0,
    `previews=${bob.pendingSwapPreviews()}`,
  );
  await bob.refreshWallet();
  s.check(
    "and what he holds is spendable, not the proofs the mint burned",
    bob.balance() === handedOver,
    `balance after a state check=${bob.balance()}`,
  );
  s.check(
    "no sat was created or destroyed by any of it",
    alice.totalHeld() + bob.totalHeld() === 500,
    `alice=${alice.totalHeld()} bob=${bob.totalHeld()} issued=${mint.totalIssued}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});
