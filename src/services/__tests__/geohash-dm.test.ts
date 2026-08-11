/**
 * @jest-environment node
 */
// Geohash DM: a message sent from one per-cell identity is gift-wrapped so only
// the recipient's per-cell identity can open it, wrapped in a bitchat1 envelope.
import { ed25519 } from "@noble/curves/ed25519.js";
import { NoisePayloadType } from "../../core/mesh/noise-payload";
import { decodeBitchatEnvelope } from "../../core/nostr/bitchat-envelope";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
} from "../../core/nostr/geohash-identity";
import { unwrapDm } from "../../core/nostr/gift-wrap";
import type { NostrClient } from "../../core/nostr/nostr-client";
import { useChatStore } from "../../store/chat-store";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { resolveDisplayName } from "../../utils/display-name";
import { GeohashChannelService } from "../geohash-channel-service";

jest.mock("expo-location", () => ({}));

// The position the service resolves cells from. Driven per test so "we have no
// idea where we are" and "we are definitely somewhere else" stay distinguishable
// - which is the whole point of the signal under test.
let mockCoords: { lat: number; lng: number } | null = null;

jest.mock("../location-service", () => ({
  getCoarseLocation: () => Promise.resolve(mockCoords),
  clearLocationCache: () => undefined,
}));

function mockClient(
  published: { content: string; pubkey: string }[],
): NostrClient {
  return {
    subscribe: () => ({ close: () => undefined }),
    publish: async (event: { content: string; pubkey: string }) => {
      published.push(event);
      return { relay: "", ok: true };
    },
  } as unknown as NostrClient;
}

describe("geohash DM", () => {
  const GEOHASH = "u4pruy";

  it("sends an E2E DM only the recipient's per-cell identity can open", () => {
    const published: { content: string; pubkey: string }[] = [];
    const senderSigning = ed25519.utils.randomSecretKey();
    const service = new GeohashChannelService(
      mockClient(published),
      senderSigning,
      "alice",
      "aabbccdd00112233",
    );

    // The recipient's per-cell identity (a different device/seed).
    const recipIdentity = deriveGeohashIdentity(
      deriveGeohashSeed(ed25519.utils.randomSecretKey()),
      GEOHASH,
    );

    const ok = service.sendGeoDm(
      GEOHASH,
      recipIdentity.pubKeyHex,
      "gm-1",
      "meet at the plaza",
    );
    expect(ok).toBe(true);
    // Registered so a reply routes back through this cell.
    expect(service.geohashForGeoDmPeer(recipIdentity.pubKeyHex)).toBe(GEOHASH);

    // The recipient unwraps with their per-cell key and decodes the envelope.
    expect(published).toHaveLength(1);
    const dm = unwrapDm(
      published[0] as never,
      recipIdentity.privKey,
      Number.POSITIVE_INFINITY,
    );
    const env = decodeBitchatEnvelope(dm.content)!;
    expect(env.messageID).toBe("gm-1");
    expect(env.content).toBe("meet at the plaza");
  });

  it("returns false for content over the PrivateMessagePacket cap", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "bob",
      "1122334455667788",
    );
    expect(
      service.sendGeoDm(GEOHASH, "aa".repeat(32), "m", "x".repeat(256)),
    ).toBe(false);
  });
});

// Which identity a reply is written from, and whether that survives a relaunch.
//
// The binding from a location-channel peer to the cell we met them in used to
// live in a Map on the service, so it was gone after a restart. Opening such a
// thread from the Direct list and sending then fell through to the caller's
// MAIN Nostr identity: the recipient saw a message from a key they had never
// seen (a second thread, not a reply), and a person we had only ever met
// pseudonymously in a location channel was handed our permanent identity.
//
// It now lives in chat-store, which is persisted, so these pin both halves: the
// binding outlives the service, and its absence still means "not a geohash DM".
describe("the geo-DM cell binding", () => {
  const GEOHASH = "u4pruy";
  const PEER = "bb".repeat(32);

  beforeEach(() => {
    useChatStore.getState().clearAll();
  });

  it("survives the service being rebuilt, as a relaunch rebuilds it", () => {
    const signing = ed25519.utils.randomSecretKey();
    const first = new GeohashChannelService(
      mockClient([]),
      signing,
      "alice",
      "aabbccdd00112233",
    );
    first.registerGeoDmPeer(PEER, GEOHASH);

    // A new process: same stores, a brand-new service instance.
    const relaunched = new GeohashChannelService(
      mockClient([]),
      signing,
      "alice",
      "aabbccdd00112233",
    );
    expect(relaunched.geohashForGeoDmPeer(PEER)).toBe(GEOHASH);
  });

  // The absence of a binding is meaningful, not merely unknown: it says this
  // person reached our durable identity, and replying from it is correct.
  it("stays undefined for a peer we never met in a cell", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    expect(service.geohashForGeoDmPeer("cc".repeat(32))).toBeUndefined();
  });

  // A binding is a record of where we were when we spoke to someone. Deleting
  // the conversation has to take it with it.
  it("is dropped when the conversation is deleted", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    service.registerGeoDmPeer(PEER, GEOHASH);
    useChatStore.getState().removeChannel(`dm:nostr_${PEER}`);
    expect(service.geohashForGeoDmPeer(PEER)).toBeUndefined();
  });

  it("is destroyed with everything else on a wipe", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    service.registerGeoDmPeer(PEER, GEOHASH);
    useChatStore.getState().clearAll();
    expect(service.geohashForGeoDmPeer(PEER)).toBeUndefined();
  });
});

