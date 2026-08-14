// A transcription of the parts of src/app/app.tsx that own the transport
// lifecycle, driving the REAL mesh-service.
//
// Navigation, chat and wallet are left out: none of them can lose a race between
// a permission grant and a radio. Four paths are modelled, faithfully enough
// that a defect here is a defect in the app:
//
//   startMeshWithPermissions  request, record, start, then chain the location
//                             and notification prompts
//   mount                     reuse an existing mesh for the same identity
//   AppState "active"         re-check permissions, retry the radios
//   meshStopRequested         applyPresence("away")
//
// Alongside src/platform/ble-permissions.ts, whose fine-location requirement and
// grant, deny and blocked handling are reproduced against the OS model.

import type { Identity } from "@core/crypto/identity";
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { useMeshStateStore } from "@store/mesh-state-store";
import { DeviceEventEmitter } from "react-native";
// The real type, not a copy: the annotation below only guards against drift if
// it points at production. This file redeclared the interface and annotated
// against its own copy, which is how the literal kept a `needsPreciseLocation`
// field after the real one dropped it.
import type { BlePermissionResult } from "@platform/ble-permissions";
import {
  destroyMeshService,
  getMeshService,
  initMeshService,
} from "@services/mesh-service";
import { applyPresence } from "@services/presence-service";
import type { AndroidPermission, DeviceOS } from "./os";

// Deterministic identity: a scenario's trace should differ only because of the
// scenario, never because of a fresh random key.
export function makeIdentity(seedByte = 7): Identity {
  const noisePriv = new Uint8Array(32).fill(seedByte);
  const noisePub = x25519.getPublicKey(noisePriv);
  const signingPriv = new Uint8Array(32).fill(seedByte + 1);
  const signingPub = ed25519.getPublicKey(signingPriv);
  return {
    noiseStaticPrivKey: noisePriv,
    noiseStaticPubKey: noisePub,
    signingPrivKey: signingPriv,
    signingPubKey: signingPub,
    peerID: bytesToHex(sha256(noisePub)).slice(0, 16),
  };
}

function requiredBlePermissions(os: DeviceOS): AndroidPermission[] {
  // API 31+ asks for Bluetooth and nothing else: the manifest asserts
  // neverForLocation on BLUETOOTH_SCAN. Below that the flag does not exist and
  // a scan really is a location access.
  if (os.apiLevel >= 31) {
    return [
      "android.permission.BLUETOOTH_SCAN",
      "android.permission.BLUETOOTH_ADVERTISE",
      "android.permission.BLUETOOTH_CONNECT",
    ];
  }
  return ["android.permission.ACCESS_FINE_LOCATION"];
}

// A check, never a prompt.
export function hasBlePermissions(os: DeviceOS): boolean {
  if (os.platform !== "android") return true;
  return requiredBlePermissions(os).every(
    (p) => os.checkPermission(p) === "granted",
  );
}

// `answer` stands in for the user tapping through the OS dialog. The OS model
// applies the settle delay on the grant.
export function ensureBlePermissions(
  os: DeviceOS,
  answer: (p: AndroidPermission) => "granted" | "denied" | "blocked",
): BlePermissionResult {
  // Annotated, so a field that stops existing on the real type is a compile
  // error here rather than a stale property nothing reads. This object carried
  // `needsPreciseLocation` for a while after the real one dropped it, precisely
  // because an unannotated literal gets no excess-property check.
  const locationRequired = os.platform === "android" && os.apiLevel < 31;
  const clean: BlePermissionResult = {
    granted: true,
    denied: [],
    blockedForever: false,
    locationRequired,
  };
  if (os.platform !== "android") return clean;
  const required = requiredBlePermissions(os);

  // Fast path: already granted, no prompt.
  if (required.every((p) => os.checkPermission(p) === "granted")) return clean;

  os.log(
    "js",
    "PERMISSION_PROMPT",
    required.map((p) => p.split(".").pop()).join(", "),
  );
  const denied: string[] = [];
  let blockedForever = false;
  for (const p of required) {
    if (os.checkPermission(p) === "granted") continue;
    const result = answer(p);
    os.setPermission(p, result === "blocked" ? "blocked" : result);
    if (result !== "granted") {
      denied.push(p);
      if (result === "blocked") blockedForever = true;
    }
  }
  os.log(
    "js",
    "PERMISSION_RESULT",
    denied.length === 0 ? "all granted" : `denied: ${denied.length}`,
  );
  return {
    granted: denied.length === 0,
    denied,
    blockedForever,
    locationRequired,
  };
}

