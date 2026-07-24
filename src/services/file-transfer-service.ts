// Attachment file transfer over BLE (or WiFi when available).
//
// Wire model (bitchat-compatible): a whole file is ONE FILE_TRANSFER (0x22)
// packet whose payload is a BitchatFilePacket TLV. The fragment layer splits it
// into 469-byte BLE fragments and reassembles it on the far side, so there is no
// app-level chunking here. Airhop adds two TLV tags (channel, duration) that
// bitchat skips.
//
//   Send:    file bytes → BitchatFilePacket TLV → one FILE_TRANSFER packet
//            → fragmentPacket → paced 469-byte FRAGMENT writes
//   Receive: FRAGMENT packets → FragmentManager reassembles the FILE_TRANSFER
//            packet → decode TLV → validate MIME → cache file → ChatMessage

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import * as FileSystem from "expo-file-system";
import {
  decodeFilePacket,
  encodeFilePacket,
  isAllowedMime,
  MAX_FILE_BYTES,
  mimeMatchesMagic,
  typeFromMime,
} from "../core/mesh/bitchat-file-packet";
import { FRAGMENT_SIZE, fragmentPacket } from "../core/mesh/fragment-manager";
import {
  BROADCAST_ID,
  encodePacket,
  Flags,
  isBroadcast,
  PacketType,
  signPacket,
  type Packet,
} from "../core/mesh/packet-codec";
import { useChatStore, type ChatAttachment } from "../store/chat-store";
import { useTransferStore } from "../store/transfer-store";

// ---- Types ------------------------------------------------------------------

// Delay between consecutive outbound fragments. Matches bitchat's
// FragmentingPacketSender.interFragmentDelayMs. Without it the radio drops
// fragments and the transfer never completes on the far side.
const INTER_FRAGMENT_MS = 20;

// Progress-store write throttle: refresh the card ~4x/sec rather than on every
// drained fragment.
const PROGRESS_UPDATE_MS = 250;

export interface AttachmentMeta {
  type: ChatAttachment["type"];
  name: string;
  mimeType: string;
  durationMs: number;
}

// Only the attachment cache files this service writes carry this prefix, so a
// directory sweep never touches anything else in the shared cache dir.
const CACHE_FILE_PREFIX = "airhop_";

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

function defaultAttachmentName(type: ChatAttachment["type"]): string {
  switch (type) {
    case "image":
      return "Photo";
    case "video":
      return "Video";
    case "voice":
      return "Voice note";
    default:
      return "File";
  }
}

interface ServiceIdentity {
  peerID: string;
  signingPrivKey: Uint8Array;
}

// ---- FileTransferService ----------------------------------------------------

export class FileTransferService {
  private readonly identity: ServiceIdentity;
  private readonly broadcast: BroadcastFn;
  private readonly unicast: UnicastFn;
  private readonly resolveNickname?: (peerID: string) => string | undefined;

  // Send-side progress accounting, keyed by the UI transfer id.
  private readonly outbound = new Map<
    string,
    {
      remaining: number;
      totalBytes: number;
      sentBytes: number;
      lastPushMs: number;
    }
  >();

  // Paced outbound queue (one fragment per tick).
  private readonly outQueue: {
    pkt: Packet;
    isDM: boolean;
    recipientPeerID: string;
    transferId?: string;
    weight?: number;
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
  }

  // Receive a fully reassembled FILE_TRANSFER packet from the fragment layer.
  onFileTransfer(packet: Packet): void {
    if (bytesToHex(packet.senderID) === this.identity.peerID) return;
    void this.handleIncoming(packet);
  }

  // Cancel an outgoing transfer by its UI id (incoming files reassemble in the
  // fragment layer and simply time out if abandoned).
  cancel(transferId: string): void {
    if (transferId.startsWith("tx-")) {
      this.outbound.delete(transferId);
      for (let i = this.outQueue.length - 1; i >= 0; i--) {
        if (this.outQueue[i].transferId === transferId) {
          this.outQueue.splice(i, 1);
        }
      }
    }
    useTransferStore.getState().cancel(transferId);
  }

