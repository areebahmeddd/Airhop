// ar: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "إلغاء",
  "common.done": "تم",
  "common.ok": "حسنًا",
  "common.close": "إغلاق",
  "common.back": "رجوع",
  "common.delete": "حذف",
  "common.remove": "إزالة",
  "common.add": "إضافة",
  "common.copy": "نسخ",
  "common.copied": "تم النسخ",
  "common.share": "مشاركة",
  "common.continue": "متابعة",
  "common.try_again": "حاول مرة أخرى",
  "common.settings": "الإعدادات",
  "common.off": "معطّل",

  // ---- Dates ----
  "format.today": "اليوم",
  "format.yesterday": "أمس",
  "format.minutes_ago": "قبل {count} د",
  "format.hours_ago": "قبل {count} س",
  "format.days_ago": "قبل {count} ي",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "المحادثات",
  "nav.tab.mesh": "الشبكة",
  "nav.tab.wallet": "المحفظة",
  "nav.tab.profile": "أنت",
  "a11y.tab.new_peers": "{label}، شخص جديد بالجوار",
  "nav.notifications": "الإشعارات",
  "chat.subtab.channels": "القنوات",
  "chat.subtab.direct": "مباشرة",
  "chat.subtab.dms": "الرسائل المباشرة",
  "chat.search.placeholder": "ابحث في المحادثات…",
  "chat.search.a11y": "البحث في المحادثات والرسائل",
  "chat.search.close": "إغلاق البحث",
  "chat.search.clear": "مسح البحث",
  "mesh.view.radar": "عرض الرادار",
  "mesh.view.list": "عرض القائمة",
  "mesh.view.radar_short": "رادار",
  "mesh.view.list_short": "قائمة",

  // ---- Legal document names ----
  "legal.last_updated": "آخر تحديث: {date}",
  "legal.terms": "شروط الخدمة",
  "legal.privacy": "سياسة الخصوصية",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "تواصل خاص عبر الشبكة المتشابكة",
  "onboarding.welcome.cta": "ابدأ الآن",
  "onboarding.welcome.cta_hint": "وافق على الشروط أدناه للمتابعة",
  "onboarding.welcome.consent_a11y": "الموافقة على شروط الخدمة وسياسة الخصوصية",
  "onboarding.welcome.open_terms": "فتح شروط الخدمة",
  "onboarding.welcome.open_privacy": "فتح سياسة الخصوصية",
  "onboarding.welcome.consent":
    "بالضغط على {cta}، فإنك توافق على {terms} و{privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "جارٍ إنشاء هويتك",
  "onboarding.identity.body":
    "يجري إنشاء زوج مفاتيح Ed25519 على هذا الجهاز.\nلا يُرسَل أي شيء إلى أي مكان.",
  "onboarding.identity.failed_heading": "تعذّر إنشاء مفاتيحك",
  "onboarding.identity.failed_body":
    "لم يسمح هذا الجهاز لـ Airhop بتخزينها بأمان. حاول مرة أخرى، أو أعد تشغيل هاتفك ثم افتح Airhop من جديد.",
  "onboarding.identity.steps_a11y": "الخطوات: {steps}",
  "onboarding.identity.step.x25519": "جارٍ إنشاء زوج مفاتيح X25519 الثابت",
  "onboarding.identity.step.ed25519": "جارٍ إنشاء مفتاح التوقيع Ed25519",
  "onboarding.identity.step.keychain":
    "جارٍ تخزين المفاتيح في سلسلة مفاتيح النظام",
  "onboarding.identity.step.peer_id": "جارٍ اشتقاق معرّف النظير",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "اسمك على الشبكة",
  "onboarding.username.peer_id": "معرّف النظير",
  "onboarding.username.card_a11y":
    "اسمك على الشبكة هو {username}. معرّف النظير {peerID}. {props}.",
  "onboarding.username.explanation":
    "هذا الاسم مشتق حتميًا من مفتاحك العام. وهو نفسه على كل جهاز يرى معرّف النظير الخاص بك.",
  "onboarding.username.cta": "ادخل إلى Airhop",
  "onboarding.username.prop.algorithm": "الخوارزمية",
  "onboarding.username.prop.storage": "التخزين",
  "onboarding.username.prop.storage_value": "سلسلة مفاتيح النظام فقط",
  "onboarding.username.prop.account": "حساب مطلوب",
  "onboarding.username.prop.account_value": "لا يوجد",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "مرحبًا بك في Airhop",
  "onboarding.hello.p1":
    "أهلًا. بُني Airhop فوق bitchat كمشروع جانبي مستقل ومفتوح المصدر. وهو غير تابع لمشروع bitchat ولا لـ permissionless tech ولا معتمد منهما، بل هو ببساطة شيء أستمتع ببنائه ومشاركته مع المجتمع.",
  "onboarding.hello.p2":
    "هذا أول إصدار لنظامي iOS وAndroid، ومع أنني اختبرته مع أصدقائي، فمن المرجّح أن تصادف بعض الأخطاء. إن حدث ذلك، أو كانت لديك فكرة لميزة، يسعدني أن أسمع منك. افتح مشكلة على {github} أو راسلني على {email}.",
  "onboarding.hello.p3":
    "إن كان Airhop مفيدًا لك، ففكّر في ترك نجمة على {github} أو تقييم في {store}. هذا يساعد المزيد من الناس على اكتشاف المشروع. شكرًا لتجربتك إياه!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "قبل أن يسألك هاتفك",
  "onboarding.primer.lede": "إليك ما يفعله كل إذن، وما لا يفعله.",
  "onboarding.primer.bluetooth.title": "البلوتوث",
  "onboarding.primer.bluetooth.body":
    "يعثر على الأجهزة القريبة ويمرّر الرسائل بينها. هذا ما يصنع الشبكة، ويعمل دون اتصال بالإنترنت.",
  "onboarding.primer.location.title": "الموقع",
  "onboarding.primer.location.body":
    "يضعك في قنوات المناطق القريبة، من الحي إلى الإقليم. لا يتتبعك Airhop أبدًا ولا يرسل موقعك الدقيق خارج جهازك.",
  "onboarding.primer.notifications.title": "الإشعارات",
  "onboarding.primer.notifications.body":
    "تصلك تنبيهات بالرسائل الجديدة حتى عندما يكون التطبيق مغلقًا. تُنشأ الإشعارات محليًا على جهازك، دون أي خادم.",
  "onboarding.primer.footnote":
    "يمكنك الرفض. ستظل الرسائل تنتقل عبر الإنترنت، ويمكنك تغيير رأيك لاحقًا من الإعدادات.",
  "onboarding.primer.cta_a11y": "المتابعة إلى طلبات الأذونات",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "الوصول إلى البلوتوث",
  "permission.bluetooth.purpose": "العثور على الأجهزة القريبة عبر الشبكة",
  "permission.open_settings": "فتح الإعدادات",
  "permission.not_now": "ليس الآن",
  "permission.blocked_title": "{label} معطّل",
  "permission.blocked_body": "فعّله من الإعدادات من أجل {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "حدث خطأ ما",
  "error.boundary.body":
    "واجه Airhop مشكلة غير متوقعة واضطر إلى إيقاف ما كان يعرضه.",

  // ---- Chats: channel list ----
  "chat.channels.default": "القنوات الافتراضية",
  "chat.channels.yours": "قنواتك",
  "chat.channels.none": "لا توجد قنوات بعد",
  "chat.channels.none_hint":
    "اضغط {plus} في الأعلى للانضمام إلى قناة أو إنشاء واحدة.",
  "chat.channels.none_desc":
    "لا توجد قنوات بعد. استخدم زر الإضافة في الشريط العلوي للانضمام إلى قناة أو إنشاء واحدة.",
  "chat.channels.show_fewer": "عرض عدد أقل من القنوات الافتراضية",
  "chat.channels.show_less": "عرض أقل",
  "chat.channels.info": "معلومات القناة",
  "chat.channels.pin": "تثبيت القناة",
  "chat.channels.unpin": "إلغاء تثبيت القناة",
  "chat.channels.mute": "كتم القناة",
  "chat.channels.unmute": "إلغاء الكتم",
  "chat.channels.leave": "مغادرة القناة",
  "chat.channels.leave_confirm": "مغادرة",
  "chat.channels.clear_body":
    "حذف كل الرسائل في {name}؟ لا يمكن التراجع عن هذا.",
  "chat.channels.leave_body":
    "مغادرة {name}؟ لن تصلك رسائلها بعد الآن، وسيُزال سجلها من هذا الجهاز.",
  "chat.channels.more_options": "خيارات أخرى لـ {name}",
  "chat.channels.teleported_tag": "{level}  ·  عن بُعد",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "مسح المحادثة",
  "chat.dm.remove_contact": "إزالة جهة الاتصال",
  "chat.dm.block": "حظر هذا النظير",
  "chat.dm.block_confirm": "حظر",
  "chat.dm.delete": "حذف المحادثة",
  "chat.dm.delete_body":
    "يزيل هذا المحادثة من قائمتك ويحذف رسائلها. تبقى جهة الاتصال محفوظة، وأي رسالة جديدة منها تبدأ محادثة جديدة.",
  "chat.dm.in_range": "ضمن النطاق",
  "chat.dm.row_hint": "اضغط مرتين مع الاستمرار لمزيد من الخيارات",
  "chat.channels.row_hint": "اضغط مرتين مع الاستمرار لمزيد من الخيارات",
  "chat.dm.you_prefix": "أنت:",
  "chat.dm.none": "لا توجد رسائل مباشرة",
  "chat.dm.none_desc":
    "انتقل إلى تبويب الشبكة واضغط على نظير لبدء رسالة مباشرة مشفّرة.",
  "chat.dm.contact_info": "معلومات جهة الاتصال",
  "chat.dm.pin": "تثبيت المحادثة",
  "chat.dm.unpin": "إلغاء تثبيت المحادثة",
  "chat.dm.mute": "كتم المحادثة",
  "chat.dm.unmute": "إلغاء الكتم",
  "chat.dm.clear_body": "حذف كل الرسائل مع {name}؟ لا يمكن التراجع عن هذا.",
  "chat.dm.remove_contact_body":
    "إزالة {name}؟ يحذف هذا المحادثة وينسى جهة الاتصال. ما زال بإمكانها الوصول إليك إذا راسلتك مجددًا.",
  "chat.dm.block_body":
    "حظر {name}؟ لن تراها في تبويب الشبكة ولن تصلك رسائل منها، حتى لو كانت بالجوار.",
  "chat.dm.more_options": "خيارات أخرى لـ {name}",
  "chat.dm.remove_contact_short": "إزالة جهة الاتصال",
  "chat.dm.block_short": "حظر جهة الاتصال",
  "chat.dm.delete_short": "حذف المحادثة",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "مسح الرسائل",
  "chat.clear_confirm": "مسح",
  "chat.group_badge": "مجموعة",
  "chat.more": "المزيد",
  "chat.no_messages": "لا توجد رسائل بعد",
  "chat.you": "أنت",
  "chat.a11y.channel": "القناة {name}",
  "chat.a11y.group": "المجموعة {name}",
  "chat.a11y.muted": "مكتومة",
  "chat.a11y.pinned": "مثبّتة",

  // ---- Chats: start something new ----
  "chat.new.title": "ابدأ شيئًا جديدًا",
  "chat.new.channel": "إنشاء قناة خاصة",
  "chat.new.channel_label": "قناة خاصة",
  "chat.new.channel_desc":
    "غرفة يمكن لأي شخص لديه الرابط الانضمام إليها. أنشئ واحدة، أو انضم برابط وصلك.",
  "chat.new.group": "إنشاء مجموعة خاصة",
  "chat.new.group_label": "مجموعة خاصة",
  "chat.new.group_desc": "اختر أشخاصًا بعينهم. حتى 16. تبقى على البلوتوث.",
  "chat.new.place": "اذهب إلى مكان عبر الجيوهاش",
  "chat.new.place_label": "اذهب إلى مكان",
  "chat.new.place_desc": "افتح قناة موقع في أي مكان عبر الجيوهاش الخاص بها.",
  "chat.new.reach": "المدى",
  "chat.new.reach_internet": "يصل إلى الأعضاء عبر البلوتوث والإنترنت.",
  "chat.new.reach_mesh": "يعمل ضمن نطاق البلوتوث، لا عبر الإنترنت.",
  "chat.new.reach_internet_desc":
    "يصل إلى الأعضاء عبر الإنترنت أيضًا. ترى المُرحِّلات أن القناة نشطة، لكنها لا ترى رسائلها ولا من فيها أبدًا.",
  "chat.new.reach_mesh_desc":
    "تبقى على الشبكة المحلية. الأكثر خصوصية، لا شيء يغادر نطاق البلوتوث.",
  "chat.new.join_link": "الانضمام إلى قناة خاصة برابط دعوة",
  "chat.new.back_to_chooser": "العودة إلى الاختيار",
  "chat.new.create_channel": "إنشاء قناة",
  "chat.new.name_required": "أدخل اسم القناة أولًا",
  "chat.new.name_taken": "هذا الاسم مستخدم بالفعل",
  "chat.new.create": "إنشاء",
  "chat.new.e2ee": "مشفّرة من طرف إلى طرف. الأعضاء وحدهم يمكنهم قراءة الرسائل.",
  "chat.new.invite_only":
    "بالدعوة فقط. أي شخص تشاركه الرابط يمكنه الانضمام. وتبقى مخفية عن الجميع، حتى عن النظراء القريبين.",
  "chat.new.name_exists": "توجد قناة بهذا الاسم بالفعل.",
  "chat.new.reach_bluetooth_chip": "البلوتوث فقط",
  "chat.new.reach_internet_chip": "بلوتوث + إنترنت",
  "chat.new.have_link": "الانضمام برابط دعوة",

  // ---- Chats: join by link ----
  "chat.join.title": "الانضمام برابط",
  "chat.join.not_airhop": "هذا ليس رابط Airhop.",
  "chat.join.reach_internet": "يصل إلى الأعضاء عبر البلوتوث والإنترنت.",
  "chat.join.reach_mesh": "يبقى ضمن نطاق البلوتوث.",
  "chat.join.contact_card":
    "بطاقة جهة اتصال. تضيفها إلى جهات اتصالك وتفتح المحادثة.",
  "chat.join.unverified": "تعذّر التحقق من هذا الرابط",
  "chat.join.unverified_body":
    "بطاقة جهة الاتصال لا تطابق مفاتيحها، لذلك لم تُضَف. اطلب منهم إرسال واحدة جديدة.",
  "chat.join.paste": "لصق من الحافظة",
  "chat.join.join": "انضمام",
  "chat.join.public_channel": "قناة عامة {name}. يمكن لأي شخص بالجوار قراءتها.",
  "chat.join.private_channel": "قناة خاصة {name}. {reach}",
  "chat.join.dm_with": "رسالة مباشرة مع {name}.",
  "chat.join.joined_as": "انضممت باسم {name}",
  "chat.join.name_clash_body":
    "أنت بالفعل في {name} مختلفة. أسماء القنوات مجرد تسميات، لذلك فتحت هذه الدعوة قناتها الخاصة وبقيت التي كنت فيها كما هي. أعد تسمية أي منهما من معلومات القناة.",
  "chat.join.paste_hint":
    "الصق دعوة تبدأ بـ airhop://. الضغط على الرابط يعمل أيضًا؛ هذا مخصص لرابط لا يمكنك الضغط عليه.",
  "chat.join.key_note":
    "دعوة القناة الخاصة تحمل المفتاح، لذلك الانضمام فوري ولا يُطلب شيء من أحد آخر.",
  "chat.join.offline_note":
    "يعمل دون اتصال. يُقرأ الرابط على هذا الجهاز، وتصل القناة بحسب ما أعدّه منشئها.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "تعذّر فتح تلك الخلية. حاول بعد قليل.",
  "chat.jump.title": "اذهب إلى مكان",
  "chat.jump.saved": "الأماكن المحفوظة",
  "chat.jump.anywhere": "افتح قناة موقع عامة في أي مكان، حتى مكان لست فيه.",
  "chat.jump.geohash_note":
    "أدخل الجيوهاش الخاص به. كل من يقع موقعه في تلك الخلية يشارك القناة.",
  "chat.jump.teleport_note":
    "ستظهر كمنتقل عن بُعد، لا كقريب. وتصل القناة عبر الإنترنت فقط.",
  "chat.jump.level_cell": "خلية {level}",
  "chat.jump.already_here": "أنت هنا بالفعل. اذهب يفتح قناة {name} الخاصة بك.",
  "chat.jump.open_direction": "افتح الخلية إلى {direction}",
  "chat.jump.open_place": "فتح {name}",
  "chat.jump.remove_place": "إزالة {name} من الأماكن المحفوظة",
  "chat.jump.go": "اذهب",
  "chat.jump.how":
    "للعثور على جيوهاش: افتح قناة موقع > اضغط على اسمها > انسخه من هناك.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "تعذّر الوصول إلى كل الأعضاء. حاول مرة أخرى وهم بالجوار.",
  "chat.group.you_were_added": "تمت إضافتك إلى {name}.",
  "chat.group.added_you": "أضافك إلى {name}",
  "chat.group.you_were_removed":
    "تمت إزالتك من {name}. لم يعد بإمكانك القراءة أو الإرسال هنا.",
  "chat.group.removed_you": "أزالك من {name}",
  "chat.group.add_failed": "تعذّرت إضافتهم",
  "chat.group.add_failed_body":
    "لم يتغير شيء. إما أنهم غير متاحين الآن، أو أن المجموعة مكتملة عند 16، أو أنك لست منشئها.",
  "chat.group.remove_failed": "تعذّرت إزالتهم",
  "chat.group.remove_failed_body":
    "لم يتغير شيء. من أنشأ المجموعة وحده يمكنه تغيير من فيها.",
  "chat.group.e2ee":
    "مشفّرة من طرف إلى طرف. الأعضاء وحدهم يمكنهم قراءة الرسائل.",
  "chat.group.cap":
    "حتى 16 شخصًا تختارهم بنفسك. لا يوجد رابط دعوة، فلا ينضم أحد لأن أحدهم أعاد توجيه رابط إليه.",
  "chat.group.bluetooth":
    "البلوتوث فقط. الأعضاء خارج النطاق يستلمون الرسائل بمجرد عودتهم.",
  "chat.group.members_label": "الأعضاء",
  "chat.group.none_in_range":
    "لا أحد ضمن النطاق. يجب أن يكون الأعضاء بالجوار عند إنشائك المجموعة.",
  "chat.group.create_title": "إنشاء مجموعة",
  "chat.group.name_placeholder": "اسم المجموعة",
  "chat.group.create": "إنشاء",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "شبكة محلية · بلوتوث فقط",
  "chat.scope.mesh_desc":
    "يصل إلى الأجهزة ضمن نطاق البلوتوث (نحو 10 إلى 100 متر). لا يحتاج إنترنت. مثالي للتنسيق المحلي.",
  "chat.scope.block": "حي سكني · ~100 م",
  "chat.scope.block_desc":
    "تغطية على مستوى الحي. تُجسَّر الرسائل عبر الإنترنت ليتمكن النظراء خارج نطاق البلوتوث لكن القريبون من المشاركة.",
  "chat.scope.neighborhood": "منطقة · ~1 كم",
  "chat.scope.neighborhood_desc":
    "تغطية على مستوى المنطقة. مدعومة بالمُرحِّلات ليكون النظراء في أنحائها متاحين حتى دون وصلة بلوتوث مباشرة.",
  "chat.scope.city": "مدينة · ~10 كم",
  "chat.scope.city_desc":
    "قناة على مستوى المدينة. تستخدم مُرحِّلات إنترنت محدّدة جغرافيًا للوصول إلى النظراء في أنحاء الحاضرة.",
  "chat.scope.province": "محافظة أو ولاية · ~100 كم",
  "chat.scope.province_desc":
    "تغطية على مستوى المحافظة أو الولاية. مجسّرة عبر الإنترنت لمدى إقليمي يمتد مئات الكيلومترات.",
  "chat.scope.country": "دولة أو إقليم · ~1000 كم",
  "chat.scope.country_desc":
    "تغطية على مستوى الدولة. يمكن لأي مستخدم Airhop أو bitchat في الإقليم الانضمام وقراءة الرسائل.",
  "chat.transport.bluetooth": "البلوتوث فقط",
  "chat.transport.both": "بلوتوث + إنترنت",
  "chat.transport.internet": "الإنترنت فقط",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "الأمر /{cmd}: {hint}",
  "chat.cmd.hug_hint": "أرسل عناقًا دافئًا",
  "chat.cmd.slap_hint": "اصفع بسمكة كبيرة",
  "chat.status.sending": "جارٍ الإرسال…",
  "chat.status.undo_send": "تراجع عن الإرسال",
  "chat.status.undo": "تراجع",
  "chat.status.sent": "أُرسلت",
  "chat.status.received": "استُلمت",
  "chat.status.failed": "فشلت",
  "chat.status.canceled": "أُلغيت",
  "chat.status.waiting": "بالانتظار",
  "chat.status.sending_short": "إرسال",
  "chat.status.receiving": "استقبال",
  "chat.thread.not_available": "غير متاح هنا",
  "chat.thread.private_channel": "قناة خاصة",
  "chat.thread.location_channel": "قناة موقع",
  "chat.thread.public_channel": "قناة عامة",
  "chat.thread.notices": "إعلانات هذه القناة",
  "chat.thread.invite": "دعوة شخص إلى هذه القناة",
  "chat.thread.not_in_range": "خارج نطاق البلوتوث. جارٍ التسليم عبر الإنترنت.",
  "chat.thread.not_nearby":
    "ليس بالجوار. سنسلّم الرسالة عند عودته إلى النطاق أو اتصاله بالإنترنت.",
  "chat.thread.no_keys":
    "يلزم أن تكون ضمن نطاق البلوتوث، أو أن تمسح رمزهم، لمراسلتهم.",
  "chat.geo.card_received":
    "شارك {name} جهة اتصاله. شارك جهتك بالمقابل لتبقيا على تواصل بعد أن يتحرك أي منكما.",
  "chat.geo.exchange_complete":
    "تم تبادل جهات الاتصال. يمكنكما الوصول إلى بعضكما من أي مكان الآن.",
  "chat.geo.keep_person": "احتفظ بهذا الشخص",
  "chat.geo.keep_person_desc":
    "شارك جهة اتصالك لتبقيا على تواصل بعد أن يتحرك أي منكما. سيعرف هويتك الدائمة.",
  "chat.geo.card_sent": "تمت المشاركة · بانتظار جهته",
  "chat.thread.left_cell":
    "لقد غادرت هذه المنطقة، فلم يعد بإمكانهم الوصول إليك هنا. تبادلا الرموز لتبقيا على تواصل من أي مكان.",
  "chat.thread.no_route":
    "تعذّر الوصول إليهم الآن. ستُرسل الرسالة عند توفر مسار.",
  "chat.thread.empty": "لا توجد رسائل بعد",
  "chat.thread.empty_desc": "ابدأ محادثة مشفّرة.",
  "chat.thread.jump_latest": "الانتقال إلى أحدث رسالة",
  "chat.thread.back_to_members": "العودة إلى الأعضاء",
  "chat.thread.nostr_key": "مفتاح Nostr العام",
  "chat.thread.in_range": "ضمن النطاق",
  "chat.voice.not_recorded": "لم تُسجَّل الملاحظة الصوتية",
  "chat.thread.message": "رسالة",
  "chat.thread.message_placeholder": "رسالة…",
  "chat.thread.length_full": "الرسالة ممتلئة",
  "chat.thread.waiting_for": "بانتظار عودة {name} · {percent}٪",
  "chat.thread.peer": "نظير",
  "chat.thread.cancel_transfer": "إلغاء {name}",
  "chat.thread.queued_more": "{count} أخرى بانتظار الإرسال",
  "chat.thread.across_bridge": "{count} عبر الجسر",
  "chat.thread.bridged": "مجسّرة",
  "chat.thread.invite_body":
    "انضم إليّ في {channel} على Airhop — مراسلة خاصة عبر الشبكة تعمل دون إنترنت أولًا.",
  "chat.thread.go_back_unread": "رجوع، {count} غير مقروءة",
  "chat.thread.view_info": "عرض معلومات {name}",
  "chat.thread.notices_new": "إعلانات هذه القناة، {count} جديدة",
  "chat.thread.say_something": "قل شيئًا في {channel}.",
  "chat.thread.jump_latest_new": "الانتقال إلى أحدث رسالة، {count} جديدة",
  "chat.thread.unconfirmed_since": "لم يُؤكَّد أي تسليم منذ {date}",
  "chat.thread.no_reach": "لا نظراء بالجوار · لم يستلمها أحد بعد",
  "chat.thread.channel_needs_internet":
    "الإنترنت معطّل · هذه القناة تصل فقط إلى من هم ضمن نطاق البلوتوث",
  "chat.thread.cell_needs_internet":
    "الإنترنت معطّل · هذه الخلية متاحة عبر الإنترنت فقط",
  "chat.thread.geo_dm_needs_internet":
    "الإنترنت معطّل · هذه المحادثة تُنقل عبر الإنترنت فقط",
  "chat.thread.via_gateway":
    "الإنترنت معطّل · جهاز قريب ينقل هذا عبر الإنترنت نيابة عنك",
  "chat.thread.group_queued":
    "لا أحد من هذه المجموعة بالجوار بعد. ستصلهم عندما يكونون كذلك.",
  "chat.thread.no_group_key": "لم تعد في هذه المجموعة، لذلك لا يمكن إرسال هذا",
  "chat.thread.no_reach_offline":
    "الإنترنت معطّل ولا نظراء بالجوار · لم يستلمها أحد بعد",
  "chat.thread.mention": "الإشارة إلى {name}",
  "chat.thread.someone_talking": "{hold}. {name} يتحدث الآن.",
  "chat.thread.attach_note":
    "تُرسل الملفات ضمن نطاق البلوتوث فقط. النصوص والمدفوعات تصل إلى جهات الاتصال عبر الإنترنت، أما المرفقات فلا.",
  "chat.thread.message_peer": "مراسلة {name}",
  "chat.thread.send": "إرسال الرسالة",
  "chat.thread.group": "مجموعة",
  "chat.bridge.nearby_only": "بالجوار فقط: أبقِ هذه الرسالة خارج جسر الشبكة",
  "chat.bridge.nearby_label": "بالجوار فقط · تبقى على البلوتوث",
  "chat.bridge.bridging_label":
    "يجري التجسير إلى المناطق القريبة · اضغط للجوار فقط",
  "chat.screenshot.you_took": "التقطت لقطة شاشة",
  "chat.screenshot.you_took_private": "التقطت لقطة شاشة · لم يُبلَّغ أحد",
  "chat.screenshot.heads_up": "تنبيه",
  "chat.screenshot.notice": "* التقط {name} لقطة شاشة *",
  "chat.screenshot.notified_dm":
    "أُبلغ {name} بأنك التقطت لقطة شاشة لهذه المحادثة.",
  "chat.screenshot.notified":
    "أُبلغ كل من في هذه القناة بأنك التقطت لقطة شاشة.",
  "chat.screenshot.not_notified":
    "لم يُبلَّغ أحد. هذه القناة عامة، والإعلان عن لقطة شاشة سيسجّل أنك كنت هنا.",
  "chat.thread.error": "خطأ",
  "chat.thread.go_back": "رجوع",
  "chat.bubble.via_bridge": "عبر جسر الشبكة",
  "chat.bubble.view_profile": "عرض ملف {name}",
  "chat.bubble.forwarded": "معاد توجيهها",
  "chat.bubble.attachment": "مرفق",
  "chat.bubble.a11y": "{sender}: {body}. اضغط مطولًا لمزيد من الخيارات.",
  "chat.bubble.failed_retry": "فشل الإرسال. اضغط لإعادة المحاولة.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "معلومات الرسالة",
  "chat.info.delivered_to": "سُلّمت إلى {name}",
  "chat.info.read_by": "قرأها {name}",
  "chat.info.group_reach_desc": "متاح الآن، وليس تأكيد تسليم",
  "chat.info.group_alone": "لا أعضاء آخرون",
  "chat.info.today_at": "اليوم {time}",
  "chat.info.sending": "جارٍ الإرسال…",
  "chat.info.failed": "فشل الإرسال",
  "chat.info.courier": "حملها شخص آخر",
  "chat.info.sent": "أُرسلت",
  "chat.info.queued": "بانتظار الإرسال",
  "chat.info.waiting": "بالانتظار…",
  "chat.action.info": "معلومات الرسالة",
  "chat.action.save_photos": "حفظ في الصور",
  "chat.action.save_copy": "حفظ نسخة",
  "chat.action.forward": "إعادة توجيه",
  "chat.action.select": "تحديد",
  "chat.select.cancel": "إلغاء التحديد",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "الكاميرا",
  "chat.attach.camera_desc": "التقط صورة أو فيديو",
  "chat.attach.library": "مكتبة الصور",
  "chat.attach.library_desc": "اختر من مكتبتك",
  "chat.attach.document": "مستند",
  "chat.attach.document_desc": "أرسل أي ملف أو PDF",
  "chat.attach.voice": "ملاحظة صوتية",
  "chat.attach.voice_desc": "سجّل رسالة صوتية وأرسلها",
  "chat.attach.ecash": "إرسال نقد إلكتروني",
  "chat.attach.ecash_desc": "أرسل ساتس Cashu من محفظتك",
  "chat.attach.location": "الموقع",
  "chat.attach.location_desc": "أرسل مكانك الآن",
  "chat.attach.title": "إرفاق",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "شاركت موقعًا",
  "chat.location.received_summary": "شارك موقعه",
  "chat.location.title": "الموقع",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "التُقط قبل {ago}",
  "chat.location.open_maps": "فتح في الخرائط",
  "chat.location.no_forward": "لا تُعاد المواقع توجيهًا",
  "chat.location.no_forward_body":
    "يُرسل الموقع إلى شخص واحد. شارك موقعك أنت بدلًا من ذلك إن أردت أن يحصل عليه شخص آخر.",
  "chat.location.no_fix": "اسمح بالموقع لترى كم يبعد هذا",
  "chat.location.send_title": "أرسل موقعك",
  "chat.location.send_body":
    "سيرى {name} نقطة واحدة: مكانك الآن. ولا يستمر في التحديث.",
  "chat.location.send": "إرسال الموقع",
  "chat.location.finding": "جارٍ تحديد موقعك…",
  "chat.location.no_location": "تعذّر الحصول على موقعك",
  "chat.location.no_location_body":
    "اسمح بالوصول إلى الموقع وتأكد من تفعيل خدمات الموقع، ثم حاول مرة أخرى.",
  "chat.location.not_delivered": "تعذّر إرسال موقعك",
  "chat.location.not_delivered_body":
    "الموقع لا يستحق الإرسال إلا وهو حديث، لذلك لا يُحفظ لوقت لاحق. حاول مرة أخرى عندما يكون {name} متاحًا.",
  "chat.location.direction.n": "شمالًا",
  "chat.location.direction.ne": "شمال شرق",
  "chat.location.direction.e": "شرقًا",
  "chat.location.direction.se": "جنوب شرق",
  "chat.location.direction.s": "جنوبًا",
  "chat.location.direction.sw": "جنوب غرب",
  "chat.location.direction.w": "غربًا",
  "chat.location.direction.nw": "شمال غرب",
  "chat.attach.send_anyway": "أرسل على أي حال",
  "chat.attach.bitchat_too_big": "قد لا يصل هذا",
  "chat.attach.bitchat_too_big_body":
    "{name} يستخدم bitchat، وهو يتوقف في منتصف الملف الكبير. ما دون 350 KiB تقريبًا موثوق. أما الإرسال إلى جهة اتصال على Airhop فلا حد له.",
  "chat.attach.bitchat_unopenable": "قد لا يتمكنوا من فتح هذا",
  "chat.attach.bitchat_unopenable_body":
    "{name} يستخدم bitchat، وهو يعرض الصور والملاحظات الصوتية لكنه يدرج ما عداها كملف لا يستطيع فتحه. سيصل الملف، لكنهم قد لا يتمكنوا من عرضه.",
  "chat.attach.file": "إرفاق ملف",
  "chat.attach.unavailable": "المرفقات غير متاحة هنا",
  "chat.attach.not_sent": "لم يُرسل المرفق",
  "chat.attach.read_failed":
    "حدث خطأ ما أثناء قراءة ذلك الملف. جرّب ملفًا آخر.",
  "chat.attach.caption": "أضف تعليقًا…",
  "chat.attach.send": "إرسال المرفق",
  "chat.attach.generic": "مرفق",
  "chat.media.view_full": "عرض الصورة بملء الشاشة",
  "chat.media.gone_photo": "الصورة ليست على هذا الجهاز",
  "chat.media.gone_video": "الفيديو ليس على هذا الجهاز",
  "chat.media.gone_voice": "الملاحظة الصوتية ليست على هذا الجهاز",
  "chat.media.gone_file": "الملف ليس على هذا الجهاز",
  "chat.media.gone_note": "أُزيل بعد 7 أيام أو عند مسح ذاكرة التخزين المؤقت",
  "chat.media.ask_resend": "اسأل مرة أخرى",
  "chat.media.resend_draft": "هل يمكنك إرسال {kind} مرة أخرى؟",
  "chat.media.kind_photo": "الصورة",
  "chat.media.kind_video": "الفيديو",
  "chat.media.kind_voice": "الملاحظة الصوتية",
  "chat.media.kind_file": "الملف",
  "chat.media.pause_voice": "إيقاف الملاحظة الصوتية مؤقتًا",
  "chat.media.play_voice": "تشغيل الملاحظة الصوتية",
  "chat.media.voice_position": "الموضع في الملاحظة الصوتية",
  "chat.media.voice_scrub": "اضغط على الأعمدة للانتقال إلى تلك النقطة",
  "chat.media.image": "صورة",
  "chat.media.tap_load_photo": "اضغط لتحميل الصورة",
  "chat.media.open_document": "فتح {name}",
  "chat.media.document": "مستند",
  "chat.media.tap_load_video": "اضغط لتحميل الفيديو",
  "chat.media.video": "فيديو",
  "chat.media.photo": "صورة",
  "chat.media.close_photo": "إغلاق الصورة",
  "chat.media.save_photo": "حفظ الصورة في صورك",
  "chat.media.share_photo": "مشاركة الصورة",
  "chat.media.saved_videos": "حُفظ في مقاطع الفيديو",
  "chat.media.saved_photos": "حُفظ في صورك",
  "chat.media.not_saved": "لم يُحفظ",
  "chat.media.cant_open": "تعذّر فتح الملف",
  "chat.media.no_app": "لا يوجد على هذا الجهاز تطبيق يفتح هذا الملف أو يشاركه.",
  "chat.media.open_failed":
    "تعذّر فتح الملف. ربما مُسح من ذاكرة التخزين المؤقت.",
  "media.blocked.nostr_only":
    "أنت تعرف هذا الشخص عبر مُرحِّل فقط. النص وحده متاح. الصور والملفات والملاحظات الصوتية تتطلب بلوتوث.",
  "media.blocked.private_channel":
    "المرفق المُذاع موقَّع لكنه غير مشفّر، لذا إرساله إلى قناة خاصة سيضعه في العلن بينما يبقى النص هنا مشفّرًا.",
  "media.blocked.private_group":
    "المرفق المُذاع موقَّع لكنه غير مشفّر، لذا إرساله إلى مجموعة خاصة سيضعه في العلن بينما يبقى النص هنا مشفّرًا.",
  "media.blocked.location_channel":
    "قناة الموقع تصل إلى الناس عبر الإنترنت، والصور والملفات والملاحظات الصوتية تنتقل عبر البلوتوث، فلن تصل أبدًا.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "الملاحظات الصوتية غير متاحة هنا",
  "chat.voice.hold_live": "اضغط مع الاستمرار للتحدث مباشرة",
  "chat.voice.hold_record": "اضغط مع الاستمرار لتسجيل ملاحظة صوتية",
  "chat.voice.cancel_recording": "إلغاء التسجيل",
  "chat.voice.slide_cancel": "اسحب للإلغاء",
  "chat.voice.release_cancel": "أفلت للإلغاء",
  "chat.voice.a11y_toggle": "اضغط مرتين لبدء التحدث أو إيقافه.",
  "chat.voice.limit_reached": "بلغت حد الدقيقتين، أفلت للإرسال",
  "chat.voice.limit_sent": "بلغت حد الدقيقتين، أُرسلت الملاحظة",
  "chat.voice.stop_send": "إيقاف التسجيل والإرسال",
  "chat.voice.lift_lock": "اسحب لأعلى للتسجيل دون استخدام اليدين",
  "chat.voice.live_speaking": "{name} يتحدث",
  "voice.unavailable": "الصوت المباشر غير متاح",
  "voice.recording_stopped": "توقف التسجيل",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "الوصول إلى الكاميرا",
  "chat.perm.camera_purpose": "التقاط صورة لإرسالها",
  "chat.perm.photo_label": "الوصول إلى الصور",
  "chat.perm.photo_purpose": "اختيار صورة أو فيديو لإرساله",
  "chat.perm.photo_save_purpose": "حفظ هذا في صورك",
  "chat.perm.mic_label": "الوصول إلى الميكروفون",
  "chat.perm.mic_live_purpose": "التحدث إلى من هم بالجوار",
  "chat.perm.mic_note_purpose": "تسجيل ملاحظة صوتية",
  "chat.perm.recording_stopped": "توقف التسجيل",
  "chat.perm.record_failed": "تعذّر بدء التسجيل. تحقق من أذونات الميكروفون.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "تم الاستلام",
  "chat.ecash.reclaimed": "تم الاسترجاع",
  "chat.ecash.claiming": "جارٍ الاستلام…",
  "chat.ecash.claim": "استلام",
  "chat.ecash.claim_amount": "استلام {amount} {unit}",
  "chat.ecash.already_claimed": "استُلم بالفعل",
  "chat.ecash.already_claimed_body":
    "كل إثبات في هذا التوكن موجود في محفظتك بالفعل، فلم يُضَف شيء.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "سُلّمت إلى الشبكة للتوصيل قدر المستطاع",
  "chat.info.queued_desc": "محفوظة على هذا الهاتف حتى يتوفر مسار إليهم",
  "chat.info.reclaimed": "تم الاسترجاع",
  "chat.info.reclaimed_desc": "استرجعت هذه الدفعة إلى محفظتك، لذلك لن تُسلَّم",
  "chat.info.about": "حول",
  "chat.info.group_desc":
    "مجموعة خاصة. الأعضاء الذين أضافهم المنشئ وحدهم يمكنهم قراءتها، وتبقى على البلوتوث.",
  "chat.info.teleported_desc":
    "قناة موقع عامة لخلية الجيوهاش هذه. كل من في الخلية، على Airhop أو bitchat، يشاركها عبر الإنترنت. أنت منتقل عن بُعد، لست هنا فعليًا.",
  "chat.info.custom_desc":
    "قناة مخصصة. أي شخص يعرف الاسم يمكنه الانضمام من أي جهاز Airhop أو bitchat.",
  "chat.info.private_e2ee": "خاصة · مشفّرة من طرف إلى طرف",
  "chat.info.public_plain": "عامة · غير مشفّرة",
  "chat.info.group_privacy":
    "الأعضاء الظاهرون أدناه وحدهم يمكنهم قراءة هذه المجموعة. تبقى الرسائل على البلوتوث، لذا يستلمها الأعضاء خارج النطاق بمجرد عودتهم.",
  "chat.info.teleport_privacy":
    "مكان انتقلت إليه عن بُعد. يصل إلى كل من في هذه الخلية عبر الإنترنت، ولا يصل إلى أحد ضمن نطاق البلوتوث.",
  "chat.info.location_off_privacy":
    "الموقع معطّل، لذا تصل هذه القناة إلى الأجهزة القريبة عبر البلوتوث فقط. فعّل الموقع للوصول إلى خلية منطقتها عبر الإنترنت.",
  "chat.info.invite_privacy":
    "من تدعوهم بالرابط وحدهم يمكنهم القراءة. وتبقى مخفية عن الجميع، حتى عن النظراء القريبين.",
  "chat.info.public_privacy":
    "أي شخص ينضم يمكنه قراءة كل رسالة. استخدم رسالة مباشرة للحديث الخاص؛ الرسائل المباشرة مشفّرة من طرف إلى طرف.",
  "chat.info.remove_member": "إزالة عضو",
  "chat.info.remove_member_body":
    "إزالة {name} من المجموعة؟ يتغير مفتاح المجموعة فلا يعود بإمكانه قراءة الرسائل الجديدة.",
  "chat.info.message_member": "مراسلة {name}",
  "chat.info.remove_member_a11y": "إزالة {name}",
  "chat.info.no_addable":
    "لا نظراء متاحون للإضافة. يجب أن يكون الأعضاء بالجوار.",
  "chat.info.add_count": "إضافة {count}",
  "chat.info.teleported_tag": "{level}  ·  عن بُعد",
  "chat.info.active": "نشط",
  "chat.info.members": "الأعضاء",
  "chat.info.bookmark": "حفظ هذا المكان",
  "chat.info.remove_bookmark": "إزالة من المحفوظات",
  "chat.info.default_notice":
    "لا يمكن مغادرة القنوات الافتراضية. فهي جزء من بروتوكول شبكة Airhop.",
  "chat.info.custom_channel": "قناة مخصصة",
  "chat.info.geohash": "الجيوهاش",
  "chat.info.copy_geohash": "نسخ الجيوهاش",
  "chat.info.relays": "المُرحِّلات",
  "chat.info.show_relays": "عرض المُرحِّلات التي تحمل هذه القناة",
  "chat.info.relay_custom": "مخصص",
  "chat.info.relays_none": "لا شيء. هذه الخلية على البلوتوث فقط الآن.",
  "chat.info.search_members": "البحث في الأعضاء",
  "chat.info.search_members_placeholder": "ابحث في الأعضاء…",
  "chat.info.teleported": "منتقل عن بُعد",
  "chat.info.creator": "المنشئ",
  "chat.info.no_matches": "لا توجد نتائج",
  "chat.info.no_one_here": "لا أحد هنا بعد",
  "chat.info.add_members": "إضافة أعضاء",
  "chat.info.add_selected": "إضافة الأعضاء المحددين",
  "chat.info.add": "إضافة",
  "chat.info.leave_group": "مغادرة المجموعة",
  "chat.info.leave_channel": "مغادرة القناة",
  "chat.info.leave": "مغادرة",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "تتحادثان منذ {date}",
  "chat.contact.verified_since": "موثّق منذ {date}",
  "chat.contact.anonymous": "مجهول",
  "chat.contact.anonymous_desc":
    "اسم مستعار مرتبط بجيوهاش دون هوية دائمة يمكن التحقق منها",
  "chat.contact.verified": "موثّق",
  "chat.contact.verified_desc": "مسحت رمز الاستجابة السريعة الخاص به",
  "chat.contact.verified_desc_compared": "قارنتما الرموز معًا",
  "chat.contact.not_verified": "غير موثّق",
  "chat.contact.not_verified_desc":
    "امسح رمزه، أو قارنا رمزًا في مكالمة، للتأكد أنه هو فعلًا",
  "chat.contact.e2ee": "مشفّرة من طرف إلى طرف",
  "chat.contact.e2ee_nostr": "مغلّفة بـ NIP-17، فلا تستطيع المُرحِّلات قراءتها",
  "chat.contact.e2ee_mesh": "Noise XX، مع Double Ratchet بين أجهزة Airhop",
  "chat.contact.copy_nostr": "نسخ مفتاح Nostr العام",
  "chat.contact.nostr_key": "مفتاح Nostr العام",
  "chat.contact.cell_key_note":
    "هذا المفتاح يخص المنطقة التي التقيتما فيها. يتغير إذا تحرك أي منكما، وتتوقف المحادثة معه. تبادلا جهات الاتصال لتبقيا على تواصل من أي مكان.",
  "chat.contact.peer_name": "اسم النظير",
  "chat.contact.peer_id": "معرّف النظير",
  "chat.contact.rename": "إعادة تسمية",
  "chat.contact.rename_needs_contact":
    "يمكنك إعادة تسمية من تملك مفاتيحهم. تبادلا بطاقتي الاتصال أولًا، عندها يصبح هذا اسمًا تراه أنت وحدك.",
  "chat.contact.rename_needs_keys":
    "لا مفاتيح لجهة الاتصال هذه بعد. راسلهم، أو امسح رمزهم، عندها يمكنك منحهم اسمًا تراه أنت وحدك.",
  "chat.contact.renamed_by_you": "اسمك له",
  "chat.contact.copy_peer_id": "نسخ معرّف النظير",
  "chat.contact.verify": "توثيق جهة الاتصال",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "الإعلانات",
  "chat.notices.post_area": "انشر إعلانًا في هذه المنطقة",
  "chat.notices.post_mesh": "انشر إعلانًا على الشبكة",
  "chat.notices.mark_urgent": "وسمه كعاجل",
  "chat.notices.post": "نشر الإعلان",
  "chat.notices.post_short": "نشر",
  "chat.notices.delete": "حذف الإعلان",
  "chat.notices.just_now": "الآن",
  "chat.notices.fades_soon": "يختفي قريبًا",
  "chat.notices.1_day": "يوم واحد",
  "chat.notices.3_days": "3 أيام",
  "chat.notices.7_days": "7 أيام",
  "chat.notices.fading": "يختفي",
  "chat.notices.fades_in_hours": "يختفي خلال {count} س",
  "chat.notices.fades_in_days": "يختفي خلال {count} ي",
  "chat.notices.scope_geo": "جغرافي",
  "chat.notices.scope_mesh": "الشبكة",
  "chat.notices.urgent_short": "عاجل",
  "chat.notices.permanent_warning":
    "لا يختفي أبدًا. علني ومرتبط بهذه المنطقة، ولا يمكنك التراجع عنه.",
  "chat.notices.none": "لا إعلانات بعد. انشر واحدًا ليبقى هنا للآخرين.",

  // ---- Chats: search results ----
  "chat.search.photos": "الصور",
  "chat.search.videos": "مقاطع الفيديو",
  "chat.search.audio": "الصوت",
  "chat.search.documents": "المستندات",
  "chat.search.links": "الروابط",
  "chat.search.ecash": "النقد الإلكتروني",
  "chat.search.filter_by": "تصفية حسب {filter}",
  "chat.search.no_matches": "لا {filter} تطابق «{query}»",
  "chat.search.no_media": "لا {filter} بعد",
  "chat.search.result_a11y": "{chat}، {kind} من {sender}",
  "chat.search.you": "أنت",
  "chat.search.section_chats": "المحادثات",
  "chat.search.section_messages": "الرسائل",
  "chat.search.section_notices": "الإعلانات",
  "chat.search.hint": "ابحث في الرسائل والمحادثات، أو اختر تصفية من الأعلى.",
  "chat.search.no_results": "لا نتائج لـ «{query}»",
  "chat.search.open_chat": "فتح {name}",
  "chat.search.message_a11y": "{chat}، رسالة من {sender}: {snippet}",
  "chat.search.notice_a11y": "إعلان في {chat} من {author}: {snippet}",
  "chat.search.urgent": "عاجل ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "{count} في هذه القائمة. المسح يزيلها من هنا فقط، وتبقى الرسائل غير مقروءة في محادثاتها. وسم الكل كمقروء ينظّف الاثنين معًا.",
  "chat.notif.mark_all_read": "وسم الكل كمقروء",
  "chat.notif.clear_list": "مسح القائمة",
  "chat.notif.clear_all_a11y": "مسح كل الإشعارات البالغة {count}",
  "chat.notif.title": "الإشعارات",
  "chat.notif.clear_short": "مسح",
  "chat.notif.close": "إغلاق الإشعارات",
  "chat.notif.none": "لا إشعارات بعد",
  "chat.notif.none_desc":
    "الرسائل والإشارات والإعلانات من قنواتك ومحادثاتك تظهر هنا.",
  "chat.notif.new": "جديد",
  "chat.notif.notice_in": "إعلان في {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "إعادة التوجيه إلى…",
  "chat.forward.to": "إعادة التوجيه إلى {name}",
  "chat.forward.cant_send_here": "تعذّرت إعادة التوجيه هنا",
  "chat.forward.cant_send_to": "تعذّرت إعادة التوجيه إلى {name}",
  "chat.forward.channels": "القنوات",
  "chat.forward.groups": "المجموعات",
  "chat.forward.locations": "المواقع",
  "chat.forward.dms": "الرسائل المباشرة",
  "chat.forward.none": "لا محادثات أخرى بعد",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "جارٍ تشغيل الشبكة…",
  "mesh.banner.no_bluetooth": "لا بلوتوث على هذا الجهاز · الإنترنت فقط",
  "mesh.banner.bluetooth_off": "البلوتوث معطّل · الشبكة غير متاحة",
  "mesh.banner.permission_needed": "إذن البلوتوث مطلوب",
  "mesh.banner.blocked": "البلوتوث محظور · اسمح به من الإعدادات",
  "mesh.banner.location_permission": "الموقع مطلوب للعثور على النظراء",
  "mesh.banner.advertising_unsupported":
    "هذا الهاتف يرى الآخرين لكن لا يمكن العثور عليه",
  "mesh.banner.location_off_android":
    "الموقع معطّل · يحتاجه Android للعثور على النظراء",
  "mesh.banner.paused": "الشبكة متوقفة · أنت غائب",
  "mesh.banner.location_off": "الموقع معطّل · قنوات الموقع غير متاحة",
  "mesh.banner.battery_saver": "موفّر الطاقة · بحث أقل تكرارًا",
  "mesh.banner.wipe_incomplete":
    "المسح غير مكتمل · قد تبقى بعض البيانات، وتُعاد المحاولة عند إعادة الفتح",
  "mesh.banner.wifi_off": "الواي فاي معطّل · الملفات الكبيرة تُرسل أبطأ",
  "mesh.banner.clock_skew":
    "ساعة هذا الهاتف خاطئة · اضبط التاريخ والوقت تلقائيًا",
  "mesh.banner.internet_off": "الإنترنت معطّل · البلوتوث فقط",
  "mesh.banner.relaying": "لا نظراء محليون · جارٍ التمرير عبر Nostr",
  "mesh.banner.tor": "Tor مفعّل · يجري توجيه حركة الإنترنت",
  "mesh.banner.tor_starting": "جارٍ تشغيل Tor · جارٍ الاتصال",
  "mesh.banner.tor_blocked": "تعذّر اتصال Tor · الشبكة تعمل رغم ذلك",
  "mesh.banner.gateway": "بوابة الإنترنت مفعّلة · جارٍ تمرير النظراء القريبين",
  "mesh.banner.bridge": "جسر الشبكة مفعّل · المحادثة العامة موصولة",
  "mesh.banner.background_limits": "قد يوقف {brand} الشبكة في الخلفية",
  "mesh.banner.bridge_across": "جسر الشبكة مفعّل · {count} عبر الجسر",
  "mesh.banner.action.turn_on": "تفعيل",
  "mesh.banner.action.allow": "السماح",
  "mesh.banner.action.resume": "استئناف",
  "mesh.banner.action.fix": "إصلاح",
  "mesh.banner.hint.resume": "يعيد تفعيل البث والبحث عبر البلوتوث",
  "mesh.banner.hint.enable_bluetooth": "يطلب من Android تشغيل البلوتوث",
  "mesh.banner.hint.location_settings": "يفتح إعدادات الموقع في النظام",
  "mesh.banner.hint.app_settings": "يفتح أذونات Airhop في إعدادات النظام",
  "mesh.banner.hint.battery_settings": "يفتح إعدادات نشاط الخلفية لهذا الهاتف",
  "mesh.banner.dismiss": "إخفاء: {label}",
  "mesh.banner.hint.dismiss": "يخفي هذه الملاحظة نهائيًا",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "جارٍ البحث عن نظراء بالجوار…",
  "mesh.radar.starting": "جارٍ تشغيل الشبكة…",
  "mesh.radar.no_bluetooth": "لا بلوتوث على هذا الجهاز",
  "mesh.radar.bluetooth_off": "البلوتوث معطّل · لا بحث",
  "mesh.radar.permission_needed": "إذن البلوتوث مطلوب",
  "mesh.radar.blocked": "البلوتوث محظور",
  "mesh.radar.location_permission": "إذن الموقع مطلوب",
  "mesh.radar.location_off": "الموقع معطّل · لا بحث",
  "mesh.radar.hint_rings": "الحلقات تعرض قوة إشارة BLE، لا المسافة",
  "mesh.radar.hint_checking": "جارٍ فحص البلوتوث والأذونات",
  "mesh.radar.hint_internet": "ما زالت الرسائل تنتقل عبر الإنترنت",
  "mesh.radar.hint_turn_on": "فعّل البلوتوث لاكتشاف النظراء",
  "mesh.radar.hint_allow": "اسمح بالبلوتوث لاكتشاف النظراء",
  "mesh.radar.hint_allow_settings":
    "اسمح بالبلوتوث من الإعدادات لاكتشاف النظراء",
  "mesh.radar.hint_location_permission":
    "يحتاج Android 11 وما قبله إلى الموقع للبحث عبر البلوتوث",
  "mesh.radar.hint_android_location":
    "يحتاج Android إلى تفعيل الموقع لإرجاع نتائج بحث البلوتوث",
  "mesh.radar.signal_strong": "قوية",
  "mesh.radar.signal_medium": "متوسطة",
  "mesh.radar.signal_weak": "ضعيفة",
  "mesh.radar.you_center": "أنت، في مركز الشبكة",
  "mesh.radar.sonar_hint": "يشغّل نبضة سونار. البحث مستمر أصلًا.",
  "mesh.radar.paused": "الشبكة متوقفة · أنت غائب",
  "mesh.radar.ring_hint": "موضع الحلقة يعكس قوة الإشارة، لا المسافة",
  "mesh.radar.set_online":
    "اضبط حالتك على متصل في الملف الشخصي لاكتشاف النظراء",
  "mesh.radar.in_range": "ضمن النطاق",
  "mesh.radar.recently_seen": "شوهد مؤخرًا",
  "mesh.radar.peer_hint": "يفتح خيارات لمراسلة هذا النظير أو الدفع له",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "الآن",
  "mesh.peer.none": "لا نظراء بالجوار",
  "mesh.peer.none_desc":
    "أجهزة Airhop أو bitchat الأخرى ضمن نطاق البلوتوث تظهر هنا.",
  "mesh.peer.id_copied": "نُسخ معرّف النظير",
  "mesh.peer.copy_id": "نسخ معرّف النظير",
  "mesh.peer.their_name": "يُعرف باسم {name}",
  "mesh.peer.in_range": "ضمن النطاق",
  "mesh.peer.relay": "عقدة تمرير",
  "mesh.peer.relay_body":
    "جهاز لاسلكي تركه أحدهم يعمل لتوسيع الشبكة. يحمل رسائل لا يستطيع قراءتها. لا أحد هنا لتراسله.",
  "mesh.peer.send_dm": "إرسال رسالة مباشرة",
  "mesh.peer.message": "رسالة",
  "mesh.peer.send_sats": "إرسال نقد إلكتروني",
  "mesh.peer.amount_placeholder": "المبلغ بالساتس",
  "mesh.peer.amount_first": "إرسال نقد إلكتروني، أدخل المبلغ أولًا",
  "mesh.peer.cancel_send": "إلغاء إرسال النقد الإلكتروني",
  "mesh.peer.view_peer": "عرض النظير {name}",
  "mesh.peer.view_peer_online": "عرض النظير {name}، متصل",
  "mesh.peer.last_seen": "آخر ظهور قبل {ago}",
  "mesh.peer.send_amount": "إرسال {amount} ساتس",
  "mesh.peer.direct": "اتصال مباشر",
  "mesh.peer.check_distance": "قياس المسافة",
  "mesh.peer.checking": "جارٍ القياس",
  "mesh.peer.no_reply": "لا رد",
  "mesh.peer.no_reply_hint": "ربما تحركوا، أو أن تطبيقهم لا يجيب",
  "mesh.peer.rtt": "{ms} م.ث",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "إقليم",
  "mesh.level.province": "محافظة",
  "mesh.level.city": "مدينة",
  "mesh.level.neighborhood": "منطقة",
  "mesh.level.block": "حي سكني",
  "mesh.level.building": "مبنى",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "قابل للإنفاق",
  "wallet.balance.unit_hint": "يبدّل بين الساتوشي والبيتكوين",
  "wallet.balance.a11y": "الرصيد {value} {unit}",
  "wallet.balance.locked":
    "تخزين المحفظة مقفل. تُحفظ إثباتات النقد الإلكتروني في ملف مشفّر مفتاحه في سلسلة مفاتيح الجهاز، وتعذّر فتحه. افتح قفل جهازك ثم أعد فتح Airhop.",
  "wallet.balance.tor_blocked":
    "Tor مفعّل، لذا طلبات دار السك محظورة: فهي ستخرج عبر الشبكة المكشوفة وتربط عنوان IP الخاص بك بإثباتاتك. الإرسال والاستقبال عبر الشبكة ما زالا يعملان. اسمح بحركة دار السك من الإعدادات، الأمان.",
  "wallet.balance.unconfirmed_note": "{amount} لم تُؤكَّد بعد مع دار السك",
  "wallet.balance.reserved_note": "{amount} محجوزة لإرسال قيد التنفيذ",
  "wallet.balance.other_mint_note": "{amount} في حساب دار سك منفصل",
  "wallet.balance.test_mint_note":
    "يشمل نقودًا تجريبية من دار سك اختبارية. ليست بيتكوين ولا يمكن صرفها.",
  "wallet.token": "توكن",
  "wallet.action.send": "إرسال توكن نقد إلكتروني",
  "wallet.action.send_disabled":
    "إرسال توكن نقد إلكتروني، غير متاح مع رصيد فارغ",
  "wallet.action.receive": "استقبال توكن نقد إلكتروني",
  "wallet.action.zap": "إرسال زاب إلى جهة اتصال على Nostr",
  "wallet.action.zap_disabled":
    "إرسال زاب إلى جهة اتصال على Nostr، غير متاح مع رصيد فارغ",
  "wallet.action.add_mint": "إضافة دار سك Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "تعذّر بناء التوكن",
  "wallet.send.title": "إرسال نقد إلكتروني",
  "wallet.send.amount_in": "المبلغ بـ {unit}",
  "wallet.send.body":
    "بُني دون اتصال من إثباتات تملكها بالفعل. لا شيء يغادر رصيدك نهائيًا حتى تؤكد أن التوكن سُلّم.",
  "wallet.send.stale_fee_note":
    "فُحصت الرسوم آخر مرة قبل {days} يوم/أيام. إن رفعت دار السك رسومها منذ ذلك الحين، فقد يكلّف الإرسال أكثر قليلًا.",
  "wallet.send.fee_note":
    "{spend} {unit} تغادر رصيدك؛ والـ {fee} الإضافية تغطي رسوم دار السك التي كانوا سيدفعونها",
  "wallet.send.qr_too_big":
    "هذا التوكن مقسّم على عملات أكثر من أن تتسع في رمز استجابة سريعة. شاركه أو انسخه بدلًا من ذلك، أو حدّثه عند دار السك لتجميعه.",
  "wallet.send.bearer_note":
    "من يحمل هذه السلسلة يملك المال. الإثباتات محجوزة لا منفقة: إن لم تصل أحدًا يمكنك استرجاعها من قسم المعلّقة.",
  "wallet.send.qr_too_big_short":
    "هذا التوكن مقسّم على عملات أكثر من أن تتسع في رمز استجابة سريعة. شاركه أو انسخه بدلًا من ذلك.",
  "wallet.send.scan_note":
    "اطلب منهم مسحه من محفظتهم. ويبقى قابلًا للاسترجاع حتى تضع علامة أنه سُلّم.",
  "wallet.send.mesh_note":
    "يخرج التوكن كرسالة مباشرة مشفّرة عبر الشبكة. لا حاجة إلى إنترنت.",
  "wallet.send.no_peers_note":
    "افتح تبويب الشبكة للعثور على أجهزة قريبة، أو شارك التوكن بطريقة أخرى.",
  "wallet.send.send_to": "إرسال إلى {name}",
  "wallet.send.memo": "ملاحظة (اختيارية، تسافر مع التوكن)",
  "wallet.send.building": "جارٍ البناء…",
  "wallet.send.build": "بناء التوكن",
  "wallet.send.inexact_body":
    "لا تستطيع إثباتاتك تكوين {amount} {unit} بالضبط دون اتصال. أصغر توكن يمكنك بناؤه هو {spend} {unit}، وبلا اتصال لا يوجد باقٍ: الـ {extra} {unit} الإضافية تذهب إلى المستلم.\n\nتحديث الإثباتات عند دار السك أثناء الاتصال سيقسّمها إلى فئات تجعل هذا المبلغ دقيقًا.",
  "wallet.send.send_amount": "إرسال {amount}",
  "wallet.send.sent_to": "أُرسلت {amount} {unit} إلى {name}",
  "wallet.send.sent_to_body":
    "{route} ويبقى قابلًا للاسترجاع من قسم المعلّقة حتى تؤكد استلامهم له، أو حتى تخبرنا دار السك أن الإثباتات صُرفت.",
  "wallet.send.copy_token": "نسخ التوكن",
  "wallet.send.share_token": "مشاركة التوكن",
  "wallet.send.open_in_wallet": "فتح هذا التوكن في محفظة أخرى",
  "wallet.send.open_in_wallet_short": "فتح في محفظة",
  "wallet.send.to_peer": "إرسال التوكن إلى نظير قريب",
  "wallet.send.to_peer_short": "إرسال إلى نظير",
  "wallet.send.mark_delivered": "وسمه كمُسلَّم وإنهاء",
  "wallet.send.they_got_it": "وصلهم",
  "wallet.send.keep_pending": "أبقِ هذا الإرسال معلّقًا",
  "wallet.send.decide_later": "قرّر لاحقًا",
  "wallet.send.no_peers": "لا نظراء ضمن النطاق",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "هذه دفعتك أنت",
  "wallet.receive.own_payment_body":
    "هذه العملات ما زالت محجوزة لإرسال لم تسوِّه، فلا شيء لاستلامه. استخدم الاسترجاع على تلك الدفعة لإعادتها مباشرة إلى رصيدك.",
  "wallet.receive.already_have": "موجود في محفظتك بالفعل",
  "wallet.receive.already_have_body":
    "كل إثبات في هذا التوكن مخزّن هنا بالفعل، فلم يُضَف شيء. الأرصدة كما هي.",
  "wallet.receive.stored_unconfirmed":
    "خُزّن من {mint}، لكنه لم يُؤكَّد بعد مع دار السك ({reason}).",
  "wallet.receive.offline": "دون اتصال",
  "wallet.receive.redeemed_here":
    "صُرف عند {mint}. هذه الإثباتات لك وحدك الآن: نسخة المرسل لم تعد تعمل.",
  "wallet.receive.memo_quoted": "\n\n«{memo}»",
  "wallet.receive.redeemed_at":
    "صُرف عند {mint}. أصبح لك بشكل مثبت: نسخة المرسل من هذا التوكن لم تعد تعمل.",
  "wallet.receive.stored_pending":
    "خُزّن من {mint}، لكن دار السك لم تؤكد بعد أنه غير منفق{dleq}. حدّثه من تبويب المحفظة بمجرد اتصالك.",
  "wallet.receive.dleq_inline": " (توقيعه صحيح فعلًا، فالتوكن أصلي)",
  "wallet.receive.dleq_ok": "توقيع دار السك صحيح، فالتوكن أصلي.",
  "wallet.receive.dleq_uncached":
    "مفاتيح دار السك غير مخزّنة هنا، لذا تعذّر فحص التوقيع دون اتصال.",
  "wallet.receive.dleq_warning":
    "حتى تحدّثه وأنت متصل، يمكن للمرسل نظريًا أن يكون قد أنفقه في مكان آخر.",
  "wallet.receive.failed": "تعذّر الاستقبال",
  "wallet.receive.title": "استقبال نقد إلكتروني",
  "wallet.receive.body":
    "الصق توكن Cashu. مع الاتصال يُصرف عند دار السك فورًا؛ ودونه يُخزَّن ويُؤكَّد في المرة القادمة التي تحدّث فيها.",
  "wallet.receive.scan": "مسح رمز استجابة سريعة لنقد إلكتروني",
  "wallet.receive.scan_short": "مسح الرمز",
  "wallet.receive.receiving": "جارٍ الاستقبال…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body": "وصل نَتزاب من {from}… وصُرف في محفظتك.",
  "wallet.zap.title": "إرسال زاب إلى هوية على Nostr",
  "wallet.zap.not_npub": "ليس npub",
  "wallet.zap.bad_key": "مفتاح غير صالح",
  "wallet.zap.invalid_pubkey": "مفتاح عام غير صالح",
  "wallet.zap.invalid_pubkey_body":
    "أدخل npub1… أو مفتاح Nostr عامًا من 64 خانة ست عشرية.",
  "wallet.zap.sent": "أُرسل النَتزاب",
  "wallet.zap.failed": "فشل الزاب",
  "wallet.zap.body":
    "إن نشروا معلومات نَتزاب وفق NIP-61، يُقفل النقد الإلكتروني على مفتاحهم فلا يستطيع أحد غيرهم إنفاقه، ولا يمكن استرجاعه. وإن لم يفعلوا، يذهب كتوكن قابل للاسترجاع بدلًا من ذلك. وسنخبرك بأيهما حدث.",
  "wallet.zap.contact": "إرسال زاب إلى {name}",
  "wallet.zap.pubkey_placeholder": "npub1… أو 64 خانة ست عشرية",
  "wallet.zap.sending": "جارٍ الإرسال…",
  "wallet.nostr.copied_body":
    "أعطِ هذا لأحدهم فيستطيع إرسال زاب إليك من Airhop أو أي محفظة Nostr أخرى، دون حاجة إلى بلوتوث.",
  "wallet.nostr.copy_key":
    "انسخ مفتاح Nostr الخاص بك ليتمكن الناس من إرسال زاب إليك",
  "wallet.nostr.your_key": "مفتاح Nostr الخاص بك",

  // ---- Wallet: mints ----
  "wallet.mint.added": "أُضيفت دار السك",
  "wallet.mint.add_failed": "تعذّرت إضافة دار السك",
  "wallet.mint.added_named": "أُضيفت {name}",
  "wallet.mint.added_body":
    "{mint} تصدر {units}. مفاتيحها مخزّنة على هذا الجهاز، فأصبح بالإمكان التحقق من التوكنات الصادرة عنها حتى دون إنترنت.",
  "wallet.mint.remove_plain":
    "إزالة {mint} من محفظتك؟ ستُزال مفاتيحها المخزّنة معها، فلن يعود بالإمكان التحقق من توكناتها دون اتصال.",
  "wallet.mint.title": "دور السك",
  "wallet.mint.none": "لا دار سك بعد",
  "wallet.mint.none_desc":
    "دار السك تصدر نقدك الإلكتروني وتصرفه. أضف واحدة لتودع عبر Lightning، أو استقبل توكنًا فحسب فتُضاف دار سكه نيابة عنك.",
  "wallet.mint.add": "إضافة دار سك",
  "wallet.mint.add_body":
    "دار السك تحتفظ بالبيتكوين الذي يغطي نقدك الإلكتروني، فاختر واحدة تأتمنها على الرصيد الذي تبقيه فيها. يُفحص الرابط قبل حفظه. شغّل دارك الخاصة عبر Nutshell إن كنت تفضّل ألا تأتمن أحدًا.",
  "wallet.mint.consolidate_body":
    "لا يمكن للتوكن أن يذكر أكثر من دار سك واحدة، لذا فالرصيد الموزّع على عدة دور لا يستطيع دفع مبلغ أكبر مما تحمله أكبرها. يستطيع Airhop نقله: تدفع كل دار أخرى فاتورة Lightning تصدرها الدار التي تختارها. يكلّف رسوم توجيه صغيرة ويحتاج إنترنت.",
  "wallet.mint.add_short": "إضافة دار سك",
  "wallet.mint.checking": "جارٍ الفحص…",
  "wallet.mint.remove_with_balance": "إزالة دار سك بها رصيد؟",
  "wallet.mint.remove": "إزالة دار السك",
  "wallet.mint.delete_anyway": "احذف على أي حال",
  "wallet.mint.consolidate": "نقل كل الأرصدة إلى دار سك واحدة",
  "wallet.mint.confirm_with": "تأكيد الإثباتات مع {mint}",
  "wallet.mint.remove_a11y": "إزالة {mint}",
  "wallet.mint.available_amount": "{amount} {unit} متاحة",
  "wallet.mint.split_across":
    "الرصيد موزّع على {count} دار سك. انقله إلى واحدة.",
  "wallet.mint.move_everything_to": "نقل كل شيء إلى {mint}",
  "wallet.mint.consolidate_title": "النقل إلى دار سك واحدة",
  "wallet.mint.moving": "جارٍ النقل…",
  "wallet.mint.move": "نقل",
  "wallet.mint.moved": "نُقل",
  "wallet.mint.moved_body":
    "{amount} {unit} أصبحت الآن في {mint}، بعد {fees} {unit} رسوم توجيه Lightning.",
  "wallet.mint.nothing_moved": "لم يُنقل شيء",
  "wallet.mint.destination": "· الوجهة",
  "wallet.mint.will_move": "· ستُنقل",
  "wallet.mint.issued_by": "صادرة عن",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "شحن محفظة Airhop",
  "wallet.ln.invoice_failed": "تعذّر إنشاء الفاتورة",
  "wallet.ln.price_failed": "تعذّر تسعير هذه الفاتورة",
  "wallet.ln.paid": "مدفوعة",
  "wallet.ln.deposit_credited":
    "دُفعت الفاتورة وأصدرت {mint} مبلغ {amount} {unit}. هذا الرصيد مؤكد: يمكنك إنفاقه دون اتصال فورًا.",
  "wallet.ln.withdrawn":
    "دُفعت {paid} ساتس عبر Lightning. واقتطعت دار السك {fee} ساتس رسوم توجيه.",
  "wallet.ln.withdrawn_with_change":
    "دُفعت {paid} ساتس عبر Lightning. واقتطعت دار السك {fee} ساتس رسوم توجيه، وأعادت {change} ساتس من الاحتياطي إلى رصيدك.",
  "wallet.ln.payment_failed": "فشلت الدفعة",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "حوّل ساتس Lightning إلى نقد إلكتروني تنفقه دون اتصال، أو اصرف النقد الإلكتروني إلى أي فاتورة Lightning. كلاهما يحتاج إنترنت ودار سك.",
  "wallet.ln.deposit_body":
    "تعطيك دار السك فاتورة. ادفعها من أي محفظة Lightning وتعود الساتس نقدًا إلكترونيًا تنفقه دون اتصال.",
  "wallet.ln.pay_invoice_for":
    "ادفع هذه الفاتورة البالغة {amount} {unit}. المحفظة تراقب الدفعة وستصدر نقدك الإلكتروني تلقائيًا.",
  "wallet.ln.expired_body":
    "انتهت صلاحية هذه الفاتورة. إن كنت قد دفعتها بالفعل، يُضاف الرصيد تلقائيًا.",
  "wallet.ln.waiting_expires": "بانتظار الدفع · تنتهي خلال {countdown}",
  "wallet.ln.withdraw_body":
    "الصق فاتورة bolt11 وتدفعها دار السك من نقدك الإلكتروني. يُعرض عليك احتياطي التوجيه أولًا؛ وما لا يستهلكه التوجيه يعود إلى رصيدك.",
  "wallet.ln.up_to": "حتى {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "دفع {amount} {unit}",
  "wallet.ln.deposit": "إيداع ساتس عبر Lightning",
  "wallet.ln.deposit_short": "إيداع",
  "wallet.ln.withdraw": "سحب إلى فاتورة Lightning",
  "wallet.ln.withdraw_short": "سحب",
  "wallet.ln.deposit_title": "الإيداع عبر Lightning",
  "wallet.ln.amount_placeholder": "المبلغ بالساتس",
  "wallet.ln.requesting": "جارٍ الطلب…",
  "wallet.ln.get_invoice": "احصل على فاتورة",
  "wallet.ln.copy_invoice": "نسخ الفاتورة",
  "wallet.ln.open_wallet": "الفتح في محفظة Lightning",
  "wallet.ln.open_wallet_short": "فتح في محفظة",
  "wallet.ln.waiting": "بانتظار الدفع…",
  "wallet.ln.new_invoice": "إنشاء فاتورة جديدة",
  "wallet.ln.new_invoice_short": "فاتورة جديدة",
  "wallet.ln.withdraw_title": "السحب إلى Lightning",
  "wallet.ln.scan_invoice": "امسح رمز استجابة سريعة لفاتورة Lightning",
  "wallet.ln.paid_from": "مدفوعة من",
  "wallet.ln.invoice": "الفاتورة",
  "wallet.ln.routing_reserve": "احتياطي التوجيه",
  "wallet.ln.reserved": "محجوز من الرصيد",
  "wallet.ln.paying": "جارٍ الدفع…",
  "wallet.ln.get_quote": "احصل على عرض",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "النسخ الاحتياطي",
  "wallet.backup.setup_failed": "تعذّر إعداد النسخ الاحتياطي",
  "wallet.backup.on": "النسخ الاحتياطي مفعّل",
  "wallet.backup.on_body":
    "يمكن الآن استعادة رصيدك من تلك الكلمات الاثنتي عشرة.\n\nأي شيء أعطاك إياه شخص آخر يبقى خارج العبارة حتى تحدّثه عند دار السك، والاستعادة تحتاج قائمة دور السك لديك، فاكتبها إلى جانب الكلمات.",
  "wallet.backup.no_phrase": "لا عبارة محفوظة",
  "wallet.backup.no_phrase_body":
    "تعذّرت قراءة عبارة الاستعادة من سلسلة مفاتيح الجهاز. افتح قفل الجهاز وحاول مرة أخرى.",
  "wallet.backup.replace_title": "استبدال عبارتك الحالية؟",
  "wallet.backup.replace_body":
    "لديك عبارة استعادة بالفعل. استعادة عبارة مختلفة تستبدلها. العملات التي تغطيها العبارة القديمة تبقى قابلة للإنفاق على هذا الجهاز، لكنها تتوقف عن كونها قابلة للاستعادة، فتأكد من كتابة الكلمات القديمة قبل المتابعة.",
  "wallet.backup.replace": "استبدال",
  "wallet.backup.invalid_phrase": "هذه العبارة غير صالحة",
  "wallet.backup.invalid_phrase_body":
    "للعبارة مجموع تحقق مدمج وهذه لا تجتازه. تحقق من كلمة مكتوبة خطأ أو ناقصة أو مبدّلة.",
  "wallet.backup.not_bip39": "هذه ليست كلمات BIP-39: {words}. تحقق من الإملاء.",
  "wallet.backup.add_mint_first": "أضف دار سك أولًا",
  "wallet.backup.add_mint_first_body":
    "تعمل الاستعادة بسؤال دار السك عن العملات التي وقّعتها لك، فهي تحتاج أن تعرف أي دار تسأل. أضف دور السك التي كنت تستخدمها، ثم استعِد.",
  "wallet.backup.restore_failed": "فشلت الاستعادة",
  "wallet.backup.phrase": "عبارة الاستعادة",
  "wallet.backup.state_unconfirmed": "النسخ الاحتياطي مفعّل لكن غير مؤكد",
  "wallet.backup.state_off": "النسخ الاحتياطي معطّل",
  "wallet.backup.badge_on": "مفعّل",
  "wallet.backup.badge_unconfirmed": "غير مؤكد",
  "wallet.backup.badge_off": "معطّل",
  "wallet.backup.view": "عرض عبارة الاستعادة",
  "wallet.backup.setup": "إعداد عبارة استعادة",
  "wallet.backup.view_short": "عرض العبارة",
  "wallet.backup.setup_short": "إعداد",
  "wallet.backup.restore": "استعادة محفظة من عبارة استعادة",
  "wallet.backup.restore_short": "استعادة",
  "wallet.backup.setup_title": "إعداد عبارة استعادة",
  "wallet.backup.on_body_short":
    "يمكن استعادة رصيدك على جهاز جديد من كلماتك الاثنتي عشرة.",
  "wallet.backup.unconfirmed_body":
    "لم تؤكد قط أنك كتبت نسخة منها. الكلمات الآن موجودة على هذا الهاتف وحده، وهو الشيء الوحيد الذي يُفترض أن ينجو منه النسخ الاحتياطي. اعرض العبارة واكتبها.",
  "wallet.backup.not_covered":
    "{amount} غير مغطاة بعد. العملات التي أُعطيت لك تحمل أسرار من أرسلها، فلا تدخل تحت عبارتك إلا بعد تبديلها. حدّث دار سك لتأمينها.",
  "wallet.backup.off_body":
    "نقدك الإلكتروني موجود على هذا الهاتف وحده. إن فقدته، لا يستطيع أحد استرداد المال، ولا أنت. عبارة الاستعادة اثنتا عشرة كلمة تستطيع إعادة بناء رصيدك في أي مكان.",
  "wallet.backup.about_to_see":
    "أنت على وشك رؤية اثنتي عشرة كلمة. إنها المال نفسه.",
  "wallet.backup.exact_order":
    "اثنتا عشرة كلمة، بهذا الترتيب بالضبط. من يملكها يملك رصيدك.",
  "wallet.backup.verify_body":
    "عبارة لم يكتبها أحد أسوأ من عدم وجود عبارة، لأنها تبدو شبكة أمان غير موجودة. كلمتان للتأكيد.",
  "wallet.backup.verify_mismatch": "هذا لا يطابق. راجع نسختك المكتوبة.",
  "wallet.backup.restore_body":
    "أدخل الكلمات الاثنتي عشرة. يعيد Airhop اشتقاق عملاتك ويسأل كل دار سك أيها وقّعت، فيعود الرصيد من السجلات التي تحتفظ بها دار السك.",
  "wallet.backup.warn_secret":
    "من يقرأها يستطيع أخذ رصيدك. لا تلتقط لها صورة شاشة ولا تخزّنها على هذا الهاتف.",
  "wallet.backup.warn_paper":
    "اكتبها على ورق واحفظه في مكان آمن. لا يستطيع Airhop أن يعرضها لك مرة أخرى إن ضاع الهاتف.",
  "wallet.backup.warn_scope":
    "تعيد بناء نقدك الإلكتروني فقط. هويتك ومحادثاتك وجهات اتصالك غير مغطاة.",
  "wallet.backup.warn_mints":
    "الاستعادة مضطرة لسؤال دار سك عن العملات التي وقّعتها، فاكتب قائمة دور السك لديك إلى جانب الكلمات.",
  "wallet.backup.preparing": "جارٍ التحضير…",
  "wallet.backup.show_phrase": "اعرض عبارتي",
  "wallet.backup.your_phrase": "عبارة الاستعادة الخاصة بك",
  "wallet.backup.write_down": "اكتب هذه",
  "wallet.backup.copy_phrase": "نسخ عبارة الاستعادة إلى الحافظة",
  "wallet.backup.copy_clipboard": "نسخ إلى الحافظة",
  "wallet.backup.written_down": "كتبتها",
  "wallet.backup.check_copy": "راجع نسختك",
  "wallet.backup.confirm": "تأكيد",
  "wallet.backup.restore_title": "الاستعادة من عبارة",
  "wallet.backup.phrase_placeholder": "اثنتا عشرة كلمة، تفصل بينها مسافات",
  "wallet.backup.no_mints_yet":
    "لم تُضَف دور سك بعد. الاستعادة مضطرة لسؤال دار سك بعينها، فأضف التي كنت تستخدمها أولًا.",
  "wallet.backup.scanning": "جارٍ الفحص…",
  "wallet.backup.restore_progress":
    "{mint} · مجموعة المفاتيح {step} من {total}",
  "wallet.backup.will_scan":
    "سيُفحص: {mints}. دار سك لم تضفها لا تُسأل أبدًا، فيبقى رصيدها غير مرئي.",
  "wallet.backup.word_n": "الكلمة {position}",
  "wallet.backup.unreachable_mints":
    "تعذّر الوصول إلى: {mints}. أي رصيد هناك ما زال موجودًا. حاول مرة أخرى باتصال أفضل.",
  "wallet.backup.nothing_recovered": "لم يُستعد شيء من دور السك التي فُحصت.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "وسمها كمستلمة؟",
  "wallet.delivered.body":
    "هذا يحرّر {amount} {unit} نهائيًا. إن لم تصل فعلًا، فلن تتمكن من استرجاعها.",
  "wallet.delivered.body_generic":
    "هذا يحرّر المبلغ المحجوز نهائيًا. إن لم يصل فعلًا، فلن تتمكن من استرجاعه.",
  "wallet.delivered.cancel": "ليس بعد",
  "wallet.delivered.confirm": "وصلهم",
  "wallet.reclaim.title": "استرجاع هذا التوكن؟",
  "wallet.reclaim.body":
    "تعود الـ {amount} {unit} إلى رصيدك. لا تفعل هذا إلا إن لم يصل التوكن أحدًا: فإن كانت السلسلة بحوزتهم بالفعل، يحتفظ بالمال من يصرفها أولًا عند دار السك، وقد يكونون هم.",
  "wallet.reclaim.keep": "أبقها معلّقة",
  "wallet.reclaim.confirm": "استرجاع",
  "wallet.copied.token_body":
    "التوكن في حافظتك. ويبقى محجوزًا هنا حتى تضع علامة أنه سُلّم، فيمكنك لصقه مرة أخرى إن فشلت المحاولة الأولى.",
  "wallet.copied.phrase_body":
    "الصقها في مدير كلمات مرور، ثم امسح حافظتك. تستطيع تطبيقات أخرى قراءة الحافظة، وفي بعض الإعدادات تُزامَن مع أجهزتك الأخرى.",
  "wallet.refresh.failed": "فشل التحديث",
  "wallet.refresh.partly": "تحديث جزئي",
  "wallet.refresh.done": "تم التحديث",
  "wallet.refresh.unreachable": "تعذّر الوصول إلى {mints}. كل ما عداها محدَّث.",
  "wallet.refresh.swapped": "أُكدت {amount} {unit} وبُدّلت بإثباتات جديدة.",
  "wallet.refresh.secured":
    "{amount} {unit} أصبحت الآن مغطاة بعبارة الاستعادة الخاصة بك.",
  "wallet.refresh.all_confirmed": "كل ما هنا كان مؤكدًا بالفعل مع دار السك.",
  "wallet.pending.title": "المعلّقة",
  "wallet.pending.reserved_desc":
    "بُنيت وحُجزت، والتسليم غير مؤكد. تُحجز الإثباتات خارج رصيدك لئلا تُنفق مرتين.",
  "wallet.pending.locked_desc":
    "مقفلة بالفعل على مفتاح المستلم، فلا يستطيع إنفاقها سواه. لكنها لم تصله بعد. شارك التوكن لإتمامها.",
  "wallet.pending.show_qr": "عرض هذا التوكن كرمز استجابة سريعة",
  "wallet.pending.copy_again": "نسخ التوكن مرة أخرى",
  "wallet.pending.share_again": "مشاركة التوكن مرة أخرى",
  "wallet.pending.mark_delivered": "وسم هذا التوكن كمُسلَّم",
  "wallet.pending.delivered": "سُلّم",
  "wallet.pending.reclaim_into": "استرجاع هذا التوكن إلى رصيدك",
  "wallet.activity.title": "النشاط",
  "wallet.activity.none": "لا شيء بعد",
  "wallet.activity.none_desc":
    "المدفوعات التي ترسلها وتستلمها تظهر هنا، الأحدث أولًا، مع دار السك والرسوم لكل منها.",
  "wallet.activity.show_fewer": "عرض عدد أقل من المدفوعات",
  "wallet.activity.show_less": "عرض أقل",
  "wallet.activity.received_unconfirmed": "مستلمة، غير مؤكدة",
  "wallet.activity.received": "مستلمة",
  "wallet.activity.receive_failed": "فشل الاستلام",
  "wallet.activity.reclaimed": "مسترجعة",
  "wallet.activity.send_failed": "فشل الإرسال",
  "wallet.activity.sent": "مرسلة",
  "wallet.activity.status_pending": "معلّقة",
  "wallet.activity.status_failed": "فشلت",
  "wallet.activity.status_reclaimed": "مسترجعة",
  "wallet.activity.status_expired": "منتهية",
  "wallet.activity.ln_deposit": "إيداع Lightning",
  "wallet.activity.ln_withdrawal": "سحب Lightning",
  "wallet.activity.nutzap_received": "وصل نَتزاب",
  "wallet.activity.spent_removed": "أُزيلت الإثباتات المنفقة",
  "wallet.activity.refreshed": "حُدّثت الإثباتات",
  "wallet.activity.refreshing": "جارٍ تحديث الإثباتات",
  "wallet.activity.just_now": "الآن",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "الشبكة غير متصلة",
  "wallet.mesh_offline_body":
    "خدمة الشبكة لا تعمل، فلا يوجد من يُسلَّم إليه التوكن. ويبقى محجوزًا ضمن المعلّقة.",
  "wallet.xfer.route_mesh": "سُلّم مباشرة إلى جهازهم عبر الشبكة.",
  "wallet.xfer.route_nostr":
    "كانوا خارج نطاق البلوتوث، فذهب عبر الإنترنت بدلًا من ذلك.",
  "wallet.xfer.route_courier":
    "لا مسار إليهم الآن. ستحمله أجهزة أخرى وتسلّمه عندما يصل أحدها إليهم.",
  "wallet.xfer.route_queued":
    "لم يصبحوا متاحين بعد. إنه في قائمة الانتظار وسيُرسل بمجرد أن يصبحوا كذلك.",
  "wallet.xfer.mesh_offline_body":
    "خدمة الشبكة لا تعمل، فلا سبيل إلى تسليم التوكن. ولم يُخصم شيء.",
  "wallet.xfer.could_not_send": "تعذّر الإرسال",
  "wallet.xfer.inexact_body":
    "لا تستطيع إثباتاتك تكوين {amount} {unit} بالضبط دون اتصال. أصغر توكن يمكنك بناؤه هو {spend} {unit}، والـ {extra} {unit} الإضافية تذهب إليهم دون سبيل لاستعادتها.\n\nتحديث الإثباتات عند دار السك أثناء الاتصال يقسّمها إلى فئات تجعل هذا المبلغ دقيقًا.",
  "wallet.xfer.send_amount": "إرسال {amount}",
  "wallet.xfer.mesh_offline": "الشبكة غير متصلة",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "مقفلة على مفتاحهم ومنشورة على Nostr. هي لهم سواء كانوا متصلين أم لا.",
  "wallet.pay.rail_nutzap_dm":
    "مقفلة على مفتاحهم. لم يقبلها المُرحِّل، فذهبت إليهم كرسالة بدلًا من ذلك.",
  "wallet.pay.rail_nutzap_undelivered":
    "مقفلة على مفتاحهم، لكن لم يستطع شيء حملها بعد. إنها في قائمة الانتظار، والتوكن ضمن المعلّقة.",
  "wallet.pay.final":
    "لا يمكن استرجاع المدفوعات المقفلة: مفتاحهم وحده يستطيع إنفاق هذه العملات الآن.",
  "wallet.pay.reclaimable":
    "تبقى قابلة للاسترجاع من تبويب المحفظة حتى تؤكد وصولها.",
  "wallet.pay.why": "أُرسلت بهذه الطريقة لأن {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} إلى {name}",
  "wallet.pay.thread_receipt": "أرسلت {amount} {unit}، مقفلة على مفتاحهم.",
  "wallet.pay.title": "إرسال نقد إلكتروني",
  "wallet.pay.to": "إلى {name}",
  "wallet.pay.amount": "المبلغ بالساتس",
  "wallet.pay.memo": "ملاحظة (اختيارية، علنية)",
  "wallet.pay.send": "إرسال",
  "wallet.pay.sending": "جارٍ الإرسال…",
  "wallet.pay.action": "إرسال نقد إلكتروني",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "الوصول إلى الكاميرا",
  "wallet.scan.camera_purpose": "مسح رمز استجابة سريعة لنقد إلكتروني",
  "wallet.scan.photo_label": "الوصول إلى الصور",
  "wallet.scan.photo_purpose": "قراءة رمز نقد إلكتروني من صورة",
  "wallet.scan.no_token": "لم يُعثر على توكن نقد إلكتروني في تلك الصورة.",
  "wallet.scan.no_invoice": "لم يُعثر على فاتورة Lightning في تلك الصورة.",
  "wallet.scan.unreadable": "تعذّرت قراءة تلك الصورة.",
  "wallet.scan.camera_failed":
    "تعذّر تشغيل الكاميرا. أغلق تطبيقات الكاميرا الأخرى وحاول مرة أخرى.",
  "wallet.scan.close": "إغلاق الماسح",
  "wallet.scan.on_device": "تُقرأ على هذا الجهاز؛ ولا يُرسل شيء إلى أي مكان.",
  "wallet.scan.aim_token": "وجّه الكاميرا نحو رمز استجابة سريعة لنقد إلكتروني.",
  "wallet.scan.aim_invoice":
    "وجّه الكاميرا نحو رمز استجابة سريعة لفاتورة Lightning.",
  "wallet.scan.title_token": "مسح نقد إلكتروني",
  "wallet.scan.title_invoice": "مسح فاتورة",
  "wallet.scan.desc_token":
    "اقرأ توكن Cashu من محفظة أخرى. يعمل مع أي محفظة Cashu، لا مع Airhop وحده.",
  "wallet.scan.desc_invoice": "اقرأ فاتورة Lightning لدفعها من رصيدك.",
  "wallet.scan.use_camera_a11y": "المسح بالكاميرا",
  "wallet.scan.use_camera": "استخدام الكاميرا",
  "wallet.scan.pick_image_a11y": "قراءة رمز استجابة سريعة من صورة محفوظة",
  "wallet.scan.pick_image": "اختيار من الصور",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "ما هو Cashu؟",
  "wallet.explain.intro":
    "Cashu نقد إلكتروني للبيتكوين. التوكن سلسلة نصية تساوي مالًا لمن يحملها، موقّعة بشكل أعمى من دار سك فلا تستطيع الدار معرفة من أنفق ماذا. لا حسابات ولا تسجيل دخول.",
  "wallet.explain.send": "إرسال",
  "wallet.explain.send_desc":
    "يحوّل مبلغًا إلى توكن تسلّمه إلى نظير قريب عبر البلوتوث، أو تشاركه كنص. يعمل دون إنترنت. تبقى الإثباتات محجوزة حتى تؤكد وصوله.",
  "wallet.explain.receive": "استقبال",
  "wallet.explain.receive_desc":
    "الصق توكنًا لإضافته. مع الاتصال يُبدَّل عند دار السك فورًا، وهذا ما يجعله لك بشكل مثبت. ودونه يُخزَّن ويوسم كغير مؤكد حتى تحدّثه.",
  "wallet.explain.zap": "زاب",
  "wallet.explain.zap_desc":
    "يدفع لهوية على Nostr. إن نشروا معلومات نَتزاب وفق NIP-61، يُقفل النقد الإلكتروني على مفتاحهم فلا ينفقه سواهم. وإلا فيعود إلى رسالة مباشرة مشفّرة. يحتاج إنترنت.",
  "wallet.explain.add_mint": "إضافة دار سك",
  "wallet.explain.add_mint_desc":
    "يحفظ دار السك التي تصدر نقدك الإلكتروني وتصرفه، ويخزّن مفاتيحها العامة ليمكن التحقق من توكناتها دون اتصال. اختر دارًا تأتمنها على الرصيد الذي تبقيه فيها.",
  "wallet.explain.phrase": "عبارة الاستعادة",
  "wallet.explain.phrase_desc":
    "تُشتق عملاتك من اثنتي عشرة كلمة تولّدها المحفظة في البداية، فيستطيع هاتف جديد إعادة بناء الرصيد بسؤال دور السك لديك أي العملات وقّعت. وحتى تعرضها وتكتبها، تبقى موجودة على هذا الهاتف وحده.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "المحفظة مقفلة",
  "wallet.err.mint_unreachable": "دار السك غير متاحة",
  "wallet.err.tor_blocked": "محظور بينما Tor مفعّل",
  "wallet.err.insufficient": "الرصيد غير كافٍ",
  "wallet.err.exact_amount": "تعذّر إرسال هذا المبلغ بالضبط",
  "wallet.err.no_mint": "لا دار سك",
  "wallet.err.mint_unsupported": "دار السك لا تستطيع ذلك",
  "wallet.err.mint_refused": "رفضت دار السك",
  "wallet.err.unreadable": "توكن غير مقروء",
  "wallet.err.rejected": "رُفض التوكن",
  "wallet.err.already_spent": "منفق بالفعل",
  "wallet.err.change_pending": "مدفوعة، والباقي معلّق",
  "wallet.svc.mint_unreachable": "تعذّر الوصول إلى دار السك.",
  "wallet.svc.tor_ios": "طلبات دار السك لا تمر عبر Tor على iOS.",
  "wallet.svc.tor_ios_body":
    "لا يغلّف Arti سوى مقابس Nostr، فسيصل هذا الطلب إلى دار السك عبر الشبكة المكشوفة ويربط عنوان IP الخاص بك بهذه الإثباتات. اسمح به من الإعدادات > الأمان، أو عطّل Tor أولًا. إرسال النقد الإلكتروني واستقباله عبر الشبكة ما زالا يعملان.",
  "wallet.svc.tor_paused": "Tor مفعّل لكنه غير متصل.",
  "wallet.svc.tor_paused_body":
    "توقّف Orbot عن التوجيه، فسيصل هذا الطلب إلى دار السك عبر الشبكة المكشوفة ويربط عنوان IP الخاص بك بهذه الإثباتات. شغّل Orbot من جديد، أو عطّل Tor. إرسال النقد الإلكتروني واستقباله عبر الشبكة ما زالا يعملان.",
  "wallet.svc.keys_uncached": "مفاتيح دار السك هذه غير مخزّنة على هذا الجهاز.",
  "wallet.svc.keys_uncached_body": "افتح المحفظة مرة واحدة وأنت متصل لجلبها.",
  "wallet.svc.phrase_invalid": "عبارة الاستعادة هذه غير صالحة.",
  "wallet.svc.phrase_invalid_body":
    "تحقق من كلمة مكتوبة خطأ أو ناقصة. للعبارة مجموع تحقق مدمج، فكلمة خاطئة واحدة تبطل العبارة كلها.",
  "wallet.svc.need_mint": "أضف دار سك واحدة على الأقل أولًا.",
  "wallet.svc.need_mint_body":
    "تعمل الاستعادة بسؤال دار السك عن العملات التي وقّعتها لك، فهي تحتاج أن تعرف أي دار تسأل.",
  "wallet.svc.restored": "استُعيدت من عبارة الاستعادة",
  "wallet.svc.storage_locked": "تخزين المحفظة مقفل.",
  "wallet.svc.storage_locked_body":
    "يحفظ Airhop إثباتات النقد الإلكتروني في ملف مشفّر مفتاحه في سلسلة مفاتيح الجهاز. افتح قفل الجهاز وأعد فتح التطبيق.",
  "wallet.svc.bad_url": "هذا ليس رابطًا صالحًا.",
  "wallet.svc.needs_https": "يجب أن يبدأ رابط دار السك بـ https://.",
  "wallet.svc.refuse_http": "رفض استخدام دار سك عبر http عادي.",
  "wallet.svc.refuse_http_body":
    "يستطيع أي شخص على مسار الشبكة قراءة إثباتاتك أو تغييرها. استخدم دار سك على https://.",
  "wallet.svc.mint_not_saved": "تعذّر حفظ دار السك.",
  "wallet.svc.unreadable_token": "هذا ليس توكن Cashu مقروءًا.",
  "wallet.svc.unreadable_token_body":
    "تبدأ التوكنات بـ cashuA أو cashuB. تحقق من عدم اقتطاع شيء عند نسخه.",
  "wallet.svc.wrong_mint": "لم توقّع هذا التوكن دار السك التي يذكرها.",
  "wallet.svc.already_spent": "هذه الإثباتات أُنفقت بالفعل.",
  "wallet.svc.already_spent_body":
    "من أرسل هذا التوكن صرفه أولًا، أو أرسل التوكن نفسه إلى شخص آخر.",
  "wallet.svc.receiving_offline": "الاستقبال دون اتصال",
  "wallet.svc.amount_positive": "أدخل مبلغًا أكبر من صفر.",
  "wallet.svc.coins_raced": "استُخدمت تلك العملات للتو في دفعة أخرى.",
  "wallet.svc.coins_raced_body":
    "لم يُخصم شيء. حاول مرة أخرى وستختار المحفظة مجموعة مختلفة.",
  "wallet.svc.no_ecash": "لا نقد إلكتروني بعد.",
  "wallet.svc.no_ecash_body":
    "أضف دار سك وأودع عبر Lightning، أو استقبل توكنًا من أحدهم.",
  "wallet.svc.split_across_mints": "رصيدك موزّع على عدة دور سك.",
  "wallet.svc.mint_says_spent": "أبلغت دار السك أن هذه الإثباتات منفقة بالفعل.",
  "wallet.svc.issue_against_invoice":
    "إصدار نقد إلكتروني مقابل فاتورة Lightning",
  "wallet.svc.pay_invoice": "دفع فاتورة Lightning",
  "wallet.svc.unknown_deposit": "إيداع غير معروف.",
  "wallet.svc.invoice_expired_before": "انتهت صلاحية الفاتورة قبل دفعها.",
  "wallet.svc.invoice_expired": "انتهت صلاحية تلك الفاتورة.",
  "wallet.svc.invoice_unpaid": "لم تُدفع الفاتورة بعد.",
  "wallet.svc.payment_unknown":
    "حالة الدفع غير معروفة؛ ستُفحص مرة أخرى عند التحديث القادم.",
  "wallet.svc.melt_change_pending": "دُفعت فاتورتك.",
  "wallet.svc.melt_change_pending_body":
    "لم تُعد دار السك رسوم التوجيه غير المستخدمة بعد. تُطلب تلقائيًا عند التحديث القادم، ولا يضيع شيء في هذه الأثناء.",
  "wallet.svc.mint_did_not_pay": "لم تدفع دار السك هذه الفاتورة. رصيدك كما هو.",
  "wallet.svc.not_an_invoice": "هذه ليست فاتورة Lightning.",
  "wallet.svc.not_an_invoice_body": "الصق فاتورة bolt11 تبدأ بـ lnbc.",
  "wallet.svc.insufficient_for_invoice": "الرصيد لا يكفي لهذه الفاتورة.",
  "wallet.svc.coins_raced_invoice_body":
    "لم يُخصم شيء ولم تُدفع الفاتورة. حاول مرة أخرى.",
  "wallet.svc.same_mint": "اختر دار سك وجهة مختلفة.",
  "wallet.svc.same_mint_body":
    "المصدر والوجهة هما دار السك نفسها، فلا شيء لنقله.",
  "wallet.svc.quote_failed_retried": "فشل العرض، وأُعيدت محاولة التجميع",
  "wallet.svc.amount_unfit_retried": "المبلغ لم يناسب، وأُعيدت محاولة التجميع",
  "wallet.svc.cannot_size": "تعذّر تحديد حجم هذا التحويل.",
  "wallet.svc.insufficient_at_mint": "الرصيد لا يكفي في {mint}.",
  "wallet.svc.inexact_title":
    "لا تستطيع إثباتاتك تكوين {amount} {unit} بالضبط دون اتصال.",
  "wallet.svc.inexact_detail":
    "أصغر توكن يمكنك إرساله هو {spend} {unit}. وبلا اتصال لا يوجد باقٍ، فالـ {extra} {unit} الإضافية تذهب إلى المستلم.",
  "wallet.svc.no_single_mint":
    "لا توجد دار سك واحدة تحمل {amount} {unit}. لا يمكن دمج النقد الإلكتروني من دور سك مختلفة في توكن واحد: جمّعه في دار واحدة أولًا، أو أرسله بمبالغ منفصلة.",
  "wallet.svc.have_tried_send": "لديك {total} {unit}، وحاولت إرسال {amount}.",
  "wallet.svc.invoice_needs":
    "تحتاج هذه الفاتورة {total} {unit} بما فيها احتياطي التوجيه، ولديك {balance}.",
  "wallet.svc.nothing_to_move": "لا يوجد لدى {mint} أي {unit} لنقلها.",
  "wallet.svc.consolidate_memo": "تجميع من {mint}",
  "wallet.svc.cannot_size_detail":
    "بعد رسوم توجيه Lightning، لا تستطيع {from} نقل مبلغ مفيد إلى {to}. جرّب نقل مبلغ أصغر محدد بدلًا من ذلك.",
  "wallet.svc.mint_cannot": "لا تستطيع {mint} {action}.",
  "wallet.svc.no_nut": "لا تعلن دار السك دعم NUT-{nut}.",
  "wallet.svc.unknown_mint": "تذكر تلك الدفعة دار سك لا تستخدمها.",
  "wallet.svc.unknown_mint_body":
    "أضف دار السك بنفسك أولًا إن كنت تثق بها؛ فلا يُصرف شيء من دار لم تخترها.",
  "wallet.svc.no_relay": "لا اتصال بمُرحِّل",
  "wallet.svc.no_shared_mint": "لا دار سك مشتركة برصيد كافٍ",
  "wallet.svc.no_nutzap_info":
    "لم ينشر المستلم معلومات نَتزاب (NIP-61 نوع 10019)",
  "wallet.svc.locked_undelivered":
    "مقفلة على مفتاحهم لكنها لم تُسلَّم بعد. شارك التوكن من هذه المعاملة لإتمامها.",
  "wallet.svc.swap_lost":
    "لم تُكمل دار السك هذا التبديل قط، فلم يُصدر شيء مقابله.",
  "wallet.svc.swap_unreadable":
    "حُفظ هذا التبديل بصيغة لا تستطيع هذه النسخة إعادة تشغيلها.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "موثّق عبر رمز الاستجابة السريعة",
  "contacts.qr.keys_unverified": "وصلت المفاتيح، لم تُوثَّق",
  "contacts.qr.not_verified": "لم يُوثَّق بعد",
  "contacts.qr.message": "رسالة",
  "contacts.qr.add": "إضافة جهة اتصال",
  "contacts.qr.scan_title": "مسح رمز الاستجابة السريعة",
  "contacts.qr.aim": "وجّه كاميرتك نحو رمزهم",
  "contacts.qr.add_desc": "تواصل مع شخص ليس بالجوار على الشبكة.",
  "contacts.qr.peer_id_hint":
    "معرّف النظير 16 حرفًا. ورمز جهة الاتصال يبدأ بـ airhop:.",
  "contacts.qr.or_scan": "أو امسح رمزهم",
  "contacts.qr.trust_note":
    "الرمز الذي تمسحه بكاميرتك وحده يوثّق مفتاحهم. الرمز الملصوق يحمل مفاتيحهم لكن لا يثبت أنه صادر منهم.",
  "contacts.qr.peer_id": "معرّف النظير أو رمز جهة الاتصال",
  "contacts.qr.peer_id_placeholder": "الصق معرّفًا أو رمز جهة اتصال",
  "contacts.qr.scan_camera_a11y": "مسح رمز الاستجابة السريعة بالكاميرا",
  "contacts.qr.scan_camera_desc": "استخدم كاميرتك",
  "contacts.qr.upload_a11y": "رفع صورة رمز من المعرض",
  "contacts.qr.upload": "رفع من المعرض",
  "contacts.qr.upload_desc": "اختر صورة رمز محفوظة",
  "contacts.qr.scan_a11y": "إضافة جهة اتصال بمسح رمز استجابة سريعة",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "الصق معرّف نظير من 16 حرفًا، أو رابط airhop://peer/…، أو رمز جهة اتصال.",
  "contacts.scan.camera_label": "الوصول إلى الكاميرا",
  "contacts.scan.camera_purpose": "مسح رمز جهة اتصال",
  "contacts.scan.camera_needed":
    "الوصول إلى الكاميرا مطلوب للمسح. ما زال بإمكانك الإضافة بمعرّف النظير.",
  "contacts.scan.camera_failed":
    "تعذّر تشغيل الكاميرا. أغلق تطبيقات الكاميرا الأخرى وحاول مرة أخرى.",
  "contacts.scan.photo_label": "الوصول إلى الصور",
  "contacts.scan.photo_purpose": "مسح رمز استجابة سريعة حفظته",
  "contacts.scan.photo_needed":
    "الوصول إلى الصور مطلوب لاختيار صورة. ما زال بإمكانك الإضافة بمعرّف النظير.",
  "contacts.scan.no_qr": "لم يُعثر على رمز Airhop في تلك الصورة.",
  "contacts.scan.unreadable": "تعذّرت قراءة رمز استجابة سريعة من تلك الصورة.",
  "contacts.scan.bitchat_expired":
    "انتهت صلاحية رمز bitchat ذاك. اطلب منهم فتح رمزهم مرة أخرى.",
  "contacts.scan.tampered":
    "رمز الاستجابة السريعة هذا غير صالح: معرّف النظير فيه لا يطابق مفاتيحه. ربما جرى العبث به.",
  "contacts.scan.already_added": "موجود في جهات اتصالك بالفعل",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "بانتظار الوصول إلى الكاميرا…",
  "contacts.verify.camera_off": "الكاميرا معطّلة",
  "contacts.verify.open_settings": "فتح الإعدادات",
  "contacts.verify.verified": "موثّق",
  "contacts.verify.different": "جهة اتصال مختلفة",
  "contacts.verify.scan_again": "امسح مرة أخرى",
  "contacts.verify.failed": "تعذّر التوثيق",
  "contacts.verify.done": "تم",
  "contacts.verify.title": "توثيق {name}",
  "contacts.verify.aim": "وجّه كاميرتك نحو رمزهم",
  "contacts.verify.camera_off_body":
    "فعّل الوصول إلى الكاميرا من الإعدادات للتوثيق بالرمز.",
  "contacts.verify.match_body":
    "مفتاح {name} مطابق. يمكنك الوثوق بجهة الاتصال هذه.",
  "contacts.verify.different_body":
    "هذا الرمز يخص شخصًا آخر. اطلب من {name} أن يعرض رمزه هو.",
  "contacts.verify.tampered_body":
    "يبدو أن هذا الرمز عُبث به: معرّفه لا يطابق مفتاحه.",
  "contacts.verify.choose_title": "كيف تريد التحقق؟",
  "contacts.verify.choose_body":
    "كلاهما يؤكد أن المفاتيح على هذا الهاتف تخص {name} فعلًا.",
  "contacts.verify.method_scan": "امسح رمزهم",
  "contacts.verify.method_scan_sub": "هم معك هنا",
  "contacts.verify.method_compare": "قارن رمزًا",
  "contacts.verify.method_compare_sub": "اقرآه لبعضكما في مكالمة",
  "contacts.verify.no_keys":
    "لا مفاتيح لجهة الاتصال هذه بعد. راسلهم، أو امسح رمزهم عند اللقاء.",
  "contacts.verify.compare_title": "اقرآ هذه لبعضكما",
  "contacts.verify.compare_body":
    "يرى {name} الكلمات الست نفسها. إن تطابقت، فكلاكما يعلم أن المفاتيح حقيقية.",
  "contacts.verify.codes_match": "متطابقة",
  "contacts.verify.codes_differ": "غير متطابقة",
  "contacts.verify.compared_body":
    "أكدت أنت و{name} الرمز نفسه. جهة الاتصال هذه موثّقة.",

  // ---- Settings: shared chrome ----
  "settings.back": "رجوع",
  "settings.coming_soon": "قريبًا",
  "settings.opens_externally": "{label}، يفتح خارج التطبيق",
  "settings.peer_id": "معرّف النظير",
  "settings.share_peer_id": "مشاركة معرّف النظير الخاص بك",
  "settings.share_id_short": "مشاركة المعرّف",
  "settings.peer_id_sheet.title": "معرّف النظير الخاص بك",
  "settings.peer_id_sheet.copy": "نسخ معرّف النظير",
  "settings.peer_id_sheet.note":
    "لا يعمل هذا إلا وأنتما ضمن نطاق البلوتوث. ولتمكين أحدهم من مراسلتك من أي مكان، شارك رمز الاستجابة السريعة الخاص بك بدلًا من ذلك.",

  // ---- Settings: hub rows ----
  "settings.section.general": "عام",
  "settings.section.general_desc":
    "ميزات اختيارية، التراجع عن الإرسال، الوسائط، إعادة الضبط",
  "settings.section.privacy": "الخصوصية والأمان",
  "settings.section.privacy_desc":
    "السرية المستقبلية، الحزم الموقّعة، النظراء المحظورون",
  "settings.section.network": "الشبكة والمُرحِّلات",
  "settings.section.network_desc":
    "الرجوع إلى الإنترنت، مُرحِّلات nostr، التوافق مع bitchat",
  "settings.section.permissions": "الأذونات",
  "settings.section.permissions_desc":
    "البلوتوث، الموقع، الإشعارات، الكاميرا، الميكروفون",
  "settings.section.storage": "التخزين والبيانات",
  "settings.section.diagnostics": "التشخيص",

  // ---- Settings: group headings ----
  "settings.group.transports": "وسائل النقل",
  "settings.group.nearby": "بالجوار",
  "settings.group.sync": "المزامنة",
  "settings.group.features": "الميزات",
  "settings.group.messages": "الرسائل",
  "settings.group.media": "الوسائط",
  "settings.group.reset": "إعادة الضبط",
  "settings.group.always_on": "مفعّل دائمًا",
  "settings.group.notifications": "الإشعارات",
  "settings.group.blocked": "المحظورون",
  "settings.group.theme": "المظهر",
  "settings.group.font": "الخط",
  "settings.group.language": "اللغة",
  "settings.section.diagnostics_desc": "حالة الاتصال والأجهزة القريبة",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "وصلات البلوتوث",
  "settings.diag.ble_links_desc": "الأجهزة المتصلة بهذا الهاتف مباشرة",
  "settings.diag.lan": "الشبكة المحلية",
  "settings.diag.lan_desc": "هواتف على شبكة Wi-Fi واحدة",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "من هاتف إلى هاتف دون موجّه",
  "settings.diag.wifi_active": "يعمل",
  "settings.diag.wifi_unsupported": "غير مدعوم على هذا الجهاز",
  "settings.diag.wifi_permission": "محظور بإذن",
  "settings.diag.wifi_unavailable": "غير متاح الآن",
  "settings.diag.wifi_unpaired": "لا يوجد اقتران",
  "settings.diag.wifi_unknown": "بانتظار وحدة الراديو",
  "settings.diag.relays": "مُرحِّلات Nostr",
  "settings.diag.relays_desc": "تُستخدم لقنوات الموقع والوصول عبر الإنترنت",
  "settings.diag.connected": "متصل",
  "settings.diag.disconnected": "غير متصل",
  "settings.diag.peer_direct": "وصلة مباشرة",
  "settings.diag.peer_relayed": "سُمع عبر جهاز آخر",
  "settings.diag.rssi": "{dbm} ديسيبل مللي",
  "settings.diag.no_rssi": "لا قراءة إشارة",
  "settings.diag.no_peers": "لا أحد ضمن النطاق",
  "settings.diag.no_peers_desc": "{links} وصلة لاسلكية مفتوحة",
  "settings.diag.gcs_size": "حجم المرشّح",
  "settings.diag.gcs_size_desc": "أكبر مرشّح مزامنة أُرسل عبر الأثير",
  "settings.diag.fpr": "معدّل الإيجابيات الخاطئة",
  "settings.diag.fpr_desc": "كم مرة يدّعي المرشّح وجود حزمة تنقصنا",
  "settings.diag.bytes": "{n} بايت",
  "settings.diag.footnote":
    "لا شيء هنا قابل للتغيير. هذه القيم ثابتة ليبقى Airhop متوافقًا مع bitchat.",
  "settings.section.storage_desc": "الاستخدام والتخزين المؤقت",
  "settings.section.appearance": "المظهر",
  "settings.section.appearance_desc": "المظهر والخط واللغة",
  "settings.section.help": "المساعدة والملاحظات",
  "settings.section.help_desc":
    "تواصل معنا، أبلغ عن خلل، أو اقرأ الأسئلة الشائعة",
  "settings.section.support": "الدعم",
  "settings.section.support_desc": "ساعد في إبقاء التطوير نشطًا",
  "settings.section.about": "حول",
  "settings.section.about_desc": "الإصدار وسجل التغييرات والمصدر",

  // ---- Settings: general ----
  "settings.general.undo": "التراجع عن الإرسال",
  "settings.general.feature_ai": "الذكاء الاصطناعي",
  "settings.general.feature_wallet": "المحفظة",
  "settings.general.undo_seconds": "{count} ثانية",
  "settings.general.undo_a11y": "التراجع عن الإرسال: {value}",
  "settings.general.quality_a11y": "ضبط جودة الرفع على {value}",
  "settings.general.undo_desc":
    "يحتجز الرسالة المرسلة لحظة لتتمكن من التراجع قبل خروجها",
  "settings.general.undo_off_desc": "أرسل فورًا، دون تراجع",
  "settings.general.undo_2": "ثانيتان",
  "settings.general.undo_2_desc": "فرصة سريعة للتراجع",
  "settings.general.undo_10": "10 ثوانٍ",
  "settings.general.undo_10_desc": "أطول مهلة",
  "settings.general.quality": "جودة الرفع",
  "settings.general.quality_desc":
    "تنطبق على الصور المرسلة من كاميرتك أو مكتبتك. كل صورة تُلائَم للشبكة في الحالتين.",
  "settings.general.quality_low": "منخفضة",
  "settings.general.quality_low_desc": "أصغر الصور، وأسرعها إرسالًا",
  "settings.general.quality_medium": "متوسطة",
  "settings.general.quality_medium_desc": "توازن بين التفاصيل والسرعة",
  "settings.general.quality_high": "عالية",
  "settings.general.quality_high_desc": "تحتفظ بأكبر قدر من التفاصيل",
  "settings.general.feature_wallet_desc":
    "أرسل نقد Cashu الإلكتروني من نظير إلى نظير عبر الشبكة",
  "settings.general.feature_wallet_a11y": "المحفظة (مفعّلة دائمًا)",
  "settings.general.feature_ai_desc":
    "مساعد خاص على الجهاز، دون أي اتصال بالشبكة",
  "settings.general.feature_feeds": "الخلاصات",
  "settings.general.feature_feeds_desc":
    "اقرأ وانشر في خلاصات Bluesky وMastodon",
  "settings.general.show_media": "عرض الوسائط تلقائيًا",
  "settings.general.show_media_desc":
    "تظهر الصور ومقاطع الفيديو في المحادثة، أو تبقى خلف ضغطة",
  "settings.general.reset": "إعادة ضبط الإعدادات",
  "settings.general.media_retention": "الاحتفاظ بالوسائط لمدة",
  "settings.general.media_retention_desc":
    "تُحذف الصور ومقاطع الفيديو والملاحظات الصوتية بعد المدة المختارة",
  "settings.general.media_retention_sheet":
    "اختر كم تبقى الوسائط على هذا الجهاز. الوسائط المحذوفة لا يمكن استردادها.",
  "settings.general.retention_7_desc":
    "أقل ما يُترك خلفك. الأفضل إن كان الهاتف نفسه هو الخطر.",
  "settings.general.retention_14_desc":
    "حل وسط لأسبوع أو أسبوعين بعيدًا عن التغطية.",
  "settings.general.retention_30_desc":
    "يبقي المحادثات مقروءة أطول مدة، ويشغل أكبر مساحة.",
  "settings.general.reset_desc":
    "يعيد كل تفضيل إلى قيمته الافتراضية، مع ترك هويتك ورسائلك وجهات اتصالك ومحفظتك دون مساس",
  "settings.general.reset_title": "إعادة ضبط الإعدادات؟",
  "settings.general.reset_body":
    "يعود كل تفضيل إلى قيمته الافتراضية: المظهر، والتراجع عن الإرسال، والاتصال (الإنترنت، Tor، البوابة، الجسر، المُرحِّلات). هويتك ورسائلك وجهات اتصالك ومحفظتك دون مساس.",
  "settings.general.reset_confirm": "إعادة الضبط",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "السرية المستقبلية",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet مفعّل دائمًا للرسائل المباشرة",
  "settings.security.signed_packets": "الحزم الموقّعة",
  "settings.security.signed_packets_desc": "كل حزمة موقّعة بـ Ed25519",
  "settings.security.hide_previews": "إخفاء معاينات الإشعارات",
  "settings.security.hide_previews_desc":
    "يبقي المرسل والرسالة بعيدين عن شاشة القفل، التي تعرضهما دون فتح القفل",
  "settings.security.no_blocked": "لا نظراء محظورون",
  "settings.security.no_blocked_desc":
    "النظراء المحظورون لا يستطيعون مراسلتك ولا يظهرون في تبويب الشبكة",
  "settings.security.unblock_title": "إلغاء حظر هذا النظير",
  "settings.security.unblock": "إلغاء الحظر",
  "settings.security.unblock_peer": "إلغاء حظر {name}",
  "settings.security.unblock_body":
    "سيتمكن {name} من مراسلتك مرة أخرى وسيظهر في تبويب الشبكة عند اقترابه.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "الرجوع إلى الإنترنت",
  "settings.network.internet_desc":
    "تابع عبر مُرحِّلات Nostr عندما يكون نظراء الشبكة خارج النطاق",
  "settings.network.internet_off_title": "تعطيل الإنترنت؟",
  "settings.network.internet_off_body":
    "سيعمل Airhop على البلوتوث فقط. سيتوقف عن الاتصال بأي مُرحِّل Nostr، وسيتعطل Tor وبوابة الإنترنت وجسر الشبكة جميعًا. تبقى محادثة البلوتوث القريبة تعمل.",
  "settings.network.turn_off": "تعطيل",
  "settings.network.discovery": "اكتشاف المُرحِّلات الجغرافية",
  "settings.network.discovery_desc":
    "اختيار أقرب المُرحِّلات لخلية موقع تلقائيًا من بين أكثر من 300 مُرحِّل موزّع",
  "settings.network.discovery_needs_relay": "أضف مُرحِّلًا مخصصًا أولًا",
  "settings.network.discovery_needs_relay_body":
    "الاكتشاف التلقائي هو ما يوجّه Airhop إلى أقرب المُرحِّلات. تعطيله لا يكون منطقيًا إلا بعد أن تثبّت مُرحِّلاتك أدناه، فأضف واحدًا على الأقل أولًا.",
  "settings.network.custom_only_title": "استخدام مُرحِّلاتك المخصصة فقط؟",
  "settings.network.custom_only_body":
    "ستتوقف قنوات الموقع وجسر الشبكة عن اختيار أقرب المُرحِّلات تلقائيًا وتستخدم ما أضفته أنت فقط. قد يقلّل هذا المدى، وقد تتوقف عن لقاء مستخدمي bitchat، الذين يتجمعون على أقرب المُرحِّلات.",
  "settings.network.custom": "مُرحِّلات مخصصة",
  "settings.network.custom_desc":
    "أضف مُرحِّلاتك الخاصة لقنوات الموقع وجسر الشبكة",
  "settings.network.custom_added": "أُضيف {count} من {max}",
  "settings.network.dm_relays": "مُرحِّلات الرسائل",
  "settings.network.dm_relays_desc":
    "تستخدم الرسائل المباشرة والقنوات الخاصة هذه دائمًا. والمُرحِّلات المخصصة لا تغيّرها.",
  "settings.network.discovery_back_on": "عاد اكتشاف المُرحِّلات الجغرافية",
  "settings.network.discovery_back_on_body":
    "كان ذلك آخر مُرحِّل مخصص لديك. قنوات الموقع تحتاج مكانًا تنشر فيه، لذا يعود Airhop إلى اختيار أقرب المُرحِّلات تلقائيًا.",
  "settings.network.add_relay": "إضافة مُرحِّل",
  "settings.network.remove_relay": "إزالة {url}",
  "settings.network.add_short": "إضافة",
  "settings.network.relay_limit":
    "يمكنك إضافة {count} مُرحِّلات. أزل واحدًا لإضافة آخر.",
  "settings.network.relay_duplicate": "هذا المُرحِّل موجود في قائمتك بالفعل.",
  "settings.network.relay_invalid":
    "أدخل مضيف مُرحِّل صالحًا، مثل relay.example.com. المنفذ مطلوب فقط إن كان المُرحِّل لا يستخدم الافتراضي. عناوين IP والأسماء المحلية غير مسموح بها.",
  "settings.network.wifi_pair": "الاقتران",
  "settings.network.wifi_paired": "الأجهزة المقترنة",
  "settings.network.wifi_pair_find": "ابحث عن جهاز",
  "settings.network.wifi_pair_find_desc":
    "ابحث عن iPhone قريب يعرض نفسه. يحتاج الهاتفان إلى iOS 26 أو أحدث.",
  "settings.network.wifi_pair_show": "أظهر هذا الـ iPhone",
  "settings.network.wifi_pair_show_desc":
    "اسمح لجهاز iPhone قريب بالعثور على هذا الجهاز. أحدكما يبحث والآخر يعرض، في الوقت نفسه.",
  "settings.network.wifi_pair_find_action": "اختر جهاز iPhone قريباً",
  "settings.network.wifi_pair_show_action":
    "اجعل هذا الـ iPhone قابلاً للاكتشاف",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware غير متاح الآن",
  "settings.network.wifi_pair_forget": "أزل اقتراناً من تطبيق Settings",
  "settings.network.bitchat": "التوافق مع bitchat",
  "settings.network.bitchat_desc":
    "نفس شبكة BLE التي يستخدمها bitchat، بتوافق كامل. هذا مفعّل دائمًا ولا يمكن تعطيله.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "التشغيل في الخلفية",
  "settings.conn.background_desc": "أبقِ الشبكة تعمل عندما يكون Airhop مغلقًا",
  "settings.conn.background_on_title": "إبقاء الشبكة تعمل؟",
  "settings.conn.background_on_body":
    "يواصل Airhop التمرير والاستقبال وهو مغلق، فتصلك الرسائل أثناء غيابك. ويعرض Android إشعارًا مستمرًا أثناء ذلك.",
  "settings.conn.background_off_title": "إيقاف الشبكة عند إغلاق Airhop؟",
  "settings.conn.background_off_body":
    "لن تصل الرسائل إلا وAirhop مفتوح، وسيتوقف هذا الهاتف عن التمرير لمن حوله. ويختفي الإشعار المستمر.",
  "settings.conn.live_voice": "الصوت المباشر",
  "settings.conn.live_voice_desc": "تحدث إلى من هم بالجوار كجهاز لاسلكي",
  "settings.conn.live_voice_on_title": "تفعيل الصوت المباشر؟",
  "settings.conn.live_voice_on_body":
    "الضغط المستمر على الميكروفون يرسل صوتك إلى كل من هم ضمن نطاق البلوتوث وأنت تتكلم، ويُشغَّل صوتهم على هاتفك. ولا يُسجَّل شيء.",
  "settings.conn.live_voice_off_title": "تعطيل الصوت المباشر؟",
  "settings.conn.live_voice_off_body":
    "الضغط المستمر على الميكروفون يسجّل ملاحظة صوتية بدلًا من ذلك. تُرسل عندما تفلت، ولا يسمعها أحد حتى يشغّلها.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "توجيه Tor",
  "settings.conn.tor_desc": "وجّه حركة Nostr عبر Tor لخصوصية إضافية",
  "settings.conn.tor_on_title": "توجيه حركة Nostr عبر Tor؟",
  "settings.conn.tor_on_body":
    "تتوقف المُرحِّلات عن رؤية عنوان IP الخاص بك. يستغرق الاتصال وقتًا أطول وتصل الرسائل أبطأ. والبلوتوث لا يتأثر.",
  "settings.conn.tor_off_title": "تعطيل توجيه Tor؟",
  "settings.conn.tor_off_body":
    "تعود حركة Nostr عبر اتصالك العادي، فترى المُرحِّلات عنوان IP الخاص بك مرة أخرى. والبلوتوث لا يتأثر في الحالتين.",
  "settings.conn.tor_orbot_idle":
    "Orbot مثبّت لكنه غير متصل. افتح Orbot، وشغّل شبكته الافتراضية الخاصة، ثم فعّل هذا.",
  "settings.conn.tor_unavailable": "توجيه Tor غير متاح في هذه النسخة.",
  "settings.conn.tor_timeout":
    "يستغرق Tor أكثر من دقيقة للاتصال. يبقى مفعّلًا ويواصل المحاولة؛ وسيخبرك تبويب الشبكة متى بدأ التوجيه، أو إن كانت هذه الشبكة تحجبه.",
  "settings.conn.tor_failed":
    "تعذّر تشغيل Tor. تأكد من أن التطبيق يملك وصولًا إلى الشبكة.",
  "settings.conn.mint_clearnet": "السماح بحركة دار السك عبر الشبكة المكشوفة",
  "settings.conn.mint_clearnet_desc":
    "لا يغطي Tor على iOS سوى Nostr. اتركه معطّلًا لحجب طلبات دار السك؛ والنقد الإلكتروني عبر الشبكة يعمل في الحالتين.",
  "settings.conn.gateway": "بوابة الإنترنت",
  "settings.conn.gateway_desc":
    "أعِر اتصالك لهاتف قريب دون إنترنت ليتمكن من الوصول إلى قنوات الموقع",
  "settings.conn.gateway_on_title": "تفعيل بوابة الإنترنت؟",
  "settings.conn.gateway_on_body":
    "ستُرسل الهواتف القريبة التي لا اتصال لها رسائل قنوات الموقع وتستقبلها عبر اتصالك. يستهلك ذلك بياناتك وبطاريتك، وتبقى رسائلهم مشفّرة من طرف إلى طرف، فلا تستطيع قراءة ما يمر.",
  "settings.conn.gateway_off_title": "تعطيل بوابة الإنترنت؟",
  "settings.conn.gateway_off_body":
    "تتوقف الهواتف القريبة غير المتصلة عن الوصول إلى قنوات الموقع عبر هاتفك. ورسائلك أنت لا تتأثر.",
  "settings.conn.bridge": "جسر الشبكة",
  "settings.conn.bridge_desc":
    "اربط محادثة #bluetooth العامة لهذه المنطقة بحشد بلوتوث آخر خارج النطاق عبر الإنترنت",
  "settings.conn.bridge_on_title": "تفعيل جسر الشبكة؟",
  "settings.conn.bridge_on_body":
    "ستُنشر رسائل #bluetooth العامة الخاصة بك إلى منطقتك عبر الإنترنت، فيتمكن من هم خارج نطاق البلوتوث من قراءتها. الرسائل الخاصة لا تُجسَّر أبدًا، و«بالجوار فقط» تُبقي أي رسالة بعينها محلية.",
  "settings.conn.bridge_off_title": "تعطيل جسر الشبكة؟",
  "settings.conn.bridge_off_body":
    "تعود رسائل #bluetooth العامة الخاصة بك إلى نطاق البلوتوث، وتتوقف رسائل الحشد المجسّر عن الوصول إلى هنا.",
  "settings.conn.bridge_needs_location": "يحتاج جسر الشبكة إلى الموقع",
  "settings.conn.bridge_needs_location_desc":
    "يحدد منطقتك من قراءة موقع. امنح إذن الموقع لبدء التجسير.",
  "settings.conn.grant_location": "منح إذن الموقع",
  "settings.conn.grant_short": "منح",
  "settings.conn.orbot_body":
    "يوجّه Airhop حركة Tor عبر Orbot. ثبّت Orbot وفعّله من متجر Play، ثم فعّل هذا.",
  "settings.conn.internet_off": "الإنترنت معطّل",
  "settings.conn.internet_off_desc":
    "يستخدم Tor والجسر والبوابة الإنترنت جميعًا. فعّل الرجوع إلى الإنترنت من قسم الشبكة لاستخدامها.",
  "settings.conn.turn_on": "تفعيل",
  "settings.conn.turn_off": "تعطيل",
  "settings.conn.orbot_title": "Tor على Android",
  "settings.conn.get_orbot": "احصل على Orbot",
  "settings.conn.later": "لاحقًا",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "البلوتوث",
  "settings.permissions.bluetooth_desc":
    "يعثر على الأجهزة القريبة ويمرّر الرسائل بينها. بدونه لا تستطيع الشبكة العمل.",
  "settings.permissions.location": "الموقع",
  "settings.permissions.location_desc":
    "يفتح قنوات المناطق القريبة. بدونه تبقى تلك القنوات مغلقة وتستمر شبكة البلوتوث كالمعتاد.",
  "settings.permissions.notifications": "الإشعارات",
  "settings.permissions.notifications_desc":
    "تصلك تنبيهات بالرسائل الجديدة حتى عندما يكون التطبيق مغلقًا. بدونها لا تراها إلا عند فتح Airhop.",
  "settings.permissions.camera": "الكاميرا",
  "settings.permissions.camera_desc":
    "امسح رموز الاستجابة السريعة والتقط صورًا أو مقاطع فيديو لإرسالها. بدونها ما زال بإمكانك مشاركة الوسائط من مكتبتك.",
  "settings.permissions.photos": "الصور",
  "settings.permissions.photos_desc":
    "أرسل الصور من مكتبتك واحفظ الوسائط المستلمة. بدونها ما زال بإمكانك التقاط صور جديدة بالكاميرا وإرسالها.",
  "settings.permissions.microphone": "الميكروفون",
  "settings.permissions.microphone_desc":
    "سجّل الرسائل الصوتية وأرسلها أو استخدم الصوت المباشر. بدونه لن تعمل الرسائل الصوتية ولا الصوت المباشر.",
  "settings.permissions.allow": "منح هذا الإذن",
  "settings.permissions.open_settings": "فتح إعدادات النظام لتغيير هذا الإذن",
  "settings.permissions.system": "النظام",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "استهلاك الشبكة",
  "settings.storage.storage_usage": "استهلاك التخزين",
  "settings.storage.storage_usage_desc":
    "الرسائل وإثباتات المحفظة والمرفقات المخزّنة مؤقتًا",
  "settings.storage.session_usage":
    "هذه الجلسة · {sent} مرسلة، {received} مستلمة",
  "settings.storage.cache": "التخزين المؤقت",
  "settings.storage.cache_desc": "{size} من المرفقات",
  "settings.storage.clear_cache": "مسح التخزين المؤقت للمرفقات",
  "settings.storage.clear": "مسح",
  "settings.storage.clear_title": "مسح الوسائط المخزّنة مؤقتًا؟",
  "settings.storage.clear_body":
    "تُزال الصور ومقاطع الفيديو والملاحظات الصوتية والملفات من هذا الجهاز، المرسلة والمستلمة على السواء. ولا يمكن تنزيلها مرة أخرى: ستقول فقاعاتها ذلك، ويمكنك أن تطلب من المرسل إعادة الإرسال. الرسائل والمحفظة دون مساس.",
  "settings.storage.cleared": "مُسح التخزين المؤقت",
  "settings.storage.freed": "حُرّرت {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "ضبط المظهر على {value}",
  "settings.font.set_a11y": "ضبط الخط أحادي المسافة على {value}",
  "settings.font.system": "النظام",
  "settings.font.system_desc": "يستخدم الخط أحادي المسافة الافتراضي لجهازك",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "عصري وسهل القراءة",
  "settings.language.en": "الإنجليزية",
  "settings.language.am": "الأمهرية",
  "settings.language.ar": "العربية",
  "settings.language.bn": "البنغالية",
  "settings.language.my": "البورمية",
  "settings.language.zh_hans": "الصينية (المبسّطة)",
  "settings.language.zh_hant": "الصينية (التقليدية)",
  "settings.language.nl": "الهولندية",
  "settings.language.fil": "الفلبينية",
  "settings.language.fr": "الفرنسية",
  "settings.language.ka": "الجورجية",
  "settings.language.de": "الألمانية",
  "settings.language.hi": "الهندية",
  "settings.language.id": "الإندونيسية",
  "settings.language.it": "الإيطالية",
  "settings.language.ja": "اليابانية",
  "settings.language.ko": "الكورية",
  "settings.language.mg": "المالاغاشية",
  "settings.language.ms": "الملايوية",
  "settings.language.ne": "النيبالية",
  "settings.language.fa": "الفارسية",
  "settings.language.pl": "البولندية",
  "settings.language.pt_br": "البرتغالية (البرازيل)",
  "settings.language.pt_pt": "البرتغالية (البرتغال)",
  "settings.language.pa": "البنجابية",
  "settings.language.ru": "الروسية",
  "settings.language.es": "الإسبانية",
  "settings.language.sw": "السواحيلية",
  "settings.language.sv": "السويدية",
  "settings.language.ta": "التاميلية",
  "settings.language.th": "التايلاندية",
  "settings.language.tr": "التركية",
  "settings.language.uk": "الأوكرانية",
  "settings.language.ur": "الأردية",
  "settings.language.vi": "الفيتنامية",
  "settings.language.pseudo": "لغة زائفة",
  "settings.language.soon": "قريبًا",
  "settings.language.soon_a11y": "{value}، قريبًا",
  "settings.language.set_a11y": "ضبط اللغة على {value}",
  "settings.language.pending": "عند الفتح القادم",
  "settings.language.pending_a11y":
    "{value}، تُطبَّق في المرة القادمة التي تفتح فيها Airhop",
  "settings.language.rtl_title": "أعد فتح Airhop لإتمام التبديل",
  "settings.language.rtl_body":
    "تُقرأ {value} من اليمين إلى اليسار، ولا يستطيع Airhop تغيير الاتجاه إلا عند بدء تشغيله. أغلقه وافتحه من جديد لإتمام التبديل. لا يضيع شيء، وتبقى شبكتك متصلة حتى تفعل ذلك.",
  "settings.theme.light": "فاتح",
  "settings.theme.light_desc": "استخدم اللوحة الفاتحة دائمًا",
  "settings.theme.dark": "داكن",
  "settings.theme.dark_desc": "استخدم اللوحة الداكنة دائمًا",

  // ---- Settings: profile and identity ----
  "settings.status.online": "متصل",
  "settings.status.online_desc": "قابل للاكتشاف، يبث ويبحث",
  "settings.status.away": "غائب",
  "settings.status.away_desc": "الشبكة متوقفة، لا بحث ولا بث",
  "settings.status.invisible": "خفي",
  "settings.status.invisible_desc": "يبحث، لكنه مخفي عن الاكتشاف",
  "settings.status.title": "الحالة",
  "settings.status.set_a11y": "ضبط الحالة على {value}",
  "settings.status.edit": "تعديل الحالة",
  "settings.status.desc": "اختر مدى ظهورك على الشبكة.",
  "settings.transfer.identity": "الهوية والمفاتيح",
  "settings.transfer.identity_desc": "معرّف النظير واسم المستخدم وجهات الاتصال",
  "settings.transfer.chats": "المحادثات والسجل",
  "settings.transfer.chats_desc":
    "المحادثات والمجموعات والقنوات التي انضممت إليها",
  "settings.transfer.wallet": "رصيد المحفظة",
  "settings.transfer.wallet_desc": "إثباتات Cashu وسجل المعاملات",
  "settings.transfer.title": "النقل إلى هاتف جديد",
  "settings.transfer.desc": "انقل هويتك ومحادثاتك ومحفظتك إلى جهاز آخر",
  "settings.transfer.coming_soon_a11y": "النقل إلى هاتف جديد، قريبًا",
  "settings.transfer.body":
    "قرّب الهاتفين من بعضهما وانقل كل شيء عبر البلوتوث. لا شيء يمر عبر خادم، فهو يعمل دون إنترنت.",
  "settings.qr.permission_label": "الوصول إلى الصور",
  "settings.qr.permission_purpose": "حفظ رمز الاستجابة السريعة الخاص بك",
  "settings.qr.saved": "حُفظ",
  "settings.qr.saved_body": "حُفظ رمز الاستجابة السريعة في مكتبة صورك.",
  "settings.qr.save_failed": "تعذّر الحفظ",
  "settings.qr.save_failed_body":
    "تعذّر حفظ رمز الاستجابة السريعة. حاول مرة أخرى.",
  "settings.qr.share_message": "أضفني على Airhop",
  "settings.qr.share_body":
    "أضفني على Airhop — مراسلة خاصة عبر الشبكة تعمل دون إنترنت أولًا.",
  "settings.qr.show_short": "عرض الرمز",
  "settings.qr.title": "رمز الاستجابة السريعة الخاص بك",
  "settings.qr.note":
    "يحتوي على مفاتيحك العامة، التي تتيح للآخرين مراسلتك من أي مكان. شاركه فقط مع من تثق بهم. ولن يتغير ما لم تمسح هويتك.",
  "settings.qr.code_label": "رمز جهة الاتصال",
  "settings.qr.copy_code": "نسخ رمز جهة الاتصال",
  "settings.qr.share": "مشاركة رمز الاستجابة السريعة",
  "settings.qr.share_short": "مشاركة الرمز",
  "settings.qr.download": "تنزيل رمز الاستجابة السريعة",
  "settings.qr.download_short": "تنزيل الرمز",
  "settings.qr.show": "عرض رمز الاستجابة السريعة",
  "settings.wipe.trigger": "تشغيل المسح الطارئ",
  "settings.wipe.trigger_desc": "اضغط ثلاث مرات للمسح فورًا دون تأكيد",
  "settings.wipe.title": "المسح الطارئ",
  "settings.wipe.now": "امسح الآن",
  "settings.wipe.desc": "دمّر كل المفاتيح والرسائل والإثباتات فورًا",
  "settings.wipe.body":
    "سيدمّر هذا فورًا كل مفاتيحك ورسائلك وإثباتات محفظتك. لا يمكن التراجع عن هذا.",
  "settings.wipe.in_progress": "جارٍ المسح",
  "settings.wipe.in_progress_body":
    "يجري تدمير مفاتيحك ورسائلك وملفاتك. يستغرق هذا ثوانٍ قليلة، ويكتمل من تلقاء نفسه إن أُغلق التطبيق.",
  "settings.wipe.got_it": "فهمت",
  "settings.wipe.keys_failed": "تعذّر تدمير المفاتيح",
  "settings.wipe.keys_failed_body":
    "ذهبت رسائلك وجهات اتصالك ومحفظتك، لكن الجهاز رفض تسليم مفاتيحك. افتح قفل الجهاز وامسح مرة أخرى.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "تواصل معنا",
  "settings.help.contact_a11y": "مراسلة {address}",
  "settings.help.bug": "الإبلاغ عن خلل",
  "settings.help.bug_desc": "افتح مشكلة على GitHub",
  "settings.help.bug_a11y": "الإبلاغ عن خلل على GitHub",
  "settings.help.faq": "الأسئلة الشائعة",
  "settings.help.faq_desc": "إجابات عن الأسئلة المتكررة",
  "settings.help.faq_a11y": "فتح الأسئلة الشائعة",
  "settings.help.terms_desc": "كيف يمكن استخدام Airhop",
  "settings.help.terms_a11y": "فتح شروط الخدمة",
  "settings.help.privacy_desc": "ما الذي لا نجمعه",
  "settings.help.privacy_a11y": "فتح سياسة الخصوصية",

  // ---- Settings: support ----
  "settings.support.card": "بطاقة أو UPI",
  "settings.support.card_desc":
    "الخدمات المصرفية الإلكترونية والمحافظ، عالميًا",
  "settings.support.card_a11y":
    "الدعم ببطاقة أو UPI أو خدمة مصرفية إلكترونية أو محفظة",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "شهريًا أو مرة واحدة، دون رسوم منصة",
  "settings.support.sponsors_a11y": "الدعم عبر GitHub Sponsors",
  "settings.support.note":
    "أبني Airhop في وقت فراغي. لا مستثمرين ولا إعلانات. إن كان مفيدًا لك، فالمساهمة تقطع شوطًا طويلًا في إبقاء التطوير نشطًا. وتبقى كل ميزة مجانية في الحالتين.",

  // ---- Settings: about and version ----
  "settings.about.version": "الإصدار",
  "settings.about.version_desc": "الإصدار الحالي",
  "settings.about.version_a11y": "عرض الإصدار والبحث عن تحديثات",
  "settings.about.release_notes": "ملاحظات الإصدار",
  "settings.about.release_notes_desc": "ما الجديد في أحدث إصدار",
  "settings.about.release_notes_a11y": "فتح أحدث ملاحظات إصدار على GitHub",
  "settings.about.source": "الشيفرة المصدرية",
  "settings.about.source_a11y": "فتح الشيفرة المصدرية على GitHub",
  "settings.about.licenses": "تراخيص المصادر المفتوحة",
  "settings.about.open_repo": "فتح مستودع {name}",
  "settings.about.licenses_desc": "حزم مفتوحة المصدر من أطراف أخرى",
  "settings.about.licenses_a11y": "عرض تراخيص الأطراف الأخرى",
  "settings.version.codename": "الاسم الرمزي",
  "settings.version.checking": "جارٍ الفحص",
  "settings.version.check": "البحث عن تحديثات",
  "settings.version.checking_title": "جارٍ البحث عن تحديثات",
  "settings.version.up_to_date": "أنت على أحدث إصدار.",
  "settings.version.release_notes": "عرض ملاحظات الإصدار",
  "settings.version.made_with": "صُنع بـ",
  "settings.version.number": "الإصدار {version}",
  "settings.version.update_to": "التحديث إلى {version}",
  "settings.version.update_to_a11y": "التحديث إلى الإصدار {version}",
  "settings.version.released_under": "منشور تحت {license}",
  "settings.version.notes_a11y": "عرض ملاحظات الإصدار {version}",
  "settings.version.tor_paused":
    "فحص التحديثات متوقف بينما Tor مفعّل، لئلا يكشف عنوان IP الخاص بك. راجع صفحة الإصدارات في متصفح.",
  "settings.version.check_failed":
    "تعذّر البحث عن تحديثات. تحقق من اتصالك وحاول مرة أخرى.",
  "settings.version.downloading": "جارٍ التنزيل {percent}%",
  "settings.version.install": "تثبيت",
  "settings.version.download_failed":
    "فشل التنزيل. تحقق من اتصالك وحاول مرة أخرى.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} حجمه {size} KiB، أي فوق حد {cap} KiB.",
  "transfer.failed.malformed":
    "وصل مرفق تالفًا وتعذّر فتحه. اطلب منهم إرساله مرة أخرى.",
  "transfer.failed.unsupported_type":
    "وصل مرفق بصيغة لا يستطيع هذا التطبيق فتحها.",
  "transfer.failed.type_mismatch":
    "رُفض مرفق: محتواه لا يطابق نوع الملف الذي ادّعاه.",
  "transfer.failed.storage": "وصل مرفق لكن تعذّر حفظه. تحقق من مساحتك الفارغة.",
  "transfer.badge.waiting": "بالانتظار · {name}",
  "transfer.badge.active_count": "{count} عمليات نقل",
  "transfer.badge.sending": "جارٍ إرسال {name}",
  "transfer.badge.receiving": "جارٍ استقبال {name}",
  "transfer.badge.a11y": "{label}، {percent} بالمئة. افتح المحادثة.",
  "transfer.kind.photo": "صورة",
  "transfer.kind.video": "فيديو",
  "transfer.kind.voice": "ملاحظة صوتية",
  "transfer.this.photo": "هذه الصورة",
  "transfer.this.video": "هذا الفيديو",
  "transfer.this.voice": "هذه الملاحظة الصوتية",
  "transfer.this.file": "هذا الملف",
  "transfer.kind.document": "مستند",
  "transfer.kind.voice_preview": "ملاحظة صوتية",
  "transfer.kind.photo_preview": "صورة",
  "transfer.kind.video_preview": "فيديو",
  "transfer.kind.document_preview": "مستند",

  // ---- System notifications ----
  "notif.channel.messages": "الرسائل",
  "notif.channel.nearby": "النظراء القريبون",
  "notif.channel.nearby_desc":
    "تنبيه عرضي عندما تعثر الشبكة على أشخاص ضمن نطاق البلوتوث.",
  "notif.nearby.body": "ضمن نطاق البلوتوث الآن. اضغط لفتح الشبكة.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "أحدهم",
  "notif.notice_urgent": "إعلان عاجل · {content}",
  "notif.notice": "إعلان · {content}",
  "notif.incoming_file": "ملف وارد",
  "notif.preview.photo": "📷 صورة",
  "notif.preview.voice": "🎤 رسالة صوتية",
  "notif.preview.video": "🎥 فيديو",
  "notif.preview.document": "📄 مستند",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "رسالة جديدة",
  "notif.hidden.channel": "نشاط جديد",
  "notif.hidden.mention": "أشار إليك أحدهم",
  "notif.mention.title": "أشار إليك {sender}",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    zero: "عرض {count} أخرى",
    one: "عرض واحدة أخرى",
    two: "عرض اثنتين أخريين",
    few: "عرض {count} أخرى",
    many: "عرض {count} أخرى",
    other: "عرض {count} أخرى",
  },
  "chat.channels.show_more_a11y": {
    zero: "عرض {count} قناة افتراضية أخرى",
    one: "عرض قناة افتراضية أخرى",
    two: "عرض قناتين افتراضيتين أخريين",
    few: "عرض {count} قنوات افتراضية أخرى",
    many: "عرض {count} قناة افتراضية أخرى",
    other: "عرض {count} قناة افتراضية أخرى",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    zero: "{label}، {count} غير مقروءة",
    one: "{label}، واحدة غير مقروءة",
    two: "{label}، اثنتان غير مقروءتين",
    few: "{label}، {count} غير مقروءة",
    many: "{label}، {count} غير مقروءة",
    other: "{label}، {count} غير مقروءة",
  },
  "a11y.new_count": {
    zero: "{label}، {count} جديدة",
    one: "{label}، واحدة جديدة",
    two: "{label}، اثنتان جديدتان",
    few: "{label}، {count} جديدة",
    many: "{label}، {count} جديدة",
    other: "{label}، {count} جديدة",
  },
  "chat.a11y.unread": {
    zero: "{count} غير مقروءة",
    one: "واحدة غير مقروءة",
    two: "اثنتان غير مقروءتين",
    few: "{count} غير مقروءة",
    many: "{count} غير مقروءة",
    other: "{count} غير مقروءة",
  },
  "chat.thread.length_left": {
    zero: "بقي {count}",
    one: "بقي حرف واحد",
    two: "بقي حرفان",
    few: "بقي {count} أحرف",
    many: "بقي {count} حرفًا",
    other: "بقي {count}",
  },
  "settings.general.retention_days": {
    zero: "{count} يوم",
    one: "يوم واحد",
    two: "يومان",
    few: "{count} أيام",
    many: "{count} يومًا",
    other: "{count} يوم",
  },
  "chat.info.group_reach": {
    zero: "{reachable} من {count} عضو متاح",
    one: "{reachable} من عضو واحد متاح",
    two: "{reachable} من عضوين متاحان",
    few: "{reachable} من {count} أعضاء متاحون",
    many: "{reachable} من {count} عضوًا متاحون",
    other: "{reachable} من {count} عضو متاح",
  },
  "chat.group_members": {
    zero: "مجموعة خاصة  ·  {count} عضو",
    one: "مجموعة خاصة  ·  عضو واحد",
    two: "مجموعة خاصة  ·  عضوان",
    few: "مجموعة خاصة  ·  {count} أعضاء",
    many: "مجموعة خاصة  ·  {count} عضوًا",
    other: "مجموعة خاصة  ·  {count} عضو",
  },
  "chat.select.count": {
    zero: "{count} محددة",
    one: "واحدة محددة",
    two: "اثنتان محددتان",
    few: "{count} محددة",
    many: "{count} محددة",
    other: "{count} محددة",
  },
  "chat.select.forward": {
    zero: "إعادة توجيه {count} رسالة",
    one: "إعادة توجيه رسالة واحدة",
    two: "إعادة توجيه رسالتين",
    few: "إعادة توجيه {count} رسائل",
    many: "إعادة توجيه {count} رسالة",
    other: "إعادة توجيه {count} رسالة",
  },
  "chat.voice.live_speaking_count": {
    zero: "{count} يتحدثون",
    one: "واحد يتحدث",
    two: "اثنان يتحدثان",
    few: "{count} يتحدثون",
    many: "{count} يتحدثون",
    other: "{count} يتحدثون",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    zero: "{count} نظير ضمن النطاق",
    one: "نظير واحد ضمن النطاق",
    two: "نظيران ضمن النطاق",
    few: "{count} نظراء ضمن النطاق",
    many: "{count} نظيرًا ضمن النطاق",
    other: "{count} نظير ضمن النطاق",
  },
  "mesh.peer.hops_away": {
    zero: "على بعد {count} قفزة",
    one: "على بعد قفزة واحدة",
    two: "على بعد قفزتين",
    few: "على بعد {count} قفزات",
    many: "على بعد {count} قفزة",
    other: "على بعد {count} قفزة",
  },
  "chat.presence.active": {
    zero: "{count} نشط",
    one: "واحد نشط",
    two: "اثنان نشطان",
    few: "{count} نشطون",
    many: "{count} نشطًا",
    other: "{count} نشط",
  },
  "chat.presence.nearby": {
    zero: "{count} بالجوار",
    one: "واحد بالجوار",
    two: "اثنان بالجوار",
    few: "{count} بالجوار",
    many: "{count} بالجوار",
    other: "{count} بالجوار",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    zero: "{count} دار سك",
    one: "دار سك واحدة",
    two: "دارا سك",
    few: "{count} دور سك",
    many: "{count} دار سك",
    other: "{count} دار سك",
  },
  "wallet.mint.remove_body": {
    zero: "تحمل {mint} مبلغ {balance} {unit} في {count} إثبات. إزالتها تحذف تلك الإثباتات من هذا الجهاز نهائيًا ولا توجد نسخة احتياطية. اسحب الرصيد أو أرسله أولًا.",
    one: "تحمل {mint} مبلغ {balance} {unit} في إثبات واحد. إزالتها تحذف ذلك الإثبات من هذا الجهاز نهائيًا ولا توجد نسخة احتياطية. اسحب الرصيد أو أرسله أولًا.",
    two: "تحمل {mint} مبلغ {balance} {unit} في إثباتين. إزالتها تحذف ذينك الإثباتين من هذا الجهاز نهائيًا ولا توجد نسخة احتياطية. اسحب الرصيد أو أرسله أولًا.",
    few: "تحمل {mint} مبلغ {balance} {unit} في {count} إثباتات. إزالتها تحذف تلك الإثباتات من هذا الجهاز نهائيًا ولا توجد نسخة احتياطية. اسحب الرصيد أو أرسله أولًا.",
    many: "تحمل {mint} مبلغ {balance} {unit} في {count} إثباتًا. إزالتها تحذف تلك الإثباتات من هذا الجهاز نهائيًا ولا توجد نسخة احتياطية. اسحب الرصيد أو أرسله أولًا.",
    other:
      "تحمل {mint} مبلغ {balance} {unit} في {count} إثبات. إزالتها تحذف تلك الإثباتات من هذا الجهاز نهائيًا ولا توجد نسخة احتياطية. اسحب الرصيد أو أرسله أولًا.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    zero: "{count} إيداع بانتظار الدفع. يُفحص مرة أخرى في كل مرة يُفتح فيها التطبيق.",
    one: "إيداع واحد بانتظار الدفع. يُفحص مرة أخرى في كل مرة يُفتح فيها التطبيق.",
    two: "إيداعان بانتظار الدفع. يُفحصان مرة أخرى في كل مرة يُفتح فيها التطبيق.",
    few: "{count} إيداعات بانتظار الدفع. تُفحص مرة أخرى في كل مرة يُفتح فيها التطبيق.",
    many: "{count} إيداعًا بانتظار الدفع. تُفحص مرة أخرى في كل مرة يُفتح فيها التطبيق.",
    other:
      "{count} إيداع بانتظار الدفع. يُفحص مرة أخرى في كل مرة يُفتح فيها التطبيق.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    zero: "استُعيد {count} إثبات غير منفق من {mints}.",
    one: "استُعيد إثبات واحد غير منفق من {mints}.",
    two: "استُعيد إثباتان غير منفقين من {mints}.",
    few: "استُعيدت {count} إثباتات غير منفقة من {mints}.",
    many: "استُعيد {count} إثباتًا غير منفق من {mints}.",
    other: "استُعيد {count} إثبات غير منفق من {mints}.",
  },
  "wallet.backup.already_spent": {
    zero: "عُثر على {count} عملة لكنها منفقة بالفعل، فلم يُضَف شيء مقابلها. وهذا طبيعي: كل عملة أنفقتها يومًا تبقى ظاهرة في السجلات التي تحتفظ بها دار السك.",
    one: "عُثر على عملة واحدة لكنها منفقة بالفعل، فلم يُضَف شيء مقابلها. وهذا طبيعي: كل عملة أنفقتها يومًا تبقى ظاهرة في السجلات التي تحتفظ بها دار السك.",
    two: "عُثر على عملتين لكنهما منفقتان بالفعل، فلم يُضَف شيء مقابلهما. وهذا طبيعي: كل عملة أنفقتها يومًا تبقى ظاهرة في السجلات التي تحتفظ بها دار السك.",
    few: "عُثر على {count} عملات لكنها منفقة بالفعل، فلم يُضَف شيء مقابلها. وهذا طبيعي: كل عملة أنفقتها يومًا تبقى ظاهرة في السجلات التي تحتفظ بها دار السك.",
    many: "عُثر على {count} عملة لكنها منفقة بالفعل، فلم يُضَف شيء مقابلها. وهذا طبيعي: كل عملة أنفقتها يومًا تبقى ظاهرة في السجلات التي تحتفظ بها دار السك.",
    other:
      "عُثر على {count} عملة لكنها منفقة بالفعل، فلم يُضَف شيء مقابلها. وهذا طبيعي: كل عملة أنفقتها يومًا تبقى ظاهرة في السجلات التي تحتفظ بها دار السك.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    zero: "عرض {count} أخرى",
    one: "عرض واحدة أخرى",
    two: "عرض اثنتين أخريين",
    few: "عرض {count} أخرى",
    many: "عرض {count} أخرى",
    other: "عرض {count} أخرى",
  },
  "wallet.activity.show_more_a11y": {
    zero: "عرض {count} دفعة أخرى",
    one: "عرض دفعة واحدة أخرى",
    two: "عرض دفعتين أخريين",
    few: "عرض {count} دفعات أخرى",
    many: "عرض {count} دفعة أخرى",
    other: "عرض {count} دفعة أخرى",
  },
  "wallet.mint.unconfirmed_count": {
    zero: "{count} غير مؤكدة",
    one: "واحدة غير مؤكدة",
    two: "اثنتان غير مؤكدتين",
    few: "{count} غير مؤكدة",
    many: "{count} غير مؤكدة",
    other: "{count} غير مؤكدة",
  },
  "wallet.proof_count": {
    zero: "{count} إثبات",
    one: "إثبات واحد",
    two: "إثباتان",
    few: "{count} إثباتات",
    many: "{count} إثباتًا",
    other: "{count} إثبات",
  },
  "wallet.spent_removed_detail": {
    zero: "{count} إثبات كان منفقًا بالفعل وقد أُزيل.",
    one: "إثبات واحد كان منفقًا بالفعل وقد أُزيل.",
    two: "إثباتان كانا منفقين بالفعل وقد أُزيلا.",
    few: "{count} إثباتات كانت منفقة بالفعل وقد أُزيلت.",
    many: "{count} إثباتًا كانت منفقة بالفعل وقد أُزيلت.",
    other: "{count} إثبات كان منفقًا بالفعل وقد أُزيل.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    zero: "{count} أشخاص بالجوار",
    one: "أحدهم بالجوار",
    two: "شخصان بالجوار",
    few: "{count} أشخاص بالجوار",
    many: "{count} شخصًا بالجوار",
    other: "{count} شخص بالجوار",
  },
};

export const ar = { strings, plurals };
