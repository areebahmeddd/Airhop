import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "ወደ መነሻ ተመለስ",
  "common.last_updated": "መጨረሻ የተዘመነው: {date}",

  "nav.aria": "ዋና አሰሳ",
  "nav.home": "የ Airhop መነሻ ገጽ",
  "nav.skip": "ወደ ይዘቱ ዝለል",
  "nav.menu.open": "ምናሌ ክፈት",
  "nav.menu.close": "ምናሌ ዝጋ",
  "nav.how_it_works": "እንዴት እንደሚሠራ",
  "nav.architecture": "አወቃቀር",
  "nav.faq": "ተደጋጋሚ ጥያቄዎች",

  "footer.aria": "የግርጌ ክፍል",
  "footer.tagline": "የግል መረብ ግንኙነት",
  "footer.credit": "© በ {author} በ {heart} የተሠራ",
  "footer.group.download": "ማውረድ",
  "footer.group.resources": "ግብዓቶች",
  "footer.group.social": "ማህበራዊ",
  "footer.group.legal": "ሕጋዊ",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "አወቃቀር",
  "footer.link.blogs": "ብሎግ",
  "footer.link.faq": "ተደጋጋሚ ጥያቄዎች",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "የአገልግሎት ውሎች",
  "footer.link.privacy": "የግላዊነት ፖሊሲ",
  "footer.link.license": "የፕሮጀክት ፈቃድ",

  "settings.theme.group": "የቀለም ገጽታ",
  "settings.theme.light": "ብሩህ ገጽታ",
  "settings.theme.dark": "ጨለማ ገጽታ",
  "settings.language.label": "ቋንቋ",
  "settings.language.suggestion": "ይህን ገጽ በአማርኛ ይመልከቱ",
  "settings.language.dismiss": "ዝጋ",

  "home.hero.release": "የቅርብ ጊዜ ልቀት",
  "home.hero.title": "ያለ ኢንተርኔት የሚሠራ የመልእክት ልውውጥ።",
  "home.hero.body":
    "በአቅራቢያ ያሉ ስልኮች የ Bluetooth መረብ ይመሠርታሉ፤ መልእክቶችዎን እስከ ሰባት ዝላይ ድረስ ከጫፍ እስከ ጫፍ ተመስጥረው ያስተላልፋሉ። {no_servers}፣ {no_accounts}፣ {no_tracking}።",
  "home.hero.body.no_servers": "አገልጋዮች የሉም",
  "home.hero.body.no_accounts": "መለያዎች የሉም",
  "home.hero.body.no_tracking": "ክትትል የለም",
  "home.hero.download": "መተግበሪያውን ያውርዱ",
  "home.hero.badges": "የ MIT ፈቃድ · ነጻና ክፍት ምንጭ · ከ bitchat ጋር ይሠራል",
  "home.hero.group.mobile": "ተንቀሳቃሽ",
  "home.hero.group.desktop": "ኮምፒውተር",
  "home.hero.option.f_droid": "የክፍት ምንጭ ዝርዝር",
  "home.hero.option.apk": "ቀጥታ ማውረድ",
  "home.hero.option.soon": "በቅርቡ ይመጣል",

  "home.about.eyebrow": "Airhop ምንድን ነው",
  "home.about.title": "አብዛኞቹ መተግበሪያዎች በአንድ ማዕከላዊ አገልጋይ ላይ ይመሠረታሉ።",
  "home.about.sub":
    "አገልጋይ ሊጠበቅ፣ ሊዘጋ ወይም ሊታገድ ይችላል። Airhop አገልጋይ የለውም፤ ስለዚህ የሚጫን ኩባንያም ሆነ የሚዘጋ አገልግሎት የለም።",
  "home.about.card": "ቴክኒካዊ አጠቃላይ እይታ",
  "home.about.link.mesh": "የ Bluetooth Low Energy መረብ",
  "home.about.link.wire_protocol": "የማስተላለፊያ ፕሮቶኮል",
  "home.about.body.built":
    "Airhop ለ iOS እና Android የተዘጋጀ ክፍት ምንጭ መተግበሪያ ሲሆን በ {mesh} ላይ በመሣሪያዎች መካከል በቀጥታ የግል መልእክት ለመላላክ ያገለግላል። በ {bitchat} መሠረት ላይ የተገነባ ሲሆን የእሱን {wire_protocol} እና የደህንነት አሠራር እንደገና ይጠቀማል፤ ከዚያም በ Tor፣ ከመስመር ውጭ በሆነ የ {ecash} ክፍያ እና ከመስመር ውጭ በሆነ AI ያሰፋቸዋል። ምንም የኢንተርኔት ግንኙነት ሳይኖር ይሠራል፤ መልእክቶችም በአቅራቢያ ባሉ መሣሪያዎች በኩል በራስ ሰር ይተላለፋሉ (በህንፃ ውስጥ በአንድ ዝላይ በግምት ከ 10 እስከ 30 ሜትር፣ በክፍት ቦታ ደግሞ የበለጠ)፣ እስከ 7 ዝላይ ድረስ።",
  "home.about.body.identity":
    "ማንነትዎ በመሣሪያዎ ላይ የተፈጠረና በ {ios_keychain} ወይም በ {android_keystore} ውስጥ የተቀመጠ የ {ed25519} ቁልፍ ጥንድ ነው። መለያ የለም፣ ምዝገባ የለም፣ አገልጋይን የሚነካ ነገርም የለም። ማለትም ከተሰረዘ በኋላ ወደ እርስዎ የሚመራ ምንም ሳይተው እንደ ጊዜያዊ መተግበሪያ ሊያገለግል ይችላል።",
  "home.about.body.crypto":
    "እያንዳንዱ ክፍለ ጊዜ ለተረጋገጠ የመጀመሪያ ልውውጥ የ {noise} ፕሮቶኮልን ይጠቀማል። የተቀመጡ መልእክቶች የ {ratchet} ስልተ ቀመርን ይጠቀማሉ፤ ማለትም መሣሪያዎ ወደፊት ቢጠለፍም እንኳ ያለፉት መልእክቶችዎ ሊነበቡ አይችሉም። የአስቸኳይ ጊዜ ማጥፋት ሁሉንም ቁልፎችና መልእክቶች ከአንድ ሰከንድ ባነሰ ጊዜ ውስጥ ያጠፋል።",
  "home.about.body.internet":
    "እርስዎና ሰዎችዎ ከ Bluetooth ክልል ውጭ ሲሆኑ የ {nostr} ማስተላለፊያዎች በኢንተርኔት በኩል እንደ ድልድይ ያገለግላሉ፤ በ {nip17} ቅርጽ የተጠቀለሉ ቀጥታ መልእክቶችን ይጠቀማሉ። ስለዚህ ሁለታችሁም በመስመር ላይ ስትሆኑ መረቡ ወደ መላው ዓለም ይዘረጋል። የ {tor} ድጋፍም በ iOS (በ {arti} በኩል) እና በ Android (በ {orbot} በኩል) ይገኛል።",
  "home.about.optional.title": "Airhop እርስዎ ማብራት የሚችሏቸው አማራጭ ባህሪዎች አሉት:",
  "home.about.optional.payments.label": "ከመስመር ውጭ ክፍያ:",
  "home.about.optional.payments.body":
    "የ {cashu} ፕሮቶኮልን በመጠቀም በመረቡ ላይ ክፍያ ይላኩ እና ይቀበሉ (Bitcoin ብቻ)።",
  "home.about.optional.ai.label": "ከመስመር ውጭ AI:",
  "home.about.optional.ai.body":
    "አስፈላጊ ጥያቄዎችን መመለስ የሚችል በመሣሪያው ላይ የሚሠራ ትንሽ የ AI ረዳት። ሁሉም ሂደትና መረጃ በመሣሪያዎ ላይ ይቆያል።",
  "home.about.body.compatible":
    "Airhop በፕሮቶኮል ደረጃ ከ bitchat ጋር ይጣጣማል። በአንድ መረብ ላይ ያሉ የ Airhop መሣሪያና የ bitchat መሣሪያ እርስ በርስ በራስ ሰር ይገኛኛሉ፤ ያለ ምንም ማዋቀር መልእክቶችንና ቀጥታ መልእክቶችን መለዋወጥ ይችላሉ።",

  "home.situations.eyebrow": "መቼ እንደሚያስፈልግ",
  "home.situations.title": "መረቡ ለሚቋረጥበት ቀን።",
  "home.situations.sub": "የተፈጥሮ አደጋዎች፣ የኢንተርኔት መቋረጥ፣ ሰፊ ተቃውሞዎች፣ ወይም ከሽፋን ውጭ የሚያልፍ ተራ ቅዳሜና እሁድ።",
  "home.situations.disaster.label": "አደጋ",
  "home.situations.disaster.line": "ማማዎቹ ወድቀዋል። በሰሌዳው ላይ ያለ ማስታወቂያ በአካባቢው ለሚያልፍ ሁሉ ይደርሳል።",
  "home.situations.offgrid.label": "ከመረብ ውጭ",
  "home.situations.offgrid.line": "በመንገዱ ላይ ሁለተኛ ቀን። የመጨረሻው የምልክት መስመር ትናንት ጠፋ።",
  "home.situations.protest.label": "ተቃውሞ",
  "home.situations.protest.line": "በወረቀት ላይ ያለ አንድ QR ኮድ ለሰልፉ የተመሰጠረ ሰርጥ ይከፍታል።",
  "home.situations.festival.label": "በዓል",
  "home.situations.festival.line": "በስፍራው ምልክት የለም። መልእክቶች በማያውቋቸው ሰዎች ስልኮች እየዘለሉ ይሄዳሉ።",

  "home.showcase.eyebrow": "መተግበሪያውን ይመልከቱ",
  "home.showcase.title": "ተራ የመልእክት መተግበሪያ፣ ከመስመር ውጭ።",
  "home.showcase.sub": "ውይይቶች፣ ሰርጦች፣ ቦርሳና ማንነት። ከላይ የተለመደ፣ ከታች ደግሞ መረቡ ሥራውን ይሠራል።",
  "home.showcase.mesh.title": "መረብ",
  "home.showcase.mesh.caption": "በክልሉ ውስጥ ያሉ ሁሉ በቅርበታቸው መጠን ተደርድረዋል። ማንንም አስቀድሞ መጨመር አያስፈልግም።",
  "home.showcase.mesh.alt":
    "የ Airhop መተግበሪያ የመረብ ማያ ገጽ፣ በአቅራቢያ ያሉ አራት መሣሪያዎችን በምልክት ጥንካሬ መሠረት በራዳር ላይ ያሳያል።",
  "home.showcase.chats.title": "ውይይቶች",
  "home.showcase.chats.caption": "ተራ ውይይቶች። እያንዳንዱን መልእክት የሚያስተላልፉ ስልኮች ሊከፍቱት አይችሉም።",
  "home.showcase.chats.alt": "በኤሌክትሪክ መቋረጥ ወቅት በ Airhop ላይ የተደረገ ቀጥታ ውይይት፣ በሦስት ስልኮች በኩል የተላለፈ።",
  "home.showcase.channels.title": "ሰርጦች",
  "home.showcase.channels.caption":
    "እንደ አንድ ሰፈር የሚያክሉ ወይም እንደ አንድ ክልል የሚሰፉ የሕዝብ ክፍሎች፣ እዚያ ላሉ ሁሉ ክፍት።",
  "home.showcase.channels.alt":
    "የ Airhop መተግበሪያ የውይይት ማያ ገጽ፣ በሰፈር፣ በአካባቢ፣ በከተማና በክልል የተወሰኑ የሕዝብ ሰርጦችን ይዘረዝራል።",
  "home.showcase.wallet.title": "ቦርሳ",
  "home.showcase.wallet.caption": "ሁለቱም ስልኮች በመስመር ላይ ሳይሆኑ በ Bluetooth አጠገብዎ ላለው ሰው ecash ይስጡ።",
  "home.showcase.wallet.alt":
    "የ Airhop መተግበሪያ የቦርሳ ማያ ገጽ፣ በ Bluetooth ሊላክ የሚችል የ ecash ቀሪ ሂሳብ ያሳያል።",
  "home.showcase.identity.title": "ማንነት",
  "home.showcase.identity.caption":
    "ምዝገባ የለም፣ የስልክ ቁጥር የለም፣ ኢሜይል የለም። ከዚህ ስልክ ፈጽሞ የማይወጣ አንድ ቁልፍ ብቻ።",
  "home.showcase.identity.alt": "የ Airhop መተግበሪያ የመገለጫ ማያ ገጽ፣ ያለ መለያ በመሣሪያው ላይ የተፈጠረ ማንነት ያሳያል።",

  "home.how.eyebrow": "እንዴት እንደሚሠራ",
  "home.how.title": "መረቡ በራሱ ይመሠረታል።",
  "home.how.sub":
    "በአቅራቢያ ያሉ መስቀለኞች በ Bluetooth ላይ ራሱን የሚጠግን መረብ ይመሠርታሉ። ኢንተርኔት ሲኖር የ Nostr ማስተላለፊያዎች ያሰፉታል፤ ማንም የሚቆጣጠረው መሠረተ ልማት ሳይኖር።",
  "home.how.cta": "ሙሉውን አወቃቀር ያንብቡ",
  "home.how.discover.title": "ማግኘት",
  "home.how.discover.line":
    "Airhop ወይም bitchat የሚያሄዱ ስልኮች በ Bluetooth እርስ በርስ በራስ ሰር ይገኛኛሉ። ማጣመር የለም፣ ማዋቀር የለም።",
  "home.how.relay.title": "ማስተላለፍ",
  "home.how.relay.line": "መልእክት ከስልክ ወደ ስልክ እስከ ሰባት ዝላይ ድረስ ይዘላል። በመሃል ያሉ ስልኮች የሚሸከሙትን ፈጽሞ አያዩም።",
  "home.how.reach.title": "የበለጠ ርቀት",
  "home.how.reach.line": "ኢንተርኔት ሲኖር የ Nostr ማስተላለፊያዎች ያንኑ ውይይት የበለጠ ያርቁታል፤ ከተፈለገም በ Tor በኩል።",
  "home.how.swipe": "ለማየት ያንሸራትቱ",
  "home.how.diagram": "የ BLE መረብ · በመሣሪያዎች መካከል ያለ አካባቢያዊ መረብ",
  "home.how.legend.node": "የ BLE መረብ መስቀለኛ (ከመስመር ውጭ)",
  "home.how.legend.relay": "የበርካታ ዝላይ ማስተላለፍ (በ Noise XX የተመሰጠረ)",
  "home.how.legend.bitchat": "በዚያው መረብ ላይ ከ bitchat ጋር ይጣጣማል",
  "home.how.legend.nostr": "የ Nostr ድልድይ (ኢንተርኔት፣ በመስመር ላይ ሲሆኑ)",

  "home.map.aria": "የ Nostr ማስተላለፊያዎች ቦታ የሚያሳይ የዓለም ካርታ",
  "home.map.summary": "የ Nostr ድልድይ · በዓለም ዙሪያ በ {locations} ውስጥ {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}፣ {relays}",

  "home.features.eyebrow": "ምን እንደሚሠራ",
  "home.features.title": "እውነተኛ የመልእክት መተግበሪያ፣ ማሳያ አይደለም።",
  "home.features.sub": "ውይይት፣ ማንነት፣ መረብና ገንዘብ። ሁሉም ያለ ምልክት፣ ያለ መለያ እና በመሃል ምንም ሳይኖር እንዲሠሩ ተገንብተዋል።",

  "home.features.messaging.title": "መልእክት",
  "home.features.messaging.summary": "የመልእክት መተግበሪያ ያለው ሁሉ፣ ከኋላው ምንም መሠረተ ልማት ሳይኖር።",
  "home.features.messaging.dms.name": "የግል ቀጥታ መልእክቶች",
  "home.features.messaging.dms.line": "ከጫፍ እስከ ጫፍ የተመሰጠሩ፣ የመድረስና የመነበብ ማረጋገጫ ያላቸው።",
  "home.features.messaging.location.name": "የቦታ ሰርጦች",
  "home.features.messaging.location.line": "ከአንድ ቦታ ጋር የተሳሰሩ ክፍሎች፣ ከአንድ ሰፈር እስከ አንድ ክልል።",
  "home.features.messaging.groups.name": "የግል ሰርጦችና ቡድኖች",
  "home.features.messaging.groups.line": "ለክፍል የግብዣ አገናኞች፣ ወይም እስከ 16 ሰዎች የተፈረመ ዝርዝር።",
  "home.features.messaging.board.name": "የማስታወቂያ ሰሌዳ",
  "home.features.messaging.board.line": "እስከ ሰባት ቀናት ድረስ በአንድ አካባቢ ተለጥፈው የሚቆዩ ማስታወቂያዎች።",
  "home.features.messaging.voice.name": "ቀጥታ ድምጽ",
  "home.features.messaging.voice.line": "ማይክሮፎኑን ተጭነው በክልሉ ውስጥ ካለ ማንኛውም ሰው ጋር ይነጋገሩ፣ እንደ ዋኪቶኪ።",
  "home.features.messaging.notes.name": "የድምጽ መልእክቶች",
  "home.features.messaging.notes.line": "የተቀዳ ድምጽ፣ አቅጣጫ ከመተየብ ይፈጥናል።",
  "home.features.messaging.files.name": "ፎቶዎች፣ ቪዲዮና ፋይሎች",
  "home.features.messaging.files.line": "ማንኛውም ቅርጸት፣ እስከ 1 MB፣ ምልክት ሳያስፈልግ።",
  "home.features.messaging.forward.name": "አስቀምጦ ማስተላለፍ",
  "home.features.messaging.forward.line": "ታሽጎ በአቅራቢያ ባለ ስልክ ተይዞ ወደ ተቀባዩ እስኪደርስ ድረስ ይጓዛል።",

  "home.features.identity.title": "ማንነት",
  "home.features.identity.summary": "የሚመዘገብ ነገር የለም፣ የሚወረስም ነገር የለም።",
  "home.features.identity.keys.name": "የቁልፍ ጥንድ ማንነት",
  "home.features.identity.keys.line": "በዚህ ስልክ ላይ ተፈጥሮ በሥርዓቱ ቁልፍ ማከማቻ ውስጥ ይቀመጣል።",
  "home.features.identity.names.name": "ሊነበቡ የሚችሉ ስሞች",
  "home.features.identity.names.line": "ከቁልፍዎ የተገኙ ናቸው፤ ስለዚህ የእርስዎን ማንም ሊወስድ አይችልም።",
  "home.features.identity.qr.name": "በ QR የሚገኙ እውቂያዎች",
  "home.features.identity.qr.line": "አንድ ጊዜ መቃኘት ስማቸውን ብቻ ሳይሆን ቁልፎቻቸውንም ያመጣል።",
  "home.features.identity.panic.name": "የአስቸኳይ ጊዜ ማጥፋት",
  "home.features.identity.panic.line": "እያንዳንዱ ቁልፍና እያንዳንዱ መልእክት ከአንድ ሰከንድ ባነሰ ጊዜ ይጠፋል።",

  "home.features.networking.title": "መረብ",
  "home.features.networking.summary": "ስልኮቹ ራሳቸው መረቡ ናቸው።",
  "home.features.networking.mesh.name": "የ Bluetooth መረብ",
  "home.features.networking.mesh.line": "ኢንተርኔት የለም፣ ራውተር የለም፣ ሰዎች አስቀድመው በያዙት ስልክ ላይ።",
  "home.features.networking.bridge.name": "የመረብ ድልድይ",
  "home.features.networking.bridge.line": "የሕዝብ ውይይትዎን ከክልል ውጭ ካለ በአቅራቢያው ካለ ስብስብ ጋር ያገናኛል።",
  "home.features.networking.wifi.name": "የ WiFi ፈጣን መንገድ",
  "home.features.networking.wifi.line": "በሁለት Android ወይም በሁለት iPhone መካከል ፈጣን ዝውውር።",
  "home.features.networking.bitchat.name": "ከ bitchat ጋር ይጣጣማል",
  "home.features.networking.bitchat.line": "ሁለቱም መተግበሪያዎች ያለ ማዋቀር ወደ አንድ መረብ ይቀላቀላሉ።",

  "home.features.internet.title": "ኢንተርኔት",
  "home.features.internet.summary": "ተጨማሪ እንጂ መስፈርት ፈጽሞ አይደለም።",
  "home.features.internet.nostr.name": "የ Nostr አማራጭ",
  "home.features.internet.nostr.line": "ቀጥታ መልእክቶችና የቦታ ሰርጦች ከሬዲዮ ክልል ባሻገርም መፍሰሳቸውን ይቀጥላሉ።",
  "home.features.internet.relays.name": "የጂኦ ማስተላለፊያ ፍለጋ",
  "home.features.internet.relays.line": "ከ 300 በላይ ራሳቸውን የቻሉ የሕዝብ ማስተላለፊያዎች፣ አንዳቸውም የእኛ አይደሉም።",
  "home.features.internet.gateway.name": "የኢንተርኔት መተላለፊያ",
  "home.features.internet.gateway.line": "በአቅራቢያ ያለ ከመስመር ውጭ የሆነ ስልክ የቦታ ሰርጦችን እንዲደርስ ግንኙነትዎን ያውሱ።",
  "home.features.internet.tor.name": "የ Tor ውህደት",
  "home.features.internet.tor.line": "በሁለቱም መድረኮች ላይ ይመራል፤ ስለዚህ ማስተላለፊያዎቹ የእርስዎን IP ፈጽሞ አያዩም።",

  "home.features.optional.title": "አማራጭ",
  "home.features.optional.summary": "በነባሪ ጠፍቷል። በፈለጉ ጊዜ ይብራ።",
  "home.features.optional.cashu.name": "የ Cashu ecash",
  "home.features.optional.cashu.line": "ማንኛውም ስልክ በመስመር ላይ ሳይሆን አጠገብዎ ላለው ሰው ይክፈሉ።",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "በ Lightning መረብ በኩል በ bitcoin ይሙሉ ወይም ያውጡ።",
  "home.features.optional.ai.name": "አካባቢያዊ AI",
  "home.features.optional.ai.line": "በመሣሪያው ላይ መልስ፣ ከስልኩ ምንም አይወጣም።",
  "home.features.optional.social.name": "የማህበራዊ ድልድዮች",
  "home.features.optional.social.line": "በዚያው ማንነት Bluesky እና Mastodon።",

  "home.compare.eyebrow": "በንጽጽር",
  "home.compare.title": "ከመስመር ውጭ፣ ያለ ተጨማሪ መሣሪያ፣ እና ክፍት።",
  "home.compare.sub":
    "እዚህ ያለ እያንዳንዱ መተግበሪያ በአንድ ነገር ጎበዝ ነው። ነገር ግን መረቡ ሲቋረጥ መሥራታቸውን የሚቀጥሉት ጥቂቶቹ ብቻ ናቸው።",
  "home.compare.col.project": "ፕሮጀክት",
  "home.compare.col.transport": "ማስተላለፊያ",
  "home.compare.col.encryption": "ምስጠራ",
  "home.compare.col.offline": "ከመስመር ውጭ ይሠራል",
  "home.compare.col.hardware_free": "ተጨማሪ መሣሪያ አያስፈልግም",
  "home.compare.col.open_source": "ክፍት ምንጭ",
  "home.compare.mark.yes": "አዎ",
  "home.compare.mark.no": "አይደለም",
  "home.compare.mark.partial": "በከፊል፣ ደንበኞቹ ክፍት ምንጭ ናቸው፣ አገልጋዮቹ ግን አይደሉም",
  "home.compare.mark.partial_hint": "ደንበኞቹ ክፍት ምንጭ ናቸው፣ አገልጋዮቹ ግን አይደሉም",
  "home.compare.transport.servers": "ማዕከላዊ አገልጋዮች",
  "home.compare.transport.onion": "የሽንኩርት መንገድ (የአገልግሎት መስቀለኞች)",
  "home.compare.transport.nostr": "የ Nostr ማስተላለፊያዎች",
  "home.compare.transport.lora": "የ LoRa ሬዲዮ",
  "home.compare.transport.sub_ghz": "የባለቤትነት sub-GHz ሬዲዮ",

  "home.explore.eyebrow": "ክፍትና ታማኝ",
  "home.explore.title": "እዚህ የተባለ እያንዳንዱ ነገር ሊረጋገጥ ይችላል።",
  "home.explore.sub": "ኮዱ፣ ፕሮቶኮሉና ዕቅዶቹ ሁሉ ይፋ ናቸው። ገደቦቹም እንዲሁ። ቃላችንን ከመቀበልዎ በፊት ራስዎ ያረጋግጡ።",
  "home.explore.audit.chip": "ኦዲት ይጠበቃል",
  "home.explore.audit.headline": "Airhop እስካሁን የውጭ የደህንነት ኦዲት አላደረገም።",
  "home.explore.audit.body":
    "{headline} ሁሉም ኮድ በግል ይመረመራል፤ ከመለቀቁ በፊትም በ {review} ውስጥ ያልፋል። የሚጠቀመው የምስጠራ ቤተ መጻሕፍትም በ Cure53 ኦዲት ተደርጓል። ሆኖም ይህ የመተግበሪያውን መደበኛ ኦዲት አይተካም። አንድ ኦዲት ለ {version} ታቅዷል። እስከዚያ ድረስ ለስሱ ጉዳዮች በእሱ ላይ አይመኩ።",
  "home.explore.audit.link.review": "የደህንነት ግምገማ ወኪል",
  "home.explore.source.title": "ምንጭ ኮድ",
  "home.explore.source.desc": "ሁሉም በ GitHub ላይ በ MIT ፈቃድ። ጉዳዮች፣ pull request እና ውይይቶች ክፍት ናቸው።",
  "home.explore.protocol.title": "የፕሮቶኮል ዝርዝር",
  "home.explore.protocol.desc": "ትክክለኛው የማስተላለፊያ ቅርጸት፣ የ BLE UUID ዎችና ቋሚ እሴቶች፣ ከ bitchat ጋር የተጋሩ።",
  "home.explore.architecture.title": "አወቃቀር",
  "home.explore.architecture.desc": "ላክን ከመንካት ጀምሮ በሬዲዮ ላይ እስከሚሄዱ ባይቶች ድረስ ሙሉ ቴክኒካዊ ትንተና።",
  "home.explore.roadmap.title": "የመንገድ ካርታ",
  "home.explore.roadmap.desc": "ከ v0.5.0 እስከ v2.0.0 ያሉ የስሪት ግቦች፣ የታቀደውን ኦዲት ጨምሮ።",
  "home.explore.vision.title": "ራእይ",
  "home.explore.vision.desc": "Airhop ለምን እንዳለና በጫና ውስጥም የማይለወጡ መርሆች።",
  "home.explore.brand.title": "የምልክት ስብስብ",
  "home.explore.brand.desc": "የፒክሰል ወፍ፣ የቀለምና የፊደል ቶከኖች፣ የፕሬስ ቁሳቁሶችና ዝግጁ ጽሑፎች።",

  "home.contribute.eyebrow": "ይህን ፕሮጀክት ይደግፉ",
  "home.contribute.title": "ራሱን የቻለ፣ በግልጽ።",
  "home.contribute.sub":
    "ባለሀብቶች የሉም፣ ማስታወቂያ የለም፣ የሚከፈልበት ደረጃም የለም። ሁሉም ባህሪያት ለማንኛውም ነጻ ሆነው ይቀጥላሉ፤ ሥራውም ጠቃሚ ሆኖ ባገኙት ሰዎች ይደገፋል።",
  "home.contribute.contribute.chip": "አስተዋጽኦ ያድርጉ",
  "home.contribute.contribute.body":
    "ማከማቻውን ኮከብ ይስጡት፣ ጉዳዮችን ይክፈቱ፣ pull request ይላኩ። የስህተት ሪፖርቶች፣ የባህሪ ሀሳቦችና የኮድ አስተዋጽኦዎች ሁሉ እንኳን ደህና መጡ።",
  "home.contribute.contribute.cta": "በ GitHub ላይ ይመልከቱ",
  "home.contribute.sponsor.chip": "ስፖንሰር",
  "home.contribute.sponsor.body":
    "Airhop ለእርስዎ ጠቃሚ ከሆነ አንድ ጊዜ የሚደረግ ልገሳ ወይም ተከታታይ ድጋፍ ልማቱ እንዲቀጥል በእጅጉ ይረዳል።",
  "home.contribute.sponsor.donate": "አንድ ጊዜ ይለግሱ",
  "home.contribute.sponsor.github": "በ GitHub ላይ ስፖንሰር ያድርጉ",

  "page.architecture.eyebrow": "ሰነድ",
  "page.architecture.title": "አወቃቀር",
  "page.architecture.toc": "በዚህ ገጽ ላይ",

  "page.faq.eyebrow": "ተደጋጋሚ ጥያቄዎች",
  "page.faq.title": "በተደጋጋሚ የሚጠየቁ ጥያቄዎች",
  "page.faq.meta": "ስለ Airhop የተለመዱ ጥያቄዎች።",
  "page.faq.contact": "እዚህ መልስ ያላገኙ ጥያቄዎችን ወደ {email} መላክ ወይም በ {github} ላይ ውይይት በመክፈት ማንሳት ይችላሉ።",

  "page.blogs.eyebrow": "ብሎግ",
  "page.blogs.title": "በቅርቡ ይመጣል",
  "page.blogs.body": "ስለ መረብ ግንኙነት፣ ግላዊነትና ከመስመር ውጭ ቅድሚያ ስለሚሰጥ ሶፍትዌር የተጻፉ ጽሑፎች።",

  "page.brand.eyebrow": "ምልክት",
  "page.brand.title": "የምልክት ስብስብ",
  "page.brand.meta":
    "Airhop ን በጽሑፍ፣ በመደብር ዝርዝር፣ በንግግር ወይም በ README ውስጥ ለማቅረብ የሚያገለግሉ ቁሳቁሶችና ደንቦች። ለጥቅስና ለፕሬስ በነጻ መጠቀም ይቻላል።",

  "page.legal.eyebrow": "ሕጋዊ",
  "page.privacy.title": "የግላዊነት ፖሊሲ",
  "page.terms.title": "የአገልግሎት ውሎች",

  "page.notfound.title": "ገጹ አልተገኘም",
  "page.notfound.body": "የሚፈልጉት ገጽ የለም ወይም ተዛውሯል።",

  "page.english_only": "ይህ ገጽ በእንግሊዝኛ ብቻ ይገኛል።",

  "seo.breadcrumb.home": "መነሻ",

  "seo.home.title": "Airhop — የግል፣ ከመስመር ውጭ ቅድሚያ የሚሰጥ የመልእክት መተግበሪያ",
  "seo.home.description":
    "ለ iOS እና Android በመሣሪያዎች መካከል በቀጥታ የግል መልእክት መላላክ። ኢንተርኔት የለም፣ አገልጋይ የለም፣ መለያ የለም። የትም ቦታ በ Bluetooth መረብ ይገናኙ።",

  "seo.architecture.title": "አወቃቀር — Airhop",
  "seo.architecture.description":
    "Airhop ከላይ እስከ ታች እንዴት እንደሚሠራ: ማንነት፣ የማስተላለፊያ ምርጫ፣ የ Bluetooth መረብ፣ ምስጠራ፣ የኢንተርኔት ንብርብር፣ Tor፣ ከመስመር ውጭ ecash፣ በመሣሪያው ላይ AI እና ከ bitchat ጋር የሚጣጣም የማስተላለፊያ ቅርጸት።",
  "seo.architecture.breadcrumb": "አወቃቀር",
  "seo.architecture.headline": "የ Airhop አወቃቀር",
  "seo.architecture.summary":
    "የ Airhop ሙሉ ቴክኒካዊ ትንተና: ማንነት፣ ማስተላለፊያዎች፣ የ Bluetooth መረብ፣ ምስጠራ፣ የ Nostr ኢንተርኔት ንብርብር፣ Tor፣ የ Cashu ቦርሳ፣ በመሣሪያው ላይ ያለ የ AI ረዳት እና የማስተላለፊያ ቅርጸት።",

  "seo.faq.title": "በተደጋጋሚ የሚጠየቁ ጥያቄዎች — Airhop",
  "seo.faq.description":
    "ስለ Airhop የ Bluetooth መረብ መልእክት፣ ምስጠራ፣ ከመስመር ውጭ ክፍያ፣ የ Nostr ኢንተርኔት ንብርብርና ከ bitchat ጋር ስላለው መጣጣም መልሶች።",
  "seo.faq.breadcrumb": "ተደጋጋሚ ጥያቄዎች",

  "seo.blogs.title": "ብሎግ — Airhop",
  "seo.blogs.description": "ስለ መረብ ግንኙነት፣ ግላዊነትና ከመስመር ውጭ ቅድሚያ ስለሚሰጥ ሶፍትዌር የተጻፉ ጽሑፎች።",
  "seo.blogs.breadcrumb": "ብሎግ",

  "seo.brand.title": "የምልክት ስብስብ — Airhop",
  "seo.brand.description":
    "የ Airhop የምልክት ስብስብ: የፒክሰል ወፍ ምልክት፣ የቃል ምልክት፣ የቀለምና የፊደል ቶከኖች፣ የፕሬስ ቁሳቁሶችና ዝግጁ ጽሑፎች።",
  "seo.brand.breadcrumb": "የምልክት ስብስብ",

  "seo.privacy.title": "የግላዊነት ፖሊሲ — Airhop",
  "seo.privacy.description":
    "Airhop መረጃን እንዴት እንደሚይዝ: መለያ የለም፣ አገልጋይ የለም፣ ክትትል የለም። ማንነትዎና መልእክቶችዎ በመሣሪያዎ ላይ ይቆያሉ።",
  "seo.privacy.breadcrumb": "የግላዊነት ፖሊሲ",

  "seo.terms.title": "የአገልግሎት ውሎች — Airhop",
  "seo.terms.description": "የ Airhop መተግበሪያንና ድረ ገጽን አጠቃቀም የሚመሩ ውሎች።",
  "seo.terms.breadcrumb": "የአገልግሎት ውሎች",

  "seo.notfound.title": "ገጹ አልተገኘም — Airhop",
  "seo.notfound.description": "የሚፈልጉት ገጽ የለም ወይም ተዛውሯል።",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} ማስተላለፊያ",
    other: "{count} ማስተላለፊያዎች",
  },
  "home.map.locations": {
    one: "{count} ቦታ",
    other: "{count} ቦታዎች",
  },
};

export const locale: Locale = { strings, plurals };
