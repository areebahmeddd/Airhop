/**
 * @jest-environment node
 */
// Blocking must mean the same thing in a location channel as on the mesh.
//
// On BLE it already did: `routePacket` drops every non-ANNOUNCE packet from a
// blocked sender at one chokepoint. Nothing equivalent existed on the Nostr
// side, so a blocked person kept posting into #city, kept counting toward the
// participant total, and could still open a geo DM.
//
// Three ingress points carry a stranger's words into a location channel, each
// pinned below with a control case beside it so a pass cannot just mean
// "nothing arrived at all":
//
//   1. the live relay subscription  (the ordinary path)
//   2. `ingestCarriedEvent`         (a mesh gateway ferrying the same event)
//   3. the per-cell DM inbox        (a blocked person opening a thread)
//
// Plus the read-time guard for blocking somebody already in the participant
// map: rows live for minutes, and a block should take effect when tapped.

import { encodeBitchatDmEnvelope } from "@core/nostr/bitchat-envelope";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
  type GeohashIdentity,
} from "@core/nostr/geohash-identity";
import { wrapDm } from "@core/nostr/gift-wrap";
import type { NostrClient } from "@core/nostr/nostr-client";
import { ed25519 } from "@noble/curves/ed25519.js";
import { useBlockedStore } from "@store/blocked-store";
import { useChatStore } from "@store/chat-store";
import { finalizeEvent, type Event as NostrEvent } from "nostr-tools";
import { GeohashChannelService } from "../geohash-channel-service";

jest.mock("expo-location", () => ({}));
jest.mock("../location-service", () => ({
  getCoarseLocation: async () => null,
}));

const GEOHASH = "u4pruy";
const CHANNEL = `geohash:${GEOHASH}`;

type EventHandler = (event: NostrEvent) => void;

interface Harness {
  service: GeohashChannelService;
  // The handler the channel subscription registered (kinds 20000/20001).
  emitChannelEvent: (event: NostrEvent) => void;
  // The handler the per-cell DM inbox registered (kind 1059 gift wraps).
  emitDmEvent: (event: NostrEvent) => void;
  // The device's own per-cell identity, derived the same way the service
  // derives it internally, so a test can address a wrap to this device.
  inbox: GeohashIdentity;
}

// A teleported channel is used throughout: it carries a fixed geohash, so the
// service subscribes with no location fix and the test needs no GPS mocking.
async function harness(): Promise<Harness> {
  const handlers: { kinds: number[]; onEvent: EventHandler }[] = [];

  const client = {
    subscribe: (
      filters: { kinds: number[] }[],
      onEvent: EventHandler,
    ): { close: () => void } => {
      handlers.push({ kinds: filters[0]?.kinds ?? [], onEvent });
      return { close: () => undefined };
    },
    publish: async () => ({ relay: "", ok: true }),
  } as unknown as NostrClient;

  const signingKey = ed25519.utils.randomSecretKey();
  const service = new GeohashChannelService(
    client,
    signingKey,
    "me",
    "aabbccdd00112233",
  );

  useChatStore.getState().addChannel(CHANNEL);
  await service.refresh();

  const pick = (kind: number): EventHandler => {
    const found = handlers.find((h) => h.kinds.includes(kind));
    if (found === undefined) {
      throw new Error(`no subscription registered for kind ${kind}`);
    }
    return found.onEvent;
  };

  return {
    service,
    emitChannelEvent: pick(20000),
    emitDmEvent: pick(1059),
    inbox: deriveGeohashIdentity(deriveGeohashSeed(signingKey), GEOHASH),
  };
}

// A stranger in the cell: their own per-cell identity, derived exactly as a
// real peer's would be, so the pubkey the service sees is a real one.
function stranger(): GeohashIdentity {
  return deriveGeohashIdentity(
    deriveGeohashSeed(ed25519.utils.randomSecretKey()),
    GEOHASH,
  );
}

function channelEvent(from: GeohashIdentity, text: string): NostrEvent {
  return finalizeEvent(
    {
      kind: 20000,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["g", GEOHASH],
        ["n", "stranger"],
      ],
      content: text,
    },
    from.privKey,
  );
}

function block(identity: GeohashIdentity): void {
  useBlockedStore.getState().blockPeer(`nostr_${identity.pubKeyHex}`);
}

function messagesIn(channel: string): string[] {
  return (useChatStore.getState().messages[channel] ?? []).map((m) => m.text);
}

beforeEach(() => {
  useChatStore.getState().clearAll();
  for (const id of [...useBlockedStore.getState().blockedPeerIDs]) {
    useBlockedStore.getState().unblockPeer(id);
  }
});

describe("a blocked person in a location channel", () => {
  it("cannot post into the channel over the relay subscription", async () => {
    const h = await harness();
    const muted = stranger();
    block(muted);

    h.emitChannelEvent(channelEvent(muted, "you can still hear me"));

    expect(messagesIn(CHANNEL)).toEqual([]);
    expect(h.service.participantsFor(CHANNEL)).toEqual([]);
  });

  it("still lets everyone else post (the control)", async () => {
    const h = await harness();
    const muted = stranger();
    const other = stranger();
    block(muted);

    h.emitChannelEvent(channelEvent(muted, "blocked"));
    h.emitChannelEvent(channelEvent(other, "allowed"));

    // Only the unblocked message renders, and only its author is counted. A
    // count that included the blocked person would be the #1637 bug: the row
    // is hidden but the headcount still says somebody is there.
    expect(messagesIn(CHANNEL)).toEqual(["allowed"]);
    const people = h.service.participantsFor(CHANNEL);
    expect(people.map((p) => p.pubkey)).toEqual([other.pubKeyHex]);
  });

  it("cannot reach the channel through a mesh gateway either", async () => {
    const h = await harness();
    const muted = stranger();
    const other = stranger();
    block(muted);

    // Same events, ferried in over BLE by a nearby gateway instead of arriving
    // from a relay. A block that only covered the relay path would leave this
    // one open for anybody standing next to a gateway.
    h.service.ingestCarriedEvent(channelEvent(muted, "ferried in"));
    h.service.ingestCarriedEvent(channelEvent(other, "ferried too"));

    expect(messagesIn(CHANNEL)).toEqual(["ferried too"]);
  });

  it("cannot open a geo DM thread", async () => {
    const h = await harness();
    const muted = stranger();
    block(muted);

    // Addressed to this device's own per-cell identity, so the wrap really
    // opens and the block is what stops it, not a failed decrypt.
    const inbox = h.inbox;
    const envelope = encodeBitchatDmEnvelope(
      "0011223344556677",
      null,
      "m-1",
      "let me back in",
    )!;
    h.emitDmEvent(wrapDm(envelope, muted.privKey, inbox.pubKeyHex).event);

    // No thread created, so the block cannot be undone by the blocked party
    // simply messaging again.
    expect(useChatStore.getState().channels).not.toContain(
      `dm:nostr_${muted.pubKeyHex}`,
    );
  });

  it("disappears from the participant list the moment they are blocked", async () => {
    const h = await harness();
    const noisy = stranger();

    h.emitChannelEvent(channelEvent(noisy, "hello"));
    expect(h.service.participantsFor(CHANNEL)).toHaveLength(1);

    // Blocking is an action taken about somebody already in the room. Their
    // participant row lives for minutes, and waiting it out would mean the
    // block visibly does nothing for the first several minutes.
    block(noisy);
    expect(h.service.participantsFor(CHANNEL)).toEqual([]);
  });
});
