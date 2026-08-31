// de: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Abbrechen",
  "common.done": "Fertig",
  "common.ok": "OK",
  "common.close": "Schließen",
  "common.back": "Zurück",
  "common.delete": "Löschen",
  "common.remove": "Entfernen",
  "common.add": "Hinzufügen",
  "common.copy": "Kopieren",
  "common.copied": "Kopiert",
  "common.share": "Teilen",
  "common.continue": "Weiter",
  "common.try_again": "Erneut versuchen",
  "common.settings": "Einstellungen",
  "common.off": "Aus",

  // ---- Dates ----
  "format.today": "Heute",
  "format.yesterday": "Gestern",
  "format.minutes_ago": "vor {count} Min.",
  "format.hours_ago": "vor {count} Std.",
  "format.days_ago": "vor {count} T.",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Chats",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Wallet",
  "nav.tab.profile": "Du",
  "a11y.tab.new_peers": "{label}, jemand Neues in der Nähe",
  "nav.notifications": "Mitteilungen",
  "chat.subtab.channels": "Kanäle",
  "chat.subtab.direct": "Direkt",
  "chat.subtab.dms": "Direktnachrichten",
  "chat.search.placeholder": "Chats durchsuchen…",
  "chat.search.a11y": "Chats und Nachrichten durchsuchen",
  "chat.search.close": "Suche schließen",
  "chat.search.clear": "Suche leeren",
  "mesh.view.radar": "Radaransicht",
  "mesh.view.list": "Listenansicht",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Liste",

  // ---- Legal document names ----
  "legal.last_updated": "Zuletzt aktualisiert: {date}",
  "legal.terms": "Nutzungsbedingungen",
  "legal.privacy": "Datenschutzerklärung",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Private Mesh-Kommunikation",
  "onboarding.welcome.cta": "Los geht’s",
  "onboarding.welcome.cta_hint":
    "Stimme den Bedingungen unten zu, um fortzufahren",
  "onboarding.welcome.consent_a11y":
    "Den Nutzungsbedingungen und der Datenschutzerklärung zustimmen",
  "onboarding.welcome.open_terms": "Nutzungsbedingungen öffnen",
  "onboarding.welcome.open_privacy": "Datenschutzerklärung öffnen",
  "onboarding.welcome.consent":
    "Mit dem Tippen auf {cta} stimmst du unseren {terms} und unserer {privacy} zu.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Deine Identität wird erstellt",
  "onboarding.identity.body":
    "Ein Ed25519-Schlüsselpaar wird auf diesem Gerät erzeugt.\nNichts wird irgendwohin gesendet.",
  "onboarding.identity.failed_heading":
    "Schlüssel konnten nicht erstellt werden",
  "onboarding.identity.failed_body":
    "Dieses Gerät hat Airhop nicht erlaubt, sie sicher zu speichern. Versuche es erneut, oder starte dein Telefon neu und öffne Airhop wieder.",
  "onboarding.identity.steps_a11y": "Schritte: {steps}",
  "onboarding.identity.step.x25519": "X25519-Schlüsselpaar wird erzeugt",
  "onboarding.identity.step.ed25519": "Ed25519-Signaturschlüssel wird erzeugt",
  "onboarding.identity.step.keychain":
    "Schlüssel werden im OS-Schlüsselbund gespeichert",
  "onboarding.identity.step.peer_id": "Peer-ID wird abgeleitet",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Dein Name im Mesh",
  "onboarding.username.peer_id": "Peer-ID",
  "onboarding.username.card_a11y":
    "Dein Name im Mesh ist {username}. Peer-ID {peerID}. {props}.",
  "onboarding.username.explanation":
    "Dieser Benutzername wird deterministisch aus deinem öffentlichen Schlüssel abgeleitet. Er ist auf jedem Gerät gleich, das deine Peer-ID sieht.",
  "onboarding.username.cta": "Airhop betreten",
  "onboarding.username.prop.algorithm": "Algorithmus",
  "onboarding.username.prop.storage": "Speicherung",
  "onboarding.username.prop.storage_value": "Nur OS-Schlüsselbund",
  "onboarding.username.prop.account": "Konto erforderlich",
  "onboarding.username.prop.account_value": "Keines",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Willkommen bei Airhop",
  "onboarding.hello.p1":
    "Hallo. Airhop baut auf bitchat auf und ist ein unabhängiges Open-Source-Nebenprojekt. Es steht in keiner Verbindung zum bitchat-Projekt oder zu permissionless tech und wird von ihnen auch nicht unterstützt, sondern ist einfach etwas, das ich gern baue und mit der Community teile.",
  "onboarding.hello.p2":
    "Dies ist die erste Version für iOS und Android. Ich habe sie mit Freunden getestet, trotzdem wirst du wahrscheinlich auf ein paar Fehler stoßen. Wenn das passiert, oder wenn du eine Idee für eine Funktion hast, höre ich gern von dir. Öffne ein Issue auf {github} oder schreib mir eine E-Mail an {email}.",
  "onboarding.hello.p3":
    "Wenn Airhop dir nützt, hinterlasse gern einen Stern auf {github} oder eine Bewertung im {store}. Das hilft mehr Menschen, das Projekt zu finden. Danke, dass du es ausprobierst!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Bevor dein Telefon fragt",
  "onboarding.primer.lede":
    "Hier steht, was jede Berechtigung tut und was nicht.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Findet Geräte in der Nähe und leitet Nachrichten zwischen ihnen weiter. Das bildet das Mesh und funktioniert ohne Internetverbindung.",
  "onboarding.primer.location.title": "Standort",
  "onboarding.primer.location.body":
    "Ordnet dich Kanälen in deiner Umgebung zu, vom Häuserblock bis zur Region. Airhop verfolgt dich nie und sendet deinen genauen Standort nie von deinem Gerät weg.",
  "onboarding.primer.notifications.title": "Mitteilungen",
  "onboarding.primer.notifications.body":
    "Erhalte Hinweise auf neue Nachrichten, auch wenn die App geschlossen ist. Mitteilungen entstehen lokal auf deinem Gerät, ganz ohne Server.",
  "onboarding.primer.footnote":
    "Du kannst ablehnen. Nachrichten laufen weiterhin über das Internet, und du kannst es später in den Einstellungen ändern.",
  "onboarding.primer.cta_a11y": "Weiter zu den Berechtigungsabfragen",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Bluetooth-Zugriff",
  "permission.bluetooth.purpose": "Geräte in der Nähe über das Mesh zu finden",
  "permission.open_settings": "Einstellungen öffnen",
  "permission.not_now": "Jetzt nicht",
  "permission.blocked_title": "{label} ist aus",
  "permission.blocked_body":
    "Schalte es in den Einstellungen ein, um {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Etwas ist schiefgelaufen",
  "error.boundary.body":
    "Airhop ist auf ein unerwartetes Problem gestoßen und musste die Anzeige abbrechen.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Standardkanäle",
  "chat.channels.yours": "Deine Kanäle",
  "chat.channels.none": "Noch keine Kanäle",
  "chat.channels.none_hint":
    "Tippe oben auf {plus}, um einem beizutreten oder einen zu erstellen.",
  "chat.channels.none_desc":
    "Noch keine Kanäle. Nutze die Hinzufügen-Schaltfläche in der Kopfzeile, um einem beizutreten oder einen zu erstellen.",
  "chat.channels.show_fewer": "Weniger Standardkanäle anzeigen",
  "chat.channels.show_less": "Weniger anzeigen",
  "chat.channels.info": "Kanalinfo",
  "chat.channels.pin": "Kanal anheften",
  "chat.channels.unpin": "Kanal loslösen",
  "chat.channels.mute": "Kanal stummschalten",
  "chat.channels.unmute": "Stummschaltung aufheben",
  "chat.channels.leave": "Kanal verlassen",
  "chat.channels.leave_confirm": "Verlassen",
  "chat.channels.clear_body":
    "Alle Nachrichten in {name} löschen? Das lässt sich nicht rückgängig machen.",
  "chat.channels.leave_body":
    "{name} verlassen? Du erhältst keine Nachrichten mehr daraus, und der Verlauf wird von diesem Gerät entfernt.",
  "chat.channels.more_options": "Weitere Optionen für {name}",
  "chat.channels.teleported_tag": "{level}  ·  teleportiert",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Chat leeren",
  "chat.dm.remove_contact": "Kontakt entfernen",
  "chat.dm.block": "Diesen Peer blockieren",
  "chat.dm.block_confirm": "Blockieren",
  "chat.dm.delete": "Chat löschen",
  "chat.dm.delete_body":
    "Das entfernt die Unterhaltung aus deiner Liste und löscht ihre Nachrichten. Der Kontakt bleibt erhalten, und eine neue Nachricht von ihm beginnt einen frischen Chat.",
  "chat.dm.in_range": "in Reichweite",
  "chat.dm.row_hint": "Doppelt tippen und halten für weitere Optionen",
  "chat.channels.row_hint": "Doppelt tippen und halten für weitere Optionen",
  "chat.dm.you_prefix": "Du:",
  "chat.dm.none": "Keine Direktnachrichten",
  "chat.dm.none_desc":
    "Gehe zum Mesh-Tab und tippe auf einen Peer, um eine verschlüsselte DM zu starten.",
  "chat.dm.contact_info": "Kontaktinfo",
  "chat.dm.pin": "Chat anheften",
  "chat.dm.unpin": "Chat loslösen",
  "chat.dm.mute": "Chat stummschalten",
  "chat.dm.unmute": "Stummschaltung aufheben",
  "chat.dm.clear_body":
    "Alle Nachrichten mit {name} löschen? Das lässt sich nicht rückgängig machen.",
  "chat.dm.remove_contact_body":
    "{name} entfernen? Das löscht die Unterhaltung und vergisst den Kontakt. Er kann dich weiterhin erreichen, wenn er dir wieder schreibt.",
  "chat.dm.block_body":
    "{name} blockieren? Du siehst die Person nicht mehr im Mesh-Tab und erhältst keine Nachrichten von ihr, auch nicht in der Nähe.",
  "chat.dm.more_options": "Weitere Optionen für {name}",
  "chat.dm.remove_contact_short": "Kontakt entfernen",
  "chat.dm.block_short": "Kontakt blockieren",
  "chat.dm.delete_short": "Chat löschen",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Nachrichten leeren",
  "chat.clear_confirm": "Leeren",
  "chat.group_badge": "Gruppe",
  "chat.more": "Mehr",
  "chat.no_messages": "Noch keine Nachrichten",
  "chat.you": "Du",
  "chat.a11y.channel": "Kanal {name}",
  "chat.a11y.group": "Gruppe {name}",
  "chat.a11y.muted": "stummgeschaltet",
  "chat.a11y.pinned": "angeheftet",

  // ---- Chats: start something new ----
  "chat.new.title": "Etwas Neues starten",
  "chat.new.channel": "Privaten Kanal erstellen",
  "chat.new.channel_label": "Privater Kanal",
  "chat.new.channel_desc":
    "Ein Raum, dem jeder mit dem Link beitreten kann. Erstelle einen, oder tritt mit einem Link bei, den du bekommen hast.",
  "chat.new.group": "Private Gruppe erstellen",
  "chat.new.group_label": "Private Gruppe",
  "chat.new.group_desc":
    "Wähle bestimmte Personen. Bis zu 16. Bleibt auf Bluetooth.",
  "chat.new.place": "Zu einem Ort per Geohash",
  "chat.new.place_label": "Zu einem Ort",
  "chat.new.place_desc":
    "Öffne überall einen Standortkanal über seinen Geohash.",
  "chat.new.reach": "Reichweite",
  "chat.new.reach_internet":
    "Erreicht Mitglieder über Bluetooth und das Internet.",
  "chat.new.reach_mesh":
    "Funktioniert in Bluetooth-Reichweite, nicht über das Internet.",
  "chat.new.reach_internet_desc":
    "Erreicht Mitglieder auch über das Internet. Relays sehen, dass der Kanal aktiv ist, nie seine Nachrichten und nie, wer darin ist.",
  "chat.new.reach_mesh_desc":
    "Bleibt im lokalen Mesh. Am privatesten, nichts verlässt die Bluetooth-Reichweite.",
  "chat.new.join_link":
    "Einem privaten Kanal mit einem Einladungslink beitreten",
  "chat.new.back_to_chooser": "Zurück zur Auswahl",
  "chat.new.create_channel": "Kanal erstellen",
  "chat.new.name_required": "Gib zuerst einen Kanalnamen ein",
  "chat.new.name_taken": "Dieser Name ist bereits vergeben",
  "chat.new.create": "Erstellen",
  "chat.new.e2ee":
    "Ende-zu-Ende-verschlüsselt. Nur Mitglieder können die Nachrichten lesen.",
  "chat.new.invite_only":
    "Nur mit Einladung. Jeder, mit dem du den Link teilst, kann beitreten. Für alle anderen bleibt der Kanal verborgen, auch für Peers in der Nähe.",
  "chat.new.name_exists": "Ein Kanal mit diesem Namen existiert bereits.",
  "chat.new.reach_bluetooth_chip": "Nur Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + Internet",
  "chat.new.have_link": "Mit einem Einladungslink beitreten",

  // ---- Chats: join by link ----
  "chat.join.title": "Mit einem Link beitreten",
  "chat.join.not_airhop": "Das ist kein Airhop-Link.",
  "chat.join.reach_internet":
    "Erreicht Mitglieder über Bluetooth und das Internet.",
  "chat.join.reach_mesh": "Bleibt in Bluetooth-Reichweite.",
  "chat.join.contact_card":
    "Eine Kontaktkarte. Fügt die Person deinen Kontakten hinzu und öffnet den Chat.",
  "chat.join.unverified": "Dieser Link konnte nicht überprüft werden",
  "chat.join.unverified_body":
    "Die Kontaktkarte passt nicht zu ihren eigenen Schlüsseln und wurde deshalb nicht hinzugefügt. Bitte um eine neue.",
  "chat.join.paste": "Aus Zwischenablage einfügen",
  "chat.join.join": "Beitreten",
  "chat.join.public_channel":
    "Öffentlicher Kanal {name}. Jeder in der Nähe kann mitlesen.",
  "chat.join.private_channel": "Privater Kanal {name}. {reach}",
  "chat.join.dm_with": "Direktnachricht mit {name}.",
  "chat.join.joined_as": "Beigetreten als {name}",
  "chat.join.name_clash_body":
    "Du bist bereits in einem anderen {name}. Kanalnamen sind nur Bezeichnungen, deshalb hat diese Einladung ihren eigenen Kanal geöffnet, und der, in dem du warst, bleibt unberührt. Benenne einen von beiden in seiner Kanalinfo um.",
  "chat.join.paste_hint":
    "Füge eine Einladung ein, die mit airhop:// beginnt. Antippen funktioniert auch; das hier ist für einen Link, den du nicht antippen kannst.",
  "chat.join.key_note":
    "Eine Einladung zu einem privaten Kanal enthält den Schlüssel, deshalb ist der Beitritt sofort möglich und niemand sonst muss etwas tun.",
  "chat.join.offline_note":
    "Funktioniert offline. Der Link wird auf diesem Gerät gelesen, und der Kanal reicht so weit, wie sein Ersteller es eingerichtet hat.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Diese Zelle konnte nicht geöffnet werden. Versuche es gleich noch einmal.",
  "chat.jump.title": "Zu einem Ort",
  "chat.jump.saved": "GESPEICHERTE ORTE",
  "chat.jump.anywhere":
    "Öffne überall einen öffentlichen Standortkanal, auch an einem Ort, an dem du nicht bist.",
  "chat.jump.geohash_note":
    "Gib seinen Geohash ein. Alle, deren Standort in diese Zelle fällt, teilen sich den Kanal.",
  "chat.jump.teleport_note":
    "Du erscheinst als teleportiert, nicht als in der Nähe. Der Kanal reicht nur über das Internet.",
  "chat.jump.level_cell": "{level}-Zelle",
  "chat.jump.already_here":
    "Du bist bereits hier. Los öffnet deinen Kanal {name}.",
  "chat.jump.open_direction": "Zelle {direction} öffnen",
  "chat.jump.open_place": "{name} öffnen",
  "chat.jump.remove_place": "{name} aus gespeicherten Orten entfernen",
  "chat.jump.go": "Los",
  "chat.jump.how":
    "So findest du einen Geohash: öffne einen Standortkanal > tippe auf seinen Namen > kopiere ihn dort.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Es konnten nicht alle Mitglieder erreicht werden. Versuche es erneut, während sie in der Nähe sind.",
  "chat.group.you_were_added": "Du wurdest zu {name} hinzugefügt.",
  "chat.group.added_you": "Hat dich zu {name} hinzugefügt",
  "chat.group.you_were_removed":
    "Du wurdest aus {name} entfernt. Du kannst hier nicht mehr lesen oder schreiben.",
  "chat.group.removed_you": "Hat dich aus {name} entfernt",
  "chat.group.add_failed": "Hinzufügen nicht möglich",
  "chat.group.add_failed_body":
    "Nichts hat sich geändert. Entweder ist die Person gerade nicht erreichbar, die Gruppe ist mit 16 voll, oder du bist nicht ihr Ersteller.",
  "chat.group.remove_failed": "Entfernen nicht möglich",
  "chat.group.remove_failed_body":
    "Nichts hat sich geändert. Nur wer die Gruppe erstellt hat, kann ändern, wer darin ist.",
  "chat.group.e2ee":
    "Ende-zu-Ende-verschlüsselt. Nur Mitglieder können die Nachrichten lesen.",
  "chat.group.cap":
    "Bis zu 16 Personen, von dir ausgewählt. Es gibt keinen Einladungslink, also tritt niemand bei, weil ihm einer weitergeleitet wurde.",
  "chat.group.bluetooth":
    "Nur Bluetooth. Mitglieder außer Reichweite erhalten Nachrichten, sobald sie zurück sind.",
  "chat.group.members_label": "MITGLIEDER",
  "chat.group.none_in_range":
    "Niemand ist in Reichweite. Mitglieder müssen in der Nähe sein, wenn du die Gruppe erstellst.",
  "chat.group.create_title": "Gruppe erstellen",
  "chat.group.name_placeholder": "Gruppenname",
  "chat.group.create": "Erstellen",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Lokales Mesh · nur Bluetooth",
  "chat.scope.mesh_desc":
    "Erreicht Geräte in Bluetooth-Reichweite (etwa 10 bis 100 Meter). Kein Internet nötig. Ideal für Absprachen vor Ort.",
  "chat.scope.block": "Häuserblock · ~100 m",
  "chat.scope.block_desc":
    "Abdeckung auf Häuserblock-Ebene. Nachrichten werden über das Internet gebrückt, damit Peers außerhalb der Bluetooth-Reichweite, aber in der Nähe, mitmachen können.",
  "chat.scope.neighborhood": "Viertel · ~1 km",
  "chat.scope.neighborhood_desc":
    "Abdeckung im Viertel. Relay-gestützt, damit Peers im gesamten Gebiet auch ohne direkte Bluetooth-Verbindung erreichbar sind.",
  "chat.scope.city": "Stadt · ~10 km",
  "chat.scope.city_desc":
    "Stadtweiter Kanal. Nutzt geografisch verortete Internet-Relays, um Peers im gesamten Ballungsraum zu erreichen.",
  "chat.scope.province": "Bundesland oder Provinz · ~100 km",
  "chat.scope.province_desc":
    "Abdeckung auf Landes- oder Provinzebene. Über das Internet gebrückt für regionale Reichweite über Hunderte von Kilometern.",
  "chat.scope.country": "Land oder Region · ~1000 km",
  "chat.scope.country_desc":
    "Landesweite Abdeckung. Alle Airhop- oder bitchat-Nutzer in der Region können beitreten und mitlesen.",
  "chat.transport.bluetooth": "Nur Bluetooth",
  "chat.transport.both": "Bluetooth + Internet",
  "chat.transport.internet": "Nur Internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Befehl /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Eine herzliche Umarmung senden",
  "chat.cmd.slap_hint": "Mit einer großen Forelle schlagen",
  "chat.status.sending": "Wird gesendet…",
  "chat.status.undo_send": "Senden rückgängig machen",
  "chat.status.undo": "Rückgängig",
  "chat.status.sent": "Gesendet",
  "chat.status.received": "Empfangen",
  "chat.status.failed": "Fehlgeschlagen",
  "chat.status.canceled": "Abgebrochen",
  "chat.status.waiting": "Wartet",
  "chat.status.sending_short": "Senden",
  "chat.status.receiving": "Empfangen",
  "chat.thread.not_available": "Hier nicht verfügbar",
  "chat.thread.private_channel": "Privater Kanal",
  "chat.thread.location_channel": "Standortkanal",
  "chat.thread.public_channel": "Öffentlicher Kanal",
  "chat.thread.notices": "Aushänge für diesen Kanal",
  "chat.thread.invite": "Jemanden in diesen Kanal einladen",
  "chat.thread.not_in_range":
    "Nicht in Bluetooth-Reichweite. Zustellung über das Internet.",
  "chat.thread.not_nearby":
    "Nicht in der Nähe. Wir stellen zu, sobald die Person wieder in Reichweite oder online ist.",
  "chat.thread.no_keys":
    "Du musst in Bluetooth-Reichweite sein oder ihren Code scannen, um ihr zu schreiben.",
  "chat.geo.card_received":
    "{name} hat den Kontakt geteilt. Teile deinen zurück, um in Kontakt zu bleiben, wenn eine oder einer von euch weiterzieht.",
  "chat.geo.exchange_complete":
    "Kontakte ausgetauscht. Ihr könnt euch jetzt von überall erreichen.",
  "chat.geo.keep_person": "Diese Person behalten",
  "chat.geo.keep_person_desc":
    "Teile deinen Kontakt, um in Kontakt zu bleiben, wenn eine oder einer von euch weiterzieht. Sie erfährt dadurch deine dauerhafte Identität.",
  "chat.geo.card_sent": "Geteilt · warte auf ihren",
  "chat.thread.left_cell":
    "Du hast dieses Gebiet verlassen, deshalb ist die Person hier nicht mehr erreichbar. Tauscht Codes, um überall weiterzuschreiben.",
  "chat.thread.no_route":
    "Gerade nicht erreichbar. Die Nachricht geht raus, sobald eine Route verfügbar ist.",
  "chat.thread.empty": "Noch keine Nachrichten",
  "chat.thread.empty_desc": "Beginne eine verschlüsselte Unterhaltung.",
  "chat.thread.jump_latest": "Zur neuesten Nachricht springen",
  "chat.thread.back_to_members": "Zurück zu den Mitgliedern",
  "chat.thread.nostr_key": "Öffentlicher Nostr-Schlüssel",
  "chat.thread.in_range": "In Reichweite",
  "chat.voice.not_recorded": "Sprachnotiz wurde nicht aufgenommen",
  "chat.thread.message": "Nachricht",
  "chat.thread.message_placeholder": "Nachricht…",
  "chat.thread.length_full": "Nachricht ist voll",
  "chat.thread.waiting_for": "Warte auf die Rückkehr von {name} · {percent} %",
  "chat.thread.peer": "Peer",
  "chat.thread.cancel_transfer": "{name} abbrechen",
  "chat.thread.queued_more": "{count} weitere warten auf den Versand",
  "chat.thread.across_bridge": "{count} über die Brücke",
  "chat.thread.bridged": "gebrückt",
  "chat.thread.invite_body":
    "Komm zu mir in {channel} auf Airhop — private Mesh-Nachrichten, die ohne Internet auskommen.",
  "chat.thread.go_back_unread": "Zurück, {count} ungelesen",
  "chat.thread.view_info": "Infos zu {name} ansehen",
  "chat.thread.notices_new": "Aushänge für diesen Kanal, {count} neu",
  "chat.thread.say_something": "Sag etwas in {channel}.",
  "chat.thread.jump_latest_new": "Zur neuesten Nachricht springen, {count} neu",
  "chat.thread.unconfirmed_since": "Seit {date} keine Zustellung bestätigt",
  "chat.thread.no_reach":
    "Keine Peers in der Nähe · noch niemand hat das erhalten",
  "chat.thread.channel_needs_internet":
    "Internet aus · dieser Kanal erreicht nur Personen in Bluetooth-Reichweite",
  "chat.thread.cell_needs_internet":
    "Internet aus · diese Zelle ist nur über das Internet erreichbar",
  "chat.thread.geo_dm_needs_internet":
    "Internet aus · diese Unterhaltung läuft nur über das Internet",
  "chat.thread.via_gateway":
    "Internet aus · ein Gerät in der Nähe bringt das für dich online",
  "chat.thread.group_queued":
    "Noch ist niemand aus dieser Gruppe in der Nähe. Es erreicht sie, sobald sie es sind.",
  "chat.thread.no_group_key":
    "Du bist nicht mehr in dieser Gruppe, deshalb lässt sich das nicht senden",
  "chat.thread.no_reach_offline":
    "Internet aus und keine Peers in der Nähe · noch niemand hat das erhalten",
  "chat.thread.mention": "{name} erwähnen",
  "chat.thread.someone_talking": "{hold}. {name} spricht gerade.",
  "chat.thread.attach_note":
    "Dateien gehen nur in Bluetooth-Reichweite raus. Text und Zahlungen erreichen Internetkontakte, Anhänge nicht.",
  "chat.thread.message_peer": "{name} schreiben",
  "chat.thread.send": "Nachricht senden",
  "chat.thread.group": "Gruppe",
  "chat.bridge.nearby_only":
    "Nur in der Nähe: diese Nachricht von der Mesh-Brücke fernhalten",
  "chat.bridge.nearby_label": "Nur in der Nähe · bleibt auf Bluetooth",
  "chat.bridge.bridging_label":
    "Wird in Nachbargebiete gebrückt · tippen für nur in der Nähe",
  "chat.screenshot.you_took": "Du hast einen Screenshot gemacht",
  "chat.screenshot.you_took_private":
    "Du hast einen Screenshot gemacht · niemand wurde informiert",
  "chat.screenshot.heads_up": "Zur Info",
  "chat.screenshot.notice": "* {name} hat einen Screenshot gemacht *",
  "chat.screenshot.notified_dm":
    "{name} wurde informiert, dass du einen Screenshot dieser Unterhaltung gemacht hast.",
  "chat.screenshot.notified":
    "Alle in diesem Kanal wurden informiert, dass du einen Screenshot gemacht hast.",
  "chat.screenshot.not_notified":
    "Niemand wurde informiert. Dieser Kanal ist öffentlich, und einen Screenshot anzukündigen würde festhalten, dass du hier warst.",
  "chat.thread.error": "Fehler",
  "chat.thread.go_back": "Zurück",
  "chat.bubble.via_bridge": "über die Mesh-Brücke",
  "chat.bubble.view_profile": "Profil von {name} ansehen",
  "chat.bubble.forwarded": "Weitergeleitet",
  "chat.bubble.attachment": "Anhang",
  "chat.bubble.a11y": "{sender}: {body}. Lange drücken für weitere Optionen.",
  "chat.bubble.failed_retry": "Senden fehlgeschlagen. Zum Wiederholen tippen.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Nachrichteninfo",
  "chat.info.delivered_to": "Zugestellt an {name}",
  "chat.info.read_by": "Gelesen von {name}",
  "chat.info.group_reach_desc": "Jetzt erreichbar, keine Zustellbestätigung",
  "chat.info.group_alone": "Keine weiteren Mitglieder",
  "chat.info.today_at": "Heute {time}",
  "chat.info.sending": "Wird gesendet…",
  "chat.info.failed": "Senden fehlgeschlagen",
  "chat.info.courier": "Von jemandem mitgenommen",
  "chat.info.sent": "Gesendet",
  "chat.info.queued": "Wartet auf den Versand",
  "chat.info.waiting": "Wartet…",
  "chat.action.info": "Nachrichteninfo",
  "chat.action.save_photos": "In Fotos sichern",
  "chat.action.save_copy": "Kopie sichern",
  "chat.action.forward": "Weiterleiten",
  "chat.action.select": "Auswählen",
  "chat.select.cancel": "Auswahl aufheben",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Kamera",
  "chat.attach.camera_desc": "Foto oder Video aufnehmen",
  "chat.attach.library": "Fotomediathek",
  "chat.attach.library_desc": "Aus deiner Mediathek wählen",
  "chat.attach.document": "Dokument",
  "chat.attach.document_desc": "Beliebige Datei oder PDF senden",
  "chat.attach.voice": "Sprachnotiz",
  "chat.attach.voice_desc": "Sprachnachricht aufnehmen und senden",
  "chat.attach.ecash": "Ecash senden",
  "chat.attach.ecash_desc": "Cashu-Sats aus deiner Wallet senden",
  "chat.attach.location": "Standort",
  "chat.attach.location_desc": "Senden, wo du gerade bist",
  "chat.attach.title": "Anhängen",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Standort geteilt",
  "chat.location.received_summary": "Hat den Standort geteilt",
  "chat.location.title": "Standort",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Vor {ago} aufgenommen",
  "chat.location.open_maps": "In Karten öffnen",
  "chat.location.no_forward": "Standorte werden nicht weitergeleitet",
  "chat.location.no_forward_body":
    "Ein Standort geht an eine Person. Teile stattdessen deinen eigenen, wenn ihn jemand anderes haben soll.",
  "chat.location.no_fix":
    "Erlaube den Standort, um zu sehen, wie weit das entfernt ist",
  "chat.location.send_title": "Deinen Standort senden",
  "chat.location.send_body":
    "{name} sieht einen Punkt: wo du jetzt bist. Er wird nicht laufend aktualisiert.",
  "chat.location.send": "Standort senden",
  "chat.location.finding": "Dein Standort wird ermittelt…",
  "chat.location.no_location": "Dein Standort konnte nicht ermittelt werden",
  "chat.location.no_location_body":
    "Erlaube den Standortzugriff und stelle sicher, dass die Ortungsdienste an sind, dann versuche es erneut.",
  "chat.location.not_delivered": "Dein Standort konnte nicht gesendet werden",
  "chat.location.not_delivered_body":
    "Ein Standort lohnt sich nur, solange er aktuell ist, deshalb wird er nicht für später vorgemerkt. Versuche es erneut, wenn {name} erreichbar ist.",
  "chat.location.direction.n": "nördlich",
  "chat.location.direction.ne": "nordöstlich",
  "chat.location.direction.e": "östlich",
  "chat.location.direction.se": "südöstlich",
  "chat.location.direction.s": "südlich",
  "chat.location.direction.sw": "südwestlich",
  "chat.location.direction.w": "westlich",
  "chat.location.direction.nw": "nordwestlich",
  "chat.attach.send_anyway": "Trotzdem senden",
  "chat.attach.bitchat_too_big": "Das kommt vielleicht nicht an",
  "chat.attach.bitchat_too_big_body":
    "{name} nutzt bitchat, und das bricht bei einer großen Datei mittendrin ab. Unter etwa 350 KiB ist zuverlässig. An einen Airhop-Kontakt gesendet gibt es diese Grenze nicht.",
  "chat.attach.bitchat_unopenable":
    "Das lässt sich dort vielleicht nicht öffnen",
  "chat.attach.bitchat_unopenable_body":
    "{name} nutzt bitchat, das Fotos und Sprachnotizen anzeigt, alles andere aber als nicht zu öffnende Datei auflistet. Es kommt an, lässt sich dort aber möglicherweise nicht ansehen.",
  "chat.attach.file": "Datei anhängen",
  "chat.attach.unavailable": "Anhänge sind hier nicht verfügbar",
  "chat.attach.not_sent": "Anhang nicht gesendet",
  "chat.attach.read_failed":
    "Beim Lesen dieser Datei ist etwas schiefgelaufen. Versuche eine andere.",
  "chat.attach.caption": "Bildunterschrift hinzufügen…",
  "chat.attach.send": "Anhang senden",
  "chat.attach.generic": "Anhang",
  "chat.media.view_full": "Foto im Vollbild ansehen",
  "chat.media.gone_photo": "Foto nicht auf diesem Gerät",
  "chat.media.gone_video": "Video nicht auf diesem Gerät",
  "chat.media.gone_voice": "Sprachnotiz nicht auf diesem Gerät",
  "chat.media.gone_file": "Datei nicht auf diesem Gerät",
  "chat.media.gone_note": "Nach 7 Tagen entfernt, oder beim Leeren des Caches",
  "chat.media.ask_resend": "Noch einmal fragen",
  "chat.media.resend_draft": "Kannst du {kind} noch einmal senden?",
  "chat.media.kind_photo": "das Foto",
  "chat.media.kind_video": "das Video",
  "chat.media.kind_voice": "die Sprachnotiz",
  "chat.media.kind_file": "die Datei",
  "chat.media.pause_voice": "Sprachnotiz pausieren",
  "chat.media.play_voice": "Sprachnotiz abspielen",
  "chat.media.voice_position": "Position in der Sprachnotiz",
  "chat.media.voice_scrub":
    "Tippe entlang der Balken, um an die Stelle zu springen",
  "chat.media.image": "Bild",
  "chat.media.tap_load_photo": "Tippen, um das Foto zu laden",
  "chat.media.open_document": "{name} öffnen",
  "chat.media.document": "Dokument",
  "chat.media.tap_load_video": "Tippen, um das Video zu laden",
  "chat.media.video": "Video",
  "chat.media.photo": "Foto",
  "chat.media.close_photo": "Foto schließen",
  "chat.media.save_photo": "Foto in deinen Fotos sichern",
  "chat.media.share_photo": "Foto teilen",
  "chat.media.saved_videos": "In deinen Videos gesichert",
  "chat.media.saved_photos": "In deinen Fotos gesichert",
  "chat.media.not_saved": "Nicht gesichert",
  "chat.media.cant_open": "Datei lässt sich nicht öffnen",
  "chat.media.no_app":
    "Auf diesem Gerät gibt es keine App, die diese Datei öffnen oder teilen kann.",
  "chat.media.open_failed":
    "Die Datei konnte nicht geöffnet werden. Sie wurde möglicherweise aus dem Cache entfernt.",
  "media.blocked.nostr_only":
    "Du kennst diese Person nur über ein Relay. Es ist nur Text möglich. Fotos, Dateien und Sprachnotizen brauchen Bluetooth.",
  "media.blocked.private_channel":
    "Ein gesendeter Anhang ist signiert, aber nicht verschlüsselt. In einen privaten Kanal geschickt läge er also offen, während der Text hier verschlüsselt bleibt.",
  "media.blocked.private_group":
    "Ein gesendeter Anhang ist signiert, aber nicht verschlüsselt. In eine private Gruppe geschickt läge er also offen, während der Text hier verschlüsselt bleibt.",
  "media.blocked.location_channel":
    "Ein Standortkanal erreicht Menschen über das Internet, und Fotos, Dateien und Sprachnotizen laufen über Bluetooth, würden also nie ankommen.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Sprachnotizen sind hier nicht verfügbar",
  "chat.voice.hold_live": "Halten, um live zu sprechen",
  "chat.voice.hold_record": "Halten, um eine Sprachnotiz aufzunehmen",
  "chat.voice.cancel_recording": "Aufnahme abbrechen",
  "chat.voice.slide_cancel": "Zum Abbrechen wischen",
  "chat.voice.release_cancel": "Zum Abbrechen loslassen",
  "chat.voice.a11y_toggle": "Doppelt tippen, um zu sprechen oder aufzuhören.",
  "chat.voice.limit_reached":
    "Zwei-Minuten-Grenze erreicht, zum Senden loslassen",
  "chat.voice.limit_sent": "Zwei-Minuten-Grenze erreicht, Notiz gesendet",
  "chat.voice.stop_send": "Aufnahme beenden und senden",
  "chat.voice.lift_lock": "Nach oben wischen, um freihändig aufzunehmen",
  "chat.voice.live_speaking": "{name} spricht",
  "voice.unavailable": "Live-Sprache nicht verfügbar",
  "voice.recording_stopped": "Aufnahme beendet",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Kamerazugriff",
  "chat.perm.camera_purpose": "ein Foto zum Senden aufzunehmen",
  "chat.perm.photo_label": "Fotozugriff",
  "chat.perm.photo_purpose": "ein Foto oder Video zum Senden auszuwählen",
  "chat.perm.photo_save_purpose": "das in deinen Fotos zu sichern",
  "chat.perm.mic_label": "Mikrofonzugriff",
  "chat.perm.mic_live_purpose": "mit Menschen in der Nähe zu sprechen",
  "chat.perm.mic_note_purpose": "eine Sprachnotiz aufzunehmen",
  "chat.perm.recording_stopped": "Aufnahme beendet",
  "chat.perm.record_failed":
    "Aufnahme konnte nicht gestartet werden. Prüfe die Mikrofonberechtigungen.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Eingelöst",
  "chat.ecash.reclaimed": "Zurückgeholt",
  "chat.ecash.claiming": "Wird eingelöst…",
  "chat.ecash.claim": "Einlösen",
  "chat.ecash.claim_amount": "{amount} {unit} einlösen",
  "chat.ecash.already_claimed": "Bereits eingelöst",
  "chat.ecash.already_claimed_body":
    "Jeder Proof in diesem Token liegt bereits in deiner Wallet, es wurde also nichts hinzugefügt.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Dem Mesh zur Zustellung nach bestem Bemühen übergeben",
  "chat.info.queued_desc":
    "Auf diesem Telefon gehalten, bis es eine Route dorthin gibt",
  "chat.info.reclaimed": "Zurückgeholt",
  "chat.info.reclaimed_desc":
    "Du hast diese Zahlung in deine Wallet zurückgeholt, sie wird also nicht zugestellt",
  "chat.info.about": "Info",
  "chat.info.group_desc":
    "Eine private Gruppe. Nur die Mitglieder, die der Ersteller hinzugefügt hat, können mitlesen, und sie bleibt auf Bluetooth.",
  "chat.info.teleported_desc":
    "Ein öffentlicher Standortkanal für diese Geohash-Zelle. Alle in der Zelle, ob auf Airhop oder bitchat, teilen ihn über das Internet. Du bist teleportiert, nicht wirklich hier.",
  "chat.info.custom_desc":
    "Ein eigener Kanal. Alle, die den Namen kennen, können von jedem Airhop- oder bitchat-Gerät beitreten.",
  "chat.info.private_e2ee": "Privat · Ende-zu-Ende-verschlüsselt",
  "chat.info.public_plain": "Öffentlich · unverschlüsselt",
  "chat.info.group_privacy":
    "Nur die unten gezeigten Mitglieder können diese Gruppe lesen. Nachrichten bleiben auf Bluetooth, deshalb erhalten Mitglieder außer Reichweite sie, sobald sie zurück sind.",
  "chat.info.teleport_privacy":
    "Ein Ort, zu dem du teleportiert bist. Er erreicht alle in dieser Zelle über das Internet und niemanden in Bluetooth-Reichweite.",
  "chat.info.location_off_privacy":
    "Der Standort ist aus, deshalb erreicht dieser Kanal nur Geräte in der Nähe über Bluetooth. Schalte den Standort ein, um seine Gebietszelle über das Internet zu erreichen.",
  "chat.info.invite_privacy":
    "Nur Personen, die du per Link einlädst, können mitlesen. Für alle anderen bleibt der Kanal verborgen, auch für Peers in der Nähe.",
  "chat.info.public_privacy":
    "Jeder, der beitritt, kann jede Nachricht lesen. Nutze eine Direktnachricht für private Gespräche; DMs sind Ende-zu-Ende-verschlüsselt.",
  "chat.info.remove_member": "Mitglied entfernen",
  "chat.info.remove_member_body":
    "{name} aus der Gruppe entfernen? Der Gruppenschlüssel wird gewechselt, sodass die Person keine neuen Nachrichten mehr lesen kann.",
  "chat.info.message_member": "{name} schreiben",
  "chat.info.remove_member_a11y": "{name} entfernen",
  "chat.info.no_addable":
    "Keine erreichbaren Peers zum Hinzufügen. Mitglieder müssen in der Nähe sein.",
  "chat.info.add_count": "{count} hinzufügen",
  "chat.info.teleported_tag": "{level}  ·  teleportiert",
  "chat.info.active": "Aktiv",
  "chat.info.members": "Mitglieder",
  "chat.info.bookmark": "Diesen Ort merken",
  "chat.info.remove_bookmark": "Merkeintrag entfernen",
  "chat.info.default_notice":
    "Standardkanäle lassen sich nicht verlassen. Sie sind Teil des Airhop-Mesh-Protokolls.",
  "chat.info.custom_channel": "Eigener Kanal",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Geohash kopieren",
  "chat.info.relays": "Relays",
  "chat.info.show_relays": "Die Relays anzeigen, die diesen Kanal tragen",
  "chat.info.relay_custom": "eigenes",
  "chat.info.relays_none":
    "Keine. Diese Zelle läuft gerade nur über Bluetooth.",
  "chat.info.search_members": "Mitglieder durchsuchen",
  "chat.info.search_members_placeholder": "Mitglieder durchsuchen…",
  "chat.info.teleported": "Teleportiert",
  "chat.info.creator": "Ersteller",
  "chat.info.no_matches": "Keine Treffer",
  "chat.info.no_one_here": "Noch niemand hier",
  "chat.info.add_members": "Mitglieder hinzufügen",
  "chat.info.add_selected": "Ausgewählte Mitglieder hinzufügen",
  "chat.info.add": "Hinzufügen",
  "chat.info.leave_group": "Gruppe verlassen",
  "chat.info.leave_channel": "Kanal verlassen",
  "chat.info.leave": "Verlassen",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Im Gespräch seit {date}",
  "chat.contact.verified_since": "Verifiziert seit {date}",
  "chat.contact.anonymous": "Anonym",
  "chat.contact.anonymous_desc":
    "Ein Geohash-Pseudonym ohne dauerhafte Identität, die sich verifizieren ließe",
  "chat.contact.verified": "Verifiziert",
  "chat.contact.verified_desc": "QR-Code gescannt",
  "chat.contact.verified_desc_compared": "Codes miteinander verglichen",
  "chat.contact.not_verified": "Nicht verifiziert",
  "chat.contact.not_verified_desc":
    "Scanne ihren Code oder vergleicht einen am Telefon, um zu bestätigen, dass sie es wirklich ist",
  "chat.contact.e2ee": "Ende-zu-Ende-verschlüsselt",
  "chat.contact.e2ee_nostr":
    "NIP-17-gift-wrapped, sodass Relays nicht mitlesen können",
  "chat.contact.e2ee_mesh":
    "Noise XX, dazu Double Ratchet zwischen Airhop-Geräten",
  "chat.contact.copy_nostr": "Öffentlichen Nostr-Schlüssel kopieren",
  "chat.contact.nostr_key": "Öffentlicher Nostr-Schlüssel",
  "chat.contact.cell_key_note":
    "Dieser Schlüssel gehört zu dem Gebiet, in dem ihr euch getroffen habt. Er ändert sich, wenn eine oder einer von euch weiterzieht, und das Gespräch endet damit. Tauscht Kontakte, um überall weiterzuschreiben.",
  "chat.contact.peer_name": "Peer-Name",
  "chat.contact.peer_id": "Peer-ID",
  "chat.contact.rename": "Umbenennen",
  "chat.contact.rename_needs_contact":
    "Du kannst Personen umbenennen, deren Schlüssel du hast. Tauscht zuerst Kontaktkarten, dann wird daraus ein Name, den nur du siehst.",
  "chat.contact.rename_needs_keys":
    "Für diesen Kontakt gibt es noch keine Schlüssel. Schreibe der Person oder scanne ihren Code, dann kannst du ihr einen Namen geben, den nur du siehst.",
  "chat.contact.renamed_by_you": "Dein Name für sie",
  "chat.contact.copy_peer_id": "Peer-ID kopieren",
  "chat.contact.verify": "Kontakt verifizieren",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Aushänge",
  "chat.notices.post_area": "Einen Aushang in diesem Gebiet veröffentlichen",
  "chat.notices.post_mesh": "Einen Aushang im Mesh veröffentlichen",
  "chat.notices.mark_urgent": "Als dringend markieren",
  "chat.notices.post": "Aushang veröffentlichen",
  "chat.notices.post_short": "Posten",
  "chat.notices.delete": "Aushang löschen",
  "chat.notices.just_now": "gerade eben",
  "chat.notices.fades_soon": "verblasst bald",
  "chat.notices.1_day": "1 Tag",
  "chat.notices.3_days": "3 Tage",
  "chat.notices.7_days": "7 Tage",
  "chat.notices.fading": "verblasst",
  "chat.notices.fades_in_hours": "verblasst in {count} Std.",
  "chat.notices.fades_in_days": "verblasst in {count} T.",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Dringend",
  "chat.notices.permanent_warning":
    "Verblasst nie. Öffentlich und an dieses Gebiet gebunden, und du kannst es nicht zurücknehmen.",
  "chat.notices.none":
    "Noch keine Aushänge. Veröffentliche einen, damit er hier für andere stehen bleibt.",

  // ---- Chats: search results ----
  "chat.search.photos": "Fotos",
  "chat.search.videos": "Videos",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Dokumente",
  "chat.search.links": "Links",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Nach {filter} filtern",
  "chat.search.no_matches": "Keine Treffer für {filter} zu „{query}“",
  "chat.search.no_media": "Noch keine {filter}",
  "chat.search.result_a11y": "{chat}, {kind} von {sender}",
  "chat.search.you": "du",
  "chat.search.section_chats": "Chats",
  "chat.search.section_messages": "Nachrichten",
  "chat.search.section_notices": "Aushänge",
  "chat.search.hint":
    "Durchsuche Nachrichten und Chats, oder wähle oben einen Filter.",
  "chat.search.no_results": "Keine Ergebnisse für „{query}“",
  "chat.search.open_chat": "{name} öffnen",
  "chat.search.message_a11y": "{chat}, Nachricht von {sender}: {snippet}",
  "chat.search.notice_a11y": "Aushang in {chat} von {author}: {snippet}",
  "chat.search.urgent": "Dringend ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "{count} in dieser Liste. Leeren entfernt sie nur von hier, und die Nachrichten bleiben in ihren Unterhaltungen ungelesen. Alle als gelesen markieren räumt beides auf.",
  "chat.notif.mark_all_read": "Alle als gelesen markieren",
  "chat.notif.clear_list": "Liste leeren",
  "chat.notif.clear_all_a11y": "Alle {count} Mitteilungen löschen",
  "chat.notif.title": "Mitteilungen",
  "chat.notif.clear_short": "Leeren",
  "chat.notif.close": "Mitteilungen schließen",
  "chat.notif.none": "Noch keine Mitteilungen",
  "chat.notif.none_desc":
    "Nachrichten, Erwähnungen und Aushänge aus deinen Kanälen und Chats erscheinen hier.",
  "chat.notif.new": "Neu",
  "chat.notif.notice_in": "Aushang in {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Weiterleiten an…",
  "chat.forward.to": "An {name} weiterleiten",
  "chat.forward.cant_send_here": "Weiterleiten hier nicht möglich",
  "chat.forward.cant_send_to": "Weiterleiten an {name} nicht möglich",
  "chat.forward.channels": "Kanäle",
  "chat.forward.groups": "Gruppen",
  "chat.forward.locations": "Orte",
  "chat.forward.dms": "Direktnachrichten",
  "chat.forward.none": "Noch keine anderen Chats",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Mesh wird gestartet…",
  "mesh.banner.no_bluetooth": "Kein Bluetooth auf diesem Gerät · nur Internet",
  "mesh.banner.bluetooth_off": "Bluetooth aus · Mesh nicht verfügbar",
  "mesh.banner.permission_needed": "Bluetooth-Berechtigung nötig",
  "mesh.banner.blocked": "Bluetooth blockiert · in den Einstellungen erlauben",
  "mesh.banner.location_permission": "Standort nötig, um Peers zu finden",
  "mesh.banner.advertising_unsupported":
    "Dieses Telefon sieht andere, kann aber nicht gefunden werden",
  "mesh.banner.location_off_android":
    "Standort aus · Android braucht ihn, um Peers zu finden",
  "mesh.banner.paused": "Mesh pausiert · du bist abwesend",
  "mesh.banner.location_off": "Standort aus · Standortkanäle nicht verfügbar",
  "mesh.banner.battery_saver": "Energiesparmodus · seltenere Suche",
  "mesh.banner.wipe_incomplete":
    "Löschen unvollständig · es können Daten übrig sein, beim erneuten Öffnen wird es wiederholt",
  "mesh.banner.wifi_off": "WLAN aus · große Dateien gehen langsamer raus",
  "mesh.banner.clock_skew":
    "Die Uhr dieses Telefons geht falsch · stelle Datum und Uhrzeit auf automatisch",
  "mesh.banner.internet_off": "Internet aus · nur Bluetooth",
  "mesh.banner.relaying": "Keine lokalen Peers · Weiterleitung über Nostr",
  "mesh.banner.tor": "Tor an · Internetverkehr wird geleitet",
  "mesh.banner.tor_starting": "Tor wird gestartet · Verbindung wird aufgebaut",
  "mesh.banner.tor_blocked":
    "Tor konnte keine Verbindung aufbauen · das Mesh läuft weiter",
  "mesh.banner.gateway":
    "Internet-Gateway an · Peers in der Nähe werden weitergeleitet",
  "mesh.banner.bridge": "Mesh-Brücke an · öffentlicher Chat verbunden",
  "mesh.banner.background_limits":
    "{brand} pausiert das Mesh im Hintergrund möglicherweise",
  "mesh.banner.bridge_across": "Mesh-Brücke an · {count} über der Brücke",
  "mesh.banner.action.turn_on": "Einschalten",
  "mesh.banner.action.allow": "Erlauben",
  "mesh.banner.action.resume": "Fortsetzen",
  "mesh.banner.action.fix": "Beheben",
  "mesh.banner.hint.resume": "Schaltet Bluetooth-Senden und -Suchen wieder ein",
  "mesh.banner.hint.enable_bluetooth":
    "Bittet Android, Bluetooth einzuschalten",
  "mesh.banner.hint.location_settings":
    "Öffnet die Standorteinstellungen des Systems",
  "mesh.banner.hint.app_settings":
    "Öffnet die Berechtigungen von Airhop in den Systemeinstellungen",
  "mesh.banner.hint.battery_settings":
    "Öffnet die Einstellungen zur Hintergrundaktivität dieses Telefons",
  "mesh.banner.dismiss": "Ausblenden: {label}",
  "mesh.banner.hint.dismiss": "Blendet diesen Hinweis dauerhaft aus",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Suche nach Peers in der Nähe…",
  "mesh.radar.starting": "Mesh wird gestartet…",
  "mesh.radar.no_bluetooth": "Kein Bluetooth auf diesem Gerät",
  "mesh.radar.bluetooth_off": "Bluetooth aus · keine Suche",
  "mesh.radar.permission_needed": "Bluetooth-Berechtigung nötig",
  "mesh.radar.blocked": "Bluetooth blockiert",
  "mesh.radar.location_permission": "Standortberechtigung nötig",
  "mesh.radar.location_off": "Standort aus · keine Suche",
  "mesh.radar.hint_rings":
    "Die Ringe zeigen die BLE-Signalstärke, nicht die Entfernung",
  "mesh.radar.hint_checking": "Bluetooth und Berechtigungen werden geprüft",
  "mesh.radar.hint_internet": "Nachrichten laufen weiterhin über das Internet",
  "mesh.radar.hint_turn_on": "Schalte Bluetooth ein, um Peers zu finden",
  "mesh.radar.hint_allow": "Erlaube Bluetooth, um Peers zu finden",
  "mesh.radar.hint_allow_settings":
    "Erlaube Bluetooth in den Einstellungen, um Peers zu finden",
  "mesh.radar.hint_location_permission":
    "Android 11 und älter brauchen den Standort, um über Bluetooth zu suchen",
  "mesh.radar.hint_android_location":
    "Android braucht den Standort eingeschaltet, um Bluetooth-Suchergebnisse zu liefern",
  "mesh.radar.signal_strong": "Stark",
  "mesh.radar.signal_medium": "Mittel",
  "mesh.radar.signal_weak": "Schwach",
  "mesh.radar.you_center": "Du, im Zentrum des Mesh",
  "mesh.radar.sonar_hint":
    "Spielt einen Sonarton ab. Die Suche läuft ohnehin durchgehend.",
  "mesh.radar.paused": "Mesh pausiert · du bist abwesend",
  "mesh.radar.ring_hint":
    "Die Ringposition spiegelt die Signalstärke wider, nicht die Entfernung",
  "mesh.radar.set_online":
    "Setze deinen Status im Profil auf Online, um Peers zu finden",
  "mesh.radar.in_range": "in Reichweite",
  "mesh.radar.recently_seen": "kürzlich gesehen",
  "mesh.radar.peer_hint":
    "Öffnet Optionen, um diesem Peer zu schreiben oder zu zahlen",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "gerade eben",
  "mesh.peer.none": "Keine Peers in der Nähe",
  "mesh.peer.none_desc":
    "Andere Airhop- oder bitchat-Geräte in Bluetooth-Reichweite erscheinen hier.",
  "mesh.peer.id_copied": "Peer-ID kopiert",
  "mesh.peer.copy_id": "Peer-ID kopieren",
  "mesh.peer.their_name": "Nennt sich {name}",
  "mesh.peer.in_range": "In Reichweite",
  "mesh.peer.relay": "Relay-Knoten",
  "mesh.peer.relay_body":
    "Ein Funkgerät, das jemand laufen lässt, um das Mesh zu vergrößern. Es trägt Nachrichten, die es nicht lesen kann. Hier ist niemand, dem du schreiben könntest.",
  "mesh.peer.send_dm": "Eine Direktnachricht senden",
  "mesh.peer.message": "Nachricht",
  "mesh.peer.send_sats": "Ecash senden",
  "mesh.peer.amount_placeholder": "Betrag in Sats",
  "mesh.peer.amount_first": "Ecash senden, gib zuerst einen Betrag ein",
  "mesh.peer.cancel_send": "Ecash-Senden abbrechen",
  "mesh.peer.view_peer": "Peer {name} ansehen",
  "mesh.peer.view_peer_online": "Peer {name} ansehen, online",
  "mesh.peer.last_seen": "Zuletzt vor {ago} gesehen",
  "mesh.peer.send_amount": "{amount} Sats senden",
  "mesh.peer.direct": "Direktverbindung",
  "mesh.peer.check_distance": "Entfernung prüfen",
  "mesh.peer.checking": "Wird geprüft",
  "mesh.peer.no_reply": "Keine Antwort",
  "mesh.peer.no_reply_hint":
    "Die Person hat sich vielleicht bewegt, oder ihre App antwortet nicht",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Region",
  "mesh.level.province": "Provinz",
  "mesh.level.city": "Stadt",
  "mesh.level.neighborhood": "Viertel",
  "mesh.level.block": "Häuserblock",
  "mesh.level.building": "Gebäude",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Verfügbar",
  "wallet.balance.unit_hint": "Wechselt zwischen Satoshi und Bitcoin",
  "wallet.balance.a11y": "Guthaben {value} {unit}",
  "wallet.balance.locked":
    "Der Wallet-Speicher ist gesperrt. Ecash-Proofs liegen in einer verschlüsselten Datei, deren Schlüssel im Geräteschlüsselbund liegt, und sie konnte nicht geöffnet werden. Entsperre dein Gerät und öffne Airhop erneut.",
  "wallet.balance.tor_blocked":
    "Tor ist an, deshalb sind Mint-Anfragen blockiert: sie würden über das offene Netz laufen und deine IP mit deinen Proofs verknüpfen. Senden und Empfangen über das Mesh funktioniert weiterhin. Erlaube Mint-Verkehr unter Einstellungen, Sicherheit.",
  "wallet.balance.unconfirmed_note":
    "{amount} noch nicht mit dem Mint bestätigt",
  "wallet.balance.reserved_note":
    "{amount} für eine laufende Sendung reserviert",
  "wallet.balance.other_mint_note": "{amount} bei einem separaten Mint-Konto",
  "wallet.balance.test_mint_note":
    "Enthält Spielgeld von einem Test-Mint. Es ist kein Bitcoin und lässt sich nicht auszahlen.",
  "wallet.token": "Token",
  "wallet.action.send": "Ecash-Token senden",
  "wallet.action.send_disabled":
    "Ecash-Token senden, bei leerem Guthaben nicht verfügbar",
  "wallet.action.receive": "Ecash-Token empfangen",
  "wallet.action.zap": "Einen Nostr-Kontakt zappen",
  "wallet.action.zap_disabled":
    "Einen Nostr-Kontakt zappen, bei leerem Guthaben nicht verfügbar",
  "wallet.action.add_mint": "Einen Cashu-Mint hinzufügen",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Der Token konnte nicht erstellt werden",
  "wallet.send.title": "Ecash senden",
  "wallet.send.amount_in": "Betrag in {unit}",
  "wallet.send.body":
    "Offline aus Proofs erstellt, die du bereits hältst. Nichts verlässt dein Guthaben endgültig, bis du bestätigst, dass der Token angekommen ist.",
  "wallet.send.stale_fee_note":
    "Die Gebühren wurden zuletzt vor {days} Tag(en) geprüft. Falls dieser Mint seine Gebühr seitdem erhöht hat, kostet das Senden etwas mehr.",
  "wallet.send.fee_note":
    "{spend} {unit} verlassen dein Guthaben; die zusätzlichen {fee} decken die Mint-Gebühr, die sonst die Empfängerseite trüge",
  "wallet.send.qr_too_big":
    "Dieser Token ist auf zu viele Münzen aufgeteilt, um in einen QR-Code zu passen. Teile oder kopiere ihn stattdessen, oder aktualisiere beim Mint, um zusammenzufassen.",
  "wallet.send.bearer_note":
    "Wer diese Zeichenfolge hat, besitzt das Geld. Die Proofs sind reserviert, nicht ausgegeben: falls sie niemanden erreicht, kannst du sie unter Ausstehend zurückholen.",
  "wallet.send.qr_too_big_short":
    "Dieser Token ist auf zu viele Münzen aufgeteilt, um in einen QR-Code zu passen. Teile oder kopiere ihn stattdessen.",
  "wallet.send.scan_note":
    "Lass die andere Seite das aus ihrer Wallet scannen. Bis du es als zugestellt markierst, bleibt es zurückholbar.",
  "wallet.send.mesh_note":
    "Der Token geht als verschlüsselte DM über das Mesh raus. Kein Internet nötig.",
  "wallet.send.no_peers_note":
    "Öffne den Mesh-Tab, um Geräte in der Nähe zu finden, oder teile den Token auf anderem Weg.",
  "wallet.send.send_to": "An {name} senden",
  "wallet.send.memo": "Notiz (optional, reist mit dem Token)",
  "wallet.send.building": "Wird erstellt…",
  "wallet.send.build": "Token erstellen",
  "wallet.send.inexact_body":
    "Deine Proofs ergeben offline nicht genau {amount} {unit}. Der kleinste Token, den du bauen kannst, sind {spend} {unit}, und offline gibt es kein Wechselgeld: die zusätzlichen {extra} {unit} gehen an die Empfängerseite.\n\nEin Aktualisieren beim Mint mit Internet würde deine Proofs in Stückelungen aufteilen, die das genau ergeben.",
  "wallet.send.send_amount": "{amount} senden",
  "wallet.send.sent_to": "{amount} {unit} an {name} gesendet",
  "wallet.send.sent_to_body":
    "{route} Es bleibt unter Ausstehend zurückholbar, bis du bestätigst, dass es angekommen ist, oder bis der Mint uns meldet, dass die Proofs eingelöst wurden.",
  "wallet.send.copy_token": "Token kopieren",
  "wallet.send.share_token": "Token teilen",
  "wallet.send.open_in_wallet": "Diesen Token in einer anderen Wallet öffnen",
  "wallet.send.open_in_wallet_short": "In Wallet öffnen",
  "wallet.send.to_peer": "Token an einen Peer in der Nähe senden",
  "wallet.send.to_peer_short": "An Peer senden",
  "wallet.send.mark_delivered": "Als zugestellt markieren und abschließen",
  "wallet.send.they_got_it": "Ist angekommen",
  "wallet.send.keep_pending": "Diese Sendung ausstehend lassen",
  "wallet.send.decide_later": "Später entscheiden",
  "wallet.send.no_peers": "Keine Peers in Reichweite",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Das ist deine eigene Zahlung",
  "wallet.receive.own_payment_body":
    "Diese Münzen sind noch für eine Sendung reserviert, die du nicht abgeschlossen hast, es gibt also nichts einzulösen. Nutze Zurückholen bei dieser Zahlung, um sie direkt zurück ins Guthaben zu legen.",
  "wallet.receive.already_have": "Bereits in deiner Wallet",
  "wallet.receive.already_have_body":
    "Jeder Proof in diesem Token liegt bereits hier, es wurde also nichts hinzugefügt. Die Guthaben bleiben unverändert.",
  "wallet.receive.stored_unconfirmed":
    "Von {mint} gespeichert, aber noch nicht mit dem Mint bestätigt ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Bei {mint} eingelöst. Diese Proofs gehören jetzt allein dir: die Kopie der Absenderseite funktioniert nicht mehr.",
  "wallet.receive.memo_quoted": "\n\n„{memo}“",
  "wallet.receive.redeemed_at":
    "Bei {mint} eingelöst. Es gehört jetzt nachweislich dir: die Kopie dieses Tokens auf der Absenderseite funktioniert nicht mehr.",
  "wallet.receive.stored_pending":
    "Von {mint} gespeichert, aber der Mint hat noch nicht bestätigt, dass es unverbraucht ist{dleq}. Aktualisiere im Wallet-Tab, sobald du online bist.",
  "wallet.receive.dleq_inline":
    " (die Signatur stimmt allerdings, der Token ist also echt)",
  "wallet.receive.dleq_ok":
    "Die Signatur des Mints stimmt, der Token ist also echt.",
  "wallet.receive.dleq_uncached":
    "Die Schlüssel des Mints sind hier nicht zwischengespeichert, deshalb ließ sich die Signatur offline nicht prüfen.",
  "wallet.receive.dleq_warning":
    "Bis du online aktualisierst, könnte die Absenderseite es im Prinzip anderswo ausgegeben haben.",
  "wallet.receive.failed": "Empfang nicht möglich",
  "wallet.receive.title": "Ecash empfangen",
  "wallet.receive.body":
    "Füge einen Cashu-Token ein. Online wird er sofort beim Mint eingelöst; offline wird er gespeichert und beim nächsten Aktualisieren bestätigt.",
  "wallet.receive.scan": "Einen Ecash-QR-Code scannen",
  "wallet.receive.scan_short": "QR scannen",
  "wallet.receive.receiving": "Wird empfangen…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap von {from}… empfangen und in deine Wallet eingelöst.",
  "wallet.zap.title": "Eine Nostr-Identität zappen",
  "wallet.zap.not_npub": "kein npub",
  "wallet.zap.bad_key": "ungültiger Schlüssel",
  "wallet.zap.invalid_pubkey": "Ungültiger Pubkey",
  "wallet.zap.invalid_pubkey_body":
    "Gib einen npub1… oder einen 64-stelligen Nostr-Pubkey in Hex ein.",
  "wallet.zap.sent": "Nutzap gesendet",
  "wallet.zap.failed": "Zap fehlgeschlagen",
  "wallet.zap.body":
    "Wenn die Person NIP-61-Nutzap-Infos veröffentlicht, wird das Ecash an ihren Schlüssel gebunden, sodass es niemand sonst ausgeben kann und es sich nicht zurückholen lässt. Andernfalls geht es als zurückholbarer Token raus. Du erfährst, was davon passiert ist.",
  "wallet.zap.contact": "{name} zappen",
  "wallet.zap.pubkey_placeholder": "npub1… oder 64-stelliges Hex",
  "wallet.zap.sending": "Wird gesendet…",
  "wallet.nostr.copied_body":
    "Gib das jemandem weiter, und die Person kann dich aus Airhop oder jeder anderen Nostr-Wallet zappen, ganz ohne Bluetooth.",
  "wallet.nostr.copy_key":
    "Kopiere deinen Nostr-Schlüssel, damit Leute dich zappen können",
  "wallet.nostr.your_key": "Dein Nostr-Schlüssel",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint hinzugefügt",
  "wallet.mint.add_failed": "Mint konnte nicht hinzugefügt werden",
  "wallet.mint.added_named": "{name} hinzugefügt",
  "wallet.mint.added_body":
    "{mint} gibt {units} aus. Seine Schlüssel sind auf diesem Gerät zwischengespeichert, sodass Token von ihm jetzt auch ohne Internet überprüft werden können.",
  "wallet.mint.remove_plain":
    "{mint} aus deiner Wallet entfernen? Die zwischengespeicherten Schlüssel gehen mit, sodass Token von ihm offline nicht mehr überprüft werden können.",
  "wallet.mint.title": "Mints",
  "wallet.mint.none": "Noch kein Mint",
  "wallet.mint.none_desc":
    "Ein Mint gibt dein Ecash aus und löst es ein. Füge einen hinzu, um über Lightning einzuzahlen, oder empfange einfach einen Token, und sein Mint wird für dich hinzugefügt.",
  "wallet.mint.add": "Einen Mint hinzufügen",
  "wallet.mint.add_body":
    "Ein Mint hält das Bitcoin, das dein Ecash deckt, wähle also einen, dem du das Guthaben anvertrauen würdest, das du dort hältst. Die URL wird vor dem Speichern geprüft. Betreibe mit Nutshell deinen eigenen, wenn du niemandem vertrauen möchtest.",
  "wallet.mint.consolidate_body":
    "Ein Token kann immer nur einen Mint nennen, deshalb kann ein auf mehrere verteiltes Guthaben keinen Betrag zahlen, der größer ist als der größte Einzelbestand. Airhop kann es verschieben: jeder andere Mint zahlt eine Lightning-Rechnung, die der von dir gewählte ausstellt. Kostet eine kleine Routing-Gebühr und braucht Internet.",
  "wallet.mint.add_short": "Mint hinzufügen",
  "wallet.mint.checking": "Wird geprüft…",
  "wallet.mint.remove_with_balance": "Mint mit Guthaben entfernen?",
  "wallet.mint.remove": "Mint entfernen",
  "wallet.mint.delete_anyway": "Trotzdem löschen",
  "wallet.mint.consolidate": "Alle Guthaben auf einen Mint verschieben",
  "wallet.mint.confirm_with": "Proofs mit {mint} bestätigen",
  "wallet.mint.remove_a11y": "{mint} entfernen",
  "wallet.mint.available_amount": "{amount} {unit} verfügbar",
  "wallet.mint.split_across":
    "Guthaben auf {count} Mints verteilt. Verschiebe es auf einen.",
  "wallet.mint.move_everything_to": "Alles zu {mint} verschieben",
  "wallet.mint.consolidate_title": "Auf einen Mint verschieben",
  "wallet.mint.moving": "Wird verschoben…",
  "wallet.mint.move": "Verschieben",
  "wallet.mint.moved": "Verschoben",
  "wallet.mint.moved_body":
    "{amount} {unit} liegen jetzt bei {mint}, nach {fees} {unit} an Lightning-Routing-Gebühren.",
  "wallet.mint.nothing_moved": "Nichts verschoben",
  "wallet.mint.destination": "· Ziel",
  "wallet.mint.will_move": "· wird verschoben",
  "wallet.mint.issued_by": "Ausgegeben von",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop-Wallet-Aufladung",
  "wallet.ln.invoice_failed": "Die Rechnung konnte nicht erstellt werden",
  "wallet.ln.price_failed": "Diese Rechnung konnte nicht bepreist werden",
  "wallet.ln.paid": "Bezahlt",
  "wallet.ln.deposit_credited":
    "Rechnung bezahlt, und {amount} {unit} von {mint} ausgegeben. Dieses Guthaben ist bestätigt: du kannst es sofort offline ausgeben.",
  "wallet.ln.withdrawn":
    "{paid} Sats über Lightning gezahlt. Der Mint hat {fee} Sats an Routing-Gebühren berechnet.",
  "wallet.ln.withdrawn_with_change":
    "{paid} Sats über Lightning gezahlt. Der Mint hat {fee} Sats an Routing-Gebühren berechnet und {change} Sats der Reserve an dein Guthaben zurückgegeben.",
  "wallet.ln.payment_failed": "Zahlung fehlgeschlagen",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Verwandle Lightning-Sats in Ecash, das du offline ausgeben kannst, oder zahle Ecash an eine beliebige Lightning-Rechnung aus. Beides braucht Internet und einen Mint.",
  "wallet.ln.deposit_body":
    "Der Mint gibt dir eine Rechnung. Bezahle sie aus einer beliebigen Lightning-Wallet, und die Sats kommen als Ecash zurück, das du offline ausgeben kannst.",
  "wallet.ln.pay_invoice_for":
    "Bezahle diese Rechnung über {amount} {unit}. Die Wallet wartet auf die Zahlung und gibt dein Ecash automatisch aus.",
  "wallet.ln.expired_body":
    "Diese Rechnung ist abgelaufen. Falls du sie bereits bezahlt hast, wird das Guthaben automatisch gutgeschrieben.",
  "wallet.ln.waiting_expires": "Warte auf Zahlung · läuft in {countdown} ab",
  "wallet.ln.withdraw_body":
    "Füge eine bolt11-Rechnung ein, und der Mint bezahlt sie aus deinem Ecash. Zuerst wird dir die Routing-Reserve genannt; was das Routing davon nicht braucht, kommt an dein Guthaben zurück.",
  "wallet.ln.up_to": "bis zu {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} zahlen",
  "wallet.ln.deposit": "Sats über Lightning einzahlen",
  "wallet.ln.deposit_short": "Einzahlen",
  "wallet.ln.withdraw": "An eine Lightning-Rechnung auszahlen",
  "wallet.ln.withdraw_short": "Auszahlen",
  "wallet.ln.deposit_title": "Über Lightning einzahlen",
  "wallet.ln.amount_placeholder": "Betrag in Sats",
  "wallet.ln.requesting": "Wird angefordert…",
  "wallet.ln.get_invoice": "Rechnung holen",
  "wallet.ln.copy_invoice": "Rechnung kopieren",
  "wallet.ln.open_wallet": "In einer Lightning-Wallet öffnen",
  "wallet.ln.open_wallet_short": "In Wallet öffnen",
  "wallet.ln.waiting": "Warte auf Zahlung…",
  "wallet.ln.new_invoice": "Eine neue Rechnung erstellen",
  "wallet.ln.new_invoice_short": "Neue Rechnung",
  "wallet.ln.withdraw_title": "An Lightning auszahlen",
  "wallet.ln.scan_invoice": "Den QR-Code einer Lightning-Rechnung scannen",
  "wallet.ln.paid_from": "Bezahlt aus",
  "wallet.ln.invoice": "Rechnung",
  "wallet.ln.routing_reserve": "Routing-Reserve",
  "wallet.ln.reserved": "Aus dem Guthaben reserviert",
  "wallet.ln.paying": "Wird bezahlt…",
  "wallet.ln.get_quote": "Angebot holen",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Sicherung",
  "wallet.backup.setup_failed":
    "Die Sicherung konnte nicht eingerichtet werden",
  "wallet.backup.on": "Sicherung an",
  "wallet.backup.on_body":
    "Dein Guthaben lässt sich jetzt aus diesen zwölf Wörtern wiederherstellen.\n\nAlles, was du von jemand anderem bekommen hast, bleibt außerhalb der Phrase, bis du beim Mint aktualisierst, und die Wiederherstellung braucht deine Mint-Liste, notiere sie also neben den Wörtern.",
  "wallet.backup.no_phrase": "Keine Phrase gespeichert",
  "wallet.backup.no_phrase_body":
    "Die Wiederherstellungsphrase ließ sich nicht aus dem Geräteschlüsselbund lesen. Entsperre das Gerät und versuche es erneut.",
  "wallet.backup.replace_title": "Deine aktuelle Phrase ersetzen?",
  "wallet.backup.replace_body":
    "Du hast bereits eine Wiederherstellungsphrase. Eine andere wiederherzustellen ersetzt sie. Münzen, die die alte Phrase bereits abdeckt, bleiben auf diesem Gerät ausgebbar, sind aber nicht mehr wiederherstellbar. Stelle also sicher, dass die alten Wörter notiert sind, bevor du fortfährst.",
  "wallet.backup.replace": "Ersetzen",
  "wallet.backup.invalid_phrase": "Diese Phrase ist ungültig",
  "wallet.backup.invalid_phrase_body":
    "Die Phrase hat eine eingebaute Prüfsumme, und diese besteht sie nicht. Prüfe auf ein vertipptes, fehlendes oder vertauschtes Wort.",
  "wallet.backup.not_bip39":
    "Das sind keine BIP-39-Wörter: {words}. Prüfe die Schreibweise.",
  "wallet.backup.add_mint_first": "Füge zuerst einen Mint hinzu",
  "wallet.backup.add_mint_first_body":
    "Die Wiederherstellung fragt einen Mint, welche Münzen er für dich signiert hat, sie muss also wissen, welchen sie fragen soll. Füge die Mints hinzu, die du genutzt hast, und stelle dann wieder her.",
  "wallet.backup.restore_failed": "Wiederherstellung fehlgeschlagen",
  "wallet.backup.phrase": "Wiederherstellungsphrase",
  "wallet.backup.state_unconfirmed": "Sicherung an, aber nicht bestätigt",
  "wallet.backup.state_off": "Sicherung aus",
  "wallet.backup.badge_on": "An",
  "wallet.backup.badge_unconfirmed": "Unbestätigt",
  "wallet.backup.badge_off": "Aus",
  "wallet.backup.view": "Wiederherstellungsphrase ansehen",
  "wallet.backup.setup": "Wiederherstellungsphrase einrichten",
  "wallet.backup.view_short": "Phrase ansehen",
  "wallet.backup.setup_short": "Einrichten",
  "wallet.backup.restore":
    "Eine Wallet aus einer Wiederherstellungsphrase wiederherstellen",
  "wallet.backup.restore_short": "Wiederherstellen",
  "wallet.backup.setup_title": "Eine Wiederherstellungsphrase einrichten",
  "wallet.backup.on_body_short":
    "Dein Guthaben lässt sich auf einem neuen Gerät aus deinen zwölf Wörtern wiederherstellen.",
  "wallet.backup.unconfirmed_body":
    "Du hast nie bestätigt, dass du sie notiert hast. Im Moment existieren die Wörter nur auf diesem Telefon, und genau das ist das Einzige, was eine Sicherung überstehen soll. Sieh dir die Phrase an und schreibe sie auf.",
  "wallet.backup.not_covered":
    "{amount} ist noch nicht abgedeckt. Münzen, die du bekommen hast, tragen die Geheimnisse der Absenderseite, sie fallen also erst unter deine Phrase, sobald sie getauscht wurden. Aktualisiere einen Mint, um sie abzusichern.",
  "wallet.backup.off_body":
    "Dein Ecash existiert nur auf diesem Telefon. Wenn du es verlierst, kann niemand das Geld wiederherstellen, auch du nicht. Eine Wiederherstellungsphrase besteht aus zwölf Wörtern, mit denen sich dein Guthaben überall wieder aufbauen lässt.",
  "wallet.backup.about_to_see":
    "Du siehst gleich zwölf Wörter. Sie sind das Geld.",
  "wallet.backup.exact_order":
    "Zwölf Wörter, in genau dieser Reihenfolge. Wer sie hat, hat dein Guthaben.",
  "wallet.backup.verify_body":
    "Eine Phrase, die niemand notiert hat, ist schlimmer als gar keine, weil sie wie ein Sicherheitsnetz aussieht, das nicht da ist. Zwei Wörter zur Bestätigung.",
  "wallet.backup.verify_mismatch":
    "Das stimmt nicht überein. Prüfe deine notierte Kopie.",
  "wallet.backup.restore_body":
    "Gib die zwölf Wörter ein. Airhop leitet deine Münzen neu ab und fragt jeden Mint, welche davon er signiert hat, sodass das Guthaben aus den Aufzeichnungen des Mints zurückkommt.",
  "wallet.backup.warn_secret":
    "Wer sie liest, kann dein Guthaben nehmen. Mach keinen Screenshot davon und speichere sie nicht auf diesem Telefon.",
  "wallet.backup.warn_paper":
    "Schreibe sie auf Papier und bewahre es sicher auf. Airhop kann sie dir nicht noch einmal zeigen, wenn das Telefon weg ist.",
  "wallet.backup.warn_scope":
    "Sie stellen nur dein Ecash wieder her. Deine Identität, Chats und Kontakte sind nicht abgedeckt.",
  "wallet.backup.warn_mints":
    "Die Wiederherstellung muss einen Mint fragen, welche Münzen er signiert hat, notiere also deine Mint-Liste neben den Wörtern.",
  "wallet.backup.preparing": "Wird vorbereitet…",
  "wallet.backup.show_phrase": "Meine Phrase anzeigen",
  "wallet.backup.your_phrase": "Deine Wiederherstellungsphrase",
  "wallet.backup.write_down": "Schreibe diese auf",
  "wallet.backup.copy_phrase":
    "Wiederherstellungsphrase in die Zwischenablage kopieren",
  "wallet.backup.copy_clipboard": "In die Zwischenablage kopieren",
  "wallet.backup.written_down": "Ich habe sie aufgeschrieben",
  "wallet.backup.check_copy": "Prüfe deine Kopie",
  "wallet.backup.confirm": "Bestätigen",
  "wallet.backup.restore_title": "Aus einer Phrase wiederherstellen",
  "wallet.backup.phrase_placeholder":
    "zwölf Wörter, durch Leerzeichen getrennt",
  "wallet.backup.no_mints_yet":
    "Noch keine Mints hinzugefügt. Die Wiederherstellung muss einen bestimmten Mint fragen, füge also zuerst die hinzu, die du genutzt hast.",
  "wallet.backup.scanning": "Wird durchsucht…",
  "wallet.backup.restore_progress": "{mint} · Keyset {step} von {total}",
  "wallet.backup.will_scan":
    "Wird durchsucht: {mints}. Ein Mint, den du nicht hinzugefügt hast, wird nie gefragt, sein Guthaben bleibt also unsichtbar.",
  "wallet.backup.word_n": "Wort {position}",
  "wallet.backup.unreachable_mints":
    "Nicht erreichbar: {mints}. Ein Guthaben dort ist weiterhin vorhanden. Versuche es mit einer besseren Verbindung erneut.",
  "wallet.backup.nothing_recovered":
    "Aus den durchsuchten Mints wurde nichts wiederhergestellt.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Als erhalten markieren?",
  "wallet.delivered.body":
    "Das gibt {amount} {unit} endgültig frei. Falls es nie angekommen ist, kannst du es nicht mehr zurückholen.",
  "wallet.delivered.body_generic":
    "Das gibt den reservierten Betrag endgültig frei. Falls er nie angekommen ist, kannst du ihn nicht mehr zurückholen.",
  "wallet.delivered.cancel": "Noch nicht",
  "wallet.delivered.confirm": "Ist angekommen",
  "wallet.reclaim.title": "Diesen Token zurückholen?",
  "wallet.reclaim.body":
    "Die {amount} {unit} gehen zurück in dein Guthaben. Tu das nur, wenn der Token nie jemanden erreicht hat: falls die andere Seite die Zeichenfolge bereits hat, behält das Geld, wer sie zuerst beim Mint einlöst, und das könnte sie sein.",
  "wallet.reclaim.keep": "Ausstehend lassen",
  "wallet.reclaim.confirm": "Zurückholen",
  "wallet.copied.token_body":
    "Der Token liegt in deiner Zwischenablage. Er bleibt hier reserviert, bis du ihn als zugestellt markierst, du kannst ihn also erneut einfügen, falls der erste Versuch scheitert.",
  "wallet.copied.phrase_body":
    "Füge sie in einen Passwortmanager ein und leere dann deine Zwischenablage. Andere Apps können die Zwischenablage lesen, und in manchen Konfigurationen wird sie mit deinen anderen Geräten synchronisiert.",
  "wallet.refresh.failed": "Aktualisieren fehlgeschlagen",
  "wallet.refresh.partly": "Teilweise aktualisiert",
  "wallet.refresh.done": "Aktualisiert",
  "wallet.refresh.unreachable":
    "{mints} nicht erreichbar. Alles andere ist auf dem neuesten Stand.",
  "wallet.refresh.swapped":
    "{amount} {unit} bestätigt und gegen frische Proofs getauscht.",
  "wallet.refresh.secured":
    "{amount} {unit} sind jetzt von deiner Wiederherstellungsphrase abgedeckt.",
  "wallet.refresh.all_confirmed":
    "Alles hier war bereits mit dem Mint bestätigt.",
  "wallet.pending.title": "Ausstehend",
  "wallet.pending.reserved_desc":
    "Erstellt und reserviert, Zustellung unbestätigt. Die Proofs werden aus deinem Guthaben herausgehalten, damit sie nicht doppelt ausgegeben werden.",
  "wallet.pending.locked_desc":
    "Bereits an den Schlüssel der Empfängerseite gebunden, sodass nur sie es ausgeben kann. Es hat sie nur noch nicht erreicht. Teile den Token, um abzuschließen.",
  "wallet.pending.show_qr": "Diesen Token als QR-Code anzeigen",
  "wallet.pending.copy_again": "Den Token erneut kopieren",
  "wallet.pending.share_again": "Den Token erneut teilen",
  "wallet.pending.mark_delivered": "Diesen Token als zugestellt markieren",
  "wallet.pending.delivered": "Zugestellt",
  "wallet.pending.reclaim_into": "Diesen Token in dein Guthaben zurückholen",
  "wallet.activity.title": "Aktivität",
  "wallet.activity.none": "Noch nichts",
  "wallet.activity.none_desc":
    "Zahlungen, die du sendest und empfängst, erscheinen hier, die neuesten zuerst, jeweils mit Mint und Gebühr.",
  "wallet.activity.show_fewer": "Weniger Zahlungen anzeigen",
  "wallet.activity.show_less": "Weniger anzeigen",
  "wallet.activity.received_unconfirmed": "Empfangen, unbestätigt",
  "wallet.activity.received": "Empfangen",
  "wallet.activity.receive_failed": "Empfang fehlgeschlagen",
  "wallet.activity.reclaimed": "Zurückgeholt",
  "wallet.activity.send_failed": "Senden fehlgeschlagen",
  "wallet.activity.sent": "Gesendet",
  "wallet.activity.status_pending": "ausstehend",
  "wallet.activity.status_failed": "fehlgeschlagen",
  "wallet.activity.status_reclaimed": "zurückgeholt",
  "wallet.activity.status_expired": "abgelaufen",
  "wallet.activity.ln_deposit": "Lightning-Einzahlung",
  "wallet.activity.ln_withdrawal": "Lightning-Auszahlung",
  "wallet.activity.nutzap_received": "Nutzap empfangen",
  "wallet.activity.spent_removed": "Ausgegebene Proofs entfernt",
  "wallet.activity.refreshed": "Proofs aktualisiert",
  "wallet.activity.refreshing": "Proofs werden aktualisiert",
  "wallet.activity.just_now": "gerade eben",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh offline",
  "wallet.mesh_offline_body":
    "Der Mesh-Dienst läuft nicht, es gibt also niemanden, dem der Token übergeben werden könnte. Er bleibt unter Ausstehend reserviert.",
  "wallet.xfer.route_mesh": "Direkt über das Mesh an ihr Gerät übergeben.",
  "wallet.xfer.route_nostr":
    "Die Person war außerhalb der Bluetooth-Reichweite, deshalb ging es stattdessen über das Internet.",
  "wallet.xfer.route_courier":
    "Gerade gibt es keine Route dorthin. Es wird von anderen Geräten mitgenommen und zugestellt, sobald eines sie erreicht.",
  "wallet.xfer.route_queued":
    "Die Person ist noch nicht erreichbar. Es steht in der Warteschlange und geht raus, sobald sie es ist.",
  "wallet.xfer.mesh_offline_body":
    "Der Mesh-Dienst läuft nicht, es gibt also keine Möglichkeit, den Token zu übergeben. Es wurde nichts abgezogen.",
  "wallet.xfer.could_not_send": "Senden nicht möglich",
  "wallet.xfer.inexact_body":
    "Deine Proofs ergeben offline nicht genau {amount} {unit}. Der kleinste Token, den du bauen kannst, sind {spend} {unit}, und die zusätzlichen {extra} {unit} gehen an die andere Seite, ohne dass du sie zurückbekommst.\n\nEin Aktualisieren beim Mint mit Internet teilt deine Proofs in Stückelungen auf, die das genau ergeben.",
  "wallet.xfer.send_amount": "{amount} senden",
  "wallet.xfer.mesh_offline": "Mesh offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "An ihren Schlüssel gebunden und auf Nostr veröffentlicht. Es gehört ihnen, ob sie online sind oder nicht.",
  "wallet.pay.rail_nutzap_dm":
    "An ihren Schlüssel gebunden. Das Relay hat es nicht angenommen, deshalb ging es stattdessen als Nachricht raus.",
  "wallet.pay.rail_nutzap_undelivered":
    "An ihren Schlüssel gebunden, aber noch konnte es nichts tragen. Es steht in der Warteschlange, und der Token liegt unter Ausstehend.",
  "wallet.pay.final":
    "Gebundene Zahlungen lassen sich nicht zurückholen: nur ihr Schlüssel kann diese Münzen jetzt noch ausgeben.",
  "wallet.pay.reclaimable":
    "Es bleibt im Wallet-Tab zurückholbar, bis du bestätigst, dass es angekommen ist.",
  "wallet.pay.why": "So gesendet, weil {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} an {name}",
  "wallet.pay.thread_receipt":
    "Du hast {amount} {unit} gesendet, gebunden an ihren Schlüssel.",
  "wallet.pay.title": "Ecash senden",
  "wallet.pay.to": "An {name}",
  "wallet.pay.amount": "Betrag in Sats",
  "wallet.pay.memo": "Notiz (optional, öffentlich)",
  "wallet.pay.send": "Senden",
  "wallet.pay.sending": "Wird gesendet…",
  "wallet.pay.action": "Ecash senden",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Kamerazugriff",
  "wallet.scan.camera_purpose": "einen Ecash-QR-Code zu scannen",
  "wallet.scan.photo_label": "Fotozugriff",
  "wallet.scan.photo_purpose": "einen Ecash-QR aus einem Bild zu lesen",
  "wallet.scan.no_token": "In diesem Bild wurde kein Ecash-Token gefunden.",
  "wallet.scan.no_invoice":
    "In diesem Bild wurde keine Lightning-Rechnung gefunden.",
  "wallet.scan.unreadable": "Dieses Bild konnte nicht gelesen werden.",
  "wallet.scan.camera_failed":
    "Die Kamera konnte nicht gestartet werden. Schließe andere Kamera-Apps und versuche es erneut.",
  "wallet.scan.close": "Scanner schließen",
  "wallet.scan.on_device":
    "Es wird auf diesem Gerät gelesen; nichts wird irgendwohin gesendet.",
  "wallet.scan.aim_token": "Richte die Kamera auf einen Ecash-QR-Code.",
  "wallet.scan.aim_invoice":
    "Richte die Kamera auf den QR-Code einer Lightning-Rechnung.",
  "wallet.scan.title_token": "Ecash scannen",
  "wallet.scan.title_invoice": "Rechnung scannen",
  "wallet.scan.desc_token":
    "Lies einen Cashu-Token aus einer anderen Wallet. Funktioniert mit jeder Cashu-Wallet, nicht nur mit Airhop.",
  "wallet.scan.desc_invoice":
    "Lies eine Lightning-Rechnung, um sie aus deinem Guthaben zu bezahlen.",
  "wallet.scan.use_camera_a11y": "Mit der Kamera scannen",
  "wallet.scan.use_camera": "Kamera nutzen",
  "wallet.scan.pick_image_a11y":
    "Einen QR-Code aus einem gespeicherten Bild lesen",
  "wallet.scan.pick_image": "Aus Fotos wählen",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Was ist Cashu?",
  "wallet.explain.intro":
    "Cashu ist Ecash für Bitcoin. Ein Token ist eine Zeichenfolge, die für ihren Inhaber Geld wert ist, blind von einem Mint signiert, sodass der Mint nicht erkennen kann, wer was ausgegeben hat. Keine Konten, keine Anmeldungen.",
  "wallet.explain.send": "Senden",
  "wallet.explain.send_desc":
    "Macht aus einem Betrag einen Token, den du einem Peer in der Nähe über Bluetooth übergeben oder als Text teilen kannst. Funktioniert ohne Internet. Die Proofs bleiben reserviert, bis du bestätigst, dass er angekommen ist.",
  "wallet.explain.receive": "Empfangen",
  "wallet.explain.receive_desc":
    "Füge einen Token ein, um ihn hinzuzufügen. Online wird er sofort beim Mint getauscht, was ihn nachweislich zu deinem macht. Offline wird er gespeichert und als unbestätigt markiert, bis du aktualisierst.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Bezahlt eine Nostr-Identität. Wenn die Person NIP-61-Nutzap-Infos veröffentlicht, wird das Ecash an ihren Schlüssel gebunden, sodass nur sie es ausgeben kann. Sonst greift eine verschlüsselte DM. Braucht Internet.",
  "wallet.explain.add_mint": "Mint hinzufügen",
  "wallet.explain.add_mint_desc":
    "Speichert den Mint, der dein Ecash ausgibt und einlöst, und legt seine öffentlichen Schlüssel ab, damit Token von ihm offline überprüft werden können. Wähle einen Mint, dem du das Guthaben anvertrauen würdest, das du dort hältst.",
  "wallet.explain.phrase": "Wiederherstellungsphrase",
  "wallet.explain.phrase_desc":
    "Deine Münzen werden aus zwölf Wörtern abgeleitet, die die Wallet zu Beginn erzeugt, sodass ein neues Telefon das Guthaben wieder aufbauen kann, indem es deine Mints fragt, welche Münzen sie signiert haben. Bis du sie ansiehst und notierst, existieren sie nur auf diesem Telefon.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Wallet gesperrt",
  "wallet.err.mint_unreachable": "Mint nicht erreichbar",
  "wallet.err.tor_blocked": "Blockiert, solange Tor an ist",
  "wallet.err.insufficient": "Guthaben reicht nicht",
  "wallet.err.exact_amount": "Dieser genaue Betrag lässt sich nicht senden",
  "wallet.err.no_mint": "Kein Mint",
  "wallet.err.mint_unsupported": "Der Mint kann das nicht",
  "wallet.err.mint_refused": "Mint hat abgelehnt",
  "wallet.err.unreadable": "Unlesbarer Token",
  "wallet.err.rejected": "Token abgelehnt",
  "wallet.err.already_spent": "Bereits ausgegeben",
  "wallet.err.change_pending": "Bezahlt, Wechselgeld ausstehend",
  "wallet.svc.mint_unreachable": "Der Mint war nicht erreichbar.",
  "wallet.svc.tor_ios": "Mint-Anfragen laufen unter iOS nicht über Tor.",
  "wallet.svc.tor_ios_body":
    "Arti umschließt nur Nostr-WebSockets, deshalb würde diese Anfrage den Mint über das offene Netz erreichen und deine IP mit diesen Proofs verknüpfen. Erlaube es unter Einstellungen > Sicherheit, oder schalte Tor zuerst aus. Ecash über das Mesh zu senden und zu empfangen funktioniert weiterhin.",
  "wallet.svc.tor_paused": "Tor ist an, aber nicht verbunden.",
  "wallet.svc.tor_paused_body":
    "Orbot leitet nichts mehr weiter, deshalb würde diese Anfrage den Mint über das offene Netz erreichen und deine IP mit diesen Proofs verknüpfen. Starte Orbot wieder, oder schalte Tor aus. Ecash über das Mesh zu senden und zu empfangen funktioniert weiterhin.",
  "wallet.svc.keys_uncached":
    "Die Schlüssel dieses Mints sind auf diesem Gerät nicht zwischengespeichert.",
  "wallet.svc.keys_uncached_body":
    "Öffne die Wallet einmal mit Internet, um sie zu holen.",
  "wallet.svc.phrase_invalid": "Diese Wiederherstellungsphrase ist ungültig.",
  "wallet.svc.phrase_invalid_body":
    "Prüfe auf ein vertipptes oder fehlendes Wort. Die Phrase hat eine eingebaute Prüfsumme, deshalb macht ein einziges falsches Wort das Ganze ungültig.",
  "wallet.svc.need_mint": "Füge zuerst mindestens einen Mint hinzu.",
  "wallet.svc.need_mint_body":
    "Die Wiederherstellung fragt einen Mint, welche Münzen er für dich signiert hat, sie muss also wissen, welchen sie fragen soll.",
  "wallet.svc.restored": "Aus der Wiederherstellungsphrase wiederhergestellt",
  "wallet.svc.storage_locked": "Der Wallet-Speicher ist gesperrt.",
  "wallet.svc.storage_locked_body":
    "Airhop hält Ecash-Proofs in einer verschlüsselten Datei, deren Schlüssel im Geräteschlüsselbund liegt. Entsperre das Gerät und öffne die App erneut.",
  "wallet.svc.bad_url": "Das ist keine gültige URL.",
  "wallet.svc.needs_https": "Eine Mint-URL muss mit https:// beginnen.",
  "wallet.svc.refuse_http": "Ein Mint über einfaches http wird abgelehnt.",
  "wallet.svc.refuse_http_body":
    "Jede Person auf dem Netzwerkpfad könnte deine Proofs lesen oder verändern. Nutze einen https://-Mint.",
  "wallet.svc.mint_not_saved": "Der Mint konnte nicht gespeichert werden.",
  "wallet.svc.unreadable_token": "Das ist kein lesbarer Cashu-Token.",
  "wallet.svc.unreadable_token_body":
    "Token beginnen mit cashuA oder cashuB. Prüfe, ob beim Kopieren nichts abgeschnitten wurde.",
  "wallet.svc.wrong_mint":
    "Dieser Token wurde nicht von dem Mint signiert, den er nennt.",
  "wallet.svc.already_spent": "Diese Proofs wurden bereits ausgegeben.",
  "wallet.svc.already_spent_body":
    "Wer diesen Token gesendet hat, hat ihn zuerst eingelöst, oder denselben Token an jemand anderen geschickt.",
  "wallet.svc.receiving_offline": "Empfang offline",
  "wallet.svc.amount_positive": "Gib einen Betrag größer als null ein.",
  "wallet.svc.coins_raced":
    "Diese Münzen wurden gerade von einer anderen Zahlung verwendet.",
  "wallet.svc.coins_raced_body":
    "Es wurde nichts abgezogen. Versuche es erneut, dann wählt die Wallet einen anderen Satz.",
  "wallet.svc.no_ecash": "Noch kein Ecash.",
  "wallet.svc.no_ecash_body":
    "Füge einen Mint hinzu und zahle über Lightning ein, oder empfange einen Token von jemandem.",
  "wallet.svc.split_across_mints":
    "Dein Guthaben ist auf mehrere Mints verteilt.",
  "wallet.svc.mint_says_spent":
    "Der Mint hat diese Proofs als bereits ausgegeben gemeldet.",
  "wallet.svc.issue_against_invoice":
    "Ecash gegen eine Lightning-Rechnung auszugeben",
  "wallet.svc.pay_invoice": "eine Lightning-Rechnung zu bezahlen",
  "wallet.svc.unknown_deposit": "Unbekannte Einzahlung.",
  "wallet.svc.invoice_expired_before":
    "Die Rechnung ist abgelaufen, bevor sie bezahlt wurde.",
  "wallet.svc.invoice_expired": "Diese Rechnung ist abgelaufen.",
  "wallet.svc.invoice_unpaid": "Die Rechnung wurde noch nicht bezahlt.",
  "wallet.svc.payment_unknown":
    "Zahlungsstatus unbekannt; wird beim nächsten Aktualisieren erneut geprüft.",
  "wallet.svc.melt_change_pending": "Deine Rechnung wurde bezahlt.",
  "wallet.svc.melt_change_pending_body":
    "Der Mint hat die ungenutzte Routing-Gebühr noch nicht zurückgegeben. Sie wird beim nächsten Aktualisieren automatisch geholt, und in der Zwischenzeit geht nichts verloren.",
  "wallet.svc.mint_did_not_pay":
    "Der Mint hat diese Rechnung nicht bezahlt. Dein Guthaben ist unverändert.",
  "wallet.svc.not_an_invoice": "Das ist keine Lightning-Rechnung.",
  "wallet.svc.not_an_invoice_body":
    "Füge eine bolt11-Rechnung ein, die mit lnbc beginnt.",
  "wallet.svc.insufficient_for_invoice":
    "Das Guthaben reicht für diese Rechnung nicht.",
  "wallet.svc.coins_raced_invoice_body":
    "Es wurde nichts abgezogen, und die Rechnung wurde nicht bezahlt. Versuche es erneut.",
  "wallet.svc.same_mint": "Wähle einen anderen Ziel-Mint.",
  "wallet.svc.same_mint_body":
    "Quelle und Ziel sind derselbe Mint, es gibt also nichts zu verschieben.",
  "wallet.svc.quote_failed_retried":
    "Angebot fehlgeschlagen, Zusammenfassung erneut versucht",
  "wallet.svc.amount_unfit_retried":
    "Betrag passte nicht, Zusammenfassung erneut versucht",
  "wallet.svc.cannot_size":
    "Die Größe dieser Übertragung ließ sich nicht bestimmen.",
  "wallet.svc.insufficient_at_mint": "Nicht genug Guthaben bei {mint}.",
  "wallet.svc.inexact_title":
    "Deine Proofs ergeben offline nicht genau {amount} {unit}.",
  "wallet.svc.inexact_detail":
    "Der kleinste Token, den du senden kannst, sind {spend} {unit}. Offline gibt es kein Wechselgeld, deshalb gehen die zusätzlichen {extra} {unit} an die Empfängerseite.",
  "wallet.svc.no_single_mint":
    "Kein einzelner Mint hält {amount} {unit}. Ecash von verschiedenen Mints lässt sich nicht zu einem Token verbinden: fasse es zuerst bei einem Mint zusammen, oder sende in getrennten Beträgen.",
  "wallet.svc.have_tried_send":
    "Du hast {total} {unit} und wolltest {amount} senden.",
  "wallet.svc.invoice_needs":
    "Diese Rechnung braucht {total} {unit} einschließlich der Routing-Reserve, und du hast {balance}.",
  "wallet.svc.nothing_to_move": "{mint} hat keine {unit} zu verschieben.",
  "wallet.svc.consolidate_memo": "Zusammenfassen von {mint}",
  "wallet.svc.cannot_size_detail":
    "Nach Lightning-Routing-Gebühren kann {from} keinen sinnvollen Betrag zu {to} verschieben. Versuche stattdessen, einen bestimmten kleineren Betrag zu verschieben.",
  "wallet.svc.mint_cannot": "{mint} kann {action} nicht.",
  "wallet.svc.no_nut": "Der Mint gibt NUT-{nut} nicht an.",
  "wallet.svc.unknown_mint":
    "Diese Zahlung nennt einen Mint, den du nicht nutzt.",
  "wallet.svc.unknown_mint_body":
    "Füge den Mint zuerst selbst hinzu, wenn du ihm vertraust; von einem Mint, den du nicht gewählt hast, wird nichts eingelöst.",
  "wallet.svc.no_relay": "keine Relay-Verbindung",
  "wallet.svc.no_shared_mint":
    "kein gemeinsamer Mint mit ausreichendem Guthaben",
  "wallet.svc.no_nutzap_info":
    "die Empfängerseite hat keine Nutzap-Infos veröffentlicht (NIP-61 Kind 10019)",
  "wallet.svc.locked_undelivered":
    "An ihren Schlüssel gebunden, aber noch nicht zugestellt. Teile den Token aus dieser Transaktion, um sie abzuschließen.",
  "wallet.svc.swap_lost":
    "Der Mint hat diesen Tausch nie abgeschlossen, es wurde also nichts dagegen ausgegeben.",
  "wallet.svc.swap_unreadable":
    "Dieser Tausch wurde in einer Form gespeichert, die diese Version nicht erneut ausführen kann.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Per QR verifiziert",
  "contacts.qr.keys_unverified": "Schlüssel erhalten, nicht verifiziert",
  "contacts.qr.not_verified": "Noch nicht verifiziert",
  "contacts.qr.message": "Nachricht",
  "contacts.qr.add": "Kontakt hinzufügen",
  "contacts.qr.scan_title": "QR-Code scannen",
  "contacts.qr.aim": "Richte deine Kamera auf ihren QR-Code",
  "contacts.qr.add_desc":
    "Erreiche jemanden, der nicht in der Nähe im Mesh ist.",
  "contacts.qr.peer_id_hint":
    "Eine Peer-ID hat 16 Zeichen. Ein Kontaktcode beginnt mit airhop:.",
  "contacts.qr.or_scan": "oder scanne ihren QR",
  "contacts.qr.trust_note":
    "Nur ein QR, den du mit deiner Kamera scannst, verifiziert ihren Schlüssel. Ein eingefügter Code enthält ihre Schlüssel, aber keinen Beleg, dass er von ihnen stammt.",
  "contacts.qr.peer_id": "Peer-ID oder Kontaktcode",
  "contacts.qr.peer_id_placeholder": "Eine ID oder einen Kontaktcode einfügen",
  "contacts.qr.scan_camera_a11y": "QR-Code mit der Kamera scannen",
  "contacts.qr.scan_camera_desc": "Nutze deine Kamera",
  "contacts.qr.upload_a11y": "QR-Bild aus der Galerie hochladen",
  "contacts.qr.upload": "Aus der Galerie hochladen",
  "contacts.qr.upload_desc": "Ein gespeichertes QR-Bild auswählen",
  "contacts.qr.scan_a11y": "Kontakt durch Scannen eines QR-Codes hinzufügen",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Füge eine 16-stellige Peer-ID, einen airhop://peer/…-Link oder einen Kontaktcode ein.",
  "contacts.scan.camera_label": "Kamerazugriff",
  "contacts.scan.camera_purpose": "den QR-Code eines Kontakts zu scannen",
  "contacts.scan.camera_needed":
    "Zum Scannen wird Kamerazugriff benötigt. Du kannst weiterhin per Peer-ID hinzufügen.",
  "contacts.scan.camera_failed":
    "Die Kamera konnte nicht gestartet werden. Schließe andere Kamera-Apps und versuche es erneut.",
  "contacts.scan.photo_label": "Fotozugriff",
  "contacts.scan.photo_purpose":
    "einen QR-Code zu scannen, den du gespeichert hast",
  "contacts.scan.photo_needed":
    "Zum Auswählen eines Bildes wird Fotozugriff benötigt. Du kannst weiterhin per Peer-ID hinzufügen.",
  "contacts.scan.no_qr": "In diesem Bild wurde kein Airhop-QR-Code gefunden.",
  "contacts.scan.unreadable": "Aus diesem Bild ließ sich kein QR-Code lesen.",
  "contacts.scan.bitchat_expired":
    "Dieser bitchat-Code ist abgelaufen. Bitte die Person, ihren QR erneut zu öffnen.",
  "contacts.scan.tampered":
    "Dieser QR-Code ist ungültig: seine Peer-ID passt nicht zu seinen Schlüsseln. Er wurde möglicherweise manipuliert.",
  "contacts.scan.already_added": "Schon in deinen Kontakten",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Warte auf Kamerazugriff…",
  "contacts.verify.camera_off": "Kamera ist aus",
  "contacts.verify.open_settings": "Einstellungen öffnen",
  "contacts.verify.verified": "Verifiziert",
  "contacts.verify.different": "Anderer Kontakt",
  "contacts.verify.scan_again": "Erneut scannen",
  "contacts.verify.failed": "Verifizierung nicht möglich",
  "contacts.verify.done": "Fertig",
  "contacts.verify.title": "{name} verifizieren",
  "contacts.verify.aim": "Richte deine Kamera auf ihren QR-Code",
  "contacts.verify.camera_off_body":
    "Schalte den Kamerazugriff in den Einstellungen ein, um per QR zu verifizieren.",
  "contacts.verify.match_body":
    "Der Schlüssel von {name} stimmt überein. Du kannst diesem Kontakt vertrauen.",
  "contacts.verify.different_body":
    "Dieser QR gehört jemand anderem. Bitte {name}, den eigenen Code zu zeigen.",
  "contacts.verify.tampered_body":
    "Dieser QR sieht manipuliert aus: seine ID passt nicht zu seinem Schlüssel.",
  "contacts.verify.choose_title": "Wie möchtest du prüfen?",
  "contacts.verify.choose_body":
    "Beides bestätigt, dass die Schlüssel auf diesem Telefon wirklich zu {name} gehören.",
  "contacts.verify.method_scan": "Ihren Code scannen",
  "contacts.verify.method_scan_sub": "Sie sind hier bei dir",
  "contacts.verify.method_compare": "Einen Code vergleichen",
  "contacts.verify.method_compare_sub":
    "Lest ihn euch am Telefon gegenseitig vor",
  "contacts.verify.no_keys":
    "Für diesen Kontakt gibt es noch keine Schlüssel. Schreibe der Person, oder scanne ihren Code, wenn ihr euch trefft.",
  "contacts.verify.compare_title": "Lest euch das gegenseitig vor",
  "contacts.verify.compare_body":
    "{name} sieht dieselben sechs Wörter. Wenn sie übereinstimmen, wisst ihr beide, dass die Schlüssel echt sind.",
  "contacts.verify.codes_match": "Sie stimmen überein",
  "contacts.verify.codes_differ": "Sie stimmen nicht überein",
  "contacts.verify.compared_body":
    "Du und {name} habt denselben Code bestätigt. Dieser Kontakt ist verifiziert.",

  // ---- Settings: shared chrome ----
  "settings.back": "Zurück",
  "settings.coming_soon": "Bald verfügbar",
  "settings.opens_externally": "{label}, öffnet außerhalb der App",
  "settings.peer_id": "Peer-ID",
  "settings.share_peer_id": "Deine Peer-ID teilen",
  "settings.share_id_short": "ID teilen",
  "settings.peer_id_sheet.title": "Deine Peer-ID",
  "settings.peer_id_sheet.copy": "Peer-ID kopieren",
  "settings.peer_id_sheet.note":
    "Das funktioniert nur, wenn ihr beide in Bluetooth-Reichweite seid. Damit dir jemand von überall schreiben kann, teile stattdessen deinen QR-Code.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Allgemein",
  "settings.section.general_desc":
    "Optionale Funktionen, Senden rückgängig, Medien, Zurücksetzen",
  "settings.section.privacy": "Privatsphäre & Sicherheit",
  "settings.section.privacy_desc":
    "Forward Secrecy, signierte Pakete, blockierte Peers",
  "settings.section.network": "Netzwerk & Relays",
  "settings.section.network_desc":
    "Internet-Rückfallebene, Nostr-Relays, bitchat-Kompatibilität",
  "settings.section.permissions": "Berechtigungen",
  "settings.section.permissions_desc":
    "Bluetooth, Standort, Mitteilungen, Kamera, Mikrofon",
  "settings.section.storage": "Speicher & Daten",
  "settings.section.diagnostics": "Diagnose",

  // ---- Settings: group headings ----
  "settings.group.transports": "Übertragungswege",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "In der Nähe",
  "settings.group.sync": "Sync",
  "settings.group.features": "Funktionen",
  "settings.group.messages": "Nachrichten",
  "settings.group.local": "Lokal",
  "settings.group.media": "Medien",
  "settings.group.reset": "Zurücksetzen",
  "settings.group.always_on": "Immer an",
  "settings.group.notifications": "Mitteilungen",
  "settings.group.blocked": "Blockiert",
  "settings.group.theme": "Erscheinungsbild",
  "settings.group.font": "Schrift",
  "settings.group.language": "Sprache",
  "settings.section.diagnostics_desc":
    "Verbindungsstatus und Geräte in der Nähe",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Bluetooth-Verbindungen",
  "settings.diag.ble_links_desc":
    "Geräte, mit denen dieses Telefon direkt verbunden ist",
  "settings.diag.lan": "Lokales Netzwerk",
  "settings.diag.lan_desc": "Telefone im selben WLAN",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Telefon zu Telefon ohne Router",
  "settings.diag.wifi_active": "Läuft",
  "settings.diag.wifi_unsupported": "Auf diesem Gerät nicht unterstützt",
  "settings.diag.wifi_permission": "Durch eine Berechtigung blockiert",
  "settings.diag.wifi_unavailable": "Gerade nicht verfügbar",
  "settings.diag.wifi_unpaired": "Nichts gekoppelt",
  "settings.diag.wifi_unknown": "Warte auf das Funkmodul",
  "settings.diag.relays": "Nostr-Relays",
  "settings.diag.relays_desc":
    "Werden für Standortkanäle und Internetreichweite genutzt",
  "settings.diag.connected": "Verbunden",
  "settings.diag.disconnected": "Nicht verbunden",
  "settings.diag.peer_direct": "Direkte Verbindung",
  "settings.diag.peer_relayed": "Über ein anderes Gerät gehört",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Kein Signalwert",
  "settings.diag.no_peers": "Niemand in Reichweite",
  "settings.diag.no_peers_desc": "{links} Funkverbindung(en) offen",
  "settings.diag.gcs_size": "Filtergröße",
  "settings.diag.gcs_size_desc": "Größter Sync-Filter, der gesendet wurde",
  "settings.diag.fpr": "Falsch-Positiv-Rate",
  "settings.diag.fpr_desc":
    "Wie oft der Filter ein Paket meldet, das uns fehlt",
  "settings.diag.bytes": "{n} Bytes",
  "settings.diag.footnote":
    "Hier lässt sich nichts ändern. Diese Werte sind fest, damit Airhop mit bitchat kompatibel bleibt.",
  "settings.section.storage_desc": "Belegung und Cache",
  "settings.section.appearance": "Erscheinungsbild",
  "settings.section.appearance_desc": "Erscheinungsbild, Schrift und Sprache",
  "settings.section.help": "Hilfe & Feedback",
  "settings.section.help_desc":
    "Kontaktiere uns, melde einen Fehler, oder lies die FAQ",
  "settings.section.support": "Unterstützen",
  "settings.section.support_desc": "Hilf, die Entwicklung am Laufen zu halten",
  "settings.section.about": "Über",
  "settings.section.about_desc": "Version, Änderungsprotokoll und Quellcode",

  // ---- Settings: general ----
  "settings.general.undo": "Senden rückgängig",
  "settings.general.feature_ai": "KI",
  "settings.general.feature_wallet": "Wallet",
  "settings.general.undo_seconds": "{count} Sekunden",
  "settings.general.undo_a11y": "Senden rückgängig: {value}",
  "settings.general.quality_a11y": "Upload-Qualität auf {value} setzen",
  "settings.general.undo_desc":
    "Hält eine gesendete Nachricht kurz zurück, damit du sie vor dem Versand noch stoppen kannst",
  "settings.general.undo_off_desc": "Sofort senden, kein Rückgängig",
  "settings.general.undo_2": "2 Sekunden",
  "settings.general.undo_2_desc": "Eine kurze Gelegenheit, es zurückzunehmen",
  "settings.general.undo_10": "10 Sekunden",
  "settings.general.undo_10_desc": "Das längste Zeitfenster",
  "settings.general.quality": "Upload-Qualität",
  "settings.general.quality_desc":
    "Gilt für Fotos aus deiner Kamera oder Mediathek. Jedes Foto wird ohnehin an das Mesh angepasst.",
  "settings.general.quality_low": "Niedrig",
  "settings.general.quality_low_desc": "Kleinste Fotos, schnellster Versand",
  "settings.general.quality_medium": "Mittel",
  "settings.general.quality_medium_desc":
    "Ausgewogen zwischen Detail und Tempo",
  "settings.general.quality_high": "Hoch",
  "settings.general.quality_high_desc": "Behält die meisten Details",
  "settings.general.feature_wallet_desc":
    "Cashu-Ecash direkt zwischen Geräten über das Mesh senden",
  "settings.general.feature_wallet_a11y": "Wallet (immer an)",
  "settings.general.feature_ai_desc":
    "Privater Assistent auf dem Gerät, ohne Netzwerkaufrufe",
  "settings.general.feature_feeds": "Feeds",
  "settings.general.feature_feeds_desc":
    "Bluesky- und Mastodon-Feeds lesen und darin posten",
  "settings.general.show_media": "Medien automatisch anzeigen",
  "settings.general.show_media_desc":
    "Fotos und Videos erscheinen im Chat, oder bleiben hinter einem Tippen",
  "settings.general.reset": "Einstellungen zurücksetzen",
  "settings.general.media_retention": "Medien behalten für",
  "settings.general.media_retention_desc":
    "Fotos, Videos und Sprachnotizen werden nach der gewählten Zeit gelöscht",
  "settings.general.media_retention_sheet":
    "Wähle, wie lange Medien auf diesem Gerät bleiben. Gelöschte Medien lassen sich nicht wiederherstellen.",
  "settings.general.retention_7_desc":
    "Hinterlässt am wenigsten. Am besten, wenn das Telefon selbst das Risiko ist.",
  "settings.general.retention_14_desc":
    "Ein Mittelweg für ein bis zwei Wochen ohne Empfang.",
  "settings.general.retention_30_desc":
    "Hält Verläufe am längsten lesbar und belegt am meisten Speicher.",
  "settings.general.reset_desc":
    "Setzt jede Einstellung auf ihren Standard zurück und lässt Identität, Nachrichten, Kontakte und Wallet unberührt",
  "settings.general.reset_title": "Einstellungen zurücksetzen?",
  "settings.general.reset_body":
    "Jede Einstellung geht auf ihren Standard zurück: Erscheinungsbild, Senden rückgängig und Verbindungen (Internet, Tor, Gateway, Brücke, Relays). Deine Identität, Nachrichten, Kontakte und Wallet bleiben unberührt.",
  "settings.general.reset_confirm": "Zurücksetzen",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward Secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet ist für DMs immer an",
  "settings.security.signed_packets": "Signierte Pakete",
  "settings.security.signed_packets_desc": "Jedes Paket ist Ed25519-signiert",
  "settings.security.hide_previews": "Vorschauen in Mitteilungen ausblenden",
  "settings.security.hide_previews_desc":
    "Hält Absender und Nachricht von deinem Sperrbildschirm fern, der sie ohne Entsperren zeigt",
  "settings.security.no_blocked": "Keine blockierten Peers",
  "settings.security.no_blocked_desc":
    "Blockierte Peers können dir nicht schreiben und erscheinen nicht im Mesh-Tab",
  "settings.security.unblock_title": "Diesen Peer entsperren",
  "settings.security.unblock": "Entsperren",
  "settings.security.unblock_peer": "{name} entsperren",
  "settings.security.unblock_body":
    "{name} kann dir wieder schreiben und erscheint wieder im Mesh-Tab, wenn die Person in der Nähe ist.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Internet-Rückfallebene",
  "settings.network.internet_desc":
    "Über Nostr-Relays weitermachen, wenn Mesh-Peers außer Reichweite sind",
  "settings.network.internet_off_title": "Das Internet abschalten?",
  "settings.network.internet_off_body":
    "Airhop läuft dann nur über Bluetooth. Es kontaktiert kein Nostr-Relay mehr, und Tor, das Internet-Gateway und die Mesh-Brücke schalten sich alle ab. Bluetooth-Chat in der Nähe funktioniert weiter.",
  "settings.network.turn_off": "Abschalten",
  "settings.network.discovery": "Geo-Relay-Erkennung",
  "settings.network.discovery_desc":
    "Wählt für eine Standortzelle automatisch die nächsten Relays aus über 300 verteilten Relays",
  "settings.network.discovery_needs_relay":
    "Füge zuerst ein eigenes Relay hinzu",
  "settings.network.discovery_needs_relay_body":
    "Die automatische Erkennung ist das, was Airhop auf die nächsten Relays zeigen lässt. Sie abzuschalten ergibt erst Sinn, wenn du unten eigene Relays festgelegt hast, füge also zuerst mindestens eines hinzu.",
  "settings.network.custom_only_title": "Nur deine eigenen Relays nutzen?",
  "settings.network.custom_only_body":
    "Standortkanäle und die Mesh-Brücke wählen dann nicht mehr automatisch die nächsten Relays, sondern nur die, die du hinzugefügt hast. Das kann die Reichweite verringern, und du triffst möglicherweise keine bitchat-Nutzer mehr, die sich auf den nächsten Relays sammeln.",
  "settings.network.custom": "Eigene Relays",
  "settings.network.custom_desc":
    "Füge eigene Relays für Standortkanäle und die Mesh-Brücke hinzu",
  "settings.network.custom_added": "{count} von {max} hinzugefügt",
  "settings.network.dm_relays": "Nachrichten-Relays",
  "settings.network.dm_relays_desc":
    "Direktnachrichten und private Kanäle nutzen immer diese. Eigene Relays ändern daran nichts.",
  "settings.network.discovery_back_on": "Geo-Relay-Erkennung wieder an",
  "settings.network.discovery_back_on_body":
    "Das war dein letztes eigenes Relay. Standortkanäle brauchen einen Ort zum Veröffentlichen, deshalb wählt Airhop wieder automatisch die nächsten Relays.",
  "settings.network.add_relay": "Relay hinzufügen",
  "settings.network.remove_relay": "{url} entfernen",
  "settings.network.add_short": "Hinzufügen",
  "settings.network.relay_limit":
    "Du kannst {count} Relays hinzufügen. Entferne eines, um ein weiteres hinzuzufügen.",
  "settings.network.relay_duplicate":
    "Dieses Relay steht bereits in deiner Liste.",
  "settings.network.relay_invalid":
    "Gib einen gültigen Relay-Host ein, z. B. relay.example.com. Ein Port ist nur nötig, wenn das Relay nicht den Standard verwendet. IP-Adressen und lokale Namen sind nicht erlaubt.",
  "settings.network.lan": "Lokales Netzwerk",
  "settings.network.lan_desc":
    "Erreiche Leute im selben WLAN, auch zwischen iPhone und Android. Andere Geräte im Netzwerk können sehen, dass du Airhop verwendest.",
  "settings.network.lan_searching": "Keine Airhop-Geräte in diesem Netzwerk",
  "settings.network.lan_active": "In diesem Netzwerk verbunden",
  "settings.network.lan_unavailable": "In keinem WLAN",
  "settings.network.lan_permission":
    "Der Zugriff aufs lokale Netzwerk ist für Airhop deaktiviert",
  "settings.network.lan_unsupported": "Auf diesem Gerät nicht verfügbar",
  "settings.network.lan_foreground":
    "Pausiert, wenn Airhop im Hintergrund ist. Bluetooth läuft weiter.",
  "settings.network.wifi_pair": "Kopplung",
  "settings.network.wifi_paired": "Gekoppelte Geräte",
  "settings.network.wifi_pair_find": "Gerät finden",
  "settings.network.wifi_pair_find_desc":
    "Nach einem iPhone in der Nähe suchen, das sich zeigt. Beide brauchen iOS 26 oder neuer.",
  "settings.network.wifi_pair_show": "Dieses iPhone zeigen",
  "settings.network.wifi_pair_show_desc":
    "Ein iPhone in der Nähe dieses hier finden lassen. Einer sucht, der andere zeigt sich, zur gleichen Zeit.",
  "settings.network.wifi_pair_find_action": "iPhone in der Nähe wählen",
  "settings.network.wifi_pair_show_action": "Dieses iPhone sichtbar machen",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware ist gerade nicht verfügbar",
  "settings.network.wifi_pair_forget": "Kopplung in der App Settings entfernen",
  "settings.network.bitchat": "bitchat-Kompatibilität",
  "settings.network.bitchat_desc":
    "Dasselbe BLE-Mesh wie bitchat, vollständig interoperabel. Das ist immer an und lässt sich nicht abschalten.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Im Hintergrund laufen",
  "settings.conn.background_desc":
    "Das Mesh weiterlaufen lassen, wenn Airhop geschlossen ist",
  "settings.conn.background_on_title": "Das Mesh weiterlaufen lassen?",
  "settings.conn.background_on_body":
    "Airhop leitet weiter und empfängt weiter, wenn es geschlossen ist, sodass Nachrichten ankommen, während du weg bist. Android zeigt währenddessen eine dauerhafte Mitteilung.",
  "settings.conn.background_off_title":
    "Das Mesh stoppen, wenn Airhop schließt?",
  "settings.conn.background_off_body":
    "Nachrichten kommen dann nur an, während Airhop offen ist, und dieses Telefon leitet nichts mehr für Leute in der Nähe weiter. Die dauerhafte Mitteilung verschwindet.",
  "settings.conn.live_voice": "Live-Sprache",
  "settings.conn.live_voice_desc":
    "Mit Menschen in der Nähe sprechen wie mit einem Funkgerät",
  "settings.conn.live_voice_on_title": "Live-Sprache einschalten?",
  "settings.conn.live_voice_on_body":
    "Wenn du das Mikrofon hältst, geht deine Stimme beim Sprechen an alle in Bluetooth-Reichweite, und ihre Stimme wird auf deinem Telefon abgespielt. Nichts wird aufgezeichnet.",
  "settings.conn.live_voice_off_title": "Live-Sprache ausschalten?",
  "settings.conn.live_voice_off_body":
    "Das Mikrofon zu halten nimmt dann stattdessen eine Sprachnotiz auf. Sie geht raus, wenn du loslässt, und niemand hört sie, bis sie abgespielt wird.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor-Routing",
  "settings.conn.tor_desc":
    "Nostr-Verkehr für zusätzliche Privatsphäre über Tor leiten",
  "settings.conn.tor_on_title": "Nostr-Verkehr über Tor leiten?",
  "settings.conn.tor_on_body":
    "Relays sehen deine IP-Adresse nicht mehr. Der Verbindungsaufbau dauert länger, und Nachrichten kommen langsamer an. Bluetooth ist nicht betroffen.",
  "settings.conn.tor_off_title": "Tor-Routing ausschalten?",
  "settings.conn.tor_off_body":
    "Nostr-Verkehr läuft wieder über deine gewöhnliche Verbindung, sodass Relays deine IP-Adresse wieder sehen. Bluetooth ist so oder so nicht betroffen.",
  "settings.conn.tor_orbot_idle":
    "Orbot ist installiert, aber nicht verbunden. Öffne Orbot, starte sein VPN, und schalte das dann ein.",
  "settings.conn.tor_unavailable":
    "Tor-Routing ist in diesem Build nicht verfügbar.",
  "settings.conn.tor_timeout":
    "Tor braucht länger als eine Minute zum Verbinden. Es bleibt an und versucht es weiter; der Mesh-Tab meldet, wenn es leitet, oder wenn dieses Netzwerk es blockiert.",
  "settings.conn.tor_failed":
    "Tor konnte nicht gestartet werden. Stelle sicher, dass die App Netzwerkzugriff hat.",
  "settings.conn.mint_clearnet": "Mint-Verkehr über das offene Netz erlauben",
  "settings.conn.mint_clearnet_desc":
    "Tor deckt unter iOS nur Nostr ab. Lass es aus, um Mint-Anfragen zu blockieren; Ecash über das Mesh funktioniert so oder so weiter.",
  "settings.conn.gateway": "Internet-Gateway",
  "settings.conn.gateway_desc":
    "Leihe deine Verbindung einem Telefon in der Nähe ohne Internet, damit es die Standortkanäle trotzdem erreicht",
  "settings.conn.gateway_on_title": "Das Internet-Gateway einschalten?",
  "settings.conn.gateway_on_body":
    "Telefone in der Nähe ohne eigene Verbindung senden und empfangen Nachrichten aus Standortkanälen über deine. Das nutzt deine mobilen Daten und deinen Akku, und ihre Nachrichten bleiben Ende-zu-Ende verschlüsselt, du kannst also nicht lesen, was durchläuft.",
  "settings.conn.gateway_off_title": "Das Internet-Gateway ausschalten?",
  "settings.conn.gateway_off_body":
    "Telefone in der Nähe ohne Internet erreichen die Standortkanäle dann nicht mehr über deins. Deine eigenen Nachrichten sind nicht betroffen.",
  "settings.conn.bridge": "Mesh-Brücke",
  "settings.conn.bridge_desc":
    "Verbinde den öffentlichen #bluetooth-Chat dieses Gebiets über das Internet mit einer anderen Bluetooth-Menge außer Reichweite",
  "settings.conn.bridge_on_title": "Die Mesh-Brücke einschalten?",
  "settings.conn.bridge_on_body":
    "Deine öffentlichen #bluetooth-Nachrichten werden über das Internet in deinem Viertel veröffentlicht, sodass Menschen außerhalb der Bluetooth-Reichweite sie lesen können. Private Nachrichten werden nie gebrückt, und „nur in der Nähe“ hält jede einzelne Nachricht lokal.",
  "settings.conn.bridge_off_title": "Die Mesh-Brücke ausschalten?",
  "settings.conn.bridge_off_body":
    "Deine öffentlichen #bluetooth-Nachrichten bleiben wieder in Bluetooth-Reichweite, und Nachrichten aus der gebrückten Menge kommen hier nicht mehr an.",
  "settings.conn.bridge_needs_location": "Die Mesh-Brücke braucht den Standort",
  "settings.conn.bridge_needs_location_desc":
    "Sie ermittelt dein Viertel aus einer Standortbestimmung. Erlaube den Standort, um zu brücken.",
  "settings.conn.grant_location": "Standortberechtigung erteilen",
  "settings.conn.grant_short": "Erteilen",
  "settings.conn.orbot_body":
    "Airhop leitet Tor-Verkehr über Orbot. Installiere und aktiviere Orbot aus dem Play Store, und schalte das dann ein.",
  "settings.conn.internet_off": "Internet ist aus",
  "settings.conn.internet_off_desc":
    "Tor, die Brücke und das Gateway nutzen alle das Internet. Schalte die Internet-Rückfallebene unter Netzwerk ein, um sie zu nutzen.",
  "settings.conn.turn_on": "Einschalten",
  "settings.conn.turn_off": "Ausschalten",
  "settings.conn.orbot_title": "Tor unter Android",
  "settings.conn.get_orbot": "Orbot holen",
  "settings.conn.later": "Später",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Findet Geräte in der Nähe und leitet Nachrichten zwischen ihnen weiter. Ohne das kann das Mesh nicht funktionieren.",
  "settings.permissions.location": "Standort",
  "settings.permissions.location_desc":
    "Öffnet Kanäle für Gebiete in der Nähe. Ohne das bleiben diese Kanäle geschlossen, und das Bluetooth-Mesh läuft normal weiter.",
  "settings.permissions.notifications": "Mitteilungen",
  "settings.permissions.notifications_desc":
    "Erhalte Hinweise auf neue Nachrichten, auch wenn die App geschlossen ist. Ohne das siehst du sie erst, wenn du Airhop öffnest.",
  "settings.permissions.camera": "Kamera",
  "settings.permissions.camera_desc":
    "QR-Codes scannen und Fotos oder Videos zum Senden aufnehmen. Ohne das kannst du weiterhin Medien aus deiner Mediathek teilen.",
  "settings.permissions.photos": "Fotos",
  "settings.permissions.photos_desc":
    "Fotos aus deiner Mediathek senden und empfangene Medien sichern. Ohne das kannst du weiterhin neue Fotos mit der Kamera aufnehmen und senden.",
  "settings.permissions.microphone": "Mikrofon",
  "settings.permissions.microphone_desc":
    "Sprachnachrichten aufnehmen und senden oder Live-Sprache nutzen. Ohne das funktionieren Sprachnachrichten und Live-Sprache nicht.",
  "settings.permissions.allow": "Diese Berechtigung erteilen",
  "settings.permissions.open_settings":
    "Systemeinstellungen öffnen, um diese Berechtigung zu ändern",
  "settings.permissions.system": "System",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Netzwerknutzung",
  "settings.storage.storage_usage": "Speichernutzung",
  "settings.storage.storage_usage_desc":
    "Nachrichten, Wallet-Proofs und zwischengespeicherte Anhänge",
  "settings.storage.session_usage":
    "Diese Sitzung · {sent} gesendet, {received} empfangen",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} an Anhängen",
  "settings.storage.clear_cache": "Anhang-Cache leeren",
  "settings.storage.clear": "Leeren",
  "settings.storage.clear_title": "Zwischengespeicherte Medien leeren?",
  "settings.storage.clear_body":
    "Fotos, Videos, Sprachnotizen und Dateien werden von diesem Gerät entfernt, gesendete wie empfangene. Sie lassen sich nicht erneut laden: ihre Blasen sagen das, und du kannst die Absenderseite bitten, sie noch einmal zu senden. Nachrichten und Wallet bleiben unberührt.",
  "settings.storage.cleared": "Cache geleert",
  "settings.storage.freed": "{size} freigegeben.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Erscheinungsbild auf {value} setzen",
  "settings.font.set_a11y": "Monospace-Schrift auf {value} setzen",
  "settings.font.system": "System",
  "settings.font.system_desc":
    "Nutzt die Standard-Monospace-Schrift deines Geräts",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Modern und gut lesbar",
  "settings.language.en": "Englisch",
  "settings.language.am": "Amharisch",
  "settings.language.ar": "Arabisch",
  "settings.language.bn": "Bengalisch",
  "settings.language.my": "Birmanisch",
  "settings.language.zh_hans": "Chinesisch (vereinfacht)",
  "settings.language.zh_hant": "Chinesisch (traditionell)",
  "settings.language.nl": "Niederländisch",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "Französisch",
  "settings.language.ka": "Georgisch",
  "settings.language.de": "Deutsch",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesisch",
  "settings.language.it": "Italienisch",
  "settings.language.ja": "Japanisch",
  "settings.language.ko": "Koreanisch",
  "settings.language.mg": "Madagassisch",
  "settings.language.ms": "Malaiisch",
  "settings.language.ne": "Nepalesisch",
  "settings.language.fa": "Persisch",
  "settings.language.pl": "Polnisch",
  "settings.language.pt_br": "Portugiesisch (Brasilien)",
  "settings.language.pt_pt": "Portugiesisch (Portugal)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Russisch",
  "settings.language.es": "Spanisch",
  "settings.language.sw": "Suaheli",
  "settings.language.sv": "Schwedisch",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thai",
  "settings.language.tr": "Türkisch",
  "settings.language.uk": "Ukrainisch",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamesisch",
  "settings.language.pseudo": "Pseudosprache",
  "settings.language.soon": "Bald verfügbar",
  "settings.language.soon_a11y": "{value}, bald verfügbar",
  "settings.language.set_a11y": "Sprache auf {value} setzen",
  "settings.language.pending": "Beim nächsten Öffnen",
  "settings.language.pending_a11y":
    "{value}, gilt ab dem nächsten Öffnen von Airhop",
  "settings.language.rtl_restart": "Jetzt neu öffnen",
  "settings.language.rtl_title": "Öffne Airhop neu, um abzuschließen",
  "settings.language.rtl_body":
    "{value} wird von rechts nach links gelesen, und Airhop kann die Richtung nur beim Start ändern. Schließe die App und öffne sie erneut, um den Wechsel abzuschließen. Nichts geht verloren, und dein Mesh bleibt bis dahin verbunden.",
  "settings.theme.light": "Hell",
  "settings.theme.light_desc": "Immer die helle Palette verwenden",
  "settings.theme.dark": "Dunkel",
  "settings.theme.dark_desc": "Immer die dunkle Palette verwenden",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Auffindbar, sendet und sucht",
  "settings.status.away": "Abwesend",
  "settings.status.away_desc": "Mesh pausiert, sucht und sendet nicht",
  "settings.status.invisible": "Unsichtbar",
  "settings.status.invisible_desc": "Sucht, ist aber nicht auffindbar",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Status auf {value} setzen",
  "settings.status.edit": "Status bearbeiten",
  "settings.status.desc": "Wähle, wie sichtbar du im Mesh bist.",
  "settings.transfer.identity": "Identität und Schlüssel",
  "settings.transfer.identity_desc":
    "Deine Peer-ID, dein Benutzername und deine Kontakte",
  "settings.transfer.chats": "Chats und Verlauf",
  "settings.transfer.chats_desc":
    "Unterhaltungen, Gruppen und die Kanäle, denen du beigetreten bist",
  "settings.transfer.wallet": "Wallet-Guthaben",
  "settings.transfer.wallet_desc": "Cashu-Proofs und Transaktionsverlauf",
  "settings.transfer.title": "Auf ein neues Telefon übertragen",
  "settings.transfer.desc":
    "Bewege deine Identität, Chats und Wallet auf ein anderes Gerät",
  "settings.transfer.coming_soon_a11y":
    "Auf ein neues Telefon übertragen, bald verfügbar",
  "settings.transfer.body":
    "Halte beide Telefone zusammen und übertrage alles per Bluetooth. Nichts läuft über einen Server, es funktioniert also ohne Internet.",
  "settings.qr.permission_label": "Fotozugriff",
  "settings.qr.permission_purpose": "deinen QR-Code zu sichern",
  "settings.qr.saved": "Gesichert",
  "settings.qr.saved_body": "QR-Code in deiner Fotomediathek gesichert.",
  "settings.qr.save_failed": "Sichern nicht möglich",
  "settings.qr.save_failed_body":
    "Der QR-Code konnte nicht gesichert werden. Versuche es erneut.",
  "settings.qr.share_message": "Füge mich auf Airhop hinzu",
  "settings.qr.share_body":
    "Füge mich auf Airhop hinzu — private Mesh-Nachrichten, die ohne Internet auskommen.",
  "settings.qr.show_short": "QR anzeigen",
  "settings.qr.title": "Dein QR-Code",
  "settings.qr.note":
    "Er enthält deine öffentlichen Schlüssel, mit denen andere dir von überall schreiben können. Teile ihn nur mit Menschen, denen du vertraust. Er ändert sich nicht, außer du löschst deine Identität.",
  "settings.qr.code_label": "Kontaktcode",
  "settings.qr.copy_code": "Kontaktcode kopieren",
  "settings.qr.share": "QR-Code teilen",
  "settings.qr.share_short": "QR teilen",
  "settings.qr.download": "QR-Code herunterladen",
  "settings.qr.download_short": "QR laden",
  "settings.qr.show": "QR-Code anzeigen",
  "settings.wipe.trigger": "Panik-Löschung auslösen",
  "settings.wipe.trigger_desc":
    "Dreifach tippen, um sofort ohne Rückfrage zu löschen",
  "settings.wipe.title": "Panik-Löschung",
  "settings.wipe.now": "Jetzt löschen",
  "settings.wipe.desc":
    "Alle Schlüssel, Nachrichten und Proofs sofort vernichten",
  "settings.wipe.body":
    "Das vernichtet sofort alle deine Schlüssel, Nachrichten und Wallet-Proofs. Das lässt sich nicht rückgängig machen.",
  "settings.wipe.in_progress": "Wird gelöscht",
  "settings.wipe.in_progress_body":
    "Deine Schlüssel, Nachrichten und Dateien werden vernichtet. Das dauert ein paar Sekunden und läuft von selbst zu Ende, auch wenn die App geschlossen wird.",
  "settings.wipe.got_it": "Verstanden",
  "settings.wipe.keys_failed": "Schlüssel konnten nicht vernichtet werden",
  "settings.wipe.keys_failed_body":
    "Deine Nachrichten, Kontakte und Wallet sind weg, aber das Gerät hat sich geweigert, deine Schlüssel freizugeben. Entsperre das Gerät und lösche erneut.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Kontaktiere uns",
  "settings.help.contact_a11y": "E-Mail an {address}",
  "settings.help.bug": "Einen Fehler melden",
  "settings.help.bug_desc": "Ein Issue auf GitHub öffnen",
  "settings.help.bug_a11y": "Einen Fehler auf GitHub melden",
  "settings.help.faq": "Häufig gestellte Fragen",
  "settings.help.faq_desc": "Antworten auf häufige Fragen",
  "settings.help.faq_a11y": "FAQ öffnen",
  "settings.help.terms_desc": "Wie Airhop genutzt werden darf",
  "settings.help.terms_a11y": "Nutzungsbedingungen öffnen",
  "settings.help.privacy_desc": "Was wir nicht erheben",
  "settings.help.privacy_a11y": "Datenschutzerklärung öffnen",

  // ---- Settings: support ----
  "settings.support.card": "Karte oder UPI",
  "settings.support.card_desc": "Onlinebanking und Wallets, weltweit",
  "settings.support.card_a11y":
    "Mit Karte, UPI, Onlinebanking oder Wallet unterstützen",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Monatlich oder einmalig, ohne Plattformgebühr",
  "settings.support.sponsors_a11y": "Über GitHub Sponsors unterstützen",
  "settings.support.note":
    "Ich baue Airhop in meiner Freizeit. Es gibt keine Investoren und keine Werbung. Wenn es dir nützt, hilft ein Beitrag sehr dabei, die Entwicklung am Laufen zu halten. Jede Funktion bleibt so oder so kostenlos.",

  // ---- Settings: about and version ----
  "settings.about.version": "Version",
  "settings.about.version_desc": "Aktuelle Veröffentlichung",
  "settings.about.version_a11y": "Version ansehen und nach Updates suchen",
  "settings.about.release_notes": "Versionshinweise",
  "settings.about.release_notes_desc": "Was in der neuesten Version neu ist",
  "settings.about.release_notes_a11y":
    "Die neuesten Versionshinweise auf GitHub öffnen",
  "settings.about.source": "Quellcode",
  "settings.about.source_a11y": "Quellcode auf GitHub öffnen",
  "settings.about.licenses": "Open-Source-Lizenzen",
  "settings.about.open_repo": "Das Repository {name} öffnen",
  "settings.about.licenses_desc": "Open-Source-Pakete von Dritten",
  "settings.about.licenses_a11y": "Lizenzen von Drittanbietern ansehen",
  "settings.version.codename": "Codename",
  "settings.version.checking": "Wird geprüft",
  "settings.version.check": "Nach Updates suchen",
  "settings.version.checking_title": "Suche nach Updates",
  "settings.version.up_to_date": "Du bist auf der neuesten Version.",
  "settings.version.release_notes": "Versionshinweise ansehen",
  "settings.version.made_with": "Gemacht mit",
  "settings.version.number": "Version {version}",
  "settings.version.update_to": "Auf {version} aktualisieren",
  "settings.version.update_to_a11y": "Auf Version {version} aktualisieren",
  "settings.version.released_under": "Veröffentlicht unter {license}",
  "settings.version.notes_a11y":
    "Versionshinweise für Version {version} ansehen",
  "settings.version.tor_paused":
    "Die Update-Prüfung pausiert, solange Tor an ist, damit sie deine IP nicht preisgibt. Sieh dir die Releases-Seite in einem Browser an.",
  "settings.version.check_failed":
    "Es konnte nicht nach Updates gesucht werden. Prüfe deine Verbindung und versuche es erneut.",
  "settings.version.downloading": "Wird heruntergeladen {percent}%",
  "settings.version.install": "Installieren",
  "settings.version.download_failed":
    "Download fehlgeschlagen. Prüfe deine Verbindung und versuche es erneut.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} hat {size} KiB und liegt über der Grenze von {cap} KiB.",
  "transfer.failed.malformed":
    "Ein Anhang kam beschädigt an und ließ sich nicht öffnen. Bitte die Person, ihn erneut zu senden.",
  "transfer.failed.unsupported_type":
    "Ein Anhang kam in einem Format an, das diese App nicht öffnen kann.",
  "transfer.failed.type_mismatch":
    "Ein Anhang wurde abgelehnt: sein Inhalt passt nicht zum angegebenen Dateityp.",
  "transfer.failed.storage":
    "Ein Anhang kam an, ließ sich aber nicht sichern. Prüfe deinen freien Speicher.",
  "transfer.badge.waiting": "Wartet · {name}",
  "transfer.badge.active_count": "{count} Übertragungen",
  "transfer.badge.sending": "{name} wird gesendet",
  "transfer.badge.receiving": "{name} wird empfangen",
  "transfer.badge.a11y": "{label}, {percent} Prozent. Unterhaltung öffnen.",
  "transfer.kind.photo": "Foto",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Sprachnotiz",
  "transfer.this.photo": "Dieses Foto",
  "transfer.this.video": "Dieses Video",
  "transfer.this.voice": "Diese Sprachnotiz",
  "transfer.this.file": "Diese Datei",
  "transfer.kind.document": "Dokument",
  "transfer.kind.voice_preview": "Sprachnotiz",
  "transfer.kind.photo_preview": "Foto",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Dokument",

  // ---- System notifications ----
  "notif.channel.messages": "Nachrichten",
  "notif.channel.nearby": "Peers in der Nähe",
  "notif.channel.nearby_desc":
    "Ein gelegentlicher Hinweis, wenn das Mesh Menschen in Bluetooth-Reichweite findet.",
  "notif.nearby.body":
    "Jetzt in Bluetooth-Reichweite. Tippen, um das Mesh zu öffnen.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Jemand",
  "notif.notice_urgent": "Dringender Aushang · {content}",
  "notif.notice": "Aushang · {content}",
  "notif.incoming_file": "Eingehende Datei",
  "notif.preview.photo": "📷 Foto",
  "notif.preview.voice": "🎤 Sprachnachricht",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Dokument",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Neue Nachricht",
  "notif.hidden.channel": "Neue Aktivität",
  "notif.hidden.mention": "Du wurdest erwähnt",
  "notif.mention.title": "{sender} hat dich erwähnt",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "{count} weiteren anzeigen",
    other: "{count} weitere anzeigen",
  },
  "chat.channels.show_more_a11y": {
    one: "{count} weiteren Standardkanal anzeigen",
    other: "{count} weitere Standardkanäle anzeigen",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} ungelesen",
    other: "{label}, {count} ungelesen",
  },
  "a11y.new_count": {
    one: "{label}, {count} neu",
    other: "{label}, {count} neu",
  },
  "chat.a11y.unread": {
    one: "{count} ungelesen",
    other: "{count} ungelesen",
  },
  "chat.thread.length_left": {
    one: "noch {count}",
    other: "noch {count}",
  },
  "settings.general.retention_days": {
    one: "{count} Tag",
    other: "{count} Tage",
  },
  "chat.info.group_reach": {
    one: "{reachable} von {count} Mitglied erreichbar",
    other: "{reachable} von {count} Mitgliedern erreichbar",
  },
  "chat.group_members": {
    one: "Private Gruppe  ·  {count} Mitglied",
    other: "Private Gruppe  ·  {count} Mitglieder",
  },
  "chat.select.count": {
    one: "{count} ausgewählt",
    other: "{count} ausgewählt",
  },
  "chat.select.forward": {
    one: "{count} Nachricht weiterleiten",
    other: "{count} Nachrichten weiterleiten",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} spricht",
    other: "{count} sprechen",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} Peer in Reichweite",
    other: "{count} Peers in Reichweite",
  },
  "mesh.peer.hops_away": {
    one: "{count} Hop entfernt",
    other: "{count} Hops entfernt",
  },
  "chat.presence.active": {
    one: "{count} aktiv",
    other: "{count} aktiv",
  },
  "chat.presence.nearby": {
    one: "{count} in der Nähe",
    other: "{count} in der Nähe",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} Mint",
    other: "{count} Mints",
  },
  "wallet.mint.remove_body": {
    one: "{mint} hält {balance} {unit} in {count} Proof. Ihn zu entfernen löscht diesen Proof dauerhaft von diesem Gerät, und es gibt keine Sicherung. Zahle das Guthaben zuerst aus oder sende es weg.",
    other:
      "{mint} hält {balance} {unit} in {count} Proofs. Ihn zu entfernen löscht diese Proofs dauerhaft von diesem Gerät, und es gibt keine Sicherung. Zahle das Guthaben zuerst aus oder sende es weg.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} Einzahlung wartet auf Zahlung. Wird bei jedem Öffnen der App erneut geprüft.",
    other:
      "{count} Einzahlungen warten auf Zahlung. Werden bei jedem Öffnen der App erneut geprüft.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{count} unverbrauchter Proof aus {mints} wiederhergestellt.",
    other: "{count} unverbrauchte Proofs aus {mints} wiederhergestellt.",
  },
  "wallet.backup.already_spent": {
    one: "{count} Münze wurde gefunden, war aber bereits ausgegeben, es wurde also nichts dafür gutgeschrieben. Das ist normal: jede Münze, die du je ausgegeben hast, erscheint weiterhin in den Aufzeichnungen des Mints.",
    other:
      "{count} Münzen wurden gefunden, waren aber bereits ausgegeben, es wurde also nichts dafür gutgeschrieben. Das ist normal: jede Münze, die du je ausgegeben hast, erscheint weiterhin in den Aufzeichnungen des Mints.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "{count} weitere anzeigen",
    other: "{count} weitere anzeigen",
  },
  "wallet.activity.show_more_a11y": {
    one: "{count} weitere Zahlung anzeigen",
    other: "{count} weitere Zahlungen anzeigen",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} unbestätigt",
    other: "{count} unbestätigt",
  },
  "wallet.proof_count": {
    one: "{count} Proof",
    other: "{count} Proofs",
  },
  "wallet.spent_removed_detail": {
    one: "{count} Proof war bereits ausgegeben und wurde entfernt.",
    other: "{count} Proofs waren bereits ausgegeben und wurden entfernt.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Jemand in der Nähe",
    other: "{count} Menschen in der Nähe",
  },
};

export const de = { strings, plurals };
