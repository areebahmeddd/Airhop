// nl: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Annuleren",
  "common.done": "Klaar",
  "common.ok": "Oké",
  "common.close": "Sluiten",
  "common.back": "Terug",
  "common.delete": "Verwijderen",
  "common.remove": "Weghalen",
  "common.add": "Toevoegen",
  "common.copy": "Kopiëren",
  "common.copied": "Gekopieerd",
  "common.share": "Delen",
  "common.continue": "Doorgaan",
  "common.try_again": "Opnieuw proberen",
  "common.settings": "Instellingen",
  "common.off": "Uit",

  // ---- Dates ----
  "format.today": "Vandaag",
  "format.yesterday": "Gisteren",
  "format.minutes_ago": "{count} min geleden",
  "format.hours_ago": "{count} u geleden",
  "format.days_ago": "{count} d geleden",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Chats",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Portemonnee",
  "nav.tab.profile": "Jij",
  "a11y.tab.new_peers": "{label}, iemand nieuw in de buurt",
  "nav.notifications": "Meldingen",
  "chat.subtab.channels": "Kanalen",
  "chat.subtab.direct": "Direct",
  "chat.subtab.dms": "Directe berichten",
  "chat.search.placeholder": "Chats doorzoeken…",
  "chat.search.a11y": "Chats en berichten doorzoeken",
  "chat.search.close": "Zoeken sluiten",
  "chat.search.clear": "Zoekopdracht wissen",
  "mesh.view.radar": "Radarweergave",
  "mesh.view.list": "Lijstweergave",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Lijst",

  // ---- Legal document names ----
  "legal.last_updated": "Laatst bijgewerkt: {date}",
  "legal.terms": "Servicevoorwaarden",
  "legal.privacy": "Privacybeleid",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Privécommunicatie via mesh",
  "onboarding.welcome.cta": "Aan de slag",
  "onboarding.welcome.cta_hint":
    "Ga akkoord met de voorwaarden hieronder om door te gaan",
  "onboarding.welcome.consent_a11y":
    "Akkoord gaan met de Servicevoorwaarden en het Privacybeleid",
  "onboarding.welcome.open_terms": "Servicevoorwaarden openen",
  "onboarding.welcome.open_privacy": "Privacybeleid openen",
  "onboarding.welcome.consent":
    "Door op {cta} te tikken ga je akkoord met onze {terms} en ons {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Je identiteit wordt aangemaakt",
  "onboarding.identity.body":
    "Er wordt een Ed25519-sleutelpaar op dit toestel gemaakt.\nEr wordt niets ergens naartoe gestuurd.",
  "onboarding.identity.failed_heading":
    "Je sleutels konden niet worden gemaakt",
  "onboarding.identity.failed_body":
    "Dit toestel liet Airhop ze niet veilig bewaren. Probeer het opnieuw, of herstart je telefoon en open Airhop nog eens.",
  "onboarding.identity.steps_a11y": "Stappen: {steps}",
  "onboarding.identity.step.x25519": "X25519-sleutelpaar wordt aangemaakt",
  "onboarding.identity.step.ed25519":
    "Ed25519-ondertekeningssleutelpaar wordt aangemaakt",
  "onboarding.identity.step.keychain":
    "Sleutels worden in de sleutelhanger van het systeem gezet",
  "onboarding.identity.step.peer_id": "Peer-ID wordt afgeleid",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Je naam op de mesh",
  "onboarding.username.peer_id": "Peer-ID",
  "onboarding.username.card_a11y":
    "Je naam op de mesh is {username}. Peer-ID {peerID}. {props}.",
  "onboarding.username.explanation":
    "Deze gebruikersnaam wordt op een vaste manier uit je publieke sleutel afgeleid. Hij is hetzelfde op elk toestel dat je peer-ID ziet.",
  "onboarding.username.cta": "Airhop binnengaan",
  "onboarding.username.prop.algorithm": "Algoritme",
  "onboarding.username.prop.storage": "Opslag",
  "onboarding.username.prop.storage_value":
    "Alleen de sleutelhanger van het systeem",
  "onboarding.username.prop.account": "Account nodig",
  "onboarding.username.prop.account_value": "Geen",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Welkom bij Airhop",
  "onboarding.hello.p1":
    "Hoi. Airhop is bovenop bitchat gebouwd als een onafhankelijk, opensource nevenproject. Het is niet verbonden aan of goedgekeurd door het bitchat-project of permissionless tech; het is gewoon iets wat ik met plezier bouw en met de community deel.",
  "onboarding.hello.p2":
    "Dit is de eerste versie voor iOS en Android, dus ook al heb ik hem met vrienden getest, je loopt vast tegen een paar fouten aan. Als dat gebeurt, of als je een idee voor een functie hebt, hoor ik het graag. Open een issue op {github} of mail me op {email}.",
  "onboarding.hello.p3":
    "Als Airhop nuttig voor je is, overweeg dan een ster op {github} of een recensie in de {store}. Zo vinden meer mensen het project. Bedankt voor het proberen!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Voordat je telefoon het vraagt",
  "onboarding.primer.lede": "Dit doet elke toestemming, en dit doet ze niet.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Vindt toestellen in de buurt en geeft berichten tussen ze door. Zo ontstaat de mesh, en het werkt zonder internetverbinding.",
  "onboarding.primer.location.title": "Locatie",
  "onboarding.primer.location.body":
    "Zet je in de kanalen van gebieden dichtbij, van een huizenblok tot een regio. Airhop volgt je nooit en stuurt je precieze locatie nooit van je toestel af.",
  "onboarding.primer.notifications.title": "Meldingen",
  "onboarding.primer.notifications.body":
    "Krijg meldingen van nieuwe berichten, ook als de app dicht is. Meldingen worden op je eigen toestel gemaakt, zonder server ertussen.",
  "onboarding.primer.footnote":
    "Je mag nee zeggen. Berichten blijven via internet gaan, en je kunt later in de instellingen van gedachten veranderen.",
  "onboarding.primer.cta_a11y": "Door naar de toestemmingsverzoeken",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Bluetooth-toegang",
  "permission.bluetooth.purpose": "toestellen in de buurt op de mesh vinden",
  "permission.open_settings": "Instellingen openen",
  "permission.not_now": "Nu niet",
  "permission.blocked_title": "{label} staat uit",
  "permission.blocked_body": "Zet het aan in de instellingen om {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Er ging iets mis",
  "error.boundary.body":
    "Airhop liep tegen een onverwacht probleem aan en moest stoppen met wat het liet zien.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Standaardkanalen",
  "chat.channels.yours": "Jouw kanalen",
  "chat.channels.none": "Nog geen kanalen",
  "chat.channels.none_hint":
    "Tik hierboven op {plus} om er een te maken of aan een deel te nemen.",
  "chat.channels.none_desc":
    "Nog geen kanalen. Gebruik de plusknop in de kop om er een te maken of aan een deel te nemen.",
  "chat.channels.show_fewer": "Minder standaardkanalen tonen",
  "chat.channels.show_less": "Minder tonen",
  "chat.channels.info": "Kanaalinfo",
  "chat.channels.pin": "Kanaal vastzetten",
  "chat.channels.unpin": "Kanaal losmaken",
  "chat.channels.mute": "Kanaal dempen",
  "chat.channels.unmute": "Kanaal weer aanzetten",
  "chat.channels.leave": "Kanaal verlaten",
  "chat.channels.leave_confirm": "Verlaten",
  "chat.channels.clear_body":
    "Alle berichten in {name} verwijderen? Dat kan niet ongedaan worden gemaakt.",
  "chat.channels.leave_body":
    "{name} verlaten? Je krijgt de berichten niet meer, en de geschiedenis wordt van dit toestel gehaald.",
  "chat.channels.more_options": "Meer opties voor {name}",
  "chat.channels.teleported_tag": "{level}  ·  geteleporteerd",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Chat leegmaken",
  "chat.dm.remove_contact": "Contact weghalen",
  "chat.dm.block": "Deze peer blokkeren",
  "chat.dm.block_confirm": "Blokkeren",
  "chat.dm.delete": "Chat verwijderen",
  "chat.dm.delete_body":
    "Hiermee haal je het gesprek uit je lijst en verwijder je de berichten. Het contact blijft staan, en een nieuw bericht van diegene begint een nieuwe chat.",
  "chat.dm.in_range": "binnen bereik",
  "chat.dm.row_hint": "Tik twee keer en houd vast voor meer opties",
  "chat.channels.row_hint": "Tik twee keer en houd vast voor meer opties",
  "chat.dm.you_prefix": "Jij:",
  "chat.dm.none": "Geen directe berichten",
  "chat.dm.none_desc":
    "Ga naar het Mesh-tabblad en tik op een peer om een versleuteld direct bericht te beginnen.",
  "chat.dm.contact_info": "Contactinfo",
  "chat.dm.pin": "Chat vastzetten",
  "chat.dm.unpin": "Chat losmaken",
  "chat.dm.mute": "Chat dempen",
  "chat.dm.unmute": "Chat weer aanzetten",
  "chat.dm.clear_body":
    "Alle berichten met {name} verwijderen? Dat kan niet ongedaan worden gemaakt.",
  "chat.dm.remove_contact_body":
    "{name} weghalen? Hiermee verwijder je het gesprek en vergeet je het contact. Diegene kan je nog steeds bereiken door opnieuw te schrijven.",
  "chat.dm.block_body":
    "{name} blokkeren? Je ziet diegene niet meer op het Mesh-tabblad en krijgt geen berichten meer, ook niet als die in de buurt is.",
  "chat.dm.more_options": "Meer opties voor {name}",
  "chat.dm.remove_contact_short": "Contact weghalen",
  "chat.dm.block_short": "Contact blokkeren",
  "chat.dm.delete_short": "Chat verwijderen",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Berichten leegmaken",
  "chat.clear_confirm": "Leegmaken",
  "chat.group_badge": "Groep",
  "chat.more": "Meer",
  "chat.no_messages": "Nog geen berichten",
  "chat.you": "Jij",
  "chat.a11y.channel": "Kanaal {name}",
  "chat.a11y.group": "Groep {name}",
  "chat.a11y.muted": "gedempt",
  "chat.a11y.pinned": "vastgezet",

  // ---- Chats: start something new ----
  "chat.new.title": "Iets nieuws beginnen",
  "chat.new.channel": "Een privékanaal maken",
  "chat.new.channel_label": "Privékanaal",
  "chat.new.channel_desc":
    "Een ruimte waar iedereen met de link aan kan deelnemen. Maak er een, of neem deel met een link die je hebt gekregen.",
  "chat.new.group": "Een privégroep maken",
  "chat.new.group_label": "Privégroep",
  "chat.new.group_desc": "Kies specifieke mensen. Tot 16. Blijft op Bluetooth.",
  "chat.new.place": "Naar een plek via geohash",
  "chat.new.place_label": "Naar een plek",
  "chat.new.place_desc":
    "Open het locatiekanaal van waar dan ook via de geohash.",
  "chat.new.reach": "Bereik",
  "chat.new.reach_internet": "Bereikt leden via Bluetooth en via internet.",
  "chat.new.reach_mesh": "Werkt binnen Bluetooth-bereik, niet via internet.",
  "chat.new.reach_internet_desc":
    "Bereikt leden ook via internet. Relays kunnen zien dat het kanaal actief is, nooit de berichten of wie erin zit.",
  "chat.new.reach_mesh_desc":
    "Blijft op de lokale mesh. Het meest privé; er gaat niets buiten Bluetooth-bereik.",
  "chat.new.join_link":
    "Met een uitnodigingslink aan een privékanaal deelnemen",
  "chat.new.back_to_chooser": "Terug naar de keuze",
  "chat.new.create_channel": "Kanaal maken",
  "chat.new.name_required": "Vul eerst een kanaalnaam in",
  "chat.new.name_taken": "Die naam is al in gebruik",
  "chat.new.create": "Maken",
  "chat.new.e2ee":
    "End-to-end versleuteld. Alleen leden kunnen de berichten lezen.",
  "chat.new.invite_only":
    "Alleen op uitnodiging. Iedereen met wie je de link deelt kan deelnemen. Voor de rest blijft het verborgen, ook voor peers in de buurt.",
  "chat.new.name_exists": "Er bestaat al een kanaal met deze naam.",
  "chat.new.reach_bluetooth_chip": "Alleen Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Deelnemen met een uitnodigingslink",

  // ---- Chats: join by link ----
  "chat.join.title": "Deelnemen met een link",
  "chat.join.not_airhop": "Dat is geen Airhop-link.",
  "chat.join.reach_internet": "Bereikt leden via Bluetooth en via internet.",
  "chat.join.reach_mesh": "Blijft binnen Bluetooth-bereik.",
  "chat.join.contact_card":
    "Een contactkaart. Voegt diegene toe aan je contacten en opent de chat.",
  "chat.join.unverified": "Die link kon niet worden geverifieerd",
  "chat.join.unverified_body":
    "De contactkaart komt niet overeen met de eigen sleutels, dus hij is niet toegevoegd. Vraag om een nieuwe.",
  "chat.join.paste": "Plakken vanaf het klembord",
  "chat.join.join": "Deelnemen",
  "chat.join.public_channel":
    "Openbaar kanaal {name}. Iedereen in de buurt kan het lezen.",
  "chat.join.private_channel": "Privékanaal {name}. {reach}",
  "chat.join.dm_with": "Direct bericht met {name}.",
  "chat.join.joined_as": "Deelgenomen als {name}",
  "chat.join.name_clash_body":
    "Je zit al in een ander {name}. Kanaalnamen zijn maar labels, dus deze uitnodiging heeft een eigen kanaal geopend en het kanaal waar je in zat blijft ongemoeid. Je kunt beide hernoemen vanuit de kanaalinfo.",
  "chat.join.paste_hint":
    "Plak een uitnodiging die begint met airhop://. Op een link tikken werkt ook; dit is voor een link waar je niet op kunt tikken.",
  "chat.join.key_note":
    "De uitnodiging voor een privékanaal draagt de sleutel mee, dus deelnemen gaat meteen en er wordt niemand anders iets gevraagd.",
  "chat.join.offline_note":
    "Werkt offline. De link wordt op dit toestel gelezen, en het kanaal reikt zo ver als de maker het heeft ingesteld.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Die cel kon niet worden geopend. Probeer het zo nog eens.",
  "chat.jump.title": "Naar een plek",
  "chat.jump.saved": "OPGESLAGEN PLEKKEN",
  "chat.jump.anywhere":
    "Open het openbare locatiekanaal van waar dan ook, ook van een plek waar je niet bent.",
  "chat.jump.geohash_note":
    "Vul de geohash in. Iedereen wiens locatie in die cel valt deelt het kanaal.",
  "chat.jump.teleport_note":
    "Je verschijnt als geteleporteerd, niet als dichtbij. Het gaat alleen via internet.",
  "chat.jump.level_cell": "Cel op {level}-niveau",
  "chat.jump.already_here": "Je bent hier al. Ga opent je {name}-kanaal.",
  "chat.jump.open_direction": "De cel ten {direction} openen",
  "chat.jump.open_place": "{name} openen",
  "chat.jump.remove_place": "{name} uit de opgeslagen plekken halen",
  "chat.jump.go": "Ga",
  "chat.jump.how":
    "Een geohash vinden: open een locatiekanaal > tik op de naam > kopieer hem daar.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Niet alle leden konden worden bereikt. Probeer het opnieuw als ze in de buurt zijn.",
  "chat.group.you_were_added": "Je bent toegevoegd aan {name}.",
  "chat.group.added_you": "Heeft je toegevoegd aan {name}",
  "chat.group.you_were_removed":
    "Je bent weggehaald uit {name}. Je kunt hier niet meer lezen of sturen.",
  "chat.group.removed_you": "Heeft je weggehaald uit {name}",
  "chat.group.add_failed": "Toevoegen lukte niet",
  "chat.group.add_failed_body":
    "Er is niets veranderd. Of ze zijn nu niet bereikbaar, of de groep zit vol met 16, of je bent niet de maker.",
  "chat.group.remove_failed": "Weghalen lukte niet",
  "chat.group.remove_failed_body":
    "Er is niets veranderd. Alleen wie de groep heeft gemaakt kan bepalen wie erin zit.",
  "chat.group.e2ee":
    "End-to-end versleuteld. Alleen leden kunnen de berichten lezen.",
  "chat.group.cap":
    "Tot 16 mensen, door jou gekozen. Er is geen uitnodigingslink, dus niemand komt binnen doordat iemand hem doorstuurt.",
  "chat.group.bluetooth":
    "Alleen Bluetooth. Leden buiten bereik krijgen de berichten zodra ze terug zijn.",
  "chat.group.members_label": "LEDEN",
  "chat.group.none_in_range":
    "Er is niemand binnen bereik. Leden moeten in de buurt zijn als je de groep maakt.",
  "chat.group.create_title": "Een groep maken",
  "chat.group.name_placeholder": "Groepsnaam",
  "chat.group.create": "Maken",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Lokale mesh · alleen Bluetooth",
  "chat.scope.mesh_desc":
    "Bereikt toestellen binnen Bluetooth-bereik (ruwweg 10 tot 100 meter). Geen internet nodig. Ideaal om ter plekke af te stemmen.",
  "chat.scope.block": "Huizenblok · ~100 m",
  "chat.scope.block_desc":
    "Dekking op de schaal van een huizenblok. Berichten gaan ook via internet zodat peers net buiten Bluetooth-bereik toch mee kunnen doen.",
  "chat.scope.neighborhood": "Buurt · ~1 km",
  "chat.scope.neighborhood_desc":
    "Dekking op buurtniveau. Met hulp van relays zijn peers in de hele omgeving bereikbaar, ook zonder directe Bluetooth-verbinding.",
  "chat.scope.city": "Stad · ~10 km",
  "chat.scope.city_desc":
    "Kanaal voor de hele stad. Gebruikt geolocatie-internetrelays om peers in de hele agglomeratie te bereiken.",
  "chat.scope.province": "Provincie · ~100 km",
  "chat.scope.province_desc":
    "Dekking op provincieniveau. Via internet gekoppeld voor een regionaal bereik van honderden kilometers.",
  "chat.scope.country": "Land of regio · ~1000 km",
  "chat.scope.country_desc":
    "Dekking in het hele land. Elke gebruiker van Airhop of bitchat in de regio kan deelnemen en de berichten lezen.",
  "chat.transport.bluetooth": "Alleen Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Alleen internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Opdracht /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Stuur een warme knuffel",
  "chat.cmd.slap_hint": "Geef een klap met een grote forel",
  "chat.status.sending": "Bezig met sturen…",
  "chat.status.undo_send": "Verzenden ongedaan maken",
  "chat.status.undo": "Ongedaan maken",
  "chat.status.sent": "Verstuurd",
  "chat.status.received": "Ontvangen",
  "chat.status.failed": "Mislukt",
  "chat.status.canceled": "Geannuleerd",
  "chat.status.waiting": "Wachten",
  "chat.status.sending_short": "Bezig met sturen",
  "chat.status.receiving": "Bezig met ontvangen",
  "chat.thread.not_available": "Hier niet beschikbaar",
  "chat.thread.private_channel": "Privékanaal",
  "chat.thread.location_channel": "Locatiekanaal",
  "chat.thread.public_channel": "Openbaar kanaal",
  "chat.thread.notices": "Meldingen van dit kanaal",
  "chat.thread.invite": "Iemand uitnodigen voor dit kanaal",
  "chat.thread.not_in_range":
    "Buiten Bluetooth-bereik. Wordt via internet bezorgd.",
  "chat.thread.not_nearby":
    "Niet in de buurt. We bezorgen het zodra diegene terug binnen bereik of online is.",
  "chat.thread.no_keys":
    "Je moet binnen Bluetooth-bereik zijn, of hun code scannen, om ze te schrijven.",
  "chat.geo.card_received":
    "{name} heeft het contact gedeeld. Deel dat van jou terug zodat jullie kunnen doorpraten nadat een van jullie verhuist.",
  "chat.geo.exchange_complete":
    "Contacten uitgewisseld. Nu kunnen jullie elkaar overal bereiken.",
  "chat.geo.keep_person": "Deze persoon bewaren",
  "chat.geo.keep_person_desc":
    "Deel je contact zodat jullie kunnen doorpraten nadat een van jullie verhuist. Diegene leert dan je vaste identiteit kennen.",
  "chat.geo.card_sent": "Gedeeld · wachten op dat van hen",
  "chat.thread.left_cell":
    "Je bent uit dit gebied vertrokken, dus ze kunnen je hier niet bereiken. Wissel codes uit om overal te kunnen doorpraten.",
  "chat.thread.no_route":
    "Ze zijn nu niet te bereiken. Het bericht gaat weg zodra er een route is.",
  "chat.thread.empty": "Nog geen berichten",
  "chat.thread.empty_desc": "Begin een versleuteld gesprek.",
  "chat.thread.jump_latest": "Naar het laatste bericht",
  "chat.thread.back_to_members": "Terug naar de leden",
  "chat.thread.nostr_key": "Nostr-publieke sleutel",
  "chat.thread.in_range": "Binnen bereik",
  "chat.voice.not_recorded": "Het spraakbericht is niet opgenomen",
  "chat.thread.message": "Bericht",
  "chat.thread.message_placeholder": "Bericht…",
  "chat.thread.length_full": "Het bericht is vol",
  "chat.thread.waiting_for": "Wachten tot {name} terug is · {percent}%",
  "chat.thread.peer": "peer",
  "chat.thread.cancel_transfer": "{name} annuleren",
  "chat.thread.queued_more": "Nog {count} wachten om verstuurd te worden",
  "chat.thread.across_bridge": "{count} aan de overkant van de brug",
  "chat.thread.bridged": "via de brug",
  "chat.thread.invite_body":
    "Kom bij me in {channel} op Airhop — privé meshberichten, offline-first.",
  "chat.thread.go_back_unread": "Terug, {count} ongelezen",
  "chat.thread.view_info": "Info van {name} bekijken",
  "chat.thread.notices_new": "Meldingen van dit kanaal, {count} nieuw",
  "chat.thread.say_something": "Zeg iets in {channel}.",
  "chat.thread.jump_latest_new": "Naar het laatste bericht, {count} nieuw",
  "chat.thread.unconfirmed_since": "Geen bezorging bevestigd sinds {date}",
  "chat.thread.no_reach":
    "Geen peers in de buurt · nog niemand heeft dit gekregen",
  "chat.thread.channel_needs_internet":
    "Internet uit · dit kanaal bereikt alleen mensen binnen Bluetooth-bereik",
  "chat.thread.cell_needs_internet":
    "Internet uit · deze cel is alleen via internet bereikbaar",
  "chat.thread.geo_dm_needs_internet":
    "Internet uit · dit gesprek gaat alleen via internet",
  "chat.thread.via_gateway":
    "Internet uit · een toestel in de buurt draagt dit voor je online",
  "chat.thread.group_queued":
    "Er is nog niemand uit deze groep in de buurt. Het komt bij ze aan zodra dat wel zo is.",
  "chat.thread.no_group_key":
    "Je zit niet meer in deze groep, dus dit kan niet worden verstuurd",
  "chat.thread.no_reach_offline":
    "Internet uit en geen peers in de buurt · nog niemand heeft dit gekregen",
  "chat.thread.mention": "{name} noemen",
  "chat.thread.someone_talking": "{hold}. {name} is aan het woord.",
  "chat.thread.attach_note":
    "Bestanden gaan alleen binnen Bluetooth-bereik. Tekst en betalingen bereiken contacten via internet; bijlagen niet.",
  "chat.thread.message_peer": "{name} schrijven",
  "chat.thread.send": "Bericht sturen",
  "chat.thread.group": "Groep",
  "chat.bridge.nearby_only":
    "Alleen dichtbij: houd dit bericht van de meshbrug af",
  "chat.bridge.nearby_label": "Alleen dichtbij · blijft op Bluetooth",
  "chat.bridge.bridging_label":
    "Gekoppeld met gebieden in de buurt · tik voor alleen dichtbij",
  "chat.screenshot.you_took": "Je hebt een schermafbeelding gemaakt",
  "chat.screenshot.you_took_private":
    "Je hebt een schermafbeelding gemaakt · niemand is ingelicht",
  "chat.screenshot.heads_up": "Let op",
  "chat.screenshot.notice": "* {name} heeft een schermafbeelding gemaakt *",
  "chat.screenshot.notified_dm":
    "{name} is ingelicht dat je een schermafbeelding van dit gesprek hebt gemaakt.",
  "chat.screenshot.notified":
    "Iedereen in dit kanaal is ingelicht dat je een schermafbeelding hebt gemaakt.",
  "chat.screenshot.not_notified":
    "Niemand is ingelicht. Dit kanaal is openbaar, dus een schermafbeelding aankondigen zou vastleggen dat je hier was.",
  "chat.thread.error": "Fout",
  "chat.thread.go_back": "Terug",
  "chat.bubble.via_bridge": "via de meshbrug",
  "chat.bubble.view_profile": "Profiel van {name} bekijken",
  "chat.bubble.forwarded": "Doorgestuurd",
  "chat.bubble.attachment": "bijlage",
  "chat.bubble.a11y": "{sender}: {body}. Houd vast voor meer opties.",
  "chat.bubble.failed_retry":
    "Versturen mislukt. Tik om het opnieuw te proberen.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Berichtinfo",
  "chat.info.delivered_to": "Bezorgd bij {name}",
  "chat.info.read_by": "Gelezen door {name}",
  "chat.info.group_reach_desc": "Nu bereikbaar, geen bevestiging van bezorging",
  "chat.info.group_alone": "Geen andere leden",
  "chat.info.today_at": "Vandaag {time}",
  "chat.info.sending": "Bezig met sturen…",
  "chat.info.failed": "Versturen mislukt",
  "chat.info.courier": "Meegedragen door een vriend",
  "chat.info.sent": "Verstuurd",
  "chat.info.queued": "Wacht om verstuurd te worden",
  "chat.info.waiting": "Wachten…",
  "chat.action.info": "Berichtinfo",
  "chat.action.save_photos": "Opslaan in foto’s",
  "chat.action.save_copy": "Een kopie opslaan",
  "chat.action.forward": "Doorsturen",
  "chat.action.select": "Selecteren",
  "chat.select.cancel": "Selectie annuleren",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Camera",
  "chat.attach.camera_desc": "Maak een foto of video",
  "chat.attach.library": "Fotogalerij",
  "chat.attach.library_desc": "Kies uit je galerij",
  "chat.attach.document": "Document",
  "chat.attach.document_desc": "Stuur elk bestand of pdf",
  "chat.attach.voice": "Spraakbericht",
  "chat.attach.voice_desc": "Neem een spraakbericht op en stuur het",
  "chat.attach.ecash": "Ecash sturen",
  "chat.attach.ecash_desc": "Stuur Cashu-sats uit je portemonnee",
  "chat.attach.location": "Locatie",
  "chat.attach.location_desc": "Stuur waar je nu bent",
  "chat.attach.title": "Bijvoegen",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Heeft een locatie gedeeld",
  "chat.location.received_summary": "Heeft de locatie gedeeld",
  "chat.location.title": "Locatie",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago} geleden bepaald",
  "chat.location.open_maps": "Openen in Maps",
  "chat.location.no_forward": "Locaties worden niet doorgestuurd",
  "chat.location.no_forward_body":
    "Een locatie gaat naar één persoon. Deel die van jou als je wilt dat iemand anders hem heeft.",
  "chat.location.no_fix": "Sta locatie toe om te zien hoe ver dit is",
  "chat.location.send_title": "Je locatie sturen",
  "chat.location.send_body":
    "{name} ziet één punt: waar je nu bent. Het blijft niet bijwerken.",
  "chat.location.send": "Locatie sturen",
  "chat.location.finding": "Je locatie zoeken…",
  "chat.location.no_location": "Je locatie kon niet worden opgehaald",
  "chat.location.no_location_body":
    "Sta locatietoegang toe en controleer of locatievoorzieningen aanstaan, en probeer het dan opnieuw.",
  "chat.location.not_delivered": "Je locatie kon niet worden gestuurd",
  "chat.location.not_delivered_body":
    "Een locatie is alleen de moeite waard zolang hij actueel is, dus hij komt niet in de wachtrij voor later. Probeer het opnieuw als {name} bereikbaar is.",
  "chat.location.direction.n": "noorden",
  "chat.location.direction.ne": "noordoosten",
  "chat.location.direction.e": "oosten",
  "chat.location.direction.se": "zuidoosten",
  "chat.location.direction.s": "zuiden",
  "chat.location.direction.sw": "zuidwesten",
  "chat.location.direction.w": "westen",
  "chat.location.direction.nw": "noordwesten",
  "chat.attach.send_anyway": "Toch sturen",
  "chat.attach.bitchat_too_big": "Dit komt misschien niet aan",
  "chat.attach.bitchat_too_big_body":
    "{name} zit op bitchat, dat halverwege opgeeft bij een groot bestand. Onder ongeveer 350 KiB is betrouwbaar. Naar een Airhop-contact sturen kent die grens niet.",
  "chat.attach.bitchat_unopenable": "Ze kunnen dit misschien niet openen",
  "chat.attach.bitchat_unopenable_body":
    "{name} zit op bitchat, dat foto’s en spraakberichten laat zien maar al het andere als een bestand toont dat het niet kan openen. Het komt aan, ze kunnen het alleen misschien niet bekijken.",
  "chat.attach.file": "Een bestand bijvoegen",
  "chat.attach.unavailable": "Bijlagen zijn hier niet mogelijk",
  "chat.attach.not_sent": "Bijlage niet verstuurd",
  "chat.attach.read_failed":
    "Er ging iets mis bij het lezen van dat bestand. Probeer een ander.",
  "chat.attach.caption": "Voeg een bijschrift toe…",
  "chat.attach.send": "Bijlage sturen",
  "chat.attach.generic": "Bijlage",
  "chat.media.view_full": "Foto op volledig scherm bekijken",
  "chat.media.gone_photo": "De foto staat niet op dit toestel",
  "chat.media.gone_video": "De video staat niet op dit toestel",
  "chat.media.gone_voice": "Het spraakbericht staat niet op dit toestel",
  "chat.media.gone_file": "Het bestand staat niet op dit toestel",
  "chat.media.gone_note": "Weggehaald na 7 dagen of toen de cache werd geleegd",
  "chat.media.ask_resend": "Opnieuw vragen",
  "chat.media.resend_draft": "Kun je {kind} nog eens sturen?",
  "chat.media.kind_photo": "die foto",
  "chat.media.kind_video": "die video",
  "chat.media.kind_voice": "dat spraakbericht",
  "chat.media.kind_file": "dat bestand",
  "chat.media.pause_voice": "Spraakbericht pauzeren",
  "chat.media.play_voice": "Spraakbericht afspelen",
  "chat.media.voice_position": "Positie in het spraakbericht",
  "chat.media.voice_scrub": "Tik langs de balkjes om naar dat punt te springen",
  "chat.media.image": "Afbeelding",
  "chat.media.tap_load_photo": "Tik om de foto te laden",
  "chat.media.open_document": "{name} openen",
  "chat.media.document": "document",
  "chat.media.tap_load_video": "Tik om de video te laden",
  "chat.media.video": "Video",
  "chat.media.photo": "Foto",
  "chat.media.close_photo": "Foto sluiten",
  "chat.media.save_photo": "Foto opslaan in je foto’s",
  "chat.media.share_photo": "Foto delen",
  "chat.media.saved_videos": "Opgeslagen in je video’s",
  "chat.media.saved_photos": "Opgeslagen in je foto’s",
  "chat.media.not_saved": "Niet opgeslagen",
  "chat.media.cant_open": "Bestand kan niet worden geopend",
  "chat.media.no_app":
    "Dit toestel heeft geen app om dit bestand te openen of te delen.",
  "chat.media.open_failed":
    "Het bestand kon niet worden geopend. Het is misschien uit de cache verwijderd.",
  "media.blocked.nostr_only":
    "Je kent deze persoon alleen via een relay. Alleen tekst kan. Foto’s, bestanden en spraakberichten hebben Bluetooth nodig.",
  "media.blocked.private_channel":
    "Een uitzendbijlage wordt wel ondertekend maar niet versleuteld, dus hem naar een privékanaal sturen zou hem in het open leggen terwijl de tekst hier versleuteld blijft.",
  "media.blocked.private_group":
    "Een uitzendbijlage wordt wel ondertekend maar niet versleuteld, dus hem naar een privégroep sturen zou hem in het open leggen terwijl de tekst hier versleuteld blijft.",
  "media.blocked.location_channel":
    "Een locatiekanaal bereikt mensen via internet, en foto’s, bestanden en spraakberichten gaan via Bluetooth, dus die zouden nooit aankomen.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Spraakberichten zijn hier niet mogelijk",
  "chat.voice.hold_live": "Houd vast om live te praten",
  "chat.voice.hold_record": "Houd vast om een spraakbericht op te nemen",
  "chat.voice.cancel_recording": "Opname annuleren",
  "chat.voice.slide_cancel": "Schuif om te annuleren",
  "chat.voice.release_cancel": "Laat los om te annuleren",
  "chat.voice.a11y_toggle":
    "Tik twee keer om te beginnen of te stoppen met praten.",
  "chat.voice.limit_reached":
    "Grens van twee minuten bereikt, laat los om te versturen",
  "chat.voice.limit_sent": "Grens van twee minuten bereikt, bericht verstuurd",
  "chat.voice.stop_send": "Opname stoppen en versturen",
  "chat.voice.lift_lock": "Schuif omhoog om handsfree op te nemen",
  "chat.voice.live_speaking": "{name} is aan het woord",
  "voice.unavailable": "Live spraak niet beschikbaar",
  "voice.recording_stopped": "Opname gestopt",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Cameratoegang",
  "chat.perm.camera_purpose": "een foto maken om te versturen",
  "chat.perm.photo_label": "Fototoegang",
  "chat.perm.photo_purpose": "een foto of video kiezen om te versturen",
  "chat.perm.photo_save_purpose": "dit opslaan in je foto’s",
  "chat.perm.mic_label": "Microfoontoegang",
  "chat.perm.mic_live_purpose": "praten met mensen in de buurt",
  "chat.perm.mic_note_purpose": "een spraakbericht opnemen",
  "chat.perm.recording_stopped": "Opname gestopt",
  "chat.perm.record_failed":
    "De opname kon niet starten. Controleer de microfoonrechten.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Opgehaald",
  "chat.ecash.reclaimed": "Teruggenomen",
  "chat.ecash.claiming": "Bezig met ophalen…",
  "chat.ecash.claim": "Ophalen",
  "chat.ecash.claim_amount": "{amount} {unit} ophalen",
  "chat.ecash.already_claimed": "Al opgehaald",
  "chat.ecash.already_claimed_body":
    "Elk bewijs in dit token zit al in je portemonnee, dus er is niets bijgekomen.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Aan de mesh gegeven om zo goed mogelijk te bezorgen",
  "chat.info.queued_desc":
    "Vastgehouden op deze telefoon tot er een route naar ze is",
  "chat.info.reclaimed": "Teruggenomen",
  "chat.info.reclaimed_desc":
    "Je hebt deze betaling teruggehaald naar je portemonnee, dus hij wordt niet bezorgd",
  "chat.info.about": "Over",
  "chat.info.group_desc":
    "Een privégroep. Alleen de leden die de maker heeft toegevoegd kunnen hem lezen, en hij blijft op Bluetooth.",
  "chat.info.teleported_desc":
    "Een openbaar locatiekanaal voor deze geohashcel. Iedereen in de cel, op Airhop of op bitchat, deelt het via internet. Je bent geteleporteerd, niet fysiek hier.",
  "chat.info.custom_desc":
    "Een eigen kanaal. Iedereen die de naam kent kan meedoen vanaf elk toestel met Airhop of bitchat.",
  "chat.info.private_e2ee": "Privé · end-to-end versleuteld",
  "chat.info.public_plain": "Openbaar · niet versleuteld",
  "chat.info.group_privacy":
    "Alleen de leden hieronder kunnen deze groep lezen. Berichten blijven op Bluetooth, dus leden buiten bereik krijgen ze zodra ze terug zijn.",
  "chat.info.teleport_privacy":
    "Een plek waar je naartoe bent geteleporteerd. Het bereikt iedereen in deze cel via internet, en niemand binnen Bluetooth-bereik.",
  "chat.info.location_off_privacy":
    "Locatie staat uit, dus dit kanaal bereikt toestellen in de buurt alleen via Bluetooth. Zet locatie aan om de gebiedscel via internet te bereiken.",
  "chat.info.invite_privacy":
    "Alleen mensen die je via de link uitnodigt kunnen het lezen. Voor de rest blijft het verborgen, ook voor peers in de buurt.",
  "chat.info.public_privacy":
    "Iedereen die meedoet kan elk bericht lezen. Gebruik een direct bericht voor een privégesprek; directe berichten zijn end-to-end versleuteld.",
  "chat.info.remove_member": "Lid weghalen",
  "chat.info.remove_member_body":
    "{name} uit de groep halen? De groepssleutel wisselt, zodat diegene nieuwe berichten niet meer kan lezen.",
  "chat.info.message_member": "{name} schrijven",
  "chat.info.remove_member_a11y": "{name} weghalen",
  "chat.info.no_addable":
    "Geen bereikbare peers om toe te voegen. Leden moeten in de buurt zijn.",
  "chat.info.add_count": "{count} toevoegen",
  "chat.info.teleported_tag": "{level}  ·  geteleporteerd",
  "chat.info.active": "Actief",
  "chat.info.members": "Leden",
  "chat.info.bookmark": "Deze plek bewaren",
  "chat.info.remove_bookmark": "Uit bewaarde plekken halen",
  "chat.info.default_notice":
    "Standaardkanalen kun je niet verlaten. Ze horen bij het meshprotocol van Airhop.",
  "chat.info.custom_channel": "Eigen kanaal",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Geohash kopiëren",
  "chat.info.relays": "Relays",
  "chat.info.show_relays": "De relays tonen die dit kanaal dragen",
  "chat.info.relay_custom": "eigen",
  "chat.info.relays_none": "Geen. Deze cel is nu alleen Bluetooth.",
  "chat.info.search_members": "Leden zoeken",
  "chat.info.search_members_placeholder": "Leden zoeken…",
  "chat.info.teleported": "Geteleporteerd",
  "chat.info.creator": "Maker",
  "chat.info.no_matches": "Geen resultaten",
  "chat.info.no_one_here": "Nog niemand hier",
  "chat.info.add_members": "Leden toevoegen",
  "chat.info.add_selected": "Geselecteerde leden toevoegen",
  "chat.info.add": "Toevoegen",
  "chat.info.leave_group": "Groep verlaten",
  "chat.info.leave_channel": "Kanaal verlaten",
  "chat.info.leave": "Verlaten",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Aan het praten sinds {date}",
  "chat.contact.verified_since": "Geverifieerd sinds {date}",
  "chat.contact.anonymous": "Anoniem",
  "chat.contact.anonymous_desc":
    "Een geohash-schuilnaam zonder blijvende identiteit om te verifiëren",
  "chat.contact.verified": "Geverifieerd",
  "chat.contact.verified_desc": "Je hebt hun QR-code gescand",
  "chat.contact.verified_desc_compared": "Jullie hebben codes vergeleken",
  "chat.contact.not_verified": "Niet geverifieerd",
  "chat.contact.not_verified_desc":
    "Scan hun code, of vergelijk er een tijdens een gesprek, om te bevestigen dat zij het echt zijn",
  "chat.contact.e2ee": "End-to-end versleuteld",
  "chat.contact.e2ee_nostr":
    "Verpakt volgens NIP-17, dus relays kunnen het niet lezen",
  "chat.contact.e2ee_mesh":
    "Noise XX, plus Double Ratchet tussen Airhop-toestellen",
  "chat.contact.copy_nostr": "Nostr-publieke sleutel kopiëren",
  "chat.contact.nostr_key": "Nostr-publieke sleutel",
  "chat.contact.cell_key_note":
    "Deze sleutel hoort bij het gebied waar jullie elkaar tegenkwamen. Hij verandert als een van jullie verhuist, en het gesprek stopt daarmee. Wissel contacten uit om overal te kunnen doorpraten.",
  "chat.contact.peer_name": "Peernaam",
  "chat.contact.peer_id": "Peer-ID",
  "chat.contact.rename": "Hernoemen",
  "chat.contact.rename_needs_contact":
    "Je kunt mensen hernoemen van wie je de sleutels hebt. Wissel eerst contactkaarten uit, dan wordt dit een naam die alleen jij ziet.",
  "chat.contact.rename_needs_keys":
    "Nog geen sleutels voor dit contact. Schrijf ze, of scan hun code, en dan kun je een naam geven die alleen jij ziet.",
  "chat.contact.renamed_by_you": "Jouw naam voor diegene",
  "chat.contact.copy_peer_id": "Peer-ID kopiëren",
  "chat.contact.verify": "Contact verifiëren",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Meldingen",
  "chat.notices.post_area": "Een melding in dit gebied plaatsen",
  "chat.notices.post_mesh": "Een melding op de mesh plaatsen",
  "chat.notices.mark_urgent": "Als dringend markeren",
  "chat.notices.post": "Melding plaatsen",
  "chat.notices.post_short": "Plaatsen",
  "chat.notices.delete": "Melding verwijderen",
  "chat.notices.just_now": "zojuist",
  "chat.notices.fades_soon": "vervaagt binnenkort",
  "chat.notices.1_day": "1 dag",
  "chat.notices.3_days": "3 dagen",
  "chat.notices.7_days": "7 dagen",
  "chat.notices.fading": "aan het vervagen",
  "chat.notices.fades_in_hours": "vervaagt over {count} u",
  "chat.notices.fades_in_days": "vervaagt over {count} d",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Dringend",
  "chat.notices.permanent_warning":
    "Vervaagt nooit. Openbaar en gebonden aan dit gebied, en je kunt het niet terugnemen.",
  "chat.notices.none":
    "Nog geen meldingen. Plaats er een zodat hij hier voor anderen blijft staan.",

  // ---- Chats: search results ----
  "chat.search.photos": "Foto’s",
  "chat.search.videos": "Video’s",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Documenten",
  "chat.search.links": "Links",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filteren op {filter}",
  "chat.search.no_matches": "Geen {filter} die overeenkomt met “{query}”",
  "chat.search.no_media": "Nog geen {filter}",
  "chat.search.result_a11y": "{chat}, {kind} van {sender}",
  "chat.search.you": "jij",
  "chat.search.section_chats": "Chats",
  "chat.search.section_messages": "Berichten",
  "chat.search.section_notices": "Meldingen",
  "chat.search.hint":
    "Zoek in berichten en chats, of kies hierboven een filter.",
  "chat.search.no_results": "Geen resultaten voor “{query}”",
  "chat.search.open_chat": "{name} openen",
  "chat.search.message_a11y": "{chat}, bericht van {sender}: {snippet}",
  "chat.search.notice_a11y": "Melding in {chat} van {author}: {snippet}",
  "chat.search.urgent": "Dringend ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Er staan er {count} in deze lijst. Leegmaken haalt ze alleen hier weg, en de berichten blijven ongelezen in hun gesprekken. Alles als gelezen markeren ruimt beide op.",
  "chat.notif.mark_all_read": "Alles als gelezen markeren",
  "chat.notif.clear_list": "Lijst leegmaken",
  "chat.notif.clear_all_a11y": "Alle {count} meldingen leegmaken",
  "chat.notif.title": "Meldingen",
  "chat.notif.clear_short": "Leegmaken",
  "chat.notif.close": "Meldingen sluiten",
  "chat.notif.none": "Nog geen meldingen",
  "chat.notif.none_desc":
    "Berichten, vermeldingen en meldingen uit je kanalen en chats komen hier te staan.",
  "chat.notif.new": "Nieuw",
  "chat.notif.notice_in": "melding in {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Doorsturen naar…",
  "chat.forward.to": "Doorsturen naar {name}",
  "chat.forward.cant_send_here": "Hier kan niet worden doorgestuurd",
  "chat.forward.cant_send_to": "Kan niet worden doorgestuurd naar {name}",
  "chat.forward.channels": "Kanalen",
  "chat.forward.groups": "Groepen",
  "chat.forward.locations": "Locaties",
  "chat.forward.dms": "Directe berichten",
  "chat.forward.none": "Nog geen andere chats",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Mesh wordt gestart…",
  "mesh.banner.no_bluetooth": "Geen Bluetooth op dit toestel · alleen internet",
  "mesh.banner.bluetooth_off": "Bluetooth uit · mesh niet beschikbaar",
  "mesh.banner.permission_needed": "Bluetooth-toestemming nodig",
  "mesh.banner.blocked":
    "Bluetooth geblokkeerd · sta het toe in de instellingen",
  "mesh.banner.location_permission": "Locatie nodig om peers te vinden",
  "mesh.banner.advertising_unsupported":
    "Deze telefoon ziet anderen wel, maar kan zelf niet gevonden worden",
  "mesh.banner.location_off_android":
    "Locatie uit · Android heeft het nodig om peers te vinden",
  "mesh.banner.paused": "Mesh gepauzeerd · je bent weg",
  "mesh.banner.location_off": "Locatie uit · locatiekanalen niet beschikbaar",
  "mesh.banner.battery_saver": "Batterijbesparing · minder vaak scannen",
  "mesh.banner.wipe_incomplete":
    "Wissen niet afgemaakt · er kan wat data over zijn, opnieuw openen probeert het nog eens",
  "mesh.banner.wifi_off": "Wi-Fi uit · grote bestanden gaan langzamer",
  "mesh.banner.clock_skew":
    "De klok van deze telefoon klopt niet · zet datum en tijd op automatisch",
  "mesh.banner.internet_off": "Internet uit · alleen Bluetooth",
  "mesh.banner.relaying": "Geen peers in de buurt · doorgeven via Nostr",
  "mesh.banner.tor": "Tor aan · internetverkeer omgeleid",
  "mesh.banner.tor_starting": "Tor wordt gestart · verbinden",
  "mesh.banner.tor_blocked":
    "Tor kon geen verbinding maken · de mesh werkt gewoon door",
  "mesh.banner.gateway":
    "Internetgateway aan · doorgeven voor peers in de buurt",
  "mesh.banner.bridge": "Meshbrug aan · openbare chat gekoppeld",
  "mesh.banner.background_limits":
    "{brand} kan de mesh op de achtergrond pauzeren",
  "mesh.banner.bridge_across":
    "Meshbrug aan · {count} aan de overkant van de brug",
  "mesh.banner.action.turn_on": "Aanzetten",
  "mesh.banner.action.allow": "Toestaan",
  "mesh.banner.action.resume": "Hervatten",
  "mesh.banner.action.fix": "Oplossen",
  "mesh.banner.hint.resume": "Zet Bluetooth-adverteren en -scannen weer aan",
  "mesh.banner.hint.enable_bluetooth":
    "Vraagt Android om Bluetooth aan te zetten",
  "mesh.banner.hint.location_settings":
    "Opent de locatie-instellingen van het systeem",
  "mesh.banner.hint.app_settings":
    "Opent de rechten van Airhop in de systeeminstellingen",
  "mesh.banner.hint.battery_settings":
    "Opent de achtergrondinstellingen van deze telefoon",
  "mesh.banner.dismiss": "Sluiten: {label}",
  "mesh.banner.hint.dismiss": "Verbergt deze melding voorgoed",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Zoeken naar peers in de buurt…",
  "mesh.radar.starting": "Mesh wordt gestart…",
  "mesh.radar.no_bluetooth": "Dit toestel heeft geen Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth uit · niet aan het scannen",
  "mesh.radar.permission_needed": "Bluetooth-toestemming nodig",
  "mesh.radar.blocked": "Bluetooth geblokkeerd",
  "mesh.radar.location_permission": "Locatietoestemming nodig",
  "mesh.radar.location_off": "Locatie uit · niet aan het scannen",
  "mesh.radar.hint_rings":
    "De ringen tonen de sterkte van het BLE-signaal, niet de afstand",
  "mesh.radar.hint_checking": "Bluetooth en rechten worden gecontroleerd",
  "mesh.radar.hint_internet": "Berichten blijven via internet gaan",
  "mesh.radar.hint_turn_on": "Zet Bluetooth aan om peers te vinden",
  "mesh.radar.hint_allow": "Sta Bluetooth toe om peers te vinden",
  "mesh.radar.hint_allow_settings":
    "Sta Bluetooth toe in de instellingen om peers te vinden",
  "mesh.radar.hint_location_permission":
    "Android 11 en ouder hebben locatie nodig om via Bluetooth te scannen",
  "mesh.radar.hint_android_location":
    "Android heeft locatie aan nodig om Bluetooth-scanresultaten terug te geven",
  "mesh.radar.signal_strong": "Sterk",
  "mesh.radar.signal_medium": "Gemiddeld",
  "mesh.radar.signal_weak": "Zwak",
  "mesh.radar.you_center": "Jij, in het midden van de mesh",
  "mesh.radar.sonar_hint":
    "Speelt een sonarveeg af. Het scannen loopt al continu door.",
  "mesh.radar.paused": "Mesh gepauzeerd · je bent weg",
  "mesh.radar.ring_hint":
    "De plek van de ring weerspiegelt de signaalsterkte, niet de afstand",
  "mesh.radar.set_online":
    "Zet je status in je profiel op Online om peers te vinden",
  "mesh.radar.in_range": "binnen bereik",
  "mesh.radar.recently_seen": "onlangs gezien",
  "mesh.radar.peer_hint":
    "Opent de opties om deze peer te schrijven of te betalen",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "zojuist",
  "mesh.peer.none": "Geen peers in de buurt",
  "mesh.peer.none_desc":
    "Andere toestellen met Airhop of bitchat binnen Bluetooth-bereik verschijnen hier.",
  "mesh.peer.id_copied": "Peer-ID gekopieerd",
  "mesh.peer.copy_id": "Peer-ID kopiëren",
  "mesh.peer.their_name": "Noemt zich {name}",
  "mesh.peer.in_range": "Binnen bereik",
  "mesh.peer.relay": "Relayknooppunt",
  "mesh.peer.relay_body":
    "Een radio die iemand aan heeft laten staan om de mesh groter te maken. Hij draagt berichten die hij zelf niet kan lezen. Er is hier niemand om te schrijven.",
  "mesh.peer.send_dm": "Een direct bericht sturen",
  "mesh.peer.message": "Bericht",
  "mesh.peer.send_sats": "Ecash sturen",
  "mesh.peer.amount_placeholder": "Bedrag in sats",
  "mesh.peer.amount_first": "Ecash sturen, vul eerst een bedrag in",
  "mesh.peer.cancel_send": "Ecash sturen annuleren",
  "mesh.peer.view_peer": "Peer {name} bekijken",
  "mesh.peer.view_peer_online": "Peer {name} bekijken, online",
  "mesh.peer.last_seen": "{ago} geleden gezien",
  "mesh.peer.send_amount": "{amount} sats sturen",
  "mesh.peer.direct": "Directe verbinding",
  "mesh.peer.check_distance": "Afstand nagaan",
  "mesh.peer.checking": "Bezig met nagaan",
  "mesh.peer.no_reply": "Geen antwoord",
  "mesh.peer.no_reply_hint":
    "Misschien zijn ze verder gelopen, of geeft hun app geen antwoord",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Regio",
  "mesh.level.province": "Provincie",
  "mesh.level.city": "Stad",
  "mesh.level.neighborhood": "Buurt",
  "mesh.level.block": "Huizenblok",
  "mesh.level.building": "Gebouw",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Beschikbaar",
  "wallet.balance.unit_hint": "Wisselt tussen satoshi en bitcoin",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "De opslag van de portemonnee zit op slot. Ecash-bewijzen staan in een versleuteld bestand waarvan de sleutel in de sleutelhanger van het toestel zit, en dat bestand ging niet open. Ontgrendel je toestel en open Airhop opnieuw.",
  "wallet.balance.tor_blocked":
    "Tor staat aan, dus mintverzoeken zijn geblokkeerd: ze zouden over het open net gaan en je IP aan je bewijzen koppelen. Sturen en ontvangen over de mesh werkt gewoon. Sta mintverkeer toe onder Instellingen, Beveiliging.",
  "wallet.balance.unconfirmed_note": "{amount} nog niet bevestigd bij de mint",
  "wallet.balance.reserved_note":
    "{amount} apart gezet voor een lopende verzending",
  "wallet.balance.other_mint_note": "{amount} bij een andere mint",
  "wallet.balance.test_mint_note":
    "Bevat speelgeld van een testmint. Dat is geen bitcoin en kan niet worden uitbetaald.",
  "wallet.token": "Token",
  "wallet.action.send": "Een ecash-token sturen",
  "wallet.action.send_disabled":
    "Een ecash-token sturen, niet mogelijk met een leeg saldo",
  "wallet.action.receive": "Een ecash-token ontvangen",
  "wallet.action.zap": "Een Nostr-contact zappen",
  "wallet.action.zap_disabled":
    "Een Nostr-contact zappen, niet mogelijk met een leeg saldo",
  "wallet.action.add_mint": "Een Cashu-mint toevoegen",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Het token kon niet worden gemaakt",
  "wallet.send.title": "Ecash sturen",
  "wallet.send.amount_in": "Bedrag in {unit}",
  "wallet.send.body":
    "Offline gemaakt uit bewijzen die je al hebt. Er gaat niets definitief van je saldo af tot je bevestigt dat het token is aangekomen.",
  "wallet.send.stale_fee_note":
    "De kosten zijn voor het laatst {days} dagen geleden gecontroleerd. Als deze mint ze sindsdien heeft verhoogd, kan de verzending iets meer kosten.",
  "wallet.send.fee_note":
    "{spend} {unit} gaat van je saldo af; de extra {fee} dekt de mintkosten die zij anders zouden betalen",
  "wallet.send.qr_too_big":
    "Dit token is over te veel munten verdeeld om in een QR-code te passen. Deel of kopieer het, of ververs bij de mint om het samen te voegen.",
  "wallet.send.bearer_note":
    "Wie deze reeks heeft, is eigenaar van het geld. De bewijzen zijn apart gezet, niet uitgegeven: als hij niemand bereikt, kun je ze terugnemen onder In afwachting.",
  "wallet.send.qr_too_big_short":
    "Dit token is over te veel munten verdeeld om in een QR-code te passen. Deel of kopieer het.",
  "wallet.send.scan_note":
    "Laat ze dit vanuit hun eigen portemonnee scannen. Je kunt het terugnemen tot je het als afgeleverd markeert.",
  "wallet.send.mesh_note":
    "Het token gaat als versleuteld direct bericht over de mesh. Geen internet nodig.",
  "wallet.send.no_peers_note":
    "Open het Mesh-tabblad om toestellen in de buurt te vinden, of deel het token op een andere manier.",
  "wallet.send.send_to": "Naar {name} sturen",
  "wallet.send.memo": "Notitie (optioneel, reist mee met het token)",
  "wallet.send.building": "Bezig met maken…",
  "wallet.send.build": "Token maken",
  "wallet.send.inexact_body":
    "Je bewijzen kunnen offline niet precies {amount} {unit} maken. Het kleinste token dat je kunt maken is {spend} {unit}, en offline bestaat er geen wisselgeld: de extra {extra} {unit} gaat naar de ontvanger.\n\nVerversen bij de mint terwijl je online bent zou je bewijzen opsplitsen in coupures die precies uitkomen.",
  "wallet.send.send_amount": "{amount} sturen",
  "wallet.send.sent_to": "{amount} {unit} naar {name} gestuurd",
  "wallet.send.sent_to_body":
    "{route} Je kunt het terugnemen onder In afwachting tot je bevestigt dat ze het hebben, of tot de mint ons vertelt dat de bewijzen zijn ingewisseld.",
  "wallet.send.copy_token": "Token kopiëren",
  "wallet.send.share_token": "Token delen",
  "wallet.send.open_in_wallet": "Dit token in een andere portemonnee openen",
  "wallet.send.open_in_wallet_short": "In portemonnee openen",
  "wallet.send.to_peer": "Het token naar een peer in de buurt sturen",
  "wallet.send.to_peer_short": "Naar peer sturen",
  "wallet.send.mark_delivered": "Als afgeleverd markeren en afronden",
  "wallet.send.they_got_it": "Ze hebben het",
  "wallet.send.keep_pending": "Deze verzending in afwachting laten",
  "wallet.send.decide_later": "Later beslissen",
  "wallet.send.no_peers": "Geen peers binnen bereik",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Dit is je eigen betaling",
  "wallet.receive.own_payment_body":
    "Deze munten staan nog apart voor een verzending die je niet hebt afgerond, dus er valt niets op te eisen. Gebruik Terugnemen bij die betaling om ze meteen terug in je saldo te zetten.",
  "wallet.receive.already_have": "Zit al in je portemonnee",
  "wallet.receive.already_have_body":
    "Elk bewijs in dit token staat hier al, dus er is niets bijgekomen. De saldo’s zijn onveranderd.",
  "wallet.receive.stored_unconfirmed":
    "Opgeslagen van {mint}, maar nog niet bevestigd bij de mint ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Ingewisseld bij {mint}. Deze bewijzen zijn nu alleen van jou: de kopie van de afzender werkt niet meer.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Ingewisseld bij {mint}. Het is nu aantoonbaar van jou: de kopie van dit token bij de afzender werkt niet meer.",
  "wallet.receive.stored_pending":
    "Opgeslagen van {mint}, maar de mint heeft nog niet bevestigd dat het onbesteed is{dleq}. Ververs vanaf het Portemonnee-tabblad zodra je online bent.",
  "wallet.receive.dleq_inline":
    " (de handtekening klopt wel, dus het token is echt)",
  "wallet.receive.dleq_ok":
    "De handtekening van de mint klopt, dus het token is echt.",
  "wallet.receive.dleq_uncached":
    "De sleutels van de mint staan hier niet, dus de handtekening kon offline niet worden gecontroleerd.",
  "wallet.receive.dleq_warning":
    "Tot je online ververst, kan de afzender het in principe elders hebben uitgegeven.",
  "wallet.receive.failed": "Ontvangen lukte niet",
  "wallet.receive.title": "Ecash ontvangen",
  "wallet.receive.body":
    "Plak een Cashu-token. Online wordt het meteen bij de mint ingewisseld; offline wordt het opgeslagen en bevestigd zodra je de volgende keer ververst.",
  "wallet.receive.scan": "Een ecash-QR-code scannen",
  "wallet.receive.scan_short": "QR scannen",
  "wallet.receive.receiving": "Bezig met ontvangen…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap ontvangen van {from}… en in je portemonnee ingewisseld.",
  "wallet.zap.title": "Een Nostr-identiteit zappen",
  "wallet.zap.not_npub": "geen npub",
  "wallet.zap.bad_key": "verkeerde sleutel",
  "wallet.zap.invalid_pubkey": "Ongeldige publieke sleutel",
  "wallet.zap.invalid_pubkey_body":
    "Vul een npub1… of een Nostr-publieke sleutel van 64 hex-tekens in.",
  "wallet.zap.sent": "Nutzap verstuurd",
  "wallet.zap.failed": "Zappen mislukt",
  "wallet.zap.body":
    "Als ze NIP-61-nutzapgegevens publiceren, wordt de ecash aan hun sleutel vastgezet zodat niemand anders hem kan uitgeven, en kun je hem niet meer terugnemen. Zo niet, dan gaat hij als een token dat je wel kunt terugnemen. Je hoort welke van de twee het werd.",
  "wallet.zap.contact": "{name} zappen",
  "wallet.zap.pubkey_placeholder": "npub1… of 64 hex-tekens",
  "wallet.zap.sending": "Bezig met sturen…",
  "wallet.nostr.copied_body":
    "Geef dit aan iemand en die kan je zappen vanuit Airhop of een andere Nostr-portemonnee, zonder Bluetooth.",
  "wallet.nostr.copy_key":
    "Kopieer je Nostr-sleutel zodat mensen je kunnen zappen",
  "wallet.nostr.your_key": "Jouw Nostr-sleutel",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint toegevoegd",
  "wallet.mint.add_failed": "De mint kon niet worden toegevoegd",
  "wallet.mint.added_named": "{name} toegevoegd",
  "wallet.mint.added_body":
    "{mint} geeft {units} uit. De sleutels staan op dit toestel, dus tokens ervan zijn nu ook zonder internet te controleren.",
  "wallet.mint.remove_plain":
    "{mint} uit je portemonnee halen? De opgeslagen sleutels gaan mee, dus tokens ervan zijn dan offline niet meer te controleren.",
  "wallet.mint.title": "Mints",
  "wallet.mint.none": "Nog geen mint",
  "wallet.mint.none_desc":
    "Een mint geeft je ecash uit en wisselt het in. Voeg er een toe om via Lightning te storten, of ontvang gewoon een token en de bijbehorende mint komt er vanzelf bij.",
  "wallet.mint.add": "Een mint toevoegen",
  "wallet.mint.add_body":
    "Een mint houdt de Bitcoin die achter je ecash zit, dus kies er een die je het saldo toevertrouwt dat je daar bewaart. De URL wordt gecontroleerd voordat hij wordt opgeslagen. Draai je eigen mint met Nutshell als je liever niemand vertrouwt.",
  "wallet.mint.consolidate_body":
    "Een token kan altijd maar één mint noemen, dus een saldo dat over meerdere mints verdeeld is kan geen bedrag betalen dat groter is dan wat de grootste ervan houdt. Airhop kan het verplaatsen: elke andere mint betaalt een Lightning-factuur van de mint die jij kiest. Het kost een kleine routeringsvergoeding en heeft internet nodig.",
  "wallet.mint.add_short": "Mint toevoegen",
  "wallet.mint.checking": "Bezig met controleren…",
  "wallet.mint.remove_with_balance": "Een mint met saldo weghalen?",
  "wallet.mint.remove": "Mint weghalen",
  "wallet.mint.delete_anyway": "Toch verwijderen",
  "wallet.mint.consolidate": "Alle saldo’s naar één mint verplaatsen",
  "wallet.mint.confirm_with": "Bewijzen bevestigen bij {mint}",
  "wallet.mint.remove_a11y": "{mint} weghalen",
  "wallet.mint.available_amount": "{amount} {unit} beschikbaar",
  "wallet.mint.split_across":
    "Saldo verdeeld over {count} mints. Verplaats het naar één.",
  "wallet.mint.move_everything_to": "Alles naar {mint} verplaatsen",
  "wallet.mint.consolidate_title": "Naar één mint verplaatsen",
  "wallet.mint.moving": "Bezig met verplaatsen…",
  "wallet.mint.move": "Verplaatsen",
  "wallet.mint.moved": "Verplaatst",
  "wallet.mint.moved_body":
    "{amount} {unit} staat nu bij {mint}, na {fees} {unit} aan Lightning-routeringskosten.",
  "wallet.mint.nothing_moved": "Er is niets verplaatst",
  "wallet.mint.destination": "· bestemming",
  "wallet.mint.will_move": "· wordt verplaatst",
  "wallet.mint.issued_by": "Uitgegeven door",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop-portemonnee opwaarderen",
  "wallet.ln.invoice_failed": "De factuur kon niet worden gemaakt",
  "wallet.ln.price_failed": "Deze factuur kon niet worden geprijsd",
  "wallet.ln.paid": "Betaald",
  "wallet.ln.deposit_credited":
    "Factuur betaald en {amount} {unit} uitgegeven door {mint}. Dit saldo is bevestigd: je kunt het meteen offline uitgeven.",
  "wallet.ln.withdrawn":
    "{paid} sats betaald via Lightning. De mint rekende {fee} sats aan routeringskosten.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats betaald via Lightning. De mint rekende {fee} sats aan routeringskosten en gaf {change} sats van de reserve terug aan je saldo.",
  "wallet.ln.payment_failed": "Betaling mislukt",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Verander Lightning-sats in ecash dat je offline kunt uitgeven, of betaal ecash uit naar een willekeurige Lightning-factuur. Voor allebei heb je internet en een mint nodig.",
  "wallet.ln.deposit_body":
    "De mint geeft je een factuur. Betaal hem vanuit een willekeurige Lightning-portemonnee en de sats komen terug als ecash dat je offline kunt uitgeven.",
  "wallet.ln.pay_invoice_for":
    "Betaal deze factuur van {amount} {unit}. De portemonnee let op de betaling en geeft je ecash vanzelf uit.",
  "wallet.ln.expired_body":
    "Deze factuur is verlopen. Als je hem al hebt betaald, wordt het saldo vanzelf bijgeschreven.",
  "wallet.ln.waiting_expires":
    "Wachten op betaling · verloopt over {countdown}",
  "wallet.ln.withdraw_body":
    "Plak een bolt11-factuur en de mint betaalt hem uit je ecash. Je krijgt eerst de routeringsreserve te horen; wat de routering niet gebruikt komt terug op je saldo.",
  "wallet.ln.up_to": "tot {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} betalen",
  "wallet.ln.deposit": "Sats storten via Lightning",
  "wallet.ln.deposit_short": "Storten",
  "wallet.ln.withdraw": "Uitbetalen naar een Lightning-factuur",
  "wallet.ln.withdraw_short": "Uitbetalen",
  "wallet.ln.deposit_title": "Storten via Lightning",
  "wallet.ln.amount_placeholder": "Bedrag in sats",
  "wallet.ln.requesting": "Bezig met aanvragen…",
  "wallet.ln.get_invoice": "Factuur ophalen",
  "wallet.ln.copy_invoice": "Factuur kopiëren",
  "wallet.ln.open_wallet": "In een Lightning-portemonnee openen",
  "wallet.ln.open_wallet_short": "In portemonnee openen",
  "wallet.ln.waiting": "Wachten op betaling…",
  "wallet.ln.new_invoice": "Een nieuwe factuur maken",
  "wallet.ln.new_invoice_short": "Nieuwe factuur",
  "wallet.ln.withdraw_title": "Uitbetalen naar Lightning",
  "wallet.ln.scan_invoice": "De QR-code van een Lightning-factuur scannen",
  "wallet.ln.paid_from": "Betaald vanaf",
  "wallet.ln.invoice": "Factuur",
  "wallet.ln.routing_reserve": "Routeringsreserve",
  "wallet.ln.reserved": "Apart gezet van het saldo",
  "wallet.ln.paying": "Bezig met betalen…",
  "wallet.ln.get_quote": "Offerte ophalen",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Back-up",
  "wallet.backup.setup_failed": "De back-up kon niet worden ingesteld",
  "wallet.backup.on": "Back-up aan",
  "wallet.backup.on_body":
    "Je saldo kan nu uit die twaalf woorden worden herbouwd.\n\nWat iemand anders je heeft gegeven valt buiten de zin tot je bij de mint ververst, en voor herstel is je lijst met mints nodig, dus schrijf die naast de woorden op.",
  "wallet.backup.no_phrase": "Geen zin opgeslagen",
  "wallet.backup.no_phrase_body":
    "De herstelzin kon niet uit de sleutelhanger van het toestel worden gelezen. Ontgrendel het toestel en probeer het opnieuw.",
  "wallet.backup.replace_title": "Je huidige zin vervangen?",
  "wallet.backup.replace_body":
    "Je hebt al een herstelzin. Een andere terugzetten vervangt hem. Munten die de oude zin al dekte blijven op dit toestel uit te geven, maar zijn niet meer te herstellen, dus zorg dat de oude woorden opgeschreven zijn voordat je doorgaat.",
  "wallet.backup.replace": "Vervangen",
  "wallet.backup.invalid_phrase": "Die zin is niet geldig",
  "wallet.backup.invalid_phrase_body":
    "De zin heeft een ingebouwde controlesom en deze komt daar niet doorheen. Zoek naar een verkeerd getypt, ontbrekend of verwisseld woord.",
  "wallet.backup.not_bip39":
    "Dit zijn geen BIP-39-woorden: {words}. Controleer de spelling.",
  "wallet.backup.add_mint_first": "Voeg eerst een mint toe",
  "wallet.backup.add_mint_first_body":
    "Herstel werkt door een mint te vragen welke munten hij voor jou heeft ondertekend, dus moet hij weten welke mint hij moet vragen. Voeg de mints toe die je gebruikte en zet dan terug.",
  "wallet.backup.restore_failed": "Terugzetten mislukt",
  "wallet.backup.phrase": "Herstelzin",
  "wallet.backup.state_unconfirmed": "Back-up aan maar niet bevestigd",
  "wallet.backup.state_off": "Back-up uit",
  "wallet.backup.badge_on": "Aan",
  "wallet.backup.badge_unconfirmed": "Niet bevestigd",
  "wallet.backup.badge_off": "Uit",
  "wallet.backup.view": "Herstelzin bekijken",
  "wallet.backup.setup": "Een herstelzin instellen",
  "wallet.backup.view_short": "Zin bekijken",
  "wallet.backup.setup_short": "Instellen",
  "wallet.backup.restore": "Een portemonnee terugzetten met een herstelzin",
  "wallet.backup.restore_short": "Terugzetten",
  "wallet.backup.setup_title": "Een herstelzin instellen",
  "wallet.backup.on_body_short":
    "Je saldo kan op een nieuw toestel worden herbouwd uit je twaalf woorden.",
  "wallet.backup.unconfirmed_body":
    "Je hebt nooit bevestigd dat je ze hebt opgeschreven. Op dit moment bestaan de woorden alleen op deze telefoon, en dat is nu net het ding waar een back-up tegen zou moeten beschermen. Bekijk de zin en schrijf hem op.",
  "wallet.backup.not_covered":
    "{amount} is nog niet gedekt. Munten die je hebt gekregen dragen de geheimen mee van wie ze stuurde, dus ze vallen pas onder jouw zin zodra ze zijn omgeruild. Ververs een mint om ze veilig te stellen.",
  "wallet.backup.off_body":
    "Je ecash bestaat alleen op deze telefoon. Raak je hem kwijt, dan kan niemand het geld terughalen, jij ook niet. Een herstelzin is twaalf woorden waarmee je saldo overal weer opgebouwd kan worden.",
  "wallet.backup.about_to_see":
    "Je gaat zo twaalf woorden zien. Zij zijn het geld.",
  "wallet.backup.exact_order":
    "Twaalf woorden, precies in deze volgorde. Wie ze heeft, heeft je saldo.",
  "wallet.backup.verify_body":
    "Een zin die niemand heeft opgeschreven is erger dan geen zin, want hij lijkt op een vangnet dat er niet is. Twee woorden ter bevestiging.",
  "wallet.backup.verify_mismatch":
    "Dat komt niet overeen. Controleer je opgeschreven kopie.",
  "wallet.backup.restore_body":
    "Vul de twaalf woorden in. Airhop leidt je munten opnieuw af en vraagt elke mint welke hij heeft ondertekend, zodat het saldo terugkomt uit de administratie die de mint bijhoudt.",
  "wallet.backup.warn_secret":
    "Iedereen die ze leest kan je saldo meenemen. Maak er geen schermafbeelding van en bewaar ze niet op deze telefoon.",
  "wallet.backup.warn_paper":
    "Schrijf ze op papier en bewaar ze ergens veilig. Airhop kan ze je niet nog eens laten zien als de telefoon weg is.",
  "wallet.backup.warn_scope":
    "Ze bouwen alleen je ecash weer op. Je identiteit, chats en contacten vallen er niet onder.",
  "wallet.backup.warn_mints":
    "Herstel moet een mint vragen welke munten hij heeft ondertekend, dus schrijf je lijst met mints naast de woorden op.",
  "wallet.backup.preparing": "Bezig met voorbereiden…",
  "wallet.backup.show_phrase": "Mijn zin tonen",
  "wallet.backup.your_phrase": "Jouw herstelzin",
  "wallet.backup.write_down": "Schrijf deze op",
  "wallet.backup.copy_phrase": "Herstelzin naar het klembord kopiëren",
  "wallet.backup.copy_clipboard": "Naar klembord kopiëren",
  "wallet.backup.written_down": "Ik heb ze opgeschreven",
  "wallet.backup.check_copy": "Controleer je kopie",
  "wallet.backup.confirm": "Bevestigen",
  "wallet.backup.restore_title": "Terugzetten met een zin",
  "wallet.backup.phrase_placeholder": "twaalf woorden, gescheiden door spaties",
  "wallet.backup.no_mints_yet":
    "Nog geen mints toegevoegd. Herstel moet een specifieke mint vragen, dus voeg eerst de mints toe die je gebruikte.",
  "wallet.backup.scanning": "Bezig met doorzoeken…",
  "wallet.backup.restore_progress": "{mint} · sleutelset {step} van {total}",
  "wallet.backup.will_scan":
    "Wordt doorzocht: {mints}. Een mint die je niet hebt toegevoegd wordt nooit gevraagd, dus het saldo daar blijft onzichtbaar.",
  "wallet.backup.word_n": "Woord {position}",
  "wallet.backup.unreachable_mints":
    "Niet bereikt: {mints}. Het saldo dat daar staat bestaat nog steeds. Probeer het opnieuw met een betere verbinding.",
  "wallet.backup.nothing_recovered":
    "Er is niets hersteld van de doorzochte mints.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Als ontvangen markeren?",
  "wallet.delivered.body":
    "Hiermee laat je {amount} {unit} definitief los. Als het in werkelijkheid nooit is aangekomen, kun je het niet meer terugnemen.",
  "wallet.delivered.body_generic":
    "Hiermee laat je het gereserveerde bedrag definitief los. Als het in werkelijkheid nooit is aangekomen, kun je het niet meer terugnemen.",
  "wallet.delivered.cancel": "Nog niet",
  "wallet.delivered.confirm": "Ze hebben het",
  "wallet.reclaim.title": "Dit token terugnemen?",
  "wallet.reclaim.body":
    "De {amount} {unit} gaat terug naar je saldo. Doe dit alleen als het token nooit iemand heeft bereikt: hebben ze de reeks al, dan houdt degene die hem als eerste bij de mint inwisselt het geld, en dat kunnen zij zijn.",
  "wallet.reclaim.keep": "In afwachting laten",
  "wallet.reclaim.confirm": "Terugnemen",
  "wallet.copied.token_body":
    "Het token staat op je klembord. Het blijft hier apart gezet tot je het als afgeleverd markeert, dus je kunt het opnieuw plakken als de eerste poging mislukt.",
  "wallet.copied.phrase_body":
    "Plak hem in een wachtwoordmanager en maak daarna je klembord leeg. Andere apps kunnen het klembord lezen, en bij sommige instellingen synchroniseert het met je andere toestellen.",
  "wallet.refresh.failed": "Verversen mislukt",
  "wallet.refresh.partly": "Gedeeltelijk ververst",
  "wallet.refresh.done": "Ververst",
  "wallet.refresh.unreachable": "{mints} niet bereikt. Al het andere is bij.",
  "wallet.refresh.swapped":
    "{amount} {unit} bevestigd en omgeruild voor nieuwe bewijzen.",
  "wallet.refresh.secured": "{amount} {unit} valt nu onder je herstelzin.",
  "wallet.refresh.all_confirmed": "Alles hier was al bij de mint bevestigd.",
  "wallet.pending.title": "In afwachting",
  "wallet.pending.reserved_desc":
    "Gemaakt en apart gezet, aflevering niet bevestigd. De bewijzen blijven buiten je saldo zodat ze niet twee keer uitgegeven kunnen worden.",
  "wallet.pending.locked_desc":
    "Al vastgezet aan de sleutel van de ontvanger, dus alleen die kan het uitgeven. Het is alleen nog niet bij ze aangekomen. Deel het token om af te ronden.",
  "wallet.pending.show_qr": "Dit token als QR-code tonen",
  "wallet.pending.copy_again": "Het token opnieuw kopiëren",
  "wallet.pending.share_again": "Het token opnieuw delen",
  "wallet.pending.mark_delivered": "Dit token als afgeleverd markeren",
  "wallet.pending.delivered": "Afgeleverd",
  "wallet.pending.reclaim_into": "Dit token terugnemen in je saldo",
  "wallet.activity.title": "Activiteit",
  "wallet.activity.none": "Nog niets",
  "wallet.activity.none_desc":
    "Betalingen die je stuurt en ontvangt komen hier te staan, de nieuwste bovenaan, met de mint en de kosten van elk.",
  "wallet.activity.show_fewer": "Minder betalingen tonen",
  "wallet.activity.show_less": "Minder tonen",
  "wallet.activity.received_unconfirmed": "Ontvangen, niet bevestigd",
  "wallet.activity.received": "Ontvangen",
  "wallet.activity.receive_failed": "Ontvangen mislukt",
  "wallet.activity.reclaimed": "Teruggenomen",
  "wallet.activity.send_failed": "Sturen mislukt",
  "wallet.activity.sent": "Verstuurd",
  "wallet.activity.status_pending": "in afwachting",
  "wallet.activity.status_failed": "mislukt",
  "wallet.activity.status_reclaimed": "teruggenomen",
  "wallet.activity.status_expired": "verlopen",
  "wallet.activity.ln_deposit": "Lightning-storting",
  "wallet.activity.ln_withdrawal": "Lightning-uitbetaling",
  "wallet.activity.nutzap_received": "Nutzap ontvangen",
  "wallet.activity.spent_removed": "Bestede bewijzen weggehaald",
  "wallet.activity.refreshed": "Bewijzen ververst",
  "wallet.activity.refreshing": "Bewijzen worden ververst",
  "wallet.activity.just_now": "zojuist",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh offline",
  "wallet.mesh_offline_body":
    "De meshdienst draait niet, dus er is niemand om het token aan te geven. Het blijft apart gezet onder In afwachting.",
  "wallet.xfer.route_mesh":
    "Rechtstreeks aan hun toestel gegeven over de mesh.",
  "wallet.xfer.route_nostr":
    "Ze waren buiten Bluetooth-bereik, dus het ging via internet.",
  "wallet.xfer.route_courier":
    "Er is nu geen route naar ze toe. Andere toestellen dragen het mee en leveren het af zodra een van hen ze bereikt.",
  "wallet.xfer.route_queued":
    "Ze zijn nog niet bereikbaar. Het staat in de wachtrij en gaat weg zodra dat wel zo is.",
  "wallet.xfer.mesh_offline_body":
    "De meshdienst draait niet, dus er is geen manier om het token af te geven. Er is niets afgeschreven.",
  "wallet.xfer.could_not_send": "Sturen lukte niet",
  "wallet.xfer.inexact_body":
    "Je bewijzen kunnen offline niet precies {amount} {unit} maken. Het kleinste token dat je kunt maken is {spend} {unit}, en de extra {extra} {unit} gaat naar hen zonder dat je het terug kunt halen.\n\nVerversen bij de mint terwijl je online bent splitst je bewijzen op in coupures die precies uitkomen.",
  "wallet.xfer.send_amount": "{amount} sturen",
  "wallet.xfer.mesh_offline": "Mesh offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Vastgezet aan hun sleutel en op Nostr gepubliceerd. Het is van hen, of ze nu online zijn of niet.",
  "wallet.pay.rail_nutzap_dm":
    "Vastgezet aan hun sleutel. De relay nam het niet aan, dus het ging als bericht naar ze toe.",
  "wallet.pay.rail_nutzap_undelivered":
    "Vastgezet aan hun sleutel, maar er kon nog niets het meedragen. Het staat in de wachtrij, en het token staat onder In afwachting.",
  "wallet.pay.final":
    "Vastgezette betalingen kun je niet terugnemen: alleen hun sleutel kan deze munten nu nog uitgeven.",
  "wallet.pay.reclaimable":
    "Je kunt het terugnemen vanaf het Portemonnee-tabblad tot je bevestigt dat het is aangekomen.",
  "wallet.pay.why": "Zo verstuurd omdat {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} naar {name}",
  "wallet.pay.thread_receipt":
    "Je hebt {amount} {unit} gestuurd, vastgezet aan hun sleutel.",
  "wallet.pay.title": "Ecash sturen",
  "wallet.pay.to": "Aan {name}",
  "wallet.pay.amount": "Bedrag in sats",
  "wallet.pay.memo": "Opmerking (optioneel, openbaar)",
  "wallet.pay.send": "Sturen",
  "wallet.pay.sending": "Bezig met sturen…",
  "wallet.pay.action": "Ecash sturen",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Cameratoegang",
  "wallet.scan.camera_purpose": "een ecash-QR-code scannen",
  "wallet.scan.photo_label": "Fototoegang",
  "wallet.scan.photo_purpose": "een ecash-QR uit een afbeelding lezen",
  "wallet.scan.no_token": "Geen ecash-token gevonden in die afbeelding.",
  "wallet.scan.no_invoice":
    "Geen Lightning-factuur gevonden in die afbeelding.",
  "wallet.scan.unreadable": "Die afbeelding kon niet worden gelezen.",
  "wallet.scan.camera_failed":
    "De camera kon niet starten. Sluit andere camera-apps en probeer het opnieuw.",
  "wallet.scan.close": "Scanner sluiten",
  "wallet.scan.on_device":
    "Het wordt op dit toestel gelezen; er gaat niets ergens naartoe.",
  "wallet.scan.aim_token": "Richt op een ecash-QR-code.",
  "wallet.scan.aim_invoice": "Richt op de QR-code van een Lightning-factuur.",
  "wallet.scan.title_token": "Ecash scannen",
  "wallet.scan.title_invoice": "Factuur scannen",
  "wallet.scan.desc_token":
    "Lees een Cashu-token uit een andere portemonnee. Werkt met elke Cashu-portemonnee, niet alleen met Airhop.",
  "wallet.scan.desc_invoice":
    "Lees een Lightning-factuur om hem met je saldo te betalen.",
  "wallet.scan.use_camera_a11y": "Scannen met de camera",
  "wallet.scan.use_camera": "Camera gebruiken",
  "wallet.scan.pick_image_a11y":
    "Een QR-code uit een opgeslagen afbeelding lezen",
  "wallet.scan.pick_image": "Uit foto’s kiezen",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Wat is Cashu?",
  "wallet.explain.intro":
    "Cashu is ecash voor Bitcoin. Een token is een reeks die geld waard is voor wie hem heeft, blind ondertekend door een mint zodat de mint niet kan zien wie wat heeft uitgegeven. Geen accounts, geen inloggen.",
  "wallet.explain.send": "Sturen",
  "wallet.explain.send_desc":
    "Zet een bedrag om in een token dat je via Bluetooth aan een peer in de buurt kunt geven, of als tekst kunt delen. Werkt zonder internet. De bewijzen blijven apart gezet tot je bevestigt dat het is aangekomen.",
  "wallet.explain.receive": "Ontvangen",
  "wallet.explain.receive_desc":
    "Plak een token om het toe te voegen. Online wordt het meteen bij de mint omgeruild, waardoor het aantoonbaar van jou is. Offline wordt het opgeslagen en als onbevestigd gemarkeerd tot je ververst.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Betaalt een Nostr-identiteit. Als ze NIP-61-nutzapgegevens publiceren, wordt de ecash aan hun sleutel vastgezet zodat alleen zij het kunnen uitgeven. Zo niet, dan valt het terug op een versleuteld direct bericht. Heeft internet nodig.",
  "wallet.explain.add_mint": "Mint toevoegen",
  "wallet.explain.add_mint_desc":
    "Bewaart de mint die je ecash uitgeeft en inwisselt, en houdt de publieke sleutels bij zodat tokens ervan offline te controleren zijn. Kies een mint die je het saldo toevertrouwt dat je daar bewaart.",
  "wallet.explain.phrase": "Herstelzin",
  "wallet.explain.phrase_desc":
    "Je munten worden afgeleid uit twaalf woorden die de portemonnee aan het begin maakt, zodat een nieuwe telefoon het saldo kan herbouwen door je mints te vragen welke munten ze hebben ondertekend. Tot je ze bekijkt en opschrijft, bestaan ze alleen op deze telefoon.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Portemonnee op slot",
  "wallet.err.mint_unreachable": "Mint onbereikbaar",
  "wallet.err.tor_blocked": "Geblokkeerd zolang Tor aanstaat",
  "wallet.err.insufficient": "Niet genoeg saldo",
  "wallet.err.exact_amount": "Dat exacte bedrag kan niet worden gestuurd",
  "wallet.err.no_mint": "Geen mint",
  "wallet.err.mint_unsupported": "De mint kan dat niet",
  "wallet.err.mint_refused": "De mint weigerde",
  "wallet.err.unreadable": "Onleesbaar token",
  "wallet.err.rejected": "Token geweigerd",
  "wallet.err.already_spent": "Al besteed",
  "wallet.err.change_pending": "Betaald, wisselgeld in afwachting",
  "wallet.svc.mint_unreachable": "De mint kon niet worden bereikt.",
  "wallet.svc.tor_ios": "Op iOS gaan mintverzoeken niet via Tor.",
  "wallet.svc.tor_ios_body":
    "Arti omhult alleen Nostr-WebSockets, dus dit verzoek zou de mint over het open net bereiken en je IP aan deze bewijzen koppelen. Sta het toe onder Instellingen > Beveiliging, of zet Tor eerst uit. Ecash sturen en ontvangen over de mesh blijft werken.",
  "wallet.svc.keys_uncached":
    "De sleutels van deze mint staan niet op dit toestel.",
  "wallet.svc.keys_uncached_body":
    "Open de portemonnee één keer terwijl je online bent om ze op te halen.",
  "wallet.svc.phrase_invalid": "Die herstelzin is niet geldig.",
  "wallet.svc.phrase_invalid_body":
    "Zoek naar een verkeerd getypt of ontbrekend woord. De zin heeft een ingebouwde controlesom, dus één fout woord maakt het geheel ongeldig.",
  "wallet.svc.need_mint": "Voeg eerst minstens één mint toe.",
  "wallet.svc.need_mint_body":
    "Herstel werkt door een mint te vragen welke munten hij voor jou heeft ondertekend, dus moet hij weten welke mint hij moet vragen.",
  "wallet.svc.restored": "Teruggezet met de herstelzin",
  "wallet.svc.storage_locked": "De opslag van de portemonnee zit op slot.",
  "wallet.svc.storage_locked_body":
    "Airhop bewaart ecash-bewijzen in een versleuteld bestand waarvan de sleutel in de sleutelhanger van het toestel zit. Ontgrendel het toestel en open de app opnieuw.",
  "wallet.svc.bad_url": "Dat is geen geldige URL.",
  "wallet.svc.needs_https": "De URL van een mint moet met https:// beginnen.",
  "wallet.svc.refuse_http":
    "We weigeren een mint over onversleuteld http te gebruiken.",
  "wallet.svc.refuse_http_body":
    "Iedereen op het netwerkpad zou je bewijzen kunnen lezen of veranderen. Gebruik een mint met https://.",
  "wallet.svc.mint_not_saved": "De mint kon niet worden opgeslagen.",
  "wallet.svc.unreadable_token": "Dat is geen leesbaar Cashu-token.",
  "wallet.svc.unreadable_token_body":
    "Tokens beginnen met cashuA of cashuB. Controleer of er bij het kopiëren niets is afgeknipt.",
  "wallet.svc.wrong_mint":
    "Dit token is niet ondertekend door de mint die het noemt.",
  "wallet.svc.already_spent": "Deze bewijzen zijn al besteed.",
  "wallet.svc.already_spent_body":
    "Wie dit token stuurde heeft het eerder ingewisseld, of hetzelfde token ook naar iemand anders gestuurd.",
  "wallet.svc.receiving_offline": "offline aan het ontvangen",
  "wallet.svc.amount_positive": "Vul een bedrag groter dan nul in.",
  "wallet.svc.coins_raced":
    "Die munten zijn net door een andere betaling gebruikt.",
  "wallet.svc.coins_raced_body":
    "Er is niets afgeschreven. Probeer het opnieuw, dan kiest de portemonnee een andere set.",
  "wallet.svc.no_ecash": "Nog geen ecash.",
  "wallet.svc.no_ecash_body":
    "Voeg een mint toe en stort via Lightning, of ontvang een token van iemand.",
  "wallet.svc.split_across_mints": "Je saldo is over meerdere mints verdeeld.",
  "wallet.svc.mint_says_spent": "De mint meldde deze bewijzen als al besteed.",
  "wallet.svc.issue_against_invoice":
    "ecash uitgeven tegen een Lightning-factuur",
  "wallet.svc.pay_invoice": "een Lightning-factuur betalen",
  "wallet.svc.unknown_deposit": "Onbekende storting.",
  "wallet.svc.invoice_expired_before":
    "De factuur verliep voordat hij betaald was.",
  "wallet.svc.invoice_expired": "Die factuur is verlopen.",
  "wallet.svc.invoice_unpaid": "De factuur is nog niet betaald.",
  "wallet.svc.payment_unknown":
    "Betaalstatus onbekend; wordt bij de volgende keer verversen opnieuw gecontroleerd.",
  "wallet.svc.melt_change_pending": "Je factuur is betaald.",
  "wallet.svc.melt_change_pending_body":
    "De mint heeft de ongebruikte routeringskosten nog niet teruggegeven. Ze worden bij de volgende keer verversen vanzelf opgehaald, en er gaat ondertussen niets verloren.",
  "wallet.svc.mint_did_not_pay":
    "De mint heeft deze factuur niet betaald. Je saldo is onveranderd.",
  "wallet.svc.not_an_invoice": "Dat is geen Lightning-factuur.",
  "wallet.svc.not_an_invoice_body":
    "Plak een bolt11-factuur die met lnbc begint.",
  "wallet.svc.insufficient_for_invoice": "Niet genoeg saldo voor deze factuur.",
  "wallet.svc.coins_raced_invoice_body":
    "Er is niets afgeschreven en de factuur is niet betaald. Probeer het opnieuw.",
  "wallet.svc.same_mint": "Kies een andere doelmint.",
  "wallet.svc.same_mint_body":
    "Bron en bestemming zijn dezelfde mint, dus er valt niets te verplaatsen.",
  "wallet.svc.quote_failed_retried":
    "Offerte mislukt, samenvoegen opnieuw geprobeerd",
  "wallet.svc.amount_unfit_retried":
    "Bedrag paste niet, samenvoegen opnieuw geprobeerd",
  "wallet.svc.cannot_size":
    "De omvang van deze overboeking kon niet worden bepaald.",
  "wallet.svc.insufficient_at_mint": "Niet genoeg saldo bij {mint}.",
  "wallet.svc.inexact_title":
    "Je bewijzen kunnen offline niet precies {amount} {unit} maken.",
  "wallet.svc.inexact_detail":
    "Het kleinste token dat je kunt sturen is {spend} {unit}. Offline bestaat er geen wisselgeld, dus de extra {extra} {unit} gaat naar de ontvanger.",
  "wallet.svc.no_single_mint":
    "Geen enkele mint houdt in z’n eentje {amount} {unit}. Ecash van verschillende mints kan niet in één token worden samengevoegd: voeg het eerst bij één mint samen, of stuur het in aparte bedragen.",
  "wallet.svc.have_tried_send":
    "Je hebt {total} {unit} en probeerde {amount} te sturen.",
  "wallet.svc.invoice_needs":
    "Deze factuur heeft {total} {unit} nodig inclusief de routeringsreserve, en jij hebt {balance}.",
  "wallet.svc.nothing_to_move": "{mint} heeft geen {unit} om te verplaatsen.",
  "wallet.svc.consolidate_memo": "Samenvoegen vanaf {mint}",
  "wallet.svc.cannot_size_detail":
    "Na de Lightning-routeringskosten kan {from} geen bruikbaar bedrag naar {to} verplaatsen. Probeer in plaats daarvan een specifiek kleiner bedrag.",
  "wallet.svc.mint_cannot": "{mint} kan niet {action}.",
  "wallet.svc.no_nut": "De mint kondigt NUT-{nut} niet aan.",
  "wallet.svc.unknown_mint":
    "Die betaling noemt een mint die je niet gebruikt.",
  "wallet.svc.unknown_mint_body":
    "Voeg de mint zelf toe als je hem vertrouwt; er wordt niets ingewisseld bij een mint die je niet hebt gekozen.",
  "wallet.svc.no_relay": "geen verbinding met een relay",
  "wallet.svc.no_shared_mint": "geen gedeelde mint met genoeg saldo",
  "wallet.svc.no_nutzap_info":
    "de ontvanger heeft geen nutzapgegevens gepubliceerd (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Vastgezet aan hun sleutel maar nog niet afgeleverd. Deel het token van deze transactie om het af te ronden.",
  "wallet.svc.swap_lost":
    "De mint heeft deze omruil nooit afgemaakt, dus er is er niets tegenover uitgegeven.",
  "wallet.svc.swap_unreadable":
    "Deze omruil is opgeslagen in een vorm die deze versie niet opnieuw kan afspelen.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Geverifieerd via QR",
  "contacts.qr.keys_unverified": "Sleutels ontvangen, niet geverifieerd",
  "contacts.qr.not_verified": "Nog niet geverifieerd",
  "contacts.qr.message": "Bericht",
  "contacts.qr.add": "Contact toevoegen",
  "contacts.qr.scan_title": "QR-code scannen",
  "contacts.qr.aim": "Richt je camera op hun QR-code",
  "contacts.qr.add_desc": "Bereik iemand die niet in de buurt is op de mesh.",
  "contacts.qr.peer_id_hint":
    "Een peer-ID is 16 tekens. Een contactcode begint met airhop:.",
  "contacts.qr.or_scan": "of scan hun QR",
  "contacts.qr.trust_note":
    "Alleen een QR die je met je eigen camera scant verifieert hun sleutel. Een geplakte code brengt hun sleutels mee, maar niet het bewijs dat hij van hen komt.",
  "contacts.qr.peer_id": "Peer-ID of contactcode",
  "contacts.qr.peer_id_placeholder": "Plak een ID of een contactcode",
  "contacts.qr.scan_camera_a11y": "QR-code scannen met de camera",
  "contacts.qr.scan_camera_desc": "Gebruik je camera",
  "contacts.qr.upload_a11y": "QR-afbeelding uit de galerij uploaden",
  "contacts.qr.upload": "Uploaden uit de galerij",
  "contacts.qr.upload_desc": "Kies een opgeslagen QR-afbeelding",
  "contacts.qr.scan_a11y": "Een contact toevoegen door een QR-code te scannen",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Plak een peer-ID van 16 tekens, een airhop://peer/…-link of een contactcode.",
  "contacts.scan.camera_label": "Cameratoegang",
  "contacts.scan.camera_purpose": "de QR-code van een contact scannen",
  "contacts.scan.camera_needed":
    "Cameratoegang is nodig om te scannen. Je kunt nog steeds toevoegen via peer-ID.",
  "contacts.scan.camera_failed":
    "De camera kon niet starten. Sluit andere camera-apps en probeer het opnieuw.",
  "contacts.scan.photo_label": "Fototoegang",
  "contacts.scan.photo_purpose": "een QR-code scannen die je hebt opgeslagen",
  "contacts.scan.photo_needed":
    "Fototoegang is nodig om een afbeelding te kiezen. Je kunt nog steeds toevoegen via peer-ID.",
  "contacts.scan.no_qr": "Geen Airhop-QR-code gevonden in die afbeelding.",
  "contacts.scan.unreadable":
    "Er kon geen QR-code uit die afbeelding worden gelezen.",
  "contacts.scan.bitchat_expired":
    "Die bitchat-code is verlopen. Vraag ze hun QR opnieuw te openen.",
  "contacts.scan.tampered":
    "Deze QR-code is ongeldig: het peer-ID komt niet overeen met de sleutels. Er is misschien mee geknoeid.",
  "contacts.scan.already_added": "Staat al in je contacten",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Wachten op cameratoegang…",
  "contacts.verify.camera_off": "De camera staat uit",
  "contacts.verify.open_settings": "Instellingen openen",
  "contacts.verify.verified": "Geverifieerd",
  "contacts.verify.different": "Ander contact",
  "contacts.verify.scan_again": "Opnieuw scannen",
  "contacts.verify.failed": "Verifiëren lukte niet",
  "contacts.verify.done": "Klaar",
  "contacts.verify.title": "{name} verifiëren",
  "contacts.verify.aim": "Richt je camera op hun QR-code",
  "contacts.verify.camera_off_body":
    "Zet cameratoegang aan in de instellingen om via QR te verifiëren.",
  "contacts.verify.match_body":
    "De sleutel van {name} komt overeen. Je kunt dit contact vertrouwen.",
  "contacts.verify.different_body":
    "Deze QR is van iemand anders. Vraag {name} om de eigen code te laten zien.",
  "contacts.verify.tampered_body":
    "Er lijkt met deze QR geknoeid: het ID komt niet overeen met de sleutel.",
  "contacts.verify.choose_title": "Hoe wil je het nagaan?",
  "contacts.verify.choose_body":
    "Allebei bevestigen ze dat de sleutels op deze telefoon echt van {name} zijn.",
  "contacts.verify.method_scan": "Hun code scannen",
  "contacts.verify.method_scan_sub": "Ze zijn hier bij je",
  "contacts.verify.method_compare": "Een code vergelijken",
  "contacts.verify.method_compare_sub":
    "Lees hem elkaar voor tijdens een gesprek",
  "contacts.verify.no_keys":
    "Nog geen sleutels voor dit contact. Schrijf ze, of scan hun code als jullie elkaar zien.",
  "contacts.verify.compare_title": "Lees deze aan elkaar voor",
  "contacts.verify.compare_body":
    "{name} ziet dezelfde zes woorden. Als ze overeenkomen, weten jullie allebei dat de sleutels echt zijn.",
  "contacts.verify.codes_match": "Ze komen overeen",
  "contacts.verify.codes_differ": "Ze komen niet overeen",
  "contacts.verify.compared_body":
    "Jij en {name} hebben dezelfde code bevestigd. Dit contact is geverifieerd.",

  // ---- Settings: shared chrome ----
  "settings.back": "Terug",
  "settings.coming_soon": "Binnenkort",
  "settings.opens_externally": "{label}, opent buiten de app",
  "settings.peer_id": "Peer-ID",
  "settings.share_peer_id": "Deel je peer-ID",
  "settings.share_id_short": "ID delen",
  "settings.peer_id_sheet.title": "Jouw peer-ID",
  "settings.peer_id_sheet.copy": "Peer-ID kopiëren",
  "settings.peer_id_sheet.note":
    "Dit werkt alleen als jullie allebei binnen Bluetooth-bereik zijn. Wil je dat iemand je van overal kan schrijven, deel dan je QR-code.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Algemeen",
  "settings.section.general_desc":
    "Optionele functies, verzenden ongedaan maken, media, resetten",
  "settings.section.privacy": "Privacy en beveiliging",
  "settings.section.privacy_desc":
    "Forward secrecy, ondertekende pakketten, geblokkeerde peers",
  "settings.section.network": "Netwerk en relays",
  "settings.section.network_desc":
    "Terugval op internet, nostr-relays, bitchat-compatibiliteit",
  "settings.section.permissions": "Rechten",
  "settings.section.permissions_desc":
    "Bluetooth, locatie, meldingen, camera, microfoon",
  "settings.section.storage": "Opslag en gegevens",
  "settings.section.diagnostics": "Diagnostiek",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transporten",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "In de buurt",
  "settings.group.sync": "Synchronisatie",
  "settings.group.features": "Functies",
  "settings.group.messages": "Berichten",
  "settings.group.local": "Lokaal",
  "settings.group.media": "Media",
  "settings.group.reset": "Resetten",
  "settings.group.always_on": "Altijd aan",
  "settings.group.notifications": "Meldingen",
  "settings.group.blocked": "Geblokkeerd",
  "settings.group.theme": "Thema",
  "settings.group.font": "Lettertype",
  "settings.group.language": "Taal",
  "settings.section.diagnostics_desc":
    "Verbindingsstatus en toestellen in de buurt",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Bluetooth-verbindingen",
  "settings.diag.ble_links_desc":
    "Toestellen waarmee deze telefoon rechtstreeks verbonden is",
  "settings.diag.lan": "Lokaal netwerk",
  "settings.diag.lan_desc": "Telefoons op hetzelfde wifi-netwerk",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Van telefoon naar telefoon zonder router",
  "settings.diag.wifi_active": "Actief",
  "settings.diag.wifi_unsupported": "Niet ondersteund op dit toestel",
  "settings.diag.wifi_permission": "Geblokkeerd door een recht",
  "settings.diag.wifi_unavailable": "Op dit moment niet beschikbaar",
  "settings.diag.wifi_unpaired": "Niets gekoppeld",
  "settings.diag.wifi_unknown": "Wachten op de radio",
  "settings.diag.relays": "Nostr-relays",
  "settings.diag.relays_desc":
    "Gebruikt voor locatiekanalen en bereik via internet",
  "settings.diag.connected": "Verbonden",
  "settings.diag.disconnected": "Niet verbonden",
  "settings.diag.peer_direct": "Directe verbinding",
  "settings.diag.peer_relayed": "Gehoord via een ander toestel",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Geen signaalmeting",
  "settings.diag.no_peers": "Niemand binnen bereik",
  "settings.diag.no_peers_desc": "{links} radioverbindingen open",
  "settings.diag.gcs_size": "Filtergrootte",
  "settings.diag.gcs_size_desc":
    "Het grootste synchronisatiefilter dat de lucht in ging",
  "settings.diag.fpr": "Percentage valse positieven",
  "settings.diag.fpr_desc":
    "Hoe vaak het filter een pakket claimt dat wij niet hebben",
  "settings.diag.bytes": "{n} bytes",
  "settings.diag.footnote":
    "Hier valt niets te veranderen. Deze waarden liggen vast zodat Airhop compatibel blijft met bitchat.",
  "settings.section.storage_desc": "Gebruik en cache",
  "settings.section.appearance": "Weergave",
  "settings.section.appearance_desc": "Thema, lettertype en taal",
  "settings.section.help": "Hulp en feedback",
  "settings.section.help_desc":
    "Neem contact op, meld een fout of lees de veelgestelde vragen",
  "settings.section.support": "Steun",
  "settings.section.support_desc": "Help de ontwikkeling op gang te houden",
  "settings.section.about": "Over",
  "settings.section.about_desc": "Versie, wijzigingslog en broncode",

  // ---- Settings: general ----
  "settings.general.undo": "Verzenden ongedaan maken",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Portemonnee",
  "settings.general.undo_seconds": "{count} seconden",
  "settings.general.undo_a11y": "Verzenden ongedaan maken: {value}",
  "settings.general.quality_a11y": "Uploadkwaliteit op {value} zetten",
  "settings.general.undo_desc":
    "Houdt een verstuurd bericht even vast zodat je het kunt terugnemen voordat het weggaat",
  "settings.general.undo_off_desc": "Meteen versturen, niets terug te nemen",
  "settings.general.undo_2": "2 seconden",
  "settings.general.undo_2_desc": "Een korte kans om het terug te nemen",
  "settings.general.undo_10": "10 seconden",
  "settings.general.undo_10_desc": "De langste marge",
  "settings.general.quality": "Uploadkwaliteit",
  "settings.general.quality_desc":
    "Geldt voor foto’s die je vanaf je camera of galerij stuurt. Hoe dan ook wordt elke foto op de mesh afgestemd.",
  "settings.general.quality_low": "Laag",
  "settings.general.quality_low_desc": "Kleinste foto’s, snelst te versturen",
  "settings.general.quality_medium": "Gemiddeld",
  "settings.general.quality_medium_desc": "Evenwicht tussen detail en snelheid",
  "settings.general.quality_high": "Hoog",
  "settings.general.quality_high_desc": "Behoudt de meeste details",
  "settings.general.feature_wallet_desc":
    "Stuur Cashu-ecash van peer naar peer over de mesh",
  "settings.general.feature_wallet_a11y": "Portemonnee (altijd aan)",
  "settings.general.feature_ai_desc":
    "Privéassistent op het toestel zelf, zonder netwerkoproepen",
  "settings.general.feature_feeds": "Feeds",
  "settings.general.feature_feeds_desc":
    "Lees en plaats berichten op Bluesky- en Mastodon-feeds",
  "settings.general.show_media": "Media automatisch tonen",
  "settings.general.show_media_desc":
    "Foto’s en video’s verschijnen in de chat, of blijven achter een tik",
  "settings.general.reset": "Instellingen resetten",
  "settings.general.media_retention": "Media bewaren gedurende",
  "settings.general.media_retention_desc":
    "Foto’s, video’s en spraakberichten worden na de gekozen tijd verwijderd",
  "settings.general.media_retention_sheet":
    "Kies hoe lang media op dit toestel blijft staan. Verwijderde media is niet terug te halen.",
  "settings.general.retention_7_desc":
    "Laat de minste sporen achter. Het beste als de telefoon zelf het risico is.",
  "settings.general.retention_14_desc":
    "Een middenweg voor een week of twee zonder bereik.",
  "settings.general.retention_30_desc":
    "Houdt gesprekken het langst leesbaar, en neemt de meeste ruimte in.",
  "settings.general.reset_desc":
    "Zet elke voorkeur terug op de standaard en laat je identiteit, berichten, contacten en portemonnee met rust",
  "settings.general.reset_title": "Instellingen resetten?",
  "settings.general.reset_body":
    "Elke voorkeur gaat terug naar de standaard: weergave, verzenden ongedaan maken en connectiviteit (internet, Tor, gateway, brug, relays). Je identiteit, berichten, contacten en portemonnee blijven ongemoeid.",
  "settings.general.reset_confirm": "Resetten",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet staat altijd aan voor directe berichten",
  "settings.security.signed_packets": "Ondertekende pakketten",
  "settings.security.signed_packets_desc":
    "Elk pakket wordt met Ed25519 ondertekend",
  "settings.security.hide_previews": "Voorbeelden in meldingen verbergen",
  "settings.security.hide_previews_desc":
    "Houdt afzender en bericht van je vergrendelscherm af, want dat laat ze zien zonder ontgrendelen",
  "settings.security.no_blocked": "Geen geblokkeerde peers",
  "settings.security.no_blocked_desc":
    "Geblokkeerde peers kunnen je niet schrijven en verschijnen niet op het Mesh-tabblad",
  "settings.security.unblock_title": "Deze peer deblokkeren",
  "settings.security.unblock": "Deblokkeren",
  "settings.security.unblock_peer": "{name} deblokkeren",
  "settings.security.unblock_body":
    "{name} kan je weer schrijven en verschijnt weer op het Mesh-tabblad zodra die in de buurt is.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Terugval op internet",
  "settings.network.internet_desc":
    "Ga door via Nostr-relays als meshpeers buiten bereik zijn",
  "settings.network.internet_off_title": "Internet uitzetten?",
  "settings.network.internet_off_body":
    "Airhop draait dan alleen op Bluetooth. Het neemt geen contact meer op met Nostr-relays, en Tor, de internetgateway en de meshbrug gaan allemaal uit. Bluetooth-chat in de buurt blijft werken.",
  "settings.network.turn_off": "Uitzetten",
  "settings.network.discovery": "Geo-relays zoeken",
  "settings.network.discovery_desc":
    "Kiest automatisch de dichtstbijzijnde relays voor een locatiecel uit meer dan 300 verspreide relays",
  "settings.network.discovery_needs_relay": "Voeg eerst een eigen relay toe",
  "settings.network.discovery_needs_relay_body":
    "Het automatisch zoeken wijst Airhop de weg naar de dichtstbijzijnde relays. Uitzetten heeft pas zin als je hieronder je eigen relays hebt vastgezet, dus voeg er eerst minstens één toe.",
  "settings.network.custom_only_title": "Alleen je eigen relays gebruiken?",
  "settings.network.custom_only_body":
    "Locatiekanalen en de meshbrug kiezen dan niet meer automatisch de dichtstbijzijnde relays en gebruiken alleen die van jou. Dat kan het bereik verkleinen, en je loopt bitchat-gebruikers misschien mis, want die verzamelen zich op de dichtstbijzijnde relays.",
  "settings.network.custom": "Eigen relays",
  "settings.network.custom_desc":
    "Voeg je eigen relays toe voor locatiekanalen en de meshbrug",
  "settings.network.custom_added": "{count} van {max} toegevoegd",
  "settings.network.dm_relays": "Berichtrelays",
  "settings.network.dm_relays_desc":
    "Directe berichten en privékanalen gebruiken altijd deze. Eigen relays veranderen daar niets aan.",
  "settings.network.discovery_back_on": "Geo-relays zoeken staat weer aan",
  "settings.network.discovery_back_on_body":
    "Dat was je laatste eigen relay. Locatiekanalen hebben ergens nodig om te publiceren, dus Airhop kiest weer automatisch de dichtstbijzijnde relays.",
  "settings.network.add_relay": "Relay toevoegen",
  "settings.network.remove_relay": "{url} weghalen",
  "settings.network.add_short": "Toevoegen",
  "settings.network.relay_limit":
    "Je kunt {count} relays toevoegen. Haal er een weg om er nog een toe te voegen.",
  "settings.network.relay_duplicate": "Die relay staat al in je lijst.",
  "settings.network.relay_invalid":
    "Vul een geldige relayhost in, bijvoorbeeld relay.example.com. Een poort is alleen nodig als de relay niet de standaardpoort gebruikt. IP-adressen en lokale namen zijn niet toegestaan.",
  "settings.network.lan": "Lokaal netwerk",
  "settings.network.lan_desc":
    "Bereik mensen op dezelfde WiFi, ook tussen iPhone en Android. Andere apparaten op het netwerk kunnen zien dat je Airhop gebruikt.",
  "settings.network.lan_searching": "Geen Airhop-apparaten op dit netwerk",
  "settings.network.lan_active": "Verbonden op dit netwerk",
  "settings.network.lan_unavailable": "Niet op een WiFi-netwerk",
  "settings.network.lan_permission":
    "Toegang tot het lokale netwerk staat uit voor Airhop",
  "settings.network.lan_unsupported": "Niet beschikbaar op dit apparaat",
  "settings.network.lan_foreground":
    "Pauzeert wanneer Airhop op de achtergrond staat. Bluetooth blijft draaien.",
  "settings.network.wifi_pair": "Koppelen",
  "settings.network.wifi_paired": "Gekoppelde apparaten",
  "settings.network.wifi_pair_find": "Een apparaat zoeken",
  "settings.network.wifi_pair_find_desc":
    "Zoek een iPhone in de buurt die zichzelf laat zien. Beide hebben iOS 26 of nieuwer nodig.",
  "settings.network.wifi_pair_show": "Deze iPhone tonen",
  "settings.network.wifi_pair_show_desc":
    "Laat een iPhone in de buurt deze vinden. De een zoekt, de ander laat zich zien, op hetzelfde moment.",
  "settings.network.wifi_pair_find_action": "Kies een iPhone in de buurt",
  "settings.network.wifi_pair_show_action": "Deze iPhone vindbaar maken",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware is nu niet beschikbaar",
  "settings.network.wifi_pair_forget":
    "Verwijder een koppeling in de app Settings",
  "settings.network.bitchat": "bitchat-compatibiliteit",
  "settings.network.bitchat_desc":
    "Dezelfde BLE-mesh als bitchat, volledig samenwerkend. Dit staat altijd aan en kan niet uit.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Op de achtergrond draaien",
  "settings.conn.background_desc": "Houd de mesh draaiend als Airhop dicht is",
  "settings.conn.background_on_title": "Mesh laten doordraaien?",
  "settings.conn.background_on_body":
    "Airhop blijft doorgeven en ontvangen als het dicht is, zodat berichten aankomen terwijl je weg bent. Android toont ondertussen een blijvende melding.",
  "settings.conn.background_off_title": "Mesh stoppen als Airhop dichtgaat?",
  "settings.conn.background_off_body":
    "Berichten komen dan alleen aan terwijl Airhop open is, en deze telefoon geeft niets meer door voor mensen in de buurt. De blijvende melding verdwijnt.",
  "settings.conn.live_voice": "Live spraak",
  "settings.conn.live_voice_desc":
    "Praat met mensen in de buurt als met een portofoon",
  "settings.conn.live_voice_on_title": "Live spraak aanzetten?",
  "settings.conn.live_voice_on_body":
    "Als je de microfoon ingedrukt houdt, gaat je stem terwijl je praat naar iedereen binnen Bluetooth-bereik, en die van hen komt uit jouw telefoon. Er wordt niets opgenomen.",
  "settings.conn.live_voice_off_title": "Live spraak uitzetten?",
  "settings.conn.live_voice_off_body":
    "De microfoon ingedrukt houden neemt dan een spraakbericht op. Het gaat weg als je loslaat, en niemand hoort het tot ze het afspelen.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Via Tor routeren",
  "settings.conn.tor_desc":
    "Laat Nostr-verkeer via Tor lopen voor extra privacy",
  "settings.conn.tor_on_title": "Nostr-verkeer via Tor laten lopen?",
  "settings.conn.tor_on_body":
    "Relays zien je IP-adres niet meer. Verbinden duurt langer en berichten komen trager aan. Bluetooth verandert niet.",
  "settings.conn.tor_off_title": "Routeren via Tor uitzetten?",
  "settings.conn.tor_off_body":
    "Nostr-verkeer gaat weer over je gewone verbinding, dus relays zien je IP-adres weer. Bluetooth verandert hoe dan ook niet.",
  "settings.conn.tor_unavailable": "Routeren via Tor zit niet in deze build.",
  "settings.conn.tor_timeout":
    "Tor doet er langer dan een minuut over om te verbinden. Het blijft aan en blijft proberen; het Mesh-tabblad laat weten wanneer het routeert, of dat dit netwerk het blokkeert.",
  "settings.conn.tor_failed":
    "Tor kon niet starten. Controleer of de app netwerktoegang heeft.",
  "settings.conn.mint_clearnet": "Mintverkeer over het open net toestaan",
  "settings.conn.mint_clearnet_desc":
    "Tor op iOS dekt alleen Nostr. Laat dit uit om mintverzoeken te blokkeren; ecash over de mesh blijft hoe dan ook werken.",
  "settings.conn.gateway": "Internetgateway",
  "settings.conn.gateway_desc":
    "Leen je verbinding uit aan een telefoon in de buurt zonder net, zodat die de locatiekanalen toch bereikt",
  "settings.conn.gateway_on_title": "Internetgateway aanzetten?",
  "settings.conn.gateway_on_body":
    "Telefoons in de buurt zonder eigen verbinding sturen en ontvangen berichten van locatiekanalen via die van jou. Dat kost je mobiele data en je batterij, en hun berichten blijven end-to-end versleuteld, dus je kunt niet lezen wat er langskomt.",
  "settings.conn.gateway_off_title": "Internetgateway uitzetten?",
  "settings.conn.gateway_off_body":
    "Telefoons in de buurt zonder net bereiken de locatiekanalen niet meer via die van jou. Je eigen berichten veranderen niet.",
  "settings.conn.bridge": "Meshbrug",
  "settings.conn.bridge_desc":
    "Koppel de openbare #bluetooth-chat van dit gebied via internet aan een andere Bluetooth-groep buiten bereik",
  "settings.conn.bridge_on_title": "Meshbrug aanzetten?",
  "settings.conn.bridge_on_body":
    "Je openbare #bluetooth-berichten worden via internet in je buurt gepubliceerd, zodat mensen buiten Bluetooth-bereik ze kunnen lezen. Privéberichten gaan nooit over de brug, en “alleen dichtbij” houdt een los bericht lokaal.",
  "settings.conn.bridge_off_title": "Meshbrug uitzetten?",
  "settings.conn.bridge_off_body":
    "Je openbare #bluetooth-berichten blijven weer binnen Bluetooth-bereik, en die van de gekoppelde groep komen hier niet meer aan.",
  "settings.conn.bridge_needs_location": "De meshbrug heeft locatie nodig",
  "settings.conn.bridge_needs_location_desc":
    "Hij vindt je buurt aan de hand van een locatiemeting. Geef locatietoestemming om te gaan koppelen.",
  "settings.conn.grant_location": "Locatietoestemming geven",
  "settings.conn.grant_short": "Toestaan",
  "settings.conn.internet_off": "Internet staat uit",
  "settings.conn.internet_off_desc":
    "Tor, de brug en de gateway gebruiken allemaal internet. Zet terugval op internet aan onder Netwerk om ze te gebruiken.",
  "settings.conn.turn_on": "Aanzetten",
  "settings.conn.turn_off": "Uitzetten",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Vindt toestellen in de buurt en geeft berichten tussen ze door. Zonder dit kan de mesh niet werken.",
  "settings.permissions.location": "Locatie",
  "settings.permissions.location_desc":
    "Opent de kanalen van gebieden dichtbij. Zonder dit blijven die kanalen dicht en draait de Bluetooth-mesh gewoon door.",
  "settings.permissions.notifications": "Meldingen",
  "settings.permissions.notifications_desc":
    "Krijg meldingen van nieuwe berichten, ook als de app dicht is. Zonder dit zie je ze pas als je Airhop opent.",
  "settings.permissions.camera": "Camera",
  "settings.permissions.camera_desc":
    "Scan QR-codes en maak foto’s of video’s om te versturen. Zonder dit kun je nog steeds media uit je galerij delen.",
  "settings.permissions.photos": "Foto’s",
  "settings.permissions.photos_desc":
    "Stuur foto’s uit je galerij en bewaar ontvangen media. Zonder dit kun je nog steeds nieuwe foto’s maken en versturen met de camera.",
  "settings.permissions.microphone": "Microfoon",
  "settings.permissions.microphone_desc":
    "Neem spraakberichten op en verstuur ze, of gebruik live spraak. Zonder dit werken spraakberichten en live spraak niet.",
  "settings.permissions.allow": "Dit recht geven",
  "settings.permissions.open_settings":
    "Systeeminstellingen openen om dit recht te wijzigen",
  "settings.permissions.system": "Systeem",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Netwerkgebruik",
  "settings.storage.storage_usage": "Opslaggebruik",
  "settings.storage.storage_usage_desc":
    "Berichten, portemonneebewijzen en bijlagen in de cache",
  "settings.storage.session_usage":
    "Deze sessie · {sent} verstuurd, {received} ontvangen",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} aan bijlagen",
  "settings.storage.clear_cache": "Bijlagecache leegmaken",
  "settings.storage.clear": "Leegmaken",
  "settings.storage.clear_title": "Media in de cache leegmaken?",
  "settings.storage.clear_body":
    "Foto’s, video’s, spraakberichten en bestanden worden van dit toestel gehaald, zowel verstuurd als ontvangen. Ze zijn niet opnieuw te downloaden: hun ballonnen zeggen dat, en je kunt de afzender vragen ze opnieuw te sturen. Berichten en portemonnee blijven ongemoeid.",
  "settings.storage.cleared": "Cache leeggemaakt",
  "settings.storage.freed": "{size} vrijgemaakt.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Weergave op {value} zetten",
  "settings.font.set_a11y": "Vaste-breedtelettertype op {value} zetten",
  "settings.font.system": "Systeem",
  "settings.font.system_desc":
    "Gebruikt het standaard vaste-breedtelettertype van je toestel",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Modern en makkelijk te lezen",
  "settings.language.en": "Engels",
  "settings.language.am": "Amhaars",
  "settings.language.ar": "Arabisch",
  "settings.language.bn": "Bengaals",
  "settings.language.my": "Birmaans",
  "settings.language.zh_hans": "Chinees (vereenvoudigd)",
  "settings.language.zh_hant": "Chinees (traditioneel)",
  "settings.language.nl": "Nederlands",
  "settings.language.fil": "Filipijns",
  "settings.language.fr": "Frans",
  "settings.language.ka": "Georgisch",
  "settings.language.de": "Duits",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesisch",
  "settings.language.it": "Italiaans",
  "settings.language.ja": "Japans",
  "settings.language.ko": "Koreaans",
  "settings.language.mg": "Malagassisch",
  "settings.language.ms": "Maleis",
  "settings.language.ne": "Nepalees",
  "settings.language.fa": "Perzisch",
  "settings.language.pl": "Pools",
  "settings.language.pt_br": "Portugees (Brazilië)",
  "settings.language.pt_pt": "Portugees (Portugal)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Russisch",
  "settings.language.es": "Spaans",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Zweeds",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thai",
  "settings.language.tr": "Turks",
  "settings.language.uk": "Oekraïens",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamees",
  "settings.language.pseudo": "Pseudotaal",
  "settings.language.soon": "Binnenkort",
  "settings.language.soon_a11y": "{value}, binnenkort",
  "settings.language.set_a11y": "Taal op {value} zetten",
  "settings.language.pending": "Bij de volgende keer openen",
  "settings.language.pending_a11y":
    "{value}, gaat in de volgende keer dat je Airhop opent",
  "settings.language.rtl_restart": "Nu opnieuw openen",
  "settings.language.rtl_title": "Open Airhop opnieuw om het af te maken",
  "settings.language.rtl_body":
    "{value} leest van rechts naar links, en Airhop kan de richting alleen bij het starten veranderen. Sluit de app en open hem opnieuw om de overstap af te maken. Er gaat niets verloren, en tot die tijd blijft je mesh verbonden.",
  "settings.theme.light": "Licht",
  "settings.theme.light_desc": "Altijd het lichte palet gebruiken",
  "settings.theme.dark": "Donker",
  "settings.theme.dark_desc": "Altijd het donkere palet gebruiken",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Vindbaar, adverteert en scant",
  "settings.status.away": "Afwezig",
  "settings.status.away_desc": "Mesh gepauzeerd, scant niet en adverteert niet",
  "settings.status.invisible": "Onzichtbaar",
  "settings.status.invisible_desc": "Scant wel, maar is verborgen voor anderen",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Status op {value} zetten",
  "settings.status.edit": "Status bewerken",
  "settings.status.desc": "Kies hoe zichtbaar je bent op de mesh.",
  "settings.transfer.identity": "Identiteit en sleutels",
  "settings.transfer.identity_desc":
    "Je peer-ID, je gebruikersnaam en je contacten",
  "settings.transfer.chats": "Chats en geschiedenis",
  "settings.transfer.chats_desc":
    "Gesprekken, groepen en de kanalen waar je in zit",
  "settings.transfer.wallet": "Portemonneesaldo",
  "settings.transfer.wallet_desc": "Cashu-bewijzen en transactiegeschiedenis",
  "settings.transfer.title": "Overzetten naar een nieuwe telefoon",
  "settings.transfer.desc":
    "Verhuis je identiteit, chats en portemonnee naar een ander toestel",
  "settings.transfer.coming_soon_a11y":
    "Overzetten naar een nieuwe telefoon, binnenkort",
  "settings.transfer.body":
    "Houd de twee telefoons bij elkaar en zet alles over via Bluetooth. Er gaat niets langs een server, dus het werkt zonder internet.",
  "settings.qr.permission_label": "Fototoegang",
  "settings.qr.permission_purpose": "je QR-code opslaan",
  "settings.qr.saved": "Opgeslagen",
  "settings.qr.saved_body": "QR-code opgeslagen in je fotogalerij.",
  "settings.qr.save_failed": "Opslaan lukte niet",
  "settings.qr.save_failed_body":
    "De QR-code kon niet worden opgeslagen. Probeer het opnieuw.",
  "settings.qr.share_message": "Voeg me toe op Airhop",
  "settings.qr.share_body":
    "Voeg me toe op Airhop — privé meshberichten, offline-first.",
  "settings.qr.show_short": "QR tonen",
  "settings.qr.title": "Jouw QR-code",
  "settings.qr.note":
    "Hij bevat je publieke sleutels, waarmee anderen je van overal kunnen schrijven. Deel hem alleen met mensen die je vertrouwt. Hij verandert niet, tenzij je je identiteit wist.",
  "settings.qr.code_label": "Contactcode",
  "settings.qr.copy_code": "Contactcode kopiëren",
  "settings.qr.share": "QR-code delen",
  "settings.qr.share_short": "QR delen",
  "settings.qr.download": "QR-code downloaden",
  "settings.qr.download_short": "QR downloaden",
  "settings.qr.show": "QR-code tonen",
  "settings.wipe.trigger": "Noodwissen starten",
  "settings.wipe.trigger_desc":
    "Tik drie keer om meteen te wissen zonder te bevestigen",
  "settings.wipe.title": "Noodwissen",
  "settings.wipe.now": "Nu wissen",
  "settings.wipe.desc":
    "Vernietigt op slag alle sleutels, berichten en bewijzen",
  "settings.wipe.body":
    "Hiermee worden op slag al je sleutels, berichten en portemonneebewijzen vernietigd. Dit kan niet ongedaan worden gemaakt.",
  "settings.wipe.in_progress": "Bezig met wissen",
  "settings.wipe.in_progress_body":
    "Je sleutels, berichten en bestanden worden vernietigd. Dat duurt een paar seconden en maakt zichzelf af, ook als de app dichtgaat.",
  "settings.wipe.got_it": "Begrepen",
  "settings.wipe.keys_failed": "De sleutels konden niet worden vernietigd",
  "settings.wipe.keys_failed_body":
    "Je berichten, contacten en portemonnee zijn weg, maar het toestel weigerde je sleutels los te laten. Ontgrendel het toestel en wis opnieuw.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Neem contact op",
  "settings.help.contact_a11y": "E-mail naar {address}",
  "settings.help.bug": "Een fout melden",
  "settings.help.bug_desc": "Open een issue op GitHub",
  "settings.help.bug_a11y": "Een fout melden op GitHub",
  "settings.help.faq": "Veelgestelde vragen",
  "settings.help.faq_desc": "Antwoorden op veelvoorkomende vragen",
  "settings.help.faq_a11y": "Veelgestelde vragen openen",
  "settings.help.terms_desc": "Hoe Airhop gebruikt mag worden",
  "settings.help.terms_a11y": "Servicevoorwaarden openen",
  "settings.help.privacy_desc": "Wat we niet verzamelen",
  "settings.help.privacy_a11y": "Privacybeleid openen",

  // ---- Settings: support ----
  "settings.support.card": "Kaart of UPI",
  "settings.support.card_desc": "Internetbankieren en wallets, wereldwijd",
  "settings.support.card_a11y":
    "Steun met kaart, UPI, internetbankieren of wallet",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Maandelijks of eenmalig, zonder platformkosten",
  "settings.support.sponsors_a11y": "Steunen via GitHub Sponsors",
  "settings.support.note":
    "Ik bouw Airhop in mijn vrije tijd. Er zijn geen investeerders en geen advertenties. Als het nuttig voor je is, helpt een bijdrage enorm om de ontwikkeling op gang te houden. Elke functie blijft hoe dan ook gratis.",

  // ---- Settings: about and version ----
  "settings.about.version": "Versie",
  "settings.about.version_desc": "Huidige uitgave",
  "settings.about.version_a11y": "Versie bekijken en op updates controleren",
  "settings.about.release_notes": "Release-opmerkingen",
  "settings.about.release_notes_desc": "Wat er nieuw is in de laatste uitgave",
  "settings.about.release_notes_a11y":
    "De laatste release-opmerkingen op GitHub openen",
  "settings.about.source": "Broncode",
  "settings.about.source_a11y": "Broncode op GitHub openen",
  "settings.about.licenses": "Opensourcelicenties",
  "settings.about.open_repo": "De repository van {name} openen",
  "settings.about.licenses_desc": "Opensourcepakketten van derden",
  "settings.about.licenses_a11y": "Licenties van derden bekijken",
  "settings.version.codename": "Codenaam",
  "settings.version.checking": "Bezig met controleren",
  "settings.version.check": "Op updates controleren",
  "settings.version.checking_title": "Op updates aan het controleren",
  "settings.version.up_to_date": "Je hebt de nieuwste versie.",
  "settings.version.release_notes": "Release-opmerkingen bekijken",
  "settings.version.made_with": "Gemaakt met",
  "settings.version.number": "Versie {version}",
  "settings.version.update_to": "Bijwerken naar {version}",
  "settings.version.update_to_a11y": "Bijwerken naar versie {version}",
  "settings.version.released_under": "Uitgebracht onder {license}",
  "settings.version.notes_a11y":
    "Release-opmerkingen van versie {version} bekijken",
  "settings.version.tor_paused":
    "De updatecontrole staat stil zolang Tor aanstaat, zodat je IP niet uitlekt. Bekijk de releasepagina in een browser.",
  "settings.version.check_failed":
    "Er kon niet op updates worden gecontroleerd. Controleer je verbinding en probeer het opnieuw.",
  "settings.version.downloading": "Downloaden {percent}%",
  "settings.version.install": "Installeren",
  "settings.version.download_failed":
    "Downloaden mislukt. Controleer je verbinding en probeer het opnieuw.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} is {size} KiB en gaat over de grens van {cap} KiB heen.",
  "transfer.failed.malformed":
    "Er kwam een beschadigde bijlage binnen die niet geopend kon worden. Vraag ze hem opnieuw te sturen.",
  "transfer.failed.unsupported_type":
    "Er kwam een bijlage binnen in een formaat dat deze app niet kan openen.",
  "transfer.failed.type_mismatch":
    "Een bijlage is geweigerd: de inhoud komt niet overeen met het opgegeven bestandstype.",
  "transfer.failed.storage":
    "Er kwam een bijlage binnen, maar die kon niet worden opgeslagen. Controleer je vrije ruimte.",
  "transfer.badge.waiting": "Wachten · {name}",
  "transfer.badge.active_count": "{count} overdrachten",
  "transfer.badge.sending": "{name} wordt verstuurd",
  "transfer.badge.receiving": "{name} wordt ontvangen",
  "transfer.badge.a11y": "{label}, {percent} procent. Gesprek openen.",
  "transfer.kind.photo": "Foto",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Spraakbericht",
  "transfer.this.photo": "Deze foto",
  "transfer.this.video": "Deze video",
  "transfer.this.voice": "Dit spraakbericht",
  "transfer.this.file": "Dit bestand",
  "transfer.kind.document": "Document",
  "transfer.kind.voice_preview": "Spraakbericht",
  "transfer.kind.photo_preview": "Foto",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Document",

  // ---- System notifications ----
  "notif.channel.messages": "Berichten",
  "notif.channel.nearby": "Peers in de buurt",
  "notif.channel.nearby_desc":
    "Af en toe een melding als de mesh mensen binnen Bluetooth-bereik vindt.",
  "notif.nearby.body": "Nu binnen Bluetooth-bereik. Tik om de mesh te openen.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Iemand",
  "notif.notice_urgent": "Dringende melding · {content}",
  "notif.notice": "Melding · {content}",
  "notif.incoming_file": "Binnenkomend bestand",
  "notif.preview.photo": "📷 Foto",
  "notif.preview.voice": "🎤 Spraakbericht",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Document",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Nieuw bericht",
  "notif.hidden.channel": "Nieuwe activiteit",
  "notif.hidden.mention": "Je bent genoemd",
  "notif.mention.title": "{sender} heeft je genoemd",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Nog {count} tonen",
    other: "Nog {count} tonen",
  },
  "chat.channels.show_more_a11y": {
    one: "Nog {count} standaardkanaal tonen",
    other: "Nog {count} standaardkanalen tonen",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} ongelezen",
    other: "{label}, {count} ongelezen",
  },
  "a11y.new_count": {
    one: "{label}, {count} nieuw",
    other: "{label}, {count} nieuw",
  },
  "chat.a11y.unread": {
    one: "{count} ongelezen",
    other: "{count} ongelezen",
  },
  "chat.thread.length_left": {
    one: "{count} over",
    other: "{count} over",
  },
  "settings.general.retention_days": {
    one: "{count} dag",
    other: "{count} dagen",
  },
  "chat.info.group_reach": {
    one: "{reachable} van {count} lid bereikbaar",
    other: "{reachable} van {count} leden bereikbaar",
  },
  "chat.group_members": {
    one: "Privégroep  ·  {count} lid",
    other: "Privégroep  ·  {count} leden",
  },
  "chat.select.count": {
    one: "{count} geselecteerd",
    other: "{count} geselecteerd",
  },
  "chat.select.forward": {
    one: "{count} bericht doorsturen",
    other: "{count} berichten doorsturen",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} aan het woord",
    other: "{count} aan het woord",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} peer binnen bereik",
    other: "{count} peers binnen bereik",
  },
  "mesh.peer.hops_away": {
    one: "{count} hop verderop",
    other: "{count} hops verderop",
  },
  "chat.presence.active": {
    one: "{count} actief",
    other: "{count} actief",
  },
  "chat.presence.nearby": {
    one: "{count} in de buurt",
    other: "{count} in de buurt",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mint",
    other: "{count} mints",
  },
  "wallet.mint.remove_body": {
    one: "{mint} houdt {balance} {unit} in {count} bewijs. Verwijderen wist dat bewijs definitief van dit toestel en er is geen back-up. Neem het saldo eerst op of stuur het weg.",
    other:
      "{mint} houdt {balance} {unit} in {count} bewijzen. Verwijderen wist die bewijzen definitief van dit toestel en er is geen back-up. Neem het saldo eerst op of stuur het weg.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} storting wacht op betaling. Wordt opnieuw gecontroleerd elke keer dat de app opengaat.",
    other:
      "{count} stortingen wachten op betaling. Worden opnieuw gecontroleerd elke keer dat de app opengaat.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{count} onbesteed bewijs hersteld van {mints}.",
    other: "{count} onbestede bewijzen hersteld van {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "{count} munt gevonden, maar die was al besteed, dus er is niets bijgeschreven. Dat is normaal: elke munt die je ooit hebt uitgegeven blijft staan in de administratie die de mint bijhoudt.",
    other:
      "{count} munten gevonden, maar die waren al besteed, dus er is niets bijgeschreven. Dat is normaal: elke munt die je ooit hebt uitgegeven blijft staan in de administratie die de mint bijhoudt.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Nog {count} tonen",
    other: "Nog {count} tonen",
  },
  "wallet.activity.show_more_a11y": {
    one: "Nog {count} betaling tonen",
    other: "Nog {count} betalingen tonen",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} onbevestigd",
    other: "{count} onbevestigd",
  },
  "wallet.proof_count": {
    one: "{count} bewijs",
    other: "{count} bewijzen",
  },
  "wallet.spent_removed_detail": {
    one: "{count} bewijs was al besteed en is verwijderd.",
    other: "{count} bewijzen waren al besteed en zijn verwijderd.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Iemand in de buurt",
    other: "{count} mensen in de buurt",
  },
};

export const nl = { strings, plurals };
