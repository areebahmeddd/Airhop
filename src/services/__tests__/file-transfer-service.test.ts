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

import { decodeFilePacket } from "@core/mesh/wire/file-packet";
import { PacketType, type Packet } from "@core/mesh/wire/packet-codec";
import { useChatStore } from "@store/chat-store";
import { useTransferStore } from "@store/transfer-store";
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

// The transport now answers whether it ACCEPTED the packet, and the pacer waits
// for that answer before offering the next fragment. `accepted` lets a test play
// a radio that is refusing writes, which is the case that used to lose files.
function makeService(accepted = true) {
  const broadcast = jest.fn().mockResolvedValue(accepted);
  const unicast = jest.fn().mockResolvedValue(accepted);
  const service = new FileTransferService(IDENTITY, broadcast, unicast);
  return { service, broadcast, unicast };
}

// Fire the pacer's timer, then let the awaited transport answer settle so the
// next tick is scheduled. Advancing fake timers alone only does the first half.
//
// The default clears the widest fragment spacing (30ms, the broadcast one), so
// it fires whichever of the two the service scheduled. Callers waiting on a
// refusal pass the longer backoff explicitly.
async function tick(times = 1, ms = 30): Promise<void> {
  for (let i = 0; i < times; i++) {
    jest.advanceTimersByTime(ms);
    await Promise.resolve();
    await Promise.resolve();
  }
}

