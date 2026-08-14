/**
 * @jest-environment node
 */
// Tests for raw-DEFLATE payload compression (bitchat CompressionUtil parity).
import { deflateRaw } from "pako";
import {
  compress,
  COMPRESSION_THRESHOLD,
  decompress,
  MAX_PAYLOAD_BYTES,
  shouldCompress,
} from "../packet-compression";

describe("packet-compression", () => {
  it("threshold matches bitchat (100 bytes)", () => {
    expect(COMPRESSION_THRESHOLD).toBe(100);
  });

  describe("shouldCompress", () => {
    it("is false below the threshold", () => {
      expect(shouldCompress(new Uint8Array(50))).toBe(false);
    });

    it("is true for large low-entropy data", () => {
      expect(shouldCompress(new TextEncoder().encode("ab".repeat(200)))).toBe(
        true,
      );
    });

    it("is false for high-entropy data", () => {
      const big = new Uint8Array(300);
      for (let i = 0; i < big.length; i++) big[i] = (i * 167 + 13) & 0xff;
      expect(shouldCompress(big)).toBe(false);
    });
  });

  describe("compress / decompress round-trip", () => {
    it("compresses repetitive data and restores it exactly", () => {
      const original = new TextEncoder().encode("hello world ".repeat(50));
      const c = compress(original);
      expect(c).not.toBeNull();
      expect(c!.length).toBeLessThan(original.length);
      const back = decompress(c!, original.length);
      expect(Array.from(back!)).toEqual(Array.from(original));
    });

    it("returns null when the input is too small", () => {
      expect(compress(new Uint8Array(10))).toBeNull();
    });

    it("returns null when compression would not shrink the data", () => {
      // 200 unique-ish bytes barely compress; incompressible -> null.
      const big = new Uint8Array(200);
      for (let i = 0; i < big.length; i++) big[i] = (i * 167 + 13) & 0xff;
      // Not compressible; compress() returns null (result not smaller).
      expect(compress(big)).toBeNull();
    });

    it("decompress rejects a wrong original size", () => {
      const original = new TextEncoder().encode("x".repeat(200));
      const c = compress(original)!;
      expect(decompress(c, 999)).toBeNull();
    });
  });

  // Byte-for-byte parity with reference zlib, the implementation behind both
  // Android's java.util.zip.Deflater(DEFAULT_COMPRESSION, nowrap) and Apple's
  // COMPRESSION_ZLIB. Matching it is what keeps our signing blob identical to
  // bitchat's: both sides sign the RE-ENCODED packet and re-compress on verify,
  // so a different encoder means a signature that will not verify.
  //
  // The expected bytes are frozen test vectors rather than a live zlib call, so
  // the reference cannot drift with the host's zlib version, and so this suite
  // needs no Node-only imports (this is a React Native project with no
  // @types/node). Regenerate with:
  //   node -e "const z=require('zlib');console.log(z.deflateRawSync(Buffer.from(INPUT),{level:6}).toString('hex'))"
  // Vectors below were produced with zlib 1.3.1.
  describe("bitchat wire parity (reference zlib vectors)", () => {
    const fromHex = (hex: string): Uint8Array =>
      new Uint8Array(
        (hex.match(/../g) ?? []).map((byte) => parseInt(byte, 16)),
      );
    const toHex = (bytes: Uint8Array): string =>
      Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

    // Text-shaped payloads with competing repeated substrings. The hash choice
    // only changes match selection when candidates compete, so trivial runs and
    // narrow alphabets encode identically either way and would NOT catch a
    // regression. Every payload below is verified to differ under pako's legacy
    // hash, so this suite fails if `legacyHash: false` is ever dropped.
    const enc = new TextEncoder();
    const vectors: [string, Uint8Array, string][] = [
      [
        "channel message",
        enc.encode(
          "anyone around the plaza tonight? bringing a spare battery pack ".repeat(
            4,
          ),
        ),
        "d5cbc10d80400804c056b6136bd953c2110d10c4c759bd7538ffa1af70012b1e3fd05390175fa2c34d676f1865aee60ae24e9660b05b6a21b99fe09ffb07",
      ],
      [
        "board post",
        enc.encode(
          "lost a black backpack near the fountain, has a laptop and charger inside. if found please leave a note on the board or ping me here. thanks everyone. ".repeat(
            2,
          ),
        ),
        "cd8ec10dc32010045bd90222f7b498b541903b74604be93e8aabc86f1ea3d1749f0b44eadc1b12f7367e60626015e1f0cb16abbd503841748ee503b48cbd304e05aacd9ab5a11e8f9d31ba38852ede0261be04b727979c91e18151edc45b280a6d5885d626742b3e6edad0fff2ea0b",
      ],
      [
        "prose with varied repeats",
        enc.encode(
          "the mesh is up near the north gate. relay running all evening if anyone needs a bridge out to the wider network tonight. ".repeat(
            3,
          ),
        ),
        "e58dd109c3300c05577913642715bf5a22ae54643921db17bc46ff0e0eee4a890fa7c226d6174e4994121e598a2ec503c9210f72b99b77c818e0c5cdf686f8134e38d92604afb4d68958858a5dbaad31e1ac3bf244855bd73ab6faaff10f",
      ],
      [
        "structured peer list",
        enc.encode(
          JSON.stringify({
            peers: Array.from({ length: 40 }, (_, i) => ({
              id: "peer" + i,
              nick: "user" + i,
              seen: 1700000000 + i,
            })),
          }),
        ),
        "65d4316a03611083d1bbfcb50b4bb2bddebd4a48956c610226644965f6ee812485254d37f0758f99c7f85cd7af6d2c2f8f717b1fcbef7a1c8771bfbd7d8c657c6f7febb6aef7b1603afecf7e78eae13dba87f5f49eddd37a79afee65fdc9fb53f727ebcfde9fbb3f5b7ff1fed2fdc5fac9fba9fbc9faabf7d7eeafd6cfdecfddcfee15c06861847012b731dc18818c56862b2398d1ce706704345a1a2e8da0465bc3ad11d8686db836821bed0df74680a3c5e1e20872b439dc9c61ce36a79b33ccd9e68cbbcec36e73ba39c39c6d4e376798b3cde9e60c73b639dd9c61ce36a79b33ccd9e674738639db9c6ece30679bd3cd15e66a73b9b9c25c6d2e375798abcd15df3cdf799bcbcd15e66a73b9b9c25c6d2e375798abcde5e60a73b5b9dc5c61ae36979b2bccd5e69af7d7fd07",
      ],
    ];

    it.each(vectors)(
      "compresses to the reference bytes: %s",
      (_name, input, expectedHex) => {
        const ours = compress(input);
        expect(ours).not.toBeNull();
        expect(toHex(ours!)).toBe(expectedHex);
      },
    );

    it.each(vectors)(
      "inflates a reference-produced stream: %s",
      (_name, input, expectedHex) => {
        const back = decompress(fromHex(expectedHex), input.length);
        expect(back).not.toBeNull();
        expect(Array.from(back!)).toEqual(Array.from(input));
      },
    );
  });
});

