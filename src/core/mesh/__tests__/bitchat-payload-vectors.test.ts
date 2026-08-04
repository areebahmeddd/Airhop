/**
 * @jest-environment node
 */
// Byte fixtures for the PAYLOAD structures that cross to bitchat: the file
// packet, the fragment header, the voice burst, and the group state.
//
// Sibling of compat.test.ts, which pins the packet envelope itself (header
// layout, flags, signature coverage, packet ID). Between them they cover the two
// halves: that file owns the frame, this one owns what rides inside it.
//
// Every other interop test in this repo is Airhop-encodes-then-Airhop-decodes,
// which proves we agree with ourselves. That is exactly how the 557-byte fragment
// frame survived: the assertion measured the payload, the constant was named for
// the frame, and no fixture existed to contradict either.
//
// The expected bytes below were written by reading bitchat's OWN encoders, not by
// running ours and recording the output. Each block cites the Swift file and the
// rule it encodes. If either implementation drifts, these fail; if they are
// regenerated from our own output they stop being worth anything, so don't.
//
// Vendored source for each, under bitchat/ios:
//   file packet    bitchat/Protocols/BitchatFilePacket.swift, encode()
//   fragment       bitchat/Services/BLE/BLEFragmentAssemblyBuffer.swift, header
//   voice burst    bitchat/Protocols/VoiceBurstPacket.swift, encode()
//   group state    bitchat/Services/Groups/GroupProtocol.swift, encode()

import { bytesToHex } from "@noble/hashes/utils.js";
import { encodeFilePacket } from "../bitchat-file-packet";
import {
  decodeFragmentPayload,
  FRAG_DATA_SIZE,
  fragmentPacket,
  MAX_BLE_FRAME,
} from "../fragment-manager";
import { encodeGroupState, type GroupStatePayload } from "../group-protocol";
import { encodePacket, Flags, PacketType, type Packet } from "../packet-codec";
import {
  encodeBurstCanceled,
  encodeBurstData,
  encodeBurstEnd,
  encodeBurstStart,
  VoiceCodec,
} from "../voice-capture";

function hex(bytes: Uint8Array): string {
  return bytesToHex(bytes);
}

// ---- File packet -------------------------------------------------------------

describe("bitchat vector: file packet TLV", () => {
  // BitchatFilePacket.encode() emits, in this order and no other:
  //   0x01  fileName   u16 length
  //   0x02  fileSize   u16 length, ALWAYS the literal 4, then a u32 value
  //   0x03  mimeType   u16 length
  //   0x04  content    u32 length  <- note: u32, not u16, unlike the three above
  // fileSize defaults to content.count. Every integer is big-endian.
  test("a one-byte JPEG named a.jpg is exactly these bytes", () => {
    const encoded = encodeFilePacket({
      fileName: "a.jpg",
      mimeType: "image/jpeg",
      content: new Uint8Array([0xff]),
    });
    expect(encoded).not.toBeNull();
    expect(hex(encoded!)).toBe(
      // 01 0005 "a.jpg"
      "01" +
        "0005" +
        "612e6a7067" +
        // 02 0004 00000001   (length is the constant 4; value is content.count)
        "02" +
        "0004" +
        "00000001" +
        // 03 000a "image/jpeg"
        "03" +
        "000a" +
        "696d6167652f6a706567" +
        // 04 00000001 ff     (u32 length)
        "04" +
        "00000001" +
        "ff",
    );
  });

  // The tag order is not incidental: bitchat's decoder walks tags in sequence and
  // an out-of-order blob decodes into the wrong fields rather than failing.
  test("fileSize carries a u16 length of 4 and a u32 value", () => {
    const encoded = encodeFilePacket({
      fileName: "x",
      mimeType: "image/png",
      content: new Uint8Array(300),
    })!;
    const sizeTagAt = 1 + 2 + 1; // past the fileName TLV
    expect(encoded[sizeTagAt]).toBe(0x02);
    expect(encoded[sizeTagAt + 1]).toBe(0x00);
    expect(encoded[sizeTagAt + 2]).toBe(0x04);
    // 300 = 0x0000012c
    expect(hex(encoded.slice(sizeTagAt + 3, sizeTagAt + 7))).toBe("0000012c");
  });
});

// ---- Fragment ----------------------------------------------------------------

