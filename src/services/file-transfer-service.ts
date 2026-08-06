// Attachment file transfer over BLE (or WiFi when available).
//
// Wire model (bitchat-compatible): a whole file is ONE FILE_TRANSFER (0x22)
// packet whose payload is a BitchatFilePacket TLV. The fragment layer splits it
// into BLE fragments that each fit one write and reassembles it on the far side,
// so there is no
// app-level chunking here. Airhop adds two TLV tags (channel, duration) that
// bitchat skips.
//
//   Send:    file bytes → BitchatFilePacket TLV → one FILE_TRANSFER packet
//            → fragmentPacket → paced FRAGMENT writes, one BLE frame each
//   Receive: FRAGMENT packets → FragmentManager reassembles the FILE_TRANSFER
//            packet → decode TLV → validate MIME → cache file → ChatMessage

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import * as FileSystem from "expo-file-system";
import {
  decodeFilePacket,
  encodeFilePacket,
  ensureFileExtension,
  isAllowedMime,
  maxBytesForType,
  mimeMatchesMagic,
  resolveMimeType,
  typeFromMime,
  wireFileName,
} from "../core/mesh/bitchat-file-packet";
import { fragmentPacket, MAX_BLE_FRAME } from "../core/mesh/fragment-manager";
import {
  BROADCAST_ID,
  encodePacket,
  Flags,
  isBroadcast,
  isForMe,
  PacketType,
  signPacket,
  type Packet,
} from "../core/mesh/packet-codec";
import { t } from "../i18n";
import { useChatStore, type ChatAttachment } from "../store/chat-store";
import { useTransferStore } from "../store/transfer-store";
import {
  attachmentFailureMessage,
  AttachmentFailureNotifier,
  type AttachmentFailure,
} from "../utils/attachment-failure";
import { BRIDGE_CHANNEL, canSendMedia } from "../utils/media-policy";

// ---- Types ------------------------------------------------------------------

// Delay between consecutive outbound fragments. Matches bitchat's
// FragmentingPacketSender.interFragmentDelayMs. Without it the radio drops
// fragments and the transfer never completes on the far side.
const INTER_FRAGMENT_MS = 20;

// How long to wait after the radio REFUSES a fragment before offering it again.
//
// 20ms of pacing assumes the link can always take the next write, and one-way
// that is roughly true: 456 data bytes every 20ms is ~22 KB/s, right at what BLE
// carries. It stops being true the moment the same link is also carrying a
// transfer in the other direction, which is what two people sending a photo at
// the same time does. The stack's write queue fills, it starts refusing, and
// backing off is the only thing that lets it drain.
const REFUSED_BACKOFF_MS = 60;

// How many consecutive refusals a single transfer tolerates before it is
// declared failed. At the backoff above this is about fifteen seconds of a link
// that will not take a single byte, which is a peer that has gone, not a busy
// radio. Counted per transfer so one dead conversation cannot fail another.
const REFUSAL_LIMIT = 250;

// Progress-store write throttle: refresh the card ~4x/sec rather than on every
// drained fragment.
const PROGRESS_UPDATE_MS = 250;

export interface AttachmentMeta {
  type: ChatAttachment["type"];
  name: string;
  mimeType: string;
  durationMs: number;
  // Optional WhatsApp-style caption. Rides the file packet as an Airhop TLV that
  // bitchat skips, so the media and its caption travel as one message.
  caption?: string;
}

// Only the attachment cache files Airhop writes carry this prefix, so a
// directory sweep never touches anything else in the shared cache dir. Exported
// because anything else that generates an attachment file (see image-compress)
// has to land under the same prefix, or the Storage screen would report a size
// that its Clear button cannot free.
export const CACHE_FILE_PREFIX = "airhop_";

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

