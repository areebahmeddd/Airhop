import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Bumalik sa home",
  "common.last_updated": "Huling na-update: {date}",

  "nav.aria": "Pangunahing nabigasyon",
  "nav.home": "Home ng Airhop",
  "nav.skip": "Lumaktaw sa nilalaman",
  "nav.menu.open": "Buksan ang menu",
  "nav.menu.close": "Isara ang menu",
  "nav.how_it_works": "Paano ito gumagana",
  "nav.architecture": "Arkitektura",
  "nav.faq": "Mga madalas itanong",

  "footer.aria": "Footer",
  "footer.tagline": "Pribadong komunikasyong mesh",
  "footer.credit": "© Ginawa nang may {heart} ni {author}",
  "footer.group.download": "I-download",
  "footer.group.resources": "Mga mapagkukunan",
  "footer.group.social": "Social",
  "footer.group.legal": "Legal",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Arkitektura",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "Mga madalas itanong",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Mga Tuntunin ng Serbisyo",
  "footer.link.privacy": "Patakaran sa Privacy",
  "footer.link.license": "Lisensya ng Proyekto",

  "settings.theme.group": "Tema ng kulay",
  "settings.theme.light": "Maliwanag na tema",
  "settings.theme.dark": "Madilim na tema",
  "settings.language.label": "Wika",
  "settings.language.suggestion": "Tingnan ang pahinang ito sa Filipino",
  "settings.language.dismiss": "Isara",

  "home.hero.release": "Pinakabagong bersyon",
  "home.hero.title": "Pagmemensahe na gumagana kahit walang internet.",
  "home.hero.body":
    "Ang mga teleponong malapit ay bumubuo ng Bluetooth mesh at ipinapasa ang iyong mensahe hanggang pitong hakbang, naka-encrypt mula dulo hanggang dulo. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Walang server",
  "home.hero.body.no_accounts": "walang account",
  "home.hero.body.no_tracking": "walang pagsubaybay",
  "home.hero.download": "I-download ang app",
  "home.hero.badges": "Lisensyadong MIT · Libre at open source · Gumagana sa bitchat",
  "home.hero.group.mobile": "Mobile",
  "home.hero.group.desktop": "Desktop",
  "home.hero.option.f_droid": "Katalogo ng open source",
  "home.hero.option.apk": "Direktang download",
  "home.hero.option.soon": "Malapit na",

  "home.about.eyebrow": "Ano ang Airhop",
  "home.about.title": "Karamihan sa mga app ay umaasa sa isang sentral na server.",
  "home.about.sub":
    "Ang server ay puwedeng bantayan, patayin o harangan. Walang ganoon ang Airhop, kaya walang kompanyang mapipilit at walang serbisyong maisasara.",
  "home.about.card": "Teknikal na pangkalahatang-ideya",
  "home.about.link.mesh": "Bluetooth Low Energy mesh",
  "home.about.link.wire_protocol": "protokol ng paghahatid",
  "home.about.body.built":
    "Ang Airhop ay open source na app para sa iOS at Android para sa pribadong pagmemensahe nang direkta sa pagitan ng mga device sa pamamagitan ng {mesh}. Nakabatay ito sa pundasyon ng {bitchat}, ginagamit muli ang {wire_protocol} at modelo ng seguridad nito, at pinalalawak ang mga ito gamit ang offline na bayad na {ecash} at offline na AI. Gumagana ito nang walang anumang koneksyon sa internet, at ang mga mensahe ay awtomatikong ipinapasa sa mga device na malapit (humigit-kumulang 10 hanggang 30 metro bawat hakbang sa loob ng gusali, mas malayo sa labas), hanggang 7 hakbang.",
  "home.about.body.identity":
    "Ang iyong pagkakakilanlan ay isang pares ng susing {ed25519} na nilikha sa iyong device at nakaimbak sa {ios_keychain} o {android_keystore}. Walang account, walang pagpaparehistro, at walang anumang dumadaan sa server, ibig sabihin puwede itong gamitin bilang pansamantalang app na walang naiiwang anumang makakaugnay sa iyo matapos itong burahin.",
  "home.about.body.crypto":
    "Bawat sesyon ay gumagamit ng protokol na {noise} para sa napatunayang handshake. Ang mga nakaimbak na mensahe ay gumagamit ng algoritmong {ratchet}, ibig sabihin kahit makompromiso ang iyong device sa hinaharap, mananatiling hindi mabasa ang iyong mga lumang mensahe. Ang panic wipe ay sumisira sa lahat ng susi at mensahe sa wala pang isang segundo.",
  "home.about.body.internet":
    "Kapag ikaw at ang iyong kontak ay wala na sa saklaw ng Bluetooth, ang mga relay ng {nostr} ang nagsisilbing tulay sa internet, gamit ang mga direktang mensaheng nakabalot sa anyong {nip17}, kaya umaabot sa buong mundo ang mesh tuwing pareho kayong online. Available ang suporta sa {tor} sa iOS at Android, sa pamamagitan ng {arti}.",
  "home.about.optional.title": "May mga opsyonal na tampok ang Airhop na puwede mong buksan:",
  "home.about.optional.payments.label": "Offline na bayad:",
  "home.about.optional.payments.body":
    "Magpadala at tumanggap ng bayad sa mesh gamit ang protokol na {cashu} (Bitcoin lamang).",
  "home.about.optional.ai.label": "Offline na AI:",
  "home.about.optional.ai.body":
    "Isang maliit na katulong na AI sa mismong device na kayang sumagot sa mahahalagang tanong. Nananatili sa iyong device ang lahat ng pagproseso at datos.",
  "home.about.body.compatible":
    "Tugma ang Airhop sa bitchat sa antas ng protokol. Ang isang device na may Airhop at isang device na may bitchat sa iisang mesh ay awtomatikong nagkikita at makapagpapalitan ng mensahe at direktang mensahe nang walang anumang configuration.",

  "home.situations.eyebrow": "Kailan mo ito kailangan",
  "home.situations.title": "Para sa araw na bumagsak ang network.",
  "home.situations.sub":
    "Mga sakuna, pagputol ng internet, malalaking protesta, o ordinaryong katapusan ng linggo sa labas ng saklaw.",
  "home.situations.disaster.label": "Sakuna",
  "home.situations.disaster.line":
    "Bagsak ang mga tore. Ang paskil sa board ay umaabot sa sinumang dumaraan.",
  "home.situations.offgrid.label": "Labas ng grid",
  "home.situations.offgrid.line":
    "Ikalawang araw sa trail. Nawala ang huling bar ng signal kahapon.",
  "home.situations.protest.label": "Protesta",
  "home.situations.protest.line":
    "Isang QR code sa polyeto ang nagbubukas ng naka-encrypt na channel para sa martsa.",
  "home.situations.festival.label": "Pistahan",
  "home.situations.festival.line":
    "Walang signal sa lugar. Lumulukso ang mga mensahe sa telepono ng mga hindi kilala.",

  "home.showcase.eyebrow": "Tingnan ang app",
  "home.showcase.title": "Ordinaryong messenger, offline.",
  "home.showcase.sub":
    "Mga usapan, channel, wallet at pagkakakilanlan. Pamilyar sa ibabaw, may mesh sa ilalim na gumagawa ng trabaho.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Lahat ng nasa saklaw, nakaayos ayon sa lapit nila. Walang kailangang idagdag muna.",
  "home.showcase.mesh.alt":
    "Ang Mesh screen ng Airhop app, nagpapakita ng apat na kalapit na device na nakaayos sa radar ayon sa lakas ng signal.",
  "home.showcase.chats.title": "Mga usapan",
  "home.showcase.chats.caption":
    "Ordinaryong usapan. Hindi kayang buksan ng mga teleponong nagpapasa ng bawat mensahe ang laman nito.",
  "home.showcase.chats.alt":
    "Isang direktang usapan sa Airhop habang may brownout, ipinasa sa tatlong telepono.",
  "home.showcase.channels.title": "Mga channel",
  "home.showcase.channels.caption":
    "Pampublikong silid na kasinliit ng isang bloke o kasinlawak ng isang rehiyon, bukas sa sinumang naroon.",
  "home.showcase.channels.alt":
    "Ang chat screen ng Airhop app, naglilista ng pampublikong channel na nakatakda sa bloke, barangay, lungsod at rehiyon.",
  "home.showcase.wallet.title": "Wallet",
  "home.showcase.wallet.caption":
    "Iabot ang ecash sa taong katabi mo sa pamamagitan ng Bluetooth, kahit walang teleponong online.",
  "home.showcase.wallet.alt":
    "Ang wallet screen ng Airhop app, nagpapakita ng balanseng ecash na puwedeng ipadala sa Bluetooth.",
  "home.showcase.identity.title": "Pagkakakilanlan",
  "home.showcase.identity.caption":
    "Walang sign up, walang numero ng telepono, walang email. Isang susi lamang na hindi umaalis sa teleponong ito.",
  "home.showcase.identity.alt":
    "Ang profile screen ng Airhop app, nagpapakita ng pagkakakilanlang nilikha sa device nang walang account.",

  "home.how.eyebrow": "Paano ito gumagana",
  "home.how.title": "Kusang nabubuo ang mesh.",
  "home.how.sub":
    "Ang malalapit na node ay bumubuo ng mesh na kusang nag-aayos sa pamamagitan ng Bluetooth. Kapag may internet, pinalalawak ito ng mga relay ng Nostr, nang walang imprastrakturang kontrolado ninuman.",
  "home.how.cta": "Basahin ang buong arkitektura",
  "home.how.discover.title": "Pagtuklas",
  "home.how.discover.line":
    "Ang mga teleponong may Airhop o bitchat ay awtomatikong nagkikita sa Bluetooth. Walang pagpapares, walang setup.",
  "home.how.relay.title": "Pagpapasa",
  "home.how.relay.line":
    "Lumulukso ang mensahe mula telepono patungong telepono, hanggang pitong hakbang. Hindi nakikita ng mga teleponong nasa pagitan ang dala nila.",
  "home.how.reach.title": "Mas malayong abot",
  "home.how.reach.line":
    "Kapag may internet, dinadala ng mga relay ng Nostr ang parehong usapan nang mas malayo, puwedeng dumaan sa Tor.",
  "home.how.swipe": "mag-swipe para tuklasin",
  "home.how.diagram": "BLE mesh · lokal na network sa pagitan ng mga device",
  "home.how.legend.node": "Node ng BLE mesh (offline)",
  "home.how.legend.relay": "Pagpapasa sa maraming hakbang (naka-encrypt na Noise XX)",
  "home.how.legend.bitchat": "Tugma sa bitchat sa iisang mesh",
  "home.how.legend.nostr": "Tulay na Nostr (internet, kapag online)",

  "home.map.aria": "Mapa ng mundo ng mga lokasyon ng relay ng Nostr",
  "home.map.summary": "Tulay na Nostr · {relays} sa {locations} sa buong mundo",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Ano ang kaya nito",
  "home.features.title": "Tunay na messenger, hindi demo.",
  "home.features.sub":
    "Usapan, pagkakakilanlan, network at pera. Lahat ginawa para gumana nang walang signal, walang account, at walang namamagitan.",

  "home.features.messaging.title": "Pagmemensahe",
  "home.features.messaging.summary":
    "Lahat ng nasa isang messenger, nang walang anumang imprastraktura sa likod.",
  "home.features.messaging.dms.name": "Pribadong direktang mensahe",
  "home.features.messaging.dms.line":
    "Naka-encrypt mula dulo hanggang dulo, may resibo ng paghahatid at pagbabasa.",
  "home.features.messaging.location.name": "Channel ayon sa lokasyon",
  "home.features.messaging.location.line":
    "Mga silid na nakatali sa isang lugar, mula isang bloke hanggang isang rehiyon.",
  "home.features.messaging.groups.name": "Pribadong channel at grupo",
  "home.features.messaging.groups.line":
    "Link ng imbitasyon para sa silid, o nilagdaang listahan ng hanggang 16.",
  "home.features.messaging.board.name": "Bulletin board",
  "home.features.messaging.board.line":
    "Mga paskil na nakadikit sa isang lugar nang hanggang pitong araw.",
  "home.features.messaging.voice.name": "Live na boses",
  "home.features.messaging.voice.line":
    "Pindutin ang mikropono at makipag-usap sa sinumang nasa saklaw, parang walkie-talkie.",
  "home.features.messaging.notes.name": "Voice note",
  "home.features.messaging.notes.line": "Naitalang audio, mas mabilis kaysa mag-type ng direksyon.",
  "home.features.messaging.files.name": "Larawan, video at file",
  "home.features.messaging.files.line": "Anumang format, hanggang 1 MiB, walang kailangang signal.",
  "home.features.messaging.forward.name": "Itago at ipasa",
  "home.features.messaging.forward.line":
    "Nakaselyo at dala ng kalapit na telepono hanggang makarating ito.",

  "home.features.identity.title": "Pagkakakilanlan",
  "home.features.identity.summary": "Walang irerehistro, walang makukumpiska.",
  "home.features.identity.keys.name": "Pagkakakilanlan sa pares ng susi",
  "home.features.identity.keys.line":
    "Nilikha sa teleponong ito, nakaimbak sa keychain ng sistema.",
  "home.features.identity.names.name": "Nababasang pangalan",
  "home.features.identity.names.line": "Hango sa iyong susi, kaya walang makakaagaw ng sa iyo.",
  "home.features.identity.qr.name": "Kontak sa QR",
  "home.features.identity.qr.line":
    "Isang scan ang nagdadala ng kanilang susi, hindi lang ng pangalan.",
  "home.features.identity.panic.name": "Panic wipe",
  "home.features.identity.panic.line":
    "Bawat susi at bawat mensahe ay nasisira sa wala pang isang segundo.",

  "home.features.networking.title": "Networking",
  "home.features.networking.summary": "Ang mga telepono mismo ang network.",
  "home.features.networking.mesh.name": "Bluetooth mesh",
  "home.features.networking.mesh.line":
    "Walang internet, walang router, sa mga teleponong meron na ang mga tao.",
  "home.features.networking.bridge.name": "Tulay ng mesh",
  "home.features.networking.bridge.line":
    "Ikinokonekta ang iyong pampublikong usapan sa kalapit na pangkat na wala sa saklaw.",
  "home.features.networking.wifi.name": "Mabilis na daan sa WiFi",
  "home.features.networking.wifi.line":
    "Mas mabilis na paglipat sa pagitan ng dalawang Android o dalawang iPhone.",
  "home.features.networking.bitchat.name": "Tugma sa bitchat",
  "home.features.networking.bitchat.line":
    "Parehong app ay sumasali sa iisang mesh nang walang setup.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Karagdagan, hindi kailanman kinakailangan.",
  "home.features.internet.nostr.name": "Pambalik sa Nostr",
  "home.features.internet.nostr.line":
    "Patuloy ang mga direktang mensahe at channel ayon sa lokasyon kahit lampas na sa saklaw ng radyo.",
  "home.features.internet.relays.name": "Pagtuklas ng geo-relay",
  "home.features.internet.relays.line":
    "Mahigit 300 malayang pampublikong relay, wala ni isang amin.",
  "home.features.internet.gateway.name": "Gateway sa internet",
  "home.features.internet.gateway.line":
    "Ipahiram ang iyong koneksyon para maabot ng kalapit na offline na telepono ang mga channel ayon sa lokasyon.",
  "home.features.internet.tor.name": "Integrasyon sa Tor",
  "home.features.internet.tor.line":
    "Ruruta sa parehong plataporma, kaya hindi kailanman nakikita ng mga relay ang iyong IP.",

  "home.features.optional.title": "Opsyonal",
  "home.features.optional.summary": "Nakasara bilang default. Bukas kapag gusto mo.",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "Bayaran ang taong katabi mo kahit walang teleponong online.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Mag-top up o mag-cash out sa bitcoin sa Lightning network.",
  "home.features.optional.ai.name": "Lokal na AI",
  "home.features.optional.ai.line": "Mga sagot sa mismong device, walang lumalabas sa telepono.",
  "home.features.optional.social.name": "Mga tulay sa social",
  "home.features.optional.social.line": "Bluesky at Mastodon sa iisang pagkakakilanlan.",

  "home.compare.eyebrow": "Paghahambing",
  "home.compare.title": "Offline, walang karagdagang hardware, at bukas.",
  "home.compare.sub":
    "Bawat app dito ay may kagalingan. Iilan lang ang patuloy na gumagana kapag hindi na gumagana ang network.",
  "home.compare.col.project": "Proyekto",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Pag-encrypt",
  "home.compare.col.offline": "Gumagana offline",
  "home.compare.col.hardware_free": "Walang karagdagang hardware",
  "home.compare.col.open_source": "Open source",
  "home.compare.mark.yes": "Oo",
  "home.compare.mark.no": "Hindi",
  "home.compare.mark.partial": "Bahagya, open source ang mga client, ang mga server ay hindi",
  "home.compare.mark.partial_hint": "Open source ang mga client, ang mga server ay hindi",
  "home.compare.transport.servers": "Sentralisadong server",
  "home.compare.transport.onion": "Onion routing (service node)",
  "home.compare.transport.nostr": "Mga relay ng Nostr",
  "home.compare.transport.lora": "LoRa radyo",
  "home.compare.transport.sub_ghz": "Pribadong sub-GHz radyo",

  "home.explore.eyebrow": "Bukas at tapat",
  "home.explore.title": "Bawat sinasabi rito ay puwedeng suriin.",
  "home.explore.sub":
    "Pampubliko ang code, protokol at mga plano. Gayundin ang mga limitasyon. Suriin mo mismo bago maniwala sa amin.",
  "home.explore.audit.chip": "Hinihintay ang audit",
  "home.explore.audit.headline": "Hindi pa sumasailalim ang Airhop sa panlabas na security audit.",
  "home.explore.audit.body":
    "{headline} Personal na sinusuri ang lahat ng code at pinararaan sa isang {review} bago ilabas, at na-audit ng Cure53 ang cryptographic library na ginagamit nito, ngunit hindi iyon kapalit ng pormal na audit ng app mismo. May nakaplanong isa para sa {version}. Hanggang doon, huwag itong asahan sa mga sensitibong gamit.",
  "home.explore.audit.link.review": "ahente ng pagsusuri sa seguridad",
  "home.explore.source.title": "Source code",
  "home.explore.source.desc":
    "Lahat nasa GitHub sa ilalim ng MIT. Bukas ang mga issue, pull request at talakayan.",
  "home.explore.protocol.title": "Espesipikasyon ng protokol",
  "home.explore.protocol.desc":
    "Ang eksaktong anyo ng paghahatid, mga BLE UUID at mga konstant, kabahagi ng bitchat.",
  "home.explore.architecture.title": "Arkitektura",
  "home.explore.architecture.desc":
    "Ang buong teknikal na paliwanag, mula sa pagpindot ng send hanggang sa mga byte sa radyo.",
  "home.explore.roadmap.title": "Roadmap",
  "home.explore.roadmap.desc":
    "Mga target na bersyon mula v0.5.0 hanggang v2.0.0, kasama ang nakaplanong audit.",
  "home.explore.vision.title": "Bisyon",
  "home.explore.vision.desc":
    "Kung bakit umiiral ang Airhop, at ang mga prinsipyong hindi nagbabago sa ilalim ng presyon.",
  "home.explore.brand.title": "Brand kit",
  "home.explore.brand.desc":
    "Ang ibong pixel, mga token ng kulay at tipograpiya, materyales sa press at handang teksto.",

  "home.contribute.eyebrow": "Suportahan ang proyektong ito",
  "home.contribute.title": "Malaya, at hayag.",
  "home.contribute.sub":
    "Walang mamumuhunan, walang ads, at walang bayad na bersyon. Nananatiling libre ang lahat ng tampok kahit ano pa, at pinopondohan ang gawain ng mga taong nakikinabang dito.",
  "home.contribute.contribute.chip": "Mag-ambag",
  "home.contribute.contribute.body":
    "Bigyan ng bituin ang repository, magbukas ng issue, at magpadala ng pull request. Malugod na tinatanggap ang mga ulat ng bug, mungkahing tampok at ambag na code.",
  "home.contribute.contribute.cta": "Tingnan sa GitHub",
  "home.contribute.sponsor.chip": "Mag-sponsor",
  "home.contribute.sponsor.body":
    "Kung kapaki-pakinabang sa iyo ang Airhop, malaking tulong ang isahang donasyon o paulit-ulit na sponsorship para manatiling aktibo ang pagbuo.",
  "home.contribute.sponsor.donate": "Mag-donate nang isang beses",
  "home.contribute.sponsor.github": "Mag-sponsor sa GitHub",

  "page.architecture.eyebrow": "Dokumentasyon",
  "page.architecture.title": "Arkitektura",
  "page.architecture.toc": "Sa pahinang ito",

  "page.faq.eyebrow": "Mga madalas itanong",
  "page.faq.title": "Mga madalas itanong",
  "page.faq.meta": "Mga karaniwang tanong tungkol sa Airhop.",
  "page.faq.contact":
    "Ang mga tanong na hindi nasagot dito ay puwedeng ipadala sa {email} o itanong sa pamamagitan ng pagbubukas ng talakayan sa {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Malapit na",
  "page.blogs.body":
    "Mga sulatin tungkol sa mesh networking, privacy at offline-first na software.",

  "page.brand.eyebrow": "Brand",
  "page.brand.title": "Brand Kit",
  "page.brand.meta":
    "Mga materyales at tuntunin para gamitin ang Airhop sa artikulo, listing sa store, talumpati o README. Malayang magamit bilang sanggunian at para sa press.",

  "page.legal.eyebrow": "Legal",
  "page.privacy.title": "Patakaran sa Privacy",
  "page.terms.title": "Mga Tuntunin ng Serbisyo",

  "page.notfound.title": "Hindi natagpuan ang pahina",
  "page.notfound.body": "Ang pahinang hinahanap mo ay wala o inilipat na.",

  "page.english_only": "Ang pahinang ito ay makukuha sa Ingles lamang.",

  "seo.breadcrumb.home": "Home",

  "seo.home.title": "Airhop — Pribado, offline-first na messenger",
  "seo.home.description":
    "Pribadong pagmemensahe sa pagitan ng mga device para sa iOS at Android. Walang internet, walang server, walang account. Makipag-ugnayan sa Bluetooth mesh kahit saan.",

  "seo.architecture.title": "Arkitektura — Airhop",
  "seo.architecture.description":
    "Kung paano gumagana ang Airhop mula itaas hanggang ibaba: pagkakakilanlan, pagpili ng transport, ang Bluetooth mesh, pag-encrypt, ang internet layer, Tor, offline na ecash, AI sa device, at ang anyo ng paghahatid na tugma sa bitchat.",
  "seo.architecture.breadcrumb": "Arkitektura",
  "seo.architecture.headline": "Arkitektura ng Airhop",
  "seo.architecture.summary":
    "Buong teknikal na paliwanag ng Airhop: pagkakakilanlan, mga transport, ang Bluetooth mesh, pag-encrypt, ang Nostr internet layer, Tor, ang Cashu wallet, ang AI na katulong sa device, at ang anyo ng paghahatid.",

  "seo.faq.title": "Mga Madalas Itanong — Airhop",
  "seo.faq.description":
    "Mga sagot tungkol sa pagmemensahe sa Bluetooth mesh ng Airhop, pag-encrypt, offline na bayad, ang Nostr internet layer, at pagiging tugma sa bitchat.",
  "seo.faq.breadcrumb": "Mga madalas itanong",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description":
    "Mga sulatin tungkol sa mesh networking, privacy at offline-first na software.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Brand Kit — Airhop",
  "seo.brand.description":
    "Ang brand kit ng Airhop: ang ibong pixel, ang wordmark, mga token ng kulay at tipograpiya, materyales sa press at handang teksto.",
  "seo.brand.breadcrumb": "Brand Kit",

  "seo.privacy.title": "Patakaran sa Privacy — Airhop",
  "seo.privacy.description":
    "Paano hinahawakan ng Airhop ang datos: walang account, walang server, walang pagsubaybay. Nananatili sa iyong device ang iyong pagkakakilanlan at mga mensahe.",
  "seo.privacy.breadcrumb": "Patakaran sa Privacy",

  "seo.terms.title": "Mga Tuntunin ng Serbisyo — Airhop",
  "seo.terms.description": "Ang mga tuntuning namamahala sa paggamit ng app at website ng Airhop.",
  "seo.terms.breadcrumb": "Mga Tuntunin ng Serbisyo",

  "seo.notfound.title": "Hindi Natagpuan ang Pahina — Airhop",
  "seo.notfound.description": "Ang pahinang hinahanap mo ay wala o inilipat na.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} relay",
    other: "{count} relay",
  },
  "home.map.locations": {
    one: "{count} lokasyon",
    other: "{count} lokasyon",
  },
};

export const locale: Locale = { strings, plurals };
