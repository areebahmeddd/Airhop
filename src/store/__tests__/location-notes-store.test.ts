/**
 * @jest-environment node
 */
// Retracting a geohash notice.
//
// A geohash notice exists twice: the signed board post flooded over BLE, and
// the kind-1 note it was bridged to. The sheet shows one row because the merge
// hides the note while a matching board post exists, so a tombstone has to
// suppress the note as well as retire the post, and has to keep suppressing it:
// relays re-serve the note on every subscribe, and need not honour NIP-09.
import {
  matchesBridged,
  useLocationNotesStore,
  type LocationNote,
} from "../location-notes-store";

const GEOHASH = "tdr1w";

function note(over: Partial<LocationNote> = {}): LocationNote {
  return {
    id: "event-1",
    pubkey: "a".repeat(64),
    content: "lost dog, black collar",
    createdAtMs: 1_700_000_000_000,
    nickname: "sam",
    geohash: GEOHASH,
    isUrgent: false,
    ...over,
  };
}

function fingerprintOf(n: LocationNote) {
  return {
    geohash: n.geohash,
    content: n.content,
    nickname: n.nickname ?? "anon",
    createdAtMs: n.createdAtMs,
  };
}

beforeEach(() => {
  useLocationNotesStore.getState().clearAll();
});

describe("bridged-copy suppression", () => {
  it("removes the note the deleted board post was bridged to", () => {
    const n = note();
    useLocationNotesStore.getState().addNote(n);
    expect(
      useLocationNotesStore.getState().notesForGeohash(GEOHASH),
    ).toHaveLength(1);

    useLocationNotesStore.getState().suppressBridged(fingerprintOf(n));
    expect(
      useLocationNotesStore.getState().notesForGeohash(GEOHASH),
    ).toHaveLength(0);
  });

  // Filtering once is not enough: the note is still on the relay, and the next
  // reconnect serves it back.
  it("keeps it removed when the relay serves it again", () => {
    const n = note();
    useLocationNotesStore.getState().suppressBridged(fingerprintOf(n));
    useLocationNotesStore.getState().addNote(n);
    expect(
      useLocationNotesStore.getState().notesForGeohash(GEOHASH),
    ).toHaveLength(0);
  });

  it("suppresses a re-served copy under a different event id", () => {
    // Same notice republished by its author's other device: same content, same
    // name, same moment, new event.
    const n = note();
    useLocationNotesStore.getState().suppressBridged(fingerprintOf(n));
    useLocationNotesStore.getState().addNote(note({ id: "event-2" }));
    expect(
      useLocationNotesStore.getState().notesForGeohash(GEOHASH),
    ).toHaveLength(0);
  });

  it("leaves everyone else's notices alone", () => {
    const mine = note();
    const theirs = note({ id: "event-2", content: "found keys" });
    useLocationNotesStore.getState().addNote(mine);
    useLocationNotesStore.getState().addNote(theirs);

    useLocationNotesStore.getState().suppressBridged(fingerprintOf(mine));
    const left = useLocationNotesStore.getState().notesForGeohash(GEOHASH);
    expect(left.map((n) => n.id)).toEqual(["event-2"]);
  });

  // The notes subscription also surfaces neighbouring cells, so a same-text
  // note from the next cell over is a different notice by a different person.
  it("does not reach into a neighbouring cell", () => {
    const neighbour = note({ id: "event-2", geohash: "tdr1x" });
    useLocationNotesStore.getState().addNote(neighbour);
    useLocationNotesStore.getState().suppressBridged(fingerprintOf(note()));
    expect(
      useLocationNotesStore.getState().notesForGeohash("tdr1x"),
    ).toHaveLength(1);
  });
});

describe("matchesBridged", () => {
  it("treats a blank nickname and 'anon' as the same author", () => {
    expect(
      matchesBridged(fingerprintOf(note({ nickname: undefined })), note()),
    ).toBe(false);
    expect(
      matchesBridged(
        { ...fingerprintOf(note()), nickname: "anon" },
        note({ nickname: "   " }),
      ),
    ).toBe(true);
  });

  it("allows the clock skew between the two copies but not more", () => {
    const base = fingerprintOf(note());
    expect(
      matchesBridged(base, note({ createdAtMs: base.createdAtMs + 60_000 })),
    ).toBe(true);
    expect(
      matchesBridged(base, note({ createdAtMs: base.createdAtMs + 3_600_000 })),
    ).toBe(false);
  });
});

describe("removeNote (NIP-09 deletion)", () => {
  it("drops the note and does not let a replay resurrect it", () => {
    const n = note();
    useLocationNotesStore.getState().addNote(n);
    useLocationNotesStore.getState().removeNote(n.id);
    expect(
      useLocationNotesStore.getState().notesForGeohash(GEOHASH),
    ).toHaveLength(0);

    useLocationNotesStore.getState().addNote(n);
    expect(
      useLocationNotesStore.getState().notesForGeohash(GEOHASH),
    ).toHaveLength(0);
  });
});