// How long a received or sent attachment stays on disk.
//
// Seven days, matching bitchat's media retention sweep. The panic wipe was the
// only thing that ever removed an attachment, so a photo from a protest months
// ago was still on the device: the one piece of user content that outlived the
// conversation it belonged to. Files sit in the OS cache directory, which the
// system may reclaim under storage pressure, but that is an optimisation the OS
// makes for its own reasons and not a retention guarantee anyone should rely on.
//
// Seven days is long enough that a thread stays browsable across a week away
// from signal, and short enough that a seized phone is not an archive.
export const MEDIA_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Delete attachments older than MEDIA_MAX_AGE_MS. Returns the bytes freed.
//
// Covers outgoing as well as incoming: both are written under the same prefix,
// and a photo you sent is exactly as sensitive as one you received. Called at
// launch rather than on a timer, because a device that is never opened is also
// never accumulating anything new.
//
// A file whose age cannot be read is kept. The alternative is deleting user
// content on the strength of a missing timestamp, and on Android
// `creationTime` is genuinely absent below API 26, so an unreadable age is an
// expected state rather than a corrupt one.
// Most files removed in one pass.
//
// Each delete is a synchronous native call, and this runs at launch, so an
// unbounded sweep over a very large cache would show up as a slow start. The
// bound is safe rather than a silent truncation: the sweep is idempotent and
// runs every launch, so a backlog drains over the next few starts and the
// oldest files still go first in wall-clock terms because nothing older is
// being created behind them.
const MAX_SWEEP_DELETIONS = 200;

export function sweepExpiredAttachments(
  now: number = Date.now(),
  maxAgeMs: number = MEDIA_MAX_AGE_MS,
): number {
  const dir = new FileSystem.Directory(FileSystem.Paths.cache);
  if (!dir.exists) return 0;
  let freed = 0;
  let deleted = 0;
  for (const entry of dir.list()) {
    if (deleted >= MAX_SWEEP_DELETIONS) break;
    if (
      !(entry instanceof FileSystem.File) ||
      !entry.name.startsWith(CACHE_FILE_PREFIX)
    ) {
      continue;
    }
    const writtenAt = entry.modificationTime ?? entry.creationTime;
    if (writtenAt === null || writtenAt === undefined) continue;
    // A timestamp in the future is a clock that moved, not a fresh file. Left
    // alone: deleting on a bad clock is the worse failure of the two.
    if (now - writtenAt <= maxAgeMs) continue;
    const size = entry.size;
    try {
      entry.delete();
      freed += size;
      deleted++;
    } catch {
      // Mid-write, locked, or already gone. It will be caught next launch.
    }
  }
  return freed;
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

// Both resolve to whether the RADIO ACCEPTED the packet, not whether anyone
// received it (there are no per-fragment acknowledgements on this wire). A
// false is the transport saying "my write queue is full, do not hand me another
// one yet", which is the difference between pacing and losing a file: a refused
// fragment that is not offered again is a stream the far side can never
// complete, and it has no way to ask for it.
export type BroadcastFn = (packet: Packet) => Promise<boolean>;
export type UnicastFn = (
  recipientPeerID: string,
  packet: Packet,
) => Promise<boolean>;

// Told once per attachment whether it actually left the device, so the bubble
// can settle on "sent" or fall back to the red tap-to-retry mark instead of
// claiming a send the radio refused.
export type SendOutcome = (delivered: boolean) => void;

// Seal a file TLV inside the peer's Noise session as payload 0x20, returning
// the NOISE_ENCRYPTED packet ready to fragment. Returns null when the peer has
// not proven it can read one (no session, or no authenticated bit 8), and the
// caller then falls back to the signed cleartext form.
//
// Injected rather than reached for, so this service keeps knowing nothing about
// sessions, capabilities or the registry.
export type SealFileFn = (
  recipientPeerID: string,
  fileTlv: Uint8Array,
) => Packet | null;

// NOTE: naming lives in wireFileName(), which owns the extension and bitchat's
// stable-ID shape together. Nothing here may put localized UI copy on the wire:
// a display word is not a file name, and one without an extension arrives as a
// file the OS cannot open.

// The one send failure worth repeating to the sender verbatim: it names a
// limit they can do something about. Everything else that can go wrong in here
// is a runtime fault, and the UI says so in its own words rather than putting a
// stack-machine message in front of a person.
export class AttachmentTooLargeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AttachmentTooLargeError";
  }
}

