// One simulated phone.
//
// The problem this file solves: Airhop is full of module-scope singletons, by
// design. `getMeshService()` returns one mesh. `useChatStore` is one store.
// `createMMKV({id})` returns one instance per id. That is correct for an app -
// there is one phone - and fatal for a simulation, where twenty phones have to
// disagree with each other about the state of the world.
//
// The fix is not to refactor the app. It is `jest.isolateModules`, which builds
// a fresh module registry: a second copy of mesh-service, of every store, of
// the MMKV mock, and - critically - of `DeviceEventEmitter`, so native events
// raised inside one phone cannot be heard by another. Each phone is therefore a
// closure over its own private copy of the entire app, and NOTHING in src/ had
// to change to allow it.
//
// Two consequences worth knowing before reading further:
//
//   * Types cannot cross the boundary usefully. Device A's `ChatMessage` class
//     identity differs from device B's. Everything this file hands back is
//     structural, and every cross-device comparison is by value.
//   * Whatever a scenario wants to do to a phone has to be exposed here as a
//     method. That is a feature: the control surface below is deliberately what
//     a USER can do (send, open, background, kill, wipe), not what an internal
//     function can do. If a scenario cannot be written against this surface,
//     that is a finding about the app, not a gap in the harness.

import type { Identity } from "../../../../core/crypto/identity";
import type {
  AndroidBleModule,
  RadioPort,
} from "../../lifecycle/harness/android-native";
import type { IosBleModule } from "../../lifecycle/harness/ios-native";
import type {
  AndroidPermission,
  DeviceOS,
  Platform,
} from "../../lifecycle/harness/os";
import { eventRouter } from "./event-router";
import type { VoiceRecord } from "./media-fabric";
import type { RelayFabric } from "./relay-fabric";
import type { World } from "./world";

// Paths are resolved from THIS file, and re-resolved inside each sandbox.
const P = {
  os: "../../lifecycle/harness/os",
  android: "../../lifecycle/harness/android-native",
  ios: "../../lifecycle/harness/ios-native",
  shim: "../../lifecycle/harness/bridge-shim",
  appShell: "../../lifecycle/harness/app-shell",
  mesh: "../../../mesh-service",
  chatStore: "../../../../store/chat-store",
  peerStore: "../../../../store/peer-store",
  meshStateStore: "../../../../store/mesh-state-store",
  settingsStore: "../../../../store/settings-store",
  contactsStore: "../../../../store/contacts-store",
  walletStore: "../../../../store/wallet-store",
  outboxStore: "../../../../store/outbox-store",
  groupStore: "../../../../store/group-store",
  boardStore: "../../../../store/board-store",
  blockedStore: "../../../../store/blocked-store",
  transferStore: "../../../../store/transfer-store",
  activityStore: "../../../../store/activity-store",
  noticesStore: "../../../../store/notices-store",
  nostrPool: "nostr-tools/pool",
  fileSystem: "expo-file-system",
  location: "expo-location",
  walletService: "../../../wallet-service",
  voiceBridge: "../../../../bridge/NativeAirhopVoice",
} as const;

const ALL_PERMISSIONS: AndroidPermission[] = [
  "android.permission.BLUETOOTH_SCAN",
  "android.permission.BLUETOOTH_ADVERTISE",
  "android.permission.BLUETOOTH_CONNECT",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.POST_NOTIFICATIONS",
];

export interface DeviceSpec {
  id: string;
  platform: Platform;
  apiLevel?: number;
  nickname?: string;
  // Identity determinism: a scenario's trace must differ only because of the
  // scenario, never because of a fresh random key.
  seedByte?: number;
  adapter?: "on" | "off";
  locationServicesEnabled?: boolean;
  permissionSettleMs?: number;
  hasBluetooth?: boolean;
  // Some Android chipsets at the API 26 floor have no BLE peripheral role at
  // all: they scan and receive but can never be discovered.
  canAdvertise?: boolean;
  grantPermissions?: boolean;
  internetEnabled?: boolean;
  gatewayEnabled?: boolean;
  bridgeEnabled?: boolean;
  liveVoiceEnabled?: boolean;
}

// A message as the UI would render it, flattened so it can be compared across
// devices whose module identities differ.
export interface SeenMessage {
  id: string;
  channel: string;
  senderID: string;
  senderNickname: string;
  text: string;
  timestampMs: number;
  isMine: boolean;
  isSystem?: boolean;
  status?: string;
  viaBridge?: boolean;
  attachment?: {
    type: string;
    // Where the received bytes were cached. Reading it back is how a scenario
    // asserts an attachment is actually playable rather than merely rendered.
    uri?: string;
    name?: string;
    mimeType?: string;
    durationMs?: number;
    sizeBytes?: number;
  };
}

