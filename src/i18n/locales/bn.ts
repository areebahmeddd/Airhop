// bn: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "বাতিল",
  "common.done": "হয়ে গেছে",
  "common.ok": "ঠিক আছে",
  "common.close": "বন্ধ করুন",
  "common.back": "ফিরুন",
  "common.delete": "মুছুন",
  "common.remove": "সরান",
  "common.add": "যোগ করুন",
  "common.copy": "কপি করুন",
  "common.copied": "কপি হয়েছে",
  "common.share": "ভাগ করুন",
  "common.continue": "চালিয়ে যান",
  "common.try_again": "আবার চেষ্টা করুন",
  "common.settings": "সেটিংস",
  "common.off": "বন্ধ",

  // ---- Dates ----
  "format.today": "আজ",
  "format.yesterday": "গতকাল",
  "format.minutes_ago": "{count} মিনিট আগে",
  "format.hours_ago": "{count} ঘণ্টা আগে",
  "format.days_ago": "{count} দিন আগে",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "চ্যাট",
  "nav.tab.mesh": "মেশ",
  "nav.tab.wallet": "ওয়ালেট",
  "nav.tab.profile": "আপনি",
  "a11y.tab.new_peers": "{label}, কাছে নতুন কেউ",
  "nav.notifications": "বিজ্ঞপ্তি",
  "chat.subtab.channels": "চ্যানেল",
  "chat.subtab.direct": "ব্যক্তিগত",
  "chat.subtab.dms": "ব্যক্তিগত বার্তা",
  "chat.search.placeholder": "চ্যাটে খুঁজুন…",
  "chat.search.a11y": "চ্যাট ও বার্তায় খুঁজুন",
  "chat.search.close": "খোঁজা বন্ধ করুন",
  "chat.search.clear": "খোঁজা মুছুন",
  "mesh.view.radar": "রাডার দৃশ্য",
  "mesh.view.list": "তালিকা দৃশ্য",
  "mesh.view.radar_short": "রাডার",
  "mesh.view.list_short": "তালিকা",

  // ---- Legal document names ----
  "legal.last_updated": "সবশেষ হালনাগাদ: {date}",
  "legal.terms": "পরিষেবার শর্তাবলি",
  "legal.privacy": "গোপনীয়তা নীতি",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "ব্যক্তিগত মেশ যোগাযোগ",
  "onboarding.welcome.cta": "শুরু করুন",
  "onboarding.welcome.cta_hint": "চালিয়ে যেতে নিচের শর্তে সম্মত হন",
  "onboarding.welcome.consent_a11y":
    "পরিষেবার শর্তাবলি ও গোপনীয়তা নীতিতে সম্মত হন",
  "onboarding.welcome.open_terms": "পরিষেবার শর্তাবলি খুলুন",
  "onboarding.welcome.open_privacy": "গোপনীয়তা নীতি খুলুন",
  "onboarding.welcome.consent":
    "{cta} ট্যাপ করলে আপনি আমাদের {terms} ও {privacy}-তে সম্মত হচ্ছেন।",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "আপনার পরিচয় তৈরি হচ্ছে",
  "onboarding.identity.body":
    "এই ডিভাইসে একটি Ed25519 কী জোড়া তৈরি হচ্ছে।\nকিছুই কোথাও পাঠানো হয় না।",
  "onboarding.identity.failed_heading": "আপনার কী তৈরি করা গেল না",
  "onboarding.identity.failed_body":
    "এই ডিভাইসটি Airhop-কে সেগুলো নিরাপদে রাখতে দেয়নি। আবার চেষ্টা করুন, বা ফোন চালু করে আবার Airhop খুলুন।",
  "onboarding.identity.steps_a11y": "ধাপ: {steps}",
  "onboarding.identity.step.x25519": "X25519 স্থির কী জোড়া তৈরি হচ্ছে",
  "onboarding.identity.step.ed25519": "Ed25519 সই কী জোড়া তৈরি হচ্ছে",
  "onboarding.identity.step.keychain": "কী OS কীচেইনে রাখা হচ্ছে",
  "onboarding.identity.step.peer_id": "পিয়ার আইডি তৈরি হচ্ছে",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "মেশে আপনার নাম",
  "onboarding.username.peer_id": "পিয়ার আইডি",
  "onboarding.username.card_a11y":
    "মেশে আপনার নাম {username}। পিয়ার আইডি {peerID}। {props}।",
  "onboarding.username.explanation":
    "এই ব্যবহারকারী নামটি আপনার পাবলিক কী থেকে নির্দিষ্টভাবে তৈরি। আপনার পিয়ার আইডি দেখে এমন প্রতিটি ডিভাইসে এটি একই থাকে।",
  "onboarding.username.cta": "Airhop-এ ঢুকুন",
  "onboarding.username.prop.algorithm": "অ্যালগরিদম",
  "onboarding.username.prop.storage": "সংরক্ষণ",
  "onboarding.username.prop.storage_value": "কেবল OS কীচেইন",
  "onboarding.username.prop.account": "অ্যাকাউন্ট লাগে",
  "onboarding.username.prop.account_value": "লাগে না",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop-এ স্বাগতম",
  "onboarding.hello.p1":
    "নমস্কার। Airhop bitchat-এর উপর গড়া একটি স্বাধীন, ওপেন সোর্স শখের প্রকল্প। এটি bitchat প্রকল্প বা permissionless tech-এর সঙ্গে যুক্ত নয় এবং তাদের অনুমোদিতও নয়, কেবল এমন কিছু যা বানাতে ও সম্প্রদায়ের সঙ্গে ভাগ করে নিতে আমার ভালো লাগে।",
  "onboarding.hello.p2":
    "এটি প্রথম iOS ও Android সংস্করণ, তাই বন্ধুদের সঙ্গে পরখ করলেও আপনি সম্ভবত কিছু ত্রুটির মুখে পড়বেন। পড়লে, বা কোনো সুবিধার ভাবনা থাকলে, শুনতে ভালো লাগবে। {github}-এ একটি issue খুলুন বা {email}-এ আমাকে একটি ইমেল পাঠান।",
  "onboarding.hello.p3":
    "Airhop আপনার কাজে লাগলে {github}-এ একটি তারা দেওয়ার কথা ভাবুন, বা {store}-এ একটি পর্যালোচনা লিখুন। এতে আরও বেশি মানুষ প্রকল্পটি খুঁজে পান। চেষ্টা করে দেখার জন্য ধন্যবাদ!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "আপনার ফোন জিজ্ঞেস করার আগে",
  "onboarding.primer.lede": "প্রতিটি কী করে, আর কী করে না, তা এখানে।",
  "onboarding.primer.bluetooth.title": "ব্লুটুথ",
  "onboarding.primer.bluetooth.body":
    "কাছের ডিভাইস খুঁজে বের করে এবং তাদের মধ্যে বার্তা আদান-প্রদান করে। এতেই মেশ তৈরি হয় এবং ইন্টারনেট সংযোগ ছাড়াই চলে।",
  "onboarding.primer.location.title": "অবস্থান",
  "onboarding.primer.location.body":
    "আপনাকে কাছের এলাকার চ্যানেলে রাখে, একটি পাড়া থেকে গোটা অঞ্চল পর্যন্ত। Airhop কখনো আপনাকে অনুসরণ করে না বা আপনার নির্ভুল অবস্থান ডিভাইসের বাইরে পাঠায় না।",
  "onboarding.primer.notifications.title": "বিজ্ঞপ্তি",
  "onboarding.primer.notifications.body":
    "অ্যাপ বন্ধ থাকলেও নতুন বার্তার খবর পান। বিজ্ঞপ্তি আপনার ডিভাইসেই তৈরি হয়, কোনো সার্ভার জড়িত থাকে না।",
  "onboarding.primer.footnote":
    "আপনি না বলতে পারেন। বার্তা তবুও ইন্টারনেটে যাতায়াত করে, আর পরে সেটিংসে গিয়ে মত বদলাতে পারেন।",
  "onboarding.primer.cta_a11y": "অনুমতির অনুরোধে চালিয়ে যান",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "ব্লুটুথের অনুমতি",
  "permission.bluetooth.purpose": "মেশে কাছের ডিভাইস খুঁজে পেতে",
  "permission.open_settings": "সেটিংস খুলুন",
  "permission.not_now": "এখন নয়",
  "permission.blocked_title": "{label} বন্ধ",
  "permission.blocked_body": "{purpose} সেটিংসে গিয়ে এটি চালু করুন।",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "কিছু একটা ভুল হয়েছে",
  "error.boundary.body":
    "Airhop অপ্রত্যাশিত একটি সমস্যায় পড়ে যা দেখাচ্ছিল তা থামাতে বাধ্য হয়েছে।",

  // ---- Chats: channel list ----
  "chat.channels.default": "ডিফল্ট চ্যানেল",
  "chat.channels.yours": "আপনার চ্যানেল",
  "chat.channels.none": "এখনো কোনো চ্যানেল নেই",
  "chat.channels.none_hint":
    "যোগ দিতে বা নতুন তৈরি করতে উপরের {plus} ট্যাপ করুন।",
  "chat.channels.none_desc":
    "এখনো কোনো চ্যানেল নেই। যোগ দিতে বা নতুন তৈরি করতে হেডারের যোগ বোতামটি ব্যবহার করুন।",
  "chat.channels.show_fewer": "কম ডিফল্ট চ্যানেল দেখান",
  "chat.channels.show_less": "কম দেখান",
  "chat.channels.info": "চ্যানেলের তথ্য",
  "chat.channels.pin": "চ্যানেল পিন করুন",
  "chat.channels.unpin": "চ্যানেলের পিন সরান",
  "chat.channels.mute": "চ্যানেল নীরব করুন",
  "chat.channels.unmute": "চ্যানেলের নীরবতা সরান",
  "chat.channels.leave": "চ্যানেল ছাড়ুন",
  "chat.channels.leave_confirm": "ছাড়ুন",
  "chat.channels.clear_body":
    "{name}-এর সব বার্তা মুছে ফেলবেন? এটি আর ফেরানো যাবে না।",
  "chat.channels.leave_body":
    "{name} ছাড়বেন? আপনি আর এর বার্তা পাবেন না, আর এর ইতিহাস এই ডিভাইস থেকে সরে যাবে।",
  "chat.channels.more_options": "{name}-এর আরও বিকল্প",
  "chat.channels.teleported_tag": "{level}  ·  দূর থেকে",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "চ্যাট খালি করুন",
  "chat.dm.remove_contact": "পরিচিতি সরান",
  "chat.dm.block": "এই পিয়ারকে ব্লক করুন",
  "chat.dm.block_confirm": "ব্লক",
  "chat.dm.delete": "চ্যাট মুছুন",
  "chat.dm.delete_body":
    "এটি কথোপকথনটি আপনার তালিকা থেকে সরিয়ে এর বার্তাগুলো মুছে দেয়। পরিচিতি থেকে যায়, আর তাদের নতুন বার্তা এলে নতুন চ্যাট শুরু হয়।",
  "chat.dm.in_range": "নাগালের মধ্যে",
  "chat.dm.row_hint": "আরও বিকল্পের জন্য দুবার ট্যাপ করে ধরে রাখুন",
  "chat.channels.row_hint": "আরও বিকল্পের জন্য দুবার ট্যাপ করে ধরে রাখুন",
  "chat.dm.you_prefix": "আপনি:",
  "chat.dm.none": "কোনো ব্যক্তিগত বার্তা নেই",
  "chat.dm.none_desc":
    "এনক্রিপ্ট করা ব্যক্তিগত বার্তা শুরু করতে মেশ ট্যাবে গিয়ে একটি পিয়ারে ট্যাপ করুন।",
  "chat.dm.contact_info": "পরিচিতির তথ্য",
  "chat.dm.pin": "চ্যাট পিন করুন",
  "chat.dm.unpin": "চ্যাটের পিন সরান",
  "chat.dm.mute": "চ্যাট নীরব করুন",
  "chat.dm.unmute": "চ্যাটের নীরবতা সরান",
  "chat.dm.clear_body":
    "{name}-এর সঙ্গে সব বার্তা মুছে ফেলবেন? এটি আর ফেরানো যাবে না।",
  "chat.dm.remove_contact_body":
    "{name}-কে সরাবেন? এটি কথোপকথনটি মুছে দেয় ও পরিচিতিটি ভুলে যায়। তারা আবার বার্তা পাঠালে আপনার কাছে পৌঁছাতে পারবে।",
  "chat.dm.block_body":
    "{name}-কে ব্লক করবেন? আপনি তাদের মেশ ট্যাবে দেখবেন না, তাদের বার্তাও পাবেন না, তারা কাছে থাকলেও নয়।",
  "chat.dm.more_options": "{name}-এর আরও বিকল্প",
  "chat.dm.remove_contact_short": "পরিচিতি সরান",
  "chat.dm.block_short": "পরিচিতি ব্লক করুন",
  "chat.dm.delete_short": "চ্যাট মুছুন",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "বার্তা খালি করুন",
  "chat.clear_confirm": "খালি করুন",
  "chat.group_badge": "গ্রুপ",
  "chat.more": "আরও",
  "chat.no_messages": "এখনো কোনো বার্তা নেই",
  "chat.you": "আপনি",
  "chat.a11y.channel": "চ্যানেল {name}",
  "chat.a11y.group": "গ্রুপ {name}",
  "chat.a11y.muted": "নীরব",
  "chat.a11y.pinned": "পিন করা",

  // ---- Chats: start something new ----
  "chat.new.title": "নতুন কিছু শুরু করুন",
  "chat.new.channel": "একটি ব্যক্তিগত চ্যানেল তৈরি করুন",
  "chat.new.channel_label": "ব্যক্তিগত চ্যানেল",
  "chat.new.channel_desc":
    "লিঙ্ক আছে এমন যে কেউ যোগ দিতে পারে এমন একটি ঘর। একটি তৈরি করুন, বা পাঠানো লিঙ্ক দিয়ে যোগ দিন।",
  "chat.new.group": "একটি ব্যক্তিগত গ্রুপ তৈরি করুন",
  "chat.new.group_label": "ব্যক্তিগত গ্রুপ",
  "chat.new.group_desc":
    "নির্দিষ্ট লোক বেছে নিন। সর্বোচ্চ 16 জন। ব্লুটুথেই থাকে।",
  "chat.new.place": "geohash দিয়ে কোনো জায়গায় যান",
  "chat.new.place_label": "কোনো জায়গায় যান",
  "chat.new.place_desc": "geohash দিয়ে যেকোনো জায়গার অবস্থান চ্যানেল খুলুন।",
  "chat.new.reach": "নাগাল",
  "chat.new.reach_internet":
    "ব্লুটুথ ও ইন্টারনেটের মাধ্যমে সদস্যদের কাছে পৌঁছায়।",
  "chat.new.reach_mesh": "ব্লুটুথের নাগালে কাজ করে, ইন্টারনেটে নয়।",
  "chat.new.reach_internet_desc":
    "ইন্টারনেটের মাধ্যমেও সদস্যদের কাছে পৌঁছায়। রিলে দেখতে পায় চ্যানেলটি সক্রিয়, কখনোই এর বার্তা বা কারা আছে তা নয়।",
  "chat.new.reach_mesh_desc":
    "স্থানীয় মেশেই থাকে। সবচেয়ে ব্যক্তিগত, কিছুই ব্লুটুথের নাগাল ছাড়ে না।",
  "chat.new.join_link": "আমন্ত্রণ লিঙ্ক দিয়ে ব্যক্তিগত চ্যানেলে যোগ দিন",
  "chat.new.back_to_chooser": "নির্বাচকে ফিরুন",
  "chat.new.create_channel": "চ্যানেল তৈরি করুন",
  "chat.new.name_required": "আগে একটি চ্যানেলের নাম লিখুন",
  "chat.new.name_taken": "সেই নামটি ইতিমধ্যে নেওয়া হয়েছে",
  "chat.new.create": "তৈরি করুন",
  "chat.new.e2ee":
    "প্রান্ত থেকে প্রান্ত এনক্রিপ্ট করা। কেবল সদস্যরাই বার্তা পড়তে পারে।",
  "chat.new.invite_only":
    "কেবল আমন্ত্রণে। আপনি যাকে লিঙ্ক দেবেন সে-ই যোগ দিতে পারবে। বাকি সবার কাছে এটি লুকানো থাকে, কাছের পিয়ারদের কাছেও।",
  "chat.new.name_exists": "এই নামে একটি চ্যানেল ইতিমধ্যে আছে।",
  "chat.new.reach_bluetooth_chip": "কেবল ব্লুটুথ",
  "chat.new.reach_internet_chip": "ব্লুটুথ + ইন্টারনেট",
  "chat.new.have_link": "আমন্ত্রণ লিঙ্ক দিয়ে যোগ দিন",

  // ---- Chats: join by link ----
  "chat.join.title": "লিঙ্ক দিয়ে যোগ দিন",
  "chat.join.not_airhop": "ওটি Airhop-এর লিঙ্ক নয়।",
  "chat.join.reach_internet":
    "ব্লুটুথ ও ইন্টারনেটের মাধ্যমে সদস্যদের কাছে পৌঁছায়।",
  "chat.join.reach_mesh": "ব্লুটুথের নাগালেই থাকে।",
  "chat.join.contact_card":
    "একটি পরিচিতি কার্ড। তাদের আপনার পরিচিতিতে যোগ করে চ্যাট খোলে।",
  "chat.join.unverified": "সেই লিঙ্কটি যাচাই করা গেল না",
  "chat.join.unverified_body":
    "পরিচিতি কার্ডটি তার নিজের কী-র সঙ্গে মেলে না, তাই এটি যোগ করা হয়নি। তাদের নতুন একটি পাঠাতে বলুন।",
  "chat.join.paste": "ক্লিপবোর্ড থেকে পেস্ট করুন",
  "chat.join.join": "যোগ দিন",
  "chat.join.public_channel":
    "প্রকাশ্য চ্যানেল {name}। কাছের যে কেউ পড়তে পারে।",
  "chat.join.private_channel": "ব্যক্তিগত চ্যানেল {name}। {reach}",
  "chat.join.dm_with": "{name}-এর সঙ্গে ব্যক্তিগত বার্তা।",
  "chat.join.joined_as": "{name} হিসেবে যোগ দিয়েছেন",
  "chat.join.name_clash_body":
    "আপনি ইতিমধ্যে অন্য একটি {name}-এ আছেন। চ্যানেলের নাম কেবল লেবেল, তাই এই আমন্ত্রণ নিজের আলাদা চ্যানেল খুলেছে, আর আপনি যেটিতে ছিলেন সেটি অক্ষত আছে। দুটিরই নাম চ্যানেলের তথ্য থেকে বদলানো যায়।",
  "chat.join.paste_hint":
    "airhop:// দিয়ে শুরু হওয়া একটি আমন্ত্রণ পেস্ট করুন। লিঙ্কে ট্যাপ করলেও চলে; এটি এমন লিঙ্কের জন্য যাতে ট্যাপ করা যায় না।",
  "chat.join.key_note":
    "ব্যক্তিগত চ্যানেলের আমন্ত্রণ কী বহন করে, তাই যোগ দেওয়া তাৎক্ষণিক এবং কারও কাছে কিছু চাইতে হয় না।",
  "chat.join.offline_note":
    "অফলাইনে কাজ করে। লিঙ্কটি এই ডিভাইসেই পড়া হয়, আর নির্মাতা যেভাবে সাজিয়েছেন চ্যানেল ততদূর পৌঁছায়।",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "সেই ঘরটি খোলা গেল না। একটু পরে আবার চেষ্টা করুন।",
  "chat.jump.title": "কোনো জায়গায় যান",
  "chat.jump.saved": "সংরক্ষিত জায়গা",
  "chat.jump.anywhere":
    "যেকোনো জায়গার প্রকাশ্য অবস্থান চ্যানেল খুলুন, আপনি যেখানে নেই সেখানেরও।",
  "chat.jump.geohash_note":
    "এর geohash লিখুন। যাদের অবস্থান সেই ঘরে পড়ে, তারা সবাই এই চ্যানেলটি ভাগ করে নেয়।",
  "chat.jump.teleport_note":
    "আপনাকে দূর থেকে আসা হিসেবে দেখাবে, কাছের কেউ হিসেবে নয়। এটি কেবল ইন্টারনেটের মাধ্যমেই পৌঁছায়।",
  "chat.jump.level_cell": "{level} ঘর",
  "chat.jump.already_here":
    "আপনি ইতিমধ্যেই এখানে আছেন। যান চাপলে আপনার {name} চ্যানেল খুলবে।",
  "chat.jump.open_direction": "আপনার {direction} দিকের ঘরটি খুলুন",
  "chat.jump.open_place": "{name} খুলুন",
  "chat.jump.remove_place": "সংরক্ষিত জায়গা থেকে {name} সরান",
  "chat.jump.go": "যান",
  "chat.jump.how":
    "geohash খুঁজতে: একটি অবস্থান চ্যানেল খুলুন > এর নামে ট্যাপ করুন > সেখান থেকে কপি করুন।",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "সব সদস্যের কাছে পৌঁছানো গেল না। তারা কাছে থাকলে আবার চেষ্টা করুন।",
  "chat.group.you_were_added": "আপনাকে {name}-এ যোগ করা হয়েছে।",
  "chat.group.added_you": "আপনাকে {name}-এ যোগ করেছেন",
  "chat.group.you_were_removed":
    "আপনাকে {name} থেকে সরানো হয়েছে। আপনি এখানে আর পড়তে বা বার্তা পাঠাতে পারবেন না।",
  "chat.group.removed_you": "আপনাকে {name} থেকে সরিয়েছেন",
  "chat.group.add_failed": "তাদের যোগ করা গেল না",
  "chat.group.add_failed_body":
    "কিছুই বদলায়নি। হয় এখন তাদের নাগালে পাওয়া যাচ্ছে না, বা গ্রুপে 16 জন পূর্ণ হয়ে গেছে, বা আপনি এর নির্মাতা নন।",
  "chat.group.remove_failed": "তাদের সরানো গেল না",
  "chat.group.remove_failed_body":
    "কিছুই বদলায়নি। কেবল যিনি গ্রুপটি তৈরি করেছেন তিনিই এতে কারা থাকবে তা বদলাতে পারেন।",
  "chat.group.e2ee":
    "প্রান্ত থেকে প্রান্ত এনক্রিপ্ট করা। কেবল সদস্যরাই বার্তা পড়তে পারে।",
  "chat.group.cap":
    "আপনার বেছে নেওয়া সর্বোচ্চ 16 জন। কোনো আমন্ত্রণ লিঙ্ক নেই, তাই কারও ফরোয়ার্ড করা লিঙ্ক দিয়ে কেউ ঢুকতে পারে না।",
  "chat.group.bluetooth":
    "কেবল ব্লুটুথ। নাগালের বাইরের সদস্যরা ফিরে এলে বার্তা পাবেন।",
  "chat.group.members_label": "সদস্য",
  "chat.group.none_in_range":
    "নাগালে কেউ নেই। গ্রুপ তৈরির সময় সদস্যদের কাছে থাকতে হবে।",
  "chat.group.create_title": "একটি গ্রুপ তৈরি করুন",
  "chat.group.name_placeholder": "গ্রুপের নাম",
  "chat.group.create": "তৈরি করুন",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "স্থানীয় মেশ · কেবল ব্লুটুথ",
  "chat.scope.mesh_desc":
    "ব্লুটুথের নাগালের ডিভাইসে পৌঁছায় (মোটামুটি 10 থেকে 100 মিটার)। ইন্টারনেট লাগে না। স্থানীয় সমন্বয়ের জন্য আদর্শ।",
  "chat.scope.block": "শহরের পাড়া · প্রায় 100 মি",
  "chat.scope.block_desc":
    "পাড়া পর্যায়ের বিস্তার। বার্তা ইন্টারনেটের মাধ্যমে সেতু পেরোয়, যাতে ব্লুটুথের বাইরে অথচ কাছের পিয়াররাও অংশ নিতে পারে।",
  "chat.scope.neighborhood": "আশপাশ · প্রায় 1 কিমি",
  "chat.scope.neighborhood_desc":
    "আশপাশ পর্যায়ের বিস্তার। রিলের সহায়তায়, সরাসরি ব্লুটুথ সংযোগ ছাড়াই গোটা এলাকার পিয়ারদের নাগালে পাওয়া যায়।",
  "chat.scope.city": "শহর · প্রায় 10 কিমি",
  "chat.scope.city_desc":
    "শহরজুড়ে চ্যানেল। গোটা মহানগরের পিয়ারদের কাছে পৌঁছাতে অবস্থানভিত্তিক ইন্টারনেট রিলে ব্যবহার করে।",
  "chat.scope.province": "প্রদেশ বা রাজ্য · প্রায় 100 কিমি",
  "chat.scope.province_desc":
    "প্রদেশ বা রাজ্য পর্যায়ের বিস্তার। কয়েকশো কিলোমিটার আঞ্চলিক নাগালের জন্য ইন্টারনেটে সেতু বাঁধা।",
  "chat.scope.country": "দেশ বা অঞ্চল · প্রায় 1000 কিমি",
  "chat.scope.country_desc":
    "দেশজুড়ে বিস্তার। ওই অঞ্চলের যেকোনো Airhop বা bitchat ব্যবহারকারী যোগ দিয়ে বার্তা পড়তে পারেন।",
  "chat.transport.bluetooth": "কেবল ব্লুটুথ",
  "chat.transport.both": "ব্লুটুথ + ইন্টারনেট",
  "chat.transport.internet": "কেবল ইন্টারনেট",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "কমান্ড /{cmd}: {hint}",
  "chat.cmd.hug_hint": "একটি উষ্ণ আলিঙ্গন পাঠান",
  "chat.cmd.slap_hint": "বড় একটি মাছ দিয়ে চড় মারুন",
  "chat.status.sending": "পাঠানো হচ্ছে…",
  "chat.status.undo_send": "পাঠানো ফেরান",
  "chat.status.undo": "ফেরান",
  "chat.status.sent": "পাঠানো হয়েছে",
  "chat.status.received": "পাওয়া গেছে",
  "chat.status.failed": "ব্যর্থ",
  "chat.status.canceled": "বাতিল",
  "chat.status.waiting": "অপেক্ষায়",
  "chat.status.sending_short": "পাঠানো হচ্ছে",
  "chat.status.receiving": "পাওয়া হচ্ছে",
  "chat.thread.not_available": "এখানে পাওয়া যায় না",
  "chat.thread.private_channel": "ব্যক্তিগত চ্যানেল",
  "chat.thread.location_channel": "অবস্থান চ্যানেল",
  "chat.thread.public_channel": "প্রকাশ্য চ্যানেল",
  "chat.thread.notices": "এই চ্যানেলের নোটিশ",
  "chat.thread.invite": "এই চ্যানেলে কাউকে আমন্ত্রণ জানান",
  "chat.thread.not_in_range":
    "ব্লুটুথের নাগালে নেই। ইন্টারনেটে পৌঁছে দেওয়া হচ্ছে।",
  "chat.thread.not_nearby":
    "কাছে নেই। তারা নাগালে ফিরলে বা অনলাইনে এলে আমরা পৌঁছে দেব।",
  "chat.thread.no_keys":
    "তাদের বার্তা পাঠাতে হলে আপনাকে ব্লুটুথের নাগালে থাকতে হবে, বা তাদের কোড স্ক্যান করতে হবে।",
  "chat.geo.card_received":
    "{name} তাদের পরিচিতি ভাগ করেছেন। আপনাদের কেউ জায়গা বদলালেও কথা চালিয়ে যেতে আপনারটিও ফেরত ভাগ করুন।",
  "chat.geo.exchange_complete":
    "পরিচিতি বিনিময় হয়েছে। এখন আপনারা যেকোনো জায়গা থেকে একে অপরের নাগাল পাবেন।",
  "chat.geo.keep_person": "এই ব্যক্তিকে রাখুন",
  "chat.geo.keep_person_desc":
    "আপনাদের কেউ জায়গা বদলালেও কথা চালিয়ে যেতে আপনার পরিচিতি ভাগ করুন। তারা আপনার স্থায়ী পরিচয় জানতে পারবে।",
  "chat.geo.card_sent": "ভাগ করা হয়েছে · তাদেরটির অপেক্ষায়",
  "chat.thread.left_cell":
    "আপনি এই এলাকা ছেড়ে এসেছেন, তাই তারা এখানে আপনার নাগাল পাবে না। যেকোনো জায়গায় কথা চালাতে কোড বিনিময় করুন।",
  "chat.thread.no_route":
    "এখন তাদের নাগাল পাওয়া যাচ্ছে না। পথ পাওয়া গেলে বার্তাটি চলে যাবে।",
  "chat.thread.empty": "এখনো কোনো বার্তা নেই",
  "chat.thread.empty_desc": "একটি এনক্রিপ্ট করা কথোপকথন শুরু করুন।",
  "chat.thread.jump_latest": "সবশেষ বার্তায় যান",
  "chat.thread.back_to_members": "সদস্যদের কাছে ফিরুন",
  "chat.thread.nostr_key": "Nostr পাবলিক কী",
  "chat.thread.in_range": "নাগালের মধ্যে",
  "chat.voice.not_recorded": "ভয়েস নোট রেকর্ড হয়নি",
  "chat.thread.message": "বার্তা",
  "chat.thread.message_placeholder": "বার্তা…",
  "chat.thread.length_full": "বার্তা পূর্ণ",
  "chat.thread.waiting_for": "{name} ফেরার অপেক্ষায় · {percent}%",
  "chat.thread.peer": "পিয়ার",
  "chat.thread.cancel_transfer": "{name} বাতিল করুন",
  "chat.thread.queued_more": "আরও {count}টি পাঠানোর অপেক্ষায়",
  "chat.thread.across_bridge": "সেতুর ওপারে {count}",
  "chat.thread.bridged": "সেতু পেরিয়েছে",
  "chat.thread.invite_body":
    "Airhop-এ {channel}-এ আমার সঙ্গে যোগ দিন — অফলাইন-প্রথম, ব্যক্তিগত মেশ বার্তা।",
  "chat.thread.go_back_unread": "ফিরে যান, {count}টি অপঠিত",
  "chat.thread.view_info": "{name}-এর তথ্য দেখুন",
  "chat.thread.notices_new": "এই চ্যানেলের নোটিশ, {count}টি নতুন",
  "chat.thread.say_something": "{channel}-এ কিছু বলুন।",
  "chat.thread.jump_latest_new": "সবশেষ বার্তায় যান, {count}টি নতুন",
  "chat.thread.unconfirmed_since": "{date} থেকে পৌঁছানো নিশ্চিত হয়নি",
  "chat.thread.no_reach": "কাছে কোনো পিয়ার নেই · এখনো কেউ এটি পায়নি",
  "chat.thread.channel_needs_internet":
    "ইন্টারনেট বন্ধ · এই চ্যানেল কেবল ব্লুটুথের নাগালের লোকদের কাছে পৌঁছায়",
  "chat.thread.cell_needs_internet":
    "ইন্টারনেট বন্ধ · এই ঘরটিতে কেবল ইন্টারনেটেই পৌঁছানো যায়",
  "chat.thread.geo_dm_needs_internet":
    "ইন্টারনেট বন্ধ · এই কথোপকথন কেবল ইন্টারনেটেই বাহিত হয়",
  "chat.thread.via_gateway":
    "ইন্টারনেট বন্ধ · কাছের একটি ডিভাইস এটি আপনার হয়ে অনলাইনে নিয়ে যাচ্ছে",
  "chat.thread.group_queued":
    "এই গ্রুপের কেউ এখনো কাছে নেই। তারা এলে এটি তাদের কাছে পৌঁছাবে।",
  "chat.thread.no_group_key": "আপনি আর এই গ্রুপে নেই, তাই এটি পাঠানো যাবে না",
  "chat.thread.no_reach_offline":
    "ইন্টারনেট বন্ধ আর কাছে কোনো পিয়ারও নেই · এখনো কেউ এটি পায়নি",
  "chat.thread.mention": "{name}-কে উল্লেখ করুন",
  "chat.thread.someone_talking": "{hold}। {name} কথা বলছেন।",
  "chat.thread.attach_note":
    "ফাইল কেবল ব্লুটুথের নাগালেই যায়। লেখা ও পেমেন্ট ইন্টারনেটের পরিচিতিদের কাছে পৌঁছায়; সংযুক্তি নয়।",
  "chat.thread.message_peer": "{name}-কে বার্তা পাঠান",
  "chat.thread.send": "বার্তা পাঠান",
  "chat.thread.group": "গ্রুপ",
  "chat.bridge.nearby_only": "কেবল কাছে: এই বার্তাটি মেশ সেতুর বাইরে রাখুন",
  "chat.bridge.nearby_label": "কেবল কাছে · ব্লুটুথেই থাকে",
  "chat.bridge.bridging_label":
    "কাছের এলাকায় সেতু বাঁধছে · কেবল কাছের জন্য ট্যাপ করুন",
  "chat.screenshot.you_took": "আপনি স্ক্রিনশট নিয়েছেন",
  "chat.screenshot.you_took_private":
    "আপনি স্ক্রিনশট নিয়েছেন · কাউকে জানানো হয়নি",
  "chat.screenshot.heads_up": "খেয়াল রাখুন",
  "chat.screenshot.notice": "* {name} স্ক্রিনশট নিয়েছেন *",
  "chat.screenshot.notified_dm":
    "আপনি এই কথোপকথনের স্ক্রিনশট নিয়েছেন বলে {name}-কে জানানো হয়েছে।",
  "chat.screenshot.notified":
    "আপনি স্ক্রিনশট নিয়েছেন বলে এই চ্যানেলের সবাইকে জানানো হয়েছে।",
  "chat.screenshot.not_notified":
    "কাউকে জানানো হয়নি। এই চ্যানেলটি প্রকাশ্য, তাই স্ক্রিনশটের ঘোষণা বরং লিখে রাখত যে আপনি এখানে ছিলেন।",
  "chat.thread.error": "ত্রুটি",
  "chat.thread.go_back": "ফিরে যান",
  "chat.bubble.via_bridge": "মেশ সেতুর মাধ্যমে",
  "chat.bubble.view_profile": "{name}-এর প্রোফাইল দেখুন",
  "chat.bubble.forwarded": "ফরোয়ার্ড করা",
  "chat.bubble.attachment": "সংযুক্তি",
  "chat.bubble.a11y": "{sender}: {body}। আরও বিকল্পের জন্য চেপে ধরুন।",
  "chat.bubble.failed_retry": "পাঠানো যায়নি। আবার চেষ্টা করতে ট্যাপ করুন।",

  // ---- Chats: message actions and info ----
  "chat.info.title": "বার্তার তথ্য",
  "chat.info.delivered_to": "{name}-এর কাছে পৌঁছেছে",
  "chat.info.read_by": "{name} পড়েছেন",
  "chat.info.group_reach_desc": "এখন নাগালে, পৌঁছানোর নিশ্চয়তা নয়",
  "chat.info.group_alone": "আর কোনো সদস্য নেই",
  "chat.info.today_at": "আজ {time}",
  "chat.info.sending": "পাঠানো হচ্ছে…",
  "chat.info.failed": "পাঠানো যায়নি",
  "chat.info.courier": "এক বন্ধু বয়ে নিয়েছে",
  "chat.info.sent": "পাঠানো হয়েছে",
  "chat.info.queued": "পাঠানোর অপেক্ষায়",
  "chat.info.waiting": "অপেক্ষায়…",
  "chat.action.info": "বার্তার তথ্য",
  "chat.action.save_photos": "ছবিতে সংরক্ষণ করুন",
  "chat.action.save_copy": "একটি অনুলিপি সংরক্ষণ করুন",
  "chat.action.forward": "ফরোয়ার্ড",
  "chat.action.select": "নির্বাচন করুন",
  "chat.select.cancel": "নির্বাচন বাতিল করুন",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "ক্যামেরা",
  "chat.attach.camera_desc": "ছবি বা ভিডিও তুলুন",
  "chat.attach.library": "ছবির লাইব্রেরি",
  "chat.attach.library_desc": "আপনার লাইব্রেরি থেকে বাছুন",
  "chat.attach.document": "নথি",
  "chat.attach.document_desc": "যেকোনো ফাইল বা PDF পাঠান",
  "chat.attach.voice": "ভয়েস নোট",
  "chat.attach.voice_desc": "একটি ভয়েস বার্তা রেকর্ড করে পাঠান",
  "chat.attach.ecash": "ecash পাঠান",
  "chat.attach.ecash_desc": "আপনার ওয়ালেট থেকে Cashu sat পাঠান",
  "chat.attach.location": "অবস্থান",
  "chat.attach.location_desc": "আপনি এখন কোথায় আছেন তা পাঠান",
  "chat.attach.title": "সংযুক্ত করুন",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "একটি অবস্থান ভাগ করেছেন",
  "chat.location.received_summary": "তাদের অবস্থান ভাগ করেছেন",
  "chat.location.title": "অবস্থান",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago} আগে নেওয়া",
  "chat.location.open_maps": "মানচিত্রে খুলুন",
  "chat.location.no_forward": "অবস্থান ফরোয়ার্ড করা যায় না",
  "chat.location.no_forward_body":
    "একটি অবস্থান একজনকেই পাঠানো হয়। অন্য কারও কাছে থাকুক চাইলে বরং নিজের অবস্থান ভাগ করুন।",
  "chat.location.no_fix": "এটি কত দূরে দেখতে অবস্থানের অনুমতি দিন",
  "chat.location.send_title": "আপনার অবস্থান পাঠান",
  "chat.location.send_body":
    "{name} একটি বিন্দু দেখবেন: আপনি এখন যেখানে আছেন। এটি হালনাগাদ হতে থাকে না।",
  "chat.location.send": "অবস্থান পাঠান",
  "chat.location.finding": "আপনার অবস্থান খোঁজা হচ্ছে…",
  "chat.location.no_location": "আপনার অবস্থান পাওয়া গেল না",
  "chat.location.no_location_body":
    "অবস্থানের অনুমতি দিন এবং অবস্থান পরিষেবা চালু আছে কিনা নিশ্চিত করে আবার চেষ্টা করুন।",
  "chat.location.not_delivered": "আপনার অবস্থান পাঠানো গেল না",
  "chat.location.not_delivered_body":
    "অবস্থান কেবল তখনই পাঠানোর মতো যখন তা এখনকার, তাই এটি পরের জন্য সারিতে রাখা হয় না। {name}-এর নাগাল পেলে আবার চেষ্টা করুন।",
  "chat.location.direction.n": "উত্তর",
  "chat.location.direction.ne": "উত্তর-পূর্ব",
  "chat.location.direction.e": "পূর্ব",
  "chat.location.direction.se": "দক্ষিণ-পূর্ব",
  "chat.location.direction.s": "দক্ষিণ",
  "chat.location.direction.sw": "দক্ষিণ-পশ্চিম",
  "chat.location.direction.w": "পশ্চিম",
  "chat.location.direction.nw": "উত্তর-পশ্চিম",
  "chat.attach.send_anyway": "তবুও পাঠান",
  "chat.attach.bitchat_too_big": "এটি না-ও পৌঁছাতে পারে",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat ব্যবহার করছেন, যা বড় ফাইলে মাঝপথে হাল ছেড়ে দেয়। প্রায় 350 KiB-এর নিচে নির্ভরযোগ্য। Airhop-এর পরিচিতিকে পাঠালে এমন কোনো সীমা নেই।",
  "chat.attach.bitchat_unopenable": "তারা হয়তো এটি খুলতে পারবেন না",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat ব্যবহার করছেন, যা ছবি ও ভয়েস নোট দেখায় কিন্তু বাকি সব এমন ফাইল হিসেবে তালিকাভুক্ত করে যা সে খুলতে পারে না। এটি পৌঁছাবে, কেবল তারা হয়তো দেখতে পারবেন না।",
  "chat.attach.file": "একটি ফাইল সংযুক্ত করুন",
  "chat.attach.unavailable": "এখানে সংযুক্তি পাওয়া যায় না",
  "chat.attach.not_sent": "সংযুক্তি পাঠানো হয়নি",
  "chat.attach.read_failed":
    "সেই ফাইলটি পড়তে গিয়ে কিছু একটা গোলমাল হয়েছে। অন্যটি চেষ্টা করুন।",
  "chat.attach.caption": "একটি বিবরণ যোগ করুন…",
  "chat.attach.send": "সংযুক্তি পাঠান",
  "chat.attach.generic": "সংযুক্তি",
  "chat.media.view_full": "ছবিটি পূর্ণ পর্দায় দেখুন",
  "chat.media.gone_photo": "ছবিটি এই ডিভাইসে নেই",
  "chat.media.gone_video": "ভিডিওটি এই ডিভাইসে নেই",
  "chat.media.gone_voice": "ভয়েস নোটটি এই ডিভাইসে নেই",
  "chat.media.gone_file": "ফাইলটি এই ডিভাইসে নেই",
  "chat.media.gone_note": "7 দিন পরে বা ক্যাশ খালি করার সময় সরানো হয়েছে",
  "chat.media.ask_resend": "আবার জিজ্ঞেস করুন",
  "chat.media.resend_draft": "সেই {kind}টি কি আবার পাঠাতে পারবেন?",
  "chat.media.kind_photo": "ছবি",
  "chat.media.kind_video": "ভিডিও",
  "chat.media.kind_voice": "ভয়েস নোট",
  "chat.media.kind_file": "ফাইল",
  "chat.media.pause_voice": "ভয়েস নোট থামান",
  "chat.media.play_voice": "ভয়েস নোট চালান",
  "chat.media.voice_position": "ভয়েস নোটে অবস্থান",
  "chat.media.voice_scrub": "সেই জায়গায় যেতে দাগগুলোর ওপর ট্যাপ করুন",
  "chat.media.image": "ছবি",
  "chat.media.tap_load_photo": "ছবি লোড করতে ট্যাপ করুন",
  "chat.media.open_document": "{name} খুলুন",
  "chat.media.document": "নথি",
  "chat.media.tap_load_video": "ভিডিও লোড করতে ট্যাপ করুন",
  "chat.media.video": "ভিডিও",
  "chat.media.photo": "ছবি",
  "chat.media.close_photo": "ছবি বন্ধ করুন",
  "chat.media.save_photo": "ছবিটি আপনার ছবিতে সংরক্ষণ করুন",
  "chat.media.share_photo": "ছবি ভাগ করুন",
  "chat.media.saved_videos": "আপনার ভিডিওতে সংরক্ষিত",
  "chat.media.saved_photos": "আপনার ছবিতে সংরক্ষিত",
  "chat.media.not_saved": "সংরক্ষিত হয়নি",
  "chat.media.cant_open": "ফাইল খোলা যাচ্ছে না",
  "chat.media.no_app": "এই ফাইলটি খুলতে বা ভাগ করতে এই ডিভাইসে কোনো অ্যাপ নেই।",
  "chat.media.open_failed":
    "ফাইলটি খোলা গেল না। এটি হয়তো ক্যাশ থেকে মুছে গেছে।",
  "media.blocked.nostr_only":
    "আপনি এই ব্যক্তিকে কেবল একটি রিলের মাধ্যমে চেনেন। কেবল লেখাই পাওয়া যায়। ছবি, ফাইল ও ভয়েস নোটে ব্লুটুথ লাগে।",
  "media.blocked.private_channel":
    "সম্প্রচার সংযুক্তি সই করা হয় কিন্তু এনক্রিপ্ট করা হয় না, তাই ব্যক্তিগত চ্যানেলে পাঠালে সেটি খোলা অবস্থায় পড়ে থাকত, অথচ এখানকার লেখা এনক্রিপ্ট করাই থাকে।",
  "media.blocked.private_group":
    "সম্প্রচার সংযুক্তি সই করা হয় কিন্তু এনক্রিপ্ট করা হয় না, তাই ব্যক্তিগত গ্রুপে পাঠালে সেটি খোলা অবস্থায় পড়ে থাকত, অথচ এখানকার লেখা এনক্রিপ্ট করাই থাকে।",
  "media.blocked.location_channel":
    "অবস্থান চ্যানেল ইন্টারনেটে মানুষের কাছে পৌঁছায়, আর ছবি, ফাইল ও ভয়েস নোট যায় ব্লুটুথে, তাই সেগুলো কখনোই পৌঁছাত না।",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "এখানে ভয়েস নোট পাওয়া যায় না",
  "chat.voice.hold_live": "সরাসরি কথা বলতে ধরে রাখুন",
  "chat.voice.hold_record": "ভয়েস নোট রেকর্ড করতে ধরে রাখুন",
  "chat.voice.cancel_recording": "রেকর্ডিং বাতিল করুন",
  "chat.voice.slide_cancel": "বাতিল করতে সরান",
  "chat.voice.release_cancel": "বাতিল করতে ছেড়ে দিন",
  "chat.voice.a11y_toggle": "কথা বলা শুরু বা বন্ধ করতে দুবার ট্যাপ করুন।",
  "chat.voice.limit_reached": "দুই মিনিটের সীমা ছুঁয়েছে, পাঠাতে ছেড়ে দিন",
  "chat.voice.limit_sent": "দুই মিনিটের সীমা ছুঁয়েছে, নোট পাঠানো হয়েছে",
  "chat.voice.stop_send": "রেকর্ডিং থামিয়ে পাঠান",
  "chat.voice.lift_lock": "হাত ছাড়া রেকর্ড করতে উপরে সরান",
  "chat.voice.live_speaking": "{name} কথা বলছেন",
  "voice.unavailable": "সরাসরি কথা বলা যাচ্ছে না",
  "voice.recording_stopped": "রেকর্ডিং থেমেছে",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "ক্যামেরার অনুমতি",
  "chat.perm.camera_purpose": "পাঠানোর জন্য একটি ছবি তুলতে",
  "chat.perm.photo_label": "ছবির অনুমতি",
  "chat.perm.photo_purpose": "পাঠানোর জন্য একটি ছবি বা ভিডিও বাছতে",
  "chat.perm.photo_save_purpose": "এটি আপনার ছবিতে সংরক্ষণ করতে",
  "chat.perm.mic_label": "মাইক্রোফোনের অনুমতি",
  "chat.perm.mic_live_purpose": "কাছের লোকদের সঙ্গে কথা বলতে",
  "chat.perm.mic_note_purpose": "একটি ভয়েস নোট রেকর্ড করতে",
  "chat.perm.recording_stopped": "রেকর্ডিং থেমেছে",
  "chat.perm.record_failed":
    "রেকর্ডিং শুরু করা গেল না। মাইক্রোফোনের অনুমতি দেখুন।",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "নেওয়া হয়েছে",
  "chat.ecash.reclaimed": "ফিরিয়ে নেওয়া হয়েছে",
  "chat.ecash.claiming": "নেওয়া হচ্ছে…",
  "chat.ecash.claim": "নিন",
  "chat.ecash.claim_amount": "{amount} {unit} নিন",
  "chat.ecash.already_claimed": "ইতিমধ্যে নেওয়া হয়েছে",
  "chat.ecash.already_claimed_body":
    "এই টোকেনের প্রতিটি প্রমাণ ইতিমধ্যেই আপনার ওয়ালেটে আছে, তাই নতুন কিছু যোগ হয়নি।",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "যথাসাধ্য পৌঁছে দিতে মেশের হাতে তুলে দেওয়া হয়েছে",
  "chat.info.queued_desc": "তাদের কাছে পথ না পাওয়া পর্যন্ত এই ফোনেই রাখা আছে",
  "chat.info.reclaimed": "ফিরিয়ে নেওয়া হয়েছে",
  "chat.info.reclaimed_desc":
    "আপনি এই পেমেন্টটি নিজের ওয়ালেটে ফিরিয়ে নিয়েছেন, তাই এটি পৌঁছাবে না",
  "chat.info.about": "সম্পর্কে",
  "chat.info.group_desc":
    "একটি ব্যক্তিগত গ্রুপ। কেবল নির্মাতার যোগ করা সদস্যরাই পড়তে পারে, আর এটি ব্লুটুথেই থাকে।",
  "chat.info.teleported_desc":
    "এই geohash ঘরের জন্য একটি প্রকাশ্য অবস্থান চ্যানেল। ঘরের যে কেউ, Airhop বা bitchat-এ, ইন্টারনেটে এটি ভাগ করে নেয়। আপনি দূর থেকে এসেছেন, সশরীরে এখানে নেই।",
  "chat.info.custom_desc":
    "একটি নিজস্ব চ্যানেল। নাম জানা যে কেউ যেকোনো Airhop বা bitchat ডিভাইস থেকে যোগ দিতে পারে।",
  "chat.info.private_e2ee": "ব্যক্তিগত · প্রান্ত থেকে প্রান্ত এনক্রিপ্ট করা",
  "chat.info.public_plain": "প্রকাশ্য · এনক্রিপ্ট করা নয়",
  "chat.info.group_privacy":
    "কেবল নিচে দেখানো সদস্যরাই এই গ্রুপটি পড়তে পারে। বার্তা ব্লুটুথেই থাকে, তাই নাগালের বাইরের সদস্যরা ফিরে এলে সেগুলো পাবেন।",
  "chat.info.teleport_privacy":
    "আপনি দূর থেকে যে জায়গায় এসেছেন। এটি ইন্টারনেটে এই ঘরের সবার কাছে পৌঁছায়, ব্লুটুথের নাগালের কারও কাছে নয়।",
  "chat.info.location_off_privacy":
    "অবস্থান বন্ধ, তাই এই চ্যানেল কেবল ব্লুটুথে কাছের ডিভাইসে পৌঁছায়। এর এলাকার ঘরে ইন্টারনেটে পৌঁছাতে অবস্থান চালু করুন।",
  "chat.info.invite_privacy":
    "কেবল আপনি লিঙ্ক দিয়ে যাদের আমন্ত্রণ জানান তারাই পড়তে পারে। বাকি সবার কাছে এটি লুকানো থাকে, কাছের পিয়ারদের কাছেও।",
  "chat.info.public_privacy":
    "যে কেউ যোগ দিলে প্রতিটি বার্তা পড়তে পারে। ব্যক্তিগত কথার জন্য ব্যক্তিগত বার্তা ব্যবহার করুন; সেগুলো প্রান্ত থেকে প্রান্ত এনক্রিপ্ট করা।",
  "chat.info.remove_member": "সদস্য সরান",
  "chat.info.remove_member_body":
    "{name}-কে গ্রুপ থেকে সরাবেন? গ্রুপের কী বদলে যাবে, তাই তারা আর নতুন বার্তা পড়তে পারবে না।",
  "chat.info.message_member": "{name}-কে বার্তা পাঠান",
  "chat.info.remove_member_a11y": "{name}-কে সরান",
  "chat.info.no_addable":
    "যোগ করার মতো নাগালে কোনো পিয়ার নেই। সদস্যদের কাছে থাকতে হবে।",
  "chat.info.add_count": "{count} জন যোগ করুন",
  "chat.info.teleported_tag": "{level}  ·  দূর থেকে",
  "chat.info.active": "সক্রিয়",
  "chat.info.members": "সদস্য",
  "chat.info.bookmark": "এই জায়গাটি সংরক্ষণ করুন",
  "chat.info.remove_bookmark": "সংরক্ষণ সরান",
  "chat.info.default_notice":
    "ডিফল্ট চ্যানেল ছাড়া যায় না। সেগুলো Airhop-এর মেশ প্রোটোকলের অংশ।",
  "chat.info.custom_channel": "নিজস্ব চ্যানেল",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "geohash কপি করুন",
  "chat.info.relays": "রিলে",
  "chat.info.show_relays": "এই চ্যানেল বহনকারী রিলেগুলো দেখান",
  "chat.info.relay_custom": "নিজস্ব",
  "chat.info.relays_none": "কোনোটিই নয়। এই ঘরটি এখন কেবল ব্লুটুথ।",
  "chat.info.search_members": "সদস্য খুঁজুন",
  "chat.info.search_members_placeholder": "সদস্য খুঁজুন…",
  "chat.info.teleported": "দূর থেকে",
  "chat.info.creator": "নির্মাতা",
  "chat.info.no_matches": "কোনো মিল নেই",
  "chat.info.no_one_here": "এখানে এখনো কেউ নেই",
  "chat.info.add_members": "সদস্য যোগ করুন",
  "chat.info.add_selected": "নির্বাচিত সদস্যদের যোগ করুন",
  "chat.info.add": "যোগ করুন",
  "chat.info.leave_group": "গ্রুপ ছাড়ুন",
  "chat.info.leave_channel": "চ্যানেল ছাড়ুন",
  "chat.info.leave": "ছাড়ুন",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} থেকে কথা হচ্ছে",
  "chat.contact.verified_since": "{date} থেকে যাচাই করা",
  "chat.contact.anonymous": "নামহীন",
  "chat.contact.anonymous_desc":
    "যাচাই করার মতো স্থায়ী পরিচয়হীন একটি geohash ছদ্মনাম",
  "chat.contact.verified": "যাচাই করা",
  "chat.contact.verified_desc": "আপনি তাদের QR কোড স্ক্যান করেছেন",
  "chat.contact.verified_desc_compared": "আপনি তাদের সঙ্গে কোড মিলিয়েছেন",
  "chat.contact.not_verified": "যাচাই করা হয়নি",
  "chat.contact.not_verified_desc":
    "সত্যিই তারা কিনা নিশ্চিত হতে তাদের কোড স্ক্যান করুন, বা ফোনে একটি কোড মিলিয়ে নিন",
  "chat.contact.e2ee": "প্রান্ত থেকে প্রান্ত এনক্রিপ্ট করা",
  "chat.contact.e2ee_nostr": "NIP-17 অনুযায়ী মোড়ানো, তাই রিলে পড়তে পারে না",
  "chat.contact.e2ee_mesh":
    "Noise XX, আর Airhop ডিভাইসগুলোর মধ্যে Double Ratchet",
  "chat.contact.copy_nostr": "Nostr পাবলিক কী কপি করুন",
  "chat.contact.nostr_key": "Nostr পাবলিক কী",
  "chat.contact.cell_key_note":
    "এই কী-টি আপনারা যে এলাকায় দেখা করেছেন তার। আপনাদের কেউ সরলে এটি বদলে যায়, আর তার সঙ্গে কথাও থেমে যায়। যেকোনো জায়গায় কথা চালাতে পরিচিতি বিনিময় করুন।",
  "chat.contact.peer_name": "পিয়ারের নাম",
  "chat.contact.peer_id": "পিয়ার আইডি",
  "chat.contact.rename": "নাম বদলান",
  "chat.contact.rename_needs_contact":
    "যাদের কী আপনার কাছে আছে তাদের নাম বদলাতে পারেন। আগে পরিচিতি কার্ড বিনিময় করুন, তারপর এটি কেবল আপনার দেখা একটি নাম হবে।",
  "chat.contact.rename_needs_keys":
    "এই পরিচিতির জন্য এখনো কোনো কী নেই। তাদের বার্তা পাঠান, বা তাদের কোড স্ক্যান করুন, তারপর কেবল আপনার দেখা একটি নাম দিতে পারবেন।",
  "chat.contact.renamed_by_you": "আপনার দেওয়া নাম",
  "chat.contact.copy_peer_id": "পিয়ার আইডি কপি করুন",
  "chat.contact.verify": "পরিচিতি যাচাই করুন",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "নোটিশ",
  "chat.notices.post_area": "এই এলাকায় একটি নোটিশ দিন",
  "chat.notices.post_mesh": "মেশে একটি নোটিশ দিন",
  "chat.notices.mark_urgent": "জরুরি হিসেবে চিহ্নিত করুন",
  "chat.notices.post": "নোটিশ দিন",
  "chat.notices.post_short": "দিন",
  "chat.notices.delete": "নোটিশ মুছুন",
  "chat.notices.just_now": "এইমাত্র",
  "chat.notices.fades_soon": "শিগগিরই মিলিয়ে যাবে",
  "chat.notices.1_day": "1 দিন",
  "chat.notices.3_days": "3 দিন",
  "chat.notices.7_days": "7 দিন",
  "chat.notices.fading": "মিলিয়ে যাচ্ছে",
  "chat.notices.fades_in_hours": "{count} ঘণ্টায় মিলিয়ে যাবে",
  "chat.notices.fades_in_days": "{count} দিনে মিলিয়ে যাবে",
  "chat.notices.scope_geo": "ভৌগোলিক",
  "chat.notices.scope_mesh": "মেশ",
  "chat.notices.urgent_short": "জরুরি",
  "chat.notices.permanent_warning":
    "কখনো মিলিয়ে যায় না। প্রকাশ্য এবং এই এলাকার সঙ্গে বাঁধা, আর আপনি এটি ফিরিয়েও নিতে পারবেন না।",
  "chat.notices.none":
    "এখনো কোনো নোটিশ নেই। একটি দিন যাতে এটি অন্যদের জন্য এখানে থাকে।",

  // ---- Chats: search results ----
  "chat.search.photos": "ছবি",
  "chat.search.videos": "ভিডিও",
  "chat.search.audio": "অডিও",
  "chat.search.documents": "নথি",
  "chat.search.links": "লিঙ্ক",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "{filter} দিয়ে ছাঁকুন",
  "chat.search.no_matches": "“{query}”-এর সঙ্গে মেলে এমন কোনো {filter} নেই",
  "chat.search.no_media": "এখনো কোনো {filter} নেই",
  "chat.search.result_a11y": "{chat}, {sender}-এর কাছ থেকে {kind}",
  "chat.search.you": "আপনি",
  "chat.search.section_chats": "চ্যাট",
  "chat.search.section_messages": "বার্তা",
  "chat.search.section_notices": "নোটিশ",
  "chat.search.hint": "বার্তা ও চ্যাটে খুঁজুন, বা উপরে একটি ছাঁকনি বাছুন।",
  "chat.search.no_results": "“{query}”-এর কোনো ফল নেই",
  "chat.search.open_chat": "{name} খুলুন",
  "chat.search.message_a11y": "{chat}, {sender}-এর কাছ থেকে বার্তা: {snippet}",
  "chat.search.notice_a11y": "{chat}-এ {author}-এর নোটিশ: {snippet}",
  "chat.search.urgent": "জরুরি ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "এই তালিকায় {count}টি আছে। খালি করলে সেগুলো কেবল এখান থেকেই সরে, আর বার্তাগুলো নিজেদের কথোপকথনে অপঠিতই থাকে। সব পঠিত চিহ্নিত করলে দুটোই পরিষ্কার হয়।",
  "chat.notif.mark_all_read": "সব পঠিত চিহ্নিত করুন",
  "chat.notif.clear_list": "তালিকা খালি করুন",
  "chat.notif.clear_all_a11y": "সব {count}টি বিজ্ঞপ্তি খালি করুন",
  "chat.notif.title": "বিজ্ঞপ্তি",
  "chat.notif.clear_short": "খালি করুন",
  "chat.notif.close": "বিজ্ঞপ্তি বন্ধ করুন",
  "chat.notif.none": "এখনো কোনো বিজ্ঞপ্তি নেই",
  "chat.notif.none_desc":
    "আপনার চ্যানেল ও চ্যাটের বার্তা, উল্লেখ ও নোটিশ এখানে দেখা যাবে।",
  "chat.notif.new": "নতুন",
  "chat.notif.notice_in": "{channel}-এ নোটিশ",

  // ---- Chats: forward ----
  "chat.forward.title": "যাকে ফরোয়ার্ড করবেন…",
  "chat.forward.to": "{name}-কে ফরোয়ার্ড করুন",
  "chat.forward.cant_send_here": "এখানে ফরোয়ার্ড করা যায় না",
  "chat.forward.cant_send_to": "{name}-কে ফরোয়ার্ড করা যায় না",
  "chat.forward.channels": "চ্যানেল",
  "chat.forward.groups": "গ্রুপ",
  "chat.forward.locations": "অবস্থান",
  "chat.forward.dms": "ব্যক্তিগত বার্তা",
  "chat.forward.none": "এখনো অন্য কোনো চ্যাট নেই",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "মেশ চালু হচ্ছে…",
  "mesh.banner.no_bluetooth": "এই ডিভাইসে ব্লুটুথ নেই · কেবল ইন্টারনেট",
  "mesh.banner.bluetooth_off": "ব্লুটুথ বন্ধ · মেশ পাওয়া যাচ্ছে না",
  "mesh.banner.permission_needed": "ব্লুটুথের অনুমতি দরকার",
  "mesh.banner.blocked": "ব্লুটুথ আটকানো · সেটিংসে অনুমতি দিন",
  "mesh.banner.location_permission": "পিয়ার খুঁজতে অবস্থান দরকার",
  "mesh.banner.advertising_unsupported":
    "এই ফোন অন্যদের দেখতে পারে কিন্তু নিজে ধরা পড়ে না",
  "mesh.banner.location_off_android":
    "অবস্থান বন্ধ · পিয়ার খুঁজতে Android-এর এটি দরকার",
  "mesh.banner.paused": "মেশ থেমে আছে · আপনি দূরে",
  "mesh.banner.location_off": "অবস্থান বন্ধ · অবস্থান চ্যানেল পাওয়া যাচ্ছে না",
  "mesh.banner.battery_saver": "ব্যাটারি সাশ্রয় · কম ঘন ঘন খোঁজা হচ্ছে",
  "mesh.banner.wipe_incomplete":
    "মোছা অসম্পূর্ণ · কিছু তথ্য থেকে যেতে পারে, আবার খুললে ফের চেষ্টা হবে",
  "mesh.banner.wifi_off": "ওয়াই-ফাই বন্ধ · বড় ফাইল ধীরে যায়",
  "mesh.banner.clock_skew":
    "এই ফোনের ঘড়ি ভুল · তারিখ ও সময় স্বয়ংক্রিয় করুন",
  "mesh.banner.internet_off": "ইন্টারনেট বন্ধ · কেবল ব্লুটুথ",
  "mesh.banner.relaying": "কাছে কোনো পিয়ার নেই · Nostr দিয়ে পাঠানো হচ্ছে",
  "mesh.banner.tor": "Tor চালু · ইন্টারনেটের যাতায়াত ঘুরিয়ে দেওয়া হচ্ছে",
  "mesh.banner.tor_starting": "Tor চালু হচ্ছে · সংযোগ হচ্ছে",
  "mesh.banner.tor_blocked": "Tor সংযুক্ত হতে পারেনি · মেশ তবুও চলছে",
  "mesh.banner.gateway":
    "ইন্টারনেট গেটওয়ে চালু · কাছের পিয়ারদের পার করা হচ্ছে",
  "mesh.banner.bridge": "মেশ সেতু চালু · প্রকাশ্য চ্যাট যুক্ত",
  "mesh.banner.background_limits": "{brand} পেছনে মেশ থামিয়ে দিতে পারে",
  "mesh.banner.bridge_across": "মেশ সেতু চালু · সেতুর ওপারে {count}",
  "mesh.banner.action.turn_on": "চালু করুন",
  "mesh.banner.action.allow": "অনুমতি দিন",
  "mesh.banner.action.resume": "চালান",
  "mesh.banner.action.fix": "ঠিক করুন",
  "mesh.banner.hint.resume": "ব্লুটুথের সম্প্রচার ও খোঁজা আবার চালু করে",
  "mesh.banner.hint.enable_bluetooth": "Android-কে ব্লুটুথ চালু করতে বলে",
  "mesh.banner.hint.location_settings": "সিস্টেমের অবস্থান সেটিংস খোলে",
  "mesh.banner.hint.app_settings": "সিস্টেম সেটিংসে Airhop-এর অনুমতিগুলো খোলে",
  "mesh.banner.hint.battery_settings":
    "এই ফোনের পটভূমি কার্যকলাপের সেটিংস খোলে",
  "mesh.banner.dismiss": "সরান: {label}",
  "mesh.banner.hint.dismiss": "এই নোটটি স্থায়ীভাবে লুকায়",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "কাছের পিয়ার খোঁজা হচ্ছে…",
  "mesh.radar.starting": "মেশ চালু হচ্ছে…",
  "mesh.radar.no_bluetooth": "এই ডিভাইসে ব্লুটুথ নেই",
  "mesh.radar.bluetooth_off": "ব্লুটুথ বন্ধ · খোঁজা হচ্ছে না",
  "mesh.radar.permission_needed": "ব্লুটুথের অনুমতি দরকার",
  "mesh.radar.blocked": "ব্লুটুথ আটকানো",
  "mesh.radar.location_permission": "অবস্থানের অনুমতি দরকার",
  "mesh.radar.location_off": "অবস্থান বন্ধ · খোঁজা হচ্ছে না",
  "mesh.radar.hint_rings": "বৃত্তগুলো BLE সংকেতের জোর দেখায়, দূরত্ব নয়",
  "mesh.radar.hint_checking": "ব্লুটুথ ও অনুমতি দেখা হচ্ছে",
  "mesh.radar.hint_internet": "বার্তা তবুও ইন্টারনেটে যাতায়াত করে",
  "mesh.radar.hint_turn_on": "পিয়ার খুঁজে পেতে ব্লুটুথ চালু করুন",
  "mesh.radar.hint_allow": "পিয়ার খুঁজে পেতে ব্লুটুথের অনুমতি দিন",
  "mesh.radar.hint_allow_settings":
    "পিয়ার খুঁজে পেতে সেটিংসে ব্লুটুথের অনুমতি দিন",
  "mesh.radar.hint_location_permission":
    "Android 11 ও তার আগের সংস্করণে ব্লুটুথে খুঁজতে অবস্থান লাগে",
  "mesh.radar.hint_android_location":
    "ব্লুটুথে খোঁজার ফল ফেরাতে Android-এর অবস্থান চালু থাকা দরকার",
  "mesh.radar.signal_strong": "জোরালো",
  "mesh.radar.signal_medium": "মাঝারি",
  "mesh.radar.signal_weak": "দুর্বল",
  "mesh.radar.you_center": "আপনি, মেশের কেন্দ্রে",
  "mesh.radar.sonar_hint": "একবার সোনার ঝাড়ে। খোঁজা এমনিতেই একটানা চলছে।",
  "mesh.radar.paused": "মেশ থেমে আছে · আপনি দূরে",
  "mesh.radar.ring_hint": "বৃত্তে অবস্থান সংকেতের জোর বোঝায়, দূরত্ব নয়",
  "mesh.radar.set_online":
    "পিয়ার খুঁজে পেতে প্রোফাইলে নিজের অবস্থা অনলাইন করুন",
  "mesh.radar.in_range": "নাগালের মধ্যে",
  "mesh.radar.recently_seen": "সম্প্রতি দেখা",
  "mesh.radar.peer_hint":
    "এই পিয়ারকে বার্তা পাঠানো বা টাকা দেওয়ার বিকল্প খোলে",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "এইমাত্র",
  "mesh.peer.none": "কাছে কোনো পিয়ার নেই",
  "mesh.peer.none_desc":
    "ব্লুটুথের নাগালের অন্য Airhop বা bitchat ডিভাইস এখানে দেখা যাবে।",
  "mesh.peer.id_copied": "পিয়ার আইডি কপি হয়েছে",
  "mesh.peer.copy_id": "পিয়ার আইডি কপি করুন",
  "mesh.peer.their_name": "{name} নামে পরিচিত",
  "mesh.peer.in_range": "নাগালের মধ্যে",
  "mesh.peer.relay": "রিলে নোড",
  "mesh.peer.relay_body":
    "মেশ বড় করতে কেউ চালু রেখে যাওয়া একটি রেডিও। এটি এমন বার্তা বয়ে নেয় যা নিজে পড়তে পারে না। এখানে বার্তা পাঠানোর মতো কেউ নেই।",
  "mesh.peer.send_dm": "একটি ব্যক্তিগত বার্তা পাঠান",
  "mesh.peer.message": "বার্তা",
  "mesh.peer.send_sats": "ecash পাঠান",
  "mesh.peer.amount_placeholder": "sat-এ পরিমাণ",
  "mesh.peer.amount_first": "ecash পাঠান, আগে একটি পরিমাণ লিখুন",
  "mesh.peer.cancel_send": "ecash পাঠানো বাতিল করুন",
  "mesh.peer.view_peer": "পিয়ার {name} দেখুন",
  "mesh.peer.view_peer_online": "পিয়ার {name} দেখুন, অনলাইন",
  "mesh.peer.last_seen": "শেষ দেখা {ago} আগে",
  "mesh.peer.send_amount": "{amount} sat পাঠান",
  "mesh.peer.direct": "সরাসরি সংযোগ",
  "mesh.peer.check_distance": "দূরত্ব দেখুন",
  "mesh.peer.checking": "দেখা হচ্ছে",
  "mesh.peer.no_reply": "কোনো উত্তর নেই",
  "mesh.peer.no_reply_hint":
    "তারা হয়তো সরে গেছেন, বা তাদের অ্যাপ হয়তো উত্তর দেয় না",
  "mesh.peer.rtt": "{ms} মিসে",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "অঞ্চল",
  "mesh.level.province": "প্রদেশ",
  "mesh.level.city": "শহর",
  "mesh.level.neighborhood": "আশপাশ",
  "mesh.level.block": "শহরের পাড়া",
  "mesh.level.building": "ভবন",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "খরচযোগ্য",
  "wallet.balance.unit_hint": "satoshi ও bitcoin-এর মধ্যে বদলায়",
  "wallet.balance.a11y": "ব্যালেন্স {value} {unit}",
  "wallet.balance.locked":
    "ওয়ালেটের সংরক্ষণ তালাবদ্ধ। Ecash প্রমাণ একটি এনক্রিপ্ট করা ফাইলে রাখা, যার কী ডিভাইসের কীচেইনে থাকে, আর সেটি খোলা গেল না। ডিভাইসের তালা খুলে Airhop আবার চালু করুন।",
  "wallet.balance.tor_blocked":
    "Tor চালু, তাই মিন্টের অনুরোধ আটকে আছে: সেগুলো খোলা নেটে বেরিয়ে আপনার IP-কে আপনার প্রমাণের সঙ্গে জুড়ে দিত। মেশে পাঠানো ও নেওয়া তবুও চলে। সেটিংসের নিরাপত্তায় মিন্টের যাতায়াতের অনুমতি দিন।",
  "wallet.balance.unconfirmed_note":
    "{amount} এখনো মিন্টের সঙ্গে নিশ্চিত হয়নি",
  "wallet.balance.reserved_note":
    "{amount} পথে থাকা একটি পাঠানোর জন্য সরিয়ে রাখা",
  "wallet.balance.other_mint_note": "{amount} আলাদা একটি মিন্ট অ্যাকাউন্টে",
  "wallet.balance.test_mint_note":
    "এতে একটি পরীক্ষামূলক মিন্টের খেলার টাকা আছে। এটি bitcoin নয় এবং তোলা যায় না।",
  "wallet.token": "টোকেন",
  "wallet.action.send": "ecash টোকেন পাঠান",
  "wallet.action.send_disabled":
    "ecash টোকেন পাঠান, ব্যালেন্স শূন্য থাকলে পাওয়া যায় না",
  "wallet.action.receive": "ecash টোকেন নিন",
  "wallet.action.zap": "একজন Nostr পরিচিতিকে zap করুন",
  "wallet.action.zap_disabled":
    "একজন Nostr পরিচিতিকে zap করুন, ব্যালেন্স শূন্য থাকলে পাওয়া যায় না",
  "wallet.action.add_mint": "একটি Cashu মিন্ট যোগ করুন",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "টোকেনটি বানানো গেল না",
  "wallet.send.title": "ecash পাঠান",
  "wallet.send.amount_in": "{unit}-এ পরিমাণ",
  "wallet.send.body":
    "আপনার কাছে থাকা প্রমাণ থেকে অফলাইনে বানানো। টোকেনটি পৌঁছেছে বলে নিশ্চিত না করা পর্যন্ত ব্যালেন্স থেকে কিছুই স্থায়ীভাবে যায় না।",
  "wallet.send.stale_fee_note":
    "ফি শেষবার দেখা হয়েছে {days} দিন আগে। এই মিন্ট তারপর ফি বাড়িয়ে থাকলে এই পাঠানোয় একটু বেশি লাগতে পারে।",
  "wallet.send.fee_note":
    "{spend} {unit} আপনার ব্যালেন্স থেকে যায়; বাড়তি {fee} তাদের যে মিন্ট ফি দিতে হতো তা মিটিয়ে দেয়",
  "wallet.send.qr_too_big":
    "এই টোকেনটি এত বেশি মুদ্রায় ভাগ যে একটি QR কোডে আঁটে না। বরং ভাগ করুন বা কপি করুন, অথবা একত্র করতে মিন্টে সতেজ করুন।",
  "wallet.send.bearer_note":
    "যে এই লেখাটি ধরে রাখে টাকাটা তারই। প্রমাণগুলো সরিয়ে রাখা, খরচ হয়ে যায়নি: এটি যদি কারও কাছেই না পৌঁছায় তবে অপেক্ষমাণ থেকে ফিরিয়ে নিতে পারবেন।",
  "wallet.send.qr_too_big_short":
    "এই টোকেনটি এত বেশি মুদ্রায় ভাগ যে একটি QR কোডে আঁটে না। বরং ভাগ করুন বা কপি করুন।",
  "wallet.send.scan_note":
    "তাদের নিজের ওয়ালেট থেকে এটি স্ক্যান করতে বলুন। পৌঁছেছে বলে চিহ্নিত না করা পর্যন্ত ফিরিয়ে নেওয়া যায়।",
  "wallet.send.mesh_note":
    "টোকেনটি মেশে একটি এনক্রিপ্ট করা ব্যক্তিগত বার্তা হয়ে যায়। ইন্টারনেট লাগে না।",
  "wallet.send.no_peers_note":
    "কাছের ডিভাইস খুঁজতে মেশ ট্যাব খুলুন, বা অন্যভাবে টোকেনটি ভাগ করুন।",
  "wallet.send.send_to": "{name}-কে পাঠান",
  "wallet.send.memo": "মেমো (ঐচ্ছিক, টোকেনের সঙ্গে যায়)",
  "wallet.send.building": "বানানো হচ্ছে…",
  "wallet.send.build": "টোকেন বানান",
  "wallet.send.inexact_body":
    "আপনার প্রমাণ দিয়ে অফলাইনে ঠিক {amount} {unit} বানানো যায় না। সবচেয়ে ছোট যে টোকেন বানানো যায় তা {spend} {unit}, আর অফলাইনে ফেরত বলে কিছু নেই: বাড়তি {extra} {unit} প্রাপকের কাছে চলে যায়।\n\nঅনলাইনে থাকতে মিন্টে সতেজ করলে আপনার প্রমাণ এমন মানে ভাগ হবে যাতে এটি ঠিকঠাক মেলে।",
  "wallet.send.send_amount": "{amount} পাঠান",
  "wallet.send.sent_to": "{name}-কে {amount} {unit} পাঠানো হয়েছে",
  "wallet.send.sent_to_body":
    "{route} তারা পেয়েছে বলে আপনি নিশ্চিত না করা পর্যন্ত, বা মিন্ট প্রমাণগুলো ভাঙানো হয়েছে বলে না জানানো পর্যন্ত, এটি অপেক্ষমাণে ফিরিয়ে নেওয়ার মতোই থাকে।",
  "wallet.send.copy_token": "টোকেন কপি করুন",
  "wallet.send.share_token": "টোকেন ভাগ করুন",
  "wallet.send.open_in_wallet": "এই টোকেনটি অন্য একটি ওয়ালেটে খুলুন",
  "wallet.send.open_in_wallet_short": "ওয়ালেটে খুলুন",
  "wallet.send.to_peer": "কাছের একটি পিয়ারকে টোকেন পাঠান",
  "wallet.send.to_peer_short": "পিয়ারকে পাঠান",
  "wallet.send.mark_delivered": "পৌঁছেছে চিহ্নিত করে শেষ করুন",
  "wallet.send.they_got_it": "তারা পেয়েছে",
  "wallet.send.keep_pending": "এই পাঠানোটি অপেক্ষমাণ রাখুন",
  "wallet.send.decide_later": "পরে ঠিক করুন",
  "wallet.send.no_peers": "নাগালে কোনো পিয়ার নেই",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "এটি আপনারই পেমেন্ট",
  "wallet.receive.own_payment_body":
    "এই মুদ্রাগুলো আপনার মেটানো হয়নি এমন একটি পাঠানোর জন্য এখনো সরিয়ে রাখা, তাই নেওয়ার কিছু নেই। সেই পেমেন্টে ফিরিয়ে নিন ব্যবহার করে সেগুলো সরাসরি ব্যালেন্সে ফিরিয়ে আনুন।",
  "wallet.receive.already_have": "ইতিমধ্যেই আপনার ওয়ালেটে",
  "wallet.receive.already_have_body":
    "এই টোকেনের প্রতিটি প্রমাণ ইতিমধ্যেই এখানে রাখা আছে, তাই নতুন কিছু যোগ হয়নি। ব্যালেন্স অপরিবর্তিত।",
  "wallet.receive.stored_unconfirmed":
    "{mint} থেকে রাখা হয়েছে, কিন্তু মিন্টের সঙ্গে এখনো নিশ্চিত হয়নি ({reason})।",
  "wallet.receive.offline": "অফলাইন",
  "wallet.receive.redeemed_here":
    "{mint}-এ ভাঙানো হয়েছে। এই প্রমাণগুলো এখন কেবল আপনার: প্রেরকের অনুলিপি আর কাজ করে না।",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "{mint}-এ ভাঙানো হয়েছে। এটি এখন প্রমাণসহ আপনার: প্রেরকের কাছে থাকা এই টোকেনের অনুলিপি আর কাজ করে না।",
  "wallet.receive.stored_pending":
    "{mint} থেকে রাখা হয়েছে, কিন্তু মিন্ট এখনো নিশ্চিত করেনি যে এটি খরচ হয়নি{dleq}। অনলাইনে এলে ওয়ালেট ট্যাব থেকে সতেজ করুন।",
  "wallet.receive.dleq_inline": " (এর সই সত্যিই মিলে যায়, তাই টোকেনটি আসল)",
  "wallet.receive.dleq_ok": "মিন্টের সই মিলে যায়, তাই টোকেনটি আসল।",
  "wallet.receive.dleq_uncached":
    "এই মিন্টের কী এখানে জমা নেই, তাই অফলাইনে সই মিলিয়ে দেখা গেল না।",
  "wallet.receive.dleq_warning":
    "আপনি অনলাইনে সতেজ না করা পর্যন্ত প্রেরক নীতিগতভাবে এটি অন্যত্র খরচ করে থাকতে পারেন।",
  "wallet.receive.failed": "নেওয়া গেল না",
  "wallet.receive.title": "ecash নিন",
  "wallet.receive.body":
    "একটি Cashu টোকেন পেস্ট করুন। অনলাইনে থাকলে এটি সঙ্গে সঙ্গে মিন্টে ভাঙানো হয়; অফলাইনে রাখা হয় আর পরের বার সতেজ করলে নিশ্চিত হয়।",
  "wallet.receive.scan": "একটি ecash QR কোড স্ক্যান করুন",
  "wallet.receive.scan_short": "QR স্ক্যান করুন",
  "wallet.receive.receiving": "নেওয়া হচ্ছে…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}… থেকে Nutzap পাওয়া গেছে এবং আপনার ওয়ালেটে ভাঙানো হয়েছে।",
  "wallet.zap.title": "একটি Nostr পরিচয়কে zap করুন",
  "wallet.zap.not_npub": "npub নয়",
  "wallet.zap.bad_key": "কী ঠিক নেই",
  "wallet.zap.invalid_pubkey": "পাবলিক কী অকেজো",
  "wallet.zap.invalid_pubkey_body":
    "একটি npub1… বা 64 অক্ষরের hex Nostr পাবলিক কী লিখুন।",
  "wallet.zap.sent": "Nutzap পাঠানো হয়েছে",
  "wallet.zap.failed": "Zap ব্যর্থ",
  "wallet.zap.body":
    "তারা NIP-61 nutzap তথ্য প্রকাশ করে থাকলে ecash তাদের কী-তে তালাবদ্ধ হয়, তাই অন্য কেউ খরচ করতে পারে না, আর ফিরিয়েও নেওয়া যায় না। না করলে এটি ফিরিয়ে নেওয়ার মতো টোকেন হিসেবেই যায়। কোনটি ঘটল তা আপনাকে জানানো হবে।",
  "wallet.zap.contact": "{name}-কে zap করুন",
  "wallet.zap.pubkey_placeholder": "npub1… বা 64 অক্ষরের hex",
  "wallet.zap.sending": "পাঠানো হচ্ছে…",
  "wallet.nostr.copied_body":
    "এটি কাউকে দিলে তারা Airhop বা অন্য যেকোনো Nostr ওয়ালেট থেকে আপনাকে zap করতে পারবে, ব্লুটুথ ছাড়াই।",
  "wallet.nostr.copy_key":
    "আপনার Nostr কী কপি করুন যাতে লোকে আপনাকে zap করতে পারে",
  "wallet.nostr.your_key": "আপনার Nostr কী",

  // ---- Wallet: mints ----
  "wallet.mint.added": "মিন্ট যোগ হয়েছে",
  "wallet.mint.add_failed": "মিন্ট যোগ করা গেল না",
  "wallet.mint.added_named": "{name} যোগ হয়েছে",
  "wallet.mint.added_body":
    "{mint} {units} ইস্যু করে। এর কী এই ডিভাইসে জমা আছে, তাই ইন্টারনেট না থাকলেও এখন এর টোকেন যাচাই করা যায়।",
  "wallet.mint.remove_plain":
    "{mint}-কে আপনার ওয়ালেট থেকে সরাবেন? এর জমা কী-ও যাবে, তাই এর টোকেন আর অফলাইনে যাচাই করা যাবে না।",
  "wallet.mint.title": "মিন্ট",
  "wallet.mint.none": "এখনো কোনো মিন্ট নেই",
  "wallet.mint.none_desc":
    "মিন্ট আপনার ecash ইস্যু ও ভাঙায়। Lightning দিয়ে জমা দিতে একটি যোগ করুন, বা কেবল একটি টোকেন নিন আর তার মিন্ট আপনার হয়ে যোগ হয়ে যাবে।",
  "wallet.mint.add": "একটি মিন্ট যোগ করুন",
  "wallet.mint.add_body":
    "মিন্ট আপনার ecash-এর পেছনের Bitcoin ধরে রাখে, তাই এমন একটি বাছুন যাকে সেখানে রাখা ব্যালেন্স নিয়ে বিশ্বাস করেন। সংরক্ষণের আগে URL যাচাই করা হয়। কাউকেই বিশ্বাস করতে না চাইলে Nutshell দিয়ে নিজেরটি চালান।",
  "wallet.mint.consolidate_body":
    "একটি টোকেন কেবল একটি মিন্টের নাম বলতে পারে, তাই কয়েকটি মিন্টে ছড়ানো ব্যালেন্স দিয়ে সবচেয়ে বড়টির চেয়ে বেশি অঙ্ক দেওয়া যায় না। Airhop এটি সরিয়ে দিতে পারে: বাকি প্রতিটি মিন্ট আপনার বাছাই করা মিন্টের দেওয়া একটি Lightning ইনভয়েস মেটায়। সামান্য রাউটিং ফি লাগে আর ইন্টারনেট দরকার।",
  "wallet.mint.add_short": "মিন্ট যোগ করুন",
  "wallet.mint.checking": "দেখা হচ্ছে…",
  "wallet.mint.remove_with_balance": "ব্যালেন্স থাকা মিন্ট সরাবেন?",
  "wallet.mint.remove": "মিন্ট সরান",
  "wallet.mint.delete_anyway": "তবুও মুছুন",
  "wallet.mint.consolidate": "সব ব্যালেন্স একটি মিন্টে সরান",
  "wallet.mint.confirm_with": "{mint}-এর সঙ্গে প্রমাণ নিশ্চিত করুন",
  "wallet.mint.remove_a11y": "{mint} সরান",
  "wallet.mint.available_amount": "{amount} {unit} পাওয়া যাচ্ছে",
  "wallet.mint.split_across": "ব্যালেন্স {count}টি মিন্টে ছড়ানো। একটিতে সরান।",
  "wallet.mint.move_everything_to": "সবকিছু {mint}-এ সরান",
  "wallet.mint.consolidate_title": "একটি মিন্টে সরান",
  "wallet.mint.moving": "সরানো হচ্ছে…",
  "wallet.mint.move": "সরান",
  "wallet.mint.moved": "সরানো হয়েছে",
  "wallet.mint.moved_body":
    "{fees} {unit} Lightning রাউটিং ফি-র পরে {amount} {unit} এখন {mint}-এ আছে।",
  "wallet.mint.nothing_moved": "কিছুই সরানো হয়নি",
  "wallet.mint.destination": "· গন্তব্য",
  "wallet.mint.will_move": "· সরানো হবে",
  "wallet.mint.issued_by": "ইস্যু করেছে",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop ওয়ালেটে টাকা ভরা",
  "wallet.ln.invoice_failed": "ইনভয়েস তৈরি করা গেল না",
  "wallet.ln.price_failed": "এই ইনভয়েসের দাম ঠিক করা গেল না",
  "wallet.ln.paid": "পরিশোধিত",
  "wallet.ln.deposit_credited":
    "ইনভয়েস পরিশোধিত আর {mint} {amount} {unit} ইস্যু করেছে। এই ব্যালেন্স নিশ্চিত: আপনি এখনই অফলাইনে খরচ করতে পারেন।",
  "wallet.ln.withdrawn":
    "Lightning-এ {paid} sat পরিশোধ করা হয়েছে। মিন্ট {fee} sat রাউটিং ফি নিয়েছে।",
  "wallet.ln.withdrawn_with_change":
    "Lightning-এ {paid} sat পরিশোধ করা হয়েছে। মিন্ট {fee} sat রাউটিং ফি নিয়েছে এবং সরিয়ে রাখা থেকে {change} sat আপনার ব্যালেন্সে ফেরত দিয়েছে।",
  "wallet.ln.payment_failed": "পেমেন্ট ব্যর্থ",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning-এর sat-কে এমন ecash-এ বদলান যা অফলাইনে খরচ করা যায়, বা ecash যেকোনো Lightning ইনভয়েসে তুলে নিন। দুটোতেই ইন্টারনেট ও একটি মিন্ট লাগে।",
  "wallet.ln.deposit_body":
    "মিন্ট আপনাকে একটি ইনভয়েস দেয়। যেকোনো Lightning ওয়ালেট থেকে সেটি মেটান আর sat-গুলো ecash হয়ে ফিরে আসবে, যা অফলাইনে খরচ করা যায়।",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit}-এর এই ইনভয়েসটি মেটান। ওয়ালেট পেমেন্টের দিকে নজর রাখছে আর নিজে থেকেই আপনার ecash ইস্যু করবে।",
  "wallet.ln.expired_body":
    "এই ইনভয়েসের মেয়াদ শেষ। আগেই মিটিয়ে থাকলে ব্যালেন্স নিজে থেকেই জমা হবে।",
  "wallet.ln.waiting_expires":
    "পেমেন্টের অপেক্ষায় · {countdown} পরে মেয়াদ শেষ",
  "wallet.ln.withdraw_body":
    "একটি bolt11 ইনভয়েস পেস্ট করুন আর মিন্ট আপনার ecash থেকে সেটি মেটাবে। আগে আপনাকে রাউটিংয়ের জন্য সরিয়ে রাখা অঙ্ক জানানো হয়; রাউটিং যা ব্যবহার করে না তা ব্যালেন্সে ফিরে আসে।",
  "wallet.ln.up_to": "সর্বোচ্চ {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} মেটান",
  "wallet.ln.deposit": "Lightning-এ sat জমা দিন",
  "wallet.ln.deposit_short": "জমা",
  "wallet.ln.withdraw": "একটি Lightning ইনভয়েসে তুলুন",
  "wallet.ln.withdraw_short": "তুলুন",
  "wallet.ln.deposit_title": "Lightning-এ জমা",
  "wallet.ln.amount_placeholder": "sat-এ পরিমাণ",
  "wallet.ln.requesting": "চাওয়া হচ্ছে…",
  "wallet.ln.get_invoice": "ইনভয়েস নিন",
  "wallet.ln.copy_invoice": "ইনভয়েস কপি করুন",
  "wallet.ln.open_wallet": "একটি Lightning ওয়ালেটে খুলুন",
  "wallet.ln.open_wallet_short": "ওয়ালেটে খুলুন",
  "wallet.ln.waiting": "পেমেন্টের অপেক্ষায়…",
  "wallet.ln.new_invoice": "একটি নতুন ইনভয়েস তৈরি করুন",
  "wallet.ln.new_invoice_short": "নতুন ইনভয়েস",
  "wallet.ln.withdraw_title": "Lightning-এ তুলুন",
  "wallet.ln.scan_invoice": "একটি Lightning ইনভয়েসের QR কোড স্ক্যান করুন",
  "wallet.ln.paid_from": "যেখান থেকে পরিশোধিত",
  "wallet.ln.invoice": "ইনভয়েস",
  "wallet.ln.routing_reserve": "রাউটিংয়ের জন্য সরানো",
  "wallet.ln.reserved": "ব্যালেন্স থেকে সরানো",
  "wallet.ln.paying": "পরিশোধ হচ্ছে…",
  "wallet.ln.get_quote": "দর নিন",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "ব্যাকআপ",
  "wallet.backup.setup_failed": "ব্যাকআপ সাজানো গেল না",
  "wallet.backup.on": "ব্যাকআপ চালু",
  "wallet.backup.on_body":
    "আপনার ব্যালেন্স এখন সেই বারোটি শব্দ থেকে আবার গড়া যাবে।\n\nঅন্য কারও দেওয়া কিছু মিন্টে সতেজ না করা পর্যন্ত বাক্যটির বাইরেই থাকে, আর পুনরুদ্ধারে আপনার মিন্টের তালিকা লাগে, তাই সেটি শব্দগুলোর পাশেই লিখে রাখুন।",
  "wallet.backup.no_phrase": "কোনো বাক্য রাখা নেই",
  "wallet.backup.no_phrase_body":
    "ডিভাইসের কীচেইন থেকে পুনরুদ্ধার বাক্যটি পড়া গেল না। ডিভাইসের তালা খুলে আবার চেষ্টা করুন।",
  "wallet.backup.replace_title": "আপনার এখনকার বাক্যটি বদলাবেন?",
  "wallet.backup.replace_body":
    "আপনার ইতিমধ্যেই একটি পুনরুদ্ধার বাক্য আছে। অন্য একটি ফেরালে সেটি বদলে যাবে। পুরনো বাক্যে ঢাকা মুদ্রা এই ডিভাইসে খরচযোগ্যই থাকে, কিন্তু আর ফেরানো যায় না, তাই এগোনোর আগে পুরনো শব্দগুলো লেখা আছে কিনা নিশ্চিত হন।",
  "wallet.backup.replace": "বদলান",
  "wallet.backup.invalid_phrase": "সেই বাক্যটি অকেজো",
  "wallet.backup.invalid_phrase_body":
    "বাক্যটিতে নিজস্ব একটি যাচাই সংখ্যা আছে আর এটি সেটি পার করে না। ভুল বানান, বাদ পড়া বা এলোমেলো শব্দ আছে কিনা দেখুন।",
  "wallet.backup.not_bip39": "এগুলো BIP-39 শব্দ নয়: {words}। বানান দেখুন।",
  "wallet.backup.add_mint_first": "আগে একটি মিন্ট যোগ করুন",
  "wallet.backup.add_mint_first_body":
    "পুনরুদ্ধার কাজ করে মিন্টকে জিজ্ঞেস করে যে সে আপনার জন্য কোন মুদ্রায় সই করেছে, তাই কোন মিন্টকে জিজ্ঞেস করবে তা তার জানা দরকার। যে মিন্টগুলো ব্যবহার করছিলেন সেগুলো যোগ করে তারপর ফেরান।",
  "wallet.backup.restore_failed": "ফেরানো যায়নি",
  "wallet.backup.phrase": "পুনরুদ্ধার বাক্য",
  "wallet.backup.state_unconfirmed": "ব্যাকআপ চালু কিন্তু নিশ্চিত নয়",
  "wallet.backup.state_off": "ব্যাকআপ বন্ধ",
  "wallet.backup.badge_on": "চালু",
  "wallet.backup.badge_unconfirmed": "অনিশ্চিত",
  "wallet.backup.badge_off": "বন্ধ",
  "wallet.backup.view": "পুনরুদ্ধার বাক্য দেখুন",
  "wallet.backup.setup": "পুনরুদ্ধার বাক্য সাজান",
  "wallet.backup.view_short": "বাক্য দেখুন",
  "wallet.backup.setup_short": "সাজান",
  "wallet.backup.restore": "একটি পুনরুদ্ধার বাক্য থেকে ওয়ালেট ফেরান",
  "wallet.backup.restore_short": "ফেরান",
  "wallet.backup.setup_title": "একটি পুনরুদ্ধার বাক্য সাজান",
  "wallet.backup.on_body_short":
    "আপনার বারোটি শব্দ দিয়ে নতুন ডিভাইসে ব্যালেন্স আবার গড়া যায়।",
  "wallet.backup.unconfirmed_body":
    "আপনি কখনো নিশ্চিত করেননি যে একটি অনুলিপি লিখে রেখেছেন। এখন শব্দগুলো কেবল এই ফোনেই আছে, অথচ ব্যাকআপের কাজই হলো ফোন হারালে টিকে থাকা। বাক্যটি দেখে লিখে রাখুন।",
  "wallet.backup.not_covered":
    "{amount} এখনো ঢাকা পড়েনি। অন্যের দেওয়া মুদ্রা যিনি পাঠিয়েছেন তাঁর গোপন কথা বহন করে, তাই বদল না হওয়া পর্যন্ত সেগুলো আপনার বাক্যের আওতায় আসে না। সেগুলো নিরাপদ করতে একটি মিন্ট সতেজ করুন।",
  "wallet.backup.off_body":
    "আপনার ecash কেবল এই ফোনেই আছে। এটি হারালে কেউ টাকা ফেরাতে পারবে না, আপনি নিজেও নন। পুনরুদ্ধার বাক্য হলো বারোটি শব্দ যা যেকোনো জায়গায় আপনার ব্যালেন্স আবার গড়তে পারে।",
  "wallet.backup.about_to_see": "আপনি এখনই বারোটি শব্দ দেখবেন। সেগুলোই টাকা।",
  "wallet.backup.exact_order":
    "বারোটি শব্দ, ঠিক এই ক্রমে। যার কাছে এগুলো আছে তার কাছেই আপনার ব্যালেন্স।",
  "wallet.backup.verify_body":
    "কেউ লিখে রাখেনি এমন বাক্য কোনো বাক্য না থাকার চেয়েও খারাপ, কারণ সেটি এমন একটি জাল বলে মনে হয় যা আসলে নেই। দুটি শব্দ নিশ্চিত করুন।",
  "wallet.backup.verify_mismatch": "এটি মিলছে না। আপনার লেখা অনুলিপি দেখুন।",
  "wallet.backup.restore_body":
    "বারোটি শব্দ লিখুন। Airhop আপনার মুদ্রাগুলো আবার বের করে আর প্রতিটি মিন্টকে জিজ্ঞেস করে সে কোনগুলোয় সই করেছে, তাই মিন্টের রাখা নথি থেকেই ব্যালেন্স ফিরে আসে।",
  "wallet.backup.warn_secret":
    "যে-ই এগুলো পড়বে সে আপনার ব্যালেন্স নিয়ে নিতে পারবে। স্ক্রিনশট নেবেন না আর এই ফোনে রাখবেন না।",
  "wallet.backup.warn_paper":
    "কাগজে লিখে নিরাপদ কোথাও রাখুন। ফোন হারিয়ে গেলে Airhop আর সেগুলো আপনাকে দেখাতে পারবে না।",
  "wallet.backup.warn_scope":
    "এগুলো কেবল আপনার ecash-ই আবার গড়ে। আপনার পরিচয়, চ্যাট ও পরিচিতি এর আওতায় নেই।",
  "wallet.backup.warn_mints":
    "পুনরুদ্ধারে মিন্টকে জিজ্ঞেস করতেই হয় সে কোন মুদ্রায় সই করেছে, তাই মিন্টের তালিকা শব্দগুলোর পাশে লিখে রাখুন।",
  "wallet.backup.preparing": "প্রস্তুত হচ্ছে…",
  "wallet.backup.show_phrase": "আমার বাক্য দেখান",
  "wallet.backup.your_phrase": "আপনার পুনরুদ্ধার বাক্য",
  "wallet.backup.write_down": "এগুলো লিখে রাখুন",
  "wallet.backup.copy_phrase": "পুনরুদ্ধার বাক্য ক্লিপবোর্ডে কপি করুন",
  "wallet.backup.copy_clipboard": "ক্লিপবোর্ডে কপি করুন",
  "wallet.backup.written_down": "আমি এগুলো লিখে রেখেছি",
  "wallet.backup.check_copy": "আপনার অনুলিপি মিলিয়ে দেখুন",
  "wallet.backup.confirm": "নিশ্চিত করুন",
  "wallet.backup.restore_title": "একটি বাক্য থেকে ফেরান",
  "wallet.backup.phrase_placeholder": "বারোটি শব্দ, ফাঁক দিয়ে আলাদা",
  "wallet.backup.no_mints_yet":
    "এখনো কোনো মিন্ট যোগ করা হয়নি। পুনরুদ্ধারে একটি নির্দিষ্ট মিন্টকে জিজ্ঞেস করতেই হয়, তাই আগে যেগুলো ব্যবহার করছিলেন সেগুলো যোগ করুন।",
  "wallet.backup.scanning": "খোঁজা হচ্ছে…",
  "wallet.backup.restore_progress": "{mint} · কী-সেট {total}-এর {step}",
  "wallet.backup.will_scan":
    "খোঁজা হবে: {mints}। যে মিন্ট আপনি যোগ করেননি তাকে কখনো জিজ্ঞেস করা হয় না, তাই সেখানকার ব্যালেন্স অদৃশ্যই থাকে।",
  "wallet.backup.word_n": "শব্দ {position}",
  "wallet.backup.unreachable_mints":
    "নাগাল পাওয়া গেল না: {mints}। সেখানকার ব্যালেন্স এখনো ওখানেই আছে। সংযোগ ভালো হলে আবার চেষ্টা করুন।",
  "wallet.backup.nothing_recovered": "খোঁজা মিন্টগুলো থেকে কিছুই উদ্ধার হয়নি।",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "পাওয়া গেছে বলে চিহ্নিত করবেন?",
  "wallet.delivered.body":
    "এটি {amount} {unit} স্থায়ীভাবে ছেড়ে দেয়। এটি সত্যিই না পৌঁছে থাকলে আপনি আর ফিরিয়ে নিতে পারবেন না।",
  "wallet.delivered.body_generic":
    "এটি সরিয়ে রাখা অঙ্কটি স্থায়ীভাবে ছেড়ে দেয়। এটি সত্যিই না পৌঁছে থাকলে আপনি আর ফিরিয়ে নিতে পারবেন না।",
  "wallet.delivered.cancel": "এখনো নয়",
  "wallet.delivered.confirm": "তারা পেয়েছে",
  "wallet.reclaim.title": "এই টোকেনটি ফিরিয়ে নেবেন?",
  "wallet.reclaim.body":
    "{amount} {unit} আপনার ব্যালেন্সে ফিরে যায়। কেবল তখনই করুন যখন টোকেনটি কারও কাছেই পৌঁছায়নি: তাদের কাছে লেখাটি থেকে থাকলে, যে আগে মিন্টে ভাঙাবে টাকাটা তারই, আর সেটি তারাও হতে পারে।",
  "wallet.reclaim.keep": "অপেক্ষমাণ রাখুন",
  "wallet.reclaim.confirm": "ফিরিয়ে নিন",
  "wallet.copied.token_body":
    "টোকেনটি আপনার ক্লিপবোর্ডে আছে। পৌঁছেছে বলে চিহ্নিত না করা পর্যন্ত এটি এখানে সরিয়ে রাখা থাকে, তাই প্রথমবার না হলে আবার পেস্ট করতে পারবেন।",
  "wallet.copied.phrase_body":
    "এটি একটি পাসওয়ার্ড ম্যানেজারে পেস্ট করে ক্লিপবোর্ড খালি করুন। অন্য অ্যাপ ক্লিপবোর্ড পড়তে পারে, আর কিছু সাজানোয় সেটি আপনার অন্য ডিভাইসেও যায়।",
  "wallet.refresh.failed": "সতেজ করা যায়নি",
  "wallet.refresh.partly": "আংশিক সতেজ",
  "wallet.refresh.done": "সতেজ হয়েছে",
  "wallet.refresh.unreachable":
    "{mints}-এর নাগাল পাওয়া গেল না। বাকি সবই হালনাগাদ।",
  "wallet.refresh.swapped":
    "{amount} {unit} নিশ্চিত হয়ে নতুন প্রমাণে বদলানো হয়েছে।",
  "wallet.refresh.secured":
    "{amount} {unit} এখন আপনার পুনরুদ্ধার বাক্যের আওতায়।",
  "wallet.refresh.all_confirmed":
    "এখানকার সবকিছুই মিন্টের সঙ্গে আগেই নিশ্চিত ছিল।",
  "wallet.pending.title": "অপেক্ষমাণ",
  "wallet.pending.reserved_desc":
    "বানানো ও সরিয়ে রাখা, পৌঁছানো নিশ্চিত নয়। প্রমাণগুলো আপনার ব্যালেন্স থেকে আলাদা রাখা যাতে দুবার খরচ না হয়।",
  "wallet.pending.locked_desc":
    "ইতিমধ্যেই প্রাপকের কী-তে তালাবদ্ধ, তাই কেবল তারাই খরচ করতে পারে। শুধু এখনো তাদের কাছে পৌঁছায়নি। শেষ করতে টোকেনটি ভাগ করুন।",
  "wallet.pending.show_qr": "এই টোকেনটি একটি QR কোড হিসেবে দেখান",
  "wallet.pending.copy_again": "টোকেনটি আবার কপি করুন",
  "wallet.pending.share_again": "টোকেনটি আবার ভাগ করুন",
  "wallet.pending.mark_delivered": "এই টোকেনটি পৌঁছেছে বলে চিহ্নিত করুন",
  "wallet.pending.delivered": "পৌঁছেছে",
  "wallet.pending.reclaim_into": "এই টোকেনটি আপনার ব্যালেন্সে ফিরিয়ে নিন",
  "wallet.activity.title": "কার্যকলাপ",
  "wallet.activity.none": "এখনো কিছুই নেই",
  "wallet.activity.none_desc":
    "আপনার পাঠানো ও পাওয়া পেমেন্ট এখানে দেখা যাবে, নতুনটি আগে, প্রতিটির মিন্ট ও ফি সহ।",
  "wallet.activity.show_fewer": "কম পেমেন্ট দেখান",
  "wallet.activity.show_less": "কম দেখান",
  "wallet.activity.received_unconfirmed": "পাওয়া গেছে, অনিশ্চিত",
  "wallet.activity.received": "পাওয়া গেছে",
  "wallet.activity.receive_failed": "নেওয়া যায়নি",
  "wallet.activity.reclaimed": "ফিরিয়ে নেওয়া হয়েছে",
  "wallet.activity.send_failed": "পাঠানো যায়নি",
  "wallet.activity.sent": "পাঠানো হয়েছে",
  "wallet.activity.status_pending": "অপেক্ষমাণ",
  "wallet.activity.status_failed": "ব্যর্থ",
  "wallet.activity.status_reclaimed": "ফিরিয়ে নেওয়া",
  "wallet.activity.status_expired": "মেয়াদ শেষ",
  "wallet.activity.ln_deposit": "Lightning জমা",
  "wallet.activity.ln_withdrawal": "Lightning থেকে তোলা",
  "wallet.activity.nutzap_received": "Nutzap পাওয়া গেছে",
  "wallet.activity.spent_removed": "খরচ হওয়া প্রমাণ সরানো হয়েছে",
  "wallet.activity.refreshed": "প্রমাণ সতেজ হয়েছে",
  "wallet.activity.refreshing": "প্রমাণ সতেজ হচ্ছে",
  "wallet.activity.just_now": "এইমাত্র",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "মেশ অফলাইন",
  "wallet.mesh_offline_body":
    "মেশ পরিষেবা চলছে না, তাই টোকেনটি তুলে দেওয়ার মতো কিছু নেই। এটি অপেক্ষমাণে সরিয়ে রাখাই থাকে।",
  "wallet.xfer.route_mesh": "মেশে সরাসরি তাদের ডিভাইসে তুলে দেওয়া হয়েছে।",
  "wallet.xfer.route_nostr":
    "তারা ব্লুটুথের নাগালের বাইরে ছিলেন, তাই এটি বরং ইন্টারনেটে গেছে।",
  "wallet.xfer.route_courier":
    "এখন তাদের কাছে কোনো পথ নেই। এটি অন্য ডিভাইস বয়ে নেবে আর কেউ তাদের নাগাল পেলে পৌঁছে দেবে।",
  "wallet.xfer.route_queued":
    "তাদের নাগাল এখনো পাওয়া যাচ্ছে না। এটি সারিতে আছে আর নাগাল পাওয়া মাত্রই চলে যাবে।",
  "wallet.xfer.mesh_offline_body":
    "মেশ পরিষেবা চলছে না, তাই টোকেনটি তুলে দেওয়ার কোনো উপায় নেই। কিছুই কাটা হয়নি।",
  "wallet.xfer.could_not_send": "পাঠানো গেল না",
  "wallet.xfer.inexact_body":
    "আপনার প্রমাণ দিয়ে অফলাইনে ঠিক {amount} {unit} বানানো যায় না। সবচেয়ে ছোট যে টোকেন বানানো যায় তা {spend} {unit}, আর বাড়তি {extra} {unit} তাদের কাছে চলে যায়, ফেরানোর কোনো উপায় ছাড়াই।\n\nঅনলাইনে থাকতে মিন্টে সতেজ করলে আপনার প্রমাণ এমন মানে ভাগ হবে যাতে এটি ঠিকঠাক মেলে।",
  "wallet.xfer.send_amount": "{amount} পাঠান",
  "wallet.xfer.mesh_offline": "মেশ অফলাইন",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "তাদের কী-তে তালাবদ্ধ আর Nostr-এ প্রকাশিত। তারা অনলাইনে থাকুন বা না থাকুন, এটি তাদেরই।",
  "wallet.pay.rail_nutzap_dm":
    "তাদের কী-তে তালাবদ্ধ। রিলে নিতে চায়নি, তাই এটি বরং একটি বার্তা হিসেবে তাদের কাছে গেছে।",
  "wallet.pay.rail_nutzap_undelivered":
    "তাদের কী-তে তালাবদ্ধ, কিন্তু এখনো কিছুই এটি বয়ে নিতে পারেনি। এটি সারিতে আছে, আর টোকেনটি অপেক্ষমাণে।",
  "wallet.pay.final":
    "তালাবদ্ধ পেমেন্ট ফিরিয়ে নেওয়া যায় না: এখন কেবল তাদের কী-ই এই মুদ্রা খরচ করতে পারে।",
  "wallet.pay.reclaimable":
    "এটি পৌঁছেছে বলে নিশ্চিত না করা পর্যন্ত ওয়ালেট ট্যাব থেকে ফিরিয়ে নেওয়া যায়।",
  "wallet.pay.why": "এভাবে পাঠানো হয়েছে কারণ {reason}।",
  "wallet.pay.sent_title": "{name}-কে {amount} {unit}",
  "wallet.pay.thread_receipt":
    "আপনি {amount} {unit} পাঠিয়েছেন, তাদের কী-তে তালাবদ্ধ।",
  "wallet.pay.title": "ecash পাঠান",
  "wallet.pay.to": "{name}-কে",
  "wallet.pay.amount": "sat-এ পরিমাণ",
  "wallet.pay.memo": "নোট (ঐচ্ছিক, প্রকাশ্য)",
  "wallet.pay.send": "পাঠান",
  "wallet.pay.sending": "পাঠানো হচ্ছে…",
  "wallet.pay.action": "ecash পাঠান",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "ক্যামেরার অনুমতি",
  "wallet.scan.camera_purpose": "একটি ecash QR কোড স্ক্যান করতে",
  "wallet.scan.photo_label": "ছবির অনুমতি",
  "wallet.scan.photo_purpose": "একটি ছবি থেকে ecash QR পড়তে",
  "wallet.scan.no_token": "সেই ছবিতে কোনো ecash টোকেন পাওয়া যায়নি।",
  "wallet.scan.no_invoice": "সেই ছবিতে কোনো Lightning ইনভয়েস পাওয়া যায়নি।",
  "wallet.scan.unreadable": "সেই ছবিটি পড়া গেল না।",
  "wallet.scan.camera_failed":
    "ক্যামেরা চালু করা গেল না। অন্য ক্যামেরা অ্যাপ বন্ধ করে আবার চেষ্টা করুন।",
  "wallet.scan.close": "স্ক্যানার বন্ধ করুন",
  "wallet.scan.on_device":
    "এটি এই ডিভাইসেই পড়া হয়; কিছুই কোথাও পাঠানো হয় না।",
  "wallet.scan.aim_token": "একটি ecash QR কোডের দিকে ধরুন।",
  "wallet.scan.aim_invoice": "একটি Lightning ইনভয়েসের QR কোডের দিকে ধরুন।",
  "wallet.scan.title_token": "ecash স্ক্যান করুন",
  "wallet.scan.title_invoice": "ইনভয়েস স্ক্যান করুন",
  "wallet.scan.desc_token":
    "অন্য ওয়ালেট থেকে একটি Cashu টোকেন পড়ুন। যেকোনো Cashu ওয়ালেটেই চলে, কেবল Airhop নয়।",
  "wallet.scan.desc_invoice":
    "আপনার ব্যালেন্স থেকে মেটাতে একটি Lightning ইনভয়েস পড়ুন।",
  "wallet.scan.use_camera_a11y": "ক্যামেরা দিয়ে স্ক্যান করুন",
  "wallet.scan.use_camera": "ক্যামেরা ব্যবহার করুন",
  "wallet.scan.pick_image_a11y": "সংরক্ষিত একটি ছবি থেকে QR কোড পড়ুন",
  "wallet.scan.pick_image": "ছবি থেকে বাছুন",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu কী?",
  "wallet.explain.intro":
    "Cashu হলো Bitcoin-এর ecash। একটি টোকেন এমন একটি লেখা যা যে ধরে রাখে তার কাছেই টাকার সমান, মিন্ট এতে অন্ধভাবে সই করে তাই মিন্ট বুঝতে পারে না কে কী খরচ করল। কোনো অ্যাকাউন্ট নেই, লগইন নেই।",
  "wallet.explain.send": "পাঠান",
  "wallet.explain.send_desc":
    "একটি অঙ্ককে এমন টোকেনে বদলায় যা ব্লুটুথে কাছের পিয়ারকে দেওয়া যায়, বা লেখা হিসেবে ভাগ করা যায়। ইন্টারনেট ছাড়াই চলে। এটি পৌঁছেছে বলে নিশ্চিত না করা পর্যন্ত প্রমাণগুলো সরিয়ে রাখাই থাকে।",
  "wallet.explain.receive": "নিন",
  "wallet.explain.receive_desc":
    "যোগ করতে একটি টোকেন পেস্ট করুন। অনলাইনে থাকলে সেটি সঙ্গে সঙ্গে মিন্টে বদলে যায়, যা এটিকে প্রমাণসহ আপনার করে তোলে। অফলাইনে এটি রাখা হয় আর সতেজ না করা পর্যন্ত অনিশ্চিত চিহ্নিত থাকে।",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "একটি Nostr পরিচয়কে টাকা দেয়। তারা NIP-61 nutzap তথ্য প্রকাশ করে থাকলে ecash তাদের কী-তে তালাবদ্ধ হয়, তাই কেবল তারাই খরচ করতে পারে। না হলে এটি এনক্রিপ্ট করা ব্যক্তিগত বার্তায় ফিরে যায়। ইন্টারনেট লাগে।",
  "wallet.explain.add_mint": "মিন্ট যোগ করুন",
  "wallet.explain.add_mint_desc":
    "যে মিন্ট আপনার ecash ইস্যু ও ভাঙায় সেটি সংরক্ষণ করে, আর তার পাবলিক কী জমা রাখে যাতে এর টোকেন অফলাইনে যাচাই করা যায়। এমন একটি মিন্ট বাছুন যাকে সেখানে রাখা ব্যালেন্স নিয়ে বিশ্বাস করেন।",
  "wallet.explain.phrase": "পুনরুদ্ধার বাক্য",
  "wallet.explain.phrase_desc":
    "শুরুতে ওয়ালেটের তৈরি বারোটি শব্দ থেকেই আপনার মুদ্রা বের হয়, তাই একটি নতুন ফোন আপনার মিন্টগুলোকে জিজ্ঞেস করে কোন মুদ্রায় সই করেছে আর তাতেই ব্যালেন্স আবার গড়ে। সেগুলো দেখে লিখে না রাখা পর্যন্ত সেগুলো কেবল এই ফোনেই আছে।",

  // ---- Wallet: failures ----
  "wallet.err.locked": "ওয়ালেট তালাবদ্ধ",
  "wallet.err.mint_unreachable": "মিন্টের নাগাল নেই",
  "wallet.err.tor_blocked": "Tor চালু থাকায় আটকানো",
  "wallet.err.insufficient": "যথেষ্ট ব্যালেন্স নেই",
  "wallet.err.exact_amount": "ঠিক সেই অঙ্কটি পাঠানো যায় না",
  "wallet.err.no_mint": "কোনো মিন্ট নেই",
  "wallet.err.mint_unsupported": "মিন্ট সেটি পারে না",
  "wallet.err.mint_refused": "মিন্ট রাজি হয়নি",
  "wallet.err.unreadable": "পড়া যায় না এমন টোকেন",
  "wallet.err.rejected": "টোকেন ফিরিয়ে দেওয়া হয়েছে",
  "wallet.err.already_spent": "আগেই খরচ হয়ে গেছে",
  "wallet.err.change_pending": "পরিশোধিত, ফেরত বাকি",
  "wallet.svc.mint_unreachable": "মিন্টের নাগাল পাওয়া গেল না।",
  "wallet.svc.tor_ios": "iOS-এ মিন্টের অনুরোধ Tor দিয়ে যায় না।",
  "wallet.svc.tor_ios_body":
    "Arti কেবল Nostr-এর WebSocket মুড়ে রাখে, তাই এই অনুরোধটি খোলা নেটে মিন্টে পৌঁছে আপনার IP-কে এই প্রমাণগুলোর সঙ্গে জুড়ে দিত। সেটিংস > নিরাপত্তায় এটি অনুমোদন করুন, বা আগে Tor বন্ধ করুন। মেশে ecash পাঠানো ও নেওয়া তবুও চলে।",
  "wallet.svc.tor_paused": "Tor চালু আছে কিন্তু যুক্ত নয়।",
  "wallet.svc.tor_paused_body":
    "Orbot রাউটিং বন্ধ করে দিয়েছে, তাই এই অনুরোধটি খোলা নেটে মিন্টে পৌঁছে আপনার IP-কে এই প্রমাণগুলোর সঙ্গে জুড়ে দিত। Orbot আবার চালু করুন, বা Tor বন্ধ করুন। মেশে ecash পাঠানো ও নেওয়া তবুও চলে।",
  "wallet.svc.keys_uncached": "এই মিন্টের কী এই ডিভাইসে জমা নেই।",
  "wallet.svc.keys_uncached_body":
    "সেগুলো আনতে অনলাইনে থাকতে একবার ওয়ালেট খুলুন।",
  "wallet.svc.phrase_invalid": "সেই পুনরুদ্ধার বাক্যটি অকেজো।",
  "wallet.svc.phrase_invalid_body":
    "ভুল বানান বা বাদ পড়া শব্দ আছে কিনা দেখুন। বাক্যটিতে নিজস্ব একটি যাচাই সংখ্যা আছে, তাই একটি শব্দ ভুল হলেই পুরোটা অকেজো।",
  "wallet.svc.need_mint": "আগে অন্তত একটি মিন্ট যোগ করুন।",
  "wallet.svc.need_mint_body":
    "পুনরুদ্ধার কাজ করে মিন্টকে জিজ্ঞেস করে যে সে আপনার জন্য কোন মুদ্রায় সই করেছে, তাই কোন মিন্টকে জিজ্ঞেস করবে তা তার জানা দরকার।",
  "wallet.svc.restored": "পুনরুদ্ধার বাক্য থেকে ফেরানো হয়েছে",
  "wallet.svc.storage_locked": "ওয়ালেটের সংরক্ষণ তালাবদ্ধ।",
  "wallet.svc.storage_locked_body":
    "Airhop ecash প্রমাণ একটি এনক্রিপ্ট করা ফাইলে রাখে, যার কী ডিভাইসের কীচেইনে থাকে। ডিভাইসের তালা খুলে অ্যাপটি আবার চালু করুন।",
  "wallet.svc.bad_url": "ওটি কাজের কোনো URL নয়।",
  "wallet.svc.needs_https": "মিন্টের URL অবশ্যই https:// দিয়ে শুরু হতে হবে।",
  "wallet.svc.refuse_http": "খোলা http দিয়ে মিন্ট ব্যবহার করতে রাজি নয়।",
  "wallet.svc.refuse_http_body":
    "নেটওয়ার্কের পথে থাকা যে কেউ আপনার প্রমাণ পড়তে বা বদলাতে পারত। একটি https:// মিন্ট ব্যবহার করুন।",
  "wallet.svc.mint_not_saved": "মিন্ট সংরক্ষণ করা গেল না।",
  "wallet.svc.unreadable_token": "ওটি পড়ার মতো Cashu টোকেন নয়।",
  "wallet.svc.unreadable_token_body":
    "টোকেন cashuA বা cashuB দিয়ে শুরু হয়। কপি করার সময় কিছু কাটা পড়েছে কিনা দেখুন।",
  "wallet.svc.wrong_mint": "এই টোকেনটি যে মিন্টের নাম বলছে সে সই করেনি।",
  "wallet.svc.already_spent": "এই প্রমাণগুলো আগেই খরচ হয়ে গেছে।",
  "wallet.svc.already_spent_body":
    "যিনি এই টোকেনটি পাঠিয়েছেন তিনি আগেই এটি ভাঙিয়েছেন, বা একই টোকেন অন্য কাউকেও পাঠিয়েছেন।",
  "wallet.svc.receiving_offline": "অফলাইনে নেওয়া",
  "wallet.svc.amount_positive": "শূন্যের চেয়ে বড় একটি অঙ্ক লিখুন।",
  "wallet.svc.coins_raced":
    "সেই মুদ্রাগুলো এইমাত্র অন্য একটি পেমেন্টে ব্যবহার হয়ে গেছে।",
  "wallet.svc.coins_raced_body":
    "কিছুই কাটা হয়নি। আবার চেষ্টা করুন, ওয়ালেট অন্য একটি সেট বেছে নেবে।",
  "wallet.svc.no_ecash": "এখনো কোনো ecash নেই।",
  "wallet.svc.no_ecash_body":
    "একটি মিন্ট যোগ করে Lightning-এ জমা দিন, বা কারও কাছ থেকে একটি টোকেন নিন।",
  "wallet.svc.split_across_mints": "আপনার ব্যালেন্স কয়েকটি মিন্টে ছড়ানো।",
  "wallet.svc.mint_says_spent":
    "মিন্ট জানিয়েছে এই প্রমাণগুলো আগেই খরচ হয়ে গেছে।",
  "wallet.svc.issue_against_invoice":
    "একটি Lightning ইনভয়েসের বিপরীতে ecash ইস্যু করা",
  "wallet.svc.pay_invoice": "একটি Lightning ইনভয়েস মেটানো",
  "wallet.svc.unknown_deposit": "অজানা জমা।",
  "wallet.svc.invoice_expired_before":
    "ইনভয়েসটি মেটানোর আগেই মেয়াদ ফুরিয়েছে।",
  "wallet.svc.invoice_expired": "সেই ইনভয়েসের মেয়াদ শেষ।",
  "wallet.svc.invoice_unpaid": "ইনভয়েসটি এখনো মেটানো হয়নি।",
  "wallet.svc.payment_unknown":
    "পেমেন্টের অবস্থা অজানা; পরের বার সতেজ করলে আবার দেখা হবে।",
  "wallet.svc.melt_change_pending": "আপনার ইনভয়েস মেটানো হয়েছে।",
  "wallet.svc.melt_change_pending_body":
    "মিন্ট ব্যবহার না হওয়া রাউটিং ফি এখনো ফেরত দেয়নি। পরের বার সতেজ করলে সেটি নিজে থেকেই নেওয়া হয়, আর এর মাঝে কিছুই হারায় না।",
  "wallet.svc.mint_did_not_pay":
    "মিন্ট এই ইনভয়েসটি মেটায়নি। আপনার ব্যালেন্স অপরিবর্তিত।",
  "wallet.svc.not_an_invoice": "ওটি Lightning ইনভয়েস নয়।",
  "wallet.svc.not_an_invoice_body":
    "lnbc দিয়ে শুরু হওয়া একটি bolt11 ইনভয়েস পেস্ট করুন।",
  "wallet.svc.insufficient_for_invoice":
    "এই ইনভয়েসের জন্য যথেষ্ট ব্যালেন্স নেই।",
  "wallet.svc.coins_raced_invoice_body":
    "কিছুই কাটা হয়নি আর ইনভয়েসটিও মেটানো হয়নি। আবার চেষ্টা করুন।",
  "wallet.svc.same_mint": "গন্তব্য হিসেবে অন্য একটি মিন্ট বাছুন।",
  "wallet.svc.same_mint_body": "উৎস আর গন্তব্য একই মিন্ট, তাই সরানোর কিছু নেই।",
  "wallet.svc.quote_failed_retried":
    "দর নেওয়া যায়নি, একত্র করা আবার চেষ্টা হয়েছে",
  "wallet.svc.amount_unfit_retried":
    "অঙ্কটি খাপ খায়নি, একত্র করা আবার চেষ্টা হয়েছে",
  "wallet.svc.cannot_size": "এই স্থানান্তরের মাপ ঠিক করা গেল না।",
  "wallet.svc.insufficient_at_mint": "{mint}-এ যথেষ্ট ব্যালেন্স নেই।",
  "wallet.svc.inexact_title":
    "আপনার প্রমাণ দিয়ে অফলাইনে ঠিক {amount} {unit} বানানো যায় না।",
  "wallet.svc.inexact_detail":
    "আপনি সবচেয়ে ছোট যে টোকেন পাঠাতে পারেন তা {spend} {unit}। অফলাইনে ফেরত বলে কিছু নেই, তাই বাড়তি {extra} {unit} প্রাপকের কাছে যায়।",
  "wallet.svc.no_single_mint":
    "একা কোনো মিন্টের কাছেই {amount} {unit} নেই। আলাদা মিন্টের ecash এক টোকেনে জোড়া যায় না: আগে একটি মিন্টে একত্র করুন, বা আলাদা অঙ্কে পাঠান।",
  "wallet.svc.have_tried_send":
    "আপনার আছে {total} {unit}, আর পাঠাতে চেয়েছেন {amount}।",
  "wallet.svc.invoice_needs":
    "রাউটিংয়ের জন্য সরিয়ে রাখা সহ এই ইনভয়েসে দরকার {total} {unit}, আর আপনার আছে {balance}।",
  "wallet.svc.nothing_to_move": "{mint}-এ সরানোর মতো কোনো {unit} নেই।",
  "wallet.svc.consolidate_memo": "{mint} থেকে একত্র করা",
  "wallet.svc.cannot_size_detail":
    "Lightning রাউটিং ফি-র পরে {from} থেকে {to}-তে কাজের মতো কোনো অঙ্ক সরানো যায় না। বরং নির্দিষ্ট ছোট একটি অঙ্ক সরানোর চেষ্টা করুন।",
  "wallet.svc.mint_cannot": "{mint} {action} পারে না।",
  "wallet.svc.no_nut": "মিন্ট NUT-{nut} সমর্থনের কথা জানায়নি।",
  "wallet.svc.unknown_mint":
    "সেই পেমেন্ট এমন একটি মিন্টের নাম বলছে যা আপনি ব্যবহার করেন না।",
  "wallet.svc.unknown_mint_body":
    "বিশ্বাস করলে আগে নিজেই মিন্টটি যোগ করুন; আপনি বাছেননি এমন মিন্ট থেকে কিছুই ভাঙানো হয় না।",
  "wallet.svc.no_relay": "রিলের সঙ্গে কোনো সংযোগ নেই",
  "wallet.svc.no_shared_mint": "যথেষ্ট ব্যালেন্স আছে এমন কোনো অভিন্ন মিন্ট নেই",
  "wallet.svc.no_nutzap_info":
    "প্রাপক nutzap তথ্য প্রকাশ করেননি (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "তাদের কী-তে তালাবদ্ধ কিন্তু এখনো পৌঁছায়নি। শেষ করতে এই লেনদেন থেকে টোকেনটি ভাগ করুন।",
  "wallet.svc.swap_lost":
    "মিন্ট এই বদলটি কখনোই শেষ করেনি, তাই এর বিপরীতে কিছুই ইস্যু হয়নি।",
  "wallet.svc.swap_unreadable":
    "এই বদলটি এমন রূপে রাখা হয়েছিল যা এই সংস্করণ আবার চালাতে পারে না।",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR দিয়ে যাচাই করা",
  "contacts.qr.keys_unverified": "কী পাওয়া গেছে, যাচাই হয়নি",
  "contacts.qr.not_verified": "এখনো যাচাই হয়নি",
  "contacts.qr.message": "বার্তা",
  "contacts.qr.add": "পরিচিতি যোগ করুন",
  "contacts.qr.scan_title": "QR কোড স্ক্যান করুন",
  "contacts.qr.aim": "তাদের QR কোডের দিকে ক্যামেরা ধরুন",
  "contacts.qr.add_desc": "মেশে কাছে নেই এমন কারও নাগাল পান।",
  "contacts.qr.peer_id_hint":
    "পিয়ার আইডি 16 অক্ষরের। পরিচিতি কোড airhop: দিয়ে শুরু হয়।",
  "contacts.qr.or_scan": "বা তাদের QR স্ক্যান করুন",
  "contacts.qr.trust_note":
    "কেবল ক্যামেরায় নিজে স্ক্যান করা QR-ই তাদের কী যাচাই করে। পেস্ট করা কোড তাদের কী বহন করে বটে, কিন্তু সেটি তাদেরই কাছ থেকে এসেছে তার প্রমাণ নয়।",
  "contacts.qr.peer_id": "পিয়ার আইডি বা পরিচিতি কোড",
  "contacts.qr.peer_id_placeholder": "একটি আইডি বা পরিচিতি কোড পেস্ট করুন",
  "contacts.qr.scan_camera_a11y": "ক্যামেরা দিয়ে QR কোড স্ক্যান করুন",
  "contacts.qr.scan_camera_desc": "আপনার ক্যামেরা ব্যবহার করুন",
  "contacts.qr.upload_a11y": "গ্যালারি থেকে QR ছবি আপলোড করুন",
  "contacts.qr.upload": "গ্যালারি থেকে আপলোড করুন",
  "contacts.qr.upload_desc": "সংরক্ষিত একটি QR ছবি বাছুন",
  "contacts.qr.scan_a11y": "QR কোড স্ক্যান করে পরিচিতি যোগ করুন",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16 অক্ষরের একটি পিয়ার আইডি, একটি airhop://peer/… লিঙ্ক, বা একটি পরিচিতি কোড পেস্ট করুন।",
  "contacts.scan.camera_label": "ক্যামেরার অনুমতি",
  "contacts.scan.camera_purpose": "একটি পরিচিতির QR কোড স্ক্যান করতে",
  "contacts.scan.camera_needed":
    "স্ক্যান করতে ক্যামেরার অনুমতি লাগে। আপনি তবুও পিয়ার আইডি দিয়ে যোগ করতে পারেন।",
  "contacts.scan.camera_failed":
    "ক্যামেরা চালু করা গেল না। অন্য ক্যামেরা অ্যাপ বন্ধ করে আবার চেষ্টা করুন।",
  "contacts.scan.photo_label": "ছবির অনুমতি",
  "contacts.scan.photo_purpose": "আপনার সংরক্ষিত একটি QR কোড স্ক্যান করতে",
  "contacts.scan.photo_needed":
    "ছবি বাছতে ছবির অনুমতি লাগে। আপনি তবুও পিয়ার আইডি দিয়ে যোগ করতে পারেন।",
  "contacts.scan.no_qr": "সেই ছবিতে কোনো Airhop QR কোড পাওয়া যায়নি।",
  "contacts.scan.unreadable": "সেই ছবি থেকে কোনো QR কোড পড়া গেল না।",
  "contacts.scan.bitchat_expired":
    "সেই bitchat কোডের মেয়াদ শেষ। তাদের আবার QR খুলতে বলুন।",
  "contacts.scan.tampered":
    "এই QR কোডটি অকেজো: এর পিয়ার আইডি এর কী-র সঙ্গে মেলে না। এটি হয়তো বদলে দেওয়া হয়েছে।",
  "contacts.scan.already_added": "ইতিমধ্যেই আপনার পরিচিতিতে আছে",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "ক্যামেরার অনুমতির অপেক্ষায়…",
  "contacts.verify.camera_off": "ক্যামেরা বন্ধ",
  "contacts.verify.open_settings": "সেটিংস খুলুন",
  "contacts.verify.verified": "যাচাই করা",
  "contacts.verify.different": "অন্য পরিচিতি",
  "contacts.verify.scan_again": "আবার স্ক্যান করুন",
  "contacts.verify.failed": "যাচাই করা গেল না",
  "contacts.verify.done": "হয়ে গেছে",
  "contacts.verify.title": "{name}-কে যাচাই করুন",
  "contacts.verify.aim": "তাদের QR কোডের দিকে ক্যামেরা ধরুন",
  "contacts.verify.camera_off_body":
    "QR দিয়ে যাচাই করতে সেটিংসে ক্যামেরার অনুমতি চালু করুন।",
  "contacts.verify.match_body":
    "{name}-এর কী মিলে গেছে। আপনি এই পরিচিতিকে বিশ্বাস করতে পারেন।",
  "contacts.verify.different_body":
    "এই QR অন্য কারও। {name}-কে নিজের কোড দেখাতে বলুন।",
  "contacts.verify.tampered_body":
    "এই QR বদলে দেওয়া মনে হচ্ছে: এর আইডি এর কী-র সঙ্গে মেলে না।",
  "contacts.verify.choose_title": "কীভাবে মিলিয়ে নিতে চান?",
  "contacts.verify.choose_body":
    "দুটিই নিশ্চিত করে যে এই ফোনের কী সত্যিই {name}-এর।",
  "contacts.verify.method_scan": "তাদের কোড স্ক্যান করুন",
  "contacts.verify.method_scan_sub": "তারা আপনার সঙ্গে এখানেই আছেন",
  "contacts.verify.method_compare": "একটি কোড মিলিয়ে দেখুন",
  "contacts.verify.method_compare_sub": "ফোনে একে অপরকে পড়ে শোনান",
  "contacts.verify.no_keys":
    "এই পরিচিতির জন্য এখনো কোনো কী নেই। তাদের বার্তা পাঠান, বা দেখা হলে তাদের কোড স্ক্যান করুন।",
  "contacts.verify.compare_title": "এগুলো একে অপরকে পড়ে শোনান",
  "contacts.verify.compare_body":
    "{name} একই ছয়টি শব্দ দেখছেন। মিলে গেলে আপনারা দুজনেই জানবেন কী-গুলো আসল।",
  "contacts.verify.codes_match": "এগুলো মেলে",
  "contacts.verify.codes_differ": "এগুলো মেলে না",
  "contacts.verify.compared_body":
    "আপনি ও {name} একই কোড নিশ্চিত করেছেন। এই পরিচিতি যাচাই করা হয়েছে।",

  // ---- Settings: shared chrome ----
  "settings.back": "ফিরুন",
  "settings.coming_soon": "শিগগিরই আসছে",
  "settings.opens_externally": "{label}, অ্যাপের বাইরে খোলে",
  "settings.peer_id": "পিয়ার আইডি",
  "settings.share_peer_id": "আপনার পিয়ার আইডি ভাগ করুন",
  "settings.share_id_short": "আইডি ভাগ করুন",
  "settings.peer_id_sheet.title": "আপনার পিয়ার আইডি",
  "settings.peer_id_sheet.copy": "পিয়ার আইডি কপি করুন",
  "settings.peer_id_sheet.note":
    "এটি কেবল তখনই কাজ করে যখন আপনারা দুজনেই ব্লুটুথের নাগালে। কেউ যেকোনো জায়গা থেকে আপনাকে বার্তা পাঠাক চাইলে বরং আপনার QR কোড ভাগ করুন।",

  // ---- Settings: hub rows ----
  "settings.section.general": "সাধারণ",
  "settings.section.general_desc":
    "ঐচ্ছিক সুবিধা, পাঠানো ফেরানো, মিডিয়া, রিসেট",
  "settings.section.privacy": "গোপনীয়তা ও নিরাপত্তা",
  "settings.section.privacy_desc":
    "ফরোয়ার্ড সিক্রেসি, সই করা প্যাকেট, ব্লক করা পিয়ার",
  "settings.section.network": "নেটওয়ার্ক ও রিলে",
  "settings.section.network_desc":
    "ইন্টারনেট বিকল্প, nostr রিলে, bitchat সামঞ্জস্য",
  "settings.section.permissions": "অনুমতি",
  "settings.section.permissions_desc":
    "ব্লুটুথ, অবস্থান, বিজ্ঞপ্তি, ক্যামেরা, মাইক",
  "settings.section.storage": "সংরক্ষণ ও ডেটা",
  "settings.section.diagnostics": "পরীক্ষা",

  // ---- Settings: group headings ----
  "settings.group.transports": "বাহন",
  "settings.group.nearby": "কাছে",
  "settings.group.sync": "মিলকরণ",
  "settings.group.features": "সুবিধা",
  "settings.group.messages": "বার্তা",
  "settings.group.media": "মিডিয়া",
  "settings.group.reset": "রিসেট",
  "settings.group.always_on": "সবসময় চালু",
  "settings.group.notifications": "বিজ্ঞপ্তি",
  "settings.group.blocked": "ব্লক করা",
  "settings.group.theme": "থিম",
  "settings.group.font": "ফন্ট",
  "settings.group.language": "ভাষা",
  "settings.section.diagnostics_desc": "সংযোগের অবস্থা ও কাছের ডিভাইস",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "ব্লুটুথ সংযোগ",
  "settings.diag.ble_links_desc": "এই ফোন সরাসরি যে ডিভাইসগুলোর সঙ্গে যুক্ত",
  "settings.diag.lan": "স্থানীয় নেটওয়ার্ক",
  "settings.diag.lan_desc": "একই Wi-Fi নেটওয়ার্কের ফোনগুলো",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "রাউটার ছাড়াই ফোন থেকে ফোনে",
  "settings.diag.wifi_active": "চলছে",
  "settings.diag.wifi_unsupported": "এই ডিভাইসে চলে না",
  "settings.diag.wifi_permission": "একটি অনুমতিতে আটকে আছে",
  "settings.diag.wifi_unavailable": "এখন পাওয়া যাচ্ছে না",
  "settings.diag.wifi_unpaired": "কিছুই জোড়া লাগানো নেই",
  "settings.diag.wifi_unknown": "রেডিওর অপেক্ষায়",
  "settings.diag.relays": "Nostr রিলে",
  "settings.diag.relays_desc":
    "অবস্থান চ্যানেল ও ইন্টারনেটের নাগালের জন্য ব্যবহৃত",
  "settings.diag.connected": "যুক্ত",
  "settings.diag.disconnected": "যুক্ত নয়",
  "settings.diag.peer_direct": "সরাসরি সংযোগ",
  "settings.diag.peer_relayed": "অন্য একটি ডিভাইসের মাধ্যমে শোনা",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "কোনো সংকেতের পাঠ নেই",
  "settings.diag.no_peers": "নাগালে কেউ নেই",
  "settings.diag.no_peers_desc": "{links}টি রেডিও সংযোগ খোলা",
  "settings.diag.gcs_size": "ছাঁকনির আকার",
  "settings.diag.gcs_size_desc": "বাতাসে ছাড়া সবচেয়ে বড় মিলকরণ ছাঁকনি",
  "settings.diag.fpr": "ভুল ইতিবাচকের হার",
  "settings.diag.fpr_desc":
    "ছাঁকনি কত ঘন ঘন ভুল করে বলে আমাদের একটি প্যাকেট নেই",
  "settings.diag.bytes": "{n} বাইট",
  "settings.diag.footnote":
    "এখানকার কিছুই বদলানো যায় না। Airhop যাতে bitchat-এর সঙ্গে সামঞ্জস্য রাখে সেজন্য এই মানগুলো নির্দিষ্ট।",
  "settings.section.storage_desc": "ব্যবহার ও ক্যাশ",
  "settings.section.appearance": "চেহারা",
  "settings.section.appearance_desc": "থিম, ফন্ট ও ভাষা",
  "settings.section.help": "সহায়তা ও মতামত",
  "settings.section.help_desc":
    "আমাদের সঙ্গে যোগাযোগ করুন, ত্রুটি জানান, বা প্রশ্নোত্তর পড়ুন",
  "settings.section.support": "সহায়তা",
  "settings.section.support_desc": "উন্নয়ন চালু রাখতে সাহায্য করুন",
  "settings.section.about": "সম্পর্কে",
  "settings.section.about_desc": "সংস্করণ, পরিবর্তনের তালিকা ও উৎস",

  // ---- Settings: general ----
  "settings.general.undo": "পাঠানো ফেরান",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "ওয়ালেট",
  "settings.general.undo_seconds": "{count} সেকেন্ড",
  "settings.general.undo_a11y": "পাঠানো ফেরান: {value}",
  "settings.general.quality_a11y": "আপলোডের মান {value} করুন",
  "settings.general.undo_desc":
    "পাঠানো বার্তা একটু আটকে রাখে যাতে বেরিয়ে যাওয়ার আগে ফিরিয়ে নিতে পারেন",
  "settings.general.undo_off_desc": "সঙ্গে সঙ্গে পাঠান, ফেরানো যাবে না",
  "settings.general.undo_2": "2 সেকেন্ড",
  "settings.general.undo_2_desc": "ফিরিয়ে নেওয়ার একটি দ্রুত সুযোগ",
  "settings.general.undo_10": "10 সেকেন্ড",
  "settings.general.undo_10_desc": "সবচেয়ে লম্বা সময়",
  "settings.general.quality": "আপলোডের মান",
  "settings.general.quality_desc":
    "ক্যামেরা বা লাইব্রেরি থেকে পাঠানো ছবিতে খাটে। যেভাবেই হোক প্রতিটি ছবি মেশের উপযোগী করে নেওয়া হয়।",
  "settings.general.quality_low": "কম",
  "settings.general.quality_low_desc": "সবচেয়ে ছোট ছবি, পাঠাতে দ্রুততম",
  "settings.general.quality_medium": "মাঝারি",
  "settings.general.quality_medium_desc": "খুঁটিনাটি ও গতির ভারসাম্য",
  "settings.general.quality_high": "উঁচু",
  "settings.general.quality_high_desc": "সবচেয়ে বেশি খুঁটিনাটি রাখে",
  "settings.general.feature_wallet_desc":
    "মেশে পিয়ার থেকে পিয়ারে Cashu ecash পাঠান",
  "settings.general.feature_wallet_a11y": "ওয়ালেট (সবসময় চালু)",
  "settings.general.feature_ai_desc":
    "ডিভাইসেই চলা ব্যক্তিগত সহকারী, কোনো নেটওয়ার্ক ডাক নেই",
  "settings.general.feature_feeds": "ফিড",
  "settings.general.feature_feeds_desc":
    "Bluesky ও Mastodon ফিড পড়ুন ও পোস্ট করুন",
  "settings.general.show_media": "মিডিয়া নিজে থেকেই দেখান",
  "settings.general.show_media_desc":
    "ছবি ও ভিডিও চ্যাটেই দেখা যায়, নাকি একটি ট্যাপের পেছনে থাকে",
  "settings.general.reset": "সেটিংস রিসেট করুন",
  "settings.general.media_retention": "মিডিয়া রাখুন",
  "settings.general.media_retention_desc":
    "বাছাই করা সময়ের পরে ছবি, ভিডিও ও ভয়েস নোট মুছে যায়",
  "settings.general.media_retention_sheet":
    "মিডিয়া এই ডিভাইসে কতদিন থাকবে বাছুন। মুছে যাওয়া মিডিয়া ফেরানো যায় না।",
  "settings.general.retention_7_desc":
    "সবচেয়ে কম পড়ে থাকে। ঝুঁকিটা ফোন নিজেই হলে এটিই সেরা।",
  "settings.general.retention_14_desc":
    "সংকেত ছাড়া এক-দুই সপ্তাহের জন্য মাঝামাঝি একটি পথ।",
  "settings.general.retention_30_desc":
    "কথোপকথন সবচেয়ে বেশিদিন পড়া যায়, আর ডিস্কেও সবচেয়ে বেশি জমে।",
  "settings.general.reset_desc":
    "প্রতিটি পছন্দ তার আদি অবস্থায় ফেরায়, আপনার পরিচয়, বার্তা, পরিচিতি ও ওয়ালেট অক্ষত রেখে",
  "settings.general.reset_title": "সেটিংস রিসেট করবেন?",
  "settings.general.reset_body":
    "প্রতিটি পছন্দ আদি অবস্থায় ফেরে: চেহারা, পাঠানো ফেরানো, আর সংযোগ (ইন্টারনেট, Tor, গেটওয়ে, সেতু, রিলে)। আপনার পরিচয়, বার্তা, পরিচিতি ও ওয়ালেট অক্ষত থাকে।",
  "settings.general.reset_confirm": "রিসেট",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "ফরোয়ার্ড সিক্রেসি",
  "settings.security.forward_secrecy_desc":
    "ব্যক্তিগত বার্তায় Double Ratchet সবসময় চালু",
  "settings.security.signed_packets": "সই করা প্যাকেট",
  "settings.security.signed_packets_desc":
    "প্রতিটি প্যাকেট Ed25519 দিয়ে সই করা",
  "settings.security.hide_previews": "বিজ্ঞপ্তির ঝলক লুকান",
  "settings.security.hide_previews_desc":
    "প্রেরক ও বার্তা লক স্ক্রিন থেকে দূরে রাখে, কারণ সেটি তালা না খুলেই সেগুলো দেখায়",
  "settings.security.no_blocked": "কোনো পিয়ার ব্লক করা নেই",
  "settings.security.no_blocked_desc":
    "ব্লক করা পিয়ার আপনাকে বার্তা পাঠাতে পারে না বা মেশ ট্যাবে দেখা যায় না",
  "settings.security.unblock_title": "এই পিয়ারের ব্লক তুলুন",
  "settings.security.unblock": "ব্লক তুলুন",
  "settings.security.unblock_peer": "{name}-এর ব্লক তুলুন",
  "settings.security.unblock_body":
    "{name} আবার আপনাকে বার্তা পাঠাতে পারবেন আর কাছে থাকলে মেশ ট্যাবে ফিরে আসবেন।",

  // ---- Settings: network and relays ----
  "settings.network.internet": "ইন্টারনেট বিকল্প",
  "settings.network.internet_desc":
    "মেশের পিয়ার নাগালের বাইরে গেলে Nostr রিলে দিয়ে চালিয়ে যান",
  "settings.network.internet_off_title": "ইন্টারনেট বন্ধ করবেন?",
  "settings.network.internet_off_body":
    "Airhop কেবল ব্লুটুথে চলবে। এটি কোনো Nostr রিলের সঙ্গে যোগাযোগ থামায়, আর Tor, ইন্টারনেট গেটওয়ে ও মেশ সেতু সবই বন্ধ হয়। কাছের ব্লুটুথ চ্যাট চলতেই থাকে।",
  "settings.network.turn_off": "বন্ধ করুন",
  "settings.network.discovery": "ভৌগোলিক রিলে খোঁজা",
  "settings.network.discovery_desc":
    "300-এর বেশি ছড়ানো রিলে থেকে একটি অবস্থান ঘরের জন্য কাছেরগুলো নিজে থেকেই বাছে",
  "settings.network.discovery_needs_relay": "আগে একটি নিজস্ব রিলে যোগ করুন",
  "settings.network.discovery_needs_relay_body":
    "স্বয়ংক্রিয় খোঁজাই Airhop-কে কাছের রিলেগুলো দেখায়। নিচে নিজের রিলে আটকে দেওয়ার পরই কেবল এটি বন্ধ করা মানে রাখে, তাই আগে অন্তত একটি যোগ করুন।",
  "settings.network.custom_only_title": "কেবল আপনার নিজস্ব রিলে ব্যবহার করবেন?",
  "settings.network.custom_only_body":
    "অবস্থান চ্যানেল ও মেশ সেতু আর নিজে থেকে কাছের রিলে বাছবে না, কেবল আপনার যোগ করাগুলোই ব্যবহার করবে। এতে নাগাল কমতে পারে, আর bitchat ব্যবহারকারীদের সঙ্গে আর দেখা না-ও হতে পারে, কারণ তাঁরা কাছের রিলেতেই জড়ো হন।",
  "settings.network.custom": "নিজস্ব রিলে",
  "settings.network.custom_desc":
    "অবস্থান চ্যানেল ও মেশ সেতুর জন্য নিজের রিলে যোগ করুন",
  "settings.network.custom_added": "{max}-এর মধ্যে {count}টি যোগ হয়েছে",
  "settings.network.dm_relays": "বার্তার রিলে",
  "settings.network.dm_relays_desc":
    "ব্যক্তিগত বার্তা ও ব্যক্তিগত চ্যানেল সবসময় এগুলোই ব্যবহার করে। নিজস্ব রিলে এগুলো বদলায় না।",
  "settings.network.discovery_back_on": "ভৌগোলিক রিলে খোঁজা আবার চালু",
  "settings.network.discovery_back_on_body":
    "ওটি আপনার শেষ নিজস্ব রিলে ছিল। অবস্থান চ্যানেলের প্রকাশ করার জায়গা লাগে, তাই Airhop আবার কাছের রিলেগুলো নিজে থেকেই বাছছে।",
  "settings.network.add_relay": "রিলে যোগ করুন",
  "settings.network.remove_relay": "{url} সরান",
  "settings.network.add_short": "যোগ করুন",
  "settings.network.relay_limit":
    "আপনি {count}টি রিলে যোগ করতে পারেন। আরেকটি যোগ করতে একটি সরান।",
  "settings.network.relay_duplicate":
    "সেই রিলেটি ইতিমধ্যেই আপনার তালিকায় আছে।",
  "settings.network.relay_invalid":
    "একটি কাজের রিলে হোস্ট লিখুন, যেমন relay.example.com। রিলে আদি পোর্ট ব্যবহার না করলেই কেবল পোর্ট লাগে। IP ঠিকানা ও স্থানীয় নাম চলবে না।",
  "settings.network.wifi_pair": "জোড়া লাগানো",
  "settings.network.wifi_paired": "জোড়া লাগানো ডিভাইস",
  "settings.network.wifi_pair_find": "একটি ডিভাইস খুঁজুন",
  "settings.network.wifi_pair_find_desc":
    "কাছাকাছি এমন iPhone খুঁজুন যা নিজেকে দেখাচ্ছে। দুটি ফোনেই iOS 26 বা পরবর্তী প্রয়োজন।",
  "settings.network.wifi_pair_show": "এই iPhone দেখান",
  "settings.network.wifi_pair_show_desc":
    "কাছাকাছি একটি iPhone-কে এটি খুঁজে পেতে দিন। একজন খোঁজেন, অন্যজন দেখান, একই সময়ে।",
  "settings.network.wifi_pair_find_action": "কাছাকাছি একটি iPhone বেছে নিন",
  "settings.network.wifi_pair_show_action": "এই iPhone আবিষ্কারযোগ্য করুন",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware এখন উপলব্ধ নয়",
  "settings.network.wifi_pair_forget": "Settings অ্যাপে একটি জোড়া সরান",
  "settings.network.bitchat": "bitchat সামঞ্জস্য",
  "settings.network.bitchat_desc":
    "bitchat-এর মতো একই BLE মেশ, পুরোপুরি মিলিয়ে চলে। এটি সবসময় চালু আর বন্ধ করা যায় না।",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "পেছনে চালান",
  "settings.conn.background_desc": "Airhop বন্ধ থাকলেও মেশ চালু রাখুন",
  "settings.conn.background_on_title": "মেশ চালু রাখবেন?",
  "settings.conn.background_on_body":
    "Airhop বন্ধ থাকলেও পার করা ও নেওয়া চালিয়ে যায়, তাই আপনি দূরে থাকলেও বার্তা পৌঁছায়। এই সময় Android একটি স্থায়ী বিজ্ঞপ্তি দেখায়।",
  "settings.conn.background_off_title": "Airhop বন্ধ হলে মেশ থামাবেন?",
  "settings.conn.background_off_body":
    "কেবল Airhop খোলা থাকলেই বার্তা পৌঁছাবে, আর এই ফোন কাছের লোকদের জন্য আর পার করবে না। স্থায়ী বিজ্ঞপ্তিটি চলে যাবে।",
  "settings.conn.live_voice": "সরাসরি কথা",
  "settings.conn.live_voice_desc":
    "ওয়াকি-টকির মতো কাছের লোকদের সঙ্গে কথা বলুন",
  "settings.conn.live_voice_on_title": "সরাসরি কথা চালু করবেন?",
  "settings.conn.live_voice_on_body":
    "মাইক ধরে রাখলে আপনি বলার সঙ্গে সঙ্গেই আপনার গলা ব্লুটুথের নাগালের সবার কাছে যায়, আর তাদের গলা আপনার ফোনে বাজে। কিছুই রেকর্ড হয় না।",
  "settings.conn.live_voice_off_title": "সরাসরি কথা বন্ধ করবেন?",
  "settings.conn.live_voice_off_body":
    "মাইক ধরে রাখলে বরং একটি ভয়েস নোট রেকর্ড হয়। ছেড়ে দিলে সেটি যায়, আর কেউ না চালানো পর্যন্ত শোনে না।",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor রাউটিং",
  "settings.conn.tor_desc":
    "বাড়তি গোপনীয়তার জন্য Nostr-এর যাতায়াত Tor দিয়ে ঘোরান",
  "settings.conn.tor_on_title": "Nostr-এর যাতায়াত Tor দিয়ে ঘোরাবেন?",
  "settings.conn.tor_on_body":
    "রিলে আর আপনার IP ঠিকানা দেখবে না। যুক্ত হতে বেশি সময় লাগে আর বার্তা ধীরে পৌঁছায়। ব্লুটুথে কিছু বদলায় না।",
  "settings.conn.tor_off_title": "Tor রাউটিং বন্ধ করবেন?",
  "settings.conn.tor_off_body":
    "Nostr-এর যাতায়াত আপনার সাধারণ সংযোগে ফিরে যায়, তাই রিলে আবার আপনার IP ঠিকানা দেখে। যেভাবেই হোক ব্লুটুথে কিছু বদলায় না।",
  "settings.conn.tor_orbot_idle":
    "Orbot বসানো আছে কিন্তু যুক্ত নয়। Orbot খুলে এর VPN চালু করে তারপর এটি চালু করুন।",
  "settings.conn.tor_unavailable": "এই বিল্ডে Tor রাউটিং নেই।",
  "settings.conn.tor_timeout":
    "Tor যুক্ত হতে এক মিনিটের বেশি নিচ্ছে। এটি চালু থেকে চেষ্টা করে যায়; মেশ ট্যাব জানাবে কখন এটি ঘোরাচ্ছে, বা এই নেটওয়ার্ক এটি আটকাচ্ছে কিনা।",
  "settings.conn.tor_failed":
    "Tor চালু করা গেল না। অ্যাপের নেটওয়ার্কে ঢোকার অনুমতি আছে কিনা দেখুন।",
  "settings.conn.mint_clearnet": "খোলা নেটে মিন্টের যাতায়াতের অনুমতি দিন",
  "settings.conn.mint_clearnet_desc":
    "iOS-এ Tor কেবল Nostr ঢাকে। মিন্টের অনুরোধ আটকাতে বন্ধ রাখুন; যেভাবেই হোক মেশে ecash চলতেই থাকে।",
  "settings.conn.gateway": "ইন্টারনেট গেটওয়ে",
  "settings.conn.gateway_desc":
    "কাছের অফলাইন ফোনকে আপনার সংযোগ ধার দিন যাতে সেটি তবুও অবস্থান চ্যানেলে পৌঁছাতে পারে",
  "settings.conn.gateway_on_title": "ইন্টারনেট গেটওয়ে চালু করবেন?",
  "settings.conn.gateway_on_body":
    "নিজের সংযোগ নেই এমন কাছের ফোনগুলো আপনার সংযোগ দিয়ে অবস্থান চ্যানেলের বার্তা পাঠাবে ও নেবে। এতে আপনার মোবাইল ডেটা ও ব্যাটারি খরচ হয়, আর তাদের বার্তা প্রান্ত থেকে প্রান্ত এনক্রিপ্ট করাই থাকে, তাই যা যায় তা আপনি পড়তে পারেন না।",
  "settings.conn.gateway_off_title": "ইন্টারনেট গেটওয়ে বন্ধ করবেন?",
  "settings.conn.gateway_off_body":
    "কাছের অফলাইন ফোনগুলো আর আপনার সংযোগ দিয়ে অবস্থান চ্যানেলে পৌঁছাবে না। আপনার নিজের বার্তায় কিছু বদলায় না।",
  "settings.conn.bridge": "মেশ সেতু",
  "settings.conn.bridge_desc":
    "ইন্টারনেট দিয়ে এই এলাকার প্রকাশ্য #bluetooth চ্যাটকে নাগালের বাইরের আরেক ব্লুটুথ দলের সঙ্গে জুড়ুন",
  "settings.conn.bridge_on_title": "মেশ সেতু চালু করবেন?",
  "settings.conn.bridge_on_body":
    "আপনার প্রকাশ্য #bluetooth বার্তা ইন্টারনেট দিয়ে আপনার আশপাশে প্রকাশিত হবে, তাই ব্লুটুথের নাগালের বাইরের লোকেরাও পড়তে পারবে। ব্যক্তিগত বার্তা কখনোই সেতু পেরোয় না, আর “কেবল কাছে” যেকোনো একটি বার্তাকে এখানেই রাখে।",
  "settings.conn.bridge_off_title": "মেশ সেতু বন্ধ করবেন?",
  "settings.conn.bridge_off_body":
    "আপনার প্রকাশ্য #bluetooth বার্তা আবার ব্লুটুথের নাগালেই থাকে, আর সেতুর ওপারের দলের বার্তা এখানে আসা বন্ধ হয়।",
  "settings.conn.bridge_needs_location": "মেশ সেতুতে অবস্থান লাগে",
  "settings.conn.bridge_needs_location_desc":
    "একটি অবস্থান নিয়ে এটি আপনার আশপাশ বের করে। সেতু বাঁধা শুরু করতে অবস্থানের অনুমতি দিন।",
  "settings.conn.grant_location": "অবস্থানের অনুমতি দিন",
  "settings.conn.grant_short": "দিন",
  "settings.conn.orbot_body":
    "Airhop Tor-এর যাতায়াত Orbot দিয়ে ঘোরায়। Play Store থেকে Orbot বসিয়ে চালু করে তারপর এটি চালু করুন।",
  "settings.conn.internet_off": "ইন্টারনেট বন্ধ",
  "settings.conn.internet_off_desc":
    "Tor, সেতু ও গেটওয়ে সবই ইন্টারনেট ব্যবহার করে। সেগুলো চালাতে নেটওয়ার্কে ইন্টারনেট বিকল্প চালু করুন।",
  "settings.conn.turn_on": "চালু করুন",
  "settings.conn.turn_off": "বন্ধ করুন",
  "settings.conn.orbot_title": "Android-এ Tor",
  "settings.conn.get_orbot": "Orbot নিন",
  "settings.conn.later": "পরে",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "ব্লুটুথ",
  "settings.permissions.bluetooth_desc":
    "কাছের ডিভাইস খুঁজে বের করে আর তাদের মধ্যে বার্তা পার করে। এটি ছাড়া মেশ চলতে পারে না।",
  "settings.permissions.location": "অবস্থান",
  "settings.permissions.location_desc":
    "কাছের এলাকার চ্যানেল খোলে। এটি ছাড়া সেই চ্যানেলগুলো বন্ধ থাকে আর ব্লুটুথ মেশ যথারীতি চলে।",
  "settings.permissions.notifications": "বিজ্ঞপ্তি",
  "settings.permissions.notifications_desc":
    "অ্যাপ বন্ধ থাকলেও নতুন বার্তার খবর পান। এটি ছাড়া কেবল Airhop খুললেই সেগুলো দেখবেন।",
  "settings.permissions.camera": "ক্যামেরা",
  "settings.permissions.camera_desc":
    "QR কোড স্ক্যান করে আর পাঠানোর জন্য ছবি বা ভিডিও তোলে। এটি ছাড়াও লাইব্রেরি থেকে মিডিয়া ভাগ করতে পারবেন।",
  "settings.permissions.photos": "ছবি",
  "settings.permissions.photos_desc":
    "লাইব্রেরি থেকে ছবি পাঠায় আর পাওয়া মিডিয়া সংরক্ষণ করে। এটি ছাড়াও ক্যামেরা দিয়ে নতুন ছবি তুলে পাঠাতে পারবেন।",
  "settings.permissions.microphone": "মাইক্রোফোন",
  "settings.permissions.microphone_desc":
    "ভয়েস বার্তা রেকর্ড করে পাঠায় বা সরাসরি কথা চালায়। এটি ছাড়া ভয়েস বার্তা ও সরাসরি কথা কাজ করবে না।",
  "settings.permissions.allow": "এই অনুমতিটি দিন",
  "settings.permissions.open_settings": "এই অনুমতি বদলাতে সিস্টেম সেটিংস খুলুন",
  "settings.permissions.system": "সিস্টেম",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "নেটওয়ার্ক ব্যবহার",
  "settings.storage.storage_usage": "সংরক্ষণ ব্যবহার",
  "settings.storage.storage_usage_desc":
    "বার্তা, ওয়ালেটের প্রমাণ ও জমা রাখা সংযুক্তি",
  "settings.storage.session_usage": "এই দফা · {sent} পাঠানো, {received} পাওয়া",
  "settings.storage.cache": "ক্যাশ",
  "settings.storage.cache_desc": "{size} সংযুক্তি",
  "settings.storage.clear_cache": "সংযুক্তির ক্যাশ খালি করুন",
  "settings.storage.clear": "খালি করুন",
  "settings.storage.clear_title": "জমা রাখা মিডিয়া খালি করবেন?",
  "settings.storage.clear_body":
    "ছবি, ভিডিও, ভয়েস নোট ও ফাইল এই ডিভাইস থেকে সরে যায়, পাঠানো ও পাওয়া দুটোই। সেগুলো আর নামানো যায় না: তাদের বুদবুদে তা লেখা থাকবে, আর আপনি প্রেরককে আবার পাঠাতে বলতে পারেন। বার্তা ও ওয়ালেট অক্ষত থাকে।",
  "settings.storage.cleared": "ক্যাশ খালি হয়েছে",
  "settings.storage.freed": "{size} খালি হয়েছে।",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "চেহারা {value} করুন",
  "settings.font.set_a11y": "মনোস্পেস ফন্ট {value} করুন",
  "settings.font.system": "সিস্টেম",
  "settings.font.system_desc": "আপনার ডিভাইসের আদি মনোস্পেস ফন্ট ব্যবহার করে",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "আধুনিক আর পড়তে সহজ",
  "settings.language.en": "ইংরেজি",
  "settings.language.am": "আমহারিক",
  "settings.language.ar": "আরবি",
  "settings.language.bn": "বাংলা",
  "settings.language.my": "বর্মি",
  "settings.language.zh_hans": "চীনা (সরলীকৃত)",
  "settings.language.zh_hant": "চীনা (প্রচলিত)",
  "settings.language.nl": "ওলন্দাজ",
  "settings.language.fil": "ফিলিপিনো",
  "settings.language.fr": "ফরাসি",
  "settings.language.ka": "জর্জিয়ান",
  "settings.language.de": "জার্মান",
  "settings.language.hi": "হিন্দি",
  "settings.language.id": "ইন্দোনেশীয়",
  "settings.language.it": "ইতালীয়",
  "settings.language.ja": "জাপানি",
  "settings.language.ko": "কোরীয়",
  "settings.language.mg": "মালাগাসি",
  "settings.language.ms": "মালয়",
  "settings.language.ne": "নেপালি",
  "settings.language.fa": "ফারসি",
  "settings.language.pl": "পোলিশ",
  "settings.language.pt_br": "পর্তুগিজ (ব্রাজিল)",
  "settings.language.pt_pt": "পর্তুগিজ (পর্তুগাল)",
  "settings.language.pa": "পাঞ্জাবি",
  "settings.language.ru": "রুশ",
  "settings.language.es": "স্প্যানিশ",
  "settings.language.sw": "সোয়াহিলি",
  "settings.language.sv": "সুইডিশ",
  "settings.language.ta": "তামিল",
  "settings.language.th": "থাই",
  "settings.language.tr": "তুর্কি",
  "settings.language.uk": "ইউক্রেনীয়",
  "settings.language.ur": "উর্দু",
  "settings.language.vi": "ভিয়েতনামি",
  "settings.language.pseudo": "ছদ্মলোকেল",
  "settings.language.soon": "শিগগিরই আসছে",
  "settings.language.soon_a11y": "{value}, শিগগিরই আসছে",
  "settings.language.set_a11y": "ভাষা {value} করুন",
  "settings.language.pending": "পরের বার খুললে",
  "settings.language.pending_a11y": "{value}, পরের বার Airhop খুললে চালু হবে",
  "settings.language.rtl_restart": "এখনই খুলুন",
  "settings.language.rtl_title": "শেষ করতে Airhop আবার খুলুন",
  "settings.language.rtl_body":
    "{value} ডান থেকে বাঁয়ে পড়া হয়, আর Airhop কেবল চালু হওয়ার সময়ই দিক বদলাতে পারে। বদল শেষ করতে এটি বন্ধ করে আবার খুলুন। কিছুই হারায় না, আর ততক্ষণ আপনার মেশ যুক্তই থাকে।",
  "settings.theme.light": "হালকা",
  "settings.theme.light_desc": "সবসময় হালকা রঙ ব্যবহার করে",
  "settings.theme.dark": "গাঢ়",
  "settings.theme.dark_desc": "সবসময় গাঢ় রঙ ব্যবহার করে",

  // ---- Settings: profile and identity ----
  "settings.status.online": "অনলাইন",
  "settings.status.online_desc": "খুঁজে পাওয়া যায়, সম্প্রচার ও খোঁজা চলছে",
  "settings.status.away": "দূরে",
  "settings.status.away_desc": "মেশ থেমে আছে, খোঁজা বা সম্প্রচার কিছুই নয়",
  "settings.status.invisible": "অদৃশ্য",
  "settings.status.invisible_desc": "খুঁজছে, কিন্তু নিজে ধরা পড়ছে না",
  "settings.status.title": "অবস্থা",
  "settings.status.set_a11y": "অবস্থা {value} করুন",
  "settings.status.edit": "অবস্থা বদলান",
  "settings.status.desc": "মেশে আপনি কতটা দেখা যাবেন বাছুন।",
  "settings.transfer.identity": "পরিচয় ও কী",
  "settings.transfer.identity_desc":
    "আপনার পিয়ার আইডি, ব্যবহারকারী নাম ও পরিচিতি",
  "settings.transfer.chats": "চ্যাট ও ইতিহাস",
  "settings.transfer.chats_desc":
    "কথোপকথন, গ্রুপ, আর আপনি যে চ্যানেলে যোগ দিয়েছেন",
  "settings.transfer.wallet": "ওয়ালেটের ব্যালেন্স",
  "settings.transfer.wallet_desc": "Cashu প্রমাণ ও লেনদেনের ইতিহাস",
  "settings.transfer.title": "নতুন ফোনে সরান",
  "settings.transfer.desc":
    "আপনার পরিচয়, চ্যাট ও ওয়ালেট অন্য একটি ডিভাইসে সরান",
  "settings.transfer.coming_soon_a11y": "নতুন ফোনে সরান, শিগগিরই আসছে",
  "settings.transfer.body":
    "দুটি ফোন একসঙ্গে ধরে ব্লুটুথে সবকিছু পার করে দিন। কিছুই কোনো সার্ভারের ভেতর দিয়ে যায় না, তাই ইন্টারনেট ছাড়াই চলে।",
  "settings.qr.permission_label": "ছবির অনুমতি",
  "settings.qr.permission_purpose": "আপনার QR কোড সংরক্ষণ করতে",
  "settings.qr.saved": "সংরক্ষিত",
  "settings.qr.saved_body": "QR কোড আপনার ছবির লাইব্রেরিতে সংরক্ষিত হয়েছে।",
  "settings.qr.save_failed": "সংরক্ষণ করা গেল না",
  "settings.qr.save_failed_body":
    "QR কোডটি সংরক্ষণ করা গেল না। আবার চেষ্টা করুন।",
  "settings.qr.share_message": "Airhop-এ আমাকে যোগ করুন",
  "settings.qr.share_body":
    "Airhop-এ আমাকে যোগ করুন — অফলাইন-প্রথম, ব্যক্তিগত মেশ বার্তা।",
  "settings.qr.show_short": "QR দেখান",
  "settings.qr.title": "আপনার QR কোড",
  "settings.qr.note":
    "এতে আপনার পাবলিক কী আছে, যা দিয়ে অন্যরা যেকোনো জায়গা থেকে আপনাকে বার্তা পাঠাতে পারে। কেবল বিশ্বাসী লোকদের সঙ্গেই এটি ভাগ করুন। নিজের পরিচয় মুছে না ফেলা পর্যন্ত এটি বদলায় না।",
  "settings.qr.code_label": "পরিচিতি কোড",
  "settings.qr.copy_code": "পরিচিতি কোড কপি করুন",
  "settings.qr.share": "QR কোড ভাগ করুন",
  "settings.qr.share_short": "QR ভাগ করুন",
  "settings.qr.download": "QR কোড নামান",
  "settings.qr.download_short": "QR নামান",
  "settings.qr.show": "QR কোড দেখান",
  "settings.wipe.trigger": "জরুরি মোছা চালু করুন",
  "settings.wipe.trigger_desc":
    "নিশ্চিত না করেই সঙ্গে সঙ্গে মুছতে তিনবার ট্যাপ করুন",
  "settings.wipe.title": "জরুরি মোছা",
  "settings.wipe.now": "এখনই মুছুন",
  "settings.wipe.desc": "সব কী, বার্তা ও প্রমাণ সঙ্গে সঙ্গে ধ্বংস করে",
  "settings.wipe.body":
    "এটি আপনার সব কী, বার্তা ও ওয়ালেটের প্রমাণ সঙ্গে সঙ্গে ধ্বংস করবে। এটি আর ফেরানো যাবে না।",
  "settings.wipe.in_progress": "মোছা হচ্ছে",
  "settings.wipe.in_progress_body":
    "আপনার কী, বার্তা ও ফাইল ধ্বংস করা হচ্ছে। এতে কয়েক সেকেন্ড লাগে, আর অ্যাপ বন্ধ হয়ে গেলেও নিজে থেকেই শেষ হয়।",
  "settings.wipe.got_it": "বুঝেছি",
  "settings.wipe.keys_failed": "কী ধ্বংস করা গেল না",
  "settings.wipe.keys_failed_body":
    "আপনার বার্তা, পরিচিতি ও ওয়ালেট গেছে, কিন্তু ডিভাইসটি আপনার কী ছাড়তে রাজি হয়নি। ডিভাইসের তালা খুলে আবার মুছুন।",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "আমাদের সঙ্গে যোগাযোগ করুন",
  "settings.help.contact_a11y": "{address}-এ ইমেল করুন",
  "settings.help.bug": "একটি ত্রুটি জানান",
  "settings.help.bug_desc": "GitHub-এ একটি issue খুলুন",
  "settings.help.bug_a11y": "GitHub-এ একটি ত্রুটি জানান",
  "settings.help.faq": "সচরাচর জিজ্ঞাস্য",
  "settings.help.faq_desc": "সাধারণ প্রশ্নের উত্তর",
  "settings.help.faq_a11y": "প্রশ্নোত্তর খুলুন",
  "settings.help.terms_desc": "Airhop কীভাবে ব্যবহার করা যায়",
  "settings.help.terms_a11y": "পরিষেবার শর্তাবলি খুলুন",
  "settings.help.privacy_desc": "আমরা যা সংগ্রহ করি না",
  "settings.help.privacy_a11y": "গোপনীয়তা নীতি খুলুন",

  // ---- Settings: support ----
  "settings.support.card": "কার্ড বা UPI",
  "settings.support.card_desc": "নেটব্যাংকিং ও ওয়ালেট, বিশ্বজুড়ে",
  "settings.support.card_a11y":
    "কার্ড, UPI, নেটব্যাংকিং বা ওয়ালেট দিয়ে সহায়তা করুন",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "মাসিক বা একবার, প্ল্যাটফর্ম ফি ছাড়াই",
  "settings.support.sponsors_a11y": "GitHub Sponsors-এর মাধ্যমে সহায়তা করুন",
  "settings.support.note":
    "আমি অবসর সময়ে Airhop বানাই। কোনো বিনিয়োগকারী নেই, বিজ্ঞাপনও নেই। এটি আপনার কাজে লাগলে একটি অবদান উন্নয়ন চালু রাখতে অনেকখানি সাহায্য করে। যেভাবেই হোক প্রতিটি সুবিধা বিনামূল্যেই থাকে।",

  // ---- Settings: about and version ----
  "settings.about.version": "সংস্করণ",
  "settings.about.version_desc": "এখনকার প্রকাশ",
  "settings.about.version_a11y": "সংস্করণ দেখুন ও হালনাগাদ খুঁজুন",
  "settings.about.release_notes": "প্রকাশের নোট",
  "settings.about.release_notes_desc": "সবশেষ প্রকাশে নতুন কী আছে",
  "settings.about.release_notes_a11y": "GitHub-এ সবশেষ প্রকাশের নোট খুলুন",
  "settings.about.source": "উৎস কোড",
  "settings.about.source_a11y": "GitHub-এ উৎস কোড খুলুন",
  "settings.about.licenses": "ওপেন সোর্স লাইসেন্স",
  "settings.about.open_repo": "{name} রিপোজিটরি খুলুন",
  "settings.about.licenses_desc": "তৃতীয় পক্ষের ওপেন সোর্স প্যাকেজ",
  "settings.about.licenses_a11y": "তৃতীয় পক্ষের লাইসেন্স দেখুন",
  "settings.version.codename": "সাংকেতিক নাম",
  "settings.version.checking": "দেখা হচ্ছে",
  "settings.version.check": "হালনাগাদ খুঁজুন",
  "settings.version.checking_title": "হালনাগাদ খোঁজা হচ্ছে",
  "settings.version.up_to_date": "আপনি সবশেষ সংস্করণেই আছেন।",
  "settings.version.release_notes": "প্রকাশের নোট দেখুন",
  "settings.version.made_with": "তৈরি হয়েছে",
  "settings.version.number": "সংস্করণ {version}",
  "settings.version.update_to": "{version}-এ হালনাগাদ করুন",
  "settings.version.update_to_a11y": "সংস্করণ {version}-এ হালনাগাদ করুন",
  "settings.version.released_under": "{license}-এর অধীনে প্রকাশিত",
  "settings.version.notes_a11y": "সংস্করণ {version}-এর প্রকাশের নোট দেখুন",
  "settings.version.tor_paused":
    "Tor চালু থাকলে হালনাগাদ খোঁজা থামানো থাকে, যাতে আপনার IP ফাঁস না হয়। ব্রাউজারে প্রকাশের পাতাটি দেখুন।",
  "settings.version.check_failed":
    "হালনাগাদ খোঁজা গেল না। আপনার সংযোগ দেখে আবার চেষ্টা করুন।",
  "settings.version.downloading": "ডাউনলোড হচ্ছে {percent}%",
  "settings.version.install": "ইনস্টল করুন",
  "settings.version.download_failed":
    "ডাউনলোড ব্যর্থ হয়েছে। আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} {size} KiB, যা {cap} KiB সীমার বেশি।",
  "transfer.failed.malformed":
    "একটি সংযুক্তি নষ্ট অবস্থায় পৌঁছেছে এবং খোলা গেল না। তাদের আবার পাঠাতে বলুন।",
  "transfer.failed.unsupported_type":
    "একটি সংযুক্তি এমন ধরনে পৌঁছেছে যা এই অ্যাপ খুলতে পারে না।",
  "transfer.failed.type_mismatch":
    "একটি সংযুক্তি ফিরিয়ে দেওয়া হয়েছে: এর ভেতরের জিনিস যে ধরন দাবি করেছিল তার সঙ্গে মেলে না।",
  "transfer.failed.storage":
    "একটি সংযুক্তি পৌঁছেছে কিন্তু সংরক্ষণ করা গেল না। খালি জায়গা দেখুন।",
  "transfer.badge.waiting": "অপেক্ষায় · {name}",
  "transfer.badge.active_count": "{count}টি স্থানান্তর",
  "transfer.badge.sending": "{name} পাঠানো হচ্ছে",
  "transfer.badge.receiving": "{name} পাওয়া হচ্ছে",
  "transfer.badge.a11y": "{label}, {percent} শতাংশ। কথোপকথন খুলুন।",
  "transfer.kind.photo": "ছবি",
  "transfer.kind.video": "ভিডিও",
  "transfer.kind.voice": "ভয়েস নোট",
  "transfer.this.photo": "এই ছবিটি",
  "transfer.this.video": "এই ভিডিওটি",
  "transfer.this.voice": "এই ভয়েস নোটটি",
  "transfer.this.file": "এই ফাইলটি",
  "transfer.kind.document": "নথি",
  "transfer.kind.voice_preview": "ভয়েস নোট",
  "transfer.kind.photo_preview": "ছবি",
  "transfer.kind.video_preview": "ভিডিও",
  "transfer.kind.document_preview": "নথি",

  // ---- System notifications ----
  "notif.channel.messages": "বার্তা",
  "notif.channel.nearby": "কাছের পিয়ার",
  "notif.channel.nearby_desc":
    "মেশ ব্লুটুথের নাগালে লোক পেলে মাঝেমধ্যে একটি খবর।",
  "notif.nearby.body": "এখন ব্লুটুথের নাগালে। মেশ খুলতে ট্যাপ করুন।",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "কেউ একজন",
  "notif.notice_urgent": "জরুরি নোটিশ · {content}",
  "notif.notice": "নোটিশ · {content}",
  "notif.incoming_file": "আসছে এমন ফাইল",
  "notif.preview.photo": "📷 ছবি",
  "notif.preview.voice": "🎤 ভয়েস বার্তা",
  "notif.preview.video": "🎥 ভিডিও",
  "notif.preview.document": "📄 নথি",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "নতুন বার্তা",
  "notif.hidden.channel": "নতুন কার্যকলাপ",
  "notif.hidden.mention": "আপনাকে উল্লেখ করা হয়েছে",
  "notif.mention.title": "{sender} আপনাকে উল্লেখ করেছেন",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "আরও {count}টি দেখান",
    other: "আরও {count}টি দেখান",
  },
  "chat.channels.show_more_a11y": {
    one: "আরও {count}টি ডিফল্ট চ্যানেল দেখান",
    other: "আরও {count}টি ডিফল্ট চ্যানেল দেখান",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count}টি অপঠিত",
    other: "{label}, {count}টি অপঠিত",
  },
  "a11y.new_count": {
    one: "{label}, {count}টি নতুন",
    other: "{label}, {count}টি নতুন",
  },
  "chat.a11y.unread": {
    one: "{count}টি অপঠিত",
    other: "{count}টি অপঠিত",
  },
  "chat.thread.length_left": {
    one: "{count}টি বাকি",
    other: "{count}টি বাকি",
  },
  "settings.general.retention_days": {
    one: "{count} দিন",
    other: "{count} দিন",
  },
  "chat.info.group_reach": {
    one: "{count} জন সদস্যের মধ্যে {reachable} জনের নাগাল আছে",
    other: "{count} জন সদস্যের মধ্যে {reachable} জনের নাগাল আছে",
  },
  "chat.group_members": {
    one: "ব্যক্তিগত গ্রুপ  ·  {count} জন সদস্য",
    other: "ব্যক্তিগত গ্রুপ  ·  {count} জন সদস্য",
  },
  "chat.select.count": {
    one: "{count}টি নির্বাচিত",
    other: "{count}টি নির্বাচিত",
  },
  "chat.select.forward": {
    one: "{count}টি বার্তা ফরোয়ার্ড করুন",
    other: "{count}টি বার্তা ফরোয়ার্ড করুন",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} জন কথা বলছেন",
    other: "{count} জন কথা বলছেন",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "নাগালে {count}টি পিয়ার",
    other: "নাগালে {count}টি পিয়ার",
  },
  "mesh.peer.hops_away": {
    one: "{count} হপ দূরে",
    other: "{count} হপ দূরে",
  },
  "chat.presence.active": {
    one: "{count} জন সক্রিয়",
    other: "{count} জন সক্রিয়",
  },
  "chat.presence.nearby": {
    one: "{count} জন কাছে",
    other: "{count} জন কাছে",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count}টি মিন্ট",
    other: "{count}টি মিন্ট",
  },
  "wallet.mint.remove_body": {
    one: "{mint}-এ {count}টি প্রমাণে {balance} {unit} আছে। সরালে সেই প্রমাণ এই ডিভাইস থেকে চিরতরে মুছে যাবে, আর তার কোনো ব্যাকআপ নেই। আগে ব্যালেন্সটি তুলে নিন বা পাঠিয়ে দিন।",
    other:
      "{mint}-এ {count}টি প্রমাণে {balance} {unit} আছে। সরালে সেই প্রমাণগুলো এই ডিভাইস থেকে চিরতরে মুছে যাবে, আর তার কোনো ব্যাকআপ নেই। আগে ব্যালেন্সটি তুলে নিন বা পাঠিয়ে দিন।",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count}টি জমা পেমেন্টের অপেক্ষায়। অ্যাপ খোলার প্রতিবারই সেগুলো আবার দেখা হয়।",
    other:
      "{count}টি জমা পেমেন্টের অপেক্ষায়। অ্যাপ খোলার প্রতিবারই সেগুলো আবার দেখা হয়।",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints} থেকে {count}টি খরচ না হওয়া প্রমাণ উদ্ধার করা হয়েছে।",
    other: "{mints} থেকে {count}টি খরচ না হওয়া প্রমাণ উদ্ধার করা হয়েছে।",
  },
  "wallet.backup.already_spent": {
    one: "{count}টি মুদ্রা পাওয়া গেছে, কিন্তু সেটি আগেই খরচ হয়ে গেছে, তাই তার জন্য কিছু জমা হয়নি। এটি স্বাভাবিক: আপনি কখনো খরচ করেছেন এমন প্রতিটি মুদ্রাই মিন্টের রাখা নথিতে থেকে যায়।",
    other:
      "{count}টি মুদ্রা পাওয়া গেছে, কিন্তু সেগুলো আগেই খরচ হয়ে গেছে, তাই সেগুলোর জন্য কিছু জমা হয়নি। এটি স্বাভাবিক: আপনি কখনো খরচ করেছেন এমন প্রতিটি মুদ্রাই মিন্টের রাখা নথিতে থেকে যায়।",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "আরও {count}টি দেখান",
    other: "আরও {count}টি দেখান",
  },
  "wallet.activity.show_more_a11y": {
    one: "আরও {count}টি পেমেন্ট দেখান",
    other: "আরও {count}টি পেমেন্ট দেখান",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count}টি অনিশ্চিত",
    other: "{count}টি অনিশ্চিত",
  },
  "wallet.proof_count": {
    one: "{count}টি প্রমাণ",
    other: "{count}টি প্রমাণ",
  },
  "wallet.spent_removed_detail": {
    one: "{count}টি প্রমাণ আগেই খরচ হয়ে গিয়েছিল, আর সেটি সরিয়ে দেওয়া হয়েছে।",
    other:
      "{count}টি প্রমাণ আগেই খরচ হয়ে গিয়েছিল, আর সেগুলো সরিয়ে দেওয়া হয়েছে।",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "কাছে একজন আছেন",
    other: "কাছে {count} জন আছেন",
  },
};

export const bn = { strings, plurals };
