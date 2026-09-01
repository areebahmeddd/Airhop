import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਵਾਪਸ",
  "common.last_updated": "ਆਖ਼ਰੀ ਵਾਰ ਬਦਲਿਆ: {date}",

  "nav.aria": "ਮੁੱਖ",
  "nav.home": "Airhop ਮੁੱਖ ਪੰਨਾ",
  "nav.skip": "ਸਮੱਗਰੀ ’ਤੇ ਜਾਓ",
  "nav.menu.open": "ਮੇਨੂ ਖੋਲ੍ਹੋ",
  "nav.menu.close": "ਮੇਨੂ ਬੰਦ ਕਰੋ",
  "nav.how_it_works": "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
  "nav.architecture": "ਬਣਤਰ",
  "nav.faq": "ਅਕਸਰ ਪੁੱਛੇ ਸਵਾਲ",

  "footer.aria": "ਪੈਰ",
  "footer.tagline": "ਨਿੱਜੀ ਮੈਸ਼ ਸੰਚਾਰ",
  "footer.credit": "© {author} ਵੱਲੋਂ {heart} ਨਾਲ ਬਣਾਇਆ",
  "footer.group.download": "ਡਾਊਨਲੋਡ",
  "footer.group.resources": "ਸਾਧਨ",
  "footer.group.social": "ਸਮਾਜਿਕ",
  "footer.group.legal": "ਕਾਨੂੰਨੀ",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "ਬਣਤਰ",
  "footer.link.blogs": "ਬਲੌਗ",
  "footer.link.faq": "ਅਕਸਰ ਪੁੱਛੇ ਸਵਾਲ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",
  "footer.link.privacy": "ਨਿੱਜਤਾ ਨੀਤੀ",
  "footer.link.license": "ਪ੍ਰੋਜੈਕਟ ਦਾ ਲਾਇਸੰਸ",

  "settings.theme.group": "ਰੰਗ ਥੀਮ",
  "settings.theme.light": "ਹਲਕਾ ਥੀਮ",
  "settings.theme.dark": "ਗੂੜ੍ਹਾ ਥੀਮ",
  "settings.language.label": "ਭਾਸ਼ਾ",
  "settings.language.suggestion": "ਇਹ ਪੰਨਾ ਪੰਜਾਬੀ ਵਿੱਚ ਦੇਖੋ",
  "settings.language.dismiss": "ਹਟਾਓ",

  "home.hero.release": "ਸਭ ਤੋਂ ਨਵੀਂ ਰਿਲੀਜ਼",
  "home.hero.title": "ਸੁਨੇਹੇ ਜੋ ਇੰਟਰਨੈੱਟ ਤੋਂ ਬਿਨਾਂ ਚੱਲਦੇ ਹਨ।",
  "home.hero.body":
    "ਨੇੜਲੇ ਫ਼ੋਨ ਬਲੂਟੁੱਥ ਮੈਸ਼ ਬਣਾਉਂਦੇ ਹਨ ਅਤੇ ਤੁਹਾਡੇ ਸੁਨੇਹੇ ਸੱਤ ਹੌਪ ਤੱਕ ਅੱਗੇ ਪਹੁੰਚਾਉਂਦੇ ਹਨ, ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ। {no_servers}, {no_accounts}, {no_tracking}।",
  "home.hero.body.no_servers": "ਕੋਈ ਸਰਵਰ ਨਹੀਂ",
  "home.hero.body.no_accounts": "ਕੋਈ ਖਾਤਾ ਨਹੀਂ",
  "home.hero.body.no_tracking": "ਕੋਈ ਪਿੱਛਾ ਨਹੀਂ",
  "home.hero.download": "ਐਪ ਡਾਊਨਲੋਡ ਕਰੋ",
  "home.hero.badges": "MIT ਲਾਇਸੰਸ · ਮੁਫ਼ਤ ਅਤੇ ਖੁੱਲ੍ਹਾ ਸਰੋਤ · bitchat ਨਾਲ ਚੱਲਦਾ ਹੈ",
  "home.hero.group.mobile": "ਮੋਬਾਈਲ",
  "home.hero.group.desktop": "ਡੈਸਕਟਾਪ",
  "home.hero.option.f_droid": "ਖੁੱਲ੍ਹੇ ਸਰੋਤ ਦਾ ਕੈਟਾਲਾਗ",
  "home.hero.option.apk": "ਸਿੱਧਾ ਡਾਊਨਲੋਡ",
  "home.hero.option.soon": "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",

  "home.about.eyebrow": "Airhop ਕੀ ਹੈ",
  "home.about.title": "ਜ਼ਿਆਦਾਤਰ ਐਪਾਂ ਕਿਸੇ ਕੇਂਦਰੀ ਸਰਵਰ ’ਤੇ ਨਿਰਭਰ ਹੁੰਦੀਆਂ ਹਨ।",
  "home.about.sub":
    "ਸਰਵਰ ’ਤੇ ਨਜ਼ਰ ਰੱਖੀ ਜਾ ਸਕਦੀ ਹੈ, ਉਸ ਨੂੰ ਬੰਦ ਜਾਂ ਬਲਾਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ। Airhop ਕੋਲ ਕੋਈ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਨਾ ਕੋਈ ਕੰਪਨੀ ਹੈ ਜਿਸ ’ਤੇ ਦਬਾਅ ਪਵੇ, ਨਾ ਕੋਈ ਸੇਵਾ ਜੋ ਬੰਦ ਕੀਤੀ ਜਾਵੇ।",
  "home.about.card": "ਤਕਨੀਕੀ ਝਲਕ",
  "home.about.link.mesh": "ਬਲੂਟੁੱਥ ਲੋਅ ਐਨਰਜੀ ਮੈਸ਼",
  "home.about.link.wire_protocol": "ਵਾਇਰ ਪ੍ਰੋਟੋਕੋਲ",
  "home.about.body.built":
    "Airhop iOS ਅਤੇ Android ਲਈ ਖੁੱਲ੍ਹੇ ਸਰੋਤ ਵਾਲੀ ਐਪ ਹੈ, ਜੋ {mesh} ’ਤੇ ਨਿੱਜੀ ਪੀਅਰ-ਤੋਂ-ਪੀਅਰ ਸੁਨੇਹਿਆਂ ਲਈ ਬਣੀ ਹੈ। ਇਹ {bitchat} ਦੀ ਨੀਂਹ ’ਤੇ ਬਣਾਈ ਗਈ ਹੈ, ਉਸ ਦਾ {wire_protocol} ਅਤੇ ਸੁਰੱਖਿਆ ਢਾਂਚਾ ਦੁਬਾਰਾ ਵਰਤਦੀ ਹੈ, ਅਤੇ ਫਿਰ ਉਸ ਨੂੰ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ {ecash} ਭੁਗਤਾਨ ਅਤੇ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ AI ਨਾਲ ਅੱਗੇ ਵਧਾਉਂਦੀ ਹੈ। ਇਹ ਬਿਲਕੁਲ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਦੇ ਚੱਲਦੀ ਹੈ, ਅਤੇ ਸੁਨੇਹੇ ਨੇੜਲੇ ਡੀਵਾਈਸਾਂ ਵਿੱਚੋਂ ਆਪੇ ਅੱਗੇ ਲੰਘਦੇ ਹਨ (ਅੰਦਰ ਹਰ ਹੌਪ ’ਤੇ ਲਗਭਗ 10 ਤੋਂ 30 ਮੀਟਰ, ਖੁੱਲ੍ਹੇ ਵਿੱਚ ਹੋਰ ਵੀ ਵੱਧ), 7 ਹੌਪ ਤੱਕ।",
  "home.about.body.identity":
    "ਤੁਹਾਡੀ ਪਛਾਣ ਇੱਕ {ed25519} ਕੁੰਜੀ ਜੋੜਾ ਹੈ, ਜੋ ਤੁਹਾਡੇ ਡੀਵਾਈਸ ’ਤੇ ਹੀ ਬਣਦਾ ਹੈ ਅਤੇ {ios_keychain} ਜਾਂ {android_keystore} ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਨਾ ਕੋਈ ਖਾਤਾ ਹੈ, ਨਾ ਕੋਈ ਰਜਿਸਟਰੇਸ਼ਨ, ਅਤੇ ਨਾ ਹੀ ਕੁਝ ਅਜਿਹਾ ਜੋ ਕਿਸੇ ਸਰਵਰ ਨੂੰ ਛੂਹੇ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਅਜਿਹੀ ਵਰਤ-ਸੁੱਟ ਐਪ ਵਾਂਗ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ ਜੋ ਮਿਟਾਉਣ ਤੋਂ ਬਾਅਦ ਤੁਹਾਡੇ ਨਾਲ ਜੁੜਦਾ ਕੁਝ ਵੀ ਪਿੱਛੇ ਨਹੀਂ ਛੱਡਦੀ।",
  "home.about.body.crypto":
    "ਹਰ ਸੈਸ਼ਨ ਪ੍ਰਮਾਣਿਤ ਹੈਂਡਸ਼ੇਕ ਲਈ {noise} ਪ੍ਰੋਟੋਕੋਲ ਵਰਤਦਾ ਹੈ। ਸੰਭਾਲੇ ਸੁਨੇਹੇ {ratchet} ਐਲਗੋਰਿਦਮ ਵਰਤਦੇ ਹਨ, ਇਸ ਲਈ ਜੇ ਬਾਅਦ ਵਿੱਚ ਤੁਹਾਡਾ ਡੀਵਾਈਸ ਕਿਸੇ ਹੋਰ ਦੇ ਹੱਥ ਲੱਗ ਵੀ ਜਾਵੇ ਤਾਂ ਤੁਹਾਡੇ ਪੁਰਾਣੇ ਸੁਨੇਹੇ ਅਣਪੜ੍ਹੇ ਹੀ ਰਹਿੰਦੇ ਹਨ। ਸੰਕਟ ਸਫ਼ਾਈ ਇੱਕ ਸਕਿੰਟ ਤੋਂ ਵੀ ਘੱਟ ਵਿੱਚ ਸਾਰੀਆਂ ਕੁੰਜੀਆਂ ਅਤੇ ਸੁਨੇਹੇ ਤਬਾਹ ਕਰ ਦਿੰਦੀ ਹੈ।",
  "home.about.body.internet":
    "ਜਦੋਂ ਤੁਸੀਂ ਅਤੇ ਕੋਈ ਸੰਪਰਕ ਬਲੂਟੁੱਥ ਦੀ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਹੋਵੋ, ਤਾਂ {nostr} ਰਿਲੇ ਇੰਟਰਨੈੱਟ ਪੁਲ ਦਾ ਕੰਮ ਕਰਦੇ ਹਨ, {nip17} ਵਾਂਗ ਲਪੇਟੇ ਸਿੱਧੇ ਸੁਨੇਹਿਆਂ ਨਾਲ, ਇਸ ਲਈ ਜਦੋਂ ਵੀ ਤੁਸੀਂ ਦੋਵੇਂ ਆਨਲਾਈਨ ਹੋਵੋ ਮੈਸ਼ ਦੁਨੀਆ ਭਰ ਤੱਕ ਫੈਲ ਜਾਂਦਾ ਹੈ। {tor} ਦਾ ਸਮਰਥਨ iOS ਅਤੇ Android ਦੋਵਾਂ ’ਤੇ {arti} ਰਾਹੀਂ ਮੌਜੂਦ ਹੈ।",
  "home.about.optional.title": "Airhop ਵਿੱਚ ਕੁਝ ਵਿਕਲਪਿਕ ਸਹੂਲਤਾਂ ਹਨ ਜੋ ਤੁਸੀਂ ਚਾਲੂ ਕਰ ਸਕਦੇ ਹੋ:",
  "home.about.optional.payments.label": "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਭੁਗਤਾਨ:",
  "home.about.optional.payments.body":
    "{cashu} ਪ੍ਰੋਟੋਕੋਲ ਨਾਲ ਮੈਸ਼ ’ਤੇ ਭੁਗਤਾਨ ਭੇਜੋ ਅਤੇ ਲਵੋ (ਸਿਰਫ਼ Bitcoin)।",
  "home.about.optional.ai.label": "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ AI:",
  "home.about.optional.ai.body":
    "ਡੀਵਾਈਸ ’ਤੇ ਹੀ ਚੱਲਦਾ ਇੱਕ ਛੋਟਾ AI ਸਹਾਇਕ, ਜੋ ਜ਼ਰੂਰੀ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹੈ। ਸਾਰੀ ਪ੍ਰਕਿਰਿਆ ਅਤੇ ਡਾਟਾ ਤੁਹਾਡੇ ਡੀਵਾਈਸ ’ਤੇ ਹੀ ਰਹਿੰਦਾ ਹੈ।",
  "home.about.body.compatible":
    "Airhop ਪ੍ਰੋਟੋਕੋਲ ਦੇ ਪੱਧਰ ’ਤੇ bitchat ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। ਇੱਕੋ ਮੈਸ਼ ’ਤੇ ਪਿਆ Airhop ਡੀਵਾਈਸ ਅਤੇ bitchat ਡੀਵਾਈਸ ਇੱਕ ਦੂਜੇ ਨੂੰ ਆਪੇ ਲੱਭ ਲੈਂਦੇ ਹਨ ਅਤੇ ਬਿਨਾਂ ਕਿਸੇ ਸੈਟਿੰਗ ਦੇ ਸੁਨੇਹੇ ਤੇ ਸਿੱਧੇ ਸੁਨੇਹੇ ਵਟਾ ਸਕਦੇ ਹਨ।",

  "home.situations.eyebrow": "ਜਦੋਂ ਲੋੜ ਪਵੇ",
  "home.situations.title": "ਉਸ ਦਿਨ ਲਈ ਜਦੋਂ ਨੈੱਟਵਰਕ ਬੈਠ ਜਾਂਦਾ ਹੈ।",
  "home.situations.sub":
    "ਕੁਦਰਤੀ ਆਫ਼ਤਾਂ, ਇੰਟਰਨੈੱਟ ਬੰਦ, ਵੱਡੇ ਮੁਜ਼ਾਹਰੇ, ਜਾਂ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਬਿਤਾਇਆ ਇੱਕ ਆਮ ਵੀਕਐਂਡ।",
  "home.situations.disaster.label": "ਆਫ਼ਤ",
  "home.situations.disaster.line":
    "ਟਾਵਰ ਬੈਠ ਗਏ ਹਨ। ਬੋਰਡ ’ਤੇ ਲੱਗਾ ਨੋਟਿਸ ਹਰ ਲੰਘਣ ਵਾਲੇ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ।",
  "home.situations.offgrid.label": "ਗਰਿੱਡ ਤੋਂ ਬਾਹਰ",
  "home.situations.offgrid.line": "ਰਾਹ ’ਤੇ ਦੋ ਦਿਨ ਹੋ ਗਏ। ਆਖ਼ਰੀ ਡੰਡੀ ਕੱਲ੍ਹ ਗ਼ਾਇਬ ਹੋ ਗਈ ਸੀ।",
  "home.situations.protest.label": "ਮੁਜ਼ਾਹਰਾ",
  "home.situations.protest.line": "ਇਸ਼ਤਿਹਾਰ ’ਤੇ ਛਪਿਆ QR ਕੋਡ ਮਾਰਚ ਲਈ ਇਨਕ੍ਰਿਪਟਡ ਚੈਨਲ ਖੋਲ੍ਹ ਦਿੰਦਾ ਹੈ।",
  "home.situations.festival.label": "ਮੇਲਾ",
  "home.situations.festival.line":
    "ਮੈਦਾਨ ਵਿੱਚ ਕੋਈ ਸਿਗਨਲ ਨਹੀਂ। ਸੁਨੇਹੇ ਓਪਰੇ ਲੋਕਾਂ ਦੇ ਫ਼ੋਨਾਂ ਵਿੱਚੋਂ ਲੰਘ ਜਾਂਦੇ ਹਨ।",

  "home.showcase.eyebrow": "ਐਪ ਦੇਖੋ",
  "home.showcase.title": "ਇੱਕ ਆਮ ਮੈਸੰਜਰ, ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ।",
  "home.showcase.sub":
    "ਗੱਲਬਾਤਾਂ, ਚੈਨਲ, ਇੱਕ ਵਾਲਿਟ ਅਤੇ ਇੱਕ ਪਛਾਣ। ਉੱਪਰੋਂ ਜਾਣਿਆ-ਪਛਾਣਿਆ, ਹੇਠਾਂ ਕੰਮ ਕਰਦਾ ਇੱਕ ਮੈਸ਼।",
  "home.showcase.mesh.title": "ਮੈਸ਼",
  "home.showcase.mesh.caption":
    "ਪਹੁੰਚ ਵਿਚਲੇ ਸਾਰੇ, ਜਿੰਨੇ ਨੇੜੇ ਹਨ ਉਸੇ ਹਿਸਾਬ ਨਾਲ ਰੱਖੇ। ਕਿਸੇ ਨੂੰ ਪਹਿਲਾਂ ਜੋੜਨ ਦੀ ਲੋੜ ਨਹੀਂ।",
  "home.showcase.mesh.alt":
    "Airhop ਐਪ ਦੀ ਮੈਸ਼ ਸਕ੍ਰੀਨ, ਜਿਸ ਵਿੱਚ ਚਾਰ ਨੇੜਲੇ ਪੀਅਰ ਸਿਗਨਲ ਦੀ ਤਾਕਤ ਮੁਤਾਬਕ ਰਡਾਰ ’ਤੇ ਰੱਖੇ ਹੋਏ ਹਨ।",
  "home.showcase.chats.title": "ਗੱਲਬਾਤਾਂ",
  "home.showcase.chats.caption":
    "ਆਮ ਗੱਲਾਂ-ਬਾਤਾਂ। ਜੋ ਫ਼ੋਨ ਹਰ ਸੁਨੇਹਾ ਅੱਗੇ ਲੰਘਾਉਂਦੇ ਹਨ, ਉਹ ਉਸ ਨੂੰ ਖੋਲ੍ਹ ਨਹੀਂ ਸਕਦੇ।",
  "home.showcase.chats.alt":
    "ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਦੌਰਾਨ Airhop ਵਿੱਚ ਇੱਕ ਸਿੱਧੇ ਸੁਨੇਹੇ ਦੀ ਗੱਲਬਾਤ, ਤਿੰਨ ਫ਼ੋਨਾਂ ਰਾਹੀਂ ਪਹੁੰਚਾਈ ਗਈ।",
  "home.showcase.channels.title": "ਚੈਨਲ",
  "home.showcase.channels.caption":
    "ਜਨਤਕ ਕਮਰੇ, ਇੱਕ ਬਲਾਕ ਜਿੰਨੇ ਛੋਟੇ ਜਾਂ ਇੱਕ ਖੇਤਰ ਜਿੰਨੇ ਵੱਡੇ, ਉੱਥੇ ਮੌਜੂਦ ਹਰ ਕਿਸੇ ਲਈ ਖੁੱਲ੍ਹੇ।",
  "home.showcase.channels.alt":
    "Airhop ਐਪ ਦੀ ਗੱਲਬਾਤ ਸਕ੍ਰੀਨ, ਜਿਸ ਵਿੱਚ ਬਲਾਕ, ਮੁਹੱਲੇ, ਸ਼ਹਿਰ ਅਤੇ ਖੇਤਰ ਦੇ ਜਨਤਕ ਚੈਨਲ ਦਿੱਸਦੇ ਹਨ।",
  "home.showcase.wallet.title": "ਵਾਲਿਟ",
  "home.showcase.wallet.caption":
    "ਆਪਣੇ ਨਾਲ ਖੜ੍ਹੇ ਬੰਦੇ ਨੂੰ ਬਲੂਟੁੱਥ ’ਤੇ ecash ਫੜਾਓ, ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਫ਼ੋਨ ਆਨਲਾਈਨ ਨਾ ਹੋਵੇ ਤਾਂ ਵੀ।",
  "home.showcase.wallet.alt":
    "Airhop ਐਪ ਦੀ ਵਾਲਿਟ ਸਕ੍ਰੀਨ, ਜਿਸ ਵਿੱਚ ਬਲੂਟੁੱਥ ’ਤੇ ਭੇਜਿਆ ਜਾ ਸਕਣ ਵਾਲਾ ecash ਬੈਲੰਸ ਦਿੱਸਦਾ ਹੈ।",
  "home.showcase.identity.title": "ਪਛਾਣ",
  "home.showcase.identity.caption":
    "ਨਾ ਸਾਈਨ ਅੱਪ, ਨਾ ਫ਼ੋਨ ਨੰਬਰ, ਨਾ ਈਮੇਲ। ਬੱਸ ਇੱਕ ਕੁੰਜੀ ਜੋ ਇਹ ਫ਼ੋਨ ਕਦੇ ਨਹੀਂ ਛੱਡਦੀ।",
  "home.showcase.identity.alt":
    "Airhop ਐਪ ਦੀ ਪ੍ਰੋਫ਼ਾਈਲ ਸਕ੍ਰੀਨ, ਜਿਸ ਵਿੱਚ ਬਿਨਾਂ ਖਾਤੇ ਦੇ ਡੀਵਾਈਸ ’ਤੇ ਬਣੀ ਪਛਾਣ ਦਿੱਸਦੀ ਹੈ।",

  "home.how.eyebrow": "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
  "home.how.title": "ਮੈਸ਼ ਆਪੇ ਬਣ ਜਾਂਦਾ ਹੈ।",
  "home.how.sub":
    "ਨੇੜਲੇ ਨੋਡ ਬਲੂਟੁੱਥ ’ਤੇ ਆਪਣੇ ਆਪ ਨੂੰ ਸੰਭਾਲਣ ਵਾਲਾ ਮੈਸ਼ ਬਣਾ ਲੈਂਦੇ ਹਨ। ਜਦੋਂ ਇੰਟਰਨੈੱਟ ਹੋਵੇ ਤਾਂ Nostr ਰਿਲੇ ਇਸ ਨੂੰ ਹੋਰ ਅੱਗੇ ਵਧਾ ਦਿੰਦੇ ਹਨ, ਬਿਨਾਂ ਕਿਸੇ ਅਜਿਹੇ ਢਾਂਚੇ ਦੇ ਜੋ ਕਿਸੇ ਦੇ ਕਾਬੂ ਹੇਠ ਹੋਵੇ।",
  "home.how.cta": "ਪੂਰੀ ਬਣਤਰ ਪੜ੍ਹੋ",
  "home.how.discover.title": "ਲੱਭਣਾ",
  "home.how.discover.line":
    "Airhop ਜਾਂ bitchat ਚਲਾਉਂਦੇ ਫ਼ੋਨ ਬਲੂਟੁੱਥ ’ਤੇ ਇੱਕ ਦੂਜੇ ਨੂੰ ਆਪੇ ਲੱਭ ਲੈਂਦੇ ਹਨ। ਨਾ ਪੇਅਰਿੰਗ, ਨਾ ਸੈਟਅੱਪ।",
  "home.how.relay.title": "ਅੱਗੇ ਲੰਘਾਉਣਾ",
  "home.how.relay.line":
    "ਸੁਨੇਹਾ ਫ਼ੋਨ ਤੋਂ ਫ਼ੋਨ ਟੱਪਦਾ ਹੈ, ਸੱਤ ਹੌਪ ਤੱਕ। ਵਿਚਲੇ ਫ਼ੋਨ ਕਦੇ ਨਹੀਂ ਦੇਖਦੇ ਕਿ ਉਹ ਕੀ ਲੈ ਕੇ ਜਾ ਰਹੇ ਹਨ।",
  "home.how.reach.title": "ਹੋਰ ਦੂਰ ਪਹੁੰਚਣਾ",
  "home.how.reach.line":
    "ਜਦੋਂ ਇੰਟਰਨੈੱਟ ਹੋਵੇ ਤਾਂ Nostr ਰਿਲੇ ਉਹੀ ਗੱਲਬਾਤ ਹੋਰ ਦੂਰ ਲੈ ਜਾਂਦੇ ਹਨ, ਚਾਹੋ ਤਾਂ Tor ਦੇ ਰਾਹੀਂ।",
  "home.how.swipe": "ਦੇਖਣ ਲਈ ਸਵਾਈਪ ਕਰੋ",
  "home.how.diagram": "BLE ਮੈਸ਼ · ਸਥਾਨਕ ਪੀਅਰ-ਤੋਂ-ਪੀਅਰ ਨੈੱਟਵਰਕ",
  "home.how.legend.node": "BLE ਮੈਸ਼ ਨੋਡ (ਆਫ਼ਲਾਈਨ)",
  "home.how.legend.relay": "ਕਈ-ਹੌਪ ਰਿਲੇ (Noise XX ਨਾਲ ਇਨਕ੍ਰਿਪਟਡ)",
  "home.how.legend.bitchat": "ਇੱਕੋ ਮੈਸ਼ ’ਤੇ bitchat ਨਾਲ ਮੇਲ ਖਾਂਦਾ",
  "home.how.legend.nostr": "Nostr ਪੁਲ (ਇੰਟਰਨੈੱਟ, ਜਦੋਂ ਆਨਲਾਈਨ ਹੋਵੋ)",

  "home.map.aria": "Nostr ਰਿਲੇ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਦੁਨੀਆ ਦਾ ਨਕਸ਼ਾ",
  "home.map.summary": "Nostr ਪੁਲ · ਦੁਨੀਆ ਭਰ ਵਿੱਚ {locations} ’ਤੇ {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "ਇਹ ਕੀ ਕਰਦਾ ਹੈ",
  "home.features.title": "ਸੱਚੀਓਂ ਦਾ ਮੈਸੰਜਰ, ਕੋਈ ਨਮੂਨਾ ਨਹੀਂ।",
  "home.features.sub":
    "ਗੱਲਬਾਤ, ਪਛਾਣ, ਨੈੱਟਵਰਕ ਅਤੇ ਪੈਸਾ। ਸਭ ਕੁਝ ਇਸ ਤਰ੍ਹਾਂ ਬਣਾਇਆ ਗਿਆ ਹੈ ਕਿ ਬਿਨਾਂ ਸਿਗਨਲ, ਬਿਨਾਂ ਖਾਤੇ ਅਤੇ ਵਿਚਕਾਰ ਕਿਸੇ ਤੋਂ ਬਿਨਾਂ ਚੱਲੇ।",

  "home.features.messaging.title": "ਸੁਨੇਹੇ",
  "home.features.messaging.summary": "ਜੋ ਕੁਝ ਇੱਕ ਮੈਸੰਜਰ ਕੋਲ ਹੁੰਦਾ ਹੈ, ਪਿੱਛੇ ਸਿਫ਼ਰ ਢਾਂਚੇ ਨਾਲ।",
  "home.features.messaging.dms.name": "ਨਿੱਜੀ ਸਿੱਧੇ ਸੁਨੇਹੇ",
  "home.features.messaging.dms.line":
    "ਸਿਰੇ ਤੋਂ ਸਿਰੇ ਤੱਕ ਇਨਕ੍ਰਿਪਟਡ, ਪਹੁੰਚਣ ਅਤੇ ਪੜ੍ਹੇ ਜਾਣ ਦੀ ਰਸੀਦ ਸਮੇਤ।",
  "home.features.messaging.location.name": "ਟਿਕਾਣਾ ਚੈਨਲ",
  "home.features.messaging.location.line":
    "ਕਿਸੇ ਥਾਂ ਨਾਲ ਬੱਝੇ ਕਮਰੇ, ਇੱਕ ਬਲਾਕ ਤੋਂ ਲੈ ਕੇ ਇੱਕ ਖੇਤਰ ਤੱਕ।",
  "home.features.messaging.groups.name": "ਨਿੱਜੀ ਚੈਨਲ ਅਤੇ ਗਰੁੱਪ",
  "home.features.messaging.groups.line": "ਕਮਰੇ ਲਈ ਸੱਦਾ ਲਿੰਕ, ਜਾਂ 16 ਤੱਕ ਦੀ ਦਸਤਖ਼ਤੀ ਸੂਚੀ।",
  "home.features.messaging.board.name": "ਸੂਚਨਾ ਪੱਟੀ",
  "home.features.messaging.board.line": "ਕਿਸੇ ਇਲਾਕੇ ਨਾਲ ਸੱਤ ਦਿਨ ਤੱਕ ਟੰਗੇ ਰਹਿੰਦੇ ਨੋਟਿਸ।",
  "home.features.messaging.voice.name": "ਸਿੱਧੀ ਆਵਾਜ਼",
  "home.features.messaging.voice.line":
    "ਮਾਈਕ ਦਬਾ ਕੇ ਰੱਖੋ ਅਤੇ ਪਹੁੰਚ ਵਿਚਲੇ ਕਿਸੇ ਨਾਲ ਵੀ ਗੱਲ ਕਰੋ, ਵਾਕੀ-ਟਾਕੀ ਵਾਂਗ।",
  "home.features.messaging.notes.name": "ਵੌਇਸ ਨੋਟ",
  "home.features.messaging.notes.line": "ਰਿਕਾਰਡ ਕੀਤੀ ਆਵਾਜ਼, ਰਾਹ ਲਿਖ ਕੇ ਦੱਸਣ ਨਾਲੋਂ ਤੇਜ਼।",
  "home.features.messaging.files.name": "ਫ਼ੋਟੋਆਂ, ਵੀਡੀਓ ਅਤੇ ਫ਼ਾਈਲਾਂ",
  "home.features.messaging.files.line": "ਕੋਈ ਵੀ ਰੂਪ, 1 MiB ਤੱਕ, ਬਿਨਾਂ ਸਿਗਨਲ ਦੇ।",
  "home.features.messaging.forward.name": "ਰੱਖੋ-ਅਤੇ-ਅੱਗੇ ਭੇਜੋ",
  "home.features.messaging.forward.line":
    "ਸੀਲ ਕਰ ਕੇ ਕਿਸੇ ਨੇੜਲੇ ਫ਼ੋਨ ਵੱਲੋਂ ਚੁੱਕਿਆ ਜਾਂਦਾ ਹੈ, ਜਦੋਂ ਤੱਕ ਉਹਨਾਂ ਤੱਕ ਨਾ ਪਹੁੰਚੇ।",

  "home.features.identity.title": "ਪਛਾਣ",
  "home.features.identity.summary": "ਰਜਿਸਟਰ ਕਰਨ ਨੂੰ ਕੁਝ ਨਹੀਂ, ਜ਼ਬਤ ਕਰਨ ਨੂੰ ਕੁਝ ਨਹੀਂ।",
  "home.features.identity.keys.name": "ਕੁੰਜੀ ਜੋੜੇ ਵਾਲੀ ਪਛਾਣ",
  "home.features.identity.keys.line": "ਇਸੇ ਫ਼ੋਨ ’ਤੇ ਬਣੀ, OS ਦੀ ਕੀਚੇਨ ਵਿੱਚ ਰੱਖੀ।",
  "home.features.identity.names.name": "ਪੜ੍ਹਨਯੋਗ ਨਾਂ",
  "home.features.identity.names.line": "ਤੁਹਾਡੀ ਕੁੰਜੀ ਤੋਂ ਕੱਢੇ, ਇਸ ਲਈ ਤੁਹਾਡਾ ਕੋਈ ਖੋਹ ਨਹੀਂ ਸਕਦਾ।",
  "home.features.identity.qr.name": "QR ਸੰਪਰਕ",
  "home.features.identity.qr.line": "ਇੱਕ ਸਕੈਨ ਉਹਨਾਂ ਦੀਆਂ ਕੁੰਜੀਆਂ ਲੈ ਆਉਂਦਾ ਹੈ, ਸਿਰਫ਼ ਨਾਂ ਨਹੀਂ।",
  "home.features.identity.panic.name": "ਸੰਕਟ ਸਫ਼ਾਈ",
  "home.features.identity.panic.line": "ਹਰ ਕੁੰਜੀ ਅਤੇ ਸੁਨੇਹਾ ਇੱਕ ਸਕਿੰਟ ਤੋਂ ਘੱਟ ਵਿੱਚ ਤਬਾਹ।",

  "home.features.networking.title": "ਨੈੱਟਵਰਕ",
  "home.features.networking.summary": "ਫ਼ੋਨ ਹੀ ਨੈੱਟਵਰਕ ਹਨ।",
  "home.features.networking.mesh.name": "ਬਲੂਟੁੱਥ ਮੈਸ਼",
  "home.features.networking.mesh.line":
    "ਨਾ ਇੰਟਰਨੈੱਟ, ਨਾ ਰਾਊਟਰ, ਉਹਨਾਂ ਫ਼ੋਨਾਂ ’ਤੇ ਜੋ ਲੋਕਾਂ ਕੋਲ ਪਹਿਲਾਂ ਹੀ ਹਨ।",
  "home.features.networking.bridge.name": "ਮੈਸ਼ ਪੁਲ",
  "home.features.networking.bridge.line":
    "ਤੁਹਾਡੀ ਜਨਤਕ ਗੱਲਬਾਤ ਨੂੰ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਕਿਸੇ ਨੇੜਲੀ ਭੀੜ ਨਾਲ ਜੋੜਦਾ ਹੈ।",
  "home.features.networking.wifi.name": "WiFi ਤੇਜ਼ ਰਾਹ",
  "home.features.networking.wifi.line": "ਦੋ Android ਜਾਂ ਦੋ iPhone ਵਿਚਕਾਰ ਤੇਜ਼ ਤਬਾਦਲਾ।",
  "home.features.networking.bitchat.name": "bitchat ਨਾਲ ਮੇਲ",
  "home.features.networking.bitchat.line": "ਦੋਵੇਂ ਐਪਾਂ ਬਿਨਾਂ ਸੈਟਅੱਪ ਇੱਕੋ ਮੈਸ਼ ਵਿੱਚ ਜੁੜ ਜਾਂਦੀਆਂ ਹਨ।",

  "home.features.internet.title": "ਇੰਟਰਨੈੱਟ",
  "home.features.internet.summary": "ਇੱਕ ਵਾਧਾ, ਕਦੇ ਵੀ ਸ਼ਰਤ ਨਹੀਂ।",
  "home.features.internet.nostr.name": "Nostr ਸਹਾਰਾ",
  "home.features.internet.nostr.line":
    "ਸਿੱਧੇ ਸੁਨੇਹੇ ਅਤੇ ਟਿਕਾਣਾ ਚੈਨਲ ਰੇਡੀਓ ਦੀ ਪਹੁੰਚ ਤੋਂ ਪਰ੍ਹੇ ਵੀ ਚੱਲਦੇ ਰਹਿੰਦੇ ਹਨ।",
  "home.features.internet.relays.name": "ਭੂ-ਰਿਲੇ ਖੋਜ",
  "home.features.internet.relays.line": "300 ਤੋਂ ਵੱਧ ਸੁਤੰਤਰ ਜਨਤਕ ਰਿਲੇ, ਇੱਕ ਵੀ ਸਾਡਾ ਨਹੀਂ।",
  "home.features.internet.gateway.name": "ਇੰਟਰਨੈੱਟ ਗੇਟਵੇ",
  "home.features.internet.gateway.line":
    "ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਉਧਾਰ ਦਿਓ ਤਾਂ ਜੋ ਨੇੜਲਾ ਕੋਈ ਆਫ਼ਲਾਈਨ ਫ਼ੋਨ ਟਿਕਾਣਾ ਚੈਨਲਾਂ ਤੱਕ ਪਹੁੰਚ ਸਕੇ।",
  "home.features.internet.tor.name": "Tor ਦਾ ਜੋੜ",
  "home.features.internet.tor.line":
    "ਦੋਵਾਂ ਪਲੇਟਫ਼ਾਰਮਾਂ ’ਤੇ ਰਾਊਟ ਕੀਤਾ, ਇਸ ਲਈ ਰਿਲੇ ਤੁਹਾਡਾ IP ਕਦੇ ਨਹੀਂ ਦੇਖਦੇ।",

  "home.features.optional.title": "ਵਿਕਲਪਿਕ",
  "home.features.optional.summary": "ਸ਼ੁਰੂ ਵਿੱਚ ਬੰਦ। ਜਦੋਂ ਚਾਹੋ ਚਾਲੂ।",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "ਆਪਣੇ ਨਾਲ ਖੜ੍ਹੇ ਬੰਦੇ ਨੂੰ ਪੈਸੇ ਦਿਓ, ਕੋਈ ਫ਼ੋਨ ਆਨਲਾਈਨ ਨਾ ਹੋਵੇ ਤਾਂ ਵੀ।",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Lightning ਨੈੱਟਵਰਕ ’ਤੇ bitcoin ਪਾਓ ਜਾਂ ਕਢਵਾਓ।",
  "home.features.optional.ai.name": "ਸਥਾਨਕ AI",
  "home.features.optional.ai.line": "ਡੀਵਾਈਸ ’ਤੇ ਹੀ ਜਵਾਬ, ਫ਼ੋਨ ਤੋਂ ਕੁਝ ਵੀ ਬਾਹਰ ਨਹੀਂ ਜਾਂਦਾ।",
  "home.features.optional.social.name": "ਸਮਾਜਿਕ ਪੁਲ",
  "home.features.optional.social.line": "ਉਸੇ ਪਛਾਣ ਨਾਲ Bluesky ਅਤੇ Mastodon।",

  "home.compare.eyebrow": "ਤੁਲਨਾ ਵਿੱਚ ਕਿੱਥੇ",
  "home.compare.title": "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ, ਬਿਨਾਂ ਵਾਧੂ ਯੰਤਰ, ਅਤੇ ਖੁੱਲ੍ਹਾ।",
  "home.compare.sub":
    "ਇੱਥੇ ਹਰ ਐਪ ਕਿਸੇ ਨਾ ਕਿਸੇ ਗੱਲ ਵਿੱਚ ਚੰਗੀ ਹੈ। ਪਰ ਜਦੋਂ ਨੈੱਟਵਰਕ ਨਹੀਂ ਚੱਲਦਾ ਤਾਂ ਕੁਝ ਹੀ ਚੱਲਦੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ।",
  "home.compare.col.project": "ਪ੍ਰੋਜੈਕਟ",
  "home.compare.col.transport": "ਢੋਆ-ਢੁਆਈ",
  "home.compare.col.encryption": "ਇਨਕ੍ਰਿਪਸ਼ਨ",
  "home.compare.col.offline": "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਚੱਲਦਾ ਹੈ",
  "home.compare.col.hardware_free": "ਵਾਧੂ ਯੰਤਰ ਨਹੀਂ ਚਾਹੀਦਾ",
  "home.compare.col.open_source": "ਖੁੱਲ੍ਹਾ ਸਰੋਤ",
  "home.compare.mark.yes": "ਹਾਂ",
  "home.compare.mark.no": "ਨਹੀਂ",
  "home.compare.mark.partial": "ਅੰਸ਼ਕ, ਕਲਾਇੰਟ ਖੁੱਲ੍ਹੇ ਸਰੋਤ ਵਾਲੇ ਹਨ, ਸਰਵਰ ਨਹੀਂ",
  "home.compare.mark.partial_hint": "ਕਲਾਇੰਟ ਖੁੱਲ੍ਹੇ ਸਰੋਤ ਵਾਲੇ ਹਨ, ਸਰਵਰ ਨਹੀਂ",
  "home.compare.transport.servers": "ਕੇਂਦਰੀ ਸਰਵਰ",
  "home.compare.transport.onion": "ਪਿਆਜ਼ੀ ਰਾਊਟਿੰਗ (ਸੇਵਾ ਨੋਡ)",
  "home.compare.transport.nostr": "Nostr ਰਿਲੇ",
  "home.compare.transport.lora": "LoRa ਰੇਡੀਓ",
  "home.compare.transport.sub_ghz": "ਮਲਕੀਅਤੀ ਸਬ-GHz ਰੇਡੀਓ",

  "home.explore.eyebrow": "ਖੁੱਲ੍ਹਾ ਅਤੇ ਈਮਾਨਦਾਰ",
  "home.explore.title": "ਇੱਥੋਂ ਦਾ ਹਰ ਦਾਅਵਾ ਜਾਂਚਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
  "home.explore.sub":
    "ਕੋਡ, ਪ੍ਰੋਟੋਕੋਲ ਅਤੇ ਯੋਜਨਾਵਾਂ ਸਭ ਜਨਤਕ ਹਨ। ਹੱਦਾਂ ਵੀ। ਸਾਡੀ ਗੱਲ ਮੰਨਣ ਤੋਂ ਪਹਿਲਾਂ ਖ਼ੁਦ ਜਾਂਚ ਲਵੋ।",
  "home.explore.audit.chip": "ਪੜਤਾਲ ਬਾਕੀ",
  "home.explore.audit.headline": "Airhop ਦੀ ਹਾਲੇ ਬਾਹਰੋਂ ਕੋਈ ਸੁਰੱਖਿਆ ਪੜਤਾਲ ਨਹੀਂ ਹੋਈ।",
  "home.explore.audit.body":
    "{headline} ਸਾਰਾ ਕੋਡ ਖ਼ੁਦ ਪੜ੍ਹਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਜਾਰੀ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ {review} ਵਿੱਚੋਂ ਲੰਘਾਇਆ ਜਾਂਦਾ ਹੈ, ਅਤੇ ਜੋ ਕ੍ਰਿਪਟੋਗ੍ਰਾਫ਼ਿਕ ਲਾਇਬ੍ਰੇਰੀ ਇਹ ਵਰਤਦਾ ਹੈ ਉਸ ਦੀ ਪੜਤਾਲ Cure53 ਨੇ ਕੀਤੀ ਹੈ, ਪਰ ਇਹ ਐਪ ਦੀ ਆਪਣੀ ਰਸਮੀ ਪੜਤਾਲ ਦਾ ਬਦਲ ਨਹੀਂ। {version} ਲਈ ਇੱਕ ਪੜਤਾਲ ਵਿਉਂਤੀ ਹੋਈ ਹੈ। ਉਦੋਂ ਤੱਕ ਸੰਵੇਦਨਸ਼ੀਲ ਕੰਮਾਂ ਲਈ ਇਸ ’ਤੇ ਭਰੋਸਾ ਨਾ ਕਰੋ।",
  "home.explore.audit.link.review": "ਸੁਰੱਖਿਆ ਸਮੀਖਿਆ ਏਜੰਟ",
  "home.explore.source.title": "ਸਰੋਤ ਕੋਡ",
  "home.explore.source.desc":
    "ਸਭ ਕੁਝ GitHub ’ਤੇ MIT ਹੇਠ। ਇਸ਼ੂ, ਪੁੱਲ ਰਿਕੁਐਸਟ ਅਤੇ ਚਰਚਾਵਾਂ ਖੁੱਲ੍ਹੀਆਂ।",
  "home.explore.protocol.title": "ਪ੍ਰੋਟੋਕੋਲ ਦਾ ਵੇਰਵਾ",
  "home.explore.protocol.desc": "ਹੂਬਹੂ ਵਾਇਰ ਰੂਪ, BLE UUID ਅਤੇ ਸਥਿਰ ਮੁੱਲ, bitchat ਨਾਲ ਸਾਂਝੇ।",
  "home.explore.architecture.title": "ਬਣਤਰ",
  "home.explore.architecture.desc":
    "ਪੂਰਾ ਤਕਨੀਕੀ ਵੇਰਵਾ, ਭੇਜੋ ਦਬਾਉਣ ਤੋਂ ਲੈ ਕੇ ਰੇਡੀਓ ’ਤੇ ਪਏ ਬਾਈਟਾਂ ਤੱਕ।",
  "home.explore.roadmap.title": "ਰਾਹ-ਨਕਸ਼ਾ",
  "home.explore.roadmap.desc": "v0.5.0 ਤੋਂ v2.0.0 ਤੱਕ ਸੰਸਕਰਣਾਂ ਦੇ ਨਿਸ਼ਾਨੇ, ਵਿਉਂਤੀ ਪੜਤਾਲ ਸਮੇਤ।",
  "home.explore.vision.title": "ਦ੍ਰਿਸ਼ਟੀ",
  "home.explore.vision.desc": "Airhop ਕਿਉਂ ਹੈ, ਅਤੇ ਉਹ ਅਸੂਲ ਜੋ ਦਬਾਅ ਹੇਠ ਵੀ ਨਹੀਂ ਬਦਲਦੇ।",
  "home.explore.brand.title": "ਬ੍ਰਾਂਡ ਕਿੱਟ",
  "home.explore.brand.desc": "ਪਿਕਸਲ ਪੰਛੀ, ਰੰਗ ਤੇ ਲਿਖਤ ਦੇ ਟੋਕਨ, ਪ੍ਰੈੱਸ ਸਮੱਗਰੀ ਅਤੇ ਤਿਆਰ ਲਿਖਤ।",

  "home.contribute.eyebrow": "ਇਸ ਪ੍ਰੋਜੈਕਟ ਨੂੰ ਸਹਾਰਾ ਦਿਓ",
  "home.contribute.title": "ਸੁਤੰਤਰ, ਅਤੇ ਸਭ ਦੇ ਸਾਹਮਣੇ।",
  "home.contribute.sub":
    "ਨਾ ਕੋਈ ਨਿਵੇਸ਼ਕ ਹੈ, ਨਾ ਇਸ਼ਤਿਹਾਰ, ਨਾ ਕੋਈ ਪੈਸੇ ਵਾਲਾ ਦਰਜਾ। ਹਰ ਸਹੂਲਤ ਕਿਸੇ ਵੀ ਹਾਲਤ ਵਿੱਚ ਮੁਫ਼ਤ ਰਹਿੰਦੀ ਹੈ, ਅਤੇ ਕੰਮ ਦਾ ਖ਼ਰਚਾ ਉਹੀ ਲੋਕ ਚੁੱਕਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਨੂੰ ਇਹ ਕੰਮ ਦਾ ਲੱਗਦਾ ਹੈ।",
  "home.contribute.contribute.chip": "ਯੋਗਦਾਨ ਪਾਓ",
  "home.contribute.contribute.body":
    "ਰਿਪੌਜ਼ਟਰੀ ਨੂੰ ਤਾਰਾ ਦਿਓ, ਇਸ਼ੂ ਖੋਲ੍ਹੋ, ਅਤੇ ਪੁੱਲ ਰਿਕੁਐਸਟ ਭੇਜੋ। ਖ਼ਰਾਬੀਆਂ ਦੀਆਂ ਖ਼ਬਰਾਂ, ਸਹੂਲਤਾਂ ਦੀਆਂ ਤਜਵੀਜ਼ਾਂ ਅਤੇ ਕੋਡ ਦਾ ਯੋਗਦਾਨ, ਸਭ ਦਾ ਸੁਆਗਤ ਹੈ।",
  "home.contribute.contribute.cta": "GitHub ’ਤੇ ਦੇਖੋ",
  "home.contribute.sponsor.chip": "ਸਪਾਂਸਰ",
  "home.contribute.sponsor.body":
    "ਜੇ Airhop ਤੁਹਾਡੇ ਕੰਮ ਦਾ ਹੈ ਤਾਂ ਇੱਕ ਵਾਰੀ ਦਾ ਦਾਨ ਜਾਂ ਲਗਾਤਾਰ ਸਪਾਂਸਰਸ਼ਿਪ ਵਿਕਾਸ ਚੱਲਦਾ ਰੱਖਣ ਵਿੱਚ ਬਹੁਤ ਦੂਰ ਤੱਕ ਜਾਂਦੀ ਹੈ।",
  "home.contribute.sponsor.donate": "ਇੱਕ ਵਾਰ ਦਾਨ ਕਰੋ",
  "home.contribute.sponsor.github": "GitHub ’ਤੇ ਸਪਾਂਸਰ ਬਣੋ",

  "page.architecture.eyebrow": "ਦਸਤਾਵੇਜ਼",
  "page.architecture.title": "ਬਣਤਰ",
  "page.architecture.toc": "ਇਸ ਪੰਨੇ ’ਤੇ",

  "page.faq.eyebrow": "ਅਕਸਰ ਪੁੱਛੇ ਸਵਾਲ",
  "page.faq.title": "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ",
  "page.faq.meta": "Airhop ਬਾਰੇ ਆਮ ਸਵਾਲ।",
  "page.faq.contact":
    "ਜਿਨ੍ਹਾਂ ਸਵਾਲਾਂ ਦਾ ਜਵਾਬ ਇੱਥੇ ਨਹੀਂ, ਉਹ {email} ’ਤੇ ਭੇਜੇ ਜਾ ਸਕਦੇ ਹਨ ਜਾਂ {github} ’ਤੇ ਚਰਚਾ ਖੋਲ੍ਹ ਕੇ ਉਠਾਏ ਜਾ ਸਕਦੇ ਹਨ।",

  "page.blogs.eyebrow": "ਬਲੌਗ",
  "page.blogs.title": "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
  "page.blogs.body": "ਮੈਸ਼ ਨੈੱਟਵਰਕਿੰਗ, ਨਿੱਜਤਾ ਅਤੇ ਆਫ਼ਲਾਈਨ-ਪਹਿਲਾਂ ਸਾਫ਼ਟਵੇਅਰ ਬਾਰੇ ਲਿਖਤਾਂ।",

  "page.brand.eyebrow": "ਬ੍ਰਾਂਡ",
  "page.brand.title": "ਬ੍ਰਾਂਡ ਕਿੱਟ",
  "page.brand.meta":
    "ਕਿਸੇ ਲੇਖ, ਸਟੋਰ ਸੂਚੀ, ਭਾਸ਼ਣ ਜਾਂ README ਵਿੱਚ Airhop ਰੱਖਣ ਲਈ ਸਮੱਗਰੀ ਅਤੇ ਨਿਯਮ। ਹਵਾਲੇ ਅਤੇ ਪ੍ਰੈੱਸ ਲਈ ਖੁੱਲ੍ਹੇ ਤੌਰ ’ਤੇ ਵਰਤਣਯੋਗ।",

  "page.legal.eyebrow": "ਕਾਨੂੰਨੀ",
  "page.privacy.title": "ਨਿੱਜਤਾ ਨੀਤੀ",
  "page.terms.title": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",

  "page.notfound.title": "ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ",
  "page.notfound.body": "ਜੋ ਪੰਨਾ ਤੁਸੀਂ ਲੱਭ ਰਹੇ ਹੋ ਉਹ ਮੌਜੂਦ ਨਹੀਂ ਜਾਂ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",

  "page.english_only": "ਇਹ ਪੰਨਾ ਸਿਰਫ਼ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਉਪਲਬਧ ਹੈ।",

  "seo.breadcrumb.home": "ਮੁੱਖ ਪੰਨਾ",

  "seo.home.title": "Airhop — ਨਿੱਜੀ, ਆਫ਼ਲਾਈਨ-ਪਹਿਲਾਂ ਮੈਸੰਜਰ",
  "seo.home.description":
    "iOS ਅਤੇ Android ਲਈ ਨਿੱਜੀ ਪੀਅਰ-ਤੋਂ-ਪੀਅਰ ਸੁਨੇਹੇ। ਨਾ ਇੰਟਰਨੈੱਟ, ਨਾ ਸਰਵਰ, ਨਾ ਖਾਤੇ। ਕਿਤੇ ਵੀ ਬਲੂਟੁੱਥ ਮੈਸ਼ ’ਤੇ ਗੱਲ ਕਰੋ।",

  "seo.architecture.title": "ਬਣਤਰ — Airhop",
  "seo.architecture.description":
    "Airhop ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ, ਉੱਪਰੋਂ ਹੇਠਾਂ ਤੱਕ: ਪਛਾਣ, ਢੋਆ-ਢੁਆਈ ਦੀ ਚੋਣ, ਬਲੂਟੁੱਥ ਮੈਸ਼, ਇਨਕ੍ਰਿਪਸ਼ਨ, ਇੰਟਰਨੈੱਟ ਪਰਤ, Tor, ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ecash, ਡੀਵਾਈਸ ’ਤੇ ਚੱਲਦਾ AI, ਅਤੇ bitchat ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਵਾਇਰ ਰੂਪ।",
  "seo.architecture.breadcrumb": "ਬਣਤਰ",
  "seo.architecture.headline": "Airhop ਦੀ ਬਣਤਰ",
  "seo.architecture.summary":
    "Airhop ਦਾ ਪੂਰਾ ਤਕਨੀਕੀ ਵੇਰਵਾ: ਪਛਾਣ, ਢੋਆ-ਢੁਆਈ, ਬਲੂਟੁੱਥ ਮੈਸ਼, ਇਨਕ੍ਰਿਪਸ਼ਨ, Nostr ਇੰਟਰਨੈੱਟ ਪਰਤ, Tor, Cashu ਵਾਲਿਟ, ਡੀਵਾਈਸ ’ਤੇ ਚੱਲਦਾ AI ਸਹਾਇਕ, ਅਤੇ ਵਾਇਰ ਰੂਪ।",

  "seo.faq.title": "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ — Airhop",
  "seo.faq.description":
    "Airhop ਦੇ ਬਲੂਟੁੱਥ ਮੈਸ਼ ਸੁਨੇਹਿਆਂ, ਇਨਕ੍ਰਿਪਸ਼ਨ, ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਭੁਗਤਾਨਾਂ, Nostr ਇੰਟਰਨੈੱਟ ਪਰਤ ਅਤੇ bitchat ਮੇਲ ਬਾਰੇ ਜਵਾਬ।",
  "seo.faq.breadcrumb": "ਅਕਸਰ ਪੁੱਛੇ ਸਵਾਲ",

  "seo.blogs.title": "ਬਲੌਗ — Airhop",
  "seo.blogs.description": "ਮੈਸ਼ ਨੈੱਟਵਰਕਿੰਗ, ਨਿੱਜਤਾ ਅਤੇ ਆਫ਼ਲਾਈਨ-ਪਹਿਲਾਂ ਸਾਫ਼ਟਵੇਅਰ ਬਾਰੇ ਲਿਖਤਾਂ।",
  "seo.blogs.breadcrumb": "ਬਲੌਗ",

  "seo.brand.title": "ਬ੍ਰਾਂਡ ਕਿੱਟ — Airhop",
  "seo.brand.description":
    "Airhop ਦੀ ਬ੍ਰਾਂਡ ਕਿੱਟ: ਪਿਕਸਲ ਪੰਛੀ ਦਾ ਨਿਸ਼ਾਨ, ਸ਼ਬਦ-ਨਿਸ਼ਾਨ, ਰੰਗ ਤੇ ਲਿਖਤ ਦੇ ਟੋਕਨ, ਪ੍ਰੈੱਸ ਸਮੱਗਰੀ ਅਤੇ ਤਿਆਰ ਲਿਖਤ।",
  "seo.brand.breadcrumb": "ਬ੍ਰਾਂਡ ਕਿੱਟ",

  "seo.privacy.title": "ਨਿੱਜਤਾ ਨੀਤੀ — Airhop",
  "seo.privacy.description":
    "Airhop ਡਾਟੇ ਨਾਲ ਕੀ ਕਰਦਾ ਹੈ: ਨਾ ਖਾਤੇ, ਨਾ ਸਰਵਰ, ਨਾ ਪਿੱਛਾ। ਤੁਹਾਡੀ ਪਛਾਣ ਅਤੇ ਸੁਨੇਹੇ ਤੁਹਾਡੇ ਡੀਵਾਈਸ ’ਤੇ ਹੀ ਰਹਿੰਦੇ ਹਨ।",
  "seo.privacy.breadcrumb": "ਨਿੱਜਤਾ ਨੀਤੀ",

  "seo.terms.title": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ — Airhop",
  "seo.terms.description": "Airhop ਐਪ ਅਤੇ ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਨੂੰ ਚਲਾਉਣ ਵਾਲੀਆਂ ਸ਼ਰਤਾਂ।",
  "seo.terms.breadcrumb": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",

  "seo.notfound.title": "ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ — Airhop",
  "seo.notfound.description": "ਜੋ ਪੰਨਾ ਤੁਸੀਂ ਲੱਭ ਰਹੇ ਹੋ ਉਹ ਮੌਜੂਦ ਨਹੀਂ ਜਾਂ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} ਰਿਲੇ",
    other: "{count} ਰਿਲੇ",
  },
  "home.map.locations": {
    one: "{count} ਥਾਂ",
    other: "{count} ਥਾਵਾਂ",
  },
};

export const locale: Locale = { strings, plurals };
