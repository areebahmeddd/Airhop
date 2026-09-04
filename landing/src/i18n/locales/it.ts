import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Torna alla home",
  "common.last_updated": "Ultimo aggiornamento: {date}",

  "nav.aria": "Principale",
  "nav.home": "Home di Airhop",
  "nav.skip": "Vai al contenuto",
  "nav.menu.open": "Apri il menu",
  "nav.menu.close": "Chiudi il menu",
  "nav.how_it_works": "Come funziona",
  "nav.architecture": "Architettura",
  "nav.faq": "FAQ",

  "footer.aria": "Piè di pagina",
  "footer.tagline": "Comunicazione mesh privata",
  "footer.credit": "© Fatto con {heart} da {author}",
  "footer.group.download": "Scarica",
  "footer.group.resources": "Risorse",
  "footer.group.social": "Social",
  "footer.group.legal": "Legale",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "Architettura",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "FAQ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Termini di servizio",
  "footer.link.privacy": "Informativa sulla privacy",
  "footer.link.license": "Licenza del progetto",

  "settings.theme.group": "Tema colore",
  "settings.theme.light": "Tema chiaro",
  "settings.theme.dark": "Tema scuro",
  "settings.language.label": "Lingua",
  "settings.language.suggestion": "Vedi questa pagina in italiano",
  "settings.language.dismiss": "Chiudi",

  "home.hero.release": "Ultima versione",
  "home.hero.title": "Messaggistica che funziona senza internet.",
  "home.hero.body":
    "I telefoni vicini formano una rete mesh Bluetooth e inoltrano i tuoi messaggi, cifrati end-to-end. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Nessun server",
  "home.hero.body.no_accounts": "nessun account",
  "home.hero.body.no_tracking": "nessun tracciamento",
  "home.hero.download": "Scarica l'app",
  "home.hero.badges": "Licenza MIT · Libero e open source · Compatibile con bitchat",
  "home.hero.group.mobile": "Mobile",
  "home.hero.group.desktop": "Desktop",
  "home.hero.option.zapstore": "Firmato su Nostr",
  "home.hero.option.apk": "Download diretto",
  "home.hero.option.soon": "Presto disponibile",

  "home.about.eyebrow": "Cos'è Airhop",
  "home.about.title": "Quasi tutte le app dipendono da un server centrale.",
  "home.about.sub":
    "Un server può essere sorvegliato, spento o bloccato. Airhop non ne ha nessuno, quindi non c'è un'azienda da pressare né un servizio da chiudere.",
  "home.about.card": "Panoramica tecnica",
  "home.about.link.mesh": "rete mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protocollo di trasmissione",
  "home.about.body.built":
    "Airhop è un'app open source per iOS e Android per la messaggistica privata peer-to-peer su {mesh}. È costruita sulle fondamenta di {bitchat}, ne riutilizza il {wire_protocol} e il modello di sicurezza, e li estende con pagamenti {ecash} offline e IA offline. Funziona senza alcuna connessione a internet e i messaggi vengono inoltrati automaticamente tra i dispositivi vicini (circa 10-30 metri per salto al chiuso, di più all'aperto), fino a 7 salti.",
  "home.about.body.identity":
    "La tua identità è una coppia di chiavi {ed25519} generata sul tuo dispositivo e conservata in {ios_keychain} o {android_keystore}. Non ci sono account, né registrazioni, né nulla che tocchi un server: si può usare come app usa e getta che, una volta eliminata, non lascia nulla che risalga a te.",
  "home.about.body.crypto":
    "Ogni sessione usa il protocollo {noise} per un handshake autenticato. I messaggi archiviati usano l'algoritmo {ratchet}: anche se il tuo dispositivo venisse compromesso in seguito, i messaggi passati resterebbero illeggibili. La cancellazione d'emergenza distrugge tutte le chiavi e i messaggi in meno di un secondo.",
  "home.about.body.internet":
    "Quando tu e un contatto siete fuori dalla portata del Bluetooth, i relay {nostr} fanno da ponte via internet, con messaggi diretti incartati nel formato {nip17}, così la rete mesh si estende a tutto il mondo ogni volta che siete entrambi online. Il supporto {tor} è disponibile su iOS e Android, tramite {arti}, con bridge {obfs4} e {snowflake} per le reti che bloccano Tor.",
  "home.about.optional.title": "Airhop ha funzioni opzionali che puoi attivare:",
  "home.about.optional.payments.label": "Pagamenti offline:",
  "home.about.optional.payments.body":
    "Invia e ricevi pagamenti sulla rete mesh usando il protocollo {cashu} (solo Bitcoin).",
  "home.about.optional.ai.label": "IA offline:",
  "home.about.optional.ai.body":
    "Un piccolo assistente IA sul dispositivo che risponde a domande importanti. Tutta l'elaborazione e i dati restano sul tuo dispositivo.",
  "home.about.body.compatible":
    "Airhop è compatibile con bitchat a livello di protocollo. Un dispositivo Airhop e uno bitchat sulla stessa rete mesh si scoprono automaticamente e possono scambiare messaggi e messaggi diretti senza alcuna configurazione.",

  "home.situations.eyebrow": "Quando serve",
  "home.situations.title": "Per il giorno in cui la rete cade.",
  "home.situations.sub":
    "Catastrofi naturali, blackout di internet, proteste di massa o un normale fine settimana fuori copertura.",
  "home.situations.disaster.label": "Catastrofe",
  "home.situations.disaster.line":
    "I ripetitori sono fuori uso. Un avviso in bacheca raggiunge chiunque passi di lì.",
  "home.situations.offgrid.label": "Fuori rete",
  "home.situations.offgrid.line":
    "Secondo giorno di cammino. L'ultima tacca di segnale è sparita ieri.",
  "home.situations.protest.label": "Protesta",
  "home.situations.protest.line":
    "Un codice QR su un volantino apre un canale cifrato per il corteo.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Nessun segnale nell'area. I messaggi rimbalzano tra i telefoni di sconosciuti.",

  "home.showcase.eyebrow": "Guarda l'app",
  "home.showcase.title": "Una messaggistica normale, offline.",
  "home.showcase.sub":
    "Chat, canali, un portafoglio e un'identità. Familiare in superficie, con una rete mesh sotto che fa il lavoro.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Tutti quelli a portata, disposti in base a quanto sono vicini. Non serve aggiungere nessuno prima.",
  "home.showcase.mesh.alt":
    "La schermata Mesh dell'app Airhop, con quattro dispositivi vicini disposti su un radar in base alla potenza del segnale.",
  "home.showcase.chats.title": "Chat",
  "home.showcase.chats.caption":
    "Conversazioni normali. I telefoni che passano ogni messaggio non possono aprirlo.",
  "home.showcase.chats.alt":
    "Una conversazione privata in Airhop durante un blackout, inoltrata attraverso tre telefoni.",
  "home.showcase.channels.title": "Canali",
  "home.showcase.channels.caption":
    "Stanze pubbliche piccole come un isolato o ampie come una regione, aperte a chiunque si trovi lì.",
  "home.showcase.channels.alt":
    "La schermata delle chat dell'app Airhop, con canali pubblici delimitati a un isolato, un quartiere, una città e una regione.",
  "home.showcase.wallet.title": "Portafoglio",
  "home.showcase.wallet.caption":
    "Passa ecash a chi ti sta accanto via Bluetooth, senza che nessuno dei due telefoni sia online.",
  "home.showcase.wallet.alt":
    "La schermata del portafoglio dell'app Airhop, con un saldo in ecash che può essere inviato via Bluetooth.",
  "home.showcase.identity.title": "Identità",
  "home.showcase.identity.caption":
    "Nessuna registrazione, nessun numero di telefono, nessuna email. Solo una chiave che non lascia mai questo telefono.",
  "home.showcase.identity.alt":
    "La schermata del profilo dell'app Airhop, con un'identità generata sul dispositivo e senza account.",

  "home.how.eyebrow": "Come funziona",
  "home.how.title": "La rete mesh si forma da sola.",
  "home.how.sub":
    "I nodi vicini formano una rete mesh che si autoripara via Bluetooth. Quando c'è internet, i relay Nostr la estendono, senza infrastrutture controllate da nessuno.",
  "home.how.cta": "Leggi l'architettura completa",
  "home.how.discover.title": "Scoprire",
  "home.how.discover.line":
    "I telefoni con Airhop o bitchat si trovano automaticamente via Bluetooth. Nessun abbinamento, nessuna configurazione.",
  "home.how.relay.title": "Inoltrare",
  "home.how.relay.line":
    "Un messaggio salta da telefono a telefono, fino a sette salti. I telefoni intermedi non vedono mai ciò che trasportano.",
  "home.how.reach.title": "Arrivare più lontano",
  "home.how.reach.line":
    "Quando c'è internet, i relay Nostr portano la stessa conversazione più lontano, volendo passando per Tor.",
  "home.how.swipe": "scorri per esplorare",
  "home.how.diagram": "Rete mesh BLE · rete locale peer-to-peer",
  "home.how.legend.node": "Nodo della rete mesh BLE (offline)",
  "home.how.legend.relay": "Inoltro multi-salto (cifrato Noise XX)",
  "home.how.legend.bitchat": "Compatibile con bitchat sulla stessa rete mesh",
  "home.how.legend.nostr": "Ponte Nostr (internet, quando online)",

  "home.map.aria": "Mappa mondiale delle posizioni dei relay Nostr",
  "home.map.summary": "Ponte Nostr · {relays} in {locations} nel mondo",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Cosa fa",
  "home.features.title": "Una vera app di messaggistica, non una demo.",
  "home.features.sub":
    "Chat, identità, rete e denaro. Tutto costruito per funzionare senza segnale, senza account e senza nulla in mezzo.",

  "home.features.messaging.title": "Messaggistica",
  "home.features.messaging.summary":
    "Tutto quello che ha un'app di messaggistica, con zero infrastruttura dietro.",
  "home.features.messaging.dms.name": "Messaggi diretti privati",
  "home.features.messaging.dms.line": "Cifrati end-to-end, con conferme di consegna e di lettura.",
  "home.features.messaging.location.name": "Canali per luogo",
  "home.features.messaging.location.line": "Stanze legate a un posto, da un isolato a una regione.",
  "home.features.messaging.groups.name": "Canali e gruppi privati",
  "home.features.messaging.groups.line":
    "Link d'invito per una stanza, o un elenco firmato fino a 16 persone.",
  "home.features.messaging.board.name": "Bacheca",
  "home.features.messaging.board.line": "Avvisi affissi a un'area per un massimo di sette giorni.",
  "home.features.messaging.voice.name": "Voce dal vivo",
  "home.features.messaging.voice.line":
    "Tieni premuto il microfono e parla con chiunque sia a portata, come un walkie-talkie.",
  "home.features.messaging.notes.name": "Note vocali",
  "home.features.messaging.notes.line": "Audio registrato, più veloce che scrivere indicazioni.",
  "home.features.messaging.files.name": "Foto, video e file",
  "home.features.messaging.files.line":
    "Qualsiasi formato, fino a 1 MiB, senza bisogno di segnale.",
  "home.features.messaging.forward.name": "Memorizza e inoltra",
  "home.features.messaging.forward.line":
    "Sigillato e trasportato da un telefono vicino finché non arriva a destinazione.",

  "home.features.identity.title": "Identità",
  "home.features.identity.summary": "Niente da registrare, niente da sequestrare.",
  "home.features.identity.keys.name": "Identità a coppia di chiavi",
  "home.features.identity.keys.line":
    "Creata su questo telefono, conservata nel portachiavi del sistema.",
  "home.features.identity.names.name": "Nomi leggibili",
  "home.features.identity.names.line":
    "Derivati dalla tua chiave, così nessuno può prendersi il tuo.",
  "home.features.identity.qr.name": "Contatti via QR",
  "home.features.identity.qr.line": "Una scansione porta le loro chiavi, non solo il nome.",
  "home.features.identity.panic.name": "Cancellazione d'emergenza",
  "home.features.identity.panic.line":
    "Ogni chiave e ogni messaggio distrutti in meno di un secondo.",

  "home.features.networking.title": "Rete",
  "home.features.networking.summary": "I telefoni sono la rete.",
  "home.features.networking.mesh.name": "Rete mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Senza internet, senza router, su telefoni che la gente ha già.",
  "home.features.networking.bridge.name": "Ponte mesh",
  "home.features.networking.bridge.line":
    "Collega la tua chat pubblica a un gruppo vicino fuori portata.",
  "home.features.networking.wifi.name": "Corsia veloce WiFi",
  "home.features.networking.wifi.line": "Trasferimenti più rapidi tra due Android o due iPhone.",
  "home.features.networking.bitchat.name": "Compatibile con bitchat",
  "home.features.networking.bitchat.line":
    "Entrambe le app entrano nella stessa rete mesh senza configurazione.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Un'estensione, mai un requisito.",
  "home.features.internet.nostr.name": "Ripiego su Nostr",
  "home.features.internet.nostr.line":
    "Messaggi diretti e canali per luogo continuano a funzionare oltre la portata radio.",
  "home.features.internet.relays.name": "Scoperta dei geo-relay",
  "home.features.internet.relays.line":
    "Oltre 300 relay pubblici indipendenti, nessuno dei quali è nostro.",
  "home.features.internet.gateway.name": "Gateway internet",
  "home.features.internet.gateway.line":
    "Presta la tua connessione perché un telefono offline vicino raggiunga i canali per luogo.",
  "home.features.internet.tor.name": "Integrazione con Tor",
  "home.features.internet.tor.line":
    "Instradato su entrambe le piattaforme, così i relay non vedono mai il tuo IP.",

  "home.features.optional.title": "Opzionale",
  "home.features.optional.summary": "Disattivato di default. Attivo quando vuoi.",
  "home.features.optional.cashu.name": "Ecash Cashu",
  "home.features.optional.cashu.line":
    "Paga chi ti sta accanto senza che nessun telefono sia online.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Ricarica o preleva in bitcoin sulla rete Lightning.",
  "home.features.optional.ai.name": "IA locale",
  "home.features.optional.ai.line": "Risposte sul dispositivo, niente esce dal telefono.",
  "home.features.optional.social.name": "Ponti social",
  "home.features.optional.social.line": "Bluesky e Mastodon con la stessa identità.",

  "home.compare.eyebrow": "Il confronto",
  "home.compare.title": "Offline, senza hardware e aperta.",
  "home.compare.sub":
    "Ogni app qui è brava in qualcosa. Solo alcune funzionano ancora quando la rete non funziona.",
  "home.compare.col.project": "Progetto",
  "home.compare.col.transport": "Trasporto",
  "home.compare.col.encryption": "Cifratura",
  "home.compare.col.offline": "Funziona offline",
  "home.compare.col.hardware_free": "Senza hardware extra",
  "home.compare.col.open_source": "Open source",
  "home.compare.mark.yes": "Sì",
  "home.compare.mark.no": "No",
  "home.compare.mark.partial": "Parziale, i client sono open source, i server no",
  "home.compare.mark.partial_hint": "I client sono open source, i server no",
  "home.compare.transport.servers": "Server centralizzati",
  "home.compare.transport.onion": "Onion routing (nodi di servizio)",
  "home.compare.transport.nostr": "Relay Nostr",
  "home.compare.transport.lora": "Radio LoRa",
  "home.compare.transport.sub_ghz": "Radio sub-GHz proprietaria",

  "home.explore.eyebrow": "Aperto e onesto",
  "home.explore.title": "Ogni affermazione qui è verificabile.",
  "home.explore.sub":
    "Il codice, il protocollo e i piani sono pubblici. Anche i limiti. Verifica da solo prima di crederci sulla parola.",
  "home.explore.audit.chip": "Audit in attesa",
  "home.explore.audit.headline": "Airhop non ha ancora ricevuto un audit di sicurezza esterno.",
  "home.explore.audit.body":
    "{headline} Tutto il codice viene riletto personalmente e passato attraverso un {review} prima della pubblicazione, e la libreria crittografica che usa è certificata da Cure53, ma questo non sostituisce un audit formale dell'app stessa. Ne è previsto uno per la {version}. Fino ad allora non affidarti all'app per usi sensibili.",
  "home.explore.audit.link.review": "agente di revisione della sicurezza",
  "home.explore.source.title": "Codice sorgente",
  "home.explore.source.desc":
    "Tutto su GitHub con licenza MIT. Issue, pull request e discussioni aperte.",
  "home.explore.protocol.title": "Specifica del protocollo",
  "home.explore.protocol.desc":
    "Il formato di trasmissione esatto, gli UUID BLE e le costanti, condivisi con bitchat.",
  "home.explore.architecture.title": "Architettura",
  "home.explore.architecture.desc":
    "L'analisi tecnica completa, dal tocco su invia ai byte sulla radio.",
  "home.explore.roadmap.title": "Roadmap",
  "home.explore.roadmap.desc":
    "Gli obiettivi di versione dalla v0.5.0 alla v2.0.0, incluso l'audit previsto.",
  "home.explore.vision.title": "Visione",
  "home.explore.vision.desc": "Perché Airhop esiste e i principi che non cambiano sotto pressione.",
  "home.explore.brand.title": "Kit del marchio",
  "home.explore.brand.desc":
    "L'uccellino in pixel, i token di colore e tipografia, i materiali per la stampa e i testi pronti.",

  "home.contribute.eyebrow": "Sostieni questo progetto",
  "home.contribute.title": "Indipendente, e alla luce del sole.",
  "home.contribute.sub":
    "Non ci sono investitori, né pubblicità, né una versione a pagamento. Tutte le funzioni restano gratuite comunque, e il lavoro è finanziato da chi lo trova utile.",
  "home.contribute.contribute.chip": "Contribuire",
  "home.contribute.contribute.body":
    "Metti una stella al repository, apri issue e invia pull request. Segnalazioni di bug, proposte di funzioni e contributi di codice sono tutti benvenuti.",
  "home.contribute.contribute.cta": "Vedi su GitHub",
  "home.contribute.sponsor.chip": "Sponsorizza",
  "home.contribute.sponsor.body":
    "Se Airhop ti è utile, una donazione una tantum o una sponsorizzazione ricorrente aiuta molto a mantenere attivo lo sviluppo.",
  "home.contribute.sponsor.donate": "Dona una volta",
  "home.contribute.sponsor.github": "Sponsorizza su GitHub",

  "page.architecture.eyebrow": "Documentazione",
  "page.architecture.title": "Architettura",
  "page.architecture.toc": "In questa pagina",

  "page.faq.eyebrow": "FAQ",
  "page.faq.title": "Domande frequenti",
  "page.faq.meta": "Domande comuni su Airhop.",
  "page.faq.contact":
    "Le domande senza risposta qui possono essere inviate a {email} o poste aprendo una discussione su {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Presto disponibile",
  "page.blogs.body": "Scritti su reti mesh, privacy e software offline-first.",

  "page.brand.eyebrow": "Marchio",
  "page.brand.title": "Kit del marchio",
  "page.brand.meta":
    "Materiali e regole per usare Airhop in un articolo, una scheda di uno store, una conferenza o un README. Liberi da usare come riferimento e per la stampa.",

  "page.legal.eyebrow": "Legale",
  "page.privacy.title": "Informativa sulla privacy",
  "page.terms.title": "Termini di servizio",

  "page.notfound.title": "Pagina non trovata",
  "page.notfound.body": "La pagina che cerchi non esiste o è stata spostata.",

  "page.english_only": "Questa pagina è disponibile solo in inglese.",

  "seo.breadcrumb.home": "Home",

  "seo.home.title": "Airhop — Messaggistica privata e offline-first",
  "seo.home.description":
    "Messaggistica privata peer-to-peer per iOS e Android. Senza internet, senza server, senza account. Comunica via rete mesh Bluetooth ovunque.",

  "seo.architecture.title": "Architettura — Airhop",
  "seo.architecture.description":
    "Come funziona Airhop dall'alto in basso: identità, scelta del trasporto, rete mesh Bluetooth, cifratura, livello internet, Tor, ecash offline, IA sul dispositivo e formato di trasmissione compatibile con bitchat.",
  "seo.architecture.breadcrumb": "Architettura",
  "seo.architecture.headline": "Architettura di Airhop",
  "seo.architecture.summary":
    "Un'analisi tecnica completa di Airhop: identità, trasporti, rete mesh Bluetooth, cifratura, livello internet Nostr, Tor, portafoglio Cashu, assistente IA sul dispositivo e formato di trasmissione.",

  "seo.faq.title": "Domande frequenti — Airhop",
  "seo.faq.description":
    "Risposte sulla messaggistica mesh Bluetooth di Airhop, la cifratura, i pagamenti offline, il livello internet Nostr e la compatibilità con bitchat.",
  "seo.faq.breadcrumb": "FAQ",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Scritti su reti mesh, privacy e software offline-first.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Kit del marchio — Airhop",
  "seo.brand.description":
    "Il kit del marchio Airhop: l'uccellino in pixel, il logotipo, i token di colore e tipografia, i materiali per la stampa e i testi pronti.",
  "seo.brand.breadcrumb": "Kit del marchio",

  "seo.privacy.title": "Informativa sulla privacy — Airhop",
  "seo.privacy.description":
    "Come Airhop tratta i dati: senza account, senza server, senza tracciamento. La tua identità e i tuoi messaggi restano sul tuo dispositivo.",
  "seo.privacy.breadcrumb": "Informativa sulla privacy",

  "seo.terms.title": "Termini di servizio — Airhop",
  "seo.terms.description": "I termini che regolano l'uso dell'app e del sito Airhop.",
  "seo.terms.breadcrumb": "Termini di servizio",

  "seo.notfound.title": "Pagina non trovata — Airhop",
  "seo.notfound.description": "La pagina che cerchi non esiste o è stata spostata.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} relay",
    other: "{count} relay",
  },
  "home.map.locations": {
    one: "{count} località",
    other: "{count} località",
  },
};

export const locale: Locale = { strings, plurals };
