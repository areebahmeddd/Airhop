/**
 * @jest-environment node
 */
// Tests for courier-relay event encode/subscribe/fetch.
// NostrClient is mocked: no network required.

import { bytesToHex } from "@noble/hashes/utils.js";
import { finalizeEvent, generateSecretKey, type Event } from "nostr-tools";
import type { SealedEnvelope } from "../../mesh/courier/courier-store";
import { publishCourierDrop, subscribeCourierDrops } from "../courier-relay";
import type { NostrClient } from "../nostr-client";

function makeEnvelope(overrides?: Partial<SealedEnvelope>): SealedEnvelope {
  const recipientTag = crypto.getRandomValues(new Uint8Array(16));
  const ciphertext = crypto.getRandomValues(new Uint8Array(64));
  return {
    recipientTag,
    ciphertext,
    expiryMs: Date.now() + 3_600_000, // 1 hour from now
    copies: 1,
    ...overrides,
  };
}

function makeClient(overrides?: Partial<NostrClient>): NostrClient {
  return {
    publish: jest
      .fn()
      .mockResolvedValue({ relay: "wss://mock", accepted: true }),
    subscribe: jest.fn().mockReturnValue({ close: jest.fn() }),
    queryEvents: jest.fn().mockResolvedValue([]),
    fetchEvent: jest.fn().mockResolvedValue(null),
    close: jest.fn(),
    ...overrides,
  } as unknown as NostrClient;
}

function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

// For the tests that hand-build a drop event to feed the receive path.
// publishCourierDrop takes no key: it mints a throwaway per publish, so a
// device's drops are not all attributable to one npub.
const nostrPrivKey = generateSecretKey();

describe("publishCourierDrop", () => {
  it("calls client.publish once", async () => {
    const client = makeClient();
    const envelope = makeEnvelope();

    await publishCourierDrop(envelope, client);

    expect(client.publish).toHaveBeenCalledTimes(1);
  });

  it("publishes a kind 1401 event", async () => {
    let published: Event | null = null;
    const client = makeClient({
      publish: jest.fn().mockImplementation((event: Event) => {
        published = event;
        return Promise.resolve({ relay: "wss://mock", accepted: true });
      }),
    });
    const envelope = makeEnvelope();

    await publishCourierDrop(envelope, client);

    expect(published).not.toBeNull();
    expect(published!.kind).toBe(1401);
  });

  it("event has the correct x tag (recipient tag hex)", async () => {
    let published: Event | null = null;
    const client = makeClient({
      publish: jest.fn().mockImplementation((event: Event) => {
        published = event;
        return Promise.resolve({ relay: "wss://mock", accepted: true });
      }),
    });
    const envelope = makeEnvelope();

    await publishCourierDrop(envelope, client);

    const xTag = published!.tags.find(([t]) => t === "x");
    expect(xTag).toBeDefined();
    expect(xTag![1]).toBe(bytesToHex(envelope.recipientTag));
  });

  it("event content is base64-encoded ciphertext (non-empty)", async () => {
    let published: Event | null = null;
    const client = makeClient({
      publish: jest.fn().mockImplementation((event: Event) => {
        published = event;
        return Promise.resolve({ relay: "wss://mock", accepted: true });
      }),
    });
    const envelope = makeEnvelope();

    await publishCourierDrop(envelope, client);

    const bytes = base64ToUint8(published!.content);
    // The encoded TLV payload is at minimum 1 + 16 + 4 + len(ciphertext) bytes.
    expect(bytes.length).toBeGreaterThan(0);
  });

  it("event has an expiration tag within range of the envelope expiry", async () => {
    let published: Event | null = null;
    const client = makeClient({
      publish: jest.fn().mockImplementation((event: Event) => {
        published = event;
        return Promise.resolve({ relay: "wss://mock", accepted: true });
      }),
    });
    const expiryMs = Date.now() + 7_200_000; // 2 hours
    const envelope = makeEnvelope({ expiryMs });

    await publishCourierDrop(envelope, client);

    const expiryTag = published!.tags.find(([t]) => t === "expiration");
    expect(expiryTag).toBeDefined();
    const tagSecs = parseInt(expiryTag![1], 10);
    // Allow +/-1s rounding
    expect(Math.abs(tagSecs - Math.floor(expiryMs / 1000))).toBeLessThanOrEqual(
      1,
    );
  });
});

describe("subscribeCourierDrops", () => {
  it("calls client.subscribe with a kind 1401 filter", () => {
    const client = makeClient();
    const tag = crypto.getRandomValues(new Uint8Array(16));

    subscribeCourierDrops([tag], client, () => {});

    expect(client.subscribe).toHaveBeenCalledTimes(1);
    const [filters] = (client.subscribe as jest.Mock).mock.calls[0] as [
      unknown[],
    ];
    const filter = (filters as { kinds: number[] }[])[0];
    expect(filter.kinds).toContain(1401);
  });

  it("returns a no-op closer for an empty tag list", () => {
    const client = makeClient();

    const close = subscribeCourierDrops([], client, () => {});

    expect(client.subscribe).not.toHaveBeenCalled();
    expect(() => close()).not.toThrow();
  });

  it("calls onEnvelope when a valid event arrives", () => {
    let capturedCb: ((event: Event) => void) | null = null;
    const client = makeClient({
      subscribe: jest
        .fn()
        .mockImplementation((_filters: unknown, cb: (event: Event) => void) => {
          capturedCb = cb;
          return { close: jest.fn() };
        }),
    });

    const recipientTag = crypto.getRandomValues(new Uint8Array(16));
    const expiryFuture = Math.floor(Date.now() / 1000) + 3600;
    const ciphertext = new Uint8Array([1, 2, 3, 4]);
    const b64Content = btoa(String.fromCharCode(...ciphertext));

    // Build a minimal valid kind 1401 event.
    const event = finalizeEvent(
      {
        kind: 1401,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["x", bytesToHex(recipientTag)],
          ["expiration", expiryFuture.toString()],
        ],
        content: b64Content,
      },
      nostrPrivKey,
    );

    const received: SealedEnvelope[] = [];
    subscribeCourierDrops([recipientTag], client, (env) => received.push(env));

    // Fire the mock event.
    capturedCb!(event);

    expect(received).toHaveLength(1);
    expect(bytesToHex(received[0].recipientTag)).toBe(bytesToHex(recipientTag));
  });
});

// Nothing obliges a relay to prune, so it may replay a drop whose NIP-40
// expiration has passed. Rendering that as live would put a day-old bubble at
// the bottom of a thread.
describe("expired drops", () => {
  it("never surfaces a drop whose expiry has passed", () => {
    const recipientTag = crypto.getRandomValues(new Uint8Array(16));
    let capturedCb: ((e: Event) => void) | null = null;
    const client = makeClient({
      subscribe: jest.fn().mockImplementation((_f, cb: (e: Event) => void) => {
        capturedCb = cb;
        return { close: jest.fn() };
      }),
    });

    const event = finalizeEvent(
      {
        kind: 1401,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["x", bytesToHex(recipientTag)],
          ["expiration", (Math.floor(Date.now() / 1000) - 10).toString()],
        ],
        content: btoa(String.fromCharCode(1)),
      },
      nostrPrivKey,
    );

    const received: SealedEnvelope[] = [];
    subscribeCourierDrops([recipientTag], client, (env) => received.push(env));
    capturedCb!(event);

    expect(received).toHaveLength(0);
  });
});
