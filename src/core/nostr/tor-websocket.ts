// tor-websocket.ts
//
// A minimal WebSocket implementation backed by the AirhopTorSocket native
// module, which tunnels over Arti's SOCKS5 proxy. nostr-tools accepts a custom
// WebSocket via useWebSocketImplementation(); tor-routing.ts installs this one
// on iOS so relay connections go through Tor.
//
// It implements exactly the surface nostr-tools' AbstractRelay touches: the
// on* handler properties, send(), close(), readyState, and the static
// ready-state constants. It is not a full WHATWG WebSocket (no addEventListener,
// no binaryType), which is fine because nostr-tools never uses those.

import type { EmitterSubscription } from "react-native";
import {
  AirhopTorSocketNative,
  subscribeTorSocket,
  type TorSocketEvent,
} from "../../bridge/NativeAirhopTorSocket";

// Per-process unique id source. A plain counter is enough for uniqueness within
// one app run and, unlike a random id, is fully deterministic.
let nextId = 0;

type Handler = ((event: unknown) => void) | null;

export class TorWebSocket {
  // WHATWG ready-state constants, exposed both statically and per-instance
  // because nostr-tools reads them off the constructor (this._WebSocket.OPEN).
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;

  readonly url: string;
  readyState = 0; // CONNECTING

  onopen: Handler = null;
  onmessage: Handler = null;
  onerror: Handler = null;
  onclose: Handler = null;

  private readonly id: string;
  private readonly sub: EmitterSubscription;
  // Frames requested before the socket finished opening. In practice nostr-tools
  // only sends after onopen, but buffering keeps us correct rather than dropping
  // a REQ if that ever changes.
  private pending: string[] = [];

  constructor(url: string) {
    this.url = url;
    this.id = `tor-${nextId++}`;
    this.sub = subscribeTorSocket((event) => this.handle(event));
    // The native module is guaranteed present here: tor-routing.ts only installs
    // this implementation after isTorSocketNativeAvailable() returns true.
    AirhopTorSocketNative?.connect(this.id, url);
  }

  private handle(event: TorSocketEvent): void {
    if (event.id !== this.id) return;
    switch (event.type) {
      case "open": {
        this.readyState = this.OPEN;
        const queued = this.pending;
        this.pending = [];
        for (const frame of queued) {
          AirhopTorSocketNative?.send(this.id, frame);
        }
        this.onopen?.({ type: "open" });
        break;
      }
      case "message":
        // Deliver like a browser MessageEvent so AbstractRelay._onmessage can
        // read ev.data. Nostr relay frames are always JSON text.
        this.onmessage?.({ data: event.data ?? "" });
        break;
      case "error":
        this.onerror?.({ type: "error", message: event.message });
        break;
      case "close":
        this.readyState = this.CLOSED;
        this.sub.remove();
        this.onclose?.({
          code: event.code ?? 1006,
          reason: event.reason ?? "",
        });
        break;
    }
  }

  send(data: string): void {
    const frame = typeof data === "string" ? data : String(data);
    if (this.readyState === this.OPEN) {
      AirhopTorSocketNative?.send(this.id, frame);
    } else if (this.readyState === this.CONNECTING) {
      this.pending.push(frame);
    }
    // Sends after CLOSING/CLOSED are dropped, matching a browser WebSocket.
  }

  close(code?: number, reason?: string): void {
    if (this.readyState === this.CLOSED || this.readyState === this.CLOSING) {
      return;
    }
    this.readyState = this.CLOSING;
    AirhopTorSocketNative?.close(this.id, code ?? 1000, reason ?? "");
    // The native close emits a "close" event, which finalizes readyState and
    // removes the listener; no need to duplicate that here.
  }
}
