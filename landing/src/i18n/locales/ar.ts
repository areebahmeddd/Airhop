import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "العودة إلى الرئيسية",
  "common.last_updated": "آخر تحديث: {date}",

  "nav.aria": "التنقل الرئيسي",
  "nav.home": "الصفحة الرئيسية لـ Airhop",
  "nav.skip": "تخطَّ إلى المحتوى",
  "nav.menu.open": "فتح القائمة",
  "nav.menu.close": "إغلاق القائمة",
  "nav.how_it_works": "كيف يعمل",
  "nav.architecture": "البنية",
  "nav.faq": "الأسئلة الشائعة",

  "footer.aria": "تذييل الصفحة",
  "footer.tagline": "تواصل شبكي خاص",
  "footer.credit": "© صُنع بـ {heart} على يد {author}",
  "footer.group.download": "التنزيل",
  "footer.group.resources": "المصادر",
  "footer.group.social": "التواصل",
  "footer.group.legal": "قانوني",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "البنية",
  "footer.link.blogs": "المدونة",
  "footer.link.faq": "الأسئلة الشائعة",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "شروط الخدمة",
  "footer.link.privacy": "سياسة الخصوصية",
  "footer.link.license": "رخصة المشروع",

  "settings.theme.group": "سمة الألوان",
  "settings.theme.light": "السمة الفاتحة",
  "settings.theme.dark": "السمة الداكنة",
  "settings.language.label": "اللغة",
  "settings.language.suggestion": "اعرض هذه الصفحة بالعربية",
  "settings.language.dismiss": "إغلاق",

  "home.hero.release": "أحدث إصدار",
  "home.hero.title": "مراسلة تعمل بلا إنترنت.",
  "home.hero.body":
    "الهواتف القريبة تكوّن شبكة Bluetooth متشابكة وتنقل رسائلك حتى سبع قفزات، مشفّرة من طرف إلى طرف. {no_servers}، {no_accounts}، {no_tracking}.",
  "home.hero.body.no_servers": "بلا خوادم",
  "home.hero.body.no_accounts": "بلا حسابات",
  "home.hero.body.no_tracking": "بلا تتبّع",
  "home.hero.download": "تنزيل التطبيق",
  "home.hero.badges": "رخصة MIT · مجاني ومفتوح المصدر · متوافق مع bitchat",
  "home.hero.group.mobile": "الهاتف",
  "home.hero.group.desktop": "سطح المكتب",
  "home.hero.option.f_droid": "متجر مفتوح المصدر",
  "home.hero.option.apk": "تنزيل مباشر",
  "home.hero.option.soon": "قريبًا",

  "home.about.eyebrow": "ما هو Airhop",
  "home.about.title": "معظم التطبيقات تعتمد على خادم مركزي.",
  "home.about.sub":
    "الخادم يمكن مراقبته أو إيقافه أو حجبه. Airhop لا يملك خادمًا، فلا توجد شركة يُضغط عليها ولا خدمة تُغلق.",
  "home.about.card": "نظرة تقنية",
  "home.about.link.mesh": "شبكة Bluetooth Low Energy المتشابكة",
  "home.about.link.wire_protocol": "بروتوكول النقل",
  "home.about.body.built":
    "Airhop تطبيق مفتوح المصدر لنظامي iOS و Android للمراسلة الخاصة بين الأجهزة مباشرةً عبر {mesh}. بُني على أساس {bitchat}، مع إعادة استخدام {wire_protocol} ونموذج الأمان الخاص به، ثم توسيعهما بمدفوعات {ecash} دون اتصال وذكاء اصطناعي دون اتصال. يعمل بلا أي اتصال بالإنترنت، وتُنقل الرسائل تلقائيًا عبر الأجهزة القريبة (نحو 10 إلى 30 مترًا لكل قفزة داخل المباني، وأبعد في الأماكن المفتوحة)، حتى 7 قفزات.",
  "home.about.body.identity":
    "هويتك زوج مفاتيح {ed25519} يُنشأ على جهازك ويُحفظ في {ios_keychain} أو {android_keystore}. لا حسابات ولا تسجيل ولا شيء يمر بأي خادم، أي يمكن استخدامه كتطبيق مؤقت لا يترك بعد حذفه ما يدل عليك.",
  "home.about.body.crypto":
    "كل جلسة تستخدم بروتوكول {noise} لمصافحة موثّقة. والرسائل المخزّنة تستخدم خوارزمية {ratchet}، أي أنه حتى لو اختُرق جهازك لاحقًا تبقى رسائلك السابقة غير قابلة للقراءة. والمسح الطارئ يتلف كل المفاتيح والرسائل في أقل من ثانية.",
  "home.about.body.internet":
    "حين تكون أنت وجهة اتصالك خارج نطاق Bluetooth، تعمل مُرحّلات {nostr} كجسر عبر الإنترنت، مستخدمةً رسائل مباشرة مغلّفة بصيغة {nip17}، فتمتد الشبكة المتشابكة عالميًا طالما كنتما متصلين. ودعم {tor} متاح كذلك على iOS (عبر {arti}) و Android (عبر {orbot}).",
  "home.about.optional.title": "في Airhop مزايا اختيارية يمكنك تفعيلها:",
  "home.about.optional.payments.label": "مدفوعات دون اتصال:",
  "home.about.optional.payments.body":
    "أرسل واستقبل المدفوعات عبر الشبكة المتشابكة باستخدام بروتوكول {cashu} (Bitcoin فقط).",
  "home.about.optional.ai.label": "ذكاء اصطناعي دون اتصال:",
  "home.about.optional.ai.body":
    "مساعد ذكاء اصطناعي صغير يعمل على الجهاز ويجيب عن الأسئلة المهمة. كل المعالجة والبيانات تبقى على جهازك.",
  "home.about.body.compatible":
    "‏Airhop متوافق مع bitchat على مستوى البروتوكول. جهاز يعمل بـ Airhop وآخر بـ bitchat على الشبكة نفسها يكتشف كل منهما الآخر تلقائيًا، ويمكنهما تبادل الرسائل والرسائل المباشرة بلا أي إعداد.",

  "home.situations.eyebrow": "متى تحتاج إليه",
  "home.situations.title": "ليوم تسقط فيه الشبكة.",
  "home.situations.sub":
    "الكوارث الطبيعية، وقطع الإنترنت، والاحتجاجات الحاشدة، أو عطلة أسبوع عادية خارج التغطية.",
  "home.situations.disaster.label": "كارثة",
  "home.situations.disaster.line": "الأبراج معطّلة. إشعار على اللوحة يصل إلى كل من يمر من هناك.",
  "home.situations.offgrid.label": "خارج الشبكة",
  "home.situations.offgrid.line": "اليوم الثاني على المسار. آخر شرطة إشارة اختفت أمس.",
  "home.situations.protest.label": "احتجاج",
  "home.situations.protest.line": "رمز QR على منشور يفتح قناة مشفّرة للمسيرة.",
  "home.situations.festival.label": "مهرجان",
  "home.situations.festival.line": "لا إشارة في الموقع. الرسائل تقفز عبر هواتف الغرباء.",

  "home.showcase.eyebrow": "شاهد التطبيق",
  "home.showcase.title": "تطبيق مراسلة عادي، بلا اتصال.",
  "home.showcase.sub":
    "محادثات وقنوات ومحفظة وهوية. مألوف من الخارج، وتحته شبكة متشابكة تؤدي العمل.",
  "home.showcase.mesh.title": "الشبكة",
  "home.showcase.mesh.caption": "كل من في النطاق، مرتّبون حسب قربهم. لا حاجة إلى إضافة أحد أولًا.",
  "home.showcase.mesh.alt":
    "شاشة الشبكة في تطبيق Airhop، وتظهر أربعة أجهزة قريبة موزّعة على رادار حسب قوة الإشارة.",
  "home.showcase.chats.title": "المحادثات",
  "home.showcase.chats.caption": "محادثات عادية. الهواتف التي تمرّر كل رسالة لا تستطيع فتحها.",
  "home.showcase.chats.alt":
    "محادثة رسائل مباشرة في Airhop أثناء انقطاع الكهرباء، مُنقولة عبر ثلاثة هواتف.",
  "home.showcase.channels.title": "القنوات",
  "home.showcase.channels.caption":
    "غرف عامة بحجم حيّ واحد أو باتساع منطقة كاملة، مفتوحة لكل من هناك.",
  "home.showcase.channels.alt":
    "شاشة المحادثات في تطبيق Airhop، وتعرض قنوات عامة محدّدة بحيّ وجوار ومدينة ومنطقة.",
  "home.showcase.wallet.title": "المحفظة",
  "home.showcase.wallet.caption":
    "سلّم ecash لمن بجوارك عبر Bluetooth، دون أن يكون أي من الهاتفين متصلًا.",
  "home.showcase.wallet.alt":
    "شاشة المحفظة في تطبيق Airhop، وتعرض رصيد ecash يمكن إرساله عبر Bluetooth.",
  "home.showcase.identity.title": "الهوية",
  "home.showcase.identity.caption":
    "بلا تسجيل ولا رقم هاتف ولا بريد. مجرد مفتاح لا يغادر هذا الهاتف أبدًا.",
  "home.showcase.identity.alt":
    "شاشة الملف الشخصي في تطبيق Airhop، وتعرض هوية أُنشئت على الجهاز بلا حساب.",

  "home.how.eyebrow": "كيف يعمل",
  "home.how.title": "الشبكة تتشكّل من تلقاء نفسها.",
  "home.how.sub":
    "العقد القريبة تكوّن شبكة متشابكة تُصلح نفسها عبر Bluetooth. وحين يتوفر إنترنت تمدّها مُرحّلات Nostr، بلا بنية تحتية يتحكم بها أحد.",
  "home.how.cta": "اقرأ البنية كاملة",
  "home.how.discover.title": "الاكتشاف",
  "home.how.discover.line":
    "الهواتف التي تشغّل Airhop أو bitchat تجد بعضها تلقائيًا عبر Bluetooth. بلا إقران وبلا إعداد.",
  "home.how.relay.title": "النقل",
  "home.how.relay.line":
    "الرسالة تقفز من هاتف إلى هاتف، حتى سبع قفزات. والهواتف الوسيطة لا ترى قط ما تحمله.",
  "home.how.reach.title": "مدى أبعد",
  "home.how.reach.line":
    "حين يتوفر إنترنت، تحمل مُرحّلات Nostr المحادثة نفسها إلى مدى أبعد، وعبر Tor إن رغبت.",
  "home.how.swipe": "اسحب للاستكشاف",
  "home.how.diagram": "شبكة BLE المتشابكة · شبكة محلية بين الأجهزة",
  "home.how.legend.node": "عقدة في شبكة BLE (دون اتصال)",
  "home.how.legend.relay": "نقل متعدد القفزات (مشفّر بـ Noise XX)",
  "home.how.legend.bitchat": "متوافق مع bitchat على الشبكة نفسها",
  "home.how.legend.nostr": "جسر Nostr (عبر الإنترنت عند الاتصال)",

  "home.map.aria": "خريطة عالمية لمواقع مُرحّلات Nostr",
  "home.map.summary": "جسر Nostr · {relays} في {locations} حول العالم",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}، {relays}",

  "home.features.eyebrow": "ماذا يفعل",
  "home.features.title": "تطبيق مراسلة حقيقي، لا عرض تجريبي.",
  "home.features.sub": "محادثة وهوية وشبكة ومال. كل ذلك مبني ليعمل بلا إشارة وبلا حساب وبلا وسيط.",

  "home.features.messaging.title": "المراسلة",
  "home.features.messaging.summary": "كل ما في تطبيق المراسلة، بلا أي بنية تحتية خلفه.",
  "home.features.messaging.dms.name": "رسائل مباشرة خاصة",
  "home.features.messaging.dms.line": "مشفّرة من طرف إلى طرف، مع إشعارات التسليم والقراءة.",
  "home.features.messaging.location.name": "قنوات حسب الموقع",
  "home.features.messaging.location.line": "غرف مرتبطة بمكان، من حيّ واحد إلى منطقة كاملة.",
  "home.features.messaging.groups.name": "قنوات ومجموعات خاصة",
  "home.features.messaging.groups.line": "روابط دعوة لغرفة، أو قائمة موقّعة تصل إلى 16 عضوًا.",
  "home.features.messaging.board.name": "لوحة إعلانات",
  "home.features.messaging.board.line": "إشعارات مثبّتة على منطقة لمدة تصل إلى سبعة أيام.",
  "home.features.messaging.voice.name": "صوت مباشر",
  "home.features.messaging.voice.line":
    "اضغط على الميكروفون وتحدث إلى كل من في النطاق، مثل جهاز اللاسلكي.",
  "home.features.messaging.notes.name": "رسائل صوتية",
  "home.features.messaging.notes.line": "صوت مسجّل، أسرع من كتابة الاتجاهات.",
  "home.features.messaging.files.name": "صور وفيديو وملفات",
  "home.features.messaging.files.line": "أي صيغة، حتى 1 MiB، بلا حاجة إلى إشارة.",
  "home.features.messaging.forward.name": "التخزين وإعادة الإرسال",
  "home.features.messaging.forward.line": "مختومة ويحملها هاتف قريب حتى تصل إلى صاحبها.",

  "home.features.identity.title": "الهوية",
  "home.features.identity.summary": "لا شيء يُسجَّل، ولا شيء يُصادَر.",
  "home.features.identity.keys.name": "هوية بزوج مفاتيح",
  "home.features.identity.keys.line": "تُنشأ على هذا الهاتف وتُحفظ في سلسلة مفاتيح النظام.",
  "home.features.identity.names.name": "أسماء مقروءة",
  "home.features.identity.names.line": "مشتقّة من مفتاحك، فلا يستطيع أحد أخذ اسمك.",
  "home.features.identity.qr.name": "جهات اتصال بـ QR",
  "home.features.identity.qr.line": "مسحة واحدة تنقل مفاتيحهم، لا أسماءهم فقط.",
  "home.features.identity.panic.name": "مسح طارئ",
  "home.features.identity.panic.line": "كل مفتاح وكل رسالة يُتلفان في أقل من ثانية.",

  "home.features.networking.title": "الشبكة",
  "home.features.networking.summary": "الهواتف نفسها هي الشبكة.",
  "home.features.networking.mesh.name": "شبكة Bluetooth متشابكة",
  "home.features.networking.mesh.line": "بلا إنترنت وبلا موجّه، على هواتف يملكها الناس أصلًا.",
  "home.features.networking.bridge.name": "جسر بين الشبكات",
  "home.features.networking.bridge.line": "يربط محادثتك العامة بحشد قريب خارج النطاق.",
  "home.features.networking.wifi.name": "مسار WiFi السريع",
  "home.features.networking.wifi.line": "نقل أسرع بين جهازي Android أو جهازي iPhone.",
  "home.features.networking.bitchat.name": "متوافق مع bitchat",
  "home.features.networking.bitchat.line": "التطبيقان ينضمان إلى الشبكة نفسها بلا إعداد.",

  "home.features.internet.title": "الإنترنت",
  "home.features.internet.summary": "امتداد، لا شرط أبدًا.",
  "home.features.internet.nostr.name": "احتياطي عبر Nostr",
  "home.features.internet.nostr.line": "الرسائل المباشرة وقنوات الموقع تستمر خارج نطاق اللاسلكي.",
  "home.features.internet.relays.name": "اكتشاف المُرحّلات الجغرافية",
  "home.features.internet.relays.line": "أكثر من 300 مُرحّل عام مستقل، لا يخصّنا منها شيء.",
  "home.features.internet.gateway.name": "بوابة إنترنت",
  "home.features.internet.gateway.line": "أعِر اتصالك ليصل هاتف قريب دون اتصال إلى قنوات الموقع.",
  "home.features.internet.tor.name": "تكامل مع Tor",
  "home.features.internet.tor.line": "موجَّه على المنصتين، فلا ترى المُرحّلات عنوان IP الخاص بك.",

  "home.features.optional.title": "اختياري",
  "home.features.optional.summary": "معطّل افتراضيًا. يعمل حين تريد.",
  "home.features.optional.cashu.name": "ecash عبر Cashu",
  "home.features.optional.cashu.line": "ادفع لمن بجوارك دون أن يكون أي هاتف متصلًا.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "اشحن أو اسحب بـ bitcoin عبر شبكة Lightning.",
  "home.features.optional.ai.name": "ذكاء اصطناعي محلي",
  "home.features.optional.ai.line": "إجابات على الجهاز، ولا شيء يغادر الهاتف.",
  "home.features.optional.social.name": "جسور اجتماعية",
  "home.features.optional.social.line": "‏Bluesky و Mastodon بالهوية نفسها.",

  "home.compare.eyebrow": "المقارنة",
  "home.compare.title": "يعمل دون اتصال، وبلا عتاد إضافي، ومفتوح.",
  "home.compare.sub": "كل تطبيق هنا يجيد شيئًا. لكن بعضها فقط يظل يعمل حين تتوقف الشبكة.",
  "home.compare.col.project": "المشروع",
  "home.compare.col.transport": "الناقل",
  "home.compare.col.encryption": "التشفير",
  "home.compare.col.offline": "يعمل دون اتصال",
  "home.compare.col.hardware_free": "بلا عتاد إضافي",
  "home.compare.col.open_source": "مفتوح المصدر",
  "home.compare.mark.yes": "نعم",
  "home.compare.mark.no": "لا",
  "home.compare.mark.partial": "جزئيًا، العملاء مفتوحو المصدر والخوادم ليست كذلك",
  "home.compare.mark.partial_hint": "العملاء مفتوحو المصدر والخوادم ليست كذلك",
  "home.compare.transport.servers": "خوادم مركزية",
  "home.compare.transport.onion": "توجيه بصلي (عقد خدمة)",
  "home.compare.transport.nostr": "مُرحّلات Nostr",
  "home.compare.transport.lora": "راديو LoRa",
  "home.compare.transport.sub_ghz": "راديو احتكاري دون الجيجاهرتز",

  "home.explore.eyebrow": "مفتوح وصريح",
  "home.explore.title": "كل ما يُقال هنا قابل للتحقق.",
  "home.explore.sub":
    "الشيفرة والبروتوكول والخطط علنية. والقيود كذلك. تحقّق بنفسك قبل أن تأخذ بكلامنا.",
  "home.explore.audit.chip": "التدقيق معلّق",
  "home.explore.audit.headline": "لم يخضع Airhop بعد لتدقيق أمني خارجي.",
  "home.explore.audit.body":
    "{headline} كل الشيفرة تُراجع شخصيًا وتمر عبر {review} قبل الإصدار، ومكتبة التشفير المستخدمة مدقّقة من Cure53، لكن ذلك لا يغني عن تدقيق رسمي للتطبيق نفسه. وهناك تدقيق مقرر في {version}. لا تعتمد عليه في الحالات الحساسة حتى ذلك الحين.",
  "home.explore.audit.link.review": "وكيل مراجعة أمنية",
  "home.explore.source.title": "الشيفرة المصدرية",
  "home.explore.source.desc":
    "كل شيء على GitHub برخصة MIT. المشكلات وطلبات الدمج والنقاشات مفتوحة.",
  "home.explore.protocol.title": "مواصفات البروتوكول",
  "home.explore.protocol.desc": "صيغة النقل الدقيقة ومعرّفات BLE والثوابت، مشتركة مع bitchat.",
  "home.explore.architecture.title": "البنية",
  "home.explore.architecture.desc": "التفصيل التقني الكامل، من ضغطة إرسال إلى البايتات على الأثير.",
  "home.explore.roadmap.title": "خارطة الطريق",
  "home.explore.roadmap.desc": "أهداف الإصدارات من v0.5.0 إلى v2.0.0، بما فيها التدقيق المقرر.",
  "home.explore.vision.title": "الرؤية",
  "home.explore.vision.desc": "لماذا وُجد Airhop، والمبادئ التي لا تتغير تحت الضغط.",
  "home.explore.brand.title": "حزمة العلامة",
  "home.explore.brand.desc":
    "الطائر البكسلي، ورموز الألوان والخطوط، ومواد الصحافة والنصوص الجاهزة.",

  "home.contribute.eyebrow": "ادعم هذا المشروع",
  "home.contribute.title": "مستقل، وفي العلن.",
  "home.contribute.sub":
    "لا مستثمرين ولا إعلانات ولا نسخة مدفوعة. كل الميزات تبقى مجانية على أي حال، والعمل يموّله من يجده مفيدًا.",
  "home.contribute.contribute.chip": "المساهمة",
  "home.contribute.contribute.body":
    "ضع نجمة للمستودع، وافتح المشكلات، وأرسل طلبات الدمج. تقارير الأخطاء واقتراحات الميزات ومساهمات الشيفرة كلها مرحّب بها.",
  "home.contribute.contribute.cta": "عرضه على GitHub",
  "home.contribute.sponsor.chip": "الرعاية",
  "home.contribute.sponsor.body":
    "إن كان Airhop مفيدًا لك، فتبرّع لمرة واحدة أو رعاية متكررة يقطعان شوطًا طويلًا في إبقاء التطوير نشطًا.",
  "home.contribute.sponsor.donate": "تبرّع لمرة واحدة",
  "home.contribute.sponsor.github": "الرعاية عبر GitHub",

  "page.architecture.eyebrow": "التوثيق",
  "page.architecture.title": "البنية",
  "page.architecture.toc": "في هذه الصفحة",

  "page.faq.eyebrow": "الأسئلة الشائعة",
  "page.faq.title": "الأسئلة الشائعة",
  "page.faq.meta": "أسئلة متكررة عن Airhop.",
  "page.faq.contact":
    "الأسئلة التي لا تجد إجابتها هنا يمكن إرسالها إلى {email} أو طرحها بفتح نقاش على {github}.",

  "page.blogs.eyebrow": "المدونة",
  "page.blogs.title": "قريبًا",
  "page.blogs.body": "كتابات عن الشبكات المتشابكة والخصوصية والبرمجيات التي تعمل دون اتصال أولًا.",

  "page.brand.eyebrow": "العلامة",
  "page.brand.title": "حزمة العلامة",
  "page.brand.meta":
    "مواد وقواعد لاستخدام Airhop في مقال أو صفحة متجر أو محاضرة أو ملف README. متاحة بحرية للاستشهاد وللصحافة.",

  "page.legal.eyebrow": "قانوني",
  "page.privacy.title": "سياسة الخصوصية",
  "page.terms.title": "شروط الخدمة",

  "page.notfound.title": "الصفحة غير موجودة",
  "page.notfound.body": "الصفحة التي تبحث عنها غير موجودة أو نُقلت.",

  "page.english_only": "هذه الصفحة متاحة بالإنجليزية فقط.",

  "seo.breadcrumb.home": "الرئيسية",

  "seo.home.title": "Airhop — تطبيق مراسلة خاص يعمل دون اتصال أولًا",
  "seo.home.description":
    "مراسلة خاصة بين الأجهزة مباشرةً لنظامي iOS و Android. بلا إنترنت وبلا خوادم وبلا حسابات. تواصل عبر شبكة Bluetooth المتشابكة في أي مكان.",

  "seo.architecture.title": "البنية — Airhop",
  "seo.architecture.description":
    "كيف يعمل Airhop من أعلاه إلى أسفله: الهوية، واختيار الناقل، وشبكة Bluetooth المتشابكة، والتشفير، وطبقة الإنترنت، و Tor، و ecash دون اتصال، والذكاء الاصطناعي على الجهاز، وصيغة النقل المتوافقة مع bitchat.",
  "seo.architecture.breadcrumb": "البنية",
  "seo.architecture.headline": "بنية Airhop",
  "seo.architecture.summary":
    "تفصيل تقني كامل لـ Airhop: الهوية، والنواقل، وشبكة Bluetooth المتشابكة، والتشفير، وطبقة إنترنت Nostr، و Tor، ومحفظة Cashu، ومساعد الذكاء الاصطناعي على الجهاز، وصيغة النقل.",

  "seo.faq.title": "الأسئلة الشائعة — Airhop",
  "seo.faq.description":
    "إجابات عن المراسلة عبر شبكة Bluetooth المتشابكة في Airhop، والتشفير، والمدفوعات دون اتصال، وطبقة إنترنت Nostr، والتوافق مع bitchat.",
  "seo.faq.breadcrumb": "الأسئلة الشائعة",

  "seo.blogs.title": "المدونة — Airhop",
  "seo.blogs.description":
    "كتابات عن الشبكات المتشابكة والخصوصية والبرمجيات التي تعمل دون اتصال أولًا.",
  "seo.blogs.breadcrumb": "المدونة",

  "seo.brand.title": "حزمة العلامة — Airhop",
  "seo.brand.description":
    "حزمة علامة Airhop: شعار الطائر البكسلي، والشعار النصي، ورموز الألوان والخطوط، ومواد الصحافة والنصوص الجاهزة.",
  "seo.brand.breadcrumb": "حزمة العلامة",

  "seo.privacy.title": "سياسة الخصوصية — Airhop",
  "seo.privacy.description":
    "كيف يتعامل Airhop مع البيانات: بلا حسابات وبلا خوادم وبلا تتبّع. هويتك ورسائلك تبقى على جهازك.",
  "seo.privacy.breadcrumb": "سياسة الخصوصية",

  "seo.terms.title": "شروط الخدمة — Airhop",
  "seo.terms.description": "الشروط التي تحكم استخدام تطبيق Airhop وموقعه.",
  "seo.terms.breadcrumb": "شروط الخدمة",

  "seo.notfound.title": "الصفحة غير موجودة — Airhop",
  "seo.notfound.description": "الصفحة التي تبحث عنها غير موجودة أو نُقلت.",
};

const plurals: Plurals = {
  "home.map.relays": {
    zero: "بلا مُرحّلات",
    one: "مُرحّل واحد",
    two: "مُرحّلان",
    few: "{count} مُرحّلات",
    many: "{count} مُرحّلًا",
    other: "{count} مُرحّل",
  },
  "home.map.locations": {
    zero: "بلا مواقع",
    one: "موقع واحد",
    two: "موقعين",
    few: "{count} مواقع",
    many: "{count} موقعًا",
    other: "{count} موقع",
  },
};

export const locale: Locale = { strings, plurals };
