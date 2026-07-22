// Attachment file transfer over BLE (or WiFi when available).
//
// Pipeline:
//   Send:    file bytes → metadata prefix → encodeFileChunks (64 KB chunks)
//            → each chunk wrapped in a FILE_TRANSFER packet → fragmentPacket
//            → individual 469-byte FRAGMENT packets → BLE / WiFi write
//
//   Receive: FRAGMENT packets → FragmentManager → FILE_TRANSFER packet
//            → FileAssembler (chunk order independent) → complete bytes
//            → strip metadata prefix → save to device cache → ChatMessage

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import * as FileSystem from "expo-file-system";
import { encodeFileChunks, FileAssembler } from "../core/mesh/file-transfer";
import { FRAGMENT_SIZE, fragmentPacket } from "../core/mesh/fragment-manager";
import {
  BROADCAST_ID,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "../core/mesh/packet-codec";
import { useChatStore, type ChatAttachment } from "../store/chat-store";

// ---- Types ------------------------------------------------------------------

// Maximum file size accepted for mesh transfer. BLE throughput tops out at
// ~2 Mbit/s in ideal conditions; a 25 MB file takes ~100 s. Larger payloads
// should be split by the sender or delivered via Nostr/cloud link instead.
const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024; // 25 MB

// Delay between consecutive outbound fragments. Matches bitchat's
// FragmentingPacketSender.interFragmentDelayMs. This is a throughput ceiling
// (~23 KB/s) rather than a tuning knob: without it the radio drops fragments
// and the transfer never completes on the far side.
const INTER_FRAGMENT_MS = 20;

export interface AttachmentMeta {
  type: ChatAttachment["type"];
  name: string;
  mimeType: string;
  durationMs: number;
}

interface MetaEnvelope {
  t: string; // attachment type
  n: string; // file name
  m: string; // MIME type
  d: number; // duration ms
  c: string; // channel ("dm:<peerID>" or "#bluetooth" etc.)
}

// Only the attachment cache files this service writes carry this prefix
// (see onFileComplete below), so a directory sweep never touches anything
// else the OS or other libraries may place in the shared cache dir.
const CACHE_FILE_PREFIX = "airhop_";

// Real, on-disk total for received attachments, used by the Storage & Data
// screen's Cache row.
export function getAttachmentCacheBytes(): number {
  const dir = new FileSystem.Directory(FileSystem.Paths.cache);
  if (!dir.exists) return 0;
  return dir
    .list()
    .filter(
      (entry): entry is FileSystem.File =>
        entry instanceof FileSystem.File &&
        entry.name.startsWith(CACHE_FILE_PREFIX),
    )
    .reduce((sum, file) => sum + file.size, 0);
}

// Deletes every cached attachment file and returns the bytes freed.
export function clearAttachmentCache(): number {
  const dir = new FileSystem.Directory(FileSystem.Paths.cache);
  if (!dir.exists) return 0;
  let freed = 0;
  for (const entry of dir.list()) {
    if (
      entry instanceof FileSystem.File &&
      entry.name.startsWith(CACHE_FILE_PREFIX)
    ) {
      freed += entry.size;
      try {
        entry.delete();
      } catch {
        // Best-effort: skip files that are mid-write or already gone.
      }
    }
  }
  return freed;
}

export type BroadcastFn = (packet: Packet) => void;
export type UnicastFn = (recipientPeerID: string, packet: Packet) => void;

interface ServiceIdentity {
  peerID: string;
  signingPrivKey: Uint8Array;
}

// ---- File chunk metadata helpers -------------------------------------------

// Prepend a 4-byte length-prefixed JSON metadata envelope to `fileBytes`.
function prependMeta(fileBytes: Uint8Array, meta: MetaEnvelope): Uint8Array {
  const metaBytes = new TextEncoder().encode(JSON.stringify(meta));
  const out = new Uint8Array(4 + metaBytes.length + fileBytes.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, metaBytes.length, false);
  out.set(metaBytes, 4);
  out.set(fileBytes, 4 + metaBytes.length);
  return out;
}

// Split a prefixed buffer back into metadata + file bytes.
// Returns null if the buffer is malformed.
function stripMeta(
  data: Uint8Array,
): { meta: MetaEnvelope; bytes: Uint8Array } | null {
  if (data.length < 4) return null;
  const dv = new DataView(data.buffer, data.byteOffset);
  const metaLen = dv.getUint32(0, false);
  if (4 + metaLen > data.length) return null;
  try {
    const meta = JSON.parse(
      new TextDecoder().decode(data.slice(4, 4 + metaLen)),
    ) as MetaEnvelope;
    return { meta, bytes: data.slice(4 + metaLen) };
  } catch {
    return null;
  }
}

// ---- FileTransferService ----------------------------------------------------

// Tracks which peer originated each in-flight file stream so the completed
// file can be attributed to the right sender.
class TrackingAssembler {
  private readonly inner: FileAssembler;
  // streamID (u32) → senderPeerID (16 hex)
  private readonly senderMap = new Map<number, string>();

  constructor(onComplete: (senderPeerID: string, data: Uint8Array) => void) {
    this.inner = new FileAssembler((streamID, data) => {
      const sender = this.senderMap.get(streamID) ?? "unknown";
      this.senderMap.delete(streamID);
      onComplete(sender, data);
    });
  }

  // Feed a FILE_TRANSFER packet; extracts the stream ID to track the sender.
  receive(packet: Packet): void {
    if (packet.payload.length >= 4) {
      const streamID = new DataView(
        packet.payload.buffer,
        packet.payload.byteOffset,
      ).getUint32(0, false);
      // Store sender for this stream (last write wins if chunks arrive from
      // different senders, which should never happen in practice).
      this.senderMap.set(streamID, bytesToHex(packet.senderID));
    }
    this.inner.receiveChunk(packet.payload);
  }
}

// ---------------------------------------------------------------------------

export class FileTransferService {
  private readonly assembler: TrackingAssembler;
  private readonly identity: ServiceIdentity;
  private readonly broadcast: BroadcastFn;
  private readonly unicast: UnicastFn;
  // Resolves a peerID to its announced nickname. Injected because the peer
  // registry lives in MeshService; without it an incoming attachment is
  // attributed to a raw hex fragment instead of the sender's name.
  private readonly resolveNickname?: (peerID: string) => string | undefined;

  // Paced outbound queue. See enqueue() for why this cannot be a tight loop.
  private readonly outQueue: {
    pkt: Packet;
    isDM: boolean;
    recipientPeerID: string;
  }[] = [];
  private drainTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    identity: ServiceIdentity,
    broadcast: BroadcastFn,
    unicast: UnicastFn,
    resolveNickname?: (peerID: string) => string | undefined,
  ) {
    this.identity = identity;
    this.broadcast = broadcast;
    this.unicast = unicast;
    this.resolveNickname = resolveNickname;

    this.assembler = new TrackingAssembler((senderPeerID, data) => {
      void this.onFileComplete(senderPeerID, data);
    });
  }

  // Receive a reassembled FILE_TRANSFER packet from the fragment layer.
  onFileTransfer(packet: Packet): void {
    // Drop our own echoes.
    if (bytesToHex(packet.senderID) === this.identity.peerID) return;
    this.assembler.receive(packet);
  }

  // Send file bytes with metadata over the mesh.
  // For DM channels ("dm:<peerID>") the chunks are unicast to the peer.
  // For public channels they are broadcast.
  sendBytes(
    fileBytes: Uint8Array,
    meta: AttachmentMeta,
    channel: string,
  ): void {
    if (fileBytes.length > MAX_ATTACHMENT_BYTES) {
      // Caller (message-thread.tsx) already shows the local message.
      // Throw so the async wrapper can catch and alert the user.
      throw new Error(
        `Attachment too large (${(fileBytes.length / 1024 / 1024).toFixed(1)} MB). Maximum is 25 MB.`,
      );
    }

    const isDM = channel.startsWith("dm:");
    const recipientPeerID = isDM ? channel.slice(3) : "";

    const envelope: MetaEnvelope = {
      t: meta.type,
      n: meta.name,
      m: meta.mimeType,
      d: meta.durationMs,
      c: channel,
    };
    const fullBytes = prependMeta(fileBytes, envelope);
    const chunks = encodeFileChunks(fullBytes);

    for (const chunk of chunks) {
      const pkt: Packet = {
        type: PacketType.FILE_TRANSFER,
        ttl: 7,
        flags: isDM ? Flags.HAS_RECIPIENT | Flags.SIGNED : Flags.SIGNED,
        senderID: hexToBytes(this.identity.peerID),
        recipientID: isDM
          ? hexToBytes(recipientPeerID)
          : new Uint8Array(BROADCAST_ID),
        timestamp: Math.floor(Date.now() / 1000),
        signature: new Uint8Array(64),
        payload: chunk.payload,
      };
      pkt.signature = signPacket(pkt, this.identity.signingPrivKey);

      // Fragment the chunk packet if it exceeds the BLE MTU limit.
      const encoded = encodePacket(pkt);
      if (encoded.length > FRAGMENT_SIZE) {
        const frags = fragmentPacket(pkt, this.identity, signPacket);
        for (const frag of frags) {
          this.enqueue(frag, isDM, recipientPeerID);
        }
      } else {
        this.enqueue(pkt, isDM, recipientPeerID);
      }
    }
  }

  // Queue a packet for paced transmission.
  //
  // Attachments MUST NOT be dispatched in a tight loop: a 1 MB file is ~2,200
  // fragments, and neither transport can absorb that back-to-back. On Android
  // gatt.writeCharacteristic starts refusing writes once its internal queue
  // fills (and the native bridge resolves anyway, so they vanish silently); on
  // iOS unacknowledged writes overrun the same way. The result is a transfer
  // that reassembles forever and never completes.
  //
  // Pacing at one fragment per tick is the same approach bitchat uses
  // (FragmentingPacketSender.interFragmentDelayMs = 20).
  private enqueue(pkt: Packet, isDM: boolean, recipientPeerID: string): void {
    this.outQueue.push({ pkt, isDM, recipientPeerID });
    this.scheduleDrain();
  }

  private scheduleDrain(): void {
    if (this.drainTimer !== null) return;
    this.drainTimer = setTimeout(() => {
      this.drainTimer = null;
      const next = this.outQueue.shift();
      if (next !== undefined) {
        this.dispatchPacket(next.pkt, next.isDM, next.recipientPeerID);
      }
      if (this.outQueue.length > 0) this.scheduleDrain();
    }, INTER_FRAGMENT_MS);
  }

  // Number of packets still waiting to go out, for tests and progress UI.
  get pendingCount(): number {
    return this.outQueue.length;
  }

  // Route a packet over BLE broadcast or unicast.
  private dispatchPacket(
    pkt: Packet,
    isDM: boolean,
    recipientPeerID: string,
  ): void {
    if (isDM) {
      this.unicast(recipientPeerID, pkt);
    } else {
      this.broadcast(pkt);
    }
  }

  // Called by the assembler when all chunks of a transfer have arrived.
  private async onFileComplete(
    senderPeerID: string,
    data: Uint8Array,
  ): Promise<void> {
    const result = stripMeta(data);
    if (!result) return;
    const { meta, bytes } = result;

    // Derive a safe file name for the cache path.
    const safeName = (meta.n || "file")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 64);
    // expo-file-system 57: writeAsStringAsync throws at runtime, and Paths.cache
    // is a Directory object (string-interpolating it produced a path literally
    // beginning "[object Object]"). The File API takes the directory plus a name
    // and writes the raw bytes, so no base64 round-trip is needed either.
    const file = new FileSystem.File(
      FileSystem.Paths.cache,
      `airhop_${String(Date.now())}_${safeName}`,
    );

    try {
      file.create({ overwrite: true, intermediates: true });
      file.write(bytes);
    } catch {
      // Disk write failed: skip adding the message rather than crashing.
      return;
    }
    const cacheUri = file.uri;

    const channel = meta.c || `dm:${senderPeerID}`;
    const type = (
      ["image", "voice", "document", "video"].includes(meta.t)
        ? meta.t
        : "document"
    ) as ChatAttachment["type"];

    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: `ft-${senderPeerID}-${Date.now()}`,
      channel,
      senderID: senderPeerID,
      senderNickname:
        this.resolveNickname?.(senderPeerID) ?? senderPeerID.slice(0, 8),
      text: "",
      timestampMs: Date.now(),
      isMine: false,
      attachment: {
        type,
        uri: cacheUri,
        name: meta.n || undefined,
        mimeType: meta.m || undefined,
        durationMs: meta.d || undefined,
      },
    });
  }
}
