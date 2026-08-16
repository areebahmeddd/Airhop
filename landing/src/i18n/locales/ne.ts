import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "गृहपृष्ठमा फर्कनुहोस्",
  "common.last_updated": "पछिल्लो अद्यावधिक: {date}",

  "nav.aria": "मुख्य नेभिगेसन",
  "nav.home": "Airhop गृहपृष्ठ",
  "nav.skip": "सामग्रीमा जानुहोस्",
  "nav.menu.open": "मेनु खोल्नुहोस्",
  "nav.menu.close": "मेनु बन्द गर्नुहोस्",
  "nav.how_it_works": "यो कसरी काम गर्छ",
  "nav.architecture": "संरचना",
  "nav.faq": "बारम्बार सोधिने प्रश्न",

  "footer.aria": "फुटर",
  "footer.tagline": "निजी मेस सञ्चार",
  "footer.credit": "© {author} ले {heart} सहित बनाएको",
  "footer.group.download": "डाउनलोड",
  "footer.group.resources": "स्रोतहरू",
  "footer.group.social": "सामाजिक",
  "footer.group.legal": "कानुनी",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "संरचना",
  "footer.link.blogs": "ब्लग",
  "footer.link.faq": "बारम्बार सोधिने प्रश्न",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "सेवाका सर्तहरू",
  "footer.link.privacy": "गोपनीयता नीति",
  "footer.link.license": "परियोजना इजाजतपत्र",

  "settings.theme.group": "रङ थिम",
  "settings.theme.light": "उज्यालो थिम",
  "settings.theme.dark": "अँध्यारो थिम",
  "settings.language.label": "भाषा",
  "settings.language.suggestion": "यो पृष्ठ नेपालीमा हेर्नुहोस्",
  "settings.language.dismiss": "बन्द गर्नुहोस्",

  "home.hero.release": "पछिल्लो संस्करण",
  "home.hero.title": "इन्टरनेटविनै चल्ने सन्देश आदानप्रदान।",
  "home.hero.body":
    "नजिकका फोनहरूले Bluetooth मेस बनाउँछन् र तपाईंका सन्देशहरू सात हपसम्म, अन्त्यदेखि अन्त्यसम्म गुप्तीकृत गरेर पुर्‍याउँछन्। {no_servers}, {no_accounts}, {no_tracking}।",
  "home.hero.body.no_servers": "कुनै सर्भर छैन",
  "home.hero.body.no_accounts": "कुनै खाता छैन",
  "home.hero.body.no_tracking": "कुनै ट्र्याकिङ छैन",
  "home.hero.download": "एप डाउनलोड गर्नुहोस्",
  "home.hero.badges": "MIT इजाजतपत्र · निःशुल्क र खुला स्रोत · bitchat सँग मिल्ने",
  "home.hero.group.mobile": "मोबाइल",
  "home.hero.group.desktop": "डेस्कटप",
  "home.hero.option.f_droid": "खुला स्रोत सूची",
  "home.hero.option.apk": "सिधा डाउनलोड",
  "home.hero.option.soon": "चाँडै आउँदै",

  "home.about.eyebrow": "Airhop के हो",
  "home.about.title": "धेरैजसो एपहरू एउटा केन्द्रीय सर्भरमा निर्भर हुन्छन्।",
  "home.about.sub":
    "सर्भरलाई निगरानी गर्न, बन्द गर्न वा रोक्न सकिन्छ। Airhop सँग कुनै सर्भर छैन, त्यसैले दबाब दिने कम्पनी पनि छैन र बन्द गर्ने सेवा पनि छैन।",
  "home.about.card": "प्राविधिक झलक",
  "home.about.link.mesh": "Bluetooth Low Energy मेस",
  "home.about.link.wire_protocol": "प्रसारण प्रोटोकल",
  "home.about.body.built":
    "Airhop भनेको {mesh} मार्फत उपकरणहरूबीच सिधै निजी सन्देश आदानप्रदानका लागि iOS र Android का लागि बनेको खुला स्रोत एप हो। यो {bitchat} को जगमा बनेको छ, त्यसको {wire_protocol} र सुरक्षा ढाँचा पुनः प्रयोग गर्छ, अनि तिनलाई Tor, अफलाइन {ecash} भुक्तानी र अफलाइन एआईसँग विस्तार गर्छ। इन्टरनेट जडान नभए पनि यो चल्छ, र सन्देशहरू नजिकका उपकरणहरूमार्फत आफैँ पुग्छन् (भित्र प्रत्येक हपमा लगभग 10 देखि 30 मिटर, खुला ठाउँमा अझ टाढा), 7 हपसम्म।",
  "home.about.body.identity":
    "तपाईंको परिचय भनेको तपाईंकै उपकरणमा बनेको र {ios_keychain} वा {android_keystore} मा राखिएको {ed25519} साँचो जोडी हो। कुनै खाता छैन, दर्ता छैन, र कुनै सर्भरलाई छुने कुरा पनि छैन; अर्थात् मेटाएपछि तपाईंसम्म पुर्‍याउने केही नछोड्ने अस्थायी एपजस्तै प्रयोग गर्न सकिन्छ।",
  "home.about.body.crypto":
    "हरेक सत्रले प्रमाणित ह्यान्डसेकका लागि {noise} प्रोटोकल प्रयोग गर्छ। भण्डारण गरिएका सन्देशहरूले {ratchet} एल्गोरिदम प्रयोग गर्छन्; अर्थात् पछि तपाईंको उपकरण जोखिममा परे पनि विगतका सन्देशहरू पढ्न नसकिने नै रहन्छन्। आपत्कालीन मेटाइले सबै साँचो र सन्देश एक सेकेन्डभित्रै नष्ट गर्छ।",
  "home.about.body.internet":
    "तपाईं र तपाईंको सम्पर्क Bluetooth को पहुँचबाहिर हुँदा {nostr} रिलेहरूले इन्टरनेटमार्फत पुलको काम गर्छन्, र {nip17} ढाँचामा बेरिएका सिधा सन्देशहरू प्रयोग हुन्छन्; त्यसैले दुवै जना अनलाइन हुँदा मेस विश्वभर फैलिन्छ। {tor} को सहयोग iOS ({arti} मार्फत) र Android ({orbot} मार्फत) दुवैमा उपलब्ध छ।",
  "home.about.optional.title": "Airhop मा तपाईंले चाहेमा खोल्न सकिने वैकल्पिक सुविधाहरू छन्:",
  "home.about.optional.payments.label": "अफलाइन भुक्तानी:",
  "home.about.optional.payments.body":
    "{cashu} प्रोटोकल प्रयोग गरेर मेसमार्फत भुक्तानी पठाउनुहोस् र प्राप्त गर्नुहोस् (Bitcoin मात्र)।",
  "home.about.optional.ai.label": "अफलाइन एआई:",
  "home.about.optional.ai.body":
    "उपकरणमै चल्ने सानो एआई सहयोगी, जसले महत्त्वपूर्ण प्रश्नहरूको जवाफ दिन सक्छ। सबै प्रशोधन र डेटा तपाईंकै उपकरणमा रहन्छ।",
  "home.about.body.compatible":
    "Airhop प्रोटोकल तहमा bitchat सँग मिल्छ। एउटै मेसमा रहेको Airhop उपकरण र bitchat उपकरणले आफैँ एकअर्कालाई भेट्टाउँछन् र कुनै मिलान नगरी सन्देश तथा सिधा सन्देश आदानप्रदान गर्न सक्छन्।",

  "home.situations.eyebrow": "कहिले चाहिन्छ",
  "home.situations.title": "सञ्जाल ठप्प हुने दिनका लागि।",
  "home.situations.sub":
    "प्राकृतिक प्रकोप, इन्टरनेट बन्द, ठूला प्रदर्शन, वा सञ्जालबाहिर बिताइएको सामान्य सप्ताहन्त।",
  "home.situations.disaster.label": "प्रकोप",
  "home.situations.disaster.line":
    "टावरहरू ठप्प छन्। सूचना पाटीको खबर त्यहाँबाट हिँड्ने सबैसम्म पुग्छ।",
  "home.situations.offgrid.label": "सञ्जालबाहिर",
  "home.situations.offgrid.line": "बाटोमा दोस्रो दिन। अन्तिम सिग्नलको धर्को हिजै हरायो।",
  "home.situations.protest.label": "प्रदर्शन",
  "home.situations.protest.line":
    "पर्चामा छापिएको एउटा QR कोडले जुलुसका लागि गुप्तीकृत च्यानल खोल्छ।",
  "home.situations.festival.label": "उत्सव",
  "home.situations.festival.line":
    "मैदानमा सिग्नल छैन। सन्देशहरू अपरिचितहरूका फोन हुँदै उफ्रिन्छन्।",

  "home.showcase.eyebrow": "एप हेर्नुहोस्",
  "home.showcase.title": "सामान्य म्यासेन्जर, इन्टरनेटविनै।",
  "home.showcase.sub":
    "कुराकानी, च्यानल, वालेट र परिचय। माथिबाट चिनेजानेकै, तल मेसले काम गरिरहेको।",
  "home.showcase.mesh.title": "मेस",
  "home.showcase.mesh.caption":
    "पहुँचभित्रका सबै जना, कति नजिक छन् त्यसै अनुसार मिलाइएका। कसैलाई पहिले थप्नु पर्दैन।",
  "home.showcase.mesh.alt":
    "Airhop एपको मेस स्क्रिन, जसमा नजिकका चार उपकरण सिग्नलको बलअनुसार रडारमा मिलाइएका छन्।",
  "home.showcase.chats.title": "कुराकानी",
  "home.showcase.chats.caption":
    "सामान्य कुराकानी। हरेक सन्देश पुर्‍याउने फोनहरूले त्यसलाई खोल्न सक्दैनन्।",
  "home.showcase.chats.alt":
    "बत्ती गएको बेला Airhop मा भएको सिधा सन्देशको कुराकानी, तीनवटा फोन हुँदै पुर्‍याइएको।",
  "home.showcase.channels.title": "च्यानल",
  "home.showcase.channels.caption":
    "एउटा टोलजत्रो सानो वा एउटा क्षेत्रजत्रो ठूलो सार्वजनिक कोठा, त्यहाँ भएका जोसुकैका लागि खुला।",
  "home.showcase.channels.alt":
    "Airhop एपको कुराकानी स्क्रिन, जसमा टोल, छिमेक, सहर र क्षेत्रसम्म सीमित सार्वजनिक च्यानलहरू सूचीबद्ध छन्।",
  "home.showcase.wallet.title": "वालेट",
  "home.showcase.wallet.caption":
    "दुवै फोन अनलाइन नभएकै बेला Bluetooth मार्फत छेउमा भएको मान्छेलाई ecash दिनुहोस्।",
  "home.showcase.wallet.alt":
    "Airhop एपको वालेट स्क्रिन, जसमा Bluetooth मार्फत पठाउन सकिने ecash मौज्दात देखाइएको छ।",
  "home.showcase.identity.title": "परिचय",
  "home.showcase.identity.caption":
    "दर्ता छैन, फोन नम्बर छैन, इमेल छैन। यो फोन कहिल्यै नछोड्ने एउटा साँचो मात्र।",
  "home.showcase.identity.alt":
    "Airhop एपको प्रोफाइल स्क्रिन, जसमा खाताविनै उपकरणमै बनेको परिचय देखाइएको छ।",

  "home.how.eyebrow": "यो कसरी काम गर्छ",
  "home.how.title": "मेस आफैँ बन्छ।",
  "home.how.sub":
    "नजिकका नोडहरूले Bluetooth मा आफैँ मर्मत हुने मेस बनाउँछन्। इन्टरनेट भएका बेला Nostr रिलेहरूले त्यसलाई फैलाउँछन्, कसैको नियन्त्रणमा नरहेको पूर्वाधारसहित।",
  "home.how.cta": "पूरा संरचना पढ्नुहोस्",
  "home.how.discover.title": "पत्ता लगाउने",
  "home.how.discover.line":
    "Airhop वा bitchat चलाइरहेका फोनहरूले Bluetooth मार्फत आफैँ एकअर्कालाई भेट्टाउँछन्। जोडा मिलाउनु पर्दैन, मिलान गर्नु पर्दैन।",
  "home.how.relay.title": "पुर्‍याउने",
  "home.how.relay.line":
    "सन्देश फोनबाट फोनमा उफ्रिन्छ, सात हपसम्म। बीचका फोनहरूले आफूले बोकेको कुरा कहिल्यै देख्दैनन्।",
  "home.how.reach.title": "अझ टाढासम्म",
  "home.how.reach.line":
    "इन्टरनेट भएका बेला Nostr रिलेहरूले त्यही कुराकानीलाई अझ टाढा पुर्‍याउँछन्, चाहे Tor हुँदै।",
  "home.how.swipe": "हेर्न स्वाइप गर्नुहोस्",
  "home.how.diagram": "BLE मेस · स्थानीय उपकरणबीचको सञ्जाल",
  "home.how.legend.node": "BLE मेस नोड (अफलाइन)",
  "home.how.legend.relay": "धेरै हपको प्रसारण (Noise XX गुप्तीकरण)",
  "home.how.legend.bitchat": "उही मेसमा bitchat सँग मिल्ने",
  "home.how.legend.nostr": "Nostr पुल (इन्टरनेट, अनलाइन हुँदा)",

  "home.map.aria": "Nostr रिलेहरूको स्थान देखाउने विश्व नक्सा",
  "home.map.summary": "Nostr पुल · विश्वभरका {locations} मा {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "यसले के गर्छ",
  "home.features.title": "साँच्चिकै म्यासेन्जर, नमुना होइन।",
  "home.features.sub":
    "कुराकानी, परिचय, सञ्जाल र पैसा। सबै सिग्नलविनै, खाताविनै र बीचमा केही नराखी चल्ने गरी बनाइएका।",

  "home.features.messaging.title": "सन्देश",
  "home.features.messaging.summary": "म्यासेन्जरमा हुने सबथोक, पछाडि शून्य पूर्वाधारसहित।",
  "home.features.messaging.dms.name": "निजी सिधा सन्देश",
  "home.features.messaging.dms.line":
    "अन्त्यदेखि अन्त्यसम्म गुप्तीकृत, पुगेको र पढेको जानकारीसहित।",
  "home.features.messaging.location.name": "स्थान च्यानल",
  "home.features.messaging.location.line":
    "ठाउँसँग जोडिएका कोठाहरू, एउटा टोलदेखि एउटा क्षेत्रसम्म।",
  "home.features.messaging.groups.name": "निजी च्यानल र समूह",
  "home.features.messaging.groups.line":
    "कोठाका लागि निम्तो लिंक, वा 16 जनासम्मको हस्ताक्षरित सूची।",
  "home.features.messaging.board.name": "सूचना पाटी",
  "home.features.messaging.board.line": "कुनै क्षेत्रमा सात दिनसम्म टाँसिने सूचनाहरू।",
  "home.features.messaging.voice.name": "प्रत्यक्ष आवाज",
  "home.features.messaging.voice.line":
    "माइक थिचिराखेर पहुँचभित्रका जोसुकैसँग बोल्नुहोस्, वाकीटकीजस्तै।",
  "home.features.messaging.notes.name": "आवाज सन्देश",
  "home.features.messaging.notes.line": "रेकर्ड गरिएको आवाज, बाटो टाइप गर्नुभन्दा छिटो।",
  "home.features.messaging.files.name": "फोटो, भिडियो र फाइल",
  "home.features.messaging.files.line": "जुनसुकै ढाँचा, 1 MB सम्म, सिग्नल नचाहिने।",
  "home.features.messaging.forward.name": "राखेर पठाउने",
  "home.features.messaging.forward.line":
    "छाप लगाइएको र प्राप्तकर्तासम्म नपुगुन्जेल नजिकको फोनले बोकेको।",

  "home.features.identity.title": "परिचय",
  "home.features.identity.summary": "दर्ता गर्ने केही छैन, जफत गर्ने केही छैन।",
  "home.features.identity.keys.name": "साँचो जोडीको परिचय",
  "home.features.identity.keys.line": "यही फोनमा बनेको, प्रणालीको साँचो भण्डारमा राखिएको।",
  "home.features.identity.names.name": "पढ्न मिल्ने नाम",
  "home.features.identity.names.line":
    "तपाईंको साँचोबाट बनेको, त्यसैले तपाईंको नाम कसैले लिन सक्दैन।",
  "home.features.identity.qr.name": "QR सम्पर्क",
  "home.features.identity.qr.line": "एकपटक स्क्यान गर्दा नाम मात्र होइन, उनीहरूका साँचो पनि आउँछ।",
  "home.features.identity.panic.name": "आपत्कालीन मेटाइ",
  "home.features.identity.panic.line": "हरेक साँचो र हरेक सन्देश एक सेकेन्डभित्रै नष्ट।",

  "home.features.networking.title": "सञ्जाल",
  "home.features.networking.summary": "फोनहरू नै सञ्जाल हुन्।",
  "home.features.networking.mesh.name": "Bluetooth मेस",
  "home.features.networking.mesh.line":
    "इन्टरनेट छैन, राउटर छैन, मानिसहरूसँग पहिल्यै भएका फोनहरूमै।",
  "home.features.networking.bridge.name": "मेस पुल",
  "home.features.networking.bridge.line":
    "तपाईंको सार्वजनिक कुराकानीलाई पहुँचबाहिर रहेको नजिकको भीडसँग जोड्छ।",
  "home.features.networking.wifi.name": "WiFi छिटो बाटो",
  "home.features.networking.wifi.line": "दुई Android वा दुई iPhone बीच छिटो पठाउने।",
  "home.features.networking.bitchat.name": "bitchat सँग मिल्ने",
  "home.features.networking.bitchat.line": "दुवै एप कुनै मिलानविनै उही मेसमा जोडिन्छन्।",

  "home.features.internet.title": "इन्टरनेट",
  "home.features.internet.summary": "एउटा थप सुविधा, कहिल्यै अनिवार्यता होइन।",
  "home.features.internet.nostr.name": "Nostr विकल्प",
  "home.features.internet.nostr.line":
    "सिधा सन्देश र स्थान च्यानलहरू रेडियोको पहुँचबाहिर पनि चलिरहन्छन्।",
  "home.features.internet.relays.name": "भौगोलिक रिले खोज",
  "home.features.internet.relays.line":
    "300 भन्दा बढी स्वतन्त्र सार्वजनिक रिले, तीमध्ये कुनै पनि हाम्रो होइन।",
  "home.features.internet.gateway.name": "इन्टरनेट गेटवे",
  "home.features.internet.gateway.line":
    "आफ्नो जडान सापटी दिनुहोस्, ताकि नजिकको अफलाइन फोनले स्थान च्यानलहरूमा पुग्न सकोस्।",
  "home.features.internet.tor.name": "Tor एकीकरण",
  "home.features.internet.tor.line":
    "दुवै प्लेटफर्ममा बाटो मिलाइएको, त्यसैले रिलेहरूले तपाईंको IP कहिल्यै देख्दैनन्।",

  "home.features.optional.title": "वैकल्पिक",
  "home.features.optional.summary": "पूर्वनिर्धारित रूपमा बन्द। चाहेको बेला खुला।",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "कुनै पनि फोन अनलाइन नभएकै बेला छेउमा भएको मान्छेलाई भुक्तानी गर्नुहोस्।",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Lightning सञ्जालमार्फत bitcoin मा थप्नुहोस् वा निकाल्नुहोस्।",
  "home.features.optional.ai.name": "स्थानीय एआई",
  "home.features.optional.ai.line": "उपकरणमै जवाफ, फोनबाट केही बाहिर जाँदैन।",
  "home.features.optional.social.name": "सामाजिक पुल",
  "home.features.optional.social.line": "उही परिचयसहित Bluesky र Mastodon।",

  "home.compare.eyebrow": "तुलनामा",
  "home.compare.title": "अफलाइन, थप उपकरणविनै, र खुला।",
  "home.compare.sub":
    "यहाँको हरेक एप कुनै न कुनै कुरामा राम्रो छ। तर सञ्जाल नचल्दा पनि चल्नेचाहिँ केही मात्र हुन्।",
  "home.compare.col.project": "परियोजना",
  "home.compare.col.transport": "प्रसारण",
  "home.compare.col.encryption": "गुप्तीकरण",
  "home.compare.col.offline": "अफलाइन चल्छ",
  "home.compare.col.hardware_free": "थप उपकरण नचाहिने",
  "home.compare.col.open_source": "खुला स्रोत",
  "home.compare.mark.yes": "हो",
  "home.compare.mark.no": "होइन",
  "home.compare.mark.partial": "आंशिक, क्लाइन्ट खुला स्रोत छन्, सर्भर छैनन्",
  "home.compare.mark.partial_hint": "क्लाइन्ट खुला स्रोत छन्, सर्भर छैनन्",
  "home.compare.transport.servers": "केन्द्रीकृत सर्भर",
  "home.compare.transport.onion": "प्याजी राउटिङ (सेवा नोड)",
  "home.compare.transport.nostr": "Nostr रिले",
  "home.compare.transport.lora": "LoRa रेडियो",
  "home.compare.transport.sub_ghz": "स्वामित्वको सब-GHz रेडियो",

  "home.explore.eyebrow": "खुला र इमानदार",
  "home.explore.title": "यहाँ गरिएको हरेक दाबी जाँच्न सकिन्छ।",
  "home.explore.sub":
    "कोड, प्रोटोकल र योजनाहरू सार्वजनिक छन्। सीमाहरू पनि। हाम्रो कुरा पत्याउनुअघि आफैँ जाँच्नुहोस्।",
  "home.explore.audit.chip": "लेखापरीक्षण बाँकी",
  "home.explore.audit.headline": "Airhop को अहिलेसम्म बाह्य सुरक्षा लेखापरीक्षण भएको छैन।",
  "home.explore.audit.body":
    "{headline} सबै कोड आफैँ हेरिन्छ र सार्वजनिक गर्नुअघि एउटा {review} बाट पास गराइन्छ, र यसले प्रयोग गर्ने गुप्तीकरण पुस्तकालय Cure53 द्वारा लेखापरीक्षित छ; तर त्यो एपकै औपचारिक लेखापरीक्षणको विकल्प होइन। एउटा लेखापरीक्षण {version} का लागि तय छ। त्यतिन्जेल संवेदनशील प्रयोगका लागि यसमा भर नपर्नुहोस्।",
  "home.explore.audit.link.review": "सुरक्षा समीक्षा एजेन्ट",
  "home.explore.source.title": "स्रोत कोड",
  "home.explore.source.desc": "सबै GitHub मा MIT अन्तर्गत। इस्यु, पुल रिक्वेस्ट र छलफल खुला छन्।",
  "home.explore.protocol.title": "प्रोटोकल विनिर्देश",
  "home.explore.protocol.desc": "ठ्याक्कै प्रसारण ढाँचा, BLE UUID र स्थिरांकहरू, bitchat सँग साझा।",
  "home.explore.architecture.title": "संरचना",
  "home.explore.architecture.desc":
    "पठाउनुहोस् थिच्नेदेखि रेडियोमा जाने बाइटसम्मको पूरा प्राविधिक विवरण।",
  "home.explore.roadmap.title": "मार्गचित्र",
  "home.explore.roadmap.desc":
    "v0.5.0 देखि v2.0.0 सम्मका संस्करण लक्ष्यहरू, तय भएको लेखापरीक्षणसहित।",
  "home.explore.vision.title": "दृष्टिकोण",
  "home.explore.vision.desc": "Airhop किन छ, र दबाबमा पनि नबदलिने सिद्धान्तहरू।",
  "home.explore.brand.title": "ब्रान्ड किट",
  "home.explore.brand.desc": "पिक्सेल चरा, रङ र अक्षरका टोकन, प्रेस सामग्री र तयारी लेख।",

  "home.contribute.eyebrow": "यो परियोजनालाई सहयोग गर्नुहोस्",
  "home.contribute.title": "स्वतन्त्र, र खुला रूपमा।",
  "home.contribute.sub":
    "कुनै लगानीकर्ता छैनन्, विज्ञापन छैन, सशुल्क संस्करण छैन। जे भए पनि सबै सुविधा निःशुल्कै रहन्छन्, र यो काम यसलाई उपयोगी ठान्नेहरूले नै धानेका छन्।",
  "home.contribute.contribute.chip": "योगदान",
  "home.contribute.contribute.body":
    "रिपोजिटरीलाई तारा दिनुहोस्, इस्यु खोल्नुहोस् र पुल रिक्वेस्ट पठाउनुहोस्। त्रुटि प्रतिवेदन, सुविधाका सुझाव र कोडमा योगदान सबैको स्वागत छ।",
  "home.contribute.contribute.cta": "GitHub मा हेर्नुहोस्",
  "home.contribute.sponsor.chip": "प्रायोजन",
  "home.contribute.sponsor.body":
    "Airhop तपाईंलाई उपयोगी लागेको छ भने एकपटकको सहयोग वा नियमित प्रायोजनले विकास जारी राख्न धेरै मद्दत गर्छ।",
  "home.contribute.sponsor.donate": "एकपटक सहयोग गर्नुहोस्",
  "home.contribute.sponsor.github": "GitHub मा प्रायोजन गर्नुहोस्",

  "page.architecture.eyebrow": "कागजात",
  "page.architecture.title": "संरचना",
  "page.architecture.toc": "यस पृष्ठमा",

  "page.faq.eyebrow": "बारम्बार सोधिने प्रश्न",
  "page.faq.title": "बारम्बार सोधिने प्रश्नहरू",
  "page.faq.meta": "Airhop बारे सामान्य प्रश्नहरू।",
  "page.faq.contact":
    "यहाँ जवाफ नभएका प्रश्नहरू {email} मा पठाउन सकिन्छ वा {github} मा छलफल खोलेर सोध्न सकिन्छ।",

  "page.blogs.eyebrow": "ब्लग",
  "page.blogs.title": "चाँडै आउँदै",
  "page.blogs.body": "मेस सञ्जाल, गोपनीयता र अफलाइन-पहिलो सफ्टवेयरबारे लेखहरू।",

  "page.brand.eyebrow": "ब्रान्ड",
  "page.brand.title": "ब्रान्ड किट",
  "page.brand.meta":
    "कुनै लेख, स्टोर सूची, प्रवचन वा README मा Airhop राख्नका लागि सामग्री र नियमहरू। सन्दर्भ र प्रेसका लागि स्वतन्त्र रूपमा प्रयोग गर्न सकिन्छ।",

  "page.legal.eyebrow": "कानुनी",
  "page.privacy.title": "गोपनीयता नीति",
  "page.terms.title": "सेवाका सर्तहरू",

  "page.notfound.title": "पृष्ठ फेला परेन",
  "page.notfound.body": "तपाईंले खोजेको पृष्ठ छैन वा सारिएको छ।",

  "page.english_only": "यो पृष्ठ अंग्रेजीमा मात्र उपलब्ध छ।",

  "seo.breadcrumb.home": "गृहपृष्ठ",

  "seo.home.title": "Airhop — निजी, अफलाइन-पहिलो म्यासेन्जर",
  "seo.home.description":
    "iOS र Android का लागि उपकरणबीच सिधै निजी सन्देश आदानप्रदान। इन्टरनेट छैन, सर्भर छैन, खाता छैन। जहाँसुकै Bluetooth मेसमार्फत सम्पर्क गर्नुहोस्।",

  "seo.architecture.title": "संरचना — Airhop",
  "seo.architecture.description":
    "Airhop माथिदेखि तलसम्म कसरी चल्छ: परिचय, प्रसारण छनोट, Bluetooth मेस, गुप्तीकरण, इन्टरनेट तह, Tor, अफलाइन ecash, उपकरणमै एआई, र bitchat सँग मिल्ने प्रसारण ढाँचा।",
  "seo.architecture.breadcrumb": "संरचना",
  "seo.architecture.headline": "Airhop को संरचना",
  "seo.architecture.summary":
    "Airhop को पूरा प्राविधिक विवरण: परिचय, प्रसारण माध्यम, Bluetooth मेस, गुप्तीकरण, Nostr इन्टरनेट तह, Tor, Cashu वालेट, उपकरणमै एआई सहयोगी, र प्रसारण ढाँचा।",

  "seo.faq.title": "बारम्बार सोधिने प्रश्नहरू — Airhop",
  "seo.faq.description":
    "Airhop को Bluetooth मेस सन्देश, गुप्तीकरण, अफलाइन भुक्तानी, Nostr इन्टरनेट तह र bitchat सँगको मिलानबारे जवाफहरू।",
  "seo.faq.breadcrumb": "बारम्बार सोधिने प्रश्न",

  "seo.blogs.title": "ब्लग — Airhop",
  "seo.blogs.description": "मेस सञ्जाल, गोपनीयता र अफलाइन-पहिलो सफ्टवेयरबारे लेखहरू।",
  "seo.blogs.breadcrumb": "ब्लग",

  "seo.brand.title": "ब्रान्ड किट — Airhop",
  "seo.brand.description":
    "Airhop ब्रान्ड किट: पिक्सेल चराको चिन्ह, शब्दचिन्ह, रङ र अक्षरका टोकन, प्रेस सामग्री र तयारी लेख।",
  "seo.brand.breadcrumb": "ब्रान्ड किट",

  "seo.privacy.title": "गोपनीयता नीति — Airhop",
  "seo.privacy.description":
    "Airhop ले डेटा कसरी सम्हाल्छ: खाता छैन, सर्भर छैन, ट्र्याकिङ छैन। तपाईंको परिचय र सन्देशहरू तपाईंकै उपकरणमा रहन्छन्।",
  "seo.privacy.breadcrumb": "गोपनीयता नीति",

  "seo.terms.title": "सेवाका सर्तहरू — Airhop",
  "seo.terms.description": "Airhop एप र वेबसाइटको प्रयोगलाई नियमन गर्ने सर्तहरू।",
  "seo.terms.breadcrumb": "सेवाका सर्तहरू",

  "seo.notfound.title": "पृष्ठ फेला परेन — Airhop",
  "seo.notfound.description": "तपाईंले खोजेको पृष्ठ छैन वा सारिएको छ।",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} रिले",
    other: "{count} रिले",
  },
  "home.map.locations": {
    one: "{count} स्थान",
    other: "{count} स्थानहरू",
  },
};

export const locale: Locale = { strings, plurals };
