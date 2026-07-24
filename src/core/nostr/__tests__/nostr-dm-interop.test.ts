/**
 * @jest-environment node
 */
// End-to-end round-trip for a Nostr DM the way the app sends it: a bitchat1
// envelope, gift-wrapped with bitchat's nip44-v2 crypto, unwrapped and decoded
// on the other side. This is the whole M2 path in one test.
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { NoisePayloadType } from "../../mesh/noise-payload";
import {
  decodeBitchatEnvelope,
  encodeBitchatAckEnvelope,
  encodeBitchatDmEnvelope,
} from "../bitchat-envelope";
import { xOnlyPublicKey } from "../bitchat-nostr-crypto";
import { unwrapDm, wrapDm } from "../gift-wrap";

const SENDER_PEER = "aabbccdd00112233";

describe("Nostr DM interop round-trip", () => {
  it("delivers a private message through the full gift-wrap path", () => {
    const senderPriv = secp256k1.utils.randomSecretKey();
    const recipPriv = secp256k1.utils.randomSecretKey();
    const recipPubHex = bytesToHex(xOnlyPublicKey(recipPriv));

    const envelope = encodeBitchatDmEnvelope(
      SENDER_PEER,
      null,
      "msg-42",
      "hello over nostr",
    )!;
    const { event } = wrapDm(envelope, senderPriv, recipPubHex);

    // Recipient side.
    const dm = unwrapDm(event, recipPriv);
    const decoded = decodeBitchatEnvelope(dm.content)!;
    expect(decoded.type).toBe(NoisePayloadType.PRIVATE_MESSAGE);
    expect(decoded.messageID).toBe("msg-42");
    expect(decoded.content).toBe("hello over nostr");
    // The seal authenticates the sender's real pubkey.
    expect(dm.senderPubkey).toBe(bytesToHex(xOnlyPublicKey(senderPriv)));
  });

  it("delivers a read receipt through the full path", () => {
    const senderPriv = secp256k1.utils.randomSecretKey();
    const recipPriv = secp256k1.utils.randomSecretKey();
    const recipPubHex = bytesToHex(xOnlyPublicKey(recipPriv));

    const ack = encodeBitchatAckEnvelope(
      SENDER_PEER,
      null,
      NoisePayloadType.READ_RECEIPT,
      "msg-42",
    );
    const { event } = wrapDm(ack, senderPriv, recipPubHex);
    const decoded = decodeBitchatEnvelope(unwrapDm(event, recipPriv).content)!;
    expect(decoded.type).toBe(NoisePayloadType.READ_RECEIPT);
    expect(decoded.messageID).toBe("msg-42");
  });

  it("a third party cannot unwrap the DM", () => {
    const senderPriv = secp256k1.utils.randomSecretKey();
    const recipPriv = secp256k1.utils.randomSecretKey();
    const eve = secp256k1.utils.randomSecretKey();
    const recipPubHex = bytesToHex(xOnlyPublicKey(recipPriv));
    const env = encodeBitchatDmEnvelope(SENDER_PEER, null, "m", "secret")!;
    const { event } = wrapDm(env, senderPriv, recipPubHex);
    expect(() => unwrapDm(event, eve)).toThrow();
  });
});
