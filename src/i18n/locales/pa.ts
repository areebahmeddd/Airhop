// pa: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "ਰੱਦ ਕਰੋ",
  "common.done": "ਹੋ ਗਿਆ",
  "common.ok": "ਠੀਕ ਹੈ",
  "common.close": "ਬੰਦ ਕਰੋ",
  "common.back": "ਵਾਪਸ",
  "common.delete": "ਮਿਟਾਓ",
  "common.remove": "ਹਟਾਓ",
  "common.add": "ਜੋੜੋ",
  "common.copy": "ਨਕਲ ਕਰੋ",
  "common.copied": "ਨਕਲ ਹੋ ਗਿਆ",
  "common.share": "ਸਾਂਝਾ ਕਰੋ",
  "common.continue": "ਜਾਰੀ ਰੱਖੋ",
  "common.try_again": "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
  "common.settings": "ਸੈਟਿੰਗਾਂ",
  "common.on": "ਚਾਲੂ",
  "common.off": "ਬੰਦ",

  // ---- Dates ----
  "format.today": "ਅੱਜ",
  "format.yesterday": "ਕੱਲ੍ਹ",
  "format.minutes_ago": "{count} ਮਿੰਟ ਪਹਿਲਾਂ",
  "format.hours_ago": "{count} ਘੰਟੇ ਪਹਿਲਾਂ",
  "format.days_ago": "{count} ਦਿਨ ਪਹਿਲਾਂ",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "ਗੱਲਬਾਤਾਂ",
  "nav.tab.mesh": "ਮੈਸ਼",
  "nav.tab.wallet": "ਵਾਲਿਟ",
  "nav.tab.profile": "ਤੁਸੀਂ",
  "a11y.tab.new_peers": "{label}, ਕੋਈ ਨਵਾਂ ਨੇੜੇ",
  "nav.notifications": "ਸੂਚਨਾਵਾਂ",
  "chat.subtab.channels": "ਚੈਨਲ",
  "chat.subtab.direct": "ਸਿੱਧੇ",
  "chat.subtab.dms": "ਸਿੱਧੇ ਸੁਨੇਹੇ",
  "chat.search.placeholder": "ਗੱਲਬਾਤਾਂ ਖੋਜੋ…",
  "chat.search.a11y": "ਗੱਲਬਾਤਾਂ ਅਤੇ ਸੁਨੇਹੇ ਖੋਜੋ",
  "chat.search.close": "ਖੋਜ ਬੰਦ ਕਰੋ",
  "chat.search.clear": "ਖੋਜ ਸਾਫ਼ ਕਰੋ",
  "mesh.view.radar": "ਰਡਾਰ ਝਲਕ",
  "mesh.view.list": "ਸੂਚੀ ਝਲਕ",
  "mesh.view.radar_short": "ਰਡਾਰ",
  "mesh.view.list_short": "ਸੂਚੀ",

  // ---- Legal document names ----
  "legal.last_updated": "ਆਖ਼ਰੀ ਵਾਰ ਬਦਲਿਆ: {date}",
  "legal.terms": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",
  "legal.privacy": "ਨਿੱਜਤਾ ਨੀਤੀ",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "ਨਿੱਜੀ ਮੈਸ਼ ਸੰਚਾਰ",
  "onboarding.welcome.cta": "ਸ਼ੁਰੂ ਕਰੋ",
  "onboarding.welcome.cta_hint": "ਜਾਰੀ ਰੱਖਣ ਲਈ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਮੰਨੋ",
  "onboarding.welcome.consent_a11y": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ ਅਤੇ ਨਿੱਜਤਾ ਨੀਤੀ ਮੰਨੋ",
  "onboarding.welcome.open_terms": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ ਖੋਲ੍ਹੋ",
  "onboarding.welcome.open_privacy": "ਨਿੱਜਤਾ ਨੀਤੀ ਖੋਲ੍ਹੋ",
  "onboarding.welcome.consent":
    "{cta} ਦਬਾਉਣ ਨਾਲ ਤੁਸੀਂ ਸਾਡੀਆਂ {terms} ਅਤੇ {privacy} ਮੰਨਦੇ ਹੋ।",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "ਤੁਹਾਡੀ ਪਛਾਣ ਬਣਾ ਰਹੇ ਹਾਂ",
  "onboarding.identity.body":
    "ਇਸ ਡੀਵਾਈਸ ’ਤੇ Ed25519 ਕੁੰਜੀ ਜੋੜਾ ਬਣਾ ਰਹੇ ਹਾਂ।\nਕੁਝ ਵੀ ਕਿਤੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ।",
  "onboarding.identity.failed_heading": "ਤੁਹਾਡੀਆਂ ਕੁੰਜੀਆਂ ਨਹੀਂ ਬਣ ਸਕੀਆਂ",
  "onboarding.identity.failed_body":
    "ਇਸ ਡੀਵਾਈਸ ਨੇ Airhop ਨੂੰ ਇਹ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਸੰਭਾਲਣ ਨਹੀਂ ਦਿੱਤਾ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ, ਜਾਂ ਆਪਣਾ ਫ਼ੋਨ ਮੁੜ ਚਾਲੂ ਕਰ ਕੇ Airhop ਦੁਬਾਰਾ ਖੋਲ੍ਹੋ।",
  "onboarding.identity.steps_a11y": "ਕਦਮ: {steps}",
  "onboarding.identity.step.x25519": "X25519 ਪੱਕਾ ਕੁੰਜੀ ਜੋੜਾ ਬਣਾ ਰਹੇ ਹਾਂ",
  "onboarding.identity.step.ed25519": "Ed25519 ਦਸਤਖ਼ਤੀ ਕੁੰਜੀ ਜੋੜਾ ਬਣਾ ਰਹੇ ਹਾਂ",
  "onboarding.identity.step.keychain": "OS ਕੀਚੇਨ ਵਿੱਚ ਕੁੰਜੀਆਂ ਸੰਭਾਲ ਰਹੇ ਹਾਂ",
  "onboarding.identity.step.peer_id": "ਪੀਅਰ ID ਕੱਢ ਰਹੇ ਹਾਂ",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "ਮੈਸ਼ ’ਤੇ ਤੁਹਾਡਾ ਨਾਂ",
  "onboarding.username.peer_id": "ਪੀਅਰ ID",
  "onboarding.username.card_a11y":
    "ਮੈਸ਼ ’ਤੇ ਤੁਹਾਡਾ ਨਾਂ {username} ਹੈ। ਪੀਅਰ ID {peerID}। {props}।",
  "onboarding.username.explanation":
    "ਇਹ ਵਰਤੋਂਕਾਰ-ਨਾਂ ਤੁਹਾਡੀ ਜਨਤਕ ਕੁੰਜੀ ਤੋਂ ਪੱਕੇ ਤਰੀਕੇ ਨਾਲ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਜੋ ਵੀ ਡੀਵਾਈਸ ਤੁਹਾਡੀ ਪੀਅਰ ID ਦੇਖਦਾ ਹੈ, ਉਸ ’ਤੇ ਇਹ ਉਹੀ ਰਹਿੰਦਾ ਹੈ।",
  "onboarding.username.cta": "Airhop ਵਿੱਚ ਵੜੋ",
  "onboarding.username.prop.algorithm": "ਐਲਗੋਰਿਦਮ",
  "onboarding.username.prop.storage": "ਭੰਡਾਰ",
  "onboarding.username.prop.storage_value": "ਸਿਰਫ਼ OS ਕੀਚੇਨ",
  "onboarding.username.prop.account": "ਖਾਤਾ ਲੋੜੀਂਦਾ",
  "onboarding.username.prop.account_value": "ਕੋਈ ਨਹੀਂ",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
  "onboarding.hello.p1":
    "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। Airhop bitchat ਦੇ ਉੱਤੇ ਇੱਕ ਵੱਖਰੇ, ਖੁੱਲ੍ਹੇ ਸਰੋਤ ਵਾਲੇ ਪਾਸੇ ਦੇ ਪ੍ਰੋਜੈਕਟ ਵਜੋਂ ਬਣਾਇਆ ਗਿਆ ਹੈ। ਇਹ ਨਾ bitchat ਪ੍ਰੋਜੈਕਟ ਜਾਂ permissionless tech ਨਾਲ ਜੁੜਿਆ ਹੋਇਆ ਹੈ ਨਾ ਉਹਨਾਂ ਵੱਲੋਂ ਪਰਵਾਨ, ਬੱਸ ਕੁਝ ਅਜਿਹਾ ਹੈ ਜੋ ਬਣਾਉਣਾ ਅਤੇ ਭਾਈਚਾਰੇ ਨਾਲ ਸਾਂਝਾ ਕਰਨਾ ਮੈਨੂੰ ਚੰਗਾ ਲੱਗਦਾ ਹੈ।",
  "onboarding.hello.p2":
    "ਇਹ iOS ਅਤੇ Android ਲਈ ਪਹਿਲੀ ਰਿਲੀਜ਼ ਹੈ, ਇਸ ਲਈ ਭਾਵੇਂ ਮੈਂ ਇਸ ਨੂੰ ਦੋਸਤਾਂ ਨਾਲ ਪਰਖਿਆ ਹੈ, ਤੁਹਾਨੂੰ ਸ਼ਾਇਦ ਕੁਝ ਖ਼ਰਾਬੀਆਂ ਮਿਲਣਗੀਆਂ। ਜੇ ਮਿਲਣ, ਜਾਂ ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਕਿਸੇ ਸਹੂਲਤ ਦਾ ਵਿਚਾਰ ਹੋਵੇ, ਤਾਂ ਮੈਂ ਸੁਣਨਾ ਚਾਹਾਂਗਾ। {github} ’ਤੇ issue ਖੋਲ੍ਹੋ ਜਾਂ ਮੈਨੂੰ {email} ’ਤੇ ਈਮੇਲ ਭੇਜੋ।",
  "onboarding.hello.p3":
    "ਜੇ Airhop ਤੁਹਾਡੇ ਕੰਮ ਦਾ ਹੈ ਤਾਂ {github} ’ਤੇ ਇੱਕ ਤਾਰਾ ਜਾਂ {store} ’ਤੇ ਇੱਕ ਸਮੀਖਿਆ ਛੱਡਣ ਬਾਰੇ ਸੋਚੋ। ਇਸ ਨਾਲ ਹੋਰ ਲੋਕਾਂ ਨੂੰ ਇਹ ਪ੍ਰੋਜੈਕਟ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਮਿਲਦੀ ਹੈ। ਅਜ਼ਮਾਉਣ ਲਈ ਧੰਨਵਾਦ!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "ਤੁਹਾਡਾ ਫ਼ੋਨ ਪੁੱਛੇ, ਉਸ ਤੋਂ ਪਹਿਲਾਂ",
  "onboarding.primer.lede": "ਇਹ ਹੈ ਕਿ ਹਰ ਇੱਕ ਕੀ ਕਰਦੀ ਹੈ, ਅਤੇ ਕੀ ਨਹੀਂ ਕਰਦੀ।",
  "onboarding.primer.bluetooth.title": "ਬਲੂਟੁੱਥ",
  "onboarding.primer.bluetooth.body":
    "ਨੇੜਲੇ ਡੀਵਾਈਸ ਲੱਭਦਾ ਹੈ ਅਤੇ ਉਹਨਾਂ ਵਿਚਕਾਰ ਸੁਨੇਹੇ ਅੱਗੇ ਭੇਜਦਾ ਹੈ। ਇਸੇ ਨਾਲ ਮੈਸ਼ ਬਣਦਾ ਹੈ ਅਤੇ ਇਹ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਦੇ ਚੱਲਦਾ ਹੈ।",
  "onboarding.primer.location.title": "ਟਿਕਾਣਾ",
  "onboarding.primer.location.body":
    "ਤੁਹਾਨੂੰ ਨੇੜਲੇ ਇਲਾਕੇ ਦੇ ਚੈਨਲਾਂ ਵਿੱਚ ਰੱਖਦਾ ਹੈ, ਇੱਕ ਬਲਾਕ ਤੋਂ ਲੈ ਕੇ ਇੱਕ ਖੇਤਰ ਤੱਕ। Airhop ਤੁਹਾਡਾ ਪਿੱਛਾ ਕਦੇ ਨਹੀਂ ਕਰਦਾ ਅਤੇ ਨਾ ਹੀ ਤੁਹਾਡਾ ਸਹੀ ਟਿਕਾਣਾ ਤੁਹਾਡੇ ਡੀਵਾਈਸ ਤੋਂ ਬਾਹਰ ਭੇਜਦਾ ਹੈ।",
  "onboarding.primer.notifications.title": "ਸੂਚਨਾਵਾਂ",
  "onboarding.primer.notifications.body":
    "ਐਪ ਬੰਦ ਹੋਣ ’ਤੇ ਵੀ ਨਵੇਂ ਸੁਨੇਹਿਆਂ ਦੀ ਸੂਚਨਾ ਲਵੋ। ਸੂਚਨਾਵਾਂ ਤੁਹਾਡੇ ਡੀਵਾਈਸ ’ਤੇ ਹੀ ਬਣਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ, ਕਿਸੇ ਸਰਵਰ ਦੀ ਕੋਈ ਭੂਮਿਕਾ ਨਹੀਂ।",
  "onboarding.primer.footnote":
    "ਤੁਸੀਂ ਨਾਂਹ ਵੀ ਕਰ ਸਕਦੇ ਹੋ। ਸੁਨੇਹੇ ਫਿਰ ਵੀ ਇੰਟਰਨੈੱਟ ’ਤੇ ਸਫ਼ਰ ਕਰਦੇ ਹਨ, ਅਤੇ ਤੁਸੀਂ ਬਾਅਦ ਵਿੱਚ ਸੈਟਿੰਗਾਂ ਵਿੱਚੋਂ ਆਪਣਾ ਮਨ ਬਦਲ ਸਕਦੇ ਹੋ।",
  "onboarding.primer.cta_a11y": "ਇਜਾਜ਼ਤ ਦੇ ਸਵਾਲਾਂ ਵੱਲ ਜਾਰੀ ਰੱਖੋ",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ",
  "permission.bluetooth.purpose": "ਮੈਸ਼ ’ਤੇ ਨੇੜਲੇ ਡੀਵਾਈਸ ਲੱਭਣ",
  "permission.open_settings": "ਸੈਟਿੰਗਾਂ ਖੋਲ੍ਹੋ",
  "permission.not_now": "ਹੁਣ ਨਹੀਂ",
  "permission.blocked_title": "{label} ਬੰਦ ਹੈ",
  "permission.blocked_body": "{purpose} ਲਈ ਇਸ ਨੂੰ ਸੈਟਿੰਗਾਂ ਵਿੱਚੋਂ ਚਾਲੂ ਕਰੋ।",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "ਕੁਝ ਗੜਬੜ ਹੋ ਗਈ",
  "error.boundary.body":
    "Airhop ਨੂੰ ਅਚਾਨਕ ਕੋਈ ਸਮੱਸਿਆ ਆ ਗਈ ਅਤੇ ਜੋ ਇਹ ਦਿਖਾ ਰਿਹਾ ਸੀ, ਉਹ ਰੋਕਣਾ ਪਿਆ।",

  // ---- Chats: channel list ----
  "chat.channels.default": "ਮੂਲ ਚੈਨਲ",
  "chat.channels.yours": "ਤੁਹਾਡੇ ਚੈਨਲ",
  "chat.channels.none": "ਹਾਲੇ ਕੋਈ ਚੈਨਲ ਨਹੀਂ",
  "chat.channels.none_hint": "ਜੁੜਨ ਜਾਂ ਨਵਾਂ ਬਣਾਉਣ ਲਈ ਉੱਪਰ {plus} ਦਬਾਓ।",
  "chat.channels.none_desc":
    "ਹਾਲੇ ਕੋਈ ਚੈਨਲ ਨਹੀਂ। ਜੁੜਨ ਜਾਂ ਨਵਾਂ ਬਣਾਉਣ ਲਈ ਸਿਰਲੇਖ ਵਿਚਲਾ ਜੋੜਨ ਵਾਲਾ ਬਟਨ ਵਰਤੋ।",
  "chat.channels.show_fewer": "ਘੱਟ ਮੂਲ ਚੈਨਲ ਦਿਖਾਓ",
  "chat.channels.show_less": "ਘੱਟ ਦਿਖਾਓ",
  "chat.channels.info": "ਚੈਨਲ ਜਾਣਕਾਰੀ",
  "chat.channels.pin": "ਚੈਨਲ ਪਿੰਨ ਕਰੋ",
  "chat.channels.unpin": "ਚੈਨਲ ਅਨਪਿੰਨ ਕਰੋ",
  "chat.channels.mute": "ਚੈਨਲ ਮਿਊਟ ਕਰੋ",
  "chat.channels.unmute": "ਚੈਨਲ ਅਨਮਿਊਟ ਕਰੋ",
  "chat.channels.leave": "ਚੈਨਲ ਛੱਡੋ",
  "chat.channels.leave_confirm": "ਛੱਡੋ",
  "chat.channels.clear_body":
    "{name} ਦੇ ਸਾਰੇ ਸੁਨੇਹੇ ਮਿਟਾਉਣੇ ਹਨ? ਇਹ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ।",
  "chat.channels.leave_body":
    "{name} ਛੱਡਣਾ ਹੈ? ਤੁਹਾਨੂੰ ਇਸ ਦੇ ਸੁਨੇਹੇ ਮਿਲਣੇ ਬੰਦ ਹੋ ਜਾਣਗੇ, ਅਤੇ ਇਸ ਦਾ ਇਤਿਹਾਸ ਇਸ ਡੀਵਾਈਸ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਵੇਗਾ।",
  "chat.channels.more_options": "{name} ਲਈ ਹੋਰ ਵਿਕਲਪ",
  "chat.channels.teleported_tag": "{level}  ·  ਟੈਲੀਪੋਰਟ ਕੀਤਾ",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "ਗੱਲਬਾਤ ਸਾਫ਼ ਕਰੋ",
  "chat.dm.remove_contact": "ਸੰਪਰਕ ਹਟਾਓ",
  "chat.dm.block": "ਇਹ ਪੀਅਰ ਬਲਾਕ ਕਰੋ",
  "chat.dm.block_confirm": "ਬਲਾਕ ਕਰੋ",
  "chat.dm.delete": "ਗੱਲਬਾਤ ਮਿਟਾਓ",
  "chat.dm.delete_body":
    "ਇਹ ਗੱਲਬਾਤ ਤੁਹਾਡੀ ਸੂਚੀ ਵਿੱਚੋਂ ਹਟਾ ਦਿੰਦਾ ਹੈ ਅਤੇ ਇਸ ਦੇ ਸੁਨੇਹੇ ਮਿਟਾ ਦਿੰਦਾ ਹੈ। ਸੰਪਰਕ ਰਹਿ ਜਾਂਦਾ ਹੈ, ਅਤੇ ਉਹਨਾਂ ਵੱਲੋਂ ਨਵਾਂ ਸੁਨੇਹਾ ਆਉਣ ’ਤੇ ਨਵੀਂ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦੀ ਹੈ।",
  "chat.dm.in_range": "ਪਹੁੰਚ ਵਿੱਚ",
  "chat.dm.row_hint": "ਹੋਰ ਵਿਕਲਪਾਂ ਲਈ ਦੋ ਵਾਰ ਦਬਾ ਕੇ ਰੱਖੋ",
  "chat.channels.row_hint": "ਹੋਰ ਵਿਕਲਪਾਂ ਲਈ ਦੋ ਵਾਰ ਦਬਾ ਕੇ ਰੱਖੋ",
  "chat.dm.you_prefix": "ਤੁਸੀਂ:",
  "chat.dm.none": "ਕੋਈ ਸਿੱਧਾ ਸੁਨੇਹਾ ਨਹੀਂ",
  "chat.dm.none_desc":
    "ਇਨਕ੍ਰਿਪਟਡ DM ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਮੈਸ਼ ਟੈਬ ’ਤੇ ਜਾਓ ਅਤੇ ਕਿਸੇ ਪੀਅਰ ’ਤੇ ਦਬਾਓ।",
  "chat.dm.contact_info": "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
  "chat.dm.pin": "ਗੱਲਬਾਤ ਪਿੰਨ ਕਰੋ",
  "chat.dm.unpin": "ਗੱਲਬਾਤ ਅਨਪਿੰਨ ਕਰੋ",
  "chat.dm.mute": "ਗੱਲਬਾਤ ਮਿਊਟ ਕਰੋ",
  "chat.dm.unmute": "ਗੱਲਬਾਤ ਅਨਮਿਊਟ ਕਰੋ",
  "chat.dm.clear_body":
    "{name} ਨਾਲ ਸਾਰੇ ਸੁਨੇਹੇ ਮਿਟਾਉਣੇ ਹਨ? ਇਹ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ।",
  "chat.dm.remove_contact_body":
    "{name} ਨੂੰ ਹਟਾਉਣਾ ਹੈ? ਇਹ ਗੱਲਬਾਤ ਮਿਟਾ ਦਿੰਦਾ ਹੈ ਅਤੇ ਸੰਪਰਕ ਭੁਲਾ ਦਿੰਦਾ ਹੈ। ਜੇ ਉਹ ਦੁਬਾਰਾ ਸੁਨੇਹਾ ਭੇਜਣ ਤਾਂ ਉਹ ਫਿਰ ਵੀ ਤੁਹਾਡੇ ਤੱਕ ਪਹੁੰਚ ਸਕਦੇ ਹਨ।",
  "chat.dm.block_body":
    "{name} ਨੂੰ ਬਲਾਕ ਕਰਨਾ ਹੈ? ਤੁਹਾਨੂੰ ਉਹ ਮੈਸ਼ ਟੈਬ ’ਤੇ ਨਹੀਂ ਦਿਸਣਗੇ ਅਤੇ ਉਹਨਾਂ ਦੇ ਸੁਨੇਹੇ ਨਹੀਂ ਮਿਲਣਗੇ, ਭਾਵੇਂ ਉਹ ਨੇੜੇ ਹੀ ਹੋਣ।",
  "chat.dm.more_options": "{name} ਲਈ ਹੋਰ ਵਿਕਲਪ",
  "chat.dm.remove_contact_short": "ਸੰਪਰਕ ਹਟਾਓ",
  "chat.dm.block_short": "ਸੰਪਰਕ ਬਲਾਕ ਕਰੋ",
  "chat.dm.delete_short": "ਗੱਲਬਾਤ ਮਿਟਾਓ",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "ਸੁਨੇਹੇ ਸਾਫ਼ ਕਰੋ",
  "chat.clear_confirm": "ਸਾਫ਼ ਕਰੋ",
  "chat.group_badge": "ਗਰੁੱਪ",
  "chat.more": "ਹੋਰ",
  "chat.no_messages": "ਹਾਲੇ ਕੋਈ ਸੁਨੇਹਾ ਨਹੀਂ",
  "chat.you": "ਤੁਸੀਂ",
  "chat.a11y.channel": "ਚੈਨਲ {name}",
  "chat.a11y.group": "ਗਰੁੱਪ {name}",
  "chat.a11y.muted": "ਮਿਊਟ ਕੀਤਾ",
  "chat.a11y.pinned": "ਪਿੰਨ ਕੀਤਾ",

  // ---- Chats: start something new ----
  "chat.new.title": "ਕੁਝ ਨਵਾਂ ਸ਼ੁਰੂ ਕਰੋ",
  "chat.new.channel": "ਨਿੱਜੀ ਚੈਨਲ ਬਣਾਓ",
  "chat.new.channel_label": "ਨਿੱਜੀ ਚੈਨਲ",
  "chat.new.channel_desc":
    "ਇੱਕ ਕਮਰਾ ਜਿਸ ਵਿੱਚ ਲਿੰਕ ਵਾਲਾ ਕੋਈ ਵੀ ਜੁੜ ਸਕਦਾ ਹੈ। ਨਵਾਂ ਬਣਾਓ, ਜਾਂ ਤੁਹਾਨੂੰ ਭੇਜੇ ਲਿੰਕ ਨਾਲ ਜੁੜੋ।",
  "chat.new.group": "ਨਿੱਜੀ ਗਰੁੱਪ ਬਣਾਓ",
  "chat.new.group_label": "ਨਿੱਜੀ ਗਰੁੱਪ",
  "chat.new.group_desc":
    "ਖ਼ਾਸ ਲੋਕ ਚੁਣੋ। ਵੱਧ ਤੋਂ ਵੱਧ 16। ਬਲੂਟੁੱਥ ’ਤੇ ਹੀ ਰਹਿੰਦਾ ਹੈ।",
  "chat.new.place": "ਜੀਓਹੈਸ਼ ਰਾਹੀਂ ਕਿਸੇ ਥਾਂ ’ਤੇ ਜਾਓ",
  "chat.new.place_label": "ਕਿਸੇ ਥਾਂ ’ਤੇ ਜਾਓ",
  "chat.new.place_desc": "ਜੀਓਹੈਸ਼ ਰਾਹੀਂ ਕਿਤੇ ਵੀ ਟਿਕਾਣਾ ਚੈਨਲ ਖੋਲ੍ਹੋ।",
  "chat.new.reach": "ਪਹੁੰਚ",
  "chat.new.reach_internet":
    "ਮੈਂਬਰਾਂ ਤੱਕ ਬਲੂਟੁੱਥ ਅਤੇ ਇੰਟਰਨੈੱਟ ਦੋਵਾਂ ਰਾਹੀਂ ਪਹੁੰਚਦਾ ਹੈ।",
  "chat.new.reach_mesh":
    "ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਕੰਮ ਕਰਦਾ ਹੈ, ਇੰਟਰਨੈੱਟ ’ਤੇ ਨਹੀਂ।",
  "chat.new.reach_internet_desc":
    "ਮੈਂਬਰਾਂ ਤੱਕ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਵੀ ਪਹੁੰਚਦਾ ਹੈ। ਰਿਲੇ ਸਿਰਫ਼ ਇਹ ਦੇਖ ਸਕਦੇ ਹਨ ਕਿ ਚੈਨਲ ਚਾਲੂ ਹੈ, ਕਦੇ ਇਸ ਦੇ ਸੁਨੇਹੇ ਜਾਂ ਇਸ ਵਿੱਚ ਕੌਣ ਹੈ, ਇਹ ਨਹੀਂ।",
  "chat.new.reach_mesh_desc":
    "ਸਥਾਨਕ ਮੈਸ਼ ’ਤੇ ਹੀ ਰਹਿੰਦਾ ਹੈ। ਸਭ ਤੋਂ ਨਿੱਜੀ, ਕੁਝ ਵੀ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਜਾਂਦਾ।",
  "chat.new.join_link": "ਸੱਦਾ ਲਿੰਕ ਨਾਲ ਨਿੱਜੀ ਚੈਨਲ ਵਿੱਚ ਜੁੜੋ",
  "chat.new.back_to_chooser": "ਚੋਣਕਾਰ ’ਤੇ ਵਾਪਸ",
  "chat.new.create_channel": "ਚੈਨਲ ਬਣਾਓ",
  "chat.new.name_required": "ਪਹਿਲਾਂ ਚੈਨਲ ਦਾ ਨਾਂ ਭਰੋ",
  "chat.new.name_taken": "ਇਹ ਨਾਂ ਪਹਿਲਾਂ ਹੀ ਲਿਆ ਜਾ ਚੁੱਕਾ ਹੈ",
  "chat.new.create": "ਬਣਾਓ",
  "chat.new.e2ee":
    "ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ। ਸੁਨੇਹੇ ਸਿਰਫ਼ ਮੈਂਬਰ ਹੀ ਪੜ੍ਹ ਸਕਦੇ ਹਨ।",
  "chat.new.invite_only":
    "ਸਿਰਫ਼ ਸੱਦੇ ’ਤੇ। ਜਿਸ ਨਾਲ ਵੀ ਤੁਸੀਂ ਲਿੰਕ ਸਾਂਝਾ ਕਰੋ, ਉਹ ਜੁੜ ਸਕਦਾ ਹੈ। ਬਾਕੀ ਸਭ ਤੋਂ ਇਹ ਲੁਕਿਆ ਰਹਿੰਦਾ ਹੈ, ਨੇੜਲੇ ਪੀਅਰਾਂ ਤੋਂ ਵੀ।",
  "chat.new.name_exists": "ਇਸ ਨਾਂ ਵਾਲਾ ਚੈਨਲ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ।",
  "chat.new.reach_bluetooth_chip": "ਸਿਰਫ਼ ਬਲੂਟੁੱਥ",
  "chat.new.reach_internet_chip": "Bluetooth + Internet",
  "chat.new.have_link": "ਸੱਦਾ ਲਿੰਕ ਨਾਲ ਜੁੜੋ",

  // ---- Chats: join by link ----
  "chat.join.title": "ਲਿੰਕ ਨਾਲ ਜੁੜੋ",
  "chat.join.not_airhop": "ਇਹ Airhop ਲਿੰਕ ਨਹੀਂ ਹੈ।",
  "chat.join.reach_internet":
    "ਮੈਂਬਰਾਂ ਤੱਕ ਬਲੂਟੁੱਥ ਅਤੇ ਇੰਟਰਨੈੱਟ ਦੋਵਾਂ ਰਾਹੀਂ ਪਹੁੰਚਦਾ ਹੈ।",
  "chat.join.reach_mesh": "ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਹੀ ਰਹਿੰਦਾ ਹੈ।",
  "chat.join.contact_card":
    "ਇੱਕ ਸੰਪਰਕ ਕਾਰਡ। ਉਹਨਾਂ ਨੂੰ ਤੁਹਾਡੇ ਸੰਪਰਕਾਂ ਵਿੱਚ ਜੋੜਦਾ ਹੈ ਅਤੇ ਗੱਲਬਾਤ ਖੋਲ੍ਹਦਾ ਹੈ।",
  "chat.join.unverified": "ਉਸ ਲਿੰਕ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋ ਸਕੀ",
  "chat.join.unverified_body":
    "ਸੰਪਰਕ ਕਾਰਡ ਆਪਣੀਆਂ ਹੀ ਕੁੰਜੀਆਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ, ਇਸ ਲਈ ਇਹ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ। ਉਹਨਾਂ ਨੂੰ ਨਵਾਂ ਭੇਜਣ ਲਈ ਕਹੋ।",
  "chat.join.paste": "ਕਲਿੱਪਬੋਰਡ ਤੋਂ ਚਿਪਕਾਓ",
  "chat.join.join": "ਜੁੜੋ",
  "chat.join.public_channel":
    "ਜਨਤਕ ਚੈਨਲ {name}। ਨੇੜੇ ਦਾ ਕੋਈ ਵੀ ਇਸ ਨੂੰ ਪੜ੍ਹ ਸਕਦਾ ਹੈ।",
  "chat.join.private_channel": "ਨਿੱਜੀ ਚੈਨਲ {name}। {reach}",
  "chat.join.dm_with": "{name} ਨਾਲ ਸਿੱਧਾ ਸੁਨੇਹਾ।",
  "chat.join.joined_as": "{name} ਵਜੋਂ ਜੁੜੇ",
  "chat.join.name_clash_body":
    "ਤੁਸੀਂ ਪਹਿਲਾਂ ਹੀ ਇੱਕ ਵੱਖਰੇ {name} ਵਿੱਚ ਹੋ। ਚੈਨਲ ਦੇ ਨਾਂ ਸਿਰਫ਼ ਲੇਬਲ ਹੁੰਦੇ ਹਨ, ਇਸ ਲਈ ਇਸ ਸੱਦੇ ਨੇ ਆਪਣਾ ਵੱਖਰਾ ਚੈਨਲ ਖੋਲ੍ਹਿਆ ਹੈ ਅਤੇ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਸੀ, ਉਹ ਉਵੇਂ ਹੀ ਹੈ। ਕਿਸੇ ਵੀ ਇੱਕ ਦਾ ਨਾਂ ਉਸ ਦੀ ਚੈਨਲ ਜਾਣਕਾਰੀ ਵਿੱਚੋਂ ਬਦਲੋ।",
  "chat.join.paste_hint":
    "airhop:// ਨਾਲ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲਾ ਸੱਦਾ ਚਿਪਕਾਓ। ਕਿਸੇ ’ਤੇ ਦਬਾਉਣ ਨਾਲ ਵੀ ਕੰਮ ਹੋ ਜਾਂਦਾ ਹੈ; ਇਹ ਉਸ ਲਿੰਕ ਲਈ ਹੈ ਜਿਸ ’ਤੇ ਤੁਸੀਂ ਦਬਾ ਨਹੀਂ ਸਕਦੇ।",
  "chat.join.key_note":
    "ਨਿੱਜੀ ਚੈਨਲ ਦਾ ਸੱਦਾ ਕੁੰਜੀ ਆਪਣੇ ਨਾਲ ਲੈ ਕੇ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਜੁੜਨਾ ਤੁਰੰਤ ਹੁੰਦਾ ਹੈ ਅਤੇ ਕਿਸੇ ਹੋਰ ਤੋਂ ਕੁਝ ਨਹੀਂ ਮੰਗਿਆ ਜਾਂਦਾ।",
  "chat.join.offline_note":
    "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਕੰਮ ਕਰਦਾ ਹੈ। ਲਿੰਕ ਇਸੇ ਡੀਵਾਈਸ ’ਤੇ ਪੜ੍ਹਿਆ ਜਾਂਦਾ ਹੈ, ਅਤੇ ਚੈਨਲ ਓਨੀ ਦੂਰ ਪਹੁੰਚਦਾ ਹੈ ਜਿੰਨੀ ਇਸ ਦੇ ਬਣਾਉਣ ਵਾਲੇ ਨੇ ਰੱਖੀ ਹੈ।",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "ਉਹ ਸੈੱਲ ਨਹੀਂ ਖੁੱਲ੍ਹ ਸਕਿਆ। ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "chat.jump.title": "ਕਿਸੇ ਥਾਂ ’ਤੇ ਜਾਓ",
  "chat.jump.saved": "ਸੰਭਾਲੀਆਂ ਥਾਵਾਂ",
  "chat.jump.anywhere":
    "ਕਿਤੇ ਵੀ ਜਨਤਕ ਟਿਕਾਣਾ ਚੈਨਲ ਖੋਲ੍ਹੋ, ਭਾਵੇਂ ਉਹ ਥਾਂ ਜਿੱਥੇ ਤੁਸੀਂ ਨਹੀਂ ਹੋ।",
  "chat.jump.geohash_note":
    "ਇਸ ਦਾ ਜੀਓਹੈਸ਼ ਭਰੋ। ਜਿਸ ਵੀ ਵਿਅਕਤੀ ਦਾ ਟਿਕਾਣਾ ਉਸ ਸੈੱਲ ਵਿੱਚ ਆਉਂਦਾ ਹੈ, ਉਹ ਇਹ ਚੈਨਲ ਸਾਂਝਾ ਕਰਦਾ ਹੈ।",
  "chat.jump.teleport_note":
    "ਤੁਸੀਂ ਟੈਲੀਪੋਰਟ ਕੀਤੇ ਵਜੋਂ ਦਿਸਦੇ ਹੋ, ਨੇੜੇ ਵਜੋਂ ਨਹੀਂ। ਇਹ ਸਿਰਫ਼ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪਹੁੰਚਦਾ ਹੈ।",
  "chat.jump.level_cell": "{level} ਸੈੱਲ",
  "chat.jump.already_here":
    "ਤੁਸੀਂ ਪਹਿਲਾਂ ਹੀ ਇੱਥੇ ਹੋ। ਜਾਓ ਤੁਹਾਡਾ {name} ਚੈਨਲ ਖੋਲ੍ਹਦਾ ਹੈ।",
  "chat.jump.open_direction": "ਆਪਣੇ {direction} ਵਾਲਾ ਸੈੱਲ ਖੋਲ੍ਹੋ",
  "chat.jump.open_place": "{name} ਖੋਲ੍ਹੋ",
  "chat.jump.remove_place": "{name} ਨੂੰ ਸੰਭਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚੋਂ ਹਟਾਓ",
  "chat.jump.go": "ਜਾਓ",
  "chat.jump.how":
    "ਜੀਓਹੈਸ਼ ਲੱਭਣ ਲਈ: ਕੋਈ ਟਿਕਾਣਾ ਚੈਨਲ ਖੋਲ੍ਹੋ > ਇਸ ਦੇ ਨਾਂ ’ਤੇ ਦਬਾਓ > ਉੱਥੋਂ ਨਕਲ ਕਰੋ।",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "ਹਰ ਮੈਂਬਰ ਤੱਕ ਨਹੀਂ ਪਹੁੰਚਿਆ ਜਾ ਸਕਿਆ। ਜਦੋਂ ਉਹ ਨੇੜੇ ਹੋਣ ਤਾਂ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "chat.group.you_were_added": "ਤੁਹਾਨੂੰ {name} ਵਿੱਚ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
  "chat.group.added_you": "ਤੁਹਾਨੂੰ {name} ਵਿੱਚ ਜੋੜਿਆ",
  "chat.group.you_were_removed":
    "ਤੁਹਾਨੂੰ {name} ਵਿੱਚੋਂ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ। ਤੁਸੀਂ ਹੁਣ ਇੱਥੇ ਨਾ ਪੜ੍ਹ ਸਕਦੇ ਹੋ ਨਾ ਭੇਜ ਸਕਦੇ ਹੋ।",
  "chat.group.removed_you": "ਤੁਹਾਨੂੰ {name} ਵਿੱਚੋਂ ਹਟਾਇਆ",
  "chat.group.add_failed": "ਉਹਨਾਂ ਨੂੰ ਜੋੜਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
  "chat.group.add_failed_body":
    "ਕੁਝ ਨਹੀਂ ਬਦਲਿਆ। ਜਾਂ ਤਾਂ ਉਹਨਾਂ ਤੱਕ ਹੁਣ ਪਹੁੰਚ ਨਹੀਂ ਹੈ, ਜਾਂ ਗਰੁੱਪ 16 ’ਤੇ ਭਰ ਚੁੱਕਾ ਹੈ, ਜਾਂ ਤੁਸੀਂ ਇਸ ਦੇ ਬਣਾਉਣ ਵਾਲੇ ਨਹੀਂ ਹੋ।",
  "chat.group.remove_failed": "ਉਹਨਾਂ ਨੂੰ ਹਟਾਇਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
  "chat.group.remove_failed_body":
    "ਕੁਝ ਨਹੀਂ ਬਦਲਿਆ। ਗਰੁੱਪ ਵਿੱਚ ਕੌਣ ਹੈ, ਇਹ ਸਿਰਫ਼ ਗਰੁੱਪ ਬਣਾਉਣ ਵਾਲਾ ਹੀ ਬਦਲ ਸਕਦਾ ਹੈ।",
  "chat.group.e2ee":
    "ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ। ਸੁਨੇਹੇ ਸਿਰਫ਼ ਮੈਂਬਰ ਹੀ ਪੜ੍ਹ ਸਕਦੇ ਹਨ।",
  "chat.group.cap":
    "ਵੱਧ ਤੋਂ ਵੱਧ 16 ਲੋਕ, ਤੁਹਾਡੇ ਚੁਣੇ ਹੋਏ। ਕੋਈ ਸੱਦਾ ਲਿੰਕ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਕੋਈ ਵੀ ਅੱਗੇ ਭੇਜੇ ਲਿੰਕ ਨਾਲ ਨਹੀਂ ਜੁੜਦਾ।",
  "chat.group.bluetooth":
    "ਸਿਰਫ਼ ਬਲੂਟੁੱਥ। ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਮੈਂਬਰਾਂ ਨੂੰ ਸੁਨੇਹੇ ਵਾਪਸ ਆਉਣ ’ਤੇ ਮਿਲ ਜਾਂਦੇ ਹਨ।",
  "chat.group.members_label": "ਮੈਂਬਰ",
  "chat.group.none_in_range":
    "ਕੋਈ ਪਹੁੰਚ ਵਿੱਚ ਨਹੀਂ। ਗਰੁੱਪ ਬਣਾਉਂਦੇ ਸਮੇਂ ਮੈਂਬਰਾਂ ਦਾ ਨੇੜੇ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ।",
  "chat.group.create_title": "ਗਰੁੱਪ ਬਣਾਓ",
  "chat.group.name_placeholder": "ਗਰੁੱਪ ਦਾ ਨਾਂ",
  "chat.group.create": "ਬਣਾਓ",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "ਸਥਾਨਕ ਮੈਸ਼ · ਸਿਰਫ਼ ਬਲੂਟੁੱਥ",
  "chat.scope.mesh_desc":
    "ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ (ਲਗਭਗ 10 ਤੋਂ 100 ਮੀਟਰ) ਵਿਚਲੇ ਡੀਵਾਈਸਾਂ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ। ਇੰਟਰਨੈੱਟ ਦੀ ਲੋੜ ਨਹੀਂ। ਸਥਾਨਕ ਤਾਲਮੇਲ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ।",
  "chat.scope.block": "ਸ਼ਹਿਰ ਦਾ ਬਲਾਕ · ~100 ਮੀ",
  "chat.scope.block_desc":
    "ਸ਼ਹਿਰ ਦੇ ਬਲਾਕ ਜਿੰਨੀ ਪਹੁੰਚ। ਸੁਨੇਹੇ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪੁਲ ਕੀਤੇ ਜਾਂਦੇ ਹਨ ਤਾਂ ਜੋ ਬਲੂਟੁੱਥ ਤੋਂ ਬਾਹਰ ਪਰ ਨੇੜਲੇ ਪੀਅਰ ਵੀ ਸ਼ਾਮਲ ਹੋ ਸਕਣ।",
  "chat.scope.neighborhood": "ਮੁਹੱਲਾ · ~1 ਕਿਮੀ",
  "chat.scope.neighborhood_desc":
    "ਮੁਹੱਲੇ ਜਿੰਨੀ ਪਹੁੰਚ। ਰਿਲੇ ਦੀ ਮਦਦ ਨਾਲ ਇਲਾਕੇ ਦੇ ਪੀਅਰਾਂ ਤੱਕ ਸਿੱਧੇ ਬਲੂਟੁੱਥ ਲਿੰਕ ਤੋਂ ਬਿਨਾਂ ਵੀ ਪਹੁੰਚਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
  "chat.scope.city": "ਸ਼ਹਿਰ · ~10 ਕਿਮੀ",
  "chat.scope.city_desc":
    "ਸ਼ਹਿਰ-ਭਰ ਦਾ ਚੈਨਲ। ਮਹਾਂਨਗਰ ਦੇ ਪੀਅਰਾਂ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਭੂ-ਸਥਿਤ ਇੰਟਰਨੈੱਟ ਰਿਲੇ ਵਰਤਦਾ ਹੈ।",
  "chat.scope.province": "ਸੂਬਾ ਜਾਂ ਰਾਜ · ~100 ਕਿਮੀ",
  "chat.scope.province_desc":
    "ਸੂਬੇ ਜਾਂ ਰਾਜ ਜਿੰਨੀ ਪਹੁੰਚ। ਸੈਂਕੜੇ ਕਿਲੋਮੀਟਰ ਤੱਕ ਖੇਤਰੀ ਪਹੁੰਚ ਲਈ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪੁਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
  "chat.scope.country": "ਦੇਸ਼ ਜਾਂ ਖੇਤਰ · ~1000 ਕਿਮੀ",
  "chat.scope.country_desc":
    "ਦੇਸ਼-ਭਰ ਦੀ ਪਹੁੰਚ। ਖੇਤਰ ਦਾ ਕੋਈ ਵੀ Airhop ਜਾਂ bitchat ਵਰਤੋਂਕਾਰ ਜੁੜ ਕੇ ਸੁਨੇਹੇ ਪੜ੍ਹ ਸਕਦਾ ਹੈ।",
  "chat.transport.bluetooth": "ਸਿਰਫ਼ ਬਲੂਟੁੱਥ",
  "chat.transport.both": "Bluetooth + Internet",
  "chat.transport.internet": "ਸਿਰਫ਼ ਇੰਟਰਨੈੱਟ",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "ਕਮਾਂਡ /{cmd}: {hint}",
  "chat.cmd.hug_hint": "ਨਿੱਘੀ ਜੱਫ਼ੀ ਭੇਜੋ",
  "chat.cmd.slap_hint": "ਵੱਡੀ ਮੱਛੀ ਨਾਲ ਥੱਪੜ ਮਾਰੋ",
  "chat.status.sending": "ਭੇਜ ਰਹੇ ਹਾਂ…",
  "chat.status.undo_send": "ਭੇਜਣਾ ਵਾਪਸ ਲਵੋ",
  "chat.status.undo": "ਵਾਪਸ ਲਵੋ",
  "chat.status.sent": "ਭੇਜਿਆ",
  "chat.status.received": "ਮਿਲਿਆ",
  "chat.status.failed": "ਅਸਫਲ",
  "chat.status.canceled": "ਰੱਦ ਕੀਤਾ",
  "chat.status.waiting": "ਉਡੀਕ ਵਿੱਚ",
  "chat.status.sending_short": "ਭੇਜ ਰਹੇ ਹਾਂ",
  "chat.status.receiving": "ਮਿਲ ਰਿਹਾ ਹੈ",
  "chat.thread.not_available": "ਇੱਥੇ ਉਪਲਬਧ ਨਹੀਂ",
  "chat.thread.private_channel": "ਨਿੱਜੀ ਚੈਨਲ",
  "chat.thread.location_channel": "ਟਿਕਾਣਾ ਚੈਨਲ",
  "chat.thread.public_channel": "ਜਨਤਕ ਚੈਨਲ",
  "chat.thread.notices": "ਇਸ ਚੈਨਲ ਲਈ ਨੋਟਿਸ",
  "chat.thread.invite": "ਇਸ ਚੈਨਲ ਵਿੱਚ ਕਿਸੇ ਨੂੰ ਸੱਦੋ",
  "chat.thread.not_in_range": "ਨੇੜੇ ਨਹੀਂ। ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪਹੁੰਚਾ ਰਹੇ ਹਾਂ।",
  "chat.thread.not_nearby":
    "ਨੇੜੇ ਨਹੀਂ। ਜਦੋਂ ਉਹ ਵਾਪਸ ਪਹੁੰਚ ਵਿੱਚ ਜਾਂ ਆਨਲਾਈਨ ਹੋਣਗੇ, ਅਸੀਂ ਪਹੁੰਚਾ ਦਿਆਂਗੇ।",
  "chat.thread.no_keys":
    "ਉਹਨਾਂ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜਣ ਲਈ ਤੁਹਾਨੂੰ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਹੋਣਾ ਪਵੇਗਾ, ਜਾਂ ਉਹਨਾਂ ਦਾ ਕੋਡ ਸਕੈਨ ਕਰਨਾ ਪਵੇਗਾ।",
  "chat.geo.card_received":
    "{name} ਨੇ ਆਪਣਾ ਸੰਪਰਕ ਸਾਂਝਾ ਕੀਤਾ। ਆਪਣਾ ਵੀ ਵਾਪਸ ਸਾਂਝਾ ਕਰੋ ਤਾਂ ਜੋ ਤੁਹਾਡੇ ਵਿੱਚੋਂ ਕੋਈ ਥਾਂ ਬਦਲੇ ਤਾਂ ਵੀ ਗੱਲ ਚੱਲਦੀ ਰਹੇ।",
  "chat.geo.exchange_complete":
    "ਸੰਪਰਕ ਵਟਾਂਦਰਾ ਹੋ ਗਿਆ। ਹੁਣ ਤੁਸੀਂ ਕਿਤੋਂ ਵੀ ਇੱਕ ਦੂਜੇ ਤੱਕ ਪਹੁੰਚ ਸਕਦੇ ਹੋ।",
  "chat.geo.keep_person": "ਇਸ ਵਿਅਕਤੀ ਨੂੰ ਰੱਖੋ",
  "chat.geo.keep_person_desc":
    "ਆਪਣਾ ਸੰਪਰਕ ਸਾਂਝਾ ਕਰੋ ਤਾਂ ਜੋ ਤੁਹਾਡੇ ਵਿੱਚੋਂ ਕੋਈ ਥਾਂ ਬਦਲੇ ਤਾਂ ਵੀ ਗੱਲ ਚੱਲਦੀ ਰਹੇ। ਉਹਨਾਂ ਨੂੰ ਤੁਹਾਡੀ ਪੱਕੀ ਪਛਾਣ ਪਤਾ ਲੱਗ ਜਾਵੇਗੀ।",
  "chat.geo.card_sent": "ਸਾਂਝਾ ਕੀਤਾ · ਉਹਨਾਂ ਦੇ ਦੀ ਉਡੀਕ",
  "chat.thread.left_cell":
    "ਤੁਸੀਂ ਇਹ ਇਲਾਕਾ ਛੱਡ ਦਿੱਤਾ ਹੈ, ਇਸ ਲਈ ਉਹ ਇੱਥੇ ਤੁਹਾਡੇ ਤੱਕ ਨਹੀਂ ਪਹੁੰਚ ਸਕਦੇ। ਕਿਤੇ ਵੀ ਗੱਲ ਜਾਰੀ ਰੱਖਣ ਲਈ ਕੋਡ ਵਟਾਓ।",
  "chat.thread.no_route":
    "ਇਸ ਵੇਲੇ ਉਹਨਾਂ ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ ਹੋ ਸਕਦੀ। ਰਸਤਾ ਮਿਲਦੇ ਹੀ ਸੁਨੇਹਾ ਭੇਜ ਦਿੱਤਾ ਜਾਵੇਗਾ।",
  "chat.thread.empty": "ਹਾਲੇ ਕੋਈ ਸੁਨੇਹਾ ਨਹੀਂ",
  "chat.thread.empty_desc": "ਇਨਕ੍ਰਿਪਟਡ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ।",
  "chat.thread.jump_latest": "ਸਭ ਤੋਂ ਨਵੇਂ ਸੁਨੇਹੇ ’ਤੇ ਜਾਓ",
  "chat.thread.back_to_members": "ਮੈਂਬਰਾਂ ’ਤੇ ਵਾਪਸ",
  "chat.thread.nostr_key": "Nostr ਜਨਤਕ ਕੁੰਜੀ",
  "chat.thread.in_range": "ਪਹੁੰਚ ਵਿੱਚ",
  "chat.voice.not_recorded": "ਵੌਇਸ ਨੋਟ ਰਿਕਾਰਡ ਨਹੀਂ ਹੋਇਆ",
  "chat.thread.message": "ਸੁਨੇਹਾ",
  "chat.thread.message_placeholder": "ਸੁਨੇਹਾ…",
  "chat.thread.length_full": "ਸੁਨੇਹਾ ਭਰ ਗਿਆ ਹੈ",
  "chat.thread.waiting_for": "{name} ਦੇ ਵਾਪਸ ਆਉਣ ਦੀ ਉਡੀਕ · {percent}%",
  "chat.thread.peer": "ਪੀਅਰ",
  "chat.thread.cancel_transfer": "{name} ਰੱਦ ਕਰੋ",
  "chat.thread.queued_more": "{count} ਹੋਰ ਭੇਜਣ ਦੀ ਉਡੀਕ ਵਿੱਚ",
  "chat.thread.across_bridge": "{count} ਪੁਲ ਦੇ ਪਾਰ",
  "chat.thread.bridged": "ਪੁਲ ਕੀਤਾ",
  "chat.thread.invite_body":
    "Airhop ’ਤੇ {channel} ਵਿੱਚ ਮੇਰੇ ਨਾਲ ਜੁੜੋ — ਆਫ਼ਲਾਈਨ-ਪਹਿਲਾਂ, ਨਿੱਜੀ ਮੈਸ਼ ਸੁਨੇਹੇ।",
  "chat.thread.go_back_unread": "ਵਾਪਸ ਜਾਓ, {count} ਅਣਪੜ੍ਹੇ",
  "chat.thread.view_info": "{name} ਦੀ ਜਾਣਕਾਰੀ ਦੇਖੋ",
  "chat.thread.notices_new": "ਇਸ ਚੈਨਲ ਲਈ ਨੋਟਿਸ, {count} ਨਵੇਂ",
  "chat.thread.say_something": "{channel} ਵਿੱਚ ਕੁਝ ਕਹੋ।",
  "chat.thread.jump_latest_new": "ਸਭ ਤੋਂ ਨਵੇਂ ਸੁਨੇਹੇ ’ਤੇ ਜਾਓ, {count} ਨਵੇਂ",
  "chat.thread.unconfirmed_since":
    "{date} ਤੋਂ ਕਿਸੇ ਸੁਨੇਹੇ ਦੇ ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ",
  "chat.thread.no_reach": "ਨੇੜੇ ਕੋਈ ਪੀਅਰ ਨਹੀਂ · ਹਾਲੇ ਕਿਸੇ ਨੂੰ ਇਹ ਨਹੀਂ ਮਿਲਿਆ",
  "chat.thread.channel_needs_internet":
    "ਇੰਟਰਨੈੱਟ ਬੰਦ · ਇਹ ਚੈਨਲ ਸਿਰਫ਼ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿਚਲੇ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ",
  "chat.thread.cell_needs_internet":
    "ਇੰਟਰਨੈੱਟ ਬੰਦ · ਇਸ ਸੈੱਲ ਤੱਕ ਸਿਰਫ਼ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪਹੁੰਚਿਆ ਜਾ ਸਕਦਾ ਹੈ",
  "chat.thread.geo_dm_needs_internet":
    "ਇੰਟਰਨੈੱਟ ਬੰਦ · ਇਹ ਗੱਲਬਾਤ ਸਿਰਫ਼ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਚੱਲਦੀ ਹੈ",
  "chat.thread.via_gateway":
    "ਇੰਟਰਨੈੱਟ ਬੰਦ · ਇੱਕ ਨੇੜਲਾ ਡੀਵਾਈਸ ਇਹ ਤੁਹਾਡੇ ਲਈ ਆਨਲਾਈਨ ਲੈ ਜਾ ਰਿਹਾ ਹੈ",
  "chat.thread.group_queued":
    "ਇਸ ਗਰੁੱਪ ਵਿੱਚੋਂ ਹਾਲੇ ਕੋਈ ਨੇੜੇ ਨਹੀਂ। ਜਦੋਂ ਹੋਣਗੇ ਤਾਂ ਇਹ ਉਹਨਾਂ ਤੱਕ ਪਹੁੰਚ ਜਾਵੇਗਾ।",
  "chat.thread.no_group_key":
    "ਤੁਸੀਂ ਹੁਣ ਇਸ ਗਰੁੱਪ ਵਿੱਚ ਨਹੀਂ ਹੋ, ਇਸ ਲਈ ਇਹ ਭੇਜਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ",
  "chat.thread.no_reach_offline":
    "ਇੰਟਰਨੈੱਟ ਬੰਦ ਅਤੇ ਨੇੜੇ ਕੋਈ ਪੀਅਰ ਨਹੀਂ · ਹਾਲੇ ਕਿਸੇ ਨੂੰ ਇਹ ਨਹੀਂ ਮਿਲਿਆ",
  "chat.thread.mention": "{name} ਦਾ ਜ਼ਿਕਰ ਕਰੋ",
  "chat.thread.someone_talking": "{hold}। {name} ਬੋਲ ਰਹੇ ਹਨ।",
  "chat.thread.attach_note":
    "ਫ਼ਾਈਲਾਂ ਸਿਰਫ਼ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਹੀ ਜਾਂਦੀਆਂ ਹਨ। ਲਿਖਤ ਅਤੇ ਭੁਗਤਾਨ ਇੰਟਰਨੈੱਟ ਸੰਪਰਕਾਂ ਤੱਕ ਪਹੁੰਚਦੇ ਹਨ; ਅਟੈਚਮੈਂਟ ਨਹੀਂ।",
  "chat.thread.message_peer": "{name} ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ",
  "chat.thread.send": "ਸੁਨੇਹਾ ਭੇਜੋ",
  "chat.thread.group": "ਗਰੁੱਪ",
  "chat.bridge.nearby_only": "ਸਿਰਫ਼ ਨੇੜੇ: ਇਹ ਸੁਨੇਹਾ ਮੈਸ਼ ਪੁਲ ਤੋਂ ਬਾਹਰ ਰੱਖੋ",
  "chat.bridge.nearby_label": "ਸਿਰਫ਼ ਨੇੜੇ · ਬਲੂਟੁੱਥ ’ਤੇ ਹੀ ਰਹਿੰਦਾ ਹੈ",
  "chat.bridge.bridging_label":
    "ਨੇੜਲੇ ਇਲਾਕਿਆਂ ਤੱਕ ਪੁਲ ਬਣਾ ਰਹੇ ਹਾਂ · ਸਿਰਫ਼ ਨੇੜੇ ਲਈ ਦਬਾਓ",
  "chat.screenshot.you_took": "ਤੁਸੀਂ ਸਕ੍ਰੀਨਸ਼ਾਟ ਲਿਆ",
  "chat.screenshot.you_took_private":
    "ਤੁਸੀਂ ਸਕ੍ਰੀਨਸ਼ਾਟ ਲਿਆ · ਕਿਸੇ ਨੂੰ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ",
  "chat.screenshot.heads_up": "ਧਿਆਨ ਦਿਓ",
  "chat.screenshot.notice": "* {name} ਨੇ ਸਕ੍ਰੀਨਸ਼ਾਟ ਲਿਆ *",
  "chat.screenshot.notified_dm":
    "{name} ਨੂੰ ਦੱਸ ਦਿੱਤਾ ਗਿਆ ਕਿ ਤੁਸੀਂ ਇਸ ਗੱਲਬਾਤ ਦਾ ਸਕ੍ਰੀਨਸ਼ਾਟ ਲਿਆ ਹੈ।",
  "chat.screenshot.notified":
    "ਇਸ ਚੈਨਲ ਦੇ ਹਰ ਕਿਸੇ ਨੂੰ ਦੱਸ ਦਿੱਤਾ ਗਿਆ ਕਿ ਤੁਸੀਂ ਸਕ੍ਰੀਨਸ਼ਾਟ ਲਿਆ ਹੈ।",
  "chat.screenshot.not_notified":
    "ਕਿਸੇ ਨੂੰ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਹ ਚੈਨਲ ਜਨਤਕ ਹੈ, ਇਸ ਲਈ ਸਕ੍ਰੀਨਸ਼ਾਟ ਦਾ ਐਲਾਨ ਕਰਨ ਨਾਲ ਇਹ ਦਰਜ ਹੋ ਜਾਂਦਾ ਕਿ ਤੁਸੀਂ ਇੱਥੇ ਸੀ।",
  "chat.thread.error": "ਗ਼ਲਤੀ",
  "chat.thread.go_back": "ਵਾਪਸ ਜਾਓ",
  "chat.bubble.via_bridge": "ਮੈਸ਼ ਪੁਲ ਰਾਹੀਂ",
  "chat.bubble.view_profile": "{name} ਦੀ ਪ੍ਰੋਫ਼ਾਈਲ ਦੇਖੋ",
  "chat.bubble.forwarded": "ਅੱਗੇ ਭੇਜਿਆ",
  "chat.bubble.attachment": "ਅਟੈਚਮੈਂਟ",
  "chat.bubble.a11y": "{sender}: {body}। ਹੋਰ ਵਿਕਲਪਾਂ ਲਈ ਦਬਾ ਕੇ ਰੱਖੋ।",
  "chat.bubble.failed_retry": "ਭੇਜਿਆ ਨਹੀਂ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਲਈ ਦਬਾਓ।",

  // ---- Chats: message actions and info ----
  "chat.info.title": "ਸੁਨੇਹਾ ਜਾਣਕਾਰੀ",
  "chat.info.delivered_to": "{name} ਤੱਕ ਪਹੁੰਚਿਆ",
  "chat.info.read_by": "{name} ਨੇ ਪੜ੍ਹਿਆ",
  "chat.info.group_reach_desc": "ਹੁਣ ਪਹੁੰਚ ਵਿੱਚ, ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ",
  "chat.info.group_alone": "ਹੋਰ ਕੋਈ ਮੈਂਬਰ ਨਹੀਂ",
  "chat.info.today_at": "ਅੱਜ {time}",
  "chat.info.sending": "ਭੇਜ ਰਹੇ ਹਾਂ…",
  "chat.info.failed": "ਭੇਜਿਆ ਨਹੀਂ ਗਿਆ",
  "chat.info.courier": "ਕਿਸੇ ਸਾਥੀ ਨੇ ਪਹੁੰਚਾਇਆ",
  "chat.info.sent": "ਭੇਜਿਆ",
  "chat.info.queued": "ਭੇਜਣ ਦੀ ਉਡੀਕ ਵਿੱਚ",
  "chat.info.waiting": "ਉਡੀਕ ਵਿੱਚ…",
  "chat.action.info": "ਸੁਨੇਹਾ ਜਾਣਕਾਰੀ",
  "chat.action.save_photos": "ਫ਼ੋਟੋਆਂ ਵਿੱਚ ਸੰਭਾਲੋ",
  "chat.action.save_copy": "ਇੱਕ ਕਾਪੀ ਸੰਭਾਲੋ",
  "chat.action.forward": "ਅੱਗੇ ਭੇਜੋ",
  "chat.action.select": "ਚੁਣੋ",
  "chat.select.cancel": "ਚੋਣ ਰੱਦ ਕਰੋ",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "ਕੈਮਰਾ",
  "chat.attach.camera_desc": "ਫ਼ੋਟੋ ਜਾਂ ਵੀਡੀਓ ਲਵੋ",
  "chat.attach.library": "ਫ਼ੋਟੋ ਲਾਇਬ੍ਰੇਰੀ",
  "chat.attach.library_desc": "ਆਪਣੀ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚੋਂ ਚੁਣੋ",
  "chat.attach.document": "ਦਸਤਾਵੇਜ਼",
  "chat.attach.document_desc": "ਕੋਈ ਵੀ ਫ਼ਾਈਲ ਜਾਂ PDF ਭੇਜੋ",
  "chat.attach.voice": "ਵੌਇਸ ਨੋਟ",
  "chat.attach.voice_desc": "ਆਵਾਜ਼ੀ ਸੁਨੇਹਾ ਰਿਕਾਰਡ ਕਰ ਕੇ ਭੇਜੋ",
  "chat.attach.ecash": "ecash ਭੇਜੋ",
  "chat.attach.ecash_desc": "ਆਪਣੇ ਵਾਲਿਟ ਵਿੱਚੋਂ Cashu sats ਭੇਜੋ",
  "chat.attach.location": "ਟਿਕਾਣਾ",
  "chat.attach.location_desc": "ਤੁਸੀਂ ਇਸ ਵੇਲੇ ਕਿੱਥੇ ਹੋ, ਉਹ ਭੇਜੋ",
  "chat.attach.title": "ਨੱਥੀ ਕਰੋ",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "ਟਿਕਾਣਾ ਸਾਂਝਾ ਕੀਤਾ",
  "chat.location.received_summary": "ਆਪਣਾ ਟਿਕਾਣਾ ਸਾਂਝਾ ਕੀਤਾ",
  "chat.location.title": "ਟਿਕਾਣਾ",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago} ਪਹਿਲਾਂ ਲਿਆ",
  "chat.location.open_maps": "ਨਕਸ਼ਿਆਂ ਵਿੱਚ ਖੋਲ੍ਹੋ",
  "chat.location.no_forward": "ਟਿਕਾਣੇ ਅੱਗੇ ਨਹੀਂ ਭੇਜੇ ਜਾਂਦੇ",
  "chat.location.no_forward_body":
    "ਟਿਕਾਣਾ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। ਜੇ ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਕਿ ਇਹ ਕਿਸੇ ਹੋਰ ਕੋਲ ਵੀ ਹੋਵੇ ਤਾਂ ਇਸ ਦੀ ਥਾਂ ਆਪਣਾ ਸਾਂਝਾ ਕਰੋ।",
  "chat.location.no_fix": "ਇਹ ਕਿੰਨੀ ਦੂਰ ਹੈ, ਇਹ ਦੇਖਣ ਲਈ ਟਿਕਾਣੇ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ",
  "chat.location.send_title": "ਆਪਣਾ ਟਿਕਾਣਾ ਭੇਜੋ",
  "chat.location.send_body":
    "{name} ਨੂੰ ਇੱਕ ਬਿੰਦੂ ਦਿਸੇਗਾ: ਤੁਸੀਂ ਇਸ ਵੇਲੇ ਕਿੱਥੇ ਹੋ। ਇਹ ਲਗਾਤਾਰ ਅੱਪਡੇਟ ਨਹੀਂ ਹੁੰਦਾ ਰਹਿੰਦਾ।",
  "chat.location.send": "ਟਿਕਾਣਾ ਭੇਜੋ",
  "chat.location.finding": "ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਲੱਭ ਰਹੇ ਹਾਂ…",
  "chat.location.no_location": "ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਨਹੀਂ ਮਿਲ ਸਕਿਆ",
  "chat.location.no_location_body":
    "ਟਿਕਾਣੇ ਦੀ ਪਹੁੰਚ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ ਅਤੇ ਪੱਕਾ ਕਰੋ ਕਿ ਟਿਕਾਣਾ ਸੇਵਾਵਾਂ ਚਾਲੂ ਹਨ, ਫਿਰ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "chat.location.not_delivered": "ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਭੇਜਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
  "chat.location.not_delivered_body":
    "ਟਿਕਾਣਾ ਭੇਜਣ ਦਾ ਮਤਲਬ ਉਦੋਂ ਹੀ ਹੈ ਜਦੋਂ ਉਹ ਤਾਜ਼ਾ ਹੋਵੇ, ਇਸ ਲਈ ਇਹ ਬਾਅਦ ਲਈ ਕਤਾਰ ਵਿੱਚ ਨਹੀਂ ਲਾਇਆ ਜਾਂਦਾ। ਜਦੋਂ {name} ਤੱਕ ਪਹੁੰਚ ਹੋਵੇ ਤਾਂ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "chat.location.direction.n": "ਉੱਤਰ",
  "chat.location.direction.ne": "ਉੱਤਰ-ਪੂਰਬ",
  "chat.location.direction.e": "ਪੂਰਬ",
  "chat.location.direction.se": "ਦੱਖਣ-ਪੂਰਬ",
  "chat.location.direction.s": "ਦੱਖਣ",
  "chat.location.direction.sw": "ਦੱਖਣ-ਪੱਛਮ",
  "chat.location.direction.w": "ਪੱਛਮ",
  "chat.location.direction.nw": "ਉੱਤਰ-ਪੱਛਮ",
  "chat.attach.send_anyway": "ਫਿਰ ਵੀ ਭੇਜੋ",
  "chat.attach.bitchat_too_big": "ਸ਼ਾਇਦ ਇਹ ਨਾ ਪਹੁੰਚੇ",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat ’ਤੇ ਹਨ, ਜੋ ਵੱਡੀ ਫ਼ਾਈਲ ਵਿਚਕਾਰੋਂ ਹੀ ਛੱਡ ਦਿੰਦਾ ਹੈ। ਲਗਭਗ 350 KiB ਤੋਂ ਘੱਟ ਭਰੋਸੇਯੋਗ ਹੈ। ਕਿਸੇ Airhop ਸੰਪਰਕ ਨੂੰ ਭੇਜਣ ’ਤੇ ਅਜਿਹੀ ਕੋਈ ਹੱਦ ਨਹੀਂ ਹੁੰਦੀ।",
  "chat.attach.bitchat_unopenable": "ਸ਼ਾਇਦ ਉਹ ਇਸ ਨੂੰ ਖੋਲ੍ਹ ਨਾ ਸਕਣ",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat ’ਤੇ ਹਨ, ਜੋ ਫ਼ੋਟੋਆਂ ਅਤੇ ਵੌਇਸ ਨੋਟ ਦਿਖਾਉਂਦਾ ਹੈ ਪਰ ਬਾਕੀ ਹਰ ਚੀਜ਼ ਨੂੰ ਅਜਿਹੀ ਫ਼ਾਈਲ ਵਜੋਂ ਗਿਣਦਾ ਹੈ ਜੋ ਉਹ ਖੋਲ੍ਹ ਨਹੀਂ ਸਕਦਾ। ਇਹ ਪਹੁੰਚ ਤਾਂ ਜਾਵੇਗੀ, ਬੱਸ ਸ਼ਾਇਦ ਉਹ ਇਸ ਨੂੰ ਦੇਖ ਨਾ ਸਕਣ।",
  "chat.attach.file": "ਫ਼ਾਈਲ ਨੱਥੀ ਕਰੋ",
  "chat.attach.unavailable": "ਇੱਥੇ ਅਟੈਚਮੈਂਟ ਉਪਲਬਧ ਨਹੀਂ",
  "chat.attach.not_sent": "ਅਟੈਚਮੈਂਟ ਨਹੀਂ ਭੇਜੀ ਗਈ",
  "chat.attach.read_failed":
    "ਉਹ ਫ਼ਾਈਲ ਪੜ੍ਹਨ ਵਿੱਚ ਕੁਝ ਗੜਬੜ ਹੋ ਗਈ। ਕੋਈ ਹੋਰ ਵਰਤ ਕੇ ਦੇਖੋ।",
  "chat.attach.caption": "ਸੁਰਖ਼ੀ ਜੋੜੋ…",
  "chat.attach.send": "ਅਟੈਚਮੈਂਟ ਭੇਜੋ",
  "chat.attach.generic": "ਅਟੈਚਮੈਂਟ",
  "chat.media.view_full": "ਫ਼ੋਟੋ ਪੂਰੀ ਸਕ੍ਰੀਨ ’ਤੇ ਦੇਖੋ",
  "chat.media.gone_photo": "ਫ਼ੋਟੋ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਨਹੀਂ ਹੈ",
  "chat.media.gone_video": "ਵੀਡੀਓ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਨਹੀਂ ਹੈ",
  "chat.media.gone_voice": "ਵੌਇਸ ਨੋਟ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਨਹੀਂ ਹੈ",
  "chat.media.gone_file": "ਫ਼ਾਈਲ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਨਹੀਂ ਹੈ",
  "chat.media.gone_note": "7 ਦਿਨਾਂ ਬਾਅਦ ਜਾਂ ਕੈਸ਼ ਸਾਫ਼ ਹੋਣ ’ਤੇ ਹਟਾ ਦਿੱਤਾ ਗਿਆ",
  "chat.media.ask_resend": "ਦੁਬਾਰਾ ਪੁੱਛੋ",
  "chat.media.resend_draft": "ਕੀ ਤੁਸੀਂ ਉਹ {kind} ਦੁਬਾਰਾ ਭੇਜ ਸਕਦੇ ਹੋ?",
  "chat.media.kind_photo": "ਫ਼ੋਟੋ",
  "chat.media.kind_video": "ਵੀਡੀਓ",
  "chat.media.kind_voice": "ਵੌਇਸ ਨੋਟ",
  "chat.media.kind_file": "ਫ਼ਾਈਲ",
  "chat.media.pause_voice": "ਵੌਇਸ ਨੋਟ ਰੋਕੋ",
  "chat.media.play_voice": "ਵੌਇਸ ਨੋਟ ਚਲਾਓ",
  "chat.media.voice_position": "ਵੌਇਸ ਨੋਟ ਦੀ ਥਾਂ",
  "chat.media.voice_scrub": "ਉਸ ਥਾਂ ’ਤੇ ਜਾਣ ਲਈ ਲਕੀਰਾਂ ਦੇ ਨਾਲ-ਨਾਲ ਦਬਾਓ",
  "chat.media.image": "ਤਸਵੀਰ",
  "chat.media.tap_load_photo": "ਫ਼ੋਟੋ ਲੋਡ ਕਰਨ ਲਈ ਦਬਾਓ",
  "chat.media.open_document": "{name} ਖੋਲ੍ਹੋ",
  "chat.media.document": "ਦਸਤਾਵੇਜ਼",
  "chat.media.tap_load_video": "ਵੀਡੀਓ ਲੋਡ ਕਰਨ ਲਈ ਦਬਾਓ",
  "chat.media.video": "ਵੀਡੀਓ",
  "chat.media.photo": "ਫ਼ੋਟੋ",
  "chat.media.close_photo": "ਫ਼ੋਟੋ ਬੰਦ ਕਰੋ",
  "chat.media.save_photo": "ਫ਼ੋਟੋ ਆਪਣੀਆਂ ਫ਼ੋਟੋਆਂ ਵਿੱਚ ਸੰਭਾਲੋ",
  "chat.media.share_photo": "ਫ਼ੋਟੋ ਸਾਂਝੀ ਕਰੋ",
  "chat.media.saved_videos": "ਤੁਹਾਡੀਆਂ ਵੀਡੀਓਜ਼ ਵਿੱਚ ਸੰਭਾਲਿਆ",
  "chat.media.saved_photos": "ਤੁਹਾਡੀਆਂ ਫ਼ੋਟੋਆਂ ਵਿੱਚ ਸੰਭਾਲਿਆ",
  "chat.media.not_saved": "ਸੰਭਾਲਿਆ ਨਹੀਂ ਗਿਆ",
  "chat.media.cant_open": "ਫ਼ਾਈਲ ਨਹੀਂ ਖੁੱਲ੍ਹ ਸਕਦੀ",
  "chat.media.no_app":
    "ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਇਹ ਫ਼ਾਈਲ ਖੋਲ੍ਹਣ ਜਾਂ ਸਾਂਝੀ ਕਰਨ ਲਈ ਕੋਈ ਐਪ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
  "chat.media.open_failed":
    "ਫ਼ਾਈਲ ਖੋਲ੍ਹੀ ਨਹੀਂ ਜਾ ਸਕੀ। ਹੋ ਸਕਦਾ ਹੈ ਇਹ ਕੈਸ਼ ਵਿੱਚੋਂ ਸਾਫ਼ ਹੋ ਚੁੱਕੀ ਹੋਵੇ।",
  "media.blocked.nostr_only":
    "ਤੁਸੀਂ ਇਸ ਵਿਅਕਤੀ ਨੂੰ ਸਿਰਫ਼ ਕਿਸੇ ਰਿਲੇ ਰਾਹੀਂ ਜਾਣਦੇ ਹੋ। ਸਿਰਫ਼ ਲਿਖਤ ਉਪਲਬਧ ਹੈ। ਫ਼ੋਟੋਆਂ, ਫ਼ਾਈਲਾਂ ਅਤੇ ਵੌਇਸ ਨੋਟਾਂ ਲਈ ਬਲੂਟੁੱਥ ਚਾਹੀਦਾ ਹੈ।",
  "media.blocked.private_channel":
    "ਪ੍ਰਸਾਰਿਤ ਅਟੈਚਮੈਂਟ ਦਸਤਖ਼ਤੀ ਹੁੰਦੀ ਹੈ ਪਰ ਇਨਕ੍ਰਿਪਟਡ ਨਹੀਂ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਕਿਸੇ ਨਿੱਜੀ ਚੈਨਲ ਵਿੱਚ ਭੇਜਣ ਨਾਲ ਉਹ ਖੁੱਲ੍ਹੀ ਪੈ ਜਾਵੇਗੀ ਜਦਕਿ ਇੱਥੋਂ ਦੀ ਲਿਖਤ ਇਨਕ੍ਰਿਪਟਡ ਰਹਿੰਦੀ ਹੈ।",
  "media.blocked.private_group":
    "ਪ੍ਰਸਾਰਿਤ ਅਟੈਚਮੈਂਟ ਦਸਤਖ਼ਤੀ ਹੁੰਦੀ ਹੈ ਪਰ ਇਨਕ੍ਰਿਪਟਡ ਨਹੀਂ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਕਿਸੇ ਨਿੱਜੀ ਗਰੁੱਪ ਵਿੱਚ ਭੇਜਣ ਨਾਲ ਉਹ ਖੁੱਲ੍ਹੀ ਪੈ ਜਾਵੇਗੀ ਜਦਕਿ ਇੱਥੋਂ ਦੀ ਲਿਖਤ ਇਨਕ੍ਰਿਪਟਡ ਰਹਿੰਦੀ ਹੈ।",
  "media.blocked.location_channel":
    "ਟਿਕਾਣਾ ਚੈਨਲ ਲੋਕਾਂ ਤੱਕ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪਹੁੰਚਦਾ ਹੈ, ਅਤੇ ਫ਼ੋਟੋਆਂ, ਫ਼ਾਈਲਾਂ ਤੇ ਵੌਇਸ ਨੋਟ ਬਲੂਟੁੱਥ ’ਤੇ ਸਫ਼ਰ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਉਹ ਕਦੇ ਪਹੁੰਚਣਗੇ ਹੀ ਨਹੀਂ।",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "ਇੱਥੇ ਵੌਇਸ ਨੋਟ ਉਪਲਬਧ ਨਹੀਂ",
  "chat.voice.hold_live": "ਸਿੱਧਾ ਬੋਲਣ ਲਈ ਦਬਾ ਕੇ ਰੱਖੋ",
  "chat.voice.hold_record": "ਵੌਇਸ ਨੋਟ ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਦਬਾ ਕੇ ਰੱਖੋ",
  "chat.voice.cancel_recording": "ਰਿਕਾਰਡਿੰਗ ਰੱਦ ਕਰੋ",
  "chat.voice.slide_cancel": "ਰੱਦ ਕਰਨ ਲਈ ਖਿਸਕਾਓ",
  "chat.voice.release_cancel": "ਰੱਦ ਕਰਨ ਲਈ ਛੱਡੋ",
  "chat.voice.a11y_toggle": "ਬੋਲਣਾ ਸ਼ੁਰੂ ਜਾਂ ਬੰਦ ਕਰਨ ਲਈ ਦੋ ਵਾਰ ਦਬਾਓ।",
  "chat.voice.limit_reached": "ਦੋ ਮਿੰਟ ਦੀ ਹੱਦ ਪੂਰੀ, ਭੇਜਣ ਲਈ ਛੱਡੋ",
  "chat.voice.limit_sent": "ਦੋ ਮਿੰਟ ਦੀ ਹੱਦ ਪੂਰੀ, ਨੋਟ ਭੇਜ ਦਿੱਤਾ",
  "chat.voice.stop_send": "ਰਿਕਾਰਡਿੰਗ ਰੋਕ ਕੇ ਭੇਜੋ",
  "chat.voice.lift_lock": "ਬਿਨਾਂ ਹੱਥ ਲਾਏ ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਉੱਪਰ ਖਿਸਕਾਓ",
  "chat.voice.live_speaking": "{name} ਬੋਲ ਰਹੇ ਹਨ",
  "voice.unavailable": "ਸਿੱਧੀ ਆਵਾਜ਼ ਉਪਲਬਧ ਨਹੀਂ",
  "voice.recording_stopped": "ਰਿਕਾਰਡਿੰਗ ਰੁਕ ਗਈ",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "ਕੈਮਰੇ ਦੀ ਪਹੁੰਚ",
  "chat.perm.camera_purpose": "ਭੇਜਣ ਲਈ ਫ਼ੋਟੋ ਲੈਣ",
  "chat.perm.photo_label": "ਫ਼ੋਟੋ ਦੀ ਪਹੁੰਚ",
  "chat.perm.photo_purpose": "ਭੇਜਣ ਲਈ ਫ਼ੋਟੋ ਜਾਂ ਵੀਡੀਓ ਚੁਣਨ",
  "chat.perm.photo_save_purpose": "ਇਸ ਨੂੰ ਤੁਹਾਡੀਆਂ ਫ਼ੋਟੋਆਂ ਵਿੱਚ ਸੰਭਾਲਣ",
  "chat.perm.mic_label": "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਦੀ ਪਹੁੰਚ",
  "chat.perm.mic_live_purpose": "ਨੇੜਲੇ ਲੋਕਾਂ ਨਾਲ ਗੱਲ ਕਰਨ",
  "chat.perm.mic_note_purpose": "ਵੌਇਸ ਨੋਟ ਰਿਕਾਰਡ ਕਰਨ",
  "chat.perm.recording_stopped": "ਰਿਕਾਰਡਿੰਗ ਰੁਕ ਗਈ",
  "chat.perm.record_failed":
    "ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋ ਸਕੀ। ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਦੀਆਂ ਇਜਾਜ਼ਤਾਂ ਦੇਖੋ।",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "ਪ੍ਰਾਪਤ ਕੀਤਾ",
  "chat.ecash.reclaimed": "ਵਾਪਸ ਲਿਆ",
  "chat.ecash.claiming": "ਪ੍ਰਾਪਤ ਕਰ ਰਹੇ ਹਾਂ…",
  "chat.ecash.claim": "ਪ੍ਰਾਪਤ ਕਰੋ",
  "chat.ecash.claim_amount": "{amount} {unit} ਪ੍ਰਾਪਤ ਕਰੋ",
  "chat.ecash.already_claimed": "ਪਹਿਲਾਂ ਹੀ ਪ੍ਰਾਪਤ ਕੀਤਾ",
  "chat.ecash.already_claimed_body":
    "ਇਸ ਟੋਕਨ ਦਾ ਹਰ ਪਰੂਫ਼ ਪਹਿਲਾਂ ਹੀ ਤੁਹਾਡੇ ਵਾਲਿਟ ਵਿੱਚ ਹੈ, ਇਸ ਲਈ ਕੁਝ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ।",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "ਵੱਧ ਤੋਂ ਵੱਧ ਕੋਸ਼ਿਸ਼ ਨਾਲ ਪਹੁੰਚਾਉਣ ਲਈ ਮੈਸ਼ ਨੂੰ ਸੌਂਪਿਆ",
  "chat.info.queued_desc":
    "ਜਦੋਂ ਤੱਕ ਉਹਨਾਂ ਤੱਕ ਰਸਤਾ ਨਹੀਂ ਮਿਲਦਾ, ਇਸੇ ਫ਼ੋਨ ’ਤੇ ਰੱਖਿਆ",
  "chat.info.reclaimed": "ਵਾਪਸ ਲਿਆ",
  "chat.info.reclaimed_desc":
    "ਤੁਸੀਂ ਇਹ ਭੁਗਤਾਨ ਆਪਣੇ ਵਾਲਿਟ ਵਿੱਚ ਵਾਪਸ ਲੈ ਲਿਆ, ਇਸ ਲਈ ਇਹ ਨਹੀਂ ਪਹੁੰਚੇਗਾ",
  "chat.info.about": "ਬਾਰੇ",
  "chat.info.group_desc":
    "ਇੱਕ ਨਿੱਜੀ ਗਰੁੱਪ। ਇਸ ਨੂੰ ਸਿਰਫ਼ ਉਹੀ ਮੈਂਬਰ ਪੜ੍ਹ ਸਕਦੇ ਹਨ ਜੋ ਬਣਾਉਣ ਵਾਲੇ ਨੇ ਜੋੜੇ, ਅਤੇ ਇਹ ਬਲੂਟੁੱਥ ’ਤੇ ਹੀ ਰਹਿੰਦਾ ਹੈ।",
  "chat.info.teleported_desc":
    "ਇਸ ਜੀਓਹੈਸ਼ ਸੈੱਲ ਲਈ ਜਨਤਕ ਟਿਕਾਣਾ ਚੈਨਲ। ਸੈੱਲ ਵਿਚਲਾ ਕੋਈ ਵੀ, Airhop ਜਾਂ bitchat ’ਤੇ, ਇਸ ਨੂੰ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਸਾਂਝਾ ਕਰਦਾ ਹੈ। ਤੁਸੀਂ ਟੈਲੀਪੋਰਟ ਕੀਤੇ ਹੋ, ਸਰੀਰਕ ਤੌਰ ’ਤੇ ਇੱਥੇ ਨਹੀਂ।",
  "chat.info.custom_desc":
    "ਇੱਕ ਆਪਣਾ ਚੈਨਲ। ਜਿਸ ਨੂੰ ਵੀ ਨਾਂ ਪਤਾ ਹੈ, ਉਹ ਕਿਸੇ ਵੀ Airhop ਜਾਂ bitchat ਡੀਵਾਈਸ ਤੋਂ ਜੁੜ ਸਕਦਾ ਹੈ।",
  "chat.info.private_e2ee": "ਨਿੱਜੀ · ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ",
  "chat.info.public_plain": "ਜਨਤਕ · ਬਿਨਾਂ ਇਨਕ੍ਰਿਪਸ਼ਨ",
  "chat.info.group_privacy":
    "ਇਸ ਗਰੁੱਪ ਨੂੰ ਸਿਰਫ਼ ਹੇਠਾਂ ਦਿੱਸੇ ਮੈਂਬਰ ਹੀ ਪੜ੍ਹ ਸਕਦੇ ਹਨ। ਸੁਨੇਹੇ ਬਲੂਟੁੱਥ ’ਤੇ ਹੀ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਮੈਂਬਰਾਂ ਨੂੰ ਵਾਪਸ ਆਉਣ ’ਤੇ ਮਿਲ ਜਾਂਦੇ ਹਨ।",
  "chat.info.teleport_privacy":
    "ਉਹ ਥਾਂ ਜਿੱਥੇ ਤੁਸੀਂ ਟੈਲੀਪੋਰਟ ਕੀਤਾ ਹੈ। ਇਹ ਇਸ ਸੈੱਲ ਦੇ ਹਰ ਕਿਸੇ ਤੱਕ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪਹੁੰਚਦਾ ਹੈ, ਅਤੇ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਕਿਸੇ ਤੱਕ ਨਹੀਂ।",
  "chat.info.location_off_privacy":
    "ਟਿਕਾਣਾ ਬੰਦ ਹੈ, ਇਸ ਲਈ ਇਹ ਚੈਨਲ ਨੇੜਲੇ ਡੀਵਾਈਸਾਂ ਤੱਕ ਸਿਰਫ਼ ਬਲੂਟੁੱਥ ਰਾਹੀਂ ਪਹੁੰਚਦਾ ਹੈ। ਇਸ ਦੇ ਇਲਾਕੇ ਵਾਲੇ ਸੈੱਲ ਤੱਕ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪਹੁੰਚਣ ਲਈ ਟਿਕਾਣਾ ਚਾਲੂ ਕਰੋ।",
  "chat.info.invite_privacy":
    "ਇਸ ਨੂੰ ਸਿਰਫ਼ ਉਹੀ ਲੋਕ ਪੜ੍ਹ ਸਕਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਨੂੰ ਤੁਸੀਂ ਲਿੰਕ ਰਾਹੀਂ ਸੱਦਦੇ ਹੋ। ਬਾਕੀ ਸਭ ਤੋਂ ਇਹ ਲੁਕਿਆ ਰਹਿੰਦਾ ਹੈ, ਨੇੜਲੇ ਪੀਅਰਾਂ ਤੋਂ ਵੀ।",
  "chat.info.public_privacy":
    "ਜੋ ਵੀ ਜੁੜਦਾ ਹੈ, ਉਹ ਹਰ ਸੁਨੇਹਾ ਪੜ੍ਹ ਸਕਦਾ ਹੈ। ਨਿੱਜੀ ਗੱਲਬਾਤ ਲਈ ਸਿੱਧਾ ਸੁਨੇਹਾ ਵਰਤੋ; DM ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ ਹੁੰਦੇ ਹਨ।",
  "chat.info.remove_member": "ਮੈਂਬਰ ਹਟਾਓ",
  "chat.info.remove_member_body":
    "{name} ਨੂੰ ਗਰੁੱਪ ਵਿੱਚੋਂ ਹਟਾਉਣਾ ਹੈ? ਗਰੁੱਪ ਕੁੰਜੀ ਬਦਲ ਜਾਂਦੀ ਹੈ ਤਾਂ ਜੋ ਉਹ ਨਵੇਂ ਸੁਨੇਹੇ ਨਾ ਪੜ੍ਹ ਸਕਣ।",
  "chat.info.message_member": "{name} ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ",
  "chat.info.remove_member_a11y": "{name} ਨੂੰ ਹਟਾਓ",
  "chat.info.no_addable":
    "ਜੋੜਨ ਲਈ ਕੋਈ ਪਹੁੰਚਯੋਗ ਪੀਅਰ ਨਹੀਂ। ਮੈਂਬਰਾਂ ਦਾ ਨੇੜੇ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ।",
  "chat.info.add_count": "{count} ਜੋੜੋ",
  "chat.info.teleported_tag": "{level}  ·  ਟੈਲੀਪੋਰਟ ਕੀਤਾ",
  "chat.info.active": "ਸਰਗਰਮ",
  "chat.info.members": "ਮੈਂਬਰ",
  "chat.info.bookmark": "ਇਹ ਥਾਂ ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ",
  "chat.info.remove_bookmark": "ਨਿਸ਼ਾਨ ਹਟਾਓ",
  "chat.info.default_notice":
    "ਮੂਲ ਚੈਨਲ ਛੱਡੇ ਨਹੀਂ ਜਾ ਸਕਦੇ। ਇਹ Airhop ਮੈਸ਼ ਪ੍ਰੋਟੋਕੋਲ ਦਾ ਹਿੱਸਾ ਹਨ।",
  "chat.info.custom_channel": "ਆਪਣਾ ਚੈਨਲ",
  "chat.info.geohash": "ਜੀਓਹੈਸ਼",
  "chat.info.copy_geohash": "ਜੀਓਹੈਸ਼ ਨਕਲ ਕਰੋ",
  "chat.info.relays": "ਰਿਲੇ",
  "chat.info.show_relays": "ਇਹ ਚੈਨਲ ਚੁੱਕਣ ਵਾਲੇ ਰਿਲੇ ਦਿਖਾਓ",
  "chat.info.relay_custom": "ਆਪਣਾ",
  "chat.info.relays_none": "ਕੋਈ ਨਹੀਂ। ਇਹ ਸੈੱਲ ਇਸ ਵੇਲੇ ਸਿਰਫ਼ ਬਲੂਟੁੱਥ ’ਤੇ ਹੈ।",
  "chat.info.search_members": "ਮੈਂਬਰ ਖੋਜੋ",
  "chat.info.search_members_placeholder": "ਮੈਂਬਰ ਖੋਜੋ…",
  "chat.info.teleported": "ਟੈਲੀਪੋਰਟ ਕੀਤਾ",
  "chat.info.creator": "ਬਣਾਉਣ ਵਾਲਾ",
  "chat.info.no_matches": "ਕੋਈ ਮੇਲ ਨਹੀਂ",
  "chat.info.no_one_here": "ਹਾਲੇ ਇੱਥੇ ਕੋਈ ਨਹੀਂ",
  "chat.info.add_members": "ਮੈਂਬਰ ਜੋੜੋ",
  "chat.info.add_selected": "ਚੁਣੇ ਮੈਂਬਰ ਜੋੜੋ",
  "chat.info.add": "ਜੋੜੋ",
  "chat.info.leave_group": "ਗਰੁੱਪ ਛੱਡੋ",
  "chat.info.leave_channel": "ਚੈਨਲ ਛੱਡੋ",
  "chat.info.leave": "ਛੱਡੋ",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} ਤੋਂ ਗੱਲਬਾਤ",
  "chat.contact.verified_since": "{date} ਤੋਂ ਪੁਸ਼ਟੀਸ਼ੁਦਾ",
  "chat.contact.anonymous": "ਗੁਮਨਾਮ",
  "chat.contact.anonymous_desc":
    "ਇੱਕ ਜੀਓਹੈਸ਼ ਉਪਨਾਮ, ਜਿਸ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਕੋਈ ਪੱਕੀ ਪਛਾਣ ਨਹੀਂ",
  "chat.contact.verified": "ਪੁਸ਼ਟੀਸ਼ੁਦਾ",
  "chat.contact.verified_desc": "ਉਹਨਾਂ ਦਾ QR ਕੋਡ ਸਕੈਨ ਕੀਤਾ",
  "chat.contact.verified_desc_compared": "ਉਹਨਾਂ ਨਾਲ ਕੋਡ ਮਿਲਾਏ",
  "chat.contact.not_verified": "ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ",
  "chat.contact.not_verified_desc":
    "ਇਹ ਸੱਚਮੁੱਚ ਉਹੀ ਹਨ, ਇਹ ਪੱਕਾ ਕਰਨ ਲਈ ਉਹਨਾਂ ਦਾ ਕੋਡ ਸਕੈਨ ਕਰੋ, ਜਾਂ ਕਾਲ ’ਤੇ ਕੋਡ ਮਿਲਾਓ",
  "chat.contact.e2ee": "ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ",
  "chat.contact.e2ee_nostr":
    "NIP-17 ਤੋਹਫ਼ੇ ਵਾਂਗ ਲਪੇਟਿਆ, ਇਸ ਲਈ ਰਿਲੇ ਇਸ ਨੂੰ ਪੜ੍ਹ ਨਹੀਂ ਸਕਦੇ",
  "chat.contact.e2ee_mesh":
    "Noise XX, ਨਾਲ Airhop ਡੀਵਾਈਸਾਂ ਵਿਚਕਾਰ Double Ratchet",
  "chat.contact.copy_nostr": "Nostr ਜਨਤਕ ਕੁੰਜੀ ਨਕਲ ਕਰੋ",
  "chat.contact.nostr_key": "Nostr ਜਨਤਕ ਕੁੰਜੀ",
  "chat.contact.cell_key_note":
    "ਇਹ ਕੁੰਜੀ ਉਸ ਇਲਾਕੇ ਦੀ ਹੈ ਜਿੱਥੇ ਤੁਸੀਂ ਮਿਲੇ ਸੀ। ਜੇ ਤੁਹਾਡੇ ਵਿੱਚੋਂ ਕੋਈ ਥਾਂ ਬਦਲੇ ਤਾਂ ਇਹ ਬਦਲ ਜਾਂਦੀ ਹੈ, ਅਤੇ ਗੱਲਬਾਤ ਵੀ ਇਸ ਦੇ ਨਾਲ ਹੀ ਰੁਕ ਜਾਂਦੀ ਹੈ। ਕਿਤੇ ਵੀ ਗੱਲ ਜਾਰੀ ਰੱਖਣ ਲਈ ਸੰਪਰਕ ਵਟਾਓ।",
  "chat.contact.peer_name": "ਪੀਅਰ ਦਾ ਨਾਂ",
  "chat.contact.peer_id": "ਪੀਅਰ ID",
  "chat.contact.rename": "ਨਾਂ ਬਦਲੋ",
  "chat.contact.rename_needs_contact":
    "ਤੁਸੀਂ ਉਹਨਾਂ ਲੋਕਾਂ ਦਾ ਨਾਂ ਬਦਲ ਸਕਦੇ ਹੋ ਜਿਨ੍ਹਾਂ ਦੀਆਂ ਕੁੰਜੀਆਂ ਤੁਹਾਡੇ ਕੋਲ ਹਨ। ਪਹਿਲਾਂ ਸੰਪਰਕ ਕਾਰਡ ਵਟਾਓ, ਫਿਰ ਇਹ ਸਿਰਫ਼ ਤੁਹਾਨੂੰ ਦਿਸਣ ਵਾਲਾ ਨਾਂ ਬਣ ਜਾਂਦਾ ਹੈ।",
  "chat.contact.rename_needs_keys":
    "ਇਸ ਸੰਪਰਕ ਲਈ ਹਾਲੇ ਕੋਈ ਕੁੰਜੀ ਨਹੀਂ ਹੈ। ਉਹਨਾਂ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ, ਜਾਂ ਉਹਨਾਂ ਦਾ ਕੋਡ ਸਕੈਨ ਕਰੋ, ਫਿਰ ਤੁਸੀਂ ਉਹਨਾਂ ਨੂੰ ਸਿਰਫ਼ ਆਪਣੇ ਦਿਸਣ ਵਾਲਾ ਨਾਂ ਦੇ ਸਕਦੇ ਹੋ।",
  "chat.contact.renamed_by_you": "ਤੁਹਾਡੇ ਵੱਲੋਂ ਦਿੱਤਾ ਨਾਂ",
  "chat.contact.copy_peer_id": "ਪੀਅਰ ID ਨਕਲ ਕਰੋ",
  "chat.contact.verify": "ਸੰਪਰਕ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "ਨੋਟਿਸ",
  "chat.notices.post_area": "ਇਸ ਇਲਾਕੇ ਲਈ ਨੋਟਿਸ ਲਾਓ",
  "chat.notices.post_mesh": "ਮੈਸ਼ ’ਤੇ ਨੋਟਿਸ ਲਾਓ",
  "chat.notices.mark_urgent": "ਜ਼ਰੂਰੀ ਵਜੋਂ ਨਿਸ਼ਾਨ ਲਾਓ",
  "chat.notices.post": "ਨੋਟਿਸ ਲਾਓ",
  "chat.notices.post_short": "ਲਾਓ",
  "chat.notices.delete": "ਨੋਟਿਸ ਮਿਟਾਓ",
  "chat.notices.just_now": "ਹੁਣੇ",
  "chat.notices.fades_soon": "ਜਲਦੀ ਮਿਟ ਜਾਵੇਗਾ",
  "chat.notices.1_day": "1 ਦਿਨ",
  "chat.notices.3_days": "3 ਦਿਨ",
  "chat.notices.7_days": "7 ਦਿਨ",
  "chat.notices.fading": "ਮਿਟ ਰਿਹਾ ਹੈ",
  "chat.notices.fades_in_hours": "{count} ਘੰਟੇ ਵਿੱਚ ਮਿਟੇਗਾ",
  "chat.notices.fades_in_days": "{count} ਦਿਨ ਵਿੱਚ ਮਿਟੇਗਾ",
  "chat.notices.scope_geo": "ਭੂ",
  "chat.notices.scope_mesh": "ਮੈਸ਼",
  "chat.notices.urgent_short": "ਜ਼ਰੂਰੀ",
  "chat.notices.permanent_warning":
    "ਕਦੇ ਨਹੀਂ ਮਿਟਦਾ। ਜਨਤਕ ਹੈ ਅਤੇ ਇਸ ਇਲਾਕੇ ਨਾਲ ਜੁੜਿਆ ਹੋਇਆ ਹੈ, ਅਤੇ ਤੁਸੀਂ ਇਸ ਨੂੰ ਵਾਪਸ ਨਹੀਂ ਲੈ ਸਕਦੇ।",
  "chat.notices.none":
    "ਹਾਲੇ ਕੋਈ ਨੋਟਿਸ ਨਹੀਂ। ਇੱਕ ਲਾਓ ਤਾਂ ਜੋ ਇਹ ਹੋਰਾਂ ਲਈ ਇੱਥੇ ਰਹੇ।",

  // ---- Chats: search results ----
  "chat.search.photos": "ਫ਼ੋਟੋਆਂ",
  "chat.search.videos": "ਵੀਡੀਓਜ਼",
  "chat.search.audio": "ਆਡੀਓ",
  "chat.search.documents": "ਦਸਤਾਵੇਜ਼",
  "chat.search.links": "ਲਿੰਕ",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "{filter} ਨਾਲ ਛਾਣੋ",
  "chat.search.no_matches": "“{query}” ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ {filter} ਨਹੀਂ",
  "chat.search.no_media": "ਹਾਲੇ ਕੋਈ {filter} ਨਹੀਂ",
  "chat.search.result_a11y": "{chat}, {sender} ਵੱਲੋਂ {kind}",
  "chat.search.you": "ਤੁਸੀਂ",
  "chat.search.section_chats": "ਗੱਲਬਾਤਾਂ",
  "chat.search.section_messages": "ਸੁਨੇਹੇ",
  "chat.search.section_notices": "ਨੋਟਿਸ",
  "chat.search.hint": "ਸੁਨੇਹੇ ਅਤੇ ਗੱਲਬਾਤਾਂ ਖੋਜੋ, ਜਾਂ ਉੱਪਰੋਂ ਕੋਈ ਛਾਣਨੀ ਚੁਣੋ।",
  "chat.search.no_results": "“{query}” ਲਈ ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ",
  "chat.search.open_chat": "{name} ਖੋਲ੍ਹੋ",
  "chat.search.message_a11y": "{chat}, {sender} ਵੱਲੋਂ ਸੁਨੇਹਾ: {snippet}",
  "chat.search.notice_a11y": "{chat} ਵਿੱਚ {author} ਵੱਲੋਂ ਨੋਟਿਸ: {snippet}",
  "chat.search.urgent": "ਜ਼ਰੂਰੀ ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "ਇਸ ਸੂਚੀ ਵਿੱਚ {count}। ਸਾਫ਼ ਕਰਨ ਨਾਲ ਇਹ ਸਿਰਫ਼ ਇੱਥੋਂ ਹਟਦੇ ਹਨ, ਅਤੇ ਸੁਨੇਹੇ ਆਪਣੀਆਂ ਗੱਲਬਾਤਾਂ ਵਿੱਚ ਅਣਪੜ੍ਹੇ ਹੀ ਰਹਿੰਦੇ ਹਨ। ਸਭ ਨੂੰ ਪੜ੍ਹਿਆ ਨਿਸ਼ਾਨ ਲਾਉਣ ਨਾਲ ਦੋਵੇਂ ਸਾਫ਼ ਹੋ ਜਾਂਦੇ ਹਨ।",
  "chat.notif.mark_all_read": "ਸਭ ਪੜ੍ਹਿਆ ਨਿਸ਼ਾਨ ਲਾਓ",
  "chat.notif.clear_list": "ਸੂਚੀ ਸਾਫ਼ ਕਰੋ",
  "chat.notif.clear_all_a11y": "ਸਾਰੀਆਂ {count} ਸੂਚਨਾਵਾਂ ਸਾਫ਼ ਕਰੋ",
  "chat.notif.title": "ਸੂਚਨਾਵਾਂ",
  "chat.notif.clear_short": "ਸਾਫ਼ ਕਰੋ",
  "chat.notif.close": "ਸੂਚਨਾਵਾਂ ਬੰਦ ਕਰੋ",
  "chat.notif.none": "ਹਾਲੇ ਕੋਈ ਸੂਚਨਾ ਨਹੀਂ",
  "chat.notif.none_desc":
    "ਤੁਹਾਡੇ ਚੈਨਲਾਂ ਅਤੇ ਗੱਲਬਾਤਾਂ ਵਿੱਚੋਂ ਸੁਨੇਹੇ, ਜ਼ਿਕਰ ਅਤੇ ਨੋਟਿਸ ਇੱਥੇ ਦਿਸਦੇ ਹਨ।",
  "chat.notif.new": "ਨਵਾਂ",
  "chat.notif.notice_in": "{channel} ਵਿੱਚ ਨੋਟਿਸ",

  // ---- Chats: forward ----
  "chat.forward.title": "ਅੱਗੇ ਭੇਜੋ…",
  "chat.forward.to": "{name} ਨੂੰ ਅੱਗੇ ਭੇਜੋ",
  "chat.forward.cant_send_here": "ਇੱਥੇ ਅੱਗੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾ ਸਕਦਾ",
  "chat.forward.cant_send_to": "{name} ਨੂੰ ਅੱਗੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾ ਸਕਦਾ",
  "chat.forward.channels": "ਚੈਨਲ",
  "chat.forward.groups": "ਗਰੁੱਪ",
  "chat.forward.locations": "ਟਿਕਾਣੇ",
  "chat.forward.dms": "ਸਿੱਧੇ ਸੁਨੇਹੇ",
  "chat.forward.none": "ਹਾਲੇ ਕੋਈ ਹੋਰ ਗੱਲਬਾਤ ਨਹੀਂ",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "ਮੈਸ਼ ਸ਼ੁਰੂ ਕਰ ਰਹੇ ਹਾਂ…",
  "mesh.banner.no_bluetooth": "ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਬਲੂਟੁੱਥ ਨਹੀਂ · ਸਿਰਫ਼ ਇੰਟਰਨੈੱਟ",
  "mesh.banner.bluetooth_off": "ਬਲੂਟੁੱਥ ਬੰਦ · ਮੈਸ਼ ਉਪਲਬਧ ਨਹੀਂ",
  "mesh.banner.bluetooth_off_wifi": "ਬਲੂਟੁੱਥ ਬੰਦ · ਮੈਸ਼ WiFi ਉੱਤੇ ਚੱਲ ਰਿਹਾ ਹੈ",
  "mesh.banner.permission_needed": "ਬਲੂਟੁੱਥ ਦੀ ਇਜਾਜ਼ਤ ਚਾਹੀਦੀ ਹੈ",
  "mesh.banner.blocked": "ਬਲੂਟੁੱਥ ਰੋਕਿਆ ਹੋਇਆ · ਸੈਟਿੰਗਾਂ ਵਿੱਚੋਂ ਇਜਾਜ਼ਤ ਦਿਓ",
  "mesh.banner.location_permission": "ਪੀਅਰ ਲੱਭਣ ਲਈ ਟਿਕਾਣਾ ਚਾਹੀਦਾ ਹੈ",
  "mesh.banner.advertising_unsupported":
    "ਇਹ ਫ਼ੋਨ ਹੋਰਾਂ ਨੂੰ ਦੇਖ ਸਕਦਾ ਹੈ ਪਰ ਆਪ ਲੱਭਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ",
  "mesh.banner.location_off_android":
    "ਟਿਕਾਣਾ ਬੰਦ · ਪੀਅਰ ਲੱਭਣ ਲਈ Android ਨੂੰ ਇਹ ਚਾਹੀਦਾ ਹੈ",
  "mesh.banner.paused": "ਮੈਸ਼ ਰੁਕਿਆ · ਤੁਸੀਂ ਦੂਰ ਹੋ",
  "mesh.banner.location_off": "ਟਿਕਾਣਾ ਬੰਦ · ਟਿਕਾਣਾ ਚੈਨਲ ਉਪਲਬਧ ਨਹੀਂ",
  "mesh.banner.battery_saver": "ਬੈਟਰੀ ਬਚਾਊ · ਘੱਟ ਵਾਰ ਖੋਜ ਰਹੇ ਹਾਂ",
  "mesh.banner.wipe_incomplete":
    "ਸਫ਼ਾਈ ਅਧੂਰੀ · ਕੁਝ ਡਾਟਾ ਬਚਿਆ ਹੋ ਸਕਦਾ ਹੈ, ਦੁਬਾਰਾ ਖੋਲ੍ਹਣ ’ਤੇ ਕੋਸ਼ਿਸ਼ ਹੁੰਦੀ ਹੈ",
  "mesh.banner.wifi_off": "Wi-Fi ਬੰਦ · ਵੱਡੀਆਂ ਫ਼ਾਈਲਾਂ ਹੌਲੀ ਜਾਂਦੀਆਂ ਹਨ",
  "mesh.banner.clock_skew":
    "ਇਸ ਫ਼ੋਨ ਦੀ ਘੜੀ ਗ਼ਲਤ ਹੈ · ਤਾਰੀਖ਼ ਅਤੇ ਸਮਾਂ ਆਪੇ-ਸੈੱਟ ’ਤੇ ਲਾਓ",
  "mesh.banner.internet_off": "ਇੰਟਰਨੈੱਟ ਬੰਦ · ਸਿਰਫ਼ ਬਲੂਟੁੱਥ",
  "mesh.banner.relaying": "ਕੋਈ ਸਥਾਨਕ ਪੀਅਰ ਨਹੀਂ · Nostr ਰਾਹੀਂ ਭੇਜ ਰਹੇ ਹਾਂ",
  "mesh.banner.tor": "Tor ਚਾਲੂ · ਇੰਟਰਨੈੱਟ ਦੀ ਆਵਾਜਾਈ ਰਾਊਟ ਹੋ ਰਹੀ ਹੈ",
  "mesh.banner.tor_starting": "Tor ਸ਼ੁਰੂ ਕਰ ਰਹੇ ਹਾਂ · ਜੁੜ ਰਹੇ ਹਾਂ",
  "mesh.banner.tor_blocked": "Tor ਜੁੜ ਨਹੀਂ ਸਕਿਆ · ਮੈਸ਼ ਫਿਰ ਵੀ ਚੱਲਦਾ ਹੈ",
  "mesh.banner.gateway":
    "ਇੰਟਰਨੈੱਟ ਗੇਟਵੇ ਚਾਲੂ · ਨੇੜਲੇ ਪੀਅਰਾਂ ਲਈ ਅੱਗੇ ਭੇਜ ਰਹੇ ਹਾਂ",
  "mesh.banner.bridge": "ਮੈਸ਼ ਪੁਲ ਚਾਲੂ · ਜਨਤਕ ਗੱਲਬਾਤ ਜੁੜੀ ਹੋਈ",
  "mesh.banner.background_limits": "{brand} ਪਿਛੋਕੜ ਵਿੱਚ ਮੈਸ਼ ਰੋਕ ਸਕਦਾ ਹੈ",
  "mesh.banner.bridge_across": "ਮੈਸ਼ ਪੁਲ ਚਾਲੂ · {count} ਪੁਲ ਦੇ ਪਾਰ",
  "mesh.banner.action.turn_on": "ਚਾਲੂ ਕਰੋ",
  "mesh.banner.action.allow": "ਇਜਾਜ਼ਤ ਦਿਓ",
  "mesh.banner.action.resume": "ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ",
  "mesh.banner.action.fix": "ਠੀਕ ਕਰੋ",
  "mesh.banner.hint.resume": "ਬਲੂਟੁੱਥ ਦਾ ਐਲਾਨ ਅਤੇ ਖੋਜ ਦੁਬਾਰਾ ਚਾਲੂ ਕਰਦਾ ਹੈ",
  "mesh.banner.hint.enable_bluetooth":
    "Android ਨੂੰ ਬਲੂਟੁੱਥ ਚਾਲੂ ਕਰਨ ਲਈ ਕਹਿੰਦਾ ਹੈ",
  "mesh.banner.hint.location_settings": "ਸਿਸਟਮ ਦੀਆਂ ਟਿਕਾਣਾ ਸੈਟਿੰਗਾਂ ਖੋਲ੍ਹਦਾ ਹੈ",
  "mesh.banner.hint.app_settings":
    "ਸਿਸਟਮ ਸੈਟਿੰਗਾਂ ਵਿੱਚ Airhop ਦੀਆਂ ਇਜਾਜ਼ਤਾਂ ਖੋਲ੍ਹਦਾ ਹੈ",
  "mesh.banner.hint.battery_settings":
    "ਇਸ ਫ਼ੋਨ ਦੀਆਂ ਪਿਛੋਕੜ ਸਰਗਰਮੀ ਸੈਟਿੰਗਾਂ ਖੋਲ੍ਹਦਾ ਹੈ",
  "mesh.banner.dismiss": "ਹਟਾਓ: {label}",
  "mesh.banner.hint.dismiss": "ਇਹ ਨੋਟ ਪੱਕੇ ਤੌਰ ’ਤੇ ਲੁਕਾ ਦਿੰਦਾ ਹੈ",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "ਨੇੜਲੇ ਪੀਅਰ ਖੋਜ ਰਹੇ ਹਾਂ…",
  "mesh.radar.starting": "ਮੈਸ਼ ਸ਼ੁਰੂ ਕਰ ਰਹੇ ਹਾਂ…",
  "mesh.radar.no_bluetooth": "ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਬਲੂਟੁੱਥ ਨਹੀਂ",
  "mesh.radar.bluetooth_off": "ਬਲੂਟੁੱਥ ਬੰਦ · ਖੋਜ ਨਹੀਂ ਰਹੇ",
  "mesh.radar.permission_needed": "ਬਲੂਟੁੱਥ ਦੀ ਇਜਾਜ਼ਤ ਚਾਹੀਦੀ ਹੈ",
  "mesh.radar.blocked": "ਬਲੂਟੁੱਥ ਰੋਕਿਆ ਹੋਇਆ",
  "mesh.radar.location_permission": "ਟਿਕਾਣੇ ਦੀ ਇਜਾਜ਼ਤ ਚਾਹੀਦੀ ਹੈ",
  "mesh.radar.location_off": "ਟਿਕਾਣਾ ਬੰਦ · ਖੋਜ ਨਹੀਂ ਰਹੇ",
  "mesh.radar.hint_rings": "ਛੱਲੇ BLE ਸਿਗਨਲ ਦੀ ਤਾਕਤ ਦਿਖਾਉਂਦੇ ਹਨ, ਦੂਰੀ ਨਹੀਂ",
  "mesh.radar.hint_checking": "ਬਲੂਟੁੱਥ ਅਤੇ ਇਜਾਜ਼ਤਾਂ ਦੇਖ ਰਹੇ ਹਾਂ",
  "mesh.radar.hint_internet": "ਸੁਨੇਹੇ ਫਿਰ ਵੀ ਇੰਟਰਨੈੱਟ ’ਤੇ ਸਫ਼ਰ ਕਰਦੇ ਹਨ",
  "mesh.radar.hint_turn_on": "ਪੀਅਰ ਲੱਭਣ ਲਈ ਬਲੂਟੁੱਥ ਚਾਲੂ ਕਰੋ",
  "mesh.radar.hint_allow": "ਪੀਅਰ ਲੱਭਣ ਲਈ ਬਲੂਟੁੱਥ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ",
  "mesh.radar.hint_allow_settings":
    "ਪੀਅਰ ਲੱਭਣ ਲਈ ਸੈਟਿੰਗਾਂ ਵਿੱਚੋਂ ਬਲੂਟੁੱਥ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ",
  "mesh.radar.hint_location_permission":
    "Android 11 ਅਤੇ ਇਸ ਤੋਂ ਪੁਰਾਣਿਆਂ ਨੂੰ ਬਲੂਟੁੱਥ ’ਤੇ ਖੋਜਣ ਲਈ ਟਿਕਾਣਾ ਚਾਹੀਦਾ ਹੈ",
  "mesh.radar.hint_android_location":
    "ਬਲੂਟੁੱਥ ਖੋਜ ਦੇ ਨਤੀਜੇ ਦੇਣ ਲਈ Android ਨੂੰ ਟਿਕਾਣਾ ਚਾਲੂ ਚਾਹੀਦਾ ਹੈ",
  "mesh.radar.signal_strong": "ਤਕੜਾ",
  "mesh.radar.signal_medium": "ਦਰਮਿਆਨਾ",
  "mesh.radar.signal_weak": "ਕਮਜ਼ੋਰ",
  "mesh.radar.you_center": "ਤੁਸੀਂ, ਮੈਸ਼ ਦੇ ਵਿਚਕਾਰ",
  "mesh.radar.sonar_hint":
    "ਸੋਨਾਰ ਵਾਲੀ ਫੇਰੀ ਵਜਾਉਂਦਾ ਹੈ। ਖੋਜ ਤਾਂ ਪਹਿਲਾਂ ਹੀ ਲਗਾਤਾਰ ਚੱਲਦੀ ਹੈ।",
  "mesh.radar.paused": "ਮੈਸ਼ ਰੁਕਿਆ · ਤੁਸੀਂ ਦੂਰ ਹੋ",
  "mesh.radar.ring_hint": "ਛੱਲੇ ਦੀ ਥਾਂ ਸਿਗਨਲ ਦੀ ਤਾਕਤ ਦਰਸਾਉਂਦੀ ਹੈ, ਦੂਰੀ ਨਹੀਂ",
  "mesh.radar.set_online":
    "ਪੀਅਰ ਲੱਭਣ ਲਈ ਪ੍ਰੋਫ਼ਾਈਲ ਵਿੱਚੋਂ ਆਪਣੀ ਹਾਲਤ ਆਨਲਾਈਨ ਸੈੱਟ ਕਰੋ",
  "mesh.radar.in_range": "ਪਹੁੰਚ ਵਿੱਚ",
  "mesh.radar.recently_seen": "ਹਾਲ ਹੀ ਵਿੱਚ ਦਿਸੇ",
  "mesh.radar.peer_hint":
    "ਇਸ ਪੀਅਰ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜਣ ਜਾਂ ਭੁਗਤਾਨ ਕਰਨ ਦੇ ਵਿਕਲਪ ਖੋਲ੍ਹਦਾ ਹੈ",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "ਹੁਣੇ",
  "mesh.peer.none": "ਨੇੜੇ ਕੋਈ ਪੀਅਰ ਨਹੀਂ",
  "mesh.peer.none_desc":
    "ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿਚਲੇ ਹੋਰ Airhop ਜਾਂ bitchat ਡੀਵਾਈਸ ਇੱਥੇ ਦਿਸਦੇ ਹਨ।",
  "mesh.peer.id_copied": "ਪੀਅਰ ID ਨਕਲ ਹੋ ਗਈ",
  "mesh.peer.copy_id": "ਪੀਅਰ ID ਨਕਲ ਕਰੋ",
  "mesh.peer.their_name": "{name} ਵਜੋਂ ਜਾਣੇ ਜਾਂਦੇ ਹਨ",
  "mesh.peer.in_range": "ਪਹੁੰਚ ਵਿੱਚ",
  "mesh.peer.relay": "ਰਿਲੇ ਨੋਡ",
  "mesh.peer.relay_body":
    "ਇੱਕ ਰੇਡੀਓ ਜੋ ਕਿਸੇ ਨੇ ਮੈਸ਼ ਫੈਲਾਉਣ ਲਈ ਚੱਲਦਾ ਛੱਡਿਆ ਹੈ। ਇਹ ਉਹ ਸੁਨੇਹੇ ਲੈ ਕੇ ਜਾਂਦਾ ਹੈ ਜੋ ਇਹ ਪੜ੍ਹ ਨਹੀਂ ਸਕਦਾ। ਇੱਥੇ ਸੁਨੇਹਾ ਭੇਜਣ ਲਈ ਕੋਈ ਨਹੀਂ ਹੈ।",
  "mesh.peer.send_dm": "ਸਿੱਧਾ ਸੁਨੇਹਾ ਭੇਜੋ",
  "mesh.peer.message": "ਸੁਨੇਹਾ",
  "mesh.peer.send_sats": "ecash ਭੇਜੋ",
  "mesh.peer.amount_placeholder": "sats ਵਿੱਚ ਰਕਮ",
  "mesh.peer.amount_first": "ecash ਭੇਜੋ, ਪਹਿਲਾਂ ਰਕਮ ਭਰੋ",
  "mesh.peer.cancel_send": "ecash ਭੇਜਣਾ ਰੱਦ ਕਰੋ",
  "mesh.peer.view_peer": "ਪੀਅਰ {name} ਦੇਖੋ",
  "mesh.peer.view_peer_online": "ਪੀਅਰ {name} ਦੇਖੋ, ਆਨਲਾਈਨ",
  "mesh.peer.last_seen": "{ago} ਪਹਿਲਾਂ ਦਿਸੇ",
  "mesh.peer.send_amount": "{amount} sats ਭੇਜੋ",
  "mesh.peer.direct": "ਸਿੱਧਾ ਕਨੈਕਸ਼ਨ",
  "mesh.peer.check_distance": "ਦੂਰੀ ਦੇਖੋ",
  "mesh.peer.checking": "ਦੇਖ ਰਹੇ ਹਾਂ",
  "mesh.peer.no_reply": "ਕੋਈ ਜਵਾਬ ਨਹੀਂ",
  "mesh.peer.no_reply_hint":
    "ਹੋ ਸਕਦਾ ਹੈ ਉਹ ਹਿੱਲ ਗਏ ਹੋਣ, ਜਾਂ ਉਹਨਾਂ ਦੀ ਐਪ ਜਵਾਬ ਨਾ ਦਿੰਦੀ ਹੋਵੇ",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "ਖੇਤਰ",
  "mesh.level.province": "ਸੂਬਾ",
  "mesh.level.city": "ਸ਼ਹਿਰ",
  "mesh.level.neighborhood": "ਮੁਹੱਲਾ",
  "mesh.level.block": "ਸ਼ਹਿਰ ਦਾ ਬਲਾਕ",
  "mesh.level.building": "ਇਮਾਰਤ",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "ਖ਼ਰਚਯੋਗ",
  "wallet.balance.unit_hint": "ਸਾਤੋਸ਼ੀ ਅਤੇ ਬਿਟਕੌਇਨ ਵਿਚਕਾਰ ਬਦਲਦਾ ਹੈ",
  "wallet.balance.a11y": "ਬੈਲੰਸ {value} {unit}",
  "wallet.balance.locked":
    "ਵਾਲਿਟ ਦਾ ਭੰਡਾਰ ਲਾਕ ਹੈ। ecash ਪਰੂਫ਼ ਇੱਕ ਇਨਕ੍ਰਿਪਟਡ ਫ਼ਾਈਲ ਵਿੱਚ ਰੱਖੇ ਜਾਂਦੇ ਹਨ ਜਿਸ ਦੀ ਕੁੰਜੀ ਡੀਵਾਈਸ ਦੀ ਕੀਚੇਨ ਵਿੱਚ ਹੁੰਦੀ ਹੈ, ਅਤੇ ਇਹ ਖੁੱਲ੍ਹ ਨਹੀਂ ਸਕੀ। ਆਪਣਾ ਡੀਵਾਈਸ ਅਨਲਾਕ ਕਰੋ ਅਤੇ Airhop ਦੁਬਾਰਾ ਖੋਲ੍ਹੋ।",
  "wallet.balance.tor_blocked":
    "Tor ਚਾਲੂ ਹੈ, ਇਸ ਲਈ ਮਿੰਟ ਦੀਆਂ ਬੇਨਤੀਆਂ ਰੋਕ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ: ਇਹ ਖੁੱਲ੍ਹੇ ਨੈੱਟ ’ਤੇ ਜਾਣਗੀਆਂ ਅਤੇ ਤੁਹਾਡੇ IP ਨੂੰ ਤੁਹਾਡੇ ਪਰੂਫ਼ਾਂ ਨਾਲ ਜੋੜ ਦੇਣਗੀਆਂ। ਮੈਸ਼ ’ਤੇ ਭੇਜਣਾ ਅਤੇ ਲੈਣਾ ਫਿਰ ਵੀ ਚੱਲਦਾ ਹੈ। ਸੈਟਿੰਗਾਂ, ਸੁਰੱਖਿਆ ਵਿੱਚੋਂ ਮਿੰਟ ਦੀ ਆਵਾਜਾਈ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।",
  "wallet.balance.unconfirmed_note": "{amount} ਹਾਲੇ ਮਿੰਟ ਨਾਲ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਇਆ",
  "wallet.balance.reserved_note": "{amount} ਰਾਹ ਵਿੱਚ ਪਏ ਭੇਜਣ ਲਈ ਰਾਖਵਾਂ",
  "wallet.balance.other_mint_note": "{amount} ਇੱਕ ਵੱਖਰੇ ਮਿੰਟ ਖਾਤੇ ’ਤੇ",
  "wallet.balance.test_mint_note":
    "ਇਸ ਵਿੱਚ ਟੈਸਟ ਮਿੰਟ ਦਾ ਖੇਡ ਵਾਲਾ ਪੈਸਾ ਸ਼ਾਮਲ ਹੈ। ਇਹ ਬਿਟਕੌਇਨ ਨਹੀਂ ਹੈ ਅਤੇ ਕਢਵਾਇਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।",
  "wallet.token": "ਟੋਕਨ",
  "wallet.action.send": "ecash ਟੋਕਨ ਭੇਜੋ",
  "wallet.action.send_disabled": "ecash ਟੋਕਨ ਭੇਜੋ, ਖ਼ਾਲੀ ਬੈਲੰਸ ਨਾਲ ਉਪਲਬਧ ਨਹੀਂ",
  "wallet.action.receive": "ecash ਟੋਕਨ ਲਵੋ",
  "wallet.action.zap": "ਕਿਸੇ Nostr ਸੰਪਰਕ ਨੂੰ zap ਕਰੋ",
  "wallet.action.zap_disabled":
    "ਕਿਸੇ Nostr ਸੰਪਰਕ ਨੂੰ zap ਕਰੋ, ਖ਼ਾਲੀ ਬੈਲੰਸ ਨਾਲ ਉਪਲਬਧ ਨਹੀਂ",
  "wallet.action.add_mint": "Cashu ਮਿੰਟ ਜੋੜੋ",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "ਟੋਕਨ ਨਹੀਂ ਬਣ ਸਕਿਆ",
  "wallet.send.title": "ecash ਭੇਜੋ",
  "wallet.send.amount_in": "{unit} ਵਿੱਚ ਰਕਮ",
  "wallet.send.body":
    "ਤੁਹਾਡੇ ਕੋਲ ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਪਰੂਫ਼ਾਂ ਤੋਂ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਬਣਾਇਆ। ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਟੋਕਨ ਦੇ ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਕਰਦੇ, ਤੁਹਾਡੇ ਬੈਲੰਸ ਵਿੱਚੋਂ ਕੁਝ ਵੀ ਪੱਕੇ ਤੌਰ ’ਤੇ ਨਹੀਂ ਜਾਂਦਾ।",
  "wallet.send.stale_fee_note":
    "ਫ਼ੀਸਾਂ ਆਖ਼ਰੀ ਵਾਰ {days} ਦਿਨ ਪਹਿਲਾਂ ਦੇਖੀਆਂ ਗਈਆਂ ਸਨ। ਜੇ ਇਸ ਮਿੰਟ ਨੇ ਉਦੋਂ ਤੋਂ ਆਪਣੀ ਫ਼ੀਸ ਵਧਾ ਦਿੱਤੀ ਹੈ ਤਾਂ ਭੇਜਣਾ ਥੋੜ੍ਹਾ ਮਹਿੰਗਾ ਪੈ ਸਕਦਾ ਹੈ।",
  "wallet.send.fee_note":
    "{spend} {unit} ਤੁਹਾਡੇ ਬੈਲੰਸ ਵਿੱਚੋਂ ਜਾਂਦੇ ਹਨ; ਵਾਧੂ {fee} ਉਹ ਮਿੰਟ ਫ਼ੀਸ ਪੂਰੀ ਕਰਦੇ ਹਨ ਜੋ ਨਹੀਂ ਤਾਂ ਉਹਨਾਂ ਨੂੰ ਦੇਣੀ ਪੈਂਦੀ",
  "wallet.send.qr_too_big":
    "ਇਹ ਟੋਕਨ ਇੰਨੇ ਸਿੱਕਿਆਂ ਵਿੱਚ ਵੰਡਿਆ ਹੋਇਆ ਹੈ ਕਿ QR ਕੋਡ ਵਿੱਚ ਨਹੀਂ ਸਮਾਉਂਦਾ। ਇਸ ਦੀ ਥਾਂ ਇਸ ਨੂੰ ਸਾਂਝਾ ਜਾਂ ਨਕਲ ਕਰੋ, ਜਾਂ ਇਕੱਠਾ ਕਰਨ ਲਈ ਮਿੰਟ ’ਤੇ ਤਾਜ਼ਾ ਕਰੋ।",
  "wallet.send.bearer_note":
    "ਜਿਸ ਕੋਲ ਵੀ ਇਹ ਲਕੀਰ ਹੈ, ਪੈਸਾ ਉਸ ਦਾ ਹੈ। ਪਰੂਫ਼ ਰਾਖਵੇਂ ਹਨ, ਖ਼ਰਚੇ ਨਹੀਂ ਗਏ: ਜੇ ਇਹ ਕਿਸੇ ਤੱਕ ਨਾ ਪਹੁੰਚਿਆ ਤਾਂ ਤੁਸੀਂ ਇਹਨਾਂ ਨੂੰ ਬਕਾਇਆ ਹੇਠੋਂ ਵਾਪਸ ਲੈ ਸਕਦੇ ਹੋ।",
  "wallet.send.qr_too_big_short":
    "ਇਹ ਟੋਕਨ ਇੰਨੇ ਸਿੱਕਿਆਂ ਵਿੱਚ ਵੰਡਿਆ ਹੋਇਆ ਹੈ ਕਿ QR ਕੋਡ ਵਿੱਚ ਨਹੀਂ ਸਮਾਉਂਦਾ। ਇਸ ਦੀ ਥਾਂ ਇਸ ਨੂੰ ਸਾਂਝਾ ਜਾਂ ਨਕਲ ਕਰੋ।",
  "wallet.send.scan_note":
    "ਉਹਨਾਂ ਨੂੰ ਆਪਣੇ ਵਾਲਿਟ ਵਿੱਚੋਂ ਇਹ ਸਕੈਨ ਕਰਨ ਲਈ ਕਹੋ। ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਪਹੁੰਚਿਆ ਨਿਸ਼ਾਨ ਨਹੀਂ ਲਾਉਂਦੇ, ਇਹ ਵਾਪਸ ਲਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
  "wallet.send.mesh_note":
    "ਟੋਕਨ ਮੈਸ਼ ’ਤੇ ਇਨਕ੍ਰਿਪਟਡ DM ਵਜੋਂ ਜਾਂਦਾ ਹੈ। ਇੰਟਰਨੈੱਟ ਦੀ ਲੋੜ ਨਹੀਂ।",
  "wallet.send.no_peers_note":
    "ਨੇੜਲੇ ਡੀਵਾਈਸ ਲੱਭਣ ਲਈ ਮੈਸ਼ ਟੈਬ ਖੋਲ੍ਹੋ, ਜਾਂ ਟੋਕਨ ਕਿਸੇ ਹੋਰ ਤਰੀਕੇ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।",
  "wallet.send.send_to": "{name} ਨੂੰ ਭੇਜੋ",
  "wallet.send.memo": "ਯਾਦਪੱਤਰ (ਵਿਕਲਪਿਕ, ਟੋਕਨ ਨਾਲ ਹੀ ਜਾਂਦਾ ਹੈ)",
  "wallet.send.building": "ਬਣਾ ਰਹੇ ਹਾਂ…",
  "wallet.send.build": "ਟੋਕਨ ਬਣਾਓ",
  "wallet.send.inexact_body":
    "ਤੁਹਾਡੇ ਪਰੂਫ਼ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਬਿਲਕੁਲ {amount} {unit} ਨਹੀਂ ਬਣਾ ਸਕਦੇ। ਸਭ ਤੋਂ ਛੋਟਾ ਟੋਕਨ ਜੋ ਤੁਸੀਂ ਬਣਾ ਸਕਦੇ ਹੋ ਉਹ {spend} {unit} ਹੈ, ਅਤੇ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਕੋਈ ਬਾਕੀ ਨਹੀਂ ਮੁੜਦਾ: ਵਾਧੂ {extra} {unit} ਲੈਣ ਵਾਲੇ ਨੂੰ ਚਲੇ ਜਾਂਦੇ ਹਨ।\n\nਆਨਲਾਈਨ ਹੁੰਦਿਆਂ ਮਿੰਟ ’ਤੇ ਤਾਜ਼ਾ ਕਰਨ ਨਾਲ ਤੁਹਾਡੇ ਪਰੂਫ਼ ਅਜਿਹੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡ ਜਾਣਗੇ ਜੋ ਇਹ ਰਕਮ ਠੀਕ ਬਣਾ ਦੇਣ।",
  "wallet.send.send_amount": "{amount} ਭੇਜੋ",
  "wallet.send.sent_to": "{amount} {unit} {name} ਨੂੰ ਭੇਜੇ",
  "wallet.send.sent_to_body":
    "{route} ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਨਹੀਂ ਕਰਦੇ ਕਿ ਉਹਨਾਂ ਨੂੰ ਮਿਲ ਗਿਆ, ਜਾਂ ਮਿੰਟ ਸਾਨੂੰ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਪਰੂਫ਼ ਭੁਨਾ ਲਏ ਗਏ, ਇਹ ਬਕਾਇਆ ਹੇਠ ਵਾਪਸ ਲੈਣਯੋਗ ਰਹਿੰਦਾ ਹੈ।",
  "wallet.send.copy_token": "ਟੋਕਨ ਨਕਲ ਕਰੋ",
  "wallet.send.share_token": "ਟੋਕਨ ਸਾਂਝਾ ਕਰੋ",
  "wallet.send.open_in_wallet": "ਇਹ ਟੋਕਨ ਕਿਸੇ ਹੋਰ ਵਾਲਿਟ ਵਿੱਚ ਖੋਲ੍ਹੋ",
  "wallet.send.open_in_wallet_short": "ਵਾਲਿਟ ਵਿੱਚ ਖੋਲ੍ਹੋ",
  "wallet.send.to_peer": "ਟੋਕਨ ਕਿਸੇ ਨੇੜਲੇ ਪੀਅਰ ਨੂੰ ਭੇਜੋ",
  "wallet.send.to_peer_short": "ਪੀਅਰ ਨੂੰ ਭੇਜੋ",
  "wallet.send.mark_delivered": "ਪਹੁੰਚਿਆ ਨਿਸ਼ਾਨ ਲਾ ਕੇ ਮੁਕਾਓ",
  "wallet.send.they_got_it": "ਉਹਨਾਂ ਨੂੰ ਮਿਲ ਗਿਆ",
  "wallet.send.keep_pending": "ਇਹ ਭੇਜਣਾ ਬਕਾਇਆ ਰੱਖੋ",
  "wallet.send.decide_later": "ਬਾਅਦ ਵਿੱਚ ਫ਼ੈਸਲਾ ਕਰੋ",
  "wallet.send.no_peers": "ਪਹੁੰਚ ਵਿੱਚ ਕੋਈ ਪੀਅਰ ਨਹੀਂ",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "ਇਹ ਤੁਹਾਡਾ ਆਪਣਾ ਹੀ ਭੁਗਤਾਨ ਹੈ",
  "wallet.receive.own_payment_body":
    "ਇਹ ਸਿੱਕੇ ਹਾਲੇ ਵੀ ਉਸ ਭੇਜਣ ਲਈ ਰਾਖਵੇਂ ਹਨ ਜੋ ਤੁਸੀਂ ਨਿਬੇੜਿਆ ਨਹੀਂ, ਇਸ ਲਈ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕੁਝ ਨਹੀਂ ਹੈ। ਇਹਨਾਂ ਨੂੰ ਸਿੱਧਾ ਆਪਣੇ ਬੈਲੰਸ ਵਿੱਚ ਵਾਪਸ ਪਾਉਣ ਲਈ ਉਸ ਭੁਗਤਾਨ ’ਤੇ ਵਾਪਸ ਲਵੋ ਵਰਤੋ।",
  "wallet.receive.already_have": "ਪਹਿਲਾਂ ਹੀ ਤੁਹਾਡੇ ਵਾਲਿਟ ਵਿੱਚ",
  "wallet.receive.already_have_body":
    "ਇਸ ਟੋਕਨ ਦਾ ਹਰ ਪਰੂਫ਼ ਪਹਿਲਾਂ ਹੀ ਇੱਥੇ ਸੰਭਾਲਿਆ ਹੋਇਆ ਹੈ, ਇਸ ਲਈ ਕੁਝ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ। ਬੈਲੰਸ ਉਵੇਂ ਦਾ ਉਵੇਂ ਹੈ।",
  "wallet.receive.stored_unconfirmed":
    "{mint} ਤੋਂ ਸੰਭਾਲਿਆ, ਪਰ ਹਾਲੇ ਮਿੰਟ ਨਾਲ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ ({reason})।",
  "wallet.receive.offline": "ਆਫ਼ਲਾਈਨ",
  "wallet.receive.redeemed_here":
    "{mint} ’ਤੇ ਭੁਨਾ ਲਿਆ। ਇਹ ਪਰੂਫ਼ ਹੁਣ ਸਿਰਫ਼ ਤੁਹਾਡੇ ਹਨ: ਭੇਜਣ ਵਾਲੇ ਦੀ ਕਾਪੀ ਹੁਣ ਕੰਮ ਨਹੀਂ ਕਰਦੀ।",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "{mint} ’ਤੇ ਭੁਨਾ ਲਿਆ। ਹੁਣ ਇਹ ਸਾਬਤ ਤੌਰ ’ਤੇ ਤੁਹਾਡਾ ਹੈ: ਭੇਜਣ ਵਾਲੇ ਕੋਲ ਇਸ ਟੋਕਨ ਦੀ ਕਾਪੀ ਹੁਣ ਕੰਮ ਨਹੀਂ ਕਰਦੀ।",
  "wallet.receive.stored_pending":
    "{mint} ਤੋਂ ਸੰਭਾਲਿਆ, ਪਰ ਮਿੰਟ ਨੇ ਹਾਲੇ ਇਹ ਪੁਸ਼ਟੀ ਨਹੀਂ ਕੀਤੀ ਕਿ ਇਹ ਖ਼ਰਚਿਆ ਨਹੀਂ ਗਿਆ{dleq}। ਆਨਲਾਈਨ ਹੁੰਦਿਆਂ ਵਾਲਿਟ ਟੈਬ ਵਿੱਚੋਂ ਤਾਜ਼ਾ ਕਰੋ।",
  "wallet.receive.dleq_inline":
    " (ਇਸ ਦੇ ਦਸਤਖ਼ਤ ਸਹੀ ਨਿਕਲਦੇ ਹਨ, ਇਸ ਲਈ ਟੋਕਨ ਅਸਲੀ ਹੈ)",
  "wallet.receive.dleq_ok": "ਮਿੰਟ ਦੇ ਦਸਤਖ਼ਤ ਸਹੀ ਨਿਕਲਦੇ ਹਨ, ਇਸ ਲਈ ਟੋਕਨ ਅਸਲੀ ਹੈ।",
  "wallet.receive.dleq_uncached":
    "ਮਿੰਟ ਦੀਆਂ ਕੁੰਜੀਆਂ ਇੱਥੇ ਕੈਸ਼ ਨਹੀਂ ਹਨ, ਇਸ ਲਈ ਦਸਤਖ਼ਤ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਜਾਂਚੇ ਨਹੀਂ ਜਾ ਸਕੇ।",
  "wallet.receive.dleq_warning":
    "ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਆਨਲਾਈਨ ਤਾਜ਼ਾ ਨਹੀਂ ਕਰਦੇ, ਸਿਧਾਂਤਕ ਤੌਰ ’ਤੇ ਭੇਜਣ ਵਾਲਾ ਇਸ ਨੂੰ ਕਿਤੇ ਹੋਰ ਖ਼ਰਚ ਚੁੱਕਾ ਹੋ ਸਕਦਾ ਹੈ।",
  "wallet.receive.failed": "ਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
  "wallet.receive.title": "ecash ਲਵੋ",
  "wallet.receive.body":
    "Cashu ਟੋਕਨ ਚਿਪਕਾਓ। ਆਨਲਾਈਨ ਇਹ ਸਿੱਧਾ ਮਿੰਟ ’ਤੇ ਭੁਨਾ ਲਿਆ ਜਾਂਦਾ ਹੈ; ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਇਹ ਸੰਭਾਲ ਲਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੀ ਵਾਰ ਤਾਜ਼ਾ ਕਰਨ ’ਤੇ ਪੁਸ਼ਟੀ ਹੋ ਜਾਂਦੀ ਹੈ।",
  "wallet.receive.scan": "ecash QR ਕੋਡ ਸਕੈਨ ਕਰੋ",
  "wallet.receive.scan_short": "QR ਸਕੈਨ ਕਰੋ",
  "wallet.receive.receiving": "ਲੈ ਰਹੇ ਹਾਂ…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}… ਵੱਲੋਂ Nutzap ਮਿਲਿਆ ਅਤੇ ਤੁਹਾਡੇ ਵਾਲਿਟ ਵਿੱਚ ਭੁਨਾ ਲਿਆ ਗਿਆ।",
  "wallet.zap.title": "ਕਿਸੇ Nostr ਪਛਾਣ ਨੂੰ zap ਕਰੋ",
  "wallet.zap.not_npub": "npub ਨਹੀਂ ਹੈ",
  "wallet.zap.bad_key": "ਗ਼ਲਤ ਕੁੰਜੀ",
  "wallet.zap.invalid_pubkey": "ਅਵੈਧ ਜਨਤਕ ਕੁੰਜੀ",
  "wallet.zap.invalid_pubkey_body":
    "npub1… ਜਾਂ 64 ਅੱਖਰਾਂ ਵਾਲੀ ਹੈਕਸ Nostr ਜਨਤਕ ਕੁੰਜੀ ਭਰੋ।",
  "wallet.zap.sent": "Nutzap ਭੇਜਿਆ",
  "wallet.zap.failed": "Zap ਅਸਫਲ",
  "wallet.zap.body":
    "ਜੇ ਉਹ NIP-61 nutzap ਜਾਣਕਾਰੀ ਛਾਪਦੇ ਹਨ ਤਾਂ ecash ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ ਹੋ ਜਾਂਦਾ ਹੈ ਤਾਂ ਜੋ ਹੋਰ ਕੋਈ ਇਸ ਨੂੰ ਖ਼ਰਚ ਨਾ ਸਕੇ, ਅਤੇ ਇਹ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ। ਜੇ ਨਹੀਂ, ਤਾਂ ਇਹ ਵਾਪਸ ਲੈਣਯੋਗ ਟੋਕਨ ਵਜੋਂ ਜਾਂਦਾ ਹੈ। ਕੀ ਹੋਇਆ, ਤੁਹਾਨੂੰ ਦੱਸ ਦਿੱਤਾ ਜਾਵੇਗਾ।",
  "wallet.zap.contact": "{name} ਨੂੰ zap ਕਰੋ",
  "wallet.zap.pubkey_placeholder": "npub1… ਜਾਂ 64 ਅੱਖਰਾਂ ਵਾਲੀ ਹੈਕਸ",
  "wallet.zap.sending": "ਭੇਜ ਰਹੇ ਹਾਂ…",
  "wallet.nostr.copied_body":
    "ਇਹ ਕਿਸੇ ਨੂੰ ਦਿਓ ਅਤੇ ਉਹ ਤੁਹਾਨੂੰ Airhop ਜਾਂ ਕਿਸੇ ਹੋਰ Nostr ਵਾਲਿਟ ਤੋਂ zap ਕਰ ਸਕਦੇ ਹਨ, ਬਿਨਾਂ ਕਿਸੇ ਬਲੂਟੁੱਥ ਦੇ।",
  "wallet.nostr.copy_key":
    "ਆਪਣੀ Nostr ਕੁੰਜੀ ਨਕਲ ਕਰੋ ਤਾਂ ਜੋ ਲੋਕ ਤੁਹਾਨੂੰ zap ਕਰ ਸਕਣ",
  "wallet.nostr.your_key": "ਤੁਹਾਡੀ Nostr ਕੁੰਜੀ",

  // ---- Wallet: mints ----
  "wallet.mint.added": "ਮਿੰਟ ਜੋੜਿਆ",
  "wallet.mint.add_failed": "ਮਿੰਟ ਜੋੜਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
  "wallet.mint.added_named": "{name} ਜੋੜਿਆ",
  "wallet.mint.added_body":
    "{mint} {units} ਜਾਰੀ ਕਰਦਾ ਹੈ। ਇਸ ਦੀਆਂ ਕੁੰਜੀਆਂ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਕੈਸ਼ ਹੋ ਗਈਆਂ ਹਨ, ਇਸ ਲਈ ਹੁਣ ਇਸ ਦੇ ਟੋਕਨਾਂ ਦੀ ਪੁਸ਼ਟੀ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਵੀ ਹੋ ਸਕਦੀ ਹੈ।",
  "wallet.mint.remove_plain":
    "{mint} ਨੂੰ ਆਪਣੇ ਵਾਲਿਟ ਵਿੱਚੋਂ ਹਟਾਉਣਾ ਹੈ? ਇਸ ਦੀਆਂ ਕੈਸ਼ ਕੀਤੀਆਂ ਕੁੰਜੀਆਂ ਵੀ ਚਲੀਆਂ ਜਾਣਗੀਆਂ, ਇਸ ਲਈ ਇਸ ਦੇ ਟੋਕਨਾਂ ਦੀ ਪੁਸ਼ਟੀ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਨਹੀਂ ਹੋ ਸਕੇਗੀ।",
  "wallet.mint.title": "ਮਿੰਟ",
  "wallet.mint.none": "ਹਾਲੇ ਕੋਈ ਮਿੰਟ ਨਹੀਂ",
  "wallet.mint.none_desc":
    "ਮਿੰਟ ਤੁਹਾਡਾ ecash ਜਾਰੀ ਕਰਦਾ ਅਤੇ ਭੁਨਾਉਂਦਾ ਹੈ। Lightning ’ਤੇ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ ਇੱਕ ਜੋੜੋ, ਜਾਂ ਬੱਸ ਕੋਈ ਟੋਕਨ ਲਵੋ ਅਤੇ ਇਸ ਦਾ ਮਿੰਟ ਤੁਹਾਡੇ ਲਈ ਆਪੇ ਜੁੜ ਜਾਂਦਾ ਹੈ।",
  "wallet.mint.add": "ਮਿੰਟ ਜੋੜੋ",
  "wallet.mint.add_body":
    "ਮਿੰਟ ਤੁਹਾਡੇ ecash ਦੇ ਪਿੱਛੇ ਦਾ ਬਿਟਕੌਇਨ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ ਉਹੀ ਚੁਣੋ ਜਿਸ ’ਤੇ ਤੁਸੀਂ ਉੱਥੇ ਰੱਖੇ ਬੈਲੰਸ ਦਾ ਭਰੋਸਾ ਕਰ ਸਕੋ। ਸੰਭਾਲਣ ਤੋਂ ਪਹਿਲਾਂ URL ਜਾਂਚਿਆ ਜਾਂਦਾ ਹੈ। ਜੇ ਤੁਸੀਂ ਕਿਸੇ ’ਤੇ ਭਰੋਸਾ ਨਹੀਂ ਕਰਨਾ ਚਾਹੁੰਦੇ ਤਾਂ Nutshell ਨਾਲ ਆਪਣਾ ਚਲਾਓ।",
  "wallet.mint.consolidate_body":
    "ਟੋਕਨ ਕਦੇ ਵੀ ਸਿਰਫ਼ ਇੱਕ ਮਿੰਟ ਦਾ ਨਾਂ ਲੈ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਕਈਆਂ ਵਿੱਚ ਵੰਡਿਆ ਬੈਲੰਸ ਉਸ ਰਕਮ ਤੋਂ ਵੱਧ ਨਹੀਂ ਦੇ ਸਕਦਾ ਜਿੰਨੀ ਸਭ ਤੋਂ ਵੱਡੇ ਕੋਲ ਹੈ। Airhop ਇਸ ਨੂੰ ਹਿਲਾ ਸਕਦਾ ਹੈ: ਹਰ ਦੂਜਾ ਮਿੰਟ ਤੁਹਾਡੇ ਚੁਣੇ ਮਿੰਟ ਦਾ ਜਾਰੀ ਕੀਤਾ Lightning ਇਨਵੌਇਸ ਭਰਦਾ ਹੈ। ਇਸ ’ਤੇ ਥੋੜ੍ਹੀ ਰਾਊਟਿੰਗ ਫ਼ੀਸ ਲੱਗਦੀ ਹੈ ਅਤੇ ਇੰਟਰਨੈੱਟ ਚਾਹੀਦਾ ਹੈ।",
  "wallet.mint.add_short": "ਮਿੰਟ ਜੋੜੋ",
  "wallet.mint.checking": "ਜਾਂਚ ਰਹੇ ਹਾਂ…",
  "wallet.mint.remove_with_balance": "ਬੈਲੰਸ ਵਾਲਾ ਮਿੰਟ ਹਟਾਉਣਾ ਹੈ?",
  "wallet.mint.remove": "ਮਿੰਟ ਹਟਾਓ",
  "wallet.mint.delete_anyway": "ਫਿਰ ਵੀ ਮਿਟਾਓ",
  "wallet.mint.consolidate": "ਸਾਰੇ ਬੈਲੰਸ ਇੱਕ ਮਿੰਟ ’ਤੇ ਲੈ ਜਾਓ",
  "wallet.mint.confirm_with": "{mint} ਨਾਲ ਪਰੂਫ਼ਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
  "wallet.mint.remove_a11y": "{mint} ਹਟਾਓ",
  "wallet.mint.available_amount": "{amount} {unit} ਉਪਲਬਧ",
  "wallet.mint.split_across":
    "ਬੈਲੰਸ {count} ਮਿੰਟਾਂ ਵਿੱਚ ਵੰਡਿਆ ਹੋਇਆ ਹੈ। ਇਸ ਨੂੰ ਇੱਕ ’ਤੇ ਲੈ ਜਾਓ।",
  "wallet.mint.move_everything_to": "ਸਭ ਕੁਝ {mint} ’ਤੇ ਲੈ ਜਾਓ",
  "wallet.mint.consolidate_title": "ਇੱਕ ਮਿੰਟ ’ਤੇ ਲੈ ਜਾਓ",
  "wallet.mint.moving": "ਲਿਜਾ ਰਹੇ ਹਾਂ…",
  "wallet.mint.move": "ਲੈ ਜਾਓ",
  "wallet.mint.moved": "ਲੈ ਗਏ",
  "wallet.mint.moved_body":
    "{fees} {unit} Lightning ਰਾਊਟਿੰਗ ਫ਼ੀਸਾਂ ਤੋਂ ਬਾਅਦ, {amount} {unit} ਹੁਣ {mint} ’ਤੇ ਹਨ।",
  "wallet.mint.nothing_moved": "ਕੁਝ ਨਹੀਂ ਹਿੱਲਿਆ",
  "wallet.mint.destination": "· ਮੰਜ਼ਿਲ",
  "wallet.mint.will_move": "· ਲਿਜਾਇਆ ਜਾਵੇਗਾ",
  "wallet.mint.issued_by": "ਜਾਰੀ ਕਰਤਾ",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop ਵਾਲਿਟ ਵਿੱਚ ਪੈਸੇ ਪਾਉਣੇ",
  "wallet.ln.invoice_failed": "ਇਨਵੌਇਸ ਨਹੀਂ ਬਣ ਸਕਿਆ",
  "wallet.ln.price_failed": "ਇਸ ਇਨਵੌਇਸ ਦੀ ਕੀਮਤ ਨਹੀਂ ਲੱਗ ਸਕੀ",
  "wallet.ln.paid": "ਭਰਿਆ",
  "wallet.ln.deposit_credited":
    "ਇਨਵੌਇਸ ਭਰ ਦਿੱਤਾ ਗਿਆ ਅਤੇ {mint} ਨੇ {amount} {unit} ਜਾਰੀ ਕੀਤੇ। ਇਹ ਬੈਲੰਸ ਪੁਸ਼ਟੀਸ਼ੁਦਾ ਹੈ: ਤੁਸੀਂ ਇਸ ਨੂੰ ਹੁਣੇ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਖ਼ਰਚ ਸਕਦੇ ਹੋ।",
  "wallet.ln.withdrawn":
    "{paid} sats Lightning ’ਤੇ ਭੇਜੇ ਗਏ। ਮਿੰਟ ਨੇ {fee} sats ਰਾਊਟਿੰਗ ਫ਼ੀਸ ਲਈ।",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats Lightning ’ਤੇ ਭੇਜੇ ਗਏ। ਮਿੰਟ ਨੇ {fee} sats ਰਾਊਟਿੰਗ ਫ਼ੀਸ ਲਈ, ਅਤੇ ਰਾਖਵੇਂ ਵਿੱਚੋਂ {change} sats ਤੁਹਾਡੇ ਬੈਲੰਸ ਵਿੱਚ ਵਾਪਸ ਪਾ ਦਿੱਤੇ।",
  "wallet.ln.payment_failed": "ਭੁਗਤਾਨ ਅਸਫਲ",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning sats ਨੂੰ ਅਜਿਹੇ ecash ਵਿੱਚ ਬਦਲੋ ਜੋ ਤੁਸੀਂ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਖ਼ਰਚ ਸਕੋ, ਜਾਂ ecash ਨੂੰ ਕਿਸੇ ਵੀ Lightning ਇਨਵੌਇਸ ’ਤੇ ਵਾਪਸ ਕਢਵਾਓ। ਦੋਵਾਂ ਲਈ ਇੰਟਰਨੈੱਟ ਅਤੇ ਇੱਕ ਮਿੰਟ ਚਾਹੀਦਾ ਹੈ।",
  "wallet.ln.deposit_body":
    "ਮਿੰਟ ਤੁਹਾਨੂੰ ਇਨਵੌਇਸ ਦਿੰਦਾ ਹੈ। ਇਸ ਨੂੰ ਕਿਸੇ ਵੀ Lightning ਵਾਲਿਟ ਤੋਂ ਭਰੋ ਅਤੇ sats ਅਜਿਹੇ ecash ਵਜੋਂ ਵਾਪਸ ਆ ਜਾਂਦੇ ਹਨ ਜੋ ਤੁਸੀਂ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਖ਼ਰਚ ਸਕਦੇ ਹੋ।",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit} ਲਈ ਇਹ ਇਨਵੌਇਸ ਭਰੋ। ਵਾਲਿਟ ਭੁਗਤਾਨ ’ਤੇ ਨਜ਼ਰ ਰੱਖ ਰਿਹਾ ਹੈ ਅਤੇ ਤੁਹਾਡਾ ecash ਆਪੇ ਜਾਰੀ ਕਰ ਦੇਵੇਗਾ।",
  "wallet.ln.expired_body":
    "ਇਹ ਇਨਵੌਇਸ ਬੇਮਿਆਦ ਹੋ ਗਿਆ। ਜੇ ਤੁਸੀਂ ਇਹ ਪਹਿਲਾਂ ਹੀ ਭਰ ਦਿੱਤਾ ਸੀ ਤਾਂ ਬੈਲੰਸ ਆਪੇ ਜੁੜ ਜਾਵੇਗਾ।",
  "wallet.ln.waiting_expires": "ਭੁਗਤਾਨ ਦੀ ਉਡੀਕ · {countdown} ਵਿੱਚ ਬੇਮਿਆਦ",
  "wallet.ln.withdraw_body":
    "bolt11 ਇਨਵੌਇਸ ਚਿਪਕਾਓ ਅਤੇ ਮਿੰਟ ਇਸ ਨੂੰ ਤੁਹਾਡੇ ecash ਵਿੱਚੋਂ ਭਰ ਦਿੰਦਾ ਹੈ। ਪਹਿਲਾਂ ਤੁਹਾਨੂੰ ਰਾਊਟਿੰਗ ਰਾਖਵਾਂ ਦੱਸਿਆ ਜਾਂਦਾ ਹੈ; ਰਾਊਟਿੰਗ ਜੋ ਨਹੀਂ ਵਰਤਦੀ, ਉਹ ਤੁਹਾਡੇ ਬੈਲੰਸ ਵਿੱਚ ਵਾਪਸ ਆ ਜਾਂਦਾ ਹੈ।",
  "wallet.ln.up_to": "{amount} {unit} ਤੱਕ",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} ਭਰੋ",
  "wallet.ln.deposit": "Lightning ’ਤੇ sats ਜਮ੍ਹਾਂ ਕਰੋ",
  "wallet.ln.deposit_short": "ਜਮ੍ਹਾਂ ਕਰੋ",
  "wallet.ln.withdraw": "Lightning ਇਨਵੌਇਸ ’ਤੇ ਕਢਵਾਓ",
  "wallet.ln.withdraw_short": "ਕਢਵਾਓ",
  "wallet.ln.deposit_title": "Lightning ’ਤੇ ਜਮ੍ਹਾਂ ਕਰੋ",
  "wallet.ln.amount_placeholder": "sats ਵਿੱਚ ਰਕਮ",
  "wallet.ln.requesting": "ਬੇਨਤੀ ਕਰ ਰਹੇ ਹਾਂ…",
  "wallet.ln.get_invoice": "ਇਨਵੌਇਸ ਲਵੋ",
  "wallet.ln.copy_invoice": "ਇਨਵੌਇਸ ਨਕਲ ਕਰੋ",
  "wallet.ln.open_wallet": "Lightning ਵਾਲਿਟ ਵਿੱਚ ਖੋਲ੍ਹੋ",
  "wallet.ln.open_wallet_short": "ਵਾਲਿਟ ਵਿੱਚ ਖੋਲ੍ਹੋ",
  "wallet.ln.waiting": "ਭੁਗਤਾਨ ਦੀ ਉਡੀਕ…",
  "wallet.ln.new_invoice": "ਨਵਾਂ ਇਨਵੌਇਸ ਬਣਾਓ",
  "wallet.ln.new_invoice_short": "ਨਵਾਂ ਇਨਵੌਇਸ",
  "wallet.ln.withdraw_title": "Lightning ’ਤੇ ਕਢਵਾਓ",
  "wallet.ln.scan_invoice": "Lightning ਇਨਵੌਇਸ ਦਾ QR ਕੋਡ ਸਕੈਨ ਕਰੋ",
  "wallet.ln.paid_from": "ਇੱਥੋਂ ਭਰਿਆ",
  "wallet.ln.invoice": "ਇਨਵੌਇਸ",
  "wallet.ln.routing_reserve": "ਰਾਊਟਿੰਗ ਰਾਖਵਾਂ",
  "wallet.ln.reserved": "ਬੈਲੰਸ ਵਿੱਚੋਂ ਰਾਖਵਾਂ",
  "wallet.ln.paying": "ਭਰ ਰਹੇ ਹਾਂ…",
  "wallet.ln.get_quote": "ਹਵਾਲਾ ਲਵੋ",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "ਬੈਕਅੱਪ",
  "wallet.backup.setup_failed": "ਬੈਕਅੱਪ ਸੈੱਟ ਨਹੀਂ ਹੋ ਸਕਿਆ",
  "wallet.backup.on": "ਬੈਕਅੱਪ ਚਾਲੂ",
  "wallet.backup.on_body":
    "ਤੁਹਾਡਾ ਬੈਲੰਸ ਹੁਣ ਉਹਨਾਂ ਬਾਰਾਂ ਸ਼ਬਦਾਂ ਤੋਂ ਦੁਬਾਰਾ ਬਣਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।\n\nਜੋ ਕੁਝ ਤੁਹਾਨੂੰ ਕਿਸੇ ਹੋਰ ਨੇ ਦਿੱਤਾ ਹੈ, ਉਹ ਮਿੰਟ ’ਤੇ ਤਾਜ਼ਾ ਕਰਨ ਤੱਕ ਵਾਕੰਸ਼ ਤੋਂ ਬਾਹਰ ਰਹਿੰਦਾ ਹੈ, ਅਤੇ ਰਿਕਵਰੀ ਲਈ ਤੁਹਾਡੀ ਮਿੰਟ ਸੂਚੀ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਸ਼ਬਦਾਂ ਦੇ ਨਾਲ ਹੀ ਲਿਖ ਕੇ ਰੱਖੋ।",
  "wallet.backup.no_phrase": "ਕੋਈ ਵਾਕੰਸ਼ ਸੰਭਾਲਿਆ ਨਹੀਂ",
  "wallet.backup.no_phrase_body":
    "ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਡੀਵਾਈਸ ਦੀ ਕੀਚੇਨ ਵਿੱਚੋਂ ਪੜ੍ਹਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ। ਡੀਵਾਈਸ ਅਨਲਾਕ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "wallet.backup.replace_title": "ਆਪਣਾ ਮੌਜੂਦਾ ਵਾਕੰਸ਼ ਬਦਲਣਾ ਹੈ?",
  "wallet.backup.replace_body":
    "ਤੁਹਾਡੇ ਕੋਲ ਪਹਿਲਾਂ ਹੀ ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਹੈ। ਕੋਈ ਵੱਖਰਾ ਬਹਾਲ ਕਰਨ ਨਾਲ ਇਹ ਬਦਲ ਜਾਂਦਾ ਹੈ। ਪੁਰਾਣੇ ਵਾਕੰਸ਼ ਹੇਠ ਆਉਂਦੇ ਸਿੱਕੇ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਖ਼ਰਚਯੋਗ ਰਹਿੰਦੇ ਹਨ, ਪਰ ਉਹ ਬਹਾਲ ਹੋਣ ਯੋਗ ਨਹੀਂ ਰਹਿੰਦੇ, ਇਸ ਲਈ ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਪੱਕਾ ਕਰੋ ਕਿ ਪੁਰਾਣੇ ਸ਼ਬਦ ਲਿਖੇ ਹੋਏ ਹਨ।",
  "wallet.backup.replace": "ਬਦਲੋ",
  "wallet.backup.invalid_phrase": "ਉਹ ਵਾਕੰਸ਼ ਸਹੀ ਨਹੀਂ ਹੈ",
  "wallet.backup.invalid_phrase_body":
    "ਵਾਕੰਸ਼ ਵਿੱਚ ਆਪਣਾ ਹੀ ਜਾਂਚ-ਅੰਕ ਹੁੰਦਾ ਹੈ ਅਤੇ ਇਹ ਪੂਰਾ ਨਹੀਂ ਉਤਰਦਾ। ਕੋਈ ਗ਼ਲਤ ਲਿਖਿਆ, ਗੁੰਮ ਜਾਂ ਅੱਗੇ-ਪਿੱਛੇ ਹੋਇਆ ਸ਼ਬਦ ਦੇਖੋ।",
  "wallet.backup.not_bip39": "ਇਹ BIP-39 ਸ਼ਬਦ ਨਹੀਂ ਹਨ: {words}। ਸ਼ਬਦ-ਜੋੜ ਦੇਖੋ।",
  "wallet.backup.add_mint_first": "ਪਹਿਲਾਂ ਮਿੰਟ ਜੋੜੋ",
  "wallet.backup.add_mint_first_body":
    "ਰਿਕਵਰੀ ਮਿੰਟ ਤੋਂ ਇਹ ਪੁੱਛ ਕੇ ਕੰਮ ਕਰਦੀ ਹੈ ਕਿ ਉਸ ਨੇ ਤੁਹਾਡੇ ਲਈ ਕਿਹੜੇ ਸਿੱਕੇ ਦਸਤਖ਼ਤ ਕੀਤੇ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਕਿਹੜੇ ਮਿੰਟ ਤੋਂ ਪੁੱਛਣਾ ਹੈ। ਜੋ ਮਿੰਟ ਤੁਸੀਂ ਵਰਤ ਰਹੇ ਸੀ, ਉਹ ਜੋੜੋ, ਫਿਰ ਬਹਾਲ ਕਰੋ।",
  "wallet.backup.restore_failed": "ਬਹਾਲੀ ਅਸਫਲ",
  "wallet.backup.phrase": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼",
  "wallet.backup.state_unconfirmed": "ਬੈਕਅੱਪ ਚਾਲੂ ਪਰ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ",
  "wallet.backup.state_off": "ਬੈਕਅੱਪ ਬੰਦ",
  "wallet.backup.badge_on": "ਚਾਲੂ",
  "wallet.backup.badge_unconfirmed": "ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ",
  "wallet.backup.badge_off": "ਬੰਦ",
  "wallet.backup.view": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਦੇਖੋ",
  "wallet.backup.setup": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਸੈੱਟ ਕਰੋ",
  "wallet.backup.view_short": "ਵਾਕੰਸ਼ ਦੇਖੋ",
  "wallet.backup.setup_short": "ਸੈੱਟ ਕਰੋ",
  "wallet.backup.restore": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਤੋਂ ਵਾਲਿਟ ਬਹਾਲ ਕਰੋ",
  "wallet.backup.restore_short": "ਬਹਾਲ ਕਰੋ",
  "wallet.backup.setup_title": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਸੈੱਟ ਕਰੋ",
  "wallet.backup.on_body_short":
    "ਤੁਹਾਡਾ ਬੈਲੰਸ ਤੁਹਾਡੇ ਬਾਰਾਂ ਸ਼ਬਦਾਂ ਤੋਂ ਨਵੇਂ ਡੀਵਾਈਸ ’ਤੇ ਦੁਬਾਰਾ ਬਣਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।",
  "wallet.backup.unconfirmed_body":
    "ਤੁਸੀਂ ਕਦੇ ਲਿਖੀ ਹੋਈ ਕਾਪੀ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਕੀਤੀ। ਇਸ ਵੇਲੇ ਸ਼ਬਦ ਸਿਰਫ਼ ਇਸੇ ਫ਼ੋਨ ’ਤੇ ਹਨ, ਜੋ ਕਿ ਉਹੀ ਇੱਕ ਚੀਜ਼ ਹੈ ਜਿਸ ਤੋਂ ਬੈਕਅੱਪ ਨੇ ਬਚਣਾ ਹੁੰਦਾ ਹੈ। ਵਾਕੰਸ਼ ਦੇਖੋ ਅਤੇ ਲਿਖ ਲਵੋ।",
  "wallet.backup.not_covered":
    "{amount} ਹਾਲੇ ਇਸ ਦੇ ਘੇਰੇ ਵਿੱਚ ਨਹੀਂ ਹੈ। ਜੋ ਸਿੱਕੇ ਤੁਹਾਨੂੰ ਦਿੱਤੇ ਗਏ, ਉਹ ਭੇਜਣ ਵਾਲੇ ਦੇ ਭੇਦ ਨਾਲ ਲੈ ਕੇ ਆਉਂਦੇ ਹਨ, ਇਸ ਲਈ ਉਹ ਅਦਲਾ-ਬਦਲੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਤੁਹਾਡੇ ਵਾਕੰਸ਼ ਹੇਠ ਆਉਂਦੇ ਹਨ। ਇਹਨਾਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰਨ ਲਈ ਕੋਈ ਮਿੰਟ ਤਾਜ਼ਾ ਕਰੋ।",
  "wallet.backup.off_body":
    "ਤੁਹਾਡਾ ecash ਸਿਰਫ਼ ਇਸੇ ਫ਼ੋਨ ’ਤੇ ਹੈ। ਜੇ ਤੁਸੀਂ ਇਹ ਗੁਆ ਦਿੱਤਾ ਤਾਂ ਪੈਸਾ ਕੋਈ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਸਕਦਾ, ਤੁਸੀਂ ਵੀ ਨਹੀਂ। ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਬਾਰਾਂ ਸ਼ਬਦ ਹੁੰਦੇ ਹਨ ਜੋ ਤੁਹਾਡਾ ਬੈਲੰਸ ਕਿਤੇ ਵੀ ਦੁਬਾਰਾ ਬਣਾ ਸਕਦੇ ਹਨ।",
  "wallet.backup.about_to_see":
    "ਤੁਸੀਂ ਹੁਣ ਬਾਰਾਂ ਸ਼ਬਦ ਦੇਖਣ ਵਾਲੇ ਹੋ। ਉਹੀ ਪੈਸਾ ਹਨ।",
  "wallet.backup.exact_order":
    "ਬਾਰਾਂ ਸ਼ਬਦ, ਬਿਲਕੁਲ ਇਸੇ ਤਰਤੀਬ ਵਿੱਚ। ਜਿਸ ਕੋਲ ਵੀ ਇਹ ਹਨ, ਉਸ ਕੋਲ ਤੁਹਾਡਾ ਬੈਲੰਸ ਹੈ।",
  "wallet.backup.verify_body":
    "ਜੋ ਵਾਕੰਸ਼ ਕਿਸੇ ਨੇ ਲਿਖਿਆ ਹੀ ਨਹੀਂ, ਉਹ ਕੋਈ ਵਾਕੰਸ਼ ਨਾ ਹੋਣ ਨਾਲੋਂ ਵੀ ਮਾੜਾ ਹੈ, ਕਿਉਂਕਿ ਉਹ ਅਜਿਹਾ ਸੁਰੱਖਿਆ ਜਾਲ ਲੱਗਦਾ ਹੈ ਜੋ ਹੈ ਹੀ ਨਹੀਂ। ਪੁਸ਼ਟੀ ਲਈ ਦੋ ਸ਼ਬਦ।",
  "wallet.backup.verify_mismatch": "ਇਹ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ। ਆਪਣੀ ਲਿਖੀ ਕਾਪੀ ਦੇਖੋ।",
  "wallet.backup.restore_body":
    "ਬਾਰਾਂ ਸ਼ਬਦ ਭਰੋ। Airhop ਤੁਹਾਡੇ ਸਿੱਕੇ ਦੁਬਾਰਾ ਕੱਢਦਾ ਹੈ ਅਤੇ ਹਰ ਮਿੰਟ ਤੋਂ ਪੁੱਛਦਾ ਹੈ ਕਿ ਉਸ ਨੇ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜੇ ਦਸਤਖ਼ਤ ਕੀਤੇ ਸਨ, ਇਸ ਲਈ ਬੈਲੰਸ ਮਿੰਟ ਦੇ ਰੱਖੇ ਰਿਕਾਰਡ ਵਿੱਚੋਂ ਵਾਪਸ ਆਉਂਦਾ ਹੈ।",
  "wallet.backup.warn_secret":
    "ਜੋ ਵੀ ਇਹ ਪੜ੍ਹ ਲਵੇ, ਉਹ ਤੁਹਾਡਾ ਬੈਲੰਸ ਲੈ ਸਕਦਾ ਹੈ। ਇਹਨਾਂ ਦਾ ਸਕ੍ਰੀਨਸ਼ਾਟ ਨਾ ਲਵੋ ਅਤੇ ਇਹਨਾਂ ਨੂੰ ਇਸ ਫ਼ੋਨ ’ਤੇ ਨਾ ਰੱਖੋ।",
  "wallet.backup.warn_paper":
    "ਇਹਨਾਂ ਨੂੰ ਕਾਗ਼ਜ਼ ’ਤੇ ਲਿਖੋ ਅਤੇ ਕਿਸੇ ਸੁਰੱਖਿਅਤ ਥਾਂ ਰੱਖੋ। ਜੇ ਫ਼ੋਨ ਚਲਾ ਗਿਆ ਤਾਂ Airhop ਇਹ ਤੁਹਾਨੂੰ ਦੁਬਾਰਾ ਨਹੀਂ ਦਿਖਾ ਸਕਦਾ।",
  "wallet.backup.warn_scope":
    "ਇਹ ਸਿਰਫ਼ ਤੁਹਾਡਾ ecash ਦੁਬਾਰਾ ਬਣਾਉਂਦੇ ਹਨ। ਤੁਹਾਡੀ ਪਛਾਣ, ਗੱਲਬਾਤਾਂ ਅਤੇ ਸੰਪਰਕ ਇਸ ਦੇ ਘੇਰੇ ਵਿੱਚ ਨਹੀਂ ਹਨ।",
  "wallet.backup.warn_mints":
    "ਰਿਕਵਰੀ ਨੂੰ ਮਿੰਟ ਤੋਂ ਇਹ ਪੁੱਛਣਾ ਹੀ ਪੈਂਦਾ ਹੈ ਕਿ ਉਸ ਨੇ ਕਿਹੜੇ ਸਿੱਕੇ ਦਸਤਖ਼ਤ ਕੀਤੇ, ਇਸ ਲਈ ਆਪਣੀ ਮਿੰਟ ਸੂਚੀ ਸ਼ਬਦਾਂ ਦੇ ਨਾਲ ਹੀ ਲਿਖੋ।",
  "wallet.backup.preparing": "ਤਿਆਰ ਕਰ ਰਹੇ ਹਾਂ…",
  "wallet.backup.show_phrase": "ਮੇਰਾ ਵਾਕੰਸ਼ ਦਿਖਾਓ",
  "wallet.backup.your_phrase": "ਤੁਹਾਡਾ ਰਿਕਵਰੀ ਵਾਕੰਸ਼",
  "wallet.backup.write_down": "ਇਹ ਲਿਖ ਲਵੋ",
  "wallet.backup.copy_phrase": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਕਲਿੱਪਬੋਰਡ ’ਤੇ ਨਕਲ ਕਰੋ",
  "wallet.backup.copy_clipboard": "ਕਲਿੱਪਬੋਰਡ ’ਤੇ ਨਕਲ ਕਰੋ",
  "wallet.backup.written_down": "ਮੈਂ ਇਹ ਲਿਖ ਲਏ ਹਨ",
  "wallet.backup.check_copy": "ਆਪਣੀ ਕਾਪੀ ਜਾਂਚੋ",
  "wallet.backup.confirm": "ਪੁਸ਼ਟੀ ਕਰੋ",
  "wallet.backup.restore_title": "ਵਾਕੰਸ਼ ਤੋਂ ਬਹਾਲ ਕਰੋ",
  "wallet.backup.phrase_placeholder": "ਬਾਰਾਂ ਸ਼ਬਦ, ਖ਼ਾਲੀ ਥਾਂ ਨਾਲ ਵੱਖ ਕੀਤੇ",
  "wallet.backup.no_mints_yet":
    "ਹਾਲੇ ਕੋਈ ਮਿੰਟ ਨਹੀਂ ਜੋੜਿਆ। ਰਿਕਵਰੀ ਨੂੰ ਕਿਸੇ ਖ਼ਾਸ ਮਿੰਟ ਤੋਂ ਪੁੱਛਣਾ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਉਹ ਜੋੜੋ ਜੋ ਤੁਸੀਂ ਵਰਤ ਰਹੇ ਸੀ।",
  "wallet.backup.scanning": "ਖੰਗਾਲ ਰਹੇ ਹਾਂ…",
  "wallet.backup.restore_progress": "{mint} · ਕੁੰਜੀ-ਸੈੱਟ {total} ਵਿੱਚੋਂ {step}",
  "wallet.backup.will_scan":
    "ਖੰਗਾਲੇ ਜਾਣਗੇ: {mints}। ਜੋ ਮਿੰਟ ਤੁਸੀਂ ਨਹੀਂ ਜੋੜਿਆ, ਉਸ ਤੋਂ ਕਦੇ ਨਹੀਂ ਪੁੱਛਿਆ ਜਾਂਦਾ, ਇਸ ਲਈ ਉੱਥੋਂ ਦਾ ਬੈਲੰਸ ਅਣਦਿਸਦਾ ਰਹਿੰਦਾ ਹੈ।",
  "wallet.backup.word_n": "ਸ਼ਬਦ {position}",
  "wallet.backup.unreachable_mints":
    "ਪਹੁੰਚ ਨਹੀਂ ਹੋ ਸਕੀ: {mints}। ਉੱਥੇ ਪਿਆ ਬੈਲੰਸ ਹਾਲੇ ਵੀ ਉੱਥੇ ਹੀ ਹੈ। ਜਦੋਂ ਬਿਹਤਰ ਕਨੈਕਸ਼ਨ ਹੋਵੇ ਤਾਂ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "wallet.backup.nothing_recovered":
    "ਖੰਗਾਲੇ ਗਏ ਮਿੰਟਾਂ ਵਿੱਚੋਂ ਕੁਝ ਵਾਪਸ ਨਹੀਂ ਮਿਲਿਆ।",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "ਮਿਲਿਆ ਨਿਸ਼ਾਨ ਲਾਉਣਾ ਹੈ?",
  "wallet.delivered.body":
    "ਇਹ {amount} {unit} ਪੱਕੇ ਤੌਰ ’ਤੇ ਛੱਡ ਦਿੰਦਾ ਹੈ। ਜੇ ਇਹ ਸੱਚਮੁੱਚ ਕਦੇ ਪਹੁੰਚਿਆ ਹੀ ਨਹੀਂ ਤਾਂ ਤੁਸੀਂ ਇਸ ਨੂੰ ਵਾਪਸ ਨਹੀਂ ਲੈ ਸਕੋਗੇ।",
  "wallet.delivered.body_generic":
    "ਇਹ ਰਾਖਵੀਂ ਰਕਮ ਪੱਕੇ ਤੌਰ ’ਤੇ ਛੱਡ ਦਿੰਦਾ ਹੈ। ਜੇ ਇਹ ਸੱਚਮੁੱਚ ਕਦੇ ਪਹੁੰਚੀ ਹੀ ਨਹੀਂ ਤਾਂ ਤੁਸੀਂ ਇਸ ਨੂੰ ਵਾਪਸ ਨਹੀਂ ਲੈ ਸਕੋਗੇ।",
  "wallet.delivered.cancel": "ਹਾਲੇ ਨਹੀਂ",
  "wallet.delivered.confirm": "ਉਹਨਾਂ ਨੂੰ ਮਿਲ ਗਿਆ",
  "wallet.reclaim.title": "ਇਹ ਟੋਕਨ ਵਾਪਸ ਲੈਣਾ ਹੈ?",
  "wallet.reclaim.body":
    "{amount} {unit} ਤੁਹਾਡੇ ਬੈਲੰਸ ਵਿੱਚ ਵਾਪਸ ਚਲੇ ਜਾਂਦੇ ਹਨ। ਇਹ ਸਿਰਫ਼ ਤਾਂ ਹੀ ਕਰੋ ਜੇ ਟੋਕਨ ਕਿਸੇ ਤੱਕ ਪਹੁੰਚਿਆ ਹੀ ਨਹੀਂ: ਜੇ ਉਹਨਾਂ ਕੋਲ ਪਹਿਲਾਂ ਹੀ ਉਹ ਲਕੀਰ ਹੈ ਤਾਂ ਜੋ ਵੀ ਇਸ ਨੂੰ ਮਿੰਟ ’ਤੇ ਪਹਿਲਾਂ ਭੁਨਾਏਗਾ ਪੈਸਾ ਉਸੇ ਦਾ ਰਹੇਗਾ, ਅਤੇ ਉਹ ਉਹੀ ਹੋ ਸਕਦੇ ਹਨ।",
  "wallet.reclaim.keep": "ਬਕਾਇਆ ਰੱਖੋ",
  "wallet.reclaim.confirm": "ਵਾਪਸ ਲਵੋ",
  "wallet.copied.token_body":
    "ਟੋਕਨ ਤੁਹਾਡੇ ਕਲਿੱਪਬੋਰਡ ’ਤੇ ਹੈ। ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਪਹੁੰਚਿਆ ਨਿਸ਼ਾਨ ਨਹੀਂ ਲਾਉਂਦੇ, ਇਹ ਇੱਥੇ ਰਾਖਵਾਂ ਰਹਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਜੇ ਪਹਿਲੀ ਕੋਸ਼ਿਸ਼ ਅਸਫਲ ਰਹੇ ਤਾਂ ਤੁਸੀਂ ਇਸ ਨੂੰ ਦੁਬਾਰਾ ਚਿਪਕਾ ਸਕਦੇ ਹੋ।",
  "wallet.copied.phrase_body":
    "ਇਸ ਨੂੰ ਕਿਸੇ ਪਾਸਵਰਡ ਮੈਨੇਜਰ ਵਿੱਚ ਚਿਪਕਾਓ, ਫਿਰ ਆਪਣਾ ਕਲਿੱਪਬੋਰਡ ਸਾਫ਼ ਕਰੋ। ਹੋਰ ਐਪਾਂ ਕਲਿੱਪਬੋਰਡ ਪੜ੍ਹ ਸਕਦੀਆਂ ਹਨ, ਅਤੇ ਕੁਝ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਇਹ ਤੁਹਾਡੇ ਹੋਰ ਡੀਵਾਈਸਾਂ ਨਾਲ ਸਿੰਕ ਹੁੰਦਾ ਹੈ।",
  "wallet.refresh.failed": "ਤਾਜ਼ਾ ਕਰਨਾ ਅਸਫਲ",
  "wallet.refresh.partly": "ਅੰਸ਼ਕ ਤੌਰ ’ਤੇ ਤਾਜ਼ਾ ਹੋਇਆ",
  "wallet.refresh.done": "ਤਾਜ਼ਾ ਹੋਇਆ",
  "wallet.refresh.unreachable":
    "{mints} ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ ਹੋ ਸਕੀ। ਬਾਕੀ ਸਭ ਕੁਝ ਤਾਜ਼ਾ ਹੈ।",
  "wallet.refresh.swapped":
    "{amount} {unit} ਦੀ ਪੁਸ਼ਟੀ ਹੋਈ ਅਤੇ ਨਵੇਂ ਪਰੂਫ਼ਾਂ ਨਾਲ ਅਦਲਾ-ਬਦਲੀ ਹੋ ਗਈ।",
  "wallet.refresh.secured":
    "{amount} {unit} ਹੁਣ ਤੁਹਾਡੇ ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਦੇ ਘੇਰੇ ਵਿੱਚ ਹਨ।",
  "wallet.refresh.all_confirmed":
    "ਇੱਥੇ ਸਭ ਕੁਝ ਪਹਿਲਾਂ ਹੀ ਮਿੰਟ ਨਾਲ ਪੁਸ਼ਟੀਸ਼ੁਦਾ ਸੀ।",
  "wallet.pending.title": "ਬਕਾਇਆ",
  "wallet.pending.reserved_desc":
    "ਬਣਾਇਆ ਅਤੇ ਰਾਖਵਾਂ ਕੀਤਾ, ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ। ਪਰੂਫ਼ ਤੁਹਾਡੇ ਬੈਲੰਸ ਤੋਂ ਬਾਹਰ ਰੱਖੇ ਗਏ ਹਨ ਤਾਂ ਜੋ ਇਹ ਦੋ ਵਾਰ ਖ਼ਰਚ ਨਾ ਹੋ ਸਕਣ।",
  "wallet.pending.locked_desc":
    "ਪਹਿਲਾਂ ਹੀ ਲੈਣ ਵਾਲੇ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਸਿਰਫ਼ ਉਹੀ ਖ਼ਰਚ ਸਕਦੇ ਹਨ। ਬੱਸ ਇਹ ਹਾਲੇ ਉਹਨਾਂ ਤੱਕ ਪਹੁੰਚਿਆ ਨਹੀਂ। ਮੁਕਾਉਣ ਲਈ ਟੋਕਨ ਸਾਂਝਾ ਕਰੋ।",
  "wallet.pending.show_qr": "ਇਹ ਟੋਕਨ QR ਕੋਡ ਵਜੋਂ ਦਿਖਾਓ",
  "wallet.pending.copy_again": "ਟੋਕਨ ਦੁਬਾਰਾ ਨਕਲ ਕਰੋ",
  "wallet.pending.share_again": "ਟੋਕਨ ਦੁਬਾਰਾ ਸਾਂਝਾ ਕਰੋ",
  "wallet.pending.mark_delivered": "ਇਸ ਟੋਕਨ ਨੂੰ ਪਹੁੰਚਿਆ ਨਿਸ਼ਾਨ ਲਾਓ",
  "wallet.pending.delivered": "ਪਹੁੰਚ ਗਿਆ",
  "wallet.pending.reclaim_into": "ਇਹ ਟੋਕਨ ਆਪਣੇ ਬੈਲੰਸ ਵਿੱਚ ਵਾਪਸ ਲਵੋ",
  "wallet.activity.title": "ਸਰਗਰਮੀ",
  "wallet.activity.none": "ਹਾਲੇ ਕੁਝ ਨਹੀਂ",
  "wallet.activity.none_desc":
    "ਤੁਹਾਡੇ ਭੇਜੇ ਅਤੇ ਲਏ ਭੁਗਤਾਨ ਇੱਥੇ ਦਿਸਦੇ ਹਨ, ਸਭ ਤੋਂ ਨਵੇਂ ਪਹਿਲਾਂ, ਹਰ ਇੱਕ ਦੇ ਮਿੰਟ ਅਤੇ ਫ਼ੀਸ ਸਮੇਤ।",
  "wallet.activity.show_fewer": "ਘੱਟ ਭੁਗਤਾਨ ਦਿਖਾਓ",
  "wallet.activity.show_less": "ਘੱਟ ਦਿਖਾਓ",
  "wallet.activity.received_unconfirmed": "ਮਿਲਿਆ, ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ",
  "wallet.activity.received": "ਮਿਲਿਆ",
  "wallet.activity.receive_failed": "ਲੈਣਾ ਅਸਫਲ",
  "wallet.activity.reclaimed": "ਵਾਪਸ ਲਿਆ",
  "wallet.activity.send_failed": "ਭੇਜਣਾ ਅਸਫਲ",
  "wallet.activity.sent": "ਭੇਜਿਆ",
  "wallet.activity.status_pending": "ਬਕਾਇਆ",
  "wallet.activity.status_failed": "ਅਸਫਲ",
  "wallet.activity.status_reclaimed": "ਵਾਪਸ ਲਿਆ",
  "wallet.activity.status_expired": "ਬੇਮਿਆਦ",
  "wallet.activity.ln_deposit": "Lightning ਜਮ੍ਹਾਂ",
  "wallet.activity.ln_withdrawal": "Lightning ਨਿਕਾਸੀ",
  "wallet.activity.nutzap_received": "Nutzap ਮਿਲਿਆ",
  "wallet.activity.spent_removed": "ਖ਼ਰਚੇ ਪਰੂਫ਼ ਹਟਾਏ",
  "wallet.activity.refreshed": "ਪਰੂਫ਼ ਤਾਜ਼ਾ ਹੋਏ",
  "wallet.activity.refreshing": "ਪਰੂਫ਼ ਤਾਜ਼ਾ ਕਰ ਰਹੇ ਹਾਂ",
  "wallet.activity.just_now": "ਹੁਣੇ",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "ਮੈਸ਼ ਆਫ਼ਲਾਈਨ",
  "wallet.mesh_offline_body":
    "ਮੈਸ਼ ਸੇਵਾ ਨਹੀਂ ਚੱਲ ਰਹੀ, ਇਸ ਲਈ ਟੋਕਨ ਸੌਂਪਣ ਲਈ ਕੁਝ ਨਹੀਂ ਹੈ। ਇਹ ਬਕਾਇਆ ਹੇਠ ਰਾਖਵਾਂ ਰਹਿੰਦਾ ਹੈ।",
  "wallet.xfer.route_mesh": "ਮੈਸ਼ ’ਤੇ ਸਿੱਧਾ ਉਹਨਾਂ ਦੇ ਡੀਵਾਈਸ ਨੂੰ ਸੌਂਪਿਆ।",
  "wallet.xfer.route_nostr":
    "ਉਹ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਸਨ, ਇਸ ਲਈ ਇਹ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਗਿਆ।",
  "wallet.xfer.route_courier":
    "ਇਸ ਵੇਲੇ ਉਹਨਾਂ ਤੱਕ ਕੋਈ ਰਸਤਾ ਨਹੀਂ। ਇਸ ਨੂੰ ਹੋਰ ਡੀਵਾਈਸ ਲੈ ਕੇ ਜਾਣਗੇ ਅਤੇ ਜਦੋਂ ਕੋਈ ਉਹਨਾਂ ਤੱਕ ਪਹੁੰਚੇਗਾ ਤਾਂ ਪਹੁੰਚਾ ਦਿੱਤਾ ਜਾਵੇਗਾ।",
  "wallet.xfer.route_queued":
    "ਉਹਨਾਂ ਤੱਕ ਹਾਲੇ ਪਹੁੰਚ ਨਹੀਂ ਹੈ। ਇਹ ਕਤਾਰ ਵਿੱਚ ਹੈ ਅਤੇ ਜਿਵੇਂ ਹੀ ਪਹੁੰਚ ਹੋਈ, ਭੇਜ ਦਿੱਤਾ ਜਾਵੇਗਾ।",
  "wallet.xfer.mesh_offline_body":
    "ਮੈਸ਼ ਸੇਵਾ ਨਹੀਂ ਚੱਲ ਰਹੀ, ਇਸ ਲਈ ਟੋਕਨ ਸੌਂਪਣ ਦਾ ਕੋਈ ਰਾਹ ਨਹੀਂ ਹੈ। ਕੁਝ ਵੀ ਨਹੀਂ ਕੱਟਿਆ ਗਿਆ।",
  "wallet.xfer.could_not_send": "ਭੇਜਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
  "wallet.xfer.inexact_body":
    "ਤੁਹਾਡੇ ਪਰੂਫ਼ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਬਿਲਕੁਲ {amount} {unit} ਨਹੀਂ ਬਣਾ ਸਕਦੇ। ਸਭ ਤੋਂ ਛੋਟਾ ਟੋਕਨ ਜੋ ਤੁਸੀਂ ਬਣਾ ਸਕਦੇ ਹੋ ਉਹ {spend} {unit} ਹੈ, ਅਤੇ ਵਾਧੂ {extra} {unit} ਉਹਨਾਂ ਨੂੰ ਚਲੇ ਜਾਂਦੇ ਹਨ, ਵਾਪਸ ਲੈਣ ਦਾ ਕੋਈ ਰਾਹ ਨਹੀਂ।\n\nਆਨਲਾਈਨ ਹੁੰਦਿਆਂ ਮਿੰਟ ’ਤੇ ਤਾਜ਼ਾ ਕਰਨ ਨਾਲ ਤੁਹਾਡੇ ਪਰੂਫ਼ ਅਜਿਹੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡ ਜਾਂਦੇ ਹਨ ਜੋ ਇਹ ਰਕਮ ਠੀਕ ਬਣਾ ਦੇਣ।",
  "wallet.xfer.send_amount": "{amount} ਭੇਜੋ",
  "wallet.xfer.mesh_offline": "ਮੈਸ਼ ਆਫ਼ਲਾਈਨ",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ ਅਤੇ Nostr ’ਤੇ ਛਾਪਿਆ। ਇਹ ਉਹਨਾਂ ਦਾ ਹੈ, ਭਾਵੇਂ ਉਹ ਆਨਲਾਈਨ ਹੋਣ ਜਾਂ ਨਾ।",
  "wallet.pay.rail_nutzap_dm":
    "ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ। ਰਿਲੇ ਨੇ ਇਹ ਨਹੀਂ ਲਿਆ, ਇਸ ਲਈ ਇਹ ਉਹਨਾਂ ਕੋਲ ਸੁਨੇਹੇ ਵਜੋਂ ਗਿਆ।",
  "wallet.pay.rail_nutzap_undelivered":
    "ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ, ਪਰ ਇਸ ਨੂੰ ਹਾਲੇ ਕੋਈ ਲੈ ਕੇ ਨਹੀਂ ਜਾ ਸਕਿਆ। ਇਹ ਕਤਾਰ ਵਿੱਚ ਹੈ, ਅਤੇ ਟੋਕਨ ਬਕਾਇਆ ਹੇਠ ਹੈ।",
  "wallet.pay.final":
    "ਲਾਕ ਕੀਤੇ ਭੁਗਤਾਨ ਵਾਪਸ ਨਹੀਂ ਲਏ ਜਾ ਸਕਦੇ: ਇਹ ਸਿੱਕੇ ਹੁਣ ਸਿਰਫ਼ ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਹੀ ਖ਼ਰਚ ਸਕਦੀ ਹੈ।",
  "wallet.pay.reclaimable":
    "ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਕਰਦੇ, ਇਹ ਵਾਲਿਟ ਟੈਬ ਵਿੱਚੋਂ ਵਾਪਸ ਲੈਣਯੋਗ ਰਹਿੰਦਾ ਹੈ।",
  "wallet.pay.why": "ਇਸ ਤਰੀਕੇ ਭੇਜਿਆ ਕਿਉਂਕਿ {reason}।",
  "wallet.pay.sent_title": "{amount} {unit} {name} ਨੂੰ",
  "wallet.pay.thread_receipt":
    "ਤੁਸੀਂ {amount} {unit} ਭੇਜੇ, ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ ਕੀਤੇ।",
  "wallet.pay.title": "ecash ਭੇਜੋ",
  "wallet.pay.to": "{name} ਨੂੰ",
  "wallet.pay.amount": "sats ਵਿੱਚ ਰਕਮ",
  "wallet.pay.memo": "ਨੋਟ (ਵਿਕਲਪਿਕ, ਜਨਤਕ)",
  "wallet.pay.send": "ਭੇਜੋ",
  "wallet.pay.sending": "ਭੇਜ ਰਹੇ ਹਾਂ…",
  "wallet.pay.action": "ecash ਭੇਜੋ",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "ਕੈਮਰੇ ਦੀ ਪਹੁੰਚ",
  "wallet.scan.camera_purpose": "ecash QR ਕੋਡ ਸਕੈਨ ਕਰਨ",
  "wallet.scan.photo_label": "ਫ਼ੋਟੋ ਦੀ ਪਹੁੰਚ",
  "wallet.scan.photo_purpose": "ਤਸਵੀਰ ਵਿੱਚੋਂ ecash QR ਪੜ੍ਹਨ",
  "wallet.scan.no_token": "ਉਸ ਤਸਵੀਰ ਵਿੱਚ ਕੋਈ ecash ਟੋਕਨ ਨਹੀਂ ਮਿਲਿਆ।",
  "wallet.scan.no_invoice": "ਉਸ ਤਸਵੀਰ ਵਿੱਚ ਕੋਈ Lightning ਇਨਵੌਇਸ ਨਹੀਂ ਮਿਲਿਆ।",
  "wallet.scan.unreadable": "ਉਹ ਤਸਵੀਰ ਪੜ੍ਹੀ ਨਹੀਂ ਜਾ ਸਕੀ।",
  "wallet.scan.camera_failed":
    "ਕੈਮਰਾ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਹੋਰ ਕੈਮਰਾ ਐਪਾਂ ਬੰਦ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "wallet.scan.close": "ਸਕੈਨਰ ਬੰਦ ਕਰੋ",
  "wallet.scan.on_device":
    "ਇਹ ਇਸੇ ਡੀਵਾਈਸ ’ਤੇ ਪੜ੍ਹਿਆ ਜਾਂਦਾ ਹੈ; ਕੁਝ ਵੀ ਕਿਤੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ।",
  "wallet.scan.aim_token": "ecash QR ਕੋਡ ਵੱਲ ਸੇਧੋ।",
  "wallet.scan.aim_invoice": "Lightning ਇਨਵੌਇਸ ਦੇ QR ਕੋਡ ਵੱਲ ਸੇਧੋ।",
  "wallet.scan.title_token": "ecash ਸਕੈਨ ਕਰੋ",
  "wallet.scan.title_invoice": "ਇਨਵੌਇਸ ਸਕੈਨ ਕਰੋ",
  "wallet.scan.desc_token":
    "ਕਿਸੇ ਹੋਰ ਵਾਲਿਟ ਵਿੱਚੋਂ Cashu ਟੋਕਨ ਪੜ੍ਹੋ। ਕਿਸੇ ਵੀ Cashu ਵਾਲਿਟ ਨਾਲ ਚੱਲਦਾ ਹੈ, ਸਿਰਫ਼ Airhop ਨਾਲ ਨਹੀਂ।",
  "wallet.scan.desc_invoice":
    "Lightning ਇਨਵੌਇਸ ਪੜ੍ਹੋ ਤਾਂ ਜੋ ਇਸ ਨੂੰ ਆਪਣੇ ਬੈਲੰਸ ਵਿੱਚੋਂ ਭਰ ਸਕੋ।",
  "wallet.scan.use_camera_a11y": "ਕੈਮਰੇ ਨਾਲ ਸਕੈਨ ਕਰੋ",
  "wallet.scan.use_camera": "ਕੈਮਰਾ ਵਰਤੋ",
  "wallet.scan.pick_image_a11y": "ਸੰਭਾਲੀ ਤਸਵੀਰ ਵਿੱਚੋਂ QR ਕੋਡ ਪੜ੍ਹੋ",
  "wallet.scan.pick_image": "ਫ਼ੋਟੋਆਂ ਵਿੱਚੋਂ ਚੁਣੋ",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu ਕੀ ਹੈ?",
  "wallet.explain.intro":
    "Cashu ਬਿਟਕੌਇਨ ਲਈ ecash ਹੈ। ਟੋਕਨ ਇੱਕ ਅਜਿਹੀ ਲਕੀਰ ਹੈ ਜਿਸ ਦੀ ਕੀਮਤ ਉਸ ਦੇ ਹੱਥ ਵਿੱਚ ਹੁੰਦੀ ਹੈ ਜਿਸ ਕੋਲ ਇਹ ਹੈ, ਅਤੇ ਮਿੰਟ ਨੇ ਇਸ ’ਤੇ ਅੱਖਾਂ ਬੰਦ ਕਰ ਕੇ ਦਸਤਖ਼ਤ ਕੀਤੇ ਹੁੰਦੇ ਹਨ ਤਾਂ ਜੋ ਮਿੰਟ ਨੂੰ ਪਤਾ ਨਾ ਲੱਗੇ ਕਿ ਕਿਸ ਨੇ ਕੀ ਖ਼ਰਚਿਆ। ਨਾ ਕੋਈ ਖਾਤਾ, ਨਾ ਕੋਈ ਲਾਗਇਨ।",
  "wallet.explain.send": "ਭੇਜੋ",
  "wallet.explain.send_desc":
    "ਰਕਮ ਨੂੰ ਅਜਿਹੇ ਟੋਕਨ ਵਿੱਚ ਬਦਲਦਾ ਹੈ ਜੋ ਤੁਸੀਂ ਬਲੂਟੁੱਥ ’ਤੇ ਕਿਸੇ ਨੇੜਲੇ ਪੀਅਰ ਨੂੰ ਸੌਂਪ ਸਕਦੇ ਹੋ, ਜਾਂ ਲਿਖਤ ਵਜੋਂ ਸਾਂਝਾ ਕਰ ਸਕਦੇ ਹੋ। ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਚੱਲਦਾ ਹੈ। ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਪਹੁੰਚਣ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਕਰਦੇ, ਪਰੂਫ਼ ਰਾਖਵੇਂ ਰਹਿੰਦੇ ਹਨ।",
  "wallet.explain.receive": "ਲਵੋ",
  "wallet.explain.receive_desc":
    "ਟੋਕਨ ਜੋੜਨ ਲਈ ਉਸ ਨੂੰ ਚਿਪਕਾਓ। ਆਨਲਾਈਨ ਇਹ ਤੁਰੰਤ ਮਿੰਟ ’ਤੇ ਅਦਲਾ-ਬਦਲੀ ਹੋ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਇਹ ਸਾਬਤ ਤੌਰ ’ਤੇ ਤੁਹਾਡਾ ਬਣ ਜਾਂਦਾ ਹੈ। ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਇਹ ਸੰਭਾਲ ਲਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਤਾਜ਼ਾ ਕਰਨ ਤੱਕ ਅਪੁਸ਼ਟ ਨਿਸ਼ਾਨਬੱਧ ਰਹਿੰਦਾ ਹੈ।",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "ਕਿਸੇ Nostr ਪਛਾਣ ਨੂੰ ਭੁਗਤਾਨ ਕਰਦਾ ਹੈ। ਜੇ ਉਹ NIP-61 nutzap ਜਾਣਕਾਰੀ ਛਾਪਦੇ ਹਨ ਤਾਂ ecash ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ ਹੋ ਜਾਂਦਾ ਹੈ ਤਾਂ ਜੋ ਇਸ ਨੂੰ ਸਿਰਫ਼ ਉਹੀ ਖ਼ਰਚ ਸਕਣ। ਨਹੀਂ ਤਾਂ ਇਹ ਇਨਕ੍ਰਿਪਟਡ DM ’ਤੇ ਆ ਜਾਂਦਾ ਹੈ। ਇੰਟਰਨੈੱਟ ਚਾਹੀਦਾ ਹੈ।",
  "wallet.explain.add_mint": "ਮਿੰਟ ਜੋੜੋ",
  "wallet.explain.add_mint_desc":
    "ਉਹ ਮਿੰਟ ਸੰਭਾਲਦਾ ਹੈ ਜੋ ਤੁਹਾਡਾ ecash ਜਾਰੀ ਕਰਦਾ ਅਤੇ ਭੁਨਾਉਂਦਾ ਹੈ, ਅਤੇ ਇਸ ਦੀਆਂ ਜਨਤਕ ਕੁੰਜੀਆਂ ਕੈਸ਼ ਕਰਦਾ ਹੈ ਤਾਂ ਜੋ ਇਸ ਦੇ ਟੋਕਨਾਂ ਦੀ ਪੁਸ਼ਟੀ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਹੋ ਸਕੇ। ਉਹੀ ਮਿੰਟ ਚੁਣੋ ਜਿਸ ’ਤੇ ਤੁਸੀਂ ਉੱਥੇ ਰੱਖੇ ਬੈਲੰਸ ਦਾ ਭਰੋਸਾ ਕਰ ਸਕੋ।",
  "wallet.explain.phrase": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼",
  "wallet.explain.phrase_desc":
    "ਤੁਹਾਡੇ ਸਿੱਕੇ ਉਹਨਾਂ ਬਾਰਾਂ ਸ਼ਬਦਾਂ ਤੋਂ ਕੱਢੇ ਜਾਂਦੇ ਹਨ ਜੋ ਵਾਲਿਟ ਸ਼ੁਰੂ ਵਿੱਚ ਬਣਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਨਵਾਂ ਫ਼ੋਨ ਤੁਹਾਡੇ ਮਿੰਟਾਂ ਤੋਂ ਪੁੱਛ ਕੇ ਬੈਲੰਸ ਦੁਬਾਰਾ ਬਣਾ ਸਕਦਾ ਹੈ ਕਿ ਉਹਨਾਂ ਨੇ ਕਿਹੜੇ ਸਿੱਕੇ ਦਸਤਖ਼ਤ ਕੀਤੇ ਸਨ। ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਇਹਨਾਂ ਨੂੰ ਦੇਖ ਕੇ ਲਿਖ ਨਹੀਂ ਲੈਂਦੇ, ਇਹ ਸਿਰਫ਼ ਇਸੇ ਫ਼ੋਨ ’ਤੇ ਹਨ।",

  // ---- Wallet: failures ----
  "wallet.err.locked": "ਵਾਲਿਟ ਲਾਕ ਹੈ",
  "wallet.err.mint_unreachable": "ਮਿੰਟ ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ",
  "wallet.err.tor_blocked": "Tor ਚਾਲੂ ਹੋਣ ’ਤੇ ਰੋਕਿਆ ਗਿਆ",
  "wallet.err.insufficient": "ਬੈਲੰਸ ਕਾਫ਼ੀ ਨਹੀਂ",
  "wallet.err.exact_amount": "ਇਹ ਬਿਲਕੁਲ ਸਹੀ ਰਕਮ ਨਹੀਂ ਭੇਜੀ ਜਾ ਸਕਦੀ",
  "wallet.err.no_mint": "ਕੋਈ ਮਿੰਟ ਨਹੀਂ",
  "wallet.err.mint_unsupported": "ਮਿੰਟ ਇਹ ਨਹੀਂ ਕਰ ਸਕਦਾ",
  "wallet.err.mint_refused": "ਮਿੰਟ ਨੇ ਨਾਂਹ ਕਰ ਦਿੱਤੀ",
  "wallet.err.unreadable": "ਟੋਕਨ ਪੜ੍ਹਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ",
  "wallet.err.rejected": "ਟੋਕਨ ਰੱਦ ਕੀਤਾ",
  "wallet.err.already_spent": "ਪਹਿਲਾਂ ਹੀ ਖ਼ਰਚਿਆ",
  "wallet.err.change_pending": "ਭਰਿਆ, ਬਾਕੀ ਬਕਾਇਆ",
  "wallet.svc.mint_unreachable": "ਮਿੰਟ ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ ਹੋ ਸਕੀ।",
  "wallet.svc.tor_ios": "iOS ’ਤੇ ਮਿੰਟ ਦੀਆਂ ਬੇਨਤੀਆਂ Tor ਰਾਹੀਂ ਨਹੀਂ ਜਾਂਦੀਆਂ।",
  "wallet.svc.tor_ios_body":
    "Arti ਸਿਰਫ਼ Nostr WebSockets ਨੂੰ ਲਪੇਟਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਬੇਨਤੀ ਮਿੰਟ ਤੱਕ ਖੁੱਲ੍ਹੇ ਨੈੱਟ ’ਤੇ ਪਹੁੰਚੇਗੀ ਅਤੇ ਤੁਹਾਡੇ IP ਨੂੰ ਇਹਨਾਂ ਪਰੂਫ਼ਾਂ ਨਾਲ ਜੋੜ ਦੇਵੇਗੀ। ਸੈਟਿੰਗਾਂ > ਸੁਰੱਖਿਆ ਹੇਠੋਂ ਇਸ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ, ਜਾਂ ਪਹਿਲਾਂ Tor ਬੰਦ ਕਰੋ। ਮੈਸ਼ ’ਤੇ ecash ਭੇਜਣਾ ਅਤੇ ਲੈਣਾ ਫਿਰ ਵੀ ਚੱਲਦਾ ਹੈ।",
  "wallet.svc.keys_uncached":
    "ਇਸ ਮਿੰਟ ਦੀਆਂ ਕੁੰਜੀਆਂ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਕੈਸ਼ ਨਹੀਂ ਹਨ।",
  "wallet.svc.keys_uncached_body":
    "ਇਹ ਲੈਣ ਲਈ ਆਨਲਾਈਨ ਹੁੰਦਿਆਂ ਵਾਲਿਟ ਇੱਕ ਵਾਰ ਖੋਲ੍ਹੋ।",
  "wallet.svc.phrase_invalid": "ਉਹ ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਸਹੀ ਨਹੀਂ ਹੈ।",
  "wallet.svc.phrase_invalid_body":
    "ਕੋਈ ਗ਼ਲਤ ਲਿਖਿਆ ਜਾਂ ਗੁੰਮ ਸ਼ਬਦ ਦੇਖੋ। ਵਾਕੰਸ਼ ਵਿੱਚ ਆਪਣਾ ਹੀ ਜਾਂਚ-ਅੰਕ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਇੱਕ ਗ਼ਲਤ ਸ਼ਬਦ ਪੂਰੀ ਚੀਜ਼ ਨੂੰ ਅਵੈਧ ਕਰ ਦਿੰਦਾ ਹੈ।",
  "wallet.svc.need_mint": "ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮਿੰਟ ਜੋੜੋ।",
  "wallet.svc.need_mint_body":
    "ਰਿਕਵਰੀ ਮਿੰਟ ਤੋਂ ਇਹ ਪੁੱਛ ਕੇ ਕੰਮ ਕਰਦੀ ਹੈ ਕਿ ਉਸ ਨੇ ਤੁਹਾਡੇ ਲਈ ਕਿਹੜੇ ਸਿੱਕੇ ਦਸਤਖ਼ਤ ਕੀਤੇ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਕਿਹੜੇ ਮਿੰਟ ਤੋਂ ਪੁੱਛਣਾ ਹੈ।",
  "wallet.svc.restored": "ਰਿਕਵਰੀ ਵਾਕੰਸ਼ ਤੋਂ ਬਹਾਲ ਕੀਤਾ",
  "wallet.svc.storage_locked": "ਵਾਲਿਟ ਦਾ ਭੰਡਾਰ ਲਾਕ ਹੈ।",
  "wallet.svc.storage_locked_body":
    "Airhop ecash ਪਰੂਫ਼ ਇੱਕ ਇਨਕ੍ਰਿਪਟਡ ਫ਼ਾਈਲ ਵਿੱਚ ਰੱਖਦਾ ਹੈ ਜਿਸ ਦੀ ਕੁੰਜੀ ਡੀਵਾਈਸ ਦੀ ਕੀਚੇਨ ਵਿੱਚ ਹੁੰਦੀ ਹੈ। ਡੀਵਾਈਸ ਅਨਲਾਕ ਕਰੋ ਅਤੇ ਐਪ ਦੁਬਾਰਾ ਖੋਲ੍ਹੋ।",
  "wallet.svc.bad_url": "ਇਹ ਸਹੀ URL ਨਹੀਂ ਹੈ।",
  "wallet.svc.needs_https": "ਮਿੰਟ ਦਾ URL https:// ਨਾਲ ਸ਼ੁਰੂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
  "wallet.svc.refuse_http": "ਸਾਦੇ http ’ਤੇ ਮਿੰਟ ਵਰਤਣ ਤੋਂ ਨਾਂਹ।",
  "wallet.svc.refuse_http_body":
    "ਨੈੱਟਵਰਕ ਦੇ ਰਾਹ ਵਿੱਚ ਪਿਆ ਕੋਈ ਵੀ ਤੁਹਾਡੇ ਪਰੂਫ਼ ਪੜ੍ਹ ਜਾਂ ਬਦਲ ਸਕਦਾ ਹੈ। https:// ਵਾਲਾ ਮਿੰਟ ਵਰਤੋ।",
  "wallet.svc.mint_not_saved": "ਮਿੰਟ ਸੰਭਾਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।",
  "wallet.svc.unreadable_token": "ਇਹ ਪੜ੍ਹਨਯੋਗ Cashu ਟੋਕਨ ਨਹੀਂ ਹੈ।",
  "wallet.svc.unreadable_token_body":
    "ਟੋਕਨ cashuA ਜਾਂ cashuB ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ। ਦੇਖੋ ਕਿ ਨਕਲ ਕਰਦਿਆਂ ਕੁਝ ਕੱਟਿਆ ਤਾਂ ਨਹੀਂ ਗਿਆ।",
  "wallet.svc.wrong_mint":
    "ਇਸ ਟੋਕਨ ’ਤੇ ਉਸ ਮਿੰਟ ਦੇ ਦਸਤਖ਼ਤ ਨਹੀਂ ਸਨ ਜਿਸ ਦਾ ਇਹ ਨਾਂ ਲੈਂਦਾ ਹੈ।",
  "wallet.svc.already_spent": "ਇਹ ਪਰੂਫ਼ ਪਹਿਲਾਂ ਹੀ ਖ਼ਰਚੇ ਜਾ ਚੁੱਕੇ ਹਨ।",
  "wallet.svc.already_spent_body":
    "ਜਿਸ ਨੇ ਇਹ ਟੋਕਨ ਭੇਜਿਆ, ਉਸ ਨੇ ਇਹ ਪਹਿਲਾਂ ਭੁਨਾ ਲਿਆ, ਜਾਂ ਉਹੀ ਟੋਕਨ ਕਿਸੇ ਹੋਰ ਨੂੰ ਵੀ ਭੇਜ ਦਿੱਤਾ।",
  "wallet.svc.receiving_offline": "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਲੈ ਰਹੇ ਹਾਂ",
  "wallet.svc.amount_positive": "ਸਿਫ਼ਰ ਤੋਂ ਵੱਧ ਰਕਮ ਭਰੋ।",
  "wallet.svc.coins_raced": "ਉਹ ਸਿੱਕੇ ਹੁਣੇ ਕਿਸੇ ਹੋਰ ਭੁਗਤਾਨ ਨੇ ਵਰਤ ਲਏ।",
  "wallet.svc.coins_raced_body":
    "ਕੁਝ ਵੀ ਨਹੀਂ ਕੱਟਿਆ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਅਤੇ ਵਾਲਿਟ ਕੋਈ ਵੱਖਰਾ ਸੈੱਟ ਚੁਣ ਲਵੇਗਾ।",
  "wallet.svc.no_ecash": "ਹਾਲੇ ਕੋਈ ecash ਨਹੀਂ।",
  "wallet.svc.no_ecash_body":
    "ਮਿੰਟ ਜੋੜੋ ਅਤੇ Lightning ’ਤੇ ਜਮ੍ਹਾਂ ਕਰੋ, ਜਾਂ ਕਿਸੇ ਤੋਂ ਟੋਕਨ ਲਵੋ।",
  "wallet.svc.split_across_mints": "ਤੁਹਾਡਾ ਬੈਲੰਸ ਕਈ ਮਿੰਟਾਂ ਵਿੱਚ ਵੰਡਿਆ ਹੋਇਆ ਹੈ।",
  "wallet.svc.mint_says_spent": "ਮਿੰਟ ਨੇ ਇਹ ਪਰੂਫ਼ ਪਹਿਲਾਂ ਹੀ ਖ਼ਰਚੇ ਹੋਏ ਦੱਸੇ।",
  "wallet.svc.issue_against_invoice":
    "Lightning ਇਨਵੌਇਸ ਦੇ ਬਦਲੇ ecash ਜਾਰੀ ਕਰਨਾ",
  "wallet.svc.pay_invoice": "Lightning ਇਨਵੌਇਸ ਭਰਨਾ",
  "wallet.svc.unknown_deposit": "ਅਣਜਾਣ ਜਮ੍ਹਾਂ।",
  "wallet.svc.invoice_expired_before":
    "ਇਨਵੌਇਸ ਭਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਬੇਮਿਆਦ ਹੋ ਗਿਆ।",
  "wallet.svc.invoice_expired": "ਉਹ ਇਨਵੌਇਸ ਬੇਮਿਆਦ ਹੋ ਗਿਆ।",
  "wallet.svc.invoice_unpaid": "ਇਨਵੌਇਸ ਹਾਲੇ ਭਰਿਆ ਨਹੀਂ ਗਿਆ।",
  "wallet.svc.payment_unknown":
    "ਭੁਗਤਾਨ ਦੀ ਹਾਲਤ ਅਣਜਾਣ; ਅਗਲੀ ਵਾਰ ਤਾਜ਼ਾ ਕਰਨ ’ਤੇ ਦੁਬਾਰਾ ਦੇਖ ਲਿਆ ਜਾਵੇਗਾ।",
  "wallet.svc.melt_change_pending": "ਤੁਹਾਡਾ ਇਨਵੌਇਸ ਭਰ ਦਿੱਤਾ ਗਿਆ।",
  "wallet.svc.melt_change_pending_body":
    "ਮਿੰਟ ਨੇ ਹਾਲੇ ਅਣਵਰਤੀ ਰਾਊਟਿੰਗ ਫ਼ੀਸ ਵਾਪਸ ਨਹੀਂ ਕੀਤੀ। ਅਗਲੀ ਵਾਰ ਤਾਜ਼ਾ ਕਰਨ ’ਤੇ ਇਹ ਆਪੇ ਲੈ ਲਈ ਜਾਂਦੀ ਹੈ, ਅਤੇ ਇਸ ਦੌਰਾਨ ਕੁਝ ਨਹੀਂ ਗੁਆਚਦਾ।",
  "wallet.svc.mint_did_not_pay":
    "ਮਿੰਟ ਨੇ ਇਹ ਇਨਵੌਇਸ ਨਹੀਂ ਭਰਿਆ। ਤੁਹਾਡਾ ਬੈਲੰਸ ਉਵੇਂ ਦਾ ਉਵੇਂ ਹੈ।",
  "wallet.svc.not_an_invoice": "ਇਹ Lightning ਇਨਵੌਇਸ ਨਹੀਂ ਹੈ।",
  "wallet.svc.not_an_invoice_body":
    "lnbc ਨਾਲ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲਾ bolt11 ਇਨਵੌਇਸ ਚਿਪਕਾਓ।",
  "wallet.svc.insufficient_for_invoice": "ਇਸ ਇਨਵੌਇਸ ਲਈ ਬੈਲੰਸ ਕਾਫ਼ੀ ਨਹੀਂ।",
  "wallet.svc.coins_raced_invoice_body":
    "ਕੁਝ ਵੀ ਨਹੀਂ ਕੱਟਿਆ ਗਿਆ ਅਤੇ ਇਨਵੌਇਸ ਨਹੀਂ ਭਰਿਆ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "wallet.svc.same_mint": "ਕੋਈ ਵੱਖਰਾ ਮੰਜ਼ਿਲ ਮਿੰਟ ਚੁਣੋ।",
  "wallet.svc.same_mint_body":
    "ਸਰੋਤ ਅਤੇ ਮੰਜ਼ਿਲ ਇੱਕੋ ਮਿੰਟ ਹਨ, ਇਸ ਲਈ ਹਿਲਾਉਣ ਲਈ ਕੁਝ ਨਹੀਂ ਹੈ।",
  "wallet.svc.quote_failed_retried": "ਹਵਾਲਾ ਅਸਫਲ, ਇਕੱਠਾ ਕਰਨ ਦੀ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼",
  "wallet.svc.amount_unfit_retried":
    "ਰਕਮ ਢੁਕਵੀਂ ਨਹੀਂ ਸੀ, ਇਕੱਠਾ ਕਰਨ ਦੀ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼",
  "wallet.svc.cannot_size": "ਇਸ ਤਬਾਦਲੇ ਦਾ ਆਕਾਰ ਤੈਅ ਨਹੀਂ ਹੋ ਸਕਿਆ।",
  "wallet.svc.insufficient_at_mint": "{mint} ’ਤੇ ਬੈਲੰਸ ਕਾਫ਼ੀ ਨਹੀਂ।",
  "wallet.svc.inexact_title":
    "ਤੁਹਾਡੇ ਪਰੂਫ਼ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਬਿਲਕੁਲ {amount} {unit} ਨਹੀਂ ਬਣਾ ਸਕਦੇ।",
  "wallet.svc.inexact_detail":
    "ਸਭ ਤੋਂ ਛੋਟਾ ਟੋਕਨ ਜੋ ਤੁਸੀਂ ਭੇਜ ਸਕਦੇ ਹੋ ਉਹ {spend} {unit} ਹੈ। ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਕੋਈ ਬਾਕੀ ਨਹੀਂ ਮੁੜਦਾ, ਇਸ ਲਈ ਵਾਧੂ {extra} {unit} ਲੈਣ ਵਾਲੇ ਨੂੰ ਚਲੇ ਜਾਂਦੇ ਹਨ।",
  "wallet.svc.no_single_mint":
    "ਕਿਸੇ ਇੱਕ ਮਿੰਟ ਕੋਲ {amount} {unit} ਨਹੀਂ ਹਨ। ਵੱਖ-ਵੱਖ ਮਿੰਟਾਂ ਦਾ ecash ਇੱਕ ਟੋਕਨ ਵਿੱਚ ਨਹੀਂ ਜੋੜਿਆ ਜਾ ਸਕਦਾ: ਪਹਿਲਾਂ ਇੱਕ ਮਿੰਟ ’ਤੇ ਇਕੱਠਾ ਕਰੋ, ਜਾਂ ਵੱਖ-ਵੱਖ ਰਕਮਾਂ ਵਿੱਚ ਭੇਜੋ।",
  "wallet.svc.have_tried_send":
    "ਤੁਹਾਡੇ ਕੋਲ {total} {unit} ਹਨ, ਅਤੇ ਤੁਸੀਂ {amount} ਭੇਜਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ।",
  "wallet.svc.invoice_needs":
    "ਇਸ ਇਨਵੌਇਸ ਨੂੰ ਰਾਊਟਿੰਗ ਰਾਖਵੇਂ ਸਮੇਤ {total} {unit} ਚਾਹੀਦੇ ਹਨ, ਅਤੇ ਤੁਹਾਡੇ ਕੋਲ {balance} ਹਨ।",
  "wallet.svc.nothing_to_move": "{mint} ਕੋਲ ਹਿਲਾਉਣ ਲਈ ਕੋਈ {unit} ਨਹੀਂ ਹੈ।",
  "wallet.svc.consolidate_memo": "{mint} ਤੋਂ ਇਕੱਠਾ ਕਰਨਾ",
  "wallet.svc.cannot_size_detail":
    "Lightning ਰਾਊਟਿੰਗ ਫ਼ੀਸਾਂ ਤੋਂ ਬਾਅਦ, {from} {to} ’ਤੇ ਕੰਮ ਦੀ ਕੋਈ ਰਕਮ ਨਹੀਂ ਹਿਲਾ ਸਕਦਾ। ਇਸ ਦੀ ਥਾਂ ਕੋਈ ਖ਼ਾਸ ਛੋਟੀ ਰਕਮ ਹਿਲਾ ਕੇ ਦੇਖੋ।",
  "wallet.svc.mint_cannot": "{mint} {action} ਨਹੀਂ ਕਰ ਸਕਦਾ।",
  "wallet.svc.no_nut": "ਮਿੰਟ NUT-{nut} ਦਾ ਐਲਾਨ ਨਹੀਂ ਕਰਦਾ।",
  "wallet.svc.unknown_mint":
    "ਉਹ ਭੁਗਤਾਨ ਅਜਿਹੇ ਮਿੰਟ ਦਾ ਨਾਂ ਲੈਂਦਾ ਹੈ ਜੋ ਤੁਸੀਂ ਵਰਤਦੇ ਨਹੀਂ।",
  "wallet.svc.unknown_mint_body":
    "ਜੇ ਤੁਸੀਂ ਉਸ ’ਤੇ ਭਰੋਸਾ ਕਰਦੇ ਹੋ ਤਾਂ ਪਹਿਲਾਂ ਉਹ ਮਿੰਟ ਖ਼ੁਦ ਜੋੜੋ; ਜੋ ਮਿੰਟ ਤੁਸੀਂ ਨਹੀਂ ਚੁਣਿਆ, ਉਸ ਤੋਂ ਕੁਝ ਨਹੀਂ ਭੁਨਾਇਆ ਜਾਂਦਾ।",
  "wallet.svc.no_relay": "ਕੋਈ ਰਿਲੇ ਕਨੈਕਸ਼ਨ ਨਹੀਂ",
  "wallet.svc.no_shared_mint": "ਕਾਫ਼ੀ ਬੈਲੰਸ ਵਾਲਾ ਕੋਈ ਸਾਂਝਾ ਮਿੰਟ ਨਹੀਂ",
  "wallet.svc.no_nutzap_info":
    "ਲੈਣ ਵਾਲੇ ਨੇ nutzap ਜਾਣਕਾਰੀ ਨਹੀਂ ਛਾਪੀ (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਨਾਲ ਲਾਕ ਪਰ ਹਾਲੇ ਪਹੁੰਚਿਆ ਨਹੀਂ। ਇਸ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਇਸ ਲੈਣ-ਦੇਣ ਵਿੱਚੋਂ ਟੋਕਨ ਸਾਂਝਾ ਕਰੋ।",
  "wallet.svc.swap_lost":
    "ਮਿੰਟ ਨੇ ਇਹ ਅਦਲਾ-ਬਦਲੀ ਕਦੇ ਪੂਰੀ ਨਹੀਂ ਕੀਤੀ, ਇਸ ਲਈ ਇਸ ਦੇ ਬਦਲੇ ਕੁਝ ਜਾਰੀ ਨਹੀਂ ਹੋਇਆ।",
  "wallet.svc.swap_unreadable":
    "ਇਹ ਅਦਲਾ-ਬਦਲੀ ਅਜਿਹੇ ਰੂਪ ਵਿੱਚ ਸੰਭਾਲੀ ਗਈ ਸੀ ਜੋ ਇਹ ਸੰਸਕਰਣ ਦੁਬਾਰਾ ਨਹੀਂ ਚਲਾ ਸਕਦਾ।",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR ਰਾਹੀਂ ਪੁਸ਼ਟੀਸ਼ੁਦਾ",
  "contacts.qr.keys_unverified": "ਕੁੰਜੀਆਂ ਮਿਲੀਆਂ, ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ",
  "contacts.qr.not_verified": "ਹਾਲੇ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ",
  "contacts.qr.message": "ਸੁਨੇਹਾ",
  "contacts.qr.add": "ਸੰਪਰਕ ਜੋੜੋ",
  "contacts.qr.scan_title": "QR ਕੋਡ ਸਕੈਨ ਕਰੋ",
  "contacts.qr.aim": "ਆਪਣਾ ਕੈਮਰਾ ਉਹਨਾਂ ਦੇ QR ਕੋਡ ਵੱਲ ਸੇਧੋ",
  "contacts.qr.add_desc": "ਉਸ ਤੱਕ ਪਹੁੰਚੋ ਜੋ ਮੈਸ਼ ’ਤੇ ਨੇੜੇ ਨਹੀਂ ਹੈ।",
  "contacts.qr.peer_id_hint":
    "ਪੀਅਰ ID 16 ਅੱਖਰਾਂ ਦੀ ਹੁੰਦੀ ਹੈ। ਸੰਪਰਕ ਕੋਡ airhop: ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।",
  "contacts.qr.or_scan": "ਜਾਂ ਉਹਨਾਂ ਦਾ QR ਸਕੈਨ ਕਰੋ",
  "contacts.qr.trust_note":
    "ਸਿਰਫ਼ ਉਹੀ QR ਉਹਨਾਂ ਦੀ ਕੁੰਜੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਜੋ ਤੁਸੀਂ ਆਪਣੇ ਕੈਮਰੇ ਨਾਲ ਸਕੈਨ ਕਰਦੇ ਹੋ। ਚਿਪਕਾਇਆ ਕੋਡ ਉਹਨਾਂ ਦੀਆਂ ਕੁੰਜੀਆਂ ਤਾਂ ਲੈ ਕੇ ਆਉਂਦਾ ਹੈ ਪਰ ਇਹ ਸਬੂਤ ਨਹੀਂ ਕਿ ਉਹ ਉਹਨਾਂ ਵੱਲੋਂ ਹੀ ਆਇਆ ਹੈ।",
  "contacts.qr.peer_id": "ਪੀਅਰ ID ਜਾਂ ਸੰਪਰਕ ਕੋਡ",
  "contacts.qr.peer_id_placeholder": "ID ਜਾਂ ਸੰਪਰਕ ਕੋਡ ਚਿਪਕਾਓ",
  "contacts.qr.scan_camera_a11y": "ਕੈਮਰੇ ਨਾਲ QR ਕੋਡ ਸਕੈਨ ਕਰੋ",
  "contacts.qr.scan_camera_desc": "ਆਪਣਾ ਕੈਮਰਾ ਵਰਤੋ",
  "contacts.qr.upload_a11y": "ਗੈਲਰੀ ਵਿੱਚੋਂ QR ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ",
  "contacts.qr.upload": "ਗੈਲਰੀ ਵਿੱਚੋਂ ਅੱਪਲੋਡ ਕਰੋ",
  "contacts.qr.upload_desc": "ਕੋਈ ਸੰਭਾਲੀ QR ਤਸਵੀਰ ਚੁਣੋ",
  "contacts.qr.scan_a11y": "QR ਕੋਡ ਸਕੈਨ ਕਰ ਕੇ ਸੰਪਰਕ ਜੋੜੋ",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16 ਅੱਖਰਾਂ ਦੀ ਪੀਅਰ ID, airhop://peer/… ਲਿੰਕ, ਜਾਂ ਸੰਪਰਕ ਕੋਡ ਚਿਪਕਾਓ।",
  "contacts.scan.camera_label": "ਕੈਮਰੇ ਦੀ ਪਹੁੰਚ",
  "contacts.scan.camera_purpose": "ਕਿਸੇ ਸੰਪਰਕ ਦਾ QR ਕੋਡ ਸਕੈਨ ਕਰਨ",
  "contacts.scan.camera_needed":
    "ਸਕੈਨ ਕਰਨ ਲਈ ਕੈਮਰੇ ਦੀ ਪਹੁੰਚ ਚਾਹੀਦੀ ਹੈ। ਤੁਸੀਂ ਫਿਰ ਵੀ ਪੀਅਰ ID ਨਾਲ ਜੋੜ ਸਕਦੇ ਹੋ।",
  "contacts.scan.camera_failed":
    "ਕੈਮਰਾ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਹੋਰ ਕੈਮਰਾ ਐਪਾਂ ਬੰਦ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "contacts.scan.photo_label": "ਫ਼ੋਟੋ ਦੀ ਪਹੁੰਚ",
  "contacts.scan.photo_purpose": "ਤੁਹਾਡਾ ਸੰਭਾਲਿਆ QR ਕੋਡ ਸਕੈਨ ਕਰਨ",
  "contacts.scan.photo_needed":
    "ਤਸਵੀਰ ਚੁਣਨ ਲਈ ਫ਼ੋਟੋ ਦੀ ਪਹੁੰਚ ਚਾਹੀਦੀ ਹੈ। ਤੁਸੀਂ ਫਿਰ ਵੀ ਪੀਅਰ ID ਨਾਲ ਜੋੜ ਸਕਦੇ ਹੋ।",
  "contacts.scan.no_qr": "ਉਸ ਤਸਵੀਰ ਵਿੱਚ ਕੋਈ Airhop QR ਕੋਡ ਨਹੀਂ ਮਿਲਿਆ।",
  "contacts.scan.unreadable": "ਉਸ ਤਸਵੀਰ ਵਿੱਚੋਂ QR ਕੋਡ ਪੜ੍ਹਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।",
  "contacts.scan.bitchat_expired":
    "ਉਹ bitchat ਕੋਡ ਬੇਮਿਆਦ ਹੋ ਚੁੱਕਾ ਹੈ। ਉਹਨਾਂ ਨੂੰ ਆਪਣਾ QR ਦੁਬਾਰਾ ਖੋਲ੍ਹਣ ਲਈ ਕਹੋ।",
  "contacts.scan.tampered":
    "ਇਹ QR ਕੋਡ ਅਵੈਧ ਹੈ: ਇਸ ਦੀ ਪੀਅਰ ID ਇਸ ਦੀਆਂ ਕੁੰਜੀਆਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ। ਹੋ ਸਕਦਾ ਹੈ ਇਸ ਨਾਲ ਛੇੜਛਾੜ ਹੋਈ ਹੋਵੇ।",
  "contacts.scan.already_added": "ਪਹਿਲਾਂ ਹੀ ਤੁਹਾਡੇ ਸੰਪਰਕਾਂ ਵਿੱਚ",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "ਕੈਮਰੇ ਦੀ ਪਹੁੰਚ ਦੀ ਉਡੀਕ…",
  "contacts.verify.camera_off": "ਕੈਮਰਾ ਬੰਦ ਹੈ",
  "contacts.verify.open_settings": "ਸੈਟਿੰਗਾਂ ਖੋਲ੍ਹੋ",
  "contacts.verify.verified": "ਪੁਸ਼ਟੀਸ਼ੁਦਾ",
  "contacts.verify.different": "ਵੱਖਰਾ ਸੰਪਰਕ",
  "contacts.verify.scan_again": "ਦੁਬਾਰਾ ਸਕੈਨ ਕਰੋ",
  "contacts.verify.failed": "ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋ ਸਕੀ",
  "contacts.verify.done": "ਹੋ ਗਿਆ",
  "contacts.verify.title": "{name} ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
  "contacts.verify.aim": "ਆਪਣਾ ਕੈਮਰਾ ਉਹਨਾਂ ਦੇ QR ਕੋਡ ਵੱਲ ਸੇਧੋ",
  "contacts.verify.camera_off_body":
    "QR ਨਾਲ ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਸੈਟਿੰਗਾਂ ਵਿੱਚੋਂ ਕੈਮਰੇ ਦੀ ਪਹੁੰਚ ਚਾਲੂ ਕਰੋ।",
  "contacts.verify.match_body":
    "{name} ਦੀ ਕੁੰਜੀ ਮੇਲ ਖਾਂਦੀ ਹੈ। ਤੁਸੀਂ ਇਸ ਸੰਪਰਕ ’ਤੇ ਭਰੋਸਾ ਕਰ ਸਕਦੇ ਹੋ।",
  "contacts.verify.different_body":
    "ਇਹ QR ਕਿਸੇ ਹੋਰ ਦਾ ਹੈ। {name} ਨੂੰ ਆਪਣਾ ਕੋਡ ਦਿਖਾਉਣ ਲਈ ਕਹੋ।",
  "contacts.verify.tampered_body":
    "ਇਹ QR ਛੇੜਿਆ ਹੋਇਆ ਲੱਗਦਾ ਹੈ: ਇਸ ਦੀ ID ਇਸ ਦੀ ਕੁੰਜੀ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।",
  "contacts.verify.choose_title": "ਤੁਸੀਂ ਕਿਵੇਂ ਜਾਂਚਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
  "contacts.verify.choose_body":
    "ਦੋਵੇਂ ਇਹ ਪੱਕਾ ਕਰਦੇ ਹਨ ਕਿ ਇਸ ਫ਼ੋਨ ’ਤੇ ਪਈਆਂ ਕੁੰਜੀਆਂ ਸੱਚਮੁੱਚ {name} ਦੀਆਂ ਹੀ ਹਨ।",
  "contacts.verify.method_scan": "ਉਹਨਾਂ ਦਾ ਕੋਡ ਸਕੈਨ ਕਰੋ",
  "contacts.verify.method_scan_sub": "ਉਹ ਤੁਹਾਡੇ ਨਾਲ ਇੱਥੇ ਹੀ ਹਨ",
  "contacts.verify.method_compare": "ਕੋਡ ਮਿਲਾਓ",
  "contacts.verify.method_compare_sub": "ਕਾਲ ’ਤੇ ਇੱਕ ਦੂਜੇ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸੁਣਾਓ",
  "contacts.verify.no_keys":
    "ਇਸ ਸੰਪਰਕ ਲਈ ਹਾਲੇ ਕੋਈ ਕੁੰਜੀ ਨਹੀਂ ਹੈ। ਉਹਨਾਂ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ, ਜਾਂ ਮਿਲਣ ’ਤੇ ਉਹਨਾਂ ਦਾ ਕੋਡ ਸਕੈਨ ਕਰੋ।",
  "contacts.verify.compare_title": "ਇਹ ਇੱਕ ਦੂਜੇ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸੁਣਾਓ",
  "contacts.verify.compare_body":
    "{name} ਨੂੰ ਇਹੀ ਛੇ ਸ਼ਬਦ ਦਿਸਦੇ ਹਨ। ਜੇ ਇਹ ਮੇਲ ਖਾਂਦੇ ਹਨ ਤਾਂ ਤੁਹਾਨੂੰ ਦੋਵਾਂ ਨੂੰ ਪਤਾ ਹੈ ਕਿ ਕੁੰਜੀਆਂ ਅਸਲੀ ਹਨ।",
  "contacts.verify.codes_match": "ਇਹ ਮੇਲ ਖਾਂਦੇ ਹਨ",
  "contacts.verify.codes_differ": "ਇਹ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ",
  "contacts.verify.compared_body":
    "ਤੁਸੀਂ ਅਤੇ {name} ਨੇ ਇੱਕੋ ਕੋਡ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ। ਇਹ ਸੰਪਰਕ ਪੁਸ਼ਟੀਸ਼ੁਦਾ ਹੈ।",

  // ---- Settings: shared chrome ----
  "settings.back": "ਵਾਪਸ ਜਾਓ",
  "settings.coming_soon": "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
  "settings.opens_externally": "{label}, ਐਪ ਤੋਂ ਬਾਹਰ ਖੁੱਲ੍ਹਦਾ ਹੈ",
  "settings.peer_id": "ਪੀਅਰ ID",
  "settings.share_peer_id": "ਆਪਣੀ ਪੀਅਰ ID ਸਾਂਝੀ ਕਰੋ",
  "settings.share_id_short": "ID ਸਾਂਝੀ ਕਰੋ",
  "settings.peer_id_sheet.title": "ਤੁਹਾਡੀ ਪੀਅਰ ID",
  "settings.peer_id_sheet.copy": "ਪੀਅਰ ID ਨਕਲ ਕਰੋ",
  "settings.peer_id_sheet.note":
    "ਇਹ ਉਦੋਂ ਹੀ ਕੰਮ ਕਰਦੀ ਹੈ ਜਦੋਂ ਤੁਸੀਂ ਦੋਵੇਂ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਹੋਵੋ। ਕਿਸੇ ਨੂੰ ਕਿਤੋਂ ਵੀ ਸੁਨੇਹਾ ਭੇਜਣ ਦੇਣ ਲਈ ਇਸ ਦੀ ਥਾਂ ਆਪਣਾ QR ਕੋਡ ਸਾਂਝਾ ਕਰੋ।",
  "settings.search.placeholder": "ਸੈਟਿੰਗਾਂ ਖੋਜੋ…",
  "settings.search.a11y": "ਸੈਟਿੰਗਾਂ ਖੋਜੋ",
  "settings.search.close": "ਖੋਜ ਬੰਦ ਕਰੋ",
  "settings.search.clear": "ਖੋਜ ਸਾਫ਼ ਕਰੋ",
  "settings.search.hint": "ਕੋਈ ਵੀ ਸੈਟਿੰਗ ਨਾਂ ਤੋਂ ਲੱਭੋ, ਉਹ ਕਿਤੇ ਵੀ ਹੋਵੇ।",
  "settings.search.no_results": "“{query}” ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਕੋਈ ਸੈਟਿੰਗ ਨਹੀਂ",

  // ---- Settings: hub rows ----
  "settings.section.general": "ਆਮ",
  "settings.section.general_desc":
    "ਵਿਕਲਪਿਕ ਸਹੂਲਤਾਂ, ਭੇਜਣਾ ਵਾਪਸ ਲੈਣਾ, ਮੀਡੀਆ, ਮੁੜ-ਸੈੱਟ",
  "settings.section.privacy": "ਨਿੱਜਤਾ ਅਤੇ ਸੁਰੱਖਿਆ",
  "settings.section.privacy_desc":
    "ਫ਼ਾਰਵਰਡ ਸੀਕ੍ਰੇਸੀ, ਦਸਤਖ਼ਤੀ ਪੈਕਟ, ਬਲਾਕ ਕੀਤੇ ਪੀਅਰ",
  "settings.section.network": "ਨੈੱਟਵਰਕ ਅਤੇ ਰਿਲੇ",
  "settings.section.network_desc":
    "ਇੰਟਰਨੈੱਟ ਸਹਾਰਾ, nostr ਰਿਲੇ, bitchat ਅਨੁਕੂਲਤਾ",
  "settings.section.permissions": "ਇਜਾਜ਼ਤਾਂ",
  "settings.section.permissions_desc": "ਬਲੂਟੁੱਥ, ਟਿਕਾਣਾ, ਸੂਚਨਾਵਾਂ, ਕੈਮਰਾ, ਮਾਈਕ",
  "settings.section.storage": "ਭੰਡਾਰ ਅਤੇ ਡਾਟਾ",
  "settings.section.diagnostics": "ਜਾਂਚ-ਪੜਤਾਲ",

  // ---- Settings: group headings ----
  "settings.group.transports": "ਟ੍ਰਾਂਸਪੋਰਟ",
  "settings.group.internet": "ਇੰਟਰਨੈੱਟ",
  "settings.group.nearby": "ਨੇੜੇ",
  "settings.group.sync": "ਸਿੰਕ",
  "settings.group.features": "ਸਹੂਲਤਾਂ",
  "settings.group.messages": "ਸੁਨੇਹੇ",
  "settings.group.local": "ਸਥਾਨਕ",
  "settings.group.media": "ਮੀਡੀਆ",
  "settings.group.reset": "ਮੁੜ-ਸੈੱਟ",
  "settings.group.always_on": "ਹਮੇਸ਼ਾ ਚਾਲੂ",
  "settings.group.notifications": "ਸੂਚਨਾਵਾਂ",
  "settings.group.blocked": "ਬਲਾਕ ਕੀਤੇ",
  "settings.group.theme": "ਥੀਮ",
  "settings.group.font": "ਫ਼ੌਂਟ",
  "settings.group.language": "ਭਾਸ਼ਾ",
  "settings.section.diagnostics_desc": "ਕਨੈਕਸ਼ਨ ਦੀ ਹਾਲਤ ਅਤੇ ਨੇੜਲੇ ਡੀਵਾਈਸ",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "ਬਲੂਟੁੱਥ ਲਿੰਕ",
  "settings.diag.ble_links_desc":
    "ਉਹ ਡੀਵਾਈਸ ਜਿਨ੍ਹਾਂ ਨਾਲ ਇਹ ਫ਼ੋਨ ਸਿੱਧਾ ਜੁੜਿਆ ਹੋਇਆ ਹੈ",
  "settings.diag.lan": "ਸਥਾਨਕ ਨੈੱਟਵਰਕ",
  "settings.diag.lan_desc": "ਇੱਕੋ Wi-Fi ਨੈੱਟਵਰਕ ਵਾਲੇ ਫ਼ੋਨ",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "ਬਿਨਾਂ ਰਾਊਟਰ ਫ਼ੋਨ ਤੋਂ ਫ਼ੋਨ",
  "settings.diag.wifi_active": "ਚੱਲ ਰਿਹਾ ਹੈ",
  "settings.diag.wifi_unsupported": "ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਸਮਰਥਿਤ ਨਹੀਂ",
  "settings.diag.wifi_permission": "ਕਿਸੇ ਇਜਾਜ਼ਤ ਨੇ ਰੋਕਿਆ",
  "settings.diag.wifi_unavailable": "ਇਸ ਵੇਲੇ ਉਪਲਬਧ ਨਹੀਂ",
  "settings.diag.wifi_unpaired": "ਕੁਝ ਵੀ ਜੋੜਿਆ ਨਹੀਂ",
  "settings.diag.wifi_unknown": "ਰੇਡੀਓ ਦੀ ਉਡੀਕ",
  "settings.diag.relays": "Nostr ਰਿਲੇ",
  "settings.diag.relays_desc":
    "ਟਿਕਾਣਾ ਚੈਨਲਾਂ ਅਤੇ ਇੰਟਰਨੈੱਟ ਪਹੁੰਚ ਲਈ ਵਰਤੇ ਜਾਂਦੇ ਹਨ",
  "settings.diag.connected": "ਜੁੜਿਆ",
  "settings.diag.disconnected": "ਜੁੜਿਆ ਨਹੀਂ",
  "settings.diag.peer_direct": "ਸਿੱਧਾ ਲਿੰਕ",
  "settings.diag.peer_relayed": "ਕਿਸੇ ਹੋਰ ਡੀਵਾਈਸ ਰਾਹੀਂ ਸੁਣਿਆ",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "ਸਿਗਨਲ ਦਾ ਕੋਈ ਪਾਠ ਨਹੀਂ",
  "settings.diag.no_peers": "ਪਹੁੰਚ ਵਿੱਚ ਕੋਈ ਨਹੀਂ",
  "settings.diag.no_peers_desc": "{links} ਰੇਡੀਓ ਲਿੰਕ ਖੁੱਲ੍ਹੇ",
  "settings.diag.gcs_size": "ਛਾਣਨੀ ਦਾ ਆਕਾਰ",
  "settings.diag.gcs_size_desc": "ਹਵਾ ’ਤੇ ਪਾਈ ਗਈ ਸਭ ਤੋਂ ਵੱਡੀ ਸਿੰਕ ਛਾਣਨੀ",
  "settings.diag.fpr": "ਝੂਠੇ ਹਾਂ-ਪੱਖੀ ਦੀ ਦਰ",
  "settings.diag.fpr_desc":
    "ਛਾਣਨੀ ਕਿੰਨੀ ਵਾਰ ਸਾਡੇ ਕੋਲ ਨਾ ਹੋਏ ਪੈਕਟ ਦਾ ਦਾਅਵਾ ਕਰਦੀ ਹੈ",
  "settings.diag.bytes": "{n} ਬਾਈਟ",
  "settings.diag.footnote":
    "ਇੱਥੇ ਕੁਝ ਵੀ ਬਦਲਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ। ਇਹ ਮੁੱਲ ਪੱਕੇ ਹਨ ਤਾਂ ਜੋ Airhop bitchat ਨਾਲ ਅਨੁਕੂਲ ਰਹੇ।",
  "settings.section.storage_desc": "ਵਰਤੋਂ ਅਤੇ ਕੈਸ਼",
  "settings.section.appearance": "ਦਿੱਖ",
  "settings.section.appearance_desc": "ਥੀਮ, ਫ਼ੌਂਟ ਅਤੇ ਭਾਸ਼ਾ",
  "settings.section.help": "ਮਦਦ ਅਤੇ ਸੁਝਾਅ",
  "settings.section.help_desc":
    "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ, ਕੋਈ ਖ਼ਰਾਬੀ ਦੱਸੋ, ਜਾਂ ਅਕਸਰ ਪੁੱਛੇ ਸਵਾਲ ਪੜ੍ਹੋ",
  "settings.section.support": "ਸਹਾਰਾ",
  "settings.section.support_desc": "ਵਿਕਾਸ ਚੱਲਦਾ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰੋ",
  "settings.section.about": "ਬਾਰੇ",
  "settings.section.about_desc": "ਸੰਸਕਰਣ, ਤਬਦੀਲੀਆਂ ਅਤੇ ਸਰੋਤ",

  // ---- Settings: general ----
  "settings.general.undo": "ਭੇਜਣਾ ਵਾਪਸ ਲਵੋ",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "ਵਾਲਿਟ",
  "settings.general.undo_seconds": "{count} ਸਕਿੰਟ",
  "settings.general.undo_a11y": "ਭੇਜਣਾ ਵਾਪਸ ਲਵੋ: {value}",
  "settings.general.quality_a11y": "ਅੱਪਲੋਡ ਗੁਣਵੱਤਾ {value} ਸੈੱਟ ਕਰੋ",
  "settings.general.undo_desc":
    "ਭੇਜੇ ਸੁਨੇਹੇ ਨੂੰ ਥੋੜ੍ਹਾ ਰੋਕ ਕੇ ਰੱਖਦਾ ਹੈ ਤਾਂ ਜੋ ਬਾਹਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਤੁਸੀਂ ਉਸ ਨੂੰ ਵਾਪਸ ਲੈ ਸਕੋ",
  "settings.general.undo_off_desc": "ਤੁਰੰਤ ਭੇਜੋ, ਵਾਪਸ ਲੈਣਾ ਨਹੀਂ",
  "settings.general.undo_2": "2 ਸਕਿੰਟ",
  "settings.general.undo_2_desc": "ਵਾਪਸ ਲੈਣ ਦਾ ਛੇਤੀ ਮੌਕਾ",
  "settings.general.undo_10": "10 ਸਕਿੰਟ",
  "settings.general.undo_10_desc": "ਸਭ ਤੋਂ ਲੰਮਾ ਵਕਫ਼ਾ",
  "settings.general.quality": "ਅੱਪਲੋਡ ਗੁਣਵੱਤਾ",
  "settings.general.quality_desc":
    "ਤੁਹਾਡੇ ਕੈਮਰੇ ਜਾਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚੋਂ ਭੇਜੀਆਂ ਫ਼ੋਟੋਆਂ ’ਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ। ਹਰ ਫ਼ੋਟੋ ਦੋਵੇਂ ਹਾਲਤਾਂ ਵਿੱਚ ਮੈਸ਼ ਦੇ ਮੇਚ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
  "settings.general.quality_low": "ਘੱਟ",
  "settings.general.quality_low_desc":
    "ਸਭ ਤੋਂ ਛੋਟੀਆਂ ਫ਼ੋਟੋਆਂ, ਸਭ ਤੋਂ ਛੇਤੀ ਭੇਜੀਆਂ ਜਾਣ ਵਾਲੀਆਂ",
  "settings.general.quality_medium": "ਦਰਮਿਆਨੀ",
  "settings.general.quality_medium_desc": "ਵੇਰਵੇ ਅਤੇ ਰਫ਼ਤਾਰ ਦਾ ਸੰਤੁਲਨ",
  "settings.general.quality_high": "ਵੱਧ",
  "settings.general.quality_high_desc": "ਸਭ ਤੋਂ ਵੱਧ ਵੇਰਵਾ ਰੱਖਦੀ ਹੈ",
  "settings.general.feature_wallet_desc":
    "ਮੈਸ਼ ’ਤੇ ਪੀਅਰ ਤੋਂ ਪੀਅਰ Cashu ecash ਭੇਜੋ",
  "settings.general.feature_wallet_a11y": "ਵਾਲਿਟ (ਹਮੇਸ਼ਾ ਚਾਲੂ)",
  "settings.general.feature_ai_desc":
    "ਡੀਵਾਈਸ ’ਤੇ ਹੀ ਚੱਲਦਾ ਨਿੱਜੀ ਸਹਾਇਕ, ਕੋਈ ਨੈੱਟਵਰਕ ਕਾਲ ਨਹੀਂ",
  "settings.general.feature_feeds": "ਫ਼ੀਡ",
  "settings.general.feature_feeds_desc":
    "Bluesky ਅਤੇ Mastodon ਫ਼ੀਡ ਪੜ੍ਹੋ ਅਤੇ ਉਹਨਾਂ ’ਤੇ ਲਿਖੋ",
  "settings.general.show_media": "ਮੀਡੀਆ ਆਪੇ ਦਿਖਾਓ",
  "settings.general.show_media_desc":
    "ਫ਼ੋਟੋਆਂ ਅਤੇ ਵੀਡੀਓ ਗੱਲਬਾਤ ਵਿੱਚ ਦਿਸਦੇ ਹਨ, ਜਾਂ ਇੱਕ ਦਬਾਅ ਪਿੱਛੇ ਰਹਿੰਦੇ ਹਨ",
  "settings.general.reset": "ਸੈਟਿੰਗਾਂ ਮੁੜ-ਸੈੱਟ ਕਰੋ",
  "settings.general.media_retention": "ਮੀਡੀਆ ਇੰਨਾ ਚਿਰ ਰੱਖੋ",
  "settings.general.media_retention_desc":
    "ਚੁਣੇ ਸਮੇਂ ਤੋਂ ਬਾਅਦ ਫ਼ੋਟੋਆਂ, ਵੀਡੀਓ ਅਤੇ ਵੌਇਸ ਨੋਟ ਮਿਟਾ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ",
  "settings.general.media_retention_sheet":
    "ਚੁਣੋ ਕਿ ਮੀਡੀਆ ਇਸ ਡੀਵਾਈਸ ’ਤੇ ਕਿੰਨਾ ਚਿਰ ਰਹੇ। ਮਿਟਾਇਆ ਮੀਡੀਆ ਵਾਪਸ ਨਹੀਂ ਆ ਸਕਦਾ।",
  "settings.general.retention_7_desc":
    "ਸਭ ਤੋਂ ਘੱਟ ਪਿੱਛੇ ਰਹਿੰਦਾ ਹੈ। ਸਭ ਤੋਂ ਵਧੀਆ ਜੇ ਖ਼ਤਰਾ ਫ਼ੋਨ ਆਪ ਹੀ ਹੋਵੇ।",
  "settings.general.retention_14_desc":
    "ਸਿਗਨਲ ਤੋਂ ਹਫ਼ਤਾ-ਦੋ ਹਫ਼ਤੇ ਦੂਰ ਰਹਿਣ ਲਈ ਵਿਚਲਾ ਰਾਹ।",
  "settings.general.retention_30_desc":
    "ਗੱਲਬਾਤਾਂ ਸਭ ਤੋਂ ਲੰਮਾ ਸਮਾਂ ਪੜ੍ਹਨਯੋਗ ਰੱਖਦਾ ਹੈ, ਅਤੇ ਡਿਸਕ ’ਤੇ ਸਭ ਤੋਂ ਵੱਧ ਰੱਖਦਾ ਹੈ।",
  "settings.general.reset_desc":
    "ਹਰ ਤਰਜੀਹ ਨੂੰ ਉਸ ਦੇ ਮੂਲ ’ਤੇ ਵਾਪਸ ਲੈ ਜਾਂਦਾ ਹੈ, ਤੁਹਾਡੀ ਪਛਾਣ, ਸੁਨੇਹੇ, ਸੰਪਰਕ ਅਤੇ ਵਾਲਿਟ ਉਵੇਂ ਦੇ ਉਵੇਂ ਛੱਡ ਕੇ",
  "settings.general.reset_title": "ਸੈਟਿੰਗਾਂ ਮੁੜ-ਸੈੱਟ ਕਰਨੀਆਂ ਹਨ?",
  "settings.general.reset_body":
    "ਹਰ ਤਰਜੀਹ ਆਪਣੇ ਮੂਲ ’ਤੇ ਵਾਪਸ ਚਲੀ ਜਾਂਦੀ ਹੈ: ਦਿੱਖ, ਭੇਜਣਾ ਵਾਪਸ ਲੈਣਾ, ਅਤੇ ਜੁੜਾਅ (ਇੰਟਰਨੈੱਟ, Tor, ਗੇਟਵੇ, ਪੁਲ, ਰਿਲੇ)। ਤੁਹਾਡੀ ਪਛਾਣ, ਸੁਨੇਹੇ, ਸੰਪਰਕ ਅਤੇ ਵਾਲਿਟ ਉਵੇਂ ਦੇ ਉਵੇਂ ਹਨ।",
  "settings.general.reset_confirm": "ਮੁੜ-ਸੈੱਟ ਕਰੋ",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "ਫ਼ਾਰਵਰਡ ਸੀਕ੍ਰੇਸੀ",
  "settings.security.forward_secrecy_desc":
    "DM ਲਈ Double Ratchet ਹਮੇਸ਼ਾ ਚਾਲੂ ਰਹਿੰਦਾ ਹੈ",
  "settings.security.signed_packets": "ਦਸਤਖ਼ਤੀ ਪੈਕਟ",
  "settings.security.signed_packets_desc":
    "ਹਰ ਪੈਕਟ Ed25519 ਨਾਲ ਦਸਤਖ਼ਤੀ ਹੁੰਦਾ ਹੈ",
  "settings.security.hide_previews": "ਸੂਚਨਾ ਦੀਆਂ ਝਲਕਾਂ ਲੁਕਾਓ",
  "settings.security.hide_previews_desc":
    "ਭੇਜਣ ਵਾਲੇ ਅਤੇ ਸੁਨੇਹੇ ਨੂੰ ਤੁਹਾਡੀ ਲਾਕ ਸਕ੍ਰੀਨ ਤੋਂ ਬਾਹਰ ਰੱਖਦਾ ਹੈ, ਜੋ ਇਹ ਬਿਨਾਂ ਅਨਲਾਕ ਕੀਤੇ ਦਿਖਾ ਦਿੰਦੀ ਹੈ",
  "settings.security.no_blocked": "ਕੋਈ ਬਲਾਕ ਕੀਤਾ ਪੀਅਰ ਨਹੀਂ",
  "settings.security.no_blocked_desc":
    "ਬਲਾਕ ਕੀਤੇ ਪੀਅਰ ਤੁਹਾਨੂੰ ਸੁਨੇਹਾ ਨਹੀਂ ਭੇਜ ਸਕਦੇ ਅਤੇ ਨਾ ਹੀ ਮੈਸ਼ ਟੈਬ ’ਤੇ ਦਿਸਦੇ ਹਨ",
  "settings.security.unblock_title": "ਇਸ ਪੀਅਰ ਤੋਂ ਬਲਾਕ ਹਟਾਓ",
  "settings.security.unblock": "ਬਲਾਕ ਹਟਾਓ",
  "settings.security.unblock_peer": "{name} ਤੋਂ ਬਲਾਕ ਹਟਾਓ",
  "settings.security.unblock_body":
    "{name} ਤੁਹਾਨੂੰ ਦੁਬਾਰਾ ਸੁਨੇਹਾ ਭੇਜ ਸਕਣਗੇ ਅਤੇ ਨੇੜੇ ਹੋਣ ’ਤੇ ਮੈਸ਼ ਟੈਬ ’ਤੇ ਫਿਰ ਦਿਸਣਗੇ।",

  // ---- Settings: network and relays ----
  "settings.network.internet": "ਇੰਟਰਨੈੱਟ ਸਹਾਰਾ",
  "settings.network.internet_desc":
    "ਜਦੋਂ ਮੈਸ਼ ਪੀਅਰ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਹੋਣ ਤਾਂ Nostr ਰਿਲੇ ’ਤੇ ਜਾਰੀ ਰੱਖੋ",
  "settings.network.internet_off_title": "ਇੰਟਰਨੈੱਟ ਬੰਦ ਕਰਨਾ ਹੈ?",
  "settings.network.internet_off_body":
    "Airhop ਸਿਰਫ਼ ਬਲੂਟੁੱਥ ’ਤੇ ਚੱਲੇਗਾ। ਇਹ ਕਿਸੇ ਵੀ Nostr ਰਿਲੇ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਬੰਦ ਕਰ ਦਿੰਦਾ ਹੈ, ਅਤੇ Tor, ਇੰਟਰਨੈੱਟ ਗੇਟਵੇ ਤੇ ਮੈਸ਼ ਪੁਲ ਸਭ ਬੰਦ ਹੋ ਜਾਂਦੇ ਹਨ। ਨੇੜੇ ਦੀ ਬਲੂਟੁੱਥ ਗੱਲਬਾਤ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ।",
  "settings.network.turn_off": "ਬੰਦ ਕਰੋ",
  "settings.network.discovery": "ਭੂ-ਰਿਲੇ ਖੋਜ",
  "settings.network.discovery_desc":
    "300+ ਵੰਡੇ ਹੋਏ ਰਿਲੇਆਂ ਵਿੱਚੋਂ ਕਿਸੇ ਟਿਕਾਣਾ ਸੈੱਲ ਲਈ ਸਭ ਤੋਂ ਨੇੜਲੇ ਰਿਲੇ ਆਪੇ ਚੁਣੋ",
  "settings.network.discovery_needs_relay": "ਪਹਿਲਾਂ ਆਪਣਾ ਰਿਲੇ ਜੋੜੋ",
  "settings.network.discovery_needs_relay_body":
    "ਆਪੇ-ਖੋਜ ਹੀ Airhop ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਰਿਲੇਆਂ ਵੱਲ ਸੇਧਦੀ ਹੈ। ਇਸ ਨੂੰ ਬੰਦ ਕਰਨ ਦਾ ਮਤਲਬ ਉਦੋਂ ਹੀ ਬਣਦਾ ਹੈ ਜਦੋਂ ਤੁਸੀਂ ਹੇਠਾਂ ਆਪਣੇ ਰਿਲੇ ਟਿਕਾ ਲਏ ਹੋਣ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਜੋੜੋ।",
  "settings.network.custom_only_title": "ਸਿਰਫ਼ ਆਪਣੇ ਰਿਲੇ ਵਰਤਣੇ ਹਨ?",
  "settings.network.custom_only_body":
    "ਟਿਕਾਣਾ ਚੈਨਲ ਅਤੇ ਮੈਸ਼ ਪੁਲ ਸਭ ਤੋਂ ਨੇੜਲੇ ਰਿਲੇ ਆਪੇ ਚੁਣਨੇ ਬੰਦ ਕਰ ਦੇਣਗੇ ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਵਰਤਣਗੇ ਜੋ ਤੁਸੀਂ ਜੋੜੇ ਹਨ। ਇਸ ਨਾਲ ਪਹੁੰਚ ਘਟ ਸਕਦੀ ਹੈ, ਅਤੇ ਤੁਹਾਨੂੰ bitchat ਵਰਤੋਂਕਾਰ ਮਿਲਣੇ ਬੰਦ ਹੋ ਸਕਦੇ ਹਨ, ਜੋ ਸਭ ਤੋਂ ਨੇੜਲੇ ਰਿਲੇਆਂ ’ਤੇ ਇਕੱਠੇ ਹੁੰਦੇ ਹਨ।",
  "settings.network.custom": "ਆਪਣੇ ਰਿਲੇ",
  "settings.network.custom_desc":
    "ਟਿਕਾਣਾ ਚੈਨਲਾਂ ਅਤੇ ਮੈਸ਼ ਪੁਲ ਲਈ ਆਪਣੇ ਰਿਲੇ ਜੋੜੋ",
  "settings.network.custom_added": "{max} ਵਿੱਚੋਂ {count} ਜੋੜੇ",
  "settings.network.dm_relays": "ਸੁਨੇਹਾ ਰਿਲੇ",
  "settings.network.dm_relays_desc":
    "ਸਿੱਧੇ ਸੁਨੇਹੇ ਅਤੇ ਨਿੱਜੀ ਚੈਨਲ ਹਮੇਸ਼ਾ ਇਹੀ ਵਰਤਦੇ ਹਨ। ਆਪਣੇ ਰਿਲੇ ਇਹਨਾਂ ਨੂੰ ਨਹੀਂ ਬਦਲਦੇ।",
  "settings.network.discovery_back_on": "ਭੂ-ਰਿਲੇ ਖੋਜ ਦੁਬਾਰਾ ਚਾਲੂ",
  "settings.network.discovery_back_on_body":
    "ਉਹ ਤੁਹਾਡਾ ਆਖ਼ਰੀ ਆਪਣਾ ਰਿਲੇ ਸੀ। ਟਿਕਾਣਾ ਚੈਨਲਾਂ ਨੂੰ ਛਾਪਣ ਲਈ ਕੋਈ ਥਾਂ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ Airhop ਦੁਬਾਰਾ ਸਭ ਤੋਂ ਨੇੜਲੇ ਰਿਲੇ ਆਪੇ ਚੁਣ ਰਿਹਾ ਹੈ।",
  "settings.network.add_relay": "ਰਿਲੇ ਜੋੜੋ",
  "settings.network.remove_relay": "{url} ਹਟਾਓ",
  "settings.network.add_short": "ਜੋੜੋ",
  "settings.network.relay_limit":
    "ਤੁਸੀਂ {count} ਰਿਲੇ ਜੋੜ ਸਕਦੇ ਹੋ। ਹੋਰ ਜੋੜਨ ਲਈ ਇੱਕ ਹਟਾਓ।",
  "settings.network.relay_duplicate": "ਉਹ ਰਿਲੇ ਪਹਿਲਾਂ ਹੀ ਤੁਹਾਡੀ ਸੂਚੀ ਵਿੱਚ ਹੈ।",
  "settings.network.relay_invalid":
    "ਸਹੀ ਰਿਲੇ ਹੋਸਟ ਭਰੋ, ਜਿਵੇਂ relay.example.com। ਪੋਰਟ ਸਿਰਫ਼ ਤਾਂ ਹੀ ਚਾਹੀਦਾ ਹੈ ਜੇ ਰਿਲੇ ਮੂਲ ਪੋਰਟ ਨਾ ਵਰਤਦਾ ਹੋਵੇ। IP ਪਤੇ ਅਤੇ ਸਥਾਨਕ ਨਾਂ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹਨ।",
  "settings.network.lan": "ਸਥਾਨਕ ਨੈੱਟਵਰਕ",
  "settings.network.lan_desc":
    "ਉਸੇ WiFi ਉੱਤੇ ਮੌਜੂਦ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚੋ, iPhone ਅਤੇ Android ਵਿਚਕਾਰ ਵੀ। ਨੈੱਟਵਰਕ ਉੱਤੇ ਮੌਜੂਦ ਹੋਰ ਡਿਵਾਈਸ ਦੇਖ ਸਕਦੇ ਹਨ ਕਿ ਤੁਸੀਂ Airhop ਚਲਾ ਰਹੇ ਹੋ।",
  "settings.network.lan_searching": "ਇਸ ਨੈੱਟਵਰਕ ਉੱਤੇ ਕੋਈ Airhop ਡਿਵਾਈਸ ਨਹੀਂ",
  "settings.network.lan_active": "ਇਸ ਨੈੱਟਵਰਕ ਉੱਤੇ ਜੁੜਿਆ",
  "settings.network.lan_unavailable": "ਕਿਸੇ WiFi ਨੈੱਟਵਰਕ ਉੱਤੇ ਨਹੀਂ",
  "settings.network.lan_permission": "Airhop ਲਈ ਸਥਾਨਕ ਨੈੱਟਵਰਕ ਪਹੁੰਚ ਬੰਦ ਹੈ",
  "settings.network.lan_unsupported": "ਇਸ ਡਿਵਾਈਸ ਉੱਤੇ ਉਪਲਬਧ ਨਹੀਂ",
  "settings.network.lan_foreground":
    "Airhop ਦੇ ਬੈਕਗਰਾਊਂਡ ਵਿੱਚ ਜਾਣ ਉੱਤੇ ਰੁਕ ਜਾਂਦਾ ਹੈ। ਬਲੂਟੁੱਥ ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ।",
  "settings.network.wifi_pair": "ਜੋੜਾ ਬਣਾਉਣਾ",
  "settings.network.wifi_paired": "ਜੋੜੇ ਗਏ ਡਿਵਾਈਸ",
  "settings.network.wifi_pair_find": "ਡਿਵਾਈਸ ਲੱਭੋ",
  "settings.network.wifi_pair_find_desc":
    "ਨੇੜਲਾ ਅਜਿਹਾ iPhone ਲੱਭੋ ਜੋ ਆਪਣੇ ਆਪ ਨੂੰ ਦਿਖਾ ਰਿਹਾ ਹੈ। ਦੋਵਾਂ ਫ਼ੋਨਾਂ ਨੂੰ iOS 26 ਜਾਂ ਬਾਅਦ ਵਾਲਾ ਚਾਹੀਦਾ ਹੈ।",
  "settings.network.wifi_pair_show": "ਇਹ iPhone ਦਿਖਾਓ",
  "settings.network.wifi_pair_show_desc":
    "ਨੇੜਲੇ iPhone ਨੂੰ ਇਸਨੂੰ ਲੱਭਣ ਦਿਓ। ਇੱਕ ਲੱਭਦਾ ਹੈ, ਦੂਜਾ ਦਿਖਾਉਂਦਾ ਹੈ, ਇੱਕੋ ਸਮੇਂ।",
  "settings.network.wifi_pair_find_action": "ਨੇੜਲਾ iPhone ਚੁਣੋ",
  "settings.network.wifi_pair_show_action": "ਇਸ iPhone ਨੂੰ ਲੱਭਣਯੋਗ ਬਣਾਓ",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware ਇਸ ਵੇਲੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ",
  "settings.network.wifi_pair_forget": "Settings ਐਪ ਵਿੱਚ ਜੋੜ ਹਟਾਓ",
  "settings.network.bitchat": "bitchat ਅਨੁਕੂਲਤਾ",
  "settings.network.bitchat_desc":
    "bitchat ਵਾਲਾ ਹੀ BLE ਮੈਸ਼, ਪੂਰੀ ਤਰ੍ਹਾਂ ਆਪਸ ਵਿੱਚ ਚੱਲਣ ਯੋਗ। ਇਹ ਹਮੇਸ਼ਾ ਚਾਲੂ ਰਹਿੰਦਾ ਹੈ, ਅਤੇ ਬੰਦ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "ਪਿਛੋਕੜ ਵਿੱਚ ਚੱਲੋ",
  "settings.conn.background_desc": "Airhop ਬੰਦ ਹੋਣ ’ਤੇ ਵੀ ਮੈਸ਼ ਚੱਲਦਾ ਰੱਖੋ",
  "settings.conn.background_on_title": "ਮੈਸ਼ ਚੱਲਦਾ ਰੱਖਣਾ ਹੈ?",
  "settings.conn.background_on_body":
    "Airhop ਬੰਦ ਹੋਣ ’ਤੇ ਵੀ ਅੱਗੇ ਭੇਜਦਾ ਅਤੇ ਲੈਂਦਾ ਰਹਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਤੁਹਾਡੀ ਗ਼ੈਰ-ਹਾਜ਼ਰੀ ਵਿੱਚ ਵੀ ਸੁਨੇਹੇ ਪਹੁੰਚਦੇ ਰਹਿੰਦੇ ਹਨ। ਇਸ ਦੌਰਾਨ Android ਇੱਕ ਚੱਲਦੀ ਸੂਚਨਾ ਦਿਖਾਉਂਦਾ ਹੈ।",
  "settings.conn.background_off_title": "Airhop ਬੰਦ ਹੋਣ ’ਤੇ ਮੈਸ਼ ਰੋਕ ਦੇਣਾ ਹੈ?",
  "settings.conn.background_off_body":
    "ਸੁਨੇਹੇ ਸਿਰਫ਼ ਉਦੋਂ ਹੀ ਪਹੁੰਚਣਗੇ ਜਦੋਂ Airhop ਖੁੱਲ੍ਹਾ ਹੋਵੇ, ਅਤੇ ਇਹ ਫ਼ੋਨ ਨੇੜਲੇ ਲੋਕਾਂ ਲਈ ਅੱਗੇ ਭੇਜਣਾ ਬੰਦ ਕਰ ਦਿੰਦਾ ਹੈ। ਚੱਲਦੀ ਸੂਚਨਾ ਚਲੀ ਜਾਂਦੀ ਹੈ।",
  "settings.conn.live_voice": "ਸਿੱਧੀ ਆਵਾਜ਼",
  "settings.conn.live_voice_desc": "ਨੇੜਲੇ ਲੋਕਾਂ ਨਾਲ ਵਾਕੀ-ਟਾਕੀ ਵਾਂਗ ਗੱਲ ਕਰੋ",
  "settings.conn.live_voice_on_title": "ਸਿੱਧੀ ਆਵਾਜ਼ ਚਾਲੂ ਕਰਨੀ ਹੈ?",
  "settings.conn.live_voice_on_body":
    "ਮਾਈਕ ਦਬਾ ਕੇ ਰੱਖਣ ਨਾਲ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਬੋਲਦਿਆਂ ਹੀ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿਚਲੇ ਹਰ ਕਿਸੇ ਤੱਕ ਜਾਂਦੀ ਹੈ, ਅਤੇ ਉਹਨਾਂ ਦੀ ਆਵਾਜ਼ ਤੁਹਾਡੇ ਫ਼ੋਨ ’ਤੇ ਵੱਜਦੀ ਹੈ। ਕੁਝ ਵੀ ਰਿਕਾਰਡ ਨਹੀਂ ਹੁੰਦਾ।",
  "settings.conn.live_voice_off_title": "ਸਿੱਧੀ ਆਵਾਜ਼ ਬੰਦ ਕਰਨੀ ਹੈ?",
  "settings.conn.live_voice_off_body":
    "ਮਾਈਕ ਦਬਾ ਕੇ ਰੱਖਣ ਨਾਲ ਇਸ ਦੀ ਥਾਂ ਵੌਇਸ ਨੋਟ ਰਿਕਾਰਡ ਹੁੰਦਾ ਹੈ। ਛੱਡਣ ’ਤੇ ਇਹ ਭੇਜ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਅਤੇ ਜਦੋਂ ਤੱਕ ਕੋਈ ਇਸ ਨੂੰ ਚਲਾਉਂਦਾ ਨਹੀਂ, ਕਿਸੇ ਨੂੰ ਸੁਣਦਾ ਨਹੀਂ।",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor ਰਾਊਟਿੰਗ",
  "settings.conn.tor_desc": "ਵਾਧੂ ਨਿੱਜਤਾ ਲਈ Nostr ਦੀ ਆਵਾਜਾਈ Tor ਰਾਹੀਂ ਭੇਜੋ",
  "settings.conn.tor_on_title": "Nostr ਦੀ ਆਵਾਜਾਈ Tor ਰਾਹੀਂ ਭੇਜਣੀ ਹੈ?",
  "settings.conn.tor_on_body":
    "ਰਿਲੇ ਤੁਹਾਡਾ IP ਪਤਾ ਦੇਖਣਾ ਬੰਦ ਕਰ ਦਿੰਦੇ ਹਨ। ਜੁੜਨ ਵਿੱਚ ਵੱਧ ਸਮਾਂ ਲੱਗਦਾ ਹੈ ਅਤੇ ਸੁਨੇਹੇ ਹੌਲੀ ਪਹੁੰਚਦੇ ਹਨ। ਬਲੂਟੁੱਥ ’ਤੇ ਕੋਈ ਅਸਰ ਨਹੀਂ।",
  "settings.conn.tor_off_title": "Tor ਰਾਊਟਿੰਗ ਬੰਦ ਕਰਨੀ ਹੈ?",
  "settings.conn.tor_off_body":
    "Nostr ਦੀ ਆਵਾਜਾਈ ਵਾਪਸ ਤੁਹਾਡੇ ਆਮ ਕਨੈਕਸ਼ਨ ’ਤੇ ਚਲੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਰਿਲੇ ਤੁਹਾਡਾ IP ਪਤਾ ਦੁਬਾਰਾ ਦੇਖਣ ਲੱਗਦੇ ਹਨ। ਬਲੂਟੁੱਥ ’ਤੇ ਕਿਸੇ ਵੀ ਹਾਲਤ ਵਿੱਚ ਅਸਰ ਨਹੀਂ ਪੈਂਦਾ।",
  "settings.conn.tor_unavailable": "ਇਸ ਬਿਲਡ ਵਿੱਚ Tor ਰਾਊਟਿੰਗ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
  "settings.conn.tor_timeout":
    "Tor ਨੂੰ ਜੁੜਨ ਵਿੱਚ ਇੱਕ ਮਿੰਟ ਤੋਂ ਵੱਧ ਲੱਗ ਰਿਹਾ ਹੈ। ਇਹ ਚਾਲੂ ਰਹਿੰਦਾ ਹੈ ਅਤੇ ਕੋਸ਼ਿਸ਼ ਕਰਦਾ ਰਹਿੰਦਾ ਹੈ; ਮੈਸ਼ ਟੈਬ ਦੱਸ ਦੇਵੇਗਾ ਕਿ ਇਹ ਕਦੋਂ ਰਾਊਟ ਕਰ ਰਿਹਾ ਹੈ, ਜਾਂ ਜੇ ਇਹ ਨੈੱਟਵਰਕ ਇਸ ਨੂੰ ਰੋਕ ਰਿਹਾ ਹੈ।",
  "settings.conn.tor_failed":
    "Tor ਸ਼ੁਰੂ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "settings.tor.status": "Tor ਸਥਿਤੀ",
  "settings.tor.connection": "ਕਨੈਕਸ਼ਨ",
  "settings.tor.mode_off": "ਸਿੱਧਾ",
  "settings.tor.mode_off_desc":
    "ਸਿੱਧਾ Tor ਨਾਲ ਜੁੜਦਾ ਹੈ। ਸਭ ਤੋਂ ਤੇਜ਼, ਪਰ ਇਸ ਨੈੱਟਵਰਕ ਨੂੰ ਵੇਖਣ ਵਾਲਾ ਕੋਈ ਵੀ ਜਾਣ ਸਕਦਾ ਹੈ ਕਿ ਤੁਸੀਂ Tor ਵਰਤ ਰਹੇ ਹੋ।",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "ਲੁਕਾਉਂਦਾ ਹੈ ਕਿ ਤੁਸੀਂ Tor ਵਰਤ ਰਹੇ ਹੋ, ਅਤੇ ਜਿੱਥੇ ਬ੍ਰਿਜ ਬੰਦ ਹਨ ਉੱਥੇ ਵੀ ਚੱਲਦਾ ਹੈ। ਜੁੜਨ ਵਿੱਚ ਸਭ ਤੋਂ ਹੌਲੀ।",
  "settings.tor.mode_obfs4": "obfs4",
  "settings.tor.mode_obfs4_desc":
    "ਲੁਕਾਉਂਦਾ ਹੈ ਕਿ ਤੁਸੀਂ Tor ਵਰਤ ਰਹੇ ਹੋ। Snowflake ਤੋਂ ਤੇਜ਼, ਪਰ ਇਹ ਬ੍ਰਿਜ ਜਨਤਕ ਹਨ ਅਤੇ ਕੁਝ ਨੈੱਟਵਰਕ ਇਨ੍ਹਾਂ ਨੂੰ ਰੋਕਦੇ ਹਨ।",
  "settings.tor.mode_webtunnel": "webtunnel",
  "settings.tor.mode_webtunnel_desc":
    "ਆਮ ਵੈੱਬਸਾਈਟ ਵਿਜ਼ਿਟ ਵਾਂਗ ਦਿਖ ਕੇ ਲੁਕਾਉਂਦਾ ਹੈ ਕਿ ਤੁਸੀਂ Tor ਵਰਤਦੇ ਹੋ। ਬਾਕੀਆਂ ਨਾਲੋਂ ਬਲਾਕ ਕਰਨਾ ਔਖਾ।",
  "settings.tor.mode_custom": "ਆਪਣੇ ਬ੍ਰਿਜ",
  "settings.tor.mode_custom_desc":
    "bridges.torproject.org ਤੋਂ ਮਿਲੀਆਂ obfs4 ਬ੍ਰਿਜ ਲਾਈਨਾਂ ਵਰਤੋ। ਬਾਕੀ ਅਸਫਲ ਹੋਣ ਉੱਤੇ ਇਹ ਅਜ਼ਮਾਓ।",
  "settings.tor.custom_placeholder": "ਹਰ ਲਾਈਨ ਵਿੱਚ ਇੱਕ ਬ੍ਰਿਜ ਲਾਈਨ ਚਿਪਕਾਓ",
  "settings.tor.custom_apply_hint": "ਕਨੈਕਟ ਕਰਨ ਲਈ ਬਾਕਸ ਤੋਂ ਬਾਹਰ ਟੈਪ ਕਰੋ।",
  "settings.tor.custom_empty": "ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਬ੍ਰਿਜ ਲਾਈਨ ਸ਼ਾਮਲ ਕਰੋ।",
  "settings.tor.recovered":
    "Tor ਪਿਛਲੀ ਵਾਰ ਸ਼ੁਰੂ ਹੋਣਾ ਪੂਰਾ ਨਹੀਂ ਕਰ ਸਕਿਆ, ਇਸ ਲਈ ਇਸਨੂੰ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ ਇਸਨੂੰ ਫਿਰ ਚਾਲੂ ਕਰੋ।",
  "settings.conn.mint_clearnet": "ਮਿੰਟ ਦੀ ਆਵਾਜਾਈ ਖੁੱਲ੍ਹੇ ਨੈੱਟ ’ਤੇ ਜਾਣ ਦਿਓ",
  "settings.conn.mint_clearnet_desc":
    "iOS ’ਤੇ Tor ਸਿਰਫ਼ Nostr ਨੂੰ ਢਕਦਾ ਹੈ। ਮਿੰਟ ਦੀਆਂ ਬੇਨਤੀਆਂ ਰੋਕਣ ਲਈ ਇਸ ਨੂੰ ਬੰਦ ਰਹਿਣ ਦਿਓ; ਮੈਸ਼ ’ਤੇ ecash ਕਿਸੇ ਵੀ ਹਾਲਤ ਵਿੱਚ ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ।",
  "settings.conn.gateway": "ਇੰਟਰਨੈੱਟ ਗੇਟਵੇ",
  "settings.conn.gateway_desc":
    "ਕਿਸੇ ਨੇੜਲੇ ਆਫ਼ਲਾਈਨ ਫ਼ੋਨ ਨੂੰ ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਉਧਾਰ ਦਿਓ ਤਾਂ ਜੋ ਉਹ ਟਿਕਾਣਾ ਚੈਨਲਾਂ ਤੱਕ ਪਹੁੰਚ ਸਕੇ",
  "settings.conn.gateway_on_title": "ਇੰਟਰਨੈੱਟ ਗੇਟਵੇ ਚਾਲੂ ਕਰਨਾ ਹੈ?",
  "settings.conn.gateway_on_body":
    "ਆਪਣੇ ਕਨੈਕਸ਼ਨ ਤੋਂ ਬਿਨਾਂ ਨੇੜਲੇ ਫ਼ੋਨ ਟਿਕਾਣਾ ਚੈਨਲ ਦੇ ਸੁਨੇਹੇ ਤੁਹਾਡੇ ਰਾਹੀਂ ਭੇਜਣਗੇ ਅਤੇ ਲੈਣਗੇ। ਇਹ ਤੁਹਾਡਾ ਮੋਬਾਈਲ ਡਾਟਾ ਅਤੇ ਬੈਟਰੀ ਵਰਤਦਾ ਹੈ, ਅਤੇ ਉਹਨਾਂ ਦੇ ਸੁਨੇਹੇ ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ ਜੋ ਲੰਘਦਾ ਹੈ ਤੁਸੀਂ ਉਸ ਨੂੰ ਪੜ੍ਹ ਨਹੀਂ ਸਕਦੇ।",
  "settings.conn.gateway_off_title": "ਇੰਟਰਨੈੱਟ ਗੇਟਵੇ ਬੰਦ ਕਰਨਾ ਹੈ?",
  "settings.conn.gateway_off_body":
    "ਨੇੜਲੇ ਆਫ਼ਲਾਈਨ ਫ਼ੋਨ ਤੁਹਾਡੇ ਰਾਹੀਂ ਟਿਕਾਣਾ ਚੈਨਲਾਂ ਤੱਕ ਪਹੁੰਚਣਾ ਬੰਦ ਕਰ ਦਿੰਦੇ ਹਨ। ਤੁਹਾਡੇ ਆਪਣੇ ਸੁਨੇਹਿਆਂ ’ਤੇ ਕੋਈ ਅਸਰ ਨਹੀਂ।",
  "settings.conn.bridge": "ਮੈਸ਼ ਪੁਲ",
  "settings.conn.bridge_desc":
    "ਇਸ ਇਲਾਕੇ ਦੀ ਜਨਤਕ #bluetooth ਗੱਲਬਾਤ ਨੂੰ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਕਿਸੇ ਹੋਰ ਬਲੂਟੁੱਥ ਭੀੜ ਨਾਲ ਜੋੜੋ",
  "settings.conn.bridge_on_title": "ਮੈਸ਼ ਪੁਲ ਚਾਲੂ ਕਰਨਾ ਹੈ?",
  "settings.conn.bridge_on_body":
    "ਤੁਹਾਡੇ ਜਨਤਕ #bluetooth ਸੁਨੇਹੇ ਇੰਟਰਨੈੱਟ ਰਾਹੀਂ ਤੁਹਾਡੇ ਮੁਹੱਲੇ ਵਿੱਚ ਛਾਪੇ ਜਾਣਗੇ, ਇਸ ਲਈ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਤੋਂ ਪਰ੍ਹੇ ਲੋਕ ਵੀ ਇਹ ਪੜ੍ਹ ਸਕਣਗੇ। ਨਿੱਜੀ ਸੁਨੇਹੇ ਕਦੇ ਪੁਲ ਨਹੀਂ ਕੀਤੇ ਜਾਂਦੇ, ਅਤੇ “ਸਿਰਫ਼ ਨੇੜੇ” ਕਿਸੇ ਵੀ ਇੱਕ ਸੁਨੇਹੇ ਨੂੰ ਸਥਾਨਕ ਰੱਖਦਾ ਹੈ।",
  "settings.conn.bridge_off_title": "ਮੈਸ਼ ਪੁਲ ਬੰਦ ਕਰਨਾ ਹੈ?",
  "settings.conn.bridge_off_body":
    "ਤੁਹਾਡੇ ਜਨਤਕ #bluetooth ਸੁਨੇਹੇ ਦੁਬਾਰਾ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਹੀ ਰਹਿੰਦੇ ਹਨ, ਅਤੇ ਪੁਲ ਵਾਲੀ ਭੀੜ ਦੇ ਸੁਨੇਹੇ ਇੱਥੇ ਆਉਣੇ ਬੰਦ ਹੋ ਜਾਂਦੇ ਹਨ।",
  "settings.conn.bridge_needs_location": "ਮੈਸ਼ ਪੁਲ ਨੂੰ ਟਿਕਾਣਾ ਚਾਹੀਦਾ ਹੈ",
  "settings.conn.bridge_needs_location_desc":
    "ਇਹ ਟਿਕਾਣੇ ਤੋਂ ਤੁਹਾਡਾ ਮੁਹੱਲਾ ਲੱਭਦਾ ਹੈ। ਪੁਲ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਟਿਕਾਣੇ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।",
  "settings.conn.grant_location": "ਟਿਕਾਣੇ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ",
  "settings.conn.grant_short": "ਇਜਾਜ਼ਤ ਦਿਓ",
  "settings.conn.internet_off": "ਇੰਟਰਨੈੱਟ ਬੰਦ ਹੈ",
  "settings.conn.internet_off_desc":
    "Tor, ਪੁਲ ਅਤੇ ਗੇਟਵੇ ਸਭ ਇੰਟਰਨੈੱਟ ਵਰਤਦੇ ਹਨ। ਇਹ ਵਰਤਣ ਲਈ ਨੈੱਟਵਰਕ ਹੇਠੋਂ ਇੰਟਰਨੈੱਟ ਸਹਾਰਾ ਚਾਲੂ ਕਰੋ।",
  "settings.conn.turn_on": "ਚਾਲੂ ਕਰੋ",
  "settings.conn.turn_off": "ਬੰਦ ਕਰੋ",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "ਬਲੂਟੁੱਥ",
  "settings.permissions.bluetooth_desc":
    "ਨੇੜਲੇ ਡੀਵਾਈਸ ਲੱਭਦਾ ਹੈ ਅਤੇ ਉਹਨਾਂ ਵਿਚਕਾਰ ਸੁਨੇਹੇ ਅੱਗੇ ਭੇਜਦਾ ਹੈ। ਇਸ ਤੋਂ ਬਿਨਾਂ ਮੈਸ਼ ਚੱਲ ਹੀ ਨਹੀਂ ਸਕਦਾ।",
  "settings.permissions.location": "ਟਿਕਾਣਾ",
  "settings.permissions.location_desc":
    "ਨੇੜਲੇ ਇਲਾਕੇ ਦੇ ਚੈਨਲ ਖੋਲ੍ਹਦਾ ਹੈ। ਇਸ ਤੋਂ ਬਿਨਾਂ ਉਹ ਚੈਨਲ ਬੰਦ ਰਹਿੰਦੇ ਹਨ ਅਤੇ ਬਲੂਟੁੱਥ ਮੈਸ਼ ਆਮ ਵਾਂਗ ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ।",
  "settings.permissions.notifications": "ਸੂਚਨਾਵਾਂ",
  "settings.permissions.notifications_desc":
    "ਐਪ ਬੰਦ ਹੋਣ ’ਤੇ ਵੀ ਨਵੇਂ ਸੁਨੇਹਿਆਂ ਦੀ ਸੂਚਨਾ ਲਵੋ। ਇਸ ਤੋਂ ਬਿਨਾਂ ਤੁਹਾਨੂੰ ਇਹ ਉਦੋਂ ਹੀ ਦਿਸਣਗੇ ਜਦੋਂ ਤੁਸੀਂ Airhop ਖੋਲ੍ਹੋਗੇ।",
  "settings.permissions.camera": "ਕੈਮਰਾ",
  "settings.permissions.camera_desc":
    "QR ਕੋਡ ਸਕੈਨ ਕਰਦਾ ਹੈ ਅਤੇ ਭੇਜਣ ਲਈ ਫ਼ੋਟੋ ਜਾਂ ਵੀਡੀਓ ਖਿੱਚਦਾ ਹੈ। ਇਸ ਤੋਂ ਬਿਨਾਂ ਵੀ ਤੁਸੀਂ ਆਪਣੀ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚੋਂ ਮੀਡੀਆ ਸਾਂਝਾ ਕਰ ਸਕਦੇ ਹੋ।",
  "settings.permissions.photos": "ਫ਼ੋਟੋਆਂ",
  "settings.permissions.photos_desc":
    "ਆਪਣੀ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚੋਂ ਫ਼ੋਟੋਆਂ ਭੇਜੋ ਅਤੇ ਮਿਲਿਆ ਮੀਡੀਆ ਸੰਭਾਲੋ। ਇਸ ਤੋਂ ਬਿਨਾਂ ਵੀ ਤੁਸੀਂ ਕੈਮਰੇ ਨਾਲ ਨਵੀਆਂ ਫ਼ੋਟੋਆਂ ਖਿੱਚ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ।",
  "settings.permissions.microphone": "ਮਾਈਕ੍ਰੋਫ਼ੋਨ",
  "settings.permissions.microphone_desc":
    "ਆਵਾਜ਼ੀ ਸੁਨੇਹੇ ਰਿਕਾਰਡ ਕਰ ਕੇ ਭੇਜੋ ਜਾਂ ਸਿੱਧੀ ਆਵਾਜ਼ ਵਰਤੋ। ਇਸ ਤੋਂ ਬਿਨਾਂ ਆਵਾਜ਼ੀ ਸੁਨੇਹੇ ਅਤੇ ਸਿੱਧੀ ਆਵਾਜ਼ ਕੰਮ ਨਹੀਂ ਕਰਨਗੇ।",
  "settings.permissions.allow": "ਇਹ ਇਜਾਜ਼ਤ ਦਿਓ",
  "settings.permissions.open_settings":
    "ਇਹ ਇਜਾਜ਼ਤ ਬਦਲਣ ਲਈ ਸਿਸਟਮ ਸੈਟਿੰਗਾਂ ਖੋਲ੍ਹੋ",
  "settings.permissions.system": "ਸਿਸਟਮ",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "ਨੈੱਟਵਰਕ ਵਰਤੋਂ",
  "settings.storage.storage_usage": "ਭੰਡਾਰ ਵਰਤੋਂ",
  "settings.storage.storage_usage_desc":
    "ਸੁਨੇਹੇ, ਵਾਲਿਟ ਦੇ ਪਰੂਫ਼, ਅਤੇ ਕੈਸ਼ ਕੀਤੀਆਂ ਅਟੈਚਮੈਂਟਾਂ",
  "settings.storage.session_usage": "ਇਹ ਸੈਸ਼ਨ · {sent} ਭੇਜੇ, {received} ਮਿਲੇ",
  "settings.storage.cache": "ਕੈਸ਼",
  "settings.storage.cache_desc": "{size} ਅਟੈਚਮੈਂਟਾਂ ਦੀਆਂ",
  "settings.storage.clear_cache": "ਅਟੈਚਮੈਂਟ ਕੈਸ਼ ਸਾਫ਼ ਕਰੋ",
  "settings.storage.clear": "ਸਾਫ਼ ਕਰੋ",
  "settings.storage.clear_title": "ਕੈਸ਼ ਕੀਤਾ ਮੀਡੀਆ ਸਾਫ਼ ਕਰਨਾ ਹੈ?",
  "settings.storage.clear_body":
    "ਫ਼ੋਟੋਆਂ, ਵੀਡੀਓ, ਵੌਇਸ ਨੋਟ ਅਤੇ ਫ਼ਾਈਲਾਂ ਇਸ ਡੀਵਾਈਸ ਤੋਂ ਹਟਾ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ, ਭੇਜੀਆਂ ਵੀ ਅਤੇ ਮਿਲੀਆਂ ਵੀ। ਇਹ ਦੁਬਾਰਾ ਡਾਊਨਲੋਡ ਨਹੀਂ ਹੋ ਸਕਦੀਆਂ: ਇਹਨਾਂ ਦੇ ਬੁਲਬੁਲੇ ਇਹ ਦੱਸ ਦੇਣਗੇ, ਅਤੇ ਤੁਸੀਂ ਭੇਜਣ ਵਾਲੇ ਨੂੰ ਦੁਬਾਰਾ ਭੇਜਣ ਲਈ ਕਹਿ ਸਕਦੇ ਹੋ। ਸੁਨੇਹੇ ਅਤੇ ਵਾਲਿਟ ਉਵੇਂ ਦੇ ਉਵੇਂ ਰਹਿੰਦੇ ਹਨ।",
  "settings.storage.cleared": "ਕੈਸ਼ ਸਾਫ਼ ਹੋ ਗਿਆ",
  "settings.storage.freed": "{size} ਖ਼ਾਲੀ ਕੀਤੇ।",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "ਦਿੱਖ {value} ਸੈੱਟ ਕਰੋ",
  "settings.font.set_a11y": "ਇੱਕ-ਚੌੜਾਈ ਫ਼ੌਂਟ {value} ਸੈੱਟ ਕਰੋ",
  "settings.font.system": "ਸਿਸਟਮ",
  "settings.font.system_desc": "ਤੁਹਾਡੇ ਡੀਵਾਈਸ ਦਾ ਮੂਲ ਇੱਕ-ਚੌੜਾਈ ਫ਼ੌਂਟ ਵਰਤਦਾ ਹੈ",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "ਨਵਾਂ ਅਤੇ ਪੜ੍ਹਨ ਵਿੱਚ ਸੌਖਾ",
  "settings.language.en": "ਅੰਗਰੇਜ਼ੀ",
  "settings.language.am": "ਅਮਹਾਰਿਕ",
  "settings.language.ar": "ਅਰਬੀ",
  "settings.language.bn": "ਬੰਗਾਲੀ",
  "settings.language.my": "ਬਰਮੀ",
  "settings.language.zh_hans": "ਚੀਨੀ (ਸਰਲ)",
  "settings.language.zh_hant": "ਚੀਨੀ (ਰਵਾਇਤੀ)",
  "settings.language.nl": "ਡੱਚ",
  "settings.language.fil": "ਫ਼ਿਲਿਪੀਨੋ",
  "settings.language.fr": "ਫ਼ਰਾਂਸੀਸੀ",
  "settings.language.ka": "ਜਾਰਜੀਅਨ",
  "settings.language.de": "ਜਰਮਨ",
  "settings.language.hi": "ਹਿੰਦੀ",
  "settings.language.id": "ਇੰਡੋਨੇਸ਼ੀਆਈ",
  "settings.language.it": "ਇਤਾਲਵੀ",
  "settings.language.ja": "ਜਪਾਨੀ",
  "settings.language.ko": "ਕੋਰੀਆਈ",
  "settings.language.mg": "ਮਾਲਾਗਾਸੀ",
  "settings.language.ms": "ਮਲਾਈ",
  "settings.language.ne": "ਨੇਪਾਲੀ",
  "settings.language.fa": "ਫ਼ਾਰਸੀ",
  "settings.language.pl": "ਪੋਲਿਸ਼",
  "settings.language.pt_br": "ਪੁਰਤਗਾਲੀ (ਬ੍ਰਾਜ਼ੀਲ)",
  "settings.language.pt_pt": "ਪੁਰਤਗਾਲੀ (ਪੁਰਤਗਾਲ)",
  "settings.language.pa": "ਪੰਜਾਬੀ",
  "settings.language.ru": "ਰੂਸੀ",
  "settings.language.es": "ਸਪੈਨਿਸ਼",
  "settings.language.sw": "ਸਵਾਹਿਲੀ",
  "settings.language.sv": "ਸਵੀਡਿਸ਼",
  "settings.language.ta": "ਤਮਿਲ",
  "settings.language.th": "ਥਾਈ",
  "settings.language.tr": "ਤੁਰਕੀ",
  "settings.language.uk": "ਯੂਕਰੇਨੀ",
  "settings.language.ur": "ਉਰਦੂ",
  "settings.language.vi": "ਵੀਅਤਨਾਮੀ",
  "settings.language.pseudo": "ਸੂਡੋਲੋਕੇਲ",
  "settings.language.soon": "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
  "settings.language.soon_a11y": "{value}, ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
  "settings.language.set_a11y": "ਭਾਸ਼ਾ {value} ਸੈੱਟ ਕਰੋ",
  "settings.language.pending": "ਅਗਲੀ ਵਾਰ ਖੋਲ੍ਹਣ ’ਤੇ",
  "settings.language.pending_a11y":
    "{value}, ਅਗਲੀ ਵਾਰ Airhop ਖੋਲ੍ਹਣ ’ਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ",
  "settings.language.rtl_restart": "ਹੁਣੇ ਮੁੜ ਖੋਲ੍ਹੋ",
  "settings.language.rtl_title": "ਮੁਕਾਉਣ ਲਈ Airhop ਦੁਬਾਰਾ ਖੋਲ੍ਹੋ",
  "settings.language.rtl_body":
    "{value} ਸੱਜਿਓਂ ਖੱਬੇ ਪੜ੍ਹੀ ਜਾਂਦੀ ਹੈ, ਅਤੇ Airhop ਦਿਸ਼ਾ ਸਿਰਫ਼ ਸ਼ੁਰੂ ਹੁੰਦਿਆਂ ਹੀ ਬਦਲ ਸਕਦਾ ਹੈ। ਬਦਲਾਅ ਮੁਕਾਉਣ ਲਈ ਇਸ ਨੂੰ ਬੰਦ ਕਰ ਕੇ ਦੁਬਾਰਾ ਖੋਲ੍ਹੋ। ਕੁਝ ਵੀ ਨਹੀਂ ਗੁਆਚਦਾ, ਅਤੇ ਉਦੋਂ ਤੱਕ ਤੁਹਾਡਾ ਮੈਸ਼ ਜੁੜਿਆ ਰਹਿੰਦਾ ਹੈ।",
  "settings.theme.light": "ਹਲਕਾ",
  "settings.theme.light_desc": "ਹਮੇਸ਼ਾ ਹਲਕਾ ਰੰਗ-ਪੱਟ ਵਰਤੋ",
  "settings.theme.dark": "ਗੂੜ੍ਹਾ",
  "settings.theme.dark_desc": "ਹਮੇਸ਼ਾ ਗੂੜ੍ਹਾ ਰੰਗ-ਪੱਟ ਵਰਤੋ",

  // ---- Settings: profile and identity ----
  "settings.status.online": "ਆਨਲਾਈਨ",
  "settings.status.online_desc": "ਲੱਭਣਯੋਗ, ਐਲਾਨ ਅਤੇ ਖੋਜ ਕਰ ਰਹੇ ਹਾਂ",
  "settings.status.away": "ਦੂਰ",
  "settings.status.away_desc": "ਮੈਸ਼ ਰੁਕਿਆ, ਨਾ ਖੋਜ ਨਾ ਐਲਾਨ",
  "settings.status.invisible": "ਅਦਿੱਖ",
  "settings.status.invisible_desc": "ਖੋਜ ਕਰ ਰਹੇ ਹਾਂ, ਪਰ ਲੱਭੇ ਜਾਣ ਤੋਂ ਲੁਕੇ ਹੋਏ",
  "settings.status.title": "ਹਾਲਤ",
  "settings.status.set_a11y": "ਹਾਲਤ {value} ਸੈੱਟ ਕਰੋ",
  "settings.status.edit": "ਹਾਲਤ ਬਦਲੋ",
  "settings.status.desc": "ਚੁਣੋ ਕਿ ਤੁਸੀਂ ਮੈਸ਼ ’ਤੇ ਕਿੰਨੇ ਦਿਸਦੇ ਹੋ।",
  "settings.transfer.identity": "ਪਛਾਣ ਅਤੇ ਕੁੰਜੀਆਂ",
  "settings.transfer.identity_desc": "ਤੁਹਾਡੀ ਪੀਅਰ ID, ਵਰਤੋਂਕਾਰ-ਨਾਂ ਅਤੇ ਸੰਪਰਕ",
  "settings.transfer.chats": "ਗੱਲਬਾਤਾਂ ਅਤੇ ਇਤਿਹਾਸ",
  "settings.transfer.chats_desc":
    "ਗੱਲਬਾਤਾਂ, ਗਰੁੱਪ, ਅਤੇ ਉਹ ਚੈਨਲ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਤੁਸੀਂ ਜੁੜੇ ਹੋ",
  "settings.transfer.wallet": "ਵਾਲਿਟ ਬੈਲੰਸ",
  "settings.transfer.wallet_desc": "Cashu ਪਰੂਫ਼ ਅਤੇ ਲੈਣ-ਦੇਣ ਦਾ ਇਤਿਹਾਸ",
  "settings.transfer.title": "ਨਵੇਂ ਫ਼ੋਨ ’ਤੇ ਲੈ ਜਾਓ",
  "settings.transfer.desc":
    "ਆਪਣੀ ਪਛਾਣ, ਗੱਲਬਾਤਾਂ ਅਤੇ ਵਾਲਿਟ ਕਿਸੇ ਹੋਰ ਡੀਵਾਈਸ ’ਤੇ ਲੈ ਜਾਓ",
  "settings.transfer.coming_soon_a11y": "ਨਵੇਂ ਫ਼ੋਨ ’ਤੇ ਲੈ ਜਾਓ, ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
  "settings.transfer.body":
    "ਦੋਵੇਂ ਫ਼ੋਨ ਨਾਲ-ਨਾਲ ਰੱਖੋ ਅਤੇ ਸਭ ਕੁਝ ਬਲੂਟੁੱਥ ’ਤੇ ਪਾਰ ਲੈ ਜਾਓ। ਕੁਝ ਵੀ ਕਿਸੇ ਸਰਵਰ ਵਿੱਚੋਂ ਨਹੀਂ ਲੰਘਦਾ, ਇਸ ਲਈ ਇਹ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਚੱਲਦਾ ਹੈ।",
  "settings.qr.permission_label": "ਫ਼ੋਟੋ ਦੀ ਪਹੁੰਚ",
  "settings.qr.permission_purpose": "ਤੁਹਾਡਾ QR ਕੋਡ ਸੰਭਾਲਣ",
  "settings.qr.saved": "ਸੰਭਾਲਿਆ",
  "settings.qr.saved_body": "QR ਕੋਡ ਤੁਹਾਡੀ ਫ਼ੋਟੋ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਸੰਭਾਲ ਲਿਆ।",
  "settings.qr.save_failed": "ਸੰਭਾਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
  "settings.qr.save_failed_body":
    "QR ਕੋਡ ਸੰਭਾਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "settings.qr.share_message": "ਮੈਨੂੰ Airhop ’ਤੇ ਜੋੜੋ",
  "settings.qr.share_body":
    "ਮੈਨੂੰ Airhop ’ਤੇ ਜੋੜੋ — ਆਫ਼ਲਾਈਨ-ਪਹਿਲਾਂ, ਨਿੱਜੀ ਮੈਸ਼ ਸੁਨੇਹੇ।",
  "settings.qr.show_short": "QR ਦਿਖਾਓ",
  "settings.qr.title": "ਤੁਹਾਡਾ QR ਕੋਡ",
  "settings.qr.note":
    "ਇਸ ਵਿੱਚ ਤੁਹਾਡੀਆਂ ਜਨਤਕ ਕੁੰਜੀਆਂ ਹਨ, ਜੋ ਹੋਰਾਂ ਨੂੰ ਕਿਤੋਂ ਵੀ ਤੁਹਾਨੂੰ ਸੁਨੇਹਾ ਭੇਜਣ ਦਿੰਦੀਆਂ ਹਨ। ਇਹ ਸਿਰਫ਼ ਉਹਨਾਂ ਲੋਕਾਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ ਜਿਨ੍ਹਾਂ ’ਤੇ ਤੁਸੀਂ ਭਰੋਸਾ ਕਰਦੇ ਹੋ। ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਆਪਣੀ ਪਛਾਣ ਮਿਟਾ ਨਹੀਂ ਦਿੰਦੇ, ਇਹ ਨਹੀਂ ਬਦਲੇਗਾ।",
  "settings.qr.code_label": "ਸੰਪਰਕ ਕੋਡ",
  "settings.qr.copy_code": "ਸੰਪਰਕ ਕੋਡ ਨਕਲ ਕਰੋ",
  "settings.qr.share": "QR ਕੋਡ ਸਾਂਝਾ ਕਰੋ",
  "settings.qr.share_short": "QR ਸਾਂਝਾ ਕਰੋ",
  "settings.qr.download": "QR ਕੋਡ ਡਾਊਨਲੋਡ ਕਰੋ",
  "settings.qr.download_short": "QR ਡਾਊਨਲੋਡ ਕਰੋ",
  "settings.qr.show": "QR ਕੋਡ ਦਿਖਾਓ",
  "settings.wipe.trigger": "ਸੰਕਟ ਸਫ਼ਾਈ ਚਲਾਓ",
  "settings.wipe.trigger_desc":
    "ਬਿਨਾਂ ਪੁਸ਼ਟੀ ਦੇ ਤੁਰੰਤ ਸਾਫ਼ ਕਰਨ ਲਈ ਤਿੰਨ ਵਾਰ ਦਬਾਓ",
  "settings.wipe.title": "ਸੰਕਟ ਸਫ਼ਾਈ",
  "settings.wipe.now": "ਹੁਣੇ ਸਾਫ਼ ਕਰੋ",
  "settings.wipe.desc": "ਸਾਰੀਆਂ ਕੁੰਜੀਆਂ, ਸੁਨੇਹੇ ਅਤੇ ਪਰੂਫ਼ ਤੁਰੰਤ ਤਬਾਹ ਕਰੋ",
  "settings.wipe.body":
    "ਇਹ ਤੁਹਾਡੀਆਂ ਸਾਰੀਆਂ ਕੁੰਜੀਆਂ, ਸੁਨੇਹੇ ਅਤੇ ਵਾਲਿਟ ਦੇ ਪਰੂਫ਼ ਤੁਰੰਤ ਤਬਾਹ ਕਰ ਦੇਵੇਗਾ। ਇਹ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ।",
  "settings.wipe.in_progress": "ਸਾਫ਼ ਕਰ ਰਹੇ ਹਾਂ",
  "settings.wipe.in_progress_body":
    "ਤੁਹਾਡੀਆਂ ਕੁੰਜੀਆਂ, ਸੁਨੇਹੇ ਅਤੇ ਫ਼ਾਈਲਾਂ ਤਬਾਹ ਕਰ ਰਹੇ ਹਾਂ। ਇਸ ਨੂੰ ਕੁਝ ਸਕਿੰਟ ਲੱਗਦੇ ਹਨ, ਅਤੇ ਜੇ ਐਪ ਬੰਦ ਹੋ ਜਾਵੇ ਤਾਂ ਇਹ ਆਪੇ ਪੂਰਾ ਹੋ ਜਾਂਦਾ ਹੈ।",
  "settings.wipe.got_it": "ਸਮਝ ਗਏ",
  "settings.wipe.keys_failed": "ਕੁੰਜੀਆਂ ਤਬਾਹ ਨਹੀਂ ਹੋ ਸਕੀਆਂ",
  "settings.wipe.keys_failed_body":
    "ਤੁਹਾਡੇ ਸੁਨੇਹੇ, ਸੰਪਰਕ ਅਤੇ ਵਾਲਿਟ ਜਾ ਚੁੱਕੇ ਹਨ, ਪਰ ਡੀਵਾਈਸ ਨੇ ਤੁਹਾਡੀਆਂ ਕੁੰਜੀਆਂ ਛੱਡਣ ਤੋਂ ਨਾਂਹ ਕਰ ਦਿੱਤੀ। ਡੀਵਾਈਸ ਅਨਲਾਕ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਸਾਫ਼ ਕਰੋ।",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
  "settings.help.contact_a11y": "{address} ’ਤੇ ਈਮੇਲ ਕਰੋ",
  "settings.help.bug": "ਖ਼ਰਾਬੀ ਦੱਸੋ",
  "settings.help.bug_desc": "GitHub ’ਤੇ issue ਖੋਲ੍ਹੋ",
  "settings.help.bug_a11y": "GitHub ’ਤੇ ਖ਼ਰਾਬੀ ਦੱਸੋ",
  "settings.help.faq": "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ",
  "settings.help.faq_desc": "ਆਮ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ",
  "settings.help.faq_a11y": "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ ਖੋਲ੍ਹੋ",
  "settings.help.terms_desc": "Airhop ਕਿਵੇਂ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ",
  "settings.help.terms_a11y": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ ਖੋਲ੍ਹੋ",
  "settings.help.privacy_desc": "ਅਸੀਂ ਕੀ ਇਕੱਠਾ ਨਹੀਂ ਕਰਦੇ",
  "settings.help.privacy_a11y": "ਨਿੱਜਤਾ ਨੀਤੀ ਖੋਲ੍ਹੋ",

  // ---- Settings: support ----
  "settings.support.card": "ਕਾਰਡ ਜਾਂ UPI",
  "settings.support.card_desc": "ਨੈੱਟਬੈਂਕਿੰਗ ਅਤੇ ਵਾਲਿਟ, ਦੁਨੀਆ ਭਰ ਵਿੱਚ",
  "settings.support.card_a11y":
    "ਕਾਰਡ, UPI, ਨੈੱਟਬੈਂਕਿੰਗ ਜਾਂ ਵਾਲਿਟ ਨਾਲ ਸਹਾਰਾ ਦਿਓ",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "ਮਹੀਨਾਵਾਰ ਜਾਂ ਇੱਕ ਵਾਰ, ਕੋਈ ਪਲੇਟਫ਼ਾਰਮ ਫ਼ੀਸ ਨਹੀਂ",
  "settings.support.sponsors_a11y": "GitHub Sponsors ਰਾਹੀਂ ਸਹਾਰਾ ਦਿਓ",
  "settings.support.note":
    "ਮੈਂ Airhop ਆਪਣੇ ਵਿਹਲੇ ਸਮੇਂ ਵਿੱਚ ਬਣਾਉਂਦਾ ਹਾਂ। ਨਾ ਕੋਈ ਨਿਵੇਸ਼ਕ ਹੈ ਨਾ ਕੋਈ ਇਸ਼ਤਿਹਾਰ। ਜੇ ਇਹ ਤੁਹਾਡੇ ਕੰਮ ਦਾ ਹੈ ਤਾਂ ਤੁਹਾਡਾ ਯੋਗਦਾਨ ਵਿਕਾਸ ਚੱਲਦਾ ਰੱਖਣ ਵਿੱਚ ਬਹੁਤ ਦੂਰ ਤੱਕ ਜਾਂਦਾ ਹੈ। ਹਰ ਸਹੂਲਤ ਕਿਸੇ ਵੀ ਹਾਲਤ ਵਿੱਚ ਮੁਫ਼ਤ ਰਹਿੰਦੀ ਹੈ।",

  // ---- Settings: about and version ----
  "settings.about.version": "ਸੰਸਕਰਣ",
  "settings.about.version_desc": "ਮੌਜੂਦਾ ਰਿਲੀਜ਼",
  "settings.about.version_a11y": "ਸੰਸਕਰਣ ਦੇਖੋ ਅਤੇ ਅੱਪਡੇਟ ਦੇਖੋ",
  "settings.about.release_notes": "ਰਿਲੀਜ਼ ਨੋਟ",
  "settings.about.release_notes_desc": "ਸਭ ਤੋਂ ਨਵੀਂ ਰਿਲੀਜ਼ ਵਿੱਚ ਕੀ ਨਵਾਂ ਹੈ",
  "settings.about.release_notes_a11y":
    "GitHub ’ਤੇ ਸਭ ਤੋਂ ਨਵੇਂ ਰਿਲੀਜ਼ ਨੋਟ ਖੋਲ੍ਹੋ",
  "settings.about.source": "ਸਰੋਤ ਕੋਡ",
  "settings.about.source_a11y": "GitHub ’ਤੇ ਸਰੋਤ ਕੋਡ ਖੋਲ੍ਹੋ",
  "settings.about.licenses": "ਖੁੱਲ੍ਹੇ ਸਰੋਤ ਦੇ ਲਾਇਸੰਸ",
  "settings.about.open_repo": "{name} ਭੰਡਾਰ ਖੋਲ੍ਹੋ",
  "settings.about.licenses_desc": "ਤੀਜੀ-ਧਿਰ ਦੇ ਖੁੱਲ੍ਹੇ ਸਰੋਤ ਪੈਕੇਜ",
  "settings.about.licenses_a11y": "ਤੀਜੀ-ਧਿਰ ਦੇ ਲਾਇਸੰਸ ਦੇਖੋ",
  "settings.version.codename": "ਕੋਡਨਾਂ",
  "settings.version.checking": "ਦੇਖ ਰਹੇ ਹਾਂ",
  "settings.version.check": "ਅੱਪਡੇਟ ਦੇਖੋ",
  "settings.version.checking_title": "ਅੱਪਡੇਟ ਦੇਖ ਰਹੇ ਹਾਂ",
  "settings.version.up_to_date": "ਤੁਸੀਂ ਸਭ ਤੋਂ ਨਵੇਂ ਸੰਸਕਰਣ ’ਤੇ ਹੋ।",
  "settings.version.release_notes": "ਰਿਲੀਜ਼ ਨੋਟ ਦੇਖੋ",
  "settings.version.made_with": "ਬਣਾਇਆ ਗਿਆ",
  "settings.version.number": "ਸੰਸਕਰਣ {version}",
  "settings.version.update_to": "{version} ’ਤੇ ਅੱਪਡੇਟ ਕਰੋ",
  "settings.version.update_to_a11y": "ਸੰਸਕਰਣ {version} ’ਤੇ ਅੱਪਡੇਟ ਕਰੋ",
  "settings.version.released_under": "{license} ਹੇਠ ਜਾਰੀ",
  "settings.version.notes_a11y": "ਸੰਸਕਰਣ {version} ਲਈ ਰਿਲੀਜ਼ ਨੋਟ ਦੇਖੋ",
  "settings.version.tor_paused":
    "Tor ਚਾਲੂ ਹੋਣ ’ਤੇ ਅੱਪਡੇਟ ਦੀ ਜਾਂਚ ਰੁਕੀ ਰਹਿੰਦੀ ਹੈ, ਤਾਂ ਜੋ ਇਹ ਤੁਹਾਡਾ IP ਲੀਕ ਨਾ ਕਰੇ। ਰਿਲੀਜ਼ ਪੰਨਾ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਦੇਖੋ।",
  "settings.version.check_failed":
    "ਅੱਪਡੇਟ ਨਹੀਂ ਦੇਖੇ ਜਾ ਸਕੇ। ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਦੇਖੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "settings.version.downloading": "ਡਾਊਨਲੋਡ ਹੋ ਰਿਹਾ ਹੈ {percent}%",
  "settings.version.install": "ਇੰਸਟਾਲ ਕਰੋ",
  "settings.version.download_failed":
    "ਡਾਊਨਲੋਡ ਅਸਫਲ ਰਿਹਾ। ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} {size} KiB ਦੀ ਹੈ, {cap} KiB ਦੀ ਹੱਦ ਤੋਂ ਵੱਧ।",
  "transfer.failed.malformed":
    "ਇੱਕ ਅਟੈਚਮੈਂਟ ਖ਼ਰਾਬ ਹਾਲਤ ਵਿੱਚ ਪਹੁੰਚੀ ਅਤੇ ਖੋਲ੍ਹੀ ਨਹੀਂ ਜਾ ਸਕੀ। ਉਹਨਾਂ ਨੂੰ ਦੁਬਾਰਾ ਭੇਜਣ ਲਈ ਕਹੋ।",
  "transfer.failed.unsupported_type":
    "ਇੱਕ ਅਟੈਚਮੈਂਟ ਅਜਿਹੇ ਰੂਪ ਵਿੱਚ ਪਹੁੰਚੀ ਜੋ ਇਹ ਐਪ ਖੋਲ੍ਹ ਨਹੀਂ ਸਕਦੀ।",
  "transfer.failed.type_mismatch":
    "ਇੱਕ ਅਟੈਚਮੈਂਟ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ: ਇਸ ਦੀ ਸਮੱਗਰੀ ਉਸ ਫ਼ਾਈਲ ਕਿਸਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ ਜਿਸ ਦਾ ਇਸ ਨੇ ਦਾਅਵਾ ਕੀਤਾ ਸੀ।",
  "transfer.failed.storage":
    "ਇੱਕ ਅਟੈਚਮੈਂਟ ਪਹੁੰਚੀ ਪਰ ਸੰਭਾਲੀ ਨਹੀਂ ਜਾ ਸਕੀ। ਆਪਣੀ ਖ਼ਾਲੀ ਥਾਂ ਦੇਖੋ।",
  "transfer.badge.waiting": "ਉਡੀਕ ਵਿੱਚ · {name}",
  "transfer.badge.active_count": "{count} ਤਬਾਦਲੇ",
  "transfer.badge.sending": "{name} ਭੇਜ ਰਹੇ ਹਾਂ",
  "transfer.badge.receiving": "{name} ਲੈ ਰਹੇ ਹਾਂ",
  "transfer.badge.a11y": "{label}, {percent} ਫ਼ੀਸਦੀ। ਗੱਲਬਾਤ ਖੋਲ੍ਹੋ।",
  "transfer.kind.photo": "ਫ਼ੋਟੋ",
  "transfer.kind.video": "ਵੀਡੀਓ",
  "transfer.kind.voice": "ਵੌਇਸ ਨੋਟ",
  "transfer.this.photo": "ਇਹ ਫ਼ੋਟੋ",
  "transfer.this.video": "ਇਹ ਵੀਡੀਓ",
  "transfer.this.voice": "ਇਹ ਵੌਇਸ ਨੋਟ",
  "transfer.this.file": "ਇਹ ਫ਼ਾਈਲ",
  "transfer.kind.document": "ਦਸਤਾਵੇਜ਼",
  "transfer.kind.voice_preview": "ਵੌਇਸ ਨੋਟ",
  "transfer.kind.photo_preview": "ਫ਼ੋਟੋ",
  "transfer.kind.video_preview": "ਵੀਡੀਓ",
  "transfer.kind.document_preview": "ਦਸਤਾਵੇਜ਼",

  // ---- System notifications ----
  "notif.channel.messages": "ਸੁਨੇਹੇ",
  "notif.channel.nearby": "ਨੇੜਲੇ ਪੀਅਰ",
  "notif.channel.nearby_desc":
    "ਜਦੋਂ ਮੈਸ਼ ਨੂੰ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਲੋਕ ਮਿਲਦੇ ਹਨ ਤਾਂ ਕਦੇ-ਕਦਾਈਂ ਇੱਕ ਸੂਚਨਾ।",
  "notif.nearby.body": "ਹੁਣ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਵਿੱਚ। ਮੈਸ਼ ਖੋਲ੍ਹਣ ਲਈ ਦਬਾਓ।",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "ਕੋਈ",
  "notif.notice_urgent": "ਜ਼ਰੂਰੀ ਨੋਟਿਸ · {content}",
  "notif.notice": "ਨੋਟਿਸ · {content}",
  "notif.incoming_file": "ਆ ਰਹੀ ਫ਼ਾਈਲ",
  "notif.preview.photo": "📷 ਫ਼ੋਟੋ",
  "notif.preview.voice": "🎤 ਆਵਾਜ਼ੀ ਸੁਨੇਹਾ",
  "notif.preview.video": "🎥 ਵੀਡੀਓ",
  "notif.preview.document": "📄 ਦਸਤਾਵੇਜ਼",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "ਨਵਾਂ ਸੁਨੇਹਾ",
  "notif.hidden.channel": "ਨਵੀਂ ਸਰਗਰਮੀ",
  "notif.hidden.mention": "ਤੁਹਾਡਾ ਜ਼ਿਕਰ ਹੋਇਆ",
  "notif.mention.title": "{sender} ਨੇ ਤੁਹਾਡਾ ਜ਼ਿਕਰ ਕੀਤਾ",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "{count} ਹੋਰ ਦਿਖਾਓ",
    other: "{count} ਹੋਰ ਦਿਖਾਓ",
  },
  "chat.channels.show_more_a11y": {
    one: "{count} ਹੋਰ ਮੂਲ ਚੈਨਲ ਦਿਖਾਓ",
    other: "{count} ਹੋਰ ਮੂਲ ਚੈਨਲ ਦਿਖਾਓ",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} ਅਣਪੜ੍ਹਿਆ",
    other: "{label}, {count} ਅਣਪੜ੍ਹੇ",
  },
  "a11y.new_count": {
    one: "{label}, {count} ਨਵਾਂ",
    other: "{label}, {count} ਨਵੇਂ",
  },
  "chat.a11y.unread": {
    one: "{count} ਅਣਪੜ੍ਹਿਆ",
    other: "{count} ਅਣਪੜ੍ਹੇ",
  },
  "chat.thread.length_left": {
    one: "{count} ਬਾਕੀ",
    other: "{count} ਬਾਕੀ",
  },
  "settings.general.retention_days": {
    one: "{count} ਦਿਨ",
    other: "{count} ਦਿਨ",
  },
  "chat.info.group_reach": {
    one: "{count} ਮੈਂਬਰ ਵਿੱਚੋਂ {reachable} ਤੱਕ ਪਹੁੰਚ",
    other: "{count} ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ {reachable} ਤੱਕ ਪਹੁੰਚ",
  },
  "chat.group_members": {
    one: "ਨਿੱਜੀ ਗਰੁੱਪ  ·  {count} ਮੈਂਬਰ",
    other: "ਨਿੱਜੀ ਗਰੁੱਪ  ·  {count} ਮੈਂਬਰ",
  },
  "chat.select.count": {
    one: "{count} ਚੁਣਿਆ",
    other: "{count} ਚੁਣੇ",
  },
  "chat.select.forward": {
    one: "{count} ਸੁਨੇਹਾ ਅੱਗੇ ਭੇਜੋ",
    other: "{count} ਸੁਨੇਹੇ ਅੱਗੇ ਭੇਜੋ",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} ਬੋਲ ਰਿਹਾ ਹੈ",
    other: "{count} ਬੋਲ ਰਹੇ ਹਨ",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} ਪੀਅਰ ਪਹੁੰਚ ਵਿੱਚ",
    other: "{count} ਪੀਅਰ ਪਹੁੰਚ ਵਿੱਚ",
  },
  "mesh.peer.hops_away": {
    one: "{count} ਹੌਪ ਦੂਰ",
    other: "{count} ਹੌਪ ਦੂਰ",
  },
  "chat.presence.active": {
    one: "{count} ਸਰਗਰਮ",
    other: "{count} ਸਰਗਰਮ",
  },
  "chat.presence.nearby": {
    one: "{count} ਨੇੜੇ",
    other: "{count} ਨੇੜੇ",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} ਮਿੰਟ",
    other: "{count} ਮਿੰਟ",
  },
  "wallet.mint.remove_body": {
    one: "{mint} ਕੋਲ {count} ਪਰੂਫ਼ ਵਿੱਚ {balance} {unit} ਹਨ। ਇਸ ਨੂੰ ਹਟਾਉਣ ਨਾਲ ਉਹ ਪਰੂਫ਼ ਇਸ ਡੀਵਾਈਸ ਤੋਂ ਪੱਕੇ ਤੌਰ ’ਤੇ ਮਿਟ ਜਾਂਦਾ ਹੈ, ਅਤੇ ਕਿਸੇ ਕਾਪੀ ਕੋਲ ਉਹ ਨਹੀਂ ਹੈ। ਪਹਿਲਾਂ ਆਪਣਾ ਬੈਲੰਸ ਕਢਵਾਓ ਜਾਂ ਭੇਜੋ।",
    other:
      "{mint} ਕੋਲ {count} ਪਰੂਫ਼ਾਂ ਵਿੱਚ {balance} {unit} ਹਨ। ਇਸ ਨੂੰ ਹਟਾਉਣ ਨਾਲ ਉਹ ਪਰੂਫ਼ ਇਸ ਡੀਵਾਈਸ ਤੋਂ ਪੱਕੇ ਤੌਰ ’ਤੇ ਮਿਟ ਜਾਂਦੇ ਹਨ, ਅਤੇ ਕਿਸੇ ਕਾਪੀ ਕੋਲ ਉਹ ਨਹੀਂ ਹਨ। ਪਹਿਲਾਂ ਆਪਣਾ ਬੈਲੰਸ ਕਢਵਾਓ ਜਾਂ ਭੇਜੋ।",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} ਜਮ੍ਹਾਂ ਭੁਗਤਾਨ ਦੀ ਉਡੀਕ ਵਿੱਚ ਹੈ। ਹਰ ਵਾਰ ਐਪ ਖੁੱਲ੍ਹਣ ’ਤੇ ਦੁਬਾਰਾ ਦੇਖਿਆ ਜਾਂਦਾ ਹੈ।",
    other:
      "{count} ਜਮ੍ਹਾਂ ਭੁਗਤਾਨ ਦੀ ਉਡੀਕ ਵਿੱਚ ਹਨ। ਹਰ ਵਾਰ ਐਪ ਖੁੱਲ੍ਹਣ ’ਤੇ ਦੁਬਾਰਾ ਦੇਖੇ ਜਾਂਦੇ ਹਨ।",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints} ਵਿੱਚੋਂ {count} ਅਣਖ਼ਰਚਿਆ ਪਰੂਫ਼ ਵਾਪਸ ਮਿਲਿਆ।",
    other: "{mints} ਵਿੱਚੋਂ {count} ਅਣਖ਼ਰਚੇ ਪਰੂਫ਼ ਵਾਪਸ ਮਿਲੇ।",
  },
  "wallet.backup.already_spent": {
    one: "{count} ਸਿੱਕਾ ਮਿਲਿਆ, ਪਰ ਉਹ ਪਹਿਲਾਂ ਹੀ ਖ਼ਰਚਿਆ ਜਾ ਚੁੱਕਾ ਸੀ, ਇਸ ਲਈ ਉਸ ਲਈ ਕੁਝ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ। ਇਹ ਆਮ ਗੱਲ ਹੈ: ਤੁਹਾਡਾ ਖ਼ਰਚਿਆ ਹਰ ਸਿੱਕਾ ਮਿੰਟ ਦੇ ਰੱਖੇ ਰਿਕਾਰਡ ਵਿੱਚ ਰਹਿੰਦਾ ਹੈ।",
    other:
      "{count} ਸਿੱਕੇ ਮਿਲੇ, ਪਰ ਉਹ ਪਹਿਲਾਂ ਹੀ ਖ਼ਰਚੇ ਜਾ ਚੁੱਕੇ ਸਨ, ਇਸ ਲਈ ਉਹਨਾਂ ਲਈ ਕੁਝ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ। ਇਹ ਆਮ ਗੱਲ ਹੈ: ਤੁਹਾਡਾ ਖ਼ਰਚਿਆ ਹਰ ਸਿੱਕਾ ਮਿੰਟ ਦੇ ਰੱਖੇ ਰਿਕਾਰਡ ਵਿੱਚ ਰਹਿੰਦਾ ਹੈ।",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "{count} ਹੋਰ ਦਿਖਾਓ",
    other: "{count} ਹੋਰ ਦਿਖਾਓ",
  },
  "wallet.activity.show_more_a11y": {
    one: "{count} ਹੋਰ ਭੁਗਤਾਨ ਦਿਖਾਓ",
    other: "{count} ਹੋਰ ਭੁਗਤਾਨ ਦਿਖਾਓ",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} ਅਪੁਸ਼ਟ",
    other: "{count} ਅਪੁਸ਼ਟ",
  },
  "wallet.proof_count": {
    one: "{count} ਪਰੂਫ਼",
    other: "{count} ਪਰੂਫ਼",
  },
  "wallet.spent_removed_detail": {
    one: "{count} ਪਰੂਫ਼ ਪਹਿਲਾਂ ਹੀ ਖ਼ਰਚਿਆ ਜਾ ਚੁੱਕਾ ਸੀ, ਇਸ ਲਈ ਉਹ ਹਟਾ ਦਿੱਤਾ ਗਿਆ।",
    other: "{count} ਪਰੂਫ਼ ਪਹਿਲਾਂ ਹੀ ਖ਼ਰਚੇ ਜਾ ਚੁੱਕੇ ਸਨ, ਇਸ ਲਈ ਉਹ ਹਟਾ ਦਿੱਤੇ ਗਏ।",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "ਕੋਈ ਨੇੜੇ ਹੈ",
    other: "{count} ਲੋਕ ਨੇੜੇ ਹਨ",
  },
};

export const pa = { strings, plurals };