// Which cells we are still listening in, which is what lets a conversation say
// it has been left behind rather than just going quiet.
//
// The per-cell DM inbox exists per SUBSCRIBED channel. Sending survives moving
// away (the key is derived from the cell, not from where you stand); receiving
// does not. A thread compares its own cell against this list to say so.
describe("the live-cell signal", () => {
  beforeEach(() => {
    useChatStore.getState().clearAll();
    useMeshStateStore.setState({ liveGeoCells: null });
    mockCoords = null;
  });

  // Null, not the empty list. With no fix, "not listening there" and "no idea
  // where we are" are the same observation, and only one of them is worth
  // telling someone their conversation has moved on from.
  it("says nothing at all when there is no position fix", async () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    await service.refresh();
    expect(useMeshStateStore.getState().liveGeoCells).toBeNull();
  });

  it("lists the cell whose inbox is open once a position resolves", async () => {
    mockCoords = { lat: 48.8584, lng: 2.2945 };
    useChatStore.setState({ channels: ["#city"] });
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    await service.refresh();

    const live = useMeshStateStore.getState().liveGeoCells;
    expect(live).toEqual([service.geohashFor("#city")]);
    // Which is exactly what makes a conversation from anywhere else legible as
    // left behind rather than merely quiet.
    expect(live).not.toContain("gbsuv");

    // A resolved cell starts the presence heartbeat, which reschedules itself
    // forever. Left running it keeps the whole suite's event loop alive.
    service.stop();
  });

  // A stopped mesh is not listening anywhere, but it also cannot say where it
  // would be. An empty list would tell every location thread it had been left.
  it("goes back to saying nothing when the mesh stops", async () => {
    mockCoords = { lat: 48.8584, lng: 2.2945 };
    useChatStore.setState({ channels: ["#city"] });
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    await service.refresh();
    expect(useMeshStateStore.getState().liveGeoCells).not.toBeNull();

    service.stop();
    expect(useMeshStateStore.getState().liveGeoCells).toBeNull();
  });
});

