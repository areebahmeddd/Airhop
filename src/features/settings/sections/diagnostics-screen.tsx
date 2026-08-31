// Diagnostics sub-screen: what the radios are actually doing, right now.
//
// Read-only, deliberately and completely. bitchat's equivalent lets you change
// protocol parameters - GCS filter size, GATT link caps, relay on/off - and that
// is the wrong shape for us: our constants are chosen to match bitchat
// byte-for-byte, so a slider that changes one is a slider that stops us
// interoperating with the client this whole app exists to talk to. The link cap
// is a safety limit (Android refuses past ~7 GATT clients), and turning relay
// off makes you a freeloader on everyone else's mesh.
//
// So this screen answers questions and offers no decisions. The question it
// exists for is the one a field report cannot answer without it: when two phones
// cannot see each other, is the radio connected, is anyone being discovered, and
// how strong is the signal.
//
// Every number is live. Peers come from the same store the Mesh tab renders, so
// what is shown here and what is shown there can never disagree.

import {
  TRANSPORT_KINDS,
  type TransportKind,
} from "@core/mesh/links/link-registry";
import { GCS_MAX_BYTES, GCS_TARGET_FPR } from "@core/mesh/sync/gossip-sync";
import { t, useT } from "@i18n";
import { getMeshService } from "@services/mesh-service";
import { useMeshStateStore } from "@store/mesh-state-store";
import { REACHABLE_TTL_MS, usePeerStore } from "@store/peer-store";
import { FontFamily, FontSize, Spacing, useThemeColors } from "@ui/theme";
import { formatNumber } from "@utils/format";
import { resolveDisplayName } from "@utils/peer-display-name";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  GroupDivider,
  SettingRow,
  SubHeader,
  useSharedStyles,
} from "../settings-primitives";

interface Props {
  onBack: () => void;
}

// How often the counters re-read. Slow enough to be free, fast enough that
// someone watching the screen while walking between rooms sees it move.
const REFRESH_MS = 2000;

// The WiFi fast path, in words. `unknown` is deliberately not "off": it means
// the module has not answered yet, which is a different thing from unsupported
// and is worth telling apart when a device never reports.
function wifiLabel(state: string): string {
  switch (state) {
    case "active":
      return t("settings.diag.wifi_active");
    case "unsupported":
      return t("settings.diag.wifi_unsupported");
    case "permission":
      return t("settings.diag.wifi_permission");
    case "unavailable":
      return t("settings.diag.wifi_unavailable");
    case "unpaired":
      return t("settings.diag.wifi_unpaired");
    default:
      return t("settings.diag.wifi_unknown");
  }
}

const EMPTY_LINK_COUNTS = Object.fromEntries(
  TRANSPORT_KINDS.map((kind) => [kind, 0]),
) as Record<TransportKind, number>;

