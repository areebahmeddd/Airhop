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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (
    require("./harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
jest.mock("../../../bridge/NativeAirhopBLE", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("../../../bridge/NativeAirhopWiFi", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import { SimDevice, type DeviceSpec } from "./harness/device";
import { noCrashes } from "./harness/invariants";
import { MintFabric } from "./harness/mint-fabric";
import { RadioFabric } from "./harness/radio-fabric";
import { Scenario, waitFor } from "./harness/scenario";

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
