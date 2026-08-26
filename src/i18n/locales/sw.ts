// sw: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Ghairi",
  "common.done": "Imekamilika",
  "common.ok": "Sawa",
  "common.close": "Funga",
  "common.back": "Rudi",
  "common.delete": "Futa",
  "common.remove": "Ondoa",
  "common.add": "Ongeza",
  "common.copy": "Nakili",
  "common.copied": "Imenakiliwa",
  "common.share": "Shiriki",
  "common.continue": "Endelea",
  "common.try_again": "Jaribu tena",
  "common.settings": "Mipangilio",
  "common.off": "Imezimwa",

  // ---- Dates ----
  "format.today": "Leo",
  "format.yesterday": "Jana",
  "format.minutes_ago": "dakika {count} zilizopita",
  "format.hours_ago": "saa {count} zilizopita",
  "format.days_ago": "siku {count} zilizopita",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Gumzo",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Pochi",
  "nav.tab.profile": "Wewe",
  "a11y.tab.new_peers": "{label}, kuna mtu mpya karibu",
  "nav.notifications": "Arifa",
  "chat.subtab.channels": "Vituo",
  "chat.subtab.direct": "Moja kwa moja",
  "chat.subtab.dms": "Jumbe za moja kwa moja",
  "chat.search.placeholder": "Tafuta kwenye gumzo…",
  "chat.search.a11y": "Tafuta kwenye gumzo na jumbe",
  "chat.search.close": "Funga utafutaji",
  "chat.search.clear": "Futa utafutaji",
  "mesh.view.radar": "Mwonekano wa rada",
  "mesh.view.list": "Mwonekano wa orodha",
  "mesh.view.radar_short": "Rada",
  "mesh.view.list_short": "Orodha",

  // ---- Legal document names ----
  "legal.last_updated": "Ilisasishwa mwisho: {date}",
  "legal.terms": "Masharti ya Huduma",
  "legal.privacy": "Sera ya Faragha",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Mawasiliano ya mesh yenye faragha",
  "onboarding.welcome.cta": "Anza",
  "onboarding.welcome.cta_hint":
    "Kubali masharti yaliyo hapa chini ili kuendelea",
  "onboarding.welcome.consent_a11y":
    "Kubali Masharti ya Huduma na Sera ya Faragha",
  "onboarding.welcome.open_terms": "Fungua Masharti ya Huduma",
  "onboarding.welcome.open_privacy": "Fungua Sera ya Faragha",
  "onboarding.welcome.consent":
    "Kwa kugusa {cta}, unakubali {terms} na {privacy} zetu.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Inatengeneza utambulisho wako",
  "onboarding.identity.body":
    "Inatengeneza jozi ya funguo za Ed25519 kwenye kifaa hiki.\nHakuna kinachotumwa popote.",
  "onboarding.identity.failed_heading": "Funguo zako hazikuweza kutengenezwa",
  "onboarding.identity.failed_body":
    "Kifaa hiki hakikuruhusu Airhop kuzihifadhi kwa usalama. Jaribu tena, au washa upya simu yako kisha fungua Airhop tena.",
  "onboarding.identity.steps_a11y": "Hatua: {steps}",
  "onboarding.identity.step.x25519":
    "Inatengeneza jozi tuli ya funguo za X25519",
  "onboarding.identity.step.ed25519":
    "Inatengeneza jozi ya funguo za kutia saini za Ed25519",
  "onboarding.identity.step.keychain":
    "Inahifadhi funguo kwenye kihifadhi funguo cha mfumo",
  "onboarding.identity.step.peer_id": "Inatoa kitambulisho cha peer",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Jina lako kwenye mesh",
  "onboarding.username.peer_id": "Kitambulisho cha peer",
  "onboarding.username.card_a11y":
    "Jina lako kwenye mesh ni {username}. Kitambulisho cha peer {peerID}. {props}.",
  "onboarding.username.explanation":
    "Jina hili la mtumiaji linatokana moja kwa moja na ufunguo wako wa umma. Ni lilelile kwenye kila kifaa kinachoona kitambulisho chako cha peer.",
  "onboarding.username.cta": "Ingia Airhop",
  "onboarding.username.prop.algorithm": "Algoriti",
  "onboarding.username.prop.storage": "Hifadhi",
  "onboarding.username.prop.storage_value": "Kihifadhi funguo cha mfumo pekee",
  "onboarding.username.prop.account": "Akaunti inahitajika",
  "onboarding.username.prop.account_value": "Hakuna",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Karibu Airhop",
  "onboarding.hello.p1":
    "Habari. Airhop imejengwa juu ya bitchat kama mradi wa pembeni unaojitegemea wenye msimbo huria. Hauhusiani na wala hauidhinishwi na mradi wa bitchat au permissionless tech, ni kitu tu ninachofurahia kujenga na kushiriki na jamii.",
  "onboarding.hello.p2":
    "Hili ni toleo la kwanza kwa iOS na Android, kwa hivyo ingawa nimelijaribu na marafiki, huenda ukakutana na hitilafu chache. Ikitokea hivyo, au ukiwa na wazo la kipengele, ningependa kusikia. Fungua suala kwenye {github} au nitumie barua pepe kwenye {email}.",
  "onboarding.hello.p3":
    "Kama Airhop inakufaa, fikiria kuacha nyota kwenye {github} au uhakiki kwenye {store}. Hilo husaidia watu wengi zaidi kuugundua mradi huu. Asante kwa kujaribu!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Kabla simu yako haijauliza",
  "onboarding.primer.lede":
    "Hivi ndivyo kila kimoja kinavyofanya, na kisichofanya.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Hutafuta vifaa vilivyo karibu na kupitisha jumbe kati yake. Hivi ndivyo mesh inavyoundwa, na hufanya kazi bila muunganisho wa intaneti.",
  "onboarding.primer.location.title": "Mahali",
  "onboarding.primer.location.body":
    "Hukuweka kwenye vituo vya eneo lililo karibu, kuanzia mtaa mmoja hadi kanda nzima. Airhop haikufuatilii kamwe wala haitumi mahali ulipo hasa nje ya kifaa chako.",
  "onboarding.primer.notifications.title": "Arifa",
  "onboarding.primer.notifications.body":
    "Pokea taarifa za jumbe mpya hata programu ikiwa imefungwa. Arifa hutengenezwa hapa kwenye kifaa chako, bila seva yoyote kuhusika.",
  "onboarding.primer.footnote":
    "Unaweza kukataa. Jumbe bado husafiri kupitia intaneti, na unaweza kubadili mawazo baadaye kwenye Mipangilio.",
  "onboarding.primer.cta_a11y": "Endelea kwenye maombi ya ruhusa",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Ufikiaji wa Bluetooth",
  "permission.bluetooth.purpose": "kugundua vifaa vilivyo karibu kupitia mesh",
  "permission.open_settings": "Fungua Mipangilio",
  "permission.not_now": "Si sasa",
  "permission.blocked_title": "{label} imezimwa",
  "permission.blocked_body": "Iwashe kwenye Mipangilio ili {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Kuna kilichoenda vibaya",
  "error.boundary.body":
    "Airhop imekumbana na tatizo lisilotarajiwa na imelazimika kusitisha kile ilichokuwa ikionyesha.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Vituo vya kawaida",
  "chat.channels.yours": "Vituo vyako",
  "chat.channels.none": "Bado hakuna kituo",
  "chat.channels.none_hint":
    "Gusa {plus} hapo juu ili kujiunga au kutengeneza kimoja.",
  "chat.channels.none_desc":
    "Bado hakuna kituo. Tumia kitufe cha kuongeza kwenye kichwa ili kujiunga au kutengeneza kimoja.",
  "chat.channels.show_fewer": "Onyesha vituo vichache vya kawaida",
  "chat.channels.show_less": "Onyesha kidogo",
  "chat.channels.info": "Taarifa za kituo",
  "chat.channels.pin": "Bandika kituo",
  "chat.channels.unpin": "Ondoa ubandikaji wa kituo",
  "chat.channels.mute": "Nyamazisha kituo",
  "chat.channels.unmute": "Ondoa unyamazishaji wa kituo",
  "chat.channels.leave": "Ondoka kwenye kituo",
  "chat.channels.leave_confirm": "Ondoka",
  "chat.channels.clear_body":
    "Ufute jumbe zote kwenye {name}? Hili haliwezi kutenduliwa.",
  "chat.channels.leave_body":
    "Uondoke kwenye {name}? Utaacha kupokea jumbe zake, na historia yake itaondolewa kwenye kifaa hiki.",
  "chat.channels.more_options": "Chaguo zaidi za {name}",
  "chat.channels.teleported_tag": "{level}  ·  amehamishwa",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Futa gumzo",
  "chat.dm.remove_contact": "Ondoa anwani",
  "chat.dm.block": "Zuia peer huyu",
  "chat.dm.block_confirm": "Zuia",
  "chat.dm.delete": "Futa gumzo",
  "chat.dm.delete_body":
    "Hii huondoa mazungumzo kwenye orodha yako na kufuta jumbe zake. Anwani hubaki, na ujumbe mpya kutoka kwake huanzisha gumzo jipya.",
  "chat.dm.in_range": "ndani ya masafa",
  "chat.dm.row_hint": "Gusa mara mbili na ushikilie kwa chaguo zaidi",
  "chat.channels.row_hint": "Gusa mara mbili na ushikilie kwa chaguo zaidi",
  "chat.dm.you_prefix": "Wewe:",
  "chat.dm.none": "Hakuna jumbe za moja kwa moja",
  "chat.dm.none_desc":
    "Nenda kwenye kichupo cha Mesh na uguse peer ili kuanzisha ujumbe wa moja kwa moja uliosimbwa.",
  "chat.dm.contact_info": "Taarifa za anwani",
  "chat.dm.pin": "Bandika gumzo",
  "chat.dm.unpin": "Ondoa ubandikaji wa gumzo",
  "chat.dm.mute": "Nyamazisha gumzo",
  "chat.dm.unmute": "Ondoa unyamazishaji wa gumzo",
  "chat.dm.clear_body":
    "Ufute jumbe zote na {name}? Hili haliwezi kutenduliwa.",
  "chat.dm.remove_contact_body":
    "Umwondoe {name}? Hii hufuta mazungumzo na kusahau anwani. Bado anaweza kukufikia akikutumia ujumbe tena.",
  "chat.dm.block_body":
    "Umzuie {name}? Hutamwona kwenye kichupo cha Mesh wala kupokea jumbe kutoka kwake, hata akiwa karibu.",
  "chat.dm.more_options": "Chaguo zaidi za {name}",
  "chat.dm.remove_contact_short": "Ondoa anwani",
  "chat.dm.block_short": "Zuia anwani",
  "chat.dm.delete_short": "Futa gumzo",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Futa jumbe",
  "chat.clear_confirm": "Futa",
  "chat.group_badge": "Kikundi",
  "chat.more": "Zaidi",
  "chat.no_messages": "Bado hakuna jumbe",
  "chat.you": "Wewe",
  "chat.a11y.channel": "Kituo {name}",
  "chat.a11y.group": "Kikundi {name}",
  "chat.a11y.muted": "kimenyamazishwa",
  "chat.a11y.pinned": "kimebandikwa",

  // ---- Chats: start something new ----
  "chat.new.title": "Anzisha kitu kipya",
  "chat.new.channel": "Tengeneza kituo cha faragha",
  "chat.new.channel_label": "Kituo cha faragha",
  "chat.new.channel_desc":
    "Chumba ambacho yeyote mwenye kiungo anaweza kujiunga nacho. Tengeneza kimoja, au jiunge kwa kiungo ulichotumiwa.",
  "chat.new.group": "Tengeneza kikundi cha faragha",
  "chat.new.group_label": "Kikundi cha faragha",
  "chat.new.group_desc":
    "Chagua watu mahususi. Hadi 16. Hubaki kwenye Bluetooth.",
  "chat.new.place": "Nenda mahali kwa geohash",
  "chat.new.place_label": "Nenda mahali",
  "chat.new.place_desc": "Fungua kituo cha mahali popote kwa geohash yake.",
  "chat.new.reach": "Ufikiaji",
  "chat.new.reach_internet": "Hufikia wanachama kupitia Bluetooth na intaneti.",
  "chat.new.reach_mesh":
    "Hufanya kazi ndani ya masafa ya Bluetooth, si kupitia intaneti.",
  "chat.new.reach_internet_desc":
    "Hufikia wanachama kupitia intaneti pia. Relay zinaweza kuona kuwa kituo kinaendelea, kamwe si jumbe zake wala nani yumo.",
  "chat.new.reach_mesh_desc":
    "Hubaki kwenye mesh ya hapa. Yenye faragha zaidi, hakuna kinachotoka nje ya masafa ya Bluetooth.",
  "chat.new.join_link": "Jiunge na kituo cha faragha kwa kiungo cha mwaliko",
  "chat.new.back_to_chooser": "Rudi kwenye chaguo",
  "chat.new.create_channel": "Tengeneza kituo",
  "chat.new.name_required": "Weka jina la kituo kwanza",
  "chat.new.name_taken": "Jina hilo tayari limechukuliwa",
  "chat.new.create": "Tengeneza",
  "chat.new.e2ee":
    "Imesimbwa mwanzo hadi mwisho. Wanachama pekee ndio wanaoweza kusoma jumbe.",
  "chat.new.invite_only":
    "Kwa mwaliko pekee. Yeyote unayemshirikisha kiungo anaweza kujiunga. Hubaki kimefichwa kwa wengine wote, hata peer walio karibu.",
  "chat.new.name_exists": "Tayari kuna kituo chenye jina hili.",
  "chat.new.reach_bluetooth_chip": "Bluetooth pekee",
  "chat.new.reach_internet_chip": "Bluetooth + intaneti",
  "chat.new.have_link": "Jiunge kwa kiungo cha mwaliko",

  // ---- Chats: join by link ----
  "chat.join.title": "Jiunge kwa kiungo",
  "chat.join.not_airhop": "Hicho si kiungo cha Airhop.",
  "chat.join.reach_internet":
    "Hufikia wanachama kupitia Bluetooth na intaneti.",
  "chat.join.reach_mesh": "Hubaki ndani ya masafa ya Bluetooth.",
  "chat.join.contact_card":
    "Kadi ya anwani. Humwongeza kwenye anwani zako na kufungua gumzo.",
  "chat.join.unverified": "Kiungo hicho hakikuweza kuthibitishwa",
  "chat.join.unverified_body":
    "Kadi ya anwani hailingani na funguo zake mwenyewe, kwa hivyo haikuongezwa. Waombe watume mpya.",
  "chat.join.paste": "Bandika kutoka ubao wa kunakili",
  "chat.join.join": "Jiunge",
  "chat.join.public_channel":
    "Kituo cha umma {name}. Yeyote aliye karibu anaweza kukisoma.",
  "chat.join.private_channel": "Kituo cha faragha {name}. {reach}",
  "chat.join.dm_with": "Ujumbe wa moja kwa moja na {name}.",
  "chat.join.joined_as": "Umejiunga kama {name}",
  "chat.join.name_clash_body":
    "Tayari upo kwenye {name} tofauti. Majina ya vituo ni lebo tu, kwa hivyo mwaliko huu umefungua kituo chake mwenyewe na kile ulichokuwamo hakijaguswa. Unaweza kubadilisha jina la chochote kati yake kutoka taarifa za kituo chake.",
  "chat.join.paste_hint":
    "Bandika mwaliko unaoanza na airhop://. Kugusa kiungo pia hufanya kazi; hii ni kwa kiungo usichoweza kukigusa.",
  "chat.join.key_note":
    "Mwaliko wa kituo cha faragha hubeba ufunguo, kwa hivyo kujiunga ni papo hapo na hakuna anayeombwa chochote.",
  "chat.join.offline_note":
    "Hufanya kazi nje ya mtandao. Kiungo husomwa kwenye kifaa hiki, na kituo hufika kadiri mtengenezaji wake alivyokiweka.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Seli hiyo haikuweza kufunguliwa. Jaribu tena baada ya muda mfupi.",
  "chat.jump.title": "Nenda mahali",
  "chat.jump.saved": "MAHALI PALIPOHIFADHIWA",
  "chat.jump.anywhere":
    "Fungua kituo cha umma cha mahali popote, hata mahali usipokuwepo.",
  "chat.jump.geohash_note":
    "Weka geohash yake. Kila mtu ambaye mahali pake pako ndani ya seli hiyo hushiriki kituo.",
  "chat.jump.teleport_note":
    "Utaonekana umehamishwa, si uko karibu. Hufika kupitia intaneti pekee.",
  "chat.jump.level_cell": "Seli ya kiwango cha {level}",
  "chat.jump.already_here":
    "Tayari upo hapa. Nenda hufungua kituo chako cha {name}.",
  "chat.jump.open_direction": "Fungua seli iliyo {direction} yako",
  "chat.jump.open_place": "Fungua {name}",
  "chat.jump.remove_place": "Ondoa {name} kwenye mahali palipohifadhiwa",
  "chat.jump.go": "Nenda",
  "chat.jump.how":
    "Kupata geohash: fungua kituo cha mahali > gusa jina lake > inakili kutoka hapo.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Haikuweza kumfikia kila mwanachama. Jaribu tena wakiwa karibu.",
  "chat.group.you_were_added": "Umeongezwa kwenye {name}.",
  "chat.group.added_you": "Amekuongeza kwenye {name}",
  "chat.group.you_were_removed":
    "Umeondolewa kwenye {name}. Huwezi tena kusoma wala kutuma jumbe hapa.",
  "chat.group.removed_you": "Amekuondoa kwenye {name}",
  "chat.group.add_failed": "Hawakuweza kuongezwa",
  "chat.group.add_failed_body":
    "Hakuna kilichobadilika. Ama hawafikiki kwa sasa, au kikundi kimejaa kwa 16, au si wewe uliyekitengeneza.",
  "chat.group.remove_failed": "Hawakuweza kuondolewa",
  "chat.group.remove_failed_body":
    "Hakuna kilichobadilika. Ni mtu aliyetengeneza kikundi pekee anayeweza kubadilisha nani yumo ndani yake.",
  "chat.group.e2ee":
    "Imesimbwa mwanzo hadi mwisho. Wanachama pekee ndio wanaoweza kusoma jumbe.",
  "chat.group.cap":
    "Hadi watu 16, uliowachagua wewe. Hakuna kiungo cha mwaliko, kwa hivyo hakuna anayejiunga kwa kutumiwa kiungo na mtu.",
  "chat.group.bluetooth":
    "Bluetooth pekee. Wanachama walio nje ya masafa hupokea jumbe watakaporudi.",
  "chat.group.members_label": "WANACHAMA",
  "chat.group.none_in_range":
    "Hakuna aliye ndani ya masafa. Wanachama lazima wawe karibu unapotengeneza kikundi.",
  "chat.group.create_title": "Tengeneza kikundi",
  "chat.group.name_placeholder": "Jina la kikundi",
  "chat.group.create": "Tengeneza",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Mesh ya hapa · Bluetooth pekee",
  "chat.scope.mesh_desc":
    "Hufikia vifaa vilivyo ndani ya masafa ya Bluetooth (takribani mita 10 hadi 100). Hakuna intaneti inayohitajika. Bora kwa kuratibu papo hapo.",
  "chat.scope.block": "Kitalu cha jiji · ~mita 100",
  "chat.scope.block_desc":
    "Ufikiaji wa kiwango cha kitalu cha jiji. Jumbe huvushwa kupitia intaneti ili peer walio nje kidogo ya masafa ya Bluetooth waweze kushiriki.",
  "chat.scope.neighborhood": "Mtaa · ~km 1",
  "chat.scope.neighborhood_desc":
    "Ufikiaji wa kiwango cha mtaa. Husaidiwa na relay ili peer wa eneo lote wafikike hata bila kiungo cha moja kwa moja cha Bluetooth.",
  "chat.scope.city": "Jiji · ~km 10",
  "chat.scope.city_desc":
    "Kituo cha jiji zima. Hutumia relay za intaneti zenye mahali ili kufikia peer wa jiji zima.",
  "chat.scope.province": "Mkoa · ~km 100",
  "chat.scope.province_desc":
    "Ufikiaji wa kiwango cha mkoa. Huvushwa kupitia intaneti kwa ufikiaji wa kikanda wa mamia ya kilomita.",
  "chat.scope.country": "Nchi au kanda · ~km 1000",
  "chat.scope.country_desc":
    "Ufikiaji wa nchi nzima. Mtumiaji yeyote wa Airhop au bitchat katika kanda anaweza kujiunga na kusoma jumbe.",
  "chat.transport.bluetooth": "Bluetooth pekee",
  "chat.transport.both": "Bluetooth + intaneti",
  "chat.transport.internet": "Intaneti pekee",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Amri /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Tuma kumbatio la joto",
  "chat.cmd.slap_hint": "Piga kofi kwa samaki mkubwa",
  "chat.status.sending": "Inatuma…",
  "chat.status.undo_send": "Tendua kutuma",
  "chat.status.undo": "Tendua",
  "chat.status.sent": "Umetumwa",
  "chat.status.received": "Umepokelewa",
  "chat.status.failed": "Umeshindwa",
  "chat.status.canceled": "Umeghairiwa",
  "chat.status.waiting": "Unasubiri",
  "chat.status.sending_short": "Inatuma",
  "chat.status.receiving": "Inapokea",
  "chat.thread.not_available": "Haipatikani hapa",
  "chat.thread.private_channel": "Kituo cha faragha",
  "chat.thread.location_channel": "Kituo cha mahali",
  "chat.thread.public_channel": "Kituo cha umma",
  "chat.thread.notices": "Matangazo ya kituo hiki",
  "chat.thread.invite": "Alika mtu kwenye kituo hiki",
  "chat.thread.not_in_range":
    "Hayupo ndani ya masafa ya Bluetooth. Inafikishwa kupitia intaneti.",
  "chat.thread.not_nearby":
    "Hayupo karibu. Tutafikisha atakaporudi ndani ya masafa au akiwa mtandaoni.",
  "chat.thread.no_keys":
    "Utahitaji kuwa ndani ya masafa ya Bluetooth, au kuchanganua msimbo wake, ili kumtumia ujumbe.",
  "chat.geo.card_received":
    "{name} ameshiriki anwani yake. Shiriki yako naye ili muendelee kuzungumza baada ya mmoja wenu kuhama.",
  "chat.geo.exchange_complete":
    "Anwani zimebadilishwa. Sasa mnaweza kufikiana kutoka popote.",
  "chat.geo.keep_person": "Mhifadhi mtu huyu",
  "chat.geo.keep_person_desc":
    "Shiriki anwani yako ili muendelee kuzungumza baada ya mmoja wenu kuhama. Atajua utambulisho wako wa kudumu.",
  "chat.geo.card_sent": "Imeshirikiwa · inasubiri yake",
  "chat.thread.left_cell":
    "Umeondoka eneo hili, kwa hivyo hawawezi kukufikia hapa. Badilishaneni misimbo ili muendelee kuzungumza popote.",
  "chat.thread.no_route":
    "Haiwezi kuwafikia kwa sasa. Ujumbe utatumwa njia itakapopatikana.",
  "chat.thread.empty": "Bado hakuna jumbe",
  "chat.thread.empty_desc": "Anzisha mazungumzo yaliyosimbwa.",
  "chat.thread.jump_latest": "Rukia ujumbe wa hivi punde",
  "chat.thread.back_to_members": "Rudi kwa wanachama",
  "chat.thread.nostr_key": "Ufunguo wa umma wa Nostr",
  "chat.thread.in_range": "Ndani ya masafa",
  "chat.voice.not_recorded": "Noti ya sauti haikurekodiwa",
  "chat.thread.message": "Ujumbe",
  "chat.thread.message_placeholder": "Ujumbe…",
  "chat.thread.length_full": "Ujumbe umejaa",
  "chat.thread.waiting_for": "Inasubiri {name} arudi · {percent}%",
  "chat.thread.peer": "peer",
  "chat.thread.cancel_transfer": "Ghairi {name}",
  "chat.thread.queued_more": "{count} zaidi zinasubiri kutumwa",
  "chat.thread.across_bridge": "{count} ng'ambo ya daraja",
  "chat.thread.bridged": "imevushwa",
  "chat.thread.invite_body":
    "Jiunge nami kwenye {channel} kwenye Airhop — jumbe za mesh zenye faragha, zinazofanya kazi bila mtandao kwanza.",
  "chat.thread.go_back_unread": "Rudi nyuma, {count} hazijasomwa",
  "chat.thread.view_info": "Tazama taarifa za {name}",
  "chat.thread.notices_new": "Matangazo ya kituo hiki, {count} mapya",
  "chat.thread.say_something": "Sema kitu kwenye {channel}.",
  "chat.thread.jump_latest_new": "Rukia ujumbe wa hivi punde, {count} mpya",
  "chat.thread.unconfirmed_since":
    "Hakuna ufikishaji uliothibitishwa tangu {date}",
  "chat.thread.no_reach": "Hakuna peer karibu · bado hakuna aliyeupokea huu",
  "chat.thread.channel_needs_internet":
    "Intaneti imezimwa · kituo hiki hufikia watu walio ndani ya masafa ya Bluetooth pekee",
  "chat.thread.cell_needs_internet":
    "Intaneti imezimwa · seli hii hufikika kupitia intaneti pekee",
  "chat.thread.geo_dm_needs_internet":
    "Intaneti imezimwa · mazungumzo haya hubebwa kupitia intaneti pekee",
  "chat.thread.via_gateway":
    "Intaneti imezimwa · kifaa kilicho karibu kinaubeba huu mtandaoni kwa niaba yako",
  "chat.thread.group_queued":
    "Bado hakuna mtu wa kikundi hiki aliye karibu. Utawafikia watakapokuwa karibu.",
  "chat.thread.no_group_key":
    "Hupo tena kwenye kikundi hiki, kwa hivyo huu hauwezi kutumwa",
  "chat.thread.no_reach_offline":
    "Intaneti imezimwa na hakuna peer karibu · bado hakuna aliyeupokea huu",
  "chat.thread.mention": "Mtaje {name}",
  "chat.thread.someone_talking": "{hold}. {name} anazungumza.",
  "chat.thread.attach_note":
    "Faili hutumwa ndani ya masafa ya Bluetooth pekee. Maandishi na malipo hufikia anwani kupitia intaneti; viambatisho havifiki.",
  "chat.thread.message_peer": "Mtumie ujumbe {name}",
  "chat.thread.send": "Tuma ujumbe",
  "chat.thread.group": "Kikundi",
  "chat.bridge.nearby_only":
    "Karibu pekee: uweke ujumbe huu mbali na daraja la mesh",
  "chat.bridge.nearby_label": "Karibu pekee · hubaki kwenye Bluetooth",
  "chat.bridge.bridging_label":
    "Inavusha kwenye maeneo yaliyo karibu · gusa kwa karibu pekee",
  "chat.screenshot.you_took": "Umepiga picha ya skrini",
  "chat.screenshot.you_took_private":
    "Umepiga picha ya skrini · hakuna aliyeambiwa",
  "chat.screenshot.heads_up": "Angalizo",
  "chat.screenshot.notice": "* {name} amepiga picha ya skrini *",
  "chat.screenshot.notified_dm":
    "{name} ameambiwa kuwa umepiga picha ya skrini ya mazungumzo haya.",
  "chat.screenshot.notified":
    "Kila mtu kwenye kituo hiki ameambiwa kuwa umepiga picha ya skrini.",
  "chat.screenshot.not_notified":
    "Hakuna aliyeambiwa. Kituo hiki ni cha umma, kwa hivyo kutangaza picha ya skrini kungeweka kumbukumbu kuwa ulikuwa hapa.",
  "chat.thread.error": "Hitilafu",
  "chat.thread.go_back": "Rudi nyuma",
  "chat.bubble.via_bridge": "kupitia daraja la mesh",
  "chat.bubble.view_profile": "Tazama wasifu wa {name}",
  "chat.bubble.forwarded": "Umesambazwa",
  "chat.bubble.attachment": "kiambatisho",
  "chat.bubble.a11y": "{sender}: {body}. Shikilia kwa muda kwa chaguo zaidi.",
  "chat.bubble.failed_retry": "Imeshindwa kutuma. Gusa ili kujaribu tena.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Taarifa za ujumbe",
  "chat.info.delivered_to": "Umefikishwa kwa {name}",
  "chat.info.read_by": "Umesomwa na {name}",
  "chat.info.group_reach_desc": "Wanafikika sasa, si uthibitisho wa kufikishwa",
  "chat.info.group_alone": "Hakuna wanachama wengine",
  "chat.info.today_at": "Leo {time}",
  "chat.info.sending": "Inatuma…",
  "chat.info.failed": "Imeshindwa kutuma",
  "chat.info.courier": "Umebebwa na rafiki",
  "chat.info.sent": "Umetumwa",
  "chat.info.queued": "Unasubiri kutumwa",
  "chat.info.waiting": "Inasubiri…",
  "chat.action.info": "Taarifa za ujumbe",
  "chat.action.save_photos": "Hifadhi kwenye picha",
  "chat.action.save_copy": "Hifadhi nakala",
  "chat.action.forward": "Sambaza",
  "chat.action.select": "Chagua",
  "chat.select.cancel": "Ghairi uteuzi",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Kamera",
  "chat.attach.camera_desc": "Piga picha au video",
  "chat.attach.library": "Ghala la picha",
  "chat.attach.library_desc": "Chagua kutoka ghala lako",
  "chat.attach.document": "Hati",
  "chat.attach.document_desc": "Tuma faili au PDF yoyote",
  "chat.attach.voice": "Noti ya sauti",
  "chat.attach.voice_desc": "Rekodi na utume ujumbe wa sauti",
  "chat.attach.ecash": "Tuma ecash",
  "chat.attach.ecash_desc": "Tuma sat za Cashu kutoka pochi yako",
  "chat.attach.location": "Mahali",
  "chat.attach.location_desc": "Tuma ulipo sasa hivi",
  "chat.attach.title": "Ambatisha",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Ameshiriki mahali",
  "chat.location.received_summary": "Ameshiriki mahali alipo",
  "chat.location.title": "Mahali",
  "chat.location.away": "{distance} kuelekea {direction}",
  "chat.location.taken": "Palichukuliwa {ago} zilizopita",
  "chat.location.open_maps": "Fungua kwenye Maps",
  "chat.location.no_forward": "Mahali hapasambazwi",
  "chat.location.no_forward_body":
    "Mahali hutumwa kwa mtu mmoja. Shiriki pako mwenyewe badala yake kama unataka mtu mwingine awe napo.",
  "chat.location.no_fix": "Ruhusu mahali ili kuona umbali wake",
  "chat.location.send_title": "Tuma mahali ulipo",
  "chat.location.send_body":
    "{name} ataona nukta moja: ulipo sasa. Haiendelei kusasishwa.",
  "chat.location.send": "Tuma mahali",
  "chat.location.finding": "Inatafuta ulipo…",
  "chat.location.no_location": "Haikuweza kupata ulipo",
  "chat.location.no_location_body":
    "Ruhusu ufikiaji wa mahali na uhakikishe huduma za mahali zimewashwa, kisha ujaribu tena.",
  "chat.location.not_delivered": "Mahali ulipo hapakuweza kutumwa",
  "chat.location.not_delivered_body":
    "Mahali huwa na maana kutumwa tu pakiwa pa sasa, kwa hivyo hapaingii kwenye foleni ya baadaye. Jaribu tena {name} atakapofikika.",
  "chat.location.direction.n": "kaskazini",
  "chat.location.direction.ne": "kaskazini-mashariki",
  "chat.location.direction.e": "mashariki",
  "chat.location.direction.se": "kusini-mashariki",
  "chat.location.direction.s": "kusini",
  "chat.location.direction.sw": "kusini-magharibi",
  "chat.location.direction.w": "magharibi",
  "chat.location.direction.nw": "kaskazini-magharibi",
  "chat.attach.send_anyway": "Tuma hata hivyo",
  "chat.attach.bitchat_too_big": "Hii huenda isifike",
  "chat.attach.bitchat_too_big_body":
    "{name} yupo kwenye bitchat, ambayo hukata tamaa katikati ya faili kubwa. Chini ya takribani 350 KiB hutegemewa. Kuituma kwa anwani ya Airhop hakuna kikomo cha aina hiyo.",
  "chat.attach.bitchat_unopenable": "Huenda wasiweze kuifungua hii",
  "chat.attach.bitchat_unopenable_body":
    "{name} yupo kwenye bitchat, ambayo huonyesha picha na noti za sauti lakini huorodhesha kila kitu kingine kama faili isiyoweza kuifungua. Itafika, ila huenda wasiweze kuiona.",
  "chat.attach.file": "Ambatisha faili",
  "chat.attach.unavailable": "Viambatisho havipatikani hapa",
  "chat.attach.not_sent": "Kiambatisho hakikutumwa",
  "chat.attach.read_failed":
    "Kuna kilichoenda vibaya kusoma faili hiyo. Jaribu nyingine.",
  "chat.attach.caption": "Ongeza maelezo…",
  "chat.attach.send": "Tuma kiambatisho",
  "chat.attach.generic": "Kiambatisho",
  "chat.media.view_full": "Tazama picha kwa skrini nzima",
  "chat.media.gone_photo": "Picha haipo kwenye kifaa hiki",
  "chat.media.gone_video": "Video haipo kwenye kifaa hiki",
  "chat.media.gone_voice": "Noti ya sauti haipo kwenye kifaa hiki",
  "chat.media.gone_file": "Faili haipo kwenye kifaa hiki",
  "chat.media.gone_note": "Iliondolewa baada ya siku 7 au akiba ilipofutwa",
  "chat.media.ask_resend": "Omba tena",
  "chat.media.resend_draft": "Unaweza kutuma {kind} hiyo tena?",
  "chat.media.kind_photo": "picha",
  "chat.media.kind_video": "video",
  "chat.media.kind_voice": "noti ya sauti",
  "chat.media.kind_file": "faili",
  "chat.media.pause_voice": "Sitisha noti ya sauti",
  "chat.media.play_voice": "Cheza noti ya sauti",
  "chat.media.voice_position": "Nafasi kwenye noti ya sauti",
  "chat.media.voice_scrub": "Gusa kwenye mistari ili kurukia mahali hapo",
  "chat.media.image": "Picha",
  "chat.media.tap_load_photo": "Gusa ili kupakia picha",
  "chat.media.open_document": "Fungua {name}",
  "chat.media.document": "hati",
  "chat.media.tap_load_video": "Gusa ili kupakia video",
  "chat.media.video": "Video",
  "chat.media.photo": "Picha",
  "chat.media.close_photo": "Funga picha",
  "chat.media.save_photo": "Hifadhi picha kwenye picha zako",
  "chat.media.share_photo": "Shiriki picha",
  "chat.media.saved_videos": "Imehifadhiwa kwenye video zako",
  "chat.media.saved_photos": "Imehifadhiwa kwenye picha zako",
  "chat.media.not_saved": "Haijahifadhiwa",
  "chat.media.cant_open": "Faili haiwezi kufunguliwa",
  "chat.media.no_app":
    "Kifaa hiki hakina programu ya kufungua au kushiriki faili hii.",
  "chat.media.open_failed":
    "Faili haikuweza kufunguliwa. Huenda imeondolewa kwenye akiba.",
  "media.blocked.nostr_only":
    "Unamfahamu mtu huyu kupitia relay pekee. Maandishi tu ndiyo yanapatikana. Picha, faili na noti za sauti zinahitaji Bluetooth.",
  "media.blocked.private_channel":
    "Kiambatisho cha matangazo hutiwa saini lakini hakisimbwi, kwa hivyo kukituma kwenye kituo cha faragha kungekiweka wazi ilhali maandishi hapa yanabaki yakiwa yamesimbwa.",
  "media.blocked.private_group":
    "Kiambatisho cha matangazo hutiwa saini lakini hakisimbwi, kwa hivyo kukituma kwenye kikundi cha faragha kungekiweka wazi ilhali maandishi hapa yanabaki yakiwa yamesimbwa.",
  "media.blocked.location_channel":
    "Kituo cha mahali hufika kwa watu kupitia intaneti, na picha, faili na noti za sauti husafiri kupitia Bluetooth, kwa hivyo hazingefika kamwe.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Noti za sauti hazipatikani hapa",
  "chat.voice.hold_live": "Shikilia ili kuzungumza moja kwa moja",
  "chat.voice.hold_record": "Shikilia ili kurekodi noti ya sauti",
  "chat.voice.cancel_recording": "Ghairi kurekodi",
  "chat.voice.slide_cancel": "Telezesha ili kughairi",
  "chat.voice.release_cancel": "Achia ili kughairi",
  "chat.voice.a11y_toggle": "Gusa mara mbili ili kuanza au kuacha kuzungumza.",
  "chat.voice.limit_reached":
    "Kikomo cha dakika mbili kimefikiwa, achia ili kutuma",
  "chat.voice.limit_sent": "Kikomo cha dakika mbili kimefikiwa, noti imetumwa",
  "chat.voice.stop_send": "Simamisha kurekodi na utume",
  "chat.voice.lift_lock": "Telezesha juu ili kurekodi bila kushikilia",
  "chat.voice.live_speaking": "{name} anazungumza",
  "voice.unavailable": "Sauti ya moja kwa moja haipatikani",
  "voice.recording_stopped": "Kurekodi kumesimamishwa",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Ufikiaji wa kamera",
  "chat.perm.camera_purpose": "kupiga picha ya kutuma",
  "chat.perm.photo_label": "Ufikiaji wa picha",
  "chat.perm.photo_purpose": "kuchagua picha au video ya kutuma",
  "chat.perm.photo_save_purpose": "kuhifadhi hii kwenye picha zako",
  "chat.perm.mic_label": "Ufikiaji wa maikrofoni",
  "chat.perm.mic_live_purpose": "kuzungumza na watu walio karibu",
  "chat.perm.mic_note_purpose": "kurekodi noti ya sauti",
  "chat.perm.recording_stopped": "Kurekodi kumesimamishwa",
  "chat.perm.record_failed":
    "Kurekodi hakukuweza kuanza. Kagua ruhusa za maikrofoni.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Imedaiwa",
  "chat.ecash.reclaimed": "Imerudishwa",
  "chat.ecash.claiming": "Inadai…",
  "chat.ecash.claim": "Dai",
  "chat.ecash.claim_amount": "Dai {amount} {unit}",
  "chat.ecash.already_claimed": "Tayari imedaiwa",
  "chat.ecash.already_claimed_body":
    "Kila uthibitisho kwenye tokeni hii tayari upo kwenye pochi yako, kwa hivyo hakuna kilichoongezwa.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Umekabidhiwa kwa mesh kwa ufikishaji wa kadiri iwezekanavyo",
  "chat.info.queued_desc":
    "Unashikiliwa kwenye simu hii hadi kuwe na njia ya kuwafikia",
  "chat.info.reclaimed": "Yamerudishwa",
  "chat.info.reclaimed_desc":
    "Umerudisha malipo haya kwenye pochi yako, kwa hivyo hayatafikishwa",
  "chat.info.about": "Kuhusu",
  "chat.info.group_desc":
    "Kikundi cha faragha. Ni wanachama aliowaongeza mtengenezaji pekee wanaoweza kukisoma, na hubaki kwenye Bluetooth.",
  "chat.info.teleported_desc":
    "Kituo cha umma cha mahali kwa seli hii ya geohash. Yeyote aliye kwenye seli, kwenye Airhop au bitchat, hukishiriki kupitia intaneti. Umehamishwa, hupo hapa kimwili.",
  "chat.info.custom_desc":
    "Kituo cha kujitengenezea. Yeyote anayejua jina anaweza kujiunga kutoka kifaa chochote chenye Airhop au bitchat.",
  "chat.info.private_e2ee": "Cha faragha · kimesimbwa mwanzo hadi mwisho",
  "chat.info.public_plain": "Cha umma · hakijasimbwa",
  "chat.info.group_privacy":
    "Ni wanachama walioonyeshwa hapa chini pekee wanaoweza kusoma kikundi hiki. Jumbe hubaki kwenye Bluetooth, kwa hivyo wanachama walio nje ya masafa huzipokea watakaporudi.",
  "chat.info.teleport_privacy":
    "Mahali ulipohamia. Hufikia kila mtu aliye kwenye seli hii kupitia intaneti, na hakuna aliye ndani ya masafa ya Bluetooth.",
  "chat.info.location_off_privacy":
    "Mahali pamezimwa, kwa hivyo kituo hiki hufikia vifaa vilivyo karibu kupitia Bluetooth pekee. Washa mahali ili kufikia seli ya eneo lake kupitia intaneti.",
  "chat.info.invite_privacy":
    "Ni watu unaowaalika kupitia kiungo pekee wanaoweza kukisoma. Hubaki kimefichwa kwa wengine wote, hata peer walio karibu.",
  "chat.info.public_privacy":
    "Yeyote anayejiunga anaweza kusoma kila ujumbe. Tumia ujumbe wa moja kwa moja kwa mazungumzo ya faragha; jumbe za moja kwa moja zimesimbwa mwanzo hadi mwisho.",
  "chat.info.remove_member": "Ondoa mwanachama",
  "chat.info.remove_member_body":
    "Umwondoe {name} kwenye kikundi? Ufunguo wa kikundi hubadilishwa ili asiweze tena kusoma jumbe mpya.",
  "chat.info.message_member": "Mtumie ujumbe {name}",
  "chat.info.remove_member_a11y": "Ondoa {name}",
  "chat.info.no_addable":
    "Hakuna peer anayefikika wa kuongeza. Wanachama lazima wawe karibu.",
  "chat.info.add_count": "Ongeza {count}",
  "chat.info.teleported_tag": "{level}  ·  amehamishwa",
  "chat.info.active": "Hai",
  "chat.info.members": "Wanachama",
  "chat.info.bookmark": "Hifadhi mahali hapa",
  "chat.info.remove_bookmark": "Ondoa alamisho",
  "chat.info.default_notice":
    "Vituo vya kawaida haviwezi kuachwa. Ni sehemu ya protokali ya mesh ya Airhop.",
  "chat.info.custom_channel": "Kituo cha kujitengenezea",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Nakili geohash",
  "chat.info.relays": "Relay",
  "chat.info.show_relays": "Onyesha relay zinazobeba kituo hiki",
  "chat.info.relay_custom": "ya kujitengenezea",
  "chat.info.relays_none": "Hakuna. Seli hii ni ya Bluetooth pekee kwa sasa.",
  "chat.info.search_members": "Tafuta wanachama",
  "chat.info.search_members_placeholder": "Tafuta wanachama…",
  "chat.info.teleported": "Amehamishwa",
  "chat.info.creator": "Mtengenezaji",
  "chat.info.no_matches": "Hakuna kinacholingana",
  "chat.info.no_one_here": "Bado hakuna mtu hapa",
  "chat.info.add_members": "Ongeza wanachama",
  "chat.info.add_selected": "Ongeza wanachama waliochaguliwa",
  "chat.info.add": "Ongeza",
  "chat.info.leave_group": "Ondoka kwenye kikundi",
  "chat.info.leave_channel": "Ondoka kwenye kituo",
  "chat.info.leave": "Ondoka",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Mnazungumza tangu {date}",
  "chat.contact.verified_since": "Amethibitishwa tangu {date}",
  "chat.contact.anonymous": "Asiyejulikana",
  "chat.contact.anonymous_desc":
    "Jina bandia la geohash lisilo na utambulisho wa kudumu wa kuthibitisha",
  "chat.contact.verified": "Amethibitishwa",
  "chat.contact.verified_desc": "Umechanganua msimbo wake wa QR",
  "chat.contact.verified_desc_compared": "Mmelinganisha misimbo",
  "chat.contact.not_verified": "Hajathibitishwa",
  "chat.contact.not_verified_desc":
    "Changanua msimbo wake, au linganisheni mmoja mkiwa kwenye simu, ili kuthibitisha kuwa ni yeye kweli",
  "chat.contact.e2ee": "Imesimbwa mwanzo hadi mwisho",
  "chat.contact.e2ee_nostr":
    "Imefungwa kwa NIP-17, kwa hivyo relay haziwezi kuisoma",
  "chat.contact.e2ee_mesh":
    "Noise XX, pamoja na Double Ratchet kati ya vifaa vyenye Airhop",
  "chat.contact.copy_nostr": "Nakili ufunguo wa umma wa Nostr",
  "chat.contact.nostr_key": "Ufunguo wa umma wa Nostr",
  "chat.contact.cell_key_note":
    "Ufunguo huu ni wa eneo mlipokutana. Hubadilika mmoja wenu akihama, na mazungumzo hukoma nao. Badilishaneni anwani ili muendelee kuzungumza popote.",
  "chat.contact.peer_name": "Jina la peer",
  "chat.contact.peer_id": "Kitambulisho cha peer",
  "chat.contact.rename": "Badilisha jina",
  "chat.contact.rename_needs_contact":
    "Unaweza kubadilisha majina ya watu ambao una funguo zao. Badilishaneni kadi za anwani kwanza, kisha hili linakuwa jina unaloliona wewe pekee.",
  "chat.contact.rename_needs_keys":
    "Bado hakuna funguo za anwani hii. Mtumie ujumbe, au changanua msimbo wake, kisha unaweza kumpa jina unaloliona wewe pekee.",
  "chat.contact.renamed_by_you": "Jina lako kwa ajili yake",
  "chat.contact.copy_peer_id": "Nakili kitambulisho cha peer",
  "chat.contact.verify": "Thibitisha anwani",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Matangazo",
  "chat.notices.post_area": "Bandika tangazo kwenye eneo hili",
  "chat.notices.post_mesh": "Bandika tangazo kwenye mesh",
  "chat.notices.mark_urgent": "Weka alama ya dharura",
  "chat.notices.post": "Bandika tangazo",
  "chat.notices.post_short": "Bandika",
  "chat.notices.delete": "Futa tangazo",
  "chat.notices.just_now": "sasa hivi",
  "chat.notices.fades_soon": "litafifia hivi karibuni",
  "chat.notices.1_day": "Siku 1",
  "chat.notices.3_days": "Siku 3",
  "chat.notices.7_days": "Siku 7",
  "chat.notices.fading": "linafifia",
  "chat.notices.fades_in_hours": "litafifia baada ya saa {count}",
  "chat.notices.fades_in_days": "litafifia baada ya siku {count}",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Dharura",
  "chat.notices.permanent_warning":
    "Halififii kamwe. Ni la wazi kwa umma na limefungwa kwenye eneo hili, nawe huwezi kulirudisha.",
  "chat.notices.none":
    "Bado hakuna matangazo. Bandika moja ili libaki hapa kwa ajili ya wengine.",

  // ---- Chats: search results ----
  "chat.search.photos": "Picha",
  "chat.search.videos": "Video",
  "chat.search.audio": "Sauti",
  "chat.search.documents": "Hati",
  "chat.search.links": "Viungo",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Chuja kwa {filter}",
  "chat.search.no_matches": "Hakuna {filter} zinazolingana na “{query}”",
  "chat.search.no_media": "Bado hakuna {filter}",
  "chat.search.result_a11y": "{chat}, {kind} kutoka {sender}",
  "chat.search.you": "wewe",
  "chat.search.section_chats": "Gumzo",
  "chat.search.section_messages": "Jumbe",
  "chat.search.section_notices": "Matangazo",
  "chat.search.hint":
    "Tafuta kwenye jumbe na gumzo, au chagua kichujio hapo juu.",
  "chat.search.no_results": "Hakuna matokeo ya “{query}”",
  "chat.search.open_chat": "Fungua {name}",
  "chat.search.message_a11y": "{chat}, ujumbe kutoka {sender}: {snippet}",
  "chat.search.notice_a11y": "Tangazo kwenye {chat} kutoka {author}: {snippet}",
  "chat.search.urgent": "Dharura ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Kuna {count} kwenye orodha hii. Kuzifuta huziondoa hapa pekee, na jumbe hubaki hazijasomwa kwenye mazungumzo yake. Kuweka alama zote kuwa zimesomwa hupanga vyote viwili.",
  "chat.notif.mark_all_read": "Weka alama zote kuwa zimesomwa",
  "chat.notif.clear_list": "Futa orodha",
  "chat.notif.clear_all_a11y": "Futa arifa zote {count}",
  "chat.notif.title": "Arifa",
  "chat.notif.clear_short": "Futa",
  "chat.notif.close": "Funga arifa",
  "chat.notif.none": "Bado hakuna arifa",
  "chat.notif.none_desc":
    "Jumbe, kutajwa, na matangazo kutoka vituo na gumzo lako huonekana hapa.",
  "chat.notif.new": "Mpya",
  "chat.notif.notice_in": "tangazo kwenye {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Sambaza kwa…",
  "chat.forward.to": "Sambaza kwa {name}",
  "chat.forward.cant_send_here": "Haiwezi kusambazwa hapa",
  "chat.forward.cant_send_to": "Haiwezi kusambazwa kwa {name}",
  "chat.forward.channels": "Vituo",
  "chat.forward.groups": "Vikundi",
  "chat.forward.locations": "Mahali",
  "chat.forward.dms": "Jumbe za moja kwa moja",
  "chat.forward.none": "Bado hakuna gumzo lingine",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Inaanzisha mesh…",
  "mesh.banner.no_bluetooth":
    "Hakuna Bluetooth kwenye kifaa hiki · intaneti pekee",
  "mesh.banner.bluetooth_off": "Bluetooth imezimwa · mesh haipatikani",
  "mesh.banner.permission_needed": "Ruhusa ya Bluetooth inahitajika",
  "mesh.banner.blocked": "Bluetooth imezuiwa · iruhusu kwenye Mipangilio",
  "mesh.banner.location_permission": "Mahali panahitajika ili kupata peer",
  "mesh.banner.advertising_unsupported":
    "Simu hii inaweza kuwaona wengine lakini haiwezi kugunduliwa",
  "mesh.banner.location_off_android":
    "Mahali pamezimwa · Android inapahitaji ili kupata peer",
  "mesh.banner.paused": "Mesh imesitishwa · hupo",
  "mesh.banner.location_off":
    "Mahali pamezimwa · vituo vya mahali havipatikani",
  "mesh.banner.battery_saver": "Kiokoa betri · inachanganua mara chache zaidi",
  "mesh.banner.wipe_incomplete":
    "Ufutaji haujakamilika · baadhi ya data huenda ikabaki, itajaribiwa tena wakati wa kufungua upya",
  "mesh.banner.wifi_off": "Wi-Fi imezimwa · faili kubwa hutumwa polepole zaidi",
  "mesh.banner.clock_skew":
    "Saa ya simu hii si sahihi · weka tarehe na saa kuwa otomatiki",
  "mesh.banner.internet_off": "Intaneti imezimwa · Bluetooth pekee",
  "mesh.banner.relaying": "Hakuna peer karibu · inapitisha kupitia Nostr",
  "mesh.banner.tor": "Tor imewashwa · trafiki ya intaneti inaelekezwa",
  "mesh.banner.tor_starting": "Inaanzisha Tor · inaunganisha",
  "mesh.banner.tor_blocked":
    "Tor haikuweza kuunganisha · mesh bado inafanya kazi",
  "mesh.banner.gateway":
    "Lango la intaneti limewashwa · linapitisha kwa ajili ya peer walio karibu",
  "mesh.banner.bridge":
    "Daraja la mesh limewashwa · gumzo la umma limeunganishwa",
  "mesh.banner.background_limits": "{brand} inaweza kusitisha mesh chinichini",
  "mesh.banner.bridge_across":
    "Daraja la mesh limewashwa · {count} ng'ambo ya daraja",
  "mesh.banner.action.turn_on": "Washa",
  "mesh.banner.action.allow": "Ruhusu",
  "mesh.banner.action.resume": "Endelea",
  "mesh.banner.action.fix": "Rekebisha",
  "mesh.banner.hint.resume":
    "Huwasha tena utangazaji na uchanganuzi wa Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Huiomba Android iwashe Bluetooth",
  "mesh.banner.hint.location_settings":
    "Hufungua mipangilio ya mahali ya mfumo",
  "mesh.banner.hint.app_settings":
    "Hufungua ruhusa za Airhop kwenye mipangilio ya mfumo",
  "mesh.banner.hint.battery_settings":
    "Hufungua mipangilio ya shughuli za chinichini za simu hii",
  "mesh.banner.dismiss": "Ondoa: {label}",
  "mesh.banner.hint.dismiss": "Huficha noti hii kabisa",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Inatafuta peer walio karibu…",
  "mesh.radar.starting": "Inaanzisha mesh…",
  "mesh.radar.no_bluetooth": "Hakuna Bluetooth kwenye kifaa hiki",
  "mesh.radar.bluetooth_off": "Bluetooth imezimwa · haichanganui",
  "mesh.radar.permission_needed": "Ruhusa ya Bluetooth inahitajika",
  "mesh.radar.blocked": "Bluetooth imezuiwa",
  "mesh.radar.location_permission": "Ruhusa ya mahali inahitajika",
  "mesh.radar.location_off": "Mahali pamezimwa · haichanganui",
  "mesh.radar.hint_rings": "Pete zinaonyesha nguvu ya ishara ya BLE, si umbali",
  "mesh.radar.hint_checking": "Inakagua Bluetooth na ruhusa",
  "mesh.radar.hint_internet": "Jumbe bado husafiri kupitia intaneti",
  "mesh.radar.hint_turn_on": "Washa Bluetooth ili kugundua peer",
  "mesh.radar.hint_allow": "Ruhusu Bluetooth ili kugundua peer",
  "mesh.radar.hint_allow_settings":
    "Ruhusu Bluetooth kwenye Mipangilio ili kugundua peer",
  "mesh.radar.hint_location_permission":
    "Android 11 na za zamani zaidi zinahitaji mahali ili kuchanganua kupitia Bluetooth",
  "mesh.radar.hint_android_location":
    "Android inahitaji mahali pawe pamewashwa ili kurudisha matokeo ya uchanganuzi wa Bluetooth",
  "mesh.radar.signal_strong": "Kali",
  "mesh.radar.signal_medium": "Wastani",
  "mesh.radar.signal_weak": "Dhaifu",
  "mesh.radar.you_center": "Wewe, katikati ya mesh",
  "mesh.radar.sonar_hint":
    "Hucheza mzunguko wa sonar. Uchanganuzi tayari unaendelea bila kukoma.",
  "mesh.radar.paused": "Mesh imesitishwa · hupo",
  "mesh.radar.ring_hint":
    "Nafasi kwenye pete inaonyesha nguvu ya ishara, si umbali",
  "mesh.radar.set_online":
    "Weka hali yako kuwa Mtandaoni kwenye kichupo cha Wewe ili kugundua peer",
  "mesh.radar.in_range": "ndani ya masafa",
  "mesh.radar.recently_seen": "walioonekana hivi karibuni",
  "mesh.radar.peer_hint":
    "Hufungua chaguo za kumtumia ujumbe au kumlipa peer huyu",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "sasa hivi",
  "mesh.peer.none": "Hakuna peer karibu",
  "mesh.peer.none_desc":
    "Vifaa vingine vyenye Airhop au bitchat vilivyo ndani ya masafa ya Bluetooth huonekana hapa.",
  "mesh.peer.id_copied": "Kitambulisho cha peer kimenakiliwa",
  "mesh.peer.copy_id": "Nakili kitambulisho cha peer",
  "mesh.peer.their_name": "Anajiita {name}",
  "mesh.peer.in_range": "Ndani ya masafa",
  "mesh.peer.relay": "Nodi ya relay",
  "mesh.peer.relay_body":
    "Redio ambayo mtu aliiacha ikiendelea ili kupanua mesh. Hubeba jumbe ambazo haiwezi kuzisoma. Hakuna mtu hapa wa kumtumia ujumbe.",
  "mesh.peer.send_dm": "Tuma ujumbe wa moja kwa moja",
  "mesh.peer.message": "Ujumbe",
  "mesh.peer.send_sats": "Tuma ecash",
  "mesh.peer.amount_placeholder": "Kiasi katika sat",
  "mesh.peer.amount_first": "Tuma ecash, weka kiasi kwanza",
  "mesh.peer.cancel_send": "Ghairi kutuma ecash",
  "mesh.peer.view_peer": "Tazama peer {name}",
  "mesh.peer.view_peer_online": "Tazama peer {name}, yuko mtandaoni",
  "mesh.peer.last_seen": "Alionekana mwisho {ago} zilizopita",
  "mesh.peer.send_amount": "Tuma sat {amount}",
  "mesh.peer.direct": "Muunganisho wa moja kwa moja",
  "mesh.peer.check_distance": "Kagua umbali",
  "mesh.peer.checking": "Inakagua",
  "mesh.peer.no_reply": "Hakuna jibu",
  "mesh.peer.no_reply_hint": "Huenda wamehama, au programu yao haijibu",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Kanda",
  "mesh.level.province": "Mkoa",
  "mesh.level.city": "Jiji",
  "mesh.level.neighborhood": "Mtaa",
  "mesh.level.block": "Kitalu cha jiji",
  "mesh.level.building": "Jengo",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Inayoweza kutumika",
  "wallet.balance.unit_hint": "Hubadilisha kati ya satoshi na bitcoin",
  "wallet.balance.a11y": "Salio {value} {unit}",
  "wallet.balance.locked":
    "Hifadhi ya pochi imefungwa. Thibitisho za ecash huwekwa kwenye faili iliyosimbwa ambayo ufunguo wake upo kwenye kihifadhi funguo cha kifaa, na haikuweza kufunguliwa. Fungua kifaa chako kisha ufungue Airhop tena.",
  "wallet.balance.tor_blocked":
    "Tor imewashwa, kwa hivyo maombi ya mint yamezuiwa: yangepita kwenye mtandao wazi na kuunganisha IP yako na thibitisho zako. Kutuma na kupokea kupitia mesh bado kunafanya kazi. Ruhusu trafiki ya mint chini ya Mipangilio, Usalama.",
  "wallet.balance.unconfirmed_note": "{amount} bado haijathibitishwa na mint",
  "wallet.balance.reserved_note":
    "{amount} imetengwa kwa ajili ya utumaji unaoendelea",
  "wallet.balance.other_mint_note": "{amount} kwenye mint nyingine",
  "wallet.balance.test_mint_note":
    "Inajumuisha pesa za mchezo kutoka mint ya majaribio. Si bitcoin na haiwezi kutolewa kama fedha.",
  "wallet.token": "Tokeni",
  "wallet.action.send": "Tuma tokeni ya ecash",
  "wallet.action.send_disabled":
    "Tuma tokeni ya ecash, haipatikani salio likiwa tupu",
  "wallet.action.receive": "Pokea tokeni ya ecash",
  "wallet.action.zap": "Mtumie zap anwani ya Nostr",
  "wallet.action.zap_disabled":
    "Mtumie zap anwani ya Nostr, haipatikani salio likiwa tupu",
  "wallet.action.add_mint": "Ongeza mint ya Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Tokeni haikuweza kutengenezwa",
  "wallet.send.title": "Tuma ecash",
  "wallet.send.amount_in": "Kiasi katika {unit}",
  "wallet.send.body":
    "Imetengenezwa nje ya mtandao kutoka thibitisho ulizo nazo tayari. Hakuna kinachoondoka kwenye salio lako kabisa hadi uthibitishe kuwa tokeni imefika.",
  "wallet.send.stale_fee_note":
    "Ada zilikaguliwa mwisho siku {days} zilizopita. Kama mint hii imeziongeza tangu wakati huo, utumaji unaweza kugharimu kidogo zaidi.",
  "wallet.send.fee_note":
    "{spend} {unit} zitaondoka kwenye salio lako; {fee} za ziada hulipia ada ya mint ambayo wangeilipa wao",
  "wallet.send.qr_too_big":
    "Tokeni hii imegawanywa kwenye sarafu nyingi mno kiasi kwamba haiwezi kutoshea kwenye msimbo wa QR. Ishiriki au inakili badala yake, au sasisha kwenye mint ili kuziunganisha.",
  "wallet.send.bearer_note":
    "Yeyote anayeshikilia mfuatano huu ndiye anayemiliki pesa. Thibitisho zimetengwa, hazijatumika: kama haitamfikia mtu yeyote unaweza kuzirudisha chini ya Zinazosubiri.",
  "wallet.send.qr_too_big_short":
    "Tokeni hii imegawanywa kwenye sarafu nyingi mno kiasi kwamba haiwezi kutoshea kwenye msimbo wa QR. Ishiriki au inakili badala yake.",
  "wallet.send.scan_note":
    "Waache waichanganue hii kutoka pochi yao. Bado inaweza kurudishwa hadi utakapoiweka alama kuwa imefika.",
  "wallet.send.mesh_note":
    "Tokeni hutoka kama ujumbe wa moja kwa moja uliosimbwa kupitia mesh. Hakuna intaneti inayohitajika.",
  "wallet.send.no_peers_note":
    "Fungua kichupo cha Mesh ili kupata vifaa vilivyo karibu, au shiriki tokeni kwa njia nyingine.",
  "wallet.send.send_to": "Tuma kwa {name}",
  "wallet.send.memo": "Dokezo (si lazima, husafiri pamoja na tokeni)",
  "wallet.send.building": "Inatengeneza…",
  "wallet.send.build": "Tengeneza tokeni",
  "wallet.send.inexact_body":
    "Thibitisho zako haziwezi kutoa {amount} {unit} kamili nje ya mtandao. Tokeni ndogo zaidi unayoweza kutengeneza ni {spend} {unit}, na nje ya mtandao hakuna chenji: {extra} {unit} za ziada zitamwendea mpokeaji.\n\nKusasisha kwenye mint ukiwa mtandaoni kungegawanya thibitisho zako kwenye vipande vinavyotoshea sawasawa.",
  "wallet.send.send_amount": "Tuma {amount}",
  "wallet.send.sent_to": "{amount} {unit} zimetumwa kwa {name}",
  "wallet.send.sent_to_body":
    "{route} Bado inaweza kurudishwa chini ya Zinazosubiri hadi uthibitishe kuwa wameipata, au hadi mint itakapotuambia kuwa thibitisho zimekombolewa.",
  "wallet.send.copy_token": "Nakili tokeni",
  "wallet.send.share_token": "Shiriki tokeni",
  "wallet.send.open_in_wallet": "Fungua tokeni hii kwenye pochi nyingine",
  "wallet.send.open_in_wallet_short": "Fungua kwenye pochi",
  "wallet.send.to_peer": "Tuma tokeni kwa peer aliye karibu",
  "wallet.send.to_peer_short": "Tuma kwa peer",
  "wallet.send.mark_delivered": "Weka alama kuwa imefika na umalize",
  "wallet.send.they_got_it": "Wameipata",
  "wallet.send.keep_pending": "Acha utumaji huu ukisubiri",
  "wallet.send.decide_later": "Amua baadaye",
  "wallet.send.no_peers": "Hakuna peer ndani ya masafa",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Haya ni malipo yako mwenyewe",
  "wallet.receive.own_payment_body":
    "Sarafu hizi bado zimetengwa kwa ajili ya utumaji ambao hujaumaliza, kwa hivyo hakuna cha kudai. Tumia Rudisha kwenye malipo hayo ili kuzirudisha moja kwa moja kwenye salio lako.",
  "wallet.receive.already_have": "Tayari ipo kwenye pochi yako",
  "wallet.receive.already_have_body":
    "Kila uthibitisho kwenye tokeni hii tayari umehifadhiwa hapa, kwa hivyo hakuna kilichoongezwa. Masalio hayajabadilika.",
  "wallet.receive.stored_unconfirmed":
    "Imehifadhiwa kutoka {mint}, lakini bado haijathibitishwa na mint ({reason}).",
  "wallet.receive.offline": "nje ya mtandao",
  "wallet.receive.redeemed_here":
    "Imekombolewa kwenye {mint}. Thibitisho hizi sasa ni zako pekee: nakala ya mtumaji haifanyi kazi tena.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Imekombolewa kwenye {mint}. Sasa ni yako kwa uthibitisho: nakala ya tokeni hii aliyo nayo mtumaji haifanyi kazi tena.",
  "wallet.receive.stored_pending":
    "Imehifadhiwa kutoka {mint}, lakini mint bado haijathibitisha kuwa haijatumika{dleq}. Sasisha kutoka kichupo cha Pochi utakapokuwa mtandaoni.",
  "wallet.receive.dleq_inline":
    " (saini yake inalingana, kwa hivyo tokeni ni halisi)",
  "wallet.receive.dleq_ok":
    "Saini ya mint inalingana, kwa hivyo tokeni ni halisi.",
  "wallet.receive.dleq_uncached":
    "Funguo za mint hazipo hapa, kwa hivyo saini haikuweza kukaguliwa nje ya mtandao.",
  "wallet.receive.dleq_warning":
    "Hadi utakaposasisha ukiwa mtandaoni, kimsingi mtumaji anaweza kuwa ameitumia mahali pengine.",
  "wallet.receive.failed": "Haikuweza kupokelewa",
  "wallet.receive.title": "Pokea ecash",
  "wallet.receive.body":
    "Bandika tokeni ya Cashu. Ukiwa mtandaoni hukombolewa kwenye mint papo hapo; nje ya mtandao huhifadhiwa na kuthibitishwa utakaposasisha tena.",
  "wallet.receive.scan": "Changanua msimbo wa QR wa ecash",
  "wallet.receive.scan_short": "Changanua QR",
  "wallet.receive.receiving": "Inapokea…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap imepokelewa kutoka {from}… na kukombolewa kwenye pochi yako.",
  "wallet.zap.title": "Tuma zap kwa utambulisho wa Nostr",
  "wallet.zap.not_npub": "si npub",
  "wallet.zap.bad_key": "ufunguo mbaya",
  "wallet.zap.invalid_pubkey": "Ufunguo wa umma si sahihi",
  "wallet.zap.invalid_pubkey_body":
    "Weka npub1… au ufunguo wa umma wa Nostr wa herufi 64 za hex.",
  "wallet.zap.sent": "Nutzap imetumwa",
  "wallet.zap.failed": "Zap imeshindwa",
  "wallet.zap.body":
    "Kama wanachapisha taarifa za nutzap za NIP-61, ecash hufungwa kwenye ufunguo wao ili mtu mwingine asiweze kuitumia, na haiwezi kurudishwa. Kama hawachapishi, hutumwa kama tokeni inayoweza kurudishwa. Utaambiwa lipi lililotokea.",
  "wallet.zap.contact": "Mtumie zap {name}",
  "wallet.zap.pubkey_placeholder": "npub1… au herufi 64 za hex",
  "wallet.zap.sending": "Inatuma…",
  "wallet.nostr.copied_body":
    "Mpe mtu hii na anaweza kukutumia zap kutoka Airhop au pochi nyingine yoyote ya Nostr, bila kuhitaji Bluetooth.",
  "wallet.nostr.copy_key":
    "Nakili ufunguo wako wa Nostr ili watu waweze kukutumia zap",
  "wallet.nostr.your_key": "Ufunguo wako wa Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint imeongezwa",
  "wallet.mint.add_failed": "Mint haikuweza kuongezwa",
  "wallet.mint.added_named": "{name} imeongezwa",
  "wallet.mint.added_body":
    "{mint} hutoa {units}. Funguo zake zimehifadhiwa kwenye kifaa hiki, kwa hivyo tokeni zitokazo kwake sasa zinaweza kukaguliwa hata bila intaneti.",
  "wallet.mint.remove_plain":
    "Uondoe {mint} kwenye pochi yako? Funguo zake zilizohifadhiwa nazo zitaondoka, kwa hivyo tokeni zitokazo kwake hazitaweza kukaguliwa nje ya mtandao.",
  "wallet.mint.title": "Mint",
  "wallet.mint.none": "Bado hakuna mint",
  "wallet.mint.none_desc":
    "Mint hutoa na kukomboa ecash yako. Ongeza moja ili kuweka amana kupitia Lightning, au pokea tu tokeni na mint yake itaongezwa kwa ajili yako.",
  "wallet.mint.add": "Ongeza mint",
  "wallet.mint.add_body":
    "Mint hushikilia Bitcoin inayoshikilia thamani ya ecash yako, kwa hivyo chagua ile ambayo ungeiamini na salio unaloliweka hapo. URL hukaguliwa kabla ya kuhifadhiwa. Endesha yako mwenyewe kwa Nutshell kama huoni haja ya kumwamini mtu yeyote.",
  "wallet.mint.consolidate_body":
    "Tokeni inaweza kutaja mint moja tu kila wakati, kwa hivyo salio lililotawanyika kwenye mint kadhaa haliwezi kulipa kiasi kikubwa kuliko kile ambacho kubwa zaidi inashikilia. Airhop inaweza kulihamisha: kila mint nyingine hulipa ankara ya Lightning iliyotolewa na ile uliyochagua. Hugharimu ada ndogo ya uelekezaji na huhitaji intaneti.",
  "wallet.mint.add_short": "Ongeza mint",
  "wallet.mint.checking": "Inakagua…",
  "wallet.mint.remove_with_balance": "Uondoe mint yenye salio?",
  "wallet.mint.remove": "Ondoa mint",
  "wallet.mint.delete_anyway": "Futa hata hivyo",
  "wallet.mint.consolidate": "Hamisha masalio yote kwenye mint moja",
  "wallet.mint.confirm_with": "Thibitisha thibitisho na {mint}",
  "wallet.mint.remove_a11y": "Ondoa {mint}",
  "wallet.mint.available_amount": "{amount} {unit} zinapatikana",
  "wallet.mint.split_across":
    "Salio limegawanywa kwenye mint {count}. Lihamishie kwenye moja.",
  "wallet.mint.move_everything_to": "Hamisha kila kitu kwenda {mint}",
  "wallet.mint.consolidate_title": "Hamishia kwenye mint moja",
  "wallet.mint.moving": "Inahamisha…",
  "wallet.mint.move": "Hamisha",
  "wallet.mint.moved": "Imehamishwa",
  "wallet.mint.moved_body":
    "{amount} {unit} sasa zipo kwenye {mint}, baada ya {fees} {unit} za ada za uelekezaji za Lightning.",
  "wallet.mint.nothing_moved": "Hakuna kilichohamishwa",
  "wallet.mint.destination": "· lengwa",
  "wallet.mint.will_move": "· itahamishwa",
  "wallet.mint.issued_by": "Imetolewa na",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Kujaza pochi ya Airhop",
  "wallet.ln.invoice_failed": "Ankara haikuweza kutengenezwa",
  "wallet.ln.price_failed": "Ankara hii haikuweza kupangiwa bei",
  "wallet.ln.paid": "Imelipwa",
  "wallet.ln.deposit_credited":
    "Ankara imelipwa na {amount} {unit} zimetolewa na {mint}. Salio hili limethibitishwa: unaweza kulitumia nje ya mtandao mara moja.",
  "wallet.ln.withdrawn":
    "Sat {paid} zimelipwa kupitia Lightning. Mint ilitoza sat {fee} kama ada za uelekezaji.",
  "wallet.ln.withdrawn_with_change":
    "Sat {paid} zimelipwa kupitia Lightning. Mint ilitoza sat {fee} kama ada za uelekezaji, na kurudisha sat {change} za akiba kwenye salio lako.",
  "wallet.ln.payment_failed": "Malipo yameshindwa",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Geuza sat za Lightning kuwa ecash unayoweza kutumia nje ya mtandao, au toa ecash kwenye ankara yoyote ya Lightning. Vyote viwili vinahitaji intaneti na mint.",
  "wallet.ln.deposit_body":
    "Mint hukupa ankara. Ilipe kutoka pochi yoyote ya Lightning na sat zitarudi kama ecash unayoweza kutumia nje ya mtandao.",
  "wallet.ln.pay_invoice_for":
    "Lipa ankara hii ya {amount} {unit}. Pochi inasubiri malipo na itatoa ecash yako yenyewe.",
  "wallet.ln.expired_body":
    "Ankara hii imekwisha muda. Kama tayari umeilipa, salio huwekwa kiotomatiki.",
  "wallet.ln.waiting_expires":
    "Inasubiri malipo · itakwisha muda baada ya {countdown}",
  "wallet.ln.withdraw_body":
    "Bandika ankara ya bolt11 na mint itailipa kutoka ecash yako. Utaambiwa akiba ya uelekezaji kwanza; kile ambacho uelekezaji hautumii hurudi kwenye salio lako.",
  "wallet.ln.up_to": "hadi {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Lipa {amount} {unit}",
  "wallet.ln.deposit": "Weka amana ya sat kupitia Lightning",
  "wallet.ln.deposit_short": "Weka amana",
  "wallet.ln.withdraw": "Toa kwenye ankara ya Lightning",
  "wallet.ln.withdraw_short": "Toa",
  "wallet.ln.deposit_title": "Weka amana kupitia Lightning",
  "wallet.ln.amount_placeholder": "Kiasi katika sat",
  "wallet.ln.requesting": "Inaomba…",
  "wallet.ln.get_invoice": "Pata ankara",
  "wallet.ln.copy_invoice": "Nakili ankara",
  "wallet.ln.open_wallet": "Fungua kwenye pochi ya Lightning",
  "wallet.ln.open_wallet_short": "Fungua kwenye pochi",
  "wallet.ln.waiting": "Inasubiri malipo…",
  "wallet.ln.new_invoice": "Tengeneza ankara mpya",
  "wallet.ln.new_invoice_short": "Ankara mpya",
  "wallet.ln.withdraw_title": "Toa kwenda Lightning",
  "wallet.ln.scan_invoice": "Changanua msimbo wa QR wa ankara ya Lightning",
  "wallet.ln.paid_from": "Imelipwa kutoka",
  "wallet.ln.invoice": "Ankara",
  "wallet.ln.routing_reserve": "Akiba ya uelekezaji",
  "wallet.ln.reserved": "Imetengwa kutoka salio",
  "wallet.ln.paying": "Inalipa…",
  "wallet.ln.get_quote": "Pata bei",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Nakala rudufu",
  "wallet.backup.setup_failed": "Nakala rudufu haikuweza kuwekwa",
  "wallet.backup.on": "Nakala rudufu imewashwa",
  "wallet.backup.on_body":
    "Salio lako sasa linaweza kujengwa upya kutoka maneno hayo kumi na mawili.\n\nChochote ulichopewa na mtu mwingine hubaki nje ya kifungu hicho hadi usasishe kwenye mint, na urejeshaji unahitaji orodha yako ya mint, kwa hivyo iandike kando ya maneno hayo.",
  "wallet.backup.no_phrase": "Hakuna kifungu kilichohifadhiwa",
  "wallet.backup.no_phrase_body":
    "Kifungu cha urejeshaji hakikuweza kusomwa kutoka kihifadhi funguo cha kifaa. Fungua kifaa kisha ujaribu tena.",
  "wallet.backup.replace_title": "Ubadilishe kifungu chako cha sasa?",
  "wallet.backup.replace_body":
    "Tayari una kifungu cha urejeshaji. Kurejesha kingine hukibadilisha. Sarafu ambazo kifungu cha zamani kilizishikilia zitaendelea kutumika kwenye kifaa hiki, lakini hazitaweza kurejeshwa, kwa hivyo hakikisha maneno ya zamani yameandikwa kabla ya kuendelea.",
  "wallet.backup.replace": "Badilisha",
  "wallet.backup.invalid_phrase": "Kifungu hicho si sahihi",
  "wallet.backup.invalid_phrase_body":
    "Kifungu kina alama ya ukaguzi ndani yake na hiki hakiipiti. Tafuta neno lililoandikwa vibaya, lililokosekana, au lililobadilishwa nafasi.",
  "wallet.backup.not_bip39":
    "Haya si maneno ya BIP-39: {words}. Kagua tahajia.",
  "wallet.backup.add_mint_first": "Ongeza mint kwanza",
  "wallet.backup.add_mint_first_body":
    "Urejeshaji hufanya kazi kwa kuuliza mint ni sarafu zipi ilizokutia saini, kwa hivyo unahitaji kujua ni mint gani ya kuuliza. Ongeza mint ulizokuwa ukitumia, kisha urejeshe.",
  "wallet.backup.restore_failed": "Urejeshaji umeshindwa",
  "wallet.backup.phrase": "Kifungu cha urejeshaji",
  "wallet.backup.state_unconfirmed":
    "Nakala rudufu imewashwa lakini haijathibitishwa",
  "wallet.backup.state_off": "Nakala rudufu imezimwa",
  "wallet.backup.badge_on": "Imewashwa",
  "wallet.backup.badge_unconfirmed": "Haijathibitishwa",
  "wallet.backup.badge_off": "Imezimwa",
  "wallet.backup.view": "Tazama kifungu cha urejeshaji",
  "wallet.backup.setup": "Weka kifungu cha urejeshaji",
  "wallet.backup.view_short": "Tazama kifungu",
  "wallet.backup.setup_short": "Weka",
  "wallet.backup.restore": "Rejesha pochi kutoka kifungu cha urejeshaji",
  "wallet.backup.restore_short": "Rejesha",
  "wallet.backup.setup_title": "Weka kifungu cha urejeshaji",
  "wallet.backup.on_body_short":
    "Salio lako linaweza kujengwa upya kwenye kifaa kipya kutoka maneno yako kumi na mawili.",
  "wallet.backup.unconfirmed_body":
    "Hujawahi kuthibitisha kuwa umeandika nakala. Kwa sasa maneno yapo kwenye simu hii tu, na hilo ndilo hasa jambo ambalo nakala rudufu inapaswa kulinusurika. Tazama kifungu na ukiandike.",
  "wallet.backup.not_covered":
    "{amount} bado hazijashikiliwa. Sarafu ulizopewa hubeba siri za yeyote aliyezituma, kwa hivyo huingia chini ya kifungu chako tu zikishabadilishwa. Sasisha mint ili kuzilinda.",
  "wallet.backup.off_body":
    "Ecash yako ipo kwenye simu hii tu. Ukiipoteza, hakuna anayeweza kurejesha pesa, wewe ukiwemo. Kifungu cha urejeshaji ni maneno kumi na mawili yanayoweza kujenga upya salio lako popote.",
  "wallet.backup.about_to_see":
    "Karibu uone maneno kumi na mawili. Hayo ndiyo pesa.",
  "wallet.backup.exact_order":
    "Maneno kumi na mawili, katika mpangilio huu hasa. Yeyote aliye nayo ana salio lako.",
  "wallet.backup.verify_body":
    "Kifungu ambacho hakuna aliyekiandika ni kibaya kuliko kutokuwa na kifungu, kwa sababu kinaonekana kama wavu wa usalama ambao haupo. Maneno mawili ya kuthibitisha.",
  "wallet.backup.verify_mismatch":
    "Hilo halilingani. Kagua nakala yako iliyoandikwa.",
  "wallet.backup.restore_body":
    "Weka maneno kumi na mawili. Airhop hutoa upya sarafu zako na kuuliza kila mint ni zipi ilizotia saini, kwa hivyo salio hurudi kutoka kumbukumbu zinazohifadhiwa na mint.",
  "wallet.backup.warn_secret":
    "Yeyote anayeyasoma anaweza kuchukua salio lako. Usiyapige picha ya skrini wala usiyahifadhi kwenye simu hii.",
  "wallet.backup.warn_paper":
    "Yaandike kwenye karatasi na uyaweke mahali salama. Airhop haiwezi kukuonyesha tena simu ikipotea.",
  "wallet.backup.warn_scope":
    "Hujenga upya ecash yako pekee. Utambulisho, gumzo na anwani zako hazishikiliwi.",
  "wallet.backup.warn_mints":
    "Urejeshaji lazima uulize mint ni sarafu zipi ilizotia saini, kwa hivyo andika orodha yako ya mint kando ya maneno hayo.",
  "wallet.backup.preparing": "Inaandaa…",
  "wallet.backup.show_phrase": "Onyesha kifungu changu",
  "wallet.backup.your_phrase": "Kifungu chako cha urejeshaji",
  "wallet.backup.write_down": "Yaandike haya",
  "wallet.backup.copy_phrase":
    "Nakili kifungu cha urejeshaji kwenye ubao wa kunakili",
  "wallet.backup.copy_clipboard": "Nakili kwenye ubao wa kunakili",
  "wallet.backup.written_down": "Nimeyaandika",
  "wallet.backup.check_copy": "Kagua nakala yako",
  "wallet.backup.confirm": "Thibitisha",
  "wallet.backup.restore_title": "Rejesha kutoka kifungu",
  "wallet.backup.phrase_placeholder":
    "maneno kumi na mawili, yaliyotenganishwa kwa nafasi",
  "wallet.backup.no_mints_yet":
    "Bado hakuna mint iliyoongezwa. Urejeshaji lazima uulize mint mahususi, kwa hivyo ongeza kwanza zile ulizokuwa ukitumia.",
  "wallet.backup.scanning": "Inachanganua…",
  "wallet.backup.restore_progress":
    "{mint} · seti ya funguo {step} kati ya {total}",
  "wallet.backup.will_scan":
    "Zitachanganuliwa: {mints}. Mint ambayo hujaiongeza haiulizwi kamwe, kwa hivyo salio lake hubaki halionekani.",
  "wallet.backup.word_n": "Neno {position}",
  "wallet.backup.unreachable_mints":
    "Hazikufikika: {mints}. Salio lolote lililopo huko bado lipo. Jaribu tena ukiwa na muunganisho bora zaidi.",
  "wallet.backup.nothing_recovered":
    "Hakuna kilichorejeshwa kutoka mint zilizochanganuliwa.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Uweke alama kuwa imepokelewa?",
  "wallet.delivered.body":
    "Hii huachia {amount} {unit} kabisa. Kama hazikufika kamwe, hutaweza kuzirudisha.",
  "wallet.delivered.body_generic":
    "Hii huachia kiasi kilichotengwa kabisa. Kama hakikufika kamwe, hutaweza kukirudisha.",
  "wallet.delivered.cancel": "Bado",
  "wallet.delivered.confirm": "Wameipata",
  "wallet.reclaim.title": "Urudishe tokeni hii?",
  "wallet.reclaim.body":
    "{amount} {unit} zitarudi kwenye salio lako. Fanya hivi tu kama tokeni haikumfikia mtu yeyote: kama tayari wana mfuatano huo, yeyote anayeikomboa kwenye mint kwanza ndiye anayeshikilia pesa, na huenda wakawa wao.",
  "wallet.reclaim.keep": "Acha ikisubiri",
  "wallet.reclaim.confirm": "Rudisha",
  "wallet.copied.token_body":
    "Tokeni ipo kwenye ubao wako wa kunakili. Hubaki imetengwa hapa hadi utakapoiweka alama kuwa imefika, kwa hivyo unaweza kuibandika tena kama jaribio la kwanza litashindwa.",
  "wallet.copied.phrase_body":
    "Kibandike kwenye kidhibiti cha nenosiri, kisha futa ubao wako wa kunakili. Programu nyingine zinaweza kusoma ubao wa kunakili, na kwenye baadhi ya mipangilio husawazishwa na vifaa vyako vingine.",
  "wallet.refresh.failed": "Kusasisha kumeshindwa",
  "wallet.refresh.partly": "Imesasishwa kwa sehemu",
  "wallet.refresh.done": "Imesasishwa",
  "wallet.refresh.unreachable":
    "Haikuweza kufikia {mints}. Kila kitu kingine kipo sawa.",
  "wallet.refresh.swapped":
    "{amount} {unit} zimethibitishwa na kubadilishwa kwa thibitisho mpya.",
  "wallet.refresh.secured":
    "{amount} {unit} sasa zinashikiliwa na kifungu chako cha urejeshaji.",
  "wallet.refresh.all_confirmed":
    "Kila kilichopo hapa tayari kilikuwa kimethibitishwa na mint.",
  "wallet.pending.title": "Zinazosubiri",
  "wallet.pending.reserved_desc":
    "Imetengenezwa na kutengwa, ufikishaji haujathibitishwa. Thibitisho hushikiliwa nje ya salio lako ili zisitumike mara mbili.",
  "wallet.pending.locked_desc":
    "Tayari imefungwa kwenye ufunguo wa mpokeaji, kwa hivyo yeye pekee anaweza kuitumia. Ni kwamba tu bado haijamfikia. Shiriki tokeni ili kumaliza.",
  "wallet.pending.show_qr": "Onyesha tokeni hii kama msimbo wa QR",
  "wallet.pending.copy_again": "Nakili tokeni tena",
  "wallet.pending.share_again": "Shiriki tokeni tena",
  "wallet.pending.mark_delivered": "Weka alama kuwa tokeni hii imefika",
  "wallet.pending.delivered": "Imefika",
  "wallet.pending.reclaim_into": "Rudisha tokeni hii kwenye salio lako",
  "wallet.activity.title": "Shughuli",
  "wallet.activity.none": "Bado hakuna kitu",
  "wallet.activity.none_desc":
    "Malipo unayotuma na kupokea huonekana hapa, mapya kwanza, pamoja na mint na ada ya kila moja.",
  "wallet.activity.show_fewer": "Onyesha malipo machache zaidi",
  "wallet.activity.show_less": "Onyesha kidogo",
  "wallet.activity.received_unconfirmed": "Yamepokelewa, hayajathibitishwa",
  "wallet.activity.received": "Yamepokelewa",
  "wallet.activity.receive_failed": "Kupokea kumeshindwa",
  "wallet.activity.reclaimed": "Yamerudishwa",
  "wallet.activity.send_failed": "Kutuma kumeshindwa",
  "wallet.activity.sent": "Yametumwa",
  "wallet.activity.status_pending": "yanasubiri",
  "wallet.activity.status_failed": "yameshindwa",
  "wallet.activity.status_reclaimed": "yamerudishwa",
  "wallet.activity.status_expired": "yamekwisha muda",
  "wallet.activity.ln_deposit": "Amana ya Lightning",
  "wallet.activity.ln_withdrawal": "Utoaji wa Lightning",
  "wallet.activity.nutzap_received": "Nutzap imepokelewa",
  "wallet.activity.spent_removed": "Thibitisho zilizotumika zimeondolewa",
  "wallet.activity.refreshed": "Thibitisho zimesasishwa",
  "wallet.activity.refreshing": "Inasasisha thibitisho",
  "wallet.activity.just_now": "sasa hivi",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh haipo mtandaoni",
  "wallet.mesh_offline_body":
    "Huduma ya mesh haiendeshwi, kwa hivyo hakuna wa kumkabidhi tokeni. Hubaki imetengwa chini ya Zinazosubiri.",
  "wallet.xfer.route_mesh":
    "Imekabidhiwa moja kwa moja kwa kifaa chao kupitia mesh.",
  "wallet.xfer.route_nostr":
    "Walikuwa nje ya masafa ya Bluetooth, kwa hivyo ilipita kwenye intaneti badala yake.",
  "wallet.xfer.route_courier":
    "Hakuna njia ya kuwafikia kwa sasa. Vifaa vingine vitaibeba na kuifikisha mojawapo litakapowafikia.",
  "wallet.xfer.route_queued":
    "Bado hawafikiki. Ipo kwenye foleni na itatoka mara tu watakapofikika.",
  "wallet.xfer.mesh_offline_body":
    "Huduma ya mesh haiendeshwi, kwa hivyo hakuna njia ya kukabidhi tokeni. Hakuna kilichopunguzwa.",
  "wallet.xfer.could_not_send": "Haikuweza kutumwa",
  "wallet.xfer.inexact_body":
    "Thibitisho zako haziwezi kutoa {amount} {unit} kamili nje ya mtandao. Tokeni ndogo zaidi unayoweza kutengeneza ni {spend} {unit}, na {extra} {unit} za ziada zitawaendea bila njia ya kuzirudisha.\n\nKusasisha kwenye mint ukiwa mtandaoni hugawanya thibitisho zako kwenye vipande vinavyotoshea sawasawa.",
  "wallet.xfer.send_amount": "Tuma {amount}",
  "wallet.xfer.mesh_offline": "Mesh haipo mtandaoni",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Imefungwa kwenye ufunguo wao na kuchapishwa kwenye Nostr. Ni yao wawe mtandaoni au la.",
  "wallet.pay.rail_nutzap_dm":
    "Imefungwa kwenye ufunguo wao. Relay haikuikubali, kwa hivyo iliwaendea kama ujumbe badala yake.",
  "wallet.pay.rail_nutzap_undelivered":
    "Imefungwa kwenye ufunguo wao, lakini bado hakuna kilichoweza kuibeba. Ipo kwenye foleni, na tokeni ipo chini ya Zinazosubiri.",
  "wallet.pay.final":
    "Malipo yaliyofungwa hayawezi kurudishwa: ufunguo wao pekee ndio unaoweza kutumia sarafu hizi sasa.",
  "wallet.pay.reclaimable":
    "Bado inaweza kurudishwa kutoka kichupo cha Pochi hadi uthibitishe kuwa imefika.",
  "wallet.pay.why": "Imetumwa kwa njia hii kwa sababu {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} kwa {name}",
  "wallet.pay.thread_receipt":
    "Umetuma {amount} {unit}, zimefungwa kwenye ufunguo wao.",
  "wallet.pay.title": "Tuma ecash",
  "wallet.pay.to": "Kwa {name}",
  "wallet.pay.amount": "Kiasi katika sat",
  "wallet.pay.memo": "Dokezo (si lazima, la wazi kwa umma)",
  "wallet.pay.send": "Tuma",
  "wallet.pay.sending": "Inatuma…",
  "wallet.pay.action": "Tuma ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Ufikiaji wa kamera",
  "wallet.scan.camera_purpose": "kuchanganua msimbo wa QR wa ecash",
  "wallet.scan.photo_label": "Ufikiaji wa picha",
  "wallet.scan.photo_purpose": "kusoma QR ya ecash kutoka kwenye picha",
  "wallet.scan.no_token":
    "Hakuna tokeni ya ecash iliyopatikana kwenye picha hiyo.",
  "wallet.scan.no_invoice":
    "Hakuna ankara ya Lightning iliyopatikana kwenye picha hiyo.",
  "wallet.scan.unreadable": "Picha hiyo haikuweza kusomwa.",
  "wallet.scan.camera_failed":
    "Kamera haikuweza kuanza. Funga programu nyingine za kamera kisha ujaribu tena.",
  "wallet.scan.close": "Funga kichanganuzi",
  "wallet.scan.on_device":
    "Husomwa kwenye kifaa hiki; hakuna kinachotumwa popote.",
  "wallet.scan.aim_token": "Elekeza kwenye msimbo wa QR wa ecash.",
  "wallet.scan.aim_invoice":
    "Elekeza kwenye msimbo wa QR wa ankara ya Lightning.",
  "wallet.scan.title_token": "Changanua ecash",
  "wallet.scan.title_invoice": "Changanua ankara",
  "wallet.scan.desc_token":
    "Soma tokeni ya Cashu kutoka pochi nyingine. Hufanya kazi na pochi yoyote ya Cashu, si Airhop pekee.",
  "wallet.scan.desc_invoice":
    "Soma ankara ya Lightning ili kuilipa kutoka salio lako.",
  "wallet.scan.use_camera_a11y": "Changanua kwa kamera",
  "wallet.scan.use_camera": "Tumia kamera",
  "wallet.scan.pick_image_a11y":
    "Soma msimbo wa QR kutoka picha iliyohifadhiwa",
  "wallet.scan.pick_image": "Chagua kutoka kwenye picha",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu ni nini?",
  "wallet.explain.intro":
    "Cashu ni ecash ya Bitcoin. Tokeni ni mfuatano wenye thamani ya pesa kwa yeyote anayeushikilia, uliotiwa saini kwa upofu na mint ili mint isijue nani alitumia nini. Hakuna akaunti, hakuna kuingia.",
  "wallet.explain.send": "Tuma",
  "wallet.explain.send_desc":
    "Hugeuza kiasi kuwa tokeni unayoweza kumkabidhi peer aliye karibu kupitia Bluetooth, au kuishiriki kama maandishi. Hufanya kazi bila intaneti. Thibitisho hubaki zimetengwa hadi uthibitishe kuwa imefika.",
  "wallet.explain.receive": "Pokea",
  "wallet.explain.receive_desc":
    "Bandika tokeni ili kuiongeza. Ukiwa mtandaoni hubadilishwa kwenye mint mara moja, jambo linalofanya iwe yako kwa uthibitisho. Nje ya mtandao huhifadhiwa na kuwekewa alama kuwa haijathibitishwa hadi usasishe.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Hulipa utambulisho wa Nostr. Kama wanachapisha taarifa za nutzap za NIP-61, ecash hufungwa kwenye ufunguo wao ili wao pekee waweze kuitumia. Vinginevyo hurudi kwenye ujumbe wa moja kwa moja uliosimbwa. Huhitaji intaneti.",
  "wallet.explain.add_mint": "Ongeza mint",
  "wallet.explain.add_mint_desc":
    "Huhifadhi mint inayotoa na kukomboa ecash yako, na huhifadhi funguo zake za umma ili tokeni zitokazo kwake ziweze kukaguliwa nje ya mtandao. Chagua mint ambayo ungeiamini na salio unaloliweka hapo.",
  "wallet.explain.phrase": "Kifungu cha urejeshaji",
  "wallet.explain.phrase_desc":
    "Sarafu zako hutokana na maneno kumi na mawili ambayo pochi hutengeneza mwanzoni, ili simu mpya iweze kujenga upya salio kwa kuuliza mint zako ni sarafu zipi walizotia saini. Hadi uyatazame na kuyaandika, yapo kwenye simu hii tu.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Pochi imefungwa",
  "wallet.err.mint_unreachable": "Mint haifikiki",
  "wallet.err.tor_blocked": "Imezuiwa Tor ikiwa imewashwa",
  "wallet.err.insufficient": "Salio halitoshi",
  "wallet.err.exact_amount": "Haiwezi kutuma kiasi hicho hasa",
  "wallet.err.no_mint": "Hakuna mint",
  "wallet.err.mint_unsupported": "Mint haiwezi kufanya hivyo",
  "wallet.err.mint_refused": "Mint imekataa",
  "wallet.err.unreadable": "Tokeni isiyosomeka",
  "wallet.err.rejected": "Tokeni imekataliwa",
  "wallet.err.already_spent": "Tayari imetumika",
  "wallet.err.change_pending": "Imelipwa, chenji inasubiri",
  "wallet.svc.mint_unreachable": "Haikuweza kuifikia mint.",
  "wallet.svc.tor_ios": "Maombi ya mint hayapiti kwenye Tor kwenye iOS.",
  "wallet.svc.tor_ios_body":
    "Arti hufunika WebSocket za Nostr pekee, kwa hivyo ombi hili lingeifikia mint kupitia mtandao wazi na kuunganisha IP yako na thibitisho hizi. Liruhusu chini ya Mipangilio > Usalama, au zima Tor kwanza. Kutuma na kupokea ecash kupitia mesh bado kunafanya kazi.",
  "wallet.svc.tor_paused": "Tor imewashwa lakini haijaunganishwa.",
  "wallet.svc.tor_paused_body":
    "Orbot imeacha kupitisha trafiki, kwa hivyo ombi hili lingeifikia mint kupitia mtandao wazi na kuunganisha IP yako na thibitisho hizi. Washa Orbot tena, au zima Tor. Kutuma na kupokea ecash kupitia mesh bado kunafanya kazi.",
  "wallet.svc.keys_uncached":
    "Funguo za mint hii hazijahifadhiwa kwenye kifaa hiki.",
  "wallet.svc.keys_uncached_body":
    "Fungua pochi mara moja ukiwa mtandaoni ili kuzipata.",
  "wallet.svc.phrase_invalid": "Kifungu hicho cha urejeshaji si sahihi.",
  "wallet.svc.phrase_invalid_body":
    "Tafuta neno lililoandikwa vibaya au lililokosekana. Kifungu kina alama ya ukaguzi ndani yake, kwa hivyo neno moja baya hukifanya kizima kisiwe sahihi.",
  "wallet.svc.need_mint": "Ongeza angalau mint moja kwanza.",
  "wallet.svc.need_mint_body":
    "Urejeshaji hufanya kazi kwa kuuliza mint ni sarafu zipi ilizokutia saini, kwa hivyo unahitaji kujua ni mint gani ya kuuliza.",
  "wallet.svc.restored": "Imerejeshwa kutoka kifungu cha urejeshaji",
  "wallet.svc.storage_locked": "Hifadhi ya pochi imefungwa.",
  "wallet.svc.storage_locked_body":
    "Airhop huweka thibitisho za ecash kwenye faili iliyosimbwa ambayo ufunguo wake upo kwenye kihifadhi funguo cha kifaa. Fungua kifaa kisha ufungue programu tena.",
  "wallet.svc.bad_url": "Hiyo si URL halali.",
  "wallet.svc.needs_https": "URL ya mint lazima ianze na https://.",
  "wallet.svc.refuse_http": "Tunakataa kutumia mint kupitia http tupu.",
  "wallet.svc.refuse_http_body":
    "Yeyote aliye njiani kwenye mtandao angeweza kusoma au kubadilisha thibitisho zako. Tumia mint yenye https://.",
  "wallet.svc.mint_not_saved": "Mint haikuweza kuhifadhiwa.",
  "wallet.svc.unreadable_token": "Hiyo si tokeni ya Cashu inayosomeka.",
  "wallet.svc.unreadable_token_body":
    "Tokeni huanza na cashuA au cashuB. Hakikisha hakuna kilichokatika ilipokuwa ikinakiliwa.",
  "wallet.svc.wrong_mint": "Tokeni hii haikutiwa saini na mint inayoitaja.",
  "wallet.svc.already_spent": "Thibitisho hizi tayari zimetumika.",
  "wallet.svc.already_spent_body":
    "Yeyote aliyetuma tokeni hii aliikomboa kwanza, au alituma tokeni ileile kwa mtu mwingine pia.",
  "wallet.svc.receiving_offline": "inapokea nje ya mtandao",
  "wallet.svc.amount_positive": "Weka kiasi kikubwa kuliko sifuri.",
  "wallet.svc.coins_raced":
    "Sarafu hizo zimetumiwa punde tu na malipo mengine.",
  "wallet.svc.coins_raced_body":
    "Hakuna kilichopunguzwa. Jaribu tena na pochi itachagua seti tofauti.",
  "wallet.svc.no_ecash": "Bado hakuna ecash.",
  "wallet.svc.no_ecash_body":
    "Ongeza mint na uweke amana kupitia Lightning, au pokea tokeni kutoka kwa mtu.",
  "wallet.svc.split_across_mints":
    "Salio lako limegawanywa kwenye mint kadhaa.",
  "wallet.svc.mint_says_spent":
    "Mint imeripoti kuwa thibitisho hizi tayari zimetumika.",
  "wallet.svc.issue_against_invoice":
    "kutoa ecash dhidi ya ankara ya Lightning",
  "wallet.svc.pay_invoice": "kulipa ankara ya Lightning",
  "wallet.svc.unknown_deposit": "Amana isiyojulikana.",
  "wallet.svc.invoice_expired_before":
    "Ankara ilikwisha muda kabla haijalipwa.",
  "wallet.svc.invoice_expired": "Ankara hiyo imekwisha muda.",
  "wallet.svc.invoice_unpaid": "Ankara bado haijalipwa.",
  "wallet.svc.payment_unknown":
    "Hali ya malipo haijulikani; itakaguliwa tena wakati wa kusasisha kunakofuata.",
  "wallet.svc.melt_change_pending": "Ankara yako imelipwa.",
  "wallet.svc.melt_change_pending_body":
    "Mint bado hairudishi ada ya uelekezaji isiyotumika. Hudaiwa yenyewe wakati wa kusasisha kunakofuata, na hakuna kinachopotea wakati huo.",
  "wallet.svc.mint_did_not_pay":
    "Mint haikulipa ankara hii. Salio lako halijabadilika.",
  "wallet.svc.not_an_invoice": "Hiyo si ankara ya Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Bandika ankara ya bolt11 inayoanza na lnbc.",
  "wallet.svc.insufficient_for_invoice": "Salio halitoshi kwa ankara hii.",
  "wallet.svc.coins_raced_invoice_body":
    "Hakuna kilichopunguzwa na ankara haikulipwa. Jaribu tena.",
  "wallet.svc.same_mint": "Chagua mint lengwa tofauti.",
  "wallet.svc.same_mint_body":
    "Chanzo na lengwa ni mint ileile, kwa hivyo hakuna cha kuhamisha.",
  "wallet.svc.quote_failed_retried":
    "Bei imeshindwa, uunganishaji umejaribiwa tena",
  "wallet.svc.amount_unfit_retried":
    "Kiasi hakikutoshea, uunganishaji umejaribiwa tena",
  "wallet.svc.cannot_size": "Ukubwa wa uhamishaji huu haukuweza kupimwa.",
  "wallet.svc.insufficient_at_mint": "Salio halitoshi kwenye {mint}.",
  "wallet.svc.inexact_title":
    "Thibitisho zako haziwezi kutoa {amount} {unit} kamili nje ya mtandao.",
  "wallet.svc.inexact_detail":
    "Tokeni ndogo zaidi unayoweza kutuma ni {spend} {unit}. Nje ya mtandao hakuna chenji, kwa hivyo {extra} {unit} za ziada zitamwendea mpokeaji.",
  "wallet.svc.no_single_mint":
    "Hakuna mint moja inayoshikilia {amount} {unit}. Ecash kutoka mint tofauti haiwezi kuunganishwa kwenye tokeni moja: iunganishe kwenye mint moja kwanza, au ituma kwa viasi tofauti.",
  "wallet.svc.have_tried_send":
    "Una {total} {unit}, na ulijaribu kutuma {amount}.",
  "wallet.svc.invoice_needs":
    "Ankara hii inahitaji {total} {unit} pamoja na akiba ya uelekezaji, nawe una {balance}.",
  "wallet.svc.nothing_to_move": "{mint} haina {unit} za kuhamisha.",
  "wallet.svc.consolidate_memo": "Uunganishaji kutoka {mint}",
  "wallet.svc.cannot_size_detail":
    "Baada ya ada za uelekezaji za Lightning, {from} haiwezi kuhamisha kiasi chenye manufaa kwenda {to}. Jaribu kuhamisha kiasi kidogo mahususi badala yake.",
  "wallet.svc.mint_cannot": "{mint} haiwezi {action}.",
  "wallet.svc.no_nut": "Mint haitangazi NUT-{nut}.",
  "wallet.svc.unknown_mint": "Malipo hayo yanataja mint usiyoitumia.",
  "wallet.svc.unknown_mint_body":
    "Iongeze mint mwenyewe kama unaiamini; hakuna kinachokombolewa kutoka mint ambayo hujaichagua.",
  "wallet.svc.no_relay": "hakuna muunganisho wa relay",
  "wallet.svc.no_shared_mint": "hakuna mint ya pamoja yenye salio la kutosha",
  "wallet.svc.no_nutzap_info":
    "mpokeaji hajachapisha taarifa za nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Imefungwa kwenye ufunguo wao lakini bado haijafikishwa. Shiriki tokeni kutoka muamala huu ili kuikamilisha.",
  "wallet.svc.swap_lost":
    "Mint haikuwahi kukamilisha ubadilishaji huu, kwa hivyo hakuna kilichotolewa dhidi yake.",
  "wallet.svc.swap_unreadable":
    "Ubadilishaji huu ulihifadhiwa kwa namna ambayo toleo hili haliwezi kuicheza tena.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Imethibitishwa kupitia QR",
  "contacts.qr.keys_unverified": "Funguo zimepokelewa, hazijathibitishwa",
  "contacts.qr.not_verified": "Bado haijathibitishwa",
  "contacts.qr.message": "Ujumbe",
  "contacts.qr.add": "Ongeza anwani",
  "contacts.qr.scan_title": "Changanua msimbo wa QR",
  "contacts.qr.aim": "Elekeza kamera yako kwenye msimbo wao wa QR",
  "contacts.qr.add_desc": "Mfikie mtu ambaye hayuko karibu kwenye mesh.",
  "contacts.qr.peer_id_hint":
    "Kitambulisho cha peer kina herufi 16. Msimbo wa anwani huanza na airhop:.",
  "contacts.qr.or_scan": "au changanua QR yao",
  "contacts.qr.trust_note":
    "Ni QR unayoichanganua kwa kamera pekee inayothibitisha ufunguo wao. Msimbo uliobandikwa hubeba funguo zao lakini si uthibitisho kwamba ulitoka kwao.",
  "contacts.qr.peer_id": "Kitambulisho cha peer au msimbo wa anwani",
  "contacts.qr.peer_id_placeholder": "Bandika kitambulisho au msimbo wa anwani",
  "contacts.qr.scan_camera_a11y": "Changanua msimbo wa QR kwa kamera",
  "contacts.qr.scan_camera_desc": "Tumia kamera yako",
  "contacts.qr.upload_a11y": "Pakia picha ya QR kutoka kwenye ghala",
  "contacts.qr.upload": "Pakia kutoka kwenye ghala",
  "contacts.qr.upload_desc": "Chagua picha ya QR iliyohifadhiwa",
  "contacts.qr.scan_a11y": "Ongeza anwani kwa kuchanganua msimbo wa QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Bandika kitambulisho cha peer chenye herufi 16, kiungo cha airhop://peer/…, au msimbo wa anwani.",
  "contacts.scan.camera_label": "Ufikiaji wa kamera",
  "contacts.scan.camera_purpose": "kuchanganua msimbo wa QR wa anwani",
  "contacts.scan.camera_needed":
    "Ufikiaji wa kamera unahitajika ili kuchanganua. Bado unaweza kuongeza kwa kitambulisho cha peer.",
  "contacts.scan.camera_failed":
    "Kamera haikuweza kuanza. Funga programu nyingine za kamera kisha ujaribu tena.",
  "contacts.scan.photo_label": "Ufikiaji wa picha",
  "contacts.scan.photo_purpose": "kuchanganua msimbo wa QR uliouhifadhi",
  "contacts.scan.photo_needed":
    "Ufikiaji wa picha unahitajika ili kuchagua picha. Bado unaweza kuongeza kwa kitambulisho cha peer.",
  "contacts.scan.no_qr":
    "Hakuna msimbo wa QR wa Airhop uliopatikana kwenye picha hiyo.",
  "contacts.scan.unreadable":
    "Msimbo wa QR haukuweza kusomwa kutoka kwenye picha hiyo.",
  "contacts.scan.bitchat_expired":
    "Msimbo huo wa bitchat umekwisha muda. Waombe wafungue QR yao tena.",
  "contacts.scan.tampered":
    "Msimbo huu wa QR si sahihi: kitambulisho chake cha peer hakilingani na funguo zake. Huenda umeingiliwa.",
  "contacts.scan.already_added": "Tayari yuko kwenye anwani zako",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Inasubiri ufikiaji wa kamera…",
  "contacts.verify.camera_off": "Kamera imezimwa",
  "contacts.verify.open_settings": "Fungua Mipangilio",
  "contacts.verify.verified": "Imethibitishwa",
  "contacts.verify.different": "Anwani tofauti",
  "contacts.verify.scan_again": "Changanua tena",
  "contacts.verify.failed": "Haikuweza kuthibitishwa",
  "contacts.verify.done": "Imekamilika",
  "contacts.verify.title": "Thibitisha {name}",
  "contacts.verify.aim": "Elekeza kamera yako kwenye msimbo wao wa QR",
  "contacts.verify.camera_off_body":
    "Washa ufikiaji wa kamera kwenye Mipangilio ili kuthibitisha kwa QR.",
  "contacts.verify.match_body":
    "Ufunguo wa {name} unalingana. Unaweza kumwamini anwani hii.",
  "contacts.verify.different_body":
    "QR hii ni ya mtu mwingine. Mwombe {name} aonyeshe msimbo wake mwenyewe.",
  "contacts.verify.tampered_body":
    "QR hii inaonekana imeingiliwa: kitambulisho chake hakilingani na ufunguo wake.",
  "contacts.verify.choose_title": "Unataka kukagua vipi?",
  "contacts.verify.choose_body":
    "Zote mbili zinathibitisha kwamba funguo zilizo kwenye simu hii ni za {name} kweli.",
  "contacts.verify.method_scan": "Changanua msimbo wao",
  "contacts.verify.method_scan_sub": "Wapo hapa na wewe",
  "contacts.verify.method_compare": "Linganisha msimbo",
  "contacts.verify.method_compare_sub": "Someni kwa kila mmoja kwenye simu",
  "contacts.verify.no_keys":
    "Bado hakuna funguo za anwani hii. Watumie ujumbe, au changanua msimbo wao mtakapokutana.",
  "contacts.verify.compare_title": "Someni haya kwa kila mmoja",
  "contacts.verify.compare_body":
    "{name} anaona maneno sita yaleyale. Yakilingana, nyote wawili mnajua funguo ni halisi.",
  "contacts.verify.codes_match": "Yanalingana",
  "contacts.verify.codes_differ": "Hayalingani",
  "contacts.verify.compared_body":
    "Wewe na {name} mmethibitisha msimbo uleule. Anwani hii imethibitishwa.",

  // ---- Settings: shared chrome ----
  "settings.back": "Rudi nyuma",
  "settings.coming_soon": "Inakuja hivi karibuni",
  "settings.opens_externally": "{label}, hufunguka nje ya programu",
  "settings.peer_id": "Kitambulisho cha peer",
  "settings.share_peer_id": "Shiriki kitambulisho chako cha peer",
  "settings.share_id_short": "Shiriki kitambulisho",
  "settings.peer_id_sheet.title": "Kitambulisho chako cha peer",
  "settings.peer_id_sheet.copy": "Nakili kitambulisho cha peer",
  "settings.peer_id_sheet.note":
    "Hii hufanya kazi tu mkiwa nyote ndani ya masafa ya Bluetooth. Ili mtu akutumie ujumbe kutoka popote, shiriki msimbo wako wa QR badala yake.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Jumla",
  "settings.section.general_desc":
    "Vipengele vya hiari, tendua kutuma, midia, weka upya",
  "settings.section.privacy": "Faragha na usalama",
  "settings.section.privacy_desc":
    "Forward secrecy, pakiti zilizotiwa saini, peer waliozuiwa",
  "settings.section.network": "Mtandao na relay",
  "settings.section.network_desc":
    "Akiba ya intaneti, relay za nostr, uoanifu na bitchat",
  "settings.section.permissions": "Ruhusa",
  "settings.section.permissions_desc":
    "Bluetooth, mahali, arifa, kamera, maikrofoni",
  "settings.section.storage": "Hifadhi na data",
  "settings.section.diagnostics": "Uchunguzi",

  // ---- Settings: group headings ----
  "settings.group.transports": "Wasafirishaji",
  "settings.group.nearby": "Karibu",
  "settings.group.sync": "Usawazishaji",
  "settings.group.features": "Vipengele",
  "settings.group.messages": "Jumbe",
  "settings.group.media": "Midia",
  "settings.group.reset": "Weka upya",
  "settings.group.always_on": "Daima imewashwa",
  "settings.group.notifications": "Arifa",
  "settings.group.blocked": "Waliozuiwa",
  "settings.group.theme": "Mandhari",
  "settings.group.font": "Fonti",
  "settings.group.language": "Lugha",
  "settings.section.diagnostics_desc":
    "Hali ya muunganisho na vifaa vilivyo karibu",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Viungo vya Bluetooth",
  "settings.diag.ble_links_desc":
    "Vifaa ambavyo simu hii imeunganishwa navyo moja kwa moja",
  "settings.diag.lan": "Mtandao wa ndani",
  "settings.diag.lan_desc": "Simu kwenye mtandao mmoja wa Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Simu kwa simu bila rauta",
  "settings.diag.wifi_active": "Inaendelea",
  "settings.diag.wifi_unsupported": "Haitumiki kwenye kifaa hiki",
  "settings.diag.wifi_permission": "Imezuiwa na ruhusa fulani",
  "settings.diag.wifi_unavailable": "Haipatikani kwa sasa",
  "settings.diag.wifi_unknown": "Inasubiri redio",
  "settings.diag.relays": "Relay za Nostr",
  "settings.diag.relays_desc":
    "Hutumika kwa vituo vya mahali na ufikiaji wa intaneti",
  "settings.diag.connected": "Imeunganishwa",
  "settings.diag.disconnected": "Haijaunganishwa",
  "settings.diag.peer_direct": "Kiungo cha moja kwa moja",
  "settings.diag.peer_relayed": "Amesikika kupitia kifaa kingine",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Hakuna usomaji wa ishara",
  "settings.diag.no_peers": "Hakuna mtu ndani ya masafa",
  "settings.diag.no_peers_desc": "Viungo {links} vya redio vipo wazi",
  "settings.diag.gcs_size": "Ukubwa wa kichujio",
  "settings.diag.gcs_size_desc":
    "Kichujio kikubwa zaidi cha usawazishaji kilichotolewa hewani",
  "settings.diag.fpr": "Kiwango cha ishara za uwongo",
  "settings.diag.fpr_desc":
    "Ni mara ngapi kichujio hudai kuwa na pakiti ambayo hatuna",
  "settings.diag.bytes": "Baiti {n}",
  "settings.diag.footnote":
    "Hakuna kinachoweza kubadilishwa hapa. Thamani hizi zimewekwa ili Airhop iendelee kuoana na bitchat.",
  "settings.section.storage_desc": "Matumizi na akiba",
  "settings.section.appearance": "Muonekano",
  "settings.section.appearance_desc": "Mandhari, fonti na lugha",
  "settings.section.help": "Usaidizi na maoni",
  "settings.section.help_desc":
    "Wasiliana nasi, ripoti hitilafu, au soma Maswali Yanayoulizwa Mara kwa Mara",
  "settings.section.support": "Msaada",
  "settings.section.support_desc": "Saidia maendeleo yaendelee",
  "settings.section.about": "Kuhusu",
  "settings.section.about_desc":
    "Toleo, orodha ya mabadiliko, na msimbo wa chanzo",

  // ---- Settings: general ----
  "settings.general.undo": "Tendua kutuma",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Pochi",
  "settings.general.undo_seconds": "Sekunde {count}",
  "settings.general.undo_a11y": "Tendua kutuma: {value}",
  "settings.general.quality_a11y": "Weka ubora wa upakiaji kuwa {value}",
  "settings.general.undo_desc":
    "Hushikilia ujumbe uliotumwa kwa muda mfupi ili uweze kuurudisha kabla haujatoka",
  "settings.general.undo_off_desc": "Tuma mara moja, bila kutendua",
  "settings.general.undo_2": "Sekunde 2",
  "settings.general.undo_2_desc": "Nafasi fupi ya kuurudisha",
  "settings.general.undo_10": "Sekunde 10",
  "settings.general.undo_10_desc": "Muda mrefu zaidi",
  "settings.general.quality": "Ubora wa upakiaji",
  "settings.general.quality_desc":
    "Hutumika kwa picha zinazotumwa kutoka kwa kamera au ghala lako. Kila picha hupimwa kulingana na mesh vyovyote vile.",
  "settings.general.quality_low": "Chini",
  "settings.general.quality_low_desc":
    "Picha ndogo zaidi, za haraka zaidi kutuma",
  "settings.general.quality_medium": "Wastani",
  "settings.general.quality_medium_desc": "Uwiano wa undani na kasi",
  "settings.general.quality_high": "Juu",
  "settings.general.quality_high_desc": "Huhifadhi undani mwingi zaidi",
  "settings.general.feature_wallet_desc":
    "Tuma ecash ya Cashu kutoka peer hadi peer kupitia mesh",
  "settings.general.feature_wallet_a11y": "Pochi (daima imewashwa)",
  "settings.general.feature_ai_desc":
    "Msaidizi wa faragha kwenye kifaa, bila miito ya mtandao",
  "settings.general.feature_feeds": "Milisho",
  "settings.general.feature_feeds_desc":
    "Soma na uchapishe kwenye milisho ya Bluesky na Mastodon",
  "settings.general.show_media": "Onyesha midia kiotomatiki",
  "settings.general.show_media_desc":
    "Picha na video huonekana kwenye gumzo, au hubaki nyuma ya mguso mmoja",
  "settings.general.reset": "Weka upya mipangilio",
  "settings.general.media_retention": "Hifadhi midia kwa",
  "settings.general.media_retention_desc":
    "Picha, video na noti za sauti hufutwa baada ya muda uliochaguliwa",
  "settings.general.media_retention_sheet":
    "Chagua muda ambao midia hubaki kwenye kifaa hiki. Midia iliyofutwa haiwezi kurejeshwa.",
  "settings.general.retention_7_desc":
    "Huacha alama chache zaidi. Bora zaidi ikiwa simu yenyewe ndiyo hatari.",
  "settings.general.retention_14_desc":
    "Njia ya kati kwa wiki moja au mbili bila mtandao.",
  "settings.general.retention_30_desc":
    "Huweka mazungumzo yakisomeka kwa muda mrefu zaidi, na huchukua nafasi kubwa zaidi kwenye diski.",
  "settings.general.reset_desc":
    "Hurudisha kila upendeleo kwenye hali yake ya kawaida, bila kugusa utambulisho, jumbe, anwani na pochi yako",
  "settings.general.reset_title": "Uweke upya mipangilio?",
  "settings.general.reset_body":
    "Kila upendeleo hurudi kwenye hali yake ya kawaida: muonekano, tendua kutuma, na muunganisho (intaneti, Tor, lango, daraja, relay). Utambulisho, jumbe, anwani na pochi yako hazitaguswa.",
  "settings.general.reset_confirm": "Weka upya",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet daima imewashwa kwa jumbe za moja kwa moja",
  "settings.security.signed_packets": "Pakiti zilizotiwa saini",
  "settings.security.signed_packets_desc":
    "Kila pakiti hutiwa saini kwa Ed25519",
  "settings.security.hide_previews": "Ficha muhtasari kwenye arifa",
  "settings.security.hide_previews_desc":
    "Huweka mtumaji na ujumbe mbali na skrini yako ya kufunga, ambayo huvionyesha bila kufungua",
  "settings.security.no_blocked": "Hakuna peer aliyezuiwa",
  "settings.security.no_blocked_desc":
    "Peer waliozuiwa hawawezi kukutumia ujumbe wala kuonekana kwenye kichupo cha Mesh",
  "settings.security.unblock_title": "Ondoa zuio kwa peer huyu",
  "settings.security.unblock": "Ondoa zuio",
  "settings.security.unblock_peer": "Ondoa zuio kwa {name}",
  "settings.security.unblock_body":
    "{name} ataweza kukutumia ujumbe tena na ataonekana upya kwenye kichupo cha Mesh akiwa karibu.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Akiba ya intaneti",
  "settings.network.internet_desc":
    "Endelea kupitia relay za Nostr wakati peer wa mesh wako nje ya masafa",
  "settings.network.internet_off_title": "Uzime intaneti?",
  "settings.network.internet_off_body":
    "Airhop itafanya kazi kwa Bluetooth pekee. Itaacha kuwasiliana na relay yoyote ya Nostr, na Tor, lango la intaneti, na daraja la mesh vyote vitazimwa. Gumzo la Bluetooth la karibu litaendelea kufanya kazi.",
  "settings.network.turn_off": "Zima",
  "settings.network.discovery": "Ugunduzi wa geo-relay",
  "settings.network.discovery_desc":
    "Chagua kiotomatiki relay zilizo karibu zaidi kwa seli ya mahali kutoka relay 300+ zilizotawanyika",
  "settings.network.discovery_needs_relay": "Ongeza relay yako mwenyewe kwanza",
  "settings.network.discovery_needs_relay_body":
    "Ugunduzi wa kiotomatiki ndio unaoelekeza Airhop kwenye relay zilizo karibu zaidi. Kuuzima kunaleta maana tu baada ya kubandika relay zako mwenyewe hapa chini, kwa hivyo ongeza angalau moja kwanza.",
  "settings.network.custom_only_title": "Utumie relay zako mwenyewe pekee?",
  "settings.network.custom_only_body":
    "Vituo vya mahali na daraja la mesh vitaacha kuchagua kiotomatiki relay zilizo karibu zaidi na vitatumia zile ulizoongeza pekee. Hili linaweza kupunguza ufikiaji, na huenda ukaacha kukutana na watumiaji wa bitchat, ambao hukusanyika kwenye relay zilizo karibu zaidi.",
  "settings.network.custom": "Relay zako mwenyewe",
  "settings.network.custom_desc":
    "Ongeza relay zako mwenyewe kwa vituo vya mahali na daraja la mesh",
  "settings.network.custom_added": "{count} kati ya {max} zimeongezwa",
  "settings.network.dm_relays": "Relay za jumbe",
  "settings.network.dm_relays_desc":
    "Jumbe za moja kwa moja na vituo vya faragha daima hutumia hizi. Relay zako mwenyewe hazizibadilishi.",
  "settings.network.discovery_back_on": "Ugunduzi wa geo-relay umewashwa tena",
  "settings.network.discovery_back_on_body":
    "Hiyo ilikuwa relay yako ya mwisho mwenyewe. Vituo vya mahali vinahitaji mahali pa kuchapisha, kwa hivyo Airhop inachagua tena kiotomatiki relay zilizo karibu zaidi.",
  "settings.network.add_relay": "Ongeza relay",
  "settings.network.remove_relay": "Ondoa {url}",
  "settings.network.add_short": "Ongeza",
  "settings.network.relay_limit":
    "Unaweza kuongeza relay {count}. Ondoa moja ili kuongeza nyingine.",
  "settings.network.relay_duplicate":
    "Relay hiyo tayari iko kwenye orodha yako.",
  "settings.network.relay_invalid":
    "Weka mwenyeji halali wa relay, mfano relay.example.com. Mlango unahitajika tu ikiwa relay haitumii ule wa kawaida. Anwani za IP na majina ya ndani hayaruhusiwi.",
  "settings.network.bitchat": "Uoanifu na bitchat",
  "settings.network.bitchat_desc":
    "Mesh ileile ya BLE kama bitchat, inayooana kikamilifu. Hii daima imewashwa, na haiwezi kuzimwa.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Endesha chinichini",
  "settings.conn.background_desc":
    "Weka mesh ikiendelea wakati Airhop imefungwa",
  "settings.conn.background_on_title": "Uweke mesh ikiendelea?",
  "settings.conn.background_on_body":
    "Airhop huendelea kupitisha na kupokea ikiwa imefungwa, kwa hivyo jumbe hufika ukiwa mbali. Android huonyesha arifa inayoendelea wakati huo.",
  "settings.conn.background_off_title": "Usimamishe mesh Airhop inapofungwa?",
  "settings.conn.background_off_body":
    "Jumbe zitafika tu wakati Airhop imefunguliwa, na simu hii itaacha kupitisha kwa ajili ya watu walio karibu. Arifa inayoendelea itatoweka.",
  "settings.conn.live_voice": "Sauti ya moja kwa moja",
  "settings.conn.live_voice_desc":
    "Zungumza na watu walio karibu kama redio ya mkononi",
  "settings.conn.live_voice_on_title": "Uwashe sauti ya moja kwa moja?",
  "settings.conn.live_voice_on_body":
    "Kushikilia maikrofoni hutuma sauti yako kwa kila mtu aliye ndani ya masafa ya Bluetooth unapozungumza, na sauti yao husikika kwenye simu yako. Hakuna kinachorekodiwa.",
  "settings.conn.live_voice_off_title": "Uzime sauti ya moja kwa moja?",
  "settings.conn.live_voice_off_body":
    "Kushikilia maikrofoni hurekodi noti ya sauti badala yake. Hutumwa ukiachia, na hakuna anayeisikia hadi waichezeshe.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Uelekezaji wa Tor",
  "settings.conn.tor_desc":
    "Elekeza trafiki ya Nostr kupitia Tor kwa faragha zaidi",
  "settings.conn.tor_on_title": "Uelekeze trafiki ya Nostr kupitia Tor?",
  "settings.conn.tor_on_body":
    "Relay zitaacha kuona anwani yako ya IP. Kuunganisha huchukua muda mrefu zaidi na jumbe hufika polepole zaidi. Bluetooth haiathiriki.",
  "settings.conn.tor_off_title": "Uzime uelekezaji wa Tor?",
  "settings.conn.tor_off_body":
    "Trafiki ya Nostr hurudi kwenye muunganisho wako wa kawaida, kwa hivyo relay huona anwani yako ya IP tena. Bluetooth haiathiriki vyovyote vile.",
  "settings.conn.tor_orbot_idle":
    "Orbot imesakinishwa lakini haijaunganishwa. Fungua Orbot, anzisha VPN yake, kisha washa hii.",
  "settings.conn.tor_unavailable":
    "Uelekezaji wa Tor haupatikani kwenye toleo hili.",
  "settings.conn.tor_timeout":
    "Tor inachukua zaidi ya dakika moja kuunganisha. Inabaki imewashwa na inaendelea kujaribu; kichupo cha Mesh kitasema itakapokuwa inaelekeza, au kama mtandao huu unaizuia.",
  "settings.conn.tor_failed":
    "Tor haikuweza kuanza. Hakikisha programu ina ufikiaji wa mtandao.",
  "settings.conn.mint_clearnet": "Ruhusu trafiki ya mint kupitia mtandao wazi",
  "settings.conn.mint_clearnet_desc":
    "Tor kwenye iOS hufunika Nostr pekee. Iache imezimwa ili kuzuia maombi ya mint; ecash kupitia mesh huendelea kufanya kazi vyovyote vile.",
  "settings.conn.gateway": "Lango la intaneti",
  "settings.conn.gateway_desc":
    "Azima muunganisho wako kwa simu iliyo karibu isiyo na mtandao ili bado iweze kufikia vituo vya mahali",
  "settings.conn.gateway_on_title": "Uwashe lango la intaneti?",
  "settings.conn.gateway_on_body":
    "Simu zilizo karibu zisizo na muunganisho wake zitatuma na kupokea jumbe za vituo vya mahali kupitia wako. Hutumia data yako ya simu na betri, na jumbe zao hubaki zikiwa zimesimbwa mwanzo hadi mwisho, kwa hivyo huwezi kusoma kinachopita.",
  "settings.conn.gateway_off_title": "Uzime lango la intaneti?",
  "settings.conn.gateway_off_body":
    "Simu zilizo karibu zisizo na mtandao zitaacha kufikia vituo vya mahali kupitia wako. Jumbe zako mwenyewe haziathiriki.",
  "settings.conn.bridge": "Daraja la mesh",
  "settings.conn.bridge_desc":
    "Unganisha gumzo la umma la #bluetooth la eneo hili na kundi jingine la Bluetooth lililo nje ya masafa kupitia intaneti",
  "settings.conn.bridge_on_title": "Uwashe daraja la mesh?",
  "settings.conn.bridge_on_body":
    "Jumbe zako za umma za #bluetooth zitachapishwa kwenye mtaa wako kupitia intaneti, kwa hivyo watu walio nje ya masafa ya Bluetooth wataweza kuzisoma. Jumbe za faragha hazivushwi kamwe, na “karibu pekee” huweka ujumbe wowote mmoja hapa hapa.",
  "settings.conn.bridge_off_title": "Uzime daraja la mesh?",
  "settings.conn.bridge_off_body":
    "Jumbe zako za umma za #bluetooth zitabaki tena ndani ya masafa ya Bluetooth, na jumbe kutoka kundi la ng'ambo zitaacha kufika hapa.",
  "settings.conn.bridge_needs_location": "Daraja la mesh linahitaji mahali",
  "settings.conn.bridge_needs_location_desc":
    "Hutafuta mtaa wako kutokana na usomaji wa mahali. Toa ruhusa ya mahali ili kuanza kuvusha.",
  "settings.conn.grant_location": "Toa ruhusa ya mahali",
  "settings.conn.grant_short": "Toa",
  "settings.conn.orbot_body":
    "Airhop huelekeza trafiki ya Tor kupitia Orbot. Sakinisha na uwashe Orbot kutoka Play Store, kisha washa hii.",
  "settings.conn.internet_off": "Intaneti imezimwa",
  "settings.conn.internet_off_desc":
    "Tor, daraja na lango vyote hutumia intaneti. Washa Akiba ya intaneti chini ya Mtandao ili kuvitumia.",
  "settings.conn.turn_on": "Washa",
  "settings.conn.turn_off": "Zima",
  "settings.conn.orbot_title": "Tor kwenye Android",
  "settings.conn.get_orbot": "Pata Orbot",
  "settings.conn.later": "Baadaye",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Hutafuta vifaa vilivyo karibu na kupitisha jumbe kati yake. Bila hii, mesh haiwezi kufanya kazi.",
  "settings.permissions.location": "Mahali",
  "settings.permissions.location_desc":
    "Hufungua vituo vya eneo lililo karibu. Bila hii, vituo hivyo hubaki vimefungwa na mesh ya Bluetooth huendelea kama kawaida.",
  "settings.permissions.notifications": "Arifa",
  "settings.permissions.notifications_desc":
    "Pokea taarifa za jumbe mpya hata programu ikiwa imefungwa. Bila hii, utaziona tu unapofungua Airhop.",
  "settings.permissions.camera": "Kamera",
  "settings.permissions.camera_desc":
    "Huchanganua misimbo ya QR na kupiga picha au video za kutuma. Bila hii, bado unaweza kushiriki midia kutoka ghala lako.",
  "settings.permissions.photos": "Picha",
  "settings.permissions.photos_desc":
    "Hutuma picha kutoka ghala lako na kuhifadhi midia iliyopokelewa. Bila hii, bado unaweza kupiga na kutuma picha mpya kwa kamera.",
  "settings.permissions.microphone": "Maikrofoni",
  "settings.permissions.microphone_desc":
    "Hurekodi na kutuma jumbe za sauti au hutumia sauti ya moja kwa moja. Bila hii, jumbe za sauti na sauti ya moja kwa moja hazitafanya kazi.",
  "settings.permissions.allow": "Toa ruhusa hii",
  "settings.permissions.open_settings":
    "Fungua mipangilio ya mfumo ili kubadilisha ruhusa hii",
  "settings.permissions.system": "Mfumo",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Matumizi ya mtandao",
  "settings.storage.storage_usage": "Matumizi ya hifadhi",
  "settings.storage.storage_usage_desc":
    "Jumbe, thibitisho za pochi, na viambatisho vilivyoko kwenye akiba",
  "settings.storage.session_usage":
    "Kipindi hiki · {sent} zimetumwa, {received} zimepokelewa",
  "settings.storage.cache": "Akiba",
  "settings.storage.cache_desc": "{size} za viambatisho",
  "settings.storage.clear_cache": "Futa akiba ya viambatisho",
  "settings.storage.clear": "Futa",
  "settings.storage.clear_title": "Ufute midia iliyoko kwenye akiba?",
  "settings.storage.clear_body":
    "Picha, video, noti za sauti na faili huondolewa kwenye kifaa hiki, zilizotumwa na zilizopokelewa sawasawa. Haziwezi kupakuliwa tena: viputo vyake vitasema hivyo, na unaweza kumwomba mtumaji atume tena. Jumbe na pochi hazitaguswa.",
  "settings.storage.cleared": "Akiba imefutwa",
  "settings.storage.freed": "Imeachia {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Weka muonekano kuwa {value}",
  "settings.font.set_a11y": "Weka fonti ya nafasi sawa kuwa {value}",
  "settings.font.system": "Mfumo",
  "settings.font.system_desc":
    "Hutumia fonti ya kawaida ya nafasi sawa ya kifaa chako",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Ya kisasa na rahisi kusoma",
  "settings.language.en": "Kiingereza",
  "settings.language.am": "Kiamhari",
  "settings.language.ar": "Kiarabu",
  "settings.language.bn": "Kibengali",
  "settings.language.my": "Kiburma",
  "settings.language.zh_hans": "Kichina (Kilichorahisishwa)",
  "settings.language.zh_hant": "Kichina (cha Jadi)",
  "settings.language.nl": "Kiholanzi",
  "settings.language.fil": "Kifilipino",
  "settings.language.fr": "Kifaransa",
  "settings.language.ka": "Kijojia",
  "settings.language.de": "Kijerumani",
  "settings.language.hi": "Kihindi",
  "settings.language.id": "Kiindonesia",
  "settings.language.it": "Kiitaliano",
  "settings.language.ja": "Kijapani",
  "settings.language.ko": "Kikorea",
  "settings.language.mg": "Kimalagasi",
  "settings.language.ms": "Kimalei",
  "settings.language.ne": "Kinepali",
  "settings.language.fa": "Kiajemi",
  "settings.language.pl": "Kipolandi",
  "settings.language.pt_br": "Kireno (Brazili)",
  "settings.language.pt_pt": "Kireno (Ureno)",
  "settings.language.pa": "Kipunjabi",
  "settings.language.ru": "Kirusi",
  "settings.language.es": "Kihispania",
  "settings.language.sw": "Kiswahili",
  "settings.language.sv": "Kiswidi",
  "settings.language.ta": "Kitamil",
  "settings.language.th": "Kithai",
  "settings.language.tr": "Kituruki",
  "settings.language.uk": "Kiukreni",
  "settings.language.ur": "Kiurdu",
  "settings.language.vi": "Kivietnamu",
  "settings.language.pseudo": "Lugha bandia",
  "settings.language.soon": "Inakuja hivi karibuni",
  "settings.language.soon_a11y": "{value}, inakuja hivi karibuni",
  "settings.language.set_a11y": "Weka lugha kuwa {value}",
  "settings.language.pending": "Wakati wa kufungua tena",
  "settings.language.pending_a11y":
    "{value}, itaanza kutumika utakapofungua Airhop tena",
  "settings.language.rtl_title": "Fungua Airhop tena ili kumaliza",
  "settings.language.rtl_body":
    "{value} husomwa kutoka kulia kwenda kushoto, na Airhop inaweza kubadilisha mwelekeo tu inapoanza. Ifunge na uifungue tena ili kumaliza kubadili. Hakuna kinachopotea, na mesh yako inabaki imeunganishwa hadi ufanye hivyo.",
  "settings.theme.light": "Nuru",
  "settings.theme.light_desc": "Daima tumia rangi za nuru",
  "settings.theme.dark": "Giza",
  "settings.theme.dark_desc": "Daima tumia rangi za giza",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Mtandaoni",
  "settings.status.online_desc":
    "Anaweza kugunduliwa, anatangaza na anachanganua",
  "settings.status.away": "Hayupo",
  "settings.status.away_desc": "Mesh imesitishwa, haichanganui wala haitangazi",
  "settings.status.invisible": "Hataonekana",
  "settings.status.invisible_desc":
    "Anachanganua, lakini amefichwa asigunduliwe",
  "settings.status.title": "Hali",
  "settings.status.set_a11y": "Weka hali kuwa {value}",
  "settings.status.edit": "Hariri hali",
  "settings.status.desc": "Chagua kiwango cha kuonekana kwako kwenye mesh.",
  "settings.transfer.identity": "Utambulisho na funguo",
  "settings.transfer.identity_desc":
    "Kitambulisho chako cha peer, jina la mtumiaji, na anwani",
  "settings.transfer.chats": "Gumzo na historia",
  "settings.transfer.chats_desc":
    "Mazungumzo, vikundi, na vituo ulivyojiunga navyo",
  "settings.transfer.wallet": "Salio la pochi",
  "settings.transfer.wallet_desc": "Thibitisho za Cashu na historia ya miamala",
  "settings.transfer.title": "Hamishia kwenye simu mpya",
  "settings.transfer.desc":
    "Hamisha utambulisho, gumzo na pochi yako kwenye kifaa kingine",
  "settings.transfer.coming_soon_a11y":
    "Hamishia kwenye simu mpya, inakuja hivi karibuni",
  "settings.transfer.body":
    "Shikilia simu zote mbili pamoja na uhamishe kila kitu kupitia Bluetooth. Hakuna kinachopita kwenye seva, kwa hivyo hufanya kazi bila intaneti.",
  "settings.qr.permission_label": "Ufikiaji wa picha",
  "settings.qr.permission_purpose": "kuhifadhi msimbo wako wa QR",
  "settings.qr.saved": "Imehifadhiwa",
  "settings.qr.saved_body":
    "Msimbo wa QR umehifadhiwa kwenye ghala lako la picha.",
  "settings.qr.save_failed": "Haikuweza kuhifadhiwa",
  "settings.qr.save_failed_body":
    "Msimbo wa QR haukuweza kuhifadhiwa. Jaribu tena.",
  "settings.qr.share_message": "Niongeze kwenye Airhop",
  "settings.qr.share_body":
    "Niongeze kwenye Airhop — jumbe za mesh zenye faragha, zinazofanya kazi bila mtandao kwanza.",
  "settings.qr.show_short": "Onyesha QR",
  "settings.qr.title": "Msimbo wako wa QR",
  "settings.qr.note":
    "Huu una funguo zako za umma, zinazowaruhusu wengine kukutumia ujumbe kutoka popote. Ushiriki tu na watu unaowaamini. Hautabadilika isipokuwa ufute utambulisho wako.",
  "settings.qr.code_label": "Msimbo wa anwani",
  "settings.qr.copy_code": "Nakili msimbo wa anwani",
  "settings.qr.share": "Shiriki msimbo wa QR",
  "settings.qr.share_short": "Shiriki QR",
  "settings.qr.download": "Pakua msimbo wa QR",
  "settings.qr.download_short": "Pakua QR",
  "settings.qr.show": "Onyesha msimbo wa QR",
  "settings.wipe.trigger": "Anzisha ufutaji wa dharura",
  "settings.wipe.trigger_desc":
    "Gusa mara tatu ili kufuta papo hapo bila kuthibitisha",
  "settings.wipe.title": "Ufutaji wa dharura",
  "settings.wipe.now": "Futa sasa",
  "settings.wipe.desc": "Huharibu papo hapo funguo, jumbe na thibitisho zote",
  "settings.wipe.body":
    "Hii itaharibu papo hapo funguo, jumbe na thibitisho zote za pochi yako. Haiwezi kutenduliwa.",
  "settings.wipe.in_progress": "Inafuta",
  "settings.wipe.in_progress_body":
    "Inaharibu funguo, jumbe na faili zako. Huchukua sekunde chache, na hukamilika yenyewe hata programu ikifungwa.",
  "settings.wipe.got_it": "Nimeelewa",
  "settings.wipe.keys_failed": "Funguo hazikuweza kuharibiwa",
  "settings.wipe.keys_failed_body":
    "Jumbe, anwani na pochi yako zimekwisha, lakini kifaa kimekataa kuachia funguo zako. Fungua kifaa kisha ufute tena.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Wasiliana nasi",
  "settings.help.contact_a11y": "Tuma barua pepe kwa {address}",
  "settings.help.bug": "Ripoti hitilafu",
  "settings.help.bug_desc": "Fungua suala kwenye GitHub",
  "settings.help.bug_a11y": "Ripoti hitilafu kwenye GitHub",
  "settings.help.faq": "Maswali yanayoulizwa mara kwa mara",
  "settings.help.faq_desc": "Majibu ya maswali ya kawaida",
  "settings.help.faq_a11y": "Fungua maswali yanayoulizwa mara kwa mara",
  "settings.help.terms_desc": "Jinsi Airhop inavyoweza kutumika",
  "settings.help.terms_a11y": "Fungua Masharti ya Huduma",
  "settings.help.privacy_desc": "Yale tusiyoyakusanya",
  "settings.help.privacy_a11y": "Fungua Sera ya Faragha",

  // ---- Settings: support ----
  "settings.support.card": "Kadi au UPI",
  "settings.support.card_desc":
    "Benki mtandaoni na pochi za kidijitali, duniani kote",
  "settings.support.card_a11y":
    "Saidia kwa kadi, UPI, benki mtandaoni, au pochi ya kidijitali",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Kila mwezi au mara moja, bila ada ya jukwaa",
  "settings.support.sponsors_a11y": "Saidia kupitia GitHub Sponsors",
  "settings.support.note":
    "Ninajenga Airhop kwa muda wangu wa ziada. Hakuna wawekezaji na hakuna matangazo. Kama inakufaa, mchango husaidia sana kuweka maendeleo yakiendelea. Kila kipengele hubaki bure vyovyote vile.",

  // ---- Settings: about and version ----
  "settings.about.version": "Toleo",
  "settings.about.version_desc": "Toleo la sasa",
  "settings.about.version_a11y": "Tazama toleo na uangalie masasisho",
  "settings.about.release_notes": "Maelezo ya toleo",
  "settings.about.release_notes_desc":
    "Yaliyo mapya kwenye toleo la hivi punde",
  "settings.about.release_notes_a11y":
    "Fungua maelezo ya toleo la hivi punde kwenye GitHub",
  "settings.about.source": "Msimbo wa chanzo",
  "settings.about.source_a11y": "Fungua msimbo wa chanzo kwenye GitHub",
  "settings.about.licenses": "Leseni za msimbo huria",
  "settings.about.open_repo": "Fungua hazina ya {name}",
  "settings.about.licenses_desc": "Vifurushi vya msimbo huria vya watu wengine",
  "settings.about.licenses_a11y": "Tazama leseni za watu wengine",
  "settings.version.codename": "Jina la siri",
  "settings.version.checking": "Inaangalia",
  "settings.version.check": "Angalia masasisho",
  "settings.version.checking_title": "Inaangalia masasisho",
  "settings.version.up_to_date": "Upo kwenye toleo la hivi punde.",
  "settings.version.release_notes": "Tazama maelezo ya toleo",
  "settings.version.made_with": "Imetengenezwa kwa",
  "settings.version.number": "Toleo {version}",
  "settings.version.update_to": "Sasisha hadi {version}",
  "settings.version.update_to_a11y": "Sasisha hadi toleo {version}",
  "settings.version.released_under": "Imetolewa chini ya {license}",
  "settings.version.notes_a11y": "Tazama maelezo ya toleo {version}",
  "settings.version.tor_paused":
    "Ukaguzi wa masasisho umesitishwa Tor ikiwa imewashwa, ili usivujishe IP yako. Angalia ukurasa wa matoleo kwenye kivinjari.",
  "settings.version.check_failed":
    "Haikuweza kuangalia masasisho. Kagua muunganisho wako kisha ujaribu tena.",
  "settings.version.downloading": "Inapakua {percent}%",
  "settings.version.install": "Sakinisha",
  "settings.version.download_failed":
    "Upakuaji umeshindwa. Angalia muunganisho wako na ujaribu tena.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} ni {size} KiB, zaidi ya kikomo cha {cap} KiB.",
  "transfer.failed.malformed":
    "Kiambatisho kimefika kikiwa kimeharibika na hakikuweza kufunguliwa. Waombe wakitume tena.",
  "transfer.failed.unsupported_type":
    "Kiambatisho kimefika katika muundo ambao programu hii haiwezi kuufungua.",
  "transfer.failed.type_mismatch":
    "Kiambatisho kimekataliwa: maudhui yake hayalingani na aina ya faili iliyodaiwa.",
  "transfer.failed.storage":
    "Kiambatisho kimefika lakini hakikuweza kuhifadhiwa. Kagua nafasi yako iliyo wazi.",
  "transfer.badge.waiting": "Inasubiri · {name}",
  "transfer.badge.active_count": "Uhamishaji {count}",
  "transfer.badge.sending": "Inatuma {name}",
  "transfer.badge.receiving": "Inapokea {name}",
  "transfer.badge.a11y": "{label}, asilimia {percent}. Fungua mazungumzo.",
  "transfer.kind.photo": "Picha",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Noti ya sauti",
  "transfer.this.photo": "Picha hii",
  "transfer.this.video": "Video hii",
  "transfer.this.voice": "Noti hii ya sauti",
  "transfer.this.file": "Faili hii",
  "transfer.kind.document": "Hati",
  "transfer.kind.voice_preview": "Noti ya sauti",
  "transfer.kind.photo_preview": "Picha",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Hati",

  // ---- System notifications ----
  "notif.channel.messages": "Jumbe",
  "notif.channel.nearby": "Peer walio karibu",
  "notif.channel.nearby_desc":
    "Taarifa ya mara kwa mara pale mesh inapopata watu ndani ya masafa ya Bluetooth.",
  "notif.nearby.body":
    "Yuko ndani ya masafa ya Bluetooth sasa. Gusa ili kufungua mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Mtu fulani",
  "notif.notice_urgent": "Tangazo la dharura · {content}",
  "notif.notice": "Tangazo · {content}",
  "notif.incoming_file": "Faili inayoingia",
  "notif.preview.photo": "📷 Picha",
  "notif.preview.voice": "🎤 Ujumbe wa sauti",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Hati",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Ujumbe mpya",
  "notif.hidden.channel": "Shughuli mpya",
  "notif.hidden.mention": "Umetajwa",
  "notif.mention.title": "{sender} amekutaja",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Onyesha {count} zaidi",
    other: "Onyesha {count} zaidi",
  },
  "chat.channels.show_more_a11y": {
    one: "Onyesha kituo {count} zaidi cha kawaida",
    other: "Onyesha vituo {count} zaidi vya kawaida",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} haijasomwa",
    other: "{label}, {count} hazijasomwa",
  },
  "a11y.new_count": {
    one: "{label}, {count} mpya",
    other: "{label}, {count} mpya",
  },
  "chat.a11y.unread": {
    one: "{count} haijasomwa",
    other: "{count} hazijasomwa",
  },
  "chat.thread.length_left": {
    one: "{count} imesalia",
    other: "{count} zimesalia",
  },
  "settings.general.retention_days": {
    one: "siku {count}",
    other: "siku {count}",
  },
  "chat.info.group_reach": {
    one: "{reachable} kati ya mwanachama {count} anapatikana",
    other: "{reachable} kati ya wanachama {count} wanapatikana",
  },
  "chat.group_members": {
    one: "Kikundi cha faragha  ·  mwanachama {count}",
    other: "Kikundi cha faragha  ·  wanachama {count}",
  },
  "chat.select.count": {
    one: "{count} imechaguliwa",
    other: "{count} zimechaguliwa",
  },
  "chat.select.forward": {
    one: "Sambaza ujumbe {count}",
    other: "Sambaza jumbe {count}",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} anazungumza",
    other: "{count} wanazungumza",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "peer {count} yuko ndani ya masafa",
    other: "peer {count} wako ndani ya masafa",
  },
  "mesh.peer.hops_away": {
    one: "hatua {count} kutoka hapa",
    other: "hatua {count} kutoka hapa",
  },
  "chat.presence.active": {
    one: "{count} yuko hai",
    other: "{count} wako hai",
  },
  "chat.presence.nearby": {
    one: "{count} yuko karibu",
    other: "{count} wako karibu",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "mint {count}",
    other: "mint {count}",
  },
  "wallet.mint.remove_body": {
    one: "{mint} inashikilia {balance} {unit} katika uthibitisho {count}. Kuiondoa kunafuta uthibitisho huo kwenye kifaa hiki kabisa na hakuna nakala rudufu. Toa au tuma salio kwanza.",
    other:
      "{mint} inashikilia {balance} {unit} katika thibitisho {count}. Kuiondoa kunafuta thibitisho hizo kwenye kifaa hiki kabisa na hakuna nakala rudufu. Toa au tuma salio kwanza.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "Amana {count} inasubiri malipo. Inakaguliwa upya kila mara programu inapofunguliwa.",
    other:
      "Amana {count} zinasubiri malipo. Zinakaguliwa upya kila mara programu inapofunguliwa.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Umerejesha uthibitisho {count} ambao haujatumika kutoka {mints}.",
    other: "Umerejesha thibitisho {count} ambazo hazijatumika kutoka {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "Sarafu {count} ilipatikana lakini ilikuwa imeshatumika, kwa hivyo hakuna kilichowekwa kwa ajili yake. Hilo ni la kawaida: kila sarafu uliyowahi kutumia hubaki kwenye kumbukumbu zinazohifadhiwa na mint.",
    other:
      "Sarafu {count} zilipatikana lakini zilikuwa zimeshatumika, kwa hivyo hakuna kilichowekwa kwa ajili yake. Hilo ni la kawaida: kila sarafu uliyowahi kutumia hubaki kwenye kumbukumbu zinazohifadhiwa na mint.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Onyesha {count} zaidi",
    other: "Onyesha {count} zaidi",
  },
  "wallet.activity.show_more_a11y": {
    one: "Onyesha malipo {count} zaidi",
    other: "Onyesha malipo {count} zaidi",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} haijathibitishwa",
    other: "{count} hazijathibitishwa",
  },
  "wallet.proof_count": {
    one: "uthibitisho {count}",
    other: "thibitisho {count}",
  },
  "wallet.spent_removed_detail": {
    one: "Uthibitisho {count} ulikuwa umeshatumika na umeondolewa.",
    other: "Thibitisho {count} zilikuwa zimeshatumika na zimeondolewa.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Kuna mtu karibu",
    other: "Watu {count} wako karibu",
  },
};

export const sw = { strings, plurals };
