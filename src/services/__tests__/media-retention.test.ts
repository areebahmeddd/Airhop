/**
 * @jest-environment node
 */
// Attachment retention. Before this sweep the panic wipe was the only thing
// that ever deleted media, so a photo outlived the conversation it belonged to
// by months. These pin what gets deleted, and more importantly what does not.

interface FakeFile {
  name: string;
  size: number;
  lastModified: number | null;
  creationTime: number | null;
  deleted: boolean;
  delete: () => void;
}

// The state the mocked filesystem reads. Declared on globalThis because
// jest.mock factories are hoisted above every module-scope binding in this
// file, so a plain `const` would still be in its temporal dead zone when the
// factory runs.
declare global {
  var __disk: FakeFile[];
  var __dirExists: boolean;
}
globalThis.__disk = [];
globalThis.__dirExists = true;

jest.mock("expo-file-system", () => {
  // `instanceof FileSystem.File` is how the sweep tells a file from a
  // directory, so the fakes must be real instances of the mocked class.
  class MockFile {}
  class MockDirectory {
    get exists(): boolean {
      return globalThis.__dirExists;
    }
    list(): unknown[] {
      return globalThis.__disk.filter((f) => !f.deleted);
    }
  }
  return {
    File: MockFile,
    Directory: MockDirectory,
    Paths: { cache: "/cache" },
  };
});

import * as FileSystem from "expo-file-system";
import {
  MEDIA_MAX_AGE_MS,
  sweepExpiredAttachments,
} from "../file-transfer-service";

const NOW = 1_800_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

function put(opts: {
  name: string;
  ageMs?: number;
  size?: number;
  lastModified?: number | null;
  creationTime?: number | null;
}): FakeFile {
  const file = Object.assign(Object.create(FileSystem.File.prototype), {
    name: opts.name,
    size: opts.size ?? 1000,
    lastModified:
      opts.lastModified !== undefined
        ? opts.lastModified
        : NOW - (opts.ageMs ?? 0),
    creationTime: opts.creationTime ?? null,
    deleted: false,
  }) as FakeFile;
  file.delete = (): void => {
    file.deleted = true;
  };
  globalThis.__disk.push(file);
  return file;
}

beforeEach(() => {
  globalThis.__disk = [];
  globalThis.__dirExists = true;
});

describe("sweepExpiredAttachments", () => {
  it("deletes an attachment past the retention window", () => {
    const old = put({ name: "airhop_old.jpg", ageMs: 8 * DAY, size: 4096 });
    const freed = sweepExpiredAttachments(NOW);
    expect(old.deleted).toBe(true);
    expect(freed).toBe(4096);
  });

  it("keeps one inside the window", () => {
    const fresh = put({ name: "airhop_fresh.jpg", ageMs: 6 * DAY });
    expect(sweepExpiredAttachments(NOW)).toBe(0);
    expect(fresh.deleted).toBe(false);
  });

  it("keeps a file exactly at the boundary", () => {
    const edge = put({ name: "airhop_edge.jpg", ageMs: MEDIA_MAX_AGE_MS });
    sweepExpiredAttachments(NOW);
    expect(edge.deleted).toBe(false);
  });

  // The cache directory is shared with the rest of the app and the OS. Only
  // files Airhop wrote carry the prefix, and nothing else may be touched.
  it("never touches a file without the Airhop prefix", () => {
    const foreign = put({ name: "someone_elses.jpg", ageMs: 400 * DAY });
    sweepExpiredAttachments(NOW);
    expect(foreign.deleted).toBe(false);
  });

  // Android has no creationTime below API 26. Deleting user content because a
  // timestamp is missing is the worse of the two failures.
  it("keeps a file whose age cannot be read", () => {
    const unknown = put({
      name: "airhop_unknown.jpg",
      lastModified: null,
      creationTime: null,
    });
    sweepExpiredAttachments(NOW);
    expect(unknown.deleted).toBe(false);
  });

  it("falls back to creationTime when lastModified is missing", () => {
    const old = put({
      name: "airhop_c.jpg",
      lastModified: null,
      creationTime: NOW - 30 * DAY,
    });
    sweepExpiredAttachments(NOW);
    expect(old.deleted).toBe(true);
  });

  // A clock that jumped backwards makes every file look like it is from the
  // future. That must not read as "expired".
  it("keeps a file stamped in the future", () => {
    const future = put({ name: "airhop_future.jpg", ageMs: -30 * DAY });
    sweepExpiredAttachments(NOW);
    expect(future.deleted).toBe(false);
  });

  it("sweeps sent and received media alike", () => {
    const received = put({ name: "airhop_in.jpg", ageMs: 10 * DAY });
    const sent = put({ name: "airhop_out.jpg", ageMs: 10 * DAY });
    sweepExpiredAttachments(NOW);
    expect([received.deleted, sent.deleted]).toEqual([true, true]);
  });

  it("survives a missing cache directory", () => {
    globalThis.__dirExists = false;
    expect(sweepExpiredAttachments(NOW)).toBe(0);
  });

  it("a failed delete does not stop the rest of the sweep", () => {
    const locked = put({ name: "airhop_locked.jpg", ageMs: 10 * DAY });
    locked.delete = (): never => {
      throw new Error("EBUSY");
    };
    const other = put({ name: "airhop_other.jpg", ageMs: 10 * DAY, size: 77 });
    const freed = sweepExpiredAttachments(NOW);
    expect(other.deleted).toBe(true);
    // Only what was actually removed is counted as freed.
    expect(freed).toBe(77);
  });

  it("honours a caller-supplied window", () => {
    const file = put({ name: "airhop_x.jpg", ageMs: 2 * DAY });
    sweepExpiredAttachments(NOW, 1 * DAY);
    expect(file.deleted).toBe(true);
  });

  // The sweep runs at launch and every delete is a synchronous native call, so
  // it is bounded. The bound is not a silent truncation: it runs again next
  // launch, and nothing older is being created behind it.
  it("bounds how much it deletes in one pass, and finishes on the next", () => {
    for (let i = 0; i < 250; i++) {
      put({ name: `airhop_${String(i)}.jpg`, ageMs: 30 * DAY, size: 10 });
    }
    sweepExpiredAttachments(NOW);
    const leftAfterFirst = globalThis.__disk.filter((f) => !f.deleted).length;
    expect(leftAfterFirst).toBeGreaterThan(0);
    expect(leftAfterFirst).toBeLessThan(250);

    // Second launch clears the remainder.
    sweepExpiredAttachments(NOW);
    expect(globalThis.__disk.every((f) => f.deleted)).toBe(true);
  });
});
