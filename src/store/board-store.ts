// Persistent storage for signed bulletin-board posts and their tombstones.
//
// Mirrors bitchat BoardStore.swift. Posts are signed public notices designed to
// outlive chat: they stay on disk until their author-chosen expiry (max 7 days).
// Tombstones are retained until the deleted post's original expiry so the delete
// keeps outrunning stale copies of the post.
//
// The caller MUST have verified the wire signature (`verifyBoardWire`) before
// calling ingest; this store owns the quota, expiry and de-duplication logic,
// which is the single chokepoint for radio, local echo, and disk restore.
//
// On-disk format is the raw signed wire bytes (re-encoded from the decoded
// post/tombstone, which is byte-identical), re-verified and re-ingested on
// launch. Wiped on panic (its MMKV id is in panic-wipe's MMKV_STORE_IDS).

import { bytesToHex } from "@noble/hashes/utils.js";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import {
  BoardWireConstants,
  decodeBoardWire,
  encodeBoardWire,
  isUrgent,
  verifyBoardWire,
  type BoardPost,
  type BoardTombstone,
  type BoardWire,
} from "../core/mesh/board-packet";

export type BoardIngestResult = "accepted" | "duplicate" | "rejected";

const Limits = {
  MAX_POSTS: 200,
  MAX_POSTS_PER_AUTHOR: 5,
  // A tombstone whose post we never saw: we cannot know the original expiry,
  // so cap at the max post lifetime.
  ORPHAN_TOMBSTONE_LIFETIME_MS: BoardWireConstants.MAX_LIFETIME_MS,
  MAX_ORPHAN_TOMBSTONES: 100,
  MAX_ORPHAN_TOMBSTONES_PER_AUTHOR: 5,
  // Allowance for clock skew between peers when judging received timestamps.
  CLOCK_SKEW_MS: 60 * 60 * 1000,
} as const;

interface StoredTombstone {
  tombstone: BoardTombstone;
  retainUntil: number;
  // True when no matching post was known at ingest; only these count against
  // the orphan caps.
  isOrphan: boolean;
}

interface BoardState {
  // Live posts across all boards. UI selects a scope via postsForGeohash.
  posts: BoardPost[];
  tombstones: StoredTombstone[];

  ingest: (wire: BoardWire, now?: number) => BoardIngestResult;
  postsForGeohash: (geohash: string) => BoardPost[];
  isOwnPost: (post: BoardPost, mySigningKey: Uint8Array) => boolean;
  prune: (now?: number) => void;
  clearAll: () => void;
}

const STORAGE_ID = "board-store";
const STORAGE_KEY = "entries";

const storage = createMMKV({ id: STORAGE_ID });

interface PersistedEntry {
  w: string; // base64 of encodeBoardWire
  r: number | null; // tombstone retainUntil, null for posts
}

// atob/btoa are part of the Hermes global scope in React Native, and global in
// the Node test runtime, so no base64 dependency is needed.
function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function keyEq(a: Uint8Array, b: Uint8Array): boolean {
  return bytesToHex(a) === bytesToHex(b);
}

function idEq(a: Uint8Array, b: Uint8Array): boolean {
  return bytesToHex(a) === bytesToHex(b);
}

