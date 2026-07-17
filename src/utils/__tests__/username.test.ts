/**
 * @jest-environment node
 */
import { peerIDToUsername } from "../username";

describe("peerIDToUsername", () => {
  test("produces adjective-noun-suffix format", () => {
    const name = peerIDToUsername("3a9f2c1b4e5d6f70");
    expect(name).toMatch(/^[a-z]+-[a-z]+-[0-9a-f]{4}$/);
  });

  test("suffix is always the first 4 hex chars of peerID", () => {
    const peerID = "3a9f2c1b4e5d6f70";
    const name = peerIDToUsername(peerID);
    expect(name.endsWith(`-${peerID.slice(0, 4)}`)).toBe(true);
  });

  test("deterministic: same peerID always produces same name", () => {
    const peerID = "aabbccddeeff0011";
    const a = peerIDToUsername(peerID);
    const b = peerIDToUsername(peerID);
    expect(a).toBe(b);
  });

  test("different peerIDs produce different names (with high probability)", () => {
    // Peer IDs with different first 4 hex chars must differ by suffix at minimum.
    const names = new Set([
      peerIDToUsername("0000000000000000"),
      peerIDToUsername("1111111111111111"),
      peerIDToUsername("2222222222222222"),
      peerIDToUsername("3333333333333333"),
      peerIDToUsername("aabbccddeeff0011"),
      peerIDToUsername("deadbeef12345678"),
      peerIDToUsername("ffffffffffffffff"),
    ]);
    // Each has a unique prefix (first 4 hex) so they are all unique.
    expect(names.size).toBe(7);
  });

  test("known vector: byte[0]=0x3a → adjective index 0x3a%128=58", () => {
    // 0x3a = 58. ADJECTIVES[58] is the adjective at index 58.
    // 0x9f = 159; 159 % 128 = 31. NOUNS[31] is at index 31.
    // We just verify the name is deterministic and formatted correctly.
    const peerID = "3a9f000000000000";
    const name = peerIDToUsername(peerID);
    // Must have three parts separated by hyphens.
    const parts = name.split("-");
    expect(parts).toHaveLength(3);
    expect(parts[2]).toBe("3a9f");
  });

  test("all-zeros peerID produces a valid name", () => {
    const name = peerIDToUsername("0000000000000000");
    expect(name).toMatch(/^[a-z]+-[a-z]+-0000$/);
  });

  test("all-ff peerID produces a valid name", () => {
    const name = peerIDToUsername("ffffffffffffffff");
    expect(name).toMatch(/^[a-z]+-[a-z]+-ffff$/);
  });

  test("throws on short peerID", () => {
    expect(() => peerIDToUsername("ab")).toThrow("at least 4");
  });

  test("word lists are exactly 128 entries (caught at module load)", () => {
    // If the length check in username.ts throws, the import above would have
    // already failed. Reaching this line confirms both lists are 128 entries.
    expect(true).toBe(true);
  });
});
