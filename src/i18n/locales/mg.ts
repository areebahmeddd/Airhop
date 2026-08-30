// mg: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Foano",
  "common.done": "Vita",
  "common.ok": "Eny",
  "common.close": "Akatony",
  "common.back": "Miverina",
  "common.delete": "Fafao",
  "common.remove": "Esory",
  "common.add": "Ampio",
  "common.copy": "Adikao",
  "common.copied": "Voadika",
  "common.share": "Zarao",
  "common.continue": "Tohizo",
  "common.try_again": "Andramo indray",
  "common.settings": "Fandrindrana",
  "common.off": "Vonoina",

  // ---- Dates ----
  "format.today": "Androany",
  "format.yesterday": "Omaly",
  "format.minutes_ago": "{count} min lasa",
  "format.hours_ago": "{count} ora lasa",
  "format.days_ago": "{count} andro lasa",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Resaka",
  "nav.tab.mesh": "Harato",
  "nav.tab.wallet": "Kitapom-bola",
  "nav.tab.profile": "Ianao",
  "a11y.tab.new_peers": "{label}, misy olona vaovao akaiky",
  "nav.notifications": "Fampandrenesana",
  "chat.subtab.channels": "Fantsona",
  "chat.subtab.direct": "Mivantana",
  "chat.subtab.dms": "Hafatra mivantana",
  "chat.search.placeholder": "Karohy ao amin'ny resaka…",
  "chat.search.a11y": "Karohy ao amin'ny resaka sy ny hafatra",
  "chat.search.close": "Akatony ny fikarohana",
  "chat.search.clear": "Fafao ny fikarohana",
  "mesh.view.radar": "Fijery radara",
  "mesh.view.list": "Fijery lisitra",
  "mesh.view.radar_short": "Radara",
  "mesh.view.list_short": "Lisitra",

  // ---- Legal document names ----
  "legal.last_updated": "Fanavaozana farany: {date}",
  "legal.terms": "Fepetra fampiasana",
  "legal.privacy": "Politikan'ny fiainana manokana",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Fifandraisana manokana amin'ny harato",
  "onboarding.welcome.cta": "Manomboha",
  "onboarding.welcome.cta_hint": "Ekeo ny fepetra etsy ambany mba hanohizana",
  "onboarding.welcome.consent_a11y":
    "Ekeo ny Fepetra fampiasana sy ny Politikan'ny fiainana manokana",
  "onboarding.welcome.open_terms": "Sokafy ny Fepetra fampiasana",
  "onboarding.welcome.open_privacy": "Sokafy ny Politikan'ny fiainana manokana",
  "onboarding.welcome.consent":
    "Rehefa mitsindry {cta} ianao dia manaiky ny {terms} sy ny {privacy} anay.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Amboarina ny maha-ianao anao",
  "onboarding.identity.body":
    "Mamorona lakile Ed25519 roa eto amin'ity fitaovana ity.\nTsy misy alefa na aiza na aiza.",
  "onboarding.identity.failed_heading": "Tsy voaforona ny lakilenao",
  "onboarding.identity.failed_body":
    "Tsy navelan'ity fitaovana ity hitahiry azy ireo am-pilaminana ny Airhop. Andramo indray, na avereno alefa ny findainao ary sokafy indray ny Airhop.",
  "onboarding.identity.steps_a11y": "Dingana: {steps}",
  "onboarding.identity.step.x25519": "Mamorona lakile X25519 raikitra roa",
  "onboarding.identity.step.ed25519": "Mamorona lakile sonia Ed25519 roa",
  "onboarding.identity.step.keychain":
    "Mitahiry ny lakile ao amin'ny fitehirizan-dakilen'ny rafitra",
  "onboarding.identity.step.peer_id": "Mamorona ny ID-n'ny teboka",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Ny anaranao eo amin'ny harato",
  "onboarding.username.peer_id": "ID-n'ny teboka",
  "onboarding.username.card_a11y":
    "Ny anaranao eo amin'ny harato dia {username}. ID-n'ny teboka {peerID}. {props}.",
  "onboarding.username.explanation":
    "Avy amin'ny lakilenao ho an'ny daholobe no niavian'ity anaram-pikambana ity, amin'ny fomba mazava tsy miova. Mitovy izy amin'ny fitaovana rehetra mahita ny ID-n'ny tebokanao.",
  "onboarding.username.cta": "Midira ao amin'ny Airhop",
  "onboarding.username.prop.algorithm": "Algoritma",
  "onboarding.username.prop.storage": "Fitahirizana",
  "onboarding.username.prop.storage_value":
    "Ny fitehirizan-dakilen'ny rafitra ihany",
  "onboarding.username.prop.account": "Mila kaonty",
  "onboarding.username.prop.account_value": "Tsia",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Tongasoa eto amin'ny Airhop",
  "onboarding.hello.p1":
    "Salama. Naorina ambonin'ny bitchat ny Airhop, ho tetikasa an-tsehatra mahaleo tena sy misokatra. Tsy mifandray amin'ny tetikasa bitchat na ny permissionless tech izy ary tsy notohanan'izy ireo, zavatra tiako amboarina sy zaraina amin'ny fiaraha-monina fotsiny.",
  "onboarding.hello.p2":
    "Ity no famoahana voalohany ho an'ny iOS sy Android, ka na dia nozahako niaraka tamin'ny namana aza izy, mety hisy diso hitanao. Raha misy, na raha manana hevitra momba ny fiasa ianao, dia faly hihaino aho. Manokafa issue ao amin'ny {github} na manorata amiko ao amin'ny {email}.",
  "onboarding.hello.p3":
    "Raha mahasoa anao ny Airhop, dia diniho ny hametraka kintana ao amin'ny {github} na hanoratra hevitra ao amin'ny {store}. Manampy olona bebe kokoa hahita ny tetikasa izany. Misaotra nanandrana!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Alohan'ny hanontanian'ny findainao",
  "onboarding.primer.lede": "Ireto ny ataon'ny tsirairay, sy ny tsy ataony.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Mahita ny fitaovana akaiky ary mampita hafatra eo amin'izy ireo. Izay no mamorona ny harato, ary miasa tsy misy fifandraisana Internet.",
  "onboarding.primer.location.title": "Toerana",
  "onboarding.primer.location.body":
    "Mametraka anao ao amin'ny fantsonan'ny faritra akaiky, manomboka amin'ny bokotany ka hatramin'ny faritra. Tsy manaraka anao mihitsy ny Airhop ary tsy mandefa ny toeranao marina mivoaka ny fitaovanao.",
  "onboarding.primer.notifications.title": "Fampandrenesana",
  "onboarding.primer.notifications.body":
    "Mandraisa fampandrenesana momba ny hafatra vaovao na dia mihidy aza ny rindranasa. Amboarina eo amin'ny fitaovanao ny fampandrenesana, tsy misy mpizara mandray anjara.",
  "onboarding.primer.footnote":
    "Afaka mandà ianao. Mbola mandeha amin'ny Internet ihany ny hafatra, ary afaka manova hevitra any aoriana ao amin'ny Fandrindrana ianao.",
  "onboarding.primer.cta_a11y": "Tohizo mankany amin'ny fangatahana alalana",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Fidirana amin'ny Bluetooth",
  "permission.bluetooth.purpose":
    "hahita ny fitaovana akaiky eo amin'ny harato",
  "permission.open_settings": "Sokafy ny Fandrindrana",
  "permission.not_now": "Tsia aloha",
  "permission.blocked_title": "Vonoina ny {label}",
  "permission.blocked_body": "Alefaso ao amin'ny Fandrindrana mba {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Nisy tsy nety",
  "error.boundary.body":
    "Nahita olana tsy nampoizina ny Airhop ka voatery nampijanona izay nasehony.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Fantsona mahazatra",
  "chat.channels.yours": "Ny fantsonanao",
  "chat.channels.none": "Mbola tsy misy fantsona",
  "chat.channels.none_hint":
    "Tsindrio ny {plus} eo ambony mba hiditra na hamorona iray.",
  "chat.channels.none_desc":
    "Mbola tsy misy fantsona. Ampiasao ny bokotra fanampiana eo amin'ny lohateny mba hiditra na hamorona iray.",
  "chat.channels.show_fewer": "Asehoy fantsona mahazatra vitsy kokoa",
  "chat.channels.show_less": "Asehoy vitsy kokoa",
  "chat.channels.info": "Mombamomba ny fantsona",
  "chat.channels.pin": "Apetaho ny fantsona",
  "chat.channels.unpin": "Esory ny fametahana",
  "chat.channels.mute": "Ampanginy ny fantsona",
  "chat.channels.unmute": "Avereno ny feon'ny fantsona",
  "chat.channels.leave": "Ialao ny fantsona",
  "chat.channels.leave_confirm": "Ialao",
  "chat.channels.clear_body":
    "Hofafana ny hafatra rehetra ao amin'ny {name}? Tsy azo averina intsony izany.",
  "chat.channels.leave_body":
    "Hialana amin'ny {name}? Tsy handray ny hafatrany intsony ianao, ary hesorina amin'ity fitaovana ity ny tantarany.",
  "chat.channels.more_options": "Safidy fanampiny ho an'ny {name}",
  "chat.channels.teleported_tag": "{level}  ·  avy lavitra",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Fafao ny resaka",
  "chat.dm.remove_contact": "Esory ny fifandraisana",
  "chat.dm.block": "Sakano ity teboka ity",
  "chat.dm.block_confirm": "Sakano",
  "chat.dm.delete": "Fafao ny resaka",
  "chat.dm.delete_body":
    "Manaisotra ny resaka amin'ny lisitrao izany ary mamafa ny hafatrany. Mijanona ny fifandraisana, ary manomboka resaka vaovao ny hafatra vaovao avy aminy.",
  "chat.dm.in_range": "ao anatin'ny fetra",
  "chat.dm.row_hint":
    "Tsindrio indroa ary hazony raha te hahita safidy fanampiny",
  "chat.channels.row_hint":
    "Tsindrio indroa ary hazony raha te hahita safidy fanampiny",
  "chat.dm.you_prefix": "Ianao:",
  "chat.dm.none": "Tsy misy hafatra mivantana",
  "chat.dm.none_desc":
    "Mandehana any amin'ny takelaka Harato ary tsindrio teboka iray mba hanomboka hafatra mivantana voafono.",
  "chat.dm.contact_info": "Mombamomba ny fifandraisana",
  "chat.dm.pin": "Apetaho ny resaka",
  "chat.dm.unpin": "Esory ny fametahana",
  "chat.dm.mute": "Ampanginy ny resaka",
  "chat.dm.unmute": "Avereno ny feon'ny resaka",
  "chat.dm.clear_body":
    "Hofafana ny hafatra rehetra amin'i {name}? Tsy azo averina intsony izany.",
  "chat.dm.remove_contact_body":
    "Hesorina i {name}? Mamafa ny resaka izany ary manadino ny fifandraisana. Mbola afaka mahatratra anao izy raha manoratra indray.",
  "chat.dm.block_body":
    "Hosakanana i {name}? Tsy hahita azy amin'ny takelaka Harato ianao ary tsy handray hafatra avy aminy, na dia akaiky aza izy.",
  "chat.dm.more_options": "Safidy fanampiny ho an'ny {name}",
  "chat.dm.remove_contact_short": "Esory ny fifandraisana",
  "chat.dm.block_short": "Sakano ny fifandraisana",
  "chat.dm.delete_short": "Fafao ny resaka",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Fafao ny hafatra",
  "chat.clear_confirm": "Fafao",
  "chat.group_badge": "Vondrona",
  "chat.more": "Bebe kokoa",
  "chat.no_messages": "Mbola tsy misy hafatra",
  "chat.you": "Ianao",
  "chat.a11y.channel": "Fantsona {name}",
  "chat.a11y.group": "Vondrona {name}",
  "chat.a11y.muted": "nampanginina",
  "chat.a11y.pinned": "napetaka",

  // ---- Chats: start something new ----
  "chat.new.title": "Manomboha zavatra vaovao",
  "chat.new.channel": "Mamorona fantsona manokana",
  "chat.new.channel_label": "Fantsona manokana",
  "chat.new.channel_desc":
    "Efitrano azon'izay manana ny rohy idirana. Mamorona iray, na midira amin'ny rohy nalefa taminao.",
  "chat.new.group": "Mamorona vondrona manokana",
  "chat.new.group_label": "Vondrona manokana",
  "chat.new.group_desc":
    "Fidio ny olona tianao. Hatramin'ny 16. Mijanona amin'ny Bluetooth.",
  "chat.new.place": "Mandehana any amin'ny toerana iray amin'ny geohash",
  "chat.new.place_label": "Mandehana any amin'ny toerana iray",
  "chat.new.place_desc":
    "Sokafy ny fantsonan-toerana any amin'ny toerana rehetra amin'ny geohash-ny.",
  "chat.new.reach": "Halalin'ny fahatratrarana",
  "chat.new.reach_internet":
    "Mahatratra ny mpikambana amin'ny Bluetooth sy ny Internet.",
  "chat.new.reach_mesh":
    "Miasa ao anatin'ny fetran'ny Bluetooth, fa tsy amin'ny Internet.",
  "chat.new.reach_internet_desc":
    "Mahatratra ny mpikambana amin'ny Internet koa. Hitan'ny mpanelanelana fa mavitrika ny fantsona, fa tsy ny hafatrany na hoe iza no ao anatiny.",
  "chat.new.reach_mesh_desc":
    "Mijanona eo amin'ny harato eo an-toerana. Manokana indrindra: tsy misy mivoaka ny fetran'ny Bluetooth.",
  "chat.new.join_link":
    "Midira amin'ny fantsona manokana amin'ny rohy fanasana",
  "chat.new.back_to_chooser": "Miverina amin'ny safidy",
  "chat.new.create_channel": "Mamorona fantsona",
  "chat.new.name_required": "Soraty aloha ny anaran'ny fantsona",
  "chat.new.name_taken": "Efa misy nalaina io anarana io",
  "chat.new.create": "Mamorona",
  "chat.new.e2ee":
    "Voafono tanteraka. Ny mpikambana ihany no mahavaky ny hafatra.",
  "chat.new.invite_only":
    "Amin'ny fanasana ihany. Izay hizaranao ny rohy dia afaka miditra. Mijanona miafina amin'ny hafa rehetra izy, na dia amin'ny teboka akaiky aza.",
  "chat.new.name_exists": "Efa misy fantsona mitondra ity anarana ity.",
  "chat.new.reach_bluetooth_chip": "Bluetooth ihany",
  "chat.new.reach_internet_chip": "Bluetooth + Internet",
  "chat.new.have_link": "Midira amin'ny rohy fanasana",

  // ---- Chats: join by link ----
  "chat.join.title": "Midira amin'ny rohy",
  "chat.join.not_airhop": "Tsy rohy Airhop io.",
  "chat.join.reach_internet":
    "Mahatratra ny mpikambana amin'ny Bluetooth sy ny Internet.",
  "chat.join.reach_mesh": "Mijanona ao anatin'ny fetran'ny Bluetooth.",
  "chat.join.contact_card":
    "Karatra fifandraisana. Manampy azy ao amin'ny fifandraisanao ary manokatra ny resaka.",
  "chat.join.unverified": "Tsy voamarina io rohy io",
  "chat.join.unverified_body":
    "Tsy mifanaraka amin'ny lakilen'ny tenany ny karatra fifandraisana, ka tsy nampiana. Angataho izy handefa iray vaovao.",
  "chat.join.paste": "Apetaho avy amin'ny takelaka fitehirizana",
  "chat.join.join": "Midira",
  "chat.join.public_channel":
    "Fantsona ho an'ny daholobe {name}. Vakin'izay akaiky rehetra.",
  "chat.join.private_channel": "Fantsona manokana {name}. {reach}",
  "chat.join.dm_with": "Hafatra mivantana amin'i {name}.",
  "chat.join.joined_as": "Niditra ho {name}",
  "chat.join.name_clash_body":
    "Efa ao amin'ny {name} hafa ianao. Marika fotsiny ny anaran'ny fantsona, ka nanokatra ny fantsonany manokana ity fanasana ity, ary tsy voakasika ilay nisy anao. Azonao ovaina anarana izy roa avy amin'ny mombamomba ny fantsona.",
  "chat.join.paste_hint":
    "Apetaho ny fanasana manomboka amin'ny airhop://. Mety koa ny fitsindriana rohy; ity dia ho an'ny rohy tsy azo tsindriana.",
  "chat.join.key_note":
    "Mitondra ny lakile ny fanasana amin'ny fantsona manokana, ka avy hatrany ny fidirana ary tsy misy angatahina amin'olona.",
  "chat.join.offline_note":
    "Miasa tsy misy Internet. Vakiana eto amin'ity fitaovana ity ny rohy, ary mahatratra araka izay nametrahan'ny mpamorona azy ny fantsona.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Tsy voasokatra io efitra io. Andramo indray afaka kelikely.",
  "chat.jump.title": "Mandehana any amin'ny toerana iray",
  "chat.jump.saved": "TOERANA VOATAHIRY",
  "chat.jump.anywhere":
    "Sokafy ny fantsonan-toerana ho an'ny daholobe any amin'ny toerana rehetra, na dia toerana tsy misy anao aza.",
  "chat.jump.geohash_note":
    "Soraty ny geohash-ny. Izay rehetra misy toerana mianjera ao anatin'io efitra io dia mizara io fantsona io.",
  "chat.jump.teleport_note":
    "Miseho ho avy lavitra ianao, fa tsy akaiky. Amin'ny Internet ihany no ahatratrarany.",
  "chat.jump.level_cell": "Efitra {level}",
  "chat.jump.already_here":
    "Efa eto ianao. Manokatra ny fantsonanao {name} ny Mandehana.",
  "chat.jump.open_direction": "Sokafy ny efitra {direction}",
  "chat.jump.open_place": "Sokafy ny {name}",
  "chat.jump.remove_place": "Esory ny {name} amin'ny toerana voatahiry",
  "chat.jump.go": "Mandehana",
  "chat.jump.how":
    "Mba hahitana geohash: sokafy fantsonan-toerana > tsindrio ny anarany > adikao avy ao.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Tsy tratra ny mpikambana rehetra. Andramo indray rehefa akaiky izy ireo.",
  "chat.group.you_were_added": "Nampidirina tao amin'ny {name} ianao.",
  "chat.group.added_you": "Nampiditra anao tao amin'ny {name}",
  "chat.group.you_were_removed":
    "Nesorina tao amin'ny {name} ianao. Tsy afaka mamaky na mandefa hafatra eto intsony ianao.",
  "chat.group.removed_you": "Nanaisotra anao tao amin'ny {name}",
  "chat.group.add_failed": "Tsy voampiditra izy",
  "chat.group.add_failed_body":
    "Tsy nisy niova. Na tsy tratra izy amin'izao fotoana izao, na feno 16 ny vondrona, na tsy ianao no namorona azy.",
  "chat.group.remove_failed": "Tsy voaesotra izy",
  "chat.group.remove_failed_body":
    "Tsy nisy niova. Ny olona namorona ny vondrona ihany no afaka manova hoe iza no ao anatiny.",
  "chat.group.e2ee":
    "Voafono tanteraka. Ny mpikambana ihany no mahavaky ny hafatra.",
  "chat.group.cap":
    "Hatramin'ny olona 16, ianao no mifidy. Tsy misy rohy fanasana, ka tsy misy miditra noho ny rohy nalefan'olona taminy.",
  "chat.group.bluetooth":
    "Bluetooth ihany. Handray ny hafatra ny mpikambana any ivelan'ny fetra rehefa tafaverina izy.",
  "chat.group.members_label": "MPIKAMBANA",
  "chat.group.none_in_range":
    "Tsy misy olona ao anatin'ny fetra. Tsy maintsy akaiky ny mpikambana rehefa mamorona ny vondrona ianao.",
  "chat.group.create_title": "Mamorona vondrona",
  "chat.group.name_placeholder": "Anaran'ny vondrona",
  "chat.group.create": "Mamorona",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Harato eo an-toerana · Bluetooth ihany",
  "chat.scope.mesh_desc":
    "Mahatratra ny fitaovana ao anatin'ny fetran'ny Bluetooth (eo amin'ny 10 ka hatramin'ny 100 metatra). Tsy mila Internet. Tsara indrindra amin'ny fandrindrana eo an-toerana.",
  "chat.scope.block": "Bokotany · ~100 m",
  "chat.scope.block_desc":
    "Fandrakofana ambaratongan'ny bokotany. Ampitaina amin'ny Internet ny hafatra mba hahafahan'ny teboka ivelan'ny fetran'ny Bluetooth nefa akaiky mandray anjara koa.",
  "chat.scope.neighborhood": "Fokontany · ~1 km",
  "chat.scope.neighborhood_desc":
    "Fandrakofana ambaratongan'ny fokontany. Amin'ny fanampian'ny mpanelanelana dia tratra ny teboka manerana ny faritra na dia tsy misy rohy Bluetooth mivantana aza.",
  "chat.scope.city": "Tanàna · ~10 km",
  "chat.scope.city_desc":
    "Fantsona manerana ny tanàna. Mampiasa mpanelanelana Internet voafantina araka ny toerana mba hahatratrarana ny teboka manerana ny renivohitra.",
  "chat.scope.province": "Faritany na fanjakana · ~100 km",
  "chat.scope.province_desc":
    "Fandrakofana ambaratongam-paritany na fanjakana. Ampitaina amin'ny Internet ho amin'ny fahatratrarana ara-paritra an-jatony kilaometatra.",
  "chat.scope.country": "Firenena na faritra · ~1000 km",
  "chat.scope.country_desc":
    "Fandrakofana manerana ny firenena. Ny mpampiasa Airhop na bitchat rehetra ao amin'ny faritra dia afaka miditra sy mamaky ny hafatra.",
  "chat.transport.bluetooth": "Bluetooth ihany",
  "chat.transport.both": "Bluetooth + Internet",
  "chat.transport.internet": "Internet ihany",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Baiko /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Mandefa famihinana mafana",
  "chat.cmd.slap_hint": "Mamely amin'ny trondro lehibe",
  "chat.status.sending": "Alefa…",
  "chat.status.undo_send": "Foano ny fandefasana",
  "chat.status.undo": "Foano",
  "chat.status.sent": "Nalefa",
  "chat.status.received": "Voaray",
  "chat.status.failed": "Tsy nahomby",
  "chat.status.canceled": "Nofoanana",
  "chat.status.waiting": "Miandry",
  "chat.status.sending_short": "Alefa",
  "chat.status.receiving": "Raisina",
  "chat.thread.not_available": "Tsy misy eto",
  "chat.thread.private_channel": "Fantsona manokana",
  "chat.thread.location_channel": "Fantsonan-toerana",
  "chat.thread.public_channel": "Fantsona ho an'ny daholobe",
  "chat.thread.notices": "Filazana amin'ity fantsona ity",
  "chat.thread.invite": "Manasa olona amin'ity fantsona ity",
  "chat.thread.not_in_range":
    "Tsy ao anatin'ny fetran'ny Bluetooth. Ampitaina amin'ny Internet.",
  "chat.thread.not_nearby":
    "Tsy akaiky. Hampitainay rehefa tafaverina ao anatin'ny fetra na tafiditra an-tserasera izy.",
  "chat.thread.no_keys":
    "Mila ao anatin'ny fetran'ny Bluetooth ianao, na maka sary ny kaodiny, vao afaka manoratra aminy.",
  "chat.geo.card_received":
    "Nizara ny fifandraisany i {name}. Zarao koa ny anao mba hahafahanareo miresaka rehefa mifindra ny iray aminareo.",
  "chat.geo.exchange_complete":
    "Voatakalo ny fifandraisana. Afaka mifandray avy any amin'ny toerana rehetra ianareo izao.",
  "chat.geo.keep_person": "Tazomy ity olona ity",
  "chat.geo.keep_person_desc":
    "Zarao ny fifandraisanao mba hahafahanareo miresaka rehefa mifindra ny iray aminareo. Ho fantany ny maha-ianao anao maharitra.",
  "chat.geo.card_sent": "Nozaraina · miandry ny azy",
  "chat.thread.left_cell":
    "Efa niala tamin'ity faritra ity ianao, ka tsy tratrany eto. Mifanakalòzy kaody mba hahafahanareo miresaka na aiza na aiza.",
  "chat.thread.no_route":
    "Tsy tratra izy amin'izao fotoana izao. Halefa ny hafatra rehefa misy lalana.",
  "chat.thread.empty": "Mbola tsy misy hafatra",
  "chat.thread.empty_desc": "Manomboha resaka voafono.",
  "chat.thread.jump_latest": "Mankany amin'ny hafatra farany",
  "chat.thread.back_to_members": "Miverina amin'ny mpikambana",
  "chat.thread.nostr_key": "Lakile ho an'ny daholobe Nostr",
  "chat.thread.in_range": "Ao anatin'ny fetra",
  "chat.voice.not_recorded": "Tsy voarakitra ilay naoty feo",
  "chat.thread.message": "Hafatra",
  "chat.thread.message_placeholder": "Hafatra…",
  "chat.thread.length_full": "Feno ny hafatra",
  "chat.thread.waiting_for": "Miandry ny hiverenan'i {name} · {percent}%",
  "chat.thread.peer": "teboka",
  "chat.thread.cancel_transfer": "Foano ny {name}",
  "chat.thread.queued_more": "{count} hafa miandry halefa",
  "chat.thread.across_bridge": "{count} any ampitan'ny tetezana",
  "chat.thread.bridged": "nampitaina",
  "chat.thread.invite_body":
    "Ndao hiaraka amiko ao amin'ny {channel} ao amin'ny Airhop — hafatra manokana amin'ny harato, natao ho an'ny tsy misy Internet aloha.",
  "chat.thread.go_back_unread": "Miverina, {count} tsy voavaky",
  "chat.thread.view_info": "Jereo ny mombamomba an'i {name}",
  "chat.thread.notices_new": "Filazana amin'ity fantsona ity, {count} vaovao",
  "chat.thread.say_something": "Milazà zavatra ao amin'ny {channel}.",
  "chat.thread.jump_latest_new":
    "Mankany amin'ny hafatra farany, {count} vaovao",
  "chat.thread.unconfirmed_since":
    "Tsy nisy fanaterana voamarina hatramin'ny {date}",
  "chat.thread.no_reach": "Tsy misy teboka akaiky · mbola tsy nisy nandray ity",
  "chat.thread.channel_needs_internet":
    "Vonoina ny Internet · ity fantsona ity dia mahatratra ny olona ao anatin'ny fetran'ny Bluetooth ihany",
  "chat.thread.cell_needs_internet":
    "Vonoina ny Internet · amin'ny Internet ihany no ahatratrarana ity efitra ity",
  "chat.thread.geo_dm_needs_internet":
    "Vonoina ny Internet · amin'ny Internet ihany no andehanan'ity resaka ity",
  "chat.thread.via_gateway":
    "Vonoina ny Internet · misy fitaovana akaiky mitondra ity an-tserasera ho anao",
  "chat.thread.group_queued":
    "Mbola tsy misy akaiky avy amin'ity vondrona ity. Ho tratra izy ireo rehefa tonga.",
  "chat.thread.no_group_key":
    "Tsy ao amin'ity vondrona ity intsony ianao, ka tsy azo alefa ity",
  "chat.thread.no_reach_offline":
    "Vonoina ny Internet ary tsy misy teboka akaiky · mbola tsy nisy nandray ity",
  "chat.thread.mention": "Tanisao i {name}",
  "chat.thread.someone_talking": "{hold}. Miteny i {name}.",
  "chat.thread.attach_note":
    "Ao anatin'ny fetran'ny Bluetooth ihany no andefasana rakitra. Mahatratra ny fifandraisana amin'ny Internet ny lahatsoratra sy ny fandoavam-bola; tsy mahatratra kosa ny fanampiny.",
  "chat.thread.message_peer": "Manorata amin'i {name}",
  "chat.thread.send": "Alefaso ny hafatra",
  "chat.thread.group": "Vondrona",
  "chat.bridge.nearby_only":
    "Akaiky ihany: aza ampandalovina amin'ny tetezan'ny harato ity hafatra ity",
  "chat.bridge.nearby_label": "Akaiky ihany · mijanona amin'ny Bluetooth",
  "chat.bridge.bridging_label":
    "Mampita amin'ny faritra akaiky · tsindrio ho akaiky ihany",
  "chat.screenshot.you_took": "Naka sarin'efijery ianao",
  "chat.screenshot.you_took_private":
    "Naka sarin'efijery ianao · tsy nisy nampandrenesina",
  "chat.screenshot.heads_up": "Mitandrema",
  "chat.screenshot.notice": "* Naka sarin'efijery i {name} *",
  "chat.screenshot.notified_dm":
    "Nampandrenesina i {name} fa naka sarin'efijery an'ity resaka ity ianao.",
  "chat.screenshot.notified":
    "Nampandrenesina ny olona rehetra amin'ity fantsona ity fa naka sarin'efijery ianao.",
  "chat.screenshot.not_notified":
    "Tsy nisy nampandrenesina. Ho an'ny daholobe ity fantsona ity, ka ny fanambarana sarin'efijery dia hanoratra fa teto ianao.",
  "chat.thread.error": "Fahadisoana",
  "chat.thread.go_back": "Miverina",
  "chat.bubble.via_bridge": "amin'ny alalan'ny tetezan'ny harato",
  "chat.bubble.view_profile": "Jereo ny mombamomba an'i {name}",
  "chat.bubble.forwarded": "Nampitaina",
  "chat.bubble.attachment": "fanampiny",
  "chat.bubble.a11y":
    "{sender}: {body}. Hazony raha te hahita safidy fanampiny.",
  "chat.bubble.failed_retry": "Tsy voalefa. Tsindrio hanandrana indray.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Mombamomba ny hafatra",
  "chat.info.delivered_to": "Tonga tany amin'i {name}",
  "chat.info.read_by": "Novakian'i {name}",
  "chat.info.group_reach_desc": "Tratra izao, fa tsy fanamarinana fanaterana",
  "chat.info.group_alone": "Tsy misy mpikambana hafa",
  "chat.info.today_at": "Androany {time}",
  "chat.info.sending": "Alefa…",
  "chat.info.failed": "Tsy voalefa",
  "chat.info.courier": "Nentin'ny namana",
  "chat.info.sent": "Nalefa",
  "chat.info.queued": "Miandry halefa",
  "chat.info.waiting": "Miandry…",
  "chat.action.info": "Mombamomba ny hafatra",
  "chat.action.save_photos": "Tehirizo ao amin'ny sary",
  "chat.action.save_copy": "Tehirizo dika mitovy",
  "chat.action.forward": "Ampitao",
  "chat.action.select": "Fidio",
  "chat.select.cancel": "Foano ny fifantenana",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Fakan-tsary",
  "chat.attach.camera_desc": "Maka sary na horonan-tsary",
  "chat.attach.library": "Tahirin-tsary",
  "chat.attach.library_desc": "Fidio avy amin'ny tahirinao",
  "chat.attach.document": "Antontan-taratasy",
  "chat.attach.document_desc": "Mandefa rakitra na PDF rehetra",
  "chat.attach.voice": "Naoty feo",
  "chat.attach.voice_desc": "Raketo ary alefaso hafatra feo",
  "chat.attach.ecash": "Mandefa ecash",
  "chat.attach.ecash_desc": "Mandefa sat Cashu avy amin'ny kitapom-bolanao",
  "chat.attach.location": "Toerana",
  "chat.attach.location_desc": "Alefaso izay misy anao izao",
  "chat.attach.title": "Ampiaraho",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Nizara toerana",
  "chat.location.received_summary": "Nizara ny toerany",
  "chat.location.title": "Toerana",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Nalaina {ago} lasa izay",
  "chat.location.open_maps": "Sokafy ao amin'ny Sarintany",
  "chat.location.no_forward": "Tsy ampitaina ny toerana",
  "chat.location.no_forward_body":
    "Olona iray ihany no andefasana toerana. Zarao ny anao raha tianao ho azon'olon-kafa.",
  "chat.location.no_fix":
    "Avelao ny toerana mba hahitanao hoe lavitra hatraiza ity",
  "chat.location.send_title": "Alefaso ny toeranao",
  "chat.location.send_body":
    "Teboka iray no ho hitan'i {name}: izay misy anao izao. Tsy mihavao tsy tapaka izy io.",
  "chat.location.send": "Alefaso ny toerana",
  "chat.location.finding": "Mitady ny toeranao…",
  "chat.location.no_location": "Tsy azo ny toeranao",
  "chat.location.no_location_body":
    "Avelao ny fidirana amin'ny toerana ary hamarino fa mandeha ny serivisy toerana, avy eo andramo indray.",
  "chat.location.not_delivered": "Tsy voalefa ny toeranao",
  "chat.location.not_delivered_body":
    "Mendrika halefa ny toerana rehefa mbola ankehitriny izy, ka tsy apetraka am-pilaharana ho amin'ny manaraka. Andramo indray rehefa tratra i {name}.",
  "chat.location.direction.n": "avaratra",
  "chat.location.direction.ne": "avaratra-atsinanana",
  "chat.location.direction.e": "atsinanana",
  "chat.location.direction.se": "atsimo-atsinanana",
  "chat.location.direction.s": "atsimo",
  "chat.location.direction.sw": "atsimo-andrefana",
  "chat.location.direction.w": "andrefana",
  "chat.location.direction.nw": "avaratra-andrefana",
  "chat.attach.send_anyway": "Alefaso ihany",
  "chat.attach.bitchat_too_big": "Mety tsy ho tonga ity",
  "chat.attach.bitchat_too_big_body":
    "Ao amin'ny bitchat i {name}, izay mandao antsasa-dalana ny rakitra lehibe. Azo antoka ny latsaky ny 350 KiB eo ho eo. Tsy misy fetra toy izany ny fandefasana amin'ny fifandraisana Airhop.",
  "chat.attach.bitchat_unopenable": "Mety tsy ho voasokany ity",
  "chat.attach.bitchat_unopenable_body":
    "Ao amin'ny bitchat i {name}, izay mampiseho sary sy naoty feo fa manisy ny ambiny rehetra ho rakitra tsy voasokany. Ho tonga ihany izy, fa mety tsy ho hitany.",
  "chat.attach.file": "Ampiaraho rakitra",
  "chat.attach.unavailable": "Tsy misy fanampiny eto",
  "chat.attach.not_sent": "Tsy voalefa ny fanampiny",
  "chat.attach.read_failed":
    "Nisy tsy nety tamin'ny famakiana io rakitra io. Andramo ny hafa.",
  "chat.attach.caption": "Ampio fanazavana…",
  "chat.attach.send": "Alefaso ny fanampiny",
  "chat.attach.generic": "Fanampiny",
  "chat.media.view_full": "Jereo ny sary manerana ny efijery",
  "chat.media.gone_photo": "Tsy eto amin'ity fitaovana ity ny sary",
  "chat.media.gone_video": "Tsy eto amin'ity fitaovana ity ny horonan-tsary",
  "chat.media.gone_voice": "Tsy eto amin'ity fitaovana ity ny naoty feo",
  "chat.media.gone_file": "Tsy eto amin'ity fitaovana ity ny rakitra",
  "chat.media.gone_note":
    "Nesorina taorian'ny 7 andro na rehefa nofafana ny tahiry vonjimaika",
  "chat.media.ask_resend": "Angataho indray",
  "chat.media.resend_draft": "Afaka alefanao indray ve io {kind} io?",
  "chat.media.kind_photo": "sary",
  "chat.media.kind_video": "horonan-tsary",
  "chat.media.kind_voice": "naoty feo",
  "chat.media.kind_file": "rakitra",
  "chat.media.pause_voice": "Ajanony ny naoty feo",
  "chat.media.play_voice": "Alefaso ny naoty feo",
  "chat.media.voice_position": "Toerana ao amin'ny naoty feo",
  "chat.media.voice_scrub":
    "Tsindrio manaraka ny tsipika mba hankany amin'io toerana io",
  "chat.media.image": "Sary",
  "chat.media.tap_load_photo": "Tsindrio hampiditra ny sary",
  "chat.media.open_document": "Sokafy ny {name}",
  "chat.media.document": "antontan-taratasy",
  "chat.media.tap_load_video": "Tsindrio hampiditra ny horonan-tsary",
  "chat.media.video": "Horonan-tsary",
  "chat.media.photo": "Sary",
  "chat.media.close_photo": "Akatony ny sary",
  "chat.media.save_photo": "Tehirizo ny sary ao amin'ny sarinao",
  "chat.media.share_photo": "Zarao ny sary",
  "chat.media.saved_videos": "Voatahiry ao amin'ny horonan-tsarinao",
  "chat.media.saved_photos": "Voatahiry ao amin'ny sarinao",
  "chat.media.not_saved": "Tsy voatahiry",
  "chat.media.cant_open": "Tsy voasokatra ny rakitra",
  "chat.media.no_app":
    "Tsy misy rindranasa eto amin'ity fitaovana ity hanokatra na hizara ity rakitra ity.",
  "chat.media.open_failed":
    "Tsy voasokatra ny rakitra. Mety voafafa tamin'ny tahiry vonjimaika izy.",
  "media.blocked.nostr_only":
    "Amin'ny alalan'ny mpanelanelana ihany no ahafantaranao ity olona ity. Lahatsoratra ihany no azo alefa. Mila Bluetooth ny sary, ny rakitra ary ny naoty feo.",
  "media.blocked.private_channel":
    "Voasonia fa tsy voafono ny fanampiny ampielezana, ka ny fandefasana azy amin'ny fantsona manokana dia hamela azy hiharihary, nefa mijanona voafono ny lahatsoratra eto.",
  "media.blocked.private_group":
    "Voasonia fa tsy voafono ny fanampiny ampielezana, ka ny fandefasana azy amin'ny vondrona manokana dia hamela azy hiharihary, nefa mijanona voafono ny lahatsoratra eto.",
  "media.blocked.location_channel":
    "Mahatratra ny olona amin'ny Internet ny fantsonan-toerana, ary amin'ny Bluetooth no andehanan'ny sary, ny rakitra ary ny naoty feo, ka tsy ho tonga mihitsy izy ireo.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Tsy misy naoty feo eto",
  "chat.voice.hold_live": "Hazony raha te hiteny mivantana",
  "chat.voice.hold_record": "Hazony raha te handrakitra naoty feo",
  "chat.voice.cancel_recording": "Foano ny fandraketana",
  "chat.voice.slide_cancel": "Sintono mba hanafoanana",
  "chat.voice.release_cancel": "Alefaso mba hanafoanana",
  "chat.voice.a11y_toggle":
    "Tsindrio indroa mba hanomboka na hampitsahatra ny fitenenana.",
  "chat.voice.limit_reached":
    "Tratra ny fetra roa minitra, alefaso mba handefa",
  "chat.voice.limit_sent": "Tratra ny fetra roa minitra, nalefa ny naoty",
  "chat.voice.stop_send": "Ajanony ny fandraketana ary alefaso",
  "chat.voice.lift_lock": "Sintono miakatra mba handrakitra tsy mihazona",
  "chat.voice.live_speaking": "Miteny i {name}",
  "voice.unavailable": "Tsy misy feo mivantana",
  "voice.recording_stopped": "Nijanona ny fandraketana",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Fidirana amin'ny fakan-tsary",
  "chat.perm.camera_purpose": "haka sary halefa",
  "chat.perm.photo_label": "Fidirana amin'ny sary",
  "chat.perm.photo_purpose": "hifidy sary na horonan-tsary halefa",
  "chat.perm.photo_save_purpose": "hitahiry ity ao amin'ny sarinao",
  "chat.perm.mic_label": "Fidirana amin'ny mikrô",
  "chat.perm.mic_live_purpose": "hiresaka amin'ny olona akaiky",
  "chat.perm.mic_note_purpose": "handrakitra naoty feo",
  "chat.perm.recording_stopped": "Nijanona ny fandraketana",
  "chat.perm.record_failed":
    "Tsy afaka nanomboka ny fandraketana. Jereo ny alalana amin'ny mikrô.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Voaray",
  "chat.ecash.reclaimed": "Naverina",
  "chat.ecash.claiming": "Raisina…",
  "chat.ecash.claim": "Raiso",
  "chat.ecash.claim_amount": "Raiso ny {amount} {unit}",
  "chat.ecash.already_claimed": "Efa voaray",
  "chat.ecash.already_claimed_body":
    "Efa ao amin'ny kitapom-bolanao avokoa ny porofo rehetra amin'ity tapakila ity, ka tsy nisy nampiana.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Natolotra ny harato mba hoentina araka izay azo atao",
  "chat.info.queued_desc":
    "Tehirizina eto amin'ity finday ity mandra-pisian'ny lalana mankany aminy",
  "chat.info.reclaimed": "Naverina",
  "chat.info.reclaimed_desc":
    "Naverinao tao amin'ny kitapom-bolanao ity fandoavam-bola ity, ka tsy ho tonga izy",
  "chat.info.about": "Mombamomba",
  "chat.info.group_desc":
    "Vondrona manokana. Ny mpikambana nampidirin'ny mpamorona ihany no mahavaky azy, ary mijanona amin'ny Bluetooth izy.",
  "chat.info.teleported_desc":
    "Fantsonan-toerana ho an'ny daholobe amin'ity efitra geohash ity. Izay rehetra ao amin'ny efitra, na amin'ny Airhop na amin'ny bitchat, dia mizara azy amin'ny Internet. Avy lavitra ianao, tsy eto ara-batana.",
  "chat.info.custom_desc":
    "Fantsona manokana. Izay mahafantatra ny anarany dia afaka miditra avy amin'ny fitaovana Airhop na bitchat rehetra.",
  "chat.info.private_e2ee": "Manokana · voafono tanteraka",
  "chat.info.public_plain": "Ho an'ny daholobe · tsy voafono",
  "chat.info.group_privacy":
    "Ny mpikambana aseho etsy ambany ihany no mahavaky ity vondrona ity. Mijanona amin'ny Bluetooth ny hafatra, ka handray azy ireo ny mpikambana any ivelan'ny fetra rehefa tafaverina.",
  "chat.info.teleport_privacy":
    "Toerana nalehanao avy lavitra. Mahatratra ny olona rehetra ao amin'ity efitra ity amin'ny Internet izy, fa tsy mahatratra na iza na iza ao anatin'ny fetran'ny Bluetooth.",
  "chat.info.location_off_privacy":
    "Vonoina ny toerana, ka amin'ny Bluetooth ihany no ahatratraran'ity fantsona ity ny fitaovana akaiky. Alefaso ny toerana mba hahatratrarana ny efitry ny faritra amin'ny Internet.",
  "chat.info.invite_privacy":
    "Izay asainao amin'ny rohy ihany no mahavaky azy. Mijanona miafina amin'ny hafa rehetra izy, na dia amin'ny teboka akaiky aza.",
  "chat.info.public_privacy":
    "Izay miditra rehetra dia mahavaky ny hafatra rehetra. Ampiasao ny hafatra mivantana ho an'ny resaka manokana; voafono tanteraka izy ireny.",
  "chat.info.remove_member": "Esory ny mpikambana",
  "chat.info.remove_member_body":
    "Hesorina amin'ny vondrona i {name}? Hovaina ny lakilen'ny vondrona, ka tsy ho vakiny intsony ny hafatra vaovao.",
  "chat.info.message_member": "Manorata amin'i {name}",
  "chat.info.remove_member_a11y": "Esory i {name}",
  "chat.info.no_addable":
    "Tsy misy teboka tratra hampidirina. Tsy maintsy akaiky ny mpikambana.",
  "chat.info.add_count": "Ampidiro {count}",
  "chat.info.teleported_tag": "{level}  ·  avy lavitra",
  "chat.info.active": "Mavitrika",
  "chat.info.members": "Mpikambana",
  "chat.info.bookmark": "Tehirizo ity toerana ity",
  "chat.info.remove_bookmark": "Esory amin'ny voatahiry",
  "chat.info.default_notice":
    "Tsy azo ialana ny fantsona mahazatra. Anisan'ny protokolin'ny harato Airhop izy ireo.",
  "chat.info.custom_channel": "Fantsona manokana",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Adikao ny geohash",
  "chat.info.relays": "Mpanelanelana",
  "chat.info.show_relays": "Asehoy ny mpanelanelana mitondra ity fantsona ity",
  "chat.info.relay_custom": "manokana",
  "chat.info.relays_none": "Tsy misy. Bluetooth ihany ity efitra ity izao.",
  "chat.info.search_members": "Karohy ny mpikambana",
  "chat.info.search_members_placeholder": "Karohy ny mpikambana…",
  "chat.info.teleported": "Avy lavitra",
  "chat.info.creator": "Mpamorona",
  "chat.info.no_matches": "Tsy misy mifanaraka",
  "chat.info.no_one_here": "Mbola tsy misy olona eto",
  "chat.info.add_members": "Ampidiro mpikambana",
  "chat.info.add_selected": "Ampidiro ny mpikambana voafantina",
  "chat.info.add": "Ampidiro",
  "chat.info.leave_group": "Ialao ny vondrona",
  "chat.info.leave_channel": "Ialao ny fantsona",
  "chat.info.leave": "Ialao",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Miresaka hatramin'ny {date}",
  "chat.contact.verified_since": "Voamarina hatramin'ny {date}",
  "chat.contact.anonymous": "Tsy fantatra anarana",
  "chat.contact.anonymous_desc":
    "Solon'anarana geohash tsy misy maha-izy azy maharitra hamarinina",
  "chat.contact.verified": "Voamarina",
  "chat.contact.verified_desc": "Nakanao sary ny kaody QR-ny",
  "chat.contact.verified_desc_compared": "Nampitahainareo ny kaody",
  "chat.contact.not_verified": "Tsy voamarina",
  "chat.contact.not_verified_desc":
    "Alaivo sary ny kaodiny, na ampitahao iray amin'ny antso, mba hanamafisana fa izy tokoa",
  "chat.contact.e2ee": "Voafono tanteraka",
  "chat.contact.e2ee_nostr":
    "Voafono araka ny NIP-17, ka tsy vakin'ny mpanelanelana",
  "chat.contact.e2ee_mesh":
    "Noise XX, ary Double Ratchet eo amin'ny fitaovana Airhop",
  "chat.contact.copy_nostr": "Adikao ny lakile ho an'ny daholobe Nostr",
  "chat.contact.nostr_key": "Lakile ho an'ny daholobe Nostr",
  "chat.contact.cell_key_note":
    "An'ny faritra nihaonanareo ity lakile ity. Miova izy raha mifindra ny iray aminareo, ary miato miaraka aminy ny resaka. Mifanakalòzy fifandraisana mba hahafahanareo miresaka na aiza na aiza.",
  "chat.contact.peer_name": "Anaran'ny teboka",
  "chat.contact.peer_id": "ID-n'ny teboka",
  "chat.contact.rename": "Ovay anarana",
  "chat.contact.rename_needs_contact":
    "Azonao ovaina anarana ny olona anananao ny lakiley. Mifanakalòzy karatra fifandraisana aloha, avy eo dia lasa anarana hitanao irery ity.",
  "chat.contact.rename_needs_keys":
    "Mbola tsy misy lakile ho an'ity fifandraisana ity. Manorata aminy, na alaivo sary ny kaodiny, dia afaka manome azy anarana hitanao irery ianao.",
  "chat.contact.renamed_by_you": "Ny anarana nomenao azy",
  "chat.contact.copy_peer_id": "Adikao ny ID-n'ny teboka",
  "chat.contact.verify": "Hamarino ny fifandraisana",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Filazana",
  "chat.notices.post_area": "Mametraka filazana amin'ity faritra ity",
  "chat.notices.post_mesh": "Mametraka filazana amin'ny harato",
  "chat.notices.mark_urgent": "Mariho ho maika",
  "chat.notices.post": "Apetraho ny filazana",
  "chat.notices.post_short": "Apetraho",
  "chat.notices.delete": "Fafao ny filazana",
  "chat.notices.just_now": "vao izao",
  "chat.notices.fades_soon": "ho levona tsy ho ela",
  "chat.notices.1_day": "1 andro",
  "chat.notices.3_days": "3 andro",
  "chat.notices.7_days": "7 andro",
  "chat.notices.fading": "milevona",
  "chat.notices.fades_in_hours": "milevona afaka {count} ora",
  "chat.notices.fades_in_days": "milevona afaka {count} andro",
  "chat.notices.scope_geo": "Jeô",
  "chat.notices.scope_mesh": "Harato",
  "chat.notices.urgent_short": "Maika",
  "chat.notices.permanent_warning":
    "Tsy milevona mihitsy. Ho an'ny daholobe izy, mifamatotra amin'ity faritra ity, ary tsy azonao averina.",
  "chat.notices.none":
    "Mbola tsy misy filazana. Apetraho iray mba hijanona eto ho an'ny hafa.",

  // ---- Chats: search results ----
  "chat.search.photos": "Sary",
  "chat.search.videos": "Horonan-tsary",
  "chat.search.audio": "Feo",
  "chat.search.documents": "Antontan-taratasy",
  "chat.search.links": "Rohy",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Sivano araka ny {filter}",
  "chat.search.no_matches": "Tsy misy {filter} mifanaraka amin'ny “{query}”",
  "chat.search.no_media": "Mbola tsy misy {filter}",
  "chat.search.result_a11y": "{chat}, {kind} avy amin'i {sender}",
  "chat.search.you": "ianao",
  "chat.search.section_chats": "Resaka",
  "chat.search.section_messages": "Hafatra",
  "chat.search.section_notices": "Filazana",
  "chat.search.hint":
    "Karohy ao amin'ny hafatra sy ny resaka, na mifidiana sivana eo ambony.",
  "chat.search.no_results": "Tsy misy valiny ho an'ny “{query}”",
  "chat.search.open_chat": "Sokafy ny {name}",
  "chat.search.message_a11y": "{chat}, hafatra avy amin'i {sender}: {snippet}",
  "chat.search.notice_a11y":
    "Filazana ao amin'ny {chat} avy amin'i {author}: {snippet}",
  "chat.search.urgent": "Maika ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "{count} no ao amin'ity lisitra ity. Ny famafana dia manaisotra azy ireo eto ihany, ary mijanona tsy voavaky ao amin'ny resany ny hafatra. Ny fanamarihana ho voavaky ny rehetra dia manadio azy roa.",
  "chat.notif.mark_all_read": "Mariho ho voavaky ny rehetra",
  "chat.notif.clear_list": "Fafao ny lisitra",
  "chat.notif.clear_all_a11y": "Fafao ny fampandrenesana {count} rehetra",
  "chat.notif.title": "Fampandrenesana",
  "chat.notif.clear_short": "Fafao",
  "chat.notif.close": "Akatony ny fampandrenesana",
  "chat.notif.none": "Mbola tsy misy fampandrenesana",
  "chat.notif.none_desc":
    "Hiseho eto ny hafatra, ny fitanisana ary ny filazana avy amin'ny fantsonanao sy ny resakao.",
  "chat.notif.new": "Vaovao",
  "chat.notif.notice_in": "filazana ao amin'ny {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Ampitao amin'ny…",
  "chat.forward.to": "Ampitao amin'i {name}",
  "chat.forward.cant_send_here": "Tsy azo ampitaina eto",
  "chat.forward.cant_send_to": "Tsy azo ampitaina amin'i {name}",
  "chat.forward.channels": "Fantsona",
  "chat.forward.groups": "Vondrona",
  "chat.forward.locations": "Toerana",
  "chat.forward.dms": "Hafatra mivantana",
  "chat.forward.none": "Mbola tsy misy resaka hafa",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Manomboka ny harato…",
  "mesh.banner.no_bluetooth":
    "Tsy misy Bluetooth eto amin'ity fitaovana ity · Internet ihany",
  "mesh.banner.bluetooth_off": "Vonoina ny Bluetooth · tsy misy ny harato",
  "mesh.banner.permission_needed": "Mila alalana Bluetooth",
  "mesh.banner.blocked":
    "Voasakana ny Bluetooth · avelao ao amin'ny Fandrindrana",
  "mesh.banner.location_permission": "Mila toerana mba hahitana teboka",
  "mesh.banner.advertising_unsupported":
    "Mahita ny hafa ity findy ity, fa tsy hita",
  "mesh.banner.location_off_android":
    "Vonoina ny toerana · mila azy ny Android mba hahitana teboka",
  "mesh.banner.paused": "Miato ny harato · lasa ianao",
  "mesh.banner.location_off":
    "Vonoina ny toerana · tsy misy ny fantsonan-toerana",
  "mesh.banner.battery_saver": "Fitsitsiana batera · mikaroka vitsy kokoa",
  "mesh.banner.wipe_incomplete":
    "Tsy vita ny famafana · mety mbola misy angona sisa, ny fanokafana indray dia manandrana indray",
  "mesh.banner.wifi_off":
    "Vonoina ny Wi-Fi · miadana kokoa ny fandefasana rakitra lehibe",
  "mesh.banner.clock_skew":
    "Diso ny famantaranandron'ity findy ity · ataovy ho ho azy ny daty sy ny ora",
  "mesh.banner.internet_off": "Vonoina ny Internet · Bluetooth ihany",
  "mesh.banner.relaying":
    "Tsy misy teboka eo an-toerana · mampita amin'ny Nostr",
  "mesh.banner.tor": "Mandeha ny Tor · voatondro ny fifamoivoizana Internet",
  "mesh.banner.tor_starting": "Manomboka ny Tor · mifandray",
  "mesh.banner.tor_blocked":
    "Tsy tafaray ny Tor · mbola mandeha ihany ny harato",
  "mesh.banner.gateway":
    "Mandeha ny vavahady Internet · mampita ho an'ny teboka akaiky",
  "mesh.banner.bridge":
    "Mandeha ny tetezan'ny harato · mifandray ny resaka ho an'ny daholobe",
  "mesh.banner.background_limits":
    "Mety hampiato ny harato any aoriana ny {brand}",
  "mesh.banner.bridge_across":
    "Mandeha ny tetezan'ny harato · {count} any ampitan'ny tetezana",
  "mesh.banner.action.turn_on": "Alefaso",
  "mesh.banner.action.allow": "Avelao",
  "mesh.banner.action.resume": "Tohizo",
  "mesh.banner.action.fix": "Amboary",
  "mesh.banner.hint.resume":
    "Mandefa indray ny fanambarana sy ny fikarohana Bluetooth",
  "mesh.banner.hint.enable_bluetooth":
    "Mangataka amin'ny Android handefa ny Bluetooth",
  "mesh.banner.hint.location_settings":
    "Manokatra ny fandrindrana toeran'ny rafitra",
  "mesh.banner.hint.app_settings":
    "Manokatra ny alalan'ny Airhop ao amin'ny fandrindran'ny rafitra",
  "mesh.banner.hint.battery_settings":
    "Manokatra ny fandrindrana asa any aorian'ity findy ity",
  "mesh.banner.dismiss": "Esory: {label}",
  "mesh.banner.hint.dismiss": "Manafina ity fanamarihana ity mandrakizay",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Mikaroka teboka akaiky…",
  "mesh.radar.starting": "Manomboka ny harato…",
  "mesh.radar.no_bluetooth": "Tsy manana Bluetooth ity fitaovana ity",
  "mesh.radar.bluetooth_off": "Vonoina ny Bluetooth · tsy mikaroka",
  "mesh.radar.permission_needed": "Mila alalana Bluetooth",
  "mesh.radar.blocked": "Voasakana ny Bluetooth",
  "mesh.radar.location_permission": "Mila alalana toerana",
  "mesh.radar.location_off": "Vonoina ny toerana · tsy mikaroka",
  "mesh.radar.hint_rings":
    "Ny faribolana dia mampiseho ny herin'ny famantarana BLE, fa tsy ny halavirana",
  "mesh.radar.hint_checking": "Manamarina ny Bluetooth sy ny alalana",
  "mesh.radar.hint_internet": "Mbola mandeha amin'ny Internet ihany ny hafatra",
  "mesh.radar.hint_turn_on": "Alefaso ny Bluetooth mba hahitana teboka",
  "mesh.radar.hint_allow": "Avelao ny Bluetooth mba hahitana teboka",
  "mesh.radar.hint_allow_settings":
    "Avelao ny Bluetooth ao amin'ny Fandrindrana mba hahitana teboka",
  "mesh.radar.hint_location_permission":
    "Ny Android 11 sy ny taloha kokoa dia mila toerana mba hikaroka amin'ny Bluetooth",
  "mesh.radar.hint_android_location":
    "Mila toerana mandeha ny Android mba hamerina ny valin'ny fikarohana Bluetooth",
  "mesh.radar.signal_strong": "Matanjaka",
  "mesh.radar.signal_medium": "Antonony",
  "mesh.radar.signal_weak": "Malemy",
  "mesh.radar.you_center": "Ianao, eo afovoan'ny harato",
  "mesh.radar.sonar_hint":
    "Mampandeha fikarohana sonara indray mandeha. Efa tsy tapaka ny fikarohana.",
  "mesh.radar.paused": "Miato ny harato · lasa ianao",
  "mesh.radar.ring_hint":
    "Ny toerana eo amin'ny faribolana dia maneho ny herin'ny famantarana, fa tsy ny halavirana",
  "mesh.radar.set_online":
    "Ataovy An-tserasera ny toe-javatrao ao amin'ny mombamomba mba hahitana teboka",
  "mesh.radar.in_range": "ao anatin'ny fetra",
  "mesh.radar.recently_seen": "hita vao haingana",
  "mesh.radar.peer_hint":
    "Manokatra ny safidy hanoratana na handoavam-bola amin'ity teboka ity",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "vao izao",
  "mesh.peer.none": "Tsy misy teboka akaiky",
  "mesh.peer.none_desc":
    "Hiseho eto ny fitaovana Airhop na bitchat hafa ao anatin'ny fetran'ny Bluetooth.",
  "mesh.peer.id_copied": "Voadika ny ID-n'ny teboka",
  "mesh.peer.copy_id": "Adikao ny ID-n'ny teboka",
  "mesh.peer.their_name": "Antsoina hoe {name}",
  "mesh.peer.in_range": "Ao anatin'ny fetra",
  "mesh.peer.relay": "Teboka mpanelanelana",
  "mesh.peer.relay_body":
    "Radiô navelan'olona nandeha mba hanitatra ny harato. Mitondra hafatra tsy vakiny izy. Tsy misy olona hanoratana eto.",
  "mesh.peer.send_dm": "Mandefa hafatra mivantana",
  "mesh.peer.message": "Hafatra",
  "mesh.peer.send_sats": "Mandefa ecash",
  "mesh.peer.amount_placeholder": "Sanda amin'ny sat",
  "mesh.peer.amount_first": "Mandefa ecash, soraty aloha ny sanda",
  "mesh.peer.cancel_send": "Foano ny fandefasana ecash",
  "mesh.peer.view_peer": "Jereo ny teboka {name}",
  "mesh.peer.view_peer_online": "Jereo ny teboka {name}, an-tserasera",
  "mesh.peer.last_seen": "Hita farany {ago} lasa izay",
  "mesh.peer.send_amount": "Alefaso {amount} sat",
  "mesh.peer.direct": "Fifandraisana mivantana",
  "mesh.peer.check_distance": "Jereo ny halavirana",
  "mesh.peer.checking": "Manamarina",
  "mesh.peer.no_reply": "Tsy misy valiny",
  "mesh.peer.no_reply_hint":
    "Mety lasa izy ireo, na tsy mamaly ny rindranasany",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Faritra",
  "mesh.level.province": "Faritany",
  "mesh.level.city": "Tanàna",
  "mesh.level.neighborhood": "Fokontany",
  "mesh.level.block": "Bokotany",
  "mesh.level.building": "Trano",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Azo lanina",
  "wallet.balance.unit_hint": "Mifamadika eo amin'ny satoshi sy ny bitcoin",
  "wallet.balance.a11y": "Vola {value} {unit}",
  "wallet.balance.locked":
    "Mihidy ny fitehirizan'ny kitapom-bola. Tehirizina ao anaty rakitra voafono ny porofo ecash, ary ao amin'ny fitehirizan-dakilen'ny fitaovana ny lakilen'io rakitra io, ka tsy voasokatra izy. Vahao ny fitaovanao ary sokafy indray ny Airhop.",
  "wallet.balance.tor_blocked":
    "Mandeha ny Tor, ka voasakana ny fangatahana any amin'ny mpamoaka: hivoaka amin'ny tambajotra misokatra izy ireo ary hampifandray ny IP-nao amin'ny porofonao. Mbola mandeha ny fandefasana sy fandraisana amin'ny harato. Avelao ny fifamoivoizan'ny mpamoaka ao amin'ny Fandrindrana, Fiarovana.",
  "wallet.balance.unconfirmed_note":
    "{amount} tsy mbola voamarina amin'ny mpamoaka",
  "wallet.balance.reserved_note":
    "{amount} voatokana ho an'ny fandefasana an-dalana",
  "wallet.balance.other_mint_note": "{amount} ao amin'ny kaonty mpamoaka hafa",
  "wallet.balance.test_mint_note":
    "Misy vola filalaovana avy amin'ny mpamoaka fitsapana. Tsy bitcoin izy io ary tsy azo esorina.",
  "wallet.token": "Tapakila",
  "wallet.action.send": "Mandefa tapakila ecash",
  "wallet.action.send_disabled":
    "Mandefa tapakila ecash, tsy misy raha aotra ny vola",
  "wallet.action.receive": "Mandray tapakila ecash",
  "wallet.action.zap": "Mandefa zap amin'ny fifandraisana Nostr",
  "wallet.action.zap_disabled":
    "Mandefa zap amin'ny fifandraisana Nostr, tsy misy raha aotra ny vola",
  "wallet.action.add_mint": "Manampy mpamoaka Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Tsy voaforona ny tapakila",
  "wallet.send.title": "Mandefa ecash",
  "wallet.send.amount_in": "Sanda amin'ny {unit}",
  "wallet.send.body":
    "Naorina tsy misy Internet avy amin'ny porofo efa anananao. Tsy misy mivoaka ny volanao raha tsy efa nohamarininao fa tonga ny tapakila.",
  "wallet.send.stale_fee_note":
    "{days} andro lasa izay no nijerena farany ny saram-pandoavana. Raha nampiakatra ny azy ity mpamoaka ity taorian'izay, dia mety ho lafo kely kokoa ny fandefasana.",
  "wallet.send.fee_note":
    "{spend} {unit} no mivoaka amin'ny volanao; ny {fee} fanampiny dia manefa ny saran'ny mpamoaka izay tokony haloany",
  "wallet.send.qr_too_big":
    "Zaraina amin'ny vola madinika be loatra ity tapakila ity ka tsy mifanentana amin'ny kaody QR. Zarao na adikao, na havaozy any amin'ny mpamoaka mba hampiraisana azy.",
  "wallet.send.bearer_note":
    "Izay mitana ity andalan-tsoratra ity no tompon'ny vola. Voatokana fa tsy lany ny porofo: raha tsy tonga tany amin'olona izy, dia azonao averina ao amin'ny Miandry.",
  "wallet.send.qr_too_big_short":
    "Zaraina amin'ny vola madinika be loatra ity tapakila ity ka tsy mifanentana amin'ny kaody QR. Zarao na adikao.",
  "wallet.send.scan_note":
    "Angataho izy haka sary ity avy amin'ny kitapom-bolany. Mbola azo averina mandra-panamarikanao azy ho voatatitra.",
  "wallet.send.mesh_note":
    "Mivoaka ho hafatra mivantana voafono amin'ny harato ny tapakila. Tsy mila Internet.",
  "wallet.send.no_peers_note":
    "Sokafy ny takelaka Harato mba hitadiavana fitaovana akaiky, na zarao amin'ny fomba hafa ny tapakila.",
  "wallet.send.send_to": "Alefaso amin'i {name}",
  "wallet.send.memo":
    "Fanamarihana (tsy voatery, mandeha miaraka amin'ny tapakila)",
  "wallet.send.building": "Amboarina…",
  "wallet.send.build": "Amboary ny tapakila",
  "wallet.send.inexact_body":
    "Tsy mahavita {amount} {unit} tsy misy Internet ny porofonao. Ny tapakila kely indrindra azonao amboarina dia {spend} {unit}, ary tsy misy fanoloran-tsisa raha tsy misy Internet: ny {extra} {unit} fanampiny dia lasan'ny mpandray.\n\nNy fanavaozana any amin'ny mpamoaka rehefa misy Internet dia hizara ny porofonao ho sanda mahalasa ny marina.",
  "wallet.send.send_amount": "Alefaso {amount}",
  "wallet.send.sent_to": "{amount} {unit} nalefa tany amin'i {name}",
  "wallet.send.sent_to_body":
    "{route} Mbola azo averina ao amin'ny Miandry izy mandra-panamafisanao fa nandray izy, na mandra-pilazan'ny mpamoaka fa novidina ny porofo.",
  "wallet.send.copy_token": "Adikao ny tapakila",
  "wallet.send.share_token": "Zarao ny tapakila",
  "wallet.send.open_in_wallet":
    "Sokafy ity tapakila ity amin'ny kitapom-bola hafa",
  "wallet.send.open_in_wallet_short": "Sokafy amin'ny kitapom-bola",
  "wallet.send.to_peer": "Alefaso amin'ny teboka akaiky ny tapakila",
  "wallet.send.to_peer_short": "Alefaso amin'ny teboka",
  "wallet.send.mark_delivered": "Mariho ho voatatitra ary vitao",
  "wallet.send.they_got_it": "Nandray izy",
  "wallet.send.keep_pending": "Avelao hiandry ity fandefasana ity",
  "wallet.send.decide_later": "Hanapa-kevitra any aoriana",
  "wallet.send.no_peers": "Tsy misy teboka ao anatin'ny fetra",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Ny fandoavam-bolanao ihany ity",
  "wallet.receive.own_payment_body":
    "Mbola voatokana ho an'ny fandefasana tsy mbola vitanao ireto vola madinika ireto, ka tsy misy azo raisina. Ampiasao ny Avereno amin'io fandoavam-bola io mba hamerenana azy mivantana amin'ny volanao.",
  "wallet.receive.already_have": "Efa ao amin'ny kitapom-bolanao",
  "wallet.receive.already_have_body":
    "Efa voatahiry eto avokoa ny porofo rehetra amin'ity tapakila ity, ka tsy nisy nampiana. Tsy niova ny vola.",
  "wallet.receive.stored_unconfirmed":
    "Voatahiry avy amin'i {mint}, saingy tsy mbola voamarina amin'ny mpamoaka ({reason}).",
  "wallet.receive.offline": "tsy misy Internet",
  "wallet.receive.redeemed_here":
    "Novidina tao amin'i {mint}. Anao irery izao ireo porofo ireo: tsy miasa intsony ny dikan'ny mpandefa.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Novidina tao amin'i {mint}. Azo porofoina fa anao izy izao: tsy miasa intsony ny dikan'ity tapakila ity teo an-tanan'ny mpandefa.",
  "wallet.receive.stored_pending":
    "Voatahiry avy amin'i {mint}, saingy tsy mbola nohamarinin'ny mpamoaka fa tsy lany izy{dleq}. Havaozy avy amin'ny takelaka Kitapom-bola rehefa an-tserasera ianao.",
  "wallet.receive.dleq_inline":
    " (mifanaraka tokoa ny soniany, ka tena izy ny tapakila)",
  "wallet.receive.dleq_ok":
    "Mifanaraka ny sonian'ny mpamoaka, ka tena izy ny tapakila.",
  "wallet.receive.dleq_uncached":
    "Tsy voatahiry eto ny lakilen'ny mpamoaka, ka tsy voamarina tsy misy Internet ny sonia.",
  "wallet.receive.dleq_warning":
    "Mandra-panavaozanao an-tserasera, dia mety efa nolanian'ny mpandefa tany an-toeran-kafa izy.",
  "wallet.receive.failed": "Tsy voaray",
  "wallet.receive.title": "Mandray ecash",
  "wallet.receive.body":
    "Apetaho ny tapakila Cashu. Rehefa an-tserasera dia vidina avy hatrany any amin'ny mpamoaka izy; raha tsy misy Internet dia tehirizina ary hamarinina amin'ny fanavaozana manaraka.",
  "wallet.receive.scan": "Alaivo sary ny kaody QR ecash",
  "wallet.receive.scan_short": "Alaivo sary ny QR",
  "wallet.receive.receiving": "Raisina…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap voaray avy amin'i {from}… ary novidina tao amin'ny kitapom-bolanao.",
  "wallet.zap.title": "Mandefa zap amin'ny maha-izy azy Nostr",
  "wallet.zap.not_npub": "tsy npub",
  "wallet.zap.bad_key": "lakile diso",
  "wallet.zap.invalid_pubkey": "Tsy mety ny lakile ho an'ny daholobe",
  "wallet.zap.invalid_pubkey_body":
    "Soraty npub1… na lakile ho an'ny daholobe Nostr hexa misy litera 64.",
  "wallet.zap.sent": "Nalefa ny Nutzap",
  "wallet.zap.failed": "Tsy nahomby ny zap",
  "wallet.zap.body":
    "Raha mamoaka ny mombamomba ny nutzap NIP-61 izy, dia mihidy amin'ny lakiley ny ecash ka tsy misy afaka mandany azy, ary tsy azo averina. Raha tsia, dia mandeha ho tapakila azo averina izy. Holazaina anao izay nitranga.",
  "wallet.zap.contact": "Mandefa zap amin'i {name}",
  "wallet.zap.pubkey_placeholder": "npub1… na hexa misy litera 64",
  "wallet.zap.sending": "Alefa…",
  "wallet.nostr.copied_body":
    "Omeo olona ity dia afaka mandefa zap aminao avy amin'ny Airhop na kitapom-bola Nostr hafa izy, tsy mila Bluetooth.",
  "wallet.nostr.copy_key":
    "Adikao ny lakilenao Nostr mba handefasan'ny olona zap aminao",
  "wallet.nostr.your_key": "Ny lakilenao Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Voampiditra ny mpamoaka",
  "wallet.mint.add_failed": "Tsy voampiditra ny mpamoaka",
  "wallet.mint.added_named": "Voampiditra i {name}",
  "wallet.mint.added_body":
    "Mamoaka {units} i {mint}. Voatahiry eto amin'ity fitaovana ity ny lakiley, ka azo hamarinina na dia tsy misy Internet aza ny tapakila avy aminy izao.",
  "wallet.mint.remove_plain":
    "Hesorina amin'ny kitapom-bolanao i {mint}? Lasa koa ny lakiley voatahiry, ka tsy ho azo hamarinina tsy misy Internet intsony ny tapakila avy aminy.",
  "wallet.mint.title": "Mpamoaka",
  "wallet.mint.none": "Mbola tsy misy mpamoaka",
  "wallet.mint.none_desc":
    "Ny mpamoaka no mamoaka sy mividy ny ecash-nao. Manampia iray mba hametraka vola amin'ny Lightning, na mandraisa tapakila fotsiny dia ho voampiditra ho anao ny mpamoakany.",
  "wallet.mint.add": "Manampy mpamoaka",
  "wallet.mint.add_body":
    "Ny mpamoaka no mitana ny Bitcoin manohana ny ecash-nao, ka fidio izay hatokisanao amin'ny vola apetrakao ao. Hamarinina alohan'ny hitehirizana azy ny URL. Ampandehano ny anao amin'ny Nutshell raha tsy te hatoky olona ianao.",
  "wallet.mint.consolidate_body":
    "Mpamoaka iray ihany no azon'ny tapakila tononina, ka ny vola miparitaka amin'ny maromaro dia tsy afaka mandoa mihoatra noho izay tazonin'ny lehibe indrindra. Afaka mamindra azy ny Airhop: ny mpamoaka hafa tsirairay dia mandoa faktiora Lightning navoakan'ilay nofidinao. Mila saran-dalana kely ary mila Internet.",
  "wallet.mint.add_short": "Manampy",
  "wallet.mint.checking": "Hamarinina…",
  "wallet.mint.remove_with_balance": "Hesorina ny mpamoaka misy vola?",
  "wallet.mint.remove": "Esory ny mpamoaka",
  "wallet.mint.delete_anyway": "Fafao ihany",
  "wallet.mint.consolidate": "Afindrao amin'ny mpamoaka iray ny vola rehetra",
  "wallet.mint.confirm_with": "Hamarino amin'i {mint} ny porofo",
  "wallet.mint.remove_a11y": "Esory i {mint}",
  "wallet.mint.available_amount": "{amount} {unit} misy",
  "wallet.mint.split_across":
    "Miparitaka amin'ny mpamoaka {count} ny vola. Afindrao amin'ny iray.",
  "wallet.mint.move_everything_to": "Afindrao any amin'i {mint} ny rehetra",
  "wallet.mint.consolidate_title": "Afindrao amin'ny mpamoaka iray",
  "wallet.mint.moving": "Afindra…",
  "wallet.mint.move": "Afindrao",
  "wallet.mint.moved": "Nafindra",
  "wallet.mint.moved_body":
    "{amount} {unit} no ao amin'i {mint} izao, taorian'ny {fees} {unit} saran-dalana Lightning.",
  "wallet.mint.nothing_moved": "Tsy nisy nafindra",
  "wallet.mint.destination": "· toerana aleha",
  "wallet.mint.will_move": "· hafindra",
  "wallet.mint.issued_by": "Navoakan'i",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Fanampiana vola ao amin'ny kitapom-bola Airhop",
  "wallet.ln.invoice_failed": "Tsy voaforona ny faktiora",
  "wallet.ln.price_failed": "Tsy voakajy ny sandan'ity faktiora ity",
  "wallet.ln.paid": "Voaloa",
  "wallet.ln.deposit_credited":
    "Voaloa ny faktiora ary namoaka {amount} {unit} i {mint}. Voamarina ity vola ity: azonao lanina tsy misy Internet avy hatrany.",
  "wallet.ln.withdrawn":
    "{paid} sat voaloa tamin'ny Lightning. Naka {fee} sat saran-dalana ny mpamoaka.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sat voaloa tamin'ny Lightning. Naka {fee} sat saran-dalana ny mpamoaka, ary namerina {change} sat tamin'ny voatokana tao amin'ny volanao.",
  "wallet.ln.payment_failed": "Tsy nahomby ny fandoavam-bola",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Ovay ho ecash azonao lanina tsy misy Internet ny sat avy amin'ny Lightning, na esory ny ecash ho amin'ny faktiora Lightning rehetra. Samy mila Internet sy mpamoaka izy roa.",
  "wallet.ln.deposit_body":
    "Manome faktiora anao ny mpamoaka. Aloavy amin'ny kitapom-bola Lightning rehetra izy ary hiverina ho ecash azonao lanina tsy misy Internet ny sat.",
  "wallet.ln.pay_invoice_for":
    "Aloavy ity faktiora {amount} {unit} ity. Manaraka ny fandoavam-bola ny kitapom-bola ary hamoaka ny ecash-nao ho azy.",
  "wallet.ln.expired_body":
    "Lany daty ity faktiora ity. Raha efa naloanao izy, dia hampidirina ho azy ny vola.",
  "wallet.ln.waiting_expires":
    "Miandry fandoavam-bola · lany daty afaka {countdown}",
  "wallet.ln.withdraw_body":
    "Apetaho ny faktiora bolt11 dia haloan'ny mpamoaka amin'ny ecash-nao izy. Homena tolotra momba ny tahiry saran-dalana aloha ianao; izay tsy lanin'ny lalana dia miverina amin'ny volanao.",
  "wallet.ln.up_to": "hatramin'ny {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Aloavy {amount} {unit}",
  "wallet.ln.deposit": "Mametraka sat amin'ny Lightning",
  "wallet.ln.deposit_short": "Mametraka",
  "wallet.ln.withdraw": "Manaisotra ho amin'ny faktiora Lightning",
  "wallet.ln.withdraw_short": "Manaisotra",
  "wallet.ln.deposit_title": "Mametraka amin'ny Lightning",
  "wallet.ln.amount_placeholder": "Sanda amin'ny sat",
  "wallet.ln.requesting": "Mangataka…",
  "wallet.ln.get_invoice": "Maka faktiora",
  "wallet.ln.copy_invoice": "Adikao ny faktiora",
  "wallet.ln.open_wallet": "Sokafy amin'ny kitapom-bola Lightning",
  "wallet.ln.open_wallet_short": "Sokafy amin'ny kitapom-bola",
  "wallet.ln.waiting": "Miandry fandoavam-bola…",
  "wallet.ln.new_invoice": "Mamorona faktiora vaovao",
  "wallet.ln.new_invoice_short": "Faktiora vaovao",
  "wallet.ln.withdraw_title": "Manaisotra ho amin'ny Lightning",
  "wallet.ln.scan_invoice": "Alaivo sary ny kaody QR-n'ny faktiora Lightning",
  "wallet.ln.paid_from": "Naloa avy amin'ny",
  "wallet.ln.invoice": "Faktiora",
  "wallet.ln.routing_reserve": "Tahiry saran-dalana",
  "wallet.ln.reserved": "Voatokana avy amin'ny vola",
  "wallet.ln.paying": "Mandoa…",
  "wallet.ln.get_quote": "Maka tolotra",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Tahiry",
  "wallet.backup.setup_failed": "Tsy voaforona ny tahiry",
  "wallet.backup.on": "Mandeha ny tahiry",
  "wallet.backup.on_body":
    "Azo amboarina indray avy amin'ireo teny roa ambin'ny folo ireo izao ny volanao.\n\nNy zavatra nomen'olon-kafa anao dia mijanona ivelan'ny andian-teny mandra-panavaozanao any amin'ny mpamoaka, ary mila ny lisitry ny mpamoakanao ny famerenana, ka soraty eo akaikin'ny teny izy.",
  "wallet.backup.no_phrase": "Tsy misy andian-teny voatahiry",
  "wallet.backup.no_phrase_body":
    "Tsy voavaky avy amin'ny fitehirizan-dakilen'ny fitaovana ny andian-teny famerenana. Vahao ny fitaovana ary andramo indray.",
  "wallet.backup.replace_title": "Hosoloina ny andian-teninao ankehitriny?",
  "wallet.backup.replace_body":
    "Efa manana andian-teny famerenana ianao. Ny famerenana iray hafa dia manolo azy. Ny vola madinika efa voarakotry ny andian-teny taloha dia mbola azo lanina eto amin'ity fitaovana ity, fa tsy azo averina intsony, ka hamarino fa voasoratra ny teny taloha alohan'ny hanohizanao.",
  "wallet.backup.replace": "Soloy",
  "wallet.backup.invalid_phrase": "Tsy mety io andian-teny io",
  "wallet.backup.invalid_phrase_body":
    "Manana marika fanamarinana ao anatiny ny andian-teny ary tsy lany izy io. Tadiavo raha misy teny diso soratra, tsy ampy, na nifamadika.",
  "wallet.backup.not_bip39":
    "Tsy teny BIP-39 ireto: {words}. Jereo ny fanoratana.",
  "wallet.backup.add_mint_first": "Manampia mpamoaka aloha",
  "wallet.backup.add_mint_first_body":
    "Miasa amin'ny fanontaniana ny mpamoaka hoe vola madinika inona no nosoniaviny ho anao ny famerenana, ka mila mahafantatra izay hanontaniana izy. Ampio ny mpamoaka nampiasainao, avy eo averino.",
  "wallet.backup.restore_failed": "Tsy nahomby ny famerenana",
  "wallet.backup.phrase": "Andian-teny famerenana",
  "wallet.backup.state_unconfirmed": "Mandeha ny tahiry fa tsy voamarina",
  "wallet.backup.state_off": "Vonoina ny tahiry",
  "wallet.backup.badge_on": "Mandeha",
  "wallet.backup.badge_unconfirmed": "Tsy voamarina",
  "wallet.backup.badge_off": "Vonoina",
  "wallet.backup.view": "Jereo ny andian-teny famerenana",
  "wallet.backup.setup": "Mametraka andian-teny famerenana",
  "wallet.backup.view_short": "Jereo ny andian-teny",
  "wallet.backup.setup_short": "Ametraho",
  "wallet.backup.restore":
    "Mamerina kitapom-bola avy amin'ny andian-teny famerenana",
  "wallet.backup.restore_short": "Avereno",
  "wallet.backup.setup_title": "Mametraka andian-teny famerenana",
  "wallet.backup.on_body_short":
    "Azo amboarina indray amin'ny fitaovana vaovao avy amin'ny teninao roa ambin'ny folo ny volanao.",
  "wallet.backup.unconfirmed_body":
    "Tsy mbola nanamafy ianao fa nanoratra dika mitovy. Amin'izao fotoana izao dia eto amin'ity findy ity ihany no misy ny teny, nefa izay indrindra no tokony ho tafavoaka amin'ny tahiry. Jereo ny andian-teny ary soraty.",
  "wallet.backup.not_covered":
    "{amount} no mbola tsy voarakotra. Ny vola madinika nomena anao dia mitondra ny tsiambaratelon'izay nandefa azy, ka tafiditra ao anatin'ny andian-teninao ihany izy rehefa voatakalo. Havaozy mpamoaka iray mba hiarovana azy ireo.",
  "wallet.backup.off_body":
    "Eto amin'ity findy ity ihany no misy ny ecash-nao. Raha very izy, tsy misy afaka mamerina ny vola, na ianao aza. Teny roa ambin'ny folo afaka manamboatra indray ny volanao na aiza na aiza ny andian-teny famerenana.",
  "wallet.backup.about_to_see":
    "Efa hahita teny roa ambin'ny folo ianao. Izy ireo no vola.",
  "wallet.backup.exact_order":
    "Teny roa ambin'ny folo, araka ity filaharana ity. Izay manana azy dia manana ny volanao.",
  "wallet.backup.verify_body":
    "Ny andian-teny tsy nosoratan'olona dia ratsy kokoa noho ny tsy fananana andian-teny, satria toa harato fiarovana izy nefa tsy misy. Teny roa hanamafisana.",
  "wallet.backup.verify_mismatch": "Tsy mifanaraka. Jereo ny dika nosoratanao.",
  "wallet.backup.restore_body":
    "Soraty ny teny roa ambin'ny folo. Amboarin'ny Airhop indray ny vola madinikao ary anontaniany ny mpamoaka tsirairay hoe iza amin'izy ireo no nosoniaviny, ka miverina avy amin'ny firaketana tehirizin'ny mpamoaka ny vola.",
  "wallet.backup.warn_secret":
    "Izay mamaky azy dia afaka maka ny volanao. Aza maka sarin'efijery ary aza mitahiry azy eto amin'ity findy ity.",
  "wallet.backup.warn_paper":
    "Soraty amin'ny taratasy izy ary tehirizo any amin'ny toerana azo antoka. Tsy afaka mampiseho azy indray aminao ny Airhop raha very ny findy.",
  "wallet.backup.warn_scope":
    "Ny ecash-nao ihany no amboariny indray. Tsy voarakotra ny maha-ianao anao, ny resakao ary ny fifandraisanao.",
  "wallet.backup.warn_mints":
    "Tsy maintsy manontany ny mpamoaka hoe vola madinika inona no nosoniaviny ny famerenana, ka soraty eo akaikin'ny teny ny lisitry ny mpamoakanao.",
  "wallet.backup.preparing": "Amboarina…",
  "wallet.backup.show_phrase": "Asehoy ny andian-teniko",
  "wallet.backup.your_phrase": "Ny andian-teny famerenanao",
  "wallet.backup.write_down": "Soraty ireto",
  "wallet.backup.copy_phrase":
    "Adikao amin'ny takelaka fitehirizana ny andian-teny famerenana",
  "wallet.backup.copy_clipboard": "Adikao amin'ny takelaka fitehirizana",
  "wallet.backup.written_down": "Efa nosoratako izy ireo",
  "wallet.backup.check_copy": "Jereo ny dikanao",
  "wallet.backup.confirm": "Hamafiso",
  "wallet.backup.restore_title": "Mamerina avy amin'ny andian-teny",
  "wallet.backup.phrase_placeholder":
    "teny roa ambin'ny folo, sarahina elanelana",
  "wallet.backup.no_mints_yet":
    "Mbola tsy misy mpamoaka nampiana. Tsy maintsy manontany mpamoaka manokana ny famerenana, ka ampio aloha ireo nampiasainao.",
  "wallet.backup.scanning": "Karohina…",
  "wallet.backup.restore_progress":
    "{mint} · andiam-dakile {step} amin'ny {total}",
  "wallet.backup.will_scan":
    "Hokarohina: {mints}. Ny mpamoaka tsy nampidirinao dia tsy anontaniana mihitsy, ka tsy hita ny vola any.",
  "wallet.backup.word_n": "Teny {position}",
  "wallet.backup.unreachable_mints":
    "Tsy tratra: {mints}. Mbola misy ihany ny vola any. Andramo indray rehefa tsara kokoa ny fifandraisana.",
  "wallet.backup.nothing_recovered":
    "Tsy nisy voaverina avy amin'ny mpamoaka nokarohina.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Hamarihina ho voaray?",
  "wallet.delivered.body":
    "Mamotsotra ny {amount} {unit} tanteraka izany. Raha tsy tonga mihitsy izy, dia tsy ho afaka mamerina azy ianao.",
  "wallet.delivered.body_generic":
    "Mamotsotra ny sanda voatokana tanteraka izany. Raha tsy tonga mihitsy izy, dia tsy ho afaka mamerina azy ianao.",
  "wallet.delivered.cancel": "Tsy mbola",
  "wallet.delivered.confirm": "Nandray izy",
  "wallet.reclaim.title": "Haverina ity tapakila ity?",
  "wallet.reclaim.body":
    "Miverina amin'ny volanao ny {amount} {unit}. Ataovy izany raha tsy tonga tany amin'olona mihitsy ny tapakila: raha efa manana ilay andalan-tsoratra izy, dia izay mividy azy voalohany any amin'ny mpamoaka no mitana ny vola, ary mety ho izy izany.",
  "wallet.reclaim.keep": "Avelao hiandry",
  "wallet.reclaim.confirm": "Avereno",
  "wallet.copied.token_body":
    "Ao amin'ny takelaka fitehirizanao ny tapakila. Mijanona voatokana eto izy mandra-panamarikanao azy ho voatatitra, ka azonao apetaka indray raha tsy nahomby ny andrana voalohany.",
  "wallet.copied.phrase_body":
    "Apetaho ao amin'ny mpitantana teny miafina izy, avy eo fafao ny takelaka fitehirizana. Vakin'ny rindranasa hafa izy, ary amin'ny fandrindrana sasany dia mifanaraka amin'ny fitaovanao hafa.",
  "wallet.refresh.failed": "Tsy nahomby ny fanavaozana",
  "wallet.refresh.partly": "Nohavaozina ampahany",
  "wallet.refresh.done": "Nohavaozina",
  "wallet.refresh.unreachable":
    "Tsy tratra i {mints}. Efa vaovao daholo ny ambiny.",
  "wallet.refresh.swapped":
    "{amount} {unit} voamarina ary natakalo porofo vaovao.",
  "wallet.refresh.secured":
    "{amount} {unit} no voarakotry ny andian-teny famerenanao izao.",
  "wallet.refresh.all_confirmed":
    "Efa voamarina tamin'ny mpamoaka avokoa ny zavatra rehetra eto.",
  "wallet.pending.title": "Miandry",
  "wallet.pending.reserved_desc":
    "Voaforona sy voatokana, tsy voamarina ny fanaterana. Esorina amin'ny volanao ny porofo mba tsy ho lany indroa.",
  "wallet.pending.locked_desc":
    "Efa mihidy amin'ny lakilen'ny mpandray, ka izy irery no afaka mandany azy. Tsy mbola tonga taminy fotsiny izy. Zarao ny tapakila mba hamitana.",
  "wallet.pending.show_qr": "Asehoy ho kaody QR ity tapakila ity",
  "wallet.pending.copy_again": "Adikao indray ny tapakila",
  "wallet.pending.share_again": "Zarao indray ny tapakila",
  "wallet.pending.mark_delivered": "Mariho ho voatatitra ity tapakila ity",
  "wallet.pending.delivered": "Voatatitra",
  "wallet.pending.reclaim_into": "Avereno amin'ny volanao ity tapakila ity",
  "wallet.activity.title": "Hetsika",
  "wallet.activity.none": "Mbola tsy misy",
  "wallet.activity.none_desc":
    "Hiseho eto ny fandoavam-bola alefanao sy raisinao, ny vaovao indrindra aloha, miaraka amin'ny mpamoaka sy ny saran'ny tsirairay.",
  "wallet.activity.show_fewer": "Asehoy fandoavam-bola vitsy kokoa",
  "wallet.activity.show_less": "Asehoy vitsy kokoa",
  "wallet.activity.received_unconfirmed": "Voaray, tsy voamarina",
  "wallet.activity.received": "Voaray",
  "wallet.activity.receive_failed": "Tsy voaray",
  "wallet.activity.reclaimed": "Naverina",
  "wallet.activity.send_failed": "Tsy voalefa",
  "wallet.activity.sent": "Nalefa",
  "wallet.activity.status_pending": "miandry",
  "wallet.activity.status_failed": "tsy nahomby",
  "wallet.activity.status_reclaimed": "naverina",
  "wallet.activity.status_expired": "lany daty",
  "wallet.activity.ln_deposit": "Fametrahana Lightning",
  "wallet.activity.ln_withdrawal": "Fanesorana Lightning",
  "wallet.activity.nutzap_received": "Nutzap voaray",
  "wallet.activity.spent_removed": "Nesorina ny porofo lany",
  "wallet.activity.refreshed": "Nohavaozina ny porofo",
  "wallet.activity.refreshing": "Havaozina ny porofo",
  "wallet.activity.just_now": "vao izao",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Tsy mandeha ny harato",
  "wallet.mesh_offline_body":
    "Tsy mandeha ny serivisin'ny harato, ka tsy misy hanolorana ny tapakila. Mijanona voatokana ao amin'ny Miandry izy.",
  "wallet.xfer.route_mesh":
    "Natolotra mivantana tamin'ny fitaovany tamin'ny harato.",
  "wallet.xfer.route_nostr":
    "Tany ivelan'ny fetran'ny Bluetooth izy, ka tamin'ny Internet no nandehanany.",
  "wallet.xfer.route_courier":
    "Tsy misy lalana mankany aminy izao. Hoentin'ny fitaovana hafa izy ary hatolotra rehefa misy mahatratra azy.",
  "wallet.xfer.route_queued":
    "Tsy tratra izy aloha. Am-pilaharana izy ary halefa raha vao azo atao.",
  "wallet.xfer.mesh_offline_body":
    "Tsy mandeha ny serivisin'ny harato, ka tsy misy fomba hanolorana ny tapakila. Tsy nisy nesorina.",
  "wallet.xfer.could_not_send": "Tsy voalefa",
  "wallet.xfer.inexact_body":
    "Tsy mahavita {amount} {unit} tsy misy Internet ny porofonao. Ny tapakila kely indrindra azonao amboarina dia {spend} {unit}, ary lasany ny {extra} {unit} fanampiny tsy misy fomba hamerenana azy.\n\nNy fanavaozana any amin'ny mpamoaka rehefa misy Internet dia mizara ny porofonao ho sanda mahalasa ny marina.",
  "wallet.xfer.send_amount": "Alefaso {amount}",
  "wallet.xfer.mesh_offline": "Tsy mandeha ny harato",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Mihidy amin'ny lakiley ary navoaka tao amin'ny Nostr. Azy izy, na an-tserasera izy na tsia.",
  "wallet.pay.rail_nutzap_dm":
    "Mihidy amin'ny lakiley. Tsy nandray azy ny mpanelanelana, ka tonga taminy ho hafatra izy.",
  "wallet.pay.rail_nutzap_undelivered":
    "Mihidy amin'ny lakiley, saingy mbola tsy nisy nitondra azy. Am-pilaharana izy, ary ao amin'ny Miandry ny tapakila.",
  "wallet.pay.final":
    "Tsy azo averina ny fandoavam-bola mihidy: ny lakiley ihany no afaka mandany ireo vola madinika ireo izao.",
  "wallet.pay.reclaimable":
    "Mbola azo averina avy amin'ny takelaka Kitapom-bola izy mandra-panamafisanao fa tonga izy.",
  "wallet.pay.why": "Nalefa toy izao satria {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} ho an'i {name}",
  "wallet.pay.thread_receipt":
    "Nandefa {amount} {unit} ianao, mihidy amin'ny lakiley.",
  "wallet.pay.title": "Mandefa ecash",
  "wallet.pay.to": "Ho an'i {name}",
  "wallet.pay.amount": "Sanda amin'ny sat",
  "wallet.pay.memo": "Fanamarihana (tsy voatery, ho an'ny daholobe)",
  "wallet.pay.send": "Alefaso",
  "wallet.pay.sending": "Alefa…",
  "wallet.pay.action": "Mandefa ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Fidirana amin'ny fakan-tsary",
  "wallet.scan.camera_purpose": "haka sary kaody QR ecash",
  "wallet.scan.photo_label": "Fidirana amin'ny sary",
  "wallet.scan.photo_purpose": "hamaky QR ecash avy amin'ny sary",
  "wallet.scan.no_token": "Tsy nahitana tapakila ecash tao amin'io sary io.",
  "wallet.scan.no_invoice":
    "Tsy nahitana faktiora Lightning tao amin'io sary io.",
  "wallet.scan.unreadable": "Tsy voavaky io sary io.",
  "wallet.scan.camera_failed":
    "Tsy afaka nandefa ny fakan-tsary. Akatony ny rindranasa fakan-tsary hafa ary andramo indray.",
  "wallet.scan.close": "Akatony ny mpaka sary",
  "wallet.scan.on_device":
    "Vakiana eto amin'ity fitaovana ity izy; tsy misy alefa na aiza na aiza.",
  "wallet.scan.aim_token": "Atodiho amin'ny kaody QR ecash.",
  "wallet.scan.aim_invoice":
    "Atodiho amin'ny kaody QR-n'ny faktiora Lightning.",
  "wallet.scan.title_token": "Alaivo sary ny ecash",
  "wallet.scan.title_invoice": "Alaivo sary ny faktiora",
  "wallet.scan.desc_token":
    "Vakio ny tapakila Cashu avy amin'ny kitapom-bola hafa. Miasa amin'ny kitapom-bola Cashu rehetra, fa tsy amin'ny Airhop ihany.",
  "wallet.scan.desc_invoice":
    "Vakio ny faktiora Lightning mba handoavana azy amin'ny volanao.",
  "wallet.scan.use_camera_a11y": "Alaivo sary amin'ny fakan-tsary",
  "wallet.scan.use_camera": "Ampiasao ny fakan-tsary",
  "wallet.scan.pick_image_a11y": "Vakio ny kaody QR avy amin'ny sary voatahiry",
  "wallet.scan.pick_image": "Fidio avy amin'ny sary",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Inona ny Cashu?",
  "wallet.explain.intro":
    "Ecash ho an'ny Bitcoin ny Cashu. Ny tapakila dia andalan-tsoratra mitentina vola ho an'izay mitana azy, nosoniavin'ny mpamoaka tsy nahitany, ka tsy fantany hoe iza no nandany inona. Tsy misy kaonty, tsy misy fidirana.",
  "wallet.explain.send": "Mandefa",
  "wallet.explain.send_desc":
    "Manova sanda ho tapakila azonao atolotra amin'ny teboka akaiky amin'ny Bluetooth, na zaraina ho lahatsoratra. Miasa tsy misy Internet. Mijanona voatokana ny porofo mandra-panamafisanao fa tonga izy.",
  "wallet.explain.receive": "Mandray",
  "wallet.explain.receive_desc":
    "Apetaho ny tapakila mba hampidirana azy. Rehefa an-tserasera dia takalozana any amin'ny mpamoaka avy hatrany izy, ka azo porofoina fa anao. Raha tsy misy Internet dia tehirizina ary marihina ho tsy voamarina mandra-panavaozanao.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Mandoa amin'ny maha-izy azy Nostr. Raha mamoaka ny mombamomba ny nutzap NIP-61 izy, dia mihidy amin'ny lakiley ny ecash ka izy irery no afaka mandany azy. Raha tsia, dia miverina amin'ny hafatra mivantana voafono izy. Mila Internet.",
  "wallet.explain.add_mint": "Manampy mpamoaka",
  "wallet.explain.add_mint_desc":
    "Mitahiry ny mpamoaka mamoaka sy mividy ny ecash-nao, ary mitahiry ny lakiley ho an'ny daholobe mba hahazoana manamarina ny tapakila avy aminy tsy misy Internet. Fidio izay hatokisanao amin'ny vola apetrakao ao.",
  "wallet.explain.phrase": "Andian-teny famerenana",
  "wallet.explain.phrase_desc":
    "Avy amin'ny teny roa ambin'ny folo namboarin'ny kitapom-bola tany am-piandohana no niavian'ny vola madinikao, ka afaka manamboatra indray ny vola ny findy vaovao amin'ny fanontaniana ny mpamoakanao hoe vola madinika inona no nosoniaviny. Mandra-pahitanao sy fanoratanao azy, dia eto amin'ity findy ity ihany no misy azy ireo.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Mihidy ny kitapom-bola",
  "wallet.err.mint_unreachable": "Tsy tratra ny mpamoaka",
  "wallet.err.tor_blocked": "Voasakana raha mandeha ny Tor",
  "wallet.err.insufficient": "Tsy ampy ny vola",
  "wallet.err.exact_amount": "Tsy azo alefa io sanda marina io",
  "wallet.err.no_mint": "Tsy misy mpamoaka",
  "wallet.err.mint_unsupported": "Tsy afaka manao izany ny mpamoaka",
  "wallet.err.mint_refused": "Nandà ny mpamoaka",
  "wallet.err.unreadable": "Tapakila tsy voavaky",
  "wallet.err.rejected": "Nolavina ny tapakila",
  "wallet.err.already_spent": "Efa lany",
  "wallet.err.change_pending": "Voaloa, miandry ny sisa",
  "wallet.svc.mint_unreachable": "Tsy tratra ny mpamoaka.",
  "wallet.svc.tor_ios":
    "Amin'ny iOS dia tsy mandalo amin'ny Tor ny fangatahana any amin'ny mpamoaka.",
  "wallet.svc.tor_ios_body":
    "Ny WebSocket-n'ny Nostr ihany no fonosin'ny Arti, ka hahatratra ny mpamoaka amin'ny tambajotra misokatra ity fangatahana ity ary hampifandray ny IP-nao amin'ireo porofo ireo. Avelao ao amin'ny Fandrindrana > Fiarovana, na vonoy aloha ny Tor. Mbola mandeha ny fandefasana sy fandraisana ecash amin'ny harato.",
  "wallet.svc.tor_paused": "Mandeha ny Tor, fa tsy mifandray.",
  "wallet.svc.tor_paused_body":
    "Nitsahatra tsy nanondro lalana i Orbot, ka hahatratra ny mpamoaka amin'ny tambajotra misokatra ity fangatahana ity ary hampifandray ny IP-nao amin'ireo porofo ireo. Sokafy indray i Orbot, na vonoy ny Tor. Mbola mandeha ny fandefasana sy fandraisana ecash amin'ny harato.",
  "wallet.svc.keys_uncached":
    "Tsy voatahiry eto amin'ity fitaovana ity ny lakilen'ity mpamoaka ity.",
  "wallet.svc.keys_uncached_body":
    "Sokafy indray mandeha ny kitapom-bola rehefa an-tserasera mba haka azy ireo.",
  "wallet.svc.phrase_invalid": "Tsy mety io andian-teny famerenana io.",
  "wallet.svc.phrase_invalid_body":
    "Tadiavo raha misy teny diso soratra na tsy ampy. Manana marika fanamarinana ao anatiny ny andian-teny, ka teny iray diso dia manimba ny rehetra.",
  "wallet.svc.need_mint": "Manampia mpamoaka iray farafahakeliny aloha.",
  "wallet.svc.need_mint_body":
    "Miasa amin'ny fanontaniana ny mpamoaka hoe vola madinika inona no nosoniaviny ho anao ny famerenana, ka mila mahafantatra izay hanontaniana izy.",
  "wallet.svc.restored": "Naverina avy amin'ny andian-teny famerenana",
  "wallet.svc.storage_locked": "Mihidy ny fitehirizan'ny kitapom-bola.",
  "wallet.svc.storage_locked_body":
    "Tehirizin'ny Airhop ao anaty rakitra voafono ny porofo ecash, ary ao amin'ny fitehirizan-dakilen'ny fitaovana ny lakilen'io rakitra io. Vahao ny fitaovana ary sokafy indray ny rindranasa.",
  "wallet.svc.bad_url": "Tsy URL mety izany.",
  "wallet.svc.needs_https":
    "Tsy maintsy manomboka amin'ny https:// ny URL-n'ny mpamoaka.",
  "wallet.svc.refuse_http":
    "Mandà ny hampiasa mpamoaka amin'ny http tsy voaaro izahay.",
  "wallet.svc.refuse_http_body":
    "Izay rehetra eo amin'ny lalan'ny tambajotra dia afaka mamaky na manova ny porofonao. Ampiasao ny mpamoaka https://.",
  "wallet.svc.mint_not_saved": "Tsy voatahiry ny mpamoaka.",
  "wallet.svc.unreadable_token": "Tsy tapakila Cashu voavaky izany.",
  "wallet.svc.unreadable_token_body":
    "Manomboka amin'ny cashuA na cashuB ny tapakila. Jereo raha tsy nisy notapahina teo am-panadikana.",
  "wallet.svc.wrong_mint":
    "Tsy nosoniavin'ny mpamoaka notononiny ity tapakila ity.",
  "wallet.svc.already_spent": "Efa lany ireo porofo ireo.",
  "wallet.svc.already_spent_body":
    "Ilay nandefa ity tapakila ity no nividy azy voalohany, na nandefa tapakila mitovy tamin'olon-kafa koa.",
  "wallet.svc.receiving_offline": "mandray tsy misy Internet",
  "wallet.svc.amount_positive": "Soraty sanda mihoatra ny aotra.",
  "wallet.svc.coins_raced":
    "Vao nampiasain'ny fandoavam-bola hafa ireo vola madinika ireo.",
  "wallet.svc.coins_raced_body":
    "Tsy nisy nesorina. Andramo indray dia hifidy andiany hafa ny kitapom-bola.",
  "wallet.svc.no_ecash": "Mbola tsy misy ecash.",
  "wallet.svc.no_ecash_body":
    "Manampia mpamoaka ary mametraha amin'ny Lightning, na mandraisa tapakila avy amin'olona.",
  "wallet.svc.split_across_mints":
    "Miparitaka amin'ny mpamoaka maromaro ny volanao.",
  "wallet.svc.mint_says_spent":
    "Nolazain'ny mpamoaka fa efa lany ireo porofo ireo.",
  "wallet.svc.issue_against_invoice":
    "mamoaka ecash mifanandrify amin'ny faktiora Lightning",
  "wallet.svc.pay_invoice": "mandoa faktiora Lightning",
  "wallet.svc.unknown_deposit": "Fametrahana tsy fantatra.",
  "wallet.svc.invoice_expired_before":
    "Lany daty ny faktiora talohan'ny nandoavana azy.",
  "wallet.svc.invoice_expired": "Lany daty io faktiora io.",
  "wallet.svc.invoice_unpaid": "Tsy mbola voaloa ny faktiora.",
  "wallet.svc.payment_unknown":
    "Tsy fantatra ny toe-javatry ny fandoavam-bola; hojerena indray amin'ny fanavaozana manaraka.",
  "wallet.svc.melt_change_pending": "Voaloa ny faktiorao.",
  "wallet.svc.melt_change_pending_body":
    "Tsy mbola namerina ny saran-dalana tsy lany ny mpamoaka. Raisina ho azy izy amin'ny fanavaozana manaraka, ary tsy misy very mandritra izany.",
  "wallet.svc.mint_did_not_pay":
    "Tsy nandoa ity faktiora ity ny mpamoaka. Tsy niova ny volanao.",
  "wallet.svc.not_an_invoice": "Tsy faktiora Lightning izany.",
  "wallet.svc.not_an_invoice_body":
    "Apetaho ny faktiora bolt11 manomboka amin'ny lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Tsy ampy ny vola ho an'ity faktiora ity.",
  "wallet.svc.coins_raced_invoice_body":
    "Tsy nisy nesorina ary tsy voaloa ny faktiora. Andramo indray.",
  "wallet.svc.same_mint": "Fidio mpamoaka hafa ho toerana aleha.",
  "wallet.svc.same_mint_body":
    "Mpamoaka mitovy ny loharano sy ny toerana aleha, ka tsy misy afindra.",
  "wallet.svc.quote_failed_retried":
    "Tsy nahomby ny tolotra, nandrama indray ny fampiraisana",
  "wallet.svc.amount_unfit_retried":
    "Tsy nety ny sanda, nandrama indray ny fampiraisana",
  "wallet.svc.cannot_size": "Tsy voafaritra ny halehiben'ity famindrana ity.",
  "wallet.svc.insufficient_at_mint": "Tsy ampy ny vola ao amin'i {mint}.",
  "wallet.svc.inexact_title":
    "Tsy mahavita {amount} {unit} tsy misy Internet ny porofonao.",
  "wallet.svc.inexact_detail":
    "Ny tapakila kely indrindra azonao alefa dia {spend} {unit}. Tsy misy fanoloran-tsisa raha tsy misy Internet, ka lasan'ny mpandray ny {extra} {unit} fanampiny.",
  "wallet.svc.no_single_mint":
    "Tsy misy mpamoaka manokana mitana {amount} {unit}. Tsy azo atambatra ho tapakila iray ny ecash avy amin'ny mpamoaka samihafa: ampiraiso aloha amin'ny mpamoaka iray, na alefaso amin'ny sanda samihafa.",
  "wallet.svc.have_tried_send":
    "Manana {total} {unit} ianao, ary nanandrana nandefa {amount}.",
  "wallet.svc.invoice_needs":
    "Mila {total} {unit} ity faktiora ity anisan'izany ny tahiry saran-dalana, ary manana {balance} ianao.",
  "wallet.svc.nothing_to_move": "Tsy manana {unit} afindra i {mint}.",
  "wallet.svc.consolidate_memo": "Fampiraisana avy amin'i {mint}",
  "wallet.svc.cannot_size_detail":
    "Taorian'ny saran-dalana Lightning, dia tsy afaka mamindra sanda ilaina any amin'i {to} i {from}. Andramo ny mamindra sanda kely voafaritra.",
  "wallet.svc.mint_cannot": "Tsy afaka {action} i {mint}.",
  "wallet.svc.no_nut": "Tsy manambara ny NUT-{nut} ny mpamoaka.",
  "wallet.svc.unknown_mint":
    "Manonona mpamoaka tsy ampiasainao io fandoavam-bola io.",
  "wallet.svc.unknown_mint_body":
    "Ampio ny tenanao aloha io mpamoaka io raha matoky azy ianao; tsy misy vidina avy amin'ny mpamoaka tsy nofidinao.",
  "wallet.svc.no_relay": "tsy misy fifandraisana amin'ny mpanelanelana",
  "wallet.svc.no_shared_mint": "tsy misy mpamoaka iombonana manana vola ampy",
  "wallet.svc.no_nutzap_info":
    "tsy namoaka ny mombamomba ny nutzap ny mpandray (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Mihidy amin'ny lakiley fa tsy mbola voatatitra. Zarao ny tapakila avy amin'ity fifanakalozana ity mba hamitana.",
  "wallet.svc.swap_lost":
    "Tsy vitan'ny mpamoaka mihitsy ity fifanakalozana ity, ka tsy nisy navoaka ho takalony.",
  "wallet.svc.swap_unreadable":
    "Voatahiry tamin'ny endrika tsy azon'ity kinova ity averina ity fifanakalozana ity.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Voamarina tamin'ny QR",
  "contacts.qr.keys_unverified": "Voaray ny lakile, tsy voamarina",
  "contacts.qr.not_verified": "Mbola tsy voamarina",
  "contacts.qr.message": "Hafatra",
  "contacts.qr.add": "Ampio fifandraisana",
  "contacts.qr.scan_title": "Alaivo sary ny kaody QR",
  "contacts.qr.aim": "Atodiho amin'ny kaody QR-ny ny fakan-tsarinao",
  "contacts.qr.add_desc": "Tratrao ny olona tsy akaiky eo amin'ny harato.",
  "contacts.qr.peer_id_hint":
    "Litera 16 ny ID-n'ny teboka. Manomboka amin'ny airhop: ny kaody fifandraisana.",
  "contacts.qr.or_scan": "na alaivo sary ny QR-ny",
  "contacts.qr.trust_note":
    "Ny QR alainao sary amin'ny fakan-tsarinao ihany no manamarina ny lakiley. Mitondra ny lakiley ny kaody apetaka, fa tsy porofo fa avy aminy izy.",
  "contacts.qr.peer_id": "ID-n'ny teboka na kaody fifandraisana",
  "contacts.qr.peer_id_placeholder": "Apetaho ID na kaody fifandraisana",
  "contacts.qr.scan_camera_a11y": "Alaivo sary amin'ny fakan-tsary ny kaody QR",
  "contacts.qr.scan_camera_desc": "Ampiasao ny fakan-tsarinao",
  "contacts.qr.upload_a11y": "Ampidiro ny sary QR avy amin'ny tahiry",
  "contacts.qr.upload": "Ampidiro avy amin'ny tahiry",
  "contacts.qr.upload_desc": "Fidio sary QR voatahiry",
  "contacts.qr.scan_a11y": "Ampio fifandraisana amin'ny fakana sary kaody QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Apetaho ID-n'ny teboka misy litera 16, rohy airhop://peer/…, na kaody fifandraisana.",
  "contacts.scan.camera_label": "Fidirana amin'ny fakan-tsary",
  "contacts.scan.camera_purpose": "haka sary ny kaody QR-n'ny fifandraisana",
  "contacts.scan.camera_needed":
    "Mila fidirana amin'ny fakan-tsary raha haka sary. Mbola azonao ampiana amin'ny ID-n'ny teboka izy.",
  "contacts.scan.camera_failed":
    "Tsy afaka nandefa ny fakan-tsary. Akatony ny rindranasa fakan-tsary hafa ary andramo indray.",
  "contacts.scan.photo_label": "Fidirana amin'ny sary",
  "contacts.scan.photo_purpose": "haka sary kaody QR notehirizinao",
  "contacts.scan.photo_needed":
    "Mila fidirana amin'ny sary raha hifidy sary. Mbola azonao ampiana amin'ny ID-n'ny teboka izy.",
  "contacts.scan.no_qr": "Tsy nahitana kaody QR Airhop tao amin'io sary io.",
  "contacts.scan.unreadable": "Tsy voavaky ny kaody QR tao amin'io sary io.",
  "contacts.scan.bitchat_expired":
    "Lany daty io kaody bitchat io. Angataho izy hanokatra indray ny QR-ny.",
  "contacts.scan.tampered":
    "Tsy mety ity kaody QR ity: tsy mifanaraka amin'ny lakiley ny ID-n'ny tebony. Mety novàna izy.",
  "contacts.scan.already_added": "Efa ao amin'ny fifandraisanao",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Miandry ny fidirana amin'ny fakan-tsary…",
  "contacts.verify.camera_off": "Vonoina ny fakan-tsary",
  "contacts.verify.open_settings": "Sokafy ny Fandrindrana",
  "contacts.verify.verified": "Voamarina",
  "contacts.verify.different": "Fifandraisana hafa",
  "contacts.verify.scan_again": "Alaivo sary indray",
  "contacts.verify.failed": "Tsy voamarina",
  "contacts.verify.done": "Vita",
  "contacts.verify.title": "Hamarino i {name}",
  "contacts.verify.aim": "Atodiho amin'ny kaody QR-ny ny fakan-tsarinao",
  "contacts.verify.camera_off_body":
    "Alefaso ny fidirana amin'ny fakan-tsary ao amin'ny Fandrindrana mba hanamarinana amin'ny QR.",
  "contacts.verify.match_body":
    "Mifanaraka ny lakilen'i {name}. Azonao atokisana ity fifandraisana ity.",
  "contacts.verify.different_body":
    "An'olon-kafa ity QR ity. Angataho i {name} haneho ny kaodiny manokana.",
  "contacts.verify.tampered_body":
    "Toa novàna ity QR ity: tsy mifanaraka amin'ny lakiley ny ID-ny.",
  "contacts.verify.choose_title": "Ahoana no tianao hanamarinana?",
  "contacts.verify.choose_body":
    "Samy manamafy fa an'i {name} tokoa ny lakile eto amin'ity findy ity izy roa.",
  "contacts.verify.method_scan": "Alaivo sary ny kaodiny",
  "contacts.verify.method_scan_sub": "Eto miaraka aminao izy",
  "contacts.verify.method_compare": "Ampitahao kaody",
  "contacts.verify.method_compare_sub": "Vakio amin'ny tsirairay amin'ny antso",
  "contacts.verify.no_keys":
    "Mbola tsy misy lakile ho an'ity fifandraisana ity. Manorata aminy, na alaivo sary ny kaodiny rehefa mihaona ianareo.",
  "contacts.verify.compare_title": "Vakio amin'ny tsirairay ireto",
  "contacts.verify.compare_body":
    "Mahita ireo teny enina mitovy i {name}. Raha mifanaraka izy ireo dia samy mahafantatra ianareo fa marina ny lakile.",
  "contacts.verify.codes_match": "Mifanaraka",
  "contacts.verify.codes_differ": "Tsy mifanaraka",
  "contacts.verify.compared_body":
    "Nanamafy kaody mitovy ianao sy i {name}. Voamarina ity fifandraisana ity.",

  // ---- Settings: shared chrome ----
  "settings.back": "Miverina",
  "settings.coming_soon": "Ho avy tsy ho ela",
  "settings.opens_externally": "{label}, misokatra ivelan'ny rindranasa",
  "settings.peer_id": "ID-n'ny teboka",
  "settings.share_peer_id": "Zarao ny ID-n'ny tebokanao",
  "settings.share_id_short": "Zarao ny ID",
  "settings.peer_id_sheet.title": "Ny ID-n'ny tebokanao",
  "settings.peer_id_sheet.copy": "Adikao ny ID-n'ny teboka",
  "settings.peer_id_sheet.note":
    "Miasa ihany izy raha samy ao anatin'ny fetran'ny Bluetooth ianareo roa. Mba hahafahan'ny olona manoratra aminao avy any amin'ny toerana rehetra, zarao ny kaody QR-nao.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Ankapobeny",
  "settings.section.general_desc":
    "Fiasa safidy, fanafoanana fandefasana, media, famerenana",
  "settings.section.privacy": "Fiainana manokana sy fiarovana",
  "settings.section.privacy_desc":
    "Tsiambaratelo mandroso, fonosana voasonia, teboka voasakana",
  "settings.section.network": "Tambajotra sy mpanelanelana",
  "settings.section.network_desc":
    "Fialana amin'ny Internet, mpanelanelana nostr, fifanarahana amin'ny bitchat",
  "settings.section.permissions": "Alalana",
  "settings.section.permissions_desc":
    "Bluetooth, toerana, fampandrenesana, fakan-tsary, mikrô",
  "settings.section.storage": "Fitahirizana sy angona",
  "settings.section.diagnostics": "Fitiliana",

  // ---- Settings: group headings ----
  "settings.group.transports": "Fitaterana",
  "settings.group.nearby": "Akaiky",
  "settings.group.sync": "Fampifanarahana",
  "settings.group.features": "Fiasa",
  "settings.group.messages": "Hafatra",
  "settings.group.media": "Media",
  "settings.group.reset": "Famerenana",
  "settings.group.always_on": "Mandeha foana",
  "settings.group.notifications": "Fampandrenesana",
  "settings.group.blocked": "Voasakana",
  "settings.group.theme": "Lohahevitra",
  "settings.group.font": "Endri-tsoratra",
  "settings.group.language": "Fiteny",
  "settings.section.diagnostics_desc":
    "Toe-javatry ny fifandraisana sy ny fitaovana akaiky",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Rohy Bluetooth",
  "settings.diag.ble_links_desc":
    "Ny fitaovana ifandraisan'ity findy ity mivantana",
  "settings.diag.lan": "Tambajotra an-toerana",
  "settings.diag.lan_desc": "Findy ao amin'ny tambajotra Wi-Fi iray",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Findy mankamin'ny findy tsy misy router",
  "settings.diag.wifi_active": "Mandeha",
  "settings.diag.wifi_unsupported": "Tsy raisina eto amin'ity fitaovana ity",
  "settings.diag.wifi_permission": "Voasakan'ny alalana iray",
  "settings.diag.wifi_unavailable": "Tsy misy izao",
  "settings.diag.wifi_unpaired": "Tsy misy nampifanarahana",
  "settings.diag.wifi_unknown": "Miandry ny radiô",
  "settings.diag.relays": "Mpanelanelana Nostr",
  "settings.diag.relays_desc":
    "Ampiasaina ho an'ny fantsonan-toerana sy ny fahatratrarana amin'ny Internet",
  "settings.diag.connected": "Mifandray",
  "settings.diag.disconnected": "Tsy mifandray",
  "settings.diag.peer_direct": "Rohy mivantana",
  "settings.diag.peer_relayed": "Re tamin'ny alalan'ny fitaovana hafa",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Tsy misy famakiana famantarana",
  "settings.diag.no_peers": "Tsy misy olona ao anatin'ny fetra",
  "settings.diag.no_peers_desc": "Rohy radiô {links} misokatra",
  "settings.diag.gcs_size": "Haben'ny sivana",
  "settings.diag.gcs_size_desc":
    "Sivana fampifanarahana lehibe indrindra nalefa an-drivotra",
  "settings.diag.fpr": "Tahan'ny fahadisoana diso",
  "settings.diag.fpr_desc":
    "Impiry ny sivana no milaza diso fa tsy manana fonosana isika",
  "settings.diag.bytes": "{n} byte",
  "settings.diag.footnote":
    "Tsy misy azo ovaina eto. Raikitra ireo sanda ireo mba hijanonan'ny Airhop hifanaraka amin'ny bitchat.",
  "settings.section.storage_desc": "Fampiasana sy tahiry vonjimaika",
  "settings.section.appearance": "Endrika",
  "settings.section.appearance_desc": "Lohahevitra, endri-tsoratra ary fiteny",
  "settings.section.help": "Fanampiana sy hevitra",
  "settings.section.help_desc":
    "Mifandraisa aminay, tatero ny diso, na vakio ny fanontaniana matetika",
  "settings.section.support": "Fanohanana",
  "settings.section.support_desc": "Ampio mba tsy hijanona ny fampandrosoana",
  "settings.section.about": "Mombamomba",
  "settings.section.about_desc": "Kinova, lisitry ny fiovana ary loharano",

  // ---- Settings: general ----
  "settings.general.undo": "Foano ny fandefasana",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Kitapom-bola",
  "settings.general.undo_seconds": "{count} segondra",
  "settings.general.undo_a11y": "Foano ny fandefasana: {value}",
  "settings.general.quality_a11y": "Ataovy {value} ny kalitaon'ny fandefasana",
  "settings.general.undo_desc":
    "Mihazona kely ny hafatra nalefa mba hahafahanao maka azy alohan'ny hivoahany",
  "settings.general.undo_off_desc": "Alefa avy hatrany, tsy azo foanana",
  "settings.general.undo_2": "2 segondra",
  "settings.general.undo_2_desc": "Fotoana fohy hakana azy indray",
  "settings.general.undo_10": "10 segondra",
  "settings.general.undo_10_desc": "Ny elanelam-potoana lava indrindra",
  "settings.general.quality": "Kalitaon'ny fandefasana",
  "settings.general.quality_desc":
    "Mihatra amin'ny sary alefa avy amin'ny fakan-tsary na ny tahirinao. Na ahoana na ahoana, ny sary tsirairay dia ampifanarahina amin'ny harato.",
  "settings.general.quality_low": "Ambany",
  "settings.general.quality_low_desc":
    "Sary kely indrindra, haingana indrindra alefa",
  "settings.general.quality_medium": "Antonony",
  "settings.general.quality_medium_desc":
    "Mifandanja ny antsipiriany sy ny hafainganana",
  "settings.general.quality_high": "Avo",
  "settings.general.quality_high_desc":
    "Mitazona antsipiriany betsaka indrindra",
  "settings.general.feature_wallet_desc":
    "Mandefa ecash Cashu teboka mankamin'ny teboka amin'ny harato",
  "settings.general.feature_wallet_a11y": "Kitapom-bola (mandeha foana)",
  "settings.general.feature_ai_desc":
    "Mpanampy manokana eo amin'ny fitaovana, tsy miantso tambajotra",
  "settings.general.feature_feeds": "Fandaharana",
  "settings.general.feature_feeds_desc":
    "Vakio sy soraty ao amin'ny fandaharan'ny Bluesky sy ny Mastodon",
  "settings.general.show_media": "Asehoy ho azy ny media",
  "settings.general.show_media_desc":
    "Miseho ao amin'ny resaka ny sary sy ny horonan-tsary, na mijanona ao ambadiky ny fitsindriana",
  "settings.general.reset": "Avereno ny fandrindrana",
  "settings.general.media_retention": "Tehirizo ny media mandritra ny",
  "settings.general.media_retention_desc":
    "Fafana aorian'ny fotoana voafidy ny sary, ny horonan-tsary ary ny naoty feo",
  "settings.general.media_retention_sheet":
    "Fidio hoe mandritra ny hafiriana no hijanonan'ny media eto amin'ity fitaovana ity. Tsy azo averina ny media voafafa.",
  "settings.general.retention_7_desc":
    "Kely indrindra no tavela. Tsara indrindra raha ny findy mihitsy no loza.",
  "settings.general.retention_14_desc":
    "Antonony ho an'ny herinandro na roa lavitra ny famantarana.",
  "settings.general.retention_30_desc":
    "Mitazona ny resaka ho vakiana ela indrindra, ary mitana kapila be indrindra.",
  "settings.general.reset_desc":
    "Mamerina ny safidy rehetra amin'ny laoniny, fa tsy mikasika ny maha-ianao anao, ny hafatrao, ny fifandraisanao ary ny kitapom-bolanao",
  "settings.general.reset_title": "Averina ny fandrindrana?",
  "settings.general.reset_body":
    "Miverina amin'ny laoniny ny safidy rehetra: endrika, fanafoanana fandefasana, ary ny fifandraisana (Internet, Tor, vavahady, tetezana, mpanelanelana). Tsy voakasika ny maha-ianao anao, ny hafatrao, ny fifandraisanao ary ny kitapom-bolanao.",
  "settings.general.reset_confirm": "Avereno",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Tsiambaratelo mandroso",
  "settings.security.forward_secrecy_desc":
    "Mandeha foana ny Double Ratchet amin'ny hafatra mivantana",
  "settings.security.signed_packets": "Fonosana voasonia",
  "settings.security.signed_packets_desc":
    "Voasonia amin'ny Ed25519 ny fonosana tsirairay",
  "settings.security.hide_previews":
    "Afeno ny topi-maso amin'ny fampandrenesana",
  "settings.security.hide_previews_desc":
    "Manala ny mpandefa sy ny hafatra amin'ny efijery mihidy, izay mampiseho azy ireo tsy mila manokatra",
  "settings.security.no_blocked": "Tsy misy teboka voasakana",
  "settings.security.no_blocked_desc":
    "Tsy afaka manoratra aminao ny teboka voasakana ary tsy miseho amin'ny takelaka Harato",
  "settings.security.unblock_title": "Esory ny sakana amin'ity teboka ity",
  "settings.security.unblock": "Esory ny sakana",
  "settings.security.unblock_peer": "Esory ny sakana amin'i {name}",
  "settings.security.unblock_body":
    "Ho afaka manoratra aminao indray i {name} ary hiseho indray amin'ny takelaka Harato rehefa akaiky izy.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Fialana amin'ny Internet",
  "settings.network.internet_desc":
    "Manohy amin'ny mpanelanelana Nostr rehefa lavitra ny fetra ny teboka amin'ny harato",
  "settings.network.internet_off_title": "Hovonoina ny Internet?",
  "settings.network.internet_off_body":
    "Bluetooth ihany no handehanan'ny Airhop. Mitsahatra tsy mifandray amin'ny mpanelanelana Nostr izy, ary vonoina daholo ny Tor, ny vavahady Internet ary ny tetezan'ny harato. Mbola mandeha ny resaka Bluetooth akaiky.",
  "settings.network.turn_off": "Vonoy",
  "settings.network.discovery": "Fitadiavana mpanelanelana araka ny toerana",
  "settings.network.discovery_desc":
    "Mifidy ho azy ny mpanelanelana akaiky indrindra ho an'ny efi-toerana avy amin'ny mpanelanelana miparitaka 300 mahery",
  "settings.network.discovery_needs_relay":
    "Manampia mpanelanelana manokana aloha",
  "settings.network.discovery_needs_relay_body":
    "Ny fitadiavana ho azy no manondro ny Airhop amin'ny mpanelanelana akaiky indrindra. Misy dikany ny famonoana azy rehefa efa nametraka ny mpanelanelana anao etsy ambany ianao, ka manampia iray farafahakeliny aloha.",
  "settings.network.custom_only_title":
    "Ny mpanelanelana manokanao ihany no ampiasaina?",
  "settings.network.custom_only_body":
    "Hitsahatra tsy hifidy ho azy ny mpanelanelana akaiky indrindra ny fantsonan-toerana sy ny tetezan'ny harato ary izay nampidirinao ihany no hampiasainy. Mety hampihena ny fahatratrarana izany, ary mety tsy hifanena amin'ny mpampiasa bitchat intsony ianao, satria mivory eo amin'ny mpanelanelana akaiky indrindra izy ireo.",
  "settings.network.custom": "Mpanelanelana manokana",
  "settings.network.custom_desc":
    "Ampio ny mpanelanelana anao ho an'ny fantsonan-toerana sy ny tetezan'ny harato",
  "settings.network.custom_added": "{count} amin'ny {max} voampiditra",
  "settings.network.dm_relays": "Mpanelanelana hafatra",
  "settings.network.dm_relays_desc":
    "Ireto foana no ampiasain'ny hafatra mivantana sy ny fantsona manokana. Tsy manova azy ireo ny mpanelanelana manokana.",
  "settings.network.discovery_back_on":
    "Mandeha indray ny fitadiavana mpanelanelana araka ny toerana",
  "settings.network.discovery_back_on_body":
    "Io no mpanelanelana manokana farany nanananao. Mila toerana hamoahana ny fantsonan-toerana, ka mifidy ho azy indray ny mpanelanelana akaiky indrindra ny Airhop.",
  "settings.network.add_relay": "Ampio mpanelanelana",
  "settings.network.remove_relay": "Esory ny {url}",
  "settings.network.add_short": "Ampio",
  "settings.network.relay_limit":
    "Afaka mampiditra mpanelanelana {count} ianao. Esory ny iray mba hampidirana hafa.",
  "settings.network.relay_duplicate":
    "Efa ao amin'ny lisitrao io mpanelanelana io.",
  "settings.network.relay_invalid":
    "Soraty ny anaran'ny mpanelanelana mety, ohatra relay.example.com. Mila laharam-pidirana ihany raha tsy mampiasa ny mahazatra ny mpanelanelana. Tsy azo ampiasaina ny adiresy IP sy ny anarana eo an-toerana.",
  "settings.network.wifi_pair": "Fampifanarahana",
  "settings.network.wifi_paired": "Fitaovana nampifanarahana",
  "settings.network.wifi_pair_find": "Hitady fitaovana",
  "settings.network.wifi_pair_find_desc":
    "Mitadiava iPhone akaiky izay maneho ny tenany. Mila iOS 26 na taty aoriana izy roa.",
  "settings.network.wifi_pair_show": "Asehoy ity iPhone ity",
  "settings.network.wifi_pair_show_desc":
    "Avelao ny iPhone akaiky hahita ity. Ny iray mitady, ny iray maneho, miaraka amin'ny fotoana iray.",
  "settings.network.wifi_pair_find_action": "Misafidiana iPhone akaiky",
  "settings.network.wifi_pair_show_action": "Ataovy azo hita ity iPhone ity",
  "settings.network.wifi_pair_unavailable":
    "Tsy misy ny Wi-Fi Aware amin'izao fotoana izao",
  "settings.network.wifi_pair_forget":
    "Esory ao amin'ny app Settings ny fampifanarahana",
  "settings.network.bitchat": "Fifanarahana amin'ny bitchat",
  "settings.network.bitchat_desc":
    "Harato BLE mitovy amin'ny bitchat, mifanaraka tanteraka. Mandeha foana izy ary tsy azo vonoina.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Mandeha any aoriana",
  "settings.conn.background_desc":
    "Mitazona ny harato handeha rehefa mihidy ny Airhop",
  "settings.conn.background_on_title": "Avela handeha ny harato?",
  "settings.conn.background_on_body":
    "Manohy mampita sy mandray ny Airhop rehefa mihidy, ka tonga ny hafatra na dia lasa aza ianao. Mampiseho fampandrenesana maharitra ny Android mandritra izany.",
  "settings.conn.background_off_title":
    "Ajanona ny harato rehefa mihidy ny Airhop?",
  "settings.conn.background_off_body":
    "Rehefa misokatra ny Airhop ihany no ahatongavan'ny hafatra, ary mitsahatra tsy mampita ho an'ny olona akaiky ity findy ity. Ho lasa ny fampandrenesana maharitra.",
  "settings.conn.live_voice": "Feo mivantana",
  "settings.conn.live_voice_desc":
    "Miresaha amin'ny olona akaiky toy ny amin'ny radiô",
  "settings.conn.live_voice_on_title": "Alefa ny feo mivantana?",
  "settings.conn.live_voice_on_body":
    "Ny fihazonana ny mikrô dia mandefa ny feonao amin'ny olona rehetra ao anatin'ny fetran'ny Bluetooth raha vao miteny ianao, ary maneno eo amin'ny findinao ny feony. Tsy misy voarakitra.",
  "settings.conn.live_voice_off_title": "Vonoina ny feo mivantana?",
  "settings.conn.live_voice_off_body":
    "Ny fihazonana ny mikrô dia mandrakitra naoty feo kosa. Alefa izy rehefa avelanao, ary tsy misy mandre azy raha tsy mampandeha azy.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Fitondrana amin'ny Tor",
  "settings.conn.tor_desc":
    "Ento amin'ny Tor ny fifamoivoizana Nostr ho fiarovana fanampiny",
  "settings.conn.tor_on_title": "Hoentina amin'ny Tor ny fifamoivoizana Nostr?",
  "settings.conn.tor_on_body":
    "Tsy hahita ny adiresy IP-nao intsony ny mpanelanelana. Maharitra ela kokoa ny fifandraisana ary miadana kokoa ny fahatongavan'ny hafatra. Tsy voakasika ny Bluetooth.",
  "settings.conn.tor_off_title": "Vonoina ny fitondrana amin'ny Tor?",
  "settings.conn.tor_off_body":
    "Miverina amin'ny fifandraisanao mahazatra ny fifamoivoizana Nostr, ka hahita ny adiresy IP-nao indray ny mpanelanelana. Na ahoana na ahoana, tsy voakasika ny Bluetooth.",
  "settings.conn.tor_orbot_idle":
    "Voapetraka i Orbot fa tsy mifandray. Sokafy i Orbot, alefaso ny VPN-ny, avy eo alefaso ity.",
  "settings.conn.tor_unavailable":
    "Tsy misy ny fitondrana amin'ny Tor amin'ity kinova ity.",
  "settings.conn.tor_timeout":
    "Mihoatra ny iray minitra i Tor vao mifandray. Mijanona mandeha izy ary manohy manandrana; hilaza ny takelaka Harato rehefa mitondra izy, na raha misakana azy ity tambajotra ity.",
  "settings.conn.tor_failed":
    "Tsy afaka nandefa ny Tor. Hamarino fa manana fidirana amin'ny tambajotra ny rindranasa.",
  "settings.conn.mint_clearnet":
    "Avelao ny fifamoivoizan'ny mpamoaka amin'ny tambajotra misokatra",
  "settings.conn.mint_clearnet_desc":
    "Amin'ny iOS dia ny Nostr ihany no rakofan'ny Tor. Avelao vonoina mba hisakanana ny fangatahana any amin'ny mpamoaka; na ahoana na ahoana dia mbola mandeha ny ecash amin'ny harato.",
  "settings.conn.gateway": "Vavahady Internet",
  "settings.conn.gateway_desc":
    "Ampindramo ny fifandraisanao amin'ny findy akaiky tsy misy Internet mba hahatratrarany ny fantsonan-toerana",
  "settings.conn.gateway_on_title": "Alefa ny vavahady Internet?",
  "settings.conn.gateway_on_body":
    "Ny findy akaiky tsy manana fifandraisana manokana dia handefa sy handray hafatra amin'ny fantsonan-toerana amin'ny alalanao. Mampiasa ny angonao finday sy ny bateriaonao izany, ary mijanona voafono tanteraka ny hafatr'izy ireo, ka tsy vakinao izay mandalo.",
  "settings.conn.gateway_off_title": "Vonoina ny vavahady Internet?",
  "settings.conn.gateway_off_body":
    "Tsy hahatratra ny fantsonan-toerana amin'ny alalanao intsony ny findy akaiky tsy misy Internet. Tsy voakasika ny hafatrao manokana.",
  "settings.conn.bridge": "Tetezan'ny harato",
  "settings.conn.bridge_desc":
    "Ampifandraiso amin'ny vondrona Bluetooth hafa lavitra ny fetra amin'ny Internet ny resaka #bluetooth ho an'ny daholobe amin'ity faritra ity",
  "settings.conn.bridge_on_title": "Alefa ny tetezan'ny harato?",
  "settings.conn.bridge_on_body":
    "Havoaka any amin'ny fokontaninao amin'ny Internet ny hafatrao #bluetooth ho an'ny daholobe, ka ho vakin'ny olona ivelan'ny fetran'ny Bluetooth. Tsy mandalo tetezana mihitsy ny hafatra manokana, ary ny “akaiky ihany” dia mitazona ny hafatra tsirairay eo an-toerana.",
  "settings.conn.bridge_off_title": "Vonoina ny tetezan'ny harato?",
  "settings.conn.bridge_off_body":
    "Miverina mijanona ao anatin'ny fetran'ny Bluetooth ny hafatrao #bluetooth ho an'ny daholobe, ary mitsahatra tsy ho tonga eto ny hafatra avy amin'ny vondrona ampitan'ny tetezana.",
  "settings.conn.bridge_needs_location": "Mila toerana ny tetezan'ny harato",
  "settings.conn.bridge_needs_location_desc":
    "Mahita ny fokontaninao avy amin'ny toerana izy. Avelao ny toerana mba hanombohana ny tetezana.",
  "settings.conn.grant_location": "Omeo ny alalana toerana",
  "settings.conn.grant_short": "Omeo",
  "settings.conn.orbot_body":
    "Ny Airhop dia mitondra ny fifamoivoizan'ny Tor amin'ny alalan'i Orbot. Apetraho sy alefaso i Orbot avy amin'ny Play Store, avy eo alefaso ity.",
  "settings.conn.internet_off": "Vonoina ny Internet",
  "settings.conn.internet_off_desc":
    "Samy mampiasa ny Internet ny Tor, ny tetezana ary ny vavahady. Alefaso ny Fialana amin'ny Internet ao amin'ny Tambajotra mba hampiasana azy ireo.",
  "settings.conn.turn_on": "Alefaso",
  "settings.conn.turn_off": "Vonoy",
  "settings.conn.orbot_title": "Tor amin'ny Android",
  "settings.conn.get_orbot": "Makà Orbot",
  "settings.conn.later": "Any aoriana",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Mahita ny fitaovana akaiky ary mampita hafatra eo amin'izy ireo. Raha tsy misy izany dia tsy afaka miasa ny harato.",
  "settings.permissions.location": "Toerana",
  "settings.permissions.location_desc":
    "Manokatra ny fantsonan'ny faritra akaiky. Raha tsy misy izany dia mijanona mihidy ireo fantsona ireo ary manohy toy ny mahazatra ny harato Bluetooth.",
  "settings.permissions.notifications": "Fampandrenesana",
  "settings.permissions.notifications_desc":
    "Mandray fampandrenesana momba ny hafatra vaovao na dia mihidy aza ny rindranasa. Raha tsy misy izany dia rehefa manokatra ny Airhop ianao vao mahita azy ireo.",
  "settings.permissions.camera": "Fakan-tsary",
  "settings.permissions.camera_desc":
    "Maka sary kaody QR ary maka sary na horonan-tsary halefa. Raha tsy misy izany dia mbola afaka mizara media avy amin'ny tahirinao ianao.",
  "settings.permissions.photos": "Sary",
  "settings.permissions.photos_desc":
    "Mandefa sary avy amin'ny tahirinao ary mitahiry ny media voaray. Raha tsy misy izany dia mbola afaka maka sy mandefa sary vaovao amin'ny fakan-tsary ianao.",
  "settings.permissions.microphone": "Mikrô",
  "settings.permissions.microphone_desc":
    "Mandrakitra sy mandefa hafatra feo na mampiasa ny feo mivantana. Raha tsy misy izany dia tsy handeha ny hafatra feo sy ny feo mivantana.",
  "settings.permissions.allow": "Avelao ity alalana ity",
  "settings.permissions.open_settings":
    "Sokafy ny fandrindran'ny rafitra mba hanova ity alalana ity",
  "settings.permissions.system": "Rafitra",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Fampiasana tambajotra",
  "settings.storage.storage_usage": "Fampiasana fitahirizana",
  "settings.storage.storage_usage_desc":
    "Hafatra, porofon'ny kitapom-bola ary fanampiny voatahiry vonjimaika",
  "settings.storage.session_usage":
    "Ity fivoriana ity · {sent} nalefa, {received} voaray",
  "settings.storage.cache": "Tahiry vonjimaika",
  "settings.storage.cache_desc": "{size} fanampiny",
  "settings.storage.clear_cache": "Fafao ny tahiry vonjimaikan'ny fanampiny",
  "settings.storage.clear": "Fafao",
  "settings.storage.clear_title": "Hofafana ny media voatahiry vonjimaika?",
  "settings.storage.clear_body":
    "Esorina amin'ity fitaovana ity ny sary, ny horonan-tsary, ny naoty feo ary ny rakitra, na ny nalefa na ny voaray. Tsy azo alaina indray izy ireo: holazain'ny baorina izany, ary azonao angatahina amin'ny mpandefa ny handefa azy indray. Tsy voakasika ny hafatra sy ny kitapom-bola.",
  "settings.storage.cleared": "Voafafa ny tahiry vonjimaika",
  "settings.storage.freed": "Nanafaka {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Ataovy {value} ny endrika",
  "settings.font.set_a11y": "Ataovy {value} ny endri-tsoratra mitovy elanelana",
  "settings.font.system": "Rafitra",
  "settings.font.system_desc":
    "Mampiasa ny endri-tsoratra mitovy elanelana mahazatry ny fitaovanao",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Maoderina sy mora vakiana",
  "settings.language.en": "Anglisy",
  "settings.language.am": "Amharika",
  "settings.language.ar": "Arabo",
  "settings.language.bn": "Bengali",
  "settings.language.my": "Birmana",
  "settings.language.zh_hans": "Sinoa (notsorina)",
  "settings.language.zh_hant": "Sinoa (nentim-paharazana)",
  "settings.language.nl": "Holandey",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "Frantsay",
  "settings.language.ka": "Zeorziana",
  "settings.language.de": "Alemana",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indoneziana",
  "settings.language.it": "Italiana",
  "settings.language.ja": "Japoney",
  "settings.language.ko": "Koreana",
  "settings.language.mg": "Malagasy",
  "settings.language.ms": "Malay",
  "settings.language.ne": "Nepaley",
  "settings.language.fa": "Persana",
  "settings.language.pl": "Poloney",
  "settings.language.pt_br": "Portiogey (Brezila)",
  "settings.language.pt_pt": "Portiogey (Portogaly)",
  "settings.language.pa": "Penjabi",
  "settings.language.ru": "Rosiana",
  "settings.language.es": "Espaniola",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Soedoa",
  "settings.language.ta": "Tamoila",
  "settings.language.th": "Thailandey",
  "settings.language.tr": "Tiorka",
  "settings.language.uk": "Okrainiana",
  "settings.language.ur": "Ordo",
  "settings.language.vi": "Vietnamiana",
  "settings.language.pseudo": "Pseudolokaly",
  "settings.language.soon": "Ho avy tsy ho ela",
  "settings.language.soon_a11y": "{value}, ho avy tsy ho ela",
  "settings.language.set_a11y": "Ataovy {value} ny fiteny",
  "settings.language.pending": "Amin'ny fanokafana manaraka",
  "settings.language.pending_a11y":
    "{value}, mihatra amin'ny fotoana manaraka hanokafanao ny Airhop",
  "settings.language.rtl_restart": "Sokafy indray izao",
  "settings.language.rtl_title": "Sokafy indray ny Airhop mba hamitana",
  "settings.language.rtl_body":
    "Vakiana avy any ankavanana miankavia ny {value}, ary rehefa manomboka ihany ny Airhop no afaka manova lalana. Akatony izy ary sokafy indray mba hamitana ny fiovana. Tsy misy very, ary mifandray hatrany ny haratonao mandra-pahatongan'izany.",
  "settings.theme.light": "Mazava",
  "settings.theme.light_desc": "Mampiasa ny loko mazava foana",
  "settings.theme.dark": "Maizina",
  "settings.theme.dark_desc": "Mampiasa ny loko maizina foana",

  // ---- Settings: profile and identity ----
  "settings.status.online": "An-tserasera",
  "settings.status.online_desc": "Azo hita, manambara sy mikaroka",
  "settings.status.away": "Lasa",
  "settings.status.away_desc": "Miato ny harato, tsy mikaroka na manambara",
  "settings.status.invisible": "Tsy hita",
  "settings.status.invisible_desc": "Mikaroka, fa miafina tsy ho hita",
  "settings.status.title": "Toe-javatra",
  "settings.status.set_a11y": "Ataovy {value} ny toe-javatra",
  "settings.status.edit": "Ovay ny toe-javatra",
  "settings.status.desc": "Fidio hoe hita hatraiza ianao eo amin'ny harato.",
  "settings.transfer.identity": "Maha-izy azy sy lakile",
  "settings.transfer.identity_desc":
    "Ny ID-n'ny tebokanao, ny anaram-pikambanao ary ny fifandraisanao",
  "settings.transfer.chats": "Resaka sy tantara",
  "settings.transfer.chats_desc": "Resaka, vondrona ary ny fantsona nidiranao",
  "settings.transfer.wallet": "Volan'ny kitapom-bola",
  "settings.transfer.wallet_desc": "Porofo Cashu sy tantaran'ny fifanakalozana",
  "settings.transfer.title": "Mamindra amin'ny findy vaovao",
  "settings.transfer.desc":
    "Afindrao amin'ny fitaovana hafa ny maha-ianao anao, ny resakao ary ny kitapom-bolanao",
  "settings.transfer.coming_soon_a11y":
    "Mamindra amin'ny findy vaovao, ho avy tsy ho ela",
  "settings.transfer.body":
    "Ampifanatony ny findy roa ary afindrao amin'ny Bluetooth ny zava-drehetra. Tsy misy mandalo mpizara, ka miasa tsy misy Internet.",
  "settings.qr.permission_label": "Fidirana amin'ny sary",
  "settings.qr.permission_purpose": "hitahiry ny kaody QR-nao",
  "settings.qr.saved": "Voatahiry",
  "settings.qr.saved_body":
    "Voatahiry ao amin'ny tahirin-tsarinao ny kaody QR.",
  "settings.qr.save_failed": "Tsy voatahiry",
  "settings.qr.save_failed_body": "Tsy voatahiry ny kaody QR. Andramo indray.",
  "settings.qr.share_message": "Ampio aho ao amin'ny Airhop",
  "settings.qr.share_body":
    "Ampio aho ao amin'ny Airhop — hafatra manokana amin'ny harato, natao ho an'ny tsy misy Internet aloha.",
  "settings.qr.show_short": "Asehoy ny QR",
  "settings.qr.title": "Ny kaody QR-nao",
  "settings.qr.note":
    "Misy ny lakilenao ho an'ny daholobe izy, izay mamela ny hafa hanoratra aminao avy any amin'ny toerana rehetra. Zarao amin'ny olona atokisanao ihany izy. Tsy miova izy raha tsy fafanao ny maha-ianao anao.",
  "settings.qr.code_label": "Kaody fifandraisana",
  "settings.qr.copy_code": "Adikao ny kaody fifandraisana",
  "settings.qr.share": "Zarao ny kaody QR",
  "settings.qr.share_short": "Zarao ny QR",
  "settings.qr.download": "Alaivo ny kaody QR",
  "settings.qr.download_short": "Alaivo ny QR",
  "settings.qr.show": "Asehoy ny kaody QR",
  "settings.wipe.trigger": "Alefaso ny famafana maika",
  "settings.wipe.trigger_desc":
    "Tsindrio intelo mba hamafa avy hatrany tsy misy fanamafisana",
  "settings.wipe.title": "Famafana maika",
  "settings.wipe.now": "Fafao izao",
  "settings.wipe.desc":
    "Mandrava avy hatrany ny lakile, ny hafatra ary ny porofo rehetra",
  "settings.wipe.body":
    "Handrava avy hatrany ny lakilenao, ny hafatrao ary ny porofon'ny kitapom-bolanao rehetra izany. Tsy azo averina izany.",
  "settings.wipe.in_progress": "Fafana",
  "settings.wipe.in_progress_body":
    "Ravana ny lakilenao, ny hafatrao ary ny rakitrao. Maharitra segondra vitsivitsy izany, ary vita ho azy na dia mihidy aza ny rindranasa.",
  "settings.wipe.got_it": "Azoko",
  "settings.wipe.keys_failed": "Tsy voarava ny lakile",
  "settings.wipe.keys_failed_body":
    "Lasa ny hafatrao, ny fifandraisanao ary ny kitapom-bolanao, fa nandà tsy hamotsotra ny lakilenao ny fitaovana. Vahao ny fitaovana ary fafao indray.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Mifandraisa aminay",
  "settings.help.contact_a11y": "Manorata amin'ny {address}",
  "settings.help.bug": "Tatero ny diso",
  "settings.help.bug_desc": "Manokafa issue ao amin'ny GitHub",
  "settings.help.bug_a11y": "Tatero ny diso ao amin'ny GitHub",
  "settings.help.faq": "Fanontaniana matetika",
  "settings.help.faq_desc": "Valin'ny fanontaniana mahazatra",
  "settings.help.faq_a11y": "Sokafy ny fanontaniana matetika",
  "settings.help.terms_desc": "Ahoana no ampiasana ny Airhop",
  "settings.help.terms_a11y": "Sokafy ny Fepetra fampiasana",
  "settings.help.privacy_desc": "Izay tsy angoninay",
  "settings.help.privacy_a11y": "Sokafy ny Politikan'ny fiainana manokana",

  // ---- Settings: support ----
  "settings.support.card": "Karatra na UPI",
  "settings.support.card_desc":
    "Banky an-tserasera sy kitapom-bola, manerantany",
  "settings.support.card_a11y":
    "Manohana amin'ny karatra, UPI, banky an-tserasera na kitapom-bola",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Isam-bolana na indray mandeha, tsy misy saran'ny sehatra",
  "settings.support.sponsors_a11y":
    "Manohana amin'ny alalan'ny GitHub Sponsors",
  "settings.support.note":
    "Amboariko amin'ny fotoana malalaka ny Airhop. Tsy misy mpampiasa vola ary tsy misy dokambarotra. Raha mahasoa anao izy, dia manampy be ny fanomezana mba tsy hijanona ny fampandrosoana. Na ahoana na ahoana, maimaim-poana foana ny fiasa rehetra.",

  // ---- Settings: about and version ----
  "settings.about.version": "Kinova",
  "settings.about.version_desc": "Famoahana ankehitriny",
  "settings.about.version_a11y": "Jereo ny kinova ary tadiavo ny fanavaozana",
  "settings.about.release_notes": "Fanamarihana famoahana",
  "settings.about.release_notes_desc":
    "Inona no vaovao amin'ny famoahana farany",
  "settings.about.release_notes_a11y":
    "Sokafy ao amin'ny GitHub ny fanamarihana famoahana farany",
  "settings.about.source": "Kaody loharano",
  "settings.about.source_a11y": "Sokafy ao amin'ny GitHub ny kaody loharano",
  "settings.about.licenses": "Fahazoan-dalana misokatra",
  "settings.about.open_repo": "Sokafy ny tahiry {name}",
  "settings.about.licenses_desc": "Fonosana misokatra avy amin'ny hafa",
  "settings.about.licenses_a11y": "Jereo ny fahazoan-dalana avy amin'ny hafa",
  "settings.version.codename": "Anarana kaody",
  "settings.version.checking": "Karohina",
  "settings.version.check": "Tadiavo ny fanavaozana",
  "settings.version.checking_title": "Mitady fanavaozana",
  "settings.version.up_to_date": "Amin'ny kinova farany ianao.",
  "settings.version.release_notes": "Jereo ny fanamarihana famoahana",
  "settings.version.made_with": "Namboarina tamin'ny",
  "settings.version.number": "Kinova {version}",
  "settings.version.update_to": "Havaozy ho {version}",
  "settings.version.update_to_a11y": "Havaozy ho kinova {version}",
  "settings.version.released_under": "Navoaka araka ny {license}",
  "settings.version.notes_a11y":
    "Jereo ny fanamarihana famoahana ho an'ny kinova {version}",
  "settings.version.tor_paused":
    "Miato ny fitadiavana fanavaozana raha mandeha ny Tor, mba tsy hitsoahan'ny IP-nao. Jereo ao amin'ny mpitety ny pejin'ny famoahana.",
  "settings.version.check_failed":
    "Tsy voatady ny fanavaozana. Jereo ny fifandraisanao ary andramo indray.",
  "settings.version.downloading": "Misintona {percent}%",
  "settings.version.install": "Apetraho",
  "settings.version.download_failed":
    "Tsy nahomby ny fisintomana. Jereo ny fifandraisanao ary andramo indray.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} dia {size} KiB, mihoatra ny fetra {cap} KiB.",
  "transfer.failed.malformed":
    "Tonga simba ny fanampiny iray ka tsy voasokatra. Angataho izy handefa azy indray.",
  "transfer.failed.unsupported_type":
    "Tonga tamin'ny endrika tsy voasokatr'ity rindranasa ity ny fanampiny iray.",
  "transfer.failed.type_mismatch":
    "Nolavina ny fanampiny iray: tsy mifanaraka amin'ny karazana rakitra nolazainy ny votoatiny.",
  "transfer.failed.storage":
    "Tonga ny fanampiny iray fa tsy voatahiry. Jereo ny toerana malalaka.",
  "transfer.badge.waiting": "Miandry · {name}",
  "transfer.badge.active_count": "Famindrana {count}",
  "transfer.badge.sending": "Mandefa {name}",
  "transfer.badge.receiving": "Mandray {name}",
  "transfer.badge.a11y": "{label}, {percent} isan-jato. Sokafy ny resaka.",
  "transfer.kind.photo": "Sary",
  "transfer.kind.video": "Horonan-tsary",
  "transfer.kind.voice": "Naoty feo",
  "transfer.this.photo": "Ity sary ity",
  "transfer.this.video": "Ity horonan-tsary ity",
  "transfer.this.voice": "Ity naoty feo ity",
  "transfer.this.file": "Ity rakitra ity",
  "transfer.kind.document": "Antontan-taratasy",
  "transfer.kind.voice_preview": "Naoty feo",
  "transfer.kind.photo_preview": "Sary",
  "transfer.kind.video_preview": "Horonan-tsary",
  "transfer.kind.document_preview": "Antontan-taratasy",

  // ---- System notifications ----
  "notif.channel.messages": "Hafatra",
  "notif.channel.nearby": "Teboka akaiky",
  "notif.channel.nearby_desc":
    "Fampandrenesana indraindray rehefa mahita olona ao anatin'ny fetran'ny Bluetooth ny harato.",
  "notif.nearby.body":
    "Ao anatin'ny fetran'ny Bluetooth izao. Tsindrio hanokatra ny harato.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Olona iray",
  "notif.notice_urgent": "Filazana maika · {content}",
  "notif.notice": "Filazana · {content}",
  "notif.incoming_file": "Rakitra tonga",
  "notif.preview.photo": "📷 Sary",
  "notif.preview.voice": "🎤 Hafatra feo",
  "notif.preview.video": "🎥 Horonan-tsary",
  "notif.preview.document": "📄 Antontan-taratasy",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Hafatra vaovao",
  "notif.hidden.channel": "Hetsika vaovao",
  "notif.hidden.mention": "Notanisaina ianao",
  "notif.mention.title": "Nanonona anao i {sender}",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Asehoy {count} hafa",
    other: "Asehoy {count} hafa",
  },
  "chat.channels.show_more_a11y": {
    one: "Asehoy fantsona mahazatra {count} hafa",
    other: "Asehoy fantsona mahazatra {count} hafa",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} tsy voavaky",
    other: "{label}, {count} tsy voavaky",
  },
  "a11y.new_count": {
    one: "{label}, {count} vaovao",
    other: "{label}, {count} vaovao",
  },
  "chat.a11y.unread": {
    one: "{count} tsy voavaky",
    other: "{count} tsy voavaky",
  },
  "chat.thread.length_left": {
    one: "{count} sisa",
    other: "{count} sisa",
  },
  "settings.general.retention_days": {
    one: "{count} andro",
    other: "{count} andro",
  },
  "chat.info.group_reach": {
    one: "{reachable} amin'ny mpikambana {count} no azo tratrarina",
    other: "{reachable} amin'ny mpikambana {count} no azo tratrarina",
  },
  "chat.group_members": {
    one: "Vondrona manokana  ·  mpikambana {count}",
    other: "Vondrona manokana  ·  mpikambana {count}",
  },
  "chat.select.count": {
    one: "{count} voafantina",
    other: "{count} voafantina",
  },
  "chat.select.forward": {
    one: "Alefaso ny hafatra {count}",
    other: "Alefaso ny hafatra {count}",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} miteny",
    other: "{count} miteny",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "teboka {count} ao anatin'ny fetra",
    other: "teboka {count} ao anatin'ny fetra",
  },
  "mesh.peer.hops_away": {
    one: "dingana {count} lavitra",
    other: "dingana {count} lavitra",
  },
  "chat.presence.active": {
    one: "{count} mavitrika",
    other: "{count} mavitrika",
  },
  "chat.presence.nearby": {
    one: "{count} akaiky",
    other: "{count} akaiky",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "mpamoaka {count}",
    other: "mpamoaka {count}",
  },
  "wallet.mint.remove_body": {
    one: "Manana {balance} {unit} ao anatin'ny porofo {count} i {mint}. Ny fanesorana azy dia mamafa io porofo io tsy misy fiverenany amin'ity fitaovana ity, ary tsy misy dika mitahiry azy. Esory na alefaso aloha ny volanao.",
    other:
      "Manana {balance} {unit} ao anatin'ny porofo {count} i {mint}. Ny fanesorana azy dia mamafa ireo porofo ireo tsy misy fiverenany amin'ity fitaovana ity, ary tsy misy dika mitahiry azy. Esory na alefaso aloha ny volanao.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "Petra-bola {count} miandry fandoavam-bola. Jerena indray isaky ny misokatra ny rindranasa.",
    other:
      "Petra-bola {count} miandry fandoavam-bola. Jerena indray isaky ny misokatra ny rindranasa.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Porofo {count} tsy mbola lany no voaverina avy amin'i {mints}.",
    other: "Porofo {count} tsy mbola lany no voaverina avy amin'i {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "Hita ny vola madinika {count}, saingy efa lany izy io, ka tsy nisy natsofoka ho azy. Ara-dalàna izany: ny vola madinika rehetra nolanianao dia mijanona ao amin'ny firaketana tehirizin'ny mpamoaka.",
    other:
      "Hita ny vola madinika {count}, saingy efa lany izy ireo, ka tsy nisy natsofoka ho azy ireo. Ara-dalàna izany: ny vola madinika rehetra nolanianao dia mijanona ao amin'ny firaketana tehirizin'ny mpamoaka.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Asehoy {count} hafa",
    other: "Asehoy {count} hafa",
  },
  "wallet.activity.show_more_a11y": {
    one: "Asehoy fandoavam-bola {count} hafa",
    other: "Asehoy fandoavam-bola {count} hafa",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} tsy voamarina",
    other: "{count} tsy voamarina",
  },
  "wallet.proof_count": {
    one: "porofo {count}",
    other: "porofo {count}",
  },
  "wallet.spent_removed_detail": {
    one: "Efa lany ny porofo {count}, ka nesorina izy io.",
    other: "Efa lany ny porofo {count}, ka nesorina izy ireo.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Misy olona akaiky",
    other: "Misy olona {count} akaiky",
  },
};

export const mg = { strings, plurals };
