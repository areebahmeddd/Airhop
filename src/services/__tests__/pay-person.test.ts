/**
 * @jest-environment node
 */
// Which rail a payment takes, and how many times the money leaves the wallet.
//
// `payPerson` picks between the radio, a NIP-61 nutzap and an ordinary token,
// and the choice is not cosmetic: only the nutzap rail is final, and only the
// token rails reserve proofs that can be pulled back. Two rules matter more than
// the rest, because breaking either one costs the user real money:
//
//   1. Exactly one commitment per payment. The implementation this replaced
//      reserved a second set of proofs whenever the relay publish timed out,
//      because the timeout was not a WalletError and fell through to a path that
//      called prepareSend again. Send 500 with a flaky relay and 1000 left the
//      balance.
//   2. Once proofs are locked to the recipient, never fall back to another rail.
//      Locked proofs are theirs whatever happens next, so a fallback would pay
//      the same person twice and strand the first payment.
//
// The rest of these pin the rail choice itself, since "it went by radio" and
// "it is locked to their key forever" are the same tap to the user.

jest.mock("../../bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("../../bridge/NativeAirhopWiFi", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("../wallet-service", () => ({
  __esModule: true,
  WalletError: class WalletError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
  quoteSend: jest.fn(),
  prepareSend: jest.fn(),
  findNutzapTarget: jest.fn(),
  lockProofsForNutzap: jest.fn(),
  publishLockedNutzap: jest.fn(),
  settleNutzap: jest.fn(),
  failNutzapDelivery: jest.fn(),
  failSend: jest.fn(),
  reclaimSend: jest.fn(),
}));

jest.mock("../mesh-service", () => ({
  __esModule: true,
  getMeshService: jest.fn(),
}));

import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { payPerson } from "../ecash-transfer";
import { getMeshService } from "../mesh-service";
import {
  findNutzapTarget,
  lockProofsForNutzap,
  prepareSend,
  publishLockedNutzap,
  quoteSend,
  settleNutzap,
} from "../wallet-service";

const MINT = "https://mint.example.com";
const PEER = "aabbccdd00112233";
const PUBKEY = "ab".repeat(32);
const P2PK = "02" + "cd".repeat(32);
const THEIR_RELAY = "wss://relay.theirs.example";

const mockedMesh = getMeshService as jest.MockedFunction<typeof getMeshService>;
const mockedQuote = quoteSend as jest.MockedFunction<typeof quoteSend>;
const mockedPrepare = prepareSend as jest.MockedFunction<typeof prepareSend>;
const mockedFind = findNutzapTarget as jest.MockedFunction<
  typeof findNutzapTarget
>;
const mockedLock = lockProofsForNutzap as jest.MockedFunction<
  typeof lockProofsForNutzap
>;
const mockedPublish = publishLockedNutzap as jest.MockedFunction<
  typeof publishLockedNutzap
>;

// A mesh service that answers just enough for the payment ladder.
function fakeMesh(options: {
  directLink?: boolean;
  online?: boolean;
  route?: "sent" | "sent-nostr" | "needs-courier" | "queued";
  peerNostrPubkey?: string;
}) {
  return {
    hasDirectLink: jest.fn(() => options.directLink ?? false),
    getNostrClient: jest.fn(() => ((options.online ?? true) ? {} : null)),
    getNostrPrivKey: jest.fn(() => new Uint8Array(32)),
    getPeerNostrPubkey: jest.fn(() => options.peerNostrPubkey),
    getPeerID: jest.fn(() => "0011223344556677"),
    sendDm: jest.fn(() => options.route ?? "sent"),
  };
}

function useMesh(options: Parameters<typeof fakeMesh>[0]) {
  const mesh = fakeMesh(options);
  mockedMesh.mockReturnValue(mesh as never);
  return mesh;
}

beforeEach(() => {
  jest.clearAllMocks();
  useChatStore.getState().clearAll();
  useContactsStore.getState().clearAll();

  mockedQuote.mockResolvedValue({
    mintUrl: MINT,
    unit: "sat",
    amount: 500,
    spend: 500,
    fee: 0,
    exact: true,
    proofs: [],
  });
  mockedPrepare.mockResolvedValue({
    mintUrl: MINT,
    unit: "sat",
    amount: 500,
    spend: 500,
    fee: 0,
    exact: true,
    proofs: [],
    txId: "tx-token-1",
    token: "cashuBtoken",
  });
  mockedLock.mockResolvedValue({ locked: [], txId: "tx-nutzap-1" });
  mockedPublish.mockResolvedValue({ published: true, token: "cashuBlocked" });
  mockedFind.mockResolvedValue({
    ok: true,
    target: { mintUrl: MINT, p2pkPubkey: P2PK, relays: [THEIR_RELAY] },
  });
});