// Everything the sandbox captured from inside the isolated registry. Held as
// `unknown`-ish structural types because the classes inside are not the classes
// outside.
interface Inner {
  os: DeviceOS;
  native: AndroidBleModule | IosBleModule;
  identity: Identity;
  mesh: {
    getMeshService: () => MeshLike | null;
    initMeshService: (identity: Identity, nickname: string) => MeshLike;
    destroyMeshService: () => void;
  };
  stores: Record<string, StoreLike>;
  // The phone's disk, so a scenario can read back a received attachment rather
  // than trusting that a bubble appeared.
  fs: { __disk: Map<string, { bytes: Uint8Array }> } | null;
  // What its microphone and speaker actually did.
  voice: VoiceRecord | null;
  wallet: WalletServiceLike;
  // The event emitter this phone's native module and mesh-service share. Held
  // ONLY so the harness can prove, in a test, that two phones do not share one.
  // If they ever did, every scenario in this directory would be meaningless:
  // each phone would receive every other phone's native events directly, and a
  // multi-hop delivery would "work" without anything being relayed.
  emitter: object;
  // Pulled out of the store module so balances can be read the same way the
  // Wallet screen reads them.
  selectAccounts:
    | ((state: unknown) => {
        balance: number;
        unverified: number;
        reserved: number;
      }[])
    | null;
}

// The wallet-service surface a scenario drives. Structural, because the module
// inside a sandbox is not the module this file was compiled against.
interface WalletServiceLike {
  initWalletService: () => Promise<boolean>;
  addMint: (url: string) => Promise<{ ok?: boolean; [k: string]: unknown }>;
  createLightningDeposit: (params: {
    amount: number;
    mintUrl: string;
    unit?: string;
  }) => Promise<{ quoteId: string; txId: string; [k: string]: unknown }>;
  claimLightningDeposit: (
    mintUrl: string,
    unit: string,
    quoteId: string,
  ) => Promise<number>;
  prepareSend: (params: {
    amount: number;
    mintUrl?: string;
    allowInexact?: boolean;
  }) => Promise<{ txId: string; token: string }>;
  confirmSend: (txId: string) => void;
  reclaimSend: (txId: string) => boolean;
  receiveToken: (
    raw: string,
    opts?: { preferOffline?: boolean },
  ) => Promise<{ amount: number; outcome: string }>;
  refreshAccount: (...args: unknown[]) => Promise<unknown>;
  [k: string]: unknown;
}

interface StoreLike {
  getState: () => Record<string, unknown>;
  setState: (partial: Record<string, unknown>) => void;
}

// Invoke a store action across the sandbox boundary.
//
// Everything coming out of an isolated registry is `unknown` to us: device A's
// zustand store is not device B's, and neither is the one this file was
// compiled against. Rather than lie about the types with a cast at every call
// site, there is one place that does the check.
function call(store: StoreLike, action: string, ...args: unknown[]): unknown {
  const fn = store.getState()[action];
  if (typeof fn !== "function") return undefined;
  return (fn as (...a: unknown[]) => unknown)(...args);
}

// The subset of MeshService a scenario drives. Structural, so it does not bind
// to the class inside the sandbox.
interface MeshLike {
  peerID: string;
  sendChannelMessage: (
    channel: string,
    text: string,
    nearbyOnly?: boolean,
  ) => {
    bleLinks: number;
    nostr: boolean;
    gateway: boolean;
    [k: string]: unknown;
  };
  sendDm: (
    recipientPeerID: string,
    text: string,
    messageID?: string,
  ) => "sent" | "sent-nostr" | "needs-courier" | "queued";
  sendAttachment: (
    channel: string,
    bytes: Uint8Array,
    meta: Record<string, unknown>,
    onOutcome?: (ok: boolean) => void,
  ) => boolean;
  sendReadReceipts: (peerID: string) => void;
  canSendLiveVoice: (channel: string) => boolean;
  setLiveVoiceAudible: (channel: string | null) => void;
  startVoiceBurst: (channel: string, onFailure: () => void) => Promise<boolean>;
  stopVoiceBurst: () => Promise<unknown>;
  cancelVoiceBurst: () => Promise<void>;
  cancelTransfer: (transferId: string) => void;
  retryRadios: () => void;
  refresh: () => void;
  setDiscoverable: (enabled: boolean) => void;
  stop: () => void;
  dispose: () => void;
  getContactCard: () => unknown;
  addVerifiedContact: (card: unknown) => unknown;
  createGroup: (name: string, memberPeerIDs: string[]) => string | null;
  sendGroupMessage: (...args: unknown[]) => unknown;
  createBoardPost: (
    content: string,
    geohash: string,
    urgent: boolean,
    expiryDays: number,
  ) => boolean;
  sendMeshPing: (peerID: string) => Promise<unknown>;
  getNostrPubKeyHex: () => string;
  getChannelGeohash: (channel: string) => string | null;
  canSealPrivateMedia: (peerID: string) => boolean;
  applyInternetEnabled: (enabled: boolean) => void;
  [k: string]: unknown;
}

export class SimDevice {
  readonly id: string;
  readonly platform: Platform;
  readonly nickname: string;
  readonly spec: DeviceSpec;

  private inner: Inner;
  // Set once the app has been launched. A device can exist (be in the world,
  // have a phone number) without its app running.
  private launched = false;
  // The screen uses Math.random() to keep two sends in the same millisecond
  // apart. A counter does the same job and keeps a scenario reproducible.
  private msgSeq = 0;

  private constructor(
    readonly world: World,
    spec: DeviceSpec,
    inner: Inner,
  ) {
    this.id = spec.id;
    this.platform = spec.platform;
    this.nickname = spec.nickname ?? spec.id;
    this.spec = spec;
    this.inner = inner;
  }

