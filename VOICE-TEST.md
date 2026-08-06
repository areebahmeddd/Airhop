## Problem

A signed packet whose payload was compressed by a different DEFLATE encoder
fails signature verification and is dropped.

Signing builds its preimage by re-encoding the packet, and verification
re-encodes too. When the payload is compressed, that re-encoding re-runs
DEFLATE. DEFLATE output is not canonical: any conforming encoder may emit
different bytes for the same input, and this repo uses
Apple's `compression_encode_buffer` while bitchat-android uses
`java.util.zip.Deflater`. Both inflate each other's output correctly, but they
need not produce identical bytes, so the preimage differs and a valid signature
stops verifying.

Verification failure is a drop, not a downgrade, so the message never appears.

It applies to any signed packet with a payload at or above the 100-byte
compression threshold that is not already high-entropy. Ordinary text is well
under the unique-byte ratio, so longer public messages compress and are exposed
while short ones are not, which makes it look intermittent.

Relays compound it: a relay re-encodes on TTL decrement, so it substitutes its
own compression and breaks the signature for everyone downstream.

## Fix

`decode` keeps the payload as it arrived in `WirePayload`, and `encode` reuses
those bytes instead of re-compressing. A locally originated packet has no
`WirePayload` and compresses as before.

`forPayload` binds the stored bytes to the payload they decode to. If the
payload is replaced, the binding no longer holds and the encoder falls back to
compressing, so the bytes can never be reused for content they do not match.

A payload that arrived uncompressed is re-encoded uncompressed. `shouldCompress`
agrees across clients, but the "only if smaller" check need not, so re-deriving
the decision is not safe either.

The field is excluded from the encoded form: it describes how a packet arrived,
not what it is.

## Compatibility

No wire format change and no version bump. Unfixed peers are unaffected.

## Tests

The new test frames a payload in a raw-DEFLATE stored block (BFINAL=1,
BTYPE=00). It is valid, it inflates correctly, and no compressor would emit it,
so it stands in for a foreign encoder without pulling in a second compression
library. The test decodes the frame and asserts the re-encode reproduces the
originator's bytes, which is what a signature depends on.
