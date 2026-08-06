/**
 * @jest-environment node
 */
// The counting rules behind "4 of 6 members reachable" in the message info
// sheet. Both exclusions exist so the number agrees with the member list the
// reader can open next to it; a count that disagrees with a visible list is
// worse than no count, because only one of them can be believed.

import { groupReach } from "../group-reach";

const ME = "aaaaaaaaaaaaaaaa";
// A roster stores fingerprints; the radio knows peer IDs, which are the first
// 16 hex of the fingerprint.
const fp = (peerID: string): string => `${peerID}${"0".repeat(48)}`;

const ALICE = "1111111111111111";
const BOB = "2222222222222222";
const CARA = "3333333333333333";

const roster = (...peerIDs: string[]): string[] => peerIDs.map(fp);
const set = (...ids: string[]): Set<string> => new Set(ids);

describe("groupReach", () => {
  it("counts reachable members against the rest of the roster", () => {
    expect(
      groupReach(roster(ME, ALICE, BOB, CARA), ME, set(ALICE, CARA), set()),
    ).toEqual({ reachable: 2, total: 3 });
  });

  it("excludes you from both halves", () => {
    // A four-person roster reads "of 3". Counting yourself would put your own
    // device in question, and you are trivially reachable.
    const r = groupReach(roster(ME, ALICE, BOB, CARA), ME, set(ME), set());
    expect(r.total).toBe(3);
    expect(r.reachable).toBe(0);
  });

  it("excludes blocked members from both halves", () => {
    // Matches the geohash participant list, which stopped counting blocked
    // people this same session. Counting someone the roster no longer shows
    // would make the two disagree.
    expect(
      groupReach(
        roster(ME, ALICE, BOB, CARA),
        ME,
        set(ALICE, BOB, CARA),
        set(BOB),
      ),
    ).toEqual({ reachable: 2, total: 2 });
  });

  it("reports nobody reachable rather than failing when the mesh is empty", () => {
    expect(groupReach(roster(ME, ALICE, BOB), ME, set(), set())).toEqual({
      reachable: 0,
      total: 2,
    });
  });

  it("reports a zero total when you are the only member left", () => {
    // The caller renders "No other members" for this rather than "0 of 0".
    expect(groupReach(roster(ME), ME, set(), set())).toEqual({
      reachable: 0,
      total: 0,
    });
    // Same when everyone else is blocked.
    expect(groupReach(roster(ME, ALICE), ME, set(ALICE), set(ALICE))).toEqual({
      reachable: 0,
      total: 0,
    });
  });

  it("never reports more reachable than total", () => {
    // A peer in range who is not on the roster must not inflate the count: the
    // radio sees everyone nearby, and only members belong in this number.
    const stranger = "9999999999999999";
    const r = groupReach(
      roster(ME, ALICE),
      ME,
      set(ALICE, stranger, ME),
      set(),
    );
    expect(r.reachable).toBeLessThanOrEqual(r.total);
    expect(r).toEqual({ reachable: 1, total: 1 });
  });

  it("matches members on the peer-ID prefix, not the whole fingerprint", () => {
    // The roster holds a 64-hex fingerprint and the radio a 16-hex peer ID.
    // Comparing them whole would match nothing and report everyone offline.
    expect(groupReach([fp(ALICE)], ME, set(ALICE), set())).toEqual({
      reachable: 1,
      total: 1,
    });
  });
});
