/**
 * @jest-environment node
 */
// Throughput of the operations that run on every packet on the hot path.
//
// Run with `npm run benchmark`. This prints a report and always passes: it is
// not a CI gate. Runner speed varies by several times between machines, so an
// absolute threshold here would fail for reasons unrelated to the change being
// tested. Compare two runs on the same machine instead.
//
// What to look at:
//   - encode and decode should stay within the same order of magnitude
//   - signing should stay roughly an order of magnitude slower than both, since
//     it is elliptic-curve work rather than byte shuffling
//   - compression should only be paying for itself on payloads that compress
//
// A change in those RATIOS is the signal. The absolute numbers are only
// meaningful against another run on the same hardware.
import { ed25519 } from "@noble/curves/ed25519.js";
import {
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "../packet-codec";
import { compress, decompress } from "../packet-compression";

// Enough iterations to swamp timer granularity, few enough to stay quick.
const ITERATIONS = 2000;

function bench(
  name: string,
  fn: () => void,
): { name: string; opsPerSec: number } {
  // One warm pass so JIT compilation is not counted as work.
  for (let i = 0; i < 50; i++) fn();
  const start = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) fn();
  const elapsedNs = Number(process.hrtime.bigint() - start);
  return { name, opsPerSec: Math.round(ITERATIONS / (elapsedNs / 1e9)) };
}

describe("protocol throughput", () => {
  it("reports operations per second on the hot path", () => {
    const priv = ed25519.utils.randomSecretKey();
    const pub = ed25519.getPublicKey(priv);

    // A typical public chat message: the packet the mesh carries most.
    const base: Packet = {
      type: PacketType.CHANNEL_MSG,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(0x11),
      recipientID: new Uint8Array(8),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: new TextEncoder().encode(
        "meet at the north gate in ten minutes",
      ),
    };
    base.signature = signPacket(base, priv);
    const encoded = encodePacket(base);
    const decoded = decodePacket(encoded)!;

    // 4 KB of repetitive text, which is what an attachment caption or a board
    // post looks like to the compressor.
    const compressible = new TextEncoder().encode("airhop ".repeat(600));
    const compressed = compress(compressible)!;

    const results = [
      bench("encodePacket", () => void encodePacket(base)),
      bench("decodePacket", () => void decodePacket(encoded)),
      bench("signPacket", () => void signPacket(base, priv)),
      bench("verifyPacket", () => void verifyPacket(decoded, pub)),
      bench("compress 4KB", () => void compress(compressible)),
      bench(
        "decompress 4KB",
        () => void decompress(compressed, compressible.length),
      ),
    ];

    const width = Math.max(...results.map((r) => r.name.length));
    const lines = results.map(
      (r) =>
        `  ${r.name.padEnd(width)}  ${r.opsPerSec.toLocaleString()} ops/sec`,
    );
    console.log(
      `\nprotocol throughput (${ITERATIONS} iterations each)\n${lines.join("\n")}\n`,
    );

    // The only assertion: every operation completed. Speed is reported, never
    // gated, for the reason in the header.
    for (const r of results) expect(r.opsPerSec).toBeGreaterThan(0);
  });
});