export interface AppShellOptions {
  os: DeviceOS;
  identity?: Identity;
  nickname?: string;
  // How the user answers each permission dialog.
  answer?: (p: AndroidPermission) => "granted" | "denied" | "blocked";
}

// The alerts the app would have put on screen. Asserting on these is how we
// check the UX story a scenario tells, not just whether the radio came up.
export interface ShownAlert {
  title: string;
  kind: "blocked" | "denied";
}

export class AppShell {
  readonly os: DeviceOS;
  readonly identity: Identity;
  readonly nickname: string;
  readonly alerts: ShownAlert[] = [];
  private readonly answer: (
    p: AndroidPermission,
  ) => "granted" | "denied" | "blocked";
  private stopRequestSub: { remove: () => void } | null = null;

  constructor(opts: AppShellOptions) {
    this.os = opts.os;
    this.identity = opts.identity ?? makeIdentity();
    this.nickname = opts.nickname ?? "tester";
    this.answer = opts.answer ?? (() => "granted");
  }

  // The React runtime finishing its bundle load. Everything native emitted
  // before this point had nowhere to go.
  bootJsRuntime(): void {
    this.os.jsRuntimeReady = true;
    this.os.log("js", "JS_RUNTIME_READY");
  }

  wireMeshStopListener(): void {
    this.stopRequestSub = DeviceEventEmitter.addListener(
      "AirhopBLE.meshStopRequested",
      () => {
        this.os.log("js", "MESH_STOP_REQUESTED");
        applyPresence("away", this.nickname);
      },
    );
  }

  // In the app's own order.
  async startMeshWithPermissions(): Promise<void> {
    const perm = ensureBlePermissions(this.os, this.answer);
    // Record WHY the mesh cannot run, not merely that it cannot.
    const setBlocker = useMeshStateStore.getState().setBleBlocker;
    useMeshStateStore.getState().setBlePermissionBlocked(perm.blockedForever);
    if (perm.granted) setBlocker("starting");
    else if (perm.locationRequired) setBlocker("location-permission");
    else if (perm.blockedForever) setBlocker("permission-blocked");
    else setBlocker("permission-denied");
    if (!perm.granted && perm.blockedForever) {
      this.alerts.push({ title: "Bluetooth access is off", kind: "blocked" });
    }
    // The mesh still starts either way, so Nostr keeps working; the difference
    // is that the radio controller now knows it cannot bring BLE up, says so,
    // and retries when the facts change.
    this.os.log("js", "initMeshService");
    initMeshService(this.identity, this.nickname);
    useMeshStateStore.getState().setPresenceStatus("online");
    await Promise.resolve();
  }

  // A remount reuses an existing mesh for the same identity.
  async mount(): Promise<void> {
    const existing = getMeshService();
    if (existing?.peerID !== this.identity.peerID) {
      await this.startMeshWithPermissions();
    } else {
      this.os.log("js", "MOUNT_REUSED_EXISTING_MESH");
    }
  }

  async setAppState(next: "active" | "background"): Promise<void> {
    this.os.appForeground = next === "active";
    this.os.log("user", `APP_${next.toUpperCase()}`);
    if (next !== "active") return;
    // Unconditional: the controller reads the device itself, so the resume
    // handler does not have to guess whether anything changed.
    this.os.log("js", "retryRadios (resume)");
    getMeshService()?.retryRadios();
    await Promise.resolve();
  }

  // Process death: the OS reclaims everything. The next launch is a cold one.
  killProcess(): void {
    this.stopRequestSub?.remove();
    this.stopRequestSub = null;
    destroyMeshService();
    this.os.jsRuntimeReady = false;
    this.os.crashed = null;
    this.os.log("user", "PROCESS_KILLED");
  }

  teardown(): void {
    this.stopRequestSub?.remove();
    this.stopRequestSub = null;
    destroyMeshService();
  }
}
