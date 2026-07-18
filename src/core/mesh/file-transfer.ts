// Chunked streaming file transfer over the BLE mesh.
//
// Breaks files larger than 1 MiB into 64 KiB chunks and sends each as a
// FILE_TRANSFER (0x22) packet. Reassembly tracks partial transfers in memory
// with a 60-second timeout per incomplete session.
//
// Wire format for each chunk payload:
//   [0–3]   stream_id  u32-BE  (random 32-bit identifier for this transfer)
//   [4–7]   chunk_index u32-BE  (0-based chunk number)
//   [8–11]  total_chunks u32-BE (total number of chunks in this transfer)
//   [12]    flags u8           (bit 0: last chunk, bit 1: compressed)
//   [13–20] file_size u64-BE   (total file size in bytes, in chunk 0 only)
//   [21–...]  data             (raw chunk bytes, up to 64 KiB)
//
// The full file is available once total_chunks == received chunks.
//
// Transport: uses the BLE flood-router broadcast or unicast mechanism (same as
// voice frames). The WiFi transport is preferred for >1 MiB files when available.
import { randomBytes } from "@noble/hashes/utils.js";

// Chunk size: 64 KiB. Each chunk maps to one FILE_TRANSFER packet.
export const CHUNK_SIZE = 65_536;

// Timeout after which an incomplete assembly is dropped (ms).
const ASSEMBLY_TIMEOUT_MS = 60_000;

// Payload header offsets.
const OFF_STREAM_ID = 0; // u32-BE
const OFF_CHUNK_INDEX = 4; // u32-BE
const OFF_TOTAL_CHUNKS = 8; // u32-BE
const OFF_FLAGS = 12; // u8
const OFF_FILE_SIZE = 13; // u64-BE (only in chunk 0: upper 32 bits then lower 32)
const HEADER_SIZE_C0 = 21; // header size for chunk 0 (includes file_size)
const HEADER_SIZE = 13; // header size for chunks > 0

// Flag masks.
export const ChunkFlags = {
  LAST_CHUNK: 0x01,
  COMPRESSED: 0x02,
} as const;

// ---- Send side --------------------------------------------------------------

export interface ChunkPacket {
  streamID: number;
  chunkIndex: number;
  totalChunks: number;
  flags: number;
  payload: Uint8Array; // full encoded chunk (header + data)
}

export interface TransferProgress {
  streamID: number;
  sentChunks: number;
  totalChunks: number;
}

// Slice `data` into encoded chunk payloads ready to be wrapped in FILE_TRANSFER
// packets. The returned array is ordered; caller sends them in order.
export function encodeFileChunks(data: Uint8Array): ChunkPacket[] {
  const totalChunks = Math.ceil(data.length / CHUNK_SIZE) || 1;
  // Random 32-bit stream ID for this transfer.
  const idBytes = randomBytes(4);
  const streamID =
    ((idBytes[0] << 24) |
      (idBytes[1] << 16) |
      (idBytes[2] << 8) |
      idBytes[3]) >>>
    0;

  const packets: ChunkPacket[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const chunkData = data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const isLast = i === totalChunks - 1;
    const flags = isLast ? ChunkFlags.LAST_CHUNK : 0;

    let headerSize: number;
    if (i === 0) {
      headerSize = HEADER_SIZE_C0;
    } else {
      headerSize = HEADER_SIZE;
    }

    const payload = new Uint8Array(headerSize + chunkData.length);
    const dv = new DataView(payload.buffer);
    dv.setUint32(OFF_STREAM_ID, streamID, false);
    dv.setUint32(OFF_CHUNK_INDEX, i, false);
    dv.setUint32(OFF_TOTAL_CHUNKS, totalChunks, false);
    payload[OFF_FLAGS] = flags;

    if (i === 0) {
      // Store file size as two u32-BE (high then low) for safe JS integer handling.
      const fileSize = data.length;
      dv.setUint32(OFF_FILE_SIZE, Math.floor(fileSize / 0x100000000), false);
      dv.setUint32(OFF_FILE_SIZE + 4, fileSize >>> 0, false);
    }

    payload.set(chunkData, headerSize);

    packets.push({ streamID, chunkIndex: i, totalChunks, flags, payload });
  }

  return packets;
}

