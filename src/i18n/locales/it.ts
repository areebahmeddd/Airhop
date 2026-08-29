// it: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Annulla",
  "common.done": "Fatto",
  "common.ok": "OK",
  "common.close": "Chiudi",
  "common.back": "Indietro",
  "common.delete": "Elimina",
  "common.remove": "Rimuovi",
  "common.add": "Aggiungi",
  "common.copy": "Copia",
  "common.copied": "Copiato",
  "common.share": "Condividi",
  "common.continue": "Continua",
  "common.try_again": "Riprova",
  "common.settings": "Impostazioni",
  "common.off": "Disattivo",

  // ---- Dates ----
  "format.today": "Oggi",
  "format.yesterday": "Ieri",
  "format.minutes_ago": "{count} min fa",
  "format.hours_ago": "{count} h fa",
  "format.days_ago": "{count} g fa",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Chat",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Portafoglio",
  "nav.tab.profile": "Tu",
  "a11y.tab.new_peers": "{label}, qualcuno di nuovo nelle vicinanze",
  "nav.notifications": "Notifiche",
  "chat.subtab.channels": "Canali",
  "chat.subtab.direct": "Diretti",
  "chat.subtab.dms": "Messaggi diretti",
  "chat.search.placeholder": "Cerca nelle chat…",
  "chat.search.a11y": "Cerca nelle chat e nei messaggi",
  "chat.search.close": "Chiudi la ricerca",
  "chat.search.clear": "Cancella la ricerca",
  "mesh.view.radar": "Vista radar",
  "mesh.view.list": "Vista elenco",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Elenco",

  // ---- Legal document names ----
  "legal.last_updated": "Ultimo aggiornamento: {date}",
  "legal.terms": "Termini di servizio",
  "legal.privacy": "Informativa sulla privacy",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Comunicazione mesh privata",
  "onboarding.welcome.cta": "Inizia",
  "onboarding.welcome.cta_hint": "Accetta i termini qui sotto per continuare",
  "onboarding.welcome.consent_a11y":
    "Accetta i Termini di servizio e l’Informativa sulla privacy",
  "onboarding.welcome.open_terms": "Apri i Termini di servizio",
  "onboarding.welcome.open_privacy": "Apri l’Informativa sulla privacy",
  "onboarding.welcome.consent":
    "Toccando {cta} accetti i nostri {terms} e la nostra {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Creazione della tua identità",
  "onboarding.identity.body":
    "Creazione di una coppia di chiavi Ed25519 su questo dispositivo.\nNulla viene inviato da nessuna parte.",
  "onboarding.identity.failed_heading":
    "Non è stato possibile creare le tue chiavi",
  "onboarding.identity.failed_body":
    "Questo dispositivo non ha permesso ad Airhop di conservarle in modo sicuro. Riprova, oppure riavvia il telefono e riapri Airhop.",
  "onboarding.identity.steps_a11y": "Passaggi: {steps}",
  "onboarding.identity.step.x25519":
    "Creazione della coppia di chiavi statiche X25519",
  "onboarding.identity.step.ed25519":
    "Creazione della coppia di chiavi di firma Ed25519",
  "onboarding.identity.step.keychain":
    "Salvataggio delle chiavi nel portachiavi di sistema",
  "onboarding.identity.step.peer_id": "Derivazione dell’ID peer",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Il tuo nome sulla mesh",
  "onboarding.username.peer_id": "ID peer",
  "onboarding.username.card_a11y":
    "Il tuo nome sulla mesh è {username}. ID peer {peerID}. {props}.",
  "onboarding.username.explanation":
    "Questo nome utente è derivato in modo deterministico dalla tua chiave pubblica. È lo stesso su ogni dispositivo che vede il tuo ID peer.",
  "onboarding.username.cta": "Entra in Airhop",
  "onboarding.username.prop.algorithm": "Algoritmo",
  "onboarding.username.prop.storage": "Archiviazione",
  "onboarding.username.prop.storage_value": "Solo il portachiavi di sistema",
  "onboarding.username.prop.account": "Account necessario",
  "onboarding.username.prop.account_value": "Nessuno",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Benvenuto in Airhop",
  "onboarding.hello.p1":
    "Ciao. Airhop è costruito su bitchat come progetto parallelo indipendente e open source. Non è affiliato né approvato dal progetto bitchat o da permissionless tech: è semplicemente qualcosa che mi piace costruire e condividere con la comunità.",
  "onboarding.hello.p2":
    "Questa è la prima versione per iOS e Android, quindi anche se l’ho provata con degli amici probabilmente incontrerai qualche errore. Se succede, o se hai un’idea per una funzione, mi farebbe piacere saperlo. Apri una segnalazione su {github} oppure scrivimi a {email}.",
  "onboarding.hello.p3":
    "Se Airhop ti è utile, valuta di lasciare una stella su {github} o una recensione su {store}. Aiuta più persone a scoprire il progetto. Grazie per averlo provato!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Prima che il telefono te lo chieda",
  "onboarding.primer.lede":
    "Ecco che cosa fa ciascun permesso, e che cosa non fa.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Trova i dispositivi vicini e inoltra i messaggi tra loro. È così che nasce la mesh, e funziona senza connessione a internet.",
  "onboarding.primer.location.title": "Posizione",
  "onboarding.primer.location.body":
    "Ti colloca nei canali delle zone vicine, dall’isolato alla regione. Airhop non ti traccia mai e non invia la tua posizione precisa fuori dal dispositivo.",
  "onboarding.primer.notifications.title": "Notifiche",
  "onboarding.primer.notifications.body":
    "Ricevi avvisi per i nuovi messaggi anche ad app chiusa. Le notifiche vengono create sul tuo dispositivo, senza alcun server coinvolto.",
  "onboarding.primer.footnote":
    "Puoi dire di no. I messaggi continueranno a viaggiare su internet e potrai cambiare idea più tardi nelle impostazioni.",
  "onboarding.primer.cta_a11y": "Continua alle richieste di permesso",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Accesso al Bluetooth",
  "permission.bluetooth.purpose": "trovare i dispositivi vicini sulla mesh",
  "permission.open_settings": "Apri le impostazioni",
  "permission.not_now": "Non ora",
  "permission.blocked_title": "{label} è disattivato",
  "permission.blocked_body": "Attivalo nelle impostazioni per {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Qualcosa è andato storto",
  "error.boundary.body":
    "Airhop ha incontrato un problema imprevisto e ha dovuto interrompere ciò che stava mostrando.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Canali predefiniti",
  "chat.channels.yours": "I tuoi canali",
  "chat.channels.none": "Ancora nessun canale",
  "chat.channels.none_hint":
    "Tocca {plus} qui sopra per unirti a uno o crearne uno.",
  "chat.channels.none_desc":
    "Ancora nessun canale. Usa il pulsante di aggiunta nell’intestazione per unirti a uno o crearne uno.",
  "chat.channels.show_fewer": "Mostra meno canali predefiniti",
  "chat.channels.show_less": "Mostra meno",
  "chat.channels.info": "Informazioni sul canale",
  "chat.channels.pin": "Fissa il canale",
  "chat.channels.unpin": "Togli il canale dai fissati",
  "chat.channels.mute": "Silenzia il canale",
  "chat.channels.unmute": "Riattiva l’audio del canale",
  "chat.channels.leave": "Lascia il canale",
  "chat.channels.leave_confirm": "Lascia",
  "chat.channels.clear_body":
    "Eliminare tutti i messaggi in {name}? Non si può annullare.",
  "chat.channels.leave_body":
    "Lasciare {name}? Smetterai di ricevere i suoi messaggi e la sua cronologia verrà rimossa da questo dispositivo.",
  "chat.channels.more_options": "Altre opzioni per {name}",
  "chat.channels.teleported_tag": "{level}  ·  teletrasportato",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Svuota la chat",
  "chat.dm.remove_contact": "Rimuovi il contatto",
  "chat.dm.block": "Blocca questo peer",
  "chat.dm.block_confirm": "Blocca",
  "chat.dm.delete": "Elimina la chat",
  "chat.dm.delete_body":
    "Questo toglie la conversazione dal tuo elenco ed elimina i suoi messaggi. Il contatto resta, e un loro nuovo messaggio avvia una chat nuova.",
  "chat.dm.in_range": "nel raggio",
  "chat.dm.row_hint": "Tocca due volte e tieni premuto per altre opzioni",
  "chat.channels.row_hint": "Tocca due volte e tieni premuto per altre opzioni",
  "chat.dm.you_prefix": "Tu:",
  "chat.dm.none": "Nessun messaggio diretto",
  "chat.dm.none_desc":
    "Vai alla scheda Mesh e tocca un peer per avviare un messaggio diretto cifrato.",
  "chat.dm.contact_info": "Informazioni sul contatto",
  "chat.dm.pin": "Fissa la chat",
  "chat.dm.unpin": "Togli la chat dai fissati",
  "chat.dm.mute": "Silenzia la chat",
  "chat.dm.unmute": "Riattiva l’audio della chat",
  "chat.dm.clear_body":
    "Eliminare tutti i messaggi con {name}? Non si può annullare.",
  "chat.dm.remove_contact_body":
    "Rimuovere {name}? Questo elimina la conversazione e dimentica il contatto. Potranno comunque raggiungerti se ti scrivono di nuovo.",
  "chat.dm.block_body":
    "Bloccare {name}? Non li vedrai nella scheda Mesh e non riceverai i loro messaggi, nemmeno se sono nelle vicinanze.",
  "chat.dm.more_options": "Altre opzioni per {name}",
  "chat.dm.remove_contact_short": "Rimuovi il contatto",
  "chat.dm.block_short": "Blocca il contatto",
  "chat.dm.delete_short": "Elimina la chat",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Svuota i messaggi",
  "chat.clear_confirm": "Svuota",
  "chat.group_badge": "Gruppo",
  "chat.more": "Altro",
  "chat.no_messages": "Ancora nessun messaggio",
  "chat.you": "Tu",
  "chat.a11y.channel": "Canale {name}",
  "chat.a11y.group": "Gruppo {name}",
  "chat.a11y.muted": "silenziato",
  "chat.a11y.pinned": "fissato",

  // ---- Chats: start something new ----
  "chat.new.title": "Inizia qualcosa di nuovo",
  "chat.new.channel": "Crea un canale privato",
  "chat.new.channel_label": "Canale privato",
  "chat.new.channel_desc":
    "Una stanza a cui può unirsi chiunque abbia il link. Creane uno, oppure unisciti con un link che ti hanno mandato.",
  "chat.new.group": "Crea un gruppo privato",
  "chat.new.group_label": "Gruppo privato",
  "chat.new.group_desc":
    "Scegli persone precise. Fino a 16. Resta sul Bluetooth.",
  "chat.new.place": "Vai in un luogo tramite geohash",
  "chat.new.place_label": "Vai in un luogo",
  "chat.new.place_desc":
    "Apri il canale di posizione di qualsiasi luogo tramite il suo geohash.",
  "chat.new.reach": "Portata",
  "chat.new.reach_internet": "Raggiunge i membri via Bluetooth e via internet.",
  "chat.new.reach_mesh": "Funziona nel raggio del Bluetooth, non via internet.",
  "chat.new.reach_internet_desc":
    "Raggiunge i membri anche via internet. I relay possono vedere che il canale è attivo, mai i suoi messaggi né chi ne fa parte.",
  "chat.new.reach_mesh_desc":
    "Resta sulla mesh locale. È il più riservato: nulla esce dal raggio del Bluetooth.",
  "chat.new.join_link": "Unisciti a un canale privato con un link di invito",
  "chat.new.back_to_chooser": "Torna alla scelta",
  "chat.new.create_channel": "Crea il canale",
  "chat.new.name_required": "Inserisci prima un nome per il canale",
  "chat.new.name_taken": "Quel nome è già in uso",
  "chat.new.create": "Crea",
  "chat.new.e2ee":
    "Cifrato da un capo all’altro. Solo i membri possono leggere i messaggi.",
  "chat.new.invite_only":
    "Solo su invito. Può unirsi chiunque riceva il link da te. Resta nascosto a tutti gli altri, anche ai peer vicini.",
  "chat.new.name_exists": "Esiste già un canale con questo nome.",
  "chat.new.reach_bluetooth_chip": "Solo Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Unisciti con un link di invito",

  // ---- Chats: join by link ----
  "chat.join.title": "Unisciti con un link",
  "chat.join.not_airhop": "Quello non è un link di Airhop.",
  "chat.join.reach_internet":
    "Raggiunge i membri via Bluetooth e via internet.",
  "chat.join.reach_mesh": "Resta nel raggio del Bluetooth.",
  "chat.join.contact_card":
    "Una scheda contatto. Li aggiunge ai tuoi contatti e apre la chat.",
  "chat.join.unverified": "Non è stato possibile verificare quel link",
  "chat.join.unverified_body":
    "La scheda contatto non corrisponde alle proprie chiavi, quindi non è stata aggiunta. Chiedi di mandartene una nuova.",
  "chat.join.paste": "Incolla dagli appunti",
  "chat.join.join": "Unisciti",
  "chat.join.public_channel":
    "Canale pubblico {name}. Può leggerlo chiunque sia nelle vicinanze.",
  "chat.join.private_channel": "Canale privato {name}. {reach}",
  "chat.join.dm_with": "Messaggio diretto con {name}.",
  "chat.join.joined_as": "Ti sei unito come {name}",
  "chat.join.name_clash_body":
    "Sei già in un altro {name}. I nomi dei canali sono solo etichette, quindi questo invito ha aperto un canale a sé e quello in cui eri resta intatto. Puoi rinominarne uno qualsiasi dalle sue informazioni di canale.",
  "chat.join.paste_hint":
    "Incolla un invito che inizia con airhop://. Anche toccarne uno funziona; questo serve per un link che non puoi toccare.",
  "chat.join.key_note":
    "L’invito a un canale privato porta con sé la chiave, quindi l’ingresso è immediato e a nessun altro viene chiesto nulla.",
  "chat.join.offline_note":
    "Funziona offline. Il link viene letto su questo dispositivo, e il canale arriva fin dove l’ha impostato chi l’ha creato.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Non è stato possibile aprire quella cella. Riprova tra un momento.",
  "chat.jump.title": "Vai in un luogo",
  "chat.jump.saved": "LUOGHI SALVATI",
  "chat.jump.anywhere":
    "Apri il canale di posizione pubblico di qualsiasi luogo, anche di uno in cui non sei.",
  "chat.jump.geohash_note":
    "Inserisci il suo geohash. Chiunque si trovi in quella cella condivide il canale.",
  "chat.jump.teleport_note":
    "Risulti teletrasportato, non nelle vicinanze. Arriva solo via internet.",
  "chat.jump.level_cell": "Cella di livello {level}",
  "chat.jump.already_here": "Sei già qui. Vai apre il tuo canale {name}.",
  "chat.jump.open_direction": "Apri la cella a {direction}",
  "chat.jump.open_place": "Apri {name}",
  "chat.jump.remove_place": "Rimuovi {name} dai luoghi salvati",
  "chat.jump.go": "Vai",
  "chat.jump.how":
    "Per trovare un geohash: apri un canale di posizione > tocca il suo nome > copialo da lì.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Non è stato possibile raggiungere tutti i membri. Riprova quando sono nelle vicinanze.",
  "chat.group.you_were_added": "Sei stato aggiunto a {name}.",
  "chat.group.added_you": "Ti ha aggiunto a {name}",
  "chat.group.you_were_removed":
    "Sei stato rimosso da {name}. Qui non puoi più leggere né inviare messaggi.",
  "chat.group.removed_you": "Ti ha rimosso da {name}",
  "chat.group.add_failed": "Non è stato possibile aggiungerli",
  "chat.group.add_failed_body":
    "Non è cambiato nulla. O non sono raggiungibili adesso, o il gruppo è pieno con 16 membri, oppure non sei tu ad averlo creato.",
  "chat.group.remove_failed": "Non è stato possibile rimuoverli",
  "chat.group.remove_failed_body":
    "Non è cambiato nulla. Solo chi ha creato il gruppo può cambiarne i membri.",
  "chat.group.e2ee":
    "Cifrato da un capo all’altro. Solo i membri possono leggere i messaggi.",
  "chat.group.cap":
    "Fino a 16 persone, scelte da te. Non c’è un link di invito, quindi nessuno entra perché gliel’hanno inoltrato.",
  "chat.group.bluetooth":
    "Solo Bluetooth. I membri fuori portata ricevono i messaggi quando tornano.",
  "chat.group.members_label": "MEMBRI",
  "chat.group.none_in_range":
    "Non c’è nessuno nel raggio. I membri devono essere vicini quando crei il gruppo.",
  "chat.group.create_title": "Crea un gruppo",
  "chat.group.name_placeholder": "Nome del gruppo",
  "chat.group.create": "Crea",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Mesh locale · solo Bluetooth",
  "chat.scope.mesh_desc":
    "Raggiunge i dispositivi nel raggio del Bluetooth (grosso modo da 10 a 100 metri). Non serve internet. Ideale per coordinarsi sul posto.",
  "chat.scope.block": "Isolato · ~100 m",
  "chat.scope.block_desc":
    "Copertura a livello di isolato. I messaggi passano anche da internet così possono partecipare i peer vicini ma fuori dal raggio del Bluetooth.",
  "chat.scope.neighborhood": "Quartiere · ~1 km",
  "chat.scope.neighborhood_desc":
    "Copertura di quartiere. Con l’aiuto dei relay si raggiungono i peer di tutta la zona anche senza un collegamento Bluetooth diretto.",
  "chat.scope.city": "Città · ~10 km",
  "chat.scope.city_desc":
    "Canale per tutta la città. Usa relay internet geolocalizzati per raggiungere i peer dell’intera area metropolitana.",
  "chat.scope.province": "Provincia o regione · ~100 km",
  "chat.scope.province_desc":
    "Copertura provinciale o regionale. Collegata via internet per una portata di centinaia di chilometri.",
  "chat.scope.country": "Paese o area · ~1000 km",
  "chat.scope.country_desc":
    "Copertura nazionale. Qualsiasi utente di Airhop o bitchat nella zona può unirsi e leggere i messaggi.",
  "chat.transport.bluetooth": "Solo Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Solo internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Comando /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Manda un abbraccio",
  "chat.cmd.slap_hint": "Dai uno schiaffo con una grossa trota",
  "chat.status.sending": "Invio…",
  "chat.status.undo_send": "Annulla l’invio",
  "chat.status.undo": "Annulla",
  "chat.status.sent": "Inviato",
  "chat.status.received": "Ricevuto",
  "chat.status.failed": "Non riuscito",
  "chat.status.canceled": "Annullato",
  "chat.status.waiting": "In attesa",
  "chat.status.sending_short": "Invio",
  "chat.status.receiving": "Ricezione",
  "chat.thread.not_available": "Non disponibile qui",
  "chat.thread.private_channel": "Canale privato",
  "chat.thread.location_channel": "Canale di posizione",
  "chat.thread.public_channel": "Canale pubblico",
  "chat.thread.notices": "Avvisi di questo canale",
  "chat.thread.invite": "Invita qualcuno in questo canale",
  "chat.thread.not_in_range":
    "Fuori dal raggio del Bluetooth. Consegna via internet.",
  "chat.thread.not_nearby":
    "Non è nelle vicinanze. Consegneremo quando torna nel raggio o va online.",
  "chat.thread.no_keys":
    "Per scrivergli dovrai essere nel raggio del Bluetooth, oppure scansionare il suo codice.",
  "chat.geo.card_received":
    "{name} ha condiviso il proprio contatto. Condividi il tuo per continuare a parlare dopo che uno di voi due si sposta.",
  "chat.geo.exchange_complete":
    "Contatti scambiati. Ora potete raggiungervi da ovunque.",
  "chat.geo.keep_person": "Conserva questa persona",
  "chat.geo.keep_person_desc":
    "Condividi il tuo contatto per continuare a parlare dopo che uno di voi due si sposta. Conosceranno la tua identità permanente.",
  "chat.geo.card_sent": "Condiviso · in attesa del suo",
  "chat.thread.left_cell":
    "Hai lasciato questa zona, quindi qui non possono raggiungerti. Scambiatevi i codici per continuare a parlare da ovunque.",
  "chat.thread.no_route":
    "Al momento non si riesce a raggiungerli. Il messaggio partirà quando ci sarà un percorso disponibile.",
  "chat.thread.empty": "Ancora nessun messaggio",
  "chat.thread.empty_desc": "Avvia una conversazione cifrata.",
  "chat.thread.jump_latest": "Vai all’ultimo messaggio",
  "chat.thread.back_to_members": "Torna ai membri",
  "chat.thread.nostr_key": "Chiave pubblica Nostr",
  "chat.thread.in_range": "Nel raggio",
  "chat.voice.not_recorded": "La nota vocale non è stata registrata",
  "chat.thread.message": "Messaggio",
  "chat.thread.message_placeholder": "Messaggio…",
  "chat.thread.length_full": "Il messaggio è pieno",
  "chat.thread.waiting_for": "In attesa del ritorno di {name} · {percent}%",
  "chat.thread.peer": "peer",
  "chat.thread.cancel_transfer": "Annulla {name}",
  "chat.thread.queued_more": "Altri {count} in attesa di partire",
  "chat.thread.across_bridge": "{count} dall’altra parte del ponte",
  "chat.thread.bridged": "via ponte",
  "chat.thread.invite_body":
    "Raggiungimi in {channel} su Airhop — messaggistica mesh privata, pensata prima di tutto per l’offline.",
  "chat.thread.go_back_unread": "Torna indietro, {count} non letti",
  "chat.thread.view_info": "Vedi le informazioni di {name}",
  "chat.thread.notices_new": "Avvisi di questo canale, {count} nuovi",
  "chat.thread.say_something": "Di’ qualcosa in {channel}.",
  "chat.thread.jump_latest_new": "Vai all’ultimo messaggio, {count} nuovi",
  "chat.thread.unconfirmed_since": "Nessuna consegna confermata dal {date}",
  "chat.thread.no_reach":
    "Nessun peer nelle vicinanze · finora non l’ha ricevuto nessuno",
  "chat.thread.channel_needs_internet":
    "Internet disattivato · questo canale raggiunge solo chi è nel raggio del Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet disattivato · questa cella è raggiungibile solo via internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet disattivato · questa conversazione viaggia solo via internet",
  "chat.thread.via_gateway":
    "Internet disattivato · un dispositivo vicino lo sta portando online per te",
  "chat.thread.group_queued":
    "Nessuno di questo gruppo è ancora nelle vicinanze. Arriverà loro quando lo saranno.",
  "chat.thread.no_group_key":
    "Non fai più parte di questo gruppo, quindi non si può inviare",
  "chat.thread.no_reach_offline":
    "Internet disattivato e nessun peer nelle vicinanze · finora non l’ha ricevuto nessuno",
  "chat.thread.mention": "Menziona {name}",
  "chat.thread.someone_talking": "{hold}. {name} sta parlando.",
  "chat.thread.attach_note":
    "I file partono solo nel raggio del Bluetooth. Testo e pagamenti raggiungono i contatti via internet; gli allegati no.",
  "chat.thread.message_peer": "Scrivi a {name}",
  "chat.thread.send": "Invia il messaggio",
  "chat.thread.group": "Gruppo",
  "chat.bridge.nearby_only":
    "Solo vicino: tieni questo messaggio fuori dal ponte mesh",
  "chat.bridge.nearby_label": "Solo vicino · resta sul Bluetooth",
  "chat.bridge.bridging_label":
    "Collegamento con le zone vicine · tocca per solo vicino",
  "chat.screenshot.you_took": "Hai fatto uno screenshot",
  "chat.screenshot.you_took_private":
    "Hai fatto uno screenshot · nessuno è stato avvisato",
  "chat.screenshot.heads_up": "Attenzione",
  "chat.screenshot.notice": "* {name} ha fatto uno screenshot *",
  "chat.screenshot.notified_dm":
    "{name} è stato avvisato che hai fatto uno screenshot di questa conversazione.",
  "chat.screenshot.notified":
    "Tutti in questo canale sono stati avvisati che hai fatto uno screenshot.",
  "chat.screenshot.not_notified":
    "Nessuno è stato avvisato. Questo canale è pubblico, quindi annunciare uno screenshot avrebbe lasciato traccia del fatto che eri qui.",
  "chat.thread.error": "Errore",
  "chat.thread.go_back": "Torna indietro",
  "chat.bubble.via_bridge": "tramite il ponte mesh",
  "chat.bubble.view_profile": "Vedi il profilo di {name}",
  "chat.bubble.forwarded": "Inoltrato",
  "chat.bubble.attachment": "allegato",
  "chat.bubble.a11y": "{sender}: {body}. Tieni premuto per altre opzioni.",
  "chat.bubble.failed_retry": "Invio non riuscito. Tocca per riprovare.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Informazioni sul messaggio",
  "chat.info.delivered_to": "Consegnato a {name}",
  "chat.info.read_by": "Letto da {name}",
  "chat.info.group_reach_desc":
    "Raggiungibili ora, non è una conferma di consegna",
  "chat.info.group_alone": "Nessun altro membro",
  "chat.info.today_at": "Oggi alle {time}",
  "chat.info.sending": "Invio…",
  "chat.info.failed": "Invio non riuscito",
  "chat.info.courier": "Trasportato da un amico",
  "chat.info.sent": "Inviato",
  "chat.info.queued": "In attesa di partire",
  "chat.info.waiting": "In attesa…",
  "chat.action.info": "Informazioni sul messaggio",
  "chat.action.save_photos": "Salva nelle foto",
  "chat.action.save_copy": "Salva una copia",
  "chat.action.forward": "Inoltra",
  "chat.action.select": "Seleziona",
  "chat.select.cancel": "Annulla la selezione",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Fotocamera",
  "chat.attach.camera_desc": "Scatta una foto o registra un video",
  "chat.attach.library": "Galleria foto",
  "chat.attach.library_desc": "Scegli dalla tua galleria",
  "chat.attach.document": "Documento",
  "chat.attach.document_desc": "Invia qualsiasi file o PDF",
  "chat.attach.voice": "Nota vocale",
  "chat.attach.voice_desc": "Registra e invia un messaggio vocale",
  "chat.attach.ecash": "Invia ecash",
  "chat.attach.ecash_desc": "Invia sats Cashu dal tuo portafoglio",
  "chat.attach.location": "Posizione",
  "chat.attach.location_desc": "Invia dove ti trovi adesso",
  "chat.attach.title": "Allega",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Ha condiviso una posizione",
  "chat.location.received_summary": "Ha condiviso la sua posizione",
  "chat.location.title": "Posizione",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Rilevata {ago} fa",
  "chat.location.open_maps": "Apri in Maps",
  "chat.location.no_forward": "Le posizioni non si inoltrano",
  "chat.location.no_forward_body":
    "Una posizione si invia a una sola persona. Condividi la tua se vuoi che l’abbia anche qualcun altro.",
  "chat.location.no_fix": "Consenti la posizione per vedere quanto dista",
  "chat.location.send_title": "Invia la tua posizione",
  "chat.location.send_body":
    "{name} vedrà un solo punto: dove ti trovi adesso. Non continua ad aggiornarsi.",
  "chat.location.send": "Invia la posizione",
  "chat.location.finding": "Ricerca della tua posizione…",
  "chat.location.no_location":
    "Non è stato possibile ottenere la tua posizione",
  "chat.location.no_location_body":
    "Consenti l’accesso alla posizione e verifica che i servizi di localizzazione siano attivi, poi riprova.",
  "chat.location.not_delivered":
    "Non è stato possibile inviare la tua posizione",
  "chat.location.not_delivered_body":
    "Una posizione vale la pena di essere inviata solo finché è attuale, quindi non viene messa in coda per dopo. Riprova quando {name} sarà raggiungibile.",
  "chat.location.direction.n": "a nord",
  "chat.location.direction.ne": "a nord-est",
  "chat.location.direction.e": "a est",
  "chat.location.direction.se": "a sud-est",
  "chat.location.direction.s": "a sud",
  "chat.location.direction.sw": "a sud-ovest",
  "chat.location.direction.w": "a ovest",
  "chat.location.direction.nw": "a nord-ovest",
  "chat.attach.send_anyway": "Invia comunque",
  "chat.attach.bitchat_too_big": "Potrebbe non arrivare",
  "chat.attach.bitchat_too_big_body":
    "{name} usa bitchat, che si arrende a metà strada con i file grandi. Sotto i 350 KiB circa è affidabile. Inviarlo a un contatto Airhop non ha questo limite.",
  "chat.attach.bitchat_unopenable": "Potrebbero non riuscire ad aprirlo",
  "chat.attach.bitchat_unopenable_body":
    "{name} usa bitchat, che mostra foto e note vocali ma elenca tutto il resto come un file che non riesce ad aprire. Arriverà, solo che forse non potranno vederlo.",
  "chat.attach.file": "Allega un file",
  "chat.attach.unavailable": "Qui gli allegati non sono disponibili",
  "chat.attach.not_sent": "Allegato non inviato",
  "chat.attach.read_failed":
    "Qualcosa è andato storto nella lettura di quel file. Provane un altro.",
  "chat.attach.caption": "Aggiungi una didascalia…",
  "chat.attach.send": "Invia l’allegato",
  "chat.attach.generic": "Allegato",
  "chat.media.view_full": "Vedi la foto a schermo intero",
  "chat.media.gone_photo": "La foto non è su questo dispositivo",
  "chat.media.gone_video": "Il video non è su questo dispositivo",
  "chat.media.gone_voice": "La nota vocale non è su questo dispositivo",
  "chat.media.gone_file": "Il file non è su questo dispositivo",
  "chat.media.gone_note":
    "Rimosso dopo 7 giorni o allo svuotamento della cache",
  "chat.media.ask_resend": "Chiedi di nuovo",
  "chat.media.resend_draft": "Puoi rimandarmi {kind}?",
  "chat.media.kind_photo": "quella foto",
  "chat.media.kind_video": "quel video",
  "chat.media.kind_voice": "quella nota vocale",
  "chat.media.kind_file": "quel file",
  "chat.media.pause_voice": "Metti in pausa la nota vocale",
  "chat.media.play_voice": "Riproduci la nota vocale",
  "chat.media.voice_position": "Posizione nella nota vocale",
  "chat.media.voice_scrub": "Tocca lungo le barre per saltare a quel punto",
  "chat.media.image": "Immagine",
  "chat.media.tap_load_photo": "Tocca per caricare la foto",
  "chat.media.open_document": "Apri {name}",
  "chat.media.document": "documento",
  "chat.media.tap_load_video": "Tocca per caricare il video",
  "chat.media.video": "Video",
  "chat.media.photo": "Foto",
  "chat.media.close_photo": "Chiudi la foto",
  "chat.media.save_photo": "Salva la foto nelle tue foto",
  "chat.media.share_photo": "Condividi la foto",
  "chat.media.saved_videos": "Salvato nei tuoi video",
  "chat.media.saved_photos": "Salvato nelle tue foto",
  "chat.media.not_saved": "Non salvato",
  "chat.media.cant_open": "Non si riesce ad aprire il file",
  "chat.media.no_app":
    "Questo dispositivo non ha un’app per aprire o condividere questo file.",
  "chat.media.open_failed":
    "Non è stato possibile aprire il file. Potrebbe essere stato svuotato dalla cache.",
  "media.blocked.nostr_only":
    "Conosci questa persona solo tramite un relay. È disponibile solo il testo. Foto, file e note vocali richiedono il Bluetooth.",
  "media.blocked.private_channel":
    "Un allegato in broadcast è firmato ma non cifrato, quindi inviarlo in un canale privato lo lascerebbe in chiaro mentre il testo qui resta cifrato.",
  "media.blocked.private_group":
    "Un allegato in broadcast è firmato ma non cifrato, quindi inviarlo in un gruppo privato lo lascerebbe in chiaro mentre il testo qui resta cifrato.",
  "media.blocked.location_channel":
    "Un canale di posizione raggiunge le persone via internet, mentre foto, file e note vocali viaggiano via Bluetooth, quindi non arriverebbero mai.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Qui le note vocali non sono disponibili",
  "chat.voice.hold_live": "Tieni premuto per parlare in diretta",
  "chat.voice.hold_record": "Tieni premuto per registrare una nota vocale",
  "chat.voice.cancel_recording": "Annulla la registrazione",
  "chat.voice.slide_cancel": "Scorri per annullare",
  "chat.voice.release_cancel": "Rilascia per annullare",
  "chat.voice.a11y_toggle":
    "Tocca due volte per iniziare o smettere di parlare.",
  "chat.voice.limit_reached":
    "Raggiunto il limite di due minuti, rilascia per inviare",
  "chat.voice.limit_sent": "Raggiunto il limite di due minuti, nota inviata",
  "chat.voice.stop_send": "Interrompi la registrazione e invia",
  "chat.voice.lift_lock": "Scorri verso l’alto per registrare a mani libere",
  "chat.voice.live_speaking": "{name} sta parlando",
  "voice.unavailable": "Voce in diretta non disponibile",
  "voice.recording_stopped": "Registrazione interrotta",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Accesso alla fotocamera",
  "chat.perm.camera_purpose": "scattare una foto da inviare",
  "chat.perm.photo_label": "Accesso alle foto",
  "chat.perm.photo_purpose": "scegliere una foto o un video da inviare",
  "chat.perm.photo_save_purpose": "salvare questo nelle tue foto",
  "chat.perm.mic_label": "Accesso al microfono",
  "chat.perm.mic_live_purpose": "parlare con chi è nelle vicinanze",
  "chat.perm.mic_note_purpose": "registrare una nota vocale",
  "chat.perm.recording_stopped": "Registrazione interrotta",
  "chat.perm.record_failed":
    "Non è stato possibile avviare la registrazione. Controlla i permessi del microfono.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Riscosso",
  "chat.ecash.reclaimed": "Recuperato",
  "chat.ecash.claiming": "Riscossione…",
  "chat.ecash.claim": "Riscuoti",
  "chat.ecash.claim_amount": "Riscuoti {amount} {unit}",
  "chat.ecash.already_claimed": "Già riscosso",
  "chat.ecash.already_claimed_body":
    "Ogni prova di questo token è già nel tuo portafoglio, quindi non è stato aggiunto nulla.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Affidato alla mesh perché faccia del suo meglio per consegnarlo",
  "chat.info.queued_desc":
    "Trattenuto su questo telefono finché non c’è un percorso fino a loro",
  "chat.info.reclaimed": "Recuperato",
  "chat.info.reclaimed_desc":
    "Hai riportato questo pagamento nel tuo portafoglio, quindi non verrà consegnato",
  "chat.info.about": "Informazioni",
  "chat.info.group_desc":
    "Un gruppo privato. Possono leggerlo solo i membri aggiunti da chi l’ha creato, e resta sul Bluetooth.",
  "chat.info.teleported_desc":
    "Un canale di posizione pubblico per questa cella geohash. Chiunque si trovi nella cella, con Airhop o con bitchat, lo condivide via internet. Sei teletrasportato, non fisicamente qui.",
  "chat.info.custom_desc":
    "Un canale personalizzato. Chiunque conosca il nome può unirsi da qualsiasi dispositivo con Airhop o bitchat.",
  "chat.info.private_e2ee": "Privato · cifrato da un capo all’altro",
  "chat.info.public_plain": "Pubblico · non cifrato",
  "chat.info.group_privacy":
    "Solo i membri elencati qui sotto possono leggere questo gruppo. I messaggi restano sul Bluetooth, quindi i membri fuori portata li ricevono al ritorno.",
  "chat.info.teleport_privacy":
    "Un luogo in cui ti sei teletrasportato. Raggiunge tutti quelli in questa cella via internet, e nessuno nel raggio del Bluetooth.",
  "chat.info.location_off_privacy":
    "La posizione è disattivata, quindi questo canale raggiunge i dispositivi vicini solo via Bluetooth. Attivala per raggiungere la sua cella di zona via internet.",
  "chat.info.invite_privacy":
    "Possono leggerlo solo le persone che inviti tramite il link. Resta nascosto a tutti gli altri, anche ai peer vicini.",
  "chat.info.public_privacy":
    "Chiunque si unisca può leggere ogni messaggio. Per parlare in privato usa un messaggio diretto; i messaggi diretti sono cifrati da un capo all’altro.",
  "chat.info.remove_member": "Rimuovi il membro",
  "chat.info.remove_member_body":
    "Rimuovere {name} dal gruppo? La chiave del gruppo ruota, così non potrà più leggere i nuovi messaggi.",
  "chat.info.message_member": "Scrivi a {name}",
  "chat.info.remove_member_a11y": "Rimuovi {name}",
  "chat.info.no_addable":
    "Nessun peer raggiungibile da aggiungere. I membri devono essere nelle vicinanze.",
  "chat.info.add_count": "Aggiungi {count}",
  "chat.info.teleported_tag": "{level}  ·  teletrasportato",
  "chat.info.active": "Attivo",
  "chat.info.members": "Membri",
  "chat.info.bookmark": "Salva questo luogo",
  "chat.info.remove_bookmark": "Togli dai salvati",
  "chat.info.default_notice":
    "Dai canali predefiniti non si può uscire. Fanno parte del protocollo mesh di Airhop.",
  "chat.info.custom_channel": "Canale personalizzato",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Copia il geohash",
  "chat.info.relays": "Relay",
  "chat.info.show_relays": "Mostra i relay che trasportano questo canale",
  "chat.info.relay_custom": "personalizzato",
  "chat.info.relays_none": "Nessuno. Al momento questa cella è solo Bluetooth.",
  "chat.info.search_members": "Cerca tra i membri",
  "chat.info.search_members_placeholder": "Cerca tra i membri…",
  "chat.info.teleported": "Teletrasportato",
  "chat.info.creator": "Creatore",
  "chat.info.no_matches": "Nessun risultato",
  "chat.info.no_one_here": "Ancora nessuno qui",
  "chat.info.add_members": "Aggiungi membri",
  "chat.info.add_selected": "Aggiungi i membri selezionati",
  "chat.info.add": "Aggiungi",
  "chat.info.leave_group": "Lascia il gruppo",
  "chat.info.leave_channel": "Lascia il canale",
  "chat.info.leave": "Lascia",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Vi scrivete dal {date}",
  "chat.contact.verified_since": "Verificato dal {date}",
  "chat.contact.anonymous": "Anonimo",
  "chat.contact.anonymous_desc":
    "Uno pseudonimo geohash senza un’identità duratura da verificare",
  "chat.contact.verified": "Verificato",
  "chat.contact.verified_desc": "Hai scansionato il suo codice QR",
  "chat.contact.verified_desc_compared": "Avete confrontato i codici",
  "chat.contact.not_verified": "Non verificato",
  "chat.contact.not_verified_desc":
    "Scansiona il suo codice, o confrontatene uno durante una chiamata, per confermare che sia davvero lui",
  "chat.contact.e2ee": "Cifrato da un capo all’altro",
  "chat.contact.e2ee_nostr":
    "Impacchettato con NIP-17, così i relay non possono leggerlo",
  "chat.contact.e2ee_mesh":
    "Noise XX, più Double Ratchet tra dispositivi Airhop",
  "chat.contact.copy_nostr": "Copia la chiave pubblica Nostr",
  "chat.contact.nostr_key": "Chiave pubblica Nostr",
  "chat.contact.cell_key_note":
    "Questa chiave appartiene alla zona in cui vi siete conosciuti. Cambia se uno di voi due si sposta, e la conversazione finisce con essa. Scambiatevi i contatti per continuare a parlare da ovunque.",
  "chat.contact.peer_name": "Nome del peer",
  "chat.contact.peer_id": "ID peer",
  "chat.contact.rename": "Rinomina",
  "chat.contact.rename_needs_contact":
    "Puoi rinominare le persone di cui possiedi le chiavi. Scambiatevi prima le schede contatto, poi questo diventa un nome che vedi solo tu.",
  "chat.contact.rename_needs_keys":
    "Non ci sono ancora chiavi per questo contatto. Scrivigli, oppure scansiona il suo codice, e potrai dargli un nome che vedi solo tu.",
  "chat.contact.renamed_by_you": "Il nome che gli hai dato",
  "chat.contact.copy_peer_id": "Copia l’ID peer",
  "chat.contact.verify": "Verifica il contatto",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Avvisi",
  "chat.notices.post_area": "Pubblica un avviso in questa zona",
  "chat.notices.post_mesh": "Pubblica un avviso sulla mesh",
  "chat.notices.mark_urgent": "Segna come urgente",
  "chat.notices.post": "Pubblica l’avviso",
  "chat.notices.post_short": "Pubblica",
  "chat.notices.delete": "Elimina l’avviso",
  "chat.notices.just_now": "proprio ora",
  "chat.notices.fades_soon": "svanisce presto",
  "chat.notices.1_day": "1 giorno",
  "chat.notices.3_days": "3 giorni",
  "chat.notices.7_days": "7 giorni",
  "chat.notices.fading": "in dissolvenza",
  "chat.notices.fades_in_hours": "svanisce tra {count} h",
  "chat.notices.fades_in_days": "svanisce tra {count} g",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Urgente",
  "chat.notices.permanent_warning":
    "Non svanisce mai. È pubblico, legato a questa zona, e non puoi ritirarlo.",
  "chat.notices.none":
    "Ancora nessun avviso. Pubblicane uno perché resti qui per gli altri.",

  // ---- Chats: search results ----
  "chat.search.photos": "Foto",
  "chat.search.videos": "Video",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Documenti",
  "chat.search.links": "Link",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filtra per {filter}",
  "chat.search.no_matches": "Nessun {filter} corrisponde a «{query}»",
  "chat.search.no_media": "Ancora nessun {filter}",
  "chat.search.result_a11y": "{chat}, {kind} da {sender}",
  "chat.search.you": "tu",
  "chat.search.section_chats": "Chat",
  "chat.search.section_messages": "Messaggi",
  "chat.search.section_notices": "Avvisi",
  "chat.search.hint":
    "Cerca tra messaggi e chat, oppure scegli un filtro qui sopra.",
  "chat.search.no_results": "Nessun risultato per «{query}»",
  "chat.search.open_chat": "Apri {name}",
  "chat.search.message_a11y": "{chat}, messaggio da {sender}: {snippet}",
  "chat.search.notice_a11y": "Avviso in {chat} da {author}: {snippet}",
  "chat.search.urgent": "Urgente ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "In questo elenco ce ne sono {count}. Svuotarlo le toglie solo da qui, e i messaggi restano non letti nelle rispettive conversazioni. Segnare tutto come letto libera entrambi.",
  "chat.notif.mark_all_read": "Segna tutto come letto",
  "chat.notif.clear_list": "Svuota l’elenco",
  "chat.notif.clear_all_a11y": "Svuota tutte le {count} notifiche",
  "chat.notif.title": "Notifiche",
  "chat.notif.clear_short": "Svuota",
  "chat.notif.close": "Chiudi le notifiche",
  "chat.notif.none": "Ancora nessuna notifica",
  "chat.notif.none_desc":
    "Qui compaiono i messaggi, le menzioni e gli avvisi dei tuoi canali e delle tue chat.",
  "chat.notif.new": "Nuovo",
  "chat.notif.notice_in": "avviso in {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Inoltra a…",
  "chat.forward.to": "Inoltra a {name}",
  "chat.forward.cant_send_here": "Qui non si può inoltrare",
  "chat.forward.cant_send_to": "Non si può inoltrare a {name}",
  "chat.forward.channels": "Canali",
  "chat.forward.groups": "Gruppi",
  "chat.forward.locations": "Posizioni",
  "chat.forward.dms": "Messaggi diretti",
  "chat.forward.none": "Ancora nessun’altra chat",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Avvio della mesh…",
  "mesh.banner.no_bluetooth":
    "Nessun Bluetooth su questo dispositivo · solo internet",
  "mesh.banner.bluetooth_off": "Bluetooth disattivato · mesh non disponibile",
  "mesh.banner.permission_needed": "Serve il permesso Bluetooth",
  "mesh.banner.blocked": "Bluetooth bloccato · consentilo nelle impostazioni",
  "mesh.banner.location_permission": "Serve la posizione per trovare i peer",
  "mesh.banner.advertising_unsupported":
    "Questo telefono può vedere gli altri ma non essere scoperto",
  "mesh.banner.location_off_android":
    "Posizione disattivata · Android ne ha bisogno per trovare i peer",
  "mesh.banner.paused": "Mesh in pausa · sei assente",
  "mesh.banner.location_off":
    "Posizione disattivata · canali di posizione non disponibili",
  "mesh.banner.battery_saver":
    "Risparmio energetico · scansioni meno frequenti",
  "mesh.banner.wipe_incomplete":
    "Cancellazione incompleta · potrebbero restare dei dati, riaprendo si riprova",
  "mesh.banner.wifi_off":
    "Wi-Fi disattivato · i file grandi partono più lentamente",
  "mesh.banner.clock_skew":
    "L’orologio di questo telefono è sbagliato · imposta data e ora su automatico",
  "mesh.banner.internet_off": "Internet disattivato · solo Bluetooth",
  "mesh.banner.relaying": "Nessun peer nelle vicinanze · inoltro tramite Nostr",
  "mesh.banner.tor": "Tor attivo · traffico internet instradato",
  "mesh.banner.tor_starting": "Avvio di Tor · connessione in corso",
  "mesh.banner.tor_blocked":
    "Tor non è riuscito a connettersi · la mesh funziona comunque",
  "mesh.banner.gateway": "Gateway internet attivo · inoltro per i peer vicini",
  "mesh.banner.bridge": "Ponte mesh attivo · chat pubblica collegata",
  "mesh.banner.background_limits":
    "{brand} può mettere in pausa la mesh in background",
  "mesh.banner.bridge_across":
    "Ponte mesh attivo · {count} dall’altra parte del ponte",
  "mesh.banner.action.turn_on": "Attiva",
  "mesh.banner.action.allow": "Consenti",
  "mesh.banner.action.resume": "Riprendi",
  "mesh.banner.action.fix": "Risolvi",
  "mesh.banner.hint.resume": "Riattiva l’annuncio e la scansione Bluetooth",
  "mesh.banner.hint.enable_bluetooth":
    "Chiede ad Android di attivare il Bluetooth",
  "mesh.banner.hint.location_settings":
    "Apre le impostazioni di posizione del sistema",
  "mesh.banner.hint.app_settings":
    "Apre i permessi di Airhop nelle impostazioni di sistema",
  "mesh.banner.hint.battery_settings":
    "Apre le impostazioni di attività in background di questo telefono",
  "mesh.banner.dismiss": "Ignora: {label}",
  "mesh.banner.hint.dismiss": "Nasconde questo avviso per sempre",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Ricerca di peer nelle vicinanze…",
  "mesh.radar.starting": "Avvio della mesh…",
  "mesh.radar.no_bluetooth": "Questo dispositivo non ha il Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth disattivato · nessuna scansione",
  "mesh.radar.permission_needed": "Serve il permesso Bluetooth",
  "mesh.radar.blocked": "Bluetooth bloccato",
  "mesh.radar.location_permission": "Serve il permesso di posizione",
  "mesh.radar.location_off": "Posizione disattivata · nessuna scansione",
  "mesh.radar.hint_rings":
    "Gli anelli indicano la potenza del segnale BLE, non la distanza",
  "mesh.radar.hint_checking": "Controllo del Bluetooth e dei permessi",
  "mesh.radar.hint_internet": "I messaggi continuano a viaggiare su internet",
  "mesh.radar.hint_turn_on": "Attiva il Bluetooth per trovare i peer",
  "mesh.radar.hint_allow": "Consenti il Bluetooth per trovare i peer",
  "mesh.radar.hint_allow_settings":
    "Consenti il Bluetooth nelle impostazioni per trovare i peer",
  "mesh.radar.hint_location_permission":
    "Android 11 e versioni precedenti richiedono la posizione per la scansione Bluetooth",
  "mesh.radar.hint_android_location":
    "Android richiede la posizione attiva per restituire i risultati della scansione Bluetooth",
  "mesh.radar.signal_strong": "Forte",
  "mesh.radar.signal_medium": "Medio",
  "mesh.radar.signal_weak": "Debole",
  "mesh.radar.you_center": "Tu, al centro della mesh",
  "mesh.radar.sonar_hint":
    "Riproduce una spazzata sonar. La scansione è già continua.",
  "mesh.radar.paused": "Mesh in pausa · sei assente",
  "mesh.radar.ring_hint":
    "La posizione dell’anello riflette la potenza del segnale, non la distanza",
  "mesh.radar.set_online":
    "Imposta il tuo stato su Online nel profilo per trovare i peer",
  "mesh.radar.in_range": "nel raggio",
  "mesh.radar.recently_seen": "visti di recente",
  "mesh.radar.peer_hint": "Apre le opzioni per scrivere o pagare questo peer",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "proprio ora",
  "mesh.peer.none": "Nessun peer nelle vicinanze",
  "mesh.peer.none_desc":
    "Qui compaiono gli altri dispositivi con Airhop o bitchat che si trovano nel raggio del Bluetooth.",
  "mesh.peer.id_copied": "ID peer copiato",
  "mesh.peer.copy_id": "Copia l’ID peer",
  "mesh.peer.their_name": "Si fa chiamare {name}",
  "mesh.peer.in_range": "Nel raggio",
  "mesh.peer.relay": "Nodo relay",
  "mesh.peer.relay_body":
    "Una radio che qualcuno ha lasciato accesa per allargare la mesh. Trasporta messaggi che non può leggere. Qui non c’è nessuno a cui scrivere.",
  "mesh.peer.send_dm": "Invia un messaggio diretto",
  "mesh.peer.message": "Messaggio",
  "mesh.peer.send_sats": "Invia ecash",
  "mesh.peer.amount_placeholder": "Importo in sats",
  "mesh.peer.amount_first": "Invia ecash, inserisci prima un importo",
  "mesh.peer.cancel_send": "Annulla l’invio di ecash",
  "mesh.peer.view_peer": "Vedi il peer {name}",
  "mesh.peer.view_peer_online": "Vedi il peer {name}, online",
  "mesh.peer.last_seen": "Visto {ago} fa",
  "mesh.peer.send_amount": "Invia {amount} sats",
  "mesh.peer.direct": "Connessione diretta",
  "mesh.peer.check_distance": "Controlla la distanza",
  "mesh.peer.checking": "Controllo in corso",
  "mesh.peer.no_reply": "Nessuna risposta",
  "mesh.peer.no_reply_hint":
    "Potrebbero essersi spostati, o la loro app potrebbe non rispondere",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Regione",
  "mesh.level.province": "Provincia",
  "mesh.level.city": "Città",
  "mesh.level.neighborhood": "Quartiere",
  "mesh.level.block": "Isolato",
  "mesh.level.building": "Edificio",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Disponibile",
  "wallet.balance.unit_hint": "Alterna tra satoshi e bitcoin",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "L’archivio del portafoglio è bloccato. Le prove ecash sono conservate in un file cifrato la cui chiave sta nel portachiavi del dispositivo, e non è stato possibile aprirlo. Sblocca il dispositivo e riapri Airhop.",
  "wallet.balance.tor_blocked":
    "Tor è attivo, quindi le richieste al mint sono bloccate: uscirebbero sulla rete in chiaro e collegherebbero il tuo IP alle tue prove. Inviare e ricevere sulla mesh continua a funzionare. Consenti il traffico verso il mint in Impostazioni, Sicurezza.",
  "wallet.balance.unconfirmed_note":
    "{amount} non ancora confermati con il mint",
  "wallet.balance.reserved_note": "{amount} riservati per un invio in corso",
  "wallet.balance.other_mint_note": "{amount} su un conto presso un altro mint",
  "wallet.balance.test_mint_note":
    "Include denaro finto di un mint di prova. Non è bitcoin e non si può incassare.",
  "wallet.token": "Token",
  "wallet.action.send": "Invia un token ecash",
  "wallet.action.send_disabled":
    "Invia un token ecash, non disponibile con saldo a zero",
  "wallet.action.receive": "Ricevi un token ecash",
  "wallet.action.zap": "Manda uno zap a un contatto Nostr",
  "wallet.action.zap_disabled":
    "Manda uno zap a un contatto Nostr, non disponibile con saldo a zero",
  "wallet.action.add_mint": "Aggiungi un mint Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Non è stato possibile costruire il token",
  "wallet.send.title": "Invia ecash",
  "wallet.send.amount_in": "Importo in {unit}",
  "wallet.send.body":
    "Costruito offline dalle prove che possiedi già. Nulla lascia il tuo saldo in via definitiva finché non confermi che il token è arrivato.",
  "wallet.send.stale_fee_note":
    "Le commissioni sono state controllate {days} giorni fa. Se da allora questo mint ha alzato la sua, l’invio potrebbe costare un po’ di più.",
  "wallet.send.fee_note":
    "{spend} {unit} lasciano il tuo saldo; i {fee} in più coprono la commissione del mint che altrimenti pagherebbero loro",
  "wallet.send.qr_too_big":
    "Questo token è suddiviso tra troppe monete per entrare in un codice QR. Condividilo o copialo, oppure aggiorna presso il mint per consolidarlo.",
  "wallet.send.bearer_note":
    "Chi possiede questa stringa possiede il denaro. Le prove sono riservate, non spese: se non arriva a nessuno puoi riprendertele in Sospesi.",
  "wallet.send.qr_too_big_short":
    "Questo token è suddiviso tra troppe monete per entrare in un codice QR. Condividilo o copialo.",
  "wallet.send.scan_note":
    "Fatelo scansionare dal loro portafoglio. Resta recuperabile finché non lo segni come consegnato.",
  "wallet.send.mesh_note":
    "Il token parte come messaggio diretto cifrato sulla mesh. Non serve internet.",
  "wallet.send.no_peers_note":
    "Apri la scheda Mesh per trovare i dispositivi vicini, oppure condividi il token in un altro modo.",
  "wallet.send.send_to": "Invia a {name}",
  "wallet.send.memo": "Nota (facoltativa, viaggia con il token)",
  "wallet.send.building": "Costruzione…",
  "wallet.send.build": "Costruisci il token",
  "wallet.send.inexact_body":
    "Le tue prove non possono comporre esattamente {amount} {unit} offline. Il token più piccolo che puoi costruire è di {spend} {unit}, e offline non esiste il resto: i {extra} {unit} in più vanno al destinatario.\n\nAggiornare presso il mint quando sei online dividerebbe le tue prove in tagli che danno la cifra esatta.",
  "wallet.send.send_amount": "Invia {amount}",
  "wallet.send.sent_to": "{amount} {unit} inviati a {name}",
  "wallet.send.sent_to_body":
    "{route} Resta recuperabile in Sospesi finché non confermi che l’hanno ricevuto, o finché il mint non ci dice che le prove sono state riscosse.",
  "wallet.send.copy_token": "Copia il token",
  "wallet.send.share_token": "Condividi il token",
  "wallet.send.open_in_wallet": "Apri questo token in un altro portafoglio",
  "wallet.send.open_in_wallet_short": "Apri nel portafoglio",
  "wallet.send.to_peer": "Invia il token a un peer vicino",
  "wallet.send.to_peer_short": "Invia a un peer",
  "wallet.send.mark_delivered": "Segna come consegnato e concludi",
  "wallet.send.they_got_it": "L’hanno ricevuto",
  "wallet.send.keep_pending": "Lascia questo invio in sospeso",
  "wallet.send.decide_later": "Decidi più tardi",
  "wallet.send.no_peers": "Nessun peer nel raggio",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Questo è il tuo stesso pagamento",
  "wallet.receive.own_payment_body":
    "Queste monete sono ancora riservate per un invio che non hai chiuso, quindi non c’è nulla da riscuotere. Usa Recupera su quel pagamento per riportarle direttamente nel tuo saldo.",
  "wallet.receive.already_have": "È già nel tuo portafoglio",
  "wallet.receive.already_have_body":
    "Ogni prova di questo token è già conservata qui, quindi non è stato aggiunto nulla. I saldi non cambiano.",
  "wallet.receive.stored_unconfirmed":
    "Conservato da {mint}, ma non ancora confermato con il mint ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Riscosso presso {mint}. Queste prove ora sono solo tue: la copia del mittente non funziona più.",
  "wallet.receive.memo_quoted": "\n\n«{memo}»",
  "wallet.receive.redeemed_at":
    "Riscosso presso {mint}. Ora è tuo in modo dimostrabile: la copia di questo token che ha il mittente non funziona più.",
  "wallet.receive.stored_pending":
    "Conservato da {mint}, ma il mint non ha ancora confermato che non sia stato speso{dleq}. Aggiorna dalla scheda Portafoglio appena sei online.",
  "wallet.receive.dleq_inline":
    " (la sua firma però risulta valida, quindi il token è autentico)",
  "wallet.receive.dleq_ok":
    "La firma del mint risulta valida, quindi il token è autentico.",
  "wallet.receive.dleq_uncached":
    "Le chiavi del mint non sono conservate qui, quindi non è stato possibile verificare la firma offline.",
  "wallet.receive.dleq_warning":
    "Finché non aggiorni online, il mittente potrebbe in linea di principio averlo speso altrove.",
  "wallet.receive.failed": "Non è stato possibile ricevere",
  "wallet.receive.title": "Ricevi ecash",
  "wallet.receive.body":
    "Incolla un token Cashu. Online viene riscosso subito presso il mint; offline viene conservato e confermato al prossimo aggiornamento.",
  "wallet.receive.scan": "Scansiona un codice QR ecash",
  "wallet.receive.scan_short": "Scansiona QR",
  "wallet.receive.receiving": "Ricezione…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap ricevuto da {from}… e riscosso nel tuo portafoglio.",
  "wallet.zap.title": "Manda uno zap a un’identità Nostr",
  "wallet.zap.not_npub": "non è un npub",
  "wallet.zap.bad_key": "chiave errata",
  "wallet.zap.invalid_pubkey": "Chiave pubblica non valida",
  "wallet.zap.invalid_pubkey_body":
    "Inserisci un npub1… o una chiave pubblica Nostr esadecimale di 64 caratteri.",
  "wallet.zap.sent": "Nutzap inviato",
  "wallet.zap.failed": "Zap non riuscito",
  "wallet.zap.body":
    "Se pubblicano le informazioni nutzap di NIP-61, l’ecash viene vincolato alla loro chiave così nessun altro può spenderlo, e non può essere ripreso. Altrimenti parte come token recuperabile. Ti diremo quale dei due è successo.",
  "wallet.zap.contact": "Manda uno zap a {name}",
  "wallet.zap.pubkey_placeholder": "npub1… o esadecimale di 64 caratteri",
  "wallet.zap.sending": "Invio…",
  "wallet.nostr.copied_body":
    "Dallo a qualcuno e potrà mandarti uno zap da Airhop o da qualsiasi altro portafoglio Nostr, senza bisogno del Bluetooth.",
  "wallet.nostr.copy_key":
    "Copia la tua chiave Nostr così potranno mandarti zap",
  "wallet.nostr.your_key": "La tua chiave Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint aggiunto",
  "wallet.mint.add_failed": "Non è stato possibile aggiungere il mint",
  "wallet.mint.added_named": "{name} aggiunto",
  "wallet.mint.added_body":
    "{mint} emette {units}. Le sue chiavi sono conservate su questo dispositivo, quindi i suoi token si possono verificare anche senza internet.",
  "wallet.mint.remove_plain":
    "Rimuovere {mint} dal tuo portafoglio? Anche le chiavi conservate spariscono, quindi i suoi token non si potranno più verificare offline.",
  "wallet.mint.title": "Mint",
  "wallet.mint.none": "Ancora nessun mint",
  "wallet.mint.none_desc":
    "Un mint emette e riscuote il tuo ecash. Aggiungine uno per depositare tramite Lightning, oppure ricevi un token e il suo mint viene aggiunto da solo.",
  "wallet.mint.add": "Aggiungi un mint",
  "wallet.mint.add_body":
    "Un mint custodisce il Bitcoin che garantisce il tuo ecash, quindi scegline uno a cui affideresti il saldo che tieni lì. L’URL viene controllato prima del salvataggio. Se preferisci non fidarti di nessuno, gestiscine uno tuo con Nutshell.",
  "wallet.mint.consolidate_body":
    "Un token può nominare un solo mint, quindi un saldo distribuito su più mint non può pagare una cifra maggiore di quella custodita dal più capiente. Airhop può spostarlo: ogni altro mint paga una fattura Lightning emessa da quello che scegli. Costa una piccola commissione di instradamento e richiede internet.",
  "wallet.mint.add_short": "Aggiungi",
  "wallet.mint.checking": "Controllo…",
  "wallet.mint.remove_with_balance": "Rimuovere un mint con del saldo?",
  "wallet.mint.remove": "Rimuovi il mint",
  "wallet.mint.delete_anyway": "Elimina comunque",
  "wallet.mint.consolidate": "Sposta tutti i saldi su un solo mint",
  "wallet.mint.confirm_with": "Conferma le prove con {mint}",
  "wallet.mint.remove_a11y": "Rimuovi {mint}",
  "wallet.mint.available_amount": "{amount} {unit} disponibili",
  "wallet.mint.split_across":
    "Saldo distribuito su {count} mint. Spostalo su uno solo.",
  "wallet.mint.move_everything_to": "Sposta tutto su {mint}",
  "wallet.mint.consolidate_title": "Sposta su un solo mint",
  "wallet.mint.moving": "Spostamento…",
  "wallet.mint.move": "Sposta",
  "wallet.mint.moved": "Spostato",
  "wallet.mint.moved_body":
    "{amount} {unit} ora si trovano presso {mint}, dopo {fees} {unit} di commissioni di instradamento Lightning.",
  "wallet.mint.nothing_moved": "Non è stato spostato nulla",
  "wallet.mint.destination": "· destinazione",
  "wallet.mint.will_move": "· verrà spostato",
  "wallet.mint.issued_by": "Emesso da",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Ricarica del portafoglio Airhop",
  "wallet.ln.invoice_failed": "Non è stato possibile creare la fattura",
  "wallet.ln.price_failed": "Non è stato possibile quotare questa fattura",
  "wallet.ln.paid": "Pagata",
  "wallet.ln.deposit_credited":
    "Fattura pagata e {amount} {unit} emessi da {mint}. Questo saldo è confermato: puoi spenderlo offline fin da subito.",
  "wallet.ln.withdrawn":
    "{paid} sats pagati tramite Lightning. Il mint ha addebitato {fee} sats di commissioni di instradamento.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats pagati tramite Lightning. Il mint ha addebitato {fee} sats di commissioni di instradamento e ha restituito {change} sats della riserva al tuo saldo.",
  "wallet.ln.payment_failed": "Pagamento non riuscito",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Trasforma i sats su Lightning in ecash che puoi spendere offline, oppure incassa l’ecash su qualsiasi fattura Lightning. Entrambe le cose richiedono internet e un mint.",
  "wallet.ln.deposit_body":
    "Il mint ti dà una fattura. Pagala da qualsiasi portafoglio Lightning e i sats tornano come ecash che puoi spendere offline.",
  "wallet.ln.pay_invoice_for":
    "Paga questa fattura da {amount} {unit}. Il portafoglio sta attendendo il pagamento ed emetterà il tuo ecash automaticamente.",
  "wallet.ln.expired_body":
    "Questa fattura è scaduta. Se l’hai già pagata, il saldo viene accreditato automaticamente.",
  "wallet.ln.waiting_expires":
    "In attesa del pagamento · scade tra {countdown}",
  "wallet.ln.withdraw_body":
    "Incolla una fattura bolt11 e il mint la paga con il tuo ecash. Prima ti viene indicata la riserva di instradamento; tutto ciò che l’instradamento non usa torna nel tuo saldo.",
  "wallet.ln.up_to": "fino a {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Paga {amount} {unit}",
  "wallet.ln.deposit": "Deposita sats tramite Lightning",
  "wallet.ln.deposit_short": "Deposita",
  "wallet.ln.withdraw": "Preleva su una fattura Lightning",
  "wallet.ln.withdraw_short": "Preleva",
  "wallet.ln.deposit_title": "Deposita tramite Lightning",
  "wallet.ln.amount_placeholder": "Importo in sats",
  "wallet.ln.requesting": "Richiesta…",
  "wallet.ln.get_invoice": "Ottieni una fattura",
  "wallet.ln.copy_invoice": "Copia la fattura",
  "wallet.ln.open_wallet": "Apri in un portafoglio Lightning",
  "wallet.ln.open_wallet_short": "Apri nel portafoglio",
  "wallet.ln.waiting": "In attesa del pagamento…",
  "wallet.ln.new_invoice": "Crea una nuova fattura",
  "wallet.ln.new_invoice_short": "Nuova fattura",
  "wallet.ln.withdraw_title": "Preleva su Lightning",
  "wallet.ln.scan_invoice": "Scansiona il codice QR di una fattura Lightning",
  "wallet.ln.paid_from": "Pagato da",
  "wallet.ln.invoice": "Fattura",
  "wallet.ln.routing_reserve": "Riserva di instradamento",
  "wallet.ln.reserved": "Riservato dal saldo",
  "wallet.ln.paying": "Pagamento…",
  "wallet.ln.get_quote": "Ottieni un preventivo",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Backup",
  "wallet.backup.setup_failed": "Non è stato possibile configurare il backup",
  "wallet.backup.on": "Backup attivo",
  "wallet.backup.on_body":
    "Il tuo saldo ora può essere ricostruito da quelle dodici parole.\n\nTutto ciò che ti è stato dato da qualcun altro resta fuori dalla frase finché non aggiorni presso il mint, e il ripristino richiede il tuo elenco di mint, quindi annotalo accanto alle parole.",
  "wallet.backup.no_phrase": "Nessuna frase conservata",
  "wallet.backup.no_phrase_body":
    "Non è stato possibile leggere la frase di recupero dal portachiavi del dispositivo. Sbloccalo e riprova.",
  "wallet.backup.replace_title": "Sostituire la tua frase attuale?",
  "wallet.backup.replace_body":
    "Hai già una frase di recupero. Ripristinarne un’altra la sostituisce. Le monete già coperte dalla vecchia frase restano spendibili su questo dispositivo, ma smettono di essere ripristinabili, quindi assicurati di aver annotato le vecchie parole prima di continuare.",
  "wallet.backup.replace": "Sostituisci",
  "wallet.backup.invalid_phrase": "Quella frase non è valida",
  "wallet.backup.invalid_phrase_body":
    "La frase ha un codice di controllo incorporato e questa non lo supera. Cerca una parola scritta male, mancante o scambiata.",
  "wallet.backup.not_bip39":
    "Queste non sono parole BIP-39: {words}. Controlla l’ortografia.",
  "wallet.backup.add_mint_first": "Aggiungi prima un mint",
  "wallet.backup.add_mint_first_body":
    "Il ripristino funziona chiedendo a un mint quali monete ha firmato per te, quindi deve sapere a quale rivolgersi. Aggiungi i mint che usavi, poi ripristina.",
  "wallet.backup.restore_failed": "Ripristino non riuscito",
  "wallet.backup.phrase": "Frase di recupero",
  "wallet.backup.state_unconfirmed": "Backup attivo ma non confermato",
  "wallet.backup.state_off": "Backup disattivato",
  "wallet.backup.badge_on": "Attivo",
  "wallet.backup.badge_unconfirmed": "Non confermato",
  "wallet.backup.badge_off": "Disattivo",
  "wallet.backup.view": "Vedi la frase di recupero",
  "wallet.backup.setup": "Configura una frase di recupero",
  "wallet.backup.view_short": "Vedi la frase",
  "wallet.backup.setup_short": "Configura",
  "wallet.backup.restore": "Ripristina un portafoglio da una frase di recupero",
  "wallet.backup.restore_short": "Ripristina",
  "wallet.backup.setup_title": "Configura una frase di recupero",
  "wallet.backup.on_body_short":
    "Il tuo saldo può essere ricostruito su un nuovo dispositivo dalle tue dodici parole.",
  "wallet.backup.unconfirmed_body":
    "Non hai mai confermato di averne una copia scritta. In questo momento le parole esistono solo su questo telefono, che è proprio la cosa a cui un backup dovrebbe sopravvivere. Guarda la frase e annotala.",
  "wallet.backup.not_covered":
    "{amount} non sono ancora coperti. Le monete che ti sono state date portano i segreti di chi te le ha inviate, quindi rientrano sotto la tua frase solo una volta scambiate. Aggiorna un mint per metterle al sicuro.",
  "wallet.backup.off_body":
    "Il tuo ecash esiste solo su questo telefono. Se lo perdi, nessuno può recuperare il denaro, tu compreso. Una frase di recupero è fatta di dodici parole che possono ricostruire il tuo saldo ovunque.",
  "wallet.backup.about_to_see":
    "Stai per vedere dodici parole. Sono il denaro.",
  "wallet.backup.exact_order":
    "Dodici parole, esattamente in quest’ordine. Chi le ha, ha il tuo saldo.",
  "wallet.backup.verify_body":
    "Una frase che nessuno ha annotato è peggio di nessuna frase, perché sembra una rete di sicurezza che non c’è. Due parole per confermare.",
  "wallet.backup.verify_mismatch":
    "Non corrisponde. Controlla la tua copia scritta.",
  "wallet.backup.restore_body":
    "Inserisci le dodici parole. Airhop ricava di nuovo le tue monete e chiede a ogni mint quali ha firmato, così il saldo torna dai registri che il mint conserva.",
  "wallet.backup.warn_secret":
    "Chiunque le legga può prendersi il tuo saldo. Non farne screenshot e non conservarle su questo telefono.",
  "wallet.backup.warn_paper":
    "Scrivile su carta e tienile al sicuro. Airhop non può mostrartele di nuovo se il telefono sparisce.",
  "wallet.backup.warn_scope":
    "Ricostruiscono solo il tuo ecash. Identità, chat e contatti non sono coperti.",
  "wallet.backup.warn_mints":
    "Il ripristino deve chiedere a un mint quali monete ha firmato, quindi annota il tuo elenco di mint accanto alle parole.",
  "wallet.backup.preparing": "Preparazione…",
  "wallet.backup.show_phrase": "Mostra la mia frase",
  "wallet.backup.your_phrase": "La tua frase di recupero",
  "wallet.backup.write_down": "Annota queste parole",
  "wallet.backup.copy_phrase": "Copia la frase di recupero negli appunti",
  "wallet.backup.copy_clipboard": "Copia negli appunti",
  "wallet.backup.written_down": "Le ho annotate",
  "wallet.backup.check_copy": "Controlla la tua copia",
  "wallet.backup.confirm": "Conferma",
  "wallet.backup.restore_title": "Ripristina da una frase",
  "wallet.backup.phrase_placeholder": "dodici parole separate da spazi",
  "wallet.backup.no_mints_yet":
    "Non hai ancora aggiunto alcun mint. Il ripristino deve rivolgersi a un mint preciso, quindi aggiungi prima quelli che usavi.",
  "wallet.backup.scanning": "Scansione…",
  "wallet.backup.restore_progress": "{mint} · keyset {step} di {total}",
  "wallet.backup.will_scan":
    "Verranno esaminati: {mints}. A un mint che non hai aggiunto non viene mai chiesto nulla, quindi il saldo lì resta invisibile.",
  "wallet.backup.word_n": "Parola {position}",
  "wallet.backup.unreachable_mints":
    "Non è stato possibile raggiungere: {mints}. Il saldo eventualmente presente lì esiste ancora. Riprova con una connessione migliore.",
  "wallet.backup.nothing_recovered":
    "Non è stato recuperato nulla dai mint esaminati.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Segnare come ricevuto?",
  "wallet.delivered.body":
    "Questo rilascia {amount} {unit} in via definitiva. Se in realtà non è mai arrivato, non potrai recuperarlo.",
  "wallet.delivered.body_generic":
    "Questo rilascia in via definitiva l’importo riservato. Se in realtà non è mai arrivato, non potrai recuperarlo.",
  "wallet.delivered.cancel": "Non ancora",
  "wallet.delivered.confirm": "L’hanno ricevuto",
  "wallet.reclaim.title": "Recuperare questo token?",
  "wallet.reclaim.body":
    "I {amount} {unit} tornano nel tuo saldo. Fallo solo se il token non è mai arrivato a nessuno: se hanno già la stringa, chi la riscuote per primo presso il mint tiene il denaro, e potrebbero essere loro.",
  "wallet.reclaim.keep": "Lascia in sospeso",
  "wallet.reclaim.confirm": "Recupera",
  "wallet.copied.token_body":
    "Il token è nei tuoi appunti. Resta riservato qui finché non lo segni come consegnato, quindi puoi incollarlo di nuovo se il primo tentativo fallisce.",
  "wallet.copied.phrase_body":
    "Incollala in un gestore di password, poi svuota gli appunti. Altre app possono leggerli, e in alcune configurazioni si sincronizzano con i tuoi altri dispositivi.",
  "wallet.refresh.failed": "Aggiornamento non riuscito",
  "wallet.refresh.partly": "Aggiornato in parte",
  "wallet.refresh.done": "Aggiornato",
  "wallet.refresh.unreachable":
    "Non è stato possibile raggiungere {mints}. Tutto il resto è aggiornato.",
  "wallet.refresh.swapped":
    "{amount} {unit} confermati e scambiati con prove nuove.",
  "wallet.refresh.secured":
    "{amount} {unit} ora sono coperti dalla tua frase di recupero.",
  "wallet.refresh.all_confirmed":
    "Tutto quello che c’è qui era già confermato con il mint.",
  "wallet.pending.title": "Sospesi",
  "wallet.pending.reserved_desc":
    "Costruito e riservato, consegna non confermata. Le prove sono tenute fuori dal tuo saldo così non possono essere spese due volte.",
  "wallet.pending.locked_desc":
    "Già vincolato alla chiave del destinatario, quindi solo lui può spenderlo. Semplicemente non gli è ancora arrivato. Condividi il token per concludere.",
  "wallet.pending.show_qr": "Mostra questo token come codice QR",
  "wallet.pending.copy_again": "Copia di nuovo il token",
  "wallet.pending.share_again": "Condividi di nuovo il token",
  "wallet.pending.mark_delivered": "Segna questo token come consegnato",
  "wallet.pending.delivered": "Consegnato",
  "wallet.pending.reclaim_into": "Recupera questo token nel tuo saldo",
  "wallet.activity.title": "Attività",
  "wallet.activity.none": "Ancora nulla",
  "wallet.activity.none_desc":
    "I pagamenti che invii e ricevi compaiono qui, dal più recente, con il mint e la commissione di ciascuno.",
  "wallet.activity.show_fewer": "Mostra meno pagamenti",
  "wallet.activity.show_less": "Mostra meno",
  "wallet.activity.received_unconfirmed": "Ricevuto, non confermato",
  "wallet.activity.received": "Ricevuto",
  "wallet.activity.receive_failed": "Ricezione non riuscita",
  "wallet.activity.reclaimed": "Recuperato",
  "wallet.activity.send_failed": "Invio non riuscito",
  "wallet.activity.sent": "Inviato",
  "wallet.activity.status_pending": "in sospeso",
  "wallet.activity.status_failed": "non riuscito",
  "wallet.activity.status_reclaimed": "recuperato",
  "wallet.activity.status_expired": "scaduto",
  "wallet.activity.ln_deposit": "Deposito Lightning",
  "wallet.activity.ln_withdrawal": "Prelievo Lightning",
  "wallet.activity.nutzap_received": "Nutzap ricevuto",
  "wallet.activity.spent_removed": "Prove spese rimosse",
  "wallet.activity.refreshed": "Prove aggiornate",
  "wallet.activity.refreshing": "Aggiornamento delle prove",
  "wallet.activity.just_now": "proprio ora",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh offline",
  "wallet.mesh_offline_body":
    "Il servizio mesh non è in funzione, quindi non c’è a chi consegnare il token. Resta riservato in Sospesi.",
  "wallet.xfer.route_mesh":
    "Consegnato direttamente al loro dispositivo sulla mesh.",
  "wallet.xfer.route_nostr":
    "Erano fuori dal raggio del Bluetooth, quindi è passato da internet.",
  "wallet.xfer.route_courier":
    "Al momento non c’è un percorso fino a loro. Verrà trasportato da altri dispositivi e consegnato quando uno di essi li raggiungerà.",
  "wallet.xfer.route_queued":
    "Non sono ancora raggiungibili. È in coda e partirà appena lo saranno.",
  "wallet.xfer.mesh_offline_body":
    "Il servizio mesh non è in funzione, quindi non c’è modo di consegnare il token. Non è stato detratto nulla.",
  "wallet.xfer.could_not_send": "Non è stato possibile inviare",
  "wallet.xfer.inexact_body":
    "Le tue prove non possono comporre esattamente {amount} {unit} offline. Il token più piccolo che puoi costruire è di {spend} {unit}, e i {extra} {unit} in più vanno a loro senza alcun modo di riaverli.\n\nAggiornare presso il mint quando sei online divide le tue prove in tagli che danno la cifra esatta.",
  "wallet.xfer.send_amount": "Invia {amount}",
  "wallet.xfer.mesh_offline": "Mesh offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Vincolato alla loro chiave e pubblicato su Nostr. È loro, che siano online o meno.",
  "wallet.pay.rail_nutzap_dm":
    "Vincolato alla loro chiave. Il relay non l’ha accettato, quindi è arrivato loro come messaggio.",
  "wallet.pay.rail_nutzap_undelivered":
    "Vincolato alla loro chiave, ma finora nulla è riuscito a trasportarlo. È in coda e il token è tra i Sospesi.",
  "wallet.pay.final":
    "I pagamenti vincolati non si possono recuperare: ora solo la loro chiave può spendere queste monete.",
  "wallet.pay.reclaimable":
    "Resta recuperabile dalla scheda Portafoglio finché non confermi che è arrivato.",
  "wallet.pay.why": "Inviato così perché {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} a {name}",
  "wallet.pay.thread_receipt":
    "Hai inviato {amount} {unit}, vincolati alla loro chiave.",
  "wallet.pay.title": "Invia ecash",
  "wallet.pay.to": "A {name}",
  "wallet.pay.amount": "Importo in sats",
  "wallet.pay.memo": "Nota (facoltativa, pubblica)",
  "wallet.pay.send": "Invia",
  "wallet.pay.sending": "Invio…",
  "wallet.pay.action": "Invia ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Accesso alla fotocamera",
  "wallet.scan.camera_purpose": "scansionare un codice QR ecash",
  "wallet.scan.photo_label": "Accesso alle foto",
  "wallet.scan.photo_purpose": "leggere un QR ecash da un’immagine",
  "wallet.scan.no_token": "Nessun token ecash trovato in quell’immagine.",
  "wallet.scan.no_invoice":
    "Nessuna fattura Lightning trovata in quell’immagine.",
  "wallet.scan.unreadable": "Non è stato possibile leggere quell’immagine.",
  "wallet.scan.camera_failed":
    "Non è stato possibile avviare la fotocamera. Chiudi le altre app che la usano e riprova.",
  "wallet.scan.close": "Chiudi lo scanner",
  "wallet.scan.on_device":
    "Viene letto su questo dispositivo; nulla viene inviato da nessuna parte.",
  "wallet.scan.aim_token": "Inquadra un codice QR ecash.",
  "wallet.scan.aim_invoice": "Inquadra il codice QR di una fattura Lightning.",
  "wallet.scan.title_token": "Scansiona ecash",
  "wallet.scan.title_invoice": "Scansiona una fattura",
  "wallet.scan.desc_token":
    "Leggi un token Cashu da un altro portafoglio. Funziona con qualsiasi portafoglio Cashu, non solo con Airhop.",
  "wallet.scan.desc_invoice":
    "Leggi una fattura Lightning per pagarla con il tuo saldo.",
  "wallet.scan.use_camera_a11y": "Scansiona con la fotocamera",
  "wallet.scan.use_camera": "Usa la fotocamera",
  "wallet.scan.pick_image_a11y": "Leggi un codice QR da un’immagine salvata",
  "wallet.scan.pick_image": "Scegli dalle foto",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Che cos’è Cashu?",
  "wallet.explain.intro":
    "Cashu è ecash per Bitcoin. Un token è una stringa che vale denaro per chi la possiede, firmata alla cieca da un mint così che il mint non possa sapere chi ha speso cosa. Nessun account, nessun accesso.",
  "wallet.explain.send": "Invia",
  "wallet.explain.send_desc":
    "Trasforma un importo in un token che puoi consegnare a un peer vicino via Bluetooth, o condividere come testo. Funziona senza internet. Le prove restano riservate finché non confermi che è arrivato.",
  "wallet.explain.receive": "Ricevi",
  "wallet.explain.receive_desc":
    "Incolla un token per aggiungerlo. Online viene scambiato subito presso il mint, il che lo rende tuo in modo dimostrabile. Offline viene conservato e segnato come non confermato finché non aggiorni.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Paga un’identità Nostr. Se pubblicano le informazioni nutzap di NIP-61, l’ecash viene vincolato alla loro chiave così solo loro possono spenderlo. Altrimenti si ripiega su un messaggio diretto cifrato. Richiede internet.",
  "wallet.explain.add_mint": "Aggiungi un mint",
  "wallet.explain.add_mint_desc":
    "Salva il mint che emette e riscuote il tuo ecash, e conserva le sue chiavi pubbliche così i suoi token si possono verificare offline. Scegli un mint a cui affideresti il saldo che tieni lì.",
  "wallet.explain.phrase": "Frase di recupero",
  "wallet.explain.phrase_desc":
    "Le tue monete derivano da dodici parole che il portafoglio genera all’inizio, così un telefono nuovo può ricostruire il saldo chiedendo ai tuoi mint quali monete hanno firmato. Finché non le guardi e non le annoti, esistono solo su questo telefono.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Portafoglio bloccato",
  "wallet.err.mint_unreachable": "Mint irraggiungibile",
  "wallet.err.tor_blocked": "Bloccato mentre Tor è attivo",
  "wallet.err.insufficient": "Saldo insufficiente",
  "wallet.err.exact_amount": "Non si può inviare quella cifra esatta",
  "wallet.err.no_mint": "Nessun mint",
  "wallet.err.mint_unsupported": "Il mint non può farlo",
  "wallet.err.mint_refused": "Il mint ha rifiutato",
  "wallet.err.unreadable": "Token illeggibile",
  "wallet.err.rejected": "Token rifiutato",
  "wallet.err.already_spent": "Già speso",
  "wallet.err.change_pending": "Pagato, resto in sospeso",
  "wallet.svc.mint_unreachable": "Non è stato possibile raggiungere il mint.",
  "wallet.svc.tor_ios": "Su iOS le richieste al mint non passano da Tor.",
  "wallet.svc.tor_ios_body":
    "Arti copre solo i WebSocket di Nostr, quindi questa richiesta raggiungerebbe il mint sulla rete in chiaro e collegherebbe il tuo IP a queste prove. Consentilo in Impostazioni > Sicurezza, oppure disattiva prima Tor. Inviare e ricevere ecash sulla mesh continua a funzionare.",
  "wallet.svc.tor_paused": "Tor è attivo ma non connesso.",
  "wallet.svc.tor_paused_body":
    "Orbot ha smesso di instradare, quindi questa richiesta raggiungerebbe il mint sulla rete in chiaro e collegherebbe il tuo IP a queste prove. Riavvia Orbot, oppure disattiva Tor. Inviare e ricevere ecash sulla mesh continua a funzionare.",
  "wallet.svc.keys_uncached":
    "Le chiavi di questo mint non sono conservate su questo dispositivo.",
  "wallet.svc.keys_uncached_body":
    "Apri il portafoglio una volta mentre sei online per scaricarle.",
  "wallet.svc.phrase_invalid": "Quella frase di recupero non è valida.",
  "wallet.svc.phrase_invalid_body":
    "Cerca una parola scritta male o mancante. La frase ha un codice di controllo incorporato, quindi una sola parola sbagliata invalida tutto.",
  "wallet.svc.need_mint": "Aggiungi prima almeno un mint.",
  "wallet.svc.need_mint_body":
    "Il ripristino funziona chiedendo a un mint quali monete ha firmato per te, quindi deve sapere a quale rivolgersi.",
  "wallet.svc.restored": "Ripristinato dalla frase di recupero",
  "wallet.svc.storage_locked": "L’archivio del portafoglio è bloccato.",
  "wallet.svc.storage_locked_body":
    "Airhop conserva le prove ecash in un file cifrato la cui chiave sta nel portachiavi del dispositivo. Sbloccalo e riapri l’app.",
  "wallet.svc.bad_url": "Non è un URL valido.",
  "wallet.svc.needs_https": "L’URL di un mint deve iniziare con https://.",
  "wallet.svc.refuse_http": "Rifiutiamo di usare un mint su http in chiaro.",
  "wallet.svc.refuse_http_body":
    "Chiunque si trovi lungo il percorso di rete potrebbe leggere o alterare le tue prove. Usa un mint con https://.",
  "wallet.svc.mint_not_saved": "Non è stato possibile salvare il mint.",
  "wallet.svc.unreadable_token": "Non è un token Cashu leggibile.",
  "wallet.svc.unreadable_token_body":
    "I token iniziano con cashuA o cashuB. Controlla che non sia stato troncato durante la copia.",
  "wallet.svc.wrong_mint":
    "Questo token non è stato firmato dal mint che dichiara.",
  "wallet.svc.already_spent": "Queste prove sono già state spese.",
  "wallet.svc.already_spent_body":
    "Chi ha inviato questo token l’ha riscosso prima, oppure ha mandato lo stesso token a qualcun altro.",
  "wallet.svc.receiving_offline": "ricezione offline",
  "wallet.svc.amount_positive": "Inserisci un importo maggiore di zero.",
  "wallet.svc.coins_raced":
    "Quelle monete sono appena state usate da un altro pagamento.",
  "wallet.svc.coins_raced_body":
    "Non è stato detratto nulla. Riprova e il portafoglio sceglierà un insieme diverso.",
  "wallet.svc.no_ecash": "Ancora nessun ecash.",
  "wallet.svc.no_ecash_body":
    "Aggiungi un mint e deposita tramite Lightning, oppure ricevi un token da qualcuno.",
  "wallet.svc.split_across_mints": "Il tuo saldo è distribuito su più mint.",
  "wallet.svc.mint_says_spent":
    "Il mint ha segnalato queste prove come già spese.",
  "wallet.svc.issue_against_invoice":
    "emettere ecash a fronte di una fattura Lightning",
  "wallet.svc.pay_invoice": "pagare una fattura Lightning",
  "wallet.svc.unknown_deposit": "Deposito sconosciuto.",
  "wallet.svc.invoice_expired_before":
    "La fattura è scaduta prima di essere pagata.",
  "wallet.svc.invoice_expired": "Quella fattura è scaduta.",
  "wallet.svc.invoice_unpaid": "La fattura non è ancora stata pagata.",
  "wallet.svc.payment_unknown":
    "Stato del pagamento sconosciuto; verrà ricontrollato al prossimo aggiornamento.",
  "wallet.svc.melt_change_pending": "La tua fattura è stata pagata.",
  "wallet.svc.melt_change_pending_body":
    "Il mint non ha ancora restituito la commissione di instradamento non utilizzata. Viene richiesta automaticamente al prossimo aggiornamento e nel frattempo non si perde nulla.",
  "wallet.svc.mint_did_not_pay":
    "Il mint non ha pagato questa fattura. Il tuo saldo è invariato.",
  "wallet.svc.not_an_invoice": "Non è una fattura Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Incolla una fattura bolt11 che inizia con lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Saldo insufficiente per questa fattura.",
  "wallet.svc.coins_raced_invoice_body":
    "Non è stato detratto nulla e la fattura non è stata pagata. Riprova.",
  "wallet.svc.same_mint": "Scegli un mint di destinazione diverso.",
  "wallet.svc.same_mint_body":
    "Origine e destinazione sono lo stesso mint, quindi non c’è nulla da spostare.",
  "wallet.svc.quote_failed_retried":
    "Preventivo non riuscito, consolidamento ritentato",
  "wallet.svc.amount_unfit_retried":
    "L’importo non rientrava, consolidamento ritentato",
  "wallet.svc.cannot_size":
    "Non è stato possibile dimensionare questo trasferimento.",
  "wallet.svc.insufficient_at_mint": "Saldo insufficiente presso {mint}.",
  "wallet.svc.inexact_title":
    "Le tue prove non possono comporre esattamente {amount} {unit} offline.",
  "wallet.svc.inexact_detail":
    "Il token più piccolo che puoi inviare è di {spend} {unit}. Offline non esiste il resto, quindi i {extra} {unit} in più vanno al destinatario.",
  "wallet.svc.no_single_mint":
    "Nessun singolo mint custodisce {amount} {unit}. L’ecash di mint diversi non si può unire in un solo token: consolida prima presso un mint, oppure invia in importi separati.",
  "wallet.svc.have_tried_send":
    "Hai {total} {unit} e hai provato a inviare {amount}.",
  "wallet.svc.invoice_needs":
    "Questa fattura richiede {total} {unit} compresa la riserva di instradamento, e tu hai {balance}.",
  "wallet.svc.nothing_to_move": "{mint} non ha {unit} da spostare.",
  "wallet.svc.consolidate_memo": "Consolidamento da {mint}",
  "wallet.svc.cannot_size_detail":
    "Dopo le commissioni di instradamento Lightning, {from} non può spostare un importo utile verso {to}. Prova invece a spostare un importo più piccolo e preciso.",
  "wallet.svc.mint_cannot": "{mint} non può {action}.",
  "wallet.svc.no_nut": "Il mint non dichiara il supporto per NUT-{nut}.",
  "wallet.svc.unknown_mint": "Quel pagamento nomina un mint che non usi.",
  "wallet.svc.unknown_mint_body":
    "Aggiungilo tu se ti fidi; non viene riscosso nulla da un mint che non hai scelto.",
  "wallet.svc.no_relay": "nessuna connessione a un relay",
  "wallet.svc.no_shared_mint": "nessun mint in comune con saldo sufficiente",
  "wallet.svc.no_nutzap_info":
    "il destinatario non ha pubblicato le informazioni nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Vincolato alla loro chiave ma non ancora consegnato. Condividi il token di questa transazione per completarla.",
  "wallet.svc.swap_lost":
    "Il mint non ha mai completato questo scambio, quindi non è stato emesso nulla in cambio.",
  "wallet.svc.swap_unreadable":
    "Questo scambio è stato salvato in un formato che questa versione non può rieseguire.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Verificato tramite QR",
  "contacts.qr.keys_unverified": "Chiavi ricevute, non verificate",
  "contacts.qr.not_verified": "Non ancora verificato",
  "contacts.qr.message": "Messaggio",
  "contacts.qr.add": "Aggiungi contatto",
  "contacts.qr.scan_title": "Scansiona il codice QR",
  "contacts.qr.aim": "Inquadra il loro codice QR con la fotocamera",
  "contacts.qr.add_desc": "Raggiungi qualcuno che non è vicino sulla mesh.",
  "contacts.qr.peer_id_hint":
    "Un ID peer ha 16 caratteri. Un codice contatto inizia con airhop:.",
  "contacts.qr.or_scan": "oppure scansiona il loro QR",
  "contacts.qr.trust_note":
    "Solo un QR che scansioni con la tua fotocamera verifica la loro chiave. Un codice incollato porta le loro chiavi, ma non la prova che venga da loro.",
  "contacts.qr.peer_id": "ID peer o codice contatto",
  "contacts.qr.peer_id_placeholder": "Incolla un ID o un codice contatto",
  "contacts.qr.scan_camera_a11y": "Scansiona il codice QR con la fotocamera",
  "contacts.qr.scan_camera_desc": "Usa la fotocamera",
  "contacts.qr.upload_a11y": "Carica un’immagine QR dalla galleria",
  "contacts.qr.upload": "Carica dalla galleria",
  "contacts.qr.upload_desc": "Scegli un’immagine QR salvata",
  "contacts.qr.scan_a11y": "Aggiungi un contatto scansionando un codice QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Incolla un ID peer di 16 caratteri, un link airhop://peer/… oppure un codice contatto.",
  "contacts.scan.camera_label": "Accesso alla fotocamera",
  "contacts.scan.camera_purpose": "scansionare il codice QR di un contatto",
  "contacts.scan.camera_needed":
    "Serve l’accesso alla fotocamera per scansionare. Puoi comunque aggiungerlo tramite ID peer.",
  "contacts.scan.camera_failed":
    "Non è stato possibile avviare la fotocamera. Chiudi le altre app che la usano e riprova.",
  "contacts.scan.photo_label": "Accesso alle foto",
  "contacts.scan.photo_purpose": "scansionare un codice QR che hai salvato",
  "contacts.scan.photo_needed":
    "Serve l’accesso alle foto per scegliere un’immagine. Puoi comunque aggiungerlo tramite ID peer.",
  "contacts.scan.no_qr":
    "Nessun codice QR di Airhop trovato in quell’immagine.",
  "contacts.scan.unreadable":
    "Non è stato possibile leggere un codice QR da quell’immagine.",
  "contacts.scan.bitchat_expired":
    "Quel codice bitchat è scaduto. Chiedi loro di riaprire il proprio QR.",
  "contacts.scan.tampered":
    "Questo codice QR non è valido: il suo ID peer non corrisponde alle sue chiavi. Potrebbe essere stato manomesso.",
  "contacts.scan.already_added": "È già tra i tuoi contatti",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "In attesa dell’accesso alla fotocamera…",
  "contacts.verify.camera_off": "La fotocamera è disattivata",
  "contacts.verify.open_settings": "Apri le impostazioni",
  "contacts.verify.verified": "Verificato",
  "contacts.verify.different": "Contatto diverso",
  "contacts.verify.scan_again": "Scansiona di nuovo",
  "contacts.verify.failed": "Non è stato possibile verificare",
  "contacts.verify.done": "Fatto",
  "contacts.verify.title": "Verifica {name}",
  "contacts.verify.aim": "Inquadra il loro codice QR con la fotocamera",
  "contacts.verify.camera_off_body":
    "Attiva l’accesso alla fotocamera nelle impostazioni per verificare tramite QR.",
  "contacts.verify.match_body":
    "La chiave di {name} corrisponde. Puoi fidarti di questo contatto.",
  "contacts.verify.different_body":
    "Questo QR appartiene a un’altra persona. Chiedi a {name} di mostrare il proprio codice.",
  "contacts.verify.tampered_body":
    "Questo QR sembra manomesso: il suo ID non corrisponde alla sua chiave.",
  "contacts.verify.choose_title": "Come vuoi controllare?",
  "contacts.verify.choose_body":
    "Entrambi confermano che le chiavi su questo telefono appartengono davvero a {name}.",
  "contacts.verify.method_scan": "Scansiona il loro codice",
  "contacts.verify.method_scan_sub": "Sono qui con te",
  "contacts.verify.method_compare": "Confronta un codice",
  "contacts.verify.method_compare_sub":
    "Leggetelo a vicenda durante una chiamata",
  "contacts.verify.no_keys":
    "Non ci sono ancora chiavi per questo contatto. Scrivi loro, oppure scansiona il loro codice quando vi incontrate.",
  "contacts.verify.compare_title": "Leggete questi a vicenda",
  "contacts.verify.compare_body":
    "{name} vede le stesse sei parole. Se corrispondono, entrambi sapete che le chiavi sono autentiche.",
  "contacts.verify.codes_match": "Corrispondono",
  "contacts.verify.codes_differ": "Non corrispondono",
  "contacts.verify.compared_body":
    "Tu e {name} avete confermato lo stesso codice. Questo contatto è verificato.",

  // ---- Settings: shared chrome ----
  "settings.back": "Torna indietro",
  "settings.coming_soon": "In arrivo",
  "settings.opens_externally": "{label}, si apre fuori dall’app",
  "settings.peer_id": "ID peer",
  "settings.share_peer_id": "Condividi il tuo ID peer",
  "settings.share_id_short": "Condividi ID",
  "settings.peer_id_sheet.title": "Il tuo ID peer",
  "settings.peer_id_sheet.copy": "Copia l’ID peer",
  "settings.peer_id_sheet.note":
    "Funziona solo quando siete entrambi nel raggio del Bluetooth. Per farti scrivere da ovunque, condividi invece il tuo codice QR.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Generali",
  "settings.section.general_desc":
    "Funzioni opzionali, annulla invio, media, ripristino",
  "settings.section.privacy": "Privacy e sicurezza",
  "settings.section.privacy_desc":
    "Forward secrecy, pacchetti firmati, peer bloccati",
  "settings.section.network": "Rete e relay",
  "settings.section.network_desc":
    "Ripiego su internet, relay nostr, compatibilità con bitchat",
  "settings.section.permissions": "Permessi",
  "settings.section.permissions_desc":
    "Bluetooth, posizione, notifiche, fotocamera, microfono",
  "settings.section.storage": "Archiviazione e dati",
  "settings.section.diagnostics": "Diagnostica",

  // ---- Settings: group headings ----
  "settings.group.transports": "Trasporti",
  "settings.group.nearby": "Vicinanze",
  "settings.group.sync": "Sincronizzazione",
  "settings.group.features": "Funzioni",
  "settings.group.messages": "Messaggi",
  "settings.group.media": "Media",
  "settings.group.reset": "Ripristino",
  "settings.group.always_on": "Sempre attivo",
  "settings.group.notifications": "Notifiche",
  "settings.group.blocked": "Bloccati",
  "settings.group.theme": "Tema",
  "settings.group.font": "Carattere",
  "settings.group.language": "Lingua",
  "settings.section.diagnostics_desc":
    "Stato della connessione e dispositivi vicini",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Collegamenti Bluetooth",
  "settings.diag.ble_links_desc":
    "Dispositivi a cui questo telefono è connesso direttamente",
  "settings.diag.lan": "Rete locale",
  "settings.diag.lan_desc": "Telefoni sulla stessa rete Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Da telefono a telefono senza router",
  "settings.diag.wifi_active": "In funzione",
  "settings.diag.wifi_unsupported": "Non supportato su questo dispositivo",
  "settings.diag.wifi_permission": "Bloccato da un permesso",
  "settings.diag.wifi_unavailable": "Non disponibile al momento",
  "settings.diag.wifi_unpaired": "Nessun abbinamento",
  "settings.diag.wifi_unknown": "In attesa della radio",
  "settings.diag.relays": "Relay Nostr",
  "settings.diag.relays_desc":
    "Usati per i canali di posizione e la portata via internet",
  "settings.diag.connected": "Connesso",
  "settings.diag.disconnected": "Non connesso",
  "settings.diag.peer_direct": "Collegamento diretto",
  "settings.diag.peer_relayed": "Sentito tramite un altro dispositivo",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Nessuna lettura del segnale",
  "settings.diag.no_peers": "Nessuno nel raggio",
  "settings.diag.no_peers_desc": "{links} collegamenti radio aperti",
  "settings.diag.gcs_size": "Dimensione del filtro",
  "settings.diag.gcs_size_desc":
    "Il filtro di sincronizzazione più grande trasmesso",
  "settings.diag.fpr": "Tasso di falsi positivi",
  "settings.diag.fpr_desc":
    "Con quale frequenza il filtro dichiara un pacchetto che non abbiamo",
  "settings.diag.bytes": "{n} byte",
  "settings.diag.footnote":
    "Qui non si può cambiare nulla. Questi valori sono fissi perché Airhop resti compatibile con bitchat.",
  "settings.section.storage_desc": "Utilizzo e cache",
  "settings.section.appearance": "Aspetto",
  "settings.section.appearance_desc": "Tema, carattere e lingua",
  "settings.section.help": "Aiuto e riscontri",
  "settings.section.help_desc":
    "Scrivici, segnala un problema o leggi le domande frequenti",
  "settings.section.support": "Sostegno",
  "settings.section.support_desc": "Aiuta a mantenere attivo lo sviluppo",
  "settings.section.about": "Informazioni",
  "settings.section.about_desc":
    "Versione, registro delle modifiche e sorgente",

  // ---- Settings: general ----
  "settings.general.undo": "Annulla invio",
  "settings.general.feature_ai": "IA",
  "settings.general.feature_wallet": "Portafoglio",
  "settings.general.undo_seconds": "{count} secondi",
  "settings.general.undo_a11y": "Annulla invio: {value}",
  "settings.general.quality_a11y":
    "Imposta la qualità di caricamento su {value}",
  "settings.general.undo_desc":
    "Trattiene per un attimo il messaggio inviato così puoi ritirarlo prima che parta",
  "settings.general.undo_off_desc":
    "Invia subito, senza possibilità di annullare",
  "settings.general.undo_2": "2 secondi",
  "settings.general.undo_2_desc": "Un attimo per ritirarlo",
  "settings.general.undo_10": "10 secondi",
  "settings.general.undo_10_desc": "La finestra più lunga",
  "settings.general.quality": "Qualità di caricamento",
  "settings.general.quality_desc":
    "Vale per le foto inviate dalla fotocamera o dalla galleria. In ogni caso ogni foto viene adattata alla mesh.",
  "settings.general.quality_low": "Bassa",
  "settings.general.quality_low_desc": "Foto più piccole, invio più rapido",
  "settings.general.quality_medium": "Media",
  "settings.general.quality_medium_desc": "Equilibrio tra dettaglio e velocità",
  "settings.general.quality_high": "Alta",
  "settings.general.quality_high_desc": "Conserva il massimo dettaglio",
  "settings.general.feature_wallet_desc":
    "Invia ecash Cashu da persona a persona sulla mesh",
  "settings.general.feature_wallet_a11y": "Portafoglio (sempre attivo)",
  "settings.general.feature_ai_desc":
    "Assistente privato sul dispositivo, senza chiamate di rete",
  "settings.general.feature_feeds": "Feed",
  "settings.general.feature_feeds_desc":
    "Leggi e pubblica sui feed di Bluesky e Mastodon",
  "settings.general.show_media": "Mostra i media automaticamente",
  "settings.general.show_media_desc":
    "Le foto e i video compaiono nella chat, oppure restano dietro un tocco",
  "settings.general.reset": "Ripristina le impostazioni",
  "settings.general.media_retention": "Conserva i media per",
  "settings.general.media_retention_desc":
    "Foto, video e note vocali vengono eliminati dopo il tempo scelto",
  "settings.general.media_retention_sheet":
    "Scegli per quanto tempo i media restano su questo dispositivo. I media eliminati non si possono recuperare.",
  "settings.general.retention_7_desc":
    "Lascia meno tracce di tutti. È la scelta migliore se il rischio è il telefono stesso.",
  "settings.general.retention_14_desc":
    "Una via di mezzo per una o due settimane lontano dal segnale.",
  "settings.general.retention_30_desc":
    "Mantiene le conversazioni leggibili più a lungo e occupa più spazio.",
  "settings.general.reset_desc":
    "Riporta ogni preferenza al valore predefinito, lasciando intatti identità, messaggi, contatti e portafoglio",
  "settings.general.reset_title": "Ripristinare le impostazioni?",
  "settings.general.reset_body":
    "Ogni preferenza torna al valore predefinito: aspetto, annulla invio e connettività (internet, Tor, gateway, ponte, relay). Identità, messaggi, contatti e portafoglio restano intatti.",
  "settings.general.reset_confirm": "Ripristina",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet è sempre attivo per i messaggi diretti",
  "settings.security.signed_packets": "Pacchetti firmati",
  "settings.security.signed_packets_desc":
    "Ogni pacchetto è firmato con Ed25519",
  "settings.security.hide_previews": "Nascondi le anteprime delle notifiche",
  "settings.security.hide_previews_desc":
    "Tiene mittente e messaggio fuori dalla schermata di blocco, che li mostra senza sbloccare",
  "settings.security.no_blocked": "Nessun peer bloccato",
  "settings.security.no_blocked_desc":
    "I peer bloccati non possono scriverti e non compaiono nella scheda Mesh",
  "settings.security.unblock_title": "Sblocca questo peer",
  "settings.security.unblock": "Sblocca",
  "settings.security.unblock_peer": "Sblocca {name}",
  "settings.security.unblock_body":
    "{name} potrà scriverti di nuovo e ricomparirà nella scheda Mesh quando sarà nelle vicinanze.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Ripiego su internet",
  "settings.network.internet_desc":
    "Prosegui tramite i relay Nostr quando i peer della mesh sono fuori portata",
  "settings.network.internet_off_title": "Disattivare internet?",
  "settings.network.internet_off_body":
    "Airhop funzionerà solo via Bluetooth. Smetterà di contattare qualsiasi relay Nostr, e Tor, il gateway internet e il ponte mesh si spegneranno tutti. La chat Bluetooth nelle vicinanze continua a funzionare.",
  "settings.network.turn_off": "Disattiva",
  "settings.network.discovery": "Ricerca geografica dei relay",
  "settings.network.discovery_desc":
    "Seleziona automaticamente i relay più vicini a una cella di posizione tra oltre 300 relay distribuiti",
  "settings.network.discovery_needs_relay":
    "Aggiungi prima un relay personalizzato",
  "settings.network.discovery_needs_relay_body":
    "È la ricerca automatica a indirizzare Airhop verso i relay più vicini. Disattivarla ha senso solo dopo aver fissato i tuoi relay qui sotto, quindi aggiungine almeno uno.",
  "settings.network.custom_only_title": "Usare solo i tuoi relay?",
  "settings.network.custom_only_body":
    "I canali di posizione e il ponte mesh smetteranno di scegliere automaticamente i relay più vicini e useranno solo quelli che hai aggiunto. Questo può ridurre la portata, e potresti smettere di incontrare gli utenti bitchat, che si concentrano sui relay più vicini.",
  "settings.network.custom": "Relay personalizzati",
  "settings.network.custom_desc":
    "Aggiungi i tuoi relay per i canali di posizione e il ponte mesh",
  "settings.network.custom_added": "{count} di {max} aggiunti",
  "settings.network.dm_relays": "Relay dei messaggi",
  "settings.network.dm_relays_desc":
    "I messaggi diretti e i canali privati usano sempre questi. I relay personalizzati non li cambiano.",
  "settings.network.discovery_back_on":
    "Ricerca geografica dei relay riattivata",
  "settings.network.discovery_back_on_body":
    "Quello era il tuo ultimo relay personalizzato. I canali di posizione hanno bisogno di un posto dove pubblicare, quindi Airhop torna a selezionare automaticamente i relay più vicini.",
  "settings.network.add_relay": "Aggiungi un relay",
  "settings.network.remove_relay": "Rimuovi {url}",
  "settings.network.add_short": "Aggiungi",
  "settings.network.relay_limit":
    "Puoi aggiungere {count} relay. Rimuovine uno per aggiungerne un altro.",
  "settings.network.relay_duplicate": "Quel relay è già nel tuo elenco.",
  "settings.network.relay_invalid":
    "Inserisci un host relay valido, ad esempio relay.example.com. La porta serve solo se il relay non usa quella predefinita. Gli indirizzi IP e i nomi locali non sono ammessi.",
  "settings.network.wifi_pair": "Abbinamento",
  "settings.network.wifi_paired": "Dispositivi abbinati",
  "settings.network.wifi_pair_find": "Trova un dispositivo",
  "settings.network.wifi_pair_find_desc":
    "Cerca un iPhone vicino che si sta mostrando. Servono iOS 26 o successivo su entrambi.",
  "settings.network.wifi_pair_show": "Mostra questo iPhone",
  "settings.network.wifi_pair_show_desc":
    "Lascia che un iPhone vicino trovi questo. Uno cerca, l’altro si mostra, nello stesso momento.",
  "settings.network.wifi_pair_find_action": "Scegli un iPhone vicino",
  "settings.network.wifi_pair_show_action": "Rendi rilevabile questo iPhone",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware non è disponibile al momento",
  "settings.network.wifi_pair_forget":
    "Rimuovi un abbinamento nell’app Settings",
  "settings.network.bitchat": "Compatibilità con bitchat",
  "settings.network.bitchat_desc":
    "La stessa mesh BLE di bitchat, pienamente interoperabile. È sempre attiva e non si può disattivare.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Esegui in background",
  "settings.conn.background_desc":
    "Tieni la mesh in funzione quando Airhop è chiusa",
  "settings.conn.background_on_title": "Tenere la mesh in funzione?",
  "settings.conn.background_on_body":
    "Airhop continua a inoltrare e ricevere anche da chiusa, così i messaggi arrivano mentre sei via. Android mostra una notifica permanente mentre lo fa.",
  "settings.conn.background_off_title":
    "Fermare la mesh alla chiusura di Airhop?",
  "settings.conn.background_off_body":
    "I messaggi arriveranno solo con Airhop aperta, e questo telefono smetterà di inoltrare per chi è nelle vicinanze. La notifica permanente sparisce.",
  "settings.conn.live_voice": "Voce in diretta",
  "settings.conn.live_voice_desc":
    "Parla con chi è vicino come con un walkie-talkie",
  "settings.conn.live_voice_on_title": "Attivare la voce in diretta?",
  "settings.conn.live_voice_on_body":
    "Tenendo premuto il microfono, la tua voce raggiunge tutti quelli nel raggio del Bluetooth mentre parli, e la loro esce dal tuo telefono. Non viene registrato nulla.",
  "settings.conn.live_voice_off_title": "Disattivare la voce in diretta?",
  "settings.conn.live_voice_off_body":
    "Tenere premuto il microfono registrerà invece una nota vocale. Parte quando lasci, e nessuno la sente finché non la riproduce.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Instradamento su Tor",
  "settings.conn.tor_desc":
    "Instrada il traffico Nostr attraverso Tor per maggiore riservatezza",
  "settings.conn.tor_on_title": "Instradare il traffico Nostr su Tor?",
  "settings.conn.tor_on_body":
    "I relay smetteranno di vedere il tuo indirizzo IP. La connessione richiede più tempo e i messaggi arrivano più lentamente. Il Bluetooth non è toccato.",
  "settings.conn.tor_off_title": "Disattivare l’instradamento su Tor?",
  "settings.conn.tor_off_body":
    "Il traffico Nostr torna sulla tua connessione normale, quindi i relay rivedranno il tuo indirizzo IP. In ogni caso il Bluetooth non è toccato.",
  "settings.conn.tor_orbot_idle":
    "Orbot è installato ma non connesso. Apri Orbot, avvia la sua VPN e poi attiva questa opzione.",
  "settings.conn.tor_unavailable":
    "L’instradamento su Tor non è disponibile in questa build.",
  "settings.conn.tor_timeout":
    "Tor sta impiegando più di un minuto a connettersi. Resta attivo e continua a provare; la scheda Mesh dirà quando sta instradando, o se questa rete lo sta bloccando.",
  "settings.conn.tor_failed":
    "Non è stato possibile avviare Tor. Verifica che l’app abbia accesso alla rete.",
  "settings.conn.mint_clearnet":
    "Consenti il traffico verso il mint sulla rete in chiaro",
  "settings.conn.mint_clearnet_desc":
    "Su iOS Tor copre solo Nostr. Lascialo disattivato per bloccare le richieste al mint; in ogni caso l’ecash sulla mesh continua a funzionare.",
  "settings.conn.gateway": "Gateway internet",
  "settings.conn.gateway_desc":
    "Presta la tua connessione a un telefono vicino senza rete perché possa comunque raggiungere i canali di posizione",
  "settings.conn.gateway_on_title": "Attivare il gateway internet?",
  "settings.conn.gateway_on_body":
    "I telefoni vicini senza una connessione propria invieranno e riceveranno i messaggi dei canali di posizione tramite la tua. Consuma i tuoi dati mobili e la tua batteria, e i loro messaggi restano cifrati da un capo all’altro, quindi non puoi leggere ciò che passa.",
  "settings.conn.gateway_off_title": "Disattivare il gateway internet?",
  "settings.conn.gateway_off_body":
    "I telefoni vicini senza rete smetteranno di raggiungere i canali di posizione tramite la tua. I tuoi messaggi non sono toccati.",
  "settings.conn.bridge": "Ponte mesh",
  "settings.conn.bridge_desc":
    "Collega la chat pubblica #bluetooth di questa zona con un altro gruppo Bluetooth fuori portata tramite internet",
  "settings.conn.bridge_on_title": "Attivare il ponte mesh?",
  "settings.conn.bridge_on_body":
    "I tuoi messaggi pubblici su #bluetooth verranno pubblicati nel tuo quartiere tramite internet, così potranno leggerli anche persone fuori dal raggio del Bluetooth. I messaggi privati non passano mai dal ponte, e «solo vicino» mantiene locale un singolo messaggio.",
  "settings.conn.bridge_off_title": "Disattivare il ponte mesh?",
  "settings.conn.bridge_off_body":
    "I tuoi messaggi pubblici su #bluetooth restano di nuovo nel raggio del Bluetooth, e quelli del gruppo collegato smettono di arrivare qui.",
  "settings.conn.bridge_needs_location": "Il ponte mesh richiede la posizione",
  "settings.conn.bridge_needs_location_desc":
    "Individua il tuo quartiere da una rilevazione di posizione. Concedi la posizione per iniziare a collegare.",
  "settings.conn.grant_location": "Concedi il permesso di posizione",
  "settings.conn.grant_short": "Concedi",
  "settings.conn.orbot_body":
    "Airhop instrada il traffico Tor tramite Orbot. Installa e abilita Orbot dal Play Store, poi attiva questa opzione.",
  "settings.conn.internet_off": "Internet è disattivato",
  "settings.conn.internet_off_desc":
    "Tor, il ponte e il gateway usano tutti internet. Attiva il ripiego su internet sotto Rete per usarli.",
  "settings.conn.turn_on": "Attiva",
  "settings.conn.turn_off": "Disattiva",
  "settings.conn.orbot_title": "Tor su Android",
  "settings.conn.get_orbot": "Scarica Orbot",
  "settings.conn.later": "Più tardi",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Trova i dispositivi vicini e inoltra i messaggi tra loro. Senza, la mesh non può funzionare.",
  "settings.permissions.location": "Posizione",
  "settings.permissions.location_desc":
    "Apre i canali delle zone vicine. Senza, quei canali restano chiusi e la mesh Bluetooth prosegue normalmente.",
  "settings.permissions.notifications": "Notifiche",
  "settings.permissions.notifications_desc":
    "Ricevi avvisi per i nuovi messaggi anche ad app chiusa. Senza, li vedrai solo aprendo Airhop.",
  "settings.permissions.camera": "Fotocamera",
  "settings.permissions.camera_desc":
    "Scansiona codici QR e scatta foto o video da inviare. Senza, puoi comunque condividere media dalla galleria.",
  "settings.permissions.photos": "Foto",
  "settings.permissions.photos_desc":
    "Invia foto dalla galleria e salva i media ricevuti. Senza, puoi comunque scattare e inviare foto nuove con la fotocamera.",
  "settings.permissions.microphone": "Microfono",
  "settings.permissions.microphone_desc":
    "Registra e invia messaggi vocali o usa la voce in diretta. Senza, i messaggi vocali e la voce in diretta non funzioneranno.",
  "settings.permissions.allow": "Concedi questo permesso",
  "settings.permissions.open_settings":
    "Apri le impostazioni di sistema per cambiare questo permesso",
  "settings.permissions.system": "Sistema",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Utilizzo della rete",
  "settings.storage.storage_usage": "Utilizzo dell’archiviazione",
  "settings.storage.storage_usage_desc":
    "Messaggi, prove del portafoglio e allegati in cache",
  "settings.storage.session_usage":
    "Questa sessione · {sent} inviati, {received} ricevuti",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} di allegati",
  "settings.storage.clear_cache": "Svuota la cache degli allegati",
  "settings.storage.clear": "Svuota",
  "settings.storage.clear_title": "Svuotare i media in cache?",
  "settings.storage.clear_body":
    "Foto, video, note vocali e file vengono rimossi da questo dispositivo, sia quelli inviati sia quelli ricevuti. Non si possono scaricare di nuovo: i loro fumetti lo indicheranno e potrai chiedere al mittente di rimandarli. Messaggi e portafoglio restano intatti.",
  "settings.storage.cleared": "Cache svuotata",
  "settings.storage.freed": "Liberati {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Imposta l’aspetto su {value}",
  "settings.font.set_a11y":
    "Imposta il carattere a spaziatura fissa su {value}",
  "settings.font.system": "Sistema",
  "settings.font.system_desc":
    "Usa il carattere a spaziatura fissa predefinito del dispositivo",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Moderno e facile da leggere",
  "settings.language.en": "Inglese",
  "settings.language.am": "Amarico",
  "settings.language.ar": "Arabo",
  "settings.language.bn": "Bengalese",
  "settings.language.my": "Birmano",
  "settings.language.zh_hans": "Cinese (semplificato)",
  "settings.language.zh_hant": "Cinese (tradizionale)",
  "settings.language.nl": "Olandese",
  "settings.language.fil": "Filippino",
  "settings.language.fr": "Francese",
  "settings.language.ka": "Georgiano",
  "settings.language.de": "Tedesco",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesiano",
  "settings.language.it": "Italiano",
  "settings.language.ja": "Giapponese",
  "settings.language.ko": "Coreano",
  "settings.language.mg": "Malgascio",
  "settings.language.ms": "Malese",
  "settings.language.ne": "Nepalese",
  "settings.language.fa": "Persiano",
  "settings.language.pl": "Polacco",
  "settings.language.pt_br": "Portoghese (Brasile)",
  "settings.language.pt_pt": "Portoghese (Portogallo)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Russo",
  "settings.language.es": "Spagnolo",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Svedese",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thai",
  "settings.language.tr": "Turco",
  "settings.language.uk": "Ucraino",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamita",
  "settings.language.pseudo": "Pseudolingua",
  "settings.language.soon": "In arrivo",
  "settings.language.soon_a11y": "{value}, in arrivo",
  "settings.language.set_a11y": "Imposta la lingua su {value}",
  "settings.language.pending": "Alla prossima apertura",
  "settings.language.pending_a11y":
    "{value}, si applica alla prossima apertura di Airhop",
  "settings.language.rtl_title": "Riapri Airhop per completare",
  "settings.language.rtl_body":
    "{value} si legge da destra a sinistra, e Airhop può cambiare direzione solo all’avvio. Chiudila e riaprila per completare il passaggio. Non si perde nulla, e fino ad allora la tua mesh resta connessa.",
  "settings.theme.light": "Chiaro",
  "settings.theme.light_desc": "Usa sempre la tavolozza chiara",
  "settings.theme.dark": "Scuro",
  "settings.theme.dark_desc": "Usa sempre la tavolozza scura",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Individuabile, in annuncio e in scansione",
  "settings.status.away": "Assente",
  "settings.status.away_desc": "Mesh in pausa, senza scansione né annuncio",
  "settings.status.invisible": "Invisibile",
  "settings.status.invisible_desc": "In scansione, ma nascosto alla ricerca",
  "settings.status.title": "Stato",
  "settings.status.set_a11y": "Imposta lo stato su {value}",
  "settings.status.edit": "Modifica lo stato",
  "settings.status.desc": "Scegli quanto sei visibile sulla mesh.",
  "settings.transfer.identity": "Identità e chiavi",
  "settings.transfer.identity_desc":
    "Il tuo ID peer, il nome utente e i contatti",
  "settings.transfer.chats": "Chat e cronologia",
  "settings.transfer.chats_desc":
    "Conversazioni, gruppi e i canali a cui ti sei unito",
  "settings.transfer.wallet": "Saldo del portafoglio",
  "settings.transfer.wallet_desc": "Prove Cashu e cronologia delle transazioni",
  "settings.transfer.title": "Passa a un telefono nuovo",
  "settings.transfer.desc":
    "Sposta identità, chat e portafoglio su un altro dispositivo",
  "settings.transfer.coming_soon_a11y": "Passa a un telefono nuovo, in arrivo",
  "settings.transfer.body":
    "Tieni i due telefoni vicini e sposta tutto via Bluetooth. Nulla passa da un server, quindi funziona senza internet.",
  "settings.qr.permission_label": "Accesso alle foto",
  "settings.qr.permission_purpose": "salvare il tuo codice QR",
  "settings.qr.saved": "Salvato",
  "settings.qr.saved_body": "Codice QR salvato nella tua galleria foto.",
  "settings.qr.save_failed": "Non è stato possibile salvare",
  "settings.qr.save_failed_body":
    "Non è stato possibile salvare il codice QR. Riprova.",
  "settings.qr.share_message": "Aggiungimi su Airhop",
  "settings.qr.share_body":
    "Aggiungimi su Airhop — messaggistica mesh privata, pensata prima di tutto per l’offline.",
  "settings.qr.show_short": "Mostra QR",
  "settings.qr.title": "Il tuo codice QR",
  "settings.qr.note":
    "Contiene le tue chiavi pubbliche, che permettono agli altri di scriverti da ovunque. Condividilo solo con persone di cui ti fidi. Non cambierà a meno che tu non cancelli la tua identità.",
  "settings.qr.code_label": "Codice contatto",
  "settings.qr.copy_code": "Copia il codice contatto",
  "settings.qr.share": "Condividi il codice QR",
  "settings.qr.share_short": "Condividi QR",
  "settings.qr.download": "Scarica il codice QR",
  "settings.qr.download_short": "Scarica QR",
  "settings.qr.show": "Mostra il codice QR",
  "settings.wipe.trigger": "Avvia la cancellazione d’emergenza",
  "settings.wipe.trigger_desc":
    "Tocca tre volte per cancellare subito senza conferma",
  "settings.wipe.title": "Cancellazione d’emergenza",
  "settings.wipe.now": "Cancella ora",
  "settings.wipe.desc":
    "Distrugge all’istante tutte le chiavi, i messaggi e le prove",
  "settings.wipe.body":
    "Questo distruggerà all’istante tutte le tue chiavi, i messaggi e le prove del portafoglio. Non si può annullare.",
  "settings.wipe.in_progress": "Cancellazione in corso",
  "settings.wipe.in_progress_body":
    "Distruzione di chiavi, messaggi e file. Richiede qualche secondo e si completa da sola anche se l’app viene chiusa.",
  "settings.wipe.got_it": "Ho capito",
  "settings.wipe.keys_failed": "Non è stato possibile distruggere le chiavi",
  "settings.wipe.keys_failed_body":
    "Messaggi, contatti e portafoglio sono spariti, ma il dispositivo si è rifiutato di rilasciare le tue chiavi. Sbloccalo e cancella di nuovo.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Scrivici",
  "settings.help.contact_a11y": "Manda un’email a {address}",
  "settings.help.bug": "Segnala un problema",
  "settings.help.bug_desc": "Apri una segnalazione su GitHub",
  "settings.help.bug_a11y": "Segnala un problema su GitHub",
  "settings.help.faq": "Domande frequenti",
  "settings.help.faq_desc": "Risposte alle domande più comuni",
  "settings.help.faq_a11y": "Apri le domande frequenti",
  "settings.help.terms_desc": "Come si può usare Airhop",
  "settings.help.terms_a11y": "Apri i Termini di servizio",
  "settings.help.privacy_desc": "Quello che non raccogliamo",
  "settings.help.privacy_a11y": "Apri l’Informativa sulla privacy",

  // ---- Settings: support ----
  "settings.support.card": "Carta o UPI",
  "settings.support.card_desc": "Home banking e portafogli, in tutto il mondo",
  "settings.support.card_a11y":
    "Sostieni con carta, UPI, home banking o portafoglio",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Mensile o una tantum, senza commissioni di piattaforma",
  "settings.support.sponsors_a11y": "Sostieni tramite GitHub Sponsors",
  "settings.support.note":
    "Costruisco Airhop nel tempo libero. Non ci sono investitori né pubblicità. Se ti è utile, un contributo aiuta molto a mantenere attivo lo sviluppo. In ogni caso ogni funzione resta gratuita.",

  // ---- Settings: about and version ----
  "settings.about.version": "Versione",
  "settings.about.version_desc": "Versione attuale",
  "settings.about.version_a11y":
    "Vedi la versione e controlla gli aggiornamenti",
  "settings.about.release_notes": "Note di rilascio",
  "settings.about.release_notes_desc": "Le novità dell’ultima versione",
  "settings.about.release_notes_a11y":
    "Apri le note dell’ultima versione su GitHub",
  "settings.about.source": "Codice sorgente",
  "settings.about.source_a11y": "Apri il codice sorgente su GitHub",
  "settings.about.licenses": "Licenze open source",
  "settings.about.open_repo": "Apri il repository di {name}",
  "settings.about.licenses_desc": "Pacchetti open source di terze parti",
  "settings.about.licenses_a11y": "Vedi le licenze di terze parti",
  "settings.version.codename": "Nome in codice",
  "settings.version.checking": "Controllo in corso",
  "settings.version.check": "Cerca aggiornamenti",
  "settings.version.checking_title": "Ricerca di aggiornamenti",
  "settings.version.up_to_date": "Stai usando l’ultima versione.",
  "settings.version.release_notes": "Vedi le note di rilascio",
  "settings.version.made_with": "Realizzato con",
  "settings.version.number": "Versione {version}",
  "settings.version.update_to": "Aggiorna a {version}",
  "settings.version.update_to_a11y": "Aggiorna alla versione {version}",
  "settings.version.released_under": "Distribuito con licenza {license}",
  "settings.version.notes_a11y":
    "Vedi le note di rilascio della versione {version}",
  "settings.version.tor_paused":
    "Il controllo degli aggiornamenti è sospeso mentre Tor è attivo, per non esporre il tuo IP. Consulta la pagina delle versioni in un browser.",
  "settings.version.check_failed":
    "Non è stato possibile cercare aggiornamenti. Controlla la connessione e riprova.",
  "settings.version.downloading": "Download in corso {percent}%",
  "settings.version.install": "Installa",
  "settings.version.download_failed":
    "Download non riuscito. Controlla la connessione e riprova.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} pesa {size} KiB e supera il limite di {cap} KiB.",
  "transfer.failed.malformed":
    "È arrivato un allegato danneggiato che non è stato possibile aprire. Chiedi di inviarlo di nuovo.",
  "transfer.failed.unsupported_type":
    "È arrivato un allegato in un formato che questa app non può aprire.",
  "transfer.failed.type_mismatch":
    "Un allegato è stato rifiutato: il contenuto non corrisponde al tipo di file dichiarato.",
  "transfer.failed.storage":
    "È arrivato un allegato ma non è stato possibile salvarlo. Controlla lo spazio libero.",
  "transfer.badge.waiting": "In attesa · {name}",
  "transfer.badge.active_count": "{count} trasferimenti",
  "transfer.badge.sending": "Invio di {name}",
  "transfer.badge.receiving": "Ricezione di {name}",
  "transfer.badge.a11y": "{label}, {percent} per cento. Apri la conversazione.",
  "transfer.kind.photo": "Foto",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Nota vocale",
  "transfer.this.photo": "Questa foto",
  "transfer.this.video": "Questo video",
  "transfer.this.voice": "Questa nota vocale",
  "transfer.this.file": "Questo file",
  "transfer.kind.document": "Documento",
  "transfer.kind.voice_preview": "Nota vocale",
  "transfer.kind.photo_preview": "Foto",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Documento",

  // ---- System notifications ----
  "notif.channel.messages": "Messaggi",
  "notif.channel.nearby": "Peer nelle vicinanze",
  "notif.channel.nearby_desc":
    "Un avviso occasionale quando la mesh trova persone nel raggio del Bluetooth.",
  "notif.nearby.body":
    "Ora nel raggio del Bluetooth. Tocca per aprire la mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Qualcuno",
  "notif.notice_urgent": "Avviso urgente · {content}",
  "notif.notice": "Avviso · {content}",
  "notif.incoming_file": "File in arrivo",
  "notif.preview.photo": "📷 Foto",
  "notif.preview.voice": "🎤 Messaggio vocale",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Documento",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Nuovo messaggio",
  "notif.hidden.channel": "Nuova attività",
  "notif.hidden.mention": "Sei stato menzionato",
  "notif.mention.title": "{sender} ti ha menzionato",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Mostra altri {count}",
    many: "Mostra altri {count}",
    other: "Mostra altri {count}",
  },
  "chat.channels.show_more_a11y": {
    one: "Mostra un altro canale predefinito",
    many: "Mostra altri {count} canali predefiniti",
    other: "Mostra altri {count} canali predefiniti",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} non letto",
    many: "{label}, {count} non letti",
    other: "{label}, {count} non letti",
  },
  "a11y.new_count": {
    one: "{label}, {count} nuovo",
    many: "{label}, {count} nuovi",
    other: "{label}, {count} nuovi",
  },
  "chat.a11y.unread": {
    one: "{count} non letto",
    many: "{count} non letti",
    other: "{count} non letti",
  },
  "chat.thread.length_left": {
    one: "{count} rimasto",
    many: "{count} rimasti",
    other: "{count} rimasti",
  },
  "settings.general.retention_days": {
    one: "{count} giorno",
    many: "{count} giorni",
    other: "{count} giorni",
  },
  "chat.info.group_reach": {
    one: "{reachable} membro su {count} raggiungibile",
    many: "{reachable} membri su {count} raggiungibili",
    other: "{reachable} membri su {count} raggiungibili",
  },
  "chat.group_members": {
    one: "Gruppo privato  ·  {count} membro",
    many: "Gruppo privato  ·  {count} membri",
    other: "Gruppo privato  ·  {count} membri",
  },
  "chat.select.count": {
    one: "{count} selezionato",
    many: "{count} selezionati",
    other: "{count} selezionati",
  },
  "chat.select.forward": {
    one: "Inoltra {count} messaggio",
    many: "Inoltra {count} messaggi",
    other: "Inoltra {count} messaggi",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} sta parlando",
    many: "{count} stanno parlando",
    other: "{count} stanno parlando",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} peer nel raggio",
    many: "{count} peer nel raggio",
    other: "{count} peer nel raggio",
  },
  "mesh.peer.hops_away": {
    one: "a {count} salto",
    many: "a {count} salti",
    other: "a {count} salti",
  },
  "chat.presence.active": {
    one: "{count} attivo",
    many: "{count} attivi",
    other: "{count} attivi",
  },
  "chat.presence.nearby": {
    one: "{count} nelle vicinanze",
    many: "{count} nelle vicinanze",
    other: "{count} nelle vicinanze",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mint",
    many: "{count} mint",
    other: "{count} mint",
  },
  "wallet.mint.remove_body": {
    one: "{mint} custodisce {balance} {unit} in {count} prova. Rimuoverlo cancella quella prova da questo dispositivo in modo permanente e non esiste alcun backup. Preleva o invia prima il saldo.",
    many: "{mint} custodisce {balance} {unit} in {count} prove. Rimuoverlo cancella quelle prove da questo dispositivo in modo permanente e non esiste alcun backup. Preleva o invia prima il saldo.",
    other:
      "{mint} custodisce {balance} {unit} in {count} prove. Rimuoverlo cancella quelle prove da questo dispositivo in modo permanente e non esiste alcun backup. Preleva o invia prima il saldo.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} deposito in attesa di pagamento. Viene ricontrollato a ogni apertura dell’app.",
    many: "{count} depositi in attesa di pagamento. Vengono ricontrollati a ogni apertura dell’app.",
    other:
      "{count} depositi in attesa di pagamento. Vengono ricontrollati a ogni apertura dell’app.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Recuperata {count} prova non spesa da {mints}.",
    many: "Recuperate {count} prove non spese da {mints}.",
    other: "Recuperate {count} prove non spese da {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "È stata trovata {count} moneta, ma era già spesa, quindi non è stato accreditato nulla. È normale: ogni moneta che hai speso resta nei registri conservati dal mint.",
    many: "Sono state trovate {count} monete, ma erano già spese, quindi non è stato accreditato nulla. È normale: ogni moneta che hai speso resta nei registri conservati dal mint.",
    other:
      "Sono state trovate {count} monete, ma erano già spese, quindi non è stato accreditato nulla. È normale: ogni moneta che hai speso resta nei registri conservati dal mint.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Mostra altri {count}",
    many: "Mostra altri {count}",
    other: "Mostra altri {count}",
  },
  "wallet.activity.show_more_a11y": {
    one: "Mostra un altro pagamento",
    many: "Mostra altri {count} pagamenti",
    other: "Mostra altri {count} pagamenti",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} non confermata",
    many: "{count} non confermate",
    other: "{count} non confermate",
  },
  "wallet.proof_count": {
    one: "{count} prova",
    many: "{count} prove",
    other: "{count} prove",
  },
  "wallet.spent_removed_detail": {
    one: "{count} prova era già spesa ed è stata rimossa.",
    many: "{count} prove erano già spese e sono state rimosse.",
    other: "{count} prove erano già spese e sono state rimosse.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Qualcuno nelle vicinanze",
    many: "{count} persone nelle vicinanze",
    other: "{count} persone nelle vicinanze",
  },
};

export const it = { strings, plurals };
