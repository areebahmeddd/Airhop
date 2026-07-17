// Key generation, peer ID derivation, and secure storage for Airhop identity.
//
// One identity = one key pair. The Ed25519 signing key doubles as the Nostr
// identity (npub). The X25519 static key is used exclusively for Noise XX
// session establishment. Both private keys live in the OS Keychain/Keystore
// via react-native-encrypted-storage and never leave the device.
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import EncryptedStorage from "react-native-encrypted-storage";

export interface Identity {
  // X25519 static key pair - used for Noise XX session encryption only
  noiseStaticPrivKey: Uint8Array;
  noiseStaticPubKey: Uint8Array;
  // Ed25519 key pair - used for packet signing and as Nostr identity
  signingPrivKey: Uint8Array;
  signingPubKey: Uint8Array;
  // First 16 hex chars of SHA-256(noiseStaticPubKey) = 8 bytes
  peerID: string;
  // Ed25519 signing pubkey as hex = the Nostr npub (without bech32 encoding)
  nostrPubKey: string;
}

const STORAGE_KEY = "airhop.identity.v1";

export async function generateIdentity(): Promise<Identity> {
  const noisePriv = crypto.getRandomValues(new Uint8Array(32));
  const noisePub = x25519.getPublicKey(noisePriv);

  const signingPriv = crypto.getRandomValues(new Uint8Array(32));
  const signingPub = ed25519.getPublicKey(signingPriv);

  const peerID = bytesToHex(sha256(noisePub)).slice(0, 16);

  return {
    noiseStaticPrivKey: noisePriv,
    noiseStaticPubKey: noisePub,
    signingPrivKey: signingPriv,
    signingPubKey: signingPub,
    peerID,
    nostrPubKey: bytesToHex(signingPub),
  };
}

export async function saveIdentity(id: Identity): Promise<void> {
  await EncryptedStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      noisePrivHex: bytesToHex(id.noiseStaticPrivKey),
      signingPrivHex: bytesToHex(id.signingPrivKey),
    }),
  );
}

export async function loadIdentity(): Promise<Identity | null> {
  const raw = await EncryptedStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const parsed: unknown = JSON.parse(raw);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("noisePrivHex" in parsed) ||
    !("signingPrivHex" in parsed) ||
    typeof (parsed as Record<string, unknown>).noisePrivHex !== "string" ||
    typeof (parsed as Record<string, unknown>).signingPrivHex !== "string"
  ) {
    return null;
  }

  const noisePriv = hexToBytes((parsed as Record<string, string>).noisePrivHex);
  const signingPriv = hexToBytes(
    (parsed as Record<string, string>).signingPrivHex,
  );
  const noisePub = x25519.getPublicKey(noisePriv);
  const signingPub = ed25519.getPublicKey(signingPriv);

  return {
    noiseStaticPrivKey: noisePriv,
    noiseStaticPubKey: noisePub,
    signingPrivKey: signingPriv,
    signingPubKey: signingPub,
    peerID: bytesToHex(sha256(noisePub)).slice(0, 16),
    nostrPubKey: bytesToHex(signingPub),
  };
}

// Load existing identity or generate and persist a new one.
export async function loadOrGenerateIdentity(): Promise<Identity> {
  const existing = await loadIdentity();
  if (existing) return existing;

  const fresh = await generateIdentity();
  await saveIdentity(fresh);
  return fresh;
}

// Panic wipe: destroy all keys immediately.
// Caller must also clear MMKV, delete app files, and terminate the process.
export async function panicWipe(): Promise<void> {
  await EncryptedStorage.clear();
}