describe("payPerson rail choice", () => {
  it("uses the radio for a peer standing next to you, without asking a relay", async () => {
    useMesh({ directLink: true, peerNostrPubkey: PUBKEY, route: "sent" });

    const result = await payPerson({ peerID: PEER, amount: 500 });

    expect(result?.rail).toBe("mesh");
    expect(result?.final).toBe(false);
    // The whole point of the direct-link check: someone in front of you should
    // not wait on a mint round trip for a fancier instrument.
    expect(mockedFind).not.toHaveBeenCalled();
    expect(mockedLock).not.toHaveBeenCalled();
  });

  it("nutzaps a reachable Nostr identity when they have published how", async () => {
    useMesh({ directLink: false, peerNostrPubkey: PUBKEY });

    const result = await payPerson({ peerID: PEER, amount: 500 });

    expect(result?.rail).toBe("nutzap");
    expect(result?.final).toBe(true);
    // Locked proofs are not reserved proofs. Reserving as well would double the
    // cost of one payment.
    expect(mockedPrepare).not.toHaveBeenCalled();
  });

  it("publishes the nutzap to THEIR relays, not ours", async () => {
    useMesh({ directLink: false, peerNostrPubkey: PUBKEY });

    await payPerson({ peerID: PEER, amount: 500 });

    // NIP-61 sends a nutzap to the relays the recipient listed in their kind
    // 10019, and they subscribe to exactly that set. Publishing to our own pool
    // instead is invisible between two Airhop users, who share a default pool,
    // and silently loses the payment against any other NIP-61 wallet.
    expect(mockedPublish).toHaveBeenCalledWith(
      expect.objectContaining({ relays: [THEIR_RELAY] }),
    );
  });

  it("falls back to a token when they have published no nutzap info", async () => {
    useMesh({
      directLink: false,
      peerNostrPubkey: PUBKEY,
      route: "sent-nostr",
    });
    mockedFind.mockResolvedValue({ ok: false, reason: "they have not said" });

    const result = await payPerson({ peerID: PEER, amount: 500 });

    expect(result?.rail).toBe("nostr");
    expect(result?.final).toBe(false);
    expect(result?.fallbackReason).toBe("they have not said");
    expect(mockedPrepare).toHaveBeenCalledTimes(1);
  });

  it("takes the token rail when we know no Nostr key for them", async () => {
    useMesh({ directLink: false, route: "needs-courier" });

    const result = await payPerson({ peerID: PEER, amount: 500 });

    expect(result?.rail).toBe("courier");
    expect(mockedFind).not.toHaveBeenCalled();
  });

  it("hands the token back when nothing could carry it", async () => {
    useMesh({ directLink: false, route: "queued" });

    const result = await payPerson({ peerID: PEER, amount: 500 });

    expect(result?.rail).toBe("queued");
    // Without the string the user has a pending entry and no way to act on it.
    expect(result?.token).toBe("cashuBtoken");
  });

  it("refuses when the mesh service is not running, spending nothing", async () => {
    mockedMesh.mockReturnValue(null);

    const result = await payPerson({ peerID: PEER, amount: 500 });

    expect(result).toBeNull();
    expect(mockedPrepare).not.toHaveBeenCalled();
    expect(mockedLock).not.toHaveBeenCalled();
  });
});

