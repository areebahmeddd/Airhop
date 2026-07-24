/**
 * @jest-environment node
 */
import {
  channelInviteLink,
  parseAirhopLink,
  peerInviteLink,
} from "../deep-link";

describe("parseAirhopLink: channels", () => {
  it("parses a channel link and prefixes #", () => {
    expect(parseAirhopLink("airhop://channel/test23")).toEqual({
      kind: "channel",
      channel: "#test23",
      overNostr: false,
    });
  });

  it("tolerates a leading # and url-encoding", () => {
    expect(parseAirhopLink("airhop://channel/%23city")).toEqual({
      kind: "channel",
      channel: "#city",
      overNostr: false,
    });
  });

  it("rejects empty, whitespace, or overlong names", () => {
    expect(parseAirhopLink("airhop://channel/")).toBeNull();
    expect(parseAirhopLink("airhop://channel/a%20b")).toBeNull();
    expect(parseAirhopLink(`airhop://channel/${"x".repeat(40)}`)).toBeNull();
  });
});

describe("parseAirhopLink: peers", () => {
  it("parses a valid 16-hex peer id", () => {
    expect(parseAirhopLink("airhop://peer/aabbccdd00112233")).toEqual({
      kind: "peer",
      peerID: "aabbccdd00112233",
    });
  });

  it("rejects a malformed peer id", () => {
    expect(parseAirhopLink("airhop://peer/nothex")).toBeNull();
    expect(parseAirhopLink("airhop://peer/aabb")).toBeNull();
  });
});

describe("parseAirhopLink: private channel key + reach", () => {
  it("extracts the key from ?k=", () => {
    expect(parseAirhopLink("airhop://channel/secret?k=AbC-_123")).toEqual({
      kind: "channel",
      channel: "#secret",
      key: "AbC-_123",
      overNostr: false,
    });
  });

  it("reads n=1 as ble+nostr reach", () => {
    expect(parseAirhopLink("airhop://channel/secret?k=abc&n=1")).toEqual({
      kind: "channel",
      channel: "#secret",
      key: "abc",
      overNostr: true,
    });
  });

  it("a public channel link has no key", () => {
    const link = parseAirhopLink("airhop://channel/city");
    expect((link as { key?: string }).key).toBeUndefined();
  });

  it("channelInviteLink round-trips a key and reach", () => {
    expect(
      parseAirhopLink(channelInviteLink("#secret", "AbC-_123", true)),
    ).toEqual({
      kind: "channel",
      channel: "#secret",
      key: "AbC-_123",
      overNostr: true,
    });
  });
});

describe("parseAirhopLink: contact card", () => {
  it("recognises a v1 card and hands it back for decoding", () => {
    expect(parseAirhopLink("airhop:v1/SGVsbG8")).toEqual({
      kind: "card",
      card: "airhop:v1/SGVsbG8",
    });
  });
});

describe("parseAirhopLink: junk", () => {
  it("returns null for non-Airhop or unknown links", () => {
    expect(parseAirhopLink("https://example.com")).toBeNull();
    expect(parseAirhopLink("airhop://wat/x")).toBeNull();
    expect(parseAirhopLink("")).toBeNull();
  });
});

describe("link builders round-trip", () => {
  it("channel link parses back to the same channel", () => {
    const link = channelInviteLink("#test23");
    expect(parseAirhopLink(link)).toEqual({
      kind: "channel",
      channel: "#test23",
      overNostr: false,
    });
  });

  it("peer link parses back to the same id", () => {
    const link = peerInviteLink("aabbccdd00112233");
    expect(parseAirhopLink(link)).toEqual({
      kind: "peer",
      peerID: "aabbccdd00112233",
    });
  });
});