  // Send a file as one BitchatFilePacket. DMs unicast to the peer (routed by
  // recipient ID, as bitchat does); channel attachments broadcast and carry the
  // channel in an Airhop TLV so they land in the right room.
  sendBytes(
    fileBytes: Uint8Array,
    meta: AttachmentMeta,
    channel: string,
  ): void {
    if (fileBytes.length > MAX_FILE_BYTES) {
      throw new Error(
        `Attachment too large (${(fileBytes.length / 1024).toFixed(0)} KB). Maximum is 1 MB.`,
      );
    }

    const isDM = channel.startsWith("dm:");
    const recipientPeerID = isDM ? channel.slice(3) : "";

    const tlv = encodeFilePacket({
      fileName: meta.name || defaultAttachmentName(meta.type),
      mimeType: meta.mimeType,
      content: fileBytes,
      // A DM is routed by the packet's recipient ID (bitchat-compatible), so we
      // omit the channel tag; a channel attachment carries it for Airhop routing.
      channel: isDM ? undefined : channel,
      durationMs: meta.durationMs > 0 ? meta.durationMs : undefined,
    });
    if (tlv === null) return;

    const pkt: Packet = {
      type: PacketType.FILE_TRANSFER,
      ttl: 7,
      flags: isDM ? Flags.HAS_RECIPIENT | Flags.SIGNED : Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: isDM
        ? hexToBytes(recipientPeerID)
        : new Uint8Array(BROADCAST_ID),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: tlv,
    };
    pkt.signature = signPacket(pkt, this.identity.signingPrivKey);

    // One packet becomes many BLE fragments; a small file may fit in one frame.
    const items: Packet[] =
      encodePacket(pkt).length > FRAGMENT_SIZE
        ? fragmentPacket(pkt, this.identity, signPacket)
        : [pkt];

    const transferId = `tx-${this.identity.peerID}-${String(Date.now())}`;
    const perItemBytes = fileBytes.length / (items.length || 1);
    this.outbound.set(transferId, {
      remaining: items.length,
      totalBytes: fileBytes.length,
      sentBytes: 0,
      lastPushMs: Date.now(),
    });
    useTransferStore.getState().begin({
      id: transferId,
      direction: "send",
      channel,
      peerLabel: isDM
        ? (this.resolveNickname?.(recipientPeerID) ??
          recipientPeerID.slice(0, 8))
        : "",
      type: meta.type,
      name: meta.name || defaultAttachmentName(meta.type),
      totalBytes: fileBytes.length,
      startedAtMs: Date.now(),
    });

    for (const item of items) {
      this.enqueue(item, isDM, recipientPeerID, transferId, perItemBytes);
    }
  }

  private enqueue(
    pkt: Packet,
    isDM: boolean,
    recipientPeerID: string,
    transferId?: string,
    weight?: number,
  ): void {
    this.outQueue.push({ pkt, isDM, recipientPeerID, transferId, weight });
    this.scheduleDrain();
  }

  private scheduleDrain(): void {
    if (this.drainTimer !== null) return;
    this.drainTimer = setTimeout(() => {
      this.drainTimer = null;
      const next = this.outQueue.shift();
      if (next !== undefined) {
        if (next.isDM) this.unicast(next.recipientPeerID, next.pkt);
        else this.broadcast(next.pkt);
        if (next.transferId !== undefined) {
          this.reportSendProgress(next.transferId, next.weight ?? 0);
        }
      }
      if (this.outQueue.length > 0) this.scheduleDrain();
    }, INTER_FRAGMENT_MS);
  }

  private reportSendProgress(transferId: string, weight: number): void {
    const tx = this.outbound.get(transferId);
    if (tx === undefined) return;
    tx.sentBytes += weight;
    tx.remaining -= 1;
    const store = useTransferStore.getState();
    if (tx.remaining <= 0) {
      this.outbound.delete(transferId);
      store.finish(transferId);
      return;
    }
    const now = Date.now();
    if (now - tx.lastPushMs >= PROGRESS_UPDATE_MS) {
      tx.lastPushMs = now;
      store.advance(transferId, tx.sentBytes);
    }
  }

  get pendingCount(): number {
    return this.outQueue.length;
  }

  // Decode, validate, cache, and render an incoming file.
  private async handleIncoming(packet: Packet): Promise<void> {
    const fp = decodeFilePacket(packet.payload);
    if (fp === null) return;
    // Reject a disallowed or mislabeled type before writing anything to disk.
    if (!isAllowedMime(fp.mimeType)) return;
    if (!mimeMatchesMagic(fp.mimeType, fp.content)) return;

    const senderPeerID = bytesToHex(packet.senderID);
    // Route: the Airhop channel tag if present, else a DM to us by sender, else
    // the public mesh room.
    const channel =
      fp.channel ?? (isBroadcast(packet) ? "#bluetooth" : `dm:${senderPeerID}`);
    const type = typeFromMime(fp.mimeType);

    const safeName = (fp.fileName || "file")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 64);
    const file = new FileSystem.File(
      FileSystem.Paths.cache,
      `airhop_${String(Date.now())}_${safeName}`,
    );
    try {
      file.create({ overwrite: true, intermediates: true });
      file.write(fp.content);
    } catch {
      return;
    }

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
        uri: file.uri,
        name: fp.fileName ?? undefined,
        mimeType: fp.mimeType ?? undefined,
        durationMs: fp.durationMs ?? undefined,
        sizeBytes: fp.content.length,
      },
    });
  }
}
