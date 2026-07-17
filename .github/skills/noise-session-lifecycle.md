---
description: >
  Reference for the Noise session lifecycle in Airhop: when to use XX vs X,
  how handshake roles are assigned, the transport message format, and the
  session-per-peer model. Mistakes here produce sessions that appear established
  but silently decrypt to garbage, with no thrown error.
---

# Noise Session Lifecycle

Airhop uses two Noise protocol patterns. Both are implemented in `src/core/crypto/`. Wire-compatible with `bitchat/ios/bitchat/Noise/NoiseProtocol.swift`.

## Which Pattern to Use

| Pattern  | Algorithm name                     | Use case                                      |
| -------- | ---------------------------------- | --------------------------------------------- |
| Noise XX | `Noise_XX_25519_ChaChaPoly_SHA256` | Interactive sessions between live peers (DMs) |
| Noise X  | `Noise_X_25519_ChaChaPoly_SHA256`  | One-way sealing for courier envelopes         |

Use **XX** when the peer may be online and can respond. Use **X** only for courier store-and-forward where the recipient is offline. Noise X has no forward secrecy: compromise of the recipient's static key exposes all sealed envelopes.

## Noise XX: Three-Message Handshake

```
msg1: initiator -> responder   -> e            (32 bytes)
msg2: responder -> initiator   <- e, ee, s, es (96 bytes)
msg3: initiator -> responder   -> s, se        (64 bytes)
```

After msg3 both sides call `split()` to derive two independent transport keys.

### Role Assignment

The node that **sends msg1** is the initiator. The node that **receives msg1** is the responder. This is determined by which side opens the connection, not by comparing peer IDs.

If both sides try to initiate simultaneously (race condition), the side that receives a 32-byte msg1 while its own handshake is still in progress drops its own attempt and switches to responder. Bitchat iOS implements this in `NoiseSessionManager.handleIncomingHandshake()` — a 32-byte incoming message when already handshaking resets and starts fresh as responder.

### Session State

A session has three states: `uninitialized`, `handshaking`, `established`. Only call `encrypt` / `decrypt` on an established session.

### Transport Message Format

After the handshake, transport messages use:

```
[4-byte BE nonce][ciphertext + 16-byte Poly1305 tag]
```

The nonce is prepended as a big-endian u32 so the receiver can decrypt out-of-order messages using the replay guard. This matches bitchat's `useExtractedNonce: true` mode.

### Replay Protection

A sliding window of 1024 nonces is maintained per session. Messages with a nonce more than 1024 positions behind the highest seen nonce are rejected. `decrypt()` throws on replay.

### Key Assignment After Split

```
initiator sends with k1, receives with k2
responder sends with k2, receives with k1
```

This is handled automatically inside `NoiseHandshake.split()`. Do not swap keys manually.

## Noise X: One-Way Sealing

Wire format:

```
[32 bytes: ephemeral pub key e]
[48 bytes: enc_s + 16-byte tag]
[payload_len + 16 bytes: enc_payload + tag]
```

The sender's static key (`s`) is transmitted inside the ciphertext, so the recipient can authenticate who sealed the envelope. There is no response message.

## Sessions Are Per Peer ID, Not Per Transport

One `NoiseSession` object is shared for a given peer regardless of whether the connection is over BLE or WiFi. Do not create a new session when the transport changes. The session stays valid as long as the peer is reachable.

## ChaCha20-Poly1305 Nonce Layout

The 12-byte AEAD nonce used internally (not the 4-byte transport prefix):

```
bytes [0-3]  = 0x00
bytes [4-7]  = counter as little-endian u32
bytes [8-11] = 0x00
```

This matches the bitchat iOS nonce construction in `NoiseCipherState`.

## What Not to Do

- Do not use `encrypt` / `decrypt` before `isEstablished()` returns true.
- Do not create a separate session per transport (BLE, WiFi) for the same peer.
- Do not use Noise X for live interactive DMs; it has no forward secrecy.
- Do not cache or persist a `NoiseSession` across app restarts; regenerate on reconnect.
