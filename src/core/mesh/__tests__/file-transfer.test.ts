/**
 * @jest-environment node
 */
import {
  CHUNK_SIZE,
  ChunkFlags,
  FileAssembler,
  encodeFileChunks,
} from "../file-transfer";

describe("file-transfer: send side", () => {
  test("single-chunk file (≤ 64 KiB) produces one chunk", () => {
    const data = new Uint8Array(100).fill(42);
    const chunks = encodeFileChunks(data);
    expect(chunks).toHaveLength(1);
    expect(chunks[0].chunkIndex).toBe(0);
    expect(chunks[0].totalChunks).toBe(1);
    expect(chunks[0].flags & ChunkFlags.LAST_CHUNK).toBeTruthy();
  });

  test("empty file produces one chunk", () => {
    const chunks = encodeFileChunks(new Uint8Array(0));
    expect(chunks).toHaveLength(1);
    expect(chunks[0].flags & ChunkFlags.LAST_CHUNK).toBeTruthy();
  });

  test("exactly CHUNK_SIZE bytes produces one chunk", () => {
    const data = new Uint8Array(CHUNK_SIZE);
    const chunks = encodeFileChunks(data);
    expect(chunks).toHaveLength(1);
    expect(chunks[0].flags & ChunkFlags.LAST_CHUNK).toBeTruthy();
  });

  test("CHUNK_SIZE + 1 bytes produces two chunks", () => {
    const data = new Uint8Array(CHUNK_SIZE + 1);
    const chunks = encodeFileChunks(data);
    expect(chunks).toHaveLength(2);
    expect(chunks[0].flags & ChunkFlags.LAST_CHUNK).toBeFalsy();
    expect(chunks[1].flags & ChunkFlags.LAST_CHUNK).toBeTruthy();
  });

  test("3 MiB file produces correct chunk count", () => {
    const size = 3 * 1024 * 1024; // 3 MiB
    const data = new Uint8Array(size);
    const chunks = encodeFileChunks(data);
    expect(chunks).toHaveLength(Math.ceil(size / CHUNK_SIZE));
    expect(chunks[0].totalChunks).toBe(chunks.length);
    // All chunks share the same stream ID.
    const id = chunks[0].streamID;
    expect(chunks.every((c) => c.streamID === id)).toBe(true);
    // Only last chunk has LAST_CHUNK flag.
    expect(
      chunks[chunks.length - 1].flags & ChunkFlags.LAST_CHUNK,
    ).toBeTruthy();
    for (let i = 0; i < chunks.length - 1; i++) {
      expect(chunks[i].flags & ChunkFlags.LAST_CHUNK).toBeFalsy();
    }
  });

  test("two transfers have different stream IDs (randomness)", () => {
    const data = new Uint8Array(10).fill(1);
    const a = encodeFileChunks(data);
    const b = encodeFileChunks(data);
    expect(a[0].streamID).not.toBe(b[0].streamID);
  });
});

describe("file-transfer: receive side (FileAssembler)", () => {
  // Helper: encode and send all chunks through the assembler.
  function roundTrip(data: Uint8Array): Uint8Array {
    let result: Uint8Array | null = null;
    const asm = new FileAssembler((_, assembled) => {
      result = assembled;
    });
    const chunks = encodeFileChunks(data);
    for (const c of chunks) {
      asm.receiveChunk(c.payload);
    }
    if (!result) throw new Error("File never completed");
    return result;
  }

  test("round-trip: small file (< 64 KiB)", () => {
    const data = new Uint8Array(1000);
    for (let i = 0; i < data.length; i++) data[i] = i & 0xff;
    expect(roundTrip(data)).toEqual(data);
  });

  test("round-trip: multi-chunk file (200 KiB)", () => {
    const data = new Uint8Array(200 * 1024);
    for (let i = 0; i < data.length; i++) data[i] = (i * 7) & 0xff;
    expect(roundTrip(data)).toEqual(data);
  });

  test("out-of-order delivery still reassembles correctly", () => {
    const data = new Uint8Array(3 * CHUNK_SIZE);
    data.fill(0xab);

    let result: Uint8Array | null = null;
    const asm = new FileAssembler((_, assembled) => {
      result = assembled;
    });

    const chunks = encodeFileChunks(data);
    // Deliver in reverse order: 2, 1, 0
    asm.receiveChunk(chunks[2].payload);
    asm.receiveChunk(chunks[1].payload);
    asm.receiveChunk(chunks[0].payload);

    expect(result).not.toBeNull();
    expect(result).toEqual(data);
  });

  test("duplicate chunk does not corrupt the file", () => {
    const data = new Uint8Array(CHUNK_SIZE + 500).fill(0x7e);
    let result: Uint8Array | null = null;
    const asm = new FileAssembler((_, assembled) => {
      result = assembled;
    });
    const chunks = encodeFileChunks(data);
    asm.receiveChunk(chunks[0].payload);
    asm.receiveChunk(chunks[0].payload); // duplicate
    asm.receiveChunk(chunks[1].payload);
    expect(result).toEqual(data);
  });

  test("progress callback fires for each chunk", () => {
    const data = new Uint8Array(3 * CHUNK_SIZE);
    const progressLog: number[] = [];
    const asm = new FileAssembler(
      () => {},
      (_, received) => progressLog.push(received),
    );
    for (const c of encodeFileChunks(data)) {
      asm.receiveChunk(c.payload);
    }
    expect(progressLog).toEqual([1, 2, 3]);
  });

  test("truncated payload is silently ignored", () => {
    const asm = new FileAssembler(() => {
      throw new Error("should not complete");
    });
    asm.receiveChunk(new Uint8Array(4)); // too short: no header
    expect(asm.pendingCount).toBe(0);
  });

  test("empty file round-trip", () => {
    const data = new Uint8Array(0);
    expect(roundTrip(data)).toEqual(data);
  });
});
