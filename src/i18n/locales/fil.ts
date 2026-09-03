// fil: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Kanselahin",
  "common.done": "Tapos na",
  "common.ok": "OK",
  "common.close": "Isara",
  "common.back": "Bumalik",
  "common.delete": "Burahin",
  "common.remove": "Alisin",
  "common.add": "Idagdag",
  "common.copy": "Kopyahin",
  "common.copied": "Nakopya",
  "common.share": "Ibahagi",
  "common.continue": "Magpatuloy",
  "common.try_again": "Subukan ulit",
  "common.settings": "Mga Setting",
  "common.on": "Naka-on",
  "common.off": "Naka-off",

  // ---- Dates ----
  "format.today": "Ngayon",
  "format.yesterday": "Kahapon",
  "format.minutes_ago": "{count} min ang nakalipas",
  "format.hours_ago": "{count} oras ang nakalipas",
  "format.days_ago": "{count} araw ang nakalipas",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Mga Chat",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Wallet",
  "nav.tab.profile": "Ikaw",
  "a11y.tab.new_peers": "{label}, may bagong tao sa malapit",
  "nav.notifications": "Mga Abiso",
  "chat.subtab.channels": "Mga Channel",
  "chat.subtab.direct": "Direkta",
  "chat.subtab.dms": "Mga direktang mensahe",
  "chat.search.placeholder": "Maghanap sa mga chat…",
  "chat.search.a11y": "Maghanap sa mga chat at mensahe",
  "chat.search.close": "Isara ang paghahanap",
  "chat.search.clear": "Linisin ang paghahanap",
  "mesh.view.radar": "Tanawing radar",
  "mesh.view.list": "Tanawing listahan",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Listahan",

  // ---- Legal document names ----
  "legal.last_updated": "Huling na-update: {date}",
  "legal.terms": "Mga Tuntunin ng Serbisyo",
  "legal.privacy": "Patakaran sa Privacy",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Pribadong komunikasyon sa mesh",
  "onboarding.welcome.cta": "Magsimula",
  "onboarding.welcome.cta_hint":
    "Sumang-ayon sa mga tuntunin sa ibaba para magpatuloy",
  "onboarding.welcome.consent_a11y":
    "Sumang-ayon sa Mga Tuntunin ng Serbisyo at Patakaran sa Privacy",
  "onboarding.welcome.open_terms": "Buksan ang Mga Tuntunin ng Serbisyo",
  "onboarding.welcome.open_privacy": "Buksan ang Patakaran sa Privacy",
  "onboarding.welcome.consent":
    "Sa pag-tap ng {cta}, sumasang-ayon ka sa aming {terms} at {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Ginagawa ang iyong pagkakakilanlan",
  "onboarding.identity.body":
    "Gumagawa ng pares ng susing Ed25519 sa device na ito.\nWalang ipinapadala kahit saan.",
  "onboarding.identity.failed_heading": "Hindi nagawa ang iyong mga susi",
  "onboarding.identity.failed_body":
    "Hindi pinayagan ng device na ito ang Airhop na itago ang mga ito nang ligtas. Subukan ulit, o i-restart ang iyong telepono at buksang muli ang Airhop.",
  "onboarding.identity.steps_a11y": "Mga hakbang: {steps}",
  "onboarding.identity.step.x25519":
    "Gumagawa ng static na pares ng susing X25519",
  "onboarding.identity.step.ed25519":
    "Gumagawa ng pares ng susi sa paglagda na Ed25519",
  "onboarding.identity.step.keychain":
    "Itinatago ang mga susi sa keychain ng OS",
  "onboarding.identity.step.peer_id": "Kinukuha ang peer ID",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Ang pangalan mo sa mesh",
  "onboarding.username.peer_id": "Peer ID",
  "onboarding.username.card_a11y":
    "Ang pangalan mo sa mesh ay {username}. Peer ID {peerID}. {props}.",
  "onboarding.username.explanation":
    "Ang username na ito ay deterministikong kinuha mula sa iyong pampublikong susi. Pareho ito sa bawat device na nakakakita ng iyong peer ID.",
  "onboarding.username.cta": "Pumasok sa Airhop",
  "onboarding.username.prop.algorithm": "Algoritmo",
  "onboarding.username.prop.storage": "Imbakan",
  "onboarding.username.prop.storage_value": "Keychain ng OS lamang",
  "onboarding.username.prop.account": "Kailangan ng account",
  "onboarding.username.prop.account_value": "Wala",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Maligayang pagdating sa Airhop",
  "onboarding.hello.p1":
    "Kumusta. Itinayo ang Airhop sa ibabaw ng bitchat bilang isang malayang open source na side project. Hindi ito kaugnay ng o inendorso ng proyektong bitchat o ng permissionless tech, isang bagay lang itong kinatutuwaan kong buuin at ibahagi sa komunidad.",
  "onboarding.hello.p2":
    "Ito ang unang release para sa iOS at Android, kaya kahit nasubukan ko na ito kasama ang mga kaibigan, malamang na makatagpo ka pa rin ng ilang bug. Kung mangyari iyon, o kung may ideya kang feature, ikatutuwa kong marinig iyon. Magbukas ng issue sa {github} o mag-email sa akin sa {email}.",
  "onboarding.hello.p3":
    "Kung kapaki-pakinabang sa iyo ang Airhop, isaalang-alang ang pag-iwan ng bituin sa {github} o review sa {store}. Nakakatulong iyon para mas maraming tao ang makatuklas sa proyekto. Salamat sa pagsubok!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Bago magtanong ang telepono mo",
  "onboarding.primer.lede":
    "Narito ang ginagawa ng bawat isa, at ang hindi nila ginagawa.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Naghahanap ng mga device sa malapit at nagpapasa ng mensahe sa pagitan nila. Ganito nabubuo ang mesh, at gumagana ito nang walang koneksyon sa internet.",
  "onboarding.primer.location.title": "Lokasyon",
  "onboarding.primer.location.body":
    "Inilalagay ka sa mga channel ng lugar sa malapit, mula sa isang bloke hanggang sa isang rehiyon. Hindi ka kailanman sinusubaybayan ng Airhop at hindi nito ipinapadala ang tumpak mong lokasyon palabas ng device mo.",
  "onboarding.primer.notifications.title": "Mga Abiso",
  "onboarding.primer.notifications.body":
    "Tumanggap ng alerto para sa bagong mensahe kahit sarado ang app. Ginagawa ang mga abiso nang lokal sa device mo, walang server na kasangkot.",
  "onboarding.primer.footnote":
    "Puwede kang tumanggi. Naglalakbay pa rin ang mga mensahe sa internet, at puwede kang magbago ng isip mamaya sa Mga Setting.",
  "onboarding.primer.cta_a11y": "Magpatuloy sa mga hiling ng pahintulot",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Pag-access sa Bluetooth",
  "permission.bluetooth.purpose":
    "matuklasan ang mga device sa malapit sa pamamagitan ng mesh",
  "permission.open_settings": "Buksan ang Mga Setting",
  "permission.not_now": "Hindi ngayon",
  "permission.blocked_title": "Naka-off ang {label}",
  "permission.blocked_body": "I-on ito sa Mga Setting para {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "May mali",
  "error.boundary.body":
    "Nakatagpo ang Airhop ng di-inaasahang problema at kinailangang ihinto ang ipinapakita nito.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Mga default na channel",
  "chat.channels.yours": "Mga channel mo",
  "chat.channels.none": "Wala pang channel",
  "chat.channels.none_hint":
    "I-tap ang {plus} sa itaas para sumali o gumawa ng isa.",
  "chat.channels.none_desc":
    "Wala pang channel. Gamitin ang butones na pandagdag sa header para sumali o gumawa ng isa.",
  "chat.channels.show_fewer": "Magpakita ng mas kaunting default na channel",
  "chat.channels.show_less": "Magpakita ng mas kaunti",
  "chat.channels.info": "Impormasyon ng channel",
  "chat.channels.pin": "I-pin ang channel",
  "chat.channels.unpin": "I-unpin ang channel",
  "chat.channels.mute": "I-mute ang channel",
  "chat.channels.unmute": "I-unmute ang channel",
  "chat.channels.leave": "Umalis sa channel",
  "chat.channels.leave_confirm": "Umalis",
  "chat.channels.clear_body":
    "Burahin ang lahat ng mensahe sa {name}? Hindi ito maibabalik.",
  "chat.channels.leave_body":
    "Umalis sa {name}? Titigil kang tumanggap ng mga mensahe nito, at aalisin sa device na ito ang kasaysayan nito.",
  "chat.channels.more_options": "Iba pang opsyon para sa {name}",
  "chat.channels.teleported_tag": "{level}  ·  nagteleport",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Linisin ang chat",
  "chat.dm.remove_contact": "Alisin ang contact",
  "chat.dm.block": "I-block ang peer na ito",
  "chat.dm.block_confirm": "I-block",
  "chat.dm.delete": "Burahin ang chat",
  "chat.dm.delete_body":
    "Inaalis nito sa listahan mo ang usapan at binubura ang mga mensahe nito. Nananatili ang contact, at magsisimula ng bagong chat ang susunod nilang mensahe.",
  "chat.dm.in_range": "nasa saklaw",
  "chat.dm.row_hint":
    "I-tap nang dalawang beses at pindutin nang matagal para sa iba pang opsyon",
  "chat.channels.row_hint":
    "I-tap nang dalawang beses at pindutin nang matagal para sa iba pang opsyon",
  "chat.dm.you_prefix": "Ikaw:",
  "chat.dm.none": "Walang direktang mensahe",
  "chat.dm.none_desc":
    "Pumunta sa tab na Mesh at i-tap ang isang peer para magsimula ng naka-encrypt na direktang mensahe.",
  "chat.dm.contact_info": "Impormasyon ng contact",
  "chat.dm.pin": "I-pin ang chat",
  "chat.dm.unpin": "I-unpin ang chat",
  "chat.dm.mute": "I-mute ang chat",
  "chat.dm.unmute": "I-unmute ang chat",
  "chat.dm.clear_body":
    "Burahin ang lahat ng mensahe kay {name}? Hindi ito maibabalik.",
  "chat.dm.remove_contact_body":
    "Alisin si {name}? Binubura nito ang usapan at kinakalimutan ang contact. Maaabot ka pa rin nila kung mag-mensahe silang muli.",
  "chat.dm.block_body":
    "I-block si {name}? Hindi mo na sila makikita sa tab na Mesh o makakatanggap ng mensahe mula sa kanila, kahit na malapit sila.",
  "chat.dm.more_options": "Iba pang opsyon para sa {name}",
  "chat.dm.remove_contact_short": "Alisin ang contact",
  "chat.dm.block_short": "I-block ang contact",
  "chat.dm.delete_short": "Burahin ang chat",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Linisin ang mga mensahe",
  "chat.clear_confirm": "Linisin",
  "chat.group_badge": "Grupo",
  "chat.more": "Higit pa",
  "chat.no_messages": "Wala pang mensahe",
  "chat.you": "Ikaw",
  "chat.a11y.channel": "Channel na {name}",
  "chat.a11y.group": "Grupong {name}",
  "chat.a11y.muted": "naka-mute",
  "chat.a11y.pinned": "naka-pin",

  // ---- Chats: start something new ----
  "chat.new.title": "Magsimula ng bago",
  "chat.new.channel": "Gumawa ng pribadong channel",
  "chat.new.channel_label": "Pribadong channel",
  "chat.new.channel_desc":
    "Isang silid na masasalihan ng sinumang may link. Gumawa ng isa, o sumali gamit ang linkang ipinadala sa iyo.",
  "chat.new.group": "Gumawa ng pribadong grupo",
  "chat.new.group_label": "Pribadong grupo",
  "chat.new.group_desc":
    "Pumili ng partikular na mga tao. Hanggang 16. Nananatili sa Bluetooth.",
  "chat.new.place": "Pumunta sa isang lugar sa pamamagitan ng geohash",
  "chat.new.place_label": "Pumunta sa isang lugar",
  "chat.new.place_desc":
    "Buksan ang channel ng lokasyon kahit saan sa pamamagitan ng geohash nito.",
  "chat.new.reach": "Abot",
  "chat.new.reach_internet":
    "Naaabot ang mga miyembro sa Bluetooth at sa internet.",
  "chat.new.reach_mesh": "Gumagana sa saklaw ng Bluetooth, hindi sa internet.",
  "chat.new.reach_internet_desc":
    "Naaabot din ang mga miyembro sa internet. Nakikita ng mga relay na aktibo ang channel, hindi kailanman ang mga mensahe nito o kung sino ang nandoon.",
  "chat.new.reach_mesh_desc":
    "Nananatili sa lokal na mesh. Pinakapribado, walang lumalabas sa saklaw ng Bluetooth.",
  "chat.new.join_link":
    "Sumali sa pribadong channel gamit ang link ng imbitasyon",
  "chat.new.back_to_chooser": "Bumalik sa mga pagpipilian",
  "chat.new.create_channel": "Gumawa ng channel",
  "chat.new.name_required": "Maglagay muna ng pangalan ng channel",
  "chat.new.name_taken": "Kinuha na ang pangalang iyon",
  "chat.new.create": "Gumawa",
  "chat.new.e2ee":
    "Naka-encrypt nang dulo-sa-dulo. Mga miyembro lang ang makakabasa ng mga mensahe.",
  "chat.new.invite_only":
    "Sa imbitasyon lang. Makakasali ang sinumang pagbabahagian mo ng link. Nananatili itong nakatago sa iba, pati na sa mga peer sa malapit.",
  "chat.new.name_exists": "May channel nang ganitong pangalan.",
  "chat.new.reach_bluetooth_chip": "Bluetooth lang",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Sumali gamit ang link ng imbitasyon",

  // ---- Chats: join by link ----
  "chat.join.title": "Sumali gamit ang link",
  "chat.join.not_airhop": "Hindi iyon link ng Airhop.",
  "chat.join.reach_internet":
    "Naaabot ang mga miyembro sa Bluetooth at sa internet.",
  "chat.join.reach_mesh": "Nananatili sa saklaw ng Bluetooth.",
  "chat.join.contact_card":
    "Isang contact card. Idinaragdag sila sa mga contact mo at binubuksan ang chat.",
  "chat.join.unverified": "Hindi na-verify ang linkang iyon",
  "chat.join.unverified_body":
    "Hindi tugma ang contact card sa sarili nitong mga susi, kaya hindi ito naidagdag. Hilingin sa kanilang magpadala ng bago.",
  "chat.join.paste": "Idikit mula sa clipboard",
  "chat.join.join": "Sumali",
  "chat.join.public_channel":
    "Pampublikong channel na {name}. Mababasa ito ng sinumang nasa malapit.",
  "chat.join.private_channel": "Pribadong channel na {name}. {reach}",
  "chat.join.dm_with": "Direktang mensahe kay {name}.",
  "chat.join.joined_as": "Sumali bilang {name}",
  "chat.join.name_clash_body":
    "Nasa ibang {name} ka na. Label lang ang mga pangalan ng channel, kaya nagbukas ang imbitasyong ito ng sarili nitong channel at hindi nagalaw ang sinalihan mo. Puwede mong palitan ang pangalan ng alinman mula sa impormasyon ng channel nito.",
  "chat.join.paste_hint":
    "Idikit ang imbitasyong nagsisimula sa airhop://. Gumagana rin ang pag-tap ng link; para ito sa linkang hindi mo mata-tap.",
  "chat.join.key_note":
    "Dala ng imbitasyon sa pribadong channel ang susi, kaya agad ang pagsali at walang hinihingi kaninuman.",
  "chat.join.offline_note":
    "Gumagana nang offline. Binabasa sa device na ito ang link, at umaabot ang channel hanggang saan itinakda ng gumawa nito.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Hindi nabuksan ang cell na iyon. Subukan ulit maya-maya.",
  "chat.jump.title": "Pumunta sa isang lugar",
  "chat.jump.saved": "MGA NAKA-SAVE NA LUGAR",
  "chat.jump.anywhere":
    "Buksan ang pampublikong channel ng lokasyon kahit saan, pati sa lugar na wala ka.",
  "chat.jump.geohash_note":
    "Ilagay ang geohash nito. Magkakabahagi sa channel ang lahat ng nasa cell na iyon ang lokasyon.",
  "chat.jump.teleport_note":
    "Lilitaw kang nagteleport, hindi malapit. Umaabot lang ito sa internet.",
  "chat.jump.level_cell": "Cell sa antas na {level}",
  "chat.jump.already_here":
    "Nandito ka na. Bubuksan ng Pumunta ang channel mong {name}.",
  "chat.jump.open_direction": "Buksan ang cell sa {direction} mo",
  "chat.jump.open_place": "Buksan ang {name}",
  "chat.jump.remove_place": "Alisin ang {name} sa mga naka-save na lugar",
  "chat.jump.go": "Pumunta",
  "chat.jump.how":
    "Para makahanap ng geohash: buksan ang isang channel ng lokasyon > i-tap ang pangalan nito > kopyahin ito mula roon.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Hindi naabot ang bawat miyembro. Subukan ulit habang malapit sila.",
  "chat.group.you_were_added": "Naidagdag ka sa {name}.",
  "chat.group.added_you": "Idinagdag ka sa {name}",
  "chat.group.you_were_removed":
    "Inalis ka sa {name}. Hindi ka na makakabasa o makakapagpadala ng mensahe rito.",
  "chat.group.removed_you": "Inalis ka sa {name}",
  "chat.group.add_failed": "Hindi sila naidagdag",
  "chat.group.add_failed_body":
    "Walang nagbago. Alinman sa hindi sila maabot ngayon, puno na ang grupo sa 16, o hindi ikaw ang gumawa nito.",
  "chat.group.remove_failed": "Hindi sila naalis",
  "chat.group.remove_failed_body":
    "Walang nagbago. Ang gumawa lang ng grupo ang makakapagpalit kung sino ang nandoon.",
  "chat.group.e2ee":
    "Naka-encrypt nang dulo-sa-dulo. Mga miyembro lang ang makakabasa ng mga mensahe.",
  "chat.group.cap":
    "Hanggang 16 na tao, ikaw ang pipili. Walang link ng imbitasyon, kaya walang nakakasali dahil lang may nagpasa nito sa kanila.",
  "chat.group.bluetooth":
    "Bluetooth lang. Natatanggap ng mga miyembrong wala sa saklaw ang mga mensahe kapag nakabalik na sila.",
  "chat.group.members_label": "MGA MIYEMBRO",
  "chat.group.none_in_range":
    "Walang taong nasa saklaw. Dapat nasa malapit ang mga miyembro kapag gumawa ka ng grupo.",
  "chat.group.create_title": "Gumawa ng grupo",
  "chat.group.name_placeholder": "Pangalan ng grupo",
  "chat.group.create": "Gumawa",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Lokal na mesh · Bluetooth lang",
  "chat.scope.mesh_desc":
    "Umaabot sa mga device na nasa saklaw ng Bluetooth (mga 10 hanggang 100 metro). Hindi kailangan ng internet. Mainam para sa lokal na pag-uugnayan.",
  "chat.scope.block": "Bloke ng lungsod · ~100 m",
  "chat.scope.block_desc":
    "Saklaw sa antas ng isang bloke ng lungsod. Itinutulay ang mga mensahe sa internet para makasali ang mga peer na nasa labas ng saklaw ng Bluetooth pero malapit lang.",
  "chat.scope.neighborhood": "Barangay · ~1 km",
  "chat.scope.neighborhood_desc":
    "Saklaw sa antas ng barangay. Tinutulungan ng relay kaya naaabot ang mga peer sa buong lugar kahit walang direktang link ng Bluetooth.",
  "chat.scope.city": "Lungsod · ~10 km",
  "chat.scope.city_desc":
    "Channel na sakop ang buong lungsod. Gumagamit ng mga relay sa internet na nakabatay sa lokasyon para maabot ang mga peer sa buong metro.",
  "chat.scope.province": "Lalawigan · ~100 km",
  "chat.scope.province_desc":
    "Saklaw sa antas ng lalawigan. Itinutulay sa internet para sa abot na panrehiyon na daan-daang kilometro.",
  "chat.scope.country": "Bansa o rehiyon · ~1000 km",
  "chat.scope.country_desc":
    "Saklaw sa buong bansa. Makakasali at makakabasa ng mga mensahe ang sinumang gumagamit ng Airhop o bitchat sa rehiyon.",
  "chat.transport.bluetooth": "Bluetooth lang",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Internet lang",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Utos na /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Magpadala ng mainit na yakap",
  "chat.cmd.slap_hint": "Sampalin ng malaking trout",
  "chat.status.sending": "Ipinapadala…",
  "chat.status.undo_send": "I-undo ang pagpapadala",
  "chat.status.undo": "I-undo",
  "chat.status.sent": "Naipadala",
  "chat.status.received": "Natanggap",
  "chat.status.failed": "Nabigo",
  "chat.status.canceled": "Kinansela",
  "chat.status.waiting": "Naghihintay",
  "chat.status.sending_short": "Ipinapadala",
  "chat.status.receiving": "Tumatanggap",
  "chat.thread.not_available": "Hindi available dito",
  "chat.thread.private_channel": "Pribadong channel",
  "chat.thread.location_channel": "Channel ng lokasyon",
  "chat.thread.public_channel": "Pampublikong channel",
  "chat.thread.notices": "Mga paskil para sa channel na ito",
  "chat.thread.invite": "Mag-imbita ng tao sa channel na ito",
  "chat.thread.not_in_range":
    "Wala sa saklaw ng Bluetooth. Inihahatid sa internet.",
  "chat.thread.not_nearby":
    "Wala sa malapit. Ihahatid namin kapag nakabalik na sila sa saklaw o online na.",
  "chat.thread.no_keys":
    "Kailangan mong nasa saklaw ng Bluetooth, o i-scan ang code nila, para makapag-mensahe sa kanila.",
  "chat.geo.card_received":
    "Ibinahagi ni {name} ang contact niya. Ibahagi mo rin ang sa iyo para makapag-usap pa rin kayo pagkatapos lumipat ng alinman sa inyo.",
  "chat.geo.exchange_complete":
    "Napagpalit ang mga contact. Maaabot na ninyo ang isa't isa mula saanman.",
  "chat.geo.keep_person": "Panatilihin ang taong ito",
  "chat.geo.keep_person_desc":
    "Ibahagi ang contact mo para makapag-usap pa rin kayo pagkatapos lumipat ng alinman sa inyo. Malalaman nila ang permanente mong pagkakakilanlan.",
  "chat.geo.card_sent": "Naibahagi · hinihintay ang sa kanila",
  "chat.thread.left_cell":
    "Umalis ka na sa lugar na ito, kaya hindi ka nila maaabot dito. Magpalitan ng code para makapag-usap kahit saan.",
  "chat.thread.no_route":
    "Hindi sila maabot ngayon. Ipapadala ang mensahe kapag may ruta nang magagamit.",
  "chat.thread.empty": "Wala pang mensahe",
  "chat.thread.empty_desc": "Magsimula ng naka-encrypt na usapan.",
  "chat.thread.jump_latest": "Tumalon sa pinakabagong mensahe",
  "chat.thread.back_to_members": "Bumalik sa mga miyembro",
  "chat.thread.nostr_key": "Pampublikong susi sa Nostr",
  "chat.thread.in_range": "Nasa saklaw",
  "chat.voice.not_recorded": "Hindi na-record ang voice note",
  "chat.thread.message": "Mensahe",
  "chat.thread.message_placeholder": "Mensahe…",
  "chat.thread.length_full": "Puno na ang mensahe",
  "chat.thread.waiting_for": "Hinihintay bumalik si {name} · {percent}%",
  "chat.thread.peer": "peer",
  "chat.thread.cancel_transfer": "Kanselahin ang {name}",
  "chat.thread.queued_more": "{count} pa ang naghihintay maipadala",
  "chat.thread.across_bridge": "{count} sa kabila ng tulay",
  "chat.thread.bridged": "naitulay",
  "chat.thread.invite_body":
    "Samahan mo ako sa {channel} sa Airhop — pribadong pag-mensahe sa mesh, offline muna.",
  "chat.thread.go_back_unread": "Bumalik, {count} ang hindi pa nababasa",
  "chat.thread.view_info": "Tingnan ang impormasyon para kay {name}",
  "chat.thread.notices_new":
    "Mga paskil para sa channel na ito, {count} ang bago",
  "chat.thread.say_something": "Magsabi ng kahit ano sa {channel}.",
  "chat.thread.jump_latest_new":
    "Tumalon sa pinakabagong mensahe, {count} ang bago",
  "chat.thread.unconfirmed_since":
    "Walang naihatid na nakumpirma mula noong {date}",
  "chat.thread.no_reach":
    "Walang peer sa malapit · wala pang nakakatanggap nito",
  "chat.thread.channel_needs_internet":
    "Naka-off ang internet · ang mga taong nasa saklaw lang ng Bluetooth ang naaabot ng channel na ito",
  "chat.thread.cell_needs_internet":
    "Naka-off ang internet · sa internet lang naaabot ang cell na ito",
  "chat.thread.geo_dm_needs_internet":
    "Naka-off ang internet · sa internet lang dinadala ang usapang ito",
  "chat.thread.via_gateway":
    "Naka-off ang internet · may device sa malapit na nagdadala nito online para sa iyo",
  "chat.thread.group_queued":
    "Wala pang taga-grupong ito sa malapit. Aabot ito sa kanila kapag nandiyan na sila.",
  "chat.thread.no_group_key":
    "Wala ka na sa grupong ito, kaya hindi ito maipapadala",
  "chat.thread.no_reach_offline":
    "Naka-off ang internet at walang peer sa malapit · wala pang nakakatanggap nito",
  "chat.thread.mention": "Banggitin si {name}",
  "chat.thread.someone_talking": "{hold}. Nagsasalita si {name}.",
  "chat.thread.attach_note":
    "Sa saklaw lang ng Bluetooth naipapadala ang mga file. Umaabot sa mga contact sa internet ang teksto at bayad; ang mga attachment, hindi.",
  "chat.thread.message_peer": "Mag-mensahe kay {name}",
  "chat.thread.send": "Magpadala ng mensahe",
  "chat.thread.group": "Grupo",
  "chat.bridge.nearby_only":
    "Malapit lang: ilayo ang mensaheng ito sa mesh bridge",
  "chat.bridge.nearby_label": "Malapit lang · nananatili sa Bluetooth",
  "chat.bridge.bridging_label":
    "Itinutulay sa mga lugar sa malapit · i-tap para sa malapit lang",
  "chat.screenshot.you_took": "Kumuha ka ng screenshot",
  "chat.screenshot.you_took_private":
    "Kumuha ka ng screenshot · walang sinabihan",
  "chat.screenshot.heads_up": "Paalala",
  "chat.screenshot.notice": "* Kumuha ng screenshot si {name} *",
  "chat.screenshot.notified_dm":
    "Nabalitaan ni {name} na kumuha ka ng screenshot ng usapang ito.",
  "chat.screenshot.notified":
    "Nabalitaan ng lahat sa channel na ito na kumuha ka ng screenshot.",
  "chat.screenshot.not_notified":
    "Walang nabalitaan. Pampubliko ang channel na ito, kaya ang pag-anunsyo ng screenshot ay magtatala na nandito ka.",
  "chat.thread.error": "Error",
  "chat.thread.go_back": "Bumalik",
  "chat.bubble.via_bridge": "sa pamamagitan ng mesh bridge",
  "chat.bubble.view_profile": "Tingnan ang profile ni {name}",
  "chat.bubble.forwarded": "Ipinasa",
  "chat.bubble.attachment": "attachment",
  "chat.bubble.a11y":
    "{sender}: {body}. Pindutin nang matagal para sa iba pang opsyon.",
  "chat.bubble.failed_retry": "Nabigong maipadala. I-tap para subukan ulit.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Impormasyon ng mensahe",
  "chat.info.delivered_to": "Naihatid kay {name}",
  "chat.info.read_by": "Nabasa ni {name}",
  "chat.info.group_reach_desc":
    "Naaabot ngayon, hindi kumpirmasyon ng paghahatid",
  "chat.info.group_alone": "Walang ibang miyembro",
  "chat.info.today_at": "Ngayon {time}",
  "chat.info.sending": "Ipinapadala…",
  "chat.info.failed": "Nabigong maipadala",
  "chat.info.courier": "Dinala ng isang kaibigan",
  "chat.info.sent": "Naipadala",
  "chat.info.queued": "Naghihintay maipadala",
  "chat.info.waiting": "Naghihintay…",
  "chat.action.info": "Impormasyon ng mensahe",
  "chat.action.save_photos": "I-save sa mga larawan",
  "chat.action.save_copy": "Mag-save ng kopya",
  "chat.action.forward": "Ipasa",
  "chat.action.select": "Piliin",
  "chat.select.cancel": "Kanselahin ang pagpili",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Camera",
  "chat.attach.camera_desc": "Kumuha ng larawan o video",
  "chat.attach.library": "Photo library",
  "chat.attach.library_desc": "Pumili mula sa library mo",
  "chat.attach.document": "Dokumento",
  "chat.attach.document_desc": "Magpadala ng kahit anong file o PDF",
  "chat.attach.voice": "Voice note",
  "chat.attach.voice_desc": "Mag-record at magpadala ng mensaheng boses",
  "chat.attach.ecash": "Magpadala ng ecash",
  "chat.attach.ecash_desc": "Magpadala ng Cashu sat mula sa wallet mo",
  "chat.attach.location": "Lokasyon",
  "chat.attach.location_desc": "Ipadala kung nasaan ka ngayon",
  "chat.attach.title": "Maglakip",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Nagbahagi ng lokasyon",
  "chat.location.received_summary": "Ibinahagi ang lokasyon niya",
  "chat.location.title": "Lokasyon",
  "chat.location.away": "{distance} pa-{direction}",
  "chat.location.taken": "Kinuha {ago} ang nakalipas",
  "chat.location.open_maps": "Buksan sa Maps",
  "chat.location.no_forward": "Hindi ipinapasa ang mga lokasyon",
  "chat.location.no_forward_body":
    "Sa isang tao lang ipinapadala ang lokasyon. Ibahagi na lang ang sa iyo kung gusto mong mayroon nito ang iba.",
  "chat.location.no_fix":
    "Payagan ang lokasyon para makita kung gaano ito kalayo",
  "chat.location.send_title": "Ipadala ang lokasyon mo",
  "chat.location.send_body":
    "Isang punto lang ang makikita ni {name}: kung nasaan ka ngayon. Hindi ito patuloy na nag-a-update.",
  "chat.location.send": "Ipadala ang lokasyon",
  "chat.location.finding": "Hinahanap ang lokasyon mo…",
  "chat.location.no_location": "Hindi nakuha ang lokasyon mo",
  "chat.location.no_location_body":
    "Payagan ang access sa lokasyon at tiyaking naka-on ang mga serbisyo ng lokasyon, tapos subukan ulit.",
  "chat.location.not_delivered": "Hindi naipadala ang lokasyon mo",
  "chat.location.not_delivered_body":
    "Sulit lang ipadala ang lokasyon habang ito ay napapanahon, kaya hindi ito ipinipila para mamaya. Subukan ulit kapag naaabot na si {name}.",
  "chat.location.direction.n": "hilaga",
  "chat.location.direction.ne": "hilagang-silangan",
  "chat.location.direction.e": "silangan",
  "chat.location.direction.se": "timog-silangan",
  "chat.location.direction.s": "timog",
  "chat.location.direction.sw": "timog-kanluran",
  "chat.location.direction.w": "kanluran",
  "chat.location.direction.nw": "hilagang-kanluran",
  "chat.attach.send_anyway": "Ipadala pa rin",
  "chat.attach.bitchat_too_big": "Maaaring hindi ito dumating",
  "chat.attach.bitchat_too_big_body":
    "Nasa bitchat si {name}, na sumusuko sa gitna kapag malaki ang file. Maaasahan ang mas mababa sa mga 350 KiB. Walang ganoong limitasyon kapag ipinadala ito sa isang contact sa Airhop.",
  "chat.attach.bitchat_unopenable": "Maaaring hindi nila ito mabuksan",
  "chat.attach.bitchat_unopenable_body":
    "Nasa bitchat si {name}, na nagpapakita ng mga larawan at voice note pero inililista ang lahat ng iba bilang file na hindi nito mabuksan. Darating ito, hindi lang nila ito matitingnan.",
  "chat.attach.file": "Maglakip ng file",
  "chat.attach.unavailable": "Walang attachment dito",
  "chat.attach.not_sent": "Hindi naipadala ang attachment",
  "chat.attach.read_failed":
    "May mali sa pagbasa ng file na iyon. Sumubok ng iba.",
  "chat.attach.caption": "Magdagdag ng caption…",
  "chat.attach.send": "Ipadala ang attachment",
  "chat.attach.generic": "Attachment",
  "chat.media.view_full": "Tingnan ang larawan nang buong screen",
  "chat.media.gone_photo": "Wala sa device na ito ang larawan",
  "chat.media.gone_video": "Wala sa device na ito ang video",
  "chat.media.gone_voice": "Wala sa device na ito ang voice note",
  "chat.media.gone_file": "Wala sa device na ito ang file",
  "chat.media.gone_note":
    "Inalis pagkatapos ng 7 araw o noong nilinis ang cache",
  "chat.media.ask_resend": "Humingi ulit",
  "chat.media.resend_draft": "Puwede mong ipadala ulit ang {kind} na iyon?",
  "chat.media.kind_photo": "larawan",
  "chat.media.kind_video": "video",
  "chat.media.kind_voice": "voice note",
  "chat.media.kind_file": "file",
  "chat.media.pause_voice": "I-pause ang voice note",
  "chat.media.play_voice": "I-play ang voice note",
  "chat.media.voice_position": "Posisyon sa voice note",
  "chat.media.voice_scrub": "I-tap sa mga bar para tumalon sa puntong iyon",
  "chat.media.image": "Imahe",
  "chat.media.tap_load_photo": "I-tap para i-load ang larawan",
  "chat.media.open_document": "Buksan ang {name}",
  "chat.media.document": "dokumento",
  "chat.media.tap_load_video": "I-tap para i-load ang video",
  "chat.media.video": "Video",
  "chat.media.photo": "Larawan",
  "chat.media.close_photo": "Isara ang larawan",
  "chat.media.save_photo": "I-save ang larawan sa mga larawan mo",
  "chat.media.share_photo": "Ibahagi ang larawan",
  "chat.media.saved_videos": "Na-save sa mga video mo",
  "chat.media.saved_photos": "Na-save sa mga larawan mo",
  "chat.media.not_saved": "Hindi na-save",
  "chat.media.cant_open": "Hindi mabuksan ang file",
  "chat.media.no_app":
    "Walang app ang device na ito na makakabukas o makakapagbahagi ng file na ito.",
  "chat.media.open_failed":
    "Hindi nabuksan ang file. Maaaring nalinis na ito sa cache.",
  "media.blocked.nostr_only":
    "Kilala mo lang ang taong ito sa pamamagitan ng relay. Teksto lang ang puwede. Kailangan ng Bluetooth para sa larawan, file at voice note.",
  "media.blocked.private_channel":
    "Nilalagdaan pero hindi ini-encrypt ang isang broadcast na attachment, kaya kapag ipinadala ito sa pribadong channel, mailalantad ito samantalang nananatiling naka-encrypt ang teksto rito.",
  "media.blocked.private_group":
    "Nilalagdaan pero hindi ini-encrypt ang isang broadcast na attachment, kaya kapag ipinadala ito sa pribadong grupo, mailalantad ito samantalang nananatiling naka-encrypt ang teksto rito.",
  "media.blocked.location_channel":
    "Umaabot ang channel ng lokasyon sa mga tao sa pamamagitan ng internet, at dumadaan sa Bluetooth ang larawan, file at voice note, kaya hindi talaga ito makakarating.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Walang voice note dito",
  "chat.voice.hold_live": "Pindutin nang matagal para makipag-usap nang live",
  "chat.voice.hold_record":
    "Pindutin nang matagal para mag-record ng voice note",
  "chat.voice.cancel_recording": "Kanselahin ang pagre-record",
  "chat.voice.slide_cancel": "Mag-slide para kanselahin",
  "chat.voice.release_cancel": "Bitawan para kanselahin",
  "chat.voice.a11y_toggle":
    "I-tap nang dalawang beses para magsimula o tumigil sa pagsasalita.",
  "chat.voice.limit_reached":
    "Naabot ang limitasyong dalawang minuto, bitawan para ipadala",
  "chat.voice.limit_sent":
    "Naabot ang limitasyong dalawang minuto, naipadala ang note",
  "chat.voice.stop_send": "Itigil ang pagre-record at ipadala",
  "chat.voice.lift_lock": "Mag-slide paitaas para mag-record nang hands-free",
  "chat.voice.live_speaking": "Nagsasalita si {name}",
  "voice.unavailable": "Hindi available ang live na boses",
  "voice.recording_stopped": "Itinigil ang pagre-record",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Pag-access sa camera",
  "chat.perm.camera_purpose": "kumuha ng larawang ipapadala",
  "chat.perm.photo_label": "Pag-access sa larawan",
  "chat.perm.photo_purpose": "pumili ng larawan o video na ipapadala",
  "chat.perm.photo_save_purpose": "i-save ito sa mga larawan mo",
  "chat.perm.mic_label": "Pag-access sa mikropono",
  "chat.perm.mic_live_purpose": "makipag-usap sa mga taong malapit",
  "chat.perm.mic_note_purpose": "mag-record ng voice note",
  "chat.perm.recording_stopped": "Itinigil ang pagre-record",
  "chat.perm.record_failed":
    "Hindi nasimulan ang pagre-record. Suriin ang mga pahintulot sa mikropono.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Naangkin",
  "chat.ecash.reclaimed": "Nabawi",
  "chat.ecash.claiming": "Inaangkin…",
  "chat.ecash.claim": "Angkinin",
  "chat.ecash.claim_amount": "Angkinin ang {amount} {unit}",
  "chat.ecash.already_claimed": "Naangkin na",
  "chat.ecash.already_claimed_body":
    "Nasa wallet mo na ang bawat patunay sa token na ito, kaya walang naidagdag.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Ibinigay sa mesh para sa paghahatid na kayang-kaya",
  "chat.info.queued_desc":
    "Hawak sa teleponong ito hanggang may ruta papunta sa kanila",
  "chat.info.reclaimed": "Nabawi",
  "chat.info.reclaimed_desc":
    "Ibinalik mo ang bayad na ito sa wallet mo, kaya hindi ito maihahatid",
  "chat.info.about": "Tungkol dito",
  "chat.info.group_desc":
    "Isang pribadong grupo. Ang mga miyembrong idinagdag ng gumawa lang ang makakabasa nito, at nananatili ito sa Bluetooth.",
  "chat.info.teleported_desc":
    "Isang pampublikong channel ng lokasyon para sa cell na geohash na ito. Ibinabahagi ito sa internet ng sinumang nasa cell, nasa Airhop man o bitchat. Nagteleport ka, hindi ka pisikal na nandito.",
  "chat.info.custom_desc":
    "Isang custom na channel. Makakasali ang sinumang nakakaalam ng pangalan mula sa kahit anong device na may Airhop o bitchat.",
  "chat.info.private_e2ee": "Pribado · naka-encrypt nang dulo-sa-dulo",
  "chat.info.public_plain": "Pampubliko · hindi naka-encrypt",
  "chat.info.group_privacy":
    "Ang mga miyembrong nakalista sa ibaba lang ang makakabasa ng grupong ito. Nananatili sa Bluetooth ang mga mensahe, kaya natatanggap ng mga miyembrong wala sa saklaw ang mga ito kapag nakabalik na sila.",
  "chat.info.teleport_privacy":
    "Isang lugar na tinelepotran mo. Umaabot ito sa lahat ng nasa cell na ito sa internet, at wala kahit isa sa saklaw ng Bluetooth.",
  "chat.info.location_off_privacy":
    "Naka-off ang lokasyon, kaya sa Bluetooth lang umaabot ang channel na ito sa mga device sa malapit. I-on ang lokasyon para maabot ang cell ng lugar nito sa internet.",
  "chat.info.invite_privacy":
    "Ang mga taong iniimbita mo sa link lang ang makakabasa nito. Nananatili itong nakatago sa iba, pati na sa mga peer sa malapit.",
  "chat.info.public_privacy":
    "Mababasa ng sinumang sumali ang bawat mensahe. Gumamit ng direktang mensahe para sa pribadong usapan; naka-encrypt nang dulo-sa-dulo ang mga direktang mensahe.",
  "chat.info.remove_member": "Alisin ang miyembro",
  "chat.info.remove_member_body":
    "Alisin si {name} sa grupo? Papalitan ang susi ng grupo kaya hindi na nila mababasa ang mga bagong mensahe.",
  "chat.info.message_member": "Mag-mensahe kay {name}",
  "chat.info.remove_member_a11y": "Alisin si {name}",
  "chat.info.no_addable":
    "Walang naaabot na peer na maidaragdag. Dapat nasa malapit ang mga miyembro.",
  "chat.info.add_count": "Magdagdag ng {count}",
  "chat.info.teleported_tag": "{level}  ·  nagteleport",
  "chat.info.active": "Aktibo",
  "chat.info.members": "Mga Miyembro",
  "chat.info.bookmark": "I-bookmark ang lugar na ito",
  "chat.info.remove_bookmark": "Alisin ang bookmark",
  "chat.info.default_notice":
    "Hindi puwedeng iwan ang mga default na channel. Bahagi sila ng protocol ng mesh ng Airhop.",
  "chat.info.custom_channel": "Custom na channel",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Kopyahin ang geohash",
  "chat.info.relays": "Mga Relay",
  "chat.info.show_relays":
    "Ipakita ang mga relay na nagdadala ng channel na ito",
  "chat.info.relay_custom": "custom",
  "chat.info.relays_none": "Wala. Bluetooth lang ang cell na ito ngayon.",
  "chat.info.search_members": "Maghanap ng miyembro",
  "chat.info.search_members_placeholder": "Maghanap ng miyembro…",
  "chat.info.teleported": "Nagteleport",
  "chat.info.creator": "Gumawa",
  "chat.info.no_matches": "Walang tugma",
  "chat.info.no_one_here": "Wala pang tao rito",
  "chat.info.add_members": "Magdagdag ng miyembro",
  "chat.info.add_selected": "Idagdag ang mga napiling miyembro",
  "chat.info.add": "Idagdag",
  "chat.info.leave_group": "Umalis sa grupo",
  "chat.info.leave_channel": "Umalis sa channel",
  "chat.info.leave": "Umalis",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Nag-uusap mula noong {date}",
  "chat.contact.verified_since": "Na-verify mula noong {date}",
  "chat.contact.anonymous": "Hindi nagpapakilala",
  "chat.contact.anonymous_desc":
    "Isang sagisag-panulat na geohash na walang tuloy-tuloy na pagkakakilanlang mave-verify",
  "chat.contact.verified": "Na-verify",
  "chat.contact.verified_desc": "Na-scan ang QR code nila",
  "chat.contact.verified_desc_compared": "Naghambing kayo ng code",
  "chat.contact.not_verified": "Hindi na-verify",
  "chat.contact.not_verified_desc":
    "I-scan ang code nila, o maghambing ng isa sa tawag, para makumpirmang sila nga talaga",
  "chat.contact.e2ee": "Naka-encrypt nang dulo-sa-dulo",
  "chat.contact.e2ee_nostr":
    "Nakabalot ayon sa NIP-17, kaya hindi ito mabasa ng mga relay",
  "chat.contact.e2ee_mesh":
    "Noise XX, kasama ang Double Ratchet sa pagitan ng mga device na may Airhop",
  "chat.contact.copy_nostr": "Kopyahin ang pampublikong susi sa Nostr",
  "chat.contact.nostr_key": "Pampublikong susi sa Nostr",
  "chat.contact.cell_key_note":
    "Sa lugar na pinagkitaan ninyo nabibilang ang susing ito. Nagbabago ito kapag lumipat ang alinman sa inyo, at natatapos ang usapan kasama nito. Magpalitan ng contact para makapag-usap kahit saan.",
  "chat.contact.peer_name": "Pangalan ng peer",
  "chat.contact.peer_id": "Peer ID",
  "chat.contact.rename": "Palitan ang pangalan",
  "chat.contact.rename_needs_contact":
    "Puwede mong palitan ang pangalan ng mga taong hawak mo ang mga susi. Magpalitan muna ng contact card, tapos magiging pangalan ito na ikaw lang ang nakakakita.",
  "chat.contact.rename_needs_keys":
    "Wala pang susi para sa contact na ito. Mag-mensahe sa kanila, o i-scan ang code nila, at makakapagbigay ka ng pangalang ikaw lang ang nakakakita.",
  "chat.contact.renamed_by_you": "Pangalan mo para sa kanila",
  "chat.contact.copy_peer_id": "Kopyahin ang peer ID",
  "chat.contact.verify": "I-verify ang contact",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Mga Paskil",
  "chat.notices.post_area": "Magpaskil sa lugar na ito",
  "chat.notices.post_mesh": "Magpaskil sa mesh",
  "chat.notices.mark_urgent": "Markahang mahalaga",
  "chat.notices.post": "Ipaskil",
  "chat.notices.post_short": "Ipaskil",
  "chat.notices.delete": "Burahin ang paskil",
  "chat.notices.just_now": "kanina lang",
  "chat.notices.fades_soon": "malapit nang kumupas",
  "chat.notices.1_day": "1 araw",
  "chat.notices.3_days": "3 araw",
  "chat.notices.7_days": "7 araw",
  "chat.notices.fading": "kumukupas",
  "chat.notices.fades_in_hours": "kukupas sa loob ng {count} oras",
  "chat.notices.fades_in_days": "kukupas sa loob ng {count} araw",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Mahalaga",
  "chat.notices.permanent_warning":
    "Hindi kailanman kumukupas. Pampubliko at nakatali sa lugar na ito, at hindi mo ito mababawi.",
  "chat.notices.none":
    "Wala pang paskil. Magpaskil ng isa para manatili ito rito para sa iba.",

  // ---- Chats: search results ----
  "chat.search.photos": "Mga Larawan",
  "chat.search.videos": "Mga Video",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Mga Dokumento",
  "chat.search.links": "Mga Link",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "I-filter ayon sa {filter}",
  "chat.search.no_matches": "Walang {filter} na tumutugma sa “{query}”",
  "chat.search.no_media": "Wala pang {filter}",
  "chat.search.result_a11y": "{chat}, {kind} mula kay {sender}",
  "chat.search.you": "ikaw",
  "chat.search.section_chats": "Mga Chat",
  "chat.search.section_messages": "Mga Mensahe",
  "chat.search.section_notices": "Mga Paskil",
  "chat.search.hint":
    "Maghanap sa mga mensahe at chat, o pumili ng filter sa itaas.",
  "chat.search.no_results": "Walang resulta para sa “{query}”",
  "chat.search.open_chat": "Buksan ang {name}",
  "chat.search.message_a11y": "{chat}, mensahe mula kay {sender}: {snippet}",
  "chat.search.notice_a11y": "Paskil sa {chat} mula kay {author}: {snippet}",
  "chat.search.urgent": "Mahalaga ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "May {count} sa listahang ito. Kapag nilinis, dito lang sila naaalis, at nananatiling hindi pa nababasa ang mga mensahe sa mga usapan nila. Kapag minarkahang nabasa lahat, nalilinis pareho.",
  "chat.notif.mark_all_read": "Markahang nabasa lahat",
  "chat.notif.clear_list": "Linisin ang listahan",
  "chat.notif.clear_all_a11y": "Linisin ang lahat ng {count} abiso",
  "chat.notif.title": "Mga Abiso",
  "chat.notif.clear_short": "Linisin",
  "chat.notif.close": "Isara ang mga abiso",
  "chat.notif.none": "Wala pang abiso",
  "chat.notif.none_desc":
    "Lumilitaw dito ang mga mensahe, pagbanggit, at paskil mula sa mga channel at chat mo.",
  "chat.notif.new": "Bago",
  "chat.notif.notice_in": "paskil sa {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Ipasa kay…",
  "chat.forward.to": "Ipasa kay {name}",
  "chat.forward.cant_send_here": "Hindi maipapasa rito",
  "chat.forward.cant_send_to": "Hindi maipapasa kay {name}",
  "chat.forward.channels": "Mga Channel",
  "chat.forward.groups": "Mga Grupo",
  "chat.forward.locations": "Mga Lokasyon",
  "chat.forward.dms": "Mga direktang mensahe",
  "chat.forward.none": "Wala pang ibang chat",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Sinisimulan ang mesh…",
  "mesh.banner.no_bluetooth":
    "Walang Bluetooth sa device na ito · internet lang",
  "mesh.banner.bluetooth_off":
    "Naka-off ang Bluetooth · hindi available ang mesh",
  "mesh.banner.permission_needed": "Kailangan ng pahintulot sa Bluetooth",
  "mesh.banner.blocked":
    "Naka-block ang Bluetooth · payagan ito sa Mga Setting",
  "mesh.banner.location_permission":
    "Kailangan ng lokasyon para makahanap ng peer",
  "mesh.banner.advertising_unsupported":
    "Nakikita ng teleponong ito ang iba pero hindi ito matutuklasan",
  "mesh.banner.location_off_android":
    "Naka-off ang lokasyon · kailangan ito ng Android para makahanap ng peer",
  "mesh.banner.paused": "Naka-pause ang mesh · wala ka rito",
  "mesh.banner.location_off":
    "Naka-off ang lokasyon · hindi available ang mga channel ng lokasyon",
  "mesh.banner.battery_saver": "Battery saver · mas madalang mag-scan",
  "mesh.banner.wipe_incomplete":
    "Hindi tapos ang paglilinis · may ilang datos na maaaring naiwan, susubukan ulit sa muling pagbukas",
  "mesh.banner.wifi_off":
    "Naka-off ang Wi-Fi · mas mabagal ipadala ang malalaking file",
  "mesh.banner.clock_skew":
    "Mali ang orasan ng teleponong ito · itakda sa awtomatiko ang petsa at oras",
  "mesh.banner.internet_off": "Naka-off ang internet · Bluetooth lang",
  "mesh.banner.relaying":
    "Walang peer sa malapit · nagpapasa sa pamamagitan ng Nostr",
  "mesh.banner.tor": "Naka-on ang Tor · nairuruta ang trapiko sa internet",
  "mesh.banner.tor_starting": "Sinisimulan ang Tor · kumokonekta",
  "mesh.banner.tor_blocked":
    "Hindi nakakonekta ang Tor · gumagana pa rin ang mesh",
  "mesh.banner.gateway":
    "Naka-on ang internet gateway · nagpapasa para sa mga peer sa malapit",
  "mesh.banner.bridge":
    "Naka-on ang mesh bridge · nakaugnay ang pampublikong chat",
  "mesh.banner.background_limits":
    "Maaaring i-pause ng {brand} ang mesh sa background",
  "mesh.banner.bridge_across":
    "Naka-on ang mesh bridge · {count} sa kabila ng tulay",
  "mesh.banner.action.turn_on": "I-on",
  "mesh.banner.action.allow": "Payagan",
  "mesh.banner.action.resume": "Ipagpatuloy",
  "mesh.banner.action.fix": "Ayusin",
  "mesh.banner.hint.resume":
    "Muling ino-on ang pag-advertise at pag-scan ng Bluetooth",
  "mesh.banner.hint.enable_bluetooth":
    "Hinihiling sa Android na i-on ang Bluetooth",
  "mesh.banner.hint.location_settings":
    "Binubuksan ang mga setting ng lokasyon ng sistema",
  "mesh.banner.hint.app_settings":
    "Binubuksan ang mga pahintulot ng Airhop sa mga setting ng sistema",
  "mesh.banner.hint.battery_settings":
    "Binubuksan ang mga setting ng aktibidad sa background ng teleponong ito",
  "mesh.banner.dismiss": "I-dismiss: {label}",
  "mesh.banner.hint.dismiss": "Itinatago ang paalalang ito nang tuluyan",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Naghahanap ng peer sa malapit…",
  "mesh.radar.starting": "Sinisimulan ang mesh…",
  "mesh.radar.no_bluetooth": "Walang Bluetooth sa device na ito",
  "mesh.radar.bluetooth_off": "Naka-off ang Bluetooth · hindi nag-i-scan",
  "mesh.radar.permission_needed": "Kailangan ng pahintulot sa Bluetooth",
  "mesh.radar.blocked": "Naka-block ang Bluetooth",
  "mesh.radar.location_permission": "Kailangan ng pahintulot sa lokasyon",
  "mesh.radar.location_off": "Naka-off ang lokasyon · hindi nag-i-scan",
  "mesh.radar.hint_rings":
    "Lakas ng signal ng BLE ang ipinapakita ng mga singsing, hindi distansya",
  "mesh.radar.hint_checking": "Sinusuri ang Bluetooth at mga pahintulot",
  "mesh.radar.hint_internet": "Naglalakbay pa rin ang mga mensahe sa internet",
  "mesh.radar.hint_turn_on": "I-on ang Bluetooth para makatuklas ng peer",
  "mesh.radar.hint_allow": "Payagan ang Bluetooth para makatuklas ng peer",
  "mesh.radar.hint_allow_settings":
    "Payagan ang Bluetooth sa Mga Setting para makatuklas ng peer",
  "mesh.radar.hint_location_permission":
    "Kailangan ng lokasyon ng Android 11 pababa para mag-scan sa Bluetooth",
  "mesh.radar.hint_android_location":
    "Kailangan ng Android na naka-on ang lokasyon para maibalik ang resulta ng pag-scan sa Bluetooth",
  "mesh.radar.signal_strong": "Malakas",
  "mesh.radar.signal_medium": "Katamtaman",
  "mesh.radar.signal_weak": "Mahina",
  "mesh.radar.you_center": "Ikaw, sa gitna ng mesh",
  "mesh.radar.sonar_hint":
    "Nagpapatugtog ng sonar sweep. Tuloy-tuloy na ang pag-scan.",
  "mesh.radar.paused": "Naka-pause ang mesh · wala ka rito",
  "mesh.radar.ring_hint":
    "Lakas ng signal ang ipinapakita ng posisyon sa singsing, hindi distansya",
  "mesh.radar.set_online":
    "Itakda ang status mo sa Online sa tab na Ikaw para makatuklas ng peer",
  "mesh.radar.in_range": "nasa saklaw",
  "mesh.radar.recently_seen": "kamakailan nakita",
  "mesh.radar.peer_hint":
    "Binubuksan ang mga opsyon para mag-mensahe o magbayad sa peer na ito",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "kanina lang",
  "mesh.peer.none": "Walang peer sa malapit",
  "mesh.peer.none_desc":
    "Lumilitaw dito ang ibang device na may Airhop o bitchat na nasa saklaw ng Bluetooth.",
  "mesh.peer.id_copied": "Nakopya ang peer ID",
  "mesh.peer.copy_id": "Kopyahin ang peer ID",
  "mesh.peer.their_name": "Nagpapakilalang {name}",
  "mesh.peer.in_range": "Nasa saklaw",
  "mesh.peer.relay": "Relay node",
  "mesh.peer.relay_body":
    "Isang radyong iniwang naka-on ng isang tao para palawakin ang mesh. Nagdadala ito ng mga mensaheng hindi nito mabasa. Walang taong mame-mensahe rito.",
  "mesh.peer.send_dm": "Magpadala ng direktang mensahe",
  "mesh.peer.message": "Mensahe",
  "mesh.peer.send_sats": "Magpadala ng ecash",
  "mesh.peer.amount_placeholder": "Halaga sa sat",
  "mesh.peer.amount_first": "Magpadala ng ecash, maglagay muna ng halaga",
  "mesh.peer.cancel_send": "Kanselahin ang pagpapadala ng ecash",
  "mesh.peer.view_peer": "Tingnan ang peer na {name}",
  "mesh.peer.view_peer_online": "Tingnan ang peer na {name}, online",
  "mesh.peer.last_seen": "Huling nakita {ago} ang nakalipas",
  "mesh.peer.send_amount": "Magpadala ng {amount} sat",
  "mesh.peer.direct": "Direktang koneksyon",
  "mesh.peer.check_distance": "Suriin ang distansya",
  "mesh.peer.checking": "Sinusuri",
  "mesh.peer.no_reply": "Walang sagot",
  "mesh.peer.no_reply_hint":
    "Maaaring lumipat na sila, o hindi sumasagot ang app nila",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Rehiyon",
  "mesh.level.province": "Lalawigan",
  "mesh.level.city": "Lungsod",
  "mesh.level.neighborhood": "Barangay",
  "mesh.level.block": "Bloke ng lungsod",
  "mesh.level.building": "Gusali",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Nagagastos",
  "wallet.balance.unit_hint": "Nagpapalit sa pagitan ng satoshi at bitcoin",
  "wallet.balance.a11y": "Balanse {value} {unit}",
  "wallet.balance.locked":
    "Naka-lock ang imbakan ng wallet. Nasa naka-encrypt na file ang mga patunay ng ecash at nasa keychain ng device ang susi nito, at hindi ito nabuksan. I-unlock ang device mo at buksang muli ang Airhop.",
  "wallet.balance.tor_blocked":
    "Naka-on ang Tor, kaya naka-block ang mga hiling sa mint: dadaan sana ang mga ito sa bukas na net at maiuugnay ang IP mo sa mga patunay mo. Gumagana pa rin ang pagpapadala at pagtanggap sa mesh. Payagan ang trapiko ng mint sa ilalim ng Mga Setting, Seguridad.",
  "wallet.balance.unconfirmed_note":
    "{amount} ang hindi pa nakukumpirma sa mint",
  "wallet.balance.reserved_note":
    "{amount} ang nakalaan para sa padalang nasa daan",
  "wallet.balance.other_mint_note": "{amount} sa ibang mint",
  "wallet.balance.test_mint_note":
    "Kasama ang pera-perahan mula sa isang test mint. Hindi ito bitcoin at hindi ito maipapalit sa pera.",
  "wallet.token": "Token",
  "wallet.action.send": "Magpadala ng token ng ecash",
  "wallet.action.send_disabled":
    "Magpadala ng token ng ecash, hindi available sa walang lamang balanse",
  "wallet.action.receive": "Tumanggap ng token ng ecash",
  "wallet.action.zap": "Mag-zap ng contact sa Nostr",
  "wallet.action.zap_disabled":
    "Mag-zap ng contact sa Nostr, hindi available sa walang lamang balanse",
  "wallet.action.add_mint": "Magdagdag ng mint ng Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Hindi nabuo ang token",
  "wallet.send.title": "Magpadala ng ecash",
  "wallet.send.amount_in": "Halaga sa {unit}",
  "wallet.send.body":
    "Binuo nang offline mula sa mga patunay na hawak mo na. Walang tuluyang umaalis sa balanse mo hangga't hindi mo kinukumpirmang naihatid ang token.",
  "wallet.send.stale_fee_note":
    "Huling sinuri ang mga bayarin {days} araw ang nakalipas. Kung itinaas ng mint na ito ang bayarin nito mula noon, maaaring bahagyang mas mahal ang padala.",
  "wallet.send.fee_note":
    "{spend} {unit} ang aalis sa balanse mo; sinasagot ng dagdag na {fee} ang bayarin sa mint na sila sana ang magbabayad",
  "wallet.send.qr_too_big":
    "Nahahati ang token na ito sa napakaraming barya kaya hindi ito kasya sa QR code. Ibahagi o kopyahin na lang ito, o mag-refresh sa mint para pagsamahin ang mga ito.",
  "wallet.send.bearer_note":
    "Kung sino ang may hawak ng string na ito ang nagmamay-ari ng pera. Nakalaan ang mga patunay, hindi nagastos: kung wala itong maabot na tao, mababawi mo ang mga ito sa ilalim ng Nakabinbin.",
  "wallet.send.qr_too_big_short":
    "Nahahati ang token na ito sa napakaraming barya kaya hindi ito kasya sa QR code. Ibahagi o kopyahin na lang ito.",
  "wallet.send.scan_note":
    "Ipa-scan ito sa kanila mula sa wallet nila. Mababawi pa rin ito hangga't hindi mo ito minamarkahang naihatid.",
  "wallet.send.mesh_note":
    "Lumalabas ang token bilang naka-encrypt na direktang mensahe sa mesh. Hindi kailangan ng internet.",
  "wallet.send.no_peers_note":
    "Buksan ang tab na Mesh para makahanap ng device sa malapit, o ibahagi ang token sa ibang paraan.",
  "wallet.send.send_to": "Ipadala kay {name}",
  "wallet.send.memo": "Memo (opsyonal, sumasama sa token)",
  "wallet.send.building": "Binubuo…",
  "wallet.send.build": "Bumuo ng token",
  "wallet.send.inexact_body":
    "Hindi kayang gawing eksaktong {amount} {unit} ng mga patunay mo nang offline. Ang pinakamaliit na token na kaya mong buuin ay {spend} {unit}, at walang sukli kapag offline: mapupunta sa tatanggap ang dagdag na {extra} {unit}.\n\nKapag nag-refresh sa mint habang online, mahahati ang mga patunay mo sa mga denominasyong eksaktong bagay dito.",
  "wallet.send.send_amount": "Magpadala ng {amount}",
  "wallet.send.sent_to": "{amount} {unit} ang naipadala kay {name}",
  "wallet.send.sent_to_body":
    "{route} Mananatili itong mababawi sa ilalim ng Nakabinbin hangga't hindi mo kinukumpirmang natanggap nila ito, o hangga't hindi sinasabi ng mint na natubos na ang mga patunay.",
  "wallet.send.copy_token": "Kopyahin ang token",
  "wallet.send.share_token": "Ibahagi ang token",
  "wallet.send.open_in_wallet": "Buksan ang token na ito sa ibang wallet",
  "wallet.send.open_in_wallet_short": "Buksan sa wallet",
  "wallet.send.to_peer": "Ipadala ang token sa peer sa malapit",
  "wallet.send.to_peer_short": "Ipadala sa peer",
  "wallet.send.mark_delivered": "Markahang naihatid at tapusin",
  "wallet.send.they_got_it": "Natanggap nila",
  "wallet.send.keep_pending": "Iwang nakabinbin ang padalang ito",
  "wallet.send.decide_later": "Magpasya mamaya",
  "wallet.send.no_peers": "Walang peer sa saklaw",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Sarili mong bayad ito",
  "wallet.receive.own_payment_body":
    "Nakalaan pa rin ang mga baryang ito para sa padalang hindi mo pa naaayos, kaya walang maaangkin. Gamitin ang Bawiin sa bayad na iyon para maibalik ang mga ito nang tuwiran sa balanse mo.",
  "wallet.receive.already_have": "Nasa wallet mo na",
  "wallet.receive.already_have_body":
    "Nakaimbak na rito ang bawat patunay sa token na ito, kaya walang naidagdag. Hindi nagbago ang mga balanse.",
  "wallet.receive.stored_unconfirmed":
    "Nakaimbak mula sa {mint}, pero hindi pa nakukumpirma sa mint ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Natubos sa {mint}. Sa iyo na lang ang mga patunay na ito: hindi na gumagana ang kopya ng nagpadala.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Natubos sa {mint}. Napatutunayang sa iyo na ito ngayon: hindi na gumagana ang kopya ng token na ito sa nagpadala.",
  "wallet.receive.stored_pending":
    "Nakaimbak mula sa {mint}, pero hindi pa kinukumpirma ng mint na hindi pa ito nagagastos{dleq}. Mag-refresh mula sa tab na Wallet kapag online ka na.",
  "wallet.receive.dleq_inline":
    " (tumutugma naman ang lagda nito, kaya tunay ang token)",
  "wallet.receive.dleq_ok":
    "Tumutugma ang lagda ng mint, kaya tunay ang token.",
  "wallet.receive.dleq_uncached":
    "Wala rito ang mga susi ng mint, kaya hindi nasuri ang lagda nang offline.",
  "wallet.receive.dleq_warning":
    "Hangga't hindi ka nagre-refresh nang online, sa prinsipyo ay maaaring nagastos na ito ng nagpadala sa ibang lugar.",
  "wallet.receive.failed": "Hindi natanggap",
  "wallet.receive.title": "Tumanggap ng ecash",
  "wallet.receive.body":
    "Idikit ang isang token ng Cashu. Kapag online, agad itong tinutubos sa mint; kapag offline, iniimbak ito at kinukumpirma sa susunod mong pag-refresh.",
  "wallet.receive.scan": "Mag-scan ng QR code ng ecash",
  "wallet.receive.scan_short": "Mag-scan ng QR",
  "wallet.receive.receiving": "Tumatanggap…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap na natanggap mula kay {from}… at natubos sa wallet mo.",
  "wallet.zap.title": "Mag-zap ng identidad sa Nostr",
  "wallet.zap.not_npub": "hindi npub",
  "wallet.zap.bad_key": "maling susi",
  "wallet.zap.invalid_pubkey": "Hindi wastong pampublikong susi",
  "wallet.zap.invalid_pubkey_body":
    "Maglagay ng npub1… o 64-karakter na hex na pampublikong susi ng Nostr.",
  "wallet.zap.sent": "Naipadala ang nutzap",
  "wallet.zap.failed": "Nabigo ang zap",
  "wallet.zap.body":
    "Kung naglalathala sila ng impormasyong nutzap ng NIP-61, nakakandado ang ecash sa susi nila kaya walang ibang makakagastos nito, at hindi na ito mababawi. Kung hindi, ipinapadala ito bilang tokeng puwedeng bawiin. Sasabihin sa iyo kung alin ang nangyari.",
  "wallet.zap.contact": "I-zap si {name}",
  "wallet.zap.pubkey_placeholder": "npub1… o 64-karakter na hex",
  "wallet.zap.sending": "Ipinapadala…",
  "wallet.nostr.copied_body":
    "Ibigay ito sa isang tao at ma-zap ka nila mula sa Airhop o kahit anong wallet ng Nostr, nang walang Bluetooth.",
  "wallet.nostr.copy_key":
    "Kopyahin ang susi mo sa Nostr para ma-zap ka ng mga tao",
  "wallet.nostr.your_key": "Ang susi mo sa Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Naidagdag ang mint",
  "wallet.mint.add_failed": "Hindi naidagdag ang mint",
  "wallet.mint.added_named": "Naidagdag ang {name}",
  "wallet.mint.added_body":
    "Naglalabas ang {mint} ng {units}. Nakaimbak sa device na ito ang mga susi nito, kaya masusuri na ngayon ang mga token mula rito kahit walang internet.",
  "wallet.mint.remove_plain":
    "Alisin ang {mint} sa wallet mo? Kasama ring mawawala ang mga naka-imbak nitong susi, kaya hindi na masusuri nang offline ang mga token mula rito.",
  "wallet.mint.title": "Mga Mint",
  "wallet.mint.none": "Wala pang mint",
  "wallet.mint.none_desc":
    "Naglalabas at tumutubos ng ecash mo ang isang mint. Magdagdag ng isa para magdeposito sa Lightning, o tumanggap na lang ng token at maidaragdag na ang mint nito para sa iyo.",
  "wallet.mint.add": "Magdagdag ng mint",
  "wallet.mint.add_body":
    "Hawak ng mint ang Bitcoin na sumusuporta sa ecash mo, kaya pumili ng isang pagkakatiwalaan mo sa balanseng itinatago mo roon. Sinusuri ang URL bago ito i-save. Magpatakbo ng sarili mo gamit ang Nutshell kung mas gusto mong huwag magtiwala kaninuman.",
  "wallet.mint.consolidate_body":
    "Isang mint lang kailanman ang matutukoy ng isang token, kaya hindi kayang magbayad ng halagang mas malaki kaysa sa hawak ng pinakamalaki nito ang balanseng nakakalat sa ilang mint. Kayang ilipat ito ng Airhop: babayaran ng bawat ibang mint ang isang invoice ng Lightning na inilabas ng napili mo. May maliit na bayarin sa pagruruta at kailangan ng internet.",
  "wallet.mint.add_short": "Magdagdag ng mint",
  "wallet.mint.checking": "Sinusuri…",
  "wallet.mint.remove_with_balance": "Alisin ang mint na may balanse?",
  "wallet.mint.remove": "Alisin ang mint",
  "wallet.mint.delete_anyway": "Burahin pa rin",
  "wallet.mint.consolidate": "Ilipat ang lahat ng balanse sa isang mint",
  "wallet.mint.confirm_with": "Kumpirmahin ang mga patunay sa {mint}",
  "wallet.mint.remove_a11y": "Alisin ang {mint}",
  "wallet.mint.available_amount": "{amount} {unit} ang available",
  "wallet.mint.split_across":
    "Nahahati ang balanse sa {count} mint. Ilipat ito sa isa.",
  "wallet.mint.move_everything_to": "Ilipat ang lahat sa {mint}",
  "wallet.mint.consolidate_title": "Ilipat sa isang mint",
  "wallet.mint.moving": "Inililipat…",
  "wallet.mint.move": "Ilipat",
  "wallet.mint.moved": "Nailipat",
  "wallet.mint.moved_body":
    "Nasa {mint} na ngayon ang {amount} {unit}, pagkatapos ng {fees} {unit} na bayarin sa pagruruta ng Lightning.",
  "wallet.mint.nothing_moved": "Walang nailipat",
  "wallet.mint.destination": "· patutunguhan",
  "wallet.mint.will_move": "· ililipat",
  "wallet.mint.issued_by": "Inilabas ng",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Pagdagdag sa wallet ng Airhop",
  "wallet.ln.invoice_failed": "Hindi nagawa ang invoice",
  "wallet.ln.price_failed": "Hindi napresyuhan ang invoice na ito",
  "wallet.ln.paid": "Bayad na",
  "wallet.ln.deposit_credited":
    "Nabayaran ang invoice at naglabas ang {mint} ng {amount} {unit}. Kumpirmado ang balanseng ito: puwede mo na itong gastusin agad nang offline.",
  "wallet.ln.withdrawn":
    "{paid} sat ang nabayaran sa Lightning. Naningil ang mint ng {fee} sat na bayarin sa pagruruta.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sat ang nabayaran sa Lightning. Naningil ang mint ng {fee} sat na bayarin sa pagruruta, at ibinalik ang {change} sat ng reserba sa balanse mo.",
  "wallet.ln.payment_failed": "Nabigo ang bayad",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Gawing ecash ang mga sat ng Lightning na kaya mong gastusin nang offline, o ipalit ang ecash pabalik sa kahit anong invoice ng Lightning. Kailangan ng pareho ang internet at isang mint.",
  "wallet.ln.deposit_body":
    "Bibigyan ka ng mint ng invoice. Bayaran ito mula sa kahit anong wallet ng Lightning at babalik ang mga sat bilang ecash na kaya mong gastusin nang offline.",
  "wallet.ln.pay_invoice_for":
    "Bayaran ang invoice na ito para sa {amount} {unit}. Binabantayan ng wallet ang bayad at kusa nitong ilalabas ang ecash mo.",
  "wallet.ln.expired_body":
    "Nag-expire ang invoice na ito. Kung nabayaran mo na ito, kusang naikakredito ang balanse.",
  "wallet.ln.waiting_expires":
    "Naghihintay ng bayad · mag-e-expire sa loob ng {countdown}",
  "wallet.ln.withdraw_body":
    "Idikit ang isang invoice na bolt11 at babayaran ito ng mint mula sa ecash mo. Sasabihin muna sa iyo ang reserba sa pagruruta; babalik sa balanse mo ang hindi nagamit ng pagruruta.",
  "wallet.ln.up_to": "hanggang {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Magbayad ng {amount} {unit}",
  "wallet.ln.deposit": "Magdeposito ng sat sa Lightning",
  "wallet.ln.deposit_short": "Magdeposito",
  "wallet.ln.withdraw": "Mag-withdraw sa isang invoice ng Lightning",
  "wallet.ln.withdraw_short": "Mag-withdraw",
  "wallet.ln.deposit_title": "Magdeposito sa Lightning",
  "wallet.ln.amount_placeholder": "Halaga sa sat",
  "wallet.ln.requesting": "Humihiling…",
  "wallet.ln.get_invoice": "Kumuha ng invoice",
  "wallet.ln.copy_invoice": "Kopyahin ang invoice",
  "wallet.ln.open_wallet": "Buksan sa isang wallet ng Lightning",
  "wallet.ln.open_wallet_short": "Buksan sa wallet",
  "wallet.ln.waiting": "Naghihintay ng bayad…",
  "wallet.ln.new_invoice": "Gumawa ng bagong invoice",
  "wallet.ln.new_invoice_short": "Bagong invoice",
  "wallet.ln.withdraw_title": "Mag-withdraw sa Lightning",
  "wallet.ln.scan_invoice": "Mag-scan ng QR code ng invoice ng Lightning",
  "wallet.ln.paid_from": "Binayaran mula sa",
  "wallet.ln.invoice": "Invoice",
  "wallet.ln.routing_reserve": "Reserba sa pagruruta",
  "wallet.ln.reserved": "Nakalaan mula sa balanse",
  "wallet.ln.paying": "Nagbabayad…",
  "wallet.ln.get_quote": "Kumuha ng quote",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Backup",
  "wallet.backup.setup_failed": "Hindi naitakda ang backup",
  "wallet.backup.on": "Naka-on ang backup",
  "wallet.backup.on_body":
    "Maibabalik na ngayon ang balanse mo mula sa labindalawang salitang iyon.\n\nNananatiling labas sa parirala ang anumang ibinigay sa iyo ng iba hangga't hindi ka nagre-refresh sa mint, at kailangan ng listahan mo ng mga mint para sa pagbawi, kaya panatilihin itong nakasulat sa tabi ng mga salita.",
  "wallet.backup.no_phrase": "Walang nakaimbak na parirala",
  "wallet.backup.no_phrase_body":
    "Hindi nabasa ang parirala sa pagbawi mula sa keychain ng device. I-unlock ang device at subukan ulit.",
  "wallet.backup.replace_title": "Palitan ang kasalukuyan mong parirala?",
  "wallet.backup.replace_body":
    "May parirala ka na sa pagbawi. Kapag nagbalik ka ng iba, mapapalitan ito. Mananatiling nagagastos sa device na ito ang mga baryang sakop na ng lumang parirala, pero titigil silang maibalik, kaya tiyaking nakasulat na ang lumang mga salita bago ka magpatuloy.",
  "wallet.backup.replace": "Palitan",
  "wallet.backup.invalid_phrase": "Hindi wasto ang pariralang iyon",
  "wallet.backup.invalid_phrase_body":
    "May nakapaloob na checksum ang parirala at hindi ito pumapasa. Maghanap ng maling pagkakatipa, nawawala o napagpalit na salita.",
  "wallet.backup.not_bip39":
    "Hindi ito mga salitang BIP-39: {words}. Suriin ang baybay.",
  "wallet.backup.add_mint_first": "Magdagdag muna ng mint",
  "wallet.backup.add_mint_first_body":
    "Gumagana ang pagbawi sa pamamagitan ng pagtatanong sa isang mint kung aling mga barya ang nilagdaan nito para sa iyo, kaya kailangan nitong malaman kung aling mint ang tatanungin. Idagdag ang mga mint na ginagamit mo, tapos magbalik.",
  "wallet.backup.restore_failed": "Nabigo ang pagbabalik",
  "wallet.backup.phrase": "Parirala sa pagbawi",
  "wallet.backup.state_unconfirmed":
    "Naka-on ang backup pero hindi pa nakumpirma",
  "wallet.backup.state_off": "Naka-off ang backup",
  "wallet.backup.badge_on": "Naka-on",
  "wallet.backup.badge_unconfirmed": "Hindi pa nakumpirma",
  "wallet.backup.badge_off": "Naka-off",
  "wallet.backup.view": "Tingnan ang parirala sa pagbawi",
  "wallet.backup.setup": "Magtakda ng parirala sa pagbawi",
  "wallet.backup.view_short": "Tingnan ang parirala",
  "wallet.backup.setup_short": "Itakda",
  "wallet.backup.restore":
    "Ibalik ang isang wallet mula sa parirala sa pagbawi",
  "wallet.backup.restore_short": "Ibalik",
  "wallet.backup.setup_title": "Magtakda ng parirala sa pagbawi",
  "wallet.backup.on_body_short":
    "Maibabalik ang balanse mo sa bagong device mula sa labindalawang salita mo.",
  "wallet.backup.unconfirmed_body":
    "Hindi mo pa kailanman kinumpirma ang nakasulat na kopya. Sa ngayon, nasa teleponong ito lang ang mga salita, at iyon mismo ang dapat malampasan ng isang backup. Tingnan ang parirala at isulat ito.",
  "wallet.backup.not_covered":
    "Hindi pa sakop ang {amount}. Dala ng mga baryang ibinigay sa iyo ang mga lihim ng nagpadala ng mga ito, kaya napapasok lang sila sa ilalim ng parirala mo kapag naipagpalit na. Mag-refresh ng isang mint para masiguro ang mga ito.",
  "wallet.backup.off_body":
    "Sa teleponong ito lang umiiral ang ecash mo. Kapag nawala mo ito, walang makakabawi ng pera, pati ikaw. Ang parirala sa pagbawi ay labindalawang salitang kayang muling buuin ang balanse mo kahit saan.",
  "wallet.backup.about_to_see":
    "Makakakita ka ng labindalawang salita. Sila ang pera.",
  "wallet.backup.exact_order":
    "Labindalawang salita, sa eksaktong pagkakasunod-sunod na ito. Ang may hawak ng mga ito ay may hawak ng balanse mo.",
  "wallet.backup.verify_body":
    "Mas masahol pa sa walang parirala ang isang pariralang walang sumulat, dahil mukha itong lambat pangkaligtasan na wala naman talaga. Dalawang salita para kumpirmahin.",
  "wallet.backup.verify_mismatch":
    "Hindi iyon tugma. Suriin ang nakasulat mong kopya.",
  "wallet.backup.restore_body":
    "Ilagay ang labindalawang salita. Muling kinukuha ng Airhop ang mga barya mo at tinatanong ang bawat mint kung alin sa mga ito ang nilagdaan nito, kaya bumabalik ang balanse mula sa talaang itinatago ng mint.",
  "wallet.backup.warn_secret":
    "Sinumang makabasa ng mga ito ay makakakuha ng balanse mo. Huwag mo itong i-screenshot at huwag itong itago sa teleponong ito.",
  "wallet.backup.warn_paper":
    "Isulat ang mga ito sa papel at itago sa ligtas na lugar. Hindi na ito maipapakita sa iyo ng Airhop kapag wala na ang telepono.",
  "wallet.backup.warn_scope":
    "Ang ecash mo lang ang muli nitong bubuuin. Hindi sakop ang pagkakakilanlan, mga chat at contact mo.",
  "wallet.backup.warn_mints":
    "Kailangang tanungin ng pagbawi ang isang mint kung aling mga barya ang nilagdaan nito, kaya isulat ang listahan mo ng mga mint sa tabi ng mga salita.",
  "wallet.backup.preparing": "Naghahanda…",
  "wallet.backup.show_phrase": "Ipakita ang parirala ko",
  "wallet.backup.your_phrase": "Ang parirala mo sa pagbawi",
  "wallet.backup.write_down": "Isulat ang mga ito",
  "wallet.backup.copy_phrase": "Kopyahin ang parirala sa pagbawi sa clipboard",
  "wallet.backup.copy_clipboard": "Kopyahin sa clipboard",
  "wallet.backup.written_down": "Naisulat ko na ang mga ito",
  "wallet.backup.check_copy": "Suriin ang kopya mo",
  "wallet.backup.confirm": "Kumpirmahin",
  "wallet.backup.restore_title": "Magbalik mula sa isang parirala",
  "wallet.backup.phrase_placeholder":
    "labindalawang salita, pinaghihiwalay ng espasyo",
  "wallet.backup.no_mints_yet":
    "Wala pang naidagdag na mint. Kailangang tanungin ng pagbawi ang isang tiyak na mint, kaya idagdag muna ang mga ginagamit mo.",
  "wallet.backup.scanning": "Sinasala…",
  "wallet.backup.restore_progress": "{mint} · keyset {step} sa {total}",
  "wallet.backup.will_scan":
    "Sasalain: {mints}. Hindi kailanman tinatanong ang mintong hindi mo naidagdag, kaya nananatiling hindi nakikita ang balanse roon.",
  "wallet.backup.word_n": "Salitang {position}",
  "wallet.backup.unreachable_mints":
    "Hindi naabot: {mints}. Nariyan pa rin ang anumang balanse roon. Subukan ulit kapag mas maganda ang koneksyon mo.",
  "wallet.backup.nothing_recovered":
    "Walang nabawi mula sa mga mint na sinala.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Markahang natanggap?",
  "wallet.delivered.body":
    "Tuluyan nitong pinapakawalan ang {amount} {unit}. Kung hindi naman talaga ito dumating, hindi mo na ito mababawi.",
  "wallet.delivered.body_generic":
    "Tuluyan nitong pinapakawalan ang nakalaang halaga. Kung hindi naman talaga ito dumating, hindi mo na ito mababawi.",
  "wallet.delivered.cancel": "Hindi pa",
  "wallet.delivered.confirm": "Natanggap nila",
  "wallet.reclaim.title": "Bawiin ang token na ito?",
  "wallet.reclaim.body":
    "Babalik sa balanse mo ang {amount} {unit}. Gawin lang ito kung walang taong naabot ang token: kung nasa kanila na ang string, ang unang tutubos nito sa mint ang makakahawak ng pera, at maaaring sila iyon.",
  "wallet.reclaim.keep": "Iwang nakabinbin",
  "wallet.reclaim.confirm": "Bawiin",
  "wallet.copied.token_body":
    "Nasa clipboard mo ang token. Nananatili itong nakalaan dito hangga't hindi mo ito minamarkahang naihatid, kaya puwede mo itong idikit ulit kung mabigo ang unang subok.",
  "wallet.copied.phrase_body":
    "Idikit ito sa isang password manager, tapos linisin ang clipboard mo. Nababasa ng ibang app ang clipboard, at sa ilang setup ay nagsi-sync ito sa iba mong device.",
  "wallet.refresh.failed": "Nabigo ang pag-refresh",
  "wallet.refresh.partly": "Bahagyang na-refresh",
  "wallet.refresh.done": "Na-refresh",
  "wallet.refresh.unreachable":
    "Hindi naabot ang {mints}. Napapanahon na ang lahat ng iba pa.",
  "wallet.refresh.swapped":
    "Nakumpirma ang {amount} {unit} at naipagpalit sa mga sariwang patunay.",
  "wallet.refresh.secured":
    "Sakop na ngayon ng parirala mo sa pagbawi ang {amount} {unit}.",
  "wallet.refresh.all_confirmed": "Nakumpirma na sa mint ang lahat ng narito.",
  "wallet.pending.title": "Nakabinbin",
  "wallet.pending.reserved_desc":
    "Nabuo at nakalaan, hindi pa nakukumpirma ang paghahatid. Hawak ang mga patunay sa labas ng balanse mo para hindi ito magastos nang dalawang beses.",
  "wallet.pending.locked_desc":
    "Nakakandado na sa susi ng tatanggap, kaya sila lang ang makakagastos nito. Hindi pa lang ito nakakarating sa kanila. Ibahagi ang token para tapusin ito.",
  "wallet.pending.show_qr": "Ipakita ang token na ito bilang QR code",
  "wallet.pending.copy_again": "Kopyahin ulit ang token",
  "wallet.pending.share_again": "Ibahagi ulit ang token",
  "wallet.pending.mark_delivered": "Markahang naihatid ang token na ito",
  "wallet.pending.delivered": "Naihatid",
  "wallet.pending.reclaim_into":
    "Bawiin ang token na ito pabalik sa balanse mo",
  "wallet.activity.title": "Aktibidad",
  "wallet.activity.none": "Wala pa",
  "wallet.activity.none_desc":
    "Lumilitaw dito ang mga bayad na ipinapadala at natatanggap mo, pinakabago muna, kasama ang mint at bayarin ng bawat isa.",
  "wallet.activity.show_fewer": "Magpakita ng mas kaunting bayad",
  "wallet.activity.show_less": "Magpakita ng mas kaunti",
  "wallet.activity.received_unconfirmed": "Natanggap, hindi pa nakumpirma",
  "wallet.activity.received": "Natanggap",
  "wallet.activity.receive_failed": "Nabigo ang pagtanggap",
  "wallet.activity.reclaimed": "Nabawi",
  "wallet.activity.send_failed": "Nabigo ang pagpapadala",
  "wallet.activity.sent": "Naipadala",
  "wallet.activity.status_pending": "nakabinbin",
  "wallet.activity.status_failed": "nabigo",
  "wallet.activity.status_reclaimed": "nabawi",
  "wallet.activity.status_expired": "nag-expire",
  "wallet.activity.ln_deposit": "Deposito sa Lightning",
  "wallet.activity.ln_withdrawal": "Withdrawal sa Lightning",
  "wallet.activity.nutzap_received": "Natanggap na nutzap",
  "wallet.activity.spent_removed": "Inalis ang mga nagastos na patunay",
  "wallet.activity.refreshed": "Na-refresh ang mga patunay",
  "wallet.activity.refreshing": "Nire-refresh ang mga patunay",
  "wallet.activity.just_now": "kanina lang",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Offline ang mesh",
  "wallet.mesh_offline_body":
    "Hindi tumatakbo ang serbisyo ng mesh, kaya walang mapagbibigyan ng token. Mananatili itong nakalaan sa ilalim ng Nakabinbin.",
  "wallet.xfer.route_mesh":
    "Direktang ibinigay sa device nila sa pamamagitan ng mesh.",
  "wallet.xfer.route_nostr":
    "Wala sila sa saklaw ng Bluetooth, kaya dumaan ito sa internet.",
  "wallet.xfer.route_courier":
    "Walang ruta papunta sa kanila ngayon. Dadalhin ito ng ibang device at ihahatid kapag may nakarating sa kanila.",
  "wallet.xfer.route_queued":
    "Hindi pa sila naaabot. Nakapila ito at aalis kapag naabot na sila.",
  "wallet.xfer.mesh_offline_body":
    "Hindi tumatakbo ang serbisyo ng mesh, kaya walang paraan para ipasa ang token. Walang naibawas.",
  "wallet.xfer.could_not_send": "Hindi naipadala",
  "wallet.xfer.inexact_body":
    "Hindi kayang gawing eksaktong {amount} {unit} ng mga patunay mo nang offline. Ang pinakamaliit na token na kaya mong buuin ay {spend} {unit}, at mapupunta sa kanila ang dagdag na {extra} {unit} nang walang paraan para mabawi ito.\n\nKapag nag-refresh sa mint habang online, nahahati ang mga patunay mo sa mga denominasyong eksaktong bagay dito.",
  "wallet.xfer.send_amount": "Magpadala ng {amount}",
  "wallet.xfer.mesh_offline": "Offline ang mesh",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Nakakandado sa susi nila at nailathala sa Nostr. Sa kanila na ito, online man sila o hindi.",
  "wallet.pay.rail_nutzap_dm":
    "Nakakandado sa susi nila. Ayaw itong tanggapin ng relay, kaya napunta ito sa kanila bilang mensahe.",
  "wallet.pay.rail_nutzap_undelivered":
    "Nakakandado sa susi nila, pero wala pang nakakapagdala nito. Nakapila ito, at nasa ilalim ng Nakabinbin ang token.",
  "wallet.pay.final":
    "Hindi mababawi ang mga nakakandadong bayad: susi lang nila ang makakagastos ng mga baryang ito ngayon.",
  "wallet.pay.reclaimable":
    "Mananatili itong mababawi mula sa tab na Wallet hangga't hindi mo kinukumpirmang dumating ito.",
  "wallet.pay.why": "Ipinadala sa ganitong paraan dahil {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} kay {name}",
  "wallet.pay.thread_receipt":
    "Nagpadala ka ng {amount} {unit}, nakakandado sa susi nila.",
  "wallet.pay.title": "Magpadala ng ecash",
  "wallet.pay.to": "Kay {name}",
  "wallet.pay.amount": "Halaga sa sat",
  "wallet.pay.memo": "Tala (opsyonal, pampubliko)",
  "wallet.pay.send": "Ipadala",
  "wallet.pay.sending": "Ipinapadala…",
  "wallet.pay.action": "Magpadala ng ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Pag-access sa camera",
  "wallet.scan.camera_purpose": "mag-scan ng QR code ng ecash",
  "wallet.scan.photo_label": "Pag-access sa larawan",
  "wallet.scan.photo_purpose": "magbasa ng QR ng ecash mula sa isang imahe",
  "wallet.scan.no_token": "Walang natagpuang token ng ecash sa imaheng iyon.",
  "wallet.scan.no_invoice":
    "Walang natagpuang invoice ng Lightning sa imaheng iyon.",
  "wallet.scan.unreadable": "Hindi nabasa ang imaheng iyon.",
  "wallet.scan.camera_failed":
    "Hindi nasimulan ang camera. Isara ang ibang app ng camera at subukan ulit.",
  "wallet.scan.close": "Isara ang scanner",
  "wallet.scan.on_device":
    "Binabasa ito sa device na ito; walang ipinapadala kahit saan.",
  "wallet.scan.aim_token": "Itutok sa isang QR code ng ecash.",
  "wallet.scan.aim_invoice": "Itutok sa isang QR code ng invoice ng Lightning.",
  "wallet.scan.title_token": "Mag-scan ng ecash",
  "wallet.scan.title_invoice": "Mag-scan ng invoice",
  "wallet.scan.desc_token":
    "Magbasa ng token ng Cashu mula sa ibang wallet. Gumagana sa kahit anong wallet ng Cashu, hindi lang sa Airhop.",
  "wallet.scan.desc_invoice":
    "Magbasa ng invoice ng Lightning para bayaran ito mula sa balanse mo.",
  "wallet.scan.use_camera_a11y": "Mag-scan gamit ang camera",
  "wallet.scan.use_camera": "Gamitin ang camera",
  "wallet.scan.pick_image_a11y":
    "Magbasa ng QR code mula sa naka-save na imahe",
  "wallet.scan.pick_image": "Pumili mula sa mga larawan",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Ano ang Cashu?",
  "wallet.explain.intro":
    "Ang Cashu ay ecash para sa Bitcoin. Ang isang token ay isang string na may halagang pera para sa sinumang may hawak nito, bulag na nilagdaan ng isang mint kaya hindi masasabi ng mint kung sino ang gumastos ng ano. Walang account, walang login.",
  "wallet.explain.send": "Ipadala",
  "wallet.explain.send_desc":
    "Ginagawang token ang isang halaga na kaya mong ibigay sa peer sa malapit sa Bluetooth, o ibahagi bilang teksto. Gumagana nang walang internet. Nananatiling nakalaan ang mga patunay hangga't hindi mo kinukumpirmang dumating ito.",
  "wallet.explain.receive": "Tumanggap",
  "wallet.explain.receive_desc":
    "Idikit ang isang token para maidagdag ito. Kapag online, agad itong ipinagpapalit sa mint, na nagpapatunay na sa iyo ito. Kapag offline, iniimbak ito at minamarkahang hindi pa nakumpirma hangga't hindi ka nagre-refresh.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Nagbabayad sa isang identidad sa Nostr. Kung naglalathala sila ng impormasyong nutzap ng NIP-61, nakakandado ang ecash sa susi nila kaya sila lang ang makakagastos nito. Kung hindi, babalik ito sa naka-encrypt na direktang mensahe. Kailangan ng internet.",
  "wallet.explain.add_mint": "Magdagdag ng mint",
  "wallet.explain.add_mint_desc":
    "Sine-save ang mintong naglalabas at tumutubos ng ecash mo, at itinatago ang mga pampublikong susi nito para masuri nang offline ang mga token mula rito. Pumili ng mintong pagkakatiwalaan mo sa balanseng itinatago mo roon.",
  "wallet.explain.phrase": "Parirala sa pagbawi",
  "wallet.explain.phrase_desc":
    "Nagmumula ang mga barya mo sa labindalawang salitang ginagawa ng wallet sa simula, kaya kayang muling buuin ng bagong telepono ang balanse sa pamamagitan ng pagtatanong sa mga mint mo kung aling mga barya ang nilagdaan nila. Hangga't hindi mo tinitingnan at isinusulat ang mga ito, sa teleponong ito lang sila umiiral.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Naka-lock ang wallet",
  "wallet.err.mint_unreachable": "Hindi maabot ang mint",
  "wallet.err.tor_blocked": "Naka-block habang naka-on ang Tor",
  "wallet.err.insufficient": "Kulang ang balanse",
  "wallet.err.exact_amount": "Hindi kayang ipadala ang eksaktong halagang iyon",
  "wallet.err.no_mint": "Walang mint",
  "wallet.err.mint_unsupported": "Hindi kaya iyon ng mint",
  "wallet.err.mint_refused": "Tumanggi ang mint",
  "wallet.err.unreadable": "Hindi mabasang token",
  "wallet.err.rejected": "Tinanggihan ang token",
  "wallet.err.already_spent": "Nagastos na",
  "wallet.err.change_pending": "Bayad na, nakabinbin ang sukli",
  "wallet.svc.mint_unreachable": "Hindi naabot ang mint.",
  "wallet.svc.tor_ios": "Hindi dumadaan sa Tor ang mga hiling sa mint sa iOS.",
  "wallet.svc.tor_ios_body":
    "Mga WebSocket lang ng Nostr ang binabalot ng Arti, kaya mararating ng hiling na ito ang mint sa bukas na net at maiuugnay ang IP mo sa mga patunay na ito. Payagan ito sa ilalim ng Mga Setting > Seguridad, o i-off muna ang Tor. Gumagana pa rin ang pagpapadala at pagtanggap ng ecash sa mesh.",
  "wallet.svc.keys_uncached":
    "Hindi nakaimbak sa device na ito ang mga susi ng mint na ito.",
  "wallet.svc.keys_uncached_body":
    "Buksan ang wallet nang isang beses habang online para makuha ang mga ito.",
  "wallet.svc.phrase_invalid": "Hindi wasto ang pariralang iyon sa pagbawi.",
  "wallet.svc.phrase_invalid_body":
    "Maghanap ng maling pagkakatipa o nawawalang salita. May nakapaloob na checksum ang parirala, kaya isang maling salita lang ay nagpapawalang-bisa sa buong bagay.",
  "wallet.svc.need_mint": "Magdagdag muna ng kahit isang mint.",
  "wallet.svc.need_mint_body":
    "Gumagana ang pagbawi sa pamamagitan ng pagtatanong sa isang mint kung aling mga barya ang nilagdaan nito para sa iyo, kaya kailangan nitong malaman kung aling mint ang tatanungin.",
  "wallet.svc.restored": "Naibalik mula sa parirala sa pagbawi",
  "wallet.svc.storage_locked": "Naka-lock ang imbakan ng wallet.",
  "wallet.svc.storage_locked_body":
    "Itinatago ng Airhop ang mga patunay ng ecash sa naka-encrypt na file at nasa keychain ng device ang susi nito. I-unlock ang device at buksang muli ang app.",
  "wallet.svc.bad_url": "Hindi iyon wastong URL.",
  "wallet.svc.needs_https":
    "Kailangang magsimula sa https:// ang URL ng isang mint.",
  "wallet.svc.refuse_http": "Tumatangging gumamit ng mint sa payak na http.",
  "wallet.svc.refuse_http_body":
    "Kayang basahin o baguhin ng sinumang nasa daanan ng network ang mga patunay mo. Gumamit ng mint na may https://.",
  "wallet.svc.mint_not_saved": "Hindi na-save ang mint.",
  "wallet.svc.unreadable_token": "Hindi iyon nababasang token ng Cashu.",
  "wallet.svc.unreadable_token_body":
    "Nagsisimula ang mga token sa cashuA o cashuB. Tiyaking walang naputol nang kopyahin ito.",
  "wallet.svc.wrong_mint":
    "Hindi nilagdaan ng mintong tinutukoy nito ang token na ito.",
  "wallet.svc.already_spent": "Nagastos na ang mga patunay na ito.",
  "wallet.svc.already_spent_body":
    "Ang nagpadala ng token na ito ang unang tumubos nito, o ipinadala rin ang parehong token sa iba.",
  "wallet.svc.receiving_offline": "tumatanggap nang offline",
  "wallet.svc.amount_positive": "Maglagay ng halagang mas malaki sa zero.",
  "wallet.svc.coins_raced":
    "Kagagamit lang ng ibang bayad sa mga baryang iyon.",
  "wallet.svc.coins_raced_body":
    "Walang naibawas. Subukan ulit at pipili ang wallet ng ibang set.",
  "wallet.svc.no_ecash": "Wala pang ecash.",
  "wallet.svc.no_ecash_body":
    "Magdagdag ng mint at magdeposito sa Lightning, o tumanggap ng token mula sa isang tao.",
  "wallet.svc.split_across_mints":
    "Nahahati sa iba't ibang mint ang balanse mo.",
  "wallet.svc.mint_says_spent":
    "Iniulat ng mint na nagastos na ang mga patunay na ito.",
  "wallet.svc.issue_against_invoice":
    "maglabas ng ecash laban sa isang invoice ng Lightning",
  "wallet.svc.pay_invoice": "magbayad ng isang invoice ng Lightning",
  "wallet.svc.unknown_deposit": "Hindi kilalang deposito.",
  "wallet.svc.invoice_expired_before":
    "Nag-expire ang invoice bago ito nabayaran.",
  "wallet.svc.invoice_expired": "Nag-expire ang invoice na iyon.",
  "wallet.svc.invoice_unpaid": "Hindi pa nababayaran ang invoice.",
  "wallet.svc.payment_unknown":
    "Hindi alam ang status ng bayad; susuriin ulit sa susunod na pag-refresh.",
  "wallet.svc.melt_change_pending": "Nabayaran ang invoice mo.",
  "wallet.svc.melt_change_pending_body":
    "Hindi pa ibinabalik ng mint ang hindi nagamit na bayarin sa pagruruta. Kusa itong nakukuha sa susunod na pag-refresh, at walang nawawala samantala.",
  "wallet.svc.mint_did_not_pay":
    "Hindi binayaran ng mint ang invoice na ito. Hindi nagbago ang balanse mo.",
  "wallet.svc.not_an_invoice": "Hindi iyon invoice ng Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Idikit ang isang invoice na bolt11 na nagsisimula sa lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Kulang ang balanse para sa invoice na ito.",
  "wallet.svc.coins_raced_invoice_body":
    "Walang naibawas at hindi nabayaran ang invoice. Subukan ulit.",
  "wallet.svc.same_mint": "Pumili ng ibang patutunguhang mint.",
  "wallet.svc.same_mint_body":
    "Iisang mint ang pinagmulan at ang patutunguhan, kaya walang mailipat.",
  "wallet.svc.quote_failed_retried":
    "Nabigo ang quote, sinubukan ulit ang pagsasama",
  "wallet.svc.amount_unfit_retried":
    "Hindi bagay ang halaga, sinubukan ulit ang pagsasama",
  "wallet.svc.cannot_size": "Hindi natukoy ang laki ng paglilipat na ito.",
  "wallet.svc.insufficient_at_mint": "Kulang ang balanse sa {mint}.",
  "wallet.svc.inexact_title":
    "Hindi kayang gawing eksaktong {amount} {unit} ng mga patunay mo nang offline.",
  "wallet.svc.inexact_detail":
    "Ang pinakamaliit na token na kaya mong ipadala ay {spend} {unit}. Walang sukli kapag offline, kaya mapupunta sa tatanggap ang dagdag na {extra} {unit}.",
  "wallet.svc.no_single_mint":
    "Walang iisang mint na may hawak na {amount} {unit}. Hindi maisasama sa isang token ang ecash mula sa iba't ibang mint: pagsamahin muna ang mga ito sa isang mint, o ipadala sa magkakahiwalay na halaga.",
  "wallet.svc.have_tried_send":
    "May {total} {unit} ka, at sinubukan mong magpadala ng {amount}.",
  "wallet.svc.invoice_needs":
    "Kailangan ng invoice na ito ng {total} {unit} kasama ang reserba sa pagruruta, at may {balance} ka.",
  "wallet.svc.nothing_to_move": "Walang {unit} ang {mint} na mailipat.",
  "wallet.svc.consolidate_memo": "Pagsasama mula sa {mint}",
  "wallet.svc.cannot_size_detail":
    "Pagkatapos ng mga bayarin sa pagruruta ng Lightning, hindi makakapaglipat ang {from} ng kapaki-pakinabang na halaga sa {to}. Subukan na lang maglipat ng tiyak na mas maliit na halaga.",
  "wallet.svc.mint_cannot": "Hindi kayang {action} ng {mint}.",
  "wallet.svc.no_nut": "Hindi ipinapahayag ng mint ang NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Tumutukoy ang bayad na iyon sa mintong hindi mo ginagamit.",
  "wallet.svc.unknown_mint_body":
    "Idagdag mo mismo ang mint kung pinagkakatiwalaan mo ito; walang tinutubos mula sa mintong hindi mo pinili.",
  "wallet.svc.no_relay": "walang koneksyon sa relay",
  "wallet.svc.no_shared_mint":
    "walang magkasamang mint na may sapat na balanse",
  "wallet.svc.no_nutzap_info":
    "hindi naglathala ang tatanggap ng impormasyong nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Nakakandado sa susi nila pero hindi pa naihahatid. Ibahagi ang token mula sa transaksyong ito para makumpleto ito.",
  "wallet.svc.swap_lost":
    "Hindi kailanman natapos ng mint ang palitang ito, kaya walang inilabas laban dito.",
  "wallet.svc.swap_unreadable":
    "Na-save ang palitang ito sa anyong hindi kayang ulitin ng bersyong ito.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Na-verify sa pamamagitan ng QR",
  "contacts.qr.keys_unverified": "Natanggap ang mga susi, hindi pa na-verify",
  "contacts.qr.not_verified": "Hindi pa na-verify",
  "contacts.qr.message": "Mensahe",
  "contacts.qr.add": "Magdagdag ng contact",
  "contacts.qr.scan_title": "I-scan ang QR code",
  "contacts.qr.aim": "Itutok ang camera mo sa QR code nila",
  "contacts.qr.add_desc": "Abutin ang isang taong wala sa malapit sa mesh.",
  "contacts.qr.peer_id_hint":
    "Ang peer ID ay 16 na karakter. Nagsisimula sa airhop: ang contact code.",
  "contacts.qr.or_scan": "o i-scan ang QR nila",
  "contacts.qr.trust_note":
    "Ang QR lang na ini-scan mo gamit ang camera ang nagve-verify sa susi nila. May dalang mga susi nila ang idinikit na code pero walang patunay na galing ito sa kanila.",
  "contacts.qr.peer_id": "Peer ID o contact code",
  "contacts.qr.peer_id_placeholder": "Idikit ang isang ID o contact code",
  "contacts.qr.scan_camera_a11y": "I-scan ang QR code gamit ang camera",
  "contacts.qr.scan_camera_desc": "Gamitin ang camera mo",
  "contacts.qr.upload_a11y": "Mag-upload ng larawan ng QR mula sa gallery",
  "contacts.qr.upload": "Mag-upload mula sa gallery",
  "contacts.qr.upload_desc": "Pumili ng naka-save na larawan ng QR",
  "contacts.qr.scan_a11y":
    "Magdagdag ng contact sa pamamagitan ng pag-scan ng QR code",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Idikit ang 16-karakter na peer ID, isang link na airhop://peer/…, o isang contact code.",
  "contacts.scan.camera_label": "Pag-access sa camera",
  "contacts.scan.camera_purpose": "i-scan ang QR code ng isang contact",
  "contacts.scan.camera_needed":
    "Kailangan ng access sa camera para mag-scan. Puwede ka pa ring magdagdag sa pamamagitan ng peer ID.",
  "contacts.scan.camera_failed":
    "Hindi nasimulan ang camera. Isara ang ibang app ng camera at subukan ulit.",
  "contacts.scan.photo_label": "Pag-access sa larawan",
  "contacts.scan.photo_purpose": "i-scan ang QR code na na-save mo",
  "contacts.scan.photo_needed":
    "Kailangan ng access sa larawan para pumili ng imahe. Puwede ka pa ring magdagdag sa pamamagitan ng peer ID.",
  "contacts.scan.no_qr": "Walang natagpuang QR code ng Airhop sa imaheng iyon.",
  "contacts.scan.unreadable": "Hindi nabasa ang QR code mula sa imaheng iyon.",
  "contacts.scan.bitchat_expired":
    "Nag-expire na ang code na iyon ng bitchat. Hilingin sa kanilang buksang muli ang QR nila.",
  "contacts.scan.tampered":
    "Hindi wasto ang QR code na ito: hindi tugma ang peer ID nito sa mga susi nito. Maaaring binago ito.",
  "contacts.scan.already_added": "Nasa mga contact mo na",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Naghihintay ng access sa camera…",
  "contacts.verify.camera_off": "Naka-off ang camera",
  "contacts.verify.open_settings": "Buksan ang Mga Setting",
  "contacts.verify.verified": "Na-verify",
  "contacts.verify.different": "Ibang contact",
  "contacts.verify.scan_again": "Mag-scan ulit",
  "contacts.verify.failed": "Hindi na-verify",
  "contacts.verify.done": "Tapos na",
  "contacts.verify.title": "I-verify si {name}",
  "contacts.verify.aim": "Itutok ang camera mo sa QR code nila",
  "contacts.verify.camera_off_body":
    "I-on ang access sa camera sa Mga Setting para mag-verify sa pamamagitan ng QR.",
  "contacts.verify.match_body":
    "Tugma ang susi ni {name}. Puwede mong pagkatiwalaan ang contact na ito.",
  "contacts.verify.different_body":
    "Sa iba pang tao ang QR na ito. Hilingin kay {name} na ipakita ang sariling code niya.",
  "contacts.verify.tampered_body":
    "Mukhang binago ang QR na ito: hindi tugma ang ID nito sa susi nito.",
  "contacts.verify.choose_title": "Paano mo gustong suriin?",
  "contacts.verify.choose_body":
    "Kumpirmado ng dalawa na talagang kay {name} ang mga susi sa teleponong ito.",
  "contacts.verify.method_scan": "I-scan ang code nila",
  "contacts.verify.method_scan_sub": "Kasama mo sila rito",
  "contacts.verify.method_compare": "Maghambing ng code",
  "contacts.verify.method_compare_sub": "Basahin ito sa isa't isa sa tawag",
  "contacts.verify.no_keys":
    "Wala pang susi para sa contact na ito. Mag-mensahe sa kanila, o i-scan ang code nila kapag nagkita kayo.",
  "contacts.verify.compare_title": "Basahin ninyo ito sa isa't isa",
  "contacts.verify.compare_body":
    "Pareho ang anim na salitang nakikita ni {name}. Kung tugma ang mga ito, alam ninyong dalawa na tunay ang mga susi.",
  "contacts.verify.codes_match": "Tugma ang mga ito",
  "contacts.verify.codes_differ": "Hindi tugma ang mga ito",
  "contacts.verify.compared_body":
    "Kinumpirma ninyo ni {name} ang parehong code. Na-verify ang contact na ito.",

  // ---- Settings: shared chrome ----
  "settings.back": "Bumalik",
  "settings.coming_soon": "Malapit nang dumating",
  "settings.opens_externally": "{label}, bumubukas sa labas ng app",
  "settings.peer_id": "Peer ID",
  "settings.share_peer_id": "Ibahagi ang iyong Peer ID",
  "settings.share_id_short": "Ibahagi ang ID",
  "settings.peer_id_sheet.title": "Ang peer ID mo",
  "settings.peer_id_sheet.copy": "Kopyahin ang peer ID",
  "settings.peer_id_sheet.note":
    "Gumagana lang ito kapag pareho kayong nasa saklaw ng Bluetooth. Para makapag-mensahe sa iyo ang isang tao mula saanman, ibahagi na lang ang QR code mo.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Pangkalahatan",
  "settings.section.general_desc":
    "Mga opsyonal na feature, i-undo ang pagpapadala, media, i-reset",
  "settings.section.privacy": "Privacy at seguridad",
  "settings.section.privacy_desc":
    "Forward secrecy, nilagdaang packet, mga naka-block na peer",
  "settings.section.network": "Network at mga relay",
  "settings.section.network_desc":
    "Fallback sa internet, mga relay ng nostr, pagkatugma sa bitchat",
  "settings.section.permissions": "Mga Pahintulot",
  "settings.section.permissions_desc":
    "Bluetooth, lokasyon, mga abiso, camera, mikropono",
  "settings.section.storage": "Imbakan at datos",
  "settings.section.diagnostics": "Diagnostics",

  // ---- Settings: group headings ----
  "settings.group.transports": "Mga Transport",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "Sa malapit",
  "settings.group.sync": "Sync",
  "settings.group.features": "Mga Feature",
  "settings.group.messages": "Mga Mensahe",
  "settings.group.local": "Lokal",
  "settings.group.media": "Media",
  "settings.group.reset": "I-reset",
  "settings.group.always_on": "Laging naka-on",
  "settings.group.notifications": "Mga Abiso",
  "settings.group.blocked": "Naka-block",
  "settings.group.theme": "Tema",
  "settings.group.font": "Font",
  "settings.group.language": "Wika",
  "settings.section.diagnostics_desc":
    "Status ng koneksyon at mga device sa malapit",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Mga link ng Bluetooth",
  "settings.diag.ble_links_desc":
    "Mga device na direktang nakakonekta sa teleponong ito",
  "settings.diag.lan": "Lokal na network",
  "settings.diag.lan_desc": "Mga telepono sa iisang Wi-Fi network",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Telepono sa telepono nang walang router",
  "settings.diag.wifi_active": "Gumagana",
  "settings.diag.wifi_unsupported": "Hindi suportado sa device na ito",
  "settings.diag.wifi_permission": "Hinarangan ng isang pahintulot",
  "settings.diag.wifi_unavailable": "Hindi available sa ngayon",
  "settings.diag.wifi_unpaired": "Walang nakapares",
  "settings.diag.wifi_unknown": "Naghihintay sa radyo",
  "settings.diag.relays": "Mga relay ng Nostr",
  "settings.diag.relays_desc":
    "Ginagamit para sa mga channel ng lokasyon at abot sa internet",
  "settings.diag.connected": "Nakakonekta",
  "settings.diag.disconnected": "Hindi nakakonekta",
  "settings.diag.peer_direct": "Direktang link",
  "settings.diag.peer_relayed": "Narinig sa pamamagitan ng ibang device",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Walang pagbasa ng signal",
  "settings.diag.no_peers": "Walang tao sa saklaw",
  "settings.diag.no_peers_desc": "{links} bukas na link ng radyo",
  "settings.diag.gcs_size": "Laki ng filter",
  "settings.diag.gcs_size_desc":
    "Pinakamalaking sync filter na ipinadala sa ere",
  "settings.diag.fpr": "Antas ng false positive",
  "settings.diag.fpr_desc":
    "Gaano kadalas iginigiit ng filter na may packet tayong wala naman",
  "settings.diag.bytes": "{n} byte",
  "settings.diag.footnote":
    "Walang mababago rito. Nakatakda ang mga halagang ito para manatiling tugma ang Airhop sa bitchat.",
  "settings.section.storage_desc": "Paggamit at cache",
  "settings.section.appearance": "Anyo",
  "settings.section.appearance_desc": "Tema, font at wika",
  "settings.section.help": "Tulong at feedback",
  "settings.section.help_desc":
    "Kontakin kami, mag-ulat ng bug, o basahin ang FAQ",
  "settings.section.support": "Suporta",
  "settings.section.support_desc": "Tumulong para tuloy-tuloy ang pagbuo",
  "settings.section.about": "Tungkol dito",
  "settings.section.about_desc": "Bersyon, talaan ng pagbabago, at source code",

  // ---- Settings: general ----
  "settings.general.undo": "I-undo ang pagpapadala",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Wallet",
  "settings.general.undo_seconds": "{count} segundo",
  "settings.general.undo_a11y": "I-undo ang pagpapadala: {value}",
  "settings.general.quality_a11y": "Itakda ang kalidad ng upload sa {value}",
  "settings.general.undo_desc":
    "Sandaling pinipigil ang naipadalang mensahe para mabawi mo ito bago ito lumabas",
  "settings.general.undo_off_desc": "Ipadala agad, walang pag-undo",
  "settings.general.undo_2": "2 segundo",
  "settings.general.undo_2_desc": "Mabilisang pagkakataong bawiin ito",
  "settings.general.undo_10": "10 segundo",
  "settings.general.undo_10_desc": "Ang pinakamahabang panahon",
  "settings.general.quality": "Kalidad ng upload",
  "settings.general.quality_desc":
    "Para sa mga larawang ipinapadala mula sa camera o gallery mo. Isinusukat pa rin sa mesh ang bawat larawan.",
  "settings.general.quality_low": "Mababa",
  "settings.general.quality_low_desc":
    "Pinakamaliit na larawan, pinakamabilis ipadala",
  "settings.general.quality_medium": "Katamtaman",
  "settings.general.quality_medium_desc": "Balanse ng detalye at bilis",
  "settings.general.quality_high": "Mataas",
  "settings.general.quality_high_desc":
    "Pinapanatili ang pinakamaraming detalye",
  "settings.general.feature_wallet_desc":
    "Magpadala ng Cashu ecash nang peer to peer sa mesh",
  "settings.general.feature_wallet_a11y": "Wallet (laging naka-on)",
  "settings.general.feature_ai_desc":
    "Pribadong katulong sa device, walang tawag sa network",
  "settings.general.feature_feeds": "Mga Feed",
  "settings.general.feature_feeds_desc":
    "Magbasa at mag-post sa mga feed ng Bluesky at Mastodon",
  "settings.general.show_media": "Awtomatikong ipakita ang media",
  "settings.general.show_media_desc":
    "Lumilitaw sa chat ang mga larawan at video, o naghihintay sa likod ng isang tap",
  "settings.general.reset": "I-reset ang mga setting",
  "settings.general.media_retention": "Itago ang media nang",
  "settings.general.media_retention_desc":
    "Binubura ang mga larawan, video at voice note pagkalipas ng napiling panahon",
  "settings.general.media_retention_sheet":
    "Piliin kung gaano katagal mananatili ang media sa device na ito. Hindi na mababawi ang naburang media.",
  "settings.general.retention_7_desc":
    "Pinakakaunti ang naiiwan. Pinakamainam kung ang telepono mismo ang panganib.",
  "settings.general.retention_14_desc":
    "Gitnang landas para sa isa o dalawang linggong walang signal.",
  "settings.general.retention_30_desc":
    "Pinakamatagal na nananatiling mababasa ang mga usapan, at pinakamalaki ang kinakain sa disk.",
  "settings.general.reset_desc":
    "Ibinabalik ang bawat kagustuhan sa default nito, nang hindi ginagalaw ang iyong pagkakakilanlan, mensahe, contact at wallet",
  "settings.general.reset_title": "I-reset ang mga setting?",
  "settings.general.reset_body":
    "Babalik sa default ang bawat kagustuhan: anyo, pag-undo ng pagpapadala, at koneksyon (internet, Tor, gateway, bridge, mga relay). Hindi magagalaw ang iyong pagkakakilanlan, mensahe, contact at wallet.",
  "settings.general.reset_confirm": "I-reset",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Laging naka-on ang Double Ratchet para sa mga direktang mensahe",
  "settings.security.signed_packets": "Nilagdaang packet",
  "settings.security.signed_packets_desc":
    "Nilagdaan ng Ed25519 ang bawat packet",
  "settings.security.hide_previews": "Itago ang preview sa abiso",
  "settings.security.hide_previews_desc":
    "Inilalayo ang nagpadala at ang mensahe sa lock screen mo, na nagpapakita ng mga ito nang hindi ina-unlock",
  "settings.security.no_blocked": "Walang naka-block na peer",
  "settings.security.no_blocked_desc":
    "Hindi ka mame-mensahe ng mga naka-block na peer at hindi sila lilitaw sa tab na Mesh",
  "settings.security.unblock_title": "I-unblock ang peer na ito",
  "settings.security.unblock": "I-unblock",
  "settings.security.unblock_peer": "I-unblock si {name}",
  "settings.security.unblock_body":
    "Makakapag-mensahe ulit sa iyo si {name} at muling lilitaw sa tab na Mesh kapag nasa malapit.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Fallback sa internet",
  "settings.network.internet_desc":
    "Magpatuloy sa mga relay ng Nostr kapag wala sa saklaw ang mga peer sa mesh",
  "settings.network.internet_off_title": "I-off ang internet?",
  "settings.network.internet_off_body":
    "Sa Bluetooth lang tatakbo ang Airhop. Titigil itong kontakin ang anumang relay ng Nostr, at mao-off ang Tor, ang internet gateway at ang mesh bridge. Patuloy na gagana ang chat sa Bluetooth sa malapit.",
  "settings.network.turn_off": "I-off",
  "settings.network.discovery": "Pagtuklas ng geo-relay",
  "settings.network.discovery_desc":
    "Awtomatikong pumili ng pinakamalapit na relay para sa isang cell ng lokasyon mula sa 300+ na nakakalat na relay",
  "settings.network.discovery_needs_relay": "Magdagdag muna ng sariling relay",
  "settings.network.discovery_needs_relay_body":
    "Ang awtomatikong pagtuklas ang nagtuturo sa Airhop sa pinakamalapit na relay. May saysay lang na i-off ito kapag naka-pin mo na ang sarili mong mga relay sa ibaba, kaya magdagdag muna ng kahit isa.",
  "settings.network.custom_only_title": "Gamitin lang ang sarili mong relay?",
  "settings.network.custom_only_body":
    "Titigil ang mga channel ng lokasyon at ang mesh bridge sa awtomatikong pagpili ng pinakamalapit na relay at gagamitin lang ang idinagdag mo. Maaari nitong bawasan ang abot, at maaaring tumigil kang makasalamuha ang mga gumagamit ng bitchat, na nagtitipon sa pinakamalapit na relay.",
  "settings.network.custom": "Sariling mga relay",
  "settings.network.custom_desc":
    "Magdagdag ng sarili mong relay para sa mga channel ng lokasyon at sa mesh bridge",
  "settings.network.custom_added": "{count} sa {max} ang naidagdag",
  "settings.network.dm_relays": "Mga relay ng mensahe",
  "settings.network.dm_relays_desc":
    "Lagi itong ginagamit ng mga direktang mensahe at pribadong channel. Hindi ito binabago ng sarili mong mga relay.",
  "settings.network.discovery_back_on":
    "Muling naka-on ang pagtuklas ng geo-relay",
  "settings.network.discovery_back_on_body":
    "Iyon ang huli mong sariling relay. Kailangan ng mga channel ng lokasyon ng mapaglalathalaan, kaya muling awtomatikong pumipili ang Airhop ng pinakamalapit na relay.",
  "settings.network.add_relay": "Magdagdag ng relay",
  "settings.network.remove_relay": "Alisin ang {url}",
  "settings.network.add_short": "Idagdag",
  "settings.network.relay_limit":
    "Puwede kang magdagdag ng {count} relay. Mag-alis ng isa para makapagdagdag ng iba.",
  "settings.network.relay_duplicate": "Nasa listahan mo na ang relay na iyon.",
  "settings.network.relay_invalid":
    "Maglagay ng wastong host ng relay, hal. relay.example.com. Kailangan lang ng port kung hindi ginagamit ng relay ang default. Hindi pinapayagan ang mga IP address at lokal na pangalan.",
  "settings.network.lan": "Lokal na network",
  "settings.network.lan_desc":
    "Abutin ang mga tao sa iisang WiFi, kasama ang pagitan ng iPhone at Android. Makikita ng ibang device sa network na gumagamit ka ng Airhop.",
  "settings.network.lan_searching": "Walang Airhop device sa network na ito",
  "settings.network.lan_active": "Nakakonekta sa network na ito",
  "settings.network.lan_unavailable": "Wala sa isang WiFi network",
  "settings.network.lan_permission":
    "Naka-off ang lokal na network access para sa Airhop",
  "settings.network.lan_unsupported": "Hindi available sa device na ito",
  "settings.network.lan_foreground":
    "Humihinto kapag nasa background ang Airhop. Tuloy ang Bluetooth.",
  "settings.network.wifi_pair": "Pagpapares",
  "settings.network.wifi_paired": "Mga nakapares na device",
  "settings.network.wifi_pair_find": "Maghanap ng device",
  "settings.network.wifi_pair_find_desc":
    "Maghanap ng malapit na iPhone na nagpapakita ng sarili. Kailangan ng dalawang telepono ng iOS 26 o mas bago.",
  "settings.network.wifi_pair_show": "Ipakita ang iPhone na ito",
  "settings.network.wifi_pair_show_desc":
    "Hayaang mahanap ito ng malapit na iPhone. Ang isa sa inyo ay maghahanap, ang isa ay magpapakita, nang sabay.",
  "settings.network.wifi_pair_find_action": "Pumili ng malapit na iPhone",
  "settings.network.wifi_pair_show_action":
    "Gawing matutuklasan ang iPhone na ito",
  "settings.network.wifi_pair_unavailable":
    "Hindi available ang Wi-Fi Aware sa ngayon",
  "settings.network.wifi_pair_forget": "Mag-alis ng pares sa Settings app",
  "settings.network.bitchat": "Pagkatugma sa bitchat",
  "settings.network.bitchat_desc":
    "Kaparehong BLE mesh ng bitchat, ganap na magkatugma. Laging naka-on ito, at hindi ito maaaring i-off.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Tumakbo sa background",
  "settings.conn.background_desc":
    "Panatilihing tumatakbo ang mesh kapag sarado ang Airhop",
  "settings.conn.background_on_title": "Panatilihing tumatakbo ang mesh?",
  "settings.conn.background_on_body":
    "Patuloy na nagpapasa at tumatanggap ang Airhop kapag sarado ito, kaya dumarating ang mga mensahe habang wala ka. Nagpapakita ang Android ng patuloy na abiso habang ginagawa ito.",
  "settings.conn.background_off_title":
    "Itigil ang mesh kapag nagsara ang Airhop?",
  "settings.conn.background_off_body":
    "Darating lang ang mga mensahe habang bukas ang Airhop, at titigil ang teleponong ito sa pagpapasa para sa mga taong malapit. Mawawala ang patuloy na abiso.",
  "settings.conn.live_voice": "Live na boses",
  "settings.conn.live_voice_desc":
    "Makipag-usap sa mga taong malapit na parang walkie-talkie",
  "settings.conn.live_voice_on_title": "I-on ang live na boses?",
  "settings.conn.live_voice_on_body":
    "Kapag pinindot nang matagal ang mikropono, ipinapadala ang boses mo sa lahat ng nasa saklaw ng Bluetooth habang nagsasalita ka, at tumutugtog sa telepono mo ang boses nila. Walang naire-record.",
  "settings.conn.live_voice_off_title": "I-off ang live na boses?",
  "settings.conn.live_voice_off_body":
    "Kapag pinindot nang matagal ang mikropono, voice note ang nire-record. Naipapadala ito kapag binitawan mo, at walang makakarinig nito hangga't hindi nila ito pinapatugtog.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Pagruruta sa Tor",
  "settings.conn.tor_desc":
    "Iruta ang trapiko ng Nostr sa Tor para sa dagdag na privacy",
  "settings.conn.tor_on_title": "Iruta ang trapiko ng Nostr sa Tor?",
  "settings.conn.tor_on_body":
    "Titigil ang mga relay sa pagkakita ng IP address mo. Mas matagal ang pagkonekta at mas mabagal dumating ang mga mensahe. Hindi apektado ang Bluetooth.",
  "settings.conn.tor_off_title": "I-off ang pagruruta sa Tor?",
  "settings.conn.tor_off_body":
    "Babalik ang trapiko ng Nostr sa karaniwan mong koneksyon, kaya makikita ulit ng mga relay ang IP address mo. Hindi apektado ang Bluetooth sa dalawang paraan.",
  "settings.conn.tor_unavailable": "Walang pagruruta sa Tor sa build na ito.",
  "settings.conn.tor_timeout":
    "Mahigit isang minuto nang kumokonekta ang Tor. Mananatili itong naka-on at patuloy na susubok; sasabihin ng tab na Mesh kung kailan ito nagruruta, o kung hinaharangan ito ng network na ito.",
  "settings.conn.tor_failed":
    "Hindi nasimulan ang Tor. Tiyaking may access sa network ang app.",
  "settings.tor.connection": "Koneksyon",
  "settings.tor.mode_off": "Direkta",
  "settings.tor.mode_off_desc":
    "Direktang kumokonekta sa Tor. Pinakamabilis, pero makikita ng sinumang nagmamasid sa network na gumagamit ka ng Tor.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Itinatago na gumagamit ka ng Tor, at gumagana kahit naka-block ang mga bridge. Pinakamabagal kumonekta.",
  "settings.tor.mode_obfs4": "Bridge",
  "settings.tor.mode_obfs4_desc":
    "Itinatago na gumagamit ka ng Tor. Mas mabilis kaysa Snowflake, pero pampubliko ang mga bridge na ito at hinaharangan ng ilang network.",
  "settings.tor.mode_custom": "Sariling bridge",
  "settings.tor.mode_custom_desc":
    "Gumamit ng bridge mula sa bridges.torproject.org. Subukan ito kapag hindi gumana ang iba.",
  "settings.tor.custom_placeholder": "I-paste ang isang bridge line kada linya",
  "settings.tor.custom_empty": "Magdagdag muna ng kahit isang bridge line.",
  "settings.conn.mint_clearnet": "Payagan ang trapiko ng mint sa bukas na net",
  "settings.conn.mint_clearnet_desc":
    "Nostr lang ang sakop ng Tor sa iOS. Iwang naka-off para harangan ang mga hiling sa mint; gumagana pa rin ang ecash sa mesh.",
  "settings.conn.gateway": "Internet gateway",
  "settings.conn.gateway_desc":
    "Ipahiram ang koneksyon mo sa isang offline na teleponong malapit para maabot pa rin nito ang mga channel ng lokasyon",
  "settings.conn.gateway_on_title": "I-on ang internet gateway?",
  "settings.conn.gateway_on_body":
    "Magpapadala at tatanggap ng mensahe sa channel ng lokasyon ang mga teleponong malapit na walang sariling koneksyon sa pamamagitan ng iyo. Gumagamit ito ng mobile data at baterya mo, at nananatiling naka-encrypt nang dulo-sa-dulo ang mga mensahe nila, kaya hindi mo mababasa ang dumadaan.",
  "settings.conn.gateway_off_title": "I-off ang internet gateway?",
  "settings.conn.gateway_off_body":
    "Titigil ang mga offline na teleponong malapit sa pag-abot sa mga channel ng lokasyon sa pamamagitan ng iyo. Hindi apektado ang sarili mong mga mensahe.",
  "settings.conn.bridge": "Mesh bridge",
  "settings.conn.bridge_desc":
    "Iugnay ang pampublikong chat na #bluetooth ng lugar na ito sa ibang pangkat na wala sa saklaw ng Bluetooth sa pamamagitan ng internet",
  "settings.conn.bridge_on_title": "I-on ang mesh bridge?",
  "settings.conn.bridge_on_body":
    "Ilalathala ang pampubliko mong mga mensaheng #bluetooth sa barangay mo sa pamamagitan ng internet, kaya mababasa ito ng mga taong lampas sa saklaw ng Bluetooth. Hindi kailanman itinutulay ang mga pribadong mensahe, at pinananatiling lokal ng “malapit lang” ang isang partikular na mensahe.",
  "settings.conn.bridge_off_title": "I-off ang mesh bridge?",
  "settings.conn.bridge_off_body":
    "Mananatiling muli sa saklaw ng Bluetooth ang pampubliko mong mga mensaheng #bluetooth, at titigil sa pagdating dito ang mga mensahe mula sa pangkat sa kabila.",
  "settings.conn.bridge_needs_location": "Kailangan ng lokasyon ng mesh bridge",
  "settings.conn.bridge_needs_location_desc":
    "Hinahanap nito ang barangay mo mula sa isang pagtukoy ng lokasyon. Magbigay ng lokasyon para magsimulang magtulay.",
  "settings.conn.grant_location": "Magbigay ng pahintulot sa lokasyon",
  "settings.conn.grant_short": "Ibigay",
  "settings.conn.internet_off": "Naka-off ang internet",
  "settings.conn.internet_off_desc":
    "Gumagamit ng internet ang Tor, ang bridge at ang gateway. I-on ang Fallback sa internet sa ilalim ng Network para magamit ang mga ito.",
  "settings.conn.turn_on": "I-on",
  "settings.conn.turn_off": "I-off",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Naghahanap ng mga device sa malapit at nagpapasa ng mensahe sa pagitan nila. Kung wala ito, hindi gagana ang mesh.",
  "settings.permissions.location": "Lokasyon",
  "settings.permissions.location_desc":
    "Binubuksan ang mga channel ng lugar sa malapit. Kung wala ito, mananatiling sarado ang mga channel na iyon at tuloy lang gaya ng dati ang mesh sa Bluetooth.",
  "settings.permissions.notifications": "Mga Abiso",
  "settings.permissions.notifications_desc":
    "Tumanggap ng alerto para sa bagong mensahe kahit sarado ang app. Kung wala ito, makikita mo lang ang mga ito kapag binuksan mo ang Airhop.",
  "settings.permissions.camera": "Camera",
  "settings.permissions.camera_desc":
    "Nag-i-scan ng QR code at kumukuha ng larawan o video na ipapadala. Kung wala ito, puwede ka pa ring magbahagi ng media mula sa gallery mo.",
  "settings.permissions.photos": "Mga Larawan",
  "settings.permissions.photos_desc":
    "Nagpapadala ng larawan mula sa gallery mo at nagse-save ng natanggap na media. Kung wala ito, puwede ka pa ring kumuha at magpadala ng bagong larawan gamit ang camera.",
  "settings.permissions.microphone": "Mikropono",
  "settings.permissions.microphone_desc":
    "Nagre-record at nagpapadala ng mensaheng boses o gumagamit ng live na boses. Kung wala ito, hindi gagana ang mensaheng boses at ang live na boses.",
  "settings.permissions.allow": "Ibigay ang pahintulot na ito",
  "settings.permissions.open_settings":
    "Buksan ang mga setting ng sistema para baguhin ang pahintulot na ito",
  "settings.permissions.system": "Sistema",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Paggamit ng network",
  "settings.storage.storage_usage": "Paggamit ng imbakan",
  "settings.storage.storage_usage_desc":
    "Mga mensahe, patunay sa wallet, at naka-cache na attachment",
  "settings.storage.session_usage":
    "Session na ito · {sent} ang naipadala, {received} ang natanggap",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} na attachment",
  "settings.storage.clear_cache": "Linisin ang cache ng attachment",
  "settings.storage.clear": "Linisin",
  "settings.storage.clear_title": "Linisin ang naka-cache na media?",
  "settings.storage.clear_body":
    "Aalisin sa device na ito ang mga larawan, video, voice note at file, pati ang naipadala at ang natanggap. Hindi na ito maida-download muli: sasabihin iyon ng mga bula nila, at puwede mong hilingin sa nagpadala na ipadala itong muli. Hindi magagalaw ang mga mensahe at ang wallet.",
  "settings.storage.cleared": "Nalinis ang cache",
  "settings.storage.freed": "Nagbakante ng {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Itakda ang anyo sa {value}",
  "settings.font.set_a11y": "Itakda ang monospace na font sa {value}",
  "settings.font.system": "Sistema",
  "settings.font.system_desc":
    "Ginagamit ang default na monospace na font ng device mo",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Makabago at madaling basahin",
  "settings.language.en": "Ingles",
  "settings.language.am": "Amharic",
  "settings.language.ar": "Arabe",
  "settings.language.bn": "Bengali",
  "settings.language.my": "Burmese",
  "settings.language.zh_hans": "Tsino (Pinasimple)",
  "settings.language.zh_hant": "Tsino (Tradisyonal)",
  "settings.language.nl": "Olandes",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "Pranses",
  "settings.language.ka": "Georgiano",
  "settings.language.de": "Aleman",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indones",
  "settings.language.it": "Italyano",
  "settings.language.ja": "Hapon",
  "settings.language.ko": "Koreano",
  "settings.language.mg": "Malagasy",
  "settings.language.ms": "Malay",
  "settings.language.ne": "Nepali",
  "settings.language.fa": "Persian",
  "settings.language.pl": "Polako",
  "settings.language.pt_br": "Portuges (Brazil)",
  "settings.language.pt_pt": "Portuges (Portugal)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Ruso",
  "settings.language.es": "Espanyol",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Suweko",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thai",
  "settings.language.tr": "Turko",
  "settings.language.uk": "Ukranyano",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamese",
  "settings.language.pseudo": "Pseudolocale",
  "settings.language.soon": "Malapit nang dumating",
  "settings.language.soon_a11y": "{value}, malapit nang dumating",
  "settings.language.set_a11y": "Itakda ang wika sa {value}",
  "settings.language.pending": "Sa susunod na pagbukas",
  "settings.language.pending_a11y":
    "{value}, iiral sa susunod mong pagbukas ng Airhop",
  "settings.language.rtl_restart": "Buksang muli ngayon",
  "settings.language.rtl_title": "Buksang muli ang Airhop para matapos ito",
  "settings.language.rtl_body":
    "Mula kanan pakaliwa binabasa ang {value}, at kapag nagsisimula lang ito nakakapagpalit ng direksyon ang Airhop. Isara ito at buksang muli para matapos ang paglipat. Walang mawawala, at mananatiling konektado ang mesh mo hangga't hindi mo ito ginagawa.",
  "settings.theme.light": "Maliwanag",
  "settings.theme.light_desc": "Laging gamitin ang maliwanag na palette",
  "settings.theme.dark": "Madilim",
  "settings.theme.dark_desc": "Laging gamitin ang madilim na palette",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Matutuklasan, nag-a-advertise at nag-i-scan",
  "settings.status.away": "Wala rito",
  "settings.status.away_desc":
    "Naka-pause ang mesh, hindi nag-i-scan o nag-a-advertise",
  "settings.status.invisible": "Hindi nakikita",
  "settings.status.invisible_desc": "Nag-i-scan, pero nakatago sa pagtuklas",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Itakda ang status sa {value}",
  "settings.status.edit": "Baguhin ang status",
  "settings.status.desc": "Piliin kung gaano ka kakikita sa mesh.",
  "settings.transfer.identity": "Pagkakakilanlan at mga susi",
  "settings.transfer.identity_desc": "Ang peer ID, username at mga contact mo",
  "settings.transfer.chats": "Mga chat at kasaysayan",
  "settings.transfer.chats_desc":
    "Mga usapan, grupo, at channel na sinalihan mo",
  "settings.transfer.wallet": "Balanse ng wallet",
  "settings.transfer.wallet_desc":
    "Mga patunay ng Cashu at kasaysayan ng transaksyon",
  "settings.transfer.title": "Ilipat sa bagong telepono",
  "settings.transfer.desc":
    "Ilipat ang pagkakakilanlan, mga chat at wallet mo sa ibang device",
  "settings.transfer.coming_soon_a11y":
    "Ilipat sa bagong telepono, malapit nang dumating",
  "settings.transfer.body":
    "Pagtabihin ang dalawang telepono at ilipat ang lahat sa Bluetooth. Walang dumadaan sa server, kaya gumagana ito nang walang internet.",
  "settings.qr.permission_label": "Pag-access sa larawan",
  "settings.qr.permission_purpose": "i-save ang QR code mo",
  "settings.qr.saved": "Na-save",
  "settings.qr.saved_body": "Na-save ang QR code sa photo library mo.",
  "settings.qr.save_failed": "Hindi na-save",
  "settings.qr.save_failed_body": "Hindi na-save ang QR code. Subukan ulit.",
  "settings.qr.share_message": "Idagdag mo ako sa Airhop",
  "settings.qr.share_body":
    "Idagdag mo ako sa Airhop — pribadong pag-mensahe sa mesh, offline muna.",
  "settings.qr.show_short": "Ipakita ang QR",
  "settings.qr.title": "Ang QR code mo",
  "settings.qr.note":
    "Naglalaman ito ng mga pampubliko mong susi, na nagpapahintulot sa iba na mag-mensahe sa iyo mula saanman. Ibahagi ito sa mga taong pinagkakatiwalaan mo lang. Hindi ito magbabago maliban kung buburahin mo ang pagkakakilanlan mo.",
  "settings.qr.code_label": "Contact code",
  "settings.qr.copy_code": "Kopyahin ang contact code",
  "settings.qr.share": "Ibahagi ang QR code",
  "settings.qr.share_short": "Ibahagi ang QR",
  "settings.qr.download": "I-download ang QR code",
  "settings.qr.download_short": "I-download ang QR",
  "settings.qr.show": "Ipakita ang QR code",
  "settings.wipe.trigger": "Pukawin ang panic wipe",
  "settings.wipe.trigger_desc":
    "Mag-tap nang tatlong beses para agad maglinis nang walang kumpirmasyon",
  "settings.wipe.title": "Panic wipe",
  "settings.wipe.now": "Maglinis na",
  "settings.wipe.desc":
    "Agad na winawasak ang lahat ng susi, mensahe at patunay",
  "settings.wipe.body":
    "Agad nitong wawasakin ang lahat ng susi, mensahe at patunay sa wallet mo. Hindi ito maibabalik.",
  "settings.wipe.in_progress": "Naglilinis",
  "settings.wipe.in_progress_body":
    "Winawasak ang mga susi, mensahe at file mo. Ilang segundo lang ito at natatapos nang mag-isa kahit isara ang app.",
  "settings.wipe.got_it": "Naiintindihan ko",
  "settings.wipe.keys_failed": "Hindi nawasak ang mga susi",
  "settings.wipe.keys_failed_body":
    "Wala na ang mga mensahe, contact at wallet mo, pero tumanggi ang device na bitawan ang mga susi mo. I-unlock ang device at maglinis ulit.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Kontakin kami",
  "settings.help.contact_a11y": "Mag-email sa {address}",
  "settings.help.bug": "Mag-ulat ng bug",
  "settings.help.bug_desc": "Magbukas ng issue sa GitHub",
  "settings.help.bug_a11y": "Mag-ulat ng bug sa GitHub",
  "settings.help.faq": "Mga madalas itanong",
  "settings.help.faq_desc": "Mga sagot sa karaniwang tanong",
  "settings.help.faq_a11y": "Buksan ang FAQ",
  "settings.help.terms_desc": "Paano maaaring gamitin ang Airhop",
  "settings.help.terms_a11y": "Buksan ang Mga Tuntunin ng Serbisyo",
  "settings.help.privacy_desc": "Ang hindi namin kinokolekta",
  "settings.help.privacy_a11y": "Buksan ang Patakaran sa Privacy",

  // ---- Settings: support ----
  "settings.support.card": "Card o UPI",
  "settings.support.card_desc": "Netbanking at mga wallet, sa buong mundo",
  "settings.support.card_a11y":
    "Sumuporta sa pamamagitan ng card, UPI, netbanking, o wallet",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Buwanan o minsanan, walang bayad sa platform",
  "settings.support.sponsors_a11y":
    "Sumuporta sa pamamagitan ng GitHub Sponsors",
  "settings.support.note":
    "Ginagawa ko ang Airhop sa libreng oras ko. Walang mamumuhunan at walang ad. Kung kapaki-pakinabang ito sa iyo, malaki ang naitutulong ng isang ambag para tuloy-tuloy ang pagbuo. Mananatiling libre ang bawat feature anuman ang mangyari.",

  // ---- Settings: about and version ----
  "settings.about.version": "Bersyon",
  "settings.about.version_desc": "Kasalukuyang release",
  "settings.about.version_a11y": "Tingnan ang bersyon at maghanap ng update",
  "settings.about.release_notes": "Mga tala ng release",
  "settings.about.release_notes_desc": "Ano ang bago sa pinakahuling release",
  "settings.about.release_notes_a11y":
    "Buksan ang pinakahuling mga tala ng release sa GitHub",
  "settings.about.source": "Source code",
  "settings.about.source_a11y": "Buksan ang source code sa GitHub",
  "settings.about.licenses": "Mga lisensya ng open source",
  "settings.about.open_repo": "Buksan ang repositoryo ng {name}",
  "settings.about.licenses_desc": "Mga open source na pakete ng ibang partido",
  "settings.about.licenses_a11y": "Tingnan ang mga lisensya ng ibang partido",
  "settings.version.codename": "Pangalang kodigo",
  "settings.version.checking": "Sinusuri",
  "settings.version.check": "Maghanap ng update",
  "settings.version.checking_title": "Naghahanap ng update",
  "settings.version.up_to_date": "Nasa pinakabagong bersyon ka.",
  "settings.version.release_notes": "Tingnan ang mga tala ng release",
  "settings.version.made_with": "Ginawa gamit ang",
  "settings.version.number": "Bersyon {version}",
  "settings.version.update_to": "Mag-update sa {version}",
  "settings.version.update_to_a11y": "Mag-update sa bersyon {version}",
  "settings.version.released_under": "Inilabas sa ilalim ng {license}",
  "settings.version.notes_a11y":
    "Tingnan ang mga tala ng release para sa bersyon {version}",
  "settings.version.tor_paused":
    "Naka-pause ang paghahanap ng update habang naka-on ang Tor, para hindi nito mabunyag ang IP mo. Tingnan ang pahina ng mga release sa isang browser.",
  "settings.version.check_failed":
    "Hindi nakapaghanap ng update. Suriin ang koneksyon mo at subukan ulit.",
  "settings.version.downloading": "Nagda-download {percent}%",
  "settings.version.install": "I-install",
  "settings.version.download_failed":
    "Nabigo ang pag-download. Suriin ang iyong koneksyon at subukan ulit.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{size} KiB ang {kind}, lampas sa limitasyong {cap} KiB.",
  "transfer.failed.malformed":
    "May attachment na dumating nang sira at hindi nabuksan. Hilingin sa kanilang ipadala itong muli.",
  "transfer.failed.unsupported_type":
    "May attachment na dumating sa format na hindi mabuksan ng app na ito.",
  "transfer.failed.type_mismatch":
    "May attachment na tinanggihan: hindi tugma ang laman nito sa uri ng file na inaangkin nito.",
  "transfer.failed.storage":
    "May attachment na dumating pero hindi na-save. Suriin ang libreng espasyo mo.",
  "transfer.badge.waiting": "Naghihintay · {name}",
  "transfer.badge.active_count": "{count} transfer",
  "transfer.badge.sending": "Ipinapadala ang {name}",
  "transfer.badge.receiving": "Tinatanggap ang {name}",
  "transfer.badge.a11y": "{label}, {percent} porsyento. Buksan ang usapan.",
  "transfer.kind.photo": "Larawan",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Voice note",
  "transfer.this.photo": "Ang larawang ito",
  "transfer.this.video": "Ang video na ito",
  "transfer.this.voice": "Ang voice note na ito",
  "transfer.this.file": "Ang file na ito",
  "transfer.kind.document": "Dokumento",
  "transfer.kind.voice_preview": "Voice note",
  "transfer.kind.photo_preview": "Larawan",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Dokumento",

  // ---- System notifications ----
  "notif.channel.messages": "Mga Mensahe",
  "notif.channel.nearby": "Mga peer sa malapit",
  "notif.channel.nearby_desc":
    "Paminsan-minsang paalala kapag may natagpuang tao ang mesh sa saklaw ng Bluetooth.",
  "notif.nearby.body":
    "Nasa saklaw ng Bluetooth ngayon. I-tap para buksan ang mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "May isang tao",
  "notif.notice_urgent": "Mahalagang paskil · {content}",
  "notif.notice": "Paskil · {content}",
  "notif.incoming_file": "Papasok na file",
  "notif.preview.photo": "📷 Larawan",
  "notif.preview.voice": "🎤 Mensaheng boses",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Dokumento",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Bagong mensahe",
  "notif.hidden.channel": "Bagong aktibidad",
  "notif.hidden.mention": "Binanggit ka",
  "notif.mention.title": "Binanggit ka ni {sender}",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Ipakita ang {count} pa",
    other: "Ipakita ang {count} pa",
  },
  "chat.channels.show_more_a11y": {
    one: "Ipakita ang {count} pang default na channel",
    other: "Ipakita ang {count} na pang default na channel",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} hindi pa nababasa",
    other: "{label}, {count} na hindi pa nababasa",
  },
  "a11y.new_count": {
    one: "{label}, {count} bago",
    other: "{label}, {count} na bago",
  },
  "chat.a11y.unread": {
    one: "{count} hindi pa nababasa",
    other: "{count} na hindi pa nababasa",
  },
  "chat.thread.length_left": {
    one: "{count} ang natitira",
    other: "{count} na ang natitira",
  },
  "settings.general.retention_days": {
    one: "{count} araw",
    other: "{count} na araw",
  },
  "chat.info.group_reach": {
    one: "{reachable} sa {count} miyembro ang maaabot",
    other: "{reachable} sa {count} na miyembro ang maaabot",
  },
  "chat.group_members": {
    one: "Pribadong grupo  ·  {count} miyembro",
    other: "Pribadong grupo  ·  {count} na miyembro",
  },
  "chat.select.count": {
    one: "{count} ang napili",
    other: "{count} na ang napili",
  },
  "chat.select.forward": {
    one: "I-forward ang {count} mensahe",
    other: "I-forward ang {count} na mensahe",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} ang nagsasalita",
    other: "{count} na ang nagsasalita",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} peer ang nasa saklaw",
    other: "{count} na peer ang nasa saklaw",
  },
  "mesh.peer.hops_away": {
    one: "{count} hop ang layo",
    other: "{count} na hop ang layo",
  },
  "chat.presence.active": {
    one: "{count} ang aktibo",
    other: "{count} na ang aktibo",
  },
  "chat.presence.nearby": {
    one: "{count} ang malapit",
    other: "{count} na ang malapit",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mint",
    other: "{count} na mint",
  },
  "wallet.mint.remove_body": {
    one: "May hawak ang {mint} na {balance} {unit} sa {count} patunay. Kapag inalis ito, permanenteng mabubura ang patunay na iyon sa device na ito at walang backup. I-withdraw o ipadala muna ang balanse.",
    other:
      "May hawak ang {mint} na {balance} {unit} sa {count} na patunay. Kapag inalis ito, permanenteng mabubura ang mga patunay na iyon sa device na ito at walang backup. I-withdraw o ipadala muna ang balanse.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} deposito ang naghihintay ng bayad. Sinusuri muli sa tuwing bubuksan ang app.",
    other:
      "{count} na deposito ang naghihintay ng bayad. Sinusuri muli sa tuwing bubuksan ang app.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Nabawi ang {count} hindi pa nagagastos na patunay mula sa {mints}.",
    other:
      "Nabawi ang {count} na hindi pa nagagastos na patunay mula sa {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "May natagpuang {count} barya pero nagastos na ito, kaya walang na-kredito para rito. Normal iyon: nananatili sa talaan ng mint ang bawat baryang nagastos mo kailanman.",
    other:
      "May natagpuang {count} na barya pero nagastos na ang mga ito, kaya walang na-kredito para sa mga ito. Normal iyon: nananatili sa talaan ng mint ang bawat baryang nagastos mo kailanman.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Ipakita ang {count} pa",
    other: "Ipakita ang {count} pa",
  },
  "wallet.activity.show_more_a11y": {
    one: "Ipakita ang {count} pang bayad",
    other: "Ipakita ang {count} na pang bayad",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} hindi pa nakumpirma",
    other: "{count} na hindi pa nakumpirma",
  },
  "wallet.proof_count": {
    one: "{count} patunay",
    other: "{count} na patunay",
  },
  "wallet.spent_removed_detail": {
    one: "Nagastos na ang {count} patunay at inalis na ito.",
    other: "Nagastos na ang {count} na patunay at inalis na ang mga ito.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "May malapit na tao",
    other: "{count} na tao ang malapit",
  },
};

export const fil = { strings, plurals };
