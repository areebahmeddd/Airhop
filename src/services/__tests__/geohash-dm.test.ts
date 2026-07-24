/**
 * @jest-environment node
 */
// Geohash DM: a message sent from one per-cell identity is gift-wrapped so only
// the recipient's per-cell identity can open it, wrapped in a bitchat1 envelope.
import { ed25519 } from "@noble/curves/ed25519.js";
import { decodeBitchatEnvelope } from "../../core/nostr/bitchat-envelope";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
} from "../../core/nostr/geohash-identity";
import { unwrapDm } from "../../core/nostr/gift-wrap";
import type { NostrClient } from "../../core/nostr/nostr-client";
import { GeohashChannelService } from "../geohash-channel-service";

jest.mock("expo-location", () => ({}));

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
    const dm = unwrapDm(published[0] as never, recipIdentity.privKey);
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
