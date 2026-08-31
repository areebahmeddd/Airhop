// The native contract for the LAN transport: mDNS discovery over ordinary TCP.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// Backed by AirhopLANModule.kt (NsdManager) and AirhopLANModule.swift
// (NWListener / NWBrowser on Network framework). One contract, two
// implementations, and the mesh engine does not know which it has.
//
// This is the only transport that reaches an iPhone and an Android phone over
// something other than Bluetooth. WiFi Aware cannot: Apple demands a paired
// data path Android cannot complete. Being plain IP, this does not care which
// phone anyone owns.
//
// Discovery and dialling are split, unlike AirhopWiFi where native connects to
// whatever it finds. mDNS finds EVERYONE on the network, and connecting to
// everyone is a full mesh whose cost grows with the square of the room. Who to
// dial is therefore a decision, and decisions live in TypeScript: native
// reports what it sees and opens the sockets it is told to. See
// services/lan-controller.ts for the rule.
//
// Callers optional-chain, and lan-controller.ts reads a missing module as
// permanently unsupported.
//
// Events emitted by native code:
//
//   AirhopLAN.peerDiscovered      { serviceName }
//   AirhopLAN.peerLost            { serviceName }
//   AirhopLAN.linkConnected       { linkID }
//   AirhopLAN.linkDisconnected    { linkID }
//   AirhopLAN.packetReceived      { linkID, dataBase64 }
//   AirhopLAN.availabilityChanged { available }
//
// `availabilityChanged` tells the reconciler to forget it is started, the same
// contract AirhopWiFi has. Android carries both edges off the network callback;
// iOS reports the falling edge only, so the controller answers a drop with its
// retry ladder rather than waiting to be told the network came back.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Publish a service instance, start browsing for others, and open a listening
  // socket. Rejects with a `code` the caller branches on, since they separate
  // retrying from giving up:
  //
  //   LAN_UNSUPPORTED     no mDNS stack, or an OS below the floor. Permanent.
  //   LAN_UNAVAILABLE     no network, or not on WiFi. Clears on its own.
  //   PERMISSION_DENIED   local network access refused. Android asks at
  //                       runtime; on iOS the prompt is raised by browsing, and
  //                       a refusal is only reversible in Settings.
  //   LAN_LISTEN_FAILED   anything else.
  //
  // `instanceName` is chosen by TypeScript and MUST NOT be the peer ID. See
  // services/lan-controller.ts for what an mDNS record exposes and why the name
  // rotates; identity is proven in the ANNOUNCE once the link is up.
  startLAN(instanceName: string): Promise<void>;

  // Stop publishing and browsing, close every link, release the listener.
  stopLAN(): Promise<void>;

  // Open a link to a peer reported by `peerDiscovered`.
  //
  // Named by its service name, which is all the app knows and all it should:
  // Bonjour on iOS resolves lazily at connect time, and Android keeps the
  // address it resolved. Resolves once the socket is up; `linkConnected`
  // follows with the link ID.
  //
  // Idempotent: a peer already linked resolves without opening a second socket.
  // The controller walks its dial plan on a timer, since a link can drop while
  // the peer's record stays visible. Which names are linked stays down here.
  //
  // Rejects with UNKNOWN_PEER or CONNECT_FAILED. Nothing branches on which:
  // both mean no link, and the next pass asks again.
  connectToPeer(serviceName: string): Promise<void>;

  // Base64 bytes to an active link; native frames them with a 4-byte big-endian
  // length prefix, byte-identical to AirhopWiFi. Rejects with UNKNOWN_LINK,
  // INVALID_DATA, FRAME_TOO_LARGE, WRITE_FAILED or LINK_CLOSED.
  writeToLANLink(linkID: string, dataBase64: string): Promise<void>;

  // Required by the NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// `get`, not `getEnforcing`: a build without the module must still run the
// mesh, and a missing module is an answer rather than a crash.
export default TurboModuleRegistry.get<Spec>("AirhopLAN");