// `originalSize` is a number the sender puts on the wire, so decompress treats
// it as a claim and caps the output at it while inflating. Without that cap a
// packet declaring 100 bytes can carry a stream that expands to a gigabyte, and
// any unauthenticated peer in radio range can crash the app with one.
//
// Both bitchat clients bound the output the same way: iOS inflates into a buffer
// allocated at exactly originalSize, Android does the same and then probes for
// one byte more.
describe("decompress bounds a lying size claim", () => {
  // Highly compressible, so a small stream expands a long way. 4 MiB of zeros
  // deflates to a few KB and is enough to show the cap working without making
  // the test slow.
  const BOMB_SIZE = 4 * 1024 * 1024;
  const bomb = compress(new Uint8Array(BOMB_SIZE))!;

  it("the fixture really is a compression bomb", () => {
    expect(bomb).not.toBeNull();
    // Tiny on the wire, enormous when expanded.
    expect(bomb.length).toBeLessThan(64 * 1024);
    expect(BOMB_SIZE / bomb.length).toBeGreaterThan(100);
  });

  it("refuses a stream that expands past its declared size", () => {
    expect(decompress(bomb, 100)).toBeNull();
  });

  it("refuses it whatever small size is declared", () => {
    for (const declared of [1, 64, 1024, 65_536]) {
      expect(decompress(bomb, declared)).toBeNull();
    }
  });

  // The other half of the boundary: capping must not break the honest case.
  it("still accepts the same stream at its true size", () => {
    const out = decompress(bomb, BOMB_SIZE);
    expect(out).not.toBeNull();
    expect(out!.length).toBe(BOMB_SIZE);
    expect(out!.every((b) => b === 0)).toBe(true);
  });

  it("refuses a size claim larger than the real output", () => {
    // Not an overflow, but still a mismatch: the packet is malformed either way.
    expect(decompress(bomb, BOMB_SIZE + 1)).toBeNull();
  });
});