// Keeping someone met under a location pseudonym.
//
// Their cell key and our peer ID are unlinkable by design - that is what stops
// relays following anyone between neighbourhoods - so nothing but the person
// choosing to say "this is also me" can ever join the two. These pin the wire
// half of that choice: the card goes out gift-wrapped from our PER-CELL key, so
// a relay learns nothing new, and it arrives as a card rather than a message.
describe("handing over a contact card in a location channel", () => {
  const GEOHASH = "u4pruy";

  beforeEach(() => {
    useChatStore.getState().clearAll();
  });

  it("reaches only the recipient's per-cell identity, and reads back as a card", () => {
    const published: { content: string; pubkey: string }[] = [];
    const service = new GeohashChannelService(
      mockClient(published),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    const recipient = deriveGeohashIdentity(
      deriveGeohashSeed(ed25519.utils.randomSecretKey()),
      GEOHASH,
    );
    const card = new Uint8Array(120).fill(7);

    service.sendContactCard(GEOHASH, recipient.pubKeyHex, card);

    expect(published).toHaveLength(1);
    const dm = unwrapDm(
      published[0] as never,
      recipient.privKey,
      Number.POSITIVE_INFINITY,
    );
    const env = decodeBitchatEnvelope(dm.content)!;
    expect(env.type).toBe(NoisePayloadType.CONTACT_CARD);
    expect(Array.from(env.body!)).toEqual(Array.from(card));
    // Not a message: no id, so it gets no bubble and no receipt.
    expect(env.messageID).toBe("");
    expect(env.content).toBe("");
  });

  // The envelope stays pseudonymous. What discloses us is the card INSIDE it,
  // which is the thing the user actually chose to hand over.
  it("is written from our per-cell key, not our durable identity", () => {
    const published: { content: string; pubkey: string }[] = [];
    const signing = ed25519.utils.randomSecretKey();
    const service = new GeohashChannelService(
      mockClient(published),
      signing,
      "alice",
      "aabbccdd00112233",
    );
    const recipient = deriveGeohashIdentity(
      deriveGeohashSeed(ed25519.utils.randomSecretKey()),
      GEOHASH,
    );
    service.sendContactCard(GEOHASH, recipient.pubKeyHex, new Uint8Array(80));

    // A gift wrap is signed by a throwaway key, so the check that matters is
    // that our durable identity is nowhere in the event.
    const ourCellKey = deriveGeohashIdentity(
      deriveGeohashSeed(signing),
      GEOHASH,
    ).pubKeyHex;
    expect(published[0].pubkey).not.toBe(ourCellKey);
    expect(JSON.stringify(published[0])).not.toContain(ourCellKey);
  });

  // Sending one binds the cell, exactly as sending a message does, so a reply
  // routes back through the same pseudonymous channel.
  it("binds the cell so the conversation keeps working", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    const recipient = deriveGeohashIdentity(
      deriveGeohashSeed(ed25519.utils.randomSecretKey()),
      GEOHASH,
    );
    service.sendContactCard(GEOHASH, recipient.pubKeyHex, new Uint8Array(80));
    expect(service.geohashForGeoDmPeer(recipient.pubKeyHex)).toBe(GEOHASH);
  });
});

// The exchange only counts when both cards have crossed.
//
// Merging is what moves replies off the pseudonymous per-cell rail onto the
// durable one, and the durable inbox files a message by the Nostr key it came
// from. Until the other side holds our card they cannot know that key is us, so
// crossing over early lands our messages in a second, unattributed thread on
// their side - the exact split this feature exists to heal.
//
// These pin the state machine directly on the store, which is where both halves
// are recorded and where the merge decision reads them from.
describe("the contact-card exchange state", () => {
  const PEER_CELL_KEY = "dd".repeat(32);
  const THEIR_PEER_ID = "1122334455667788";

  beforeEach(() => {
    useChatStore.getState().clearAll();
  });

  it("records each half independently", () => {
    const chat = useChatStore.getState();
    chat.noteGeoCardExchange(PEER_CELL_KEY, { sentMine: true });
    expect(useChatStore.getState().geoCardExchange[PEER_CELL_KEY]).toEqual({
      sentMine: true,
    });

    chat.noteGeoCardExchange(PEER_CELL_KEY, { theirPeerID: THEIR_PEER_ID });
    // Merged, not replaced: recording one half must never forget the other,
    // whichever order they arrive in.
    expect(useChatStore.getState().geoCardExchange[PEER_CELL_KEY]).toEqual({
      sentMine: true,
      theirPeerID: THEIR_PEER_ID,
    });
  });

  it("records the halves the other way round just as well", () => {
    const chat = useChatStore.getState();
    chat.noteGeoCardExchange(PEER_CELL_KEY, { theirPeerID: THEIR_PEER_ID });
    chat.noteGeoCardExchange(PEER_CELL_KEY, { sentMine: true });
    expect(useChatStore.getState().geoCardExchange[PEER_CELL_KEY]).toEqual({
      sentMine: true,
      theirPeerID: THEIR_PEER_ID,
    });
  });

  // Completing the exchange takes the bookkeeping AND the cell with it: once the
  // conversation is durable, where we happened to meet is a location breadcrumb
  // with nothing left to do.
  it("drops the cell binding along with the bookkeeping when it completes", () => {
    const chat = useChatStore.getState();
    chat.setGeoDmCell(PEER_CELL_KEY, "u4pruy");
    chat.noteGeoCardExchange(PEER_CELL_KEY, { sentMine: true });

    chat.clearGeoCardExchange(PEER_CELL_KEY);

    const after = useChatStore.getState();
    expect(after.geoCardExchange[PEER_CELL_KEY]).toBeUndefined();
    expect(after.geoDmCells[PEER_CELL_KEY]).toBeUndefined();
  });

  // A half-finished exchange is exactly the state that must survive a delete,
  // since the conversation it belongs to is gone.
  it("is dropped when the conversation is deleted", () => {
    const chat = useChatStore.getState();
    chat.noteGeoCardExchange(PEER_CELL_KEY, { sentMine: true });
    chat.removeChannel(`dm:nostr_${PEER_CELL_KEY}`);
    expect(
      useChatStore.getState().geoCardExchange[PEER_CELL_KEY],
    ).toBeUndefined();
  });

  it("is destroyed with everything else on a wipe", () => {
    useChatStore
      .getState()
      .noteGeoCardExchange(PEER_CELL_KEY, { theirPeerID: THEIR_PEER_ID });
    useChatStore.getState().clearAll();
    expect(
      useChatStore.getState().geoCardExchange[PEER_CELL_KEY],
    ).toBeUndefined();
  });
});

