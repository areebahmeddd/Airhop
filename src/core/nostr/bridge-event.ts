// Mesh-bridge rendezvous events.
//
// When bridging, a peer republishes its public #bluetooth mesh messages to a
// geohash-cell rendezvous on Nostr, so a separate mesh island subscribed to the
// same cell sees them. Byte-compatible with bitchat NostrProtocol
// createBridgeMeshEvent / createBridgePresenceEvent.
//
// A distinct `r` tag (not `g`) keeps bridge traffic out of geohash-channel
// subscriptions, which filter on `#g`. Messages are kind 20000; presence
// heartbeats are kind 20001. Both are signed by an unlinkable per-cell identity,
// so a relay or gateway cannot forge them.

import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { finalizeEvent, type Event as NostrEvent } from "nostr-tools";

const KIND_BRIDGE_MESSAGE = 20000;
const KIND_BRIDGE_PRESENCE = 20001;
const TAG_RENDEZVOUS = "r";
const TAG_NICKNAME = "n";
const TAG_MESH = "m";

// Content-derived, cross-device-stable ID for a public mesh message. Every
// device recomputes the same value from the signed wire fields (sender ID, ms
// timestamp, trimmed content), so a bridged copy can be matched against the
// radio copy already on the timeline without a wire ID. Mirrors bitchat
// MeshMessageIdentity.stableID (SHA-256 hex, first 32 chars).
export function bridgeStableID(
  senderIDHex: string,
  timestampMs: number,
  content: string,
): string {
  const input = `${senderIDHex.toLowerCase()}|${timestampMs}|${content.trim()}`;
  return bytesToHex(sha256(new TextEncoder().encode(input))).slice(0, 32);
}

// Build + sign a rendezvous copy of a public mesh message. `meshSenderID`/
// `meshTimestampMs` are the origin coordinates of the radio send; with the
// content they derive the stable ID receivers dedup on. Omit them for a message
// with no radio origin (none today, but the codec stays general).
export function createBridgeMeshEvent(params: {
  content: string;
  cell: string;
  privKey: Uint8Array; // per-cell rendezvous identity private key
  nickname?: string;
  meshSenderID?: string; // origin peerID hex of the radio send
  meshTimestampMs?: number;
}): NostrEvent {
  const tags: string[][] = [[TAG_RENDEZVOUS, params.cell]];
  const nick = params.nickname?.trim();
  if (nick !== undefined && nick.length > 0) {
    tags.push([TAG_NICKNAME, nick.slice(0, 32)]);
  }
  if (
    params.meshSenderID !== undefined &&
    params.meshSenderID.length > 0 &&
    params.meshTimestampMs !== undefined
  ) {
    const stableID = bridgeStableID(
      params.meshSenderID,
      params.meshTimestampMs,
      params.content,
    );
    tags.push([
      TAG_MESH,
      stableID,
      params.meshSenderID,
      String(params.meshTimestampMs),
    ]);
  }
  return finalizeEvent(
    {
      kind: KIND_BRIDGE_MESSAGE,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content: params.content,
    },
    params.privKey,
  );
}

// Build + sign a rendezvous presence heartbeat: empty content, `r` tag only.
export function createBridgePresenceEvent(
  cell: string,
  privKey: Uint8Array,
): NostrEvent {
  return finalizeEvent(
    {
      kind: KIND_BRIDGE_PRESENCE,
      created_at: Math.floor(Date.now() / 1000),
      tags: [[TAG_RENDEZVOUS, cell]],
      content: "",
    },
    privKey,
  );
}

// Parsed view of an inbound rendezvous event.
export interface ParsedBridgeEvent {
  kind: "message" | "presence";
  cell: string; // the `r` tag cell
  content: string;
  nickname?: string;
  radioMessageIDHint?: string; // `m[1]` stable ID, a radio-copy dedup hint only
  meshSenderID?: string; // `m[2]`, origin peerID hex (public, not authenticated)
}

// Classify + extract an inbound rendezvous event. Returns null if it is not a
// well-formed bridge event (missing `r` tag, or an unhandled kind). The `m`-tag
// fields are a radio-copy HINT only: sender/timestamp/content are public, so a
// different Nostr signer can copy them; never trust them to authenticate.
export function parseBridgeEvent(event: NostrEvent): ParsedBridgeEvent | null {
  const cell = event.tags.find(
    (t) => t.length >= 2 && t[0] === TAG_RENDEZVOUS,
  )?.[1];
  if (cell === undefined || cell.length === 0) return null;

  if (event.kind === KIND_BRIDGE_PRESENCE) {
    return { kind: "presence", cell, content: "" };
  }
  if (event.kind !== KIND_BRIDGE_MESSAGE) return null;

  const nickname = event.tags.find(
    (t) => t.length >= 2 && t[0] === TAG_NICKNAME,
  )?.[1];
  const mTag = event.tags.find((t) => t.length >= 2 && t[0] === TAG_MESH);
  return {
    kind: "message",
    cell,
    content: event.content,
    nickname,
    radioMessageIDHint: mTag?.[1],
    meshSenderID: mTag?.[2],
  };
}