export default function DiagnosticsScreen({
  onBack,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const local = useMemo(() => createStyles(Colors), [Colors]);

  const peers = usePeerStore((s) => s.peers);
  const wifiFastPath = useMeshStateStore((s) => s.wifiFastPath);
  const lanState = useMeshStateStore((s) => s.lanState);
  const nostrConnected = useMeshStateStore((s) => s.nostrConnected);

  // Counters live on the service rather than in a store, so they are polled.
  // A snapshot in state rather than a read during render: reading a mutable
  // service field while rendering makes the screen disagree with itself between
  // two rows of the same pass.
  // The clock rides along with the counters rather than being read during
  // render: one tick drives both, so the peer list ages on the same beat the
  // numbers move on, and there is only one timer to clean up.
  const [snapshot, setSnapshot] = useState(readSnapshot);
  useEffect(() => {
    const timer = setInterval(() => setSnapshot(readSnapshot()), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);
  const counters = snapshot;

  const nearby = [...peers.values()]
    .filter((p) => snapshot.now - p.lastSeenMs < REACHABLE_TTL_MS)
    // Direct first, then strongest signal: the ones a link problem is about.
    .sort((a, b) => {
      if (a.isDirect !== b.isDirect) return a.isDirect ? -1 : 1;
      return (b.rssi ?? -999) - (a.rssi ?? -999);
    });

  const links = Object.values(counters.links).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.diagnostics")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Transports. Links and peers are separate rows because they answer
            different questions: a link is a socket we hold, a peer may be
            several hops away with no link of ours near it. */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {T("settings.group.transports")}
          </Text>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="bluetooth"
              label={T("settings.diag.ble_links")}
              description={T("settings.diag.ble_links_desc")}
              control={
                <Text style={[styles.settingValue, styles.settingValueMono]}>
                  {formatNumber(counters.links.ble)}
                </Text>
              }
            />
            <GroupDivider />
            <SettingRow
              icon="wifi"
              label={T("settings.diag.wifi")}
              description={`${t("settings.diag.wifi_about")} · ${wifiLabel(
                wifiFastPath,
              )}`}
              control={
                <Text style={[styles.settingValue, styles.settingValueMono]}>
                  {formatNumber(counters.links.wifi)}
                </Text>
              }
            />
            <GroupDivider />
            {/* Below Wi-Fi Aware, since that is the faster of the two local
                paths and the one a reader checks first. "Off" is appended the
                way the Wi-Fi row appends its state, so a count of zero is not
                read as "nobody here" on a transport nobody switched on. */}
            <SettingRow
              icon="share-2"
              label={T("settings.diag.lan")}
              description={
                lanState === "off"
                  ? `${t("settings.diag.lan_desc")} · ${t("common.off")}`
                  : T("settings.diag.lan_desc")
              }
              control={
                <Text style={[styles.settingValue, styles.settingValueMono]}>
                  {formatNumber(counters.links.lan)}
                </Text>
              }
            />
            <GroupDivider />
            <SettingRow
              icon="globe"
              label={T("settings.diag.relays")}
              description={T("settings.diag.relays_desc")}
              control={
                <Text style={styles.settingValue}>
                  {nostrConnected
                    ? T("settings.diag.connected")
                    : T("settings.diag.disconnected")}
                </Text>
              }
            />
          </View>
        </View>

        {/* Who the radio can currently hear. The one section a bug report
            usually turns on: name, how we know them, and how loud they are. */}
        <View style={styles.section}>
          {/* The count rides beside the heading rather than inside it, so the
              heading stays a plain word like every other one and the number is
              still readable without counting rows. Shown at zero too: on a
              diagnostics screen "0" is an answer, and a count that appears only
              sometimes is one the reader cannot trust. */}
          <View style={local.headingRow}>
            <Text style={styles.sectionTitle}>
              {T("settings.group.nearby")}
            </Text>
            <Text style={styles.sectionTitle}>
              {formatNumber(nearby.length)}
            </Text>
          </View>
          <View style={styles.settingsGroup}>
            {nearby.length === 0 ? (
              <SettingRow
                icon="search"
                label={T("settings.diag.no_peers")}
                description={T("settings.diag.no_peers_desc", {
                  links: formatNumber(links),
                })}
              />
            ) : (
              nearby.map((peer, i) => (
                <React.Fragment key={peer.peerID}>
                  {i > 0 && <GroupDivider />}
                  <SettingRow
                    // Relay first: what a peer IS outranks how we reached it,
                    // and a relay we hold a link to is still not a person.
                    icon={
                      peer.isInfrastructure === true
                        ? "radio"
                        : peer.isDirect
                          ? "link"
                          : "share-2"
                    }
                    label={resolveDisplayName(peer.peerID)}
                    description={
                      peer.isInfrastructure === true
                        ? `${t("mesh.peer.relay")} · ${
                            peer.isDirect
                              ? t("settings.diag.peer_direct")
                              : t("settings.diag.peer_relayed")
                          }`
                        : peer.isDirect
                          ? T("settings.diag.peer_direct")
                          : T("settings.diag.peer_relayed")
                    }
                    control={
                      <View style={local.peerMeta}>
                        <Text style={local.peerID}>{peer.peerID}</Text>
                        <Text style={styles.settingValue}>
                          {peer.rssi === undefined
                            ? T("settings.diag.no_rssi")
                            : T("settings.diag.rssi", {
                                dbm: formatNumber(peer.rssi),
                              })}
                        </Text>
                      </View>
                    }
                  />
                </React.Fragment>
              ))
            )}
          </View>
        </View>

        {/* Sync parameters, shown because they are the first thing anyone asks
            about when two phones will not converge - and fixed, because they
            have to match bitchat's exactly or reconciliation degrades. */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{T("settings.group.sync")}</Text>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="filter"
              label={T("settings.diag.gcs_size")}
              description={T("settings.diag.gcs_size_desc")}
              control={
                <Text style={styles.settingValue}>
                  {T("settings.diag.bytes", {
                    n: formatNumber(GCS_MAX_BYTES),
                  })}
                </Text>
              }
            />
            <GroupDivider />
            <SettingRow
              icon="percent"
              label={T("settings.diag.fpr")}
              description={T("settings.diag.fpr_desc")}
              control={
                <Text style={[styles.settingValue, styles.settingValueMono]}>
                  {`${formatNumber(GCS_TARGET_FPR * 100)}%`}
                </Text>
              }
            />
          </View>
        </View>

        <Text style={local.footnote}>{T("settings.diag.footnote")}</Text>
      </ScrollView>
    </View>
  );
}

function readSnapshot(): {
  now: number;
  links: Record<TransportKind, number>;
} {
  const service = getMeshService();
  return {
    now: Date.now(),
    links: service?.getLinkCounts() ?? EMPTY_LINK_COUNTS,
  };
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return {
    headingRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    peerMeta: {
      alignItems: "flex-end" as const,
      gap: Spacing.xs / 2,
    },
    peerID: {
      fontSize: FontSize.xs,
      fontFamily: FontFamily.mono,
      color: Colors.textMuted,
    },
    // Closes the screen rather than heading a group, so it sits muted and
    // centred instead of taking a section label's weight.
    footnote: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      textAlign: "center" as const,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.sm,
    },
  };
}
