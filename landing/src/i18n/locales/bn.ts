import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "হোমে ফিরুন",
  "common.last_updated": "সর্বশেষ হালনাগাদ: {date}",

  "nav.aria": "প্রধান",
  "nav.home": "Airhop হোম",
  "nav.skip": "কনটেন্টে যান",
  "nav.menu.open": "মেনু খুলুন",
  "nav.menu.close": "মেনু বন্ধ করুন",
  "nav.how_it_works": "কীভাবে কাজ করে",
  "nav.architecture": "আর্কিটেকচার",
  "nav.faq": "সাধারণ প্রশ্ন",

  "footer.aria": "ফুটার",
  "footer.tagline": "ব্যক্তিগত মেশ যোগাযোগ",
  "footer.credit": "© {author} বানিয়েছেন {heart} দিয়ে",
  "footer.group.download": "ডাউনলোড",
  "footer.group.resources": "রিসোর্স",
  "footer.group.social": "সোশ্যাল",
  "footer.group.legal": "আইনি",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "আর্কিটেকচার",
  "footer.link.blogs": "ব্লগ",
  "footer.link.faq": "সাধারণ প্রশ্ন",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "পরিষেবার শর্তাবলি",
  "footer.link.privacy": "গোপনীয়তা নীতি",
  "footer.link.license": "প্রকল্পের লাইসেন্স",

  "settings.theme.group": "রঙের থিম",
  "settings.theme.light": "হালকা থিম",
  "settings.theme.dark": "গাঢ় থিম",
  "settings.language.label": "ভাষা",
  "settings.language.suggestion": "এই পাতাটি বাংলায় দেখুন",
  "settings.language.dismiss": "সরান",

  "home.hero.release": "সর্বশেষ রিলিজ",
  "home.hero.title": "ইন্টারনেট ছাড়াই চলে এমন বার্তা।",
  "home.hero.body":
    "কাছের ফোনগুলো ব্লুটুথ মেশ তৈরি করে আর আপনার বার্তা সাতটি হপ পর্যন্ত পৌঁছে দেয়, প্রান্ত থেকে প্রান্তে এনক্রিপ্ট করা। {no_servers}, {no_accounts}, {no_tracking}।",
  "home.hero.body.no_servers": "কোনো সার্ভার নেই",
  "home.hero.body.no_accounts": "কোনো অ্যাকাউন্ট নেই",
  "home.hero.body.no_tracking": "কোনো ট্র্যাকিং নেই",
  "home.hero.download": "অ্যাপটি ডাউনলোড করুন",
  "home.hero.badges": "MIT লাইসেন্স · বিনামূল্যে ও ওপেন সোর্স · bitchat-এর সাথে চলে",
  "home.hero.group.mobile": "মোবাইল",
  "home.hero.group.desktop": "ডেস্কটপ",
  "home.hero.option.f_droid": "ওপেন সোর্স ক্যাটালগ",
  "home.hero.option.apk": "সরাসরি ডাউনলোড",
  "home.hero.option.soon": "শীঘ্রই আসছে",

  "home.about.eyebrow": "Airhop কী",
  "home.about.title": "বেশির ভাগ অ্যাপ একটি কেন্দ্রীয় সার্ভারের উপর নির্ভর করে।",
  "home.about.sub":
    "সার্ভারে নজরদারি করা যায়, সেটি বন্ধ বা ব্লক করা যায়। Airhop-এর কোনো সার্ভার নেই, তাই চাপ দেওয়ার মতো কোনো কোম্পানি নেই আর বন্ধ করার মতো কোনো পরিষেবাও নেই।",
  "home.about.card": "কারিগরি সংক্ষেপ",
  "home.about.link.mesh": "ব্লুটুথ লো এনার্জি মেশ",
  "home.about.link.wire_protocol": "ওয়্যার প্রোটোকল",
  "home.about.body.built":
    "Airhop হলো iOS ও Android-এর জন্য একটি ওপেন সোর্স অ্যাপ, যা {mesh}-এ ব্যক্তিগত পিয়ার-টু-পিয়ার বার্তার জন্য তৈরি। এটি {bitchat}-এর ভিত্তির উপর গড়া, তার {wire_protocol} ও নিরাপত্তা মডেল পুনর্ব্যবহার করে, আর তার উপর অফলাইন {ecash} পেমেন্ট এবং অফলাইন AI যোগ করে। শূন্য ইন্টারনেট সংযোগেও এটি চলে, আর বার্তা কাছের ডিভাইসগুলোর মধ্য দিয়ে নিজে থেকেই এগিয়ে যায় (ঘরের ভিতরে প্রতি হপে মোটামুটি 10 থেকে 30 মিটার, খোলা জায়গায় আরও বেশি), সর্বোচ্চ 7 হপ পর্যন্ত।",
  "home.about.body.identity":
    "আপনার পরিচয় হলো একটি {ed25519} কী জোড়া, যা আপনার ডিভাইসেই তৈরি হয় এবং {ios_keychain} বা {android_keystore}-এ রাখা থাকে। কোনো অ্যাকাউন্ট নেই, কোনো নিবন্ধন নেই, আর কোনো সার্ভারে কিছু পৌঁছায় না, তাই এটি এমন একটি বার্নার অ্যাপ হিসেবে ব্যবহার করা যায় যা মুছে ফেললে আপনার সাথে যুক্ত কিছুই রেখে যায় না।",
  "home.about.body.crypto":
    "প্রতিটি সেশন প্রমাণীকৃত হ্যান্ডশেকের জন্য {noise} প্রোটোকল ব্যবহার করে। জমানো বার্তা {ratchet} অ্যালগরিদম ব্যবহার করে, তাই পরে আপনার ডিভাইস অন্যের হাতে পড়লেও আগের বার্তাগুলো অপাঠ্যই থাকে। প্যানিক ওয়াইপ এক সেকেন্ডের কমে সব কী আর বার্তা ধ্বংস করে দেয়।",
  "home.about.body.internet":
    "আপনি আর কোনো পরিচিতি ব্লুটুথের নাগালের বাইরে থাকলে {nostr} রিলে ইন্টারনেট সেতুর কাজ করে, {nip17} ধাঁচের মোড়ানো সরাসরি বার্তা দিয়ে, ফলে আপনারা দুজন অনলাইনে থাকলেই মেশ বিশ্বজুড়ে ছড়িয়ে যায়। iOS-এ ({arti} দিয়ে) আর Android-এ ({orbot} দিয়ে) {tor} সমর্থনও আছে।",
  "home.about.optional.title": "Airhop-এ কিছু ঐচ্ছিক সুবিধা আছে, যা আপনি চালু করতে পারেন:",
  "home.about.optional.payments.label": "অফলাইন পেমেন্ট:",
  "home.about.optional.payments.body":
    "{cashu} প্রোটোকল দিয়ে মেশের উপর পেমেন্ট পাঠান ও নিন (শুধু Bitcoin)।",
  "home.about.optional.ai.label": "অফলাইন AI:",
  "home.about.optional.ai.body":
    "ডিভাইসেই চলা একটি ছোট AI সহকারী, যা জরুরি প্রশ্নের উত্তর দিতে পারে। সব প্রক্রিয়া আর ডেটা আপনার ডিভাইসেই থাকে।",
  "home.about.body.compatible":
    "Airhop প্রোটোকল স্তরে bitchat-এর সাথে সঙ্গতিপূর্ণ। একই মেশে থাকা একটি Airhop ডিভাইস আর একটি bitchat ডিভাইস নিজে থেকেই একে অপরকে খুঁজে নেয় এবং কোনো সেটআপ ছাড়াই বার্তা ও সরাসরি বার্তা বিনিময় করতে পারে।",

  "home.situations.eyebrow": "যখন দরকার পড়ে",
  "home.situations.title": "নেটওয়ার্ক যেদিন বসে যায়, সেদিনের জন্য।",
  "home.situations.sub":
    "প্রাকৃতিক দুর্যোগ, ইন্টারনেট বন্ধ, বড় বিক্ষোভ, কিংবা নাগালের বাইরে কাটানো সাধারণ এক ছুটির দিন।",
  "home.situations.disaster.label": "দুর্যোগ",
  "home.situations.disaster.line":
    "টাওয়ার বসে গেছে। বোর্ডে টাঙানো নোটিশ যে-ই পাশ দিয়ে যায় তার কাছেই পৌঁছায়।",
  "home.situations.offgrid.label": "গ্রিডের বাইরে",
  "home.situations.offgrid.line": "পথে দুদিন হয়ে গেল। শেষ দাগটাও গতকাল মিলিয়ে গেছে।",
  "home.situations.protest.label": "বিক্ষোভ",
  "home.situations.protest.line":
    "লিফলেটে থাকা একটি QR কোড মিছিলের জন্য একটি এনক্রিপ্ট করা চ্যানেল খুলে দেয়।",
  "home.situations.festival.label": "উৎসব",
  "home.situations.festival.line":
    "মাঠে কোনো সিগন্যাল নেই। বার্তা অচেনা মানুষের ফোন ঘুরে এগিয়ে যায়।",

  "home.showcase.eyebrow": "অ্যাপটি দেখুন",
  "home.showcase.title": "সাধারণ একটি মেসেঞ্জার, অফলাইনে।",
  "home.showcase.sub":
    "চ্যাট, চ্যানেল, একটি ওয়ালেট আর একটি পরিচয়। উপরে চেনা চেহারা, নিচে কাজটা করছে একটি মেশ।",
  "home.showcase.mesh.title": "মেশ",
  "home.showcase.mesh.caption":
    "নাগালের সবাই, যে যত কাছে সেই অনুযায়ী সাজানো। কাউকে আগে যোগ করতে হয় না।",
  "home.showcase.mesh.alt":
    "Airhop অ্যাপের মেশ স্ক্রিন, যেখানে কাছের চারটি পিয়ার সিগন্যালের জোর অনুযায়ী রাডারে সাজানো।",
  "home.showcase.chats.title": "চ্যাট",
  "home.showcase.chats.caption":
    "সাধারণ কথাবার্তা। যেসব ফোন প্রতিটি বার্তা এগিয়ে দেয়, তারা সেটি খুলতে পারে না।",
  "home.showcase.chats.alt":
    "বিদ্যুৎ চলে যাওয়ার সময় Airhop-এ একটি সরাসরি বার্তার কথাবার্তা, তিনটি ফোন ঘুরে পৌঁছানো।",
  "home.showcase.channels.title": "চ্যানেল",
  "home.showcase.channels.caption":
    "প্রকাশ্য ঘর, এক ব্লকের মতো ছোট বা একটি অঞ্চলের মতো বড়, সেখানে থাকা যে কারও জন্য খোলা।",
  "home.showcase.channels.alt":
    "Airhop অ্যাপের চ্যাট স্ক্রিন, যেখানে ব্লক, পাড়া, শহর ও অঞ্চল অনুযায়ী প্রকাশ্য চ্যানেলের তালিকা।",
  "home.showcase.wallet.title": "ওয়ালেট",
  "home.showcase.wallet.caption":
    "পাশের মানুষটিকে ব্লুটুথে ecash দিন, দুটি ফোনের কোনোটিই অনলাইনে না থেকেও।",
  "home.showcase.wallet.alt":
    "Airhop অ্যাপের ওয়ালেট স্ক্রিন, যেখানে ব্লুটুথে পাঠানো যায় এমন একটি ecash ব্যালেন্স দেখা যাচ্ছে।",
  "home.showcase.identity.title": "পরিচয়",
  "home.showcase.identity.caption":
    "সাইন আপ নেই, ফোন নম্বর নেই, ইমেল নেই। শুধু একটি কী, যা এই ফোন কখনো ছাড়ে না।",
  "home.showcase.identity.alt":
    "Airhop অ্যাপের প্রোফাইল স্ক্রিন, যেখানে অ্যাকাউন্ট ছাড়াই ডিভাইসে তৈরি একটি পরিচয় দেখা যাচ্ছে।",

  "home.how.eyebrow": "কীভাবে কাজ করে",
  "home.how.title": "মেশ নিজেই গড়ে ওঠে।",
  "home.how.sub":
    "কাছের নোডগুলো ব্লুটুথে নিজে থেকেই সেরে ওঠা একটি মেশ তৈরি করে। ইন্টারনেট থাকলে Nostr রিলে সেটি আরও বাড়িয়ে দেয়, এমন কোনো পরিকাঠামো ছাড়াই যা কারও নিয়ন্ত্রণে।",
  "home.how.cta": "পুরো আর্কিটেকচার পড়ুন",
  "home.how.discover.title": "খুঁজে নেওয়া",
  "home.how.discover.line":
    "Airhop বা bitchat চালানো ফোনগুলো ব্লুটুথে নিজে থেকেই একে অপরকে পেয়ে যায়। কোনো পেয়ারিং নেই, কোনো সেটআপ নেই।",
  "home.how.relay.title": "এগিয়ে দেওয়া",
  "home.how.relay.line":
    "একটি বার্তা ফোন থেকে ফোনে লাফায়, সাতটি হপ পর্যন্ত। মাঝের ফোনগুলো কখনো দেখে না তারা কী বয়ে নিচ্ছে।",
  "home.how.reach.title": "আরও দূরে পৌঁছানো",
  "home.how.reach.line":
    "ইন্টারনেট থাকলে Nostr রিলে একই কথাবার্তা আরও দূরে নিয়ে যায়, চাইলে Tor-এর মধ্য দিয়ে।",
  "home.how.swipe": "দেখতে সোয়াইপ করুন",
  "home.how.diagram": "BLE মেশ · স্থানীয় পিয়ার-টু-পিয়ার নেটওয়ার্ক",
  "home.how.legend.node": "BLE মেশ নোড (অফলাইন)",
  "home.how.legend.relay": "বহু-হপ রিলে (Noise XX দিয়ে এনক্রিপ্ট করা)",
  "home.how.legend.bitchat": "একই মেশে bitchat সঙ্গতিপূর্ণ",
  "home.how.legend.nostr": "Nostr সেতু (ইন্টারনেট, অনলাইনে থাকলে)",

  "home.map.aria": "Nostr রিলের অবস্থানের বিশ্বমানচিত্র",
  "home.map.summary": "Nostr সেতু · বিশ্বজুড়ে {locations} জুড়ে {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "এটি যা করে",
  "home.features.title": "সত্যিকারের একটি মেসেঞ্জার, ডেমো নয়।",
  "home.features.sub":
    "চ্যাট, পরিচয়, নেটওয়ার্ক আর টাকা। সবটাই এমনভাবে বানানো যাতে সিগন্যাল ছাড়া, অ্যাকাউন্ট ছাড়া আর মাঝখানে কিছু ছাড়াই চলে।",

  "home.features.messaging.title": "বার্তা",
  "home.features.messaging.summary": "একটি মেসেঞ্জারে যা যা থাকে, পিছনে শূন্য পরিকাঠামো নিয়ে।",
  "home.features.messaging.dms.name": "ব্যক্তিগত সরাসরি বার্তা",
  "home.features.messaging.dms.line":
    "প্রান্ত থেকে প্রান্তে এনক্রিপ্ট করা, ডেলিভারি ও পঠিত রসিদসহ।",
  "home.features.messaging.location.name": "অবস্থান চ্যানেল",
  "home.features.messaging.location.line":
    "জায়গার সাথে বাঁধা ঘর, এক ব্লক থেকে একটি অঞ্চল পর্যন্ত।",
  "home.features.messaging.groups.name": "ব্যক্তিগত চ্যানেল ও গ্রুপ",
  "home.features.messaging.groups.line":
    "ঘরের জন্য আমন্ত্রণ লিঙ্ক, নয়তো 16 জন পর্যন্ত স্বাক্ষরিত তালিকা।",
  "home.features.messaging.board.name": "নোটিশ বোর্ড",
  "home.features.messaging.board.line": "একটি এলাকায় সাত দিন পর্যন্ত আটকে থাকা নোটিশ।",
  "home.features.messaging.voice.name": "সরাসরি কণ্ঠ",
  "home.features.messaging.voice.line":
    "মাইক চেপে ধরে নাগালের যে কারও সাথে কথা বলুন, ওয়াকি-টকির মতো।",
  "home.features.messaging.notes.name": "ভয়েস নোট",
  "home.features.messaging.notes.line": "রেকর্ড করা অডিও, পথের নির্দেশ টাইপ করার চেয়ে দ্রুত।",
  "home.features.messaging.files.name": "ছবি, ভিডিও ও ফাইল",
  "home.features.messaging.files.line": "যেকোনো ফরম্যাট, 1 MiB পর্যন্ত, সিগন্যাল ছাড়াই।",
  "home.features.messaging.forward.name": "জমিয়ে রেখে এগিয়ে দেওয়া",
  "home.features.messaging.forward.line":
    "সিল করা অবস্থায় কাছের কোনো ফোন বয়ে নিয়ে যায়, যতক্ষণ না তাদের কাছে পৌঁছায়।",

  "home.features.identity.title": "পরিচয়",
  "home.features.identity.summary": "নিবন্ধন করার কিছু নেই, বাজেয়াপ্ত করার কিছু নেই।",
  "home.features.identity.keys.name": "কী জোড়ার পরিচয়",
  "home.features.identity.keys.line": "এই ফোনেই তৈরি, OS-এর কীচেইনে রাখা।",
  "home.features.identity.names.name": "পড়ার মতো নাম",
  "home.features.identity.names.line": "আপনার কী থেকে তৈরি, তাই আপনারটি কেউ নিতে পারে না।",
  "home.features.identity.qr.name": "QR পরিচিতি",
  "home.features.identity.qr.line": "একবার স্ক্যানেই তাদের কী আসে, শুধু নাম নয়।",
  "home.features.identity.panic.name": "প্যানিক ওয়াইপ",
  "home.features.identity.panic.line": "সব কী আর বার্তা এক সেকেন্ডের কমে ধ্বংস।",

  "home.features.networking.title": "নেটওয়ার্ক",
  "home.features.networking.summary": "ফোনগুলোই নেটওয়ার্ক।",
  "home.features.networking.mesh.name": "ব্লুটুথ মেশ",
  "home.features.networking.mesh.line": "ইন্টারনেট নেই, রাউটার নেই, মানুষের হাতে থাকা ফোনেই।",
  "home.features.networking.bridge.name": "মেশ সেতু",
  "home.features.networking.bridge.line":
    "আপনার প্রকাশ্য আড্ডাকে নাগালের বাইরে থাকা কাছের একটি দলের সাথে জোড়ে।",
  "home.features.networking.wifi.name": "WiFi দ্রুত পথ",
  "home.features.networking.wifi.line": "দুটি Android বা দুটি iPhone-এর মধ্যে দ্রুততর স্থানান্তর।",
  "home.features.networking.bitchat.name": "bitchat সঙ্গতিপূর্ণ",
  "home.features.networking.bitchat.line": "কোনো সেটআপ ছাড়াই দুটি অ্যাপ একই মেশে যোগ দেয়।",

  "home.features.internet.title": "ইন্টারনেট",
  "home.features.internet.summary": "একটি বাড়তি সুবিধা, কখনোই শর্ত নয়।",
  "home.features.internet.nostr.name": "Nostr বিকল্প",
  "home.features.internet.nostr.line":
    "রেডিওর নাগালের বাইরেও সরাসরি বার্তা আর অবস্থান চ্যানেল চলতে থাকে।",
  "home.features.internet.relays.name": "ভৌগোলিক রিলে খোঁজা",
  "home.features.internet.relays.line": "300-র বেশি স্বাধীন প্রকাশ্য রিলে, একটিও আমাদের নয়।",
  "home.features.internet.gateway.name": "ইন্টারনেট গেটওয়ে",
  "home.features.internet.gateway.line":
    "আপনার সংযোগ ধার দিন, যাতে কাছের অফলাইন কোনো ফোন অবস্থান চ্যানেলে পৌঁছাতে পারে।",
  "home.features.internet.tor.name": "Tor সংযুক্তি",
  "home.features.internet.tor.line": "দুই প্ল্যাটফর্মেই রুট করা, তাই রিলে কখনো আপনার IP দেখে না।",

  "home.features.optional.title": "ঐচ্ছিক",
  "home.features.optional.summary": "শুরুতে বন্ধ। যখন চান তখন চালু।",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line": "পাশের মানুষটিকে টাকা দিন, কোনো ফোন অনলাইনে না থেকেও।",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Lightning নেটওয়ার্কে bitcoin ভরুন বা তুলে নিন।",
  "home.features.optional.ai.name": "স্থানীয় AI",
  "home.features.optional.ai.line": "ডিভাইসেই উত্তর, ফোন থেকে কিছুই বেরোয় না।",
  "home.features.optional.social.name": "সোশ্যাল সেতু",
  "home.features.optional.social.line": "একই পরিচয়ে Bluesky আর Mastodon।",

  "home.compare.eyebrow": "তুলনায় কেমন",
  "home.compare.title": "অফলাইন, বাড়তি যন্ত্র ছাড়া, আর খোলা।",
  "home.compare.sub":
    "এখানকার প্রতিটি অ্যাপই কোনো না কোনো কিছুতে ভালো। নেটওয়ার্ক না চললেও চলে কেবল কয়েকটি।",
  "home.compare.col.project": "প্রকল্প",
  "home.compare.col.transport": "পরিবহন",
  "home.compare.col.encryption": "এনক্রিপশন",
  "home.compare.col.offline": "অফলাইনে চলে",
  "home.compare.col.hardware_free": "বাড়তি যন্ত্র লাগে না",
  "home.compare.col.open_source": "ওপেন সোর্স",
  "home.compare.mark.yes": "হ্যাঁ",
  "home.compare.mark.no": "না",
  "home.compare.mark.partial": "আংশিক, ক্লায়েন্ট ওপেন সোর্স, সার্ভার নয়",
  "home.compare.mark.partial_hint": "ক্লায়েন্ট ওপেন সোর্স, সার্ভার নয়",
  "home.compare.transport.servers": "কেন্দ্রীভূত সার্ভার",
  "home.compare.transport.onion": "অনিয়ন রাউটিং (সার্ভিস নোড)",
  "home.compare.transport.nostr": "Nostr রিলে",
  "home.compare.transport.lora": "LoRa রেডিও",
  "home.compare.transport.sub_ghz": "মালিকানাধীন সাব-GHz রেডিও",

  "home.explore.eyebrow": "খোলা আর সৎ",
  "home.explore.title": "এখানকার প্রতিটি দাবিই যাচাই করা যায়।",
  "home.explore.sub":
    "কোড, প্রোটোকল আর পরিকল্পনা সবই প্রকাশ্য। সীমাবদ্ধতাগুলোও। আমাদের কথায় ভরসা করার আগে নিজেই দেখে নিন।",
  "home.explore.audit.chip": "নিরীক্ষা বাকি",
  "home.explore.audit.headline": "Airhop-এর এখনো বাইরের কোনো নিরাপত্তা নিরীক্ষা হয়নি।",
  "home.explore.audit.body":
    "{headline} সব কোড নিজে হাতে পর্যালোচনা করা হয় আর প্রকাশের আগে একটি {review}-এর মধ্য দিয়ে যায়, আর এটি যে ক্রিপ্টোগ্রাফিক লাইব্রেরি ব্যবহার করে তা Cure53 নিরীক্ষিত, কিন্তু তা অ্যাপটির নিজের আনুষ্ঠানিক নিরীক্ষার বিকল্প নয়। {version}-এর জন্য একটি নিরীক্ষা পরিকল্পনা করা আছে। তার আগ পর্যন্ত সংবেদনশীল কাজে এর উপর ভরসা করবেন না।",
  "home.explore.audit.link.review": "নিরাপত্তা পর্যালোচনা এজেন্ট",
  "home.explore.source.title": "সোর্স কোড",
  "home.explore.source.desc":
    "সবকিছু GitHub-এ MIT লাইসেন্সে। ইস্যু, পুল রিকোয়েস্ট আর আলোচনা সবই খোলা।",
  "home.explore.protocol.title": "প্রোটোকল স্পেসিফিকেশন",
  "home.explore.protocol.desc":
    "হুবহু ওয়্যার ফরম্যাট, BLE UUID আর ধ্রুবক, bitchat-এর সাথে ভাগ করা।",
  "home.explore.architecture.title": "আর্কিটেকচার",
  "home.explore.architecture.desc": "পুরো কারিগরি বিশ্লেষণ, পাঠাও চাপা থেকে রেডিওর বাইট পর্যন্ত।",
  "home.explore.roadmap.title": "রোডম্যাপ",
  "home.explore.roadmap.desc": "v0.5.0 থেকে v2.0.0 পর্যন্ত সংস্করণের লক্ষ্য, পরিকল্পিত নিরীক্ষাসহ।",
  "home.explore.vision.title": "দৃষ্টিভঙ্গি",
  "home.explore.vision.desc": "Airhop কেন আছে, আর যে নীতিগুলো চাপের মুখেও বদলায় না।",
  "home.explore.brand.title": "ব্র্যান্ড কিট",
  "home.explore.brand.desc": "পিক্সেল পাখি, রঙ ও টাইপ টোকেন, প্রেস উপকরণ আর প্রস্তুত লেখা।",

  "home.contribute.eyebrow": "এই প্রকল্পকে সমর্থন করুন",
  "home.contribute.title": "স্বাধীন, আর সবার সামনে।",
  "home.contribute.sub":
    "কোনো বিনিয়োগকারী নেই, বিজ্ঞাপন নেই, টাকার কোনো স্তরও নেই। যেভাবেই হোক প্রতিটি সুবিধা বিনামূল্যেই থাকে, আর যাঁরা একে কাজের মনে করেন তাঁদের টাকাতেই কাজটা চলে।",
  "home.contribute.contribute.chip": "অবদান রাখুন",
  "home.contribute.contribute.body":
    "রিপোজিটরিতে তারা দিন, ইস্যু খুলুন আর পুল রিকোয়েস্ট পাঠান। বাগের খবর, সুবিধার প্রস্তাব আর কোডের অবদান সবই স্বাগত।",
  "home.contribute.contribute.cta": "GitHub-এ দেখুন",
  "home.contribute.sponsor.chip": "পৃষ্ঠপোষকতা",
  "home.contribute.sponsor.body":
    "Airhop আপনার কাজে লাগলে একবারের অনুদান বা নিয়মিত পৃষ্ঠপোষকতা উন্নয়ন চালু রাখতে অনেকটা এগিয়ে দেয়।",
  "home.contribute.sponsor.donate": "একবার দান করুন",
  "home.contribute.sponsor.github": "GitHub-এ পৃষ্ঠপোষক হোন",

  "page.architecture.eyebrow": "নথিপত্র",
  "page.architecture.title": "আর্কিটেকচার",
  "page.architecture.toc": "এই পাতায়",

  "page.faq.eyebrow": "সাধারণ প্রশ্ন",
  "page.faq.title": "প্রায়ই জিজ্ঞাসা করা প্রশ্ন",
  "page.faq.meta": "Airhop নিয়ে সাধারণ প্রশ্ন।",
  "page.faq.contact":
    "এখানে উত্তর নেই এমন প্রশ্ন {email}-এ পাঠানো যায়, কিংবা {github}-এ আলোচনা খুলে তোলা যায়।",

  "page.blogs.eyebrow": "ব্লগ",
  "page.blogs.title": "শীঘ্রই আসছে",
  "page.blogs.body": "মেশ নেটওয়ার্কিং, গোপনীয়তা আর অফলাইন-প্রথম সফটওয়্যার নিয়ে লেখা।",

  "page.brand.eyebrow": "ব্র্যান্ড",
  "page.brand.title": "ব্র্যান্ড কিট",
  "page.brand.meta":
    "কোনো লেখায়, স্টোরের পাতায়, আলোচনায় বা README-তে Airhop রাখার উপকরণ ও নিয়ম। রেফারেন্স আর প্রেসের জন্য অবাধে ব্যবহারযোগ্য।",

  "page.legal.eyebrow": "আইনি",
  "page.privacy.title": "গোপনীয়তা নীতি",
  "page.terms.title": "পরিষেবার শর্তাবলি",

  "page.notfound.title": "পাতা পাওয়া যায়নি",
  "page.notfound.body": "আপনি যে পাতাটি খুঁজছেন সেটি নেই, বা সরিয়ে ফেলা হয়েছে।",

  "page.english_only": "এই পাতাটি কেবল ইংরেজিতে আছে।",

  "seo.breadcrumb.home": "হোম",

  "seo.home.title": "Airhop — ব্যক্তিগত, অফলাইন-প্রথম মেসেঞ্জার",
  "seo.home.description":
    "iOS ও Android-এর জন্য ব্যক্তিগত পিয়ার-টু-পিয়ার বার্তা। ইন্টারনেট নেই, সার্ভার নেই, অ্যাকাউন্ট নেই। যেকোনো জায়গায় ব্লুটুথ মেশে যোগাযোগ করুন।",

  "seo.architecture.title": "আর্কিটেকচার — Airhop",
  "seo.architecture.description":
    "Airhop কীভাবে কাজ করে, উপর থেকে নিচ পর্যন্ত: পরিচয়, পরিবহন বাছাই, ব্লুটুথ মেশ, এনক্রিপশন, ইন্টারনেট স্তর, Tor, অফলাইন ecash, ডিভাইসের AI, আর bitchat-সঙ্গতিপূর্ণ ওয়্যার ফরম্যাট।",
  "seo.architecture.breadcrumb": "আর্কিটেকচার",
  "seo.architecture.headline": "Airhop আর্কিটেকচার",
  "seo.architecture.summary":
    "Airhop-এর পুরো কারিগরি বিশ্লেষণ: পরিচয়, পরিবহন, ব্লুটুথ মেশ, এনক্রিপশন, Nostr ইন্টারনেট স্তর, Tor, Cashu ওয়ালেট, ডিভাইসের AI সহকারী, আর ওয়্যার ফরম্যাট।",

  "seo.faq.title": "প্রায়ই জিজ্ঞাসা করা প্রশ্ন — Airhop",
  "seo.faq.description":
    "Airhop-এর ব্লুটুথ মেশ বার্তা, এনক্রিপশন, অফলাইন পেমেন্ট, Nostr ইন্টারনেট স্তর আর bitchat সঙ্গতি নিয়ে উত্তর।",
  "seo.faq.breadcrumb": "সাধারণ প্রশ্ন",

  "seo.blogs.title": "ব্লগ — Airhop",
  "seo.blogs.description": "মেশ নেটওয়ার্কিং, গোপনীয়তা আর অফলাইন-প্রথম সফটওয়্যার নিয়ে লেখা।",
  "seo.blogs.breadcrumb": "ব্লগ",

  "seo.brand.title": "ব্র্যান্ড কিট — Airhop",
  "seo.brand.description":
    "Airhop-এর ব্র্যান্ড কিট: পিক্সেল পাখির প্রতীক, ওয়ার্ডমার্ক, রঙ ও টাইপ টোকেন, প্রেস উপকরণ আর প্রস্তুত লেখা।",
  "seo.brand.breadcrumb": "ব্র্যান্ড কিট",

  "seo.privacy.title": "গোপনীয়তা নীতি — Airhop",
  "seo.privacy.description":
    "Airhop ডেটা নিয়ে কী করে: কোনো অ্যাকাউন্ট নেই, সার্ভার নেই, ট্র্যাকিং নেই। আপনার পরিচয় আর বার্তা আপনার ডিভাইসেই থাকে।",
  "seo.privacy.breadcrumb": "গোপনীয়তা নীতি",

  "seo.terms.title": "পরিষেবার শর্তাবলি — Airhop",
  "seo.terms.description": "Airhop অ্যাপ ও ওয়েবসাইট ব্যবহারের শর্তাবলি।",
  "seo.terms.breadcrumb": "পরিষেবার শর্তাবলি",

  "seo.notfound.title": "পাতা পাওয়া যায়নি — Airhop",
  "seo.notfound.description": "আপনি যে পাতাটি খুঁজছেন সেটি নেই, বা সরিয়ে ফেলা হয়েছে।",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count}টি রিলে",
    other: "{count}টি রিলে",
  },
  "home.map.locations": {
    one: "{count}টি জায়গা",
    other: "{count}টি জায়গা",
  },
};

export const locale: Locale = { strings, plurals };
