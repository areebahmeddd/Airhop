// ur: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "منسوخ کریں",
  "common.done": "ہو گیا",
  "common.ok": "ٹھیک ہے",
  "common.close": "بند کریں",
  "common.back": "واپس",
  "common.delete": "حذف کریں",
  "common.remove": "ہٹائیں",
  "common.add": "شامل کریں",
  "common.copy": "کاپی کریں",
  "common.copied": "کاپی ہو گیا",
  "common.share": "شیئر کریں",
  "common.continue": "جاری رکھیں",
  "common.try_again": "دوبارہ کوشش کریں",
  "common.settings": "ترتیبات",
  "common.on": "آن",
  "common.off": "بند",

  // ---- Dates ----
  "format.today": "آج",
  "format.yesterday": "کل",
  "format.minutes_ago": "{count} منٹ پہلے",
  "format.hours_ago": "{count} گھنٹے پہلے",
  "format.days_ago": "{count} دن پہلے",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "چیٹس",
  "nav.tab.mesh": "میش",
  "nav.tab.wallet": "بٹوہ",
  "nav.tab.profile": "آپ",
  "a11y.tab.new_peers": "{label}، قریب کوئی نیا موجود ہے",
  "nav.notifications": "اطلاعات",
  "chat.subtab.channels": "چینل",
  "chat.subtab.direct": "براہ راست",
  "chat.subtab.dms": "براہ راست پیغامات",
  "chat.search.placeholder": "چیٹس میں تلاش کریں…",
  "chat.search.a11y": "چیٹس اور پیغامات میں تلاش کریں",
  "chat.search.close": "تلاش بند کریں",
  "chat.search.clear": "تلاش صاف کریں",
  "mesh.view.radar": "ریڈار منظر",
  "mesh.view.list": "فہرست منظر",
  "mesh.view.radar_short": "ریڈار",
  "mesh.view.list_short": "فہرست",

  // ---- Legal document names ----
  "legal.last_updated": "آخری بار اپ ڈیٹ ہوا: {date}",
  "legal.terms": "شرائط استعمال",
  "legal.privacy": "رازداری کی پالیسی",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "نجی میش رابطہ",
  "onboarding.welcome.cta": "شروع کریں",
  "onboarding.welcome.cta_hint":
    "جاری رکھنے کے لیے نیچے دی گئی شرائط سے اتفاق کریں",
  "onboarding.welcome.consent_a11y":
    "شرائط استعمال اور رازداری کی پالیسی سے اتفاق کریں",
  "onboarding.welcome.open_terms": "شرائط استعمال کھولیں",
  "onboarding.welcome.open_privacy": "رازداری کی پالیسی کھولیں",
  "onboarding.welcome.consent":
    "{cta} دبانے سے آپ ہماری {terms} اور {privacy} سے اتفاق کرتے ہیں۔",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "آپ کی شناخت بنائی جا رہی ہے",
  "onboarding.identity.body":
    "اس آلے پر Ed25519 کلیدوں کا جوڑا بنایا جا رہا ہے۔\nکچھ بھی کہیں نہیں بھیجا جاتا۔",
  "onboarding.identity.failed_heading": "آپ کی کلیدیں نہیں بن سکیں",
  "onboarding.identity.failed_body":
    "اس آلے نے Airhop کو انہیں محفوظ طریقے سے رکھنے کی اجازت نہیں دی۔ دوبارہ کوشش کریں، یا اپنا فون دوبارہ چالو کر کے Airhop پھر کھولیں۔",
  "onboarding.identity.steps_a11y": "مراحل: {steps}",
  "onboarding.identity.step.x25519":
    "مستقل X25519 کلیدوں کا جوڑا بنایا جا رہا ہے",
  "onboarding.identity.step.ed25519":
    "Ed25519 دستخطی کلیدوں کا جوڑا بنایا جا رہا ہے",
  "onboarding.identity.step.keychain":
    "کلیدیں نظام کی کلید زنجیر میں رکھی جا رہی ہیں",
  "onboarding.identity.step.peer_id": "پیئر شناخت اخذ کی جا رہی ہے",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "میش پر آپ کا نام",
  "onboarding.username.peer_id": "پیئر شناخت",
  "onboarding.username.card_a11y":
    "میش پر آپ کا نام {username} ہے۔ پیئر شناخت {peerID}۔ {props}۔",
  "onboarding.username.explanation":
    "یہ صارف نام آپ کی عوامی کلید سے قطعی طور پر اخذ ہوتا ہے۔ یہ ہر اُس آلے پر ایک جیسا ہوتا ہے جو آپ کی پیئر شناخت دیکھتا ہے۔",
  "onboarding.username.cta": "Airhop میں داخل ہوں",
  "onboarding.username.prop.algorithm": "الگورتھم",
  "onboarding.username.prop.storage": "ذخیرہ",
  "onboarding.username.prop.storage_value": "صرف نظام کی کلید زنجیر",
  "onboarding.username.prop.account": "اکاؤنٹ درکار ہے",
  "onboarding.username.prop.account_value": "کوئی نہیں",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop میں خوش آمدید",
  "onboarding.hello.p1":
    "سلام۔ Airhop کو bitchat کے اوپر ایک خودمختار، کھلے ماخذ کے ضمنی منصوبے کے طور پر بنایا گیا ہے۔ یہ نہ bitchat منصوبے سے وابستہ ہے نہ permissionless tech سے، اور نہ ہی ان کی توثیق شدہ ہے، بس ایک ایسی چیز ہے جسے بنانا اور برادری کے ساتھ بانٹنا مجھے اچھا لگتا ہے۔",
  "onboarding.hello.p2":
    "یہ iOS اور Android کے لیے پہلا اجرا ہے، اس لیے اگرچہ میں نے اسے دوستوں کے ساتھ آزمایا ہے، آپ کو شاید چند خرابیاں ملیں گی۔ ایسا ہو، یا آپ کے پاس کسی خصوصیت کا خیال ہو، تو مجھے سن کر خوشی ہو گی۔ {github} پر مسئلہ درج کریں یا مجھے {email} پر ای میل کریں۔",
  "onboarding.hello.p3":
    "اگر Airhop آپ کے کام آتا ہے تو {github} پر ستارہ یا {store} پر تبصرہ چھوڑنے پر غور کریں۔ اس سے مزید لوگوں کو یہ منصوبہ ملنے میں مدد ملتی ہے۔ آزمانے کا شکریہ!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "اس سے پہلے کہ آپ کا فون پوچھے",
  "onboarding.primer.lede": "ہر ایک کیا کرتا ہے، اور کیا نہیں کرتا، وہ یہ ہے۔",
  "onboarding.primer.bluetooth.title": "بلوٹوتھ",
  "onboarding.primer.bluetooth.body":
    "قریبی آلات ڈھونڈتا ہے اور ان کے درمیان پیغامات پہنچاتا ہے۔ میش اسی طرح بنتی ہے، اور یہ انٹرنیٹ کے بغیر کام کرتی ہے۔",
  "onboarding.primer.location.title": "مقام",
  "onboarding.primer.location.body":
    "آپ کو قریبی علاقے کے چینلوں میں رکھتا ہے، ایک محلے سے لے کر پورے خطے تک۔ Airhop آپ کا تعاقب کبھی نہیں کرتا اور نہ ہی آپ کا درست مقام آلے سے باہر بھیجتا ہے۔",
  "onboarding.primer.notifications.title": "اطلاعات",
  "onboarding.primer.notifications.body":
    "ایپ بند ہونے پر بھی نئے پیغامات کی اطلاع پائیں۔ اطلاعات آپ کے آلے پر مقامی طور پر بنتی ہیں، کسی سرور کی شمولیت کے بغیر۔",
  "onboarding.primer.footnote":
    "آپ انکار کر سکتے ہیں۔ پیغامات پھر بھی انٹرنیٹ سے سفر کرتے ہیں، اور آپ بعد میں ترتیبات میں اپنا ارادہ بدل سکتے ہیں۔",
  "onboarding.primer.cta_a11y": "اجازت کی درخواستوں کی طرف بڑھیں",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "بلوٹوتھ تک رسائی",
  "permission.bluetooth.purpose": "میش کے ذریعے قریبی آلات دریافت کرنا",
  "permission.open_settings": "ترتیبات کھولیں",
  "permission.not_now": "ابھی نہیں",
  "permission.blocked_title": "{label} بند ہے",
  "permission.blocked_body": "{purpose} کے لیے اسے ترتیبات میں چالو کریں۔",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "کچھ غلط ہو گیا",
  "error.boundary.body":
    "Airhop کو ایک غیر متوقع مسئلہ پیش آیا اور جو دکھا رہا تھا اسے روکنا پڑا۔",

  // ---- Chats: channel list ----
  "chat.channels.default": "طے شدہ چینل",
  "chat.channels.yours": "آپ کے چینل",
  "chat.channels.none": "ابھی کوئی چینل نہیں",
  "chat.channels.none_hint":
    "شامل ہونے یا نیا بنانے کے لیے اوپر {plus} چھوئیں۔",
  "chat.channels.none_desc":
    "ابھی کوئی چینل نہیں۔ شامل ہونے یا نیا بنانے کے لیے سرخی میں موجود شامل کرنے کا بٹن استعمال کریں۔",
  "chat.channels.show_fewer": "کم طے شدہ چینل دکھائیں",
  "chat.channels.show_less": "کم دکھائیں",
  "chat.channels.info": "چینل کی معلومات",
  "chat.channels.pin": "چینل ٹانکیں",
  "chat.channels.unpin": "چینل کی ٹانک ہٹائیں",
  "chat.channels.mute": "چینل خاموش کریں",
  "chat.channels.unmute": "چینل کی خاموشی ہٹائیں",
  "chat.channels.leave": "چینل چھوڑیں",
  "chat.channels.leave_confirm": "چھوڑیں",
  "chat.channels.clear_body":
    "{name} کے تمام پیغامات حذف کریں؟ یہ واپس نہیں ہو سکتا۔",
  "chat.channels.leave_body":
    "{name} چھوڑیں؟ آپ کو اس کے پیغام ملنا بند ہو جائیں گے، اور اس کی تاریخ اس آلے سے ہٹا دی جائے گی۔",
  "chat.channels.more_options": "{name} کے مزید اختیارات",
  "chat.channels.teleported_tag": "{level}  ·  منتقل شدہ",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "چیٹ صاف کریں",
  "chat.dm.remove_contact": "رابطہ ہٹائیں",
  "chat.dm.block": "اس پیئر کو مسدود کریں",
  "chat.dm.block_confirm": "مسدود کریں",
  "chat.dm.delete": "چیٹ حذف کریں",
  "chat.dm.delete_body":
    "یہ گفتگو کو آپ کی فہرست سے ہٹاتا اور اس کے پیغامات حذف کرتا ہے۔ رابطہ باقی رہتا ہے، اور ان کا نیا پیغام ایک نئی چیٹ شروع کر دیتا ہے۔",
  "chat.dm.in_range": "حدود میں",
  "chat.dm.row_hint": "مزید اختیارات کے لیے دو بار چھو کر دبائے رکھیں",
  "chat.channels.row_hint": "مزید اختیارات کے لیے دو بار چھو کر دبائے رکھیں",
  "chat.dm.you_prefix": "آپ:",
  "chat.dm.none": "کوئی براہ راست پیغام نہیں",
  "chat.dm.none_desc":
    "خفیہ براہ راست پیغام شروع کرنے کے لیے میش ٹیب پر جائیں اور کسی پیئر کو چھوئیں۔",
  "chat.dm.contact_info": "رابطے کی معلومات",
  "chat.dm.pin": "چیٹ ٹانکیں",
  "chat.dm.unpin": "چیٹ کی ٹانک ہٹائیں",
  "chat.dm.mute": "چیٹ خاموش کریں",
  "chat.dm.unmute": "چیٹ کی خاموشی ہٹائیں",
  "chat.dm.clear_body":
    "{name} کے ساتھ تمام پیغامات حذف کریں؟ یہ واپس نہیں ہو سکتا۔",
  "chat.dm.remove_contact_body":
    "{name} کو ہٹائیں؟ یہ گفتگو حذف کر دیتا ہے اور رابطہ بھلا دیتا ہے۔ اگر وہ دوبارہ پیغام بھیجیں تو پھر بھی آپ تک پہنچ سکتے ہیں۔",
  "chat.dm.block_body":
    "{name} کو مسدود کریں؟ آپ انہیں میش ٹیب پر نہیں دیکھیں گے اور نہ ان کے پیغام پائیں گے، چاہے وہ قریب ہی کیوں نہ ہوں۔",
  "chat.dm.more_options": "{name} کے مزید اختیارات",
  "chat.dm.remove_contact_short": "رابطہ ہٹائیں",
  "chat.dm.block_short": "رابطہ مسدود کریں",
  "chat.dm.delete_short": "چیٹ حذف کریں",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "پیغامات صاف کریں",
  "chat.clear_confirm": "صاف کریں",
  "chat.group_badge": "گروپ",
  "chat.more": "مزید",
  "chat.no_messages": "ابھی کوئی پیغام نہیں",
  "chat.you": "آپ",
  "chat.a11y.channel": "چینل {name}",
  "chat.a11y.group": "گروپ {name}",
  "chat.a11y.muted": "خاموش",
  "chat.a11y.pinned": "ٹنکا ہوا",

  // ---- Chats: start something new ----
  "chat.new.title": "کچھ نیا شروع کریں",
  "chat.new.channel": "نجی چینل بنائیں",
  "chat.new.channel_label": "نجی چینل",
  "chat.new.channel_desc":
    "ایک کمرہ جس میں ربط رکھنے والا کوئی بھی شامل ہو سکتا ہے۔ ایک بنائیں، یا جو ربط آپ کو بھیجا گیا اس سے شامل ہوں۔",
  "chat.new.group": "نجی گروپ بنائیں",
  "chat.new.group_label": "نجی گروپ",
  "chat.new.group_desc": "مخصوص لوگ چنیں۔ 16 تک۔ بلوٹوتھ پر ہی رہتا ہے۔",
  "chat.new.place": "geohash سے کسی جگہ جائیں",
  "chat.new.place_label": "کسی جگہ جائیں",
  "chat.new.place_desc": "کسی بھی جگہ کا مقامی چینل اس کے geohash سے کھولیں۔",
  "chat.new.reach": "رسائی",
  "chat.new.reach_internet": "ارکان تک بلوٹوتھ اور انٹرنیٹ سے پہنچتا ہے۔",
  "chat.new.reach_mesh": "بلوٹوتھ کی حدود میں کام کرتا ہے، انٹرنیٹ سے نہیں۔",
  "chat.new.reach_internet_desc":
    "ارکان تک انٹرنیٹ سے بھی پہنچتا ہے۔ ریلے دیکھ سکتے ہیں کہ چینل سرگرم ہے، مگر کبھی اس کے پیغام یا اس میں کون ہے یہ نہیں۔",
  "chat.new.reach_mesh_desc":
    "مقامی میش پر ہی رہتا ہے۔ سب سے نجی، کچھ بھی بلوٹوتھ کی حدود سے باہر نہیں جاتا۔",
  "chat.new.join_link": "دعوتی ربط سے نجی چینل میں شامل ہوں",
  "chat.new.back_to_chooser": "انتخاب پر واپس",
  "chat.new.create_channel": "چینل بنائیں",
  "chat.new.name_required": "پہلے چینل کا نام درج کریں",
  "chat.new.name_taken": "یہ نام پہلے ہی لیا جا چکا ہے",
  "chat.new.create": "بنائیں",
  "chat.new.e2ee": "سرے سے سرے تک خفیہ۔ پیغام صرف ارکان پڑھ سکتے ہیں۔",
  "chat.new.invite_only":
    "صرف دعوت پر۔ جس کسی سے آپ ربط شیئر کریں وہ شامل ہو سکتا ہے۔ باقی سب سے یہ چھپا رہتا ہے، قریبی پیئرز سے بھی۔",
  "chat.new.name_exists": "اس نام کا چینل پہلے سے موجود ہے۔",
  "chat.new.reach_bluetooth_chip": "صرف بلوٹوتھ",
  "chat.new.reach_internet_chip": "بلوٹوتھ + انٹرنیٹ",
  "chat.new.have_link": "دعوتی ربط سے شامل ہوں",

  // ---- Chats: join by link ----
  "chat.join.title": "ربط سے شامل ہوں",
  "chat.join.not_airhop": "یہ Airhop کا ربط نہیں۔",
  "chat.join.reach_internet": "ارکان تک بلوٹوتھ اور انٹرنیٹ سے پہنچتا ہے۔",
  "chat.join.reach_mesh": "بلوٹوتھ کی حدود میں رہتا ہے۔",
  "chat.join.contact_card":
    "ایک رابطہ کارڈ۔ انہیں آپ کے رابطوں میں شامل کر کے چیٹ کھول دیتا ہے۔",
  "chat.join.unverified": "اس ربط کی تصدیق نہ ہو سکی",
  "chat.join.unverified_body":
    "رابطہ کارڈ اپنی ہی کلیدوں سے میل نہیں کھاتا، اس لیے وہ شامل نہیں ہوا۔ ان سے نیا بھیجنے کو کہیں۔",
  "chat.join.paste": "کلپ بورڈ سے چسپاں کریں",
  "chat.join.join": "شامل ہوں",
  "chat.join.public_channel":
    "عوامی چینل {name}۔ قریب موجود کوئی بھی اسے پڑھ سکتا ہے۔",
  "chat.join.private_channel": "نجی چینل {name}۔ {reach}",
  "chat.join.dm_with": "{name} کے ساتھ براہ راست پیغام۔",
  "chat.join.joined_as": "{name} کے طور پر شامل ہوئے",
  "chat.join.name_clash_body":
    "آپ پہلے ہی ایک اور {name} میں ہیں۔ چینل کے نام محض عنوان ہوتے ہیں، سو اس دعوت نے اپنا الگ چینل کھولا ہے اور جس میں آپ تھے وہ اچھوتا ہے۔ آپ دونوں میں سے کسی کا نام اس کی چینل معلومات سے بدل سکتے ہیں۔",
  "chat.join.paste_hint":
    "airhop:// سے شروع ہونے والی دعوت چسپاں کریں۔ ربط چھونا بھی کام کرتا ہے؛ یہ اس ربط کے لیے ہے جسے آپ چھو نہیں سکتے۔",
  "chat.join.key_note":
    "نجی چینل کی دعوت کلید ساتھ لاتی ہے، سو شامل ہونا فوری ہے اور کسی اور سے کچھ نہیں پوچھا جاتا۔",
  "chat.join.offline_note":
    "آف لائن کام کرتا ہے۔ ربط اسی آلے پر پڑھا جاتا ہے، اور چینل اتنی ہی دور تک پہنچتا ہے جتنا اس کے بنانے والے نے طے کیا۔",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "وہ خانہ نہ کھل سکا۔ تھوڑی دیر میں دوبارہ کوشش کریں۔",
  "chat.jump.title": "کسی جگہ جائیں",
  "chat.jump.saved": "محفوظ جگہیں",
  "chat.jump.anywhere":
    "کسی بھی جگہ کا عوامی مقامی چینل کھولیں، اُس جگہ کا بھی جہاں آپ نہیں ہیں۔",
  "chat.jump.geohash_note":
    "اس کا geohash درج کریں۔ جن سب کا مقام اس خانے میں آتا ہے وہ یہ چینل بانٹتے ہیں۔",
  "chat.jump.teleport_note":
    "آپ منتقل شدہ کے طور پر نظر آتے ہیں، قریب موجود نہیں۔ یہ صرف انٹرنیٹ سے پہنچتا ہے۔",
  "chat.jump.level_cell": "{level} درجے کا خانہ",
  "chat.jump.already_here":
    "آپ پہلے ہی یہاں ہیں۔ جائیں آپ کا {name} چینل کھولے گا۔",
  "chat.jump.open_direction": "اپنے {direction} والا خانہ کھولیں",
  "chat.jump.open_place": "{name} کھولیں",
  "chat.jump.remove_place": "{name} کو محفوظ جگہوں سے ہٹائیں",
  "chat.jump.go": "جائیں",
  "chat.jump.how":
    "geohash ڈھونڈنے کے لیے: کوئی مقامی چینل کھولیں > اس کا نام چھوئیں > وہیں سے کاپی کریں۔",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "ہر رکن تک نہ پہنچا جا سکا۔ جب وہ قریب ہوں تو دوبارہ کوشش کریں۔",
  "chat.group.you_were_added": "آپ کو {name} میں شامل کیا گیا۔",
  "chat.group.added_you": "آپ کو {name} میں شامل کیا",
  "chat.group.you_were_removed":
    "آپ کو {name} سے نکال دیا گیا۔ اب آپ یہاں نہ پڑھ سکتے ہیں نہ پیغام بھیج سکتے ہیں۔",
  "chat.group.removed_you": "آپ کو {name} سے نکال دیا",
  "chat.group.add_failed": "انہیں شامل نہ کیا جا سکا",
  "chat.group.add_failed_body":
    "کچھ نہیں بدلا۔ یا تو ابھی ان تک رسائی نہیں، یا گروپ 16 پر بھر چکا ہے، یا آپ اس کے بنانے والے نہیں۔",
  "chat.group.remove_failed": "انہیں نکالا نہ جا سکا",
  "chat.group.remove_failed_body":
    "کچھ نہیں بدلا۔ گروپ میں کون ہو گا یہ صرف اس کا بنانے والا بدل سکتا ہے۔",
  "chat.group.e2ee": "سرے سے سرے تک خفیہ۔ پیغام صرف ارکان پڑھ سکتے ہیں۔",
  "chat.group.cap":
    "16 تک لوگ، آپ کے چنے ہوئے۔ کوئی دعوتی ربط نہیں، سو کوئی ربط آگے بھیجے جانے سے شامل نہیں ہوتا۔",
  "chat.group.bluetooth":
    "صرف بلوٹوتھ۔ حدود سے باہر موجود ارکان کو پیغام تب ملتے ہیں جب وہ لوٹ آئیں۔",
  "chat.group.members_label": "ارکان",
  "chat.group.none_in_range":
    "حدود میں کوئی نہیں۔ گروپ بناتے وقت ارکان کا قریب ہونا ضروری ہے۔",
  "chat.group.create_title": "گروپ بنائیں",
  "chat.group.name_placeholder": "گروپ کا نام",
  "chat.group.create": "بنائیں",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "مقامی میش · صرف بلوٹوتھ",
  "chat.scope.mesh_desc":
    "بلوٹوتھ کی حدود میں موجود آلات تک پہنچتا ہے (تقریباً 10 سے 100 میٹر)۔ انٹرنیٹ درکار نہیں۔ موقع پر ہم آہنگی کے لیے بہترین۔",
  "chat.scope.block": "شہری بلاک · تقریباً 100 میٹر",
  "chat.scope.block_desc":
    "ایک شہری بلاک جتنی رسائی۔ پیغام انٹرنیٹ سے پل کے ذریعے جاتے ہیں تاکہ بلوٹوتھ کی حدود سے ذرا باہر موجود پیئرز بھی شریک ہو سکیں۔",
  "chat.scope.neighborhood": "محلہ · تقریباً 1 کلومیٹر",
  "chat.scope.neighborhood_desc":
    "محلے کی سطح کی رسائی۔ ریلے کی مدد سے پورے علاقے کے پیئرز تک براہ راست بلوٹوتھ ربط کے بغیر بھی پہنچا جا سکتا ہے۔",
  "chat.scope.city": "شہر · تقریباً 10 کلومیٹر",
  "chat.scope.city_desc":
    "پورے شہر کا چینل۔ پورے شہری علاقے کے پیئرز تک پہنچنے کے لیے مقام سے جڑے انٹرنیٹ ریلے استعمال کرتا ہے۔",
  "chat.scope.province": "صوبہ · تقریباً 100 کلومیٹر",
  "chat.scope.province_desc":
    "صوبے کی سطح کی رسائی۔ سینکڑوں کلومیٹر تک علاقائی رسائی کے لیے انٹرنیٹ سے پل بنایا جاتا ہے۔",
  "chat.scope.country": "ملک یا خطہ · تقریباً 1000 کلومیٹر",
  "chat.scope.country_desc":
    "پورے ملک کی رسائی۔ خطے میں Airhop یا bitchat کا کوئی بھی صارف شامل ہو کر پیغام پڑھ سکتا ہے۔",
  "chat.transport.bluetooth": "صرف بلوٹوتھ",
  "chat.transport.both": "بلوٹوتھ + انٹرنیٹ",
  "chat.transport.internet": "صرف انٹرنیٹ",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "حکم /{cmd}: {hint}",
  "chat.cmd.hug_hint": "گرمجوش گلے مل بھیجیں",
  "chat.cmd.slap_hint": "بڑی مچھلی سے تھپڑ رسید کریں",
  "chat.status.sending": "بھیجا جا رہا ہے…",
  "chat.status.undo_send": "بھیجنا واپس لیں",
  "chat.status.undo": "واپس لیں",
  "chat.status.sent": "بھیج دیا گیا",
  "chat.status.received": "موصول",
  "chat.status.failed": "ناکام",
  "chat.status.canceled": "منسوخ",
  "chat.status.waiting": "انتظار میں",
  "chat.status.sending_short": "بھیجا جا رہا ہے",
  "chat.status.receiving": "موصول ہو رہا ہے",
  "chat.thread.not_available": "یہاں دستیاب نہیں",
  "chat.thread.private_channel": "نجی چینل",
  "chat.thread.location_channel": "مقامی چینل",
  "chat.thread.public_channel": "عوامی چینل",
  "chat.thread.notices": "اس چینل کے اعلانات",
  "chat.thread.invite": "اس چینل میں کسی کو مدعو کریں",
  "chat.thread.not_in_range":
    "بلوٹوتھ کی حدود میں نہیں۔ انٹرنیٹ سے پہنچایا جا رہا ہے۔",
  "chat.thread.not_nearby":
    "قریب نہیں۔ جب وہ حدود میں لوٹیں گے یا آن لائن ہوں گے تو ہم پہنچا دیں گے۔",
  "chat.thread.no_keys":
    "انہیں پیغام بھیجنے کے لیے آپ کا بلوٹوتھ کی حدود میں ہونا، یا ان کا کوڈ اسکین کرنا ضروری ہے۔",
  "chat.geo.card_received":
    "{name} نے اپنا رابطہ شیئر کیا۔ اپنا بھی شیئر کریں تاکہ آپ میں سے کسی کے جگہ بدلنے کے بعد بھی بات جاری رہے۔",
  "chat.geo.exchange_complete":
    "رابطوں کا تبادلہ ہو گیا۔ اب آپ ایک دوسرے تک کہیں سے بھی پہنچ سکتے ہیں۔",
  "chat.geo.keep_person": "اس شخص کو رکھیں",
  "chat.geo.keep_person_desc":
    "اپنا رابطہ شیئر کریں تاکہ آپ میں سے کسی کے جگہ بدلنے کے بعد بھی بات جاری رہے۔ انہیں آپ کی مستقل شناخت معلوم ہو جائے گی۔",
  "chat.geo.card_sent": "شیئر ہو گیا · ان کے جواب کا انتظار",
  "chat.thread.left_cell":
    "آپ اس علاقے سے نکل آئے ہیں، سو وہ یہاں آپ تک نہیں پہنچ سکتے۔ کہیں بھی بات جاری رکھنے کے لیے کوڈ بدلیں۔",
  "chat.thread.no_route":
    "ابھی ان تک نہیں پہنچا جا سکتا۔ راستہ دستیاب ہوتے ہی پیغام چلا جائے گا۔",
  "chat.thread.empty": "ابھی کوئی پیغام نہیں",
  "chat.thread.empty_desc": "خفیہ گفتگو شروع کریں۔",
  "chat.thread.jump_latest": "تازہ ترین پیغام پر جائیں",
  "chat.thread.back_to_members": "ارکان پر واپس",
  "chat.thread.nostr_key": "Nostr عوامی کلید",
  "chat.thread.in_range": "حدود میں",
  "chat.voice.not_recorded": "صوتی نوٹ ریکارڈ نہ ہوا",
  "chat.thread.message": "پیغام",
  "chat.thread.message_placeholder": "پیغام…",
  "chat.thread.length_full": "پیغام بھر گیا",
  "chat.thread.waiting_for": "{name} کے لوٹنے کا انتظار · {percent}%",
  "chat.thread.peer": "پیئر",
  "chat.thread.cancel_transfer": "{name} منسوخ کریں",
  "chat.thread.queued_more": "مزید {count} بھیجے جانے کے منتظر",
  "chat.thread.across_bridge": "پل کے پار {count}",
  "chat.thread.bridged": "پل سے گزرا",
  "chat.thread.invite_body":
    "Airhop پر {channel} میں میرے ساتھ شامل ہوں — نجی میش پیغام رسانی، پہلے آف لائن۔",
  "chat.thread.go_back_unread": "واپس جائیں، {count} غیر پڑھے",
  "chat.thread.view_info": "{name} کی معلومات دیکھیں",
  "chat.thread.notices_new": "اس چینل کے اعلانات، {count} نئے",
  "chat.thread.say_something": "{channel} میں کچھ کہیں۔",
  "chat.thread.jump_latest_new": "تازہ ترین پیغام پر جائیں، {count} نئے",
  "chat.thread.unconfirmed_since": "{date} سے کوئی پہنچنے کی تصدیق نہیں",
  "chat.thread.no_reach": "قریب کوئی پیئر نہیں · ابھی کسی کو یہ نہیں ملا",
  "chat.thread.channel_needs_internet":
    "انٹرنیٹ بند · یہ چینل صرف بلوٹوتھ کی حدود میں موجود لوگوں تک پہنچتا ہے",
  "chat.thread.cell_needs_internet":
    "انٹرنیٹ بند · اس خانے تک صرف انٹرنیٹ سے پہنچا جا سکتا ہے",
  "chat.thread.geo_dm_needs_internet":
    "انٹرنیٹ بند · یہ گفتگو صرف انٹرنیٹ سے چلتی ہے",
  "chat.thread.via_gateway":
    "انٹرنیٹ بند · قریب کا ایک آلہ یہ آپ کے لیے آن لائن لے جا رہا ہے",
  "chat.thread.group_queued":
    "اس گروپ کا ابھی کوئی قریب نہیں۔ جب ہوں گے تو یہ ان تک پہنچ جائے گا۔",
  "chat.thread.no_group_key":
    "آپ اب اس گروپ میں نہیں ہیں، سو یہ بھیجا نہیں جا سکتا",
  "chat.thread.no_reach_offline":
    "انٹرنیٹ بند اور قریب کوئی پیئر نہیں · ابھی کسی کو یہ نہیں ملا",
  "chat.thread.mention": "{name} کا ذکر کریں",
  "chat.thread.someone_talking": "{hold}۔ {name} بول رہے ہیں۔",
  "chat.thread.attach_note":
    "فائلیں صرف بلوٹوتھ کی حدود میں جاتی ہیں۔ متن اور ادائیگیاں انٹرنیٹ کے رابطوں تک پہنچتی ہیں؛ منسلکات نہیں۔",
  "chat.thread.message_peer": "{name} کو پیغام بھیجیں",
  "chat.thread.send": "پیغام بھیجیں",
  "chat.thread.group": "گروپ",
  "chat.bridge.nearby_only": "صرف قریب: یہ پیغام میش پل سے دور رکھیں",
  "chat.bridge.nearby_label": "صرف قریب · بلوٹوتھ پر ہی رہتا ہے",
  "chat.bridge.bridging_label":
    "قریبی علاقوں سے پل بنایا جا رہا ہے · صرف قریب کے لیے چھوئیں",
  "chat.screenshot.you_took": "آپ نے اسکرین تصویر لی",
  "chat.screenshot.you_took_private":
    "آپ نے اسکرین تصویر لی · کسی کو نہیں بتایا گیا",
  "chat.screenshot.heads_up": "خبردار",
  "chat.screenshot.notice": "* {name} نے اسکرین تصویر لی *",
  "chat.screenshot.notified_dm":
    "{name} کو بتا دیا گیا کہ آپ نے اس گفتگو کی اسکرین تصویر لی۔",
  "chat.screenshot.notified":
    "اس چینل میں سب کو بتا دیا گیا کہ آپ نے اسکرین تصویر لی۔",
  "chat.screenshot.not_notified":
    "کسی کو نہیں بتایا گیا۔ یہ چینل عوامی ہے، سو اسکرین تصویر کا اعلان یہ درج کر دیتا کہ آپ یہاں تھے۔",
  "chat.thread.error": "خرابی",
  "chat.thread.go_back": "واپس جائیں",
  "chat.bubble.via_bridge": "میش پل کے ذریعے",
  "chat.bubble.view_profile": "{name} کا پروفائل دیکھیں",
  "chat.bubble.forwarded": "آگے بھیجا گیا",
  "chat.bubble.attachment": "منسلکہ",
  "chat.bubble.a11y": "{sender}: {body}۔ مزید اختیارات کے لیے دبائے رکھیں۔",
  "chat.bubble.failed_retry": "بھیجنے میں ناکام۔ دوبارہ کوشش کے لیے چھوئیں۔",

  // ---- Chats: message actions and info ----
  "chat.info.title": "پیغام کی معلومات",
  "chat.info.delivered_to": "{name} تک پہنچا",
  "chat.info.read_by": "{name} نے پڑھا",
  "chat.info.group_reach_desc": "ابھی رسائی میں، یہ پہنچنے کی تصدیق نہیں",
  "chat.info.group_alone": "کوئی اور رکن نہیں",
  "chat.info.today_at": "آج {time}",
  "chat.info.sending": "بھیجا جا رہا ہے…",
  "chat.info.failed": "بھیجنے میں ناکام",
  "chat.info.courier": "ایک دوست لے گیا",
  "chat.info.sent": "بھیج دیا گیا",
  "chat.info.queued": "بھیجے جانے کا منتظر",
  "chat.info.waiting": "انتظار…",
  "chat.action.info": "پیغام کی معلومات",
  "chat.action.save_photos": "تصاویر میں محفوظ کریں",
  "chat.action.save_copy": "ایک نقل محفوظ کریں",
  "chat.action.forward": "آگے بھیجیں",
  "chat.action.select": "منتخب کریں",
  "chat.select.cancel": "انتخاب منسوخ کریں",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "کیمرا",
  "chat.attach.camera_desc": "تصویر یا ویڈیو بنائیں",
  "chat.attach.library": "تصاویر کی گیلری",
  "chat.attach.library_desc": "اپنی گیلری سے چنیں",
  "chat.attach.document": "دستاویز",
  "chat.attach.document_desc": "کوئی بھی فائل یا PDF بھیجیں",
  "chat.attach.voice": "صوتی نوٹ",
  "chat.attach.voice_desc": "صوتی پیغام ریکارڈ کر کے بھیجیں",
  "chat.attach.ecash": "ecash بھیجیں",
  "chat.attach.ecash_desc": "اپنے بٹوے سے Cashu کے sat بھیجیں",
  "chat.attach.location": "مقام",
  "chat.attach.location_desc": "بھیجیں کہ آپ اس وقت کہاں ہیں",
  "chat.attach.title": "منسلک کریں",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "ایک مقام شیئر کیا",
  "chat.location.received_summary": "اپنا مقام شیئر کیا",
  "chat.location.title": "مقام",
  "chat.location.away": "{distance} {direction} کی جانب",
  "chat.location.taken": "{ago} پہلے لیا گیا",
  "chat.location.open_maps": "نقشوں میں کھولیں",
  "chat.location.no_forward": "مقام آگے نہیں بھیجے جاتے",
  "chat.location.no_forward_body":
    "مقام ایک ہی شخص کو بھیجا جاتا ہے۔ اگر آپ چاہتے ہیں کہ وہ کسی اور کے پاس ہو تو اپنا مقام شیئر کریں۔",
  "chat.location.no_fix": "یہ کتنی دور ہے یہ دیکھنے کے لیے مقام کی اجازت دیں",
  "chat.location.send_title": "اپنا مقام بھیجیں",
  "chat.location.send_body":
    "{name} کو ایک نقطہ نظر آئے گا: آپ اس وقت کہاں ہیں۔ یہ آگے تازہ ہوتا نہیں رہتا۔",
  "chat.location.send": "مقام بھیجیں",
  "chat.location.finding": "آپ کا مقام ڈھونڈا جا رہا ہے…",
  "chat.location.no_location": "آپ کا مقام معلوم نہ ہو سکا",
  "chat.location.no_location_body":
    "مقام تک رسائی کی اجازت دیں اور یقینی بنائیں کہ مقام کی سروسز چالو ہیں، پھر دوبارہ کوشش کریں۔",
  "chat.location.not_delivered": "آپ کا مقام نہ بھیجا جا سکا",
  "chat.location.not_delivered_body":
    "مقام تبھی بھیجنے کے قابل ہے جب وہ تازہ ہو، سو اسے بعد کے لیے قطار میں نہیں رکھا جاتا۔ جب {name} تک رسائی ہو تو دوبارہ کوشش کریں۔",
  "chat.location.direction.n": "شمال",
  "chat.location.direction.ne": "شمال مشرق",
  "chat.location.direction.e": "مشرق",
  "chat.location.direction.se": "جنوب مشرق",
  "chat.location.direction.s": "جنوب",
  "chat.location.direction.sw": "جنوب مغرب",
  "chat.location.direction.w": "مغرب",
  "chat.location.direction.nw": "شمال مغرب",
  "chat.attach.send_anyway": "پھر بھی بھیجیں",
  "chat.attach.bitchat_too_big": "شاید یہ نہ پہنچے",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat پر ہیں، جو بڑی فائل پر آدھے راستے ہار مان جاتا ہے۔ تقریباً 350 KiB سے کم قابل بھروسا ہے۔ Airhop کے رابطے کو بھیجنے پر ایسی کوئی حد نہیں۔",
  "chat.attach.bitchat_unopenable": "شاید وہ اسے کھول نہ سکیں",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat پر ہیں، جو تصاویر اور صوتی نوٹ دکھاتا ہے مگر باقی سب کو ایسی فائل کے طور پر گنتا ہے جسے وہ کھول نہیں سکتا۔ یہ پہنچ جائے گا، بس شاید وہ اسے دیکھ نہ سکیں۔",
  "chat.attach.file": "فائل منسلک کریں",
  "chat.attach.unavailable": "یہاں منسلکات دستیاب نہیں",
  "chat.attach.not_sent": "منسلکہ نہ بھیجا گیا",
  "chat.attach.read_failed":
    "وہ فائل پڑھنے میں کچھ غلط ہو گیا۔ کوئی اور آزمائیں۔",
  "chat.attach.caption": "عنوان لکھیں…",
  "chat.attach.send": "منسلکہ بھیجیں",
  "chat.attach.generic": "منسلکہ",
  "chat.media.view_full": "تصویر پوری اسکرین پر دیکھیں",
  "chat.media.gone_photo": "تصویر اس آلے پر نہیں",
  "chat.media.gone_video": "ویڈیو اس آلے پر نہیں",
  "chat.media.gone_voice": "صوتی نوٹ اس آلے پر نہیں",
  "chat.media.gone_file": "فائل اس آلے پر نہیں",
  "chat.media.gone_note": "7 دن بعد یا کیش صاف ہونے پر ہٹا دیا گیا",
  "chat.media.ask_resend": "دوبارہ کہیں",
  "chat.media.resend_draft": "کیا آپ {kind} دوبارہ بھیج سکتے ہیں؟",
  "chat.media.kind_photo": "وہ تصویر",
  "chat.media.kind_video": "وہ ویڈیو",
  "chat.media.kind_voice": "وہ صوتی نوٹ",
  "chat.media.kind_file": "وہ فائل",
  "chat.media.pause_voice": "صوتی نوٹ روکیں",
  "chat.media.play_voice": "صوتی نوٹ چلائیں",
  "chat.media.voice_position": "صوتی نوٹ میں جگہ",
  "chat.media.voice_scrub": "اس مقام پر جانے کے لیے لکیروں کے ساتھ چھوئیں",
  "chat.media.image": "تصویر",
  "chat.media.tap_load_photo": "تصویر لادنے کے لیے چھوئیں",
  "chat.media.open_document": "{name} کھولیں",
  "chat.media.document": "دستاویز",
  "chat.media.tap_load_video": "ویڈیو لادنے کے لیے چھوئیں",
  "chat.media.video": "ویڈیو",
  "chat.media.photo": "تصویر",
  "chat.media.close_photo": "تصویر بند کریں",
  "chat.media.save_photo": "تصویر اپنی تصاویر میں محفوظ کریں",
  "chat.media.share_photo": "تصویر شیئر کریں",
  "chat.media.saved_videos": "آپ کی ویڈیوز میں محفوظ ہو گئی",
  "chat.media.saved_photos": "آپ کی تصاویر میں محفوظ ہو گئی",
  "chat.media.not_saved": "محفوظ نہیں ہوئی",
  "chat.media.cant_open": "فائل نہیں کھل سکتی",
  "chat.media.no_app":
    "اس آلے پر کوئی ایسی ایپ نہیں جو یہ فائل کھول یا شیئر کر سکے۔",
  "chat.media.open_failed":
    "فائل نہ کھل سکی۔ ہو سکتا ہے وہ کیش سے صاف ہو گئی ہو۔",
  "media.blocked.nostr_only":
    "آپ اس شخص کو صرف ایک ریلے کے ذریعے جانتے ہیں۔ صرف متن دستیاب ہے۔ تصاویر، فائلوں اور صوتی نوٹوں کے لیے بلوٹوتھ درکار ہے۔",
  "media.blocked.private_channel":
    "نشریاتی منسلکہ پر دستخط ہوتے ہیں مگر وہ خفیہ نہیں ہوتا، اس لیے اسے نجی چینل میں بھیجنا اسے کھلا چھوڑ دیتا جبکہ یہاں کا متن خفیہ ہی رہتا ہے۔",
  "media.blocked.private_group":
    "نشریاتی منسلکہ پر دستخط ہوتے ہیں مگر وہ خفیہ نہیں ہوتا، اس لیے اسے نجی گروپ میں بھیجنا اسے کھلا چھوڑ دیتا جبکہ یہاں کا متن خفیہ ہی رہتا ہے۔",
  "media.blocked.location_channel":
    "مقامی چینل لوگوں تک انٹرنیٹ سے پہنچتا ہے، اور تصاویر، فائلیں اور صوتی نوٹ بلوٹوتھ سے سفر کرتے ہیں، اس لیے وہ کبھی نہ پہنچتے۔",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "یہاں صوتی نوٹ دستیاب نہیں",
  "chat.voice.hold_live": "براہ راست بولنے کے لیے دبائے رکھیں",
  "chat.voice.hold_record": "صوتی نوٹ ریکارڈ کرنے کے لیے دبائے رکھیں",
  "chat.voice.cancel_recording": "ریکارڈنگ منسوخ کریں",
  "chat.voice.slide_cancel": "منسوخ کرنے کے لیے سرکائیں",
  "chat.voice.release_cancel": "منسوخ کرنے کے لیے چھوڑ دیں",
  "chat.voice.a11y_toggle": "بولنا شروع یا بند کرنے کے لیے دو بار چھوئیں۔",
  "chat.voice.limit_reached": "دو منٹ کی حد آ گئی، بھیجنے کے لیے چھوڑ دیں",
  "chat.voice.limit_sent": "دو منٹ کی حد آ گئی، نوٹ بھیج دیا گیا",
  "chat.voice.stop_send": "ریکارڈنگ روکیں اور بھیجیں",
  "chat.voice.lift_lock": "ہاتھ آزاد ریکارڈنگ کے لیے اوپر سرکائیں",
  "chat.voice.live_speaking": "{name} بول رہے ہیں",
  "voice.unavailable": "براہ راست آواز دستیاب نہیں",
  "voice.recording_stopped": "ریکارڈنگ روک دی گئی",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "کیمرے تک رسائی",
  "chat.perm.camera_purpose": "بھیجنے کے لیے تصویر بنانا",
  "chat.perm.photo_label": "تصاویر تک رسائی",
  "chat.perm.photo_purpose": "بھیجنے کے لیے تصویر یا ویڈیو چننا",
  "chat.perm.photo_save_purpose": "اسے آپ کی تصاویر میں محفوظ کرنا",
  "chat.perm.mic_label": "مائیکروفون تک رسائی",
  "chat.perm.mic_live_purpose": "قریبی لوگوں سے بات کرنا",
  "chat.perm.mic_note_purpose": "صوتی نوٹ ریکارڈ کرنا",
  "chat.perm.recording_stopped": "ریکارڈنگ روک دی گئی",
  "chat.perm.record_failed":
    "ریکارڈنگ شروع نہ ہو سکی۔ مائیکروفون کی اجازتیں جانچیں۔",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "لے لیا",
  "chat.ecash.reclaimed": "واپس لیا گیا",
  "chat.ecash.claiming": "لیا جا رہا ہے…",
  "chat.ecash.claim": "لیں",
  "chat.ecash.claim_amount": "{amount} {unit} لیں",
  "chat.ecash.already_claimed": "پہلے ہی لے لیا",
  "chat.ecash.already_claimed_body":
    "اس ٹوکن کا ہر ثبوت پہلے ہی آپ کے بٹوے میں ہے، اس لیے کچھ شامل نہیں ہوا۔",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "حسب استطاعت پہنچانے کے لیے میش کے سپرد",
  "chat.info.queued_desc": "اس فون پر رکھا ہوا جب تک ان تک کوئی راستہ نہ ہو",
  "chat.info.reclaimed": "واپس لیا گیا",
  "chat.info.reclaimed_desc":
    "آپ نے یہ ادائیگی اپنے بٹوے میں واپس لے لی، سو یہ نہیں پہنچائی جائے گی",
  "chat.info.about": "تعارف",
  "chat.info.group_desc":
    "ایک نجی گروپ۔ اسے صرف وہی ارکان پڑھ سکتے ہیں جو بنانے والے نے شامل کیے، اور یہ بلوٹوتھ پر ہی رہتا ہے۔",
  "chat.info.teleported_desc":
    "اس geohash خانے کا عوامی مقامی چینل۔ اس خانے میں موجود ہر شخص، چاہے Airhop پر ہو یا bitchat پر، اسے انٹرنیٹ سے بانٹتا ہے۔ آپ منتقل شدہ ہیں، جسمانی طور پر یہاں نہیں۔",
  "chat.info.custom_desc":
    "اپنا بنایا ہوا چینل۔ نام جاننے والا کوئی بھی Airhop یا bitchat والے کسی بھی آلے سے شامل ہو سکتا ہے۔",
  "chat.info.private_e2ee": "نجی · سرے سے سرے تک خفیہ",
  "chat.info.public_plain": "عوامی · غیر خفیہ",
  "chat.info.group_privacy":
    "اس گروپ کو صرف نیچے دکھائے گئے ارکان پڑھ سکتے ہیں۔ پیغام بلوٹوتھ پر ہی رہتے ہیں، سو حدود سے باہر موجود ارکان کو وہ لوٹنے پر ملتے ہیں۔",
  "chat.info.teleport_privacy":
    "ایک جگہ جہاں آپ منتقل ہوئے۔ یہ اس خانے کے سب لوگوں تک انٹرنیٹ سے پہنچتا ہے، اور بلوٹوتھ کی حدود میں کسی تک نہیں۔",
  "chat.info.location_off_privacy":
    "مقام بند ہے، سو یہ چینل قریبی آلات تک صرف بلوٹوتھ سے پہنچتا ہے۔ اس کے علاقے کے خانے تک انٹرنیٹ سے پہنچنے کے لیے مقام چالو کریں۔",
  "chat.info.invite_privacy":
    "اسے صرف وہی لوگ پڑھ سکتے ہیں جنہیں آپ ربط سے مدعو کریں۔ باقی سب سے یہ چھپا رہتا ہے، قریبی پیئرز سے بھی۔",
  "chat.info.public_privacy":
    "جو بھی شامل ہو وہ ہر پیغام پڑھ سکتا ہے۔ نجی گفتگو کے لیے براہ راست پیغام استعمال کریں؛ براہ راست پیغام سرے سے سرے تک خفیہ ہوتے ہیں۔",
  "chat.info.remove_member": "رکن نکالیں",
  "chat.info.remove_member_body":
    "{name} کو گروپ سے نکالیں؟ گروپ کی کلید بدل جاتی ہے، سو وہ نئے پیغام نہیں پڑھ سکیں گے۔",
  "chat.info.message_member": "{name} کو پیغام بھیجیں",
  "chat.info.remove_member_a11y": "{name} نکالیں",
  "chat.info.no_addable":
    "شامل کرنے کو کوئی قابل رسائی پیئر نہیں۔ ارکان کا قریب ہونا ضروری ہے۔",
  "chat.info.add_count": "{count} شامل کریں",
  "chat.info.teleported_tag": "{level}  ·  منتقل شدہ",
  "chat.info.active": "سرگرم",
  "chat.info.members": "ارکان",
  "chat.info.bookmark": "اس جگہ کو نشان زد کریں",
  "chat.info.remove_bookmark": "نشان ہٹائیں",
  "chat.info.default_notice":
    "طے شدہ چینل چھوڑے نہیں جا سکتے۔ وہ Airhop کے میش پروٹوکول کا حصہ ہیں۔",
  "chat.info.custom_channel": "اپنا بنایا ہوا چینل",
  "chat.info.geohash": "geohash",
  "chat.info.copy_geohash": "geohash کاپی کریں",
  "chat.info.relays": "ریلے",
  "chat.info.show_relays": "وہ ریلے دکھائیں جو یہ چینل لے جا رہے ہیں",
  "chat.info.relay_custom": "اپنا",
  "chat.info.relays_none": "کوئی نہیں۔ یہ خانہ ابھی صرف بلوٹوتھ پر ہے۔",
  "chat.info.search_members": "ارکان تلاش کریں",
  "chat.info.search_members_placeholder": "ارکان تلاش کریں…",
  "chat.info.teleported": "منتقل شدہ",
  "chat.info.creator": "بنانے والا",
  "chat.info.no_matches": "کوئی مماثلت نہیں",
  "chat.info.no_one_here": "ابھی یہاں کوئی نہیں",
  "chat.info.add_members": "ارکان شامل کریں",
  "chat.info.add_selected": "منتخب ارکان شامل کریں",
  "chat.info.add": "شامل کریں",
  "chat.info.leave_group": "گروپ چھوڑیں",
  "chat.info.leave_channel": "چینل چھوڑیں",
  "chat.info.leave": "چھوڑیں",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} سے بات چیت",
  "chat.contact.verified_since": "{date} سے تصدیق شدہ",
  "chat.contact.anonymous": "گمنام",
  "chat.contact.anonymous_desc":
    "geohash کا فرضی نام، جس کی تصدیق کے لیے کوئی پائیدار شناخت نہیں",
  "chat.contact.verified": "تصدیق شدہ",
  "chat.contact.verified_desc": "آپ نے ان کا QR کوڈ اسکین کیا",
  "chat.contact.verified_desc_compared": "آپ نے کوڈ کا موازنہ کیا",
  "chat.contact.not_verified": "تصدیق نہیں ہوئی",
  "chat.contact.not_verified_desc":
    "یہ تصدیق کرنے کے لیے کہ یہ واقعی وہی ہیں، ان کا کوڈ اسکین کریں یا کال پر کسی کوڈ کا موازنہ کریں",
  "chat.contact.e2ee": "سرے سے سرے تک خفیہ",
  "chat.contact.e2ee_nostr":
    "NIP-17 کے مطابق لپٹا ہوا، سو ریلے اسے پڑھ نہیں سکتے",
  "chat.contact.e2ee_mesh":
    "Noise XX، اور Airhop والے آلات کے درمیان Double Ratchet",
  "chat.contact.copy_nostr": "Nostr عوامی کلید کاپی کریں",
  "chat.contact.nostr_key": "Nostr عوامی کلید",
  "chat.contact.cell_key_note":
    "یہ کلید اُس علاقے کی ہے جہاں آپ ملے۔ آپ میں سے کوئی جگہ بدلے تو یہ بدل جاتی ہے، اور اسی کے ساتھ گفتگو ختم ہو جاتی ہے۔ کہیں بھی بات جاری رکھنے کے لیے رابطوں کا تبادلہ کریں۔",
  "chat.contact.peer_name": "پیئر کا نام",
  "chat.contact.peer_id": "پیئر شناخت",
  "chat.contact.rename": "نام بدلیں",
  "chat.contact.rename_needs_contact":
    "آپ ان لوگوں کا نام بدل سکتے ہیں جن کی کلیدیں آپ کے پاس ہوں۔ پہلے رابطہ کارڈ کا تبادلہ کریں، پھر یہ ایسا نام بن جاتا ہے جو صرف آپ دیکھتے ہیں۔",
  "chat.contact.rename_needs_keys":
    "اس رابطے کی ابھی کوئی کلید نہیں۔ انہیں پیغام بھیجیں، یا ان کا کوڈ اسکین کریں، پھر آپ انہیں ایسا نام دے سکیں گے جو صرف آپ دیکھیں۔",
  "chat.contact.renamed_by_you": "ان کے لیے آپ کا رکھا نام",
  "chat.contact.copy_peer_id": "پیئر شناخت کاپی کریں",
  "chat.contact.verify": "رابطے کی تصدیق کریں",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "اعلانات",
  "chat.notices.post_area": "اس علاقے میں اعلان لگائیں",
  "chat.notices.post_mesh": "میش پر اعلان لگائیں",
  "chat.notices.mark_urgent": "فوری نشان زد کریں",
  "chat.notices.post": "اعلان لگائیں",
  "chat.notices.post_short": "لگائیں",
  "chat.notices.delete": "اعلان حذف کریں",
  "chat.notices.just_now": "ابھی ابھی",
  "chat.notices.fades_soon": "جلد مٹ جائے گا",
  "chat.notices.1_day": "1 دن",
  "chat.notices.3_days": "3 دن",
  "chat.notices.7_days": "7 دن",
  "chat.notices.fading": "مٹ رہا ہے",
  "chat.notices.fades_in_hours": "{count} گھنٹے میں مٹ جائے گا",
  "chat.notices.fades_in_days": "{count} دن میں مٹ جائے گا",
  "chat.notices.scope_geo": "جیو",
  "chat.notices.scope_mesh": "میش",
  "chat.notices.urgent_short": "فوری",
  "chat.notices.permanent_warning":
    "کبھی نہیں مٹتا۔ عوامی ہے اور اسی علاقے سے بندھا ہوا، اور آپ اسے واپس نہیں لے سکتے۔",
  "chat.notices.none":
    "ابھی کوئی اعلان نہیں۔ ایک لگائیں تاکہ وہ دوسروں کے لیے یہاں رہے۔",

  // ---- Chats: search results ----
  "chat.search.photos": "تصاویر",
  "chat.search.videos": "ویڈیوز",
  "chat.search.audio": "آڈیو",
  "chat.search.documents": "دستاویزات",
  "chat.search.links": "ربط",
  "chat.search.ecash": "ecash",
  "chat.search.filter_by": "{filter} سے چھانیں",
  "chat.search.no_matches": "”{query}“ سے میل کھاتا کوئی {filter} نہیں",
  "chat.search.no_media": "ابھی کوئی {filter} نہیں",
  "chat.search.result_a11y": "{chat}، {sender} کی طرف سے {kind}",
  "chat.search.you": "آپ",
  "chat.search.section_chats": "چیٹس",
  "chat.search.section_messages": "پیغامات",
  "chat.search.section_notices": "اعلانات",
  "chat.search.hint":
    "پیغامات اور چیٹس میں تلاش کریں، یا اوپر سے کوئی چھانٹی چنیں۔",
  "chat.search.no_results": "”{query}“ کا کوئی نتیجہ نہیں",
  "chat.search.open_chat": "{name} کھولیں",
  "chat.search.message_a11y": "{chat}، {sender} کا پیغام: {snippet}",
  "chat.search.notice_a11y": "{chat} میں {author} کا اعلان: {snippet}",
  "chat.search.urgent": "فوری ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "اس فہرست میں {count} ہیں۔ صاف کرنے سے یہ صرف یہاں سے ہٹتے ہیں، اور پیغام اپنی گفتگو میں غیر پڑھے ہی رہتے ہیں۔ سب کو پڑھا ہوا نشان زد کرنے سے دونوں صاف ہو جاتے ہیں۔",
  "chat.notif.mark_all_read": "سب کو پڑھا ہوا نشان زد کریں",
  "chat.notif.clear_list": "فہرست صاف کریں",
  "chat.notif.clear_all_a11y": "تمام {count} اطلاعات صاف کریں",
  "chat.notif.title": "اطلاعات",
  "chat.notif.clear_short": "صاف کریں",
  "chat.notif.close": "اطلاعات بند کریں",
  "chat.notif.none": "ابھی کوئی اطلاع نہیں",
  "chat.notif.none_desc":
    "آپ کے چینلوں اور چیٹس کے پیغام، ذکر اور اعلان یہاں نظر آتے ہیں۔",
  "chat.notif.new": "نیا",
  "chat.notif.notice_in": "{channel} میں اعلان",

  // ---- Chats: forward ----
  "chat.forward.title": "آگے بھیجیں…",
  "chat.forward.to": "{name} کو آگے بھیجیں",
  "chat.forward.cant_send_here": "یہاں آگے نہیں بھیجا جا سکتا",
  "chat.forward.cant_send_to": "{name} کو آگے نہیں بھیجا جا سکتا",
  "chat.forward.channels": "چینل",
  "chat.forward.groups": "گروپ",
  "chat.forward.locations": "مقامات",
  "chat.forward.dms": "براہ راست پیغامات",
  "chat.forward.none": "ابھی کوئی اور چیٹ نہیں",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "میش شروع ہو رہی ہے…",
  "mesh.banner.no_bluetooth": "اس آلے پر بلوٹوتھ نہیں · صرف انٹرنیٹ",
  "mesh.banner.bluetooth_off": "بلوٹوتھ بند · میش دستیاب نہیں",
  "mesh.banner.permission_needed": "بلوٹوتھ کی اجازت درکار ہے",
  "mesh.banner.blocked": "بلوٹوتھ مسدود · ترتیبات میں اس کی اجازت دیں",
  "mesh.banner.location_permission": "پیئرز ڈھونڈنے کے لیے مقام درکار ہے",
  "mesh.banner.advertising_unsupported":
    "یہ فون دوسروں کو دیکھ سکتا ہے مگر خود دریافت نہیں ہو سکتا",
  "mesh.banner.location_off_android":
    "مقام بند · Android کو پیئرز ڈھونڈنے کے لیے یہ درکار ہے",
  "mesh.banner.paused": "میش موقوف · آپ موجود نہیں",
  "mesh.banner.location_off": "مقام بند · مقامی چینل دستیاب نہیں",
  "mesh.banner.battery_saver": "بیٹری بچت · کم بار تلاش کر رہا ہے",
  "mesh.banner.wipe_incomplete":
    "صفائی ادھوری · کچھ ڈیٹا رہ سکتا ہے، دوبارہ کھولنے پر پھر کوشش ہو گی",
  "mesh.banner.wifi_off": "وائی فائی بند · بڑی فائلیں سست بھیجی جائیں گی",
  "mesh.banner.clock_skew":
    "اس فون کی گھڑی غلط ہے · تاریخ اور وقت خودکار پر رکھیں",
  "mesh.banner.internet_off": "انٹرنیٹ بند · صرف بلوٹوتھ",
  "mesh.banner.relaying":
    "قریب کوئی پیئر نہیں · Nostr کے ذریعے پہنچایا جا رہا ہے",
  "mesh.banner.tor": "Tor چالو · انٹرنیٹ ٹریفک کا رخ بدلا جا رہا ہے",
  "mesh.banner.tor_starting": "Tor شروع ہو رہا ہے · جڑ رہا ہے",
  "mesh.banner.tor_blocked": "Tor جڑ نہیں سکا · میش پھر بھی کام کر رہی ہے",
  "mesh.banner.gateway":
    "انٹرنیٹ گیٹ وے چالو · قریبی پیئرز کے لیے پہنچایا جا رہا ہے",
  "mesh.banner.bridge": "میش پل چالو · عوامی چیٹ جڑ گئی",
  "mesh.banner.background_limits":
    "{brand} پس منظر میں میش کو موقوف کر سکتا ہے",
  "mesh.banner.bridge_across": "میش پل چالو · پل کے پار {count}",
  "mesh.banner.action.turn_on": "چالو کریں",
  "mesh.banner.action.allow": "اجازت دیں",
  "mesh.banner.action.resume": "جاری رکھیں",
  "mesh.banner.action.fix": "درست کریں",
  "mesh.banner.hint.resume": "بلوٹوتھ کی تشہیر اور تلاش دوبارہ چالو کرتا ہے",
  "mesh.banner.hint.enable_bluetooth":
    "Android سے بلوٹوتھ چالو کرنے کو کہتا ہے",
  "mesh.banner.hint.location_settings": "نظام کی مقام ترتیبات کھولتا ہے",
  "mesh.banner.hint.app_settings":
    "نظام کی ترتیبات میں Airhop کی اجازتیں کھولتا ہے",
  "mesh.banner.hint.battery_settings":
    "اس فون کی پس منظر سرگرمی کی ترتیبات کھولتا ہے",
  "mesh.banner.dismiss": "برخاست کریں: {label}",
  "mesh.banner.hint.dismiss": "اس نوٹ کو ہمیشہ کے لیے چھپا دیتا ہے",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "قریبی پیئرز تلاش کیے جا رہے ہیں…",
  "mesh.radar.starting": "میش شروع ہو رہی ہے…",
  "mesh.radar.no_bluetooth": "اس آلے پر بلوٹوتھ نہیں",
  "mesh.radar.bluetooth_off": "بلوٹوتھ بند · تلاش نہیں کر رہا",
  "mesh.radar.permission_needed": "بلوٹوتھ کی اجازت درکار ہے",
  "mesh.radar.blocked": "بلوٹوتھ مسدود",
  "mesh.radar.location_permission": "مقام کی اجازت درکار ہے",
  "mesh.radar.location_off": "مقام بند · تلاش نہیں کر رہا",
  "mesh.radar.hint_rings": "حلقے BLE سگنل کی قوت دکھاتے ہیں، فاصلہ نہیں",
  "mesh.radar.hint_checking": "بلوٹوتھ اور اجازتیں جانچی جا رہی ہیں",
  "mesh.radar.hint_internet": "پیغامات پھر بھی انٹرنیٹ سے سفر کرتے ہیں",
  "mesh.radar.hint_turn_on": "پیئرز دریافت کرنے کے لیے بلوٹوتھ چالو کریں",
  "mesh.radar.hint_allow": "پیئرز دریافت کرنے کے لیے بلوٹوتھ کی اجازت دیں",
  "mesh.radar.hint_allow_settings":
    "پیئرز دریافت کرنے کے لیے ترتیبات میں بلوٹوتھ کی اجازت دیں",
  "mesh.radar.hint_location_permission":
    "Android 11 اور اس سے پرانے کو بلوٹوتھ سے تلاش کے لیے مقام درکار ہوتا ہے",
  "mesh.radar.hint_android_location":
    "بلوٹوتھ تلاش کے نتائج دینے کے لیے Android کو مقام چالو چاہیے",
  "mesh.radar.signal_strong": "مضبوط",
  "mesh.radar.signal_medium": "درمیانہ",
  "mesh.radar.signal_weak": "کمزور",
  "mesh.radar.you_center": "آپ، میش کے مرکز میں",
  "mesh.radar.sonar_hint":
    "سونار کی جھاڑو چلاتا ہے۔ تلاش تو پہلے ہی مسلسل جاری ہے۔",
  "mesh.radar.paused": "میش موقوف · آپ موجود نہیں",
  "mesh.radar.ring_hint": "حلقے پر جگہ سگنل کی قوت ظاہر کرتی ہے، فاصلہ نہیں",
  "mesh.radar.set_online":
    "پیئرز دریافت کرنے کے لیے آپ ٹیب میں اپنی حالت آن لائن کریں",
  "mesh.radar.in_range": "حدود میں",
  "mesh.radar.recently_seen": "حال ہی میں دیکھے گئے",
  "mesh.radar.peer_hint":
    "اس پیئر کو پیغام بھیجنے یا ادائیگی کے اختیارات کھولتا ہے",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "ابھی ابھی",
  "mesh.peer.none": "قریب کوئی پیئر نہیں",
  "mesh.peer.none_desc":
    "بلوٹوتھ کی حدود میں موجود Airhop یا bitchat والے دوسرے آلات یہاں نظر آتے ہیں۔",
  "mesh.peer.id_copied": "پیئر شناخت کاپی ہو گئی",
  "mesh.peer.copy_id": "پیئر شناخت کاپی کریں",
  "mesh.peer.their_name": "خود کو {name} کہتے ہیں",
  "mesh.peer.in_range": "حدود میں",
  "mesh.peer.relay": "ریلے نوڈ",
  "mesh.peer.relay_body":
    "ایک ریڈیو جسے کسی نے میش پھیلانے کے لیے چالو چھوڑ دیا۔ یہ ایسے پیغام لے جاتا ہے جنہیں خود پڑھ نہیں سکتا۔ یہاں پیغام بھیجنے کو کوئی نہیں۔",
  "mesh.peer.send_dm": "براہ راست پیغام بھیجیں",
  "mesh.peer.message": "پیغام",
  "mesh.peer.send_sats": "ecash بھیجیں",
  "mesh.peer.amount_placeholder": "sat میں رقم",
  "mesh.peer.amount_first": "ecash بھیجیں، پہلے رقم درج کریں",
  "mesh.peer.cancel_send": "ecash بھیجنا منسوخ کریں",
  "mesh.peer.view_peer": "پیئر {name} دیکھیں",
  "mesh.peer.view_peer_online": "پیئر {name} دیکھیں، آن لائن",
  "mesh.peer.last_seen": "آخری بار {ago} پہلے دیکھا گیا",
  "mesh.peer.send_amount": "{amount} sat بھیجیں",
  "mesh.peer.direct": "براہ راست تعلق",
  "mesh.peer.check_distance": "فاصلہ جانچیں",
  "mesh.peer.checking": "جانچا جا رہا ہے",
  "mesh.peer.no_reply": "کوئی جواب نہیں",
  "mesh.peer.no_reply_hint":
    "شاید وہ ہٹ گئے ہوں، یا ان کی ایپ جواب نہ دے رہی ہو",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "خطہ",
  "mesh.level.province": "صوبہ",
  "mesh.level.city": "شہر",
  "mesh.level.neighborhood": "محلہ",
  "mesh.level.block": "شہری بلاک",
  "mesh.level.building": "عمارت",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "خرچ کے قابل",
  "wallet.balance.unit_hint": "satoshi اور bitcoin کے درمیان بدلتا ہے",
  "wallet.balance.a11y": "بیلنس {value} {unit}",
  "wallet.balance.locked":
    "بٹوے کا ذخیرہ مقفل ہے۔ ecash کے ثبوت ایک خفیہ فائل میں رکھے جاتے ہیں جس کی کلید آلے کی کلید زنجیر میں رہتی ہے، اور وہ فائل نہ کھل سکی۔ اپنا آلہ کھولیں اور Airhop دوبارہ کھولیں۔",
  "wallet.balance.tor_blocked":
    "Tor چالو ہے، اس لیے ٹکسال کی درخواستیں مسدود ہیں: وہ کھلے نیٹ سے جاتیں اور آپ کا IP آپ کے ثبوتوں سے جوڑ دیتیں۔ میش پر بھیجنا اور وصول کرنا پھر بھی کام کرتا ہے۔ ترتیبات، تحفظ کے تحت ٹکسال کی ٹریفک کی اجازت دیں۔",
  "wallet.balance.unconfirmed_note": "{amount} ابھی ٹکسال سے تصدیق شدہ نہیں",
  "wallet.balance.reserved_note":
    "{amount} راستے میں موجود ایک ترسیل کے لیے مختص",
  "wallet.balance.other_mint_note": "{amount} کسی الگ ٹکسال میں",
  "wallet.balance.test_mint_note":
    "اس میں آزمائشی ٹکسال کے کھلونا پیسے شامل ہیں۔ یہ bitcoin نہیں اور اسے نقد نہیں کرایا جا سکتا۔",
  "wallet.token": "ٹوکن",
  "wallet.action.send": "ecash ٹوکن بھیجیں",
  "wallet.action.send_disabled": "ecash ٹوکن بھیجیں، خالی بیلنس پر دستیاب نہیں",
  "wallet.action.receive": "ecash ٹوکن وصول کریں",
  "wallet.action.zap": "کسی Nostr رابطے کو zap بھیجیں",
  "wallet.action.zap_disabled":
    "کسی Nostr رابطے کو zap بھیجیں، خالی بیلنس پر دستیاب نہیں",
  "wallet.action.add_mint": "Cashu ٹکسال شامل کریں",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "ٹوکن نہ بن سکا",
  "wallet.send.title": "ecash بھیجیں",
  "wallet.send.amount_in": "{unit} میں رقم",
  "wallet.send.body":
    "آپ کے پاس پہلے سے موجود ثبوتوں سے آف لائن بنایا گیا۔ جب تک آپ تصدیق نہ کریں کہ ٹوکن پہنچ گیا، آپ کے بیلنس سے کچھ بھی ہمیشہ کے لیے نہیں جاتا۔",
  "wallet.send.stale_fee_note":
    "فیسیں آخری بار {days} دن پہلے جانچی گئی تھیں۔ اگر اس ٹکسال نے تب سے فیس بڑھائی ہو تو ترسیل کچھ زیادہ مہنگی پڑ سکتی ہے۔",
  "wallet.send.fee_note":
    "{spend} {unit} آپ کے بیلنس سے جائیں گے؛ اضافی {fee} وہ ٹکسال فیس پوری کرتے ہیں جو ورنہ انہیں دینا پڑتی",
  "wallet.send.qr_too_big":
    "یہ ٹوکن اتنے سکوں میں بٹا ہوا ہے کہ QR کوڈ میں نہیں سماتا۔ اس کے بجائے اسے شیئر یا کاپی کریں، یا ٹکسال پر تازہ کر کے انہیں یکجا کریں۔",
  "wallet.send.bearer_note":
    "جس کے پاس یہ لڑی ہو، پیسے اسی کے ہیں۔ ثبوت مختص کیے گئے ہیں، خرچ نہیں ہوئے: اگر یہ کسی تک نہ پہنچے تو آپ انہیں زیر التوا کے تحت واپس لے سکتے ہیں۔",
  "wallet.send.qr_too_big_short":
    "یہ ٹوکن اتنے سکوں میں بٹا ہوا ہے کہ QR کوڈ میں نہیں سماتا۔ اس کے بجائے اسے شیئر یا کاپی کریں۔",
  "wallet.send.scan_note":
    "انہیں کہیں کہ یہ اپنے بٹوے سے اسکین کریں۔ جب تک آپ اسے پہنچا ہوا نشان زد نہ کریں، یہ واپس لیا جا سکتا ہے۔",
  "wallet.send.mesh_note":
    "ٹوکن میش پر ایک خفیہ براہ راست پیغام کے طور پر جاتا ہے۔ انٹرنیٹ درکار نہیں۔",
  "wallet.send.no_peers_note":
    "قریبی آلات ڈھونڈنے کے لیے میش ٹیب کھولیں، یا ٹوکن کسی اور طریقے سے شیئر کریں۔",
  "wallet.send.send_to": "{name} کو بھیجیں",
  "wallet.send.memo": "یادداشت (اختیاری، ٹوکن کے ساتھ جاتی ہے)",
  "wallet.send.building": "بن رہا ہے…",
  "wallet.send.build": "ٹوکن بنائیں",
  "wallet.send.inexact_body":
    "آپ کے ثبوت آف لائن ٹھیک {amount} {unit} نہیں بنا سکتے۔ سب سے چھوٹا ٹوکن جو آپ بنا سکتے ہیں {spend} {unit} ہے، اور آف لائن کوئی بقایا نہیں ہوتا: اضافی {extra} {unit} وصول کنندہ کو چلے جاتے ہیں۔\n\nآن لائن رہتے ہوئے ٹکسال پر تازہ کرنے سے آپ کے ثبوت ایسے حصوں میں بٹ جاتے جو ٹھیک بیٹھتے۔",
  "wallet.send.send_amount": "{amount} بھیجیں",
  "wallet.send.sent_to": "{amount} {unit} {name} کو بھیجے گئے",
  "wallet.send.sent_to_body":
    "{route} جب تک آپ تصدیق نہ کریں کہ انہیں مل گیا، یا ٹکسال ہمیں نہ بتائے کہ ثبوت بھنا لیے گئے، یہ زیر التوا کے تحت واپس لیا جا سکتا ہے۔",
  "wallet.send.copy_token": "ٹوکن کاپی کریں",
  "wallet.send.share_token": "ٹوکن شیئر کریں",
  "wallet.send.open_in_wallet": "یہ ٹوکن کسی دوسرے بٹوے میں کھولیں",
  "wallet.send.open_in_wallet_short": "بٹوے میں کھولیں",
  "wallet.send.to_peer": "ٹوکن کسی قریبی پیئر کو بھیجیں",
  "wallet.send.to_peer_short": "پیئر کو بھیجیں",
  "wallet.send.mark_delivered": "پہنچا ہوا نشان زد کریں اور ختم کریں",
  "wallet.send.they_got_it": "انہیں مل گیا",
  "wallet.send.keep_pending": "یہ ترسیل زیر التوا رہنے دیں",
  "wallet.send.decide_later": "بعد میں فیصلہ کریں",
  "wallet.send.no_peers": "حدود میں کوئی پیئر نہیں",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "یہ آپ ہی کی ادائیگی ہے",
  "wallet.receive.own_payment_body":
    "یہ سکے اب بھی ایک ایسی ترسیل کے لیے مختص ہیں جو آپ نے مکمل نہیں کی، اس لیے لینے کو کچھ نہیں۔ انہیں سیدھا اپنے بیلنس میں واپس ڈالنے کے لیے اس ادائیگی پر واپس لیں استعمال کریں۔",
  "wallet.receive.already_have": "پہلے ہی آپ کے بٹوے میں",
  "wallet.receive.already_have_body":
    "اس ٹوکن کا ہر ثبوت پہلے ہی یہاں محفوظ ہے، اس لیے کچھ شامل نہیں ہوا۔ بیلنس جوں کے توں ہیں۔",
  "wallet.receive.stored_unconfirmed":
    "{mint} سے محفوظ، مگر ابھی ٹکسال سے تصدیق نہیں ہوئی ({reason})۔",
  "wallet.receive.offline": "آف لائن",
  "wallet.receive.redeemed_here":
    "{mint} پر بھنا لیا گیا۔ یہ ثبوت اب صرف آپ کے ہیں: بھیجنے والے کی نقل اب کام نہیں کرتی۔",
  "wallet.receive.memo_quoted": "\n\n”{memo}“",
  "wallet.receive.redeemed_at":
    "{mint} پر بھنا لیا گیا۔ اب یہ ثابت شدہ طور پر آپ کا ہے: بھیجنے والے کے پاس اس ٹوکن کی نقل اب کام نہیں کرتی۔",
  "wallet.receive.stored_pending":
    "{mint} سے محفوظ، مگر ٹکسال نے ابھی تصدیق نہیں کی کہ یہ خرچ نہیں ہوا{dleq}۔ آن لائن ہوتے ہی بٹوہ ٹیب سے تازہ کریں۔",
  "wallet.receive.dleq_inline":
    " (اس کا دستخط تو ٹھیک نکلتا ہے، سو ٹوکن اصلی ہے)",
  "wallet.receive.dleq_ok": "ٹکسال کا دستخط ٹھیک نکلتا ہے، سو ٹوکن اصلی ہے۔",
  "wallet.receive.dleq_uncached":
    "ٹکسال کی کلیدیں یہاں موجود نہیں، اس لیے دستخط آف لائن جانچا نہ جا سکا۔",
  "wallet.receive.dleq_warning":
    "جب تک آپ آن لائن تازہ نہ کریں، اصولاً ممکن ہے بھیجنے والے نے اسے کہیں اور خرچ کر دیا ہو۔",
  "wallet.receive.failed": "وصول نہ ہو سکا",
  "wallet.receive.title": "ecash وصول کریں",
  "wallet.receive.body":
    "Cashu ٹوکن چسپاں کریں۔ آن لائن ہو تو ٹکسال پر فوراً بھنا لیا جاتا ہے؛ آف لائن ہو تو محفوظ ہو جاتا ہے اور اگلی بار تازہ کرنے پر تصدیق ہوتی ہے۔",
  "wallet.receive.scan": "ecash کا QR کوڈ اسکین کریں",
  "wallet.receive.scan_short": "QR اسکین کریں",
  "wallet.receive.receiving": "وصول ہو رہا ہے…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}… سے nutzap موصول ہوا اور آپ کے بٹوے میں بھنا لیا گیا۔",
  "wallet.zap.title": "کسی Nostr شناخت کو zap بھیجیں",
  "wallet.zap.not_npub": "npub نہیں",
  "wallet.zap.bad_key": "غلط کلید",
  "wallet.zap.invalid_pubkey": "عوامی کلید درست نہیں",
  "wallet.zap.invalid_pubkey_body":
    "npub1… یا 64 حروف کی سولہ عددی Nostr عوامی کلید درج کریں۔",
  "wallet.zap.sent": "nutzap بھیج دیا گیا",
  "wallet.zap.failed": "zap ناکام",
  "wallet.zap.body":
    "اگر وہ NIP-61 کی nutzap معلومات شائع کرتے ہیں تو ecash ان کی کلید سے بندھ جاتا ہے، سو کوئی اور اسے خرچ نہیں کر سکتا اور اسے واپس بھی نہیں لیا جا سکتا۔ اگر نہیں، تو یہ ایسے ٹوکن کے طور پر جاتا ہے جو واپس لیا جا سکے۔ آپ کو بتا دیا جائے گا کہ کیا ہوا۔",
  "wallet.zap.contact": "{name} کو zap بھیجیں",
  "wallet.zap.pubkey_placeholder": "npub1… یا 64 سولہ عددی حروف",
  "wallet.zap.sending": "بھیجا جا رہا ہے…",
  "wallet.nostr.copied_body":
    "یہ کسی کو دیں اور وہ آپ کو Airhop یا کسی بھی دوسرے Nostr بٹوے سے zap بھیج سکیں گے، بلوٹوتھ کے بغیر۔",
  "wallet.nostr.copy_key":
    "اپنی Nostr کلید کاپی کریں تاکہ لوگ آپ کو zap بھیج سکیں",
  "wallet.nostr.your_key": "آپ کی Nostr کلید",

  // ---- Wallet: mints ----
  "wallet.mint.added": "ٹکسال شامل ہو گئی",
  "wallet.mint.add_failed": "ٹکسال شامل نہ ہو سکی",
  "wallet.mint.added_named": "{name} شامل ہو گئی",
  "wallet.mint.added_body":
    "{mint} {units} جاری کرتی ہے۔ اس کی کلیدیں اس آلے پر محفوظ ہیں، سو اس کے ٹوکن اب انٹرنیٹ کے بغیر بھی جانچے جا سکتے ہیں۔",
  "wallet.mint.remove_plain":
    "{mint} کو اپنے بٹوے سے ہٹائیں؟ اس کی محفوظ کلیدیں بھی ساتھ جائیں گی، سو اس کے ٹوکن آف لائن جانچے نہیں جا سکیں گے۔",
  "wallet.mint.title": "ٹکسالیں",
  "wallet.mint.none": "ابھی کوئی ٹکسال نہیں",
  "wallet.mint.none_desc":
    "ٹکسال آپ کا ecash جاری اور بھناتی ہے۔ Lightning سے جمع کرنے کے لیے ایک شامل کریں، یا بس ایک ٹوکن وصول کریں اور اس کی ٹکسال خود شامل ہو جائے گی۔",
  "wallet.mint.add": "ٹکسال شامل کریں",
  "wallet.mint.add_body":
    "ٹکسال وہ Bitcoin رکھتی ہے جو آپ کے ecash کی پشت پر ہے، سو ایسی چنیں جس پر آپ اتنا بیلنس رکھنے کا بھروسا کریں جتنا وہاں رکھتے ہیں۔ محفوظ کرنے سے پہلے URL جانچا جاتا ہے۔ اگر آپ کسی پر بھروسا نہ کرنا چاہیں تو Nutshell سے اپنی ٹکسال چلائیں۔",
  "wallet.mint.consolidate_body":
    "ٹوکن کبھی صرف ایک ٹکسال کا نام لے سکتا ہے، سو کئی ٹکسالوں میں بکھرا بیلنس اتنی رقم ادا نہیں کر سکتا جو ان میں سے سب سے بڑی کے پاس موجود رقم سے زیادہ ہو۔ Airhop اسے منتقل کر سکتا ہے: ہر دوسری ٹکسال آپ کی چنی ہوئی ٹکسال کا جاری کردہ Lightning بل ادا کرتی ہے۔ اس پر تھوڑی رخ بندی فیس لگتی ہے اور انٹرنیٹ درکار ہے۔",
  "wallet.mint.add_short": "ٹکسال شامل کریں",
  "wallet.mint.checking": "جانچا جا رہا ہے…",
  "wallet.mint.remove_with_balance": "بیلنس والی ٹکسال ہٹائیں؟",
  "wallet.mint.remove": "ٹکسال ہٹائیں",
  "wallet.mint.delete_anyway": "پھر بھی حذف کریں",
  "wallet.mint.consolidate": "تمام بیلنس ایک ٹکسال میں منتقل کریں",
  "wallet.mint.confirm_with": "{mint} سے ثبوت تصدیق کریں",
  "wallet.mint.remove_a11y": "{mint} ہٹائیں",
  "wallet.mint.available_amount": "{amount} {unit} دستیاب",
  "wallet.mint.split_across":
    "بیلنس {count} ٹکسالوں میں بٹا ہوا ہے۔ اسے ایک میں منتقل کریں۔",
  "wallet.mint.move_everything_to": "سب کچھ {mint} میں منتقل کریں",
  "wallet.mint.consolidate_title": "ایک ٹکسال میں منتقل کریں",
  "wallet.mint.moving": "منتقل ہو رہا ہے…",
  "wallet.mint.move": "منتقل کریں",
  "wallet.mint.moved": "منتقل ہو گیا",
  "wallet.mint.moved_body":
    "{fees} {unit} Lightning رخ بندی فیس کے بعد {amount} {unit} اب {mint} میں ہیں۔",
  "wallet.mint.nothing_moved": "کچھ منتقل نہیں ہوا",
  "wallet.mint.destination": "· منزل",
  "wallet.mint.will_move": "· منتقل کیا جائے گا",
  "wallet.mint.issued_by": "جاری کردہ",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop بٹوے میں رقم ڈالنا",
  "wallet.ln.invoice_failed": "بل نہ بن سکا",
  "wallet.ln.price_failed": "اس بل کی قیمت نہ لگ سکی",
  "wallet.ln.paid": "ادا ہو گیا",
  "wallet.ln.deposit_credited":
    "بل ادا ہو گیا اور {mint} نے {amount} {unit} جاری کیے۔ یہ بیلنس تصدیق شدہ ہے: آپ اسے فوراً آف لائن خرچ کر سکتے ہیں۔",
  "wallet.ln.withdrawn":
    "Lightning سے {paid} sat ادا ہوئے۔ ٹکسال نے {fee} sat رخ بندی فیس لی۔",
  "wallet.ln.withdrawn_with_change":
    "Lightning سے {paid} sat ادا ہوئے۔ ٹکسال نے {fee} sat رخ بندی فیس لی، اور ذخیرے کے {change} sat آپ کے بیلنس میں واپس کیے۔",
  "wallet.ln.payment_failed": "ادائیگی ناکام",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning کے sat کو ایسے ecash میں بدلیں جو آپ آف لائن خرچ کر سکیں، یا ecash کو کسی بھی Lightning بل پر نکال لیں۔ دونوں کے لیے انٹرنیٹ اور ایک ٹکسال درکار ہے۔",
  "wallet.ln.deposit_body":
    "ٹکسال آپ کو ایک بل دیتی ہے۔ اسے کسی بھی Lightning بٹوے سے ادا کریں اور sat ایسے ecash کے طور پر واپس آ جائیں گے جو آپ آف لائن خرچ کر سکیں۔",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit} کا یہ بل ادا کریں۔ بٹوہ ادائیگی پر نظر رکھے ہوئے ہے اور آپ کا ecash خود جاری کر دے گا۔",
  "wallet.ln.expired_body":
    "اس بل کی مدت ختم ہو گئی۔ اگر آپ پہلے ہی ادا کر چکے ہیں تو بیلنس خود جمع ہو جائے گا۔",
  "wallet.ln.waiting_expires": "ادائیگی کا انتظار · {countdown} میں مدت ختم",
  "wallet.ln.withdraw_body":
    "bolt11 بل چسپاں کریں اور ٹکسال اسے آپ کے ecash سے ادا کرے گی۔ پہلے آپ کو رخ بندی کا ذخیرہ بتایا جاتا ہے؛ رخ بندی جو نہ استعمال کرے وہ آپ کے بیلنس میں واپس آ جاتا ہے۔",
  "wallet.ln.up_to": "{amount} {unit} تک",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} ادا کریں",
  "wallet.ln.deposit": "Lightning سے sat جمع کریں",
  "wallet.ln.deposit_short": "جمع کریں",
  "wallet.ln.withdraw": "کسی Lightning بل پر نکالیں",
  "wallet.ln.withdraw_short": "نکالیں",
  "wallet.ln.deposit_title": "Lightning سے جمع کرنا",
  "wallet.ln.amount_placeholder": "sat میں رقم",
  "wallet.ln.requesting": "درخواست دی جا رہی ہے…",
  "wallet.ln.get_invoice": "بل حاصل کریں",
  "wallet.ln.copy_invoice": "بل کاپی کریں",
  "wallet.ln.open_wallet": "Lightning بٹوے میں کھولیں",
  "wallet.ln.open_wallet_short": "بٹوے میں کھولیں",
  "wallet.ln.waiting": "ادائیگی کا انتظار…",
  "wallet.ln.new_invoice": "نیا بل بنائیں",
  "wallet.ln.new_invoice_short": "نیا بل",
  "wallet.ln.withdraw_title": "Lightning پر نکالنا",
  "wallet.ln.scan_invoice": "Lightning بل کا QR کوڈ اسکین کریں",
  "wallet.ln.paid_from": "ادا کیا گیا",
  "wallet.ln.invoice": "بل",
  "wallet.ln.routing_reserve": "رخ بندی کا ذخیرہ",
  "wallet.ln.reserved": "بیلنس سے مختص",
  "wallet.ln.paying": "ادا کیا جا رہا ہے…",
  "wallet.ln.get_quote": "تخمینہ لیں",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "بیک اپ",
  "wallet.backup.setup_failed": "بیک اپ ترتیب نہ ہو سکا",
  "wallet.backup.on": "بیک اپ چالو",
  "wallet.backup.on_body":
    "اب آپ کا بیلنس ان بارہ الفاظ سے دوبارہ بنایا جا سکتا ہے۔\n\nجو کچھ کسی اور نے آپ کو دیا وہ اُس وقت تک اس فقرے سے باہر رہتا ہے جب تک آپ ٹکسال پر تازہ نہ کریں، اور بحالی کے لیے آپ کی ٹکسالوں کی فہرست درکار ہے، سو اسے الفاظ کے ساتھ لکھ کر رکھیں۔",
  "wallet.backup.no_phrase": "کوئی فقرہ محفوظ نہیں",
  "wallet.backup.no_phrase_body":
    "بحالی کا فقرہ آلے کی کلید زنجیر سے پڑھا نہ جا سکا۔ آلہ کھولیں اور دوبارہ کوشش کریں۔",
  "wallet.backup.replace_title": "اپنا موجودہ فقرہ بدلیں؟",
  "wallet.backup.replace_body":
    "آپ کے پاس پہلے ہی ایک بحالی فقرہ ہے۔ کوئی دوسرا بحال کرنے سے وہ بدل جائے گا۔ جو سکے پرانا فقرہ پہلے ہی سنبھالے ہوئے تھا وہ اس آلے پر خرچ ہوتے رہیں گے، مگر بحال نہیں ہو سکیں گے، سو آگے بڑھنے سے پہلے یقینی بنائیں کہ پرانے الفاظ لکھے ہوئے ہیں۔",
  "wallet.backup.replace": "بدلیں",
  "wallet.backup.invalid_phrase": "وہ فقرہ درست نہیں",
  "wallet.backup.invalid_phrase_body":
    "فقرے میں ایک اندرونی جانچ رقم ہوتی ہے اور یہ اس پر پورا نہیں اترتا۔ کوئی غلط لکھا، چھوٹا ہوا یا آگے پیچھے ہوا لفظ ڈھونڈیں۔",
  "wallet.backup.not_bip39": "یہ BIP-39 کے الفاظ نہیں: {words}۔ ہجے جانچیں۔",
  "wallet.backup.add_mint_first": "پہلے ٹکسال شامل کریں",
  "wallet.backup.add_mint_first_body":
    "بحالی ٹکسال سے پوچھ کر چلتی ہے کہ اس نے آپ کے لیے کون سے سکے دستخط کیے، سو اسے معلوم ہونا چاہیے کہ کس ٹکسال سے پوچھے۔ جو ٹکسالیں آپ استعمال کرتے تھے وہ شامل کریں، پھر بحال کریں۔",
  "wallet.backup.restore_failed": "بحالی ناکام",
  "wallet.backup.phrase": "بحالی کا فقرہ",
  "wallet.backup.state_unconfirmed": "بیک اپ چالو مگر تصدیق نہیں ہوئی",
  "wallet.backup.state_off": "بیک اپ بند",
  "wallet.backup.badge_on": "چالو",
  "wallet.backup.badge_unconfirmed": "غیر تصدیق شدہ",
  "wallet.backup.badge_off": "بند",
  "wallet.backup.view": "بحالی کا فقرہ دیکھیں",
  "wallet.backup.setup": "بحالی کا فقرہ ترتیب دیں",
  "wallet.backup.view_short": "فقرہ دیکھیں",
  "wallet.backup.setup_short": "ترتیب دیں",
  "wallet.backup.restore": "بحالی کے فقرے سے بٹوہ بحال کریں",
  "wallet.backup.restore_short": "بحال کریں",
  "wallet.backup.setup_title": "بحالی کا فقرہ ترتیب دیں",
  "wallet.backup.on_body_short":
    "آپ کا بیلنس آپ کے بارہ الفاظ سے کسی نئے آلے پر دوبارہ بنایا جا سکتا ہے۔",
  "wallet.backup.unconfirmed_body":
    "آپ نے کبھی تصدیق نہیں کی کہ آپ نے انہیں لکھ لیا ہے۔ ابھی الفاظ صرف اسی فون پر موجود ہیں، اور بیک اپ کو تو یہی ایک چیز جھیلنی ہوتی ہے۔ فقرہ دیکھیں اور اسے لکھ لیں۔",
  "wallet.backup.not_covered":
    "{amount} ابھی سنبھالے نہیں گئے۔ جو سکے آپ کو دیے گئے وہ بھیجنے والے کے راز ساتھ لاتے ہیں، سو وہ تبھی آپ کے فقرے کے نیچے آتے ہیں جب انہیں بدل لیا جائے۔ انہیں محفوظ کرنے کے لیے کوئی ٹکسال تازہ کریں۔",
  "wallet.backup.off_body":
    "آپ کا ecash صرف اسی فون پر موجود ہے۔ اگر یہ کھو جائے تو پیسے کوئی واپس نہیں لا سکتا، آپ بھی نہیں۔ بحالی کا فقرہ بارہ الفاظ ہیں جو آپ کا بیلنس کہیں بھی دوبارہ بنا سکتے ہیں۔",
  "wallet.backup.about_to_see":
    "آپ ابھی بارہ الفاظ دیکھنے والے ہیں۔ وہی پیسے ہیں۔",
  "wallet.backup.exact_order":
    "بارہ الفاظ، بالکل اسی ترتیب میں۔ جس کے پاس یہ ہوں، آپ کا بیلنس اسی کا ہے۔",
  "wallet.backup.verify_body":
    "جو فقرہ کسی نے لکھا نہ ہو وہ فقرہ نہ ہونے سے بھی برا ہے، کیونکہ وہ ایسے جال جیسا لگتا ہے جو ہے ہی نہیں۔ تصدیق کے لیے دو الفاظ۔",
  "wallet.backup.verify_mismatch":
    "یہ میل نہیں کھاتا۔ اپنی لکھی ہوئی نقل جانچیں۔",
  "wallet.backup.restore_body":
    "بارہ الفاظ درج کریں۔ Airhop آپ کے سکے دوبارہ اخذ کرتا ہے اور ہر ٹکسال سے پوچھتا ہے کہ اس نے ان میں سے کون سے دستخط کیے، سو بیلنس ٹکسال کے رکھے ہوئے ریکارڈ سے واپس آ جاتا ہے۔",
  "wallet.backup.warn_secret":
    "جو بھی انہیں پڑھ لے وہ آپ کا بیلنس لے جا سکتا ہے۔ ان کی اسکرین تصویر نہ لیں اور انہیں اس فون پر محفوظ نہ کریں۔",
  "wallet.backup.warn_paper":
    "انہیں کاغذ پر لکھیں اور کسی محفوظ جگہ رکھیں۔ فون چلا جائے تو Airhop انہیں دوبارہ نہیں دکھا سکتا۔",
  "wallet.backup.warn_scope":
    "یہ صرف آپ کا ecash دوبارہ بناتے ہیں۔ آپ کی شناخت، چیٹس اور رابطے اس میں شامل نہیں۔",
  "wallet.backup.warn_mints":
    "بحالی کو ٹکسال سے پوچھنا پڑتا ہے کہ اس نے کون سے سکے دستخط کیے، سو اپنی ٹکسالوں کی فہرست الفاظ کے ساتھ لکھ لیں۔",
  "wallet.backup.preparing": "تیاری ہو رہی ہے…",
  "wallet.backup.show_phrase": "میرا فقرہ دکھائیں",
  "wallet.backup.your_phrase": "آپ کا بحالی فقرہ",
  "wallet.backup.write_down": "انہیں لکھ لیں",
  "wallet.backup.copy_phrase": "بحالی کا فقرہ کلپ بورڈ پر کاپی کریں",
  "wallet.backup.copy_clipboard": "کلپ بورڈ پر کاپی کریں",
  "wallet.backup.written_down": "میں نے انہیں لکھ لیا ہے",
  "wallet.backup.check_copy": "اپنی نقل جانچیں",
  "wallet.backup.confirm": "تصدیق کریں",
  "wallet.backup.restore_title": "فقرے سے بحالی",
  "wallet.backup.phrase_placeholder": "بارہ الفاظ، خالی جگہوں سے الگ",
  "wallet.backup.no_mints_yet":
    "ابھی کوئی ٹکسال شامل نہیں۔ بحالی کو کسی مخصوص ٹکسال سے پوچھنا پڑتا ہے، سو پہلے وہ شامل کریں جو آپ استعمال کرتے تھے۔",
  "wallet.backup.scanning": "چھانا جا رہا ہے…",
  "wallet.backup.restore_progress":
    "{mint} · {total} میں سے کلید مجموعہ {step}",
  "wallet.backup.will_scan":
    "چھانی جائیں گی: {mints}۔ جو ٹکسال آپ نے شامل نہیں کی اس سے کبھی نہیں پوچھا جاتا، سو اس کا بیلنس نظر نہیں آتا۔",
  "wallet.backup.word_n": "لفظ {position}",
  "wallet.backup.unreachable_mints":
    "رسائی نہ ہو سکی: {mints}۔ وہاں جو بیلنس ہے وہ اب بھی موجود ہے۔ بہتر تعلق پر دوبارہ کوشش کریں۔",
  "wallet.backup.nothing_recovered": "چھانی گئی ٹکسالوں سے کچھ بحال نہیں ہوا۔",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "موصول شدہ نشان زد کریں؟",
  "wallet.delivered.body":
    "یہ {amount} {unit} ہمیشہ کے لیے چھوڑ دیتا ہے۔ اگر وہ حقیقت میں کبھی پہنچے ہی نہ ہوں تو آپ انہیں واپس نہیں لے سکیں گے۔",
  "wallet.delivered.body_generic":
    "یہ مختص رقم ہمیشہ کے لیے چھوڑ دیتا ہے۔ اگر وہ حقیقت میں کبھی پہنچی ہی نہ ہو تو آپ اسے واپس نہیں لے سکیں گے۔",
  "wallet.delivered.cancel": "ابھی نہیں",
  "wallet.delivered.confirm": "انہیں مل گیا",
  "wallet.reclaim.title": "یہ ٹوکن واپس لیں؟",
  "wallet.reclaim.body":
    "{amount} {unit} آپ کے بیلنس میں واپس چلے جائیں گے۔ یہ صرف تب کریں جب ٹوکن کسی تک پہنچا ہی نہ ہو: اگر لڑی پہلے ہی ان کے پاس ہے تو جو بھی اسے ٹکسال پر پہلے بھنائے پیسے اسی کے، اور وہ یہ لوگ بھی ہو سکتے ہیں۔",
  "wallet.reclaim.keep": "زیر التوا رہنے دیں",
  "wallet.reclaim.confirm": "واپس لیں",
  "wallet.copied.token_body":
    "ٹوکن آپ کے کلپ بورڈ پر ہے۔ جب تک آپ اسے پہنچا ہوا نشان زد نہ کریں یہ یہاں مختص رہتا ہے، سو پہلی کوشش ناکام ہو تو آپ اسے دوبارہ چسپاں کر سکتے ہیں۔",
  "wallet.copied.phrase_body":
    "اسے کسی پاس ورڈ منتظم میں چسپاں کریں، پھر اپنا کلپ بورڈ صاف کریں۔ دوسری ایپس کلپ بورڈ پڑھ سکتی ہیں، اور کچھ ترتیبات میں یہ آپ کے دوسرے آلات سے ہم وقت ہو جاتا ہے۔",
  "wallet.refresh.failed": "تازہ کرنا ناکام",
  "wallet.refresh.partly": "جزوی طور پر تازہ ہوا",
  "wallet.refresh.done": "تازہ ہو گیا",
  "wallet.refresh.unreachable":
    "{mints} تک رسائی نہ ہو سکی۔ باقی سب تازہ ترین ہے۔",
  "wallet.refresh.swapped":
    "{amount} {unit} تصدیق ہوئے اور نئے ثبوتوں سے بدل دیے گئے۔",
  "wallet.refresh.secured": "{amount} {unit} اب آپ کے بحالی فقرے کے تحت ہیں۔",
  "wallet.refresh.all_confirmed": "یہاں سب کچھ پہلے ہی ٹکسال سے تصدیق شدہ تھا۔",
  "wallet.pending.title": "زیر التوا",
  "wallet.pending.reserved_desc":
    "بن گیا اور مختص ہے، پہنچنے کی تصدیق نہیں ہوئی۔ ثبوت آپ کے بیلنس سے باہر رکھے جاتے ہیں تاکہ دو بار خرچ نہ ہوں۔",
  "wallet.pending.locked_desc":
    "پہلے ہی وصول کنندہ کی کلید سے بندھا ہوا، سو صرف وہی اسے خرچ کر سکتے ہیں۔ بس ابھی ان تک پہنچا نہیں۔ مکمل کرنے کے لیے ٹوکن شیئر کریں۔",
  "wallet.pending.show_qr": "یہ ٹوکن QR کوڈ کے طور پر دکھائیں",
  "wallet.pending.copy_again": "ٹوکن دوبارہ کاپی کریں",
  "wallet.pending.share_again": "ٹوکن دوبارہ شیئر کریں",
  "wallet.pending.mark_delivered": "اس ٹوکن کو پہنچا ہوا نشان زد کریں",
  "wallet.pending.delivered": "پہنچ گیا",
  "wallet.pending.reclaim_into": "یہ ٹوکن اپنے بیلنس میں واپس لیں",
  "wallet.activity.title": "سرگرمی",
  "wallet.activity.none": "ابھی کچھ نہیں",
  "wallet.activity.none_desc":
    "جو ادائیگیاں آپ بھیجتے اور وصول کرتے ہیں وہ یہاں نظر آتی ہیں، نئی پہلے، ہر ایک کی ٹکسال اور فیس کے ساتھ۔",
  "wallet.activity.show_fewer": "کم ادائیگیاں دکھائیں",
  "wallet.activity.show_less": "کم دکھائیں",
  "wallet.activity.received_unconfirmed": "موصول، تصدیق نہیں ہوئی",
  "wallet.activity.received": "موصول",
  "wallet.activity.receive_failed": "وصولی ناکام",
  "wallet.activity.reclaimed": "واپس لیا گیا",
  "wallet.activity.send_failed": "ترسیل ناکام",
  "wallet.activity.sent": "بھیج دیا گیا",
  "wallet.activity.status_pending": "زیر التوا",
  "wallet.activity.status_failed": "ناکام",
  "wallet.activity.status_reclaimed": "واپس لیا گیا",
  "wallet.activity.status_expired": "مدت ختم",
  "wallet.activity.ln_deposit": "Lightning جمع",
  "wallet.activity.ln_withdrawal": "Lightning نکاسی",
  "wallet.activity.nutzap_received": "nutzap موصول",
  "wallet.activity.spent_removed": "خرچ شدہ ثبوت ہٹا دیے گئے",
  "wallet.activity.refreshed": "ثبوت تازہ ہو گئے",
  "wallet.activity.refreshing": "ثبوت تازہ کیے جا رہے ہیں",
  "wallet.activity.just_now": "ابھی ابھی",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "میش آف لائن",
  "wallet.mesh_offline_body":
    "میش سروس نہیں چل رہی، سو ٹوکن دینے کو کوئی نہیں۔ یہ زیر التوا کے تحت مختص رہتا ہے۔",
  "wallet.xfer.route_mesh": "میش کے ذریعے سیدھا ان کے آلے کو دے دیا گیا۔",
  "wallet.xfer.route_nostr":
    "وہ بلوٹوتھ کی حدود سے باہر تھے، سو یہ انٹرنیٹ سے چلا گیا۔",
  "wallet.xfer.route_courier":
    "ابھی ان تک کوئی راستہ نہیں۔ دوسرے آلات اسے ساتھ لے جائیں گے اور جب کوئی ان تک پہنچے گا تو پہنچا دیں گے۔",
  "wallet.xfer.route_queued":
    "ان تک ابھی رسائی نہیں۔ یہ قطار میں ہے اور رسائی ہوتے ہی نکل جائے گا۔",
  "wallet.xfer.mesh_offline_body":
    "میش سروس نہیں چل رہی، سو ٹوکن سونپنے کا کوئی طریقہ نہیں۔ کچھ بھی کاٹا نہیں گیا۔",
  "wallet.xfer.could_not_send": "بھیجا نہ جا سکا",
  "wallet.xfer.inexact_body":
    "آپ کے ثبوت آف لائن ٹھیک {amount} {unit} نہیں بنا سکتے۔ سب سے چھوٹا ٹوکن جو آپ بنا سکتے ہیں {spend} {unit} ہے، اور اضافی {extra} {unit} ان کے پاس چلے جاتے ہیں جنہیں واپس لینے کا کوئی راستہ نہیں۔\n\nآن لائن رہتے ہوئے ٹکسال پر تازہ کرنے سے آپ کے ثبوت ایسے حصوں میں بٹ جاتے ہیں جو ٹھیک بیٹھتے ہیں۔",
  "wallet.xfer.send_amount": "{amount} بھیجیں",
  "wallet.xfer.mesh_offline": "میش آف لائن",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "ان کی کلید سے بندھا اور Nostr پر شائع ہوا۔ وہ آن لائن ہوں یا نہ ہوں، یہ ان کا ہے۔",
  "wallet.pay.rail_nutzap_dm":
    "ان کی کلید سے بندھا۔ ریلے نے اسے نہ لیا، سو یہ ان کے پاس پیغام کے طور پر گیا۔",
  "wallet.pay.rail_nutzap_undelivered":
    "ان کی کلید سے بندھا، مگر ابھی کوئی اسے لے جا نہ سکا۔ یہ قطار میں ہے، اور ٹوکن زیر التوا کے تحت ہے۔",
  "wallet.pay.final":
    "بندھی ہوئی ادائیگیاں واپس نہیں لی جا سکتیں: اب یہ سکے صرف ان کی کلید خرچ کر سکتی ہے۔",
  "wallet.pay.reclaimable":
    "جب تک آپ تصدیق نہ کریں کہ یہ پہنچ گیا، بٹوہ ٹیب سے اسے واپس لیا جا سکتا ہے۔",
  "wallet.pay.why": "اس راستے سے بھیجا گیا کیونکہ {reason}۔",
  "wallet.pay.sent_title": "{amount} {unit} برائے {name}",
  "wallet.pay.thread_receipt":
    "آپ نے {amount} {unit} بھیجے، ان کی کلید سے بندھے ہوئے۔",
  "wallet.pay.title": "ecash بھیجیں",
  "wallet.pay.to": "برائے {name}",
  "wallet.pay.amount": "sat میں رقم",
  "wallet.pay.memo": "نوٹ (اختیاری، عوامی)",
  "wallet.pay.send": "بھیجیں",
  "wallet.pay.sending": "بھیجا جا رہا ہے…",
  "wallet.pay.action": "ecash بھیجیں",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "کیمرے تک رسائی",
  "wallet.scan.camera_purpose": "ecash کا QR کوڈ اسکین کرنا",
  "wallet.scan.photo_label": "تصاویر تک رسائی",
  "wallet.scan.photo_purpose": "کسی تصویر سے ecash کا QR پڑھنا",
  "wallet.scan.no_token": "اس تصویر میں کوئی ecash ٹوکن نہیں ملا۔",
  "wallet.scan.no_invoice": "اس تصویر میں کوئی Lightning بل نہیں ملا۔",
  "wallet.scan.unreadable": "وہ تصویر پڑھی نہ جا سکی۔",
  "wallet.scan.camera_failed":
    "کیمرا شروع نہیں ہو سکا۔ کیمرے کی دوسری ایپس بند کر کے دوبارہ کوشش کریں۔",
  "wallet.scan.close": "اسکینر بند کریں",
  "wallet.scan.on_device":
    "یہ اسی آلے پر پڑھا جاتا ہے؛ کچھ بھی کہیں نہیں بھیجا جاتا۔",
  "wallet.scan.aim_token": "ecash کے QR کوڈ پر رکھیں۔",
  "wallet.scan.aim_invoice": "Lightning بل کے QR کوڈ پر رکھیں۔",
  "wallet.scan.title_token": "ecash اسکین کریں",
  "wallet.scan.title_invoice": "بل اسکین کریں",
  "wallet.scan.desc_token":
    "کسی دوسرے بٹوے سے Cashu ٹوکن پڑھیں۔ کسی بھی Cashu بٹوے کے ساتھ کام کرتا ہے، صرف Airhop کے ساتھ نہیں۔",
  "wallet.scan.desc_invoice":
    "اپنے بیلنس سے ادا کرنے کے لیے Lightning بل پڑھیں۔",
  "wallet.scan.use_camera_a11y": "کیمرے سے اسکین کریں",
  "wallet.scan.use_camera": "کیمرا استعمال کریں",
  "wallet.scan.pick_image_a11y": "محفوظ تصویر سے QR کوڈ پڑھیں",
  "wallet.scan.pick_image": "تصاویر میں سے چنیں",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu کیا ہے؟",
  "wallet.explain.intro":
    "Cashu، Bitcoin کے لیے ecash ہے۔ ٹوکن ایک ایسی لڑی ہے جو اس کے حامل کے لیے پیسوں کے برابر ہے، ٹکسال کی طرف سے اندھا دستخط شدہ تاکہ ٹکسال جان نہ سکے کہ کس نے کیا خرچ کیا۔ نہ اکاؤنٹ، نہ لاگ اِن۔",
  "wallet.explain.send": "بھیجیں",
  "wallet.explain.send_desc":
    "رقم کو ایسے ٹوکن میں بدلتا ہے جو آپ بلوٹوتھ پر کسی قریبی پیئر کو دے سکیں، یا متن کے طور پر شیئر کر سکیں۔ انٹرنیٹ کے بغیر کام کرتا ہے۔ جب تک آپ تصدیق نہ کریں کہ یہ پہنچ گیا، ثبوت مختص رہتے ہیں۔",
  "wallet.explain.receive": "وصول کریں",
  "wallet.explain.receive_desc":
    "ٹوکن شامل کرنے کے لیے اسے چسپاں کریں۔ آن لائن ہو تو ٹکسال پر فوراً بدل جاتا ہے، جس سے وہ ثابت شدہ طور پر آپ کا ہو جاتا ہے۔ آف لائن ہو تو محفوظ ہو کر غیر تصدیق شدہ نشان زد رہتا ہے جب تک آپ تازہ نہ کریں۔",
  "wallet.explain.zap": "zap",
  "wallet.explain.zap_desc":
    "کسی Nostr شناخت کو ادائیگی کرتا ہے۔ اگر وہ NIP-61 کی nutzap معلومات شائع کرتے ہیں تو ecash ان کی کلید سے بندھ جاتا ہے، سو صرف وہی اسے خرچ کر سکتے ہیں۔ ورنہ یہ ایک خفیہ براہ راست پیغام پر لوٹ آتا ہے۔ انٹرنیٹ درکار ہے۔",
  "wallet.explain.add_mint": "ٹکسال شامل کریں",
  "wallet.explain.add_mint_desc":
    "وہ ٹکسال محفوظ کرتا ہے جو آپ کا ecash جاری اور بھناتی ہے، اور اس کی عوامی کلیدیں رکھتا ہے تاکہ اس کے ٹوکن آف لائن جانچے جا سکیں۔ ایسی ٹکسال چنیں جس پر آپ اتنا بیلنس رکھنے کا بھروسا کریں جتنا وہاں رکھتے ہیں۔",
  "wallet.explain.phrase": "بحالی کا فقرہ",
  "wallet.explain.phrase_desc":
    "آپ کے سکے ان بارہ الفاظ سے اخذ ہوتے ہیں جو بٹوہ شروع میں بناتا ہے، سو کوئی نیا فون آپ کی ٹکسالوں سے پوچھ کر بیلنس دوبارہ بنا سکتا ہے کہ انہوں نے کون سے سکے دستخط کیے۔ جب تک آپ انہیں دیکھ کر لکھ نہ لیں، وہ صرف اسی فون پر موجود ہیں۔",

  // ---- Wallet: failures ----
  "wallet.err.locked": "بٹوہ مقفل",
  "wallet.err.mint_unreachable": "ٹکسال تک رسائی نہیں",
  "wallet.err.tor_blocked": "Tor چالو ہونے کے دوران مسدود",
  "wallet.err.insufficient": "بیلنس ناکافی",
  "wallet.err.exact_amount": "بالکل اتنی رقم نہیں بھیجی جا سکتی",
  "wallet.err.no_mint": "کوئی ٹکسال نہیں",
  "wallet.err.mint_unsupported": "ٹکسال یہ نہیں کر سکتی",
  "wallet.err.mint_refused": "ٹکسال نے انکار کر دیا",
  "wallet.err.unreadable": "ناقابل مطالعہ ٹوکن",
  "wallet.err.rejected": "ٹوکن مسترد",
  "wallet.err.already_spent": "پہلے ہی خرچ شدہ",
  "wallet.err.change_pending": "ادا ہو گیا، بقایا زیر التوا",
  "wallet.svc.mint_unreachable": "ٹکسال تک رسائی نہ ہو سکی۔",
  "wallet.svc.tor_ios": "iOS پر ٹکسال کی درخواستیں Tor سے نہیں جاتیں۔",
  "wallet.svc.tor_ios_body":
    "Arti صرف Nostr کے WebSocket لپیٹتا ہے، سو یہ درخواست ٹکسال تک کھلے نیٹ سے پہنچتی اور آپ کا IP ان ثبوتوں سے جوڑ دیتی۔ ترتیبات > تحفظ کے تحت اس کی اجازت دیں، یا پہلے Tor بند کریں۔ میش پر ecash بھیجنا اور وصول کرنا پھر بھی کام کرتا ہے۔",
  "wallet.svc.keys_uncached": "اس ٹکسال کی کلیدیں اس آلے پر محفوظ نہیں۔",
  "wallet.svc.keys_uncached_body":
    "انہیں لانے کے لیے آن لائن رہتے ہوئے بٹوہ ایک بار کھولیں۔",
  "wallet.svc.phrase_invalid": "وہ بحالی فقرہ درست نہیں۔",
  "wallet.svc.phrase_invalid_body":
    "کوئی غلط لکھا یا چھوٹا ہوا لفظ ڈھونڈیں۔ فقرے میں ایک اندرونی جانچ رقم ہوتی ہے، سو ایک غلط لفظ پورے فقرے کو بے کار کر دیتا ہے۔",
  "wallet.svc.need_mint": "پہلے کم از کم ایک ٹکسال شامل کریں۔",
  "wallet.svc.need_mint_body":
    "بحالی ٹکسال سے پوچھ کر چلتی ہے کہ اس نے آپ کے لیے کون سے سکے دستخط کیے، سو اسے معلوم ہونا چاہیے کہ کس ٹکسال سے پوچھے۔",
  "wallet.svc.restored": "بحالی کے فقرے سے بحال ہوا",
  "wallet.svc.storage_locked": "بٹوے کا ذخیرہ مقفل ہے۔",
  "wallet.svc.storage_locked_body":
    "Airhop ecash کے ثبوت ایک خفیہ فائل میں رکھتا ہے جس کی کلید آلے کی کلید زنجیر میں رہتی ہے۔ آلہ کھولیں اور ایپ دوبارہ کھولیں۔",
  "wallet.svc.bad_url": "یہ درست URL نہیں۔",
  "wallet.svc.needs_https": "ٹکسال کا URL https:// سے شروع ہونا چاہیے۔",
  "wallet.svc.refuse_http": "سادہ http پر ٹکسال استعمال کرنے سے انکار۔",
  "wallet.svc.refuse_http_body":
    "نیٹ ورک کے راستے پر موجود کوئی بھی آپ کے ثبوت پڑھ یا بدل سکتا ہے۔ https:// والی ٹکسال استعمال کریں۔",
  "wallet.svc.mint_not_saved": "ٹکسال محفوظ نہ ہو سکی۔",
  "wallet.svc.unreadable_token": "یہ قابل مطالعہ Cashu ٹوکن نہیں۔",
  "wallet.svc.unreadable_token_body":
    "ٹوکن cashuA یا cashuB سے شروع ہوتے ہیں۔ جانچیں کہ کاپی کرتے وقت کچھ کٹ تو نہیں گیا۔",
  "wallet.svc.wrong_mint":
    "یہ ٹوکن اُس ٹکسال کا دستخط شدہ نہیں جس کا وہ نام لیتا ہے۔",
  "wallet.svc.already_spent": "یہ ثبوت پہلے ہی خرچ ہو چکے ہیں۔",
  "wallet.svc.already_spent_body":
    "جس نے یہ ٹوکن بھیجا اس نے پہلے خود بھنا لیا، یا وہی ٹوکن کسی اور کو بھی بھیج دیا۔",
  "wallet.svc.receiving_offline": "آف لائن وصول کرنا",
  "wallet.svc.amount_positive": "صفر سے بڑی رقم درج کریں۔",
  "wallet.svc.coins_raced":
    "وہ سکے ابھی ابھی کسی دوسری ادائیگی نے استعمال کر لیے۔",
  "wallet.svc.coins_raced_body":
    "کچھ بھی کاٹا نہیں گیا۔ دوبارہ کوشش کریں اور بٹوہ کوئی اور مجموعہ چن لے گا۔",
  "wallet.svc.no_ecash": "ابھی کوئی ecash نہیں۔",
  "wallet.svc.no_ecash_body":
    "ٹکسال شامل کریں اور Lightning سے جمع کریں، یا کسی سے ٹوکن وصول کریں۔",
  "wallet.svc.split_across_mints": "آپ کا بیلنس کئی ٹکسالوں میں بٹا ہوا ہے۔",
  "wallet.svc.mint_says_spent": "ٹکسال نے ان ثبوتوں کو پہلے سے خرچ شدہ بتایا۔",
  "wallet.svc.issue_against_invoice": "Lightning بل کے بدلے ecash جاری کرنا",
  "wallet.svc.pay_invoice": "Lightning بل ادا کرنا",
  "wallet.svc.unknown_deposit": "نامعلوم جمع۔",
  "wallet.svc.invoice_expired_before": "ادا ہونے سے پہلے بل کی مدت ختم ہو گئی۔",
  "wallet.svc.invoice_expired": "اس بل کی مدت ختم ہو گئی۔",
  "wallet.svc.invoice_unpaid": "بل ابھی ادا نہیں ہوا۔",
  "wallet.svc.payment_unknown":
    "ادائیگی کی حالت نامعلوم؛ اگلی بار تازہ کرنے پر دوبارہ جانچی جائے گی۔",
  "wallet.svc.melt_change_pending": "آپ کا بل ادا ہو گیا۔",
  "wallet.svc.melt_change_pending_body":
    "ٹکسال نے غیر استعمال شدہ رخ بندی فیس ابھی واپس نہیں کی۔ اگلی بار تازہ کرنے پر یہ خود لے لی جاتی ہے، اور اس دوران کچھ ضائع نہیں ہوتا۔",
  "wallet.svc.mint_did_not_pay":
    "ٹکسال نے یہ بل ادا نہیں کیا۔ آپ کا بیلنس جوں کا توں ہے۔",
  "wallet.svc.not_an_invoice": "یہ Lightning بل نہیں۔",
  "wallet.svc.not_an_invoice_body":
    "lnbc سے شروع ہونے والا bolt11 بل چسپاں کریں۔",
  "wallet.svc.insufficient_for_invoice": "اس بل کے لیے بیلنس ناکافی۔",
  "wallet.svc.coins_raced_invoice_body":
    "کچھ بھی کاٹا نہیں گیا اور بل ادا نہیں ہوا۔ دوبارہ کوشش کریں۔",
  "wallet.svc.same_mint": "کوئی اور منزل ٹکسال چنیں۔",
  "wallet.svc.same_mint_body":
    "ماخذ اور منزل ایک ہی ٹکسال ہیں، سو منتقل کرنے کو کچھ نہیں۔",
  "wallet.svc.quote_failed_retried": "تخمینہ ناکام، یکجا کرنے کی دوبارہ کوشش",
  "wallet.svc.amount_unfit_retried":
    "رقم پوری نہ بیٹھی، یکجا کرنے کی دوبارہ کوشش",
  "wallet.svc.cannot_size": "اس منتقلی کا حجم طے نہ ہو سکا۔",
  "wallet.svc.insufficient_at_mint": "{mint} پر بیلنس ناکافی۔",
  "wallet.svc.inexact_title":
    "آپ کے ثبوت آف لائن ٹھیک {amount} {unit} نہیں بنا سکتے۔",
  "wallet.svc.inexact_detail":
    "سب سے چھوٹا ٹوکن جو آپ بھیج سکتے ہیں {spend} {unit} ہے۔ آف لائن کوئی بقایا نہیں ہوتا، سو اضافی {extra} {unit} وصول کنندہ کو چلے جاتے ہیں۔",
  "wallet.svc.no_single_mint":
    "کوئی ایک ٹکسال {amount} {unit} نہیں رکھتی۔ مختلف ٹکسالوں کا ecash ایک ٹوکن میں یکجا نہیں ہو سکتا: پہلے اسے ایک ٹکسال پر جمع کریں، یا الگ الگ رقموں میں بھیجیں۔",
  "wallet.svc.have_tried_send":
    "آپ کے پاس {total} {unit} ہیں، اور آپ نے {amount} بھیجنے کی کوشش کی۔",
  "wallet.svc.invoice_needs":
    "اس بل کو رخ بندی کے ذخیرے سمیت {total} {unit} چاہییں، اور آپ کے پاس {balance} ہیں۔",
  "wallet.svc.nothing_to_move": "{mint} کے پاس منتقل کرنے کو {unit} نہیں۔",
  "wallet.svc.consolidate_memo": "{mint} سے یکجا کرنا",
  "wallet.svc.cannot_size_detail":
    "Lightning رخ بندی فیس کے بعد {from} کوئی کارآمد رقم {to} کو منتقل نہیں کر سکتی۔ اس کے بجائے کوئی مخصوص چھوٹی رقم منتقل کر کے دیکھیں۔",
  "wallet.svc.mint_cannot": "{mint} {action} نہیں کر سکتی۔",
  "wallet.svc.no_nut": "ٹکسال NUT-{nut} کا اعلان نہیں کرتی۔",
  "wallet.svc.unknown_mint":
    "وہ ادائیگی ایسی ٹکسال کا نام لیتی ہے جو آپ استعمال نہیں کرتے۔",
  "wallet.svc.unknown_mint_body":
    "اگر آپ اس پر بھروسا کرتے ہیں تو ٹکسال خود شامل کریں؛ جو ٹکسال آپ نے نہ چنی ہو اس سے کچھ نہیں بھنایا جاتا۔",
  "wallet.svc.no_relay": "کوئی ریلے تعلق نہیں",
  "wallet.svc.no_shared_mint": "کافی بیلنس والی کوئی مشترکہ ٹکسال نہیں",
  "wallet.svc.no_nutzap_info":
    "وصول کنندہ نے nutzap معلومات شائع نہیں کیں (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "ان کی کلید سے بندھا مگر ابھی پہنچا نہیں۔ اسے مکمل کرنے کے لیے اس لین دین کا ٹوکن شیئر کریں۔",
  "wallet.svc.swap_lost":
    "ٹکسال نے یہ تبادلہ کبھی مکمل نہ کیا، سو اس کے بدلے کچھ جاری نہیں ہوا۔",
  "wallet.svc.swap_unreadable":
    "یہ تبادلہ ایسی شکل میں محفوظ ہوا جسے یہ نسخہ دوبارہ نہیں چلا سکتا۔",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR سے تصدیق شدہ",
  "contacts.qr.keys_unverified": "کلیدیں موصول، تصدیق نہیں ہوئی",
  "contacts.qr.not_verified": "ابھی تصدیق نہیں ہوئی",
  "contacts.qr.message": "پیغام",
  "contacts.qr.add": "رابطہ شامل کریں",
  "contacts.qr.scan_title": "QR کوڈ اسکین کریں",
  "contacts.qr.aim": "اپنا کیمرا ان کے QR کوڈ پر رکھیں",
  "contacts.qr.add_desc": "کسی ایسے شخص تک پہنچیں جو میش پر قریب نہیں۔",
  "contacts.qr.peer_id_hint":
    "پیئر شناخت 16 حروف کی ہوتی ہے۔ رابطہ کوڈ airhop: سے شروع ہوتا ہے۔",
  "contacts.qr.or_scan": "یا ان کا QR اسکین کریں",
  "contacts.qr.trust_note":
    "صرف وہی QR ان کی کلید کی تصدیق کرتا ہے جسے آپ کیمرے سے اسکین کریں۔ چسپاں کیا گیا کوڈ ان کی کلیدیں تو لاتا ہے مگر یہ ثبوت نہیں کہ وہ انہی کا ہے۔",
  "contacts.qr.peer_id": "پیئر شناخت یا رابطہ کوڈ",
  "contacts.qr.peer_id_placeholder": "شناخت یا رابطہ کوڈ چسپاں کریں",
  "contacts.qr.scan_camera_a11y": "کیمرے سے QR کوڈ اسکین کریں",
  "contacts.qr.scan_camera_desc": "اپنا کیمرا استعمال کریں",
  "contacts.qr.upload_a11y": "گیلری سے QR تصویر اپ لوڈ کریں",
  "contacts.qr.upload": "گیلری سے اپ لوڈ کریں",
  "contacts.qr.upload_desc": "محفوظ شدہ QR تصویر چنیں",
  "contacts.qr.scan_a11y": "QR کوڈ اسکین کر کے رابطہ شامل کریں",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16 حروف کی پیئر شناخت، airhop://peer/… کا ربط، یا رابطہ کوڈ چسپاں کریں۔",
  "contacts.scan.camera_label": "کیمرے تک رسائی",
  "contacts.scan.camera_purpose": "کسی رابطے کا QR کوڈ اسکین کرنا",
  "contacts.scan.camera_needed":
    "اسکین کے لیے کیمرے تک رسائی درکار ہے۔ آپ پھر بھی پیئر شناخت سے شامل کر سکتے ہیں۔",
  "contacts.scan.camera_failed":
    "کیمرا شروع نہیں ہو سکا۔ کیمرے کی دوسری ایپس بند کر کے دوبارہ کوشش کریں۔",
  "contacts.scan.photo_label": "تصاویر تک رسائی",
  "contacts.scan.photo_purpose": "محفوظ کیا ہوا QR کوڈ اسکین کرنا",
  "contacts.scan.photo_needed":
    "تصویر چننے کے لیے تصاویر تک رسائی درکار ہے۔ آپ پھر بھی پیئر شناخت سے شامل کر سکتے ہیں۔",
  "contacts.scan.no_qr": "اس تصویر میں Airhop کا کوئی QR کوڈ نہیں ملا۔",
  "contacts.scan.unreadable": "اس تصویر سے QR کوڈ نہیں پڑھا جا سکا۔",
  "contacts.scan.bitchat_expired":
    "وہ bitchat کوڈ ختم ہو چکا ہے۔ ان سے کہیں کہ اپنا QR دوبارہ کھولیں۔",
  "contacts.scan.tampered":
    "یہ QR کوڈ درست نہیں: اس کی پیئر شناخت اس کی کلیدوں سے میل نہیں کھاتی۔ ہو سکتا ہے اس سے چھیڑ چھاڑ ہوئی ہو۔",
  "contacts.scan.already_added": "پہلے ہی آپ کے رابطوں میں ہے",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "کیمرے تک رسائی کا انتظار…",
  "contacts.verify.camera_off": "کیمرا بند ہے",
  "contacts.verify.open_settings": "ترتیبات کھولیں",
  "contacts.verify.verified": "تصدیق شدہ",
  "contacts.verify.different": "مختلف رابطہ",
  "contacts.verify.scan_again": "دوبارہ اسکین کریں",
  "contacts.verify.failed": "تصدیق نہیں ہو سکی",
  "contacts.verify.done": "ہو گیا",
  "contacts.verify.title": "{name} کی تصدیق کریں",
  "contacts.verify.aim": "اپنا کیمرا ان کے QR کوڈ پر رکھیں",
  "contacts.verify.camera_off_body":
    "QR سے تصدیق کے لیے ترتیبات میں کیمرے تک رسائی چالو کریں۔",
  "contacts.verify.match_body":
    "{name} کی کلید میل کھاتی ہے۔ آپ اس رابطے پر بھروسا کر سکتے ہیں۔",
  "contacts.verify.different_body":
    "یہ QR کسی اور کا ہے۔ {name} سے کہیں کہ اپنا کوڈ دکھائیں۔",
  "contacts.verify.tampered_body":
    "اس QR سے چھیڑ چھاڑ لگتی ہے: اس کی شناخت اس کی کلید سے میل نہیں کھاتی۔",
  "contacts.verify.choose_title": "آپ کیسے جانچنا چاہتے ہیں؟",
  "contacts.verify.choose_body":
    "دونوں اس بات کی تصدیق کرتے ہیں کہ اس فون پر موجود کلیدیں واقعی {name} کی ہیں۔",
  "contacts.verify.method_scan": "ان کا کوڈ اسکین کریں",
  "contacts.verify.method_scan_sub": "وہ آپ کے ساتھ یہیں ہیں",
  "contacts.verify.method_compare": "کوڈ کا موازنہ کریں",
  "contacts.verify.method_compare_sub": "کال پر ایک دوسرے کو پڑھ کر سنائیں",
  "contacts.verify.no_keys":
    "اس رابطے کی ابھی کوئی کلید نہیں۔ انہیں پیغام بھیجیں، یا ملاقات پر ان کا کوڈ اسکین کریں۔",
  "contacts.verify.compare_title": "یہ ایک دوسرے کو پڑھ کر سنائیں",
  "contacts.verify.compare_body":
    "{name} کو وہی چھ الفاظ دکھائی دیتے ہیں۔ اگر وہ میل کھائیں تو آپ دونوں کو معلوم ہو جائے گا کہ کلیدیں اصلی ہیں۔",
  "contacts.verify.codes_match": "یہ میل کھاتے ہیں",
  "contacts.verify.codes_differ": "یہ میل نہیں کھاتے",
  "contacts.verify.compared_body":
    "آپ اور {name} نے وہی کوڈ تصدیق کیا۔ یہ رابطہ تصدیق شدہ ہے۔",

  // ---- Settings: shared chrome ----
  "settings.back": "واپس جائیں",
  "settings.coming_soon": "جلد آ رہا ہے",
  "settings.opens_externally": "{label}، ایپ سے باہر کھلتا ہے",
  "settings.peer_id": "پیئر شناخت",
  "settings.share_peer_id": "اپنی پیئر شناخت شیئر کریں",
  "settings.share_id_short": "شناخت شیئر کریں",
  "settings.peer_id_sheet.title": "آپ کی پیئر شناخت",
  "settings.peer_id_sheet.copy": "پیئر شناخت کاپی کریں",
  "settings.peer_id_sheet.note":
    "یہ صرف تب کام کرتا ہے جب آپ دونوں بلوٹوتھ کی حدود میں ہوں۔ کسی کو کہیں سے بھی پیغام بھیجنے کے قابل بنانے کے لیے اس کے بجائے اپنا QR کوڈ شیئر کریں۔",

  // ---- Settings: hub rows ----
  "settings.section.general": "عمومی",
  "settings.section.general_desc":
    "اختیاری خصوصیات، بھیجنا واپس لینا، میڈیا، دوبارہ ترتیب",
  "settings.section.privacy": "رازداری اور تحفظ",
  "settings.section.privacy_desc":
    "Forward secrecy، دستخط شدہ پیکٹ، مسدود پیئرز",
  "settings.section.network": "نیٹ ورک اور ریلے",
  "settings.section.network_desc":
    "انٹرنیٹ کا متبادل، nostr ریلے، bitchat سے ہم آہنگی",
  "settings.section.permissions": "اجازتیں",
  "settings.section.permissions_desc":
    "بلوٹوتھ، مقام، اطلاعات، کیمرا، مائیکروفون",
  "settings.section.storage": "ذخیرہ اور ڈیٹا",
  "settings.section.diagnostics": "تشخیص",

  // ---- Settings: group headings ----
  "settings.group.transports": "ذرائع",
  "settings.group.internet": "انٹرنیٹ",
  "settings.group.nearby": "قریب",
  "settings.group.sync": "ہم وقت سازی",
  "settings.group.features": "خصوصیات",
  "settings.group.messages": "پیغامات",
  "settings.group.local": "مقامی",
  "settings.group.media": "میڈیا",
  "settings.group.reset": "دوبارہ ترتیب",
  "settings.group.always_on": "ہمیشہ چالو",
  "settings.group.notifications": "اطلاعات",
  "settings.group.blocked": "مسدود",
  "settings.group.theme": "تھیم",
  "settings.group.font": "فونٹ",
  "settings.group.language": "زبان",
  "settings.section.diagnostics_desc": "تعلق کی حالت اور قریبی آلات",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "بلوٹوتھ روابط",
  "settings.diag.ble_links_desc": "وہ آلات جن سے یہ فون براہ راست جڑا ہوا ہے",
  "settings.diag.lan": "مقامی نیٹ ورک",
  "settings.diag.lan_desc": "ایک ہی Wi-Fi نیٹ ورک پر موجود فون",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "راؤٹر کے بغیر فون سے فون",
  "settings.diag.wifi_active": "چل رہا ہے",
  "settings.diag.wifi_unsupported": "اس آلے پر معاون نہیں",
  "settings.diag.wifi_permission": "کسی اجازت کی وجہ سے مسدود",
  "settings.diag.wifi_unavailable": "اس وقت دستیاب نہیں",
  "settings.diag.wifi_unpaired": "کچھ بھی جوڑا نہیں گیا",
  "settings.diag.wifi_unknown": "ریڈیو کا انتظار",
  "settings.diag.relays": "Nostr ریلے",
  "settings.diag.relays_desc":
    "مقامی چینلوں اور انٹرنیٹ رسائی کے لیے استعمال ہوتے ہیں",
  "settings.diag.connected": "جڑا ہوا",
  "settings.diag.disconnected": "جڑا ہوا نہیں",
  "settings.diag.peer_direct": "براہ راست ربط",
  "settings.diag.peer_relayed": "کسی دوسرے آلے کے ذریعے سنا گیا",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "سگنل کی کوئی پیمائش نہیں",
  "settings.diag.no_peers": "حدود میں کوئی نہیں",
  "settings.diag.no_peers_desc": "{links} ریڈیو روابط کھلے ہیں",
  "settings.diag.gcs_size": "فلٹر کا حجم",
  "settings.diag.gcs_size_desc": "ہوا میں بھیجا گیا سب سے بڑا ہم وقت سازی فلٹر",
  "settings.diag.fpr": "غلط مثبت کی شرح",
  "settings.diag.fpr_desc":
    "فلٹر کتنی بار ایسا پیکٹ ہونے کا دعویٰ کرتا ہے جو ہمارے پاس نہیں",
  "settings.diag.bytes": "{n} بائٹ",
  "settings.diag.footnote":
    "یہاں کچھ بھی بدلا نہیں جا سکتا۔ یہ قدریں طے شدہ ہیں تاکہ Airhop bitchat سے ہم آہنگ رہے۔",
  "settings.section.storage_desc": "استعمال اور کیش",
  "settings.section.appearance": "ظاہری شکل",
  "settings.section.appearance_desc": "تھیم، فونٹ اور زبان",
  "settings.section.help": "مدد اور رائے",
  "settings.section.help_desc":
    "ہم سے رابطہ کریں، خرابی کی اطلاع دیں، یا عام سوالات پڑھیں",
  "settings.section.support": "معاونت",
  "settings.section.support_desc": "ترقی جاری رکھنے میں مدد کریں",
  "settings.section.about": "تعارف",
  "settings.section.about_desc": "ورژن، تبدیلیوں کی فہرست، اور ماخذ کوڈ",

  // ---- Settings: general ----
  "settings.general.undo": "بھیجنا واپس لینا",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "بٹوہ",
  "settings.general.undo_seconds": "{count} سیکنڈ",
  "settings.general.undo_a11y": "بھیجنا واپس لینا: {value}",
  "settings.general.quality_a11y": "اپ لوڈ کا معیار {value} کریں",
  "settings.general.undo_desc":
    "بھیجے گئے پیغام کو تھوڑی دیر روکے رکھتا ہے تاکہ نکلنے سے پہلے آپ اسے واپس لے سکیں",
  "settings.general.undo_off_desc": "فوراً بھیجیں، واپس لینے کا موقع نہیں",
  "settings.general.undo_2": "2 سیکنڈ",
  "settings.general.undo_2_desc": "واپس لینے کا مختصر موقع",
  "settings.general.undo_10": "10 سیکنڈ",
  "settings.general.undo_10_desc": "سب سے طویل وقفہ",
  "settings.general.quality": "اپ لوڈ کا معیار",
  "settings.general.quality_desc":
    "آپ کے کیمرے یا گیلری سے بھیجی گئی تصاویر پر لاگو ہوتا ہے۔ ہر تصویر بہرحال میش کے مطابق ڈھالی جاتی ہے۔",
  "settings.general.quality_low": "کم",
  "settings.general.quality_low_desc":
    "سب سے چھوٹی تصاویر، بھیجنے میں تیز ترین",
  "settings.general.quality_medium": "درمیانہ",
  "settings.general.quality_medium_desc": "تفصیل اور رفتار کا توازن",
  "settings.general.quality_high": "زیادہ",
  "settings.general.quality_high_desc": "سب سے زیادہ تفصیل رکھتا ہے",
  "settings.general.feature_wallet_desc":
    "میش کے ذریعے پیئر سے پیئر Cashu ecash بھیجیں",
  "settings.general.feature_wallet_a11y": "بٹوہ (ہمیشہ چالو)",
  "settings.general.feature_ai_desc":
    "آلے پر نجی معاون، کوئی نیٹ ورک رابطہ نہیں",
  "settings.general.feature_feeds": "فیڈز",
  "settings.general.feature_feeds_desc":
    "Bluesky اور Mastodon کی فیڈز پڑھیں اور ان پر لکھیں",
  "settings.general.show_media": "میڈیا خودکار طور پر دکھائیں",
  "settings.general.show_media_desc":
    "تصاویر اور ویڈیوز چیٹ میں نظر آتی ہیں، یا ایک ٹچ کے پیچھے رہتی ہیں",
  "settings.general.reset": "ترتیبات دوبارہ ترتیب دیں",
  "settings.general.media_retention": "میڈیا اتنی دیر رکھیں",
  "settings.general.media_retention_desc":
    "منتخب مدت کے بعد تصاویر، ویڈیوز اور صوتی نوٹ حذف ہو جاتے ہیں",
  "settings.general.media_retention_sheet":
    "منتخب کریں کہ میڈیا اس آلے پر کتنی دیر رہے۔ حذف شدہ میڈیا واپس نہیں لایا جا سکتا۔",
  "settings.general.retention_7_desc":
    "سب سے کم نشان چھوڑتا ہے۔ بہترین جب خطرہ خود فون ہو۔",
  "settings.general.retention_14_desc":
    "سگنل کے بغیر ایک دو ہفتوں کے لیے درمیانی راستہ۔",
  "settings.general.retention_30_desc":
    "گفتگو کو سب سے دیر تک پڑھنے کے قابل رکھتا ہے، اور ڈسک پر سب سے زیادہ جگہ لیتا ہے۔",
  "settings.general.reset_desc":
    "ہر ترجیح کو اس کی طے شدہ حالت پر لوٹاتا ہے، آپ کی شناخت، پیغامات، رابطوں اور بٹوے کو چھوئے بغیر",
  "settings.general.reset_title": "ترتیبات دوبارہ ترتیب دیں؟",
  "settings.general.reset_body":
    "ہر ترجیح اپنی طے شدہ حالت پر لوٹ جاتی ہے: ظاہری شکل، بھیجنا واپس لینا، اور رابطہ کاری (انٹرنیٹ، Tor، گیٹ وے، پل، ریلے)۔ آپ کی شناخت، پیغامات، رابطے اور بٹوہ اچھوتے رہتے ہیں۔",
  "settings.general.reset_confirm": "دوبارہ ترتیب دیں",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "براہ راست پیغامات کے لیے Double Ratchet ہمیشہ چالو رہتا ہے",
  "settings.security.signed_packets": "دستخط شدہ پیکٹ",
  "settings.security.signed_packets_desc": "ہر پیکٹ پر Ed25519 دستخط ہوتا ہے",
  "settings.security.hide_previews": "اطلاعات کی جھلک چھپائیں",
  "settings.security.hide_previews_desc":
    "بھیجنے والے اور پیغام کو آپ کی لاک اسکرین سے دور رکھتا ہے، جو انہیں کھولے بغیر دکھا دیتی ہے",
  "settings.security.no_blocked": "کوئی مسدود پیئر نہیں",
  "settings.security.no_blocked_desc":
    "مسدود پیئرز آپ کو پیغام نہیں بھیج سکتے اور نہ ہی میش ٹیب میں نظر آتے ہیں",
  "settings.security.unblock_title": "اس پیئر کی بندش ہٹائیں",
  "settings.security.unblock": "بندش ہٹائیں",
  "settings.security.unblock_peer": "{name} کی بندش ہٹائیں",
  "settings.security.unblock_body":
    "{name} دوبارہ آپ کو پیغام بھیج سکیں گے اور قریب ہونے پر میش ٹیب میں پھر نظر آئیں گے۔",

  // ---- Settings: network and relays ----
  "settings.network.internet": "انٹرنیٹ کا متبادل",
  "settings.network.internet_desc":
    "جب میش کے پیئرز حدود سے باہر ہوں تو Nostr ریلے کے ذریعے جاری رکھیں",
  "settings.network.internet_off_title": "انٹرنیٹ بند کریں؟",
  "settings.network.internet_off_body":
    "Airhop صرف بلوٹوتھ پر چلے گا۔ وہ کسی بھی Nostr ریلے سے رابطہ بند کر دے گا، اور Tor، انٹرنیٹ گیٹ وے اور میش پل سب بند ہو جائیں گے۔ قریبی بلوٹوتھ چیٹ کام کرتی رہے گی۔",
  "settings.network.turn_off": "بند کریں",
  "settings.network.discovery": "جیو ریلے کی دریافت",
  "settings.network.discovery_desc":
    "300 سے زائد بکھرے ہوئے ریلے میں سے کسی مقامی خانے کے قریب ترین ریلے خودکار چنیں",
  "settings.network.discovery_needs_relay": "پہلے اپنا ریلے شامل کریں",
  "settings.network.discovery_needs_relay_body":
    "خودکار دریافت ہی Airhop کو قریب ترین ریلے کی طرف بھیجتی ہے۔ اسے بند کرنا تبھی معنی رکھتا ہے جب آپ نے نیچے اپنے ریلے لگا لیے ہوں، اس لیے پہلے کم از کم ایک شامل کریں۔",
  "settings.network.custom_only_title": "صرف اپنے ریلے استعمال کریں؟",
  "settings.network.custom_only_body":
    "مقامی چینل اور میش پل قریب ترین ریلے خودکار چننا بند کر دیں گے اور صرف وہی استعمال کریں گے جو آپ نے شامل کیے۔ اس سے رسائی کم ہو سکتی ہے، اور ہو سکتا ہے آپ کو bitchat کے صارفین ملنا بند ہو جائیں، جو قریب ترین ریلے پر جمع ہوتے ہیں۔",
  "settings.network.custom": "اپنے ریلے",
  "settings.network.custom_desc":
    "مقامی چینلوں اور میش پل کے لیے اپنے ریلے شامل کریں",
  "settings.network.custom_added": "{max} میں سے {count} شامل",
  "settings.network.dm_relays": "پیغامات کے ریلے",
  "settings.network.dm_relays_desc":
    "براہ راست پیغامات اور نجی چینل ہمیشہ یہی استعمال کرتے ہیں۔ آپ کے اپنے ریلے انہیں نہیں بدلتے۔",
  "settings.network.discovery_back_on": "جیو ریلے کی دریافت دوبارہ چالو",
  "settings.network.discovery_back_on_body":
    "وہ آپ کا آخری اپنا ریلے تھا۔ مقامی چینلوں کو شائع کرنے کی جگہ چاہیے، اس لیے Airhop دوبارہ قریب ترین ریلے خودکار چن رہا ہے۔",
  "settings.network.add_relay": "ریلے شامل کریں",
  "settings.network.remove_relay": "{url} ہٹائیں",
  "settings.network.add_short": "شامل کریں",
  "settings.network.relay_limit":
    "آپ {count} ریلے شامل کر سکتے ہیں۔ دوسرا شامل کرنے کے لیے ایک ہٹائیں۔",
  "settings.network.relay_duplicate": "وہ ریلے پہلے ہی آپ کی فہرست میں ہے۔",
  "settings.network.relay_invalid":
    "درست ریلے میزبان درج کریں، مثلاً relay.example.com۔ پورٹ صرف تب چاہیے جب ریلے طے شدہ پورٹ استعمال نہ کرتا ہو۔ IP پتے اور مقامی نام قابل قبول نہیں۔",
  "settings.network.lan": "مقامی نیٹ ورک",
  "settings.network.lan_desc":
    "اسی WiFi پر موجود لوگوں تک پہنچیں، iPhone اور Android کے درمیان بھی۔ نیٹ ورک پر موجود دوسرے آلات دیکھ سکتے ہیں کہ آپ Airhop چلا رہے ہیں۔",
  "settings.network.lan_searching": "اس نیٹ ورک پر کوئی Airhop آلہ نہیں",
  "settings.network.lan_active": "اس نیٹ ورک پر منسلک",
  "settings.network.lan_unavailable": "کسی WiFi نیٹ ورک پر نہیں",
  "settings.network.lan_permission":
    "Airhop کے لیے مقامی نیٹ ورک تک رسائی بند ہے",
  "settings.network.lan_unsupported": "اس آلے پر دستیاب نہیں",
  "settings.network.lan_foreground":
    "Airhop کے پس منظر میں جانے پر رک جاتا ہے۔ بلوٹوتھ چلتا رہتا ہے۔",
  "settings.network.wifi_pair": "جوڑا بنانا",
  "settings.network.wifi_paired": "جوڑے گئے آلات",
  "settings.network.wifi_pair_find": "آلہ تلاش کریں",
  "settings.network.wifi_pair_find_desc":
    "قریبی ایسا iPhone تلاش کریں جو خود کو دکھا رہا ہو۔ دونوں فونز کو iOS 26 یا بعد کا درکار ہے۔",
  "settings.network.wifi_pair_show": "یہ iPhone دکھائیں",
  "settings.network.wifi_pair_show_desc":
    "قریبی iPhone کو یہ تلاش کرنے دیں۔ ایک تلاش کرتا ہے، دوسرا دکھاتا ہے، ایک ہی وقت میں۔",
  "settings.network.wifi_pair_find_action": "قریبی iPhone منتخب کریں",
  "settings.network.wifi_pair_show_action": "اس iPhone کو قابل دریافت بنائیں",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware اس وقت دستیاب نہیں ہے",
  "settings.network.wifi_pair_forget": "Settings ایپ میں جوڑا ہٹائیں",
  "settings.network.bitchat": "bitchat سے ہم آہنگی",
  "settings.network.bitchat_desc":
    "وہی BLE میش جو bitchat کی ہے، مکمل طور پر باہم کارگر۔ یہ ہمیشہ چالو رہتا ہے اور بند نہیں کیا جا سکتا۔",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "پس منظر میں چلائیں",
  "settings.conn.background_desc": "Airhop بند ہونے پر بھی میش چلتی رکھیں",
  "settings.conn.background_on_title": "میش چلتی رکھیں؟",
  "settings.conn.background_on_body":
    "Airhop بند ہونے پر بھی پہنچاتا اور وصول کرتا رہتا ہے، اس لیے آپ کی غیر موجودگی میں بھی پیغام پہنچتے ہیں۔ اس دوران Android ایک جاری اطلاع دکھاتا ہے۔",
  "settings.conn.background_off_title": "Airhop بند ہونے پر میش روک دیں؟",
  "settings.conn.background_off_body":
    "پیغام صرف تبھی پہنچیں گے جب Airhop کھلا ہو، اور یہ فون قریبی لوگوں کے لیے پہنچانا بند کر دے گا۔ جاری اطلاع ختم ہو جائے گی۔",
  "settings.conn.live_voice": "براہ راست آواز",
  "settings.conn.live_voice_desc": "قریبی لوگوں سے واکی ٹاکی کی طرح بات کریں",
  "settings.conn.live_voice_on_title": "براہ راست آواز چالو کریں؟",
  "settings.conn.live_voice_on_body":
    "مائیک دبائے رکھنے سے آپ کی آواز بولتے ہی بلوٹوتھ کی حدود میں موجود سب تک جاتی ہے، اور ان کی آواز آپ کے فون پر بجتی ہے۔ کچھ بھی ریکارڈ نہیں ہوتا۔",
  "settings.conn.live_voice_off_title": "براہ راست آواز بند کریں؟",
  "settings.conn.live_voice_off_body":
    "مائیک دبائے رکھنے سے اس کے بجائے صوتی نوٹ ریکارڈ ہوتا ہے۔ چھوڑنے پر وہ بھیج دیا جاتا ہے، اور جب تک کوئی اسے چلا نہ لے، سنتا کوئی نہیں۔",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor سے رخ بندی",
  "settings.conn.tor_desc":
    "اضافی رازداری کے لیے Nostr ٹریفک کا رخ Tor سے کریں",
  "settings.conn.tor_on_title": "Nostr ٹریفک کا رخ Tor سے کریں؟",
  "settings.conn.tor_on_body":
    "ریلے آپ کا IP پتہ دیکھنا بند کر دیں گے۔ جڑنے میں زیادہ وقت لگتا ہے اور پیغام سست پہنچتے ہیں۔ بلوٹوتھ متاثر نہیں ہوتا۔",
  "settings.conn.tor_off_title": "Tor سے رخ بندی بند کریں؟",
  "settings.conn.tor_off_body":
    "Nostr ٹریفک آپ کے عام تعلق پر لوٹ آتا ہے، اس لیے ریلے آپ کا IP پتہ دوبارہ دیکھیں گے۔ بلوٹوتھ دونوں صورتوں میں متاثر نہیں ہوتا۔",
  "settings.conn.tor_unavailable": "اس نسخے میں Tor سے رخ بندی دستیاب نہیں۔",
  "settings.conn.tor_timeout":
    "Tor کو جڑنے میں ایک منٹ سے زیادہ لگ رہا ہے۔ وہ چالو رہتا ہے اور کوشش جاری رکھتا ہے؛ میش ٹیب بتا دے گا کہ وہ کب رخ بندی کر رہا ہے، یا اگر یہ نیٹ ورک اسے روک رہا ہو۔",
  "settings.conn.tor_failed":
    "Tor شروع نہیں ہو سکا۔ یقینی بنائیں کہ ایپ کو نیٹ ورک تک رسائی حاصل ہے۔",
  "settings.tor.connection": "کنکشن",
  "settings.tor.mode_off": "براہِ راست",
  "settings.tor.mode_off_desc":
    "براہِ راست Tor سے جڑتا ہے۔ سب سے تیز، مگر اس نیٹ ورک کو دیکھنے والا کوئی بھی جان سکتا ہے کہ آپ Tor استعمال کر رہے ہیں۔",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "چھپاتا ہے کہ آپ Tor استعمال کر رہے ہیں، اور جہاں پل بند ہوں وہاں بھی کام کرتا ہے۔ جڑنے میں سب سے سست۔",
  "settings.tor.mode_obfs4": "پل",
  "settings.tor.mode_obfs4_desc":
    "چھپاتا ہے کہ آپ Tor استعمال کر رہے ہیں۔ Snowflake سے تیز، مگر یہ پل عوامی ہیں اور کچھ نیٹ ورک انہیں بلاک کرتے ہیں۔",
  "settings.tor.mode_custom": "اپنے پل",
  "settings.tor.mode_custom_desc":
    "bridges.torproject.org سے حاصل کیے گئے پل استعمال کریں۔ باقی ناکام ہوں تو یہ آزمائیں۔",
  "settings.tor.custom_placeholder": "ہر سطر میں ایک پل کی سطر چسپاں کریں",
  "settings.tor.custom_empty": "پہلے کم از کم ایک پل کی سطر شامل کریں۔",
  "settings.conn.mint_clearnet": "ٹکسال کی ٹریفک کھلے نیٹ پر جانے دیں",
  "settings.conn.mint_clearnet_desc":
    "iOS پر Tor صرف Nostr کو ڈھانپتا ہے۔ ٹکسال کی درخواستیں روکنے کے لیے بند رہنے دیں؛ میش پر ecash بہرحال کام کرتا ہے۔",
  "settings.conn.gateway": "انٹرنیٹ گیٹ وے",
  "settings.conn.gateway_desc":
    "اپنا تعلق قریبی آف لائن فون کو ادھار دیں تاکہ وہ پھر بھی مقامی چینلوں تک پہنچ سکے",
  "settings.conn.gateway_on_title": "انٹرنیٹ گیٹ وے چالو کریں؟",
  "settings.conn.gateway_on_body":
    "قریبی وہ فون جن کا اپنا تعلق نہیں، مقامی چینل کے پیغام آپ کے تعلق سے بھیجیں اور وصول کریں گے۔ اس میں آپ کا موبائل ڈیٹا اور بیٹری خرچ ہوتی ہے، اور ان کے پیغام سرے سے سرے تک خفیہ رہتے ہیں، اس لیے جو گزرتا ہے آپ اسے پڑھ نہیں سکتے۔",
  "settings.conn.gateway_off_title": "انٹرنیٹ گیٹ وے بند کریں؟",
  "settings.conn.gateway_off_body":
    "قریبی آف لائن فون آپ کے تعلق سے مقامی چینلوں تک پہنچنا بند کر دیں گے۔ آپ کے اپنے پیغام متاثر نہیں ہوتے۔",
  "settings.conn.bridge": "میش پل",
  "settings.conn.bridge_desc":
    "اس علاقے کی عوامی #bluetooth چیٹ کو انٹرنیٹ کے ذریعے حدود سے باہر کسی دوسرے بلوٹوتھ مجمعے سے جوڑیں",
  "settings.conn.bridge_on_title": "میش پل چالو کریں؟",
  "settings.conn.bridge_on_body":
    "آپ کے عوامی #bluetooth پیغام انٹرنیٹ کے ذریعے آپ کے محلے میں شائع ہوں گے، تاکہ بلوٹوتھ کی حدود سے باہر کے لوگ انہیں پڑھ سکیں۔ نجی پیغام کبھی پل سے نہیں گزرتے، اور ”صرف قریب“ کسی ایک پیغام کو مقامی رکھتا ہے۔",
  "settings.conn.bridge_off_title": "میش پل بند کریں؟",
  "settings.conn.bridge_off_body":
    "آپ کے عوامی #bluetooth پیغام دوبارہ بلوٹوتھ کی حدود میں رہیں گے، اور پل کے پار والے مجمعے کے پیغام یہاں آنا بند ہو جائیں گے۔",
  "settings.conn.bridge_needs_location": "میش پل کو مقام درکار ہے",
  "settings.conn.bridge_needs_location_desc":
    "وہ آپ کا محلہ مقام کی پیمائش سے معلوم کرتا ہے۔ پل بنانا شروع کرنے کے لیے مقام کی اجازت دیں۔",
  "settings.conn.grant_location": "مقام کی اجازت دیں",
  "settings.conn.grant_short": "اجازت دیں",
  "settings.conn.internet_off": "انٹرنیٹ بند ہے",
  "settings.conn.internet_off_desc":
    "Tor، پل اور گیٹ وے سب انٹرنیٹ استعمال کرتے ہیں۔ انہیں استعمال کرنے کے لیے نیٹ ورک کے تحت انٹرنیٹ کا متبادل چالو کریں۔",
  "settings.conn.turn_on": "چالو کریں",
  "settings.conn.turn_off": "بند کریں",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "بلوٹوتھ",
  "settings.permissions.bluetooth_desc":
    "قریبی آلات ڈھونڈتا ہے اور ان کے درمیان پیغامات پہنچاتا ہے۔ اس کے بغیر میش کام نہیں کر سکتی۔",
  "settings.permissions.location": "مقام",
  "settings.permissions.location_desc":
    "قریبی علاقے کے چینل کھولتا ہے۔ اس کے بغیر وہ چینل بند رہتے ہیں اور بلوٹوتھ میش معمول کے مطابق چلتی رہتی ہے۔",
  "settings.permissions.notifications": "اطلاعات",
  "settings.permissions.notifications_desc":
    "ایپ بند ہونے پر بھی نئے پیغامات کی اطلاع پائیں۔ اس کے بغیر آپ انہیں تبھی دیکھیں گے جب Airhop کھولیں گے۔",
  "settings.permissions.camera": "کیمرا",
  "settings.permissions.camera_desc":
    "QR کوڈ اسکین کرتا ہے اور بھیجنے کے لیے تصاویر یا ویڈیوز بناتا ہے۔ اس کے بغیر بھی آپ گیلری سے میڈیا شیئر کر سکتے ہیں۔",
  "settings.permissions.photos": "تصاویر",
  "settings.permissions.photos_desc":
    "آپ کی گیلری سے تصاویر بھیجتا ہے اور موصول میڈیا محفوظ کرتا ہے۔ اس کے بغیر بھی آپ کیمرے سے نئی تصاویر بنا کر بھیج سکتے ہیں۔",
  "settings.permissions.microphone": "مائیکروفون",
  "settings.permissions.microphone_desc":
    "صوتی پیغام ریکارڈ کر کے بھیجتا ہے یا براہ راست آواز چلاتا ہے۔ اس کے بغیر صوتی پیغام اور براہ راست آواز کام نہیں کریں گے۔",
  "settings.permissions.allow": "یہ اجازت دیں",
  "settings.permissions.open_settings":
    "یہ اجازت بدلنے کے لیے نظام کی ترتیبات کھولیں",
  "settings.permissions.system": "نظام",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "نیٹ ورک کا استعمال",
  "settings.storage.storage_usage": "ذخیرے کا استعمال",
  "settings.storage.storage_usage_desc":
    "پیغامات، بٹوے کے ثبوت، اور کیش میں موجود منسلکات",
  "settings.storage.session_usage": "یہ نشست · {sent} بھیجا، {received} موصول",
  "settings.storage.cache": "کیش",
  "settings.storage.cache_desc": "{size} منسلکات",
  "settings.storage.clear_cache": "منسلکات کا کیش صاف کریں",
  "settings.storage.clear": "صاف کریں",
  "settings.storage.clear_title": "کیش میں موجود میڈیا صاف کریں؟",
  "settings.storage.clear_body":
    "تصاویر، ویڈیوز، صوتی نوٹ اور فائلیں اس آلے سے ہٹا دی جاتی ہیں، بھیجی ہوئی بھی اور موصول شدہ بھی۔ انہیں دوبارہ ڈاؤن لوڈ نہیں کیا جا سکتا: ان کے بلبلے یہ بتا دیں گے، اور آپ بھیجنے والے سے دوبارہ بھیجنے کو کہہ سکتے ہیں۔ پیغامات اور بٹوہ اچھوتے رہتے ہیں۔",
  "settings.storage.cleared": "کیش صاف ہو گیا",
  "settings.storage.freed": "{size} خالی ہوئی۔",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "ظاہری شکل {value} کریں",
  "settings.font.set_a11y": "یکساں چوڑائی کا فونٹ {value} کریں",
  "settings.font.system": "نظام",
  "settings.font.system_desc":
    "آپ کے آلے کا طے شدہ یکساں چوڑائی کا فونٹ استعمال کرتا ہے",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "جدید اور پڑھنے میں آسان",
  "settings.language.en": "انگریزی",
  "settings.language.am": "امہاری",
  "settings.language.ar": "عربی",
  "settings.language.bn": "بنگالی",
  "settings.language.my": "برمی",
  "settings.language.zh_hans": "چینی (سادہ)",
  "settings.language.zh_hant": "چینی (روایتی)",
  "settings.language.nl": "ولندیزی",
  "settings.language.fil": "فلپینی",
  "settings.language.fr": "فرانسیسی",
  "settings.language.ka": "جارجیائی",
  "settings.language.de": "جرمن",
  "settings.language.hi": "ہندی",
  "settings.language.id": "انڈونیشیائی",
  "settings.language.it": "اطالوی",
  "settings.language.ja": "جاپانی",
  "settings.language.ko": "کوریائی",
  "settings.language.mg": "ملاگاسی",
  "settings.language.ms": "ملائی",
  "settings.language.ne": "نیپالی",
  "settings.language.fa": "فارسی",
  "settings.language.pl": "پولش",
  "settings.language.pt_br": "پرتگالی (برازیل)",
  "settings.language.pt_pt": "پرتگالی (پرتگال)",
  "settings.language.pa": "پنجابی",
  "settings.language.ru": "روسی",
  "settings.language.es": "ہسپانوی",
  "settings.language.sw": "سواحلی",
  "settings.language.sv": "سویڈش",
  "settings.language.ta": "تامل",
  "settings.language.th": "تھائی",
  "settings.language.tr": "ترکی",
  "settings.language.uk": "یوکرینی",
  "settings.language.ur": "اردو",
  "settings.language.vi": "ویتنامی",
  "settings.language.pseudo": "مصنوعی زبان",
  "settings.language.soon": "جلد آ رہا ہے",
  "settings.language.soon_a11y": "{value}، جلد آ رہا ہے",
  "settings.language.set_a11y": "زبان {value} کریں",
  "settings.language.pending": "اگلی بار کھلنے پر",
  "settings.language.pending_a11y":
    "{value}، اگلی بار Airhop کھولنے پر لاگو ہو گا",
  "settings.language.rtl_restart": "ابھی دوبارہ کھولیں",
  "settings.language.rtl_title": "مکمل کرنے کے لیے Airhop دوبارہ کھولیں",
  "settings.language.rtl_body":
    "{value} دائیں سے بائیں پڑھی جاتی ہے، اور Airhop رخ صرف شروع ہوتے وقت بدل سکتا ہے۔ تبدیلی مکمل کرنے کے لیے اسے بند کر کے دوبارہ کھولیں۔ کچھ ضائع نہیں ہوتا، اور جب تک آپ ایسا نہ کریں آپ کی میش جڑی رہتی ہے۔",
  "settings.theme.light": "روشن",
  "settings.theme.light_desc": "ہمیشہ روشن رنگ استعمال کریں",
  "settings.theme.dark": "تاریک",
  "settings.theme.dark_desc": "ہمیشہ تاریک رنگ استعمال کریں",

  // ---- Settings: profile and identity ----
  "settings.status.online": "آن لائن",
  "settings.status.online_desc": "قابل دریافت، تشہیر اور تلاش کر رہا ہے",
  "settings.status.away": "غیر حاضر",
  "settings.status.away_desc": "میش موقوف، نہ تلاش نہ تشہیر",
  "settings.status.invisible": "پوشیدہ",
  "settings.status.invisible_desc": "تلاش کر رہا ہے، مگر دریافت سے چھپا ہوا",
  "settings.status.title": "حالت",
  "settings.status.set_a11y": "حالت {value} کریں",
  "settings.status.edit": "حالت بدلیں",
  "settings.status.desc": "چنیں کہ میش پر آپ کتنے نمایاں ہوں۔",
  "settings.transfer.identity": "شناخت اور کلیدیں",
  "settings.transfer.identity_desc": "آپ کی پیئر شناخت، صارف نام، اور رابطے",
  "settings.transfer.chats": "چیٹس اور تاریخ",
  "settings.transfer.chats_desc":
    "گفتگو، گروپ، اور وہ چینل جن میں آپ شامل ہوئے",
  "settings.transfer.wallet": "بٹوے کا بیلنس",
  "settings.transfer.wallet_desc": "Cashu کے ثبوت اور لین دین کی تاریخ",
  "settings.transfer.title": "نئے فون پر منتقل کریں",
  "settings.transfer.desc":
    "اپنی شناخت، چیٹس اور بٹوہ کسی دوسرے آلے پر لے جائیں",
  "settings.transfer.coming_soon_a11y": "نئے فون پر منتقل کریں، جلد آ رہا ہے",
  "settings.transfer.body":
    "دونوں فون ساتھ رکھیں اور سب کچھ بلوٹوتھ سے منتقل کریں۔ کچھ بھی کسی سرور سے نہیں گزرتا، اس لیے یہ انٹرنیٹ کے بغیر کام کرتا ہے۔",
  "settings.qr.permission_label": "تصاویر تک رسائی",
  "settings.qr.permission_purpose": "آپ کا QR کوڈ محفوظ کرنا",
  "settings.qr.saved": "محفوظ ہو گیا",
  "settings.qr.saved_body": "QR کوڈ آپ کی تصاویر کی گیلری میں محفوظ ہو گیا۔",
  "settings.qr.save_failed": "محفوظ نہ ہو سکا",
  "settings.qr.save_failed_body": "QR کوڈ محفوظ نہ ہو سکا۔ دوبارہ کوشش کریں۔",
  "settings.qr.share_message": "مجھے Airhop پر شامل کریں",
  "settings.qr.share_body":
    "مجھے Airhop پر شامل کریں — نجی میش پیغام رسانی، پہلے آف لائن۔",
  "settings.qr.show_short": "QR دکھائیں",
  "settings.qr.title": "آپ کا QR کوڈ",
  "settings.qr.note":
    "اس میں آپ کی عوامی کلیدیں ہیں، جن سے دوسرے آپ کو کہیں سے بھی پیغام بھیج سکتے ہیں۔ اسے صرف ان لوگوں سے شیئر کریں جن پر آپ بھروسا کرتے ہیں۔ جب تک آپ اپنی شناخت نہ مٹائیں یہ نہیں بدلے گا۔",
  "settings.qr.code_label": "رابطہ کوڈ",
  "settings.qr.copy_code": "رابطہ کوڈ کاپی کریں",
  "settings.qr.share": "QR کوڈ شیئر کریں",
  "settings.qr.share_short": "QR شیئر کریں",
  "settings.qr.download": "QR کوڈ ڈاؤن لوڈ کریں",
  "settings.qr.download_short": "QR ڈاؤن لوڈ کریں",
  "settings.qr.show": "QR کوڈ دکھائیں",
  "settings.wipe.trigger": "ہنگامی صفائی چلائیں",
  "settings.wipe.trigger_desc":
    "تصدیق کے بغیر فوراً صاف کرنے کے لیے تین بار چھوئیں",
  "settings.wipe.title": "ہنگامی صفائی",
  "settings.wipe.now": "ابھی صاف کریں",
  "settings.wipe.desc": "تمام کلیدیں، پیغامات اور ثبوت فوراً تباہ کر دیتا ہے",
  "settings.wipe.body":
    "یہ آپ کی تمام کلیدیں، پیغامات اور بٹوے کے ثبوت فوراً تباہ کر دے گا۔ اسے واپس نہیں لیا جا سکتا۔",
  "settings.wipe.in_progress": "صاف کیا جا رہا ہے",
  "settings.wipe.in_progress_body":
    "آپ کی کلیدیں، پیغامات اور فائلیں تباہ کی جا رہی ہیں۔ اس میں چند سیکنڈ لگتے ہیں، اور ایپ بند ہو جائے تب بھی یہ خود مکمل ہو جاتا ہے۔",
  "settings.wipe.got_it": "سمجھ گیا",
  "settings.wipe.keys_failed": "کلیدیں تباہ نہ ہو سکیں",
  "settings.wipe.keys_failed_body":
    "آپ کے پیغامات، رابطے اور بٹوہ ختم ہو گئے، مگر آلے نے آپ کی کلیدیں چھوڑنے سے انکار کر دیا۔ آلہ کھولیں اور دوبارہ صاف کریں۔",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "ہم سے رابطہ کریں",
  "settings.help.contact_a11y": "{address} پر ای میل کریں",
  "settings.help.bug": "خرابی کی اطلاع دیں",
  "settings.help.bug_desc": "GitHub پر مسئلہ درج کریں",
  "settings.help.bug_a11y": "GitHub پر خرابی کی اطلاع دیں",
  "settings.help.faq": "اکثر پوچھے گئے سوالات",
  "settings.help.faq_desc": "عام سوالوں کے جواب",
  "settings.help.faq_a11y": "اکثر پوچھے گئے سوالات کھولیں",
  "settings.help.terms_desc": "Airhop کیسے استعمال کیا جا سکتا ہے",
  "settings.help.terms_a11y": "شرائط استعمال کھولیں",
  "settings.help.privacy_desc": "ہم کیا جمع نہیں کرتے",
  "settings.help.privacy_a11y": "رازداری کی پالیسی کھولیں",

  // ---- Settings: support ----
  "settings.support.card": "کارڈ یا UPI",
  "settings.support.card_desc": "نیٹ بینکنگ اور بٹوے، دنیا بھر میں",
  "settings.support.card_a11y": "کارڈ، UPI، نیٹ بینکنگ یا بٹوے سے معاونت کریں",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "ماہانہ یا ایک بار، کوئی پلیٹ فارم فیس نہیں",
  "settings.support.sponsors_a11y": "GitHub Sponsors کے ذریعے معاونت کریں",
  "settings.support.note":
    "میں Airhop اپنے فارغ وقت میں بناتا ہوں۔ نہ کوئی سرمایہ کار ہے نہ اشتہار۔ اگر یہ آپ کے کام آتا ہے تو ایک تعاون ترقی جاری رکھنے میں بہت مدد دیتا ہے۔ ہر خصوصیت بہرحال مفت رہتی ہے۔",

  // ---- Settings: about and version ----
  "settings.about.version": "ورژن",
  "settings.about.version_desc": "موجودہ اجرا",
  "settings.about.version_a11y": "ورژن دیکھیں اور اپ ڈیٹ جانچیں",
  "settings.about.release_notes": "اجرا کے نوٹ",
  "settings.about.release_notes_desc": "تازہ ترین اجرا میں کیا نیا ہے",
  "settings.about.release_notes_a11y": "GitHub پر تازہ ترین اجرا کے نوٹ کھولیں",
  "settings.about.source": "ماخذ کوڈ",
  "settings.about.source_a11y": "GitHub پر ماخذ کوڈ کھولیں",
  "settings.about.licenses": "کھلے ماخذ کے لائسنس",
  "settings.about.open_repo": "{name} کا ذخیرہ کھولیں",
  "settings.about.licenses_desc": "فریق ثالث کے کھلے ماخذ پیکج",
  "settings.about.licenses_a11y": "فریق ثالث کے لائسنس دیکھیں",
  "settings.version.codename": "کوڈ نام",
  "settings.version.checking": "جانچا جا رہا ہے",
  "settings.version.check": "اپ ڈیٹ جانچیں",
  "settings.version.checking_title": "اپ ڈیٹ جانچے جا رہے ہیں",
  "settings.version.up_to_date": "آپ تازہ ترین ورژن پر ہیں۔",
  "settings.version.release_notes": "اجرا کے نوٹ دیکھیں",
  "settings.version.made_with": "بنایا گیا",
  "settings.version.number": "ورژن {version}",
  "settings.version.update_to": "{version} پر اپ ڈیٹ کریں",
  "settings.version.update_to_a11y": "ورژن {version} پر اپ ڈیٹ کریں",
  "settings.version.released_under": "{license} کے تحت جاری",
  "settings.version.notes_a11y": "ورژن {version} کے اجرا کے نوٹ دیکھیں",
  "settings.version.tor_paused":
    "Tor چالو ہونے کے دوران اپ ڈیٹ کی جانچ روک دی جاتی ہے، تاکہ وہ آپ کا IP ظاہر نہ کرے۔ اجرا کا صفحہ براؤزر میں دیکھیں۔",
  "settings.version.check_failed":
    "اپ ڈیٹ نہیں جانچے جا سکے۔ اپنا تعلق جانچیں اور دوبارہ کوشش کریں۔",
  "settings.version.downloading": "ڈاؤن لوڈ ہو رہا ہے {percent}%",
  "settings.version.install": "انسٹال کریں",
  "settings.version.download_failed":
    "ڈاؤن لوڈ ناکام ہوا۔ اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} {size} KiB کا ہے، جو {cap} KiB کی حد سے زیادہ ہے۔",
  "transfer.failed.malformed":
    "ایک منسلکہ خراب حالت میں پہنچا اور کھل نہ سکا۔ ان سے دوبارہ بھیجنے کو کہیں۔",
  "transfer.failed.unsupported_type":
    "ایک منسلکہ ایسی شکل میں پہنچا جسے یہ ایپ نہیں کھول سکتی۔",
  "transfer.failed.type_mismatch":
    "ایک منسلکہ رد کر دیا گیا: اس کا مواد اس فائل کی قسم سے میل نہیں کھاتا جس کا وہ دعویٰ کرتا ہے۔",
  "transfer.failed.storage":
    "ایک منسلکہ پہنچا مگر محفوظ نہ ہو سکا۔ اپنی خالی جگہ جانچیں۔",
  "transfer.badge.waiting": "انتظار میں · {name}",
  "transfer.badge.active_count": "{count} منتقلیاں",
  "transfer.badge.sending": "{name} بھیجا جا رہا ہے",
  "transfer.badge.receiving": "{name} موصول ہو رہا ہے",
  "transfer.badge.a11y": "{label}، {percent} فیصد۔ گفتگو کھولیں۔",
  "transfer.kind.photo": "تصویر",
  "transfer.kind.video": "ویڈیو",
  "transfer.kind.voice": "صوتی نوٹ",
  "transfer.this.photo": "یہ تصویر",
  "transfer.this.video": "یہ ویڈیو",
  "transfer.this.voice": "یہ صوتی نوٹ",
  "transfer.this.file": "یہ فائل",
  "transfer.kind.document": "دستاویز",
  "transfer.kind.voice_preview": "صوتی نوٹ",
  "transfer.kind.photo_preview": "تصویر",
  "transfer.kind.video_preview": "ویڈیو",
  "transfer.kind.document_preview": "دستاویز",

  // ---- System notifications ----
  "notif.channel.messages": "پیغامات",
  "notif.channel.nearby": "قریبی پیئرز",
  "notif.channel.nearby_desc":
    "کبھی کبھار کی اطلاع جب میش کو بلوٹوتھ کی حدود میں لوگ ملیں۔",
  "notif.nearby.body": "اس وقت بلوٹوتھ کی حدود میں۔ میش کھولنے کے لیے چھوئیں۔",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "کوئی",
  "notif.notice_urgent": "فوری اعلان · {content}",
  "notif.notice": "اعلان · {content}",
  "notif.incoming_file": "آنے والی فائل",
  "notif.preview.photo": "📷 تصویر",
  "notif.preview.voice": "🎤 صوتی پیغام",
  "notif.preview.video": "🎥 ویڈیو",
  "notif.preview.document": "📄 دستاویز",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "نیا پیغام",
  "notif.hidden.channel": "نئی سرگرمی",
  "notif.hidden.mention": "آپ کا ذکر ہوا",
  "notif.mention.title": "{sender} نے آپ کا ذکر کیا",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "مزید {count} دکھائیں",
    other: "مزید {count} دکھائیں",
  },
  "chat.channels.show_more_a11y": {
    one: "مزید {count} طے شدہ چینل دکھائیں",
    other: "مزید {count} طے شدہ چینل دکھائیں",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}، {count} غیر پڑھا",
    other: "{label}، {count} غیر پڑھے",
  },
  "a11y.new_count": {
    one: "{label}، {count} نیا",
    other: "{label}، {count} نئے",
  },
  "chat.a11y.unread": {
    one: "{count} غیر پڑھا",
    other: "{count} غیر پڑھے",
  },
  "chat.thread.length_left": {
    one: "{count} باقی",
    other: "{count} باقی",
  },
  "settings.general.retention_days": {
    one: "{count} دن",
    other: "{count} دن",
  },
  "chat.info.group_reach": {
    one: "{count} میں سے {reachable} رکن تک رسائی ہے",
    other: "{count} میں سے {reachable} ارکان تک رسائی ہے",
  },
  "chat.group_members": {
    one: "نجی گروپ  ·  {count} رکن",
    other: "نجی گروپ  ·  {count} ارکان",
  },
  "chat.select.count": {
    one: "{count} منتخب",
    other: "{count} منتخب",
  },
  "chat.select.forward": {
    one: "{count} پیغام آگے بھیجیں",
    other: "{count} پیغامات آگے بھیجیں",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} بول رہا ہے",
    other: "{count} بول رہے ہیں",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} پیئر حدود میں",
    other: "{count} پیئرز حدود میں",
  },
  "mesh.peer.hops_away": {
    one: "{count} چھلانگ کے فاصلے پر",
    other: "{count} چھلانگوں کے فاصلے پر",
  },
  "chat.presence.active": {
    one: "{count} سرگرم",
    other: "{count} سرگرم",
  },
  "chat.presence.nearby": {
    one: "{count} قریب",
    other: "{count} قریب",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} ٹکسال",
    other: "{count} ٹکسالیں",
  },
  "wallet.mint.remove_body": {
    one: "{mint} کے پاس {count} ثبوت میں {balance} {unit} ہیں۔ اسے ہٹانے سے وہ ثبوت اس آلے سے ہمیشہ کے لیے مٹ جائے گا اور اس کا کوئی بیک اپ نہیں۔ پہلے بیلنس نکال لیں یا بھیج دیں۔",
    other:
      "{mint} کے پاس {count} ثبوتوں میں {balance} {unit} ہیں۔ اسے ہٹانے سے وہ ثبوت اس آلے سے ہمیشہ کے لیے مٹ جائیں گے اور ان کا کوئی بیک اپ نہیں۔ پہلے بیلنس نکال لیں یا بھیج دیں۔",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} جمع ادائیگی کا منتظر ہے۔ ایپ کھلنے پر ہر بار دوبارہ جانچا جاتا ہے۔",
    other:
      "{count} جمع ادائیگی کے منتظر ہیں۔ ایپ کھلنے پر ہر بار دوبارہ جانچے جاتے ہیں۔",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints} سے {count} غیر خرچ شدہ ثبوت بحال ہوا۔",
    other: "{mints} سے {count} غیر خرچ شدہ ثبوت بحال ہوئے۔",
  },
  "wallet.backup.already_spent": {
    one: "{count} سکہ ملا مگر وہ پہلے ہی خرچ ہو چکا تھا، اس لیے اس کے بدلے کچھ جمع نہیں ہوا۔ یہ معمول کی بات ہے: آپ نے جو بھی سکہ کبھی خرچ کیا ہو وہ ٹکسال کے ریکارڈ میں موجود رہتا ہے۔",
    other:
      "{count} سکے ملے مگر وہ پہلے ہی خرچ ہو چکے تھے، اس لیے ان کے بدلے کچھ جمع نہیں ہوا۔ یہ معمول کی بات ہے: آپ نے جو بھی سکہ کبھی خرچ کیا ہو وہ ٹکسال کے ریکارڈ میں موجود رہتا ہے۔",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "مزید {count} دکھائیں",
    other: "مزید {count} دکھائیں",
  },
  "wallet.activity.show_more_a11y": {
    one: "مزید {count} ادائیگی دکھائیں",
    other: "مزید {count} ادائیگیاں دکھائیں",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} غیر تصدیق شدہ",
    other: "{count} غیر تصدیق شدہ",
  },
  "wallet.proof_count": {
    one: "{count} ثبوت",
    other: "{count} ثبوت",
  },
  "wallet.spent_removed_detail": {
    one: "{count} ثبوت پہلے ہی خرچ ہو چکا تھا اور اسے ہٹا دیا گیا ہے۔",
    other: "{count} ثبوت پہلے ہی خرچ ہو چکے تھے اور انہیں ہٹا دیا گیا ہے۔",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "قریب کوئی موجود ہے",
    other: "{count} لوگ قریب ہیں",
  },
};

export const ur = { strings, plurals };
