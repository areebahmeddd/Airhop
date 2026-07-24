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

import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { ChatMessage } from "../store/chat-store";
import { channelLabel } from "../utils/chat-display-name";
import {
  notificationContentFor,
  shouldHapticPing,
  shouldSystemNotify,
} from "./notification-policy";

// Android notification channel for messages. Separate from the silent
// "mesh running" foreground-service channel, and high importance so messages
// surface as a heads-up the way a chat app should.
const MESSAGES_CHANNEL_ID = "messages";

// Live view state the policy consults. Kept module-local (not in a store)
// because only this service reads it and it must be readable synchronously from
// the inbound handler.
let appActive = true;
let activeChannel = "";
let navigate: ((channel: string) => void) | null = null;
let configured = false;
let responseSub: Notifications.Subscription | null = null;

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

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(MESSAGES_CHANNEL_ID, {
      name: "Messages",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
    });
  }

  responseSub?.remove();
  responseSub = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      routeFromResponse(response);
    },
  );

  // Launched by tapping a notification while the app was killed.
  const last = await Notifications.getLastNotificationResponseAsync();
  if (last) routeFromResponse(last);
}

function routeFromResponse(response: Notifications.NotificationResponse): void {
  const channel = response.notification.request.content.data?.channel;
  if (typeof channel === "string") {
    navigate?.(channel);
    void dismissNotificationsFor(channel);
  }
}

// Called for every genuinely-new inbound message (see chat-store's inbound
// observer). Decides between a system notification (backgrounded), a soft
// haptic (foreground, different chat), or nothing (your own message, or the
// chat you are looking at).
export async function handleInboundMessage(
  msg: ChatMessage,
  totalUnread: number,
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

// Clear the notification for a conversation once the user opens it, matching how
// every chat app clears a chat's notification when you read it.
export async function dismissNotificationsFor(channel: string): Promise<void> {
  try {
    await Notifications.dismissNotificationAsync(channelToId(channel));
  } catch {
    // Nothing delivered for this channel, or the platform has no tray: ignore.
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