describe("decompress input validation", () => {
  const valid = compress(new Uint8Array(512).fill(7))!;

  it("refuses an empty compressed payload", () => {
    expect(decompress(new Uint8Array(0), 10)).toBeNull();
  });

  it("refuses a non-positive declared size", () => {
    expect(decompress(valid, 0)).toBeNull();
    expect(decompress(valid, -1)).toBeNull();
  });

  it("refuses a declared size beyond the payload ceiling", () => {
    expect(decompress(valid, MAX_PAYLOAD_BYTES + 1)).toBeNull();
  });

  it("refuses a corrupt stream", () => {
    const corrupt = Uint8Array.from(valid);
    corrupt[corrupt.length >> 1] ^= 0xff;
    expect(decompress(corrupt, 512)).toBeNull();
  });

  it("refuses a truncated stream rather than returning partial output", () => {
    expect(decompress(valid.slice(0, valid.length - 2), 512)).toBeNull();
  });

  it("never throws, whatever it is handed", () => {
    const junk = new Uint8Array([0xff, 0x00, 0x13, 0x37, 0xab]);
    expect(() => decompress(junk, 512)).not.toThrow();
    expect(() => decompress(valid, 1)).not.toThrow();
  });
});

describe("payload ceiling", () => {
  // Matches bitchat's AppConstants.Protocol.MAX_PAYLOAD_LENGTH. One number
  // bounds the declared wire length in packet-codec and the decompressed output
  // here, so neither can be raised without the other.
  it("is 10 MiB, matching bitchat", () => {
    expect(MAX_PAYLOAD_BYTES).toBe(10 * 1024 * 1024);
  });
});

// The bound is a resource limit, not a behaviour change: an unbounded inflate
// reaches the same verdict, it just pays for the whole expansion first. No
// correctness assertion can tell the two apart, so this measures the cost.
//
// Written like a perf floor rather than a tight timing test. A 64 KiB stream
// that expands to 64 MiB takes roughly 150ms to inflate whole and roughly 2ms
// to refuse at the bound, so the threshold sits clear of both: about 17x above
// what the bounded path needs on a loaded runner, and about 3x below what the
// unbounded path costs. It catches the bound being removed, never noise.
describe("decompress refuses a bomb without expanding it", () => {
  const EXPANDED = 64 * 1024 * 1024;
  const REFUSAL_BUDGET_MS = 50;

  it("refuses a 64 MiB expansion far faster than inflating it would take", () => {
    // Built with pako directly at the cheapest level: this is a fixture, not
    // wire output, so it does not need the level-6 parity compress() enforces,
    // and level 1 makes it several times faster to construct.
    const bomb = deflateRaw(new Uint8Array(EXPANDED), { level: 1 });
    // Comfortably inside the ~1.1 MiB the fragment reassembler admits, so an
    // attacker really can deliver this. The size is realistic, not contrived.
    expect(bomb.length).toBeLessThan(512 * 1024);

    const started = performance.now();
    const out = decompress(bomb, 100);
    const elapsed = performance.now() - started;

    expect(out).toBeNull();
    expect(elapsed).toBeLessThan(REFUSAL_BUDGET_MS);
  });
});
