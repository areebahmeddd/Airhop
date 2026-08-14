/**
 * @jest-environment node
 */
// DM payload envelope: the type + id wrapper that enables delivery/read
// receipts. The critical property is that it never breaks an existing DM:
// anything that is not a valid envelope decodes as legacy raw text.

import {
  DmPayloadType,
  decodeDmPayload,
  encodeDmMessage,
  encodeDmReceipt,
} from "../dm-payload";

describe("message round-trip", () => {
  it("preserves id and text", () => {
    const p = decodeDmPayload(encodeDmMessage("peer-123-abc", "hello there"));
    expect(p.type).toBe(DmPayloadType.MESSAGE);
    expect(p.messageId).toBe("peer-123-abc");
    expect(p.text).toBe("hello there");
  });

  it("handles empty text and unicode", () => {
    const p = decodeDmPayload(encodeDmMessage("id1", "日本語 🎉"));
    expect(p.text).toBe("日本語 🎉");
    const e = decodeDmPayload(encodeDmMessage("id2", ""));
    expect(e.text).toBe("");
    expect(e.messageId).toBe("id2");
  });
});

describe("receipt round-trip", () => {
  it("encodes a delivered receipt with no text", () => {
    const p = decodeDmPayload(
      encodeDmReceipt(DmPayloadType.DELIVERED, "msg-9"),
    );
    expect(p.type).toBe(DmPayloadType.DELIVERED);
    expect(p.messageId).toBe("msg-9");
    expect(p.text).toBe("");
  });

  it("encodes a read receipt", () => {
    const p = decodeDmPayload(
      encodeDmReceipt(DmPayloadType.READ_RECEIPT, "msg-9"),
    );
    expect(p.type).toBe(DmPayloadType.READ_RECEIPT);
    expect(p.messageId).toBe("msg-9");
  });
});

describe("backward compatibility (never breaks a legacy DM)", () => {
  it("decodes raw legacy text as a message with no id", () => {
    const legacy = new TextEncoder().encode("just plain old text");
    const p = decodeDmPayload(legacy);
    expect(p.type).toBe(DmPayloadType.MESSAGE);
    expect(p.messageId).toBe("");
    expect(p.text).toBe("just plain old text");
  });

  it("treats a truncated/garbage envelope as legacy text, not a crash", () => {
    // Looks like it starts an envelope (0x01) but idLen overruns the buffer.
    const bogus = new Uint8Array([0x01, 200, 0x61, 0x62]);
    const p = decodeDmPayload(bogus);
    expect(p.type).toBe(DmPayloadType.MESSAGE);
    // Falls back to decoding the whole buffer as text.
    expect(p.text.length).toBeGreaterThan(0);
  });

  it("normal text starting with a printable char is never mistaken for a receipt", () => {
    const p = decodeDmPayload(new TextEncoder().encode("Read the docs"));
    expect(p.type).toBe(DmPayloadType.MESSAGE);
    expect(p.text).toBe("Read the docs");
  });
});