describe("payPerson commits exactly once", () => {
  it("does not reserve a second set of proofs when the relay refuses", async () => {
    useMesh({
      directLink: false,
      peerNostrPubkey: PUBKEY,
      route: "sent-nostr",
    });
    mockedPublish.mockResolvedValue({
      published: false,
      token: "cashuBlocked",
    });

    const result = await payPerson({ peerID: PEER, amount: 500 });

    // The regression this file exists for. The locked proofs are already the
    // recipient's, so the only remaining job is delivery.
    expect(mockedLock).toHaveBeenCalledTimes(1);
    expect(mockedPrepare).not.toHaveBeenCalled();
    expect(result?.rail).toBe("nutzap-dm");
    expect(result?.final).toBe(true);
    expect(settleNutzap).toHaveBeenCalledWith("tx-nutzap-1");
  });

  it("keeps a refused nutzap final even when no route carried it either", async () => {
    useMesh({ directLink: false, peerNostrPubkey: PUBKEY, route: "queued" });
    mockedPublish.mockResolvedValue({
      published: false,
      token: "cashuBlocked",
    });

    const result = await payPerson({ peerID: PEER, amount: 500 });

    // Its own rail, not "nutzap-dm": nothing was delivered to them, so copy
    // saying a message went out would be a lie about where their money is.
    expect(result?.rail).toBe("nutzap-undelivered");
    expect(result?.final).toBe(true);
    expect(result?.token).toBe("cashuBlocked");
    expect(settleNutzap).not.toHaveBeenCalled();
    expect(mockedPrepare).not.toHaveBeenCalled();
  });

  it("falls through to a token when the lock itself failed, reserving once", async () => {
    useMesh({
      directLink: false,
      peerNostrPubkey: PUBKEY,
      route: "sent-nostr",
    });
    mockedLock.mockRejectedValue(new Error("mint unreachable"));

    const result = await payPerson({ peerID: PEER, amount: 500 });

    // A failed lock spends nothing, because the mint's swap is atomic, so a
    // lesser rail is safe here and only here.
    expect(result?.rail).toBe("nostr");
    expect(result?.final).toBe(false);
    expect(mockedPrepare).toHaveBeenCalledTimes(1);
  });
});

describe("payPerson identity resolution", () => {
  it("pays a known contact under the peer ID their thread is keyed by", async () => {
    const mesh = useMesh({ directLink: false, route: "sent-nostr" });
    mockedFind.mockResolvedValue({ ok: false, reason: "no info" });
    useContactsStore.getState().addContact({
      peerID: PEER,
      nickname: "swift-falcon-aabb",
      noisePubKeyHex: "ff".repeat(32),
      signingPubKeyHex: "ee".repeat(32),
      addedAtMs: 1_700_000_000_000,
      source: "qr",
      nostrPubkeyHex: PUBKEY,
    });

    // The Wallet tab's Zap only ever holds a public key.
    await payPerson({ nostrPubkey: PUBKEY, amount: 500 });

    // Not `nostr_<pubkey>`: paying someone you already have a conversation with
    // must land in that conversation, not open a second one with the same
    // person under a different name.
    expect(mesh.sendDm).toHaveBeenCalledWith(
      PEER,
      "cashuBtoken",
      expect.any(String),
    );
    expect(useChatStore.getState().messages[`dm:${PEER}`]).toHaveLength(1);
  });

  it("uses a nostr_ id for a key that belongs to nobody we know", async () => {
    const mesh = useMesh({ directLink: false, route: "sent-nostr" });
    mockedFind.mockResolvedValue({ ok: false, reason: "no info" });

    await payPerson({ nostrPubkey: PUBKEY, amount: 500 });

    expect(mesh.sendDm).toHaveBeenCalledWith(
      `nostr_${PUBKEY}`,
      "cashuBtoken",
      expect.any(String),
    );
  });

  it("reads the key out of a nostr_ peer id, so a DM thread can nutzap", async () => {
    useMesh({ directLink: false });

    const result = await payPerson({
      peerID: `nostr_${PUBKEY}`,
      amount: 500,
    });

    expect(mockedFind).toHaveBeenCalledWith(
      expect.objectContaining({ recipientPubkey: PUBKEY }),
    );
    expect(result?.rail).toBe("nutzap");
  });

  it("notes a nutzap in the thread it was sent from", async () => {
    useMesh({ directLink: false, peerNostrPubkey: PUBKEY });
    const channel = `dm:${PEER}`;
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: "m1",
      channel,
      senderID: PEER,
      senderNickname: "them",
      text: "hi",
      timestampMs: 1_700_000_000_000,
      isMine: false,
    });

    await payPerson({ peerID: PEER, amount: 500 });

    // Nothing is transmitted by a nutzap, so this is a local notice rather than
    // a bubble. Without it, paying from a thread left the thread empty.
    const notes = useChatStore
      .getState()
      .messages[channel].filter((m) => m.isSystem);
    expect(notes).toHaveLength(1);
  });

  it("does not open a thread with a stranger just to record a zap", async () => {
    useMesh({ directLink: false });

    await payPerson({ nostrPubkey: PUBKEY, amount: 500 });

    // A one-off zap from the Wallet tab belongs in wallet history, not in a
    // conversation the user never started.
    expect(
      useChatStore.getState().messages[`dm:nostr_${PUBKEY}`],
    ).toBeUndefined();
  });

  it("refuses a payment addressed to nobody", async () => {
    useMesh({ directLink: false });

    expect(await payPerson({ amount: 500 })).toBeNull();
    expect(mockedPrepare).not.toHaveBeenCalled();
  });
});
