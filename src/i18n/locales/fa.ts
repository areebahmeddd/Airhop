// fa: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "لغو",
  "common.done": "انجام شد",
  "common.ok": "باشه",
  "common.close": "بستن",
  "common.back": "بازگشت",
  "common.delete": "حذف",
  "common.remove": "برداشتن",
  "common.add": "افزودن",
  "common.copy": "کپی",
  "common.copied": "کپی شد",
  "common.share": "هم‌رسانی",
  "common.continue": "ادامه",
  "common.try_again": "دوباره تلاش کنید",
  "common.settings": "تنظیمات",
  "common.on": "روشن",
  "common.off": "خاموش",

  // ---- Dates ----
  "format.today": "امروز",
  "format.yesterday": "دیروز",
  "format.minutes_ago": "{count} دقیقه پیش",
  "format.hours_ago": "{count} ساعت پیش",
  "format.days_ago": "{count} روز پیش",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "گفتگوها",
  "nav.tab.mesh": "مش",
  "nav.tab.wallet": "کیف پول",
  "nav.tab.profile": "شما",
  "a11y.tab.new_peers": "{label}، فردی تازه در نزدیکی",
  "nav.notifications": "اعلان‌ها",
  "chat.subtab.channels": "کانال‌ها",
  "chat.subtab.direct": "مستقیم",
  "chat.subtab.dms": "پیام‌های مستقیم",
  "chat.search.placeholder": "جستجوی گفتگوها…",
  "chat.search.a11y": "جستجوی گفتگوها و پیام‌ها",
  "chat.search.close": "بستن جستجو",
  "chat.search.clear": "پاک کردن جستجو",
  "mesh.view.radar": "نمای رادار",
  "mesh.view.list": "نمای فهرست",
  "mesh.view.radar_short": "رادار",
  "mesh.view.list_short": "فهرست",

  // ---- Legal document names ----
  "legal.last_updated": "آخرین به‌روزرسانی: {date}",
  "legal.terms": "شرایط استفاده از خدمات",
  "legal.privacy": "سیاست حریم خصوصی",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "ارتباط مش خصوصی",
  "onboarding.welcome.cta": "شروع کنید",
  "onboarding.welcome.cta_hint": "برای ادامه با شرایط زیر موافقت کنید",
  "onboarding.welcome.consent_a11y":
    "موافقت با شرایط استفاده از خدمات و سیاست حریم خصوصی",
  "onboarding.welcome.open_terms": "باز کردن شرایط استفاده از خدمات",
  "onboarding.welcome.open_privacy": "باز کردن سیاست حریم خصوصی",
  "onboarding.welcome.consent":
    "با زدن {cta}، شما با {terms} و {privacy} ما موافقت می‌کنید.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "در حال ساخت هویت شما",
  "onboarding.identity.body":
    "یک جفت کلید Ed25519 روی همین دستگاه ساخته می‌شود.\nهیچ چیزی به جایی فرستاده نمی‌شود.",
  "onboarding.identity.failed_heading": "کلیدهای شما ساخته نشد",
  "onboarding.identity.failed_body":
    "این دستگاه به Airhop اجازه نداد کلیدها را ایمن ذخیره کند. دوباره تلاش کنید، یا گوشی را دوباره روشن کنید و Airhop را باز کنید.",
  "onboarding.identity.steps_a11y": "مراحل: {steps}",
  "onboarding.identity.step.x25519": "ساخت جفت کلید ثابت X25519",
  "onboarding.identity.step.ed25519": "ساخت جفت کلید امضای Ed25519",
  "onboarding.identity.step.keychain": "ذخیرهٔ کلیدها در کلیدان سیستم‌عامل",
  "onboarding.identity.step.peer_id": "استخراج شناسهٔ همتا",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "نام شما روی مش",
  "onboarding.username.peer_id": "شناسهٔ همتا",
  "onboarding.username.card_a11y":
    "نام شما روی مش {username} است. شناسهٔ همتا {peerID}. {props}.",
  "onboarding.username.explanation":
    "این نام کاربری به شکل قطعی از کلید عمومی شما ساخته می‌شود. روی هر دستگاهی که شناسهٔ همتای شما را ببیند یکسان است.",
  "onboarding.username.cta": "ورود به Airhop",
  "onboarding.username.prop.algorithm": "الگوریتم",
  "onboarding.username.prop.storage": "محل ذخیره",
  "onboarding.username.prop.storage_value": "فقط کلیدان سیستم‌عامل",
  "onboarding.username.prop.account": "نیاز به حساب",
  "onboarding.username.prop.account_value": "ندارد",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "به Airhop خوش آمدید",
  "onboarding.hello.p1":
    "سلام. Airhop روی بستر bitchat و به عنوان یک پروژهٔ جانبی مستقل و متن‌باز ساخته شده است. وابسته به پروژهٔ bitchat یا permissionless tech نیست و مورد تأیید آن‌ها هم نیست، فقط چیزی است که از ساختن و به اشتراک گذاشتنش با جامعه لذت می‌برم.",
  "onboarding.hello.p2":
    "این نخستین انتشار برای iOS و Android است، پس با اینکه آن را با دوستانم آزمایش کرده‌ام، احتمالاً به چند اشکال برمی‌خورید. اگر چنین شد، یا اگر ایده‌ای برای یک قابلیت دارید، خوشحال می‌شوم بشنوم. در {github} یک issue باز کنید یا به {email} ایمیل بزنید.",
  "onboarding.hello.p3":
    "اگر Airhop برایتان مفید بود، ستاره‌ای در {github} یا نقدی در {store} بگذارید. این کار کمک می‌کند افراد بیشتری این پروژه را پیدا کنند. ممنون که امتحانش کردید!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "پیش از آنکه گوشی‌تان بپرسد",
  "onboarding.primer.lede":
    "این‌ها کاری است که هر کدام انجام می‌دهند، و کاری که انجام نمی‌دهند.",
  "onboarding.primer.bluetooth.title": "بلوتوث",
  "onboarding.primer.bluetooth.body":
    "دستگاه‌های نزدیک را پیدا می‌کند و پیام‌ها را میانشان جابه‌جا می‌کند. مش از همین ساخته می‌شود و بدون اتصال اینترنت کار می‌کند.",
  "onboarding.primer.location.title": "موقعیت مکانی",
  "onboarding.primer.location.body":
    "شما را در کانال‌های منطقهٔ نزدیک قرار می‌دهد، از یک محله تا یک استان. Airhop هرگز شما را ردیابی نمی‌کند و موقعیت دقیقتان را از دستگاه بیرون نمی‌فرستد.",
  "onboarding.primer.notifications.title": "اعلان‌ها",
  "onboarding.primer.notifications.body":
    "حتی وقتی برنامه بسته است، از پیام‌های تازه باخبر شوید. اعلان‌ها روی خود دستگاه شما ساخته می‌شوند و هیچ سروری در کار نیست.",
  "onboarding.primer.footnote":
    "می‌توانید نه بگویید. پیام‌ها همچنان از راه اینترنت می‌روند و می‌آیند، و بعداً می‌توانید در تنظیمات نظرتان را عوض کنید.",
  "onboarding.primer.cta_a11y": "ادامه به درخواست‌های دسترسی",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "دسترسی بلوتوث",
  "permission.bluetooth.purpose": "یافتن دستگاه‌های نزدیک روی مش",
  "permission.open_settings": "باز کردن تنظیمات",
  "permission.not_now": "الان نه",
  "permission.blocked_title": "{label} خاموش است",
  "permission.blocked_body": "برای {purpose} آن را در تنظیمات روشن کنید.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "مشکلی پیش آمد",
  "error.boundary.body":
    "Airhop به مشکلی غیرمنتظره برخورد و ناچار شد آنچه را نشان می‌داد متوقف کند.",

  // ---- Chats: channel list ----
  "chat.channels.default": "کانال‌های پیش‌فرض",
  "chat.channels.yours": "کانال‌های شما",
  "chat.channels.none": "هنوز کانالی نیست",
  "chat.channels.none_hint": "برای پیوستن یا ساختن، {plus} بالا را بزنید.",
  "chat.channels.none_desc":
    "هنوز کانالی نیست. برای پیوستن یا ساختن، از دکمهٔ افزودن در سربرگ استفاده کنید.",
  "chat.channels.show_fewer": "نمایش کانال‌های پیش‌فرض کمتر",
  "chat.channels.show_less": "کمتر نشان بده",
  "chat.channels.info": "اطلاعات کانال",
  "chat.channels.pin": "سنجاق کردن کانال",
  "chat.channels.unpin": "برداشتن سنجاق کانال",
  "chat.channels.mute": "بی‌صدا کردن کانال",
  "chat.channels.unmute": "باصدا کردن کانال",
  "chat.channels.leave": "ترک کانال",
  "chat.channels.leave_confirm": "ترک کن",
  "chat.channels.clear_body":
    "همهٔ پیام‌های {name} حذف شود؟ این کار برگشت‌پذیر نیست.",
  "chat.channels.leave_body":
    "{name} را ترک می‌کنید؟ دیگر پیام‌هایش را نمی‌گیرید، و تاریخچه‌اش از این دستگاه برداشته می‌شود.",
  "chat.channels.more_options": "گزینه‌های بیشتر برای {name}",
  "chat.channels.teleported_tag": "{level}  ·  از راه دور",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "پاک کردن گفتگو",
  "chat.dm.remove_contact": "برداشتن مخاطب",
  "chat.dm.block": "مسدود کردن این همتا",
  "chat.dm.block_confirm": "مسدود کن",
  "chat.dm.delete": "حذف گفتگو",
  "chat.dm.delete_body":
    "این کار گفتگو را از فهرست شما برمی‌دارد و پیام‌هایش را حذف می‌کند. مخاطب می‌ماند، و پیامی تازه از او گفتگویی تازه آغاز می‌کند.",
  "chat.dm.in_range": "در محدوده",
  "chat.dm.row_hint": "برای گزینه‌های بیشتر دو بار بزنید و نگه دارید",
  "chat.channels.row_hint": "برای گزینه‌های بیشتر دو بار بزنید و نگه دارید",
  "chat.dm.you_prefix": "شما:",
  "chat.dm.none": "پیام مستقیمی نیست",
  "chat.dm.none_desc":
    "به زبانهٔ مش بروید و روی یک همتا بزنید تا یک پیام مستقیم رمزگذاری‌شده آغاز شود.",
  "chat.dm.contact_info": "اطلاعات مخاطب",
  "chat.dm.pin": "سنجاق کردن گفتگو",
  "chat.dm.unpin": "برداشتن سنجاق گفتگو",
  "chat.dm.mute": "بی‌صدا کردن گفتگو",
  "chat.dm.unmute": "باصدا کردن گفتگو",
  "chat.dm.clear_body":
    "همهٔ پیام‌ها با {name} حذف شود؟ این کار برگشت‌پذیر نیست.",
  "chat.dm.remove_contact_body":
    "{name} برداشته شود؟ این کار گفتگو را حذف و مخاطب را فراموش می‌کند. اگر دوباره پیام بدهند باز هم به شما می‌رسند.",
  "chat.dm.block_body":
    "{name} مسدود شود؟ او را در زبانهٔ مش نمی‌بینید و پیامی از او نمی‌گیرید، حتی اگر نزدیک باشد.",
  "chat.dm.more_options": "گزینه‌های بیشتر برای {name}",
  "chat.dm.remove_contact_short": "برداشتن مخاطب",
  "chat.dm.block_short": "مسدود کردن مخاطب",
  "chat.dm.delete_short": "حذف گفتگو",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "پاک کردن پیام‌ها",
  "chat.clear_confirm": "پاک کن",
  "chat.group_badge": "گروه",
  "chat.more": "بیشتر",
  "chat.no_messages": "هنوز پیامی نیست",
  "chat.you": "شما",
  "chat.a11y.channel": "کانال {name}",
  "chat.a11y.group": "گروه {name}",
  "chat.a11y.muted": "بی‌صدا",
  "chat.a11y.pinned": "سنجاق‌شده",

  // ---- Chats: start something new ----
  "chat.new.title": "چیزی تازه آغاز کنید",
  "chat.new.channel": "ساخت یک کانال خصوصی",
  "chat.new.channel_label": "کانال خصوصی",
  "chat.new.channel_desc":
    "اتاقی که هر کس پیوند را داشته باشد می‌تواند به آن بپیوندد. یکی بسازید، یا با پیوندی که برایتان فرستاده‌اند بپیوندید.",
  "chat.new.group": "ساخت یک گروه خصوصی",
  "chat.new.group_label": "گروه خصوصی",
  "chat.new.group_desc":
    "افراد مشخصی را برگزینید. تا 16 نفر. روی بلوتوث می‌ماند.",
  "chat.new.place": "رفتن به جایی با ژئوهش",
  "chat.new.place_label": "رفتن به یک جا",
  "chat.new.place_desc": "کانال موقعیت هر جایی را با ژئوهش آن باز کنید.",
  "chat.new.reach": "دسترس",
  "chat.new.reach_internet": "از راه بلوتوث و اینترنت به اعضا می‌رسد.",
  "chat.new.reach_mesh": "در محدودهٔ بلوتوث کار می‌کند، نه از راه اینترنت.",
  "chat.new.reach_internet_desc":
    "از راه اینترنت هم به اعضا می‌رسد. رله‌ها می‌بینند کانال فعال است، اما هرگز پیام‌هایش یا اینکه چه کسی در آن است را نمی‌بینند.",
  "chat.new.reach_mesh_desc":
    "روی مش محلی می‌ماند. خصوصی‌ترین حالت، چیزی از محدودهٔ بلوتوث بیرون نمی‌رود.",
  "chat.new.join_link": "پیوستن به یک کانال خصوصی با پیوند دعوت",
  "chat.new.back_to_chooser": "بازگشت به گزینه‌ها",
  "chat.new.create_channel": "ساخت کانال",
  "chat.new.name_required": "اول نام کانال را وارد کنید",
  "chat.new.name_taken": "آن نام از پیش گرفته شده است",
  "chat.new.create": "بساز",
  "chat.new.e2ee":
    "سرتاسر رمزگذاری‌شده. تنها اعضا می‌توانند پیام‌ها را بخوانند.",
  "chat.new.invite_only":
    "تنها با دعوت. هر کس پیوند را با او هم‌رسانی کنید می‌تواند بپیوندد. از دید بقیه پنهان می‌ماند، حتی همتاهای نزدیک.",
  "chat.new.name_exists": "کانالی با این نام از پیش هست.",
  "chat.new.reach_bluetooth_chip": "فقط بلوتوث",
  "chat.new.reach_internet_chip": "بلوتوث + اینترنت",
  "chat.new.have_link": "پیوستن با پیوند دعوت",

  // ---- Chats: join by link ----
  "chat.join.title": "پیوستن با یک پیوند",
  "chat.join.not_airhop": "این پیوند Airhop نیست.",
  "chat.join.reach_internet": "از راه بلوتوث و اینترنت به اعضا می‌رسد.",
  "chat.join.reach_mesh": "در محدودهٔ بلوتوث می‌ماند.",
  "chat.join.contact_card":
    "یک کارت مخاطب. او را به مخاطبان شما می‌افزاید و گفتگو را باز می‌کند.",
  "chat.join.unverified": "آن پیوند تأیید نشد",
  "chat.join.unverified_body":
    "کارت مخاطب با کلیدهای خودش نمی‌خواند، پس افزوده نشد. از آن‌ها بخواهید تازه‌اش را بفرستند.",
  "chat.join.paste": "چسباندن از بریده‌دان",
  "chat.join.join": "بپیوند",
  "chat.join.public_channel":
    "کانال عمومی {name}. هر کس نزدیک باشد می‌تواند بخواندش.",
  "chat.join.private_channel": "کانال خصوصی {name}. {reach}",
  "chat.join.dm_with": "پیام مستقیم با {name}.",
  "chat.join.joined_as": "با نام {name} پیوستید",
  "chat.join.name_clash_body":
    "شما از پیش در یک {name} دیگر هستید. نام کانال‌ها فقط برچسب‌اند، پس این دعوت کانال خودش را باز کرد و آنکه در آن بودید دست‌نخورده ماند. هر کدام را از اطلاعات کانالش می‌توانید تغییر نام دهید.",
  "chat.join.paste_hint":
    "دعوتی را بچسبانید که با airhop:// آغاز می‌شود. زدن روی پیوند هم کار می‌کند؛ این برای پیوندی است که نمی‌توانید رویش بزنید.",
  "chat.join.key_note":
    "دعوت یک کانال خصوصی کلید را با خود می‌آورد، پس پیوستن آنی است و از کس دیگری چیزی خواسته نمی‌شود.",
  "chat.join.offline_note":
    "برون‌خط کار می‌کند. پیوند روی همین دستگاه خوانده می‌شود، و کانال به همان اندازه‌ای می‌رسد که سازنده‌اش تنظیم کرده است.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "آن سلول باز نشد. کمی بعد دوباره تلاش کنید.",
  "chat.jump.title": "رفتن به یک جا",
  "chat.jump.saved": "جاهای ذخیره‌شده",
  "chat.jump.anywhere":
    "کانال موقعیت عمومی هر جایی را باز کنید، حتی جایی که در آن نیستید.",
  "chat.jump.geohash_note":
    "ژئوهش آن را وارد کنید. هر کس موقعیتش در آن سلول بیفتد در این کانال شریک است.",
  "chat.jump.teleport_note":
    "شما به شکل «از راه دور» نمایان می‌شوید، نه نزدیک. تنها از راه اینترنت می‌رسد.",
  "chat.jump.level_cell": "سلول {level}",
  "chat.jump.already_here":
    "شما همین حالا اینجا هستید. «برو» کانال {name} شما را باز می‌کند.",
  "chat.jump.open_direction": "باز کردن سلول سمت {direction} شما",
  "chat.jump.open_place": "باز کردن {name}",
  "chat.jump.remove_place": "برداشتن {name} از جاهای ذخیره‌شده",
  "chat.jump.go": "برو",
  "chat.jump.how":
    "برای یافتن یک ژئوهش: یک کانال موقعیت را باز کنید > روی نامش بزنید > از همان‌جا کپی کنید.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "به همهٔ اعضا نرسید. وقتی نزدیک بودند دوباره تلاش کنید.",
  "chat.group.you_were_added": "شما به {name} افزوده شدید.",
  "chat.group.added_you": "شما را به {name} افزود",
  "chat.group.you_were_removed":
    "شما از {name} برداشته شدید. دیگر نمی‌توانید اینجا بخوانید یا بفرستید.",
  "chat.group.removed_you": "شما را از {name} برداشت",
  "chat.group.add_failed": "افزودنشان ممکن نشد",
  "chat.group.add_failed_body":
    "چیزی تغییر نکرد. یا همین حالا در دسترس نیستند، یا گروه با 16 نفر پر است، یا شما سازنده‌اش نیستید.",
  "chat.group.remove_failed": "برداشتنشان ممکن نشد",
  "chat.group.remove_failed_body":
    "چیزی تغییر نکرد. تنها کسی که گروه را ساخته می‌تواند اعضایش را عوض کند.",
  "chat.group.e2ee":
    "سرتاسر رمزگذاری‌شده. تنها اعضا می‌توانند پیام‌ها را بخوانند.",
  "chat.group.cap":
    "تا 16 نفر، به انتخاب شما. پیوند دعوتی در کار نیست، پس کسی با هدایت پیوند وارد نمی‌شود.",
  "chat.group.bluetooth":
    "فقط بلوتوث. اعضایی که بیرون از محدوده‌اند همین که بازگردند پیام‌ها را می‌گیرند.",
  "chat.group.members_label": "اعضا",
  "chat.group.none_in_range":
    "کسی در محدوده نیست. هنگام ساخت گروه، اعضا باید نزدیک باشند.",
  "chat.group.create_title": "ساخت یک گروه",
  "chat.group.name_placeholder": "نام گروه",
  "chat.group.create": "بساز",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "مش محلی · فقط بلوتوث",
  "chat.scope.mesh_desc":
    "به دستگاه‌های داخل محدودهٔ بلوتوث (تقریباً 10 تا 100 متر) می‌رسد. اینترنت لازم نیست. برای هماهنگی محلی عالی است.",
  "chat.scope.block": "بلوک شهری · حدود 100 متر",
  "chat.scope.block_desc":
    "پوشش در حد یک بلوک شهری. پیام‌ها از راه اینترنت پل زده می‌شوند تا همتاهای بیرون از محدودهٔ بلوتوث اما نزدیک هم بتوانند شرکت کنند.",
  "chat.scope.neighborhood": "محله · حدود 1 کیلومتر",
  "chat.scope.neighborhood_desc":
    "پوشش در حد یک محله. با کمک رله، همتاهای سراسر منطقه حتی بدون پیوند مستقیم بلوتوثی هم در دسترس‌اند.",
  "chat.scope.city": "شهر · حدود 10 کیلومتر",
  "chat.scope.city_desc":
    "کانالی در پهنهٔ شهر. از رله‌های اینترنتی مکان‌دار استفاده می‌کند تا به همتاهای سراسر کلان‌شهر برسد.",
  "chat.scope.province": "استان · حدود 100 کیلومتر",
  "chat.scope.province_desc":
    "پوشش در حد استان. از راه اینترنت پل زده می‌شود تا در پهنه‌ای چندصد کیلومتری برسد.",
  "chat.scope.country": "کشور یا منطقه · حدود 1000 کیلومتر",
  "chat.scope.country_desc":
    "پوشش سراسر کشور. هر کاربر Airhop یا bitchat در آن منطقه می‌تواند بپیوندد و پیام‌ها را بخواند.",
  "chat.transport.bluetooth": "فقط بلوتوث",
  "chat.transport.both": "بلوتوث + اینترنت",
  "chat.transport.internet": "فقط اینترنت",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "فرمان /{cmd}: {hint}",
  "chat.cmd.hug_hint": "یک آغوش گرم بفرست",
  "chat.cmd.slap_hint": "با یک ماهی قزل‌آلای بزرگ بزن",
  "chat.status.sending": "در حال فرستادن…",
  "chat.status.undo_send": "لغو ارسال",
  "chat.status.undo": "لغو",
  "chat.status.sent": "فرستاده شد",
  "chat.status.received": "دریافت شد",
  "chat.status.failed": "ناموفق",
  "chat.status.canceled": "لغو شد",
  "chat.status.waiting": "در انتظار",
  "chat.status.sending_short": "در حال فرستادن",
  "chat.status.receiving": "در حال دریافت",
  "chat.thread.not_available": "اینجا در دسترس نیست",
  "chat.thread.private_channel": "کانال خصوصی",
  "chat.thread.location_channel": "کانال موقعیت",
  "chat.thread.public_channel": "کانال عمومی",
  "chat.thread.notices": "اعلان‌های این کانال",
  "chat.thread.invite": "دعوت کسی به این کانال",
  "chat.thread.not_in_range": "نزدیک نیست. از راه اینترنت تحویل می‌شود.",
  "chat.thread.not_nearby":
    "نزدیک نیست. هر وقت به محدوده بازگردند یا برخط شوند تحویل می‌دهیم.",
  "chat.thread.no_keys":
    "برای پیام دادن به آن‌ها باید در محدودهٔ بلوتوث باشید، یا کدشان را بپویید.",
  "chat.geo.card_received":
    "{name} مخاطب خود را هم‌رسانی کرد. مال خودتان را هم بفرستید تا پس از جابه‌جا شدن هر کدامتان بتوانید حرف زدن را ادامه دهید.",
  "chat.geo.exchange_complete":
    "مخاطبان رد و بدل شد. اکنون از هر جایی به هم می‌رسید.",
  "chat.geo.keep_person": "این فرد را نگه دار",
  "chat.geo.keep_person_desc":
    "مخاطب خود را هم‌رسانی کنید تا پس از جابه‌جا شدن هر کدامتان بتوانید حرف زدن را ادامه دهید. آن‌ها هویت همیشگی شما را خواهند دانست.",
  "chat.geo.card_sent": "هم‌رسانی شد · در انتظار مال آن‌ها",
  "chat.thread.left_cell":
    "شما این منطقه را ترک کرده‌اید، پس آن‌ها اینجا به شما نمی‌رسند. برای ادامهٔ گفتگو از هر جایی، کدها را رد و بدل کنید.",
  "chat.thread.no_route":
    "همین حالا نمی‌شود به آن‌ها رسید. پیام هر وقت راهی پیدا شود فرستاده می‌شود.",
  "chat.thread.empty": "هنوز پیامی نیست",
  "chat.thread.empty_desc": "یک گفتگوی رمزگذاری‌شده آغاز کنید.",
  "chat.thread.jump_latest": "پرش به تازه‌ترین پیام",
  "chat.thread.back_to_members": "بازگشت به اعضا",
  "chat.thread.nostr_key": "کلید عمومی Nostr",
  "chat.thread.in_range": "در محدوده",
  "chat.voice.not_recorded": "پیام صوتی ضبط نشد",
  "chat.thread.message": "پیام",
  "chat.thread.message_placeholder": "پیام…",
  "chat.thread.length_full": "پیام پر است",
  "chat.thread.waiting_for": "در انتظار بازگشت {name} · {percent}٪",
  "chat.thread.peer": "همتا",
  "chat.thread.cancel_transfer": "لغو {name}",
  "chat.thread.queued_more": "{count} مورد دیگر در انتظار ارسال",
  "chat.thread.across_bridge": "{count} نفر آن سوی پل",
  "chat.thread.bridged": "پل‌خورده",
  "chat.thread.invite_body":
    "در {channel} روی Airhop به من بپیوندید — پیام‌رسان مش خصوصی با اولویت برون‌خط.",
  "chat.thread.go_back_unread": "بازگشت، {count} خوانده‌نشده",
  "chat.thread.view_info": "دیدن اطلاعات {name}",
  "chat.thread.notices_new": "اعلان‌های این کانال، {count} تازه",
  "chat.thread.say_something": "در {channel} چیزی بگویید.",
  "chat.thread.jump_latest_new": "پرش به تازه‌ترین پیام، {count} تازه",
  "chat.thread.unconfirmed_since": "از {date} تحویلی تأیید نشده است",
  "chat.thread.no_reach": "همتایی در نزدیکی نیست · هنوز کسی این را نگرفته است",
  "chat.thread.channel_needs_internet":
    "اینترنت خاموش · این کانال تنها به کسانی می‌رسد که در محدودهٔ بلوتوث‌اند",
  "chat.thread.cell_needs_internet":
    "اینترنت خاموش · به این سلول تنها از راه اینترنت می‌شود رسید",
  "chat.thread.geo_dm_needs_internet":
    "اینترنت خاموش · این گفتگو تنها از راه اینترنت جابه‌جا می‌شود",
  "chat.thread.via_gateway":
    "اینترنت خاموش · دستگاهی نزدیک این را برای شما برخط می‌برد",
  "chat.thread.group_queued":
    "هنوز کسی از این گروه نزدیک نیست. هر وقت باشند به آن‌ها می‌رسد.",
  "chat.thread.no_group_key":
    "شما دیگر در این گروه نیستید، پس این فرستاده نمی‌شود",
  "chat.thread.no_reach_offline":
    "اینترنت خاموش و همتایی هم نزدیک نیست · هنوز کسی این را نگرفته است",
  "chat.thread.mention": "نام بردن از {name}",
  "chat.thread.someone_talking": "{hold}. {name} در حال صحبت است.",
  "chat.thread.attach_note":
    "فایل‌ها تنها در محدودهٔ بلوتوث می‌روند. متن و پرداخت به مخاطبان اینترنتی می‌رسند؛ پیوست‌ها نه.",
  "chat.thread.message_peer": "پیام به {name}",
  "chat.thread.send": "فرستادن پیام",
  "chat.thread.group": "گروه",
  "chat.bridge.nearby_only": "فقط نزدیک: این پیام را از پل مش دور نگه دار",
  "chat.bridge.nearby_label": "فقط نزدیک · روی بلوتوث می‌ماند",
  "chat.bridge.bridging_label":
    "در حال پل زدن به مناطق نزدیک · برای فقط نزدیک بزنید",
  "chat.screenshot.you_took": "شما عکس صفحه گرفتید",
  "chat.screenshot.you_took_private": "شما عکس صفحه گرفتید · به کسی گفته نشد",
  "chat.screenshot.heads_up": "توجه",
  "chat.screenshot.notice": "* {name} عکس صفحه گرفت *",
  "chat.screenshot.notified_dm":
    "به {name} خبر داده شد که شما از این گفتگو عکس صفحه گرفتید.",
  "chat.screenshot.notified":
    "به همهٔ کسانی که در این کانال‌اند خبر داده شد که شما عکس صفحه گرفتید.",
  "chat.screenshot.not_notified":
    "به کسی خبر داده نشد. این کانال عمومی است، پس اعلام عکس صفحه ثبت می‌کرد که شما اینجا بوده‌اید.",
  "chat.thread.error": "خطا",
  "chat.thread.go_back": "بازگشت",
  "chat.bubble.via_bridge": "از راه پل مش",
  "chat.bubble.view_profile": "دیدن نمایهٔ {name}",
  "chat.bubble.forwarded": "هدایت‌شده",
  "chat.bubble.attachment": "پیوست",
  "chat.bubble.a11y": "{sender}: {body}. برای گزینه‌های بیشتر نگه دارید.",
  "chat.bubble.failed_retry": "فرستادن ناموفق بود. برای تلاش دوباره بزنید.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "اطلاعات پیام",
  "chat.info.delivered_to": "به {name} رسید",
  "chat.info.read_by": "{name} خواند",
  "chat.info.group_reach_desc": "همین حالا در دسترس، نه تأیید تحویل",
  "chat.info.group_alone": "عضو دیگری نیست",
  "chat.info.today_at": "امروز {time}",
  "chat.info.sending": "در حال فرستادن…",
  "chat.info.failed": "فرستادن ناموفق بود",
  "chat.info.courier": "دستگاهی دیگر آن را برد",
  "chat.info.sent": "فرستاده شد",
  "chat.info.queued": "در انتظار ارسال",
  "chat.info.waiting": "در انتظار…",
  "chat.action.info": "اطلاعات پیام",
  "chat.action.save_photos": "ذخیره در عکس‌ها",
  "chat.action.save_copy": "ذخیرهٔ یک نسخه",
  "chat.action.forward": "هدایت",
  "chat.action.select": "انتخاب",
  "chat.select.cancel": "لغو انتخاب",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "دوربین",
  "chat.attach.camera_desc": "گرفتن عکس یا ویدیو",
  "chat.attach.library": "گالری عکس",
  "chat.attach.library_desc": "انتخاب از گالری شما",
  "chat.attach.document": "سند",
  "chat.attach.document_desc": "فرستادن هر فایل یا PDF",
  "chat.attach.voice": "پیام صوتی",
  "chat.attach.voice_desc": "ضبط و فرستادن یک پیام صوتی",
  "chat.attach.ecash": "فرستادن ecash",
  "chat.attach.ecash_desc": "فرستادن Cashu sats از کیف پول شما",
  "chat.attach.location": "موقعیت مکانی",
  "chat.attach.location_desc": "بفرستید همین حالا کجا هستید",
  "chat.attach.title": "پیوست",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "یک موقعیت هم‌رسانی شد",
  "chat.location.received_summary": "موقعیت خود را هم‌رسانی کرد",
  "chat.location.title": "موقعیت مکانی",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago} پیش گرفته شد",
  "chat.location.open_maps": "باز کردن در Maps",
  "chat.location.no_forward": "موقعیت‌ها هدایت نمی‌شوند",
  "chat.location.no_forward_body":
    "یک موقعیت به یک نفر فرستاده می‌شود. اگر می‌خواهید کس دیگری هم آن را داشته باشد، به جایش موقعیت خودتان را هم‌رسانی کنید.",
  "chat.location.no_fix": "برای دیدن فاصله، به موقعیت مکانی اجازه دهید",
  "chat.location.send_title": "فرستادن موقعیت شما",
  "chat.location.send_body":
    "{name} تنها یک نقطه می‌بیند: جایی که همین حالا هستید. پیوسته به‌روز نمی‌شود.",
  "chat.location.send": "فرستادن موقعیت",
  "chat.location.finding": "در حال یافتن موقعیت شما…",
  "chat.location.no_location": "موقعیت شما به دست نیامد",
  "chat.location.no_location_body":
    "به موقعیت مکانی اجازه دهید و مطمئن شوید خدمات موقعیت روشن است، سپس دوباره تلاش کنید.",
  "chat.location.not_delivered": "موقعیت شما فرستاده نشد",
  "chat.location.not_delivered_body":
    "موقعیت تنها تا وقتی تازه است ارزش فرستادن دارد، پس برای بعد در صف نمی‌ماند. هر وقت {name} در دسترس بود دوباره تلاش کنید.",
  "chat.location.direction.n": "شمال",
  "chat.location.direction.ne": "شمال شرق",
  "chat.location.direction.e": "شرق",
  "chat.location.direction.se": "جنوب شرق",
  "chat.location.direction.s": "جنوب",
  "chat.location.direction.sw": "جنوب غرب",
  "chat.location.direction.w": "غرب",
  "chat.location.direction.nw": "شمال غرب",
  "chat.attach.send_anyway": "به هر حال بفرست",
  "chat.attach.bitchat_too_big": "شاید نرسد",
  "chat.attach.bitchat_too_big_body":
    "{name} روی bitchat است، که فایل بزرگ را در میانهٔ راه رها می‌کند. کمتر از حدود 350 KiB مطمئن است. فرستادن به یک مخاطب Airhop چنین محدودیتی ندارد.",
  "chat.attach.bitchat_unopenable": "شاید نتوانند این را باز کنند",
  "chat.attach.bitchat_unopenable_body":
    "{name} روی bitchat است، که عکس و پیام صوتی را نشان می‌دهد اما هر چیز دیگر را فایلی می‌شمارد که نمی‌تواند بازش کند. می‌رسد، فقط شاید نتوانند ببینندش.",
  "chat.attach.file": "پیوست کردن یک فایل",
  "chat.attach.unavailable": "اینجا پیوست در دسترس نیست",
  "chat.attach.not_sent": "پیوست فرستاده نشد",
  "chat.attach.read_failed":
    "در خواندن آن فایل مشکلی پیش آمد. یکی دیگر را امتحان کنید.",
  "chat.attach.caption": "افزودن یک زیرنویس…",
  "chat.attach.send": "فرستادن پیوست",
  "chat.attach.generic": "پیوست",
  "chat.media.view_full": "دیدن عکس در تمام‌صفحه",
  "chat.media.gone_photo": "عکس روی این دستگاه نیست",
  "chat.media.gone_video": "ویدیو روی این دستگاه نیست",
  "chat.media.gone_voice": "پیام صوتی روی این دستگاه نیست",
  "chat.media.gone_file": "فایل روی این دستگاه نیست",
  "chat.media.gone_note": "پس از 7 روز یا هنگام پاک شدن حافظهٔ نهان برداشته شد",
  "chat.media.ask_resend": "دوباره بپرس",
  "chat.media.resend_draft": "می‌شود آن {kind} را دوباره بفرستید؟",
  "chat.media.kind_photo": "عکس",
  "chat.media.kind_video": "ویدیو",
  "chat.media.kind_voice": "پیام صوتی",
  "chat.media.kind_file": "فایل",
  "chat.media.pause_voice": "مکث پیام صوتی",
  "chat.media.play_voice": "پخش پیام صوتی",
  "chat.media.voice_position": "جای پیام صوتی",
  "chat.media.voice_scrub": "روی میله‌ها بزنید تا به آن نقطه بپرید",
  "chat.media.image": "تصویر",
  "chat.media.tap_load_photo": "برای بارگذاری عکس بزنید",
  "chat.media.open_document": "باز کردن {name}",
  "chat.media.document": "سند",
  "chat.media.tap_load_video": "برای بارگذاری ویدیو بزنید",
  "chat.media.video": "ویدیو",
  "chat.media.photo": "عکس",
  "chat.media.close_photo": "بستن عکس",
  "chat.media.save_photo": "ذخیرهٔ عکس در عکس‌های شما",
  "chat.media.share_photo": "هم‌رسانی عکس",
  "chat.media.saved_videos": "در ویدیوهای شما ذخیره شد",
  "chat.media.saved_photos": "در عکس‌های شما ذخیره شد",
  "chat.media.not_saved": "ذخیره نشد",
  "chat.media.cant_open": "فایل باز نمی‌شود",
  "chat.media.no_app":
    "این دستگاه برنامه‌ای برای باز کردن یا هم‌رسانی این فایل ندارد.",
  "chat.media.open_failed": "فایل باز نشد. شاید از حافظهٔ نهان پاک شده باشد.",
  "media.blocked.nostr_only":
    "شما این فرد را فقط از راه یک رله می‌شناسید. تنها متن در دسترس است. عکس، فایل و پیام صوتی به بلوتوث نیاز دارند.",
  "media.blocked.private_channel":
    "پیوست همگانی امضا می‌شود اما رمزگذاری نمی‌شود، پس فرستادن آن به یک کانال خصوصی آن را آشکار می‌گذارد، در حالی که متن اینجا رمزگذاری‌شده می‌ماند.",
  "media.blocked.private_group":
    "پیوست همگانی امضا می‌شود اما رمزگذاری نمی‌شود، پس فرستادن آن به یک گروه خصوصی آن را آشکار می‌گذارد، در حالی که متن اینجا رمزگذاری‌شده می‌ماند.",
  "media.blocked.location_channel":
    "کانال موقعیت از راه اینترنت به مردم می‌رسد، و عکس و فایل و پیام صوتی از راه بلوتوث می‌روند، پس هرگز نمی‌رسند.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "اینجا پیام صوتی در دسترس نیست",
  "chat.voice.hold_live": "برای صحبت زنده نگه دارید",
  "chat.voice.hold_record": "برای ضبط یک پیام صوتی نگه دارید",
  "chat.voice.cancel_recording": "لغو ضبط",
  "chat.voice.slide_cancel": "برای لغو بکشید",
  "chat.voice.release_cancel": "برای لغو رها کنید",
  "chat.voice.a11y_toggle": "برای آغاز یا پایان صحبت دو بار بزنید.",
  "chat.voice.limit_reached": "به مرز دو دقیقه رسید، برای فرستادن رها کنید",
  "chat.voice.limit_sent": "به مرز دو دقیقه رسید و پیام فرستاده شد",
  "chat.voice.stop_send": "توقف ضبط و فرستادن",
  "chat.voice.lift_lock": "برای ضبط بدون نگه داشتن، به بالا بکشید",
  "chat.voice.live_speaking": "{name} در حال صحبت",
  "voice.unavailable": "صدای زنده در دسترس نیست",
  "voice.recording_stopped": "ضبط متوقف شد",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "دسترسی دوربین",
  "chat.perm.camera_purpose": "گرفتن عکسی برای فرستادن",
  "chat.perm.photo_label": "دسترسی عکس",
  "chat.perm.photo_purpose": "برگزیدن عکس یا ویدیویی برای فرستادن",
  "chat.perm.photo_save_purpose": "ذخیرهٔ این در عکس‌های شما",
  "chat.perm.mic_label": "دسترسی میکروفون",
  "chat.perm.mic_live_purpose": "صحبت با آدم‌های نزدیک",
  "chat.perm.mic_note_purpose": "ضبط یک پیام صوتی",
  "chat.perm.recording_stopped": "ضبط متوقف شد",
  "chat.perm.record_failed": "ضبط آغاز نشد. دسترسی‌های میکروفون را بررسی کنید.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "دریافت شد",
  "chat.ecash.reclaimed": "پس گرفته شد",
  "chat.ecash.claiming": "در حال دریافت…",
  "chat.ecash.claim": "دریافت",
  "chat.ecash.claim_amount": "دریافت {amount} {unit}",
  "chat.ecash.already_claimed": "از پیش دریافت شده",
  "chat.ecash.already_claimed_body":
    "هر اثبات در این توکن از پیش در کیف پول شماست، پس چیزی اضافه نشد.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "برای تحویل با بیشترین تلاش به مش سپرده شد",
  "chat.info.queued_desc":
    "تا وقتی راهی به آن‌ها باز شود روی همین گوشی نگه داشته می‌شود",
  "chat.info.reclaimed": "پس گرفته شد",
  "chat.info.reclaimed_desc":
    "شما این پرداخت را به کیف پول خود بازگرداندید، پس تحویل نخواهد شد",
  "chat.info.about": "درباره",
  "chat.info.group_desc":
    "یک گروه خصوصی. تنها اعضایی که سازنده افزوده می‌توانند بخوانندش، و روی بلوتوث می‌ماند.",
  "chat.info.teleported_desc":
    "یک کانال موقعیت عمومی برای این سلول ژئوهش. هر کس در این سلول باشد، چه روی Airhop چه bitchat، از راه اینترنت در آن شریک است. شما از راه دور آمده‌اید، نه اینکه واقعاً اینجا باشید.",
  "chat.info.custom_desc":
    "یک کانال دلخواه. هر کس نامش را بداند می‌تواند از هر دستگاه Airhop یا bitchat بپیوندد.",
  "chat.info.private_e2ee": "خصوصی · سرتاسر رمزگذاری‌شده",
  "chat.info.public_plain": "عمومی · رمزگذاری‌نشده",
  "chat.info.group_privacy":
    "تنها اعضایی که پایین نشان داده شده‌اند می‌توانند این گروه را بخوانند. پیام‌ها روی بلوتوث می‌مانند، پس اعضای بیرون از محدوده همین که بازگردند آن‌ها را می‌گیرند.",
  "chat.info.teleport_privacy":
    "جایی که از راه دور به آن رفته‌اید. از راه اینترنت به همهٔ کسانی که در این سلول‌اند می‌رسد، و به هیچ‌کس در محدودهٔ بلوتوث.",
  "chat.info.location_off_privacy":
    "موقعیت مکانی خاموش است، پس این کانال تنها از راه بلوتوث به دستگاه‌های نزدیک می‌رسد. برای رسیدن به سلول منطقه‌اش از راه اینترنت، موقعیت مکانی را روشن کنید.",
  "chat.info.invite_privacy":
    "تنها کسانی که با پیوند دعوت می‌کنید می‌توانند بخوانندش. از دید بقیه پنهان می‌ماند، حتی همتاهای نزدیک.",
  "chat.info.public_privacy":
    "هر کس بپیوندد می‌تواند همهٔ پیام‌ها را بخواند. برای گفتگوی خصوصی از پیام مستقیم استفاده کنید؛ پیام‌های مستقیم سرتاسر رمزگذاری‌شده‌اند.",
  "chat.info.remove_member": "برداشتن عضو",
  "chat.info.remove_member_body":
    "{name} از گروه برداشته شود؟ کلید گروه چرخانده می‌شود تا دیگر نتوانند پیام‌های تازه را بخوانند.",
  "chat.info.message_member": "پیام به {name}",
  "chat.info.remove_member_a11y": "برداشتن {name}",
  "chat.info.no_addable":
    "همتای در دسترسی برای افزودن نیست. اعضا باید نزدیک باشند.",
  "chat.info.add_count": "افزودن {count}",
  "chat.info.teleported_tag": "{level}  ·  از راه دور",
  "chat.info.active": "فعال",
  "chat.info.members": "اعضا",
  "chat.info.bookmark": "نشانه‌گذاری این جا",
  "chat.info.remove_bookmark": "برداشتن نشانه",
  "chat.info.default_notice":
    "کانال‌های پیش‌فرض ترک‌شدنی نیستند. آن‌ها بخشی از پروتکل مش Airhop هستند.",
  "chat.info.custom_channel": "کانال دلخواه",
  "chat.info.geohash": "ژئوهش",
  "chat.info.copy_geohash": "کپی ژئوهش",
  "chat.info.relays": "رله‌ها",
  "chat.info.show_relays": "نمایش رله‌هایی که این کانال را می‌برند",
  "chat.info.relay_custom": "دلخواه",
  "chat.info.relays_none": "هیچ‌کدام. این سلول همین حالا تنها بلوتوثی است.",
  "chat.info.search_members": "جستجوی اعضا",
  "chat.info.search_members_placeholder": "جستجوی اعضا…",
  "chat.info.teleported": "از راه دور",
  "chat.info.creator": "سازنده",
  "chat.info.no_matches": "چیزی نمی‌خواند",
  "chat.info.no_one_here": "هنوز کسی اینجا نیست",
  "chat.info.add_members": "افزودن اعضا",
  "chat.info.add_selected": "افزودن اعضای برگزیده",
  "chat.info.add": "افزودن",
  "chat.info.leave_group": "ترک گروه",
  "chat.info.leave_channel": "ترک کانال",
  "chat.info.leave": "ترک کن",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "از {date} در حال گفتگو",
  "chat.contact.verified_since": "از {date} تأییدشده",
  "chat.contact.anonymous": "ناشناس",
  "chat.contact.anonymous_desc":
    "نامی مستعار بر پایهٔ ژئوهش، بدون هویتی ماندگار برای تأیید",
  "chat.contact.verified": "تأییدشده",
  "chat.contact.verified_desc": "کد QR آن‌ها را پویید",
  "chat.contact.verified_desc_compared": "کدها را با آن‌ها مقایسه کرد",
  "chat.contact.not_verified": "تأیید نشده",
  "chat.contact.not_verified_desc":
    "برای اطمینان از اینکه واقعاً خودشان‌اند، کدشان را بپویید یا در یک تماس کدی را مقایسه کنید",
  "chat.contact.e2ee": "سرتاسر رمزگذاری‌شده",
  "chat.contact.e2ee_nostr":
    "با NIP-17 در بسته‌بندی هدیه، پس رله‌ها نمی‌توانند بخوانندش",
  "chat.contact.e2ee_mesh":
    "Noise XX، به‌علاوهٔ Double Ratchet میان دستگاه‌های Airhop",
  "chat.contact.copy_nostr": "کپی کلید عمومی Nostr",
  "chat.contact.nostr_key": "کلید عمومی Nostr",
  "chat.contact.cell_key_note":
    "این کلید به منطقه‌ای تعلق دارد که در آن همدیگر را دیدید. اگر هر کدامتان جابه‌جا شود عوض می‌شود، و گفتگو هم با آن پایان می‌یابد. برای ادامهٔ گفتگو از هر جایی، مخاطبان را رد و بدل کنید.",
  "chat.contact.peer_name": "نام همتا",
  "chat.contact.peer_id": "شناسهٔ همتا",
  "chat.contact.rename": "تغییر نام",
  "chat.contact.rename_needs_contact":
    "می‌توانید نام کسانی را عوض کنید که کلیدهایشان را دارید. اول کارت‌های مخاطب را رد و بدل کنید، آن‌گاه این نامی می‌شود که تنها خودتان می‌بینید.",
  "chat.contact.rename_needs_keys":
    "هنوز کلیدی برای این مخاطب نیست. به آن‌ها پیام بدهید، یا کدشان را بپویید، تا بتوانید نامی به آن‌ها بدهید که تنها خودتان می‌بینید.",
  "chat.contact.renamed_by_you": "نامی که شما گذاشته‌اید",
  "chat.contact.copy_peer_id": "کپی شناسهٔ همتا",
  "chat.contact.verify": "تأیید مخاطب",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "اعلان‌ها",
  "chat.notices.post_area": "گذاشتن یک اعلان در این منطقه",
  "chat.notices.post_mesh": "گذاشتن یک اعلان روی مش",
  "chat.notices.mark_urgent": "نشان‌دار کردن به عنوان فوری",
  "chat.notices.post": "گذاشتن اعلان",
  "chat.notices.post_short": "بگذار",
  "chat.notices.delete": "حذف اعلان",
  "chat.notices.just_now": "همین حالا",
  "chat.notices.fades_soon": "به‌زودی محو می‌شود",
  "chat.notices.1_day": "1 روز",
  "chat.notices.3_days": "3 روز",
  "chat.notices.7_days": "7 روز",
  "chat.notices.fading": "در حال محو شدن",
  "chat.notices.fades_in_hours": "تا {count} ساعت دیگر محو می‌شود",
  "chat.notices.fades_in_days": "تا {count} روز دیگر محو می‌شود",
  "chat.notices.scope_geo": "جغرافیایی",
  "chat.notices.scope_mesh": "مش",
  "chat.notices.urgent_short": "فوری",
  "chat.notices.permanent_warning":
    "هرگز محو نمی‌شود. عمومی است و به این منطقه گره خورده، و نمی‌توانید پسش بگیرید.",
  "chat.notices.none":
    "هنوز اعلانی نیست. یکی بگذارید تا برای دیگران اینجا بماند.",

  // ---- Chats: search results ----
  "chat.search.photos": "عکس‌ها",
  "chat.search.videos": "ویدیوها",
  "chat.search.audio": "صدا",
  "chat.search.documents": "اسناد",
  "chat.search.links": "پیوندها",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "پالایش بر پایهٔ {filter}",
  "chat.search.no_matches": "هیچ {filter} با «{query}» نمی‌خواند",
  "chat.search.no_media": "هنوز {filter} نیست",
  "chat.search.result_a11y": "{chat}، {kind} از {sender}",
  "chat.search.you": "شما",
  "chat.search.section_chats": "گفتگوها",
  "chat.search.section_messages": "پیام‌ها",
  "chat.search.section_notices": "اعلان‌ها",
  "chat.search.hint":
    "پیام‌ها و گفتگوها را بجویید، یا از بالا یک پالایه برگزینید.",
  "chat.search.no_results": "نتیجه‌ای برای «{query}» نیست",
  "chat.search.open_chat": "باز کردن {name}",
  "chat.search.message_a11y": "{chat}، پیام از {sender}: {snippet}",
  "chat.search.notice_a11y": "اعلان در {chat} از {author}: {snippet}",
  "chat.search.urgent": "فوری ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "{count} مورد در این فهرست است. پاک کردن تنها آن‌ها را از اینجا برمی‌دارد، و پیام‌ها در گفتگوهایشان خوانده‌نشده می‌مانند. علامت زدن همه به عنوان خوانده‌شده هر دو را پاک می‌کند.",
  "chat.notif.mark_all_read": "همه را خوانده‌شده علامت بزن",
  "chat.notif.clear_list": "پاک کردن فهرست",
  "chat.notif.clear_all_a11y": "پاک کردن هر {count} اعلان",
  "chat.notif.title": "اعلان‌ها",
  "chat.notif.clear_short": "پاک کن",
  "chat.notif.close": "بستن اعلان‌ها",
  "chat.notif.none": "هنوز اعلانی نیست",
  "chat.notif.none_desc":
    "پیام‌ها، نام بردن‌ها و اعلان‌های کانال‌ها و گفتگوهای شما اینجا نمایان می‌شوند.",
  "chat.notif.new": "تازه",
  "chat.notif.notice_in": "اعلان در {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "هدایت به…",
  "chat.forward.to": "هدایت به {name}",
  "chat.forward.cant_send_here": "اینجا هدایت ممکن نیست",
  "chat.forward.cant_send_to": "هدایت به {name} ممکن نیست",
  "chat.forward.channels": "کانال‌ها",
  "chat.forward.groups": "گروه‌ها",
  "chat.forward.locations": "موقعیت‌ها",
  "chat.forward.dms": "پیام‌های مستقیم",
  "chat.forward.none": "هنوز گفتگوی دیگری نیست",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "در حال راه‌اندازی مش…",
  "mesh.banner.no_bluetooth": "این دستگاه بلوتوث ندارد · فقط اینترنت",
  "mesh.banner.bluetooth_off": "بلوتوث خاموش · مش در دسترس نیست",
  "mesh.banner.bluetooth_off_wifi": "بلوتوث خاموش · مش روی WiFi کار می‌کند",
  "mesh.banner.permission_needed": "به اجازهٔ بلوتوث نیاز است",
  "mesh.banner.blocked": "بلوتوث مسدود است · در تنظیمات اجازه دهید",
  "mesh.banner.location_permission":
    "برای یافتن همتاها به موقعیت مکانی نیاز است",
  "mesh.banner.advertising_unsupported":
    "این گوشی دیگران را می‌بیند اما خودش دیده نمی‌شود",
  "mesh.banner.location_off_android":
    "موقعیت مکانی خاموش · Android برای یافتن همتاها به آن نیاز دارد",
  "mesh.banner.paused": "مش متوقف است · شما دور هستید",
  "mesh.banner.location_off":
    "موقعیت مکانی خاموش · کانال‌های موقعیت در دسترس نیستند",
  "mesh.banner.battery_saver": "ذخیرهٔ باتری · پویش کم‌تر",
  "mesh.banner.wipe_incomplete":
    "پاک‌سازی ناتمام · ممکن است داده‌هایی مانده باشد، با باز کردن دوباره تلاش می‌شود",
  "mesh.banner.wifi_off": "Wi-Fi خاموش · فایل‌های بزرگ کندتر می‌روند",
  "mesh.banner.clock_skew":
    "ساعت این گوشی نادرست است · تاریخ و ساعت را روی خودکار بگذارید",
  "mesh.banner.internet_off": "اینترنت خاموش · فقط بلوتوث",
  "mesh.banner.relaying": "همتایی در نزدیکی نیست · بازپخش از راه Nostr",
  "mesh.banner.tor": "Tor روشن · ترافیک اینترنت مسیردهی شد",
  "mesh.banner.tor_starting": "در حال راه‌اندازی Tor · اتصال",
  "mesh.banner.tor_blocked": "Tor نتوانست وصل شود · مش همچنان کار می‌کند",
  "mesh.banner.gateway": "دروازهٔ اینترنت روشن · بازپخش برای همتاهای نزدیک",
  "mesh.banner.bridge": "پل مش روشن · گفتگوی عمومی پیوند خورد",
  "mesh.banner.background_limits":
    "{brand} ممکن است مش را در پس‌زمینه متوقف کند",
  "mesh.banner.bridge_across": "پل مش روشن · {count} نفر آن سوی پل",
  "mesh.banner.action.turn_on": "روشن کن",
  "mesh.banner.action.allow": "اجازه بده",
  "mesh.banner.action.resume": "از سر بگیر",
  "mesh.banner.action.fix": "درست کن",
  "mesh.banner.hint.resume": "پخش و پویش بلوتوث را دوباره روشن می‌کند",
  "mesh.banner.hint.enable_bluetooth": "از Android می‌خواهد بلوتوث را روشن کند",
  "mesh.banner.hint.location_settings":
    "تنظیمات موقعیت مکانی سیستم را باز می‌کند",
  "mesh.banner.hint.app_settings":
    "دسترسی‌های Airhop را در تنظیمات سیستم باز می‌کند",
  "mesh.banner.hint.battery_settings":
    "تنظیمات فعالیت پس‌زمینهٔ این گوشی را باز می‌کند",
  "mesh.banner.dismiss": "بستن: {label}",
  "mesh.banner.hint.dismiss": "این یادداشت را برای همیشه پنهان می‌کند",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "در حال جستجوی همتاهای نزدیک…",
  "mesh.radar.starting": "در حال راه‌اندازی مش…",
  "mesh.radar.no_bluetooth": "این دستگاه بلوتوث ندارد",
  "mesh.radar.bluetooth_off": "بلوتوث خاموش · پویشی انجام نمی‌شود",
  "mesh.radar.permission_needed": "به اجازهٔ بلوتوث نیاز است",
  "mesh.radar.blocked": "بلوتوث مسدود است",
  "mesh.radar.location_permission": "به اجازهٔ موقعیت مکانی نیاز است",
  "mesh.radar.location_off": "موقعیت مکانی خاموش · پویشی انجام نمی‌شود",
  "mesh.radar.hint_rings":
    "حلقه‌ها قدرت سیگنال BLE را نشان می‌دهند، نه فاصله را",
  "mesh.radar.hint_checking": "در حال بررسی بلوتوث و دسترسی‌ها",
  "mesh.radar.hint_internet": "پیام‌ها همچنان از راه اینترنت می‌روند و می‌آیند",
  "mesh.radar.hint_turn_on": "برای یافتن همتاها بلوتوث را روشن کنید",
  "mesh.radar.hint_allow": "برای یافتن همتاها به بلوتوث اجازه دهید",
  "mesh.radar.hint_allow_settings":
    "برای یافتن همتاها در تنظیمات به بلوتوث اجازه دهید",
  "mesh.radar.hint_location_permission":
    "Android 11 و پایین‌تر برای پویش با بلوتوث به موقعیت مکانی نیاز دارند",
  "mesh.radar.hint_android_location":
    "Android برای برگرداندن نتایج پویش بلوتوث به موقعیت مکانی روشن نیاز دارد",
  "mesh.radar.signal_strong": "قوی",
  "mesh.radar.signal_medium": "متوسط",
  "mesh.radar.signal_weak": "ضعیف",
  "mesh.radar.you_center": "شما، در مرکز مش",
  "mesh.radar.sonar_hint":
    "یک جاروب سونار پخش می‌کند. پویش از پیش پیوسته در جریان است.",
  "mesh.radar.paused": "مش متوقف است · شما دور هستید",
  "mesh.radar.ring_hint": "جای حلقه بازتاب قدرت سیگنال است، نه فاصله",
  "mesh.radar.set_online":
    "برای یافتن همتاها وضعیت خود را در نمایه روی برخط بگذارید",
  "mesh.radar.in_range": "در محدوده",
  "mesh.radar.recently_seen": "به‌تازگی دیده شده",
  "mesh.radar.peer_hint":
    "گزینه‌های پیام دادن یا پرداخت به این همتا را باز می‌کند",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "همین حالا",
  "mesh.peer.none": "همتایی در نزدیکی نیست",
  "mesh.peer.none_desc":
    "دستگاه‌های دیگر Airhop یا bitchat که در محدودهٔ بلوتوث باشند اینجا نمایان می‌شوند.",
  "mesh.peer.id_copied": "شناسهٔ همتا کپی شد",
  "mesh.peer.copy_id": "کپی شناسهٔ همتا",
  "mesh.peer.their_name": "با نام {name} شناخته می‌شود",
  "mesh.peer.in_range": "در محدوده",
  "mesh.peer.relay": "گرهٔ بازپخش",
  "mesh.peer.relay_body":
    "رادیویی که کسی روشن گذاشته تا مش را گسترده‌تر کند. پیام‌هایی را جابه‌جا می‌کند که خودش نمی‌تواند بخواند. اینجا کسی نیست که به او پیام بدهید.",
  "mesh.peer.send_dm": "فرستادن پیام مستقیم",
  "mesh.peer.message": "پیام",
  "mesh.peer.send_sats": "فرستادن ecash",
  "mesh.peer.amount_placeholder": "مبلغ به sats",
  "mesh.peer.amount_first": "فرستادن ecash، اول مبلغی وارد کنید",
  "mesh.peer.cancel_send": "لغو فرستادن ecash",
  "mesh.peer.view_peer": "دیدن همتا {name}",
  "mesh.peer.view_peer_online": "دیدن همتا {name}، برخط",
  "mesh.peer.last_seen": "{ago} پیش دیده شد",
  "mesh.peer.send_amount": "فرستادن {amount} sats",
  "mesh.peer.direct": "اتصال مستقیم",
  "mesh.peer.check_distance": "بررسی فاصله",
  "mesh.peer.checking": "در حال بررسی",
  "mesh.peer.no_reply": "پاسخی نیامد",
  "mesh.peer.no_reply_hint":
    "شاید جابه‌جا شده‌اند، یا شاید برنامه‌شان پاسخ نمی‌دهد",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "منطقه",
  "mesh.level.province": "استان",
  "mesh.level.city": "شهر",
  "mesh.level.neighborhood": "محله",
  "mesh.level.block": "بلوک شهری",
  "mesh.level.building": "ساختمان",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "قابل خرج",
  "wallet.balance.unit_hint": "میان ساتوشی و بیت‌کوین جابه‌جا می‌شود",
  "wallet.balance.a11y": "موجودی {value} {unit}",
  "wallet.balance.locked":
    "حافظهٔ کیف پول قفل است. اثبات‌های ecash در فایلی رمزگذاری‌شده نگه‌داری می‌شوند که کلیدش در کلیدان دستگاه است، و آن فایل باز نشد. قفل دستگاه را باز کنید و Airhop را دوباره باز کنید.",
  "wallet.balance.tor_blocked":
    "Tor روشن است، پس درخواست‌های ضراب‌خانه مسدودند: آن‌ها از شبکهٔ باز بیرون می‌روند و نشانی IP شما را به اثبات‌هایتان گره می‌زنند. فرستادن و گرفتن روی مش همچنان کار می‌کند. ترافیک ضراب‌خانه را زیر تنظیمات، امنیت مجاز کنید.",
  "wallet.balance.unconfirmed_note": "{amount} هنوز با ضراب‌خانه تأیید نشده",
  "wallet.balance.reserved_note":
    "{amount} برای ارسالی در جریان کنار گذاشته شده",
  "wallet.balance.other_mint_note": "{amount} در حساب ضراب‌خانه‌ای جداگانه",
  "wallet.balance.test_mint_note":
    "شامل پول آزمایشی از یک ضراب‌خانهٔ تستی است. بیت‌کوین نیست و نمی‌توان نقدش کرد.",
  "wallet.token": "توکن",
  "wallet.action.send": "فرستادن توکن ecash",
  "wallet.action.send_disabled":
    "فرستادن توکن ecash، با موجودی خالی در دسترس نیست",
  "wallet.action.receive": "گرفتن توکن ecash",
  "wallet.action.zap": "زپ به یک مخاطب Nostr",
  "wallet.action.zap_disabled":
    "زپ به یک مخاطب Nostr، با موجودی خالی در دسترس نیست",
  "wallet.action.add_mint": "افزودن یک ضراب‌خانهٔ Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "توکن ساخته نشد",
  "wallet.send.title": "فرستادن ecash",
  "wallet.send.amount_in": "مبلغ به {unit}",
  "wallet.send.body":
    "به شکل برون‌خط از اثبات‌هایی که همین حالا دارید ساخته می‌شود. تا وقتی تأیید نکنید توکن رسیده است، چیزی برای همیشه از موجودی شما بیرون نمی‌رود.",
  "wallet.send.stale_fee_note":
    "کارمزدها آخرین بار {days} روز پیش بررسی شدند. اگر این ضراب‌خانه از آن زمان کارمزدش را بالا برده باشد، این ارسال کمی بیشتر هزینه می‌برد.",
  "wallet.send.fee_note":
    "{spend} {unit} از موجودی شما بیرون می‌رود؛ {fee} اضافی همان کارمزد ضراب‌خانه‌ای را می‌پوشاند که وگرنه خودشان می‌پرداختند",
  "wallet.send.qr_too_big":
    "این توکن میان سکه‌های بیش از حد زیادی پخش شده و در یک کد QR جا نمی‌شود. به جایش هم‌رسانی یا کپی کنید، یا برای یکپارچه‌سازی در ضراب‌خانه تازه‌سازی کنید.",
  "wallet.send.bearer_note":
    "هر کس این رشته را داشته باشد صاحب پول است. اثبات‌ها کنار گذاشته شده‌اند، نه خرج‌شده: اگر هرگز به کسی نرسد می‌توانید زیر بخش در انتظار پسشان بگیرید.",
  "wallet.send.qr_too_big_short":
    "این توکن میان سکه‌های بیش از حد زیادی پخش شده و در یک کد QR جا نمی‌شود. به جایش هم‌رسانی یا کپی کنید.",
  "wallet.send.scan_note":
    "از آن‌ها بخواهید این را از کیف پول خودشان بپویند. تا وقتی رسیده علامتش نزنید همچنان پس‌گرفتنی است.",
  "wallet.send.mesh_note":
    "توکن به شکل یک پیام مستقیم رمزگذاری‌شده روی مش می‌رود. نیازی به اینترنت نیست.",
  "wallet.send.no_peers_note":
    "برای یافتن دستگاه‌های نزدیک زبانهٔ مش را باز کنید، یا توکن را جور دیگری هم‌رسانی کنید.",
  "wallet.send.send_to": "فرستادن به {name}",
  "wallet.send.memo": "یادداشت (اختیاری، همراه توکن می‌رود)",
  "wallet.send.building": "در حال ساخت…",
  "wallet.send.build": "ساخت توکن",
  "wallet.send.inexact_body":
    "اثبات‌های شما به شکل برون‌خط دقیقاً {amount} {unit} نمی‌سازند. کوچک‌ترین توکنی که می‌توانید بسازید {spend} {unit} است، و برون‌خط باقیمانده‌ای در کار نیست: {extra} {unit} اضافی به گیرنده می‌رسد.\n\nتازه‌سازی در ضراب‌خانه هنگام برخط بودن، اثبات‌های شما را به واحدهایی می‌شکند که این مبلغ را دقیق می‌کنند.",
  "wallet.send.send_amount": "فرستادن {amount}",
  "wallet.send.sent_to": "{amount} {unit} به {name} فرستاده شد",
  "wallet.send.sent_to_body":
    "{route} تا وقتی تأیید کنید که گرفته‌اند، یا تا وقتی ضراب‌خانه به ما بگوید اثبات‌ها بازخرید شده‌اند، زیر بخش در انتظار پس‌گرفتنی می‌ماند.",
  "wallet.send.copy_token": "کپی توکن",
  "wallet.send.share_token": "هم‌رسانی توکن",
  "wallet.send.open_in_wallet": "باز کردن این توکن در کیف پولی دیگر",
  "wallet.send.open_in_wallet_short": "باز کردن در کیف پول",
  "wallet.send.to_peer": "فرستادن توکن به یک همتای نزدیک",
  "wallet.send.to_peer_short": "فرستادن به همتا",
  "wallet.send.mark_delivered": "علامت‌گذاری به عنوان رسیده و پایان",
  "wallet.send.they_got_it": "گرفتند",
  "wallet.send.keep_pending": "این ارسال را در انتظار نگه دار",
  "wallet.send.decide_later": "بعداً تصمیم می‌گیرم",
  "wallet.send.no_peers": "همتایی در محدوده نیست",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "این پرداخت خودتان است",
  "wallet.receive.own_payment_body":
    "این سکه‌ها هنوز برای ارسالی که تسویه‌اش نکرده‌اید کنار گذاشته شده‌اند، پس چیزی برای دریافت نیست. روی همان پرداخت از پس‌گرفتن استفاده کنید تا یک‌راست به موجودی‌تان بازگردند.",
  "wallet.receive.already_have": "از پیش در کیف پول شماست",
  "wallet.receive.already_have_body":
    "هر اثبات در این توکن همین حالا اینجا ذخیره است، پس چیزی اضافه نشد. موجودی‌ها تغییری نکردند.",
  "wallet.receive.stored_unconfirmed":
    "از {mint} ذخیره شد، اما هنوز با ضراب‌خانه تأیید نشده ({reason}).",
  "wallet.receive.offline": "برون‌خط",
  "wallet.receive.redeemed_here":
    "در {mint} بازخرید شد. این اثبات‌ها اکنون تنها از آن شمایند: نسخهٔ فرستنده دیگر کار نمی‌کند.",
  "wallet.receive.memo_quoted": "\n\n«{memo}»",
  "wallet.receive.redeemed_at":
    "در {mint} بازخرید شد. اکنون به شکل اثبات‌پذیر از آن شماست: نسخهٔ فرستنده از این توکن دیگر کار نمی‌کند.",
  "wallet.receive.stored_pending":
    "از {mint} ذخیره شد، اما ضراب‌خانه هنوز تأیید نکرده که خرج‌نشده است{dleq}. همین که برخط شدید از زبانهٔ کیف پول تازه‌سازی کنید.",
  "wallet.receive.dleq_inline":
    " (امضایش که درست از آب درمی‌آید، پس توکن اصل است)",
  "wallet.receive.dleq_ok":
    "امضای ضراب‌خانه درست از آب درمی‌آید، پس توکن اصل است.",
  "wallet.receive.dleq_uncached":
    "کلیدهای ضراب‌خانه اینجا ذخیره نیستند، پس امضا به شکل برون‌خط بررسی نشد.",
  "wallet.receive.dleq_warning":
    "تا وقتی برخط تازه‌سازی نکنید، در اصل ممکن است فرستنده آن را جای دیگری خرج کرده باشد.",
  "wallet.receive.failed": "دریافت نشد",
  "wallet.receive.title": "گرفتن ecash",
  "wallet.receive.body":
    "یک توکن Cashu بچسبانید. برخط که باشید بی‌درنگ در ضراب‌خانه بازخرید می‌شود؛ برون‌خط ذخیره می‌شود و دفعهٔ بعد که تازه‌سازی کنید تأیید می‌شود.",
  "wallet.receive.scan": "پویش یک کد QR مربوط به ecash",
  "wallet.receive.scan_short": "پویش QR",
  "wallet.receive.receiving": "در حال دریافت…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "یک Nutzap از {from}… رسید و در کیف پول شما بازخرید شد.",
  "wallet.zap.title": "زپ به یک هویت Nostr",
  "wallet.zap.not_npub": "npub نیست",
  "wallet.zap.bad_key": "کلید نادرست",
  "wallet.zap.invalid_pubkey": "کلید عمومی نامعتبر",
  "wallet.zap.invalid_pubkey_body":
    "یک npub1… یا یک کلید عمومی Nostr شانزده‌شانزدهی 64 نویسه‌ای وارد کنید.",
  "wallet.zap.sent": "Nutzap فرستاده شد",
  "wallet.zap.failed": "زپ ناموفق بود",
  "wallet.zap.body":
    "اگر آن‌ها اطلاعات nutzap مطابق NIP-61 منتشر کرده باشند، ecash به کلیدشان قفل می‌شود تا کس دیگری نتواند خرجش کند، و دیگر پس گرفته نمی‌شود. اگر نه، به جایش به شکل توکنی پس‌گرفتنی می‌رود. به شما گفته می‌شود کدام یک رخ داده است.",
  "wallet.zap.contact": "زپ به {name}",
  "wallet.zap.pubkey_placeholder": "npub1… یا 64 نویسهٔ شانزده‌شانزدهی",
  "wallet.zap.sending": "در حال فرستادن…",
  "wallet.nostr.copied_body":
    "این را به کسی بدهید تا بتواند از Airhop یا هر کیف پول Nostr دیگری به شما زپ کند، بی‌آنکه بلوتوثی لازم باشد.",
  "wallet.nostr.copy_key":
    "کلید Nostr خود را کپی کنید تا مردم بتوانند به شما زپ کنند",
  "wallet.nostr.your_key": "کلید Nostr شما",

  // ---- Wallet: mints ----
  "wallet.mint.added": "ضراب‌خانه افزوده شد",
  "wallet.mint.add_failed": "ضراب‌خانه افزوده نشد",
  "wallet.mint.added_named": "{name} افزوده شد",
  "wallet.mint.added_body":
    "{mint} واحد {units} صادر می‌کند. کلیدهایش روی این دستگاه ذخیره شده‌اند، پس توکن‌های آن اکنون حتی بدون اینترنت هم قابل راستی‌آزمایی‌اند.",
  "wallet.mint.remove_plain":
    "{mint} از کیف پول شما برداشته شود؟ کلیدهای ذخیره‌شده‌اش هم می‌روند، پس توکن‌های آن دیگر به شکل برون‌خط راستی‌آزمایی نمی‌شوند.",
  "wallet.mint.title": "ضراب‌خانه‌ها",
  "wallet.mint.none": "هنوز ضراب‌خانه‌ای نیست",
  "wallet.mint.none_desc":
    "ضراب‌خانه ecash شما را صادر و بازخرید می‌کند. برای واریز از راه Lightning یکی اضافه کنید، یا فقط یک توکن بگیرید تا ضراب‌خانه‌اش برایتان افزوده شود.",
  "wallet.mint.add": "افزودن یک ضراب‌خانه",
  "wallet.mint.add_body":
    "ضراب‌خانه همان Bitcoin پشتوانهٔ ecash شما را نگه می‌دارد، پس یکی را برگزینید که به اندازهٔ موجودی‌تان به آن اعتماد دارید. نشانی پیش از ذخیره بررسی می‌شود. اگر ترجیح می‌دهید به کسی اعتماد نکنید، با Nutshell یکی از خودتان راه بیندازید.",
  "wallet.mint.consolidate_body":
    "یک توکن همیشه تنها می‌تواند نام یک ضراب‌خانه را ببرد، پس موجودی پخش‌شده میان چند ضراب‌خانه نمی‌تواند مبلغی بزرگ‌تر از آنچه بزرگ‌ترینشان دارد بپردازد. Airhop می‌تواند جابه‌جایش کند: هر ضراب‌خانهٔ دیگر یک صورتحساب Lightning را می‌پردازد که ضراب‌خانهٔ برگزیدهٔ شما صادر کرده است. کارمزد مسیریابی اندکی دارد و به اینترنت نیاز است.",
  "wallet.mint.add_short": "افزودن ضراب‌خانه",
  "wallet.mint.checking": "در حال بررسی…",
  "wallet.mint.remove_with_balance": "ضراب‌خانه‌ای که موجودی دارد برداشته شود؟",
  "wallet.mint.remove": "برداشتن ضراب‌خانه",
  "wallet.mint.delete_anyway": "به هر حال حذف کن",
  "wallet.mint.consolidate": "بردن همهٔ موجودی‌ها به یک ضراب‌خانه",
  "wallet.mint.confirm_with": "تأیید اثبات‌ها با {mint}",
  "wallet.mint.remove_a11y": "برداشتن {mint}",
  "wallet.mint.available_amount": "{amount} {unit} در دسترس",
  "wallet.mint.split_across":
    "موجودی میان {count} ضراب‌خانه پخش شده است. به یکی ببریدش.",
  "wallet.mint.move_everything_to": "بردن همه چیز به {mint}",
  "wallet.mint.consolidate_title": "بردن به یک ضراب‌خانه",
  "wallet.mint.moving": "در حال جابه‌جایی…",
  "wallet.mint.move": "جابه‌جا کن",
  "wallet.mint.moved": "جابه‌جا شد",
  "wallet.mint.moved_body":
    "پس از {fees} {unit} کارمزد مسیریابی Lightning، اکنون {amount} {unit} در {mint} است.",
  "wallet.mint.nothing_moved": "چیزی جابه‌جا نشد",
  "wallet.mint.destination": "· مقصد",
  "wallet.mint.will_move": "· جابه‌جا خواهد شد",
  "wallet.mint.issued_by": "صادرکننده",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "شارژ کیف پول Airhop",
  "wallet.ln.invoice_failed": "صورتحساب ساخته نشد",
  "wallet.ln.price_failed": "قیمت این صورتحساب محاسبه نشد",
  "wallet.ln.paid": "پرداخت شد",
  "wallet.ln.deposit_credited":
    "صورتحساب پرداخت شد و {mint} مبلغ {amount} {unit} صادر کرد. این موجودی تأییدشده است: می‌توانید بی‌درنگ به شکل برون‌خط خرجش کنید.",
  "wallet.ln.withdrawn":
    "{paid} sats از راه Lightning پرداخت شد. ضراب‌خانه {fee} sats کارمزد مسیریابی گرفت.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats از راه Lightning پرداخت شد. ضراب‌خانه {fee} sats کارمزد مسیریابی گرفت و {change} sats از مبلغ کنارگذاشته را به موجودی شما بازگرداند.",
  "wallet.ln.payment_failed": "پرداخت ناموفق بود",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "sats روی Lightning را به ecash‌ای بدل کنید که برون‌خط خرج می‌شود، یا ecash را به هر صورتحساب Lightning نقد کنید. هر دو به اینترنت و یک ضراب‌خانه نیاز دارند.",
  "wallet.ln.deposit_body":
    "ضراب‌خانه به شما یک صورتحساب می‌دهد. از هر کیف پول Lightning پرداختش کنید تا sats به شکل ecash‌ای که برون‌خط خرج می‌شود بازگردد.",
  "wallet.ln.pay_invoice_for":
    "این صورتحساب به مبلغ {amount} {unit} را بپردازید. کیف پول مراقب پرداخت است و ecash شما را خودکار صادر می‌کند.",
  "wallet.ln.expired_body":
    "این صورتحساب منقضی شد. اگر پیش‌تر پرداختش کرده باشید، موجودی خودکار افزوده می‌شود.",
  "wallet.ln.waiting_expires":
    "در انتظار پرداخت · تا {countdown} دیگر منقضی می‌شود",
  "wallet.ln.withdraw_body":
    "یک صورتحساب bolt11 بچسبانید تا ضراب‌خانه از ecash شما بپردازدش. اول مبلغ کنارگذاشته برای مسیریابی به شما گفته می‌شود؛ هر چه مسیریابی مصرف نکند به موجودی شما بازمی‌گردد.",
  "wallet.ln.up_to": "تا {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "پرداخت {amount} {unit}",
  "wallet.ln.deposit": "واریز sats از راه Lightning",
  "wallet.ln.deposit_short": "واریز",
  "wallet.ln.withdraw": "برداشت به یک صورتحساب Lightning",
  "wallet.ln.withdraw_short": "برداشت",
  "wallet.ln.deposit_title": "واریز از راه Lightning",
  "wallet.ln.amount_placeholder": "مبلغ به sats",
  "wallet.ln.requesting": "در حال درخواست…",
  "wallet.ln.get_invoice": "گرفتن صورتحساب",
  "wallet.ln.copy_invoice": "کپی صورتحساب",
  "wallet.ln.open_wallet": "باز کردن در یک کیف پول Lightning",
  "wallet.ln.open_wallet_short": "باز کردن در کیف پول",
  "wallet.ln.waiting": "در انتظار پرداخت…",
  "wallet.ln.new_invoice": "ساخت یک صورتحساب تازه",
  "wallet.ln.new_invoice_short": "صورتحساب تازه",
  "wallet.ln.withdraw_title": "برداشت به Lightning",
  "wallet.ln.scan_invoice": "پویش کد QR یک صورتحساب Lightning",
  "wallet.ln.paid_from": "پرداخت از",
  "wallet.ln.invoice": "صورتحساب",
  "wallet.ln.routing_reserve": "ذخیرهٔ مسیریابی",
  "wallet.ln.reserved": "کنارگذاشته از موجودی",
  "wallet.ln.paying": "در حال پرداخت…",
  "wallet.ln.get_quote": "گرفتن برآورد",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "پشتیبان‌گیری",
  "wallet.backup.setup_failed": "پشتیبان‌گیری راه‌اندازی نشد",
  "wallet.backup.on": "پشتیبان‌گیری روشن",
  "wallet.backup.on_body":
    "اکنون موجودی شما از آن دوازده واژه دوباره ساخته می‌شود.\n\nهر چه دیگری به شما داده باشد تا وقتی در ضراب‌خانه تازه‌سازی نکنید بیرون از این عبارت می‌ماند، و بازیابی به فهرست ضراب‌خانه‌های شما نیاز دارد، پس آن را کنار واژه‌ها بنویسید.",
  "wallet.backup.no_phrase": "عبارتی ذخیره نشده",
  "wallet.backup.no_phrase_body":
    "عبارت بازیابی از کلیدان دستگاه خوانده نشد. قفل دستگاه را باز کنید و دوباره تلاش کنید.",
  "wallet.backup.replace_title": "عبارت کنونی شما جایگزین شود؟",
  "wallet.backup.replace_body":
    "شما از پیش یک عبارت بازیابی دارید. بازگرداندن عبارتی دیگر جای آن را می‌گیرد. سکه‌هایی که عبارت قدیمی پوشش می‌داد روی این دستگاه همچنان قابل خرج می‌مانند، اما دیگر قابل بازگرداندن نیستند، پس پیش از ادامه مطمئن شوید واژه‌های قدیمی را نوشته‌اید.",
  "wallet.backup.replace": "جایگزین کن",
  "wallet.backup.invalid_phrase": "آن عبارت معتبر نیست",
  "wallet.backup.invalid_phrase_body":
    "عبارت یک کد وارسی درونی دارد و این یکی از آن رد نمی‌شود. دنبال واژه‌ای بگردید که بد تایپ شده، جا افتاده یا جابه‌جا شده باشد.",
  "wallet.backup.not_bip39":
    "این‌ها واژه‌های BIP-39 نیستند: {words}. املا را بررسی کنید.",
  "wallet.backup.add_mint_first": "اول یک ضراب‌خانه اضافه کنید",
  "wallet.backup.add_mint_first_body":
    "بازیابی با پرسیدن از یک ضراب‌خانه کار می‌کند که کدام سکه‌ها را برای شما امضا کرده، پس باید بداند از کدام ضراب‌خانه بپرسد. ضراب‌خانه‌هایی را که به کار می‌بردید اضافه کنید، سپس بازگردانید.",
  "wallet.backup.restore_failed": "بازگرداندن ناموفق بود",
  "wallet.backup.phrase": "عبارت بازیابی",
  "wallet.backup.state_unconfirmed": "پشتیبان‌گیری روشن اما تأییدنشده",
  "wallet.backup.state_off": "پشتیبان‌گیری خاموش",
  "wallet.backup.badge_on": "روشن",
  "wallet.backup.badge_unconfirmed": "تأییدنشده",
  "wallet.backup.badge_off": "خاموش",
  "wallet.backup.view": "دیدن عبارت بازیابی",
  "wallet.backup.setup": "راه‌اندازی عبارت بازیابی",
  "wallet.backup.view_short": "دیدن عبارت",
  "wallet.backup.setup_short": "راه‌اندازی",
  "wallet.backup.restore": "بازگرداندن یک کیف پول از روی عبارت بازیابی",
  "wallet.backup.restore_short": "بازگرداندن",
  "wallet.backup.setup_title": "راه‌اندازی یک عبارت بازیابی",
  "wallet.backup.on_body_short":
    "موجودی شما روی دستگاهی تازه از دوازده واژه‌تان دوباره ساخته می‌شود.",
  "wallet.backup.unconfirmed_body":
    "شما هرگز تأیید نکردید نسخه‌ای نوشته‌اید. همین حالا این واژه‌ها تنها روی همین گوشی‌اند، و دقیقاً همان چیزی است که پشتیبان باید از آن جان سالم به در ببرد. عبارت را ببینید و بنویسیدش.",
  "wallet.backup.not_covered":
    "{amount} هنوز پوشش داده نشده است. سکه‌هایی که به شما داده‌اند رازهای فرستنده‌شان را با خود دارند، پس تنها پس از تعویض زیر پوشش عبارت شما می‌آیند. برای ایمن کردنشان یک ضراب‌خانه را تازه‌سازی کنید.",
  "wallet.backup.off_body":
    "ecash شما تنها روی همین گوشی وجود دارد. اگر گمش کنید، هیچ‌کس نمی‌تواند پول را بازگرداند، از جمله خودتان. عبارت بازیابی دوازده واژه است که موجودی شما را هر جایی دوباره می‌سازد.",
  "wallet.backup.about_to_see":
    "می‌خواهید دوازده واژه ببینید. آن‌ها خودِ پول‌اند.",
  "wallet.backup.exact_order":
    "دوازده واژه، دقیقاً به همین ترتیب. هر کس آن‌ها را داشته باشد موجودی شما را دارد.",
  "wallet.backup.verify_body":
    "عبارتی که کسی ننوشته باشد بدتر از نداشتن عبارت است، چون شبیه تور نجاتی است که وجود ندارد. دو واژه برای تأیید.",
  "wallet.backup.verify_mismatch":
    "این نمی‌خواند. نسخهٔ نوشته‌شدهٔ خود را بررسی کنید.",
  "wallet.backup.restore_body":
    "دوازده واژه را وارد کنید. Airhop سکه‌های شما را دوباره استخراج می‌کند و از هر ضراب‌خانه می‌پرسد کدامشان را امضا کرده، تا موجودی از سوابقی که ضراب‌خانه نگه می‌دارد بازگردد.",
  "wallet.backup.warn_secret":
    "هر کس این‌ها را بخواند می‌تواند موجودی شما را ببرد. از آن‌ها عکس صفحه نگیرید و روی این گوشی نگهشان ندارید.",
  "wallet.backup.warn_paper":
    "آن‌ها را روی کاغذ بنویسید و جایی امن نگه دارید. اگر گوشی از دست برود، Airhop نمی‌تواند دوباره نشانتان دهد.",
  "wallet.backup.warn_scope":
    "این‌ها تنها ecash شما را بازمی‌سازند. هویت، گفتگوها و مخاطبان شما پوشش داده نمی‌شوند.",
  "wallet.backup.warn_mints":
    "بازیابی ناچار است از یک ضراب‌خانه بپرسد کدام سکه‌ها را امضا کرده، پس فهرست ضراب‌خانه‌هایتان را کنار واژه‌ها بنویسید.",
  "wallet.backup.preparing": "در حال آماده‌سازی…",
  "wallet.backup.show_phrase": "عبارتم را نشان بده",
  "wallet.backup.your_phrase": "عبارت بازیابی شما",
  "wallet.backup.write_down": "این‌ها را بنویسید",
  "wallet.backup.copy_phrase": "کپی عبارت بازیابی در بریده‌دان",
  "wallet.backup.copy_clipboard": "کپی در بریده‌دان",
  "wallet.backup.written_down": "نوشتمشان",
  "wallet.backup.check_copy": "نسخهٔ خود را بررسی کنید",
  "wallet.backup.confirm": "تأیید",
  "wallet.backup.restore_title": "بازگرداندن از یک عبارت",
  "wallet.backup.phrase_placeholder": "دوازده واژه، جداشده با فاصله",
  "wallet.backup.no_mints_yet":
    "هنوز ضراب‌خانه‌ای افزوده نشده. بازیابی ناچار است از ضراب‌خانه‌ای مشخص بپرسد، پس اول آن‌هایی را که به کار می‌بردید اضافه کنید.",
  "wallet.backup.scanning": "در حال جستجو…",
  "wallet.backup.restore_progress": "{mint} · مجموعه‌کلید {step} از {total}",
  "wallet.backup.will_scan":
    "جستجو خواهد شد: {mints}. از ضراب‌خانه‌ای که نیفزوده‌اید هرگز پرسیده نمی‌شود، پس موجودی آنجا نادیده می‌ماند.",
  "wallet.backup.word_n": "واژهٔ {position}",
  "wallet.backup.unreachable_mints":
    "دسترسی ممکن نشد به: {mints}. هر موجودی آنجا همچنان سر جایش است. با اتصالی بهتر دوباره تلاش کنید.",
  "wallet.backup.nothing_recovered":
    "از ضراب‌خانه‌های جستجوشده چیزی بازیابی نشد.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "به عنوان دریافت‌شده علامت بزنیم؟",
  "wallet.delivered.body":
    "این کار {amount} {unit} را برای همیشه آزاد می‌کند. اگر واقعاً هرگز نرسیده باشد، دیگر نمی‌توانید پسش بگیرید.",
  "wallet.delivered.body_generic":
    "این کار مبلغ کنارگذاشته را برای همیشه آزاد می‌کند. اگر واقعاً هرگز نرسیده باشد، دیگر نمی‌توانید پسش بگیرید.",
  "wallet.delivered.cancel": "هنوز نه",
  "wallet.delivered.confirm": "گرفتند",
  "wallet.reclaim.title": "این توکن پس گرفته شود؟",
  "wallet.reclaim.body":
    "مبلغ {amount} {unit} به موجودی شما بازمی‌گردد. تنها وقتی این کار را بکنید که توکن هرگز به کسی نرسیده باشد: اگر رشته را همین حالا داشته باشند، هر کس زودتر آن را در ضراب‌خانه بازخرید کند پول را نگه می‌دارد، و آن می‌تواند خودشان باشند.",
  "wallet.reclaim.keep": "در انتظار نگه دار",
  "wallet.reclaim.confirm": "پس گرفتن",
  "wallet.copied.token_body":
    "توکن در بریده‌دان شماست. تا وقتی رسیده علامتش نزنید اینجا کنارگذاشته می‌ماند، پس اگر تلاش نخست شکست خورد می‌توانید دوباره بچسبانیدش.",
  "wallet.copied.phrase_body":
    "آن را در یک مدیر گذرواژه بچسبانید، سپس بریده‌دان خود را پاک کنید. برنامه‌های دیگر می‌توانند بریده‌دان را بخوانند، و در برخی پیکربندی‌ها با دستگاه‌های دیگر شما همگام می‌شود.",
  "wallet.refresh.failed": "تازه‌سازی ناموفق بود",
  "wallet.refresh.partly": "بخشی تازه‌سازی شد",
  "wallet.refresh.done": "تازه‌سازی شد",
  "wallet.refresh.unreachable":
    "دسترسی به {mints} ممکن نشد. باقی همه به‌روز است.",
  "wallet.refresh.swapped":
    "{amount} {unit} تأیید و با اثبات‌های تازه تعویض شد.",
  "wallet.refresh.secured":
    "اکنون {amount} {unit} زیر پوشش عبارت بازیابی شماست.",
  "wallet.refresh.all_confirmed":
    "هر چه اینجا بود از پیش با ضراب‌خانه تأیید شده بود.",
  "wallet.pending.title": "در انتظار",
  "wallet.pending.reserved_desc":
    "ساخته و کنارگذاشته شده، رسیدنش تأیید نشده. اثبات‌ها بیرون از موجودی شما نگه داشته می‌شوند تا دو بار خرج نشوند.",
  "wallet.pending.locked_desc":
    "از پیش به کلید گیرنده قفل شده، پس تنها خودشان می‌توانند خرجش کنند. فقط هنوز به دستشان نرسیده. برای پایان کار توکن را هم‌رسانی کنید.",
  "wallet.pending.show_qr": "نمایش این توکن به شکل یک کد QR",
  "wallet.pending.copy_again": "کپی دوبارهٔ توکن",
  "wallet.pending.share_again": "هم‌رسانی دوبارهٔ توکن",
  "wallet.pending.mark_delivered": "علامت زدن این توکن به عنوان رسیده",
  "wallet.pending.delivered": "رسید",
  "wallet.pending.reclaim_into": "پس گرفتن این توکن به موجودی شما",
  "wallet.activity.title": "فعالیت",
  "wallet.activity.none": "هنوز چیزی نیست",
  "wallet.activity.none_desc":
    "پرداخت‌هایی که می‌فرستید و می‌گیرید اینجا نمایان می‌شوند، تازه‌ترین در بالا، همراه ضراب‌خانه و کارمزد هر کدام.",
  "wallet.activity.show_fewer": "نمایش پرداخت‌های کمتر",
  "wallet.activity.show_less": "کمتر نشان بده",
  "wallet.activity.received_unconfirmed": "دریافت‌شده، تأییدنشده",
  "wallet.activity.received": "دریافت شد",
  "wallet.activity.receive_failed": "دریافت ناموفق بود",
  "wallet.activity.reclaimed": "پس گرفته شد",
  "wallet.activity.send_failed": "ارسال ناموفق بود",
  "wallet.activity.sent": "فرستاده شد",
  "wallet.activity.status_pending": "در انتظار",
  "wallet.activity.status_failed": "ناموفق",
  "wallet.activity.status_reclaimed": "پس گرفته شد",
  "wallet.activity.status_expired": "منقضی شد",
  "wallet.activity.ln_deposit": "واریز Lightning",
  "wallet.activity.ln_withdrawal": "برداشت Lightning",
  "wallet.activity.nutzap_received": "Nutzap دریافت شد",
  "wallet.activity.spent_removed": "اثبات‌های خرج‌شده برداشته شدند",
  "wallet.activity.refreshed": "اثبات‌ها تازه‌سازی شدند",
  "wallet.activity.refreshing": "در حال تازه‌سازی اثبات‌ها",
  "wallet.activity.just_now": "همین حالا",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "مش برون‌خط",
  "wallet.mesh_offline_body":
    "سرویس مش در حال اجرا نیست، پس چیزی نیست که توکن را به آن بسپاریم. زیر بخش در انتظار کنارگذاشته می‌ماند.",
  "wallet.xfer.route_mesh": "یک‌راست از راه مش به دستگاهشان سپرده شد.",
  "wallet.xfer.route_nostr":
    "بیرون از محدودهٔ بلوتوث بودند، پس به جایش از راه اینترنت رفت.",
  "wallet.xfer.route_courier":
    "همین حالا راهی به آن‌ها نیست. دستگاه‌های دیگر آن را با خود می‌برند و هر وقت یکی به آن‌ها رسید تحویل می‌دهند.",
  "wallet.xfer.route_queued":
    "هنوز در دسترس نیستند. در صف است و همین که در دسترس شدند فرستاده می‌شود.",
  "wallet.xfer.mesh_offline_body":
    "سرویس مش در حال اجرا نیست، پس راهی برای سپردن توکن نیست. چیزی کسر نشده است.",
  "wallet.xfer.could_not_send": "فرستاده نشد",
  "wallet.xfer.inexact_body":
    "اثبات‌های شما به شکل برون‌خط دقیقاً {amount} {unit} نمی‌سازند. کوچک‌ترین توکنی که می‌توانید بسازید {spend} {unit} است، و {extra} {unit} اضافی بی‌آنکه راهی برای پس گرفتنش باشد به آن‌ها می‌رسد.\n\nتازه‌سازی در ضراب‌خانه هنگام برخط بودن، اثبات‌های شما را به واحدهایی می‌شکند که این مبلغ را دقیق می‌کنند.",
  "wallet.xfer.send_amount": "فرستادن {amount}",
  "wallet.xfer.mesh_offline": "مش برون‌خط",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "به کلیدشان قفل و در Nostr منتشر شد. چه برخط باشند چه نه، از آن آن‌هاست.",
  "wallet.pay.rail_nutzap_dm":
    "به کلیدشان قفل شد. رله آن را نپذیرفت، پس به جایش به شکل یک پیام به آن‌ها رفت.",
  "wallet.pay.rail_nutzap_undelivered":
    "به کلیدشان قفل شد، اما هنوز چیزی نتوانست آن را ببرد. در صف است، و توکن زیر بخش در انتظار قرار دارد.",
  "wallet.pay.final":
    "پرداخت‌های قفل‌شده پس گرفته نمی‌شوند: اکنون تنها کلید خودشان می‌تواند این سکه‌ها را خرج کند.",
  "wallet.pay.reclaimable":
    "تا وقتی رسیدنش را تأیید کنید از زبانهٔ کیف پول پس‌گرفتنی می‌ماند.",
  "wallet.pay.why": "به این شیوه فرستاده شد چون {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} به {name}",
  "wallet.pay.thread_receipt":
    "شما {amount} {unit} فرستادید، قفل‌شده به کلید خودشان.",
  "wallet.pay.title": "فرستادن ecash",
  "wallet.pay.to": "به {name}",
  "wallet.pay.amount": "مبلغ به sats",
  "wallet.pay.memo": "یادداشت (اختیاری، همگانی)",
  "wallet.pay.send": "بفرست",
  "wallet.pay.sending": "در حال فرستادن…",
  "wallet.pay.action": "فرستادن ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "دسترسی دوربین",
  "wallet.scan.camera_purpose": "پویش یک کد QR مربوط به ecash",
  "wallet.scan.photo_label": "دسترسی عکس",
  "wallet.scan.photo_purpose": "خواندن یک QR مربوط به ecash از روی تصویر",
  "wallet.scan.no_token": "در آن تصویر توکن ecash پیدا نشد.",
  "wallet.scan.no_invoice": "در آن تصویر صورتحساب Lightning پیدا نشد.",
  "wallet.scan.unreadable": "آن تصویر خوانده نشد.",
  "wallet.scan.camera_failed":
    "دوربین راه‌اندازی نشد. برنامه‌های دوربین دیگر را ببندید و دوباره تلاش کنید.",
  "wallet.scan.close": "بستن پویشگر",
  "wallet.scan.on_device":
    "روی همین دستگاه خوانده می‌شود؛ چیزی به جایی فرستاده نمی‌شود.",
  "wallet.scan.aim_token": "روی یک کد QR مربوط به ecash بگیرید.",
  "wallet.scan.aim_invoice": "روی کد QR یک صورتحساب Lightning بگیرید.",
  "wallet.scan.title_token": "پویش ecash",
  "wallet.scan.title_invoice": "پویش صورتحساب",
  "wallet.scan.desc_token":
    "یک توکن Cashu از کیف پولی دیگر بخوانید. با هر کیف پول Cashu کار می‌کند، نه فقط Airhop.",
  "wallet.scan.desc_invoice":
    "یک صورتحساب Lightning بخوانید تا از موجودی خود بپردازیدش.",
  "wallet.scan.use_camera_a11y": "پویش با دوربین",
  "wallet.scan.use_camera": "استفاده از دوربین",
  "wallet.scan.pick_image_a11y": "خواندن یک کد QR از تصویری ذخیره‌شده",
  "wallet.scan.pick_image": "انتخاب از عکس‌ها",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu چیست؟",
  "wallet.explain.intro":
    "Cashu همان ecash برای Bitcoin است. توکن رشته‌ای است که برای هر کس آن را در دست دارد ارزش پول دارد، و ضراب‌خانه آن را کورکورانه امضا می‌کند تا نتواند بگوید چه کسی چه چیزی خرج کرده است. نه حسابی، نه ورودی.",
  "wallet.explain.send": "فرستادن",
  "wallet.explain.send_desc":
    "مبلغی را به توکنی بدل می‌کند که می‌توانید از راه بلوتوث به همتایی نزدیک بسپارید، یا به شکل متن هم‌رسانی کنید. بدون اینترنت کار می‌کند. اثبات‌ها تا وقتی رسیدنش را تأیید نکنید کنارگذاشته می‌مانند.",
  "wallet.explain.receive": "گرفتن",
  "wallet.explain.receive_desc":
    "برای افزودن یک توکن، آن را بچسبانید. برخط که باشید بی‌درنگ در ضراب‌خانه تعویض می‌شود، که آن را به شکل اثبات‌پذیر از آن شما می‌کند. برون‌خط ذخیره می‌شود و تا تازه‌سازی نکنید تأییدنشده می‌ماند.",
  "wallet.explain.zap": "زپ",
  "wallet.explain.zap_desc":
    "به یک هویت Nostr پرداخت می‌کند. اگر آن‌ها اطلاعات nutzap مطابق NIP-61 منتشر کرده باشند، ecash به کلیدشان قفل می‌شود تا تنها خودشان بتوانند خرجش کنند. وگرنه به یک پیام مستقیم رمزگذاری‌شده برمی‌گردد. به اینترنت نیاز دارد.",
  "wallet.explain.add_mint": "افزودن ضراب‌خانه",
  "wallet.explain.add_mint_desc":
    "ضراب‌خانه‌ای را که ecash شما را صادر و بازخرید می‌کند ذخیره می‌کند، و کلیدهای عمومی‌اش را نگه می‌دارد تا توکن‌های آن به شکل برون‌خط راستی‌آزمایی شوند. ضراب‌خانه‌ای برگزینید که به اندازهٔ موجودی‌تان به آن اعتماد دارید.",
  "wallet.explain.phrase": "عبارت بازیابی",
  "wallet.explain.phrase_desc":
    "سکه‌های شما از دوازده واژه‌ای استخراج می‌شوند که کیف پول در آغاز می‌سازد، پس گوشی تازه می‌تواند با پرسیدن از ضراب‌خانه‌هایتان که کدام سکه‌ها را امضا کرده‌اند موجودی را دوباره بسازد. تا وقتی آن‌ها را نبینید و ننویسید، تنها روی همین گوشی وجود دارند.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "کیف پول قفل است",
  "wallet.err.mint_unreachable": "ضراب‌خانه در دسترس نیست",
  "wallet.err.tor_blocked": "تا وقتی Tor روشن است مسدود",
  "wallet.err.insufficient": "موجودی کافی نیست",
  "wallet.err.exact_amount": "دقیقاً همان مبلغ فرستاده نمی‌شود",
  "wallet.err.no_mint": "ضراب‌خانه‌ای نیست",
  "wallet.err.mint_unsupported": "ضراب‌خانه این کار را نمی‌تواند",
  "wallet.err.mint_refused": "ضراب‌خانه رد کرد",
  "wallet.err.unreadable": "توکن ناخوانا",
  "wallet.err.rejected": "توکن رد شد",
  "wallet.err.already_spent": "از پیش خرج شده",
  "wallet.err.change_pending": "پرداخت شد، باقیمانده در انتظار",
  "wallet.svc.mint_unreachable": "دسترسی به ضراب‌خانه ممکن نشد.",
  "wallet.svc.tor_ios": "روی iOS درخواست‌های ضراب‌خانه از Tor نمی‌گذرند.",
  "wallet.svc.tor_ios_body":
    "Arti تنها WebSocket‌های Nostr را می‌پوشاند، پس این درخواست از شبکهٔ باز به ضراب‌خانه می‌رسد و نشانی IP شما را به این اثبات‌ها گره می‌زند. زیر تنظیمات > امنیت مجازش کنید، یا اول Tor را خاموش کنید. فرستادن و گرفتن ecash روی مش همچنان کار می‌کند.",
  "wallet.svc.keys_uncached":
    "کلیدهای این ضراب‌خانه روی این دستگاه ذخیره نشده‌اند.",
  "wallet.svc.keys_uncached_body":
    "برای گرفتنشان یک بار کیف پول را هنگام برخط بودن باز کنید.",
  "wallet.svc.phrase_invalid": "آن عبارت بازیابی معتبر نیست.",
  "wallet.svc.phrase_invalid_body":
    "دنبال واژه‌ای بگردید که بد تایپ شده یا جا افتاده. عبارت یک کد وارسی درونی دارد، پس یک واژهٔ نادرست کل آن را بی‌اعتبار می‌کند.",
  "wallet.svc.need_mint": "اول دست‌کم یک ضراب‌خانه اضافه کنید.",
  "wallet.svc.need_mint_body":
    "بازیابی با پرسیدن از یک ضراب‌خانه کار می‌کند که کدام سکه‌ها را برای شما امضا کرده، پس باید بداند از کدام ضراب‌خانه بپرسد.",
  "wallet.svc.restored": "از روی عبارت بازیابی بازگردانده شد",
  "wallet.svc.storage_locked": "حافظهٔ کیف پول قفل است.",
  "wallet.svc.storage_locked_body":
    "Airhop اثبات‌های ecash را در فایلی رمزگذاری‌شده نگه می‌دارد که کلیدش در کلیدان دستگاه است. قفل دستگاه را باز کنید و برنامه را دوباره باز کنید.",
  "wallet.svc.bad_url": "این یک نشانی معتبر نیست.",
  "wallet.svc.needs_https": "نشانی ضراب‌خانه باید با https:// آغاز شود.",
  "wallet.svc.refuse_http":
    "از به کار بردن ضراب‌خانه روی http ساده خودداری می‌شود.",
  "wallet.svc.refuse_http_body":
    "هر کسی سر راه شبکه می‌تواند اثبات‌های شما را بخواند یا دستکاری کند. از ضراب‌خانه‌ای با https:// استفاده کنید.",
  "wallet.svc.mint_not_saved": "ضراب‌خانه ذخیره نشد.",
  "wallet.svc.unreadable_token": "این یک توکن Cashu خواندنی نیست.",
  "wallet.svc.unreadable_token_body":
    "توکن‌ها با cashuA یا cashuB آغاز می‌شوند. بررسی کنید هنگام کپی چیزی بریده نشده باشد.",
  "wallet.svc.wrong_mint":
    "این توکن را ضراب‌خانه‌ای که نامش را می‌برد امضا نکرده است.",
  "wallet.svc.already_spent": "این اثبات‌ها از پیش خرج شده‌اند.",
  "wallet.svc.already_spent_body":
    "هر کس این توکن را فرستاده زودتر بازخریدش کرده، یا همان توکن را به کس دیگری هم داده است.",
  "wallet.svc.receiving_offline": "دریافت به شکل برون‌خط",
  "wallet.svc.amount_positive": "مبلغی بزرگ‌تر از صفر وارد کنید.",
  "wallet.svc.coins_raced": "آن سکه‌ها همین حالا در پرداختی دیگر به کار رفتند.",
  "wallet.svc.coins_raced_body":
    "چیزی کسر نشد. دوباره تلاش کنید تا کیف پول مجموعه‌ای دیگر برگزیند.",
  "wallet.svc.no_ecash": "هنوز ecash‌ای نیست.",
  "wallet.svc.no_ecash_body":
    "یک ضراب‌خانه اضافه کنید و از راه Lightning واریز کنید، یا از کسی توکنی بگیرید.",
  "wallet.svc.split_across_mints": "موجودی شما میان چند ضراب‌خانه پخش است.",
  "wallet.svc.mint_says_spent":
    "ضراب‌خانه این اثبات‌ها را از پیش خرج‌شده گزارش کرد.",
  "wallet.svc.issue_against_invoice":
    "صدور ecash در برابر یک صورتحساب Lightning",
  "wallet.svc.pay_invoice": "پرداخت یک صورتحساب Lightning",
  "wallet.svc.unknown_deposit": "واریز ناشناخته.",
  "wallet.svc.invoice_expired_before": "صورتحساب پیش از پرداخت شدن منقضی شد.",
  "wallet.svc.invoice_expired": "آن صورتحساب منقضی شد.",
  "wallet.svc.invoice_unpaid": "صورتحساب هنوز پرداخت نشده است.",
  "wallet.svc.payment_unknown":
    "وضعیت پرداخت نامعلوم است؛ در تازه‌سازی بعدی دوباره بررسی می‌شود.",
  "wallet.svc.melt_change_pending": "صورتحساب شما پرداخت شد.",
  "wallet.svc.melt_change_pending_body":
    "ضراب‌خانه هنوز کارمزد مسیریابی مصرف‌نشده را برنگردانده است. در تازه‌سازی بعدی خودکار مطالبه می‌شود، و در این میان چیزی از دست نمی‌رود.",
  "wallet.svc.mint_did_not_pay":
    "ضراب‌خانه این صورتحساب را نپرداخت. موجودی شما تغییری نکرده است.",
  "wallet.svc.not_an_invoice": "این یک صورتحساب Lightning نیست.",
  "wallet.svc.not_an_invoice_body":
    "یک صورتحساب bolt11 که با lnbc آغاز می‌شود بچسبانید.",
  "wallet.svc.insufficient_for_invoice": "موجودی برای این صورتحساب کافی نیست.",
  "wallet.svc.coins_raced_invoice_body":
    "چیزی کسر نشد و صورتحساب پرداخت نشد. دوباره تلاش کنید.",
  "wallet.svc.same_mint": "ضراب‌خانهٔ مقصد دیگری برگزینید.",
  "wallet.svc.same_mint_body":
    "مبدأ و مقصد یک ضراب‌خانه‌اند، پس چیزی برای جابه‌جایی نیست.",
  "wallet.svc.quote_failed_retried":
    "برآورد ناموفق بود، یکپارچه‌سازی دوباره تلاش شد",
  "wallet.svc.amount_unfit_retried": "مبلغ جا نشد، یکپارچه‌سازی دوباره تلاش شد",
  "wallet.svc.cannot_size": "اندازهٔ این انتقال تعیین نشد.",
  "wallet.svc.insufficient_at_mint": "موجودی در {mint} کافی نیست.",
  "wallet.svc.inexact_title":
    "اثبات‌های شما به شکل برون‌خط دقیقاً {amount} {unit} نمی‌سازند.",
  "wallet.svc.inexact_detail":
    "کوچک‌ترین توکنی که می‌توانید بفرستید {spend} {unit} است. برون‌خط باقیمانده‌ای در کار نیست، پس {extra} {unit} اضافی به گیرنده می‌رسد.",
  "wallet.svc.no_single_mint":
    "هیچ ضراب‌خانه‌ای به تنهایی {amount} {unit} ندارد. ecash از ضراب‌خانه‌های گوناگون در یک توکن جمع نمی‌شود: اول در یک ضراب‌خانه یکپارچه کنید، یا در مبالغ جداگانه بفرستید.",
  "wallet.svc.have_tried_send":
    "شما {total} {unit} دارید و کوشیدید {amount} بفرستید.",
  "wallet.svc.invoice_needs":
    "این صورتحساب با احتساب ذخیرهٔ مسیریابی {total} {unit} لازم دارد، و شما {balance} دارید.",
  "wallet.svc.nothing_to_move": "{mint} هیچ {unit} برای جابه‌جایی ندارد.",
  "wallet.svc.consolidate_memo": "یکپارچه‌سازی از {mint}",
  "wallet.svc.cannot_size_detail":
    "پس از کارمزدهای مسیریابی Lightning، {from} نمی‌تواند مبلغ به‌دردبخوری به {to} ببرد. به جایش مبلغ کوچک‌تر مشخصی را جابه‌جا کنید.",
  "wallet.svc.mint_cannot": "{mint} نمی‌تواند {action}.",
  "wallet.svc.no_nut": "ضراب‌خانه از پشتیبانی NUT-{nut} خبر نمی‌دهد.",
  "wallet.svc.unknown_mint":
    "آن پرداخت نام ضراب‌خانه‌ای را می‌برد که شما به کار نمی‌برید.",
  "wallet.svc.unknown_mint_body":
    "اگر به آن اعتماد دارید اول خودتان اضافه‌اش کنید؛ از ضراب‌خانه‌ای که برنگزیده‌اید چیزی بازخرید نمی‌شود.",
  "wallet.svc.no_relay": "اتصالی به رله نیست",
  "wallet.svc.no_shared_mint": "ضراب‌خانهٔ مشترکی با موجودی کافی نیست",
  "wallet.svc.no_nutzap_info":
    "گیرنده اطلاعات nutzap منتشر نکرده است (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "به کلیدشان قفل شده اما هنوز نرسیده است. برای تکمیلش توکن این تراکنش را هم‌رسانی کنید.",
  "wallet.svc.swap_lost":
    "ضراب‌خانه این تعویض را هرگز کامل نکرد، پس چیزی در برابرش صادر نشد.",
  "wallet.svc.swap_unreadable":
    "این تعویض به شکلی ذخیره شده که این نسخه نمی‌تواند دوباره اجرایش کند.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "با QR تأیید شد",
  "contacts.qr.keys_unverified": "کلیدها دریافت شد، تأیید نشده",
  "contacts.qr.not_verified": "هنوز تأیید نشده",
  "contacts.qr.message": "پیام",
  "contacts.qr.add": "افزودن مخاطب",
  "contacts.qr.scan_title": "پویش کد QR",
  "contacts.qr.aim": "دوربین را روی کد QR آن‌ها بگیرید",
  "contacts.qr.add_desc": "به کسی برسید که روی مش نزدیک شما نیست.",
  "contacts.qr.peer_id_hint":
    "شناسهٔ همتا 16 نویسه دارد. کد مخاطب با airhop: آغاز می‌شود.",
  "contacts.qr.or_scan": "یا QR آن‌ها را بپویید",
  "contacts.qr.trust_note":
    "تنها QR‌ای که با دوربین خودتان می‌پویید کلید آن‌ها را تأیید می‌کند. کدی که چسبانده می‌شود کلیدهایشان را می‌آورد اما گواهی نمی‌آورد که از خودشان آمده باشد.",
  "contacts.qr.peer_id": "شناسهٔ همتا یا کد مخاطب",
  "contacts.qr.peer_id_placeholder": "یک شناسه یا کد مخاطب بچسبانید",
  "contacts.qr.scan_camera_a11y": "پویش کد QR با دوربین",
  "contacts.qr.scan_camera_desc": "از دوربین خود استفاده کنید",
  "contacts.qr.upload_a11y": "بارگذاری تصویر QR از گالری",
  "contacts.qr.upload": "بارگذاری از گالری",
  "contacts.qr.upload_desc": "یک تصویر QR ذخیره‌شده را انتخاب کنید",
  "contacts.qr.scan_a11y": "افزودن مخاطب با پویش کد QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "یک شناسهٔ همتای 16 نویسه‌ای، یک پیوند airhop://peer/… یا یک کد مخاطب بچسبانید.",
  "contacts.scan.camera_label": "دسترسی دوربین",
  "contacts.scan.camera_purpose": "پویش کد QR یک مخاطب",
  "contacts.scan.camera_needed":
    "برای پویش به دسترسی دوربین نیاز است. همچنان می‌توانید با شناسهٔ همتا اضافه کنید.",
  "contacts.scan.camera_failed":
    "دوربین راه‌اندازی نشد. برنامه‌های دوربین دیگر را ببندید و دوباره تلاش کنید.",
  "contacts.scan.photo_label": "دسترسی عکس",
  "contacts.scan.photo_purpose": "پویش کد QR‌ای که ذخیره کرده‌اید",
  "contacts.scan.photo_needed":
    "برای انتخاب تصویر به دسترسی عکس نیاز است. همچنان می‌توانید با شناسهٔ همتا اضافه کنید.",
  "contacts.scan.no_qr": "در آن تصویر کد QR مربوط به Airhop پیدا نشد.",
  "contacts.scan.unreadable": "کد QR از آن تصویر خوانده نشد.",
  "contacts.scan.bitchat_expired":
    "آن کد bitchat منقضی شده است. از آن‌ها بخواهید QR خود را دوباره باز کنند.",
  "contacts.scan.tampered":
    "این کد QR نامعتبر است: شناسهٔ همتای آن با کلیدهایش نمی‌خواند. ممکن است دستکاری شده باشد.",
  "contacts.scan.already_added": "از پیش در مخاطبان شماست",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "در انتظار دسترسی دوربین…",
  "contacts.verify.camera_off": "دوربین خاموش است",
  "contacts.verify.open_settings": "باز کردن تنظیمات",
  "contacts.verify.verified": "تأیید شد",
  "contacts.verify.different": "مخاطب دیگری",
  "contacts.verify.scan_again": "دوباره بپویید",
  "contacts.verify.failed": "تأیید نشد",
  "contacts.verify.done": "انجام شد",
  "contacts.verify.title": "تأیید {name}",
  "contacts.verify.aim": "دوربین را روی کد QR آن‌ها بگیرید",
  "contacts.verify.camera_off_body":
    "برای تأیید با QR، دسترسی دوربین را در تنظیمات روشن کنید.",
  "contacts.verify.match_body":
    "کلید {name} می‌خواند. می‌توانید به این مخاطب اعتماد کنید.",
  "contacts.verify.different_body":
    "این QR متعلق به کس دیگری است. از {name} بخواهید کد خودش را نشان دهد.",
  "contacts.verify.tampered_body":
    "این QR دستکاری‌شده به نظر می‌رسد: شناسه‌اش با کلیدش نمی‌خواند.",
  "contacts.verify.choose_title": "چطور می‌خواهید بررسی کنید؟",
  "contacts.verify.choose_body":
    "هر دو تأیید می‌کنند که کلیدهای روی این گوشی واقعاً متعلق به {name} هستند.",
  "contacts.verify.method_scan": "پویش کد آن‌ها",
  "contacts.verify.method_scan_sub": "همین‌جا کنار شما هستند",
  "contacts.verify.method_compare": "مقایسهٔ یک کد",
  "contacts.verify.method_compare_sub": "در یک تماس برای هم بخوانید",
  "contacts.verify.no_keys":
    "هنوز کلیدی برای این مخاطب نیست. به آن‌ها پیام بدهید، یا وقتی دیدارشان کردید کدشان را بپویید.",
  "contacts.verify.compare_title": "این‌ها را برای هم بخوانید",
  "contacts.verify.compare_body":
    "{name} همان شش واژه را می‌بیند. اگر یکی بودند، هر دو می‌دانید کلیدها واقعی‌اند.",
  "contacts.verify.codes_match": "این‌ها یکی هستند",
  "contacts.verify.codes_differ": "یکی نیستند",
  "contacts.verify.compared_body":
    "شما و {name} یک کد را تأیید کردید. این مخاطب تأیید شد.",

  // ---- Settings: shared chrome ----
  "settings.back": "بازگشت",
  "settings.coming_soon": "به‌زودی",
  "settings.opens_externally": "{label}، بیرون از برنامه باز می‌شود",
  "settings.peer_id": "شناسهٔ همتا",
  "settings.share_peer_id": "هم‌رسانی شناسهٔ همتای شما",
  "settings.share_id_short": "هم‌رسانی شناسه",
  "settings.peer_id_sheet.title": "شناسهٔ همتای شما",
  "settings.peer_id_sheet.copy": "کپی شناسهٔ همتا",
  "settings.peer_id_sheet.note":
    "این تنها زمانی کار می‌کند که هر دوی شما در محدودهٔ بلوتوث باشید. برای اینکه کسی از هر جایی به شما پیام بدهد، به جایش کد QR خود را هم‌رسانی کنید.",
  "settings.search.placeholder": "جستجوی تنظیمات…",
  "settings.search.a11y": "جستجوی تنظیمات",
  "settings.search.close": "بستن جستجو",
  "settings.search.clear": "پاک کردن جستجو",
  "settings.search.hint": "هر تنظیمی را با نامش بیابید، هر جا که باشد.",
  "settings.search.no_results": "تنظیمی همخوان با «{query}» نیست",

  // ---- Settings: hub rows ----
  "settings.section.general": "عمومی",
  "settings.section.general_desc":
    "قابلیت‌های اختیاری، لغو ارسال، رسانه، بازنشانی",
  "settings.section.privacy": "حریم خصوصی و امنیت",
  "settings.section.privacy_desc":
    "رازداری پیش‌رو، بسته‌های امضاشده، همتاهای مسدود",
  "settings.section.network": "شبکه و رله‌ها",
  "settings.section.network_desc":
    "اینترنت جایگزین، رله‌های nostr، سازگاری با bitchat",
  "settings.section.permissions": "دسترسی‌ها",
  "settings.section.permissions_desc":
    "بلوتوث، موقعیت مکانی، اعلان‌ها، دوربین، میکروفون",
  "settings.section.storage": "حافظه و داده‌ها",
  "settings.section.diagnostics": "عیب‌یابی",

  // ---- Settings: group headings ----
  "settings.group.transports": "بسترهای انتقال",
  "settings.group.internet": "اینترنت",
  "settings.group.nearby": "نزدیک",
  "settings.group.sync": "همگام‌سازی",
  "settings.group.features": "قابلیت‌ها",
  "settings.group.messages": "پیام‌ها",
  "settings.group.local": "محلی",
  "settings.group.media": "رسانه",
  "settings.group.reset": "بازنشانی",
  "settings.group.always_on": "همیشه روشن",
  "settings.group.notifications": "اعلان‌ها",
  "settings.group.blocked": "مسدودشده",
  "settings.group.theme": "پوسته",
  "settings.group.font": "قلم",
  "settings.group.language": "زبان",
  "settings.section.diagnostics_desc": "وضعیت اتصال و دستگاه‌های نزدیک",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "پیوندهای بلوتوث",
  "settings.diag.ble_links_desc":
    "دستگاه‌هایی که این گوشی مستقیم به آن‌ها وصل است",
  "settings.diag.lan": "شبکه محلی",
  "settings.diag.lan_desc": "گوشی‌های روی یک شبکه Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "گوشی به گوشی بدون روتر",
  "settings.diag.wifi_active": "در حال اجرا",
  "settings.diag.wifi_unsupported": "روی این دستگاه پشتیبانی نمی‌شود",
  "settings.diag.wifi_permission": "به سبب یک دسترسی مسدود است",
  "settings.diag.wifi_unavailable": "همین حالا در دسترس نیست",
  "settings.diag.wifi_unpaired": "چیزی جفت نشده",
  "settings.diag.wifi_unknown": "در انتظار رادیو",
  "settings.diag.relays": "رله‌های Nostr",
  "settings.diag.relays_desc":
    "برای کانال‌های موقعیت و دسترسی از راه اینترنت به کار می‌روند",
  "settings.diag.connected": "متصل",
  "settings.diag.disconnected": "متصل نیست",
  "settings.diag.peer_direct": "پیوند مستقیم",
  "settings.diag.peer_relayed": "از راه دستگاهی دیگر شنیده شد",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "خوانشی از سیگنال نیست",
  "settings.diag.no_peers": "کسی در محدوده نیست",
  "settings.diag.no_peers_desc": "{links} پیوند رادیویی باز است",
  "settings.diag.gcs_size": "اندازهٔ صافی",
  "settings.diag.gcs_size_desc":
    "بزرگ‌ترین صافی همگام‌سازی که روی آنتن رفته است",
  "settings.diag.fpr": "نرخ مثبت کاذب",
  "settings.diag.fpr_desc":
    "هر چند وقت یک بار صافی بسته‌ای را که نداریم موجود اعلام می‌کند",
  "settings.diag.bytes": "{n} بایت",
  "settings.diag.footnote":
    "اینجا چیزی قابل تغییر نیست. این مقادیر ثابت‌اند تا Airhop با bitchat سازگار بماند.",
  "settings.section.storage_desc": "مصرف و حافظهٔ نهان",
  "settings.section.appearance": "ظاهر",
  "settings.section.appearance_desc": "پوسته، قلم و زبان",
  "settings.section.help": "راهنما و بازخورد",
  "settings.section.help_desc":
    "با ما تماس بگیرید، اشکالی را گزارش کنید، یا پرسش‌های پرتکرار را بخوانید",
  "settings.section.support": "پشتیبانی",
  "settings.section.support_desc": "کمک کنید توسعه ادامه یابد",
  "settings.section.about": "درباره",
  "settings.section.about_desc": "نسخه، سیاههٔ تغییرات و کد منبع",

  // ---- Settings: general ----
  "settings.general.undo": "لغو ارسال",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "کیف پول",
  "settings.general.undo_seconds": "{count} ثانیه",
  "settings.general.undo_a11y": "لغو ارسال: {value}",
  "settings.general.quality_a11y": "کیفیت بارگذاری روی {value} تنظیم شود",
  "settings.general.undo_desc":
    "پیام فرستاده‌شده را کمی نگه می‌دارد تا پیش از رفتنش بتوانید پسش بگیرید",
  "settings.general.undo_off_desc": "بی‌درنگ بفرست، بدون امکان لغو",
  "settings.general.undo_2": "2 ثانیه",
  "settings.general.undo_2_desc": "فرصتی کوتاه برای پس گرفتن",
  "settings.general.undo_10": "10 ثانیه",
  "settings.general.undo_10_desc": "بلندترین بازه",
  "settings.general.quality": "کیفیت بارگذاری",
  "settings.general.quality_desc":
    "بر عکس‌هایی اعمال می‌شود که از دوربین یا گالری می‌فرستید. در هر حال هر عکس متناسب با مش تنظیم می‌شود.",
  "settings.general.quality_low": "پایین",
  "settings.general.quality_low_desc": "کوچک‌ترین عکس‌ها، سریع‌ترین ارسال",
  "settings.general.quality_medium": "متوسط",
  "settings.general.quality_medium_desc": "توازن میان جزئیات و سرعت",
  "settings.general.quality_high": "بالا",
  "settings.general.quality_high_desc": "بیشترین جزئیات را نگه می‌دارد",
  "settings.general.feature_wallet_desc":
    "فرستادن Cashu ecash از همتا به همتا روی مش",
  "settings.general.feature_wallet_a11y": "کیف پول (همیشه روشن)",
  "settings.general.feature_ai_desc":
    "دستیار خصوصی روی خود دستگاه، بدون هیچ تماس شبکه‌ای",
  "settings.general.feature_feeds": "خوراک‌ها",
  "settings.general.feature_feeds_desc":
    "خواندن و نوشتن در خوراک‌های Bluesky و Mastodon",
  "settings.general.show_media": "نمایش خودکار رسانه",
  "settings.general.show_media_desc":
    "عکس‌ها و ویدیوها در گفتگو نمایان شوند، یا پشت یک ضربه بمانند",
  "settings.general.reset": "بازنشانی تنظیمات",
  "settings.general.media_retention": "نگهداری رسانه به مدت",
  "settings.general.media_retention_desc":
    "عکس‌ها، ویدیوها و پیام‌های صوتی پس از زمان انتخابی حذف می‌شوند",
  "settings.general.media_retention_sheet":
    "انتخاب کنید رسانه چه مدت روی این دستگاه بماند. رسانهٔ حذف‌شده بازیابی نمی‌شود.",
  "settings.general.retention_7_desc":
    "کم‌ترین رد را باقی می‌گذارد. بهترین گزینه وقتی خطر خود گوشی است.",
  "settings.general.retention_14_desc":
    "حد میانه برای یکی دو هفته دوری از آنتن.",
  "settings.general.retention_30_desc":
    "گفتگوها را بیش از همه خواندنی نگه می‌دارد و بیشترین فضا را هم می‌گیرد.",
  "settings.general.reset_desc":
    "هر ترجیحی را به حالت پیش‌فرض بازمی‌گرداند و هویت، پیام‌ها، مخاطبان و کیف پول شما را دست‌نخورده می‌گذارد",
  "settings.general.reset_title": "تنظیمات بازنشانی شود؟",
  "settings.general.reset_body":
    "هر ترجیحی به پیش‌فرض بازمی‌گردد: ظاهر، لغو ارسال، و اتصال (اینترنت، Tor، دروازه، پل، رله‌ها). هویت، پیام‌ها، مخاطبان و کیف پول شما دست‌نخورده می‌مانند.",
  "settings.general.reset_confirm": "بازنشانی",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "رازداری پیش‌رو",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet برای پیام‌های مستقیم همیشه روشن است",
  "settings.security.signed_packets": "بسته‌های امضاشده",
  "settings.security.signed_packets_desc": "هر بسته با Ed25519 امضا می‌شود",
  "settings.security.hide_previews": "پنهان کردن پیش‌نمایش اعلان‌ها",
  "settings.security.hide_previews_desc":
    "فرستنده و پیام را از صفحهٔ قفل دور نگه می‌دارد، چون آن صفحه بدون باز کردن قفل نشانشان می‌دهد",
  "settings.security.no_blocked": "همتای مسدودی نیست",
  "settings.security.no_blocked_desc":
    "همتاهای مسدود نمی‌توانند به شما پیام بدهند و در زبانهٔ مش نمایان نمی‌شوند",
  "settings.security.unblock_title": "رفع مسدودی این همتا",
  "settings.security.unblock": "رفع مسدودی",
  "settings.security.unblock_peer": "رفع مسدودی {name}",
  "settings.security.unblock_body":
    "{name} دوباره می‌تواند به شما پیام بدهد و هر وقت نزدیک باشد در زبانهٔ مش نمایان می‌شود.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "اینترنت جایگزین",
  "settings.network.internet_desc":
    "وقتی همتاهای مش بیرون از محدوده‌اند، از راه رله‌های Nostr ادامه بده",
  "settings.network.internet_off_title": "اینترنت خاموش شود؟",
  "settings.network.internet_off_body":
    "Airhop فقط روی بلوتوث کار خواهد کرد. تماس با هر رلهٔ Nostr قطع می‌شود، و Tor و دروازهٔ اینترنت و پل مش همگی خاموش می‌شوند. گفتگوی بلوتوثی نزدیک به کار خود ادامه می‌دهد.",
  "settings.network.turn_off": "خاموش کن",
  "settings.network.discovery": "کشف رلهٔ جغرافیایی",
  "settings.network.discovery_desc":
    "از میان بیش از 300 رلهٔ توزیع‌شده، نزدیک‌ترین رله‌ها به یک سلول موقعیت را خودکار انتخاب کن",
  "settings.network.discovery_needs_relay": "اول یک رلهٔ دلخواه اضافه کنید",
  "settings.network.discovery_needs_relay_body":
    "کشف خودکار همان چیزی است که Airhop را به نزدیک‌ترین رله‌ها می‌رساند. خاموش کردنش تنها وقتی معنا دارد که رله‌های خودتان را پایین تعیین کرده باشید، پس اول دست‌کم یکی اضافه کنید.",
  "settings.network.custom_only_title": "فقط از رله‌های خودتان استفاده شود؟",
  "settings.network.custom_only_body":
    "کانال‌های موقعیت و پل مش دیگر نزدیک‌ترین رله‌ها را خودکار انتخاب نمی‌کنند و فقط از رله‌هایی که افزوده‌اید استفاده می‌کنند. این کار می‌تواند دسترسی را کم کند، و ممکن است دیگر کاربران bitchat را نبینید، چون آن‌ها گرد نزدیک‌ترین رله‌ها جمع می‌شوند.",
  "settings.network.custom": "رله‌های دلخواه",
  "settings.network.custom_desc":
    "برای کانال‌های موقعیت و پل مش رله‌های خودتان را اضافه کنید",
  "settings.network.custom_added": "{count} از {max} افزوده شد",
  "settings.network.dm_relays": "رله‌های پیام",
  "settings.network.dm_relays_desc":
    "پیام‌های مستقیم و کانال‌های خصوصی همیشه از این‌ها استفاده می‌کنند. رله‌های دلخواه آن‌ها را تغییر نمی‌دهند.",
  "settings.network.discovery_back_on": "کشف رلهٔ جغرافیایی دوباره روشن شد",
  "settings.network.discovery_back_on_body":
    "آن آخرین رلهٔ دلخواه شما بود. کانال‌های موقعیت جایی برای انتشار لازم دارند، پس Airhop دوباره نزدیک‌ترین رله‌ها را خودکار انتخاب می‌کند.",
  "settings.network.add_relay": "افزودن رله",
  "settings.network.remove_relay": "حذف {url}",
  "settings.network.add_short": "افزودن",
  "settings.network.relay_limit":
    "می‌توانید {count} رله اضافه کنید. برای افزودن یکی دیگر، یکی را حذف کنید.",
  "settings.network.relay_duplicate": "آن رله از پیش در فهرست شماست.",
  "settings.network.relay_invalid":
    "یک میزبان رلهٔ معتبر وارد کنید، مثلاً relay.example.com. درگاه تنها وقتی لازم است که رله از مقدار پیش‌فرض استفاده نکند. نشانی‌های IP و نام‌های محلی مجاز نیستند.",
  "settings.network.lan": "شبکه محلی",
  "settings.network.lan_desc":
    "به افرادی که روی همان WiFi هستند برس، حتی بین iPhone و Android. دستگاه‌های دیگر شبکه می‌توانند ببینند که Airhop را اجرا می‌کنی.",
  "settings.network.lan_searching": "هیچ دستگاه Airhop روی این شبکه نیست",
  "settings.network.lan_active": "در این شبکه متصل است",
  "settings.network.lan_unavailable": "به هیچ شبکه WiFi وصل نیستی",
  "settings.network.lan_permission":
    "دسترسی به شبکه محلی برای Airhop خاموش است",
  "settings.network.lan_unsupported": "روی این دستگاه در دسترس نیست",
  "settings.network.lan_foreground":
    "وقتی Airhop در پس‌زمینه باشد متوقف می‌شود. بلوتوث همچنان کار می‌کند.",
  "settings.network.wifi_pair": "جفت‌شدن",
  "settings.network.wifi_paired": "دستگاه‌های جفت‌شده",
  "settings.network.wifi_pair_find": "یافتن یک دستگاه",
  "settings.network.wifi_pair_find_desc":
    "دنبال iPhone نزدیکی بگردید که خود را نشان می‌دهد. هر دو گوشی به iOS 26 یا بالاتر نیاز دارند.",
  "settings.network.wifi_pair_show": "نمایش این iPhone",
  "settings.network.wifi_pair_show_desc":
    "بگذارید یک iPhone نزدیک این یکی را پیدا کند. یکی می‌گردد و دیگری خود را نشان می‌دهد، هم‌زمان.",
  "settings.network.wifi_pair_find_action": "یک iPhone نزدیک انتخاب کنید",
  "settings.network.wifi_pair_show_action": "این iPhone را قابل کشف کنید",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware در حال حاضر در دسترس نیست",
  "settings.network.wifi_pair_forget":
    "یک جفت‌شدن را در برنامه Settings حذف کنید",
  "settings.network.bitchat": "سازگاری با bitchat",
  "settings.network.bitchat_desc":
    "همان مش BLE که bitchat دارد، با هم‌کارکردی کامل. این همیشه روشن است و نمی‌توان خاموشش کرد.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "اجرا در پس‌زمینه",
  "settings.conn.background_desc": "مش را وقتی Airhop بسته است روشن نگه دار",
  "settings.conn.background_on_title": "مش روشن بماند؟",
  "settings.conn.background_on_body":
    "Airhop حتی وقتی بسته است بازپخش و دریافت را ادامه می‌دهد، پس در نبودتان پیام‌ها می‌رسند. Android در این مدت یک اعلان پایدار نشان می‌دهد.",
  "settings.conn.background_off_title": "با بسته شدن Airhop مش هم متوقف شود؟",
  "settings.conn.background_off_body":
    "پیام‌ها فقط وقتی می‌رسند که Airhop باز باشد، و این گوشی بازپخش برای اطرافیان را متوقف می‌کند. اعلان پایدار از میان می‌رود.",
  "settings.conn.live_voice": "صدای زنده",
  "settings.conn.live_voice_desc": "مانند بی‌سیم با آدم‌های نزدیک حرف بزنید",
  "settings.conn.live_voice_on_title": "صدای زنده روشن شود؟",
  "settings.conn.live_voice_on_body":
    "با نگه داشتن میکروفون، صدای شما همان‌طور که حرف می‌زنید به همهٔ کسانی که در محدودهٔ بلوتوث‌اند می‌رسد، و صدای آن‌ها هم روی گوشی شما پخش می‌شود. هیچ چیزی ضبط نمی‌شود.",
  "settings.conn.live_voice_off_title": "صدای زنده خاموش شود؟",
  "settings.conn.live_voice_off_body":
    "نگه داشتن میکروفون به جایش یک پیام صوتی ضبط می‌کند. با رها کردن فرستاده می‌شود، و تا کسی پخشش نکند نمی‌شنود.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "مسیردهی Tor",
  "settings.conn.tor_desc":
    "برای حریم خصوصی بیشتر، ترافیک Nostr را از Tor بفرست",
  "settings.conn.tor_on_title": "ترافیک Nostr از Tor برود؟",
  "settings.conn.tor_on_body":
    "رله‌ها دیگر نشانی IP شما را نمی‌بینند. اتصال بیشتر طول می‌کشد و پیام‌ها کندتر می‌رسند. بلوتوث بی‌تأثیر می‌ماند.",
  "settings.conn.tor_off_title": "مسیردهی Tor خاموش شود؟",
  "settings.conn.tor_off_body":
    "ترافیک Nostr به اتصال معمولی شما بازمی‌گردد، پس رله‌ها دوباره نشانی IP شما را می‌بینند. در هر حال بلوتوث بی‌تأثیر است.",
  "settings.conn.tor_unavailable": "مسیردهی Tor در این نسخه در دسترس نیست.",
  "settings.conn.tor_timeout":
    "اتصال Tor بیش از یک دقیقه طول کشیده است. روشن می‌ماند و تلاش را ادامه می‌دهد؛ زبانهٔ مش خواهد گفت کِی مسیردهی برقرار شده، یا اینکه این شبکه جلویش را گرفته است.",
  "settings.conn.tor_failed": "Tor شروع نشد. کمی بعد دوباره تلاش کنید.",
  "settings.tor.status": "وضعیت Tor",
  "settings.tor.connection": "اتصال",
  "settings.tor.mode_off": "مستقیم",
  "settings.tor.mode_off_desc":
    "مستقیم به Tor وصل می‌شود. سریع‌ترین، اما هر کسی که این شبکه را می‌بیند متوجه می‌شود از Tor استفاده می‌کنید.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "پنهان می‌کند که از Tor استفاده می‌کنید و جایی که پل‌ها مسدودند هم کار می‌کند. کندترین در اتصال.",
  "settings.tor.mode_obfs4": "obfs4",
  "settings.tor.mode_obfs4_desc":
    "پنهان می‌کند که از Tor استفاده می‌کنید. سریع‌تر از Snowflake، اما این پل‌ها عمومی‌اند و برخی شبکه‌ها آنها را مسدود می‌کنند.",
  "settings.tor.mode_webtunnel": "webtunnel",
  "settings.tor.mode_webtunnel_desc":
    "با شبیه‌سازی بازدید معمولی از یک وب‌سایت، استفاده از Tor را پنهان می‌کند. مسدود کردنش از بقیه سخت‌تر است.",
  "settings.tor.mode_custom": "پل‌های دلخواه",
  "settings.tor.mode_custom_desc":
    "از خطوط پل obfs4 از bridges.torproject.org استفاده کنید. وقتی بقیه کار نکردند این را امتحان کنید.",
  "settings.tor.custom_placeholder": "در هر خط یک خط پل را بچسبانید",
  "settings.tor.custom_apply_hint": "برای اتصال، بیرون کادر را لمس کنید.",
  "settings.tor.custom_empty": "ابتدا دست‌کم یک خط پل اضافه کنید.",
  "settings.tor.recovered":
    "Tor خاموش شد، چون بار قبل راه‌اندازی آن کامل نشد. برای تلاش دوباره آن را روشن کنید.",
  "settings.conn.mint_clearnet": "اجازه به ترافیک ضراب‌خانه روی شبکهٔ باز",
  "settings.conn.mint_clearnet_desc":
    "Tor روی iOS تنها Nostr را پوشش می‌دهد. برای مسدود کردن درخواست‌های ضراب‌خانه خاموش بگذارید؛ در هر حال ecash روی مش کار می‌کند.",
  "settings.conn.gateway": "دروازهٔ اینترنت",
  "settings.conn.gateway_desc":
    "اتصال خود را به گوشی برون‌خطی نزدیک قرض بدهید تا آن هم بتواند به کانال‌های موقعیت برسد",
  "settings.conn.gateway_on_title": "دروازهٔ اینترنت روشن شود؟",
  "settings.conn.gateway_on_body":
    "گوشی‌های نزدیک که اتصال خودشان را ندارند، پیام‌های کانال موقعیت را از راه شما می‌فرستند و می‌گیرند. این کار از دادهٔ همراه و باتری شما مصرف می‌کند، و پیام‌هایشان سرتاسر رمزگذاری‌شده می‌ماند، پس شما نمی‌توانید آنچه را می‌گذرد بخوانید.",
  "settings.conn.gateway_off_title": "دروازهٔ اینترنت خاموش شود؟",
  "settings.conn.gateway_off_body":
    "گوشی‌های برون‌خط نزدیک دیگر از راه شما به کانال‌های موقعیت نمی‌رسند. پیام‌های خودتان بی‌تأثیر می‌مانند.",
  "settings.conn.bridge": "پل مش",
  "settings.conn.bridge_desc":
    "گفتگوی عمومی #bluetooth این منطقه را از راه اینترنت به جمع بلوتوثی دیگری بیرون از محدوده پیوند بده",
  "settings.conn.bridge_on_title": "پل مش روشن شود؟",
  "settings.conn.bridge_on_body":
    "پیام‌های عمومی #bluetooth شما از راه اینترنت در محلهٔ شما منتشر می‌شوند، تا کسانی بیرون از محدودهٔ بلوتوث هم بتوانند بخوانند. پیام‌های خصوصی هرگز از پل نمی‌گذرند، و «فقط نزدیک» هر پیام مشخصی را محلی نگه می‌دارد.",
  "settings.conn.bridge_off_title": "پل مش خاموش شود؟",
  "settings.conn.bridge_off_body":
    "پیام‌های عمومی #bluetooth شما دوباره در محدودهٔ بلوتوث می‌مانند، و پیام‌های آن جمعِ پل‌خورده دیگر به اینجا نمی‌رسند.",
  "settings.conn.bridge_needs_location": "پل مش به موقعیت مکانی نیاز دارد",
  "settings.conn.bridge_needs_location_desc":
    "محلهٔ شما را از روی یک تثبیت موقعیت پیدا می‌کند. برای آغاز پل‌زدن به موقعیت مکانی اجازه بدهید.",
  "settings.conn.grant_location": "اجازهٔ موقعیت مکانی",
  "settings.conn.grant_short": "اجازه بده",
  "settings.conn.internet_off": "اینترنت خاموش است",
  "settings.conn.internet_off_desc":
    "Tor و پل و دروازه همگی از اینترنت استفاده می‌کنند. برای به کار بردنشان، اینترنت جایگزین را زیر بخش شبکه روشن کنید.",
  "settings.conn.turn_on": "روشن کن",
  "settings.conn.turn_off": "خاموش کن",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "بلوتوث",
  "settings.permissions.bluetooth_desc":
    "دستگاه‌های نزدیک را پیدا می‌کند و پیام‌ها را میانشان جابه‌جا می‌کند. بدون آن، مش نمی‌تواند کار کند.",
  "settings.permissions.location": "موقعیت مکانی",
  "settings.permissions.location_desc":
    "کانال‌های منطقهٔ نزدیک را باز می‌کند. بدون آن، آن کانال‌ها بسته می‌مانند و مش بلوتوثی مثل همیشه کار می‌کند.",
  "settings.permissions.notifications": "اعلان‌ها",
  "settings.permissions.notifications_desc":
    "حتی وقتی برنامه بسته است از پیام‌های تازه باخبر شوید. بدون آن، تنها وقتی Airhop را باز کنید آن‌ها را می‌بینید.",
  "settings.permissions.camera": "دوربین",
  "settings.permissions.camera_desc":
    "کدهای QR را بپویید و برای فرستادن عکس یا ویدیو بگیرید. بدون آن هم می‌توانید رسانه را از گالری خود هم‌رسانی کنید.",
  "settings.permissions.photos": "عکس‌ها",
  "settings.permissions.photos_desc":
    "از گالری خود عکس بفرستید و رسانهٔ دریافتی را ذخیره کنید. بدون آن هم می‌توانید با دوربین عکس تازه بگیرید و بفرستید.",
  "settings.permissions.microphone": "میکروفون",
  "settings.permissions.microphone_desc":
    "پیام صوتی ضبط و ارسال کنید یا صدای زنده به کار ببرید. بدون آن، پیام صوتی و صدای زنده کار نمی‌کنند.",
  "settings.permissions.allow": "اجازه دادن به این دسترسی",
  "settings.permissions.open_settings":
    "برای تغییر این دسترسی، تنظیمات سیستم را باز کنید",
  "settings.permissions.system": "سیستم",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "مصرف شبکه",
  "settings.storage.storage_usage": "مصرف حافظه",
  "settings.storage.storage_usage_desc":
    "پیام‌ها، اثبات‌های کیف پول و پیوست‌های ذخیره‌شده",
  "settings.storage.session_usage":
    "این نشست · {sent} ارسال، {received} دریافت",
  "settings.storage.cache": "حافظهٔ نهان",
  "settings.storage.cache_desc": "{size} پیوست",
  "settings.storage.clear_cache": "پاک کردن حافظهٔ نهان پیوست‌ها",
  "settings.storage.clear": "پاک کن",
  "settings.storage.clear_title": "رسانهٔ ذخیره‌شده پاک شود؟",
  "settings.storage.clear_body":
    "عکس‌ها، ویدیوها، پیام‌های صوتی و فایل‌ها از این دستگاه برداشته می‌شوند، چه فرستاده چه دریافت‌شده. دیگر نمی‌شود دوباره دانلودشان کرد: حباب‌هایشان همین را می‌گویند، و می‌توانید از فرستنده بخواهید دوباره بفرستد. پیام‌ها و کیف پول دست‌نخورده می‌مانند.",
  "settings.storage.cleared": "حافظهٔ نهان پاک شد",
  "settings.storage.freed": "{size} آزاد شد.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "ظاهر روی {value} تنظیم شود",
  "settings.font.set_a11y": "قلم تک‌عرض روی {value} تنظیم شود",
  "settings.font.system": "سیستم",
  "settings.font.system_desc":
    "از قلم تک‌عرض پیش‌فرض دستگاه شما استفاده می‌کند",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "امروزی و خوانا",
  "settings.language.en": "انگلیسی",
  "settings.language.am": "امهری",
  "settings.language.ar": "عربی",
  "settings.language.bn": "بنگالی",
  "settings.language.my": "برمه‌ای",
  "settings.language.zh_hans": "چینی (ساده‌شده)",
  "settings.language.zh_hant": "چینی (سنتی)",
  "settings.language.nl": "هلندی",
  "settings.language.fil": "فیلیپینی",
  "settings.language.fr": "فرانسوی",
  "settings.language.ka": "گرجی",
  "settings.language.de": "آلمانی",
  "settings.language.hi": "هندی",
  "settings.language.id": "اندونزیایی",
  "settings.language.it": "ایتالیایی",
  "settings.language.ja": "ژاپنی",
  "settings.language.ko": "کره‌ای",
  "settings.language.mg": "مالاگاسی",
  "settings.language.ms": "مالایی",
  "settings.language.ne": "نپالی",
  "settings.language.fa": "فارسی",
  "settings.language.pl": "لهستانی",
  "settings.language.pt_br": "پرتغالی (برزیل)",
  "settings.language.pt_pt": "پرتغالی (پرتغال)",
  "settings.language.pa": "پنجابی",
  "settings.language.ru": "روسی",
  "settings.language.es": "اسپانیایی",
  "settings.language.sw": "سواحیلی",
  "settings.language.sv": "سوئدی",
  "settings.language.ta": "تامیلی",
  "settings.language.th": "تایلندی",
  "settings.language.tr": "ترکی",
  "settings.language.uk": "اوکراینی",
  "settings.language.ur": "اردو",
  "settings.language.vi": "ویتنامی",
  "settings.language.pseudo": "زبان آزمایشی",
  "settings.language.soon": "به‌زودی",
  "settings.language.soon_a11y": "{value}، به‌زودی",
  "settings.language.set_a11y": "زبان روی {value} تنظیم شود",
  "settings.language.pending": "در باز شدن بعدی",
  "settings.language.pending_a11y":
    "{value}، دفعهٔ بعد که Airhop را باز کنید اعمال می‌شود",
  "settings.language.rtl_restart": "اکنون باز کنید",
  "settings.language.rtl_title": "برای پایان کار Airhop را دوباره باز کنید",
  "settings.language.rtl_body":
    "{value} از راست به چپ خوانده می‌شود، و Airhop تنها هنگام راه‌اندازی می‌تواند جهت را عوض کند. برای پایان جابه‌جایی آن را ببندید و دوباره باز کنید. چیزی از دست نمی‌رود، و تا آن وقت مش شما متصل می‌ماند.",
  "settings.theme.light": "روشن",
  "settings.theme.light_desc": "همیشه از پالت روشن استفاده کن",
  "settings.theme.dark": "تیره",
  "settings.theme.dark_desc": "همیشه از پالت تیره استفاده کن",

  // ---- Settings: profile and identity ----
  "settings.status.online": "برخط",
  "settings.status.online_desc": "قابل کشف، در حال پخش و پویش",
  "settings.status.away": "دور",
  "settings.status.away_desc": "مش متوقف، نه پویش نه پخش",
  "settings.status.invisible": "نامرئی",
  "settings.status.invisible_desc": "در حال پویش، اما پنهان از کشف",
  "settings.status.title": "وضعیت",
  "settings.status.set_a11y": "وضعیت روی {value} تنظیم شود",
  "settings.status.edit": "ویرایش وضعیت",
  "settings.status.desc": "انتخاب کنید روی مش چقدر پیدا باشید.",
  "settings.transfer.identity": "هویت و کلیدها",
  "settings.transfer.identity_desc": "شناسهٔ همتا، نام کاربری و مخاطبان شما",
  "settings.transfer.chats": "گفتگوها و تاریخچه",
  "settings.transfer.chats_desc":
    "گفتگوها، گروه‌ها و کانال‌هایی که به آن‌ها پیوسته‌اید",
  "settings.transfer.wallet": "موجودی کیف پول",
  "settings.transfer.wallet_desc": "اثبات‌های Cashu و تاریخچهٔ تراکنش‌ها",
  "settings.transfer.title": "انتقال به گوشی تازه",
  "settings.transfer.desc":
    "هویت، گفتگوها و کیف پول خود را به دستگاهی دیگر ببرید",
  "settings.transfer.coming_soon_a11y": "انتقال به گوشی تازه، به‌زودی",
  "settings.transfer.body":
    "دو گوشی را کنار هم نگه دارید و همه چیز را از راه بلوتوث منتقل کنید. چیزی از سرور نمی‌گذرد، پس بدون اینترنت هم کار می‌کند.",
  "settings.qr.permission_label": "دسترسی عکس",
  "settings.qr.permission_purpose": "ذخیرهٔ کد QR شما",
  "settings.qr.saved": "ذخیره شد",
  "settings.qr.saved_body": "کد QR در گالری عکس شما ذخیره شد.",
  "settings.qr.save_failed": "ذخیره نشد",
  "settings.qr.save_failed_body": "کد QR ذخیره نشد. دوباره تلاش کنید.",
  "settings.qr.share_message": "من را در Airhop اضافه کنید",
  "settings.qr.share_body":
    "من را در Airhop اضافه کنید — پیام‌رسان مش خصوصی با اولویت برون‌خط.",
  "settings.qr.show_short": "نمایش QR",
  "settings.qr.title": "کد QR شما",
  "settings.qr.note":
    "این کلیدهای عمومی شما را در بر دارد، که به دیگران اجازه می‌دهد از هر جایی به شما پیام بدهند. تنها با کسانی که به آن‌ها اعتماد دارید هم‌رسانی کنید. تا وقتی هویت خود را پاک نکنید تغییر نمی‌کند.",
  "settings.qr.code_label": "کد مخاطب",
  "settings.qr.copy_code": "کپی کد مخاطب",
  "settings.qr.share": "هم‌رسانی کد QR",
  "settings.qr.share_short": "هم‌رسانی QR",
  "settings.qr.download": "دانلود کد QR",
  "settings.qr.download_short": "دانلود QR",
  "settings.qr.show": "نمایش کد QR",
  "settings.wipe.trigger": "اجرای پاک‌سازی اضطراری",
  "settings.wipe.trigger_desc":
    "برای پاک کردن بی‌درنگ و بدون تأیید، سه بار بزنید",
  "settings.wipe.title": "پاک‌سازی اضطراری",
  "settings.wipe.now": "همین حالا پاک کن",
  "settings.wipe.desc":
    "بی‌درنگ همهٔ کلیدها، پیام‌ها و اثبات‌ها را نابود می‌کند",
  "settings.wipe.body":
    "این کار بی‌درنگ همهٔ کلیدها، پیام‌ها و اثبات‌های کیف پول شما را نابود می‌کند. این کار برگشت‌پذیر نیست.",
  "settings.wipe.in_progress": "در حال پاک کردن",
  "settings.wipe.in_progress_body":
    "کلیدها، پیام‌ها و فایل‌های شما نابود می‌شوند. چند ثانیه طول می‌کشد، و اگر برنامه بسته شود خودش تا پایان می‌رود.",
  "settings.wipe.got_it": "متوجه شدم",
  "settings.wipe.keys_failed": "کلیدها نابود نشدند",
  "settings.wipe.keys_failed_body":
    "پیام‌ها، مخاطبان و کیف پول شما رفته‌اند، اما دستگاه از رها کردن کلیدهای شما سر باز زد. قفل دستگاه را باز کنید و دوباره پاک کنید.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "تماس با ما",
  "settings.help.contact_a11y": "ایمیل به {address}",
  "settings.help.bug": "گزارش اشکال",
  "settings.help.bug_desc": "باز کردن یک issue در GitHub",
  "settings.help.bug_a11y": "گزارش اشکال در GitHub",
  "settings.help.faq": "پرسش‌های پرتکرار",
  "settings.help.faq_desc": "پاسخ پرسش‌های رایج",
  "settings.help.faq_a11y": "باز کردن پرسش‌های پرتکرار",
  "settings.help.terms_desc": "Airhop چگونه می‌تواند به کار رود",
  "settings.help.terms_a11y": "باز کردن شرایط استفاده از خدمات",
  "settings.help.privacy_desc": "آنچه ما جمع نمی‌کنیم",
  "settings.help.privacy_a11y": "باز کردن سیاست حریم خصوصی",

  // ---- Settings: support ----
  "settings.support.card": "کارت یا UPI",
  "settings.support.card_desc": "بانکداری اینترنتی و کیف پول‌ها، در سراسر جهان",
  "settings.support.card_a11y":
    "پشتیبانی با کارت، UPI، بانکداری اینترنتی یا کیف پول",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "ماهانه یا یک‌باره، بدون کارمزد سکو",
  "settings.support.sponsors_a11y": "پشتیبانی از راه GitHub Sponsors",
  "settings.support.note":
    "من Airhop را در وقت آزادم می‌سازم. نه سرمایه‌گذاری در کار است نه تبلیغاتی. اگر برایتان مفید است، یک کمک مالی راه درازی در ادامه دادن توسعه می‌رود. در هر حال همهٔ قابلیت‌ها رایگان می‌مانند.",

  // ---- Settings: about and version ----
  "settings.about.version": "نسخه",
  "settings.about.version_desc": "انتشار کنونی",
  "settings.about.version_a11y": "دیدن نسخه و بررسی به‌روزرسانی",
  "settings.about.release_notes": "یادداشت‌های انتشار",
  "settings.about.release_notes_desc": "تازه‌های آخرین انتشار",
  "settings.about.release_notes_a11y":
    "باز کردن یادداشت‌های آخرین انتشار در GitHub",
  "settings.about.source": "کد منبع",
  "settings.about.source_a11y": "باز کردن کد منبع در GitHub",
  "settings.about.licenses": "پروانه‌های متن‌باز",
  "settings.about.open_repo": "باز کردن مخزن {name}",
  "settings.about.licenses_desc": "بسته‌های متن‌باز شخص ثالث",
  "settings.about.licenses_a11y": "دیدن پروانه‌های شخص ثالث",
  "settings.version.codename": "نام رمز",
  "settings.version.checking": "در حال بررسی",
  "settings.version.check": "بررسی به‌روزرسانی",
  "settings.version.checking_title": "در حال بررسی به‌روزرسانی",
  "settings.version.up_to_date": "شما آخرین نسخه را دارید.",
  "settings.version.release_notes": "دیدن یادداشت‌های انتشار",
  "settings.version.made_with": "ساخته‌شده با",
  "settings.version.number": "نسخهٔ {version}",
  "settings.version.update_to": "به‌روزرسانی به {version}",
  "settings.version.update_to_a11y": "به‌روزرسانی به نسخهٔ {version}",
  "settings.version.released_under": "منتشرشده تحت {license}",
  "settings.version.notes_a11y": "دیدن یادداشت‌های انتشار نسخهٔ {version}",
  "settings.version.tor_paused":
    "تا وقتی Tor روشن است بررسی به‌روزرسانی متوقف می‌ماند، تا نشانی IP شما درز نکند. صفحهٔ انتشارها را در مرورگر ببینید.",
  "settings.version.check_failed":
    "به‌روزرسانی بررسی نشد. اتصال خود را وارسی کنید و دوباره تلاش کنید.",
  "settings.version.downloading": "در حال دانلود {percent}%",
  "settings.version.install": "نصب",
  "settings.version.download_failed":
    "دانلود ناموفق بود. اتصال خود را بررسی کنید و دوباره تلاش کنید.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} برابر {size} KiB است، بیش از حد {cap} KiB.",
  "transfer.failed.malformed":
    "یک پیوست آسیب‌دیده رسید و باز نشد. از آن‌ها بخواهید دوباره بفرستند.",
  "transfer.failed.unsupported_type":
    "یک پیوست با قالبی رسید که این برنامه نمی‌تواند بازش کند.",
  "transfer.failed.type_mismatch":
    "یک پیوست رد شد: محتوایش با نوع فایلی که ادعا کرده بود نمی‌خواند.",
  "transfer.failed.storage":
    "یک پیوست رسید اما ذخیره نشد. فضای خالی خود را بررسی کنید.",
  "transfer.badge.waiting": "در انتظار · {name}",
  "transfer.badge.active_count": "{count} انتقال",
  "transfer.badge.sending": "در حال فرستادن {name}",
  "transfer.badge.receiving": "در حال دریافت {name}",
  "transfer.badge.a11y": "{label}، {percent} درصد. باز کردن گفتگو.",
  "transfer.kind.photo": "عکس",
  "transfer.kind.video": "ویدیو",
  "transfer.kind.voice": "پیام صوتی",
  "transfer.this.photo": "این عکس",
  "transfer.this.video": "این ویدیو",
  "transfer.this.voice": "این پیام صوتی",
  "transfer.this.file": "این فایل",
  "transfer.kind.document": "سند",
  "transfer.kind.voice_preview": "پیام صوتی",
  "transfer.kind.photo_preview": "عکس",
  "transfer.kind.video_preview": "ویدیو",
  "transfer.kind.document_preview": "سند",

  // ---- System notifications ----
  "notif.channel.messages": "پیام‌ها",
  "notif.channel.nearby": "همتاهای نزدیک",
  "notif.channel.nearby_desc":
    "هر از گاهی وقتی مش کسانی را در محدودهٔ بلوتوث پیدا می‌کند خبر می‌دهد.",
  "notif.nearby.body": "همین حالا در محدودهٔ بلوتوث. برای باز کردن مش بزنید.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "کسی",
  "notif.notice_urgent": "اعلان فوری · {content}",
  "notif.notice": "اعلان · {content}",
  "notif.incoming_file": "فایل ورودی",
  "notif.preview.photo": "📷 عکس",
  "notif.preview.voice": "🎤 پیام صوتی",
  "notif.preview.video": "🎥 ویدیو",
  "notif.preview.document": "📄 سند",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "پیام تازه",
  "notif.hidden.channel": "فعالیت تازه",
  "notif.hidden.mention": "از شما نام برده شد",
  "notif.mention.title": "{sender} از شما نام برد",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "نمایش {count} مورد دیگر",
    other: "نمایش {count} مورد دیگر",
  },
  "chat.channels.show_more_a11y": {
    one: "نمایش {count} کانال پیش‌فرض دیگر",
    other: "نمایش {count} کانال پیش‌فرض دیگر",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}، {count} خوانده‌نشده",
    other: "{label}، {count} خوانده‌نشده",
  },
  "a11y.new_count": {
    one: "{label}، {count} مورد جدید",
    other: "{label}، {count} مورد جدید",
  },
  "chat.a11y.unread": {
    one: "{count} خوانده‌نشده",
    other: "{count} خوانده‌نشده",
  },
  "chat.thread.length_left": {
    one: "{count} باقی‌مانده",
    other: "{count} باقی‌مانده",
  },
  "settings.general.retention_days": {
    one: "{count} روز",
    other: "{count} روز",
  },
  "chat.info.group_reach": {
    one: "{reachable} نفر از {count} عضو در دسترس",
    other: "{reachable} نفر از {count} عضو در دسترس",
  },
  "chat.group_members": {
    one: "گروه خصوصی  ·  {count} عضو",
    other: "گروه خصوصی  ·  {count} عضو",
  },
  "chat.select.count": {
    one: "{count} مورد انتخاب شد",
    other: "{count} مورد انتخاب شد",
  },
  "chat.select.forward": {
    one: "هدایت {count} پیام",
    other: "هدایت {count} پیام",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} نفر در حال صحبت",
    other: "{count} نفر در حال صحبت",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} همتا در محدوده",
    other: "{count} همتا در محدوده",
  },
  "mesh.peer.hops_away": {
    one: "{count} پرش فاصله",
    other: "{count} پرش فاصله",
  },
  "chat.presence.active": {
    one: "{count} فعال",
    other: "{count} فعال",
  },
  "chat.presence.nearby": {
    one: "{count} نفر نزدیک",
    other: "{count} نفر نزدیک",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} ضراب‌خانه",
    other: "{count} ضراب‌خانه",
  },
  "wallet.mint.remove_body": {
    one: "{mint} مبلغ {balance} {unit} را در {count} اثبات نگه داشته است. با حذف آن، آن اثبات برای همیشه از این دستگاه پاک می‌شود و هیچ نسخهٔ پشتیبانی وجود ندارد. اول موجودی را برداشت یا ارسال کنید.",
    other:
      "{mint} مبلغ {balance} {unit} را در {count} اثبات نگه داشته است. با حذف آن، آن اثبات‌ها برای همیشه از این دستگاه پاک می‌شوند و هیچ نسخهٔ پشتیبانی وجود ندارد. اول موجودی را برداشت یا ارسال کنید.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} واریز در انتظار پرداخت است. هر بار که برنامه باز می‌شود دوباره بررسی می‌شود.",
    other:
      "{count} واریز در انتظار پرداخت هستند. هر بار که برنامه باز می‌شود دوباره بررسی می‌شوند.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{count} اثبات خرج‌نشده از {mints} بازیابی شد.",
    other: "{count} اثبات خرج‌نشده از {mints} بازیابی شد.",
  },
  "wallet.backup.already_spent": {
    one: "{count} سکه پیدا شد اما قبلاً خرج شده بود، بنابراین چیزی به موجودی اضافه نشد. این طبیعی است: هر سکه‌ای که تا به حال خرج کرده‌اید همچنان در سوابق ضراب‌خانه می‌ماند.",
    other:
      "{count} سکه پیدا شد اما قبلاً خرج شده بودند، بنابراین چیزی به موجودی اضافه نشد. این طبیعی است: هر سکه‌ای که تا به حال خرج کرده‌اید همچنان در سوابق ضراب‌خانه می‌ماند.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "نمایش {count} مورد دیگر",
    other: "نمایش {count} مورد دیگر",
  },
  "wallet.activity.show_more_a11y": {
    one: "نمایش {count} پرداخت دیگر",
    other: "نمایش {count} پرداخت دیگر",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} تأییدنشده",
    other: "{count} تأییدنشده",
  },
  "wallet.proof_count": {
    one: "{count} اثبات",
    other: "{count} اثبات",
  },
  "wallet.spent_removed_detail": {
    one: "{count} اثبات قبلاً خرج شده بود و حذف شد.",
    other: "{count} اثبات قبلاً خرج شده بودند و حذف شدند.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "یک نفر نزدیک شماست",
    other: "{count} نفر نزدیک شما هستند",
  },
};

export const fa = { strings, plurals };
