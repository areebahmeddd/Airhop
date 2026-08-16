import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "ہوم پر واپس",
  "common.last_updated": "آخری تازہ کاری: {date}",

  "nav.aria": "بنیادی",
  "nav.home": "Airhop ہوم",
  "nav.skip": "مواد پر جائیں",
  "nav.menu.open": "مینو کھولیں",
  "nav.menu.close": "مینو بند کریں",
  "nav.how_it_works": "یہ کیسے کام کرتا ہے",
  "nav.architecture": "فن تعمیر",
  "nav.faq": "عام سوالات",

  "footer.aria": "فوٹر",
  "footer.tagline": "نجی میش رابطہ",
  "footer.credit": "© {author} نے {heart} کے ساتھ بنایا",
  "footer.group.download": "ڈاؤن لوڈ",
  "footer.group.resources": "وسائل",
  "footer.group.social": "سماجی",
  "footer.group.legal": "قانونی",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "فن تعمیر",
  "footer.link.blogs": "بلاگ",
  "footer.link.faq": "عام سوالات",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "شرائط استعمال",
  "footer.link.privacy": "رازداری کی پالیسی",
  "footer.link.license": "منصوبے کا لائسنس",

  "settings.theme.group": "رنگ کی تھیم",
  "settings.theme.light": "روشن تھیم",
  "settings.theme.dark": "گہری تھیم",
  "settings.language.label": "زبان",
  "settings.language.suggestion": "یہ صفحہ اردو میں دیکھیں",
  "settings.language.dismiss": "بند کریں",

  "home.hero.release": "تازہ ترین ریلیز",
  "home.hero.title": "ایسی پیغام رسانی جو انٹرنیٹ کے بغیر چلے۔",
  "home.hero.body":
    "قریبی فون مل کر ایک Bluetooth میش بناتے ہیں اور آپ کے پیغامات سات چھلانگوں تک آگے پہنچاتے ہیں، سرے سے سرے تک خفیہ کاری کے ساتھ۔ {no_servers}، {no_accounts}، {no_tracking}۔",
  "home.hero.body.no_servers": "کوئی سرور نہیں",
  "home.hero.body.no_accounts": "کوئی اکاؤنٹ نہیں",
  "home.hero.body.no_tracking": "کوئی نگرانی نہیں",
  "home.hero.download": "ایپ ڈاؤن لوڈ کریں",
  "home.hero.badges": "MIT لائسنس · مفت اور اوپن سورس · bitchat کے ساتھ ہم آہنگ",
  "home.hero.group.mobile": "موبائل",
  "home.hero.group.desktop": "ڈیسک ٹاپ",
  "home.hero.option.f_droid": "اوپن سورس کیٹلاگ",
  "home.hero.option.apk": "براہ راست ڈاؤن لوڈ",
  "home.hero.option.soon": "جلد آ رہا ہے",

  "home.about.eyebrow": "Airhop کیا ہے",
  "home.about.title": "زیادہ تر ایپس ایک مرکزی سرور پر منحصر ہوتی ہیں۔",
  "home.about.sub":
    "سرور کی نگرانی کی جا سکتی ہے، اسے بند یا بلاک کیا جا سکتا ہے۔ Airhop کے پاس کوئی سرور نہیں، اس لیے نہ دباؤ ڈالنے کے لیے کوئی کمپنی ہے اور نہ بند کرنے کے لیے کوئی سروس۔",
  "home.about.card": "تکنیکی جائزہ",
  "home.about.link.mesh": "Bluetooth Low Energy میش",
  "home.about.link.wire_protocol": "ترسیلی پروٹوکول",
  "home.about.body.built":
    "Airhop ایک اوپن سورس ایپ ہے جو iOS اور Android کے لیے {mesh} پر نجی، آلہ سے آلہ پیغام رسانی فراہم کرتی ہے۔ یہ {bitchat} کی بنیاد پر بنی ہے، اس کے {wire_protocol} اور سیکیورٹی ماڈل کو دوبارہ استعمال کرتی ہے، اور پھر انہیں Tor، آف لائن {ecash} ادائیگیوں اور آف لائن AI کے ساتھ وسیع کرتی ہے۔ یہ بغیر کسی انٹرنیٹ کنیکشن کے کام کرتی ہے، اور پیغامات قریبی آلات کے ذریعے خود بخود آگے بڑھتے ہیں (عمارت کے اندر ہر چھلانگ تقریباً 10 سے 30 میٹر، کھلی جگہ میں اس سے زیادہ)، 7 چھلانگوں تک۔",
  "home.about.body.identity":
    "آپ کی شناخت ایک {ed25519} کلید جوڑا ہے جو آپ کے آلے پر بنتا ہے اور {ios_keychain} یا {android_keystore} میں محفوظ رہتا ہے۔ نہ کوئی اکاؤنٹ ہے، نہ رجسٹریشن، اور نہ کوئی ایسی چیز جو کسی سرور کو چھوئے، یعنی اسے ایسی عارضی ایپ کے طور پر استعمال کیا جا سکتا ہے جو حذف ہونے کے بعد آپ تک پہنچنے والا کچھ نہیں چھوڑتی۔",
  "home.about.body.crypto":
    "ہر سیشن تصدیق شدہ مصافحے کے لیے {noise} پروٹوکول استعمال کرتا ہے۔ محفوظ پیغامات {ratchet} الگورتھم استعمال کرتے ہیں، یعنی اگر بعد میں آپ کا آلہ غیر محفوظ ہو بھی جائے تو آپ کے پرانے پیغامات ناقابل مطالعہ رہتے ہیں۔ ہنگامی صفائی ایک سیکنڈ سے کم میں تمام کلیدیں اور پیغامات تباہ کر دیتی ہے۔",
  "home.about.body.internet":
    "جب آپ اور آپ کا رابطہ Bluetooth کی حد سے باہر ہوں تو {nostr} ریلے انٹرنیٹ کے ذریعے پل کا کام کرتے ہیں، اور {nip17} طرز کے لپٹے ہوئے براہ راست پیغامات استعمال ہوتے ہیں، چنانچہ جب بھی آپ دونوں آن لائن ہوں میش پوری دنیا تک پھیل جاتا ہے۔ {tor} کی سہولت iOS ({arti} کے ذریعے) اور Android ({orbot} کے ذریعے) دونوں پر دستیاب ہے۔",
  "home.about.optional.title": "Airhop میں کچھ اختیاری خصوصیات ہیں جنہیں آپ آن کر سکتے ہیں:",
  "home.about.optional.payments.label": "آف لائن ادائیگیاں:",
  "home.about.optional.payments.body":
    "{cashu} پروٹوکول کے ذریعے میش پر ادائیگیاں بھیجیں اور وصول کریں (صرف Bitcoin)۔",
  "home.about.optional.ai.label": "آف لائن AI:",
  "home.about.optional.ai.body":
    "آلے پر چلنے والا ایک چھوٹا AI معاون جو اہم سوالات کے جواب دے سکتا ہے۔ تمام پروسیسنگ اور ڈیٹا آپ کے آلے پر ہی رہتے ہیں۔",
  "home.about.body.compatible":
    "Airhop پروٹوکول کی سطح پر bitchat کے ساتھ ہم آہنگ ہے۔ ایک ہی میش پر موجود Airhop آلہ اور bitchat آلہ ایک دوسرے کو خود بخود ڈھونڈ لیتے ہیں اور بغیر کسی ترتیب کے پیغامات اور براہ راست پیغامات کا تبادلہ کر سکتے ہیں۔",

  "home.situations.eyebrow": "کب ضرورت پڑتی ہے",
  "home.situations.title": "اس دن کے لیے جب نیٹ ورک بیٹھ جائے۔",
  "home.situations.sub":
    "قدرتی آفات، انٹرنیٹ کی بندش، بڑے مظاہرے، یا نیٹ ورک سے باہر گزارا کوئی عام ہفتہ وار۔",
  "home.situations.disaster.label": "آفت",
  "home.situations.disaster.line":
    "ٹاور بند ہیں۔ بورڈ پر لگا اعلان ہر اس شخص تک پہنچتا ہے جو پاس سے گزرے۔",
  "home.situations.offgrid.label": "نیٹ ورک سے باہر",
  "home.situations.offgrid.line": "راستے پر دوسرا دن۔ سگنل کی آخری لکیر کل غائب ہو گئی۔",
  "home.situations.protest.label": "احتجاج",
  "home.situations.protest.line": "پرچے پر چھپا ایک QR کوڈ جلوس کے لیے ایک خفیہ چینل کھول دیتا ہے۔",
  "home.situations.festival.label": "میلہ",
  "home.situations.festival.line":
    "میدان میں سگنل نہیں۔ پیغامات اجنبیوں کے فون سے ہوتے ہوئے آگے بڑھتے ہیں۔",

  "home.showcase.eyebrow": "ایپ دیکھیں",
  "home.showcase.title": "ایک عام پیغام رساں، بغیر نیٹ ورک کے۔",
  "home.showcase.sub":
    "گفتگو، چینل، ایک والٹ اور ایک شناخت۔ اوپر سے جانی پہچانی، اور نیچے میش سارا کام کرتا ہوا۔",
  "home.showcase.mesh.title": "میش",
  "home.showcase.mesh.caption":
    "حد کے اندر موجود سب لوگ، قربت کے حساب سے سجے ہوئے۔ کسی کو پہلے شامل کرنے کی ضرورت نہیں۔",
  "home.showcase.mesh.alt":
    "Airhop ایپ کی میش اسکرین، جس میں آس پاس کے چار آلات سگنل کی طاقت کے مطابق ریڈار پر دکھائے گئے ہیں۔",
  "home.showcase.chats.title": "گفتگو",
  "home.showcase.chats.caption":
    "عام گفتگو۔ جو فون ہر پیغام آگے بڑھاتے ہیں، وہ اسے کھول نہیں سکتے۔",
  "home.showcase.chats.alt":
    "بجلی کی بندش کے دوران Airhop میں ایک براہ راست گفتگو، جو تین فون کے ذریعے آگے بڑھی۔",
  "home.showcase.channels.title": "چینل",
  "home.showcase.channels.caption":
    "عوامی کمرے، ایک محلے جتنے چھوٹے یا ایک خطے جتنے بڑے، وہاں موجود ہر شخص کے لیے کھلے۔",
  "home.showcase.channels.alt":
    "Airhop ایپ کی گفتگو اسکرین، جس میں محلے، علاقے، شہر اور خطے تک محدود عوامی چینل دکھائے گئے ہیں۔",
  "home.showcase.wallet.title": "والٹ",
  "home.showcase.wallet.caption":
    "اپنے ساتھ کھڑے شخص کو Bluetooth کے ذریعے ecash دیں، جبکہ کوئی فون آن لائن نہ ہو۔",
  "home.showcase.wallet.alt":
    "Airhop ایپ کی والٹ اسکرین، جس میں ecash کا بیلنس دکھایا گیا ہے جسے Bluetooth سے بھیجا جا سکتا ہے۔",
  "home.showcase.identity.title": "شناخت",
  "home.showcase.identity.caption":
    "نہ سائن اپ، نہ فون نمبر، نہ ای میل۔ بس ایک کلید جو اس فون سے کبھی باہر نہیں جاتی۔",
  "home.showcase.identity.alt":
    "Airhop ایپ کی پروفائل اسکرین، جس میں آلے پر بنی ہوئی، بغیر اکاؤنٹ کے شناخت دکھائی گئی ہے۔",

  "home.how.eyebrow": "یہ کیسے کام کرتا ہے",
  "home.how.title": "میش خود بن جاتا ہے۔",
  "home.how.sub":
    "قریبی نوڈ Bluetooth پر خود کو درست کرنے والا میش بنا لیتے ہیں۔ جب انٹرنیٹ ہو تو Nostr ریلے اسے مزید پھیلا دیتے ہیں، اور ایسا کوئی ڈھانچہ نہیں جس پر کسی کا اختیار ہو۔",
  "home.how.cta": "مکمل فن تعمیر پڑھیں",
  "home.how.discover.title": "دریافت",
  "home.how.discover.line":
    "Airhop یا bitchat چلانے والے فون Bluetooth پر ایک دوسرے کو خود بخود ڈھونڈ لیتے ہیں۔ نہ جوڑا بنانا، نہ ترتیب دینا۔",
  "home.how.relay.title": "ترسیل",
  "home.how.relay.line":
    "پیغام فون سے فون تک جاتا ہے، سات چھلانگوں تک۔ درمیان کے فون کبھی نہیں دیکھ پاتے کہ وہ کیا لے جا رہے ہیں۔",
  "home.how.reach.title": "اور دور تک",
  "home.how.reach.line":
    "جب انٹرنیٹ ہو تو Nostr ریلے اسی گفتگو کو اور دور تک لے جاتے ہیں، چاہیں تو Tor کے ذریعے۔",
  "home.how.swipe": "دیکھنے کے لیے سوائپ کریں",
  "home.how.diagram": "BLE میش · مقامی آلہ سے آلہ نیٹ ورک",
  "home.how.legend.node": "BLE میش نوڈ (آف لائن)",
  "home.how.legend.relay": "کئی چھلانگوں والی ترسیل (Noise XX خفیہ کاری)",
  "home.how.legend.bitchat": "اسی میش پر bitchat کے ساتھ ہم آہنگ",
  "home.how.legend.nostr": "Nostr پل (انٹرنیٹ، جب آن لائن ہوں)",

  "home.map.aria": "Nostr ریلے کے مقامات کا عالمی نقشہ",
  "home.map.summary": "Nostr پل · دنیا بھر کے {locations} پر {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}، {relays}",

  "home.features.eyebrow": "یہ کیا کرتا ہے",
  "home.features.title": "ایک اصلی پیغام رساں، کوئی نمونہ نہیں۔",
  "home.features.sub":
    "گفتگو، شناخت، نیٹ ورک اور پیسہ۔ سب کچھ اس طرح بنا ہے کہ بغیر سگنل، بغیر اکاؤنٹ اور بیچ میں کچھ آئے بغیر چلے۔",

  "home.features.messaging.title": "پیغام رسانی",
  "home.features.messaging.summary":
    "وہ سب کچھ جو ایک پیغام رساں میں ہوتا ہے، پیچھے صفر ڈھانچے کے ساتھ۔",
  "home.features.messaging.dms.name": "نجی براہ راست پیغامات",
  "home.features.messaging.dms.line": "سرے سے سرے تک خفیہ، ترسیل اور پڑھے جانے کی رسید کے ساتھ۔",
  "home.features.messaging.location.name": "مقام کے چینل",
  "home.features.messaging.location.line": "کسی جگہ سے جڑے کمرے، ایک محلے سے پورے خطے تک۔",
  "home.features.messaging.groups.name": "نجی چینل اور گروپ",
  "home.features.messaging.groups.line": "کمرے کے لیے دعوتی لنک، یا 16 تک کی دستخط شدہ فہرست۔",
  "home.features.messaging.board.name": "اطلاعاتی بورڈ",
  "home.features.messaging.board.line": "کسی علاقے پر سات دن تک لگے رہنے والے اعلانات۔",
  "home.features.messaging.voice.name": "براہ راست آواز",
  "home.features.messaging.voice.line":
    "مائیک دبائے رکھیں اور حد کے اندر کسی سے بھی بات کریں، واکی ٹاکی کی طرح۔",
  "home.features.messaging.notes.name": "صوتی پیغامات",
  "home.features.messaging.notes.line": "ریکارڈ شدہ آواز، راستہ ٹائپ کرنے سے تیز۔",
  "home.features.messaging.files.name": "تصاویر، ویڈیو اور فائلیں",
  "home.features.messaging.files.line": "کوئی بھی فارمیٹ، 1 MB تک، بغیر کسی سگنل کے۔",
  "home.features.messaging.forward.name": "محفوظ کر کے آگے بھیجنا",
  "home.features.messaging.forward.line":
    "مہربند اور قریبی فون کے ذریعے اٹھایا گیا، جب تک وہ اپنے وصول کنندہ تک نہ پہنچ جائے۔",

  "home.features.identity.title": "شناخت",
  "home.features.identity.summary": "نہ کچھ رجسٹر کرنے کو، نہ کچھ ضبط کرنے کو۔",
  "home.features.identity.keys.name": "کلید جوڑے کی شناخت",
  "home.features.identity.keys.line": "اسی فون پر بنی، نظام کی کلید زنجیر میں محفوظ۔",
  "home.features.identity.names.name": "پڑھے جانے والے نام",
  "home.features.identity.names.line": "آپ کی کلید سے اخذ شدہ، اس لیے آپ کا نام کوئی نہیں لے سکتا۔",
  "home.features.identity.qr.name": "QR رابطے",
  "home.features.identity.qr.line": "ایک اسکین ان کی کلیدیں لاتا ہے، صرف نام نہیں۔",
  "home.features.identity.panic.name": "ہنگامی صفائی",
  "home.features.identity.panic.line": "ہر کلید اور ہر پیغام ایک سیکنڈ سے کم میں تباہ۔",

  "home.features.networking.title": "نیٹ ورکنگ",
  "home.features.networking.summary": "فون ہی نیٹ ورک ہیں۔",
  "home.features.networking.mesh.name": "Bluetooth میش",
  "home.features.networking.mesh.line":
    "نہ انٹرنیٹ، نہ راؤٹر، انہی فونوں پر جو لوگوں کے پاس پہلے سے ہیں۔",
  "home.features.networking.bridge.name": "میش پل",
  "home.features.networking.bridge.line":
    "آپ کی عوامی گفتگو کو حد سے باہر موجود قریبی ہجوم سے جوڑتا ہے۔",
  "home.features.networking.wifi.name": "WiFi تیز راستہ",
  "home.features.networking.wifi.line": "دو Android یا دو iPhone کے درمیان تیز منتقلی۔",
  "home.features.networking.bitchat.name": "bitchat کے ساتھ ہم آہنگ",
  "home.features.networking.bitchat.line":
    "دونوں ایپس بغیر کسی ترتیب کے ایک ہی میش میں شامل ہو جاتی ہیں۔",

  "home.features.internet.title": "انٹرنیٹ",
  "home.features.internet.summary": "ایک اضافہ، کبھی شرط نہیں۔",
  "home.features.internet.nostr.name": "Nostr متبادل",
  "home.features.internet.nostr.line":
    "براہ راست پیغامات اور مقام کے چینل ریڈیو کی حد سے آگے بھی چلتے رہتے ہیں۔",
  "home.features.internet.relays.name": "جغرافیائی ریلے کی تلاش",
  "home.features.internet.relays.line":
    "300 سے زیادہ خودمختار عوامی ریلے، ان میں سے کوئی ہمارا نہیں۔",
  "home.features.internet.gateway.name": "انٹرنیٹ گیٹ وے",
  "home.features.internet.gateway.line":
    "اپنا کنیکشن ادھار دیں تاکہ قریب موجود آف لائن فون مقام کے چینل تک پہنچ سکے۔",
  "home.features.internet.tor.name": "Tor کی شمولیت",
  "home.features.internet.tor.line":
    "دونوں پلیٹ فارم پر راستہ دیا گیا، تاکہ ریلے آپ کا IP کبھی نہ دیکھیں۔",

  "home.features.optional.title": "اختیاری",
  "home.features.optional.summary": "بطور طے شدہ بند۔ جب چاہیں، کھلا۔",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "اپنے ساتھ کھڑے شخص کو ادائیگی کریں، جبکہ کوئی فون آن لائن نہ ہو۔",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Lightning نیٹ ورک پر bitcoin میں رقم ڈالیں یا نکالیں۔",
  "home.features.optional.ai.name": "مقامی AI",
  "home.features.optional.ai.line": "آلے پر ہی جواب، فون سے کچھ باہر نہیں جاتا۔",
  "home.features.optional.social.name": "سماجی پل",
  "home.features.optional.social.line": "اسی شناخت سے Bluesky اور Mastodon۔",

  "home.compare.eyebrow": "موازنے میں",
  "home.compare.title": "آف لائن، بغیر اضافی آلات کے، اور کھلا۔",
  "home.compare.sub":
    "یہاں ہر ایپ کسی نہ کسی چیز میں اچھی ہے۔ مگر ان میں سے صرف کچھ تب بھی چلتی ہیں جب نیٹ ورک نہیں چلتا۔",
  "home.compare.col.project": "منصوبہ",
  "home.compare.col.transport": "ترسیل",
  "home.compare.col.encryption": "خفیہ کاری",
  "home.compare.col.offline": "آف لائن چلتا ہے",
  "home.compare.col.hardware_free": "اضافی آلات نہیں",
  "home.compare.col.open_source": "اوپن سورس",
  "home.compare.mark.yes": "ہاں",
  "home.compare.mark.no": "نہیں",
  "home.compare.mark.partial": "جزوی، کلائنٹ اوپن سورس ہیں، سرور نہیں",
  "home.compare.mark.partial_hint": "کلائنٹ اوپن سورس ہیں، سرور نہیں",
  "home.compare.transport.servers": "مرکزی سرور",
  "home.compare.transport.onion": "پیازی روٹنگ (سروس نوڈ)",
  "home.compare.transport.nostr": "Nostr ریلے",
  "home.compare.transport.lora": "LoRa ریڈیو",
  "home.compare.transport.sub_ghz": "ملکیتی سب GHz ریڈیو",

  "home.explore.eyebrow": "کھلا اور دیانت دار",
  "home.explore.title": "یہاں کیا گیا ہر دعویٰ جانچا جا سکتا ہے۔",
  "home.explore.sub":
    "کوڈ، پروٹوکول اور منصوبے سب عوامی ہیں۔ حدود بھی۔ ہماری بات ماننے سے پہلے خود جانچ لیں۔",
  "home.explore.audit.chip": "آڈٹ باقی ہے",
  "home.explore.audit.headline": "Airhop کا اب تک کوئی بیرونی سیکیورٹی آڈٹ نہیں ہوا۔",
  "home.explore.audit.body":
    "{headline} سارا کوڈ ذاتی طور پر دیکھا جاتا ہے اور جاری کرنے سے پہلے ایک {review} سے گزرتا ہے، اور جو خفیہ کاری کی لائبریری یہ استعمال کرتا ہے اس کا Cure53 آڈٹ ہو چکا ہے، مگر یہ ایپ کے باقاعدہ آڈٹ کی جگہ نہیں لے سکتا۔ ایک آڈٹ {version} کے لیے طے ہے۔ تب تک حساس کاموں کے لیے اس پر انحصار نہ کریں۔",
  "home.explore.audit.link.review": "سیکیورٹی جائزہ ایجنٹ",
  "home.explore.source.title": "سورس کوڈ",
  "home.explore.source.desc": "سب کچھ GitHub پر MIT کے تحت۔ ایشو، پل ریکویسٹ اور بحثیں کھلی ہیں۔",
  "home.explore.protocol.title": "پروٹوکول کی تفصیلات",
  "home.explore.protocol.desc":
    "درست ترسیلی فارمیٹ، BLE UUID اور مستقل اقدار، bitchat کے ساتھ مشترک۔",
  "home.explore.architecture.title": "فن تعمیر",
  "home.explore.architecture.desc":
    "مکمل تکنیکی جائزہ، بھیجیں دبانے سے لے کر ریڈیو پر جاتے بائٹ تک۔",
  "home.explore.roadmap.title": "روڈ میپ",
  "home.explore.roadmap.desc": "v0.5.0 سے v2.0.0 تک کے ورژن اہداف، طے شدہ آڈٹ سمیت۔",
  "home.explore.vision.title": "وژن",
  "home.explore.vision.desc": "Airhop کیوں ہے، اور وہ اصول جو دباؤ میں بھی نہیں بدلتے۔",
  "home.explore.brand.title": "برانڈ کٹ",
  "home.explore.brand.desc": "پکسل پرندہ، رنگ اور طباعت کے ٹوکن، پریس مواد اور تیار متن۔",

  "home.contribute.eyebrow": "اس منصوبے کا ساتھ دیں",
  "home.contribute.title": "خودمختار، اور سب کے سامنے۔",
  "home.contribute.sub":
    "نہ سرمایہ کار ہیں، نہ اشتہار، نہ کوئی ادائیگی والا درجہ۔ ہر خصوصیت ویسے بھی مفت رہتی ہے، اور یہ کام انہی لوگوں سے چلتا ہے جنہیں یہ کارآمد لگتا ہے۔",
  "home.contribute.contribute.chip": "حصہ ڈالیں",
  "home.contribute.contribute.body":
    "ریپازٹری کو ستارہ دیں، ایشو کھولیں اور پل ریکویسٹ بھیجیں۔ بگ رپورٹ، خصوصیات کی تجاویز اور کوڈ میں حصہ، سب خوش آمدید ہیں۔",
  "home.contribute.contribute.cta": "GitHub پر دیکھیں",
  "home.contribute.sponsor.chip": "سرپرستی",
  "home.contribute.sponsor.body":
    "اگر Airhop آپ کے کام آتا ہے تو ایک بار کا عطیہ یا مستقل سرپرستی ترقی کو جاری رکھنے میں بہت مدد دیتی ہے۔",
  "home.contribute.sponsor.donate": "ایک بار عطیہ کریں",
  "home.contribute.sponsor.github": "GitHub پر سرپرست بنیں",

  "page.architecture.eyebrow": "دستاویزات",
  "page.architecture.title": "فن تعمیر",
  "page.architecture.toc": "اس صفحے پر",

  "page.faq.eyebrow": "عام سوالات",
  "page.faq.title": "اکثر پوچھے جانے والے سوالات",
  "page.faq.meta": "Airhop کے بارے میں عام سوالات۔",
  "page.faq.contact":
    "جن سوالوں کے جواب یہاں نہیں، انہیں {email} پر بھیجا جا سکتا ہے یا {github} پر بحث کھول کر پوچھا جا سکتا ہے۔",

  "page.blogs.eyebrow": "بلاگ",
  "page.blogs.title": "جلد آ رہا ہے",
  "page.blogs.body": "میش نیٹ ورکنگ، رازداری اور آف لائن پہلے والے سافٹ ویئر پر تحریریں۔",

  "page.brand.eyebrow": "برانڈ",
  "page.brand.title": "برانڈ کٹ",
  "page.brand.meta":
    "کسی مضمون، اسٹور کی فہرست، تقریر یا README میں Airhop دکھانے کے لیے مواد اور اصول۔ حوالے اور پریس کے لیے آزادانہ دستیاب۔",

  "page.legal.eyebrow": "قانونی",
  "page.privacy.title": "رازداری کی پالیسی",
  "page.terms.title": "شرائط استعمال",

  "page.notfound.title": "صفحہ نہیں ملا",
  "page.notfound.body": "آپ جو صفحہ ڈھونڈ رہے ہیں وہ موجود نہیں یا منتقل کر دیا گیا ہے۔",

  "page.english_only": "یہ صفحہ صرف انگریزی میں دستیاب ہے۔",

  "seo.breadcrumb.home": "ہوم",

  "seo.home.title": "Airhop — نجی، آف لائن پہلے والا پیغام رساں",
  "seo.home.description":
    "iOS اور Android کے لیے نجی، آلہ سے آلہ پیغام رسانی۔ نہ انٹرنیٹ، نہ سرور، نہ اکاؤنٹ۔ کہیں بھی Bluetooth میش پر رابطہ کریں۔",

  "seo.architecture.title": "فن تعمیر — Airhop",
  "seo.architecture.description":
    "Airhop اوپر سے نیچے تک کیسے کام کرتا ہے: شناخت، ترسیل کا انتخاب، Bluetooth میش، خفیہ کاری، انٹرنیٹ کی تہہ، Tor، آف لائن ecash، آلے پر AI، اور bitchat سے ہم آہنگ ترسیلی فارمیٹ۔",
  "seo.architecture.breadcrumb": "فن تعمیر",
  "seo.architecture.headline": "Airhop کا فن تعمیر",
  "seo.architecture.summary":
    "Airhop کا مکمل تکنیکی جائزہ: شناخت، ترسیل کے ذرائع، Bluetooth میش، خفیہ کاری، Nostr انٹرنیٹ تہہ، Tor، Cashu والٹ، آلے پر AI معاون، اور ترسیلی فارمیٹ۔",

  "seo.faq.title": "اکثر پوچھے جانے والے سوالات — Airhop",
  "seo.faq.description":
    "Airhop کی Bluetooth میش پیغام رسانی، خفیہ کاری، آف لائن ادائیگیوں، Nostr انٹرنیٹ تہہ اور bitchat سے ہم آہنگی کے بارے میں جوابات۔",
  "seo.faq.breadcrumb": "عام سوالات",

  "seo.blogs.title": "بلاگ — Airhop",
  "seo.blogs.description": "میش نیٹ ورکنگ، رازداری اور آف لائن پہلے والے سافٹ ویئر پر تحریریں۔",
  "seo.blogs.breadcrumb": "بلاگ",

  "seo.brand.title": "برانڈ کٹ — Airhop",
  "seo.brand.description":
    "Airhop برانڈ کٹ: پکسل پرندے کا نشان، لفظی نشان، رنگ اور طباعت کے ٹوکن، پریس مواد اور تیار متن۔",
  "seo.brand.breadcrumb": "برانڈ کٹ",

  "seo.privacy.title": "رازداری کی پالیسی — Airhop",
  "seo.privacy.description":
    "Airhop ڈیٹا کو کیسے سنبھالتا ہے: نہ اکاؤنٹ، نہ سرور، نہ نگرانی۔ آپ کی شناخت اور پیغامات آپ کے آلے پر ہی رہتے ہیں۔",
  "seo.privacy.breadcrumb": "رازداری کی پالیسی",

  "seo.terms.title": "شرائط استعمال — Airhop",
  "seo.terms.description": "Airhop ایپ اور ویب سائٹ کے استعمال کو کنٹرول کرنے والی شرائط۔",
  "seo.terms.breadcrumb": "شرائط استعمال",

  "seo.notfound.title": "صفحہ نہیں ملا — Airhop",
  "seo.notfound.description": "آپ جو صفحہ ڈھونڈ رہے ہیں وہ موجود نہیں یا منتقل کر دیا گیا ہے۔",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} ریلے",
    other: "{count} ریلے",
  },
  "home.map.locations": {
    one: "{count} مقام",
    other: "{count} مقامات",
  },
};

export const locale: Locale = { strings, plurals };
