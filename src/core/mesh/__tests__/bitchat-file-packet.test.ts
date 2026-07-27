/**
 * @jest-environment node
 */
// Byte-parity tests for the bitchat file-transfer TLV (BitchatFilePacket).
import {
  decodeFilePacket,
  encodeFilePacket,
  isAllowedMime,
  MAX_FILE_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VOICE_BYTES,
  maxBytesForType,
  mimeMatchesMagic,
  resolveMimeType,
  typeFromMime,
} from "../bitchat-file-packet";

const PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3,
]);

describe("bitchat-file-packet", () => {
  describe("TLV encode/decode", () => {
    it("round-trips a file with all fields", () => {
      const p = {
        fileName: "photo.png",
        mimeType: "image/png",
        content: PNG,
        channel: "#region",
        durationMs: 0,
      };
      const dec = decodeFilePacket(encodeFilePacket(p)!)!;
      expect(dec.fileName).toBe("photo.png");
      expect(dec.mimeType).toBe("image/png");
      expect(dec.channel).toBe("#region");
      expect(Array.from(dec.content)).toEqual(Array.from(PNG));
    });

    it("round-trips a voice note with a duration", () => {
      const content = new Uint8Array(200).fill(7);
      const dec = decodeFilePacket(
        encodeFilePacket({
          mimeType: "audio/m4a",
          content,
          durationMs: 3400,
        })!,
      )!;
      expect(dec.durationMs).toBe(3400);
      expect(dec.mimeType).toBe("audio/m4a");
    });

    it("round-trips an attachment caption (Airhop extension)", () => {
      const content = new Uint8Array(64).fill(9);
      const dec = decodeFilePacket(
        encodeFilePacket({
          fileName: "photo.jpg",
          mimeType: "image/jpeg",
          content,
          caption: "sunset at the pier 🌅",
        })!,
      )!;
      expect(dec.caption).toBe("sunset at the pier 🌅");
      // The file itself still decodes correctly alongside the caption.
      expect(dec.fileName).toBe("photo.jpg");
      expect(dec.content).toEqual(content);
    });

    it("omits the caption tag when there is no caption (bitchat parity)", () => {
      const enc = encodeFilePacket({
        mimeType: "image/jpeg",
        content: new Uint8Array(16).fill(1),
      })!;
      // 0x07 is the caption tag; it must not appear when unused, so a plain
      // bitchat file frame stays byte-for-byte what bitchat would produce.
      expect([...enc]).not.toContain(0x07);
      expect(decodeFilePacket(enc)!.caption).toBeUndefined();
    });

    it("uses canonical tags: 0x01 name, 0x02 size(u32), 0x03 mime, 0x04 content(u32)", () => {
      const enc = encodeFilePacket({
        fileName: "a",
        mimeType: "image/png",
        content: PNG,
      })!;
      // 0x01 fileName, u16 len(1), 'a'
      expect(enc[0]).toBe(0x01);
      expect(enc[1]).toBe(0);
      expect(enc[2]).toBe(1);
      expect(enc[3]).toBe(0x61);
      // 0x02 fileSize, u16 len(4), u32 value
      expect(enc[4]).toBe(0x02);
      expect(enc[6]).toBe(4);
    });

    it("rejects empty content", () => {
      expect(encodeFilePacket({ content: new Uint8Array(0) })).toBeNull();
    });

    it("rejects content over 1 MiB", () => {
      expect(
        encodeFilePacket({ content: new Uint8Array(MAX_FILE_BYTES + 1) }),
      ).toBeNull();
    });

    it("skips unknown TLV tags (forward compatible, mirrors bitchat)", () => {
      // Build: fileSize + an unknown 0x09 tag (u16 len) + content.
      const enc = encodeFilePacket({ mimeType: "image/png", content: PNG })!;
      const withUnknown = new Uint8Array([
        0x09,
        0,
        2,
        0xaa,
        0xbb, // unknown tag, u16 len 2
        ...enc,
      ]);
      const dec = decodeFilePacket(withUnknown)!;
      expect(Array.from(dec.content)).toEqual(Array.from(PNG));
    });

    it("returns null on truncated content", () => {
      expect(
        decodeFilePacket(new Uint8Array([0x04, 0, 0, 0, 100, 1, 2])),
      ).toBeNull();
    });
  });

  describe("MIME allow-list and validation", () => {
    it("allows bitchat's set plus video (Airhop)", () => {
      expect(isAllowedMime("image/png")).toBe(true);
      expect(isAllowedMime("audio/m4a")).toBe(true);
      expect(isAllowedMime("application/pdf")).toBe(true);
      expect(isAllowedMime("video/mp4")).toBe(true); // Airhop extension
      expect(isAllowedMime("application/x-msdownload")).toBe(false);
    });

    it("validates magic bytes for known types", () => {
      expect(mimeMatchesMagic("image/png", PNG)).toBe(true);
      expect(
        mimeMatchesMagic("image/png", new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])),
      ).toBe(false);
      expect(
        mimeMatchesMagic("image/jpeg", new Uint8Array([0xff, 0xd8, 0xff])),
      ).toBe(true);
    });

    it("is lenient for octet-stream and video", () => {
      expect(
        mimeMatchesMagic("application/octet-stream", new Uint8Array([1])),
      ).toBe(true);
      expect(mimeMatchesMagic("video/mp4", new Uint8Array([1, 2, 3]))).toBe(
        true,
      );
    });

    it("derives the attachment type from MIME", () => {
      expect(typeFromMime("image/png")).toBe("image");
      expect(typeFromMime("audio/m4a")).toBe("voice");
      expect(typeFromMime("video/mp4")).toBe("video");
      expect(typeFromMime("application/pdf")).toBe("document");
    });
  });
});

