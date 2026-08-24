// hi: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "रद्द करें",
  "common.done": "हो गया",
  "common.ok": "ठीक है",
  "common.close": "बंद करें",
  "common.back": "पीछे",
  "common.delete": "हटाएँ",
  "common.remove": "निकालें",
  "common.add": "जोड़ें",
  "common.copy": "कॉपी करें",
  "common.copied": "कॉपी हो गया",
  "common.share": "साझा करें",
  "common.continue": "आगे बढ़ें",
  "common.try_again": "फिर कोशिश करें",
  "common.settings": "सेटिंग्स",
  "common.off": "बंद",

  // ---- Dates ----
  "format.today": "आज",
  "format.yesterday": "कल",
  "format.minutes_ago": "{count} मि पहले",
  "format.hours_ago": "{count} घं पहले",
  "format.days_ago": "{count} दि पहले",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "चैट",
  "nav.tab.mesh": "मेश",
  "nav.tab.wallet": "वॉलेट",
  "nav.tab.profile": "आप",
  "a11y.tab.new_peers": "{label}, आस-पास कोई नया",
  "nav.notifications": "सूचनाएँ",
  "chat.subtab.channels": "चैनल",
  "chat.subtab.direct": "सीधे",
  "chat.subtab.dms": "सीधे संदेश",
  "chat.search.placeholder": "चैट खोजें…",
  "chat.search.a11y": "चैट और संदेश खोजें",
  "chat.search.close": "खोज बंद करें",
  "chat.search.clear": "खोज साफ़ करें",
  "mesh.view.radar": "रडार व्यू",
  "mesh.view.list": "सूची व्यू",
  "mesh.view.radar_short": "रडार",
  "mesh.view.list_short": "सूची",

  // ---- Legal document names ----
  "legal.last_updated": "अंतिम अपडेट: {date}",
  "legal.terms": "सेवा की शर्तें",
  "legal.privacy": "गोपनीयता नीति",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "निजी मेश संचार",
  "onboarding.welcome.cta": "शुरू करें",
  "onboarding.welcome.cta_hint": "आगे बढ़ने के लिए नीचे दी शर्तों से सहमत हों",
  "onboarding.welcome.consent_a11y":
    "सेवा की शर्तों और गोपनीयता नीति से सहमत हों",
  "onboarding.welcome.open_terms": "सेवा की शर्तें खोलें",
  "onboarding.welcome.open_privacy": "गोपनीयता नीति खोलें",
  "onboarding.welcome.consent":
    "{cta} दबाकर आप हमारी {terms} और {privacy} से सहमत होते हैं।",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "आपकी पहचान बनाई जा रही है",
  "onboarding.identity.body":
    "इस डिवाइस पर Ed25519 की-जोड़ी बनाई जा रही है।\nकुछ भी कहीं नहीं भेजा जाता।",
  "onboarding.identity.failed_heading": "आपकी कुंजियाँ नहीं बन सकीं",
  "onboarding.identity.failed_body":
    "इस डिवाइस ने Airhop को उन्हें सुरक्षित रूप से रखने नहीं दिया। फिर कोशिश करें, या फ़ोन दोबारा चालू करके Airhop खोलें।",
  "onboarding.identity.steps_a11y": "चरण: {steps}",
  "onboarding.identity.step.x25519": "X25519 स्थायी की-जोड़ी बनाई जा रही है",
  "onboarding.identity.step.ed25519":
    "Ed25519 हस्ताक्षर की-जोड़ी बनाई जा रही है",
  "onboarding.identity.step.keychain": "कुंजियाँ OS कीचेन में रखी जा रही हैं",
  "onboarding.identity.step.peer_id": "पीअर ID निकाली जा रही है",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "मेश पर आपका नाम",
  "onboarding.username.peer_id": "पीअर ID",
  "onboarding.username.card_a11y":
    "मेश पर आपका नाम {username} है। पीअर ID {peerID}। {props}।",
  "onboarding.username.explanation":
    "यह उपयोगकर्ता नाम आपकी सार्वजनिक कुंजी से नियत रूप से बनता है। जो भी आपकी पीअर ID देखता है, हर डिवाइस पर यह वही रहता है।",
  "onboarding.username.cta": "Airhop में जाएँ",
  "onboarding.username.prop.algorithm": "एल्गोरिद्म",
  "onboarding.username.prop.storage": "भंडारण",
  "onboarding.username.prop.storage_value": "सिर्फ़ OS कीचेन",
  "onboarding.username.prop.account": "खाता ज़रूरी",
  "onboarding.username.prop.account_value": "कोई नहीं",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop में आपका स्वागत है",
  "onboarding.hello.p1":
    "नमस्ते। Airhop को bitchat के ऊपर एक स्वतंत्र, ओपन सोर्स साइड प्रोजेक्ट के तौर पर बनाया गया है। यह bitchat प्रोजेक्ट या permissionless tech से न जुड़ा है न उनका समर्थित, यह बस कुछ ऐसा है जिसे बनाना और समुदाय के साथ बाँटना मुझे अच्छा लगता है।",
  "onboarding.hello.p2":
    "यह पहला iOS और Android रिलीज़ है, तो दोस्तों के साथ जाँचने के बावजूद आपको कुछ गड़बड़ियाँ ज़रूर मिलेंगी। ऐसा हो, या किसी फ़ीचर का विचार हो, तो मुझे सुनकर खुशी होगी। {github} पर issue खोलें या {email} पर ईमेल भेजें।",
  "onboarding.hello.p3":
    "अगर Airhop आपके काम आए, तो {github} पर स्टार या {store} पर समीक्षा देने पर विचार करें। इससे और लोग इस प्रोजेक्ट तक पहुँचते हैं। आज़माने के लिए धन्यवाद!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "इससे पहले कि आपका फ़ोन पूछे",
  "onboarding.primer.lede":
    "यहाँ बताया है कि हर एक क्या करता है, और क्या नहीं।",
  "onboarding.primer.bluetooth.title": "ब्लूटूथ",
  "onboarding.primer.bluetooth.body":
    "आस-पास के डिवाइस ढूँढ़ता है और उनके बीच संदेश पहुँचाता है। इसी से मेश बनता है और यह बिना इंटरनेट के काम करता है।",
  "onboarding.primer.location.title": "स्थान",
  "onboarding.primer.location.body":
    "आपको आस-पास के क्षेत्र चैनलों में रखता है, एक मोहल्ले से लेकर पूरे क्षेत्र तक। Airhop कभी आपको ट्रैक नहीं करता और न ही आपका सटीक स्थान डिवाइस से बाहर भेजता है।",
  "onboarding.primer.notifications.title": "सूचनाएँ",
  "onboarding.primer.notifications.body":
    "ऐप बंद होने पर भी नए संदेशों की सूचना पाएँ। सूचनाएँ आपके डिवाइस पर ही बनती हैं, किसी सर्वर की भूमिका नहीं होती।",
  "onboarding.primer.footnote":
    "आप मना कर सकते हैं। संदेश फिर भी इंटरनेट से जाते रहेंगे, और आप बाद में सेटिंग्स में जाकर मन बदल सकते हैं।",
  "onboarding.primer.cta_a11y": "अनुमति के सवालों पर आगे बढ़ें",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "ब्लूटूथ पहुँच",
  "permission.bluetooth.purpose": "मेश पर आस-पास के डिवाइस ढूँढ़ने",
  "permission.open_settings": "सेटिंग्स खोलें",
  "permission.not_now": "अभी नहीं",
  "permission.blocked_title": "{label} बंद है",
  "permission.blocked_body": "{purpose} के लिए इसे सेटिंग्स में चालू करें।",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "कुछ गड़बड़ हो गई",
  "error.boundary.body":
    "Airhop को एक अनपेक्षित समस्या आई और जो दिख रहा था उसे रोकना पड़ा।",

  // ---- Chats: channel list ----
  "chat.channels.default": "डिफ़ॉल्ट चैनल",
  "chat.channels.yours": "आपके चैनल",
  "chat.channels.none": "अभी कोई चैनल नहीं",
  "chat.channels.none_hint": "जुड़ने या बनाने के लिए ऊपर {plus} दबाएँ।",
  "chat.channels.none_desc":
    "अभी कोई चैनल नहीं। जुड़ने या बनाने के लिए हेडर में जोड़ें बटन इस्तेमाल करें।",
  "chat.channels.show_fewer": "कम डिफ़ॉल्ट चैनल दिखाएँ",
  "chat.channels.show_less": "कम दिखाएँ",
  "chat.channels.info": "चैनल जानकारी",
  "chat.channels.pin": "चैनल पिन करें",
  "chat.channels.unpin": "चैनल अनपिन करें",
  "chat.channels.mute": "चैनल म्यूट करें",
  "chat.channels.unmute": "चैनल अनम्यूट करें",
  "chat.channels.leave": "चैनल छोड़ें",
  "chat.channels.leave_confirm": "छोड़ें",
  "chat.channels.clear_body":
    "{name} के सारे संदेश मिटाएँ? इसे वापस नहीं लिया जा सकता।",
  "chat.channels.leave_body":
    "{name} छोड़ें? आपको इसके संदेश मिलने बंद हो जाएँगे, और इसका इतिहास इस डिवाइस से हट जाएगा।",
  "chat.channels.more_options": "{name} के लिए और विकल्प",
  "chat.channels.teleported_tag": "{level}  ·  टेलीपोर्ट किया",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "चैट साफ़ करें",
  "chat.dm.remove_contact": "संपर्क हटाएँ",
  "chat.dm.block": "इस पीअर को ब्लॉक करें",
  "chat.dm.block_confirm": "ब्लॉक करें",
  "chat.dm.delete": "चैट मिटाएँ",
  "chat.dm.delete_body":
    "इससे बातचीत आपकी सूची से हट जाती है और इसके संदेश मिट जाते हैं। संपर्क बना रहता है, और उनका नया संदेश एक नई चैट शुरू कर देता है।",
  "chat.dm.in_range": "पहुँच में",
  "chat.dm.row_hint": "और विकल्पों के लिए दो बार टैप करके दबाए रखें",
  "chat.channels.row_hint": "और विकल्पों के लिए दो बार टैप करके दबाए रखें",
  "chat.dm.you_prefix": "आप:",
  "chat.dm.none": "कोई सीधा संदेश नहीं",
  "chat.dm.none_desc":
    "एन्क्रिप्टेड DM शुरू करने के लिए मेश टैब पर जाकर किसी पीअर को टैप करें।",
  "chat.dm.contact_info": "संपर्क जानकारी",
  "chat.dm.pin": "चैट पिन करें",
  "chat.dm.unpin": "चैट अनपिन करें",
  "chat.dm.mute": "चैट म्यूट करें",
  "chat.dm.unmute": "चैट अनम्यूट करें",
  "chat.dm.clear_body":
    "{name} के साथ सारे संदेश मिटाएँ? इसे वापस नहीं लिया जा सकता।",
  "chat.dm.remove_contact_body":
    "{name} को हटाएँ? इससे बातचीत मिट जाती है और संपर्क भुला दिया जाता है। वे दोबारा संदेश भेजें तो आप तक पहुँच सकते हैं।",
  "chat.dm.block_body":
    "{name} को ब्लॉक करें? वे आपको मेश टैब पर नहीं दिखेंगे और उनके संदेश नहीं आएँगे, चाहे वे आस-पास ही क्यों न हों।",
  "chat.dm.more_options": "{name} के लिए और विकल्प",
  "chat.dm.remove_contact_short": "संपर्क हटाएँ",
  "chat.dm.block_short": "संपर्क ब्लॉक करें",
  "chat.dm.delete_short": "चैट मिटाएँ",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "संदेश साफ़ करें",
  "chat.clear_confirm": "साफ़ करें",
  "chat.group_badge": "समूह",
  "chat.more": "और",
  "chat.no_messages": "अभी कोई संदेश नहीं",
  "chat.you": "आप",
  "chat.a11y.channel": "चैनल {name}",
  "chat.a11y.group": "समूह {name}",
  "chat.a11y.muted": "म्यूट",
  "chat.a11y.pinned": "पिन किया",

  // ---- Chats: start something new ----
  "chat.new.title": "कुछ नया शुरू करें",
  "chat.new.channel": "निजी चैनल बनाएँ",
  "chat.new.channel_label": "निजी चैनल",
  "chat.new.channel_desc":
    "ऐसा कमरा जिसमें लिंक वाला कोई भी आ सकता है। एक बनाएँ, या भेजे गए लिंक से जुड़ें।",
  "chat.new.group": "निजी समूह बनाएँ",
  "chat.new.group_label": "निजी समूह",
  "chat.new.group_desc": "ख़ास लोग चुनें। 16 तक। ब्लूटूथ पर ही रहता है।",
  "chat.new.place": "जियोहैश से किसी जगह जाएँ",
  "chat.new.place_label": "किसी जगह जाएँ",
  "chat.new.place_desc": "जियोहैश से कहीं का भी स्थान चैनल खोलें।",
  "chat.new.reach": "पहुँच",
  "chat.new.reach_internet":
    "सदस्यों तक ब्लूटूथ और इंटरनेट दोनों से पहुँचता है।",
  "chat.new.reach_mesh": "ब्लूटूथ की पहुँच में चलता है, इंटरनेट पर नहीं।",
  "chat.new.reach_internet_desc":
    "सदस्यों तक इंटरनेट से भी पहुँचता है। रिले देख सकते हैं कि चैनल सक्रिय है, इसके संदेश या इसमें कौन है, यह कभी नहीं।",
  "chat.new.reach_mesh_desc":
    "स्थानीय मेश पर ही रहता है। सबसे निजी, कुछ भी ब्लूटूथ की पहुँच से बाहर नहीं जाता।",
  "chat.new.join_link": "आमंत्रण लिंक से किसी निजी चैनल से जुड़ें",
  "chat.new.back_to_chooser": "चुनाव पर वापस",
  "chat.new.create_channel": "चैनल बनाएँ",
  "chat.new.name_required": "पहले चैनल का नाम डालें",
  "chat.new.name_taken": "वह नाम पहले से लिया जा चुका है",
  "chat.new.create": "बनाएँ",
  "chat.new.e2ee":
    "सिरे से सिरे तक एन्क्रिप्टेड। सिर्फ़ सदस्य ही संदेश पढ़ सकते हैं।",
  "chat.new.invite_only":
    "सिर्फ़ आमंत्रण से। जिसे भी आप लिंक देंगे वह जुड़ सकता है। यह बाक़ी सबसे छिपा रहता है, आस-पास के पीअर से भी।",
  "chat.new.name_exists": "इस नाम का चैनल पहले से मौजूद है।",
  "chat.new.reach_bluetooth_chip": "सिर्फ़ ब्लूटूथ",
  "chat.new.reach_internet_chip": "ब्लूटूथ + इंटरनेट",
  "chat.new.have_link": "आमंत्रण लिंक से जुड़ें",

  // ---- Chats: join by link ----
  "chat.join.title": "लिंक से जुड़ें",
  "chat.join.not_airhop": "वह Airhop लिंक नहीं है।",
  "chat.join.reach_internet":
    "सदस्यों तक ब्लूटूथ और इंटरनेट दोनों से पहुँचता है।",
  "chat.join.reach_mesh": "ब्लूटूथ की पहुँच में ही रहता है।",
  "chat.join.contact_card":
    "एक संपर्क कार्ड। उन्हें आपके संपर्कों में जोड़कर चैट खोल देता है।",
  "chat.join.unverified": "वह लिंक सत्यापित नहीं हो सका",
  "chat.join.unverified_body":
    "संपर्क कार्ड अपनी ही कुंजियों से मेल नहीं खाता, इसलिए वह नहीं जोड़ा गया। उनसे नया भेजने को कहें।",
  "chat.join.paste": "क्लिपबोर्ड से चिपकाएँ",
  "chat.join.join": "जुड़ें",
  "chat.join.public_channel":
    "सार्वजनिक चैनल {name}। आस-पास कोई भी इसे पढ़ सकता है।",
  "chat.join.private_channel": "निजी चैनल {name}। {reach}",
  "chat.join.dm_with": "{name} के साथ सीधा संदेश।",
  "chat.join.joined_as": "{name} के रूप में जुड़े",
  "chat.join.name_clash_body":
    "आप पहले से एक अलग {name} में हैं। चैनल के नाम बस लेबल हैं, इसलिए इस आमंत्रण ने अपना चैनल खोला और जिसमें आप थे वह अछूता है। दोनों में से किसी का नाम उसकी चैनल जानकारी से बदल सकते हैं।",
  "chat.join.paste_hint":
    "airhop:// से शुरू होने वाला आमंत्रण चिपकाएँ। किसी को टैप करना भी चलता है; यह उस लिंक के लिए है जिसे आप टैप नहीं कर सकते।",
  "chat.join.key_note":
    "निजी चैनल का आमंत्रण कुंजी साथ लाता है, इसलिए जुड़ना तुरंत होता है और किसी और से कुछ नहीं पूछा जाता।",
  "chat.join.offline_note":
    "ऑफ़लाइन चलता है। लिंक इसी डिवाइस पर पढ़ा जाता है, और चैनल की पहुँच वैसी ही रहती है जैसी बनाने वाले ने रखी।",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "वह सेल नहीं खुल सकी। थोड़ी देर में फिर कोशिश करें।",
  "chat.jump.title": "किसी जगह जाएँ",
  "chat.jump.saved": "सहेजी हुई जगहें",
  "chat.jump.anywhere":
    "कहीं का भी सार्वजनिक स्थान चैनल खोलें, उस जगह का भी जहाँ आप नहीं हैं।",
  "chat.jump.geohash_note":
    "इसका जियोहैश डालें। जिस किसी का स्थान उस सेल में आता है, वह यह चैनल साझा करता है।",
  "chat.jump.teleport_note":
    "आप टेलीपोर्ट किए हुए दिखते हैं, आस-पास नहीं। यह सिर्फ़ इंटरनेट से पहुँचता है।",
  "chat.jump.level_cell": "{level} सेल",
  "chat.jump.already_here":
    "आप पहले से यहीं हैं। जाएँ आपका {name} चैनल खोलता है।",
  "chat.jump.open_direction": "अपनी {direction} दिशा की सेल खोलें",
  "chat.jump.open_place": "{name} खोलें",
  "chat.jump.remove_place": "{name} को सहेजी हुई जगहों से हटाएँ",
  "chat.jump.go": "जाएँ",
  "chat.jump.how":
    "जियोहैश ढूँढ़ने के लिए: कोई स्थान चैनल खोलें > उसका नाम टैप करें > वहीं से कॉपी करें।",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "हर सदस्य तक नहीं पहुँच सके। जब वे आस-पास हों तब फिर कोशिश करें।",
  "chat.group.you_were_added": "आपको {name} में जोड़ा गया।",
  "chat.group.added_you": "आपको {name} में जोड़ा",
  "chat.group.you_were_removed":
    "आपको {name} से हटा दिया गया। अब आप यहाँ न पढ़ सकते हैं न भेज सकते हैं।",
  "chat.group.removed_you": "आपको {name} से हटाया",
  "chat.group.add_failed": "उन्हें जोड़ा नहीं जा सका",
  "chat.group.add_failed_body":
    "कुछ नहीं बदला। या तो वे अभी पहुँच में नहीं हैं, या समूह 16 पर भरा है, या आप इसके बनाने वाले नहीं हैं।",
  "chat.group.remove_failed": "उन्हें हटाया नहीं जा सका",
  "chat.group.remove_failed_body":
    "कुछ नहीं बदला। समूह में कौन है, यह सिर्फ़ उसे बनाने वाला ही बदल सकता है।",
  "chat.group.e2ee":
    "सिरे से सिरे तक एन्क्रिप्टेड। सिर्फ़ सदस्य ही संदेश पढ़ सकते हैं।",
  "chat.group.cap":
    "16 लोगों तक, आपके चुने हुए। कोई आमंत्रण लिंक नहीं है, इसलिए किसी को आगे भेजकर कोई नहीं जुड़ता।",
  "chat.group.bluetooth":
    "सिर्फ़ ब्लूटूथ। पहुँच से बाहर के सदस्यों को संदेश तब मिलते हैं जब वे लौट आते हैं।",
  "chat.group.members_label": "सदस्य",
  "chat.group.none_in_range":
    "कोई पहुँच में नहीं है। समूह बनाते समय सदस्यों का आस-पास होना ज़रूरी है।",
  "chat.group.create_title": "समूह बनाएँ",
  "chat.group.name_placeholder": "समूह का नाम",
  "chat.group.create": "बनाएँ",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "स्थानीय मेश · सिर्फ़ ब्लूटूथ",
  "chat.scope.mesh_desc":
    "ब्लूटूथ की पहुँच (मोटे तौर पर 10 से 100 मीटर) के डिवाइस तक पहुँचता है। इंटरनेट की ज़रूरत नहीं। स्थानीय तालमेल के लिए बढ़िया।",
  "chat.scope.block": "शहरी ब्लॉक · ~100मी",
  "chat.scope.block_desc":
    "शहरी ब्लॉक जितनी पहुँच। संदेश इंटरनेट से जोड़े जाते हैं ताकि ब्लूटूथ से बाहर पर पास वाले पीअर भी शामिल हो सकें।",
  "chat.scope.neighborhood": "मोहल्ला · ~1कि.मी.",
  "chat.scope.neighborhood_desc":
    "मोहल्ले जितनी पहुँच। रिले की मदद से पूरे इलाके के पीअर तक सीधे ब्लूटूथ लिंक के बिना भी पहुँचा जा सकता है।",
  "chat.scope.city": "शहर · ~10कि.मी.",
  "chat.scope.city_desc":
    "पूरे शहर का चैनल। महानगर भर के पीअर तक पहुँचने के लिए स्थान-आधारित इंटरनेट रिले इस्तेमाल करता है।",
  "chat.scope.province": "प्रांत या राज्य · ~100कि.मी.",
  "chat.scope.province_desc":
    "प्रांत या राज्य जितनी पहुँच। सैकड़ों किलोमीटर तक क्षेत्रीय पहुँच के लिए इंटरनेट से जोड़ा गया।",
  "chat.scope.country": "देश या क्षेत्र · ~1000कि.मी.",
  "chat.scope.country_desc":
    "पूरे देश जितनी पहुँच। क्षेत्र का कोई भी Airhop या bitchat उपयोगकर्ता जुड़कर संदेश पढ़ सकता है।",
  "chat.transport.bluetooth": "सिर्फ़ ब्लूटूथ",
  "chat.transport.both": "ब्लूटूथ + इंटरनेट",
  "chat.transport.internet": "सिर्फ़ इंटरनेट",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "कमांड /{cmd}: {hint}",
  "chat.cmd.hug_hint": "एक गर्मजोशी भरा आलिंगन भेजें",
  "chat.cmd.slap_hint": "एक बड़ी मछली से थप्पड़ मारें",
  "chat.status.sending": "भेजा जा रहा है…",
  "chat.status.undo_send": "भेजना वापस लें",
  "chat.status.undo": "वापस लें",
  "chat.status.sent": "भेजा गया",
  "chat.status.received": "मिला",
  "chat.status.failed": "विफल",
  "chat.status.canceled": "रद्द किया",
  "chat.status.waiting": "इंतज़ार",
  "chat.status.sending_short": "भेजा जा रहा है",
  "chat.status.receiving": "लिया जा रहा है",
  "chat.thread.not_available": "यहाँ उपलब्ध नहीं",
  "chat.thread.private_channel": "निजी चैनल",
  "chat.thread.location_channel": "स्थान चैनल",
  "chat.thread.public_channel": "सार्वजनिक चैनल",
  "chat.thread.notices": "इस चैनल की सूचनाएँ",
  "chat.thread.invite": "किसी को इस चैनल में बुलाएँ",
  "chat.thread.not_in_range":
    "ब्लूटूथ की पहुँच में नहीं। इंटरनेट से पहुँचाया जा रहा है।",
  "chat.thread.not_nearby":
    "आस-पास नहीं। वे पहुँच में लौटें या ऑनलाइन आएँ, तब हम पहुँचा देंगे।",
  "chat.thread.no_keys":
    "उन्हें संदेश भेजने के लिए आपको ब्लूटूथ की पहुँच में होना होगा, या उनका कोड स्कैन करना होगा।",
  "chat.geo.card_received":
    "{name} ने अपना संपर्क साझा किया। आप में से कोई भी हटे तो बात जारी रखने के लिए अपना भी साझा करें।",
  "chat.geo.exchange_complete":
    "संपर्क आपस में बदल लिए गए। अब आप एक-दूसरे तक कहीं से भी पहुँच सकते हैं।",
  "chat.geo.keep_person": "इस व्यक्ति को रखें",
  "chat.geo.keep_person_desc":
    "अपना संपर्क साझा करें ताकि आप में से कोई हटे तो भी बात जारी रहे। उन्हें आपकी स्थायी पहचान पता चल जाएगी।",
  "chat.geo.card_sent": "साझा किया · उनके इंतज़ार में",
  "chat.thread.left_cell":
    "आप यह इलाका छोड़ चुके हैं, इसलिए वे यहाँ आप तक नहीं पहुँच सकते। कहीं से भी बात जारी रखने के लिए कोड आपस में बदलें।",
  "chat.thread.no_route":
    "अभी उन तक नहीं पहुँच सकते। रास्ता मिलते ही संदेश चला जाएगा।",
  "chat.thread.empty": "अभी कोई संदेश नहीं",
  "chat.thread.empty_desc": "एक एन्क्रिप्टेड बातचीत शुरू करें।",
  "chat.thread.jump_latest": "नवीनतम संदेश पर जाएँ",
  "chat.thread.back_to_members": "सदस्यों पर वापस",
  "chat.thread.nostr_key": "Nostr सार्वजनिक कुंजी",
  "chat.thread.in_range": "पहुँच में",
  "chat.voice.not_recorded": "वॉइस नोट रिकॉर्ड नहीं हुआ",
  "chat.thread.message": "संदेश",
  "chat.thread.message_placeholder": "संदेश…",
  "chat.thread.length_full": "संदेश भर गया",
  "chat.thread.waiting_for": "{name} के लौटने का इंतज़ार · {percent}%",
  "chat.thread.peer": "पीअर",
  "chat.thread.cancel_transfer": "{name} रद्द करें",
  "chat.thread.queued_more": "{count} और भेजे जाने के इंतज़ार में",
  "chat.thread.across_bridge": "ब्रिज के पार {count}",
  "chat.thread.bridged": "ब्रिज किया",
  "chat.thread.invite_body":
    "Airhop पर {channel} में मेरे साथ जुड़ें — ऑफ़लाइन-पहले, निजी मेश मैसेजिंग।",
  "chat.thread.go_back_unread": "वापस जाएँ, {count} अपठित",
  "chat.thread.view_info": "{name} की जानकारी देखें",
  "chat.thread.notices_new": "इस चैनल की सूचनाएँ, {count} नई",
  "chat.thread.say_something": "{channel} में कुछ कहें।",
  "chat.thread.jump_latest_new": "नवीनतम संदेश पर जाएँ, {count} नए",
  "chat.thread.unconfirmed_since": "{date} से कोई डिलीवरी पुष्ट नहीं",
  "chat.thread.no_reach": "आस-पास कोई पीअर नहीं · यह अभी किसी को नहीं मिला",
  "chat.thread.channel_needs_internet":
    "इंटरनेट बंद · यह चैनल सिर्फ़ ब्लूटूथ की पहुँच वालों तक जाता है",
  "chat.thread.cell_needs_internet":
    "इंटरनेट बंद · इस सेल तक सिर्फ़ इंटरनेट से पहुँचा जा सकता है",
  "chat.thread.geo_dm_needs_internet":
    "इंटरनेट बंद · यह बातचीत सिर्फ़ इंटरनेट से चलती है",
  "chat.thread.via_gateway":
    "इंटरनेट बंद · आस-पास का एक डिवाइस आपके लिए इसे ऑनलाइन ढो रहा है",
  "chat.thread.group_queued":
    "इस समूह से अभी कोई आस-पास नहीं है। जब होंगे तब यह उन तक पहुँच जाएगा।",
  "chat.thread.no_group_key":
    "आप अब इस समूह में नहीं हैं, इसलिए यह भेजा नहीं जा सकता",
  "chat.thread.no_reach_offline":
    "इंटरनेट बंद और आस-पास कोई पीअर नहीं · यह अभी किसी को नहीं मिला",
  "chat.thread.mention": "{name} का ज़िक्र करें",
  "chat.thread.someone_talking": "{hold}। {name} बोल रहे हैं।",
  "chat.thread.attach_note":
    "फ़ाइलें सिर्फ़ ब्लूटूथ की पहुँच में जाती हैं। टेक्स्ट और भुगतान इंटरनेट संपर्कों तक पहुँचते हैं; अटैचमेंट नहीं।",
  "chat.thread.message_peer": "{name} को संदेश भेजें",
  "chat.thread.send": "संदेश भेजें",
  "chat.thread.group": "समूह",
  "chat.bridge.nearby_only": "सिर्फ़ आस-पास: इस संदेश को मेश ब्रिज से दूर रखें",
  "chat.bridge.nearby_label": "सिर्फ़ आस-पास · ब्लूटूथ पर ही रहता है",
  "chat.bridge.bridging_label":
    "आस-पास के इलाकों से जुड़ रहा है · सिर्फ़ आस-पास के लिए टैप करें",
  "chat.screenshot.you_took": "आपने स्क्रीनशॉट लिया",
  "chat.screenshot.you_took_private":
    "आपने स्क्रीनशॉट लिया · किसी को नहीं बताया गया",
  "chat.screenshot.heads_up": "ध्यान दें",
  "chat.screenshot.notice": "* {name} ने स्क्रीनशॉट लिया *",
  "chat.screenshot.notified_dm":
    "{name} को बता दिया गया कि आपने इस बातचीत का स्क्रीनशॉट लिया।",
  "chat.screenshot.notified":
    "इस चैनल के सबको बता दिया गया कि आपने स्क्रीनशॉट लिया।",
  "chat.screenshot.not_notified":
    "किसी को नहीं बताया गया। यह चैनल सार्वजनिक है, इसलिए स्क्रीनशॉट की घोषणा यह दर्ज कर देती कि आप यहाँ थे।",
  "chat.thread.error": "त्रुटि",
  "chat.thread.go_back": "वापस जाएँ",
  "chat.bubble.via_bridge": "मेश ब्रिज के ज़रिए",
  "chat.bubble.view_profile": "{name} की प्रोफ़ाइल देखें",
  "chat.bubble.forwarded": "आगे भेजा गया",
  "chat.bubble.attachment": "अटैचमेंट",
  "chat.bubble.a11y": "{sender}: {body}। और विकल्पों के लिए दबाए रखें।",
  "chat.bubble.failed_retry": "भेजने में विफल। फिर कोशिश करने के लिए टैप करें।",

  // ---- Chats: message actions and info ----
  "chat.info.title": "संदेश जानकारी",
  "chat.info.delivered_to": "{name} तक पहुँचा",
  "chat.info.read_by": "{name} ने पढ़ा",
  "chat.info.group_reach_desc": "अभी पहुँच में, डिलीवरी की पुष्टि नहीं",
  "chat.info.group_alone": "कोई दूसरा सदस्य नहीं",
  "chat.info.today_at": "आज {time}",
  "chat.info.sending": "भेजा जा रहा है…",
  "chat.info.failed": "भेजने में विफल",
  "chat.info.courier": "किसी साथी ने ढोया",
  "chat.info.sent": "भेजा गया",
  "chat.info.queued": "भेजे जाने के इंतज़ार में",
  "chat.info.waiting": "इंतज़ार…",
  "chat.action.info": "संदेश जानकारी",
  "chat.action.save_photos": "फ़ोटो में सहेजें",
  "chat.action.save_copy": "एक प्रति सहेजें",
  "chat.action.forward": "आगे भेजें",
  "chat.action.select": "चुनें",
  "chat.select.cancel": "चुनाव रद्द करें",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "कैमरा",
  "chat.attach.camera_desc": "फ़ोटो या वीडियो लें",
  "chat.attach.library": "फ़ोटो लाइब्रेरी",
  "chat.attach.library_desc": "अपनी लाइब्रेरी से चुनें",
  "chat.attach.document": "दस्तावेज़",
  "chat.attach.document_desc": "कोई भी फ़ाइल या PDF भेजें",
  "chat.attach.voice": "वॉइस नोट",
  "chat.attach.voice_desc": "वॉइस संदेश रिकॉर्ड करके भेजें",
  "chat.attach.ecash": "ecash भेजें",
  "chat.attach.ecash_desc": "अपने वॉलेट से Cashu sats भेजें",
  "chat.attach.location": "स्थान",
  "chat.attach.location_desc": "आप अभी जहाँ हैं वह भेजें",
  "chat.attach.title": "जोड़ें",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "एक स्थान साझा किया",
  "chat.location.received_summary": "अपना स्थान साझा किया",
  "chat.location.title": "स्थान",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago} पहले लिया",
  "chat.location.open_maps": "Maps में खोलें",
  "chat.location.no_forward": "स्थान आगे नहीं भेजे जाते",
  "chat.location.no_forward_body":
    "स्थान एक व्यक्ति को भेजा जाता है। किसी और को देना हो तो उसकी जगह अपना स्थान साझा करें।",
  "chat.location.no_fix":
    "यह कितनी दूर है, यह देखने के लिए स्थान की अनुमति दें",
  "chat.location.send_title": "अपना स्थान भेजें",
  "chat.location.send_body":
    "{name} को एक ही बिंदु दिखेगा: आप अभी जहाँ हैं। यह लगातार अपडेट नहीं होता।",
  "chat.location.send": "स्थान भेजें",
  "chat.location.finding": "आपका स्थान ढूँढ़ा जा रहा है…",
  "chat.location.no_location": "आपका स्थान नहीं मिल सका",
  "chat.location.no_location_body":
    "स्थान की अनुमति दें और पक्का करें कि स्थान सेवाएँ चालू हैं, फिर कोशिश करें।",
  "chat.location.not_delivered": "आपका स्थान नहीं भेजा जा सका",
  "chat.location.not_delivered_body":
    "स्थान तभी भेजने लायक है जब वह ताज़ा हो, इसलिए इसे बाद के लिए क़तार में नहीं रखा जाता। {name} के पहुँच में आने पर फिर कोशिश करें।",
  "chat.location.direction.n": "उत्तर",
  "chat.location.direction.ne": "उत्तर-पूर्व",
  "chat.location.direction.e": "पूर्व",
  "chat.location.direction.se": "दक्षिण-पूर्व",
  "chat.location.direction.s": "दक्षिण",
  "chat.location.direction.sw": "दक्षिण-पश्चिम",
  "chat.location.direction.w": "पश्चिम",
  "chat.location.direction.nw": "उत्तर-पश्चिम",
  "chat.attach.send_anyway": "फिर भी भेजें",
  "chat.attach.bitchat_too_big": "यह शायद न पहुँचे",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat पर हैं, जो बड़ी फ़ाइल बीच में ही छोड़ देता है। लगभग 350 KiB से कम भरोसेमंद है। किसी Airhop संपर्क को भेजने पर ऐसी कोई सीमा नहीं।",
  "chat.attach.bitchat_unopenable": "शायद वे इसे खोल न पाएँ",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat पर हैं, जो फ़ोटो और वॉइस नोट दिखाता है पर बाक़ी सब ऐसी फ़ाइल के रूप में गिनाता है जिसे वह खोल नहीं सकता। यह पहुँच तो जाएगा, बस शायद वे इसे देख न सकें।",
  "chat.attach.file": "फ़ाइल जोड़ें",
  "chat.attach.unavailable": "यहाँ अटैचमेंट उपलब्ध नहीं",
  "chat.attach.not_sent": "अटैचमेंट नहीं भेजा गया",
  "chat.attach.read_failed":
    "उस फ़ाइल को पढ़ने में कुछ गड़बड़ हुई। कोई दूसरी आज़माएँ।",
  "chat.attach.caption": "कैप्शन जोड़ें…",
  "chat.attach.send": "अटैचमेंट भेजें",
  "chat.attach.generic": "अटैचमेंट",
  "chat.media.view_full": "फ़ोटो पूरी स्क्रीन पर देखें",
  "chat.media.gone_photo": "फ़ोटो इस डिवाइस पर नहीं",
  "chat.media.gone_video": "वीडियो इस डिवाइस पर नहीं",
  "chat.media.gone_voice": "वॉइस नोट इस डिवाइस पर नहीं",
  "chat.media.gone_file": "फ़ाइल इस डिवाइस पर नहीं",
  "chat.media.gone_note": "7 दिन बाद या कैश साफ़ होने पर हटा दिया गया",
  "chat.media.ask_resend": "फिर से माँगें",
  "chat.media.resend_draft": "क्या आप वह {kind} दोबारा भेज सकते हैं?",
  "chat.media.kind_photo": "फ़ोटो",
  "chat.media.kind_video": "वीडियो",
  "chat.media.kind_voice": "वॉइस नोट",
  "chat.media.kind_file": "फ़ाइल",
  "chat.media.pause_voice": "वॉइस नोट रोकें",
  "chat.media.play_voice": "वॉइस नोट बजाएँ",
  "chat.media.voice_position": "वॉइस नोट की जगह",
  "chat.media.voice_scrub": "उस बिंदु पर जाने के लिए पट्टियों पर टैप करें",
  "chat.media.image": "छवि",
  "chat.media.tap_load_photo": "फ़ोटो लाने के लिए टैप करें",
  "chat.media.open_document": "{name} खोलें",
  "chat.media.document": "दस्तावेज़",
  "chat.media.tap_load_video": "वीडियो लाने के लिए टैप करें",
  "chat.media.video": "वीडियो",
  "chat.media.photo": "फ़ोटो",
  "chat.media.close_photo": "फ़ोटो बंद करें",
  "chat.media.save_photo": "फ़ोटो अपनी फ़ोटो में सहेजें",
  "chat.media.share_photo": "फ़ोटो साझा करें",
  "chat.media.saved_videos": "आपके वीडियो में सहेजा गया",
  "chat.media.saved_photos": "आपकी फ़ोटो में सहेजा गया",
  "chat.media.not_saved": "सहेजा नहीं गया",
  "chat.media.cant_open": "फ़ाइल नहीं खुल सकती",
  "chat.media.no_app":
    "इस डिवाइस पर यह फ़ाइल खोलने या साझा करने के लिए कोई ऐप उपलब्ध नहीं है।",
  "chat.media.open_failed":
    "फ़ाइल नहीं खुल सकी। हो सकता है वह कैश से हट चुकी हो।",
  "media.blocked.nostr_only":
    "आप इस व्यक्ति को सिर्फ़ एक रिले के ज़रिए जानते हैं। सिर्फ़ टेक्स्ट भेजा जा सकता है। फ़ोटो, फ़ाइलें और वॉइस नोट के लिए ब्लूटूथ चाहिए।",
  "media.blocked.private_channel":
    "ब्रॉडकास्ट अटैचमेंट हस्ताक्षरित होता है पर एन्क्रिप्टेड नहीं, इसलिए उसे निजी चैनल में भेजने पर वह खुला रह जाता, जबकि यहाँ का टेक्स्ट एन्क्रिप्टेड रहता है।",
  "media.blocked.private_group":
    "ब्रॉडकास्ट अटैचमेंट हस्ताक्षरित होता है पर एन्क्रिप्टेड नहीं, इसलिए उसे निजी समूह में भेजने पर वह खुला रह जाता, जबकि यहाँ का टेक्स्ट एन्क्रिप्टेड रहता है।",
  "media.blocked.location_channel":
    "स्थान चैनल लोगों तक इंटरनेट से पहुँचता है, और फ़ोटो, फ़ाइलें व वॉइस नोट ब्लूटूथ से चलते हैं, इसलिए वे कभी पहुँचेंगे ही नहीं।",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "यहाँ वॉइस नोट उपलब्ध नहीं",
  "chat.voice.hold_live": "लाइव बात करने के लिए दबाए रखें",
  "chat.voice.hold_record": "वॉइस नोट रिकॉर्ड करने के लिए दबाए रखें",
  "chat.voice.cancel_recording": "रिकॉर्डिंग रद्द करें",
  "chat.voice.slide_cancel": "रद्द करने के लिए सरकाएँ",
  "chat.voice.release_cancel": "रद्द करने के लिए छोड़ें",
  "chat.voice.a11y_toggle": "बोलना शुरू या बंद करने के लिए दो बार टैप करें।",
  "chat.voice.limit_reached": "दो मिनट की सीमा पूरी, भेजने के लिए छोड़ें",
  "chat.voice.limit_sent": "दो मिनट की सीमा पूरी, नोट भेज दिया गया",
  "chat.voice.stop_send": "रिकॉर्डिंग रोककर भेजें",
  "chat.voice.lift_lock": "बिना पकड़े रिकॉर्ड करने के लिए ऊपर सरकाएँ",
  "chat.voice.live_speaking": "{name} बोल रहे हैं",
  "voice.unavailable": "लाइव वॉइस उपलब्ध नहीं",
  "voice.recording_stopped": "रिकॉर्डिंग रुक गई",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "कैमरा पहुँच",
  "chat.perm.camera_purpose": "भेजने के लिए फ़ोटो लेने",
  "chat.perm.photo_label": "फ़ोटो पहुँच",
  "chat.perm.photo_purpose": "भेजने के लिए फ़ोटो या वीडियो चुनने",
  "chat.perm.photo_save_purpose": "इसे अपनी फ़ोटो में सहेजने",
  "chat.perm.mic_label": "माइक्रोफ़ोन पहुँच",
  "chat.perm.mic_live_purpose": "आस-पास के लोगों से बात करने",
  "chat.perm.mic_note_purpose": "वॉइस नोट रिकॉर्ड करने",
  "chat.perm.recording_stopped": "रिकॉर्डिंग रुक गई",
  "chat.perm.record_failed":
    "रिकॉर्डिंग शुरू नहीं हो सकी। माइक्रोफ़ोन की अनुमतियाँ जाँचें।",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "ले लिया",
  "chat.ecash.reclaimed": "वापस लिया",
  "chat.ecash.claiming": "लिया जा रहा है…",
  "chat.ecash.claim": "लें",
  "chat.ecash.claim_amount": "{amount} {unit} लें",
  "chat.ecash.already_claimed": "पहले ही ले लिया",
  "chat.ecash.already_claimed_body":
    "इस टोकन का हर प्रूफ़ पहले से आपके वॉलेट में है, इसलिए कुछ नहीं जुड़ा।",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "यथासंभव पहुँचाने के लिए मेश को सौंपा गया",
  "chat.info.queued_desc": "उन तक रास्ता बनने तक इसी फ़ोन पर रखा गया",
  "chat.info.reclaimed": "वापस लिया",
  "chat.info.reclaimed_desc":
    "आपने यह भुगतान अपने वॉलेट में वापस ले लिया, इसलिए यह पहुँचाया नहीं जाएगा",
  "chat.info.about": "परिचय",
  "chat.info.group_desc":
    "एक निजी समूह। सिर्फ़ वही सदस्य इसे पढ़ सकते हैं जिन्हें बनाने वाले ने जोड़ा, और यह ब्लूटूथ पर ही रहता है।",
  "chat.info.teleported_desc":
    "इस जियोहैश सेल का एक सार्वजनिक स्थान चैनल। सेल में मौजूद कोई भी, चाहे Airhop पर हो या bitchat पर, इसे इंटरनेट से साझा करता है। आप टेलीपोर्ट किए हुए हैं, शारीरिक रूप से यहाँ नहीं।",
  "chat.info.custom_desc":
    "एक कस्टम चैनल। नाम जानने वाला कोई भी किसी भी Airhop या bitchat डिवाइस से जुड़ सकता है।",
  "chat.info.private_e2ee": "निजी · सिरे से सिरे तक एन्क्रिप्टेड",
  "chat.info.public_plain": "सार्वजनिक · बिना एन्क्रिप्शन",
  "chat.info.group_privacy":
    "सिर्फ़ नीचे दिखाए गए सदस्य ही यह समूह पढ़ सकते हैं। संदेश ब्लूटूथ पर ही रहते हैं, इसलिए पहुँच से बाहर के सदस्यों को वे लौटने पर मिलते हैं।",
  "chat.info.teleport_privacy":
    "वह जगह जहाँ आपने टेलीपोर्ट किया। यह इस सेल के सब लोगों तक इंटरनेट से पहुँचता है, और ब्लूटूथ की पहुँच वाले किसी तक नहीं।",
  "chat.info.location_off_privacy":
    "स्थान बंद है, इसलिए यह चैनल आस-पास के डिवाइस तक सिर्फ़ ब्लूटूथ से पहुँचता है। इसके इलाके की सेल तक इंटरनेट से पहुँचने के लिए स्थान चालू करें।",
  "chat.info.invite_privacy":
    "सिर्फ़ वही लोग इसे पढ़ सकते हैं जिन्हें आप लिंक से बुलाएँ। यह बाक़ी सबसे छिपा रहता है, आस-पास के पीअर से भी।",
  "chat.info.public_privacy":
    "जो भी जुड़ता है वह हर संदेश पढ़ सकता है। निजी बातचीत के लिए सीधा संदेश इस्तेमाल करें; DM सिरे से सिरे तक एन्क्रिप्टेड होते हैं।",
  "chat.info.remove_member": "सदस्य हटाएँ",
  "chat.info.remove_member_body":
    "{name} को समूह से हटाएँ? समूह की कुंजी बदल जाती है ताकि वे नए संदेश न पढ़ सकें।",
  "chat.info.message_member": "{name} को संदेश भेजें",
  "chat.info.remove_member_a11y": "{name} को हटाएँ",
  "chat.info.no_addable":
    "जोड़ने के लिए कोई पहुँच वाला पीअर नहीं। सदस्यों का आस-पास होना ज़रूरी है।",
  "chat.info.add_count": "{count} जोड़ें",
  "chat.info.teleported_tag": "{level}  ·  टेलीपोर्ट किया",
  "chat.info.active": "सक्रिय",
  "chat.info.members": "सदस्य",
  "chat.info.bookmark": "इस जगह को बुकमार्क करें",
  "chat.info.remove_bookmark": "बुकमार्क हटाएँ",
  "chat.info.default_notice":
    "डिफ़ॉल्ट चैनल छोड़े नहीं जा सकते। वे Airhop मेश प्रोटोकॉल का हिस्सा हैं।",
  "chat.info.custom_channel": "कस्टम चैनल",
  "chat.info.geohash": "जियोहैश",
  "chat.info.copy_geohash": "जियोहैश कॉपी करें",
  "chat.info.relays": "रिले",
  "chat.info.show_relays": "इस चैनल को ढोने वाले रिले दिखाएँ",
  "chat.info.relay_custom": "कस्टम",
  "chat.info.relays_none": "कोई नहीं। यह सेल अभी सिर्फ़ ब्लूटूथ पर है।",
  "chat.info.search_members": "सदस्य खोजें",
  "chat.info.search_members_placeholder": "सदस्य खोजें…",
  "chat.info.teleported": "टेलीपोर्ट किया",
  "chat.info.creator": "बनाने वाले",
  "chat.info.no_matches": "कोई मेल नहीं",
  "chat.info.no_one_here": "अभी यहाँ कोई नहीं",
  "chat.info.add_members": "सदस्य जोड़ें",
  "chat.info.add_selected": "चुने गए सदस्य जोड़ें",
  "chat.info.add": "जोड़ें",
  "chat.info.leave_group": "समूह छोड़ें",
  "chat.info.leave_channel": "चैनल छोड़ें",
  "chat.info.leave": "छोड़ें",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} से बातचीत",
  "chat.contact.verified_since": "{date} से सत्यापित",
  "chat.contact.anonymous": "गुमनाम",
  "chat.contact.anonymous_desc":
    "एक जियोहैश छद्मनाम, सत्यापित करने लायक कोई टिकाऊ पहचान नहीं",
  "chat.contact.verified": "सत्यापित",
  "chat.contact.verified_desc": "उनका QR कोड स्कैन किया",
  "chat.contact.verified_desc_compared": "उनके साथ कोड मिलाए",
  "chat.contact.not_verified": "सत्यापित नहीं",
  "chat.contact.not_verified_desc":
    "यह पक्का करने के लिए कि यह सचमुच वही हैं, उनका कोड स्कैन करें या कॉल पर कोड मिलाएँ",
  "chat.contact.e2ee": "सिरे से सिरे तक एन्क्रिप्टेड",
  "chat.contact.e2ee_nostr":
    "NIP-17 गिफ़्ट-रैप्ड, इसलिए रिले इसे पढ़ नहीं सकते",
  "chat.contact.e2ee_mesh":
    "Noise XX, और Airhop डिवाइसों के बीच Double Ratchet भी",
  "chat.contact.copy_nostr": "Nostr सार्वजनिक कुंजी कॉपी करें",
  "chat.contact.nostr_key": "Nostr सार्वजनिक कुंजी",
  "chat.contact.cell_key_note":
    "यह कुंजी उस इलाके की है जहाँ आप मिले थे। आप में से कोई भी हटे तो यह बदल जाती है, और बातचीत उसी के साथ रुक जाती है। कहीं से भी बात जारी रखने के लिए संपर्क आपस में बदलें।",
  "chat.contact.peer_name": "पीअर का नाम",
  "chat.contact.peer_id": "पीअर ID",
  "chat.contact.rename": "नाम बदलें",
  "chat.contact.rename_needs_contact":
    "आप उन्हीं का नाम बदल सकते हैं जिनकी कुंजियाँ आपके पास हैं। पहले संपर्क कार्ड आपस में बदलें, फिर यह ऐसा नाम बन जाता है जो सिर्फ़ आपको दिखता है।",
  "chat.contact.rename_needs_keys":
    "इस संपर्क के लिए अभी कोई कुंजी नहीं। उन्हें संदेश भेजें, या उनका कोड स्कैन करें, फिर आप उन्हें ऐसा नाम दे सकते हैं जो सिर्फ़ आपको दिखे।",
  "chat.contact.renamed_by_you": "आपका दिया नाम",
  "chat.contact.copy_peer_id": "पीअर ID कॉपी करें",
  "chat.contact.verify": "संपर्क सत्यापित करें",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "सूचनाएँ",
  "chat.notices.post_area": "इस इलाके में सूचना डालें",
  "chat.notices.post_mesh": "मेश पर सूचना डालें",
  "chat.notices.mark_urgent": "ज़रूरी लिखें",
  "chat.notices.post": "सूचना डालें",
  "chat.notices.post_short": "डालें",
  "chat.notices.delete": "सूचना मिटाएँ",
  "chat.notices.just_now": "अभी-अभी",
  "chat.notices.fades_soon": "जल्द मिटेगी",
  "chat.notices.1_day": "1 दिन",
  "chat.notices.3_days": "3 दिन",
  "chat.notices.7_days": "7 दिन",
  "chat.notices.fading": "मिट रही है",
  "chat.notices.fades_in_hours": "{count} घंटे में मिटेगी",
  "chat.notices.fades_in_days": "{count} दिन में मिटेगी",
  "chat.notices.scope_geo": "जियो",
  "chat.notices.scope_mesh": "मेश",
  "chat.notices.urgent_short": "ज़रूरी",
  "chat.notices.permanent_warning":
    "कभी नहीं मिटती। सार्वजनिक और इस इलाके से जुड़ी, और आप इसे वापस नहीं ले सकते।",
  "chat.notices.none":
    "अभी कोई सूचना नहीं। एक डालें ताकि वह दूसरों के लिए यहाँ बनी रहे।",

  // ---- Chats: search results ----
  "chat.search.photos": "फ़ोटो",
  "chat.search.videos": "वीडियो",
  "chat.search.audio": "ऑडियो",
  "chat.search.documents": "दस्तावेज़",
  "chat.search.links": "लिंक",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "{filter} से छाँटें",
  "chat.search.no_matches": "“{query}” से मेल खाता कोई {filter} नहीं",
  "chat.search.no_media": "अभी कोई {filter} नहीं",
  "chat.search.result_a11y": "{chat}, {sender} की ओर से {kind}",
  "chat.search.you": "आप",
  "chat.search.section_chats": "चैट",
  "chat.search.section_messages": "संदेश",
  "chat.search.section_notices": "सूचनाएँ",
  "chat.search.hint": "संदेश और चैट खोजें, या ऊपर से कोई फ़िल्टर चुनें।",
  "chat.search.no_results": "“{query}” के लिए कोई नतीजा नहीं",
  "chat.search.open_chat": "{name} खोलें",
  "chat.search.message_a11y": "{chat}, {sender} का संदेश: {snippet}",
  "chat.search.notice_a11y": "{chat} में {author} की सूचना: {snippet}",
  "chat.search.urgent": "ज़रूरी ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "इस सूची में {count} हैं। साफ़ करने से वे सिर्फ़ यहाँ से हटते हैं, और संदेश अपनी बातचीत में अपठित बने रहते हैं। सब पढ़ा हुआ लिखने से दोनों साफ़ हो जाते हैं।",
  "chat.notif.mark_all_read": "सब पढ़ा हुआ लिखें",
  "chat.notif.clear_list": "सूची साफ़ करें",
  "chat.notif.clear_all_a11y": "सभी {count} सूचनाएँ साफ़ करें",
  "chat.notif.title": "सूचनाएँ",
  "chat.notif.clear_short": "साफ़ करें",
  "chat.notif.close": "सूचनाएँ बंद करें",
  "chat.notif.none": "अभी कोई सूचना नहीं",
  "chat.notif.none_desc":
    "आपके चैनलों और चैट के संदेश, ज़िक्र और सूचनाएँ यहाँ दिखती हैं।",
  "chat.notif.new": "नई",
  "chat.notif.notice_in": "{channel} में सूचना",

  // ---- Chats: forward ----
  "chat.forward.title": "आगे भेजें…",
  "chat.forward.to": "{name} को आगे भेजें",
  "chat.forward.cant_send_here": "यहाँ आगे नहीं भेज सकते",
  "chat.forward.cant_send_to": "{name} को आगे नहीं भेज सकते",
  "chat.forward.channels": "चैनल",
  "chat.forward.groups": "समूह",
  "chat.forward.locations": "स्थान",
  "chat.forward.dms": "सीधे संदेश",
  "chat.forward.none": "अभी कोई दूसरी चैट नहीं",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "मेश शुरू हो रहा है…",
  "mesh.banner.no_bluetooth": "इस डिवाइस पर ब्लूटूथ नहीं · सिर्फ़ इंटरनेट",
  "mesh.banner.bluetooth_off": "ब्लूटूथ बंद · मेश उपलब्ध नहीं",
  "mesh.banner.permission_needed": "ब्लूटूथ की अनुमति चाहिए",
  "mesh.banner.blocked": "ब्लूटूथ रुका है · सेटिंग्स में अनुमति दें",
  "mesh.banner.location_permission": "पीअर ढूँढ़ने के लिए स्थान चाहिए",
  "mesh.banner.advertising_unsupported":
    "यह फ़ोन दूसरों को देख सकता है पर खुद नहीं दिखता",
  "mesh.banner.location_off_android":
    "स्थान बंद · Android को पीअर ढूँढ़ने के लिए यह चाहिए",
  "mesh.banner.paused": "मेश रुका है · आप दूर हैं",
  "mesh.banner.location_off": "स्थान बंद · स्थान चैनल उपलब्ध नहीं",
  "mesh.banner.battery_saver": "बैटरी सेवर · कम बार स्कैन",
  "mesh.banner.wipe_incomplete":
    "मिटाना अधूरा · कुछ डेटा बचा हो सकता है, दोबारा खोलने पर फिर कोशिश होगी",
  "mesh.banner.wifi_off": "Wi-Fi बंद · बड़ी फ़ाइलें धीरे जाएँगी",
  "mesh.banner.clock_skew":
    "इस फ़ोन की घड़ी ग़लत है · तारीख़ और समय अपने आप पर सेट करें",
  "mesh.banner.internet_off": "इंटरनेट बंद · सिर्फ़ ब्लूटूथ",
  "mesh.banner.relaying": "आस-पास कोई पीअर नहीं · Nostr से भेजा जा रहा है",
  "mesh.banner.tor": "Tor चालू · इंटरनेट ट्रैफ़िक रूट किया गया",
  "mesh.banner.tor_starting": "Tor शुरू हो रहा है · जुड़ा जा रहा है",
  "mesh.banner.tor_blocked": "Tor जुड़ नहीं सका · मेश फिर भी चलता है",
  "mesh.banner.gateway":
    "इंटरनेट गेटवे चालू · आस-पास के पीअर आगे भेजे जा रहे हैं",
  "mesh.banner.bridge": "मेश ब्रिज चालू · सार्वजनिक चैट जुड़ी",
  "mesh.banner.background_limits": "{brand} पृष्ठभूमि में मेश रोक सकता है",
  "mesh.banner.bridge_across": "मेश ब्रिज चालू · ब्रिज के पार {count}",
  "mesh.banner.action.turn_on": "चालू करें",
  "mesh.banner.action.allow": "अनुमति दें",
  "mesh.banner.action.resume": "फिर चालू करें",
  "mesh.banner.action.fix": "ठीक करें",
  "mesh.banner.hint.resume": "ब्लूटूथ विज्ञापन और स्कैनिंग फिर चालू करता है",
  "mesh.banner.hint.enable_bluetooth":
    "Android से ब्लूटूथ चालू करने को कहता है",
  "mesh.banner.hint.location_settings": "सिस्टम की स्थान सेटिंग्स खोलता है",
  "mesh.banner.hint.app_settings":
    "सिस्टम सेटिंग्स में Airhop की अनुमतियाँ खोलता है",
  "mesh.banner.hint.battery_settings":
    "इस फ़ोन की पृष्ठभूमि गतिविधि सेटिंग्स खोलता है",
  "mesh.banner.dismiss": "हटाएँ: {label}",
  "mesh.banner.hint.dismiss": "इस सूचना को हमेशा के लिए छिपा देता है",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "आस-पास के पीअर खोजे जा रहे हैं…",
  "mesh.radar.starting": "मेश शुरू हो रहा है…",
  "mesh.radar.no_bluetooth": "इस डिवाइस पर ब्लूटूथ नहीं",
  "mesh.radar.bluetooth_off": "ब्लूटूथ बंद · स्कैन नहीं हो रहा",
  "mesh.radar.permission_needed": "ब्लूटूथ की अनुमति चाहिए",
  "mesh.radar.blocked": "ब्लूटूथ रुका है",
  "mesh.radar.location_permission": "स्थान की अनुमति चाहिए",
  "mesh.radar.location_off": "स्थान बंद · स्कैन नहीं हो रहा",
  "mesh.radar.hint_rings": "छल्ले BLE सिग्नल की मज़बूती दिखाते हैं, दूरी नहीं",
  "mesh.radar.hint_checking": "ब्लूटूथ और अनुमतियाँ जाँची जा रही हैं",
  "mesh.radar.hint_internet": "संदेश फिर भी इंटरनेट से जाते हैं",
  "mesh.radar.hint_turn_on": "पीअर ढूँढ़ने के लिए ब्लूटूथ चालू करें",
  "mesh.radar.hint_allow": "पीअर ढूँढ़ने के लिए ब्लूटूथ की अनुमति दें",
  "mesh.radar.hint_allow_settings":
    "पीअर ढूँढ़ने के लिए सेटिंग्स में ब्लूटूथ की अनुमति दें",
  "mesh.radar.hint_location_permission":
    "Android 11 और पुराने को ब्लूटूथ से स्कैन करने के लिए स्थान चाहिए",
  "mesh.radar.hint_android_location":
    "ब्लूटूथ स्कैन के नतीजे देने के लिए Android को स्थान चालू चाहिए",
  "mesh.radar.signal_strong": "मज़बूत",
  "mesh.radar.signal_medium": "मध्यम",
  "mesh.radar.signal_weak": "कमज़ोर",
  "mesh.radar.you_center": "आप, मेश के केंद्र में",
  "mesh.radar.sonar_hint":
    "एक सोनार स्वीप बजाता है। स्कैनिंग तो पहले से लगातार चल रही है।",
  "mesh.radar.paused": "मेश रुका है · आप दूर हैं",
  "mesh.radar.ring_hint": "छल्ले की जगह सिग्नल की मज़बूती दिखाती है, दूरी नहीं",
  "mesh.radar.set_online":
    "पीअर ढूँढ़ने के लिए प्रोफ़ाइल में अपनी स्थिति ऑनलाइन करें",
  "mesh.radar.in_range": "पहुँच में",
  "mesh.radar.recently_seen": "हाल में दिखे",
  "mesh.radar.peer_hint":
    "इस पीअर को संदेश भेजने या भुगतान करने के विकल्प खोलता है",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "अभी-अभी",
  "mesh.peer.none": "आस-पास कोई पीअर नहीं",
  "mesh.peer.none_desc":
    "ब्लूटूथ की पहुँच में मौजूद दूसरे Airhop या bitchat डिवाइस यहाँ दिखते हैं।",
  "mesh.peer.id_copied": "पीअर ID कॉपी हो गई",
  "mesh.peer.copy_id": "पीअर ID कॉपी करें",
  "mesh.peer.their_name": "{name} कहलाते हैं",
  "mesh.peer.in_range": "पहुँच में",
  "mesh.peer.relay": "रिले नोड",
  "mesh.peer.relay_body":
    "किसी ने मेश को फैलाने के लिए एक रेडियो चालू छोड़ रखा है। यह वे संदेश ढोता है जिन्हें पढ़ नहीं सकता। यहाँ संदेश भेजने के लिए कोई नहीं है।",
  "mesh.peer.send_dm": "सीधा संदेश भेजें",
  "mesh.peer.message": "संदेश",
  "mesh.peer.send_sats": "ecash भेजें",
  "mesh.peer.amount_placeholder": "sats में राशि",
  "mesh.peer.amount_first": "ecash भेजें, पहले राशि डालें",
  "mesh.peer.cancel_send": "ecash भेजना रद्द करें",
  "mesh.peer.view_peer": "पीअर {name} देखें",
  "mesh.peer.view_peer_online": "पीअर {name} देखें, ऑनलाइन",
  "mesh.peer.last_seen": "{ago} पहले दिखे",
  "mesh.peer.send_amount": "{amount} sats भेजें",
  "mesh.peer.direct": "सीधा कनेक्शन",
  "mesh.peer.check_distance": "दूरी जाँचें",
  "mesh.peer.checking": "जाँचा जा रहा है",
  "mesh.peer.no_reply": "कोई जवाब नहीं",
  "mesh.peer.no_reply_hint":
    "हो सकता है वे हट गए हों, या उनका ऐप जवाब न देता हो",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "क्षेत्र",
  "mesh.level.province": "प्रांत",
  "mesh.level.city": "शहर",
  "mesh.level.neighborhood": "मोहल्ला",
  "mesh.level.block": "शहरी ब्लॉक",
  "mesh.level.building": "इमारत",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "खर्च करने योग्य",
  "wallet.balance.unit_hint": "सातोशी और बिटकॉइन के बीच बदलता है",
  "wallet.balance.a11y": "बैलेंस {value} {unit}",
  "wallet.balance.locked":
    "वॉलेट भंडारण बंद है। ecash प्रूफ़ एक एन्क्रिप्टेड फ़ाइल में रखे जाते हैं जिसकी कुंजी डिवाइस कीचेन में रहती है, और वह खुल नहीं सकी। अपना डिवाइस अनलॉक करके Airhop दोबारा खोलें।",
  "wallet.balance.tor_blocked":
    "Tor चालू है, इसलिए मिंट अनुरोध रुके हुए हैं: वे खुले नेट पर जाते और आपके IP को आपके प्रूफ़ से जोड़ देते। मेश पर भेजना और लेना अब भी चलता है। सेटिंग्स, सुरक्षा के नीचे मिंट ट्रैफ़िक की अनुमति दें।",
  "wallet.balance.unconfirmed_note": "{amount} अभी मिंट से पुष्ट नहीं",
  "wallet.balance.reserved_note": "{amount} भेजे जा रहे भुगतान के लिए सुरक्षित",
  "wallet.balance.other_mint_note": "{amount} एक अलग मिंट खाते में",
  "wallet.balance.test_mint_note":
    "इसमें एक टेस्ट मिंट का नकली पैसा शामिल है। यह बिटकॉइन नहीं है और भुनाया नहीं जा सकता।",
  "wallet.token": "टोकन",
  "wallet.action.send": "ecash टोकन भेजें",
  "wallet.action.send_disabled": "ecash टोकन भेजें, खाली बैलेंस पर उपलब्ध नहीं",
  "wallet.action.receive": "ecash टोकन लें",
  "wallet.action.zap": "किसी Nostr संपर्क को zap करें",
  "wallet.action.zap_disabled":
    "किसी Nostr संपर्क को zap करें, खाली बैलेंस पर उपलब्ध नहीं",
  "wallet.action.add_mint": "कोई Cashu मिंट जोड़ें",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "टोकन नहीं बन सका",
  "wallet.send.title": "ecash भेजें",
  "wallet.send.amount_in": "{unit} में राशि",
  "wallet.send.body":
    "आपके पास पहले से मौजूद प्रूफ़ से ऑफ़लाइन बना। जब तक आप पुष्टि न करें कि टोकन पहुँच गया, आपके बैलेंस से कुछ भी हमेशा के लिए नहीं जाता।",
  "wallet.send.stale_fee_note":
    "शुल्क आख़िरी बार {days} दिन पहले जाँचे गए थे। अगर इस मिंट ने तब से शुल्क बढ़ाया है, तो भेजने में थोड़ा ज़्यादा लग सकता है।",
  "wallet.send.fee_note":
    "{spend} {unit} आपके बैलेंस से जाते हैं; अतिरिक्त {fee} वह मिंट शुल्क ढकता है जो वरना उन्हें देना पड़ता",
  "wallet.send.qr_too_big":
    "यह टोकन इतने सिक्कों में बँटा है कि QR कोड में नहीं समाता। इसके बजाय साझा या कॉपी करें, या एक साथ करने के लिए मिंट पर रीफ़्रेश करें।",
  "wallet.send.bearer_note":
    "यह स्ट्रिंग जिसके पास है, पैसा उसी का है। प्रूफ़ सुरक्षित रखे हैं, खर्च नहीं हुए: अगर यह किसी तक न पहुँचे तो आप उन्हें लंबित के नीचे वापस ले सकते हैं।",
  "wallet.send.qr_too_big_short":
    "यह टोकन इतने सिक्कों में बँटा है कि QR कोड में नहीं समाता। इसके बजाय साझा या कॉपी करें।",
  "wallet.send.scan_note":
    "उनसे कहें कि अपने वॉलेट से इसे स्कैन करें। जब तक आप पहुँचा हुआ न लिखें, तब तक वापस लिया जा सकता है।",
  "wallet.send.mesh_note":
    "टोकन मेश पर एक एन्क्रिप्टेड DM के रूप में जाता है। इंटरनेट की ज़रूरत नहीं।",
  "wallet.send.no_peers_note":
    "आस-पास के डिवाइस ढूँढ़ने के लिए मेश टैब खोलें, या टोकन किसी और तरीके से साझा करें।",
  "wallet.send.send_to": "{name} को भेजें",
  "wallet.send.memo": "मेमो (वैकल्पिक, टोकन के साथ जाता है)",
  "wallet.send.building": "बनाया जा रहा है…",
  "wallet.send.build": "टोकन बनाएँ",
  "wallet.send.inexact_body":
    "आपके प्रूफ़ ऑफ़लाइन ठीक {amount} {unit} नहीं बना सकते। सबसे छोटा टोकन जो बन सकता है वह {spend} {unit} है, और ऑफ़लाइन बाक़ी लौटाने का रास्ता नहीं: अतिरिक्त {extra} {unit} पाने वाले को चले जाएँगे।\n\nऑनलाइन रहते मिंट पर रीफ़्रेश करने से आपके प्रूफ़ ऐसे मूल्यवर्गों में बँट जाते जो यह रकम ठीक बना देते।",
  "wallet.send.send_amount": "{amount} भेजें",
  "wallet.send.sent_to": "{amount} {unit} {name} को भेजे गए",
  "wallet.send.sent_to_body":
    "{route} जब तक आप पुष्टि न करें कि उन्हें मिल गया, या जब तक मिंट न बताए कि प्रूफ़ भुनाए जा चुके, तब तक यह लंबित के नीचे वापस लिया जा सकता है।",
  "wallet.send.copy_token": "टोकन कॉपी करें",
  "wallet.send.share_token": "टोकन साझा करें",
  "wallet.send.open_in_wallet": "यह टोकन किसी दूसरे वॉलेट में खोलें",
  "wallet.send.open_in_wallet_short": "वॉलेट में खोलें",
  "wallet.send.to_peer": "आस-पास के किसी पीअर को टोकन भेजें",
  "wallet.send.to_peer_short": "पीअर को भेजें",
  "wallet.send.mark_delivered": "पहुँचा हुआ लिखकर पूरा करें",
  "wallet.send.they_got_it": "उन्हें मिल गया",
  "wallet.send.keep_pending": "इस भुगतान को लंबित रखें",
  "wallet.send.decide_later": "बाद में तय करें",
  "wallet.send.no_peers": "पहुँच में कोई पीअर नहीं",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "यह आपका अपना भुगतान है",
  "wallet.receive.own_payment_body":
    "ये सिक्के अब भी एक ऐसे भुगतान के लिए सुरक्षित हैं जिसे आपने निपटाया नहीं, इसलिए दावा करने को कुछ नहीं है। उन्हें सीधे अपने बैलेंस में लौटाने के लिए उस भुगतान पर वापस लें दबाएँ।",
  "wallet.receive.already_have": "पहले से आपके वॉलेट में",
  "wallet.receive.already_have_body":
    "इस टोकन का हर प्रूफ़ पहले से यहाँ रखा है, इसलिए कुछ नहीं जुड़ा। बैलेंस जस का तस है।",
  "wallet.receive.stored_unconfirmed":
    "{mint} से रखा गया, पर अभी मिंट से पुष्ट नहीं ({reason})।",
  "wallet.receive.offline": "ऑफ़लाइन",
  "wallet.receive.redeemed_here":
    "{mint} पर भुनाया गया। ये प्रूफ़ अब सिर्फ़ आपके हैं: भेजने वाले की प्रति अब काम नहीं करती।",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "{mint} पर भुनाया गया। अब यह प्रमाणित रूप से आपका है: भेजने वाले के पास इस टोकन की प्रति अब काम नहीं करती।",
  "wallet.receive.stored_pending":
    "{mint} से रखा गया, पर मिंट ने अभी पुष्टि नहीं की कि यह खर्च नहीं हुआ{dleq}। ऑनलाइन होते ही वॉलेट टैब से रीफ़्रेश करें।",
  "wallet.receive.dleq_inline":
    " (इसका हस्ताक्षर तो सही निकलता है, तो टोकन असली है)",
  "wallet.receive.dleq_ok": "मिंट का हस्ताक्षर सही निकलता है, तो टोकन असली है।",
  "wallet.receive.dleq_uncached":
    "मिंट की कुंजियाँ यहाँ कैश नहीं हैं, इसलिए हस्ताक्षर ऑफ़लाइन जाँचा नहीं जा सका।",
  "wallet.receive.dleq_warning":
    "जब तक आप ऑनलाइन रीफ़्रेश न करें, भेजने वाला सैद्धांतिक रूप से इसे कहीं और खर्च कर चुका हो सकता है।",
  "wallet.receive.failed": "लिया नहीं जा सका",
  "wallet.receive.title": "ecash लें",
  "wallet.receive.body":
    "कोई Cashu टोकन चिपकाएँ। ऑनलाइन होने पर वह तुरंत मिंट पर भुना लिया जाता है; ऑफ़लाइन वह रख लिया जाता है और अगली बार रीफ़्रेश करने पर पुष्ट होता है।",
  "wallet.receive.scan": "कोई ecash QR कोड स्कैन करें",
  "wallet.receive.scan_short": "QR स्कैन करें",
  "wallet.receive.receiving": "लिया जा रहा है…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}… से Nutzap मिला और आपके वॉलेट में भुना लिया गया।",
  "wallet.zap.title": "किसी Nostr पहचान को zap करें",
  "wallet.zap.not_npub": "npub नहीं है",
  "wallet.zap.bad_key": "ग़लत कुंजी",
  "wallet.zap.invalid_pubkey": "अमान्य pubkey",
  "wallet.zap.invalid_pubkey_body":
    "कोई npub1… या 64 अक्षरों की हेक्स Nostr pubkey डालें।",
  "wallet.zap.sent": "Nutzap भेजा गया",
  "wallet.zap.failed": "Zap विफल",
  "wallet.zap.body":
    "अगर वे NIP-61 nutzap जानकारी प्रकाशित करते हैं, तो ecash उनकी कुंजी से बँध जाता है ताकि कोई और उसे खर्च न कर सके, और वह वापस नहीं लिया जा सकता। अगर नहीं, तो वह वापस लिए जा सकने वाले टोकन के रूप में जाता है। आपको बता दिया जाएगा कि क्या हुआ।",
  "wallet.zap.contact": "{name} को zap करें",
  "wallet.zap.pubkey_placeholder": "npub1… या 64 अक्षरों की हेक्स",
  "wallet.zap.sending": "भेजा जा रहा है…",
  "wallet.nostr.copied_body":
    "यह किसी को दें और वे आपको Airhop या किसी भी दूसरे Nostr वॉलेट से zap कर सकते हैं, बिना ब्लूटूथ के।",
  "wallet.nostr.copy_key":
    "अपनी Nostr कुंजी कॉपी करें ताकि लोग आपको zap कर सकें",
  "wallet.nostr.your_key": "आपकी Nostr कुंजी",

  // ---- Wallet: mints ----
  "wallet.mint.added": "मिंट जुड़ गया",
  "wallet.mint.add_failed": "मिंट नहीं जोड़ा जा सका",
  "wallet.mint.added_named": "{name} जोड़ा गया",
  "wallet.mint.added_body":
    "{mint} {units} जारी करता है। इसकी कुंजियाँ इस डिवाइस पर कैश हैं, इसलिए अब इसके टोकन बिना इंटरनेट के भी जाँचे जा सकते हैं।",
  "wallet.mint.remove_plain":
    "{mint} को अपने वॉलेट से हटाएँ? इसकी कैश की गई कुंजियाँ भी जाएँगी, इसलिए इसके टोकन अब ऑफ़लाइन नहीं जाँचे जा सकेंगे।",
  "wallet.mint.title": "मिंट",
  "wallet.mint.none": "अभी कोई मिंट नहीं",
  "wallet.mint.none_desc":
    "मिंट आपका ecash जारी और भुनाता है। Lightning से जमा करने के लिए एक जोड़ें, या बस कोई टोकन लें और उसका मिंट अपने आप जुड़ जाएगा।",
  "wallet.mint.add": "मिंट जोड़ें",
  "wallet.mint.add_body":
    "मिंट आपके ecash के पीछे का Bitcoin रखता है, इसलिए ऐसा चुनें जिस पर आप उतना बैलेंस रखने का भरोसा करें। URL सहेजने से पहले जाँचा जाता है। किसी पर भरोसा न करना हो तो Nutshell से अपना खुद का चलाएँ।",
  "wallet.mint.consolidate_body":
    "एक टोकन कभी एक ही मिंट का नाम ले सकता है, इसलिए कई मिंट में बँटा बैलेंस उससे बड़ी रकम नहीं चुका सकता जितनी सबसे बड़े के पास है। Airhop उसे हिला सकता है: हर दूसरा मिंट आपके चुने हुए मिंट का जारी किया Lightning इनवॉइस चुकाता है। इसमें थोड़ा राउटिंग शुल्क लगता है और इंटरनेट चाहिए।",
  "wallet.mint.add_short": "मिंट जोड़ें",
  "wallet.mint.checking": "जाँचा जा रहा है…",
  "wallet.mint.remove_with_balance": "बैलेंस वाला मिंट हटाएँ?",
  "wallet.mint.remove": "मिंट हटाएँ",
  "wallet.mint.delete_anyway": "फिर भी मिटाएँ",
  "wallet.mint.consolidate": "सारे बैलेंस एक मिंट पर ले जाएँ",
  "wallet.mint.confirm_with": "{mint} से प्रूफ़ पुष्ट करें",
  "wallet.mint.remove_a11y": "{mint} हटाएँ",
  "wallet.mint.available_amount": "{amount} {unit} उपलब्ध",
  "wallet.mint.split_across":
    "बैलेंस {count} मिंट में बँटा है। इसे एक पर ले जाएँ।",
  "wallet.mint.move_everything_to": "सब कुछ {mint} पर ले जाएँ",
  "wallet.mint.consolidate_title": "एक मिंट पर ले जाएँ",
  "wallet.mint.moving": "ले जाया जा रहा है…",
  "wallet.mint.move": "ले जाएँ",
  "wallet.mint.moved": "ले जाया गया",
  "wallet.mint.moved_body":
    "{fees} {unit} Lightning राउटिंग शुल्क के बाद, {amount} {unit} अब {mint} पर है।",
  "wallet.mint.nothing_moved": "कुछ नहीं ले जाया गया",
  "wallet.mint.destination": "· गंतव्य",
  "wallet.mint.will_move": "· ले जाया जाएगा",
  "wallet.mint.issued_by": "जारीकर्ता",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop वॉलेट टॉप-अप",
  "wallet.ln.invoice_failed": "इनवॉइस नहीं बन सका",
  "wallet.ln.price_failed": "इस इनवॉइस की क़ीमत नहीं लगाई जा सकी",
  "wallet.ln.paid": "चुकाया गया",
  "wallet.ln.deposit_credited":
    "इनवॉइस चुकाया गया और {mint} ने {amount} {unit} जारी किए। यह बैलेंस पुष्ट है: आप इसे तुरंत ऑफ़लाइन खर्च कर सकते हैं।",
  "wallet.ln.withdrawn":
    "Lightning पर {paid} sats चुकाए गए। मिंट ने राउटिंग शुल्क में {fee} sats लिए।",
  "wallet.ln.withdrawn_with_change":
    "Lightning पर {paid} sats चुकाए गए। मिंट ने राउटिंग शुल्क में {fee} sats लिए, और आरक्षित राशि में से {change} sats आपके बैलेंस में लौटा दिए।",
  "wallet.ln.payment_failed": "भुगतान विफल",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning sats को ऐसे ecash में बदलें जिसे आप ऑफ़लाइन खर्च कर सकें, या ecash को किसी भी Lightning इनवॉइस पर भुना लें। दोनों के लिए इंटरनेट और एक मिंट चाहिए।",
  "wallet.ln.deposit_body":
    "मिंट आपको एक इनवॉइस देता है। उसे किसी भी Lightning वॉलेट से चुकाएँ और sats ऐसे ecash के रूप में लौट आते हैं जिसे आप ऑफ़लाइन खर्च कर सकते हैं।",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit} का यह इनवॉइस चुकाएँ। वॉलेट भुगतान पर नज़र रखे है और आपका ecash अपने आप जारी कर देगा।",
  "wallet.ln.expired_body":
    "इस इनवॉइस की अवधि खत्म हो गई। अगर आप पहले ही चुका चुके हैं, तो बैलेंस अपने आप जुड़ जाता है।",
  "wallet.ln.waiting_expires": "भुगतान का इंतज़ार · {countdown} में खत्म",
  "wallet.ln.withdraw_body":
    "कोई bolt11 इनवॉइस चिपकाएँ और मिंट उसे आपके ecash से चुका देता है। पहले आपको राउटिंग आरक्षित राशि बताई जाती है; राउटिंग में जो नहीं लगता वह आपके बैलेंस में लौट आता है।",
  "wallet.ln.up_to": "{amount} {unit} तक",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} चुकाएँ",
  "wallet.ln.deposit": "Lightning से sats जमा करें",
  "wallet.ln.deposit_short": "जमा करें",
  "wallet.ln.withdraw": "किसी Lightning इनवॉइस पर निकालें",
  "wallet.ln.withdraw_short": "निकालें",
  "wallet.ln.deposit_title": "Lightning से जमा करें",
  "wallet.ln.amount_placeholder": "sats में राशि",
  "wallet.ln.requesting": "माँगा जा रहा है…",
  "wallet.ln.get_invoice": "इनवॉइस लें",
  "wallet.ln.copy_invoice": "इनवॉइस कॉपी करें",
  "wallet.ln.open_wallet": "किसी Lightning वॉलेट में खोलें",
  "wallet.ln.open_wallet_short": "वॉलेट में खोलें",
  "wallet.ln.waiting": "भुगतान का इंतज़ार…",
  "wallet.ln.new_invoice": "नया इनवॉइस बनाएँ",
  "wallet.ln.new_invoice_short": "नया इनवॉइस",
  "wallet.ln.withdraw_title": "Lightning पर निकालें",
  "wallet.ln.scan_invoice": "कोई Lightning इनवॉइस QR कोड स्कैन करें",
  "wallet.ln.paid_from": "यहाँ से चुकाया",
  "wallet.ln.invoice": "इनवॉइस",
  "wallet.ln.routing_reserve": "राउटिंग आरक्षित",
  "wallet.ln.reserved": "बैलेंस से आरक्षित",
  "wallet.ln.paying": "चुकाया जा रहा है…",
  "wallet.ln.get_quote": "अनुमान लें",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "बैकअप",
  "wallet.backup.setup_failed": "बैकअप सेट नहीं हो सका",
  "wallet.backup.on": "बैकअप चालू",
  "wallet.backup.on_body":
    "आपका बैलेंस अब उन बारह शब्दों से दोबारा बनाया जा सकता है।\n\nजो कुछ आपको किसी और ने दिया है वह तब तक इस वाक्यांश के बाहर रहता है जब तक आप मिंट पर रीफ़्रेश न करें, और रिकवरी के लिए आपकी मिंट सूची चाहिए, इसलिए उसे शब्दों के साथ लिख रखें।",
  "wallet.backup.no_phrase": "कोई वाक्यांश संग्रहित नहीं",
  "wallet.backup.no_phrase_body":
    "रिकवरी वाक्यांश डिवाइस कीचेन से पढ़ा नहीं जा सका। डिवाइस अनलॉक करके फिर कोशिश करें।",
  "wallet.backup.replace_title": "अपना मौजूदा वाक्यांश बदलें?",
  "wallet.backup.replace_body":
    "आपके पास पहले से एक रिकवरी वाक्यांश है। कोई दूसरा बहाल करने पर वह उसकी जगह ले लेगा। पुराने वाक्यांश से ढके सिक्के इस डिवाइस पर खर्च करने योग्य बने रहते हैं, पर वे बहाल किए जाने योग्य नहीं रहते, इसलिए आगे बढ़ने से पहले पक्का करें कि पुराने शब्द लिखे हुए हैं।",
  "wallet.backup.replace": "बदलें",
  "wallet.backup.invalid_phrase": "वह वाक्यांश मान्य नहीं है",
  "wallet.backup.invalid_phrase_body":
    "वाक्यांश में एक अंतर्निहित चेकसम होता है और यह उस पर खरा नहीं उतरता। कोई ग़लत टाइप हुआ, छूटा या अदल-बदल हुआ शब्द देखें।",
  "wallet.backup.not_bip39": "ये BIP-39 शब्द नहीं हैं: {words}। वर्तनी जाँचें।",
  "wallet.backup.add_mint_first": "पहले एक मिंट जोड़ें",
  "wallet.backup.add_mint_first_body":
    "रिकवरी किसी मिंट से पूछकर चलती है कि उसने आपके लिए कौन-से सिक्के हस्ताक्षरित किए, इसलिए उसे पता होना चाहिए कि किससे पूछना है। जिन मिंट का आप इस्तेमाल कर रहे थे उन्हें जोड़ें, फिर बहाल करें।",
  "wallet.backup.restore_failed": "बहाली विफल",
  "wallet.backup.phrase": "रिकवरी वाक्यांश",
  "wallet.backup.state_unconfirmed": "बैकअप चालू पर पुष्ट नहीं",
  "wallet.backup.state_off": "बैकअप बंद",
  "wallet.backup.badge_on": "चालू",
  "wallet.backup.badge_unconfirmed": "अपुष्ट",
  "wallet.backup.badge_off": "बंद",
  "wallet.backup.view": "रिकवरी वाक्यांश देखें",
  "wallet.backup.setup": "रिकवरी वाक्यांश सेट करें",
  "wallet.backup.view_short": "वाक्यांश देखें",
  "wallet.backup.setup_short": "सेट करें",
  "wallet.backup.restore": "किसी रिकवरी वाक्यांश से वॉलेट बहाल करें",
  "wallet.backup.restore_short": "बहाल करें",
  "wallet.backup.setup_title": "रिकवरी वाक्यांश सेट करें",
  "wallet.backup.on_body_short":
    "आपका बैलेंस आपके बारह शब्दों से किसी नए डिवाइस पर दोबारा बनाया जा सकता है।",
  "wallet.backup.unconfirmed_body":
    "आपने कभी पुष्टि नहीं की कि लिखी हुई प्रति है। अभी ये शब्द सिर्फ़ इसी फ़ोन पर हैं, और बैकअप का काम तो ठीक इसी के जाने पर बचना है। वाक्यांश देखें और उसे लिख लें।",
  "wallet.backup.not_covered":
    "{amount} अभी ढका नहीं है। जो सिक्के आपको दिए गए वे भेजने वाले के रहस्य साथ लाते हैं, इसलिए वे आपके वाक्यांश के दायरे में तभी आते हैं जब उनकी अदला-बदली हो जाए। उन्हें सुरक्षित करने के लिए कोई मिंट रीफ़्रेश करें।",
  "wallet.backup.off_body":
    "आपका ecash सिर्फ़ इसी फ़ोन पर मौजूद है। अगर आप इसे खो दें, तो पैसा कोई वापस नहीं ला सकता, आप भी नहीं। रिकवरी वाक्यांश बारह शब्दों का होता है जो आपका बैलेंस कहीं भी दोबारा बना सकता है।",
  "wallet.backup.about_to_see": "आप बारह शब्द देखने वाले हैं। वही पैसा हैं।",
  "wallet.backup.exact_order":
    "बारह शब्द, ठीक इसी क्रम में। जिसके पास ये हैं, उसके पास आपका बैलेंस है।",
  "wallet.backup.verify_body":
    "जिस वाक्यांश को किसी ने लिखा नहीं, वह न होने से भी बुरा है, क्योंकि वह ऐसी सुरक्षा जाल लगता है जो है ही नहीं। पुष्टि के लिए दो शब्द।",
  "wallet.backup.verify_mismatch":
    "यह मेल नहीं खाता। अपनी लिखी हुई प्रति जाँचें।",
  "wallet.backup.restore_body":
    "बारह शब्द डालें। Airhop आपके सिक्के दोबारा निकालता है और हर मिंट से पूछता है कि उसने उनमें से कौन-से हस्ताक्षरित किए, ताकि बैलेंस मिंट के रखे रिकॉर्ड से वापस आ जाए।",
  "wallet.backup.warn_secret":
    "जो भी इन्हें पढ़ ले, वह आपका बैलेंस ले जा सकता है। इनका स्क्रीनशॉट न लें और इन्हें इस फ़ोन पर न रखें।",
  "wallet.backup.warn_paper":
    "इन्हें काग़ज़ पर लिखें और कहीं सुरक्षित रखें। फ़ोन चला गया तो Airhop इन्हें आपको दोबारा नहीं दिखा सकता।",
  "wallet.backup.warn_scope":
    "ये सिर्फ़ आपका ecash दोबारा बनाते हैं। आपकी पहचान, चैट और संपर्क इनके दायरे में नहीं हैं।",
  "wallet.backup.warn_mints":
    "रिकवरी को किसी मिंट से पूछना पड़ता है कि उसने कौन-से सिक्के हस्ताक्षरित किए, इसलिए अपनी मिंट सूची शब्दों के साथ लिख लें।",
  "wallet.backup.preparing": "तैयार किया जा रहा है…",
  "wallet.backup.show_phrase": "मेरा वाक्यांश दिखाएँ",
  "wallet.backup.your_phrase": "आपका रिकवरी वाक्यांश",
  "wallet.backup.write_down": "इन्हें लिख लें",
  "wallet.backup.copy_phrase": "रिकवरी वाक्यांश क्लिपबोर्ड पर कॉपी करें",
  "wallet.backup.copy_clipboard": "क्लिपबोर्ड पर कॉपी करें",
  "wallet.backup.written_down": "मैंने इन्हें लिख लिया है",
  "wallet.backup.check_copy": "अपनी प्रति जाँचें",
  "wallet.backup.confirm": "पुष्टि करें",
  "wallet.backup.restore_title": "वाक्यांश से बहाल करें",
  "wallet.backup.phrase_placeholder": "बारह शब्द, बीच में जगह छोड़कर",
  "wallet.backup.no_mints_yet":
    "अभी कोई मिंट नहीं जोड़ा गया। रिकवरी को किसी ख़ास मिंट से पूछना पड़ता है, इसलिए पहले वे जोड़ें जिनका आप इस्तेमाल कर रहे थे।",
  "wallet.backup.scanning": "खोजा जा रहा है…",
  "wallet.backup.restore_progress": "{mint} · {total} में से कीसेट {step}",
  "wallet.backup.will_scan":
    "खोजे जाएँगे: {mints}। जो मिंट आपने नहीं जोड़ा उससे कभी नहीं पूछा जाता, इसलिए वहाँ का बैलेंस अनदेखा रह जाता है।",
  "wallet.backup.word_n": "शब्द {position}",
  "wallet.backup.unreachable_mints":
    "इन तक नहीं पहुँच सके: {mints}। वहाँ का बैलेंस अब भी मौजूद है। बेहतर कनेक्शन मिलने पर फिर कोशिश करें।",
  "wallet.backup.nothing_recovered": "खोजे गए मिंट से कुछ भी वापस नहीं मिला।",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "मिला हुआ लिखें?",
  "wallet.delivered.body":
    "इससे {amount} {unit} हमेशा के लिए छूट जाते हैं। अगर वह सचमुच कभी पहुँचा ही नहीं, तो आप उसे वापस नहीं ले पाएँगे।",
  "wallet.delivered.body_generic":
    "इससे आरक्षित राशि हमेशा के लिए छूट जाती है। अगर वह सचमुच कभी पहुँची ही नहीं, तो आप उसे वापस नहीं ले पाएँगे।",
  "wallet.delivered.cancel": "अभी नहीं",
  "wallet.delivered.confirm": "उन्हें मिल गया",
  "wallet.reclaim.title": "यह टोकन वापस लें?",
  "wallet.reclaim.body":
    "{amount} {unit} आपके बैलेंस में लौट जाते हैं। ऐसा तभी करें जब टोकन किसी तक पहुँचा ही न हो: अगर स्ट्रिंग उनके पास पहले से है, तो जो भी मिंट पर उसे पहले भुनाएगा पैसा उसी का रहेगा, और वह वे भी हो सकते हैं।",
  "wallet.reclaim.keep": "लंबित रखें",
  "wallet.reclaim.confirm": "वापस लें",
  "wallet.copied.token_body":
    "टोकन आपके क्लिपबोर्ड पर है। जब तक आप उसे पहुँचा हुआ न लिखें, वह यहाँ आरक्षित रहता है, इसलिए पहली कोशिश विफल हो तो आप उसे दोबारा चिपका सकते हैं।",
  "wallet.copied.phrase_body":
    "इसे किसी पासवर्ड मैनेजर में चिपकाएँ, फिर अपना क्लिपबोर्ड साफ़ करें। दूसरे ऐप क्लिपबोर्ड पढ़ सकते हैं, और कुछ सेटअप में यह आपके दूसरे डिवाइस पर सिंक हो जाता है।",
  "wallet.refresh.failed": "रीफ़्रेश विफल",
  "wallet.refresh.partly": "आंशिक रूप से रीफ़्रेश",
  "wallet.refresh.done": "रीफ़्रेश हो गया",
  "wallet.refresh.unreachable":
    "{mints} तक नहीं पहुँच सके। बाक़ी सब अद्यतन है।",
  "wallet.refresh.swapped":
    "{amount} {unit} पुष्ट हुए और नए प्रूफ़ से बदल दिए गए।",
  "wallet.refresh.secured":
    "{amount} {unit} अब आपके रिकवरी वाक्यांश के दायरे में है।",
  "wallet.refresh.all_confirmed": "यहाँ सब कुछ पहले से मिंट से पुष्ट था।",
  "wallet.pending.title": "लंबित",
  "wallet.pending.reserved_desc":
    "बना और आरक्षित, पहुँचना अपुष्ट। प्रूफ़ आपके बैलेंस से बाहर रखे गए हैं ताकि वे दो बार खर्च न हो सकें।",
  "wallet.pending.locked_desc":
    "पहले ही पाने वाले की कुंजी से बँधा है, इसलिए सिर्फ़ वही इसे खर्च कर सकते हैं। बस यह उन तक अभी पहुँचा नहीं। पूरा करने के लिए टोकन साझा करें।",
  "wallet.pending.show_qr": "यह टोकन QR कोड के रूप में दिखाएँ",
  "wallet.pending.copy_again": "टोकन दोबारा कॉपी करें",
  "wallet.pending.share_again": "टोकन दोबारा साझा करें",
  "wallet.pending.mark_delivered": "इस टोकन को पहुँचा हुआ लिखें",
  "wallet.pending.delivered": "पहुँच गया",
  "wallet.pending.reclaim_into": "यह टोकन अपने बैलेंस में वापस लें",
  "wallet.activity.title": "गतिविधि",
  "wallet.activity.none": "अभी कुछ नहीं",
  "wallet.activity.none_desc":
    "आपके भेजे और लिए गए भुगतान यहाँ दिखते हैं, सबसे नए पहले, हर एक के मिंट और शुल्क के साथ।",
  "wallet.activity.show_fewer": "कम भुगतान दिखाएँ",
  "wallet.activity.show_less": "कम दिखाएँ",
  "wallet.activity.received_unconfirmed": "मिला, अपुष्ट",
  "wallet.activity.received": "मिला",
  "wallet.activity.receive_failed": "लेना विफल",
  "wallet.activity.reclaimed": "वापस लिया",
  "wallet.activity.send_failed": "भेजना विफल",
  "wallet.activity.sent": "भेजा",
  "wallet.activity.status_pending": "लंबित",
  "wallet.activity.status_failed": "विफल",
  "wallet.activity.status_reclaimed": "वापस लिया",
  "wallet.activity.status_expired": "अवधि खत्म",
  "wallet.activity.ln_deposit": "Lightning जमा",
  "wallet.activity.ln_withdrawal": "Lightning निकासी",
  "wallet.activity.nutzap_received": "Nutzap मिला",
  "wallet.activity.spent_removed": "खर्च हुए प्रूफ़ हटाए गए",
  "wallet.activity.refreshed": "प्रूफ़ रीफ़्रेश हुए",
  "wallet.activity.refreshing": "प्रूफ़ रीफ़्रेश हो रहे हैं",
  "wallet.activity.just_now": "अभी-अभी",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "मेश ऑफ़लाइन",
  "wallet.mesh_offline_body":
    "मेश सेवा चल नहीं रही, इसलिए टोकन सौंपने को कुछ है ही नहीं। यह लंबित के नीचे आरक्षित रहता है।",
  "wallet.xfer.route_mesh": "मेश पर सीधे उनके डिवाइस को सौंपा गया।",
  "wallet.xfer.route_nostr":
    "वे ब्लूटूथ की पहुँच से बाहर थे, इसलिए यह इंटरनेट से गया।",
  "wallet.xfer.route_courier":
    "अभी उन तक कोई रास्ता नहीं। इसे दूसरे डिवाइस ढोएँगे और जब कोई उन तक पहुँचेगा तब पहुँचा देंगे।",
  "wallet.xfer.route_queued":
    "वे अभी पहुँच में नहीं हैं। यह क़तार में है और जैसे ही वे आएँगे भेज दिया जाएगा।",
  "wallet.xfer.mesh_offline_body":
    "मेश सेवा चल नहीं रही, इसलिए टोकन सौंपने का कोई रास्ता नहीं। कुछ भी नहीं काटा गया।",
  "wallet.xfer.could_not_send": "भेजा नहीं जा सका",
  "wallet.xfer.inexact_body":
    "आपके प्रूफ़ ऑफ़लाइन ठीक {amount} {unit} नहीं बना सकते। सबसे छोटा टोकन जो बन सकता है वह {spend} {unit} है, और अतिरिक्त {extra} {unit} उन्हें चले जाएँगे, जिन्हें वापस पाने का रास्ता नहीं।\n\nऑनलाइन रहते मिंट पर रीफ़्रेश करने से आपके प्रूफ़ ऐसे मूल्यवर्गों में बँट जाते हैं जो यह रकम ठीक बना देते हैं।",
  "wallet.xfer.send_amount": "{amount} भेजें",
  "wallet.xfer.mesh_offline": "मेश ऑफ़लाइन",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "उनकी कुंजी से बँधा और Nostr पर प्रकाशित। वे ऑनलाइन हों या न हों, यह उन्हीं का है।",
  "wallet.pay.rail_nutzap_dm":
    "उनकी कुंजी से बँधा। रिले ने इसे नहीं लिया, इसलिए यह उन्हें एक संदेश के रूप में गया।",
  "wallet.pay.rail_nutzap_undelivered":
    "उनकी कुंजी से बँधा, पर अभी इसे कोई ढो नहीं सका। यह क़तार में है, और टोकन लंबित के नीचे है।",
  "wallet.pay.final":
    "बँधे हुए भुगतान वापस नहीं लिए जा सकते: अब ये सिक्के सिर्फ़ उनकी कुंजी ही खर्च कर सकती है।",
  "wallet.pay.reclaimable":
    "जब तक आप पुष्टि न करें कि यह पहुँच गया, तब तक इसे वॉलेट टैब से वापस लिया जा सकता है।",
  "wallet.pay.why": "इस तरह भेजा गया क्योंकि {reason}।",
  "wallet.pay.sent_title": "{name} को {amount} {unit}",
  "wallet.pay.thread_receipt":
    "आपने {amount} {unit} भेजे, उनकी कुंजी से बँधे हुए।",
  "wallet.pay.title": "ecash भेजें",
  "wallet.pay.to": "{name} को",
  "wallet.pay.amount": "sats में राशि",
  "wallet.pay.memo": "टिप्पणी (वैकल्पिक, सार्वजनिक)",
  "wallet.pay.send": "भेजें",
  "wallet.pay.sending": "भेजा जा रहा है…",
  "wallet.pay.action": "ecash भेजें",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "कैमरा पहुँच",
  "wallet.scan.camera_purpose": "कोई ecash QR कोड स्कैन करने",
  "wallet.scan.photo_label": "फ़ोटो पहुँच",
  "wallet.scan.photo_purpose": "किसी छवि से ecash QR पढ़ने",
  "wallet.scan.no_token": "उस छवि में कोई ecash टोकन नहीं मिला।",
  "wallet.scan.no_invoice": "उस छवि में कोई Lightning इनवॉइस नहीं मिला।",
  "wallet.scan.unreadable": "वह छवि पढ़ी नहीं जा सकी।",
  "wallet.scan.camera_failed":
    "कैमरा शुरू नहीं हो सका। दूसरे कैमरा ऐप बंद करके फिर कोशिश करें।",
  "wallet.scan.close": "स्कैनर बंद करें",
  "wallet.scan.on_device":
    "इसे इसी डिवाइस पर पढ़ा जाता है; कुछ भी कहीं नहीं भेजा जाता।",
  "wallet.scan.aim_token": "किसी ecash QR कोड पर निशाना लगाएँ।",
  "wallet.scan.aim_invoice": "किसी Lightning इनवॉइस QR कोड पर निशाना लगाएँ।",
  "wallet.scan.title_token": "ecash स्कैन करें",
  "wallet.scan.title_invoice": "इनवॉइस स्कैन करें",
  "wallet.scan.desc_token":
    "किसी दूसरे वॉलेट से Cashu टोकन पढ़ें। यह किसी भी Cashu वॉलेट के साथ चलता है, सिर्फ़ Airhop के साथ नहीं।",
  "wallet.scan.desc_invoice":
    "अपने बैलेंस से चुकाने के लिए कोई Lightning इनवॉइस पढ़ें।",
  "wallet.scan.use_camera_a11y": "कैमरे से स्कैन करें",
  "wallet.scan.use_camera": "कैमरा इस्तेमाल करें",
  "wallet.scan.pick_image_a11y": "किसी सहेजी हुई छवि से QR कोड पढ़ें",
  "wallet.scan.pick_image": "फ़ोटो में से चुनें",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu क्या है?",
  "wallet.explain.intro":
    "Cashu, Bitcoin के लिए ecash है। टोकन एक स्ट्रिंग है जो उसे रखने वाले के लिए पैसे के बराबर है, जिस पर मिंट ने आँख मूँदकर हस्ताक्षर किए हैं ताकि मिंट बता न सके कि किसने क्या खर्च किया। न खाते, न लॉगिन।",
  "wallet.explain.send": "भेजें",
  "wallet.explain.send_desc":
    "किसी रकम को ऐसे टोकन में बदलता है जिसे आप ब्लूटूथ पर आस-पास के पीअर को सौंप सकते हैं, या टेक्स्ट के रूप में साझा कर सकते हैं। बिना इंटरनेट चलता है। जब तक आप पुष्टि न करें कि वह पहुँच गया, प्रूफ़ आरक्षित रहते हैं।",
  "wallet.explain.receive": "लें",
  "wallet.explain.receive_desc":
    "जोड़ने के लिए कोई टोकन चिपकाएँ। ऑनलाइन होने पर वह तुरंत मिंट पर बदल दिया जाता है, जिससे वह प्रमाणित रूप से आपका हो जाता है। ऑफ़लाइन वह रख लिया जाता है और रीफ़्रेश करने तक अपुष्ट लिखा रहता है।",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "किसी Nostr पहचान को भुगतान करता है। अगर वे NIP-61 nutzap जानकारी प्रकाशित करते हैं, तो ecash उनकी कुंजी से बँध जाता है ताकि सिर्फ़ वही उसे खर्च कर सकें। वरना यह एक एन्क्रिप्टेड DM पर लौट आता है। इंटरनेट चाहिए।",
  "wallet.explain.add_mint": "मिंट जोड़ें",
  "wallet.explain.add_mint_desc":
    "उस मिंट को सहेजता है जो आपका ecash जारी और भुनाता है, और उसकी सार्वजनिक कुंजियाँ कैश कर लेता है ताकि उसके टोकन ऑफ़लाइन जाँचे जा सकें। ऐसा मिंट चुनें जिस पर आप वहाँ रखे बैलेंस का भरोसा करें।",
  "wallet.explain.phrase": "रिकवरी वाक्यांश",
  "wallet.explain.phrase_desc":
    "आपके सिक्के उन बारह शब्दों से निकाले जाते हैं जो वॉलेट शुरू में बनाता है, इसलिए कोई नया फ़ोन आपके मिंट से पूछकर बैलेंस दोबारा बना सकता है कि उन्होंने कौन-से सिक्के हस्ताक्षरित किए। जब तक आप उन्हें देखकर लिख न लें, वे सिर्फ़ इसी फ़ोन पर मौजूद हैं।",

  // ---- Wallet: failures ----
  "wallet.err.locked": "वॉलेट बंद",
  "wallet.err.mint_unreachable": "मिंट तक पहुँच नहीं",
  "wallet.err.tor_blocked": "Tor चालू रहते रुका है",
  "wallet.err.insufficient": "बैलेंस पूरा नहीं",
  "wallet.err.exact_amount": "ठीक उतनी रकम नहीं भेजी जा सकती",
  "wallet.err.no_mint": "कोई मिंट नहीं",
  "wallet.err.mint_unsupported": "मिंट यह नहीं कर सकता",
  "wallet.err.mint_refused": "मिंट ने मना किया",
  "wallet.err.unreadable": "अपठनीय टोकन",
  "wallet.err.rejected": "टोकन अस्वीकृत",
  "wallet.err.already_spent": "पहले ही खर्च हो चुका",
  "wallet.err.change_pending": "चुकाया गया, बाक़ी लंबित",
  "wallet.svc.mint_unreachable": "मिंट तक नहीं पहुँच सके।",
  "wallet.svc.tor_ios": "iOS पर मिंट अनुरोध Tor से नहीं जाते।",
  "wallet.svc.tor_ios_body":
    "Arti सिर्फ़ Nostr WebSocket को लपेटता है, इसलिए यह अनुरोध खुले नेट से मिंट तक पहुँचता और आपके IP को इन प्रूफ़ से जोड़ देता। सेटिंग्स > सुरक्षा के नीचे इसकी अनुमति दें, या पहले Tor बंद करें। मेश पर ecash भेजना और लेना अब भी चलता है।",
  "wallet.svc.tor_paused": "Tor चालू है पर जुड़ा नहीं है।",
  "wallet.svc.tor_paused_body":
    "Orbot ने रूटिंग बंद कर दी है, इसलिए यह अनुरोध खुले नेट से मिंट तक पहुँचता और आपके IP को इन प्रूफ़ से जोड़ देता। Orbot फिर से चालू करें, या Tor बंद करें। मेश पर ecash भेजना और लेना अब भी चलता है।",
  "wallet.svc.keys_uncached": "इस मिंट की कुंजियाँ इस डिवाइस पर कैश नहीं हैं।",
  "wallet.svc.keys_uncached_body":
    "उन्हें लाने के लिए ऑनलाइन रहते वॉलेट एक बार खोलें।",
  "wallet.svc.phrase_invalid": "वह रिकवरी वाक्यांश मान्य नहीं है।",
  "wallet.svc.phrase_invalid_body":
    "कोई ग़लत टाइप हुआ या छूटा शब्द देखें। वाक्यांश में एक अंतर्निहित चेकसम होता है, इसलिए एक भी ग़लत शब्द पूरे को अमान्य कर देता है।",
  "wallet.svc.need_mint": "पहले कम से कम एक मिंट जोड़ें।",
  "wallet.svc.need_mint_body":
    "रिकवरी किसी मिंट से पूछकर चलती है कि उसने आपके लिए कौन-से सिक्के हस्ताक्षरित किए, इसलिए उसे पता होना चाहिए कि किससे पूछना है।",
  "wallet.svc.restored": "रिकवरी वाक्यांश से बहाल किया गया",
  "wallet.svc.storage_locked": "वॉलेट भंडारण बंद है।",
  "wallet.svc.storage_locked_body":
    "Airhop, ecash प्रूफ़ एक एन्क्रिप्टेड फ़ाइल में रखता है जिसकी कुंजी डिवाइस कीचेन में रहती है। डिवाइस अनलॉक करके ऐप दोबारा खोलें।",
  "wallet.svc.bad_url": "यह मान्य URL नहीं है।",
  "wallet.svc.needs_https": "मिंट URL https:// से शुरू होना चाहिए।",
  "wallet.svc.refuse_http":
    "सादे http पर मिंट इस्तेमाल करने से मना किया जा रहा है।",
  "wallet.svc.refuse_http_body":
    "नेटवर्क के रास्ते में कोई भी आपके प्रूफ़ पढ़ या बदल सकता है। कोई https:// मिंट इस्तेमाल करें।",
  "wallet.svc.mint_not_saved": "मिंट सहेजा नहीं जा सका।",
  "wallet.svc.unreadable_token": "यह पढ़ा जा सकने वाला Cashu टोकन नहीं है।",
  "wallet.svc.unreadable_token_body":
    "टोकन cashuA या cashuB से शुरू होते हैं। जाँचें कि कॉपी करते समय कुछ कटा तो नहीं।",
  "wallet.svc.wrong_mint":
    "इस टोकन पर उस मिंट ने हस्ताक्षर नहीं किए जिसका यह नाम लेता है।",
  "wallet.svc.already_spent": "ये प्रूफ़ पहले ही खर्च हो चुके हैं।",
  "wallet.svc.already_spent_body":
    "जिसने यह टोकन भेजा उसने पहले ही इसे भुना लिया, या वही टोकन किसी और को भी भेज दिया।",
  "wallet.svc.receiving_offline": "ऑफ़लाइन लिया जा रहा है",
  "wallet.svc.amount_positive": "शून्य से बड़ी रकम डालें।",
  "wallet.svc.coins_raced":
    "वे सिक्के अभी-अभी किसी दूसरे भुगतान में इस्तेमाल हो गए।",
  "wallet.svc.coins_raced_body":
    "कुछ भी नहीं काटा गया। फिर कोशिश करें और वॉलेट कोई दूसरा सेट चुन लेगा।",
  "wallet.svc.no_ecash": "अभी कोई ecash नहीं।",
  "wallet.svc.no_ecash_body":
    "कोई मिंट जोड़कर Lightning से जमा करें, या किसी से टोकन लें।",
  "wallet.svc.split_across_mints": "आपका बैलेंस कई मिंट में बँटा है।",
  "wallet.svc.mint_says_spent": "मिंट ने इन प्रूफ़ को पहले ही खर्च हुआ बताया।",
  "wallet.svc.issue_against_invoice":
    "किसी Lightning इनवॉइस के बदले ecash जारी करना",
  "wallet.svc.pay_invoice": "कोई Lightning इनवॉइस चुकाना",
  "wallet.svc.unknown_deposit": "अनजान जमा।",
  "wallet.svc.invoice_expired_before":
    "इनवॉइस चुकाए जाने से पहले ही उसकी अवधि खत्म हो गई।",
  "wallet.svc.invoice_expired": "उस इनवॉइस की अवधि खत्म हो गई।",
  "wallet.svc.invoice_unpaid": "इनवॉइस अभी चुकाया नहीं गया है।",
  "wallet.svc.payment_unknown":
    "भुगतान की स्थिति अज्ञात; अगली रीफ़्रेश पर दोबारा जाँची गई।",
  "wallet.svc.melt_change_pending": "आपका इनवॉइस चुका दिया गया।",
  "wallet.svc.melt_change_pending_body":
    "मिंट ने बिना इस्तेमाल हुआ राउटिंग शुल्क अभी नहीं लौटाया। अगली रीफ़्रेश पर वह अपने आप ले लिया जाता है, और इस बीच कुछ भी नहीं खोता।",
  "wallet.svc.mint_did_not_pay":
    "मिंट ने यह इनवॉइस नहीं चुकाया। आपका बैलेंस जस का तस है।",
  "wallet.svc.not_an_invoice": "यह Lightning इनवॉइस नहीं है।",
  "wallet.svc.not_an_invoice_body":
    "lnbc से शुरू होने वाला कोई bolt11 इनवॉइस चिपकाएँ।",
  "wallet.svc.insufficient_for_invoice": "इस इनवॉइस के लिए बैलेंस पूरा नहीं।",
  "wallet.svc.coins_raced_invoice_body":
    "कुछ भी नहीं काटा गया और इनवॉइस नहीं चुकाया गया। फिर कोशिश करें।",
  "wallet.svc.same_mint": "कोई दूसरा गंतव्य मिंट चुनें।",
  "wallet.svc.same_mint_body":
    "स्रोत और गंतव्य एक ही मिंट हैं, इसलिए ले जाने को कुछ नहीं है।",
  "wallet.svc.quote_failed_retried": "अनुमान विफल, एक जगह लाना फिर आज़माया गया",
  "wallet.svc.amount_unfit_retried":
    "रकम बैठी नहीं, एक जगह लाना फिर आज़माया गया",
  "wallet.svc.cannot_size": "इस स्थानांतरण का आकार तय नहीं हो सका।",
  "wallet.svc.insufficient_at_mint": "{mint} पर बैलेंस पूरा नहीं।",
  "wallet.svc.inexact_title":
    "आपके प्रूफ़ ऑफ़लाइन ठीक {amount} {unit} नहीं बना सकते।",
  "wallet.svc.inexact_detail":
    "सबसे छोटा टोकन जो आप भेज सकते हैं वह {spend} {unit} है। ऑफ़लाइन बाक़ी नहीं लौटता, इसलिए अतिरिक्त {extra} {unit} पाने वाले को चले जाते हैं।",
  "wallet.svc.no_single_mint":
    "किसी एक मिंट के पास {amount} {unit} नहीं है। अलग-अलग मिंट का ecash एक टोकन में नहीं मिलाया जा सकता: पहले किसी एक मिंट पर इकट्ठा करें, या अलग-अलग रकम में भेजें।",
  "wallet.svc.have_tried_send":
    "आपके पास {total} {unit} हैं, और आपने {amount} भेजने की कोशिश की।",
  "wallet.svc.invoice_needs":
    "राउटिंग आरक्षित सहित इस इनवॉइस को {total} {unit} चाहिए, और आपके पास {balance} हैं।",
  "wallet.svc.nothing_to_move": "{mint} के पास ले जाने को कोई {unit} नहीं।",
  "wallet.svc.consolidate_memo": "{mint} से इकट्ठा करना",
  "wallet.svc.cannot_size_detail":
    "Lightning राउटिंग शुल्क के बाद {from} से {to} पर काम की रकम नहीं ले जाई जा सकती। इसके बजाय कोई तय छोटी रकम ले जाकर देखें।",
  "wallet.svc.mint_cannot": "{mint} {action} नहीं कर सकता।",
  "wallet.svc.no_nut": "मिंट NUT-{nut} की घोषणा नहीं करता।",
  "wallet.svc.unknown_mint":
    "वह भुगतान ऐसे मिंट का नाम लेता है जिसे आप इस्तेमाल नहीं करते।",
  "wallet.svc.unknown_mint_body":
    "भरोसा हो तो पहले खुद वह मिंट जोड़ें; जिस मिंट को आपने चुना नहीं, उससे कुछ भी नहीं भुनाया जाता।",
  "wallet.svc.no_relay": "कोई रिले कनेक्शन नहीं",
  "wallet.svc.no_shared_mint": "पर्याप्त बैलेंस वाला कोई साझा मिंट नहीं",
  "wallet.svc.no_nutzap_info":
    "पाने वाले ने nutzap जानकारी प्रकाशित नहीं की (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "उनकी कुंजी से बँधा पर अभी पहुँचा नहीं। इसे पूरा करने के लिए इस लेनदेन से टोकन साझा करें।",
  "wallet.svc.swap_lost":
    "मिंट ने यह अदला-बदली कभी पूरी नहीं की, इसलिए इसके बदले कुछ जारी नहीं हुआ।",
  "wallet.svc.swap_unreadable":
    "यह अदला-बदली ऐसे रूप में सहेजी गई थी जिसे यह संस्करण दोबारा नहीं चला सकता।",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR से सत्यापित",
  "contacts.qr.keys_unverified": "कुंजियाँ मिलीं, सत्यापित नहीं",
  "contacts.qr.not_verified": "अभी सत्यापित नहीं",
  "contacts.qr.message": "संदेश",
  "contacts.qr.add": "संपर्क जोड़ें",
  "contacts.qr.scan_title": "QR कोड स्कैन करें",
  "contacts.qr.aim": "अपना कैमरा उनके QR कोड पर रखें",
  "contacts.qr.add_desc": "ऐसे व्यक्ति तक पहुँचें जो मेश पर आस-पास नहीं है।",
  "contacts.qr.peer_id_hint":
    "पीअर ID 16 अक्षरों की होती है। संपर्क कोड airhop: से शुरू होता है।",
  "contacts.qr.or_scan": "या उनका QR स्कैन करें",
  "contacts.qr.trust_note":
    "सिर्फ़ वही QR उनकी कुंजी सत्यापित करता है जिसे आप अपने कैमरे से स्कैन करते हैं। चिपकाया गया कोड उनकी कुंजियाँ तो लाता है, पर यह सबूत नहीं कि वह उन्हीं से आया।",
  "contacts.qr.peer_id": "पीअर ID या संपर्क कोड",
  "contacts.qr.peer_id_placeholder": "कोई ID या संपर्क कोड चिपकाएँ",
  "contacts.qr.scan_camera_a11y": "कैमरे से QR कोड स्कैन करें",
  "contacts.qr.scan_camera_desc": "अपना कैमरा इस्तेमाल करें",
  "contacts.qr.upload_a11y": "गैलरी से QR छवि अपलोड करें",
  "contacts.qr.upload": "गैलरी से अपलोड करें",
  "contacts.qr.upload_desc": "कोई सहेजी हुई QR छवि चुनें",
  "contacts.qr.scan_a11y": "QR कोड स्कैन करके संपर्क जोड़ें",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16 अक्षरों की पीअर ID, कोई airhop://peer/… लिंक, या संपर्क कोड चिपकाएँ।",
  "contacts.scan.camera_label": "कैमरा पहुँच",
  "contacts.scan.camera_purpose": "किसी संपर्क का QR कोड स्कैन करने",
  "contacts.scan.camera_needed":
    "स्कैन करने के लिए कैमरा पहुँच चाहिए। आप पीअर ID से भी जोड़ सकते हैं।",
  "contacts.scan.camera_failed":
    "कैमरा शुरू नहीं हो सका। दूसरे कैमरा ऐप बंद करके फिर कोशिश करें।",
  "contacts.scan.photo_label": "फ़ोटो पहुँच",
  "contacts.scan.photo_purpose": "कोई सहेजा हुआ QR कोड स्कैन करने",
  "contacts.scan.photo_needed":
    "छवि चुनने के लिए फ़ोटो पहुँच चाहिए। आप पीअर ID से भी जोड़ सकते हैं।",
  "contacts.scan.no_qr": "उस छवि में कोई Airhop QR कोड नहीं मिला।",
  "contacts.scan.unreadable": "उस छवि से QR कोड पढ़ा नहीं जा सका।",
  "contacts.scan.bitchat_expired":
    "उस bitchat कोड की अवधि खत्म हो गई। उनसे अपना QR दोबारा खोलने को कहें।",
  "contacts.scan.tampered":
    "यह QR कोड अमान्य है: इसकी पीअर ID इसकी कुंजियों से मेल नहीं खाती। इससे छेड़छाड़ हुई हो सकती है।",
  "contacts.scan.already_added": "पहले से आपके संपर्कों में",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "कैमरा पहुँच का इंतज़ार…",
  "contacts.verify.camera_off": "कैमरा बंद है",
  "contacts.verify.open_settings": "सेटिंग्स खोलें",
  "contacts.verify.verified": "सत्यापित",
  "contacts.verify.different": "अलग संपर्क",
  "contacts.verify.scan_again": "फिर स्कैन करें",
  "contacts.verify.failed": "सत्यापित नहीं हो सका",
  "contacts.verify.done": "हो गया",
  "contacts.verify.title": "{name} को सत्यापित करें",
  "contacts.verify.aim": "अपना कैमरा उनके QR कोड पर रखें",
  "contacts.verify.camera_off_body":
    "QR से सत्यापित करने के लिए सेटिंग्स में कैमरा पहुँच चालू करें।",
  "contacts.verify.match_body":
    "{name} की कुंजी मेल खाती है। आप इस संपर्क पर भरोसा कर सकते हैं।",
  "contacts.verify.different_body":
    "यह QR किसी और का है। {name} से उनका अपना कोड दिखाने को कहें।",
  "contacts.verify.tampered_body":
    "इस QR से छेड़छाड़ लगती है: इसकी ID इसकी कुंजी से मेल नहीं खाती।",
  "contacts.verify.choose_title": "आप कैसे जाँचना चाहेंगे?",
  "contacts.verify.choose_body":
    "दोनों यह पक्का करते हैं कि इस फ़ोन पर मौजूद कुंजियाँ सचमुच {name} की हैं।",
  "contacts.verify.method_scan": "उनका कोड स्कैन करें",
  "contacts.verify.method_scan_sub": "वे आपके साथ यहीं हैं",
  "contacts.verify.method_compare": "कोड मिलाएँ",
  "contacts.verify.method_compare_sub": "कॉल पर एक-दूसरे को पढ़कर सुनाएँ",
  "contacts.verify.no_keys":
    "इस संपर्क के लिए अभी कोई कुंजी नहीं। उन्हें संदेश भेजें, या मिलने पर उनका कोड स्कैन करें।",
  "contacts.verify.compare_title": "ये एक-दूसरे को पढ़कर सुनाएँ",
  "contacts.verify.compare_body":
    "{name} को वही छह शब्द दिखते हैं। अगर वे मिलते हैं, तो आप दोनों जान गए कि कुंजियाँ असली हैं।",
  "contacts.verify.codes_match": "ये मिलते हैं",
  "contacts.verify.codes_differ": "ये नहीं मिलते",
  "contacts.verify.compared_body":
    "आपने और {name} ने एक ही कोड की पुष्टि की। यह संपर्क सत्यापित है।",

  // ---- Settings: shared chrome ----
  "settings.back": "वापस जाएँ",
  "settings.coming_soon": "जल्द आ रहा है",
  "settings.opens_externally": "{label}, ऐप के बाहर खुलता है",
  "settings.peer_id": "पीअर ID",
  "settings.share_peer_id": "अपनी पीअर ID साझा करें",
  "settings.share_id_short": "ID साझा करें",
  "settings.peer_id_sheet.title": "आपकी पीअर ID",
  "settings.peer_id_sheet.copy": "पीअर ID कॉपी करें",
  "settings.peer_id_sheet.note":
    "यह तभी काम करता है जब आप दोनों ब्लूटूथ की पहुँच में हों। किसी को कहीं से भी संदेश भेजने देने के लिए अपना QR कोड साझा करें।",

  // ---- Settings: hub rows ----
  "settings.section.general": "सामान्य",
  "settings.section.general_desc":
    "वैकल्पिक सुविधाएँ, भेजना वापस लेना, मीडिया, रीसेट",
  "settings.section.privacy": "गोपनीयता और सुरक्षा",
  "settings.section.privacy_desc":
    "फ़ॉरवर्ड सीक्रेसी, हस्ताक्षरित पैकेट, अवरुद्ध पीअर",
  "settings.section.network": "नेटवर्क और रिले",
  "settings.section.network_desc":
    "इंटरनेट फ़ॉलबैक, nostr रिले, bitchat अनुकूलता",
  "settings.section.permissions": "अनुमतियाँ",
  "settings.section.permissions_desc": "ब्लूटूथ, स्थान, सूचनाएँ, कैमरा, माइक",
  "settings.section.storage": "भंडारण और डेटा",
  "settings.section.diagnostics": "निदान",

  // ---- Settings: group headings ----
  "settings.group.transports": "ट्रांसपोर्ट",
  "settings.group.nearby": "आस-पास",
  "settings.group.sync": "सिंक",
  "settings.group.features": "सुविधाएँ",
  "settings.group.messages": "संदेश",
  "settings.group.media": "मीडिया",
  "settings.group.reset": "रीसेट",
  "settings.group.always_on": "हमेशा चालू",
  "settings.group.notifications": "सूचनाएँ",
  "settings.group.blocked": "अवरुद्ध",
  "settings.group.theme": "थीम",
  "settings.group.font": "फ़ॉन्ट",
  "settings.group.language": "भाषा",
  "settings.section.diagnostics_desc": "कनेक्शन की स्थिति और आस-पास के डिवाइस",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "ब्लूटूथ लिंक",
  "settings.diag.ble_links_desc": "वे डिवाइस जिनसे यह फ़ोन सीधे जुड़ा है",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "फ़ोन से फ़ोन, बिना राउटर या इंटरनेट",
  "settings.diag.wifi_active": "चल रहा है",
  "settings.diag.wifi_unsupported": "इस डिवाइस पर समर्थित नहीं",
  "settings.diag.wifi_permission": "एक अनुमति से रुका है",
  "settings.diag.wifi_unavailable": "अभी उपलब्ध नहीं",
  "settings.diag.wifi_unknown": "रेडियो का इंतज़ार",
  "settings.diag.relays": "Nostr रिले",
  "settings.diag.relays_desc":
    "स्थान चैनलों और इंटरनेट पहुँच के लिए इस्तेमाल होते हैं",
  "settings.diag.connected": "जुड़ा है",
  "settings.diag.disconnected": "जुड़ा नहीं",
  "settings.diag.peer_direct": "सीधा लिंक",
  "settings.diag.peer_relayed": "किसी दूसरे डिवाइस से सुना",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "कोई सिग्नल रीडिंग नहीं",
  "settings.diag.no_peers": "पहुँच में कोई नहीं",
  "settings.diag.no_peers_desc": "{links} रेडियो लिंक खुले",
  "settings.diag.gcs_size": "फ़िल्टर आकार",
  "settings.diag.gcs_size_desc": "हवा में भेजा गया सबसे बड़ा सिंक फ़िल्टर",
  "settings.diag.fpr": "फ़ॉल्स पॉज़िटिव दर",
  "settings.diag.fpr_desc":
    "फ़िल्टर कितनी बार ऐसा पैकेट होने का दावा करता है जो हमारे पास नहीं",
  "settings.diag.bytes": "{n} बाइट",
  "settings.diag.footnote":
    "यहाँ कुछ भी बदला नहीं जा सकता। ये मान तय हैं ताकि Airhop bitchat के साथ चलता रहे।",
  "settings.section.storage_desc": "इस्तेमाल और कैश",
  "settings.section.appearance": "रूप-रंग",
  "settings.section.appearance_desc": "थीम, फ़ॉन्ट और भाषा",
  "settings.section.help": "मदद और सुझाव",
  "settings.section.help_desc": "हमसे संपर्क करें, गड़बड़ी बताएँ, या FAQ पढ़ें",
  "settings.section.support": "सहयोग",
  "settings.section.support_desc": "विकास को चलता रखने में मदद करें",
  "settings.section.about": "परिचय",
  "settings.section.about_desc": "संस्करण, बदलावों की सूची और स्रोत",

  // ---- Settings: general ----
  "settings.general.undo": "भेजना वापस लें",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "वॉलेट",
  "settings.general.undo_seconds": "{count} सेकंड",
  "settings.general.undo_a11y": "भेजना वापस लें: {value}",
  "settings.general.quality_a11y": "अपलोड गुणवत्ता {value} पर सेट करें",
  "settings.general.undo_desc":
    "भेजे गए संदेश को थोड़ी देर रोके रखता है ताकि जाने से पहले आप उसे वापस ले सकें",
  "settings.general.undo_off_desc": "तुरंत भेजें, वापस लेने का मौका नहीं",
  "settings.general.undo_2": "2 सेकंड",
  "settings.general.undo_2_desc": "वापस लेने का एक झटपट मौका",
  "settings.general.undo_10": "10 सेकंड",
  "settings.general.undo_10_desc": "सबसे लंबी अवधि",
  "settings.general.quality": "अपलोड गुणवत्ता",
  "settings.general.quality_desc":
    "आपके कैमरे या लाइब्रेरी से भेजी गई फ़ोटो पर लागू होता है। हर फ़ोटो दोनों ही हाल में मेश के हिसाब से ढाली जाती है।",
  "settings.general.quality_low": "कम",
  "settings.general.quality_low_desc":
    "सबसे छोटी फ़ोटो, सबसे तेज़ भेजी जाती हैं",
  "settings.general.quality_medium": "मध्यम",
  "settings.general.quality_medium_desc": "ब्योरे और रफ़्तार के बीच संतुलन",
  "settings.general.quality_high": "उच्च",
  "settings.general.quality_high_desc": "सबसे ज़्यादा ब्योरा रखती है",
  "settings.general.feature_wallet_desc":
    "मेश पर एक से दूसरे तक Cashu ecash भेजें",
  "settings.general.feature_wallet_a11y": "वॉलेट (हमेशा चालू)",
  "settings.general.feature_ai_desc":
    "निजी, डिवाइस पर चलने वाला सहायक, कोई नेटवर्क कॉल नहीं",
  "settings.general.feature_feeds": "फ़ीड",
  "settings.general.feature_feeds_desc":
    "Bluesky और Mastodon फ़ीड पढ़ें और उन पर पोस्ट करें",
  "settings.general.show_media": "मीडिया अपने आप दिखाएँ",
  "settings.general.show_media_desc":
    "फ़ोटो और वीडियो चैट में दिखें, या एक टैप के पीछे रहें",
  "settings.general.reset": "सेटिंग्स रीसेट करें",
  "settings.general.media_retention": "मीडिया इतने समय रखें",
  "settings.general.media_retention_desc":
    "चुने गए समय के बाद फ़ोटो, वीडियो और वॉइस नोट मिटा दिए जाते हैं",
  "settings.general.media_retention_sheet":
    "चुनें कि मीडिया इस डिवाइस पर कितने समय रहे। मिटाया गया मीडिया वापस नहीं मिल सकता।",
  "settings.general.retention_7_desc":
    "सबसे कम निशान छोड़ता है। सबसे अच्छा जब ख़तरा खुद फ़ोन ही हो।",
  "settings.general.retention_14_desc":
    "सिग्नल से एक-दो हफ़्ते दूर रहने के लिए बीच का रास्ता।",
  "settings.general.retention_30_desc":
    "बातचीत सबसे लंबे समय तक पढ़ने लायक रखता है, और डिस्क पर सबसे ज़्यादा।",
  "settings.general.reset_desc":
    "हर पसंद को उसके डिफ़ॉल्ट पर लौटा देता है, आपकी पहचान, संदेश, संपर्क और वॉलेट को छुए बिना",
  "settings.general.reset_title": "सेटिंग्स रीसेट करें?",
  "settings.general.reset_body":
    "हर पसंद अपने डिफ़ॉल्ट पर लौट जाती है: रूप-रंग, भेजना वापस लेना, और कनेक्टिविटी (इंटरनेट, Tor, गेटवे, ब्रिज, रिले)। आपकी पहचान, संदेश, संपर्क और वॉलेट अछूते रहते हैं।",
  "settings.general.reset_confirm": "रीसेट करें",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "फ़ॉरवर्ड सीक्रेसी",
  "settings.security.forward_secrecy_desc":
    "सीधे संदेशों के लिए Double Ratchet हमेशा चालू रहता है",
  "settings.security.signed_packets": "हस्ताक्षरित पैकेट",
  "settings.security.signed_packets_desc":
    "हर पैकेट Ed25519 से हस्ताक्षरित होता है",
  "settings.security.hide_previews": "सूचना की झलक छिपाएँ",
  "settings.security.hide_previews_desc":
    "भेजने वाले और संदेश को आपकी लॉक स्क्रीन से दूर रखता है, जो उन्हें बिना अनलॉक किए दिखा देती है",
  "settings.security.no_blocked": "कोई अवरुद्ध पीअर नहीं",
  "settings.security.no_blocked_desc":
    "अवरुद्ध पीअर आपको संदेश नहीं भेज सकते और मेश टैब पर नहीं दिखते",
  "settings.security.unblock_title": "इस पीअर से रोक हटाएँ",
  "settings.security.unblock": "रोक हटाएँ",
  "settings.security.unblock_peer": "{name} से रोक हटाएँ",
  "settings.security.unblock_body":
    "{name} आपको फिर से संदेश भेज सकेंगे और आस-पास होने पर मेश टैब में दोबारा दिखेंगे।",

  // ---- Settings: network and relays ----
  "settings.network.internet": "इंटरनेट फ़ॉलबैक",
  "settings.network.internet_desc":
    "मेश पीअर पहुँच से बाहर हों तो Nostr रिले के ज़रिए जारी रखें",
  "settings.network.internet_off_title": "इंटरनेट बंद करें?",
  "settings.network.internet_off_body":
    "Airhop सिर्फ़ ब्लूटूथ पर चलेगा। यह किसी Nostr रिले से संपर्क करना बंद कर देगा, और Tor, इंटरनेट गेटवे तथा मेश ब्रिज सब बंद हो जाएँगे। आस-पास की ब्लूटूथ चैट चलती रहेगी।",
  "settings.network.turn_off": "बंद करें",
  "settings.network.discovery": "जियो-रिले खोज",
  "settings.network.discovery_desc":
    "300+ वितरित रिले में से किसी स्थान सेल के सबसे नज़दीकी रिले अपने आप चुनें",
  "settings.network.discovery_needs_relay": "पहले अपना रिले जोड़ें",
  "settings.network.discovery_needs_relay_body":
    "अपने आप होने वाली खोज ही Airhop को सबसे नज़दीकी रिले तक ले जाती है। इसे बंद करना तभी सही है जब आपने नीचे अपने रिले तय कर लिए हों, इसलिए पहले कम से कम एक जोड़ें।",
  "settings.network.custom_only_title": "सिर्फ़ अपने रिले इस्तेमाल करें?",
  "settings.network.custom_only_body":
    "स्थान चैनल और मेश ब्रिज सबसे नज़दीकी रिले अपने आप चुनना बंद कर देंगे और सिर्फ़ वही इस्तेमाल करेंगे जो आपने जोड़े हैं। इससे पहुँच घट सकती है, और हो सकता है आप bitchat उपयोगकर्ताओं से मिलना बंद कर दें, जो सबसे नज़दीकी रिले पर ही जुटते हैं।",
  "settings.network.custom": "अपने रिले",
  "settings.network.custom_desc":
    "स्थान चैनलों और मेश ब्रिज के लिए अपने रिले जोड़ें",
  "settings.network.custom_added": "{max} में से {count} जोड़े गए",
  "settings.network.dm_relays": "संदेश रिले",
  "settings.network.dm_relays_desc":
    "सीधे संदेश और निजी चैनल हमेशा इन्हीं का इस्तेमाल करते हैं। आपके अपने रिले इन्हें नहीं बदलते।",
  "settings.network.discovery_back_on": "जियो-रिले खोज फिर चालू",
  "settings.network.discovery_back_on_body":
    "वह आपका आख़िरी अपना रिले था। स्थान चैनलों को प्रकाशित करने की जगह चाहिए, इसलिए Airhop फिर से सबसे नज़दीकी रिले अपने आप चुन रहा है।",
  "settings.network.add_relay": "रिले जोड़ें",
  "settings.network.remove_relay": "{url} हटाएँ",
  "settings.network.add_short": "जोड़ें",
  "settings.network.relay_limit":
    "आप {count} रिले जोड़ सकते हैं। दूसरा जोड़ने के लिए एक हटाएँ।",
  "settings.network.relay_duplicate": "वह रिले पहले से आपकी सूची में है।",
  "settings.network.relay_invalid":
    "कोई मान्य रिले होस्ट डालें, जैसे relay.example.com। पोर्ट तभी चाहिए जब रिले डिफ़ॉल्ट इस्तेमाल न करता हो। IP पते और स्थानीय नाम मान्य नहीं हैं।",
  "settings.network.bitchat": "bitchat अनुकूलता",
  "settings.network.bitchat_desc":
    "bitchat जैसा ही BLE मेश, पूरी तरह मिलकर चलने वाला। यह हमेशा चालू रहता है और बंद नहीं किया जा सकता।",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "पृष्ठभूमि में चलाएँ",
  "settings.conn.background_desc": "Airhop बंद होने पर भी मेश चलता रखें",
  "settings.conn.background_on_title": "मेश चलता रखें?",
  "settings.conn.background_on_body":
    "Airhop बंद होने पर भी संदेश आगे भेजता और लेता रहेगा, ताकि आपके दूर रहते भी संदेश पहुँचें। ऐसा करते समय Android एक चालू सूचना दिखाता है।",
  "settings.conn.background_off_title": "Airhop बंद होते ही मेश रोक दें?",
  "settings.conn.background_off_body":
    "संदेश तभी पहुँचेंगे जब Airhop खुला हो, और यह फ़ोन आस-पास के लोगों के लिए संदेश आगे भेजना बंद कर देगा। चालू सूचना हट जाएगी।",
  "settings.conn.live_voice": "लाइव वॉइस",
  "settings.conn.live_voice_desc":
    "आस-पास के लोगों से वॉकी-टॉकी की तरह बात करें",
  "settings.conn.live_voice_on_title": "लाइव वॉइस चालू करें?",
  "settings.conn.live_voice_on_body":
    "माइक दबाए रखने पर आपकी आवाज़ बोलते ही ब्लूटूथ की पहुँच में मौजूद सबको जाती है, और उनकी आवाज़ आपके फ़ोन पर बजती है। कुछ भी रिकॉर्ड नहीं होता।",
  "settings.conn.live_voice_off_title": "लाइव वॉइस बंद करें?",
  "settings.conn.live_voice_off_body":
    "माइक दबाए रखने पर उसकी जगह एक वॉइस नोट रिकॉर्ड होगा। छोड़ने पर वह भेजा जाता है, और जब तक कोई उसे बजाए नहीं, सुनता कोई नहीं।",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor रूटिंग",
  "settings.conn.tor_desc":
    "अतिरिक्त गोपनीयता के लिए Nostr ट्रैफ़िक Tor से भेजें",
  "settings.conn.tor_on_title": "Nostr ट्रैफ़िक Tor से भेजें?",
  "settings.conn.tor_on_body":
    "रिले को आपका IP पता दिखना बंद हो जाएगा। जुड़ने में ज़्यादा समय लगता है और संदेश धीरे पहुँचते हैं। ब्लूटूथ पर कोई असर नहीं।",
  "settings.conn.tor_off_title": "Tor रूटिंग बंद करें?",
  "settings.conn.tor_off_body":
    "Nostr ट्रैफ़िक फिर आपके सामान्य कनेक्शन से जाएगा, तो रिले को आपका IP पता दोबारा दिखेगा। ब्लूटूथ पर दोनों ही हाल में कोई असर नहीं।",
  "settings.conn.tor_orbot_idle":
    "Orbot इंस्टॉल है पर जुड़ा नहीं। Orbot खोलें, उसका VPN चालू करें, फिर इसे चालू करें।",
  "settings.conn.tor_unavailable": "इस बिल्ड में Tor रूटिंग उपलब्ध नहीं है।",
  "settings.conn.tor_timeout":
    "Tor को जुड़ने में एक मिनट से ज़्यादा लग रहा है। यह चालू रहता है और कोशिश करता रहता है; मेश टैब बताएगा कि यह कब रूट कर रहा है, या यह नेटवर्क इसे रोक रहा है।",
  "settings.conn.tor_failed":
    "Tor शुरू नहीं हो सका। पक्का करें कि ऐप के पास नेटवर्क पहुँच है।",
  "settings.conn.mint_clearnet": "मिंट ट्रैफ़िक को खुले नेट पर जाने दें",
  "settings.conn.mint_clearnet_desc":
    "iOS पर Tor सिर्फ़ Nostr को ढकता है। मिंट अनुरोध रोकने के लिए इसे बंद रहने दें; मेश पर ecash दोनों ही हाल में चलता रहता है।",
  "settings.conn.gateway": "इंटरनेट गेटवे",
  "settings.conn.gateway_desc":
    "आस-पास के किसी ऑफ़लाइन फ़ोन को अपना कनेक्शन उधार दें ताकि वह स्थान चैनलों तक पहुँच सके",
  "settings.conn.gateway_on_title": "इंटरनेट गेटवे चालू करें?",
  "settings.conn.gateway_on_body":
    "जिन आस-पास के फ़ोनों का अपना कनेक्शन नहीं है, वे स्थान-चैनल के संदेश आपके ज़रिए भेजेंगे और पाएँगे। इसमें आपका मोबाइल डेटा और बैटरी लगती है, और उनके संदेश सिरे से सिरे तक एन्क्रिप्टेड रहते हैं, इसलिए जो गुज़रता है उसे आप पढ़ नहीं सकते।",
  "settings.conn.gateway_off_title": "इंटरनेट गेटवे बंद करें?",
  "settings.conn.gateway_off_body":
    "आस-पास के ऑफ़लाइन फ़ोन आपके ज़रिए स्थान चैनलों तक पहुँचना बंद कर देंगे। आपके अपने संदेशों पर कोई असर नहीं।",
  "settings.conn.bridge": "मेश ब्रिज",
  "settings.conn.bridge_desc":
    "इस इलाके की सार्वजनिक #bluetooth चैट को इंटरनेट के ज़रिए पहुँच से बाहर की दूसरी ब्लूटूथ भीड़ से जोड़ें",
  "settings.conn.bridge_on_title": "मेश ब्रिज चालू करें?",
  "settings.conn.bridge_on_body":
    "आपके सार्वजनिक #bluetooth संदेश इंटरनेट के ज़रिए आपके मोहल्ले में प्रकाशित होंगे, ताकि ब्लूटूथ की पहुँच से परे के लोग भी उन्हें पढ़ सकें। निजी संदेश कभी ब्रिज नहीं होते, और “सिर्फ़ आस-पास” किसी भी एक संदेश को स्थानीय रखता है।",
  "settings.conn.bridge_off_title": "मेश ब्रिज बंद करें?",
  "settings.conn.bridge_off_body":
    "आपके सार्वजनिक #bluetooth संदेश फिर ब्लूटूथ की पहुँच में ही रहेंगे, और ब्रिज वाली भीड़ के संदेश यहाँ आना बंद हो जाएँगे।",
  "settings.conn.bridge_needs_location": "मेश ब्रिज को स्थान चाहिए",
  "settings.conn.bridge_needs_location_desc":
    "यह एक स्थान फ़िक्स से आपका मोहल्ला पहचानता है। ब्रिजिंग शुरू करने के लिए स्थान की अनुमति दें।",
  "settings.conn.grant_location": "स्थान की अनुमति दें",
  "settings.conn.grant_short": "अनुमति दें",
  "settings.conn.orbot_body":
    "Airhop, Tor ट्रैफ़िक Orbot के ज़रिए भेजता है। Play Store से Orbot इंस्टॉल करके चालू करें, फिर इसे चालू करें।",
  "settings.conn.internet_off": "इंटरनेट बंद है",
  "settings.conn.internet_off_desc":
    "Tor, ब्रिज और गेटवे सब इंटरनेट इस्तेमाल करते हैं। इन्हें चलाने के लिए नेटवर्क के नीचे इंटरनेट फ़ॉलबैक चालू करें।",
  "settings.conn.turn_on": "चालू करें",
  "settings.conn.turn_off": "बंद करें",
  "settings.conn.orbot_title": "Android पर Tor",
  "settings.conn.get_orbot": "Orbot लें",
  "settings.conn.later": "बाद में",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "ब्लूटूथ",
  "settings.permissions.bluetooth_desc":
    "आस-पास के डिवाइस ढूँढ़ता है और उनके बीच संदेश पहुँचाता है। इसके बिना मेश चल ही नहीं सकता।",
  "settings.permissions.location": "स्थान",
  "settings.permissions.location_desc":
    "आस-पास के क्षेत्र चैनल खोलता है। इसके बिना वे चैनल बंद रहते हैं और ब्लूटूथ मेश सामान्य रूप से चलता रहता है।",
  "settings.permissions.notifications": "सूचनाएँ",
  "settings.permissions.notifications_desc":
    "ऐप बंद होने पर भी नए संदेशों की सूचना पाएँ। इसके बिना वे तभी दिखेंगे जब आप Airhop खोलेंगे।",
  "settings.permissions.camera": "कैमरा",
  "settings.permissions.camera_desc":
    "QR कोड स्कैन करें और भेजने के लिए फ़ोटो या वीडियो लें। इसके बिना भी आप लाइब्रेरी से मीडिया साझा कर सकते हैं।",
  "settings.permissions.photos": "फ़ोटो",
  "settings.permissions.photos_desc":
    "अपनी लाइब्रेरी से फ़ोटो भेजें और मिला मीडिया सहेजें। इसके बिना भी आप कैमरे से नई फ़ोटो लेकर भेज सकते हैं।",
  "settings.permissions.microphone": "माइक्रोफ़ोन",
  "settings.permissions.microphone_desc":
    "वॉइस संदेश रिकॉर्ड करके भेजें या लाइव वॉइस इस्तेमाल करें। इसके बिना वॉइस संदेश और लाइव वॉइस काम नहीं करेंगे।",
  "settings.permissions.allow": "यह अनुमति दें",
  "settings.permissions.open_settings":
    "यह अनुमति बदलने के लिए सिस्टम सेटिंग्स खोलें",
  "settings.permissions.system": "सिस्टम",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "नेटवर्क इस्तेमाल",
  "settings.storage.storage_usage": "भंडारण इस्तेमाल",
  "settings.storage.storage_usage_desc":
    "संदेश, वॉलेट प्रूफ़ और कैश किए अटैचमेंट",
  "settings.storage.session_usage": "यह सत्र · {sent} भेजा, {received} मिला",
  "settings.storage.cache": "कैश",
  "settings.storage.cache_desc": "{size} अटैचमेंट",
  "settings.storage.clear_cache": "अटैचमेंट कैश साफ़ करें",
  "settings.storage.clear": "साफ़ करें",
  "settings.storage.clear_title": "कैश किया मीडिया साफ़ करें?",
  "settings.storage.clear_body":
    "फ़ोटो, वीडियो, वॉइस नोट और फ़ाइलें इस डिवाइस से हटा दी जाएँगी, भेजी और मिली दोनों। उन्हें दोबारा डाउनलोड नहीं किया जा सकता: उनके बबल यही कहेंगे, और आप भेजने वाले से दोबारा भेजने को कह सकते हैं। संदेश और वॉलेट अछूते रहते हैं।",
  "settings.storage.cleared": "कैश साफ़ हो गया",
  "settings.storage.freed": "{size} खाली हुआ।",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "रूप-रंग {value} पर सेट करें",
  "settings.font.set_a11y": "मोनोस्पेस फ़ॉन्ट {value} पर सेट करें",
  "settings.font.system": "सिस्टम",
  "settings.font.system_desc":
    "आपके डिवाइस का डिफ़ॉल्ट मोनोस्पेस फ़ॉन्ट इस्तेमाल करता है",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "आधुनिक और पढ़ने में आसान",
  "settings.language.en": "अंग्रेज़ी",
  "settings.language.am": "अम्हारिक",
  "settings.language.ar": "अरबी",
  "settings.language.bn": "बंगाली",
  "settings.language.my": "बर्मी",
  "settings.language.zh_hans": "चीनी (सरलीकृत)",
  "settings.language.zh_hant": "चीनी (पारंपरिक)",
  "settings.language.nl": "डच",
  "settings.language.fil": "फ़िलिपीनो",
  "settings.language.fr": "फ़्रेंच",
  "settings.language.ka": "जॉर्जियाई",
  "settings.language.de": "जर्मन",
  "settings.language.hi": "हिन्दी",
  "settings.language.id": "इंडोनेशियाई",
  "settings.language.it": "इतालवी",
  "settings.language.ja": "जापानी",
  "settings.language.ko": "कोरियाई",
  "settings.language.mg": "मालागासी",
  "settings.language.ms": "मलय",
  "settings.language.ne": "नेपाली",
  "settings.language.fa": "फ़ारसी",
  "settings.language.pl": "पोलिश",
  "settings.language.pt_br": "पुर्तगाली (ब्राज़ील)",
  "settings.language.pt_pt": "पुर्तगाली (पुर्तगाल)",
  "settings.language.pa": "पंजाबी",
  "settings.language.ru": "रूसी",
  "settings.language.es": "स्पेनिश",
  "settings.language.sw": "स्वाहिली",
  "settings.language.sv": "स्वीडिश",
  "settings.language.ta": "तमिल",
  "settings.language.th": "थाई",
  "settings.language.tr": "तुर्की",
  "settings.language.uk": "यूक्रेनी",
  "settings.language.ur": "उर्दू",
  "settings.language.vi": "वियतनामी",
  "settings.language.pseudo": "छद्म लोकेल",
  "settings.language.soon": "जल्द आ रहा है",
  "settings.language.soon_a11y": "{value}, जल्द आ रहा है",
  "settings.language.set_a11y": "भाषा {value} पर सेट करें",
  "settings.language.pending": "अगली बार खोलने पर",
  "settings.language.pending_a11y":
    "{value}, अगली बार Airhop खोलने पर लागू होगी",
  "settings.language.rtl_title": "पूरा करने के लिए Airhop दोबारा खोलें",
  "settings.language.rtl_body":
    "{value} दाएँ से बाएँ पढ़ी जाती है, और Airhop दिशा सिर्फ़ शुरू होते समय बदल सकता है। बदलाव पूरा करने के लिए इसे बंद करके दोबारा खोलें। कुछ भी नहीं खोता, और तब तक आपका मेश जुड़ा रहता है।",
  "settings.theme.light": "हल्का",
  "settings.theme.light_desc": "हमेशा हल्का रंग-पट इस्तेमाल करें",
  "settings.theme.dark": "गहरा",
  "settings.theme.dark_desc": "हमेशा गहरा रंग-पट इस्तेमाल करें",

  // ---- Settings: profile and identity ----
  "settings.status.online": "ऑनलाइन",
  "settings.status.online_desc":
    "खोजे जाने योग्य, विज्ञापन और स्कैन दोनों चालू",
  "settings.status.away": "दूर",
  "settings.status.away_desc": "मेश रुका है, न स्कैन न विज्ञापन",
  "settings.status.invisible": "अदृश्य",
  "settings.status.invisible_desc": "स्कैन कर रहे हैं, पर खोज से छिपे हैं",
  "settings.status.title": "स्थिति",
  "settings.status.set_a11y": "स्थिति {value} पर सेट करें",
  "settings.status.edit": "स्थिति बदलें",
  "settings.status.desc": "चुनें कि मेश पर आप कितने दिखें।",
  "settings.transfer.identity": "पहचान और कुंजियाँ",
  "settings.transfer.identity_desc": "आपकी पीअर ID, उपयोगकर्ता नाम और संपर्क",
  "settings.transfer.chats": "चैट और इतिहास",
  "settings.transfer.chats_desc": "बातचीत, समूह, और वे चैनल जिनसे आप जुड़े हैं",
  "settings.transfer.wallet": "वॉलेट बैलेंस",
  "settings.transfer.wallet_desc": "Cashu प्रूफ़ और लेनदेन का इतिहास",
  "settings.transfer.title": "नए फ़ोन पर ले जाएँ",
  "settings.transfer.desc": "अपनी पहचान, चैट और वॉलेट दूसरे डिवाइस पर ले जाएँ",
  "settings.transfer.coming_soon_a11y": "नए फ़ोन पर ले जाएँ, जल्द आ रहा है",
  "settings.transfer.body":
    "दोनों फ़ोन पास रखें और सब कुछ ब्लूटूथ से पार भेजें। कुछ भी किसी सर्वर से नहीं गुज़रता, इसलिए यह बिना इंटरनेट के भी चलता है।",
  "settings.qr.permission_label": "फ़ोटो पहुँच",
  "settings.qr.permission_purpose": "अपना QR कोड सहेजने",
  "settings.qr.saved": "सहेजा गया",
  "settings.qr.saved_body": "QR कोड आपकी फ़ोटो लाइब्रेरी में सहेजा गया।",
  "settings.qr.save_failed": "सहेजा नहीं जा सका",
  "settings.qr.save_failed_body": "QR कोड सहेजा नहीं जा सका। फिर कोशिश करें।",
  "settings.qr.share_message": "मुझे Airhop पर जोड़ें",
  "settings.qr.share_body":
    "मुझे Airhop पर जोड़ें — ऑफ़लाइन-पहले, निजी मेश मैसेजिंग।",
  "settings.qr.show_short": "QR दिखाएँ",
  "settings.qr.title": "आपका QR कोड",
  "settings.qr.note":
    "इसमें आपकी सार्वजनिक कुंजियाँ हैं, जिनसे दूसरे आपको कहीं से भी संदेश भेज सकते हैं। इसे सिर्फ़ भरोसेमंद लोगों से साझा करें। जब तक आप अपनी पहचान न मिटाएँ, यह नहीं बदलेगा।",
  "settings.qr.code_label": "संपर्क कोड",
  "settings.qr.copy_code": "संपर्क कोड कॉपी करें",
  "settings.qr.share": "QR कोड साझा करें",
  "settings.qr.share_short": "QR साझा करें",
  "settings.qr.download": "QR कोड डाउनलोड करें",
  "settings.qr.download_short": "QR डाउनलोड करें",
  "settings.qr.show": "QR कोड दिखाएँ",
  "settings.wipe.trigger": "पैनिक वाइप चलाएँ",
  "settings.wipe.trigger_desc":
    "बिना पुष्टि तुरंत मिटाने के लिए तीन बार टैप करें",
  "settings.wipe.title": "पैनिक वाइप",
  "settings.wipe.now": "अभी मिटाएँ",
  "settings.wipe.desc": "सभी कुंजियाँ, संदेश और प्रूफ़ तुरंत नष्ट करें",
  "settings.wipe.body":
    "इससे आपकी सभी कुंजियाँ, संदेश और वॉलेट प्रूफ़ तुरंत नष्ट हो जाएँगे। इसे वापस नहीं लिया जा सकता।",
  "settings.wipe.in_progress": "मिटाया जा रहा है",
  "settings.wipe.in_progress_body":
    "आपकी कुंजियाँ, संदेश और फ़ाइलें नष्ट की जा रही हैं। इसमें कुछ सेकंड लगते हैं, और ऐप बंद होने पर भी यह अपने आप पूरा हो जाता है।",
  "settings.wipe.got_it": "समझ गए",
  "settings.wipe.keys_failed": "कुंजियाँ नष्ट नहीं हो सकीं",
  "settings.wipe.keys_failed_body":
    "आपके संदेश, संपर्क और वॉलेट जा चुके हैं, पर डिवाइस ने आपकी कुंजियाँ छोड़ने से मना कर दिया। डिवाइस अनलॉक करके दोबारा मिटाएँ।",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "हमसे संपर्क करें",
  "settings.help.contact_a11y": "{address} पर ईमेल करें",
  "settings.help.bug": "गड़बड़ी बताएँ",
  "settings.help.bug_desc": "GitHub पर issue खोलें",
  "settings.help.bug_a11y": "GitHub पर गड़बड़ी बताएँ",
  "settings.help.faq": "अक्सर पूछे जाने वाले सवाल",
  "settings.help.faq_desc": "आम सवालों के जवाब",
  "settings.help.faq_a11y": "FAQ खोलें",
  "settings.help.terms_desc": "Airhop कैसे इस्तेमाल किया जा सकता है",
  "settings.help.terms_a11y": "सेवा की शर्तें खोलें",
  "settings.help.privacy_desc": "हम क्या इकट्ठा नहीं करते",
  "settings.help.privacy_a11y": "गोपनीयता नीति खोलें",

  // ---- Settings: support ----
  "settings.support.card": "कार्ड या UPI",
  "settings.support.card_desc": "नेटबैंकिंग और वॉलेट, दुनिया भर में",
  "settings.support.card_a11y": "कार्ड, UPI, नेटबैंकिंग या वॉलेट से सहयोग करें",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "मासिक या एक बार, कोई प्लेटफ़ॉर्म शुल्क नहीं",
  "settings.support.sponsors_a11y": "GitHub Sponsors के ज़रिए सहयोग करें",
  "settings.support.note":
    "मैं Airhop अपने खाली समय में बनाता हूँ। न कोई निवेशक है न विज्ञापन। अगर यह आपके काम आता है, तो आपका सहयोग विकास को चलता रखने में बहुत मदद करता है। हर सुविधा दोनों ही हाल में मुफ़्त रहती है।",

  // ---- Settings: about and version ----
  "settings.about.version": "संस्करण",
  "settings.about.version_desc": "मौजूदा रिलीज़",
  "settings.about.version_a11y": "संस्करण देखें और अपडेट जाँचें",
  "settings.about.release_notes": "रिलीज़ नोट्स",
  "settings.about.release_notes_desc": "नई रिलीज़ में क्या नया है",
  "settings.about.release_notes_a11y": "GitHub पर नवीनतम रिलीज़ नोट्स खोलें",
  "settings.about.source": "स्रोत कोड",
  "settings.about.source_a11y": "GitHub पर स्रोत कोड खोलें",
  "settings.about.licenses": "ओपन सोर्स लाइसेंस",
  "settings.about.open_repo": "{name} रिपॉज़िटरी खोलें",
  "settings.about.licenses_desc": "तीसरे पक्ष के ओपन सोर्स पैकेज",
  "settings.about.licenses_a11y": "तीसरे पक्ष के लाइसेंस देखें",
  "settings.version.codename": "कोडनेम",
  "settings.version.checking": "जाँचा जा रहा है",
  "settings.version.check": "अपडेट जाँचें",
  "settings.version.checking_title": "अपडेट जाँचे जा रहे हैं",
  "settings.version.up_to_date": "आप नवीनतम संस्करण पर हैं।",
  "settings.version.release_notes": "रिलीज़ नोट्स देखें",
  "settings.version.made_with": "बनाया गया",
  "settings.version.number": "संस्करण {version}",
  "settings.version.update_to": "{version} पर अपडेट करें",
  "settings.version.update_to_a11y": "संस्करण {version} पर अपडेट करें",
  "settings.version.released_under": "{license} के तहत जारी",
  "settings.version.notes_a11y": "संस्करण {version} के रिलीज़ नोट्स देखें",
  "settings.version.tor_paused":
    "Tor चालू रहते अपडेट जाँच रुकी रहती है, ताकि आपका IP लीक न हो। रिलीज़ पेज ब्राउज़र में देखें।",
  "settings.version.check_failed":
    "अपडेट नहीं जाँचे जा सके। अपना कनेक्शन जाँचकर फिर कोशिश करें।",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} {size} KiB का है, {cap} KiB की सीमा से ज़्यादा।",
  "transfer.failed.malformed":
    "एक अटैचमेंट खराब हालत में पहुँचा और खुल नहीं सका। उनसे दोबारा भेजने को कहें।",
  "transfer.failed.unsupported_type":
    "एक अटैचमेंट ऐसे फ़ॉर्मैट में आया जिसे यह ऐप नहीं खोल सकता।",
  "transfer.failed.type_mismatch":
    "एक अटैचमेंट अस्वीकार हुआ: उसकी सामग्री बताए गए फ़ाइल प्रकार से मेल नहीं खाती।",
  "transfer.failed.storage":
    "एक अटैचमेंट पहुँचा पर सहेजा नहीं जा सका। अपनी खाली जगह जाँचें।",
  "transfer.badge.waiting": "इंतज़ार · {name}",
  "transfer.badge.active_count": "{count} ट्रांसफ़र",
  "transfer.badge.sending": "{name} भेजा जा रहा है",
  "transfer.badge.receiving": "{name} मिल रहा है",
  "transfer.badge.a11y": "{label}, {percent} प्रतिशत। बातचीत खोलें।",
  "transfer.kind.photo": "फ़ोटो",
  "transfer.kind.video": "वीडियो",
  "transfer.kind.voice": "वॉइस नोट",
  "transfer.this.photo": "यह फ़ोटो",
  "transfer.this.video": "यह वीडियो",
  "transfer.this.voice": "यह वॉइस नोट",
  "transfer.this.file": "यह फ़ाइल",
  "transfer.kind.document": "दस्तावेज़",
  "transfer.kind.voice_preview": "वॉइस नोट",
  "transfer.kind.photo_preview": "फ़ोटो",
  "transfer.kind.video_preview": "वीडियो",
  "transfer.kind.document_preview": "दस्तावेज़",

  // ---- System notifications ----
  "notif.channel.messages": "संदेश",
  "notif.channel.nearby": "आस-पास के पीअर",
  "notif.channel.nearby_desc":
    "जब मेश को ब्लूटूथ की पहुँच में लोग मिलते हैं तो कभी-कभार एक सूचना।",
  "notif.nearby.body": "अभी ब्लूटूथ की पहुँच में। मेश खोलने के लिए टैप करें।",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "कोई",
  "notif.notice_urgent": "ज़रूरी सूचना · {content}",
  "notif.notice": "सूचना · {content}",
  "notif.incoming_file": "आती हुई फ़ाइल",
  "notif.preview.photo": "📷 फ़ोटो",
  "notif.preview.voice": "🎤 वॉइस संदेश",
  "notif.preview.video": "🎥 वीडियो",
  "notif.preview.document": "📄 दस्तावेज़",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "नया संदेश",
  "notif.hidden.channel": "नई गतिविधि",
  "notif.hidden.mention": "आपका ज़िक्र हुआ",
  "notif.mention.title": "{sender} ने आपका ज़िक्र किया",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "{count} और दिखाएँ",
    other: "{count} और दिखाएँ",
  },
  "chat.channels.show_more_a11y": {
    one: "{count} और डिफ़ॉल्ट चैनल दिखाएँ",
    other: "{count} और डिफ़ॉल्ट चैनल दिखाएँ",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} अपठित",
    other: "{label}, {count} अपठित",
  },
  "a11y.new_count": {
    one: "{label}, {count} नए",
    other: "{label}, {count} नए",
  },
  "chat.a11y.unread": {
    one: "{count} अपठित",
    other: "{count} अपठित",
  },
  "chat.thread.length_left": {
    one: "{count} बचे",
    other: "{count} बचे",
  },
  "settings.general.retention_days": {
    one: "{count} दिन",
    other: "{count} दिन",
  },
  "chat.info.group_reach": {
    one: "{count} सदस्य में से {reachable} तक पहुँच",
    other: "{count} सदस्यों में से {reachable} तक पहुँच",
  },
  "chat.group_members": {
    one: "निजी समूह  ·  {count} सदस्य",
    other: "निजी समूह  ·  {count} सदस्य",
  },
  "chat.select.count": {
    one: "{count} चुने गए",
    other: "{count} चुने गए",
  },
  "chat.select.forward": {
    one: "{count} संदेश आगे भेजें",
    other: "{count} संदेश आगे भेजें",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} बोल रहे हैं",
    other: "{count} बोल रहे हैं",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} पीअर पहुँच में",
    other: "{count} पीअर पहुँच में",
  },
  "mesh.peer.hops_away": {
    one: "{count} हॉप दूर",
    other: "{count} हॉप दूर",
  },
  "chat.presence.active": {
    one: "{count} सक्रिय",
    other: "{count} सक्रिय",
  },
  "chat.presence.nearby": {
    one: "{count} आस-पास",
    other: "{count} आस-पास",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} मिंट",
    other: "{count} मिंट",
  },
  "wallet.mint.remove_body": {
    one: "{mint} के पास {count} प्रूफ़ में {balance} {unit} है। इसे निकालने पर वह प्रूफ़ इस डिवाइस से हमेशा के लिए मिट जाएगा और कोई बैकअप नहीं है। पहले रकम निकाल लें या भेज दें।",
    other:
      "{mint} के पास {count} प्रूफ़ों में {balance} {unit} है। इसे निकालने पर वे प्रूफ़ इस डिवाइस से हमेशा के लिए मिट जाएँगे और कोई बैकअप नहीं है। पहले रकम निकाल लें या भेज दें।",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} जमा भुगतान के इंतज़ार में। ऐप हर बार खुलने पर दोबारा जाँचा जाता है।",
    other:
      "{count} जमा भुगतान के इंतज़ार में। ऐप हर बार खुलने पर दोबारा जाँचे जाते हैं।",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints} से {count} बिना खर्च हुआ प्रूफ़ वापस मिला।",
    other: "{mints} से {count} बिना खर्च हुए प्रूफ़ वापस मिले।",
  },
  "wallet.backup.already_spent": {
    one: "{count} सिक्का मिला पर वह पहले ही खर्च हो चुका था, इसलिए उसका कुछ नहीं जुड़ा। यह सामान्य है: आपने अब तक जो भी सिक्का खर्च किया है, वह मिंट के रिकॉर्ड में बना रहता है।",
    other:
      "{count} सिक्के मिले पर वे पहले ही खर्च हो चुके थे, इसलिए उनका कुछ नहीं जुड़ा। यह सामान्य है: आपने अब तक जो भी सिक्का खर्च किया है, वह मिंट के रिकॉर्ड में बना रहता है।",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "{count} और दिखाएँ",
    other: "{count} और दिखाएँ",
  },
  "wallet.activity.show_more_a11y": {
    one: "{count} और भुगतान दिखाएँ",
    other: "{count} और भुगतान दिखाएँ",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} अपुष्ट",
    other: "{count} अपुष्ट",
  },
  "wallet.proof_count": {
    one: "{count} प्रूफ़",
    other: "{count} प्रूफ़",
  },
  "wallet.spent_removed_detail": {
    one: "{count} प्रूफ़ पहले ही खर्च हो चुका था और उसे हटा दिया गया है।",
    other: "{count} प्रूफ़ पहले ही खर्च हो चुके थे और उन्हें हटा दिया गया है।",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "आस-पास कोई",
    other: "आस-पास {count} लोग",
  },
};

export const hi = { strings, plurals };
