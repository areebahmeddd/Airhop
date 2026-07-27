/**
 * @jest-environment node
 *
 * Mesh-bridge rendezvous event wire format. Must stay byte-compatible with
 * bitchat NostrProtocol.createBridgeMeshEvent / createBridgePresenceEvent and
 * MeshMessageIdentity.stableID so the two apps' bridges interoperate.
 */
import { verifyEvent } from "nostr-tools";
import {
  bridgeStableID,
  createBridgeMeshEvent,
  createBridgePresenceEvent,
  parseBridgeEvent,
} from "../bridge-event";

// A deterministic 32-byte per-cell key for signing test events.
const CELL_KEY = new Uint8Array(32).fill(7);

describe("bridgeStableID", () => {
  // Interop vector computed from the exact bitchat formula:
  //   SHA-256(lower(senderIDHex) + "|" + timestampMs + "|" + content.trim()) [:32]
  test("matches the fixed interop vector", () => {
    expect(
      bridgeStableID("a1b2c3d4e5f60718", 1700000000000, "hello world"),
    ).toBe("5d1c62100da9ccce98b4bebe40433cbb");
  });

  test("is case-insensitive on sender and trims content", () => {
    expect(
      bridgeStableID("A1B2C3D4E5F60718", 1700000000000, "  hello world  "),
    ).toBe("5d1c62100da9ccce98b4bebe40433cbb");
  });

  test("differs when content, sender, or timestamp changes", () => {
    const base = bridgeStableID("aa", 1, "x");
    expect(bridgeStableID("aa", 1, "y")).not.toBe(base);
    expect(bridgeStableID("ab", 1, "x")).not.toBe(base);
    expect(bridgeStableID("aa", 2, "x")).not.toBe(base);
  });

  test("is 32 hex chars", () => {
    expect(bridgeStableID("aa", 1, "x")).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe("createBridgeMeshEvent", () => {
  test("is a signed kind-20000 event with r + m tags", () => {
    const ev = createBridgeMeshEvent({
      content: "hello world",
      cell: "u4pruy",
      privKey: CELL_KEY,
      nickname: "alice",
      meshSenderID: "a1b2c3d4e5f60718",
      meshTimestampMs: 1700000000000,
    });
    expect(ev.kind).toBe(20000);
    expect(verifyEvent(ev)).toBe(true);
    expect(ev.tags).toContainEqual(["r", "u4pruy"]);
    expect(ev.tags).toContainEqual(["n", "alice"]);
    expect(ev.tags).toContainEqual([
      "m",
      "5d1c62100da9ccce98b4bebe40433cbb",
      "a1b2c3d4e5f60718",
      "1700000000000",
    ]);
    expect(ev.content).toBe("hello world");
  });

  test("omits the m tag when there is no radio origin", () => {
    const ev = createBridgeMeshEvent({
      content: "hi",
      cell: "u4pruy",
      privKey: CELL_KEY,
    });
    expect(ev.tags.some((t) => t[0] === "m")).toBe(false);
    expect(ev.tags).toContainEqual(["r", "u4pruy"]);
  });
});

describe("createBridgePresenceEvent", () => {
  test("is a signed kind-20001 event with only the r tag and empty content", () => {
    const ev = createBridgePresenceEvent("u4pruy", CELL_KEY);
    expect(ev.kind).toBe(20001);
    expect(verifyEvent(ev)).toBe(true);
    expect(ev.tags).toEqual([["r", "u4pruy"]]);
    expect(ev.content).toBe("");
  });
});

describe("parseBridgeEvent", () => {
  test("round-trips a message event, exposing the radio-copy hint", () => {
    const ev = createBridgeMeshEvent({
      content: "hello world",
      cell: "u4pruy",
      privKey: CELL_KEY,
      nickname: "alice",
      meshSenderID: "a1b2c3d4e5f60718",
      meshTimestampMs: 1700000000000,
    });
    const parsed = parseBridgeEvent(ev);
    expect(parsed).not.toBeNull();
    expect(parsed!.kind).toBe("message");
    expect(parsed!.cell).toBe("u4pruy");
    expect(parsed!.content).toBe("hello world");
    expect(parsed!.nickname).toBe("alice");
    expect(parsed!.radioMessageIDHint).toBe("5d1c62100da9ccce98b4bebe40433cbb");
    expect(parsed!.meshSenderID).toBe("a1b2c3d4e5f60718");
  });

  test("round-trips a presence event", () => {
    const ev = createBridgePresenceEvent("u4pruy", CELL_KEY);
    const parsed = parseBridgeEvent(ev);
    expect(parsed?.kind).toBe("presence");
    expect(parsed?.cell).toBe("u4pruy");
  });

  test("returns null for an event with no r tag", () => {
    const ev = createBridgePresenceEvent("u4pruy", CELL_KEY);
    const stripped = { ...ev, tags: [] };
    expect(parseBridgeEvent(stripped)).toBeNull();
  });

  test("returns null for an unrelated kind", () => {
    const ev = createBridgePresenceEvent("u4pruy", CELL_KEY);
    const wrongKind = { ...ev, kind: 1 };
    expect(parseBridgeEvent(wrongKind)).toBeNull();
  });
});
