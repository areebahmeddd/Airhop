// Live attachment transfer progress.
//
// Files move slowly over Bluetooth (~22 KB/s), so a 50 MB transfer can run for
// half an hour. Without visible progress the user has no way to tell a working
// transfer from a stuck one. This store holds the in-flight transfers so the
// chat UI can show a progress card with percentage, speed and ETA.
//
// Two honesties to keep in mind when reading these numbers:
//   - Send progress reflects bytes handed to the radio, not bytes the far side
//     confirmed. There is no per-fragment acknowledgement, so "sent" is
//     optimistic.
//   - Receive progress reflects chunks that actually arrived and reassembled,
//     so it is exact.
//
// Not persisted: a transfer that did not finish before the app closed is gone,
// there is no resume.

import { create } from "zustand";
import type { AttachmentType } from "./chat-store";

export type TransferDirection = "send" | "receive";
// "stalled" means the transfer was progressing but has gone quiet: no bytes
// moved for a while, usually because the peer drifted out of Bluetooth range.
// It is not terminal. If progress resumes it flips back to "active"; if the
// silence continues it is declared "failed".
export type TransferStatus =
  "active" | "stalled" | "done" | "failed" | "cancelled";

export interface Transfer {
  id: string;
  direction: TransferDirection;
  // Channel the transfer belongs to (e.g. "#bluetooth" or "dm:<peerID>"). For
  // an incoming file this is a best guess from the sender until the file's own
  // metadata is decoded on completion.
  channel: string;
  // Human label for who is on the other end.
  peerLabel: string;
  type: AttachmentType;
  name: string;
  totalBytes: number;
  transferredBytes: number;
  startedAtMs: number;
  updatedAtMs: number;
  // Smoothed transfer rate in bytes/sec (exponential moving average of recent
  // samples). Reflects current throughput, not a lifetime average, so it tracks
  // a stall or speed-up the way a real download indicator does.
  speedBps: number;
  status: TransferStatus;
}

interface TransferState {
  transfers: Record<string, Transfer>;

  begin: (
    t: Omit<
      Transfer,
      "transferredBytes" | "updatedAtMs" | "status" | "speedBps"
    >,
  ) => void;
  advance: (id: string, transferredBytes: number) => void;
  finish: (id: string) => void;
  fail: (id: string) => void;
  cancel: (id: string) => void;
  dismiss: (id: string) => void;
  // Sweep in-flight transfers and promote quiet ones to "stalled", then "failed".
  // Driven off a wall clock rather than an event because the whole point is to
  // catch the absence of events (a peer that stopped sending). Idempotent.
  reconcile: () => void;
  activeForChannel: (channel: string) => Transfer[];
  activeCount: () => number;
  clearAll: () => void;
}

// EMA weight on the newest sample. Higher = more responsive, lower = smoother.
// 0.4 tracks changes within a second or two without jittering on BLE's steady
// per-fragment pacing.
const SPEED_ALPHA = 0.4;

// How long a finished/failed transfer lingers before it auto-dismisses, so the
// user sees the "done" state briefly rather than the card just vanishing.
const SETTLE_MS = 4000;

// No progress for this long flips an in-flight transfer to "stalled". Over BLE a
// single 64 KB chunk takes a few seconds and receive samples arrive chunk by
// chunk, so a gap this long is a genuine gap, not the normal cadence.
const STALL_AFTER_MS = 12_000;

// A transfer that stays silent this long is declared failed: the peer is out of
// range for good, not merely slow. Until there is a resume back-channel, a
// stalled receive cannot recover on its own (the sender already sent and freed
// its chunks), so we stop pretending and surface the failure.
const STALL_FAIL_AFTER_MS = 45_000;

