import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Rudi mwanzo",
  "common.last_updated": "Sasisho la mwisho: {date}",

  "nav.aria": "Urambazaji mkuu",
  "nav.home": "Ukurasa wa mwanzo wa Airhop",
  "nav.skip": "Rukia hadi maudhui",
  "nav.menu.open": "Fungua menyu",
  "nav.menu.close": "Funga menyu",
  "nav.how_it_works": "Jinsi inavyofanya kazi",
  "nav.architecture": "Muundo",
  "nav.faq": "Maswali ya kawaida",

  "footer.aria": "Sehemu ya chini",
  "footer.tagline": "Mawasiliano ya mesh ya faragha",
  "footer.credit": "© Imetengenezwa kwa {heart} na {author}",
  "footer.group.download": "Pakua",
  "footer.group.resources": "Rasilimali",
  "footer.group.social": "Mitandao",
  "footer.group.legal": "Kisheria",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "Muundo",
  "footer.link.blogs": "Blogu",
  "footer.link.faq": "Maswali ya kawaida",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Masharti ya Huduma",
  "footer.link.privacy": "Sera ya Faragha",
  "footer.link.license": "Leseni ya Mradi",

  "settings.theme.group": "Mandhari ya rangi",
  "settings.theme.light": "Mandhari nyepesi",
  "settings.theme.dark": "Mandhari nyeusi",
  "settings.language.label": "Lugha",
  "settings.language.suggestion": "Tazama ukurasa huu kwa Kiswahili",
  "settings.language.dismiss": "Funga",

  "home.hero.release": "Toleo jipya zaidi",
  "home.hero.title": "Ujumbe unaofanya kazi bila intaneti.",
  "home.hero.body":
    "Simu zilizo karibu huunda mtandao wa mesh wa Bluetooth na kupitisha ujumbe wako, umefichwa kutoka mwanzo hadi mwisho. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Hakuna seva",
  "home.hero.body.no_accounts": "hakuna akaunti",
  "home.hero.body.no_tracking": "hakuna ufuatiliaji",
  "home.hero.download": "Pakua programu",
  "home.hero.badges": "Leseni ya MIT · Bure na chanzo huria · Inafanya kazi na bitchat",
  "home.hero.group.mobile": "Simu",
  "home.hero.group.desktop": "Kompyuta",
  "home.hero.option.zapstore": "Imetiwa saini kwenye Nostr",
  "home.hero.option.apk": "Upakuaji wa moja kwa moja",
  "home.hero.option.soon": "Inakuja hivi karibuni",

  "home.about.eyebrow": "Airhop ni nini",
  "home.about.title": "Programu nyingi hutegemea seva kuu.",
  "home.about.sub":
    "Seva inaweza kufuatiliwa, kuzimwa au kuzuiwa. Airhop haina yoyote, hivyo hakuna kampuni ya kushinikizwa wala huduma ya kufungwa.",
  "home.about.card": "Muhtasari wa kiufundi",
  "home.about.link.mesh": "mesh ya Bluetooth Low Energy",
  "home.about.link.wire_protocol": "itifaki ya upitishaji",
  "home.about.body.built":
    "Airhop ni programu ya chanzo huria kwa iOS na Android kwa ujumbe wa faragha kati ya vifaa moja kwa moja kupitia {mesh}. Imejengwa juu ya msingi wa {bitchat}, ikitumia tena {wire_protocol} na muundo wake wa usalama, kisha ikiviongeza kwa malipo ya {ecash} nje ya mtandao na AI nje ya mtandao. Inafanya kazi bila muunganisho wowote wa intaneti, na ujumbe hupitishwa kiotomatiki kati ya vifaa vilivyo karibu (takriban mita 10 hadi 30 kwa kila hatua ndani ya jengo, zaidi nje), hadi hatua 7.",
  "home.about.body.identity":
    "Utambulisho wako ni jozi ya funguo za {ed25519} inayotengenezwa kwenye kifaa chako na kuhifadhiwa katika {ios_keychain} au {android_keystore}. Hakuna akaunti, hakuna usajili, wala kitu chochote kinachogusa seva, yaani inaweza kutumika kama programu ya matumizi ya mara moja isiyoacha chochote kinachokuelekea baada ya kufutwa.",
  "home.about.body.crypto":
    "Kila kipindi hutumia itifaki ya {noise} kwa uthibitishaji wa awali. Ujumbe uliohifadhiwa hutumia algoriti ya {ratchet}, yaani hata kama kifaa chako kitavamiwa baadaye, ujumbe wako wa zamani hubaki usiosomeka. Ufutaji wa dharura huharibu funguo na ujumbe wote kwa chini ya sekunde moja.",
  "home.about.body.internet":
    "Wewe na mwenzako mkiwa nje ya masafa ya Bluetooth, vipeperushi vya {nostr} hufanya kazi kama daraja kupitia intaneti, vikitumia ujumbe wa moja kwa moja uliofungashwa kwa muundo wa {nip17}, hivyo mesh hufika dunia nzima kila mnapokuwa mtandaoni nyote wawili. Msaada wa {tor} upo kwenye iOS na Android, kupitia {arti}, na madaraja ya {obfs4} na {snowflake} kwa mitandao inayozuia Tor.",
  "home.about.optional.title": "Airhop ina vipengele vya hiari unavyoweza kuwasha:",
  "home.about.optional.payments.label": "Malipo nje ya mtandao:",
  "home.about.optional.payments.body":
    "Tuma na pokea malipo kupitia mesh ukitumia itifaki ya {cashu} (Bitcoin pekee).",
  "home.about.optional.ai.label": "AI nje ya mtandao:",
  "home.about.optional.ai.body":
    "Msaidizi mdogo wa AI kwenye kifaa anayeweza kujibu maswali muhimu. Uchakataji wote na data hubaki kwenye kifaa chako.",
  "home.about.body.compatible":
    "Airhop inaendana na bitchat katika kiwango cha itifaki. Kifaa cha Airhop na kifaa cha bitchat kwenye mesh moja hugunduana kiotomatiki na vinaweza kubadilishana ujumbe na ujumbe wa moja kwa moja bila usanidi wowote.",

  "home.situations.eyebrow": "Wakati unapoihitaji",
  "home.situations.title": "Kwa siku mtandao unapoanguka.",
  "home.situations.sub":
    "Majanga ya asili, kukatika kwa intaneti, maandamano makubwa, au wikendi ya kawaida nje ya mtandao.",
  "home.situations.disaster.label": "Janga",
  "home.situations.disaster.line":
    "Minara imeanguka. Tangazo ubaoni humfikia yeyote anayepita hapo.",
  "home.situations.offgrid.label": "Nje ya mtandao",
  "home.situations.offgrid.line": "Siku ya pili njiani. Mstari wa mwisho wa mtandao ulipotea jana.",
  "home.situations.protest.label": "Maandamano",
  "home.situations.protest.line":
    "Msimbo wa QR kwenye kipeperushi hufungua njia iliyofichwa kwa ajili ya maandamano.",
  "home.situations.festival.label": "Tamasha",
  "home.situations.festival.line":
    "Hakuna mtandao eneo hilo. Ujumbe huruka kupitia simu za wageni.",

  "home.showcase.eyebrow": "Ona programu",
  "home.showcase.title": "Programu ya kawaida ya ujumbe, bila mtandao.",
  "home.showcase.sub":
    "Mazungumzo, njia, pochi na utambulisho. Inayojulikana juu, na mesh chini ikifanya kazi.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Kila aliye ndani ya masafa, amepangwa kulingana na ukaribu. Hakuna anayehitaji kuongezwa kwanza.",
  "home.showcase.mesh.alt":
    "Skrini ya Mesh ya programu ya Airhop, ikionyesha vifaa vinne vilivyo karibu vikiwa vimepangwa kwenye rada kulingana na nguvu ya ishara.",
  "home.showcase.chats.title": "Mazungumzo",
  "home.showcase.chats.caption":
    "Mazungumzo ya kawaida. Simu zinazopitisha kila ujumbe haziwezi kuufungua.",
  "home.showcase.chats.alt":
    "Mazungumzo ya moja kwa moja katika Airhop wakati wa kukatika kwa umeme, yakipitishwa kupitia simu tatu.",
  "home.showcase.channels.title": "Njia",
  "home.showcase.channels.caption":
    "Vyumba vya wazi vidogo kama mtaa mmoja au vipana kama mkoa mzima, wazi kwa yeyote aliyepo.",
  "home.showcase.channels.alt":
    "Skrini ya mazungumzo ya programu ya Airhop, ikiorodhesha njia za wazi zilizowekwa mipaka ya mtaa, kitongoji, jiji na mkoa.",
  "home.showcase.wallet.title": "Pochi",
  "home.showcase.wallet.caption":
    "Mkabidhi ecash mtu aliye kando yako kupitia Bluetooth, bila simu yoyote kuwa mtandaoni.",
  "home.showcase.wallet.alt":
    "Skrini ya pochi ya programu ya Airhop, ikionyesha salio la ecash linaloweza kutumwa kupitia Bluetooth.",
  "home.showcase.identity.title": "Utambulisho",
  "home.showcase.identity.caption":
    "Hakuna kujisajili, hakuna namba ya simu, hakuna barua pepe. Ni ufunguo tu usiotoka kamwe kwenye simu hii.",
  "home.showcase.identity.alt":
    "Skrini ya wasifu ya programu ya Airhop, ikionyesha utambulisho uliotengenezwa kwenye kifaa bila akaunti.",

  "home.how.eyebrow": "Jinsi inavyofanya kazi",
  "home.how.title": "Mesh hujiunda yenyewe.",
  "home.how.sub":
    "Vituo vilivyo karibu huunda mesh inayojirekebisha kupitia Bluetooth. Intaneti ikiwepo, vipeperushi vya Nostr huipanua, bila miundombinu inayodhibitiwa na yeyote.",
  "home.how.cta": "Soma muundo kamili",
  "home.how.discover.title": "Kugundua",
  "home.how.discover.line":
    "Simu zinazotumia Airhop au bitchat hugunduana kiotomatiki kupitia Bluetooth. Hakuna kuunganisha, hakuna kusanidi.",
  "home.how.relay.title": "Kupitisha",
  "home.how.relay.line":
    "Ujumbe huruka simu hadi simu, hadi hatua saba. Simu zilizo katikati hazioni kamwe kile zinachobeba.",
  "home.how.reach.title": "Kufika mbali zaidi",
  "home.how.reach.line":
    "Intaneti ikiwepo, vipeperushi vya Nostr hupeleka mazungumzo yale yale mbali zaidi, kwa hiari kupitia Tor.",
  "home.how.swipe": "telezesha ili kuchunguza",
  "home.how.diagram": "Mesh ya BLE · mtandao wa hapa kati ya vifaa",
  "home.how.legend.node": "Kituo cha mesh ya BLE (nje ya mtandao)",
  "home.how.legend.relay": "Upitishaji wa hatua nyingi (umefichwa kwa Noise XX)",
  "home.how.legend.bitchat": "Inaendana na bitchat kwenye mesh moja",
  "home.how.legend.nostr": "Daraja la Nostr (intaneti, ukiwa mtandaoni)",

  "home.map.aria": "Ramani ya dunia ya maeneo ya vipeperushi vya Nostr",
  "home.map.summary": "Daraja la Nostr · {relays} katika {locations} duniani kote",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Inafanya nini",
  "home.features.title": "Programu halisi ya ujumbe, si onyesho.",
  "home.features.sub":
    "Mazungumzo, utambulisho, mtandao na pesa. Vyote vimejengwa kufanya kazi bila mtandao, bila akaunti, na bila kitu chochote katikati.",

  "home.features.messaging.title": "Ujumbe",
  "home.features.messaging.summary":
    "Kila kitu programu ya ujumbe inacho, bila miundombinu yoyote nyuma yake.",
  "home.features.messaging.dms.name": "Ujumbe wa faragha wa moja kwa moja",
  "home.features.messaging.dms.line":
    "Umefichwa mwanzo hadi mwisho, na uthibitisho wa kufika na kusomwa.",
  "home.features.messaging.location.name": "Njia za eneo",
  "home.features.messaging.location.line":
    "Vyumba vilivyofungamana na mahali, kutoka mtaa mmoja hadi mkoa.",
  "home.features.messaging.groups.name": "Njia na vikundi vya faragha",
  "home.features.messaging.groups.line":
    "Viungo vya mwaliko kwa chumba, au orodha iliyotiwa saini ya hadi watu 16.",
  "home.features.messaging.board.name": "Ubao wa matangazo",
  "home.features.messaging.board.line": "Matangazo yaliyobandikwa eneo fulani hadi siku saba.",
  "home.features.messaging.voice.name": "Sauti ya moja kwa moja",
  "home.features.messaging.voice.line":
    "Shikilia kipaza sauti na uzungumze na yeyote aliye ndani ya masafa, kama redio ya mkononi.",
  "home.features.messaging.notes.name": "Ujumbe wa sauti",
  "home.features.messaging.notes.line": "Sauti iliyorekodiwa, haraka kuliko kuandika maelekezo.",
  "home.features.messaging.files.name": "Picha, video na faili",
  "home.features.messaging.files.line": "Muundo wowote, hadi MiB 1, bila kuhitaji mtandao.",
  "home.features.messaging.forward.name": "Hifadhi na upitishe",
  "home.features.messaging.forward.line":
    "Umefungwa na kubebwa na simu iliyo karibu hadi ufike kwa mhusika.",

  "home.features.identity.title": "Utambulisho",
  "home.features.identity.summary": "Hakuna cha kusajili, hakuna cha kutaifishwa.",
  "home.features.identity.keys.name": "Utambulisho wa jozi ya funguo",
  "home.features.identity.keys.line":
    "Umetengenezwa kwenye simu hii, umehifadhiwa katika hazina ya funguo ya mfumo.",
  "home.features.identity.names.name": "Majina yanayosomeka",
  "home.features.identity.names.line":
    "Yametokana na ufunguo wako, hivyo hakuna anayeweza kuchukua lako.",
  "home.features.identity.qr.name": "Anwani kwa QR",
  "home.features.identity.qr.line": "Kuchanganua mara moja hubeba funguo zao, si jina tu.",
  "home.features.identity.panic.name": "Ufutaji wa dharura",
  "home.features.identity.panic.line":
    "Kila ufunguo na kila ujumbe huharibiwa kwa chini ya sekunde moja.",

  "home.features.networking.title": "Mtandao",
  "home.features.networking.summary": "Simu ndizo mtandao.",
  "home.features.networking.mesh.name": "Mesh ya Bluetooth",
  "home.features.networking.mesh.line":
    "Bila intaneti, bila rauta, kwenye simu ambazo watu tayari wanazo.",
  "home.features.networking.bridge.name": "Daraja la mesh",
  "home.features.networking.bridge.line":
    "Huunganisha mazungumzo yako ya wazi na kundi lililo karibu nje ya masafa.",
  "home.features.networking.wifi.name": "Njia ya haraka ya WiFi",
  "home.features.networking.wifi.line":
    "Uhamishaji wa haraka zaidi kati ya Android mbili au iPhone mbili.",
  "home.features.networking.bitchat.name": "Inaendana na bitchat",
  "home.features.networking.bitchat.line":
    "Programu zote mbili hujiunga na mesh moja bila usanidi.",

  "home.features.internet.title": "Intaneti",
  "home.features.internet.summary": "Nyongeza, si sharti kamwe.",
  "home.features.internet.nostr.name": "Mbadala wa Nostr",
  "home.features.internet.nostr.line":
    "Ujumbe wa moja kwa moja na njia za eneo huendelea kutiririka nje ya masafa ya redio.",
  "home.features.internet.relays.name": "Ugunduzi wa vipeperushi vya kijiografia",
  "home.features.internet.relays.line":
    "Zaidi ya vipeperushi 300 vya umma vinavyojitegemea, hakuna hata kimoja chetu.",
  "home.features.internet.gateway.name": "Lango la intaneti",
  "home.features.internet.gateway.line":
    "Azima muunganisho wako ili simu iliyo karibu isiyo mtandaoni ifikie njia za eneo.",
  "home.features.internet.tor.name": "Muunganiko wa Tor",
  "home.features.internet.tor.line":
    "Umeelekezwa kwenye majukwaa yote mawili, hivyo vipeperushi havioni kamwe IP yako.",

  "home.features.optional.title": "Hiari",
  "home.features.optional.summary": "Imezimwa kwa chaguo-msingi. Inawaka unapotaka.",
  "home.features.optional.cashu.name": "Ecash ya Cashu",
  "home.features.optional.cashu.line":
    "Mlipe mtu aliye kando yako bila simu yoyote kuwa mtandaoni.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Ongeza au toa kwa bitcoin kupitia mtandao wa Lightning.",
  "home.features.optional.ai.name": "AI ya ndani",
  "home.features.optional.ai.line": "Majibu kwenye kifaa, hakuna kinachotoka kwenye simu.",
  "home.features.optional.social.name": "Madaraja ya mitandao",
  "home.features.optional.social.line": "Bluesky na Mastodon kwa utambulisho ule ule.",

  "home.compare.eyebrow": "Ulinganisho",
  "home.compare.title": "Nje ya mtandao, bila vifaa vya ziada, na wazi.",
  "home.compare.sub":
    "Kila programu hapa ni nzuri kwa jambo fulani. Ni baadhi tu zinazoendelea kufanya kazi mtandao unapokwama.",
  "home.compare.col.project": "Mradi",
  "home.compare.col.transport": "Usafirishaji",
  "home.compare.col.encryption": "Ufichaji",
  "home.compare.col.offline": "Inafanya kazi nje ya mtandao",
  "home.compare.col.hardware_free": "Bila vifaa vya ziada",
  "home.compare.col.open_source": "Chanzo huria",
  "home.compare.mark.yes": "Ndiyo",
  "home.compare.mark.no": "Hapana",
  "home.compare.mark.partial": "Kwa sehemu, programu za mteja ni chanzo huria, seva sivyo",
  "home.compare.mark.partial_hint": "Programu za mteja ni chanzo huria, seva sivyo",
  "home.compare.transport.servers": "Seva kuu",
  "home.compare.transport.onion": "Uelekezaji wa kitunguu (vituo vya huduma)",
  "home.compare.transport.nostr": "Vipeperushi vya Nostr",
  "home.compare.transport.lora": "Redio ya LoRa",
  "home.compare.transport.sub_ghz": "Redio ya sub-GHz ya kampuni",

  "home.explore.eyebrow": "Wazi na wa kweli",
  "home.explore.title": "Kila dai hapa linaweza kuthibitishwa.",
  "home.explore.sub":
    "Msimbo, itifaki na mipango ni ya umma. Vikwazo pia. Thibitisha mwenyewe kabla ya kuamini maneno yetu.",
  "home.explore.audit.chip": "Ukaguzi unasubiriwa",
  "home.explore.audit.headline": "Airhop bado haijafanyiwa ukaguzi wa usalama wa nje.",
  "home.explore.audit.body":
    "{headline} Msimbo wote hukaguliwa binafsi na kupitishwa kwenye {review} kabla ya kutolewa, na maktaba ya usimbaji inayotumika imekaguliwa na Cure53, lakini hilo halibadilishi ukaguzi rasmi wa programu yenyewe. Ukaguzi umepangwa kwa {version}. Hadi wakati huo, usiitegemee kwa matumizi nyeti.",
  "home.explore.audit.link.review": "wakala wa ukaguzi wa usalama",
  "home.explore.source.title": "Msimbo wa chanzo",
  "home.explore.source.desc":
    "Kila kitu kwenye GitHub chini ya leseni ya MIT. Masuala, pull request na majadiliano ni wazi.",
  "home.explore.protocol.title": "Maelezo ya itifaki",
  "home.explore.protocol.desc":
    "Muundo kamili wa upitishaji, UUID za BLE na vipimo, vinavyoshirikiwa na bitchat.",
  "home.explore.architecture.title": "Muundo",
  "home.explore.architecture.desc":
    "Uchambuzi kamili wa kiufundi, kutoka kugusa tuma hadi baiti kwenye redio.",
  "home.explore.roadmap.title": "Ramani ya njia",
  "home.explore.roadmap.desc":
    "Malengo ya matoleo kutoka v0.5.0 hadi v2.0.0, pamoja na ukaguzi uliopangwa.",
  "home.explore.vision.title": "Maono",
  "home.explore.vision.desc": "Kwa nini Airhop ipo, na kanuni zisizobadilika chini ya shinikizo.",
  "home.explore.brand.title": "Kifurushi cha chapa",
  "home.explore.brand.desc":
    "Ndege wa pikseli, alama za rangi na uandishi, rasilimali za vyombo vya habari na maandishi tayari.",

  "home.contribute.eyebrow": "Unga mkono mradi huu",
  "home.contribute.title": "Huru, na kwa uwazi.",
  "home.contribute.sub":
    "Hakuna wawekezaji, hakuna matangazo, wala toleo la kulipia. Vipengele vyote hubaki bure vyovyote vile, na kazi hii hufadhiliwa na wale wanaoiona ina manufaa.",
  "home.contribute.contribute.chip": "Changia",
  "home.contribute.contribute.body":
    "Ipe nyota hazina ya msimbo, fungua masuala na tuma pull request. Ripoti za hitilafu, mapendekezo ya vipengele na michango ya msimbo yote inakaribishwa.",
  "home.contribute.contribute.cta": "Tazama kwenye GitHub",
  "home.contribute.sponsor.chip": "Fadhili",
  "home.contribute.sponsor.body":
    "Kama Airhop ina manufaa kwako, mchango wa mara moja au ufadhili wa mara kwa mara husaidia sana kuendeleza maendeleo.",
  "home.contribute.sponsor.donate": "Changia mara moja",
  "home.contribute.sponsor.github": "Fadhili kwenye GitHub",

  "page.architecture.eyebrow": "Nyaraka",
  "page.architecture.title": "Muundo",
  "page.architecture.toc": "Kwenye ukurasa huu",

  "page.faq.eyebrow": "Maswali ya kawaida",
  "page.faq.title": "Maswali yanayoulizwa mara kwa mara",
  "page.faq.meta": "Maswali ya kawaida kuhusu Airhop.",
  "page.faq.contact":
    "Maswali yasiyojibiwa hapa yanaweza kutumwa kwa {email} au kuulizwa kwa kufungua majadiliano kwenye {github}.",

  "page.blogs.eyebrow": "Blogu",
  "page.blogs.title": "Inakuja hivi karibuni",
  "page.blogs.body":
    "Maandishi kuhusu mitandao ya mesh, faragha, na programu zinazotanguliza matumizi nje ya mtandao.",

  "page.brand.eyebrow": "Chapa",
  "page.brand.title": "Kifurushi cha Chapa",
  "page.brand.meta":
    "Rasilimali na kanuni za kutumia Airhop katika makala, ukurasa wa duka, hotuba au README. Ni bure kutumia kwa marejeleo na kwa vyombo vya habari.",

  "page.legal.eyebrow": "Kisheria",
  "page.privacy.title": "Sera ya Faragha",
  "page.terms.title": "Masharti ya Huduma",

  "page.notfound.title": "Ukurasa haukupatikana",
  "page.notfound.body": "Ukurasa unaoutafuta haupo au umehamishwa.",

  "page.english_only": "Ukurasa huu unapatikana kwa Kiingereza pekee.",

  "seo.breadcrumb.home": "Mwanzo",

  "seo.home.title": "Airhop — Programu ya ujumbe ya faragha inayotanguliza matumizi nje ya mtandao",
  "seo.home.description":
    "Ujumbe wa faragha kati ya vifaa kwa iOS na Android. Bila intaneti, bila seva, bila akaunti. Wasiliana kupitia mesh ya Bluetooth popote.",

  "seo.architecture.title": "Muundo — Airhop",
  "seo.architecture.description":
    "Jinsi Airhop inavyofanya kazi kutoka juu hadi chini: utambulisho, uchaguzi wa usafirishaji, mesh ya Bluetooth, ufichaji, tabaka la intaneti, Tor, ecash nje ya mtandao, AI kwenye kifaa, na muundo wa upitishaji unaoendana na bitchat.",
  "seo.architecture.breadcrumb": "Muundo",
  "seo.architecture.headline": "Muundo wa Airhop",
  "seo.architecture.summary":
    "Uchambuzi kamili wa kiufundi wa Airhop: utambulisho, njia za usafirishaji, mesh ya Bluetooth, ufichaji, tabaka la intaneti la Nostr, Tor, pochi ya Cashu, msaidizi wa AI kwenye kifaa, na muundo wa upitishaji.",

  "seo.faq.title": "Maswali Yanayoulizwa Mara kwa Mara — Airhop",
  "seo.faq.description":
    "Majibu kuhusu ujumbe wa mesh ya Bluetooth wa Airhop, ufichaji, malipo nje ya mtandao, tabaka la intaneti la Nostr, na uendanaji na bitchat.",
  "seo.faq.breadcrumb": "Maswali ya kawaida",

  "seo.blogs.title": "Blogu — Airhop",
  "seo.blogs.description":
    "Maandishi kuhusu mitandao ya mesh, faragha, na programu zinazotanguliza matumizi nje ya mtandao.",
  "seo.blogs.breadcrumb": "Blogu",

  "seo.brand.title": "Kifurushi cha Chapa — Airhop",
  "seo.brand.description":
    "Kifurushi cha chapa cha Airhop: alama ya ndege wa pikseli, nembo ya maneno, alama za rangi na uandishi, rasilimali za vyombo vya habari na maandishi tayari.",
  "seo.brand.breadcrumb": "Kifurushi cha Chapa",

  "seo.privacy.title": "Sera ya Faragha — Airhop",
  "seo.privacy.description":
    "Jinsi Airhop inavyoshughulikia data: bila akaunti, bila seva, bila ufuatiliaji. Utambulisho wako na ujumbe wako hubaki kwenye kifaa chako.",
  "seo.privacy.breadcrumb": "Sera ya Faragha",

  "seo.terms.title": "Masharti ya Huduma — Airhop",
  "seo.terms.description": "Masharti yanayoongoza matumizi ya programu na tovuti ya Airhop.",
  "seo.terms.breadcrumb": "Masharti ya Huduma",

  "seo.notfound.title": "Ukurasa Haukupatikana — Airhop",
  "seo.notfound.description": "Ukurasa unaoutafuta haupo au umehamishwa.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "kipeperushi {count}",
    other: "vipeperushi {count}",
  },
  "home.map.locations": {
    one: "eneo {count}",
    other: "maeneo {count}",
  },
};

export const locale: Locale = { strings, plurals };
