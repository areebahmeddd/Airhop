/**
 * @jest-environment node
 */
import { FloodRouter } from "../flood-router";
import { Flags, PacketType, type Packet } from "../packet-codec";

function makePacket(_nonceByte: number = 0x01, ttl: number = 7): Packet {
  return {
    type: PacketType.ANNOUNCE,
    ttl,
    flags: Flags.SIGNED, // 0x02
    senderID: new Uint8Array(8),
    recipientID: new Uint8Array(8),
    timestamp: Math.floor(Date.now() / 1000),
    signature: new Uint8Array(64),
    payload: new Uint8Array(0),
  };
}

describe("FloodRouter", () => {
  let router: FloodRouter;

  beforeEach(() => {
    jest.useFakeTimers();
    router = new FloodRouter();
  });

  afterEach(() => {
    router.flush();
    jest.useRealTimers();
  });

  describe("receive()", () => {
    it("returns true for a new packet", () => {
      const sent: Packet[] = [];
      expect(router.receive(makePacket(0x01), (p) => sent.push(p))).toBe(true);
    });

    it("returns false for a duplicate packet (same nonce)", () => {
      const sent: Packet[] = [];
      const packet = makePacket(0x01);
      router.receive(packet, (p) => sent.push(p));
      expect(router.receive(packet, (p) => sent.push(p))).toBe(false);
    });

    it("schedules relay after jitter (10–220 ms)", () => {
      const sent: Packet[] = [];
      router.receive(makePacket(0x01, 7), (p) => sent.push(p));

      // Nothing sent immediately
      expect(sent.length).toBe(0);

      // After max jitter + 1ms, relay must have fired
      jest.advanceTimersByTime(221);
      expect(sent.length).toBe(1);
    });

    it("relayed packet has TTL decremented by 1", () => {
      const sent: Packet[] = [];
      router.receive(makePacket(0x01, 7), (p) => sent.push(p));
      jest.advanceTimersByTime(221);
      expect(sent[0].ttl).toBe(6);
    });

    it("does not relay when TTL = 1 (would become 0)", () => {
      const sent: Packet[] = [];
      router.receive(makePacket(0x01, 1), (p) => sent.push(p));
      jest.advanceTimersByTime(300);
      expect(sent.length).toBe(0);
    });

    it("does not relay when TTL = 0", () => {
      const sent: Packet[] = [];
      router.receive(makePacket(0x01, 0), (p) => sent.push(p));
      jest.advanceTimersByTime(300);
      expect(sent.length).toBe(0);
    });
  });

  describe("originate()", () => {
    it("marks originating packet as seen to suppress echo relays", () => {
      const packet = makePacket(0x01);
      router.originate(packet);

      const sent: Packet[] = [];
      expect(router.receive(packet, (p) => sent.push(p))).toBe(false);
      jest.advanceTimersByTime(300);
      expect(sent.length).toBe(0);
    });
  });

  describe("flush()", () => {
    it("cancels all pending relay timers", () => {
      const sent: Packet[] = [];
      router.receive(makePacket(0x01, 7), (p) => sent.push(p));
      router.receive(makePacket(0x02, 7), (p) => sent.push(p));

      router.flush();
      jest.advanceTimersByTime(300);

      // Both relays were cancelled
      expect(sent.length).toBe(0);
    });
  });

  describe("defaultTTL", () => {
    it("equals 7 per PROTOCOLS.md", () => {
      expect(router.defaultTTL).toBe(7);
    });
  });

  describe("jitter range", () => {
    it("relay fires by 220 ms (upper bound of jitter window)", () => {
      const sent: Packet[] = [];
      router.receive(makePacket(0x03, 7), (p) => sent.push(p));

      // Advance to upper bound of jitter window
      jest.advanceTimersByTime(220);
      expect(sent.length).toBe(1);
    });

    it("relay does not fire in < 10 ms (lower bound of jitter window)", () => {
      // Spy on Math.random to force maximum jitter (220 ms)
      const spy = jest
        .spyOn(Math, "random")
        .mockReturnValue(1 - Number.EPSILON);

      const sent: Packet[] = [];
      const r = new FloodRouter();
      r.receive(makePacket(0x04, 7), (p) => sent.push(p));

      jest.advanceTimersByTime(9);
      expect(sent.length).toBe(0);

      jest.advanceTimersByTime(211);
      expect(sent.length).toBe(1);

      spy.mockRestore();
      r.flush();
    });
  });
});
