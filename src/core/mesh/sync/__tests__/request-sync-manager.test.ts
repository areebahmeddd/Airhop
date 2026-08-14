/**
 * @jest-environment node
 */
// Which sync responses are answers to something we asked.
//
// Accepting an unsolicited response would let any peer push state into this
// phone by pretending to answer a request that was never made, so the window
// and the pairing with an outstanding request are the whole defence.
import {
  RequestSyncManager,
  RESPONSE_WINDOW_MS,
} from "../request-sync-manager";

const T0 = 1_700_000_000_000;

describe("RequestSyncManager", () => {
  test("a response from a peer we asked, inside the window, is solicited", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    expect(m.isValidResponse("alice", true, T0 + 1_000)).toBe(true);
  });

  // The flag alone is a claim, and anyone within radio range can set it. If
  // this ever returns true, the freshness window has a hole the width of the
  // protocol: an attacker tags recorded traffic as a sync response and every
  // replay bypasses the age check.
  test("an unsolicited RSR packet is refused", () => {
    const m = new RequestSyncManager();
    expect(m.isValidResponse("mallory", true, T0)).toBe(false);
  });

  test("a peer we asked gets nothing without the flag", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    expect(m.isValidResponse("alice", false, T0 + 1_000)).toBe(false);
  });

  test("the exemption is per peer, not global", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    expect(m.isValidResponse("mallory", true, T0 + 1_000)).toBe(false);
  });

  test("the window closes after 30s", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    expect(m.isValidResponse("alice", true, T0 + RESPONSE_WINDOW_MS)).toBe(
      true,
    );
    expect(m.isValidResponse("alice", true, T0 + RESPONSE_WINDOW_MS + 1)).toBe(
      false,
    );
  });

  // One request legitimately draws many packets back: a peer catching up after
  // a partition receives its whole missing set in answer to a single ask.
  test("one request stays valid for many response packets", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    for (let i = 0; i < 50; i++) {
      expect(m.isValidResponse("alice", true, T0 + 100)).toBe(true);
    }
  });

  test("asking again extends the window", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    m.registerRequest("alice", T0 + 20_000);
    expect(m.isValidResponse("alice", true, T0 + 45_000)).toBe(true);
  });

  // A link going down ends the session. A device reconnecting under the same
  // peer ID must not inherit the previous session's exemption.
  test("forget revokes the exemption immediately", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    m.forget("alice");
    expect(m.isValidResponse("alice", true, T0 + 1_000)).toBe(false);
  });

  test("prune drops only closed windows", () => {
    const m = new RequestSyncManager();
    m.registerRequest("stale", T0);
    m.registerRequest("fresh", T0 + 25_000);
    m.prune(T0 + 40_000);
    expect(m.pendingCount).toBe(1);
    expect(m.isValidResponse("fresh", true, T0 + 40_000)).toBe(true);
  });

  test("reset clears everything", () => {
    const m = new RequestSyncManager();
    m.registerRequest("alice", T0);
    m.reset();
    expect(m.pendingCount).toBe(0);
    expect(m.isValidResponse("alice", true, T0)).toBe(false);
  });
});
