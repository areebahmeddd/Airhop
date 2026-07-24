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
