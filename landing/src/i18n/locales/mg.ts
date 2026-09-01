import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Hiverina any an-tokonana",
  "common.last_updated": "Nohavaozina farany: {date}",

  "nav.aria": "Fototra",
  "nav.home": "Tokonan'ny Airhop",
  "nav.skip": "Mankany amin'ny votoaty",
  "nav.menu.open": "Sokafy ny lisitra",
  "nav.menu.close": "Akatony ny lisitra",
  "nav.how_it_works": "Ny fomba fiasany",
  "nav.architecture": "Rafitra",
  "nav.faq": "Fanontaniana matetika",

  "footer.aria": "Faran'ny pejy",
  "footer.tagline": "Fifandraisana manokana amin'ny harato",
  "footer.credit": "© Namboarin'i {author} tamin'ny {heart}",
  "footer.group.download": "Alaivo",
  "footer.group.resources": "Loharano",
  "footer.group.social": "Sosialy",
  "footer.group.legal": "Ara-dalàna",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Rafitra",
  "footer.link.blogs": "Bilaogy",
  "footer.link.faq": "Fanontaniana matetika",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Fepetra fampiasana",
  "footer.link.privacy": "Politikan'ny fiainana manokana",
  "footer.link.license": "Fahazoan-dalan'ny tetikasa",

  "settings.theme.group": "Lokon'ny endrika",
  "settings.theme.light": "Endrika mazava",
  "settings.theme.dark": "Endrika maizina",
  "settings.language.label": "Fiteny",
  "settings.language.suggestion": "Jereo amin'ny teny malagasy ity pejy ity",
  "settings.language.dismiss": "Esory",

  "home.hero.release": "Famoahana farany",
  "home.hero.title": "Hafatra mandeha tsy misy Internet.",
  "home.hero.body":
    "Miforona harato Bluetooth ny findy akaiky ary mampita ny hafatrao hatramin'ny dingana fito, voafono tanteraka. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Tsy misy mpizara",
  "home.hero.body.no_accounts": "tsy misy kaonty",
  "home.hero.body.no_tracking": "tsy misy fanarahan-dia",
  "home.hero.download": "Alaivo ny rindranasa",
  "home.hero.badges":
    "Fahazoan-dalana MIT · Maimaim-poana sy misokatra · Mifanaraka amin'ny bitchat",
  "home.hero.group.mobile": "Finday",
  "home.hero.group.desktop": "Solosaina",
  "home.hero.option.f_droid": "Katalaogin'ny loharano misokatra",
  "home.hero.option.apk": "Fakana mivantana",
  "home.hero.option.soon": "Ho avy tsy ho ela",

  "home.about.eyebrow": "Inona ny Airhop",
  "home.about.title": "Ny ankamaroan'ny rindranasa dia miankina amin'ny mpizara afovoany.",
  "home.about.sub":
    "Azo tsikilovina, akatona na sakanana ny mpizara iray. Tsy manana izany ny Airhop, ka tsy misy orinasa hotereny ary tsy misy serivisy hakatona.",
  "home.about.card": "Topi-maso ara-teknika",
  "home.about.link.mesh": "harato Bluetooth Low Energy",
  "home.about.link.wire_protocol": "fitsipiky ny fampitana",
  "home.about.body.built":
    "Rindranasa misokatra ho an'ny iOS sy Android ny Airhop, natao ho an'ny hafatra manokana teboka mankamin'ny teboka amin'ny {mesh}. Naorina ambonin'ny fototry ny {bitchat} izy, mampiasa indray ny {wire_protocol} sy ny lamina fiarovany, avy eo manitatra izany amin'ny fandoavam-bola {ecash} tsy misy Internet sy ny AI tsy misy Internet. Mandeha tsy misy Internet mihitsy izy, ary mifampita ho azy amin'ny fitaovana akaiky ny hafatra (10 ka hatramin'ny 30 metatra eo ho eo isaky ny dingana ao anaty trano, lavitra kokoa any ivelany), hatramin'ny dingana 7.",
  "home.about.body.identity":
    "Mpiara-dakile {ed25519} noforonina teo amin'ny fitaovanao ary tehirizina ao amin'ny {ios_keychain} na {android_keystore} no maha-ianao anao. Tsy misy kaonty, tsy misy fisoratana anarana, ary tsy misy mikasika mpizara na dia iray aza, ka azo ampiasaina ho rindranasa vonjimaika tsy mamela na inona na inona mitondra any aminao rehefa voafafa.",
  "home.about.body.crypto":
    "Mampiasa ny fitsipika {noise} ho an'ny fifampifankahafantarana voamarina ny fivoriana tsirairay. Ny hafatra voatahiry dia mampiasa ny algoritma {ratchet}, ka na dia lasan'olona aza ny fitaovanao any aoriana, dia mijanona tsy voavaky ny hafatrao taloha. Mandrava ny lakile sy ny hafatra rehetra latsaky ny segondra iray ny famafana maika.",
  "home.about.body.internet":
    "Rehefa lavitra ny fetran'ny Bluetooth ianao sy ny fifandraisanao, dia manjary tetezana amin'ny Internet ny mpanelanelana {nostr}, mampiasa hafatra mivantana voafono araka ny endrika {nip17}, ka miitatra manerantany ny harato rehefa samy an-tserasera ianareo. Misy ny fanohanana ny {tor} amin'ny iOS sy Android, amin'ny {arti}.",
  "home.about.optional.title": "Manana fiasa safidy azonao alefa ny Airhop:",
  "home.about.optional.payments.label": "Fandoavam-bola tsy misy Internet:",
  "home.about.optional.payments.body":
    "Mandefa sy mandray fandoavam-bola amin'ny harato amin'ny fitsipika {cashu} (Bitcoin ihany).",
  "home.about.optional.ai.label": "AI tsy misy Internet:",
  "home.about.optional.ai.body":
    "Mpanampy AI kely eo amin'ny fitaovana afaka mamaly fanontaniana manan-danja. Mijanona eo amin'ny fitaovanao ny fikarakarana sy ny angona rehetra.",
  "home.about.body.compatible":
    "Mifanaraka amin'ny bitchat eo amin'ny fampitana ny Airhop. Ny fitaovana misy Airhop sy ny misy bitchat eo amin'ny harato iray dia mifankahita ho azy ary afaka mifanakalo hafatra sy hafatra mivantana tsy mila fandrindrana.",

  "home.situations.eyebrow": "Rehefa ilainao",
  "home.situations.title": "Ho an'ny andro hidonan'ny tambajotra.",
  "home.situations.sub":
    "Loza voajanahary, fahatapahan'ny Internet, fihetsiketsehana be, na faran'ny herinandro tsotra lavitra ny fetra.",
  "home.situations.disaster.label": "Loza",
  "home.situations.disaster.line":
    "Rava ny tilikambo. Ny filazana eo amin'ny takelaka dia tonga amin'izay mandalo.",
  "home.situations.offgrid.label": "Ivelan'ny tambajotra",
  "home.situations.offgrid.line":
    "Roa andro tao anaty lalana. Lasa omaly ny sombin-tsignaly farany.",
  "home.situations.protest.label": "Fihetsiketsehana",
  "home.situations.protest.line":
    "Kaody QR eo amin'ny taratasy no manokatra fantsona voafono ho an'ny diabe.",
  "home.situations.festival.label": "Fetibe",
  "home.situations.festival.line":
    "Tsy misy famantarana eo an-toerana. Mitsambikina amin'ny findin'ny olon-tsy fantatra ny hafatra.",

  "home.showcase.eyebrow": "Jereo ny rindranasa",
  "home.showcase.title": "Mpitondra hafatra mahazatra, tsy misy Internet.",
  "home.showcase.sub":
    "Resaka, fantsona, kitapom-bola ary maha-izy azy. Mahazatra eo ambony, misy harato eo ambany manao ny asa.",
  "home.showcase.mesh.title": "Harato",
  "home.showcase.mesh.caption":
    "Ny rehetra ao anatin'ny fetra, apetraka arakaraka ny hakaikiny. Tsy misy mila ampiana aloha.",
  "home.showcase.mesh.alt":
    "Ny efijery Harato amin'ny rindranasa Airhop, mampiseho teboka akaiky efatra alahatra amin'ny radara arakaraka ny herin'ny famantarana.",
  "home.showcase.chats.title": "Resaka",
  "home.showcase.chats.caption":
    "Resaka mahazatra. Tsy afaka manokatra azy ny findy mampita ny hafatra tsirairay.",
  "home.showcase.chats.alt":
    "Resaka mivantana ao amin'ny Airhop mandritra ny fahatapahan'ny herinaratra, nampitaina tamin'ny findy telo.",
  "home.showcase.channels.title": "Fantsona",
  "home.showcase.channels.caption":
    "Efi-trano ho an'ny daholobe kely toy ny bloka iray na lehibe toy ny faritra iray, misokatra ho an'izay ao.",
  "home.showcase.channels.alt":
    "Ny efijery Resaka amin'ny rindranasa Airhop, mitanisa fantsona ho an'ny daholobe ho an'ny bloka, fokontany, tanàna ary faritra.",
  "home.showcase.wallet.title": "Kitapom-bola",
  "home.showcase.wallet.caption":
    "Atolory amin'ny olona eo akaikinao ny ecash amin'ny Bluetooth, tsy misy findy an-tserasera akory.",
  "home.showcase.wallet.alt":
    "Ny efijery kitapom-bola amin'ny rindranasa Airhop, mampiseho vola ecash azo alefa amin'ny Bluetooth.",
  "home.showcase.identity.title": "Maha-izy azy",
  "home.showcase.identity.caption":
    "Tsy misy fisoratana anarana, tsy misy laharana finday, tsy misy mailaka. Lakile tsy mivoaka ity findy ity ihany.",
  "home.showcase.identity.alt":
    "Ny efijery mombamomba amin'ny rindranasa Airhop, mampiseho maha-izy azy noforonina teo amin'ny fitaovana tsy misy kaonty.",

  "home.how.eyebrow": "Ny fomba fiasany",
  "home.how.title": "Miforona ho azy ny harato.",
  "home.how.sub":
    "Ny teboka akaiky dia mamorona harato mamboatra ny tenany amin'ny Bluetooth. Rehefa misy Internet, dia manitatra azy ny mpanelanelana Nostr, tsy misy fotodrafitrasa fehezin'olona.",
  "home.how.cta": "Vakio ny rafitra feno",
  "home.how.discover.title": "Mahita",
  "home.how.discover.line":
    "Mifankahita ho azy amin'ny Bluetooth ny findy mampandeha Airhop na bitchat. Tsy misy fampifandraisana, tsy misy fandrindrana.",
  "home.how.relay.title": "Mampita",
  "home.how.relay.line":
    "Mitsambikina findy mankamin'ny findy ny hafatra, hatramin'ny dingana fito. Tsy mahita izay entiny mihitsy ny findy eo anelanelany.",
  "home.how.reach.title": "Mahatratra lavitra kokoa",
  "home.how.reach.line":
    "Rehefa misy Internet, dia entin'ny mpanelanelana Nostr lavitra kokoa io resaka io, azo alefa amin'ny Tor raha tiana.",
  "home.how.swipe": "sivano mba hijery",
  "home.how.diagram": "Harato BLE · tambajotra teboka mankamin'ny teboka eo an-toerana",
  "home.how.legend.node": "Teboka harato BLE (tsy misy Internet)",
  "home.how.legend.relay": "Fampitana dingana maro (voafono amin'ny Noise XX)",
  "home.how.legend.bitchat": "Mifanaraka amin'ny bitchat eo amin'ny harato iray",
  "home.how.legend.nostr": "Tetezana Nostr (Internet, rehefa an-tserasera)",

  "home.map.aria": "Sarintanin'izao tontolo izao ny toeran'ny mpanelanelana Nostr",
  "home.map.summary": "Tetezana Nostr · {relays} manerana ny {locations} manerantany",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Izay ataony",
  "home.features.title": "Mpitondra hafatra tena izy, fa tsy fanehoana.",
  "home.features.sub":
    "Resaka, maha-izy azy, tambajotra ary vola. Namboarina hiasa tsy misy famantarana, tsy misy kaonty ary tsy misy na inona na inona eo afovoany.",

  "home.features.messaging.title": "Hafatra",
  "home.features.messaging.summary":
    "Izay rehetra ananan'ny mpitondra hafatra, tsy misy fotodrafitrasa ao ambadika.",
  "home.features.messaging.dms.name": "Hafatra mivantana manokana",
  "home.features.messaging.dms.line":
    "Voafono tanteraka, miaraka amin'ny fanamarinana fanaterana sy famakiana.",
  "home.features.messaging.location.name": "Fantsonan-toerana",
  "home.features.messaging.location.line":
    "Efi-trano mifamatotra amin'ny toerana, hatramin'ny bloka ka hatramin'ny faritra.",
  "home.features.messaging.groups.name": "Fantsona sy vondrona manokana",
  "home.features.messaging.groups.line":
    "Rohy fanasana ho an'ny efitrano, na lisitra voasonia hatramin'ny 16.",
  "home.features.messaging.board.name": "Takelaka filazana",
  "home.features.messaging.board.line": "Filazana mipetaka amin'ny faritra hatramin'ny fito andro.",
  "home.features.messaging.voice.name": "Feo mivantana",
  "home.features.messaging.voice.line":
    "Tazony ny mikrô ary miresaha amin'izay ao anatin'ny fetra, toy ny radiô.",
  "home.features.messaging.notes.name": "Naoty feo",
  "home.features.messaging.notes.line":
    "Feo voarakitra, haingana kokoa noho ny manoratra toromarika.",
  "home.features.messaging.files.name": "Sary, horonan-tsary ary rakitra",
  "home.features.messaging.files.line": "Endrika rehetra, hatramin'ny 1 MiB, tsy mila famantarana.",
  "home.features.messaging.forward.name": "Tehirizo ary ampitao",
  "home.features.messaging.forward.line":
    "Voaisy tombo-kase ary entin'ny findy akaiky mandra-pahatongany aminy.",

  "home.features.identity.title": "Maha-izy azy",
  "home.features.identity.summary": "Tsy misy hisoratana anarana, tsy misy hosamborina.",
  "home.features.identity.keys.name": "Maha-izy azy amin'ny mpiara-dakile",
  "home.features.identity.keys.line":
    "Noforonina teto amin'ity findy ity, tehirizina ao amin'ny fitehirizan-dakilen'ny rafitra.",
  "home.features.identity.names.name": "Anarana azo vakiana",
  "home.features.identity.names.line": "Avy amin'ny lakilenao, ka tsy misy afaka maka ny anao.",
  "home.features.identity.qr.name": "Fifandraisana amin'ny QR",
  "home.features.identity.qr.line":
    "Fakana sary iray dia mitondra ny lakiley, fa tsy ny anarany fotsiny.",
  "home.features.identity.panic.name": "Famafana maika",
  "home.features.identity.panic.line":
    "Ravana latsaky ny segondra iray ny lakile sy ny hafatra rehetra.",

  "home.features.networking.title": "Tambajotra",
  "home.features.networking.summary": "Ny findy no tambajotra.",
  "home.features.networking.mesh.name": "Harato Bluetooth",
  "home.features.networking.mesh.line":
    "Tsy misy Internet, tsy misy router, amin'ny findy efa ananan'ny olona.",
  "home.features.networking.bridge.name": "Tetezan'ny harato",
  "home.features.networking.bridge.line":
    "Mampifandray ny resakao ho an'ny daholobe amin'ny vondrona akaiky lavitra ny fetra.",
  "home.features.networking.wifi.name": "Lalana haingana WiFi",
  "home.features.networking.wifi.line":
    "Famindrana haingana kokoa eo amin'ny Android roa na iPhone roa.",
  "home.features.networking.bitchat.name": "Mifanaraka amin'ny bitchat",
  "home.features.networking.bitchat.line":
    "Miditra amin'ny harato iray ny rindranasa roa tsy mila fandrindrana.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Fanitarana, fa tsy fepetra takiana mihitsy.",
  "home.features.internet.nostr.name": "Fialana amin'ny Nostr",
  "home.features.internet.nostr.line":
    "Manohy mikoriana lavitra ny fetran'ny radiô ny hafatra mivantana sy ny fantsonan-toerana.",
  "home.features.internet.relays.name": "Fitadiavana mpanelanelana araka ny toerana",
  "home.features.internet.relays.line":
    "Mpanelanelana ho an'ny daholobe mahaleo tena 300 mahery, tsy misy anay na dia iray aza.",
  "home.features.internet.gateway.name": "Vavahady Internet",
  "home.features.internet.gateway.line":
    "Ampindramo ny fifandraisanao mba hahatratran'ny findy akaiky tsy misy Internet ny fantsonan-toerana.",
  "home.features.internet.tor.name": "Fampidirana ny Tor",
  "home.features.internet.tor.line":
    "Entina amin'ny sehatra roa, ka tsy hitan'ny mpanelanelana mihitsy ny IP-nao.",

  "home.features.optional.title": "Safidy",
  "home.features.optional.summary": "Vonoina raha tsy voatondro. Alefa rehefa tianao.",
  "home.features.optional.cashu.name": "Ecash Cashu",
  "home.features.optional.cashu.line":
    "Aloavy ny olona eo akaikinao tsy misy findy an-tserasera akory.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Mametraha na manaisora bitcoin amin'ny tambajotra Lightning.",
  "home.features.optional.ai.name": "AI eo an-toerana",
  "home.features.optional.ai.line": "Valiny eo amin'ny fitaovana, tsy misy mivoaka ny findy.",
  "home.features.optional.social.name": "Tetezana sosialy",
  "home.features.optional.social.line": "Bluesky sy Mastodon amin'ny maha-izy azy iray ihany.",

  "home.compare.eyebrow": "Fampitahana",
  "home.compare.title": "Tsy mila Internet, tsy mila fitaovana, ary misokatra.",
  "home.compare.sub":
    "Samy tsara amin'ny zavatra iray avy ny rindranasa rehetra eto. Ny sasany ihany no mbola mandeha rehefa tsy mandeha ny tambajotra.",
  "home.compare.col.project": "Tetikasa",
  "home.compare.col.transport": "Fitaterana",
  "home.compare.col.encryption": "Fonosana",
  "home.compare.col.offline": "Mandeha tsy misy Internet",
  "home.compare.col.hardware_free": "Tsy mila fitaovana",
  "home.compare.col.open_source": "Loharano misokatra",
  "home.compare.mark.yes": "Eny",
  "home.compare.mark.no": "Tsia",
  "home.compare.mark.partial": "Ampahany, misokatra ny mpanjifa, fa tsy ny mpizara",
  "home.compare.mark.partial_hint": "Misokatra ny mpanjifa, fa tsy ny mpizara",
  "home.compare.transport.servers": "Mpizara afovoany",
  "home.compare.transport.onion": "Fitondrana tongolo (teboka serivisy)",
  "home.compare.transport.nostr": "Mpanelanelana Nostr",
  "home.compare.transport.lora": "Radiô LoRa",
  "home.compare.transport.sub_ghz": "Radiô sub-GHz manokana",

  "home.explore.eyebrow": "Misokatra sy marina",
  "home.explore.title": "Azo hamarinina avokoa ny filazana rehetra eto.",
  "home.explore.sub":
    "Ho an'ny daholobe ny kaody, ny fitsipika ary ny drafitra. Toy izany koa ny fetra. Hamarino ny tenanao alohan'ny hino ny teninay.",
  "home.explore.audit.chip": "Miandry fanaraha-maso",
  "home.explore.audit.headline":
    "Mbola tsy nandalo fanaraha-maso ara-piarovana avy any ivelany ny Airhop.",
  "home.explore.audit.body":
    "{headline} Jerena manokana ny kaody rehetra ary ampandalovina amin'ny {review} alohan'ny hamoahana azy, ary voamarin'ny Cure53 ny tranomboky kriptografika ampiasainy, saingy tsy misolo fanaraha-maso ara-dalàna ny rindranasa mihitsy izany. Misy iray voaomana ho amin'ny {version}. Aza miantehitra aminy amin'ny fampiasana saro-pady mandra-pahatongan'izany.",
  "home.explore.audit.link.review": "mpiasa fandinihana ara-piarovana",
  "home.explore.source.title": "Kaody loharano",
  "home.explore.source.desc":
    "Ny zava-drehetra ao amin'ny GitHub ambanin'ny MIT. Misokatra ny issue, ny pull request ary ny resaka.",
  "home.explore.protocol.title": "Fanoritsoritana ny fitsipika",
  "home.explore.protocol.desc":
    "Ny endrika fampitana marina, ny UUID BLE, ary ny tarehimarika raikitra, iombonana amin'ny bitchat.",
  "home.explore.architecture.title": "Rafitra",
  "home.explore.architecture.desc":
    "Ny fanazavana ara-teknika feno, hatramin'ny fanindriana alefaso ka hatramin'ny byte eo amin'ny radiô.",
  "home.explore.roadmap.title": "Drafi-dalana",
  "home.explore.roadmap.desc":
    "Tanjona isaky ny kinova, hatramin'ny v0.5.0 ka hatramin'ny v2.0.0, anisan'izany ny fanaraha-maso voaomana.",
  "home.explore.vision.title": "Fahitana",
  "home.explore.vision.desc":
    "Ny antony misian'ny Airhop, sy ny fitsipika tsy miova na dia misy tsindry aza.",
  "home.explore.brand.title": "Fitaovan'ny marika",
  "home.explore.brand.desc":
    "Ny vorona pixel, ny loko sy ny endri-tsoratra, ny fitaovana ho an'ny gazety ary ny lahatsoratra fototra.",

  "home.contribute.eyebrow": "Tohano ity tetikasa ity",
  "home.contribute.title": "Mahaleo tena, ary am-pahibemaso.",
  "home.contribute.sub":
    "Tsy misy mpampiasa vola, tsy misy dokambarotra, ary tsy misy karazana andoavam-bola. Maimaim-poana foana ny fiasa rehetra, ary vatsian'ny olona mahita azy ho mahasoa ny asa.",
  "home.contribute.contribute.chip": "Mandray anjara",
  "home.contribute.contribute.body":
    "Omeo kintana ny tahiry, sokafy ny issue, ary alefaso ny pull request. Raisina an-tanan-droa ny tatitra diso, ny soso-kevitra momba ny fiasa, ary ny fandraisana anjara amin'ny kaody.",
  "home.contribute.contribute.cta": "Jereo ao amin'ny GitHub",
  "home.contribute.sponsor.chip": "Manohana",
  "home.contribute.sponsor.body":
    "Raha mahasoa anao ny Airhop, dia manampy be amin'ny fitazonana ny fampandrosoana ho velona ny fanomezana indray mandeha na ny fanohanana mitohy.",
  "home.contribute.sponsor.donate": "Manomeza indray mandeha",
  "home.contribute.sponsor.github": "Manohana ao amin'ny GitHub",

  "page.architecture.eyebrow": "Antontan-taratasy",
  "page.architecture.title": "Rafitra",
  "page.architecture.toc": "Amin'ity pejy ity",

  "page.faq.eyebrow": "Fanontaniana matetika",
  "page.faq.title": "Fanontaniana apetraka matetika",
  "page.faq.meta": "Fanontaniana mahazatra momba ny Airhop.",
  "page.faq.contact":
    "Ny fanontaniana tsy voavaly eto dia azo alefa any amin'ny {email} na apetraka amin'ny fanokafana resaka ao amin'ny {github}.",

  "page.blogs.eyebrow": "Bilaogy",
  "page.blogs.title": "Ho avy tsy ho ela",
  "page.blogs.body":
    "Lahatsoratra momba ny tambajotra harato, ny fiainana manokana, ary ny rindrambaiko tsy mila Internet.",

  "page.brand.eyebrow": "Marika",
  "page.brand.title": "Fitaovan'ny marika",
  "page.brand.meta":
    "Fitaovana sy fitsipika hametrahana ny Airhop ao anaty lahatsoratra, pejin-tsehatra, kabary na README. Malalaka ampiasaina ho fanovozana sy ho an'ny gazety.",

  "page.legal.eyebrow": "Ara-dalàna",
  "page.privacy.title": "Politikan'ny fiainana manokana",
  "page.terms.title": "Fepetra fampiasana",

  "page.notfound.title": "Tsy hita ny pejy",
  "page.notfound.body": "Tsy misy na nafindra toerana ny pejy tadiavinao.",

  "page.english_only": "Amin'ny teny anglisy ihany no misy ity pejy ity.",

  "seo.breadcrumb.home": "Tokonana",

  "seo.home.title": "Airhop — Mpitondra hafatra manokana, tsy mila Internet",
  "seo.home.description":
    "Hafatra manokana teboka mankamin'ny teboka ho an'ny iOS sy Android. Tsy misy Internet, tsy misy mpizara, tsy misy kaonty. Mifandraisa amin'ny harato Bluetooth na aiza na aiza.",

  "seo.architecture.title": "Rafitra — Airhop",
  "seo.architecture.description":
    "Ny fomba fiasan'ny Airhop, hatrany ambony ka hatrany ambany: maha-izy azy, safidin'ny fitaterana, ny harato Bluetooth, ny fonosana, ny sosona Internet, ny Tor, ny ecash tsy mila Internet, ny AI eo amin'ny fitaovana, ary ny endrika fampitana mifanaraka amin'ny bitchat.",
  "seo.architecture.breadcrumb": "Rafitra",
  "seo.architecture.headline": "Rafitry ny Airhop",
  "seo.architecture.summary":
    "Fanazavana ara-teknika feno momba ny Airhop: maha-izy azy, fitaterana, ny harato Bluetooth, ny fonosana, ny sosona Internet Nostr, ny Tor, ny kitapom-bola Cashu, ny mpanampy AI eo amin'ny fitaovana, ary ny endrika fampitana.",

  "seo.faq.title": "Fanontaniana apetraka matetika — Airhop",
  "seo.faq.description":
    "Valiny momba ny hafatra amin'ny harato Bluetooth-n'ny Airhop, ny fonosana, ny fandoavam-bola tsy mila Internet, ny sosona Internet Nostr, ary ny fifanarahana amin'ny bitchat.",
  "seo.faq.breadcrumb": "Fanontaniana matetika",

  "seo.blogs.title": "Bilaogy — Airhop",
  "seo.blogs.description":
    "Lahatsoratra momba ny tambajotra harato, ny fiainana manokana, ary ny rindrambaiko tsy mila Internet.",
  "seo.blogs.breadcrumb": "Bilaogy",

  "seo.brand.title": "Fitaovan'ny marika — Airhop",
  "seo.brand.description":
    "Ny fitaovan'ny marika Airhop: ny marika vorona pixel, ny soratra marika, ny loko sy ny endri-tsoratra, ny fitaovana ho an'ny gazety ary ny lahatsoratra fototra.",
  "seo.brand.breadcrumb": "Fitaovan'ny marika",

  "seo.privacy.title": "Politikan'ny fiainana manokana — Airhop",
  "seo.privacy.description":
    "Ny fomba fikirakiran'ny Airhop ny angona: tsy misy kaonty, tsy misy mpizara, tsy misy fanarahan-dia. Mijanona eo amin'ny fitaovanao ny maha-ianao anao sy ny hafatrao.",
  "seo.privacy.breadcrumb": "Politikan'ny fiainana manokana",

  "seo.terms.title": "Fepetra fampiasana — Airhop",
  "seo.terms.description":
    "Fepetra mifehy ny fampiasana ny rindranasa sy ny tranonkalan'ny Airhop.",
  "seo.terms.breadcrumb": "Fepetra fampiasana",

  "seo.notfound.title": "Tsy hita ny pejy — Airhop",
  "seo.notfound.description": "Tsy misy na nafindra toerana ny pejy tadiavinao.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "mpanelanelana {count}",
    other: "mpanelanelana {count}",
  },
  "home.map.locations": {
    one: "toerana {count}",
    other: "toerana {count}",
  },
};

export const locale: Locale = { strings, plurals };
