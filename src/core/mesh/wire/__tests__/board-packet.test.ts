/**
 * @jest-environment node
 */
// Board wire format: byte-compatible signed posts and tombstones (0x23).
import { ed25519 } from "@noble/curves/ed25519.js";
import {
  BoardWireConstants,
  decodeBoardWire,
  encodeBoardWire,
  isUrgent,
  newPostID,
  signBoardPost,
  signBoardTombstone,
  URGENT,
  verifyBoardWire,
  type BoardWire,
} from "../board-packet";

function keypair(): { priv: Uint8Array; pub: Uint8Array } {
  const priv = ed25519.utils.randomSecretKey();
  return { priv, pub: ed25519.getPublicKey(priv) };
}

function samplePost(
  overrides: Partial<Parameters<typeof signBoardPost>[0]> = {},
) {
  const { priv, pub } = keypair();
  const createdAt = 1_700_000_000_000;
  const post = signBoardPost(
    {
      postID: newPostID(),
      geohash: "u4pruy",
      content: "market at noon",
      authorSigningKey: pub,
      authorNickname: "alice",
      createdAt,
      expiresAt: createdAt + 24 * 60 * 60 * 1000,
      flags: 0,
      ...overrides,
    },
    priv,
  );
  return { post, priv, pub };
}

describe("board wire", () => {
  it("round-trips a post through encode/decode and verifies", () => {
    const { post } = samplePost();
    const wire: BoardWire = { kind: "post", post };
    expect(verifyBoardWire(wire)).toBe(true);

    const decoded = decodeBoardWire(encodeBoardWire(wire));
    expect(decoded).not.toBeNull();
    expect(decoded!.kind).toBe("post");
    if (decoded!.kind !== "post") return;
    expect(decoded!.post.content).toBe("market at noon");
    expect(decoded!.post.geohash).toBe("u4pruy");
    expect(decoded!.post.authorNickname).toBe("alice");
    expect(decoded!.post.createdAt).toBe(post.createdAt);
    expect(decoded!.post.expiresAt).toBe(post.expiresAt);
    expect(verifyBoardWire(decoded!)).toBe(true);
  });

  it("carries the urgent flag", () => {
    const { post } = samplePost({ flags: URGENT });
    expect(isUrgent(post)).toBe(true);
    const decoded = decodeBoardWire(encodeBoardWire({ kind: "post", post }));
    expect(decoded!.kind === "post" && isUrgent(decoded!.post)).toBe(true);
  });

  it("accepts the empty geohash (mesh-local board)", () => {
    const { post } = samplePost({ geohash: "" });
    const decoded = decodeBoardWire(encodeBoardWire({ kind: "post", post }));
    expect(decoded!.kind === "post" && decoded!.post.geohash).toBe("");
  });

  it("fails verification when content is tampered", () => {
    const { post } = samplePost();
    const forged = { ...post, content: "market at midnight" };
    expect(verifyBoardWire({ kind: "post", post: forged })).toBe(false);
  });

  it("fails verification when a different key signs", () => {
    const { post } = samplePost();
    const other = keypair();
    expect(
      verifyBoardWire({
        kind: "post",
        post: { ...post, authorSigningKey: other.pub },
      }),
    ).toBe(false);
  });

  it("round-trips a tombstone and verifies", () => {
    const { post, priv } = samplePost();
    const tombstone = signBoardTombstone(
      post.postID,
      post.authorSigningKey,
      post.createdAt + 1000,
      priv,
    );
    const wire: BoardWire = { kind: "tombstone", tombstone };
    expect(verifyBoardWire(wire)).toBe(true);
    const decoded = decodeBoardWire(encodeBoardWire(wire));
    expect(decoded!.kind).toBe("tombstone");
    expect(verifyBoardWire(decoded!)).toBe(true);
  });

  it("rejects a post whose expiry is not after creation", () => {
    const { post } = samplePost({ expiresAt: 1_700_000_000_000 });
    expect(decodeBoardWire(encodeBoardWire({ kind: "post", post }))).toBeNull();
  });

  it("rejects a post whose lifetime exceeds 7 days", () => {
    const createdAt = 1_700_000_000_000;
    const { post } = samplePost({
      createdAt,
      expiresAt: createdAt + BoardWireConstants.MAX_LIFETIME_MS + 1,
    });
    expect(decodeBoardWire(encodeBoardWire({ kind: "post", post }))).toBeNull();
  });

  it("rejects a post with empty content", () => {
    const { post } = samplePost({ content: "" });
    expect(decodeBoardWire(encodeBoardWire({ kind: "post", post }))).toBeNull();
  });

  it("rejects a geohash with characters outside the base32 alphabet", () => {
    // 'a', 'i', 'l', 'o' are not in the geohash alphabet.
    const { post } = samplePost({ geohash: "aiou" });
    expect(decodeBoardWire(encodeBoardWire({ kind: "post", post }))).toBeNull();
  });

  it("skips unknown TLVs for forward compatibility", () => {
    const { post } = samplePost();
    const encoded = encodeBoardWire({ kind: "post", post });
    // Append an unknown TLV (type 0x7f, len 2).
    const extra = new Uint8Array([0x7f, 0x00, 0x02, 0xaa, 0xbb]);
    const merged = new Uint8Array(encoded.length + extra.length);
    merged.set(encoded);
    merged.set(extra, encoded.length);
    const decoded = decodeBoardWire(merged);
    expect(decoded).not.toBeNull();
    expect(decoded!.kind === "post" && decoded!.post.content).toBe(
      "market at noon",
    );
  });
});
