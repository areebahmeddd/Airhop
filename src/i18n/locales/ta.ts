// ta: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "ரத்துசெய்",
  "common.done": "முடிந்தது",
  "common.ok": "சரி",
  "common.close": "மூடு",
  "common.back": "பின்",
  "common.delete": "நீக்கு",
  "common.remove": "அகற்று",
  "common.add": "சேர்",
  "common.copy": "நகலெடு",
  "common.copied": "நகலெடுக்கப்பட்டது",
  "common.share": "பகிர்",
  "common.continue": "தொடர்",
  "common.try_again": "மீண்டும் முயலுங்கள்",
  "common.settings": "அமைப்புகள்",
  "common.on": "இயக்கத்தில்",
  "common.off": "முடக்கம்",

  // ---- Dates ----
  "format.today": "இன்று",
  "format.yesterday": "நேற்று",
  "format.minutes_ago": "{count} நிமிடம் முன்பு",
  "format.hours_ago": "{count} மணி முன்பு",
  "format.days_ago": "{count} நாள் முன்பு",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "அரட்டைகள்",
  "nav.tab.mesh": "மெஷ்",
  "nav.tab.wallet": "பணப்பை",
  "nav.tab.profile": "நீங்கள்",
  "a11y.tab.new_peers": "{label}, அருகில் புதிதாக ஒருவர் இருக்கிறார்",
  "nav.notifications": "அறிவிப்புகள்",
  "chat.subtab.channels": "சேனல்கள்",
  "chat.subtab.direct": "நேரடி",
  "chat.subtab.dms": "நேரடிச் செய்திகள்",
  "chat.search.placeholder": "அரட்டைகளில் தேடு…",
  "chat.search.a11y": "அரட்டைகளிலும் செய்திகளிலும் தேடு",
  "chat.search.close": "தேடலை மூடு",
  "chat.search.clear": "தேடலை அழி",
  "mesh.view.radar": "ரேடார் காட்சி",
  "mesh.view.list": "பட்டியல் காட்சி",
  "mesh.view.radar_short": "ரேடார்",
  "mesh.view.list_short": "பட்டியல்",

  // ---- Legal document names ----
  "legal.last_updated": "கடைசியாகப் புதுப்பிக்கப்பட்டது: {date}",
  "legal.terms": "சேவை விதிமுறைகள்",
  "legal.privacy": "தனியுரிமைக் கொள்கை",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "தனிப்பட்ட மெஷ் தொடர்பு",
  "onboarding.welcome.cta": "தொடங்குங்கள்",
  "onboarding.welcome.cta_hint": "தொடர கீழுள்ள விதிமுறைகளை ஏற்றுக்கொள்ளுங்கள்",
  "onboarding.welcome.consent_a11y":
    "சேவை விதிமுறைகளையும் தனியுரிமைக் கொள்கையையும் ஏற்றுக்கொள்ளுங்கள்",
  "onboarding.welcome.open_terms": "சேவை விதிமுறைகளைத் திற",
  "onboarding.welcome.open_privacy": "தனியுரிமைக் கொள்கையைத் திற",
  "onboarding.welcome.consent":
    "{cta} அழுத்துவதன் மூலம் எங்கள் {terms} மற்றும் {privacy} ஆகியவற்றை ஏற்றுக்கொள்கிறீர்கள்.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "உங்கள் அடையாளம் உருவாக்கப்படுகிறது",
  "onboarding.identity.body":
    "இந்தச் சாதனத்தில் Ed25519 சாவி இணை உருவாக்கப்படுகிறது.\nஎதுவும் எங்கும் அனுப்பப்படுவதில்லை.",
  "onboarding.identity.failed_heading": "உங்கள் சாவிகளை உருவாக்க முடியவில்லை",
  "onboarding.identity.failed_body":
    "அவற்றைப் பாதுகாப்பாக வைத்திருக்க இந்தச் சாதனம் Airhop ஐ அனுமதிக்கவில்லை. மீண்டும் முயலுங்கள், அல்லது தொலைபேசியை மறுதொடக்கம் செய்து Airhop ஐ மீண்டும் திறங்கள்.",
  "onboarding.identity.steps_a11y": "படிகள்: {steps}",
  "onboarding.identity.step.x25519":
    "நிலையான X25519 சாவி இணை உருவாக்கப்படுகிறது",
  "onboarding.identity.step.ed25519":
    "Ed25519 கையொப்பச் சாவி இணை உருவாக்கப்படுகிறது",
  "onboarding.identity.step.keychain":
    "சாவிகள் அமைப்பின் சாவிக்கொத்தில் சேமிக்கப்படுகின்றன",
  "onboarding.identity.step.peer_id": "பியர் அடையாளம் பெறப்படுகிறது",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "மெஷில் உங்கள் பெயர்",
  "onboarding.username.peer_id": "பியர் அடையாளம்",
  "onboarding.username.card_a11y":
    "மெஷில் உங்கள் பெயர் {username}. பியர் அடையாளம் {peerID}. {props}.",
  "onboarding.username.explanation":
    "இந்தப் பயனர் பெயர் உங்கள் பொதுச் சாவியிலிருந்து உறுதியாகப் பெறப்படுகிறது. உங்கள் பியர் அடையாளத்தைக் காணும் ஒவ்வொரு சாதனத்திலும் இது ஒன்றாகவே இருக்கும்.",
  "onboarding.username.cta": "Airhop இல் நுழையுங்கள்",
  "onboarding.username.prop.algorithm": "நெறிமுறை",
  "onboarding.username.prop.storage": "சேமிப்பு",
  "onboarding.username.prop.storage_value": "அமைப்பின் சாவிக்கொத்து மட்டும்",
  "onboarding.username.prop.account": "கணக்கு தேவை",
  "onboarding.username.prop.account_value": "இல்லை",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop க்கு வருக",
  "onboarding.hello.p1":
    "வணக்கம். Airhop ஆனது bitchat மீது கட்டப்பட்ட, தனித்து இயங்கும் திறந்த மூல ஓய்வுநேரத் திட்டம். இது bitchat திட்டத்துடனோ permissionless tech உடனோ தொடர்புடையதோ அவற்றால் ஆதரிக்கப்படுவதோ அல்ல, கட்டுவதிலும் சமூகத்துடன் பகிர்வதிலும் எனக்கு மகிழ்ச்சி தரும் ஒன்று, அவ்வளவே.",
  "onboarding.hello.p2":
    "இது iOS மற்றும் Android க்கான முதல் வெளியீடு, எனவே நண்பர்களுடன் சோதித்திருந்தாலும் சில பிழைகளை நீங்கள் சந்திக்க நேரலாம். அப்படி நேர்ந்தால், அல்லது ஏதேனும் அம்சம் குறித்த யோசனை இருந்தால், கேட்க விரும்புகிறேன். {github} இல் ஒரு சிக்கலைத் திறங்கள் அல்லது {email} க்கு மின்னஞ்சல் அனுப்புங்கள்.",
  "onboarding.hello.p3":
    "Airhop உங்களுக்குப் பயன்பட்டால் {github} இல் ஒரு நட்சத்திரமோ {store} இல் ஒரு மதிப்புரையோ இடுவதைப் பரிசீலியுங்கள். இது இன்னும் பலர் இந்தத் திட்டத்தைக் கண்டறிய உதவும். முயற்சித்ததற்கு நன்றி!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "உங்கள் தொலைபேசி கேட்பதற்கு முன்",
  "onboarding.primer.lede":
    "ஒவ்வொன்றும் என்ன செய்கிறது, என்ன செய்யவில்லை என்பது இதோ.",
  "onboarding.primer.bluetooth.title": "புளூடூத்",
  "onboarding.primer.bluetooth.body":
    "அருகிலுள்ள சாதனங்களைக் கண்டறிந்து அவற்றுக்கு இடையே செய்திகளைக் கடத்துகிறது. மெஷ் இப்படித்தான் உருவாகிறது, இணையம் இல்லாமலும் இது இயங்கும்.",
  "onboarding.primer.location.title": "இடம்",
  "onboarding.primer.location.body":
    "ஒரு தெருவிலிருந்து ஒரு பகுதி வரை, அருகிலுள்ள பகுதிச் சேனல்களில் உங்களை வைக்கிறது. Airhop உங்களை ஒருபோதும் கண்காணிப்பதில்லை, உங்கள் சரியான இடத்தைச் சாதனத்திற்கு வெளியே அனுப்புவதுமில்லை.",
  "onboarding.primer.notifications.title": "அறிவிப்புகள்",
  "onboarding.primer.notifications.body":
    "செயலி மூடியிருந்தாலும் புதிய செய்திகளுக்கான அறிவிப்புகளைப் பெறுங்கள். அறிவிப்புகள் உங்கள் சாதனத்திலேயே உருவாக்கப்படுகின்றன, எந்தச் சேவையகமும் சம்பந்தப்படுவதில்லை.",
  "onboarding.primer.footnote":
    "நீங்கள் மறுக்கலாம். செய்திகள் இணையம் வழியாகப் பயணிப்பது தொடரும், பின்னர் அமைப்புகளில் மனம் மாற்றிக்கொள்ளலாம்.",
  "onboarding.primer.cta_a11y": "அனுமதிக் கோரிக்கைகளுக்குச் செல்லுங்கள்",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "புளூடூத் அணுகல்",
  "permission.bluetooth.purpose": "மெஷ் வழியாக அருகிலுள்ள சாதனங்களைக் கண்டறிய",
  "permission.open_settings": "அமைப்புகளைத் திற",
  "permission.not_now": "இப்போது வேண்டாம்",
  "permission.blocked_title": "{label} முடக்கப்பட்டுள்ளது",
  "permission.blocked_body": "{purpose} அமைப்புகளில் இதை இயக்குங்கள்.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "ஏதோ தவறாகிவிட்டது",
  "error.boundary.body":
    "Airhop எதிர்பாராத சிக்கலைச் சந்தித்து, காட்டிக்கொண்டிருந்ததை நிறுத்த வேண்டியிருந்தது.",

  // ---- Chats: channel list ----
  "chat.channels.default": "இயல்பு சேனல்கள்",
  "chat.channels.yours": "உங்கள் சேனல்கள்",
  "chat.channels.none": "இன்னும் சேனல்கள் இல்லை",
  "chat.channels.none_hint":
    "சேரவோ புதிதாக உருவாக்கவோ மேலே உள்ள {plus} ஐத் தட்டுங்கள்.",
  "chat.channels.none_desc":
    "இன்னும் சேனல்கள் இல்லை. சேரவோ புதிதாக உருவாக்கவோ தலைப்பில் உள்ள சேர் பொத்தானைப் பயன்படுத்துங்கள்.",
  "chat.channels.show_fewer": "குறைவான இயல்பு சேனல்களைக் காட்டு",
  "chat.channels.show_less": "குறைவாகக் காட்டு",
  "chat.channels.info": "சேனல் தகவல்",
  "chat.channels.pin": "சேனலை முள்ளால் குத்து",
  "chat.channels.unpin": "சேனலின் முள்ளை அகற்று",
  "chat.channels.mute": "சேனலை ஒலியடக்கு",
  "chat.channels.unmute": "சேனலின் ஒலியடக்கத்தை நீக்கு",
  "chat.channels.leave": "சேனலை விட்டு விலகு",
  "chat.channels.leave_confirm": "விலகு",
  "chat.channels.clear_body":
    "{name} இல் உள்ள எல்லாச் செய்திகளையும் நீக்கவா? இதைத் திரும்பப்பெற முடியாது.",
  "chat.channels.leave_body":
    "{name} ஐ விட்டு விலகவா? அதன் செய்திகள் உங்களுக்கு வருவது நின்றுவிடும், அதன் வரலாறு இந்தச் சாதனத்திலிருந்து அகற்றப்படும்.",
  "chat.channels.more_options": "{name} க்கான மேலும் தேர்வுகள்",
  "chat.channels.teleported_tag": "{level}  ·  தொலைவிலிருந்து",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "அரட்டையை அழி",
  "chat.dm.remove_contact": "தொடர்பை அகற்று",
  "chat.dm.block": "இந்தப் பியரைத் தடு",
  "chat.dm.block_confirm": "தடு",
  "chat.dm.delete": "அரட்டையை நீக்கு",
  "chat.dm.delete_body":
    "இது உரையாடலை உங்கள் பட்டியலிலிருந்து அகற்றி அதன் செய்திகளை நீக்குகிறது. தொடர்பு அப்படியே இருக்கும், அவர்களிடமிருந்து வரும் புதிய செய்தி புதிய அரட்டையைத் தொடங்கும்.",
  "chat.dm.in_range": "வரம்பில்",
  "chat.dm.row_hint": "மேலும் தேர்வுகளுக்கு இருமுறை தட்டிப் பிடித்திருங்கள்",
  "chat.channels.row_hint":
    "மேலும் தேர்வுகளுக்கு இருமுறை தட்டிப் பிடித்திருங்கள்",
  "chat.dm.you_prefix": "நீங்கள்:",
  "chat.dm.none": "நேரடிச் செய்திகள் இல்லை",
  "chat.dm.none_desc":
    "குறியாக்கம் செய்யப்பட்ட நேரடிச் செய்தியைத் தொடங்க மெஷ் தாவலுக்குச் சென்று ஒரு பியரைத் தட்டுங்கள்.",
  "chat.dm.contact_info": "தொடர்புத் தகவல்",
  "chat.dm.pin": "அரட்டையை முள்ளால் குத்து",
  "chat.dm.unpin": "அரட்டையின் முள்ளை அகற்று",
  "chat.dm.mute": "அரட்டையை ஒலியடக்கு",
  "chat.dm.unmute": "அரட்டையின் ஒலியடக்கத்தை நீக்கு",
  "chat.dm.clear_body":
    "{name} உடனான எல்லாச் செய்திகளையும் நீக்கவா? இதைத் திரும்பப்பெற முடியாது.",
  "chat.dm.remove_contact_body":
    "{name} ஐ அகற்றவா? இது உரையாடலை நீக்கி, தொடர்பை மறந்துவிடும். அவர்கள் மீண்டும் செய்தி அனுப்பினால் உங்களை அடைய முடியும்.",
  "chat.dm.block_body":
    "{name} ஐத் தடுக்கவா? மெஷ் தாவலில் அவர்களை நீங்கள் பார்க்க மாட்டீர்கள், அவர்களிடமிருந்து செய்திகளும் வராது, அவர்கள் அருகில் இருந்தாலும்.",
  "chat.dm.more_options": "{name} க்கான மேலும் தேர்வுகள்",
  "chat.dm.remove_contact_short": "தொடர்பை அகற்று",
  "chat.dm.block_short": "தொடர்பைத் தடு",
  "chat.dm.delete_short": "அரட்டையை நீக்கு",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "செய்திகளை அழி",
  "chat.clear_confirm": "அழி",
  "chat.group_badge": "குழு",
  "chat.more": "மேலும்",
  "chat.no_messages": "இன்னும் செய்திகள் இல்லை",
  "chat.you": "நீங்கள்",
  "chat.a11y.channel": "சேனல் {name}",
  "chat.a11y.group": "குழு {name}",
  "chat.a11y.muted": "ஒலியடக்கம்",
  "chat.a11y.pinned": "முள்ளால் குத்தப்பட்டது",

  // ---- Chats: start something new ----
  "chat.new.title": "புதிதாக ஒன்றைத் தொடங்குங்கள்",
  "chat.new.channel": "தனிப்பட்ட சேனலை உருவாக்கு",
  "chat.new.channel_label": "தனிப்பட்ட சேனல்",
  "chat.new.channel_desc":
    "இணைப்பு உள்ள யாரும் சேரக்கூடிய அறை. ஒன்றை உருவாக்குங்கள், அல்லது உங்களுக்கு அனுப்பப்பட்ட இணைப்பால் சேருங்கள்.",
  "chat.new.group": "தனிப்பட்ட குழுவை உருவாக்கு",
  "chat.new.group_label": "தனிப்பட்ட குழு",
  "chat.new.group_desc":
    "குறிப்பிட்ட நபர்களைத் தேர்ந்தெடுங்கள். 16 வரை. புளூடூத்திலேயே இருக்கும்.",
  "chat.new.place": "geohash மூலம் ஓர் இடத்துக்குச் செல்",
  "chat.new.place_label": "ஓர் இடத்துக்குச் செல்",
  "chat.new.place_desc":
    "எந்த இடத்தின் இடச் சேனலையும் அதன் geohash மூலம் திறங்கள்.",
  "chat.new.reach": "எட்டும் தூரம்",
  "chat.new.reach_internet":
    "உறுப்பினர்களைப் புளூடூத் வழியாகவும் இணையம் வழியாகவும் அடைகிறது.",
  "chat.new.reach_mesh": "புளூடூத் வரம்பில் இயங்கும், இணையம் வழியாக அல்ல.",
  "chat.new.reach_internet_desc":
    "உறுப்பினர்களை இணையம் வழியாகவும் அடைகிறது. சேனல் இயங்குகிறது என்பதை ரிலேக்கள் பார்க்க முடியும், அதன் செய்திகளையோ யார் இருக்கிறார்கள் என்பதையோ ஒருபோதும் அல்ல.",
  "chat.new.reach_mesh_desc":
    "உள்ளூர் மெஷிலேயே இருக்கும். மிகவும் தனிப்பட்டது, புளூடூத் வரம்பை எதுவும் தாண்டாது.",
  "chat.new.join_link": "அழைப்பு இணைப்பால் தனிப்பட்ட சேனலில் சேரு",
  "chat.new.back_to_chooser": "தேர்வுக்குத் திரும்பு",
  "chat.new.create_channel": "சேனலை உருவாக்கு",
  "chat.new.name_required": "முதலில் சேனல் பெயரை உள்ளிடுங்கள்",
  "chat.new.name_taken": "அந்தப் பெயர் ஏற்கெனவே எடுக்கப்பட்டுவிட்டது",
  "chat.new.create": "உருவாக்கு",
  "chat.new.e2ee":
    "முனை முதல் முனை வரை குறியாக்கம். செய்திகளை உறுப்பினர்கள் மட்டுமே படிக்க முடியும்.",
  "chat.new.invite_only":
    "அழைப்பால் மட்டும். இணைப்பைப் பகிரும் யாரும் சேரலாம். மற்ற அனைவரிடமிருந்தும் இது மறைந்தே இருக்கும், அருகிலுள்ள பியர்களிடமிருந்தும்.",
  "chat.new.name_exists": "இந்தப் பெயரில் ஒரு சேனல் ஏற்கெனவே உள்ளது.",
  "chat.new.reach_bluetooth_chip": "புளூடூத் மட்டும்",
  "chat.new.reach_internet_chip": "புளூடூத் + இணையம்",
  "chat.new.have_link": "அழைப்பு இணைப்பால் சேரு",

  // ---- Chats: join by link ----
  "chat.join.title": "இணைப்பால் சேரு",
  "chat.join.not_airhop": "அது Airhop இணைப்பு அல்ல.",
  "chat.join.reach_internet":
    "உறுப்பினர்களைப் புளூடூத் வழியாகவும் இணையம் வழியாகவும் அடைகிறது.",
  "chat.join.reach_mesh": "புளூடூத் வரம்பிலேயே இருக்கும்.",
  "chat.join.contact_card":
    "ஒரு தொடர்பு அட்டை. அவர்களை உங்கள் தொடர்புகளில் சேர்த்து அரட்டையைத் திறக்கிறது.",
  "chat.join.unverified": "அந்த இணைப்பைச் சரிபார்க்க முடியவில்லை",
  "chat.join.unverified_body":
    "தொடர்பு அட்டை அதன் சொந்தச் சாவிகளுடன் பொருந்தவில்லை, எனவே சேர்க்கப்படவில்லை. புதியது ஒன்றை அனுப்பச் சொல்லுங்கள்.",
  "chat.join.paste": "ஒட்டுப்பலகையிலிருந்து ஒட்டு",
  "chat.join.join": "சேரு",
  "chat.join.public_channel":
    "பொது சேனல் {name}. அருகில் உள்ள யாரும் படிக்கலாம்.",
  "chat.join.private_channel": "தனிப்பட்ட சேனல் {name}. {reach}",
  "chat.join.dm_with": "{name} உடன் நேரடிச் செய்தி.",
  "chat.join.joined_as": "{name} ஆகச் சேர்ந்தீர்கள்",
  "chat.join.name_clash_body":
    "நீங்கள் ஏற்கெனவே வேறொரு {name} இல் இருக்கிறீர்கள். சேனல் பெயர்கள் வெறும் பெயர்ச்சீட்டுகளே, எனவே இந்த அழைப்பு தனக்கெனத் தனிச் சேனலைத் திறந்துள்ளது, நீங்கள் இருந்தது தொடப்படாமல் உள்ளது. இரண்டையும் அவற்றின் சேனல் தகவலிலிருந்து மறுபெயரிடலாம்.",
  "chat.join.paste_hint":
    "airhop:// என்று தொடங்கும் அழைப்பை ஒட்டுங்கள். இணைப்பைத் தட்டுவதும் வேலை செய்யும்; இது தட்ட முடியாத இணைப்புக்கானது.",
  "chat.join.key_note":
    "தனிப்பட்ட சேனல் அழைப்பு சாவியைச் சுமந்து வருகிறது, எனவே சேர்வது உடனடி, வேறு யாரிடமும் எதுவும் கேட்கப்படுவதில்லை.",
  "chat.join.offline_note":
    "ஆஃப்லைனில் வேலை செய்யும். இணைப்பு இந்தச் சாதனத்திலேயே படிக்கப்படுகிறது, உருவாக்கியவர் அமைத்த தூரம் வரை சேனல் எட்டும்.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "அந்தக் கட்டத்தைத் திறக்க முடியவில்லை. சற்று நேரத்தில் மீண்டும் முயலுங்கள்.",
  "chat.jump.title": "ஓர் இடத்துக்குச் செல்",
  "chat.jump.saved": "சேமித்த இடங்கள்",
  "chat.jump.anywhere":
    "எந்த இடத்தின் பொது இடச் சேனலையும் திறங்கள், நீங்கள் இல்லாத இடத்தையும்கூட.",
  "chat.jump.geohash_note":
    "அதன் geohash ஐ உள்ளிடுங்கள். அந்தக் கட்டத்துக்குள் இடம் வரும் அனைவரும் இந்தச் சேனலைப் பகிர்கிறார்கள்.",
  "chat.jump.teleport_note":
    "நீங்கள் அருகில் இல்லாமல், தொலைவிலிருந்து வந்ததாகத் தெரிவீர்கள். இது இணையம் வழியாக மட்டுமே எட்டும்.",
  "chat.jump.level_cell": "{level} நிலைக் கட்டம்",
  "chat.jump.already_here":
    "நீங்கள் ஏற்கெனவே இங்கேதான் இருக்கிறீர்கள். செல் என்பது உங்கள் {name} சேனலைத் திறக்கும்.",
  "chat.jump.open_direction": "உங்கள் {direction} பக்கமுள்ள கட்டத்தைத் திற",
  "chat.jump.open_place": "{name} ஐத் திற",
  "chat.jump.remove_place": "{name} ஐச் சேமித்த இடங்களிலிருந்து அகற்று",
  "chat.jump.go": "செல்",
  "chat.jump.how":
    "geohash ஐக் கண்டறிய: ஓர் இடச் சேனலைத் திறங்கள் > அதன் பெயரைத் தட்டுங்கள் > அங்கிருந்து நகலெடுங்கள்.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "ஒவ்வொரு உறுப்பினரையும் அடைய முடியவில்லை. அவர்கள் அருகில் இருக்கும்போது மீண்டும் முயலுங்கள்.",
  "chat.group.you_were_added": "நீங்கள் {name} இல் சேர்க்கப்பட்டீர்கள்.",
  "chat.group.added_you": "உங்களை {name} இல் சேர்த்தார்",
  "chat.group.you_were_removed":
    "நீங்கள் {name} இலிருந்து நீக்கப்பட்டீர்கள். இனி இங்கே படிக்கவோ செய்தி அனுப்பவோ முடியாது.",
  "chat.group.removed_you": "உங்களை {name} இலிருந்து நீக்கினார்",
  "chat.group.add_failed": "அவர்களைச் சேர்க்க முடியவில்லை",
  "chat.group.add_failed_body":
    "எதுவும் மாறவில்லை. இப்போது அவர்களை அடைய முடியவில்லை, அல்லது குழு 16 இல் நிரம்பியுள்ளது, அல்லது நீங்கள் அதை உருவாக்கியவர் அல்ல.",
  "chat.group.remove_failed": "அவர்களை நீக்க முடியவில்லை",
  "chat.group.remove_failed_body":
    "எதுவும் மாறவில்லை. குழுவில் யார் இருப்பது என்பதைக் குழுவை உருவாக்கியவர் மட்டுமே மாற்ற முடியும்.",
  "chat.group.e2ee":
    "முனை முதல் முனை வரை குறியாக்கம். செய்திகளை உறுப்பினர்கள் மட்டுமே படிக்க முடியும்.",
  "chat.group.cap":
    "நீங்கள் தேர்ந்தெடுக்கும் 16 பேர் வரை. அழைப்பு இணைப்பு இல்லை, எனவே யாரோ ஒருவர் இணைப்பை அனுப்பியதால் யாரும் உள்ளே வர முடியாது.",
  "chat.group.bluetooth":
    "புளூடூத் மட்டும். வரம்புக்கு வெளியே உள்ள உறுப்பினர்கள் திரும்பியதும் செய்திகளைப் பெறுவார்கள்.",
  "chat.group.members_label": "உறுப்பினர்கள்",
  "chat.group.none_in_range":
    "வரம்பில் யாரும் இல்லை. குழுவை உருவாக்கும்போது உறுப்பினர்கள் அருகில் இருக்க வேண்டும்.",
  "chat.group.create_title": "ஒரு குழுவை உருவாக்கு",
  "chat.group.name_placeholder": "குழுவின் பெயர்",
  "chat.group.create": "உருவாக்கு",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "உள்ளூர் மெஷ் · புளூடூத் மட்டும்",
  "chat.scope.mesh_desc":
    "புளூடூத் வரம்பில் உள்ள சாதனங்களை அடைகிறது (தோராயமாக 10 முதல் 100 மீட்டர்). இணையம் தேவையில்லை. இடத்திலேயே ஒருங்கிணைக்கச் சிறந்தது.",
  "chat.scope.block": "நகரத் தொகுதி · சுமார் 100 மீ",
  "chat.scope.block_desc":
    "ஒரு நகரத் தொகுதி அளவிலான பரப்பு. புளூடூத் வரம்புக்குச் சற்று வெளியே இருந்தாலும் அருகில் உள்ள பியர்களும் கலந்துகொள்ளச் செய்திகள் இணையம் வழியாகப் பாலம் கடக்கின்றன.",
  "chat.scope.neighborhood": "அக்கம்பக்கம் · சுமார் 1 கிமீ",
  "chat.scope.neighborhood_desc":
    "அக்கம்பக்க அளவிலான பரப்பு. ரிலே உதவியுடன், நேரடிப் புளூடூத் இணைப்பு இல்லாமலும் பகுதி முழுவதும் உள்ள பியர்களை அடைய முடியும்.",
  "chat.scope.city": "நகரம் · சுமார் 10 கிமீ",
  "chat.scope.city_desc":
    "நகரம் முழுவதற்குமான சேனல். பெருநகரப் பகுதி முழுவதும் உள்ள பியர்களை அடைய இட அடிப்படையிலான இணைய ரிலேக்களைப் பயன்படுத்துகிறது.",
  "chat.scope.province": "மாநிலம் · சுமார் 100 கிமீ",
  "chat.scope.province_desc":
    "மாநில அளவிலான பரப்பு. நூற்றுக்கணக்கான கிலோமீட்டர் பிராந்தியப் பரப்புக்கு இணையம் வழியாகப் பாலம் அமைக்கப்படுகிறது.",
  "chat.scope.country": "நாடு அல்லது பகுதி · சுமார் 1000 கிமீ",
  "chat.scope.country_desc":
    "நாடு முழுவதற்குமான பரப்பு. அந்தப் பகுதியில் உள்ள எந்த Airhop அல்லது bitchat பயனரும் சேர்ந்து செய்திகளைப் படிக்கலாம்.",
  "chat.transport.bluetooth": "புளூடூத் மட்டும்",
  "chat.transport.both": "புளூடூத் + இணையம்",
  "chat.transport.internet": "இணையம் மட்டும்",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "கட்டளை /{cmd}: {hint}",
  "chat.cmd.hug_hint": "அன்பான அணைப்பை அனுப்பு",
  "chat.cmd.slap_hint": "பெரிய மீனால் அறை",
  "chat.status.sending": "அனுப்புகிறது…",
  "chat.status.undo_send": "அனுப்பியதைத் திரும்பப்பெறு",
  "chat.status.undo": "திரும்பப்பெறு",
  "chat.status.sent": "அனுப்பப்பட்டது",
  "chat.status.received": "பெறப்பட்டது",
  "chat.status.failed": "தோல்வி",
  "chat.status.canceled": "ரத்துசெய்யப்பட்டது",
  "chat.status.waiting": "காத்திருக்கிறது",
  "chat.status.sending_short": "அனுப்புகிறது",
  "chat.status.receiving": "பெறுகிறது",
  "chat.thread.not_available": "இங்கே கிடைக்கவில்லை",
  "chat.thread.private_channel": "தனிப்பட்ட சேனல்",
  "chat.thread.location_channel": "இடச் சேனல்",
  "chat.thread.public_channel": "பொது சேனல்",
  "chat.thread.notices": "இந்தச் சேனலின் அறிவிப்புகள்",
  "chat.thread.invite": "இந்தச் சேனலுக்கு ஒருவரை அழை",
  "chat.thread.not_in_range":
    "அருகில் இல்லை. இணையம் வழியாகச் சேர்ப்பிக்கப்படுகிறது.",
  "chat.thread.not_nearby":
    "அருகில் இல்லை. அவர்கள் வரம்புக்குத் திரும்பியதும் அல்லது ஆன்லைனுக்கு வந்ததும் சேர்ப்பிப்போம்.",
  "chat.thread.no_keys":
    "அவர்களுக்குச் செய்தி அனுப்ப நீங்கள் புளூடூத் வரம்பில் இருக்க வேண்டும், அல்லது அவர்களின் குறியீட்டை ஸ்கேன் செய்ய வேண்டும்.",
  "chat.geo.card_received":
    "{name} தன் தொடர்பைப் பகிர்ந்தார். உங்களில் ஒருவர் இடம் மாறிய பிறகும் பேச்சு தொடர உங்களுடையதையும் பகிருங்கள்.",
  "chat.geo.exchange_complete":
    "தொடர்புகள் பரிமாறப்பட்டன. இப்போது எங்கிருந்தும் ஒருவரையொருவர் அடையலாம்.",
  "chat.geo.keep_person": "இவரை வைத்திரு",
  "chat.geo.keep_person_desc":
    "உங்களில் ஒருவர் இடம் மாறிய பிறகும் பேச்சு தொடர உங்கள் தொடர்பைப் பகிருங்கள். உங்கள் நிரந்தர அடையாளம் அவர்களுக்குத் தெரியவரும்.",
  "chat.geo.card_sent": "பகிரப்பட்டது · அவர்களுடையதற்குக் காத்திருக்கிறது",
  "chat.thread.left_cell":
    "நீங்கள் இந்தப் பகுதியை விட்டு வந்துவிட்டீர்கள், எனவே அவர்களால் இங்கே உங்களை அடைய முடியாது. எங்கும் பேச்சைத் தொடரக் குறியீடுகளைப் பரிமாறிக்கொள்ளுங்கள்.",
  "chat.thread.no_route":
    "இப்போது அவர்களை அடைய முடியவில்லை. வழி கிடைத்ததும் செய்தி அனுப்பப்படும்.",
  "chat.thread.empty": "இன்னும் செய்திகள் இல்லை",
  "chat.thread.empty_desc": "குறியாக்கம் செய்யப்பட்ட உரையாடலைத் தொடங்குங்கள்.",
  "chat.thread.jump_latest": "சமீபத்திய செய்திக்குச் செல்",
  "chat.thread.back_to_members": "உறுப்பினர்களுக்குத் திரும்பு",
  "chat.thread.nostr_key": "Nostr பொதுச் சாவி",
  "chat.thread.in_range": "வரம்பில்",
  "chat.voice.not_recorded": "குரல் குறிப்பு பதிவாகவில்லை",
  "chat.thread.message": "செய்தி",
  "chat.thread.message_placeholder": "செய்தி…",
  "chat.thread.length_full": "செய்தி நிரம்பிவிட்டது",
  "chat.thread.waiting_for":
    "{name} திரும்புவதற்குக் காத்திருக்கிறது · {percent}%",
  "chat.thread.peer": "பியர்",
  "chat.thread.cancel_transfer": "{name} ஐ ரத்துசெய்",
  "chat.thread.queued_more": "மேலும் {count} அனுப்பக் காத்திருக்கின்றன",
  "chat.thread.across_bridge": "பாலத்துக்கு அப்பால் {count}",
  "chat.thread.bridged": "பாலம் கடந்தது",
  "chat.thread.invite_body":
    "Airhop இல் {channel} இல் என்னுடன் சேருங்கள் — தனிப்பட்ட மெஷ் செய்தியனுப்பல், முதலில் ஆஃப்லைன்.",
  "chat.thread.go_back_unread": "பின் செல், {count} படிக்கப்படாதவை",
  "chat.thread.view_info": "{name} இன் தகவலைப் பார்",
  "chat.thread.notices_new": "இந்தச் சேனலின் அறிவிப்புகள், {count} புதியவை",
  "chat.thread.say_something": "{channel} இல் ஏதேனும் சொல்லுங்கள்.",
  "chat.thread.jump_latest_new": "சமீபத்திய செய்திக்குச் செல், {count} புதியவை",
  "chat.thread.unconfirmed_since":
    "{date} முதல் சென்றடைந்ததாக உறுதிசெய்யப்படவில்லை",
  "chat.thread.no_reach": "அருகில் பியர் இல்லை · இதை இன்னும் யாரும் பெறவில்லை",
  "chat.thread.channel_needs_internet":
    "இணையம் முடக்கம் · இந்தச் சேனல் புளூடூத் வரம்பில் உள்ளவர்களை மட்டுமே அடையும்",
  "chat.thread.cell_needs_internet":
    "இணையம் முடக்கம் · இந்தக் கட்டத்தை இணையம் வழியாக மட்டுமே அடைய முடியும்",
  "chat.thread.geo_dm_needs_internet":
    "இணையம் முடக்கம் · இந்த உரையாடல் இணையம் வழியாக மட்டுமே செல்கிறது",
  "chat.thread.via_gateway":
    "இணையம் முடக்கம் · அருகிலுள்ள ஒரு சாதனம் இதை உங்களுக்காக ஆன்லைனில் எடுத்துச் செல்கிறது",
  "chat.thread.group_queued":
    "இந்தக் குழுவில் இருந்து இன்னும் யாரும் அருகில் இல்லை. அவர்கள் வந்ததும் இது அவர்களை அடையும்.",
  "chat.thread.no_group_key":
    "நீங்கள் இனி இந்தக் குழுவில் இல்லை, எனவே இதை அனுப்ப முடியாது",
  "chat.thread.no_reach_offline":
    "இணையம் முடக்கம், அருகில் பியரும் இல்லை · இதை இன்னும் யாரும் பெறவில்லை",
  "chat.thread.mention": "{name} ஐக் குறிப்பிடு",
  "chat.thread.someone_talking": "{hold}. {name} பேசிக்கொண்டிருக்கிறார்.",
  "chat.thread.attach_note":
    "கோப்புகள் புளூடூத் வரம்பில் மட்டுமே செல்லும். உரையும் பணப்பரிமாற்றமும் இணையத் தொடர்புகளை அடையும்; இணைப்புக் கோப்புகள் அடையாது.",
  "chat.thread.message_peer": "{name} க்குச் செய்தி அனுப்பு",
  "chat.thread.send": "செய்தி அனுப்பு",
  "chat.thread.group": "குழு",
  "chat.bridge.nearby_only":
    "அருகில் மட்டும்: இந்தச் செய்தியை மெஷ் பாலத்திலிருந்து விலக்கி வை",
  "chat.bridge.nearby_label": "அருகில் மட்டும் · புளூடூத்திலேயே இருக்கும்",
  "chat.bridge.bridging_label":
    "அருகிலுள்ள பகுதிகளுக்குப் பாலம் அமைக்கிறது · அருகில் மட்டும் என்பதற்குத் தட்டுங்கள்",
  "chat.screenshot.you_took": "நீங்கள் திரைப்படம் எடுத்தீர்கள்",
  "chat.screenshot.you_took_private":
    "நீங்கள் திரைப்படம் எடுத்தீர்கள் · யாருக்கும் சொல்லப்படவில்லை",
  "chat.screenshot.heads_up": "கவனம்",
  "chat.screenshot.notice": "* {name} திரைப்படம் எடுத்தார் *",
  "chat.screenshot.notified_dm":
    "இந்த உரையாடலின் திரைப்படத்தை நீங்கள் எடுத்ததாக {name} க்குத் தெரிவிக்கப்பட்டது.",
  "chat.screenshot.notified":
    "நீங்கள் திரைப்படம் எடுத்ததாக இந்தச் சேனலில் உள்ள அனைவருக்கும் தெரிவிக்கப்பட்டது.",
  "chat.screenshot.not_notified":
    "யாருக்கும் தெரிவிக்கப்படவில்லை. இந்தச் சேனல் பொதுவானது, எனவே திரைப்படத்தை அறிவிப்பது நீங்கள் இங்கு இருந்ததைப் பதிவு செய்துவிடும்.",
  "chat.thread.error": "பிழை",
  "chat.thread.go_back": "பின் செல்",
  "chat.bubble.via_bridge": "மெஷ் பாலம் வழியாக",
  "chat.bubble.view_profile": "{name} இன் சுயவிவரத்தைப் பார்",
  "chat.bubble.forwarded": "அனுப்பப்பட்டது",
  "chat.bubble.attachment": "இணைப்பு",
  "chat.bubble.a11y":
    "{sender}: {body}. மேலும் தேர்வுகளுக்கு நீண்ட நேரம் அழுத்துங்கள்.",
  "chat.bubble.failed_retry": "அனுப்ப முடியவில்லை. மீண்டும் முயலத் தட்டுங்கள்.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "செய்தித் தகவல்",
  "chat.info.delivered_to": "{name} க்குச் சேர்ப்பிக்கப்பட்டது",
  "chat.info.read_by": "{name} படித்தார்",
  "chat.info.group_reach_desc":
    "இப்போது அடையக்கூடியவர், சேர்ப்பிக்கப்பட்ட உறுதி அல்ல",
  "chat.info.group_alone": "வேறு உறுப்பினர்கள் இல்லை",
  "chat.info.today_at": "இன்று {time}",
  "chat.info.sending": "அனுப்புகிறது…",
  "chat.info.failed": "அனுப்ப முடியவில்லை",
  "chat.info.courier": "ஒரு நண்பர் சுமந்து சென்றார்",
  "chat.info.sent": "அனுப்பப்பட்டது",
  "chat.info.queued": "அனுப்பக் காத்திருக்கிறது",
  "chat.info.waiting": "காத்திருக்கிறது…",
  "chat.action.info": "செய்தித் தகவல்",
  "chat.action.save_photos": "புகைப்படங்களில் சேமி",
  "chat.action.save_copy": "ஒரு நகலைச் சேமி",
  "chat.action.forward": "அனுப்பு",
  "chat.action.select": "தேர்ந்தெடு",
  "chat.select.cancel": "தேர்வை ரத்துசெய்",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "கேமரா",
  "chat.attach.camera_desc": "புகைப்படமோ வீடியோவோ எடு",
  "chat.attach.library": "புகைப்படத் தொகுப்பு",
  "chat.attach.library_desc": "உங்கள் தொகுப்பிலிருந்து தேர்ந்தெடுங்கள்",
  "chat.attach.document": "ஆவணம்",
  "chat.attach.document_desc": "எந்தக் கோப்பையும் PDF ஐயும் அனுப்புங்கள்",
  "chat.attach.voice": "குரல் குறிப்பு",
  "chat.attach.voice_desc": "குரல் செய்தியைப் பதிவுசெய்து அனுப்புங்கள்",
  "chat.attach.ecash": "ecash அனுப்பு",
  "chat.attach.ecash_desc": "உங்கள் பணப்பையிலிருந்து Cashu sat அனுப்புங்கள்",
  "chat.attach.location": "இடம்",
  "chat.attach.location_desc":
    "நீங்கள் இப்போது எங்கே இருக்கிறீர்கள் என்பதை அனுப்புங்கள்",
  "chat.attach.title": "இணை",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "ஓர் இடத்தைப் பகிர்ந்தார்",
  "chat.location.received_summary": "தன் இடத்தைப் பகிர்ந்தார்",
  "chat.location.title": "இடம்",
  "chat.location.away": "{distance} {direction} நோக்கி",
  "chat.location.taken": "{ago} முன்பு எடுக்கப்பட்டது",
  "chat.location.open_maps": "வரைபடத்தில் திற",
  "chat.location.no_forward": "இடங்கள் அனுப்பப்படுவதில்லை",
  "chat.location.no_forward_body":
    "ஓர் இடம் ஒருவருக்கு மட்டுமே அனுப்பப்படுகிறது. வேறொருவரிடம் இருக்க வேண்டுமெனில் உங்கள் இடத்தைப் பகிருங்கள்.",
  "chat.location.no_fix":
    "இது எவ்வளவு தொலைவில் என்பதைப் பார்க்க இட அணுகலை அனுமதியுங்கள்",
  "chat.location.send_title": "உங்கள் இடத்தை அனுப்பு",
  "chat.location.send_body":
    "{name} ஒரு புள்ளியைப் பார்ப்பார்: நீங்கள் இப்போது இருக்கும் இடம். இது தொடர்ந்து புதுப்பிக்கப்படாது.",
  "chat.location.send": "இடத்தை அனுப்பு",
  "chat.location.finding": "உங்கள் இடத்தைக் கண்டறிகிறது…",
  "chat.location.no_location": "உங்கள் இடத்தைப் பெற முடியவில்லை",
  "chat.location.no_location_body":
    "இட அணுகலை அனுமதித்து, இடச் சேவைகள் இயக்கத்தில் உள்ளதா என உறுதிசெய்து, மீண்டும் முயலுங்கள்.",
  "chat.location.not_delivered": "உங்கள் இடத்தை அனுப்ப முடியவில்லை",
  "chat.location.not_delivered_body":
    "ஓர் இடம் தற்போதையதாக இருக்கும்போது மட்டுமே அனுப்பத் தகுந்தது, எனவே அது பின்னுக்கு வரிசையில் வைக்கப்படுவதில்லை. {name} ஐ அடையக்கூடியபோது மீண்டும் முயலுங்கள்.",
  "chat.location.direction.n": "வடக்கு",
  "chat.location.direction.ne": "வடகிழக்கு",
  "chat.location.direction.e": "கிழக்கு",
  "chat.location.direction.se": "தென்கிழக்கு",
  "chat.location.direction.s": "தெற்கு",
  "chat.location.direction.sw": "தென்மேற்கு",
  "chat.location.direction.w": "மேற்கு",
  "chat.location.direction.nw": "வடமேற்கு",
  "chat.attach.send_anyway": "எப்படியும் அனுப்பு",
  "chat.attach.bitchat_too_big": "இது சென்றடையாமல் போகலாம்",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat இல் இருக்கிறார், அது பெரிய கோப்பில் பாதியிலேயே விட்டுவிடும். சுமார் 350 KiB க்குக் கீழ் நம்பகமானது. Airhop தொடர்புக்கு அனுப்பினால் அப்படி எந்த வரம்பும் இல்லை.",
  "chat.attach.bitchat_unopenable": "அவர்களால் இதைத் திறக்க முடியாமல் போகலாம்",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat இல் இருக்கிறார், அது புகைப்படங்களையும் குரல் குறிப்புகளையும் காட்டும், மற்ற அனைத்தையும் தன்னால் திறக்க முடியாத கோப்பாகவே பட்டியலிடும். இது சென்றடையும், அவர்களால் பார்க்க முடியாமல் போகலாம், அவ்வளவே.",
  "chat.attach.file": "ஒரு கோப்பை இணை",
  "chat.attach.unavailable": "இங்கே இணைப்புகள் கிடைக்கவில்லை",
  "chat.attach.not_sent": "இணைப்பு அனுப்பப்படவில்லை",
  "chat.attach.read_failed":
    "அந்தக் கோப்பைப் படிப்பதில் ஏதோ தவறாகிவிட்டது. வேறொன்றை முயலுங்கள்.",
  "chat.attach.caption": "விளக்கம் சேருங்கள்…",
  "chat.attach.send": "இணைப்பை அனுப்பு",
  "chat.attach.generic": "இணைப்பு",
  "chat.media.view_full": "புகைப்படத்தை முழுத் திரையில் பார்",
  "chat.media.gone_photo": "புகைப்படம் இந்தச் சாதனத்தில் இல்லை",
  "chat.media.gone_video": "வீடியோ இந்தச் சாதனத்தில் இல்லை",
  "chat.media.gone_voice": "குரல் குறிப்பு இந்தச் சாதனத்தில் இல்லை",
  "chat.media.gone_file": "கோப்பு இந்தச் சாதனத்தில் இல்லை",
  "chat.media.gone_note":
    "7 நாட்களுக்குப் பிறகு அல்லது தற்காலிகச் சேமிப்பு அழிக்கப்பட்டபோது அகற்றப்பட்டது",
  "chat.media.ask_resend": "மீண்டும் கேள்",
  "chat.media.resend_draft": "{kind} ஐ மீண்டும் அனுப்ப முடியுமா?",
  "chat.media.kind_photo": "அந்தப் புகைப்படத்தை",
  "chat.media.kind_video": "அந்த வீடியோவை",
  "chat.media.kind_voice": "அந்தக் குரல் குறிப்பை",
  "chat.media.kind_file": "அந்தக் கோப்பை",
  "chat.media.pause_voice": "குரல் குறிப்பை இடைநிறுத்து",
  "chat.media.play_voice": "குரல் குறிப்பை இயக்கு",
  "chat.media.voice_position": "குரல் குறிப்பில் இடம்",
  "chat.media.voice_scrub":
    "அந்தப் புள்ளிக்குச் செல்லக் கோடுகளின் மேல் தட்டுங்கள்",
  "chat.media.image": "படம்",
  "chat.media.tap_load_photo": "புகைப்படத்தை ஏற்றத் தட்டுங்கள்",
  "chat.media.open_document": "{name} ஐத் திற",
  "chat.media.document": "ஆவணம்",
  "chat.media.tap_load_video": "வீடியோவை ஏற்றத் தட்டுங்கள்",
  "chat.media.video": "வீடியோ",
  "chat.media.photo": "புகைப்படம்",
  "chat.media.close_photo": "புகைப்படத்தை மூடு",
  "chat.media.save_photo": "புகைப்படத்தை உங்கள் புகைப்படங்களில் சேமி",
  "chat.media.share_photo": "புகைப்படத்தைப் பகிர்",
  "chat.media.saved_videos": "உங்கள் வீடியோக்களில் சேமிக்கப்பட்டது",
  "chat.media.saved_photos": "உங்கள் புகைப்படங்களில் சேமிக்கப்பட்டது",
  "chat.media.not_saved": "சேமிக்கப்படவில்லை",
  "chat.media.cant_open": "கோப்பைத் திறக்க முடியாது",
  "chat.media.no_app":
    "இந்தக் கோப்பைத் திறக்கவோ பகிரவோ இந்தச் சாதனத்தில் செயலி எதுவும் இல்லை.",
  "chat.media.open_failed":
    "கோப்பைத் திறக்க முடியவில்லை. அது தற்காலிகச் சேமிப்பிலிருந்து அழிக்கப்பட்டிருக்கலாம்.",
  "media.blocked.nostr_only":
    "இவரை நீங்கள் ஒரு ரிலே வழியாக மட்டுமே அறிவீர்கள். உரை மட்டுமே கிடைக்கும். புகைப்படங்கள், கோப்புகள், குரல் குறிப்புகளுக்குப் புளூடூத் தேவை.",
  "media.blocked.private_channel":
    "ஒளிபரப்பு இணைப்புக் கோப்பு கையொப்பமிடப்படுகிறது ஆனால் குறியாக்கம் செய்யப்படுவதில்லை, எனவே அதைத் தனிப்பட்ட சேனலுக்கு அனுப்பினால் அது வெளிப்படையாகிவிடும், இங்குள்ள உரை குறியாக்கமாகவே இருக்கும்.",
  "media.blocked.private_group":
    "ஒளிபரப்பு இணைப்புக் கோப்பு கையொப்பமிடப்படுகிறது ஆனால் குறியாக்கம் செய்யப்படுவதில்லை, எனவே அதைத் தனிப்பட்ட குழுவுக்கு அனுப்பினால் அது வெளிப்படையாகிவிடும், இங்குள்ள உரை குறியாக்கமாகவே இருக்கும்.",
  "media.blocked.location_channel":
    "இடச் சேனல் இணையம் வழியாக மக்களை அடைகிறது, புகைப்படங்கள், கோப்புகள், குரல் குறிப்புகள் புளூடூத் வழியாகப் பயணிக்கின்றன, எனவே அவை ஒருபோதும் சென்றடையாது.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "இங்கே குரல் குறிப்புகள் கிடைக்கவில்லை",
  "chat.voice.hold_live": "நேரடியாகப் பேச அழுத்திப் பிடியுங்கள்",
  "chat.voice.hold_record": "குரல் குறிப்பைப் பதிவுசெய்ய அழுத்திப் பிடியுங்கள்",
  "chat.voice.cancel_recording": "பதிவை ரத்துசெய்",
  "chat.voice.slide_cancel": "ரத்துசெய்ய நகர்த்துங்கள்",
  "chat.voice.release_cancel": "ரத்துசெய்ய விடுங்கள்",
  "chat.voice.a11y_toggle": "பேசத் தொடங்கவோ நிறுத்தவோ இருமுறை தட்டுங்கள்.",
  "chat.voice.limit_reached":
    "இரண்டு நிமிட வரம்பு எட்டப்பட்டது, அனுப்ப விடுங்கள்",
  "chat.voice.limit_sent":
    "இரண்டு நிமிட வரம்பு எட்டப்பட்டது, குறிப்பு அனுப்பப்பட்டது",
  "chat.voice.stop_send": "பதிவை நிறுத்தி அனுப்பு",
  "chat.voice.lift_lock": "கை விடுவித்துப் பதிவுசெய்ய மேலே நகர்த்துங்கள்",
  "chat.voice.live_speaking": "{name} பேசுகிறார்",
  "voice.unavailable": "நேரடிக் குரல் கிடைக்கவில்லை",
  "voice.recording_stopped": "பதிவு நிறுத்தப்பட்டது",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "கேமரா அணுகல்",
  "chat.perm.camera_purpose": "அனுப்ப ஒரு புகைப்படம் எடுக்க",
  "chat.perm.photo_label": "புகைப்பட அணுகல்",
  "chat.perm.photo_purpose": "அனுப்ப ஒரு புகைப்படமோ வீடியோவோ தேர்ந்தெடுக்க",
  "chat.perm.photo_save_purpose": "இதை உங்கள் புகைப்படங்களில் சேமிக்க",
  "chat.perm.mic_label": "ஒலிவாங்கி அணுகல்",
  "chat.perm.mic_live_purpose": "அருகிலுள்ளவர்களுடன் பேச",
  "chat.perm.mic_note_purpose": "ஒரு குரல் குறிப்பைப் பதிவுசெய்ய",
  "chat.perm.recording_stopped": "பதிவு நிறுத்தப்பட்டது",
  "chat.perm.record_failed":
    "பதிவைத் தொடங்க முடியவில்லை. ஒலிவாங்கி அனுமதிகளைச் சரிபாருங்கள்.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "பெறப்பட்டது",
  "chat.ecash.reclaimed": "மீட்கப்பட்டது",
  "chat.ecash.claiming": "பெறுகிறது…",
  "chat.ecash.claim": "பெறு",
  "chat.ecash.claim_amount": "{amount} {unit} பெறு",
  "chat.ecash.already_claimed": "ஏற்கெனவே பெறப்பட்டது",
  "chat.ecash.already_claimed_body":
    "இந்த டோக்கனின் ஒவ்வொரு சான்றும் ஏற்கெனவே உங்கள் பணப்பையில் உள்ளது, எனவே எதுவும் சேர்க்கப்படவில்லை.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "இயன்றவரை சேர்ப்பிக்க மெஷிடம் ஒப்படைக்கப்பட்டது",
  "chat.info.queued_desc":
    "அவர்களை அடைய வழி கிடைக்கும் வரை இந்தத் தொலைபேசியிலேயே வைக்கப்பட்டுள்ளது",
  "chat.info.reclaimed": "மீட்கப்பட்டது",
  "chat.info.reclaimed_desc":
    "இந்தப் பணப்பரிமாற்றத்தை உங்கள் பணப்பைக்கே திரும்ப எடுத்துக்கொண்டீர்கள், எனவே இது சேர்ப்பிக்கப்படாது",
  "chat.info.about": "பற்றி",
  "chat.info.group_desc":
    "ஒரு தனிப்பட்ட குழு. உருவாக்கியவர் சேர்த்த உறுப்பினர்கள் மட்டுமே படிக்க முடியும், இது புளூடூத்திலேயே இருக்கும்.",
  "chat.info.teleported_desc":
    "இந்த geohash கட்டத்துக்கான பொது இடச் சேனல். அந்தக் கட்டத்தில் உள்ள யாரும், Airhop இலோ bitchat இலோ, இதை இணையம் வழியாகப் பகிர்கிறார்கள். நீங்கள் தொலைவிலிருந்து வந்திருக்கிறீர்கள், உடலால் இங்கு இல்லை.",
  "chat.info.custom_desc":
    "தனிப்பயன் சேனல். பெயர் தெரிந்த யாரும் எந்த Airhop அல்லது bitchat சாதனத்திலிருந்தும் சேரலாம்.",
  "chat.info.private_e2ee": "தனிப்பட்டது · முனை முதல் முனை வரை குறியாக்கம்",
  "chat.info.public_plain": "பொது · குறியாக்கம் இல்லை",
  "chat.info.group_privacy":
    "கீழே காட்டப்பட்டுள்ள உறுப்பினர்கள் மட்டுமே இந்தக் குழுவைப் படிக்க முடியும். செய்திகள் புளூடூத்திலேயே இருக்கும், எனவே வரம்புக்கு வெளியே உள்ள உறுப்பினர்கள் திரும்பியதும் அவற்றைப் பெறுவார்கள்.",
  "chat.info.teleport_privacy":
    "நீங்கள் தொலைவிலிருந்து வந்த இடம். இது இந்தக் கட்டத்தில் உள்ள அனைவரையும் இணையம் வழியாக அடையும், புளூடூத் வரம்பில் யாரையும் அடையாது.",
  "chat.info.location_off_privacy":
    "இடம் முடக்கத்தில் உள்ளது, எனவே இந்தச் சேனல் அருகிலுள்ள சாதனங்களைப் புளூடூத் வழியாக மட்டுமே அடையும். அதன் பகுதிக் கட்டத்தை இணையம் வழியாக அடைய இடத்தை இயக்குங்கள்.",
  "chat.info.invite_privacy":
    "இணைப்பால் நீங்கள் அழைப்பவர்கள் மட்டுமே படிக்க முடியும். மற்ற அனைவரிடமிருந்தும் இது மறைந்தே இருக்கும், அருகிலுள்ள பியர்களிடமிருந்தும்.",
  "chat.info.public_privacy":
    "சேரும் யாரும் ஒவ்வொரு செய்தியையும் படிக்கலாம். தனிப்பட்ட உரையாடலுக்கு நேரடிச் செய்தியைப் பயன்படுத்துங்கள்; நேரடிச் செய்திகள் முனை முதல் முனை வரை குறியாக்கம் செய்யப்பட்டவை.",
  "chat.info.remove_member": "உறுப்பினரை நீக்கு",
  "chat.info.remove_member_body":
    "{name} ஐக் குழுவிலிருந்து நீக்கவா? குழுவின் சாவி மாற்றப்படும், எனவே அவர்களால் புதிய செய்திகளைப் படிக்க முடியாது.",
  "chat.info.message_member": "{name} க்குச் செய்தி அனுப்பு",
  "chat.info.remove_member_a11y": "{name} ஐ நீக்கு",
  "chat.info.no_addable":
    "சேர்க்க அடையக்கூடிய பியர்கள் இல்லை. உறுப்பினர்கள் அருகில் இருக்க வேண்டும்.",
  "chat.info.add_count": "{count} ஐச் சேர்",
  "chat.info.teleported_tag": "{level}  ·  தொலைவிலிருந்து",
  "chat.info.active": "செயலில்",
  "chat.info.members": "உறுப்பினர்கள்",
  "chat.info.bookmark": "இந்த இடத்தைச் சேமி",
  "chat.info.remove_bookmark": "சேமித்த இடங்களிலிருந்து அகற்று",
  "chat.info.default_notice":
    "இயல்பு சேனல்களை விட்டு விலக முடியாது. அவை Airhop இன் மெஷ் நெறிமுறையின் பகுதியே.",
  "chat.info.custom_channel": "தனிப்பயன் சேனல்",
  "chat.info.geohash": "geohash",
  "chat.info.copy_geohash": "geohash ஐ நகலெடு",
  "chat.info.relays": "ரிலேக்கள்",
  "chat.info.show_relays": "இந்தச் சேனலைச் சுமக்கும் ரிலேக்களைக் காட்டு",
  "chat.info.relay_custom": "தனிப்பயன்",
  "chat.info.relays_none":
    "எதுவும் இல்லை. இந்தக் கட்டம் இப்போது புளூடூத் மட்டுமே.",
  "chat.info.search_members": "உறுப்பினர்களைத் தேடு",
  "chat.info.search_members_placeholder": "உறுப்பினர்களைத் தேடு…",
  "chat.info.teleported": "தொலைவிலிருந்து",
  "chat.info.creator": "உருவாக்கியவர்",
  "chat.info.no_matches": "பொருத்தம் இல்லை",
  "chat.info.no_one_here": "இங்கே இன்னும் யாரும் இல்லை",
  "chat.info.add_members": "உறுப்பினர்களைச் சேர்",
  "chat.info.add_selected": "தேர்ந்தெடுத்த உறுப்பினர்களைச் சேர்",
  "chat.info.add": "சேர்",
  "chat.info.leave_group": "குழுவை விட்டு விலகு",
  "chat.info.leave_channel": "சேனலை விட்டு விலகு",
  "chat.info.leave": "விலகு",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} முதல் அரட்டை",
  "chat.contact.verified_since": "{date} முதல் சரிபார்க்கப்பட்டது",
  "chat.contact.anonymous": "அடையாளம் தெரியாதவர்",
  "chat.contact.anonymous_desc":
    "சரிபார்க்க நிலையான அடையாளம் இல்லாத geohash புனைபெயர்",
  "chat.contact.verified": "சரிபார்க்கப்பட்டது",
  "chat.contact.verified_desc": "அவர்களின் QR குறியீட்டை ஸ்கேன் செய்தீர்கள்",
  "chat.contact.verified_desc_compared":
    "அவர்களுடன் குறியீடுகளை ஒப்பிட்டீர்கள்",
  "chat.contact.not_verified": "சரிபார்க்கப்படவில்லை",
  "chat.contact.not_verified_desc":
    "இது உண்மையிலேயே அவர்கள்தானா என உறுதிசெய்ய அவர்களின் குறியீட்டை ஸ்கேன் செய்யுங்கள், அல்லது அழைப்பில் ஒன்றை ஒப்பிடுங்கள்",
  "chat.contact.e2ee": "முனை முதல் முனை வரை குறியாக்கம்",
  "chat.contact.e2ee_nostr":
    "NIP-17 படி பொதியிடப்பட்டது, எனவே ரிலேக்களால் படிக்க முடியாது",
  "chat.contact.e2ee_mesh":
    "Noise XX, மற்றும் Airhop சாதனங்களுக்கு இடையே Double Ratchet",
  "chat.contact.copy_nostr": "Nostr பொதுச் சாவியை நகலெடு",
  "chat.contact.nostr_key": "Nostr பொதுச் சாவி",
  "chat.contact.cell_key_note":
    "இந்தச் சாவி நீங்கள் சந்தித்த பகுதிக்கு உரியது. உங்களில் ஒருவர் இடம் மாறினால் இது மாறும், அதனுடன் உரையாடலும் முடிந்துவிடும். எங்கும் பேச்சைத் தொடரத் தொடர்புகளைப் பரிமாறிக்கொள்ளுங்கள்.",
  "chat.contact.peer_name": "பியர் பெயர்",
  "chat.contact.peer_id": "பியர் அடையாளம்",
  "chat.contact.rename": "மறுபெயரிடு",
  "chat.contact.rename_needs_contact":
    "சாவிகள் உங்களிடம் உள்ளவர்களை மறுபெயரிடலாம். முதலில் தொடர்பு அட்டைகளைப் பரிமாறிக்கொள்ளுங்கள், பிறகு இது நீங்கள் மட்டும் பார்க்கும் பெயராகும்.",
  "chat.contact.rename_needs_keys":
    "இந்தத் தொடர்புக்கு இன்னும் சாவிகள் இல்லை. அவர்களுக்குச் செய்தி அனுப்புங்கள், அல்லது அவர்களின் குறியீட்டை ஸ்கேன் செய்யுங்கள், பிறகு நீங்கள் மட்டும் பார்க்கும் பெயரைக் கொடுக்கலாம்.",
  "chat.contact.renamed_by_you": "அவர்களுக்கு நீங்கள் வைத்த பெயர்",
  "chat.contact.copy_peer_id": "பியர் அடையாளத்தை நகலெடு",
  "chat.contact.verify": "தொடர்பைச் சரிபார்",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "அறிவிப்புகள்",
  "chat.notices.post_area": "இந்தப் பகுதியில் ஓர் அறிவிப்பை இடு",
  "chat.notices.post_mesh": "மெஷில் ஓர் அறிவிப்பை இடு",
  "chat.notices.mark_urgent": "அவசரம் எனக் குறி",
  "chat.notices.post": "அறிவிப்பை இடு",
  "chat.notices.post_short": "இடு",
  "chat.notices.delete": "அறிவிப்பை நீக்கு",
  "chat.notices.just_now": "இப்போதுதான்",
  "chat.notices.fades_soon": "விரைவில் மறையும்",
  "chat.notices.1_day": "1 நாள்",
  "chat.notices.3_days": "3 நாட்கள்",
  "chat.notices.7_days": "7 நாட்கள்",
  "chat.notices.fading": "மறைகிறது",
  "chat.notices.fades_in_hours": "{count} மணியில் மறையும்",
  "chat.notices.fades_in_days": "{count} நாளில் மறையும்",
  "chat.notices.scope_geo": "புவி",
  "chat.notices.scope_mesh": "மெஷ்",
  "chat.notices.urgent_short": "அவசரம்",
  "chat.notices.permanent_warning":
    "ஒருபோதும் மறையாது. பொதுவானது, இந்தப் பகுதியுடன் பிணைக்கப்பட்டது, திரும்பப்பெறவும் முடியாது.",
  "chat.notices.none":
    "இன்னும் அறிவிப்புகள் இல்லை. மற்றவர்களுக்காக இங்கே இருக்க ஒன்றை இடுங்கள்.",

  // ---- Chats: search results ----
  "chat.search.photos": "புகைப்படங்கள்",
  "chat.search.videos": "வீடியோக்கள்",
  "chat.search.audio": "ஒலி",
  "chat.search.documents": "ஆவணங்கள்",
  "chat.search.links": "இணைப்புகள்",
  "chat.search.ecash": "ecash",
  "chat.search.filter_by": "{filter} மூலம் வடிகட்டு",
  "chat.search.no_matches": "”{query}“ உடன் பொருந்தும் {filter} இல்லை",
  "chat.search.no_media": "இன்னும் {filter} இல்லை",
  "chat.search.result_a11y": "{chat}, {sender} இடமிருந்து {kind}",
  "chat.search.you": "நீங்கள்",
  "chat.search.section_chats": "அரட்டைகள்",
  "chat.search.section_messages": "செய்திகள்",
  "chat.search.section_notices": "அறிவிப்புகள்",
  "chat.search.hint":
    "செய்திகளிலும் அரட்டைகளிலும் தேடுங்கள், அல்லது மேலே ஒரு வடிகட்டியைத் தேர்ந்தெடுங்கள்.",
  "chat.search.no_results": "”{query}“ க்கு முடிவுகள் இல்லை",
  "chat.search.open_chat": "{name} ஐத் திற",
  "chat.search.message_a11y": "{chat}, {sender} இடமிருந்து செய்தி: {snippet}",
  "chat.search.notice_a11y": "{chat} இல் {author} இன் அறிவிப்பு: {snippet}",
  "chat.search.urgent": "அவசரம் ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "இந்தப் பட்டியலில் {count} உள்ளன. அழித்தால் அவை இங்கிருந்து மட்டுமே அகலும், செய்திகள் அவற்றின் உரையாடல்களில் படிக்கப்படாமலேயே இருக்கும். அனைத்தையும் படித்ததாகக் குறித்தால் இரண்டும் சரியாகும்.",
  "chat.notif.mark_all_read": "அனைத்தையும் படித்ததாகக் குறி",
  "chat.notif.clear_list": "பட்டியலை அழி",
  "chat.notif.clear_all_a11y": "எல்லா {count} அறிவிப்புகளையும் அழி",
  "chat.notif.title": "அறிவிப்புகள்",
  "chat.notif.clear_short": "அழி",
  "chat.notif.close": "அறிவிப்புகளை மூடு",
  "chat.notif.none": "இன்னும் அறிவிப்புகள் இல்லை",
  "chat.notif.none_desc":
    "உங்கள் சேனல்கள், அரட்டைகளின் செய்திகள், குறிப்பீடுகள், அறிவிப்புகள் இங்கே தோன்றும்.",
  "chat.notif.new": "புதியது",
  "chat.notif.notice_in": "{channel} இல் அறிவிப்பு",

  // ---- Chats: forward ----
  "chat.forward.title": "இதற்கு அனுப்பு…",
  "chat.forward.to": "{name} க்கு அனுப்பு",
  "chat.forward.cant_send_here": "இங்கே அனுப்ப முடியாது",
  "chat.forward.cant_send_to": "{name} க்கு அனுப்ப முடியாது",
  "chat.forward.channels": "சேனல்கள்",
  "chat.forward.groups": "குழுக்கள்",
  "chat.forward.locations": "இடங்கள்",
  "chat.forward.dms": "நேரடிச் செய்திகள்",
  "chat.forward.none": "இன்னும் வேறு அரட்டைகள் இல்லை",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "மெஷ் தொடங்குகிறது…",
  "mesh.banner.no_bluetooth":
    "இந்தச் சாதனத்தில் புளூடூத் இல்லை · இணையம் மட்டும்",
  "mesh.banner.bluetooth_off": "புளூடூத் முடக்கம் · மெஷ் கிடைக்கவில்லை",
  "mesh.banner.bluetooth_off_wifi":
    "புளூடூத் முடக்கம் · மெஷ் WiFi வழியாக இயங்குகிறது",
  "mesh.banner.permission_needed": "புளூடூத் அனுமதி தேவை",
  "mesh.banner.blocked":
    "புளூடூத் தடுக்கப்பட்டுள்ளது · அமைப்புகளில் அனுமதியுங்கள்",
  "mesh.banner.location_permission": "பியர்களைக் கண்டறிய இடம் தேவை",
  "mesh.banner.advertising_unsupported":
    "இந்தத் தொலைபேசி மற்றவர்களைப் பார்க்க முடியும், ஆனால் இதைக் கண்டறிய முடியாது",
  "mesh.banner.location_off_android":
    "இடம் முடக்கம் · பியர்களைக் கண்டறிய Android க்கு இது தேவை",
  "mesh.banner.paused": "மெஷ் இடைநிறுத்தம் · நீங்கள் வெளியே இருக்கிறீர்கள்",
  "mesh.banner.location_off": "இடம் முடக்கம் · இடச் சேனல்கள் கிடைக்கவில்லை",
  "mesh.banner.battery_saver": "மின்கல சேமிப்பு · குறைவாகத் தேடுகிறது",
  "mesh.banner.wipe_incomplete":
    "அழிப்பு முழுமையடையவில்லை · சில தரவு மிஞ்சியிருக்கலாம், மீண்டும் திறக்கும்போது முயலப்படும்",
  "mesh.banner.wifi_off": "வைஃபை முடக்கம் · பெரிய கோப்புகள் மெதுவாகச் செல்லும்",
  "mesh.banner.clock_skew":
    "இந்தத் தொலைபேசியின் கடிகாரம் தவறாக உள்ளது · தேதியையும் நேரத்தையும் தானியங்கியாக அமையுங்கள்",
  "mesh.banner.internet_off": "இணையம் முடக்கம் · புளூடூத் மட்டும்",
  "mesh.banner.relaying":
    "அருகில் பியர் இல்லை · Nostr வழியாகக் கடத்தப்படுகிறது",
  "mesh.banner.tor":
    "Tor இயக்கத்தில் · இணையப் போக்குவரத்து திசைதிருப்பப்படுகிறது",
  "mesh.banner.tor_starting": "Tor தொடங்குகிறது · இணைக்கிறது",
  "mesh.banner.tor_blocked":
    "Tor இணைக்க முடியவில்லை · மெஷ் இன்னும் இயங்குகிறது",
  "mesh.banner.gateway":
    "இணைய நுழைவாயில் இயக்கத்தில் · அருகிலுள்ள பியர்களுக்குக் கடத்துகிறது",
  "mesh.banner.bridge": "மெஷ் பாலம் இயக்கத்தில் · பொது அரட்டை இணைக்கப்பட்டது",
  "mesh.banner.background_limits": "{brand} பின்னணியில் மெஷை இடைநிறுத்தலாம்",
  "mesh.banner.bridge_across":
    "மெஷ் பாலம் இயக்கத்தில் · பாலத்துக்கு அப்பால் {count}",
  "mesh.banner.action.turn_on": "இயக்கு",
  "mesh.banner.action.allow": "அனுமதி",
  "mesh.banner.action.resume": "தொடர்",
  "mesh.banner.action.fix": "சரிசெய்",
  "mesh.banner.hint.resume":
    "புளூடூத் அறிவிப்பையும் தேடலையும் மீண்டும் இயக்குகிறது",
  "mesh.banner.hint.enable_bluetooth":
    "புளூடூத்தை இயக்கும்படி Android ஐக் கேட்கிறது",
  "mesh.banner.hint.location_settings": "அமைப்பின் இட அமைப்புகளைத் திறக்கிறது",
  "mesh.banner.hint.app_settings":
    "அமைப்பு அமைவுகளில் Airhop இன் அனுமதிகளைத் திறக்கிறது",
  "mesh.banner.hint.battery_settings":
    "இந்தத் தொலைபேசியின் பின்னணிச் செயல்பாட்டு அமைப்புகளைத் திறக்கிறது",
  "mesh.banner.dismiss": "நிராகரி: {label}",
  "mesh.banner.hint.dismiss": "இந்தக் குறிப்பை நிரந்தரமாக மறைக்கிறது",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "அருகிலுள்ள பியர்களைத் தேடுகிறது…",
  "mesh.radar.starting": "மெஷ் தொடங்குகிறது…",
  "mesh.radar.no_bluetooth": "இந்தச் சாதனத்தில் புளூடூத் இல்லை",
  "mesh.radar.bluetooth_off": "புளூடூத் முடக்கம் · தேடவில்லை",
  "mesh.radar.permission_needed": "புளூடூத் அனுமதி தேவை",
  "mesh.radar.blocked": "புளூடூத் தடுக்கப்பட்டுள்ளது",
  "mesh.radar.location_permission": "இட அனுமதி தேவை",
  "mesh.radar.location_off": "இடம் முடக்கம் · தேடவில்லை",
  "mesh.radar.hint_rings":
    "வளையங்கள் BLE சமிக்ஞை வலிமையைக் காட்டுகின்றன, தூரத்தை அல்ல",
  "mesh.radar.hint_checking": "புளூடூத்தும் அனுமதிகளும் சரிபார்க்கப்படுகின்றன",
  "mesh.radar.hint_internet": "செய்திகள் இணையம் வழியாகப் பயணிப்பது தொடரும்",
  "mesh.radar.hint_turn_on": "பியர்களைக் கண்டறியப் புளூடூத்தை இயக்குங்கள்",
  "mesh.radar.hint_allow": "பியர்களைக் கண்டறியப் புளூடூத்தை அனுமதியுங்கள்",
  "mesh.radar.hint_allow_settings":
    "பியர்களைக் கண்டறிய அமைப்புகளில் புளூடூத்தை அனுமதியுங்கள்",
  "mesh.radar.hint_location_permission":
    "Android 11 மற்றும் அதற்கு முந்தையவற்றுக்குப் புளூடூத் வழியாகத் தேட இடம் தேவை",
  "mesh.radar.hint_android_location":
    "புளூடூத் தேடல் முடிவுகளைத் தர Android க்கு இடம் இயக்கத்தில் இருக்க வேண்டும்",
  "mesh.radar.signal_strong": "வலிமையானது",
  "mesh.radar.signal_medium": "நடுத்தரம்",
  "mesh.radar.signal_weak": "பலவீனம்",
  "mesh.radar.you_center": "நீங்கள், மெஷின் மையத்தில்",
  "mesh.radar.sonar_hint":
    "சோனார் ஒலியை இயக்குகிறது. தேடல் ஏற்கெனவே தொடர்ந்து நடக்கிறது.",
  "mesh.radar.paused": "மெஷ் இடைநிறுத்தம் · நீங்கள் வெளியே இருக்கிறீர்கள்",
  "mesh.radar.ring_hint":
    "வளையத்தில் உள்ள இடம் சமிக்ஞை வலிமையைக் காட்டுகிறது, தூரத்தை அல்ல",
  "mesh.radar.set_online":
    "பியர்களைக் கண்டறிய நீங்கள் தாவலில் உங்கள் நிலையை ஆன்லைன் என அமையுங்கள்",
  "mesh.radar.in_range": "வரம்பில்",
  "mesh.radar.recently_seen": "அண்மையில் காணப்பட்டவை",
  "mesh.radar.peer_hint":
    "இந்தப் பியருக்குச் செய்தி அனுப்பவோ பணம் அனுப்பவோ தேர்வுகளைத் திறக்கிறது",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "இப்போதுதான்",
  "mesh.peer.none": "அருகில் பியர் இல்லை",
  "mesh.peer.none_desc":
    "புளூடூத் வரம்பில் உள்ள Airhop அல்லது bitchat கொண்ட மற்ற சாதனங்கள் இங்கு தோன்றும்.",
  "mesh.peer.id_copied": "பியர் அடையாளம் நகலெடுக்கப்பட்டது",
  "mesh.peer.copy_id": "பியர் அடையாளத்தை நகலெடு",
  "mesh.peer.their_name": "தன்னை {name} என அழைக்கிறார்",
  "mesh.peer.in_range": "வரம்பில்",
  "mesh.peer.relay": "ரிலே முனை",
  "mesh.peer.relay_body":
    "மெஷை விரிவாக்க யாரோ இயக்கத்தில் விட்டுச்சென்ற ஒரு வானொலி. தன்னால் படிக்க முடியாத செய்திகளை இது சுமக்கிறது. இங்கே செய்தி அனுப்ப யாரும் இல்லை.",
  "mesh.peer.send_dm": "நேரடிச் செய்தி அனுப்பு",
  "mesh.peer.message": "செய்தி",
  "mesh.peer.send_sats": "ecash அனுப்பு",
  "mesh.peer.amount_placeholder": "sat இல் தொகை",
  "mesh.peer.amount_first": "ecash அனுப்பு, முதலில் தொகையை உள்ளிடுங்கள்",
  "mesh.peer.cancel_send": "ecash அனுப்புவதை ரத்துசெய்",
  "mesh.peer.view_peer": "பியர் {name} ஐப் பார்",
  "mesh.peer.view_peer_online": "பியர் {name} ஐப் பார், ஆன்லைன்",
  "mesh.peer.last_seen": "கடைசியாக {ago} முன்பு காணப்பட்டார்",
  "mesh.peer.send_amount": "{amount} sat அனுப்பு",
  "mesh.peer.direct": "நேரடி இணைப்பு",
  "mesh.peer.check_distance": "தூரத்தைச் சரிபார்",
  "mesh.peer.checking": "சரிபார்க்கிறது",
  "mesh.peer.no_reply": "பதில் இல்லை",
  "mesh.peer.no_reply_hint":
    "அவர்கள் நகர்ந்திருக்கலாம், அல்லது அவர்களின் செயலி பதிலளிக்காமல் இருக்கலாம்",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "பகுதி",
  "mesh.level.province": "மாநிலம்",
  "mesh.level.city": "நகரம்",
  "mesh.level.neighborhood": "அக்கம்பக்கம்",
  "mesh.level.block": "நகரத் தொகுதி",
  "mesh.level.building": "கட்டிடம்",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "செலவழிக்கக்கூடியது",
  "wallet.balance.unit_hint": "satoshi க்கும் bitcoin க்கும் இடையே மாறுகிறது",
  "wallet.balance.a11y": "இருப்பு {value} {unit}",
  "wallet.balance.locked":
    "பணப்பைச் சேமிப்பு பூட்டப்பட்டுள்ளது. ecash சான்றுகள் ஒரு குறியாக்கக் கோப்பில் வைக்கப்படுகின்றன, அதன் சாவி சாதனத்தின் சாவிக்கொத்தில் இருக்கிறது, அந்தக் கோப்பைத் திறக்க முடியவில்லை. உங்கள் சாதனத்தைத் திறந்து Airhop ஐ மீண்டும் திறங்கள்.",
  "wallet.balance.tor_blocked":
    "Tor இயக்கத்தில் உள்ளது, எனவே நாணயச்சாலைக் கோரிக்கைகள் தடுக்கப்பட்டுள்ளன: அவை திறந்த வலை வழியாகச் சென்று உங்கள் IP ஐ உங்கள் சான்றுகளுடன் இணைத்துவிடும். மெஷ் வழியாக அனுப்புவதும் பெறுவதும் தொடர்ந்து இயங்கும். அமைப்புகள், பாதுகாப்பின் கீழ் நாணயச்சாலைப் போக்குவரத்தை அனுமதியுங்கள்.",
  "wallet.balance.unconfirmed_note":
    "{amount} இன்னும் நாணயச்சாலையால் உறுதிசெய்யப்படவில்லை",
  "wallet.balance.reserved_note":
    "{amount} வழியில் உள்ள ஓர் அனுப்பலுக்காக ஒதுக்கப்பட்டுள்ளது",
  "wallet.balance.other_mint_note": "{amount} வேறு நாணயச்சாலையில்",
  "wallet.balance.test_mint_note":
    "இதில் சோதனை நாணயச்சாலையின் விளையாட்டுப் பணம் உள்ளது. இது bitcoin அல்ல, இதைப் பணமாக்க முடியாது.",
  "wallet.token": "டோக்கன்",
  "wallet.action.send": "ecash டோக்கனை அனுப்பு",
  "wallet.action.send_disabled":
    "ecash டோக்கனை அனுப்பு, இருப்பு காலியாக இருக்கும்போது கிடைக்காது",
  "wallet.action.receive": "ecash டோக்கனைப் பெறு",
  "wallet.action.zap": "ஒரு Nostr தொடர்புக்கு zap அனுப்பு",
  "wallet.action.zap_disabled":
    "ஒரு Nostr தொடர்புக்கு zap அனுப்பு, இருப்பு காலியாக இருக்கும்போது கிடைக்காது",
  "wallet.action.add_mint": "Cashu நாணயச்சாலையைச் சேர்",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "டோக்கனை உருவாக்க முடியவில்லை",
  "wallet.send.title": "ecash அனுப்பு",
  "wallet.send.amount_in": "{unit} இல் தொகை",
  "wallet.send.body":
    "உங்களிடம் ஏற்கெனவே உள்ள சான்றுகளிலிருந்து ஆஃப்லைனில் உருவாக்கப்பட்டது. டோக்கன் சென்றடைந்தது என நீங்கள் உறுதிசெய்யும் வரை உங்கள் இருப்பிலிருந்து எதுவும் நிரந்தரமாகப் போவதில்லை.",
  "wallet.send.stale_fee_note":
    "கட்டணங்கள் கடைசியாக {days} நாட்களுக்கு முன்பு சரிபார்க்கப்பட்டன. அதன் பிறகு இந்த நாணயச்சாலை கட்டணத்தை உயர்த்தியிருந்தால், அனுப்புவதற்குச் சற்று அதிகம் ஆகலாம்.",
  "wallet.send.fee_note":
    "{spend} {unit} உங்கள் இருப்பிலிருந்து போகும்; கூடுதல் {fee} இல்லையெனில் அவர்கள் செலுத்த வேண்டிய நாணயச்சாலைக் கட்டணத்தை ஈடுகட்டுகிறது",
  "wallet.send.qr_too_big":
    "இந்த டோக்கன் QR குறியீட்டில் அடங்க முடியாத அளவுக்குப் பல நாணயங்களாகப் பிரிந்துள்ளது. மாறாக இதைப் பகிருங்கள் அல்லது நகலெடுங்கள், அல்லது ஒன்றிணைக்க நாணயச்சாலையில் புதுப்பியுங்கள்.",
  "wallet.send.bearer_note":
    "இந்தச் சரத்தை வைத்திருப்பவரே பணத்துக்கு உரியவர். சான்றுகள் ஒதுக்கப்பட்டுள்ளன, செலவழிக்கப்படவில்லை: இது யாரையும் சென்றடையவில்லை எனில் நிலுவையில் உள்ளவை பகுதியில் அவற்றை மீட்கலாம்.",
  "wallet.send.qr_too_big_short":
    "இந்த டோக்கன் QR குறியீட்டில் அடங்க முடியாத அளவுக்குப் பல நாணயங்களாகப் பிரிந்துள்ளது. மாறாக இதைப் பகிருங்கள் அல்லது நகலெடுங்கள்.",
  "wallet.send.scan_note":
    "இதை அவர்களின் பணப்பையிலிருந்து ஸ்கேன் செய்யச் சொல்லுங்கள். சென்றடைந்தது எனக் குறிக்கும் வரை இதை மீட்க முடியும்.",
  "wallet.send.mesh_note":
    "டோக்கன் மெஷ் வழியாகக் குறியாக்கம் செய்யப்பட்ட நேரடிச் செய்தியாகச் செல்கிறது. இணையம் தேவையில்லை.",
  "wallet.send.no_peers_note":
    "அருகிலுள்ள சாதனங்களைக் கண்டறிய மெஷ் தாவலைத் திறங்கள், அல்லது டோக்கனை வேறு வழியில் பகிருங்கள்.",
  "wallet.send.send_to": "{name} க்கு அனுப்பு",
  "wallet.send.memo": "குறிப்பு (விருப்பம், டோக்கனுடன் சேர்ந்து செல்லும்)",
  "wallet.send.building": "உருவாக்குகிறது…",
  "wallet.send.build": "டோக்கனை உருவாக்கு",
  "wallet.send.inexact_body":
    "உங்கள் சான்றுகளால் ஆஃப்லைனில் சரியாக {amount} {unit} ஆக்க முடியாது. நீங்கள் உருவாக்கக்கூடிய மிகச் சிறிய டோக்கன் {spend} {unit}, ஆஃப்லைனில் மீதி இல்லை: கூடுதல் {extra} {unit} பெறுநருக்கே செல்லும்.\n\nஆன்லைனில் இருக்கும்போது நாணயச்சாலையில் புதுப்பித்தால், உங்கள் சான்றுகள் சரியாகப் பொருந்தும் பிரிவுகளாகப் பிரியும்.",
  "wallet.send.send_amount": "{amount} அனுப்பு",
  "wallet.send.sent_to": "{name} க்கு {amount} {unit} அனுப்பப்பட்டது",
  "wallet.send.sent_to_body":
    "{route} அவர்கள் பெற்றதாக நீங்கள் உறுதிசெய்யும் வரை, அல்லது சான்றுகள் மீட்கப்பட்டதாக நாணயச்சாலை சொல்லும் வரை இது நிலுவையில் உள்ளவை பகுதியில் மீட்கக்கூடியதாக இருக்கும்.",
  "wallet.send.copy_token": "டோக்கனை நகலெடு",
  "wallet.send.share_token": "டோக்கனைப் பகிர்",
  "wallet.send.open_in_wallet": "இந்த டோக்கனை வேறொரு பணப்பையில் திற",
  "wallet.send.open_in_wallet_short": "பணப்பையில் திற",
  "wallet.send.to_peer": "டோக்கனை அருகிலுள்ள பியருக்கு அனுப்பு",
  "wallet.send.to_peer_short": "பியருக்கு அனுப்பு",
  "wallet.send.mark_delivered": "சென்றடைந்தது எனக் குறித்து முடி",
  "wallet.send.they_got_it": "அவர்கள் பெற்றுவிட்டார்கள்",
  "wallet.send.keep_pending": "இந்த அனுப்பலை நிலுவையிலேயே வை",
  "wallet.send.decide_later": "பிறகு முடிவுசெய்",
  "wallet.send.no_peers": "வரம்பில் பியர் இல்லை",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "இது உங்களுடைய சொந்தப் பணப்பரிமாற்றம்",
  "wallet.receive.own_payment_body":
    "இந்த நாணயங்கள் நீங்கள் முடிக்காத ஓர் அனுப்பலுக்காக இன்னும் ஒதுக்கப்பட்டுள்ளன, எனவே கோர எதுவும் இல்லை. அவற்றை நேரடியாக உங்கள் இருப்புக்குத் திருப்ப அந்தப் பணப்பரிமாற்றத்தில் மீட்பு என்பதைப் பயன்படுத்துங்கள்.",
  "wallet.receive.already_have": "ஏற்கெனவே உங்கள் பணப்பையில்",
  "wallet.receive.already_have_body":
    "இந்த டோக்கனின் ஒவ்வொரு சான்றும் ஏற்கெனவே இங்கு உள்ளது, எனவே எதுவும் சேர்க்கப்படவில்லை. இருப்புகள் மாறவில்லை.",
  "wallet.receive.stored_unconfirmed":
    "{mint} இடமிருந்து சேமிக்கப்பட்டது, ஆனால் இன்னும் நாணயச்சாலையால் உறுதிசெய்யப்படவில்லை ({reason}).",
  "wallet.receive.offline": "ஆஃப்லைன்",
  "wallet.receive.redeemed_here":
    "{mint} இல் மீட்கப்பட்டது. இந்தச் சான்றுகள் இப்போது உங்களுக்கு மட்டுமே சொந்தம்: அனுப்பியவரின் நகல் இனி வேலை செய்யாது.",
  "wallet.receive.memo_quoted": "\n\n”{memo}“",
  "wallet.receive.redeemed_at":
    "{mint} இல் மீட்கப்பட்டது. இப்போது இது நிரூபிக்கக்கூடிய வகையில் உங்களுடையது: அனுப்பியவரிடம் உள்ள இந்த டோக்கனின் நகல் இனி வேலை செய்யாது.",
  "wallet.receive.stored_pending":
    "{mint} இடமிருந்து சேமிக்கப்பட்டது, ஆனால் இது செலவழிக்கப்படவில்லை என நாணயச்சாலை இன்னும் உறுதிசெய்யவில்லை{dleq}. ஆன்லைனுக்கு வந்ததும் பணப்பை தாவலிலிருந்து புதுப்பியுங்கள்.",
  "wallet.receive.dleq_inline":
    " (அதன் கையொப்பம் பொருந்துகிறது, எனவே டோக்கன் உண்மையானது)",
  "wallet.receive.dleq_ok":
    "நாணயச்சாலையின் கையொப்பம் பொருந்துகிறது, எனவே டோக்கன் உண்மையானது.",
  "wallet.receive.dleq_uncached":
    "நாணயச்சாலையின் சாவிகள் இங்கு இல்லை, எனவே கையொப்பத்தை ஆஃப்லைனில் சரிபார்க்க முடியவில்லை.",
  "wallet.receive.dleq_warning":
    "நீங்கள் ஆன்லைனில் புதுப்பிக்கும் வரை, கொள்கை அளவில் அனுப்பியவர் இதை வேறெங்கோ செலவழித்திருக்கக்கூடும்.",
  "wallet.receive.failed": "பெற முடியவில்லை",
  "wallet.receive.title": "ecash பெறு",
  "wallet.receive.body":
    "ஒரு Cashu டோக்கனை ஒட்டுங்கள். ஆன்லைனில் அது உடனே நாணயச்சாலையில் மீட்கப்படும்; ஆஃப்லைனில் சேமிக்கப்பட்டு அடுத்த முறை புதுப்பிக்கும்போது உறுதிசெய்யப்படும்.",
  "wallet.receive.scan": "ecash QR குறியீட்டை ஸ்கேன் செய்",
  "wallet.receive.scan_short": "QR ஸ்கேன்",
  "wallet.receive.receiving": "பெறுகிறது…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}… இடமிருந்து nutzap பெறப்பட்டு உங்கள் பணப்பையில் மீட்கப்பட்டது.",
  "wallet.zap.title": "ஒரு Nostr அடையாளத்துக்கு zap அனுப்பு",
  "wallet.zap.not_npub": "npub அல்ல",
  "wallet.zap.bad_key": "தவறான சாவி",
  "wallet.zap.invalid_pubkey": "பொதுச் சாவி செல்லாதது",
  "wallet.zap.invalid_pubkey_body":
    "npub1… அல்லது 64 எழுத்து பதினாறடிமான Nostr பொதுச் சாவியை உள்ளிடுங்கள்.",
  "wallet.zap.sent": "nutzap அனுப்பப்பட்டது",
  "wallet.zap.failed": "zap தோல்வி",
  "wallet.zap.body":
    "அவர்கள் NIP-61 nutzap தகவலை வெளியிட்டால், ecash அவர்களின் சாவியுடன் பூட்டப்படும், எனவே வேறு யாரும் அதைச் செலவழிக்க முடியாது, திரும்பப்பெறவும் முடியாது. இல்லையெனில் இது மீட்கக்கூடிய டோக்கனாகச் செல்லும். எது நடந்தது என்பது உங்களுக்குச் சொல்லப்படும்.",
  "wallet.zap.contact": "{name} க்கு zap அனுப்பு",
  "wallet.zap.pubkey_placeholder": "npub1… அல்லது 64 எழுத்து பதினாறடிமானம்",
  "wallet.zap.sending": "அனுப்புகிறது…",
  "wallet.nostr.copied_body":
    "இதை ஒருவரிடம் கொடுங்கள், அவர்கள் Airhop இலிருந்தோ வேறு எந்த Nostr பணப்பையிலிருந்தோ உங்களுக்கு zap அனுப்ப முடியும், புளூடூத் தேவையில்லை.",
  "wallet.nostr.copy_key":
    "மக்கள் உங்களுக்கு zap அனுப்ப உங்கள் Nostr சாவியை நகலெடுங்கள்",
  "wallet.nostr.your_key": "உங்கள் Nostr சாவி",

  // ---- Wallet: mints ----
  "wallet.mint.added": "நாணயச்சாலை சேர்க்கப்பட்டது",
  "wallet.mint.add_failed": "நாணயச்சாலையைச் சேர்க்க முடியவில்லை",
  "wallet.mint.added_named": "{name} சேர்க்கப்பட்டது",
  "wallet.mint.added_body":
    "{mint} {units} ஐ வழங்குகிறது. அதன் சாவிகள் இந்தச் சாதனத்தில் சேமிக்கப்பட்டுள்ளன, எனவே அதன் டோக்கன்களை இணையம் இல்லாமலும் இப்போது சரிபார்க்கலாம்.",
  "wallet.mint.remove_plain":
    "{mint} ஐ உங்கள் பணப்பையிலிருந்து அகற்றவா? அதன் சேமித்த சாவிகளும் சேர்ந்து போகும், எனவே அதன் டோக்கன்களை இனி ஆஃப்லைனில் சரிபார்க்க முடியாது.",
  "wallet.mint.title": "நாணயச்சாலைகள்",
  "wallet.mint.none": "இன்னும் நாணயச்சாலை இல்லை",
  "wallet.mint.none_desc":
    "நாணயச்சாலை உங்கள் ecash ஐ வழங்கியும் மீட்டும் தருகிறது. Lightning வழியாகச் செலுத்த ஒன்றைச் சேருங்கள், அல்லது ஒரு டோக்கனைப் பெற்றால் அதன் நாணயச்சாலை உங்களுக்காகச் சேர்க்கப்படும்.",
  "wallet.mint.add": "நாணயச்சாலையைச் சேர்",
  "wallet.mint.add_body":
    "உங்கள் ecash க்குப் பின்னால் உள்ள Bitcoin ஐ நாணயச்சாலை வைத்திருக்கிறது, எனவே அங்கு வைக்கும் இருப்பை நம்பி ஒப்படைக்கக்கூடிய ஒன்றைத் தேர்ந்தெடுங்கள். சேமிப்பதற்கு முன் URL சரிபார்க்கப்படும். யாரையும் நம்ப விரும்பவில்லை எனில் Nutshell கொண்டு உங்கள் சொந்த நாணயச்சாலையை இயக்குங்கள்.",
  "wallet.mint.consolidate_body":
    "ஒரு டோக்கன் எப்போதும் ஒரே ஒரு நாணயச்சாலையைத்தான் குறிப்பிட முடியும், எனவே பல நாணயச்சாலைகளில் பரவியுள்ள இருப்பால், அவற்றில் மிகப் பெரியது வைத்திருப்பதைவிட அதிகத் தொகையைச் செலுத்த முடியாது. Airhop அதை நகர்த்த முடியும்: நீங்கள் தேர்ந்தெடுத்த நாணயச்சாலை வழங்கும் Lightning பட்டியலை மற்ற ஒவ்வொரு நாணயச்சாலையும் செலுத்தும். இதற்குச் சிறிய திசைவழிக் கட்டணமும் இணையமும் தேவை.",
  "wallet.mint.add_short": "நாணயச்சாலை சேர்",
  "wallet.mint.checking": "சரிபார்க்கிறது…",
  "wallet.mint.remove_with_balance": "இருப்பு உள்ள நாணயச்சாலையை அகற்றவா?",
  "wallet.mint.remove": "நாணயச்சாலையை அகற்று",
  "wallet.mint.delete_anyway": "எப்படியும் நீக்கு",
  "wallet.mint.consolidate": "எல்லா இருப்புகளையும் ஒரே நாணயச்சாலைக்கு நகர்த்து",
  "wallet.mint.confirm_with": "{mint} இடம் சான்றுகளை உறுதிசெய்",
  "wallet.mint.remove_a11y": "{mint} ஐ அகற்று",
  "wallet.mint.available_amount": "{amount} {unit} கிடைக்கிறது",
  "wallet.mint.split_across":
    "இருப்பு {count} நாணயச்சாலைகளில் பிரிந்துள்ளது. அதை ஒன்றுக்கு நகர்த்துங்கள்.",
  "wallet.mint.move_everything_to": "எல்லாவற்றையும் {mint} க்கு நகர்த்து",
  "wallet.mint.consolidate_title": "ஒரே நாணயச்சாலைக்கு நகர்த்து",
  "wallet.mint.moving": "நகர்த்துகிறது…",
  "wallet.mint.move": "நகர்த்து",
  "wallet.mint.moved": "நகர்த்தப்பட்டது",
  "wallet.mint.moved_body":
    "{fees} {unit} Lightning திசைவழிக் கட்டணத்துக்குப் பிறகு {amount} {unit} இப்போது {mint} இல் உள்ளது.",
  "wallet.mint.nothing_moved": "எதுவும் நகர்த்தப்படவில்லை",
  "wallet.mint.destination": "· சேருமிடம்",
  "wallet.mint.will_move": "· நகர்த்தப்படும்",
  "wallet.mint.issued_by": "வழங்கியவர்",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop பணப்பையில் நிரப்புதல்",
  "wallet.ln.invoice_failed": "பட்டியலை உருவாக்க முடியவில்லை",
  "wallet.ln.price_failed": "இந்தப் பட்டியலுக்கு விலை நிர்ணயிக்க முடியவில்லை",
  "wallet.ln.paid": "செலுத்தப்பட்டது",
  "wallet.ln.deposit_credited":
    "பட்டியல் செலுத்தப்பட்டு {mint} {amount} {unit} வழங்கியது. இந்த இருப்பு உறுதிசெய்யப்பட்டது: உடனே ஆஃப்லைனில் செலவழிக்கலாம்.",
  "wallet.ln.withdrawn":
    "Lightning வழியாக {paid} sat செலுத்தப்பட்டது. நாணயச்சாலை {fee} sat திசைவழிக் கட்டணமாக எடுத்தது.",
  "wallet.ln.withdrawn_with_change":
    "Lightning வழியாக {paid} sat செலுத்தப்பட்டது. நாணயச்சாலை {fee} sat திசைவழிக் கட்டணமாக எடுத்து, ஒதுக்கீட்டிலிருந்து {change} sat ஐ உங்கள் இருப்புக்குத் திருப்பியது.",
  "wallet.ln.payment_failed": "பணப்பரிமாற்றம் தோல்வி",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning sat ஐ ஆஃப்லைனில் செலவழிக்கக்கூடிய ecash ஆக மாற்றுங்கள், அல்லது ecash ஐ எந்த Lightning பட்டியலுக்கும் திருப்பி எடுங்கள். இரண்டுக்கும் இணையமும் ஒரு நாணயச்சாலையும் தேவை.",
  "wallet.ln.deposit_body":
    "நாணயச்சாலை உங்களுக்கு ஒரு பட்டியலைத் தருகிறது. எந்த Lightning பணப்பையிலிருந்தும் அதைச் செலுத்துங்கள், sat ஆஃப்லைனில் செலவழிக்கக்கூடிய ecash ஆகத் திரும்பும்.",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit} க்கான இந்தப் பட்டியலைச் செலுத்துங்கள். பணப்பை பணத்தை எதிர்பார்த்துக் காத்திருக்கிறது, உங்கள் ecash ஐத் தானாகவே வழங்கும்.",
  "wallet.ln.expired_body":
    "இந்தப் பட்டியலின் காலம் முடிந்தது. ஏற்கெனவே செலுத்திவிட்டீர்கள் எனில் இருப்பு தானாகவே வரவு வைக்கப்படும்.",
  "wallet.ln.waiting_expires":
    "பணத்துக்குக் காத்திருக்கிறது · {countdown} இல் காலாவதி",
  "wallet.ln.withdraw_body":
    "ஒரு bolt11 பட்டியலை ஒட்டுங்கள், நாணயச்சாலை அதை உங்கள் ecash இலிருந்து செலுத்தும். திசைவழி ஒதுக்கீடு முதலில் தெரிவிக்கப்படும்; திசைவழி பயன்படுத்தாதது உங்கள் இருப்புக்குத் திரும்பும்.",
  "wallet.ln.up_to": "{amount} {unit} வரை",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} செலுத்து",
  "wallet.ln.deposit": "Lightning வழியாக sat செலுத்து",
  "wallet.ln.deposit_short": "செலுத்து",
  "wallet.ln.withdraw": "ஒரு Lightning பட்டியலுக்கு எடு",
  "wallet.ln.withdraw_short": "எடு",
  "wallet.ln.deposit_title": "Lightning வழியாகச் செலுத்துதல்",
  "wallet.ln.amount_placeholder": "sat இல் தொகை",
  "wallet.ln.requesting": "கோருகிறது…",
  "wallet.ln.get_invoice": "பட்டியலைப் பெறு",
  "wallet.ln.copy_invoice": "பட்டியலை நகலெடு",
  "wallet.ln.open_wallet": "ஒரு Lightning பணப்பையில் திற",
  "wallet.ln.open_wallet_short": "பணப்பையில் திற",
  "wallet.ln.waiting": "பணத்துக்குக் காத்திருக்கிறது…",
  "wallet.ln.new_invoice": "புதிய பட்டியலை உருவாக்கு",
  "wallet.ln.new_invoice_short": "புதிய பட்டியல்",
  "wallet.ln.withdraw_title": "Lightning க்கு எடுத்தல்",
  "wallet.ln.scan_invoice": "Lightning பட்டியலின் QR குறியீட்டை ஸ்கேன் செய்",
  "wallet.ln.paid_from": "இதிலிருந்து செலுத்தப்பட்டது",
  "wallet.ln.invoice": "பட்டியல்",
  "wallet.ln.routing_reserve": "திசைவழி ஒதுக்கீடு",
  "wallet.ln.reserved": "இருப்பிலிருந்து ஒதுக்கப்பட்டது",
  "wallet.ln.paying": "செலுத்துகிறது…",
  "wallet.ln.get_quote": "மதிப்பீட்டைப் பெறு",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "காப்புப்பிரதி",
  "wallet.backup.setup_failed": "காப்புப்பிரதியை அமைக்க முடியவில்லை",
  "wallet.backup.on": "காப்புப்பிரதி இயக்கத்தில்",
  "wallet.backup.on_body":
    "உங்கள் இருப்பை இப்போது அந்தப் பன்னிரண்டு சொற்களிலிருந்து மீண்டும் கட்ட முடியும்.\n\nமற்றவர்கள் உங்களுக்குக் கொடுத்தவை, நாணயச்சாலையில் நீங்கள் புதுப்பிக்கும் வரை அந்தச் சொற்றொடருக்கு வெளியேயே இருக்கும், மீட்புக்கு உங்கள் நாணயச்சாலைப் பட்டியலும் தேவை, எனவே அதைச் சொற்களுக்கு அருகிலேயே எழுதி வைத்திருங்கள்.",
  "wallet.backup.no_phrase": "எந்தச் சொற்றொடரும் சேமிக்கப்படவில்லை",
  "wallet.backup.no_phrase_body":
    "மீட்புச் சொற்றொடரைச் சாதனத்தின் சாவிக்கொத்திலிருந்து படிக்க முடியவில்லை. சாதனத்தைத் திறந்து மீண்டும் முயலுங்கள்.",
  "wallet.backup.replace_title": "உங்கள் தற்போதைய சொற்றொடரை மாற்றவா?",
  "wallet.backup.replace_body":
    "உங்களிடம் ஏற்கெனவே ஒரு மீட்புச் சொற்றொடர் உள்ளது. வேறொன்றை மீட்டால் அது மாற்றப்படும். பழைய சொற்றொடர் ஏற்கெனவே உள்ளடக்கிய நாணயங்கள் இந்தச் சாதனத்தில் செலவழிக்கக்கூடியவையாகவே இருக்கும், ஆனால் மீட்க முடியாதவையாகிவிடும், எனவே தொடர்வதற்கு முன் பழைய சொற்கள் எழுதி வைக்கப்பட்டுள்ளதா என உறுதிசெய்யுங்கள்.",
  "wallet.backup.replace": "மாற்று",
  "wallet.backup.invalid_phrase": "அந்தச் சொற்றொடர் செல்லாதது",
  "wallet.backup.invalid_phrase_body":
    "சொற்றொடருக்குள்ளேயே ஒரு சரிபார்ப்புத் தொகை உள்ளது, இது அதில் தேறவில்லை. தவறாகத் தட்டச்சு செய்யப்பட்ட, விடுபட்ட, அல்லது இடம் மாறிய சொல்லைத் தேடுங்கள்.",
  "wallet.backup.not_bip39":
    "இவை BIP-39 சொற்கள் அல்ல: {words}. எழுத்துப்பிழையைச் சரிபாருங்கள்.",
  "wallet.backup.add_mint_first": "முதலில் ஒரு நாணயச்சாலையைச் சேருங்கள்",
  "wallet.backup.add_mint_first_body":
    "உங்களுக்காக எந்த நாணயங்களில் கையொப்பமிட்டது என நாணயச்சாலையிடம் கேட்பதன் மூலமே மீட்பு வேலை செய்கிறது, எனவே எந்த நாணயச்சாலையிடம் கேட்பது என்பது தெரிய வேண்டும். நீங்கள் பயன்படுத்திய நாணயச்சாலைகளைச் சேர்த்துவிட்டு மீட்டெடுங்கள்.",
  "wallet.backup.restore_failed": "மீட்பு தோல்வியடைந்தது",
  "wallet.backup.phrase": "மீட்புச் சொற்றொடர்",
  "wallet.backup.state_unconfirmed":
    "காப்புப்பிரதி இயக்கத்தில், ஆனால் உறுதிசெய்யப்படவில்லை",
  "wallet.backup.state_off": "காப்புப்பிரதி முடக்கத்தில்",
  "wallet.backup.badge_on": "இயக்கம்",
  "wallet.backup.badge_unconfirmed": "உறுதிசெய்யப்படவில்லை",
  "wallet.backup.badge_off": "முடக்கம்",
  "wallet.backup.view": "மீட்புச் சொற்றொடரைப் பார்",
  "wallet.backup.setup": "மீட்புச் சொற்றொடரை அமை",
  "wallet.backup.view_short": "சொற்றொடரைப் பார்",
  "wallet.backup.setup_short": "அமை",
  "wallet.backup.restore": "மீட்புச் சொற்றொடரிலிருந்து பணப்பையை மீட்டெடு",
  "wallet.backup.restore_short": "மீட்டெடு",
  "wallet.backup.setup_title": "மீட்புச் சொற்றொடரை அமை",
  "wallet.backup.on_body_short":
    "உங்கள் இருப்பை உங்கள் பன்னிரண்டு சொற்களிலிருந்து புதிய சாதனத்தில் மீண்டும் கட்ட முடியும்.",
  "wallet.backup.unconfirmed_body":
    "எழுதி வைத்த நகல் உள்ளதா என நீங்கள் ஒருபோதும் உறுதிசெய்யவில்லை. இப்போது அந்தச் சொற்கள் இந்தத் தொலைபேசியில் மட்டுமே உள்ளன, காப்புப்பிரதி தாண்டி வர வேண்டியதே அதுதான். சொற்றொடரைப் பார்த்து எழுதி வையுங்கள்.",
  "wallet.backup.not_covered":
    "{amount} இன்னும் உள்ளடக்கப்படவில்லை. உங்களுக்குக் கொடுக்கப்பட்ட நாணயங்கள் அனுப்பியவரின் ரகசியங்களைச் சுமக்கின்றன, எனவே அவை பரிமாறப்பட்ட பிறகே உங்கள் சொற்றொடருக்குள் வரும். அவற்றைப் பாதுகாக்க ஒரு நாணயச்சாலையைப் புதுப்பியுங்கள்.",
  "wallet.backup.off_body":
    "உங்கள் ecash இந்தத் தொலைபேசியில் மட்டுமே உள்ளது. இதை இழந்தால் பணத்தை யாராலும் மீட்க முடியாது, உங்களாலும் முடியாது. மீட்புச் சொற்றொடர் என்பது உங்கள் இருப்பை எங்கும் மீண்டும் கட்டக்கூடிய பன்னிரண்டு சொற்கள்.",
  "wallet.backup.about_to_see":
    "நீங்கள் இப்போது பன்னிரண்டு சொற்களைப் பார்க்கப்போகிறீர்கள். அவையே பணம்.",
  "wallet.backup.exact_order":
    "பன்னிரண்டு சொற்கள், சரியாக இதே வரிசையில். அவை யாரிடம் உள்ளதோ, உங்கள் இருப்பும் அவரிடமே.",
  "wallet.backup.verify_body":
    "யாரும் எழுதி வைக்காத சொற்றொடர், சொற்றொடரே இல்லாததைவிட மோசம், ஏனெனில் அது இல்லாத ஒரு பாதுகாப்பு வலைபோலத் தோன்றுகிறது. உறுதிசெய்ய இரண்டு சொற்கள்.",
  "wallet.backup.verify_mismatch":
    "அது பொருந்தவில்லை. நீங்கள் எழுதி வைத்த நகலைச் சரிபாருங்கள்.",
  "wallet.backup.restore_body":
    "பன்னிரண்டு சொற்களை உள்ளிடுங்கள். Airhop உங்கள் நாணயங்களை மீண்டும் பெற்று, அவற்றில் எவற்றில் கையொப்பமிட்டது என ஒவ்வொரு நாணயச்சாலையிடமும் கேட்கிறது, எனவே நாணயச்சாலை வைத்திருக்கும் பதிவுகளிலிருந்து இருப்பு திரும்பி வருகிறது.",
  "wallet.backup.warn_secret":
    "அவற்றைப் படிக்கும் யாரும் உங்கள் இருப்பை எடுத்துக்கொள்ள முடியும். அவற்றைத் திரைப்படமெடுக்காதீர்கள், இந்தத் தொலைபேசியில் சேமிக்காதீர்கள்.",
  "wallet.backup.warn_paper":
    "அவற்றைத் தாளில் எழுதிப் பாதுகாப்பான இடத்தில் வையுங்கள். தொலைபேசி போய்விட்டால் Airhop ஆல் அவற்றை மீண்டும் காட்ட முடியாது.",
  "wallet.backup.warn_scope":
    "அவை உங்கள் ecash ஐ மட்டுமே மீண்டும் கட்டும். உங்கள் அடையாளம், அரட்டைகள், தொடர்புகள் இதில் அடங்காது.",
  "wallet.backup.warn_mints":
    "எந்த நாணயங்களில் கையொப்பமிட்டது என மீட்பு நாணயச்சாலையிடம் கேட்க வேண்டும், எனவே உங்கள் நாணயச்சாலைப் பட்டியலைச் சொற்களுக்கு அருகில் எழுதுங்கள்.",
  "wallet.backup.preparing": "தயாராகிறது…",
  "wallet.backup.show_phrase": "என் சொற்றொடரைக் காட்டு",
  "wallet.backup.your_phrase": "உங்கள் மீட்புச் சொற்றொடர்",
  "wallet.backup.write_down": "இவற்றை எழுதி வையுங்கள்",
  "wallet.backup.copy_phrase": "மீட்புச் சொற்றொடரை ஒட்டுப்பலகைக்கு நகலெடு",
  "wallet.backup.copy_clipboard": "ஒட்டுப்பலகைக்கு நகலெடு",
  "wallet.backup.written_down": "நான் அவற்றை எழுதி வைத்துவிட்டேன்",
  "wallet.backup.check_copy": "உங்கள் நகலைச் சரிபாருங்கள்",
  "wallet.backup.confirm": "உறுதிசெய்",
  "wallet.backup.restore_title": "ஒரு சொற்றொடரிலிருந்து மீட்பு",
  "wallet.backup.phrase_placeholder":
    "பன்னிரண்டு சொற்கள், இடைவெளியால் பிரிக்கப்பட்டவை",
  "wallet.backup.no_mints_yet":
    "இன்னும் நாணயச்சாலை எதுவும் சேர்க்கப்படவில்லை. மீட்பு ஒரு குறிப்பிட்ட நாணயச்சாலையிடம் கேட்க வேண்டும், எனவே முதலில் நீங்கள் பயன்படுத்தியவற்றைச் சேருங்கள்.",
  "wallet.backup.scanning": "தேடுகிறது…",
  "wallet.backup.restore_progress":
    "{mint} · {total} இல் சாவித் தொகுப்பு {step}",
  "wallet.backup.will_scan":
    "தேடப்படும்: {mints}. நீங்கள் சேர்க்காத நாணயச்சாலையிடம் ஒருபோதும் கேட்கப்படுவதில்லை, எனவே அதன் இருப்பு கண்ணுக்குத் தெரியாமலேயே இருக்கும்.",
  "wallet.backup.word_n": "சொல் {position}",
  "wallet.backup.unreachable_mints":
    "அடைய முடியவில்லை: {mints}. அங்குள்ள இருப்பு இன்னும் அங்கேயே உள்ளது. சிறந்த இணைப்பு கிடைக்கும்போது மீண்டும் முயலுங்கள்.",
  "wallet.backup.nothing_recovered":
    "தேடிய நாணயச்சாலைகளிலிருந்து எதுவும் மீட்கப்படவில்லை.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "பெறப்பட்டது எனக் குறிக்கவா?",
  "wallet.delivered.body":
    "இது {amount} {unit} ஐ நிரந்தரமாக விடுவிக்கிறது. அது உண்மையில் ஒருபோதும் சென்றடையவில்லை எனில், அதை உங்களால் மீட்க முடியாது.",
  "wallet.delivered.body_generic":
    "இது ஒதுக்கப்பட்ட தொகையை நிரந்தரமாக விடுவிக்கிறது. அது உண்மையில் ஒருபோதும் சென்றடையவில்லை எனில், அதை உங்களால் மீட்க முடியாது.",
  "wallet.delivered.cancel": "இன்னும் இல்லை",
  "wallet.delivered.confirm": "அவர்கள் பெற்றுவிட்டார்கள்",
  "wallet.reclaim.title": "இந்த டோக்கனை மீட்கவா?",
  "wallet.reclaim.body":
    "{amount} {unit} உங்கள் இருப்புக்குத் திரும்பும். டோக்கன் யாரையும் சென்றடையவில்லை எனில் மட்டுமே இதைச் செய்யுங்கள்: அந்தச் சரம் ஏற்கெனவே அவர்களிடம் இருந்தால், நாணயச்சாலையில் முதலில் மீட்பவரே பணத்தை வைத்துக்கொள்வார், அது அவர்களாகவும் இருக்கலாம்.",
  "wallet.reclaim.keep": "நிலுவையிலேயே வை",
  "wallet.reclaim.confirm": "மீட்டெடு",
  "wallet.copied.token_body":
    "டோக்கன் உங்கள் ஒட்டுப்பலகையில் உள்ளது. சென்றடைந்தது எனக் குறிக்கும் வரை இது இங்கேயே ஒதுக்கப்பட்டிருக்கும், எனவே முதல் முயற்சி தோற்றால் மீண்டும் ஒட்டலாம்.",
  "wallet.copied.phrase_body":
    "இதைக் கடவுச்சொல் மேலாளரில் ஒட்டிவிட்டு, உங்கள் ஒட்டுப்பலகையை அழியுங்கள். மற்ற செயலிகள் ஒட்டுப்பலகையைப் படிக்க முடியும், சில அமைப்புகளில் இது உங்கள் மற்ற சாதனங்களுடன் ஒத்திசைக்கும்.",
  "wallet.refresh.failed": "புதுப்பிப்பு தோல்வி",
  "wallet.refresh.partly": "பகுதியளவு புதுப்பிக்கப்பட்டது",
  "wallet.refresh.done": "புதுப்பிக்கப்பட்டது",
  "wallet.refresh.unreachable":
    "{mints} ஐ அடைய முடியவில்லை. மற்ற அனைத்தும் தற்போதையவை.",
  "wallet.refresh.swapped":
    "{amount} {unit} உறுதிசெய்யப்பட்டுப் புதிய சான்றுகளுடன் பரிமாறப்பட்டது.",
  "wallet.refresh.secured":
    "{amount} {unit} இப்போது உங்கள் மீட்புச் சொற்றொடரால் உள்ளடக்கப்படுகிறது.",
  "wallet.refresh.all_confirmed":
    "இங்குள்ள அனைத்தும் ஏற்கெனவே நாணயச்சாலையால் உறுதிசெய்யப்பட்டிருந்தன.",
  "wallet.pending.title": "நிலுவையில் உள்ளவை",
  "wallet.pending.reserved_desc":
    "உருவாக்கப்பட்டு ஒதுக்கப்பட்டது, சென்றடைந்தது உறுதிசெய்யப்படவில்லை. இருமுறை செலவழிக்கப்படாமல் இருக்கச் சான்றுகள் உங்கள் இருப்புக்கு வெளியே வைக்கப்படுகின்றன.",
  "wallet.pending.locked_desc":
    "ஏற்கெனவே பெறுநரின் சாவியுடன் பூட்டப்பட்டுள்ளது, எனவே அவர் மட்டுமே செலவழிக்க முடியும். அது இன்னும் அவரைச் சென்றடையவில்லை, அவ்வளவே. முடிக்க டோக்கனைப் பகிருங்கள்.",
  "wallet.pending.show_qr": "இந்த டோக்கனை QR குறியீடாகக் காட்டு",
  "wallet.pending.copy_again": "டோக்கனை மீண்டும் நகலெடு",
  "wallet.pending.share_again": "டோக்கனை மீண்டும் பகிர்",
  "wallet.pending.mark_delivered": "இந்த டோக்கனைச் சென்றடைந்தது எனக் குறி",
  "wallet.pending.delivered": "சென்றடைந்தது",
  "wallet.pending.reclaim_into": "இந்த டோக்கனை உங்கள் இருப்புக்கு மீட்டெடு",
  "wallet.activity.title": "செயல்பாடு",
  "wallet.activity.none": "இன்னும் எதுவும் இல்லை",
  "wallet.activity.none_desc":
    "நீங்கள் அனுப்பும், பெறும் பணப்பரிமாற்றங்கள் இங்கே தோன்றும், புதியவை முதலில், ஒவ்வொன்றின் நாணயச்சாலையும் கட்டணமும் சேர்த்து.",
  "wallet.activity.show_fewer": "குறைவான பணப்பரிமாற்றங்களைக் காட்டு",
  "wallet.activity.show_less": "குறைவாகக் காட்டு",
  "wallet.activity.received_unconfirmed": "பெறப்பட்டது, உறுதிசெய்யப்படவில்லை",
  "wallet.activity.received": "பெறப்பட்டது",
  "wallet.activity.receive_failed": "பெறுவது தோல்வி",
  "wallet.activity.reclaimed": "மீட்கப்பட்டது",
  "wallet.activity.send_failed": "அனுப்புவது தோல்வி",
  "wallet.activity.sent": "அனுப்பப்பட்டது",
  "wallet.activity.status_pending": "நிலுவையில்",
  "wallet.activity.status_failed": "தோல்வி",
  "wallet.activity.status_reclaimed": "மீட்கப்பட்டது",
  "wallet.activity.status_expired": "காலாவதி",
  "wallet.activity.ln_deposit": "Lightning செலுத்துதல்",
  "wallet.activity.ln_withdrawal": "Lightning எடுத்தல்",
  "wallet.activity.nutzap_received": "nutzap பெறப்பட்டது",
  "wallet.activity.spent_removed": "செலவழிக்கப்பட்ட சான்றுகள் அகற்றப்பட்டன",
  "wallet.activity.refreshed": "சான்றுகள் புதுப்பிக்கப்பட்டன",
  "wallet.activity.refreshing": "சான்றுகள் புதுப்பிக்கப்படுகின்றன",
  "wallet.activity.just_now": "இப்போதுதான்",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "மெஷ் ஆஃப்லைன்",
  "wallet.mesh_offline_body":
    "மெஷ் சேவை இயங்கவில்லை, எனவே டோக்கனை ஒப்படைக்க யாரும் இல்லை. இது நிலுவையில் உள்ளவை பகுதியில் ஒதுக்கப்பட்டே இருக்கும்.",
  "wallet.xfer.route_mesh":
    "மெஷ் வழியாக நேரடியாக அவர்களின் சாதனத்திடம் ஒப்படைக்கப்பட்டது.",
  "wallet.xfer.route_nostr":
    "அவர்கள் புளூடூத் வரம்புக்கு வெளியே இருந்தார்கள், எனவே இது இணையம் வழியாகச் சென்றது.",
  "wallet.xfer.route_courier":
    "இப்போது அவர்களை அடைய வழி இல்லை. மற்ற சாதனங்கள் இதைச் சுமந்து செல்லும், ஏதேனும் ஒன்று அவர்களை அடையும்போது சேர்ப்பிக்கும்.",
  "wallet.xfer.route_queued":
    "அவர்களை இன்னும் அடைய முடியவில்லை. இது வரிசையில் உள்ளது, அடையக்கூடியதும் புறப்படும்.",
  "wallet.xfer.mesh_offline_body":
    "மெஷ் சேவை இயங்கவில்லை, எனவே டோக்கனை ஒப்படைக்க வழி இல்லை. எதுவும் கழிக்கப்படவில்லை.",
  "wallet.xfer.could_not_send": "அனுப்ப முடியவில்லை",
  "wallet.xfer.inexact_body":
    "உங்கள் சான்றுகளால் ஆஃப்லைனில் சரியாக {amount} {unit} ஆக்க முடியாது. நீங்கள் உருவாக்கக்கூடிய மிகச் சிறிய டோக்கன் {spend} {unit}, கூடுதல் {extra} {unit} திரும்பப்பெற வழியின்றி அவர்களிடமே சென்றுவிடும்.\n\nஆன்லைனில் இருக்கும்போது நாணயச்சாலையில் புதுப்பித்தால், உங்கள் சான்றுகள் சரியாகப் பொருந்தும் பிரிவுகளாகப் பிரியும்.",
  "wallet.xfer.send_amount": "{amount} அனுப்பு",
  "wallet.xfer.mesh_offline": "மெஷ் ஆஃப்லைன்",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "அவர்களின் சாவியுடன் பூட்டப்பட்டு Nostr இல் வெளியிடப்பட்டது. அவர்கள் ஆன்லைனில் இருந்தாலும் இல்லாவிட்டாலும் இது அவர்களுடையது.",
  "wallet.pay.rail_nutzap_dm":
    "அவர்களின் சாவியுடன் பூட்டப்பட்டது. ரிலே அதை ஏற்கவில்லை, எனவே இது அவர்களுக்குச் செய்தியாகச் சென்றது.",
  "wallet.pay.rail_nutzap_undelivered":
    "அவர்களின் சாவியுடன் பூட்டப்பட்டது, ஆனால் இதை இன்னும் எதுவும் சுமந்து செல்ல முடியவில்லை. இது வரிசையில் உள்ளது, டோக்கன் நிலுவையில் உள்ளவை பகுதியில் இருக்கிறது.",
  "wallet.pay.final":
    "பூட்டப்பட்ட பணப்பரிமாற்றங்களை மீட்க முடியாது: இப்போது இந்த நாணயங்களை அவர்களின் சாவியால் மட்டுமே செலவழிக்க முடியும்.",
  "wallet.pay.reclaimable":
    "இது சென்றடைந்ததாக நீங்கள் உறுதிசெய்யும் வரை பணப்பை தாவலிலிருந்து மீட்கக்கூடியதாக இருக்கும்.",
  "wallet.pay.why": "{reason} என்பதால் இந்த வழியில் அனுப்பப்பட்டது.",
  "wallet.pay.sent_title": "{name} க்கு {amount} {unit}",
  "wallet.pay.thread_receipt":
    "நீங்கள் {amount} {unit} அனுப்பினீர்கள், அவர்களின் சாவியுடன் பூட்டப்பட்டது.",
  "wallet.pay.title": "ecash அனுப்பு",
  "wallet.pay.to": "{name} க்கு",
  "wallet.pay.amount": "sat இல் தொகை",
  "wallet.pay.memo": "குறிப்பு (விருப்பம், பொதுவானது)",
  "wallet.pay.send": "அனுப்பு",
  "wallet.pay.sending": "அனுப்புகிறது…",
  "wallet.pay.action": "ecash அனுப்பு",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "கேமரா அணுகல்",
  "wallet.scan.camera_purpose": "ecash QR குறியீட்டை ஸ்கேன் செய்ய",
  "wallet.scan.photo_label": "புகைப்பட அணுகல்",
  "wallet.scan.photo_purpose": "ஒரு படத்திலிருந்து ecash QR ஐப் படிக்க",
  "wallet.scan.no_token":
    "அந்தப் படத்தில் ecash டோக்கன் எதுவும் கிடைக்கவில்லை.",
  "wallet.scan.no_invoice":
    "அந்தப் படத்தில் Lightning பட்டியல் எதுவும் கிடைக்கவில்லை.",
  "wallet.scan.unreadable": "அந்தப் படத்தைப் படிக்க முடியவில்லை.",
  "wallet.scan.camera_failed":
    "கேமராவைத் தொடங்க முடியவில்லை. மற்ற கேமரா செயலிகளை மூடிவிட்டு மீண்டும் முயலுங்கள்.",
  "wallet.scan.close": "ஸ்கேனரை மூடு",
  "wallet.scan.on_device":
    "இது இந்தச் சாதனத்திலேயே படிக்கப்படுகிறது; எதுவும் எங்கும் அனுப்பப்படுவதில்லை.",
  "wallet.scan.aim_token": "ஒரு ecash QR குறியீட்டில் காட்டுங்கள்.",
  "wallet.scan.aim_invoice":
    "ஒரு Lightning பட்டியலின் QR குறியீட்டில் காட்டுங்கள்.",
  "wallet.scan.title_token": "ecash ஸ்கேன்",
  "wallet.scan.title_invoice": "பட்டியல் ஸ்கேன்",
  "wallet.scan.desc_token":
    "வேறொரு பணப்பையிலிருந்து Cashu டோக்கனைப் படியுங்கள். Airhop மட்டுமல்ல, எந்த Cashu பணப்பையுடனும் இது வேலை செய்யும்.",
  "wallet.scan.desc_invoice":
    "உங்கள் இருப்பிலிருந்து செலுத்த ஒரு Lightning பட்டியலைப் படியுங்கள்.",
  "wallet.scan.use_camera_a11y": "கேமராவால் ஸ்கேன் செய்",
  "wallet.scan.use_camera": "கேமராவைப் பயன்படுத்து",
  "wallet.scan.pick_image_a11y": "சேமித்த படத்திலிருந்து QR குறியீட்டைப் படி",
  "wallet.scan.pick_image": "புகைப்படங்களிலிருந்து தேர்ந்தெடு",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu என்றால் என்ன?",
  "wallet.explain.intro":
    "Cashu என்பது Bitcoin க்கான ecash. டோக்கன் என்பது அதை வைத்திருப்பவருக்குப் பணமதிப்புள்ள ஒரு சரம், யார் எதைச் செலவழித்தார் என நாணயச்சாலைக்குத் தெரியாதவாறு அது கண்மூடிக் கையொப்பமிடப்படுகிறது. கணக்குகள் இல்லை, உள்நுழைவு இல்லை.",
  "wallet.explain.send": "அனுப்பு",
  "wallet.explain.send_desc":
    "ஒரு தொகையை, புளூடூத் வழியாக அருகிலுள்ள பியரிடம் கொடுக்கக்கூடிய அல்லது உரையாகப் பகிரக்கூடிய டோக்கனாக மாற்றுகிறது. இணையம் இல்லாமல் வேலை செய்யும். சென்றடைந்தது என உறுதிசெய்யும் வரை சான்றுகள் ஒதுக்கப்பட்டே இருக்கும்.",
  "wallet.explain.receive": "பெறு",
  "wallet.explain.receive_desc":
    "ஒரு டோக்கனைச் சேர்க்க அதை ஒட்டுங்கள். ஆன்லைனில் அது உடனே நாணயச்சாலையில் பரிமாறப்படும், அது நிரூபிக்கக்கூடிய வகையில் உங்களுடையதாக ஆகும். ஆஃப்லைனில் சேமிக்கப்பட்டு, நீங்கள் புதுப்பிக்கும் வரை உறுதிசெய்யப்படாதது எனக் குறிக்கப்படும்.",
  "wallet.explain.zap": "zap",
  "wallet.explain.zap_desc":
    "ஒரு Nostr அடையாளத்துக்குப் பணம் செலுத்துகிறது. அவர்கள் NIP-61 nutzap தகவலை வெளியிட்டால், ecash அவர்களின் சாவியுடன் பூட்டப்படும், எனவே அவர்கள் மட்டுமே செலவழிக்க முடியும். இல்லையெனில் இது குறியாக்கம் செய்யப்பட்ட நேரடிச் செய்திக்குத் திரும்பும். இணையம் தேவை.",
  "wallet.explain.add_mint": "நாணயச்சாலை சேர்",
  "wallet.explain.add_mint_desc":
    "உங்கள் ecash ஐ வழங்கி மீட்கும் நாணயச்சாலையைச் சேமிக்கிறது, அதன் பொதுச் சாவிகளையும் வைத்திருக்கிறது, அதனால் அதன் டோக்கன்களை ஆஃப்லைனில் சரிபார்க்க முடியும். அங்கு வைக்கும் இருப்பை நம்பி ஒப்படைக்கக்கூடிய நாணயச்சாலையைத் தேர்ந்தெடுங்கள்.",
  "wallet.explain.phrase": "மீட்புச் சொற்றொடர்",
  "wallet.explain.phrase_desc":
    "பணப்பை தொடக்கத்தில் உருவாக்கும் பன்னிரண்டு சொற்களிலிருந்தே உங்கள் நாணயங்கள் பெறப்படுகின்றன, எனவே ஒரு புதிய தொலைபேசி, எந்த நாணயங்களில் கையொப்பமிட்டீர்கள் என உங்கள் நாணயச்சாலைகளிடம் கேட்டு இருப்பை மீண்டும் கட்ட முடியும். அவற்றைப் பார்த்து எழுதி வைக்கும் வரை அவை இந்தத் தொலைபேசியில் மட்டுமே இருக்கும்.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "பணப்பை பூட்டப்பட்டுள்ளது",
  "wallet.err.mint_unreachable": "நாணயச்சாலையை அடைய முடியவில்லை",
  "wallet.err.tor_blocked": "Tor இயக்கத்தில் இருக்கும்போது தடுக்கப்பட்டது",
  "wallet.err.insufficient": "இருப்பு போதவில்லை",
  "wallet.err.exact_amount": "சரியாக அந்தத் தொகையை அனுப்ப முடியாது",
  "wallet.err.no_mint": "நாணயச்சாலை இல்லை",
  "wallet.err.mint_unsupported": "நாணயச்சாலையால் அதைச் செய்ய முடியாது",
  "wallet.err.mint_refused": "நாணயச்சாலை மறுத்தது",
  "wallet.err.unreadable": "படிக்க முடியாத டோக்கன்",
  "wallet.err.rejected": "டோக்கன் நிராகரிக்கப்பட்டது",
  "wallet.err.already_spent": "ஏற்கெனவே செலவழிக்கப்பட்டது",
  "wallet.err.change_pending": "செலுத்தப்பட்டது, மீதி நிலுவையில்",
  "wallet.svc.mint_unreachable": "நாணயச்சாலையை அடைய முடியவில்லை.",
  "wallet.svc.tor_ios":
    "iOS இல் நாணயச்சாலைக் கோரிக்கைகள் Tor வழியாகச் செல்வதில்லை.",
  "wallet.svc.tor_ios_body":
    "Arti, Nostr WebSocket களை மட்டுமே மூடுகிறது, எனவே இந்தக் கோரிக்கை திறந்த வலை வழியாக நாணயச்சாலையை அடைந்து உங்கள் IP ஐ இந்தச் சான்றுகளுடன் இணைக்கும். அமைப்புகள் > பாதுகாப்பின் கீழ் அதை அனுமதியுங்கள், அல்லது முதலில் Tor ஐ முடக்குங்கள். மெஷ் வழியாக ecash அனுப்புவதும் பெறுவதும் தொடர்ந்து இயங்கும்.",
  "wallet.svc.keys_uncached":
    "இந்த நாணயச்சாலையின் சாவிகள் இந்தச் சாதனத்தில் சேமிக்கப்படவில்லை.",
  "wallet.svc.keys_uncached_body":
    "அவற்றைப் பெற ஆன்லைனில் இருக்கும்போது பணப்பையை ஒருமுறை திறங்கள்.",
  "wallet.svc.phrase_invalid": "அந்த மீட்புச் சொற்றொடர் செல்லாதது.",
  "wallet.svc.phrase_invalid_body":
    "தவறாகத் தட்டச்சு செய்யப்பட்ட அல்லது விடுபட்ட சொல்லைத் தேடுங்கள். சொற்றொடருக்குள்ளேயே ஒரு சரிபார்ப்புத் தொகை உள்ளது, எனவே ஒரே ஒரு தவறான சொல் முழுவதையும் செல்லாததாக்கிவிடும்.",
  "wallet.svc.need_mint": "முதலில் குறைந்தது ஒரு நாணயச்சாலையையாவது சேருங்கள்.",
  "wallet.svc.need_mint_body":
    "உங்களுக்காக எந்த நாணயங்களில் கையொப்பமிட்டது என நாணயச்சாலையிடம் கேட்பதன் மூலமே மீட்பு வேலை செய்கிறது, எனவே எந்த நாணயச்சாலையிடம் கேட்பது என்பது தெரிய வேண்டும்.",
  "wallet.svc.restored": "மீட்புச் சொற்றொடரிலிருந்து மீட்கப்பட்டது",
  "wallet.svc.storage_locked": "பணப்பைச் சேமிப்பு பூட்டப்பட்டுள்ளது.",
  "wallet.svc.storage_locked_body":
    "Airhop, ecash சான்றுகளை ஒரு குறியாக்கக் கோப்பில் வைக்கிறது, அதன் சாவி சாதனத்தின் சாவிக்கொத்தில் இருக்கிறது. சாதனத்தைத் திறந்து செயலியை மீண்டும் திறங்கள்.",
  "wallet.svc.bad_url": "அது செல்லுபடியாகும் URL அல்ல.",
  "wallet.svc.needs_https":
    "நாணயச்சாலையின் URL https:// என்று தொடங்க வேண்டும்.",
  "wallet.svc.refuse_http":
    "சாதாரண http வழியாக நாணயச்சாலையைப் பயன்படுத்த மறுக்கிறோம்.",
  "wallet.svc.refuse_http_body":
    "வலைப்பாதையில் உள்ள யாரும் உங்கள் சான்றுகளைப் படிக்கவோ மாற்றவோ முடியும். https:// உள்ள நாணயச்சாலையைப் பயன்படுத்துங்கள்.",
  "wallet.svc.mint_not_saved": "நாணயச்சாலையைச் சேமிக்க முடியவில்லை.",
  "wallet.svc.unreadable_token": "அது படிக்கக்கூடிய Cashu டோக்கன் அல்ல.",
  "wallet.svc.unreadable_token_body":
    "டோக்கன்கள் cashuA அல்லது cashuB என்று தொடங்கும். நகலெடுக்கும்போது எதுவும் துண்டிக்கப்படவில்லை என்பதைச் சரிபாருங்கள்.",
  "wallet.svc.wrong_mint":
    "இந்த டோக்கன், அது குறிப்பிடும் நாணயச்சாலையால் கையொப்பமிடப்படவில்லை.",
  "wallet.svc.already_spent":
    "இந்தச் சான்றுகள் ஏற்கெனவே செலவழிக்கப்பட்டுவிட்டன.",
  "wallet.svc.already_spent_body":
    "இந்த டோக்கனை அனுப்பியவர் அதை முதலில் மீட்டுவிட்டார், அல்லது அதே டோக்கனை வேறு யாருக்கோ அனுப்பியிருக்கிறார்.",
  "wallet.svc.receiving_offline": "ஆஃப்லைனில் பெறுதல்",
  "wallet.svc.amount_positive": "பூஜ்ஜியத்தைவிடப் பெரிய தொகையை உள்ளிடுங்கள்.",
  "wallet.svc.coins_raced":
    "அந்த நாணயங்களை இப்போதுதான் வேறொரு பணப்பரிமாற்றம் பயன்படுத்திவிட்டது.",
  "wallet.svc.coins_raced_body":
    "எதுவும் கழிக்கப்படவில்லை. மீண்டும் முயலுங்கள், பணப்பை வேறு தொகுப்பைத் தேர்ந்தெடுக்கும்.",
  "wallet.svc.no_ecash": "இன்னும் ecash இல்லை.",
  "wallet.svc.no_ecash_body":
    "ஒரு நாணயச்சாலையைச் சேர்த்து Lightning வழியாகச் செலுத்துங்கள், அல்லது ஒருவரிடமிருந்து டோக்கனைப் பெறுங்கள்.",
  "wallet.svc.split_across_mints":
    "உங்கள் இருப்பு பல நாணயச்சாலைகளில் பிரிந்துள்ளது.",
  "wallet.svc.mint_says_spent":
    "இந்தச் சான்றுகள் ஏற்கெனவே செலவழிக்கப்பட்டதாக நாணயச்சாலை தெரிவித்தது.",
  "wallet.svc.issue_against_invoice":
    "ஒரு Lightning பட்டியலுக்கு எதிராக ecash வழங்க",
  "wallet.svc.pay_invoice": "ஒரு Lightning பட்டியலைச் செலுத்த",
  "wallet.svc.unknown_deposit": "தெரியாத செலுத்துதல்.",
  "wallet.svc.invoice_expired_before":
    "செலுத்தப்படுவதற்கு முன்பே பட்டியலின் காலம் முடிந்தது.",
  "wallet.svc.invoice_expired": "அந்தப் பட்டியலின் காலம் முடிந்தது.",
  "wallet.svc.invoice_unpaid": "பட்டியல் இன்னும் செலுத்தப்படவில்லை.",
  "wallet.svc.payment_unknown":
    "பணப்பரிமாற்ற நிலை தெரியவில்லை; அடுத்த புதுப்பிப்பில் மீண்டும் சரிபார்க்கப்படும்.",
  "wallet.svc.melt_change_pending": "உங்கள் பட்டியல் செலுத்தப்பட்டது.",
  "wallet.svc.melt_change_pending_body":
    "பயன்படுத்தப்படாத திசைவழிக் கட்டணத்தை நாணயச்சாலை இன்னும் திருப்பித் தரவில்லை. அடுத்த புதுப்பிப்பில் அது தானாகவே பெறப்படும், இடையில் எதுவும் இழக்கப்படாது.",
  "wallet.svc.mint_did_not_pay":
    "நாணயச்சாலை இந்தப் பட்டியலைச் செலுத்தவில்லை. உங்கள் இருப்பு மாறவில்லை.",
  "wallet.svc.not_an_invoice": "அது Lightning பட்டியல் அல்ல.",
  "wallet.svc.not_an_invoice_body":
    "lnbc என்று தொடங்கும் bolt11 பட்டியலை ஒட்டுங்கள்.",
  "wallet.svc.insufficient_for_invoice":
    "இந்தப் பட்டியலுக்கு இருப்பு போதவில்லை.",
  "wallet.svc.coins_raced_invoice_body":
    "எதுவும் கழிக்கப்படவில்லை, பட்டியலும் செலுத்தப்படவில்லை. மீண்டும் முயலுங்கள்.",
  "wallet.svc.same_mint": "வேறு சேருமிட நாணயச்சாலையைத் தேர்ந்தெடுங்கள்.",
  "wallet.svc.same_mint_body":
    "மூலமும் சேருமிடமும் ஒரே நாணயச்சாலை, எனவே நகர்த்த எதுவும் இல்லை.",
  "wallet.svc.quote_failed_retried":
    "மதிப்பீடு தோல்வி, ஒன்றிணைப்பு மீண்டும் முயலப்பட்டது",
  "wallet.svc.amount_unfit_retried":
    "தொகை பொருந்தவில்லை, ஒன்றிணைப்பு மீண்டும் முயலப்பட்டது",
  "wallet.svc.cannot_size": "இந்த மாற்றத்தின் அளவைத் தீர்மானிக்க முடியவில்லை.",
  "wallet.svc.insufficient_at_mint": "{mint} இல் இருப்பு போதவில்லை.",
  "wallet.svc.inexact_title":
    "உங்கள் சான்றுகளால் ஆஃப்லைனில் சரியாக {amount} {unit} ஆக்க முடியாது.",
  "wallet.svc.inexact_detail":
    "நீங்கள் அனுப்பக்கூடிய மிகச் சிறிய டோக்கன் {spend} {unit}. ஆஃப்லைனில் மீதி இல்லை, எனவே கூடுதல் {extra} {unit} பெறுநருக்கே செல்லும்.",
  "wallet.svc.no_single_mint":
    "எந்த ஒரு நாணயச்சாலையிலும் {amount} {unit} இல்லை. வெவ்வேறு நாணயச்சாலைகளின் ecash ஐ ஒரே டோக்கனாக இணைக்க முடியாது: முதலில் ஒரே நாணயச்சாலையில் ஒன்றிணையுங்கள், அல்லது தனித்தனித் தொகைகளாக அனுப்புங்கள்.",
  "wallet.svc.have_tried_send":
    "உங்களிடம் {total} {unit} உள்ளது, நீங்கள் {amount} அனுப்ப முயன்றீர்கள்.",
  "wallet.svc.invoice_needs":
    "இந்தப் பட்டியலுக்குத் திசைவழி ஒதுக்கீடு உட்பட {total} {unit} தேவை, உங்களிடம் {balance} உள்ளது.",
  "wallet.svc.nothing_to_move": "{mint} இடம் நகர்த்த {unit} இல்லை.",
  "wallet.svc.consolidate_memo": "{mint} இடமிருந்து ஒன்றிணைப்பு",
  "wallet.svc.cannot_size_detail":
    "Lightning திசைவழிக் கட்டணங்களுக்குப் பிறகு {from} ஆல் {to} க்குப் பயனுள்ள தொகையை நகர்த்த முடியாது. மாறாகக் குறிப்பிட்ட சிறிய தொகையை நகர்த்திப் பாருங்கள்.",
  "wallet.svc.mint_cannot": "{mint} ஆல் {action} முடியாது.",
  "wallet.svc.no_nut": "நாணயச்சாலை NUT-{nut} ஐ அறிவிக்கவில்லை.",
  "wallet.svc.unknown_mint":
    "அந்தப் பணப்பரிமாற்றம் நீங்கள் பயன்படுத்தாத நாணயச்சாலையைக் குறிப்பிடுகிறது.",
  "wallet.svc.unknown_mint_body":
    "நம்பினால் நாணயச்சாலையை நீங்களே சேருங்கள்; நீங்கள் தேர்ந்தெடுக்காத நாணயச்சாலையிலிருந்து எதுவும் மீட்கப்படுவதில்லை.",
  "wallet.svc.no_relay": "ரிலே இணைப்பு இல்லை",
  "wallet.svc.no_shared_mint": "போதுமான இருப்புள்ள பொதுவான நாணயச்சாலை இல்லை",
  "wallet.svc.no_nutzap_info":
    "பெறுநர் nutzap தகவலை வெளியிடவில்லை (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "அவர்களின் சாவியுடன் பூட்டப்பட்டது ஆனால் இன்னும் சேர்ப்பிக்கப்படவில்லை. இதை முடிக்க இந்தப் பரிவர்த்தனையின் டோக்கனைப் பகிருங்கள்.",
  "wallet.svc.swap_lost":
    "நாணயச்சாலை இந்தப் பரிமாற்றத்தை ஒருபோதும் முடிக்கவில்லை, எனவே அதற்கு எதிராக எதுவும் வழங்கப்படவில்லை.",
  "wallet.svc.swap_unreadable":
    "இந்தப் பரிமாற்றம், இந்தப் பதிப்பால் மீண்டும் இயக்க முடியாத வடிவத்தில் சேமிக்கப்பட்டுள்ளது.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR வழியாகச் சரிபார்க்கப்பட்டது",
  "contacts.qr.keys_unverified": "சாவிகள் பெறப்பட்டன, சரிபார்க்கப்படவில்லை",
  "contacts.qr.not_verified": "இன்னும் சரிபார்க்கப்படவில்லை",
  "contacts.qr.message": "செய்தி",
  "contacts.qr.add": "தொடர்பைச் சேர்",
  "contacts.qr.scan_title": "QR குறியீட்டை ஸ்கேன் செய்",
  "contacts.qr.aim": "உங்கள் கேமராவை அவர்களின் QR குறியீட்டில் காட்டுங்கள்",
  "contacts.qr.add_desc": "மெஷில் அருகில் இல்லாத ஒருவரை அடையுங்கள்.",
  "contacts.qr.peer_id_hint":
    "பியர் அடையாளம் 16 எழுத்துகள். தொடர்புக் குறியீடு airhop: என்று தொடங்குகிறது.",
  "contacts.qr.or_scan": "அல்லது அவர்களின் QR ஐ ஸ்கேன் செய்யுங்கள்",
  "contacts.qr.trust_note":
    "நீங்கள் கேமராவால் ஸ்கேன் செய்யும் QR மட்டுமே அவர்களின் சாவியைச் சரிபார்க்கிறது. ஒட்டப்பட்ட குறியீடு அவர்களின் சாவிகளைச் சுமக்கிறது, ஆனால் அது அவர்களிடமிருந்தே வந்ததற்கான சான்றை அல்ல.",
  "contacts.qr.peer_id": "பியர் அடையாளம் அல்லது தொடர்புக் குறியீடு",
  "contacts.qr.peer_id_placeholder":
    "ஓர் அடையாளத்தையோ தொடர்புக் குறியீட்டையோ ஒட்டுங்கள்",
  "contacts.qr.scan_camera_a11y": "கேமராவால் QR குறியீட்டை ஸ்கேன் செய்",
  "contacts.qr.scan_camera_desc": "உங்கள் கேமராவைப் பயன்படுத்துங்கள்",
  "contacts.qr.upload_a11y": "தொகுப்பிலிருந்து QR படத்தைப் பதிவேற்று",
  "contacts.qr.upload": "தொகுப்பிலிருந்து பதிவேற்று",
  "contacts.qr.upload_desc": "சேமித்த QR படத்தைத் தேர்ந்தெடுங்கள்",
  "contacts.qr.scan_a11y": "QR குறியீட்டை ஸ்கேன் செய்து தொடர்பைச் சேர்",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16 எழுத்துப் பியர் அடையாளம், airhop://peer/… இணைப்பு, அல்லது தொடர்புக் குறியீட்டை ஒட்டுங்கள்.",
  "contacts.scan.camera_label": "கேமரா அணுகல்",
  "contacts.scan.camera_purpose": "ஒரு தொடர்பின் QR குறியீட்டை ஸ்கேன் செய்ய",
  "contacts.scan.camera_needed":
    "ஸ்கேன் செய்யக் கேமரா அணுகல் தேவை. பியர் அடையாளம் வழியாக இன்னும் சேர்க்கலாம்.",
  "contacts.scan.camera_failed":
    "கேமராவைத் தொடங்க முடியவில்லை. மற்ற கேமரா செயலிகளை மூடிவிட்டு மீண்டும் முயலுங்கள்.",
  "contacts.scan.photo_label": "புகைப்பட அணுகல்",
  "contacts.scan.photo_purpose": "நீங்கள் சேமித்த QR குறியீட்டை ஸ்கேன் செய்ய",
  "contacts.scan.photo_needed":
    "படத்தைத் தேர்ந்தெடுக்கப் புகைப்பட அணுகல் தேவை. பியர் அடையாளம் வழியாக இன்னும் சேர்க்கலாம்.",
  "contacts.scan.no_qr":
    "அந்தப் படத்தில் Airhop இன் QR குறியீடு எதுவும் கிடைக்கவில்லை.",
  "contacts.scan.unreadable":
    "அந்தப் படத்திலிருந்து QR குறியீட்டைப் படிக்க முடியவில்லை.",
  "contacts.scan.bitchat_expired":
    "அந்த bitchat குறியீட்டின் காலம் முடிந்துவிட்டது. அவர்களின் QR ஐ மீண்டும் திறக்கச் சொல்லுங்கள்.",
  "contacts.scan.tampered":
    "இந்த QR குறியீடு செல்லாதது: அதன் பியர் அடையாளம் அதன் சாவிகளுடன் பொருந்தவில்லை. இதில் மாற்றம் செய்யப்பட்டிருக்கலாம்.",
  "contacts.scan.already_added": "ஏற்கெனவே உங்கள் தொடர்புகளில் உள்ளது",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "கேமரா அணுகலுக்குக் காத்திருக்கிறது…",
  "contacts.verify.camera_off": "கேமரா முடக்கத்தில் உள்ளது",
  "contacts.verify.open_settings": "அமைப்புகளைத் திற",
  "contacts.verify.verified": "சரிபார்க்கப்பட்டது",
  "contacts.verify.different": "வேறு தொடர்பு",
  "contacts.verify.scan_again": "மீண்டும் ஸ்கேன் செய்",
  "contacts.verify.failed": "சரிபார்க்க முடியவில்லை",
  "contacts.verify.done": "முடிந்தது",
  "contacts.verify.title": "{name} ஐச் சரிபார்",
  "contacts.verify.aim": "உங்கள் கேமராவை அவர்களின் QR குறியீட்டில் காட்டுங்கள்",
  "contacts.verify.camera_off_body":
    "QR வழியாகச் சரிபார்க்க அமைப்புகளில் கேமரா அணுகலை இயக்குங்கள்.",
  "contacts.verify.match_body":
    "{name} இன் சாவி பொருந்துகிறது. இந்தத் தொடர்பை நீங்கள் நம்பலாம்.",
  "contacts.verify.different_body":
    "இந்த QR வேறொருவருக்கு உரியது. {name} ஐத் தன் சொந்தக் குறியீட்டைக் காட்டச் சொல்லுங்கள்.",
  "contacts.verify.tampered_body":
    "இந்த QR மாற்றப்பட்டதுபோல் தெரிகிறது: அதன் அடையாளம் அதன் சாவியுடன் பொருந்தவில்லை.",
  "contacts.verify.choose_title": "எப்படிச் சரிபார்க்க விரும்புகிறீர்கள்?",
  "contacts.verify.choose_body":
    "இந்தத் தொலைபேசியில் உள்ள சாவிகள் உண்மையிலேயே {name} இனுடையவை என்பதை இரண்டுமே உறுதிப்படுத்தும்.",
  "contacts.verify.method_scan": "அவர்களின் குறியீட்டை ஸ்கேன் செய்",
  "contacts.verify.method_scan_sub": "அவர்கள் உங்களுடன் இங்கே இருக்கிறார்கள்",
  "contacts.verify.method_compare": "ஒரு குறியீட்டை ஒப்பிடு",
  "contacts.verify.method_compare_sub":
    "அழைப்பில் ஒருவருக்கொருவர் படித்துக் காட்டுங்கள்",
  "contacts.verify.no_keys":
    "இந்தத் தொடர்புக்கு இன்னும் சாவிகள் இல்லை. அவர்களுக்குச் செய்தி அனுப்புங்கள், அல்லது சந்திக்கும்போது அவர்களின் குறியீட்டை ஸ்கேன் செய்யுங்கள்.",
  "contacts.verify.compare_title":
    "இவற்றை ஒருவருக்கொருவர் படித்துக் காட்டுங்கள்",
  "contacts.verify.compare_body":
    "{name} க்கும் அதே ஆறு சொற்கள் தெரியும். அவை பொருந்தினால், சாவிகள் உண்மையானவை என்பது இருவருக்கும் தெரியும்.",
  "contacts.verify.codes_match": "இவை பொருந்துகின்றன",
  "contacts.verify.codes_differ": "இவை பொருந்தவில்லை",
  "contacts.verify.compared_body":
    "நீங்களும் {name} ம் அதே குறியீட்டை உறுதிப்படுத்தினீர்கள். இந்தத் தொடர்பு சரிபார்க்கப்பட்டது.",

  // ---- Settings: shared chrome ----
  "settings.back": "பின் செல்",
  "settings.coming_soon": "விரைவில் வருகிறது",
  "settings.opens_externally": "{label}, செயலிக்கு வெளியே திறக்கிறது",
  "settings.peer_id": "பியர் அடையாளம்",
  "settings.share_peer_id": "உங்கள் பியர் அடையாளத்தைப் பகிர்",
  "settings.share_id_short": "அடையாளத்தைப் பகிர்",
  "settings.peer_id_sheet.title": "உங்கள் பியர் அடையாளம்",
  "settings.peer_id_sheet.copy": "பியர் அடையாளத்தை நகலெடு",
  "settings.peer_id_sheet.note":
    "நீங்கள் இருவரும் புளூடூத் வரம்பில் இருக்கும்போது மட்டுமே இது வேலை செய்யும். எங்கிருந்தும் உங்களுக்குச் செய்தி அனுப்ப ஒருவரால் முடிய வேண்டுமெனில், அதற்குப் பதிலாக உங்கள் QR குறியீட்டைப் பகிருங்கள்.",
  "settings.search.placeholder": "அமைப்புகளில் தேடு…",
  "settings.search.a11y": "அமைப்புகளில் தேடு",
  "settings.search.close": "தேடலை மூடு",
  "settings.search.clear": "தேடலை அழி",
  "settings.search.hint":
    "எந்த அமைப்பையும் அதன் பெயரால் தேடுங்கள், அது எங்கிருந்தாலும்.",
  "settings.search.no_results": "”{query}“ க்கு பொருந்தும் அமைப்பு இல்லை",

  // ---- Settings: hub rows ----
  "settings.section.general": "பொது",
  "settings.section.general_desc":
    "விருப்பத் தேர்வு அம்சங்கள், அனுப்பியதைத் திரும்பப்பெறல், ஊடகம், மீட்டமைப்பு",
  "settings.section.privacy": "தனியுரிமையும் பாதுகாப்பும்",
  "settings.section.privacy_desc":
    "Forward secrecy, கையொப்பமிட்ட பொட்டலங்கள், தடுக்கப்பட்ட பியர்கள்",
  "settings.section.network": "வலையமைப்பும் ரிலேக்களும்",
  "settings.section.network_desc":
    "இணைய மாற்று, nostr ரிலேக்கள், bitchat உடன் இயைபு",
  "settings.section.permissions": "அனுமதிகள்",
  "settings.section.permissions_desc":
    "புளூடூத், இடம், அறிவிப்புகள், கேமரா, ஒலிவாங்கி",
  "settings.section.storage": "சேமிப்பும் தரவும்",
  "settings.section.diagnostics": "கண்டறிதல்",

  // ---- Settings: group headings ----
  "settings.group.transports": "கடத்திகள்",
  "settings.group.internet": "இணையம்",
  "settings.group.nearby": "அருகில்",
  "settings.group.sync": "ஒத்திசைவு",
  "settings.group.features": "அம்சங்கள்",
  "settings.group.messages": "செய்திகள்",
  "settings.group.local": "உள்ளூர்",
  "settings.group.media": "ஊடகம்",
  "settings.group.reset": "மீட்டமைப்பு",
  "settings.group.always_on": "எப்போதும் இயக்கத்தில்",
  "settings.group.notifications": "அறிவிப்புகள்",
  "settings.group.blocked": "தடுக்கப்பட்டவை",
  "settings.group.theme": "தீம்",
  "settings.group.font": "எழுத்துரு",
  "settings.group.language": "மொழி",
  "settings.section.diagnostics_desc":
    "இணைப்பு நிலையும் அருகிலுள்ள சாதனங்களும்",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "புளூடூத் இணைப்புகள்",
  "settings.diag.ble_links_desc":
    "இந்தத் தொலைபேசி நேரடியாக இணைந்திருக்கும் சாதனங்கள்",
  "settings.diag.lan": "உள்ளக நெட்வொர்க்",
  "settings.diag.lan_desc": "ஒரே Wi-Fi நெட்வொர்க்கில் உள்ள தொலைபேசிகள்",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "திசைவி இன்றி தொலைபேசியிலிருந்து தொலைபேசிக்கு",
  "settings.diag.wifi_active": "இயங்குகிறது",
  "settings.diag.wifi_unsupported": "இந்தச் சாதனத்தில் ஆதரிக்கப்படவில்லை",
  "settings.diag.wifi_permission": "ஓர் அனுமதியால் தடுக்கப்பட்டது",
  "settings.diag.wifi_unavailable": "இப்போது கிடைக்கவில்லை",
  "settings.diag.wifi_unpaired": "எதுவும் இணைக்கப்படவில்லை",
  "settings.diag.wifi_unknown": "வானொலிக்குக் காத்திருக்கிறது",
  "settings.diag.relays": "Nostr ரிலேக்கள்",
  "settings.diag.relays_desc":
    "இடச் சேனல்களுக்கும் இணைய அணுகலுக்கும் பயன்படுகின்றன",
  "settings.diag.connected": "இணைக்கப்பட்டது",
  "settings.diag.disconnected": "இணைக்கப்படவில்லை",
  "settings.diag.peer_direct": "நேரடி இணைப்பு",
  "settings.diag.peer_relayed": "மற்றொரு சாதனம் வழியாகக் கேட்கப்பட்டது",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "சமிக்ஞை அளவீடு இல்லை",
  "settings.diag.no_peers": "வரம்பில் யாரும் இல்லை",
  "settings.diag.no_peers_desc": "{links} வானொலி இணைப்புகள் திறந்துள்ளன",
  "settings.diag.gcs_size": "வடிகட்டி அளவு",
  "settings.diag.gcs_size_desc":
    "காற்றில் அனுப்பப்பட்ட மிகப்பெரிய ஒத்திசைவு வடிகட்டி",
  "settings.diag.fpr": "தவறான நேர்மறை விகிதம்",
  "settings.diag.fpr_desc":
    "நம்மிடம் இல்லாத பொட்டலம் இருப்பதாக வடிகட்டி எத்தனை முறை கூறுகிறது",
  "settings.diag.bytes": "{n} பைட்டுகள்",
  "settings.diag.footnote":
    "இங்கே எதையும் மாற்ற முடியாது. Airhop bitchat உடன் இயைந்திருக்கவே இந்த மதிப்புகள் நிலைநிறுத்தப்பட்டுள்ளன.",
  "settings.section.storage_desc": "பயன்பாடும் தற்காலிகச் சேமிப்பும்",
  "settings.section.appearance": "தோற்றம்",
  "settings.section.appearance_desc": "தீம், எழுத்துரு, மொழி",
  "settings.section.help": "உதவியும் கருத்தும்",
  "settings.section.help_desc":
    "எங்களைத் தொடர்புகொள்ளுங்கள், பிழையைத் தெரிவியுங்கள், அல்லது அடிக்கடி கேட்கப்படும் கேள்விகளைப் படியுங்கள்",
  "settings.section.support": "ஆதரவு",
  "settings.section.support_desc": "வளர்ச்சி தொடர உதவுங்கள்",
  "settings.section.about": "பற்றி",
  "settings.section.about_desc": "பதிப்பு, மாற்றப் பட்டியல், மூலக் குறியீடு",

  // ---- Settings: general ----
  "settings.general.undo": "அனுப்பியதைத் திரும்பப்பெறல்",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "பணப்பை",
  "settings.general.undo_seconds": "{count} விநாடிகள்",
  "settings.general.undo_a11y": "அனுப்பியதைத் திரும்பப்பெறல்: {value}",
  "settings.general.quality_a11y": "பதிவேற்றத் தரத்தை {value} ஆக அமை",
  "settings.general.undo_desc":
    "அனுப்பிய செய்தியைச் சிறிது நேரம் நிறுத்தி வைக்கிறது, வெளியே செல்வதற்கு முன் திரும்பப்பெற முடியும்",
  "settings.general.undo_off_desc": "உடனே அனுப்பு, திரும்பப்பெறல் இல்லை",
  "settings.general.undo_2": "2 விநாடிகள்",
  "settings.general.undo_2_desc": "திரும்பப்பெற ஒரு விரைவான வாய்ப்பு",
  "settings.general.undo_10": "10 விநாடிகள்",
  "settings.general.undo_10_desc": "மிக நீண்ட இடைவெளி",
  "settings.general.quality": "பதிவேற்றத் தரம்",
  "settings.general.quality_desc":
    "உங்கள் கேமரா அல்லது தொகுப்பிலிருந்து அனுப்பப்படும் புகைப்படங்களுக்குப் பொருந்தும். எப்படியிருந்தாலும் ஒவ்வொரு புகைப்படமும் மெஷுக்கு ஏற்ப அமைக்கப்படும்.",
  "settings.general.quality_low": "குறைவு",
  "settings.general.quality_low_desc":
    "மிகச் சிறிய புகைப்படங்கள், அனுப்ப மிக விரைவானவை",
  "settings.general.quality_medium": "நடுத்தரம்",
  "settings.general.quality_medium_desc": "விவரமும் வேகமும் சமநிலையில்",
  "settings.general.quality_high": "அதிகம்",
  "settings.general.quality_high_desc": "மிக அதிக விவரத்தைத் தக்கவைக்கிறது",
  "settings.general.feature_wallet_desc":
    "மெஷ் வழியாகப் பியரிடமிருந்து பியருக்கு Cashu ecash அனுப்புங்கள்",
  "settings.general.feature_wallet_a11y": "பணப்பை (எப்போதும் இயக்கத்தில்)",
  "settings.general.feature_ai_desc":
    "சாதனத்திலேயே இயங்கும் தனிப்பட்ட உதவியாளர், வலையமைப்பு அழைப்புகள் இல்லை",
  "settings.general.feature_feeds": "ஊட்டங்கள்",
  "settings.general.feature_feeds_desc":
    "Bluesky, Mastodon ஊட்டங்களைப் படித்து அவற்றில் இடுங்கள்",
  "settings.general.show_media": "ஊடகத்தைத் தானாகக் காட்டு",
  "settings.general.show_media_desc":
    "புகைப்படங்களும் வீடியோக்களும் அரட்டையிலேயே தோன்றும், அல்லது ஒரு தட்டலுக்குப் பின் இருக்கும்",
  "settings.general.reset": "அமைப்புகளை மீட்டமை",
  "settings.general.media_retention": "ஊடகத்தை இத்தனை நாள் வைத்திரு",
  "settings.general.media_retention_desc":
    "தேர்ந்தெடுத்த நேரத்துக்குப் பிறகு புகைப்படங்கள், வீடியோக்கள், குரல் குறிப்புகள் நீக்கப்படும்",
  "settings.general.media_retention_sheet":
    "ஊடகம் இந்தச் சாதனத்தில் எத்தனை நாள் இருக்க வேண்டும் என்பதைத் தேர்ந்தெடுங்கள். நீக்கப்பட்ட ஊடகத்தை மீட்க முடியாது.",
  "settings.general.retention_7_desc":
    "மிகக் குறைவான தடம் மிஞ்சும். தொலைபேசியே ஆபத்து எனில் சிறந்தது.",
  "settings.general.retention_14_desc":
    "சமிக்ஞை இல்லாத ஓரிரு வாரங்களுக்கு நடுவழி.",
  "settings.general.retention_30_desc":
    "உரையாடல்களை மிக நீண்ட நாள் படிக்கக்கூடியதாக வைக்கும், வட்டில் மிக அதிக இடத்தையும் எடுக்கும்.",
  "settings.general.reset_desc":
    "உங்கள் அடையாளம், செய்திகள், தொடர்புகள், பணப்பை ஆகியவற்றைத் தொடாமல், ஒவ்வொரு விருப்பத்தையும் அதன் இயல்பு நிலைக்குத் திருப்புகிறது",
  "settings.general.reset_title": "அமைப்புகளை மீட்டமைக்கவா?",
  "settings.general.reset_body":
    "ஒவ்வொரு விருப்பமும் இயல்பு நிலைக்குத் திரும்பும்: தோற்றம், அனுப்பியதைத் திரும்பப்பெறல், இணைப்பு (இணையம், Tor, நுழைவாயில், பாலம், ரிலேக்கள்). உங்கள் அடையாளம், செய்திகள், தொடர்புகள், பணப்பை ஆகியவை தொடப்படாமல் இருக்கும்.",
  "settings.general.reset_confirm": "மீட்டமை",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "முன்னோக்கு ரகசியத்தன்மை",
  "settings.security.forward_secrecy_desc":
    "நேரடிச் செய்திகளுக்கு Double Ratchet எப்போதும் இயக்கத்தில் இருக்கும்",
  "settings.security.signed_packets": "கையொப்பமிட்ட பொட்டலங்கள்",
  "settings.security.signed_packets_desc":
    "ஒவ்வொரு பொட்டலமும் Ed25519 ஆல் கையொப்பமிடப்படுகிறது",
  "settings.security.hide_previews": "அறிவிப்பு முன்னோட்டங்களை மறை",
  "settings.security.hide_previews_desc":
    "அனுப்புநரையும் செய்தியையும் உங்கள் பூட்டுத் திரையிலிருந்து விலக்கி வைக்கிறது, அது திறக்காமலேயே அவற்றைக் காட்டிவிடும்",
  "settings.security.no_blocked": "தடுக்கப்பட்ட பியர்கள் இல்லை",
  "settings.security.no_blocked_desc":
    "தடுக்கப்பட்ட பியர்கள் உங்களுக்குச் செய்தி அனுப்பவோ மெஷ் தாவலில் தோன்றவோ முடியாது",
  "settings.security.unblock_title": "இந்தப் பியரின் தடையை நீக்கு",
  "settings.security.unblock": "தடையை நீக்கு",
  "settings.security.unblock_peer": "{name} இன் தடையை நீக்கு",
  "settings.security.unblock_body":
    "{name} மீண்டும் உங்களுக்குச் செய்தி அனுப்ப முடியும், அருகில் இருக்கும்போது மெஷ் தாவலில் மீண்டும் தோன்றுவார்.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "இணைய மாற்று",
  "settings.network.internet_desc":
    "மெஷ் பியர்கள் வரம்புக்கு வெளியே இருக்கும்போது Nostr ரிலேக்கள் வழியாகத் தொடருங்கள்",
  "settings.network.internet_off_title": "இணையத்தை முடக்கவா?",
  "settings.network.internet_off_body":
    "Airhop புளூடூத்தில் மட்டும் இயங்கும். எந்த Nostr ரிலேயையும் தொடர்புகொள்வதை நிறுத்தும், Tor, இணைய நுழைவாயில், மெஷ் பாலம் அனைத்தும் முடங்கும். அருகிலுள்ள புளூடூத் அரட்டை தொடர்ந்து இயங்கும்.",
  "settings.network.turn_off": "முடக்கு",
  "settings.network.discovery": "புவி ரிலே கண்டறிதல்",
  "settings.network.discovery_desc":
    "300 க்கும் மேற்பட்ட பரவலான ரிலேக்களில் இருந்து ஓர் இடக் கட்டத்துக்கு மிக அருகிலுள்ளவற்றைத் தானாகத் தேர்ந்தெடு",
  "settings.network.discovery_needs_relay":
    "முதலில் உங்கள் சொந்த ரிலேயைச் சேருங்கள்",
  "settings.network.discovery_needs_relay_body":
    "Airhop ஐ மிக அருகிலுள்ள ரிலேக்களை நோக்கித் திருப்புவது இந்தத் தானியங்கிக் கண்டறிதலே. கீழே உங்கள் சொந்த ரிலேக்களைப் பொருத்திய பிறகே இதை முடக்குவதில் பொருள் உண்டு, எனவே முதலில் குறைந்தது ஒன்றைச் சேருங்கள்.",
  "settings.network.custom_only_title":
    "உங்கள் சொந்த ரிலேக்களை மட்டும் பயன்படுத்தவா?",
  "settings.network.custom_only_body":
    "இடச் சேனல்களும் மெஷ் பாலமும் மிக அருகிலுள்ள ரிலேக்களைத் தானாகத் தேர்ந்தெடுப்பதை நிறுத்தி, நீங்கள் சேர்த்தவற்றை மட்டும் பயன்படுத்தும். இது எட்டும் தூரத்தைக் குறைக்கலாம், மிக அருகிலுள்ள ரிலேக்களில் கூடும் bitchat பயனர்களைச் சந்திப்பதும் நின்றுபோகலாம்.",
  "settings.network.custom": "சொந்த ரிலேக்கள்",
  "settings.network.custom_desc":
    "இடச் சேனல்களுக்கும் மெஷ் பாலத்துக்கும் உங்கள் சொந்த ரிலேக்களைச் சேருங்கள்",
  "settings.network.custom_added": "{max} இல் {count} சேர்க்கப்பட்டது",
  "settings.network.dm_relays": "செய்தி ரிலேக்கள்",
  "settings.network.dm_relays_desc":
    "நேரடிச் செய்திகளும் தனிப்பட்ட சேனல்களும் எப்போதும் இவற்றையே பயன்படுத்தும். உங்கள் சொந்த ரிலேக்கள் இவற்றை மாற்றாது.",
  "settings.network.discovery_back_on":
    "புவி ரிலே கண்டறிதல் மீண்டும் இயக்கத்தில்",
  "settings.network.discovery_back_on_body":
    "அதுவே உங்கள் கடைசிச் சொந்த ரிலே. இடச் சேனல்களுக்கு வெளியிட ஓர் இடம் தேவை, எனவே Airhop மீண்டும் மிக அருகிலுள்ள ரிலேக்களைத் தானாகத் தேர்ந்தெடுக்கிறது.",
  "settings.network.add_relay": "ரிலே சேர்",
  "settings.network.remove_relay": "{url} ஐ அகற்று",
  "settings.network.add_short": "சேர்",
  "settings.network.relay_limit":
    "{count} ரிலேக்களைச் சேர்க்கலாம். இன்னொன்றைச் சேர்க்க ஒன்றை அகற்றுங்கள்.",
  "settings.network.relay_duplicate":
    "அந்த ரிலே ஏற்கெனவே உங்கள் பட்டியலில் உள்ளது.",
  "settings.network.relay_invalid":
    "சரியான ரிலே புரவலனை உள்ளிடுங்கள், எடுத்துக்காட்டாக relay.example.com. ரிலே இயல்பு துறையைப் பயன்படுத்தாதபோது மட்டுமே துறை தேவை. IP முகவரிகளும் உள்ளூர்ப் பெயர்களும் அனுமதிக்கப்படவில்லை.",
  "settings.network.lan": "உள்ளூர் நெட்வொர்க்",
  "settings.network.lan_desc":
    "அதே WiFi-ல் உள்ளவர்களை அடையுங்கள், iPhone மற்றும் Android இடையேயும். நெட்வொர்க்கில் உள்ள மற்ற சாதனங்கள் நீங்கள் Airhop பயன்படுத்துவதைக் காண முடியும்.",
  "settings.network.lan_searching":
    "இந்த நெட்வொர்க்கில் Airhop சாதனங்கள் இல்லை",
  "settings.network.lan_active": "இந்த நெட்வொர்க்கில் இணைக்கப்பட்டுள்ளது",
  "settings.network.lan_unavailable": "எந்த WiFi நெட்வொர்க்கிலும் இல்லை",
  "settings.network.lan_permission":
    "Airhop-க்கான உள்ளூர் நெட்வொர்க் அணுகல் அணைக்கப்பட்டுள்ளது",
  "settings.network.lan_unsupported": "இந்த சாதனத்தில் கிடைக்கவில்லை",
  "settings.network.lan_foreground":
    "Airhop பின்னணிக்குச் சென்றால் நிற்கும். புளூடூத் தொடர்ந்து இயங்கும்.",
  "settings.network.wifi_pair": "இணைத்தல்",
  "settings.network.wifi_paired": "இணைக்கப்பட்ட சாதனங்கள்",
  "settings.network.wifi_pair_find": "ஒரு சாதனத்தைத் தேடு",
  "settings.network.wifi_pair_find_desc":
    "தன்னைக் காட்டிக்கொண்டிருக்கும் அருகிலுள்ள iPhone-ஐத் தேடுங்கள். இரண்டு தொலைபேசிகளுக்கும் iOS 26 அல்லது அதற்குப் பிந்தையது தேவை.",
  "settings.network.wifi_pair_show": "இந்த iPhone-ஐக் காட்டு",
  "settings.network.wifi_pair_show_desc":
    "அருகிலுள்ள ஒரு iPhone இதைக் கண்டறியட்டும். ஒருவர் தேடுகிறார், மற்றொருவர் காட்டுகிறார், ஒரே நேரத்தில்.",
  "settings.network.wifi_pair_find_action":
    "அருகிலுள்ள ஒரு iPhone-ஐத் தேர்ந்தெடுங்கள்",
  "settings.network.wifi_pair_show_action":
    "இந்த iPhone-ஐக் கண்டறியக்கூடியதாக்குங்கள்",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware இப்போது கிடைக்கவில்லை",
  "settings.network.wifi_pair_forget":
    "Settings செயலியில் ஓர் இணைப்பை நீக்குங்கள்",
  "settings.network.bitchat": "bitchat உடன் இயைபு",
  "settings.network.bitchat_desc":
    "bitchat இன் அதே BLE மெஷ், முழுமையாக ஒன்றுடன் ஒன்று இயங்கக்கூடியது. இது எப்போதும் இயக்கத்தில் இருக்கும், முடக்க முடியாது.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "பின்னணியில் இயக்கு",
  "settings.conn.background_desc":
    "Airhop மூடியிருக்கும்போதும் மெஷ் இயங்கட்டும்",
  "settings.conn.background_on_title": "மெஷ் இயங்கிக்கொண்டே இருக்கட்டுமா?",
  "settings.conn.background_on_body":
    "Airhop மூடியிருக்கும்போதும் கடத்துவதையும் பெறுவதையும் தொடர்கிறது, எனவே நீங்கள் இல்லாதபோதும் செய்திகள் வந்துசேரும். அப்போது Android ஒரு தொடர் அறிவிப்பைக் காட்டும்.",
  "settings.conn.background_off_title": "Airhop மூடும்போது மெஷை நிறுத்தவா?",
  "settings.conn.background_off_body":
    "Airhop திறந்திருக்கும்போது மட்டுமே செய்திகள் வரும், அருகிலுள்ளவர்களுக்காக இந்தத் தொலைபேசி கடத்துவதை நிறுத்தும். தொடர் அறிவிப்பு மறையும்.",
  "settings.conn.live_voice": "நேரடிக் குரல்",
  "settings.conn.live_voice_desc":
    "அருகிலுள்ளவர்களுடன் வாக்கிடாக்கி போலப் பேசுங்கள்",
  "settings.conn.live_voice_on_title": "நேரடிக் குரலை இயக்கவா?",
  "settings.conn.live_voice_on_body":
    "ஒலிவாங்கியை அழுத்திப் பிடித்தால் நீங்கள் பேசும்போதே உங்கள் குரல் புளூடூத் வரம்பில் உள்ள அனைவருக்கும் செல்லும், அவர்களின் குரல் உங்கள் தொலைபேசியில் ஒலிக்கும். எதுவும் பதிவு செய்யப்படுவதில்லை.",
  "settings.conn.live_voice_off_title": "நேரடிக் குரலை முடக்கவா?",
  "settings.conn.live_voice_off_body":
    "ஒலிவாங்கியை அழுத்திப் பிடித்தால் அதற்குப் பதிலாகக் குரல் குறிப்பு பதிவாகும். விடும்போது அது அனுப்பப்படும், இயக்கும் வரை யாரும் கேட்க மாட்டார்கள்.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor திசைவழி",
  "settings.conn.tor_desc":
    "கூடுதல் தனியுரிமைக்காக Nostr போக்குவரத்தை Tor வழியாக அனுப்புங்கள்",
  "settings.conn.tor_on_title": "Nostr போக்குவரத்தை Tor வழியாக அனுப்பவா?",
  "settings.conn.tor_on_body":
    "ரிலேக்கள் உங்கள் IP முகவரியைப் பார்ப்பதை நிறுத்தும். இணைக்க அதிக நேரம் ஆகும், செய்திகள் மெதுவாக வரும். புளூடூத் பாதிக்கப்படாது.",
  "settings.conn.tor_off_title": "Tor திசைவழியை முடக்கவா?",
  "settings.conn.tor_off_body":
    "Nostr போக்குவரத்து உங்கள் வழக்கமான இணைப்புக்குத் திரும்பும், எனவே ரிலேக்கள் உங்கள் IP முகவரியை மீண்டும் பார்க்கும். எப்படியிருந்தாலும் புளூடூத் பாதிக்கப்படாது.",
  "settings.conn.tor_unavailable":
    "இந்தக் கட்டமைப்பில் Tor திசைவழி கிடைக்கவில்லை.",
  "settings.conn.tor_timeout":
    "Tor இணைக்க ஒரு நிமிடத்துக்கு மேல் எடுக்கிறது. அது இயக்கத்திலேயே இருந்து முயன்றுகொண்டிருக்கும்; எப்போது திசைவழி தொடங்குகிறது, அல்லது இந்த வலையமைப்பு அதைத் தடுக்கிறதா என்பதை மெஷ் தாவல் சொல்லும்.",
  "settings.conn.tor_failed":
    "Tor ஐத் தொடங்க முடியவில்லை. சிறிது நேரத்தில் மீண்டும் முயற்சிக்கவும்.",
  "settings.tor.status": "Tor நிலை",
  "settings.tor.connection": "இணைப்பு",
  "settings.tor.mode_off": "நேரடி",
  "settings.tor.mode_off_desc":
    "Tor உடன் நேரடியாக இணைக்கிறது. மிக வேகமானது, ஆனால் இந்த நெட்வொர்க்கைக் கவனிப்பவர் நீங்கள் Tor பயன்படுத்துவதைப் பார்க்க முடியும்.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "நீங்கள் Tor பயன்படுத்துவதை மறைக்கிறது, பாலங்கள் தடுக்கப்பட்ட இடத்திலும் வேலை செய்யும். இணைய மிக மெதுவானது.",
  "settings.tor.mode_obfs4": "obfs4",
  "settings.tor.mode_obfs4_desc":
    "நீங்கள் Tor பயன்படுத்துவதை மறைக்கிறது. Snowflake ஐ விட வேகமானது, ஆனால் இந்தப் பாலங்கள் பொதுவானவை, சில நெட்வொர்க்குகள் தடுக்கின்றன.",
  "settings.tor.mode_webtunnel": "webtunnel",
  "settings.tor.mode_webtunnel_desc":
    "சாதாரண இணையதள வருகை போலத் தோன்றி நீங்கள் Tor பயன்படுத்துவதை மறைக்கிறது. மற்றவற்றை விட தடுப்பது கடினம்.",
  "settings.tor.mode_custom": "சொந்தப் பாலங்கள்",
  "settings.tor.mode_custom_desc":
    "bridges.torproject.org இலிருந்து பெற்ற obfs4 பிரிட்ஜ் வரிகளைப் பயன்படுத்தவும். மற்றவை தோல்வியடையும்போது இதை முயற்சிக்கவும்.",
  "settings.tor.custom_placeholder": "ஒரு வரிக்கு ஒரு பாலம் வரியை ஒட்டவும்",
  "settings.tor.custom_apply_hint": "இணைக்க பெட்டிக்கு வெளியே தட்டவும்.",
  "settings.tor.custom_empty":
    "முதலில் குறைந்தது ஒரு பாலம் வரியைச் சேர்க்கவும்.",
  "settings.tor.recovered":
    "Tor கடந்த முறை தொடங்குவதை முடிக்கவில்லை, எனவே அது அணைக்கப்பட்டது. மீண்டும் முயற்சிக்க அதை இயக்கவும்.",
  "settings.conn.mint_clearnet":
    "நாணயச்சாலைப் போக்குவரத்தைத் திறந்த வலையில் அனுமதி",
  "settings.conn.mint_clearnet_desc":
    "iOS இல் Tor, Nostr ஐ மட்டுமே மூடுகிறது. நாணயச்சாலைக் கோரிக்கைகளைத் தடுக்க முடக்கியே விடுங்கள்; மெஷ் வழி ecash எப்படியிருந்தாலும் இயங்கும்.",
  "settings.conn.gateway": "இணைய நுழைவாயில்",
  "settings.conn.gateway_desc":
    "அருகிலுள்ள ஆஃப்லைன் தொலைபேசிக்கு உங்கள் இணைப்பைக் கடன் கொடுங்கள், அது இடச் சேனல்களை அடைய முடியும்",
  "settings.conn.gateway_on_title": "இணைய நுழைவாயிலை இயக்கவா?",
  "settings.conn.gateway_on_body":
    "சொந்த இணைப்பு இல்லாத அருகிலுள்ள தொலைபேசிகள் இடச் சேனல் செய்திகளை உங்கள் இணைப்பு வழியாக அனுப்பியும் பெற்றும் கொள்ளும். இது உங்கள் அலைபேசித் தரவையும் மின்கலத்தையும் செலவழிக்கும், அவர்களின் செய்திகள் முனை முதல் முனை வரை குறியாக்கமாகவே இருக்கும், எனவே கடந்துசெல்வதை உங்களால் படிக்க முடியாது.",
  "settings.conn.gateway_off_title": "இணைய நுழைவாயிலை முடக்கவா?",
  "settings.conn.gateway_off_body":
    "அருகிலுள்ள ஆஃப்லைன் தொலைபேசிகள் உங்கள் இணைப்பு வழியாக இடச் சேனல்களை அடைவதை நிறுத்தும். உங்கள் சொந்தச் செய்திகள் பாதிக்கப்படாது.",
  "settings.conn.bridge": "மெஷ் பாலம்",
  "settings.conn.bridge_desc":
    "இந்தப் பகுதியின் பொது #bluetooth அரட்டையை, வரம்புக்கு வெளியே உள்ள மற்றொரு புளூடூத் கூட்டத்துடன் இணையம் வழியாக இணையுங்கள்",
  "settings.conn.bridge_on_title": "மெஷ் பாலத்தை இயக்கவா?",
  "settings.conn.bridge_on_body":
    "உங்கள் பொது #bluetooth செய்திகள் இணையம் வழியாக உங்கள் அக்கம்பக்கத்தில் வெளியிடப்படும், எனவே புளூடூத் வரம்புக்கு அப்பால் உள்ளவர்களும் படிக்க முடியும். தனிப்பட்ட செய்திகள் ஒருபோதும் பாலம் கடப்பதில்லை, ”அருகில் மட்டும்” என்பது ஒற்றைச் செய்தியை உள்ளூரிலேயே வைக்கும்.",
  "settings.conn.bridge_off_title": "மெஷ் பாலத்தை முடக்கவா?",
  "settings.conn.bridge_off_body":
    "உங்கள் பொது #bluetooth செய்திகள் மீண்டும் புளூடூத் வரம்பிலேயே இருக்கும், பாலத்துக்கு அப்பாலுள்ள கூட்டத்தின் செய்திகள் இங்கு வருவது நின்றுவிடும்.",
  "settings.conn.bridge_needs_location": "மெஷ் பாலத்துக்கு இடம் தேவை",
  "settings.conn.bridge_needs_location_desc":
    "இட அளவீட்டிலிருந்து உங்கள் அக்கம்பக்கத்தைக் கண்டறிகிறது. பாலம் அமைக்கத் தொடங்க இட அனுமதி கொடுங்கள்.",
  "settings.conn.grant_location": "இட அனுமதி கொடு",
  "settings.conn.grant_short": "கொடு",
  "settings.conn.internet_off": "இணையம் முடக்கத்தில் உள்ளது",
  "settings.conn.internet_off_desc":
    "Tor, பாலம், நுழைவாயில் அனைத்தும் இணையத்தைப் பயன்படுத்துகின்றன. அவற்றைப் பயன்படுத்த வலையமைப்புக்குக் கீழே இணைய மாற்றை இயக்குங்கள்.",
  "settings.conn.turn_on": "இயக்கு",
  "settings.conn.turn_off": "முடக்கு",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "புளூடூத்",
  "settings.permissions.bluetooth_desc":
    "அருகிலுள்ள சாதனங்களைக் கண்டறிந்து அவற்றுக்கு இடையே செய்திகளைக் கடத்துகிறது. இது இல்லாமல் மெஷ் இயங்காது.",
  "settings.permissions.location": "இடம்",
  "settings.permissions.location_desc":
    "அருகிலுள்ள பகுதிச் சேனல்களைத் திறக்கிறது. இது இல்லாமல் அந்தச் சேனல்கள் மூடியே இருக்கும், புளூடூத் மெஷ் வழக்கம்போல் தொடரும்.",
  "settings.permissions.notifications": "அறிவிப்புகள்",
  "settings.permissions.notifications_desc":
    "செயலி மூடியிருந்தாலும் புதிய செய்திகளுக்கான அறிவிப்புகளைப் பெறுங்கள். இது இல்லாமல் Airhop ஐத் திறக்கும்போது மட்டுமே அவற்றைப் பார்ப்பீர்கள்.",
  "settings.permissions.camera": "கேமரா",
  "settings.permissions.camera_desc":
    "QR குறியீடுகளை ஸ்கேன் செய்து, அனுப்ப புகைப்படங்களையோ வீடியோக்களையோ எடுக்கிறது. இது இல்லாமலும் தொகுப்பிலிருந்து ஊடகத்தைப் பகிரலாம்.",
  "settings.permissions.photos": "புகைப்படங்கள்",
  "settings.permissions.photos_desc":
    "உங்கள் தொகுப்பிலிருந்து புகைப்படங்களை அனுப்புகிறது, வந்த ஊடகத்தைச் சேமிக்கிறது. இது இல்லாமலும் கேமராவால் புதிய புகைப்படங்களை எடுத்து அனுப்பலாம்.",
  "settings.permissions.microphone": "ஒலிவாங்கி",
  "settings.permissions.microphone_desc":
    "குரல் செய்திகளைப் பதிவுசெய்து அனுப்புகிறது அல்லது நேரடிக் குரலை இயக்குகிறது. இது இல்லாமல் குரல் செய்திகளும் நேரடிக் குரலும் இயங்காது.",
  "settings.permissions.allow": "இந்த அனுமதியைக் கொடு",
  "settings.permissions.open_settings":
    "இந்த அனுமதியை மாற்ற அமைப்பு அமைவுகளைத் திற",
  "settings.permissions.system": "அமைப்பு",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "வலையமைப்புப் பயன்பாடு",
  "settings.storage.storage_usage": "சேமிப்புப் பயன்பாடு",
  "settings.storage.storage_usage_desc":
    "செய்திகள், பணப்பைச் சான்றுகள், தற்காலிகச் சேமிப்பில் உள்ள இணைப்புகள்",
  "settings.storage.session_usage":
    "இந்த அமர்வு · {sent} அனுப்பப்பட்டது, {received} பெறப்பட்டது",
  "settings.storage.cache": "தற்காலிகச் சேமிப்பு",
  "settings.storage.cache_desc": "{size} இணைப்புகள்",
  "settings.storage.clear_cache": "இணைப்புகளின் தற்காலிகச் சேமிப்பை அழி",
  "settings.storage.clear": "அழி",
  "settings.storage.clear_title":
    "தற்காலிகச் சேமிப்பில் உள்ள ஊடகத்தை அழிக்கவா?",
  "settings.storage.clear_body":
    "புகைப்படங்கள், வீடியோக்கள், குரல் குறிப்புகள், கோப்புகள் இந்தச் சாதனத்திலிருந்து அகற்றப்படும், அனுப்பியவையும் பெற்றவையும் சேர்த்து. அவற்றை மீண்டும் பதிவிறக்க முடியாது: அவற்றின் குமிழிகள் அதைச் சொல்லும், அனுப்பியவரிடம் மீண்டும் அனுப்பச் சொல்லலாம். செய்திகளும் பணப்பையும் தொடப்படாமல் இருக்கும்.",
  "settings.storage.cleared": "தற்காலிகச் சேமிப்பு அழிக்கப்பட்டது",
  "settings.storage.freed": "{size} விடுவிக்கப்பட்டது.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "தோற்றத்தை {value} ஆக அமை",
  "settings.font.set_a11y": "ஒரே அகல எழுத்துருவை {value} ஆக அமை",
  "settings.font.system": "அமைப்பு",
  "settings.font.system_desc":
    "உங்கள் சாதனத்தின் இயல்பு ஒரே அகல எழுத்துருவைப் பயன்படுத்துகிறது",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "நவீனமானது, படிக்க எளிதானது",
  "settings.language.en": "ஆங்கிலம்",
  "settings.language.am": "அம்ஹாரிக்",
  "settings.language.ar": "அரபு",
  "settings.language.bn": "வங்காளம்",
  "settings.language.my": "பர்மியம்",
  "settings.language.zh_hans": "சீனம் (எளிமையாக்கியது)",
  "settings.language.zh_hant": "சீனம் (பாரம்பரியம்)",
  "settings.language.nl": "டச்சு",
  "settings.language.fil": "பிலிப்பினோ",
  "settings.language.fr": "பிரெஞ்சு",
  "settings.language.ka": "ஜார்ஜியன்",
  "settings.language.de": "ஜெர்மன்",
  "settings.language.hi": "இந்தி",
  "settings.language.id": "இந்தோனேசியம்",
  "settings.language.it": "இத்தாலியம்",
  "settings.language.ja": "ஜப்பானியம்",
  "settings.language.ko": "கொரியம்",
  "settings.language.mg": "மலகாசி",
  "settings.language.ms": "மலாய்",
  "settings.language.ne": "நேபாளி",
  "settings.language.fa": "பாரசீகம்",
  "settings.language.pl": "போலிஷ்",
  "settings.language.pt_br": "போர்த்துகீசியம் (பிரேசில்)",
  "settings.language.pt_pt": "போர்த்துகீசியம் (போர்ச்சுகல்)",
  "settings.language.pa": "பஞ்சாபி",
  "settings.language.ru": "ரஷியன்",
  "settings.language.es": "ஸ்பானிஷ்",
  "settings.language.sw": "சுவாஹிலி",
  "settings.language.sv": "சுவீடிஷ்",
  "settings.language.ta": "தமிழ்",
  "settings.language.th": "தாய்",
  "settings.language.tr": "துருக்கியம்",
  "settings.language.uk": "உக்ரைனியம்",
  "settings.language.ur": "உருது",
  "settings.language.vi": "வியட்நாமியம்",
  "settings.language.pseudo": "போலி மொழி",
  "settings.language.soon": "விரைவில் வருகிறது",
  "settings.language.soon_a11y": "{value}, விரைவில் வருகிறது",
  "settings.language.set_a11y": "மொழியை {value} ஆக அமை",
  "settings.language.pending": "அடுத்த முறை திறக்கும்போது",
  "settings.language.pending_a11y":
    "{value}, நீங்கள் அடுத்த முறை Airhop ஐத் திறக்கும்போது பொருந்தும்",
  "settings.language.rtl_restart": "இப்போது மீண்டும் திற",
  "settings.language.rtl_title": "முடிக்க Airhop ஐ மீண்டும் திறங்கள்",
  "settings.language.rtl_body":
    "{value} வலமிருந்து இடமாகப் படிக்கப்படுகிறது, Airhop தொடங்கும்போது மட்டுமே திசையை மாற்ற முடியும். மாற்றத்தை முடிக்க அதை மூடிவிட்டு மீண்டும் திறங்கள். எதுவும் இழக்கப்படாது, நீங்கள் அப்படிச் செய்யும் வரை உங்கள் மெஷ் இணைந்தே இருக்கும்.",
  "settings.theme.light": "ஒளி",
  "settings.theme.light_desc": "எப்போதும் ஒளி வண்ணத்தட்டைப் பயன்படுத்து",
  "settings.theme.dark": "இருள்",
  "settings.theme.dark_desc": "எப்போதும் இருள் வண்ணத்தட்டைப் பயன்படுத்து",

  // ---- Settings: profile and identity ----
  "settings.status.online": "ஆன்லைன்",
  "settings.status.online_desc":
    "கண்டறியக்கூடியது, அறிவித்தும் தேடியும் கொண்டிருக்கிறது",
  "settings.status.away": "வெளியே",
  "settings.status.away_desc": "மெஷ் இடைநிறுத்தம், தேடலோ அறிவிப்போ இல்லை",
  "settings.status.invisible": "கண்ணுக்குப் புலப்படாதது",
  "settings.status.invisible_desc":
    "தேடுகிறது, ஆனால் கண்டறிதலிலிருந்து மறைந்திருக்கிறது",
  "settings.status.title": "நிலை",
  "settings.status.set_a11y": "நிலையை {value} ஆக அமை",
  "settings.status.edit": "நிலையை மாற்று",
  "settings.status.desc":
    "மெஷில் நீங்கள் எவ்வளவு தெரிய வேண்டும் என்பதைத் தேர்ந்தெடுங்கள்.",
  "settings.transfer.identity": "அடையாளமும் சாவிகளும்",
  "settings.transfer.identity_desc":
    "உங்கள் பியர் அடையாளம், பயனர் பெயர், தொடர்புகள்",
  "settings.transfer.chats": "அரட்டைகளும் வரலாறும்",
  "settings.transfer.chats_desc":
    "உரையாடல்கள், குழுக்கள், நீங்கள் சேர்ந்த சேனல்கள்",
  "settings.transfer.wallet": "பணப்பை இருப்பு",
  "settings.transfer.wallet_desc": "Cashu சான்றுகளும் பரிவர்த்தனை வரலாறும்",
  "settings.transfer.title": "புதிய தொலைபேசிக்கு மாற்று",
  "settings.transfer.desc":
    "உங்கள் அடையாளம், அரட்டைகள், பணப்பையை மற்றொரு சாதனத்துக்கு மாற்றுங்கள்",
  "settings.transfer.coming_soon_a11y":
    "புதிய தொலைபேசிக்கு மாற்று, விரைவில் வருகிறது",
  "settings.transfer.body":
    "இரு தொலைபேசிகளையும் அருகருகே வைத்து எல்லாவற்றையும் புளூடூத் வழியாக மாற்றுங்கள். எதுவும் சேவையகம் வழியாகச் செல்வதில்லை, எனவே இணையம் இல்லாமலும் இது இயங்கும்.",
  "settings.qr.permission_label": "புகைப்பட அணுகல்",
  "settings.qr.permission_purpose": "உங்கள் QR குறியீட்டைச் சேமிக்க",
  "settings.qr.saved": "சேமிக்கப்பட்டது",
  "settings.qr.saved_body":
    "QR குறியீடு உங்கள் புகைப்படத் தொகுப்பில் சேமிக்கப்பட்டது.",
  "settings.qr.save_failed": "சேமிக்க முடியவில்லை",
  "settings.qr.save_failed_body":
    "QR குறியீட்டைச் சேமிக்க முடியவில்லை. மீண்டும் முயலுங்கள்.",
  "settings.qr.share_message": "என்னை Airhop இல் சேருங்கள்",
  "settings.qr.share_body":
    "என்னை Airhop இல் சேருங்கள் — தனிப்பட்ட மெஷ் செய்தியனுப்பல், முதலில் ஆஃப்லைன்.",
  "settings.qr.show_short": "QR காட்டு",
  "settings.qr.title": "உங்கள் QR குறியீடு",
  "settings.qr.note":
    "இதில் உங்கள் பொதுச் சாவிகள் உள்ளன, அவை மற்றவர்கள் எங்கிருந்தும் உங்களுக்குச் செய்தி அனுப்ப அனுமதிக்கும். நீங்கள் நம்பும் நபர்களுடன் மட்டுமே இதைப் பகிருங்கள். உங்கள் அடையாளத்தை அழிக்கும் வரை இது மாறாது.",
  "settings.qr.code_label": "தொடர்புக் குறியீடு",
  "settings.qr.copy_code": "தொடர்புக் குறியீட்டை நகலெடு",
  "settings.qr.share": "QR குறியீட்டைப் பகிர்",
  "settings.qr.share_short": "QR பகிர்",
  "settings.qr.download": "QR குறியீட்டைப் பதிவிறக்கு",
  "settings.qr.download_short": "QR பதிவிறக்கு",
  "settings.qr.show": "QR குறியீட்டைக் காட்டு",
  "settings.wipe.trigger": "அவசர அழிப்பைத் தொடங்கு",
  "settings.wipe.trigger_desc":
    "உறுதிசெய்யாமல் உடனே அழிக்க மூன்று முறை தட்டுங்கள்",
  "settings.wipe.title": "அவசர அழிப்பு",
  "settings.wipe.now": "இப்போதே அழி",
  "settings.wipe.desc":
    "எல்லாச் சாவிகளையும் செய்திகளையும் சான்றுகளையும் உடனே அழிக்கிறது",
  "settings.wipe.body":
    "இது உங்கள் எல்லாச் சாவிகளையும் செய்திகளையும் பணப்பைச் சான்றுகளையும் உடனே அழிக்கும். இதைத் திரும்பப்பெற முடியாது.",
  "settings.wipe.in_progress": "அழிக்கிறது",
  "settings.wipe.in_progress_body":
    "உங்கள் சாவிகள், செய்திகள், கோப்புகள் அழிக்கப்படுகின்றன. இதற்குச் சில விநாடிகள் ஆகும், செயலி மூடப்பட்டாலும் இது தானாக முடியும்.",
  "settings.wipe.got_it": "புரிந்தது",
  "settings.wipe.keys_failed": "சாவிகளை அழிக்க முடியவில்லை",
  "settings.wipe.keys_failed_body":
    "உங்கள் செய்திகள், தொடர்புகள், பணப்பை போய்விட்டன, ஆனால் சாதனம் உங்கள் சாவிகளை விடுவிக்க மறுத்தது. சாதனத்தைத் திறந்து மீண்டும் அழியுங்கள்.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "எங்களைத் தொடர்புகொள்ளுங்கள்",
  "settings.help.contact_a11y": "{address} க்கு மின்னஞ்சல் அனுப்பு",
  "settings.help.bug": "பிழையைத் தெரிவி",
  "settings.help.bug_desc": "GitHub இல் ஒரு சிக்கலைத் திற",
  "settings.help.bug_a11y": "GitHub இல் பிழையைத் தெரிவி",
  "settings.help.faq": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  "settings.help.faq_desc": "பொதுவான கேள்விகளுக்கான பதில்கள்",
  "settings.help.faq_a11y": "அடிக்கடி கேட்கப்படும் கேள்விகளைத் திற",
  "settings.help.terms_desc": "Airhop ஐ எப்படிப் பயன்படுத்தலாம்",
  "settings.help.terms_a11y": "சேவை விதிமுறைகளைத் திற",
  "settings.help.privacy_desc": "நாங்கள் எதைச் சேகரிப்பதில்லை",
  "settings.help.privacy_a11y": "தனியுரிமைக் கொள்கையைத் திற",

  // ---- Settings: support ----
  "settings.support.card": "அட்டை அல்லது UPI",
  "settings.support.card_desc": "இணைய வங்கியும் பணப்பைகளும், உலகம் முழுவதும்",
  "settings.support.card_a11y":
    "அட்டை, UPI, இணைய வங்கி அல்லது பணப்பை மூலம் ஆதரியுங்கள்",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "மாதந்தோறும் அல்லது ஒருமுறை, தளக் கட்டணம் இல்லை",
  "settings.support.sponsors_a11y": "GitHub Sponsors வழியாக ஆதரியுங்கள்",
  "settings.support.note":
    "Airhop ஐ நான் ஓய்வு நேரத்தில் உருவாக்குகிறேன். முதலீட்டாளர்களும் இல்லை, விளம்பரங்களும் இல்லை. இது உங்களுக்குப் பயன்பட்டால், ஒரு பங்களிப்பு வளர்ச்சி தொடர மிகவும் உதவும். எப்படியிருந்தாலும் ஒவ்வொரு அம்சமும் இலவசமாகவே இருக்கும்.",

  // ---- Settings: about and version ----
  "settings.about.version": "பதிப்பு",
  "settings.about.version_desc": "தற்போதைய வெளியீடு",
  "settings.about.version_a11y":
    "பதிப்பைப் பார்த்துப் புதுப்பிப்புகளைச் சரிபார்",
  "settings.about.release_notes": "வெளியீட்டுக் குறிப்புகள்",
  "settings.about.release_notes_desc": "சமீபத்திய வெளியீட்டில் புதியது என்ன",
  "settings.about.release_notes_a11y":
    "GitHub இல் சமீபத்திய வெளியீட்டுக் குறிப்புகளைத் திற",
  "settings.about.source": "மூலக் குறியீடு",
  "settings.about.source_a11y": "GitHub இல் மூலக் குறியீட்டைத் திற",
  "settings.about.licenses": "திறந்த மூல உரிமங்கள்",
  "settings.about.open_repo": "{name} களஞ்சியத்தைத் திற",
  "settings.about.licenses_desc": "மூன்றாம் தரப்புத் திறந்த மூலத் தொகுப்புகள்",
  "settings.about.licenses_a11y": "மூன்றாம் தரப்பு உரிமங்களைப் பார்",
  "settings.version.codename": "குறிப்பெயர்",
  "settings.version.checking": "சரிபார்க்கிறது",
  "settings.version.check": "புதுப்பிப்புகளைச் சரிபார்",
  "settings.version.checking_title": "புதுப்பிப்புகள் சரிபார்க்கப்படுகின்றன",
  "settings.version.up_to_date": "நீங்கள் சமீபத்திய பதிப்பில் இருக்கிறீர்கள்.",
  "settings.version.release_notes": "வெளியீட்டுக் குறிப்புகளைப் பார்",
  "settings.version.made_with": "இதனால் உருவாக்கப்பட்டது",
  "settings.version.number": "பதிப்பு {version}",
  "settings.version.update_to": "{version} க்குப் புதுப்பி",
  "settings.version.update_to_a11y": "பதிப்பு {version} க்குப் புதுப்பி",
  "settings.version.released_under": "{license} இன் கீழ் வெளியிடப்பட்டது",
  "settings.version.notes_a11y":
    "பதிப்பு {version} இன் வெளியீட்டுக் குறிப்புகளைப் பார்",
  "settings.version.tor_paused":
    "உங்கள் IP வெளிப்படாமல் இருக்க, Tor இயக்கத்தில் இருக்கும்போது புதுப்பிப்புச் சரிபார்ப்பு இடைநிறுத்தப்படுகிறது. வெளியீடுகள் பக்கத்தை உலாவியில் பாருங்கள்.",
  "settings.version.check_failed":
    "புதுப்பிப்புகளைச் சரிபார்க்க முடியவில்லை. உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயலுங்கள்.",
  "settings.version.downloading": "பதிவிறக்குகிறது {percent}%",
  "settings.version.install": "நிறுவு",
  "settings.version.download_failed":
    "பதிவிறக்கம் தோல்வியடைந்தது. உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும்.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} {size} KiB உள்ளது, இது {cap} KiB வரம்பைத் தாண்டுகிறது.",
  "transfer.failed.malformed":
    "ஓர் இணைப்புக் கோப்பு சிதைந்த நிலையில் வந்தது, திறக்க முடியவில்லை. மீண்டும் அனுப்பச் சொல்லுங்கள்.",
  "transfer.failed.unsupported_type":
    "ஓர் இணைப்புக் கோப்பு இந்தச் செயலியால் திறக்க முடியாத வடிவத்தில் வந்தது.",
  "transfer.failed.type_mismatch":
    "ஓர் இணைப்புக் கோப்பு மறுக்கப்பட்டது: அதன் உள்ளடக்கம் அது கூறும் கோப்பு வகையுடன் பொருந்தவில்லை.",
  "transfer.failed.storage":
    "ஓர் இணைப்புக் கோப்பு வந்தது ஆனால் சேமிக்க முடியவில்லை. உங்கள் காலி இடத்தைச் சரிபாருங்கள்.",
  "transfer.badge.waiting": "காத்திருக்கிறது · {name}",
  "transfer.badge.active_count": "{count} பரிமாற்றங்கள்",
  "transfer.badge.sending": "{name} அனுப்பப்படுகிறது",
  "transfer.badge.receiving": "{name} பெறப்படுகிறது",
  "transfer.badge.a11y": "{label}, {percent} சதவீதம். உரையாடலைத் திறங்கள்.",
  "transfer.kind.photo": "புகைப்படம்",
  "transfer.kind.video": "வீடியோ",
  "transfer.kind.voice": "குரல் குறிப்பு",
  "transfer.this.photo": "இந்தப் புகைப்படம்",
  "transfer.this.video": "இந்த வீடியோ",
  "transfer.this.voice": "இந்தக் குரல் குறிப்பு",
  "transfer.this.file": "இந்தக் கோப்பு",
  "transfer.kind.document": "ஆவணம்",
  "transfer.kind.voice_preview": "குரல் குறிப்பு",
  "transfer.kind.photo_preview": "புகைப்படம்",
  "transfer.kind.video_preview": "வீடியோ",
  "transfer.kind.document_preview": "ஆவணம்",

  // ---- System notifications ----
  "notif.channel.messages": "செய்திகள்",
  "notif.channel.nearby": "அருகிலுள்ள பியர்கள்",
  "notif.channel.nearby_desc":
    "புளூடூத் வரம்பில் மெஷ் ஆட்களைக் கண்டறியும்போது எப்போதாவது வரும் அறிவிப்பு.",
  "notif.nearby.body": "இப்போது புளூடூத் வரம்பில். மெஷைத் திறக்கத் தட்டுங்கள்.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "யாரோ",
  "notif.notice_urgent": "அவசர அறிவிப்பு · {content}",
  "notif.notice": "அறிவிப்பு · {content}",
  "notif.incoming_file": "வரும் கோப்பு",
  "notif.preview.photo": "📷 புகைப்படம்",
  "notif.preview.voice": "🎤 குரல் செய்தி",
  "notif.preview.video": "🎥 வீடியோ",
  "notif.preview.document": "📄 ஆவணம்",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "புதிய செய்தி",
  "notif.hidden.channel": "புதிய செயல்பாடு",
  "notif.hidden.mention": "உங்களைக் குறிப்பிட்டுள்ளார்கள்",
  "notif.mention.title": "{sender} உங்களைக் குறிப்பிட்டுள்ளார்",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "மேலும் {count} காட்டு",
    other: "மேலும் {count} காட்டு",
  },
  "chat.channels.show_more_a11y": {
    one: "மேலும் {count} இயல்பு சேனலைக் காட்டு",
    other: "மேலும் {count} இயல்பு சேனல்களைக் காட்டு",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} படிக்கப்படாதது",
    other: "{label}, {count} படிக்கப்படாதவை",
  },
  "a11y.new_count": {
    one: "{label}, {count} புதியது",
    other: "{label}, {count} புதியவை",
  },
  "chat.a11y.unread": {
    one: "{count} படிக்கப்படாதது",
    other: "{count} படிக்கப்படாதவை",
  },
  "chat.thread.length_left": {
    one: "{count} மீதம்",
    other: "{count} மீதம்",
  },
  "settings.general.retention_days": {
    one: "{count} நாள்",
    other: "{count} நாட்கள்",
  },
  "chat.info.group_reach": {
    one: "{count} உறுப்பினரில் {reachable} பேரை அடைய முடியும்",
    other: "{count} உறுப்பினர்களில் {reachable} பேரை அடைய முடியும்",
  },
  "chat.group_members": {
    one: "தனிப்பட்ட குழு  ·  {count} உறுப்பினர்",
    other: "தனிப்பட்ட குழு  ·  {count} உறுப்பினர்கள்",
  },
  "chat.select.count": {
    one: "{count} தேர்ந்தெடுக்கப்பட்டது",
    other: "{count} தேர்ந்தெடுக்கப்பட்டன",
  },
  "chat.select.forward": {
    one: "{count} செய்தியை அனுப்பு",
    other: "{count} செய்திகளை அனுப்பு",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} பேர் பேசுகிறார்",
    other: "{count} பேர் பேசுகிறார்கள்",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "வரம்பில் {count} பியர்",
    other: "வரம்பில் {count} பியர்கள்",
  },
  "mesh.peer.hops_away": {
    one: "{count} தாவல் தொலைவில்",
    other: "{count} தாவல்கள் தொலைவில்",
  },
  "chat.presence.active": {
    one: "{count} செயலில்",
    other: "{count} செயலில்",
  },
  "chat.presence.nearby": {
    one: "{count} அருகில்",
    other: "{count} அருகில்",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} நாணயச்சாலை",
    other: "{count} நாணயச்சாலைகள்",
  },
  "wallet.mint.remove_body": {
    one: "{mint} இடம் {count} சான்றில் {balance} {unit} உள்ளது. அகற்றினால் அந்தச் சான்று இந்தச் சாதனத்திலிருந்து நிரந்தரமாக அழிந்துவிடும், அதற்குக் காப்புப்பிரதி இல்லை. முதலில் இருப்பை எடுத்துக்கொள்ளுங்கள் அல்லது அனுப்புங்கள்.",
    other:
      "{mint} இடம் {count} சான்றுகளில் {balance} {unit} உள்ளது. அகற்றினால் அந்தச் சான்றுகள் இந்தச் சாதனத்திலிருந்து நிரந்தரமாக அழிந்துவிடும், அவற்றுக்குக் காப்புப்பிரதி இல்லை. முதலில் இருப்பை எடுத்துக்கொள்ளுங்கள் அல்லது அனுப்புங்கள்.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} வைப்பு பணம் வருவதற்குக் காத்திருக்கிறது. செயலி திறக்கும் ஒவ்வொரு முறையும் மீண்டும் சரிபார்க்கப்படுகிறது.",
    other:
      "{count} வைப்புகள் பணம் வருவதற்குக் காத்திருக்கின்றன. செயலி திறக்கும் ஒவ்வொரு முறையும் மீண்டும் சரிபார்க்கப்படுகின்றன.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints} இடமிருந்து செலவழிக்கப்படாத {count} சான்று மீட்கப்பட்டது.",
    other: "{mints} இடமிருந்து செலவழிக்கப்படாத {count} சான்றுகள் மீட்கப்பட்டன.",
  },
  "wallet.backup.already_spent": {
    one: "{count} நாணயம் கிடைத்தது, ஆனால் அது ஏற்கெனவே செலவழிக்கப்பட்டுவிட்டது, எனவே அதற்காக எதுவும் வரவு வைக்கப்படவில்லை. இது இயல்பானதே: நீங்கள் எப்போதேனும் செலவழித்த ஒவ்வொரு நாணயமும் நாணயச்சாலை வைத்திருக்கும் பதிவுகளில் இருந்துகொண்டே இருக்கும்.",
    other:
      "{count} நாணயங்கள் கிடைத்தன, ஆனால் அவை ஏற்கெனவே செலவழிக்கப்பட்டுவிட்டன, எனவே அவற்றுக்காக எதுவும் வரவு வைக்கப்படவில்லை. இது இயல்பானதே: நீங்கள் எப்போதேனும் செலவழித்த ஒவ்வொரு நாணயமும் நாணயச்சாலை வைத்திருக்கும் பதிவுகளில் இருந்துகொண்டே இருக்கும்.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "மேலும் {count} காட்டு",
    other: "மேலும் {count} காட்டு",
  },
  "wallet.activity.show_more_a11y": {
    one: "மேலும் {count} பணப்பரிமாற்றத்தைக் காட்டு",
    other: "மேலும் {count} பணப்பரிமாற்றங்களைக் காட்டு",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} உறுதிசெய்யப்படாதது",
    other: "{count} உறுதிசெய்யப்படாதவை",
  },
  "wallet.proof_count": {
    one: "{count} சான்று",
    other: "{count} சான்றுகள்",
  },
  "wallet.spent_removed_detail": {
    one: "{count} சான்று ஏற்கெனவே செலவழிக்கப்பட்டிருந்தது, அது அகற்றப்பட்டுவிட்டது.",
    other:
      "{count} சான்றுகள் ஏற்கெனவே செலவழிக்கப்பட்டிருந்தன, அவை அகற்றப்பட்டுவிட்டன.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "அருகில் ஒருவர் இருக்கிறார்",
    other: "அருகில் {count} பேர் இருக்கிறார்கள்",
  },
};

export const ta = { strings, plurals };
