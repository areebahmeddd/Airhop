// The human-readable name for a conversation key, as shown in search results.
//
// One source of truth so the Chats and Messages sections never diverge (they
// used to, which is why teleported cells and groups showed their raw store
// keys). The `#` is stripped because search rows already carry a hash icon.
//   - `dm:<peerID>`          -> the peer's username
//   - `geohash:<gh>`         -> the bare geohash (icon supplies the #)
//   - `group:<id>`           -> the group's name from group-store
//   - `#name` / everything   -> the name without its leading #

import {
  isManualGeoChannel,
  manualGeohashOf,
} from "../services/geohash-channel-service";
import { useGroupStore } from "../store/group-store";
import { peerIDToUsername } from "./username";

export function chatDisplayName(channel: string): string {
  if (channel.startsWith("dm:")) return peerIDToUsername(channel.slice(3));
  if (isManualGeoChannel(channel)) return manualGeohashOf(channel) ?? channel;
  if (channel.startsWith("group:")) {
    return useGroupStore.getState().nameForChannel(channel) ?? "Group";
  }
  return channel.replace(/^#/, "");
}

// A room label for notifications and the bell (the "in <room>" tag and the
// system-notification title for a channel). Unlike chatDisplayName it KEEPS the
// "#" so a channel still reads as a channel where there is no hash icon: a group
// renders by name, a teleported cell as "#<geohash>", and a public channel keeps
// its own "#name". Not for DMs (those use the sender/contact name).
export function channelLabel(channel: string): string {
  if (channel.startsWith("group:")) {
    return useGroupStore.getState().nameForChannel(channel) ?? "Group";
  }
  if (isManualGeoChannel(channel)) {
    return `#${manualGeohashOf(channel) ?? channel}`;
  }
  return channel;
}
