// Media: a filesystem, a microphone and a speaker, per phone.
//
// Attachments and live voice are the two features whose bugs only appear when
// something else is happening at the same time, so they cannot be tested with a
// stub that always succeeds. What is needed instead is media that behaves like
// media: files that are actually written and can actually be read back, bytes
// whose magic numbers match their declared MIME (because the receiver checks,
// and a file that lies is dropped), and a microphone that produces frames on a
// clock rather than all at once.
//
// Everything here is per-sandbox. `jest.mock` factories re-run inside each
// isolated module registry, so a module-scope store in this file is one phone's
// storage, exactly as the MMKV mock already works. Two phones cannot see each
// other's files, which is the whole point.

// ---- in-memory expo-file-system --------------------------------------------

interface Node {
  bytes: Uint8Array;
}

// One phone's disk.
export function createExpoFileSystemMock(): unknown {
  const disk = new Map<string, Node>();
  const CACHE = "file:///cache/";

  class File {
    readonly uri: string;
    readonly name: string;

    constructor(base: unknown, name?: string) {
      // Called both as new File(Paths.cache, "name") and, in principle, with a
      // full uri. Only the first form is used by the app today.
      const dir = typeof base === "string" ? base : CACHE;
      this.name = name ?? "";
      this.uri = `${dir}${this.name}`;
    }

    get exists(): boolean {
      return disk.has(this.uri);
    }

    get size(): number {
      return disk.get(this.uri)?.bytes.length ?? 0;
    }

    create(_opts?: { overwrite?: boolean; intermediates?: boolean }): void {
      if (!disk.has(this.uri)) disk.set(this.uri, { bytes: new Uint8Array(0) });
    }

    write(data: Uint8Array | string): void {
      const bytes =
        typeof data === "string"
          ? Uint8Array.from(data, (c) => c.charCodeAt(0))
          : new Uint8Array(data);
      disk.set(this.uri, { bytes });
    }

    // Reading back is what makes a received attachment "playable" in a
    // scenario: the bubble has a uri, and the uri has the bytes that were sent.
    bytes(): Uint8Array {
      return disk.get(this.uri)?.bytes ?? new Uint8Array(0);
    }

    text(): string {
      return String.fromCharCode(...this.bytes());
    }

    delete(): void {
      disk.delete(this.uri);
    }
  }

  class Directory {
    constructor(readonly uri: string = CACHE) {}

    get exists(): boolean {
      return true;
    }

    list(): File[] {
      const out: File[] = [];
      for (const uri of disk.keys()) {
        if (!uri.startsWith(this.uri)) continue;
        out.push(new File(this.uri, uri.slice(this.uri.length)));
      }
      return out;
    }
  }

  return {
    File,
    Directory,
    Paths: { cache: CACHE, document: "file:///documents/" },
    // Test affordance, not part of the expo API.
    __disk: disk,
  };
}

// ---- media bytes ------------------------------------------------------------

// The receiver checks a file's declared MIME against its magic bytes and drops
// anything that disagrees (bitchat-file-packet.ts mimeMatchesMagic). Test media
// therefore has to carry real headers, or every attachment scenario would pass
// vacuously by failing at the same place.

function withHeader(header: number[], totalBytes: number): Uint8Array {
  const out = new Uint8Array(Math.max(totalBytes, header.length));
  out.set(header, 0);
  // Deterministic filler, so a transfer either arrives byte-exact or does not.
  for (let i = header.length; i < out.length; i++) out[i] = (i * 31) & 0xff;
  return out;
}

export const media = {
  jpeg(bytes = 40_000): Uint8Array {
    return withHeader([0xff, 0xd8, 0xff, 0xe0], bytes);
  },
  png(bytes = 40_000): Uint8Array {
    return withHeader([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], bytes);
  },
  pdf(bytes = 20_000): Uint8Array {
    return withHeader([0x25, 0x50, 0x44, 0x46, 0x2d], bytes);
  },
  // An ADTS-framed AAC file, which is what a recorded voice note is.
  voiceNote(bytes = 30_000): Uint8Array {
    return withHeader([0xff, 0xf1, 0x50, 0x80], bytes);
  },
  // Anything at all: resolves to application/octet-stream, which is always
  // accepted and renders as a document.
  blob(bytes = 5_000): Uint8Array {
    return withHeader([0x00], bytes);
  },
};

