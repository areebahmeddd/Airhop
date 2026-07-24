/**
 * @jest-environment node
 */
// Outbound pacing tests for FileTransferService.
//
// These exist because the failure they guard against is invisible on one
// device: dispatching every fragment in a tight loop "works" locally (the
// callbacks all fire) and only fails on the far side of a real radio, where the
// transport silently drops everything past its queue depth and the transfer
// never reassembles. The assertions below are therefore about WHEN packets are
// handed to the transport, not just that they are.

import { decodeFilePacket } from "../../core/mesh/bitchat-file-packet";
import { PacketType, type Packet } from "../../core/mesh/packet-codec";
import { FileTransferService } from "../file-transfer-service";

// The service only touches expo-file-system on the RECEIVE path; a shallow
// mock keeps the module import from pulling in native code.
jest.mock("expo-file-system", () => ({
  File: class {},
  Directory: class {},
  Paths: { cache: {} },
}));

const IDENTITY = {
  peerID: "aabbccdd00112233",
  signingPrivKey: new Uint8Array(32).fill(7),
};

const META = {
  type: "image" as const,
  name: "photo.jpg",
  mimeType: "image/jpeg",
  durationMs: 0,
};

function makeService() {
  const broadcast = jest.fn();
  const unicast = jest.fn();
  const service = new FileTransferService(IDENTITY, broadcast, unicast);
  return { service, broadcast, unicast };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("outbound pacing", () => {
  // Big enough to exceed one 469-byte fragment several times over. High-entropy
  // fill so the codec's raw-DEFLATE compression can't shrink it into one frame
  // (an all-one-byte file would compress away and never fragment).
  const FILE = (() => {
    const f = new Uint8Array(4000);
    for (let i = 0; i < f.length; i++) f[i] = (i * 167 + 13) & 0xff;
    return f;
  })();

  it("does not dispatch the whole file synchronously", () => {
    const { service, broadcast } = makeService();

    service.sendBytes(FILE, META, "#test");

    // The burst is the bug: nothing should have hit the transport yet.
    expect(broadcast).not.toHaveBeenCalled();
    expect(service.pendingCount).toBeGreaterThan(1);
  });

  it("drains one packet per tick and eventually sends all of them", () => {
    const { service, broadcast } = makeService();

    service.sendBytes(FILE, META, "#test");
    const queued = service.pendingCount;
    expect(queued).toBeGreaterThan(1);

    jest.advanceTimersByTime(20);
    expect(broadcast).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(20);
    expect(broadcast).toHaveBeenCalledTimes(2);

    // Drain the rest.
    jest.advanceTimersByTime(20 * (queued + 2));
    expect(broadcast).toHaveBeenCalledTimes(queued);
    expect(service.pendingCount).toBe(0);
  });

  it("unicasts to the peer for a DM channel instead of broadcasting", () => {
    const { service, broadcast, unicast } = makeService();

    service.sendBytes(FILE, META, "dm:9f8e7d6c5b4a3210");
    jest.advanceTimersByTime(20 * 500);

    expect(broadcast).not.toHaveBeenCalled();
    expect(unicast).toHaveBeenCalled();
    expect(unicast.mock.calls[0][0]).toBe("9f8e7d6c5b4a3210");
  });

  it("preserves fragment order through the queue", () => {
    const { service, broadcast } = makeService();

    service.sendBytes(FILE, META, "#test");
    jest.advanceTimersByTime(20 * 500);

    // Every dispatched packet is a FRAGMENT of the original chunk, and the
    // receiver reassembles by index, but ordering still matters for the
    // assembler's memory profile, so assert the queue is FIFO.
    const indices = broadcast.mock.calls.map((call) => {
      const pkt = call[0] as Packet;
      expect(pkt.type).toBe(PacketType.FRAGMENT);
      // Fragment payload: [8-byte streamID][2-byte index BE][2-byte total BE]...
      return (pkt.payload[8] << 8) | pkt.payload[9];
    });
    expect(indices).toEqual([...indices].sort((a, b) => a - b));
  });

  it("rejects a file over the 1 MiB cap before queueing anything", () => {
    const { service, broadcast } = makeService();
    const tooBig = new Uint8Array(1 * 1024 * 1024 + 1);

    expect(() => service.sendBytes(tooBig, META, "#test")).toThrow(
      /too large/i,
    );
    expect(service.pendingCount).toBe(0);
    expect(broadcast).not.toHaveBeenCalled();
  });
});

describe("wire format (BitchatFilePacket)", () => {
  const PNG = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5,
  ]);
  const IMG_META = {
    type: "image" as const,
    name: "pic.png",
    mimeType: "image/png",
    durationMs: 0,
  };

  it("sends a small DM file as one FILE_TRANSFER packet decoding to the file", () => {
    const { service, unicast } = makeService();
    service.sendBytes(PNG, IMG_META, "dm:1122334455667788");
    jest.advanceTimersByTime(40);

    expect(unicast).toHaveBeenCalledTimes(1);
    const pkt = unicast.mock.calls[0][1] as Packet;
    expect(pkt.type).toBe(PacketType.FILE_TRANSFER);
    const fp = decodeFilePacket(pkt.payload)!;
    expect(fp.fileName).toBe("pic.png");
    expect(fp.mimeType).toBe("image/png");
    expect(Array.from(fp.content)).toEqual(Array.from(PNG));
    // A DM carries no channel tag; it is routed by the recipient ID.
    expect(fp.channel).toBeUndefined();
  });

  it("tags a channel attachment with its channel for routing", () => {
    const { service, broadcast } = makeService();
    service.sendBytes(PNG, IMG_META, "#region");
    jest.advanceTimersByTime(40);

    const pkt = broadcast.mock.calls[0][0] as Packet;
    expect(decodeFilePacket(pkt.payload)!.channel).toBe("#region");
  });
});