  // ---- construction ---------------------------------------------------------

  static create(
    world: World,
    spec: DeviceSpec,
    relay?: RelayFabric,
  ): SimDevice {
    const inner = buildSandbox(world, spec, relay);
    const device = new SimDevice(world, spec, inner);
    world.onClose(() => device.teardown());
    return device;
  }

  get os(): DeviceOS {
    return this.inner.os;
  }

  get native(): AndroidBleModule | IosBleModule {
    return this.inner.native;
  }

  get peerID(): string {
    return this.inner.identity.peerID;
  }

  get identity(): Identity {
    return this.inner.identity;
  }

  get nostrPubkey(): string {
    return this.mesh?.getNostrPubKeyHex() ?? "";
  }

  get mesh(): MeshLike | null {
    return this.inner.mesh.getMeshService();
  }

  get isRunning(): boolean {
    return this.launched && this.mesh !== null;
  }

  attachRadioPort(port: RadioPort): void {
    this.inner.native.radioPort = port;
  }

  store(name: keyof typeof P): StoreLike {
    const s = this.inner.stores[name];
    if (s === undefined) throw new Error(`no store ${String(name)} captured`);
    return s;
  }

  log(kind: string, detail?: string): void {
    this.inner.os.log("user", kind, detail);
  }

  // ---- lifecycle ------------------------------------------------------------

  // Tapping the icon. The JS bundle finishes loading, then the app starts the
  // mesh. Native events raised before this had nowhere to go, which is modelled
  // faithfully by the OS's jsRuntimeReady flag.
  launch(): void {
    if (this.launched) return;
    this.inner.os.jsRuntimeReady = true;
    this.inner.os.log("js", "JS_RUNTIME_READY");
    // mesh-service subscribes to native events inside start(). Those
    // subscriptions must be filed against THIS phone, or they would be shared
    // with every other phone in the world.
    eventRouter().runAs(this.id, () => {
      this.inner.mesh.initMeshService(this.inner.identity, this.nickname);
    });
    call(this.inner.stores.meshStateStore, "setPresenceStatus", "online");
    this.launched = true;
  }

  background(): void {
    this.inner.os.appForeground = false;
    this.inner.os.log("user", "APP_BACKGROUND");
    // iOS moves the service UUID into the advertisement overflow area here, so
    // who can see this phone changes even though nothing about the radio did.
    this.inner.native.radioPort?.radiosChanged();
  }

  foreground(): void {
    this.inner.os.appForeground = true;
    this.inner.os.log("user", "APP_ACTIVE");
    // App.tsx:456 — unconditional on resume; the controller reads the device
    // itself rather than the resume handler guessing what changed.
    this.mesh?.retryRadios();
    this.inner.native.radioPort?.radiosChanged();
  }

  // The OS reclaims the process. Everything in memory is gone; MMKV survives,
  // as it would on a real phone.
  kill(): void {
    this.inner.os.log("user", "PROCESS_KILLED");
    this.inner.mesh.destroyMeshService();
    this.inner.os.jsRuntimeReady = false;
    this.inner.os.crashed = null;
    this.launched = false;
    this.inner.native.radioPort?.radiosChanged();
  }

  // Cold launch after a kill: same storage, fresh memory.
  relaunch(): void {
    this.kill();
    this.launch();
  }

  setBluetooth(on: boolean): void {
    this.inner.os.setBluetooth(on);
  }

  setLocationServices(on: boolean): void {
    this.inner.os.locationServicesEnabled = on;
    this.inner.os.log("os", "LOCATION_SERVICES", on ? "on" : "off");
    this.mesh?.refresh();
  }

  revokePermission(p: AndroidPermission): void {
    this.inner.os.setPermission(p, "denied");
    this.inner.os.log("user", "PERMISSION_REVOKED", p.split(".").pop());
    this.mesh?.refresh();
  }

  grantPermission(p: AndroidPermission): void {
    this.inner.os.setPermission(p, "granted");
    this.mesh?.refresh();
  }

  setDiscoverable(enabled: boolean): void {
    this.mesh?.setDiscoverable(enabled);
  }

  setInternet(enabled: boolean): void {
    call(this.inner.stores.settingsStore, "setInternetEnabled", enabled);
    this.mesh?.applyInternetEnabled(enabled);
  }

  setSetting(key: string, value: unknown): void {
    const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    if (
      typeof this.inner.stores.settingsStore.getState()[setter] === "function"
    ) {
      call(this.inner.stores.settingsStore, setter, value);
    } else {
      this.inner.stores.settingsStore.setState({ [key]: value });
    }
  }

  getSetting(key: string): unknown {
    return this.inner.stores.settingsStore.getState()[key];
  }

  teardown(): void {
    eventRouter().forget(this.id);
    try {
      this.inner.mesh.destroyMeshService();
    } catch {
      // A device that already crashed has nothing to dispose.
    }
    if ("invalidate" in this.inner.native) {
      (this.inner.native as AndroidBleModule).invalidate();
    }
    this.inner.native.radioPort = null;
    this.launched = false;
  }

  // ---- user actions ---------------------------------------------------------

  joinChannel(channel: string): void {
    call(this.inner.stores.chatStore, "addChannel", channel);
  }