// The window between one side merging and the other finding out.
//
// Our card takes a relay round trip to reach them, so for a few seconds after we
// fold the threads together they are still writing on the pseudonymous rail. A
// message arriving then is addressed to a name that has become an alias, and
// filing it there would put it in a thread the user can no longer open - a
// message that is received, stored, and invisible.
describe("messages arriving after a merge", () => {
  const CELL_KEY = "ee".repeat(32);
  const THEIR_PEER_ID = "99887766554433aa";

  beforeEach(() => {
    useChatStore.getState().clearAll();
  });

  it("follows the merge instead of landing in the folded-away thread", () => {
    const chat = useChatStore.getState();
    const from = `dm:nostr_${CELL_KEY}`;
    const to = `dm:${THEIR_PEER_ID}`;
    chat.addChannel(from);
    chat.addChannel(to);
    chat.mergeChannel(from, to);

    // What handleGeoDm now does with a late arrival on the old rail.
    expect(useChatStore.getState().resolveChannel(from)).toBe(to);

    useChatStore.getState().addMessage({
      id: "late-1",
      channel: useChatStore.getState().resolveChannel(from),
      senderID: `nostr_${CELL_KEY}`,
      senderNickname: "them",
      text: "still on the old rail",
      timestampMs: Date.now(),
      isMine: false,
    });

    const after = useChatStore.getState();
    expect(after.messages[to]?.map((m) => m.id)).toContain("late-1");
    // And nothing was stranded where the user cannot reach it.
    expect(after.messages[from] ?? []).toHaveLength(0);
  });

  // Identity for anything never merged, so the same call is safe on every
  // ordinary geo DM.
  it("leaves an unmerged conversation exactly where it is", () => {
    const from = `dm:nostr_${CELL_KEY}`;
    expect(useChatStore.getState().resolveChannel(from)).toBe(from);
  });
});

// One person, one name, wherever their conversation appears.
//
// A geohash nickname rides the `n` tag on CHANNEL messages and nothing else - a
// geo DM carries none - so the pubkey alone can only ever produce "anon#last4".
// The channel showed "NeverDie#0c08" and every other surface showed
// "anon#0c08": same person, two names, because the name was only ever on the
// message rather than anywhere a conversation could reach.
describe("carrying a location peer's name out of the channel", () => {
  const GEOHASH = "u4pruy";
  const PUBKEY = `${"ab".repeat(31)}0c08`;

  beforeEach(() => {
    useChatStore.getState().clearAll();
  });

  it("falls back to the anonymous label when nobody has supplied a name", () => {
    expect(resolveDisplayName(`nostr_${PUBKEY}`)).toBe("anon#0c08");
  });

  it("uses the name the channel rendered once a conversation opens", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    service.registerGeoDmPeer(PUBKEY, GEOHASH, "NeverDie#0c08");

    expect(resolveDisplayName(`nostr_${PUBKEY}`)).toBe("NeverDie#0c08");
  });

  // The inbound path has no name to offer, so it must not erase one we already
  // carried in from the channel.
  it("keeps the name when a later binding arrives without one", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    service.registerGeoDmPeer(PUBKEY, GEOHASH, "NeverDie#0c08");
    service.registerGeoDmPeer(PUBKEY, GEOHASH);

    expect(resolveDisplayName(`nostr_${PUBKEY}`)).toBe("NeverDie#0c08");
  });

  it("forgets the name with the conversation it belonged to", () => {
    const service = new GeohashChannelService(
      mockClient([]),
      ed25519.utils.randomSecretKey(),
      "alice",
      "aabbccdd00112233",
    );
    service.registerGeoDmPeer(PUBKEY, GEOHASH, "NeverDie#0c08");
    useChatStore.getState().removeChannel(`dm:nostr_${PUBKEY}`);

    expect(resolveDisplayName(`nostr_${PUBKEY}`)).toBe("anon#0c08");
  });
});