export const useBoardStore = create<BoardState>((set, get) => {
  // -- persistence ----------------------------------------------------------
  function persist(): void {
    const { posts, tombstones } = get();
    const entries: PersistedEntry[] = [
      ...posts.map((post) => ({
        w: toBase64(encodeBoardWire({ kind: "post", post })),
        r: null,
      })),
      ...tombstones.map((t) => ({
        w: toBase64(
          encodeBoardWire({ kind: "tombstone", tombstone: t.tombstone }),
        ),
        r: t.retainUntil,
      })),
    ];
    if (entries.length === 0) storage.remove(STORAGE_KEY);
    else storage.set(STORAGE_KEY, JSON.stringify(entries));
  }

  // -- pruning --------------------------------------------------------------
  // Returns possibly-new arrays; callers set() them. Never mutates in place.
  function pruneArrays(
    posts: BoardPost[],
    tombstones: StoredTombstone[],
    now: number,
  ): { posts: BoardPost[]; tombstones: StoredTombstone[]; changed: boolean } {
    const livePosts = posts.filter((p) => p.expiresAt > now);
    const liveTombstones = tombstones.filter((t) => t.retainUntil > now);
    const changed =
      livePosts.length !== posts.length ||
      liveTombstones.length !== tombstones.length;
    return { posts: livePosts, tombstones: liveTombstones, changed };
  }

  // -- ingest helpers -------------------------------------------------------
  function ingestPost(
    post: BoardPost,
    posts: BoardPost[],
    tombstones: StoredTombstone[],
    now: number,
  ): { result: BoardIngestResult; posts: BoardPost[] } {
    if (post.expiresAt <= now) return { result: "rejected", posts };
    // Receive-time sanity: the decoder only enforces the created→expires span,
    // so a forged future createdAt would sort ahead of honest posts and hold a
    // slot without ever pruning.
    if (
      post.createdAt > now + Limits.CLOCK_SKEW_MS ||
      post.expiresAt >
        now + BoardWireConstants.MAX_LIFETIME_MS + Limits.CLOCK_SKEW_MS
    ) {
      return { result: "rejected", posts };
    }
    if (
      tombstones.some(
        (t) =>
          idEq(t.tombstone.postID, post.postID) &&
          keyEq(t.tombstone.authorSigningKey, post.authorSigningKey),
      )
    ) {
      return { result: "rejected", posts };
    }
    if (posts.some((p) => idEq(p.postID, post.postID))) {
      return { result: "duplicate", posts };
    }

    let next = [...posts, post];

    // Per-author cap, then global cap; oldest posts (by createdAt) evicted first.
    const authorHex = bytesToHex(post.authorSigningKey);
    const authorPosts = next.filter(
      (p) => bytesToHex(p.authorSigningKey) === authorHex,
    );
    if (authorPosts.length > Limits.MAX_POSTS_PER_AUTHOR) {
      next = evictOldest(next, authorPosts, Limits.MAX_POSTS_PER_AUTHOR);
    }
    if (next.length > Limits.MAX_POSTS) {
      next = evictOldest(next, next, Limits.MAX_POSTS);
    }
    // Even if the new post itself was evicted locally it stays valid mesh-wide,
    // so peers with room should still receive it: report accepted.
    return { result: "accepted", posts: next };
  }

  function evictOldest(
    all: BoardPost[],
    candidates: BoardPost[],
    keep: number,
  ): BoardPost[] {
    const victims = [...candidates]
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, Math.max(0, candidates.length - keep));
    if (victims.length === 0) return all;
    const victimIDs = new Set(victims.map((p) => bytesToHex(p.postID)));
    return all.filter((p) => !victimIDs.has(bytesToHex(p.postID)));
  }

  function ingestTombstone(
    tombstone: BoardTombstone,
    posts: BoardPost[],
    tombstones: StoredTombstone[],
    now: number,
  ): {
    result: BoardIngestResult;
    posts: BoardPost[];
    tombstones: StoredTombstone[];
  } {
    if (tombstones.some((t) => idEq(t.tombstone.postID, tombstone.postID))) {
      return { result: "duplicate", posts, tombstones };
    }

    // Cap retention by both the claimed deletion time and the receive time, so
    // a doctored far-future deletedAt cannot pin the tombstone past any post
    // still able to arrive.
    const maxRetain = Math.min(
      tombstone.deletedAt + Limits.ORPHAN_TOMBSTONE_LIFETIME_MS,
      now + Limits.ORPHAN_TOMBSTONE_LIFETIME_MS + Limits.CLOCK_SKEW_MS,
    );

    let retainUntil: number;
    let isOrphan: boolean;
    let nextPosts = posts;

    const target = posts.find((p) => idEq(p.postID, tombstone.postID));
    if (target !== undefined) {
      // Only the author's key can delete: the tombstone signature was already
      // verified against its embedded key, so requiring that key to match the
      // post's author key suffices.
      if (!keyEq(target.authorSigningKey, tombstone.authorSigningKey)) {
        return { result: "rejected", posts, tombstones };
      }
      retainUntil = target.expiresAt;
      isOrphan = false;
      nextPosts = posts.filter((p) => !idEq(p.postID, tombstone.postID));
    } else {
      // Post unknown (tombstone raced ahead); keep it so a late post is
      // suppressed if it arrives later.
      retainUntil = maxRetain;
      isOrphan = true;
    }

    if (retainUntil <= now) return { result: "rejected", posts, tombstones };

    let nextTombstones = [...tombstones, { tombstone, retainUntil, isOrphan }];
    if (isOrphan) {
      nextTombstones = enforceOrphanCaps(
        nextTombstones,
        tombstone.authorSigningKey,
      );
    }
    return { result: "accepted", posts: nextPosts, tombstones: nextTombstones };
  }

  // Orphan tombstones reference posts we never saw, so a peer can mint
  // unlimited valid ones for random IDs; bound per author and globally,
  // evicting the oldest received first (array order).
  function enforceOrphanCaps(
    tombstones: StoredTombstone[],
    author: Uint8Array,
  ): StoredTombstone[] {
    const authorHex = bytesToHex(author);
    let result = tombstones;
    const authorOrphans = result.filter(
      (t) =>
        t.isOrphan && bytesToHex(t.tombstone.authorSigningKey) === authorHex,
    );
    if (authorOrphans.length > Limits.MAX_ORPHAN_TOMBSTONES_PER_AUTHOR) {
      result = removeTombstones(
        result,
        authorOrphans.slice(
          0,
          authorOrphans.length - Limits.MAX_ORPHAN_TOMBSTONES_PER_AUTHOR,
        ),
      );
    }
    const orphans = result.filter((t) => t.isOrphan);
    if (orphans.length > Limits.MAX_ORPHAN_TOMBSTONES) {
      result = removeTombstones(
        result,
        orphans.slice(0, orphans.length - Limits.MAX_ORPHAN_TOMBSTONES),
      );
    }
    return result;
  }

  function removeTombstones(
    tombstones: StoredTombstone[],
    victims: StoredTombstone[],
  ): StoredTombstone[] {
    if (victims.length === 0) return tombstones;
    const victimIDs = new Set(
      victims.map((t) => bytesToHex(t.tombstone.postID)),
    );
    return tombstones.filter(
      (t) => !victimIDs.has(bytesToHex(t.tombstone.postID)),
    );
  }

  return {
    posts: [],
    tombstones: [],

    ingest(wire: BoardWire, now: number = Date.now()): BoardIngestResult {
      const pruned = pruneArrays(get().posts, get().tombstones, now);
      let result: BoardIngestResult;
      let nextPosts = pruned.posts;
      let nextTombstones = pruned.tombstones;

      if (wire.kind === "post") {
        const r = ingestPost(wire.post, nextPosts, nextTombstones, now);
        result = r.result;
        nextPosts = r.posts;
      } else {
        const r = ingestTombstone(
          wire.tombstone,
          nextPosts,
          nextTombstones,
          now,
        );
        result = r.result;
        nextPosts = r.posts;
        nextTombstones = r.tombstones;
      }

      if (result === "accepted" || pruned.changed) {
        set({ posts: nextPosts, tombstones: nextTombstones });
        persist();
      }
      return result;
    },

    postsForGeohash(geohash: string): BoardPost[] {
      const now = Date.now();
      const pruned = pruneArrays(get().posts, get().tombstones, now);
      if (pruned.changed) {
        set({ posts: pruned.posts, tombstones: pruned.tombstones });
        persist();
      }
      return pruned.posts
        .filter((p) => p.geohash === geohash)
        .sort((a, b) => {
          if (isUrgent(a) !== isUrgent(b)) return isUrgent(a) ? -1 : 1;
          return b.createdAt - a.createdAt;
        });
    },

    isOwnPost(post: BoardPost, mySigningKey: Uint8Array): boolean {
      return (
        mySigningKey.length > 0 && keyEq(post.authorSigningKey, mySigningKey)
      );
    },

    prune(now: number = Date.now()): void {
      const pruned = pruneArrays(get().posts, get().tombstones, now);
      if (pruned.changed) {
        set({ posts: pruned.posts, tombstones: pruned.tombstones });
        persist();
      }
    },

    clearAll(): void {
      set({ posts: [], tombstones: [] });
      storage.remove(STORAGE_KEY);
    },
  };
});

// Load, verify, and re-ingest persisted board entries on module init.
(function loadFromDisk(): void {
  const raw = storage.getString(STORAGE_KEY);
  if (raw === undefined) return;
  let entries: PersistedEntry[];
  try {
    entries = JSON.parse(raw) as PersistedEntry[];
  } catch {
    return;
  }
  const now = Date.now();
  const store = useBoardStore.getState();
  for (const entry of entries) {
    let wire: BoardWire | null;
    try {
      wire = decodeBoardWire(fromBase64(entry.w));
    } catch {
      continue;
    }
    if (wire === null || !verifyBoardWire(wire)) continue;
    // Disk restore of a tombstone whose post is long gone: trust the recorded
    // retention deadline. ingest recomputes it as an orphan otherwise, which is
    // still safe (capped), so passing through ingest is acceptable.
    store.ingest(wire, now);
  }
})();
