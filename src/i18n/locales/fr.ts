// fr: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Annuler",
  "common.done": "Terminé",
  "common.ok": "OK",
  "common.close": "Fermer",
  "common.back": "Retour",
  "common.delete": "Supprimer",
  "common.remove": "Retirer",
  "common.add": "Ajouter",
  "common.copy": "Copier",
  "common.copied": "Copié",
  "common.share": "Partager",
  "common.continue": "Continuer",
  "common.try_again": "Réessayer",
  "common.settings": "Réglages",
  "common.on": "Activé",
  "common.off": "Désactivé",

  // ---- Dates ----
  "format.today": "Aujourd’hui",
  "format.yesterday": "Hier",
  "format.minutes_ago": "il y a {count} min",
  "format.hours_ago": "il y a {count} h",
  "format.days_ago": "il y a {count} j",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Discussions",
  "nav.tab.mesh": "Maillage",
  "nav.tab.wallet": "Portefeuille",
  "nav.tab.profile": "Toi",
  "a11y.tab.new_peers": "{label}, quelqu’un de nouveau à proximité",
  "nav.notifications": "Notifications",
  "chat.subtab.channels": "Canaux",
  "chat.subtab.direct": "Directs",
  "chat.subtab.dms": "Messages directs",
  "chat.search.placeholder": "Rechercher dans les discussions…",
  "chat.search.a11y": "Rechercher dans les discussions et les messages",
  "chat.search.close": "Fermer la recherche",
  "chat.search.clear": "Effacer la recherche",
  "mesh.view.radar": "Vue radar",
  "mesh.view.list": "Vue liste",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Liste",

  // ---- Legal document names ----
  "legal.last_updated": "Dernière mise à jour : {date}",
  "legal.terms": "Conditions d’utilisation",
  "legal.privacy": "Politique de confidentialité",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Communication maillée privée",
  "onboarding.welcome.cta": "Commencer",
  "onboarding.welcome.cta_hint":
    "Accepte les conditions ci-dessous pour continuer",
  "onboarding.welcome.consent_a11y":
    "Accepter les Conditions d’utilisation et la Politique de confidentialité",
  "onboarding.welcome.open_terms": "Ouvrir les Conditions d’utilisation",
  "onboarding.welcome.open_privacy": "Ouvrir la Politique de confidentialité",
  "onboarding.welcome.consent":
    "En touchant {cta}, tu acceptes nos {terms} et notre {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Création de ton identité",
  "onboarding.identity.body":
    "Création d’une paire de clés Ed25519 sur cet appareil.\nRien n’est envoyé nulle part.",
  "onboarding.identity.failed_heading": "Impossible de créer tes clés",
  "onboarding.identity.failed_body":
    "Cet appareil n’a pas laissé Airhop les stocker en sécurité. Réessaie, ou redémarre le téléphone et rouvre Airhop.",
  "onboarding.identity.steps_a11y": "Étapes : {steps}",
  "onboarding.identity.step.x25519":
    "Création de la paire de clés statiques X25519",
  "onboarding.identity.step.ed25519":
    "Création de la paire de clés de signature Ed25519",
  "onboarding.identity.step.keychain":
    "Stockage des clés dans le trousseau du système",
  "onboarding.identity.step.peer_id": "Dérivation de l’identifiant de pair",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Ton nom sur le maillage",
  "onboarding.username.peer_id": "Identifiant de pair",
  "onboarding.username.card_a11y":
    "Ton nom sur le maillage est {username}. Identifiant de pair {peerID}. {props}.",
  "onboarding.username.explanation":
    "Ce nom d’utilisateur est dérivé de façon déterministe de ta clé publique. Il est le même sur tous les appareils qui voient ton identifiant de pair.",
  "onboarding.username.cta": "Entrer dans Airhop",
  "onboarding.username.prop.algorithm": "Algorithme",
  "onboarding.username.prop.storage": "Stockage",
  "onboarding.username.prop.storage_value": "Trousseau du système uniquement",
  "onboarding.username.prop.account": "Compte nécessaire",
  "onboarding.username.prop.account_value": "Aucun",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Bienvenue dans Airhop",
  "onboarding.hello.p1":
    "Bonjour. Airhop est construit au-dessus de bitchat comme un projet parallèle indépendant et open source. Il n’est ni affilié ni approuvé par le projet bitchat ou par permissionless tech : c’est simplement quelque chose que j’aime construire et partager avec la communauté.",
  "onboarding.hello.p2":
    "C’est la première version pour iOS et Android, donc même si je l’ai testée avec des amis, tu tomberas sans doute sur quelques bugs. Si c’est le cas, ou si tu as une idée de fonctionnalité, ça me ferait plaisir d’en entendre parler. Ouvre un ticket sur {github} ou écris-moi à {email}.",
  "onboarding.hello.p3":
    "Si Airhop t’est utile, pense à laisser une étoile sur {github} ou un avis sur {store}. Ça aide plus de monde à découvrir le projet. Merci de l’avoir essayé !",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Avant que ton téléphone ne demande",
  "onboarding.primer.lede":
    "Voici ce que fait chaque autorisation, et ce qu’elle ne fait pas.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Trouve les appareils à proximité et relaie les messages entre eux. C’est ainsi que naît le maillage, et ça fonctionne sans connexion internet.",
  "onboarding.primer.location.title": "Localisation",
  "onboarding.primer.location.body":
    "Te place dans les canaux des zones proches, du pâté de maisons à la région. Airhop ne te suit jamais et n’envoie jamais ta position précise hors de l’appareil.",
  "onboarding.primer.notifications.title": "Notifications",
  "onboarding.primer.notifications.body":
    "Reçois des alertes pour les nouveaux messages même quand l’app est fermée. Les notifications sont créées sur ton appareil, sans aucun serveur.",
  "onboarding.primer.footnote":
    "Tu peux refuser. Les messages continueront de circuler par internet, et tu pourras changer d’avis plus tard dans les réglages.",
  "onboarding.primer.cta_a11y": "Continuer vers les demandes d’autorisation",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Accès au Bluetooth",
  "permission.bluetooth.purpose":
    "trouver les appareils proches sur le maillage",
  "permission.open_settings": "Ouvrir les réglages",
  "permission.not_now": "Pas maintenant",
  "permission.blocked_title": "{label} est désactivé",
  "permission.blocked_body": "Active-le dans les réglages pour {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Un problème est survenu",
  "error.boundary.body":
    "Airhop a rencontré un problème inattendu et a dû interrompre ce qu’il affichait.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Canaux par défaut",
  "chat.channels.yours": "Tes canaux",
  "chat.channels.none": "Pas encore de canal",
  "chat.channels.none_hint":
    "Touche {plus} ci-dessus pour en rejoindre un ou en créer un.",
  "chat.channels.none_desc":
    "Pas encore de canal. Utilise le bouton d’ajout de l’en-tête pour en rejoindre un ou en créer un.",
  "chat.channels.show_fewer": "Afficher moins de canaux par défaut",
  "chat.channels.show_less": "Afficher moins",
  "chat.channels.info": "Infos du canal",
  "chat.channels.pin": "Épingler le canal",
  "chat.channels.unpin": "Désépingler le canal",
  "chat.channels.mute": "Couper le canal",
  "chat.channels.unmute": "Réactiver le canal",
  "chat.channels.leave": "Quitter le canal",
  "chat.channels.leave_confirm": "Quitter",
  "chat.channels.clear_body":
    "Supprimer tous les messages de {name} ? C’est irréversible.",
  "chat.channels.leave_body":
    "Quitter {name} ? Tu cesseras de recevoir ses messages, et son historique sera retiré de cet appareil.",
  "chat.channels.more_options": "Plus d’options pour {name}",
  "chat.channels.teleported_tag": "{level}  ·  téléporté",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Vider la discussion",
  "chat.dm.remove_contact": "Retirer le contact",
  "chat.dm.block": "Bloquer ce pair",
  "chat.dm.block_confirm": "Bloquer",
  "chat.dm.delete": "Supprimer la discussion",
  "chat.dm.delete_body":
    "Cela retire la conversation de ta liste et supprime ses messages. Le contact est conservé, et un nouveau message de sa part ouvre une discussion neuve.",
  "chat.dm.in_range": "à portée",
  "chat.dm.row_hint": "Touche deux fois et maintiens pour plus d’options",
  "chat.channels.row_hint": "Touche deux fois et maintiens pour plus d’options",
  "chat.dm.you_prefix": "Toi :",
  "chat.dm.none": "Aucun message direct",
  "chat.dm.none_desc":
    "Va dans l’onglet Maillage et touche un pair pour démarrer un message direct chiffré.",
  "chat.dm.contact_info": "Infos du contact",
  "chat.dm.pin": "Épingler la discussion",
  "chat.dm.unpin": "Désépingler la discussion",
  "chat.dm.mute": "Couper la discussion",
  "chat.dm.unmute": "Réactiver la discussion",
  "chat.dm.clear_body":
    "Supprimer tous les messages avec {name} ? C’est irréversible.",
  "chat.dm.remove_contact_body":
    "Retirer {name} ? Cela supprime la conversation et oublie le contact. Il pourra toujours te joindre s’il t’écrit à nouveau.",
  "chat.dm.block_body":
    "Bloquer {name} ? Tu ne le verras plus dans l’onglet Maillage et tu ne recevras plus ses messages, même s’il est à proximité.",
  "chat.dm.more_options": "Plus d’options pour {name}",
  "chat.dm.remove_contact_short": "Retirer le contact",
  "chat.dm.block_short": "Bloquer le contact",
  "chat.dm.delete_short": "Supprimer la discussion",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Vider les messages",
  "chat.clear_confirm": "Vider",
  "chat.group_badge": "Groupe",
  "chat.more": "Plus",
  "chat.no_messages": "Pas encore de message",
  "chat.you": "Toi",
  "chat.a11y.channel": "Canal {name}",
  "chat.a11y.group": "Groupe {name}",
  "chat.a11y.muted": "coupé",
  "chat.a11y.pinned": "épinglé",

  // ---- Chats: start something new ----
  "chat.new.title": "Commencer quelque chose",
  "chat.new.channel": "Créer un canal privé",
  "chat.new.channel_label": "Canal privé",
  "chat.new.channel_desc":
    "Un salon que peut rejoindre quiconque a le lien. Crées-en un, ou rejoins-en un avec un lien qu’on t’a envoyé.",
  "chat.new.group": "Créer un groupe privé",
  "chat.new.group_label": "Groupe privé",
  "chat.new.group_desc":
    "Choisis des personnes précises. Jusqu’à 16. Reste en Bluetooth.",
  "chat.new.place": "Aller à un lieu par géohash",
  "chat.new.place_label": "Aller à un lieu",
  "chat.new.place_desc":
    "Ouvre le canal de localisation de n’importe où grâce à son géohash.",
  "chat.new.reach": "Portée",
  "chat.new.reach_internet":
    "Atteint les membres par Bluetooth et par internet.",
  "chat.new.reach_mesh": "Fonctionne à portée du Bluetooth, pas par internet.",
  "chat.new.reach_internet_desc":
    "Atteint aussi les membres par internet. Les relais peuvent voir que le canal est actif, jamais ses messages ni qui s’y trouve.",
  "chat.new.reach_mesh_desc":
    "Reste sur le maillage local. Le plus privé : rien ne sort de la portée du Bluetooth.",
  "chat.new.join_link": "Rejoindre un canal privé avec un lien d’invitation",
  "chat.new.back_to_chooser": "Revenir au choix",
  "chat.new.create_channel": "Créer le canal",
  "chat.new.name_required": "Saisis d’abord un nom de canal",
  "chat.new.name_taken": "Ce nom est déjà pris",
  "chat.new.create": "Créer",
  "chat.new.e2ee":
    "Chiffré de bout en bout. Seuls les membres peuvent lire les messages.",
  "chat.new.invite_only":
    "Sur invitation seulement. Quiconque reçoit le lien de ta part peut rejoindre. Il reste caché à tous les autres, même aux pairs proches.",
  "chat.new.name_exists": "Un canal portant ce nom existe déjà.",
  "chat.new.reach_bluetooth_chip": "Bluetooth seulement",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Rejoindre avec un lien d’invitation",

  // ---- Chats: join by link ----
  "chat.join.title": "Rejoindre avec un lien",
  "chat.join.not_airhop": "Ce n’est pas un lien Airhop.",
  "chat.join.reach_internet":
    "Atteint les membres par Bluetooth et par internet.",
  "chat.join.reach_mesh": "Reste à portée du Bluetooth.",
  "chat.join.contact_card":
    "Une carte de contact. Elle l’ajoute à tes contacts et ouvre la discussion.",
  "chat.join.unverified": "Impossible de vérifier ce lien",
  "chat.join.unverified_body":
    "La carte de contact ne correspond pas à ses propres clés, elle n’a donc pas été ajoutée. Demande qu’on t’en envoie une neuve.",
  "chat.join.paste": "Coller depuis le presse-papiers",
  "chat.join.join": "Rejoindre",
  "chat.join.public_channel":
    "Canal public {name}. Quiconque est à proximité peut le lire.",
  "chat.join.private_channel": "Canal privé {name}. {reach}",
  "chat.join.dm_with": "Message direct avec {name}.",
  "chat.join.joined_as": "Rejoint en tant que {name}",
  "chat.join.name_clash_body":
    "Tu es déjà dans un autre {name}. Les noms de canaux ne sont que des étiquettes : cette invitation a ouvert son propre canal, et celui où tu étais n’a pas bougé. Tu peux renommer l’un ou l’autre depuis ses infos de canal.",
  "chat.join.paste_hint":
    "Colle une invitation qui commence par airhop://. Toucher un lien marche aussi ; ceci sert pour un lien que tu ne peux pas toucher.",
  "chat.join.key_note":
    "L’invitation à un canal privé transporte la clé, l’entrée est donc immédiate et rien n’est demandé à personne d’autre.",
  "chat.join.offline_note":
    "Fonctionne hors ligne. Le lien est lu sur cet appareil, et le canal porte aussi loin que son créateur l’a réglé.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Impossible d’ouvrir cette cellule. Réessaie dans un instant.",
  "chat.jump.title": "Aller à un lieu",
  "chat.jump.saved": "LIEUX ENREGISTRÉS",
  "chat.jump.anywhere":
    "Ouvre le canal de localisation public de n’importe quel endroit, même d’un endroit où tu n’es pas.",
  "chat.jump.geohash_note":
    "Saisis son géohash. Toute personne dont la position tombe dans cette cellule partage le canal.",
  "chat.jump.teleport_note":
    "Tu apparais comme téléporté, pas comme proche. Cela ne passe que par internet.",
  "chat.jump.level_cell": "Cellule de niveau {level}",
  "chat.jump.already_here": "Tu es déjà ici. Aller ouvre ton canal {name}.",
  "chat.jump.open_direction": "Ouvrir la cellule au {direction}",
  "chat.jump.open_place": "Ouvrir {name}",
  "chat.jump.remove_place": "Retirer {name} des lieux enregistrés",
  "chat.jump.go": "Aller",
  "chat.jump.how":
    "Pour trouver un géohash : ouvre un canal de localisation > touche son nom > copie-le depuis là.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Impossible de joindre tous les membres. Réessaie quand ils sont à proximité.",
  "chat.group.you_were_added": "Tu as été ajouté à {name}.",
  "chat.group.added_you": "T’a ajouté à {name}",
  "chat.group.you_were_removed":
    "Tu as été retiré de {name}. Tu ne peux plus lire ni envoyer de messages ici.",
  "chat.group.removed_you": "T’a retiré de {name}",
  "chat.group.add_failed": "Impossible de les ajouter",
  "chat.group.add_failed_body":
    "Rien n’a changé. Soit ils ne sont pas joignables maintenant, soit le groupe est plein à 16, soit tu n’en es pas le créateur.",
  "chat.group.remove_failed": "Impossible de les retirer",
  "chat.group.remove_failed_body":
    "Rien n’a changé. Seule la personne qui a créé le groupe peut en changer les membres.",
  "chat.group.e2ee":
    "Chiffré de bout en bout. Seuls les membres peuvent lire les messages.",
  "chat.group.cap":
    "Jusqu’à 16 personnes, choisies par toi. Il n’y a pas de lien d’invitation, personne n’entre donc parce qu’on lui en a transféré un.",
  "chat.group.bluetooth":
    "Bluetooth seulement. Les membres hors de portée reçoivent les messages à leur retour.",
  "chat.group.members_label": "MEMBRES",
  "chat.group.none_in_range":
    "Personne n’est à portée. Les membres doivent être proches quand tu crées le groupe.",
  "chat.group.create_title": "Créer un groupe",
  "chat.group.name_placeholder": "Nom du groupe",
  "chat.group.create": "Créer",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Maillage local · Bluetooth seulement",
  "chat.scope.mesh_desc":
    "Atteint les appareils à portée du Bluetooth (environ 10 à 100 mètres). Pas besoin d’internet. Idéal pour se coordonner sur place.",
  "chat.scope.block": "Pâté de maisons · ~100 m",
  "chat.scope.block_desc":
    "Couverture à l’échelle du pâté de maisons. Les messages passent aussi par internet pour que des pairs proches mais hors de portée du Bluetooth puissent participer.",
  "chat.scope.neighborhood": "Quartier · ~1 km",
  "chat.scope.neighborhood_desc":
    "Couverture de quartier. Avec l’aide des relais, les pairs de toute la zone sont joignables même sans liaison Bluetooth directe.",
  "chat.scope.city": "Ville · ~10 km",
  "chat.scope.city_desc":
    "Canal à l’échelle de la ville. Utilise des relais internet géolocalisés pour atteindre les pairs de toute l’agglomération.",
  "chat.scope.province": "Département ou région · ~100 km",
  "chat.scope.province_desc":
    "Couverture départementale ou régionale. Reliée par internet pour une portée de plusieurs centaines de kilomètres.",
  "chat.scope.country": "Pays ou région · ~1000 km",
  "chat.scope.country_desc":
    "Couverture à l’échelle du pays. N’importe quel utilisateur d’Airhop ou de bitchat dans la zone peut rejoindre et lire les messages.",
  "chat.transport.bluetooth": "Bluetooth seulement",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Internet seulement",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Commande /{cmd} : {hint}",
  "chat.cmd.hug_hint": "Envoie une accolade chaleureuse",
  "chat.cmd.slap_hint": "Gifle avec une grosse truite",
  "chat.status.sending": "Envoi…",
  "chat.status.undo_send": "Annuler l’envoi",
  "chat.status.undo": "Annuler",
  "chat.status.sent": "Envoyé",
  "chat.status.received": "Reçu",
  "chat.status.failed": "Échec",
  "chat.status.canceled": "Annulé",
  "chat.status.waiting": "En attente",
  "chat.status.sending_short": "Envoi",
  "chat.status.receiving": "Réception",
  "chat.thread.not_available": "Indisponible ici",
  "chat.thread.private_channel": "Canal privé",
  "chat.thread.location_channel": "Canal de localisation",
  "chat.thread.public_channel": "Canal public",
  "chat.thread.notices": "Avis de ce canal",
  "chat.thread.invite": "Inviter quelqu’un dans ce canal",
  "chat.thread.not_in_range":
    "Hors de portée du Bluetooth. Remise par internet.",
  "chat.thread.not_nearby":
    "Pas à proximité. Nous remettrons le message dès son retour à portée ou en ligne.",
  "chat.thread.no_keys":
    "Il faudra être à portée du Bluetooth, ou scanner son code, pour lui écrire.",
  "chat.geo.card_received":
    "{name} a partagé son contact. Partage le tien pour continuer à parler une fois que l’un de vous se sera déplacé.",
  "chat.geo.exchange_complete":
    "Contacts échangés. Vous pouvez désormais vous joindre de n’importe où.",
  "chat.geo.keep_person": "Garder cette personne",
  "chat.geo.keep_person_desc":
    "Partage ton contact pour continuer à parler une fois que l’un de vous se sera déplacé. Elle connaîtra ton identité permanente.",
  "chat.geo.card_sent": "Partagé · en attente du sien",
  "chat.thread.left_cell":
    "Tu as quitté cette zone, il ne peut donc plus te joindre ici. Échangez vos codes pour continuer à parler de n’importe où.",
  "chat.thread.no_route":
    "Impossible de le joindre pour l’instant. Le message partira dès qu’un chemin sera disponible.",
  "chat.thread.empty": "Pas encore de message",
  "chat.thread.empty_desc": "Démarre une conversation chiffrée.",
  "chat.thread.jump_latest": "Aller au dernier message",
  "chat.thread.back_to_members": "Revenir aux membres",
  "chat.thread.nostr_key": "Clé publique Nostr",
  "chat.thread.in_range": "À portée",
  "chat.voice.not_recorded": "La note vocale n’a pas été enregistrée",
  "chat.thread.message": "Message",
  "chat.thread.message_placeholder": "Message…",
  "chat.thread.length_full": "Le message est plein",
  "chat.thread.waiting_for": "En attente du retour de {name} · {percent} %",
  "chat.thread.peer": "pair",
  "chat.thread.cancel_transfer": "Annuler {name}",
  "chat.thread.queued_more": "{count} de plus en attente d’envoi",
  "chat.thread.across_bridge": "{count} de l’autre côté du pont",
  "chat.thread.bridged": "via le pont",
  "chat.thread.invite_body":
    "Rejoins-moi dans {channel} sur Airhop — messagerie maillée privée, pensée d’abord pour le hors-ligne.",
  "chat.thread.go_back_unread": "Revenir, {count} non lus",
  "chat.thread.view_info": "Voir les infos de {name}",
  "chat.thread.notices_new": "Avis de ce canal, {count} nouveaux",
  "chat.thread.say_something": "Dis quelque chose dans {channel}.",
  "chat.thread.jump_latest_new": "Aller au dernier message, {count} nouveaux",
  "chat.thread.unconfirmed_since": "Aucune remise confirmée depuis le {date}",
  "chat.thread.no_reach":
    "Aucun pair à proximité · personne ne l’a encore reçu",
  "chat.thread.channel_needs_internet":
    "Internet désactivé · ce canal n’atteint que les gens à portée du Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet désactivé · cette cellule n’est joignable que par internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet désactivé · cette conversation ne circule que par internet",
  "chat.thread.via_gateway":
    "Internet désactivé · un appareil proche l’achemine en ligne pour toi",
  "chat.thread.group_queued":
    "Personne de ce groupe n’est encore à proximité. Le message leur parviendra dès qu’ils le seront.",
  "chat.thread.no_group_key":
    "Tu ne fais plus partie de ce groupe, ceci ne peut donc pas être envoyé",
  "chat.thread.no_reach_offline":
    "Internet désactivé et aucun pair à proximité · personne ne l’a encore reçu",
  "chat.thread.mention": "Mentionner {name}",
  "chat.thread.someone_talking": "{hold}. {name} est en train de parler.",
  "chat.thread.attach_note":
    "Les fichiers ne partent qu’à portée du Bluetooth. Le texte et les paiements atteignent les contacts par internet ; les pièces jointes non.",
  "chat.thread.message_peer": "Écrire à {name}",
  "chat.thread.send": "Envoyer le message",
  "chat.thread.group": "Groupe",
  "chat.bridge.nearby_only":
    "À proximité seulement : garde ce message hors du pont maillé",
  "chat.bridge.nearby_label": "À proximité seulement · reste en Bluetooth",
  "chat.bridge.bridging_label":
    "Relié aux zones proches · touche pour à proximité seulement",
  "chat.screenshot.you_took": "Tu as fait une capture d’écran",
  "chat.screenshot.you_took_private":
    "Tu as fait une capture d’écran · personne n’a été prévenu",
  "chat.screenshot.heads_up": "Attention",
  "chat.screenshot.notice": "* {name} a fait une capture d’écran *",
  "chat.screenshot.notified_dm":
    "{name} a été prévenu que tu as fait une capture de cette conversation.",
  "chat.screenshot.notified":
    "Tout le monde dans ce canal a été prévenu que tu as fait une capture.",
  "chat.screenshot.not_notified":
    "Personne n’a été prévenu. Ce canal est public : annoncer une capture d’écran aurait laissé une trace de ton passage.",
  "chat.thread.error": "Erreur",
  "chat.thread.go_back": "Revenir en arrière",
  "chat.bubble.via_bridge": "via le pont maillé",
  "chat.bubble.view_profile": "Voir le profil de {name}",
  "chat.bubble.forwarded": "Transféré",
  "chat.bubble.attachment": "pièce jointe",
  "chat.bubble.a11y": "{sender} : {body}. Appui long pour plus d’options.",
  "chat.bubble.failed_retry": "Échec de l’envoi. Touche pour réessayer.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Infos du message",
  "chat.info.delivered_to": "Remis à {name}",
  "chat.info.read_by": "Lu par {name}",
  "chat.info.group_reach_desc":
    "Joignables maintenant, ce n’est pas une confirmation de remise",
  "chat.info.group_alone": "Aucun autre membre",
  "chat.info.today_at": "Aujourd’hui à {time}",
  "chat.info.sending": "Envoi…",
  "chat.info.failed": "Échec de l’envoi",
  "chat.info.courier": "Transporté par un ami",
  "chat.info.sent": "Envoyé",
  "chat.info.queued": "En attente d’envoi",
  "chat.info.waiting": "En attente…",
  "chat.action.info": "Infos du message",
  "chat.action.save_photos": "Enregistrer dans les photos",
  "chat.action.save_copy": "Enregistrer une copie",
  "chat.action.forward": "Transférer",
  "chat.action.select": "Sélectionner",
  "chat.select.cancel": "Annuler la sélection",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Caméra",
  "chat.attach.camera_desc": "Prends une photo ou une vidéo",
  "chat.attach.library": "Galerie photo",
  "chat.attach.library_desc": "Choisis dans ta galerie",
  "chat.attach.document": "Document",
  "chat.attach.document_desc": "Envoie n’importe quel fichier ou PDF",
  "chat.attach.voice": "Note vocale",
  "chat.attach.voice_desc": "Enregistre et envoie un message vocal",
  "chat.attach.ecash": "Envoyer des ecash",
  "chat.attach.ecash_desc": "Envoie des sats Cashu depuis ton portefeuille",
  "chat.attach.location": "Localisation",
  "chat.attach.location_desc": "Envoie où tu es en ce moment",
  "chat.attach.title": "Joindre",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "A partagé une position",
  "chat.location.received_summary": "A partagé sa position",
  "chat.location.title": "Localisation",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Relevée il y a {ago}",
  "chat.location.open_maps": "Ouvrir dans Maps",
  "chat.location.no_forward": "Les positions ne se transfèrent pas",
  "chat.location.no_forward_body":
    "Une position s’envoie à une seule personne. Partage la tienne si tu veux que quelqu’un d’autre l’ait.",
  "chat.location.no_fix":
    "Autorise la localisation pour voir à quelle distance c’est",
  "chat.location.send_title": "Envoyer ta position",
  "chat.location.send_body":
    "{name} verra un seul point : là où tu es maintenant. Cela ne continue pas de se mettre à jour.",
  "chat.location.send": "Envoyer la position",
  "chat.location.finding": "Recherche de ta position…",
  "chat.location.no_location": "Impossible d’obtenir ta position",
  "chat.location.no_location_body":
    "Autorise l’accès à la localisation et vérifie que les services de localisation sont actifs, puis réessaie.",
  "chat.location.not_delivered": "Impossible d’envoyer ta position",
  "chat.location.not_delivered_body":
    "Une position ne vaut la peine d’être envoyée que tant qu’elle est actuelle : elle n’est donc pas mise en file d’attente. Réessaie quand {name} sera joignable.",
  "chat.location.direction.n": "au nord",
  "chat.location.direction.ne": "au nord-est",
  "chat.location.direction.e": "à l’est",
  "chat.location.direction.se": "au sud-est",
  "chat.location.direction.s": "au sud",
  "chat.location.direction.sw": "au sud-ouest",
  "chat.location.direction.w": "à l’ouest",
  "chat.location.direction.nw": "au nord-ouest",
  "chat.attach.send_anyway": "Envoyer quand même",
  "chat.attach.bitchat_too_big": "Cela pourrait ne pas arriver",
  "chat.attach.bitchat_too_big_body":
    "{name} est sur bitchat, qui abandonne en cours de route sur un gros fichier. En dessous de 350 KiB environ, c’est fiable. L’envoyer à un contact Airhop n’a pas cette limite.",
  "chat.attach.bitchat_unopenable": "Il pourrait ne pas réussir à l’ouvrir",
  "chat.attach.bitchat_unopenable_body":
    "{name} est sur bitchat, qui affiche les photos et les notes vocales mais liste tout le reste comme un fichier qu’il ne peut pas ouvrir. Cela arrivera, mais il ne pourra peut-être pas le voir.",
  "chat.attach.file": "Joindre un fichier",
  "chat.attach.unavailable": "Pas de pièces jointes ici",
  "chat.attach.not_sent": "Pièce jointe non envoyée",
  "chat.attach.read_failed":
    "Un problème est survenu à la lecture de ce fichier. Essaies-en un autre.",
  "chat.attach.caption": "Ajoute une légende…",
  "chat.attach.send": "Envoyer la pièce jointe",
  "chat.attach.generic": "Pièce jointe",
  "chat.media.view_full": "Voir la photo en plein écran",
  "chat.media.gone_photo": "La photo n’est pas sur cet appareil",
  "chat.media.gone_video": "La vidéo n’est pas sur cet appareil",
  "chat.media.gone_voice": "La note vocale n’est pas sur cet appareil",
  "chat.media.gone_file": "Le fichier n’est pas sur cet appareil",
  "chat.media.gone_note": "Retiré au bout de 7 jours ou au vidage du cache",
  "chat.media.ask_resend": "Redemander",
  "chat.media.resend_draft": "Tu peux me renvoyer {kind} ?",
  "chat.media.kind_photo": "cette photo",
  "chat.media.kind_video": "cette vidéo",
  "chat.media.kind_voice": "cette note vocale",
  "chat.media.kind_file": "ce fichier",
  "chat.media.pause_voice": "Mettre la note vocale en pause",
  "chat.media.play_voice": "Lire la note vocale",
  "chat.media.voice_position": "Position dans la note vocale",
  "chat.media.voice_scrub":
    "Touche le long des barres pour aller à cet endroit",
  "chat.media.image": "Image",
  "chat.media.tap_load_photo": "Touche pour charger la photo",
  "chat.media.open_document": "Ouvrir {name}",
  "chat.media.document": "document",
  "chat.media.tap_load_video": "Touche pour charger la vidéo",
  "chat.media.video": "Vidéo",
  "chat.media.photo": "Photo",
  "chat.media.close_photo": "Fermer la photo",
  "chat.media.save_photo": "Enregistrer la photo dans tes photos",
  "chat.media.share_photo": "Partager la photo",
  "chat.media.saved_videos": "Enregistré dans tes vidéos",
  "chat.media.saved_photos": "Enregistré dans tes photos",
  "chat.media.not_saved": "Non enregistré",
  "chat.media.cant_open": "Impossible d’ouvrir le fichier",
  "chat.media.no_app":
    "Cet appareil n’a aucune app pour ouvrir ou partager ce fichier.",
  "chat.media.open_failed":
    "Le fichier n’a pas pu être ouvert. Il a peut-être été vidé du cache.",
  "media.blocked.nostr_only":
    "Tu ne connais cette personne que par un relais. Seul le texte est possible. Les photos, les fichiers et les notes vocales exigent le Bluetooth.",
  "media.blocked.private_channel":
    "Une pièce jointe diffusée est signée mais pas chiffrée, donc l’envoyer dans un canal privé la laisserait en clair alors que le texte ici reste chiffré.",
  "media.blocked.private_group":
    "Une pièce jointe diffusée est signée mais pas chiffrée, donc l’envoyer dans un groupe privé la laisserait en clair alors que le texte ici reste chiffré.",
  "media.blocked.location_channel":
    "Un canal de localisation atteint les gens par internet, et les photos, les fichiers et les notes vocales passent par le Bluetooth : ils n’arriveraient donc jamais.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Pas de notes vocales ici",
  "chat.voice.hold_live": "Maintiens pour parler en direct",
  "chat.voice.hold_record": "Maintiens pour enregistrer une note vocale",
  "chat.voice.cancel_recording": "Annuler l’enregistrement",
  "chat.voice.slide_cancel": "Glisse pour annuler",
  "chat.voice.release_cancel": "Relâche pour annuler",
  "chat.voice.a11y_toggle":
    "Touche deux fois pour commencer ou arrêter de parler.",
  "chat.voice.limit_reached":
    "Limite de deux minutes atteinte, relâche pour envoyer",
  "chat.voice.limit_sent": "Limite de deux minutes atteinte, note envoyée",
  "chat.voice.stop_send": "Arrêter l’enregistrement et envoyer",
  "chat.voice.lift_lock": "Glisse vers le haut pour enregistrer mains libres",
  "chat.voice.live_speaking": "{name} parle",
  "voice.unavailable": "Voix en direct indisponible",
  "voice.recording_stopped": "Enregistrement arrêté",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Accès à la caméra",
  "chat.perm.camera_purpose": "prendre une photo à envoyer",
  "chat.perm.photo_label": "Accès aux photos",
  "chat.perm.photo_purpose": "choisir une photo ou une vidéo à envoyer",
  "chat.perm.photo_save_purpose": "enregistrer ceci dans tes photos",
  "chat.perm.mic_label": "Accès au microphone",
  "chat.perm.mic_live_purpose": "parler aux gens à proximité",
  "chat.perm.mic_note_purpose": "enregistrer une note vocale",
  "chat.perm.recording_stopped": "Enregistrement arrêté",
  "chat.perm.record_failed":
    "Impossible de démarrer l’enregistrement. Vérifie les autorisations du microphone.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Encaissé",
  "chat.ecash.reclaimed": "Récupéré",
  "chat.ecash.claiming": "Encaissement…",
  "chat.ecash.claim": "Encaisser",
  "chat.ecash.claim_amount": "Encaisser {amount} {unit}",
  "chat.ecash.already_claimed": "Déjà encaissé",
  "chat.ecash.already_claimed_body":
    "Chaque preuve de ce jeton est déjà dans ton portefeuille, rien n’a donc été ajouté.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "Confié au maillage pour une remise au mieux",
  "chat.info.queued_desc":
    "Retenu sur ce téléphone jusqu’à ce qu’un chemin existe jusqu’à eux",
  "chat.info.reclaimed": "Récupéré",
  "chat.info.reclaimed_desc":
    "Tu as repris ce paiement dans ton portefeuille, il ne sera donc pas remis",
  "chat.info.about": "À propos",
  "chat.info.group_desc":
    "Un groupe privé. Seuls les membres ajoutés par son créateur peuvent le lire, et il reste en Bluetooth.",
  "chat.info.teleported_desc":
    "Un canal de localisation public pour cette cellule de géohash. Quiconque se trouve dans la cellule, sous Airhop ou sous bitchat, le partage par internet. Tu es téléporté, pas physiquement ici.",
  "chat.info.custom_desc":
    "Un canal personnalisé. Quiconque connaît le nom peut rejoindre depuis n’importe quel appareil sous Airhop ou bitchat.",
  "chat.info.private_e2ee": "Privé · chiffré de bout en bout",
  "chat.info.public_plain": "Public · non chiffré",
  "chat.info.group_privacy":
    "Seuls les membres affichés ci-dessous peuvent lire ce groupe. Les messages restent en Bluetooth, les membres hors de portée les reçoivent donc à leur retour.",
  "chat.info.teleport_privacy":
    "Un lieu où tu t’es téléporté. Il atteint tout le monde dans cette cellule par internet, et personne à portée du Bluetooth.",
  "chat.info.location_off_privacy":
    "La localisation est désactivée, ce canal n’atteint donc les appareils proches que par Bluetooth. Active-la pour atteindre sa cellule de zone par internet.",
  "chat.info.invite_privacy":
    "Seules les personnes que tu invites via le lien peuvent le lire. Il reste caché à tous les autres, même aux pairs proches.",
  "chat.info.public_privacy":
    "Quiconque rejoint peut lire chaque message. Utilise un message direct pour parler en privé ; les messages directs sont chiffrés de bout en bout.",
  "chat.info.remove_member": "Retirer le membre",
  "chat.info.remove_member_body":
    "Retirer {name} du groupe ? La clé du groupe tourne, il ne pourra donc plus lire les nouveaux messages.",
  "chat.info.message_member": "Écrire à {name}",
  "chat.info.remove_member_a11y": "Retirer {name}",
  "chat.info.no_addable":
    "Aucun pair joignable à ajouter. Les membres doivent être à proximité.",
  "chat.info.add_count": "Ajouter {count}",
  "chat.info.teleported_tag": "{level}  ·  téléporté",
  "chat.info.active": "Actif",
  "chat.info.members": "Membres",
  "chat.info.bookmark": "Enregistrer ce lieu",
  "chat.info.remove_bookmark": "Retirer des lieux enregistrés",
  "chat.info.default_notice":
    "On ne peut pas quitter les canaux par défaut. Ils font partie du protocole de maillage d’Airhop.",
  "chat.info.custom_channel": "Canal personnalisé",
  "chat.info.geohash": "Géohash",
  "chat.info.copy_geohash": "Copier le géohash",
  "chat.info.relays": "Relais",
  "chat.info.show_relays": "Afficher les relais qui portent ce canal",
  "chat.info.relay_custom": "personnalisé",
  "chat.info.relays_none":
    "Aucun. Cette cellule est en Bluetooth seulement pour l’instant.",
  "chat.info.search_members": "Rechercher parmi les membres",
  "chat.info.search_members_placeholder": "Rechercher parmi les membres…",
  "chat.info.teleported": "Téléporté",
  "chat.info.creator": "Créateur",
  "chat.info.no_matches": "Aucun résultat",
  "chat.info.no_one_here": "Personne ici pour l’instant",
  "chat.info.add_members": "Ajouter des membres",
  "chat.info.add_selected": "Ajouter les membres sélectionnés",
  "chat.info.add": "Ajouter",
  "chat.info.leave_group": "Quitter le groupe",
  "chat.info.leave_channel": "Quitter le canal",
  "chat.info.leave": "Quitter",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Vous discutez depuis le {date}",
  "chat.contact.verified_since": "Vérifié depuis le {date}",
  "chat.contact.anonymous": "Anonyme",
  "chat.contact.anonymous_desc":
    "Un pseudonyme de géohash sans identité durable à vérifier",
  "chat.contact.verified": "Vérifié",
  "chat.contact.verified_desc": "Tu as scanné son code QR",
  "chat.contact.verified_desc_compared": "Vous avez comparé vos codes",
  "chat.contact.not_verified": "Non vérifié",
  "chat.contact.not_verified_desc":
    "Scanne son code, ou comparez-en un pendant un appel, pour confirmer que c’est bien lui",
  "chat.contact.e2ee": "Chiffré de bout en bout",
  "chat.contact.e2ee_nostr":
    "Emballé selon NIP-17, les relais ne peuvent donc pas le lire",
  "chat.contact.e2ee_mesh":
    "Noise XX, plus Double Ratchet entre appareils Airhop",
  "chat.contact.copy_nostr": "Copier la clé publique Nostr",
  "chat.contact.nostr_key": "Clé publique Nostr",
  "chat.contact.cell_key_note":
    "Cette clé appartient à la zone où vous vous êtes rencontrés. Elle change si l’un de vous se déplace, et la conversation s’arrête avec elle. Échangez vos contacts pour continuer à parler de n’importe où.",
  "chat.contact.peer_name": "Nom du pair",
  "chat.contact.peer_id": "Identifiant de pair",
  "chat.contact.rename": "Renommer",
  "chat.contact.rename_needs_contact":
    "Tu peux renommer les gens dont tu détiens les clés. Échangez d’abord vos cartes de contact, puis ceci devient un nom que toi seul vois.",
  "chat.contact.rename_needs_keys":
    "Pas encore de clés pour ce contact. Écris-lui, ou scanne son code, et tu pourras lui donner un nom que toi seul verras.",
  "chat.contact.renamed_by_you": "Le nom que tu lui as donné",
  "chat.contact.copy_peer_id": "Copier l’identifiant de pair",
  "chat.contact.verify": "Vérifier le contact",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Avis",
  "chat.notices.post_area": "Publier un avis dans cette zone",
  "chat.notices.post_mesh": "Publier un avis sur le maillage",
  "chat.notices.mark_urgent": "Marquer comme urgent",
  "chat.notices.post": "Publier l’avis",
  "chat.notices.post_short": "Publier",
  "chat.notices.delete": "Supprimer l’avis",
  "chat.notices.just_now": "à l’instant",
  "chat.notices.fades_soon": "disparaît bientôt",
  "chat.notices.1_day": "1 jour",
  "chat.notices.3_days": "3 jours",
  "chat.notices.7_days": "7 jours",
  "chat.notices.fading": "en train de disparaître",
  "chat.notices.fades_in_hours": "disparaît dans {count} h",
  "chat.notices.fades_in_days": "disparaît dans {count} j",
  "chat.notices.scope_geo": "Géo",
  "chat.notices.scope_mesh": "Maillage",
  "chat.notices.urgent_short": "Urgent",
  "chat.notices.permanent_warning":
    "Ne disparaît jamais. C’est public, lié à cette zone, et tu ne peux pas le reprendre.",
  "chat.notices.none":
    "Pas encore d’avis. Publies-en un pour qu’il reste ici pour les autres.",

  // ---- Chats: search results ----
  "chat.search.photos": "Photos",
  "chat.search.videos": "Vidéos",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Documents",
  "chat.search.links": "Liens",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filtrer par {filter}",
  "chat.search.no_matches": "Aucun {filter} ne correspond à « {query} »",
  "chat.search.no_media": "Pas encore de {filter}",
  "chat.search.result_a11y": "{chat}, {kind} de {sender}",
  "chat.search.you": "toi",
  "chat.search.section_chats": "Discussions",
  "chat.search.section_messages": "Messages",
  "chat.search.section_notices": "Avis",
  "chat.search.hint":
    "Cherche dans les messages et les discussions, ou choisis un filtre ci-dessus.",
  "chat.search.no_results": "Aucun résultat pour « {query} »",
  "chat.search.open_chat": "Ouvrir {name}",
  "chat.search.message_a11y": "{chat}, message de {sender} : {snippet}",
  "chat.search.notice_a11y": "Avis dans {chat} de {author} : {snippet}",
  "chat.search.urgent": "Urgent ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Il y en a {count} dans cette liste. La vider ne les retire que d’ici, et les messages restent non lus dans leurs conversations. Tout marquer comme lu nettoie les deux.",
  "chat.notif.mark_all_read": "Tout marquer comme lu",
  "chat.notif.clear_list": "Vider la liste",
  "chat.notif.clear_all_a11y": "Vider les {count} notifications",
  "chat.notif.title": "Notifications",
  "chat.notif.clear_short": "Vider",
  "chat.notif.close": "Fermer les notifications",
  "chat.notif.none": "Pas encore de notification",
  "chat.notif.none_desc":
    "Les messages, les mentions et les avis de tes canaux et de tes discussions apparaissent ici.",
  "chat.notif.new": "Nouveau",
  "chat.notif.notice_in": "avis dans {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Transférer à…",
  "chat.forward.to": "Transférer à {name}",
  "chat.forward.cant_send_here": "Impossible de transférer ici",
  "chat.forward.cant_send_to": "Impossible de transférer à {name}",
  "chat.forward.channels": "Canaux",
  "chat.forward.groups": "Groupes",
  "chat.forward.locations": "Lieux",
  "chat.forward.dms": "Messages directs",
  "chat.forward.none": "Pas encore d’autre discussion",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Démarrage du maillage…",
  "mesh.banner.no_bluetooth":
    "Pas de Bluetooth sur cet appareil · internet seulement",
  "mesh.banner.bluetooth_off": "Bluetooth désactivé · maillage indisponible",
  "mesh.banner.permission_needed": "L’autorisation Bluetooth est nécessaire",
  "mesh.banner.blocked": "Bluetooth bloqué · autorise-le dans les réglages",
  "mesh.banner.location_permission":
    "La localisation est nécessaire pour trouver des pairs",
  "mesh.banner.advertising_unsupported":
    "Ce téléphone peut voir les autres mais pas être découvert",
  "mesh.banner.location_off_android":
    "Localisation désactivée · Android en a besoin pour trouver des pairs",
  "mesh.banner.paused": "Maillage en pause · tu es absent",
  "mesh.banner.location_off":
    "Localisation désactivée · canaux de localisation indisponibles",
  "mesh.banner.battery_saver":
    "Économiseur de batterie · balayage moins fréquent",
  "mesh.banner.wipe_incomplete":
    "Effacement incomplet · des données peuvent subsister, une nouvelle ouverture réessaie",
  "mesh.banner.wifi_off":
    "Wi-Fi désactivé · les gros fichiers partent plus lentement",
  "mesh.banner.clock_skew":
    "L’horloge de ce téléphone est fausse · règle la date et l’heure sur automatique",
  "mesh.banner.internet_off": "Internet désactivé · Bluetooth uniquement",
  "mesh.banner.relaying": "Aucun pair à proximité · relayage par Nostr",
  "mesh.banner.tor": "Tor activé · trafic internet routé",
  "mesh.banner.tor_starting": "Démarrage de Tor · connexion en cours",
  "mesh.banner.tor_blocked":
    "Tor n’a pas pu se connecter · le maillage fonctionne toujours",
  "mesh.banner.gateway":
    "Passerelle internet activée · relayage des pairs proches",
  "mesh.banner.bridge": "Pont maillé activé · discussion publique reliée",
  "mesh.banner.background_limits":
    "{brand} peut mettre le maillage en pause en arrière-plan",
  "mesh.banner.bridge_across":
    "Pont maillé activé · {count} de l’autre côté du pont",
  "mesh.banner.action.turn_on": "Activer",
  "mesh.banner.action.allow": "Autoriser",
  "mesh.banner.action.resume": "Reprendre",
  "mesh.banner.action.fix": "Corriger",
  "mesh.banner.hint.resume": "Réactive l’annonce et le balayage Bluetooth",
  "mesh.banner.hint.enable_bluetooth":
    "Demande à Android d’activer le Bluetooth",
  "mesh.banner.hint.location_settings":
    "Ouvre les réglages de localisation du système",
  "mesh.banner.hint.app_settings":
    "Ouvre les autorisations d’Airhop dans les réglages système",
  "mesh.banner.hint.battery_settings":
    "Ouvre les réglages d’activité en arrière-plan de ce téléphone",
  "mesh.banner.dismiss": "Ignorer : {label}",
  "mesh.banner.hint.dismiss": "Masque cet avis pour de bon",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Recherche de pairs à proximité…",
  "mesh.radar.starting": "Démarrage du maillage…",
  "mesh.radar.no_bluetooth": "Cet appareil n’a pas de Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth désactivé · aucun balayage",
  "mesh.radar.permission_needed": "L’autorisation Bluetooth est nécessaire",
  "mesh.radar.blocked": "Bluetooth bloqué",
  "mesh.radar.location_permission":
    "L’autorisation de localisation est nécessaire",
  "mesh.radar.location_off": "Localisation désactivée · aucun balayage",
  "mesh.radar.hint_rings":
    "Les anneaux indiquent la force du signal BLE, pas la distance",
  "mesh.radar.hint_checking": "Vérification du Bluetooth et des autorisations",
  "mesh.radar.hint_internet":
    "Les messages continuent de circuler par internet",
  "mesh.radar.hint_turn_on": "Active le Bluetooth pour découvrir des pairs",
  "mesh.radar.hint_allow": "Autorise le Bluetooth pour découvrir des pairs",
  "mesh.radar.hint_allow_settings":
    "Autorise le Bluetooth dans les réglages pour découvrir des pairs",
  "mesh.radar.hint_location_permission":
    "Android 11 et versions antérieures exigent la localisation pour balayer en Bluetooth",
  "mesh.radar.hint_android_location":
    "Android exige la localisation activée pour renvoyer les résultats du balayage Bluetooth",
  "mesh.radar.signal_strong": "Fort",
  "mesh.radar.signal_medium": "Moyen",
  "mesh.radar.signal_weak": "Faible",
  "mesh.radar.you_center": "Toi, au centre du maillage",
  "mesh.radar.sonar_hint":
    "Joue un balayage sonar. La recherche est déjà continue.",
  "mesh.radar.paused": "Maillage en pause · tu es absent",
  "mesh.radar.ring_hint":
    "La position de l’anneau reflète la force du signal, pas la distance",
  "mesh.radar.set_online":
    "Mets ton statut sur En ligne dans le profil pour découvrir des pairs",
  "mesh.radar.in_range": "à portée",
  "mesh.radar.recently_seen": "vus récemment",
  "mesh.radar.peer_hint": "Ouvre les options pour écrire ou payer ce pair",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "à l’instant",
  "mesh.peer.none": "Aucun pair à proximité",
  "mesh.peer.none_desc":
    "Les autres appareils sous Airhop ou bitchat qui sont à portée du Bluetooth apparaissent ici.",
  "mesh.peer.id_copied": "Identifiant de pair copié",
  "mesh.peer.copy_id": "Copier l’identifiant de pair",
  "mesh.peer.their_name": "Se fait appeler {name}",
  "mesh.peer.in_range": "À portée",
  "mesh.peer.relay": "Nœud relais",
  "mesh.peer.relay_body":
    "Une radio que quelqu’un a laissée allumée pour élargir le maillage. Elle transporte des messages qu’elle ne peut pas lire. Il n’y a personne à qui écrire ici.",
  "mesh.peer.send_dm": "Envoyer un message direct",
  "mesh.peer.message": "Message",
  "mesh.peer.send_sats": "Envoyer des ecash",
  "mesh.peer.amount_placeholder": "Montant en sats",
  "mesh.peer.amount_first": "Envoyer des ecash, saisis d’abord un montant",
  "mesh.peer.cancel_send": "Annuler l’envoi d’ecash",
  "mesh.peer.view_peer": "Voir le pair {name}",
  "mesh.peer.view_peer_online": "Voir le pair {name}, en ligne",
  "mesh.peer.last_seen": "Vu il y a {ago}",
  "mesh.peer.send_amount": "Envoyer {amount} sats",
  "mesh.peer.direct": "Connexion directe",
  "mesh.peer.check_distance": "Vérifier la distance",
  "mesh.peer.checking": "Vérification",
  "mesh.peer.no_reply": "Aucune réponse",
  "mesh.peer.no_reply_hint":
    "Ils se sont peut-être déplacés, ou leur app ne répond pas",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Région",
  "mesh.level.province": "Département",
  "mesh.level.city": "Ville",
  "mesh.level.neighborhood": "Quartier",
  "mesh.level.block": "Pâté de maisons",
  "mesh.level.building": "Bâtiment",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Disponible",
  "wallet.balance.unit_hint": "Bascule entre satoshis et bitcoin",
  "wallet.balance.a11y": "Solde {value} {unit}",
  "wallet.balance.locked":
    "Le stockage du portefeuille est verrouillé. Les preuves ecash sont conservées dans un fichier chiffré dont la clé se trouve dans le trousseau de l’appareil, et il n’a pas pu être ouvert. Déverrouille l’appareil et rouvre Airhop.",
  "wallet.balance.tor_blocked":
    "Tor est actif, donc les requêtes au mint sont bloquées : elles sortiraient sur le réseau en clair et relieraient ton IP à tes preuves. Envoyer et recevoir sur le maillage fonctionne toujours. Autorise le trafic vers le mint dans Réglages, Sécurité.",
  "wallet.balance.unconfirmed_note":
    "{amount} pas encore confirmés auprès du mint",
  "wallet.balance.reserved_note": "{amount} réservés pour un envoi en cours",
  "wallet.balance.other_mint_note": "{amount} sur un compte chez un autre mint",
  "wallet.balance.test_mint_note":
    "Comprend de l’argent fictif issu d’un mint de test. Ce n’est pas du bitcoin et ça ne peut pas être encaissé.",
  "wallet.token": "Jeton",
  "wallet.action.send": "Envoyer un jeton ecash",
  "wallet.action.send_disabled":
    "Envoyer un jeton ecash, indisponible avec un solde vide",
  "wallet.action.receive": "Recevoir un jeton ecash",
  "wallet.action.zap": "Envoyer un zap à un contact Nostr",
  "wallet.action.zap_disabled":
    "Envoyer un zap à un contact Nostr, indisponible avec un solde vide",
  "wallet.action.add_mint": "Ajouter un mint Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Impossible de construire le jeton",
  "wallet.send.title": "Envoyer des ecash",
  "wallet.send.amount_in": "Montant en {unit}",
  "wallet.send.body":
    "Construit hors ligne à partir de preuves que tu possèdes déjà. Rien ne quitte ton solde définitivement tant que tu n’as pas confirmé que le jeton est arrivé.",
  "wallet.send.stale_fee_note":
    "Les frais ont été vérifiés pour la dernière fois il y a {days} jours. Si ce mint a augmenté les siens depuis, l’envoi peut coûter un peu plus.",
  "wallet.send.fee_note":
    "{spend} {unit} quittent ton solde ; les {fee} supplémentaires couvrent les frais du mint qu’ils auraient payés sinon",
  "wallet.send.qr_too_big":
    "Ce jeton est réparti sur trop de pièces pour tenir dans un code QR. Partage-le ou copie-le, ou actualise auprès du mint pour le consolider.",
  "wallet.send.bearer_note":
    "Celui qui détient cette chaîne possède l’argent. Les preuves sont réservées, pas dépensées : si elle n’atteint personne, tu peux les récupérer dans En attente.",
  "wallet.send.qr_too_big_short":
    "Ce jeton est réparti sur trop de pièces pour tenir dans un code QR. Partage-le ou copie-le.",
  "wallet.send.scan_note":
    "Fais-le scanner depuis leur portefeuille. Il reste récupérable tant que tu ne l’as pas marqué comme remis.",
  "wallet.send.mesh_note":
    "Le jeton part sous forme de message direct chiffré sur le maillage. Pas besoin d’internet.",
  "wallet.send.no_peers_note":
    "Ouvre l’onglet Maillage pour trouver des appareils proches, ou partage le jeton autrement.",
  "wallet.send.send_to": "Envoyer à {name}",
  "wallet.send.memo": "Note (facultative, voyage avec le jeton)",
  "wallet.send.building": "Construction…",
  "wallet.send.build": "Construire le jeton",
  "wallet.send.inexact_body":
    "Tes preuves ne peuvent pas faire exactement {amount} {unit} hors ligne. Le plus petit jeton que tu peux construire vaut {spend} {unit}, et hors ligne il n’y a pas de monnaie rendue : les {extra} {unit} en trop vont au destinataire.\n\nActualiser auprès du mint en étant connecté découperait tes preuves en coupures qui donnent le compte exact.",
  "wallet.send.send_amount": "Envoyer {amount}",
  "wallet.send.sent_to": "{amount} {unit} envoyés à {name}",
  "wallet.send.sent_to_body":
    "{route} Il reste récupérable dans En attente jusqu’à ce que tu confirmes la réception, ou que le mint nous dise que les preuves ont été encaissées.",
  "wallet.send.copy_token": "Copier le jeton",
  "wallet.send.share_token": "Partager le jeton",
  "wallet.send.open_in_wallet": "Ouvrir ce jeton dans un autre portefeuille",
  "wallet.send.open_in_wallet_short": "Ouvrir dans un portefeuille",
  "wallet.send.to_peer": "Envoyer le jeton à un pair proche",
  "wallet.send.to_peer_short": "Envoyer à un pair",
  "wallet.send.mark_delivered": "Marquer comme remis et terminer",
  "wallet.send.they_got_it": "Ils l’ont reçu",
  "wallet.send.keep_pending": "Laisser cet envoi en attente",
  "wallet.send.decide_later": "Décider plus tard",
  "wallet.send.no_peers": "Aucun pair à portée",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "C’est ton propre paiement",
  "wallet.receive.own_payment_body":
    "Ces pièces sont encore réservées pour un envoi que tu n’as pas soldé, il n’y a donc rien à réclamer. Utilise Récupérer sur ce paiement pour les remettre directement dans ton solde.",
  "wallet.receive.already_have": "Déjà dans ton portefeuille",
  "wallet.receive.already_have_body":
    "Chaque preuve de ce jeton est déjà stockée ici, rien n’a donc été ajouté. Les soldes sont inchangés.",
  "wallet.receive.stored_unconfirmed":
    "Stocké depuis {mint}, mais pas encore confirmé auprès du mint ({reason}).",
  "wallet.receive.offline": "hors ligne",
  "wallet.receive.redeemed_here":
    "Encaissé chez {mint}. Ces preuves sont maintenant à toi seul : la copie de l’expéditeur ne fonctionne plus.",
  "wallet.receive.memo_quoted": "\n\n« {memo} »",
  "wallet.receive.redeemed_at":
    "Encaissé chez {mint}. C’est désormais à toi de façon démontrable : la copie de ce jeton que possède l’expéditeur ne fonctionne plus.",
  "wallet.receive.stored_pending":
    "Stocké depuis {mint}, mais le mint n’a pas encore confirmé qu’il n’était pas dépensé{dleq}. Actualise depuis l’onglet Portefeuille dès que tu es connecté.",
  "wallet.receive.dleq_inline":
    " (sa signature est bien valide, le jeton est donc authentique)",
  "wallet.receive.dleq_ok":
    "La signature du mint est valide, le jeton est donc authentique.",
  "wallet.receive.dleq_uncached":
    "Les clés du mint ne sont pas conservées ici, la signature n’a donc pas pu être vérifiée hors ligne.",
  "wallet.receive.dleq_warning":
    "Tant que tu n’actualises pas en ligne, l’expéditeur pourrait en principe l’avoir dépensé ailleurs.",
  "wallet.receive.failed": "Impossible de recevoir",
  "wallet.receive.title": "Recevoir des ecash",
  "wallet.receive.body":
    "Colle un jeton Cashu. En ligne, il est encaissé auprès du mint tout de suite ; hors ligne, il est stocké et confirmé à la prochaine actualisation.",
  "wallet.receive.scan": "Scanner un code QR ecash",
  "wallet.receive.scan_short": "Scanner un QR",
  "wallet.receive.receiving": "Réception…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap reçu de {from}… et encaissé dans ton portefeuille.",
  "wallet.zap.title": "Envoyer un zap à une identité Nostr",
  "wallet.zap.not_npub": "ce n’est pas un npub",
  "wallet.zap.bad_key": "clé incorrecte",
  "wallet.zap.invalid_pubkey": "Clé publique invalide",
  "wallet.zap.invalid_pubkey_body":
    "Saisis un npub1… ou une clé publique Nostr hexadécimale de 64 caractères.",
  "wallet.zap.sent": "Nutzap envoyé",
  "wallet.zap.failed": "Le zap a échoué",
  "wallet.zap.body":
    "S’ils publient des informations nutzap NIP-61, les ecash sont verrouillés sur leur clé pour que personne d’autre ne puisse les dépenser, et ils ne peuvent plus être repris. Sinon, ils partent comme un jeton récupérable. On te dira ce qui s’est passé.",
  "wallet.zap.contact": "Envoyer un zap à {name}",
  "wallet.zap.pubkey_placeholder": "npub1… ou hexadécimal de 64 caractères",
  "wallet.zap.sending": "Envoi…",
  "wallet.nostr.copied_body":
    "Donne ceci à quelqu’un et il pourra t’envoyer un zap depuis Airhop ou n’importe quel autre portefeuille Nostr, sans Bluetooth.",
  "wallet.nostr.copy_key":
    "Copie ta clé Nostr pour qu’on puisse t’envoyer des zaps",
  "wallet.nostr.your_key": "Ta clé Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint ajouté",
  "wallet.mint.add_failed": "Impossible d’ajouter le mint",
  "wallet.mint.added_named": "{name} ajouté",
  "wallet.mint.added_body":
    "{mint} émet des {units}. Ses clés sont conservées sur cet appareil, ses jetons peuvent donc désormais être vérifiés même sans internet.",
  "wallet.mint.remove_plain":
    "Retirer {mint} de ton portefeuille ? Ses clés conservées partent aussi, ses jetons ne pourront donc plus être vérifiés hors ligne.",
  "wallet.mint.title": "Mints",
  "wallet.mint.none": "Pas encore de mint",
  "wallet.mint.none_desc":
    "Un mint émet et encaisse tes ecash. Ajoutes-en un pour déposer via Lightning, ou reçois simplement un jeton et son mint est ajouté pour toi.",
  "wallet.mint.add": "Ajouter un mint",
  "wallet.mint.add_body":
    "Un mint détient le Bitcoin qui garantit tes ecash, alors choisis-en un à qui tu confierais le solde que tu y laisses. L’URL est vérifiée avant d’être enregistrée. Fais tourner le tien avec Nutshell si tu préfères ne faire confiance à personne.",
  "wallet.mint.consolidate_body":
    "Un jeton ne peut jamais nommer qu’un seul mint, donc un solde réparti sur plusieurs ne peut pas payer un montant plus élevé que ce que détient le plus gros. Airhop peut le déplacer : chaque autre mint paie une facture Lightning émise par celui que tu choisis. Cela coûte de petits frais de routage et demande internet.",
  "wallet.mint.add_short": "Ajouter",
  "wallet.mint.checking": "Vérification…",
  "wallet.mint.remove_with_balance": "Retirer un mint qui a un solde ?",
  "wallet.mint.remove": "Retirer le mint",
  "wallet.mint.delete_anyway": "Supprimer quand même",
  "wallet.mint.consolidate": "Déplacer tous les soldes vers un seul mint",
  "wallet.mint.confirm_with": "Confirmer les preuves auprès de {mint}",
  "wallet.mint.remove_a11y": "Retirer {mint}",
  "wallet.mint.available_amount": "{amount} {unit} disponibles",
  "wallet.mint.split_across":
    "Solde réparti sur {count} mints. Déplace-le vers un seul.",
  "wallet.mint.move_everything_to": "Tout déplacer vers {mint}",
  "wallet.mint.consolidate_title": "Déplacer vers un seul mint",
  "wallet.mint.moving": "Déplacement…",
  "wallet.mint.move": "Déplacer",
  "wallet.mint.moved": "Déplacé",
  "wallet.mint.moved_body":
    "{amount} {unit} se trouvent maintenant chez {mint}, après {fees} {unit} de frais de routage Lightning.",
  "wallet.mint.nothing_moved": "Rien n’a été déplacé",
  "wallet.mint.destination": "· destination",
  "wallet.mint.will_move": "· sera déplacé",
  "wallet.mint.issued_by": "Émis par",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Recharge du portefeuille Airhop",
  "wallet.ln.invoice_failed": "Impossible de créer la facture",
  "wallet.ln.price_failed": "Impossible de chiffrer cette facture",
  "wallet.ln.paid": "Payée",
  "wallet.ln.deposit_credited":
    "Facture payée et {amount} {unit} émis par {mint}. Ce solde est confirmé : tu peux le dépenser hors ligne tout de suite.",
  "wallet.ln.withdrawn":
    "{paid} sats payés via Lightning. Le mint a prélevé {fee} sats de frais de routage.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats payés via Lightning. Le mint a prélevé {fee} sats de frais de routage et a rendu {change} sats de la réserve à ton solde.",
  "wallet.ln.payment_failed": "Le paiement a échoué",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Transforme des sats Lightning en ecash dépensables hors ligne, ou encaisse des ecash vers n’importe quelle facture Lightning. Les deux demandent internet et un mint.",
  "wallet.ln.deposit_body":
    "Le mint te donne une facture. Paie-la depuis n’importe quel portefeuille Lightning et les sats reviennent en ecash dépensables hors ligne.",
  "wallet.ln.pay_invoice_for":
    "Paie cette facture de {amount} {unit}. Le portefeuille guette le paiement et émettra tes ecash automatiquement.",
  "wallet.ln.expired_body":
    "Cette facture a expiré. Si tu l’as déjà payée, le solde est crédité automatiquement.",
  "wallet.ln.waiting_expires":
    "En attente du paiement · expire dans {countdown}",
  "wallet.ln.withdraw_body":
    "Colle une facture bolt11 et le mint la paie avec tes ecash. La réserve de routage t’est annoncée d’abord ; tout ce que le routage n’utilise pas revient à ton solde.",
  "wallet.ln.up_to": "jusqu’à {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Payer {amount} {unit}",
  "wallet.ln.deposit": "Déposer des sats via Lightning",
  "wallet.ln.deposit_short": "Déposer",
  "wallet.ln.withdraw": "Retirer vers une facture Lightning",
  "wallet.ln.withdraw_short": "Retirer",
  "wallet.ln.deposit_title": "Déposer via Lightning",
  "wallet.ln.amount_placeholder": "Montant en sats",
  "wallet.ln.requesting": "Demande…",
  "wallet.ln.get_invoice": "Obtenir une facture",
  "wallet.ln.copy_invoice": "Copier la facture",
  "wallet.ln.open_wallet": "Ouvrir dans un portefeuille Lightning",
  "wallet.ln.open_wallet_short": "Ouvrir dans un portefeuille",
  "wallet.ln.waiting": "En attente du paiement…",
  "wallet.ln.new_invoice": "Créer une nouvelle facture",
  "wallet.ln.new_invoice_short": "Nouvelle facture",
  "wallet.ln.withdraw_title": "Retirer vers Lightning",
  "wallet.ln.scan_invoice": "Scanner le code QR d’une facture Lightning",
  "wallet.ln.paid_from": "Payé depuis",
  "wallet.ln.invoice": "Facture",
  "wallet.ln.routing_reserve": "Réserve de routage",
  "wallet.ln.reserved": "Réservé sur le solde",
  "wallet.ln.paying": "Paiement…",
  "wallet.ln.get_quote": "Obtenir un devis",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Sauvegarde",
  "wallet.backup.setup_failed": "Impossible de configurer la sauvegarde",
  "wallet.backup.on": "Sauvegarde active",
  "wallet.backup.on_body":
    "Ton solde peut désormais être reconstruit à partir de ces douze mots.\n\nTout ce que quelqu’un d’autre t’a donné reste hors de la phrase tant que tu n’actualises pas auprès du mint, et la récupération a besoin de ta liste de mints : note-la à côté des mots.",
  "wallet.backup.no_phrase": "Aucune phrase enregistrée",
  "wallet.backup.no_phrase_body":
    "La phrase de récupération n’a pas pu être lue depuis le trousseau de l’appareil. Déverrouille-le et réessaie.",
  "wallet.backup.replace_title": "Remplacer ta phrase actuelle ?",
  "wallet.backup.replace_body":
    "Tu as déjà une phrase de récupération. En restaurer une autre la remplace. Les pièces déjà couvertes par l’ancienne phrase restent dépensables sur cet appareil, mais elles cessent d’être restaurables : assure-toi que les anciens mots sont notés avant de continuer.",
  "wallet.backup.replace": "Remplacer",
  "wallet.backup.invalid_phrase": "Cette phrase n’est pas valide",
  "wallet.backup.invalid_phrase_body":
    "La phrase possède une somme de contrôle intégrée, et celle-ci ne passe pas. Cherche un mot mal saisi, manquant ou interverti.",
  "wallet.backup.not_bip39":
    "Ce ne sont pas des mots BIP-39 : {words}. Vérifie l’orthographe.",
  "wallet.backup.add_mint_first": "Ajoute d’abord un mint",
  "wallet.backup.add_mint_first_body":
    "La récupération consiste à demander à un mint quelles pièces il a signées pour toi, il faut donc savoir auquel s’adresser. Ajoute les mints que tu utilisais, puis restaure.",
  "wallet.backup.restore_failed": "La restauration a échoué",
  "wallet.backup.phrase": "Phrase de récupération",
  "wallet.backup.state_unconfirmed": "Sauvegarde active mais non confirmée",
  "wallet.backup.state_off": "Sauvegarde désactivée",
  "wallet.backup.badge_on": "Active",
  "wallet.backup.badge_unconfirmed": "Non confirmée",
  "wallet.backup.badge_off": "Désactivée",
  "wallet.backup.view": "Voir la phrase de récupération",
  "wallet.backup.setup": "Configurer une phrase de récupération",
  "wallet.backup.view_short": "Voir la phrase",
  "wallet.backup.setup_short": "Configurer",
  "wallet.backup.restore":
    "Restaurer un portefeuille depuis une phrase de récupération",
  "wallet.backup.restore_short": "Restaurer",
  "wallet.backup.setup_title": "Configurer une phrase de récupération",
  "wallet.backup.on_body_short":
    "Ton solde peut être reconstruit sur un nouvel appareil à partir de tes douze mots.",
  "wallet.backup.unconfirmed_body":
    "Tu n’as jamais confirmé en avoir une copie écrite. Pour l’instant, les mots n’existent que sur ce téléphone, c’est-à-dire précisément ce à quoi une sauvegarde est censée survivre. Regarde la phrase et note-la.",
  "wallet.backup.not_covered":
    "{amount} ne sont pas encore couverts. Les pièces qu’on t’a données portent les secrets de celui qui les a envoyées, elles ne passent donc sous ta phrase qu’une fois échangées. Actualise un mint pour les sécuriser.",
  "wallet.backup.off_body":
    "Tes ecash n’existent que sur ce téléphone. Si tu le perds, personne ne peut récupérer l’argent, toi compris. Une phrase de récupération, ce sont douze mots capables de reconstruire ton solde n’importe où.",
  "wallet.backup.about_to_see":
    "Tu vas voir douze mots. Ce sont eux, l’argent.",
  "wallet.backup.exact_order":
    "Douze mots, exactement dans cet ordre. Quiconque les a, a ton solde.",
  "wallet.backup.verify_body":
    "Une phrase que personne n’a notée est pire que pas de phrase du tout, car elle ressemble à un filet de sécurité qui n’existe pas. Deux mots pour confirmer.",
  "wallet.backup.verify_mismatch":
    "Ça ne correspond pas. Vérifie ta copie écrite.",
  "wallet.backup.restore_body":
    "Saisis les douze mots. Airhop redérive tes pièces et demande à chaque mint lesquelles il a signées, si bien que le solde revient depuis les registres que le mint conserve.",
  "wallet.backup.warn_secret":
    "Quiconque les lit peut prendre ton solde. N’en fais pas de capture d’écran et ne les stocke pas sur ce téléphone.",
  "wallet.backup.warn_paper":
    "Écris-les sur papier et garde-les en lieu sûr. Airhop ne peut pas te les remontrer si le téléphone disparaît.",
  "wallet.backup.warn_scope":
    "Ils ne reconstruisent que tes ecash. Ton identité, tes discussions et tes contacts ne sont pas couverts.",
  "wallet.backup.warn_mints":
    "La récupération doit demander à un mint quelles pièces il a signées : note ta liste de mints à côté des mots.",
  "wallet.backup.preparing": "Préparation…",
  "wallet.backup.show_phrase": "Afficher ma phrase",
  "wallet.backup.your_phrase": "Ta phrase de récupération",
  "wallet.backup.write_down": "Note ces mots",
  "wallet.backup.copy_phrase":
    "Copier la phrase de récupération dans le presse-papiers",
  "wallet.backup.copy_clipboard": "Copier dans le presse-papiers",
  "wallet.backup.written_down": "Je les ai notés",
  "wallet.backup.check_copy": "Vérifie ta copie",
  "wallet.backup.confirm": "Confirmer",
  "wallet.backup.restore_title": "Restaurer depuis une phrase",
  "wallet.backup.phrase_placeholder": "douze mots séparés par des espaces",
  "wallet.backup.no_mints_yet":
    "Aucun mint ajouté pour l’instant. La récupération doit s’adresser à un mint précis : ajoute d’abord ceux que tu utilisais.",
  "wallet.backup.scanning": "Analyse…",
  "wallet.backup.restore_progress": "{mint} · jeu de clés {step} sur {total}",
  "wallet.backup.will_scan":
    "Seront analysés : {mints}. Un mint que tu n’as pas ajouté n’est jamais interrogé, son solde reste donc invisible.",
  "wallet.backup.word_n": "Mot {position}",
  "wallet.backup.unreachable_mints":
    "Impossible de joindre : {mints}. Le solde qui s’y trouve existe toujours. Réessaie avec une meilleure connexion.",
  "wallet.backup.nothing_recovered":
    "Rien n’a été récupéré depuis les mints analysés.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Marquer comme reçu ?",
  "wallet.delivered.body":
    "Cela libère {amount} {unit} définitivement. Si ce n’est en fait jamais arrivé, tu ne pourras pas le récupérer.",
  "wallet.delivered.body_generic":
    "Cela libère définitivement le montant réservé. Si ce n’est en fait jamais arrivé, tu ne pourras pas le récupérer.",
  "wallet.delivered.cancel": "Pas encore",
  "wallet.delivered.confirm": "Ils l’ont reçu",
  "wallet.reclaim.title": "Récupérer ce jeton ?",
  "wallet.reclaim.body":
    "Les {amount} {unit} retournent dans ton solde. Ne fais cela que si le jeton n’a jamais atteint personne : s’ils ont déjà la chaîne, celui qui l’encaisse en premier auprès du mint garde l’argent, et ce pourrait être eux.",
  "wallet.reclaim.keep": "Laisser en attente",
  "wallet.reclaim.confirm": "Récupérer",
  "wallet.copied.token_body":
    "Le jeton est dans ton presse-papiers. Il reste réservé ici tant que tu ne l’as pas marqué comme remis, tu peux donc le recoller si la première tentative échoue.",
  "wallet.copied.phrase_body":
    "Colle-la dans un gestionnaire de mots de passe, puis vide ton presse-papiers. D’autres apps peuvent le lire, et sur certaines configurations il se synchronise avec tes autres appareils.",
  "wallet.refresh.failed": "L’actualisation a échoué",
  "wallet.refresh.partly": "Actualisé en partie",
  "wallet.refresh.done": "Actualisé",
  "wallet.refresh.unreachable":
    "Impossible de joindre {mints}. Tout le reste est à jour.",
  "wallet.refresh.swapped":
    "{amount} {unit} confirmés et échangés contre de nouvelles preuves.",
  "wallet.refresh.secured":
    "{amount} {unit} sont maintenant couverts par ta phrase de récupération.",
  "wallet.refresh.all_confirmed":
    "Tout ce qui se trouve ici était déjà confirmé auprès du mint.",
  "wallet.pending.title": "En attente",
  "wallet.pending.reserved_desc":
    "Construit et réservé, remise non confirmée. Les preuves sont mises de côté hors de ton solde pour ne pas pouvoir être dépensées deux fois.",
  "wallet.pending.locked_desc":
    "Déjà verrouillé sur la clé du destinataire, lui seul peut donc le dépenser. Simplement, il ne lui est pas encore parvenu. Partage le jeton pour terminer.",
  "wallet.pending.show_qr": "Afficher ce jeton sous forme de code QR",
  "wallet.pending.copy_again": "Copier le jeton à nouveau",
  "wallet.pending.share_again": "Partager le jeton à nouveau",
  "wallet.pending.mark_delivered": "Marquer ce jeton comme remis",
  "wallet.pending.delivered": "Remis",
  "wallet.pending.reclaim_into": "Récupérer ce jeton dans ton solde",
  "wallet.activity.title": "Activité",
  "wallet.activity.none": "Rien pour l’instant",
  "wallet.activity.none_desc":
    "Les paiements que tu envoies et reçois apparaissent ici, du plus récent au plus ancien, avec le mint et les frais de chacun.",
  "wallet.activity.show_fewer": "Afficher moins de paiements",
  "wallet.activity.show_less": "Afficher moins",
  "wallet.activity.received_unconfirmed": "Reçu, non confirmé",
  "wallet.activity.received": "Reçu",
  "wallet.activity.receive_failed": "Échec de la réception",
  "wallet.activity.reclaimed": "Récupéré",
  "wallet.activity.send_failed": "Échec de l’envoi",
  "wallet.activity.sent": "Envoyé",
  "wallet.activity.status_pending": "en attente",
  "wallet.activity.status_failed": "échoué",
  "wallet.activity.status_reclaimed": "récupéré",
  "wallet.activity.status_expired": "expiré",
  "wallet.activity.ln_deposit": "Dépôt Lightning",
  "wallet.activity.ln_withdrawal": "Retrait Lightning",
  "wallet.activity.nutzap_received": "Nutzap reçu",
  "wallet.activity.spent_removed": "Preuves dépensées retirées",
  "wallet.activity.refreshed": "Preuves actualisées",
  "wallet.activity.refreshing": "Actualisation des preuves",
  "wallet.activity.just_now": "à l’instant",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Maillage hors ligne",
  "wallet.mesh_offline_body":
    "Le service de maillage ne tourne pas, il n’y a donc personne à qui remettre le jeton. Il reste réservé dans En attente.",
  "wallet.xfer.route_mesh":
    "Remis directement à leur appareil sur le maillage.",
  "wallet.xfer.route_nostr":
    "Ils étaient hors de portée du Bluetooth, c’est donc passé par internet.",
  "wallet.xfer.route_courier":
    "Aucun chemin jusqu’à eux pour l’instant. D’autres appareils le transporteront et le remettront quand l’un d’eux les atteindra.",
  "wallet.xfer.route_queued":
    "Ils ne sont pas encore joignables. C’est en file d’attente et partira dès qu’ils le seront.",
  "wallet.xfer.mesh_offline_body":
    "Le service de maillage ne tourne pas, il n’y a donc aucun moyen de remettre le jeton. Rien n’a été débité.",
  "wallet.xfer.could_not_send": "Impossible d’envoyer",
  "wallet.xfer.inexact_body":
    "Tes preuves ne peuvent pas faire exactement {amount} {unit} hors ligne. Le plus petit jeton que tu peux construire vaut {spend} {unit}, et les {extra} {unit} en trop leur reviennent sans aucun moyen de les reprendre.\n\nActualiser auprès du mint en étant connecté découpe tes preuves en coupures qui donnent le compte exact.",
  "wallet.xfer.send_amount": "Envoyer {amount}",
  "wallet.xfer.mesh_offline": "Maillage hors ligne",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Verrouillé sur leur clé et publié sur Nostr. C’est à eux, qu’ils soient en ligne ou non.",
  "wallet.pay.rail_nutzap_dm":
    "Verrouillé sur leur clé. Le relais ne l’a pas accepté, il leur est donc parvenu sous forme de message.",
  "wallet.pay.rail_nutzap_undelivered":
    "Verrouillé sur leur clé, mais rien n’a encore pu le transporter. C’est en file d’attente, et le jeton se trouve dans En attente.",
  "wallet.pay.final":
    "Les paiements verrouillés ne peuvent pas être récupérés : seule leur clé peut désormais dépenser ces pièces.",
  "wallet.pay.reclaimable":
    "Il reste récupérable depuis l’onglet Portefeuille jusqu’à ce que tu confirmes son arrivée.",
  "wallet.pay.why": "Envoyé ainsi parce que {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} à {name}",
  "wallet.pay.thread_receipt":
    "Tu as envoyé {amount} {unit}, verrouillés sur leur clé.",
  "wallet.pay.title": "Envoyer des ecash",
  "wallet.pay.to": "À {name}",
  "wallet.pay.amount": "Montant en sats",
  "wallet.pay.memo": "Note (facultative, publique)",
  "wallet.pay.send": "Envoyer",
  "wallet.pay.sending": "Envoi…",
  "wallet.pay.action": "Envoyer des ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Accès à la caméra",
  "wallet.scan.camera_purpose": "scanner un code QR ecash",
  "wallet.scan.photo_label": "Accès aux photos",
  "wallet.scan.photo_purpose": "lire un QR ecash depuis une image",
  "wallet.scan.no_token": "Aucun jeton ecash trouvé dans cette image.",
  "wallet.scan.no_invoice":
    "Aucune facture Lightning trouvée dans cette image.",
  "wallet.scan.unreadable": "Impossible de lire cette image.",
  "wallet.scan.camera_failed":
    "Impossible de démarrer la caméra. Ferme les autres apps qui l’utilisent et réessaie.",
  "wallet.scan.close": "Fermer le scanner",
  "wallet.scan.on_device":
    "C’est lu sur cet appareil ; rien n’est envoyé nulle part.",
  "wallet.scan.aim_token": "Vise un code QR ecash.",
  "wallet.scan.aim_invoice": "Vise le code QR d’une facture Lightning.",
  "wallet.scan.title_token": "Scanner des ecash",
  "wallet.scan.title_invoice": "Scanner une facture",
  "wallet.scan.desc_token":
    "Lis un jeton Cashu depuis un autre portefeuille. Fonctionne avec n’importe quel portefeuille Cashu, pas seulement Airhop.",
  "wallet.scan.desc_invoice":
    "Lis une facture Lightning pour la payer avec ton solde.",
  "wallet.scan.use_camera_a11y": "Scanner avec la caméra",
  "wallet.scan.use_camera": "Utiliser la caméra",
  "wallet.scan.pick_image_a11y": "Lire un code QR depuis une image enregistrée",
  "wallet.scan.pick_image": "Choisir dans les photos",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Qu’est-ce que Cashu ?",
  "wallet.explain.intro":
    "Cashu, c’est de l’ecash pour Bitcoin. Un jeton est une chaîne qui vaut de l’argent pour celui qui la détient, signée à l’aveugle par un mint pour que le mint ne puisse pas savoir qui a dépensé quoi. Ni comptes, ni connexions.",
  "wallet.explain.send": "Envoyer",
  "wallet.explain.send_desc":
    "Transforme un montant en un jeton que tu peux remettre à un pair proche par Bluetooth, ou partager sous forme de texte. Fonctionne sans internet. Les preuves restent réservées jusqu’à ce que tu confirmes son arrivée.",
  "wallet.explain.receive": "Recevoir",
  "wallet.explain.receive_desc":
    "Colle un jeton pour l’ajouter. En ligne, il est échangé auprès du mint immédiatement, ce qui le rend tien de façon démontrable. Hors ligne, il est stocké et marqué non confirmé jusqu’à ce que tu actualises.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Paie une identité Nostr. S’ils publient des informations nutzap NIP-61, les ecash sont verrouillés sur leur clé pour qu’eux seuls puissent les dépenser. Sinon, cela retombe sur un message direct chiffré. Nécessite internet.",
  "wallet.explain.add_mint": "Ajouter un mint",
  "wallet.explain.add_mint_desc":
    "Enregistre le mint qui émet et encaisse tes ecash, et conserve ses clés publiques pour que ses jetons puissent être vérifiés hors ligne. Choisis un mint à qui tu confierais le solde que tu y laisses.",
  "wallet.explain.phrase": "Phrase de récupération",
  "wallet.explain.phrase_desc":
    "Tes pièces dérivent de douze mots que le portefeuille génère au départ, si bien qu’un nouveau téléphone peut reconstruire le solde en demandant à tes mints quelles pièces ils ont signées. Tant que tu ne les as pas vus et notés, ils n’existent que sur ce téléphone.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Portefeuille verrouillé",
  "wallet.err.mint_unreachable": "Mint injoignable",
  "wallet.err.tor_blocked": "Bloqué tant que Tor est actif",
  "wallet.err.insufficient": "Solde insuffisant",
  "wallet.err.exact_amount": "Impossible d’envoyer ce montant exact",
  "wallet.err.no_mint": "Aucun mint",
  "wallet.err.mint_unsupported": "Le mint ne peut pas faire cela",
  "wallet.err.mint_refused": "Le mint a refusé",
  "wallet.err.unreadable": "Jeton illisible",
  "wallet.err.rejected": "Jeton rejeté",
  "wallet.err.already_spent": "Déjà dépensé",
  "wallet.err.change_pending": "Payé, monnaie en attente",
  "wallet.svc.mint_unreachable": "Impossible de joindre le mint.",
  "wallet.svc.tor_ios": "Sur iOS, les requêtes au mint ne passent pas par Tor.",
  "wallet.svc.tor_ios_body":
    "Arti n’enveloppe que les WebSockets Nostr, cette requête atteindrait donc le mint sur le réseau en clair et relierait ton IP à ces preuves. Autorise-le dans Réglages > Sécurité, ou désactive Tor d’abord. Envoyer et recevoir des ecash sur le maillage fonctionne toujours.",
  "wallet.svc.keys_uncached":
    "Les clés de ce mint ne sont pas conservées sur cet appareil.",
  "wallet.svc.keys_uncached_body":
    "Ouvre le portefeuille une fois en étant connecté pour les récupérer.",
  "wallet.svc.phrase_invalid": "Cette phrase de récupération n’est pas valide.",
  "wallet.svc.phrase_invalid_body":
    "Cherche un mot mal saisi ou manquant. La phrase possède une somme de contrôle intégrée : un seul mot faux invalide l’ensemble.",
  "wallet.svc.need_mint": "Ajoute d’abord au moins un mint.",
  "wallet.svc.need_mint_body":
    "La récupération consiste à demander à un mint quelles pièces il a signées pour toi, il faut donc savoir auquel s’adresser.",
  "wallet.svc.restored": "Restauré depuis la phrase de récupération",
  "wallet.svc.storage_locked": "Le stockage du portefeuille est verrouillé.",
  "wallet.svc.storage_locked_body":
    "Airhop conserve les preuves ecash dans un fichier chiffré dont la clé se trouve dans le trousseau de l’appareil. Déverrouille-le et rouvre l’app.",
  "wallet.svc.bad_url": "Ce n’est pas une URL valide.",
  "wallet.svc.needs_https": "L’URL d’un mint doit commencer par https://.",
  "wallet.svc.refuse_http":
    "Nous refusons d’utiliser un mint en http non chiffré.",
  "wallet.svc.refuse_http_body":
    "N’importe qui sur le chemin réseau pourrait lire ou modifier tes preuves. Utilise un mint en https://.",
  "wallet.svc.mint_not_saved": "Le mint n’a pas pu être enregistré.",
  "wallet.svc.unreadable_token": "Ce n’est pas un jeton Cashu lisible.",
  "wallet.svc.unreadable_token_body":
    "Les jetons commencent par cashuA ou cashuB. Vérifie que rien n’a été coupé à la copie.",
  "wallet.svc.wrong_mint":
    "Ce jeton n’a pas été signé par le mint qu’il désigne.",
  "wallet.svc.already_spent": "Ces preuves ont déjà été dépensées.",
  "wallet.svc.already_spent_body":
    "Celui qui a envoyé ce jeton l’a encaissé en premier, ou a envoyé le même jeton à quelqu’un d’autre.",
  "wallet.svc.receiving_offline": "réception hors ligne",
  "wallet.svc.amount_positive": "Saisis un montant supérieur à zéro.",
  "wallet.svc.coins_raced":
    "Ces pièces viennent d’être utilisées par un autre paiement.",
  "wallet.svc.coins_raced_body":
    "Rien n’a été débité. Réessaie et le portefeuille choisira un autre lot.",
  "wallet.svc.no_ecash": "Pas encore d’ecash.",
  "wallet.svc.no_ecash_body":
    "Ajoute un mint et dépose via Lightning, ou reçois un jeton de quelqu’un.",
  "wallet.svc.split_across_mints": "Ton solde est réparti sur plusieurs mints.",
  "wallet.svc.mint_says_spent":
    "Le mint a signalé ces preuves comme déjà dépensées.",
  "wallet.svc.issue_against_invoice":
    "émettre des ecash contre une facture Lightning",
  "wallet.svc.pay_invoice": "payer une facture Lightning",
  "wallet.svc.unknown_deposit": "Dépôt inconnu.",
  "wallet.svc.invoice_expired_before":
    "La facture a expiré avant d’être payée.",
  "wallet.svc.invoice_expired": "Cette facture a expiré.",
  "wallet.svc.invoice_unpaid": "La facture n’a pas encore été payée.",
  "wallet.svc.payment_unknown":
    "Statut du paiement inconnu ; vérifié à nouveau à la prochaine actualisation.",
  "wallet.svc.melt_change_pending": "Ta facture a été payée.",
  "wallet.svc.melt_change_pending_body":
    "Le mint n’a pas encore rendu les frais de routage non utilisés. Ils sont réclamés automatiquement à la prochaine actualisation, et rien n’est perdu entre-temps.",
  "wallet.svc.mint_did_not_pay":
    "Le mint n’a pas payé cette facture. Ton solde est inchangé.",
  "wallet.svc.not_an_invoice": "Ce n’est pas une facture Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Colle une facture bolt11 commençant par lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Solde insuffisant pour cette facture.",
  "wallet.svc.coins_raced_invoice_body":
    "Rien n’a été débité et la facture n’a pas été payée. Réessaie.",
  "wallet.svc.same_mint": "Choisis un autre mint de destination.",
  "wallet.svc.same_mint_body":
    "La source et la destination sont le même mint, il n’y a donc rien à déplacer.",
  "wallet.svc.quote_failed_retried": "Devis échoué, consolidation retentée",
  "wallet.svc.amount_unfit_retried":
    "Le montant ne convenait pas, consolidation retentée",
  "wallet.svc.cannot_size": "Impossible de dimensionner ce transfert.",
  "wallet.svc.insufficient_at_mint": "Solde insuffisant chez {mint}.",
  "wallet.svc.inexact_title":
    "Tes preuves ne peuvent pas faire exactement {amount} {unit} hors ligne.",
  "wallet.svc.inexact_detail":
    "Le plus petit jeton que tu peux envoyer vaut {spend} {unit}. Hors ligne il n’y a pas de monnaie rendue, les {extra} {unit} en trop vont donc au destinataire.",
  "wallet.svc.no_single_mint":
    "Aucun mint ne détient à lui seul {amount} {unit}. Les ecash de mints différents ne peuvent pas être réunis en un seul jeton : consolide d’abord chez un mint, ou envoie en montants séparés.",
  "wallet.svc.have_tried_send":
    "Tu as {total} {unit} et tu as essayé d’envoyer {amount}.",
  "wallet.svc.invoice_needs":
    "Cette facture demande {total} {unit} réserve de routage comprise, et tu as {balance}.",
  "wallet.svc.nothing_to_move": "{mint} n’a pas de {unit} à déplacer.",
  "wallet.svc.consolidate_memo": "Consolidation depuis {mint}",
  "wallet.svc.cannot_size_detail":
    "Après les frais de routage Lightning, {from} ne peut pas déplacer un montant utile vers {to}. Essaie plutôt de déplacer un montant précis plus petit.",
  "wallet.svc.mint_cannot": "{mint} ne peut pas {action}.",
  "wallet.svc.no_nut": "Le mint n’annonce pas NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Ce paiement désigne un mint que tu n’utilises pas.",
  "wallet.svc.unknown_mint_body":
    "Ajoute-le toi-même si tu lui fais confiance ; rien n’est encaissé auprès d’un mint que tu n’as pas choisi.",
  "wallet.svc.no_relay": "aucune connexion à un relais",
  "wallet.svc.no_shared_mint": "aucun mint commun avec un solde suffisant",
  "wallet.svc.no_nutzap_info":
    "le destinataire n’a pas publié d’informations nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Verrouillé sur leur clé mais pas encore remis. Partage le jeton de cette transaction pour l’achever.",
  "wallet.svc.swap_lost":
    "Le mint n’a jamais achevé cet échange, rien n’a donc été émis en contrepartie.",
  "wallet.svc.swap_unreadable":
    "Cet échange a été enregistré dans un format que cette version ne peut pas rejouer.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Vérifié par QR",
  "contacts.qr.keys_unverified": "Clés reçues, non vérifiées",
  "contacts.qr.not_verified": "Pas encore vérifié",
  "contacts.qr.message": "Message",
  "contacts.qr.add": "Ajouter un contact",
  "contacts.qr.scan_title": "Scanner un code QR",
  "contacts.qr.aim": "Vise leur code QR avec ta caméra",
  "contacts.qr.add_desc":
    "Joins quelqu’un qui n’est pas à proximité sur le maillage.",
  "contacts.qr.peer_id_hint":
    "Un identifiant de pair fait 16 caractères. Un code de contact commence par airhop:.",
  "contacts.qr.or_scan": "ou scanne leur QR",
  "contacts.qr.trust_note":
    "Seul un QR que tu scannes avec ta caméra vérifie leur clé. Un code collé apporte leurs clés, mais pas la preuve qu’il vient d’eux.",
  "contacts.qr.peer_id": "Identifiant de pair ou code de contact",
  "contacts.qr.peer_id_placeholder":
    "Colle un identifiant ou un code de contact",
  "contacts.qr.scan_camera_a11y": "Scanner le code QR avec la caméra",
  "contacts.qr.scan_camera_desc": "Utilise ta caméra",
  "contacts.qr.upload_a11y": "Importer une image QR depuis la galerie",
  "contacts.qr.upload": "Importer depuis la galerie",
  "contacts.qr.upload_desc": "Choisis une image QR enregistrée",
  "contacts.qr.scan_a11y": "Ajouter un contact en scannant un code QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Colle un identifiant de pair de 16 caractères, un lien airhop://peer/… ou un code de contact.",
  "contacts.scan.camera_label": "Accès à la caméra",
  "contacts.scan.camera_purpose": "scanner le code QR d’un contact",
  "contacts.scan.camera_needed":
    "L’accès à la caméra est nécessaire pour scanner. Tu peux toujours ajouter par identifiant de pair.",
  "contacts.scan.camera_failed":
    "Impossible de démarrer la caméra. Ferme les autres apps qui l’utilisent et réessaie.",
  "contacts.scan.photo_label": "Accès aux photos",
  "contacts.scan.photo_purpose": "scanner un code QR que tu as enregistré",
  "contacts.scan.photo_needed":
    "L’accès aux photos est nécessaire pour choisir une image. Tu peux toujours ajouter par identifiant de pair.",
  "contacts.scan.no_qr": "Aucun code QR Airhop trouvé dans cette image.",
  "contacts.scan.unreadable": "Impossible de lire un code QR dans cette image.",
  "contacts.scan.bitchat_expired":
    "Ce code bitchat a expiré. Demande-leur de rouvrir leur QR.",
  "contacts.scan.tampered":
    "Ce code QR n’est pas valide : son identifiant de pair ne correspond pas à ses clés. Il a peut-être été altéré.",
  "contacts.scan.already_added": "Déjà dans tes contacts",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "En attente de l’accès à la caméra…",
  "contacts.verify.camera_off": "La caméra est désactivée",
  "contacts.verify.open_settings": "Ouvrir les réglages",
  "contacts.verify.verified": "Vérifié",
  "contacts.verify.different": "Contact différent",
  "contacts.verify.scan_again": "Scanner à nouveau",
  "contacts.verify.failed": "Impossible de vérifier",
  "contacts.verify.done": "Terminé",
  "contacts.verify.title": "Vérifier {name}",
  "contacts.verify.aim": "Vise leur code QR avec ta caméra",
  "contacts.verify.camera_off_body":
    "Active l’accès à la caméra dans les réglages pour vérifier par QR.",
  "contacts.verify.match_body":
    "La clé de {name} correspond. Tu peux faire confiance à ce contact.",
  "contacts.verify.different_body":
    "Ce QR appartient à quelqu’un d’autre. Demande à {name} de montrer son propre code.",
  "contacts.verify.tampered_body":
    "Ce QR semble altéré : son identifiant ne correspond pas à sa clé.",
  "contacts.verify.choose_title": "Comment veux-tu vérifier ?",
  "contacts.verify.choose_body":
    "Les deux méthodes confirment que les clés sur ce téléphone appartiennent bien à {name}.",
  "contacts.verify.method_scan": "Scanner leur code",
  "contacts.verify.method_scan_sub": "Ils sont là avec toi",
  "contacts.verify.method_compare": "Comparer un code",
  "contacts.verify.method_compare_sub":
    "Lisez-le à voix haute pendant un appel",
  "contacts.verify.no_keys":
    "Pas encore de clés pour ce contact. Écris-leur, ou scanne leur code quand vous vous verrez.",
  "contacts.verify.compare_title": "Lisez ceci à voix haute",
  "contacts.verify.compare_body":
    "{name} voit les mêmes six mots. S’ils correspondent, vous savez tous les deux que les clés sont authentiques.",
  "contacts.verify.codes_match": "Ils correspondent",
  "contacts.verify.codes_differ": "Ils ne correspondent pas",
  "contacts.verify.compared_body":
    "{name} et toi avez confirmé le même code. Ce contact est vérifié.",

  // ---- Settings: shared chrome ----
  "settings.back": "Revenir en arrière",
  "settings.coming_soon": "Bientôt disponible",
  "settings.opens_externally": "{label}, s’ouvre hors de l’app",
  "settings.peer_id": "Identifiant de pair",
  "settings.share_peer_id": "Partage ton identifiant de pair",
  "settings.share_id_short": "Partager l’identifiant",
  "settings.peer_id_sheet.title": "Ton identifiant de pair",
  "settings.peer_id_sheet.copy": "Copier l’identifiant de pair",
  "settings.peer_id_sheet.note":
    "Cela ne fonctionne que si vous êtes tous les deux à portée du Bluetooth. Pour qu’on puisse t’écrire de n’importe où, partage plutôt ton code QR.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Général",
  "settings.section.general_desc":
    "Fonctions optionnelles, annulation d’envoi, médias, réinitialisation",
  "settings.section.privacy": "Confidentialité et sécurité",
  "settings.section.privacy_desc":
    "Confidentialité persistante, paquets signés, pairs bloqués",
  "settings.section.network": "Réseau et relais",
  "settings.section.network_desc":
    "Repli par internet, relais nostr, compatibilité bitchat",
  "settings.section.permissions": "Autorisations",
  "settings.section.permissions_desc":
    "Bluetooth, localisation, notifications, caméra, micro",
  "settings.section.storage": "Stockage et données",
  "settings.section.diagnostics": "Diagnostics",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transports",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "À proximité",
  "settings.group.sync": "Synchronisation",
  "settings.group.features": "Fonctions",
  "settings.group.messages": "Messages",
  "settings.group.local": "Local",
  "settings.group.media": "Médias",
  "settings.group.reset": "Réinitialisation",
  "settings.group.always_on": "Toujours actif",
  "settings.group.notifications": "Notifications",
  "settings.group.blocked": "Bloqués",
  "settings.group.theme": "Thème",
  "settings.group.font": "Police",
  "settings.group.language": "Langue",
  "settings.section.diagnostics_desc":
    "État de la connexion et appareils proches",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Liaisons Bluetooth",
  "settings.diag.ble_links_desc":
    "Appareils auxquels ce téléphone est connecté directement",
  "settings.diag.lan": "Réseau local",
  "settings.diag.lan_desc": "Téléphones sur un même réseau Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "De téléphone à téléphone sans routeur",
  "settings.diag.wifi_active": "En marche",
  "settings.diag.wifi_unsupported": "Non pris en charge sur cet appareil",
  "settings.diag.wifi_permission": "Bloqué par une autorisation",
  "settings.diag.wifi_unavailable": "Indisponible pour le moment",
  "settings.diag.wifi_unpaired": "Rien de jumelé",
  "settings.diag.wifi_unknown": "En attente de la radio",
  "settings.diag.relays": "Relais Nostr",
  "settings.diag.relays_desc":
    "Utilisés pour les canaux de localisation et la portée par internet",
  "settings.diag.connected": "Connecté",
  "settings.diag.disconnected": "Non connecté",
  "settings.diag.peer_direct": "Liaison directe",
  "settings.diag.peer_relayed": "Entendu via un autre appareil",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Aucune mesure de signal",
  "settings.diag.no_peers": "Personne à portée",
  "settings.diag.no_peers_desc": "{links} liaisons radio ouvertes",
  "settings.diag.gcs_size": "Taille du filtre",
  "settings.diag.gcs_size_desc": "Le plus grand filtre de synchronisation émis",
  "settings.diag.fpr": "Taux de faux positifs",
  "settings.diag.fpr_desc":
    "À quelle fréquence le filtre annonce un paquet que nous n’avons pas",
  "settings.diag.bytes": "{n} octets",
  "settings.diag.footnote":
    "Rien ne se change ici. Ces valeurs sont fixes pour qu’Airhop reste compatible avec bitchat.",
  "settings.section.storage_desc": "Utilisation et cache",
  "settings.section.appearance": "Apparence",
  "settings.section.appearance_desc": "Thème, police et langue",
  "settings.section.help": "Aide et retours",
  "settings.section.help_desc": "Écris-nous, signale un bug ou lis la FAQ",
  "settings.section.support": "Soutien",
  "settings.section.support_desc": "Aide à garder le développement actif",
  "settings.section.about": "À propos",
  "settings.section.about_desc":
    "Version, journal des modifications et code source",

  // ---- Settings: general ----
  "settings.general.undo": "Annuler l’envoi",
  "settings.general.feature_ai": "IA",
  "settings.general.feature_wallet": "Portefeuille",
  "settings.general.undo_seconds": "{count} secondes",
  "settings.general.undo_a11y": "Annuler l’envoi : {value}",
  "settings.general.quality_a11y": "Régler la qualité d’envoi sur {value}",
  "settings.general.undo_desc":
    "Retient un instant le message envoyé pour que tu puisses le reprendre avant qu’il ne parte",
  "settings.general.undo_off_desc":
    "Envoyer tout de suite, sans possibilité d’annuler",
  "settings.general.undo_2": "2 secondes",
  "settings.general.undo_2_desc": "Un court instant pour le reprendre",
  "settings.general.undo_10": "10 secondes",
  "settings.general.undo_10_desc": "Le délai le plus long",
  "settings.general.quality": "Qualité d’envoi",
  "settings.general.quality_desc":
    "S’applique aux photos envoyées depuis la caméra ou la galerie. Dans tous les cas, chaque photo est adaptée au maillage.",
  "settings.general.quality_low": "Basse",
  "settings.general.quality_low_desc":
    "Photos les plus légères, envoi le plus rapide",
  "settings.general.quality_medium": "Moyenne",
  "settings.general.quality_medium_desc": "Équilibre entre détail et rapidité",
  "settings.general.quality_high": "Haute",
  "settings.general.quality_high_desc": "Conserve le plus de détail",
  "settings.general.feature_wallet_desc":
    "Envoie des ecash Cashu de pair à pair sur le maillage",
  "settings.general.feature_wallet_a11y": "Portefeuille (toujours actif)",
  "settings.general.feature_ai_desc":
    "Assistant privé sur l’appareil, sans aucun appel réseau",
  "settings.general.feature_feeds": "Flux",
  "settings.general.feature_feeds_desc":
    "Lis et publie sur les flux Bluesky et Mastodon",
  "settings.general.show_media": "Afficher les médias automatiquement",
  "settings.general.show_media_desc":
    "Les photos et les vidéos apparaissent dans la discussion, ou restent derrière un appui",
  "settings.general.reset": "Réinitialiser les réglages",
  "settings.general.media_retention": "Conserver les médias pendant",
  "settings.general.media_retention_desc":
    "Les photos, les vidéos et les notes vocales sont supprimées après la durée choisie",
  "settings.general.media_retention_sheet":
    "Choisis combien de temps les médias restent sur cet appareil. Les médias supprimés ne peuvent pas être récupérés.",
  "settings.general.retention_7_desc":
    "Laisse le moins de traces. C’est le meilleur choix si le risque, c’est le téléphone lui-même.",
  "settings.general.retention_14_desc":
    "Un entre-deux pour une ou deux semaines loin du réseau.",
  "settings.general.retention_30_desc":
    "Garde les conversations lisibles le plus longtemps, et occupe le plus d’espace.",
  "settings.general.reset_desc":
    "Remet chaque préférence à sa valeur par défaut, sans toucher à ton identité, tes messages, tes contacts ni ton portefeuille",
  "settings.general.reset_title": "Réinitialiser les réglages ?",
  "settings.general.reset_body":
    "Chaque préférence revient à sa valeur par défaut : apparence, annulation d’envoi et connectivité (internet, Tor, passerelle, pont, relais). Ton identité, tes messages, tes contacts et ton portefeuille ne sont pas touchés.",
  "settings.general.reset_confirm": "Réinitialiser",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Confidentialité persistante",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet est toujours actif pour les messages directs",
  "settings.security.signed_packets": "Paquets signés",
  "settings.security.signed_packets_desc":
    "Chaque paquet est signé avec Ed25519",
  "settings.security.hide_previews": "Masquer les aperçus des notifications",
  "settings.security.hide_previews_desc":
    "Garde l’expéditeur et le message hors de l’écran de verrouillage, qui les affiche sans déverrouiller",
  "settings.security.no_blocked": "Aucun pair bloqué",
  "settings.security.no_blocked_desc":
    "Les pairs bloqués ne peuvent pas t’écrire et n’apparaissent pas dans l’onglet Maillage",
  "settings.security.unblock_title": "Débloquer ce pair",
  "settings.security.unblock": "Débloquer",
  "settings.security.unblock_peer": "Débloquer {name}",
  "settings.security.unblock_body":
    "{name} pourra t’écrire à nouveau et réapparaîtra dans l’onglet Maillage quand il sera à proximité.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Repli par internet",
  "settings.network.internet_desc":
    "Poursuivre par les relais Nostr quand les pairs du maillage sont hors de portée",
  "settings.network.internet_off_title": "Désactiver internet ?",
  "settings.network.internet_off_body":
    "Airhop fonctionnera uniquement en Bluetooth. Il cessera de contacter tout relais Nostr, et Tor, la passerelle internet et le pont maillé s’éteindront tous. La discussion Bluetooth à proximité continue de fonctionner.",
  "settings.network.turn_off": "Désactiver",
  "settings.network.discovery": "Découverte géographique des relais",
  "settings.network.discovery_desc":
    "Sélectionne automatiquement les relais les plus proches d’une cellule de localisation parmi plus de 300 relais répartis",
  "settings.network.discovery_needs_relay":
    "Ajoute d’abord un relais personnalisé",
  "settings.network.discovery_needs_relay_body":
    "C’est la découverte automatique qui oriente Airhop vers les relais les plus proches. La désactiver n’a de sens qu’une fois tes propres relais fixés ci-dessous, alors ajoutes-en au moins un.",
  "settings.network.custom_only_title": "N’utiliser que tes relais ?",
  "settings.network.custom_only_body":
    "Les canaux de localisation et le pont maillé cesseront de choisir automatiquement les relais les plus proches et n’utiliseront que ceux que tu as ajoutés. Cela peut réduire la portée, et tu risques de ne plus croiser les utilisateurs de bitchat, qui se regroupent sur les relais les plus proches.",
  "settings.network.custom": "Relais personnalisés",
  "settings.network.custom_desc":
    "Ajoute tes propres relais pour les canaux de localisation et le pont maillé",
  "settings.network.custom_added": "{count} sur {max} ajoutés",
  "settings.network.dm_relays": "Relais de messages",
  "settings.network.dm_relays_desc":
    "Les messages directs et les canaux privés utilisent toujours ceux-ci. Les relais personnalisés ne les changent pas.",
  "settings.network.discovery_back_on": "Découverte géographique réactivée",
  "settings.network.discovery_back_on_body":
    "C’était ton dernier relais personnalisé. Les canaux de localisation ont besoin d’un endroit où publier, alors Airhop sélectionne de nouveau automatiquement les relais les plus proches.",
  "settings.network.add_relay": "Ajouter un relais",
  "settings.network.remove_relay": "Retirer {url}",
  "settings.network.add_short": "Ajouter",
  "settings.network.relay_limit":
    "Tu peux ajouter {count} relais. Retires-en un pour en ajouter un autre.",
  "settings.network.relay_duplicate": "Ce relais est déjà dans ta liste.",
  "settings.network.relay_invalid":
    "Saisis un hôte de relais valide, par exemple relay.example.com. Le port n’est nécessaire que si le relais n’utilise pas celui par défaut. Les adresses IP et les noms locaux ne sont pas acceptés.",
  "settings.network.lan": "Réseau local",
  "settings.network.lan_desc":
    "Joignez les personnes sur le même WiFi, y compris entre iPhone et Android. Les autres appareils du réseau peuvent voir que vous utilisez Airhop.",
  "settings.network.lan_searching": "Aucun appareil Airhop sur ce réseau",
  "settings.network.lan_active": "Connecté sur ce réseau",
  "settings.network.lan_unavailable": "Pas sur un réseau WiFi",
  "settings.network.lan_permission":
    "L’accès au réseau local est désactivé pour Airhop",
  "settings.network.lan_unsupported": "Non disponible sur cet appareil",
  "settings.network.lan_foreground":
    "S’interrompt quand Airhop passe en arrière-plan. Le Bluetooth continue.",
  "settings.network.wifi_pair": "Jumelage",
  "settings.network.wifi_paired": "Appareils jumelés",
  "settings.network.wifi_pair_find": "Trouver un appareil",
  "settings.network.wifi_pair_find_desc":
    "Chercher un iPhone à proximité qui se montre. Les deux ont besoin d’iOS 26 ou version ultérieure.",
  "settings.network.wifi_pair_show": "Montrer cet iPhone",
  "settings.network.wifi_pair_show_desc":
    "Laissez un iPhone à proximité trouver celui-ci. L’un cherche, l’autre se montre, en même temps.",
  "settings.network.wifi_pair_find_action": "Choisir un iPhone à proximité",
  "settings.network.wifi_pair_show_action": "Rendre cet iPhone détectable",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware n’est pas disponible pour le moment",
  "settings.network.wifi_pair_forget":
    "Supprimez un jumelage dans l’app Settings",
  "settings.network.bitchat": "Compatibilité bitchat",
  "settings.network.bitchat_desc":
    "Le même maillage BLE que bitchat, pleinement interopérable. C’est toujours actif et impossible à désactiver.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Exécuter en arrière-plan",
  "settings.conn.background_desc":
    "Garde le maillage en marche quand Airhop est fermé",
  "settings.conn.background_on_title": "Garder le maillage en marche ?",
  "settings.conn.background_on_body":
    "Airhop continue de relayer et de recevoir une fois fermé, donc les messages arrivent pendant ton absence. Android affiche une notification permanente pendant ce temps.",
  "settings.conn.background_off_title":
    "Arrêter le maillage à la fermeture d’Airhop ?",
  "settings.conn.background_off_body":
    "Les messages n’arriveront que quand Airhop est ouvert, et ce téléphone cessera de relayer pour les gens à proximité. La notification permanente disparaît.",
  "settings.conn.live_voice": "Voix en direct",
  "settings.conn.live_voice_desc":
    "Parle aux gens à proximité comme avec un talkie-walkie",
  "settings.conn.live_voice_on_title": "Activer la voix en direct ?",
  "settings.conn.live_voice_on_body":
    "En maintenant le micro, ta voix part vers tous ceux qui sont à portée du Bluetooth pendant que tu parles, et la leur sort de ton téléphone. Rien n’est enregistré.",
  "settings.conn.live_voice_off_title": "Désactiver la voix en direct ?",
  "settings.conn.live_voice_off_body":
    "Maintenir le micro enregistrera plutôt une note vocale. Elle part quand tu relâches, et personne ne l’entend tant qu’il ne la lance pas.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Routage par Tor",
  "settings.conn.tor_desc":
    "Fais passer le trafic Nostr par Tor pour plus de confidentialité",
  "settings.conn.tor_on_title": "Faire passer le trafic Nostr par Tor ?",
  "settings.conn.tor_on_body":
    "Les relais cesseront de voir ton adresse IP. La connexion prend plus de temps et les messages arrivent plus lentement. Le Bluetooth n’est pas concerné.",
  "settings.conn.tor_off_title": "Désactiver le routage par Tor ?",
  "settings.conn.tor_off_body":
    "Le trafic Nostr repasse par ta connexion habituelle, donc les relais reverront ton adresse IP. Dans les deux cas, le Bluetooth n’est pas concerné.",
  "settings.conn.tor_unavailable":
    "Le routage par Tor n’est pas disponible dans cette version.",
  "settings.conn.tor_timeout":
    "Tor met plus d’une minute à se connecter. Il reste actif et continue d’essayer ; l’onglet Maillage indiquera quand il route, ou si ce réseau le bloque.",
  "settings.conn.tor_failed":
    "Impossible de démarrer Tor. Vérifie que l’app a accès au réseau.",
  "settings.tor.connection": "Connexion",
  "settings.tor.mode_off": "Directe",
  "settings.tor.mode_off_desc":
    "Se connecte directement à Tor. Le plus rapide, mais quiconque observe ce réseau voit que vous utilisez Tor.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Masque que vous utilisez Tor et fonctionne là où les ponts sont bloqués. Le plus lent à se connecter.",
  "settings.tor.mode_obfs4": "Pont",
  "settings.tor.mode_obfs4_desc":
    "Masque que vous utilisez Tor. Plus rapide que Snowflake, mais ces ponts sont publics et certains réseaux les bloquent.",
  "settings.tor.mode_custom": "Ponts personnalisés",
  "settings.tor.mode_custom_desc":
    "Utilisez des ponts obtenus sur bridges.torproject.org. À essayer quand les autres échouent.",
  "settings.tor.custom_placeholder": "Collez une ligne de pont par ligne",
  "settings.tor.custom_empty": "Ajoutez d’abord au moins une ligne de pont.",
  "settings.conn.mint_clearnet":
    "Autoriser le trafic vers le mint sur le réseau en clair",
  "settings.conn.mint_clearnet_desc":
    "Sur iOS, Tor ne couvre que Nostr. Laisse ceci désactivé pour bloquer les requêtes au mint ; dans tous les cas, l’ecash sur le maillage continue de fonctionner.",
  "settings.conn.gateway": "Passerelle internet",
  "settings.conn.gateway_desc":
    "Prête ta connexion à un téléphone proche sans réseau pour qu’il puisse quand même atteindre les canaux de localisation",
  "settings.conn.gateway_on_title": "Activer la passerelle internet ?",
  "settings.conn.gateway_on_body":
    "Les téléphones proches sans connexion propre enverront et recevront les messages des canaux de localisation via la tienne. Cela consomme tes données mobiles et ta batterie, et leurs messages restent chiffrés de bout en bout : tu ne peux pas lire ce qui passe.",
  "settings.conn.gateway_off_title": "Désactiver la passerelle internet ?",
  "settings.conn.gateway_off_body":
    "Les téléphones proches sans réseau cesseront d’atteindre les canaux de localisation via la tienne. Tes propres messages ne sont pas concernés.",
  "settings.conn.bridge": "Pont maillé",
  "settings.conn.bridge_desc":
    "Relie la discussion publique #bluetooth de cette zone à un autre groupe Bluetooth hors de portée, par internet",
  "settings.conn.bridge_on_title": "Activer le pont maillé ?",
  "settings.conn.bridge_on_body":
    "Tes messages publics sur #bluetooth seront publiés dans ton quartier par internet, pour que des gens hors de portée du Bluetooth puissent les lire. Les messages privés ne passent jamais par le pont, et « à proximité seulement » garde un message donné en local.",
  "settings.conn.bridge_off_title": "Désactiver le pont maillé ?",
  "settings.conn.bridge_off_body":
    "Tes messages publics sur #bluetooth restent de nouveau à portée du Bluetooth, et ceux du groupe relié cessent d’arriver ici.",
  "settings.conn.bridge_needs_location":
    "Le pont maillé a besoin de la localisation",
  "settings.conn.bridge_needs_location_desc":
    "Il trouve ton quartier à partir d’un relevé de position. Accorde la localisation pour commencer à relier.",
  "settings.conn.grant_location": "Accorder l’autorisation de localisation",
  "settings.conn.grant_short": "Accorder",
  "settings.conn.internet_off": "Internet est désactivé",
  "settings.conn.internet_off_desc":
    "Tor, le pont et la passerelle utilisent tous internet. Active le repli par internet sous Réseau pour t’en servir.",
  "settings.conn.turn_on": "Activer",
  "settings.conn.turn_off": "Désactiver",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Trouve les appareils proches et relaie les messages entre eux. Sans lui, le maillage ne peut pas fonctionner.",
  "settings.permissions.location": "Localisation",
  "settings.permissions.location_desc":
    "Ouvre les canaux des zones proches. Sans elle, ces canaux restent fermés et le maillage Bluetooth continue normalement.",
  "settings.permissions.notifications": "Notifications",
  "settings.permissions.notifications_desc":
    "Reçois des alertes pour les nouveaux messages même quand l’app est fermée. Sans elles, tu ne les vois qu’en ouvrant Airhop.",
  "settings.permissions.camera": "Caméra",
  "settings.permissions.camera_desc":
    "Scanne des codes QR et prends des photos ou des vidéos à envoyer. Sans elle, tu peux toujours partager des médias depuis la galerie.",
  "settings.permissions.photos": "Photos",
  "settings.permissions.photos_desc":
    "Envoie des photos depuis la galerie et enregistre les médias reçus. Sans elles, tu peux toujours prendre et envoyer de nouvelles photos avec la caméra.",
  "settings.permissions.microphone": "Microphone",
  "settings.permissions.microphone_desc":
    "Enregistre et envoie des messages vocaux ou utilise la voix en direct. Sans lui, les messages vocaux et la voix en direct ne fonctionneront pas.",
  "settings.permissions.allow": "Accorder cette autorisation",
  "settings.permissions.open_settings":
    "Ouvrir les réglages système pour modifier cette autorisation",
  "settings.permissions.system": "Système",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Utilisation du réseau",
  "settings.storage.storage_usage": "Utilisation du stockage",
  "settings.storage.storage_usage_desc":
    "Messages, preuves du portefeuille et pièces jointes en cache",
  "settings.storage.session_usage":
    "Cette session · {sent} envoyés, {received} reçus",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} de pièces jointes",
  "settings.storage.clear_cache": "Vider le cache des pièces jointes",
  "settings.storage.clear": "Vider",
  "settings.storage.clear_title": "Vider les médias en cache ?",
  "settings.storage.clear_body":
    "Les photos, les vidéos, les notes vocales et les fichiers sont retirés de cet appareil, aussi bien envoyés que reçus. Ils ne peuvent pas être retéléchargés : leurs bulles l’indiqueront, et tu peux demander à l’expéditeur de les renvoyer. Les messages et le portefeuille ne sont pas touchés.",
  "settings.storage.cleared": "Cache vidé",
  "settings.storage.freed": "{size} libérés.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Régler l’apparence sur {value}",
  "settings.font.set_a11y": "Régler la police à chasse fixe sur {value}",
  "settings.font.system": "Système",
  "settings.font.system_desc":
    "Utilise la police à chasse fixe par défaut de ton appareil",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Moderne et facile à lire",
  "settings.language.en": "Anglais",
  "settings.language.am": "Amharique",
  "settings.language.ar": "Arabe",
  "settings.language.bn": "Bengali",
  "settings.language.my": "Birman",
  "settings.language.zh_hans": "Chinois (simplifié)",
  "settings.language.zh_hant": "Chinois (traditionnel)",
  "settings.language.nl": "Néerlandais",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "Français",
  "settings.language.ka": "Géorgien",
  "settings.language.de": "Allemand",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonésien",
  "settings.language.it": "Italien",
  "settings.language.ja": "Japonais",
  "settings.language.ko": "Coréen",
  "settings.language.mg": "Malgache",
  "settings.language.ms": "Malais",
  "settings.language.ne": "Népalais",
  "settings.language.fa": "Persan",
  "settings.language.pl": "Polonais",
  "settings.language.pt_br": "Portugais (Brésil)",
  "settings.language.pt_pt": "Portugais (Portugal)",
  "settings.language.pa": "Pendjabi",
  "settings.language.ru": "Russe",
  "settings.language.es": "Espagnol",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Suédois",
  "settings.language.ta": "Tamoul",
  "settings.language.th": "Thaï",
  "settings.language.tr": "Turc",
  "settings.language.uk": "Ukrainien",
  "settings.language.ur": "Ourdou",
  "settings.language.vi": "Vietnamien",
  "settings.language.pseudo": "Pseudo-langue",
  "settings.language.soon": "Bientôt disponible",
  "settings.language.soon_a11y": "{value}, bientôt disponible",
  "settings.language.set_a11y": "Régler la langue sur {value}",
  "settings.language.pending": "À la prochaine ouverture",
  "settings.language.pending_a11y":
    "{value}, s’applique à la prochaine ouverture d’Airhop",
  "settings.language.rtl_restart": "Rouvrir maintenant",
  "settings.language.rtl_title": "Rouvre Airhop pour terminer",
  "settings.language.rtl_body":
    "{value} se lit de droite à gauche, et Airhop ne peut changer de sens qu’au démarrage. Ferme-le et rouvre-le pour terminer le changement. Rien n’est perdu, et d’ici là ton maillage reste connecté.",
  "settings.theme.light": "Clair",
  "settings.theme.light_desc": "Toujours utiliser la palette claire",
  "settings.theme.dark": "Sombre",
  "settings.theme.dark_desc": "Toujours utiliser la palette sombre",

  // ---- Settings: profile and identity ----
  "settings.status.online": "En ligne",
  "settings.status.online_desc": "Visible, en annonce et en balayage",
  "settings.status.away": "Absent",
  "settings.status.away_desc": "Maillage en pause, ni balayage ni annonce",
  "settings.status.invisible": "Invisible",
  "settings.status.invisible_desc": "En balayage, mais masqué à la découverte",
  "settings.status.title": "Statut",
  "settings.status.set_a11y": "Régler le statut sur {value}",
  "settings.status.edit": "Modifier le statut",
  "settings.status.desc": "Choisis à quel point tu es visible sur le maillage.",
  "settings.transfer.identity": "Identité et clés",
  "settings.transfer.identity_desc":
    "Ton identifiant de pair, ton nom d’utilisateur et tes contacts",
  "settings.transfer.chats": "Discussions et historique",
  "settings.transfer.chats_desc":
    "Conversations, groupes et canaux que tu as rejoints",
  "settings.transfer.wallet": "Solde du portefeuille",
  "settings.transfer.wallet_desc":
    "Preuves Cashu et historique des transactions",
  "settings.transfer.title": "Passer à un nouveau téléphone",
  "settings.transfer.desc":
    "Déplace ton identité, tes discussions et ton portefeuille vers un autre appareil",
  "settings.transfer.coming_soon_a11y":
    "Passer à un nouveau téléphone, bientôt disponible",
  "settings.transfer.body":
    "Mets les deux téléphones côte à côte et transfère tout en Bluetooth. Rien ne passe par un serveur, donc ça marche sans internet.",
  "settings.qr.permission_label": "Accès aux photos",
  "settings.qr.permission_purpose": "enregistrer ton code QR",
  "settings.qr.saved": "Enregistré",
  "settings.qr.saved_body": "Code QR enregistré dans ta galerie photo.",
  "settings.qr.save_failed": "Impossible d’enregistrer",
  "settings.qr.save_failed_body":
    "Le code QR n’a pas pu être enregistré. Réessaie.",
  "settings.qr.share_message": "Ajoute-moi sur Airhop",
  "settings.qr.share_body":
    "Ajoute-moi sur Airhop — messagerie maillée privée, pensée d’abord pour le hors-ligne.",
  "settings.qr.show_short": "Voir le QR",
  "settings.qr.title": "Ton code QR",
  "settings.qr.note":
    "Il contient tes clés publiques, qui permettent aux autres de t’écrire de n’importe où. Ne le partage qu’avec des gens de confiance. Il ne changera pas tant que tu n’effaces pas ton identité.",
  "settings.qr.code_label": "Code de contact",
  "settings.qr.copy_code": "Copier le code de contact",
  "settings.qr.share": "Partager le code QR",
  "settings.qr.share_short": "Partager le QR",
  "settings.qr.download": "Télécharger le code QR",
  "settings.qr.download_short": "Télécharger le QR",
  "settings.qr.show": "Afficher le code QR",
  "settings.wipe.trigger": "Déclencher l’effacement d’urgence",
  "settings.wipe.trigger_desc":
    "Touche trois fois pour effacer immédiatement sans confirmation",
  "settings.wipe.title": "Effacement d’urgence",
  "settings.wipe.now": "Effacer maintenant",
  "settings.wipe.desc":
    "Détruit immédiatement toutes les clés, les messages et les preuves",
  "settings.wipe.body":
    "Cela détruira immédiatement toutes tes clés, tes messages et les preuves de ton portefeuille. C’est irréversible.",
  "settings.wipe.in_progress": "Effacement",
  "settings.wipe.in_progress_body":
    "Destruction de tes clés, messages et fichiers. Cela prend quelques secondes et se termine tout seul même si l’app est fermée.",
  "settings.wipe.got_it": "Compris",
  "settings.wipe.keys_failed": "Impossible de détruire les clés",
  "settings.wipe.keys_failed_body":
    "Tes messages, tes contacts et ton portefeuille ont disparu, mais l’appareil a refusé de libérer tes clés. Déverrouille-le et efface à nouveau.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Écris-nous",
  "settings.help.contact_a11y": "Envoyer un e-mail à {address}",
  "settings.help.bug": "Signaler un bug",
  "settings.help.bug_desc": "Ouvre un ticket sur GitHub",
  "settings.help.bug_a11y": "Signaler un bug sur GitHub",
  "settings.help.faq": "Questions fréquentes",
  "settings.help.faq_desc": "Réponses aux questions courantes",
  "settings.help.faq_a11y": "Ouvrir la FAQ",
  "settings.help.terms_desc": "Comment Airhop peut être utilisé",
  "settings.help.terms_a11y": "Ouvrir les Conditions d’utilisation",
  "settings.help.privacy_desc": "Ce que nous ne collectons pas",
  "settings.help.privacy_a11y": "Ouvrir la Politique de confidentialité",

  // ---- Settings: support ----
  "settings.support.card": "Carte ou UPI",
  "settings.support.card_desc":
    "Virement en ligne et portefeuilles, dans le monde entier",
  "settings.support.card_a11y":
    "Soutenir par carte, UPI, virement en ligne ou portefeuille",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Mensuel ou ponctuel, sans commission de plateforme",
  "settings.support.sponsors_a11y": "Soutenir via GitHub Sponsors",
  "settings.support.note":
    "Je construis Airhop sur mon temps libre. Il n’y a ni investisseurs ni publicité. Si tu le trouves utile, une contribution aide beaucoup à garder le développement actif. Dans tous les cas, chaque fonction reste gratuite.",

  // ---- Settings: about and version ----
  "settings.about.version": "Version",
  "settings.about.version_desc": "Version actuelle",
  "settings.about.version_a11y":
    "Voir la version et rechercher des mises à jour",
  "settings.about.release_notes": "Notes de version",
  "settings.about.release_notes_desc": "Les nouveautés de la dernière version",
  "settings.about.release_notes_a11y":
    "Ouvrir les notes de la dernière version sur GitHub",
  "settings.about.source": "Code source",
  "settings.about.source_a11y": "Ouvrir le code source sur GitHub",
  "settings.about.licenses": "Licences open source",
  "settings.about.open_repo": "Ouvrir le dépôt {name}",
  "settings.about.licenses_desc": "Paquets open source tiers",
  "settings.about.licenses_a11y": "Voir les licences tierces",
  "settings.version.codename": "Nom de code",
  "settings.version.checking": "Vérification",
  "settings.version.check": "Rechercher des mises à jour",
  "settings.version.checking_title": "Recherche de mises à jour",
  "settings.version.up_to_date": "Tu utilises la dernière version.",
  "settings.version.release_notes": "Voir les notes de version",
  "settings.version.made_with": "Réalisé avec",
  "settings.version.number": "Version {version}",
  "settings.version.update_to": "Mettre à jour vers {version}",
  "settings.version.update_to_a11y": "Mettre à jour vers la version {version}",
  "settings.version.released_under": "Publié sous licence {license}",
  "settings.version.notes_a11y": "Voir les notes de la version {version}",
  "settings.version.tor_paused":
    "La recherche de mises à jour est suspendue tant que Tor est actif, pour ne pas exposer ton IP. Consulte la page des versions dans un navigateur.",
  "settings.version.check_failed":
    "Impossible de rechercher des mises à jour. Vérifie ta connexion et réessaie.",
  "settings.version.downloading": "Téléchargement {percent} %",
  "settings.version.install": "Installer",
  "settings.version.download_failed":
    "Échec du téléchargement. Vérifiez votre connexion et réessayez.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} pèse {size} KiB et dépasse la limite de {cap} KiB.",
  "transfer.failed.malformed":
    "Une pièce jointe est arrivée endommagée et n’a pas pu être ouverte. Demande de la renvoyer.",
  "transfer.failed.unsupported_type":
    "Une pièce jointe est arrivée dans un format que cette app ne peut pas ouvrir.",
  "transfer.failed.type_mismatch":
    "Une pièce jointe a été refusée : son contenu ne correspond pas au type de fichier annoncé.",
  "transfer.failed.storage":
    "Une pièce jointe est arrivée mais n’a pas pu être enregistrée. Vérifie ton espace libre.",
  "transfer.badge.waiting": "En attente · {name}",
  "transfer.badge.active_count": "{count} transferts",
  "transfer.badge.sending": "Envoi de {name}",
  "transfer.badge.receiving": "Réception de {name}",
  "transfer.badge.a11y":
    "{label}, {percent} pour cent. Ouvrir la conversation.",
  "transfer.kind.photo": "Photo",
  "transfer.kind.video": "Vidéo",
  "transfer.kind.voice": "Note vocale",
  "transfer.this.photo": "Cette photo",
  "transfer.this.video": "Cette vidéo",
  "transfer.this.voice": "Cette note vocale",
  "transfer.this.file": "Ce fichier",
  "transfer.kind.document": "Document",
  "transfer.kind.voice_preview": "Note vocale",
  "transfer.kind.photo_preview": "Photo",
  "transfer.kind.video_preview": "Vidéo",
  "transfer.kind.document_preview": "Document",

  // ---- System notifications ----
  "notif.channel.messages": "Messages",
  "notif.channel.nearby": "Pairs à proximité",
  "notif.channel.nearby_desc":
    "Un avis occasionnel quand le maillage trouve des gens à portée du Bluetooth.",
  "notif.nearby.body":
    "À portée du Bluetooth maintenant. Touche pour ouvrir le maillage.",
  "notif.channel_message": "{sender} : {preview}",
  "notif.someone": "Quelqu’un",
  "notif.notice_urgent": "Avis urgent · {content}",
  "notif.notice": "Avis · {content}",
  "notif.incoming_file": "Fichier entrant",
  "notif.preview.photo": "📷 Photo",
  "notif.preview.voice": "🎤 Message vocal",
  "notif.preview.video": "🎥 Vidéo",
  "notif.preview.document": "📄 Document",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Nouveau message",
  "notif.hidden.channel": "Nouvelle activité",
  "notif.hidden.mention": "Tu as été mentionné",
  "notif.mention.title": "{sender} t’a mentionné",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Afficher {count} de plus",
    many: "Afficher {count} de plus",
    other: "Afficher {count} de plus",
  },
  "chat.channels.show_more_a11y": {
    one: "Afficher {count} canal par défaut de plus",
    many: "Afficher {count} canaux par défaut de plus",
    other: "Afficher {count} canaux par défaut de plus",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} non lu",
    many: "{label}, {count} non lus",
    other: "{label}, {count} non lus",
  },
  "a11y.new_count": {
    one: "{label}, {count} nouveau",
    many: "{label}, {count} nouveaux",
    other: "{label}, {count} nouveaux",
  },
  "chat.a11y.unread": {
    one: "{count} non lu",
    many: "{count} non lus",
    other: "{count} non lus",
  },
  "chat.thread.length_left": {
    one: "{count} restant",
    many: "{count} restants",
    other: "{count} restants",
  },
  "settings.general.retention_days": {
    one: "{count} jour",
    many: "{count} jours",
    other: "{count} jours",
  },
  "chat.info.group_reach": {
    one: "{reachable} membre sur {count} joignable",
    many: "{reachable} membres sur {count} joignables",
    other: "{reachable} membres sur {count} joignables",
  },
  "chat.group_members": {
    one: "Groupe privé  ·  {count} membre",
    many: "Groupe privé  ·  {count} membres",
    other: "Groupe privé  ·  {count} membres",
  },
  "chat.select.count": {
    one: "{count} sélectionné",
    many: "{count} sélectionnés",
    other: "{count} sélectionnés",
  },
  "chat.select.forward": {
    one: "Transférer {count} message",
    many: "Transférer {count} messages",
    other: "Transférer {count} messages",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} personne parle",
    many: "{count} personnes parlent",
    other: "{count} personnes parlent",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} pair à portée",
    many: "{count} pairs à portée",
    other: "{count} pairs à portée",
  },
  "mesh.peer.hops_away": {
    one: "à {count} saut",
    many: "à {count} sauts",
    other: "à {count} sauts",
  },
  "chat.presence.active": {
    one: "{count} actif",
    many: "{count} actifs",
    other: "{count} actifs",
  },
  "chat.presence.nearby": {
    one: "{count} à proximité",
    many: "{count} à proximité",
    other: "{count} à proximité",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mint",
    many: "{count} mints",
    other: "{count} mints",
  },
  "wallet.mint.remove_body": {
    one: "{mint} détient {balance} {unit} dans {count} preuve. La retirer supprime cette preuve de cet appareil définitivement et il n’existe aucune sauvegarde. Retire ou envoie d’abord le solde.",
    many: "{mint} détient {balance} {unit} dans {count} preuves. La retirer supprime ces preuves de cet appareil définitivement et il n’existe aucune sauvegarde. Retire ou envoie d’abord le solde.",
    other:
      "{mint} détient {balance} {unit} dans {count} preuves. La retirer supprime ces preuves de cet appareil définitivement et il n’existe aucune sauvegarde. Retire ou envoie d’abord le solde.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} dépôt en attente de paiement. Vérifié à nouveau à chaque ouverture de l’app.",
    many: "{count} dépôts en attente de paiement. Vérifiés à nouveau à chaque ouverture de l’app.",
    other:
      "{count} dépôts en attente de paiement. Vérifiés à nouveau à chaque ouverture de l’app.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{count} preuve non dépensée récupérée depuis {mints}.",
    many: "{count} preuves non dépensées récupérées depuis {mints}.",
    other: "{count} preuves non dépensées récupérées depuis {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "{count} pièce a été trouvée mais était déjà dépensée, donc rien n’a été crédité. C’est normal : chaque pièce que tu as dépensée reste dans les registres que conserve le mint.",
    many: "{count} pièces ont été trouvées mais étaient déjà dépensées, donc rien n’a été crédité. C’est normal : chaque pièce que tu as dépensée reste dans les registres que conserve le mint.",
    other:
      "{count} pièces ont été trouvées mais étaient déjà dépensées, donc rien n’a été crédité. C’est normal : chaque pièce que tu as dépensée reste dans les registres que conserve le mint.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Afficher {count} de plus",
    many: "Afficher {count} de plus",
    other: "Afficher {count} de plus",
  },
  "wallet.activity.show_more_a11y": {
    one: "Afficher {count} paiement de plus",
    many: "Afficher {count} paiements de plus",
    other: "Afficher {count} paiements de plus",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} non confirmée",
    many: "{count} non confirmées",
    other: "{count} non confirmées",
  },
  "wallet.proof_count": {
    one: "{count} preuve",
    many: "{count} preuves",
    other: "{count} preuves",
  },
  "wallet.spent_removed_detail": {
    one: "{count} preuve était déjà dépensée et a été supprimée.",
    many: "{count} preuves étaient déjà dépensées et ont été supprimées.",
    other: "{count} preuves étaient déjà dépensées et ont été supprimées.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Quelqu’un à proximité",
    many: "{count} personnes à proximité",
    other: "{count} personnes à proximité",
  },
};

export const fr = { strings, plurals };
