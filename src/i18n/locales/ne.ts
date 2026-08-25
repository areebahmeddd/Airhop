// ne: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "रद्द गर्नुहोस्",
  "common.done": "भयो",
  "common.ok": "ठीक छ",
  "common.close": "बन्द गर्नुहोस्",
  "common.back": "पछाडि",
  "common.delete": "मेटाउनुहोस्",
  "common.remove": "हटाउनुहोस्",
  "common.add": "थप्नुहोस्",
  "common.copy": "प्रतिलिपि गर्नुहोस्",
  "common.copied": "प्रतिलिपि भयो",
  "common.share": "साझा गर्नुहोस्",
  "common.continue": "जारी राख्नुहोस्",
  "common.try_again": "फेरि प्रयास गर्नुहोस्",
  "common.settings": "सेटिङ",
  "common.off": "बन्द",

  // ---- Dates ----
  "format.today": "आज",
  "format.yesterday": "हिजो",
  "format.minutes_ago": "{count} मिनेट अघि",
  "format.hours_ago": "{count} घण्टा अघि",
  "format.days_ago": "{count} दिन अघि",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "च्याट",
  "nav.tab.mesh": "मेश",
  "nav.tab.wallet": "वालेट",
  "nav.tab.profile": "तपाईं",
  "a11y.tab.new_peers": "{label}, नजिकै कोही नयाँ छ",
  "nav.notifications": "सूचना",
  "chat.subtab.channels": "च्यानल",
  "chat.subtab.direct": "सिधा",
  "chat.subtab.dms": "सिधा सन्देश",
  "chat.search.placeholder": "च्याटमा खोज्नुहोस्…",
  "chat.search.a11y": "च्याट र सन्देशमा खोज्नुहोस्",
  "chat.search.close": "खोज बन्द गर्नुहोस्",
  "chat.search.clear": "खोज सफा गर्नुहोस्",
  "mesh.view.radar": "रडार दृश्य",
  "mesh.view.list": "सूची दृश्य",
  "mesh.view.radar_short": "रडार",
  "mesh.view.list_short": "सूची",

  // ---- Legal document names ----
  "legal.last_updated": "अन्तिम पटक अद्यावधिक: {date}",
  "legal.terms": "सेवाका सर्तहरू",
  "legal.privacy": "गोपनीयता नीति",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "निजी मेश सञ्चार",
  "onboarding.welcome.cta": "सुरु गर्नुहोस्",
  "onboarding.welcome.cta_hint": "जारी राख्न तलका सर्तहरूमा सहमत हुनुहोस्",
  "onboarding.welcome.consent_a11y":
    "सेवाका सर्तहरू र गोपनीयता नीतिमा सहमत हुनुहोस्",
  "onboarding.welcome.open_terms": "सेवाका सर्तहरू खोल्नुहोस्",
  "onboarding.welcome.open_privacy": "गोपनीयता नीति खोल्नुहोस्",
  "onboarding.welcome.consent":
    "{cta} थिच्नुभएपछि तपाईं हाम्रा {terms} र {privacy} मा सहमत हुनुहुन्छ।",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "तपाईंको पहिचान बन्दै छ",
  "onboarding.identity.body":
    "यो यन्त्रमा Ed25519 कुञ्जी जोडी बन्दै छ।\nकतै केही पठाइँदैन।",
  "onboarding.identity.failed_heading": "तपाईंका कुञ्जी बन्न सकेनन्",
  "onboarding.identity.failed_body":
    "यो यन्त्रले Airhop लाई तिनलाई सुरक्षित रूपमा राख्न दिएन। फेरि प्रयास गर्नुहोस्, वा फोन पुनः सुरु गरेर Airhop फेरि खोल्नुहोस्।",
  "onboarding.identity.steps_a11y": "चरण: {steps}",
  "onboarding.identity.step.x25519": "स्थिर X25519 कुञ्जी जोडी बन्दै",
  "onboarding.identity.step.ed25519": "Ed25519 हस्ताक्षर कुञ्जी जोडी बन्दै",
  "onboarding.identity.step.keychain":
    "कुञ्जी प्रणालीको कुञ्जी सङ्ग्रहमा राख्दै",
  "onboarding.identity.step.peer_id": "पियर पहिचान निकाल्दै",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "मेशमा तपाईंको नाम",
  "onboarding.username.peer_id": "पियर पहिचान",
  "onboarding.username.card_a11y":
    "मेशमा तपाईंको नाम {username} हो। पियर पहिचान {peerID}। {props}।",
  "onboarding.username.explanation":
    "यो प्रयोगकर्ता नाम तपाईंको सार्वजनिक कुञ्जीबाट निश्चित रूपमा निस्कन्छ। तपाईंको पियर पहिचान देख्ने हरेक यन्त्रमा यो उही हुन्छ।",
  "onboarding.username.cta": "Airhop भित्र जानुहोस्",
  "onboarding.username.prop.algorithm": "एल्गोरिदम",
  "onboarding.username.prop.storage": "भण्डारण",
  "onboarding.username.prop.storage_value": "प्रणालीको कुञ्जी सङ्ग्रह मात्र",
  "onboarding.username.prop.account": "खाता चाहिन्छ",
  "onboarding.username.prop.account_value": "छैन",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop मा स्वागत छ",
  "onboarding.hello.p1":
    "नमस्कार। Airhop लाई bitchat माथि एउटा स्वतन्त्र, खुला स्रोतको सहायक परियोजनाका रूपमा बनाइएको हो। यो न bitchat परियोजना वा permissionless tech सँग सम्बद्ध छ, न तिनको समर्थनप्राप्त, बस एउटा यस्तो कुरा हो जुन बनाउन र समुदायसँग बाँड्न मलाई रमाइलो लाग्छ।",
  "onboarding.hello.p2":
    "यो iOS र Android का लागि पहिलो संस्करण हो, त्यसैले साथीहरूसँग परीक्षण गरे पनि तपाईंले केही त्रुटि भेट्नुहुने सम्भावना छ। त्यसो भयो भने, वा तपाईंसँग कुनै सुविधाको विचार छ भने, म सुन्न पाए खुसी हुनेछु। {github} मा विषय खोल्नुहोस् वा मलाई {email} मा इमेल गर्नुहोस्।",
  "onboarding.hello.p3":
    "Airhop तपाईंलाई उपयोगी भयो भने {github} मा तारा वा {store} मा समीक्षा छाड्ने विचार गर्नुहोस्। यसले थप मानिसलाई यो परियोजना भेट्न मद्दत गर्छ। प्रयास गर्नुभएकोमा धन्यवाद!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "तपाईंको फोनले सोध्नुअघि",
  "onboarding.primer.lede": "हरेकले के गर्छ, र के गर्दैन, यहाँ छ।",
  "onboarding.primer.bluetooth.title": "ब्लुटुथ",
  "onboarding.primer.bluetooth.body":
    "नजिकका यन्त्र भेट्टाउँछ र तिनका बीच सन्देश पुर्‍याउँछ। मेश यसरी नै बन्छ, र यो इन्टरनेटबिना काम गर्छ।",
  "onboarding.primer.location.title": "स्थान",
  "onboarding.primer.location.body":
    "तपाईंलाई नजिकका क्षेत्रका च्यानलमा राख्छ, एउटा टोलदेखि पूरै क्षेत्रसम्म। Airhop ले तपाईंलाई कहिल्यै पछ्याउँदैन न त तपाईंको ठ्याक्कै स्थान यन्त्रबाहिर पठाउँछ।",
  "onboarding.primer.notifications.title": "सूचना",
  "onboarding.primer.notifications.body":
    "एप बन्द हुँदा पनि नयाँ सन्देशका सूचना पाउनुहोस्। सूचना तपाईंकै यन्त्रमा स्थानीय रूपमा बन्छन्, कुनै सर्भरको संलग्नताबिना।",
  "onboarding.primer.footnote":
    "तपाईं इन्कार गर्न सक्नुहुन्छ। सन्देश अझै इन्टरनेटबाट यात्रा गर्छन्, र तपाईं पछि सेटिङमा विचार बदल्न सक्नुहुन्छ।",
  "onboarding.primer.cta_a11y": "अनुमतिका अनुरोधतिर जानुहोस्",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "ब्लुटुथ पहुँच",
  "permission.bluetooth.purpose": "मेशमार्फत नजिकका यन्त्र पत्ता लगाउन",
  "permission.open_settings": "सेटिङ खोल्नुहोस्",
  "permission.not_now": "अहिले होइन",
  "permission.blocked_title": "{label} बन्द छ",
  "permission.blocked_body": "{purpose} का लागि यसलाई सेटिङमा खोल्नुहोस्।",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "केही बिग्रियो",
  "error.boundary.body":
    "Airhop ले अनपेक्षित समस्या भोग्यो र देखाइरहेको कुरा रोक्नुपर्‍यो।",

  // ---- Chats: channel list ----
  "chat.channels.default": "पूर्वनिर्धारित च्यानल",
  "chat.channels.yours": "तपाईंका च्यानल",
  "chat.channels.none": "अझै कुनै च्यानल छैन",
  "chat.channels.none_hint":
    "सामेल हुन वा नयाँ बनाउन माथिको {plus} थिच्नुहोस्।",
  "chat.channels.none_desc":
    "अझै कुनै च्यानल छैन। सामेल हुन वा नयाँ बनाउन शीर्षकको थप्ने बटन चलाउनुहोस्।",
  "chat.channels.show_fewer": "कम पूर्वनिर्धारित च्यानल देखाउनुहोस्",
  "chat.channels.show_less": "कम देखाउनुहोस्",
  "chat.channels.info": "च्यानलको जानकारी",
  "chat.channels.pin": "च्यानल टाँस्नुहोस्",
  "chat.channels.unpin": "च्यानलको टाँस हटाउनुहोस्",
  "chat.channels.mute": "च्यानल मौन गर्नुहोस्",
  "chat.channels.unmute": "च्यानलको मौनता हटाउनुहोस्",
  "chat.channels.leave": "च्यानल छाड्नुहोस्",
  "chat.channels.leave_confirm": "छाड्नुहोस्",
  "chat.channels.clear_body":
    "{name} का सबै सन्देश मेटाउने? यो फिर्ता गर्न सकिँदैन।",
  "chat.channels.leave_body":
    "{name} छाड्ने? तपाईंले यसका सन्देश पाउन छाड्नुहुनेछ, र यसको इतिहास यो यन्त्रबाट हट्नेछ।",
  "chat.channels.more_options": "{name} का थप विकल्प",
  "chat.channels.teleported_tag": "{level}  ·  टाढाबाट",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "च्याट सफा गर्नुहोस्",
  "chat.dm.remove_contact": "सम्पर्क हटाउनुहोस्",
  "chat.dm.block": "यो पियरलाई रोक्नुहोस्",
  "chat.dm.block_confirm": "रोक्नुहोस्",
  "chat.dm.delete": "च्याट मेटाउनुहोस्",
  "chat.dm.delete_body":
    "यसले कुराकानी तपाईंको सूचीबाट हटाउँछ र यसका सन्देश मेटाउँछ। सम्पर्क रहन्छ, र उनीहरूको नयाँ सन्देशले नयाँ च्याट सुरु गर्छ।",
  "chat.dm.in_range": "दायरामा",
  "chat.dm.row_hint": "थप विकल्पका लागि दुई पटक थिचेर समाउनुहोस्",
  "chat.channels.row_hint": "थप विकल्पका लागि दुई पटक थिचेर समाउनुहोस्",
  "chat.dm.you_prefix": "तपाईं:",
  "chat.dm.none": "कुनै सिधा सन्देश छैन",
  "chat.dm.none_desc":
    "गुप्तीकृत सिधा सन्देश सुरु गर्न मेश ट्याबमा गएर कुनै पियर थिच्नुहोस्।",
  "chat.dm.contact_info": "सम्पर्कको जानकारी",
  "chat.dm.pin": "च्याट टाँस्नुहोस्",
  "chat.dm.unpin": "च्याटको टाँस हटाउनुहोस्",
  "chat.dm.mute": "च्याट मौन गर्नुहोस्",
  "chat.dm.unmute": "च्याटको मौनता हटाउनुहोस्",
  "chat.dm.clear_body":
    "{name} सँगका सबै सन्देश मेटाउने? यो फिर्ता गर्न सकिँदैन।",
  "chat.dm.remove_contact_body":
    "{name} लाई हटाउने? यसले कुराकानी मेटाउँछ र सम्पर्क बिर्सन्छ। उनीहरूले फेरि सन्देश पठाए भने अझै तपाईंसम्म पुग्न सक्छन्।",
  "chat.dm.block_body":
    "{name} लाई रोक्ने? तपाईंले उनीहरूलाई मेश ट्याबमा देख्नुहुने छैन न उनीहरूका सन्देश पाउनुहुनेछ, नजिकै भए पनि।",
  "chat.dm.more_options": "{name} का थप विकल्प",
  "chat.dm.remove_contact_short": "सम्पर्क हटाउनुहोस्",
  "chat.dm.block_short": "सम्पर्क रोक्नुहोस्",
  "chat.dm.delete_short": "च्याट मेटाउनुहोस्",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "सन्देश सफा गर्नुहोस्",
  "chat.clear_confirm": "सफा गर्नुहोस्",
  "chat.group_badge": "समूह",
  "chat.more": "थप",
  "chat.no_messages": "अझै कुनै सन्देश छैन",
  "chat.you": "तपाईं",
  "chat.a11y.channel": "च्यानल {name}",
  "chat.a11y.group": "समूह {name}",
  "chat.a11y.muted": "मौन",
  "chat.a11y.pinned": "टाँसिएको",

  // ---- Chats: start something new ----
  "chat.new.title": "केही नयाँ सुरु गर्नुहोस्",
  "chat.new.channel": "निजी च्यानल बनाउनुहोस्",
  "chat.new.channel_label": "निजी च्यानल",
  "chat.new.channel_desc":
    "यस्तो कोठा जसमा लिङ्क भएको जोसुकै सामेल हुन सक्छ। एउटा बनाउनुहोस्, वा तपाईंलाई पठाइएको लिङ्कबाट सामेल हुनुहोस्।",
  "chat.new.group": "निजी समूह बनाउनुहोस्",
  "chat.new.group_label": "निजी समूह",
  "chat.new.group_desc": "निश्चित मानिस छान्नुहोस्। 16 सम्म। ब्लुटुथमै रहन्छ।",
  "chat.new.place": "geohash बाट कुनै ठाउँमा जानुहोस्",
  "chat.new.place_label": "कुनै ठाउँमा जानुहोस्",
  "chat.new.place_desc":
    "जुनसुकै ठाउँको स्थान च्यानल त्यसको geohash बाट खोल्नुहोस्।",
  "chat.new.reach": "पहुँच",
  "chat.new.reach_internet": "सदस्यसम्म ब्लुटुथ र इन्टरनेटबाट पुग्छ।",
  "chat.new.reach_mesh": "ब्लुटुथ दायरामा चल्छ, इन्टरनेटबाट होइन।",
  "chat.new.reach_internet_desc":
    "सदस्यसम्म इन्टरनेटबाट पनि पुग्छ। रिलेले च्यानल सक्रिय छ भन्ने देख्न सक्छन्, तर कहिल्यै यसका सन्देश वा को छ भन्ने देख्दैनन्।",
  "chat.new.reach_mesh_desc":
    "स्थानीय मेशमै रहन्छ। सबैभन्दा निजी, ब्लुटुथ दायराबाहिर केही जाँदैन।",
  "chat.new.join_link": "निमन्त्रणा लिङ्कबाट निजी च्यानलमा सामेल हुनुहोस्",
  "chat.new.back_to_chooser": "छनोटमा फर्कनुहोस्",
  "chat.new.create_channel": "च्यानल बनाउनुहोस्",
  "chat.new.name_required": "पहिले च्यानलको नाम हाल्नुहोस्",
  "chat.new.name_taken": "त्यो नाम पहिल्यै लिइसकिएको छ",
  "chat.new.create": "बनाउनुहोस्",
  "chat.new.e2ee":
    "छेउदेखि छेउसम्म गुप्तीकृत। सन्देश सदस्यले मात्र पढ्न सक्छन्।",
  "chat.new.invite_only":
    "निमन्त्रणाबाट मात्र। तपाईंले लिङ्क बाँडेको जोसुकै सामेल हुन सक्छ। अरू सबैबाट यो लुकेकै रहन्छ, नजिकका पियरबाट पनि।",
  "chat.new.name_exists": "यही नामको च्यानल पहिल्यै छ।",
  "chat.new.reach_bluetooth_chip": "ब्लुटुथ मात्र",
  "chat.new.reach_internet_chip": "ब्लुटुथ + इन्टरनेट",
  "chat.new.have_link": "निमन्त्रणा लिङ्कबाट सामेल हुनुहोस्",

  // ---- Chats: join by link ----
  "chat.join.title": "लिङ्कबाट सामेल हुनुहोस्",
  "chat.join.not_airhop": "त्यो Airhop को लिङ्क होइन।",
  "chat.join.reach_internet": "सदस्यसम्म ब्लुटुथ र इन्टरनेटबाट पुग्छ।",
  "chat.join.reach_mesh": "ब्लुटुथ दायरामै रहन्छ।",
  "chat.join.contact_card":
    "एउटा सम्पर्क कार्ड। उनीहरूलाई तपाईंका सम्पर्कमा थप्छ र च्याट खोल्छ।",
  "chat.join.unverified": "त्यो लिङ्क प्रमाणित हुन सकेन",
  "chat.join.unverified_body":
    "सम्पर्क कार्ड आफ्नै कुञ्जीसँग मिल्दैन, त्यसैले थपिएन। उनीहरूलाई नयाँ पठाउन भन्नुहोस्।",
  "chat.join.paste": "क्लिपबोर्डबाट टाँस्नुहोस्",
  "chat.join.join": "सामेल हुनुहोस्",
  "chat.join.public_channel":
    "सार्वजनिक च्यानल {name}। नजिकको जोसुकैले पढ्न सक्छ।",
  "chat.join.private_channel": "निजी च्यानल {name}। {reach}",
  "chat.join.dm_with": "{name} सँग सिधा सन्देश।",
  "chat.join.joined_as": "{name} भएर सामेल हुनुभयो",
  "chat.join.name_clash_body":
    "तपाईं पहिल्यै अर्कै {name} मा हुनुहुन्छ। च्यानलका नाम त लेबल मात्र हुन्, त्यसैले यो निमन्त्रणाले आफ्नै छुट्टै च्यानल खोल्यो र तपाईं भएको च्यानल नछोइकनै रह्यो। दुवैको नाम तिनकै च्यानल जानकारीबाट बदल्न सक्नुहुन्छ।",
  "chat.join.paste_hint":
    "airhop:// बाट सुरु हुने निमन्त्रणा टाँस्नुहोस्। लिङ्क थिच्दा पनि चल्छ; यो त्यस्तो लिङ्कका लागि हो जुन थिच्न मिल्दैन।",
  "chat.join.key_note":
    "निजी च्यानलको निमन्त्रणाले कुञ्जी बोक्छ, त्यसैले सामेल हुन तुरुन्तै हुन्छ र अरू कसैलाई केही सोधिँदैन।",
  "chat.join.offline_note":
    "अफलाइन चल्छ। लिङ्क यही यन्त्रमा पढिन्छ, र च्यानल बनाउनेले मिलाएजति टाढा पुग्छ।",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "त्यो कक्ष खुल्न सकेन। केही बेरमा फेरि प्रयास गर्नुहोस्।",
  "chat.jump.title": "कुनै ठाउँमा जानुहोस्",
  "chat.jump.saved": "सुरक्षित ठाउँ",
  "chat.jump.anywhere":
    "जुनसुकै ठाउँको सार्वजनिक स्थान च्यानल खोल्नुहोस्, तपाईं नभएको ठाउँको पनि।",
  "chat.jump.geohash_note":
    "यसको geohash हाल्नुहोस्। जसको स्थान त्यो कक्षमा पर्छ, ती सबैले यो च्यानल बाँड्छन्।",
  "chat.jump.teleport_note":
    "तपाईं नजिक होइन, टाढाबाट आएको देखिनुहुन्छ। यो इन्टरनेटबाट मात्र पुग्छ।",
  "chat.jump.level_cell": "{level} तहको कक्ष",
  "chat.jump.already_here":
    "तपाईं पहिल्यै यहीँ हुनुहुन्छ। जानुहोस् ले तपाईंको {name} च्यानल खोल्छ।",
  "chat.jump.open_direction": "आफ्नो {direction} तिरको कक्ष खोल्नुहोस्",
  "chat.jump.open_place": "{name} खोल्नुहोस्",
  "chat.jump.remove_place": "{name} लाई सुरक्षित ठाउँबाट हटाउनुहोस्",
  "chat.jump.go": "जानुहोस्",
  "chat.jump.how":
    "geohash भेट्न: कुनै स्थान च्यानल खोल्नुहोस् > यसको नाम थिच्नुहोस् > त्यहीँबाट प्रतिलिपि गर्नुहोस्।",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "हरेक सदस्यसम्म पुग्न सकिएन। उनीहरू नजिकै हुँदा फेरि प्रयास गर्नुहोस्।",
  "chat.group.you_were_added": "तपाईंलाई {name} मा थपियो।",
  "chat.group.added_you": "तपाईंलाई {name} मा थपे",
  "chat.group.you_were_removed":
    "तपाईंलाई {name} बाट हटाइयो। अब तपाईं यहाँ न पढ्न सक्नुहुन्छ न सन्देश पठाउन।",
  "chat.group.removed_you": "तपाईंलाई {name} बाट हटाए",
  "chat.group.add_failed": "उनीहरूलाई थप्न सकिएन",
  "chat.group.add_failed_body":
    "केही बदलिएन। या त अहिले उनीहरूसम्म पुग्न सकिँदैन, या समूह 16 मै भरिएको छ, या बनाउने तपाईं होइन।",
  "chat.group.remove_failed": "उनीहरूलाई हटाउन सकिएन",
  "chat.group.remove_failed_body":
    "केही बदलिएन। समूहमा को हुने भन्ने बनाउनेले मात्र बदल्न सक्छ।",
  "chat.group.e2ee":
    "छेउदेखि छेउसम्म गुप्तीकृत। सन्देश सदस्यले मात्र पढ्न सक्छन्।",
  "chat.group.cap":
    "16 सम्म मानिस, तपाईंले छानेका। निमन्त्रणा लिङ्क छैन, त्यसैले कसैले लिङ्क पठाइदिएर कोही भित्रिँदैन।",
  "chat.group.bluetooth":
    "ब्लुटुथ मात्र। दायराबाहिरका सदस्यले फर्केपछि सन्देश पाउँछन्।",
  "chat.group.members_label": "सदस्य",
  "chat.group.none_in_range":
    "दायरामा कोही छैन। समूह बनाउँदा सदस्य नजिकै हुनुपर्छ।",
  "chat.group.create_title": "समूह बनाउनुहोस्",
  "chat.group.name_placeholder": "समूहको नाम",
  "chat.group.create": "बनाउनुहोस्",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "स्थानीय मेश · ब्लुटुथ मात्र",
  "chat.scope.mesh_desc":
    "ब्लुटुथ दायराभित्रका यन्त्रसम्म पुग्छ (लगभग 10 देखि 100 मिटर)। इन्टरनेट चाहिँदैन। ठाउँमै मिलेर काम गर्न उत्तम।",
  "chat.scope.block": "सहरी ब्लक · लगभग 100 मि",
  "chat.scope.block_desc":
    "एउटा सहरी ब्लकजतिको पहुँच। ब्लुटुथ दायराभन्दा अलिकति बाहिर तर नजिकै भएका पियर पनि सहभागी हुन सकून् भनेर सन्देश इन्टरनेटबाट पुल गरिन्छन्।",
  "chat.scope.neighborhood": "टोल · लगभग 1 किमि",
  "chat.scope.neighborhood_desc":
    "टोल तहको पहुँच। रिलेको सहयोगले सिधा ब्लुटुथ जडानबिना पनि पूरै क्षेत्रका पियरसम्म पुग्न सकिन्छ।",
  "chat.scope.city": "सहर · लगभग 10 किमि",
  "chat.scope.city_desc":
    "पूरै सहरको च्यानल। पूरै सहरी क्षेत्रका पियरसम्म पुग्न स्थानसँग जोडिएका इन्टरनेट रिले चलाउँछ।",
  "chat.scope.province": "प्रदेश · लगभग 100 किमि",
  "chat.scope.province_desc":
    "प्रदेश तहको पहुँच। सयौँ किलोमिटरको क्षेत्रीय पहुँचका लागि इन्टरनेटबाट पुल गरिएको।",
  "chat.scope.country": "देश वा क्षेत्र · लगभग 1000 किमि",
  "chat.scope.country_desc":
    "पूरै देशको पहुँच। क्षेत्रका Airhop वा bitchat का जुनसुकै प्रयोगकर्ता सामेल भई सन्देश पढ्न सक्छन्।",
  "chat.transport.bluetooth": "ब्लुटुथ मात्र",
  "chat.transport.both": "ब्लुटुथ + इन्टरनेट",
  "chat.transport.internet": "इन्टरनेट मात्र",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "आदेश /{cmd}: {hint}",
  "chat.cmd.hug_hint": "न्यानो अङ्गालो पठाउनुहोस्",
  "chat.cmd.slap_hint": "ठूलो माछाले हिर्काउनुहोस्",
  "chat.status.sending": "पठाउँदै…",
  "chat.status.undo_send": "पठाएको फिर्ता लिनुहोस्",
  "chat.status.undo": "फिर्ता",
  "chat.status.sent": "पठाइयो",
  "chat.status.received": "आयो",
  "chat.status.failed": "असफल",
  "chat.status.canceled": "रद्द",
  "chat.status.waiting": "पर्खाइमा",
  "chat.status.sending_short": "पठाउँदै",
  "chat.status.receiving": "लिँदै",
  "chat.thread.not_available": "यहाँ उपलब्ध छैन",
  "chat.thread.private_channel": "निजी च्यानल",
  "chat.thread.location_channel": "स्थान च्यानल",
  "chat.thread.public_channel": "सार्वजनिक च्यानल",
  "chat.thread.notices": "यो च्यानलका सूचना",
  "chat.thread.invite": "यो च्यानलमा कसैलाई निम्त्याउनुहोस्",
  "chat.thread.not_in_range": "ब्लुटुथ दायरामा छैन। इन्टरनेटबाट पुर्‍याउँदै।",
  "chat.thread.not_nearby":
    "नजिकै छैनन्। उनीहरू दायरामा फर्केपछि वा अनलाइन भएपछि हामी पुर्‍याउनेछौँ।",
  "chat.thread.no_keys":
    "उनीहरूलाई सन्देश पठाउन तपाईं ब्लुटुथ दायरामा हुनुपर्छ, वा उनीहरूको कोड स्क्यान गर्नुपर्छ।",
  "chat.geo.card_received":
    "{name} ले आफ्नो सम्पर्क बाँडे। तपाईंमध्ये कोही सरेपछि पनि कुरा जारी राख्न आफ्नो पनि बाँड्नुहोस्।",
  "chat.geo.exchange_complete":
    "सम्पर्क साटियो। अब तपाईंहरू एकअर्कासम्म जहाँबाट पनि पुग्न सक्नुहुन्छ।",
  "chat.geo.keep_person": "यो व्यक्तिलाई राख्नुहोस्",
  "chat.geo.keep_person_desc":
    "तपाईंमध्ये कोही सरेपछि पनि कुरा जारी राख्न आफ्नो सम्पर्क बाँड्नुहोस्। उनीहरूले तपाईंको स्थायी पहिचान थाहा पाउनेछन्।",
  "chat.geo.card_sent": "बाँडियो · उनीहरूको पर्खाइमा",
  "chat.thread.left_cell":
    "तपाईं यो क्षेत्र छाड्नुभयो, त्यसैले उनीहरू यहाँ तपाईंसम्म पुग्न सक्दैनन्। जहाँ पनि कुरा जारी राख्न कोड साट्नुहोस्।",
  "chat.thread.no_route":
    "अहिले उनीहरूसम्म पुग्न सकिँदैन। बाटो भेटिएपछि सन्देश जानेछ।",
  "chat.thread.empty": "अझै कुनै सन्देश छैन",
  "chat.thread.empty_desc": "गुप्तीकृत कुराकानी सुरु गर्नुहोस्।",
  "chat.thread.jump_latest": "पछिल्लो सन्देशमा जानुहोस्",
  "chat.thread.back_to_members": "सदस्यमा फर्कनुहोस्",
  "chat.thread.nostr_key": "Nostr सार्वजनिक कुञ्जी",
  "chat.thread.in_range": "दायरामा",
  "chat.voice.not_recorded": "आवाज टिपोट रेकर्ड भएन",
  "chat.thread.message": "सन्देश",
  "chat.thread.message_placeholder": "सन्देश…",
  "chat.thread.length_full": "सन्देश भरियो",
  "chat.thread.waiting_for": "{name} फर्कने पर्खाइमा · {percent}%",
  "chat.thread.peer": "पियर",
  "chat.thread.cancel_transfer": "{name} रद्द गर्नुहोस्",
  "chat.thread.queued_more": "थप {count} पठाउने पर्खाइमा",
  "chat.thread.across_bridge": "पुलपारि {count}",
  "chat.thread.bridged": "पुलबाट",
  "chat.thread.invite_body":
    "Airhop मा {channel} मा मसँग सामेल हुनुहोस् — निजी मेश सन्देश, पहिले अफलाइन।",
  "chat.thread.go_back_unread": "पछाडि जानुहोस्, {count} नपढिएका",
  "chat.thread.view_info": "{name} को जानकारी हेर्नुहोस्",
  "chat.thread.notices_new": "यो च्यानलका सूचना, {count} नयाँ",
  "chat.thread.say_something": "{channel} मा केही भन्नुहोस्।",
  "chat.thread.jump_latest_new": "पछिल्लो सन्देशमा जानुहोस्, {count} नयाँ",
  "chat.thread.unconfirmed_since": "{date} यता कुनै पुग्यो भन्ने पुष्टि छैन",
  "chat.thread.no_reach": "नजिकै पियर छैन · यो अझै कसैले पाएको छैन",
  "chat.thread.channel_needs_internet":
    "इन्टरनेट बन्द · यो च्यानल ब्लुटुथ दायराका मानिससम्म मात्र पुग्छ",
  "chat.thread.cell_needs_internet":
    "इन्टरनेट बन्द · यो कक्षसम्म इन्टरनेटबाट मात्र पुग्न सकिन्छ",
  "chat.thread.geo_dm_needs_internet":
    "इन्टरनेट बन्द · यो कुराकानी इन्टरनेटबाट मात्र बोकिन्छ",
  "chat.thread.via_gateway":
    "इन्टरनेट बन्द · नजिकको एउटा यन्त्रले यो तपाईंका लागि अनलाइन बोक्दै छ",
  "chat.thread.group_queued":
    "यो समूहको कोही अझै नजिकै छैन। उनीहरू आएपछि यो पुग्नेछ।",
  "chat.thread.no_group_key":
    "तपाईं अब यो समूहमा हुनुहुन्न, त्यसैले यो पठाउन मिल्दैन",
  "chat.thread.no_reach_offline":
    "इन्टरनेट बन्द र नजिकै पियर छैन · यो अझै कसैले पाएको छैन",
  "chat.thread.mention": "{name} लाई उल्लेख गर्नुहोस्",
  "chat.thread.someone_talking": "{hold}। {name} बोल्दै हुनुहुन्छ।",
  "chat.thread.attach_note":
    "फाइल ब्लुटुथ दायरामा मात्र जान्छन्। पाठ र भुक्तानी इन्टरनेटका सम्पर्कसम्म पुग्छन्; संलग्नक पुग्दैनन्।",
  "chat.thread.message_peer": "{name} लाई सन्देश पठाउनुहोस्",
  "chat.thread.send": "सन्देश पठाउनुहोस्",
  "chat.thread.group": "समूह",
  "chat.bridge.nearby_only": "नजिक मात्र: यो सन्देश मेश पुलबाट टाढा राख्नुहोस्",
  "chat.bridge.nearby_label": "नजिक मात्र · ब्लुटुथमै रहन्छ",
  "chat.bridge.bridging_label":
    "नजिकका क्षेत्रसँग पुल जोड्दै · नजिक मात्रका लागि थिच्नुहोस्",
  "chat.screenshot.you_took": "तपाईंले स्क्रिन तस्बिर खिच्नुभयो",
  "chat.screenshot.you_took_private":
    "तपाईंले स्क्रिन तस्बिर खिच्नुभयो · कसैलाई भनिएन",
  "chat.screenshot.heads_up": "सावधान",
  "chat.screenshot.notice": "* {name} ले स्क्रिन तस्बिर खिचे *",
  "chat.screenshot.notified_dm":
    "{name} लाई तपाईंले यो कुराकानीको स्क्रिन तस्बिर खिच्नुभयो भनी जानकारी गराइयो।",
  "chat.screenshot.notified":
    "यो च्यानलका सबैलाई तपाईंले स्क्रिन तस्बिर खिच्नुभयो भनी जानकारी गराइयो।",
  "chat.screenshot.not_notified":
    "कसैलाई जानकारी गराइएन। यो च्यानल सार्वजनिक हो, त्यसैले स्क्रिन तस्बिरको घोषणाले तपाईं यहाँ हुनुहुन्थ्यो भन्ने अभिलेख बनाउँथ्यो।",
  "chat.thread.error": "त्रुटि",
  "chat.thread.go_back": "पछाडि जानुहोस्",
  "chat.bubble.via_bridge": "मेश पुलबाट",
  "chat.bubble.view_profile": "{name} को प्रोफाइल हेर्नुहोस्",
  "chat.bubble.forwarded": "पठाइएको",
  "chat.bubble.attachment": "संलग्नक",
  "chat.bubble.a11y": "{sender}: {body}। थप विकल्पका लागि थिचिराख्नुहोस्।",
  "chat.bubble.failed_retry": "पठाउन सकिएन। फेरि प्रयास गर्न थिच्नुहोस्।",

  // ---- Chats: message actions and info ----
  "chat.info.title": "सन्देशको जानकारी",
  "chat.info.delivered_to": "{name} सम्म पुग्यो",
  "chat.info.read_by": "{name} ले पढे",
  "chat.info.group_reach_desc":
    "अहिले पुग्न सकिने, यो पुग्यो भन्ने पुष्टि होइन",
  "chat.info.group_alone": "अरू सदस्य छैनन्",
  "chat.info.today_at": "आज {time}",
  "chat.info.sending": "पठाउँदै…",
  "chat.info.failed": "पठाउन सकिएन",
  "chat.info.courier": "एक साथीले बोके",
  "chat.info.sent": "पठाइयो",
  "chat.info.queued": "पठाउने पर्खाइमा",
  "chat.info.waiting": "पर्खँदै…",
  "chat.action.info": "सन्देशको जानकारी",
  "chat.action.save_photos": "तस्बिरमा सुरक्षित गर्नुहोस्",
  "chat.action.save_copy": "एक प्रति सुरक्षित गर्नुहोस्",
  "chat.action.forward": "पठाउनुहोस्",
  "chat.action.select": "छान्नुहोस्",
  "chat.select.cancel": "छनोट रद्द गर्नुहोस्",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "क्यामेरा",
  "chat.attach.camera_desc": "तस्बिर वा भिडियो खिच्नुहोस्",
  "chat.attach.library": "तस्बिर ग्यालरी",
  "chat.attach.library_desc": "आफ्नो ग्यालरीबाट छान्नुहोस्",
  "chat.attach.document": "कागजात",
  "chat.attach.document_desc": "कुनै पनि फाइल वा PDF पठाउनुहोस्",
  "chat.attach.voice": "आवाज टिपोट",
  "chat.attach.voice_desc": "आवाज सन्देश रेकर्ड गरी पठाउनुहोस्",
  "chat.attach.ecash": "ecash पठाउनुहोस्",
  "chat.attach.ecash_desc": "आफ्नो वालेटबाट Cashu का sat पठाउनुहोस्",
  "chat.attach.location": "स्थान",
  "chat.attach.location_desc": "तपाईं अहिले कहाँ हुनुहुन्छ पठाउनुहोस्",
  "chat.attach.title": "जोड्नुहोस्",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "स्थान बाँडे",
  "chat.location.received_summary": "आफ्नो स्थान बाँडे",
  "chat.location.title": "स्थान",
  "chat.location.away": "{distance} {direction} तिर",
  "chat.location.taken": "{ago} अघि लिइएको",
  "chat.location.open_maps": "नक्सामा खोल्नुहोस्",
  "chat.location.no_forward": "स्थान अरूलाई पठाइँदैन",
  "chat.location.no_forward_body":
    "स्थान एक जनालाई मात्र पठाइन्छ। अरू कसैसँग होस् भन्ने चाहनुहुन्छ भने बरु आफ्नो बाँड्नुहोस्।",
  "chat.location.no_fix": "यो कति टाढा छ हेर्न स्थानको अनुमति दिनुहोस्",
  "chat.location.send_title": "आफ्नो स्थान पठाउनुहोस्",
  "chat.location.send_body":
    "{name} ले एउटा बिन्दु देख्नेछन्: तपाईं अहिले कहाँ हुनुहुन्छ। यो अद्यावधिक भइरहँदैन।",
  "chat.location.send": "स्थान पठाउनुहोस्",
  "chat.location.finding": "तपाईंको स्थान खोज्दै…",
  "chat.location.no_location": "तपाईंको स्थान लिन सकिएन",
  "chat.location.no_location_body":
    "स्थान पहुँचलाई अनुमति दिनुहोस् र स्थान सेवा खुला छ भन्ने पक्का गर्नुहोस्, अनि फेरि प्रयास गर्नुहोस्।",
  "chat.location.not_delivered": "तपाईंको स्थान पठाउन सकिएन",
  "chat.location.not_delivered_body":
    "स्थान ताजा हुँदा मात्र पठाउन लायक हुन्छ, त्यसैले यो पछिका लागि लाइनमा राखिँदैन। {name} सम्म पुग्न सकिने भएपछि फेरि प्रयास गर्नुहोस्।",
  "chat.location.direction.n": "उत्तर",
  "chat.location.direction.ne": "उत्तरपूर्व",
  "chat.location.direction.e": "पूर्व",
  "chat.location.direction.se": "दक्षिणपूर्व",
  "chat.location.direction.s": "दक्षिण",
  "chat.location.direction.sw": "दक्षिणपश्चिम",
  "chat.location.direction.w": "पश्चिम",
  "chat.location.direction.nw": "उत्तरपश्चिम",
  "chat.attach.send_anyway": "जे भए पनि पठाउनुहोस्",
  "chat.attach.bitchat_too_big": "यो नपुग्न सक्छ",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat मा हुनुहुन्छ, जसले ठूलो फाइलमा बीचैमा हार मान्छ। लगभग 350 KiB भन्दा कम भरपर्दो हुन्छ। Airhop को सम्पर्कलाई पठाउँदा त्यस्तो सीमा हुँदैन।",
  "chat.attach.bitchat_unopenable": "उनीहरूले यो खोल्न नसक्न सक्छन्",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat मा हुनुहुन्छ, जसले तस्बिर र आवाज टिपोट देखाउँछ तर अरू सबैलाई आफूले खोल्न नसक्ने फाइलका रूपमा सूचीबद्ध गर्छ। यो पुग्छ, बस उनीहरूले हेर्न नसक्न सक्छन्।",
  "chat.attach.file": "फाइल जोड्नुहोस्",
  "chat.attach.unavailable": "यहाँ संलग्नक उपलब्ध छैनन्",
  "chat.attach.not_sent": "संलग्नक पठाइएन",
  "chat.attach.read_failed":
    "त्यो फाइल पढ्दा केही बिग्रियो। अर्को प्रयास गर्नुहोस्।",
  "chat.attach.caption": "क्याप्सन लेख्नुहोस्…",
  "chat.attach.send": "संलग्नक पठाउनुहोस्",
  "chat.attach.generic": "संलग्नक",
  "chat.media.view_full": "तस्बिर पूरै स्क्रिनमा हेर्नुहोस्",
  "chat.media.gone_photo": "तस्बिर यो यन्त्रमा छैन",
  "chat.media.gone_video": "भिडियो यो यन्त्रमा छैन",
  "chat.media.gone_voice": "आवाज टिपोट यो यन्त्रमा छैन",
  "chat.media.gone_file": "फाइल यो यन्त्रमा छैन",
  "chat.media.gone_note": "7 दिनपछि वा क्यास सफा हुँदा हटाइयो",
  "chat.media.ask_resend": "फेरि माग्नुहोस्",
  "chat.media.resend_draft": "{kind} फेरि पठाइदिन सक्नुहुन्छ?",
  "chat.media.kind_photo": "त्यो तस्बिर",
  "chat.media.kind_video": "त्यो भिडियो",
  "chat.media.kind_voice": "त्यो आवाज टिपोट",
  "chat.media.kind_file": "त्यो फाइल",
  "chat.media.pause_voice": "आवाज टिपोट रोक्नुहोस्",
  "chat.media.play_voice": "आवाज टिपोट बजाउनुहोस्",
  "chat.media.voice_position": "आवाज टिपोटमा ठाउँ",
  "chat.media.voice_scrub": "त्यो बिन्दुमा जान धर्काहरूमा थिच्नुहोस्",
  "chat.media.image": "तस्बिर",
  "chat.media.tap_load_photo": "तस्बिर ल्याउन थिच्नुहोस्",
  "chat.media.open_document": "{name} खोल्नुहोस्",
  "chat.media.document": "कागजात",
  "chat.media.tap_load_video": "भिडियो ल्याउन थिच्नुहोस्",
  "chat.media.video": "भिडियो",
  "chat.media.photo": "तस्बिर",
  "chat.media.close_photo": "तस्बिर बन्द गर्नुहोस्",
  "chat.media.save_photo": "तस्बिर आफ्ना तस्बिरमा सुरक्षित गर्नुहोस्",
  "chat.media.share_photo": "तस्बिर साझा गर्नुहोस्",
  "chat.media.saved_videos": "तपाईंका भिडियोमा सुरक्षित भयो",
  "chat.media.saved_photos": "तपाईंका तस्बिरमा सुरक्षित भयो",
  "chat.media.not_saved": "सुरक्षित भएन",
  "chat.media.cant_open": "फाइल खोल्न मिल्दैन",
  "chat.media.no_app": "यो यन्त्रमा यो फाइल खोल्ने वा साझा गर्ने कुनै एप छैन।",
  "chat.media.open_failed": "फाइल खुल्न सकेन। यो क्यासबाट हटेको हुन सक्छ।",
  "media.blocked.nostr_only":
    "तपाईं यो व्यक्तिलाई रिलेमार्फत मात्र चिन्नुहुन्छ। पाठ मात्र उपलब्ध छ। तस्बिर, फाइल र आवाज टिपोटका लागि ब्लुटुथ चाहिन्छ।",
  "media.blocked.private_channel":
    "प्रसारित संलग्नकमा हस्ताक्षर हुन्छ तर गुप्तीकरण हुँदैन, त्यसैले त्यसलाई निजी च्यानलमा पठाउँदा त्यो खुलै रहन्थ्यो जबकि यहाँको पाठ गुप्तीकृत नै रहन्छ।",
  "media.blocked.private_group":
    "प्रसारित संलग्नकमा हस्ताक्षर हुन्छ तर गुप्तीकरण हुँदैन, त्यसैले त्यसलाई निजी समूहमा पठाउँदा त्यो खुलै रहन्थ्यो जबकि यहाँको पाठ गुप्तीकृत नै रहन्छ।",
  "media.blocked.location_channel":
    "स्थान च्यानल मानिससम्म इन्टरनेटबाट पुग्छ, र तस्बिर, फाइल र आवाज टिपोट ब्लुटुथबाट यात्रा गर्छन्, त्यसैले ती कहिल्यै पुग्ने थिएनन्।",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "यहाँ आवाज टिपोट उपलब्ध छैनन्",
  "chat.voice.hold_live": "प्रत्यक्ष बोल्न थिचिराख्नुहोस्",
  "chat.voice.hold_record": "आवाज टिपोट रेकर्ड गर्न थिचिराख्नुहोस्",
  "chat.voice.cancel_recording": "रेकर्डिङ रद्द गर्नुहोस्",
  "chat.voice.slide_cancel": "रद्द गर्न सार्नुहोस्",
  "chat.voice.release_cancel": "रद्द गर्न छाड्नुहोस्",
  "chat.voice.a11y_toggle": "बोल्न सुरु वा बन्द गर्न दुई पटक थिच्नुहोस्।",
  "chat.voice.limit_reached": "दुई मिनेटको सीमा पुग्यो, पठाउन छाड्नुहोस्",
  "chat.voice.limit_sent": "दुई मिनेटको सीमा पुग्यो, टिपोट पठाइयो",
  "chat.voice.stop_send": "रेकर्डिङ रोकेर पठाउनुहोस्",
  "chat.voice.lift_lock": "हात छाडेर रेकर्ड गर्न माथि सार्नुहोस्",
  "chat.voice.live_speaking": "{name} बोल्दै हुनुहुन्छ",
  "voice.unavailable": "प्रत्यक्ष आवाज उपलब्ध छैन",
  "voice.recording_stopped": "रेकर्डिङ रोकियो",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "क्यामेरा पहुँच",
  "chat.perm.camera_purpose": "पठाउन तस्बिर खिच्न",
  "chat.perm.photo_label": "तस्बिर पहुँच",
  "chat.perm.photo_purpose": "पठाउन तस्बिर वा भिडियो छान्न",
  "chat.perm.photo_save_purpose": "यो आफ्ना तस्बिरमा सुरक्षित गर्न",
  "chat.perm.mic_label": "माइक्रोफोन पहुँच",
  "chat.perm.mic_live_purpose": "नजिकका मानिससँग कुरा गर्न",
  "chat.perm.mic_note_purpose": "आवाज टिपोट रेकर्ड गर्न",
  "chat.perm.recording_stopped": "रेकर्डिङ रोकियो",
  "chat.perm.record_failed":
    "रेकर्डिङ सुरु हुन सकेन। माइक्रोफोनका अनुमति जाँच्नुहोस्।",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "लिइयो",
  "chat.ecash.reclaimed": "फिर्ता लिइयो",
  "chat.ecash.claiming": "लिँदै…",
  "chat.ecash.claim": "लिनुहोस्",
  "chat.ecash.claim_amount": "{amount} {unit} लिनुहोस्",
  "chat.ecash.already_claimed": "पहिल्यै लिइसकियो",
  "chat.ecash.already_claimed_body":
    "यो टोकनको हरेक प्रमाण पहिल्यै तपाईंको वालेटमा छ, त्यसैले केही थपिएन।",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "सकेसम्म पुर्‍याउन मेशलाई सुम्पिएको",
  "chat.info.queued_desc": "उनीहरूसम्म बाटो नभेटिएसम्म यही फोनमा राखिएको",
  "chat.info.reclaimed": "फिर्ता लिइयो",
  "chat.info.reclaimed_desc":
    "तपाईंले यो भुक्तानी आफ्नो वालेटमा फिर्ता लिनुभयो, त्यसैले यो पुर्‍याइने छैन",
  "chat.info.about": "बारेमा",
  "chat.info.group_desc":
    "एउटा निजी समूह। बनाउनेले थपेका सदस्यले मात्र पढ्न सक्छन्, र यो ब्लुटुथमै रहन्छ।",
  "chat.info.teleported_desc":
    "यो geohash कक्षको सार्वजनिक स्थान च्यानल। त्यो कक्षका जोसुकै, Airhop मा होस् वा bitchat मा, यसलाई इन्टरनेटबाट बाँड्छन्। तपाईं टाढाबाट आउनुभएको हो, यहाँ शारीरिक रूपमा हुनुहुन्न।",
  "chat.info.custom_desc":
    "आफ्नै बनाएको च्यानल। नाम थाहा भएको जोसुकै Airhop वा bitchat भएको कुनै पनि यन्त्रबाट सामेल हुन सक्छ।",
  "chat.info.private_e2ee": "निजी · छेउदेखि छेउसम्म गुप्तीकृत",
  "chat.info.public_plain": "सार्वजनिक · गुप्तीकृत छैन",
  "chat.info.group_privacy":
    "यो समूह तल देखाइएका सदस्यले मात्र पढ्न सक्छन्। सन्देश ब्लुटुथमै रहन्छन्, त्यसैले दायराबाहिरका सदस्यले फर्केपछि पाउँछन्।",
  "chat.info.teleport_privacy":
    "तपाईं टाढाबाट आइपुगेको ठाउँ। यो कक्षका सबैसम्म इन्टरनेटबाट पुग्छ, र ब्लुटुथ दायराका कसैसम्म पुग्दैन।",
  "chat.info.location_off_privacy":
    "स्थान बन्द छ, त्यसैले यो च्यानल नजिकका यन्त्रसम्म ब्लुटुथबाट मात्र पुग्छ। यसको क्षेत्र कक्षसम्म इन्टरनेटबाट पुग्न स्थान खोल्नुहोस्।",
  "chat.info.invite_privacy":
    "तपाईंले लिङ्कबाट निम्त्याएका मानिसले मात्र पढ्न सक्छन्। अरू सबैबाट यो लुकेकै रहन्छ, नजिकका पियरबाट पनि।",
  "chat.info.public_privacy":
    "सामेल हुने जोसुकैले हरेक सन्देश पढ्न सक्छ। निजी कुराका लागि सिधा सन्देश चलाउनुहोस्; सिधा सन्देश छेउदेखि छेउसम्म गुप्तीकृत हुन्छन्।",
  "chat.info.remove_member": "सदस्य हटाउनुहोस्",
  "chat.info.remove_member_body":
    "{name} लाई समूहबाट हटाउने? समूहको कुञ्जी फेरिन्छ, त्यसैले उनीहरूले नयाँ सन्देश पढ्न सक्दैनन्।",
  "chat.info.message_member": "{name} लाई सन्देश पठाउनुहोस्",
  "chat.info.remove_member_a11y": "{name} हटाउनुहोस्",
  "chat.info.no_addable":
    "थप्न मिल्ने पुग्न सकिने पियर छैनन्। सदस्य नजिकै हुनुपर्छ।",
  "chat.info.add_count": "{count} थप्नुहोस्",
  "chat.info.teleported_tag": "{level}  ·  टाढाबाट",
  "chat.info.active": "सक्रिय",
  "chat.info.members": "सदस्य",
  "chat.info.bookmark": "यो ठाउँ सुरक्षित गर्नुहोस्",
  "chat.info.remove_bookmark": "सुरक्षित ठाउँबाट हटाउनुहोस्",
  "chat.info.default_notice":
    "पूर्वनिर्धारित च्यानल छाड्न मिल्दैन। ती Airhop को मेश प्रोटोकलकै हिस्सा हुन्।",
  "chat.info.custom_channel": "आफ्नै बनाएको च्यानल",
  "chat.info.geohash": "geohash",
  "chat.info.copy_geohash": "geohash प्रतिलिपि गर्नुहोस्",
  "chat.info.relays": "रिले",
  "chat.info.show_relays": "यो च्यानल बोक्ने रिले देखाउनुहोस्",
  "chat.info.relay_custom": "आफ्नै",
  "chat.info.relays_none": "छैन। यो कक्ष अहिले ब्लुटुथ मात्र हो।",
  "chat.info.search_members": "सदस्य खोज्नुहोस्",
  "chat.info.search_members_placeholder": "सदस्य खोज्नुहोस्…",
  "chat.info.teleported": "टाढाबाट",
  "chat.info.creator": "बनाउने",
  "chat.info.no_matches": "केही मिलेन",
  "chat.info.no_one_here": "यहाँ अझै कोही छैन",
  "chat.info.add_members": "सदस्य थप्नुहोस्",
  "chat.info.add_selected": "छानिएका सदस्य थप्नुहोस्",
  "chat.info.add": "थप्नुहोस्",
  "chat.info.leave_group": "समूह छाड्नुहोस्",
  "chat.info.leave_channel": "च्यानल छाड्नुहोस्",
  "chat.info.leave": "छाड्नुहोस्",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} देखि कुरा गर्दै",
  "chat.contact.verified_since": "{date} देखि प्रमाणित",
  "chat.contact.anonymous": "बेनामी",
  "chat.contact.anonymous_desc":
    "प्रमाणित गर्न टिकाउ पहिचान नभएको geohash को छद्म नाम",
  "chat.contact.verified": "प्रमाणित",
  "chat.contact.verified_desc": "तपाईंले उनीहरूको QR कोड स्क्यान गर्नुभयो",
  "chat.contact.verified_desc_compared": "तपाईंहरूले कोड मिलाएर हेर्नुभयो",
  "chat.contact.not_verified": "प्रमाणित छैन",
  "chat.contact.not_verified_desc":
    "यो साँच्चै उनीहरू नै हुन् भनी पक्का गर्न उनीहरूको कोड स्क्यान गर्नुहोस्, वा कलमा कुनै कोड मिलाएर हेर्नुहोस्",
  "chat.contact.e2ee": "छेउदेखि छेउसम्म गुप्तीकृत",
  "chat.contact.e2ee_nostr":
    "NIP-17 अनुसार बेरिएको, त्यसैले रिलेले पढ्न सक्दैनन्",
  "chat.contact.e2ee_mesh": "Noise XX, र Airhop भएका यन्त्रबीच Double Ratchet",
  "chat.contact.copy_nostr": "Nostr सार्वजनिक कुञ्जी प्रतिलिपि गर्नुहोस्",
  "chat.contact.nostr_key": "Nostr सार्वजनिक कुञ्जी",
  "chat.contact.cell_key_note":
    "यो कुञ्जी तपाईंहरू भेटेको क्षेत्रको हो। तपाईंमध्ये कोही सरे यो फेरिन्छ, र त्यससँगै कुराकानी टुङ्गिन्छ। जहाँ पनि कुरा गर्न सम्पर्क साट्नुहोस्।",
  "chat.contact.peer_name": "पियरको नाम",
  "chat.contact.peer_id": "पियर पहिचान",
  "chat.contact.rename": "नाम बदल्नुहोस्",
  "chat.contact.rename_needs_contact":
    "जसका कुञ्जी तपाईंसँग छन्, तिनको नाम बदल्न सक्नुहुन्छ। पहिले सम्पर्क कार्ड साट्नुहोस्, अनि यो तपाईंले मात्र देख्ने नाम बन्छ।",
  "chat.contact.rename_needs_keys":
    "यो सम्पर्कका लागि अझै कुञ्जी छैनन्। उनीहरूलाई सन्देश पठाउनुहोस्, वा उनीहरूको कोड स्क्यान गर्नुहोस्, अनि तपाईंले मात्र देख्ने नाम दिन सक्नुहुन्छ।",
  "chat.contact.renamed_by_you": "उनीहरूका लागि तपाईंले राखेको नाम",
  "chat.contact.copy_peer_id": "पियर पहिचान प्रतिलिपि गर्नुहोस्",
  "chat.contact.verify": "सम्पर्क प्रमाणित गर्नुहोस्",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "सूचना",
  "chat.notices.post_area": "यो क्षेत्रमा सूचना टाँस्नुहोस्",
  "chat.notices.post_mesh": "मेशमा सूचना टाँस्नुहोस्",
  "chat.notices.mark_urgent": "जरुरी चिनो लगाउनुहोस्",
  "chat.notices.post": "सूचना टाँस्नुहोस्",
  "chat.notices.post_short": "टाँस्नुहोस्",
  "chat.notices.delete": "सूचना मेटाउनुहोस्",
  "chat.notices.just_now": "भर्खरै",
  "chat.notices.fades_soon": "चाँडै मेटिन्छ",
  "chat.notices.1_day": "1 दिन",
  "chat.notices.3_days": "3 दिन",
  "chat.notices.7_days": "7 दिन",
  "chat.notices.fading": "मेटिँदै",
  "chat.notices.fades_in_hours": "{count} घण्टामा मेटिन्छ",
  "chat.notices.fades_in_days": "{count} दिनमा मेटिन्छ",
  "chat.notices.scope_geo": "भू",
  "chat.notices.scope_mesh": "मेश",
  "chat.notices.urgent_short": "जरुरी",
  "chat.notices.permanent_warning":
    "कहिल्यै मेटिँदैन। सार्वजनिक छ र यही क्षेत्रसँग बाँधिएको, र तपाईंले फिर्ता लिन सक्नुहुन्न।",
  "chat.notices.none":
    "अझै कुनै सूचना छैन। अरूका लागि यहीँ रहोस् भनेर एउटा टाँस्नुहोस्।",

  // ---- Chats: search results ----
  "chat.search.photos": "तस्बिर",
  "chat.search.videos": "भिडियो",
  "chat.search.audio": "अडियो",
  "chat.search.documents": "कागजात",
  "chat.search.links": "लिङ्क",
  "chat.search.ecash": "ecash",
  "chat.search.filter_by": "{filter} अनुसार छान्नुहोस्",
  "chat.search.no_matches": "”{query}“ सँग मिल्ने {filter} छैन",
  "chat.search.no_media": "अझै कुनै {filter} छैन",
  "chat.search.result_a11y": "{chat}, {sender} बाट {kind}",
  "chat.search.you": "तपाईं",
  "chat.search.section_chats": "च्याट",
  "chat.search.section_messages": "सन्देश",
  "chat.search.section_notices": "सूचना",
  "chat.search.hint":
    "सन्देश र च्याटमा खोज्नुहोस्, वा माथिबाट कुनै छनोट रोज्नुहोस्।",
  "chat.search.no_results": "”{query}“ का लागि केही भेटिएन",
  "chat.search.open_chat": "{name} खोल्नुहोस्",
  "chat.search.message_a11y": "{chat}, {sender} को सन्देश: {snippet}",
  "chat.search.notice_a11y": "{chat} मा {author} को सूचना: {snippet}",
  "chat.search.urgent": "जरुरी ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "यो सूचीमा {count} छन्। सफा गर्दा ती यहाँबाट मात्र हट्छन्, र सन्देश आफ्नै कुराकानीमा नपढिएकै रहन्छन्। सबै पढियो भनेर चिनो लगाउँदा दुवै मिल्छन्।",
  "chat.notif.mark_all_read": "सबै पढियो चिनो लगाउनुहोस्",
  "chat.notif.clear_list": "सूची सफा गर्नुहोस्",
  "chat.notif.clear_all_a11y": "सबै {count} सूचना सफा गर्नुहोस्",
  "chat.notif.title": "सूचना",
  "chat.notif.clear_short": "सफा गर्नुहोस्",
  "chat.notif.close": "सूचना बन्द गर्नुहोस्",
  "chat.notif.none": "अझै कुनै सूचना छैन",
  "chat.notif.none_desc":
    "तपाईंका च्यानल र च्याटका सन्देश, उल्लेख र सूचना यहाँ देखिन्छन्।",
  "chat.notif.new": "नयाँ",
  "chat.notif.notice_in": "{channel} मा सूचना",

  // ---- Chats: forward ----
  "chat.forward.title": "यसलाई पठाउनुहोस्…",
  "chat.forward.to": "{name} लाई पठाउनुहोस्",
  "chat.forward.cant_send_here": "यहाँ पठाउन मिल्दैन",
  "chat.forward.cant_send_to": "{name} लाई पठाउन मिल्दैन",
  "chat.forward.channels": "च्यानल",
  "chat.forward.groups": "समूह",
  "chat.forward.locations": "स्थान",
  "chat.forward.dms": "सिधा सन्देश",
  "chat.forward.none": "अझै अरू च्याट छैनन्",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "मेश सुरु हुँदै…",
  "mesh.banner.no_bluetooth": "यो यन्त्रमा ब्लुटुथ छैन · इन्टरनेट मात्र",
  "mesh.banner.bluetooth_off": "ब्लुटुथ बन्द · मेश उपलब्ध छैन",
  "mesh.banner.permission_needed": "ब्लुटुथ अनुमति चाहिन्छ",
  "mesh.banner.blocked": "ब्लुटुथ रोकिएको · सेटिङमा अनुमति दिनुहोस्",
  "mesh.banner.location_permission": "पियर भेट्न स्थान चाहिन्छ",
  "mesh.banner.advertising_unsupported":
    "यो फोनले अरूलाई देख्न सक्छ तर आफू पत्ता लाग्न सक्दैन",
  "mesh.banner.location_off_android":
    "स्थान बन्द · पियर भेट्न Android लाई यो चाहिन्छ",
  "mesh.banner.paused": "मेश रोकिएको · तपाईं टाढा हुनुहुन्छ",
  "mesh.banner.location_off": "स्थान बन्द · स्थान च्यानल उपलब्ध छैनन्",
  "mesh.banner.battery_saver": "ब्याट्री बचत · कम पटक खोज्दै",
  "mesh.banner.wipe_incomplete":
    "सफाइ अधुरो · केही डेटा बाँकी हुन सक्छ, फेरि खोल्दा पुनः प्रयास हुन्छ",
  "mesh.banner.wifi_off": "वाइफाइ बन्द · ठूला फाइल ढिलो जान्छन्",
  "mesh.banner.clock_skew":
    "यो फोनको घडी गलत छ · मिति र समय स्वचालित बनाउनुहोस्",
  "mesh.banner.internet_off": "इन्टरनेट बन्द · ब्लुटुथ मात्र",
  "mesh.banner.relaying": "नजिकै पियर छैन · Nostr मार्फत पुर्‍याउँदै",
  "mesh.banner.tor": "Tor खुला · इन्टरनेट ट्राफिक अर्कै बाटो पठाइँदै",
  "mesh.banner.tor_starting": "Tor सुरु हुँदै · जोडिँदै",
  "mesh.banner.tor_blocked": "Tor जोडिन सकेन · मेश भने चलिरहेको छ",
  "mesh.banner.gateway": "इन्टरनेट गेटवे खुला · नजिकका पियरका लागि पुर्‍याउँदै",
  "mesh.banner.bridge": "मेश पुल खुला · सार्वजनिक च्याट जोडियो",
  "mesh.banner.background_limits": "{brand} ले पृष्ठभूमिमा मेश रोक्न सक्छ",
  "mesh.banner.bridge_across": "मेश पुल खुला · पुलपारि {count}",
  "mesh.banner.action.turn_on": "खोल्नुहोस्",
  "mesh.banner.action.allow": "अनुमति दिनुहोस्",
  "mesh.banner.action.resume": "जारी राख्नुहोस्",
  "mesh.banner.action.fix": "मिलाउनुहोस्",
  "mesh.banner.hint.resume": "ब्लुटुथ प्रसारण र खोजी फेरि खोल्छ",
  "mesh.banner.hint.enable_bluetooth": "Android लाई ब्लुटुथ खोल्न भन्छ",
  "mesh.banner.hint.location_settings": "प्रणालीको स्थान सेटिङ खोल्छ",
  "mesh.banner.hint.app_settings": "प्रणाली सेटिङमा Airhop का अनुमति खोल्छ",
  "mesh.banner.hint.battery_settings": "यो फोनको पृष्ठभूमि गतिविधि सेटिङ खोल्छ",
  "mesh.banner.dismiss": "हटाउनुहोस्: {label}",
  "mesh.banner.hint.dismiss": "यो टिपोट सधैँका लागि लुकाउँछ",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "नजिकका पियर खोज्दै…",
  "mesh.radar.starting": "मेश सुरु हुँदै…",
  "mesh.radar.no_bluetooth": "यो यन्त्रमा ब्लुटुथ छैन",
  "mesh.radar.bluetooth_off": "ब्लुटुथ बन्द · खोज्दै छैन",
  "mesh.radar.permission_needed": "ब्लुटुथ अनुमति चाहिन्छ",
  "mesh.radar.blocked": "ब्लुटुथ रोकिएको",
  "mesh.radar.location_permission": "स्थान अनुमति चाहिन्छ",
  "mesh.radar.location_off": "स्थान बन्द · खोज्दै छैन",
  "mesh.radar.hint_rings": "घेराहरूले BLE सङ्केतको बल देखाउँछन्, दूरी होइन",
  "mesh.radar.hint_checking": "ब्लुटुथ र अनुमति जाँच्दै",
  "mesh.radar.hint_internet": "सन्देश अझै इन्टरनेटबाट यात्रा गर्छन्",
  "mesh.radar.hint_turn_on": "पियर पत्ता लगाउन ब्लुटुथ खोल्नुहोस्",
  "mesh.radar.hint_allow": "पियर पत्ता लगाउन ब्लुटुथलाई अनुमति दिनुहोस्",
  "mesh.radar.hint_allow_settings":
    "पियर पत्ता लगाउन सेटिङमा ब्लुटुथलाई अनुमति दिनुहोस्",
  "mesh.radar.hint_location_permission":
    "Android 11 र सोभन्दा पुरानालाई ब्लुटुथबाट खोज्न स्थान चाहिन्छ",
  "mesh.radar.hint_android_location":
    "ब्लुटुथ खोजीका नतिजा फर्काउन Android लाई स्थान खुला चाहिन्छ",
  "mesh.radar.signal_strong": "बलियो",
  "mesh.radar.signal_medium": "मध्यम",
  "mesh.radar.signal_weak": "कमजोर",
  "mesh.radar.you_center": "तपाईं, मेशको केन्द्रमा",
  "mesh.radar.sonar_hint": "सोनार बजाउँछ। खोजी त पहिल्यै निरन्तर चलिरहेको छ।",
  "mesh.radar.paused": "मेश रोकिएको · तपाईं टाढा हुनुहुन्छ",
  "mesh.radar.ring_hint": "घेरामा रहेको ठाउँले सङ्केतको बल जनाउँछ, दूरी होइन",
  "mesh.radar.set_online":
    "पियर पत्ता लगाउन तपाईं ट्याबमा आफ्नो स्थिति अनलाइन बनाउनुहोस्",
  "mesh.radar.in_range": "दायरामा",
  "mesh.radar.recently_seen": "भर्खरै देखिएका",
  "mesh.radar.peer_hint":
    "यो पियरलाई सन्देश पठाउने वा भुक्तानी गर्ने विकल्प खोल्छ",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "भर्खरै",
  "mesh.peer.none": "नजिकै पियर छैन",
  "mesh.peer.none_desc":
    "ब्लुटुथ दायराभित्रका Airhop वा bitchat भएका अरू यन्त्र यहाँ देखिन्छन्।",
  "mesh.peer.id_copied": "पियर पहिचान प्रतिलिपि भयो",
  "mesh.peer.copy_id": "पियर पहिचान प्रतिलिपि गर्नुहोस्",
  "mesh.peer.their_name": "आफूलाई {name} भन्छन्",
  "mesh.peer.in_range": "दायरामा",
  "mesh.peer.relay": "रिले नोड",
  "mesh.peer.relay_body":
    "मेश फैलाउन कसैले खुला छाडेको रेडियो। यसले आफूले पढ्न नसक्ने सन्देश बोक्छ। यहाँ सन्देश पठाउने कोही छैन।",
  "mesh.peer.send_dm": "सिधा सन्देश पठाउनुहोस्",
  "mesh.peer.message": "सन्देश",
  "mesh.peer.send_sats": "ecash पठाउनुहोस्",
  "mesh.peer.amount_placeholder": "sat मा रकम",
  "mesh.peer.amount_first": "ecash पठाउनुहोस्, पहिले रकम हाल्नुहोस्",
  "mesh.peer.cancel_send": "ecash पठाउने काम रद्द गर्नुहोस्",
  "mesh.peer.view_peer": "पियर {name} हेर्नुहोस्",
  "mesh.peer.view_peer_online": "पियर {name} हेर्नुहोस्, अनलाइन",
  "mesh.peer.last_seen": "अन्तिम पटक {ago} अघि देखिएको",
  "mesh.peer.send_amount": "{amount} sat पठाउनुहोस्",
  "mesh.peer.direct": "सिधा जडान",
  "mesh.peer.check_distance": "दूरी जाँच्नुहोस्",
  "mesh.peer.checking": "जाँच्दै",
  "mesh.peer.no_reply": "जवाफ छैन",
  "mesh.peer.no_reply_hint":
    "उनीहरू सरेका हुन सक्छन्, वा उनीहरूको एपले जवाफ नदिएको हुन सक्छ",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "क्षेत्र",
  "mesh.level.province": "प्रदेश",
  "mesh.level.city": "सहर",
  "mesh.level.neighborhood": "टोल",
  "mesh.level.block": "सहरी ब्लक",
  "mesh.level.building": "भवन",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "खर्च गर्न मिल्ने",
  "wallet.balance.unit_hint": "satoshi र bitcoin बीच फेरबदल गर्छ",
  "wallet.balance.a11y": "ब्यालेन्स {value} {unit}",
  "wallet.balance.locked":
    "वालेटको भण्डारण बन्द छ। ecash का प्रमाण एउटा गुप्तीकृत फाइलमा राखिन्छन् जसको कुञ्जी यन्त्रको कुञ्जी सङ्ग्रहमा बस्छ, र त्यो फाइल खुलेन। आफ्नो यन्त्र खोलेर Airhop फेरि खोल्नुहोस्।",
  "wallet.balance.tor_blocked":
    "Tor खुला छ, त्यसैले टकसारका अनुरोध रोकिएका छन्: ती खुला सञ्जालबाट जान्थे र तपाईंको IP तपाईंका प्रमाणसँग जोड्थे। मेशबाट पठाउने र लिने काम भने चलिरहन्छ। सेटिङ, सुरक्षा अन्तर्गत टकसारको ट्राफिकलाई अनुमति दिनुहोस्।",
  "wallet.balance.unconfirmed_note": "{amount} अझै टकसारबाट पुष्टि भएको छैन",
  "wallet.balance.reserved_note":
    "{amount} बाटोमा रहेको पठाइका लागि छुट्याइएको",
  "wallet.balance.other_mint_note": "{amount} अर्कै टकसारमा",
  "wallet.balance.test_mint_note":
    "यसमा परीक्षण टकसारको खेलौना पैसा छ। यो bitcoin होइन र यसलाई नगदमा बदल्न सकिँदैन।",
  "wallet.token": "टोकन",
  "wallet.action.send": "ecash टोकन पठाउनुहोस्",
  "wallet.action.send_disabled":
    "ecash टोकन पठाउनुहोस्, खाली ब्यालेन्समा उपलब्ध छैन",
  "wallet.action.receive": "ecash टोकन लिनुहोस्",
  "wallet.action.zap": "कुनै Nostr सम्पर्कलाई zap पठाउनुहोस्",
  "wallet.action.zap_disabled":
    "कुनै Nostr सम्पर्कलाई zap पठाउनुहोस्, खाली ब्यालेन्समा उपलब्ध छैन",
  "wallet.action.add_mint": "Cashu टकसार थप्नुहोस्",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "टोकन बन्न सकेन",
  "wallet.send.title": "ecash पठाउनुहोस्",
  "wallet.send.amount_in": "{unit} मा रकम",
  "wallet.send.body":
    "तपाईंसँग पहिल्यै भएका प्रमाणबाट अफलाइन बनाइएको। टोकन पुग्यो भनेर तपाईंले पक्का नगरेसम्म ब्यालेन्सबाट केही पनि सधैँका लागि जाँदैन।",
  "wallet.send.stale_fee_note":
    "शुल्क अन्तिम पटक {days} दिनअघि जाँचिएको थियो। त्यसयता यो टकसारले शुल्क बढाएको छ भने पठाउँदा अलि बढी लाग्न सक्छ।",
  "wallet.send.fee_note":
    "{spend} {unit} तपाईंको ब्यालेन्सबाट जान्छ; थप {fee} ले त्यो टकसार शुल्क बेहोर्छ जुन नत्र उनीहरूले तिर्नुपर्थ्यो",
  "wallet.send.qr_too_big":
    "यो टोकन यति धेरै सिक्कामा बाँडिएको छ कि QR कोडमा अट्दैन। बरु यसलाई साझा गर्नुहोस् वा प्रतिलिपि गर्नुहोस्, वा तिनलाई जोड्न टकसारमा ताजा गर्नुहोस्।",
  "wallet.send.bearer_note":
    "यो सूत्र जससँग हुन्छ, पैसा उसैको हो। प्रमाण छुट्याइएका छन्, खर्च भएका होइनन्: यो कसैसम्म पुगेन भने तपाईं ती बाँकी अन्तर्गत फिर्ता लिन सक्नुहुन्छ।",
  "wallet.send.qr_too_big_short":
    "यो टोकन यति धेरै सिक्कामा बाँडिएको छ कि QR कोडमा अट्दैन। बरु यसलाई साझा गर्नुहोस् वा प्रतिलिपि गर्नुहोस्।",
  "wallet.send.scan_note":
    "उनीहरूलाई आफ्नै वालेटबाट यो स्क्यान गर्न लगाउनुहोस्। तपाईंले पुग्यो भनेर चिनो नलगाएसम्म यो फिर्ता लिन मिल्छ।",
  "wallet.send.mesh_note":
    "टोकन मेशबाट गुप्तीकृत सिधा सन्देशका रूपमा जान्छ। इन्टरनेट चाहिँदैन।",
  "wallet.send.no_peers_note":
    "नजिकका यन्त्र भेट्न मेश ट्याब खोल्नुहोस्, वा टोकन अर्कै तरिकाले साझा गर्नुहोस्।",
  "wallet.send.send_to": "{name} लाई पठाउनुहोस्",
  "wallet.send.memo": "टिपोट (वैकल्पिक, टोकनसँगै जान्छ)",
  "wallet.send.building": "बन्दै…",
  "wallet.send.build": "टोकन बनाउनुहोस्",
  "wallet.send.inexact_body":
    "तपाईंका प्रमाणले अफलाइन ठ्याक्कै {amount} {unit} बनाउन सक्दैनन्। तपाईंले बनाउन सक्ने सबैभन्दा सानो टोकन {spend} {unit} हो, र अफलाइनमा फिर्ता हुँदैन: थप {extra} {unit} पाउनेलाई नै जान्छ।\n\nअनलाइन हुँदा टकसारमा ताजा गरे तपाईंका प्रमाण ठ्याक्कै मिल्ने अङ्कमा बाँडिन्थे।",
  "wallet.send.send_amount": "{amount} पठाउनुहोस्",
  "wallet.send.sent_to": "{name} लाई {amount} {unit} पठाइयो",
  "wallet.send.sent_to_body":
    "{route} उनीहरूले पाए भनेर तपाईंले पक्का नगरेसम्म, वा टकसारले प्रमाण साटिए भनेर हामीलाई नभनेसम्म यो बाँकी अन्तर्गत फिर्ता लिन मिल्छ।",
  "wallet.send.copy_token": "टोकन प्रतिलिपि गर्नुहोस्",
  "wallet.send.share_token": "टोकन साझा गर्नुहोस्",
  "wallet.send.open_in_wallet": "यो टोकन अर्को वालेटमा खोल्नुहोस्",
  "wallet.send.open_in_wallet_short": "वालेटमा खोल्नुहोस्",
  "wallet.send.to_peer": "टोकन नजिकको पियरलाई पठाउनुहोस्",
  "wallet.send.to_peer_short": "पियरलाई पठाउनुहोस्",
  "wallet.send.mark_delivered": "पुग्यो भनेर चिनो लगाई सक्नुहोस्",
  "wallet.send.they_got_it": "उनीहरूले पाए",
  "wallet.send.keep_pending": "यो पठाइ बाँकी नै राख्नुहोस्",
  "wallet.send.decide_later": "पछि निर्णय गर्नुहोस्",
  "wallet.send.no_peers": "दायरामा पियर छैन",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "यो तपाईंकै भुक्तानी हो",
  "wallet.receive.own_payment_body":
    "यी सिक्का तपाईंले नटुङ्ग्याएको पठाइका लागि अझै छुट्याइएका छन्, त्यसैले दाबी गर्ने केही छैन। तिनलाई सिधै ब्यालेन्समा फर्काउन त्यो भुक्तानीमा फिर्ता लिनुहोस् चलाउनुहोस्।",
  "wallet.receive.already_have": "पहिल्यै तपाईंको वालेटमा",
  "wallet.receive.already_have_body":
    "यो टोकनको हरेक प्रमाण पहिल्यै यहाँ छ, त्यसैले केही थपिएन। ब्यालेन्स उस्तै छ।",
  "wallet.receive.stored_unconfirmed":
    "{mint} बाट राखियो, तर अझै टकसारबाट पुष्टि भएको छैन ({reason})।",
  "wallet.receive.offline": "अफलाइन",
  "wallet.receive.redeemed_here":
    "{mint} मा साटियो। यी प्रमाण अब तपाईंकै मात्र हुन्: पठाउनेको प्रतिलिपि अब चल्दैन।",
  "wallet.receive.memo_quoted": "\n\n”{memo}“",
  "wallet.receive.redeemed_at":
    "{mint} मा साटियो। अब यो प्रमाणसहित तपाईंको हो: पठाउनेसँग भएको यो टोकनको प्रतिलिपि अब चल्दैन।",
  "wallet.receive.stored_pending":
    "{mint} बाट राखियो, तर टकसारले यो नखर्चिएको हो भनेर अझै पुष्टि गरेको छैन{dleq}। अनलाइन भएपछि वालेट ट्याबबाट ताजा गर्नुहोस्।",
  "wallet.receive.dleq_inline":
    " (यसको हस्ताक्षर मिल्छ, त्यसैले टोकन साँचो हो)",
  "wallet.receive.dleq_ok": "टकसारको हस्ताक्षर मिल्छ, त्यसैले टोकन साँचो हो।",
  "wallet.receive.dleq_uncached":
    "टकसारका कुञ्जी यहाँ छैनन्, त्यसैले हस्ताक्षर अफलाइन जाँच्न सकिएन।",
  "wallet.receive.dleq_warning":
    "तपाईंले अनलाइन ताजा नगरेसम्म, सिद्धान्ततः पठाउनेले यो अन्तै खर्च गरिसकेको हुन सक्छ।",
  "wallet.receive.failed": "लिन सकिएन",
  "wallet.receive.title": "ecash लिनुहोस्",
  "wallet.receive.body":
    "Cashu टोकन टाँस्नुहोस्। अनलाइन हुँदा यो तुरुन्तै टकसारमा साटिन्छ; अफलाइन हुँदा राखिन्छ र अर्को पटक ताजा गर्दा पुष्टि हुन्छ।",
  "wallet.receive.scan": "ecash को QR कोड स्क्यान गर्नुहोस्",
  "wallet.receive.scan_short": "QR स्क्यान गर्नुहोस्",
  "wallet.receive.receiving": "लिँदै…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}… बाट nutzap आयो र तपाईंको वालेटमा साटियो।",
  "wallet.zap.title": "कुनै Nostr पहिचानलाई zap पठाउनुहोस्",
  "wallet.zap.not_npub": "npub होइन",
  "wallet.zap.bad_key": "गलत कुञ्जी",
  "wallet.zap.invalid_pubkey": "सार्वजनिक कुञ्जी अमान्य",
  "wallet.zap.invalid_pubkey_body":
    "npub1… वा 64 वर्णको हेक्स Nostr सार्वजनिक कुञ्जी हाल्नुहोस्।",
  "wallet.zap.sent": "nutzap पठाइयो",
  "wallet.zap.failed": "zap असफल",
  "wallet.zap.body":
    "उनीहरूले NIP-61 का nutzap विवरण प्रकाशित गर्छन् भने ecash उनीहरूकै कुञ्जीमा बाँधिन्छ, त्यसैले अरू कसैले खर्च गर्न सक्दैन र यो फिर्ता पनि लिन सकिँदैन। नत्र यो फिर्ता लिन मिल्ने टोकनका रूपमा जान्छ। के भयो भन्ने तपाईंलाई बताइनेछ।",
  "wallet.zap.contact": "{name} लाई zap पठाउनुहोस्",
  "wallet.zap.pubkey_placeholder": "npub1… वा 64 वर्णको हेक्स",
  "wallet.zap.sending": "पठाउँदै…",
  "wallet.nostr.copied_body":
    "यो कसैलाई दिनुहोस् र उनीहरूले तपाईंलाई Airhop वा अरू कुनै पनि Nostr वालेटबाट zap पठाउन सक्नेछन्, ब्लुटुथबिनै।",
  "wallet.nostr.copy_key":
    "मानिसले तपाईंलाई zap पठाउन सकून् भनेर आफ्नो Nostr कुञ्जी प्रतिलिपि गर्नुहोस्",
  "wallet.nostr.your_key": "तपाईंको Nostr कुञ्जी",

  // ---- Wallet: mints ----
  "wallet.mint.added": "टकसार थपियो",
  "wallet.mint.add_failed": "टकसार थप्न सकिएन",
  "wallet.mint.added_named": "{name} थपियो",
  "wallet.mint.added_body":
    "{mint} ले {units} जारी गर्छ। यसका कुञ्जी यो यन्त्रमा राखिएका छन्, त्यसैले यसका टोकन अब इन्टरनेटबिना पनि जाँच्न सकिन्छ।",
  "wallet.mint.remove_plain":
    "{mint} लाई आफ्नो वालेटबाट हटाउने? यसका राखिएका कुञ्जी पनि जान्छन्, त्यसैले यसका टोकन अब अफलाइन जाँच्न सकिँदैन।",
  "wallet.mint.title": "टकसार",
  "wallet.mint.none": "अझै कुनै टकसार छैन",
  "wallet.mint.none_desc":
    "टकसारले तपाईंको ecash जारी गर्छ र साट्छ। Lightning बाट जम्मा गर्न एउटा थप्नुहोस्, वा बस एउटा टोकन लिनुहोस् र यसको टकसार आफैँ थपिन्छ।",
  "wallet.mint.add": "टकसार थप्नुहोस्",
  "wallet.mint.add_body":
    "टकसारले तपाईंको ecash पछाडिको Bitcoin राख्छ, त्यसैले त्यहाँ राख्ने ब्यालेन्स भरोसा गर्न सकिने टकसार छान्नुहोस्। सुरक्षित गर्नुअघि URL जाँचिन्छ। कसैलाई भरोसा गर्न नचाहनुहुन्छ भने Nutshell ले आफ्नै चलाउनुहोस्।",
  "wallet.mint.consolidate_body":
    "टोकनले सधैँ एउटा मात्र टकसारको नाम लिन सक्छ, त्यसैले धेरै टकसारमा छरिएको ब्यालेन्सले तीमध्ये सबैभन्दा ठूलोसँग भएको भन्दा बढी रकम तिर्न सक्दैन। Airhop ले यसलाई सार्न सक्छ: अरू हरेक टकसारले तपाईंले छानेको टकसारले जारी गरेको Lightning बिल तिर्छ। यसमा सानो बाटो शुल्क लाग्छ र इन्टरनेट चाहिन्छ।",
  "wallet.mint.add_short": "टकसार थप्नुहोस्",
  "wallet.mint.checking": "जाँच्दै…",
  "wallet.mint.remove_with_balance": "ब्यालेन्स भएको टकसार हटाउने?",
  "wallet.mint.remove": "टकसार हटाउनुहोस्",
  "wallet.mint.delete_anyway": "जे भए पनि मेटाउनुहोस्",
  "wallet.mint.consolidate": "सबै ब्यालेन्स एउटै टकसारमा सार्नुहोस्",
  "wallet.mint.confirm_with": "{mint} सँग प्रमाण पुष्टि गर्नुहोस्",
  "wallet.mint.remove_a11y": "{mint} हटाउनुहोस्",
  "wallet.mint.available_amount": "{amount} {unit} उपलब्ध",
  "wallet.mint.split_across":
    "ब्यालेन्स {count} टकसारमा बाँडिएको छ। यसलाई एउटैमा सार्नुहोस्।",
  "wallet.mint.move_everything_to": "सबथोक {mint} मा सार्नुहोस्",
  "wallet.mint.consolidate_title": "एउटै टकसारमा सार्नुहोस्",
  "wallet.mint.moving": "सार्दै…",
  "wallet.mint.move": "सार्नुहोस्",
  "wallet.mint.moved": "सारियो",
  "wallet.mint.moved_body":
    "{fees} {unit} Lightning बाटो शुल्कपछि {amount} {unit} अब {mint} मा छ।",
  "wallet.mint.nothing_moved": "केही सारिएन",
  "wallet.mint.destination": "· गन्तव्य",
  "wallet.mint.will_move": "· सारिनेछ",
  "wallet.mint.issued_by": "जारी गर्ने",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop वालेटमा रकम थप्ने",
  "wallet.ln.invoice_failed": "बिल बन्न सकेन",
  "wallet.ln.price_failed": "यो बिलको मूल्य निकाल्न सकिएन",
  "wallet.ln.paid": "तिरियो",
  "wallet.ln.deposit_credited":
    "बिल तिरियो र {mint} ले {amount} {unit} जारी गर्‍यो। यो ब्यालेन्स पुष्ट छ: तपाईं यसलाई तुरुन्तै अफलाइन खर्च गर्न सक्नुहुन्छ।",
  "wallet.ln.withdrawn":
    "Lightning बाट {paid} sat तिरियो। टकसारले {fee} sat बाटो शुल्क लियो।",
  "wallet.ln.withdrawn_with_change":
    "Lightning बाट {paid} sat तिरियो। टकसारले {fee} sat बाटो शुल्क लियो, र सञ्चितिको {change} sat तपाईंको ब्यालेन्समा फर्कायो।",
  "wallet.ln.payment_failed": "भुक्तानी असफल",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning का sat लाई अफलाइन खर्च गर्न मिल्ने ecash मा बदल्नुहोस्, वा ecash लाई कुनै पनि Lightning बिलमा निकाल्नुहोस्। दुवैलाई इन्टरनेट र एउटा टकसार चाहिन्छ।",
  "wallet.ln.deposit_body":
    "टकसारले तपाईंलाई एउटा बिल दिन्छ। त्यो कुनै पनि Lightning वालेटबाट तिर्नुहोस् र sat अफलाइन खर्च गर्न मिल्ने ecash बनेर फर्कन्छन्।",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit} को यो बिल तिर्नुहोस्। वालेटले भुक्तानी हेरिरहेको छ र तपाईंको ecash आफैँ जारी गर्नेछ।",
  "wallet.ln.expired_body":
    "यो बिलको म्याद सकियो। तपाईंले पहिल्यै तिरिसक्नुभएको छ भने ब्यालेन्स आफैँ जम्मा हुन्छ।",
  "wallet.ln.waiting_expires":
    "भुक्तानीको पर्खाइमा · {countdown} मा म्याद सकिन्छ",
  "wallet.ln.withdraw_body":
    "bolt11 बिल टाँस्नुहोस् र टकसारले त्यो तपाईंको ecash बाट तिर्नेछ। पहिले तपाईंलाई बाटोको सञ्चिति भनिन्छ; बाटोले नचलाएको तपाईंको ब्यालेन्समा फर्कन्छ।",
  "wallet.ln.up_to": "{amount} {unit} सम्म",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} तिर्नुहोस्",
  "wallet.ln.deposit": "Lightning बाट sat जम्मा गर्नुहोस्",
  "wallet.ln.deposit_short": "जम्मा गर्नुहोस्",
  "wallet.ln.withdraw": "कुनै Lightning बिलमा निकाल्नुहोस्",
  "wallet.ln.withdraw_short": "निकाल्नुहोस्",
  "wallet.ln.deposit_title": "Lightning बाट जम्मा",
  "wallet.ln.amount_placeholder": "sat मा रकम",
  "wallet.ln.requesting": "अनुरोध गर्दै…",
  "wallet.ln.get_invoice": "बिल लिनुहोस्",
  "wallet.ln.copy_invoice": "बिल प्रतिलिपि गर्नुहोस्",
  "wallet.ln.open_wallet": "Lightning वालेटमा खोल्नुहोस्",
  "wallet.ln.open_wallet_short": "वालेटमा खोल्नुहोस्",
  "wallet.ln.waiting": "भुक्तानीको पर्खाइमा…",
  "wallet.ln.new_invoice": "नयाँ बिल बनाउनुहोस्",
  "wallet.ln.new_invoice_short": "नयाँ बिल",
  "wallet.ln.withdraw_title": "Lightning मा निकाल्ने",
  "wallet.ln.scan_invoice": "Lightning बिलको QR कोड स्क्यान गर्नुहोस्",
  "wallet.ln.paid_from": "यहाँबाट तिरियो",
  "wallet.ln.invoice": "बिल",
  "wallet.ln.routing_reserve": "बाटोको सञ्चिति",
  "wallet.ln.reserved": "ब्यालेन्सबाट छुट्याइयो",
  "wallet.ln.paying": "तिर्दै…",
  "wallet.ln.get_quote": "अनुमान लिनुहोस्",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "ब्याकअप",
  "wallet.backup.setup_failed": "ब्याकअप मिलाउन सकिएन",
  "wallet.backup.on": "ब्याकअप खुला",
  "wallet.backup.on_body":
    "तपाईंको ब्यालेन्स अब ती बाह्र शब्दबाट पुनः बनाउन सकिन्छ।\n\nअरू कसैले तपाईंलाई दिएको जे पनि तपाईंले टकसारमा ताजा नगरेसम्म यो वाक्यांशबाहिरै रहन्छ, र फिर्ताका लागि तपाईंको टकसारको सूची चाहिन्छ, त्यसैले त्यो शब्दहरूकै छेउमा लेखेर राख्नुहोस्।",
  "wallet.backup.no_phrase": "कुनै वाक्यांश राखिएको छैन",
  "wallet.backup.no_phrase_body":
    "फिर्ताको वाक्यांश यन्त्रको कुञ्जी सङ्ग्रहबाट पढ्न सकिएन। यन्त्र खोलेर फेरि प्रयास गर्नुहोस्।",
  "wallet.backup.replace_title": "आफ्नो हालको वाक्यांश बदल्ने?",
  "wallet.backup.replace_body":
    "तपाईंसँग पहिल्यै फिर्ताको वाक्यांश छ। अर्को फिर्ता ल्याउँदा त्यो बदलिन्छ। पुरानो वाक्यांशले पहिल्यै समेटेका सिक्का यो यन्त्रमा खर्च गर्न मिलिरहन्छन्, तर फिर्ता ल्याउन मिल्दैनन्, त्यसैले अघि बढ्नुअघि पुराना शब्द लेखिएका छन् भन्ने पक्का गर्नुहोस्।",
  "wallet.backup.replace": "बदल्नुहोस्",
  "wallet.backup.invalid_phrase": "त्यो वाक्यांश मान्य छैन",
  "wallet.backup.invalid_phrase_body":
    "वाक्यांशमा भित्रै जाँच रकम हुन्छ र यो त्यसमा खरो उत्रँदैन। गलत टाइप भएको, छुटेको वा साटिएको शब्द खोज्नुहोस्।",
  "wallet.backup.not_bip39":
    "यी BIP-39 का शब्द होइनन्: {words}। हिज्जे जाँच्नुहोस्।",
  "wallet.backup.add_mint_first": "पहिले टकसार थप्नुहोस्",
  "wallet.backup.add_mint_first_body":
    "फिर्ता ल्याउने काम टकसारलाई सोधेर चल्छ कि उसले तपाईंका लागि कुन सिक्कामा हस्ताक्षर गर्‍यो, त्यसैले कुन टकसारलाई सोध्ने भन्ने थाहा हुनुपर्छ। तपाईंले चलाएका टकसार थप्नुहोस्, अनि फिर्ता ल्याउनुहोस्।",
  "wallet.backup.restore_failed": "फिर्ता असफल",
  "wallet.backup.phrase": "फिर्ताको वाक्यांश",
  "wallet.backup.state_unconfirmed": "ब्याकअप खुला तर पुष्टि भएको छैन",
  "wallet.backup.state_off": "ब्याकअप बन्द",
  "wallet.backup.badge_on": "खुला",
  "wallet.backup.badge_unconfirmed": "अपुष्ट",
  "wallet.backup.badge_off": "बन्द",
  "wallet.backup.view": "फिर्ताको वाक्यांश हेर्नुहोस्",
  "wallet.backup.setup": "फिर्ताको वाक्यांश मिलाउनुहोस्",
  "wallet.backup.view_short": "वाक्यांश हेर्नुहोस्",
  "wallet.backup.setup_short": "मिलाउनुहोस्",
  "wallet.backup.restore": "फिर्ताको वाक्यांशबाट वालेट फिर्ता ल्याउनुहोस्",
  "wallet.backup.restore_short": "फिर्ता ल्याउनुहोस्",
  "wallet.backup.setup_title": "फिर्ताको वाक्यांश मिलाउनुहोस्",
  "wallet.backup.on_body_short":
    "तपाईंको ब्यालेन्स आफ्ना बाह्र शब्दबाट नयाँ यन्त्रमा पुनः बनाउन सकिन्छ।",
  "wallet.backup.unconfirmed_body":
    "तपाईंले लेखिएको प्रति छ भनेर कहिल्यै पक्का गर्नुभएन। अहिले ती शब्द यही फोनमा मात्र छन्, र ब्याकअपले जोगिनुपर्ने कुरा नै त्यही हो। वाक्यांश हेर्नुहोस् र लेख्नुहोस्।",
  "wallet.backup.not_covered":
    "{amount} अझै समेटिएको छैन। तपाईंलाई दिइएका सिक्काले पठाउनेका गोप्य कुरा बोक्छन्, त्यसैले ती साटिएपछि मात्र तपाईंको वाक्यांशभित्र पर्छन्। तिनलाई सुरक्षित पार्न कुनै टकसार ताजा गर्नुहोस्।",
  "wallet.backup.off_body":
    "तपाईंको ecash यही फोनमा मात्र छ। यो हरायो भने पैसा कसैले फिर्ता ल्याउन सक्दैन, तपाईंले पनि। फिर्ताको वाक्यांश भनेको बाह्र शब्द हुन् जसले तपाईंको ब्यालेन्स जहाँ पनि पुनः बनाउन सक्छन्।",
  "wallet.backup.about_to_see":
    "तपाईं अब बाह्र शब्द देख्न लाग्नुभएको छ। ती नै पैसा हुन्।",
  "wallet.backup.exact_order":
    "बाह्र शब्द, ठ्याक्कै यही क्रममा। जससँग ती हुन्छन्, तपाईंको ब्यालेन्स उसैसँग हुन्छ।",
  "wallet.backup.verify_body":
    "कसैले नलेखेको वाक्यांश वाक्यांशै नहुनुभन्दा नराम्रो हो, किनकि त्यो नभएको सुरक्षा जालजस्तो देखिन्छ। पक्का गर्न दुई शब्द।",
  "wallet.backup.verify_mismatch":
    "त्यो मिलेन। आफ्नो लेखिएको प्रति जाँच्नुहोस्।",
  "wallet.backup.restore_body":
    "बाह्र शब्द हाल्नुहोस्। Airhop ले तपाईंका सिक्का फेरि निकाल्छ र हरेक टकसारलाई सोध्छ कि तीमध्ये कुनमा उसले हस्ताक्षर गर्‍यो, त्यसैले ब्यालेन्स टकसारले राख्ने अभिलेखबाट फर्कन्छ।",
  "wallet.backup.warn_secret":
    "ती पढ्ने जोसुकैले तपाईंको ब्यालेन्स लैजान सक्छ। तिनको स्क्रिन तस्बिर नखिच्नुहोस् र तिनलाई यो फोनमा नराख्नुहोस्।",
  "wallet.backup.warn_paper":
    "तिनलाई कागजमा लेखेर सुरक्षित ठाउँमा राख्नुहोस्। फोन गयो भने Airhop ले ती तपाईंलाई फेरि देखाउन सक्दैन।",
  "wallet.backup.warn_scope":
    "तिनले तपाईंको ecash मात्र पुनः बनाउँछन्। तपाईंको पहिचान, च्याट र सम्पर्क यसमा पर्दैनन्।",
  "wallet.backup.warn_mints":
    "फिर्ता ल्याउँदा टकसारलाई सोध्नुपर्छ कि उसले कुन सिक्कामा हस्ताक्षर गर्‍यो, त्यसैले आफ्नो टकसारको सूची शब्दहरूकै छेउमा लेख्नुहोस्।",
  "wallet.backup.preparing": "तयारी हुँदै…",
  "wallet.backup.show_phrase": "मेरो वाक्यांश देखाउनुहोस्",
  "wallet.backup.your_phrase": "तपाईंको फिर्ताको वाक्यांश",
  "wallet.backup.write_down": "यी लेख्नुहोस्",
  "wallet.backup.copy_phrase":
    "फिर्ताको वाक्यांश क्लिपबोर्डमा प्रतिलिपि गर्नुहोस्",
  "wallet.backup.copy_clipboard": "क्लिपबोर्डमा प्रतिलिपि गर्नुहोस्",
  "wallet.backup.written_down": "मैले ती लेखेँ",
  "wallet.backup.check_copy": "आफ्नो प्रति जाँच्नुहोस्",
  "wallet.backup.confirm": "पक्का गर्नुहोस्",
  "wallet.backup.restore_title": "वाक्यांशबाट फिर्ता",
  "wallet.backup.phrase_placeholder": "बाह्र शब्द, खाली ठाउँले छुट्याइएका",
  "wallet.backup.no_mints_yet":
    "अझै कुनै टकसार थपिएको छैन। फिर्ता ल्याउँदा कुनै निश्चित टकसारलाई सोध्नुपर्छ, त्यसैले पहिले तपाईंले चलाएका थप्नुहोस्।",
  "wallet.backup.scanning": "खोज्दै…",
  "wallet.backup.restore_progress": "{mint} · {total} मध्ये कुञ्जी समूह {step}",
  "wallet.backup.will_scan":
    "खोजिनेछन्: {mints}। तपाईंले नथपेको टकसारलाई कहिल्यै सोधिँदैन, त्यसैले त्यहाँको ब्यालेन्स नदेखिने रहन्छ।",
  "wallet.backup.word_n": "शब्द {position}",
  "wallet.backup.unreachable_mints":
    "पुग्न सकिएन: {mints}। त्यहाँ भएको ब्यालेन्स अझै त्यहीँ छ। राम्रो जडान हुँदा फेरि प्रयास गर्नुहोस्।",
  "wallet.backup.nothing_recovered": "खोजिएका टकसारबाट केही फिर्ता आएन।",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "पाइयो भनेर चिनो लगाउने?",
  "wallet.delivered.body":
    "यसले {amount} {unit} सधैँका लागि छाड्छ। त्यो साँच्चै कहिल्यै पुगेन भने तपाईंले फिर्ता लिन सक्नुहुन्न।",
  "wallet.delivered.body_generic":
    "यसले छुट्याइएको रकम सधैँका लागि छाड्छ। त्यो साँच्चै कहिल्यै पुगेन भने तपाईंले फिर्ता लिन सक्नुहुन्न।",
  "wallet.delivered.cancel": "अझै होइन",
  "wallet.delivered.confirm": "उनीहरूले पाए",
  "wallet.reclaim.title": "यो टोकन फिर्ता लिने?",
  "wallet.reclaim.body":
    "{amount} {unit} तपाईंको ब्यालेन्समा फर्कन्छ। यो टोकन कसैसम्म नपुगेको भए मात्र यसो गर्नुहोस्: सूत्र पहिल्यै उनीहरूसँग छ भने, टकसारमा पहिले साट्नेले पैसा पाउँछ, र त्यो उनीहरू पनि हुन सक्छन्।",
  "wallet.reclaim.keep": "बाँकी नै राख्नुहोस्",
  "wallet.reclaim.confirm": "फिर्ता लिनुहोस्",
  "wallet.copied.token_body":
    "टोकन तपाईंको क्लिपबोर्डमा छ। तपाईंले पुग्यो भनेर चिनो नलगाएसम्म यो यहीँ छुट्याइएको रहन्छ, त्यसैले पहिलो प्रयास बिग्रियो भने फेरि टाँस्न सक्नुहुन्छ।",
  "wallet.copied.phrase_body":
    "यसलाई पासवर्ड व्यवस्थापकमा टाँस्नुहोस्, अनि आफ्नो क्लिपबोर्ड सफा गर्नुहोस्। अरू एपले क्लिपबोर्ड पढ्न सक्छन्, र केही सेटिङमा यो तपाईंका अरू यन्त्रसँग समक्रमित हुन्छ।",
  "wallet.refresh.failed": "ताजा गर्न सकिएन",
  "wallet.refresh.partly": "आंशिक रूपमा ताजा भयो",
  "wallet.refresh.done": "ताजा भयो",
  "wallet.refresh.unreachable":
    "{mints} सम्म पुग्न सकिएन। बाँकी सबै अद्यावधिक छ।",
  "wallet.refresh.swapped":
    "{amount} {unit} पुष्टि भयो र नयाँ प्रमाणसँग साटियो।",
  "wallet.refresh.secured":
    "{amount} {unit} अब तपाईंको फिर्ताको वाक्यांशले समेट्छ।",
  "wallet.refresh.all_confirmed":
    "यहाँको सबथोक पहिल्यै टकसारबाट पुष्टि भइसकेको थियो।",
  "wallet.pending.title": "बाँकी",
  "wallet.pending.reserved_desc":
    "बनेको र छुट्याइएको, पुगेको पुष्टि छैन। दुई पटक खर्च नहोस् भनेर प्रमाण तपाईंको ब्यालेन्सबाहिर राखिन्छन्।",
  "wallet.pending.locked_desc":
    "पहिल्यै लिनेको कुञ्जीमा बाँधिएको, त्यसैले उसैले मात्र खर्च गर्न सक्छ। बस अझै उससम्म पुगेको छैन। सक्न टोकन साझा गर्नुहोस्।",
  "wallet.pending.show_qr": "यो टोकन QR कोडका रूपमा देखाउनुहोस्",
  "wallet.pending.copy_again": "टोकन फेरि प्रतिलिपि गर्नुहोस्",
  "wallet.pending.share_again": "टोकन फेरि साझा गर्नुहोस्",
  "wallet.pending.mark_delivered": "यो टोकन पुग्यो भनेर चिनो लगाउनुहोस्",
  "wallet.pending.delivered": "पुग्यो",
  "wallet.pending.reclaim_into": "यो टोकन आफ्नो ब्यालेन्समा फिर्ता लिनुहोस्",
  "wallet.activity.title": "गतिविधि",
  "wallet.activity.none": "अझै केही छैन",
  "wallet.activity.none_desc":
    "तपाईंले पठाएका र लिएका भुक्तानी यहाँ देखिन्छन्, नयाँ पहिले, हरेकको टकसार र शुल्कसहित।",
  "wallet.activity.show_fewer": "कम भुक्तानी देखाउनुहोस्",
  "wallet.activity.show_less": "कम देखाउनुहोस्",
  "wallet.activity.received_unconfirmed": "लिइयो, पुष्टि छैन",
  "wallet.activity.received": "लिइयो",
  "wallet.activity.receive_failed": "लिन असफल",
  "wallet.activity.reclaimed": "फिर्ता लिइयो",
  "wallet.activity.send_failed": "पठाउन असफल",
  "wallet.activity.sent": "पठाइयो",
  "wallet.activity.status_pending": "बाँकी",
  "wallet.activity.status_failed": "असफल",
  "wallet.activity.status_reclaimed": "फिर्ता लिइयो",
  "wallet.activity.status_expired": "म्याद सकियो",
  "wallet.activity.ln_deposit": "Lightning जम्मा",
  "wallet.activity.ln_withdrawal": "Lightning निकासी",
  "wallet.activity.nutzap_received": "nutzap आयो",
  "wallet.activity.spent_removed": "खर्च भएका प्रमाण हटाइए",
  "wallet.activity.refreshed": "प्रमाण ताजा भए",
  "wallet.activity.refreshing": "प्रमाण ताजा हुँदै",
  "wallet.activity.just_now": "भर्खरै",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "मेश अफलाइन",
  "wallet.mesh_offline_body":
    "मेश सेवा चलिरहेको छैन, त्यसैले टोकन दिने कोही छैन। यो बाँकी अन्तर्गत छुट्याइएकै रहन्छ।",
  "wallet.xfer.route_mesh": "मेशबाट सिधै उनीहरूकै यन्त्रलाई दिइयो।",
  "wallet.xfer.route_nostr":
    "उनीहरू ब्लुटुथ दायराबाहिर थिए, त्यसैले यो इन्टरनेटबाट गयो।",
  "wallet.xfer.route_courier":
    "अहिले उनीहरूसम्म बाटो छैन। अरू यन्त्रले बोक्नेछन् र कुनै एउटा उनीहरूसम्म पुग्दा पुर्‍याउनेछन्।",
  "wallet.xfer.route_queued":
    "उनीहरूसम्म अझै पुग्न सकिँदैन। यो लाइनमा छ र पुग्न सकिनेबित्तिकै जानेछ।",
  "wallet.xfer.mesh_offline_body":
    "मेश सेवा चलिरहेको छैन, त्यसैले टोकन सुम्पने कुनै उपाय छैन। केही पनि कटेको छैन।",
  "wallet.xfer.could_not_send": "पठाउन सकिएन",
  "wallet.xfer.inexact_body":
    "तपाईंका प्रमाणले अफलाइन ठ्याक्कै {amount} {unit} बनाउन सक्दैनन्। तपाईंले बनाउन सक्ने सबैभन्दा सानो टोकन {spend} {unit} हो, र थप {extra} {unit} फिर्ता ल्याउने उपायबिनै उनीहरूकहाँ जान्छ।\n\nअनलाइन हुँदा टकसारमा ताजा गरे तपाईंका प्रमाण ठ्याक्कै मिल्ने अङ्कमा बाँडिन्छन्।",
  "wallet.xfer.send_amount": "{amount} पठाउनुहोस्",
  "wallet.xfer.mesh_offline": "मेश अफलाइन",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "उनीहरूकै कुञ्जीमा बाँधिएको र Nostr मा प्रकाशित। उनीहरू अनलाइन हुन् वा नहुन्, यो उनीहरूकै हो।",
  "wallet.pay.rail_nutzap_dm":
    "उनीहरूकै कुञ्जीमा बाँधिएको। रिलेले लिएन, त्यसैले यो उनीहरूकहाँ सन्देशका रूपमा गयो।",
  "wallet.pay.rail_nutzap_undelivered":
    "उनीहरूकै कुञ्जीमा बाँधिएको, तर अझै कसैले बोक्न सकेको छैन। यो लाइनमा छ, र टोकन बाँकी अन्तर्गत छ।",
  "wallet.pay.final":
    "बाँधिएका भुक्तानी फिर्ता लिन सकिँदैन: अब यी सिक्का उनीहरूकै कुञ्जीले मात्र खर्च गर्न सक्छ।",
  "wallet.pay.reclaimable":
    "यो पुग्यो भनेर तपाईंले पक्का नगरेसम्म वालेट ट्याबबाट फिर्ता लिन मिल्छ।",
  "wallet.pay.why": "यही बाटोबाट पठाइयो किनभने {reason}।",
  "wallet.pay.sent_title": "{name} लाई {amount} {unit}",
  "wallet.pay.thread_receipt":
    "तपाईंले {amount} {unit} पठाउनुभयो, उनीहरूकै कुञ्जीमा बाँधिएको।",
  "wallet.pay.title": "ecash पठाउनुहोस्",
  "wallet.pay.to": "{name} लाई",
  "wallet.pay.amount": "sat मा रकम",
  "wallet.pay.memo": "टिपोट (वैकल्पिक, सार्वजनिक)",
  "wallet.pay.send": "पठाउनुहोस्",
  "wallet.pay.sending": "पठाउँदै…",
  "wallet.pay.action": "ecash पठाउनुहोस्",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "क्यामेरा पहुँच",
  "wallet.scan.camera_purpose": "ecash को QR कोड स्क्यान गर्न",
  "wallet.scan.photo_label": "तस्बिर पहुँच",
  "wallet.scan.photo_purpose": "तस्बिरबाट ecash को QR पढ्न",
  "wallet.scan.no_token": "त्यो तस्बिरमा ecash टोकन भेटिएन।",
  "wallet.scan.no_invoice": "त्यो तस्बिरमा Lightning बिल भेटिएन।",
  "wallet.scan.unreadable": "त्यो तस्बिर पढ्न सकिएन।",
  "wallet.scan.camera_failed":
    "क्यामेरा सुरु हुन सकेन। क्यामेराका अरू एप बन्द गरेर फेरि प्रयास गर्नुहोस्।",
  "wallet.scan.close": "स्क्यानर बन्द गर्नुहोस्",
  "wallet.scan.on_device": "यो यही यन्त्रमा पढिन्छ; कतै केही पठाइँदैन।",
  "wallet.scan.aim_token": "ecash को QR कोडमा तेर्स्याउनुहोस्।",
  "wallet.scan.aim_invoice": "Lightning बिलको QR कोडमा तेर्स्याउनुहोस्।",
  "wallet.scan.title_token": "ecash स्क्यान",
  "wallet.scan.title_invoice": "बिल स्क्यान",
  "wallet.scan.desc_token":
    "अर्को वालेटबाट Cashu टोकन पढ्नुहोस्। कुनै पनि Cashu वालेटसँग चल्छ, Airhop सँग मात्र होइन।",
  "wallet.scan.desc_invoice":
    "आफ्नो ब्यालेन्सबाट तिर्न Lightning बिल पढ्नुहोस्।",
  "wallet.scan.use_camera_a11y": "क्यामेराले स्क्यान गर्नुहोस्",
  "wallet.scan.use_camera": "क्यामेरा चलाउनुहोस्",
  "wallet.scan.pick_image_a11y": "सुरक्षित तस्बिरबाट QR कोड पढ्नुहोस्",
  "wallet.scan.pick_image": "तस्बिरबाट छान्नुहोस्",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu के हो?",
  "wallet.explain.intro":
    "Cashu, Bitcoin का लागि ecash हो। टोकन भनेको एउटा सूत्र हो जुन बोक्नेका लागि पैसा बराबर हुन्छ, टकसारले आँखा चिम्लेर हस्ताक्षर गरेको ताकि कसले के खर्च गर्‍यो भन्ने टकसारलाई थाहा नहोस्। न खाता, न लगइन।",
  "wallet.explain.send": "पठाउनुहोस्",
  "wallet.explain.send_desc":
    "रकमलाई त्यस्तो टोकनमा बदल्छ जुन तपाईं ब्लुटुथबाट नजिकको पियरलाई दिन वा पाठका रूपमा साझा गर्न सक्नुहुन्छ। इन्टरनेटबिना चल्छ। पुग्यो भनेर तपाईंले पक्का नगरेसम्म प्रमाण छुट्याइएकै रहन्छन्।",
  "wallet.explain.receive": "लिनुहोस्",
  "wallet.explain.receive_desc":
    "टोकन थप्न त्यसलाई टाँस्नुहोस्। अनलाइन हुँदा त्यो तुरुन्तै टकसारमा साटिन्छ, जसले त्यसलाई प्रमाणसहित तपाईंको बनाउँछ। अफलाइन हुँदा राखिन्छ र तपाईंले ताजा नगरेसम्म अपुष्ट चिनो लाग्छ।",
  "wallet.explain.zap": "zap",
  "wallet.explain.zap_desc":
    "कुनै Nostr पहिचानलाई तिर्छ। उनीहरूले NIP-61 का nutzap विवरण प्रकाशित गर्छन् भने ecash उनीहरूकै कुञ्जीमा बाँधिन्छ, त्यसैले उनीहरूले मात्र खर्च गर्न सक्छन्। नत्र यो गुप्तीकृत सिधा सन्देशमा फर्कन्छ। इन्टरनेट चाहिन्छ।",
  "wallet.explain.add_mint": "टकसार थप्नुहोस्",
  "wallet.explain.add_mint_desc":
    "तपाईंको ecash जारी गर्ने र साट्ने टकसार सुरक्षित गर्छ, र यसका सार्वजनिक कुञ्जी राख्छ ताकि यसका टोकन अफलाइन जाँच्न सकियोस्। त्यहाँ राख्ने ब्यालेन्स भरोसा गर्न सकिने टकसार छान्नुहोस्।",
  "wallet.explain.phrase": "फिर्ताको वाक्यांश",
  "wallet.explain.phrase_desc":
    "तपाईंका सिक्का वालेटले सुरुमै बनाएका बाह्र शब्दबाट निस्कन्छन्, त्यसैले नयाँ फोनले तपाईंका टकसारलाई कुन सिक्कामा हस्ताक्षर गरे भनी सोधेर ब्यालेन्स पुनः बनाउन सक्छ। तपाईंले ती हेरेर नलेखेसम्म ती यही फोनमा मात्र हुन्छन्।",

  // ---- Wallet: failures ----
  "wallet.err.locked": "वालेट बन्द",
  "wallet.err.mint_unreachable": "टकसारसम्म पुग्न सकिँदैन",
  "wallet.err.tor_blocked": "Tor खुला हुँदा रोकिएको",
  "wallet.err.insufficient": "ब्यालेन्स पुग्दैन",
  "wallet.err.exact_amount": "ठ्याक्कै त्यति रकम पठाउन मिल्दैन",
  "wallet.err.no_mint": "टकसार छैन",
  "wallet.err.mint_unsupported": "टकसारले त्यो गर्न सक्दैन",
  "wallet.err.mint_refused": "टकसारले मानेन",
  "wallet.err.unreadable": "पढ्न नमिल्ने टोकन",
  "wallet.err.rejected": "टोकन अस्वीकृत",
  "wallet.err.already_spent": "पहिल्यै खर्च भइसकेको",
  "wallet.err.change_pending": "तिरियो, फिर्ता बाँकी",
  "wallet.svc.mint_unreachable": "टकसारसम्म पुग्न सकिएन।",
  "wallet.svc.tor_ios": "iOS मा टकसारका अनुरोध Tor बाट जाँदैनन्।",
  "wallet.svc.tor_ios_body":
    "Arti ले Nostr का WebSocket मात्र बेर्छ, त्यसैले यो अनुरोध टकसारसम्म खुला सञ्जालबाट पुग्थ्यो र तपाईंको IP यी प्रमाणसँग जोड्थ्यो। सेटिङ > सुरक्षा अन्तर्गत यसलाई अनुमति दिनुहोस्, वा पहिले Tor बन्द गर्नुहोस्। मेशबाट ecash पठाउने र लिने काम भने चलिरहन्छ।",
  "wallet.svc.tor_paused": "Tor खुला छ तर जोडिएको छैन।",
  "wallet.svc.tor_paused_body":
    "Orbot ले रुटिङ रोकेको छ, त्यसैले यो अनुरोध टकसारसम्म खुला सञ्जालबाट पुग्थ्यो र तपाईंको IP यी प्रमाणसँग जोड्थ्यो। Orbot फेरि सुरु गर्नुहोस्, वा Tor बन्द गर्नुहोस्। मेशबाट ecash पठाउने र लिने काम भने चलिरहन्छ।",
  "wallet.svc.keys_uncached": "यो टकसारका कुञ्जी यो यन्त्रमा राखिएका छैनन्।",
  "wallet.svc.keys_uncached_body":
    "ती ल्याउन अनलाइन हुँदा वालेट एक पटक खोल्नुहोस्।",
  "wallet.svc.phrase_invalid": "त्यो फिर्ताको वाक्यांश मान्य छैन।",
  "wallet.svc.phrase_invalid_body":
    "गलत टाइप भएको वा छुटेको शब्द खोज्नुहोस्। वाक्यांशमा भित्रै जाँच रकम हुन्छ, त्यसैले एउटै गलत शब्दले पूरै वाक्यांश अमान्य बनाउँछ।",
  "wallet.svc.need_mint": "पहिले कम्तीमा एउटा टकसार थप्नुहोस्।",
  "wallet.svc.need_mint_body":
    "फिर्ता ल्याउने काम टकसारलाई सोधेर चल्छ कि उसले तपाईंका लागि कुन सिक्कामा हस्ताक्षर गर्‍यो, त्यसैले कुन टकसारलाई सोध्ने भन्ने थाहा हुनुपर्छ।",
  "wallet.svc.restored": "फिर्ताको वाक्यांशबाट फिर्ता आयो",
  "wallet.svc.storage_locked": "वालेटको भण्डारण बन्द छ।",
  "wallet.svc.storage_locked_body":
    "Airhop ले ecash का प्रमाण एउटा गुप्तीकृत फाइलमा राख्छ जसको कुञ्जी यन्त्रको कुञ्जी सङ्ग्रहमा बस्छ। यन्त्र खोलेर एप फेरि खोल्नुहोस्।",
  "wallet.svc.bad_url": "त्यो मान्य URL होइन।",
  "wallet.svc.needs_https": "टकसारको URL https:// बाट सुरु हुनुपर्छ।",
  "wallet.svc.refuse_http": "सादा http बाट टकसार चलाउन मान्दैनौँ।",
  "wallet.svc.refuse_http_body":
    "सञ्जालको बाटोमा भएको जोसुकैले तपाईंका प्रमाण पढ्न वा बदल्न सक्थ्यो। https:// भएको टकसार चलाउनुहोस्।",
  "wallet.svc.mint_not_saved": "टकसार सुरक्षित हुन सकेन।",
  "wallet.svc.unreadable_token": "त्यो पढ्न मिल्ने Cashu टोकन होइन।",
  "wallet.svc.unreadable_token_body":
    "टोकन cashuA वा cashuB बाट सुरु हुन्छन्। प्रतिलिपि गर्दा केही काटिएको त छैन जाँच्नुहोस्।",
  "wallet.svc.wrong_mint":
    "यो टोकनमा त्यसले नाम लिएको टकसारले हस्ताक्षर गरेको छैन।",
  "wallet.svc.already_spent": "यी प्रमाण पहिल्यै खर्च भइसकेका छन्।",
  "wallet.svc.already_spent_body":
    "यो टोकन पठाउनेले पहिले नै साट्यो, वा उही टोकन अरू कसैलाई पनि पठायो।",
  "wallet.svc.receiving_offline": "अफलाइन लिँदै",
  "wallet.svc.amount_positive": "शून्यभन्दा ठूलो रकम हाल्नुहोस्।",
  "wallet.svc.coins_raced": "ती सिक्का भर्खरै अर्को भुक्तानीले चलायो।",
  "wallet.svc.coins_raced_body":
    "केही पनि कटेको छैन। फेरि प्रयास गर्नुहोस्, वालेटले अर्कै समूह छान्नेछ।",
  "wallet.svc.no_ecash": "अझै ecash छैन।",
  "wallet.svc.no_ecash_body":
    "टकसार थपेर Lightning बाट जम्मा गर्नुहोस्, वा कसैबाट टोकन लिनुहोस्।",
  "wallet.svc.split_across_mints": "तपाईंको ब्यालेन्स धेरै टकसारमा बाँडिएको छ।",
  "wallet.svc.mint_says_spent":
    "टकसारले यी प्रमाण पहिल्यै खर्च भइसकेका भनी जनायो।",
  "wallet.svc.issue_against_invoice": "Lightning बिलबापत ecash जारी गर्न",
  "wallet.svc.pay_invoice": "Lightning बिल तिर्न",
  "wallet.svc.unknown_deposit": "अज्ञात जम्मा।",
  "wallet.svc.invoice_expired_before": "तिर्नुअघि नै बिलको म्याद सकियो।",
  "wallet.svc.invoice_expired": "त्यो बिलको म्याद सकियो।",
  "wallet.svc.invoice_unpaid": "बिल अझै तिरिएको छैन।",
  "wallet.svc.payment_unknown":
    "भुक्तानीको अवस्था थाहा छैन; अर्को पटक ताजा गर्दा फेरि जाँचिनेछ।",
  "wallet.svc.melt_change_pending": "तपाईंको बिल तिरियो।",
  "wallet.svc.melt_change_pending_body":
    "टकसारले नचलेको बाटो शुल्क अझै फर्काएको छैन। अर्को पटक ताजा गर्दा त्यो आफैँ आउँछ, र त्यसबीच केही हराउँदैन।",
  "wallet.svc.mint_did_not_pay":
    "टकसारले यो बिल तिरेन। तपाईंको ब्यालेन्स उस्तै छ।",
  "wallet.svc.not_an_invoice": "त्यो Lightning बिल होइन।",
  "wallet.svc.not_an_invoice_body":
    "lnbc बाट सुरु हुने bolt11 बिल टाँस्नुहोस्।",
  "wallet.svc.insufficient_for_invoice": "यो बिलका लागि ब्यालेन्स पुग्दैन।",
  "wallet.svc.coins_raced_invoice_body":
    "केही पनि कटेको छैन र बिल तिरिएन। फेरि प्रयास गर्नुहोस्।",
  "wallet.svc.same_mint": "अर्कै गन्तव्य टकसार छान्नुहोस्।",
  "wallet.svc.same_mint_body":
    "स्रोत र गन्तव्य उही टकसार हुन्, त्यसैले सार्ने केही छैन।",
  "wallet.svc.quote_failed_retried": "अनुमान असफल, जोड्ने काम फेरि प्रयास भयो",
  "wallet.svc.amount_unfit_retried": "रकम मिलेन, जोड्ने काम फेरि प्रयास भयो",
  "wallet.svc.cannot_size": "यो सार्ने कामको आकार तय गर्न सकिएन।",
  "wallet.svc.insufficient_at_mint": "{mint} मा ब्यालेन्स पुग्दैन।",
  "wallet.svc.inexact_title":
    "तपाईंका प्रमाणले अफलाइन ठ्याक्कै {amount} {unit} बनाउन सक्दैनन्।",
  "wallet.svc.inexact_detail":
    "तपाईंले पठाउन सक्ने सबैभन्दा सानो टोकन {spend} {unit} हो। अफलाइनमा फिर्ता हुँदैन, त्यसैले थप {extra} {unit} पाउनेलाई नै जान्छ।",
  "wallet.svc.no_single_mint":
    "कुनै एउटै टकसारसँग {amount} {unit} छैन। फरक टकसारका ecash एउटै टोकनमा जोड्न सकिँदैन: पहिले एउटै टकसारमा जोड्नुहोस्, वा छुट्टाछुट्टै रकममा पठाउनुहोस्।",
  "wallet.svc.have_tried_send":
    "तपाईंसँग {total} {unit} छ, र तपाईंले {amount} पठाउन खोज्नुभयो।",
  "wallet.svc.invoice_needs":
    "यो बिललाई बाटोको सञ्चितिसहित {total} {unit} चाहिन्छ, र तपाईंसँग {balance} छ।",
  "wallet.svc.nothing_to_move": "{mint} सँग सार्न {unit} छैन।",
  "wallet.svc.consolidate_memo": "{mint} बाट जोड्ने काम",
  "wallet.svc.cannot_size_detail":
    "Lightning बाटो शुल्कपछि {from} ले {to} मा काम लाग्ने रकम सार्न सक्दैन। बरु कुनै निश्चित सानो रकम सार्ने प्रयास गर्नुहोस्।",
  "wallet.svc.mint_cannot": "{mint} ले {action} सक्दैन।",
  "wallet.svc.no_nut": "टकसारले NUT-{nut} घोषणा गर्दैन।",
  "wallet.svc.unknown_mint":
    "त्यो भुक्तानीले तपाईंले नचलाउने टकसारको नाम लिन्छ।",
  "wallet.svc.unknown_mint_body":
    "भरोसा गर्नुहुन्छ भने टकसार आफैँ थप्नुहोस्; तपाईंले नछानेको टकसारबाट केही साटिँदैन।",
  "wallet.svc.no_relay": "रिलेसँग जडान छैन",
  "wallet.svc.no_shared_mint": "पर्याप्त ब्यालेन्स भएको साझा टकसार छैन",
  "wallet.svc.no_nutzap_info":
    "पाउनेले nutzap विवरण प्रकाशित गरेको छैन (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "उनीहरूकै कुञ्जीमा बाँधिएको तर अझै पुगेको छैन। यसलाई पूरा गर्न यो कारोबारको टोकन साझा गर्नुहोस्।",
  "wallet.svc.swap_lost":
    "टकसारले यो साटफेर कहिल्यै पूरा गरेन, त्यसैले यसबापत केही जारी भएन।",
  "wallet.svc.swap_unreadable":
    "यो साटफेर यस्तो रूपमा राखिएको थियो जुन यो संस्करणले फेरि चलाउन सक्दैन।",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR बाट प्रमाणित",
  "contacts.qr.keys_unverified": "कुञ्जी प्राप्त, प्रमाणित छैन",
  "contacts.qr.not_verified": "अझै प्रमाणित छैन",
  "contacts.qr.message": "सन्देश",
  "contacts.qr.add": "सम्पर्क थप्नुहोस्",
  "contacts.qr.scan_title": "QR कोड स्क्यान गर्नुहोस्",
  "contacts.qr.aim": "आफ्नो क्यामेरा उनीहरूको QR कोडमा तेर्स्याउनुहोस्",
  "contacts.qr.add_desc": "मेशमा नजिकै नभएको कसैसम्म पुग्नुहोस्।",
  "contacts.qr.peer_id_hint":
    "पियर पहिचान 16 वर्णको हुन्छ। सम्पर्क कोड airhop: बाट सुरु हुन्छ।",
  "contacts.qr.or_scan": "वा उनीहरूको QR स्क्यान गर्नुहोस्",
  "contacts.qr.trust_note":
    "तपाईंले क्यामेराले स्क्यान गरेको QR ले मात्र उनीहरूको कुञ्जी प्रमाणित गर्छ। टाँसिएको कोडले उनीहरूका कुञ्जी बोक्छ तर त्यो उनीहरूबाटै आएको प्रमाण बोक्दैन।",
  "contacts.qr.peer_id": "पियर पहिचान वा सम्पर्क कोड",
  "contacts.qr.peer_id_placeholder": "पहिचान वा सम्पर्क कोड टाँस्नुहोस्",
  "contacts.qr.scan_camera_a11y": "क्यामेराले QR कोड स्क्यान गर्नुहोस्",
  "contacts.qr.scan_camera_desc": "आफ्नो क्यामेरा चलाउनुहोस्",
  "contacts.qr.upload_a11y": "ग्यालरीबाट QR तस्बिर अपलोड गर्नुहोस्",
  "contacts.qr.upload": "ग्यालरीबाट अपलोड गर्नुहोस्",
  "contacts.qr.upload_desc": "सुरक्षित गरिएको QR तस्बिर छान्नुहोस्",
  "contacts.qr.scan_a11y": "QR कोड स्क्यान गरेर सम्पर्क थप्नुहोस्",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16 वर्णको पियर पहिचान, airhop://peer/… लिङ्क, वा सम्पर्क कोड टाँस्नुहोस्।",
  "contacts.scan.camera_label": "क्यामेरा पहुँच",
  "contacts.scan.camera_purpose": "कुनै सम्पर्कको QR कोड स्क्यान गर्न",
  "contacts.scan.camera_needed":
    "स्क्यान गर्न क्यामेरा पहुँच चाहिन्छ। तपाईं अझै पियर पहिचानबाट थप्न सक्नुहुन्छ।",
  "contacts.scan.camera_failed":
    "क्यामेरा सुरु हुन सकेन। क्यामेराका अरू एप बन्द गरेर फेरि प्रयास गर्नुहोस्।",
  "contacts.scan.photo_label": "तस्बिर पहुँच",
  "contacts.scan.photo_purpose": "तपाईंले सुरक्षित गरेको QR कोड स्क्यान गर्न",
  "contacts.scan.photo_needed":
    "तस्बिर छान्न तस्बिर पहुँच चाहिन्छ। तपाईं अझै पियर पहिचानबाट थप्न सक्नुहुन्छ।",
  "contacts.scan.no_qr": "त्यो तस्बिरमा Airhop को QR कोड भेटिएन।",
  "contacts.scan.unreadable": "त्यो तस्बिरबाट QR कोड पढ्न सकिएन।",
  "contacts.scan.bitchat_expired":
    "त्यो bitchat कोडको म्याद सकियो। उनीहरूलाई आफ्नो QR फेरि खोल्न भन्नुहोस्।",
  "contacts.scan.tampered":
    "यो QR कोड अमान्य छ: यसको पियर पहिचान यसका कुञ्जीसँग मिल्दैन। यसमा छेडछाड भएको हुन सक्छ।",
  "contacts.scan.already_added": "पहिल्यै तपाईंका सम्पर्कमा छ",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "क्यामेरा पहुँचको पर्खाइमा…",
  "contacts.verify.camera_off": "क्यामेरा बन्द छ",
  "contacts.verify.open_settings": "सेटिङ खोल्नुहोस्",
  "contacts.verify.verified": "प्रमाणित",
  "contacts.verify.different": "फरक सम्पर्क",
  "contacts.verify.scan_again": "फेरि स्क्यान गर्नुहोस्",
  "contacts.verify.failed": "प्रमाणित हुन सकेन",
  "contacts.verify.done": "भयो",
  "contacts.verify.title": "{name} प्रमाणित गर्नुहोस्",
  "contacts.verify.aim": "आफ्नो क्यामेरा उनीहरूको QR कोडमा तेर्स्याउनुहोस्",
  "contacts.verify.camera_off_body":
    "QR बाट प्रमाणित गर्न सेटिङमा क्यामेरा पहुँच खोल्नुहोस्।",
  "contacts.verify.match_body":
    "{name} को कुञ्जी मिल्छ। तपाईं यो सम्पर्कमाथि भरोसा गर्न सक्नुहुन्छ।",
  "contacts.verify.different_body":
    "यो QR अरू कसैको हो। {name} लाई आफ्नै कोड देखाउन भन्नुहोस्।",
  "contacts.verify.tampered_body":
    "यो QR मा छेडछाड भएको देखिन्छ: यसको पहिचान यसको कुञ्जीसँग मिल्दैन।",
  "contacts.verify.choose_title": "तपाईं कसरी जाँच्न चाहनुहुन्छ?",
  "contacts.verify.choose_body":
    "दुवैले यो फोनका कुञ्जी साँच्चै {name} कै हुन् भन्ने पक्का गर्छन्।",
  "contacts.verify.method_scan": "उनीहरूको कोड स्क्यान गर्नुहोस्",
  "contacts.verify.method_scan_sub": "उनीहरू तपाईंसँगै छन्",
  "contacts.verify.method_compare": "कोड मिलाएर हेर्नुहोस्",
  "contacts.verify.method_compare_sub": "कलमा एकअर्कालाई पढेर सुनाउनुहोस्",
  "contacts.verify.no_keys":
    "यो सम्पर्कका लागि अझै कुञ्जी छैनन्। उनीहरूलाई सन्देश पठाउनुहोस्, वा भेट्दा उनीहरूको कोड स्क्यान गर्नुहोस्।",
  "contacts.verify.compare_title": "यी एकअर्कालाई पढेर सुनाउनुहोस्",
  "contacts.verify.compare_body":
    "{name} लाई उही छ शब्द देखिन्छन्। ती मिले भने तपाईं दुवैलाई थाहा हुन्छ कि कुञ्जी साँचो हुन्।",
  "contacts.verify.codes_match": "यी मिल्छन्",
  "contacts.verify.codes_differ": "यी मिल्दैनन्",
  "contacts.verify.compared_body":
    "तपाईं र {name} ले उही कोड पक्का गर्नुभयो। यो सम्पर्क प्रमाणित भयो।",

  // ---- Settings: shared chrome ----
  "settings.back": "पछाडि जानुहोस्",
  "settings.coming_soon": "चाँडै आउँदै",
  "settings.opens_externally": "{label}, एपबाहिर खुल्छ",
  "settings.peer_id": "पियर पहिचान",
  "settings.share_peer_id": "आफ्नो पियर पहिचान साझा गर्नुहोस्",
  "settings.share_id_short": "पहिचान साझा गर्नुहोस्",
  "settings.peer_id_sheet.title": "तपाईंको पियर पहिचान",
  "settings.peer_id_sheet.copy": "पियर पहिचान प्रतिलिपि गर्नुहोस्",
  "settings.peer_id_sheet.note":
    "यो तपाईं दुवै ब्लुटुथ दायरामा हुँदा मात्र काम गर्छ। कसैले तपाईंलाई जहाँबाट पनि सन्देश पठाउन सकोस् भन्ने चाहनुहुन्छ भने बरु आफ्नो QR कोड साझा गर्नुहोस्।",

  // ---- Settings: hub rows ----
  "settings.section.general": "सामान्य",
  "settings.section.general_desc":
    "वैकल्पिक सुविधा, पठाएको फिर्ता, मिडिया, रिसेट",
  "settings.section.privacy": "गोपनीयता र सुरक्षा",
  "settings.section.privacy_desc":
    "Forward secrecy, हस्ताक्षरित प्याकेट, रोकिएका पियर",
  "settings.section.network": "सञ्जाल र रिले",
  "settings.section.network_desc":
    "इन्टरनेट विकल्प, nostr रिले, bitchat सँग मेल",
  "settings.section.permissions": "अनुमति",
  "settings.section.permissions_desc":
    "ब्लुटुथ, स्थान, सूचना, क्यामेरा, माइक्रोफोन",
  "settings.section.storage": "भण्डारण र डेटा",
  "settings.section.diagnostics": "निदान",

  // ---- Settings: group headings ----
  "settings.group.transports": "वाहक",
  "settings.group.nearby": "नजिकै",
  "settings.group.sync": "समक्रमण",
  "settings.group.features": "सुविधा",
  "settings.group.messages": "सन्देश",
  "settings.group.media": "मिडिया",
  "settings.group.reset": "रिसेट",
  "settings.group.always_on": "सधैँ खुला",
  "settings.group.notifications": "सूचना",
  "settings.group.blocked": "रोकिएका",
  "settings.group.theme": "थिम",
  "settings.group.font": "फन्ट",
  "settings.group.language": "भाषा",
  "settings.section.diagnostics_desc": "जडानको स्थिति र नजिकका यन्त्र",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "ब्लुटुथ जडान",
  "settings.diag.ble_links_desc": "यो फोन सिधै जोडिएका यन्त्र",
  "settings.diag.lan": "स्थानीय नेटवर्क",
  "settings.diag.lan_desc": "एउटै Wi-Fi नेटवर्कका फोनहरू",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "राउटरबिना फोनदेखि फोन",
  "settings.diag.wifi_active": "चल्दै",
  "settings.diag.wifi_unsupported": "यो यन्त्रमा समर्थित छैन",
  "settings.diag.wifi_permission": "कुनै अनुमतिले रोकेको",
  "settings.diag.wifi_unavailable": "अहिले उपलब्ध छैन",
  "settings.diag.wifi_unknown": "रेडियोको पर्खाइमा",
  "settings.diag.relays": "Nostr रिले",
  "settings.diag.relays_desc":
    "स्थान च्यानल र इन्टरनेट पहुँचका लागि प्रयोग हुन्छन्",
  "settings.diag.connected": "जोडिएको",
  "settings.diag.disconnected": "जोडिएको छैन",
  "settings.diag.peer_direct": "सिधा जडान",
  "settings.diag.peer_relayed": "अर्को यन्त्रमार्फत सुनिएको",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "सङ्केतको नाप छैन",
  "settings.diag.no_peers": "दायरामा कोही छैन",
  "settings.diag.no_peers_desc": "{links} रेडियो जडान खुला",
  "settings.diag.gcs_size": "फिल्टरको आकार",
  "settings.diag.gcs_size_desc": "हावामा पठाइएको सबैभन्दा ठूलो समक्रमण फिल्टर",
  "settings.diag.fpr": "गलत सङ्केतको दर",
  "settings.diag.fpr_desc":
    "हामीसँग नभएको प्याकेट छ भनेर फिल्टरले कति पटक दाबी गर्छ",
  "settings.diag.bytes": "{n} बाइट",
  "settings.diag.footnote":
    "यहाँ केही पनि बदल्न सकिँदैन। Airhop bitchat सँग मिल्दो रहोस् भनेर यी मान तय गरिएका हुन्।",
  "settings.section.storage_desc": "प्रयोग र क्यास",
  "settings.section.appearance": "रूप",
  "settings.section.appearance_desc": "थिम, फन्ट र भाषा",
  "settings.section.help": "सहायता र प्रतिक्रिया",
  "settings.section.help_desc":
    "हामीलाई सम्पर्क गर्नुहोस्, त्रुटि जनाउनुहोस्, वा बारम्बार सोधिने प्रश्न पढ्नुहोस्",
  "settings.section.support": "सहयोग",
  "settings.section.support_desc": "विकास चलिरहन मद्दत गर्नुहोस्",
  "settings.section.about": "बारेमा",
  "settings.section.about_desc": "संस्करण, परिवर्तनको सूची, र स्रोत कोड",

  // ---- Settings: general ----
  "settings.general.undo": "पठाएको फिर्ता",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "वालेट",
  "settings.general.undo_seconds": "{count} सेकेन्ड",
  "settings.general.undo_a11y": "पठाएको फिर्ता: {value}",
  "settings.general.quality_a11y": "अपलोडको गुणस्तर {value} बनाउनुहोस्",
  "settings.general.undo_desc":
    "पठाइएको सन्देश केही बेर रोक्छ ताकि बाहिर जानुअघि तपाईंले फिर्ता लिन सक्नुहोस्",
  "settings.general.undo_off_desc": "तुरुन्तै पठाउनुहोस्, फिर्ताको मौका छैन",
  "settings.general.undo_2": "2 सेकेन्ड",
  "settings.general.undo_2_desc": "फिर्ता लिने छोटो मौका",
  "settings.general.undo_10": "10 सेकेन्ड",
  "settings.general.undo_10_desc": "सबैभन्दा लामो समय",
  "settings.general.quality": "अपलोडको गुणस्तर",
  "settings.general.quality_desc":
    "तपाईंको क्यामेरा वा ग्यालरीबाट पठाइने तस्बिरमा लागू हुन्छ। हरेक तस्बिर जसरी भए पनि मेशअनुसार मिलाइन्छ।",
  "settings.general.quality_low": "कम",
  "settings.general.quality_low_desc":
    "सबैभन्दा साना तस्बिर, पठाउन सबैभन्दा छिटो",
  "settings.general.quality_medium": "मध्यम",
  "settings.general.quality_medium_desc": "विस्तार र गतिको सन्तुलन",
  "settings.general.quality_high": "उच्च",
  "settings.general.quality_high_desc": "सबैभन्दा धेरै विस्तार राख्छ",
  "settings.general.feature_wallet_desc":
    "मेशमार्फत पियरबाट पियरमा Cashu ecash पठाउनुहोस्",
  "settings.general.feature_wallet_a11y": "वालेट (सधैँ खुला)",
  "settings.general.feature_ai_desc":
    "यन्त्रमै चल्ने निजी सहायक, सञ्जालमा कुनै सम्पर्क छैन",
  "settings.general.feature_feeds": "फिड",
  "settings.general.feature_feeds_desc":
    "Bluesky र Mastodon का फिड पढ्नुहोस् र तिनमा लेख्नुहोस्",
  "settings.general.show_media": "मिडिया आफैँ देखाउनुहोस्",
  "settings.general.show_media_desc":
    "तस्बिर र भिडियो च्याटमै देखिन्छन्, वा एक थिचाइपछि खुल्छन्",
  "settings.general.reset": "सेटिङ रिसेट गर्नुहोस्",
  "settings.general.media_retention": "मिडिया यति समय राख्नुहोस्",
  "settings.general.media_retention_desc":
    "छानिएको समयपछि तस्बिर, भिडियो र आवाज टिपोट मेटिन्छन्",
  "settings.general.media_retention_sheet":
    "मिडिया यो यन्त्रमा कति समय रहने हो छान्नुहोस्। मेटिएको मिडिया फिर्ता ल्याउन सकिँदैन।",
  "settings.general.retention_7_desc":
    "सबैभन्दा थोरै छाप छाड्छ। जोखिम फोन आफैँ हो भने उत्तम।",
  "settings.general.retention_14_desc":
    "सिग्नलबिनाका एक-दुई हप्ताका लागि बीचको बाटो।",
  "settings.general.retention_30_desc":
    "कुराकानी सबैभन्दा लामो समय पढ्न योग्य राख्छ, र डिस्कमा सबैभन्दा धेरै ठाउँ लिन्छ।",
  "settings.general.reset_desc":
    "हरेक रोजाइलाई पूर्वनिर्धारितमा फर्काउँछ, तपाईंको पहिचान, सन्देश, सम्पर्क र वालेट नछोई",
  "settings.general.reset_title": "सेटिङ रिसेट गर्ने?",
  "settings.general.reset_body":
    "हरेक रोजाइ पूर्वनिर्धारितमा फर्कन्छ: रूप, पठाएको फिर्ता, र जडान (इन्टरनेट, Tor, गेटवे, पुल, रिले)। तपाईंको पहिचान, सन्देश, सम्पर्क र वालेट नछोइकनै रहन्छन्।",
  "settings.general.reset_confirm": "रिसेट गर्नुहोस्",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "सिधा सन्देशका लागि Double Ratchet सधैँ खुला रहन्छ",
  "settings.security.signed_packets": "हस्ताक्षरित प्याकेट",
  "settings.security.signed_packets_desc":
    "हरेक प्याकेटमा Ed25519 हस्ताक्षर हुन्छ",
  "settings.security.hide_previews": "सूचनाको झलक लुकाउनुहोस्",
  "settings.security.hide_previews_desc":
    "पठाउने र सन्देशलाई तपाईंको लक स्क्रिनबाट टाढा राख्छ, जसले ती नखोलिकनै देखाउँछ",
  "settings.security.no_blocked": "कुनै पियर रोकिएको छैन",
  "settings.security.no_blocked_desc":
    "रोकिएका पियरले तपाईंलाई सन्देश पठाउन सक्दैनन् न मेश ट्याबमा देखिन्छन्",
  "settings.security.unblock_title": "यो पियरको रोक हटाउनुहोस्",
  "settings.security.unblock": "रोक हटाउनुहोस्",
  "settings.security.unblock_peer": "{name} को रोक हटाउनुहोस्",
  "settings.security.unblock_body":
    "{name} ले तपाईंलाई फेरि सन्देश पठाउन सक्नेछन् र नजिकै हुँदा मेश ट्याबमा फेरि देखिनेछन्।",

  // ---- Settings: network and relays ----
  "settings.network.internet": "इन्टरनेट विकल्प",
  "settings.network.internet_desc":
    "मेशका पियर दायराबाहिर हुँदा Nostr रिलेमार्फत जारी राख्नुहोस्",
  "settings.network.internet_off_title": "इन्टरनेट बन्द गर्ने?",
  "settings.network.internet_off_body":
    "Airhop ब्लुटुथमा मात्र चल्नेछ। यसले कुनै पनि Nostr रिलेसँग सम्पर्क बन्द गर्छ, र Tor, इन्टरनेट गेटवे र मेश पुल सबै बन्द हुन्छन्। नजिकको ब्लुटुथ च्याट चलिरहन्छ।",
  "settings.network.turn_off": "बन्द गर्नुहोस्",
  "settings.network.discovery": "भू-रिले खोजी",
  "settings.network.discovery_desc":
    "300 भन्दा बढी छरिएका रिलेमध्ये स्थान कक्षका लागि सबैभन्दा नजिकका रिले आफैँ छान्नुहोस्",
  "settings.network.discovery_needs_relay": "पहिले आफ्नै रिले थप्नुहोस्",
  "settings.network.discovery_needs_relay_body":
    "Airhop लाई सबैभन्दा नजिकका रिलेतिर पठाउने काम यही स्वचालित खोजीले गर्छ। तल आफ्नै रिले टाँसेपछि मात्र यसलाई बन्द गर्नुको अर्थ हुन्छ, त्यसैले पहिले कम्तीमा एउटा थप्नुहोस्।",
  "settings.network.custom_only_title": "आफ्नै रिले मात्र चलाउने?",
  "settings.network.custom_only_body":
    "स्थान च्यानल र मेश पुलले सबैभन्दा नजिकका रिले आफैँ छान्न छाड्नेछन् र तपाईंले थपेका मात्र चलाउनेछन्। यसले पहुँच घटाउन सक्छ, र सबैभन्दा नजिकका रिलेमा जम्मा हुने bitchat का प्रयोगकर्तासँग भेट हुन छाड्न सक्छ।",
  "settings.network.custom": "आफ्नै रिले",
  "settings.network.custom_desc":
    "स्थान च्यानल र मेश पुलका लागि आफ्नै रिले थप्नुहोस्",
  "settings.network.custom_added": "{max} मध्ये {count} थपियो",
  "settings.network.dm_relays": "सन्देश रिले",
  "settings.network.dm_relays_desc":
    "सिधा सन्देश र निजी च्यानलले सधैँ यिनै चलाउँछन्। आफ्नै रिलेले यिनलाई बदल्दैन।",
  "settings.network.discovery_back_on": "भू-रिले खोजी फेरि खुल्यो",
  "settings.network.discovery_back_on_body":
    "त्यो तपाईंको अन्तिम आफ्नै रिले थियो। स्थान च्यानललाई प्रकाशित गर्ने ठाउँ चाहिन्छ, त्यसैले Airhop फेरि सबैभन्दा नजिकका रिले आफैँ छान्दै छ।",
  "settings.network.add_relay": "रिले थप्नुहोस्",
  "settings.network.remove_relay": "{url} हटाउनुहोस्",
  "settings.network.add_short": "थप्नुहोस्",
  "settings.network.relay_limit":
    "तपाईं {count} रिले थप्न सक्नुहुन्छ। अर्को थप्न एउटा हटाउनुहोस्।",
  "settings.network.relay_duplicate": "त्यो रिले पहिल्यै तपाईंको सूचीमा छ।",
  "settings.network.relay_invalid":
    "मान्य रिले होस्ट हाल्नुहोस्, जस्तै relay.example.com। रिलेले पूर्वनिर्धारित पोर्ट नचलाएमा मात्र पोर्ट चाहिन्छ। IP ठेगाना र स्थानीय नाम मान्य छैनन्।",
  "settings.network.bitchat": "bitchat सँग मेल",
  "settings.network.bitchat_desc":
    "bitchat कै BLE मेश, पूर्ण रूपमा मिल्ने। यो सधैँ खुला रहन्छ, र बन्द गर्न सकिँदैन।",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "पृष्ठभूमिमा चलाउनुहोस्",
  "settings.conn.background_desc": "Airhop बन्द हुँदा पनि मेश चलिरहन दिनुहोस्",
  "settings.conn.background_on_title": "मेश चलिरहन दिने?",
  "settings.conn.background_on_body":
    "Airhop बन्द हुँदा पनि पुर्‍याउने र लिने काम गरिरहन्छ, त्यसैले तपाईं नहुँदा पनि सन्देश आइपुग्छन्। त्यति बेला Android ले निरन्तर सूचना देखाउँछ।",
  "settings.conn.background_off_title": "Airhop बन्द हुँदा मेश रोक्ने?",
  "settings.conn.background_off_body":
    "सन्देश Airhop खुला हुँदा मात्र आउनेछन्, र यो फोनले नजिकका मानिसका लागि पुर्‍याउन छाड्नेछ। निरन्तर सूचना हराउनेछ।",
  "settings.conn.live_voice": "प्रत्यक्ष आवाज",
  "settings.conn.live_voice_desc":
    "नजिकका मानिससँग वाकीटकीजस्तै कुरा गर्नुहोस्",
  "settings.conn.live_voice_on_title": "प्रत्यक्ष आवाज खोल्ने?",
  "settings.conn.live_voice_on_body":
    "माइक थिचिराख्दा तपाईं बोल्दै गर्दा नै आवाज ब्लुटुथ दायराका सबैसम्म जान्छ, र उनीहरूको आवाज तपाईंको फोनमा बज्छ। केही पनि रेकर्ड हुँदैन।",
  "settings.conn.live_voice_off_title": "प्रत्यक्ष आवाज बन्द गर्ने?",
  "settings.conn.live_voice_off_body":
    "माइक थिचिराख्दा बरु आवाज टिपोट रेकर्ड हुन्छ। छाड्दा त्यो पठिन्छ, र नबजाएसम्म कसैले सुन्दैन।",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor बाटो",
  "settings.conn.tor_desc":
    "थप गोपनीयताका लागि Nostr ट्राफिक Tor बाट पठाउनुहोस्",
  "settings.conn.tor_on_title": "Nostr ट्राफिक Tor बाट पठाउने?",
  "settings.conn.tor_on_body":
    "रिलेले तपाईंको IP ठेगाना देख्न छाड्नेछन्। जोडिन बढी समय लाग्छ र सन्देश ढिलो आइपुग्छन्। ब्लुटुथमा असर पर्दैन।",
  "settings.conn.tor_off_title": "Tor बाटो बन्द गर्ने?",
  "settings.conn.tor_off_body":
    "Nostr ट्राफिक तपाईंको सामान्य जडानमा फर्कन्छ, त्यसैले रिलेले तपाईंको IP ठेगाना फेरि देख्छन्। ब्लुटुथमा जे भए पनि असर पर्दैन।",
  "settings.conn.tor_orbot_idle":
    "Orbot जडान भएको छ तर जोडिएको छैन। Orbot खोल्नुहोस्, यसको VPN सुरु गर्नुहोस्, अनि यो खोल्नुहोस्।",
  "settings.conn.tor_unavailable": "यो संस्करणमा Tor बाटो उपलब्ध छैन।",
  "settings.conn.tor_timeout":
    "Tor लाई जोडिन एक मिनेटभन्दा बढी लाग्दै छ। यो खुला रहन्छ र प्रयास गरिरहन्छ; मेश ट्याबले भन्नेछ कि यो कहिले बाटो दिँदै छ, वा यो सञ्जालले रोकेको छ कि।",
  "settings.conn.tor_failed":
    "Tor सुरु हुन सकेन। एपसँग सञ्जाल पहुँच छ भन्ने पक्का गर्नुहोस्।",
  "settings.conn.mint_clearnet": "टकसारको ट्राफिक खुला सञ्जालबाट जान दिनुहोस्",
  "settings.conn.mint_clearnet_desc":
    "iOS मा Tor ले Nostr मात्र ढाक्छ। टकसारका अनुरोध रोक्न बन्दै छाड्नुहोस्; मेशमा ecash जसरी भए पनि चल्छ।",
  "settings.conn.gateway": "इन्टरनेट गेटवे",
  "settings.conn.gateway_desc":
    "नजिकको अफलाइन फोनलाई आफ्नो जडान सापटी दिनुहोस् ताकि त्यसले स्थान च्यानलसम्म पुग्न सकोस्",
  "settings.conn.gateway_on_title": "इन्टरनेट गेटवे खोल्ने?",
  "settings.conn.gateway_on_body":
    "आफ्नो जडान नभएका नजिकका फोनले स्थान च्यानलका सन्देश तपाईंकै जडानबाट पठाउने र लिनेछन्। यसले तपाईंको मोबाइल डेटा र ब्याट्री खर्च गर्छ, र उनीहरूका सन्देश छेउदेखि छेउसम्म गुप्तीकृत रहन्छन्, त्यसैले जे गुज्रन्छ त्यो तपाईंले पढ्न सक्नुहुन्न।",
  "settings.conn.gateway_off_title": "इन्टरनेट गेटवे बन्द गर्ने?",
  "settings.conn.gateway_off_body":
    "नजिकका अफलाइन फोनले तपाईंकै जडानबाट स्थान च्यानलसम्म पुग्न छाड्नेछन्। तपाईंका आफ्ना सन्देशमा असर पर्दैन।",
  "settings.conn.bridge": "मेश पुल",
  "settings.conn.bridge_desc":
    "यो क्षेत्रको सार्वजनिक #bluetooth च्याटलाई इन्टरनेटमार्फत दायराबाहिरको अर्को ब्लुटुथ भीडसँग जोड्नुहोस्",
  "settings.conn.bridge_on_title": "मेश पुल खोल्ने?",
  "settings.conn.bridge_on_body":
    "तपाईंका सार्वजनिक #bluetooth सन्देश इन्टरनेटमार्फत तपाईंको टोलमा प्रकाशित हुनेछन्, ताकि ब्लुटुथ दायराभन्दा पर भएकाले पनि पढ्न सकून्। निजी सन्देश कहिल्यै पुलबाट जाँदैनन्, र ”नजिक मात्र” ले कुनै एउटा सन्देशलाई स्थानीय राख्छ।",
  "settings.conn.bridge_off_title": "मेश पुल बन्द गर्ने?",
  "settings.conn.bridge_off_body":
    "तपाईंका सार्वजनिक #bluetooth सन्देश फेरि ब्लुटुथ दायरामै रहनेछन्, र पुलपारिको भीडका सन्देश यहाँ आउन छाड्नेछन्।",
  "settings.conn.bridge_needs_location": "मेश पुललाई स्थान चाहिन्छ",
  "settings.conn.bridge_needs_location_desc":
    "यसले स्थानको नापबाट तपाईंको टोल पत्ता लगाउँछ। पुल बनाउन थाल्न स्थानको अनुमति दिनुहोस्।",
  "settings.conn.grant_location": "स्थानको अनुमति दिनुहोस्",
  "settings.conn.grant_short": "दिनुहोस्",
  "settings.conn.orbot_body":
    "Airhop ले Tor को ट्राफिक Orbot बाट पठाउँछ। Play Store बाट Orbot जडान गरी सक्रिय पार्नुहोस्, अनि यो खोल्नुहोस्।",
  "settings.conn.internet_off": "इन्टरनेट बन्द छ",
  "settings.conn.internet_off_desc":
    "Tor, पुल र गेटवे सबैले इन्टरनेट चलाउँछन्। तिनलाई चलाउन सञ्जाल अन्तर्गतको इन्टरनेट विकल्प खोल्नुहोस्।",
  "settings.conn.turn_on": "खोल्नुहोस्",
  "settings.conn.turn_off": "बन्द गर्नुहोस्",
  "settings.conn.orbot_title": "Android मा Tor",
  "settings.conn.get_orbot": "Orbot लिनुहोस्",
  "settings.conn.later": "पछि",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "ब्लुटुथ",
  "settings.permissions.bluetooth_desc":
    "नजिकका यन्त्र भेट्टाउँछ र तिनका बीच सन्देश पुर्‍याउँछ। यसबिना मेश चल्न सक्दैन।",
  "settings.permissions.location": "स्थान",
  "settings.permissions.location_desc":
    "नजिकका क्षेत्रका च्यानल खोल्छ। यसबिना ती च्यानल बन्दै रहन्छन् र ब्लुटुथ मेश सामान्य रूपमा चल्छ।",
  "settings.permissions.notifications": "सूचना",
  "settings.permissions.notifications_desc":
    "एप बन्द हुँदा पनि नयाँ सन्देशका सूचना पाउनुहोस्। यसबिना तपाईंले ती Airhop खोलेपछि मात्र देख्नुहुनेछ।",
  "settings.permissions.camera": "क्यामेरा",
  "settings.permissions.camera_desc":
    "QR कोड स्क्यान गर्छ र पठाउनका लागि तस्बिर वा भिडियो खिच्छ। यसबिना पनि तपाईं ग्यालरीबाट मिडिया साझा गर्न सक्नुहुन्छ।",
  "settings.permissions.photos": "तस्बिर",
  "settings.permissions.photos_desc":
    "तपाईंको ग्यालरीबाट तस्बिर पठाउँछ र आएको मिडिया सुरक्षित गर्छ। यसबिना पनि तपाईं क्यामेराले नयाँ तस्बिर खिचेर पठाउन सक्नुहुन्छ।",
  "settings.permissions.microphone": "माइक्रोफोन",
  "settings.permissions.microphone_desc":
    "आवाज सन्देश रेकर्ड गरी पठाउँछ वा प्रत्यक्ष आवाज चलाउँछ। यसबिना आवाज सन्देश र प्रत्यक्ष आवाज चल्दैनन्।",
  "settings.permissions.allow": "यो अनुमति दिनुहोस्",
  "settings.permissions.open_settings":
    "यो अनुमति बदल्न प्रणाली सेटिङ खोल्नुहोस्",
  "settings.permissions.system": "प्रणाली",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "सञ्जाल प्रयोग",
  "settings.storage.storage_usage": "भण्डारण प्रयोग",
  "settings.storage.storage_usage_desc":
    "सन्देश, वालेटका प्रमाण, र क्यासमा रहेका संलग्नक",
  "settings.storage.session_usage": "यो सत्र · {sent} पठाइयो, {received} लिइयो",
  "settings.storage.cache": "क्यास",
  "settings.storage.cache_desc": "{size} संलग्नक",
  "settings.storage.clear_cache": "संलग्नकको क्यास सफा गर्नुहोस्",
  "settings.storage.clear": "सफा गर्नुहोस्",
  "settings.storage.clear_title": "क्यासमा रहेको मिडिया सफा गर्ने?",
  "settings.storage.clear_body":
    "तस्बिर, भिडियो, आवाज टिपोट र फाइल यो यन्त्रबाट हट्छन्, पठाइएका र आएका दुवै। तिनलाई फेरि डाउनलोड गर्न सकिँदैन: तिनका बबलले त्यही भन्नेछन्, र तपाईंले पठाउनेलाई फेरि पठाउन भन्न सक्नुहुन्छ। सन्देश र वालेट नछोइकनै रहन्छन्।",
  "settings.storage.cleared": "क्यास सफा भयो",
  "settings.storage.freed": "{size} खाली भयो।",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "रूप {value} बनाउनुहोस्",
  "settings.font.set_a11y": "समान चौडाइको फन्ट {value} बनाउनुहोस्",
  "settings.font.system": "प्रणाली",
  "settings.font.system_desc":
    "तपाईंको यन्त्रको पूर्वनिर्धारित समान चौडाइको फन्ट चलाउँछ",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "आधुनिक र पढ्न सजिलो",
  "settings.language.en": "अङ्ग्रेजी",
  "settings.language.am": "अम्हारिक",
  "settings.language.ar": "अरबी",
  "settings.language.bn": "बंगाली",
  "settings.language.my": "बर्मेली",
  "settings.language.zh_hans": "चिनियाँ (सरलीकृत)",
  "settings.language.zh_hant": "चिनियाँ (परम्परागत)",
  "settings.language.nl": "डच",
  "settings.language.fil": "फिलिपिनी",
  "settings.language.fr": "फ्रान्सेली",
  "settings.language.ka": "जर्जियाली",
  "settings.language.de": "जर्मन",
  "settings.language.hi": "हिन्दी",
  "settings.language.id": "इन्डोनेसियाली",
  "settings.language.it": "इटालियन",
  "settings.language.ja": "जापानी",
  "settings.language.ko": "कोरियाली",
  "settings.language.mg": "मालागासी",
  "settings.language.ms": "मलय",
  "settings.language.ne": "नेपाली",
  "settings.language.fa": "फारसी",
  "settings.language.pl": "पोलिस",
  "settings.language.pt_br": "पोर्तुगाली (ब्राजिल)",
  "settings.language.pt_pt": "पोर्तुगाली (पोर्चुगल)",
  "settings.language.pa": "पन्जाबी",
  "settings.language.ru": "रुसी",
  "settings.language.es": "स्पेनी",
  "settings.language.sw": "स्वाहिली",
  "settings.language.sv": "स्विडिस",
  "settings.language.ta": "तमिल",
  "settings.language.th": "थाई",
  "settings.language.tr": "टर्किस",
  "settings.language.uk": "युक्रेनी",
  "settings.language.ur": "उर्दू",
  "settings.language.vi": "भियतनामी",
  "settings.language.pseudo": "छद्म भाषा",
  "settings.language.soon": "चाँडै आउँदै",
  "settings.language.soon_a11y": "{value}, चाँडै आउँदै",
  "settings.language.set_a11y": "भाषा {value} बनाउनुहोस्",
  "settings.language.pending": "अर्को पटक खोल्दा",
  "settings.language.pending_a11y":
    "{value}, तपाईंले अर्को पटक Airhop खोल्दा लागू हुन्छ",
  "settings.language.rtl_title": "पूरा गर्न Airhop फेरि खोल्नुहोस्",
  "settings.language.rtl_body":
    "{value} दायाँबाट बायाँ पढिन्छ, र Airhop ले दिशा सुरु हुँदा मात्र बदल्न सक्छ। बदलाइ पूरा गर्न यसलाई बन्द गरेर फेरि खोल्नुहोस्। केही हराउँदैन, र तपाईंले त्यसो नगरेसम्म तपाईंको मेश जोडिइरहन्छ।",
  "settings.theme.light": "उज्यालो",
  "settings.theme.light_desc": "सधैँ उज्यालो रङ चलाउनुहोस्",
  "settings.theme.dark": "अँध्यारो",
  "settings.theme.dark_desc": "सधैँ अँध्यारो रङ चलाउनुहोस्",

  // ---- Settings: profile and identity ----
  "settings.status.online": "अनलाइन",
  "settings.status.online_desc": "पत्ता लाग्न सकिने, प्रसारण र खोजी गर्दै",
  "settings.status.away": "टाढा",
  "settings.status.away_desc": "मेश रोकिएको, न खोजी न प्रसारण",
  "settings.status.invisible": "अदृश्य",
  "settings.status.invisible_desc": "खोज्दै छ, तर पत्ता लाग्नबाट लुकेको",
  "settings.status.title": "स्थिति",
  "settings.status.set_a11y": "स्थिति {value} बनाउनुहोस्",
  "settings.status.edit": "स्थिति बदल्नुहोस्",
  "settings.status.desc": "मेशमा तपाईं कति देखिने हो छान्नुहोस्।",
  "settings.transfer.identity": "पहिचान र कुञ्जी",
  "settings.transfer.identity_desc":
    "तपाईंको पियर पहिचान, प्रयोगकर्ता नाम, र सम्पर्क",
  "settings.transfer.chats": "च्याट र इतिहास",
  "settings.transfer.chats_desc": "कुराकानी, समूह, र तपाईं सामेल भएका च्यानल",
  "settings.transfer.wallet": "वालेटको ब्यालेन्स",
  "settings.transfer.wallet_desc": "Cashu का प्रमाण र कारोबारको इतिहास",
  "settings.transfer.title": "नयाँ फोनमा सार्नुहोस्",
  "settings.transfer.desc":
    "आफ्नो पहिचान, च्याट र वालेट अर्को यन्त्रमा सार्नुहोस्",
  "settings.transfer.coming_soon_a11y": "नयाँ फोनमा सार्नुहोस्, चाँडै आउँदै",
  "settings.transfer.body":
    "दुवै फोन सँगै राख्नुहोस् र सबथोक ब्लुटुथबाट सार्नुहोस्। केही पनि सर्भरबाट जाँदैन, त्यसैले यो इन्टरनेटबिना चल्छ।",
  "settings.qr.permission_label": "तस्बिर पहुँच",
  "settings.qr.permission_purpose": "तपाईंको QR कोड सुरक्षित गर्न",
  "settings.qr.saved": "सुरक्षित भयो",
  "settings.qr.saved_body": "QR कोड तपाईंको तस्बिर ग्यालरीमा सुरक्षित भयो।",
  "settings.qr.save_failed": "सुरक्षित हुन सकेन",
  "settings.qr.save_failed_body":
    "QR कोड सुरक्षित हुन सकेन। फेरि प्रयास गर्नुहोस्।",
  "settings.qr.share_message": "मलाई Airhop मा थप्नुहोस्",
  "settings.qr.share_body":
    "मलाई Airhop मा थप्नुहोस् — निजी मेश सन्देश, पहिले अफलाइन।",
  "settings.qr.show_short": "QR देखाउनुहोस्",
  "settings.qr.title": "तपाईंको QR कोड",
  "settings.qr.note":
    "यसमा तपाईंका सार्वजनिक कुञ्जी छन्, जसले अरूलाई तपाईंसम्म जहाँबाट पनि सन्देश पठाउन दिन्छ। यो भरोसा गर्ने मानिससँग मात्र साझा गर्नुहोस्। तपाईंले आफ्नो पहिचान नमेटेसम्म यो बदलिँदैन।",
  "settings.qr.code_label": "सम्पर्क कोड",
  "settings.qr.copy_code": "सम्पर्क कोड प्रतिलिपि गर्नुहोस्",
  "settings.qr.share": "QR कोड साझा गर्नुहोस्",
  "settings.qr.share_short": "QR साझा गर्नुहोस्",
  "settings.qr.download": "QR कोड डाउनलोड गर्नुहोस्",
  "settings.qr.download_short": "QR डाउनलोड",
  "settings.qr.show": "QR कोड देखाउनुहोस्",
  "settings.wipe.trigger": "आपत्कालीन सफाइ चलाउनुहोस्",
  "settings.wipe.trigger_desc": "पुष्टिबिनै तुरुन्तै मेटाउन तीन पटक थिच्नुहोस्",
  "settings.wipe.title": "आपत्कालीन सफाइ",
  "settings.wipe.now": "अहिले नै मेटाउनुहोस्",
  "settings.wipe.desc": "सबै कुञ्जी, सन्देश र प्रमाण तुरुन्तै नष्ट गर्छ",
  "settings.wipe.body":
    "यसले तपाईंका सबै कुञ्जी, सन्देश र वालेटका प्रमाण तुरुन्तै नष्ट गर्नेछ। यो फिर्ता गर्न सकिँदैन।",
  "settings.wipe.in_progress": "मेटाउँदै",
  "settings.wipe.in_progress_body":
    "तपाईंका कुञ्जी, सन्देश र फाइल नष्ट गर्दै। यसमा केही सेकेन्ड लाग्छ, र एप बन्द भए पनि आफैँ पूरा हुन्छ।",
  "settings.wipe.got_it": "बुझेँ",
  "settings.wipe.keys_failed": "कुञ्जी नष्ट हुन सकेनन्",
  "settings.wipe.keys_failed_body":
    "तपाईंका सन्देश, सम्पर्क र वालेट गए, तर यन्त्रले तपाईंका कुञ्जी छाड्न मानेन। यन्त्र खोलेर फेरि मेटाउनुहोस्।",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "हामीलाई सम्पर्क गर्नुहोस्",
  "settings.help.contact_a11y": "{address} मा इमेल गर्नुहोस्",
  "settings.help.bug": "त्रुटि जनाउनुहोस्",
  "settings.help.bug_desc": "GitHub मा विषय खोल्नुहोस्",
  "settings.help.bug_a11y": "GitHub मा त्रुटि जनाउनुहोस्",
  "settings.help.faq": "बारम्बार सोधिने प्रश्न",
  "settings.help.faq_desc": "सामान्य प्रश्नका जवाफ",
  "settings.help.faq_a11y": "बारम्बार सोधिने प्रश्न खोल्नुहोस्",
  "settings.help.terms_desc": "Airhop कसरी चलाउन सकिन्छ",
  "settings.help.terms_a11y": "सेवाका सर्तहरू खोल्नुहोस्",
  "settings.help.privacy_desc": "हामीले के सङ्कलन गर्दैनौँ",
  "settings.help.privacy_a11y": "गोपनीयता नीति खोल्नुहोस्",

  // ---- Settings: support ----
  "settings.support.card": "कार्ड वा UPI",
  "settings.support.card_desc": "नेटब्याङ्किङ र वालेट, संसारभर",
  "settings.support.card_a11y":
    "कार्ड, UPI, नेटब्याङ्किङ वा वालेटबाट सहयोग गर्नुहोस्",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "मासिक वा एक पटक, प्लेटफर्म शुल्क छैन",
  "settings.support.sponsors_a11y": "GitHub Sponsors मार्फत सहयोग गर्नुहोस्",
  "settings.support.note":
    "म Airhop आफ्नो फुर्सदमा बनाउँछु। न लगानीकर्ता छन् न विज्ञापन। यो तपाईंलाई उपयोगी छ भने सानो सहयोगले पनि विकास चलिरहन धेरै मद्दत गर्छ। हरेक सुविधा जसरी भए पनि निःशुल्कै रहन्छ।",

  // ---- Settings: about and version ----
  "settings.about.version": "संस्करण",
  "settings.about.version_desc": "हालको संस्करण",
  "settings.about.version_a11y": "संस्करण हेर्नुहोस् र अद्यावधिक जाँच्नुहोस्",
  "settings.about.release_notes": "संस्करणका टिपोट",
  "settings.about.release_notes_desc": "पछिल्लो संस्करणमा के नयाँ छ",
  "settings.about.release_notes_a11y":
    "GitHub मा पछिल्लो संस्करणका टिपोट खोल्नुहोस्",
  "settings.about.source": "स्रोत कोड",
  "settings.about.source_a11y": "GitHub मा स्रोत कोड खोल्नुहोस्",
  "settings.about.licenses": "खुला स्रोतका इजाजतपत्र",
  "settings.about.open_repo": "{name} को भण्डार खोल्नुहोस्",
  "settings.about.licenses_desc": "तेस्रो पक्षका खुला स्रोत प्याकेज",
  "settings.about.licenses_a11y": "तेस्रो पक्षका इजाजतपत्र हेर्नुहोस्",
  "settings.version.codename": "सङ्केत नाम",
  "settings.version.checking": "जाँच्दै",
  "settings.version.check": "अद्यावधिक जाँच्नुहोस्",
  "settings.version.checking_title": "अद्यावधिक जाँच्दै",
  "settings.version.up_to_date": "तपाईं पछिल्लो संस्करणमा हुनुहुन्छ।",
  "settings.version.release_notes": "संस्करणका टिपोट हेर्नुहोस्",
  "settings.version.made_with": "यसबाट बनेको",
  "settings.version.number": "संस्करण {version}",
  "settings.version.update_to": "{version} मा अद्यावधिक गर्नुहोस्",
  "settings.version.update_to_a11y": "संस्करण {version} मा अद्यावधिक गर्नुहोस्",
  "settings.version.released_under": "{license} अन्तर्गत जारी",
  "settings.version.notes_a11y": "संस्करण {version} का टिपोट हेर्नुहोस्",
  "settings.version.tor_paused":
    "Tor खुला हुँदा अद्यावधिकको जाँच रोकिन्छ, ताकि यसले तपाईंको IP नखोलोस्। संस्करणको पृष्ठ ब्राउजरमा हेर्नुहोस्।",
  "settings.version.check_failed":
    "अद्यावधिक जाँच्न सकिएन। आफ्नो जडान जाँचेर फेरि प्रयास गर्नुहोस्।",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} {size} KiB को छ, जुन {cap} KiB को सीमाभन्दा बढी हो।",
  "transfer.failed.malformed":
    "एउटा संलग्नक बिग्रिएको अवस्थामा आयो र खुलेन। उनीहरूलाई फेरि पठाउन भन्नुहोस्।",
  "transfer.failed.unsupported_type":
    "एउटा संलग्नक यो एपले खोल्न नसक्ने ढाँचामा आयो।",
  "transfer.failed.type_mismatch":
    "एउटा संलग्नक अस्वीकृत भयो: यसको सामग्री यसले दाबी गरेको फाइल प्रकारसँग मिल्दैन।",
  "transfer.failed.storage":
    "एउटा संलग्नक आयो तर सुरक्षित हुन सकेन। आफ्नो खाली ठाउँ जाँच्नुहोस्।",
  "transfer.badge.waiting": "पर्खाइमा · {name}",
  "transfer.badge.active_count": "{count} स्थानान्तरण",
  "transfer.badge.sending": "{name} पठाउँदै",
  "transfer.badge.receiving": "{name} लिँदै",
  "transfer.badge.a11y": "{label}, {percent} प्रतिशत। कुराकानी खोल्नुहोस्।",
  "transfer.kind.photo": "तस्बिर",
  "transfer.kind.video": "भिडियो",
  "transfer.kind.voice": "आवाज टिपोट",
  "transfer.this.photo": "यो तस्बिर",
  "transfer.this.video": "यो भिडियो",
  "transfer.this.voice": "यो आवाज टिपोट",
  "transfer.this.file": "यो फाइल",
  "transfer.kind.document": "कागजात",
  "transfer.kind.voice_preview": "आवाज टिपोट",
  "transfer.kind.photo_preview": "तस्बिर",
  "transfer.kind.video_preview": "भिडियो",
  "transfer.kind.document_preview": "कागजात",

  // ---- System notifications ----
  "notif.channel.messages": "सन्देश",
  "notif.channel.nearby": "नजिकका पियर",
  "notif.channel.nearby_desc":
    "मेशले ब्लुटुथ दायरामा मानिस भेट्दा कहिलेकाहीँ आउने सूचना।",
  "notif.nearby.body": "अहिले ब्लुटुथ दायरामा। मेश खोल्न थिच्नुहोस्।",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "कोही",
  "notif.notice_urgent": "जरुरी सूचना · {content}",
  "notif.notice": "सूचना · {content}",
  "notif.incoming_file": "आउँदै गरेको फाइल",
  "notif.preview.photo": "📷 तस्बिर",
  "notif.preview.voice": "🎤 आवाज सन्देश",
  "notif.preview.video": "🎥 भिडियो",
  "notif.preview.document": "📄 कागजात",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "नयाँ सन्देश",
  "notif.hidden.channel": "नयाँ गतिविधि",
  "notif.hidden.mention": "तपाईंलाई उल्लेख गरियो",
  "notif.mention.title": "{sender} ले तपाईंलाई उल्लेख गरे",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "थप {count} देखाउनुहोस्",
    other: "थप {count} देखाउनुहोस्",
  },
  "chat.channels.show_more_a11y": {
    one: "थप {count} पूर्वनिर्धारित च्यानल देखाउनुहोस्",
    other: "थप {count} पूर्वनिर्धारित च्यानल देखाउनुहोस्",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} नपढिएको",
    other: "{label}, {count} नपढिएका",
  },
  "a11y.new_count": {
    one: "{label}, {count} नयाँ",
    other: "{label}, {count} नयाँ",
  },
  "chat.a11y.unread": {
    one: "{count} नपढिएको",
    other: "{count} नपढिएका",
  },
  "chat.thread.length_left": {
    one: "{count} बाँकी",
    other: "{count} बाँकी",
  },
  "settings.general.retention_days": {
    one: "{count} दिन",
    other: "{count} दिन",
  },
  "chat.info.group_reach": {
    one: "{count} मध्ये {reachable} सदस्यसम्म पुग्न सकिन्छ",
    other: "{count} मध्ये {reachable} सदस्यसम्म पुग्न सकिन्छ",
  },
  "chat.group_members": {
    one: "निजी समूह  ·  {count} सदस्य",
    other: "निजी समूह  ·  {count} सदस्य",
  },
  "chat.select.count": {
    one: "{count} छानियो",
    other: "{count} छानिए",
  },
  "chat.select.forward": {
    one: "{count} सन्देश पठाउनुहोस्",
    other: "{count} सन्देश पठाउनुहोस्",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} जना बोल्दै",
    other: "{count} जना बोल्दै",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "दायरामा {count} पियर",
    other: "दायरामा {count} पियर",
  },
  "mesh.peer.hops_away": {
    one: "{count} हप टाढा",
    other: "{count} हप टाढा",
  },
  "chat.presence.active": {
    one: "{count} सक्रिय",
    other: "{count} सक्रिय",
  },
  "chat.presence.nearby": {
    one: "{count} नजिकै",
    other: "{count} नजिकै",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} टकसार",
    other: "{count} टकसार",
  },
  "wallet.mint.remove_body": {
    one: "{mint} सँग {count} प्रमाणमा {balance} {unit} छ। हटाउँदा त्यो प्रमाण यो यन्त्रबाट सधैँका लागि मेटिन्छ र यसको ब्याकअप छैन। पहिले ब्यालेन्स झिक्नुहोस् वा पठाउनुहोस्।",
    other:
      "{mint} सँग {count} प्रमाणमा {balance} {unit} छ। हटाउँदा ती प्रमाण यो यन्त्रबाट सधैँका लागि मेटिन्छन् र तिनको ब्याकअप छैन। पहिले ब्यालेन्स झिक्नुहोस् वा पठाउनुहोस्।",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} जम्मा भुक्तानीको पर्खाइमा छ। एप खुल्दा हरेक पटक फेरि जाँचिन्छ।",
    other:
      "{count} जम्मा भुक्तानीको पर्खाइमा छन्। एप खुल्दा हरेक पटक फेरि जाँचिन्छन्।",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints} बाट {count} नखर्चिएको प्रमाण फिर्ता आयो।",
    other: "{mints} बाट {count} नखर्चिएका प्रमाण फिर्ता आए।",
  },
  "wallet.backup.already_spent": {
    one: "{count} सिक्का भेटियो तर त्यो पहिले नै खर्च भइसकेको थियो, त्यसैले त्यसबापत केही जम्मा भएन। यो सामान्य हो: तपाईंले कहिल्यै खर्च गरेको हरेक सिक्का टकसारले राख्ने अभिलेखमा रहिरहन्छ।",
    other:
      "{count} सिक्का भेटिए तर ती पहिले नै खर्च भइसकेका थिए, त्यसैले तिनीबापत केही जम्मा भएन। यो सामान्य हो: तपाईंले कहिल्यै खर्च गरेको हरेक सिक्का टकसारले राख्ने अभिलेखमा रहिरहन्छ।",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "थप {count} देखाउनुहोस्",
    other: "थप {count} देखाउनुहोस्",
  },
  "wallet.activity.show_more_a11y": {
    one: "थप {count} भुक्तानी देखाउनुहोस्",
    other: "थप {count} भुक्तानी देखाउनुहोस्",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} अपुष्ट",
    other: "{count} अपुष्ट",
  },
  "wallet.proof_count": {
    one: "{count} प्रमाण",
    other: "{count} प्रमाण",
  },
  "wallet.spent_removed_detail": {
    one: "{count} प्रमाण पहिले नै खर्च भइसकेको थियो र हटाइयो।",
    other: "{count} प्रमाण पहिले नै खर्च भइसकेका थिए र हटाइए।",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "नजिकै कोही छ",
    other: "{count} जना नजिकै छन्",
  },
};

export const ne = { strings, plurals };
