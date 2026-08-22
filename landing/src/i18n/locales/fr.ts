import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Retour à l'accueil",
  "common.last_updated": "Dernière mise à jour : {date}",

  "nav.aria": "Principal",
  "nav.home": "Accueil Airhop",
  "nav.skip": "Aller au contenu",
  "nav.menu.open": "Ouvrir le menu",
  "nav.menu.close": "Fermer le menu",
  "nav.how_it_works": "Comment ça marche",
  "nav.architecture": "Architecture",
  "nav.faq": "FAQ",

  "footer.aria": "Pied de page",
  "footer.tagline": "Communication mesh privée",
  "footer.credit": "© Fait avec {heart} par {author}",
  "footer.group.download": "Télécharger",
  "footer.group.resources": "Ressources",
  "footer.group.social": "Réseaux",
  "footer.group.legal": "Mentions légales",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Architecture",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "FAQ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Conditions d'utilisation",
  "footer.link.privacy": "Politique de confidentialité",
  "footer.link.license": "Licence du projet",

  "settings.theme.group": "Thème de couleur",
  "settings.theme.light": "Thème clair",
  "settings.theme.dark": "Thème sombre",
  "settings.language.label": "Langue",
  "settings.language.suggestion": "Voir cette page en français",
  "settings.language.dismiss": "Fermer",

  "home.hero.release": "Dernière version",
  "home.hero.title": "Une messagerie qui fonctionne sans internet.",
  "home.hero.body":
    "Les téléphones proches forment un mesh Bluetooth et relaient vos messages jusqu'à sept sauts, chiffrés de bout en bout. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Aucun serveur",
  "home.hero.body.no_accounts": "aucun compte",
  "home.hero.body.no_tracking": "aucun pistage",
  "home.hero.download": "Télécharger l'application",
  "home.hero.badges": "Licence MIT · Libre et open source · Compatible bitchat",
  "home.hero.group.mobile": "Mobile",
  "home.hero.group.desktop": "Ordinateur",
  "home.hero.option.f_droid": "Catalogue open source",
  "home.hero.option.apk": "Téléchargement direct",
  "home.hero.option.soon": "Bientôt disponible",

  "home.about.eyebrow": "Qu'est-ce qu'Airhop",
  "home.about.title": "La plupart des applications dépendent d'un serveur central.",
  "home.about.sub":
    "Un serveur peut être surveillé, coupé ou bloqué. Airhop n'en a aucun, donc il n'y a pas d'entreprise à faire plier ni de service à fermer.",
  "home.about.card": "Aperçu technique",
  "home.about.link.mesh": "mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protocole de transmission",
  "home.about.body.built":
    "Airhop est une application open source pour iOS et Android dédiée à la messagerie privée de pair à pair sur {mesh}. Elle repose sur les fondations de {bitchat}, en réutilisant son {wire_protocol} et son modèle de sécurité, puis en y ajoutant les paiements {ecash} hors ligne et une IA hors ligne. Elle fonctionne sans aucune connexion internet, et les messages sont relayés automatiquement entre les appareils proches (environ 10 à 30 mètres par saut à l'intérieur, davantage en plein air), jusqu'à 7 sauts.",
  "home.about.body.identity":
    "Votre identité est une paire de clés {ed25519} générée sur votre appareil et conservée dans {ios_keychain} ou {android_keystore}. Il n'y a ni compte, ni inscription, ni rien qui touche un serveur, autrement dit l'application peut servir d'application jetable qui ne laisse aucune trace remontant jusqu'à vous une fois supprimée.",
  "home.about.body.crypto":
    "Chaque session utilise le protocole {noise} pour une poignée de main authentifiée. Les messages stockés utilisent l'algorithme {ratchet}, autrement dit même si votre appareil est compromis plus tard, vos anciens messages restent illisibles. L'effacement d'urgence détruit toutes les clés et tous les messages en moins d'une seconde.",
  "home.about.body.internet":
    "Quand vous et votre contact êtes hors de portée du Bluetooth, les relais {nostr} servent de pont par internet, avec des messages privés emballés au format {nip17}, de sorte que le mesh s'étend au monde entier dès que vous êtes tous les deux en ligne. La prise en charge de {tor} est également disponible sur iOS (via {arti}) et sur Android (via {orbot}).",
  "home.about.optional.title":
    "Airhop propose des fonctionnalités facultatives que vous pouvez activer :",
  "home.about.optional.payments.label": "Paiements hors ligne :",
  "home.about.optional.payments.body":
    "Envoyez et recevez des paiements sur le mesh grâce au protocole {cashu} (Bitcoin uniquement).",
  "home.about.optional.ai.label": "IA hors ligne :",
  "home.about.optional.ai.body":
    "Un petit assistant IA embarqué qui répond aux questions importantes. Tout le traitement et les données restent sur votre appareil.",
  "home.about.body.compatible":
    "Airhop est compatible avec bitchat au niveau du protocole. Un appareil Airhop et un appareil bitchat sur le même mesh se découvrent automatiquement et peuvent échanger messages et messages privés sans aucune configuration.",

  "home.situations.eyebrow": "Quand vous en avez besoin",
  "home.situations.title": "Pour le jour où le réseau tombe.",
  "home.situations.sub":
    "Catastrophes naturelles, coupures d'internet, manifestations massives, ou un simple week-end hors couverture.",
  "home.situations.disaster.label": "Catastrophe",
  "home.situations.disaster.line":
    "Les antennes sont hors service. Un avis sur le tableau atteint quiconque passe par là.",
  "home.situations.offgrid.label": "Hors réseau",
  "home.situations.offgrid.line":
    "Deuxième jour sur le sentier. La dernière barre de réseau a disparu hier.",
  "home.situations.protest.label": "Manifestation",
  "home.situations.protest.line": "Un QR code sur un tract ouvre un canal chiffré pour le cortège.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Aucun réseau sur le site. Les messages sautent de téléphone en téléphone entre inconnus.",

  "home.showcase.eyebrow": "Voir l'application",
  "home.showcase.title": "Une messagerie ordinaire, hors ligne.",
  "home.showcase.sub":
    "Discussions, canaux, portefeuille et identité. Familier en surface, avec un mesh en dessous qui fait le travail.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Toutes les personnes à portée, placées selon leur proximité. Personne n'a besoin d'être ajouté au préalable.",
  "home.showcase.mesh.alt":
    "L'écran Mesh de l'application Airhop, montrant quatre pairs proches disposés sur un radar selon la puissance du signal.",
  "home.showcase.chats.title": "Discussions",
  "home.showcase.chats.caption":
    "Des conversations ordinaires. Les téléphones qui transmettent chaque message ne peuvent pas l'ouvrir.",
  "home.showcase.chats.alt":
    "Une conversation privée dans Airhop pendant une coupure de courant, relayée par trois téléphones.",
  "home.showcase.channels.title": "Canaux",
  "home.showcase.channels.caption":
    "Des salons publics aussi petits qu'un pâté de maisons ou aussi larges qu'une région, ouverts à quiconque s'y trouve.",
  "home.showcase.channels.alt":
    "L'écran des discussions de l'application Airhop, listant des canaux publics limités à un pâté de maisons, un quartier, une ville et une région.",
  "home.showcase.wallet.title": "Portefeuille",
  "home.showcase.wallet.caption":
    "Remettez de l'ecash à la personne à côté de vous par Bluetooth, sans qu'aucun des deux téléphones soit en ligne.",
  "home.showcase.wallet.alt":
    "L'écran du portefeuille de l'application Airhop, montrant un solde en ecash qui peut être envoyé par Bluetooth.",
  "home.showcase.identity.title": "Identité",
  "home.showcase.identity.caption":
    "Pas d'inscription, pas de numéro de téléphone, pas d'e-mail. Juste une clé qui ne quitte jamais ce téléphone.",
  "home.showcase.identity.alt":
    "L'écran de profil de l'application Airhop, montrant une identité générée sur l'appareil, sans compte.",

  "home.how.eyebrow": "Comment ça marche",
  "home.how.title": "Le mesh se forme tout seul.",
  "home.how.sub":
    "Les nœuds proches forment un mesh auto-réparant par Bluetooth. Quand il y a internet, les relais Nostr l'étendent, sans infrastructure contrôlée par qui que ce soit.",
  "home.how.cta": "Lire l'architecture complète",
  "home.how.discover.title": "Découvrir",
  "home.how.discover.line":
    "Les téléphones sous Airhop ou bitchat se trouvent automatiquement par Bluetooth. Pas d'appairage, pas de configuration.",
  "home.how.relay.title": "Relayer",
  "home.how.relay.line":
    "Un message saute de téléphone en téléphone, jusqu'à sept sauts. Les téléphones intermédiaires ne voient jamais ce qu'ils transportent.",
  "home.how.reach.title": "Aller plus loin",
  "home.how.reach.line":
    "Quand il y a internet, les relais Nostr portent la même conversation plus loin, au besoin via Tor.",
  "home.how.swipe": "faites glisser pour explorer",
  "home.how.diagram": "Mesh BLE · réseau local de pair à pair",
  "home.how.legend.node": "Nœud du mesh BLE (hors ligne)",
  "home.how.legend.relay": "Relais multi-sauts (chiffré Noise XX)",
  "home.how.legend.bitchat": "Compatible bitchat sur le même mesh",
  "home.how.legend.nostr": "Pont Nostr (internet, quand connecté)",

  "home.map.aria": "Carte mondiale des emplacements des relais Nostr",
  "home.map.summary": "Pont Nostr · {relays} dans {locations} à travers le monde",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Ce qu'elle fait",
  "home.features.title": "Une vraie messagerie, pas une démo.",
  "home.features.sub":
    "Discussion, identité, réseau et argent. Le tout conçu pour fonctionner sans réseau, sans compte et sans intermédiaire.",

  "home.features.messaging.title": "Messagerie",
  "home.features.messaging.summary":
    "Tout ce qu'a une messagerie, avec zéro infrastructure derrière.",
  "home.features.messaging.dms.name": "Messages privés",
  "home.features.messaging.dms.line":
    "Chiffrés de bout en bout, avec accusés de remise et de lecture.",
  "home.features.messaging.location.name": "Canaux de localisation",
  "home.features.messaging.location.line":
    "Des salons liés à un lieu, d'un pâté de maisons à une région.",
  "home.features.messaging.groups.name": "Canaux et groupes privés",
  "home.features.messaging.groups.line":
    "Des liens d'invitation pour un salon, ou une liste signée jusqu'à 16 personnes.",
  "home.features.messaging.board.name": "Tableau d'affichage",
  "home.features.messaging.board.line":
    "Des avis épinglés à une zone pendant sept jours au maximum.",
  "home.features.messaging.voice.name": "Voix en direct",
  "home.features.messaging.voice.line":
    "Maintenez le micro et parlez à tous ceux à portée, comme un talkie-walkie.",
  "home.features.messaging.notes.name": "Notes vocales",
  "home.features.messaging.notes.line":
    "De l'audio enregistré, plus rapide que taper un itinéraire.",
  "home.features.messaging.files.name": "Photos, vidéos et fichiers",
  "home.features.messaging.files.line": "Tous formats, jusqu'à 1 Mio, sans aucun réseau.",
  "home.features.messaging.forward.name": "Stockage et retransmission",
  "home.features.messaging.forward.line":
    "Scellé et transporté par un téléphone proche jusqu'à destination.",

  "home.features.identity.title": "Identité",
  "home.features.identity.summary": "Rien à enregistrer, rien à saisir.",
  "home.features.identity.keys.name": "Identité par paire de clés",
  "home.features.identity.keys.line":
    "Créée sur ce téléphone, conservée dans le trousseau du système.",
  "home.features.identity.names.name": "Noms lisibles",
  "home.features.identity.names.line":
    "Dérivés de votre clé, donc personne ne peut prendre le vôtre.",
  "home.features.identity.qr.name": "Contacts par QR",
  "home.features.identity.qr.line": "Un scan transmet leurs clés, pas seulement leur nom.",
  "home.features.identity.panic.name": "Effacement d'urgence",
  "home.features.identity.panic.line":
    "Chaque clé et chaque message détruits en moins d'une seconde.",

  "home.features.networking.title": "Réseau",
  "home.features.networking.summary": "Les téléphones sont le réseau.",
  "home.features.networking.mesh.name": "Mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Sans internet, sans routeur, sur des téléphones que les gens ont déjà.",
  "home.features.networking.bridge.name": "Pont mesh",
  "home.features.networking.bridge.line":
    "Relie votre discussion publique à un groupe proche hors de portée.",
  "home.features.networking.wifi.name": "Voie rapide WiFi",
  "home.features.networking.wifi.line":
    "Des transferts plus rapides entre deux Android ou deux iPhone.",
  "home.features.networking.bitchat.name": "Compatible bitchat",
  "home.features.networking.bitchat.line":
    "Les deux applications rejoignent le même mesh sans configuration.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Une extension, jamais une exigence.",
  "home.features.internet.nostr.name": "Secours Nostr",
  "home.features.internet.nostr.line":
    "Les messages privés et les canaux de localisation continuent au-delà de la portée radio.",
  "home.features.internet.relays.name": "Découverte de géo-relais",
  "home.features.internet.relays.line":
    "Plus de 300 relais publics indépendants, aucun ne nous appartient.",
  "home.features.internet.gateway.name": "Passerelle internet",
  "home.features.internet.gateway.line":
    "Prêtez votre connexion pour qu'un téléphone hors ligne à proximité atteigne les canaux de localisation.",
  "home.features.internet.tor.name": "Intégration Tor",
  "home.features.internet.tor.line":
    "Routé sur les deux plateformes, pour que les relais ne voient jamais votre IP.",

  "home.features.optional.title": "Facultatif",
  "home.features.optional.summary": "Désactivé par défaut. Activé quand vous le voulez.",
  "home.features.optional.cashu.name": "Ecash Cashu",
  "home.features.optional.cashu.line":
    "Payez la personne à côté de vous sans qu'aucun téléphone soit en ligne.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Rechargez ou retirez en bitcoin via le réseau Lightning.",
  "home.features.optional.ai.name": "IA locale",
  "home.features.optional.ai.line": "Des réponses sur l'appareil, rien ne quitte le téléphone.",
  "home.features.optional.social.name": "Ponts sociaux",
  "home.features.optional.social.line": "Bluesky et Mastodon avec la même identité.",

  "home.compare.eyebrow": "Comparaison",
  "home.compare.title": "Hors ligne, sans matériel et ouvert.",
  "home.compare.sub":
    "Chaque application ici est bonne à quelque chose. Seules certaines fonctionnent encore quand le réseau ne fonctionne plus.",
  "home.compare.col.project": "Projet",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Chiffrement",
  "home.compare.col.offline": "Fonctionne hors ligne",
  "home.compare.col.hardware_free": "Sans matériel",
  "home.compare.col.open_source": "Open source",
  "home.compare.mark.yes": "Oui",
  "home.compare.mark.no": "Non",
  "home.compare.mark.partial": "Partiel, les clients sont open source, les serveurs non",
  "home.compare.mark.partial_hint": "Les clients sont open source, les serveurs non",
  "home.compare.transport.servers": "Serveurs centralisés",
  "home.compare.transport.onion": "Routage en oignon (nœuds de service)",
  "home.compare.transport.nostr": "Relais Nostr",
  "home.compare.transport.lora": "Radio LoRa",
  "home.compare.transport.sub_ghz": "Radio sub-GHz propriétaire",

  "home.explore.eyebrow": "Ouvert et honnête",
  "home.explore.title": "Chaque affirmation ici est vérifiable.",
  "home.explore.sub":
    "Le code, le protocole et les plans sont publics. Les limites aussi. Vérifiez par vous-même avant de nous croire sur parole.",
  "home.explore.audit.chip": "Audit en attente",
  "home.explore.audit.headline":
    "Airhop n'a pas encore fait l'objet d'un audit de sécurité externe.",
  "home.explore.audit.body":
    "{headline} Tout le code est relu personnellement et passé par un {review} avant publication, et la bibliothèque cryptographique utilisée est auditée par Cure53, mais cela ne remplace pas un audit formel de l'application elle-même. Un audit est prévu pour {version}. D'ici là, ne vous y fiez pas pour des usages sensibles.",
  "home.explore.audit.link.review": "agent de revue de sécurité",
  "home.explore.source.title": "Code source",
  "home.explore.source.desc":
    "Tout sur GitHub sous licence MIT. Tickets, pull requests et discussions ouverts.",
  "home.explore.protocol.title": "Spécification du protocole",
  "home.explore.protocol.desc":
    "Le format de transmission exact, les UUID BLE et les constantes, partagés avec bitchat.",
  "home.explore.architecture.title": "Architecture",
  "home.explore.architecture.desc":
    "Le détail technique complet, du moment où l'on appuie sur envoyer jusqu'aux octets sur les ondes.",
  "home.explore.roadmap.title": "Feuille de route",
  "home.explore.roadmap.desc":
    "Les objectifs de version de la v0.5.0 à la v2.0.0, y compris l'audit prévu.",
  "home.explore.vision.title": "Vision",
  "home.explore.vision.desc":
    "Pourquoi Airhop existe, et les principes qui ne changent pas sous la pression.",
  "home.explore.brand.title": "Kit de marque",
  "home.explore.brand.desc":
    "L'oiseau en pixels, les jetons de couleur et de typographie, les ressources presse et les textes types.",

  "home.contribute.eyebrow": "Soutenir ce projet",
  "home.contribute.title": "Indépendant, et à découvert.",
  "home.contribute.sub":
    "Il n'y a ni investisseurs, ni publicité, ni offre payante. Toutes les fonctionnalités restent gratuites de toute façon, et le travail est financé par ceux qui le trouvent utile.",
  "home.contribute.contribute.chip": "Contribuer",
  "home.contribute.contribute.body":
    "Mettez une étoile au dépôt, ouvrez des tickets et proposez des pull requests. Les rapports de bugs, les propositions de fonctionnalités et les contributions de code sont tous les bienvenus.",
  "home.contribute.contribute.cta": "Voir sur GitHub",
  "home.contribute.sponsor.chip": "Sponsoriser",
  "home.contribute.sponsor.body":
    "Si Airhop vous est utile, un don ponctuel ou un parrainage régulier aide beaucoup à maintenir le développement actif.",
  "home.contribute.sponsor.donate": "Faire un don",
  "home.contribute.sponsor.github": "Sponsoriser sur GitHub",

  "page.architecture.eyebrow": "Documentation",
  "page.architecture.title": "Architecture",
  "page.architecture.toc": "Sur cette page",

  "page.faq.eyebrow": "FAQ",
  "page.faq.title": "Questions fréquentes",
  "page.faq.meta": "Questions courantes sur Airhop.",
  "page.faq.contact":
    "Les questions sans réponse ici peuvent être envoyées à {email} ou posées en ouvrant une discussion sur {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Bientôt disponible",
  "page.blogs.body":
    "Des écrits sur les réseaux mesh, la vie privée et les logiciels hors ligne d'abord.",

  "page.brand.eyebrow": "Marque",
  "page.brand.title": "Kit de marque",
  "page.brand.meta":
    "Ressources et règles pour présenter Airhop dans un article, une fiche de magasin, une conférence ou un README. Libre d'usage pour référence et pour la presse.",

  "page.legal.eyebrow": "Mentions légales",
  "page.privacy.title": "Politique de confidentialité",
  "page.terms.title": "Conditions d'utilisation",

  "page.notfound.title": "Page introuvable",
  "page.notfound.body": "La page que vous cherchez n'existe pas ou a été déplacée.",

  "page.english_only": "Cette page n'est disponible qu'en anglais.",

  "seo.breadcrumb.home": "Accueil",

  "seo.home.title": "Airhop — Messagerie privée, hors ligne d'abord",
  "seo.home.description":
    "Messagerie privée de pair à pair pour iOS et Android. Sans internet, sans serveurs, sans comptes. Communiquez par mesh Bluetooth partout.",

  "seo.architecture.title": "Architecture — Airhop",
  "seo.architecture.description":
    "Le fonctionnement d'Airhop de bout en bout : identité, choix du transport, mesh Bluetooth, chiffrement, couche internet, Tor, ecash hors ligne, IA embarquée et format de transmission compatible bitchat.",
  "seo.architecture.breadcrumb": "Architecture",
  "seo.architecture.headline": "Architecture d'Airhop",
  "seo.architecture.summary":
    "Un détail technique complet d'Airhop : identité, transports, mesh Bluetooth, chiffrement, couche internet Nostr, Tor, portefeuille Cashu, assistant IA embarqué et format de transmission.",

  "seo.faq.title": "Questions fréquentes — Airhop",
  "seo.faq.description":
    "Des réponses sur la messagerie mesh Bluetooth d'Airhop, le chiffrement, les paiements hors ligne, la couche internet Nostr et la compatibilité bitchat.",
  "seo.faq.breadcrumb": "FAQ",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description":
    "Des écrits sur les réseaux mesh, la vie privée et les logiciels hors ligne d'abord.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Kit de marque — Airhop",
  "seo.brand.description":
    "Le kit de marque Airhop : l'oiseau en pixels, le logotype, les jetons de couleur et de typographie, les ressources presse et les textes types.",
  "seo.brand.breadcrumb": "Kit de marque",

  "seo.privacy.title": "Politique de confidentialité — Airhop",
  "seo.privacy.description":
    "Comment Airhop traite les données : sans comptes, sans serveurs, sans pistage. Votre identité et vos messages restent sur votre appareil.",
  "seo.privacy.breadcrumb": "Politique de confidentialité",

  "seo.terms.title": "Conditions d'utilisation — Airhop",
  "seo.terms.description": "Les conditions régissant l'usage de l'application et du site Airhop.",
  "seo.terms.breadcrumb": "Conditions d'utilisation",

  "seo.notfound.title": "Page introuvable — Airhop",
  "seo.notfound.description": "La page que vous cherchez n'existe pas ou a été déplacée.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} relais",
    other: "{count} relais",
  },
  "home.map.locations": {
    one: "{count} emplacement",
    other: "{count} emplacements",
  },
};

export const locale: Locale = { strings, plurals };