describe("resolveMimeType", () => {
  it("keeps a type the far side will accept", () => {
    expect(resolveMimeType("image/jpeg", "photo.jpg")).toBe("image/jpeg");
  });

  it("never returns an empty type", () => {
    // A picker that returns no type used to put "" on the wire, which is not on
    // the allow-list, so the file was dropped on arrival while reporting a
    // completed send here.
    expect(resolveMimeType(undefined, "photo.jpg")).toBe("image/jpeg");
    expect(resolveMimeType("", "clip.m4a")).toBe("audio/mp4");
    expect(resolveMimeType("   ", "notes.pdf")).toBe("application/pdf");
  });

  it("falls back to octet-stream, which bitchat accepts", () => {
    expect(resolveMimeType(undefined, "notes.xyz")).toBe(
      "application/octet-stream",
    );
    expect(resolveMimeType(undefined, undefined)).toBe(
      "application/octet-stream",
    );
    // A real type that is not on the allow-list is still better sent as bytes
    // than dropped.
    expect(resolveMimeType("text/plain", "readme.txt")).toBe(
      "application/octet-stream",
    );
  });

  it("resolves to something the allow-list admits, whatever the input", () => {
    for (const [mime, name] of [
      ["", ""],
      ["text/csv", "rows.csv"],
      [undefined, "a.jpeg"],
      ["AUDIO/MP4", "voice.m4a"],
    ] as [string | undefined, string | undefined][]) {
      expect(isAllowedMime(resolveMimeType(mime, name))).toBe(true);
    }
  });

  it("accepts the m4a spelling Android recorders use", () => {
    // We send audio/mp4; older Airhop builds and some recorders say x-m4a.
    expect(isAllowedMime("audio/x-m4a")).toBe(true);
    expect(typeFromMime("audio/x-m4a")).toBe("voice");
  });
});

describe("maxBytesForType", () => {
  it("caps photos and voice notes tighter than files, matching bitchat", () => {
    expect(maxBytesForType("image")).toBe(MAX_IMAGE_BYTES);
    expect(maxBytesForType("voice")).toBe(MAX_VOICE_BYTES);
    expect(maxBytesForType("document")).toBe(MAX_FILE_BYTES);
    expect(maxBytesForType("video")).toBe(MAX_FILE_BYTES);
  });
});

describe("large payloads", () => {
  it("encodes a photo-sized file without blowing the call stack", () => {
    // Regression: the encoder used to spread the content into Array.push, which
    // passes every byte as a function argument. Anything past a few tens of KB
    // threw a RangeError from inside the encoder, so an attachment big enough
    // to matter never made it onto the wire at all.
    const big = new Uint8Array(400 * 1024);
    big.set(PNG, 0);
    for (let i = PNG.length; i < big.length; i++) big[i] = i & 0xff;

    const encoded = encodeFilePacket({
      fileName: "photo.png",
      mimeType: "image/png",
      content: big,
    });
    expect(encoded).not.toBeNull();

    const decoded = decodeFilePacket(encoded as Uint8Array);
    expect(decoded?.content.length).toBe(big.length);
    expect(decoded?.content[big.length - 1]).toBe(big[big.length - 1]);
    expect(decoded?.fileName).toBe("photo.png");
  });
});