export function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ---- microphone and speaker -------------------------------------------------

// What the fake native voice module recorded about a phone's audio, so a
// scenario can assert that sound actually reached the speaker rather than that
// a promise resolved.
export interface VoiceRecord {
  captureStarted: number;
  captureStopped: number;
  playbackStarted: number;
  playbackStopped: number;
  // Every frame handed to the speaker, in order.
  framesPlayed: Uint8Array[];
}

const FRAME_INTERVAL_MS = 64;

// A microphone that emits one AAC-LC frame every 64ms, which is what a real
// 16kHz mono encoder produces at 1024 samples per frame. Emitting on a clock
// rather than in a burst is the point: it is what puts voice packets in
// contention with a file transfer, and contention is the bug surface.
// The emitter is BOUND from inside the sandbox rather than captured here, and
// that detail is load-bearing.
//
// A `jest.mock` factory does not reliably resolve `react-native` to the same
// copy the sandboxed app is using: the factory is declared by the test file, so
// its `require` can land in the outer module registry while the phone's
// voice-audio.ts holds the isolated registry's RCTDeviceEventEmitter. Two
// different emitters means frames are emitted into a listener list that is
// permanently empty, and the microphone silently produces nothing. Handing the
// emit function in from inside `jest.isolateModules` removes the ambiguity
// entirely - the caller there is provably in the phone's own registry.
export function createNativeVoiceMock(): {
  module: unknown;
  record: VoiceRecord;
} {
  let emit: (event: string, body: Record<string, unknown>) => void = () =>
    undefined;
  const record: VoiceRecord = {
    captureStarted: 0,
    captureStopped: 0,
    playbackStarted: 0,
    playbackStopped: 0,
    framesPlayed: [],
  };
  let timer: ReturnType<typeof setInterval> | null = null;
  let seq = 0;

  const toBase64 = (bytes: Uint8Array): string => {
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return globalThis.btoa(binary);
  };
  const fromBase64 = (b64: string): Uint8Array => {
    const binary = globalThis.atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  };

  const module = {
    async startCapture(): Promise<void> {
      record.captureStarted++;
      if (timer !== null) return;
      timer = setInterval(() => {
        // A raw AAC frame: no ADTS header, as the codec byte fully describes
        // it (PROTOCOLS.md 3.1). ~40 bytes at 16kbps/64ms, well under the
        // 210-byte burst cap that keeps voice out of the fragment scheduler.
        const frame = new Uint8Array(40);
        frame[0] = 0x21;
        frame[1] = seq & 0xff;
        for (let i = 2; i < frame.length; i++) frame[i] = (seq + i) & 0xff;
        seq++;
        emit("AirhopVoice.frame", { dataBase64: toBase64(frame) });
      }, FRAME_INTERVAL_MS);
    },
    async stopCapture(): Promise<void> {
      record.captureStopped++;
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    },
    async startPlayback(): Promise<void> {
      record.playbackStarted++;
    },
    async enqueueFrames(framesBase64: string[]): Promise<void> {
      for (const f of framesBase64) record.framesPlayed.push(fromBase64(f));
    },
    async stopPlayback(): Promise<void> {
      record.playbackStopped++;
    },
    addListener(): void {
      /* NativeEventEmitter contract */
    },
    removeListeners(): void {
      /* NativeEventEmitter contract */
    },
    // Called from inside the sandbox with that phone's own event emitter.
    __bindEmitter(
      fn: (event: string, body: Record<string, unknown>) => void,
    ): void {
      emit = fn;
    },
    // Capture dying on its own: a call took the mic. The burst must be closed
    // with an END rather than left hanging.
    __failCapture(message = "Recording stopped"): void {
      emit("AirhopVoice.captureError", { message });
    },
  };

  return { module, record };
}
