/**
 * @jest-environment node
 */
// Reclaiming an ecash send has to cancel every copy of it, not just move proofs.
//
// A token send is three things at once: reserved proofs in the wallet, a message
// in a DM thread, and, when it found no route, an entry in the outbox. The outbox
// is a promise to deliver: `flushOutbox` sends what is in it as soon as a route
// appears. Leaving the entry there put the proofs back in the spendable balance
// while the mesh still held a copy to hand over, so the next route to appear
// delivered a token the sender had already taken back.
//
// These tests pin that invariant, and the DM's own state alongside it, since a
// bubble stuck on "Sending" is what the user sees go wrong.

// ecash-transfer pulls in mesh-service, which resolves the native BLE and Wi-Fi
// TurboModules at import time. Nothing here starts the mesh, so bare stubs are
// enough to get the module graph to load under Node.
jest.mock("../../bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("../../bridge/NativeAirhopWiFi", () => ({
  __esModule: true,
  default: {},
}));

import { useChatStore, type ChatMessage } from "../../store/chat-store";
import { useOutboxStore } from "../../store/outbox-store";
import {
  useWalletStore,
  type StoredProof,
  type WalletTx,
} from "../../store/wallet-store";
import { reclaimTokenSend } from "../ecash-transfer";

const MINT = "https://mint.example.com";
const PEER = "aabbccdd00112233";
const TX = "tx-reclaim-1";

function makeProof(amount: number): StoredProof {
  return {
    id: "00ad268c4d1f5826",
    amount,
    secret: `secret-${String(amount)}`,
    C: "02" + "ab".repeat(32),
  };
}

function makeTx(overrides: Partial<WalletTx> = {}): WalletTx {
  return {
    id: TX,
    kind: "send",
    status: "pending",
    amount: 100,
    unit: "sat",
    mintUrl: MINT,
    createdAtMs: 1_700_000_000_000,
    updatedAtMs: 1_700_000_000_000,
    counterparty: PEER,
    token: "cashuBsomething",
    ...overrides,
  };
}

// A send that found no route, in the state the app leaves it in: proofs
// reserved, a pending transaction, a "queued" bubble, and an outbox entry.
function seedQueuedSend(overrides: Partial<WalletTx> = {}): void {
  const wallet = useWalletStore.getState();
  wallet.addProofs(MINT, "sat", [makeProof(100)]);
  wallet.reserveProofs(TX, MINT, "sat", [makeProof(100)]);
  wallet.addTx(makeTx(overrides));

  const message: ChatMessage = {
    id: TX,
    channel: `dm:${PEER}`,
    senderID: "0011223344556677",
    senderNickname: "me",
    text: "cashuBsomething",
    timestampMs: 1_700_000_000_000,
    isMine: true,
    status: "queued",
  };
  useChatStore.getState().addChannel(`dm:${PEER}`);
  useChatStore.getState().addMessage(message);

  useOutboxStore.getState().enqueue({
    id: TX,
    recipientPeerID: PEER,
    channel: `dm:${PEER}`,
    text: "cashuBsomething",
    createdAtMs: 1_700_000_000_000,
  });
}

beforeEach(() => {
  useWalletStore.getState().clearAll();
  useChatStore.getState().clearAll();
  useOutboxStore.getState().clearAll();
});

describe("reclaimTokenSend", () => {
  it("drops the outbox entry, so the reclaimed token can never be delivered", () => {
    seedQueuedSend();
    expect(useOutboxStore.getState().forPeer(PEER)).toHaveLength(1);

    expect(reclaimTokenSend(TX)).toBe(true);

    expect(useOutboxStore.getState().forPeer(PEER)).toHaveLength(0);
  });

  it("puts the proofs back and marks the transaction reclaimed", () => {
    seedQueuedSend();

    reclaimTokenSend(TX);

    expect(useWalletStore.getState().reserved[TX]).toBeUndefined();
    expect(
      useWalletStore.getState().history.find((tx) => tx.id === TX)?.status,
    ).toBe("reclaimed");
  });

  it("marks the DM so the bubble stops claiming it is still sending", () => {
    seedQueuedSend();

    reclaimTokenSend(TX);

    expect(useChatStore.getState().messages[`dm:${PEER}`][0].status).toBe(
      "reclaimed",
    );
  });

  it("leaves everything alone when there is nothing reserved to reclaim", () => {
    useWalletStore.getState().addTx(makeTx({ status: "completed" }));
    useOutboxStore.getState().enqueue({
      id: TX,
      recipientPeerID: PEER,
      channel: `dm:${PEER}`,
      text: "cashuBsomething",
      createdAtMs: 1_700_000_000_000,
    });

    expect(reclaimTokenSend(TX)).toBe(false);

    // The queue entry survives: a completed send is not ours to cancel.
    expect(useOutboxStore.getState().forPeer(PEER)).toHaveLength(1);
    expect(
      useWalletStore.getState().history.find((tx) => tx.id === TX)?.status,
    ).toBe("completed");
  });

  it("handles a token that was never addressed to a peer", () => {
    seedQueuedSend({ counterparty: undefined });

    expect(reclaimTokenSend(TX)).toBe(true);
    expect(useOutboxStore.getState().forPeer(PEER)).toHaveLength(0);
  });
});