export const useTransferStore = create<TransferState>()((set, get) => ({
  transfers: {},

  begin(t) {
    const now = Date.now();
    set((state) => ({
      transfers: {
        ...state.transfers,
        [t.id]: {
          ...t,
          transferredBytes: 0,
          updatedAtMs: now,
          speedBps: 0,
          status: "active",
        },
      },
    }));
  },

  advance(id, transferredBytes) {
    set((state) => {
      const existing = state.transfers[id];
      // Progress is accepted while active or stalled. A byte arriving on a
      // stalled transfer means the peer is back: recover it to active.
      if (
        existing === undefined ||
        (existing.status !== "active" && existing.status !== "stalled")
      ) {
        return state;
      }

      const now = Date.now();
      const clamped = Math.min(transferredBytes, existing.totalBytes);
      const dtSec = (now - existing.updatedAtMs) / 1000;
      const deltaBytes = clamped - existing.transferredBytes;

      // Instantaneous rate over this sample, folded into the running average.
      // Guard against a zero/negative interval producing a garbage spike.
      let speedBps = existing.speedBps;
      if (dtSec > 0 && deltaBytes >= 0) {
        const instant = deltaBytes / dtSec;
        speedBps =
          existing.speedBps <= 0
            ? instant
            : SPEED_ALPHA * instant + (1 - SPEED_ALPHA) * existing.speedBps;
      }

      return {
        transfers: {
          ...state.transfers,
          [id]: {
            ...existing,
            transferredBytes: clamped,
            updatedAtMs: now,
            speedBps,
            status: "active",
          },
        },
      };
    });
  },

  finish(id) {
    set((state) => {
      const existing = state.transfers[id];
      if (existing === undefined) return state;
      return {
        transfers: {
          ...state.transfers,
          [id]: {
            ...existing,
            transferredBytes: existing.totalBytes,
            updatedAtMs: Date.now(),
            status: "done",
          },
        },
      };
    });
    setTimeout(() => get().dismiss(id), SETTLE_MS);
  },

  fail(id) {
    set((state) => {
      const existing = state.transfers[id];
      if (existing === undefined) return state;
      return {
        transfers: {
          ...state.transfers,
          [id]: { ...existing, updatedAtMs: Date.now(), status: "failed" },
        },
      };
    });
    setTimeout(() => get().dismiss(id), SETTLE_MS);
  },

  // Cancel is initiated by the user. The actual teardown (dropping queued
  // packets or a partial reassembly) is done by FileTransferService; this just
  // reflects it in the UI, then clears the card quickly since a cancelled
  // transfer needs no lingering "done" state.
  cancel(id) {
    set((state) => {
      const existing = state.transfers[id];
      if (existing === undefined) return state;
      return {
        transfers: {
          ...state.transfers,
          [id]: { ...existing, updatedAtMs: Date.now(), status: "cancelled" },
        },
      };
    });
    setTimeout(() => get().dismiss(id), 1500);
  },

  reconcile() {
    const now = Date.now();
    const failed: string[] = [];
    set((state) => {
      let changed = false;
      const next = { ...state.transfers };
      for (const [id, t] of Object.entries(next)) {
        if (t.status !== "active" && t.status !== "stalled") continue;
        const idle = now - t.updatedAtMs;
        if (idle >= STALL_FAIL_AFTER_MS) {
          next[id] = { ...t, status: "failed", speedBps: 0 };
          failed.push(id);
          changed = true;
        } else if (t.status === "active" && idle >= STALL_AFTER_MS) {
          // Zero the speed so the card stops showing a rate/ETA it can't honour.
          next[id] = { ...t, status: "stalled", speedBps: 0 };
          changed = true;
        }
      }
      return changed ? { transfers: next } : state;
    });
    // Schedule dismissal outside the setter so it runs once per newly-failed id.
    for (const id of failed) setTimeout(() => get().dismiss(id), SETTLE_MS);
  },

  dismiss(id) {
    set((state) => {
      if (!(id in state.transfers)) return state;
      const next = { ...state.transfers };
      delete next[id];
      return { transfers: next };
    });
  },

  activeForChannel(channel) {
    return Object.values(get().transfers)
      .filter((t) => t.channel === channel)
      .sort((a, b) => a.startedAtMs - b.startedAtMs);
  },

  activeCount() {
    return Object.values(get().transfers).filter(
      (t) => t.status === "active" || t.status === "stalled",
    ).length;
  },

  clearAll() {
    set({ transfers: {} });
  },
}));

// Current smoothed transfer rate in bytes/sec.
export function transferSpeedBps(t: Transfer): number {
  return t.speedBps;
}

// Seconds remaining at the current smoothed speed, or null when not yet known.
export function transferEtaSec(t: Transfer): number | null {
  if (t.speedBps <= 0) return null;
  const remaining = t.totalBytes - t.transferredBytes;
  if (remaining <= 0) return 0;
  return remaining / t.speedBps;
}
