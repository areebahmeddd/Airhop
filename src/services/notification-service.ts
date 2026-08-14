// Message notifications: local system notifications for inbound messages.
//
// "Local" is the whole point. There is no push server and no FCM: notifications
// are raised by the running app process the moment a message lands over any
// transport (BLE, WiFi, courier, Nostr), which keeps the no-central-servers
// ethos intact. On Android the foreground service keeps that process alive in
// the background so this still fires when the app is not on screen; on iOS it
// fires whenever the OS has the app awake (a BLE wake, or in the foreground).
//
// The pure decisions (whether to notify, and the text) live in
// notification-policy.ts. This module owns the platform side effects and the
// small amount of module-level state the policy needs: whether the app is
// foregrounded, and which conversation is currently open.

import { t } from "@i18n";
import type { ChatMessage } from "@store/chat-store";
import { useSettingsStore } from "@store/settings-store";
import { channelLabel } from "@utils/conversation-display-name";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  NEARBY_COOLDOWN_MS,
  nearbyNotificationContent,
  notificationContentFor,
  shouldHapticPing,
  shouldNotifyNearby,
  shouldSystemNotify,
} from "./notification-policy";

// Android notification channel for messages. Separate from the silent
// "mesh running" foreground-service channel, and high importance so messages
// surface as a heads-up the way a chat app should.
const MESSAGES_CHANNEL_ID = "messages";

// Nearby peers get their own Android channel, at low importance: it lands in
// the shade without a sound or a heads-up card, and the user can silence this
// one category from system settings without losing message notifications. That
// per-category control is the whole reason to split the channel rather than
// reuse the messages one at a lower priority.
const NEARBY_CHANNEL_ID = "nearby";
// One id, so a later notice replaces the last rather than stacking.
const NEARBY_NOTIFICATION_ID = "nearby_peers";

// Live view state the policy consults. Kept module-local (not in a store)
// because only this service reads it and it must be readable synchronously from
// the inbound handler.
let appActive = true;
let activeChannel = "";
let navigate: ((channel: string) => void) | null = null;
let openMesh: (() => void) | null = null;
let configured = false;
let responseSub: Notifications.EventSubscription | null = null;
// When the last nearby notice went out, for the cooldown. Module state, not
// persisted: a relaunch is already a rare event, and starting a fresh app run
// with a clean cooldown is the behaviour a user would expect anyway.
let lastNearbyNotifiedAtMs: number | null = null;

// Stable per-conversation notification id, so repeated messages from the same
// chat collapse into (and update) one notification rather than stacking, and so
// opening the chat can dismiss exactly that one. Notification ids must be
// simple strings, hence the sanitising.
function channelToId(channel: string): string {
  return `msg_${channel.replace(/[^a-zA-Z0-9]/g, "_")}`;
}

export function setNotificationsAppActive(active: boolean): void {
  appActive = active;
}

export function setNotificationsActiveChannel(channel: string): void {
  activeChannel = channel;
}

export function setNotificationNavigator(fn: (channel: string) => void): void {
  navigate = fn;
}

// Where a nearby-peers notice goes when tapped. Separate from the conversation
// navigator above because it lands on a tab, not in a chat.
export function setMeshNavigator(fn: () => void): void {
  openMesh = fn;
}

// Ask for notification permission. Kept separate from configureNotifications so
// the prompt can be sequenced with the Bluetooth and location prompts in one
// place (App.startMeshWithPermissions) rather than racing them, which on a fresh
// install swallowed this prompt and could crash. Denial degrades gracefully: no
// system notifications, but in-app badges and the foreground haptic still work.
// Never throws: a permission-layer failure must not take down mesh startup.
export async function requestNotificationPermission(): Promise<void> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (!current.granted && current.canAskAgain) {
      await Notifications.requestPermissionsAsync();
    }
  } catch {
    // Notifications simply stay off; the app is fully usable without them.
  }
}