beforeEach(() => {
  jest.useFakeTimers();
  useTransferStore.getState().clearAll();
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

  it("drains one packet per tick and eventually sends all of them", async () => {
    const { service, broadcast } = makeService();

    service.sendBytes(FILE, META, "#test");
    const queued = service.pendingCount;
    expect(queued).toBeGreaterThan(1);

    await tick();
    expect(broadcast).toHaveBeenCalledTimes(1);

    await tick();
    expect(broadcast).toHaveBeenCalledTimes(2);

    // Drain the rest.
    await tick(queued + 2);
    expect(broadcast).toHaveBeenCalledTimes(queued);
    expect(service.pendingCount).toBe(0);
  });

  it("unicasts to the peer for a DM channel instead of broadcasting", async () => {
    const { service, broadcast, unicast } = makeService();

    service.sendBytes(FILE, META, "dm:9f8e7d6c5b4a3210");
    await tick(500);

    expect(broadcast).not.toHaveBeenCalled();
    expect(unicast).toHaveBeenCalled();
    expect(unicast.mock.calls[0][0]).toBe("9f8e7d6c5b4a3210");
  });

  it("preserves fragment order through the queue", async () => {
    const { service, broadcast } = makeService();

    service.sendBytes(FILE, META, "#test");
    await tick(500);

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

  it("rejects a photo over the image cap before queueing anything", () => {
    // bitchat caps photos at 512 KiB, below the 1 MiB file ceiling. Past it the
    // peer refuses the whole file, so this has to fail here rather than after a
    // minute of progress that was never going to land.
    const { service, broadcast } = makeService();
    const tooBig = new Uint8Array(512 * 1024 + 1);

    expect(() => service.sendBytes(tooBig, META, "#test")).toThrow(
      /over the 512 KB limit/i,
    );
    expect(service.pendingCount).toBe(0);
    expect(broadcast).not.toHaveBeenCalled();
  });

  it("lets a document run to the 1 MiB file ceiling", () => {
    const { service, broadcast } = makeService();
    const doc = { ...META, type: "document" as const, name: "notes.pdf" };

    expect(() =>
      service.sendBytes(new Uint8Array(512 * 1024 + 1), doc, "#test"),
    ).not.toThrow();
    expect(broadcast).not.toHaveBeenCalled(); // paced, nothing drained yet
    expect(service.pendingCount).toBeGreaterThan(0);

    expect(() =>
      service.sendBytes(new Uint8Array(1024 * 1024 + 1), doc, "#test"),
    ).toThrow(/over the 1024 KB limit/i);
  });
});

// The bug these guard: two phones sending a photo to each other at the same
// time. The fragment spacing already sits at what BLE carries one-way, so the
// second direction fills the stack's write queue and it starts refusing. A refusal
// that is dropped is a fragment the receiver can never ask for, so its stream
// stalls at a couple of percent and dies on the idle timeout, while the sender
// marches to 100% and reports "sent". Nothing on this wire acknowledges a
// fragment, so holding on to a refused one is the only thing that can save it.
describe("radio backpressure", () => {
  const FILE = (() => {
    const f = new Uint8Array(4000);
    for (let i = 0; i < f.length; i++) f[i] = (i * 167 + 13) & 0xff;
    return f;
  })();

  it("keeps a refused fragment instead of counting it as sent", async () => {
    const { service, broadcast } = makeService(false);

    service.sendBytes(FILE, META, "#test");
    const queued = service.pendingCount;

    await tick(3, 60);

    // It was offered, and it is still ours to offer again.
    expect(broadcast).toHaveBeenCalled();
    expect(service.pendingCount).toBe(queued);
  });

  it("re-offers the SAME fragment, so the stream keeps its order", async () => {
    const { service, broadcast } = makeService(false);

    service.sendBytes(FILE, META, "#test");
    await tick(3, 60);

    const indexOf = (call: unknown[]) => {
      const pkt = call[0] as Packet;
      return (pkt.payload[8] << 8) | pkt.payload[9];
    };
    const offered = broadcast.mock.calls.map(indexOf);
    expect(offered.every((i) => i === offered[0])).toBe(true);
  });

  it("resumes from where it stalled once the radio takes writes again", async () => {
    const { service, broadcast } = makeService(false);

    service.sendBytes(FILE, META, "#test");
    const queued = service.pendingCount;
    await tick(3, 60);
    expect(service.pendingCount).toBe(queued);

    broadcast.mockResolvedValue(true);
    await tick(queued + 2);

    expect(service.pendingCount).toBe(0);
  });

  it("gives up honestly on a link that never recovers", async () => {
    const { service } = makeService(false);
    const outcome = jest.fn();

    service.sendBytes(FILE, META, "#test", outcome);
    // Past REFUSAL_LIMIT (250) consecutive refusals.
    await tick(260, 60);

    expect(outcome).toHaveBeenCalledWith(false);
    expect(service.pendingCount).toBe(0);
  });

  it("reports the outcome once the whole file is away", async () => {
    const { service } = makeService();
    const outcome = jest.fn();

    service.sendBytes(FILE, META, "#test", outcome);
    await tick(service.pendingCount + 2);

    expect(outcome).toHaveBeenCalledWith(true);
  });

  it("does not resurrect a transfer cancelled mid-flight", async () => {
    const { service } = makeService(false);
    const outcome = jest.fn();

    service.sendBytes(FILE, META, "#test", outcome);
    await tick(1, 60);

    // Cancel while a refused fragment is on its way back to the queue.
    const id = Object.keys(
      (
        jest.requireActual("@store/transfer-store") as {
          useTransferStore: {
            getState: () => { transfers: Record<string, unknown> };
          };
        }
      ).useTransferStore.getState().transfers,
    )[0];
    service.cancel(id);
    await tick(3, 60);

    expect(service.pendingCount).toBe(0);
    expect(outcome).toHaveBeenCalledWith(false);
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

  it("sends a small DM file as one FILE_TRANSFER packet decoding to the file", async () => {
    const { service, unicast } = makeService();
    service.sendBytes(PNG, IMG_META, "dm:1122334455667788");
    await tick(2);

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

  it("tags a channel attachment with its channel for routing", async () => {
    const { service, broadcast } = makeService();
    service.sendBytes(PNG, IMG_META, "#region");
    await tick(2);

    const pkt = broadcast.mock.calls[0][0] as Packet;
    expect(decodeFilePacket(pkt.payload)!.channel).toBe("#region");
  });
});

// ---- Refused attachments ------------------------------------------------------
//
// The receive path drops a bad attachment in four places, all of them silently.
// From the outside that is identical to the file never being sent, which is the
// hardest kind of bug to get a report about. These pin where the resulting
// system line may and may not appear, because the line is a surface anyone in
// radio range can reach and the "may not" half is the security-relevant one.
describe("an attachment that cannot be read", () => {
  const SENDER = "1122334455667788";
  const SENDER_BYTES = new Uint8Array([
    0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
  ]);
  const ME_BYTES = new Uint8Array([
    0xaa, 0xbb, 0xcc, 0xdd, 0x00, 0x11, 0x22, 0x33,
  ]);
  const DM = `dm:${SENDER}`;

  // Garbage in place of a BitchatFilePacket TLV, so decodeFilePacket refuses it.
  const JUNK = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);

  function packet(recipientID: Uint8Array, hasRecipient: boolean): Packet {
    return {
      type: PacketType.FILE_TRANSFER,
      ttl: 7,
      flags: hasRecipient ? 0x01 : 0x00,
      senderID: SENDER_BYTES,
      recipientID,
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: JUNK,
    };
  }

  function systemLines(): string[] {
    return (useChatStore.getState().messages[DM] ?? [])
      .filter((m) => m.isSystem)
      .map((m) => m.text);
  }

  beforeEach(() => {
    useChatStore.getState().clearAll();
  });

  it("says so in a direct message thread that already exists", async () => {
    const { service } = makeService();
    useChatStore.getState().addChannel(DM);

    service.onFileTransfer(packet(ME_BYTES, true));
    await Promise.resolve();

    expect(systemLines()).toHaveLength(1);
  });

  it("stays silent for a packet merely passing through us", async () => {
    // FILE_TRANSFER floods, so a DM attachment between two other people crosses
    // this device. Their failure is not ours to report, and reporting it would
    // leak that we can see their traffic.
    const { service } = makeService();
    useChatStore.getState().addChannel(DM);

    const someoneElse = new Uint8Array(8).fill(0x99);
    service.onFileTransfer(packet(someoneElse, true));
    await Promise.resolve();

    expect(systemLines()).toEqual([]);
  });

  it("stays silent on a broadcast attachment", async () => {
    // Anyone in range can put a malformed broadcast on the air. A line per bad
    // packet would be a spam channel wearing a helpful face.
    const { service } = makeService();
    useChatStore.getState().addChannel(DM);

    service.onFileTransfer(packet(new Uint8Array(8), false));
    await Promise.resolve();

    expect(systemLines()).toEqual([]);
  });

  it("never conjures a thread that does not exist yet", async () => {
    // Otherwise a stranger creates a conversation in someone's list out of pure
    // garbage: the same "attacker creates UI state" shape the channel-tag check
    // exists to close.
    const { service } = makeService();

    service.onFileTransfer(packet(ME_BYTES, true));
    await Promise.resolve();

    expect(useChatStore.getState().channels).not.toContain(DM);
  });

  it("posts one line for a burst, not one per packet", async () => {
    const { service } = makeService();
    useChatStore.getState().addChannel(DM);

    for (let i = 0; i < 10; i++) {
      service.onFileTransfer(packet(ME_BYTES, true));
      await Promise.resolve();
    }

    expect(systemLines()).toHaveLength(1);
  });
});