  // An Airhop private channel: the symmetric key rides in the invite link, so
  // joining IS holding the key. Returns the channel actually opened, which can
  // be suffixed if the name clashed with one already held under a different key.
  joinPrivateChannel(
    channel: string,
    key: Uint8Array,
    overNostr = false,
  ): string {
    let binary = "";
    for (const b of key) binary += String.fromCharCode(b);
    const keyBase64 = globalThis.btoa(binary);
    const opened = call(
      this.inner.stores.chatStore,
      "joinPrivateChannel",
      channel,
      keyBase64,
      overNostr,
    );
    return typeof opened === "string" ? opened : channel;
  }

  openThread(channel: string): void {
    call(this.inner.stores.chatStore, "setActiveChannel", channel);
    call(this.inner.stores.chatStore, "markChannelRead", channel);
    if (channel.startsWith("dm:")) {
      this.mesh?.sendReadReceipts(channel.slice(3));
    }
  }

  closeThread(): void {
    call(this.inner.stores.chatStore, "setActiveChannel", "");
  }

  // Compose and send, exactly as message-thread.tsx does it.
  //
  // Reproducing the screen matters here rather than calling the service
  // directly, because the SCREEN owns three things the service does not: the
  // local echo, the message id that echo carries, and the mapping from a send
  // result to a delivery status. A harness that called sendChannelMessage()
  // straight would never render the sender's own message and would never see a
  // status at all, so every unread, badge and delivery-tick assertion below it
  // would be vacuous.
  //
  // Mirrors message-thread.tsx:1709 handleSend + :1586 transmit, with the undo
  // window off (undoSendSeconds <= 0), which is the immediate-send path.
  send(channel: string, text: string, nearbyOnly = false): string {
    const id = `${this.peerID}-${this.world.now}-${this.msgSeq++}`;
    this.log("SEND", `${channel}: ${text}`);
    call(this.inner.stores.chatStore, "addChannel", channel);
    call(this.inner.stores.chatStore, "addMessage", {
      id,
      channel,
      senderID: this.peerID,
      senderNickname: this.nickname,
      text,
      timestampMs: this.world.now,
      isMine: true,
      status: "sending",
    });

    const service = this.mesh;
    if (service === null) {
      call(
        this.inner.stores.chatStore,
        "setMessageStatus",
        channel,
        id,
        "failed",
      );
      return "failed";
    }

    let status: string;
    if (channel.startsWith("dm:")) {
      const result = service.sendDm(channel.slice(3), text, id);
      status =
        result === "needs-courier"
          ? "carried"
          : result === "queued"
            ? "queued"
            : "sent";
    } else if (channel.startsWith("group:")) {
      // Mirrors message-thread.tsx: sealing the packet is not reaching anyone.
      const sent = service.sendGroupMessage(
        channel.slice("group:".length),
        text,
        id,
      ) as { sealed: boolean; bleLinks: number } | undefined;
      status = sent?.sealed === true && sent.bleLinks > 0 ? "sent" : "failed";
    } else {
      const sent = service.sendChannelMessage(channel, text, nearbyOnly);
      // Mirrors message-thread.tsx: a location channel with no live relay but a
      // reachable gateway peer is "carried", not "failed".
      status =
        sent.bleLinks > 0 || sent.nostr
          ? "sent"
          : sent.gateway
            ? "carried"
            : "failed";
    }
    call(this.inner.stores.chatStore, "setMessageStatus", channel, id, status);
    return status;
  }

  // Kept for scenarios that want the raw service outcome rather than the
  // screen's interpretation of it.
  sendChannelMessage(
    channel: string,
    text: string,
    nearbyOnly = false,
  ): { bleLinks: number; nostr: boolean; gateway: boolean } | undefined {
    this.log("SEND_CHANNEL", `${channel}: ${text}`);
    return this.mesh?.sendChannelMessage(channel, text, nearbyOnly);
  }

  sendDm(peerID: string, text: string, messageID?: string): string {
    this.log("SEND_DM", `${peerID.slice(0, 8)}: ${text}`);
    return this.mesh?.sendDm(peerID, text, messageID) ?? "queued";
  }

  sendAttachment(
    channel: string,
    bytes: Uint8Array,
    meta: Record<string, unknown>,
    onOutcome?: (ok: boolean) => void,
  ): boolean {
    this.log(
      "SEND_ATTACHMENT",
      `${channel}: ${bytes.length}B ${String(meta.mimeType ?? "")}`,
    );
    return this.mesh?.sendAttachment(channel, bytes, meta, onOutcome) ?? false;
  }

  // ---- observation ----------------------------------------------------------

  messages(channel: string): SeenMessage[] {
    const raw = this.inner.stores.chatStore.getState().messages as
      Record<string, SeenMessage[]> | undefined;
    return (raw?.[channel] ?? []).map((m) => ({ ...m }));
  }

  allMessages(): Record<string, SeenMessage[]> {
    const raw = (this.inner.stores.chatStore.getState().messages ??
      {}) as Record<string, SeenMessage[]>;
    const out: Record<string, SeenMessage[]> = {};
    for (const k of Object.keys(raw)) out[k] = raw[k].map((m) => ({ ...m }));
    return out;
  }

