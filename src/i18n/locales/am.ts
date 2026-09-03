// am: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "ሰርዝ",
  "common.done": "ተጠናቋል",
  "common.ok": "እሺ",
  "common.close": "ዝጋ",
  "common.back": "ተመለስ",
  "common.delete": "አጥፋ",
  "common.remove": "አስወግድ",
  "common.add": "ጨምር",
  "common.copy": "ቅዳ",
  "common.copied": "ተቀድቷል",
  "common.share": "አጋራ",
  "common.continue": "ቀጥል",
  "common.try_again": "እንደገና ሞክር",
  "common.settings": "ቅንብሮች",
  "common.on": "በርቷል",
  "common.off": "ጠፍቷል",

  // ---- Dates ----
  "format.today": "ዛሬ",
  "format.yesterday": "ትናንት",
  "format.minutes_ago": "ከ{count} ደቂቃ በፊት",
  "format.hours_ago": "ከ{count} ሰዓት በፊት",
  "format.days_ago": "ከ{count} ቀን በፊት",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "ውይይቶች",
  "nav.tab.mesh": "ሜሽ",
  "nav.tab.wallet": "ቦርሳ",
  "nav.tab.profile": "አንተ",
  "a11y.tab.new_peers": "{label}፣ በአቅራቢያ አዲስ ሰው",
  "nav.notifications": "ማሳወቂያዎች",
  "chat.subtab.channels": "ሰርጦች",
  "chat.subtab.direct": "ቀጥተኛ",
  "chat.subtab.dms": "ቀጥተኛ መልእክቶች",
  "chat.search.placeholder": "ውይይቶችን ፈልግ…",
  "chat.search.a11y": "ውይይቶችንና መልእክቶችን ፈልግ",
  "chat.search.close": "ፍለጋን ዝጋ",
  "chat.search.clear": "ፍለጋን አጽዳ",
  "mesh.view.radar": "የራዳር እይታ",
  "mesh.view.list": "የዝርዝር እይታ",
  "mesh.view.radar_short": "ራዳር",
  "mesh.view.list_short": "ዝርዝር",

  // ---- Legal document names ----
  "legal.last_updated": "መጨረሻ የተዘመነው፦ {date}",
  "legal.terms": "የአገልግሎት ውሎች",
  "legal.privacy": "የግላዊነት መመሪያ",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "የግል ሜሽ ግንኙነት",
  "onboarding.welcome.cta": "ጀምር",
  "onboarding.welcome.cta_hint": "ለመቀጠል ከታች ያሉትን ውሎች ተቀበል",
  "onboarding.welcome.consent_a11y": "የአገልግሎት ውሎችንና የግላዊነት መመሪያን መቀበል",
  "onboarding.welcome.open_terms": "የአገልግሎት ውሎችን ክፈት",
  "onboarding.welcome.open_privacy": "የግላዊነት መመሪያን ክፈት",
  "onboarding.welcome.consent": "{cta} በመንካት {terms} እና {privacy} ን ተቀብለሃል።",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "ማንነትህ እየተፈጠረ ነው",
  "onboarding.identity.body":
    "በዚህ መሣሪያ ላይ የEd25519 ቁልፍ ጥምረት እየተፈጠረ ነው።\nምንም ነገር ወደ የትም አይላክም።",
  "onboarding.identity.failed_heading": "ቁልፎችህ ሊፈጠሩ አልቻሉም",
  "onboarding.identity.failed_body":
    "ይህ መሣሪያ Airhop በአስተማማኝ ሁኔታ እንዲያስቀምጣቸው አልፈቀደም። እንደገና ሞክር፣ ወይም ስልክህን አጥፍተህ አብርተህ Airhop ን እንደገና ክፈት።",
  "onboarding.identity.steps_a11y": "ደረጃዎች፦ {steps}",
  "onboarding.identity.step.x25519": "የX25519 ቋሚ ቁልፍ ጥምረት እየተፈጠረ ነው",
  "onboarding.identity.step.ed25519": "የEd25519 መፈረሚያ ቁልፍ ጥምረት እየተፈጠረ ነው",
  "onboarding.identity.step.keychain": "ቁልፎች በስርዓቱ ቁልፍ ማከማቻ ውስጥ እየተቀመጡ ነው",
  "onboarding.identity.step.peer_id": "የአቻ መለያ እየተወሰደ ነው",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "በሜሽ ላይ ያለህ ስም",
  "onboarding.username.peer_id": "የአቻ መለያ",
  "onboarding.username.card_a11y":
    "በሜሽ ላይ ያለህ ስም {username} ነው። የአቻ መለያ {peerID}። {props}።",
  "onboarding.username.explanation":
    "ይህ የተጠቃሚ ስም ከይፋዊ ቁልፍህ በተወሰነ ስሌት ይመነጫል። የአቻ መለያህን በሚያይ በእያንዳንዱ መሣሪያ ላይ አንድ አይነት ነው።",
  "onboarding.username.cta": "ወደ Airhop ግባ",
  "onboarding.username.prop.algorithm": "ስልተ ቀመር",
  "onboarding.username.prop.storage": "ማከማቻ",
  "onboarding.username.prop.storage_value": "የስርዓቱ ቁልፍ ማከማቻ ብቻ",
  "onboarding.username.prop.account": "መለያ ያስፈልጋል",
  "onboarding.username.prop.account_value": "አያስፈልግም",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "እንኳን ወደ Airhop በደህና መጣህ",
  "onboarding.hello.p1":
    "ሰላም። Airhop በbitchat ላይ ተመስርቶ የተሠራ ራሱን የቻለ ክፍት ምንጭ የጎን ፕሮጀክት ነው። ከbitchat ፕሮጀክት ወይም ከpermissionless tech ጋር ግንኙነት የለውም፤ በእነሱም አልተደገፈም። መገንባቱንና ከማህበረሰቡ ጋር መጋራቱን የምወደው ነገር ብቻ ነው።",
  "onboarding.hello.p2":
    "ይህ የመጀመሪያው የiOS እና የAndroid ልቀት ነው፤ ስለዚህ ከጓደኞቼ ጋር ብሞክረውም ጥቂት ስህተቶች ልታገኝ ትችላለህ። ካጋጠመህ፣ ወይም ስለ አንድ ባህሪ ሐሳብ ካለህ፣ ብትነግረኝ ደስ ይለኛል። በ{github} ላይ issue ክፈት ወይም በ{email} ኢሜይል ላክልኝ።",
  "onboarding.hello.p3":
    "Airhop ጠቃሚ ሆኖ ካገኘኸው በ{github} ላይ ኮከብ መስጠት ወይም በ{store} ላይ ግምገማ መጻፍ አስብበት። ይህ ብዙ ሰዎች ፕሮጀክቱን እንዲያገኙት ይረዳል። ስለሞከርከው እናመሰግናለን!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "ስልክህ ከመጠየቁ በፊት",
  "onboarding.primer.lede": "እያንዳንዱ ምን እንደሚሠራ፣ እና ምን እንደማይሠራ ይኸውልህ።",
  "onboarding.primer.bluetooth.title": "ብሉቱዝ",
  "onboarding.primer.bluetooth.body":
    "በአቅራቢያ ያሉ መሣሪያዎችን ያገኛል፤ በመካከላቸውም መልእክቶችን ያስተላልፋል። ሜሹ የሚፈጠረው በዚህ ነው፤ ያለ ኢንተርኔት ግንኙነትም ይሠራል።",
  "onboarding.primer.location.title": "አካባቢ",
  "onboarding.primer.location.body":
    "ከሰፈር እስከ ክልል ድረስ በአቅራቢያ ባሉ የአካባቢ ሰርጦች ውስጥ ያስገባሃል። Airhop ፈጽሞ አይከታተልህም፤ ትክክለኛ አካባቢህንም ከመሣሪያህ አያወጣም።",
  "onboarding.primer.notifications.title": "ማሳወቂያዎች",
  "onboarding.primer.notifications.body":
    "መተግበሪያው ተዘግቶም እንኳ ስለ አዲስ መልእክቶች ማሳወቂያ ተቀበል። ማሳወቂያዎች የሚፈጠሩት በመሣሪያህ ውስጥ ነው፤ ምንም አገልጋይ አይሳተፍም።",
  "onboarding.primer.footnote":
    "እምቢ ማለት ትችላለህ። መልእክቶች አሁንም በኢንተርኔት ይተላለፋሉ፤ በኋላም በቅንብሮች ውስጥ ሐሳብህን መቀየር ትችላለህ።",
  "onboarding.primer.cta_a11y": "ወደ የፈቃድ ጥያቄዎች ቀጥል",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "የብሉቱዝ መዳረሻ",
  "permission.bluetooth.purpose": "በሜሽ ላይ በአቅራቢያ ያሉ መሣሪያዎችን ለማግኘት",
  "permission.open_settings": "ቅንብሮችን ክፈት",
  "permission.not_now": "አሁን አይደለም",
  "permission.blocked_title": "{label} ጠፍቷል",
  "permission.blocked_body": "{purpose} በቅንብሮች ውስጥ አብራው።",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "የሆነ ችግር ተፈጠረ",
  "error.boundary.body": "Airhop ያልተጠበቀ ችግር አጋጠመውና ያሳይ የነበረውን ማቆም ነበረበት።",

  // ---- Chats: channel list ----
  "chat.channels.default": "ነባሪ ሰርጦች",
  "chat.channels.yours": "የአንተ ሰርጦች",
  "chat.channels.none": "ገና ሰርጦች የሉም",
  "chat.channels.none_hint": "ለመቀላቀል ወይም ለመፍጠር ከላይ {plus} ን ንካ።",
  "chat.channels.none_desc":
    "ገና ሰርጦች የሉም። ለመቀላቀል ወይም ለመፍጠር በራስጌው ላይ ያለውን የመጨመሪያ ቁልፍ ተጠቀም።",
  "chat.channels.show_fewer": "ጥቂት ነባሪ ሰርጦችን አሳይ",
  "chat.channels.show_less": "ጥቂት አሳይ",
  "chat.channels.info": "የሰርጥ መረጃ",
  "chat.channels.pin": "ሰርጥን ሰካ",
  "chat.channels.unpin": "የሰርጥ ሰካታን አንሳ",
  "chat.channels.mute": "ሰርጥን ድምፅ አጥፋ",
  "chat.channels.unmute": "የሰርጥ ድምፅ መልስ",
  "chat.channels.leave": "ሰርጡን ልቀቅ",
  "chat.channels.leave_confirm": "ልቀቅ",
  "chat.channels.clear_body": "በ{name} ውስጥ ያሉ ሁሉም መልእክቶች ይሰረዙ? ይህ ሊመለስ አይችልም።",
  "chat.channels.leave_body":
    "{name} ን ትለቃለህ? መልእክቶቹን መቀበል ታቆማለህ፤ ታሪኩም ከዚህ መሣሪያ ይወገዳል።",
  "chat.channels.more_options": "ለ{name} ተጨማሪ አማራጮች",
  "chat.channels.teleported_tag": "{level}  ·  ከርቀት",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "ውይይቱን አጽዳ",
  "chat.dm.remove_contact": "እውቂያን አስወግድ",
  "chat.dm.block": "ይህን አቻ አግድ",
  "chat.dm.block_confirm": "አግድ",
  "chat.dm.delete": "ውይይቱን ሰርዝ",
  "chat.dm.delete_body":
    "ይህ ውይይቱን ከዝርዝርህ ያስወግዳል፤ መልእክቶቹንም ይሰርዛል። እውቂያው ይቀራል፤ ከእነሱ የሚመጣ አዲስ መልእክትም አዲስ ውይይት ይጀምራል።",
  "chat.dm.in_range": "በክልል ውስጥ",
  "chat.dm.row_hint": "ለተጨማሪ አማራጮች ሁለቴ ንካና ያዝ",
  "chat.channels.row_hint": "ለተጨማሪ አማራጮች ሁለቴ ንካና ያዝ",
  "chat.dm.you_prefix": "አንተ፦",
  "chat.dm.none": "ቀጥተኛ መልእክቶች የሉም",
  "chat.dm.none_desc": "የተመሰጠረ ቀጥተኛ መልእክት ለመጀመር ወደ ሜሽ ትር ሂድና አንድ አቻ ንካ።",
  "chat.dm.contact_info": "የእውቂያ መረጃ",
  "chat.dm.pin": "ውይይቱን ሰካ",
  "chat.dm.unpin": "የውይይቱን ሰካታ አንሳ",
  "chat.dm.mute": "ውይይቱን ድምፅ አጥፋ",
  "chat.dm.unmute": "የውይይቱን ድምፅ መልስ",
  "chat.dm.clear_body": "ከ{name} ጋር ያሉ ሁሉም መልእክቶች ይሰረዙ? ይህ ሊመለስ አይችልም።",
  "chat.dm.remove_contact_body":
    "{name} ይወገድ? ይህ ውይይቱን ይሰርዛል፤ እውቂያውንም ይረሳል። እንደገና መልእክት ከላኩ አሁንም ሊደርሱህ ይችላሉ።",
  "chat.dm.block_body":
    "{name} ይታገድ? በሜሽ ትር ላይ አታያቸውም፤ ከእነሱም መልእክት አትቀበልም፤ በአቅራቢያ ቢሆኑም እንኳ።",
  "chat.dm.more_options": "ለ{name} ተጨማሪ አማራጮች",
  "chat.dm.remove_contact_short": "እውቂያን አስወግድ",
  "chat.dm.block_short": "እውቂያን አግድ",
  "chat.dm.delete_short": "ውይይቱን ሰርዝ",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "መልእክቶችን አጽዳ",
  "chat.clear_confirm": "አጽዳ",
  "chat.group_badge": "ቡድን",
  "chat.more": "ተጨማሪ",
  "chat.no_messages": "ገና መልእክቶች የሉም",
  "chat.you": "አንተ",
  "chat.a11y.channel": "ሰርጥ {name}",
  "chat.a11y.group": "ቡድን {name}",
  "chat.a11y.muted": "ድምፅ ጠፍቷል",
  "chat.a11y.pinned": "ተሰክቷል",

  // ---- Chats: start something new ----
  "chat.new.title": "አዲስ ነገር ጀምር",
  "chat.new.channel": "የግል ሰርጥ ፍጠር",
  "chat.new.channel_label": "የግል ሰርጥ",
  "chat.new.channel_desc":
    "አገናኙ ያለው ማንኛውም ሰው ሊቀላቀለው የሚችል ክፍል። አንድ ፍጠር፣ ወይም በተላከልህ አገናኝ ተቀላቀል።",
  "chat.new.group": "የግል ቡድን ፍጠር",
  "chat.new.group_label": "የግል ቡድን",
  "chat.new.group_desc": "የተወሰኑ ሰዎችን ምረጥ። እስከ 16። በብሉቱዝ ላይ ይቆያል።",
  "chat.new.place": "በጂኦሃሽ ወደ አንድ ቦታ ሂድ",
  "chat.new.place_label": "ወደ አንድ ቦታ ሂድ",
  "chat.new.place_desc": "የየትኛውንም ቦታ የአካባቢ ሰርጥ በጂኦሃሹ ክፈት።",
  "chat.new.reach": "ተደራሽነት",
  "chat.new.reach_internet": "አባላትን በብሉቱዝና በኢንተርኔት ይደርሳል።",
  "chat.new.reach_mesh": "በብሉቱዝ ክልል ውስጥ ይሠራል፤ በኢንተርኔት አይደለም።",
  "chat.new.reach_internet_desc":
    "አባላትን በኢንተርኔትም ይደርሳል። አስተላላፊዎች ሰርጡ ንቁ መሆኑን ማየት ይችላሉ፤ መልእክቶቹን ወይም ማን እንዳለበት ግን ፈጽሞ አያዩም።",
  "chat.new.reach_mesh_desc":
    "በአካባቢው ሜሽ ላይ ይቆያል። በጣም ግላዊ ነው፤ ከብሉቱዝ ክልል ውጭ ምንም አይወጣም።",
  "chat.new.join_link": "በግብዣ አገናኝ የግል ሰርጥ ተቀላቀል",
  "chat.new.back_to_chooser": "ወደ ምርጫው ተመለስ",
  "chat.new.create_channel": "ሰርጥ ፍጠር",
  "chat.new.name_required": "መጀመሪያ የሰርጥ ስም አስገባ",
  "chat.new.name_taken": "ያ ስም አስቀድሞ ተይዟል",
  "chat.new.create": "ፍጠር",
  "chat.new.e2ee": "ከጫፍ እስከ ጫፍ የተመሰጠረ። መልእክቶቹን ማንበብ የሚችሉት አባላት ብቻ ናቸው።",
  "chat.new.invite_only":
    "በግብዣ ብቻ። አገናኙን ያጋራኸው ማንኛውም ሰው ሊቀላቀል ይችላል። ከሌሎች ሁሉ ተደብቆ ይቆያል፤ በአቅራቢያ ካሉ አቻዎችም እንኳ።",
  "chat.new.name_exists": "በዚህ ስም ሰርጥ አስቀድሞ አለ።",
  "chat.new.reach_bluetooth_chip": "ብሉቱዝ ብቻ",
  "chat.new.reach_internet_chip": "ብሉቱዝ + ኢንተርኔት",
  "chat.new.have_link": "በግብዣ አገናኝ ተቀላቀል",

  // ---- Chats: join by link ----
  "chat.join.title": "በአገናኝ ተቀላቀል",
  "chat.join.not_airhop": "ያ የAirhop አገናኝ አይደለም።",
  "chat.join.reach_internet": "አባላትን በብሉቱዝና በኢንተርኔት ይደርሳል።",
  "chat.join.reach_mesh": "በብሉቱዝ ክልል ውስጥ ይቆያል።",
  "chat.join.contact_card": "የእውቂያ ካርድ። ወደ እውቂያዎችህ ይጨምራቸዋል፤ ውይይቱንም ይከፍታል።",
  "chat.join.unverified": "ያ አገናኝ ሊረጋገጥ አልቻለም",
  "chat.join.unverified_body":
    "የእውቂያ ካርዱ ከራሱ ቁልፎች ጋር አይዛመድም፤ ስለዚህ አልተጨመረም። አዲስ እንዲልኩልህ ጠይቃቸው።",
  "chat.join.paste": "ከቅንጥብ ሰሌዳ ለጥፍ",
  "chat.join.join": "ተቀላቀል",
  "chat.join.public_channel": "ይፋዊ ሰርጥ {name}። በአቅራቢያ ያለ ማንኛውም ሰው ሊያነበው ይችላል።",
  "chat.join.private_channel": "የግል ሰርጥ {name}። {reach}",
  "chat.join.dm_with": "ከ{name} ጋር ቀጥተኛ መልእክት።",
  "chat.join.joined_as": "እንደ {name} ተቀላቅለሃል",
  "chat.join.name_clash_body":
    "አስቀድሞ በሌላ {name} ውስጥ ነህ። የሰርጥ ስሞች መለያዎች ብቻ ናቸው፤ ስለዚህ ይህ ግብዣ የራሱን ሰርጥ ከፍቷል፤ አንተ የነበርክበትም አልተነካም። ከየትኛውም የሰርጥ መረጃ ስሙን መቀየር ትችላለህ።",
  "chat.join.paste_hint":
    "በairhop:// የሚጀምር ግብዣ ለጥፍ። አገናኝ መንካትም ይሠራል፤ ይህ ግን ልትነካው ለማትችለው አገናኝ ነው።",
  "chat.join.key_note":
    "የግል ሰርጥ ግብዣ ቁልፉን ይዞ ይመጣል፤ ስለዚህ መቀላቀሉ ወዲያውኑ ነው፤ ከሌላ ማንም ምንም አይጠየቅም።",
  "chat.join.offline_note":
    "ከመስመር ውጭ ይሠራል። አገናኙ የሚነበበው በዚህ መሣሪያ ላይ ነው፤ ሰርጡም ፈጣሪው እንዳዘጋጀው ያህል ይደርሳል።",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "ያ ሕዋስ ሊከፈት አልቻለም። ከጥቂት ጊዜ በኋላ እንደገና ሞክር።",
  "chat.jump.title": "ወደ አንድ ቦታ ሂድ",
  "chat.jump.saved": "የተቀመጡ ቦታዎች",
  "chat.jump.anywhere": "የየትኛውንም ቦታ ይፋዊ የአካባቢ ሰርጥ ክፈት፤ አንተ በሌለህበት ቦታም እንኳ።",
  "chat.jump.geohash_note": "ጂኦሃሹን አስገባ። አካባቢው በዚያ ሕዋስ ውስጥ የሚወድቅ ሁሉ ሰርጡን ይጋራል።",
  "chat.jump.teleport_note":
    "በአቅራቢያ ሳይሆን ከርቀት እንደመጣህ ትታያለህ። የሚደርሰው በኢንተርኔት ብቻ ነው።",
  "chat.jump.level_cell": "የ{level} ሕዋስ",
  "chat.jump.already_here": "አስቀድሞ እዚህ ነህ። ሂድ የ{name} ሰርጥህን ይከፍታል።",
  "chat.jump.open_direction": "ወደ {direction} ያለውን ሕዋስ ክፈት",
  "chat.jump.open_place": "{name} ን ክፈት",
  "chat.jump.remove_place": "{name} ን ከተቀመጡ ቦታዎች አስወግድ",
  "chat.jump.go": "ሂድ",
  "chat.jump.how": "ጂኦሃሽ ለማግኘት፦ የአካባቢ ሰርጥ ክፈት > ስሙን ንካ > ከዚያ ቅዳው።",

  // ---- Chats: private groups ----
  "chat.group.unreachable": "ሁሉንም አባላት መድረስ አልተቻለም። በአቅራቢያ ሲሆኑ እንደገና ሞክር።",
  "chat.group.you_were_added": "ወደ {name} ተጨምረሃል።",
  "chat.group.added_you": "ወደ {name} ጨምሮሃል",
  "chat.group.you_were_removed": "ከ{name} ተወግደሃል። ከእንግዲህ እዚህ ማንበብም መላክም አትችልም።",
  "chat.group.removed_you": "ከ{name} አስወግዶሃል",
  "chat.group.add_failed": "እነሱን መጨመር አልተቻለም",
  "chat.group.add_failed_body":
    "ምንም አልተቀየረም። ወይ አሁን ሊደረስባቸው አልተቻለም፣ ወይ ቡድኑ በ16 ሞልቷል፣ ወይም አንተ ፈጣሪው አይደለህም።",
  "chat.group.remove_failed": "እነሱን ማስወገድ አልተቻለም",
  "chat.group.remove_failed_body":
    "ምንም አልተቀየረም። በቡድኑ ውስጥ ማን እንዳለ መቀየር የሚችለው ቡድኑን የፈጠረው ሰው ብቻ ነው።",
  "chat.group.e2ee": "ከጫፍ እስከ ጫፍ የተመሰጠረ። መልእክቶቹን ማንበብ የሚችሉት አባላት ብቻ ናቸው።",
  "chat.group.cap":
    "እስከ 16 ሰዎች፣ በአንተ የተመረጡ። የግብዣ አገናኝ የለም፤ ስለዚህ አገናኝ ተላልፎለት የሚቀላቀል የለም።",
  "chat.group.bluetooth": "ብሉቱዝ ብቻ። ከክልል ውጭ ያሉ አባላት ሲመለሱ መልእክቶቹን ይቀበላሉ።",
  "chat.group.members_label": "አባላት",
  "chat.group.none_in_range":
    "በክልል ውስጥ ማንም የለም። ቡድኑን ስትፈጥር አባላት በአቅራቢያ መሆን አለባቸው።",
  "chat.group.create_title": "ቡድን ፍጠር",
  "chat.group.name_placeholder": "የቡድን ስም",
  "chat.group.create": "ፍጠር",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "የአካባቢ ሜሽ · ብሉቱዝ ብቻ",
  "chat.scope.mesh_desc":
    "በብሉቱዝ ክልል ውስጥ (በግምት ከ10 እስከ 100 ሜትር) ያሉ መሣሪያዎችን ይደርሳል። ኢንተርኔት አያስፈልግም። ለአካባቢያዊ ቅንጅት ተስማሚ ነው።",
  "chat.scope.block": "የከተማ ብሎክ · ~100ሜ",
  "chat.scope.block_desc":
    "የከተማ ብሎክ ደረጃ ሽፋን። ከብሉቱዝ ክልል ውጭ ግን በአቅራቢያ ያሉ አቻዎች መሳተፍ እንዲችሉ መልእክቶች በኢንተርኔት ይሻገራሉ።",
  "chat.scope.neighborhood": "ሰፈር · ~1ኪሜ",
  "chat.scope.neighborhood_desc":
    "የሰፈር ሽፋን። በአስተላላፊ የተደገፈ ስለሆነ በአካባቢው ያሉ አቻዎች ቀጥተኛ የብሉቱዝ አገናኝ ባይኖርም ሊደረሱ ይችላሉ።",
  "chat.scope.city": "ከተማ · ~10ኪሜ",
  "chat.scope.city_desc":
    "የከተማ አቀፍ ሰርጥ። በመላው ከተማ ያሉ አቻዎችን ለመድረስ በአካባቢ የተመሠረቱ የኢንተርኔት አስተላላፊዎችን ይጠቀማል።",
  "chat.scope.province": "ዞን ወይም ክልል · ~100ኪሜ",
  "chat.scope.province_desc":
    "የዞን ወይም የክልል ሽፋን። በመቶዎች የሚቆጠሩ ኪሎሜትሮችን ለመድረስ በኢንተርኔት ይሻገራል።",
  "chat.scope.country": "አገር ወይም ክልል · ~1000ኪሜ",
  "chat.scope.country_desc":
    "የአገር አቀፍ ሽፋን። በአካባቢው ያለ ማንኛውም የAirhop ወይም የbitchat ተጠቃሚ ሊቀላቀልና መልእክቶችን ሊያነብ ይችላል።",
  "chat.transport.bluetooth": "ብሉቱዝ ብቻ",
  "chat.transport.both": "ብሉቱዝ + ኢንተርኔት",
  "chat.transport.internet": "ኢንተርኔት ብቻ",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "ትእዛዝ /{cmd}፦ {hint}",
  "chat.cmd.hug_hint": "ሞቅ ያለ እቅፍ ላክ",
  "chat.cmd.slap_hint": "በትልቅ ዓሣ ምታ",
  "chat.status.sending": "እየተላከ…",
  "chat.status.undo_send": "መላክን መልስ",
  "chat.status.undo": "መልስ",
  "chat.status.sent": "ተልኳል",
  "chat.status.received": "ደርሷል",
  "chat.status.failed": "አልተሳካም",
  "chat.status.canceled": "ተሰርዟል",
  "chat.status.waiting": "በመጠባበቅ ላይ",
  "chat.status.sending_short": "እየተላከ",
  "chat.status.receiving": "እየተቀበለ",
  "chat.thread.not_available": "እዚህ አይገኝም",
  "chat.thread.private_channel": "የግል ሰርጥ",
  "chat.thread.location_channel": "የአካባቢ ሰርጥ",
  "chat.thread.public_channel": "ይፋዊ ሰርጥ",
  "chat.thread.notices": "የዚህ ሰርጥ ማስታወቂያዎች",
  "chat.thread.invite": "አንድ ሰው ወደዚህ ሰርጥ ጋብዝ",
  "chat.thread.not_in_range": "በብሉቱዝ ክልል ውስጥ አይደለም። በኢንተርኔት እየተላከ ነው።",
  "chat.thread.not_nearby":
    "በአቅራቢያ የለም። ወደ ክልል ሲመለሱ ወይም በመስመር ላይ ሲሆኑ እናደርሰዋለን።",
  "chat.thread.no_keys": "መልእክት ለመላክ በብሉቱዝ ክልል ውስጥ መሆን ወይም ኮዳቸውን መቃኘት አለብህ።",
  "chat.geo.card_received":
    "{name} እውቂያውን አጋርቷል። አንዳችሁ ከተንቀሳቀሳችሁ በኋላም ማውራት እንድትቀጥሉ የአንተንም መልሰህ አጋራ።",
  "chat.geo.exchange_complete": "እውቂያዎች ተለዋውጠዋል። አሁን ከየትም ሆናችሁ መደራረስ ትችላላችሁ።",
  "chat.geo.keep_person": "ይህን ሰው አቆይ",
  "chat.geo.keep_person_desc":
    "አንዳችሁ ከተንቀሳቀሳችሁ በኋላም ማውራት እንድትቀጥሉ እውቂያህን አጋራ። ቋሚ ማንነትህን ያውቃሉ።",
  "chat.geo.card_sent": "ተጋርቷል · የእነሱን በመጠባበቅ ላይ",
  "chat.thread.left_cell":
    "ይህን አካባቢ ለቀሃል፤ ስለዚህ እዚህ ሊደርሱህ አይችሉም። ከየትም ሆናችሁ ማውራት እንድትቀጥሉ ኮዶችን ተለዋወጡ።",
  "chat.thread.no_route": "አሁን ሊደረስባቸው አልተቻለም። መንገድ ሲገኝ መልእክቱ ይላካል።",
  "chat.thread.empty": "ገና መልእክቶች የሉም",
  "chat.thread.empty_desc": "የተመሰጠረ ውይይት ጀምር።",
  "chat.thread.jump_latest": "ወደ የቅርቡ መልእክት ዝለል",
  "chat.thread.back_to_members": "ወደ አባላት ተመለስ",
  "chat.thread.nostr_key": "የNostr ይፋዊ ቁልፍ",
  "chat.thread.in_range": "በክልል ውስጥ",
  "chat.voice.not_recorded": "የድምፅ መልእክቱ አልተቀዳም",
  "chat.thread.message": "መልእክት",
  "chat.thread.message_placeholder": "መልእክት…",
  "chat.thread.length_full": "መልእክቱ ሞልቷል",
  "chat.thread.waiting_for": "{name} እስኪመለስ በመጠባበቅ ላይ · {percent}%",
  "chat.thread.peer": "አቻ",
  "chat.thread.cancel_transfer": "{name} ን ሰርዝ",
  "chat.thread.queued_more": "{count} ተጨማሪ ለመላክ በመጠባበቅ ላይ",
  "chat.thread.across_bridge": "{count} ከድልድዩ ማዶ",
  "chat.thread.bridged": "በድልድይ የተላከ",
  "chat.thread.invite_body":
    "በAirhop ላይ በ{channel} ውስጥ ተቀላቀለኝ — ከመስመር ውጭ ቅድሚያ የሚሰጥ የግል ሜሽ መልእክት መላላኪያ።",
  "chat.thread.go_back_unread": "ተመለስ፣ {count} ያልተነበቡ",
  "chat.thread.view_info": "የ{name} መረጃን ተመልከት",
  "chat.thread.notices_new": "የዚህ ሰርጥ ማስታወቂያዎች፣ {count} አዲስ",
  "chat.thread.say_something": "በ{channel} ውስጥ የሆነ ነገር ተናገር።",
  "chat.thread.jump_latest_new": "ወደ የቅርቡ መልእክት ዝለል፣ {count} አዲስ",
  "chat.thread.unconfirmed_since": "ከ{date} ጀምሮ የደረሰ ነገር አልተረጋገጠም",
  "chat.thread.no_reach": "በአቅራቢያ አቻዎች የሉም · ይህ ገና ማንም አልደረሰውም",
  "chat.thread.channel_needs_internet":
    "ኢንተርኔት ጠፍቷል · ይህ ሰርጥ የሚደርሰው በብሉቱዝ ክልል ውስጥ ያሉ ሰዎችን ብቻ ነው",
  "chat.thread.cell_needs_internet":
    "ኢንተርኔት ጠፍቷል · ይህ ሕዋስ ሊደረስ የሚችለው በኢንተርኔት ብቻ ነው",
  "chat.thread.geo_dm_needs_internet":
    "ኢንተርኔት ጠፍቷል · ይህ ውይይት የሚተላለፈው በኢንተርኔት ብቻ ነው",
  "chat.thread.via_gateway":
    "ኢንተርኔት ጠፍቷል · በአቅራቢያ ያለ መሣሪያ ይህን ለአንተ በመስመር ላይ እያጓጓዘ ነው",
  "chat.thread.group_queued": "ከዚህ ቡድን ገና በአቅራቢያ ማንም የለም። ሲኖሩ ይደርሳቸዋል።",
  "chat.thread.no_group_key": "ከእንግዲህ በዚህ ቡድን ውስጥ አይደለህም፤ ስለዚህ ይህ ሊላክ አይችልም",
  "chat.thread.no_reach_offline":
    "ኢንተርኔት ጠፍቷል፤ በአቅራቢያም አቻዎች የሉም · ይህ ገና ማንም አልደረሰውም",
  "chat.thread.mention": "{name} ን ጥቀስ",
  "chat.thread.someone_talking": "{hold}። {name} እየተናገረ ነው።",
  "chat.thread.attach_note":
    "ፋይሎች የሚላኩት በብሉቱዝ ክልል ውስጥ ብቻ ነው። ጽሑፍና ክፍያዎች የኢንተርኔት እውቂያዎችን ይደርሳሉ፤ አባሪዎች ግን አይደርሱም።",
  "chat.thread.message_peer": "ለ{name} መልእክት ላክ",
  "chat.thread.send": "መልእክት ላክ",
  "chat.thread.group": "ቡድን",
  "chat.bridge.nearby_only": "በአቅራቢያ ብቻ፦ ይህን መልእክት ከሜሽ ድልድዩ አርቀው",
  "chat.bridge.nearby_label": "በአቅራቢያ ብቻ · በብሉቱዝ ላይ ይቆያል",
  "chat.bridge.bridging_label": "ወደ አቅራቢያ አካባቢዎች እየተሻገረ · ለአቅራቢያ ብቻ ንካ",
  "chat.screenshot.you_took": "ቅጽበታዊ ገጽ እይታ አንስተሃል",
  "chat.screenshot.you_took_private": "ቅጽበታዊ ገጽ እይታ አንስተሃል · ለማንም አልተነገረም",
  "chat.screenshot.heads_up": "አስተውል",
  "chat.screenshot.notice": "* {name} ቅጽበታዊ ገጽ እይታ አንስቷል *",
  "chat.screenshot.notified_dm":
    "የዚህን ውይይት ቅጽበታዊ ገጽ እይታ እንዳነሳህ ለ{name} ተነግሮታል።",
  "chat.screenshot.notified": "ቅጽበታዊ ገጽ እይታ እንዳነሳህ በዚህ ሰርጥ ውስጥ ላሉ ሁሉ ተነግሯቸዋል።",
  "chat.screenshot.not_notified":
    "ለማንም አልተነገረም። ይህ ሰርጥ ይፋዊ ነው፤ ስለዚህ ቅጽበታዊ ገጽ እይታን ማስታወቅ አንተ እዚህ እንደነበርክ ይመዘግብ ነበር።",
  "chat.thread.error": "ስህተት",
  "chat.thread.go_back": "ተመለስ",
  "chat.bubble.via_bridge": "በሜሽ ድልድዩ በኩል",
  "chat.bubble.view_profile": "የ{name} መገለጫን ተመልከት",
  "chat.bubble.forwarded": "የተላለፈ",
  "chat.bubble.attachment": "አባሪ",
  "chat.bubble.a11y": "{sender}፦ {body}። ለተጨማሪ አማራጮች ተጭነህ ያዝ።",
  "chat.bubble.failed_retry": "መላክ አልተሳካም። እንደገና ለመሞከር ንካ።",

  // ---- Chats: message actions and info ----
  "chat.info.title": "የመልእክት መረጃ",
  "chat.info.delivered_to": "ለ{name} ደርሷል",
  "chat.info.read_by": "በ{name} ተነቧል",
  "chat.info.group_reach_desc": "አሁን ሊደረሱ የሚችሉ፤ የመድረስ ማረጋገጫ አይደለም",
  "chat.info.group_alone": "ሌሎች አባላት የሉም",
  "chat.info.today_at": "ዛሬ {time}",
  "chat.info.sending": "እየተላከ…",
  "chat.info.failed": "መላክ አልተሳካም",
  "chat.info.courier": "በጓደኛ የተጓጓዘ",
  "chat.info.sent": "ተልኳል",
  "chat.info.queued": "ለመላክ በመጠባበቅ ላይ",
  "chat.info.waiting": "በመጠባበቅ ላይ…",
  "chat.action.info": "የመልእክት መረጃ",
  "chat.action.save_photos": "ወደ ፎቶዎች አስቀምጥ",
  "chat.action.save_copy": "ቅጂ አስቀምጥ",
  "chat.action.forward": "አስተላልፍ",
  "chat.action.select": "ምረጥ",
  "chat.select.cancel": "ምርጫን ሰርዝ",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "ካሜራ",
  "chat.attach.camera_desc": "ፎቶ ወይም ቪዲዮ አንሳ",
  "chat.attach.library": "የፎቶ ቤተ-መጻሕፍት",
  "chat.attach.library_desc": "ከቤተ-መጻሕፍትህ ምረጥ",
  "chat.attach.document": "ሰነድ",
  "chat.attach.document_desc": "ማንኛውንም ፋይል ወይም PDF ላክ",
  "chat.attach.voice": "የድምፅ መልእክት",
  "chat.attach.voice_desc": "የድምፅ መልእክት ቅዳና ላክ",
  "chat.attach.ecash": "ecash ላክ",
  "chat.attach.ecash_desc": "ከቦርሳህ Cashu sats ላክ",
  "chat.attach.location": "አካባቢ",
  "chat.attach.location_desc": "አሁን ያለህበትን ላክ",
  "chat.attach.title": "አያይዝ",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "አካባቢ ተጋርቷል",
  "chat.location.received_summary": "አካባቢያቸውን አጋርተዋል",
  "chat.location.title": "አካባቢ",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "ከ{ago} በፊት የተወሰደ",
  "chat.location.open_maps": "በMaps ውስጥ ክፈት",
  "chat.location.no_forward": "አካባቢዎች አይተላለፉም",
  "chat.location.no_forward_body":
    "አካባቢ የሚላከው ለአንድ ሰው ነው። ሌላ ሰው እንዲኖረው ከፈለግህ በምትኩ የራስህን አጋራ።",
  "chat.location.no_fix": "ይህ ምን ያህል እንደሚርቅ ለማየት አካባቢን ፍቀድ",
  "chat.location.send_title": "አካባቢህን ላክ",
  "chat.location.send_body": "{name} አንድ ነጥብ ብቻ ያያል፦ አሁን ያለህበትን። መዘመኑን አይቀጥልም።",
  "chat.location.send": "አካባቢ ላክ",
  "chat.location.finding": "አካባቢህ እየተፈለገ…",
  "chat.location.no_location": "አካባቢህ ሊገኝ አልቻለም",
  "chat.location.no_location_body":
    "የአካባቢ መዳረሻን ፍቀድና የአካባቢ አገልግሎቶች መብራታቸውን አረጋግጥ፣ ከዚያ እንደገና ሞክር።",
  "chat.location.not_delivered": "አካባቢህ ሊላክ አልቻለም",
  "chat.location.not_delivered_body":
    "አካባቢ የሚላከው ወቅታዊ ሆኖ ሳለ ብቻ ስለሆነ ለኋላ በተራ ላይ አይቀመጥም። {name} ሊደረስበት ሲችል እንደገና ሞክር።",
  "chat.location.direction.n": "ሰሜን",
  "chat.location.direction.ne": "ሰሜን ምስራቅ",
  "chat.location.direction.e": "ምስራቅ",
  "chat.location.direction.se": "ደቡብ ምስራቅ",
  "chat.location.direction.s": "ደቡብ",
  "chat.location.direction.sw": "ደቡብ ምዕራብ",
  "chat.location.direction.w": "ምዕራብ",
  "chat.location.direction.nw": "ሰሜን ምዕራብ",
  "chat.attach.send_anyway": "ለማንኛውም ላክ",
  "chat.attach.bitchat_too_big": "ይህ ላይደርስ ይችላል",
  "chat.attach.bitchat_too_big_body":
    "{name} በbitchat ላይ ነው፤ እሱ ደግሞ ትልቅ ፋይልን በመሃል ላይ ይተወዋል። ከ350 KiB በታች አስተማማኝ ነው። ለAirhop እውቂያ መላክ እንዲህ ያለ ገደብ የለውም።",
  "chat.attach.bitchat_unopenable": "ይህን መክፈት ላይችሉ ይችላሉ",
  "chat.attach.bitchat_unopenable_body":
    "{name} በbitchat ላይ ነው፤ እሱ ፎቶዎችንና የድምፅ መልእክቶችን ያሳያል፤ ሌላውን ግን ሊከፍተው እንደማይችል ፋይል ይዘረዝረዋል። ይደርሳል፤ ላያዩት ብቻ ይችላሉ።",
  "chat.attach.file": "ፋይል አያይዝ",
  "chat.attach.unavailable": "እዚህ አባሪዎች አይገኙም",
  "chat.attach.not_sent": "አባሪው አልተላከም",
  "chat.attach.read_failed": "ያን ፋይል በማንበብ ላይ ችግር ተፈጠረ። ሌላ ሞክር።",
  "chat.attach.caption": "መግለጫ ጨምር…",
  "chat.attach.send": "አባሪ ላክ",
  "chat.attach.generic": "አባሪ",
  "chat.media.view_full": "ፎቶውን በሙሉ ማያ ተመልከት",
  "chat.media.gone_photo": "ፎቶው በዚህ መሣሪያ ላይ የለም",
  "chat.media.gone_video": "ቪዲዮው በዚህ መሣሪያ ላይ የለም",
  "chat.media.gone_voice": "የድምፅ መልእክቱ በዚህ መሣሪያ ላይ የለም",
  "chat.media.gone_file": "ፋይሉ በዚህ መሣሪያ ላይ የለም",
  "chat.media.gone_note": "ከ7 ቀናት በኋላ ወይም ጊዜያዊ ማከማቻው ሲጸዳ ተወግዷል",
  "chat.media.ask_resend": "እንደገና ጠይቅ",
  "chat.media.resend_draft": "ያንን {kind} እንደገና ልትልክልኝ ትችላለህ?",
  "chat.media.kind_photo": "ፎቶ",
  "chat.media.kind_video": "ቪዲዮ",
  "chat.media.kind_voice": "የድምፅ መልእክት",
  "chat.media.kind_file": "ፋይል",
  "chat.media.pause_voice": "የድምፅ መልእክቱን አቁም",
  "chat.media.play_voice": "የድምፅ መልእክቱን አጫውት",
  "chat.media.voice_position": "የድምፅ መልእክቱ ቦታ",
  "chat.media.voice_scrub": "ወደዚያ ነጥብ ለመዝለል በአሞሌዎቹ ላይ ንካ",
  "chat.media.image": "ምስል",
  "chat.media.tap_load_photo": "ፎቶውን ለመጫን ንካ",
  "chat.media.open_document": "{name} ን ክፈት",
  "chat.media.document": "ሰነድ",
  "chat.media.tap_load_video": "ቪዲዮውን ለመጫን ንካ",
  "chat.media.video": "ቪዲዮ",
  "chat.media.photo": "ፎቶ",
  "chat.media.close_photo": "ፎቶውን ዝጋ",
  "chat.media.save_photo": "ፎቶውን ወደ ፎቶዎችህ አስቀምጥ",
  "chat.media.share_photo": "ፎቶውን አጋራ",
  "chat.media.saved_videos": "ወደ ቪዲዮዎችህ ተቀምጧል",
  "chat.media.saved_photos": "ወደ ፎቶዎችህ ተቀምጧል",
  "chat.media.not_saved": "አልተቀመጠም",
  "chat.media.cant_open": "ፋይሉ ሊከፈት አይችልም",
  "chat.media.no_app": "ይህ መሣሪያ ይህን ፋይል የሚከፍት ወይም የሚያጋራ መተግበሪያ የለውም።",
  "chat.media.open_failed": "ፋይሉ ሊከፈት አልቻለም። ከጊዜያዊ ማከማቻው ተጠርጎ ሊሆን ይችላል።",
  "media.blocked.nostr_only":
    "ይህን ሰው የምታውቀው በአስተላላፊ በኩል ብቻ ነው። ጽሑፍ ብቻ ነው የሚቻለው። ፎቶዎች፣ ፋይሎችና የድምፅ መልእክቶች ብሉቱዝ ይፈልጋሉ።",
  "media.blocked.private_channel":
    "የስርጭት አባሪ ይፈረማል እንጂ አይመሰጠርም፤ ስለዚህ ወደ የግል ሰርጥ መላኩ ግልጽ ሆኖ ይተወዋል፤ እዚህ ያለው ጽሑፍ ግን የተመሰጠረ ሆኖ ይቀጥላል።",
  "media.blocked.private_group":
    "የስርጭት አባሪ ይፈረማል እንጂ አይመሰጠርም፤ ስለዚህ ወደ የግል ቡድን መላኩ ግልጽ ሆኖ ይተወዋል፤ እዚህ ያለው ጽሑፍ ግን የተመሰጠረ ሆኖ ይቀጥላል።",
  "media.blocked.location_channel":
    "የአካባቢ ሰርጥ ሰዎችን የሚደርሰው በኢንተርኔት ነው፤ ፎቶዎች፣ ፋይሎችና የድምፅ መልእክቶች ደግሞ በብሉቱዝ ይጓዛሉ፤ ስለዚህ ፈጽሞ አይደርሱም።",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "እዚህ የድምፅ መልእክቶች አይገኙም",
  "chat.voice.hold_live": "በቀጥታ ለመናገር ተጭነህ ያዝ",
  "chat.voice.hold_record": "የድምፅ መልእክት ለመቅዳት ተጭነህ ያዝ",
  "chat.voice.cancel_recording": "ቅጂውን ሰርዝ",
  "chat.voice.slide_cancel": "ለመሰረዝ አንሸራትት",
  "chat.voice.release_cancel": "ለመሰረዝ ልቀቅ",
  "chat.voice.a11y_toggle": "መናገር ለመጀመር ወይም ለማቆም ሁለቴ ንካ።",
  "chat.voice.limit_reached": "የሁለት ደቂቃ ገደብ ተደርሷል፤ ለመላክ ልቀቅ",
  "chat.voice.limit_sent": "የሁለት ደቂቃ ገደብ ተደርሶ መልእክቱ ተልኳል",
  "chat.voice.stop_send": "ቅጂውን አቁምና ላክ",
  "chat.voice.lift_lock": "ሳትይዝ ለመቅዳት ወደ ላይ አንሸራትት",
  "chat.voice.live_speaking": "{name} እየተናገረ ነው",
  "voice.unavailable": "ቀጥታ ድምፅ አይገኝም",
  "voice.recording_stopped": "ቅጂ ቆሟል",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "የካሜራ መዳረሻ",
  "chat.perm.camera_purpose": "ለመላክ ፎቶ ለማንሳት",
  "chat.perm.photo_label": "የፎቶ መዳረሻ",
  "chat.perm.photo_purpose": "ለመላክ ፎቶ ወይም ቪዲዮ ለመምረጥ",
  "chat.perm.photo_save_purpose": "ይህን ወደ ፎቶዎችህ ለማስቀመጥ",
  "chat.perm.mic_label": "የማይክሮፎን መዳረሻ",
  "chat.perm.mic_live_purpose": "በአቅራቢያ ካሉ ሰዎች ጋር ለመነጋገር",
  "chat.perm.mic_note_purpose": "የድምፅ መልእክት ለመቅዳት",
  "chat.perm.recording_stopped": "ቅጂ ቆሟል",
  "chat.perm.record_failed": "ቅጂው ሊጀመር አልቻለም። የማይክሮፎን ፈቃዶችን አረጋግጥ።",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "ተወስዷል",
  "chat.ecash.reclaimed": "መልሶ ተገኝቷል",
  "chat.ecash.claiming": "እየተወሰደ…",
  "chat.ecash.claim": "ውሰድ",
  "chat.ecash.claim_amount": "{amount} {unit} ውሰድ",
  "chat.ecash.already_claimed": "አስቀድሞ ተወስዷል",
  "chat.ecash.already_claimed_body":
    "በዚህ ቶከን ውስጥ ያለ እያንዳንዱ ማረጋገጫ አስቀድሞ በቦርሳህ ውስጥ ነው፤ ስለዚህ ምንም አልተጨመረም።",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "በተቻለ መጠን እንዲደርስ ለሜሹ ተሰጥቷል",
  "chat.info.queued_desc": "ወደ እነሱ የሚወስድ መንገድ እስኪኖር ድረስ በዚህ ስልክ ላይ ተይዟል",
  "chat.info.reclaimed": "መልሶ ተገኝቷል",
  "chat.info.reclaimed_desc": "ይህን ክፍያ ወደ ቦርሳህ መልሰኸዋል፤ ስለዚህ አይደርስም",
  "chat.info.about": "ስለ",
  "chat.info.group_desc":
    "የግል ቡድን። ማንበብ የሚችሉት ፈጣሪው የጨመራቸው አባላት ብቻ ናቸው፤ በብሉቱዝ ላይም ይቆያል።",
  "chat.info.teleported_desc":
    "ለዚህ የጂኦሃሽ ሕዋስ የተዘጋጀ ይፋዊ የአካባቢ ሰርጥ። በሕዋሱ ውስጥ ያለ ማንኛውም ሰው፣ በAirhop ይሁን በbitchat፣ በኢንተርኔት ይጋራዋል። አንተ በአካል እዚህ አይደለህም፤ ከርቀት ነህ።",
  "chat.info.custom_desc":
    "ብጁ ሰርጥ። ስሙን የሚያውቅ ማንኛውም ሰው ከማንኛውም የAirhop ወይም የbitchat መሣሪያ ሊቀላቀል ይችላል።",
  "chat.info.private_e2ee": "የግል · ከጫፍ እስከ ጫፍ የተመሰጠረ",
  "chat.info.public_plain": "ይፋዊ · ያልተመሰጠረ",
  "chat.info.group_privacy":
    "ይህን ቡድን ማንበብ የሚችሉት ከታች የሚታዩት አባላት ብቻ ናቸው። መልእክቶች በብሉቱዝ ላይ ይቆያሉ፤ ስለዚህ ከክልል ውጭ ያሉ አባላት ሲመለሱ ይቀበሏቸዋል።",
  "chat.info.teleport_privacy":
    "ከርቀት የሄድክበት ቦታ። በዚህ ሕዋስ ውስጥ ያሉትን ሁሉ በኢንተርኔት ይደርሳል፤ በብሉቱዝ ክልል ውስጥ ያለን ማንንም ግን አይደርስም።",
  "chat.info.location_off_privacy":
    "አካባቢ ጠፍቷል፤ ስለዚህ ይህ ሰርጥ በአቅራቢያ ያሉ መሣሪያዎችን የሚደርሰው በብሉቱዝ ብቻ ነው። የአካባቢውን ሕዋስ በኢንተርኔት ለመድረስ አካባቢን አብራ።",
  "chat.info.invite_privacy":
    "ማንበብ የሚችሉት በአገናኙ የጋበዝካቸው ሰዎች ብቻ ናቸው። ከሌሎች ሁሉ ተደብቆ ይቆያል፤ በአቅራቢያ ካሉ አቻዎችም እንኳ።",
  "chat.info.public_privacy":
    "የሚቀላቀል ማንኛውም ሰው እያንዳንዱን መልእክት ማንበብ ይችላል። ለግል ውይይት ቀጥተኛ መልእክት ተጠቀም፤ ቀጥተኛ መልእክቶች ከጫፍ እስከ ጫፍ የተመሰጠሩ ናቸው።",
  "chat.info.remove_member": "አባል አስወግድ",
  "chat.info.remove_member_body":
    "{name} ከቡድኑ ይወገድ? የቡድኑ ቁልፍ ስለሚቀየር አዲስ መልእክቶችን ማንበብ አይችሉም።",
  "chat.info.message_member": "ለ{name} መልእክት ላክ",
  "chat.info.remove_member_a11y": "{name} አስወግድ",
  "chat.info.no_addable": "የሚጨመሩ ሊደረሱ የሚችሉ አቻዎች የሉም። አባላት በአቅራቢያ መሆን አለባቸው።",
  "chat.info.add_count": "{count} ጨምር",
  "chat.info.teleported_tag": "{level}  ·  ከርቀት",
  "chat.info.active": "ንቁ",
  "chat.info.members": "አባላት",
  "chat.info.bookmark": "ይህን ቦታ ምልክት አድርግ",
  "chat.info.remove_bookmark": "ምልክቱን አስወግድ",
  "chat.info.default_notice": "ነባሪ ሰርጦች ሊለቀቁ አይችሉም። የAirhop የሜሽ ፕሮቶኮል አካል ናቸው።",
  "chat.info.custom_channel": "ብጁ ሰርጥ",
  "chat.info.geohash": "ጂኦሃሽ",
  "chat.info.copy_geohash": "ጂኦሃሹን ቅዳ",
  "chat.info.relays": "አስተላላፊዎች",
  "chat.info.show_relays": "ይህን ሰርጥ የሚያጓጉዙትን አስተላላፊዎች አሳይ",
  "chat.info.relay_custom": "ብጁ",
  "chat.info.relays_none": "ምንም የለም። ይህ ሕዋስ አሁን የብሉቱዝ ብቻ ነው።",
  "chat.info.search_members": "አባላትን ፈልግ",
  "chat.info.search_members_placeholder": "አባላትን ፈልግ…",
  "chat.info.teleported": "ከርቀት",
  "chat.info.creator": "ፈጣሪ",
  "chat.info.no_matches": "የሚዛመድ የለም",
  "chat.info.no_one_here": "ገና እዚህ ማንም የለም",
  "chat.info.add_members": "አባላት ጨምር",
  "chat.info.add_selected": "የተመረጡ አባላትን ጨምር",
  "chat.info.add": "ጨምር",
  "chat.info.leave_group": "ቡድኑን ልቀቅ",
  "chat.info.leave_channel": "ሰርጡን ልቀቅ",
  "chat.info.leave": "ልቀቅ",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "ከ{date} ጀምሮ በውይይት ላይ",
  "chat.contact.verified_since": "ከ{date} ጀምሮ የተረጋገጠ",
  "chat.contact.anonymous": "ስመ-አልባ",
  "chat.contact.anonymous_desc": "ሊረጋገጥ የሚችል ዘላቂ ማንነት የሌለው የጂኦሃሽ ቅጽል ስም",
  "chat.contact.verified": "የተረጋገጠ",
  "chat.contact.verified_desc": "የQR ኮዳቸው ተቃኝቷል",
  "chat.contact.verified_desc_compared": "ከእነሱ ጋር ኮዶች ተነጻጽረዋል",
  "chat.contact.not_verified": "አልተረጋገጠም",
  "chat.contact.not_verified_desc":
    "በእውነት እነሱ መሆናቸውን ለማረጋገጥ ኮዳቸውን ቃኝ፣ ወይም በስልክ ጥሪ ላይ ኮድ አነጻጽር",
  "chat.contact.e2ee": "ከጫፍ እስከ ጫፍ የተመሰጠረ",
  "chat.contact.e2ee_nostr": "በNIP-17 በስጦታ የተጠቀለለ፤ ስለዚህ አስተላላፊዎች ሊያነቡት አይችሉም",
  "chat.contact.e2ee_mesh": "Noise XX፤ በAirhop መሣሪያዎች መካከልም Double Ratchet",
  "chat.contact.copy_nostr": "የNostr ይፋዊ ቁልፍን ቅዳ",
  "chat.contact.nostr_key": "የNostr ይፋዊ ቁልፍ",
  "chat.contact.cell_key_note":
    "ይህ ቁልፍ የተገናኛችሁበት አካባቢ ነው። አንዳችሁ ከተንቀሳቀሳችሁ ይቀየራል፤ ውይይቱም ከእሱ ጋር ያበቃል። ከየትም ሆናችሁ ማውራት ለመቀጠል እውቂያዎችን ተለዋወጡ።",
  "chat.contact.peer_name": "የአቻ ስም",
  "chat.contact.peer_id": "የአቻ መለያ",
  "chat.contact.rename": "ስም ቀይር",
  "chat.contact.rename_needs_contact":
    "ስም መቀየር የምትችለው ቁልፎቻቸውን ለያዝካቸው ሰዎች ነው። መጀመሪያ የእውቂያ ካርዶችን ተለዋወጡ፤ ከዚያ ይህ አንተ ብቻ የምታየው ስም ይሆናል።",
  "chat.contact.rename_needs_keys":
    "ለዚህ እውቂያ ገና ቁልፎች የሉም። መልእክት ላክላቸው ወይም ኮዳቸውን ቃኝ፤ ከዚያ አንተ ብቻ የምታየው ስም ልትሰጣቸው ትችላለህ።",
  "chat.contact.renamed_by_you": "አንተ የሰጠሃቸው ስም",
  "chat.contact.copy_peer_id": "የአቻ መለያን ቅዳ",
  "chat.contact.verify": "እውቂያን አረጋግጥ",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "ማስታወቂያዎች",
  "chat.notices.post_area": "በዚህ አካባቢ ማስታወቂያ ለጥፍ",
  "chat.notices.post_mesh": "በሜሹ ላይ ማስታወቂያ ለጥፍ",
  "chat.notices.mark_urgent": "እንደ አስቸኳይ ምልክት አድርግ",
  "chat.notices.post": "ማስታወቂያ ለጥፍ",
  "chat.notices.post_short": "ለጥፍ",
  "chat.notices.delete": "ማስታወቂያውን ሰርዝ",
  "chat.notices.just_now": "አሁን",
  "chat.notices.fades_soon": "በቅርቡ ይጠፋል",
  "chat.notices.1_day": "1 ቀን",
  "chat.notices.3_days": "3 ቀናት",
  "chat.notices.7_days": "7 ቀናት",
  "chat.notices.fading": "እየጠፋ",
  "chat.notices.fades_in_hours": "በ{count} ሰዓት ውስጥ ይጠፋል",
  "chat.notices.fades_in_days": "በ{count} ቀን ውስጥ ይጠፋል",
  "chat.notices.scope_geo": "ጂኦ",
  "chat.notices.scope_mesh": "ሜሽ",
  "chat.notices.urgent_short": "አስቸኳይ",
  "chat.notices.permanent_warning":
    "ፈጽሞ አይጠፋም። ይፋዊ ነው፤ ከዚህ አካባቢ ጋርም የተሳሰረ ነው፤ መልሰህም ልትወስደው አትችልም።",
  "chat.notices.none": "ገና ማስታወቂያዎች የሉም። ለሌሎች እዚህ እንዲቆይ አንድ ለጥፍ።",

  // ---- Chats: search results ----
  "chat.search.photos": "ፎቶዎች",
  "chat.search.videos": "ቪዲዮዎች",
  "chat.search.audio": "ድምፅ",
  "chat.search.documents": "ሰነዶች",
  "chat.search.links": "አገናኞች",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "በ{filter} አጣራ",
  "chat.search.no_matches": "ከ«{query}» ጋር የሚዛመድ {filter} የለም",
  "chat.search.no_media": "ገና {filter} የለም",
  "chat.search.result_a11y": "{chat}፣ {kind} ከ{sender}",
  "chat.search.you": "አንተ",
  "chat.search.section_chats": "ውይይቶች",
  "chat.search.section_messages": "መልእክቶች",
  "chat.search.section_notices": "ማስታወቂያዎች",
  "chat.search.hint": "መልእክቶችንና ውይይቶችን ፈልግ፣ ወይም ከላይ አንድ ማጣሪያ ምረጥ።",
  "chat.search.no_results": "ለ«{query}» ውጤት የለም",
  "chat.search.open_chat": "{name} ን ክፈት",
  "chat.search.message_a11y": "{chat}፣ ከ{sender} የመጣ መልእክት፦ {snippet}",
  "chat.search.notice_a11y": "በ{chat} ውስጥ ከ{author} የመጣ ማስታወቂያ፦ {snippet}",
  "chat.search.urgent": "አስቸኳይ ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "በዚህ ዝርዝር ውስጥ {count} አሉ። ማጽዳት የሚያስወግዳቸው ከዚህ ብቻ ነው፤ መልእክቶቹም በየውይይታቸው ውስጥ ያልተነበቡ ሆነው ይቀራሉ። ሁሉንም እንደተነበቡ ምልክት ማድረግ ሁለቱንም ያጸዳል።",
  "chat.notif.mark_all_read": "ሁሉንም እንደተነበቡ ምልክት አድርግ",
  "chat.notif.clear_list": "ዝርዝሩን አጽዳ",
  "chat.notif.clear_all_a11y": "ሁሉንም {count} ማሳወቂያዎች አጽዳ",
  "chat.notif.title": "ማሳወቂያዎች",
  "chat.notif.clear_short": "አጽዳ",
  "chat.notif.close": "ማሳወቂያዎችን ዝጋ",
  "chat.notif.none": "ገና ማሳወቂያዎች የሉም",
  "chat.notif.none_desc":
    "ከሰርጦችህና ከውይይቶችህ የሚመጡ መልእክቶች፣ ጥቅሶችና ማስታወቂያዎች እዚህ ይታያሉ።",
  "chat.notif.new": "አዲስ",
  "chat.notif.notice_in": "በ{channel} ውስጥ ማስታወቂያ",

  // ---- Chats: forward ----
  "chat.forward.title": "አስተላልፍ ወደ…",
  "chat.forward.to": "ወደ {name} አስተላልፍ",
  "chat.forward.cant_send_here": "እዚህ ማስተላለፍ አይቻልም",
  "chat.forward.cant_send_to": "ወደ {name} ማስተላለፍ አይቻልም",
  "chat.forward.channels": "ሰርጦች",
  "chat.forward.groups": "ቡድኖች",
  "chat.forward.locations": "አካባቢዎች",
  "chat.forward.dms": "ቀጥተኛ መልእክቶች",
  "chat.forward.none": "ገና ሌሎች ውይይቶች የሉም",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "ሜሹ እየተጀመረ ነው…",
  "mesh.banner.no_bluetooth": "በዚህ መሣሪያ ላይ ብሉቱዝ የለም · ኢንተርኔት ብቻ",
  "mesh.banner.bluetooth_off": "ብሉቱዝ ጠፍቷል · ሜሽ አይገኝም",
  "mesh.banner.permission_needed": "የብሉቱዝ ፈቃድ ያስፈልጋል",
  "mesh.banner.blocked": "ብሉቱዝ ታግዷል · በቅንብሮች ውስጥ ፍቀድለት",
  "mesh.banner.location_permission": "አቻዎችን ለማግኘት አካባቢ ያስፈልጋል",
  "mesh.banner.advertising_unsupported": "ይህ ስልክ ሌሎችን ማየት ይችላል ግን ራሱ አይታይም",
  "mesh.banner.location_off_android": "አካባቢ ጠፍቷል · Android አቻዎችን ለማግኘት ይፈልገዋል",
  "mesh.banner.paused": "ሜሽ ቆሟል · አንተ ራቅ ብለሃል",
  "mesh.banner.location_off": "አካባቢ ጠፍቷል · የአካባቢ ሰርጦች አይገኙም",
  "mesh.banner.battery_saver": "የባትሪ ቆጣቢ · ማሰሱ ቀንሷል",
  "mesh.banner.wipe_incomplete":
    "ማጽዳቱ አልተጠናቀቀም · የተወሰነ መረጃ ሊቀር ይችላል፤ እንደገና ሲከፈት ይሞከራል",
  "mesh.banner.wifi_off": "Wi-Fi ጠፍቷል · ትላልቅ ፋይሎች ቀስ ብለው ይላካሉ",
  "mesh.banner.clock_skew": "የዚህ ስልክ ሰዓት ትክክል አይደለም · ቀኑንና ሰዓቱን ወደ ራስ-ሰር አድርግ",
  "mesh.banner.internet_off": "ኢንተርኔት ጠፍቷል · ብሉቱዝ ብቻ",
  "mesh.banner.relaying": "በአቅራቢያ አቻ የለም · በNostr በኩል እየተላለፈ ነው",
  "mesh.banner.tor": "Tor በርቷል · የኢንተርኔት ትራፊክ ተመርቷል",
  "mesh.banner.tor_starting": "Tor እየተጀመረ ነው · እየተገናኘ",
  "mesh.banner.tor_blocked": "Tor መገናኘት አልቻለም · ሜሹ አሁንም ይሠራል",
  "mesh.banner.gateway": "የኢንተርኔት መተላለፊያ በርቷል · በአቅራቢያ ያሉ አቻዎች እየተላለፉ ነው",
  "mesh.banner.bridge": "የሜሽ ድልድይ በርቷል · የይፋ ውይይት ተገናኝቷል",
  "mesh.banner.background_limits": "{brand} ሜሹን በጀርባ ሊያቆመው ይችላል",
  "mesh.banner.bridge_across": "የሜሽ ድልድይ በርቷል · {count} ከድልድዩ ማዶ",
  "mesh.banner.action.turn_on": "አብራ",
  "mesh.banner.action.allow": "ፍቀድ",
  "mesh.banner.action.resume": "ቀጥል",
  "mesh.banner.action.fix": "አስተካክል",
  "mesh.banner.hint.resume": "የብሉቱዝ ማስታወቂያንና ማሰስን እንደገና ያበራል",
  "mesh.banner.hint.enable_bluetooth": "Android ብሉቱዝን እንዲያበራ ይጠይቃል",
  "mesh.banner.hint.location_settings": "የስርዓቱን የአካባቢ ቅንብሮች ይከፍታል",
  "mesh.banner.hint.app_settings": "የAirhop ፈቃዶችን በስርዓት ቅንብሮች ውስጥ ይከፍታል",
  "mesh.banner.hint.battery_settings": "የዚህን ስልክ የጀርባ እንቅስቃሴ ቅንብሮች ይከፍታል",
  "mesh.banner.dismiss": "አስወግድ፦ {label}",
  "mesh.banner.hint.dismiss": "ይህን ማስታወሻ ለዘለቄታው ይደብቀዋል",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "በአቅራቢያ ያሉ አቻዎች እየተፈለጉ ነው…",
  "mesh.radar.starting": "ሜሹ እየተጀመረ ነው…",
  "mesh.radar.no_bluetooth": "በዚህ መሣሪያ ላይ ብሉቱዝ የለም",
  "mesh.radar.bluetooth_off": "ብሉቱዝ ጠፍቷል · አይታሰስም",
  "mesh.radar.permission_needed": "የብሉቱዝ ፈቃድ ያስፈልጋል",
  "mesh.radar.blocked": "ብሉቱዝ ታግዷል",
  "mesh.radar.location_permission": "የአካባቢ ፈቃድ ያስፈልጋል",
  "mesh.radar.location_off": "አካባቢ ጠፍቷል · አይታሰስም",
  "mesh.radar.hint_rings": "ክቦቹ የBLE ምልክት ጥንካሬን ያሳያሉ እንጂ ርቀትን አይደለም",
  "mesh.radar.hint_checking": "ብሉቱዝና ፈቃዶች እየተመረመሩ ነው",
  "mesh.radar.hint_internet": "መልእክቶች አሁንም በኢንተርኔት ይተላለፋሉ",
  "mesh.radar.hint_turn_on": "አቻዎችን ለማግኘት ብሉቱዝን አብራ",
  "mesh.radar.hint_allow": "አቻዎችን ለማግኘት ብሉቱዝን ፍቀድ",
  "mesh.radar.hint_allow_settings": "አቻዎችን ለማግኘት በቅንብሮች ውስጥ ብሉቱዝን ፍቀድ",
  "mesh.radar.hint_location_permission":
    "Android 11 እና ከዚያ በታች በብሉቱዝ ለማሰስ አካባቢ ይፈልጋሉ",
  "mesh.radar.hint_android_location":
    "Android የብሉቱዝ ማሰሻ ውጤቶችን ለመመለስ አካባቢ በርቶ ይፈልጋል",
  "mesh.radar.signal_strong": "ጠንካራ",
  "mesh.radar.signal_medium": "መካከለኛ",
  "mesh.radar.signal_weak": "ደካማ",
  "mesh.radar.you_center": "አንተ፣ በሜሹ መሃል",
  "mesh.radar.sonar_hint": "የሶናር ድምፅ ያሰማል። ማሰሱ አስቀድሞ ቀጣይነት ያለው ነው።",
  "mesh.radar.paused": "ሜሽ ቆሟል · አንተ ራቅ ብለሃል",
  "mesh.radar.ring_hint": "የክቡ ቦታ የምልክት ጥንካሬን ያንጸባርቃል እንጂ ርቀትን አይደለም",
  "mesh.radar.set_online": "አቻዎችን ለማግኘት በመገለጫህ ውስጥ ሁኔታህን ወደ ኦንላይን አድርግ",
  "mesh.radar.in_range": "በክልል ውስጥ",
  "mesh.radar.recently_seen": "በቅርቡ የታዩ",
  "mesh.radar.peer_hint": "ለዚህ አቻ መልእክት ለመላክ ወይም ለመክፈል አማራጮችን ይከፍታል",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "አሁን",
  "mesh.peer.none": "በአቅራቢያ አቻ የለም",
  "mesh.peer.none_desc":
    "በብሉቱዝ ክልል ውስጥ ያሉ ሌሎች የAirhop ወይም የbitchat መሣሪያዎች እዚህ ይታያሉ።",
  "mesh.peer.id_copied": "የአቻ መለያ ተቀድቷል",
  "mesh.peer.copy_id": "የአቻ መለያን ቅዳ",
  "mesh.peer.their_name": "{name} ተብሎ ይጠራል",
  "mesh.peer.in_range": "በክልል ውስጥ",
  "mesh.peer.relay": "የማስተላለፊያ ኖድ",
  "mesh.peer.relay_body":
    "አንድ ሰው ሜሹን ለማስፋት አብርቶ የተወው ሬዲዮ ነው። ማንበብ የማይችላቸውን መልእክቶች ያጓጉዛል። እዚህ መልእክት የሚላክለት ሰው የለም።",
  "mesh.peer.send_dm": "ቀጥተኛ መልእክት ላክ",
  "mesh.peer.message": "መልእክት",
  "mesh.peer.send_sats": "ecash ላክ",
  "mesh.peer.amount_placeholder": "መጠን በsats",
  "mesh.peer.amount_first": "ecash ላክ፤ መጀመሪያ መጠን አስገባ",
  "mesh.peer.cancel_send": "ecash መላክን ሰርዝ",
  "mesh.peer.view_peer": "አቻ {name} ን ተመልከት",
  "mesh.peer.view_peer_online": "አቻ {name} ን ተመልከት፣ ኦንላይን",
  "mesh.peer.last_seen": "ከ{ago} በፊት ታይቷል",
  "mesh.peer.send_amount": "{amount} sats ላክ",
  "mesh.peer.direct": "ቀጥተኛ ግንኙነት",
  "mesh.peer.check_distance": "ርቀት መርምር",
  "mesh.peer.checking": "እየተመረመረ",
  "mesh.peer.no_reply": "ምላሽ የለም",
  "mesh.peer.no_reply_hint": "ተንቀሳቅሰው ሊሆን ይችላል፣ ወይም መተግበሪያቸው ላይመልስ ይችላል",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "ክልል",
  "mesh.level.province": "ዞን",
  "mesh.level.city": "ከተማ",
  "mesh.level.neighborhood": "ሰፈር",
  "mesh.level.block": "የከተማ ብሎክ",
  "mesh.level.building": "ሕንፃ",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "ሊወጣ የሚችል",
  "wallet.balance.unit_hint": "በሳቶሺና በቢትኮይን መካከል ይቀያየራል",
  "wallet.balance.a11y": "ቀሪ ሂሳብ {value} {unit}",
  "wallet.balance.locked":
    "የቦርሳው ማከማቻ ተቆልፏል። የecash ማረጋገጫዎች ቁልፉ በመሣሪያው ቁልፍ ማከማቻ ውስጥ ባለ የተመሰጠረ ፋይል ውስጥ ይቀመጣሉ፤ ያ ፋይል ሊከፈት አልቻለም። መሣሪያህን ክፈትና Airhop ን እንደገና ክፈት።",
  "wallet.balance.tor_blocked":
    "Tor በርቷል፤ ስለዚህ የሚንት ጥያቄዎች ታግደዋል፦ በክፍት አውታረ መረብ ላይ ወጥተው የIP አድራሻህን ከማረጋገጫዎችህ ጋር ያገናኙታል። በሜሽ ላይ መላክና መቀበል አሁንም ይሠራል። በቅንብሮች፣ ደህንነት ስር የሚንት ትራፊክን ፍቀድ።",
  "wallet.balance.unconfirmed_note": "{amount} ገና ከሚንቱ ጋር አልተረጋገጠም",
  "wallet.balance.reserved_note": "{amount} በመንገድ ላይ ላለ ክፍያ ተይዟል",
  "wallet.balance.other_mint_note": "{amount} በተለየ የሚንት መለያ ውስጥ",
  "wallet.balance.test_mint_note":
    "ከሙከራ ሚንት የመጣ የጨዋታ ገንዘብ ያካትታል። ቢትኮይን አይደለም፤ ሊመነዘርም አይችልም።",
  "wallet.token": "ቶከን",
  "wallet.action.send": "የecash ቶከን ላክ",
  "wallet.action.send_disabled": "የecash ቶከን ላክ፤ ቀሪ ሂሳብ ሲኖርህ ብቻ ይገኛል",
  "wallet.action.receive": "የecash ቶከን ተቀበል",
  "wallet.action.zap": "ለNostr እውቂያ zap ላክ",
  "wallet.action.zap_disabled": "ለNostr እውቂያ zap ላክ፤ ቀሪ ሂሳብ ሲኖርህ ብቻ ይገኛል",
  "wallet.action.add_mint": "የCashu ሚንት ጨምር",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "ቶከኑ ሊገነባ አልቻለም",
  "wallet.send.title": "ecash ላክ",
  "wallet.send.amount_in": "መጠን በ{unit}",
  "wallet.send.body":
    "አስቀድሞ ካሉህ ማረጋገጫዎች ከመስመር ውጭ ተገንብቷል። ቶከኑ መድረሱን እስክታረጋግጥ ድረስ ከቀሪ ሂሳብህ ለዘለቄታው የሚወጣ ምንም ነገር የለም።",
  "wallet.send.stale_fee_note":
    "ክፍያዎቹ መጨረሻ የተመረመሩት ከ{days} ቀን በፊት ነው። ይህ ሚንት ከዚያ ወዲህ ክፍያውን ጨምሮ ከሆነ መላኩ ትንሽ ተጨማሪ ሊያስከፍል ይችላል።",
  "wallet.send.fee_note":
    "{spend} {unit} ከቀሪ ሂሳብህ ይወጣል፤ ተጨማሪው {fee} እነሱ ሊከፍሉት የነበረውን የሚንት ክፍያ ይሸፍናል",
  "wallet.send.qr_too_big":
    "ይህ ቶከን በጣም በብዙ ሳንቲሞች ተከፋፍሎ በQR ኮድ ውስጥ አይገባም። በምትኩ አጋራው ወይም ቅዳው፤ ወይም አንድ ላይ ለማድረግ በሚንቱ ላይ አድስ።",
  "wallet.send.bearer_note":
    "ይህን ሕብረቁምፊ የያዘ ማንኛውም ሰው የገንዘቡ ባለቤት ነው። ማረጋገጫዎቹ ተይዘዋል እንጂ አልወጡም፦ ወደ ማንም ካልደረሰ በመጠባበቅ ላይ ስር መልሰህ ልታገኛቸው ትችላለህ።",
  "wallet.send.qr_too_big_short":
    "ይህ ቶከን በጣም በብዙ ሳንቲሞች ተከፋፍሎ በQR ኮድ ውስጥ አይገባም። በምትኩ አጋራው ወይም ቅዳው።",
  "wallet.send.scan_note":
    "ከቦርሳቸው ይህን እንዲቃኙት አድርግ። እንደደረሰ እስክትመዘግብ ድረስ አሁንም መልሰህ ልታገኘው ትችላለህ።",
  "wallet.send.mesh_note":
    "ቶከኑ በሜሽ ላይ እንደ የተመሰጠረ ቀጥተኛ መልእክት ይወጣል። ኢንተርኔት አያስፈልግም።",
  "wallet.send.no_peers_note":
    "በአቅራቢያ ያሉ መሣሪያዎችን ለማግኘት የሜሽ ትሩን ክፈት፣ ወይም ቶከኑን በሌላ መንገድ አጋራ።",
  "wallet.send.send_to": "ወደ {name} ላክ",
  "wallet.send.memo": "ማስታወሻ (አማራጭ፤ ከቶከኑ ጋር ይጓዛል)",
  "wallet.send.building": "እየተገነባ…",
  "wallet.send.build": "ቶከን ገንባ",
  "wallet.send.inexact_body":
    "ማረጋገጫዎችህ ከመስመር ውጭ በትክክል {amount} {unit} ሊሠሩ አይችሉም። ልትገነባው የምትችለው ትንሹ ቶከን {spend} {unit} ነው፤ ከመስመር ውጭ ደግሞ መልስ የለም፦ ተጨማሪው {extra} {unit} ወደ ተቀባዩ ይሄዳል።\n\nበመስመር ላይ ሆነህ በሚንቱ ማደስ ማረጋገጫዎችህን ይህን ትክክለኛ የሚያደርጉ ክፍልፋዮች ይከፋፍላቸዋል።",
  "wallet.send.send_amount": "{amount} ላክ",
  "wallet.send.sent_to": "{amount} {unit} ወደ {name} ተልኳል",
  "wallet.send.sent_to_body":
    "{route} እነሱ መቀበላቸውን እስክታረጋግጥ ድረስ፣ ወይም ሚንቱ ማረጋገጫዎቹ መመንዘራቸውን እስኪነግረን ድረስ፣ በመጠባበቅ ላይ ስር መልሶ የሚገኝ ሆኖ ይቆያል።",
  "wallet.send.copy_token": "ቶከኑን ቅዳ",
  "wallet.send.share_token": "ቶከኑን አጋራ",
  "wallet.send.open_in_wallet": "ይህን ቶከን በሌላ ቦርሳ ውስጥ ክፈት",
  "wallet.send.open_in_wallet_short": "በቦርሳ ውስጥ ክፈት",
  "wallet.send.to_peer": "ቶከኑን በአቅራቢያ ላለ አቻ ላክ",
  "wallet.send.to_peer_short": "ለአቻ ላክ",
  "wallet.send.mark_delivered": "እንደደረሰ መዝግብና ጨርስ",
  "wallet.send.they_got_it": "ደርሷቸዋል",
  "wallet.send.keep_pending": "ይህን ክፍያ በመጠባበቅ ላይ አቆይ",
  "wallet.send.decide_later": "በኋላ ወስን",
  "wallet.send.no_peers": "በክልል ውስጥ አቻ የለም",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "ይህ የራስህ ክፍያ ነው",
  "wallet.receive.own_payment_body":
    "እነዚህ ሳንቲሞች ገና ላልጨረስከው ክፍያ ተይዘው ስለሆነ የሚጠየቅ ነገር የለም። በቀጥታ ወደ ቀሪ ሂሳብህ ለመመለስ በዚያ ክፍያ ላይ መልሶ ማግኘትን ተጠቀም።",
  "wallet.receive.already_have": "አስቀድሞ በቦርሳህ ውስጥ ነው",
  "wallet.receive.already_have_body":
    "በዚህ ቶከን ውስጥ ያለ እያንዳንዱ ማረጋገጫ አስቀድሞ እዚህ ተከማችቷል፤ ስለዚህ ምንም አልተጨመረም። ቀሪ ሂሳቦች አልተቀየሩም።",
  "wallet.receive.stored_unconfirmed":
    "ከ{mint} ተከማችቷል፤ ግን ገና ከሚንቱ ጋር አልተረጋገጠም ({reason})።",
  "wallet.receive.offline": "ከመስመር ውጭ",
  "wallet.receive.redeemed_here":
    "በ{mint} ተመንዝሯል። እነዚህ ማረጋገጫዎች አሁን የአንተ ብቻ ናቸው፦ የላኪው ቅጂ ከእንግዲህ አይሠራም።",
  "wallet.receive.memo_quoted": "\n\n«{memo}»",
  "wallet.receive.redeemed_at":
    "በ{mint} ተመንዝሯል። አሁን በማስረጃ የአንተ ነው፦ የላኪው የዚህ ቶከን ቅጂ ከእንግዲህ አይሠራም።",
  "wallet.receive.stored_pending":
    "ከ{mint} ተከማችቷል፤ ግን ሚንቱ ገና አለመውጣቱን አላረጋገጠም{dleq}። በመስመር ላይ ስትሆን ከቦርሳ ትሩ አድስ።",
  "wallet.receive.dleq_inline": " (ፊርማው ግን ትክክል ሆኖ ተገኝቷል፤ ስለዚህ ቶከኑ እውነተኛ ነው)",
  "wallet.receive.dleq_ok": "የሚንቱ ፊርማ ትክክል ሆኖ ተገኝቷል፤ ስለዚህ ቶከኑ እውነተኛ ነው።",
  "wallet.receive.dleq_uncached":
    "የሚንቱ ቁልፎች እዚህ አልተከማቹም፤ ስለዚህ ፊርማው ከመስመር ውጭ ሊረጋገጥ አልቻለም።",
  "wallet.receive.dleq_warning":
    "በመስመር ላይ እስክታድስ ድረስ ላኪው በመርህ ደረጃ ሌላ ቦታ አውጥቶት ሊሆን ይችላል።",
  "wallet.receive.failed": "መቀበል አልተቻለም",
  "wallet.receive.title": "ecash ተቀበል",
  "wallet.receive.body":
    "የCashu ቶከን ለጥፍ። በመስመር ላይ ስትሆን ወዲያውኑ በሚንቱ ይመነዘራል፤ ከመስመር ውጭ ሲሆን ደግሞ ተከማችቶ በሚቀጥለው ማደስ ጊዜ ይረጋገጣል።",
  "wallet.receive.scan": "የecash QR ኮድ ቃኝ",
  "wallet.receive.scan_short": "QR ቃኝ",
  "wallet.receive.receiving": "እየተቀበለ…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body": "ከ{from}… Nutzap ደርሶ ወደ ቦርሳህ ተመንዝሯል።",
  "wallet.zap.title": "ለNostr ማንነት zap ላክ",
  "wallet.zap.not_npub": "npub አይደለም",
  "wallet.zap.bad_key": "የተሳሳተ ቁልፍ",
  "wallet.zap.invalid_pubkey": "ልክ ያልሆነ pubkey",
  "wallet.zap.invalid_pubkey_body":
    "npub1… ወይም የ64 ቁምፊ ሄክስ የNostr pubkey አስገባ።",
  "wallet.zap.sent": "Nutzap ተልኳል",
  "wallet.zap.failed": "Zap አልተሳካም",
  "wallet.zap.body":
    "የNIP-61 nutzap መረጃ አሳትመው ከሆነ ecash ሌላ ሰው እንዳያወጣው በቁልፋቸው ይቆለፋል፤ መልሶም አይገኝም። ካላሳተሙ ደግሞ በምትኩ መልሶ ሊገኝ በሚችል ቶከን ይሄዳል። የትኛው እንደሆነ ይነገርሃል።",
  "wallet.zap.contact": "ለ{name} zap ላክ",
  "wallet.zap.pubkey_placeholder": "npub1… ወይም የ64 ቁምፊ ሄክስ",
  "wallet.zap.sending": "እየተላከ…",
  "wallet.nostr.copied_body":
    "ይህን ለአንድ ሰው ስጠው፤ ብሉቱዝ ሳያስፈልግ ከAirhop ወይም ከማንኛውም ሌላ የNostr ቦርሳ zap ሊልክልህ ይችላል።",
  "wallet.nostr.copy_key": "ሰዎች zap እንዲልኩልህ የNostr ቁልፍህን ቅዳ",
  "wallet.nostr.your_key": "የአንተ የNostr ቁልፍ",

  // ---- Wallet: mints ----
  "wallet.mint.added": "ሚንት ተጨምሯል",
  "wallet.mint.add_failed": "ሚንቱ ሊጨመር አልቻለም",
  "wallet.mint.added_named": "{name} ተጨምሯል",
  "wallet.mint.added_body":
    "{mint} {units} ያወጣል። ቁልፎቹ በዚህ መሣሪያ ላይ ተከማችተዋል፤ ስለዚህ ከእሱ የሚመጡ ቶከኖች ያለ ኢንተርኔትም ሊረጋገጡ ይችላሉ።",
  "wallet.mint.remove_plain":
    "{mint} ከቦርሳህ ይወገድ? የተከማቹ ቁልፎቹም አብረው ይሄዳሉ፤ ስለዚህ ከእሱ የሚመጡ ቶከኖች ከመስመር ውጭ ሊረጋገጡ አይችሉም።",
  "wallet.mint.title": "ሚንቶች",
  "wallet.mint.none": "ገና ሚንት የለም",
  "wallet.mint.none_desc":
    "ሚንት የአንተን ecash ያወጣል፤ ይመነዝራልም። በLightning ለማስገባት አንድ ጨምር፣ ወይም ቶከን ብቻ ተቀበልና ሚንቱ ለአንተ ይጨመራል።",
  "wallet.mint.add": "ሚንት ጨምር",
  "wallet.mint.add_body":
    "ሚንት የecash ህን የሚደግፈውን Bitcoin ይይዛል፤ ስለዚህ እዚያ ከምታስቀምጠው ቀሪ ሂሳብ ጋር የምታምነውን ምረጥ። አድራሻው ከመቀመጡ በፊት ይመረመራል። ማንንም ማመን ካልፈለግህ በNutshell የራስህን አሂድ።",
  "wallet.mint.consolidate_body":
    "አንድ ቶከን ሁልጊዜ አንድ ሚንት ብቻ ነው መጥቀስ የሚችለው፤ ስለዚህ በበርካታ ሚንቶች የተከፋፈለ ቀሪ ሂሳብ ትልቁ ከያዘው በላይ የሆነ መጠን ሊከፍል አይችልም። Airhop ሊያዘዋውረው ይችላል፦ እያንዳንዱ ሌላ ሚንት አንተ በመረጥከው ሚንት የወጣን የLightning ደረሰኝ ይከፍላል። ትንሽ የመተላለፊያ ክፍያ ያስከፍላል፤ ኢንተርኔትም ይፈልጋል።",
  "wallet.mint.add_short": "ሚንት ጨምር",
  "wallet.mint.checking": "እየተመረመረ…",
  "wallet.mint.remove_with_balance": "ቀሪ ሂሳብ ያለው ሚንት ይወገድ?",
  "wallet.mint.remove": "ሚንት አስወግድ",
  "wallet.mint.delete_anyway": "ለማንኛውም ሰርዝ",
  "wallet.mint.consolidate": "ሁሉንም ቀሪ ሂሳቦች ወደ አንድ ሚንት አዛውር",
  "wallet.mint.confirm_with": "ማረጋገጫዎችን ከ{mint} ጋር አረጋግጥ",
  "wallet.mint.remove_a11y": "{mint} አስወግድ",
  "wallet.mint.available_amount": "{amount} {unit} ይገኛል",
  "wallet.mint.split_across": "ቀሪ ሂሳቡ በ{count} ሚንቶች ተከፋፍሏል። ወደ አንድ አዛውረው።",
  "wallet.mint.move_everything_to": "ሁሉንም ወደ {mint} አዛውር",
  "wallet.mint.consolidate_title": "ወደ አንድ ሚንት አዛውር",
  "wallet.mint.moving": "እየተዛወረ…",
  "wallet.mint.move": "አዛውር",
  "wallet.mint.moved": "ተዛውሯል",
  "wallet.mint.moved_body":
    "{fees} {unit} የLightning መተላለፊያ ክፍያ ከተከፈለ በኋላ አሁን {amount} {unit} በ{mint} ውስጥ ነው።",
  "wallet.mint.nothing_moved": "ምንም አልተዛወረም",
  "wallet.mint.destination": "· መድረሻ",
  "wallet.mint.will_move": "· ይዛወራል",
  "wallet.mint.issued_by": "አውጪ",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "የAirhop ቦርሳ ሙሌት",
  "wallet.ln.invoice_failed": "ደረሰኙ ሊፈጠር አልቻለም",
  "wallet.ln.price_failed": "የዚህ ደረሰኝ ዋጋ ሊሰላ አልቻለም",
  "wallet.ln.paid": "ተከፍሏል",
  "wallet.ln.deposit_credited":
    "ደረሰኙ ተከፍሎ {mint} {amount} {unit} አውጥቷል። ይህ ቀሪ ሂሳብ ተረጋግጧል፦ ወዲያውኑ ከመስመር ውጭ ልታወጣው ትችላለህ።",
  "wallet.ln.withdrawn":
    "{paid} sats በLightning ተከፍሏል። ሚንቱ {fee} sats የመተላለፊያ ክፍያ አስከፍሏል።",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats በLightning ተከፍሏል። ሚንቱ {fee} sats የመተላለፊያ ክፍያ አስከፍሎ ከተያዘው ውስጥ {change} sats ወደ ቀሪ ሂሳብህ መልሷል።",
  "wallet.ln.payment_failed": "ክፍያው አልተሳካም",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "የLightning sats ን ከመስመር ውጭ ልታወጣው ወደምትችለው ecash ቀይር፣ ወይም ecash ን ወደ ማንኛውም የLightning ደረሰኝ መልሰህ አውጣ። ሁለቱም ኢንተርኔትና ሚንት ይፈልጋሉ።",
  "wallet.ln.deposit_body":
    "ሚንቱ ደረሰኝ ይሰጥሃል። ከማንኛውም የLightning ቦርሳ ክፈለውና sats ከመስመር ውጭ ልታወጣው በምትችለው ecash መልክ ይመለሳል።",
  "wallet.ln.pay_invoice_for":
    "ይህን የ{amount} {unit} ደረሰኝ ክፈል። ቦርሳው ክፍያውን እየተከታተለ ecash ህን በራስ-ሰር ያወጣል።",
  "wallet.ln.expired_body":
    "የዚህ ደረሰኝ ጊዜ አልፎበታል። አስቀድመህ ከፍለኸው ከሆነ ቀሪ ሂሳቡ በራስ-ሰር ይጨመራል።",
  "wallet.ln.waiting_expires": "ክፍያ በመጠባበቅ ላይ · በ{countdown} ውስጥ ጊዜው ያልፋል",
  "wallet.ln.withdraw_body":
    "የbolt11 ደረሰኝ ለጥፍና ሚንቱ ከecash ህ ይከፍለዋል። መጀመሪያ የመተላለፊያ መጠባበቂያው ይነገርሃል፤ መተላለፊያው ያልተጠቀመበት ሁሉ ወደ ቀሪ ሂሳብህ ይመለሳል።",
  "wallet.ln.up_to": "እስከ {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} ክፈል",
  "wallet.ln.deposit": "sats በLightning አስገባ",
  "wallet.ln.deposit_short": "አስገባ",
  "wallet.ln.withdraw": "ወደ የLightning ደረሰኝ አውጣ",
  "wallet.ln.withdraw_short": "አውጣ",
  "wallet.ln.deposit_title": "በLightning አስገባ",
  "wallet.ln.amount_placeholder": "መጠን በsats",
  "wallet.ln.requesting": "እየተጠየቀ…",
  "wallet.ln.get_invoice": "ደረሰኝ አግኝ",
  "wallet.ln.copy_invoice": "ደረሰኙን ቅዳ",
  "wallet.ln.open_wallet": "በLightning ቦርሳ ውስጥ ክፈት",
  "wallet.ln.open_wallet_short": "በቦርሳ ውስጥ ክፈት",
  "wallet.ln.waiting": "ክፍያ በመጠባበቅ ላይ…",
  "wallet.ln.new_invoice": "አዲስ ደረሰኝ ፍጠር",
  "wallet.ln.new_invoice_short": "አዲስ ደረሰኝ",
  "wallet.ln.withdraw_title": "ወደ Lightning አውጣ",
  "wallet.ln.scan_invoice": "የLightning ደረሰኝ QR ኮድ ቃኝ",
  "wallet.ln.paid_from": "የተከፈለው ከ",
  "wallet.ln.invoice": "ደረሰኝ",
  "wallet.ln.routing_reserve": "የመተላለፊያ መጠባበቂያ",
  "wallet.ln.reserved": "ከቀሪ ሂሳብ የተያዘ",
  "wallet.ln.paying": "እየተከፈለ…",
  "wallet.ln.get_quote": "ግምት አግኝ",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "ምትኬ",
  "wallet.backup.setup_failed": "ምትኬው ሊዘጋጅ አልቻለም",
  "wallet.backup.on": "ምትኬ በርቷል",
  "wallet.backup.on_body":
    "ቀሪ ሂሳብህ አሁን ከእነዚያ አሥራ ሁለት ቃላት እንደገና ሊገነባ ይችላል።\n\nሌላ ሰው የሰጠህ ማንኛውም ነገር በሚንቱ እስክታድስ ድረስ ከሐረጉ ውጭ ይቆያል፤ ማገገሚያውም የሚንት ዝርዝርህን ስለሚፈልግ ከቃላቱ ጎን ጽፈህ አስቀምጠው።",
  "wallet.backup.no_phrase": "የተከማቸ ሐረግ የለም",
  "wallet.backup.no_phrase_body":
    "የማገገሚያ ሐረጉ ከመሣሪያው ቁልፍ ማከማቻ ሊነበብ አልቻለም። መሣሪያውን ክፈትና እንደገና ሞክር።",
  "wallet.backup.replace_title": "አሁን ያለህ ሐረግ ይተካ?",
  "wallet.backup.replace_body":
    "አስቀድሞ የማገገሚያ ሐረግ አለህ። የተለየ ሐረግ መመለስ ያንን ይተካዋል። በአሮጌው ሐረግ የተሸፈኑ ሳንቲሞች በዚህ መሣሪያ ላይ ሊወጡ የሚችሉ ሆነው ይቀጥላሉ፤ ግን ሊመለሱ የሚችሉ መሆናቸው ያበቃል፤ ስለዚህ ከመቀጠልህ በፊት አሮጌዎቹ ቃላት መጻፋቸውን አረጋግጥ።",
  "wallet.backup.replace": "ተካ",
  "wallet.backup.invalid_phrase": "ያ ሐረግ ልክ አይደለም",
  "wallet.backup.invalid_phrase_body":
    "ሐረጉ አብሮ የተሠራ የማረጋገጫ ስሌት አለው፤ ይህኛው ግን አላለፈም። በስህተት የተጻፈ፣ የጎደለ ወይም የተለዋወጠ ቃል ፈልግ።",
  "wallet.backup.not_bip39": "እነዚህ የBIP-39 ቃላት አይደሉም፦ {words}። አጻጻፉን አረጋግጥ።",
  "wallet.backup.add_mint_first": "መጀመሪያ ሚንት ጨምር",
  "wallet.backup.add_mint_first_body":
    "ማገገሚያው የሚሠራው አንድን ሚንት ለአንተ የትኞቹን ሳንቲሞች እንደፈረመ በመጠየቅ ነው፤ ስለዚህ የትኛውን መጠየቅ እንዳለበት ማወቅ አለበት። ትጠቀምባቸው የነበሩትን ሚንቶች ጨምርና ከዚያ መልስ።",
  "wallet.backup.restore_failed": "መመለስ አልተሳካም",
  "wallet.backup.phrase": "የማገገሚያ ሐረግ",
  "wallet.backup.state_unconfirmed": "ምትኬ በርቷል ግን አልተረጋገጠም",
  "wallet.backup.state_off": "ምትኬ ጠፍቷል",
  "wallet.backup.badge_on": "በርቷል",
  "wallet.backup.badge_unconfirmed": "ያልተረጋገጠ",
  "wallet.backup.badge_off": "ጠፍቷል",
  "wallet.backup.view": "የማገገሚያ ሐረግን ተመልከት",
  "wallet.backup.setup": "የማገገሚያ ሐረግ አዘጋጅ",
  "wallet.backup.view_short": "ሐረግ ተመልከት",
  "wallet.backup.setup_short": "አዘጋጅ",
  "wallet.backup.restore": "ቦርሳን ከማገገሚያ ሐረግ መልስ",
  "wallet.backup.restore_short": "መልስ",
  "wallet.backup.setup_title": "የማገገሚያ ሐረግ አዘጋጅ",
  "wallet.backup.on_body_short":
    "ቀሪ ሂሳብህ ከአሥራ ሁለቱ ቃላትህ በአዲስ መሣሪያ ላይ እንደገና ሊገነባ ይችላል።",
  "wallet.backup.unconfirmed_body":
    "የተጻፈ ቅጂ እንዳለህ ፈጽሞ አላረጋገጥክም። አሁን ቃላቱ ያሉት በዚህ ስልክ ላይ ብቻ ነው፤ ምትኬ ደግሞ ሊተርፍ የሚገባው ከዚህ ስልክ መጥፋት ነው። ሐረጉን ተመልከትና ጻፈው።",
  "wallet.backup.not_covered":
    "{amount} ገና አልተሸፈነም። የተሰጡህ ሳንቲሞች የላኪያቸውን ሚስጥር ይዘው ስለሚመጡ በሐረግህ ስር የሚገቡት ከተለዋወጡ በኋላ ብቻ ነው። ለማስጠበቅ አንድ ሚንት አድስ።",
  "wallet.backup.off_body":
    "ecash ህ ያለው በዚህ ስልክ ላይ ብቻ ነው። ብታጣው አንተን ጨምሮ ማንም ገንዘቡን ሊያስመልስ አይችልም። የማገገሚያ ሐረግ ቀሪ ሂሳብህን የትም ቦታ እንደገና ሊገነባ የሚችል አሥራ ሁለት ቃላት ነው።",
  "wallet.backup.about_to_see": "አሥራ ሁለት ቃላት ልታይ ነው። እነሱ ራሳቸው ገንዘቡ ናቸው።",
  "wallet.backup.exact_order":
    "አሥራ ሁለት ቃላት፣ በዚሁ ትክክለኛ ቅደም ተከተል። እነሱን የያዘ ማንኛውም ሰው ቀሪ ሂሳብህን ይዟል።",
  "wallet.backup.verify_body":
    "ማንም ያልጻፈው ሐረግ ከሌለ ሐረግ የባሰ ነው፤ ምክንያቱም የሌለ የደህንነት መረብ ስለሚመስል። ለማረጋገጥ ሁለት ቃላት።",
  "wallet.backup.verify_mismatch": "ይህ አይዛመድም። የጻፍከውን ቅጂ አረጋግጥ።",
  "wallet.backup.restore_body":
    "አሥራ ሁለቱን ቃላት አስገባ። Airhop ሳንቲሞችህን እንደገና ያመነጫል፤ እያንዳንዱን ሚንት የትኞቹን እንደፈረመ ይጠይቃል፤ ስለዚህ ቀሪ ሂሳቡ ሚንቱ ከሚይዘው መዝገብ ይመለሳል።",
  "wallet.backup.warn_secret":
    "እነዚህን የሚያነብ ማንኛውም ሰው ቀሪ ሂሳብህን ሊወስድ ይችላል። ቅጽበታዊ ገጽ እይታ አታንሳቸው፤ በዚህ ስልክ ላይም አታስቀምጣቸው።",
  "wallet.backup.warn_paper":
    "በወረቀት ላይ ጻፋቸውና ደህና ቦታ አስቀምጣቸው። ስልኩ ከጠፋ Airhop እንደገና ሊያሳይህ አይችልም።",
  "wallet.backup.warn_scope":
    "እነዚህ የሚገነቡት ecash ህን ብቻ ነው። ማንነትህ፣ ውይይቶችህና እውቂያዎችህ አልተሸፈኑም።",
  "wallet.backup.warn_mints":
    "ማገገሚያው አንድን ሚንት የትኞቹን ሳንቲሞች እንደፈረመ መጠየቅ ስላለበት የሚንት ዝርዝርህን ከቃላቱ ጎን ጻፈው።",
  "wallet.backup.preparing": "እየተዘጋጀ…",
  "wallet.backup.show_phrase": "ሐረጌን አሳየኝ",
  "wallet.backup.your_phrase": "የአንተ የማገገሚያ ሐረግ",
  "wallet.backup.write_down": "እነዚህን ጻፋቸው",
  "wallet.backup.copy_phrase": "የማገገሚያ ሐረግን ወደ ቅንጥብ ሰሌዳ ቅዳ",
  "wallet.backup.copy_clipboard": "ወደ ቅንጥብ ሰሌዳ ቅዳ",
  "wallet.backup.written_down": "ጽፌያቸዋለሁ",
  "wallet.backup.check_copy": "ቅጂህን አረጋግጥ",
  "wallet.backup.confirm": "አረጋግጥ",
  "wallet.backup.restore_title": "ከሐረግ መልስ",
  "wallet.backup.phrase_placeholder": "አሥራ ሁለት ቃላት፣ በክፍተት የተለያዩ",
  "wallet.backup.no_mints_yet":
    "ገና ሚንቶች አልተጨመሩም። ማገገሚያው የተወሰነ ሚንት መጠየቅ ስላለበት መጀመሪያ ትጠቀምባቸው የነበሩትን ጨምር።",
  "wallet.backup.scanning": "እየተፈለገ…",
  "wallet.backup.restore_progress": "{mint} · የቁልፍ ስብስብ {step} ከ{total}",
  "wallet.backup.will_scan":
    "የሚፈለጉት፦ {mints}። ያልጨመርከው ሚንት ፈጽሞ አይጠየቅም፤ ስለዚህ እዚያ ያለው ቀሪ ሂሳብ አይታይም።",
  "wallet.backup.word_n": "ቃል {position}",
  "wallet.backup.unreachable_mints":
    "ሊደረስባቸው አልተቻለም፦ {mints}። እዚያ ያለው ማንኛውም ቀሪ ሂሳብ አሁንም አለ። የተሻለ ግንኙነት ሲኖርህ እንደገና ሞክር።",
  "wallet.backup.nothing_recovered": "ከተፈለጉት ሚንቶች ምንም አልተመለሰም።",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "እንደደረሰ ይመዝገብ?",
  "wallet.delivered.body":
    "ይህ {amount} {unit} ን ለዘለቄታው ይለቅቃል። በእውነት ካልደረሰ መልሰህ ልታገኘው አትችልም።",
  "wallet.delivered.body_generic":
    "ይህ የተያዘውን መጠን ለዘለቄታው ይለቅቃል። በእውነት ካልደረሰ መልሰህ ልታገኘው አትችልም።",
  "wallet.delivered.cancel": "ገና አይደለም",
  "wallet.delivered.confirm": "ደርሷቸዋል",
  "wallet.reclaim.title": "ይህ ቶከን መልሶ ይገኝ?",
  "wallet.reclaim.body":
    "{amount} {unit} ወደ ቀሪ ሂሳብህ ይመለሳል። ይህን የምታደርገው ቶከኑ ወደ ማንም ካልደረሰ ብቻ ነው፦ ሕብረቁምፊው አስቀድሞ እጃቸው ላይ ካለ፣ በሚንቱ መጀመሪያ የመነዘረው ገንዘቡን ይይዛል፤ ያም እነሱ ሊሆኑ ይችላሉ።",
  "wallet.reclaim.keep": "በመጠባበቅ ላይ አቆይ",
  "wallet.reclaim.confirm": "መልሰህ አግኝ",
  "wallet.copied.token_body":
    "ቶከኑ በቅንጥብ ሰሌዳህ ላይ ነው። እንደደረሰ እስክትመዘግብ ድረስ እዚህ ተይዞ ይቆያል፤ ስለዚህ የመጀመሪያው ሙከራ ካልተሳካ እንደገና ልትለጥፈው ትችላለህ።",
  "wallet.copied.phrase_body":
    "በይለፍ ቃል አስተዳዳሪ ውስጥ ለጥፈውና ከዚያ ቅንጥብ ሰሌዳህን አጽዳ። ሌሎች መተግበሪያዎች ቅንጥብ ሰሌዳውን ማንበብ ይችላሉ፤ በአንዳንድ ቅንብሮችም ወደ ሌሎች መሣሪያዎችህ ይመሳሰላል።",
  "wallet.refresh.failed": "ማደስ አልተሳካም",
  "wallet.refresh.partly": "በከፊል ታድሷል",
  "wallet.refresh.done": "ታድሷል",
  "wallet.refresh.unreachable": "{mints} ሊደረስባቸው አልተቻለም። ሌላው ሁሉ ወቅታዊ ነው።",
  "wallet.refresh.swapped": "{amount} {unit} ተረጋግጦ በአዲስ ማረጋገጫዎች ተለውጧል።",
  "wallet.refresh.secured": "አሁን {amount} {unit} በማገገሚያ ሐረግህ ተሸፍኗል።",
  "wallet.refresh.all_confirmed": "እዚህ ያለው ሁሉ አስቀድሞ ከሚንቱ ጋር ተረጋግጦ ነበር።",
  "wallet.pending.title": "በመጠባበቅ ላይ",
  "wallet.pending.reserved_desc":
    "ተገንብቶ ተይዟል፤ መድረሱ አልተረጋገጠም። ማረጋገጫዎቹ ሁለት ጊዜ እንዳይወጡ ከቀሪ ሂሳብህ ውጭ ተይዘዋል።",
  "wallet.pending.locked_desc":
    "አስቀድሞ በተቀባዩ ቁልፍ ተቆልፏል፤ ስለዚህ እነሱ ብቻ ናቸው ሊያወጡት የሚችሉት። ገና አልደረሳቸውም ብቻ። ለመጨረስ ቶከኑን አጋራ።",
  "wallet.pending.show_qr": "ይህን ቶከን እንደ QR ኮድ አሳይ",
  "wallet.pending.copy_again": "ቶከኑን እንደገና ቅዳ",
  "wallet.pending.share_again": "ቶከኑን እንደገና አጋራ",
  "wallet.pending.mark_delivered": "ይህ ቶከን እንደደረሰ መዝግብ",
  "wallet.pending.delivered": "ደርሷል",
  "wallet.pending.reclaim_into": "ይህን ቶከን ወደ ቀሪ ሂሳብህ መልሰህ አግኝ",
  "wallet.activity.title": "እንቅስቃሴ",
  "wallet.activity.none": "ገና ምንም የለም",
  "wallet.activity.none_desc":
    "የምትልካቸውና የምትቀበላቸው ክፍያዎች እዚህ ይታያሉ፤ አዲሶቹ መጀመሪያ፣ ከእያንዳንዱ ሚንትና ክፍያ ጋር።",
  "wallet.activity.show_fewer": "ጥቂት ክፍያዎችን አሳይ",
  "wallet.activity.show_less": "ጥቂት አሳይ",
  "wallet.activity.received_unconfirmed": "ደርሷል፣ አልተረጋገጠም",
  "wallet.activity.received": "ደርሷል",
  "wallet.activity.receive_failed": "መቀበል አልተሳካም",
  "wallet.activity.reclaimed": "መልሶ ተገኝቷል",
  "wallet.activity.send_failed": "መላክ አልተሳካም",
  "wallet.activity.sent": "ተልኳል",
  "wallet.activity.status_pending": "በመጠባበቅ ላይ",
  "wallet.activity.status_failed": "አልተሳካም",
  "wallet.activity.status_reclaimed": "መልሶ ተገኝቷል",
  "wallet.activity.status_expired": "ጊዜው አልፎበታል",
  "wallet.activity.ln_deposit": "የLightning ተቀማጭ",
  "wallet.activity.ln_withdrawal": "የLightning ወጪ",
  "wallet.activity.nutzap_received": "Nutzap ደርሷል",
  "wallet.activity.spent_removed": "የወጡ ማረጋገጫዎች ተወግደዋል",
  "wallet.activity.refreshed": "ማረጋገጫዎች ታድሰዋል",
  "wallet.activity.refreshing": "ማረጋገጫዎች እየታደሱ ነው",
  "wallet.activity.just_now": "አሁን",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "ሜሽ ከመስመር ውጭ",
  "wallet.mesh_offline_body":
    "የሜሽ አገልግሎቱ እየሠራ አይደለም፤ ስለዚህ ቶከኑን የሚሰጠው ነገር የለም። በመጠባበቅ ላይ ስር ተይዞ ይቆያል።",
  "wallet.xfer.route_mesh": "በሜሽ በኩል በቀጥታ ወደ መሣሪያቸው ተላልፏል።",
  "wallet.xfer.route_nostr": "ከብሉቱዝ ክልል ውጭ ስለነበሩ በምትኩ በኢንተርኔት ሄደ።",
  "wallet.xfer.route_courier":
    "አሁን ወደ እነሱ የሚወስድ መንገድ የለም። ሌሎች መሣሪያዎች ይዘውት ይሄዳሉ፤ አንዱ ሲደርስባቸውም ያደርሱታል።",
  "wallet.xfer.route_queued":
    "ገና ሊደረስባቸው አልተቻለም። በተራ ላይ ነው፤ እንደተገኙም ወዲያውኑ ይላካል።",
  "wallet.xfer.mesh_offline_body":
    "የሜሽ አገልግሎቱ እየሠራ አይደለም፤ ስለዚህ ቶከኑን የሚያስተላልፍበት መንገድ የለም። ምንም አልተቀነሰም።",
  "wallet.xfer.could_not_send": "መላክ አልተቻለም",
  "wallet.xfer.inexact_body":
    "ማረጋገጫዎችህ ከመስመር ውጭ በትክክል {amount} {unit} ሊሠሩ አይችሉም። ልትገነባው የምትችለው ትንሹ ቶከን {spend} {unit} ነው፤ ተጨማሪው {extra} {unit} ደግሞ መልሶ የማይገኝ ሆኖ ወደ እነሱ ይሄዳል።\n\nበመስመር ላይ ሆነህ በሚንቱ ማደስ ማረጋገጫዎችህን ይህን ትክክለኛ የሚያደርጉ ክፍልፋዮች ይከፋፍላቸዋል።",
  "wallet.xfer.send_amount": "{amount} ላክ",
  "wallet.xfer.mesh_offline": "ሜሽ ከመስመር ውጭ",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "በቁልፋቸው ተቆልፎ ወደ Nostr ታትሟል። በመስመር ላይ ይሁኑ አይሁኑ የእነሱ ነው።",
  "wallet.pay.rail_nutzap_dm":
    "በቁልፋቸው ተቆልፏል። አስተላላፊው ስላልተቀበለው በምትኩ እንደ መልእክት ወደ እነሱ ሄደ።",
  "wallet.pay.rail_nutzap_undelivered":
    "በቁልፋቸው ተቆልፏል፤ ግን ገና የሚያጓጉዘው ነገር አልተገኘም። በተራ ላይ ነው፤ ቶከኑም በመጠባበቅ ላይ ስር ነው።",
  "wallet.pay.final":
    "የተቆለፉ ክፍያዎች መልሰው አይገኙም፦ አሁን እነዚህን ሳንቲሞች ማውጣት የሚችለው ቁልፋቸው ብቻ ነው።",
  "wallet.pay.reclaimable": "መድረሱን እስክታረጋግጥ ድረስ ከቦርሳ ትሩ መልሶ የሚገኝ ሆኖ ይቆያል።",
  "wallet.pay.why": "በዚህ መንገድ የተላከው {reason} ስለሆነ ነው።",
  "wallet.pay.sent_title": "{amount} {unit} ወደ {name}",
  "wallet.pay.thread_receipt": "{amount} {unit} በቁልፋቸው ተቆልፎ ልከሃል።",
  "wallet.pay.title": "ecash ላክ",
  "wallet.pay.to": "ወደ {name}",
  "wallet.pay.amount": "መጠን በsats",
  "wallet.pay.memo": "ማስታወሻ (አማራጭ፣ ይፋዊ)",
  "wallet.pay.send": "ላክ",
  "wallet.pay.sending": "እየተላከ…",
  "wallet.pay.action": "ecash ላክ",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "የካሜራ መዳረሻ",
  "wallet.scan.camera_purpose": "የecash QR ኮድ ለመቃኘት",
  "wallet.scan.photo_label": "የፎቶ መዳረሻ",
  "wallet.scan.photo_purpose": "ከምስል ውስጥ የecash QR ለማንበብ",
  "wallet.scan.no_token": "በዚያ ምስል ውስጥ የecash ቶከን አልተገኘም።",
  "wallet.scan.no_invoice": "በዚያ ምስል ውስጥ የLightning ደረሰኝ አልተገኘም።",
  "wallet.scan.unreadable": "ያ ምስል ሊነበብ አልቻለም።",
  "wallet.scan.camera_failed":
    "ካሜራው ሊጀመር አልቻለም። ሌሎች የካሜራ መተግበሪያዎችን ዝጋና እንደገና ሞክር።",
  "wallet.scan.close": "ቃኚውን ዝጋ",
  "wallet.scan.on_device": "በዚህ መሣሪያ ላይ ይነበባል፤ ምንም ወደ የትም አይላክም።",
  "wallet.scan.aim_token": "ወደ የecash QR ኮድ አነጣጥር።",
  "wallet.scan.aim_invoice": "ወደ የLightning ደረሰኝ QR ኮድ አነጣጥር።",
  "wallet.scan.title_token": "ecash ቃኝ",
  "wallet.scan.title_invoice": "ደረሰኝ ቃኝ",
  "wallet.scan.desc_token":
    "ከሌላ ቦርሳ የCashu ቶከን አንብብ። ከAirhop ብቻ ሳይሆን ከማንኛውም የCashu ቦርሳ ጋር ይሠራል።",
  "wallet.scan.desc_invoice": "ከቀሪ ሂሳብህ ለመክፈል የLightning ደረሰኝ አንብብ።",
  "wallet.scan.use_camera_a11y": "በካሜራ ቃኝ",
  "wallet.scan.use_camera": "ካሜራ ተጠቀም",
  "wallet.scan.pick_image_a11y": "ከተቀመጠ ምስል የQR ኮድ አንብብ",
  "wallet.scan.pick_image": "ከፎቶዎች ምረጥ",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu ምንድን ነው?",
  "wallet.explain.intro":
    "Cashu ለBitcoin የተዘጋጀ ecash ነው። ቶከን ለያዘው ሰው ገንዘብ የሚያወጣ ሕብረቁምፊ ነው፤ ሚንቱ ማን ምን እንዳወጣ እንዳያውቅ በዓይነ ስውር ፊርማ ይፈረማል። መለያም መግቢያም የለም።",
  "wallet.explain.send": "ላክ",
  "wallet.explain.send_desc":
    "አንድን መጠን በብሉቱዝ በኩል በአቅራቢያ ላለ አቻ ልታስተላልፈው ወይም እንደ ጽሑፍ ልታጋራው ወደምትችለው ቶከን ይቀይረዋል። ያለ ኢንተርኔት ይሠራል። መድረሱን እስክታረጋግጥ ድረስ ማረጋገጫዎቹ ተይዘው ይቆያሉ።",
  "wallet.explain.receive": "ተቀበል",
  "wallet.explain.receive_desc":
    "ለመጨመር ቶከን ለጥፍ። በመስመር ላይ ስትሆን ወዲያውኑ በሚንቱ ይለወጣል፤ ይህም በማስረጃ የአንተ ያደርገዋል። ከመስመር ውጭ ሲሆን ተከማችቶ እስክታድስ ድረስ ያልተረጋገጠ ሆኖ ይመዘገባል።",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "ለNostr ማንነት ይከፍላል። የNIP-61 nutzap መረጃ አሳትመው ከሆነ ecash እነሱ ብቻ እንዲያወጡት በቁልፋቸው ይቆለፋል። ካልሆነ ወደ የተመሰጠረ ቀጥተኛ መልእክት ይመለሳል። ኢንተርኔት ይፈልጋል።",
  "wallet.explain.add_mint": "ሚንት ጨምር",
  "wallet.explain.add_mint_desc":
    "የecash ህን የሚያወጣውንና የሚመነዝረውን ሚንት ያስቀምጣል፤ ከእሱ የሚመጡ ቶከኖች ከመስመር ውጭ እንዲረጋገጡ ይፋዊ ቁልፎቹንም ያከማቻል። እዚያ ከምታስቀምጠው ቀሪ ሂሳብ ጋር የምታምነውን ሚንት ምረጥ።",
  "wallet.explain.phrase": "የማገገሚያ ሐረግ",
  "wallet.explain.phrase_desc":
    "ሳንቲሞችህ ቦርሳው መጀመሪያ ላይ ካመነጫቸው አሥራ ሁለት ቃላት ይወሰዳሉ፤ ስለዚህ አዲስ ስልክ ሚንቶችህን የትኞቹን ሳንቲሞች እንደፈረሙ በመጠየቅ ቀሪ ሂሳቡን እንደገና ሊገነባ ይችላል። እስክታያቸውና እስክትጽፋቸው ድረስ ያሉት በዚህ ስልክ ላይ ብቻ ነው።",

  // ---- Wallet: failures ----
  "wallet.err.locked": "ቦርሳው ተቆልፏል",
  "wallet.err.mint_unreachable": "ሚንቱ ሊደረስበት አልቻለም",
  "wallet.err.tor_blocked": "Tor በርቶ እያለ ታግዷል",
  "wallet.err.insufficient": "በቂ ቀሪ ሂሳብ የለም",
  "wallet.err.exact_amount": "ያንን ትክክለኛ መጠን መላክ አይቻልም",
  "wallet.err.no_mint": "ሚንት የለም",
  "wallet.err.mint_unsupported": "ሚንቱ ያንን ማድረግ አይችልም",
  "wallet.err.mint_refused": "ሚንቱ አልተቀበለም",
  "wallet.err.unreadable": "ሊነበብ የማይችል ቶከን",
  "wallet.err.rejected": "ቶከኑ ተቀባይነት አላገኘም",
  "wallet.err.already_spent": "አስቀድሞ ወጪ ሆኗል",
  "wallet.err.change_pending": "ተከፍሏል፤ መልሱ በመጠባበቅ ላይ",
  "wallet.svc.mint_unreachable": "ሚንቱ ሊደረስበት አልቻለም።",
  "wallet.svc.tor_ios": "በiOS ላይ የሚንት ጥያቄዎች በTor አያልፉም።",
  "wallet.svc.tor_ios_body":
    "Arti የሚሸፍነው የNostr WebSocket ን ብቻ ነው፤ ስለዚህ ይህ ጥያቄ በክፍት አውታረ መረብ ሚንቱ ላይ ደርሶ የIP አድራሻህን ከእነዚህ ማረጋገጫዎች ጋር ያገናኘዋል። በቅንብሮች > ደህንነት ስር ፍቀደው፣ ወይም መጀመሪያ Tor ን አጥፋ። በሜሽ ላይ ecash መላክና መቀበል አሁንም ይሠራል።",
  "wallet.svc.keys_uncached": "የዚህ ሚንት ቁልፎች በዚህ መሣሪያ ላይ አልተከማቹም።",
  "wallet.svc.keys_uncached_body": "እነሱን ለማምጣት በመስመር ላይ ሆነህ ቦርሳውን አንድ ጊዜ ክፈት።",
  "wallet.svc.phrase_invalid": "ያ የማገገሚያ ሐረግ ልክ አይደለም።",
  "wallet.svc.phrase_invalid_body":
    "በስህተት የተጻፈ ወይም የጎደለ ቃል ፈልግ። ሐረጉ አብሮ የተሠራ የማረጋገጫ ስሌት አለው፤ ስለዚህ አንድ የተሳሳተ ቃል ሁሉንም ልክ ያልሆነ ያደርገዋል።",
  "wallet.svc.need_mint": "መጀመሪያ ቢያንስ አንድ ሚንት ጨምር።",
  "wallet.svc.need_mint_body":
    "ማገገሚያው የሚሠራው አንድን ሚንት ለአንተ የትኞቹን ሳንቲሞች እንደፈረመ በመጠየቅ ነው፤ ስለዚህ የትኛውን መጠየቅ እንዳለበት ማወቅ አለበት።",
  "wallet.svc.restored": "ከማገገሚያ ሐረግ ተመልሷል",
  "wallet.svc.storage_locked": "የቦርሳው ማከማቻ ተቆልፏል።",
  "wallet.svc.storage_locked_body":
    "Airhop የecash ማረጋገጫዎችን ቁልፉ በመሣሪያው ቁልፍ ማከማቻ ውስጥ ባለ የተመሰጠረ ፋይል ውስጥ ያስቀምጣል። መሣሪያውን ክፈትና መተግበሪያውን እንደገና ክፈት።",
  "wallet.svc.bad_url": "ያ ልክ የሆነ አድራሻ አይደለም።",
  "wallet.svc.needs_https": "የሚንት አድራሻ በhttps:// መጀመር አለበት።",
  "wallet.svc.refuse_http": "ሚንትን በተራ http መጠቀም አይፈቀድም።",
  "wallet.svc.refuse_http_body":
    "በአውታረ መረቡ መንገድ ላይ ያለ ማንኛውም ሰው ማረጋገጫዎችህን ሊያነብ ወይም ሊቀይር ይችላል። የhttps:// ሚንት ተጠቀም።",
  "wallet.svc.mint_not_saved": "ሚንቱ ሊቀመጥ አልቻለም።",
  "wallet.svc.unreadable_token": "ያ ሊነበብ የሚችል የCashu ቶከን አይደለም።",
  "wallet.svc.unreadable_token_body":
    "ቶከኖች በcashuA ወይም በcashuB ይጀምራሉ። ሲቀዳ ምንም አለመቆረጡን አረጋግጥ።",
  "wallet.svc.wrong_mint": "ይህ ቶከን በጠቀሰው ሚንት አልተፈረመም።",
  "wallet.svc.already_spent": "እነዚህ ማረጋገጫዎች አስቀድመው ወጪ ሆነዋል።",
  "wallet.svc.already_spent_body":
    "ይህን ቶከን የላከው ሰው መጀመሪያ መንዝሮታል፣ ወይም ተመሳሳዩን ቶከን ለሌላ ሰው ልኮታል።",
  "wallet.svc.receiving_offline": "ከመስመር ውጭ እየተቀበለ",
  "wallet.svc.amount_positive": "ከዜሮ የሚበልጥ መጠን አስገባ።",
  "wallet.svc.coins_raced": "እነዚያ ሳንቲሞች አሁን በሌላ ክፍያ ተጠቅመዋል።",
  "wallet.svc.coins_raced_body":
    "ምንም አልተቀነሰም። እንደገና ሞክር፤ ቦርሳው የተለየ ስብስብ ይመርጣል።",
  "wallet.svc.no_ecash": "ገና ecash የለም።",
  "wallet.svc.no_ecash_body": "ሚንት ጨምርና በLightning አስገባ፣ ወይም ከአንድ ሰው ቶከን ተቀበል።",
  "wallet.svc.split_across_mints": "ቀሪ ሂሳብህ በበርካታ ሚንቶች ተከፋፍሏል።",
  "wallet.svc.mint_says_spent": "ሚንቱ እነዚህ ማረጋገጫዎች አስቀድመው ወጪ እንደሆኑ ሪፖርት አድርጓል።",
  "wallet.svc.issue_against_invoice": "በLightning ደረሰኝ ላይ ተመስርቶ ecash ማውጣት",
  "wallet.svc.pay_invoice": "የLightning ደረሰኝ መክፈል",
  "wallet.svc.unknown_deposit": "ያልታወቀ ተቀማጭ።",
  "wallet.svc.invoice_expired_before": "ደረሰኙ ከመከፈሉ በፊት ጊዜው አልፎበታል።",
  "wallet.svc.invoice_expired": "የዚያ ደረሰኝ ጊዜ አልፎበታል።",
  "wallet.svc.invoice_unpaid": "ደረሰኙ ገና አልተከፈለም።",
  "wallet.svc.payment_unknown": "የክፍያው ሁኔታ አይታወቅም፤ በሚቀጥለው ማደስ ጊዜ እንደገና ይመረመራል።",
  "wallet.svc.melt_change_pending": "ደረሰኝህ ተከፍሏል።",
  "wallet.svc.melt_change_pending_body":
    "ሚንቱ ያልተጠቀመበትን የመተላለፊያ ክፍያ ገና አልመለሰም። በሚቀጥለው ማደስ ጊዜ በራስ-ሰር ይጠየቃል፤ በዚህ መካከልም ምንም አይጠፋም።",
  "wallet.svc.mint_did_not_pay": "ሚንቱ ይህን ደረሰኝ አልከፈለም። ቀሪ ሂሳብህ አልተቀየረም።",
  "wallet.svc.not_an_invoice": "ያ የLightning ደረሰኝ አይደለም።",
  "wallet.svc.not_an_invoice_body": "በlnbc የሚጀምር የbolt11 ደረሰኝ ለጥፍ።",
  "wallet.svc.insufficient_for_invoice": "ለዚህ ደረሰኝ በቂ ቀሪ ሂሳብ የለም።",
  "wallet.svc.coins_raced_invoice_body":
    "ምንም አልተቀነሰም፤ ደረሰኙም አልተከፈለም። እንደገና ሞክር።",
  "wallet.svc.same_mint": "የተለየ መድረሻ ሚንት ምረጥ።",
  "wallet.svc.same_mint_body": "ምንጩና መድረሻው አንድ ሚንት ናቸው፤ ስለዚህ የሚዛወር ነገር የለም።",
  "wallet.svc.quote_failed_retried": "ግምቱ አልተሳካም፤ ማጠናከሩ እንደገና ተሞክሯል",
  "wallet.svc.amount_unfit_retried": "መጠኑ አልተስማማም፤ ማጠናከሩ እንደገና ተሞክሯል",
  "wallet.svc.cannot_size": "የዚህ ዝውውር መጠን ሊወሰን አልቻለም።",
  "wallet.svc.insufficient_at_mint": "በ{mint} ውስጥ በቂ ቀሪ ሂሳብ የለም።",
  "wallet.svc.inexact_title":
    "ማረጋገጫዎችህ ከመስመር ውጭ በትክክል {amount} {unit} ሊሠሩ አይችሉም።",
  "wallet.svc.inexact_detail":
    "ልትልከው የምትችለው ትንሹ ቶከን {spend} {unit} ነው። ከመስመር ውጭ መልስ ስለሌለ ተጨማሪው {extra} {unit} ወደ ተቀባዩ ይሄዳል።",
  "wallet.svc.no_single_mint":
    "{amount} {unit} የያዘ ነጠላ ሚንት የለም። ከተለያዩ ሚንቶች የመጣ ecash በአንድ ቶከን ውስጥ ሊጣመር አይችልም፦ መጀመሪያ በአንድ ሚንት ላይ አጠናክር፣ ወይም በተለያዩ መጠኖች ላክ።",
  "wallet.svc.have_tried_send": "{total} {unit} አለህ፤ {amount} ለመላክ ሞክረሃል።",
  "wallet.svc.invoice_needs":
    "ይህ ደረሰኝ የመተላለፊያ መጠባበቂያውን ጨምሮ {total} {unit} ይፈልጋል፤ አንተ ደግሞ {balance} አለህ።",
  "wallet.svc.nothing_to_move": "{mint} የሚዛወር {unit} የለውም።",
  "wallet.svc.consolidate_memo": "ከ{mint} ማጠናከር",
  "wallet.svc.cannot_size_detail":
    "የLightning መተላለፊያ ክፍያዎች ከተከፈሉ በኋላ {from} ወደ {to} ጠቃሚ መጠን ሊያዛውር አይችልም። በምትኩ የተወሰነ ትንሽ መጠን ለማዛወር ሞክር።",
  "wallet.svc.mint_cannot": "{mint} {action} አይችልም።",
  "wallet.svc.no_nut": "ሚንቱ NUT-{nut} ን እንደሚደግፍ አላስታወቀም።",
  "wallet.svc.unknown_mint": "ያ ክፍያ አንተ የማትጠቀምበትን ሚንት ይጠቅሳል።",
  "wallet.svc.unknown_mint_body":
    "የምታምነው ከሆነ መጀመሪያ ራስህ ጨምረው፤ ካልመረጥከው ሚንት ምንም አይመነዘርም።",
  "wallet.svc.no_relay": "የአስተላላፊ ግንኙነት የለም",
  "wallet.svc.no_shared_mint": "በቂ ቀሪ ሂሳብ ያለው የጋራ ሚንት የለም",
  "wallet.svc.no_nutzap_info": "ተቀባዩ የnutzap መረጃ አላሳተመም (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "በቁልፋቸው ተቆልፏል ግን ገና አልደረሰም። ለማጠናቀቅ የዚህን ግብይት ቶከን አጋራ።",
  "wallet.svc.swap_lost":
    "ሚንቱ ይህን ልውውጥ ፈጽሞ አላጠናቀቀም፤ ስለዚህ በእሱ ላይ ተመስርቶ ምንም አልወጣም።",
  "wallet.svc.swap_unreadable": "ይህ ልውውጥ ይህ ስሪት እንደገና ሊያሄደው በማይችል መልክ ተቀምጧል።",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "በQR ተረጋግጧል",
  "contacts.qr.keys_unverified": "ቁልፎች ደርሰዋል፣ አልተረጋገጡም",
  "contacts.qr.not_verified": "ገና አልተረጋገጠም",
  "contacts.qr.message": "መልእክት",
  "contacts.qr.add": "እውቂያ ጨምር",
  "contacts.qr.scan_title": "የQR ኮድ ቃኝ",
  "contacts.qr.aim": "ካሜራህን ወደ QR ኮዳቸው አነጣጥር",
  "contacts.qr.add_desc": "በሜሽ ላይ በአቅራቢያ የሌለን ሰው ድረስ።",
  "contacts.qr.peer_id_hint": "የአቻ መለያ 16 ቁምፊ ነው። የእውቂያ ኮድ በairhop: ይጀምራል።",
  "contacts.qr.or_scan": "ወይም QR ኮዳቸውን ቃኝ",
  "contacts.qr.trust_note":
    "ቁልፋቸውን የሚያረጋግጠው በካሜራህ የምትቃኘው QR ብቻ ነው። የተለጠፈ ኮድ ቁልፎቻቸውን ያመጣል እንጂ ከእነሱ መምጣቱን አያረጋግጥም።",
  "contacts.qr.peer_id": "የአቻ መለያ ወይም የእውቂያ ኮድ",
  "contacts.qr.peer_id_placeholder": "መለያ ወይም የእውቂያ ኮድ ለጥፍ",
  "contacts.qr.scan_camera_a11y": "የQR ኮድን በካሜራ ቃኝ",
  "contacts.qr.scan_camera_desc": "ካሜራህን ተጠቀም",
  "contacts.qr.upload_a11y": "የQR ምስልን ከማዕከለ-ስዕላት ጫን",
  "contacts.qr.upload": "ከማዕከለ-ስዕላት ጫን",
  "contacts.qr.upload_desc": "የተቀመጠ የQR ምስል ምረጥ",
  "contacts.qr.scan_a11y": "የQR ኮድ በመቃኘት እውቂያ ጨምር",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "የ16 ቁምፊ የአቻ መለያ፣ የairhop://peer/… አገናኝ፣ ወይም የእውቂያ ኮድ ለጥፍ።",
  "contacts.scan.camera_label": "የካሜራ መዳረሻ",
  "contacts.scan.camera_purpose": "የእውቂያ QR ኮድ ለመቃኘት",
  "contacts.scan.camera_needed":
    "ለመቃኘት የካሜራ መዳረሻ ያስፈልጋል። አሁንም በአቻ መለያ መጨመር ትችላለህ።",
  "contacts.scan.camera_failed":
    "ካሜራው ሊጀመር አልቻለም። ሌሎች የካሜራ መተግበሪያዎችን ዝጋና እንደገና ሞክር።",
  "contacts.scan.photo_label": "የፎቶ መዳረሻ",
  "contacts.scan.photo_purpose": "ያስቀመጥከውን QR ኮድ ለመቃኘት",
  "contacts.scan.photo_needed":
    "ምስል ለመምረጥ የፎቶ መዳረሻ ያስፈልጋል። አሁንም በአቻ መለያ መጨመር ትችላለህ።",
  "contacts.scan.no_qr": "በዚያ ምስል ውስጥ የAirhop QR ኮድ አልተገኘም።",
  "contacts.scan.unreadable": "ከዚያ ምስል የQR ኮድ ሊነበብ አልቻለም።",
  "contacts.scan.bitchat_expired":
    "ያ የbitchat ኮድ ጊዜው አልፎበታል። QR ኮዳቸውን እንደገና እንዲከፍቱ ጠይቃቸው።",
  "contacts.scan.tampered":
    "ይህ QR ኮድ ልክ አይደለም፦ የአቻ መለያው ከቁልፎቹ ጋር አይዛመድም። ተበርዞ ሊሆን ይችላል።",
  "contacts.scan.already_added": "አስቀድሞ በእውቂያዎችህ ውስጥ ነው",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "የካሜራ መዳረሻ እየተጠበቀ ነው…",
  "contacts.verify.camera_off": "ካሜራው ጠፍቷል",
  "contacts.verify.open_settings": "ቅንብሮችን ክፈት",
  "contacts.verify.verified": "ተረጋግጧል",
  "contacts.verify.different": "የተለየ እውቂያ",
  "contacts.verify.scan_again": "እንደገና ቃኝ",
  "contacts.verify.failed": "ማረጋገጥ አልተቻለም",
  "contacts.verify.done": "ተጠናቋል",
  "contacts.verify.title": "{name} ን አረጋግጥ",
  "contacts.verify.aim": "ካሜራህን ወደ QR ኮዳቸው አነጣጥር",
  "contacts.verify.camera_off_body": "በQR ለማረጋገጥ በቅንብሮች ውስጥ የካሜራ መዳረሻን አብራ።",
  "contacts.verify.match_body": "የ{name} ቁልፍ ይዛመዳል። በዚህ እውቂያ መተማመን ትችላለህ።",
  "contacts.verify.different_body":
    "ይህ QR የሌላ ሰው ነው። {name} የራሱን ኮድ እንዲያሳይህ ጠይቀው።",
  "contacts.verify.tampered_body": "ይህ QR የተበረዘ ይመስላል፦ መለያው ከቁልፉ ጋር አይዛመድም።",
  "contacts.verify.choose_title": "እንዴት ማረጋገጥ ትፈልጋለህ?",
  "contacts.verify.choose_body":
    "ሁለቱም በዚህ ስልክ ላይ ያሉት ቁልፎች በእውነት የ{name} መሆናቸውን ያረጋግጣሉ።",
  "contacts.verify.method_scan": "ኮዳቸውን ቃኝ",
  "contacts.verify.method_scan_sub": "አብረውህ እዚሁ ናቸው",
  "contacts.verify.method_compare": "ኮድ አወዳድር",
  "contacts.verify.method_compare_sub": "በስልክ ጥሪ ላይ ለየራሳችሁ አንብቡት",
  "contacts.verify.no_keys":
    "ለዚህ እውቂያ ገና ቁልፎች የሉም። መልእክት ላክላቸው፣ ወይም ስትገናኙ ኮዳቸውን ቃኝ።",
  "contacts.verify.compare_title": "እነዚህን ለየራሳችሁ አንብቡ",
  "contacts.verify.compare_body":
    "{name} ተመሳሳዮቹን ስድስት ቃላት ያያል። ከተዛመዱ ሁለታችሁም ቁልፎቹ እውነተኛ መሆናቸውን ታውቃላችሁ።",
  "contacts.verify.codes_match": "እነዚህ ይዛመዳሉ",
  "contacts.verify.codes_differ": "አይዛመዱም",
  "contacts.verify.compared_body":
    "አንተና {name} አንድ አይነት ኮድ አረጋግጣችኋል። ይህ እውቂያ ተረጋግጧል።",

  // ---- Settings: shared chrome ----
  "settings.back": "ተመለስ",
  "settings.coming_soon": "በቅርቡ ይመጣል",
  "settings.opens_externally": "{label}፣ ከመተግበሪያው ውጭ ይከፈታል",
  "settings.peer_id": "የአቻ መለያ",
  "settings.share_peer_id": "የአቻ መለያህን አጋራ",
  "settings.share_id_short": "መለያ አጋራ",
  "settings.peer_id_sheet.title": "የአንተ የአቻ መለያ",
  "settings.peer_id_sheet.copy": "የአቻ መለያን ቅዳ",
  "settings.peer_id_sheet.note":
    "ይህ የሚሠራው ሁለታችሁም በብሉቱዝ ክልል ውስጥ ስትሆኑ ብቻ ነው። አንድ ሰው ከየትም ሆኖ መልእክት እንዲልክልህ ከፈለግህ በምትኩ QR ኮድህን አጋራ።",

  // ---- Settings: hub rows ----
  "settings.section.general": "አጠቃላይ",
  "settings.section.general_desc": "አማራጭ ባህሪያት፣ መላክን መመለስ፣ ሚዲያ፣ ዳግም ማስጀመር",
  "settings.section.privacy": "ግላዊነትና ደህንነት",
  "settings.section.privacy_desc": "ወደፊት ሚስጥራዊነት፣ የተፈረሙ ጥቅሎች፣ የታገዱ አቻዎች",
  "settings.section.network": "አውታረ መረብና አስተላላፊዎች",
  "settings.section.network_desc":
    "የኢንተርኔት አማራጭ፣ የnostr አስተላላፊዎች፣ ከbitchat ጋር ተኳሃኝነት",
  "settings.section.permissions": "ፈቃዶች",
  "settings.section.permissions_desc": "ብሉቱዝ፣ አካባቢ፣ ማሳወቂያዎች፣ ካሜራ፣ ማይክ",
  "settings.section.storage": "ማከማቻና መረጃ",
  "settings.section.diagnostics": "ምርመራ",

  // ---- Settings: group headings ----
  "settings.group.transports": "የመተላለፊያ መንገዶች",
  "settings.group.internet": "ኢንተርኔት",
  "settings.group.nearby": "በአቅራቢያ",
  "settings.group.sync": "ማመሳሰል",
  "settings.group.features": "ባህሪያት",
  "settings.group.messages": "መልእክቶች",
  "settings.group.local": "አካባቢያዊ",
  "settings.group.media": "ሚዲያ",
  "settings.group.reset": "ዳግም ማስጀመር",
  "settings.group.always_on": "ሁልጊዜ በርቷል",
  "settings.group.notifications": "ማሳወቂያዎች",
  "settings.group.blocked": "የታገዱ",
  "settings.group.theme": "ገጽታ",
  "settings.group.font": "ቅርጸ ቁምፊ",
  "settings.group.language": "ቋንቋ",
  "settings.section.diagnostics_desc": "የግንኙነት ሁኔታና በአቅራቢያ ያሉ መሣሪያዎች",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "የብሉቱዝ አገናኞች",
  "settings.diag.ble_links_desc": "ይህ ስልክ በቀጥታ የተገናኘባቸው መሣሪያዎች",
  "settings.diag.lan": "የአካባቢ አውታረ መረብ",
  "settings.diag.lan_desc": "በአንድ Wi-Fi አውታረ መረብ ላይ ያሉ ስልኮች",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "ከስልክ ወደ ስልክ ያለ ራውተር",
  "settings.diag.wifi_active": "እየሠራ ነው",
  "settings.diag.wifi_unsupported": "በዚህ መሣሪያ ላይ አይደገፍም",
  "settings.diag.wifi_permission": "በአንድ ፈቃድ ታግዷል",
  "settings.diag.wifi_unavailable": "አሁን አይገኝም",
  "settings.diag.wifi_unpaired": "ምንም አልተጣመረም",
  "settings.diag.wifi_unknown": "ሬዲዮውን እየጠበቀ",
  "settings.diag.relays": "የNostr አስተላላፊዎች",
  "settings.diag.relays_desc": "ለአካባቢ ሰርጦችና ለኢንተርኔት ተደራሽነት ያገለግላሉ",
  "settings.diag.connected": "ተገናኝቷል",
  "settings.diag.disconnected": "አልተገናኘም",
  "settings.diag.peer_direct": "ቀጥተኛ አገናኝ",
  "settings.diag.peer_relayed": "በሌላ መሣሪያ በኩል የተሰማ",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "የምልክት ንባብ የለም",
  "settings.diag.no_peers": "በክልል ውስጥ ማንም የለም",
  "settings.diag.no_peers_desc": "{links} የሬዲዮ አገናኞች ክፍት ናቸው",
  "settings.diag.gcs_size": "የማጣሪያ መጠን",
  "settings.diag.gcs_size_desc": "በአየር ላይ የተላከው ትልቁ የማመሳሰያ ማጣሪያ",
  "settings.diag.fpr": "የሐሰት አዎንታዊ መጠን",
  "settings.diag.fpr_desc": "ማጣሪያው የሌለንን ጥቅል አለ የሚልበት ድግግሞሽ",
  "settings.diag.bytes": "{n} ባይት",
  "settings.diag.footnote":
    "እዚህ ምንም ሊቀየር አይችልም። Airhop ከbitchat ጋር ተኳሃኝ ሆኖ እንዲቀጥል እነዚህ እሴቶች ቋሚ ናቸው።",
  "settings.section.storage_desc": "አጠቃቀምና ጊዜያዊ ማከማቻ",
  "settings.section.appearance": "መልክ",
  "settings.section.appearance_desc": "ገጽታ፣ ቅርጸ ቁምፊና ቋንቋ",
  "settings.section.help": "እገዛና አስተያየት",
  "settings.section.help_desc": "አግኙን፣ ችግር ሪፖርት አድርግ፣ ወይም ተደጋጋሚ ጥያቄዎችን አንብብ",
  "settings.section.support": "ድጋፍ",
  "settings.section.support_desc": "ልማቱ እንዲቀጥል እርዳ",
  "settings.section.about": "ስለ",
  "settings.section.about_desc": "ስሪት፣ የለውጥ መዝገብና ምንጭ",

  // ---- Settings: general ----
  "settings.general.undo": "መላክን መመለስ",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "ቦርሳ",
  "settings.general.undo_seconds": "{count} ሰከንድ",
  "settings.general.undo_a11y": "መላክን መመለስ፦ {value}",
  "settings.general.quality_a11y": "የመጫኛ ጥራትን ወደ {value} አዘጋጅ",
  "settings.general.undo_desc":
    "የተላከን መልእክት ለአጭር ጊዜ ይይዘዋል፤ ከመውጣቱ በፊት መመለስ እንድትችል",
  "settings.general.undo_off_desc": "ወዲያውኑ ላክ፤ መመለሻ የለም",
  "settings.general.undo_2": "2 ሰከንድ",
  "settings.general.undo_2_desc": "ለመመለስ ፈጣን ዕድል",
  "settings.general.undo_10": "10 ሰከንድ",
  "settings.general.undo_10_desc": "ረጅሙ ጊዜ",
  "settings.general.quality": "የመጫኛ ጥራት",
  "settings.general.quality_desc":
    "ከካሜራህ ወይም ከቤተ-መጻሕፍትህ በሚላኩ ፎቶዎች ላይ ይሠራል። በሁለቱም መንገድ እያንዳንዱ ፎቶ ለሜሹ እንዲመጥን ይስተካከላል።",
  "settings.general.quality_low": "ዝቅተኛ",
  "settings.general.quality_low_desc": "ትንንሽ ፎቶዎች፣ በፍጥነት የሚላኩ",
  "settings.general.quality_medium": "መካከለኛ",
  "settings.general.quality_medium_desc": "በዝርዝርና በፍጥነት መካከል ሚዛን",
  "settings.general.quality_high": "ከፍተኛ",
  "settings.general.quality_high_desc": "በጣም ብዙ ዝርዝር ይይዛል",
  "settings.general.feature_wallet_desc": "በሜሽ ላይ ከአቻ ወደ አቻ Cashu ecash ላክ",
  "settings.general.feature_wallet_a11y": "ቦርሳ (ሁልጊዜ በርቷል)",
  "settings.general.feature_ai_desc":
    "በመሣሪያው ላይ የሚሠራ የግል ረዳት፤ ምንም የአውታረ መረብ ጥሪ የለም",
  "settings.general.feature_feeds": "ምግቦች",
  "settings.general.feature_feeds_desc":
    "የBluesky እና የMastodon ምግቦችን አንብብና ለጥፍ",
  "settings.general.show_media": "ሚዲያን በራስ-ሰር አሳይ",
  "settings.general.show_media_desc":
    "ፎቶዎችና ቪዲዮዎች በውይይቱ ውስጥ ይታያሉ፣ ወይም ከአንድ ንክኪ በኋላ ይቀራሉ",
  "settings.general.reset": "ቅንብሮችን ዳግም አስጀምር",
  "settings.general.media_retention": "ሚዲያን ለዚህን ያህል ጊዜ ያዝ",
  "settings.general.media_retention_desc":
    "ፎቶዎች፣ ቪዲዮዎችና የድምፅ መልእክቶች ከተመረጠው ጊዜ በኋላ ይሰረዛሉ",
  "settings.general.media_retention_sheet":
    "ሚዲያ በዚህ መሣሪያ ላይ ለምን ያህል ጊዜ እንደሚቆይ ምረጥ። የተሰረዘ ሚዲያ ሊመለስ አይችልም።",
  "settings.general.retention_7_desc":
    "በጣም ትንሽ ዱካ ይተዋል። አደጋው ስልኩ ራሱ ከሆነ የተሻለው ነው።",
  "settings.general.retention_14_desc":
    "ከምልክት ርቀህ ለአንድ ወይም ለሁለት ሳምንት ስትቆይ መካከለኛ አማራጭ።",
  "settings.general.retention_30_desc":
    "ውይይቶችን ረዥሙን ጊዜ ሊነበቡ የሚችሉ ያደርጋቸዋል፤ በዲስክ ላይም በጣም ብዙ ይይዛል።",
  "settings.general.reset_desc":
    "ማንነትህን፣ መልእክቶችህን፣ እውቂያዎችህንና ቦርሳህን ሳይነካ እያንዳንዱን ምርጫ ወደ ነባሪው ይመልሳል",
  "settings.general.reset_title": "ቅንብሮች ዳግም ይጀመሩ?",
  "settings.general.reset_body":
    "እያንዳንዱ ምርጫ ወደ ነባሪው ይመለሳል፦ መልክ፣ መላክን መመለስ፣ እና ግንኙነት (ኢንተርኔት፣ Tor፣ መተላለፊያ፣ ድልድይ፣ አስተላላፊዎች)። ማንነትህ፣ መልእክቶችህ፣ እውቂያዎችህና ቦርሳህ አይነኩም።",
  "settings.general.reset_confirm": "ዳግም አስጀምር",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "ወደፊት ሚስጥራዊነት",
  "settings.security.forward_secrecy_desc":
    "ለቀጥተኛ መልእክቶች Double Ratchet ሁልጊዜ በርቷል",
  "settings.security.signed_packets": "የተፈረሙ ጥቅሎች",
  "settings.security.signed_packets_desc": "እያንዳንዱ ጥቅል በEd25519 ይፈረማል",
  "settings.security.hide_previews": "የማሳወቂያ ቅድመ-እይታዎችን ደብቅ",
  "settings.security.hide_previews_desc":
    "የመቆለፊያ ማያህ ሳይከፈት ስለሚያሳያቸው ላኪውንና መልእክቱን ከዚያ ያርቃል",
  "settings.security.no_blocked": "የታገደ አቻ የለም",
  "settings.security.no_blocked_desc":
    "የታገዱ አቻዎች መልእክት ሊልኩልህ አይችሉም፤ በሜሽ ትር ላይም አይታዩም",
  "settings.security.unblock_title": "የዚህን አቻ እገዳ አንሳ",
  "settings.security.unblock": "እገዳ አንሳ",
  "settings.security.unblock_peer": "የ{name} እገዳ አንሳ",
  "settings.security.unblock_body":
    "{name} እንደገና መልእክት ሊልክልህ ይችላል፤ በአቅራቢያ ሲሆንም በሜሽ ትር ላይ እንደገና ይታያል።",

  // ---- Settings: network and relays ----
  "settings.network.internet": "የኢንተርኔት አማራጭ",
  "settings.network.internet_desc":
    "የሜሽ አቻዎች ከክልል ውጭ ሲሆኑ በNostr አስተላላፊዎች በኩል ቀጥል",
  "settings.network.internet_off_title": "ኢንተርኔት ይጥፋ?",
  "settings.network.internet_off_body":
    "Airhop በብሉቱዝ ብቻ ይሠራል። ማንኛውንም የNostr አስተላላፊ ማግኘት ያቆማል፤ Tor፣ የኢንተርኔት መተላለፊያና የሜሽ ድልድይ ሁሉም ይጠፋሉ። በአቅራቢያ ያለው የብሉቱዝ ውይይት መሥራቱን ይቀጥላል።",
  "settings.network.turn_off": "አጥፋ",
  "settings.network.discovery": "የጂኦ አስተላላፊ ፍለጋ",
  "settings.network.discovery_desc":
    "ከ300 በላይ ከተበተኑ አስተላላፊዎች ውስጥ ለአንድ የአካባቢ ሕዋስ በጣም ቅርብ የሆኑትን በራስ-ሰር ምረጥ",
  "settings.network.discovery_needs_relay": "መጀመሪያ የራስህን አስተላላፊ ጨምር",
  "settings.network.discovery_needs_relay_body":
    "Airhop ን ወደ ቅርብ አስተላላፊዎች የሚመራው ራስ-ሰር ፍለጋው ነው። ማጥፋቱ ትርጉም የሚኖረው ከታች የራስህን አስተላላፊዎች ካስቀመጥህ በኋላ ብቻ ነው፤ ስለዚህ መጀመሪያ ቢያንስ አንድ ጨምር።",
  "settings.network.custom_only_title": "የራስህን አስተላላፊዎች ብቻ ትጠቀማለህ?",
  "settings.network.custom_only_body":
    "የአካባቢ ሰርጦችና የሜሽ ድልድዩ ቅርብ አስተላላፊዎችን በራስ-ሰር መምረጥ ያቆማሉ፤ አንተ የጨመርካቸውን ብቻ ይጠቀማሉ። ይህ ተደራሽነትን ሊቀንስ ይችላል፤ ወደ ቅርብ አስተላላፊዎች የሚሰበሰቡትን የbitchat ተጠቃሚዎችም ላታገኛቸው ትችላለህ።",
  "settings.network.custom": "የራስ አስተላላፊዎች",
  "settings.network.custom_desc": "ለአካባቢ ሰርጦችና ለሜሽ ድልድይ የራስህን አስተላላፊዎች ጨምር",
  "settings.network.custom_added": "ከ{max} ውስጥ {count} ተጨምሯል",
  "settings.network.dm_relays": "የመልእክት አስተላላፊዎች",
  "settings.network.dm_relays_desc":
    "ቀጥተኛ መልእክቶችና የግል ሰርጦች ሁልጊዜ እነዚህን ይጠቀማሉ። የራስ አስተላላፊዎች እነዚህን አይቀይሩም።",
  "settings.network.discovery_back_on": "የጂኦ አስተላላፊ ፍለጋ እንደገና በርቷል",
  "settings.network.discovery_back_on_body":
    "ያ የመጨረሻው የራስህ አስተላላፊ ነበር። የአካባቢ ሰርጦች የሚያሳትሙበት ቦታ ስለሚያስፈልጋቸው Airhop እንደገና ቅርብ አስተላላፊዎችን በራስ-ሰር እየመረጠ ነው።",
  "settings.network.add_relay": "አስተላላፊ ጨምር",
  "settings.network.remove_relay": "{url} አስወግድ",
  "settings.network.add_short": "ጨምር",
  "settings.network.relay_limit":
    "{count} አስተላላፊዎችን መጨመር ትችላለህ። ሌላ ለመጨመር አንዱን አስወግድ።",
  "settings.network.relay_duplicate": "ያ አስተላላፊ አስቀድሞ በዝርዝርህ ውስጥ ነው።",
  "settings.network.relay_invalid":
    "ትክክለኛ የአስተላላፊ አድራሻ አስገባ፤ ለምሳሌ relay.example.com። ወደብ የሚያስፈልገው አስተላላፊው ነባሪውን የማይጠቀም ከሆነ ብቻ ነው። የIP አድራሻዎችና የአካባቢ ስሞች አይፈቀዱም።",
  "settings.network.lan": "የአካባቢ አውታረ መረብ",
  "settings.network.lan_desc":
    "በተመሳሳይ WiFi ላይ ያሉ ሰዎችን ያግኙ፣ በiPhone እና Android መካከልም ጭምር። በአውታረ መረቡ ላይ ያሉ ሌሎች መሣሪያዎች Airhop እያሄዱ መሆንዎን ማየት ይችላሉ።",
  "settings.network.lan_searching": "በዚህ አውታረ መረብ ላይ ምንም የAirhop መሣሪያ የለም",
  "settings.network.lan_active": "በዚህ አውታረ መረብ ላይ ተገናኝቷል",
  "settings.network.lan_unavailable": "በWiFi አውታረ መረብ ላይ አይደለም",
  "settings.network.lan_permission": "የAirhop የአካባቢ አውታረ መረብ መዳረሻ ጠፍቷል",
  "settings.network.lan_unsupported": "በዚህ መሣሪያ ላይ አይገኝም",
  "settings.network.lan_foreground": "Airhop በጀርባ ሲሆን ይቆማል። ብሉቱዝ መስራቱን ይቀጥላል።",
  "settings.network.wifi_pair": "ማጣመር",
  "settings.network.wifi_paired": "የተጣመሩ መሣሪያዎች",
  "settings.network.wifi_pair_find": "መሣሪያ ፈልግ",
  "settings.network.wifi_pair_find_desc":
    "ራሱን እያሳየ ያለ በአቅራቢያ ያለ iPhone ይፈልጉ። ሁለቱም ስልኮች iOS 26 ወይም ከዚያ በኋላ ያስፈልጋቸዋል።",
  "settings.network.wifi_pair_show": "ይህን iPhone አሳይ",
  "settings.network.wifi_pair_show_desc":
    "በአቅራቢያ ያለ iPhone ይህን እንዲያገኘው ይፍቀዱ። አንዳችሁ ትፈልጋላችሁ፣ ሌላችሁ ታሳያላችሁ፣ በተመሳሳይ ጊዜ።",
  "settings.network.wifi_pair_find_action": "በአቅራቢያ ያለ iPhone ይምረጡ",
  "settings.network.wifi_pair_show_action": "ይህ iPhone እንዲገኝ ያድርጉ",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware አሁን አይገኝም",
  "settings.network.wifi_pair_forget": "በSettings መተግበሪያ ውስጥ ማጣመርን ያስወግዱ",
  "settings.network.bitchat": "ከbitchat ጋር ተኳሃኝነት",
  "settings.network.bitchat_desc":
    "ከbitchat ጋር አንድ አይነት የBLE ሜሽ፤ ሙሉ በሙሉ አብሮ የሚሠራ። ይህ ሁልጊዜ በርቷል፤ ሊጠፋም አይችልም።",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "በጀርባ አሂድ",
  "settings.conn.background_desc": "Airhop ሲዘጋም ሜሹ እንዲሠራ አድርግ",
  "settings.conn.background_on_title": "ሜሹ መሥራቱን ይቀጥል?",
  "settings.conn.background_on_body":
    "Airhop ተዘግቶም ማስተላለፉንና መቀበሉን ይቀጥላል፤ ስለዚህ አንተ በሌለህበት ጊዜ መልእክቶች ይደርሳሉ። ይህን ሲያደርግ Android ቀጣይ ማሳወቂያ ያሳያል።",
  "settings.conn.background_off_title": "Airhop ሲዘጋ ሜሹ ይቁም?",
  "settings.conn.background_off_body":
    "መልእክቶች የሚደርሱት Airhop ክፍት ሲሆን ብቻ ነው፤ ይህ ስልክ ደግሞ በአቅራቢያ ላሉ ሰዎች ማስተላለፉን ያቆማል። ቀጣዩ ማሳወቂያ ይጠፋል።",
  "settings.conn.live_voice": "ቀጥታ ድምፅ",
  "settings.conn.live_voice_desc": "በአቅራቢያ ካሉ ሰዎች ጋር እንደ ዋኪ-ቶኪ ተነጋገር",
  "settings.conn.live_voice_on_title": "ቀጥታ ድምፅ ይብራ?",
  "settings.conn.live_voice_on_body":
    "ማይኩን ተጭነህ ስትይዝ ድምፅህ እየተናገርክ ሳለ በብሉቱዝ ክልል ውስጥ ላሉ ሁሉ ይላካል፤ የእነሱም ድምፅ በስልክህ ላይ ይሰማል። ምንም አይቀዳም።",
  "settings.conn.live_voice_off_title": "ቀጥታ ድምፅ ይጥፋ?",
  "settings.conn.live_voice_off_body":
    "ማይኩን ተጭነህ ስትይዝ በምትኩ የድምፅ መልእክት ይቀዳል። ስትለቀው ይላካል፤ እስኪያጫውቱትም ማንም አይሰማውም።",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "የTor አቅጣጫ",
  "settings.conn.tor_desc": "ለተጨማሪ ግላዊነት የNostr ትራፊክን በTor በኩል አሳልፍ",
  "settings.conn.tor_on_title": "የNostr ትራፊክ በTor በኩል ይሂድ?",
  "settings.conn.tor_on_body":
    "አስተላላፊዎች የIP አድራሻህን ማየት ያቆማሉ። መገናኘት ረዥም ጊዜ ይወስዳል፤ መልእክቶችም ቀስ ብለው ይደርሳሉ። ብሉቱዝ አይነካም።",
  "settings.conn.tor_off_title": "የTor አቅጣጫ ይጥፋ?",
  "settings.conn.tor_off_body":
    "የNostr ትራፊክ ወደ ተራው ግንኙነትህ ይመለሳል፤ ስለዚህ አስተላላፊዎች እንደገና የIP አድራሻህን ያያሉ። በሁለቱም መንገድ ብሉቱዝ አይነካም።",
  "settings.conn.tor_unavailable": "በዚህ ስሪት ውስጥ የTor አቅጣጫ አይገኝም።",
  "settings.conn.tor_timeout":
    "Tor ለመገናኘት ከአንድ ደቂቃ በላይ እየወሰደ ነው። በርቶ ይቀጥላል፤ መሞከሩንም ይቀጥላል፤ የሜሽ ትሩ መቼ እያመራ እንደሆነ ወይም ይህ አውታረ መረብ እያገደው እንደሆነ ይነግርሃል።",
  "settings.conn.tor_failed":
    "Tor ሊጀመር አልቻለም። መተግበሪያው የአውታረ መረብ መዳረሻ እንዳለው አረጋግጥ።",
  "settings.tor.connection": "ግንኙነት",
  "settings.tor.mode_off": "ቀጥታ",
  "settings.tor.mode_off_desc":
    "በቀጥታ ወደ Tor ይገናኛል። በጣም ፈጣን፣ ነገር ግን ይህን አውታረ መረብ የሚከታተል ማንኛውም ሰው Tor እንደሚጠቀሙ ማየት ይችላል።",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Tor እንደሚጠቀሙ ይደብቃል፣ እና ድልድዮች በታገዱበት ቦታም ይሠራል። ለመገናኘት በጣም ቀርፋፋ።",
  "settings.tor.mode_obfs4": "ድልድይ",
  "settings.tor.mode_obfs4_desc":
    "Tor እንደሚጠቀሙ ይደብቃል። ከ Snowflake ይፈጥናል፣ ግን እነዚህ ድልድዮች ይፋዊ ናቸው እና አንዳንድ አውታረ መረቦች ያግዷቸዋል።",
  "settings.tor.mode_custom": "ብጁ ድልድዮች",
  "settings.tor.mode_custom_desc":
    "ከ bridges.torproject.org ያገኟቸውን ድልድዮች ይጠቀሙ። ሌሎቹ ሲወድቁ ይህን ይሞክሩ።",
  "settings.tor.custom_placeholder": "በአንድ መስመር አንድ የድልድይ መስመር ይለጥፉ",
  "settings.tor.custom_empty": "መጀመሪያ ቢያንስ አንድ የድልድይ መስመር ያክሉ።",
  "settings.conn.mint_clearnet": "የሚንት ትራፊክ በክፍት አውታረ መረብ ላይ ይፈቀድ",
  "settings.conn.mint_clearnet_desc":
    "በiOS ላይ Tor የሚሸፍነው Nostr ን ብቻ ነው። የሚንት ጥያቄዎችን ለማገድ አጥፍተህ ተወው፤ በሁለቱም መንገድ በሜሽ ላይ ecash መሥራቱን ይቀጥላል።",
  "settings.conn.gateway": "የኢንተርኔት መተላለፊያ",
  "settings.conn.gateway_desc":
    "በአቅራቢያ ላለ ከመስመር ውጭ ስልክ ግንኙነትህን አበድር፤ የአካባቢ ሰርጦችን መድረስ እንዲችል",
  "settings.conn.gateway_on_title": "የኢንተርኔት መተላለፊያ ይብራ?",
  "settings.conn.gateway_on_body":
    "የራሳቸው ግንኙነት የሌላቸው በአቅራቢያ ያሉ ስልኮች የአካባቢ-ሰርጥ መልእክቶችን በአንተ በኩል ይልካሉ፤ ይቀበላሉም። ይህ የሞባይል ዳታህንና ባትሪህን ይጠቀማል፤ መልእክቶቻቸው ከጫፍ እስከ ጫፍ የተመሰጠሩ ስለሆኑ የሚያልፈውን ማንበብ አትችልም።",
  "settings.conn.gateway_off_title": "የኢንተርኔት መተላለፊያ ይጥፋ?",
  "settings.conn.gateway_off_body":
    "በአቅራቢያ ያሉ ከመስመር ውጭ ስልኮች በአንተ በኩል የአካባቢ ሰርጦችን መድረሳቸውን ያቆማሉ። የራስህ መልእክቶች አይነኩም።",
  "settings.conn.bridge": "የሜሽ ድልድይ",
  "settings.conn.bridge_desc":
    "የዚህን አካባቢ ይፋዊ #bluetooth ውይይት በኢንተርኔት በኩል ከክልል ውጭ ካለ ሌላ የብሉቱዝ ስብስብ ጋር አገናኝ",
  "settings.conn.bridge_on_title": "የሜሽ ድልድይ ይብራ?",
  "settings.conn.bridge_on_body":
    "ይፋዊ የ#bluetooth መልእክቶችህ በኢንተርኔት በኩል ወደ ሰፈርህ ይሰራጫሉ፤ ስለዚህ ከብሉቱዝ ክልል ውጭ ያሉ ሰዎችም ሊያነቧቸው ይችላሉ። የግል መልእክቶች ፈጽሞ በድልድይ አይሻገሩም፤ “በአቅራቢያ ብቻ” ደግሞ ማንኛውንም ነጠላ መልእክት በአካባቢው ያቆየዋል።",
  "settings.conn.bridge_off_title": "የሜሽ ድልድይ ይጥፋ?",
  "settings.conn.bridge_off_body":
    "ይፋዊ የ#bluetooth መልእክቶችህ እንደገና በብሉቱዝ ክልል ውስጥ ይቀራሉ፤ ከድልድዩ ማዶ ካለው ስብስብም መልእክቶች መምጣታቸውን ያቆማሉ።",
  "settings.conn.bridge_needs_location": "የሜሽ ድልድይ አካባቢ ይፈልጋል",
  "settings.conn.bridge_needs_location_desc":
    "ሰፈርህን ከአካባቢ ንባብ ያገኘዋል። ድልድዩን ለመጀመር የአካባቢ ፈቃድ ስጥ።",
  "settings.conn.grant_location": "የአካባቢ ፈቃድ ስጥ",
  "settings.conn.grant_short": "ፍቀድ",
  "settings.conn.internet_off": "ኢንተርኔት ጠፍቷል",
  "settings.conn.internet_off_desc":
    "Tor፣ ድልድዩና መተላለፊያው ሁሉም ኢንተርኔት ይጠቀማሉ። እነሱን ለመጠቀም በአውታረ መረብ ስር ያለውን የኢንተርኔት አማራጭ አብራ።",
  "settings.conn.turn_on": "አብራ",
  "settings.conn.turn_off": "አጥፋ",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "ብሉቱዝ",
  "settings.permissions.bluetooth_desc":
    "በአቅራቢያ ያሉ መሣሪያዎችን ያገኛል፤ በመካከላቸውም መልእክቶችን ያስተላልፋል። ያለሱ ሜሹ ሊሠራ አይችልም።",
  "settings.permissions.location": "አካባቢ",
  "settings.permissions.location_desc":
    "በአቅራቢያ ያሉ የአካባቢ ሰርጦችን ይከፍታል። ያለሱ እነዚያ ሰርጦች ተዘግተው ይቀራሉ፤ የብሉቱዝ ሜሹ ግን እንደተለመደው ይቀጥላል።",
  "settings.permissions.notifications": "ማሳወቂያዎች",
  "settings.permissions.notifications_desc":
    "መተግበሪያው ተዘግቶም እንኳ ስለ አዲስ መልእክቶች ማሳወቂያ ተቀበል። ያለሱ የምታያቸው Airhop ን ስትከፍት ብቻ ነው።",
  "settings.permissions.camera": "ካሜራ",
  "settings.permissions.camera_desc":
    "የQR ኮዶችን ቃኝ፤ ለመላክም ፎቶ ወይም ቪዲዮ አንሳ። ያለሱም ከቤተ-መጻሕፍትህ ሚዲያ ማጋራት ትችላለህ።",
  "settings.permissions.photos": "ፎቶዎች",
  "settings.permissions.photos_desc":
    "ከቤተ-መጻሕፍትህ ፎቶዎችን ላክ፤ የደረሰ ሚዲያንም አስቀምጥ። ያለሱም በካሜራ አዳዲስ ፎቶዎችን አንስተህ መላክ ትችላለህ።",
  "settings.permissions.microphone": "ማይክሮፎን",
  "settings.permissions.microphone_desc":
    "የድምፅ መልእክቶችን ቅዳና ላክ ወይም ቀጥታ ድምፅን ተጠቀም። ያለሱ የድምፅ መልእክቶችና ቀጥታ ድምፅ አይሠሩም።",
  "settings.permissions.allow": "ይህን ፈቃድ ፍቀድ",
  "settings.permissions.open_settings": "ይህን ፈቃድ ለመቀየር የስርዓት ቅንብሮችን ክፈት",
  "settings.permissions.system": "ስርዓት",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "የአውታረ መረብ አጠቃቀም",
  "settings.storage.storage_usage": "የማከማቻ አጠቃቀም",
  "settings.storage.storage_usage_desc": "መልእክቶች፣ የቦርሳ ማረጋገጫዎችና የተቀመጡ አባሪዎች",
  "settings.storage.session_usage": "ይህ ክፍለ ጊዜ · {sent} ተልኳል፣ {received} ደርሷል",
  "settings.storage.cache": "ጊዜያዊ ማከማቻ",
  "settings.storage.cache_desc": "{size} አባሪዎች",
  "settings.storage.clear_cache": "የአባሪ ጊዜያዊ ማከማቻን አጽዳ",
  "settings.storage.clear": "አጽዳ",
  "settings.storage.clear_title": "የተቀመጠ ሚዲያ ይጽዳ?",
  "settings.storage.clear_body":
    "ፎቶዎች፣ ቪዲዮዎች፣ የድምፅ መልእክቶችና ፋይሎች ከዚህ መሣሪያ ይወገዳሉ፤ የተላኩትም የደረሱትም። እንደገና ሊወርዱ አይችሉም፦ አረፋዎቻቸው ይህንኑ ይናገራሉ፤ ላኪውንም እንደገና እንዲልክ መጠየቅ ትችላለህ። መልእክቶችና ቦርሳ አይነኩም።",
  "settings.storage.cleared": "ጊዜያዊ ማከማቻው ጸድቷል",
  "settings.storage.freed": "{size} ተለቋል።",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "መልክን ወደ {value} አዘጋጅ",
  "settings.font.set_a11y": "የተስተካከለ ስፋት ቅርጸ ቁምፊን ወደ {value} አዘጋጅ",
  "settings.font.system": "ስርዓት",
  "settings.font.system_desc": "የመሣሪያህን ነባሪ የተስተካከለ ስፋት ቅርጸ ቁምፊ ይጠቀማል",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "ዘመናዊና ለማንበብ ቀላል",
  "settings.language.en": "እንግሊዝኛ",
  "settings.language.am": "አማርኛ",
  "settings.language.ar": "ዓረብኛ",
  "settings.language.bn": "ቤንጋልኛ",
  "settings.language.my": "ቡርማኛ",
  "settings.language.zh_hans": "ቻይንኛ (ቀላል)",
  "settings.language.zh_hant": "ቻይንኛ (ባህላዊ)",
  "settings.language.nl": "ደች",
  "settings.language.fil": "ፊሊፒንኛ",
  "settings.language.fr": "ፈረንሳይኛ",
  "settings.language.ka": "ጆርጂያኛ",
  "settings.language.de": "ጀርመንኛ",
  "settings.language.hi": "ሂንዲ",
  "settings.language.id": "ኢንዶኔዥያኛ",
  "settings.language.it": "ጣልያንኛ",
  "settings.language.ja": "ጃፓንኛ",
  "settings.language.ko": "ኮሪያኛ",
  "settings.language.mg": "ማላጋሲኛ",
  "settings.language.ms": "ማላይኛ",
  "settings.language.ne": "ኔፓልኛ",
  "settings.language.fa": "ፋርስኛ",
  "settings.language.pl": "ፖላንድኛ",
  "settings.language.pt_br": "ፖርቱጋልኛ (ብራዚል)",
  "settings.language.pt_pt": "ፖርቱጋልኛ (ፖርቱጋል)",
  "settings.language.pa": "ፑንጃብኛ",
  "settings.language.ru": "ሩስያኛ",
  "settings.language.es": "ስፓንኛ",
  "settings.language.sw": "ስዋሂሊ",
  "settings.language.sv": "ስዊድንኛ",
  "settings.language.ta": "ታሚልኛ",
  "settings.language.th": "ታይኛ",
  "settings.language.tr": "ቱርክኛ",
  "settings.language.uk": "ዩክሬንኛ",
  "settings.language.ur": "ኡርዱ",
  "settings.language.vi": "ቬትናምኛ",
  "settings.language.pseudo": "ሙከራ ቋንቋ",
  "settings.language.soon": "በቅርቡ ይመጣል",
  "settings.language.soon_a11y": "{value}፣ በቅርቡ ይመጣል",
  "settings.language.set_a11y": "ቋንቋን ወደ {value} አዘጋጅ",
  "settings.language.pending": "በሚቀጥለው ክፍት ጊዜ",
  "settings.language.pending_a11y": "{value}፣ በሚቀጥለው ጊዜ Airhop ን ስትከፍት ይሠራል",
  "settings.language.rtl_restart": "አሁን ክፈት",
  "settings.language.rtl_title": "ለማጠናቀቅ Airhop ን እንደገና ክፈት",
  "settings.language.rtl_body":
    "{value} ከቀኝ ወደ ግራ ይነበባል፤ Airhop ደግሞ አቅጣጫውን መቀየር የሚችለው ሲጀምር ብቻ ነው። መቀየሩን ለማጠናቀቅ ዝጋውና እንደገና ክፈተው። ምንም አይጠፋም፤ እስከዚያ ድረስም ሜሽህ ተገናኝቶ ይቆያል።",
  "settings.theme.light": "ብሩህ",
  "settings.theme.light_desc": "ሁልጊዜ ብሩህ ቀለሞችን ተጠቀም",
  "settings.theme.dark": "ጨለማ",
  "settings.theme.dark_desc": "ሁልጊዜ ጨለማ ቀለሞችን ተጠቀም",

  // ---- Settings: profile and identity ----
  "settings.status.online": "ኦንላይን",
  "settings.status.online_desc": "ሊገኝ የሚችል፤ እያስታወቀና እያሰሰ",
  "settings.status.away": "ራቅ ብሏል",
  "settings.status.away_desc": "ሜሽ ቆሟል፤ አያስስም አያስታውቅም",
  "settings.status.invisible": "የማይታይ",
  "settings.status.invisible_desc": "እያሰሰ፣ ግን ከፍለጋ ተደብቋል",
  "settings.status.title": "ሁኔታ",
  "settings.status.set_a11y": "ሁኔታን ወደ {value} አዘጋጅ",
  "settings.status.edit": "ሁኔታን አርትዕ",
  "settings.status.desc": "በሜሹ ላይ ምን ያህል እንደምትታይ ምረጥ።",
  "settings.transfer.identity": "ማንነትና ቁልፎች",
  "settings.transfer.identity_desc": "የአቻ መለያህ፣ የተጠቃሚ ስምህና እውቂያዎችህ",
  "settings.transfer.chats": "ውይይቶችና ታሪክ",
  "settings.transfer.chats_desc": "ውይይቶች፣ ቡድኖችና የተቀላቀልካቸው ሰርጦች",
  "settings.transfer.wallet": "የቦርሳ ቀሪ ሂሳብ",
  "settings.transfer.wallet_desc": "የCashu ማረጋገጫዎችና የግብይት ታሪክ",
  "settings.transfer.title": "ወደ አዲስ ስልክ አስተላልፍ",
  "settings.transfer.desc": "ማንነትህን፣ ውይይቶችህንና ቦርሳህን ወደ ሌላ መሣሪያ አዛውር",
  "settings.transfer.coming_soon_a11y": "ወደ አዲስ ስልክ ማስተላለፍ፣ በቅርቡ ይመጣል",
  "settings.transfer.body":
    "ሁለቱን ስልኮች አጠጋግተህ ያዝና ሁሉንም ነገር በብሉቱዝ አሻግር። ምንም በአገልጋይ አያልፍም፤ ስለዚህ ያለ ኢንተርኔት ይሠራል።",
  "settings.qr.permission_label": "የፎቶ መዳረሻ",
  "settings.qr.permission_purpose": "QR ኮድህን ለማስቀመጥ",
  "settings.qr.saved": "ተቀምጧል",
  "settings.qr.saved_body": "QR ኮዱ በፎቶ ቤተ-መጻሕፍትህ ውስጥ ተቀምጧል።",
  "settings.qr.save_failed": "ማስቀመጥ አልተቻለም",
  "settings.qr.save_failed_body": "QR ኮዱ ሊቀመጥ አልቻለም። እንደገና ሞክር።",
  "settings.qr.share_message": "በAirhop ላይ ጨምረኝ",
  "settings.qr.share_body":
    "በAirhop ላይ ጨምረኝ — ከመስመር ውጭ ቅድሚያ የሚሰጥ የግል ሜሽ መልእክት መላላኪያ።",
  "settings.qr.show_short": "QR አሳይ",
  "settings.qr.title": "የአንተ QR ኮድ",
  "settings.qr.note":
    "ይህ ሌሎች ከየትም ሆነው መልእክት እንዲልኩልህ የሚያስችሉ ይፋዊ ቁልፎችህን ይዟል። ከምታምናቸው ሰዎች ጋር ብቻ አጋራው። ማንነትህን እስካልደመሰስክ ድረስ አይቀየርም።",
  "settings.qr.code_label": "የእውቂያ ኮድ",
  "settings.qr.copy_code": "የእውቂያ ኮድን ቅዳ",
  "settings.qr.share": "QR ኮድን አጋራ",
  "settings.qr.share_short": "QR አጋራ",
  "settings.qr.download": "QR ኮድን አውርድ",
  "settings.qr.download_short": "QR አውርድ",
  "settings.qr.show": "QR ኮድን አሳይ",
  "settings.wipe.trigger": "የአስቸኳይ ማጽዳት አስነሳ",
  "settings.wipe.trigger_desc": "ሳታረጋግጥ ወዲያውኑ ለማጽዳት ሦስት ጊዜ ንካ",
  "settings.wipe.title": "አስቸኳይ ማጽዳት",
  "settings.wipe.now": "አሁን አጽዳ",
  "settings.wipe.desc": "ሁሉንም ቁልፎች፣ መልእክቶችና ማረጋገጫዎች ወዲያውኑ አጥፋ",
  "settings.wipe.body":
    "ይህ ሁሉንም ቁልፎችህን፣ መልእክቶችህንና የቦርሳ ማረጋገጫዎችህን ወዲያውኑ ያጠፋል። ይህ ሊመለስ አይችልም።",
  "settings.wipe.in_progress": "እየጸዳ ነው",
  "settings.wipe.in_progress_body":
    "ቁልፎችህ፣ መልእክቶችህና ፋይሎችህ እየጠፉ ናቸው። ጥቂት ሰከንዶች ይወስዳል፤ መተግበሪያው ቢዘጋም በራሱ ይጠናቀቃል።",
  "settings.wipe.got_it": "ገባኝ",
  "settings.wipe.keys_failed": "ቁልፎቹ ሊጠፉ አልቻሉም",
  "settings.wipe.keys_failed_body":
    "መልእክቶችህ፣ እውቂያዎችህና ቦርሳህ ጠፍተዋል፤ መሣሪያው ግን ቁልፎችህን ለመልቀቅ ፈቃደኛ አልሆነም። መሣሪያውን ክፈትና እንደገና አጽዳ።",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "አግኙን",
  "settings.help.contact_a11y": "ወደ {address} ኢሜይል ላክ",
  "settings.help.bug": "ችግር ሪፖርት አድርግ",
  "settings.help.bug_desc": "በGitHub ላይ issue ክፈት",
  "settings.help.bug_a11y": "በGitHub ላይ ችግር ሪፖርት አድርግ",
  "settings.help.faq": "ተደጋጋሚ ጥያቄዎች",
  "settings.help.faq_desc": "ለተለመዱ ጥያቄዎች መልሶች",
  "settings.help.faq_a11y": "ተደጋጋሚ ጥያቄዎችን ክፈት",
  "settings.help.terms_desc": "Airhop እንዴት መጠቀም እንደሚቻል",
  "settings.help.terms_a11y": "የአገልግሎት ውሎችን ክፈት",
  "settings.help.privacy_desc": "የማንሰበስበው ነገር",
  "settings.help.privacy_a11y": "የግላዊነት መመሪያን ክፈት",

  // ---- Settings: support ----
  "settings.support.card": "ካርድ ወይም UPI",
  "settings.support.card_desc": "የኔትባንኪንግና የቦርሳ ክፍያዎች፣ በዓለም ዙሪያ",
  "settings.support.card_a11y": "በካርድ፣ በUPI፣ በኔትባንኪንግ ወይም በቦርሳ ደግፍ",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "ወርሃዊ ወይም አንድ ጊዜ፤ የመድረክ ክፍያ የለም",
  "settings.support.sponsors_a11y": "በGitHub Sponsors በኩል ደግፍ",
  "settings.support.note":
    "Airhop ን የምሠራው በትርፍ ጊዜዬ ነው። ባለሀብቶችም ማስታወቂያዎችም የሉም። ለአንተ ጠቃሚ ከሆነ፣ የምታደርገው አስተዋጽኦ ልማቱ እንዲቀጥል ብዙ ይረዳል። በሁለቱም መንገድ እያንዳንዱ ባህሪ ነፃ ሆኖ ይቀጥላል።",

  // ---- Settings: about and version ----
  "settings.about.version": "ስሪት",
  "settings.about.version_desc": "አሁን ያለው ልቀት",
  "settings.about.version_a11y": "ስሪቱን ተመልከትና ዝመናዎችን መርምር",
  "settings.about.release_notes": "የልቀት ማስታወሻዎች",
  "settings.about.release_notes_desc": "በቅርቡ በወጣው ልቀት ውስጥ ያለው አዲስ ነገር",
  "settings.about.release_notes_a11y": "የቅርቡን የልቀት ማስታወሻዎች በGitHub ላይ ክፈት",
  "settings.about.source": "ምንጭ ኮድ",
  "settings.about.source_a11y": "ምንጭ ኮዱን በGitHub ላይ ክፈት",
  "settings.about.licenses": "የክፍት ምንጭ ፈቃዶች",
  "settings.about.open_repo": "የ{name} ማከማቻን ክፈት",
  "settings.about.licenses_desc": "የሦስተኛ ወገን ክፍት ምንጭ ጥቅሎች",
  "settings.about.licenses_a11y": "የሦስተኛ ወገን ፈቃዶችን ተመልከት",
  "settings.version.codename": "የኮድ ስም",
  "settings.version.checking": "እየተመረመረ",
  "settings.version.check": "ዝመናዎችን መርምር",
  "settings.version.checking_title": "ዝመናዎች እየተመረመሩ ነው",
  "settings.version.up_to_date": "የቅርቡን ስሪት እየተጠቀምክ ነው።",
  "settings.version.release_notes": "የልቀት ማስታወሻዎችን ተመልከት",
  "settings.version.made_with": "የተሠራው በ",
  "settings.version.number": "ስሪት {version}",
  "settings.version.update_to": "ወደ {version} አዘምን",
  "settings.version.update_to_a11y": "ወደ ስሪት {version} አዘምን",
  "settings.version.released_under": "በ{license} ስር የተለቀቀ",
  "settings.version.notes_a11y": "የስሪት {version} የልቀት ማስታወሻዎችን ተመልከት",
  "settings.version.tor_paused":
    "IP አድራሻህ እንዳይወጣ Tor በርቶ እያለ የዝመና ምርመራ ይቆማል። የልቀት ገጹን በአሳሽ ተመልከት።",
  "settings.version.check_failed":
    "ዝመናዎችን መመርመር አልተቻለም። ግንኙነትህን አረጋግጥና እንደገና ሞክር።",
  "settings.version.downloading": "በማውረድ ላይ {percent}%",
  "settings.version.install": "ጫን",
  "settings.version.download_failed": "ማውረድ አልተሳካም። ግንኙነትዎን አረጋግጠው እንደገና ይሞክሩ።",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} {size} KiB ነው፤ ከ{cap} KiB ገደብ በላይ።",
  "transfer.failed.malformed":
    "አንድ አባሪ ተበላሽቶ ደረሰና ሊከፈት አልቻለም። እንደገና እንዲልኩት ጠይቃቸው።",
  "transfer.failed.unsupported_type": "አንድ አባሪ ይህ መተግበሪያ ሊከፍተው በማይችል ቅርጸት ደረሰ።",
  "transfer.failed.type_mismatch":
    "አንድ አባሪ ተቀባይነት አላገኘም፦ ይዘቱ ካለው የፋይል ዓይነት ጋር አይዛመድም።",
  "transfer.failed.storage": "አንድ አባሪ ደረሰ ግን ሊቀመጥ አልቻለም። ያለህን ነፃ ቦታ አረጋግጥ።",
  "transfer.badge.waiting": "በመጠባበቅ ላይ · {name}",
  "transfer.badge.active_count": "{count} ዝውውሮች",
  "transfer.badge.sending": "{name} እየተላከ ነው",
  "transfer.badge.receiving": "{name} እየተቀበለ ነው",
  "transfer.badge.a11y": "{label}፣ {percent} በመቶ። ውይይቱን ክፈት።",
  "transfer.kind.photo": "ፎቶ",
  "transfer.kind.video": "ቪዲዮ",
  "transfer.kind.voice": "የድምፅ መልእክት",
  "transfer.this.photo": "ይህ ፎቶ",
  "transfer.this.video": "ይህ ቪዲዮ",
  "transfer.this.voice": "ይህ የድምፅ መልእክት",
  "transfer.this.file": "ይህ ፋይል",
  "transfer.kind.document": "ሰነድ",
  "transfer.kind.voice_preview": "የድምፅ መልእክት",
  "transfer.kind.photo_preview": "ፎቶ",
  "transfer.kind.video_preview": "ቪዲዮ",
  "transfer.kind.document_preview": "ሰነድ",

  // ---- System notifications ----
  "notif.channel.messages": "መልእክቶች",
  "notif.channel.nearby": "በአቅራቢያ ያሉ አቻዎች",
  "notif.channel.nearby_desc":
    "ሜሹ በብሉቱዝ ክልል ውስጥ ሰዎችን ሲያገኝ አልፎ አልፎ የሚላክ ማስታወቂያ።",
  "notif.nearby.body": "አሁን በብሉቱዝ ክልል ውስጥ። ሜሹን ለመክፈት ንካ።",
  "notif.channel_message": "{sender}፦ {preview}",
  "notif.someone": "አንድ ሰው",
  "notif.notice_urgent": "አስቸኳይ ማስታወቂያ · {content}",
  "notif.notice": "ማስታወቂያ · {content}",
  "notif.incoming_file": "የሚገባ ፋይል",
  "notif.preview.photo": "📷 ፎቶ",
  "notif.preview.voice": "🎤 የድምፅ መልእክት",
  "notif.preview.video": "🎥 ቪዲዮ",
  "notif.preview.document": "📄 ሰነድ",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "አዲስ መልእክት",
  "notif.hidden.channel": "አዲስ እንቅስቃሴ",
  "notif.hidden.mention": "ተጠቅሰሃል",
  "notif.mention.title": "{sender} ጠቅሶሃል",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "{count} ተጨማሪ አሳይ",
    other: "{count} ተጨማሪ አሳይ",
  },
  "chat.channels.show_more_a11y": {
    one: "{count} ተጨማሪ ነባሪ ሰርጥ አሳይ",
    other: "{count} ተጨማሪ ነባሪ ሰርጦች አሳይ",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}፣ {count} ያልተነበበ",
    other: "{label}፣ {count} ያልተነበቡ",
  },
  "a11y.new_count": {
    one: "{label}፣ {count} አዲስ",
    other: "{label}፣ {count} አዲስ",
  },
  "chat.a11y.unread": {
    one: "{count} ያልተነበበ",
    other: "{count} ያልተነበቡ",
  },
  "chat.thread.length_left": {
    one: "{count} ቀርቷል",
    other: "{count} ቀርተዋል",
  },
  "settings.general.retention_days": {
    one: "{count} ቀን",
    other: "{count} ቀናት",
  },
  "chat.info.group_reach": {
    one: "ከ{count} አባል {reachable} ይደረሳል",
    other: "ከ{count} አባላት {reachable} ይደረሳሉ",
  },
  "chat.group_members": {
    one: "የግል ቡድን  ·  {count} አባል",
    other: "የግል ቡድን  ·  {count} አባላት",
  },
  "chat.select.count": {
    one: "{count} ተመርጧል",
    other: "{count} ተመርጠዋል",
  },
  "chat.select.forward": {
    one: "{count} መልእክት አስተላልፍ",
    other: "{count} መልእክቶች አስተላልፍ",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} እየተናገረ ነው",
    other: "{count} እየተናገሩ ናቸው",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} አቻ በክልል ውስጥ",
    other: "{count} አቻዎች በክልል ውስጥ",
  },
  "mesh.peer.hops_away": {
    one: "{count} ዝላይ ርቀት",
    other: "{count} ዝላዮች ርቀት",
  },
  "chat.presence.active": {
    one: "{count} ንቁ",
    other: "{count} ንቁዎች",
  },
  "chat.presence.nearby": {
    one: "{count} በአቅራቢያ",
    other: "{count} በአቅራቢያ",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} ሚንት",
    other: "{count} ሚንቶች",
  },
  "wallet.mint.remove_body": {
    one: "{mint} {balance} {unit} በ{count} ማረጋገጫ ውስጥ ይዟል። ማስወገዱ ያንን ማረጋገጫ ከዚህ መሣሪያ ለዘለቄታው ይሰርዘዋል፤ ምትኬም የለም። መጀመሪያ ቀሪ ሂሳቡን አውጣ ወይም ላክ።",
    other:
      "{mint} {balance} {unit} በ{count} ማረጋገጫዎች ውስጥ ይዟል። ማስወገዱ እነዚያን ማረጋገጫዎች ከዚህ መሣሪያ ለዘለቄታው ይሰርዛቸዋል፤ ምትኬም የለም። መጀመሪያ ቀሪ ሂሳቡን አውጣ ወይም ላክ።",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} ተቀማጭ ክፍያ እየጠበቀ ነው። መተግበሪያው በተከፈተ ቁጥር እንደገና ይመረመራል።",
    other: "{count} ተቀማጮች ክፍያ እየጠበቁ ናቸው። መተግበሪያው በተከፈተ ቁጥር እንደገና ይመረመራሉ።",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{count} ያልወጣ ማረጋገጫ ከ{mints} ተመልሷል።",
    other: "{count} ያልወጡ ማረጋገጫዎች ከ{mints} ተመልሰዋል።",
  },
  "wallet.backup.already_spent": {
    one: "{count} ሳንቲም ተገኘ ግን አስቀድሞ ወጪ ሆኗል፤ ስለዚህ ምንም አልተጨመረም። ይህ የተለመደ ነው፦ እስካሁን ያወጣኸው እያንዳንዱ ሳንቲም ሚንቱ በሚይዘው መዝገብ ውስጥ ይቀራል።",
    other:
      "{count} ሳንቲሞች ተገኙ ግን አስቀድመው ወጪ ሆነዋል፤ ስለዚህ ምንም አልተጨመረም። ይህ የተለመደ ነው፦ እስካሁን ያወጣኸው እያንዳንዱ ሳንቲም ሚንቱ በሚይዘው መዝገብ ውስጥ ይቀራል።",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "{count} ተጨማሪ አሳይ",
    other: "{count} ተጨማሪ አሳይ",
  },
  "wallet.activity.show_more_a11y": {
    one: "{count} ተጨማሪ ክፍያ አሳይ",
    other: "{count} ተጨማሪ ክፍያዎች አሳይ",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} ያልተረጋገጠ",
    other: "{count} ያልተረጋገጡ",
  },
  "wallet.proof_count": {
    one: "{count} ማረጋገጫ",
    other: "{count} ማረጋገጫዎች",
  },
  "wallet.spent_removed_detail": {
    one: "{count} ማረጋገጫ አስቀድሞ ወጪ ሆኖ ስለነበር ተወግዷል።",
    other: "{count} ማረጋገጫዎች አስቀድመው ወጪ ሆነው ስለነበር ተወግደዋል።",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "በአቅራቢያህ አንድ ሰው",
    other: "በአቅራቢያህ {count} ሰዎች",
  },
};

export const am = { strings, plurals };
