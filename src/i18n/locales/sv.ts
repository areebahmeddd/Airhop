// sv: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Avbryt",
  "common.done": "Klar",
  "common.ok": "OK",
  "common.close": "Stäng",
  "common.back": "Tillbaka",
  "common.delete": "Radera",
  "common.remove": "Ta bort",
  "common.add": "Lägg till",
  "common.copy": "Kopiera",
  "common.copied": "Kopierat",
  "common.share": "Dela",
  "common.continue": "Fortsätt",
  "common.try_again": "Försök igen",
  "common.settings": "Inställningar",
  "common.on": "På",
  "common.off": "Av",

  // ---- Dates ----
  "format.today": "I dag",
  "format.yesterday": "I går",
  "format.minutes_ago": "för {count} min sedan",
  "format.hours_ago": "för {count} tim sedan",
  "format.days_ago": "för {count} dgr sedan",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Chattar",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Plånbok",
  "nav.tab.profile": "Du",
  "a11y.tab.new_peers": "{label}, någon ny i närheten",
  "nav.notifications": "Aviseringar",
  "chat.subtab.channels": "Kanaler",
  "chat.subtab.direct": "Direkt",
  "chat.subtab.dms": "Direktmeddelanden",
  "chat.search.placeholder": "Sök i chattar…",
  "chat.search.a11y": "Sök i chattar och meddelanden",
  "chat.search.close": "Stäng sökningen",
  "chat.search.clear": "Rensa sökningen",
  "mesh.view.radar": "Radarvy",
  "mesh.view.list": "Listvy",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Lista",

  // ---- Legal document names ----
  "legal.last_updated": "Senast uppdaterad: {date}",
  "legal.terms": "Användarvillkor",
  "legal.privacy": "Integritetspolicy",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Privat meshkommunikation",
  "onboarding.welcome.cta": "Kom igång",
  "onboarding.welcome.cta_hint": "Godkänn villkoren nedan för att fortsätta",
  "onboarding.welcome.consent_a11y":
    "Godkänn användarvillkoren och integritetspolicyn",
  "onboarding.welcome.open_terms": "Öppna användarvillkoren",
  "onboarding.welcome.open_privacy": "Öppna integritetspolicyn",
  "onboarding.welcome.consent":
    "Genom att trycka på {cta} godkänner du våra {terms} och vår {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Skapar din identitet",
  "onboarding.identity.body":
    "Ett Ed25519-nyckelpar skapas på den här enheten.\nInget skickas någonstans.",
  "onboarding.identity.failed_heading": "Dina nycklar kunde inte skapas",
  "onboarding.identity.failed_body":
    "Enheten lät inte Airhop lagra dem säkert. Försök igen, eller starta om telefonen och öppna Airhop på nytt.",
  "onboarding.identity.steps_a11y": "Steg: {steps}",
  "onboarding.identity.step.x25519": "Skapar statiskt X25519-nyckelpar",
  "onboarding.identity.step.ed25519": "Skapar Ed25519-signeringsnyckelpar",
  "onboarding.identity.step.keychain": "Lagrar nycklar i systemets nyckelring",
  "onboarding.identity.step.peer_id": "Härleder peer-ID",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Ditt namn på meshen",
  "onboarding.username.peer_id": "Peer-ID",
  "onboarding.username.card_a11y":
    "Ditt namn på meshen är {username}. Peer-ID {peerID}. {props}.",
  "onboarding.username.explanation":
    "Användarnamnet härleds deterministiskt från din publika nyckel. Det blir detsamma på varje enhet som ser ditt peer-ID.",
  "onboarding.username.cta": "Gå in i Airhop",
  "onboarding.username.prop.algorithm": "Algoritm",
  "onboarding.username.prop.storage": "Lagring",
  "onboarding.username.prop.storage_value": "Endast systemets nyckelring",
  "onboarding.username.prop.account": "Konto krävs",
  "onboarding.username.prop.account_value": "Inget",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Välkommen till Airhop",
  "onboarding.hello.p1":
    "Hej där. Airhop är byggt ovanpå bitchat som ett fristående sidoprojekt med öppen källkod. Det är varken knutet till eller godkänt av bitchat-projektet eller permissionless tech, utan bara något jag tycker om att bygga och dela med gemenskapen.",
  "onboarding.hello.p2":
    "Det här är den första utgåvan för iOS och Android, så även om jag har testat den med vänner kommer du nog att stöta på några buggar. Hör gärna av dig om du gör det, eller om du har en idé på en funktion. Öppna ett ärende på {github} eller mejla mig på {email}.",
  "onboarding.hello.p3":
    "Om du har nytta av Airhop får du gärna lämna en stjärna på {github} eller ett omdöme i {store}. Det hjälper fler att hitta projektet. Tack för att du provar!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Innan telefonen frågar",
  "onboarding.primer.lede":
    "Så här gör var och en av dem, och så här gör de inte.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Hittar enheter i närheten och skickar meddelanden vidare mellan dem. Det är så meshen bildas, och den fungerar utan internet.",
  "onboarding.primer.location.title": "Plats",
  "onboarding.primer.location.body":
    "Placerar dig i områdeskanaler i närheten, från ett kvarter till en region. Airhop spårar dig aldrig och skickar aldrig din exakta plats från enheten.",
  "onboarding.primer.notifications.title": "Aviseringar",
  "onboarding.primer.notifications.body":
    "Få aviseringar om nya meddelanden även när appen är stängd. Aviseringarna skapas lokalt på enheten, utan att någon server är inblandad.",
  "onboarding.primer.footnote":
    "Du får säga nej. Meddelanden går fortfarande över internet, och du kan ändra dig senare i Inställningar.",
  "onboarding.primer.cta_a11y": "Fortsätt till behörighetsfrågorna",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Bluetooth-åtkomst",
  "permission.bluetooth.purpose": "hitta enheter i närheten över meshen",
  "permission.open_settings": "Öppna Inställningar",
  "permission.not_now": "Inte nu",
  "permission.blocked_title": "{label} är av",
  "permission.blocked_body": "Slå på det i Inställningar för att {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Något gick fel",
  "error.boundary.body":
    "Airhop stötte på ett oväntat problem och fick avbryta det som visades.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Standardkanaler",
  "chat.channels.yours": "Dina kanaler",
  "chat.channels.none": "Inga kanaler än",
  "chat.channels.none_hint":
    "Tryck på {plus} ovan för att gå med i eller skapa en.",
  "chat.channels.none_desc":
    "Inga kanaler än. Använd plusknappen i rubriken för att gå med i eller skapa en.",
  "chat.channels.show_fewer": "Visa färre standardkanaler",
  "chat.channels.show_less": "Visa mindre",
  "chat.channels.info": "Kanalinfo",
  "chat.channels.pin": "Fäst kanalen",
  "chat.channels.unpin": "Lossa kanalen",
  "chat.channels.mute": "Tysta kanalen",
  "chat.channels.unmute": "Slå på ljudet för kanalen",
  "chat.channels.leave": "Lämna kanalen",
  "chat.channels.leave_confirm": "Lämna",
  "chat.channels.clear_body":
    "Radera alla meddelanden i {name}? Det går inte att ångra.",
  "chat.channels.leave_body":
    "Lämna {name}? Du slutar få kanalens meddelanden, och historiken tas bort från den här enheten.",
  "chat.channels.more_options": "Fler val för {name}",
  "chat.channels.teleported_tag": "{level}  ·  teleporterad",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Töm chatten",
  "chat.dm.remove_contact": "Ta bort kontakt",
  "chat.dm.block": "Blockera den här peern",
  "chat.dm.block_confirm": "Blockera",
  "chat.dm.delete": "Radera chatten",
  "chat.dm.delete_body":
    "Detta tar bort konversationen från din lista och raderar dess meddelanden. Kontakten behålls, och ett nytt meddelande därifrån startar en ny chatt.",
  "chat.dm.in_range": "inom räckhåll",
  "chat.dm.row_hint": "Tryck två gånger och håll kvar för fler val",
  "chat.channels.row_hint": "Tryck två gånger och håll kvar för fler val",
  "chat.dm.you_prefix": "Du:",
  "chat.dm.none": "Inga direktmeddelanden",
  "chat.dm.none_desc":
    "Gå till Mesh-fliken och tryck på en peer för att starta ett krypterat direktmeddelande.",
  "chat.dm.contact_info": "Kontaktinfo",
  "chat.dm.pin": "Fäst chatten",
  "chat.dm.unpin": "Lossa chatten",
  "chat.dm.mute": "Tysta chatten",
  "chat.dm.unmute": "Slå på ljudet för chatten",
  "chat.dm.clear_body":
    "Radera alla meddelanden med {name}? Det går inte att ångra.",
  "chat.dm.remove_contact_body":
    "Ta bort {name}? Detta raderar konversationen och glömmer kontakten. Hen kan fortfarande nå dig genom att skriva igen.",
  "chat.dm.block_body":
    "Blockera {name}? Du ser hen inte längre under Mesh och får inga meddelanden, inte ens när hen är i närheten.",
  "chat.dm.more_options": "Fler val för {name}",
  "chat.dm.remove_contact_short": "Ta bort kontakt",
  "chat.dm.block_short": "Blockera kontakt",
  "chat.dm.delete_short": "Radera chatten",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Töm meddelanden",
  "chat.clear_confirm": "Töm",
  "chat.group_badge": "Grupp",
  "chat.more": "Mer",
  "chat.no_messages": "Inga meddelanden än",
  "chat.you": "Du",
  "chat.a11y.channel": "Kanalen {name}",
  "chat.a11y.group": "Gruppen {name}",
  "chat.a11y.muted": "tystad",
  "chat.a11y.pinned": "fäst",

  // ---- Chats: start something new ----
  "chat.new.title": "Börja något nytt",
  "chat.new.channel": "Skapa en privat kanal",
  "chat.new.channel_label": "Privat kanal",
  "chat.new.channel_desc":
    "Ett rum som alla med länken kan gå med i. Skapa ett, eller gå med via en länk du fått.",
  "chat.new.group": "Skapa en privat grupp",
  "chat.new.group_label": "Privat grupp",
  "chat.new.group_desc":
    "Välj bestämda personer. Upp till 16. Stannar på Bluetooth.",
  "chat.new.place": "Gå till en plats via geohash",
  "chat.new.place_label": "Gå till en plats",
  "chat.new.place_desc": "Öppna en platskanal var som helst via dess geohash.",
  "chat.new.reach": "Räckvidd",
  "chat.new.reach_internet": "Når medlemmar över Bluetooth och internet.",
  "chat.new.reach_mesh":
    "Fungerar inom Bluetooth-räckhåll, inte över internet.",
  "chat.new.reach_internet_desc":
    "Når medlemmar över internet också. Reläer kan se att kanalen är aktiv, aldrig meddelandena eller vilka som är med.",
  "chat.new.reach_mesh_desc":
    "Stannar på den lokala meshen. Mest privat, inget lämnar Bluetooth-räckhåll.",
  "chat.new.join_link": "Gå med i en privat kanal via en inbjudningslänk",
  "chat.new.back_to_chooser": "Tillbaka till valen",
  "chat.new.create_channel": "Skapa kanal",
  "chat.new.name_required": "Ange ett kanalnamn först",
  "chat.new.name_taken": "Namnet är redan taget",
  "chat.new.create": "Skapa",
  "chat.new.e2ee":
    "Krypterad hela vägen. Bara medlemmar kan läsa meddelandena.",
  "chat.new.invite_only":
    "Endast efter inbjudan. Alla du delar länken med kan gå med. För alla andra förblir den dold, även för peers i närheten.",
  "chat.new.name_exists": "Det finns redan en kanal med det här namnet.",
  "chat.new.reach_bluetooth_chip": "Endast Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Gå med via en inbjudningslänk",

  // ---- Chats: join by link ----
  "chat.join.title": "Gå med via en länk",
  "chat.join.not_airhop": "Det är ingen Airhop-länk.",
  "chat.join.reach_internet": "Når medlemmar över Bluetooth och internet.",
  "chat.join.reach_mesh": "Stannar inom Bluetooth-räckhåll.",
  "chat.join.contact_card":
    "Ett kontaktkort. Lägger till personen bland dina kontakter och öppnar chatten.",
  "chat.join.unverified": "Länken kunde inte verifieras",
  "chat.join.unverified_body":
    "Kontaktkortet stämmer inte med sina egna nycklar, så det lades inte till. Be om ett nytt.",
  "chat.join.paste": "Klistra in från urklipp",
  "chat.join.join": "Gå med",
  "chat.join.public_channel":
    "Öppna kanalen {name}. Alla i närheten kan läsa den.",
  "chat.join.private_channel": "Privata kanalen {name}. {reach}",
  "chat.join.dm_with": "Direktmeddelande med {name}.",
  "chat.join.joined_as": "Gick med som {name}",
  "chat.join.name_clash_body":
    "Du är redan med i ett annat {name}. Kanalnamn är bara etiketter, så inbjudan öppnade en egen kanal och den du var med i är orörd. Du kan byta namn på båda från kanalinfon.",
  "chat.join.paste_hint":
    "Klistra in en inbjudan som börjar med airhop://. Att trycka på en länk fungerar också; det här är för en länk du inte kan trycka på.",
  "chat.join.key_note":
    "En inbjudan till en privat kanal bär nyckeln, så det går direkt att gå med och ingen annan behöver tillfrågas.",
  "chat.join.offline_note":
    "Fungerar offline. Länken läses på den här enheten, och kanalen når så långt som skaparen ställt in.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Cellen kunde inte öppnas. Försök igen om en stund.",
  "chat.jump.title": "Gå till en plats",
  "chat.jump.saved": "SPARADE PLATSER",
  "chat.jump.anywhere":
    "Öppna en öppen platskanal var som helst, även på en plats där du inte är.",
  "chat.jump.geohash_note":
    "Ange dess geohash. Alla vars plats hamnar i den cellen delar kanalen.",
  "chat.jump.teleport_note":
    "Du visas som teleporterad, inte som i närheten. Det når fram bara över internet.",
  "chat.jump.level_cell": "Cell på {level}-nivå",
  "chat.jump.already_here": "Du är redan här. Gå öppnar din {name}-kanal.",
  "chat.jump.open_direction": "Öppna cellen {direction} om dig",
  "chat.jump.open_place": "Öppna {name}",
  "chat.jump.remove_place": "Ta bort {name} från sparade platser",
  "chat.jump.go": "Gå",
  "chat.jump.how":
    "Så hittar du en geohash: öppna en platskanal > tryck på dess namn > kopiera den därifrån.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Alla medlemmar kunde inte nås. Försök igen medan de är i närheten.",
  "chat.group.you_were_added": "Du lades till i {name}.",
  "chat.group.added_you": "Lade till dig i {name}",
  "chat.group.you_were_removed":
    "Du togs bort från {name}. Du kan inte längre läsa eller skicka meddelanden här.",
  "chat.group.removed_you": "Tog bort dig från {name}",
  "chat.group.add_failed": "Kunde inte lägga till dem",
  "chat.group.add_failed_body":
    "Inget ändrades. Antingen går de inte att nå just nu, eller så är gruppen full vid 16, eller så är det inte du som skapade den.",
  "chat.group.remove_failed": "Kunde inte ta bort dem",
  "chat.group.remove_failed_body":
    "Inget ändrades. Bara den som skapade gruppen kan ändra vilka som är med.",
  "chat.group.e2ee":
    "Krypterad hela vägen. Bara medlemmar kan läsa meddelandena.",
  "chat.group.cap":
    "Upp till 16 personer, valda av dig. Det finns ingen inbjudningslänk, så ingen kommer in genom att få en vidarebefordrad.",
  "chat.group.bluetooth":
    "Endast Bluetooth. Medlemmar utom räckhåll får meddelandena när de är tillbaka.",
  "chat.group.members_label": "MEDLEMMAR",
  "chat.group.none_in_range":
    "Ingen är inom räckhåll. Medlemmar måste vara i närheten när du skapar gruppen.",
  "chat.group.create_title": "Skapa en grupp",
  "chat.group.name_placeholder": "Gruppnamn",
  "chat.group.create": "Skapa",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Lokal mesh · endast Bluetooth",
  "chat.scope.mesh_desc":
    "Når enheter inom Bluetooth-räckhåll (ungefär 10 till 100 meter). Inget internet krävs. Perfekt för att samordna på plats.",
  "chat.scope.block": "Kvarter · ~100 m",
  "chat.scope.block_desc":
    "Täckning på kvartersnivå. Meddelanden bryggas över internet så att peers strax utanför Bluetooth-räckhåll ändå kan delta.",
  "chat.scope.neighborhood": "Stadsdel · ~1 km",
  "chat.scope.neighborhood_desc":
    "Täckning på stadsdelsnivå. Med hjälp av reläer går peers i hela området att nå, även utan direkt Bluetooth-länk.",
  "chat.scope.city": "Stad · ~10 km",
  "chat.scope.city_desc":
    "Kanal för hela staden. Använder geoplacerade internetreläer för att nå peers i hela storstadsområdet.",
  "chat.scope.province": "Län eller region · ~100 km",
  "chat.scope.province_desc":
    "Täckning på läns- eller regionnivå. Bryggad över internet för regional räckvidd på hundratals kilometer.",
  "chat.scope.country": "Land eller region · ~1000 km",
  "chat.scope.country_desc":
    "Täckning i hela landet. Varje Airhop- eller bitchat-användare i regionen kan gå med och läsa meddelandena.",
  "chat.transport.bluetooth": "Endast Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Endast internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Kommandot /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Skicka en varm kram",
  "chat.cmd.slap_hint": "Daska till med en stor forell",
  "chat.status.sending": "Skickar…",
  "chat.status.undo_send": "Ångra sändningen",
  "chat.status.undo": "Ångra",
  "chat.status.sent": "Skickat",
  "chat.status.received": "Mottaget",
  "chat.status.failed": "Misslyckades",
  "chat.status.canceled": "Avbrutet",
  "chat.status.waiting": "Väntar",
  "chat.status.sending_short": "Skickar",
  "chat.status.receiving": "Tar emot",
  "chat.thread.not_available": "Inte tillgängligt här",
  "chat.thread.private_channel": "Privat kanal",
  "chat.thread.location_channel": "Platskanal",
  "chat.thread.public_channel": "Öppen kanal",
  "chat.thread.notices": "Anslag för den här kanalen",
  "chat.thread.invite": "Bjud in någon till den här kanalen",
  "chat.thread.not_in_range":
    "Inte inom Bluetooth-räckhåll. Levereras över internet.",
  "chat.thread.not_nearby":
    "Inte i närheten. Vi levererar när hen är tillbaka inom räckhåll eller online.",
  "chat.thread.no_keys":
    "Du behöver vara inom Bluetooth-räckhåll, eller skanna deras kod, för att kunna skriva till dem.",
  "chat.geo.card_received":
    "{name} delade sin kontakt. Dela din tillbaka så att ni kan fortsätta prata efter att någon av er flyttat på sig.",
  "chat.geo.exchange_complete":
    "Kontakter utbytta. Nu kan ni nå varandra var som helst ifrån.",
  "chat.geo.keep_person": "Behåll den här personen",
  "chat.geo.keep_person_desc":
    "Dela din kontakt så att ni kan fortsätta prata efter att någon av er flyttat på sig. Hen får då veta din permanenta identitet.",
  "chat.geo.card_sent": "Delad · väntar på deras",
  "chat.thread.left_cell":
    "Du har lämnat det här området, så de kan inte nå dig här. Byt koder för att kunna fortsätta prata var som helst.",
  "chat.thread.no_route":
    "Går inte att nå dem just nu. Meddelandet skickas när det finns en väg fram.",
  "chat.thread.empty": "Inga meddelanden än",
  "chat.thread.empty_desc": "Börja ett krypterat samtal.",
  "chat.thread.jump_latest": "Hoppa till senaste meddelandet",
  "chat.thread.back_to_members": "Tillbaka till medlemmarna",
  "chat.thread.nostr_key": "Nostr-publik nyckel",
  "chat.thread.in_range": "Inom räckhåll",
  "chat.voice.not_recorded": "Röstmeddelandet spelades inte in",
  "chat.thread.message": "Meddelande",
  "chat.thread.message_placeholder": "Meddelande…",
  "chat.thread.length_full": "Meddelandet är fullt",
  "chat.thread.waiting_for":
    "Väntar på att {name} ska komma tillbaka · {percent} %",
  "chat.thread.peer": "peer",
  "chat.thread.cancel_transfer": "Avbryt {name}",
  "chat.thread.queued_more": "{count} till väntar på att skickas",
  "chat.thread.across_bridge": "{count} på andra sidan bryggan",
  "chat.thread.bridged": "bryggat",
  "chat.thread.invite_body":
    "Kom med mig i {channel} på Airhop — privata meshmeddelanden som fungerar offline först.",
  "chat.thread.go_back_unread": "Tillbaka, {count} olästa",
  "chat.thread.view_info": "Visa info om {name}",
  "chat.thread.notices_new": "Anslag för den här kanalen, {count} nya",
  "chat.thread.say_something": "Säg något i {channel}.",
  "chat.thread.jump_latest_new": "Hoppa till senaste meddelandet, {count} nya",
  "chat.thread.unconfirmed_since": "Ingen leverans bekräftad sedan {date}",
  "chat.thread.no_reach": "Inga peers i närheten · ingen har fått det här än",
  "chat.thread.channel_needs_internet":
    "Internet av · den här kanalen når bara folk inom Bluetooth-räckhåll",
  "chat.thread.cell_needs_internet":
    "Internet av · den här cellen går bara att nå över internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet av · det här samtalet går bara över internet",
  "chat.thread.via_gateway":
    "Internet av · en enhet i närheten bär det här ut på nätet åt dig",
  "chat.thread.group_queued":
    "Ingen ur den här gruppen är i närheten än. Det når fram till dem när de är det.",
  "chat.thread.no_group_key":
    "Du är inte längre med i den här gruppen, så det här kan inte skickas",
  "chat.thread.no_reach_offline":
    "Internet av och inga peers i närheten · ingen har fått det här än",
  "chat.thread.mention": "Nämn {name}",
  "chat.thread.someone_talking": "{hold}. {name} talar.",
  "chat.thread.attach_note":
    "Filer skickas bara inom Bluetooth-räckhåll. Text och betalningar når kontakter över internet; bilagor gör det inte.",
  "chat.thread.message_peer": "Skriv till {name}",
  "chat.thread.send": "Skicka meddelande",
  "chat.thread.group": "Grupp",
  "chat.bridge.nearby_only":
    "Endast i närheten: håll det här meddelandet borta från meshbryggan",
  "chat.bridge.nearby_label": "Endast i närheten · stannar på Bluetooth",
  "chat.bridge.bridging_label":
    "Bryggar till närliggande områden · tryck för endast i närheten",
  "chat.screenshot.you_took": "Du tog en skärmbild",
  "chat.screenshot.you_took_private":
    "Du tog en skärmbild · ingen fick veta det",
  "chat.screenshot.heads_up": "Obs",
  "chat.screenshot.notice": "* {name} tog en skärmbild *",
  "chat.screenshot.notified_dm":
    "{name} fick veta att du tog en skärmbild av det här samtalet.",
  "chat.screenshot.notified":
    "Alla i den här kanalen fick veta att du tog en skärmbild.",
  "chat.screenshot.not_notified":
    "Ingen fick veta det. Kanalen är öppen, så att tillkännage en skärmbild skulle registrera att du var här.",
  "chat.thread.error": "Fel",
  "chat.thread.go_back": "Tillbaka",
  "chat.bubble.via_bridge": "via meshbryggan",
  "chat.bubble.view_profile": "Visa profilen för {name}",
  "chat.bubble.forwarded": "Vidarebefordrat",
  "chat.bubble.attachment": "bilaga",
  "chat.bubble.a11y": "{sender}: {body}. Håll kvar för fler val.",
  "chat.bubble.failed_retry":
    "Sändningen misslyckades. Tryck för att försöka igen.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Meddelandeinfo",
  "chat.info.delivered_to": "Levererat till {name}",
  "chat.info.read_by": "Läst av {name}",
  "chat.info.group_reach_desc": "Nåbara nu, inte en leveransbekräftelse",
  "chat.info.group_alone": "Inga andra medlemmar",
  "chat.info.today_at": "I dag {time}",
  "chat.info.sending": "Skickar…",
  "chat.info.failed": "Sändningen misslyckades",
  "chat.info.courier": "Buret av en vän",
  "chat.info.sent": "Skickat",
  "chat.info.queued": "Väntar på att skickas",
  "chat.info.waiting": "Väntar…",
  "chat.action.info": "Meddelandeinfo",
  "chat.action.save_photos": "Spara bland foton",
  "chat.action.save_copy": "Spara en kopia",
  "chat.action.forward": "Vidarebefordra",
  "chat.action.select": "Välj",
  "chat.select.cancel": "Avbryt markeringen",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Kamera",
  "chat.attach.camera_desc": "Ta ett foto eller en video",
  "chat.attach.library": "Fotobibliotek",
  "chat.attach.library_desc": "Välj ur ditt bibliotek",
  "chat.attach.document": "Dokument",
  "chat.attach.document_desc": "Skicka vilken fil eller PDF som helst",
  "chat.attach.voice": "Röstmeddelande",
  "chat.attach.voice_desc": "Spela in och skicka ett röstmeddelande",
  "chat.attach.ecash": "Skicka ecash",
  "chat.attach.ecash_desc": "Skicka Cashu-sats ur din plånbok",
  "chat.attach.location": "Plats",
  "chat.attach.location_desc": "Skicka var du är just nu",
  "chat.attach.title": "Bifoga",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Delade en plats",
  "chat.location.received_summary": "Delade sin plats",
  "chat.location.title": "Plats",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Tagen för {ago} sedan",
  "chat.location.open_maps": "Öppna i Kartor",
  "chat.location.no_forward": "Platser vidarebefordras inte",
  "chat.location.no_forward_body":
    "En plats skickas till en person. Dela din egen i stället om du vill att någon annan ska ha den.",
  "chat.location.no_fix": "Tillåt plats för att se hur långt bort det här är",
  "chat.location.send_title": "Skicka din plats",
  "chat.location.send_body":
    "{name} ser en enda punkt: var du är nu. Den fortsätter inte att uppdateras.",
  "chat.location.send": "Skicka plats",
  "chat.location.finding": "Hittar din plats…",
  "chat.location.no_location": "Din plats kunde inte hämtas",
  "chat.location.no_location_body":
    "Tillåt platsåtkomst och se till att platstjänsterna är på, och försök sedan igen.",
  "chat.location.not_delivered": "Din plats kunde inte skickas",
  "chat.location.not_delivered_body":
    "En plats är bara värd att skicka så länge den är aktuell, så den läggs inte i kö till senare. Försök igen när {name} går att nå.",
  "chat.location.direction.n": "norr",
  "chat.location.direction.ne": "nordost",
  "chat.location.direction.e": "öster",
  "chat.location.direction.se": "sydost",
  "chat.location.direction.s": "söder",
  "chat.location.direction.sw": "sydväst",
  "chat.location.direction.w": "väster",
  "chat.location.direction.nw": "nordväst",
  "chat.attach.send_anyway": "Skicka ändå",
  "chat.attach.bitchat_too_big": "Det här kanske inte kommer fram",
  "chat.attach.bitchat_too_big_body":
    "{name} använder bitchat, som ger upp halvvägs vid en stor fil. Under ungefär 350 KiB är tillförlitligt. Att skicka den till en Airhop-kontakt har ingen sådan gräns.",
  "chat.attach.bitchat_unopenable": "De kanske inte kan öppna det här",
  "chat.attach.bitchat_unopenable_body":
    "{name} använder bitchat, som visar foton och röstmeddelanden men listar allt annat som en fil den inte kan öppna. Det kommer fram, de kanske bara inte kan titta på det.",
  "chat.attach.file": "Bifoga en fil",
  "chat.attach.unavailable": "Bilagor går inte här",
  "chat.attach.not_sent": "Bilagan skickades inte",
  "chat.attach.read_failed": "Något gick fel när filen lästes. Prova en annan.",
  "chat.attach.caption": "Lägg till en bildtext…",
  "chat.attach.send": "Skicka bilagan",
  "chat.attach.generic": "Bilaga",
  "chat.media.view_full": "Visa fotot i helskärm",
  "chat.media.gone_photo": "Fotot finns inte på den här enheten",
  "chat.media.gone_video": "Videon finns inte på den här enheten",
  "chat.media.gone_voice": "Röstmeddelandet finns inte på den här enheten",
  "chat.media.gone_file": "Filen finns inte på den här enheten",
  "chat.media.gone_note": "Borttaget efter 7 dagar eller när cachen rensades",
  "chat.media.ask_resend": "Fråga igen",
  "chat.media.resend_draft": "Kan du skicka {kind} en gång till?",
  "chat.media.kind_photo": "det där fotot",
  "chat.media.kind_video": "den där videon",
  "chat.media.kind_voice": "det där röstmeddelandet",
  "chat.media.kind_file": "den där filen",
  "chat.media.pause_voice": "Pausa röstmeddelandet",
  "chat.media.play_voice": "Spela upp röstmeddelandet",
  "chat.media.voice_position": "Position i röstmeddelandet",
  "chat.media.voice_scrub":
    "Tryck längs staplarna för att hoppa till den punkten",
  "chat.media.image": "Bild",
  "chat.media.tap_load_photo": "Tryck för att läsa in fotot",
  "chat.media.open_document": "Öppna {name}",
  "chat.media.document": "dokument",
  "chat.media.tap_load_video": "Tryck för att läsa in videon",
  "chat.media.video": "Video",
  "chat.media.photo": "Foto",
  "chat.media.close_photo": "Stäng fotot",
  "chat.media.save_photo": "Spara fotot bland dina foton",
  "chat.media.share_photo": "Dela fotot",
  "chat.media.saved_videos": "Sparad bland dina videor",
  "chat.media.saved_photos": "Sparat bland dina foton",
  "chat.media.not_saved": "Inte sparat",
  "chat.media.cant_open": "Filen går inte att öppna",
  "chat.media.no_app":
    "Enheten har ingen app som kan öppna eller dela den här filen.",
  "chat.media.open_failed":
    "Filen kunde inte öppnas. Den kan ha rensats ur cachen.",
  "media.blocked.nostr_only":
    "Du känner bara den här personen via ett relä. Bara text går fram. Foton, filer och röstmeddelanden kräver Bluetooth.",
  "media.blocked.private_channel":
    "En utsänd bilaga signeras men krypteras inte, så att skicka en till en privat kanal skulle lägga den i klartext medan texten här förblir krypterad.",
  "media.blocked.private_group":
    "En utsänd bilaga signeras men krypteras inte, så att skicka en till en privat grupp skulle lägga den i klartext medan texten här förblir krypterad.",
  "media.blocked.location_channel":
    "En platskanal når fram över internet, och foton, filer och röstmeddelanden går över Bluetooth, så de skulle aldrig komma fram.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Röstmeddelanden går inte här",
  "chat.voice.hold_live": "Håll in för att prata live",
  "chat.voice.hold_record": "Håll in för att spela in ett röstmeddelande",
  "chat.voice.cancel_recording": "Avbryt inspelningen",
  "chat.voice.slide_cancel": "Dra för att avbryta",
  "chat.voice.release_cancel": "Släpp för att avbryta",
  "chat.voice.a11y_toggle": "Tryck två gånger för att börja eller sluta prata.",
  "chat.voice.limit_reached":
    "Gränsen på två minuter är nådd, släpp för att skicka",
  "chat.voice.limit_sent":
    "Gränsen på två minuter är nådd, meddelandet skickat",
  "chat.voice.stop_send": "Stoppa inspelningen och skicka",
  "chat.voice.lift_lock": "Dra uppåt för att spela in handsfree",
  "chat.voice.live_speaking": "{name} talar",
  "voice.unavailable": "Direktröst är inte tillgängligt",
  "voice.recording_stopped": "Inspelningen stoppades",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Kameraåtkomst",
  "chat.perm.camera_purpose": "ta ett foto att skicka",
  "chat.perm.photo_label": "Fotoåtkomst",
  "chat.perm.photo_purpose": "välja ett foto eller en video att skicka",
  "chat.perm.photo_save_purpose": "spara det här bland dina foton",
  "chat.perm.mic_label": "Mikrofonåtkomst",
  "chat.perm.mic_live_purpose": "prata med folk i närheten",
  "chat.perm.mic_note_purpose": "spela in ett röstmeddelande",
  "chat.perm.recording_stopped": "Inspelningen stoppades",
  "chat.perm.record_failed":
    "Inspelningen kunde inte starta. Kontrollera mikrofonbehörigheterna.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Hämtat",
  "chat.ecash.reclaimed": "Tillbakataget",
  "chat.ecash.claiming": "Hämtar…",
  "chat.ecash.claim": "Hämta",
  "chat.ecash.claim_amount": "Hämta {amount} {unit}",
  "chat.ecash.already_claimed": "Redan hämtat",
  "chat.ecash.already_claimed_body":
    "Varje bevis i tokenet finns redan i din plånbok, så inget lades till.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Överlämnat till meshen för leverans efter bästa förmåga",
  "chat.info.queued_desc":
    "Hålls kvar på den här telefonen tills det finns en väg fram till dem",
  "chat.info.reclaimed": "Tillbakataget",
  "chat.info.reclaimed_desc":
    "Du tog tillbaka betalningen till din plånbok, så den levereras inte",
  "chat.info.about": "Om",
  "chat.info.group_desc":
    "En privat grupp. Bara medlemmarna som skaparen lade till kan läsa den, och den stannar på Bluetooth.",
  "chat.info.teleported_desc":
    "En öppen platskanal för den här geohash-cellen. Alla i cellen, på Airhop eller bitchat, delar den över internet. Du är teleporterad, inte fysiskt här.",
  "chat.info.custom_desc":
    "En egen kanal. Alla som känner till namnet kan gå med från vilken Airhop- eller bitchat-enhet som helst.",
  "chat.info.private_e2ee": "Privat · krypterad hela vägen",
  "chat.info.public_plain": "Öppen · okrypterad",
  "chat.info.group_privacy":
    "Bara medlemmarna nedan kan läsa den här gruppen. Meddelanden stannar på Bluetooth, så medlemmar utom räckhåll får dem när de är tillbaka.",
  "chat.info.teleport_privacy":
    "En plats du teleporterat till. Den når alla i den här cellen över internet, och ingen inom Bluetooth-räckhåll.",
  "chat.info.location_off_privacy":
    "Platsen är av, så den här kanalen når enheter i närheten bara över Bluetooth. Slå på plats för att nå områdescellen över internet.",
  "chat.info.invite_privacy":
    "Bara folk du bjuder in via länken kan läsa den. För alla andra förblir den dold, även för peers i närheten.",
  "chat.info.public_privacy":
    "Alla som går med kan läsa varje meddelande. Använd ett direktmeddelande för privata samtal; direktmeddelanden är krypterade hela vägen.",
  "chat.info.remove_member": "Ta bort medlem",
  "chat.info.remove_member_body":
    "Ta bort {name} ur gruppen? Gruppnyckeln byts ut så att hen inte längre kan läsa nya meddelanden.",
  "chat.info.message_member": "Skriv till {name}",
  "chat.info.remove_member_a11y": "Ta bort {name}",
  "chat.info.no_addable":
    "Inga nåbara peers att lägga till. Medlemmar måste vara i närheten.",
  "chat.info.add_count": "Lägg till {count}",
  "chat.info.teleported_tag": "{level}  ·  teleporterad",
  "chat.info.active": "Aktiv",
  "chat.info.members": "Medlemmar",
  "chat.info.bookmark": "Spara den här platsen",
  "chat.info.remove_bookmark": "Ta bort ur sparade platser",
  "chat.info.default_notice":
    "Standardkanaler går inte att lämna. De hör till meshprotokollet i Airhop.",
  "chat.info.custom_channel": "Egen kanal",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Kopiera geohash",
  "chat.info.relays": "Reläer",
  "chat.info.show_relays": "Visa reläerna som bär den här kanalen",
  "chat.info.relay_custom": "eget",
  "chat.info.relays_none": "Inga. Cellen är bara Bluetooth just nu.",
  "chat.info.search_members": "Sök medlemmar",
  "chat.info.search_members_placeholder": "Sök medlemmar…",
  "chat.info.teleported": "Teleporterad",
  "chat.info.creator": "Skapare",
  "chat.info.no_matches": "Inga träffar",
  "chat.info.no_one_here": "Ingen här än",
  "chat.info.add_members": "Lägg till medlemmar",
  "chat.info.add_selected": "Lägg till valda medlemmar",
  "chat.info.add": "Lägg till",
  "chat.info.leave_group": "Lämna gruppen",
  "chat.info.leave_channel": "Lämna kanalen",
  "chat.info.leave": "Lämna",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Chattar sedan {date}",
  "chat.contact.verified_since": "Verifierad sedan {date}",
  "chat.contact.anonymous": "Anonym",
  "chat.contact.anonymous_desc":
    "En geohash-pseudonym utan bestående identitet att verifiera",
  "chat.contact.verified": "Verifierad",
  "chat.contact.verified_desc": "Du har skannat deras QR-kod",
  "chat.contact.verified_desc_compared": "Ni har jämfört koder",
  "chat.contact.not_verified": "Inte verifierad",
  "chat.contact.not_verified_desc":
    "Skanna deras kod, eller jämför en under ett samtal, för att bekräfta att det verkligen är de",
  "chat.contact.e2ee": "Krypterat hela vägen",
  "chat.contact.e2ee_nostr":
    "Inslaget enligt NIP-17, så reläer kan inte läsa det",
  "chat.contact.e2ee_mesh":
    "Noise XX, plus Double Ratchet mellan Airhop-enheter",
  "chat.contact.copy_nostr": "Kopiera Nostr-publik nyckel",
  "chat.contact.nostr_key": "Nostr-publik nyckel",
  "chat.contact.cell_key_note":
    "Nyckeln hör till området där ni möttes. Den ändras om någon av er flyttar på sig, och samtalet tar slut med den. Byt kontakter för att kunna fortsätta prata var som helst.",
  "chat.contact.peer_name": "Peernamn",
  "chat.contact.peer_id": "Peer-ID",
  "chat.contact.rename": "Byt namn",
  "chat.contact.rename_needs_contact":
    "Du kan byta namn på folk vars nycklar du har. Byt kontaktkort först, sedan blir det ett namn bara du ser.",
  "chat.contact.rename_needs_keys":
    "Inga nycklar för den här kontakten än. Skriv till dem, eller skanna deras kod, så kan du ge dem ett namn bara du ser.",
  "chat.contact.renamed_by_you": "Ditt namn på hen",
  "chat.contact.copy_peer_id": "Kopiera peer-ID",
  "chat.contact.verify": "Verifiera kontakt",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Anslag",
  "chat.notices.post_area": "Sätt upp ett anslag i det här området",
  "chat.notices.post_mesh": "Sätt upp ett anslag på meshen",
  "chat.notices.mark_urgent": "Markera som brådskande",
  "chat.notices.post": "Sätt upp anslag",
  "chat.notices.post_short": "Sätt upp",
  "chat.notices.delete": "Radera anslaget",
  "chat.notices.just_now": "nyss",
  "chat.notices.fades_soon": "bleknar snart",
  "chat.notices.1_day": "1 dag",
  "chat.notices.3_days": "3 dagar",
  "chat.notices.7_days": "7 dagar",
  "chat.notices.fading": "bleknar",
  "chat.notices.fades_in_hours": "bleknar om {count} tim",
  "chat.notices.fades_in_days": "bleknar om {count} dgr",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Brådskande",
  "chat.notices.permanent_warning":
    "Bleknar aldrig. Öppet och knutet till det här området, och du kan inte ta tillbaka det.",
  "chat.notices.none":
    "Inga anslag än. Sätt upp ett så att det står kvar här för andra.",

  // ---- Chats: search results ----
  "chat.search.photos": "Foton",
  "chat.search.videos": "Videor",
  "chat.search.audio": "Ljud",
  "chat.search.documents": "Dokument",
  "chat.search.links": "Länkar",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filtrera på {filter}",
  "chat.search.no_matches": "Inga {filter} som matchar ”{query}”",
  "chat.search.no_media": "Inga {filter} än",
  "chat.search.result_a11y": "{chat}, {kind} från {sender}",
  "chat.search.you": "du",
  "chat.search.section_chats": "Chattar",
  "chat.search.section_messages": "Meddelanden",
  "chat.search.section_notices": "Anslag",
  "chat.search.hint":
    "Sök i meddelanden och chattar, eller välj ett filter ovan.",
  "chat.search.no_results": "Inga resultat för ”{query}”",
  "chat.search.open_chat": "Öppna {name}",
  "chat.search.message_a11y": "{chat}, meddelande från {sender}: {snippet}",
  "chat.search.notice_a11y": "Anslag i {chat} från {author}: {snippet}",
  "chat.search.urgent": "Brådskande ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "{count} i den här listan. Att rensa tar bort dem bara härifrån, och meddelandena förblir olästa i sina konversationer. Att markera allt som läst rensar båda.",
  "chat.notif.mark_all_read": "Markera allt som läst",
  "chat.notif.clear_list": "Rensa listan",
  "chat.notif.clear_all_a11y": "Rensa alla {count} aviseringar",
  "chat.notif.title": "Aviseringar",
  "chat.notif.clear_short": "Rensa",
  "chat.notif.close": "Stäng aviseringarna",
  "chat.notif.none": "Inga aviseringar än",
  "chat.notif.none_desc":
    "Meddelanden, omnämnanden och anslag från dina kanaler och chattar dyker upp här.",
  "chat.notif.new": "Ny",
  "chat.notif.notice_in": "anslag i {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Vidarebefordra till…",
  "chat.forward.to": "Vidarebefordra till {name}",
  "chat.forward.cant_send_here": "Går inte att vidarebefordra hit",
  "chat.forward.cant_send_to": "Går inte att vidarebefordra till {name}",
  "chat.forward.channels": "Kanaler",
  "chat.forward.groups": "Grupper",
  "chat.forward.locations": "Platser",
  "chat.forward.dms": "Direktmeddelanden",
  "chat.forward.none": "Inga andra chattar än",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Startar meshen…",
  "mesh.banner.no_bluetooth": "Ingen Bluetooth på enheten · endast internet",
  "mesh.banner.bluetooth_off": "Bluetooth av · meshen är otillgänglig",
  "mesh.banner.permission_needed": "Bluetooth-behörighet krävs",
  "mesh.banner.blocked": "Bluetooth blockerat · tillåt det i Inställningar",
  "mesh.banner.location_permission": "Plats krävs för att hitta peers",
  "mesh.banner.advertising_unsupported":
    "Telefonen kan se andra men kan inte upptäckas",
  "mesh.banner.location_off_android":
    "Plats av · Android behöver den för att hitta peers",
  "mesh.banner.paused": "Meshen pausad · du är borta",
  "mesh.banner.location_off": "Plats av · platskanaler är otillgängliga",
  "mesh.banner.battery_saver": "Batterisparläge · skannar mer sällan",
  "mesh.banner.wipe_incomplete":
    "Rensningen är ofullständig · en del data kan finnas kvar, nytt försök när appen öppnas igen",
  "mesh.banner.wifi_off": "Wi-Fi av · stora filer skickas långsammare",
  "mesh.banner.clock_skew":
    "Telefonens klocka går fel · ställ in datum och tid på automatiskt",
  "mesh.banner.internet_off": "Internet av · endast Bluetooth",
  "mesh.banner.relaying": "Inga peers i närheten · skickar vidare via Nostr",
  "mesh.banner.tor": "Tor på · internettrafiken dirigeras om",
  "mesh.banner.tor_starting": "Startar Tor · ansluter",
  "mesh.banner.tor_blocked": "Tor kunde inte ansluta · meshen fungerar ändå",
  "mesh.banner.gateway":
    "Internetgateway på · skickar vidare för peers i närheten",
  "mesh.banner.bridge": "Meshbrygga på · den öppna chatten är länkad",
  "mesh.banner.background_limits": "{brand} kan pausa meshen i bakgrunden",
  "mesh.banner.bridge_across": "Meshbrygga på · {count} på andra sidan bryggan",
  "mesh.banner.action.turn_on": "Slå på",
  "mesh.banner.action.allow": "Tillåt",
  "mesh.banner.action.resume": "Återuppta",
  "mesh.banner.action.fix": "Åtgärda",
  "mesh.banner.hint.resume": "Slår på Bluetooth-annonsering och -skanning igen",
  "mesh.banner.hint.enable_bluetooth": "Ber Android slå på Bluetooth",
  "mesh.banner.hint.location_settings": "Öppnar systemets platsinställningar",
  "mesh.banner.hint.app_settings":
    "Öppnar behörigheterna för Airhop i systeminställningarna",
  "mesh.banner.hint.battery_settings":
    "Öppnar telefonens inställningar för bakgrundsaktivitet",
  "mesh.banner.dismiss": "Avfärda: {label}",
  "mesh.banner.hint.dismiss": "Döljer den här noteringen för gott",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Söker efter peers i närheten…",
  "mesh.radar.starting": "Startar meshen…",
  "mesh.radar.no_bluetooth": "Ingen Bluetooth på enheten",
  "mesh.radar.bluetooth_off": "Bluetooth av · skannar inte",
  "mesh.radar.permission_needed": "Bluetooth-behörighet krävs",
  "mesh.radar.blocked": "Bluetooth blockerat",
  "mesh.radar.location_permission": "Platsbehörighet krävs",
  "mesh.radar.location_off": "Plats av · skannar inte",
  "mesh.radar.hint_rings": "Ringarna visar BLE-signalstyrka, inte avstånd",
  "mesh.radar.hint_checking": "Kontrollerar Bluetooth och behörigheter",
  "mesh.radar.hint_internet": "Meddelanden går fortfarande över internet",
  "mesh.radar.hint_turn_on": "Slå på Bluetooth för att hitta peers",
  "mesh.radar.hint_allow": "Tillåt Bluetooth för att hitta peers",
  "mesh.radar.hint_allow_settings":
    "Tillåt Bluetooth i Inställningar för att hitta peers",
  "mesh.radar.hint_location_permission":
    "Android 11 och äldre behöver plats för att skanna över Bluetooth",
  "mesh.radar.hint_android_location":
    "Android behöver plats påslagen för att lämna ut Bluetooth-träffar",
  "mesh.radar.signal_strong": "Stark",
  "mesh.radar.signal_medium": "Medel",
  "mesh.radar.signal_weak": "Svag",
  "mesh.radar.you_center": "Du, i mitten av meshen",
  "mesh.radar.sonar_hint":
    "Spelar ett sonarsvep. Skanningen pågår redan hela tiden.",
  "mesh.radar.paused": "Meshen pausad · du är borta",
  "mesh.radar.ring_hint": "Ringens läge speglar signalstyrka, inte avstånd",
  "mesh.radar.set_online":
    "Ställ in din status på Online under Du för att hitta peers",
  "mesh.radar.in_range": "inom räckhåll",
  "mesh.radar.recently_seen": "sedd nyligen",
  "mesh.radar.peer_hint":
    "Öppnar val för att skriva till eller betala den här peern",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "nyss",
  "mesh.peer.none": "Inga peers i närheten",
  "mesh.peer.none_desc":
    "Andra Airhop- eller bitchat-enheter inom Bluetooth-räckhåll dyker upp här.",
  "mesh.peer.id_copied": "Peer-ID kopierat",
  "mesh.peer.copy_id": "Kopiera peer-ID",
  "mesh.peer.their_name": "Kallar sig {name}",
  "mesh.peer.in_range": "Inom räckhåll",
  "mesh.peer.relay": "Relänod",
  "mesh.peer.relay_body":
    "En radio som någon lämnat igång för att vidga meshen. Den bär meddelanden den inte kan läsa. Här finns ingen att skriva till.",
  "mesh.peer.send_dm": "Skicka ett direktmeddelande",
  "mesh.peer.message": "Meddelande",
  "mesh.peer.send_sats": "Skicka ecash",
  "mesh.peer.amount_placeholder": "Belopp i sats",
  "mesh.peer.amount_first": "Skicka ecash, ange ett belopp först",
  "mesh.peer.cancel_send": "Avbryt att skicka ecash",
  "mesh.peer.view_peer": "Visa peern {name}",
  "mesh.peer.view_peer_online": "Visa peern {name}, online",
  "mesh.peer.last_seen": "Sedd för {ago} sedan",
  "mesh.peer.send_amount": "Skicka {amount} sats",
  "mesh.peer.direct": "Direktanslutning",
  "mesh.peer.check_distance": "Kontrollera avstånd",
  "mesh.peer.checking": "Kontrollerar",
  "mesh.peer.no_reply": "Inget svar",
  "mesh.peer.no_reply_hint":
    "De kan ha flyttat på sig, eller så svarar inte deras app",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Region",
  "mesh.level.province": "Län",
  "mesh.level.city": "Stad",
  "mesh.level.neighborhood": "Stadsdel",
  "mesh.level.block": "Kvarter",
  "mesh.level.building": "Byggnad",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Tillgängligt",
  "wallet.balance.unit_hint": "Växlar mellan satoshi och bitcoin",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "Plånbokens lagring är låst. Ecash-bevis ligger i en krypterad fil vars nyckel finns i enhetens nyckelring, och den gick inte att öppna. Lås upp enheten och öppna Airhop igen.",
  "wallet.balance.tor_blocked":
    "Tor är på, så mint-förfrågningar blockeras: de skulle gå ut över det öppna nätet och knyta din IP till dina bevis. Att skicka och ta emot över meshen fungerar ändå. Tillåt mint-trafik under Inställningar, Säkerhet.",
  "wallet.balance.unconfirmed_note":
    "{amount} är ännu inte bekräftat hos minten",
  "wallet.balance.reserved_note":
    "{amount} är reserverat för en sändning på väg",
  "wallet.balance.other_mint_note": "{amount} hos en annan mint",
  "wallet.balance.test_mint_note":
    "Innehåller låtsaspengar från en testmint. Det är inte bitcoin och går inte att lösa in.",
  "wallet.token": "Token",
  "wallet.action.send": "Skicka ett ecash-token",
  "wallet.action.send_disabled":
    "Skicka ett ecash-token, går inte med tomt saldo",
  "wallet.action.receive": "Ta emot ett ecash-token",
  "wallet.action.zap": "Zappa en Nostr-kontakt",
  "wallet.action.zap_disabled":
    "Zappa en Nostr-kontakt, går inte med tomt saldo",
  "wallet.action.add_mint": "Lägg till en Cashu-mint",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Tokenet kunde inte byggas",
  "wallet.send.title": "Skicka ecash",
  "wallet.send.amount_in": "Belopp i {unit}",
  "wallet.send.body":
    "Byggt offline av bevis du redan har. Inget lämnar saldot för gott förrän du bekräftar att tokenet kom fram.",
  "wallet.send.stale_fee_note":
    "Avgifterna kontrollerades senast för {days} dygn sedan. Om minten har höjt sin avgift sedan dess kan sändningen kosta lite mer.",
  "wallet.send.fee_note":
    "{spend} {unit} lämnar ditt saldo; de extra {fee} täcker mintavgiften som de annars skulle betala",
  "wallet.send.qr_too_big":
    "Tokenet är uppdelat på för många mynt för att rymmas i en QR-kod. Dela eller kopiera det i stället, eller uppdatera hos minten för att slå ihop dem.",
  "wallet.send.bearer_note":
    "Den som har den här strängen äger pengarna. Bevisen är reserverade, inte förbrukade: om den aldrig når någon kan du ta tillbaka dem under Väntande.",
  "wallet.send.qr_too_big_short":
    "Tokenet är uppdelat på för många mynt för att rymmas i en QR-kod. Dela eller kopiera det i stället.",
  "wallet.send.scan_note":
    "Låt dem skanna det här från sin egen plånbok. Det går att ta tillbaka tills du markerar det som levererat.",
  "wallet.send.mesh_note":
    "Tokenet går ut som ett krypterat direktmeddelande över meshen. Inget internet behövs.",
  "wallet.send.no_peers_note":
    "Öppna Mesh-fliken för att hitta enheter i närheten, eller dela tokenet på något annat sätt.",
  "wallet.send.send_to": "Skicka till {name}",
  "wallet.send.memo": "Notering (valfri, följer med tokenet)",
  "wallet.send.building": "Bygger…",
  "wallet.send.build": "Bygg token",
  "wallet.send.inexact_body":
    "Dina bevis kan inte bilda exakt {amount} {unit} offline. Det minsta tokenet du kan bygga är {spend} {unit}, och offline finns ingen växel: de extra {extra} {unit} går till mottagaren.\n\nAtt uppdatera hos minten medan du är online skulle dela dina bevis i valörer som går jämnt upp.",
  "wallet.send.send_amount": "Skicka {amount}",
  "wallet.send.sent_to": "{amount} {unit} skickat till {name}",
  "wallet.send.sent_to_body":
    "{route} Det går att ta tillbaka under Väntande tills du bekräftar att de fick det, eller tills minten säger att bevisen har lösts in.",
  "wallet.send.copy_token": "Kopiera token",
  "wallet.send.share_token": "Dela token",
  "wallet.send.open_in_wallet": "Öppna tokenet i en annan plånbok",
  "wallet.send.open_in_wallet_short": "Öppna i plånbok",
  "wallet.send.to_peer": "Skicka tokenet till en peer i närheten",
  "wallet.send.to_peer_short": "Skicka till peer",
  "wallet.send.mark_delivered": "Markera som levererat och avsluta",
  "wallet.send.they_got_it": "De fick det",
  "wallet.send.keep_pending": "Låt sändningen förbli väntande",
  "wallet.send.decide_later": "Bestäm senare",
  "wallet.send.no_peers": "Inga peers inom räckhåll",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Det här är din egen betalning",
  "wallet.receive.own_payment_body":
    "Mynten är fortfarande reserverade för en sändning du inte har avslutat, så det finns inget att hämta. Använd Ta tillbaka på den betalningen för att lägga dem rakt tillbaka i saldot.",
  "wallet.receive.already_have": "Finns redan i din plånbok",
  "wallet.receive.already_have_body":
    "Varje bevis i tokenet ligger redan här, så inget lades till. Saldona är oförändrade.",
  "wallet.receive.stored_unconfirmed":
    "Sparat från {mint}, men ännu inte bekräftat hos minten ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Inlöst hos {mint}. Bevisen är nu bara dina: avsändarens kopia fungerar inte längre.",
  "wallet.receive.memo_quoted": "\n\n”{memo}”",
  "wallet.receive.redeemed_at":
    "Inlöst hos {mint}. Det är bevisligen ditt nu: avsändarens kopia av tokenet fungerar inte längre.",
  "wallet.receive.stored_pending":
    "Sparat från {mint}, men minten har ännu inte bekräftat att det är obrukat{dleq}. Uppdatera från Plånbok-fliken när du är online.",
  "wallet.receive.dleq_inline": " (signaturen stämmer, så tokenet är äkta)",
  "wallet.receive.dleq_ok": "Mintens signatur stämmer, så tokenet är äkta.",
  "wallet.receive.dleq_uncached":
    "Mintens nycklar finns inte här, så signaturen kunde inte kontrolleras offline.",
  "wallet.receive.dleq_warning":
    "Tills du uppdaterar online kan avsändaren i princip ha gjort av med det någon annanstans.",
  "wallet.receive.failed": "Kunde inte ta emot",
  "wallet.receive.title": "Ta emot ecash",
  "wallet.receive.body":
    "Klistra in ett Cashu-token. Online löses det in hos minten direkt; offline sparas det och bekräftas nästa gång du uppdaterar.",
  "wallet.receive.scan": "Skanna en ecash-QR-kod",
  "wallet.receive.scan_short": "Skanna QR",
  "wallet.receive.receiving": "Tar emot…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap mottagen från {from}… och inlöst till din plånbok.",
  "wallet.zap.title": "Zappa en Nostr-identitet",
  "wallet.zap.not_npub": "inte en npub",
  "wallet.zap.bad_key": "felaktig nyckel",
  "wallet.zap.invalid_pubkey": "Ogiltig publik nyckel",
  "wallet.zap.invalid_pubkey_body":
    "Ange en npub1… eller en Nostr-publik nyckel på 64 hex-tecken.",
  "wallet.zap.sent": "Nutzap skickad",
  "wallet.zap.failed": "Zappen misslyckades",
  "wallet.zap.body":
    "Om de publicerar NIP-61-nutzapuppgifter låses ecashen till deras nyckel så att ingen annan kan göra av med den, och då går den inte att ta tillbaka. Om inte går den i stället som ett token du kan ta tillbaka. Du får veta vilket det blev.",
  "wallet.zap.contact": "Zappa {name}",
  "wallet.zap.pubkey_placeholder": "npub1… eller 64 hex-tecken",
  "wallet.zap.sending": "Skickar…",
  "wallet.nostr.copied_body":
    "Ge den här till någon så kan de zappa dig från Airhop eller vilken annan Nostr-plånbok som helst, utan Bluetooth.",
  "wallet.nostr.copy_key": "Kopiera din Nostr-nyckel så att folk kan zappa dig",
  "wallet.nostr.your_key": "Din Nostr-nyckel",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint tillagd",
  "wallet.mint.add_failed": "Minten kunde inte läggas till",
  "wallet.mint.added_named": "{name} tillagd",
  "wallet.mint.added_body":
    "{mint} ger ut {units}. Dess nycklar finns på enheten, så token därifrån går nu att kontrollera även utan internet.",
  "wallet.mint.remove_plain":
    "Ta bort {mint} från din plånbok? Dess sparade nycklar följer med, så token därifrån går inte längre att kontrollera offline.",
  "wallet.mint.title": "Mintar",
  "wallet.mint.none": "Ingen mint än",
  "wallet.mint.none_desc":
    "En mint ger ut och löser in din ecash. Lägg till en för att sätta in över Lightning, eller ta bara emot ett token så läggs dess mint till åt dig.",
  "wallet.mint.add": "Lägg till en mint",
  "wallet.mint.add_body":
    "En mint håller de bitcoin som täcker din ecash, så välj en du skulle anförtro det saldo du har där. URL:en kontrolleras innan den sparas. Kör en egen med Nutshell om du hellre slipper lita på någon.",
  "wallet.mint.consolidate_body":
    "Ett token kan bara någonsin nämna en mint, så ett saldo utspritt på flera kan inte betala ett belopp större än vad den största håller. Airhop kan flytta det: varje annan mint betalar en Lightning-faktura utställd av den du väljer. Det kostar en liten routingavgift och kräver internet.",
  "wallet.mint.add_short": "Lägg till mint",
  "wallet.mint.checking": "Kontrollerar…",
  "wallet.mint.remove_with_balance": "Ta bort en mint med saldo?",
  "wallet.mint.remove": "Ta bort mint",
  "wallet.mint.delete_anyway": "Radera ändå",
  "wallet.mint.consolidate": "Flytta alla saldon till en mint",
  "wallet.mint.confirm_with": "Bekräfta bevis hos {mint}",
  "wallet.mint.remove_a11y": "Ta bort {mint}",
  "wallet.mint.available_amount": "{amount} {unit} tillgängligt",
  "wallet.mint.split_across":
    "Saldot är uppdelat på {count} mintar. Flytta det till en.",
  "wallet.mint.move_everything_to": "Flytta allt till {mint}",
  "wallet.mint.consolidate_title": "Flytta till en mint",
  "wallet.mint.moving": "Flyttar…",
  "wallet.mint.move": "Flytta",
  "wallet.mint.moved": "Flyttat",
  "wallet.mint.moved_body":
    "{amount} {unit} ligger nu hos {mint}, efter {fees} {unit} i Lightning-routingavgifter.",
  "wallet.mint.nothing_moved": "Inget flyttades",
  "wallet.mint.destination": "· mål",
  "wallet.mint.will_move": "· flyttas",
  "wallet.mint.issued_by": "Utgiven av",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Påfyllning av Airhop-plånboken",
  "wallet.ln.invoice_failed": "Fakturan kunde inte skapas",
  "wallet.ln.price_failed": "Fakturan kunde inte prissättas",
  "wallet.ln.paid": "Betald",
  "wallet.ln.deposit_credited":
    "Fakturan är betald och {amount} {unit} utgivet av {mint}. Saldot är bekräftat: du kan använda det offline direkt.",
  "wallet.ln.withdrawn":
    "{paid} sats betalt över Lightning. Minten tog {fee} sats i routingavgift.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats betalt över Lightning. Minten tog {fee} sats i routingavgift och lämnade tillbaka {change} sats av reserven till ditt saldo.",
  "wallet.ln.payment_failed": "Betalningen misslyckades",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Gör om Lightning-sats till ecash du kan använda offline, eller lös ut ecash till vilken Lightning-faktura som helst. Båda kräver internet och en mint.",
  "wallet.ln.deposit_body":
    "Minten ger dig en faktura. Betala den från vilken Lightning-plånbok som helst så kommer satsen tillbaka som ecash du kan använda offline.",
  "wallet.ln.pay_invoice_for":
    "Betala den här fakturan på {amount} {unit}. Plånboken bevakar betalningen och ger ut din ecash automatiskt.",
  "wallet.ln.expired_body":
    "Fakturan har gått ut. Om du redan har betalat den krediteras saldot automatiskt.",
  "wallet.ln.waiting_expires": "Väntar på betalning · går ut om {countdown}",
  "wallet.ln.withdraw_body":
    "Klistra in en bolt11-faktura så betalar minten den ur din ecash. Du får först veta routingreserven; det routingen inte använder kommer tillbaka till ditt saldo.",
  "wallet.ln.up_to": "upp till {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Betala {amount} {unit}",
  "wallet.ln.deposit": "Sätt in sats över Lightning",
  "wallet.ln.deposit_short": "Sätt in",
  "wallet.ln.withdraw": "Lös ut till en Lightning-faktura",
  "wallet.ln.withdraw_short": "Lös ut",
  "wallet.ln.deposit_title": "Sätt in över Lightning",
  "wallet.ln.amount_placeholder": "Belopp i sats",
  "wallet.ln.requesting": "Begär…",
  "wallet.ln.get_invoice": "Hämta faktura",
  "wallet.ln.copy_invoice": "Kopiera faktura",
  "wallet.ln.open_wallet": "Öppna i en Lightning-plånbok",
  "wallet.ln.open_wallet_short": "Öppna i plånbok",
  "wallet.ln.waiting": "Väntar på betalning…",
  "wallet.ln.new_invoice": "Skapa en ny faktura",
  "wallet.ln.new_invoice_short": "Ny faktura",
  "wallet.ln.withdraw_title": "Lös ut till Lightning",
  "wallet.ln.scan_invoice": "Skanna QR-koden för en Lightning-faktura",
  "wallet.ln.paid_from": "Betalt från",
  "wallet.ln.invoice": "Faktura",
  "wallet.ln.routing_reserve": "Routingreserv",
  "wallet.ln.reserved": "Reserverat från saldot",
  "wallet.ln.paying": "Betalar…",
  "wallet.ln.get_quote": "Hämta offert",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Säkerhetskopia",
  "wallet.backup.setup_failed": "Säkerhetskopian kunde inte ställas in",
  "wallet.backup.on": "Säkerhetskopia på",
  "wallet.backup.on_body":
    "Ditt saldo kan nu byggas upp igen ur de tolv orden.\n\nAllt du fått av någon annan står utanför frasen tills du uppdaterar hos minten, och återställning kräver din lista över mintar, så skriv ned den bredvid orden.",
  "wallet.backup.no_phrase": "Ingen fras sparad",
  "wallet.backup.no_phrase_body":
    "Återställningsfrasen kunde inte läsas ur enhetens nyckelring. Lås upp enheten och försök igen.",
  "wallet.backup.replace_title": "Ersätta din nuvarande fras?",
  "wallet.backup.replace_body":
    "Du har redan en återställningsfras. Att återställa en annan ersätter den. Mynt som den gamla frasen redan täckte går att använda på den här enheten, men de går inte längre att återställa, så se till att de gamla orden är nedskrivna innan du fortsätter.",
  "wallet.backup.replace": "Ersätt",
  "wallet.backup.invalid_phrase": "Frasen är inte giltig",
  "wallet.backup.invalid_phrase_body":
    "Frasen har en inbyggd kontrollsumma och den här klarar den inte. Leta efter ett felstavat, saknat eller omkastat ord.",
  "wallet.backup.not_bip39":
    "Det här är inte BIP-39-ord: {words}. Kontrollera stavningen.",
  "wallet.backup.add_mint_first": "Lägg till en mint först",
  "wallet.backup.add_mint_first_body":
    "Återställning fungerar genom att fråga en mint vilka mynt den signerat åt dig, så den behöver veta vilken mint den ska fråga. Lägg till de mintar du använde och återställ sedan.",
  "wallet.backup.restore_failed": "Återställningen misslyckades",
  "wallet.backup.phrase": "Återställningsfras",
  "wallet.backup.state_unconfirmed": "Säkerhetskopia på men inte bekräftad",
  "wallet.backup.state_off": "Säkerhetskopia av",
  "wallet.backup.badge_on": "På",
  "wallet.backup.badge_unconfirmed": "Obekräftad",
  "wallet.backup.badge_off": "Av",
  "wallet.backup.view": "Visa återställningsfrasen",
  "wallet.backup.setup": "Ställ in en återställningsfras",
  "wallet.backup.view_short": "Visa frasen",
  "wallet.backup.setup_short": "Ställ in",
  "wallet.backup.restore": "Återställ en plånbok från en återställningsfras",
  "wallet.backup.restore_short": "Återställ",
  "wallet.backup.setup_title": "Ställ in en återställningsfras",
  "wallet.backup.on_body_short":
    "Ditt saldo kan byggas upp på en ny enhet ur dina tolv ord.",
  "wallet.backup.unconfirmed_body":
    "Du har aldrig bekräftat att du skrivit ned dem. Just nu finns orden bara på den här telefonen, vilket är precis det en säkerhetskopia ska överleva. Visa frasen och skriv ned den.",
  "wallet.backup.not_covered":
    "{amount} täcks inte än. Mynt du fått bär hemligheterna från den som skickade dem, så de kommer under din fras först när de bytts. Uppdatera en mint för att säkra dem.",
  "wallet.backup.off_body":
    "Din ecash finns bara på den här telefonen. Om du tappar den kan ingen få tillbaka pengarna, inte du heller. En återställningsfras är tolv ord som kan bygga upp ditt saldo var som helst.",
  "wallet.backup.about_to_see":
    "Du kommer strax att se tolv ord. De är pengarna.",
  "wallet.backup.exact_order":
    "Tolv ord, i exakt den här ordningen. Den som har dem har ditt saldo.",
  "wallet.backup.verify_body":
    "En fras som ingen skrivit ned är sämre än ingen fras alls, för den ser ut som ett skyddsnät som inte finns. Två ord för att bekräfta.",
  "wallet.backup.verify_mismatch":
    "Det stämmer inte. Kontrollera din nedskrivna kopia.",
  "wallet.backup.restore_body":
    "Ange de tolv orden. Airhop härleder dina mynt på nytt och frågar varje mint vilka av dem den signerat, så saldot kommer tillbaka ur mintens register.",
  "wallet.backup.warn_secret":
    "Alla som läser dem kan ta ditt saldo. Ta ingen skärmbild av dem och spara dem inte på telefonen.",
  "wallet.backup.warn_paper":
    "Skriv dem på papper och förvara dem säkert. Airhop kan inte visa dem igen om telefonen är borta.",
  "wallet.backup.warn_scope":
    "De bygger bara upp din ecash. Din identitet, dina chattar och dina kontakter täcks inte.",
  "wallet.backup.warn_mints":
    "Återställning måste fråga en mint vilka mynt den signerat, så skriv ned din lista över mintar bredvid orden.",
  "wallet.backup.preparing": "Förbereder…",
  "wallet.backup.show_phrase": "Visa min fras",
  "wallet.backup.your_phrase": "Din återställningsfras",
  "wallet.backup.write_down": "Skriv ned dessa",
  "wallet.backup.copy_phrase": "Kopiera återställningsfrasen till urklipp",
  "wallet.backup.copy_clipboard": "Kopiera till urklipp",
  "wallet.backup.written_down": "Jag har skrivit ned dem",
  "wallet.backup.check_copy": "Kontrollera din kopia",
  "wallet.backup.confirm": "Bekräfta",
  "wallet.backup.restore_title": "Återställ från en fras",
  "wallet.backup.phrase_placeholder": "tolv ord, åtskilda med mellanslag",
  "wallet.backup.no_mints_yet":
    "Inga mintar tillagda än. Återställning måste fråga en bestämd mint, så lägg till dem du använde först.",
  "wallet.backup.scanning": "Söker igenom…",
  "wallet.backup.restore_progress":
    "{mint} · nyckeluppsättning {step} av {total}",
  "wallet.backup.will_scan":
    "Söks igenom: {mints}. En mint du inte lagt till frågas aldrig, så dess saldo förblir osynligt.",
  "wallet.backup.word_n": "Ord {position}",
  "wallet.backup.unreachable_mints":
    "Kunde inte nå: {mints}. Saldot där finns fortfarande kvar. Försök igen när du har bättre uppkoppling.",
  "wallet.backup.nothing_recovered":
    "Inget återställdes från de genomsökta mintarna.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Markera som mottaget?",
  "wallet.delivered.body":
    "Detta släpper {amount} {unit} för gott. Om det i själva verket aldrig kom fram kan du inte ta tillbaka det.",
  "wallet.delivered.body_generic":
    "Detta släpper det reserverade beloppet för gott. Om det i själva verket aldrig kom fram kan du inte ta tillbaka det.",
  "wallet.delivered.cancel": "Inte än",
  "wallet.delivered.confirm": "De fick det",
  "wallet.reclaim.title": "Ta tillbaka tokenet?",
  "wallet.reclaim.body":
    "De {amount} {unit} går tillbaka till ditt saldo. Gör bara det här om tokenet aldrig nådde någon: har de redan strängen behåller den som löser in den först hos minten pengarna, och det kan vara de.",
  "wallet.reclaim.keep": "Låt förbli väntande",
  "wallet.reclaim.confirm": "Ta tillbaka",
  "wallet.copied.token_body":
    "Tokenet ligger i urklipp. Det förblir reserverat här tills du markerar det som levererat, så du kan klistra in det igen om första försöket misslyckas.",
  "wallet.copied.phrase_body":
    "Klistra in den i en lösenordshanterare och töm sedan urklipp. Andra appar kan läsa urklipp, och i vissa inställningar synkas det till dina andra enheter.",
  "wallet.refresh.failed": "Uppdateringen misslyckades",
  "wallet.refresh.partly": "Delvis uppdaterat",
  "wallet.refresh.done": "Uppdaterat",
  "wallet.refresh.unreachable":
    "Kunde inte nå {mints}. Allt annat är aktuellt.",
  "wallet.refresh.swapped":
    "{amount} {unit} bekräftat och bytt mot färska bevis.",
  "wallet.refresh.secured":
    "{amount} {unit} täcks nu av din återställningsfras.",
  "wallet.refresh.all_confirmed": "Allt här var redan bekräftat hos minten.",
  "wallet.pending.title": "Väntande",
  "wallet.pending.reserved_desc":
    "Byggt och reserverat, leveransen obekräftad. Bevisen hålls utanför saldot så att de inte kan användas två gånger.",
  "wallet.pending.locked_desc":
    "Redan låst till mottagarens nyckel, så bara de kan använda det. Det har bara inte nått fram än. Dela tokenet för att avsluta.",
  "wallet.pending.show_qr": "Visa tokenet som en QR-kod",
  "wallet.pending.copy_again": "Kopiera tokenet igen",
  "wallet.pending.share_again": "Dela tokenet igen",
  "wallet.pending.mark_delivered": "Markera tokenet som levererat",
  "wallet.pending.delivered": "Levererat",
  "wallet.pending.reclaim_into": "Ta tillbaka tokenet till ditt saldo",
  "wallet.activity.title": "Aktivitet",
  "wallet.activity.none": "Inget än",
  "wallet.activity.none_desc":
    "Betalningar du skickar och tar emot dyker upp här, nyast först, med mint och avgift för var och en.",
  "wallet.activity.show_fewer": "Visa färre betalningar",
  "wallet.activity.show_less": "Visa mindre",
  "wallet.activity.received_unconfirmed": "Mottaget, obekräftat",
  "wallet.activity.received": "Mottaget",
  "wallet.activity.receive_failed": "Mottagningen misslyckades",
  "wallet.activity.reclaimed": "Tillbakataget",
  "wallet.activity.send_failed": "Sändningen misslyckades",
  "wallet.activity.sent": "Skickat",
  "wallet.activity.status_pending": "väntande",
  "wallet.activity.status_failed": "misslyckades",
  "wallet.activity.status_reclaimed": "tillbakataget",
  "wallet.activity.status_expired": "utgånget",
  "wallet.activity.ln_deposit": "Lightning-insättning",
  "wallet.activity.ln_withdrawal": "Lightning-uttag",
  "wallet.activity.nutzap_received": "Nutzap mottagen",
  "wallet.activity.spent_removed": "Förbrukade bevis borttagna",
  "wallet.activity.refreshed": "Bevis uppdaterade",
  "wallet.activity.refreshing": "Uppdaterar bevis",
  "wallet.activity.just_now": "nyss",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Meshen är offline",
  "wallet.mesh_offline_body":
    "Meshtjänsten är inte igång, så det finns ingen att lämna tokenet till. Det förblir reserverat under Väntande.",
  "wallet.xfer.route_mesh": "Överlämnat direkt till deras enhet över meshen.",
  "wallet.xfer.route_nostr":
    "De var utom Bluetooth-räckhåll, så det gick över internet i stället.",
  "wallet.xfer.route_courier":
    "Ingen väg fram till dem just nu. Andra enheter bär det och levererar när någon av dem når fram.",
  "wallet.xfer.route_queued":
    "De är inte nåbara än. Det ligger i kö och skickas så snart de är det.",
  "wallet.xfer.mesh_offline_body":
    "Meshtjänsten är inte igång, så det finns inget sätt att lämna över tokenet. Inget har dragits.",
  "wallet.xfer.could_not_send": "Kunde inte skicka",
  "wallet.xfer.inexact_body":
    "Dina bevis kan inte bilda exakt {amount} {unit} offline. Det minsta tokenet du kan bygga är {spend} {unit}, och de extra {extra} {unit} går till dem utan något sätt att få tillbaka dem.\n\nAtt uppdatera hos minten medan du är online delar dina bevis i valörer som går jämnt upp.",
  "wallet.xfer.send_amount": "Skicka {amount}",
  "wallet.xfer.mesh_offline": "Meshen är offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Låst till deras nyckel och publicerat på Nostr. Det är deras vare sig de är online eller inte.",
  "wallet.pay.rail_nutzap_dm":
    "Låst till deras nyckel. Reläet tog inte emot det, så det gick till dem som ett meddelande i stället.",
  "wallet.pay.rail_nutzap_undelivered":
    "Låst till deras nyckel, men inget kunde bära det än. Det ligger i kö, och tokenet finns under Väntande.",
  "wallet.pay.final":
    "Låsta betalningar går inte att ta tillbaka: bara deras nyckel kan använda mynten nu.",
  "wallet.pay.reclaimable":
    "Det går att ta tillbaka från Plånbok-fliken tills du bekräftar att det kom fram.",
  "wallet.pay.why": "Skickat så här eftersom {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} till {name}",
  "wallet.pay.thread_receipt":
    "Du skickade {amount} {unit}, låst till deras nyckel.",
  "wallet.pay.title": "Skicka ecash",
  "wallet.pay.to": "Till {name}",
  "wallet.pay.amount": "Belopp i sats",
  "wallet.pay.memo": "Notering (valfri, offentlig)",
  "wallet.pay.send": "Skicka",
  "wallet.pay.sending": "Skickar…",
  "wallet.pay.action": "Skicka ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Kameraåtkomst",
  "wallet.scan.camera_purpose": "skanna en ecash-QR-kod",
  "wallet.scan.photo_label": "Fotoåtkomst",
  "wallet.scan.photo_purpose": "läsa en ecash-QR ur en bild",
  "wallet.scan.no_token": "Inget ecash-token hittades i bilden.",
  "wallet.scan.no_invoice": "Ingen Lightning-faktura hittades i bilden.",
  "wallet.scan.unreadable": "Bilden kunde inte läsas.",
  "wallet.scan.camera_failed":
    "Kameran kunde inte startas. Stäng andra kameraappar och försök igen.",
  "wallet.scan.close": "Stäng skannern",
  "wallet.scan.on_device":
    "Den läses på den här enheten; inget skickas någonstans.",
  "wallet.scan.aim_token": "Rikta mot en ecash-QR-kod.",
  "wallet.scan.aim_invoice": "Rikta mot QR-koden för en Lightning-faktura.",
  "wallet.scan.title_token": "Skanna ecash",
  "wallet.scan.title_invoice": "Skanna faktura",
  "wallet.scan.desc_token":
    "Läs ett Cashu-token från en annan plånbok. Fungerar med vilken Cashu-plånbok som helst, inte bara Airhop.",
  "wallet.scan.desc_invoice":
    "Läs en Lightning-faktura för att betala den ur ditt saldo.",
  "wallet.scan.use_camera_a11y": "Skanna med kameran",
  "wallet.scan.use_camera": "Använd kameran",
  "wallet.scan.pick_image_a11y": "Läs en QR-kod ur en sparad bild",
  "wallet.scan.pick_image": "Välj bland foton",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Vad är Cashu?",
  "wallet.explain.intro":
    "Cashu är ecash för Bitcoin. Ett token är en sträng som är värd pengar för den som har den, blint signerad av en mint så att minten inte kan se vem som gjorde av med vad. Inga konton, inga inloggningar.",
  "wallet.explain.send": "Skicka",
  "wallet.explain.send_desc":
    "Gör om ett belopp till ett token du kan lämna över till en peer i närheten via Bluetooth, eller dela som text. Fungerar utan internet. Bevisen förblir reserverade tills du bekräftar att det kom fram.",
  "wallet.explain.receive": "Ta emot",
  "wallet.explain.receive_desc":
    "Klistra in ett token för att lägga till det. Online byts det hos minten direkt, vilket gör det bevisligen ditt. Offline sparas det och märks som obekräftat tills du uppdaterar.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Betalar en Nostr-identitet. Om de publicerar NIP-61-nutzapuppgifter låses ecashen till deras nyckel så att bara de kan använda den. Annars faller det tillbaka på ett krypterat direktmeddelande. Kräver internet.",
  "wallet.explain.add_mint": "Lägg till mint",
  "wallet.explain.add_mint_desc":
    "Sparar minten som ger ut och löser in din ecash, och behåller dess publika nycklar så att token därifrån går att kontrollera offline. Välj en mint du skulle anförtro det saldo du har där.",
  "wallet.explain.phrase": "Återställningsfras",
  "wallet.explain.phrase_desc":
    "Dina mynt härleds ur tolv ord som plånboken skapar i början, så en ny telefon kan bygga upp saldot genom att fråga dina mintar vilka mynt de signerat. Tills du visar och skriver ned dem finns de bara på den här telefonen.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Plånboken är låst",
  "wallet.err.mint_unreachable": "Minten går inte att nå",
  "wallet.err.tor_blocked": "Blockerat medan Tor är på",
  "wallet.err.insufficient": "Otillräckligt saldo",
  "wallet.err.exact_amount": "Kan inte skicka exakt det beloppet",
  "wallet.err.no_mint": "Ingen mint",
  "wallet.err.mint_unsupported": "Minten klarar inte det",
  "wallet.err.mint_refused": "Minten vägrade",
  "wallet.err.unreadable": "Oläsbart token",
  "wallet.err.rejected": "Tokenet avvisades",
  "wallet.err.already_spent": "Redan förbrukat",
  "wallet.err.change_pending": "Betalt, växel väntar",
  "wallet.svc.mint_unreachable": "Minten kunde inte nås.",
  "wallet.svc.tor_ios": "Mint-förfrågningar går inte genom Tor på iOS.",
  "wallet.svc.tor_ios_body":
    "Arti omsluter bara Nostr-WebSockets, så förfrågan skulle nå minten över det öppna nätet och knyta din IP till de här bevisen. Tillåt det under Inställningar > Säkerhet, eller stäng av Tor först. Att skicka och ta emot ecash över meshen fungerar ändå.",
  "wallet.svc.keys_uncached": "Den här mintens nycklar finns inte på enheten.",
  "wallet.svc.keys_uncached_body":
    "Öppna plånboken en gång medan du är online för att hämta dem.",
  "wallet.svc.phrase_invalid": "Återställningsfrasen är inte giltig.",
  "wallet.svc.phrase_invalid_body":
    "Leta efter ett felstavat eller saknat ord. Frasen har en inbyggd kontrollsumma, så ett enda fel ord gör hela frasen ogiltig.",
  "wallet.svc.need_mint": "Lägg till minst en mint först.",
  "wallet.svc.need_mint_body":
    "Återställning fungerar genom att fråga en mint vilka mynt den signerat åt dig, så den behöver veta vilken mint den ska fråga.",
  "wallet.svc.restored": "Återställd från återställningsfrasen",
  "wallet.svc.storage_locked": "Plånbokens lagring är låst.",
  "wallet.svc.storage_locked_body":
    "Airhop håller ecash-bevis i en krypterad fil vars nyckel finns i enhetens nyckelring. Lås upp enheten och öppna appen igen.",
  "wallet.svc.bad_url": "Det är ingen giltig URL.",
  "wallet.svc.needs_https": "En mint-URL måste börja med https://.",
  "wallet.svc.refuse_http": "Vägrar använda en mint över okrypterad http.",
  "wallet.svc.refuse_http_body":
    "Vem som helst längs nätverksvägen kunde läsa eller ändra dina bevis. Använd en mint med https://.",
  "wallet.svc.mint_not_saved": "Minten kunde inte sparas.",
  "wallet.svc.unreadable_token": "Det är inget läsbart Cashu-token.",
  "wallet.svc.unreadable_token_body":
    "Token börjar med cashuA eller cashuB. Kontrollera att inget kapades när det kopierades.",
  "wallet.svc.wrong_mint": "Tokenet är inte signerat av den mint det uppger.",
  "wallet.svc.already_spent": "De här bevisen är redan förbrukade.",
  "wallet.svc.already_spent_body":
    "Den som skickade tokenet löste in det först, eller skickade samma token till någon annan också.",
  "wallet.svc.receiving_offline": "tar emot offline",
  "wallet.svc.amount_positive": "Ange ett belopp större än noll.",
  "wallet.svc.coins_raced": "De mynten användes just av en annan betalning.",
  "wallet.svc.coins_raced_body":
    "Inget drogs. Försök igen så väljer plånboken en annan uppsättning.",
  "wallet.svc.no_ecash": "Ingen ecash än.",
  "wallet.svc.no_ecash_body":
    "Lägg till en mint och sätt in över Lightning, eller ta emot ett token från någon.",
  "wallet.svc.split_across_mints": "Ditt saldo är uppdelat på flera mintar.",
  "wallet.svc.mint_says_spent":
    "Minten rapporterade bevisen som redan förbrukade.",
  "wallet.svc.issue_against_invoice": "ge ut ecash mot en Lightning-faktura",
  "wallet.svc.pay_invoice": "betala en Lightning-faktura",
  "wallet.svc.unknown_deposit": "Okänd insättning.",
  "wallet.svc.invoice_expired_before":
    "Fakturan gick ut innan den hann betalas.",
  "wallet.svc.invoice_expired": "Fakturan har gått ut.",
  "wallet.svc.invoice_unpaid": "Fakturan är ännu inte betald.",
  "wallet.svc.payment_unknown":
    "Betalningsstatusen är okänd; kontrolleras igen vid nästa uppdatering.",
  "wallet.svc.melt_change_pending": "Din faktura betalades.",
  "wallet.svc.melt_change_pending_body":
    "Minten har ännu inte lämnat tillbaka den oanvända routingavgiften. Den hämtas automatiskt vid nästa uppdatering, och inget går förlorat under tiden.",
  "wallet.svc.mint_did_not_pay":
    "Minten betalade inte den här fakturan. Ditt saldo är oförändrat.",
  "wallet.svc.not_an_invoice": "Det är ingen Lightning-faktura.",
  "wallet.svc.not_an_invoice_body":
    "Klistra in en bolt11-faktura som börjar med lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Otillräckligt saldo för den här fakturan.",
  "wallet.svc.coins_raced_invoice_body":
    "Inget drogs och fakturan betalades inte. Försök igen.",
  "wallet.svc.same_mint": "Välj en annan målmint.",
  "wallet.svc.same_mint_body":
    "Källan och målet är samma mint, så det finns inget att flytta.",
  "wallet.svc.quote_failed_retried":
    "Offerten misslyckades, hopslagningen försöktes igen",
  "wallet.svc.amount_unfit_retried":
    "Beloppet passade inte, hopslagningen försöktes igen",
  "wallet.svc.cannot_size": "Överföringens storlek kunde inte bestämmas.",
  "wallet.svc.insufficient_at_mint": "Otillräckligt saldo hos {mint}.",
  "wallet.svc.inexact_title":
    "Dina bevis kan inte bilda exakt {amount} {unit} offline.",
  "wallet.svc.inexact_detail":
    "Det minsta tokenet du kan skicka är {spend} {unit}. Offline finns ingen växel, så de extra {extra} {unit} går till mottagaren.",
  "wallet.svc.no_single_mint":
    "Ingen enskild mint håller {amount} {unit}. Ecash från olika mintar går inte att slå ihop till ett token: slå ihop hos en mint först, eller skicka i separata belopp.",
  "wallet.svc.have_tried_send":
    "Du har {total} {unit} och försökte skicka {amount}.",
  "wallet.svc.invoice_needs":
    "Fakturan kräver {total} {unit} inklusive routingreserven, och du har {balance}.",
  "wallet.svc.nothing_to_move": "{mint} har ingen {unit} att flytta.",
  "wallet.svc.consolidate_memo": "Hopslagning från {mint}",
  "wallet.svc.cannot_size_detail":
    "Efter Lightning-routingavgifterna kan {from} inte flytta ett användbart belopp till {to}. Prova att flytta ett bestämt mindre belopp i stället.",
  "wallet.svc.mint_cannot": "{mint} kan inte {action}.",
  "wallet.svc.no_nut": "Minten annonserar inte NUT-{nut}.",
  "wallet.svc.unknown_mint": "Betalningen uppger en mint du inte använder.",
  "wallet.svc.unknown_mint_body":
    "Lägg till minten själv om du litar på den; inget löses in hos en mint du inte har valt.",
  "wallet.svc.no_relay": "ingen reläanslutning",
  "wallet.svc.no_shared_mint": "ingen gemensam mint med tillräckligt saldo",
  "wallet.svc.no_nutzap_info":
    "mottagaren har inte publicerat nutzapuppgifter (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Låst till deras nyckel men ännu inte levererat. Dela tokenet från den här transaktionen för att slutföra den.",
  "wallet.svc.swap_lost":
    "Minten slutförde aldrig bytet, så inget gavs ut mot det.",
  "wallet.svc.swap_unreadable":
    "Bytet sparades i en form som den här versionen inte kan spela upp igen.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Verifierad via QR",
  "contacts.qr.keys_unverified": "Nycklar mottagna, inte verifierade",
  "contacts.qr.not_verified": "Inte verifierad än",
  "contacts.qr.message": "Meddelande",
  "contacts.qr.add": "Lägg till kontakt",
  "contacts.qr.scan_title": "Skanna QR-kod",
  "contacts.qr.aim": "Rikta kameran mot deras QR-kod",
  "contacts.qr.add_desc": "Nå någon som inte är i närheten på meshen.",
  "contacts.qr.peer_id_hint":
    "Ett peer-ID är 16 tecken. En kontaktkod börjar med airhop:.",
  "contacts.qr.or_scan": "eller skanna deras QR",
  "contacts.qr.trust_note":
    "Bara en QR du skannar med kameran verifierar deras nyckel. En inklistrad kod bär deras nycklar men inget bevis på att den kom från dem.",
  "contacts.qr.peer_id": "Peer-ID eller kontaktkod",
  "contacts.qr.peer_id_placeholder": "Klistra in ett ID eller en kontaktkod",
  "contacts.qr.scan_camera_a11y": "Skanna QR-kod med kameran",
  "contacts.qr.scan_camera_desc": "Använd kameran",
  "contacts.qr.upload_a11y": "Ladda upp en QR-bild från galleriet",
  "contacts.qr.upload": "Ladda upp från galleriet",
  "contacts.qr.upload_desc": "Välj en sparad QR-bild",
  "contacts.qr.scan_a11y": "Lägg till kontakt genom att skanna en QR-kod",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Klistra in ett peer-ID på 16 tecken, en airhop://peer/…-länk eller en kontaktkod.",
  "contacts.scan.camera_label": "Kameraåtkomst",
  "contacts.scan.camera_purpose": "skanna en kontakts QR-kod",
  "contacts.scan.camera_needed":
    "Kameraåtkomst krävs för att skanna. Du kan fortfarande lägga till via peer-ID.",
  "contacts.scan.camera_failed":
    "Kameran kunde inte startas. Stäng andra kameraappar och försök igen.",
  "contacts.scan.photo_label": "Fotoåtkomst",
  "contacts.scan.photo_purpose": "skanna en QR-kod du har sparat",
  "contacts.scan.photo_needed":
    "Fotoåtkomst krävs för att välja en bild. Du kan fortfarande lägga till via peer-ID.",
  "contacts.scan.no_qr": "Ingen Airhop-QR-kod hittades i bilden.",
  "contacts.scan.unreadable": "Ingen QR-kod kunde läsas ur bilden.",
  "contacts.scan.bitchat_expired":
    "Den bitchat-koden har gått ut. Be dem öppna sin QR igen.",
  "contacts.scan.tampered":
    "QR-koden är ogiltig: dess peer-ID stämmer inte med nycklarna. Den kan ha manipulerats.",
  "contacts.scan.already_added": "Finns redan bland dina kontakter",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Väntar på kameraåtkomst…",
  "contacts.verify.camera_off": "Kameran är av",
  "contacts.verify.open_settings": "Öppna Inställningar",
  "contacts.verify.verified": "Verifierad",
  "contacts.verify.different": "En annan kontakt",
  "contacts.verify.scan_again": "Skanna igen",
  "contacts.verify.failed": "Kunde inte verifiera",
  "contacts.verify.done": "Klar",
  "contacts.verify.title": "Verifiera {name}",
  "contacts.verify.aim": "Rikta kameran mot deras QR-kod",
  "contacts.verify.camera_off_body":
    "Slå på kameraåtkomst i Inställningar för att verifiera med QR.",
  "contacts.verify.match_body":
    "{name}s nyckel stämmer. Du kan lita på den här kontakten.",
  "contacts.verify.different_body":
    "Den här QR-koden tillhör någon annan. Be {name} visa sin egen kod.",
  "contacts.verify.tampered_body":
    "QR-koden ser manipulerad ut: dess ID stämmer inte med nyckeln.",
  "contacts.verify.choose_title": "Hur vill du kontrollera?",
  "contacts.verify.choose_body":
    "Båda bekräftar att nycklarna på den här telefonen verkligen tillhör {name}.",
  "contacts.verify.method_scan": "Skanna deras kod",
  "contacts.verify.method_scan_sub": "De är här hos dig",
  "contacts.verify.method_compare": "Jämför en kod",
  "contacts.verify.method_compare_sub": "Läs den för varandra i ett samtal",
  "contacts.verify.no_keys":
    "Inga nycklar för den här kontakten än. Skriv till dem, eller skanna deras kod när ni ses.",
  "contacts.verify.compare_title": "Läs dessa för varandra",
  "contacts.verify.compare_body":
    "{name} ser samma sex ord. Om de stämmer vet ni båda att nycklarna är äkta.",
  "contacts.verify.codes_match": "De stämmer",
  "contacts.verify.codes_differ": "De stämmer inte",
  "contacts.verify.compared_body":
    "Du och {name} bekräftade samma kod. Kontakten är verifierad.",

  // ---- Settings: shared chrome ----
  "settings.back": "Tillbaka",
  "settings.coming_soon": "Kommer snart",
  "settings.opens_externally": "{label}, öppnas utanför appen",
  "settings.peer_id": "Peer-ID",
  "settings.share_peer_id": "Dela ditt peer-ID",
  "settings.share_id_short": "Dela ID",
  "settings.peer_id_sheet.title": "Ditt peer-ID",
  "settings.peer_id_sheet.copy": "Kopiera peer-ID",
  "settings.peer_id_sheet.note":
    "Det här fungerar bara när ni båda är inom Bluetooth-räckhåll. Dela din QR-kod i stället om du vill kunna nås var som helst ifrån.",
  "settings.search.placeholder": "Sök i inställningar…",
  "settings.search.a11y": "Sök i inställningar",
  "settings.search.close": "Stäng sökningen",
  "settings.search.clear": "Rensa sökningen",
  "settings.search.hint":
    "Hitta vilken inställning som helst på namn, var den än finns.",
  "settings.search.no_results": "Inga inställningar för ”{query}”",

  // ---- Settings: hub rows ----
  "settings.section.general": "Allmänt",
  "settings.section.general_desc":
    "Valfria funktioner, ångra sändning, media, återställning",
  "settings.section.privacy": "Integritet och säkerhet",
  "settings.section.privacy_desc":
    "Forward secrecy, signerade paket, blockerade peers",
  "settings.section.network": "Nätverk och reläer",
  "settings.section.network_desc":
    "Internet som reserv, nostr-reläer, bitchat-kompatibilitet",
  "settings.section.permissions": "Behörigheter",
  "settings.section.permissions_desc":
    "Bluetooth, plats, aviseringar, kamera, mikrofon",
  "settings.section.storage": "Lagring och data",
  "settings.section.diagnostics": "Diagnostik",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transporter",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "I närheten",
  "settings.group.sync": "Synk",
  "settings.group.features": "Funktioner",
  "settings.group.messages": "Meddelanden",
  "settings.group.local": "Lokalt",
  "settings.group.media": "Media",
  "settings.group.reset": "Återställning",
  "settings.group.always_on": "Alltid på",
  "settings.group.notifications": "Aviseringar",
  "settings.group.blocked": "Blockerade",
  "settings.group.theme": "Tema",
  "settings.group.font": "Teckensnitt",
  "settings.group.language": "Språk",
  "settings.section.diagnostics_desc":
    "Anslutningsstatus och enheter i närheten",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Bluetooth-länkar",
  "settings.diag.ble_links_desc":
    "Enheter som telefonen är direkt ansluten till",
  "settings.diag.lan": "Lokalt nätverk",
  "settings.diag.lan_desc": "Telefoner i samma wifi-nätverk",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Telefon till telefon utan router",
  "settings.diag.wifi_active": "Igång",
  "settings.diag.wifi_unsupported": "Stöds inte på den här enheten",
  "settings.diag.wifi_permission": "Blockerat av en behörighet",
  "settings.diag.wifi_unavailable": "Inte tillgängligt just nu",
  "settings.diag.wifi_unpaired": "Inget parkopplat",
  "settings.diag.wifi_unknown": "Väntar på radion",
  "settings.diag.relays": "Nostr-reläer",
  "settings.diag.relays_desc":
    "Används för platskanaler och räckvidd över internet",
  "settings.diag.connected": "Ansluten",
  "settings.diag.disconnected": "Inte ansluten",
  "settings.diag.peer_direct": "Direktlänk",
  "settings.diag.peer_relayed": "Hörd via en annan enhet",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Ingen signalavläsning",
  "settings.diag.no_peers": "Ingen inom räckhåll",
  "settings.diag.no_peers_desc": "{links} radiolänk(ar) öppna",
  "settings.diag.gcs_size": "Filterstorlek",
  "settings.diag.gcs_size_desc": "Största synkfilter som skickats ut",
  "settings.diag.fpr": "Andel falska träffar",
  "settings.diag.fpr_desc":
    "Hur ofta filtret påstår att vi har ett paket vi saknar",
  "settings.diag.bytes": "{n} byte",
  "settings.diag.footnote":
    "Inget här går att ändra. Värdena är låsta för att Airhop ska förbli kompatibelt med bitchat.",
  "settings.section.storage_desc": "Användning och cache",
  "settings.section.appearance": "Utseende",
  "settings.section.appearance_desc": "Tema, teckensnitt och språk",
  "settings.section.help": "Hjälp och synpunkter",
  "settings.section.help_desc":
    "Kontakta oss, rapportera en bugg eller läs vanliga frågor",
  "settings.section.support": "Stöd",
  "settings.section.support_desc": "Hjälp till att hålla utvecklingen igång",
  "settings.section.about": "Om",
  "settings.section.about_desc": "Version, ändringslogg och källkod",

  // ---- Settings: general ----
  "settings.general.undo": "Ångra sändning",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Plånbok",
  "settings.general.undo_seconds": "{count} sekunder",
  "settings.general.undo_a11y": "Ångra sändning: {value}",
  "settings.general.quality_a11y": "Ställ in uppladdningskvalitet på {value}",
  "settings.general.undo_desc":
    "Håll kvar ett skickat meddelande en kort stund så att du hinner ta tillbaka det innan det går iväg",
  "settings.general.undo_off_desc": "Skicka direkt, ingen ångring",
  "settings.general.undo_2": "2 sekunder",
  "settings.general.undo_2_desc": "En snabb chans att ta tillbaka det",
  "settings.general.undo_10": "10 sekunder",
  "settings.general.undo_10_desc": "Det längsta fönstret",
  "settings.general.quality": "Uppladdningskvalitet",
  "settings.general.quality_desc":
    "Gäller foton som skickas från kameran eller biblioteket. Varje foto anpassas till meshen oavsett.",
  "settings.general.quality_low": "Låg",
  "settings.general.quality_low_desc": "Minsta foton, snabbast att skicka",
  "settings.general.quality_medium": "Medel",
  "settings.general.quality_medium_desc": "Balans mellan detaljer och snabbhet",
  "settings.general.quality_high": "Hög",
  "settings.general.quality_high_desc": "Behåller mest detaljer",
  "settings.general.feature_wallet_desc":
    "Skicka Cashu-ecash direkt mellan enheter över meshen",
  "settings.general.feature_wallet_a11y": "Plånbok (alltid på)",
  "settings.general.feature_ai_desc":
    "Privat assistent på enheten, inga nätverksanrop",
  "settings.general.feature_feeds": "Flöden",
  "settings.general.feature_feeds_desc":
    "Läs och posta i flöden på Bluesky och Mastodon",
  "settings.general.show_media": "Visa media automatiskt",
  "settings.general.show_media_desc":
    "Foton och videor visas i chatten, eller ligger kvar bakom en tryckning",
  "settings.general.reset": "Återställ inställningar",
  "settings.general.media_retention": "Behåll media i",
  "settings.general.media_retention_desc":
    "Foton, videor och röstmeddelanden raderas efter den valda tiden",
  "settings.general.media_retention_sheet":
    "Välj hur länge media ligger kvar på enheten. Raderad media går inte att få tillbaka.",
  "settings.general.retention_7_desc":
    "Minst kvar efteråt. Bäst om telefonen själv är risken.",
  "settings.general.retention_14_desc":
    "En medelväg för en eller två veckor utan täckning.",
  "settings.general.retention_30_desc":
    "Håller trådarna läsbara längst, och tar mest plats på disken.",
  "settings.general.reset_desc":
    "Sätter tillbaka varje inställning till sitt standardvärde, medan identitet, meddelanden, kontakter och plånbok lämnas orörda",
  "settings.general.reset_title": "Återställa inställningarna?",
  "settings.general.reset_body":
    "Varje inställning går tillbaka till sitt standardvärde: utseende, ångra sändning och uppkoppling (internet, Tor, gateway, brygga, reläer). Din identitet, dina meddelanden, dina kontakter och din plånbok är orörda.",
  "settings.general.reset_confirm": "Återställ",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet är alltid på för direktmeddelanden",
  "settings.security.signed_packets": "Signerade paket",
  "settings.security.signed_packets_desc": "Varje paket är Ed25519-signerat",
  "settings.security.hide_previews": "Dölj förhandsvisning i aviseringar",
  "settings.security.hide_previews_desc":
    "Håller avsändaren och meddelandet borta från låsskärmen, som annars visar dem utan upplåsning",
  "settings.security.no_blocked": "Inga blockerade peers",
  "settings.security.no_blocked_desc":
    "Blockerade peers kan inte skriva till dig och syns inte under Mesh",
  "settings.security.unblock_title": "Avblockera den här peern",
  "settings.security.unblock": "Avblockera",
  "settings.security.unblock_peer": "Avblockera {name}",
  "settings.security.unblock_body":
    "{name} kommer att kunna skriva till dig igen och dyker upp under Mesh när hen är i närheten.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Internet som reserv",
  "settings.network.internet_desc":
    "Fortsätt över Nostr-reläer när meshpeers är utom räckhåll",
  "settings.network.internet_off_title": "Stänga av internet?",
  "settings.network.internet_off_body":
    "Airhop kör bara på Bluetooth. Appen slutar kontakta alla Nostr-reläer, och Tor, internetgatewayen och meshbryggan stängs av. Bluetooth-chatt i närheten fungerar som vanligt.",
  "settings.network.turn_off": "Stäng av",
  "settings.network.discovery": "Geo-reläsökning",
  "settings.network.discovery_desc":
    "Välj automatiskt de närmaste reläerna för en platscell bland 300+ utspridda reläer",
  "settings.network.discovery_needs_relay": "Lägg till ett eget relä först",
  "settings.network.discovery_needs_relay_body":
    "Automatisk sökning är det som pekar Airhop mot de närmaste reläerna. Att stänga av den blir vettigt först när du har fäst egna reläer nedan, så lägg till minst ett först.",
  "settings.network.custom_only_title": "Använda bara dina egna reläer?",
  "settings.network.custom_only_body":
    "Platskanaler och meshbryggan slutar välja de närmaste reläerna automatiskt och använder bara dem du har lagt till. Det kan minska räckvidden, och du kan sluta möta bitchat-användare, som samlas på de närmaste reläerna.",
  "settings.network.custom": "Egna reläer",
  "settings.network.custom_desc":
    "Lägg till egna reläer för platskanaler och meshbryggan",
  "settings.network.custom_added": "{count} av {max} tillagda",
  "settings.network.dm_relays": "Meddelandereläer",
  "settings.network.dm_relays_desc":
    "Direktmeddelanden och privata kanaler använder alltid dessa. Egna reläer ändrar dem inte.",
  "settings.network.discovery_back_on": "Geo-reläsökning på igen",
  "settings.network.discovery_back_on_body":
    "Det var ditt sista egna relä. Platskanaler behöver någonstans att publicera, så Airhop väljer de närmaste reläerna automatiskt igen.",
  "settings.network.add_relay": "Lägg till relä",
  "settings.network.remove_relay": "Ta bort {url}",
  "settings.network.add_short": "Lägg till",
  "settings.network.relay_limit":
    "Du kan lägga till {count} reläer. Ta bort ett för att lägga till ett annat.",
  "settings.network.relay_duplicate": "Det reläet finns redan i din lista.",
  "settings.network.relay_invalid":
    "Ange en giltig relävärd, t.ex. relay.example.com. En port behövs bara om reläet inte använder standardporten. IP-adresser och lokala namn är inte tillåtna.",
  "settings.network.lan": "Lokalt nätverk",
  "settings.network.lan_desc":
    "Nå personer på samma WiFi, även mellan iPhone och Android. Andra enheter i nätverket kan se att du kör Airhop.",
  "settings.network.lan_searching": "Inga Airhop-enheter i det här nätverket",
  "settings.network.lan_active": "Ansluten i det här nätverket",
  "settings.network.lan_unavailable": "Inte på ett WiFi-nätverk",
  "settings.network.lan_permission":
    "Åtkomst till lokalt nätverk är avstängd för Airhop",
  "settings.network.lan_unsupported": "Inte tillgängligt på den här enheten",
  "settings.network.lan_foreground":
    "Pausar när Airhop är i bakgrunden. Bluetooth fortsätter.",
  "settings.network.wifi_pair": "Parkoppling",
  "settings.network.wifi_paired": "Parkopplade enheter",
  "settings.network.wifi_pair_find": "Hitta en enhet",
  "settings.network.wifi_pair_find_desc":
    "Leta efter en iPhone i närheten som visar sig. Båda behöver iOS 26 eller senare.",
  "settings.network.wifi_pair_show": "Visa den här iPhone",
  "settings.network.wifi_pair_show_desc":
    "Låt en iPhone i närheten hitta den här. En letar, den andra visar sig, samtidigt.",
  "settings.network.wifi_pair_find_action": "Välj en iPhone i närheten",
  "settings.network.wifi_pair_show_action": "Gör den här iPhone upptäckbar",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware är inte tillgängligt just nu",
  "settings.network.wifi_pair_forget":
    "Ta bort en parkoppling i appen Settings",
  "settings.network.bitchat": "bitchat-kompatibilitet",
  "settings.network.bitchat_desc":
    "Samma BLE-mesh som bitchat, fullt driftskompatibel. Detta är alltid på och går inte att stänga av.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Kör i bakgrunden",
  "settings.conn.background_desc": "Håll meshen igång när Airhop är stängt",
  "settings.conn.background_on_title": "Hålla meshen igång?",
  "settings.conn.background_on_body":
    "Airhop fortsätter skicka vidare och ta emot när appen är stängd, så meddelanden kommer fram medan du är borta. Android visar en pågående avisering under tiden.",
  "settings.conn.background_off_title": "Stoppa meshen när Airhop stängs?",
  "settings.conn.background_off_body":
    "Meddelanden kommer bara fram medan Airhop är öppet, och telefonen slutar skicka vidare åt folk i närheten. Den pågående aviseringen försvinner.",
  "settings.conn.live_voice": "Direktröst",
  "settings.conn.live_voice_desc":
    "Prata med folk i närheten som med en walkie-talkie",
  "settings.conn.live_voice_on_title": "Slå på direktröst?",
  "settings.conn.live_voice_on_body":
    "Att hålla in mikrofonen skickar din röst till alla inom Bluetooth-räckhåll medan du talar, och deras röst spelas upp i din telefon. Inget spelas in.",
  "settings.conn.live_voice_off_title": "Stänga av direktröst?",
  "settings.conn.live_voice_off_body":
    "Att hålla in mikrofonen spelar in ett röstmeddelande i stället. Det skickas när du släpper, och ingen hör det förrän de spelar upp det.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor-routing",
  "settings.conn.tor_desc":
    "Skicka Nostr-trafik genom Tor för extra integritet",
  "settings.conn.tor_on_title": "Skicka Nostr-trafik genom Tor?",
  "settings.conn.tor_on_body":
    "Reläer slutar se din IP-adress. Det tar längre tid att ansluta och meddelanden kommer fram långsammare. Bluetooth påverkas inte.",
  "settings.conn.tor_off_title": "Stänga av Tor-routing?",
  "settings.conn.tor_off_body":
    "Nostr-trafiken går tillbaka över din vanliga uppkoppling, så reläerna ser din IP-adress igen. Bluetooth påverkas inte i något av fallen.",
  "settings.conn.tor_unavailable":
    "Tor-routing finns inte i den här versionen.",
  "settings.conn.tor_timeout":
    "Tor tar mer än en minut på sig att ansluta. Det förblir påslaget och fortsätter försöka; Mesh-fliken säger till när trafiken dirigeras om, eller om nätverket blockerar det.",
  "settings.conn.tor_failed":
    "Det gick inte att starta Tor. Försök igen om en stund.",
  "settings.tor.status": "Tor-status",
  "settings.tor.connection": "Anslutning",
  "settings.tor.mode_off": "Direkt",
  "settings.tor.mode_off_desc":
    "Ansluter direkt till Tor. Snabbast, men den som bevakar nätverket ser att du använder Tor.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Döljer att du använder Tor och fungerar där bryggor är blockerade. Långsammast att ansluta.",
  "settings.tor.mode_obfs4": "obfs4",
  "settings.tor.mode_obfs4_desc":
    "Döljer att du använder Tor. Snabbare än Snowflake, men dessa bryggor är offentliga och vissa nätverk blockerar dem.",
  "settings.tor.mode_webtunnel": "webtunnel",
  "settings.tor.mode_webtunnel_desc":
    "Döljer att du använder Tor genom att likna ett vanligt webbplatsbesök. Svårare att blockera än de andra.",
  "settings.tor.mode_custom": "Egna bryggor",
  "settings.tor.mode_custom_desc":
    "Använd obfs4-bryggrader från bridges.torproject.org. Prova detta när de andra inte fungerar.",
  "settings.tor.custom_placeholder": "Klistra in en bryggrad per rad",
  "settings.tor.custom_apply_hint": "Tryck utanför rutan för att ansluta.",
  "settings.tor.custom_empty": "Lägg först till minst en bryggrad.",
  "settings.tor.recovered":
    "Tor stängdes av eftersom starten inte slutfördes förra gången. Slå på det igen för att försöka på nytt.",
  "settings.conn.mint_clearnet": "Tillåt mint-trafik över öppna nätet",
  "settings.conn.mint_clearnet_desc":
    "Tor på iOS täcker bara Nostr. Lämna av för att blockera mint-förfrågningar; ecash över meshen fungerar oavsett.",
  "settings.conn.gateway": "Internetgateway",
  "settings.conn.gateway_desc":
    "Låna ut din uppkoppling till en offline-telefon i närheten så att den ändå når platskanalerna",
  "settings.conn.gateway_on_title": "Slå på internetgatewayen?",
  "settings.conn.gateway_on_body":
    "Telefoner i närheten utan egen uppkoppling skickar och tar emot platskanalsmeddelanden genom din. Det använder din mobildata och ditt batteri, och deras meddelanden förblir krypterade hela vägen, så du kan inte läsa det som passerar.",
  "settings.conn.gateway_off_title": "Stänga av internetgatewayen?",
  "settings.conn.gateway_off_body":
    "Offline-telefoner i närheten slutar nå platskanalerna genom din. Dina egna meddelanden påverkas inte.",
  "settings.conn.bridge": "Meshbrygga",
  "settings.conn.bridge_desc":
    "Länka det här områdets öppna #bluetooth-chatt med en annan Bluetooth-skara utom räckhåll över internet",
  "settings.conn.bridge_on_title": "Slå på meshbryggan?",
  "settings.conn.bridge_on_body":
    "Dina öppna #bluetooth-meddelanden publiceras till din stadsdel över internet, så folk bortom Bluetooth-räckhåll kan läsa dem. Privata meddelanden bryggas aldrig, och ”endast i närheten” håller ett enskilt meddelande lokalt.",
  "settings.conn.bridge_off_title": "Stänga av meshbryggan?",
  "settings.conn.bridge_off_body":
    "Dina öppna #bluetooth-meddelanden stannar inom Bluetooth-räckhåll igen, och meddelanden från den bryggade skaran slutar komma fram hit.",
  "settings.conn.bridge_needs_location": "Meshbryggan behöver plats",
  "settings.conn.bridge_needs_location_desc":
    "Den hittar din stadsdel utifrån en platsbestämning. Ge platsbehörighet för att börja brygga.",
  "settings.conn.grant_location": "Ge platsbehörighet",
  "settings.conn.grant_short": "Ge",
  "settings.conn.internet_off": "Internet är av",
  "settings.conn.internet_off_desc":
    "Tor, bryggan och gatewayen använder alla internet. Slå på Internet som reserv under Nätverk för att använda dem.",
  "settings.conn.turn_on": "Slå på",
  "settings.conn.turn_off": "Stäng av",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Hittar enheter i närheten och skickar meddelanden vidare mellan dem. Utan det kan meshen inte fungera.",
  "settings.permissions.location": "Plats",
  "settings.permissions.location_desc":
    "Öppnar områdeskanaler i närheten. Utan den förblir de kanalerna stängda, och Bluetooth-meshen fortsätter som vanligt.",
  "settings.permissions.notifications": "Aviseringar",
  "settings.permissions.notifications_desc":
    "Få aviseringar om nya meddelanden även när appen är stängd. Utan dem ser du dem först när du öppnar Airhop.",
  "settings.permissions.camera": "Kamera",
  "settings.permissions.camera_desc":
    "Skanna QR-koder och ta foton eller videor att skicka. Utan den kan du fortfarande dela media från biblioteket.",
  "settings.permissions.photos": "Foton",
  "settings.permissions.photos_desc":
    "Skicka foton från biblioteket och spara mottagen media. Utan den kan du fortfarande ta och skicka nya foton med kameran.",
  "settings.permissions.microphone": "Mikrofon",
  "settings.permissions.microphone_desc":
    "Spela in och skicka röstmeddelanden eller använda direktröst. Utan den fungerar varken röstmeddelanden eller direktröst.",
  "settings.permissions.allow": "Tillåt den här behörigheten",
  "settings.permissions.open_settings":
    "Öppna systeminställningarna för att ändra behörigheten",
  "settings.permissions.system": "System",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Nätverksanvändning",
  "settings.storage.storage_usage": "Lagringsanvändning",
  "settings.storage.storage_usage_desc":
    "Meddelanden, plånbokens bevis och cachade bilagor",
  "settings.storage.session_usage":
    "Den här sessionen · {sent} skickat, {received} mottaget",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} bilagor",
  "settings.storage.clear_cache": "Rensa bilagecachen",
  "settings.storage.clear": "Rensa",
  "settings.storage.clear_title": "Rensa cachad media?",
  "settings.storage.clear_body":
    "Foton, videor, röstmeddelanden och filer tas bort från enheten, både skickade och mottagna. De går inte att hämta igen: bubblorna säger till om det, och du kan be avsändaren skicka på nytt. Meddelanden och plånbok är orörda.",
  "settings.storage.cleared": "Cachen rensad",
  "settings.storage.freed": "Frigjorde {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Ställ in utseendet på {value}",
  "settings.font.set_a11y": "Ställ in det fasta teckensnittet på {value}",
  "settings.font.system": "System",
  "settings.font.system_desc": "Använder enhetens vanliga fasta teckensnitt",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Modernt och lättläst",
  "settings.language.en": "Engelska",
  "settings.language.am": "Amhariska",
  "settings.language.ar": "Arabiska",
  "settings.language.bn": "Bengaliska",
  "settings.language.my": "Burmesiska",
  "settings.language.zh_hans": "Kinesiska (förenklad)",
  "settings.language.zh_hant": "Kinesiska (traditionell)",
  "settings.language.nl": "Nederländska",
  "settings.language.fil": "Filippinska",
  "settings.language.fr": "Franska",
  "settings.language.ka": "Georgiska",
  "settings.language.de": "Tyska",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesiska",
  "settings.language.it": "Italienska",
  "settings.language.ja": "Japanska",
  "settings.language.ko": "Koreanska",
  "settings.language.mg": "Malagassiska",
  "settings.language.ms": "Malajiska",
  "settings.language.ne": "Nepalesiska",
  "settings.language.fa": "Persiska",
  "settings.language.pl": "Polska",
  "settings.language.pt_br": "Portugisiska (Brasilien)",
  "settings.language.pt_pt": "Portugisiska (Portugal)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Ryska",
  "settings.language.es": "Spanska",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Svenska",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thailändska",
  "settings.language.tr": "Turkiska",
  "settings.language.uk": "Ukrainska",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamesiska",
  "settings.language.pseudo": "Pseudospråk",
  "settings.language.soon": "Kommer snart",
  "settings.language.soon_a11y": "{value}, kommer snart",
  "settings.language.set_a11y": "Ställ in språket på {value}",
  "settings.language.pending": "Vid nästa öppning",
  "settings.language.pending_a11y":
    "{value}, tillämpas nästa gång du öppnar Airhop",
  "settings.language.rtl_restart": "Öppna igen nu",
  "settings.language.rtl_title": "Öppna Airhop igen för att slutföra",
  "settings.language.rtl_body":
    "{value} läses från höger till vänster, och Airhop kan bara byta riktning när appen startar. Stäng den och öppna den igen för att slutföra bytet. Inget går förlorat, och din mesh förblir ansluten tills du gör det.",
  "settings.theme.light": "Ljust",
  "settings.theme.light_desc": "Använd alltid den ljusa paletten",
  "settings.theme.dark": "Mörkt",
  "settings.theme.dark_desc": "Använd alltid den mörka paletten",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Synlig, annonserar och skannar",
  "settings.status.away": "Borta",
  "settings.status.away_desc": "Meshen pausad, skannar eller annonserar inte",
  "settings.status.invisible": "Osynlig",
  "settings.status.invisible_desc": "Skannar, men syns inte för andra",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Ställ in statusen på {value}",
  "settings.status.edit": "Ändra status",
  "settings.status.desc": "Välj hur synlig du är på meshen.",
  "settings.transfer.identity": "Identitet och nycklar",
  "settings.transfer.identity_desc":
    "Ditt peer-ID, ditt användarnamn och dina kontakter",
  "settings.transfer.chats": "Chattar och historik",
  "settings.transfer.chats_desc":
    "Konversationer, grupper och kanalerna du har gått med i",
  "settings.transfer.wallet": "Plånbokssaldo",
  "settings.transfer.wallet_desc": "Cashu-bevis och transaktionshistorik",
  "settings.transfer.title": "Flytta till en ny telefon",
  "settings.transfer.desc":
    "Flytta din identitet, dina chattar och din plånbok till en annan enhet",
  "settings.transfer.coming_soon_a11y":
    "Flytta till en ny telefon, kommer snart",
  "settings.transfer.body":
    "Håll telefonerna mot varandra och flytta över allt via Bluetooth. Inget passerar en server, så det fungerar utan internet.",
  "settings.qr.permission_label": "Fotoåtkomst",
  "settings.qr.permission_purpose": "spara din QR-kod",
  "settings.qr.saved": "Sparad",
  "settings.qr.saved_body": "QR-koden sparades i ditt fotobibliotek.",
  "settings.qr.save_failed": "Kunde inte spara",
  "settings.qr.save_failed_body": "QR-koden kunde inte sparas. Försök igen.",
  "settings.qr.share_message": "Lägg till mig på Airhop",
  "settings.qr.share_body":
    "Lägg till mig på Airhop — privata meshmeddelanden som fungerar offline först.",
  "settings.qr.show_short": "Visa QR",
  "settings.qr.title": "Din QR-kod",
  "settings.qr.note":
    "Den innehåller dina publika nycklar, som låter andra skriva till dig var som helst ifrån. Dela den bara med folk du litar på. Den ändras inte om du inte rensar din identitet.",
  "settings.qr.code_label": "Kontaktkod",
  "settings.qr.copy_code": "Kopiera kontaktkod",
  "settings.qr.share": "Dela QR-kod",
  "settings.qr.share_short": "Dela QR",
  "settings.qr.download": "Ladda ned QR-kod",
  "settings.qr.download_short": "Ladda ned QR",
  "settings.qr.show": "Visa QR-kod",
  "settings.wipe.trigger": "Utlös panikrensning",
  "settings.wipe.trigger_desc":
    "Tryck tre gånger för att rensa direkt utan att bekräfta",
  "settings.wipe.title": "Panikrensning",
  "settings.wipe.now": "Rensa nu",
  "settings.wipe.desc":
    "Förstör omedelbart alla nycklar, meddelanden och bevis",
  "settings.wipe.body":
    "Detta förstör omedelbart alla dina nycklar, meddelanden och plånboksbevis. Det går inte att ångra.",
  "settings.wipe.in_progress": "Rensar",
  "settings.wipe.in_progress_body":
    "Förstör dina nycklar, meddelanden och filer. Det tar några sekunder och slutförs av sig självt även om appen stängs.",
  "settings.wipe.got_it": "Uppfattat",
  "settings.wipe.keys_failed": "Nycklarna kunde inte förstöras",
  "settings.wipe.keys_failed_body":
    "Dina meddelanden, kontakter och din plånbok är borta, men enheten vägrade släppa dina nycklar. Lås upp enheten och rensa igen.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Kontakta oss",
  "settings.help.contact_a11y": "Mejla {address}",
  "settings.help.bug": "Rapportera en bugg",
  "settings.help.bug_desc": "Öppna ett ärende på GitHub",
  "settings.help.bug_a11y": "Rapportera en bugg på GitHub",
  "settings.help.faq": "Vanliga frågor",
  "settings.help.faq_desc": "Svar på vanliga frågor",
  "settings.help.faq_a11y": "Öppna vanliga frågor",
  "settings.help.terms_desc": "Hur Airhop får användas",
  "settings.help.terms_a11y": "Öppna användarvillkoren",
  "settings.help.privacy_desc": "Vad vi inte samlar in",
  "settings.help.privacy_a11y": "Öppna integritetspolicyn",

  // ---- Settings: support ----
  "settings.support.card": "Kort eller UPI",
  "settings.support.card_desc": "Internetbank och plånböcker, världen över",
  "settings.support.card_a11y":
    "Stöd med kort, UPI, internetbank eller plånbok",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Månadsvis eller en gång, ingen plattformsavgift",
  "settings.support.sponsors_a11y": "Stöd via GitHub Sponsors",
  "settings.support.note":
    "Jag bygger Airhop på fritiden. Det finns inga investerare och inga annonser. Om appen är till nytta för dig räcker ett bidrag långt för att hålla utvecklingen igång. Varje funktion förblir gratis oavsett.",

  // ---- Settings: about and version ----
  "settings.about.version": "Version",
  "settings.about.version_desc": "Nuvarande utgåva",
  "settings.about.version_a11y": "Visa versionen och sök efter uppdateringar",
  "settings.about.release_notes": "Versionsinformation",
  "settings.about.release_notes_desc": "Nyheterna i den senaste utgåvan",
  "settings.about.release_notes_a11y":
    "Öppna den senaste versionsinformationen på GitHub",
  "settings.about.source": "Källkod",
  "settings.about.source_a11y": "Öppna källkoden på GitHub",
  "settings.about.licenses": "Licenser för öppen källkod",
  "settings.about.open_repo": "Öppna arkivet {name}",
  "settings.about.licenses_desc": "Tredjepartspaket med öppen källkod",
  "settings.about.licenses_a11y": "Visa tredjepartslicenser",
  "settings.version.codename": "Kodnamn",
  "settings.version.checking": "Söker",
  "settings.version.check": "Sök efter uppdateringar",
  "settings.version.checking_title": "Söker efter uppdateringar",
  "settings.version.up_to_date": "Du har den senaste versionen.",
  "settings.version.release_notes": "Visa versionsinformation",
  "settings.version.made_with": "Gjord med",
  "settings.version.number": "Version {version}",
  "settings.version.update_to": "Uppdatera till {version}",
  "settings.version.update_to_a11y": "Uppdatera till version {version}",
  "settings.version.released_under": "Utgiven under {license}",
  "settings.version.notes_a11y":
    "Visa versionsinformation för version {version}",
  "settings.version.tor_paused":
    "Uppdateringskontrollen är pausad medan Tor är på, så den inte kan läcka din IP. Titta på utgåvesidan i en webbläsare.",
  "settings.version.check_failed":
    "Kunde inte söka efter uppdateringar. Kontrollera din uppkoppling och försök igen.",
  "settings.version.downloading": "Laddar ner {percent}%",
  "settings.version.install": "Installera",
  "settings.version.download_failed":
    "Nedladdningen misslyckades. Kontrollera din anslutning och försök igen.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} är {size} KiB, över gränsen på {cap} KiB.",
  "transfer.failed.malformed":
    "En bilaga kom fram skadad och kunde inte öppnas. Be dem skicka den igen.",
  "transfer.failed.unsupported_type":
    "En bilaga kom i ett format som appen inte kan öppna.",
  "transfer.failed.type_mismatch":
    "En bilaga avvisades: innehållet stämmer inte med filtypen den uppgav.",
  "transfer.failed.storage":
    "En bilaga kom fram men kunde inte sparas. Kontrollera det lediga utrymmet.",
  "transfer.badge.waiting": "Väntar · {name}",
  "transfer.badge.active_count": "{count} överföringar",
  "transfer.badge.sending": "Skickar {name}",
  "transfer.badge.receiving": "Tar emot {name}",
  "transfer.badge.a11y": "{label}, {percent} procent. Öppna konversationen.",
  "transfer.kind.photo": "Foto",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Röstmeddelande",
  "transfer.this.photo": "Det här fotot",
  "transfer.this.video": "Den här videon",
  "transfer.this.voice": "Det här röstmeddelandet",
  "transfer.this.file": "Den här filen",
  "transfer.kind.document": "Dokument",
  "transfer.kind.voice_preview": "Röstmeddelande",
  "transfer.kind.photo_preview": "Foto",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Dokument",

  // ---- System notifications ----
  "notif.channel.messages": "Meddelanden",
  "notif.channel.nearby": "Peers i närheten",
  "notif.channel.nearby_desc":
    "En notering då och då när meshen hittar folk inom Bluetooth-räckhåll.",
  "notif.nearby.body":
    "Inom Bluetooth-räckhåll nu. Tryck för att öppna meshen.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Någon",
  "notif.notice_urgent": "Brådskande anslag · {content}",
  "notif.notice": "Anslag · {content}",
  "notif.incoming_file": "Inkommande fil",
  "notif.preview.photo": "📷 Foto",
  "notif.preview.voice": "🎤 Röstmeddelande",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Dokument",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Nytt meddelande",
  "notif.hidden.channel": "Ny aktivitet",
  "notif.hidden.mention": "Du blev omnämnd",
  "notif.mention.title": "{sender} nämnde dig",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Visa {count} till",
    other: "Visa {count} till",
  },
  "chat.channels.show_more_a11y": {
    one: "Visa {count} standardkanal till",
    other: "Visa {count} standardkanaler till",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} oläst",
    other: "{label}, {count} olästa",
  },
  "a11y.new_count": {
    one: "{label}, {count} ny",
    other: "{label}, {count} nya",
  },
  "chat.a11y.unread": {
    one: "{count} oläst",
    other: "{count} olästa",
  },
  "chat.thread.length_left": {
    one: "{count} kvar",
    other: "{count} kvar",
  },
  "settings.general.retention_days": {
    one: "{count} dag",
    other: "{count} dagar",
  },
  "chat.info.group_reach": {
    one: "{reachable} av {count} medlem nåbar",
    other: "{reachable} av {count} medlemmar nåbara",
  },
  "chat.group_members": {
    one: "Privat grupp  ·  {count} medlem",
    other: "Privat grupp  ·  {count} medlemmar",
  },
  "chat.select.count": {
    one: "{count} vald",
    other: "{count} valda",
  },
  "chat.select.forward": {
    one: "Vidarebefordra {count} meddelande",
    other: "Vidarebefordra {count} meddelanden",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} talar",
    other: "{count} talar",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} peer inom räckhåll",
    other: "{count} peers inom räckhåll",
  },
  "mesh.peer.hops_away": {
    one: "{count} hopp bort",
    other: "{count} hopp bort",
  },
  "chat.presence.active": {
    one: "{count} aktiv",
    other: "{count} aktiva",
  },
  "chat.presence.nearby": {
    one: "{count} i närheten",
    other: "{count} i närheten",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mint",
    other: "{count} mintar",
  },
  "wallet.mint.remove_body": {
    one: "{mint} håller {balance} {unit} i {count} bevis. Att ta bort den raderar det beviset från enheten för gott, och det finns ingen säkerhetskopia. Ta ut eller skicka saldot först.",
    other:
      "{mint} håller {balance} {unit} i {count} bevis. Att ta bort den raderar de bevisen från enheten för gott, och det finns ingen säkerhetskopia. Ta ut eller skicka saldot först.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} insättning väntar på betalning. Kontrolleras på nytt varje gång appen öppnas.",
    other:
      "{count} insättningar väntar på betalning. Kontrolleras på nytt varje gång appen öppnas.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Återställde {count} obrukat bevis från {mints}.",
    other: "Återställde {count} obrukade bevis från {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "{count} mynt hittades men var redan förbrukat, så inget krediterades för det. Det är normalt: varje mynt du någonsin har gjort av med finns kvar i mintens register.",
    other:
      "{count} mynt hittades men var redan förbrukade, så inget krediterades för dem. Det är normalt: varje mynt du någonsin har gjort av med finns kvar i mintens register.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Visa {count} till",
    other: "Visa {count} till",
  },
  "wallet.activity.show_more_a11y": {
    one: "Visa {count} betalning till",
    other: "Visa {count} betalningar till",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} obekräftad",
    other: "{count} obekräftade",
  },
  "wallet.proof_count": {
    one: "{count} bevis",
    other: "{count} bevis",
  },
  "wallet.spent_removed_detail": {
    one: "{count} bevis var redan förbrukat och har tagits bort.",
    other: "{count} bevis var redan förbrukade och har tagits bort.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Någon i närheten",
    other: "{count} personer i närheten",
  },
};

export const sv = { strings, plurals };
