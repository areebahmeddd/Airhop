// English: the source of truth for every other locale.
//
// `locales/types.ts` derives `TranslationKey` and `PluralKey` from this file, and
// every locale is annotated with them, so a key added here is a compile error
// elsewhere until it is filled in. There is no runtime fallback.
//
// Sections follow the app: shell, onboarding, chats, mesh, wallet, contacts,
// settings. Keys are flat and dotted, `<area>.<screen>.<thing>`, and match
// bitchat's where the concept does, so its 30 public-domain translations can be
// lifted rather than commissioned.
//
// Rules, all enforced by `__tests__/catalog.test.ts` unless noted:
//
//   Punctuation      Having started a second sentence, finish it. Titles,
//                    buttons and one-line row subtitles take no full stop;
//                    modal bodies and anything reaching two sentences take one
//                    on every sentence.
//   Placeholders     Named (`{count}`), never positional. Anything inside them
//                    is user content and is never translated.
//   Plurals          Through `tPlural`, never by appending to a stem. Counts
//                    measured in bytes say so: a UTF-8 budget is not characters,
//                    since one emoji spends four.
//   Never in here    Anything that crosses the wire or derives an identity: the
//                    username word lists, the transmitted /hug and /slap text
//                    (bitchat matches it as an English substring), command
//                    tokens, channel names, geohashes, user content, licence
//                    texts. Localise the hint describing a command, never the
//                    command. The wordmark "airhop" is drawn as part of the
//                    brand mark and is never translated or transliterated, and
//                    the endonyms in src/i18n/languages.ts stay in their own
//                    script.
//   Never claim      That Android needs location to find Bluetooth devices (the
//                    manifest asserts neverForLocation on BLUETOOTH_SCAN), or
//                    that clearing the cache can retrieve a file again (there is
//                    no request-that-file protocol). Both mislead about what the
//                    app can do.
//
// See docs/spec/ARCHITECTURE.md.

