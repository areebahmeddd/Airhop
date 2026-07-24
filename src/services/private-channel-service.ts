// Private channels bridged over Nostr (the "Bluetooth + Internet" reach).
//
// A private channel is normally BLE-only. When the creator opts into internet
// reach, its encrypted messages are ALSO published to Nostr so members who are
// out of Bluetooth range still receive them. The design mirrors the geohash
// channels, with the channel key standing in for the geohash:
//
//   - Every member derives the SAME Nostr keypair from the channel key
//     (deriveChannelNostrIdentity). Events are published under, and subscribed
//     to by, that single author pubkey. It is unguessable without the key and
//     unlinkable to anyone's real Nostr identity.
//   - The event content is the SAME sealed blob broadcast over BLE, base64'd.
//     A relay stores opaque ciphertext; only key-holders can open it.
//   - The sender-assigned message id is shared with the BLE copy, so a member
//     on both transports collapses the two into one bubble.
//
// Tradeoff (surfaced in the create UI): the author pubkey is a stable tag, so a
// relay can see a private channel's activity pattern, though never its content
// or the members' real identities. BLE-only leaks nothing correlatable.

import type { Event } from "nostr-tools";
import { finalizeEvent } from "nostr-tools";
import {
  deriveChannelNostrIdentity,
  openChannelMessage,
  type ChannelNostrIdentity,
} from "../core/mesh/channel-crypto";
import type { NostrClient } from "../core/nostr/nostr-client";
import { TAG_MESSAGE_ID } from "../core/nostr/presence";
import { useChatStore } from "../store/chat-store";
import { channelDisplayName } from "../utils/display-name";

// Ephemeral Nostr kind for Airhop private-channel messages (20000 = geohash
// chat, 20001 = presence, 20002 = private channel).
const KIND_PRIVATE_CHANNEL = 20002;

// Replay recent history on join so a channel is not empty on arrival; cap the
// burst. Mirrors the geohash channel lookback.
const LOOKBACK_SECONDS = 3600;
const INITIAL_LIMIT = 200;

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToBytes(s: string): Uint8Array | null {
  try {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

export class PrivateChannelService {
  private readonly client: NostrClient;
  private readonly localPeerID: string;
  // channel → unsubscribe.
  private readonly subscriptions = new Map<string, () => void>();
  // channel → derived Nostr identity (cached).
  private readonly identities = new Map<string, ChannelNostrIdentity>();

  constructor(client: NostrClient, localPeerID: string) {
    this.client = client;
    this.localPeerID = localPeerID;
  }

  private identityFor(
    channel: string,
    keyB64: string,
  ): ChannelNostrIdentity | null {
    let id = this.identities.get(channel);
    if (id === undefined) {
      const derived = deriveChannelNostrIdentity(keyB64);
      if (derived === null) return null;
      id = derived;
      this.identities.set(channel, id);
    }
    return id;
  }

  // Subscribe to every joined private channel whose reach is "ble+nostr", and
  // drop subscriptions for channels that were left or switched to BLE-only.
  // Safe to call repeatedly.
  refresh(): void {
    const state = useChatStore.getState();
    const wanted = state.channels.filter(
      (c) =>
        state.channelKeys[c] !== undefined &&
        state.channelReach[c] === "ble+nostr",
    );

    for (const channel of [...this.subscriptions.keys()]) {
      if (!wanted.includes(channel)) this.unsubscribe(channel);
    }
    for (const channel of wanted) {
      if (!this.subscriptions.has(channel)) {
        this.subscribe(channel, state.channelKeys[channel]);
      }
    }
  }

  // Publish an already-sealed private-channel message over Nostr.
  publish(
    channel: string,
    keyB64: string,
    blob: Uint8Array,
    msgId: string,
  ): void {
    const identity = this.identityFor(channel, keyB64);
    if (identity === null) return;
    try {
      const event = finalizeEvent(
        {
          kind: KIND_PRIVATE_CHANNEL,
          created_at: Math.floor(Date.now() / 1000),
          tags: [[TAG_MESSAGE_ID, msgId.slice(0, 32)]],
          content: bytesToBase64(blob),
        },
        identity.privKey,
      );
      void this.client.publish(event).catch(() => undefined);
    } catch {
      // Relay unreachable / signing failure: the BLE broadcast still happened.
    }
  }

  stop(): void {
    for (const channel of [...this.subscriptions.keys()]) {
      this.unsubscribe(channel);
    }
    this.identities.clear();
  }

  // ---- Private --------------------------------------------------------------

  private subscribe(channel: string, keyB64: string): void {
    const identity = this.identityFor(channel, keyB64);
    if (identity === null) return;

    const filter = {
      kinds: [KIND_PRIVATE_CHANNEL],
      authors: [identity.pubKeyHex],
      since: Math.floor(Date.now() / 1000) - LOOKBACK_SECONDS,
      limit: INITIAL_LIMIT,
    };

    const closer = this.client.subscribe([filter], (event: Event) => {
      const blob = base64ToBytes(event.content);
      if (blob === null) return;
      const opened = openChannelMessage(keyB64, blob);
      if (opened === null) return;
      // Ignore our own echo (rendered optimistically) and stale membership.
      if (opened.senderID === this.localPeerID) return;
      if (!useChatStore.getState().channels.includes(channel)) return;

      useChatStore.getState().addMessage({
        // Shared id with the BLE copy so both transports collapse to one bubble.
        id: `ch-${opened.msgId}`,
        channel,
        senderID: opened.senderID,
        senderNickname: channelDisplayName(
          opened.senderID,
          opened.senderNickname,
        ),
        text: opened.text,
        timestampMs: event.created_at * 1000,
        isMine: false,
      });
    });

    this.subscriptions.set(channel, () => closer.close());
  }

  private unsubscribe(channel: string): void {
    const close = this.subscriptions.get(channel);
    if (close !== undefined) {
      close();
      this.subscriptions.delete(channel);
    }
  }
}
