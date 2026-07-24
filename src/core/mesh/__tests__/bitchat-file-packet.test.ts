/**
 * @jest-environment node
 */
// Byte-parity tests for the bitchat file-transfer TLV (BitchatFilePacket).
import {
  decodeFilePacket,
  encodeFilePacket,
  isAllowedMime,
  MAX_FILE_BYTES,
  mimeMatchesMagic,
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