// One-time setup: notification handler, Android channel, and tap routing (both
// while running and from a cold start via a tapped notification). Does NOT ask
// for permission, see requestNotificationPermission. Safe to call more than once.
export async function configureNotifications(): Promise<void> {
  if (configured) return;
  configured = true;

  Notifications.setNotificationHandler({
    handleNotification: () =>
      Promise.resolve({
        // We only present while backgrounded; if one is delivered while the app
        // is foregrounded, keep it quiet since the in-app badges already cover
        // it. Badge/list still update so nothing is lost.
        shouldShowBanner: !appActive,
        shouldShowList: true,
        shouldPlaySound: !appActive,
        shouldSetBadge: true,
      }),
  });

  // Channel creation is best-effort, and its failure must not take the tap
  // routing below with it.
  //
  // These three awaits must stay wrapped. Unwrapped inside a function called as
  // `void configureNotifications()`, a rejection from any of them does two things
  // at once: it escapes as an unhandled rejection, which the global handler turns
  // into the full-screen error fallback, and it skips the response listener, so
  // notification taps stop routing for the whole
  // session. The `configured` latch is set before the first await, so nothing
  // ever retried. A channel that could not be created costs a default-styled
  // notification; it should never cost the app its UI.
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync(MESSAGES_CHANNEL_ID, {
        name: t("notif.channel.messages"),
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PRIVATE,
      });
      await Notifications.setNotificationChannelAsync(NEARBY_CHANNEL_ID, {
        name: t("notif.channel.nearby"),
        description: t("notif.channel.nearby_desc"),
        // LOW: no sound, no heads-up card. It waits in the shade to be found.
        importance: Notifications.AndroidImportance.LOW,
        vibrationPattern: null,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PRIVATE,
      });
    } catch {
      // Android will deliver on the default channel instead.
    }
  }

  responseSub?.remove();
  responseSub = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      routeFromResponse(response);
    },
  );

  // Launched by tapping a notification while the app was killed.
  //
  // The synchronous reader, not the deprecated `getLastNotificationResponseAsync`
  // it replaces. Being synchronous is the better shape here as well as the
  // supported one: the response is already in memory by the time the module
  // loads, so awaiting it only opened a window in which the tapped conversation
  // could be overtaken by whatever tab the app was going to open anyway.
  //
  // Guarded for the same reason as the channels above: routing the tap is a
  // nicety, and losing the listener to it would be a bad trade.
  try {
    const last = Notifications.getLastNotificationResponse();
    if (last) routeFromResponse(last);
  } catch {
    // The app opens on its usual tab instead of the tapped conversation.
  }
}

function routeFromResponse(response: Notifications.NotificationResponse): void {
  const data = response.notification.request.content.data;
  const channel = data?.channel;
  if (typeof channel === "string") {
    navigate?.(channel);
    void dismissNotificationsFor(channel);
    return;
  }
  if (data?.screen === "mesh") {
    openMesh?.();
    void dismissNearbyNotification();
  }
}

// Called for every genuinely-new inbound message (see chat-store's inbound
// observer). Decides between a system notification (backgrounded), a soft
// haptic (foreground, different chat), or nothing (your own message, or the
// chat you are looking at).
export async function handleInboundMessage(
  msg: ChatMessage,
  totalUnread: number,
  // Whether this message names the local user. Decided by the caller, which is
  // the only place that knows our own nickname; this file stays a pure renderer
  // of whatever it is handed.
  mentionsMe = false,
): Promise<void> {
  if (
    shouldHapticPing({
      isMine: msg.isMine,
      isSystem: msg.isSystem,
      appActive,
      channel: msg.channel,
      activeChannel,
    })
  ) {
    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    ).catch(() => undefined);
  }

  if (
    !shouldSystemNotify({
      isMine: msg.isMine,
      isSystem: msg.isSystem,
      appActive,
    })
  ) {
    return;
  }

  const { title, body } = notificationContentFor(
    msg,
    channelLabel(msg.channel),
    useSettingsStore.getState().hideNotificationPreviews,
    mentionsMe,
  );
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: channelToId(msg.channel),
      content: {
        title,
        body,
        data: { channel: msg.channel },
        sound: "default",
        badge: totalUnread,
      },
      // A channel-only trigger delivers immediately on the given Android
      // channel; iOS ignores channelId and delivers immediately too.
      trigger:
        Platform.OS === "android" ? { channelId: MESSAGES_CHANNEL_ID } : null,
    });
  } catch {
    // Permission denied or the platform refused it: fall back to the in-app
    // badges, which are always accurate regardless.
  }
}

