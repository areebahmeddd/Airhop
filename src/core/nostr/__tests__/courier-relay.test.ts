/**
 * @jest-environment node
 */
// Tests for courier-relay event encode/subscribe/fetch.
// NostrClient is mocked: no network required.

import { bytesToHex } from "@noble/hashes/utils.js";
import { finalizeEvent, generateSecretKey, type Event } from "nostr-tools";
import type { SealedEnvelope } from "../../mesh/courier-store";
import {
  fetchCourierDrops,
  publishCourierDrop,
  subscribeCourierDrops,
} from "../courier-relay";
import type { NostrClient } from "../nostr-client";

// ---- Mock helpers -----------------------------------------------------------

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

// ---- publishCourierDrop -----------------------------------------------------

describe("publishCourierDrop", () => {
  it("calls client.publish once", async () => {
    const client = makeClient();
    const envelope = makeEnvelope();
    const nostrPrivKey = generateSecretKey();

    await publishCourierDrop(envelope, nostrPrivKey, client);

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
    const nostrPrivKey = generateSecretKey();

    await publishCourierDrop(envelope, nostrPrivKey, client);

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
    const nostrPrivKey = generateSecretKey();

    await publishCourierDrop(envelope, nostrPrivKey, client);

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
    const nostrPrivKey = generateSecretKey();

    await publishCourierDrop(envelope, nostrPrivKey, client);

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
    const nostrPrivKey = generateSecretKey();

    await publishCourierDrop(envelope, nostrPrivKey, client);

    const expiryTag = published!.tags.find(([t]) => t === "expiration");
    expect(expiryTag).toBeDefined();
    const tagSecs = parseInt(expiryTag![1], 10);
    // Allow ±1s rounding
    expect(Math.abs(tagSecs - Math.floor(expiryMs / 1000))).toBeLessThanOrEqual(
      1,
    );
  });
});

// ---- subscribeCourierDrops --------------------------------------------------

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
    const nostrPrivKey = generateSecretKey();
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

// ---- fetchCourierDrops ------------------------------------------------------

describe("fetchCourierDrops", () => {
  it("returns empty array for empty tag list", async () => {
    const client = makeClient();

    const envelopes = await fetchCourierDrops([], client);

    expect(envelopes).toHaveLength(0);
    expect(client.queryEvents).not.toHaveBeenCalled();
  });

  it("queries kind 1401 events for the given tags", async () => {
    const client = makeClient();
    const tag = crypto.getRandomValues(new Uint8Array(16));

    await fetchCourierDrops([tag], client);

    expect(client.queryEvents).toHaveBeenCalledTimes(1);
    const filter = (client.queryEvents as jest.Mock).mock.calls[0][0] as {
      kinds: number[];
    };
    expect(filter.kinds).toContain(1401);
  });

  it("parses a valid event returned by queryEvents", async () => {
    const nostrPrivKey = generateSecretKey();
    const recipientTag = crypto.getRandomValues(new Uint8Array(16));
    const expiryFuture = Math.floor(Date.now() / 1000) + 3600;
    const ciphertext = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);
    const b64Content = btoa(String.fromCharCode(...ciphertext));

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

    const client = makeClient({
      queryEvents: jest.fn().mockResolvedValue([event]),
    });

    const envelopes = await fetchCourierDrops([recipientTag], client);

    expect(envelopes).toHaveLength(1);
    expect(bytesToHex(envelopes[0].recipientTag)).toBe(
      bytesToHex(recipientTag),
    );
  });

  it("drops events that are already expired", async () => {
    const nostrPrivKey = generateSecretKey();
    const recipientTag = crypto.getRandomValues(new Uint8Array(16));
    // Expiry in the past.
    const expiryPast = Math.floor(Date.now() / 1000) - 10;
    const ciphertext = new Uint8Array([1]);
    const b64Content = btoa(String.fromCharCode(...ciphertext));

    const event = finalizeEvent(
      {
        kind: 1401,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["x", bytesToHex(recipientTag)],
          ["expiration", expiryPast.toString()],
        ],
        content: b64Content,
      },
      nostrPrivKey,
    );

    const client = makeClient({
      queryEvents: jest.fn().mockResolvedValue([event]),
    });

    const envelopes = await fetchCourierDrops([recipientTag], client);

    expect(envelopes).toHaveLength(0);
  });
});
