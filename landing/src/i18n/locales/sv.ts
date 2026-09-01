import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Tillbaka till startsidan",
  "common.last_updated": "Senast uppdaterad: {date}",

  "nav.aria": "Huvudnavigering",
  "nav.home": "Airhop startsida",
  "nav.skip": "Hoppa till innehållet",
  "nav.menu.open": "Öppna menyn",
  "nav.menu.close": "Stäng menyn",
  "nav.how_it_works": "Så fungerar det",
  "nav.architecture": "Arkitektur",
  "nav.faq": "Vanliga frågor",

  "footer.aria": "Sidfot",
  "footer.tagline": "Privat mesh-kommunikation",
  "footer.credit": "© Gjord med {heart} av {author}",
  "footer.group.download": "Ladda ner",
  "footer.group.resources": "Resurser",
  "footer.group.social": "Sociala medier",
  "footer.group.legal": "Juridik",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Arkitektur",
  "footer.link.blogs": "Blogg",
  "footer.link.faq": "Vanliga frågor",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Användarvillkor",
  "footer.link.privacy": "Integritetspolicy",
  "footer.link.license": "Projektlicens",

  "settings.theme.group": "Färgtema",
  "settings.theme.light": "Ljust tema",
  "settings.theme.dark": "Mörkt tema",
  "settings.language.label": "Språk",
  "settings.language.suggestion": "Visa den här sidan på svenska",
  "settings.language.dismiss": "Stäng",

  "home.hero.release": "Senaste versionen",
  "home.hero.title": "Meddelanden som fungerar utan internet.",
  "home.hero.body":
    "Telefoner i närheten bildar ett Bluetooth-mesh och skickar dina meddelanden vidare i upp till sju hopp, krypterade hela vägen. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Inga servrar",
  "home.hero.body.no_accounts": "inga konton",
  "home.hero.body.no_tracking": "ingen spårning",
  "home.hero.download": "Ladda ner appen",
  "home.hero.badges": "MIT-licens · Fri och öppen källkod · Fungerar med bitchat",
  "home.hero.group.mobile": "Mobil",
  "home.hero.group.desktop": "Dator",
  "home.hero.option.f_droid": "Katalog med öppen källkod",
  "home.hero.option.apk": "Direkt nedladdning",
  "home.hero.option.soon": "Kommer snart",

  "home.about.eyebrow": "Vad är Airhop",
  "home.about.title": "De flesta appar är beroende av en central server.",
  "home.about.sub":
    "En server kan övervakas, stängas av eller blockeras. Airhop har ingen, så det finns inget företag att pressa och ingen tjänst att stänga.",
  "home.about.card": "Teknisk översikt",
  "home.about.link.mesh": "Bluetooth Low Energy-mesh",
  "home.about.link.wire_protocol": "överföringsprotokoll",
  "home.about.body.built":
    "Airhop är en app med öppen källkod för iOS och Android för privata meddelanden direkt mellan enheter över {mesh}. Den bygger på grunden från {bitchat}, återanvänder dess {wire_protocol} och säkerhetsmodell, och utökar båda med {ecash}-betalningar offline och AI offline. Den fungerar helt utan internetuppkoppling, och meddelanden skickas automatiskt vidare mellan enheter i närheten (ungefär 10 till 30 meter per hopp inomhus, längre utomhus), i upp till 7 hopp.",
  "home.about.body.identity":
    "Din identitet är ett {ed25519}-nyckelpar som skapas på din enhet och sparas i {ios_keychain} eller {android_keystore}. Det finns inga konton, ingen registrering och inget som rör en server, det vill säga appen kan användas som en engångsapp som inte lämnar något som leder tillbaka till dig när den raderats.",
  "home.about.body.crypto":
    "Varje session använder {noise}-protokollet för en autentiserad handskakning. Sparade meddelanden använder {ratchet}-algoritmen, det vill säga även om din enhet komprometteras senare förblir dina tidigare meddelanden oläsbara. Nödradering förstör alla nycklar och meddelanden på under en sekund.",
  "home.about.body.internet":
    "När du och en kontakt är utanför Bluetooth-räckvidd fungerar {nostr}-reläer som en brygga över internet, med direktmeddelanden inslagna enligt {nip17}, så att meshet når hela världen så länge ni båda är uppkopplade. Stöd för {tor} finns på både iOS och Android, via {arti}.",
  "home.about.optional.title": "Airhop har valfria funktioner som du kan slå på:",
  "home.about.optional.payments.label": "Betalningar offline:",
  "home.about.optional.payments.body":
    "Skicka och ta emot betalningar över meshet med {cashu}-protokollet (endast Bitcoin).",
  "home.about.optional.ai.label": "AI offline:",
  "home.about.optional.ai.body":
    "En liten AI-assistent på enheten som kan svara på viktiga frågor. All bearbetning och all data stannar på din enhet.",
  "home.about.body.compatible":
    "Airhop är kompatibel med bitchat på protokollnivå. En Airhop-enhet och en bitchat-enhet på samma mesh hittar varandra automatiskt och kan utbyta meddelanden och direktmeddelanden helt utan konfiguration.",

  "home.situations.eyebrow": "När du behöver det",
  "home.situations.title": "För dagen då nätet går ner.",
  "home.situations.sub":
    "Naturkatastrofer, internetavbrott, massprotester, eller en vanlig helg utanför täckning.",
  "home.situations.disaster.label": "Katastrof",
  "home.situations.disaster.line": "Masterna är nere. Ett anslag på tavlan når alla som går förbi.",
  "home.situations.offgrid.label": "Utanför nätet",
  "home.situations.offgrid.line": "Andra dagen på leden. Sista täckningsstrecket försvann i går.",
  "home.situations.protest.label": "Protest",
  "home.situations.protest.line":
    "En QR-kod på ett flygblad öppnar en krypterad kanal för marschen.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Ingen täckning på området. Meddelanden hoppar genom främlingars telefoner.",

  "home.showcase.eyebrow": "Se appen",
  "home.showcase.title": "En helt vanlig meddelandeapp, offline.",
  "home.showcase.sub":
    "Chattar, kanaler, en plånbok och en identitet. Bekant på ytan, med ett mesh under som gör jobbet.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Alla inom räckhåll, placerade efter hur nära de är. Ingen behöver läggas till först.",
  "home.showcase.mesh.alt":
    "Mesh-skärmen i Airhop-appen, med fyra närliggande enheter placerade på en radar efter signalstyrka.",
  "home.showcase.chats.title": "Chattar",
  "home.showcase.chats.caption":
    "Vanliga samtal. Telefonerna som skickar vidare varje meddelande kan inte öppna det.",
  "home.showcase.chats.alt":
    "Ett direktmeddelandesamtal i Airhop under ett strömavbrott, vidarebefordrat genom tre telefoner.",
  "home.showcase.channels.title": "Kanaler",
  "home.showcase.channels.caption":
    "Öppna rum så små som ett kvarter eller så vida som en region, öppna för alla som är där.",
  "home.showcase.channels.alt":
    "Chattskärmen i Airhop-appen, med offentliga kanaler avgränsade till ett kvarter, ett område, en stad och en region.",
  "home.showcase.wallet.title": "Plånbok",
  "home.showcase.wallet.caption":
    "Ge ecash till personen bredvid dig via Bluetooth, utan att någon av telefonerna är uppkopplad.",
  "home.showcase.wallet.alt":
    "Plånboksskärmen i Airhop-appen, med ett ecash-saldo som kan skickas via Bluetooth.",
  "home.showcase.identity.title": "Identitet",
  "home.showcase.identity.caption":
    "Ingen registrering, inget telefonnummer, ingen e-post. Bara en nyckel som aldrig lämnar den här telefonen.",
  "home.showcase.identity.alt":
    "Profilskärmen i Airhop-appen, med en identitet som skapats på enheten utan konto.",

  "home.how.eyebrow": "Så fungerar det",
  "home.how.title": "Meshet bildar sig självt.",
  "home.how.sub":
    "Närliggande noder bildar ett självläkande mesh över Bluetooth. När det finns internet utökar Nostr-reläer det, utan infrastruktur som någon styr.",
  "home.how.cta": "Läs hela arkitekturen",
  "home.how.discover.title": "Hitta",
  "home.how.discover.line":
    "Telefoner med Airhop eller bitchat hittar varandra automatiskt över Bluetooth. Ingen parkoppling, ingen inställning.",
  "home.how.relay.title": "Vidarebefordra",
  "home.how.relay.line":
    "Ett meddelande hoppar från telefon till telefon, i upp till sju hopp. Telefonerna däremellan ser aldrig vad de bär.",
  "home.how.reach.title": "Nå längre",
  "home.how.reach.line":
    "När det finns internet bär Nostr-reläer samma samtal längre, om du vill via Tor.",
  "home.how.swipe": "svep för att utforska",
  "home.how.diagram": "BLE-mesh · lokalt nätverk mellan enheter",
  "home.how.legend.node": "BLE-mesh-nod (offline)",
  "home.how.legend.relay": "Vidarebefordran över flera hopp (Noise XX-krypterad)",
  "home.how.legend.bitchat": "bitchat-kompatibel på samma mesh",
  "home.how.legend.nostr": "Nostr-brygga (internet, när uppkopplad)",

  "home.map.aria": "Världskarta över Nostr-reläernas platser",
  "home.map.summary": "Nostr-brygga · {relays} på {locations} världen över",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Vad den gör",
  "home.features.title": "En riktig meddelandeapp, inte en demo.",
  "home.features.sub":
    "Chatt, identitet, nätverk och pengar. Allt byggt för att fungera utan täckning, utan konto och utan något däremellan.",

  "home.features.messaging.title": "Meddelanden",
  "home.features.messaging.summary": "Allt en meddelandeapp har, med noll infrastruktur bakom.",
  "home.features.messaging.dms.name": "Privata direktmeddelanden",
  "home.features.messaging.dms.line": "Krypterade hela vägen, med leverans- och läskvitton.",
  "home.features.messaging.location.name": "Platskanaler",
  "home.features.messaging.location.line":
    "Rum knutna till en plats, från ett kvarter till en region.",
  "home.features.messaging.groups.name": "Privata kanaler och grupper",
  "home.features.messaging.groups.line":
    "Inbjudningslänkar till ett rum, eller en signerad lista på upp till 16.",
  "home.features.messaging.board.name": "Anslagstavla",
  "home.features.messaging.board.line": "Anslag fästa vid ett område i upp till sju dagar.",
  "home.features.messaging.voice.name": "Direktsänd röst",
  "home.features.messaging.voice.line":
    "Håll in mikrofonen och prata med alla inom räckhåll, som en walkie-talkie.",
  "home.features.messaging.notes.name": "Röstmeddelanden",
  "home.features.messaging.notes.line": "Inspelat ljud, snabbare än att skriva en vägbeskrivning.",
  "home.features.messaging.files.name": "Foton, video och filer",
  "home.features.messaging.files.line": "Alla format, upp till 1 MiB, utan att täckning behövs.",
  "home.features.messaging.forward.name": "Lagra och vidarebefordra",
  "home.features.messaging.forward.line":
    "Förseglat och buret av en telefon i närheten tills det kommer fram.",

  "home.features.identity.title": "Identitet",
  "home.features.identity.summary": "Inget att registrera, inget att beslagta.",
  "home.features.identity.keys.name": "Identitet som nyckelpar",
  "home.features.identity.keys.line": "Skapad på den här telefonen, sparad i systemets nyckelring.",
  "home.features.identity.names.name": "Läsbara namn",
  "home.features.identity.names.line": "Härledda ur din nyckel, så ingen kan ta ditt.",
  "home.features.identity.qr.name": "Kontakter via QR",
  "home.features.identity.qr.line": "En skanning bär deras nycklar, inte bara deras namn.",
  "home.features.identity.panic.name": "Nödradering",
  "home.features.identity.panic.line":
    "Varje nyckel och varje meddelande förstörda på under en sekund.",

  "home.features.networking.title": "Nätverk",
  "home.features.networking.summary": "Telefonerna är nätverket.",
  "home.features.networking.mesh.name": "Bluetooth-mesh",
  "home.features.networking.mesh.line":
    "Inget internet, ingen router, på telefoner folk redan äger.",
  "home.features.networking.bridge.name": "Mesh-brygga",
  "home.features.networking.bridge.line":
    "Kopplar din öppna chatt till en grupp i närheten utanför räckvidd.",
  "home.features.networking.wifi.name": "Snabb väg via WiFi",
  "home.features.networking.wifi.line":
    "Snabbare överföringar mellan två Android eller två iPhone.",
  "home.features.networking.bitchat.name": "bitchat-kompatibel",
  "home.features.networking.bitchat.line":
    "Båda apparna ansluter till samma mesh utan inställningar.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Ett tillägg, aldrig ett krav.",
  "home.features.internet.nostr.name": "Nostr som reserv",
  "home.features.internet.nostr.line":
    "Direktmeddelanden och platskanaler fortsätter flöda bortom radioräckvidd.",
  "home.features.internet.relays.name": "Hitta geo-reläer",
  "home.features.internet.relays.line": "Över 300 oberoende offentliga reläer, inget av dem vårt.",
  "home.features.internet.gateway.name": "Internetgateway",
  "home.features.internet.gateway.line":
    "Låna ut din uppkoppling så att en frånkopplad telefon i närheten når platskanaler.",
  "home.features.internet.tor.name": "Tor-integration",
  "home.features.internet.tor.line":
    "Dirigerad på båda plattformarna, så att reläer aldrig ser din IP.",

  "home.features.optional.title": "Valfritt",
  "home.features.optional.summary": "Av som standard. På när du vill.",
  "home.features.optional.cashu.name": "Cashu-ecash",
  "home.features.optional.cashu.line":
    "Betala personen bredvid dig utan att någon telefon är uppkopplad.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Fyll på eller ta ut i bitcoin över Lightning-nätverket.",
  "home.features.optional.ai.name": "Lokal AI",
  "home.features.optional.ai.line": "Svar på enheten, inget lämnar telefonen.",
  "home.features.optional.social.name": "Sociala bryggor",
  "home.features.optional.social.line": "Bluesky och Mastodon med samma identitet.",

  "home.compare.eyebrow": "Så står den sig",
  "home.compare.title": "Offline, utan extra hårdvara och öppen.",
  "home.compare.sub":
    "Varje app här är bra på något. Men bara vissa fungerar fortfarande när nätet inte gör det.",
  "home.compare.col.project": "Projekt",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Kryptering",
  "home.compare.col.offline": "Fungerar offline",
  "home.compare.col.hardware_free": "Utan extra hårdvara",
  "home.compare.col.open_source": "Öppen källkod",
  "home.compare.mark.yes": "Ja",
  "home.compare.mark.no": "Nej",
  "home.compare.mark.partial": "Delvis, klienterna har öppen källkod, servrarna inte",
  "home.compare.mark.partial_hint": "Klienterna har öppen källkod, servrarna inte",
  "home.compare.transport.servers": "Centraliserade servrar",
  "home.compare.transport.onion": "Onion-routing (tjänstenoder)",
  "home.compare.transport.nostr": "Nostr-reläer",
  "home.compare.transport.lora": "LoRa-radio",
  "home.compare.transport.sub_ghz": "Proprietär sub-GHz-radio",

  "home.explore.eyebrow": "Öppet och ärligt",
  "home.explore.title": "Varje påstående här går att kontrollera.",
  "home.explore.sub":
    "Koden, protokollet och planerna är offentliga. Begränsningarna också. Kontrollera själv innan du tar oss på orden.",
  "home.explore.audit.chip": "Granskning väntar",
  "home.explore.audit.headline": "Airhop har ännu inte genomgått någon extern säkerhetsgranskning.",
  "home.explore.audit.body":
    "{headline} All kod granskas personligen och körs genom en {review} före publicering, och kryptobiblioteket som används är granskat av Cure53, men det ersätter inte en formell granskning av appen i sig. En är planerad till {version}. Förlita dig inte på appen för känsliga fall innan dess.",
  "home.explore.audit.link.review": "säkerhetsgranskningsagent",
  "home.explore.source.title": "Källkod",
  "home.explore.source.desc":
    "Allt på GitHub under MIT. Ärenden, pull requests och diskussioner är öppna.",
  "home.explore.protocol.title": "Protokollspecifikation",
  "home.explore.protocol.desc":
    "Det exakta överföringsformatet, BLE-UUID:erna och konstanterna, delade med bitchat.",
  "home.explore.architecture.title": "Arkitektur",
  "home.explore.architecture.desc":
    "Hela den tekniska genomgången, från trycket på skicka till bytena i etern.",
  "home.explore.roadmap.title": "Färdplan",
  "home.explore.roadmap.desc":
    "Versionsmål från v0.5.0 till v2.0.0, inklusive den planerade granskningen.",
  "home.explore.vision.title": "Vision",
  "home.explore.vision.desc": "Varför Airhop finns, och principerna som inte ändras under press.",
  "home.explore.brand.title": "Varumärkespaket",
  "home.explore.brand.desc":
    "Pixelfågeln, färg- och typografitokens, pressmaterial och färdiga texter.",

  "home.contribute.eyebrow": "Stöd det här projektet",
  "home.contribute.title": "Oberoende, och i öppen dager.",
  "home.contribute.sub":
    "Det finns inga investerare, ingen reklam och ingen betalversion. Alla funktioner förblir gratis ändå, och arbetet finansieras av de som har nytta av det.",
  "home.contribute.contribute.chip": "Bidra",
  "home.contribute.contribute.body":
    "Stjärnmärk arkivet, öppna ärenden och skicka pull requests. Buggrapporter, funktionsförslag och kodbidrag är alla välkomna.",
  "home.contribute.contribute.cta": "Visa på GitHub",
  "home.contribute.sponsor.chip": "Sponsra",
  "home.contribute.sponsor.body":
    "Om Airhop är till nytta för dig hjälper en engångsdonation eller ett återkommande stöd mycket för att hålla utvecklingen igång.",
  "home.contribute.sponsor.donate": "Donera en gång",
  "home.contribute.sponsor.github": "Sponsra på GitHub",

  "page.architecture.eyebrow": "Dokumentation",
  "page.architecture.title": "Arkitektur",
  "page.architecture.toc": "På den här sidan",

  "page.faq.eyebrow": "Vanliga frågor",
  "page.faq.title": "Vanliga frågor",
  "page.faq.meta": "Vanliga frågor om Airhop.",
  "page.faq.contact":
    "Frågor som inte besvaras här kan skickas till {email} eller tas upp genom att öppna en diskussion på {github}.",

  "page.blogs.eyebrow": "Blogg",
  "page.blogs.title": "Kommer snart",
  "page.blogs.body": "Texter om mesh-nätverk, integritet och offline-first-programvara.",

  "page.brand.eyebrow": "Varumärke",
  "page.brand.title": "Varumärkespaket",
  "page.brand.meta":
    "Material och regler för att visa Airhop i en artikel, en butikssida, ett föredrag eller en README. Fritt att använda som referens och för press.",

  "page.legal.eyebrow": "Juridik",
  "page.privacy.title": "Integritetspolicy",
  "page.terms.title": "Användarvillkor",

  "page.notfound.title": "Sidan hittades inte",
  "page.notfound.body": "Sidan du letar efter finns inte eller har flyttats.",

  "page.english_only": "Den här sidan finns endast på engelska.",

  "seo.breadcrumb.home": "Start",

  "seo.home.title": "Airhop — Privat meddelandeapp som fungerar offline först",
  "seo.home.description":
    "Privata meddelanden direkt mellan enheter för iOS och Android. Inget internet, inga servrar, inga konton. Kommunicera över Bluetooth-mesh var som helst.",

  "seo.architecture.title": "Arkitektur — Airhop",
  "seo.architecture.description":
    "Hur Airhop fungerar, uppifrån och ner: identitet, val av transport, Bluetooth-meshet, kryptering, internetlagret, Tor, ecash offline, AI på enheten och det bitchat-kompatibla överföringsformatet.",
  "seo.architecture.breadcrumb": "Arkitektur",
  "seo.architecture.headline": "Airhops arkitektur",
  "seo.architecture.summary":
    "En fullständig teknisk genomgång av Airhop: identitet, transporter, Bluetooth-meshet, kryptering, Nostr-internetlagret, Tor, Cashu-plånboken, AI-assistenten på enheten och överföringsformatet.",

  "seo.faq.title": "Vanliga frågor — Airhop",
  "seo.faq.description":
    "Svar om Airhops Bluetooth-mesh-meddelanden, kryptering, betalningar offline, Nostr-internetlagret och kompatibiliteten med bitchat.",
  "seo.faq.breadcrumb": "Vanliga frågor",

  "seo.blogs.title": "Blogg — Airhop",
  "seo.blogs.description": "Texter om mesh-nätverk, integritet och offline-first-programvara.",
  "seo.blogs.breadcrumb": "Blogg",

  "seo.brand.title": "Varumärkespaket — Airhop",
  "seo.brand.description":
    "Airhops varumärkespaket: pixelfågelns symbol, ordmärket, färg- och typografitokens, pressmaterial och färdiga texter.",
  "seo.brand.breadcrumb": "Varumärkespaket",

  "seo.privacy.title": "Integritetspolicy — Airhop",
  "seo.privacy.description":
    "Hur Airhop hanterar data: inga konton, inga servrar, ingen spårning. Din identitet och dina meddelanden stannar på din enhet.",
  "seo.privacy.breadcrumb": "Integritetspolicy",

  "seo.terms.title": "Användarvillkor — Airhop",
  "seo.terms.description": "Villkoren som styr användningen av Airhop-appen och webbplatsen.",
  "seo.terms.breadcrumb": "Användarvillkor",

  "seo.notfound.title": "Sidan hittades inte — Airhop",
  "seo.notfound.description": "Sidan du letar efter finns inte eller har flyttats.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} relä",
    other: "{count} reläer",
  },
  "home.map.locations": {
    one: "{count} plats",
    other: "{count} platser",
  },
};

export const locale: Locale = { strings, plurals };
