import { Arrow, Box, LINE, MONO, MUTED } from "./primitives";

export function IdentityTree() {
  return (
    <svg
      viewBox="0 0 920 330"
      className="h-auto w-full"
      role="img"
      aria-label="Identity key derivation"
    >
      <Arrow id="id-arrow" />
      <Box
        x={16}
        y={130}
        w={200}
        h={64}
        label="Ed25519 signing key"
        sub="generated on first launch"
        strong
      />
      <Box
        x={16}
        y={216}
        w={200}
        h={64}
        label="X25519 Noise static"
        sub="generated on first launch"
        strong
      />

      <line x1={220} y1={162} x2={286} y2={70} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={220} y1={162} x2={286} y2={148} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={220} y1={248} x2={286} y2={226} stroke={LINE} markerEnd="url(#id-arrow)" />

      <Box
        x={290}
        y={44}
        w={232}
        h={54}
        label="Nostr key (secp256k1)"
        sub="HKDF, airhop-nostr-key-v1"
      />
      <Box x={290} y={120} w={232} h={54} label="Per-geohash key" sub="one identity per cell" />
      <Box x={290} y={198} w={232} h={54} label="Peer ID" sub="SHA-256(noisePub) first 8 bytes" />

      <line x1={526} y1={71} x2={588} y2={71} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={526} y1={147} x2={588} y2={147} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={526} y1={225} x2={588} y2={225} stroke={LINE} markerEnd="url(#id-arrow)" />

      <Box
        x={592}
        y={44}
        w={304}
        h={54}
        label="Internet DMs and nutzaps"
        sub="one stable identity everywhere"
      />
      <Box
        x={592}
        y={120}
        w={304}
        h={54}
        label="Location channel presence"
        sub="cells cannot be linked together"
      />
      <Box
        x={592}
        y={198}
        w={304}
        h={54}
        label="swift-falcon-3a9f"
        sub="deterministic name, cannot be squatted"
      />

      <text x={16} y={306} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Both roots live in the iOS Keychain or Android Keystore. Nothing derived from them is ever
        uploaded.
      </text>
    </svg>
  );
}