  texts(channel: string): string[] {
    return this.messages(channel).map((m) => m.text);
  }

  unread(channel: string): number {
    const counts = this.inner.stores.chatStore.getState().unreadCounts as
      Record<string, number> | undefined;
    return counts?.[channel] ?? 0;
  }

  totalUnread(): number {
    const counts = (this.inner.stores.chatStore.getState().unreadCounts ??
      {}) as Record<string, number>;
    return Object.values(counts).reduce((a, b) => a + b, 0);
  }

  channels(): string[] {
    const chans = this.inner.stores.chatStore.getState().channels;
    return Array.isArray(chans) ? [...(chans as string[])] : [];
  }

  // Peers this device believes are on the mesh right now.
  peers(): string[] {
    const peers = this.inner.stores.peerStore.getState().peers;
    if (peers instanceof Map) return [...peers.keys()];
    return Object.keys((peers ?? {}) as Record<string, unknown>);
  }

  peerCount(): number {
    return this.peers().length;
  }

  // Whether this phone currently holds a BLE link to that peer, as opposed to
  // merely having heard about them through the mesh.
  isDirectPeer(peerID: string): boolean {
    const peers = this.inner.stores.peerStore.getState().peers;
    if (!(peers instanceof Map)) return false;
    const entry = peers.get(peerID) as { isDirect?: boolean } | undefined;
    return entry?.isDirect === true;
  }

  // How many BLE links the SERVICE believes it has, as opposed to how many the
  // radio actually holds. A gap between the two is a state desynchronisation
  // and is exactly the kind of bug that makes a healthy phone go silent, so it
  // is worth being able to see both.
  // See Inner.emitter.
  get eventEmitter(): object {
    return this.inner.emitter;
  }

  bleLinkCount(): number {
    return this.bleLinkIDs().length;
  }

  bleLinkIDs(): string[] {
    const links = (
      this.mesh as unknown as { connectedLinks?: Set<string> } | null
    )?.connectedLinks;
    return links === undefined ? [] : [...links];
  }

  // The geohash cell a named location channel currently resolves to, or null
  // while the position fix is still pending. A phone cannot post to a location
  // channel before this exists, so scenarios wait on it rather than racing it.
  channelGeohash(channel: string): string | null {
    return this.mesh?.getChannelGeohash(channel) ?? null;
  }

  // Whether this phone has heard a neighbour advertise the gateway capability
  // (ANNOUNCE TLV 0x05). A phone with no signal can only ask for help once it
  // knows somebody is offering it, so scenarios wait on this rather than on
  // mere peer discovery.
  seesGateway(): boolean {
    const registry = (
      this.mesh as unknown as {
        registry?: { hasReachableGateway?: () => boolean };
      } | null
    )?.registry;
    return registry?.hasReachableGateway?.() === true;
  }

  // Same, for the bridge capability (TLV 0x05 bit 1<<7).
  seesBridge(): boolean {
    const registry = (
      this.mesh as unknown as {
        registry?: { hasReachableBridge?: () => boolean };
      } | null
    )?.registry;
    return registry?.hasReachableBridge?.() === true;
  }

  meshState(): Record<string, unknown> {
    return { ...this.inner.stores.meshStateStore.getState() };
  }

  // Messages still waiting for a route. A DM the app could not confirm should
  // be here, not forgotten.
  outboxSize(): number {
    const all = this.inner.stores.outboxStore.getState().pending;
    return Array.isArray(all) ? all.length : 0;
  }

  contacts(): string[] {
    const c = (this.inner.stores.contactsStore.getState().contacts ??
      {}) as Record<string, unknown>;
    return Object.keys(c);
  }

  // ---- private groups ------------------------------------------------------

  // Create a private group. Returns its hex id, which is also the suffix of its
  // channel key (`group:<id>`).
  createGroup(name: string, memberPeerIDs: string[]): string | null {
    this.log("CREATE_GROUP", `${name} with ${memberPeerIDs.length} member(s)`);
    return this.mesh?.createGroup(name, memberPeerIDs) ?? null;
  }

  // Group ids this phone believes it belongs to.
  groups(): string[] {
    const groups = this.inner.stores.groupStore.getState().groups;
    if (!Array.isArray(groups)) return [];
    return (groups as { groupIDHex?: string; id?: string }[])
      .map((g) => g.groupIDHex ?? g.id ?? "")
      .filter((id) => id.length > 0);
  }

  knowsGroup(groupIDHex: string): boolean {
    return call(this.inner.stores.groupStore, "get", groupIDHex) !== undefined;
  }

  // ---- bulletin board ------------------------------------------------------

  // Pin a signed notice. `geohash` empty means the mesh-local board.
  postNotice(
    content: string,
    geohash = "",
    urgent = false,
    expiryDays = 1,
  ): boolean {
    this.log("POST_NOTICE", content);
    return (
      this.mesh?.createBoardPost(content, geohash, urgent, expiryDays) === true
    );
  }

  // Notices this phone holds, newest first.
  notices(
    geohash = "",
  ): { content: string; author: string; urgent: boolean }[] {
    const posts = call(
      this.inner.stores.boardStore,
      "postsForGeohash",
      geohash,
    );
    if (!Array.isArray(posts)) return [];
    return (
      posts as {
        content: string;
        authorNickname: string;
        flags: number;
      }[]
    ).map((p) => ({
      content: p.content,
      author: p.authorNickname,
      urgent: (p.flags & 0x01) !== 0,
    }));
  }