describe("bitchat vector: fragment", () => {
  const identity = { peerID: "0011223344556677" };

  function bigPacket(): Packet {
    const payload = new Uint8Array(FRAG_DATA_SIZE * 2);
    // Incompressible, or the codec shrinks it below one frame and there is
    // nothing to fragment.
    for (let i = 0; i < payload.length; i++) payload[i] = (i * 167 + 13) & 0xff;
    return {
      type: PacketType.FILE_TRANSFER,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(1),
      recipientID: new Uint8Array(8).fill(2),
      timestamp: 1_700_000_000_000,
      signature: new Uint8Array(64),
      payload,
    };
  }

  // BLEFragmentAssemblyBuffer reads the payload as
  //   [0..8)  stream ID
  //   [8..10) index, u16 big-endian
  //   [10..12) total, u16 big-endian
  //   [12]    the original packet's type
  // and rejects anything shorter than 13 bytes.
  test("the header is 8 + 2 + 2 + 1, big-endian, inner type at byte 12", () => {
    const frags = fragmentPacket(bigPacket(), identity);
    expect(frags.length).toBeGreaterThan(1);

    const second = frags[1].payload;
    expect(second.length).toBeGreaterThan(13);
    // index 1, total = frags.length, both u16 BE
    expect(second[8]).toBe(0x00);
    expect(second[9]).toBe(0x01);
    expect((second[10] << 8) | second[11]).toBe(frags.length);
    expect(second[12]).toBe(PacketType.FILE_TRANSFER);

    const header = decodeFragmentPayload(second);
    expect(header?.index).toBe(1);
    expect(header?.total).toBe(frags.length);
    expect(header?.originalType).toBe(PacketType.FILE_TRANSFER);
  });

  // The outer type is 0x20 on both sides, and every stream shares one ID.
  test("the outer packet is FRAGMENT 0x20 and the stream ID is shared", () => {
    const frags = fragmentPacket(bigPacket(), identity);
    expect(PacketType.FRAGMENT).toBe(0x20);
    for (const f of frags) expect(f.type).toBe(0x20);
    const ids = frags.map((f) => hex(f.payload.slice(0, 8)));
    expect(new Set(ids).size).toBe(1);
  });

  // The rule the 557-byte bug broke. BLEOutboundFragmentPlanner sends fragments
  // with `signature: nil`, and the ATT ceiling is 512, so a bitchat fragment is
  // at most 512 bytes on the wire and ours must be too.
  test("a fragment frame fits one BLE write and is unsigned", () => {
    const frags = fragmentPacket(bigPacket(), identity);
    for (const f of frags) {
      expect(f.flags & Flags.SIGNED).toBe(0);
      expect(encodePacket(f).length).toBeLessThanOrEqual(MAX_BLE_FRAME);
    }
  });
});

// ---- Voice burst -------------------------------------------------------------

describe("bitchat vector: voice burst", () => {
  const burstID = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

  // VoiceBurstPacket.encode() writes [burstID:8][seq hi][seq lo][flags], then
  // per-kind bytes. START is flag 0x01 followed by the codec byte; AAC-LC 16 kHz
  // mono is codec 0x01.
  test("START is burstID, seq, 0x01, codec", () => {
    const b = encodeBurstStart(burstID, VoiceCodec.AAC_LC_16KHZ_MONO);
    expect(hex(b)).toBe("0102030405060708" + "0000" + "01" + "01");
  });

  // A data packet is flag 0x00, then each frame as [u16 BE length][bytes].
  test("frames are flag 0x00 then u16-prefixed frames", () => {
    const b = encodeBurstData(burstID, 1, [new Uint8Array([0xaa, 0xbb])]);
    expect(hex(b)).toBe("0102030405060708" + "0001" + "00" + "0002" + "aabb");
  });

  // END is flag 0x02, then the data-packet count as u16 BE and the duration as
  // u32 BE.
  test("END is flag 0x02, u16 count, u32 duration", () => {
    const b = encodeBurstEnd(burstID, 9, 3, 1500);
    expect(hex(b)).toBe(
      "0102030405060708" + "0009" + "02" + "0003" + "000005dc",
    );
  });

  // CANCELED is flag 0x04 and carries nothing after the header.
  test("CANCELED is the bare header with flag 0x04", () => {
    const b = encodeBurstCanceled(burstID, 4);
    expect(hex(b)).toBe("0102030405060708" + "0004" + "04");
  });
});

// ---- Group state -------------------------------------------------------------

describe("bitchat vector: group state TLV", () => {
  // GroupProtocol.encode() emits its tags in this exact order, all with u16
  // lengths: groupID(16) name key(32) epoch(u32 BE) roster creatorFingerprint(32)
  // signature(64). The roster blob is count(1) then, per member,
  // fingerprint(32) ‖ signingKey(32) ‖ nickLen(1) ‖ nickname.
  test("tags appear in bitchat's order with u16 lengths", () => {
    const state: GroupStatePayload = {
      groupID: new Uint8Array(16).fill(0xa1),
      name: "hi",
      key: new Uint8Array(32).fill(0xb2),
      epoch: 1,
      members: [
        {
          fingerprint: "cc".repeat(32),
          signingKey: new Uint8Array(32).fill(0xdd),
          nickname: "n",
        },
      ],
      creatorFingerprint: "cc".repeat(32),
      signature: new Uint8Array(64).fill(0xee),
    };
    const encoded = encodeGroupState(state);
    expect(encoded).not.toBeNull();

    // Walk the TLV stream and record (tag, length) in order.
    const seen: [number, number][] = [];
    let off = 0;
    while (off + 3 <= encoded!.length) {
      const tag = encoded![off];
      const len = (encoded![off + 1] << 8) | encoded![off + 2];
      seen.push([tag, len]);
      off += 3 + len;
    }
    expect(off).toBe(encoded!.length); // no trailing bytes
    expect(seen).toEqual([
      [0x01, 16], // groupID
      [0x02, 2], // name "hi"
      [0x03, 32], // epoch key
      [0x04, 4], // epoch, u32 BE
      [0x05, 1 + 32 + 32 + 1 + 1], // roster: count + one member + 1-char nick
      [0x06, 32], // creator fingerprint
      [0x07, 64], // signature
    ]);
  });

  test("epoch is a u32 big-endian value", () => {
    const encoded = encodeGroupState({
      groupID: new Uint8Array(16),
      name: "g",
      key: new Uint8Array(32),
      epoch: 258, // 0x00000102
      members: [],
      creatorFingerprint: "00".repeat(32),
      signature: new Uint8Array(64),
    })!;
    const epochAt = encoded.indexOf(0x04, 16 + 3);
    expect(hex(encoded.slice(epochAt + 3, epochAt + 7))).toBe("00000102");
  });
});