// How an over-size attachment refers to itself in the error the sender reads.
// Exported so the composer can refuse an oversized file at pick time with the
// same wording the transfer layer uses when it catches one late.
export function sizeLabel(type: ChatAttachment["type"]): string {
  switch (type) {
    case "image":
      return t("transfer.this.photo");
    case "video":
      return t("transfer.this.video");
    case "voice":
      return t("transfer.this.voice");
    default:
      return t("transfer.this.file");
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
      // Consecutive refusals from the radio for this transfer's fragments.
      // Reset by any accepted write; see REFUSAL_LIMIT.
      refusals: number;
      onOutcome?: SendOutcome;
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
  // Monotonic, so back-to-back sends cannot collide on a transfer id.
  private transferSeq = 0;

  private readonly sealFile?: SealFileFn;

  // Throttles the "that attachment didn't arrive" line, per sender.
  private readonly failureNotifier = new AttachmentFailureNotifier();

  constructor(
    identity: ServiceIdentity,
    broadcast: BroadcastFn,
    unicast: UnicastFn,
    resolveNickname?: (peerID: string) => string | undefined,
    sealFile?: SealFileFn,
  ) {
    this.identity = identity;
    this.broadcast = broadcast;
    this.unicast = unicast;
    this.resolveNickname = resolveNickname;
    this.sealFile = sealFile;
  }

  // Receive a fully reassembled FILE_TRANSFER packet from the fragment layer.
  onFileTransfer(packet: Packet): void {
    if (bytesToHex(packet.senderID) === this.identity.peerID) return;
    void this.handleIncoming(packet);
  }

  // Receive a file that arrived sealed inside a Noise session (payload 0x20).
  //
  // Confidentiality and authenticity both come from the session it arrived in:
  // the packet decrypted under a session whose remote static key hashes to this
  // peer ID, which says more about the sender than a signature carried beside
  // the file would. So there is no separate signature to check here, as with a
  // DM voice burst.
  onSealedFile(senderPeerID: string, fileTlv: Uint8Array): void {
    if (senderPeerID === this.identity.peerID) return;
    void this.handleIncoming(
      {
        type: PacketType.FILE_TRANSFER,
        ttl: 0,
        flags: Flags.HAS_RECIPIENT,
        senderID: hexToBytes(senderPeerID),
        recipientID: hexToBytes(this.identity.peerID),
        timestamp: Date.now(),
        signature: new Uint8Array(64),
        payload: fileTlv,
      },
      true,
    );
  }

  // Cancel an outgoing transfer by its UI id (incoming files reassemble in the
  // fragment layer and simply time out if abandoned).
  cancel(transferId: string): void {
    if (transferId.startsWith("tx-")) {
      const tx = this.outbound.get(transferId);
      // Delete the accounting BEFORE clearing the queue: a fragment already
      // awaiting the radio checks for it on the way back, and its absence is
      // what stops a cancelled transfer requeueing itself.
      this.outbound.delete(transferId);
      for (let i = this.outQueue.length - 1; i >= 0; i--) {
        if (this.outQueue[i].transferId === transferId) {
          this.outQueue.splice(i, 1);
        }
      }
      // The bubble is still showing "sending". Settle it, or it sits on a clock
      // face forever for a transfer that is never coming back.
      tx?.onOutcome?.(false);
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
    onOutcome?: SendOutcome,
  ): void {
    // Per-type cap, matching bitchat: over it the far side refuses the file, so
    // fail here with something the sender can act on rather than after a minute
    // of progress that was never going to land.
    const cap = maxBytesForType(meta.type);
    if (fileBytes.length > cap) {
      throw new AttachmentTooLargeError(
        t("transfer.too_large", {
          kind: sizeLabel(meta.type),
          size: (fileBytes.length / 1024).toFixed(0),
          cap: (cap / 1024).toFixed(0),
        }),
      );
    }

    const isDM = channel.startsWith("dm:");
    const recipientPeerID = isDM ? channel.slice(3) : "";
    // Type first, then name: both sides read the type off the extension once
    // the file is on disk, so the name follows the MIME. Never the picker's raw
    // value, since an empty or unrecognised type is dropped on arrival.
    const mimeType = resolveMimeType(meta.mimeType, meta.name || undefined);
    const fileName = wireFileName(meta.type, meta.name, mimeType);

    const tlv = encodeFilePacket({
      fileName,
      mimeType,
      content: fileBytes,
      // A DM is routed by the packet's recipient ID (bitchat-compatible), so we
      // omit the channel tag; a channel attachment carries it for Airhop routing.
      channel: isDM ? undefined : channel,
      durationMs: meta.durationMs > 0 ? meta.durationMs : undefined,
      caption:
        meta.caption && meta.caption.length > 0 ? meta.caption : undefined,
    });
    if (tlv === null) return;

    // A private file goes inside the Noise session when the recipient has
    // proven it can read one.
    //
    // The cleartext form below is signed, so a relay cannot forge its sender or
    // contents, but it is not confidential and every node the file crosses sees
    // all of it. bitchat classifies that form as the legacy migration fallback
    // and has scheduled its removal.
    //
    // The gate is the authenticated capability, never the announced one. An
    // announce is self-signed with a key it carries, so anyone who reads a
    // victim's public Noise key off the air can announce any bits under that
    // peer ID. Gating on it would let anyone in range clear bit 8 for a peer
    // and force every attachment into the clear.
    const sealed = isDM
      ? (this.sealFile?.(recipientPeerID, tlv) ?? null)
      : null;

    const pkt: Packet =
      sealed ??
      (() => {
        const raw: Packet = {
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
        raw.signature = signPacket(raw, this.identity.signingPrivKey);
        return raw;
      })();

    // One packet becomes many BLE fragments; a small file may fit in one frame.
    const items: Packet[] =
      encodePacket(pkt).length > MAX_BLE_FRAME
        ? fragmentPacket(pkt, this.identity)
        : [pkt];

    // A counter, not just the clock: two attachments queued in the same
    // millisecond would otherwise share an id, and the second would take over
    // the first's progress accounting and leave its card stuck.
    this.transferSeq += 1;
    const transferId = `tx-${this.identity.peerID}-${String(Date.now())}-${String(this.transferSeq)}`;
    const perItemBytes = fileBytes.length / (items.length || 1);
    this.outbound.set(transferId, {
      remaining: items.length,
      totalBytes: fileBytes.length,
      sentBytes: 0,
      lastPushMs: Date.now(),
      refusals: 0,
      onOutcome,
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
      name: fileName,
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

  private scheduleDrain(delayMs: number = INTER_FRAGMENT_MS): void {
    if (this.drainTimer !== null) return;
    this.drainTimer = setTimeout(() => {
      this.drainTimer = null;
      void this.drainOne();
    }, delayMs);
  }

  // Hand exactly one fragment to the radio and react to what it says.
  //
  // The whole file depends on this being honest. Progress used to be counted
  // the instant a fragment was handed over, so a refused write left the sender
  // marching to 100% and "sent" while the receiver sat on a stream missing its
  // third fragment forever, went quiet, and failed. Now a refusal keeps the
  // fragment: it goes back to the front of the queue (order matters to nothing
  // on the wire, but retrying out of order would leave gaps behind), the pacing
  // eases off to let the stack drain, and nothing is counted as sent until it is.
  private async drainOne(): Promise<void> {
    const next = this.outQueue.shift();
    if (next === undefined) return;

    let accepted = false;
    try {
      accepted = next.isDM
        ? await this.unicast(next.recipientPeerID, next.pkt)
        : await this.broadcast(next.pkt);
    } catch {
      // A transport that threw is a transport that did not take it.
      accepted = false;
    }

    const tx =
      next.transferId !== undefined
        ? this.outbound.get(next.transferId)
        : undefined;

    if (accepted) {
      if (tx !== undefined) tx.refusals = 0;
      if (next.transferId !== undefined) {
        this.reportSendProgress(next.transferId, next.weight ?? 0);
      }
    } else if (next.transferId === undefined) {
      // Not part of a tracked transfer, so there is no card to fail and nobody
      // waiting on it. Drop it rather than retrying forever.
    } else if (tx === undefined) {
      // Cancelled while this fragment was in flight. Its accounting is already
      // gone, so requeueing would resurrect a transfer the user stopped.
    } else {
      tx.refusals += 1;
      if (tx.refusals >= REFUSAL_LIMIT) {
        this.failTransfer(next.transferId);
      } else {
        this.outQueue.unshift(next);
      }
    }

    if (this.outQueue.length > 0) {
      this.scheduleDrain(accepted ? INTER_FRAGMENT_MS : REFUSED_BACKOFF_MS);
    }
  }

  // Give up on a transfer the radio will not carry: drop its queued fragments,
  // fail its card, and tell the caller so the bubble stops claiming it was sent.
  private failTransfer(transferId: string): void {
    const tx = this.outbound.get(transferId);
    this.outbound.delete(transferId);
    for (let i = this.outQueue.length - 1; i >= 0; i--) {
      if (this.outQueue[i].transferId === transferId) {
        this.outQueue.splice(i, 1);
      }
    }
    useTransferStore.getState().fail(transferId);
    tx?.onOutcome?.(false);
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
      // Every fragment was accepted by the radio. That is as much as this side
      // can ever know: files carry no delivery receipt on either app.
      tx.onOutcome?.(true);
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

  // Record a refused attachment, and tell the reader when it is theirs to know.
  //
  // Silent everywhere except an existing direct-message thread:
  //
  //   - A broadcast failure is nobody's in particular, and anyone in range can
  //     put a malformed packet on the air.
  //   - The thread must already exist, or a stranger could conjure a
  //     conversation in someone's list out of pure garbage. Same shape as the
  //     channel-tag check above.
  //   - Throttled per sender even then, since a directed packet can be sent
  //     repeatedly by anyone in range.
  private noteRejected(
    senderPeerID: string,
    directedToMe: boolean,
    reason: AttachmentFailure,
  ): void {
    if (!directedToMe) return;
    const channel = `dm:${senderPeerID}`;
    const chat = useChatStore.getState();
    if (!chat.channels.includes(channel)) return;
    if (!this.failureNotifier.shouldNotify(senderPeerID, Date.now())) return;

    chat.addMessage({
      id: `ft-fail-${senderPeerID}-${Date.now()}`,
      channel,
      senderID: senderPeerID,
      senderNickname:
        this.resolveNickname?.(senderPeerID) ?? senderPeerID.slice(0, 8),
      text: attachmentFailureMessage(reason),
      timestampMs: Date.now(),
      isMine: false,
      isSystem: true,
    });
  }

  // Decode, validate, cache, and render an incoming file.
  // `sealed` says the bytes arrived inside a Noise session rather than in the
  // open. It is set only by onSealedFile, where the session has already proven
  // the sender and the addressee, so the two wire-level checks below (is this
  // for me, and is the claimed sender real) are already answered.
  private async handleIncoming(packet: Packet, sealed = false): Promise<void> {
    const senderPeerID = bytesToHex(packet.senderID);

    // Resolved from the header alone, before the payload is touched, so a
    // packet that fails to decode can still be told apart from one that was
    // simply passing through on its way to somebody else. Relayed traffic must
    // stay silent: it is not our failure and not our business.
    const directedToMe =
      sealed || isForMe(packet, hexToBytes(this.identity.peerID));

    const fp = decodeFilePacket(packet.payload);
    if (fp === null) {
      this.noteRejected(senderPeerID, directedToMe, "malformed");
      return;
    }
    // Reject a disallowed or mislabeled type before writing anything to disk.
    if (!isAllowedMime(fp.mimeType)) {
      this.noteRejected(senderPeerID, directedToMe, "unsupported-type");
      return;
    }
    if (!mimeMatchesMagic(fp.mimeType, fp.content)) {
      this.noteRejected(senderPeerID, directedToMe, "type-mismatch");
      return;
    }

    // A directed attachment is for its addressee, not for whoever relays it.
    //
    // FILE_TRANSFER floods like everything else, so a DM attachment travelling
    // from A to B is forwarded by B onto all of B's other links, and by every
    // node after that, out to TTL 7. Without this check each of those nodes fell
    // into the `dm:<sender>` branch below, wrote the file to its own cache and
    // rendered it in its own thread with A. A private photo sent to one person
    // was therefore readable by every device within seven hops of either end,
    // with no key, no session and no signature needed - only proximity.
    //
    // Every other directed handler in mesh-service already scopes itself this
    // way (onNoiseHandshake, onNoiseEncrypted, onDREncrypted, onPing, onPong);
    // this path was the exception. bitchat scopes it in
    // BLEFileTransferPolicy.deliveryPlan, which returns "relay only, do not
    // deliver" when recipientID is not the local peer.
    //
    // Relaying is unaffected: that already happened in handleRaw before this
    // point, so forwarding for other people still works. Only the decision to
    // DELIVER is narrowed.
    if (!sealed && !isBroadcast(packet) && !directedToMe) {
      return;
    }

    // The channel tag is attacker-controlled: it is an arbitrary UTF-8 string
    // read straight off the wire, and it used to decide, unchecked, which room
    // the attachment landed in. Two rules bring it in line with the rest of the
    // app, both mirroring what already exists elsewhere:
    //
    //   - It must name a room the user actually joined. onChannelMsg makes the
    //     same check with the same reasoning ("any peer in radio range could
    //     inject arbitrary channels into someone's list"), and this path is the
    //     one that was still calling addChannel() on an unvalidated name.
    //   - Media may only travel where canSendMedia() allows. The send side has
    //     always refused to put an attachment into a private #channel or a
    //     group: an attachment is signed but NOT encrypted, so one landing in an
    //     encrypted room breaks exactly the promise that room makes. Enforcing
    //     it only when sending meant an outsider who knew the room's name could
    //     do what a member is forbidden from doing.
    //
    // Only the tag is validated. The derived fallbacks below are computed here
    // from the packet's own routing, so they are not attacker-chosen: a DM is
    // addressed by recipient ID and carries no tag at all (bitchat routes DM
    // attachments the same way), which is why this is not simply a blanket
    // membership check that would drop a first attachment from a new contact.
    if (fp.channel !== undefined) {
      if (!canSendMedia(fp.channel)) return;
      if (!useChatStore.getState().channels.includes(fp.channel)) return;
    }

    // Route: the Airhop channel tag if present, else a DM to us by sender, else
    // the public mesh room.
    const channel =
      fp.channel ??
      (isBroadcast(packet) ? BRIDGE_CHANNEL : `dm:${senderPeerID}`);
    const type = typeFromMime(fp.mimeType);

    // Repair the extension from the MIME before writing: the photo library and
    // the audio player read the type off it and ignore the MIME. Truncate
    // first, so a long name loses its middle rather than its extension.
    const safeName = ensureFileExtension(
      (fp.fileName || "file").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 64),
      fp.mimeType ?? "",
    );
    const file = new FileSystem.File(
      FileSystem.Paths.cache,
      `airhop_${String(Date.now())}_${safeName}`,
    );
    try {
      file.create({ overwrite: true, intermediates: true });
      file.write(fp.content);
    } catch {
      // Decoded and validated, then the disk refused it. Worth saying out loud:
      // unlike the checks above, this one is the receiver's problem to fix
      // (free space, permissions) rather than the sender's to resend around.
      this.noteRejected(senderPeerID, directedToMe, "storage");
      return;
    }

    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: `ft-${senderPeerID}-${Date.now()}`,
      channel,
      senderID: senderPeerID,
      senderNickname:
        this.resolveNickname?.(senderPeerID) ?? senderPeerID.slice(0, 8),
      // The caption rides with the file, so the received bubble shows the media
      // and its caption together, exactly as the sender composed it.
      text: fp.caption ?? "",
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