// Called whenever the set of nearby peers changes (see App's peer-store
// observer), with the reachable count before and after. Almost every call is a
// no-op: shouldNotifyNearby only lets through an empty mesh coming alive while
// the app is in the background, and then only once per cooldown.
//
// This is the one background event that is not a message and still worth
// surfacing. On Android the foreground service keeps the mesh scanning with the
// app off screen, so peers really are found while nobody is looking; without
// this, the only way to learn the mesh had come alive around you was to open
// the app and check.
export async function handleNearbyPeers(
  peerCount: number,
  previousPeerCount: number,
): Promise<void> {
  const nowMs = Date.now();
  if (
    !shouldNotifyNearby({
      appActive,
      peerCount,
      previousPeerCount,
      nowMs,
      lastNotifiedAtMs: lastNearbyNotifiedAtMs,
      cooldownMs: NEARBY_COOLDOWN_MS,
    })
  ) {
    return;
  }
  // Stamped before the await, so two peers arriving in the same instant cannot
  // both pass the cooldown and post twice.
  lastNearbyNotifiedAtMs = nowMs;

  const { title, body } = nearbyNotificationContent(peerCount);
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NEARBY_NOTIFICATION_ID,
      content: {
        title,
        body,
        data: { screen: "mesh" },
        // No sound and no badge on purpose: the badge counts unread messages,
        // and nobody is waiting on a reply here.
      },
      trigger:
        Platform.OS === "android" ? { channelId: NEARBY_CHANNEL_ID } : null,
    });
  } catch {
    // Permission denied or the platform refused it. The Mesh tab shows the same
    // peers the moment the app is opened, so nothing is actually lost.
  }
}

// Drop the nearby notice once the user is in the app: they can see the mesh for
// themselves now, and a stale "someone nearby" from ten minutes ago is worse
// than none. Also called when the notice itself is tapped.
export async function dismissNearbyNotification(): Promise<void> {
  try {
    await Notifications.dismissNotificationAsync(NEARBY_NOTIFICATION_ID);
  } catch {
    // Nothing delivered, or the platform has no tray: ignore.
  }
}

// Clear the notification for a conversation once the user opens it, matching how
// every chat app clears a chat's notification when you read it.
export async function dismissNotificationsFor(channel: string): Promise<void> {
  try {
    await Notifications.dismissNotificationAsync(channelToId(channel));
  } catch {
    // Nothing delivered for this channel, or the platform has no tray: ignore.
  }
}

// Take every delivered notification out of the shade, and clear the badge.
//
// For the panic wipe. A delivered notification carries a sender nickname and a
// message preview and lives in the system tray, not in any store the wipe
// clears, so it survives the process and keeps rendering on the lock screen of a
// phone whose database has just been destroyed. Nothing else should call this:
// clearing someone's whole tray is the wipe's business and nobody else's.
export async function dismissAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {
    // No tray on this platform, or nothing delivered.
  }
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch {
    // Badges are unsupported here.
  }
}

// Keep the app icon badge in step with total unread (iOS shows the number;
// Android surfaces a launcher dot where supported).
export async function setAppBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch {
    // Unsupported launcher or denied: ignore.
  }
}
