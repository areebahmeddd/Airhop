// Peer list screen.
// Shows nearby peers discovered via signed ANNOUNCE broadcasts.
// Peer data is populated from the BLE service (wired up in v0.7+).

import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { usePeerStore, type NearbyPeer } from "../../store/peer-store";

export default function PeerList(): React.JSX.Element {
  const { peers, evictStale } = usePeerStore();
  const [now, setNow] = React.useState(() => Date.now());

  // Refresh the "last seen" timestamps every 10 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      evictStale();
    }, 10_000);
    return () => clearInterval(timer);
  }, [evictStale]);

  const peerList = [...peers.values()].sort(
    (a, b) => b.lastSeenMs - a.lastSeenMs,
  );

  function formatLastSeen(ms: number): string {
    const diffSec = Math.floor((now - ms) / 1000);
    if (diffSec < 5) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    return `${Math.floor(diffSec / 3600)}h ago`;
  }

  function isReachable(peer: NearbyPeer): boolean {
    return now - peer.lastSeenMs < 60_000;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={peerList}
        keyExtractor={(item) => item.peerID}
        renderItem={({ item }) => {
          const reachable = isReachable(item);
          return (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.dot,
                    reachable ? styles.dotOnline : styles.dotOffline,
                  ]}
                />
                <View>
                  <Text style={styles.nickname}>{item.nickname}</Text>
                  <Text style={styles.peerID}>
                    {item.peerID.slice(0, 8)}…{item.peerID.slice(-4)}
                  </Text>
                </View>
              </View>
              <Text style={styles.lastSeen}>
                {formatLastSeen(item.lastSeenMs)}
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No peers nearby</Text>
            <Text style={styles.emptySubtitle}>
              Other Airhop or bitchat devices within{"\n"}BLE range will appear
              here.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {peerList.length} peer{peerList.length !== 1 ? "s" : ""} seen
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  list: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: "#4caf50",
  },
  dotOffline: {
    backgroundColor: "#333",
  },
  nickname: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "monospace",
  },
  peerID: {
    color: "#555",
    fontSize: 11,
    fontFamily: "monospace",
    marginTop: 1,
  },
  lastSeen: {
    color: "#555",
    fontSize: 12,
    fontFamily: "monospace",
  },
  separator: {
    height: 1,
    backgroundColor: "#111",
    marginLeft: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#444",
    fontSize: 13,
    fontFamily: "monospace",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#111",
    padding: 12,
    alignItems: "center",
  },
  footerText: {
    color: "#444",
    fontSize: 12,
    fontFamily: "monospace",
  },
});
