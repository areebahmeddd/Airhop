import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "होम पर वापस",
  "common.last_updated": "अंतिम अपडेट: {date}",

  "nav.aria": "मुख्य",
  "nav.home": "Airhop होम",
  "nav.skip": "सामग्री पर जाएँ",
  "nav.menu.open": "मेन्यू खोलें",
  "nav.menu.close": "मेन्यू बंद करें",
  "nav.how_it_works": "यह कैसे काम करता है",
  "nav.architecture": "आर्किटेक्चर",
  "nav.faq": "सामान्य प्रश्न",

  "footer.aria": "फ़ुटर",
  "footer.tagline": "निजी मेश संचार",
  "footer.credit": "© {author} द्वारा {heart} के साथ बनाया गया",
  "footer.group.download": "डाउनलोड",
  "footer.group.resources": "संसाधन",
  "footer.group.social": "सोशल",
  "footer.group.legal": "कानूनी",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "आर्किटेक्चर",
  "footer.link.blogs": "ब्लॉग",
  "footer.link.faq": "सामान्य प्रश्न",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "सेवा की शर्तें",
  "footer.link.privacy": "गोपनीयता नीति",
  "footer.link.license": "प्रोजेक्ट लाइसेंस",

  "settings.theme.group": "रंग थीम",
  "settings.theme.light": "हल्की थीम",
  "settings.theme.dark": "गहरी थीम",
  "settings.language.label": "भाषा",
  "settings.language.suggestion": "यह पेज हिन्दी में देखें",
  "settings.language.dismiss": "बंद करें",

  "home.hero.release": "नवीनतम रिलीज़",
  "home.hero.title": "ऐसी मैसेजिंग जो इंटरनेट के बिना चलती है।",
  "home.hero.body":
    "आसपास के फ़ोन मिलकर एक Bluetooth मेश बनाते हैं और आपके संदेश आगे पहुँचाते हैं, एंड-टू-एंड एन्क्रिप्टेड। {no_servers}, {no_accounts}, {no_tracking}।",
  "home.hero.body.no_servers": "कोई सर्वर नहीं",
  "home.hero.body.no_accounts": "कोई खाता नहीं",
  "home.hero.body.no_tracking": "कोई ट्रैकिंग नहीं",
  "home.hero.download": "ऐप डाउनलोड करें",
  "home.hero.badges": "MIT लाइसेंस · मुफ़्त और ओपन सोर्स · bitchat के साथ काम करता है",
  "home.hero.group.mobile": "मोबाइल",
  "home.hero.group.desktop": "डेस्कटॉप",
  "home.hero.option.zapstore": "Nostr पर हस्ताक्षरित",
  "home.hero.option.apk": "सीधा डाउनलोड",
  "home.hero.option.soon": "जल्द आ रहा है",

  "home.about.eyebrow": "Airhop क्या है",
  "home.about.title": "ज़्यादातर ऐप एक केंद्रीय सर्वर पर निर्भर होते हैं।",
  "home.about.sub":
    "सर्वर पर निगरानी रखी जा सकती है, उसे बंद या ब्लॉक किया जा सकता है। Airhop के पास कोई सर्वर नहीं है, इसलिए न दबाव डालने के लिए कोई कंपनी है और न बंद करने के लिए कोई सेवा।",
  "home.about.card": "तकनीकी अवलोकन",
  "home.about.link.mesh": "Bluetooth Low Energy मेश",
  "home.about.link.wire_protocol": "वायर प्रोटोकॉल",
  "home.about.body.built":
    "Airhop iOS और Android के लिए एक ओपन-सोर्स ऐप है, जो {mesh} पर निजी पीयर-टू-पीयर मैसेजिंग देता है। यह {bitchat} की नींव पर बना है, उसके {wire_protocol} और सुरक्षा मॉडल का पुनः उपयोग करता है, और फिर उसे ऑफ़लाइन {ecash} भुगतान और ऑफ़लाइन AI के साथ आगे बढ़ाता है। यह बिना किसी इंटरनेट कनेक्टिविटी के काम करता है, और संदेश आसपास के डिवाइसों के बीच अपने आप आगे बढ़ते हैं (घर के भीतर लगभग 10 से 30 मीटर प्रति हॉप, खुले में उससे ज़्यादा), 7 हॉप तक।",
  "home.about.body.identity":
    "आपकी पहचान एक {ed25519} की-पेयर है, जो आपके डिवाइस पर बनती है और {ios_keychain} या {android_keystore} में रखी जाती है। कोई खाता नहीं, कोई रजिस्ट्रेशन नहीं, और ऐसा कुछ भी नहीं जो किसी सर्वर को छुए, यानी इसे एक बर्नर ऐप की तरह इस्तेमाल किया जा सकता है, जो हटाने के बाद आपसे जुड़ा कुछ भी पीछे नहीं छोड़ता।",
  "home.about.body.crypto":
    "हर सत्र प्रमाणित हैंडशेक के लिए {noise} प्रोटोकॉल का उपयोग करता है। संग्रहीत संदेश {ratchet} एल्गोरिद्म का उपयोग करते हैं, यानी अगर आपका डिवाइस बाद में असुरक्षित हो भी जाए, तो आपके पुराने संदेश पढ़े नहीं जा सकते। पैनिक वाइप एक सेकंड से भी कम में सभी कुंजियाँ और संदेश नष्ट कर देता है।",
  "home.about.body.internet":
    "जब आप और आपका संपर्क Bluetooth की सीमा से बाहर हों, तो {nostr} रिले इंटरनेट पुल का काम करते हैं, और {nip17} शैली के गिफ़्ट-रैप्ड डायरेक्ट मैसेज इस्तेमाल होते हैं, जिससे जब भी आप दोनों ऑनलाइन हों, मेश दुनिया भर तक फैल जाता है। {tor} समर्थन iOS और Android दोनों पर {arti} के ज़रिये उपलब्ध है, और Tor को रोकने वाले नेटवर्कों के लिए {obfs4} और {snowflake} ब्रिज भी हैं।",
  "home.about.optional.title": "Airhop में कुछ वैकल्पिक सुविधाएँ हैं जिन्हें आप चालू कर सकते हैं:",
  "home.about.optional.payments.label": "ऑफ़लाइन भुगतान:",
  "home.about.optional.payments.body":
    "{cashu} प्रोटोकॉल का उपयोग करके मेश पर भुगतान भेजें और प्राप्त करें (केवल Bitcoin)।",
  "home.about.optional.ai.label": "ऑफ़लाइन AI:",
  "home.about.optional.ai.body":
    "डिवाइस पर चलने वाला एक छोटा AI सहायक, जो ज़रूरी सवालों के जवाब दे सकता है। सारी प्रोसेसिंग और डेटा आपके डिवाइस पर ही रहते हैं।",
  "home.about.body.compatible":
    "Airhop प्रोटोकॉल स्तर पर bitchat के साथ संगत है। एक ही मेश पर मौजूद Airhop डिवाइस और bitchat डिवाइस एक-दूसरे को अपने आप खोज लेते हैं और बिना किसी कॉन्फ़िगरेशन के संदेश और डायरेक्ट मैसेज साझा कर सकते हैं।",

  "home.situations.eyebrow": "कब ज़रूरत पड़ती है",
  "home.situations.title": "उस दिन के लिए जब नेटवर्क बैठ जाए।",
  "home.situations.sub":
    "प्राकृतिक आपदाएँ, इंटरनेट बंदी, बड़े प्रदर्शन, या नेटवर्क से बाहर बिताया कोई आम सप्ताहांत।",
  "home.situations.disaster.label": "आपदा",
  "home.situations.disaster.line":
    "टावर ठप हैं। बोर्ड पर लगी सूचना हर उस व्यक्ति तक पहुँचती है जो पास से गुज़रे।",
  "home.situations.offgrid.label": "नेटवर्क से बाहर",
  "home.situations.offgrid.line": "पगडंडी पर दूसरा दिन। सिग्नल की आख़िरी लकीर कल ही गायब हो गई।",
  "home.situations.protest.label": "प्रदर्शन",
  "home.situations.protest.line":
    "पर्चे पर छपा एक QR कोड मार्च के लिए एन्क्रिप्टेड चैनल खोल देता है।",
  "home.situations.festival.label": "उत्सव",
  "home.situations.festival.line":
    "मैदान में सिग्नल नहीं है। संदेश अजनबियों के फ़ोन से होकर आगे बढ़ते हैं।",

  "home.showcase.eyebrow": "ऐप देखें",
  "home.showcase.title": "एक आम मैसेंजर, बिना नेटवर्क के।",
  "home.showcase.sub":
    "चैट, चैनल, एक वॉलेट और एक पहचान। ऊपर से जाना-पहचाना, और नीचे मेश सारा काम करता हुआ।",
  "home.showcase.mesh.title": "मेश",
  "home.showcase.mesh.caption":
    "सीमा के भीतर सभी लोग, दूरी के हिसाब से सजे हुए। किसी को पहले जोड़ने की ज़रूरत नहीं।",
  "home.showcase.mesh.alt":
    "Airhop ऐप की मेश स्क्रीन, जिसमें आसपास के चार पीयर सिग्नल की ताक़त के अनुसार रडार पर दिखाए गए हैं।",
  "home.showcase.chats.title": "चैट",
  "home.showcase.chats.caption":
    "आम बातचीत। जो फ़ोन हर संदेश को आगे बढ़ाते हैं, वे उसे खोल नहीं सकते।",
  "home.showcase.chats.alt":
    "बिजली कटौती के दौरान Airhop में एक डायरेक्ट मैसेज बातचीत, जो तीन फ़ोन के ज़रिये आगे बढ़ी।",
  "home.showcase.channels.title": "चैनल",
  "home.showcase.channels.caption":
    "सार्वजनिक कमरे, एक मोहल्ले जितने छोटे या एक क्षेत्र जितने बड़े, वहाँ मौजूद हर किसी के लिए खुले।",
  "home.showcase.channels.alt":
    "Airhop ऐप की चैट स्क्रीन, जिसमें ब्लॉक, मोहल्ले, शहर और क्षेत्र तक सीमित सार्वजनिक चैनल दिख रहे हैं।",
  "home.showcase.wallet.title": "वॉलेट",
  "home.showcase.wallet.caption":
    "अपने बगल वाले व्यक्ति को Bluetooth से ecash दें, जबकि कोई भी फ़ोन ऑनलाइन न हो।",
  "home.showcase.wallet.alt":
    "Airhop ऐप की वॉलेट स्क्रीन, जिसमें ecash बैलेंस दिख रहा है जिसे Bluetooth से भेजा जा सकता है।",
  "home.showcase.identity.title": "पहचान",
  "home.showcase.identity.caption":
    "न साइन अप, न फ़ोन नंबर, न ईमेल। बस एक कुंजी जो इस फ़ोन से कभी बाहर नहीं जाती।",
  "home.showcase.identity.alt":
    "Airhop ऐप की प्रोफ़ाइल स्क्रीन, जिसमें बिना खाते के डिवाइस पर बनी पहचान दिख रही है।",

  "home.how.eyebrow": "यह कैसे काम करता है",
  "home.how.title": "मेश अपने आप बन जाता है।",
  "home.how.sub":
    "पास के नोड Bluetooth पर अपने आप ठीक होने वाला मेश बना लेते हैं। जब इंटरनेट हो, तो Nostr रिले उसे और आगे बढ़ा देते हैं, और ऐसा कोई ढाँचा नहीं जिस पर किसी का नियंत्रण हो।",
  "home.how.cta": "पूरा आर्किटेक्चर पढ़ें",
  "home.how.discover.title": "खोज",
  "home.how.discover.line":
    "Airhop या bitchat चलाने वाले फ़ोन Bluetooth पर एक-दूसरे को अपने आप ढूँढ लेते हैं। न पेयरिंग, न सेटअप।",
  "home.how.relay.title": "रिले",
  "home.how.relay.line":
    "संदेश फ़ोन से फ़ोन तक जाता है, सात हॉप तक। बीच के फ़ोन कभी नहीं देख पाते कि वे क्या ले जा रहे हैं।",
  "home.how.reach.title": "और दूर तक",
  "home.how.reach.line":
    "जब इंटरनेट हो, Nostr रिले उसी बातचीत को और दूर तक ले जाते हैं, चाहें तो Tor के ज़रिये।",
  "home.how.swipe": "देखने के लिए स्वाइप करें",
  "home.how.diagram": "BLE मेश · स्थानीय पीयर-टू-पीयर नेटवर्क",
  "home.how.legend.node": "BLE मेश नोड (ऑफ़लाइन)",
  "home.how.legend.relay": "मल्टी-हॉप रिले (Noise XX एन्क्रिप्टेड)",
  "home.how.legend.bitchat": "उसी मेश पर bitchat के साथ संगत",
  "home.how.legend.nostr": "Nostr पुल (इंटरनेट, जब ऑनलाइन हों)",

  "home.map.aria": "Nostr रिले स्थानों का विश्व मानचित्र",
  "home.map.summary": "Nostr पुल · दुनिया भर की {locations} पर {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "यह क्या करता है",
  "home.features.title": "एक असली मैसेंजर, डेमो नहीं।",
  "home.features.sub":
    "चैट, पहचान, नेटवर्किंग और पैसा। सब कुछ इस तरह बना है कि बिना सिग्नल, बिना खाते और बीच में कुछ भी हुए बिना चले।",

  "home.features.messaging.title": "मैसेजिंग",
  "home.features.messaging.summary":
    "वह सब कुछ जो एक मैसेंजर में होता है, पीछे शून्य ढाँचे के साथ।",
  "home.features.messaging.dms.name": "निजी डायरेक्ट मैसेज",
  "home.features.messaging.dms.line": "एंड-टू-एंड एन्क्रिप्टेड, डिलीवरी और रीड रसीद के साथ।",
  "home.features.messaging.location.name": "स्थान आधारित चैनल",
  "home.features.messaging.location.line":
    "किसी जगह से जुड़े कमरे, एक ब्लॉक से लेकर पूरे क्षेत्र तक।",
  "home.features.messaging.groups.name": "निजी चैनल और समूह",
  "home.features.messaging.groups.line": "कमरे के लिए आमंत्रण लिंक, या 16 तक की हस्ताक्षरित सूची।",
  "home.features.messaging.board.name": "सूचना पट्ट",
  "home.features.messaging.board.line": "किसी इलाक़े पर सात दिन तक टँगी रहने वाली सूचनाएँ।",
  "home.features.messaging.voice.name": "लाइव आवाज़",
  "home.features.messaging.voice.line":
    "माइक दबाए रखें और सीमा के भीतर किसी से भी बात करें, वॉकी-टॉकी की तरह।",
  "home.features.messaging.notes.name": "वॉइस नोट",
  "home.features.messaging.notes.line": "रिकॉर्ड किया गया ऑडियो, रास्ता टाइप करने से तेज़।",
  "home.features.messaging.files.name": "फ़ोटो, वीडियो और फ़ाइलें",
  "home.features.messaging.files.line": "कोई भी फ़ॉर्मैट, 1 MiB तक, बिना किसी सिग्नल के।",
  "home.features.messaging.forward.name": "स्टोर-एंड-फ़ॉरवर्ड",
  "home.features.messaging.forward.line":
    "सील किया हुआ और पास के फ़ोन द्वारा तब तक ले जाया गया जब तक वह उन तक न पहुँचे।",

  "home.features.identity.title": "पहचान",
  "home.features.identity.summary": "न कुछ रजिस्टर करने को, न कुछ ज़ब्त करने को।",
  "home.features.identity.keys.name": "की-पेयर पहचान",
  "home.features.identity.keys.line": "इसी फ़ोन पर बनी, OS की चाबी-तिजोरी में रखी हुई।",
  "home.features.identity.names.name": "पढ़ने योग्य नाम",
  "home.features.identity.names.line": "आपकी कुंजी से बने, इसलिए आपका नाम कोई ले नहीं सकता।",
  "home.features.identity.qr.name": "QR संपर्क",
  "home.features.identity.qr.line": "एक स्कैन उनकी कुंजियाँ लाता है, सिर्फ़ नाम नहीं।",
  "home.features.identity.panic.name": "पैनिक वाइप",
  "home.features.identity.panic.line": "हर कुंजी और संदेश एक सेकंड से भी कम में नष्ट।",

  "home.features.networking.title": "नेटवर्किंग",
  "home.features.networking.summary": "फ़ोन ही नेटवर्क हैं।",
  "home.features.networking.mesh.name": "Bluetooth मेश",
  "home.features.networking.mesh.line":
    "न इंटरनेट, न राउटर, उन्हीं फ़ोनों पर जो लोगों के पास पहले से हैं।",
  "home.features.networking.bridge.name": "मेश पुल",
  "home.features.networking.bridge.line":
    "आपकी सार्वजनिक चैट को सीमा से बाहर मौजूद पास की भीड़ से जोड़ता है।",
  "home.features.networking.wifi.name": "WiFi फ़ास्ट पाथ",
  "home.features.networking.wifi.line": "दो Android या दो iPhone के बीच तेज़ ट्रांसफ़र।",
  "home.features.networking.bitchat.name": "bitchat के साथ संगत",
  "home.features.networking.bitchat.line":
    "दोनों ऐप बिना किसी सेटअप के एक ही मेश से जुड़ जाते हैं।",

  "home.features.internet.title": "इंटरनेट",
  "home.features.internet.summary": "एक विस्तार, कभी शर्त नहीं।",
  "home.features.internet.nostr.name": "Nostr फ़ॉलबैक",
  "home.features.internet.nostr.line":
    "डायरेक्ट मैसेज और स्थान चैनल रेडियो सीमा से आगे भी चलते रहते हैं।",
  "home.features.internet.relays.name": "जियो-रिले खोज",
  "home.features.internet.relays.line":
    "300 से ज़्यादा स्वतंत्र सार्वजनिक रिले, उनमें से कोई हमारा नहीं।",
  "home.features.internet.gateway.name": "इंटरनेट गेटवे",
  "home.features.internet.gateway.line":
    "अपना कनेक्शन उधार दें ताकि पास का ऑफ़लाइन फ़ोन स्थान चैनलों तक पहुँच सके।",
  "home.features.internet.tor.name": "Tor एकीकरण",
  "home.features.internet.tor.line":
    "दोनों प्लेटफ़ॉर्म पर रूट किया गया, ताकि रिले आपका IP कभी न देखें।",

  "home.features.optional.title": "वैकल्पिक",
  "home.features.optional.summary": "डिफ़ॉल्ट रूप से बंद। जब चाहें, चालू।",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "अपने बगल वाले व्यक्ति को भुगतान करें, जबकि कोई फ़ोन ऑनलाइन न हो।",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Lightning नेटवर्क पर bitcoin में टॉप अप या कैश आउट करें।",
  "home.features.optional.ai.name": "लोकल AI",
  "home.features.optional.ai.line": "डिवाइस पर ही जवाब, फ़ोन से कुछ बाहर नहीं जाता।",
  "home.features.optional.social.name": "सोशल पुल",
  "home.features.optional.social.line": "उसी पहचान से Bluesky और Mastodon।",

  "home.compare.eyebrow": "तुलना में कहाँ",
  "home.compare.title": "ऑफ़लाइन, बिना अतिरिक्त हार्डवेयर के, और खुला।",
  "home.compare.sub":
    "यहाँ हर ऐप किसी न किसी चीज़ में अच्छा है। पर उनमें से कुछ ही तब भी चलते हैं जब नेटवर्क नहीं चलता।",
  "home.compare.col.project": "प्रोजेक्ट",
  "home.compare.col.transport": "ट्रांसपोर्ट",
  "home.compare.col.encryption": "एन्क्रिप्शन",
  "home.compare.col.offline": "ऑफ़लाइन चलता है",
  "home.compare.col.hardware_free": "अतिरिक्त हार्डवेयर नहीं",
  "home.compare.col.open_source": "ओपन सोर्स",
  "home.compare.mark.yes": "हाँ",
  "home.compare.mark.no": "नहीं",
  "home.compare.mark.partial": "आंशिक, क्लाइंट ओपन सोर्स हैं, सर्वर नहीं",
  "home.compare.mark.partial_hint": "क्लाइंट ओपन सोर्स हैं, सर्वर नहीं",
  "home.compare.transport.servers": "केंद्रीकृत सर्वर",
  "home.compare.transport.onion": "ऑनियन रूटिंग (सर्विस नोड)",
  "home.compare.transport.nostr": "Nostr रिले",
  "home.compare.transport.lora": "LoRa रेडियो",
  "home.compare.transport.sub_ghz": "प्रोप्राइटरी सब-GHz रेडियो",

  "home.explore.eyebrow": "खुला और ईमानदार",
  "home.explore.title": "यहाँ किया गया हर दावा जाँचा जा सकता है।",
  "home.explore.sub":
    "कोड, प्रोटोकॉल और योजनाएँ सार्वजनिक हैं। सीमाएँ भी। हमारी बात मानने से पहले ख़ुद जाँच लें।",
  "home.explore.audit.chip": "ऑडिट बाकी",
  "home.explore.audit.headline": "Airhop का अब तक कोई बाहरी सुरक्षा ऑडिट नहीं हुआ है।",
  "home.explore.audit.body":
    "{headline} सारा कोड व्यक्तिगत रूप से देखा जाता है और रिलीज़ से पहले एक {review} से गुज़रता है, और जो क्रिप्टोग्राफ़िक लाइब्रेरी यह इस्तेमाल करता है उसका Cure53 ऑडिट हो चुका है, पर यह ऐप के औपचारिक ऑडिट की जगह नहीं ले सकता। एक ऑडिट {version} के लिए तय है। तब तक संवेदनशील कामों के लिए इस पर निर्भर न रहें।",
  "home.explore.audit.link.review": "सुरक्षा समीक्षा एजेंट",
  "home.explore.source.title": "सोर्स कोड",
  "home.explore.source.desc":
    "सब कुछ GitHub पर MIT के तहत। इशू, पुल रिक्वेस्ट और चर्चाएँ खुली हैं।",
  "home.explore.protocol.title": "प्रोटोकॉल स्पेसिफ़िकेशन",
  "home.explore.protocol.desc": "सटीक वायर फ़ॉर्मैट, BLE UUID और स्थिरांक, bitchat के साथ साझा।",
  "home.explore.architecture.title": "आर्किटेक्चर",
  "home.explore.architecture.desc":
    "पूरा तकनीकी विवरण, भेजें दबाने से लेकर रेडियो पर जाते बाइट तक।",
  "home.explore.roadmap.title": "रोडमैप",
  "home.explore.roadmap.desc": "v0.5.0 से v2.0.0 तक के संस्करण लक्ष्य, प्रस्तावित ऑडिट सहित।",
  "home.explore.vision.title": "दृष्टि",
  "home.explore.vision.desc": "Airhop क्यों है, और वे सिद्धांत जो दबाव में भी नहीं बदलते।",
  "home.explore.brand.title": "ब्रांड किट",
  "home.explore.brand.desc":
    "पिक्सेल पक्षी, रंग और टाइपोग्राफ़ी टोकन, प्रेस सामग्री और तैयार टेक्स्ट।",

  "home.contribute.eyebrow": "इस प्रोजेक्ट का साथ दें",
  "home.contribute.title": "स्वतंत्र, और सबके सामने।",
  "home.contribute.sub":
    "न निवेशक हैं, न विज्ञापन, न कोई पेड टियर। हर सुविधा वैसे भी मुफ़्त रहती है, और यह काम उन्हीं लोगों से चलता है जिन्हें यह उपयोगी लगता है।",
  "home.contribute.contribute.chip": "योगदान",
  "home.contribute.contribute.body":
    "रिपॉज़िटरी को स्टार दें, इशू खोलें और पुल रिक्वेस्ट भेजें। बग रिपोर्ट, फ़ीचर सुझाव और कोड योगदान, सभी का स्वागत है।",
  "home.contribute.contribute.cta": "GitHub पर देखें",
  "home.contribute.sponsor.chip": "प्रायोजक",
  "home.contribute.sponsor.body":
    "अगर Airhop आपके काम आता है, तो एक बार का दान या नियमित प्रायोजन विकास को चलाए रखने में बहुत मदद करता है।",
  "home.contribute.sponsor.donate": "एक बार दान करें",
  "home.contribute.sponsor.github": "GitHub पर प्रायोजक बनें",

  "page.architecture.eyebrow": "दस्तावेज़ीकरण",
  "page.architecture.title": "आर्किटेक्चर",
  "page.architecture.toc": "इस पेज पर",

  "page.faq.eyebrow": "सामान्य प्रश्न",
  "page.faq.title": "अक्सर पूछे जाने वाले प्रश्न",
  "page.faq.meta": "Airhop के बारे में आम सवाल।",
  "page.faq.contact":
    "जिन सवालों के जवाब यहाँ नहीं हैं, उन्हें {email} पर भेजा जा सकता है या {github} पर चर्चा खोलकर उठाया जा सकता है।",

  "page.blogs.eyebrow": "ब्लॉग",
  "page.blogs.title": "जल्द आ रहा है",
  "page.blogs.body": "मेश नेटवर्किंग, गोपनीयता और ऑफ़लाइन-फ़र्स्ट सॉफ़्टवेयर पर लेख।",

  "page.brand.eyebrow": "ब्रांड",
  "page.brand.title": "ब्रांड किट",
  "page.brand.meta":
    "किसी लेख, स्टोर लिस्टिंग, टॉक या README में Airhop को दिखाने के लिए सामग्री और नियम। संदर्भ और प्रेस के लिए स्वतंत्र रूप से उपलब्ध।",

  "page.legal.eyebrow": "कानूनी",
  "page.privacy.title": "गोपनीयता नीति",
  "page.terms.title": "सेवा की शर्तें",

  "page.notfound.title": "पेज नहीं मिला",
  "page.notfound.body": "आप जो पेज खोज रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",

  "page.english_only": "यह पेज केवल अंग्रेज़ी में उपलब्ध है।",

  "seo.breadcrumb.home": "होम",

  "seo.home.title": "Airhop — निजी, ऑफ़लाइन-फ़र्स्ट मैसेंजर",
  "seo.home.description":
    "iOS और Android के लिए निजी पीयर-टू-पीयर मैसेजिंग। न इंटरनेट, न सर्वर, न खाते। कहीं भी Bluetooth मेश पर संवाद करें।",

  "seo.architecture.title": "आर्किटेक्चर — Airhop",
  "seo.architecture.description":
    "Airhop ऊपर से नीचे तक कैसे काम करता है: पहचान, ट्रांसपोर्ट चयन, Bluetooth मेश, एन्क्रिप्शन, इंटरनेट परत, Tor, ऑफ़लाइन ecash, डिवाइस पर AI, और bitchat के साथ संगत वायर फ़ॉर्मैट।",
  "seo.architecture.breadcrumb": "आर्किटेक्चर",
  "seo.architecture.headline": "Airhop आर्किटेक्चर",
  "seo.architecture.summary":
    "Airhop का पूरा तकनीकी विवरण: पहचान, ट्रांसपोर्ट, Bluetooth मेश, एन्क्रिप्शन, Nostr इंटरनेट परत, Tor, Cashu वॉलेट, डिवाइस पर AI सहायक, और वायर फ़ॉर्मैट।",

  "seo.faq.title": "अक्सर पूछे जाने वाले प्रश्न — Airhop",
  "seo.faq.description":
    "Airhop की Bluetooth मेश मैसेजिंग, एन्क्रिप्शन, ऑफ़लाइन भुगतान, Nostr इंटरनेट परत और bitchat संगतता के बारे में जवाब।",
  "seo.faq.breadcrumb": "सामान्य प्रश्न",

  "seo.blogs.title": "ब्लॉग — Airhop",
  "seo.blogs.description": "मेश नेटवर्किंग, गोपनीयता और ऑफ़लाइन-फ़र्स्ट सॉफ़्टवेयर पर लेख।",
  "seo.blogs.breadcrumb": "ब्लॉग",

  "seo.brand.title": "ब्रांड किट — Airhop",
  "seo.brand.description":
    "Airhop ब्रांड किट: पिक्सेल पक्षी चिह्न, वर्डमार्क, रंग और टाइपोग्राफ़ी टोकन, प्रेस सामग्री और तैयार टेक्स्ट।",
  "seo.brand.breadcrumb": "ब्रांड किट",

  "seo.privacy.title": "गोपनीयता नीति — Airhop",
  "seo.privacy.description":
    "Airhop डेटा को कैसे संभालता है: न खाते, न सर्वर, न ट्रैकिंग। आपकी पहचान और संदेश आपके डिवाइस पर ही रहते हैं।",
  "seo.privacy.breadcrumb": "गोपनीयता नीति",

  "seo.terms.title": "सेवा की शर्तें — Airhop",
  "seo.terms.description": "Airhop ऐप और वेबसाइट के उपयोग को नियंत्रित करने वाली शर्तें।",
  "seo.terms.breadcrumb": "सेवा की शर्तें",

  "seo.notfound.title": "पेज नहीं मिला — Airhop",
  "seo.notfound.description": "आप जो पेज खोज रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} रिले",
    other: "{count} रिले",
  },
  "home.map.locations": {
    one: "{count} जगह",
    other: "{count} जगहों",
  },
};

export const locale: Locale = { strings, plurals };
