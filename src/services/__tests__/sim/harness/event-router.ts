// One event emitter per phone, enforced rather than hoped for.
//
// THE PROBLEM
//
// `mesh-service.ts` subscribes to native events through React Native's global
// `DeviceEventEmitter`, and the native modules emit through the same one. That
// is correct for an app, where there is one phone. For a simulation it means
// every phone must have its own emitter, or each one receives every other one's
// native events.
//
// The obvious answer - `jest.isolateModules` - does not deliver it. Stores,
// mesh-service and the native harness modules ARE isolated per sandbox, but
// `react-native` is not: it is pinned by the jest-expo preset before any test
// code runs, and survives `jest.resetModules()`. Worse, Babel compiles
// `DeviceEventEmitter.addListener(...)` into a property read on the react-native
// namespace at CALL time, so even swapping the emitter between sandbox builds
// does not help: by the time any phone actually subscribes, every phone reads
// whatever was installed last.
//
// The symptom is silent and total. Every phone registers links it is not party
// to, and every phone receives every packet delivered to anyone - so a four-hop
// relay chain "succeeds" with nothing having relayed anything. The suite goes
// green while testing nothing.
//
// THE FIX
//
// Install one router in place of the shared emitter and give it an explicit
// notion of which phone is currently executing. Subscriptions are filed under
// that phone; emissions are delivered only to it. There is no ambiguity to
// resolve at call time because the harness always knows whose code it is
// running: `DeviceOS.runOnThread` wraps every native-to-JS callback, and
// `SimDevice.launch` wraps subscription.
//
// smoke.test.ts asserts this holds. If that test goes red, nothing else in this
// directory means anything.

type Listener = (body: unknown) => void;

interface Subscription {
  remove: () => void;
}

class DeviceEventRouter {
  // deviceID -> event name -> listeners
  private readonly byDevice = new Map<string, Map<string, Set<Listener>>>();
  // Anything subscribed outside a device context. Nothing in the simulation
  // should land here; kept so a stray subscriber cannot throw.
  private readonly unowned = new Map<string, Set<Listener>>();
  private current: string | null = null;

  // Run `fn` as `deviceID`. Re-entrant: a device's callback can call into code
  // that runs as the same device without losing the outer frame.
  runAs<T>(deviceID: string, fn: () => T): T {
    const previous = this.current;
    this.current = deviceID;
    try {
      return fn();
    } finally {
      this.current = previous;
    }
  }

  get currentDevice(): string | null {
    return this.current;
  }

  private bucket(deviceID: string | null): Map<string, Set<Listener>> {
    if (deviceID === null) return this.unowned;
    let map = this.byDevice.get(deviceID);
    if (map === undefined) {
      map = new Map();
      this.byDevice.set(deviceID, map);
    }
    return map;
  }

  // ---- the EventEmitter surface RN code expects -----------------------------

  addListener(eventType: string, listener: Listener): Subscription {
    const owner = this.current;
    const events = this.bucket(owner);
    let set = events.get(eventType);
    if (set === undefined) {
      set = new Set();
      events.set(eventType, set);
    }
    set.add(listener);
    return {
      remove: () => {
        set?.delete(listener);
      },
    };
  }

  emit(eventType: string, body?: unknown): void {
    // Deliver only to the phone whose code is running. An emission with no
    // device context is a harness bug, and is dropped loudly rather than
    // broadcast to everybody.
    const events = this.bucket(this.current);
    const set = events.get(eventType);
    if (set === undefined) return;
    for (const listener of [...set]) listener(body);
  }

  removeAllListeners(eventType?: string): void {
    const events = this.bucket(this.current);
    if (eventType === undefined) events.clear();
    else events.delete(eventType);
  }

  listenerCount(eventType: string): number {
    return this.bucket(this.current).get(eventType)?.size ?? 0;
  }

  // Drop everything a phone subscribed, for teardown.
  forget(deviceID: string): void {
    this.byDevice.delete(deviceID);
  }

  // Diagnostics for the harness's own tests.
  deviceCount(): number {
    return this.byDevice.size;
  }

  // Listeners registered with no device context. Anything here is a harness
  // bug: it would receive events from every phone.
  unownedCount(): number {
    let n = 0;
    for (const set of this.unowned.values()) n += set.size;
    return n;
  }

  eventNamesFor(deviceID: string): string[] {
    return [...(this.byDevice.get(deviceID)?.keys() ?? [])];
  }

  // Between scenarios. The router outlives any one world (it is process-wide by
  // necessity), so a scenario that reuses a device id would otherwise inherit
  // the previous scenario's listeners.
  reset(): void {
    this.byDevice.clear();
    this.unowned.clear();
    this.current = null;
  }
}

// ONE router for the process, parked on globalThis.
//
// A module-scope `const router = new DeviceEventRouter()` is NOT enough, and
// this was the last bug in the chain. Jest evaluates a `jest.mock` factory in
// whichever registry first requires the mocked module - which, for a sandboxed
// phone, is that phone's isolated registry. So the factory's
// `require("./event-router")` and this harness's own import resolve to
// DIFFERENT copies of this file, each with its own `router`.
//
// The result was silent and maddening: mesh-service subscribed on router A,
// `runAs` set the current device on router B, so router A never had a current
// device, every listener fell into its "unowned" bucket, and every phone
// received every other phone's native events. Everything looked correctly wired
// because it WAS correctly wired - just to two different objects.
//
// globalThis is the one namespace no module registry can duplicate.
const ROUTER_KEY = "__airhopSimEventRouter";

function sharedRouter(): DeviceEventRouter {
  const g = globalThis as Record<string, unknown>;
  let existing = g[ROUTER_KEY] as DeviceEventRouter | undefined;
  if (existing === undefined) {
    existing = new DeviceEventRouter();
    g[ROUTER_KEY] = existing;
  }
  return existing;
}

export function eventRouter(): DeviceEventRouter {
  return sharedRouter();
}

// The module body a test file installs in place of RCTDeviceEventEmitter.
//
// `jest.mock` intercepts at RESOLUTION, so every path that reaches the emitter -
// react-native's index getter, a direct require, whatever the jest-expo preset
// captured at setup - gets the router. That is what makes this reliable where
// patching the emitter object after the fact was not: the emitter is reachable
// as more than one object, and assigning to the wrong one fails silently.
export function routerModule(): {
  __esModule: true;
  default: DeviceEventRouter;
} {
  return { __esModule: true, default: sharedRouter() };
}

export type { DeviceEventRouter };