  // ---- media ---------------------------------------------------------------

  // Every file this phone has cached, by uri.
  files(): { uri: string; bytes: Uint8Array }[] {
    const disk = this.inner.fs?.__disk;
    if (disk === undefined) return [];
    return [...disk.entries()].map(([uri, node]) => ({
      uri,
      bytes: node.bytes,
    }));
  }

  // The bytes behind a received attachment. This is what "playable" means: the
  // bubble points at a uri, and the uri has the sender's bytes.
  readAttachment(uri: string): Uint8Array | null {
    return this.inner.fs?.__disk.get(uri)?.bytes ?? null;
  }

  attachments(channel: string): SeenMessage[] {
    return this.messages(channel).filter((m) => m.attachment !== undefined);
  }

  get voice(): VoiceRecord | null {
    return this.inner.voice;
  }

  canSendLiveVoice(channel: string): boolean {
    return this.mesh?.canSendLiveVoice(channel) ?? false;
  }

  // Holding the push-to-talk button.
  async startVoiceBurst(channel: string): Promise<boolean> {
    this.log("PTT_DOWN", channel);
    let failed = false;
    const ok = await (this.mesh?.startVoiceBurst(channel, () => {
      failed = true;
    }) ?? Promise.resolve(false));
    if (failed) this.log("PTT_FAILED", channel);
    return ok;
  }

  async stopVoiceBurst(): Promise<void> {
    this.log("PTT_UP");
    await this.mesh?.stopVoiceBurst();
  }

  // Being on the thread, which is what makes incoming audio audible.
  listenTo(channel: string | null): void {
    this.mesh?.setLiveVoiceAudible(channel);
  }

  // ---- wallet ---------------------------------------------------------------

  // The last send this device prepared, so a scenario can reclaim it the way
  // the Wallet screen does when a sheet is dismissed.
  private lastTxId: string | null = null;

  async walletReady(): Promise<boolean> {
    return this.world.resolve(this.inner.wallet.initWalletService());
  }

  async addMint(url: string): Promise<boolean> {
    try {
      const result = await this.world.resolve(this.inner.wallet.addMint(url));
      return result.ok !== false;
    } catch {
      return false;
    }
  }

  // Top up over Lightning: request a quote, then claim it once paid.
  async depositSats(amount: number, mintUrl?: string): Promise<boolean> {
    const mint = mintUrl ?? this.firstMintUrl();
    if (mint === null) return false;
    try {
      const quote = await this.world.resolve(
        this.inner.wallet.createLightningDeposit({ amount, mintUrl: mint }),
      );
      const quoteId = typeof quote.quoteId === "string" ? quote.quoteId : "";
      await this.world.resolve(
        this.inner.wallet.claimLightningDeposit(mint, "sat", quoteId),
      );
      return true;
    } catch (e) {
      this.log("DEPOSIT_FAILED", String(e));
      return false;
    }
  }

  // Build a token for `amount`. Returns the serialised token, or null if it
  // could not be built. `allowInexact` mirrors the sheet's "send anyway".
  async prepareSend(amount: number): Promise<string | null> {
    const mint = this.firstMintUrl();
    if (mint === null) return null;
    try {
      const prepared = await this.world.resolve(
        this.inner.wallet.prepareSend({
          amount,
          mintUrl: mint,
          allowInexact: true,
        }),
      );
      this.lastTxId = prepared.txId;
      return prepared.token;
    } catch (e) {
      this.log("PREPARE_SEND_FAILED", String(e));
      return null;
    }
  }

  reclaimLastSend(): boolean {
    if (this.lastTxId === null) return false;
    return this.inner.wallet.reclaimSend(this.lastTxId);
  }

  confirmLastSend(): void {
    if (this.lastTxId !== null) this.inner.wallet.confirmSend(this.lastTxId);
  }

  async receiveToken(
    raw: string,
    opts: { preferOffline?: boolean } = {},
  ): Promise<boolean> {
    if (raw.length === 0) return false;
    try {
      const result = await this.world.resolve(
        this.inner.wallet.receiveToken(raw, opts),
      );
      this.log("RECEIVE_TOKEN", `${result.amount} (${result.outcome})`);
      return result.outcome === "swapped" || result.outcome === "stored";
    } catch (e) {
      this.log("RECEIVE_TOKEN_FAILED", String(e));
      return false;
    }
  }

  async refreshWallet(): Promise<void> {
    const mint = this.firstMintUrl();
    if (mint === null) return;
    try {
      await this.world.resolve(this.inner.wallet.refreshAccount(mint, "sat"));
    } catch (e) {
      this.log("REFRESH_FAILED", String(e));
    }
  }

  private firstMintUrl(): string | null {
    const mints = this.inner.stores.walletStore.getState().mints as
      Record<string, { url: string }> | undefined;
    const first = Object.values(mints ?? {})[0];
    return first?.url ?? null;
  }

