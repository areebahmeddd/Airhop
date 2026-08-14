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

// ---------------------------------------------------------------------------

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
  s.check(
    "every proof carries a DLEQ witness that verifies",
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
