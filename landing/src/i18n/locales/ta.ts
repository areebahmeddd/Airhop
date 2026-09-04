import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "முகப்புக்குத் திரும்பு",
  "common.last_updated": "கடைசி புதுப்பிப்பு: {date}",

  "nav.aria": "முதன்மை வழிசெலுத்தல்",
  "nav.home": "Airhop முகப்பு",
  "nav.skip": "உள்ளடக்கத்திற்குச் செல்",
  "nav.menu.open": "பட்டியலைத் திற",
  "nav.menu.close": "பட்டியலை மூடு",
  "nav.how_it_works": "இது எப்படி இயங்குகிறது",
  "nav.architecture": "கட்டமைப்பு",
  "nav.faq": "அடிக்கடி கேட்கப்படும் கேள்விகள்",

  "footer.aria": "அடிக்குறிப்பு",
  "footer.tagline": "தனிப்பட்ட மெஷ் தொடர்பு",
  "footer.credit": "© {author} {heart} உடன் உருவாக்கியது",
  "footer.group.download": "பதிவிறக்கம்",
  "footer.group.resources": "வளங்கள்",
  "footer.group.social": "சமூகம்",
  "footer.group.legal": "சட்டம்",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "கட்டமைப்பு",
  "footer.link.blogs": "வலைப்பதிவு",
  "footer.link.faq": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "சேவை விதிமுறைகள்",
  "footer.link.privacy": "தனியுரிமைக் கொள்கை",
  "footer.link.license": "திட்ட உரிமம்",

  "settings.theme.group": "நிற வடிவமைப்பு",
  "settings.theme.light": "வெளிர் வடிவமைப்பு",
  "settings.theme.dark": "இருண்ட வடிவமைப்பு",
  "settings.language.label": "மொழி",
  "settings.language.suggestion": "இந்தப் பக்கத்தைத் தமிழில் பார்க்க",
  "settings.language.dismiss": "மூடு",

  "home.hero.release": "சமீபத்திய வெளியீடு",
  "home.hero.title": "இணையம் இல்லாமலும் இயங்கும் செய்தி பரிமாற்றம்.",
  "home.hero.body":
    "அருகிலுள்ள தொலைபேசிகள் ஒரு Bluetooth மெஷ் அமைத்து, உங்கள் செய்திகளை முனை முதல் முனை வரை மறையாக்கத்துடன் கடத்துகின்றன. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "சேவையகங்கள் இல்லை",
  "home.hero.body.no_accounts": "கணக்குகள் இல்லை",
  "home.hero.body.no_tracking": "கண்காணிப்பு இல்லை",
  "home.hero.download": "செயலியைப் பதிவிறக்கு",
  "home.hero.badges": "MIT உரிமம் · இலவசம், திறந்த மூலம் · bitchat உடன் இணக்கம்",
  "home.hero.group.mobile": "கைபேசி",
  "home.hero.group.desktop": "கணினி",
  "home.hero.option.zapstore": "Nostr இல் கையொப்பமிடப்பட்டது",
  "home.hero.option.apk": "நேரடிப் பதிவிறக்கம்",
  "home.hero.option.soon": "விரைவில்",

  "home.about.eyebrow": "Airhop என்றால் என்ன",
  "home.about.title": "பெரும்பாலான செயலிகள் ஒரு மைய சேவையகத்தை நம்பியுள்ளன.",
  "home.about.sub":
    "ஒரு சேவையகத்தைக் கண்காணிக்கலாம், நிறுத்தலாம் அல்லது தடுக்கலாம். Airhop-க்கு சேவையகமே இல்லை, எனவே அழுத்தம் கொடுக்க நிறுவனமும் இல்லை, மூட சேவையும் இல்லை.",
  "home.about.card": "தொழில்நுட்பப் பார்வை",
  "home.about.link.mesh": "Bluetooth Low Energy மெஷ்",
  "home.about.link.wire_protocol": "பரிமாற்ற நெறிமுறை",
  "home.about.body.built":
    "Airhop என்பது {mesh} வழியாக சாதனங்களுக்கு இடையே நேரடியாகத் தனிப்பட்ட செய்தி பரிமாற்றத்திற்கான iOS மற்றும் Android திறந்த மூல செயலி. இது {bitchat} அடித்தளத்தின் மீது கட்டப்பட்டு, அதன் {wire_protocol} மற்றும் பாதுகாப்பு மாதிரியை மீண்டும் பயன்படுத்தி, பின்னர் இணையமில்லா {ecash} கட்டணங்கள், இணையமில்லா செயற்கை நுண்ணறிவு ஆகியவற்றுடன் விரிவுபடுத்துகிறது. இணைய இணைப்பே இல்லாமல் இது இயங்குகிறது, செய்திகள் அருகிலுள்ள சாதனங்கள் வழியாகத் தானாகக் கடத்தப்படுகின்றன (உட்புறத்தில் ஒரு தாவலுக்கு ஏறக்குறைய 10 முதல் 30 மீட்டர், வெளியில் அதிகம்), 7 தாவல்கள் வரை.",
  "home.about.body.identity":
    "உங்கள் அடையாளம் என்பது உங்கள் சாதனத்தில் உருவாக்கப்பட்டு {ios_keychain} அல்லது {android_keystore} இல் சேமிக்கப்படும் {ed25519} சாவி இணை. கணக்குகள் இல்லை, பதிவு இல்லை, எந்தச் சேவையகத்தையும் தொடுவது இல்லை; அதாவது நீக்கிய பின் உங்களைத் திரும்பக் காட்டும் எதையும் விட்டுவைக்காத தற்காலிகச் செயலியாகப் பயன்படுத்தலாம்.",
  "home.about.body.crypto":
    "ஒவ்வொரு அமர்வும் சரிபார்க்கப்பட்ட கைகுலுக்கலுக்கு {noise} நெறிமுறையைப் பயன்படுத்துகிறது. சேமிக்கப்பட்ட செய்திகள் {ratchet} வழிமுறையைப் பயன்படுத்துகின்றன; அதாவது பிற்பாடு உங்கள் சாதனம் சமரசம் செய்யப்பட்டாலும், உங்கள் பழைய செய்திகள் படிக்க இயலாதவையாகவே இருக்கும். அவசர அழிப்பு அனைத்துச் சாவிகளையும் செய்திகளையும் ஒரு நொடிக்குள் அழிக்கிறது.",
  "home.about.body.internet":
    "நீங்களும் உங்கள் தொடர்பும் Bluetooth எல்லைக்கு வெளியே இருக்கும்போது, {nostr} மறுபரப்பிகள் இணையம் வழியாகப் பாலமாகச் செயல்படுகின்றன; {nip17} வடிவில் பொதிந்த நேரடிச் செய்திகள் பயன்படுத்தப்படுகின்றன, எனவே இருவரும் இணையத்தில் இருக்கும்போது மெஷ் உலகளவில் விரிகிறது. {tor} ஆதரவு iOS மற்றும் Android இரண்டிலும் {arti} வழியாக உள்ளது; Tor-ஐத் தடுக்கும் நெட்வொர்க்குகளுக்கு {obfs4} மற்றும் {snowflake} பாலங்களும் உள்ளன.",
  "home.about.optional.title": "Airhop இல் நீங்கள் இயக்கக்கூடிய விருப்ப அம்சங்கள் உள்ளன:",
  "home.about.optional.payments.label": "இணையமில்லா கட்டணங்கள்:",
  "home.about.optional.payments.body":
    "{cashu} நெறிமுறையைப் பயன்படுத்தி மெஷ் வழியாகக் கட்டணங்களை அனுப்பவும் பெறவும் (Bitcoin மட்டும்).",
  "home.about.optional.ai.label": "இணையமில்லா செயற்கை நுண்ணறிவு:",
  "home.about.optional.ai.body":
    "முக்கியமான கேள்விகளுக்குப் பதிலளிக்கும், சாதனத்திலேயே இயங்கும் சிறிய செயற்கை நுண்ணறிவு உதவியாளர். அனைத்துச் செயலாக்கமும் தரவும் உங்கள் சாதனத்திலேயே இருக்கும்.",
  "home.about.body.compatible":
    "Airhop நெறிமுறை மட்டத்தில் bitchat உடன் இணக்கமானது. ஒரே மெஷில் உள்ள Airhop சாதனமும் bitchat சாதனமும் தானாகவே ஒன்றையொன்று கண்டறிந்து, எந்த அமைப்பும் இல்லாமல் செய்திகளையும் நேரடிச் செய்திகளையும் பரிமாறிக்கொள்ள முடியும்.",

  "home.situations.eyebrow": "எப்போது தேவைப்படும்",
  "home.situations.title": "வலையமைப்பு செயலிழக்கும் நாளுக்காக.",
  "home.situations.sub":
    "இயற்கைப் பேரிடர்கள், இணையத் தடைகள், பெரும் போராட்டங்கள், அல்லது சமிக்ஞை இல்லாத ஒரு சாதாரண வார இறுதி.",
  "home.situations.disaster.label": "பேரிடர்",
  "home.situations.disaster.line":
    "கோபுரங்கள் செயலிழந்துவிட்டன. பலகையில் உள்ள அறிவிப்பு அருகில் செல்லும் அனைவரையும் சென்றடைகிறது.",
  "home.situations.offgrid.label": "வலையமைப்புக்கு வெளியே",
  "home.situations.offgrid.line":
    "பாதையில் இரண்டாவது நாள். கடைசிச் சமிக்ஞைக் கோடு நேற்றே மறைந்துவிட்டது.",
  "home.situations.protest.label": "போராட்டம்",
  "home.situations.protest.line":
    "துண்டுப் பிரசுரத்தில் உள்ள ஒரு QR குறியீடு பேரணிக்கான மறையாக்கப்பட்ட தடத்தைத் திறக்கிறது.",
  "home.situations.festival.label": "திருவிழா",
  "home.situations.festival.line":
    "இடத்தில் சமிக்ஞை இல்லை. செய்திகள் அறிமுகமில்லாதவர்களின் தொலைபேசிகள் வழியாகத் தாவுகின்றன.",

  "home.showcase.eyebrow": "செயலியைப் பாருங்கள்",
  "home.showcase.title": "ஒரு சாதாரணச் செய்தியாளர், இணையம் இல்லாமல்.",
  "home.showcase.sub":
    "உரையாடல்கள், தடங்கள், ஒரு பணப்பை, ஓர் அடையாளம். மேற்பரப்பில் பழக்கமானது, அடியில் மெஷ் வேலை செய்கிறது.",
  "home.showcase.mesh.title": "மெஷ்",
  "home.showcase.mesh.caption":
    "எல்லைக்குள் உள்ள அனைவரும், எவ்வளவு அருகில் உள்ளனர் என்பதன்படி அமைக்கப்பட்டுள்ளனர். யாரையும் முதலில் சேர்க்க வேண்டியதில்லை.",
  "home.showcase.mesh.alt":
    "Airhop செயலியின் மெஷ் திரை, சமிக்ஞை வலிமையின்படி ரேடாரில் அமைக்கப்பட்ட அருகிலுள்ள நான்கு சாதனங்களைக் காட்டுகிறது.",
  "home.showcase.chats.title": "உரையாடல்கள்",
  "home.showcase.chats.caption":
    "சாதாரண உரையாடல்கள். ஒவ்வொரு செய்தியையும் கடத்தும் தொலைபேசிகளால் அதைத் திறக்க முடியாது.",
  "home.showcase.chats.alt":
    "மின்வெட்டின்போது Airhop இல் நடந்த ஒரு நேரடிச் செய்தி உரையாடல், மூன்று தொலைபேசிகள் வழியாகக் கடத்தப்பட்டது.",
  "home.showcase.channels.title": "தடங்கள்",
  "home.showcase.channels.caption":
    "ஒரு தெரு அளவு சிறியதாகவோ ஒரு பகுதி அளவு பெரியதாகவோ உள்ள பொது அறைகள், அங்கு இருக்கும் அனைவருக்கும் திறந்தவை.",
  "home.showcase.channels.alt":
    "Airhop செயலியின் உரையாடல் திரை, தெரு, சுற்றுப்புறம், நகரம், பகுதி அளவில் வரையறுக்கப்பட்ட பொதுத் தடங்களைப் பட்டியலிடுகிறது.",
  "home.showcase.wallet.title": "பணப்பை",
  "home.showcase.wallet.caption":
    "இரு தொலைபேசிகளும் இணையத்தில் இல்லாதபோதே, Bluetooth வழியாகப் பக்கத்தில் இருப்பவருக்கு ecash கொடுங்கள்.",
  "home.showcase.wallet.alt":
    "Airhop செயலியின் பணப்பைத் திரை, Bluetooth வழியாக அனுப்பக்கூடிய ecash இருப்பைக் காட்டுகிறது.",
  "home.showcase.identity.title": "அடையாளம்",
  "home.showcase.identity.caption":
    "பதிவு இல்லை, தொலைபேசி எண் இல்லை, மின்னஞ்சல் இல்லை. இந்தத் தொலைபேசியை விட்டு வெளியேறாத ஒரு சாவி மட்டுமே.",
  "home.showcase.identity.alt":
    "Airhop செயலியின் சுயவிவரத் திரை, கணக்கு இல்லாமல் சாதனத்தில் உருவாக்கப்பட்ட அடையாளத்தைக் காட்டுகிறது.",

  "home.how.eyebrow": "இது எப்படி இயங்குகிறது",
  "home.how.title": "மெஷ் தானாகவே உருவாகிறது.",
  "home.how.sub":
    "அருகிலுள்ள முனைகள் Bluetooth வழியாகத் தன்னைத் தானே சரிசெய்யும் மெஷை உருவாக்குகின்றன. இணையம் இருக்கும்போது Nostr மறுபரப்பிகள் அதை விரிவாக்குகின்றன, யாரும் கட்டுப்படுத்தும் உள்கட்டமைப்பு இல்லாமல்.",
  "home.how.cta": "முழுக் கட்டமைப்பைப் படிக்க",
  "home.how.discover.title": "கண்டறிதல்",
  "home.how.discover.line":
    "Airhop அல்லது bitchat இயங்கும் தொலைபேசிகள் Bluetooth வழியாகத் தானாகவே ஒன்றையொன்று கண்டறிகின்றன. இணைத்தல் இல்லை, அமைவு இல்லை.",
  "home.how.relay.title": "கடத்தல்",
  "home.how.relay.line":
    "ஒரு செய்தி தொலைபேசியிலிருந்து தொலைபேசிக்கு, ஏழு தாவல்கள் வரை தாவுகிறது. இடையிலுள்ள தொலைபேசிகள் தாங்கள் சுமப்பதை ஒருபோதும் பார்ப்பதில்லை.",
  "home.how.reach.title": "இன்னும் தொலைவுக்கு",
  "home.how.reach.line":
    "இணையம் இருக்கும்போது, Nostr மறுபரப்பிகள் அதே உரையாடலை இன்னும் தொலைவுக்குக் கொண்டு செல்கின்றன, விரும்பினால் Tor வழியாக.",
  "home.how.swipe": "ஆராய இழுக்கவும்",
  "home.how.diagram": "BLE மெஷ் · உள்ளூர் சாதனங்களுக்கு இடையிலான வலையமைப்பு",
  "home.how.legend.node": "BLE மெஷ் முனை (இணையம் இல்லை)",
  "home.how.legend.relay": "பல தாவல் கடத்தல் (Noise XX மறையாக்கம்)",
  "home.how.legend.bitchat": "அதே மெஷில் bitchat உடன் இணக்கம்",
  "home.how.legend.nostr": "Nostr பாலம் (இணையம், இணைந்திருக்கும்போது)",

  "home.map.aria": "Nostr மறுபரப்பிகளின் இடங்களைக் காட்டும் உலக வரைபடம்",
  "home.map.summary": "Nostr பாலம் · உலகெங்கும் {locations} இல் {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "இது என்ன செய்கிறது",
  "home.features.title": "ஒரு உண்மையான செய்தியாளர், மாதிரிக் காட்சி அல்ல.",
  "home.features.sub":
    "உரையாடல், அடையாளம், வலையமைப்பு, பணம். அனைத்தும் சமிக்ஞை இல்லாமல், கணக்கு இல்லாமல், இடையில் எதுவும் இல்லாமல் இயங்கும்படி கட்டப்பட்டவை.",

  "home.features.messaging.title": "செய்தி பரிமாற்றம்",
  "home.features.messaging.summary":
    "ஒரு செய்தியாளரில் உள்ள அனைத்தும், பின்னால் எந்த உள்கட்டமைப்பும் இல்லாமல்.",
  "home.features.messaging.dms.name": "தனிப்பட்ட நேரடிச் செய்திகள்",
  "home.features.messaging.dms.line":
    "முனை முதல் முனை வரை மறையாக்கம், சேர்ந்தது மற்றும் படித்தது என்ற அறிவிப்புகளுடன்.",
  "home.features.messaging.location.name": "இட அடிப்படையிலான தடங்கள்",
  "home.features.messaging.location.line":
    "ஓர் இடத்துடன் பிணைந்த அறைகள், ஒரு தெருவிலிருந்து ஒரு பகுதி வரை.",
  "home.features.messaging.groups.name": "தனிப்பட்ட தடங்களும் குழுக்களும்",
  "home.features.messaging.groups.line":
    "ஓர் அறைக்கான அழைப்பு இணைப்புகள், அல்லது 16 பேர் வரையிலான கையொப்பமிட்ட பட்டியல்.",
  "home.features.messaging.board.name": "அறிவிப்புப் பலகை",
  "home.features.messaging.board.line":
    "ஒரு பகுதியில் ஏழு நாட்கள் வரை ஒட்டப்பட்டிருக்கும் அறிவிப்புகள்.",
  "home.features.messaging.voice.name": "நேரடிக் குரல்",
  "home.features.messaging.voice.line":
    "ஒலிவாங்கியை அழுத்திப் பிடித்து எல்லைக்குள் உள்ள எவருடனும் பேசுங்கள், வாக்கி-டாக்கி போல.",
  "home.features.messaging.notes.name": "குரல் குறிப்புகள்",
  "home.features.messaging.notes.line":
    "பதிவு செய்யப்பட்ட ஒலி, வழியைத் தட்டச்சு செய்வதைவிட வேகமானது.",
  "home.features.messaging.files.name": "படங்கள், காணொலி, கோப்புகள்",
  "home.features.messaging.files.line": "எந்த வடிவமும், 1 MiB வரை, சமிக்ஞை தேவையில்லை.",
  "home.features.messaging.forward.name": "சேமித்துக் கடத்துதல்",
  "home.features.messaging.forward.line":
    "முத்திரையிடப்பட்டு, சேர வேண்டியவரிடம் சேரும் வரை அருகிலுள்ள தொலைபேசி சுமந்து செல்கிறது.",

  "home.features.identity.title": "அடையாளம்",
  "home.features.identity.summary": "பதிவு செய்ய எதுவும் இல்லை, பறிமுதல் செய்ய எதுவும் இல்லை.",
  "home.features.identity.keys.name": "சாவி இணை அடையாளம்",
  "home.features.identity.keys.line":
    "இந்தத் தொலைபேசியில் உருவாக்கப்பட்டு, இயக்க முறைமையின் சாவிக் கொத்தில் சேமிக்கப்படுகிறது.",
  "home.features.identity.names.name": "படிக்கக்கூடிய பெயர்கள்",
  "home.features.identity.names.line":
    "உங்கள் சாவியிலிருந்து பெறப்படுகிறது, எனவே உங்களுடையதை யாரும் எடுக்க முடியாது.",
  "home.features.identity.qr.name": "QR தொடர்புகள்",
  "home.features.identity.qr.line":
    "ஒரு வருடல் அவர்களின் பெயரை மட்டுமல்ல, சாவிகளையும் கொண்டு வருகிறது.",
  "home.features.identity.panic.name": "அவசர அழிப்பு",
  "home.features.identity.panic.line":
    "ஒவ்வொரு சாவியும் ஒவ்வொரு செய்தியும் ஒரு நொடிக்குள் அழிக்கப்படுகிறது.",

  "home.features.networking.title": "வலையமைப்பு",
  "home.features.networking.summary": "தொலைபேசிகளே வலையமைப்பு.",
  "home.features.networking.mesh.name": "Bluetooth மெஷ்",
  "home.features.networking.mesh.line":
    "இணையம் இல்லை, திசைவி இல்லை, மக்களிடம் ஏற்கெனவே உள்ள தொலைபேசிகளில்.",
  "home.features.networking.bridge.name": "மெஷ் பாலம்",
  "home.features.networking.bridge.line":
    "உங்கள் பொது உரையாடலை எல்லைக்கு வெளியே உள்ள அருகிலுள்ள கூட்டத்துடன் இணைக்கிறது.",
  "home.features.networking.wifi.name": "WiFi விரைவுப் பாதை",
  "home.features.networking.wifi.line":
    "இரண்டு Android அல்லது இரண்டு iPhone இடையே வேகமான பரிமாற்றம்.",
  "home.features.networking.bitchat.name": "bitchat உடன் இணக்கம்",
  "home.features.networking.bitchat.line": "இரு செயலிகளும் அமைவு இல்லாமல் ஒரே மெஷில் இணைகின்றன.",

  "home.features.internet.title": "இணையம்",
  "home.features.internet.summary": "ஒரு விரிவாக்கம், ஒருபோதும் தேவை அல்ல.",
  "home.features.internet.nostr.name": "Nostr மாற்று வழி",
  "home.features.internet.nostr.line":
    "நேரடிச் செய்திகளும் இடத் தடங்களும் வானொலி எல்லைக்கு அப்பாலும் தொடர்ந்து இயங்குகின்றன.",
  "home.features.internet.relays.name": "புவிசார் மறுபரப்பி கண்டறிதல்",
  "home.features.internet.relays.line":
    "300-க்கும் மேற்பட்ட சுயேச்சையான பொது மறுபரப்பிகள், அவற்றில் எதுவும் எங்களுடையது அல்ல.",
  "home.features.internet.gateway.name": "இணைய நுழைவாயில்",
  "home.features.internet.gateway.line":
    "அருகில் இணையம் இல்லாத தொலைபேசி இடத் தடங்களை அடைய உங்கள் இணைப்பைக் கடன் கொடுங்கள்.",
  "home.features.internet.tor.name": "Tor ஒருங்கிணைப்பு",
  "home.features.internet.tor.line":
    "இரு தளங்களிலும் திசைதிருப்பப்படுகிறது, எனவே மறுபரப்பிகள் உங்கள் IP-ஐ ஒருபோதும் பார்ப்பதில்லை.",

  "home.features.optional.title": "விருப்பத்தேர்வு",
  "home.features.optional.summary": "இயல்பாக அணைந்திருக்கும். வேண்டும்போது இயக்கலாம்.",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "எந்தத் தொலைபேசியும் இணையத்தில் இல்லாதபோதே பக்கத்தில் இருப்பவருக்குப் பணம் கொடுங்கள்.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Lightning வலையமைப்பு வழியாக bitcoin இல் நிரப்பவும் அல்லது எடுக்கவும்.",
  "home.features.optional.ai.name": "உள்ளூர் செயற்கை நுண்ணறிவு",
  "home.features.optional.ai.line": "சாதனத்திலேயே பதில்கள், தொலைபேசியை விட்டு எதுவும் வெளியேறாது.",
  "home.features.optional.social.name": "சமூகப் பாலங்கள்",
  "home.features.optional.social.line": "அதே அடையாளத்துடன் Bluesky மற்றும் Mastodon.",

  "home.compare.eyebrow": "ஒப்பீட்டில்",
  "home.compare.title": "இணையம் இல்லாமல், கூடுதல் கருவி இல்லாமல், திறந்ததாக.",
  "home.compare.sub":
    "இங்குள்ள ஒவ்வொரு செயலியும் ஏதோ ஒன்றில் சிறந்தது. ஆனால் வலையமைப்பு இயங்காதபோதும் இயங்குபவை சில மட்டுமே.",
  "home.compare.col.project": "திட்டம்",
  "home.compare.col.transport": "கடத்தல் வழி",
  "home.compare.col.encryption": "மறையாக்கம்",
  "home.compare.col.offline": "இணையம் இல்லாமல் இயங்கும்",
  "home.compare.col.hardware_free": "கூடுதல் கருவி இல்லை",
  "home.compare.col.open_source": "திறந்த மூலம்",
  "home.compare.mark.yes": "ஆம்",
  "home.compare.mark.no": "இல்லை",
  "home.compare.mark.partial": "பகுதியளவு, கிளையன்கள் திறந்த மூலம், சேவையகங்கள் அல்ல",
  "home.compare.mark.partial_hint": "கிளையன்கள் திறந்த மூலம், சேவையகங்கள் அல்ல",
  "home.compare.transport.servers": "மையப்படுத்தப்பட்ட சேவையகங்கள்",
  "home.compare.transport.onion": "வெங்காயத் திசைவழி (சேவை முனைகள்)",
  "home.compare.transport.nostr": "Nostr மறுபரப்பிகள்",
  "home.compare.transport.lora": "LoRa வானொலி",
  "home.compare.transport.sub_ghz": "தனியுரிம சப்-GHz வானொலி",

  "home.explore.eyebrow": "திறந்ததாகவும் நேர்மையாகவும்",
  "home.explore.title": "இங்குள்ள ஒவ்வொரு கூற்றையும் சரிபார்க்க முடியும்.",
  "home.explore.sub":
    "நிரல், நெறிமுறை, திட்டங்கள் அனைத்தும் பொதுவானவை. வரம்புகளும் அப்படியே. எங்கள் சொல்லை நம்புவதற்கு முன் நீங்களே சரிபாருங்கள்.",
  "home.explore.audit.chip": "தணிக்கை நிலுவையில்",
  "home.explore.audit.headline":
    "Airhop இதுவரை வெளிப்புறப் பாதுகாப்புத் தணிக்கைக்கு உட்படுத்தப்படவில்லை.",
  "home.explore.audit.body":
    "{headline} அனைத்து நிரலும் நேரடியாகச் சரிபார்க்கப்பட்டு, வெளியிடுவதற்கு முன் ஒரு {review} வழியாகச் செலுத்தப்படுகிறது; அது பயன்படுத்தும் மறையாக்க நூலகம் Cure53 ஆல் தணிக்கை செய்யப்பட்டது. ஆனால் அது செயலியின் முறையான தணிக்கைக்கு மாற்றாகாது. ஒரு தணிக்கை {version} இல் திட்டமிடப்பட்டுள்ளது. அதுவரை உணர்திறன் மிக்க பயன்பாடுகளுக்கு இதை நம்பாதீர்கள்.",
  "home.explore.audit.link.review": "பாதுகாப்பு மறுஆய்வு முகவர்",
  "home.explore.source.title": "மூல நிரல்",
  "home.explore.source.desc":
    "அனைத்தும் GitHub இல் MIT உரிமத்தின் கீழ். சிக்கல்கள், pull request-கள், விவாதங்கள் திறந்திருக்கின்றன.",
  "home.explore.protocol.title": "நெறிமுறை விவரக்குறிப்பு",
  "home.explore.protocol.desc":
    "சரியான பரிமாற்ற வடிவம், BLE UUID-கள், மாறிலிகள், bitchat உடன் பகிரப்படுகின்றன.",
  "home.explore.architecture.title": "கட்டமைப்பு",
  "home.explore.architecture.desc":
    "அனுப்பு என்பதைத் தட்டுவதிலிருந்து வானொலியில் செல்லும் பைட்டுகள் வரை முழுத் தொழில்நுட்ப விளக்கம்.",
  "home.explore.roadmap.title": "பயணத் திட்டம்",
  "home.explore.roadmap.desc":
    "v0.5.0 முதல் v2.0.0 வரையிலான பதிப்பு இலக்குகள், திட்டமிடப்பட்ட தணிக்கை உட்பட.",
  "home.explore.vision.title": "நோக்கம்",
  "home.explore.vision.desc": "Airhop ஏன் இருக்கிறது, அழுத்தத்தின் கீழும் மாறாத கொள்கைகள்.",
  "home.explore.brand.title": "அடையாளத் தொகுப்பு",
  "home.explore.brand.desc":
    "பிக்சல் பறவை, நிற மற்றும் எழுத்துரு அடையாளங்கள், ஊடகப் பொருட்கள், தயார் வாசகங்கள்.",

  "home.contribute.eyebrow": "இந்தத் திட்டத்தை ஆதரிக்கவும்",
  "home.contribute.title": "சுயேச்சையாக, வெளிப்படையாக.",
  "home.contribute.sub":
    "முதலீட்டாளர்கள் இல்லை, விளம்பரங்கள் இல்லை, கட்டணப் பதிப்பு இல்லை. எப்படியிருந்தாலும் அனைத்து அம்சங்களும் இலவசமாகவே இருக்கும், இந்த வேலைக்கு நிதி அளிப்பது இதைப் பயனுள்ளதாகக் கருதுபவர்கள்.",
  "home.contribute.contribute.chip": "பங்களிக்க",
  "home.contribute.contribute.body":
    "களஞ்சியத்திற்கு நட்சத்திரம் இடுங்கள், சிக்கல்களைத் திறங்கள், pull request அனுப்புங்கள். பிழை அறிக்கைகள், அம்ச முன்மொழிவுகள், நிரல் பங்களிப்புகள் அனைத்தும் வரவேற்கப்படுகின்றன.",
  "home.contribute.contribute.cta": "GitHub இல் பார்க்க",
  "home.contribute.sponsor.chip": "நிதியுதவி",
  "home.contribute.sponsor.body":
    "Airhop உங்களுக்குப் பயனுள்ளதாக இருந்தால், ஒருமுறை நன்கொடை அல்லது தொடர் நிதியுதவி வளர்ச்சியைத் தொடர்வதற்கு மிகவும் உதவும்.",
  "home.contribute.sponsor.donate": "ஒருமுறை நன்கொடை",
  "home.contribute.sponsor.github": "GitHub இல் நிதியுதவி",

  "page.architecture.eyebrow": "ஆவணம்",
  "page.architecture.title": "கட்டமைப்பு",
  "page.architecture.toc": "இந்தப் பக்கத்தில்",

  "page.faq.eyebrow": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  "page.faq.title": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  "page.faq.meta": "Airhop பற்றிய பொதுவான கேள்விகள்.",
  "page.faq.contact":
    "இங்கு பதில் இல்லாத கேள்விகளை {email} க்கு அனுப்பலாம் அல்லது {github} இல் ஒரு விவாதத்தைத் திறந்து கேட்கலாம்.",

  "page.blogs.eyebrow": "வலைப்பதிவு",
  "page.blogs.title": "விரைவில்",
  "page.blogs.body":
    "மெஷ் வலையமைப்பு, தனியுரிமை, இணையமில்லா முன்னுரிமை மென்பொருள் குறித்த எழுத்துகள்.",

  "page.brand.eyebrow": "அடையாளம்",
  "page.brand.title": "அடையாளத் தொகுப்பு",
  "page.brand.meta":
    "ஒரு கட்டுரையிலோ, கடைப் பட்டியலிலோ, உரையிலோ, README இலோ Airhop-ஐப் பயன்படுத்துவதற்கான பொருட்களும் விதிகளும். மேற்கோளுக்கும் ஊடகங்களுக்கும் தடையின்றிப் பயன்படுத்தலாம்.",

  "page.legal.eyebrow": "சட்டம்",
  "page.privacy.title": "தனியுரிமைக் கொள்கை",
  "page.terms.title": "சேவை விதிமுறைகள்",

  "page.notfound.title": "பக்கம் கிடைக்கவில்லை",
  "page.notfound.body": "நீங்கள் தேடும் பக்கம் இல்லை அல்லது நகர்த்தப்பட்டுவிட்டது.",

  "page.english_only": "இந்தப் பக்கம் ஆங்கிலத்தில் மட்டுமே கிடைக்கிறது.",

  "seo.breadcrumb.home": "முகப்பு",

  "seo.home.title": "Airhop — தனிப்பட்ட, இணையமில்லா முன்னுரிமை செய்தியாளர்",
  "seo.home.description":
    "iOS மற்றும் Android க்கான தனிப்பட்ட, சாதனங்களுக்கு இடையிலான செய்தி பரிமாற்றம். இணையம் இல்லை, சேவையகங்கள் இல்லை, கணக்குகள் இல்லை. எங்கிருந்தும் Bluetooth மெஷ் வழியாகத் தொடர்பு கொள்ளுங்கள்.",

  "seo.architecture.title": "கட்டமைப்பு — Airhop",
  "seo.architecture.description":
    "Airhop மேலிருந்து கீழ் வரை எப்படி இயங்குகிறது: அடையாளம், கடத்தல் வழித் தேர்வு, Bluetooth மெஷ், மறையாக்கம், இணையத் தளம், Tor, இணையமில்லா ecash, சாதனத்தில் செயற்கை நுண்ணறிவு, bitchat உடன் இணக்கமான பரிமாற்ற வடிவம்.",
  "seo.architecture.breadcrumb": "கட்டமைப்பு",
  "seo.architecture.headline": "Airhop கட்டமைப்பு",
  "seo.architecture.summary":
    "Airhop-இன் முழுத் தொழில்நுட்ப விளக்கம்: அடையாளம், கடத்தல் வழிகள், Bluetooth மெஷ், மறையாக்கம், Nostr இணையத் தளம், Tor, Cashu பணப்பை, சாதனத்தில் செயற்கை நுண்ணறிவு உதவியாளர், பரிமாற்ற வடிவம்.",

  "seo.faq.title": "அடிக்கடி கேட்கப்படும் கேள்விகள் — Airhop",
  "seo.faq.description":
    "Airhop-இன் Bluetooth மெஷ் செய்தி பரிமாற்றம், மறையாக்கம், இணையமில்லா கட்டணங்கள், Nostr இணையத் தளம், bitchat இணக்கம் குறித்த பதில்கள்.",
  "seo.faq.breadcrumb": "அடிக்கடி கேட்கப்படும் கேள்விகள்",

  "seo.blogs.title": "வலைப்பதிவு — Airhop",
  "seo.blogs.description":
    "மெஷ் வலையமைப்பு, தனியுரிமை, இணையமில்லா முன்னுரிமை மென்பொருள் குறித்த எழுத்துகள்.",
  "seo.blogs.breadcrumb": "வலைப்பதிவு",

  "seo.brand.title": "அடையாளத் தொகுப்பு — Airhop",
  "seo.brand.description":
    "Airhop அடையாளத் தொகுப்பு: பிக்சல் பறவைச் சின்னம், சொல் அடையாளம், நிற மற்றும் எழுத்துரு அடையாளங்கள், ஊடகப் பொருட்கள், தயார் வாசகங்கள்.",
  "seo.brand.breadcrumb": "அடையாளத் தொகுப்பு",

  "seo.privacy.title": "தனியுரிமைக் கொள்கை — Airhop",
  "seo.privacy.description":
    "Airhop தரவை எப்படிக் கையாள்கிறது: கணக்குகள் இல்லை, சேவையகங்கள் இல்லை, கண்காணிப்பு இல்லை. உங்கள் அடையாளமும் செய்திகளும் உங்கள் சாதனத்திலேயே இருக்கும்.",
  "seo.privacy.breadcrumb": "தனியுரிமைக் கொள்கை",

  "seo.terms.title": "சேவை விதிமுறைகள் — Airhop",
  "seo.terms.description": "Airhop செயலி மற்றும் இணையதளப் பயன்பாட்டை நிர்வகிக்கும் விதிமுறைகள்.",
  "seo.terms.breadcrumb": "சேவை விதிமுறைகள்",

  "seo.notfound.title": "பக்கம் கிடைக்கவில்லை — Airhop",
  "seo.notfound.description": "நீங்கள் தேடும் பக்கம் இல்லை அல்லது நகர்த்தப்பட்டுவிட்டது.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} மறுபரப்பி",
    other: "{count} மறுபரப்பிகள்",
  },
  "home.map.locations": {
    one: "{count} இடம்",
    other: "{count} இடங்கள்",
  },
};

export const locale: Locale = { strings, plurals };