  private accounts(): {
    balance: number;
    unverified: number;
    reserved: number;
  }[] {
    const selectAccounts = this.inner.selectAccounts;
    if (selectAccounts === null) return [];
    return selectAccounts(this.inner.stores.walletStore.getState());
  }

  // Raw store snapshot, for diagnosing a balance that disagrees with itself.
  walletDebug(): string {
    const st = this.inner.stores.walletStore.getState();
    const proofs = st.proofs as Record<string, unknown[]>;
    const reserved = st.reserved as Record<
      string,
      { account: string; proofs: unknown[] }
    >;
    return JSON.stringify({
      proofKeys: Object.keys(proofs ?? {}),
      proofCounts: Object.values(proofs ?? {}).map((p) => p.length),
      reservedKeys: Object.keys(reserved ?? {}),
      reservedAccounts: Object.values(reserved ?? {}).map((r) => r.account),
      mints: Object.keys((st.mints ?? {}) as Record<string, unknown>),
      accounts: this.accounts(),
    });
  }

  // Spendable, across every (mint, unit) account.
  balance(): number {
    return this.accounts().reduce((a, b) => a + b.balance, 0);
  }

  // The part of the balance the mint has not confirmed as unspent.
  unverifiedBalance(): number {
    return this.accounts().reduce((a, b) => a + b.unverified, 0);
  }

  // Set aside against a send that has been serialised but not confirmed.
  reservedBalance(): number {
    return this.accounts().reduce((a, b) => a + b.reserved, 0);
  }

  // Everything this device is accountable for. The invariant that matters:
  // summed across every device this can only ever equal what the mint issued.
  totalHeld(): number {
    return this.balance() + this.reservedBalance();
  }

  // ---- storage / wipe -------------------------------------------------------

  // Triple-tap the logo. The real wipe also clears the Keychain, which is
  // exercised by panic-wipe.test.ts; what matters to a scenario is that the
  // mesh is destroyed with the identity it held and every store is emptied, so
  // nothing survives into the next launch.
  panicWipe(): void {
    this.log("PANIC_WIPE");
    this.inner.mesh.destroyMeshService();
    for (const name of Object.keys(this.inner.stores)) {
      call(this.inner.stores[name], "clearAll");
    }
    this.launched = false;
    this.inner.native.radioPort?.radiosChanged();
  }
}

// ---- the isolated registry --------------------------------------------------

