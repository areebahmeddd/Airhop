import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Zurück zur Startseite",
  "common.last_updated": "Zuletzt aktualisiert: {date}",

  "nav.aria": "Hauptnavigation",
  "nav.home": "Airhop Startseite",
  "nav.skip": "Zum Inhalt springen",
  "nav.menu.open": "Menü öffnen",
  "nav.menu.close": "Menü schließen",
  "nav.how_it_works": "So funktioniert es",
  "nav.architecture": "Architektur",
  "nav.faq": "FAQ",

  "footer.aria": "Fußzeile",
  "footer.tagline": "Private Mesh-Kommunikation",
  "footer.credit": "© Gemacht mit {heart} von {author}",
  "footer.group.download": "Download",
  "footer.group.resources": "Ressourcen",
  "footer.group.social": "Social",
  "footer.group.legal": "Rechtliches",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Architektur",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "FAQ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Nutzungsbedingungen",
  "footer.link.privacy": "Datenschutzerklärung",
  "footer.link.license": "Projektlizenz",

  "settings.theme.group": "Farbschema",
  "settings.theme.light": "Helles Design",
  "settings.theme.dark": "Dunkles Design",
  "settings.language.label": "Sprache",
  "settings.language.suggestion": "Diese Seite auf Deutsch ansehen",
  "settings.language.dismiss": "Schließen",

  "home.hero.release": "Neueste Version",
  "home.hero.title": "Nachrichten, die ohne Internet funktionieren.",
  "home.hero.body":
    "Handys in der Nähe bilden ein Bluetooth-Mesh und leiten deine Nachrichten über bis zu sieben Hops weiter, Ende-zu-Ende verschlüsselt. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Keine Server",
  "home.hero.body.no_accounts": "keine Konten",
  "home.hero.body.no_tracking": "kein Tracking",
  "home.hero.download": "App herunterladen",
  "home.hero.badges": "MIT-Lizenz · Frei und quelloffen · Funktioniert mit bitchat",
  "home.hero.group.mobile": "Mobil",
  "home.hero.group.desktop": "Desktop",
  "home.hero.option.f_droid": "Open-Source-Katalog",
  "home.hero.option.apk": "Direkter Download",
  "home.hero.option.soon": "Demnächst",

  "home.about.eyebrow": "Was ist Airhop",
  "home.about.title": "Die meisten Apps hängen an einem zentralen Server.",
  "home.about.sub":
    "Ein Server lässt sich überwachen, abschalten oder sperren. Airhop hat keinen, also gibt es keine Firma, die man unter Druck setzen, und keinen Dienst, den man abschalten kann.",
  "home.about.card": "Technischer Überblick",
  "home.about.link.mesh": "Bluetooth-Low-Energy-Mesh",
  "home.about.link.wire_protocol": "Übertragungsprotokoll",
  "home.about.body.built":
    "Airhop ist eine quelloffene iOS- und Android-App für private Peer-to-Peer-Nachrichten über {mesh}. Sie baut auf {bitchat} auf, übernimmt dessen {wire_protocol} und Sicherheitsmodell und erweitert beides um {ecash}-Zahlungen offline und KI offline. Sie funktioniert ganz ohne Internetverbindung, und Nachrichten werden automatisch über Geräte in der Nähe weitergeleitet (etwa 10 bis 30 Meter pro Hop in Gebäuden, im Freien weiter), über bis zu 7 Hops.",
  "home.about.body.identity":
    "Deine Identität ist ein {ed25519}-Schlüsselpaar, das auf deinem Gerät erzeugt und in {ios_keychain} oder {android_keystore} gespeichert wird. Es gibt keine Konten, keine Registrierung und nichts, was einen Server berührt, das heißt, die App lässt sich als Wegwerf-App nutzen, die nach dem Löschen nichts hinterlässt, was auf dich zurückführt.",
  "home.about.body.crypto":
    "Jede Sitzung nutzt das {noise}-Protokoll für einen authentifizierten Handshake. Gespeicherte Nachrichten nutzen den {ratchet}-Algorithmus, das heißt, selbst wenn dein Gerät später kompromittiert wird, bleiben deine früheren Nachrichten unlesbar. Die Notlöschung vernichtet alle Schlüssel und Nachrichten in unter einer Sekunde.",
  "home.about.body.internet":
    "Wenn du und ein Kontakt außerhalb der Bluetooth-Reichweite seid, dienen {nostr}-Relays als Brücke über das Internet, mit gift-wrapped Direktnachrichten im {nip17}-Format. So reicht das Mesh weltweit, sobald ihr beide online seid. {tor} wird ebenfalls unterstützt, sowohl unter iOS (über {arti}) als auch unter Android (über {orbot}).",
  "home.about.optional.title": "Airhop hat optionale Funktionen, die du aktivieren kannst:",
  "home.about.optional.payments.label": "Offline-Zahlungen:",
  "home.about.optional.payments.body":
    "Zahlungen über das Mesh senden und empfangen, mit dem {cashu}-Protokoll (nur Bitcoin).",
  "home.about.optional.ai.label": "Offline-KI:",
  "home.about.optional.ai.body":
    "Ein kleiner KI-Assistent auf dem Gerät, der wichtige Fragen beantworten kann. Verarbeitung und Daten bleiben vollständig auf deinem Gerät.",
  "home.about.body.compatible":
    "Airhop ist auf Protokollebene mit bitchat kompatibel. Ein Airhop-Gerät und ein bitchat-Gerät im selben Mesh finden sich automatisch und können ohne jede Konfiguration Nachrichten und Direktnachrichten austauschen.",

  "home.situations.eyebrow": "Wann du es brauchst",
  "home.situations.title": "Für den Tag, an dem das Netz ausfällt.",
  "home.situations.sub":
    "Naturkatastrophen, Internetsperren, Massenproteste oder ein ganz normales Wochenende außerhalb der Reichweite.",
  "home.situations.disaster.label": "Katastrophe",
  "home.situations.disaster.line":
    "Die Masten sind ausgefallen. Ein Aushang am Brett erreicht jeden, der vorbeikommt.",
  "home.situations.offgrid.label": "Abseits des Netzes",
  "home.situations.offgrid.line":
    "Zwei Tage auf dem Weg. Der letzte Balken ist gestern verschwunden.",
  "home.situations.protest.label": "Protest",
  "home.situations.protest.line":
    "Ein QR-Code auf einem Flyer öffnet einen verschlüsselten Kanal für den Marsch.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Kein Empfang auf dem Gelände. Nachrichten springen über die Handys von Fremden.",

  "home.showcase.eyebrow": "Die App ansehen",
  "home.showcase.title": "Ein ganz normaler Messenger, offline.",
  "home.showcase.sub":
    "Chats, Kanäle, eine Wallet und eine Identität. An der Oberfläche vertraut, mit einem Mesh darunter, das die Arbeit macht.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Alle in Reichweite, angeordnet nach ihrer Nähe. Niemand muss vorher hinzugefügt werden.",
  "home.showcase.mesh.alt":
    "Der Mesh-Bildschirm der Airhop-App mit vier Peers in der Nähe, auf einem Radar nach Signalstärke angeordnet.",
  "home.showcase.chats.title": "Chats",
  "home.showcase.chats.caption":
    "Ganz normale Unterhaltungen. Die Handys, die jede Nachricht weiterreichen, können sie nicht öffnen.",
  "home.showcase.chats.alt":
    "Eine Direktnachricht-Unterhaltung in Airhop während eines Stromausfalls, weitergeleitet über drei Handys.",
  "home.showcase.channels.title": "Kanäle",
  "home.showcase.channels.caption":
    "Öffentliche Räume, so klein wie ein Häuserblock oder so weit wie eine Region, offen für alle vor Ort.",
  "home.showcase.channels.alt":
    "Der Chat-Bildschirm der Airhop-App mit öffentlichen Kanälen für einen Block, ein Viertel, eine Stadt und eine Region.",
  "home.showcase.wallet.title": "Wallet",
  "home.showcase.wallet.caption":
    "Reiche der Person neben dir Ecash über Bluetooth, ohne dass eines der beiden Handys online ist.",
  "home.showcase.wallet.alt":
    "Der Wallet-Bildschirm der Airhop-App mit einem Ecash-Guthaben, das sich über Bluetooth senden lässt.",
  "home.showcase.identity.title": "Identität",
  "home.showcase.identity.caption":
    "Keine Anmeldung, keine Telefonnummer, keine E-Mail. Nur ein Schlüssel, der dieses Handy nie verlässt.",
  "home.showcase.identity.alt":
    "Der Profilbildschirm der Airhop-App mit einer auf dem Gerät erzeugten Identität ohne Konto.",

  "home.how.eyebrow": "So funktioniert es",
  "home.how.title": "Das Mesh bildet sich von selbst.",
  "home.how.sub":
    "Knoten in der Nähe bilden über Bluetooth ein selbstheilendes Mesh. Wenn Internet da ist, erweitern Nostr-Relays es, ohne Infrastruktur, die jemandem gehört.",
  "home.how.cta": "Die vollständige Architektur lesen",
  "home.how.discover.title": "Finden",
  "home.how.discover.line":
    "Handys mit Airhop oder bitchat finden sich automatisch über Bluetooth. Kein Koppeln, kein Einrichten.",
  "home.how.relay.title": "Weiterleiten",
  "home.how.relay.line":
    "Eine Nachricht springt von Handy zu Handy, über bis zu sieben Hops. Die Handys dazwischen sehen nie, was sie transportieren.",
  "home.how.reach.title": "Weiter reichen",
  "home.how.reach.line":
    "Wenn Internet da ist, tragen Nostr-Relays dieselbe Unterhaltung weiter, auf Wunsch über Tor.",
  "home.how.swipe": "wischen zum Erkunden",
  "home.how.diagram": "BLE-Mesh · lokales Peer-to-Peer-Netz",
  "home.how.legend.node": "BLE-Mesh-Knoten (offline)",
  "home.how.legend.relay": "Multi-Hop-Weiterleitung (Noise XX verschlüsselt)",
  "home.how.legend.bitchat": "bitchat-kompatibel im selben Mesh",
  "home.how.legend.nostr": "Nostr-Brücke (Internet, wenn online)",

  "home.map.aria": "Weltkarte der Standorte von Nostr-Relays",
  "home.map.summary": "Nostr-Brücke · {relays} an {locations} weltweit",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Was sie kann",
  "home.features.title": "Ein echter Messenger, keine Demo.",
  "home.features.sub":
    "Chat, Identität, Netzwerk und Geld. Alles gebaut, um ohne Empfang, ohne Konto und ohne etwas dazwischen zu funktionieren.",

  "home.features.messaging.title": "Nachrichten",
  "home.features.messaging.summary":
    "Alles, was ein Messenger hat, mit null Infrastruktur dahinter.",
  "home.features.messaging.dms.name": "Private Direktnachrichten",
  "home.features.messaging.dms.line":
    "Ende-zu-Ende verschlüsselt, mit Zustell- und Lesebestätigung.",
  "home.features.messaging.location.name": "Standortkanäle",
  "home.features.messaging.location.line":
    "Räume, die an einen Ort gebunden sind, von einem Block bis zu einer Region.",
  "home.features.messaging.groups.name": "Private Kanäle und Gruppen",
  "home.features.messaging.groups.line":
    "Einladungslinks für einen Raum oder eine signierte Liste von bis zu 16.",
  "home.features.messaging.board.name": "Schwarzes Brett",
  "home.features.messaging.board.line":
    "Aushänge, die bis zu sieben Tage an ein Gebiet geheftet bleiben.",
  "home.features.messaging.voice.name": "Live-Sprache",
  "home.features.messaging.voice.line":
    "Mikro gedrückt halten und mit allen in Reichweite sprechen, wie mit einem Walkie-Talkie.",
  "home.features.messaging.notes.name": "Sprachnachrichten",
  "home.features.messaging.notes.line":
    "Aufgenommenes Audio, schneller als eine Wegbeschreibung zu tippen.",
  "home.features.messaging.files.name": "Fotos, Video und Dateien",
  "home.features.messaging.files.line": "Jedes Format, bis 1 MiB, ganz ohne Empfang.",
  "home.features.messaging.forward.name": "Store-and-Forward",
  "home.features.messaging.forward.line":
    "Versiegelt und von einem Handy in der Nähe getragen, bis sie ankommt.",

  "home.features.identity.title": "Identität",
  "home.features.identity.summary": "Nichts zu registrieren, nichts zu beschlagnahmen.",
  "home.features.identity.keys.name": "Identität als Schlüsselpaar",
  "home.features.identity.keys.line":
    "Auf diesem Handy erzeugt, im Schlüsselbund des Systems gespeichert.",
  "home.features.identity.names.name": "Lesbare Namen",
  "home.features.identity.names.line":
    "Aus deinem Schlüssel abgeleitet, damit dir niemand deinen wegnehmen kann.",
  "home.features.identity.qr.name": "Kontakte per QR",
  "home.features.identity.qr.line": "Ein Scan überträgt die Schlüssel, nicht nur den Namen.",
  "home.features.identity.panic.name": "Notlöschung",
  "home.features.identity.panic.line":
    "Alle Schlüssel und Nachrichten in unter einer Sekunde vernichtet.",

  "home.features.networking.title": "Netzwerk",
  "home.features.networking.summary": "Die Handys sind das Netz.",
  "home.features.networking.mesh.name": "Bluetooth-Mesh",
  "home.features.networking.mesh.line":
    "Kein Internet, kein Router, auf Handys, die die Leute schon haben.",
  "home.features.networking.bridge.name": "Mesh-Brücke",
  "home.features.networking.bridge.line":
    "Verbindet deinen öffentlichen Chat mit einer Gruppe in der Nähe außerhalb der Reichweite.",
  "home.features.networking.wifi.name": "WiFi-Schnellweg",
  "home.features.networking.wifi.line":
    "Schnellere Übertragungen zwischen zwei Androids oder zwei iPhones.",
  "home.features.networking.bitchat.name": "bitchat-kompatibel",
  "home.features.networking.bitchat.line": "Beide Apps treten ohne Einrichtung demselben Mesh bei.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Eine Erweiterung, nie eine Voraussetzung.",
  "home.features.internet.nostr.name": "Nostr als Rückfallebene",
  "home.features.internet.nostr.line":
    "Direktnachrichten und Standortkanäle laufen auch jenseits der Funkreichweite weiter.",
  "home.features.internet.relays.name": "Geo-Relay-Suche",
  "home.features.internet.relays.line":
    "Über 300 unabhängige öffentliche Relays, keines davon unseres.",
  "home.features.internet.gateway.name": "Internet-Gateway",
  "home.features.internet.gateway.line":
    "Leih deine Verbindung, damit ein Handy in der Nähe ohne Netz Standortkanäle erreicht.",
  "home.features.internet.tor.name": "Tor-Integration",
  "home.features.internet.tor.line":
    "Auf beiden Plattformen geroutet, damit Relays nie deine IP sehen.",

  "home.features.optional.title": "Optional",
  "home.features.optional.summary": "Standardmäßig aus. An, wenn du willst.",
  "home.features.optional.cashu.name": "Cashu-Ecash",
  "home.features.optional.cashu.line":
    "Bezahl die Person neben dir, ohne dass ein Handy online ist.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Über das Lightning-Netzwerk in Bitcoin aufladen oder auszahlen.",
  "home.features.optional.ai.name": "Lokale KI",
  "home.features.optional.ai.line": "Antworten auf dem Gerät, nichts verlässt das Handy.",
  "home.features.optional.social.name": "Social-Brücken",
  "home.features.optional.social.line": "Bluesky und Mastodon mit derselben Identität.",

  "home.compare.eyebrow": "Im Vergleich",
  "home.compare.title": "Offline, ohne Zusatzhardware und offen.",
  "home.compare.sub":
    "Jede App hier kann etwas gut. Nur einige funktionieren noch, wenn das Netz es nicht tut.",
  "home.compare.col.project": "Projekt",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Verschlüsselung",
  "home.compare.col.offline": "Funktioniert offline",
  "home.compare.col.hardware_free": "Ohne Zusatzhardware",
  "home.compare.col.open_source": "Quelloffen",
  "home.compare.mark.yes": "Ja",
  "home.compare.mark.no": "Nein",
  "home.compare.mark.partial": "Teilweise, die Clients sind quelloffen, die Server nicht",
  "home.compare.mark.partial_hint": "Die Clients sind quelloffen, die Server nicht",
  "home.compare.transport.servers": "Zentrale Server",
  "home.compare.transport.onion": "Onion-Routing (Service-Knoten)",
  "home.compare.transport.nostr": "Nostr-Relays",
  "home.compare.transport.lora": "LoRa-Funk",
  "home.compare.transport.sub_ghz": "Proprietärer Sub-GHz-Funk",

  "home.explore.eyebrow": "Offen und ehrlich",
  "home.explore.title": "Jede Aussage hier ist überprüfbar.",
  "home.explore.sub":
    "Code, Protokoll und Pläne sind öffentlich. Die Grenzen auch. Prüf es selbst, bevor du uns glaubst.",
  "home.explore.audit.chip": "Audit ausstehend",
  "home.explore.audit.headline": "Airhop hatte noch kein externes Sicherheitsaudit.",
  "home.explore.audit.body":
    "{headline} Der gesamte Code wird persönlich geprüft und vor der Veröffentlichung durch einen {review} geschickt, und die verwendete Kryptobibliothek ist von Cure53 auditiert, aber das ersetzt kein formales Audit der App selbst. Eines ist für {version} geplant. Verlass dich bis dahin bei sensiblen Anwendungsfällen nicht darauf.",
  "home.explore.audit.link.review": "Sicherheitsprüfungs-Agenten",
  "home.explore.source.title": "Quellcode",
  "home.explore.source.desc":
    "Alles auf GitHub unter MIT. Issues, Pull Requests und Diskussionen offen.",
  "home.explore.protocol.title": "Protokollspezifikation",
  "home.explore.protocol.desc":
    "Das genaue Übertragungsformat, die BLE-UUIDs und die Konstanten, geteilt mit bitchat.",
  "home.explore.architecture.title": "Architektur",
  "home.explore.architecture.desc":
    "Die vollständige technische Aufschlüsselung, vom Tippen auf Senden bis zu den Bytes im Funk.",
  "home.explore.roadmap.title": "Roadmap",
  "home.explore.roadmap.desc":
    "Versionsziele von v0.5.0 bis v2.0.0, einschließlich des geplanten Audits.",
  "home.explore.vision.title": "Vision",
  "home.explore.vision.desc":
    "Warum es Airhop gibt und welche Grundsätze auch unter Druck bleiben.",
  "home.explore.brand.title": "Brand Kit",
  "home.explore.brand.desc":
    "Der Pixelvogel, Farb- und Typo-Tokens, Pressematerial und Textbausteine.",

  "home.contribute.eyebrow": "Dieses Projekt unterstützen",
  "home.contribute.title": "Unabhängig und offen.",
  "home.contribute.sub":
    "Es gibt keine Investoren, keine Werbung und keine Bezahlversion. Alle Funktionen bleiben so oder so kostenlos, und die Arbeit finanzieren die Menschen, die sie nützlich finden.",
  "home.contribute.contribute.chip": "Mitmachen",
  "home.contribute.contribute.body":
    "Gib dem Repository einen Stern, öffne Issues und schick Pull Requests. Fehlerberichte, Funktionsvorschläge und Codebeiträge sind alle willkommen.",
  "home.contribute.contribute.cta": "Auf GitHub ansehen",
  "home.contribute.sponsor.chip": "Sponsern",
  "home.contribute.sponsor.body":
    "Wenn Airhop dir nützt, hilft eine einmalige Spende oder ein regelmäßiges Sponsoring sehr dabei, die Entwicklung am Laufen zu halten.",
  "home.contribute.sponsor.donate": "Einmal spenden",
  "home.contribute.sponsor.github": "Auf GitHub sponsern",

  "page.architecture.eyebrow": "Dokumentation",
  "page.architecture.title": "Architektur",
  "page.architecture.toc": "Auf dieser Seite",

  "page.faq.eyebrow": "FAQ",
  "page.faq.title": "Häufig gestellte Fragen",
  "page.faq.meta": "Häufige Fragen zu Airhop.",
  "page.faq.contact":
    "Fragen, die hier nicht beantwortet werden, kannst du an {email} schicken oder als Diskussion auf {github} stellen.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Demnächst",
  "page.blogs.body": "Texte über Mesh-Netzwerke, Privatsphäre und Offline-First-Software.",

  "page.brand.eyebrow": "Marke",
  "page.brand.title": "Brand Kit",
  "page.brand.meta":
    "Material und Regeln, um Airhop in einem Artikel, einem Store-Eintrag, einem Vortrag oder einer README zu verwenden. Frei nutzbar als Referenz und für die Presse.",

  "page.legal.eyebrow": "Rechtliches",
  "page.privacy.title": "Datenschutzerklärung",
  "page.terms.title": "Nutzungsbedingungen",

  "page.notfound.title": "Seite nicht gefunden",
  "page.notfound.body": "Die gesuchte Seite existiert nicht oder wurde verschoben.",

  "page.english_only": "Diese Seite ist nur auf Englisch verfügbar.",

  "seo.breadcrumb.home": "Startseite",

  "seo.home.title": "Airhop — Privater, offline-first Messenger",
  "seo.home.description":
    "Private Peer-to-Peer-Nachrichten für iOS und Android. Kein Internet, keine Server, keine Konten. Überall über Bluetooth-Mesh kommunizieren.",

  "seo.architecture.title": "Architektur — Airhop",
  "seo.architecture.description":
    "Wie Airhop funktioniert, von oben bis unten: Identität, Transportwahl, das Bluetooth-Mesh, Verschlüsselung, die Internetschicht, Tor, Offline-Ecash, KI auf dem Gerät und das bitchat-kompatible Übertragungsformat.",
  "seo.architecture.breadcrumb": "Architektur",
  "seo.architecture.headline": "Airhop Architektur",
  "seo.architecture.summary":
    "Eine vollständige technische Aufschlüsselung von Airhop: Identität, Transporte, das Bluetooth-Mesh, Verschlüsselung, die Nostr-Internetschicht, Tor, die Cashu-Wallet, der KI-Assistent auf dem Gerät und das Übertragungsformat.",

  "seo.faq.title": "Häufig gestellte Fragen — Airhop",
  "seo.faq.description":
    "Antworten zu Airhops Bluetooth-Mesh-Nachrichten, Verschlüsselung, Offline-Zahlungen, der Nostr-Internetschicht und der bitchat-Kompatibilität.",
  "seo.faq.breadcrumb": "FAQ",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Texte über Mesh-Netzwerke, Privatsphäre und Offline-First-Software.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Brand Kit — Airhop",
  "seo.brand.description":
    "Das Airhop Brand Kit: der Pixelvogel, die Wortmarke, Farb- und Typo-Tokens, Pressematerial und Textbausteine.",
  "seo.brand.breadcrumb": "Brand Kit",

  "seo.privacy.title": "Datenschutzerklärung — Airhop",
  "seo.privacy.description":
    "Wie Airhop mit Daten umgeht: keine Konten, keine Server, kein Tracking. Deine Identität und deine Nachrichten bleiben auf deinem Gerät.",
  "seo.privacy.breadcrumb": "Datenschutzerklärung",

  "seo.terms.title": "Nutzungsbedingungen — Airhop",
  "seo.terms.description": "Bedingungen für die Nutzung der Airhop-App und der Website.",
  "seo.terms.breadcrumb": "Nutzungsbedingungen",

  "seo.notfound.title": "Seite nicht gefunden — Airhop",
  "seo.notfound.description": "Die gesuchte Seite existiert nicht oder wurde verschoben.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} Relay",
    other: "{count} Relays",
  },
  "home.map.locations": {
    one: "{count} Standort",
    other: "{count} Standorten",
  },
};

export const locale: Locale = { strings, plurals };
