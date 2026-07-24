// PKCS#7-style privacy padding, byte-identical to bitchat's MessagePadding.swift
// / CompressionUtil so signatures and frames match across implementations.
//
// bitchat pads every outbound frame up to one of a few fixed block sizes with
// PKCS#7 bytes (every pad byte equals the pad length), and the Ed25519 signature
// is computed over the PADDED unsigned encoding. If our padding differs by a
// single byte, no bitchat node can verify our packets and vice versa.

// Standard block sizes (bitchat MessagePadding.blockSizes).
const BLOCK_SIZES = [256, 512, 1024, 2048];

// Smallest block a payload of `dataSize` fits into, accounting for the ~16-byte
// AEAD tag overhead bitchat budgets for. Returns `dataSize` unchanged when the
// data is larger than the biggest block (it will be fragmented anyway), which
// makes pad() a no-op.
export function optimalBlockSize(dataSize: number): number {
  const totalSize = dataSize + 16;
  for (const block of BLOCK_SIZES) {
    if (totalSize <= block) return block;
  }
  return dataSize;
}

// Append PKCS#7 padding to reach targetSize. No-op when data already meets or
// exceeds the target, or when more than 255 pad bytes would be needed (the pad
// length must fit in the single trailing marker byte).
export function pad(data: Uint8Array, targetSize: number): Uint8Array {
  if (data.length >= targetSize) return data;
  const paddingNeeded = targetSize - data.length;
  if (paddingNeeded <= 0 || paddingNeeded > 255) return data;
  const out = new Uint8Array(data.length + paddingNeeded);
  out.set(data, 0);
  out.fill(paddingNeeded, data.length);
  return out;
}

// Strip PKCS#7 padding. Returns the input unchanged when the trailing bytes are
// not valid padding (so it is safe to call on an unpadded frame).
export function unpad(data: Uint8Array): Uint8Array {
  if (data.length === 0) return data;
  const paddingLength = data[data.length - 1];
  if (paddingLength <= 0 || paddingLength > data.length) return data;
  const start = data.length - paddingLength;
  for (let i = start; i < data.length; i++) {
    if (data[i] !== paddingLength) return data;
  }
  return data.slice(0, start);
}