function buildSandbox(
  world: World,
  spec: DeviceSpec,
  relay?: RelayFabric,
): Inner {
  let inner: Inner | null = null;

  // Clear the module registry before isolating.
  //
  // `jest.isolateModules` alone does not re-instantiate a module that the
  // parent registry already holds, and under jest-expo `react-native` is always
  // already held. The consequence is specific and fatal: `DeviceEventEmitter` is
  // read through react-native's index getter at CALL time, so every phone's
  // mesh-service and native module end up talking to whichever emitter was
  // installed last. Every phone then hears every other phone's native events.
  // Resetting first forces react-native itself to be rebuilt inside the
  // isolation window, which is what actually separates the phones.
  jest.resetModules();

  jest.isolateModules(() => {
    // Give this phone its own DeviceEventEmitter, explicitly.
    //
    // This is the single most important line in the file, and it exists because
    // `jest.isolateModules` does NOT reliably re-instantiate `react-native`
    // under the jest-expo preset: the stores, mesh-service and the native module
    // are all isolated per sandbox, but they can still resolve to ONE shared
    // RCTDeviceEventEmitter. When that happens every phone receives every other
    // phone's native events, and the failure is silent and total - a phone
    // registers links it is not party to, and a multi-hop delivery "succeeds"
    // with nothing having relayed it. Every scenario in this directory would
    // pass for the wrong reason.
    //
    // So rather than depend on isolation we cannot verify, the emitter is
    // replaced with a fresh instance BEFORE this sandbox's modules load. Each
    // module captures `DeviceEventEmitter` at load time through react-native's
    // getter, so whatever is installed here is what this phone's mesh-service
    // listens on and what its native module emits into. Later swaps cannot
    // disturb a binding that has already been captured.
    //
    // smoke.test.ts asserts this holds. If that test ever goes red, nothing
    // else in this directory means anything.
    // The DeviceEventEmitter every phone would otherwise share is replaced by
    // the event router, via a jest.mock in each test file (see
    // harness/event-router.ts). Nothing needs installing here. What matters is
    // that every entry into THIS phone's code runs inside
    // `eventRouter().runAs(id, ...)` - done by launch() below for subscription,
    // and by DeviceOS.runOnThread for every native-to-JS callback.
    const androidMod = require(
      P.android,
    ) as typeof import("../../lifecycle/harness/android-native");

    const osMod = require(P.os) as typeof import("../../lifecycle/harness/os");
    const shim = require(
      P.shim,
    ) as typeof import("../../lifecycle/harness/bridge-shim");
    const appShell = require(
      P.appShell,
    ) as typeof import("../../lifecycle/harness/app-shell");

    const os = new osMod.DeviceOS({
      platform: spec.platform,
      apiLevel: spec.apiLevel ?? 34,
      adapter: spec.adapter ?? "on",
      locationServicesEnabled: spec.locationServicesEnabled ?? true,
      permissionSettleMs: spec.permissionSettleMs ?? 0,
      hasBluetooth: spec.hasBluetooth ?? true,
      clock: world.clock,
      sink: (e) => world.record(spec.id, e),
      label: spec.id,
      runAs: (fn) => eventRouter().runAs(spec.id, fn),
    });

    if (spec.platform === "android" && (spec.grantPermissions ?? true)) {
      for (const p of ALL_PERMISSIONS) os.setPermission(p, "granted");
    }

    let native: AndroidBleModule | IosBleModule;
    if (spec.platform === "android") {
      const android = new androidMod.AndroidBleModule(os);
      android.initialize();
      native = android;
    } else {
      const mod = require(
        P.ios,
      ) as typeof import("../../lifecycle/harness/ios-native");
      native = new mod.IosBleModule(os);
    }
    shim.installNativeBle(native);

    const stores: Record<string, StoreLike> = {
      chatStore: require(P.chatStore).useChatStore,
      peerStore: require(P.peerStore).usePeerStore,
      meshStateStore: require(P.meshStateStore).useMeshStateStore,
      settingsStore: require(P.settingsStore).useSettingsStore,
      contactsStore: require(P.contactsStore).useContactsStore,
      outboxStore: require(P.outboxStore).useOutboxStore,
      groupStore: require(P.groupStore).useGroupStore,
      boardStore: require(P.boardStore).useBoardStore,
      blockedStore: require(P.blockedStore).useBlockedStore,
      transferStore: require(P.transferStore).useTransferStore,
      walletStore: require(P.walletStore).useWalletStore,
      activityStore: require(P.activityStore).useActivityStore,
      noticesStore: require(P.noticesStore).useNoticesStore,
    };

    // Settings have to be right BEFORE the mesh starts: start() reads
    // internetEnabled to decide whether to build the Nostr transport at all.
    call(
      stores.settingsStore,
      "setInternetEnabled",
      spec.internetEnabled ?? false,
    );
    call(
      stores.settingsStore,
      "setGatewayEnabled",
      spec.gatewayEnabled ?? false,
    );
    call(stores.settingsStore, "setBridgeEnabled", spec.bridgeEnabled ?? false);
    call(
      stores.settingsStore,
      "setLiveVoiceEnabled",
      spec.liveVoiceEnabled ?? true,
    );

    // Swap the socket BEFORE mesh-service can build a pool. nostr-tools keeps
    // the implementation in module scope, and this registry's copy is this
    // phone's alone, so each device gets a socket bound to its own identity in
    // the relay fabric.
    if (relay !== undefined) {
      const pool = require(P.nostrPool) as {
        useWebSocketImplementation: (impl: unknown) => void;
      };
      pool.useWebSocketImplementation(relay.socketClassFor(spec.id));
    }

    // Bind this phone's position into its own copy of the location mock, so
    // named geohash channels resolve to a real cell. Without it they resolve to
    // no cell and the gateway and bridge have nothing to carry.
    try {
      const loc = require(P.location) as {
        __bindDevice?: (id: string) => void;
      };
      loc.__bindDevice?.(spec.id);
    } catch {
      // Not mocked in this suite.
    }

    // Resolved through the sandbox's own registry, so each phone gets its own
    // disk and its own microphone. Both are optional: a scenario that does not
    // mock them simply has no media, and nothing here fails.
    let fs: Inner["fs"] = null;
    let voice: Inner["voice"] = null;
    try {
      const fsMod = require(P.fileSystem) as {
        __disk?: Map<string, { bytes: Uint8Array }>;
      };
      if (fsMod.__disk !== undefined) fs = { __disk: fsMod.__disk };
    } catch {
      // Not mocked in this suite.
    }
    try {
      const voiceMod = require(P.voiceBridge) as {
        default?: {
          __record?: VoiceRecord;
          __bindEmitter?: (
            fn: (event: string, body: Record<string, unknown>) => void,
          ) => void;
        };
      };
      voice = voiceMod.default?.__record ?? null;
      // Bind the fake microphone to THIS phone's event emitter. Doing it here
      // rather than in the jest.mock factory is what guarantees it is the same
      // emitter voice-audio.ts subscribes on; see media-fabric.ts.
      const rn = require("react-native") as {
        DeviceEventEmitter: {
          emit: (event: string, body: Record<string, unknown>) => void;
        };
      };
      voiceMod.default?.__bindEmitter?.((event, body) => {
        rn.DeviceEventEmitter.emit(event, body);
      });
    } catch {
      // Not mocked in this suite.
    }

    const wallet = require(P.walletService) as WalletServiceLike;
    const emitter = (require("react-native") as { DeviceEventEmitter: object })
      .DeviceEventEmitter;
    const selectAccounts =
      (
        require(P.walletStore) as {
          selectAccounts?: (state: unknown) => {
            balance: number;
            unverified: number;
            reserved: number;
          }[];
        }
      ).selectAccounts ?? null;

    const identity = appShell.makeIdentity(spec.seedByte ?? 7);
    const mesh = require(P.mesh) as Inner["mesh"];

    inner = {
      os,
      native,
      identity,
      mesh,
      stores,
      fs,
      voice,
      wallet,
      selectAccounts,
      emitter,
    };
  });

  if (inner === null) throw new Error("sandbox build produced nothing");
  return inner;
}
