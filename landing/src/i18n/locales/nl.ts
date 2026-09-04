import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Terug naar home",
  "common.last_updated": "Laatst bijgewerkt: {date}",

  "nav.aria": "Hoofdnavigatie",
  "nav.home": "Airhop home",
  "nav.skip": "Naar de inhoud",
  "nav.menu.open": "Menu openen",
  "nav.menu.close": "Menu sluiten",
  "nav.how_it_works": "Hoe het werkt",
  "nav.architecture": "Architectuur",
  "nav.faq": "FAQ",

  "footer.aria": "Voettekst",
  "footer.tagline": "Privé mesh-communicatie",
  "footer.credit": "© Gemaakt met {heart} door {author}",
  "footer.group.download": "Downloaden",
  "footer.group.resources": "Bronnen",
  "footer.group.social": "Sociaal",
  "footer.group.legal": "Juridisch",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "Architectuur",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "FAQ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Gebruiksvoorwaarden",
  "footer.link.privacy": "Privacybeleid",
  "footer.link.license": "Projectlicentie",

  "settings.theme.group": "Kleurthema",
  "settings.theme.light": "Licht thema",
  "settings.theme.dark": "Donker thema",
  "settings.language.label": "Taal",
  "settings.language.suggestion": "Bekijk deze pagina in het Nederlands",
  "settings.language.dismiss": "Sluiten",

  "home.hero.release": "Nieuwste versie",
  "home.hero.title": "Berichten die werken zonder internet.",
  "home.hero.body":
    "Telefoons in de buurt vormen een Bluetooth-mesh en sturen je berichten door, end-to-end versleuteld. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Geen servers",
  "home.hero.body.no_accounts": "geen accounts",
  "home.hero.body.no_tracking": "geen tracking",
  "home.hero.download": "Download de app",
  "home.hero.badges": "MIT-licentie · Gratis en opensource · Werkt met bitchat",
  "home.hero.group.mobile": "Mobiel",
  "home.hero.group.desktop": "Desktop",
  "home.hero.option.zapstore": "Ondertekend op Nostr",
  "home.hero.option.apk": "Directe download",
  "home.hero.option.soon": "Binnenkort",

  "home.about.eyebrow": "Wat is Airhop",
  "home.about.title": "De meeste apps hangen af van een centrale server.",
  "home.about.sub":
    "Een server kan bespied, uitgezet of geblokkeerd worden. Airhop heeft er geen, dus is er geen bedrijf om onder druk te zetten en geen dienst om te sluiten.",
  "home.about.card": "Technisch overzicht",
  "home.about.link.mesh": "Bluetooth Low Energy-mesh",
  "home.about.link.wire_protocol": "wire-protocol",
  "home.about.body.built":
    "Airhop is een opensource-app voor iOS en Android voor privé peer-to-peer berichten via {mesh}. De app is gebouwd op de basis van {bitchat}, hergebruikt het {wire_protocol} en het beveiligingsmodel, en breidt beide uit met offline {ecash}-betalingen en offline AI. Het werkt zonder enige internetverbinding en berichten worden automatisch doorgestuurd via apparaten in de buurt (ongeveer 10 tot 30 meter per hop binnen, verder in de open lucht), tot 7 hops.",
  "home.about.body.identity":
    "Je identiteit is een {ed25519}-sleutelpaar dat op je apparaat wordt aangemaakt en bewaard in {ios_keychain} of {android_keystore}. Er zijn geen accounts, geen registraties en niets dat een server raakt, oftewel je kunt de app als wegwerp-app gebruiken die na verwijdering niets achterlaat dat naar jou leidt.",
  "home.about.body.crypto":
    "Elke sessie gebruikt het {noise}-protocol voor een geauthenticeerde handshake. Opgeslagen berichten gebruiken het {ratchet}-algoritme, oftewel zelfs als je apparaat later gecompromitteerd raakt, blijven je oude berichten onleesbaar. Noodwissen vernietigt alle sleutels en berichten in minder dan een seconde.",
  "home.about.body.internet":
    "Als jij en een contact buiten Bluetooth-bereik zijn, dienen {nostr}-relays als brug via internet, met directe berichten ingepakt volgens {nip17}, zodat de mesh wereldwijd reikt zodra jullie allebei online zijn. Ondersteuning voor {tor} is er op iOS en Android, via {arti}, met {obfs4}- en {snowflake}-bridges voor netwerken die Tor blokkeren.",
  "home.about.optional.title": "Airhop heeft optionele functies die je kunt inschakelen:",
  "home.about.optional.payments.label": "Offline betalingen:",
  "home.about.optional.payments.body":
    "Verstuur en ontvang betalingen over de mesh met het {cashu}-protocol (alleen Bitcoin).",
  "home.about.optional.ai.label": "Offline AI:",
  "home.about.optional.ai.body":
    "Een kleine AI-assistent op het apparaat die belangrijke vragen kan beantwoorden. Alle verwerking en gegevens blijven op je apparaat.",
  "home.about.body.compatible":
    "Airhop is op protocolniveau compatibel met bitchat. Een Airhop-apparaat en een bitchat-apparaat op dezelfde mesh vinden elkaar automatisch en kunnen zonder enige configuratie berichten en directe berichten uitwisselen.",

  "home.situations.eyebrow": "Wanneer je het nodig hebt",
  "home.situations.title": "Voor de dag dat het netwerk uitvalt.",
  "home.situations.sub":
    "Natuurrampen, internetstoringen, massale protesten, of een gewoon weekend buiten bereik.",
  "home.situations.disaster.label": "Ramp",
  "home.situations.disaster.line":
    "De masten liggen plat. Een bericht op het bord bereikt iedereen die langsloopt.",
  "home.situations.offgrid.label": "Buiten het net",
  "home.situations.offgrid.line":
    "Tweede dag op het pad. Het laatste streepje bereik verdween gisteren.",
  "home.situations.protest.label": "Protest",
  "home.situations.protest.line":
    "Een QR-code op een flyer opent een versleuteld kanaal voor de mars.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Geen bereik op het terrein. Berichten springen door de telefoons van vreemden.",

  "home.showcase.eyebrow": "Bekijk de app",
  "home.showcase.title": "Een gewone berichtenapp, offline.",
  "home.showcase.sub":
    "Chats, kanalen, een wallet en een identiteit. Vertrouwd aan de oppervlakte, met een mesh eronder die het werk doet.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Iedereen binnen bereik, geplaatst naar hoe dichtbij ze zijn. Niemand hoeft eerst toegevoegd te worden.",
  "home.showcase.mesh.alt":
    "Het Mesh-scherm van de Airhop-app, met vier nabije peers op een radar gerangschikt op signaalsterkte.",
  "home.showcase.chats.title": "Chats",
  "home.showcase.chats.caption":
    "Gewone gesprekken. De telefoons die elk bericht doorgeven kunnen het niet openen.",
  "home.showcase.chats.alt":
    "Een direct gesprek in Airhop tijdens een stroomstoring, doorgestuurd via drie telefoons.",
  "home.showcase.channels.title": "Kanalen",
  "home.showcase.channels.caption":
    "Openbare ruimtes zo klein als een huizenblok of zo breed als een regio, open voor iedereen die er is.",
  "home.showcase.channels.alt":
    "Het chatscherm van de Airhop-app, met openbare kanalen afgebakend tot een blok, buurt, stad en regio.",
  "home.showcase.wallet.title": "Wallet",
  "home.showcase.wallet.caption":
    "Geef ecash aan de persoon naast je via Bluetooth, zonder dat een van beide telefoons online is.",
  "home.showcase.wallet.alt":
    "Het wallet-scherm van de Airhop-app, met een ecash-saldo dat via Bluetooth verstuurd kan worden.",
  "home.showcase.identity.title": "Identiteit",
  "home.showcase.identity.caption":
    "Geen aanmelding, geen telefoonnummer, geen e-mail. Alleen een sleutel die deze telefoon nooit verlaat.",
  "home.showcase.identity.alt":
    "Het profielscherm van de Airhop-app, met een identiteit die op het apparaat is aangemaakt, zonder account.",

  "home.how.eyebrow": "Hoe het werkt",
  "home.how.title": "De mesh vormt zichzelf.",
  "home.how.sub":
    "Nabije knooppunten vormen via Bluetooth een zelfherstellende mesh. Als er internet is, breiden Nostr-relays hem uit, zonder infrastructuur die iemand beheert.",
  "home.how.cta": "Lees de volledige architectuur",
  "home.how.discover.title": "Ontdekken",
  "home.how.discover.line":
    "Telefoons met Airhop of bitchat vinden elkaar automatisch via Bluetooth. Geen koppelen, geen instellen.",
  "home.how.relay.title": "Doorsturen",
  "home.how.relay.line":
    "Een bericht springt van telefoon naar telefoon, tot zeven hops. De telefoons ertussen zien nooit wat ze dragen.",
  "home.how.reach.title": "Verder reiken",
  "home.how.reach.line":
    "Als er internet is, dragen Nostr-relays hetzelfde gesprek verder, desgewenst via Tor.",
  "home.how.swipe": "veeg om te verkennen",
  "home.how.diagram": "BLE-mesh · lokaal peer-to-peernetwerk",
  "home.how.legend.node": "BLE-mesh-knooppunt (offline)",
  "home.how.legend.relay": "Multi-hop doorsturen (Noise XX-versleuteld)",
  "home.how.legend.bitchat": "bitchat-compatibel op dezelfde mesh",
  "home.how.legend.nostr": "Nostr-brug (internet, wanneer online)",

  "home.map.aria": "Wereldkaart van de locaties van Nostr-relays",
  "home.map.summary": "Nostr-brug · {relays} op {locations} wereldwijd",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Wat het doet",
  "home.features.title": "Een echte berichtenapp, geen demo.",
  "home.features.sub":
    "Chat, identiteit, netwerk en geld. Allemaal gebouwd om te werken zonder bereik, zonder account en zonder iets ertussen.",

  "home.features.messaging.title": "Berichten",
  "home.features.messaging.summary":
    "Alles wat een berichtenapp heeft, met nul infrastructuur erachter.",
  "home.features.messaging.dms.name": "Privé directe berichten",
  "home.features.messaging.dms.line": "End-to-end versleuteld, met afgifte- en leesbevestigingen.",
  "home.features.messaging.location.name": "Locatiekanalen",
  "home.features.messaging.location.line":
    "Ruimtes gebonden aan een plek, van één blok tot een regio.",
  "home.features.messaging.groups.name": "Privékanalen en groepen",
  "home.features.messaging.groups.line":
    "Uitnodigingslinks voor een ruimte, of een ondertekende lijst van maximaal 16.",
  "home.features.messaging.board.name": "Prikbord",
  "home.features.messaging.board.line": "Mededelingen die tot zeven dagen aan een gebied hangen.",
  "home.features.messaging.voice.name": "Live spraak",
  "home.features.messaging.voice.line":
    "Houd de microfoon ingedrukt en praat met iedereen binnen bereik, als een walkietalkie.",
  "home.features.messaging.notes.name": "Spraakberichten",
  "home.features.messaging.notes.line": "Opgenomen audio, sneller dan een route uittypen.",
  "home.features.messaging.files.name": "Foto's, video en bestanden",
  "home.features.messaging.files.line": "Elk formaat, tot 1 MiB, zonder bereik nodig.",
  "home.features.messaging.forward.name": "Opslaan en doorsturen",
  "home.features.messaging.forward.line":
    "Verzegeld en meegedragen door een telefoon in de buurt tot het aankomt.",

  "home.features.identity.title": "Identiteit",
  "home.features.identity.summary": "Niets te registreren, niets in beslag te nemen.",
  "home.features.identity.keys.name": "Identiteit als sleutelpaar",
  "home.features.identity.keys.line":
    "Aangemaakt op deze telefoon, bewaard in de sleutelhanger van het systeem.",
  "home.features.identity.names.name": "Leesbare namen",
  "home.features.identity.names.line":
    "Afgeleid van je sleutel, zodat niemand de jouwe kan afpakken.",
  "home.features.identity.qr.name": "Contacten via QR",
  "home.features.identity.qr.line": "Eén scan draagt hun sleutels over, niet alleen hun naam.",
  "home.features.identity.panic.name": "Noodwissen",
  "home.features.identity.panic.line":
    "Elke sleutel en elk bericht vernietigd in minder dan een seconde.",

  "home.features.networking.title": "Netwerk",
  "home.features.networking.summary": "De telefoons zijn het netwerk.",
  "home.features.networking.mesh.name": "Bluetooth-mesh",
  "home.features.networking.mesh.line":
    "Geen internet, geen router, op telefoons die mensen al hebben.",
  "home.features.networking.bridge.name": "Mesh-brug",
  "home.features.networking.bridge.line":
    "Verbindt je openbare chat met een groep in de buurt buiten bereik.",
  "home.features.networking.wifi.name": "WiFi-sneltraject",
  "home.features.networking.wifi.line": "Snellere overdracht tussen twee Androids of twee iPhones.",
  "home.features.networking.bitchat.name": "bitchat-compatibel",
  "home.features.networking.bitchat.line":
    "Beide apps sluiten zich zonder instellen aan op dezelfde mesh.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Een uitbreiding, nooit een vereiste.",
  "home.features.internet.nostr.name": "Nostr als terugval",
  "home.features.internet.nostr.line":
    "Directe berichten en locatiekanalen blijven doorlopen buiten radiobereik.",
  "home.features.internet.relays.name": "Geo-relays vinden",
  "home.features.internet.relays.line":
    "Meer dan 300 onafhankelijke openbare relays, geen daarvan van ons.",
  "home.features.internet.gateway.name": "Internetgateway",
  "home.features.internet.gateway.line":
    "Leen je verbinding uit zodat een offline telefoon in de buurt locatiekanalen bereikt.",
  "home.features.internet.tor.name": "Tor-integratie",
  "home.features.internet.tor.line":
    "Op beide platforms gerouteerd, zodat relays je IP nooit zien.",

  "home.features.optional.title": "Optioneel",
  "home.features.optional.summary": "Standaard uit. Aan wanneer je wilt.",
  "home.features.optional.cashu.name": "Cashu-ecash",
  "home.features.optional.cashu.line":
    "Betaal de persoon naast je zonder dat een telefoon online is.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Opwaarderen of uitbetalen in bitcoin via het Lightning-netwerk.",
  "home.features.optional.ai.name": "Lokale AI",
  "home.features.optional.ai.line": "Antwoorden op het apparaat, niets verlaat de telefoon.",
  "home.features.optional.social.name": "Sociale bruggen",
  "home.features.optional.social.line": "Bluesky en Mastodon met dezelfde identiteit.",

  "home.compare.eyebrow": "Hoe het zich verhoudt",
  "home.compare.title": "Offline, zonder extra hardware en open.",
  "home.compare.sub":
    "Elke app hier is ergens goed in. Maar slechts enkele werken nog als het netwerk dat niet doet.",
  "home.compare.col.project": "Project",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Versleuteling",
  "home.compare.col.offline": "Werkt offline",
  "home.compare.col.hardware_free": "Zonder extra hardware",
  "home.compare.col.open_source": "Opensource",
  "home.compare.mark.yes": "Ja",
  "home.compare.mark.no": "Nee",
  "home.compare.mark.partial": "Deels, de clients zijn opensource, de servers niet",
  "home.compare.mark.partial_hint": "De clients zijn opensource, de servers niet",
  "home.compare.transport.servers": "Gecentraliseerde servers",
  "home.compare.transport.onion": "Onion-routing (serviceknooppunten)",
  "home.compare.transport.nostr": "Nostr-relays",
  "home.compare.transport.lora": "LoRa-radio",
  "home.compare.transport.sub_ghz": "Propriëtaire sub-GHz-radio",

  "home.explore.eyebrow": "Open en eerlijk",
  "home.explore.title": "Elke bewering hier is te controleren.",
  "home.explore.sub":
    "De code, het protocol en de plannen zijn openbaar. De beperkingen ook. Controleer het zelf voordat je ons op ons woord gelooft.",
  "home.explore.audit.chip": "Audit in afwachting",
  "home.explore.audit.headline": "Airhop heeft nog geen externe beveiligingsaudit gehad.",
  "home.explore.audit.body":
    "{headline} Alle code wordt persoonlijk nagelezen en voor publicatie door een {review} gehaald, en de gebruikte cryptografiebibliotheek is door Cure53 geaudit, maar dat vervangt geen formele audit van de app zelf. Er staat er een gepland voor {version}. Vertrouw er tot die tijd niet op voor gevoelige situaties.",
  "home.explore.audit.link.review": "beveiligingsbeoordelingsagent",
  "home.explore.source.title": "Broncode",
  "home.explore.source.desc":
    "Alles op GitHub onder MIT. Issues, pull requests en discussies staan open.",
  "home.explore.protocol.title": "Protocolspecificatie",
  "home.explore.protocol.desc":
    "Het exacte wire-formaat, de BLE-UUID's en de constanten, gedeeld met bitchat.",
  "home.explore.architecture.title": "Architectuur",
  "home.explore.architecture.desc":
    "De volledige technische uitsplitsing, van het tikken op verzenden tot de bytes op de radio.",
  "home.explore.roadmap.title": "Roadmap",
  "home.explore.roadmap.desc": "Versiedoelen van v0.5.0 tot v2.0.0, inclusief de geplande audit.",
  "home.explore.vision.title": "Visie",
  "home.explore.vision.desc":
    "Waarom Airhop bestaat, en de principes die onder druk niet veranderen.",
  "home.explore.brand.title": "Merkkit",
  "home.explore.brand.desc":
    "De pixelvogel, de kleur- en typografietokens, persmateriaal en standaardteksten.",

  "home.contribute.eyebrow": "Steun dit project",
  "home.contribute.title": "Onafhankelijk, en in de openbaarheid.",
  "home.contribute.sub":
    "Er zijn geen investeerders, geen advertenties en geen betaalde versie. Alle functies blijven hoe dan ook gratis, en het werk wordt gefinancierd door de mensen die het nuttig vinden.",
  "home.contribute.contribute.chip": "Bijdragen",
  "home.contribute.contribute.body":
    "Geef de repository een ster, open issues en stuur pull requests. Bugmeldingen, functievoorstellen en codebijdragen zijn allemaal welkom.",
  "home.contribute.contribute.cta": "Bekijk op GitHub",
  "home.contribute.sponsor.chip": "Sponsoren",
  "home.contribute.sponsor.body":
    "Als Airhop nuttig voor je is, helpt een eenmalige donatie of een terugkerende sponsoring enorm om de ontwikkeling actief te houden.",
  "home.contribute.sponsor.donate": "Doneer eenmalig",
  "home.contribute.sponsor.github": "Sponsor op GitHub",

  "page.architecture.eyebrow": "Documentatie",
  "page.architecture.title": "Architectuur",
  "page.architecture.toc": "Op deze pagina",

  "page.faq.eyebrow": "FAQ",
  "page.faq.title": "Veelgestelde vragen",
  "page.faq.meta": "Veelvoorkomende vragen over Airhop.",
  "page.faq.contact":
    "Vragen die hier niet beantwoord worden, kun je sturen naar {email} of stellen door een discussie te openen op {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Binnenkort",
  "page.blogs.body": "Teksten over mesh-netwerken, privacy en offline-first software.",

  "page.brand.eyebrow": "Merk",
  "page.brand.title": "Merkkit",
  "page.brand.meta":
    "Materiaal en regels om Airhop te tonen in een artikel, een winkelvermelding, een lezing of een README. Vrij te gebruiken als referentie en voor de pers.",

  "page.legal.eyebrow": "Juridisch",
  "page.privacy.title": "Privacybeleid",
  "page.terms.title": "Gebruiksvoorwaarden",

  "page.notfound.title": "Pagina niet gevonden",
  "page.notfound.body": "De pagina die je zoekt bestaat niet of is verplaatst.",

  "page.english_only": "Deze pagina is alleen in het Engels beschikbaar.",

  "seo.breadcrumb.home": "Home",

  "seo.home.title": "Airhop — Privé, offline-first berichtenapp",
  "seo.home.description":
    "Privé peer-to-peer berichten voor iOS en Android. Geen internet, geen servers, geen accounts. Communiceer overal via Bluetooth-mesh.",

  "seo.architecture.title": "Architectuur — Airhop",
  "seo.architecture.description":
    "Hoe Airhop werkt, van boven tot onder: identiteit, transportkeuze, de Bluetooth-mesh, versleuteling, de internetlaag, Tor, offline ecash, AI op het apparaat en het bitchat-compatibele wire-formaat.",
  "seo.architecture.breadcrumb": "Architectuur",
  "seo.architecture.headline": "Airhop-architectuur",
  "seo.architecture.summary":
    "Een volledige technische uitsplitsing van Airhop: identiteit, transporten, de Bluetooth-mesh, versleuteling, de Nostr-internetlaag, Tor, de Cashu-wallet, de AI-assistent op het apparaat en het wire-formaat.",

  "seo.faq.title": "Veelgestelde vragen — Airhop",
  "seo.faq.description":
    "Antwoorden over Airhops Bluetooth-mesh-berichten, versleuteling, offline betalingen, de Nostr-internetlaag en bitchat-compatibiliteit.",
  "seo.faq.breadcrumb": "FAQ",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Teksten over mesh-netwerken, privacy en offline-first software.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Merkkit — Airhop",
  "seo.brand.description":
    "De Airhop-merkkit: het pixelvogel-logo, het woordmerk, kleur- en typografietokens, persmateriaal en standaardteksten.",
  "seo.brand.breadcrumb": "Merkkit",

  "seo.privacy.title": "Privacybeleid — Airhop",
  "seo.privacy.description":
    "Hoe Airhop met gegevens omgaat: geen accounts, geen servers, geen tracking. Je identiteit en je berichten blijven op je apparaat.",
  "seo.privacy.breadcrumb": "Privacybeleid",

  "seo.terms.title": "Gebruiksvoorwaarden — Airhop",
  "seo.terms.description": "De voorwaarden voor het gebruik van de Airhop-app en de website.",
  "seo.terms.breadcrumb": "Gebruiksvoorwaarden",

  "seo.notfound.title": "Pagina niet gevonden — Airhop",
  "seo.notfound.description": "De pagina die je zoekt bestaat niet of is verplaatst.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} relay",
    other: "{count} relays",
  },
  "home.map.locations": {
    one: "{count} locatie",
    other: "{count} locaties",
  },
};

export const locale: Locale = { strings, plurals };