export const strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Cancel",
  "common.done": "Done",
  "common.ok": "OK",
  "common.close": "Close",
  "common.back": "Back",
  "common.delete": "Delete",
  "common.remove": "Remove",
  "common.add": "Add",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.share": "Share",
  "common.continue": "Continue",
  "common.try_again": "Try again",
  "common.settings": "Settings",
  "common.off": "Off",

  // ---- Dates ----
  "format.today": "Today",
  "format.yesterday": "Yesterday",
  "format.minutes_ago": "{count}m ago",
  "format.hours_ago": "{count}h ago",
  "format.days_ago": "{count}d ago",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Chats",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Wallet",
  "nav.tab.profile": "You",
  "nav.notifications": "Notifications",
  "chat.subtab.channels": "Channels",
  "chat.subtab.direct": "Direct",
  "chat.subtab.dms": "Direct messages",
  "chat.search.placeholder": "Search chats…",
  "chat.search.a11y": "Search chats and messages",
  "chat.search.close": "Close search",
  "chat.search.clear": "Clear search",
  "mesh.view.radar": "Radar view",
  "mesh.view.list": "List view",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "List",

  // ---- Legal document names ----
  "legal.last_updated": "Last updated: {date}",
  "legal.terms": "Terms of Service",
  "legal.privacy": "Privacy Policy",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Private mesh communication",
  "onboarding.welcome.cta": "Get started",
  "onboarding.welcome.cta_hint": "Agree to the terms below to continue",
  "onboarding.welcome.consent_a11y":
    "Agree to the Terms of Service and Privacy Policy",
  "onboarding.welcome.open_terms": "Open Terms of Service",
  "onboarding.welcome.open_privacy": "Open Privacy Policy",
  "onboarding.welcome.consent":
    "By tapping {cta}, you agree to our {terms} and {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Generating your identity",
  "onboarding.identity.body":
    "Creating an Ed25519 key pair on this device.\nNothing is sent anywhere.",
  "onboarding.identity.failed_heading": "Couldn’t create your keys",
  "onboarding.identity.failed_body":
    "This device wouldn’t let Airhop store them securely. Try again, or restart your phone and reopen Airhop.",
  "onboarding.identity.steps_a11y": "Steps: {steps}",
  "onboarding.identity.step.x25519": "Generating X25519 static key pair",
  "onboarding.identity.step.ed25519": "Generating Ed25519 signing key pair",
  "onboarding.identity.step.keychain": "Storing keys in OS Keychain",
  "onboarding.identity.step.peer_id": "Deriving peer ID",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Your name on the mesh",
  "onboarding.username.peer_id": "Peer ID",
  "onboarding.username.card_a11y":
    "Your name on the mesh is {username}. Peer ID {peerID}. {props}.",
  "onboarding.username.explanation":
    "This username is deterministically derived from your public key. It is the same on every device that sees your peer ID.",
  "onboarding.username.cta": "Enter Airhop",
  "onboarding.username.prop.algorithm": "Algorithm",
  "onboarding.username.prop.storage": "Storage",
  "onboarding.username.prop.storage_value": "OS Keychain only",
  "onboarding.username.prop.account": "Account required",
  "onboarding.username.prop.account_value": "None",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Welcome to Airhop",
  "onboarding.hello.p1":
    "Hey there. Airhop is built on top of bitchat as an independent, open source side project. It's not affiliated with or endorsed by the bitchat project or permissionless tech, just something I enjoy building and sharing with the community.",
  "onboarding.hello.p2":
    "This is the first iOS and Android release, so while I've tested it with friends, you'll probably run into a few bugs. If you do, or if you have an idea for a feature, I'd love to hear from you. Open an issue on {github} or send me an email at {email}.",
  "onboarding.hello.p3":
    "If Airhop is useful to you, consider leaving a star on {github} or a review on the {store}. It helps more people discover the project. Thanks for giving it a try!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Before your phone asks",
  "onboarding.primer.lede": "Here is what each one does, and what it does not.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Finds nearby devices and relays messages between them. This creates the mesh and works without an internet connection.",
  "onboarding.primer.location.title": "Location",
  "onboarding.primer.location.body":
    "Places you in nearby area channels, from a block to a region. Airhop never tracks you or sends your precise location off your device.",
  "onboarding.primer.notifications.title": "Notifications",
  "onboarding.primer.notifications.body":
    "Receive alerts for new messages even when the app is closed. Notifications are created locally on your device, with no server involvement.",
  "onboarding.primer.footnote":
    "You can say no. Messages still travel over the internet, and you can change your mind later in Settings.",
  "onboarding.primer.cta_a11y": "Continue to the permission prompts",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Bluetooth access",
  "permission.bluetooth.purpose": "discover nearby devices over the mesh",
  "permission.open_settings": "Open Settings",
  "permission.not_now": "Not now",
  "permission.blocked_title": "{label} is off",
  "permission.blocked_body": "Turn it on in Settings to {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Something went wrong",
  "error.boundary.body":
    "Airhop hit an unexpected problem and had to stop what it was showing.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Default channels",
  "chat.channels.yours": "Your channels",
  "chat.channels.none": "No channels yet",
  "chat.channels.none_hint": "Tap {plus} above to join or create one.",
  "chat.channels.none_desc":
    "No channels yet. Use the add button in the header to join or create one.",
  "chat.channels.show_fewer": "Show fewer default channels",
  "chat.channels.show_less": "Show less",
  "chat.channels.info": "Channel info",
  "chat.channels.pin": "Pin channel",
  "chat.channels.unpin": "Unpin channel",
  "chat.channels.mute": "Mute channel",
  "chat.channels.unmute": "Unmute channel",
  "chat.channels.leave": "Leave channel",
  "chat.channels.leave_confirm": "Leave",
  "chat.channels.clear_body":
    "Delete all messages in {name}? This can't be undone.",
  "chat.channels.leave_body":
    "Leave {name}? You will stop receiving its messages, and its history is removed from this device.",
  "chat.channels.more_options": "More options for {name}",
  "chat.channels.teleported_tag": "{level}  ·  teleported",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Clear chat",
  "chat.dm.remove_contact": "Remove contact",
  "chat.dm.block": "Block this peer",
  "chat.dm.block_confirm": "Block",
  "chat.dm.delete": "Delete chat",
  "chat.dm.delete_body":
    "This removes the conversation from your list and deletes its messages. The contact is kept, and a new message from them starts a fresh chat.",
  "chat.dm.in_range": "in range",
  "chat.dm.row_hint": "Double tap and hold for more options",
  "chat.channels.row_hint": "Double tap and hold for more options",
  "chat.dm.you_prefix": "You:",
  "chat.dm.none": "No direct messages",
  "chat.dm.none_desc":
    "Go to the Mesh tab and tap a peer to start an encrypted DM.",
  "chat.dm.contact_info": "Contact info",
  "chat.dm.pin": "Pin chat",
  "chat.dm.unpin": "Unpin chat",
  "chat.dm.mute": "Mute chat",
  "chat.dm.unmute": "Unmute chat",
  "chat.dm.clear_body":
    "Delete all messages with {name}? This can't be undone.",
  "chat.dm.remove_contact_body":
    "Remove {name}? This deletes the conversation and forgets the contact. They can still reach you if they message again.",
  "chat.dm.block_body":
    "Block {name}? You won't see them on the Mesh tab or receive messages from them, even if they're nearby.",
  "chat.dm.more_options": "More options for {name}",
  "chat.dm.remove_contact_short": "Remove contact",
  "chat.dm.block_short": "Block contact",
  "chat.dm.delete_short": "Delete chat",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Clear messages",
  "chat.clear_confirm": "Clear",
  "chat.group_badge": "Group",
  "chat.more": "More",
  "chat.no_messages": "No messages yet",
  "chat.you": "You",
  "chat.a11y.channel": "Channel {name}",
  "chat.a11y.group": "Group {name}",
  "chat.a11y.muted": "muted",
  "chat.a11y.pinned": "pinned",

  // ---- Chats: start something new ----
  "chat.new.title": "Start something new",
  "chat.new.channel": "Create a private channel",
  "chat.new.channel_label": "Private channel",
  "chat.new.channel_desc":
    "A room anyone with the link can join. Create one, or join with a link you were sent.",
  "chat.new.group": "Create a private group",
  "chat.new.group_label": "Private group",
  "chat.new.group_desc": "Pick specific people. Up to 16. Stays on Bluetooth.",
  "chat.new.place": "Go to a place by geohash",
  "chat.new.place_label": "Go to a place",
  "chat.new.place_desc": "Open a location channel anywhere by its geohash.",
  "chat.new.reach": "Reach",
  "chat.new.reach_internet": "Reaches members over Bluetooth and the internet.",
  "chat.new.reach_mesh": "Works in Bluetooth range, not over the internet.",
  "chat.new.reach_internet_desc":
    "Reaches members over the internet too. Relays can see the channel is active, never its messages or who is in it.",
  "chat.new.reach_mesh_desc":
    "Stays on the local mesh. Most private, nothing leaves Bluetooth range.",
  "chat.new.join_link": "Join a private channel with an invite link",
  "chat.new.back_to_chooser": "Back to the chooser",
  "chat.new.create_channel": "Create channel",
  "chat.new.name_required": "Enter a channel name first",
  "chat.new.name_taken": "That name is already taken",
  "chat.new.create": "Create",
  "chat.new.e2ee": "End-to-end encrypted. Only members can read the messages.",
  "chat.new.invite_only":
    "Invite only. Anyone you share the link with can join. It stays hidden from everyone else, even peers nearby.",
  "chat.new.name_exists": "A channel with this name already exists.",
  "chat.new.reach_bluetooth_chip": "Bluetooth only",
  "chat.new.reach_internet_chip": "Bluetooth + Internet",
  "chat.new.have_link": "Join with an invite link",

  // ---- Chats: join by link ----
  "chat.join.title": "Join with a link",
  "chat.join.not_airhop": "That is not an Airhop link.",
  "chat.join.reach_internet":
    "Reaches members over Bluetooth and the internet.",
  "chat.join.reach_mesh": "Stays in Bluetooth range.",
  "chat.join.contact_card":
    "A contact card. Adds them to your contacts and opens the chat.",
  "chat.join.unverified": "That link could not be verified",
  "chat.join.unverified_body":
    "The contact card does not match its own keys, so it was not added. Ask them to send a fresh one.",
  "chat.join.paste": "Paste from clipboard",
  "chat.join.join": "Join",
  "chat.join.public_channel":
    "Public channel {name}. Anyone nearby can read it.",
  "chat.join.private_channel": "Private channel {name}. {reach}",
  "chat.join.dm_with": "Direct message with {name}.",
  "chat.join.joined_as": "Joined as {name}",
  "chat.join.name_clash_body":
    "You are already in a different {name}. Channel names are just labels, so this invite opened its own channel and the one you were in is untouched. Rename either from its channel info.",
  "chat.join.paste_hint":
    "Paste an invite that starts with airhop://. Tapping one works too; this is for a link you cannot tap.",
  "chat.join.key_note":
    "A private channel invite carries the key, so joining is instant and nothing is asked of anyone else.",
  "chat.join.offline_note":
    "Works offline. The link is read on this device, and the channel reaches however its creator set it up.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Could not open that cell. Try again in a moment.",
  "chat.jump.title": "Go to a place",
  "chat.jump.saved": "SAVED PLACES",
  "chat.jump.anywhere":
    "Open a public location channel anywhere, even a place you are not.",
  "chat.jump.geohash_note":
    "Enter its geohash. Everyone whose location falls in that cell shares the channel.",
  "chat.jump.teleport_note":
    "You show as teleported, not nearby. It reaches over the internet only.",
  "chat.jump.level_cell": "{level} cell",
  "chat.jump.already_here":
    "You are already here. Go opens your {name} channel.",
  "chat.jump.open_direction": "Open the cell to your {direction}",
  "chat.jump.open_place": "Open {name}",
  "chat.jump.remove_place": "Remove {name} from saved places",
  "chat.jump.go": "Go",
  "chat.jump.how":
    "To find a geohash: open a location channel > tap its name > copy it from there.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Could not reach every member. Try again while they're nearby.",
  "chat.group.you_were_added": "You were added to {name}.",
  "chat.group.added_you": "Added you to {name}",
  "chat.group.you_were_removed":
    "You were removed from {name}. You can no longer read or send messages here.",
  "chat.group.removed_you": "Removed you from {name}",
  "chat.group.add_failed": "Could not add them",
  "chat.group.add_failed_body":
    "Nothing changed. Either they are not reachable right now, the group is full at 16, or you are not its creator.",
  "chat.group.remove_failed": "Could not remove them",
  "chat.group.remove_failed_body":
    "Nothing changed. Only the person who created the group can change who is in it.",
  "chat.group.e2ee":
    "End-to-end encrypted. Only members can read the messages.",
  "chat.group.cap":
    "Up to 16 people, chosen by you. There is no invite link, so nobody joins by being forwarded one.",
  "chat.group.bluetooth":
    "Bluetooth only. Members out of range receive messages once they are back.",
  "chat.group.members_label": "MEMBERS",
  "chat.group.none_in_range":
    "No one is in range. Members must be nearby when you create the group.",
  "chat.group.create_title": "Create a group",
  "chat.group.name_placeholder": "Group name",
  "chat.group.create": "Create",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Local mesh · Bluetooth only",
  "chat.scope.mesh_desc":
    "Reaches devices within Bluetooth range (roughly 10 to 100 meters). No internet required. Ideal for local coordination.",
  "chat.scope.block": "City block · ~100m",
  "chat.scope.block_desc":
    "City-block level coverage. Messages are bridged over the internet so peers outside Bluetooth range but nearby can participate.",
  "chat.scope.neighborhood": "Neighborhood · ~1km",
  "chat.scope.neighborhood_desc":
    "Neighborhood coverage. Relay-assisted so peers across the area are reachable even without a direct Bluetooth link.",
  "chat.scope.city": "City · ~10km",
  "chat.scope.city_desc":
    "City-wide channel. Uses geo-located internet relays to reach peers across the metro area.",
  "chat.scope.province": "Province or state · ~100km",
  "chat.scope.province_desc":
    "Provincial or state coverage. Bridged over the internet for regional reach across hundreds of kilometers.",
  "chat.scope.country": "Country or region · ~1000km",
  "chat.scope.country_desc":
    "Country-wide coverage. Any Airhop or bitchat user in the region can join and read messages.",
  "chat.transport.bluetooth": "Bluetooth only",
  "chat.transport.both": "Bluetooth + Internet",
  "chat.transport.internet": "Internet only",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Command /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Send a warm hug",
  "chat.cmd.slap_hint": "Slap with a large trout",
  "chat.status.sending": "Sending…",
  "chat.status.undo_send": "Undo send",
  "chat.status.undo": "Undo",
  "chat.status.sent": "Sent",
  "chat.status.received": "Received",
  "chat.status.failed": "Failed",
  "chat.status.cancelled": "Cancelled",
  "chat.status.waiting": "Waiting",
  "chat.status.sending_short": "Sending",
  "chat.status.receiving": "Receiving",
  "chat.thread.not_available": "Not available here",
  "chat.thread.private_channel": "Private channel",
  "chat.thread.location_channel": "Location channel",
  "chat.thread.public_channel": "Public channel",
  "chat.thread.notices": "Notices for this channel",
  "chat.thread.invite": "Invite someone to this channel",
  "chat.thread.not_in_range":
    "Not in Bluetooth range. Delivering over the internet.",
  "chat.thread.not_nearby":
    "Not nearby. We'll deliver when they're back in range or online.",
  "chat.thread.no_keys":
    "You'll need to be in Bluetooth range, or scan their code, to message them.",
  "chat.geo.card_received":
    "{name} shared their contact. Share yours back to keep talking after either of you moves.",
  "chat.geo.exchange_complete":
    "Contacts exchanged. You can reach each other from anywhere now.",
  "chat.geo.keep_person": "Keep this person",
  "chat.geo.keep_person_desc":
    "Share your contact so you can keep talking after either of you moves. They'll learn your permanent identity.",
  "chat.geo.card_sent": "Shared · waiting for theirs",
  "chat.thread.left_cell":
    "You've left this area, so they can't reach you here. Swap codes to keep talking anywhere.",
  "chat.thread.no_route":
    "Can't reach them right now. Message will send when a route is available.",
  "chat.thread.empty": "No messages yet",
  "chat.thread.empty_desc": "Start an encrypted conversation.",
  "chat.thread.jump_latest": "Jump to latest message",
  "chat.thread.back_to_members": "Back to members",
  "chat.thread.nostr_key": "Nostr public key",
  "chat.thread.in_range": "In range",
  "chat.voice.not_recorded": "Voice note didn't record",
  "chat.thread.message": "Message",
  "chat.thread.message_placeholder": "Message…",
  "chat.thread.length_full": "Message is full",
  "chat.thread.waiting_for": "Waiting for {name} to return · {percent}%",
  "chat.thread.peer": "peer",
  "chat.thread.cancel_transfer": "Cancel {name}",
  "chat.thread.queued_more": "{count} more waiting to send",
  "chat.thread.across_bridge": "{count} across bridge",
  "chat.thread.bridged": "bridged",
  "chat.thread.invite_body":
    "Join me in {channel} on Airhop - offline-first, private mesh messaging.",
  "chat.thread.go_back_unread": "Go back, {count} unread",
  "chat.thread.view_info": "View info for {name}",
  "chat.thread.notices_new": "Notices for this channel, {count} new",
  "chat.thread.say_something": "Say something in {channel}.",
  "chat.thread.jump_latest_new": "Jump to latest message, {count} new",
  "chat.thread.unconfirmed_since": "No delivery confirmed since {date}",
  "chat.thread.no_reach": "No peers nearby · nobody received this yet",
  "chat.thread.channel_needs_internet":
    "Internet off · this channel only reaches people in Bluetooth range",
  "chat.thread.cell_needs_internet":
    "Internet off · this cell is reachable over the internet only",
  "chat.thread.geo_dm_needs_internet":
    "Internet off · this conversation is carried over the internet only",
  "chat.thread.via_gateway":
    "Internet off · a nearby device is carrying this online for you",
  "chat.thread.group_queued":
    "Nobody from this group is nearby yet. It will reach them when they are.",
  "chat.thread.no_group_key":
    "You are no longer in this group, so this cannot be sent",
  "chat.thread.no_reach_offline":
    "Internet off and no peers nearby · nobody received this yet",
  "chat.thread.mention": "Mention {name}",
  "chat.thread.someone_talking": "{hold}. {name} is talking.",
  "chat.thread.attach_note":
    "Files send over Bluetooth range only. Text and payments reach internet contacts; attachments do not.",
  "chat.thread.message_peer": "Message {name}",
  "chat.thread.send": "Send message",
  "chat.thread.group": "Group",
  "chat.bridge.nearby_only":
    "Nearby only: keep this message off the mesh bridge",
  "chat.bridge.nearby_label": "Nearby only · stays on Bluetooth",
  "chat.bridge.bridging_label":
    "Bridging to nearby areas · tap for nearby only",
  "chat.screenshot.you_took": "You took a screenshot",
  "chat.screenshot.you_took_private": "You took a screenshot · nobody was told",
  "chat.screenshot.heads_up": "Heads up",
  "chat.screenshot.notice": "* {name} took a screenshot *",
  "chat.screenshot.notified_dm":
    "{name} was notified that you took a screenshot of this conversation.",
  "chat.screenshot.notified":
    "Everyone in this channel was notified that you took a screenshot.",
  "chat.screenshot.not_notified":
    "Nobody was notified. This channel is public, so announcing a screenshot would record that you were here.",
  "chat.thread.error": "Error",
  "chat.thread.go_back": "Go back",
  "chat.bubble.via_bridge": "via the mesh bridge",
  "chat.bubble.view_profile": "View {name}’s profile",
  "chat.bubble.forwarded": "Forwarded",
  "chat.bubble.attachment": "attachment",
  "chat.bubble.a11y": "{sender}: {body}. Long press for more options.",
  "chat.bubble.failed_retry": "Failed to send. Tap to retry.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Message info",
  "chat.info.delivered_to": "Delivered to {name}",
  "chat.info.read_by": "Read by {name}",
  "chat.info.group_reach_desc": "Reachable now, not a delivery confirmation",
  "chat.info.group_alone": "No other members",
  "chat.info.today_at": "Today {time}",
  "chat.info.sending": "Sending…",
  "chat.info.failed": "Failed to send",
  "chat.info.courier": "Carried by a friend",
  "chat.info.sent": "Sent",
  "chat.info.queued": "Waiting to send",
  "chat.info.waiting": "Waiting…",
  "chat.action.info": "Message info",
  "chat.action.save_photos": "Save to photos",
  "chat.action.save_copy": "Save a copy",
  "chat.action.forward": "Forward",
  "chat.action.select": "Select",
  "chat.select.cancel": "Cancel selection",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Camera",
  "chat.attach.camera_desc": "Take a photo or video",
  "chat.attach.library": "Photo library",
  "chat.attach.library_desc": "Choose from your library",
  "chat.attach.document": "Document",
  "chat.attach.document_desc": "Send any file or PDF",
  "chat.attach.voice": "Voice note",
  "chat.attach.voice_desc": "Record and send a voice message",
  "chat.attach.ecash": "Send ecash",
  "chat.attach.ecash_desc": "Send Cashu sats from your wallet",
  "chat.attach.location": "Location",
  "chat.attach.location_desc": "Send where you are right now",
  "chat.attach.title": "Attach",

  // ---- Chat: location pin ----
  // Shown wherever a card cannot be: the conversation list, a notification.
  "chat.location.sent_summary": "Shared a location",
  "chat.location.received_summary": "Shared their location",
  "chat.location.title": "Location",
  // Distance and direction from where the reader is standing.
  "chat.location.away": "{distance} {direction}",
  "chat.location.accuracy": "Within {meters} m",
  "chat.location.taken": "Taken {ago} ago",
  "chat.location.open_maps": "Open in Maps",
  "chat.location.no_forward": "Locations are not forwarded",
  "chat.location.no_forward_body":
    "A location is sent to one person. Share your own instead if you want somebody else to have it.",
  // The reader has not allowed location, so there is nothing to measure from.
  // States it instead of prompting: a pin is theirs to read, not a reason to
  // ask for a permission.
  "chat.location.no_fix": "Allow location to see how far away this is",
  "chat.location.send_title": "Send your location",
  "chat.location.send_body":
    "{name} will see one point: where you are now. It does not keep updating.",
  "chat.location.send": "Send location",
  "chat.location.finding": "Finding your location…",
  "chat.location.no_location": "Could not get your location",
  "chat.location.no_location_body":
    "Allow location access and make sure location services are on, then try again.",
  "chat.location.not_delivered": "Could not send your location",
  "chat.location.not_delivered_body":
    "A location is only worth sending while it is current, so it is not queued for later. Try again when {name} is reachable.",
  "chat.location.direction.n": "north",
  "chat.location.direction.ne": "north-east",
  "chat.location.direction.e": "east",
  "chat.location.direction.se": "south-east",
  "chat.location.direction.s": "south",
  "chat.location.direction.sw": "south-west",
  "chat.location.direction.w": "west",
  "chat.location.direction.nw": "north-west",
  "chat.attach.send_anyway": "Send anyway",
  "chat.attach.bitchat_too_big": "This may not arrive",
  "chat.attach.bitchat_too_big_body":
    "{name} is on bitchat, which gives up on a large file part-way through. Under about 350 KiB is reliable. Sending it to an Airhop contact has no such limit.",
  "chat.attach.bitchat_unopenable": "They may not be able to open this",
  "chat.attach.bitchat_unopenable_body":
    "{name} is on bitchat, which shows photos and voice notes but lists anything else as a file it cannot open. It will arrive, they just may not be able to view it.",
  "chat.attach.file": "Attach a file",
  "chat.attach.unavailable": "Attachments not available here",
  "chat.attach.not_sent": "Attachment not sent",
  "chat.attach.read_failed":
    "Something went wrong reading that file. Try another one.",
  "chat.attach.caption": "Add a caption…",
  "chat.attach.send": "Send attachment",
  "chat.attach.generic": "Attachment",
  "chat.media.view_full": "View photo full screen",
  "chat.media.gone_photo": "Photo not on this device",
  "chat.media.gone_video": "Video not on this device",
  "chat.media.gone_voice": "Voice note not on this device",
  "chat.media.gone_file": "File not on this device",
  "chat.media.gone_note": "Removed after 7 days or when the cache was cleared",
  "chat.media.ask_resend": "Ask again",
  "chat.media.resend_draft": "Could you send that {kind} again?",
  "chat.media.kind_photo": "photo",
  "chat.media.kind_video": "video",
  "chat.media.kind_voice": "voice note",
  "chat.media.kind_file": "file",
  "chat.media.pause_voice": "Pause voice note",
  "chat.media.play_voice": "Play voice note",
  "chat.media.voice_position": "Voice note position",
  "chat.media.voice_scrub": "Tap along the bars to jump to that point",
  "chat.media.image": "Image",
  "chat.media.tap_load_photo": "Tap to load photo",
  "chat.media.open_document": "Open {name}",
  "chat.media.document": "document",
  "chat.media.tap_load_video": "Tap to load video",
  "chat.media.video": "Video",
  "chat.media.photo": "Photo",
  "chat.media.close_photo": "Close photo",
  "chat.media.save_photo": "Save photo to your photos",
  "chat.media.share_photo": "Share photo",
  "chat.media.saved_videos": "Saved to your videos",
  "chat.media.saved_photos": "Saved to your photos",
  "chat.media.not_saved": "Not saved",
  "chat.media.cant_open": "Can't open file",
  "chat.media.no_app":
    "This device has no app available to open or share this file.",
  "chat.media.open_failed":
    "The file could not be opened. It may have been cleared from the cache.",
  "media.blocked.nostr_only":
    "You only know this person through a relay. Only text is available. Photos, files, and voice notes require Bluetooth.",
  "media.blocked.private_channel":
    "A broadcast attachment is signed but not encrypted, so sending one into a private channel would put it in the clear while the text here stays encrypted.",
  "media.blocked.private_group":
    "A broadcast attachment is signed but not encrypted, so sending one into a private group would put it in the clear while the text here stays encrypted.",
  "media.blocked.location_channel":
    "A location channel reaches people over the internet, and photos, files and voice notes travel over Bluetooth, so they would never arrive.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Voice notes not available here",
  "chat.voice.hold_live": "Hold to talk live",
  "chat.voice.hold_record": "Hold to record a voice note",
  "chat.voice.cancel_recording": "Cancel recording",
  "chat.voice.slide_cancel": "Slide to cancel",
  "chat.voice.release_cancel": "Release to cancel",
  "chat.voice.a11y_toggle": "Double tap to start or stop talking.",
  "chat.voice.limit_reached": "Two minute limit reached, release to send",
  "chat.voice.limit_sent": "Two minute limit reached, note sent",
  "chat.voice.stop_send": "Stop recording and send",
  "chat.voice.lift_lock": "Slide up to record hands-free",
  "chat.voice.live_speaking": "{name} speaking",
  "voice.unavailable": "Live voice not available",
  "voice.recording_stopped": "Recording stopped",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Camera access",
  "chat.perm.camera_purpose": "take a photo to send",
  "chat.perm.photo_label": "Photo access",
  "chat.perm.photo_purpose": "pick a photo or video to send",
  "chat.perm.photo_save_purpose": "save this to your photos",
  "chat.perm.mic_label": "Microphone access",
  "chat.perm.mic_live_purpose": "talk to people nearby",
  "chat.perm.mic_note_purpose": "record a voice note",
  "chat.perm.recording_stopped": "Recording stopped",
  "chat.perm.record_failed":
    "Could not start recording. Check microphone permissions.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Claimed",
  "chat.ecash.reclaimed": "Reclaimed",
  "chat.ecash.claiming": "Claiming…",
  "chat.ecash.claim": "Claim",
  "chat.ecash.claim_amount": "Claim {amount} {unit}",
  "chat.ecash.already_claimed": "Already claimed",
  "chat.ecash.already_claimed_body":
    "Every proof in this token is already in your wallet, so nothing was added.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "Handed to the mesh for best-effort delivery",
  "chat.info.queued_desc": "Held on this phone until there is a route to them",
  "chat.info.reclaimed": "Reclaimed",
  "chat.info.reclaimed_desc":
    "You took this payment back into your wallet, so it will not be delivered",
  "chat.info.about": "About",
  "chat.info.group_desc":
    "A private group. Only the members the creator added can read it, and it stays on Bluetooth.",
  "chat.info.teleported_desc":
    "A public location channel for this geohash cell. Anyone in the cell, on Airhop or bitchat, shares it over the internet. You are teleported, not physically here.",
  "chat.info.custom_desc":
    "A custom channel. Anyone who knows the name can join from any Airhop or bitchat device.",
  "chat.info.private_e2ee": "Private · end-to-end encrypted",
  "chat.info.public_plain": "Public · unencrypted",
  "chat.info.group_privacy":
    "Only the members shown below can read this group. Messages stay on Bluetooth, so members out of range receive them once they are back.",
  "chat.info.teleport_privacy":
    "A place you teleported to. It reaches everyone in this cell over the internet, and nobody in Bluetooth range.",
  "chat.info.location_off_privacy":
    "Location is off, so this channel reaches nearby devices over Bluetooth only. Turn on location to reach its area cell over the internet.",
  "chat.info.invite_privacy":
    "Only people you invite via the link can read it. It stays hidden from everyone else, even peers nearby.",
  "chat.info.public_privacy":
    "Anyone who joins can read every message. Use a direct message for private conversation; DMs are end-to-end encrypted.",
  "chat.info.remove_member": "Remove member",
  "chat.info.remove_member_body":
    "Remove {name} from the group? The group key rotates so they can no longer read new messages.",
  "chat.info.message_member": "Message {name}",
  "chat.info.remove_member_a11y": "Remove {name}",
  "chat.info.no_addable": "No reachable peers to add. Members must be nearby.",
  "chat.info.add_count": "Add {count}",
  "chat.info.teleported_tag": "{level}  ·  teleported",
  "chat.info.active": "Active",
  "chat.info.members": "Members",
  "chat.info.bookmark": "Bookmark this place",
  "chat.info.remove_bookmark": "Remove bookmark",
  "chat.info.default_notice":
    "Default channels cannot be left. They are part of the Airhop mesh protocol.",
  "chat.info.custom_channel": "Custom channel",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Copy geohash",
  "chat.info.relays": "Relays",
  "chat.info.show_relays": "Show the relays carrying this channel",
  "chat.info.relay_custom": "custom",
  "chat.info.relays_none": "None. This cell is Bluetooth only right now.",
  "chat.info.search_members": "Search members",
  "chat.info.search_members_placeholder": "Search members…",
  "chat.info.teleported": "Teleported",
  "chat.info.creator": "Creator",
  "chat.info.no_matches": "No matches",
  "chat.info.no_one_here": "No one here yet",
  "chat.info.add_members": "Add members",
  "chat.info.add_selected": "Add selected members",
  "chat.info.add": "Add",
  "chat.info.leave_group": "Leave group",
  "chat.info.leave_channel": "Leave channel",
  "chat.info.leave": "Leave",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Chatting since {date}",
  "chat.contact.verified_since": "Verified since {date}",
  "chat.contact.anonymous": "Anonymous",
  "chat.contact.anonymous_desc":
    "A geohash pseudonym with no lasting identity to verify",
  "chat.contact.verified": "Verified",
  "chat.contact.verified_desc": "Scanned their QR code",
  "chat.contact.verified_desc_compared": "Compared codes with them",
  "chat.contact.not_verified": "Not verified",
  "chat.contact.not_verified_desc":
    "Scan their code, or compare one on a call, to confirm this is really them",
  "chat.contact.e2ee": "End-to-end encrypted",
  "chat.contact.e2ee_nostr": "NIP-17 gift-wrapped, so relays cannot read it",
  "chat.contact.e2ee_mesh":
    "Noise XX, plus Double Ratchet between Airhop devices",
  "chat.contact.copy_nostr": "Copy Nostr public key",
  "chat.contact.nostr_key": "Nostr public key",
  "chat.contact.cell_key_note":
    "This key belongs to the area you met in. It changes if either of you moves, and the conversation stops with it. Swap contacts to keep talking anywhere.",
  "chat.contact.peer_name": "Peer name",
  "chat.contact.peer_id": "Peer ID",
  "chat.contact.rename": "Rename",
  "chat.contact.rename_needs_contact":
    "You can rename people whose keys you hold. Swap contact cards first, then this becomes a name only you see.",
  "chat.contact.rename_needs_keys":
    "No keys for this contact yet. Message them, or scan their code, and you can give them a name only you see.",
  "chat.contact.renamed_by_you": "Your name for them",
  "chat.contact.copy_peer_id": "Copy peer ID",
  "chat.contact.verify": "Verify contact",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Notices",
  "chat.notices.post_area": "Post a notice to this area",
  "chat.notices.post_mesh": "Post a notice to the mesh",
  "chat.notices.mark_urgent": "Mark urgent",
  "chat.notices.post": "Post notice",
  "chat.notices.post_short": "Post",
  "chat.notices.delete": "Delete notice",
  "chat.notices.just_now": "just now",
  "chat.notices.fades_soon": "fades soon",
  "chat.notices.1_day": "1 day",
  "chat.notices.3_days": "3 days",
  "chat.notices.7_days": "7 days",
  "chat.notices.fading": "fading",
  "chat.notices.fades_in_hours": "fades in {count}h",
  "chat.notices.fades_in_days": "fades in {count}d",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Urgent",
  "chat.notices.permanent_warning":
    "Never fades. Public and tied to this area, and you cannot take it back.",
  "chat.notices.none": "No notices yet. Post one so it stays here for others.",

  // ---- Chats: search results ----
  "chat.search.photos": "Photos",
  "chat.search.videos": "Videos",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Documents",
  "chat.search.links": "Links",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filter by {filter}",
  "chat.search.no_matches": "No {filter} matching “{query}”",
  "chat.search.no_media": "No {filter} yet",
  "chat.search.result_a11y": "{chat}, {kind} from {sender}",
  "chat.search.you": "you",
  "chat.search.section_chats": "Chats",
  "chat.search.section_messages": "Messages",
  "chat.search.section_notices": "Notices",
  "chat.search.hint": "Search messages and chats, or pick a filter above.",
  "chat.search.no_results": "No results for “{query}”",
  "chat.search.open_chat": "Open {name}",
  "chat.search.message_a11y": "{chat}, message from {sender}: {snippet}",
  "chat.search.notice_a11y": "Notice in {chat} from {author}: {snippet}",
  "chat.search.urgent": "Urgent ·",

  // ---- Chats: notification centre ----
  "chat.notif.actions_body":
    "{count} in this list. Clearing removes them from here only, and the messages stay unread in their conversations. Marking all read clears both.",
  "chat.notif.mark_all_read": "Mark all read",
  "chat.notif.clear_list": "Clear list",
  "chat.notif.clear_all_a11y": "Clear all {count} notifications",
  "chat.notif.title": "Notifications",
  "chat.notif.clear_short": "Clear",
  "chat.notif.close": "Close notifications",
  "chat.notif.none": "No notifications yet",
  "chat.notif.none_desc":
    "Messages, mentions, and notices from your channels and chats show up here.",
  "chat.notif.new": "New",
  "chat.notif.notice_in": "notice in {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Forward to…",
  "chat.forward.to": "Forward to {name}",
  "chat.forward.cant_send_here": "Can't forward here",
  "chat.forward.cant_send_to": "Can't forward to {name}",
  "chat.forward.channels": "Channels",
  "chat.forward.groups": "Groups",
  "chat.forward.locations": "Locations",
  "chat.forward.dms": "Direct messages",
  "chat.forward.none": "No other chats yet",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Starting the mesh…",
  "mesh.banner.no_bluetooth": "No Bluetooth on this device · internet only",
  "mesh.banner.bluetooth_off": "Bluetooth off · mesh unavailable",
  "mesh.banner.permission_needed": "Bluetooth permission needed",
  "mesh.banner.blocked": "Bluetooth blocked · allow it in Settings",
  "mesh.banner.location_permission": "Location needed to find peers",
  "mesh.banner.advertising_unsupported":
    "This phone can see others but cannot be discovered",
  "mesh.banner.location_off_android":
    "Location off · Android needs it to find peers",
  "mesh.banner.paused": "Mesh paused · you're away",
  "mesh.banner.location_off": "Location off · location channels unavailable",
  "mesh.banner.battery_saver": "Battery saver · scanning less often",
  "mesh.banner.wipe_incomplete":
    "Wipe incomplete · some data may remain, reopening retries",
  "mesh.banner.wifi_off": "Wi-Fi off · large files send slower",
  "mesh.banner.clock_skew":
    "This phone’s clock is wrong · set the date and time to automatic",
  "mesh.banner.internet_off": "Internet off · Bluetooth only",
  "mesh.banner.relaying": "No local peers · relaying via Nostr",
  "mesh.banner.tor": "Tor on · internet traffic routed",
  "mesh.banner.tor_starting": "Starting Tor · connecting",
  "mesh.banner.tor_blocked": "Tor could not connect · mesh still works",
  "mesh.banner.gateway": "Internet gateway on · relaying nearby peers",
  "mesh.banner.bridge": "Mesh bridge on · public chat linked",
  "mesh.banner.background_limits":
    "{brand} may pause the mesh in the background",
  "mesh.banner.bridge_across": "Mesh bridge on · {count} across the bridge",
  "mesh.banner.action.turn_on": "Turn on",
  "mesh.banner.action.allow": "Allow",
  "mesh.banner.action.resume": "Resume",
  "mesh.banner.action.fix": "Fix",
  "mesh.banner.hint.resume": "Turns Bluetooth advertising and scanning back on",
  "mesh.banner.hint.enable_bluetooth": "Asks Android to switch Bluetooth on",
  "mesh.banner.hint.location_settings": "Opens the system location settings",
  "mesh.banner.hint.app_settings":
    "Opens Airhop's permissions in system settings",
  "mesh.banner.hint.battery_settings":
    "Opens this phone's background activity settings",
  "mesh.banner.dismiss": "Dismiss: {label}",
  "mesh.banner.hint.dismiss": "Hides this note for good",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Scanning for nearby peers…",
  "mesh.radar.starting": "Starting the mesh…",
  "mesh.radar.no_bluetooth": "No Bluetooth on this device",
  "mesh.radar.bluetooth_off": "Bluetooth off · not scanning",
  "mesh.radar.permission_needed": "Bluetooth permission needed",
  "mesh.radar.blocked": "Bluetooth blocked",
  "mesh.radar.location_permission": "Location permission needed",
  "mesh.radar.location_off": "Location off · not scanning",
  "mesh.radar.hint_rings": "Rings show BLE signal strength, not distance",
  "mesh.radar.hint_checking": "Checking Bluetooth and permissions",
  "mesh.radar.hint_internet": "Messages still travel over the internet",
  "mesh.radar.hint_turn_on": "Turn Bluetooth on to discover peers",
  "mesh.radar.hint_allow": "Allow Bluetooth to discover peers",
  "mesh.radar.hint_allow_settings":
    "Allow Bluetooth in Settings to discover peers",
  "mesh.radar.hint_location_permission":
    "Android 11 and older need location to scan over Bluetooth",
  "mesh.radar.hint_android_location":
    "Android needs location on to return Bluetooth scan results",
  "mesh.radar.signal_strong": "Strong",
  "mesh.radar.signal_medium": "Medium",
  "mesh.radar.signal_weak": "Weak",
  "mesh.radar.you_centre": "You, at the centre of the mesh",
  "mesh.radar.sonar_hint":
    "Plays a sonar sweep. Scanning is already continuous.",
  "mesh.radar.paused": "Mesh paused · you're away",
  "mesh.radar.ring_hint":
    "Ring position reflects signal strength, not distance",
  "mesh.radar.set_online":
    "Set your status to Online in Profile to discover peers",
  "mesh.radar.in_range": "in range",
  "mesh.radar.recently_seen": "recently seen",
  "mesh.radar.peer_hint": "Opens options to message or pay this peer",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "just now",
  "mesh.peer.none": "No peers nearby",
  "mesh.peer.none_desc":
    "Other Airhop or bitchat devices within Bluetooth range appear here.",
  "mesh.peer.id_copied": "Peer ID copied",
  "mesh.peer.copy_id": "Copy peer ID",
  "mesh.peer.their_name": "Goes by {name}",
  "mesh.peer.in_range": "In range",
  "mesh.peer.relay": "Relay node",
  "mesh.peer.relay_body":
    "A radio someone left running to widen the mesh. It carries messages it cannot read. There is nobody here to message.",
  "mesh.peer.send_dm": "Send a direct message",
  "mesh.peer.message": "Message",
  "mesh.peer.send_sats": "Send ecash",
  "mesh.peer.amount_placeholder": "Amount in sats",
  "mesh.peer.amount_first": "Send ecash, enter an amount first",
  "mesh.peer.cancel_send": "Cancel send ecash",
  "mesh.peer.view_peer": "View peer {name}",
  "mesh.peer.view_peer_online": "View peer {name}, online",
  "mesh.peer.last_seen": "Last seen {ago} ago",
  "mesh.peer.send_amount": "Send {amount} sats",
  "mesh.peer.direct": "Direct connection",
  "mesh.peer.check_distance": "Check distance",
  "mesh.peer.checking": "Checking",
  "mesh.peer.no_reply": "No reply",
  "mesh.peer.no_reply_hint": "They may have moved, or their app may not answer",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Region",
  "mesh.level.province": "Province",
  "mesh.level.city": "City",
  "mesh.level.neighborhood": "Neighborhood",
  "mesh.level.block": "City block",
  "mesh.level.building": "Building",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Spendable",
  "wallet.balance.unit_hint": "Switches between satoshis and bitcoin",
  "wallet.balance.a11y": "Balance {value} {unit}",
  "wallet.balance.locked":
    "Wallet storage is locked. Ecash proofs are kept in an encrypted file whose key lives in the device keychain, and it could not be opened. Unlock your device and reopen Airhop.",
  "wallet.balance.tor_blocked":
    "Tor is on, so mint requests are blocked: they would go out over the clear net and link your IP to your proofs. Sending and receiving over the mesh still works. Allow mint traffic under Settings, Security.",
  "wallet.balance.unconfirmed_note": "{amount} not yet confirmed with the mint",
  "wallet.balance.reserved_note": "{amount} reserved for a send in flight",
  "wallet.balance.other_mint_note": "{amount} at a separate mint account",
  "wallet.balance.test_mint_note":
    "Includes play money from a test mint. It is not bitcoin and cannot be cashed out.",
  "wallet.token": "Token",
  "wallet.action.send": "Send ecash token",
  "wallet.action.send_disabled":
    "Send ecash token, unavailable with an empty balance",
  "wallet.action.receive": "Receive ecash token",
  "wallet.action.zap": "Zap a Nostr contact",
  "wallet.action.zap_disabled":
    "Zap a Nostr contact, unavailable with an empty balance",
  "wallet.action.add_mint": "Add a Cashu mint",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Could not build the token",
  "wallet.send.title": "Send ecash",
  "wallet.send.amount_in": "Amount in {unit}",
  "wallet.send.body":
    "Built offline from proofs you already hold. Nothing leaves your balance for good until you confirm the token was delivered.",
  "wallet.send.stale_fee_note":
    "Fees were last checked {days} day(s) ago. If this mint has raised its fee since, the send may cost a little more.",
  "wallet.send.fee_note":
    "{spend} {unit} leaves your balance; the extra {fee} covers the mint fee they would otherwise pay",
  "wallet.send.qr_too_big":
    "This token is split across too many coins to fit in a QR code. Share or copy it instead, or refresh at the mint to consolidate.",
  "wallet.send.bearer_note":
    "Whoever holds this string owns the money. The proofs are reserved, not spent: if it never reaches anyone you can reclaim them under Pending.",
  "wallet.send.qr_too_big_short":
    "This token is split across too many coins to fit in a QR code. Share or copy it instead.",
  "wallet.send.scan_note":
    "Have them scan this from their wallet. Still reclaimable until you mark it delivered.",
  "wallet.send.mesh_note":
    "The token goes out as an encrypted DM over the mesh. No internet needed.",
  "wallet.send.no_peers_note":
    "Open the Mesh tab to find nearby devices, or share the token another way.",
  "wallet.send.send_to": "Send to {name}",
  "wallet.send.memo": "Memo (optional, travels with the token)",
  "wallet.send.building": "Building…",
  "wallet.send.build": "Build token",
  "wallet.send.inexact_body":
    "Your proofs can't make exactly {amount} {unit} offline. The smallest token you can build is {spend} {unit}, and offline there is no change: the extra {extra} {unit} goes to the recipient.\n\nRefreshing at the mint while online would split your proofs into denominations that make this exact.",
  "wallet.send.send_amount": "Send {amount}",
  "wallet.send.sent_to": "{amount} {unit} sent to {name}",
  "wallet.send.sent_to_body":
    "{route} It stays reclaimable under Pending until you confirm they got it, or until the mint tells us the proofs were redeemed.",
  "wallet.send.copy_token": "Copy token",
  "wallet.send.share_token": "Share token",
  "wallet.send.open_in_wallet": "Open this token in another wallet",
  "wallet.send.open_in_wallet_short": "Open in wallet",
  "wallet.send.to_peer": "Send token to a nearby peer",
  "wallet.send.to_peer_short": "Send to peer",
  "wallet.send.mark_delivered": "Mark delivered and finish",
  "wallet.send.they_got_it": "They got it",
  "wallet.send.keep_pending": "Keep this send pending",
  "wallet.send.decide_later": "Decide later",
  "wallet.send.no_peers": "No peers in range",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "This is your own payment",
  "wallet.receive.own_payment_body":
    "These coins are still reserved for a send you have not settled, so there is nothing to claim. Use Reclaim on that payment to put them straight back in your balance.",
  "wallet.receive.already_have": "Already in your wallet",
  "wallet.receive.already_have_body":
    "Every proof in this token is already stored here, so nothing was added. Balances are unchanged.",
  "wallet.receive.stored_unconfirmed":
    "Stored from {mint}, but not yet confirmed with the mint ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Redeemed at {mint}. These proofs are now yours alone: the sender's copy no longer works.",
  "wallet.receive.memo_quoted": "\n\n\u201c{memo}\u201d",
  "wallet.receive.redeemed_at":
    "Redeemed at {mint}. It is provably yours now: the sender's copy of this token no longer works.",
  "wallet.receive.stored_pending":
    "Stored from {mint}, but the mint has not confirmed it is unspent yet{dleq}. Refresh from the Wallet tab once you are online.",
  "wallet.receive.dleq_inline":
    " (its signature does check out, so the token is genuine)",
  "wallet.receive.dleq_ok":
    "The mint's signature checks out, so the token is genuine.",
  "wallet.receive.dleq_uncached":
    "The mint's keys are not cached here, so the signature could not be checked offline.",
  "wallet.receive.dleq_warning":
    "Until you refresh online, the sender could in principle have spent it elsewhere.",
  "wallet.receive.failed": "Could not receive",
  "wallet.receive.title": "Receive ecash",
  "wallet.receive.body":
    "Paste a Cashu token. Online it is redeemed at the mint straight away; offline it is stored and confirmed the next time you refresh.",
  "wallet.receive.scan": "Scan an ecash QR code",
  "wallet.receive.scan_short": "Scan QR",
  "wallet.receive.receiving": "Receiving…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap received from {from}… and redeemed into your wallet.",
  "wallet.zap.title": "Zap a Nostr identity",
  "wallet.zap.not_npub": "not an npub",
  "wallet.zap.bad_key": "bad key",
  "wallet.zap.invalid_pubkey": "Invalid pubkey",
  "wallet.zap.invalid_pubkey_body":
    "Enter an npub1… or a 64-character hex Nostr pubkey.",
  "wallet.zap.sent": "Nutzap sent",
  "wallet.zap.failed": "Zap failed",
  "wallet.zap.body":
    "If they publish NIP-61 nutzap info, the ecash is locked to their key so nobody else can spend it, and cannot be taken back. If not, it goes as a reclaimable token instead. You will be told which happened.",
  "wallet.zap.contact": "Zap {name}",
  "wallet.zap.pubkey_placeholder": "npub1… or 64-char hex",
  "wallet.zap.sending": "Sending…",
  "wallet.nostr.copied_body":
    "Give this to someone and they can zap you from Airhop or any other Nostr wallet, with no Bluetooth needed.",
  "wallet.nostr.copy_key": "Copy your Nostr key so people can zap you",
  "wallet.nostr.your_key": "Your Nostr key",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint added",
  "wallet.mint.add_failed": "Could not add mint",
  "wallet.mint.added_named": "Added {name}",
  "wallet.mint.added_body":
    "{mint} issues {units}. Its keys are cached on this device, so tokens from it can now be verified even with no internet.",
  "wallet.mint.remove_plain":
    "Remove {mint} from your wallet? Its cached keys go too, so tokens from it can no longer be verified offline.",
  "wallet.mint.title": "Mints",
  "wallet.mint.none": "No mint yet",
  "wallet.mint.none_desc":
    "A mint issues and redeems your ecash. Add one to deposit over Lightning, or just receive a token and its mint is added for you.",
  "wallet.mint.add": "Add a mint",
  "wallet.mint.add_body":
    "A mint holds the Bitcoin backing your ecash, so pick one you would trust with the balance you keep there. The URL is checked before it is saved. Run your own with Nutshell if you would rather not trust anyone.",
  "wallet.mint.consolidate_body":
    "A token can only ever name one mint, so a balance spread across several cannot pay an amount larger than the biggest one holds. Airhop can move it: each other mint pays a Lightning invoice issued by the one you pick. Costs a small routing fee and needs internet.",
  "wallet.mint.add_short": "Add mint",
  "wallet.mint.checking": "Checking…",
  "wallet.mint.remove_with_balance": "Remove mint with a balance?",
  "wallet.mint.remove": "Remove mint",
  "wallet.mint.delete_anyway": "Delete anyway",
  "wallet.mint.consolidate": "Move all balances to one mint",
  "wallet.mint.confirm_with": "Confirm proofs with {mint}",
  "wallet.mint.remove_a11y": "Remove {mint}",
  "wallet.mint.available_amount": "{amount} {unit} available",
  "wallet.mint.split_across":
    "Balance split across {count} mints. Move it to one.",
  "wallet.mint.move_everything_to": "Move everything to {mint}",
  "wallet.mint.consolidate_title": "Move to one mint",
  "wallet.mint.moving": "Moving…",
  "wallet.mint.move": "Move",
  "wallet.mint.moved": "Moved",
  "wallet.mint.moved_body":
    "{amount} {unit} now sits at {mint}, after {fees} {unit} in Lightning routing fees.",
  "wallet.mint.nothing_moved": "Nothing moved",
  "wallet.mint.destination": "· destination",
  "wallet.mint.will_move": "· will be moved",
  "wallet.mint.issued_by": "Issued by",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop wallet top-up",
  "wallet.ln.invoice_failed": "Could not create the invoice",
  "wallet.ln.price_failed": "Could not price this invoice",
  "wallet.ln.paid": "Paid",
  "wallet.ln.deposit_credited":
    "Invoice paid and {amount} {unit} issued by {mint}. This balance is confirmed: you can spend it offline right away.",
  "wallet.ln.withdrawn":
    "{paid} sats paid over Lightning. The mint charged {fee} sats in routing fees.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats paid over Lightning. The mint charged {fee} sats in routing fees, and returned {change} sats of the reserve to your balance.",
  "wallet.ln.payment_failed": "Payment failed",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Turn Lightning sats into ecash you can spend offline, or cash ecash back out to any Lightning invoice. Both need internet and a mint.",
  "wallet.ln.deposit_body":
    "The mint gives you an invoice. Pay it from any Lightning wallet and the sats come back as ecash you can spend offline.",
  "wallet.ln.pay_invoice_for":
    "Pay this invoice for {amount} {unit}. The wallet is watching for the payment and will issue your ecash automatically.",
  "wallet.ln.expired_body":
    "This invoice expired. If you already paid it, the balance is credited automatically.",
  "wallet.ln.waiting_expires": "Waiting for payment · expires in {countdown}",
  "wallet.ln.withdraw_body":
    "Paste a bolt11 invoice and the mint pays it from your ecash. You are quoted the routing reserve first; whatever routing does not use comes back to your balance.",
  "wallet.ln.up_to": "up to {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Pay {amount} {unit}",
  "wallet.ln.deposit": "Deposit sats over Lightning",
  "wallet.ln.deposit_short": "Deposit",
  "wallet.ln.withdraw": "Withdraw to a Lightning invoice",
  "wallet.ln.withdraw_short": "Withdraw",
  "wallet.ln.deposit_title": "Deposit over Lightning",
  "wallet.ln.amount_placeholder": "Amount in sats",
  "wallet.ln.requesting": "Requesting…",
  "wallet.ln.get_invoice": "Get invoice",
  "wallet.ln.copy_invoice": "Copy invoice",
  "wallet.ln.open_wallet": "Open in a Lightning wallet",
  "wallet.ln.open_wallet_short": "Open in wallet",
  "wallet.ln.waiting": "Waiting for payment…",
  "wallet.ln.new_invoice": "Create a new invoice",
  "wallet.ln.new_invoice_short": "New invoice",
  "wallet.ln.withdraw_title": "Withdraw to Lightning",
  "wallet.ln.scan_invoice": "Scan a Lightning invoice QR code",
  "wallet.ln.paid_from": "Paid from",
  "wallet.ln.invoice": "Invoice",
  "wallet.ln.routing_reserve": "Routing reserve",
  "wallet.ln.reserved": "Reserved from balance",
  "wallet.ln.paying": "Paying…",
  "wallet.ln.get_quote": "Get quote",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Backup",
  "wallet.backup.setup_failed": "Could not set up backup",
  "wallet.backup.on": "Backup on",
  "wallet.backup.on_body":
    "Your balance can now be rebuilt from those twelve words.\n\nAnything you were given by someone else stays outside the phrase until you refresh at the mint, and recovery needs your mint list, so keep it written down beside the words.",
  "wallet.backup.no_phrase": "No phrase stored",
  "wallet.backup.no_phrase_body":
    "The recovery phrase could not be read from the device keychain. Unlock the device and try again.",
  "wallet.backup.replace_title": "Replace your current phrase?",
  "wallet.backup.replace_body":
    "You already have a recovery phrase. Restoring a different one replaces it. Coins already covered by the old phrase stay spendable on this device, but they stop being restorable, so make sure the old words are written down before you continue.",
  "wallet.backup.replace": "Replace",
  "wallet.backup.invalid_phrase": "That phrase is not valid",
  "wallet.backup.invalid_phrase_body":
    "The phrase has a built-in checksum and this one does not pass. Check for a mistyped, missing or swapped word.",
  "wallet.backup.not_bip39":
    "These are not BIP-39 words: {words}. Check the spelling.",
  "wallet.backup.add_mint_first": "Add a mint first",
  "wallet.backup.add_mint_first_body":
    "Recovery works by asking a mint which coins it signed for you, so it needs to know which mint to ask. Add the mints you were using, then restore.",
  "wallet.backup.restore_failed": "Restore failed",
  "wallet.backup.phrase": "Recovery phrase",
  "wallet.backup.state_unconfirmed": "Backup on but not confirmed",
  "wallet.backup.state_off": "Backup off",
  "wallet.backup.badge_on": "On",
  "wallet.backup.badge_unconfirmed": "Unconfirmed",
  "wallet.backup.badge_off": "Off",
  "wallet.backup.view": "View recovery phrase",
  "wallet.backup.setup": "Set up recovery phrase",
  "wallet.backup.view_short": "View phrase",
  "wallet.backup.setup_short": "Set up",
  "wallet.backup.restore": "Restore a wallet from a recovery phrase",
  "wallet.backup.restore_short": "Restore",
  "wallet.backup.setup_title": "Set up a recovery phrase",
  "wallet.backup.on_body_short":
    "Your balance can be rebuilt on a new device from your twelve words.",
  "wallet.backup.unconfirmed_body":
    "You never confirmed a written copy. Right now the words exist only on this phone, which is the one thing a backup is supposed to survive. View the phrase and write it down.",
  "wallet.backup.not_covered":
    "{amount} is not covered yet. Coins you were given carry the secrets of whoever sent them, so they only come under your phrase once they are swapped. Refresh a mint to secure them.",
  "wallet.backup.off_body":
    "Your ecash exists only on this phone. If you lose it, nobody can recover the money, including you. A recovery phrase is twelve words that can rebuild your balance anywhere.",
  "wallet.backup.about_to_see":
    "You are about to see twelve words. They are the money.",
  "wallet.backup.exact_order":
    "Twelve words, in this exact order. Anyone who has them has your balance.",
  "wallet.backup.verify_body":
    "A phrase nobody wrote down is worse than no phrase, because it looks like a safety net that is not there. Two words to confirm.",
  "wallet.backup.verify_mismatch":
    "That does not match. Check your written copy.",
  "wallet.backup.restore_body":
    "Enter the twelve words. Airhop re-derives your coins and asks each mint which of them it signed, so the balance comes back from the records the mint keeps.",
  "wallet.backup.warn_secret":
    "Anyone who reads them can take your balance. Do not screenshot them and do not store them on this phone.",
  "wallet.backup.warn_paper":
    "Write them on paper and keep them somewhere safe. Airhop cannot show them to you again if the phone is gone.",
  "wallet.backup.warn_scope":
    "They rebuild your ecash only. Your identity, chats and contacts are not covered.",
  "wallet.backup.warn_mints":
    "Recovery has to ask a mint which coins it signed, so write your mint list down beside the words.",
  "wallet.backup.preparing": "Preparing…",
  "wallet.backup.show_phrase": "Show my phrase",
  "wallet.backup.your_phrase": "Your recovery phrase",
  "wallet.backup.write_down": "Write these down",
  "wallet.backup.copy_phrase": "Copy recovery phrase to the clipboard",
  "wallet.backup.copy_clipboard": "Copy to clipboard",
  "wallet.backup.written_down": "I have written them down",
  "wallet.backup.check_copy": "Check your copy",
  "wallet.backup.confirm": "Confirm",
  "wallet.backup.restore_title": "Restore from a phrase",
  "wallet.backup.phrase_placeholder": "twelve words, separated by spaces",
  "wallet.backup.no_mints_yet":
    "No mints added yet. Recovery has to ask a specific mint, so add the ones you were using first.",
  "wallet.backup.scanning": "Scanning…",
  "wallet.backup.restore_progress": "{mint} · keyset {step} of {total}",
  "wallet.backup.will_scan":
    "Will scan: {mints}. A mint you have not added is never asked, so its balance stays invisible.",
  "wallet.backup.word_n": "Word {position}",
  "wallet.backup.unreachable_mints":
    "Could not reach: {mints}. Any balance there is still out there. Try again when you have a better connection.",
  "wallet.backup.nothing_recovered":
    "Nothing was recovered from the mints scanned.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Mark as received?",
  "wallet.delivered.body":
    "This releases {amount} {unit} for good. If it never actually arrived, you will not be able to reclaim it.",
  "wallet.delivered.body_generic":
    "This releases the reserved amount for good. If it never actually arrived, you will not be able to reclaim it.",
  "wallet.delivered.cancel": "Not yet",
  "wallet.delivered.confirm": "They got it",
  "wallet.reclaim.title": "Reclaim this token?",
  "wallet.reclaim.body":
    "The {amount} {unit} goes back into your balance. Only do this if the token never reached anyone: if they already have the string, whoever redeems it at the mint first keeps the money, and that could be them.",
  "wallet.reclaim.keep": "Keep pending",
  "wallet.reclaim.confirm": "Reclaim",
  "wallet.copied.token_body":
    "The token is on your clipboard. It stays reserved here until you mark it delivered, so you can paste it again if the first attempt fails.",
  "wallet.copied.phrase_body":
    "Paste it into a password manager, then clear your clipboard. Other apps can read the clipboard, and on some setups it syncs to your other devices.",
  "wallet.refresh.failed": "Refresh failed",
  "wallet.refresh.partly": "Partly refreshed",
  "wallet.refresh.done": "Refreshed",
  "wallet.refresh.unreachable":
    "Could not reach {mints}. Everything else is up to date.",
  "wallet.refresh.swapped":
    "{amount} {unit} confirmed and swapped for fresh proofs.",
  "wallet.refresh.secured":
    "{amount} {unit} is now covered by your recovery phrase.",
  "wallet.refresh.all_confirmed":
    "Everything here was already confirmed with the mint.",
  "wallet.pending.title": "Pending",
  "wallet.pending.reserved_desc":
    "Built and reserved, delivery unconfirmed. The proofs are held out of your balance so they cannot be spent twice.",
  "wallet.pending.locked_desc":
    "Already locked to the recipient's key, so only they can spend it. It just has not reached them yet. Share the token to finish.",
  "wallet.pending.show_qr": "Show this token as a QR code",
  "wallet.pending.copy_again": "Copy the token again",
  "wallet.pending.share_again": "Share the token again",
  "wallet.pending.mark_delivered": "Mark this token as delivered",
  "wallet.pending.delivered": "Delivered",
  "wallet.pending.reclaim_into": "Reclaim this token into your balance",
  "wallet.activity.title": "Activity",
  "wallet.activity.none": "Nothing yet",
  "wallet.activity.none_desc":
    "Payments you send and receive show up here, newest first, with the mint and the fee for each one.",
  "wallet.activity.show_fewer": "Show fewer payments",
  "wallet.activity.show_less": "Show less",
  "wallet.activity.received_unconfirmed": "Received, unconfirmed",
  "wallet.activity.received": "Received",
  "wallet.activity.receive_failed": "Receive failed",
  "wallet.activity.reclaimed": "Reclaimed",
  "wallet.activity.send_failed": "Send failed",
  "wallet.activity.sent": "Sent",
  "wallet.activity.status_pending": "pending",
  "wallet.activity.status_failed": "failed",
  "wallet.activity.status_reclaimed": "reclaimed",
  "wallet.activity.status_expired": "expired",
  "wallet.activity.ln_deposit": "Lightning deposit",
  "wallet.activity.ln_withdrawal": "Lightning withdrawal",
  "wallet.activity.nutzap_received": "Nutzap received",
  "wallet.activity.spent_removed": "Spent proofs removed",
  "wallet.activity.refreshed": "Proofs refreshed",
  "wallet.activity.refreshing": "Refreshing proofs",
  "wallet.activity.just_now": "just now",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh offline",
  "wallet.mesh_offline_body":
    "The mesh service is not running, so there is nothing to hand the token to. It stays reserved under Pending.",
  "wallet.xfer.route_mesh": "Handed straight to their device over the mesh.",
  "wallet.xfer.route_nostr":
    "They were out of Bluetooth range, so it went over the internet instead.",
  "wallet.xfer.route_courier":
    "No route to them right now. It will be carried by other devices and delivered when one reaches them.",
  "wallet.xfer.route_queued":
    "They are not reachable yet. It is queued and will send as soon as they are.",
  "wallet.xfer.mesh_offline_body":
    "The mesh service is not running, so there is no way to hand the token over. Nothing has been deducted.",
  "wallet.xfer.could_not_send": "Could not send",
  "wallet.xfer.inexact_body":
    "Your proofs can't make exactly {amount} {unit} offline. The smallest token you can build is {spend} {unit}, and the extra {extra} {unit} goes to them with no way to get it back.\n\nRefreshing at the mint while online splits your proofs into denominations that make this exact.",
  "wallet.xfer.send_amount": "Send {amount}",
  "wallet.xfer.mesh_offline": "Mesh offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Locked to their key and published to Nostr. It is theirs whether or not they are online.",
  "wallet.pay.rail_nutzap_dm":
    "Locked to their key. The relay would not take it, so it went to them as a message instead.",
  "wallet.pay.rail_nutzap_undelivered":
    "Locked to their key, but nothing could carry it yet. It is queued, and the token is under Pending.",
  "wallet.pay.final":
    "Locked payments cannot be reclaimed: only their key can spend these coins now.",
  "wallet.pay.reclaimable":
    "It stays reclaimable from the Wallet tab until you confirm it arrived.",
  "wallet.pay.why": "Sent this way because {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} to {name}",
  "wallet.pay.thread_receipt": "You sent {amount} {unit}, locked to their key.",
  "wallet.pay.title": "Send ecash",
  "wallet.pay.to": "To {name}",
  "wallet.pay.amount": "Amount in sats",
  "wallet.pay.memo": "Note (optional, public)",
  "wallet.pay.send": "Send",
  "wallet.pay.sending": "Sending…",
  "wallet.pay.action": "Send ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Camera access",
  "wallet.scan.camera_purpose": "scan an ecash QR code",
  "wallet.scan.photo_label": "Photo access",
  "wallet.scan.photo_purpose": "read an ecash QR from an image",
  "wallet.scan.no_token": "No ecash token found in that image.",
  "wallet.scan.no_invoice": "No Lightning invoice found in that image.",
  "wallet.scan.unreadable": "Could not read that image.",
  "wallet.scan.camera_failed":
    "Couldn't start the camera. Close other camera apps and try again.",
  "wallet.scan.close": "Close scanner",
  "wallet.scan.on_device":
    "It is read on this device; nothing is sent anywhere.",
  "wallet.scan.aim_token": "Point at an ecash QR code.",
  "wallet.scan.aim_invoice": "Point at a Lightning invoice QR code.",
  "wallet.scan.title_token": "Scan ecash",
  "wallet.scan.title_invoice": "Scan invoice",
  "wallet.scan.desc_token":
    "Read a Cashu token from another wallet. Works with any Cashu wallet, not only Airhop.",
  "wallet.scan.desc_invoice":
    "Read a Lightning invoice to pay it from your balance.",
  "wallet.scan.use_camera_a11y": "Scan with the camera",
  "wallet.scan.use_camera": "Use camera",
  "wallet.scan.pick_image_a11y": "Read a QR code from a saved image",
  "wallet.scan.pick_image": "Pick from photos",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "What is Cashu?",
  "wallet.explain.intro":
    "Cashu is ecash for Bitcoin. A token is a string that is worth money to whoever holds it, signed blindly by a mint so the mint cannot tell who spent what. No accounts, no logins.",
  "wallet.explain.send": "Send",
  "wallet.explain.send_desc":
    "Turns an amount into a token you can hand to a nearby peer over Bluetooth, or share as text. Works with no internet. The proofs stay reserved until you confirm it landed.",
  "wallet.explain.receive": "Receive",
  "wallet.explain.receive_desc":
    "Paste a token to add it. Online it is swapped at the mint immediately, which makes it provably yours. Offline it is stored and marked unconfirmed until you refresh.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Pays a Nostr identity. If they publish NIP-61 nutzap info, the ecash is locked to their key so only they can spend it. Otherwise it falls back to an encrypted DM. Needs internet.",
  "wallet.explain.add_mint": "Add mint",
  "wallet.explain.add_mint_desc":
    "Saves the mint that issues and redeems your ecash, and caches its public keys so tokens from it can be verified offline. Choose a mint you would trust with the balance you keep there.",
  "wallet.explain.phrase": "Recovery phrase",
  "wallet.explain.phrase_desc":
    "Your coins are derived from twelve words the wallet generates at the start, so a new phone can rebuild the balance by asking your mints which coins they signed. Until you view and write them down, they exist only on this phone.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Wallet locked",
  "wallet.err.mint_unreachable": "Mint unreachable",
  "wallet.err.tor_blocked": "Blocked while Tor is on",
  "wallet.err.insufficient": "Not enough balance",
  "wallet.err.exact_amount": "Can't send that exact amount",
  "wallet.err.no_mint": "No mint",
  "wallet.err.mint_unsupported": "Mint can't do that",
  "wallet.err.mint_refused": "Mint refused",
  "wallet.err.unreadable": "Unreadable token",
  "wallet.err.rejected": "Token rejected",
  "wallet.err.already_spent": "Already spent",
  "wallet.err.change_pending": "Paid, change pending",
  "wallet.svc.mint_unreachable": "Could not reach the mint.",
  "wallet.svc.tor_ios": "Mint requests do not go through Tor on iOS.",
  "wallet.svc.tor_ios_body":
    "Arti only wraps Nostr WebSockets, so this request would reach the mint over the clear net and link your IP to these proofs. Allow it under Settings > Security, or turn Tor off first. Sending and receiving ecash over the mesh still works.",
  "wallet.svc.keys_uncached": "This mint's keys are not cached on this device.",
  "wallet.svc.keys_uncached_body":
    "Open the wallet once while online to fetch them.",
  "wallet.svc.phrase_invalid": "That recovery phrase is not valid.",
  "wallet.svc.phrase_invalid_body":
    "Check for a mistyped or missing word. The phrase has a built-in checksum, so a single wrong word makes the whole thing invalid.",
  "wallet.svc.need_mint": "Add at least one mint first.",
  "wallet.svc.need_mint_body":
    "Recovery works by asking a mint which coins it signed for you, so it needs to know which mint to ask.",
  "wallet.svc.restored": "Restored from recovery phrase",
  "wallet.svc.storage_locked": "Wallet storage is locked.",
  "wallet.svc.storage_locked_body":
    "Airhop keeps ecash proofs in an encrypted file whose key lives in the device keychain. Unlock the device and reopen the app.",
  "wallet.svc.bad_url": "That is not a valid URL.",
  "wallet.svc.needs_https": "A mint URL must start with https://.",
  "wallet.svc.refuse_http": "Refusing to use a mint over plain http.",
  "wallet.svc.refuse_http_body":
    "Anyone on the network path could read or alter your proofs. Use an https:// mint.",
  "wallet.svc.mint_not_saved": "Mint could not be saved.",
  "wallet.svc.unreadable_token": "That is not a readable Cashu token.",
  "wallet.svc.unreadable_token_body":
    "Tokens start with cashuA or cashuB. Check nothing was cut off when it was copied.",
  "wallet.svc.wrong_mint": "This token was not signed by the mint it names.",
  "wallet.svc.already_spent": "These proofs have already been spent.",
  "wallet.svc.already_spent_body":
    "Whoever sent this token redeemed it first, or sent the same token to someone else.",
  "wallet.svc.receiving_offline": "receiving offline",
  "wallet.svc.amount_positive": "Enter an amount greater than zero.",
  "wallet.svc.coins_raced": "Those coins were just used by another payment.",
  "wallet.svc.coins_raced_body":
    "Nothing was deducted. Try again and the wallet will pick a different set.",
  "wallet.svc.no_ecash": "No ecash yet.",
  "wallet.svc.no_ecash_body":
    "Add a mint and deposit over Lightning, or receive a token from someone.",
  "wallet.svc.split_across_mints": "Your balance is split across mints.",
  "wallet.svc.mint_says_spent": "Mint reported these proofs as already spent.",
  "wallet.svc.issue_against_invoice": "issue ecash against a Lightning invoice",
  "wallet.svc.pay_invoice": "pay a Lightning invoice",
  "wallet.svc.unknown_deposit": "Unknown deposit.",
  "wallet.svc.invoice_expired_before":
    "The invoice expired before it was paid.",
  "wallet.svc.invoice_expired": "That invoice expired.",
  "wallet.svc.invoice_unpaid": "The invoice has not been paid yet.",
  "wallet.svc.payment_unknown":
    "Payment status unknown; checked again on next refresh.",
  "wallet.svc.melt_change_pending": "Your invoice was paid.",
  "wallet.svc.melt_change_pending_body":
    "The mint has not returned the unused routing fee yet. It is claimed automatically on the next refresh, and nothing is lost in the meantime.",
  "wallet.svc.mint_did_not_pay":
    "The mint did not pay this invoice. Your balance is unchanged.",
  "wallet.svc.not_an_invoice": "That is not a Lightning invoice.",
  "wallet.svc.not_an_invoice_body":
    "Paste a bolt11 invoice starting with lnbc.",
  "wallet.svc.insufficient_for_invoice": "Not enough balance for this invoice.",
  "wallet.svc.coins_raced_invoice_body":
    "Nothing was deducted and the invoice was not paid. Try again.",
  "wallet.svc.same_mint": "Pick a different destination mint.",
  "wallet.svc.same_mint_body":
    "The source and destination are the same mint, so there is nothing to move.",
  "wallet.svc.quote_failed_retried": "Quote failed, consolidation retried",
  "wallet.svc.amount_unfit_retried":
    "Amount did not fit, consolidation retried",
  "wallet.svc.cannot_size": "Could not size this transfer.",
  "wallet.svc.insufficient_at_mint": "Not enough balance at {mint}.",
  "wallet.svc.inexact_title":
    "Your proofs cannot make exactly {amount} {unit} offline.",
  "wallet.svc.inexact_detail":
    "The smallest token you can send is {spend} {unit}. Offline there is no change, so the extra {extra} {unit} goes to the recipient.",
  "wallet.svc.no_single_mint":
    "No single mint holds {amount} {unit}. Ecash from different mints cannot be combined into one token: consolidate at one mint first, or send in separate amounts.",
  "wallet.svc.have_tried_send":
    "You have {total} {unit}, and tried to send {amount}.",
  "wallet.svc.invoice_needs":
    "This invoice needs {total} {unit} including the routing reserve, and you have {balance}.",
  "wallet.svc.nothing_to_move": "{mint} has no {unit} to move.",
  "wallet.svc.consolidate_memo": "Consolidate from {mint}",
  "wallet.svc.cannot_size_detail":
    "After Lightning routing fees, {from} cannot move a useful amount to {to}. Try moving a specific smaller amount instead.",
  "wallet.svc.mint_cannot": "{mint} cannot {action}.",
  "wallet.svc.no_nut": "The mint does not advertise NUT-{nut}.",
  "wallet.svc.unknown_mint": "That payment names a mint you do not use.",
  "wallet.svc.unknown_mint_body":
    "Add the mint yourself first if you trust it; nothing is redeemed from a mint you have not chosen.",
  "wallet.svc.no_relay": "no relay connection",
  "wallet.svc.no_shared_mint": "no shared mint with enough balance",
  "wallet.svc.no_nutzap_info":
    "recipient has not published nutzap info (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Locked to their key but not yet delivered. Share the token from this transaction to complete it.",
  "wallet.svc.swap_lost":
    "The mint never completed this swap, so nothing was issued against it.",
  "wallet.svc.swap_unreadable":
    "This swap was saved in a form this version cannot replay.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Verified via QR",
  "contacts.qr.keys_unverified": "Keys received, not verified",
  "contacts.qr.not_verified": "Not verified yet",
  "contacts.qr.message": "Message",
  "contacts.qr.add": "Add contact",
  "contacts.qr.scan_title": "Scan QR code",
  "contacts.qr.aim": "Point your camera at their QR code",
  "contacts.qr.add_desc": "Reach someone who isn’t nearby on the mesh.",
  "contacts.qr.peer_id_hint":
    "A peer ID is 16 characters. A contact code starts with airhop:.",
  "contacts.qr.or_scan": "or scan their QR",
  "contacts.qr.trust_note":
    "Only a QR you scan with your camera verifies their key. A pasted code carries their keys but not proof it came from them.",
  "contacts.qr.peer_id": "Peer ID or contact code",
  "contacts.qr.peer_id_placeholder": "Paste an ID or contact code",
  "contacts.qr.scan_camera_a11y": "Scan QR code with camera",
  "contacts.qr.scan_camera_desc": "Use your camera",
  "contacts.qr.upload_a11y": "Upload QR image from gallery",
  "contacts.qr.upload": "Upload from gallery",
  "contacts.qr.upload_desc": "Pick a saved QR image",
  "contacts.qr.scan_a11y": "Add contact by scanning a QR code",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Paste a 16-character peer ID, an airhop://peer/… link, or a contact code.",
  "contacts.scan.camera_label": "Camera access",
  "contacts.scan.camera_purpose": "scan a contact's QR code",
  "contacts.scan.camera_needed":
    "Camera access is needed to scan. You can still add by peer ID.",
  "contacts.scan.camera_failed":
    "Couldn't start the camera. Close other camera apps and try again.",
  "contacts.scan.photo_label": "Photo access",
  "contacts.scan.photo_purpose": "scan a QR code you've saved",
  "contacts.scan.photo_needed":
    "Photo access is needed to pick an image. You can still add by peer ID.",
  "contacts.scan.no_qr": "No Airhop QR code found in that image.",
  "contacts.scan.unreadable": "Couldn't read a QR code from that image.",
  "contacts.scan.bitchat_expired":
    "That bitchat code has expired. Ask them to open their QR again.",
  "contacts.scan.tampered":
    "This QR code is invalid: its peer ID doesn't match its keys. It may have been tampered with.",
  "contacts.scan.already_added": "Already in your contacts",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Waiting for camera access…",
  "contacts.verify.camera_off": "Camera is off",
  "contacts.verify.open_settings": "Open Settings",
  "contacts.verify.verified": "Verified",
  "contacts.verify.different": "Different contact",
  "contacts.verify.scan_again": "Scan again",
  "contacts.verify.failed": "Couldn't verify",
  "contacts.verify.done": "Done",
  "contacts.verify.title": "Verify {name}",
  "contacts.verify.aim": "Point your camera at their QR code",
  "contacts.verify.camera_off_body":
    "Turn on camera access in Settings to verify by QR.",
  "contacts.verify.match_body":
    "{name}’s key matches. You can trust this contact.",
  "contacts.verify.different_body":
    "This QR belongs to someone else. Ask {name} to show their own code.",
  "contacts.verify.tampered_body":
    "This QR looks tampered with: its ID doesn’t match its key.",
  "contacts.verify.choose_title": "How do you want to check?",
  "contacts.verify.choose_body":
    "Both confirm that the keys on this phone really belong to {name}.",
  "contacts.verify.method_scan": "Scan their code",
  "contacts.verify.method_scan_sub": "They’re here with you",
  "contacts.verify.method_compare": "Compare a code",
  "contacts.verify.method_compare_sub": "Read it to each other on a call",
  "contacts.verify.no_keys":
    "No keys for this contact yet. Message them, or scan their code when you meet.",
  "contacts.verify.compare_title": "Read these to each other",
  "contacts.verify.compare_body":
    "{name} sees the same six words. If they match, you both know the keys are real.",
  "contacts.verify.codes_match": "These match",
  "contacts.verify.codes_differ": "They don’t match",
  "contacts.verify.compared_body":
    "You and {name} confirmed the same code. This contact is verified.",

  // ---- Settings: shared chrome ----
  "settings.back": "Go back",
  "settings.coming_soon": "Coming soon",
  "settings.opens_externally": "{label}, opens outside the app",
  "settings.peer_id": "Peer ID",
  "settings.share_peer_id": "Share your Peer ID",
  "settings.share_id_short": "Share ID",
  "settings.peer_id_sheet.title": "Your peer ID",
  "settings.peer_id_sheet.copy": "Copy peer ID",
  "settings.peer_id_sheet.note":
    "This only works when you’re both within Bluetooth range. To let someone message you from anywhere, share your QR code instead.",

  // ---- Settings: hub rows ----
  "settings.section.general": "General",
  "settings.section.general_desc": "Optional features, undo send, media, reset",
  "settings.section.privacy": "Privacy & security",
  "settings.section.privacy_desc":
    "Forward secrecy, signed packets, blocked peers",
  "settings.section.network": "Network & relays",
  "settings.section.network_desc":
    "Internet fallback, nostr relays, bitchat compatibility",
  "settings.section.permissions": "Permissions",
  "settings.section.permissions_desc":
    "Bluetooth, location, notifications, camera, mic",
  "settings.section.storage": "Storage & data",
  "settings.section.diagnostics": "Diagnostics",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transports",
  "settings.group.nearby": "Nearby",
  "settings.group.sync": "Sync",
  "settings.group.features": "Features",
  "settings.group.messages": "Messages",
  "settings.group.media": "Media",
  "settings.group.reset": "Reset",
  "settings.group.always_on": "Always on",
  "settings.group.notifications": "Notifications",
  "settings.group.blocked": "Blocked",
  "settings.group.theme": "Theme",
  "settings.group.font": "Font",
  "settings.group.language": "Language",
  "settings.section.diagnostics_desc": "Connection status and nearby devices",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Bluetooth links",
  "settings.diag.ble_links_desc": "Devices this phone is connected to directly",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Phone to phone, no router or internet",
  "settings.diag.wifi_active": "Running",
  "settings.diag.wifi_unsupported": "Not supported on this device",
  "settings.diag.wifi_permission": "Blocked by a permission",
  "settings.diag.wifi_unavailable": "Not available right now",
  "settings.diag.wifi_unknown": "Waiting for the radio",
  "settings.diag.relays": "Nostr relays",
  "settings.diag.relays_desc": "Used for location channels and internet reach",
  "settings.diag.connected": "Connected",
  "settings.diag.disconnected": "Not connected",
  "settings.diag.peer_direct": "Direct link",
  "settings.diag.peer_relayed": "Heard through another device",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "No signal reading",
  "settings.diag.no_peers": "Nobody in range",
  "settings.diag.no_peers_desc": "{links} radio link(s) open",
  "settings.diag.gcs_size": "Filter size",
  "settings.diag.gcs_size_desc": "Largest sync filter put on the air",
  "settings.diag.fpr": "False positive rate",
  "settings.diag.fpr_desc": "How often the filter claims a packet we lack",
  "settings.diag.bytes": "{n} bytes",
  "settings.diag.footnote":
    "Nothing here can be changed. These values are fixed so Airhop stays compatible with bitchat.",
  "settings.section.storage_desc": "Usage and cache",
  "settings.section.appearance": "Appearance",
  "settings.section.appearance_desc": "Theme, font, and language",
  "settings.section.help": "Help & feedback",
  "settings.section.help_desc": "Contact us, report a bug, or read the FAQ",
  "settings.section.support": "Support",
  "settings.section.support_desc": "Help keep development active",
  "settings.section.about": "About",
  "settings.section.about_desc": "Version, changelog, and source",

  // ---- Settings: general ----
  "settings.general.undo": "Undo send",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Wallet",
  "settings.general.undo_seconds": "{count} seconds",
  "settings.general.undo_a11y": "Undo send: {value}",
  "settings.general.quality_a11y": "Set upload quality to {value}",
  "settings.general.undo_desc":
    "Hold a sent message briefly so you can take it back before it goes out",
  "settings.general.undo_off_desc": "Send right away, no undo",
  "settings.general.undo_2": "2 seconds",
  "settings.general.undo_2_desc": "A quick chance to take it back",
  "settings.general.undo_10": "10 seconds",
  "settings.general.undo_10_desc": "The longest window",
  "settings.general.quality": "Upload quality",
  "settings.general.quality_desc":
    "Applies to photos sent from your camera or library. Every photo is fitted to the mesh either way.",
  "settings.general.quality_low": "Low",
  "settings.general.quality_low_desc": "Smallest photos, quickest to send",
  "settings.general.quality_medium": "Medium",
  "settings.general.quality_medium_desc": "Balanced detail and speed",
  "settings.general.quality_high": "High",
  "settings.general.quality_high_desc": "Keeps the most detail",
  "settings.general.feature_wallet_desc":
    "Send Cashu ecash peer to peer over the mesh",
  "settings.general.feature_wallet_a11y": "Wallet (always on)",
  "settings.general.feature_ai_desc":
    "Private on-device assistant, no network calls",
  "settings.general.feature_feeds": "Feeds",
  "settings.general.feature_feeds_desc":
    "Read and post to Bluesky and Mastodon feeds",
  "settings.general.show_media": "Show media automatically",
  "settings.general.show_media_desc":
    "Photos and videos appear in the chat, or stay behind a tap",
  "settings.general.reset": "Reset settings",
  "settings.general.media_retention": "Keep media for",
  "settings.general.media_retention_desc":
    "Photos, videos and voice notes are deleted after the selected time",
  "settings.general.media_retention_sheet":
    "Choose how long media stays on this device. Deleted media can't be recovered.",
  "settings.general.retention_7_desc":
    "Least left behind. Best if the phone itself is the risk.",
  "settings.general.retention_14_desc":
    "A middle ground for a week or two away from signal.",
  "settings.general.retention_30_desc":
    "Keeps threads readable longest, and keeps the most on disk.",
  "settings.general.reset_desc":
    "Puts every preference back to its default, leaving your identity, messages, contacts and wallet untouched",
  "settings.general.reset_title": "Reset settings?",
  "settings.general.reset_body":
    "Every preference goes back to its default: appearance, undo send, and connectivity (internet, Tor, gateway, bridge, relays). Your identity, messages, contacts, and wallet are untouched.",
  "settings.general.reset_confirm": "Reset",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet is always on for DMs",
  "settings.security.signed_packets": "Signed packets",
  "settings.security.signed_packets_desc": "Every packet is Ed25519-signed",
  "settings.security.hide_previews": "Hide notification previews",
  "settings.security.hide_previews_desc":
    "Keeps the sender and message off your lock screen, which shows them without unlocking",
  "settings.security.no_blocked": "No blocked peers",
  "settings.security.no_blocked_desc":
    "Blocked peers can't message you or appear on the Mesh tab",
  "settings.security.unblock_title": "Unblock this peer",
  "settings.security.unblock": "Unblock",
  "settings.security.unblock_peer": "Unblock {name}",
  "settings.security.unblock_body":
    "{name} will be able to message you again and will reappear on the Mesh tab when nearby.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Internet fallback",
  "settings.network.internet_desc":
    "Continue over Nostr relays when mesh peers are out of range",
  "settings.network.internet_off_title": "Turn off the internet?",
  "settings.network.internet_off_body":
    "Airhop will run on Bluetooth only. It stops contacting any Nostr relay, and Tor, the internet gateway, and the mesh bridge all turn off. Nearby Bluetooth chat keeps working.",
  "settings.network.turn_off": "Turn off",
  "settings.network.discovery": "Geo-relay discovery",
  "settings.network.discovery_desc":
    "Auto-select the nearest relays for a location cell from 300+ distributed relays",
  "settings.network.discovery_needs_relay": "Add a custom relay first",
  "settings.network.discovery_needs_relay_body":
    "Auto-discovery is what points Airhop at the nearest relays. Turning it off only makes sense once you have pinned your own relays below, so add at least one first.",
  "settings.network.custom_only_title": "Use only your custom relays?",
  "settings.network.custom_only_body":
    "Location channels and the mesh bridge will stop auto-selecting the nearest relays and use only the ones you added. This can reduce reach, and you may stop meeting bitchat users, who converge on the nearest relays.",
  "settings.network.custom": "Custom relays",
  "settings.network.custom_desc":
    "Add your own relays for location channels and the mesh bridge",
  "settings.network.custom_added": "{count} of {max} added",
  "settings.network.dm_relays": "Message relays",
  "settings.network.dm_relays_desc":
    "Direct messages and private channels always use these. Custom relays do not change them.",
  "settings.network.discovery_back_on": "Geo-relay discovery back on",
  "settings.network.discovery_back_on_body":
    "That was your last custom relay. Location channels need somewhere to publish, so Airhop is auto-selecting the nearest relays again.",
  "settings.network.add_relay": "Add relay",
  "settings.network.remove_relay": "Remove {url}",
  "settings.network.add_short": "Add",
  "settings.network.relay_limit":
    "You can add {count} relays. Remove one to add another.",
  "settings.network.relay_duplicate": "That relay is already in your list.",
  "settings.network.relay_invalid":
    "Enter a valid relay host, e.g. relay.example.com. A port is only needed if the relay does not use the default. IP addresses and local names are not allowed.",
  "settings.network.bitchat": "bitchat compatibility",
  "settings.network.bitchat_desc":
    "Same BLE mesh as bitchat, fully interoperable. This is always on, and cannot be disabled.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Run in background",
  "settings.conn.background_desc":
    "Keep the mesh running when Airhop is closed",
  "settings.conn.background_on_title": "Keep the mesh running?",
  "settings.conn.background_on_body":
    "Airhop keeps relaying and receiving when it is closed, so messages arrive while you are away. Android shows an ongoing notification while it does.",
  "settings.conn.background_off_title": "Stop the mesh when Airhop closes?",
  "settings.conn.background_off_body":
    "Messages will only arrive while Airhop is open, and this phone stops relaying for people nearby. The ongoing notification goes away.",
  "settings.conn.live_voice": "Live voice",
  "settings.conn.live_voice_desc": "Talk to nearby people like a walkie-talkie",
  "settings.conn.live_voice_on_title": "Turn on live voice?",
  "settings.conn.live_voice_on_body":
    "Holding the mic sends your voice to everyone in Bluetooth range as you speak, and their voice plays on your phone. Nothing is recorded.",
  "settings.conn.live_voice_off_title": "Turn off live voice?",
  "settings.conn.live_voice_off_body":
    "Holding the mic records a voice note instead. It sends when you let go, and nobody hears it until they play it.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor routing",
  "settings.conn.tor_desc": "Route Nostr traffic through Tor for extra privacy",
  "settings.conn.tor_on_title": "Route Nostr traffic through Tor?",
  "settings.conn.tor_on_body":
    "Relays stop seeing your IP address. Connecting takes longer and messages arrive slower. Bluetooth is unaffected.",
  "settings.conn.tor_off_title": "Turn off Tor routing?",
  "settings.conn.tor_off_body":
    "Nostr traffic goes back over your ordinary connection, so relays see your IP address again. Bluetooth is unaffected either way.",
  "settings.conn.tor_orbot_idle":
    "Orbot is installed but not connected. Open Orbot, start its VPN, then turn this on.",
  "settings.conn.tor_unavailable":
    "Tor routing is not available in this build.",
  "settings.conn.tor_timeout":
    "Tor is taking longer than a minute to connect. It stays on and keeps trying; the Mesh tab will say when it is routing, or if this network is blocking it.",
  "settings.conn.tor_failed":
    "Could not start Tor. Ensure the app has network access.",
  "settings.conn.mint_clearnet": "Allow mint traffic over clear net",
  "settings.conn.mint_clearnet_desc":
    "Tor on iOS only covers Nostr. Leave off to block mint requests; ecash over the mesh keeps working either way.",
  "settings.conn.gateway": "Internet gateway",
  "settings.conn.gateway_desc":
    "Lend your connection to a nearby offline phone so it can still reach the location channels",
  "settings.conn.gateway_on_title": "Turn on the internet gateway?",
  "settings.conn.gateway_on_body":
    "Nearby phones with no connection of their own will send and receive location-channel messages through yours. It uses your mobile data and battery, and their messages stay encrypted end to end, so you cannot read what passes through.",
  "settings.conn.gateway_off_title": "Turn off the internet gateway?",
  "settings.conn.gateway_off_body":
    "Nearby offline phones stop reaching the location channels through yours. Your own messages are unaffected.",
  "settings.conn.bridge": "Mesh bridge",
  "settings.conn.bridge_desc":
    "Link this area's public #bluetooth chat with another out-of-range Bluetooth crowd over the internet",
  "settings.conn.bridge_on_title": "Turn on the mesh bridge?",
  "settings.conn.bridge_on_body":
    "Your public #bluetooth messages will be published to your neighborhood over the internet, so people beyond Bluetooth range can read them. Private messages are never bridged, and 'nearby only' keeps any single message local.",
  "settings.conn.bridge_off_title": "Turn off the mesh bridge?",
  "settings.conn.bridge_off_body":
    "Your public #bluetooth messages stay in Bluetooth range again, and messages from the bridged crowd stop arriving here.",
  "settings.conn.bridge_needs_location": "Mesh bridge needs location",
  "settings.conn.bridge_needs_location_desc":
    "It finds your neighborhood from a location fix. Grant location to start bridging.",
  "settings.conn.grant_location": "Grant location permission",
  "settings.conn.grant_short": "Grant",
  "settings.conn.orbot_body":
    "Airhop routes Tor traffic through Orbot. Install and enable Orbot from the Play Store, then turn this on.",
  "settings.conn.internet_off": "Internet is off",
  "settings.conn.internet_off_desc":
    "Tor, the bridge, and the gateway all use the internet. Turn on Internet fallback under Network to use them.",
  "settings.conn.turn_on": "Turn on",
  "settings.conn.turn_off": "Turn off",
  "settings.conn.orbot_title": "Tor on Android",
  "settings.conn.get_orbot": "Get Orbot",
  "settings.conn.later": "Later",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Finds nearby devices and relays messages between them. Without it, the mesh cannot work.",
  "settings.permissions.location": "Location",
  "settings.permissions.location_desc":
    "Opens nearby area channels. Without it, those channels stay closed and the Bluetooth mesh carries on as normal.",
  "settings.permissions.notifications": "Notifications",
  "settings.permissions.notifications_desc":
    "Receive alerts for new messages even when the app is closed. Without it, you only see them when you open Airhop.",
  "settings.permissions.camera": "Camera",
  "settings.permissions.camera_desc":
    "Scan QR codes and capture photos or videos to send. Without it, you can still share media from your library.",
  "settings.permissions.photos": "Photos",
  "settings.permissions.photos_desc":
    "Send photos from your library and save received media. Without it, you can still take and send new photos with the camera.",
  "settings.permissions.microphone": "Microphone",
  "settings.permissions.microphone_desc":
    "Record and send voice messages or use live voice. Without it, voice messages and live voice won't work.",
  "settings.permissions.allow": "Allow this permission",
  "settings.permissions.open_settings":
    "Open system settings to change this permission",
  "settings.permissions.system": "System",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Network usage",
  "settings.storage.storage_usage": "Storage usage",
  "settings.storage.storage_usage_desc":
    "Messages, wallet proofs, and cached attachments",
  "settings.storage.session_usage":
    "This session · {sent} sent, {received} received",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} of attachments",
  "settings.storage.clear_cache": "Clear attachment cache",
  "settings.storage.clear": "Clear",
  "settings.storage.clear_title": "Clear cached media?",
  "settings.storage.clear_body":
    "Photos, videos, voice notes and files are removed from this device, sent and received alike. They cannot be downloaded again: their bubbles will say so, and you can ask the sender to resend. Messages and wallet are untouched.",
  "settings.storage.cleared": "Cache cleared",
  "settings.storage.freed": "Freed {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Set appearance to {value}",
  "settings.font.set_a11y": "Set monospace font to {value}",
  "settings.font.system": "System",
  "settings.font.system_desc": "Uses your device's default monospace font",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Modern and easy to read",
  "settings.language.en": "English",
  "settings.language.am": "Amharic",
  "settings.language.ar": "Arabic",
  "settings.language.my": "Burmese",
  "settings.language.zh_hans": "Chinese (Simplified)",
  "settings.language.zh_hant": "Chinese (Traditional)",
  "settings.language.nl": "Dutch",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "French",
  "settings.language.de": "German",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesian",
  "settings.language.it": "Italian",
  "settings.language.ja": "Japanese",
  "settings.language.ko": "Korean",
  "settings.language.ms": "Malay",
  "settings.language.ne": "Nepali",
  "settings.language.fa": "Persian",
  "settings.language.pl": "Polish",
  "settings.language.pt_br": "Portuguese (Brazil)",
  "settings.language.ru": "Russian",
  "settings.language.es": "Spanish",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Swedish",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thai",
  "settings.language.tr": "Turkish",
  "settings.language.uk": "Ukrainian",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamese",
  "settings.language.soon": "Coming soon",
  "settings.language.soon_a11y": "{value}, coming soon",
  "settings.theme.light": "Light",
  "settings.theme.light_desc": "Always use the light palette",
  "settings.theme.dark": "Dark",
  "settings.theme.dark_desc": "Always use the dark palette",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Discoverable, advertising and scanning",
  "settings.status.away": "Away",
  "settings.status.away_desc": "Mesh paused, not scanning or advertising",
  "settings.status.invisible": "Invisible",
  "settings.status.invisible_desc": "Scanning, but hidden from discovery",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Set status to {value}",
  "settings.status.edit": "Edit status",
  "settings.status.desc": "Choose how visible you are on the mesh.",
  "settings.transfer.identity": "Identity and keys",
  "settings.transfer.identity_desc": "Your peer ID, username, and contacts",
  "settings.transfer.chats": "Chats and history",
  "settings.transfer.chats_desc":
    "Conversations, groups, and the channels you have joined",
  "settings.transfer.wallet": "Wallet balance",
  "settings.transfer.wallet_desc": "Cashu proofs and transaction history",
  "settings.transfer.title": "Transfer to a new phone",
  "settings.transfer.desc":
    "Move your identity, chats, and wallet to another device",
  "settings.transfer.coming_soon_a11y": "Transfer to a new phone, coming soon",
  "settings.transfer.body":
    "Hold both phones together and move everything across over Bluetooth. Nothing passes through a server, so it works with no internet.",
  "settings.qr.permission_label": "Photo access",
  "settings.qr.permission_purpose": "save your QR code",
  "settings.qr.saved": "Saved",
  "settings.qr.saved_body": "QR code saved to your photo library.",
  "settings.qr.save_failed": "Couldn't save",
  "settings.qr.save_failed_body": "The QR code could not be saved. Try again.",
  "settings.qr.share_message": "Add me on Airhop",
  "settings.qr.share_body":
    "Add me on Airhop - offline-first, private mesh messaging.",
  "settings.qr.show_short": "Show QR",
  "settings.qr.title": "Your QR code",
  "settings.qr.note":
    "This contains your public keys, which allow others to message you from anywhere. Share it only with people you trust. It won’t change unless you wipe your identity.",
  "settings.qr.code_label": "Contact code",
  "settings.qr.copy_code": "Copy contact code",
  "settings.qr.share": "Share QR code",
  "settings.qr.share_short": "Share QR",
  "settings.qr.download": "Download QR code",
  "settings.qr.download_short": "Download QR",
  "settings.qr.show": "Show QR code",
  "settings.wipe.trigger": "Trigger panic wipe",
  "settings.wipe.trigger_desc":
    "Triple-tap to wipe immediately without confirming",
  "settings.wipe.title": "Panic wipe",
  "settings.wipe.now": "Wipe now",
  "settings.wipe.desc": "Instantly destroy all keys, messages, and proofs",
  "settings.wipe.body":
    "This will instantly destroy all your keys, messages, and wallet proofs. This cannot be undone.",
  "settings.wipe.in_progress": "Wiping",
  "settings.wipe.in_progress_body":
    "Destroying your keys, messages and files. This takes a few seconds, and finishes on its own if the app is closed.",
  "settings.wipe.got_it": "Got it",
  "settings.wipe.keys_failed": "Keys could not be destroyed",
  "settings.wipe.keys_failed_body":
    "Your messages, contacts and wallet are gone, but the device refused to release your keys. Unlock the device and wipe again.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Contact us",
  "settings.help.contact_a11y": "Email {address}",
  "settings.help.bug": "Report a bug",
  "settings.help.bug_desc": "Open an issue on GitHub",
  "settings.help.bug_a11y": "Report a bug on GitHub",
  "settings.help.faq": "Frequently asked questions",
  "settings.help.faq_desc": "Answers to common questions",
  "settings.help.faq_a11y": "Open FAQ",
  "settings.help.terms_desc": "How Airhop can be used",
  "settings.help.terms_a11y": "Open Terms of Service",
  "settings.help.privacy_desc": "What we don't collect",
  "settings.help.privacy_a11y": "Open Privacy Policy",

  // ---- Settings: support ----
  "settings.support.card": "Card or UPI",
  "settings.support.card_desc": "Netbanking and wallets, worldwide",
  "settings.support.card_a11y": "Support by card, UPI, netbanking, or wallet",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "Monthly or one-time, no platform fee",
  "settings.support.sponsors_a11y": "Support through GitHub Sponsors",
  "settings.support.note":
    "I build Airhop in my free time. There are no investors and no ads. If it is useful to you, a contribution goes a long way toward keeping development active. Every feature stays free either way.",

  // ---- Settings: about and version ----
  "settings.about.version": "Version",
  "settings.about.version_desc": "Current release",
  "settings.about.version_a11y": "View version and check for updates",
  "settings.about.release_notes": "Release notes",
  "settings.about.release_notes_desc": "What's new in the latest release",
  "settings.about.release_notes_a11y":
    "Open the latest release notes on GitHub",
  "settings.about.source": "Source code",
  "settings.about.source_a11y": "Open source code on GitHub",
  "settings.about.licenses": "Open source licenses",
  "settings.about.open_repo": "Open the {name} repository",
  "settings.about.licenses_desc": "Third-party open source packages",
  "settings.about.licenses_a11y": "View third-party licenses",
  "settings.version.codename": "Codename",
  "settings.version.checking": "Checking",
  "settings.version.check": "Check for updates",
  "settings.version.checking_title": "Checking for updates",
  "settings.version.up_to_date": "You are on the latest version.",
  "settings.version.release_notes": "View release notes",
  "settings.version.made_with": "Made with",
  "settings.version.number": "Version {version}",
  "settings.version.update_to": "Update to {version}",
  "settings.version.update_to_a11y": "Update to version {version}",
  "settings.version.released_under": "Released under {license}",
  "settings.version.notes_a11y": "View release notes for version {version}",
  "settings.version.tor_paused":
    "Update check is paused while Tor is on, so it cannot leak your IP. Check the releases page in a browser.",
  "settings.version.check_failed":
    "Could not check for updates. Check your connection and try again.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} is {size} KiB, over the {cap} KiB limit.",
  "transfer.failed.malformed":
    "An attachment arrived damaged and could not be opened. Ask them to send it again.",
  "transfer.failed.unsupported_type":
    "An attachment arrived in a format this app cannot open.",
  "transfer.failed.type_mismatch":
    "An attachment was refused: its contents do not match the file type it claimed.",
  "transfer.failed.storage":
    "An attachment arrived but could not be saved. Check your free space.",
  "transfer.badge.waiting": "Waiting · {name}",
  "transfer.badge.active_count": "{count} transfers",
  "transfer.badge.sending": "Sending {name}",
  "transfer.badge.receiving": "Receiving {name}",
  "transfer.badge.a11y": "{label}, {percent} percent. Open conversation.",
  "transfer.kind.photo": "Photo",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Voice note",
  "transfer.this.photo": "This photo",
  "transfer.this.video": "This video",
  "transfer.this.voice": "This voice note",
  "transfer.this.file": "This file",
  "transfer.kind.document": "Document",
  "transfer.kind.voice_preview": "Voice note",
  "transfer.kind.photo_preview": "Photo",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Document",

  // ---- System notifications ----
  "notif.channel.messages": "Messages",
  "notif.channel.nearby": "Nearby peers",
  "notif.channel.nearby_desc":
    "An occasional notice when the mesh finds people in Bluetooth range.",
  "notif.nearby.body": "In Bluetooth range now. Tap to open the mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Someone",
  "notif.notice_urgent": "Urgent notice · {content}",
  "notif.notice": "Notice · {content}",
  "notif.incoming_file": "Incoming file",
  "notif.preview.photo": "📷 Photo",
  "notif.preview.voice": "🎤 Voice message",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Document",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "New message",
  "notif.hidden.channel": "New activity",
  "notif.hidden.mention": "You were mentioned",
  "notif.mention.title": "{sender} mentioned you",
} as const;

