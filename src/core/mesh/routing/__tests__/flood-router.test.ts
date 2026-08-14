/**
 * @jest-environment node
 */
import { Flags, PacketType, type Packet } from "../../wire/packet-codec";
import { FloodRouter } from "../flood-router";

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

describe("FloodRouter time-critical relay policy", () => {
  // Live voice and media fragments are relayed on a much tighter schedule than
  // ordinary traffic. Voice is the reason: a talker emits ~15 packets a second
  // and the far side plays them out of a 350 ms jitter buffer, so the ordinary
  // window (up to 220 ms per hop) would spend the whole buffer on relaying
  // before three hops were done.
  function voicePacket(ttl = 7): Packet {
    return {
      type: PacketType.VOICE_FRAME,
      ttl,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8),
      recipientID: new Uint8Array(8),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: new Uint8Array([1, 2, 3]),
    };
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("relays a voice frame inside the jitter buffer's budget", () => {
    // Dense mesh, where ordinary traffic would wait 100-220 ms.
    const router = new FloodRouter(() => 12);
    const sent: Packet[] = [];
    router.receive(voicePacket(), (p) => sent.push(p));

    jest.advanceTimersByTime(25);
    expect(sent).toHaveLength(1);
    router.flush();
  });

  it("leaves ordinary traffic on the wider window", () => {
    const router = new FloodRouter(() => 12);
    const sent: Packet[] = [];
    router.receive({ ...voicePacket(), type: PacketType.CHANNEL_MSG }, (p) =>
      sent.push(p),
    );

    jest.advanceTimersByTime(25);
    expect(sent).toHaveLength(0); // still waiting; ordinary jitter starts at 100
    jest.advanceTimersByTime(220);
    expect(sent).toHaveLength(1);
    router.flush();
  });

  it("clamps voice TTL in a dense mesh so a stream cannot flood to full depth", () => {
    const router = new FloodRouter(() => 12);
    const sent: Packet[] = [];
    router.receive(voicePacket(7), (p) => sent.push(p));
    jest.advanceTimersByTime(30);
    // Clamped to 5, then decremented for the hop.
    expect(sent[0].ttl).toBe(4);
    router.flush();
  });

  it("keeps full depth in a sparse mesh, so voice reaches as far as text", () => {
    const router = new FloodRouter(() => 2);
    const sent: Packet[] = [];
    router.receive(voicePacket(7), (p) => sent.push(p));
    jest.advanceTimersByTime(30);
    expect(sent[0].ttl).toBe(6);
    router.flush();
  });

  it("still drops a voice frame that has run out of TTL", () => {
    const router = new FloodRouter(() => 2);
    const sent: Packet[] = [];
    expect(router.receive(voicePacket(1), (p) => sent.push(p))).toBe(true);
    jest.advanceTimersByTime(60);
    expect(sent).toHaveLength(0);
    router.flush();
  });
});
