// Airhop deep links.
//
// Two shapes, both opened by tapping a shared link (the URL scheme is
// registered in app.json / Info.plist / AndroidManifest):
//   airhop://channel/<name>   join a public channel by name
//   airhop://peer/<peerID>    start a DM with a peer (16 hex chars)
//
// Parsing is pure and defensive: anything malformed returns null, so a stray
// link can never join a garbage channel or open a bogus DM.

export type DeepLink =
  // A private channel carries its E2E key and reach (overNostr); a public one
  // has key undefined.
  | { kind: "channel"; channel: string; key?: string; overNostr: boolean }
  | { kind: "peer"; peerID: string }
  // The rich contact card (airhop:v1/<base64>), decoded by the caller so this
  // module stays free of crypto imports.
  | { kind: "card"; card: string };

// Channel names are kept short and simple, matching what the create-channel
// modal accepts, so a link can't stuff a huge or weird string into the list.
const MAX_CHANNEL_NAME = 30;

export function parseAirhopLink(url: string): DeepLink | null {
  const trimmed = url.trim();

  // Contact card from a scanned QR: airhop:v1/<base64url>. Decoding (and key
  // verification) happens in the caller, which owns the crypto.
  if (/^airhop:(?:\/\/)?v1\/.+$/i.test(trimmed)) {
    return { kind: "card", card: trimmed };
  }

  // Tolerate both airhop://channel/x and airhop:channel/x, with an optional
  // ?k=<key> query for private channels.
  const match =
    /^airhop:(?:\/\/)?(channel|peer)\/([^/?#]+)(?:\?([^#]*))?/i.exec(trimmed);
  if (match === null) return null;

  const kind = match[1].toLowerCase();
  let value: string;
  try {
    value = decodeURIComponent(match[2]);
  } catch {
    return null;
  }

  if (kind === "channel") {
    const name = value.replace(/^#+/, "").trim();
    if (name.length < 1 || name.length > MAX_CHANNEL_NAME) return null;
    // No whitespace or control chars in a channel name.
    if (/\s/.test(name)) return null;
    const params = new URLSearchParams(match[3] ?? "");
    const key = params.get("k");
    return {
      kind: "channel",
      channel: `#${name}`,
      key: key ?? undefined,
      // "n=1" marks a channel that is also bridged over Nostr.
      overNostr: params.get("n") === "1",
    };
  }

  // peer: exactly a 16-hex-char peer ID.
  const peerID = value.trim().toLowerCase();
  if (!/^[0-9a-f]{16}$/.test(peerID)) return null;
  return { kind: "peer", peerID };
}

// Build the shareable links (single source of truth for the format). A private
// channel appends its key so tapping the link both joins and can decrypt, plus
// n=1 when the channel is bridged over Nostr so the joiner subscribes the same.
export function channelInviteLink(
  channel: string,
  key?: string,
  overNostr?: boolean,
): string {
  const base = `airhop://channel/${encodeURIComponent(channel.replace(/^#+/, ""))}`;
  if (key === undefined) return base;
  return `${base}?k=${key}${overNostr ? "&n=1" : ""}`;
}

export function peerInviteLink(peerID: string): string {
  return `airhop://peer/${peerID}`;
}
