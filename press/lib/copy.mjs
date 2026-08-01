// Panel copy, ordered the way the stores read it: Apple surfaces the first
// three in search results, Play shows two above the fold.
//
// House style: plain words, short lines, no em dashes, no exclamation marks, no
// claim the screen beside it cannot back up.

export const PANELS = [
  {
    id: "01-offline-mesh",
    screen: "radar",
    headline: ["Works when the", "network doesn’t"],
    sub: "Nearby phones form a Bluetooth mesh and pass your messages along. No towers, no router, no bill.",
  },
  {
    id: "02-encrypted",
    screen: "thread",
    headline: ["Nobody in the", "middle can read it"],
    sub: "Noise XX and Double Ratchet, on by default. The phones relaying your message carry it blind.",
  },
  {
    id: "03-no-accounts",
    screen: "profile",
    headline: ["No sign up.", "No phone number."],
    sub: "Your identity is a key made on this phone and kept on it. Nothing registers anywhere.",
  },
  {
    id: "04-channels",
    screen: "chats",
    headline: ["A room for", "wherever you are"],
    sub: "Public channels scoped to your block, your city or your region. Bridged over the internet when there is one.",
  },
  {
    id: "05-payments",
    screen: "wallet",
    headline: ["Send money", "with no signal"],
    sub: "Hand ecash to the person beside you over Bluetooth. Top up and cash out over Lightning later.",
  },
  // No device on this one. Range is the obvious question after five screens of
  // Bluetooth, and the answer is a map.
  {
    id: "06-global",
    kind: "globe",
    headline: ["Bluetooth ends.", "The mesh doesn’t."],
    sub: "Where there is a network, messages and location channels carry over public Nostr relays. Not one of them is ours.",
  },
];

// The peer list screen is still built in lib/screens.mjs. Add an entry above
// with screen: "peers" to bring that panel back.

// Feature graphic, device variant only.
export const FEATURE = {
  wordmark: "AIRHOP",
  headline: `Private<span class="dim">.</span><br>Offline<span class="dim">.</span> Free<span class="dim">.</span>`,
  sub: "Peer-to-peer messaging over Bluetooth mesh",
  screen: "radar",
};
