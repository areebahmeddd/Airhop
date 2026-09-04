import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "بازگشت به خانه",
  "common.last_updated": "آخرین به‌روزرسانی: {date}",

  "nav.aria": "ناوبری اصلی",
  "nav.home": "صفحهٔ خانهٔ Airhop",
  "nav.skip": "پرش به محتوا",
  "nav.menu.open": "باز کردن منو",
  "nav.menu.close": "بستن منو",
  "nav.how_it_works": "چطور کار می‌کند",
  "nav.architecture": "معماری",
  "nav.faq": "پرسش‌های متداول",

  "footer.aria": "پاورقی",
  "footer.tagline": "ارتباط مش خصوصی",
  "footer.credit": "© ساخته‌شده با {heart} به دست {author}",
  "footer.group.download": "دانلود",
  "footer.group.resources": "منابع",
  "footer.group.social": "شبکه‌های اجتماعی",
  "footer.group.legal": "حقوقی",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "معماری",
  "footer.link.blogs": "بلاگ",
  "footer.link.faq": "پرسش‌های متداول",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "شرایط استفاده",
  "footer.link.privacy": "سیاست حریم خصوصی",
  "footer.link.license": "پروانهٔ پروژه",

  "settings.theme.group": "پوستهٔ رنگی",
  "settings.theme.light": "پوستهٔ روشن",
  "settings.theme.dark": "پوستهٔ تیره",
  "settings.language.label": "زبان",
  "settings.language.suggestion": "این صفحه را به فارسی ببینید",
  "settings.language.dismiss": "بستن",

  "home.hero.release": "آخرین نسخه",
  "home.hero.title": "پیام‌رسانی که بدون اینترنت کار می‌کند.",
  "home.hero.body":
    "گوشی‌های نزدیک یک شبکهٔ مش Bluetooth می‌سازند و پیام‌های شما را جابه‌جا می‌کنند، با رمزنگاری سرتاسری. {no_servers}، {no_accounts}، {no_tracking}.",
  "home.hero.body.no_servers": "بدون سرور",
  "home.hero.body.no_accounts": "بدون حساب کاربری",
  "home.hero.body.no_tracking": "بدون ردیابی",
  "home.hero.download": "دانلود اپلیکیشن",
  "home.hero.badges": "پروانهٔ MIT · رایگان و متن‌باز · سازگار با bitchat",
  "home.hero.group.mobile": "موبایل",
  "home.hero.group.desktop": "دسکتاپ",
  "home.hero.option.zapstore": "امضاشده در Nostr",
  "home.hero.option.apk": "دانلود مستقیم",
  "home.hero.option.soon": "به‌زودی",

  "home.about.eyebrow": "Airhop چیست",
  "home.about.title": "بیشتر اپلیکیشن‌ها به یک سرور مرکزی وابسته‌اند.",
  "home.about.sub":
    "سرور را می‌شود زیر نظر گرفت، خاموش کرد یا مسدود کرد. Airhop سروری ندارد، پس نه شرکتی هست که زیر فشار برود و نه سرویسی که بسته شود.",
  "home.about.card": "نگاه فنی",
  "home.about.link.mesh": "شبکهٔ مش Bluetooth Low Energy",
  "home.about.link.wire_protocol": "پروتکل انتقال",
  "home.about.body.built":
    "‏Airhop یک اپلیکیشن متن‌باز برای iOS و Android است برای پیام‌رسانی خصوصی نظیربه‌نظیر روی {mesh}. این اپلیکیشن بر پایهٔ {bitchat} ساخته شده، {wire_protocol} و مدل امنیتی آن را دوباره به کار می‌گیرد و سپس آن را با پرداخت‌های آفلاین {ecash} و هوش مصنوعی آفلاین گسترش می‌دهد. بدون هیچ اتصال اینترنتی کار می‌کند و پیام‌ها به‌طور خودکار میان دستگاه‌های نزدیک جابه‌جا می‌شوند (حدود ۱۰ تا ۳۰ متر در هر پرش در فضای بسته و بیشتر در فضای باز)، تا ۷ پرش.",
  "home.about.body.identity":
    "هویت شما یک جفت‌کلید {ed25519} است که روی دستگاه خودتان ساخته و در {ios_keychain} یا {android_keystore} نگهداری می‌شود. نه حسابی هست، نه ثبت‌نامی، و نه چیزی که به سروری برسد؛ یعنی می‌شود آن را مثل یک اپلیکیشن یک‌بارمصرف به کار برد که پس از حذف هیچ ردی از شما باقی نمی‌گذارد.",
  "home.about.body.crypto":
    "هر نشست برای دست‌دادن احرازهویت‌شده از پروتکل {noise} استفاده می‌کند. پیام‌های ذخیره‌شده از الگوریتم {ratchet} استفاده می‌کنند؛ یعنی حتی اگر بعدها دستگاهتان به خطر بیفتد، پیام‌های گذشته‌تان خوانا نمی‌شود. پاک‌سازی اضطراری همهٔ کلیدها و پیام‌ها را در کمتر از یک ثانیه از بین می‌برد.",
  "home.about.body.internet":
    "وقتی شما و مخاطبتان بیرون از برد Bluetooth هستید، رله‌های {nostr} نقش پل اینترنتی را بازی می‌کنند و از پیام‌های مستقیم بسته‌بندی‌شده به شکل {nip17} استفاده می‌کنند، پس تا وقتی هر دو آنلاین باشید مش تا سراسر جهان گسترش می‌یابد. پشتیبانی از {tor} روی iOS و Android از طریق {arti} در دسترس است، همراه با پل‌های {obfs4} و {snowflake} برای شبکه‌هایی که Tor را مسدود می‌کنند.",
  "home.about.optional.title": "‏Airhop قابلیت‌های اختیاری دارد که می‌توانید فعال کنید:",
  "home.about.optional.payments.label": "پرداخت آفلاین:",
  "home.about.optional.payments.body":
    "با پروتکل {cashu} روی شبکهٔ مش پرداخت بفرستید و دریافت کنید (فقط Bitcoin).",
  "home.about.optional.ai.label": "هوش مصنوعی آفلاین:",
  "home.about.optional.ai.body":
    "یک دستیار هوش مصنوعی کوچک روی دستگاه که می‌تواند به پرسش‌های مهم پاسخ دهد. تمام پردازش و داده‌ها روی دستگاه شما می‌ماند.",
  "home.about.body.compatible":
    "‏Airhop در سطح پروتکل با bitchat سازگار است. یک دستگاه Airhop و یک دستگاه bitchat روی یک مش، خودکار همدیگر را پیدا می‌کنند و بدون هیچ پیکربندی می‌توانند پیام و پیام مستقیم رد و بدل کنند.",

  "home.situations.eyebrow": "کِی به دردتان می‌خورد",
  "home.situations.title": "برای روزی که شبکه از کار بیفتد.",
  "home.situations.sub":
    "بلایای طبیعی، قطعی اینترنت، اعتراض‌های گسترده، یا یک آخر هفتهٔ معمولی بیرون از پوشش.",
  "home.situations.disaster.label": "بحران",
  "home.situations.disaster.line":
    "دکل‌ها از کار افتاده‌اند. یک اعلان روی تابلو به هر کسی که رد شود می‌رسد.",
  "home.situations.offgrid.label": "بیرون از شبکه",
  "home.situations.offgrid.line": "روز دوم مسیر. آخرین خط آنتن دیروز ناپدید شد.",
  "home.situations.protest.label": "اعتراض",
  "home.situations.protest.line":
    "یک کد QR روی یک تراکت، کانالی رمزگذاری‌شده برای راهپیمایی باز می‌کند.",
  "home.situations.festival.label": "جشنواره",
  "home.situations.festival.line": "در محوطه آنتن نیست. پیام‌ها از گوشی غریبه‌ها پرش می‌کنند.",

  "home.showcase.eyebrow": "اپلیکیشن را ببینید",
  "home.showcase.title": "یک پیام‌رسان معمولی، آفلاین.",
  "home.showcase.sub":
    "گفت‌وگو، کانال، کیف پول و هویت. روی سطح آشنا، و زیرش یک مش که کار را انجام می‌دهد.",
  "home.showcase.mesh.title": "مش",
  "home.showcase.mesh.caption":
    "همهٔ کسانی که در برد هستند، بر اساس نزدیکی چیده شده‌اند. لازم نیست کسی را از قبل اضافه کنید.",
  "home.showcase.mesh.alt":
    "صفحهٔ مش در اپلیکیشن Airhop که چهار دستگاه نزدیک را بر اساس قدرت سیگنال روی یک رادار نشان می‌دهد.",
  "home.showcase.chats.title": "گفت‌وگوها",
  "home.showcase.chats.caption":
    "گفت‌وگوهای معمولی. گوشی‌هایی که هر پیام را جابه‌جا می‌کنند نمی‌توانند بازش کنند.",
  "home.showcase.chats.alt":
    "یک گفت‌وگوی پیام مستقیم در Airhop هنگام قطعی برق، جابه‌جا شده از میان سه گوشی.",
  "home.showcase.channels.title": "کانال‌ها",
  "home.showcase.channels.caption":
    "اتاق‌های عمومی به کوچکی یک بلوک یا به بزرگی یک منطقه، باز برای هر کسی که آنجاست.",
  "home.showcase.channels.alt":
    "صفحهٔ گفت‌وگوهای اپلیکیشن Airhop که کانال‌های عمومی محدود به بلوک، محله، شهر و منطقه را فهرست می‌کند.",
  "home.showcase.wallet.title": "کیف پول",
  "home.showcase.wallet.caption":
    "به کسی که کنارتان است با Bluetooth ecash بدهید، بی‌آنکه هیچ‌کدام از گوشی‌ها آنلاین باشد.",
  "home.showcase.wallet.alt":
    "صفحهٔ کیف پول اپلیکیشن Airhop که موجودی ecash قابل ارسال با Bluetooth را نشان می‌دهد.",
  "home.showcase.identity.title": "هویت",
  "home.showcase.identity.caption":
    "بدون ثبت‌نام، بدون شمارهٔ تلفن، بدون ایمیل. فقط کلیدی که هرگز از این گوشی بیرون نمی‌رود.",
  "home.showcase.identity.alt":
    "صفحهٔ نمایهٔ اپلیکیشن Airhop که هویتی ساخته‌شده روی دستگاه و بدون حساب کاربری را نشان می‌دهد.",

  "home.how.eyebrow": "چطور کار می‌کند",
  "home.how.title": "مش خودش شکل می‌گیرد.",
  "home.how.sub":
    "گره‌های نزدیک روی Bluetooth یک مش خودترمیم می‌سازند. وقتی اینترنت باشد، رله‌های Nostr آن را گسترش می‌دهند، بدون زیرساختی که در اختیار کسی باشد.",
  "home.how.cta": "خواندن معماری کامل",
  "home.how.discover.title": "کشف",
  "home.how.discover.line":
    "گوشی‌هایی که Airhop یا bitchat دارند خودکار روی Bluetooth همدیگر را پیدا می‌کنند. بدون جفت‌سازی، بدون تنظیمات.",
  "home.how.relay.title": "بازپخش",
  "home.how.relay.line":
    "پیام از گوشی به گوشی می‌پرد، تا هفت پرش. گوشی‌های میانی هرگز نمی‌بینند چه چیزی حمل می‌کنند.",
  "home.how.reach.title": "دورتر",
  "home.how.reach.line":
    "وقتی اینترنت باشد، رله‌های Nostr همان گفت‌وگو را دورتر می‌برند، در صورت تمایل از راه Tor.",
  "home.how.swipe": "برای کاوش بکشید",
  "home.how.diagram": "مش BLE · شبکهٔ محلی نظیربه‌نظیر",
  "home.how.legend.node": "گرهٔ مش BLE (آفلاین)",
  "home.how.legend.relay": "بازپخش چندپرشی (رمزگذاری‌شده با Noise XX)",
  "home.how.legend.bitchat": "سازگار با bitchat روی همان مش",
  "home.how.legend.nostr": "پل Nostr (اینترنت، هنگام آنلاین بودن)",

  "home.map.aria": "نقشهٔ جهانی موقعیت رله‌های Nostr",
  "home.map.summary": "پل Nostr · {relays} در {locations} در سراسر جهان",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}، {relays}",

  "home.features.eyebrow": "چه کاری می‌کند",
  "home.features.title": "یک پیام‌رسان واقعی، نه یک نمونهٔ نمایشی.",
  "home.features.sub":
    "گفت‌وگو، هویت، شبکه و پول. همه‌اش طوری ساخته شده که بدون آنتن، بدون حساب کاربری و بدون واسطه کار کند.",

  "home.features.messaging.title": "پیام‌رسانی",
  "home.features.messaging.summary": "هر چیزی که یک پیام‌رسان دارد، بدون هیچ زیرساختی پشت آن.",
  "home.features.messaging.dms.name": "پیام‌های مستقیم خصوصی",
  "home.features.messaging.dms.line": "رمزگذاری سرتاسری، همراه با رسید تحویل و خوانده‌شدن.",
  "home.features.messaging.location.name": "کانال‌های مکانی",
  "home.features.messaging.location.line":
    "اتاق‌هایی گره‌خورده به یک مکان، از یک بلوک تا یک منطقه.",
  "home.features.messaging.groups.name": "کانال‌ها و گروه‌های خصوصی",
  "home.features.messaging.groups.line": "پیوند دعوت برای یک اتاق، یا فهرستی امضاشده تا ۱۶ نفر.",
  "home.features.messaging.board.name": "تابلوی اعلانات",
  "home.features.messaging.board.line": "اعلان‌هایی که تا هفت روز به یک محدوده سنجاق می‌شوند.",
  "home.features.messaging.voice.name": "صدای زنده",
  "home.features.messaging.voice.line":
    "میکروفون را نگه دارید و با هر کسی در برد حرف بزنید، مثل بی‌سیم.",
  "home.features.messaging.notes.name": "پیام صوتی",
  "home.features.messaging.notes.line": "صدای ضبط‌شده، سریع‌تر از تایپ کردن مسیر.",
  "home.features.messaging.files.name": "عکس، ویدیو و فایل",
  "home.features.messaging.files.line": "هر قالبی، تا ۱ MiB، بدون نیاز به آنتن.",
  "home.features.messaging.forward.name": "ذخیره و ارسال",
  "home.features.messaging.forward.line":
    "مهر و موم‌شده و حمل‌شده توسط گوشی‌ای نزدیک تا به دستشان برسد.",

  "home.features.identity.title": "هویت",
  "home.features.identity.summary": "نه چیزی برای ثبت‌نام، نه چیزی برای مصادره.",
  "home.features.identity.keys.name": "هویت با جفت‌کلید",
  "home.features.identity.keys.line": "روی همین گوشی ساخته می‌شود و در کلیدخانهٔ سیستم می‌ماند.",
  "home.features.identity.names.name": "نام‌های خوانا",
  "home.features.identity.names.line":
    "از کلید شما مشتق می‌شوند، پس کسی نمی‌تواند نام شما را بردارد.",
  "home.features.identity.qr.name": "مخاطبان با QR",
  "home.features.identity.qr.line": "یک بار اسکن، کلیدهایشان را می‌آورد، نه فقط نامشان را.",
  "home.features.identity.panic.name": "پاک‌سازی اضطراری",
  "home.features.identity.panic.line": "همهٔ کلیدها و پیام‌ها در کمتر از یک ثانیه از بین می‌روند.",

  "home.features.networking.title": "شبکه",
  "home.features.networking.summary": "خود گوشی‌ها شبکه‌اند.",
  "home.features.networking.mesh.name": "مش Bluetooth",
  "home.features.networking.mesh.line":
    "بدون اینترنت، بدون روتر، روی گوشی‌هایی که مردم همین حالا دارند.",
  "home.features.networking.bridge.name": "پل مش",
  "home.features.networking.bridge.line":
    "گفت‌وگوی عمومی شما را به جمعی نزدیک اما بیرون از برد وصل می‌کند.",
  "home.features.networking.wifi.name": "مسیر سریع WiFi",
  "home.features.networking.wifi.line": "انتقال سریع‌تر میان دو Android یا دو iPhone.",
  "home.features.networking.bitchat.name": "سازگار با bitchat",
  "home.features.networking.bitchat.line": "هر دو اپلیکیشن بدون تنظیمات به یک مش می‌پیوندند.",

  "home.features.internet.title": "اینترنت",
  "home.features.internet.summary": "یک افزوده، نه هرگز یک شرط.",
  "home.features.internet.nostr.name": "پشتیبان Nostr",
  "home.features.internet.nostr.line":
    "پیام‌های مستقیم و کانال‌های مکانی فراتر از برد رادیویی هم جاری می‌مانند.",
  "home.features.internet.relays.name": "کشف رله‌های جغرافیایی",
  "home.features.internet.relays.line": "بیش از ۳۰۰ رلهٔ عمومی مستقل، که هیچ‌کدام مال ما نیست.",
  "home.features.internet.gateway.name": "دروازهٔ اینترنت",
  "home.features.internet.gateway.line":
    "اتصالتان را قرض بدهید تا گوشی آفلاین نزدیک به کانال‌های مکانی برسد.",
  "home.features.internet.tor.name": "یکپارچگی با Tor",
  "home.features.internet.tor.line":
    "روی هر دو پلتفرم مسیریابی می‌شود، پس رله‌ها هرگز IP شما را نمی‌بینند.",

  "home.features.optional.title": "اختیاری",
  "home.features.optional.summary": "به‌طور پیش‌فرض خاموش. هر وقت خواستید روشن.",
  "home.features.optional.cashu.name": "ecash با Cashu",
  "home.features.optional.cashu.line":
    "به کسی که کنارتان است پرداخت کنید، بی‌آنکه هیچ گوشی‌ای آنلاین باشد.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "شارژ یا برداشت با bitcoin روی شبکهٔ Lightning.",
  "home.features.optional.ai.name": "هوش مصنوعی محلی",
  "home.features.optional.ai.line": "پاسخ روی خود دستگاه، هیچ چیزی از گوشی بیرون نمی‌رود.",
  "home.features.optional.social.name": "پل‌های اجتماعی",
  "home.features.optional.social.line": "‏Bluesky و Mastodon با همان هویت.",

  "home.compare.eyebrow": "در مقایسه",
  "home.compare.title": "آفلاین، بدون سخت‌افزار اضافه، و باز.",
  "home.compare.sub":
    "هر اپلیکیشنی اینجا در چیزی خوب است. اما فقط بعضی‌ها وقتی شبکه از کار می‌افتد باز هم کار می‌کنند.",
  "home.compare.col.project": "پروژه",
  "home.compare.col.transport": "بستر انتقال",
  "home.compare.col.encryption": "رمزنگاری",
  "home.compare.col.offline": "کار آفلاین",
  "home.compare.col.hardware_free": "بدون سخت‌افزار اضافه",
  "home.compare.col.open_source": "متن‌باز",
  "home.compare.mark.yes": "بله",
  "home.compare.mark.no": "خیر",
  "home.compare.mark.partial": "نسبی، کلاینت‌ها متن‌باز هستند اما سرورها نه",
  "home.compare.mark.partial_hint": "کلاینت‌ها متن‌باز هستند اما سرورها نه",
  "home.compare.transport.servers": "سرورهای متمرکز",
  "home.compare.transport.onion": "مسیریابی پیازی (گره‌های سرویس)",
  "home.compare.transport.nostr": "رله‌های Nostr",
  "home.compare.transport.lora": "رادیو LoRa",
  "home.compare.transport.sub_ghz": "رادیو اختصاصی زیر یک گیگاهرتز",

  "home.explore.eyebrow": "باز و صادق",
  "home.explore.title": "هر ادعایی اینجا قابل بررسی است.",
  "home.explore.sub":
    "کد، پروتکل و برنامه‌ها عمومی‌اند. محدودیت‌ها هم همین‌طور. پیش از آنکه حرف ما را بپذیرید، خودتان بررسی کنید.",
  "home.explore.audit.chip": "ممیزی در انتظار",
  "home.explore.audit.headline": "‏Airhop هنوز ممیزی امنیتی بیرونی نداشته است.",
  "home.explore.audit.body":
    "{headline} تمام کد شخصاً بازبینی می‌شود و پیش از انتشار از یک {review} می‌گذرد، و کتابخانهٔ رمزنگاری آن توسط Cure53 ممیزی شده است، اما هیچ‌کدام جای ممیزی رسمی خودِ اپلیکیشن را نمی‌گیرد. یک ممیزی برای {version} برنامه‌ریزی شده است. تا آن زمان برای کاربردهای حساس به آن تکیه نکنید.",
  "home.explore.audit.link.review": "عامل بازبینی امنیتی",
  "home.explore.source.title": "کد منبع",
  "home.explore.source.desc":
    "همه چیز روی GitHub با پروانهٔ MIT. ایشوها، pull request ها و بحث‌ها باز هستند.",
  "home.explore.protocol.title": "مشخصات پروتکل",
  "home.explore.protocol.desc": "قالب دقیق انتقال، UUID های BLE و ثابت‌ها، مشترک با bitchat.",
  "home.explore.architecture.title": "معماری",
  "home.explore.architecture.desc": "تفکیک فنی کامل، از زدن دکمهٔ ارسال تا بایت‌ها روی امواج.",
  "home.explore.roadmap.title": "نقشهٔ راه",
  "home.explore.roadmap.desc":
    "هدف‌های نسخه‌ها از v0.5.0 تا v2.0.0، از جمله ممیزی برنامه‌ریزی‌شده.",
  "home.explore.vision.title": "چشم‌انداز",
  "home.explore.vision.desc": "چرا Airhop وجود دارد، و اصولی که زیر فشار تغییر نمی‌کنند.",
  "home.explore.brand.title": "بستهٔ برند",
  "home.explore.brand.desc":
    "پرندهٔ پیکسلی، توکن‌های رنگ و تایپوگرافی، منابع رسانه‌ای و متن‌های آماده.",

  "home.contribute.eyebrow": "از این پروژه حمایت کنید",
  "home.contribute.title": "مستقل، و در فضای باز.",
  "home.contribute.sub":
    "نه سرمایه‌گذاری هست، نه تبلیغی، نه نسخهٔ پولی. همهٔ قابلیت‌ها در هر حال رایگان می‌مانند، و این کار را کسانی تأمین می‌کنند که آن را مفید می‌دانند.",
  "home.contribute.contribute.chip": "مشارکت",
  "home.contribute.contribute.body":
    "به مخزن ستاره بدهید، ایشو باز کنید و pull request بفرستید. گزارش باگ، پیشنهاد قابلیت و مشارکت در کد، همه پذیرفته‌اند.",
  "home.contribute.contribute.cta": "دیدن در GitHub",
  "home.contribute.sponsor.chip": "پشتیبانی مالی",
  "home.contribute.sponsor.body":
    "اگر Airhop برایتان مفید است، یک کمک مالی یک‌باره یا پشتیبانی دوره‌ای کمک بزرگی به فعال ماندن توسعه می‌کند.",
  "home.contribute.sponsor.donate": "کمک یک‌باره",
  "home.contribute.sponsor.github": "پشتیبانی در GitHub",

  "page.architecture.eyebrow": "مستندات",
  "page.architecture.title": "معماری",
  "page.architecture.toc": "در این صفحه",

  "page.faq.eyebrow": "پرسش‌های متداول",
  "page.faq.title": "پرسش‌های پرتکرار",
  "page.faq.meta": "پرسش‌های رایج دربارهٔ Airhop.",
  "page.faq.contact":
    "پرسش‌هایی که اینجا پاسخ داده نشده‌اند را می‌توانید به {email} بفرستید یا با باز کردن یک بحث در {github} مطرح کنید.",

  "page.blogs.eyebrow": "بلاگ",
  "page.blogs.title": "به‌زودی",
  "page.blogs.body": "نوشته‌هایی دربارهٔ شبکه‌های مش، حریم خصوصی و نرم‌افزار آفلاین‌محور.",

  "page.brand.eyebrow": "برند",
  "page.brand.title": "بستهٔ برند",
  "page.brand.meta":
    "منابع و قواعد استفاده از Airhop در یک مقاله، صفحهٔ فروشگاه، ارائه یا README. آزاد برای ارجاع و رسانه.",

  "page.legal.eyebrow": "حقوقی",
  "page.privacy.title": "سیاست حریم خصوصی",
  "page.terms.title": "شرایط استفاده",

  "page.notfound.title": "صفحه پیدا نشد",
  "page.notfound.body": "صفحه‌ای که دنبالش هستید وجود ندارد یا جابه‌جا شده است.",

  "page.english_only": "این صفحه فقط به زبان انگلیسی در دسترس است.",

  "seo.breadcrumb.home": "خانه",

  "seo.home.title": "Airhop — پیام‌رسان خصوصی و آفلاین‌محور",
  "seo.home.description":
    "پیام‌رسانی خصوصی نظیربه‌نظیر برای iOS و Android. بدون اینترنت، بدون سرور، بدون حساب کاربری. هر جا که باشید از راه مش Bluetooth ارتباط بگیرید.",

  "seo.architecture.title": "معماری — Airhop",
  "seo.architecture.description":
    "‏Airhop از بالا تا پایین چطور کار می‌کند: هویت، انتخاب بستر انتقال، مش Bluetooth، رمزنگاری، لایهٔ اینترنت، Tor، ecash آفلاین، هوش مصنوعی روی دستگاه، و قالب انتقال سازگار با bitchat.",
  "seo.architecture.breadcrumb": "معماری",
  "seo.architecture.headline": "معماری Airhop",
  "seo.architecture.summary":
    "تفکیک فنی کامل Airhop: هویت، بسترهای انتقال، مش Bluetooth، رمزنگاری، لایهٔ اینترنت Nostr، Tor، کیف پول Cashu، دستیار هوش مصنوعی روی دستگاه، و قالب انتقال.",

  "seo.faq.title": "پرسش‌های پرتکرار — Airhop",
  "seo.faq.description":
    "پاسخ‌هایی دربارهٔ پیام‌رسانی مش Bluetooth در Airhop، رمزنگاری، پرداخت آفلاین، لایهٔ اینترنت Nostr و سازگاری با bitchat.",
  "seo.faq.breadcrumb": "پرسش‌های متداول",

  "seo.blogs.title": "بلاگ — Airhop",
  "seo.blogs.description": "نوشته‌هایی دربارهٔ شبکه‌های مش، حریم خصوصی و نرم‌افزار آفلاین‌محور.",
  "seo.blogs.breadcrumb": "بلاگ",

  "seo.brand.title": "بستهٔ برند — Airhop",
  "seo.brand.description":
    "بستهٔ برند Airhop: نشان پرندهٔ پیکسلی، لوگوتایپ، توکن‌های رنگ و تایپوگرافی، منابع رسانه‌ای و متن‌های آماده.",
  "seo.brand.breadcrumb": "بستهٔ برند",

  "seo.privacy.title": "سیاست حریم خصوصی — Airhop",
  "seo.privacy.description":
    "‏Airhop با داده‌ها چطور رفتار می‌کند: بدون حساب کاربری، بدون سرور، بدون ردیابی. هویت و پیام‌های شما روی دستگاه خودتان می‌ماند.",
  "seo.privacy.breadcrumb": "سیاست حریم خصوصی",

  "seo.terms.title": "شرایط استفاده — Airhop",
  "seo.terms.description": "شرایط حاکم بر استفاده از اپلیکیشن و وب‌سایت Airhop.",
  "seo.terms.breadcrumb": "شرایط استفاده",

  "seo.notfound.title": "صفحه پیدا نشد — Airhop",
  "seo.notfound.description": "صفحه‌ای که دنبالش هستید وجود ندارد یا جابه‌جا شده است.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} رله",
    other: "{count} رله",
  },
  "home.map.locations": {
    one: "{count} موقعیت",
    other: "{count} موقعیت",
  },
};

export const locale: Locale = { strings, plurals };
