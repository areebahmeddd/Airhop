/**
 * @jest-environment node
 */
// Mesh ping/pong payload: byte-compatible with bitchat MeshPingPayload.
import {
  decodeMeshPing,
  encodeMeshPing,
  newPingNonce,
  PING_NONCE_LENGTH,
  pingHopCount,
} from "../mesh-ping";

describe("mesh ping payload", () => {
  it("encodes to 9 bytes: nonce then originTTL", () => {
    const nonce = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const bytes = encodeMeshPing({ nonce, originTTL: 7 });
    expect(bytes).toHaveLength(9);
    expect([...bytes.slice(0, 8)]).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(bytes[8]).toBe(7);
  });

  it("round-trips through decode", () => {
    const nonce = newPingNonce();
    const decoded = decodeMeshPing(encodeMeshPing({ nonce, originTTL: 5 }));
    expect(decoded).not.toBeNull();
    expect([...decoded!.nonce]).toEqual([...nonce]);
    expect(decoded!.originTTL).toBe(5);
  });

  it("tolerates trailing bytes (forward compatibility)", () => {
    const nonce = newPingNonce();
    const base = encodeMeshPing({ nonce, originTTL: 3 });
    const extended = new Uint8Array([...base, 0xff, 0xee]);
    const decoded = decodeMeshPing(extended);
    expect(decoded!.originTTL).toBe(3);
    expect([...decoded!.nonce]).toEqual([...nonce]);
  });

  it("rejects a payload shorter than 9 bytes", () => {
    expect(decodeMeshPing(new Uint8Array(8))).toBeNull();
  });

  it("computes hop count from TTL decrements (direct = 1)", () => {
    expect(pingHopCount(7, 7)).toBe(1);
    expect(pingHopCount(7, 6)).toBe(2);
    expect(pingHopCount(7, 1)).toBe(7);
  });

  it("returns null when TTLs are inconsistent", () => {
    expect(pingHopCount(3, 7)).toBeNull();
  });

  it("generates an 8-byte nonce", () => {
    expect(newPingNonce()).toHaveLength(PING_NONCE_LENGTH);
  });
});