// ---- Receive side -----------------------------------------------------------

interface AssemblyState {
  streamID: number;
  totalChunks: number;
  fileSize: number;
  chunks: Map<number, Uint8Array>; // chunkIndex → chunk data
  createdAt: number;
}

export type FileCompleteCallback = (streamID: number, data: Uint8Array) => void;
export type FileProgressCallback = (
  streamID: number,
  received: number,
  total: number,
) => void;

// Reassembles incoming chunk packets into complete files.
// A single instance is shared for all concurrent incoming transfers.
export class FileAssembler {
  private readonly assemblies = new Map<number, AssemblyState>();
  private readonly onComplete: FileCompleteCallback;
  private readonly onProgress?: FileProgressCallback;

  constructor(
    onComplete: FileCompleteCallback,
    onProgress?: FileProgressCallback,
  ) {
    this.onComplete = onComplete;
    this.onProgress = onProgress;
  }

  // Feed an encoded chunk payload (the FILE_TRANSFER packet's payload field).
  // Calls onProgress after each chunk; calls onComplete when the file is whole.
  receiveChunk(payload: Uint8Array): void {
    if (payload.length < HEADER_SIZE) return;

    const dv = new DataView(payload.buffer, payload.byteOffset);
    const streamID = dv.getUint32(OFF_STREAM_ID, false);
    const chunkIndex = dv.getUint32(OFF_CHUNK_INDEX, false);
    const totalChunks = dv.getUint32(OFF_TOTAL_CHUNKS, false);

    if (totalChunks === 0 || chunkIndex >= totalChunks) return;

    // Determine header size and extract chunk data.
    let headerSize: number;
    let fileSize = 0;

    if (chunkIndex === 0) {
      if (payload.length < HEADER_SIZE_C0) return;
      headerSize = HEADER_SIZE_C0;
      const hi = dv.getUint32(OFF_FILE_SIZE, false);
      const lo = dv.getUint32(OFF_FILE_SIZE + 4, false);
      fileSize = hi * 0x100000000 + lo;
    } else {
      headerSize = HEADER_SIZE;
    }

    const chunkData = payload.slice(headerSize);

    // Evict timed-out assemblies before accessing the map.
    this.evictStale();

    let state = this.assemblies.get(streamID);
    if (!state) {
      state = {
        streamID,
        totalChunks,
        fileSize,
        chunks: new Map(),
        createdAt: Date.now(),
      };
      this.assemblies.set(streamID, state);
    }

    // Update file size from chunk 0 even if it arrived late.
    if (chunkIndex === 0 && fileSize > 0) {
      state.fileSize = fileSize;
    }

    state.chunks.set(chunkIndex, chunkData);
    this.onProgress?.(streamID, state.chunks.size, state.totalChunks);

    // Complete as soon as every chunk is present, regardless of arrival order.
    // totalChunks is embedded in every chunk header so it is always accurate.
    if (state.chunks.size === state.totalChunks) {
      this.assemblies.delete(streamID);
      this.onComplete(streamID, assembleChunks(state));
    }
  }

  // Drop assemblies that have been open too long (memory safety).
  private evictStale(): void {
    const cutoff = Date.now() - ASSEMBLY_TIMEOUT_MS;
    for (const [id, state] of this.assemblies) {
      if (state.createdAt < cutoff) this.assemblies.delete(id);
    }
  }

  // Number of incomplete assemblies currently in memory.
  get pendingCount(): number {
    return this.assemblies.size;
  }
}

// Concatenate ordered chunks into a single buffer.
function assembleChunks(state: AssemblyState): Uint8Array {
  // Compute total length from the stored chunks (file_size may be 0 for old senders).
  let totalLen = 0;
  for (let i = 0; i < state.totalChunks; i++) {
    totalLen += state.chunks.get(i)?.length ?? 0;
  }
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (let i = 0; i < state.totalChunks; i++) {
    const chunk = state.chunks.get(i);
    if (chunk) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
  }
  return out;
}