// Plural forms live apart from the flat strings because plural categories are
// per-language: English needs one/other, Russian one/few/many/other, Arabic all
// six. A locale supplies only the categories its language uses, and `other` is
// required everywhere. See `locales/types.ts`.
export const plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Show {count} more",
    other: "Show {count} more",
  },
  "chat.channels.show_more_a11y": {
    one: "Show {count} more default channel",
    other: "Show {count} more default channels",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} unread",
    other: "{label}, {count} unread",
  },
  "a11y.new_count": {
    one: "{label}, {count} new",
    other: "{label}, {count} new",
  },
  "chat.a11y.unread": {
    one: "{count} unread",
    other: "{count} unread",
  },
  "chat.thread.length_left": {
    one: "{count} left",
    other: "{count} left",
  },
  "settings.general.retention_days": {
    one: "{count} day",
    other: "{count} days",
  },
  "chat.info.group_reach": {
    one: "{reachable} of {count} member reachable",
    other: "{reachable} of {count} members reachable",
  },
  "chat.group_members": {
    one: "Private group  ·  {count} member",
    other: "Private group  ·  {count} members",
  },
  "chat.select.count": {
    one: "{count} selected",
    other: "{count} selected",
  },
  "chat.select.forward": {
    one: "Forward {count} message",
    other: "Forward {count} messages",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} speaking",
    other: "{count} speaking",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} peer in range",
    other: "{count} peers in range",
  },
  "mesh.peer.hops_away": {
    one: "{count} hop away",
    other: "{count} hops away",
  },
  "chat.presence.active": {
    one: "{count} active",
    other: "{count} active",
  },
  "chat.presence.nearby": {
    one: "{count} nearby",
    other: "{count} nearby",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mint",
    other: "{count} mints",
  },
  "wallet.mint.remove_body": {
    one: "{mint} holds {balance} {unit} in {count} proof. Removing it deletes that proof from this device permanently and there is no backup. Withdraw or send the balance first.",
    other:
      "{mint} holds {balance} {unit} in {count} proofs. Removing it deletes those proofs from this device permanently and there is no backup. Withdraw or send the balance first.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} deposit waiting on payment. Checked again each time the app opens.",
    other:
      "{count} deposits waiting on payment. Checked again each time the app opens.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Recovered {count} unspent proof from {mints}.",
    other: "Recovered {count} unspent proofs from {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "{count} coin was found but already spent, so nothing was credited for it. That is normal: every coin you have ever spent still appears in the records the mint keeps.",
    other:
      "{count} coins were found but already spent, so nothing was credited for them. That is normal: every coin you have ever spent still appears in the records the mint keeps.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Show {count} more",
    other: "Show {count} more",
  },
  "wallet.activity.show_more_a11y": {
    one: "Show {count} more payment",
    other: "Show {count} more payments",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} unconfirmed",
    other: "{count} unconfirmed",
  },
  "wallet.proof_count": {
    one: "{count} proof",
    other: "{count} proofs",
  },
  "wallet.spent_removed_detail": {
    one: "{count} proof was already spent and has been removed.",
    other: "{count} proofs were already spent and have been removed.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Someone nearby",
    other: "{count} people nearby",
  },
} as const;

export const en = { strings, plurals };
