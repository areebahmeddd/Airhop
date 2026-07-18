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

// Encode a Uint8Array to base64 (uses the same atob/btoa available in Hermes).
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
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

  constructor(
    identity: ServiceIdentity,
    broadcast: BroadcastFn,
    unicast: UnicastFn,
  ) {
    this.identity = identity;
    this.broadcast = broadcast;
    this.unicast = unicast;

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
          this.dispatchPacket(frag, isDM, recipientPeerID);
        }
      } else {
        this.dispatchPacket(pkt, isDM, recipientPeerID);
      }
    }
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
    const cacheDir = FileSystem.cacheDirectory ?? "";
    const cacheUri = `${cacheDir}airhop_${Date.now()}_${safeName}`;

    try {
      await FileSystem.writeAsStringAsync(cacheUri, bytesToBase64(bytes), {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch {
      // Disk write failed: skip adding the message rather than crashing.
      return;
    }

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
      senderNickname: senderPeerID.slice(0, 8),
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
