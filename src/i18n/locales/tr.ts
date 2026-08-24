// tr: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "İptal",
  "common.done": "Bitti",
  "common.ok": "Tamam",
  "common.close": "Kapat",
  "common.back": "Geri",
  "common.delete": "Sil",
  "common.remove": "Kaldır",
  "common.add": "Ekle",
  "common.copy": "Kopyala",
  "common.copied": "Kopyalandı",
  "common.share": "Paylaş",
  "common.continue": "Devam",
  "common.try_again": "Yeniden dene",
  "common.settings": "Ayarlar",
  "common.off": "Kapalı",

  // ---- Dates ----
  "format.today": "Bugün",
  "format.yesterday": "Dün",
  "format.minutes_ago": "{count} dk önce",
  "format.hours_ago": "{count} sa önce",
  "format.days_ago": "{count} g önce",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Sohbetler",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Cüzdan",
  "nav.tab.profile": "Sen",
  "a11y.tab.new_peers": "{label}, yakında yeni biri var",
  "nav.notifications": "Bildirimler",
  "chat.subtab.channels": "Kanallar",
  "chat.subtab.direct": "Doğrudan",
  "chat.subtab.dms": "Doğrudan mesajlar",
  "chat.search.placeholder": "Sohbetlerde ara…",
  "chat.search.a11y": "Sohbetlerde ve mesajlarda ara",
  "chat.search.close": "Aramayı kapat",
  "chat.search.clear": "Aramayı temizle",
  "mesh.view.radar": "Radar görünümü",
  "mesh.view.list": "Liste görünümü",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Liste",

  // ---- Legal document names ----
  "legal.last_updated": "Son güncelleme: {date}",
  "legal.terms": "Kullanım Koşulları",
  "legal.privacy": "Gizlilik Politikası",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Özel mesh iletişimi",
  "onboarding.welcome.cta": "Başla",
  "onboarding.welcome.cta_hint":
    "Devam etmek için aşağıdaki koşulları kabul et",
  "onboarding.welcome.consent_a11y":
    "Kullanım Koşulları'nı ve Gizlilik Politikası'nı kabul et",
  "onboarding.welcome.open_terms": "Kullanım Koşulları'nı aç",
  "onboarding.welcome.open_privacy": "Gizlilik Politikası'nı aç",
  "onboarding.welcome.consent":
    "{cta} düğmesine dokunarak {terms} ve {privacy} metinlerimizi kabul etmiş olursun.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Kimliğin oluşturuluyor",
  "onboarding.identity.body":
    "Bu cihazda bir Ed25519 anahtar çifti oluşturuluyor.\nHiçbir yere hiçbir şey gönderilmiyor.",
  "onboarding.identity.failed_heading": "Anahtarların oluşturulamadı",
  "onboarding.identity.failed_body":
    "Bu cihaz, Airhop'un anahtarları güvenli biçimde saklamasına izin vermedi. Yeniden dene ya da telefonu yeniden başlatıp Airhop'u tekrar aç.",
  "onboarding.identity.steps_a11y": "Adımlar: {steps}",
  "onboarding.identity.step.x25519":
    "Statik X25519 anahtar çifti oluşturuluyor",
  "onboarding.identity.step.ed25519":
    "Ed25519 imzalama anahtar çifti oluşturuluyor",
  "onboarding.identity.step.keychain":
    "Anahtarlar işletim sistemi anahtar zincirine yazılıyor",
  "onboarding.identity.step.peer_id": "Eş kimliği türetiliyor",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Mesh üzerindeki adın",
  "onboarding.username.peer_id": "Eş kimliği",
  "onboarding.username.card_a11y":
    "Mesh üzerindeki adın {username}. Eş kimliği {peerID}. {props}.",
  "onboarding.username.explanation":
    "Bu kullanıcı adı, açık anahtarından belirlenimci biçimde türetilir. Eş kimliğini gören her cihazda aynıdır.",
  "onboarding.username.cta": "Airhop'a gir",
  "onboarding.username.prop.algorithm": "Algoritma",
  "onboarding.username.prop.storage": "Saklama",
  "onboarding.username.prop.storage_value":
    "Yalnızca işletim sistemi anahtar zinciri",
  "onboarding.username.prop.account": "Hesap gerekir",
  "onboarding.username.prop.account_value": "Yok",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop'a hoş geldin",
  "onboarding.hello.p1":
    "Merhaba. Airhop, bitchat üzerine kurulmuş bağımsız ve açık kaynaklı bir yan projedir. bitchat projesiyle ya da permissionless tech ile bağlantılı değildir, onlar tarafından desteklenmez; yalnızca geliştirmekten ve toplulukla paylaşmaktan keyif aldığım bir şeydir.",
  "onboarding.hello.p2":
    "Bu, iOS ve Android için ilk sürüm. Arkadaşlarımla denemiş olsam da muhtemelen birkaç hatayla karşılaşacaksın. Karşılaşırsan ya da bir özellik fikrin varsa duymak isterim. {github} üzerinde bir konu aç ya da bana {email} adresinden yaz.",
  "onboarding.hello.p3":
    "Airhop işine yarıyorsa {github} üzerinde bir yıldız ya da {store} üzerinde bir değerlendirme bırakabilirsin. Bu, projeyi daha çok kişinin bulmasına yardım eder. Denediğin için teşekkürler!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Telefonun sormadan önce",
  "onboarding.primer.lede": "Her birinin ne yaptığı ve ne yapmadığı şöyle.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Yakındaki cihazları bulur ve mesajları aralarında aktarır. Mesh böyle kurulur ve internet bağlantısı olmadan çalışır.",
  "onboarding.primer.location.title": "Konum",
  "onboarding.primer.location.body":
    "Seni bir sokak arasından bir bölgeye kadar yakın alan kanallarına yerleştirir. Airhop seni asla izlemez ve kesin konumunu cihazının dışına göndermez.",
  "onboarding.primer.notifications.title": "Bildirimler",
  "onboarding.primer.notifications.body":
    "Uygulama kapalıyken bile yeni mesajlar için uyarı al. Bildirimler cihazında yerel olarak oluşturulur, hiçbir sunucu işin içinde değildir.",
  "onboarding.primer.footnote":
    "Hayır diyebilirsin. Mesajlar yine internet üzerinden yol alır ve fikrini sonradan Ayarlar'dan değiştirebilirsin.",
  "onboarding.primer.cta_a11y": "İzin sorularına geç",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Bluetooth erişimi",
  "permission.bluetooth.purpose":
    "mesh üzerinden yakındaki cihazları keşfetmek",
  "permission.open_settings": "Ayarlar'ı aç",
  "permission.not_now": "Şimdi değil",
  "permission.blocked_title": "{label} kapalı",
  "permission.blocked_body": "{purpose} için Ayarlar'dan aç.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Bir şeyler ters gitti",
  "error.boundary.body":
    "Airhop beklenmedik bir sorunla karşılaştı ve gösterdiği şeyi durdurmak zorunda kaldı.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Varsayılan kanallar",
  "chat.channels.yours": "Kanalların",
  "chat.channels.none": "Henüz kanal yok",
  "chat.channels.none_hint":
    "Bir kanala katılmak ya da oluşturmak için yukarıdaki {plus} düğmesine dokun.",
  "chat.channels.none_desc":
    "Henüz kanal yok. Bir kanala katılmak ya da oluşturmak için başlıktaki ekleme düğmesini kullan.",
  "chat.channels.show_fewer": "Daha az varsayılan kanal göster",
  "chat.channels.show_less": "Daha az göster",
  "chat.channels.info": "Kanal bilgisi",
  "chat.channels.pin": "Kanalı sabitle",
  "chat.channels.unpin": "Kanal sabitlemesini kaldır",
  "chat.channels.mute": "Kanalı sessize al",
  "chat.channels.unmute": "Kanalın sesini aç",
  "chat.channels.leave": "Kanaldan ayrıl",
  "chat.channels.leave_confirm": "Ayrıl",
  "chat.channels.clear_body":
    "{name} kanalındaki tüm mesajlar silinsin mi? Bu geri alınamaz.",
  "chat.channels.leave_body":
    "{name} kanalından ayrılınsın mı? Mesajlarını almayı bırakacaksın ve geçmişi bu cihazdan kaldırılacak.",
  "chat.channels.more_options": "{name} için diğer seçenekler",
  "chat.channels.teleported_tag": "{level}  ·  ışınlandı",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Sohbeti temizle",
  "chat.dm.remove_contact": "Kişiyi kaldır",
  "chat.dm.block": "Bu eşi engelle",
  "chat.dm.block_confirm": "Engelle",
  "chat.dm.delete": "Sohbeti sil",
  "chat.dm.delete_body":
    "Bu, konuşmayı listenden kaldırır ve mesajlarını siler. Kişi kalır ve ondan gelecek yeni bir mesaj yeni bir sohbet başlatır.",
  "chat.dm.in_range": "menzilde",
  "chat.dm.row_hint": "Diğer seçenekler için iki kez dokunup basılı tut",
  "chat.channels.row_hint": "Diğer seçenekler için iki kez dokunup basılı tut",
  "chat.dm.you_prefix": "Sen:",
  "chat.dm.none": "Doğrudan mesaj yok",
  "chat.dm.none_desc":
    "Şifreli bir doğrudan mesaj başlatmak için Mesh sekmesine gidip bir eşe dokun.",
  "chat.dm.contact_info": "Kişi bilgisi",
  "chat.dm.pin": "Sohbeti sabitle",
  "chat.dm.unpin": "Sohbet sabitlemesini kaldır",
  "chat.dm.mute": "Sohbeti sessize al",
  "chat.dm.unmute": "Sohbetin sesini aç",
  "chat.dm.clear_body":
    "{name} ile olan tüm mesajlar silinsin mi? Bu geri alınamaz.",
  "chat.dm.remove_contact_body":
    "{name} kaldırılsın mı? Bu, konuşmayı siler ve kişiyi unutur. Yeniden yazarlarsa sana yine ulaşabilirler.",
  "chat.dm.block_body":
    "{name} engellensin mi? Onları Mesh sekmesinde görmeyecek ve yakında olsalar bile mesajlarını almayacaksın.",
  "chat.dm.more_options": "{name} için diğer seçenekler",
  "chat.dm.remove_contact_short": "Kişiyi kaldır",
  "chat.dm.block_short": "Kişiyi engelle",
  "chat.dm.delete_short": "Sohbeti sil",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Mesajları temizle",
  "chat.clear_confirm": "Temizle",
  "chat.group_badge": "Grup",
  "chat.more": "Daha fazla",
  "chat.no_messages": "Henüz mesaj yok",
  "chat.you": "Sen",
  "chat.a11y.channel": "{name} kanalı",
  "chat.a11y.group": "{name} grubu",
  "chat.a11y.muted": "sessize alındı",
  "chat.a11y.pinned": "sabitlendi",

  // ---- Chats: start something new ----
  "chat.new.title": "Yeni bir şey başlat",
  "chat.new.channel": "Özel bir kanal oluştur",
  "chat.new.channel_label": "Özel kanal",
  "chat.new.channel_desc":
    "Bağlantısı olan herkesin katılabileceği bir oda. Bir tane oluştur ya da sana gönderilen bir bağlantıyla katıl.",
  "chat.new.group": "Özel bir grup oluştur",
  "chat.new.group_label": "Özel grup",
  "chat.new.group_desc":
    "Belirli kişileri seç. En fazla 16. Bluetooth üzerinde kalır.",
  "chat.new.place": "Geohash ile bir yere git",
  "chat.new.place_label": "Bir yere git",
  "chat.new.place_desc": "Geohash'iyle herhangi bir yerdeki konum kanalını aç.",
  "chat.new.reach": "Erişim",
  "chat.new.reach_internet": "Üyelere Bluetooth ve internet üzerinden ulaşır.",
  "chat.new.reach_mesh":
    "Bluetooth menzilinde çalışır, internet üzerinden değil.",
  "chat.new.reach_internet_desc":
    "Üyelere internet üzerinden de ulaşır. Aktarıcılar kanalın etkin olduğunu görebilir, asla mesajlarını ya da içindekileri değil.",
  "chat.new.reach_mesh_desc":
    "Yerel mesh üzerinde kalır. En özeli, hiçbir şey Bluetooth menzilinin dışına çıkmaz.",
  "chat.new.join_link": "Bir davet bağlantısıyla özel kanala katıl",
  "chat.new.back_to_chooser": "Seçime geri dön",
  "chat.new.create_channel": "Kanal oluştur",
  "chat.new.name_required": "Önce bir kanal adı gir",
  "chat.new.name_taken": "O ad zaten alınmış",
  "chat.new.create": "Oluştur",
  "chat.new.e2ee": "Uçtan uca şifreli. Mesajları yalnızca üyeler okuyabilir.",
  "chat.new.invite_only":
    "Yalnızca davetle. Bağlantıyı paylaştığın herkes katılabilir. Diğer herkesten, yakındaki eşlerden bile gizli kalır.",
  "chat.new.name_exists": "Bu adda bir kanal zaten var.",
  "chat.new.reach_bluetooth_chip": "Yalnızca Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Bir davet bağlantısıyla katıl",

  // ---- Chats: join by link ----
  "chat.join.title": "Bağlantıyla katıl",
  "chat.join.not_airhop": "Bu bir Airhop bağlantısı değil.",
  "chat.join.reach_internet": "Üyelere Bluetooth ve internet üzerinden ulaşır.",
  "chat.join.reach_mesh": "Bluetooth menzilinde kalır.",
  "chat.join.contact_card":
    "Bir kişi kartı. Onları kişilerine ekler ve sohbeti açar.",
  "chat.join.unverified": "O bağlantı doğrulanamadı",
  "chat.join.unverified_body":
    "Kişi kartı kendi anahtarlarıyla uyuşmuyor, bu yüzden eklenmedi. Yenisini göndermelerini iste.",
  "chat.join.paste": "Panodan yapıştır",
  "chat.join.join": "Katıl",
  "chat.join.public_channel":
    "Herkese açık kanal {name}. Yakındaki herkes okuyabilir.",
  "chat.join.private_channel": "Özel kanal {name}. {reach}",
  "chat.join.dm_with": "{name} ile doğrudan mesaj.",
  "chat.join.joined_as": "{name} olarak katıldın",
  "chat.join.name_clash_body":
    "Zaten farklı bir {name} içindesin. Kanal adları yalnızca etikettir, bu yüzden bu davet kendi kanalını açtı ve içinde bulunduğun kanala dokunulmadı. İkisini de kanal bilgisinden yeniden adlandırabilirsin.",
  "chat.join.paste_hint":
    "airhop:// ile başlayan bir davet yapıştır. Bir bağlantıya dokunmak da çalışır; bu, dokunamadığın bir bağlantı içindir.",
  "chat.join.key_note":
    "Özel kanal daveti anahtarı taşır, bu yüzden katılmak anında olur ve başka kimseye bir şey sorulmaz.",
  "chat.join.offline_note":
    "Çevrimdışı çalışır. Bağlantı bu cihazda okunur ve kanal, oluşturanın ayarladığı kadar uzağa ulaşır.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "O hücre açılamadı. Birazdan yeniden dene.",
  "chat.jump.title": "Bir yere git",
  "chat.jump.saved": "KAYITLI YERLER",
  "chat.jump.anywhere":
    "Herhangi bir yerdeki herkese açık konum kanalını aç, bulunmadığın bir yeri bile.",
  "chat.jump.geohash_note":
    "Geohash'ini gir. Konumu o hücreye düşen herkes kanalı paylaşır.",
  "chat.jump.teleport_note":
    "Yakında değil, ışınlanmış olarak görünürsün. Yalnızca internet üzerinden ulaşır.",
  "chat.jump.level_cell": "{level} düzeyinde hücre",
  "chat.jump.already_here": "Zaten buradasın. Git, {name} kanalını açar.",
  "chat.jump.open_direction": "{direction} yönündeki hücreyi aç",
  "chat.jump.open_place": "{name} aç",
  "chat.jump.remove_place": "{name} kayıtlı yerlerden kaldır",
  "chat.jump.go": "Git",
  "chat.jump.how":
    "Geohash bulmak için: bir konum kanalı aç > adına dokun > oradan kopyala.",

  // ---- Chats: private groups ----
  "chat.group.unreachable": "Her üyeye ulaşılamadı. Yakındayken yeniden dene.",
  "chat.group.you_were_added": "{name} grubuna eklendin.",
  "chat.group.added_you": "Seni {name} grubuna ekledi",
  "chat.group.you_were_removed":
    "{name} grubundan çıkarıldın. Burada artık okuyamaz ya da mesaj gönderemezsin.",
  "chat.group.removed_you": "Seni {name} grubundan çıkardı",
  "chat.group.add_failed": "Eklenemediler",
  "chat.group.add_failed_body":
    "Hiçbir şey değişmedi. Ya şu anda ulaşılabilir değiller, ya grup 16 ile dolu, ya da grubu sen oluşturmadın.",
  "chat.group.remove_failed": "Çıkarılamadılar",
  "chat.group.remove_failed_body":
    "Hiçbir şey değişmedi. Grubun kimlerden oluştuğunu yalnızca onu oluşturan kişi değiştirebilir.",
  "chat.group.e2ee": "Uçtan uca şifreli. Mesajları yalnızca üyeler okuyabilir.",
  "chat.group.cap":
    "Senin seçtiğin en fazla 16 kişi. Davet bağlantısı yoktur, bu yüzden kimse iletilen bir bağlantıyla katılamaz.",
  "chat.group.bluetooth":
    "Yalnızca Bluetooth. Menzil dışındaki üyeler geri döndüklerinde mesajları alır.",
  "chat.group.members_label": "ÜYELER",
  "chat.group.none_in_range":
    "Menzilde kimse yok. Grubu oluştururken üyelerin yakında olması gerekir.",
  "chat.group.create_title": "Bir grup oluştur",
  "chat.group.name_placeholder": "Grup adı",
  "chat.group.create": "Oluştur",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Yerel mesh · yalnızca Bluetooth",
  "chat.scope.mesh_desc":
    "Bluetooth menzilindeki cihazlara ulaşır (kabaca 10 ila 100 metre). İnternet gerekmez. Yerinde eşgüdüm için ideal.",
  "chat.scope.block": "Sokak arası · ~100 m",
  "chat.scope.block_desc":
    "Sokak arası ölçeğinde kapsama. Bluetooth menzilinin hemen dışındaki ama yakındaki eşler katılabilsin diye mesajlar internet üzerinden köprülenir.",
  "chat.scope.neighborhood": "Mahalle · ~1 km",
  "chat.scope.neighborhood_desc":
    "Mahalle düzeyinde kapsama. Aktarıcı desteğiyle, doğrudan Bluetooth bağlantısı olmadan bile alandaki eşlere ulaşılabilir.",
  "chat.scope.city": "Şehir · ~10 km",
  "chat.scope.city_desc":
    "Şehir geneli kanal. Büyükşehir alanındaki eşlere ulaşmak için coğrafi konumlu internet aktarıcıları kullanır.",
  "chat.scope.province": "İl ya da eyalet · ~100 km",
  "chat.scope.province_desc":
    "İl ya da eyalet düzeyinde kapsama. Yüzlerce kilometrelik bölgesel erişim için internet üzerinden köprülenir.",
  "chat.scope.country": "Ülke ya da bölge · ~1000 km",
  "chat.scope.country_desc":
    "Ülke geneli kapsama. Bölgedeki her Airhop ya da bitchat kullanıcısı katılıp mesajları okuyabilir.",
  "chat.transport.bluetooth": "Yalnızca Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Yalnızca internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "/{cmd} komutu: {hint}",
  "chat.cmd.hug_hint": "Sıcak bir sarılma gönder",
  "chat.cmd.slap_hint": "Kocaman bir alabalıkla şaplak at",
  "chat.status.sending": "Gönderiliyor…",
  "chat.status.undo_send": "Göndermeyi geri al",
  "chat.status.undo": "Geri al",
  "chat.status.sent": "Gönderildi",
  "chat.status.received": "Alındı",
  "chat.status.failed": "Başarısız",
  "chat.status.canceled": "İptal edildi",
  "chat.status.waiting": "Bekliyor",
  "chat.status.sending_short": "Gönderiliyor",
  "chat.status.receiving": "Alınıyor",
  "chat.thread.not_available": "Burada kullanılamıyor",
  "chat.thread.private_channel": "Özel kanal",
  "chat.thread.location_channel": "Konum kanalı",
  "chat.thread.public_channel": "Herkese açık kanal",
  "chat.thread.notices": "Bu kanalın duyuruları",
  "chat.thread.invite": "Bu kanala birini davet et",
  "chat.thread.not_in_range":
    "Bluetooth menzilinde değil. İnternet üzerinden teslim ediliyor.",
  "chat.thread.not_nearby":
    "Yakında değil. Menzile geri döndüklerinde ya da çevrimiçi olduklarında teslim edeceğiz.",
  "chat.thread.no_keys":
    "Onlara yazmak için Bluetooth menzilinde olman ya da kodlarını taraman gerekir.",
  "chat.geo.card_received":
    "{name} kişisini paylaştı. Biriniz taşındıktan sonra da konuşmayı sürdürebilmek için sen de kendininkini paylaş.",
  "chat.geo.exchange_complete":
    "Kişiler değiş tokuş edildi. Artık birbirinize her yerden ulaşabilirsiniz.",
  "chat.geo.keep_person": "Bu kişiyi sakla",
  "chat.geo.keep_person_desc":
    "Biriniz taşındıktan sonra da konuşabilmek için kişini paylaş. Kalıcı kimliğini öğrenecekler.",
  "chat.geo.card_sent": "Paylaşıldı · onlarınki bekleniyor",
  "chat.thread.left_cell":
    "Bu alandan ayrıldın, bu yüzden sana burada ulaşamazlar. Her yerde konuşabilmek için kodları değiş tokuş edin.",
  "chat.thread.no_route":
    "Şu anda onlara ulaşılamıyor. Bir yol açıldığında mesaj gönderilecek.",
  "chat.thread.empty": "Henüz mesaj yok",
  "chat.thread.empty_desc": "Şifreli bir konuşma başlat.",
  "chat.thread.jump_latest": "En son mesaja atla",
  "chat.thread.back_to_members": "Üyelere geri dön",
  "chat.thread.nostr_key": "Nostr açık anahtarı",
  "chat.thread.in_range": "Menzilde",
  "chat.voice.not_recorded": "Sesli not kaydedilmedi",
  "chat.thread.message": "Mesaj",
  "chat.thread.message_placeholder": "Mesaj…",
  "chat.thread.length_full": "Mesaj doldu",
  "chat.thread.waiting_for": "{name} kişisinin dönmesi bekleniyor · %{percent}",
  "chat.thread.peer": "eş",
  "chat.thread.cancel_transfer": "{name} iptal et",
  "chat.thread.queued_more": "Gönderilmeyi bekleyen {count} tane daha",
  "chat.thread.across_bridge": "köprünün karşısında {count}",
  "chat.thread.bridged": "köprülendi",
  "chat.thread.invite_body":
    "Airhop'ta {channel} kanalında bana katıl — önce çevrimdışı çalışan, özel mesh mesajlaşma.",
  "chat.thread.go_back_unread": "Geri dön, {count} okunmamış",
  "chat.thread.view_info": "{name} bilgisini görüntüle",
  "chat.thread.notices_new": "Bu kanalın duyuruları, {count} yeni",
  "chat.thread.say_something": "{channel} kanalında bir şeyler söyle.",
  "chat.thread.jump_latest_new": "En son mesaja atla, {count} yeni",
  "chat.thread.unconfirmed_since": "{date} tarihinden beri teslim onaylanmadı",
  "chat.thread.no_reach": "Yakında eş yok · bunu henüz kimse almadı",
  "chat.thread.channel_needs_internet":
    "İnternet kapalı · bu kanal yalnızca Bluetooth menzilindekilere ulaşır",
  "chat.thread.cell_needs_internet":
    "İnternet kapalı · bu hücreye yalnızca internet üzerinden ulaşılabilir",
  "chat.thread.geo_dm_needs_internet":
    "İnternet kapalı · bu konuşma yalnızca internet üzerinden taşınır",
  "chat.thread.via_gateway":
    "İnternet kapalı · yakındaki bir cihaz bunu senin için çevrimiçi taşıyor",
  "chat.thread.group_queued":
    "Bu gruptan henüz kimse yakında değil. Yakında olduklarında onlara ulaşacak.",
  "chat.thread.no_group_key":
    "Artık bu grupta değilsin, bu yüzden bu gönderilemiyor",
  "chat.thread.no_reach_offline":
    "İnternet kapalı ve yakında eş yok · bunu henüz kimse almadı",
  "chat.thread.mention": "{name} kişisinden söz et",
  "chat.thread.someone_talking": "{hold}. {name} konuşuyor.",
  "chat.thread.attach_note":
    "Dosyalar yalnızca Bluetooth menzilinde gider. Metin ve ödemeler internetteki kişilere ulaşır; ekler ulaşmaz.",
  "chat.thread.message_peer": "{name} kişisine yaz",
  "chat.thread.send": "Mesaj gönder",
  "chat.thread.group": "Grup",
  "chat.bridge.nearby_only":
    "Yalnızca yakında: bu mesajı mesh köprüsünden uzak tut",
  "chat.bridge.nearby_label": "Yalnızca yakında · Bluetooth üzerinde kalır",
  "chat.bridge.bridging_label":
    "Yakındaki alanlara köprüleniyor · yalnızca yakında için dokun",
  "chat.screenshot.you_took": "Ekran görüntüsü aldın",
  "chat.screenshot.you_took_private":
    "Ekran görüntüsü aldın · kimseye söylenmedi",
  "chat.screenshot.heads_up": "Dikkat",
  "chat.screenshot.notice": "* {name} ekran görüntüsü aldı *",
  "chat.screenshot.notified_dm":
    "{name} kişisine bu konuşmanın ekran görüntüsünü aldığın bildirildi.",
  "chat.screenshot.notified":
    "Bu kanaldaki herkese ekran görüntüsü aldığın bildirildi.",
  "chat.screenshot.not_notified":
    "Kimseye bildirilmedi. Bu kanal herkese açık, bu yüzden ekran görüntüsünü duyurmak burada bulunduğunu kayda geçirirdi.",
  "chat.thread.error": "Hata",
  "chat.thread.go_back": "Geri dön",
  "chat.bubble.via_bridge": "mesh köprüsü üzerinden",
  "chat.bubble.view_profile": "{name} kişisinin profilini görüntüle",
  "chat.bubble.forwarded": "İletildi",
  "chat.bubble.attachment": "ek",
  "chat.bubble.a11y": "{sender}: {body}. Diğer seçenekler için basılı tut.",
  "chat.bubble.failed_retry": "Gönderilemedi. Yeniden denemek için dokun.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Mesaj bilgisi",
  "chat.info.delivered_to": "{name} kişisine teslim edildi",
  "chat.info.read_by": "{name} tarafından okundu",
  "chat.info.group_reach_desc": "Şu anda ulaşılabilir, teslim onayı değil",
  "chat.info.group_alone": "Başka üye yok",
  "chat.info.today_at": "Bugün {time}",
  "chat.info.sending": "Gönderiliyor…",
  "chat.info.failed": "Gönderilemedi",
  "chat.info.courier": "Bir dost tarafından taşındı",
  "chat.info.sent": "Gönderildi",
  "chat.info.queued": "Gönderilmeyi bekliyor",
  "chat.info.waiting": "Bekleniyor…",
  "chat.action.info": "Mesaj bilgisi",
  "chat.action.save_photos": "Fotoğraflara kaydet",
  "chat.action.save_copy": "Bir kopyasını kaydet",
  "chat.action.forward": "İlet",
  "chat.action.select": "Seç",
  "chat.select.cancel": "Seçimi iptal et",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Kamera",
  "chat.attach.camera_desc": "Fotoğraf ya da video çek",
  "chat.attach.library": "Fotoğraf galerisi",
  "chat.attach.library_desc": "Galerinden seç",
  "chat.attach.document": "Belge",
  "chat.attach.document_desc": "Herhangi bir dosya ya da PDF gönder",
  "chat.attach.voice": "Sesli not",
  "chat.attach.voice_desc": "Sesli mesaj kaydet ve gönder",
  "chat.attach.ecash": "Ecash gönder",
  "chat.attach.ecash_desc": "Cüzdanından Cashu satı gönder",
  "chat.attach.location": "Konum",
  "chat.attach.location_desc": "Şu anda nerede olduğunu gönder",
  "chat.attach.title": "Ekle",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Bir konum paylaştı",
  "chat.location.received_summary": "Konumunu paylaştı",
  "chat.location.title": "Konum",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago} önce alındı",
  "chat.location.open_maps": "Haritalar'da aç",
  "chat.location.no_forward": "Konumlar iletilmez",
  "chat.location.no_forward_body":
    "Bir konum tek bir kişiye gönderilir. Başkasının da bilmesini istiyorsan bunun yerine kendi konumunu paylaş.",
  "chat.location.no_fix":
    "Bunun ne kadar uzakta olduğunu görmek için konuma izin ver",
  "chat.location.send_title": "Konumunu gönder",
  "chat.location.send_body":
    "{name} tek bir nokta görecek: şu anda bulunduğun yer. Güncellenmeyi sürdürmez.",
  "chat.location.send": "Konum gönder",
  "chat.location.finding": "Konumun bulunuyor…",
  "chat.location.no_location": "Konumun alınamadı",
  "chat.location.no_location_body":
    "Konum erişimine izin ver ve konum hizmetlerinin açık olduğundan emin ol, sonra yeniden dene.",
  "chat.location.not_delivered": "Konumun gönderilemedi",
  "chat.location.not_delivered_body":
    "Bir konum yalnızca güncelken göndermeye değer, bu yüzden sonrası için sıraya alınmaz. {name} ulaşılabilir olduğunda yeniden dene.",
  "chat.location.direction.n": "kuzey",
  "chat.location.direction.ne": "kuzeydoğu",
  "chat.location.direction.e": "doğu",
  "chat.location.direction.se": "güneydoğu",
  "chat.location.direction.s": "güney",
  "chat.location.direction.sw": "güneybatı",
  "chat.location.direction.w": "batı",
  "chat.location.direction.nw": "kuzeybatı",
  "chat.attach.send_anyway": "Yine de gönder",
  "chat.attach.bitchat_too_big": "Bu ulaşmayabilir",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat kullanıyor ve büyük bir dosyada yarı yolda pes ediyor. Yaklaşık 350 KiB altı güvenilirdir. Bir Airhop kişisine göndermenin böyle bir sınırı yoktur.",
  "chat.attach.bitchat_unopenable": "Bunu açamayabilirler",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat kullanıyor; fotoğrafları ve sesli notları gösterir ama diğer her şeyi açamadığı bir dosya olarak listeler. Ulaşacak, yalnızca görüntüleyemeyebilirler.",
  "chat.attach.file": "Bir dosya ekle",
  "chat.attach.unavailable": "Ekler burada kullanılamıyor",
  "chat.attach.not_sent": "Ek gönderilmedi",
  "chat.attach.read_failed":
    "O dosya okunurken bir şeyler ters gitti. Başka bir tane dene.",
  "chat.attach.caption": "Bir açıklama ekle…",
  "chat.attach.send": "Eki gönder",
  "chat.attach.generic": "Ek",
  "chat.media.view_full": "Fotoğrafı tam ekran görüntüle",
  "chat.media.gone_photo": "Fotoğraf bu cihazda yok",
  "chat.media.gone_video": "Video bu cihazda yok",
  "chat.media.gone_voice": "Sesli not bu cihazda yok",
  "chat.media.gone_file": "Dosya bu cihazda yok",
  "chat.media.gone_note":
    "7 günün ardından ya da önbellek temizlendiğinde kaldırıldı",
  "chat.media.ask_resend": "Yeniden iste",
  "chat.media.resend_draft": "{kind} yeniden gönderebilir misin?",
  "chat.media.kind_photo": "o fotoğrafı",
  "chat.media.kind_video": "o videoyu",
  "chat.media.kind_voice": "o sesli notu",
  "chat.media.kind_file": "o dosyayı",
  "chat.media.pause_voice": "Sesli notu duraklat",
  "chat.media.play_voice": "Sesli notu oynat",
  "chat.media.voice_position": "Sesli nottaki konum",
  "chat.media.voice_scrub": "O noktaya atlamak için çubuklar boyunca dokun",
  "chat.media.image": "Görüntü",
  "chat.media.tap_load_photo": "Fotoğrafı yüklemek için dokun",
  "chat.media.open_document": "{name} aç",
  "chat.media.document": "belge",
  "chat.media.tap_load_video": "Videoyu yüklemek için dokun",
  "chat.media.video": "Video",
  "chat.media.photo": "Fotoğraf",
  "chat.media.close_photo": "Fotoğrafı kapat",
  "chat.media.save_photo": "Fotoğrafı fotoğraflarına kaydet",
  "chat.media.share_photo": "Fotoğrafı paylaş",
  "chat.media.saved_videos": "Videolarına kaydedildi",
  "chat.media.saved_photos": "Fotoğraflarına kaydedildi",
  "chat.media.not_saved": "Kaydedilmedi",
  "chat.media.cant_open": "Dosya açılamıyor",
  "chat.media.no_app":
    "Bu cihazda bu dosyayı açacak ya da paylaşacak bir uygulama yok.",
  "chat.media.open_failed":
    "Dosya açılamadı. Önbellekten temizlenmiş olabilir.",
  "media.blocked.nostr_only":
    "Bu kişiyi yalnızca bir aktarıcı üzerinden tanıyorsun. Yalnızca metin gönderilebilir. Fotoğraflar, dosyalar ve sesli notlar Bluetooth gerektirir.",
  "media.blocked.private_channel":
    "Yayınlanan bir ek imzalanır ama şifrelenmez, bu yüzden onu özel bir kanala göndermek açıkta bırakırdı; buradaki metin ise şifreli kalır.",
  "media.blocked.private_group":
    "Yayınlanan bir ek imzalanır ama şifrelenmez, bu yüzden onu özel bir gruba göndermek açıkta bırakırdı; buradaki metin ise şifreli kalır.",
  "media.blocked.location_channel":
    "Bir konum kanalı insanlara internet üzerinden ulaşır, fotoğraflar, dosyalar ve sesli notlar ise Bluetooth üzerinden gider, dolayısıyla hiçbir zaman varmazlardı.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Sesli notlar burada kullanılamıyor",
  "chat.voice.hold_live": "Canlı konuşmak için basılı tut",
  "chat.voice.hold_record": "Sesli not kaydetmek için basılı tut",
  "chat.voice.cancel_recording": "Kaydı iptal et",
  "chat.voice.slide_cancel": "İptal etmek için kaydır",
  "chat.voice.release_cancel": "İptal etmek için bırak",
  "chat.voice.a11y_toggle":
    "Konuşmaya başlamak ya da bitirmek için iki kez dokun.",
  "chat.voice.limit_reached":
    "İki dakika sınırına ulaşıldı, göndermek için bırak",
  "chat.voice.limit_sent": "İki dakika sınırına ulaşıldı, not gönderildi",
  "chat.voice.stop_send": "Kaydı durdur ve gönder",
  "chat.voice.lift_lock": "Eller serbest kaydetmek için yukarı kaydır",
  "chat.voice.live_speaking": "{name} konuşuyor",
  "voice.unavailable": "Canlı ses kullanılamıyor",
  "voice.recording_stopped": "Kayıt durduruldu",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Kamera erişimi",
  "chat.perm.camera_purpose": "gönderilecek bir fotoğraf çekmek",
  "chat.perm.photo_label": "Fotoğraf erişimi",
  "chat.perm.photo_purpose": "gönderilecek bir fotoğraf ya da video seçmek",
  "chat.perm.photo_save_purpose": "bunu fotoğraflarına kaydetmek",
  "chat.perm.mic_label": "Mikrofon erişimi",
  "chat.perm.mic_live_purpose": "yakındaki insanlarla konuşmak",
  "chat.perm.mic_note_purpose": "bir sesli not kaydetmek",
  "chat.perm.recording_stopped": "Kayıt durduruldu",
  "chat.perm.record_failed":
    "Kayıt başlatılamadı. Mikrofon izinlerini denetle.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Alındı",
  "chat.ecash.reclaimed": "Geri alındı",
  "chat.ecash.claiming": "Alınıyor…",
  "chat.ecash.claim": "Al",
  "chat.ecash.claim_amount": "{amount} {unit} al",
  "chat.ecash.already_claimed": "Zaten alındı",
  "chat.ecash.already_claimed_body":
    "Bu jetondaki her kanıt zaten cüzdanında, bu yüzden hiçbir şey eklenmedi.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Elden gelenin en iyisiyle teslim için mesh'e devredildi",
  "chat.info.queued_desc":
    "Onlara bir yol açılana kadar bu telefonda tutuluyor",
  "chat.info.reclaimed": "Geri alındı",
  "chat.info.reclaimed_desc":
    "Bu ödemeyi cüzdanına geri aldın, bu yüzden teslim edilmeyecek",
  "chat.info.about": "Hakkında",
  "chat.info.group_desc":
    "Özel bir grup. Yalnızca oluşturanın eklediği üyeler okuyabilir ve grup Bluetooth üzerinde kalır.",
  "chat.info.teleported_desc":
    "Bu geohash hücresi için herkese açık bir konum kanalı. Hücredeki herkes, Airhop ya da bitchat üzerinde, kanalı internet üzerinden paylaşır. Sen ışınlandın, fiziksel olarak burada değilsin.",
  "chat.info.custom_desc":
    "Özel bir kanal. Adı bilen herkes herhangi bir Airhop ya da bitchat cihazından katılabilir.",
  "chat.info.private_e2ee": "Özel · uçtan uca şifreli",
  "chat.info.public_plain": "Herkese açık · şifresiz",
  "chat.info.group_privacy":
    "Bu grubu yalnızca aşağıda gösterilen üyeler okuyabilir. Mesajlar Bluetooth üzerinde kalır, bu yüzden menzil dışındaki üyeler geri döndüklerinde alır.",
  "chat.info.teleport_privacy":
    "Işınlandığın bir yer. Bu hücredeki herkese internet üzerinden ulaşır, Bluetooth menzilindeki hiç kimseye ulaşmaz.",
  "chat.info.location_off_privacy":
    "Konum kapalı, bu yüzden bu kanal yakındaki cihazlara yalnızca Bluetooth üzerinden ulaşır. Alan hücresine internet üzerinden ulaşmak için konumu aç.",
  "chat.info.invite_privacy":
    "Yalnızca bağlantıyla davet ettiğin kişiler okuyabilir. Diğer herkesten, yakındaki eşlerden bile gizli kalır.",
  "chat.info.public_privacy":
    "Katılan herkes her mesajı okuyabilir. Özel konuşma için doğrudan mesaj kullan; doğrudan mesajlar uçtan uca şifrelidir.",
  "chat.info.remove_member": "Üyeyi çıkar",
  "chat.info.remove_member_body":
    "{name} gruptan çıkarılsın mı? Grup anahtarı değişir, böylece yeni mesajları artık okuyamazlar.",
  "chat.info.message_member": "{name} kişisine yaz",
  "chat.info.remove_member_a11y": "{name} çıkar",
  "chat.info.no_addable":
    "Eklenecek ulaşılabilir eş yok. Üyelerin yakında olması gerekir.",
  "chat.info.add_count": "{count} ekle",
  "chat.info.teleported_tag": "{level}  ·  ışınlandı",
  "chat.info.active": "Etkin",
  "chat.info.members": "Üyeler",
  "chat.info.bookmark": "Bu yeri yer imlerine ekle",
  "chat.info.remove_bookmark": "Yer imini kaldır",
  "chat.info.default_notice":
    "Varsayılan kanallardan ayrılınamaz. Bunlar Airhop mesh protokolünün parçasıdır.",
  "chat.info.custom_channel": "Özel kanal",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Geohash'i kopyala",
  "chat.info.relays": "Aktarıcılar",
  "chat.info.show_relays": "Bu kanalı taşıyan aktarıcıları göster",
  "chat.info.relay_custom": "özel",
  "chat.info.relays_none": "Yok. Bu hücre şu anda yalnızca Bluetooth.",
  "chat.info.search_members": "Üyelerde ara",
  "chat.info.search_members_placeholder": "Üyelerde ara…",
  "chat.info.teleported": "Işınlandı",
  "chat.info.creator": "Oluşturan",
  "chat.info.no_matches": "Eşleşme yok",
  "chat.info.no_one_here": "Henüz kimse yok",
  "chat.info.add_members": "Üye ekle",
  "chat.info.add_selected": "Seçilen üyeleri ekle",
  "chat.info.add": "Ekle",
  "chat.info.leave_group": "Gruptan ayrıl",
  "chat.info.leave_channel": "Kanaldan ayrıl",
  "chat.info.leave": "Ayrıl",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} tarihinden beri sohbet ediyorsunuz",
  "chat.contact.verified_since": "{date} tarihinden beri doğrulandı",
  "chat.contact.anonymous": "Anonim",
  "chat.contact.anonymous_desc":
    "Doğrulanacak kalıcı bir kimliği olmayan bir geohash takma adı",
  "chat.contact.verified": "Doğrulandı",
  "chat.contact.verified_desc": "QR kodlarını taradın",
  "chat.contact.verified_desc_compared": "Onlarla kod karşılaştırdın",
  "chat.contact.not_verified": "Doğrulanmadı",
  "chat.contact.not_verified_desc":
    "Gerçekten onlar olduğunu doğrulamak için kodlarını tara ya da telefonda bir kod karşılaştır",
  "chat.contact.e2ee": "Uçtan uca şifreli",
  "chat.contact.e2ee_nostr":
    "NIP-17 ile sarmalanmış, bu yüzden aktarıcılar okuyamaz",
  "chat.contact.e2ee_mesh":
    "Noise XX, ayrıca Airhop cihazları arasında Double Ratchet",
  "chat.contact.copy_nostr": "Nostr açık anahtarını kopyala",
  "chat.contact.nostr_key": "Nostr açık anahtarı",
  "chat.contact.cell_key_note":
    "Bu anahtar, tanıştığınız alana aittir. Biriniz taşınırsa değişir ve konuşma onunla birlikte biter. Her yerde konuşabilmek için kişileri değiş tokuş edin.",
  "chat.contact.peer_name": "Eş adı",
  "chat.contact.peer_id": "Eş kimliği",
  "chat.contact.rename": "Yeniden adlandır",
  "chat.contact.rename_needs_contact":
    "Anahtarlarını tuttuğun kişileri yeniden adlandırabilirsin. Önce kişi kartlarını değiş tokuş edin, sonra bu yalnızca senin gördüğün bir ad olur.",
  "chat.contact.rename_needs_keys":
    "Bu kişi için henüz anahtar yok. Onlara yaz ya da kodlarını tara, sonra onlara yalnızca senin gördüğün bir ad verebilirsin.",
  "chat.contact.renamed_by_you": "Onlar için verdiğin ad",
  "chat.contact.copy_peer_id": "Eş kimliğini kopyala",
  "chat.contact.verify": "Kişiyi doğrula",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Duyurular",
  "chat.notices.post_area": "Bu alana bir duyuru as",
  "chat.notices.post_mesh": "Mesh üzerine bir duyuru as",
  "chat.notices.mark_urgent": "Acil olarak işaretle",
  "chat.notices.post": "Duyuru as",
  "chat.notices.post_short": "As",
  "chat.notices.delete": "Duyuruyu sil",
  "chat.notices.just_now": "az önce",
  "chat.notices.fades_soon": "yakında solar",
  "chat.notices.1_day": "1 gün",
  "chat.notices.3_days": "3 gün",
  "chat.notices.7_days": "7 gün",
  "chat.notices.fading": "soluyor",
  "chat.notices.fades_in_hours": "{count} sa içinde solar",
  "chat.notices.fades_in_days": "{count} g içinde solar",
  "chat.notices.scope_geo": "Coğrafi",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Acil",
  "chat.notices.permanent_warning":
    "Hiç solmaz. Herkese açık ve bu alana bağlı, üstelik geri alamazsın.",
  "chat.notices.none":
    "Henüz duyuru yok. Başkaları için burada kalsın diye bir tane as.",

  // ---- Chats: search results ----
  "chat.search.photos": "Fotoğraflar",
  "chat.search.videos": "Videolar",
  "chat.search.audio": "Ses",
  "chat.search.documents": "Belgeler",
  "chat.search.links": "Bağlantılar",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "{filter} ile süz",
  "chat.search.no_matches": "“{query}” ile eşleşen {filter} yok",
  "chat.search.no_media": "Henüz {filter} yok",
  "chat.search.result_a11y": "{chat}, {sender} kişisinden {kind}",
  "chat.search.you": "sen",
  "chat.search.section_chats": "Sohbetler",
  "chat.search.section_messages": "Mesajlar",
  "chat.search.section_notices": "Duyurular",
  "chat.search.hint":
    "Mesajlarda ve sohbetlerde ara ya da yukarıdan bir süzgeç seç.",
  "chat.search.no_results": "“{query}” için sonuç yok",
  "chat.search.open_chat": "{name} aç",
  "chat.search.message_a11y": "{chat}, {sender} kişisinden mesaj: {snippet}",
  "chat.search.notice_a11y":
    "{chat} içinde {author} kişisinden duyuru: {snippet}",
  "chat.search.urgent": "Acil ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Bu listede {count} tane var. Temizlemek onları yalnızca buradan kaldırır ve mesajlar kendi konuşmalarında okunmamış kalır. Tümünü okundu işaretlemek ikisini birden temizler.",
  "chat.notif.mark_all_read": "Tümünü okundu işaretle",
  "chat.notif.clear_list": "Listeyi temizle",
  "chat.notif.clear_all_a11y": "{count} bildirimin tümünü temizle",
  "chat.notif.title": "Bildirimler",
  "chat.notif.clear_short": "Temizle",
  "chat.notif.close": "Bildirimleri kapat",
  "chat.notif.none": "Henüz bildirim yok",
  "chat.notif.none_desc":
    "Kanallarından ve sohbetlerinden gelen mesajlar, sözler ve duyurular burada görünür.",
  "chat.notif.new": "Yeni",
  "chat.notif.notice_in": "{channel} içinde duyuru",

  // ---- Chats: forward ----
  "chat.forward.title": "Şuraya ilet…",
  "chat.forward.to": "{name} kişisine ilet",
  "chat.forward.cant_send_here": "Buraya iletilemiyor",
  "chat.forward.cant_send_to": "{name} kişisine iletilemiyor",
  "chat.forward.channels": "Kanallar",
  "chat.forward.groups": "Gruplar",
  "chat.forward.locations": "Konumlar",
  "chat.forward.dms": "Doğrudan mesajlar",
  "chat.forward.none": "Henüz başka sohbet yok",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Mesh başlatılıyor…",
  "mesh.banner.no_bluetooth": "Bu cihazda Bluetooth yok · yalnızca internet",
  "mesh.banner.bluetooth_off": "Bluetooth kapalı · mesh kullanılamıyor",
  "mesh.banner.permission_needed": "Bluetooth izni gerekiyor",
  "mesh.banner.blocked": "Bluetooth engellendi · Ayarlar'dan izin ver",
  "mesh.banner.location_permission": "Eşleri bulmak için konum gerekiyor",
  "mesh.banner.advertising_unsupported":
    "Bu telefon başkalarını görebiliyor ama keşfedilemiyor",
  "mesh.banner.location_off_android":
    "Konum kapalı · Android eşleri bulmak için buna ihtiyaç duyuyor",
  "mesh.banner.paused": "Mesh duraklatıldı · uzaktasın",
  "mesh.banner.location_off": "Konum kapalı · konum kanalları kullanılamıyor",
  "mesh.banner.battery_saver": "Pil tasarrufu · daha seyrek tarama",
  "mesh.banner.wipe_incomplete":
    "Temizlik yarım kaldı · bazı veriler kalmış olabilir, yeniden açılınca tekrar denenir",
  "mesh.banner.wifi_off": "Wi-Fi kapalı · büyük dosyalar daha yavaş gider",
  "mesh.banner.clock_skew":
    "Bu telefonun saati yanlış · tarih ve saati otomatiğe al",
  "mesh.banner.internet_off": "İnternet kapalı · yalnızca Bluetooth",
  "mesh.banner.relaying": "Yakında eş yok · Nostr üzerinden aktarılıyor",
  "mesh.banner.tor": "Tor açık · internet trafiği yönlendiriliyor",
  "mesh.banner.tor_starting": "Tor başlatılıyor · bağlanılıyor",
  "mesh.banner.tor_blocked": "Tor bağlanamadı · mesh yine de çalışıyor",
  "mesh.banner.gateway":
    "İnternet geçidi açık · yakındaki eşler için aktarılıyor",
  "mesh.banner.bridge": "Mesh köprüsü açık · herkese açık sohbet bağlandı",
  "mesh.banner.background_limits": "{brand} arka planda mesh'i duraklatabilir",
  "mesh.banner.bridge_across":
    "Mesh köprüsü açık · köprünün karşısında {count}",
  "mesh.banner.action.turn_on": "Aç",
  "mesh.banner.action.allow": "İzin ver",
  "mesh.banner.action.resume": "Sürdür",
  "mesh.banner.action.fix": "Düzelt",
  "mesh.banner.hint.resume": "Bluetooth yayınını ve taramasını yeniden açar",
  "mesh.banner.hint.enable_bluetooth": "Android'den Bluetooth'u açmasını ister",
  "mesh.banner.hint.location_settings": "Sistemin konum ayarlarını açar",
  "mesh.banner.hint.app_settings": "Airhop izinlerini sistem ayarlarında açar",
  "mesh.banner.hint.battery_settings":
    "Bu telefonun arka plan etkinliği ayarlarını açar",
  "mesh.banner.dismiss": "Kapat: {label}",
  "mesh.banner.hint.dismiss": "Bu notu kalıcı olarak gizler",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Yakındaki eşler aranıyor…",
  "mesh.radar.starting": "Mesh başlatılıyor…",
  "mesh.radar.no_bluetooth": "Bu cihazda Bluetooth yok",
  "mesh.radar.bluetooth_off": "Bluetooth kapalı · taranmıyor",
  "mesh.radar.permission_needed": "Bluetooth izni gerekiyor",
  "mesh.radar.blocked": "Bluetooth engellendi",
  "mesh.radar.location_permission": "Konum izni gerekiyor",
  "mesh.radar.location_off": "Konum kapalı · taranmıyor",
  "mesh.radar.hint_rings":
    "Halkalar uzaklığı değil, BLE sinyal gücünü gösterir",
  "mesh.radar.hint_checking": "Bluetooth ve izinler denetleniyor",
  "mesh.radar.hint_internet": "Mesajlar yine internet üzerinden yol alır",
  "mesh.radar.hint_turn_on": "Eşleri keşfetmek için Bluetooth'u aç",
  "mesh.radar.hint_allow": "Eşleri keşfetmek için Bluetooth'a izin ver",
  "mesh.radar.hint_allow_settings":
    "Eşleri keşfetmek için Ayarlar'dan Bluetooth'a izin ver",
  "mesh.radar.hint_location_permission":
    "Android 11 ve öncesi, Bluetooth üzerinden tarama için konuma ihtiyaç duyar",
  "mesh.radar.hint_android_location":
    "Android, Bluetooth tarama sonuçlarını döndürmek için konumun açık olmasını ister",
  "mesh.radar.signal_strong": "Güçlü",
  "mesh.radar.signal_medium": "Orta",
  "mesh.radar.signal_weak": "Zayıf",
  "mesh.radar.you_center": "Sen, mesh'in merkezinde",
  "mesh.radar.sonar_hint":
    "Bir sonar taraması çalar. Tarama zaten sürekli yapılıyor.",
  "mesh.radar.paused": "Mesh duraklatıldı · uzaktasın",
  "mesh.radar.ring_hint":
    "Halkadaki konum uzaklığı değil, sinyal gücünü yansıtır",
  "mesh.radar.set_online":
    "Eşleri keşfetmek için Sen sekmesinden durumunu Çevrimiçi yap",
  "mesh.radar.in_range": "menzilde",
  "mesh.radar.recently_seen": "yakınlarda görüldü",
  "mesh.radar.peer_hint":
    "Bu eşe mesaj yazma ya da ödeme yapma seçeneklerini açar",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "az önce",
  "mesh.peer.none": "Yakında eş yok",
  "mesh.peer.none_desc":
    "Bluetooth menzilindeki diğer Airhop ya da bitchat cihazları burada görünür.",
  "mesh.peer.id_copied": "Eş kimliği kopyalandı",
  "mesh.peer.copy_id": "Eş kimliğini kopyala",
  "mesh.peer.their_name": "{name} adını kullanıyor",
  "mesh.peer.in_range": "Menzilde",
  "mesh.peer.relay": "Aktarma düğümü",
  "mesh.peer.relay_body":
    "Birinin mesh'i genişletmek için açık bıraktığı bir telsiz. Okuyamadığı mesajları taşır. Burada mesaj yazılacak kimse yok.",
  "mesh.peer.send_dm": "Doğrudan mesaj gönder",
  "mesh.peer.message": "Mesaj",
  "mesh.peer.send_sats": "Ecash gönder",
  "mesh.peer.amount_placeholder": "Sat cinsinden tutar",
  "mesh.peer.amount_first": "Ecash gönder, önce bir tutar gir",
  "mesh.peer.cancel_send": "Ecash göndermeyi iptal et",
  "mesh.peer.view_peer": "{name} eşini görüntüle",
  "mesh.peer.view_peer_online": "{name} eşini görüntüle, çevrimiçi",
  "mesh.peer.last_seen": "{ago} önce görüldü",
  "mesh.peer.send_amount": "{amount} sat gönder",
  "mesh.peer.direct": "Doğrudan bağlantı",
  "mesh.peer.check_distance": "Uzaklığı ölç",
  "mesh.peer.checking": "Ölçülüyor",
  "mesh.peer.no_reply": "Yanıt yok",
  "mesh.peer.no_reply_hint":
    "Uzaklaşmış olabilirler ya da uygulamaları yanıt vermiyor olabilir",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Bölge",
  "mesh.level.province": "İl",
  "mesh.level.city": "Şehir",
  "mesh.level.neighborhood": "Mahalle",
  "mesh.level.block": "Sokak arası",
  "mesh.level.building": "Bina",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Harcanabilir",
  "wallet.balance.unit_hint": "Satoshi ile bitcoin arasında geçiş yapar",
  "wallet.balance.a11y": "Bakiye {value} {unit}",
  "wallet.balance.locked":
    "Cüzdan deposu kilitli. Ecash kanıtları, anahtarı cihazın anahtar zincirinde duran şifreli bir dosyada tutulur ve o dosya açılamadı. Cihazının kilidini açıp Airhop'u yeniden aç.",
  "wallet.balance.tor_blocked":
    "Tor açık, bu yüzden darphane istekleri engelleniyor: açık ağ üzerinden gider ve IP adresini kanıtlarınla ilişkilendirirdi. Mesh üzerinden gönderip almak çalışmayı sürdürüyor. Darphane trafiğine Ayarlar, Güvenlik altından izin ver.",
  "wallet.balance.unconfirmed_note": "{amount} darphanede henüz onaylanmadı",
  "wallet.balance.reserved_note": "{amount} yoldaki bir gönderim için ayrıldı",
  "wallet.balance.other_mint_note": "{amount} ayrı bir darphanede",
  "wallet.balance.test_mint_note":
    "Bir deneme darphanesinden gelen oyuncak para içerir. Bu bitcoin değildir ve nakde çevrilemez.",
  "wallet.token": "Jeton",
  "wallet.action.send": "Ecash jetonu gönder",
  "wallet.action.send_disabled":
    "Ecash jetonu gönder, boş bakiyeyle kullanılamaz",
  "wallet.action.receive": "Ecash jetonu al",
  "wallet.action.zap": "Bir Nostr kişisine zap gönder",
  "wallet.action.zap_disabled":
    "Bir Nostr kişisine zap gönder, boş bakiyeyle kullanılamaz",
  "wallet.action.add_mint": "Bir Cashu darphanesi ekle",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Jeton oluşturulamadı",
  "wallet.send.title": "Ecash gönder",
  "wallet.send.amount_in": "{unit} cinsinden tutar",
  "wallet.send.body":
    "Halihazırda elindeki kanıtlardan çevrimdışı oluşturuldu. Jetonun ulaştığını onaylayana kadar bakiyenden kalıcı olarak hiçbir şey çıkmaz.",
  "wallet.send.stale_fee_note":
    "Ücretler en son {days} gün önce denetlendi. Bu darphane o zamandan beri ücretini artırdıysa gönderim biraz daha fazlaya mal olabilir.",
  "wallet.send.fee_note":
    "Bakiyenden {spend} {unit} çıkar; fazladan {fee}, aksi hâlde onların ödeyeceği darphane ücretini karşılar",
  "wallet.send.qr_too_big":
    "Bu jeton bir QR koda sığamayacak kadar çok jetona bölünmüş. Bunun yerine paylaş ya da kopyala, ya da birleştirmek için darphanede yenile.",
  "wallet.send.bearer_note":
    "Bu dizeyi kim tutuyorsa para onundur. Kanıtlar ayrıldı, harcanmadı: hiç kimseye ulaşmazsa Bekleyenler altından geri alabilirsin.",
  "wallet.send.qr_too_big_short":
    "Bu jeton bir QR koda sığamayacak kadar çok jetona bölünmüş. Bunun yerine paylaş ya da kopyala.",
  "wallet.send.scan_note":
    "Bunu kendi cüzdanlarından taratsınlar. Teslim edildi olarak işaretleyene kadar geri alınabilir.",
  "wallet.send.mesh_note":
    "Jeton, mesh üzerinden şifreli bir doğrudan mesaj olarak gider. İnternet gerekmez.",
  "wallet.send.no_peers_note":
    "Yakındaki cihazları bulmak için Mesh sekmesini aç ya da jetonu başka bir yolla paylaş.",
  "wallet.send.send_to": "{name} kişisine gönder",
  "wallet.send.memo": "Not (isteğe bağlı, jetonla birlikte gider)",
  "wallet.send.building": "Oluşturuluyor…",
  "wallet.send.build": "Jeton oluştur",
  "wallet.send.inexact_body":
    "Kanıtların çevrimdışı olarak tam {amount} {unit} yapamıyor. Oluşturabileceğin en küçük jeton {spend} {unit} ve çevrimdışıyken para üstü yoktur: fazladan {extra} {unit} alıcıya gider.\n\nÇevrimiçiyken darphanede yenilemek, kanıtlarını bunu tam tutturacak birimlere böler.",
  "wallet.send.send_amount": "{amount} gönder",
  "wallet.send.sent_to": "{name} kişisine {amount} {unit} gönderildi",
  "wallet.send.sent_to_body":
    "{route} Aldıklarını onaylayana ya da darphane kanıtların bozdurulduğunu bize söyleyene kadar Bekleyenler altında geri alınabilir kalır.",
  "wallet.send.copy_token": "Jetonu kopyala",
  "wallet.send.share_token": "Jetonu paylaş",
  "wallet.send.open_in_wallet": "Bu jetonu başka bir cüzdanda aç",
  "wallet.send.open_in_wallet_short": "Cüzdanda aç",
  "wallet.send.to_peer": "Jetonu yakındaki bir eşe gönder",
  "wallet.send.to_peer_short": "Eşe gönder",
  "wallet.send.mark_delivered": "Teslim edildi olarak işaretle ve bitir",
  "wallet.send.they_got_it": "Aldılar",
  "wallet.send.keep_pending": "Bu gönderimi bekliyor olarak bırak",
  "wallet.send.decide_later": "Sonra karar ver",
  "wallet.send.no_peers": "Menzilde eş yok",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Bu senin kendi ödemen",
  "wallet.receive.own_payment_body":
    "Bu jetonlar hâlâ kapatmadığın bir gönderim için ayrılmış durumda, dolayısıyla alınacak bir şey yok. Doğrudan bakiyene geri koymak için o ödemede Geri al'ı kullan.",
  "wallet.receive.already_have": "Zaten cüzdanında",
  "wallet.receive.already_have_body":
    "Bu jetondaki her kanıt burada zaten var, bu yüzden hiçbir şey eklenmedi. Bakiyeler değişmedi.",
  "wallet.receive.stored_unconfirmed":
    "{mint} kaynağından kaydedildi ama darphanede henüz onaylanmadı ({reason}).",
  "wallet.receive.offline": "çevrimdışı",
  "wallet.receive.redeemed_here":
    "{mint} darphanesinde bozduruldu. Bu kanıtlar artık yalnızca senin: gönderenin kopyası artık çalışmıyor.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "{mint} darphanesinde bozduruldu. Artık kanıtlanabilir biçimde senin: gönderendeki kopyası artık çalışmıyor.",
  "wallet.receive.stored_pending":
    "{mint} kaynağından kaydedildi ama darphane harcanmamış olduğunu henüz onaylamadı{dleq}. Çevrimiçi olur olmaz Cüzdan sekmesinden yenile.",
  "wallet.receive.dleq_inline": " (imzası tutuyor, yani jeton gerçek)",
  "wallet.receive.dleq_ok": "Darphanenin imzası tutuyor, yani jeton gerçek.",
  "wallet.receive.dleq_uncached":
    "Darphanenin anahtarları burada yok, bu yüzden imza çevrimdışı denetlenemedi.",
  "wallet.receive.dleq_warning":
    "Çevrimiçi yenileyene kadar gönderen ilkece onu başka bir yerde harcamış olabilir.",
  "wallet.receive.failed": "Alınamadı",
  "wallet.receive.title": "Ecash al",
  "wallet.receive.body":
    "Bir Cashu jetonu yapıştır. Çevrimiçiyken darphanede hemen bozdurulur; çevrimdışıyken kaydedilir ve bir sonraki yenilemede onaylanır.",
  "wallet.receive.scan": "Bir ecash QR kodu tara",
  "wallet.receive.scan_short": "QR tara",
  "wallet.receive.receiving": "Alınıyor…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from} kaynağından nutzap alındı… ve cüzdanına bozduruldu.",
  "wallet.zap.title": "Bir Nostr kimliğine zap gönder",
  "wallet.zap.not_npub": "npub değil",
  "wallet.zap.bad_key": "hatalı anahtar",
  "wallet.zap.invalid_pubkey": "Geçersiz açık anahtar",
  "wallet.zap.invalid_pubkey_body":
    "Bir npub1… ya da 64 karakterlik onaltılık Nostr açık anahtarı gir.",
  "wallet.zap.sent": "Nutzap gönderildi",
  "wallet.zap.failed": "Zap başarısız",
  "wallet.zap.body":
    "NIP-61 nutzap bilgisi yayımlıyorlarsa ecash onların anahtarına kilitlenir, böylece başka kimse harcayamaz ve geri alınamaz. Yayımlamıyorlarsa bunun yerine geri alınabilir bir jeton olarak gider. Hangisi olduğu sana söylenir.",
  "wallet.zap.contact": "{name} kişisine zap gönder",
  "wallet.zap.pubkey_placeholder": "npub1… ya da 64 karakter onaltılık",
  "wallet.zap.sending": "Gönderiliyor…",
  "wallet.nostr.copied_body":
    "Bunu birine ver, sana Airhop'tan ya da başka herhangi bir Nostr cüzdanından zap gönderebilsin; Bluetooth gerekmez.",
  "wallet.nostr.copy_key":
    "İnsanların sana zap gönderebilmesi için Nostr anahtarını kopyala",
  "wallet.nostr.your_key": "Nostr anahtarın",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Darphane eklendi",
  "wallet.mint.add_failed": "Darphane eklenemedi",
  "wallet.mint.added_named": "{name} eklendi",
  "wallet.mint.added_body":
    "{mint} {units} çıkarıyor. Anahtarları bu cihazda tutuluyor, bu yüzden ondan gelen jetonlar artık internetsizken bile doğrulanabilir.",
  "wallet.mint.remove_plain":
    "{mint} cüzdanından kaldırılsın mı? Saklanan anahtarları da gider, bu yüzden ondan gelen jetonlar artık çevrimdışı doğrulanamaz.",
  "wallet.mint.title": "Darphaneler",
  "wallet.mint.none": "Henüz darphane yok",
  "wallet.mint.none_desc":
    "Bir darphane ecash'ini çıkarır ve bozar. Lightning üzerinden yatırmak için bir tane ekle ya da yalnızca bir jeton al, darphanesi senin için eklensin.",
  "wallet.mint.add": "Bir darphane ekle",
  "wallet.mint.add_body":
    "Bir darphane ecash'ini karşılayan Bitcoin'i tutar, bu yüzden orada tuttuğun bakiyeyi emanet edeceğin birini seç. Adres kaydedilmeden önce denetlenir. Kimseye güvenmek istemiyorsan Nutshell ile kendi darphaneni çalıştır.",
  "wallet.mint.consolidate_body":
    "Bir jeton her zaman yalnızca tek bir darphane belirtebilir, bu yüzden birkaçına yayılmış bir bakiye, en büyüğünün tuttuğundan daha fazlasını ödeyemez. Airhop bunu taşıyabilir: diğer her darphane, senin seçtiğinin kestiği bir Lightning faturasını öder. Küçük bir yönlendirme ücreti tutar ve internet gerektirir.",
  "wallet.mint.add_short": "Darphane ekle",
  "wallet.mint.checking": "Denetleniyor…",
  "wallet.mint.remove_with_balance":
    "Bakiyesi olan bir darphane kaldırılsın mı?",
  "wallet.mint.remove": "Darphaneyi kaldır",
  "wallet.mint.delete_anyway": "Yine de sil",
  "wallet.mint.consolidate": "Tüm bakiyeleri tek bir darphaneye taşı",
  "wallet.mint.confirm_with": "Kanıtları {mint} ile onayla",
  "wallet.mint.remove_a11y": "{mint} kaldır",
  "wallet.mint.available_amount": "{amount} {unit} kullanılabilir",
  "wallet.mint.split_across":
    "Bakiye {count} darphaneye bölünmüş. Tek bir yere taşı.",
  "wallet.mint.move_everything_to": "Her şeyi {mint} darphanesine taşı",
  "wallet.mint.consolidate_title": "Tek darphaneye taşı",
  "wallet.mint.moving": "Taşınıyor…",
  "wallet.mint.move": "Taşı",
  "wallet.mint.moved": "Taşındı",
  "wallet.mint.moved_body":
    "{fees} {unit} Lightning yönlendirme ücretinin ardından {amount} {unit} artık {mint} darphanesinde duruyor.",
  "wallet.mint.nothing_moved": "Hiçbir şey taşınmadı",
  "wallet.mint.destination": "· hedef",
  "wallet.mint.will_move": "· taşınacak",
  "wallet.mint.issued_by": "Çıkaran",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop cüzdan yüklemesi",
  "wallet.ln.invoice_failed": "Fatura oluşturulamadı",
  "wallet.ln.price_failed": "Bu faturaya fiyat verilemedi",
  "wallet.ln.paid": "Ödendi",
  "wallet.ln.deposit_credited":
    "Fatura ödendi ve {mint} tarafından {amount} {unit} çıkarıldı. Bu bakiye onaylandı: hemen çevrimdışı harcayabilirsin.",
  "wallet.ln.withdrawn":
    "Lightning üzerinden {paid} sat ödendi. Darphane {fee} sat yönlendirme ücreti aldı.",
  "wallet.ln.withdrawn_with_change":
    "Lightning üzerinden {paid} sat ödendi. Darphane {fee} sat yönlendirme ücreti aldı ve karşılığın {change} satını bakiyene geri verdi.",
  "wallet.ln.payment_failed": "Ödeme başarısız",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning satlarını çevrimdışı harcayabileceğin ecash'e dönüştür ya da ecash'i herhangi bir Lightning faturasına nakde çevir. İkisi de internet ve bir darphane gerektirir.",
  "wallet.ln.deposit_body":
    "Darphane sana bir fatura verir. Onu herhangi bir Lightning cüzdanından öde, satlar çevrimdışı harcayabileceğin ecash olarak geri gelsin.",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit} tutarındaki bu faturayı öde. Cüzdan ödemeyi gözlüyor ve ecash'ini kendiliğinden çıkaracak.",
  "wallet.ln.expired_body":
    "Bu faturanın süresi doldu. Zaten ödediysen bakiye kendiliğinden yazılır.",
  "wallet.ln.waiting_expires":
    "Ödeme bekleniyor · {countdown} içinde süresi dolar",
  "wallet.ln.withdraw_body":
    "Bir bolt11 faturası yapıştır, darphane onu ecash'inden ödesin. Önce yönlendirme karşılığı sana bildirilir; yönlendirmenin kullanmadığı bakiyene geri döner.",
  "wallet.ln.up_to": "{amount} {unit} kadar",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} öde",
  "wallet.ln.deposit": "Lightning üzerinden sat yatır",
  "wallet.ln.deposit_short": "Yatır",
  "wallet.ln.withdraw": "Bir Lightning faturasına çek",
  "wallet.ln.withdraw_short": "Çek",
  "wallet.ln.deposit_title": "Lightning üzerinden yatırma",
  "wallet.ln.amount_placeholder": "Sat cinsinden tutar",
  "wallet.ln.requesting": "İsteniyor…",
  "wallet.ln.get_invoice": "Fatura al",
  "wallet.ln.copy_invoice": "Faturayı kopyala",
  "wallet.ln.open_wallet": "Bir Lightning cüzdanında aç",
  "wallet.ln.open_wallet_short": "Cüzdanda aç",
  "wallet.ln.waiting": "Ödeme bekleniyor…",
  "wallet.ln.new_invoice": "Yeni bir fatura oluştur",
  "wallet.ln.new_invoice_short": "Yeni fatura",
  "wallet.ln.withdraw_title": "Lightning'e çekme",
  "wallet.ln.scan_invoice": "Bir Lightning faturasının QR kodunu tara",
  "wallet.ln.paid_from": "Şuradan ödendi:",
  "wallet.ln.invoice": "Fatura",
  "wallet.ln.routing_reserve": "Yönlendirme karşılığı",
  "wallet.ln.reserved": "Bakiyeden ayrıldı",
  "wallet.ln.paying": "Ödeniyor…",
  "wallet.ln.get_quote": "Fiyat al",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Yedek",
  "wallet.backup.setup_failed": "Yedek kurulamadı",
  "wallet.backup.on": "Yedek açık",
  "wallet.backup.on_body":
    "Bakiyen artık o on iki kelimeden yeniden kurulabilir.\n\nBaşkasının sana verdiği her şey, darphanede yenileyene kadar bu ifadenin dışında kalır ve kurtarma darphane listeni gerektirir, o yüzden listeyi kelimelerin yanına yazılı tut.",
  "wallet.backup.no_phrase": "Kayıtlı ifade yok",
  "wallet.backup.no_phrase_body":
    "Kurtarma ifadesi cihazın anahtar zincirinden okunamadı. Cihazın kilidini açıp yeniden dene.",
  "wallet.backup.replace_title": "Şu anki ifaden değiştirilsin mi?",
  "wallet.backup.replace_body":
    "Zaten bir kurtarma ifaden var. Farklı bir tanesini geri yüklemek onun yerini alır. Eski ifadenin zaten kapsadığı jetonlar bu cihazda harcanabilir kalır ama geri yüklenebilir olmaktan çıkar, o yüzden devam etmeden önce eski kelimelerin yazılı olduğundan emin ol.",
  "wallet.backup.replace": "Değiştir",
  "wallet.backup.invalid_phrase": "O ifade geçerli değil",
  "wallet.backup.invalid_phrase_body":
    "İfadenin yerleşik bir sağlama toplamı vardır ve bu ondan geçmiyor. Yanlış yazılmış, eksik ya da yeri değişmiş bir kelime ara.",
  "wallet.backup.not_bip39":
    "Bunlar BIP-39 kelimeleri değil: {words}. Yazımını denetle.",
  "wallet.backup.add_mint_first": "Önce bir darphane ekle",
  "wallet.backup.add_mint_first_body":
    "Kurtarma, bir darphaneye senin için hangi jetonları imzaladığını sorarak çalışır, bu yüzden hangi darphaneye soracağını bilmesi gerekir. Kullandığın darphaneleri ekle, sonra geri yükle.",
  "wallet.backup.restore_failed": "Geri yükleme başarısız",
  "wallet.backup.phrase": "Kurtarma ifadesi",
  "wallet.backup.state_unconfirmed": "Yedek açık ama onaylanmadı",
  "wallet.backup.state_off": "Yedek kapalı",
  "wallet.backup.badge_on": "Açık",
  "wallet.backup.badge_unconfirmed": "Onaylanmadı",
  "wallet.backup.badge_off": "Kapalı",
  "wallet.backup.view": "Kurtarma ifadesini gör",
  "wallet.backup.setup": "Kurtarma ifadesi kur",
  "wallet.backup.view_short": "İfadeyi gör",
  "wallet.backup.setup_short": "Kur",
  "wallet.backup.restore": "Bir kurtarma ifadesinden cüzdan geri yükle",
  "wallet.backup.restore_short": "Geri yükle",
  "wallet.backup.setup_title": "Bir kurtarma ifadesi kur",
  "wallet.backup.on_body_short":
    "Bakiyen on iki kelimenden yeni bir cihazda yeniden kurulabilir.",
  "wallet.backup.unconfirmed_body":
    "Yazılı bir kopya oluşturduğunu hiç onaylamadın. Şu anda kelimeler yalnızca bu telefonda var ve bir yedeğin atlatması gereken tek şey de tam olarak budur. İfadeyi görüntüle ve yaz.",
  "wallet.backup.not_covered":
    "{amount} henüz kapsanmıyor. Sana verilen jetonlar gönderenin gizlerini taşır, bu yüzden ancak takas edildiklerinde senin ifadenin altına girerler. Güvenceye almak için bir darphaneyi yenile.",
  "wallet.backup.off_body":
    "Ecash'in yalnızca bu telefonda var. Onu kaybedersen parayı kimse kurtaramaz, sen dahil. Kurtarma ifadesi, bakiyeni her yerde yeniden kurabilen on iki kelimedir.",
  "wallet.backup.about_to_see":
    "Birazdan on iki kelime göreceksin. O kelimeler paranın kendisidir.",
  "wallet.backup.exact_order":
    "On iki kelime, tam olarak bu sırayla. Onlara sahip olan bakiyene sahiptir.",
  "wallet.backup.verify_body":
    "Kimsenin yazmadığı bir ifade, hiç ifade olmamasından kötüdür; çünkü var olmayan bir güvenlik ağı gibi görünür. Onaylamak için iki kelime.",
  "wallet.backup.verify_mismatch": "Bu uyuşmuyor. Yazılı kopyanı denetle.",
  "wallet.backup.restore_body":
    "On iki kelimeyi gir. Airhop jetonlarını yeniden türetir ve her darphaneye bunlardan hangilerini imzaladığını sorar, böylece bakiye darphanenin tuttuğu kayıtlardan geri gelir.",
  "wallet.backup.warn_secret":
    "Onları okuyan herkes bakiyeni alabilir. Ekran görüntüsünü alma ve bu telefonda saklama.",
  "wallet.backup.warn_paper":
    "Onları kâğıda yaz ve güvenli bir yerde sakla. Telefon giderse Airhop onları sana bir daha gösteremez.",
  "wallet.backup.warn_scope":
    "Yalnızca ecash'ini yeniden kurarlar. Kimliğin, sohbetlerin ve kişilerin kapsam dışıdır.",
  "wallet.backup.warn_mints":
    "Kurtarmanın bir darphaneye hangi jetonları imzaladığını sorması gerekir, o yüzden darphane listeni kelimelerin yanına yaz.",
  "wallet.backup.preparing": "Hazırlanıyor…",
  "wallet.backup.show_phrase": "İfademi göster",
  "wallet.backup.your_phrase": "Kurtarma ifaden",
  "wallet.backup.write_down": "Bunları yaz",
  "wallet.backup.copy_phrase": "Kurtarma ifadesini panoya kopyala",
  "wallet.backup.copy_clipboard": "Panoya kopyala",
  "wallet.backup.written_down": "Onları yazdım",
  "wallet.backup.check_copy": "Kopyanı denetle",
  "wallet.backup.confirm": "Onayla",
  "wallet.backup.restore_title": "Bir ifadeden geri yükle",
  "wallet.backup.phrase_placeholder": "boşlukla ayrılmış on iki kelime",
  "wallet.backup.no_mints_yet":
    "Henüz darphane eklenmedi. Kurtarmanın belirli bir darphaneye sorması gerekir, o yüzden önce kullandıklarını ekle.",
  "wallet.backup.scanning": "Taranıyor…",
  "wallet.backup.restore_progress":
    "{mint} · anahtar kümesi {total} içinden {step}",
  "wallet.backup.will_scan":
    "Taranacaklar: {mints}. Eklemediğin bir darphaneye asla sorulmaz, bu yüzden oradaki bakiye görünmez kalır.",
  "wallet.backup.word_n": "Kelime {position}",
  "wallet.backup.unreachable_mints":
    "Ulaşılamadı: {mints}. Oradaki bakiye hâlâ duruyor. Daha iyi bir bağlantın olduğunda yeniden dene.",
  "wallet.backup.nothing_recovered":
    "Taranan darphanelerden hiçbir şey kurtarılmadı.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Alındı olarak işaretlensin mi?",
  "wallet.delivered.body":
    "Bu, {amount} {unit} tutarını kalıcı olarak serbest bırakır. Gerçekte hiç ulaşmadıysa geri alamazsın.",
  "wallet.delivered.body_generic":
    "Bu, ayrılan tutarı kalıcı olarak serbest bırakır. Gerçekte hiç ulaşmadıysa geri alamazsın.",
  "wallet.delivered.cancel": "Henüz değil",
  "wallet.delivered.confirm": "Aldılar",
  "wallet.reclaim.title": "Bu jeton geri alınsın mı?",
  "wallet.reclaim.body":
    "{amount} {unit} bakiyene geri döner. Bunu yalnızca jeton hiç kimseye ulaşmadıysa yap: dizeyi zaten ellerindeyse, darphanede ilk bozduran parayı alır ve bu onlar olabilir.",
  "wallet.reclaim.keep": "Bekliyor bırak",
  "wallet.reclaim.confirm": "Geri al",
  "wallet.copied.token_body":
    "Jeton panonda. Teslim edildi olarak işaretleyene kadar burada ayrılmış kalır, bu yüzden ilk deneme başarısız olursa yeniden yapıştırabilirsin.",
  "wallet.copied.phrase_body":
    "Bir parola yöneticisine yapıştır, sonra panonu temizle. Diğer uygulamalar panoyu okuyabilir ve bazı kurulumlarda pano diğer cihazlarınla eşitlenir.",
  "wallet.refresh.failed": "Yenileme başarısız",
  "wallet.refresh.partly": "Kısmen yenilendi",
  "wallet.refresh.done": "Yenilendi",
  "wallet.refresh.unreachable": "{mints} ulaşılamadı. Diğer her şey güncel.",
  "wallet.refresh.swapped":
    "{amount} {unit} onaylandı ve taze kanıtlarla takas edildi.",
  "wallet.refresh.secured":
    "{amount} {unit} artık kurtarma ifadenin kapsamında.",
  "wallet.refresh.all_confirmed":
    "Buradaki her şey darphanede zaten onaylanmıştı.",
  "wallet.pending.title": "Bekleyenler",
  "wallet.pending.reserved_desc":
    "Oluşturuldu ve ayrıldı, teslim onaylanmadı. İki kez harcanamasınlar diye kanıtlar bakiyenin dışında tutuluyor.",
  "wallet.pending.locked_desc":
    "Alıcının anahtarına kilitlenmiş durumda, yani yalnızca o harcayabilir. Yalnızca henüz kendisine ulaşmadı. Bitirmek için jetonu paylaş.",
  "wallet.pending.show_qr": "Bu jetonu QR kod olarak göster",
  "wallet.pending.copy_again": "Jetonu yeniden kopyala",
  "wallet.pending.share_again": "Jetonu yeniden paylaş",
  "wallet.pending.mark_delivered": "Bu jetonu teslim edildi olarak işaretle",
  "wallet.pending.delivered": "Teslim edildi",
  "wallet.pending.reclaim_into": "Bu jetonu bakiyene geri al",
  "wallet.activity.title": "Etkinlik",
  "wallet.activity.none": "Henüz bir şey yok",
  "wallet.activity.none_desc":
    "Gönderdiğin ve aldığın ödemeler, her birinin darphanesi ve ücretiyle birlikte en yeniden başlayarak burada görünür.",
  "wallet.activity.show_fewer": "Daha az ödeme göster",
  "wallet.activity.show_less": "Daha az göster",
  "wallet.activity.received_unconfirmed": "Alındı, onaylanmadı",
  "wallet.activity.received": "Alındı",
  "wallet.activity.receive_failed": "Alma başarısız",
  "wallet.activity.reclaimed": "Geri alındı",
  "wallet.activity.send_failed": "Gönderme başarısız",
  "wallet.activity.sent": "Gönderildi",
  "wallet.activity.status_pending": "bekliyor",
  "wallet.activity.status_failed": "başarısız",
  "wallet.activity.status_reclaimed": "geri alındı",
  "wallet.activity.status_expired": "süresi doldu",
  "wallet.activity.ln_deposit": "Lightning yatırma",
  "wallet.activity.ln_withdrawal": "Lightning çekme",
  "wallet.activity.nutzap_received": "Nutzap alındı",
  "wallet.activity.spent_removed": "Harcanan kanıtlar kaldırıldı",
  "wallet.activity.refreshed": "Kanıtlar yenilendi",
  "wallet.activity.refreshing": "Kanıtlar yenileniyor",
  "wallet.activity.just_now": "az önce",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh çevrimdışı",
  "wallet.mesh_offline_body":
    "Mesh hizmeti çalışmıyor, bu yüzden jetonu verecek kimse yok. Bekleyenler altında ayrılmış kalır.",
  "wallet.xfer.route_mesh": "Mesh üzerinden doğrudan cihazlarına verildi.",
  "wallet.xfer.route_nostr":
    "Bluetooth menzilinin dışındaydılar, bu yüzden internet üzerinden gitti.",
  "wallet.xfer.route_courier":
    "Şu anda onlara giden bir yol yok. Başka cihazlar taşıyacak ve biri onlara ulaştığında teslim edilecek.",
  "wallet.xfer.route_queued":
    "Henüz ulaşılabilir değiller. Sırada bekliyor ve ulaşılabilir olur olmaz gidecek.",
  "wallet.xfer.mesh_offline_body":
    "Mesh hizmeti çalışmıyor, bu yüzden jetonu devretmenin bir yolu yok. Hiçbir şey düşülmedi.",
  "wallet.xfer.could_not_send": "Gönderilemedi",
  "wallet.xfer.inexact_body":
    "Kanıtların çevrimdışı olarak tam {amount} {unit} yapamıyor. Oluşturabileceğin en küçük jeton {spend} {unit} ve fazladan {extra} {unit} geri alma olanağı olmadan onlara gider.\n\nÇevrimiçiyken darphanede yenilemek, kanıtlarını bunu tam tutturacak birimlere böler.",
  "wallet.xfer.send_amount": "{amount} gönder",
  "wallet.xfer.mesh_offline": "Mesh çevrimdışı",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Anahtarlarına kilitlendi ve Nostr üzerinde yayımlandı. Çevrimiçi olsalar da olmasalar da onlarındır.",
  "wallet.pay.rail_nutzap_dm":
    "Anahtarlarına kilitlendi. Aktarıcı kabul etmedi, bu yüzden onlara bir mesaj olarak gitti.",
  "wallet.pay.rail_nutzap_undelivered":
    "Anahtarlarına kilitlendi ama henüz hiçbir şey taşıyamadı. Sırada bekliyor ve jeton Bekleyenler altında.",
  "wallet.pay.final":
    "Kilitli ödemeler geri alınamaz: bu jetonları artık yalnızca onların anahtarı harcayabilir.",
  "wallet.pay.reclaimable":
    "Ulaştığını onaylayana kadar Cüzdan sekmesinden geri alınabilir kalır.",
  "wallet.pay.why": "Bu yolla gönderildi, çünkü {reason}.",
  "wallet.pay.sent_title": "{name} kişisine {amount} {unit}",
  "wallet.pay.thread_receipt":
    "Anahtarlarına kilitli olarak {amount} {unit} gönderdin.",
  "wallet.pay.title": "Ecash gönder",
  "wallet.pay.to": "{name} kişisine",
  "wallet.pay.amount": "Sat cinsinden tutar",
  "wallet.pay.memo": "Not (isteğe bağlı, herkese açık)",
  "wallet.pay.send": "Gönder",
  "wallet.pay.sending": "Gönderiliyor…",
  "wallet.pay.action": "Ecash gönder",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Kamera erişimi",
  "wallet.scan.camera_purpose": "bir ecash QR kodu taramak",
  "wallet.scan.photo_label": "Fotoğraf erişimi",
  "wallet.scan.photo_purpose": "bir görüntüden ecash QR kodu okumak",
  "wallet.scan.no_token": "O görüntüde ecash jetonu bulunamadı.",
  "wallet.scan.no_invoice": "O görüntüde Lightning faturası bulunamadı.",
  "wallet.scan.unreadable": "O görüntü okunamadı.",
  "wallet.scan.camera_failed":
    "Kamera başlatılamadı. Diğer kamera uygulamalarını kapatıp yeniden dene.",
  "wallet.scan.close": "Tarayıcıyı kapat",
  "wallet.scan.on_device":
    "Bu cihazda okunur; hiçbir yere hiçbir şey gönderilmez.",
  "wallet.scan.aim_token": "Bir ecash QR koduna doğrult.",
  "wallet.scan.aim_invoice": "Bir Lightning faturası QR koduna doğrult.",
  "wallet.scan.title_token": "Ecash tara",
  "wallet.scan.title_invoice": "Fatura tara",
  "wallet.scan.desc_token":
    "Başka bir cüzdandan Cashu jetonu oku. Yalnızca Airhop ile değil, herhangi bir Cashu cüzdanıyla çalışır.",
  "wallet.scan.desc_invoice":
    "Bakiyenden ödemek için bir Lightning faturası oku.",
  "wallet.scan.use_camera_a11y": "Kamerayla tara",
  "wallet.scan.use_camera": "Kamerayı kullan",
  "wallet.scan.pick_image_a11y": "Kayıtlı bir görüntüden QR kod oku",
  "wallet.scan.pick_image": "Fotoğraflardan seç",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu nedir?",
  "wallet.explain.intro":
    "Cashu, Bitcoin için ecash'tir. Bir jeton, elinde tutan için para değeri taşıyan bir dizedir; darphane kimin ne harcadığını göremesin diye körlemesine imzalanır. Hesap yok, oturum açma yok.",
  "wallet.explain.send": "Gönder",
  "wallet.explain.send_desc":
    "Bir tutarı, Bluetooth üzerinden yakındaki bir eşe verebileceğin ya da metin olarak paylaşabileceğin bir jetona dönüştürür. İnternetsiz çalışır. Ulaştığını onaylayana kadar kanıtlar ayrılmış kalır.",
  "wallet.explain.receive": "Al",
  "wallet.explain.receive_desc":
    "Eklemek için bir jeton yapıştır. Çevrimiçiyken darphanede hemen takas edilir, bu da onu kanıtlanabilir biçimde senin yapar. Çevrimdışıyken kaydedilir ve sen yenileyene kadar onaylanmadı olarak işaretlenir.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Bir Nostr kimliğine ödeme yapar. NIP-61 nutzap bilgisi yayımlıyorlarsa ecash anahtarlarına kilitlenir, böylece yalnızca onlar harcayabilir. Yayımlamıyorlarsa şifreli bir doğrudan mesaja düşer. İnternet gerektirir.",
  "wallet.explain.add_mint": "Darphane ekle",
  "wallet.explain.add_mint_desc":
    "Ecash'ini çıkaran ve bozan darphaneyi kaydeder ve ondan gelen jetonlar çevrimdışı doğrulanabilsin diye açık anahtarlarını saklar. Orada tuttuğun bakiyeyi emanet edeceğin bir darphane seç.",
  "wallet.explain.phrase": "Kurtarma ifadesi",
  "wallet.explain.phrase_desc":
    "Jetonların, cüzdanın en başta ürettiği on iki kelimeden türetilir; böylece yeni bir telefon, darphanelerine hangi jetonları imzaladıklarını sorarak bakiyeyi yeniden kurabilir. Sen onları görüntüleyip yazana kadar yalnızca bu telefonda varlar.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Cüzdan kilitli",
  "wallet.err.mint_unreachable": "Darphaneye ulaşılamıyor",
  "wallet.err.tor_blocked": "Tor açıkken engelli",
  "wallet.err.insufficient": "Bakiye yetersiz",
  "wallet.err.exact_amount": "Tam o tutar gönderilemiyor",
  "wallet.err.no_mint": "Darphane yok",
  "wallet.err.mint_unsupported": "Darphane bunu yapamıyor",
  "wallet.err.mint_refused": "Darphane reddetti",
  "wallet.err.unreadable": "Okunamayan jeton",
  "wallet.err.rejected": "Jeton geri çevrildi",
  "wallet.err.already_spent": "Zaten harcandı",
  "wallet.err.change_pending": "Ödendi, para üstü bekliyor",
  "wallet.svc.mint_unreachable": "Darphaneye ulaşılamadı.",
  "wallet.svc.tor_ios": "iOS'ta darphane istekleri Tor üzerinden gitmez.",
  "wallet.svc.tor_ios_body":
    "Arti yalnızca Nostr WebSocket'lerini sarar, bu yüzden bu istek darphaneye açık ağ üzerinden ulaşır ve IP adresini bu kanıtlarla ilişkilendirir. Ayarlar > Güvenlik altından izin ver ya da önce Tor'u kapat. Mesh üzerinden ecash gönderip almak çalışmayı sürdürür.",
  "wallet.svc.tor_paused": "Tor açık ama bağlı değil.",
  "wallet.svc.tor_paused_body":
    "Orbot yönlendirmeyi bıraktı, bu yüzden bu istek darphaneye açık ağ üzerinden ulaşır ve IP adresini bu kanıtlarla ilişkilendirir. Orbot'u yeniden başlat ya da Tor'u kapat. Mesh üzerinden ecash gönderip almak çalışmayı sürdürür.",
  "wallet.svc.keys_uncached":
    "Bu darphanenin anahtarları bu cihazda saklı değil.",
  "wallet.svc.keys_uncached_body":
    "Onları almak için cüzdanı çevrimiçiyken bir kez aç.",
  "wallet.svc.phrase_invalid": "O kurtarma ifadesi geçerli değil.",
  "wallet.svc.phrase_invalid_body":
    "Yanlış yazılmış ya da eksik bir kelime ara. İfadenin yerleşik bir sağlama toplamı vardır, bu yüzden tek bir yanlış kelime tümünü geçersiz kılar.",
  "wallet.svc.need_mint": "Önce en az bir darphane ekle.",
  "wallet.svc.need_mint_body":
    "Kurtarma, bir darphaneye senin için hangi jetonları imzaladığını sorarak çalışır, bu yüzden hangi darphaneye soracağını bilmesi gerekir.",
  "wallet.svc.restored": "Kurtarma ifadesinden geri yüklendi",
  "wallet.svc.storage_locked": "Cüzdan deposu kilitli.",
  "wallet.svc.storage_locked_body":
    "Airhop ecash kanıtlarını, anahtarı cihazın anahtar zincirinde duran şifreli bir dosyada tutar. Cihazın kilidini açıp uygulamayı yeniden aç.",
  "wallet.svc.bad_url": "Bu geçerli bir adres değil.",
  "wallet.svc.needs_https": "Bir darphane adresi https:// ile başlamalıdır.",
  "wallet.svc.refuse_http":
    "Düz http üzerinden bir darphane kullanmayı reddediyoruz.",
  "wallet.svc.refuse_http_body":
    "Ağ yolundaki herkes kanıtlarını okuyabilir ya da değiştirebilirdi. https:// kullanan bir darphane kullan.",
  "wallet.svc.mint_not_saved": "Darphane kaydedilemedi.",
  "wallet.svc.unreadable_token": "Bu okunabilir bir Cashu jetonu değil.",
  "wallet.svc.unreadable_token_body":
    "Jetonlar cashuA ya da cashuB ile başlar. Kopyalanırken bir şeyin kesilmediğinden emin ol.",
  "wallet.svc.wrong_mint":
    "Bu jeton, belirttiği darphane tarafından imzalanmamış.",
  "wallet.svc.already_spent": "Bu kanıtlar zaten harcanmış.",
  "wallet.svc.already_spent_body":
    "Bu jetonu gönderen onu önce kendisi bozdurmuş ya da aynı jetonu başka birine de göndermiş.",
  "wallet.svc.receiving_offline": "çevrimdışı alınıyor",
  "wallet.svc.amount_positive": "Sıfırdan büyük bir tutar gir.",
  "wallet.svc.coins_raced":
    "O jetonlar az önce başka bir ödeme tarafından kullanıldı.",
  "wallet.svc.coins_raced_body":
    "Hiçbir şey düşülmedi. Yeniden dene, cüzdan farklı bir küme seçecek.",
  "wallet.svc.no_ecash": "Henüz ecash yok.",
  "wallet.svc.no_ecash_body":
    "Bir darphane ekleyip Lightning üzerinden yatır ya da birinden bir jeton al.",
  "wallet.svc.split_across_mints": "Bakiyen darphaneler arasında bölünmüş.",
  "wallet.svc.mint_says_spent":
    "Darphane bu kanıtları zaten harcanmış olarak bildirdi.",
  "wallet.svc.issue_against_invoice":
    "bir Lightning faturası karşılığında ecash çıkarmayı",
  "wallet.svc.pay_invoice": "bir Lightning faturası ödemeyi",
  "wallet.svc.unknown_deposit": "Bilinmeyen yatırma.",
  "wallet.svc.invoice_expired_before": "Fatura ödenmeden önce süresi doldu.",
  "wallet.svc.invoice_expired": "O faturanın süresi doldu.",
  "wallet.svc.invoice_unpaid": "Fatura henüz ödenmedi.",
  "wallet.svc.payment_unknown":
    "Ödeme durumu bilinmiyor; bir sonraki yenilemede yeniden denetlenecek.",
  "wallet.svc.melt_change_pending": "Faturan ödendi.",
  "wallet.svc.melt_change_pending_body":
    "Darphane kullanılmayan yönlendirme ücretini henüz geri vermedi. Bir sonraki yenilemede kendiliğinden alınır ve bu arada hiçbir şey kaybolmaz.",
  "wallet.svc.mint_did_not_pay":
    "Darphane bu faturayı ödemedi. Bakiyen değişmedi.",
  "wallet.svc.not_an_invoice": "Bu bir Lightning faturası değil.",
  "wallet.svc.not_an_invoice_body":
    "lnbc ile başlayan bir bolt11 faturası yapıştır.",
  "wallet.svc.insufficient_for_invoice": "Bu fatura için bakiye yetersiz.",
  "wallet.svc.coins_raced_invoice_body":
    "Hiçbir şey düşülmedi ve fatura ödenmedi. Yeniden dene.",
  "wallet.svc.same_mint": "Farklı bir hedef darphane seç.",
  "wallet.svc.same_mint_body":
    "Kaynak ve hedef aynı darphane, dolayısıyla taşınacak bir şey yok.",
  "wallet.svc.quote_failed_retried":
    "Fiyat alınamadı, birleştirme yeniden denendi",
  "wallet.svc.amount_unfit_retried":
    "Tutar uymadı, birleştirme yeniden denendi",
  "wallet.svc.cannot_size": "Bu aktarımın büyüklüğü belirlenemedi.",
  "wallet.svc.insufficient_at_mint": "{mint} darphanesinde bakiye yetersiz.",
  "wallet.svc.inexact_title":
    "Kanıtların çevrimdışı olarak tam {amount} {unit} yapamıyor.",
  "wallet.svc.inexact_detail":
    "Gönderebileceğin en küçük jeton {spend} {unit}. Çevrimdışıyken para üstü yoktur, bu yüzden fazladan {extra} {unit} alıcıya gider.",
  "wallet.svc.no_single_mint":
    "Tek başına {amount} {unit} tutan bir darphane yok. Farklı darphanelerden gelen ecash tek bir jetonda birleştirilemez: önce tek bir darphanede birleştir ya da ayrı tutarlar hâlinde gönder.",
  "wallet.svc.have_tried_send":
    "{total} {unit} var ve {amount} göndermeye çalıştın.",
  "wallet.svc.invoice_needs":
    "Bu fatura yönlendirme karşılığıyla birlikte {total} {unit} gerektiriyor, sende ise {balance} var.",
  "wallet.svc.nothing_to_move": "{mint} darphanesinde taşınacak {unit} yok.",
  "wallet.svc.consolidate_memo": "{mint} kaynağından birleştirme",
  "wallet.svc.cannot_size_detail":
    "Lightning yönlendirme ücretlerinden sonra {from}, {to} hedefine işe yarar bir tutar taşıyamıyor. Bunun yerine belirli ve daha küçük bir tutar taşımayı dene.",
  "wallet.svc.mint_cannot": "{mint} {action} yapamıyor.",
  "wallet.svc.no_nut": "Darphane NUT-{nut} duyurmuyor.",
  "wallet.svc.unknown_mint": "O ödeme, kullanmadığın bir darphane belirtiyor.",
  "wallet.svc.unknown_mint_body":
    "Güveniyorsan darphaneyi önce kendin ekle; seçmediğin bir darphaneden hiçbir şey bozdurulmaz.",
  "wallet.svc.no_relay": "aktarıcı bağlantısı yok",
  "wallet.svc.no_shared_mint": "yeterli bakiyesi olan ortak bir darphane yok",
  "wallet.svc.no_nutzap_info":
    "alıcı nutzap bilgisi yayımlamamış (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Anahtarlarına kilitlendi ama henüz teslim edilmedi. Tamamlamak için bu işlemdeki jetonu paylaş.",
  "wallet.svc.swap_lost":
    "Darphane bu takası hiç tamamlamadı, bu yüzden karşılığında hiçbir şey çıkarılmadı.",
  "wallet.svc.swap_unreadable":
    "Bu takas, bu sürümün yeniden oynatamayacağı bir biçimde kaydedilmiş.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR ile doğrulandı",
  "contacts.qr.keys_unverified": "Anahtarlar alındı, doğrulanmadı",
  "contacts.qr.not_verified": "Henüz doğrulanmadı",
  "contacts.qr.message": "Mesaj",
  "contacts.qr.add": "Kişi ekle",
  "contacts.qr.scan_title": "QR kodu tara",
  "contacts.qr.aim": "Kamerayı onların QR koduna doğrult",
  "contacts.qr.add_desc": "Mesh üzerinde yakında olmayan birine ulaş.",
  "contacts.qr.peer_id_hint":
    "Eş kimliği 16 karakterdir. Kişi kodu airhop: ile başlar.",
  "contacts.qr.or_scan": "ya da onların QR kodunu tara",
  "contacts.qr.trust_note":
    "Anahtarlarını yalnızca kamerayla taradığın bir QR doğrular. Yapıştırılan bir kod anahtarlarını taşır ama onlardan geldiğinin kanıtını taşımaz.",
  "contacts.qr.peer_id": "Eş kimliği ya da kişi kodu",
  "contacts.qr.peer_id_placeholder": "Bir kimlik ya da kişi kodu yapıştır",
  "contacts.qr.scan_camera_a11y": "QR kodu kamerayla tara",
  "contacts.qr.scan_camera_desc": "Kamerayı kullan",
  "contacts.qr.upload_a11y": "Galeriden QR görüntüsü yükle",
  "contacts.qr.upload": "Galeriden yükle",
  "contacts.qr.upload_desc": "Kayıtlı bir QR görüntüsü seç",
  "contacts.qr.scan_a11y": "QR kodu tarayarak kişi ekle",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16 karakterlik bir eş kimliği, bir airhop://peer/… bağlantısı ya da bir kişi kodu yapıştır.",
  "contacts.scan.camera_label": "Kamera erişimi",
  "contacts.scan.camera_purpose": "bir kişinin QR kodunu taramak",
  "contacts.scan.camera_needed":
    "Taramak için kamera erişimi gerekiyor. Yine de eş kimliğiyle ekleyebilirsin.",
  "contacts.scan.camera_failed":
    "Kamera başlatılamadı. Diğer kamera uygulamalarını kapatıp yeniden dene.",
  "contacts.scan.photo_label": "Fotoğraf erişimi",
  "contacts.scan.photo_purpose": "kaydettiğin bir QR kodu taramak",
  "contacts.scan.photo_needed":
    "Görüntü seçmek için fotoğraf erişimi gerekiyor. Yine de eş kimliğiyle ekleyebilirsin.",
  "contacts.scan.no_qr": "O görüntüde Airhop QR kodu bulunamadı.",
  "contacts.scan.unreadable": "O görüntüden bir QR kod okunamadı.",
  "contacts.scan.bitchat_expired":
    "O bitchat kodunun süresi dolmuş. QR kodlarını yeniden açmalarını iste.",
  "contacts.scan.tampered":
    "Bu QR kod geçersiz: eş kimliği anahtarlarıyla uyuşmuyor. Kurcalanmış olabilir.",
  "contacts.scan.already_added": "Zaten kişilerinde",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Kamera erişimi bekleniyor…",
  "contacts.verify.camera_off": "Kamera kapalı",
  "contacts.verify.open_settings": "Ayarlar'ı aç",
  "contacts.verify.verified": "Doğrulandı",
  "contacts.verify.different": "Farklı kişi",
  "contacts.verify.scan_again": "Yeniden tara",
  "contacts.verify.failed": "Doğrulanamadı",
  "contacts.verify.done": "Bitti",
  "contacts.verify.title": "{name} kişisini doğrula",
  "contacts.verify.aim": "Kamerayı onların QR koduna doğrult",
  "contacts.verify.camera_off_body":
    "QR ile doğrulamak için Ayarlar'dan kamera erişimini aç.",
  "contacts.verify.match_body":
    "{name} kişisinin anahtarı uyuşuyor. Bu kişiye güvenebilirsin.",
  "contacts.verify.different_body":
    "Bu QR başka birine ait. {name} kişisinden kendi kodunu göstermesini iste.",
  "contacts.verify.tampered_body":
    "Bu QR kurcalanmış görünüyor: kimliği anahtarıyla uyuşmuyor.",
  "contacts.verify.choose_title": "Nasıl denetlemek istersin?",
  "contacts.verify.choose_body":
    "İkisi de bu telefondaki anahtarların gerçekten {name} kişisine ait olduğunu doğrular.",
  "contacts.verify.method_scan": "Kodlarını tara",
  "contacts.verify.method_scan_sub": "Yanındalar",
  "contacts.verify.method_compare": "Bir kodu karşılaştır",
  "contacts.verify.method_compare_sub": "Telefonda birbirinize okuyun",
  "contacts.verify.no_keys":
    "Bu kişi için henüz anahtar yok. Onlara yaz ya da buluştuğunuzda kodlarını tara.",
  "contacts.verify.compare_title": "Bunları birbirinize okuyun",
  "contacts.verify.compare_body":
    "{name} de aynı altı kelimeyi görüyor. Uyuşuyorsa ikiniz de anahtarların gerçek olduğunu bilirsiniz.",
  "contacts.verify.codes_match": "Bunlar uyuşuyor",
  "contacts.verify.codes_differ": "Uyuşmuyorlar",
  "contacts.verify.compared_body":
    "Sen ve {name} aynı kodu doğruladınız. Bu kişi doğrulandı.",

  // ---- Settings: shared chrome ----
  "settings.back": "Geri dön",
  "settings.coming_soon": "Yakında",
  "settings.opens_externally": "{label}, uygulamanın dışında açılır",
  "settings.peer_id": "Eş kimliği",
  "settings.share_peer_id": "Eş kimliğini paylaş",
  "settings.share_id_short": "Kimliği paylaş",
  "settings.peer_id_sheet.title": "Eş kimliğin",
  "settings.peer_id_sheet.copy": "Eş kimliğini kopyala",
  "settings.peer_id_sheet.note":
    "Bu yalnızca ikiniz de Bluetooth menzilindeyken işe yarar. Birinin sana her yerden yazabilmesi için onun yerine QR kodunu paylaş.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Genel",
  "settings.section.general_desc":
    "İsteğe bağlı özellikler, göndermeyi geri alma, medya, sıfırlama",
  "settings.section.privacy": "Gizlilik ve güvenlik",
  "settings.section.privacy_desc":
    "Forward secrecy, imzalı paketler, engellenen eşler",
  "settings.section.network": "Ağ ve aktarıcılar",
  "settings.section.network_desc":
    "İnternet yedeği, nostr aktarıcıları, bitchat uyumluluğu",
  "settings.section.permissions": "İzinler",
  "settings.section.permissions_desc":
    "Bluetooth, konum, bildirimler, kamera, mikrofon",
  "settings.section.storage": "Depolama ve veri",
  "settings.section.diagnostics": "Tanılama",

  // ---- Settings: group headings ----
  "settings.group.transports": "Taşıyıcılar",
  "settings.group.nearby": "Yakında",
  "settings.group.sync": "Eşitleme",
  "settings.group.features": "Özellikler",
  "settings.group.messages": "Mesajlar",
  "settings.group.media": "Medya",
  "settings.group.reset": "Sıfırlama",
  "settings.group.always_on": "Her zaman açık",
  "settings.group.notifications": "Bildirimler",
  "settings.group.blocked": "Engellenenler",
  "settings.group.theme": "Tema",
  "settings.group.font": "Yazı tipi",
  "settings.group.language": "Dil",
  "settings.section.diagnostics_desc": "Bağlantı durumu ve yakındaki cihazlar",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Bluetooth bağlantıları",
  "settings.diag.ble_links_desc": "Bu telefonun doğrudan bağlı olduğu cihazlar",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about":
    "Telefondan telefona, yönlendirici ya da internet olmadan",
  "settings.diag.wifi_active": "Çalışıyor",
  "settings.diag.wifi_unsupported": "Bu cihazda desteklenmiyor",
  "settings.diag.wifi_permission": "Bir izin tarafından engellendi",
  "settings.diag.wifi_unavailable": "Şu anda kullanılamıyor",
  "settings.diag.wifi_unknown": "Telsiz bekleniyor",
  "settings.diag.relays": "Nostr aktarıcıları",
  "settings.diag.relays_desc":
    "Konum kanalları ve internet erişimi için kullanılır",
  "settings.diag.connected": "Bağlı",
  "settings.diag.disconnected": "Bağlı değil",
  "settings.diag.peer_direct": "Doğrudan bağlantı",
  "settings.diag.peer_relayed": "Başka bir cihaz üzerinden duyuldu",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Sinyal okuması yok",
  "settings.diag.no_peers": "Menzilde kimse yok",
  "settings.diag.no_peers_desc": "{links} telsiz bağlantısı açık",
  "settings.diag.gcs_size": "Filtre boyutu",
  "settings.diag.gcs_size_desc": "Havaya verilen en büyük eşitleme filtresi",
  "settings.diag.fpr": "Yanlış pozitif oranı",
  "settings.diag.fpr_desc":
    "Filtrenin, bizde olmayan bir paketi var diye göstermesinin sıklığı",
  "settings.diag.bytes": "{n} bayt",
  "settings.diag.footnote":
    "Buradaki hiçbir şey değiştirilemez. Airhop bitchat ile uyumlu kalsın diye bu değerler sabittir.",
  "settings.section.storage_desc": "Kullanım ve önbellek",
  "settings.section.appearance": "Görünüm",
  "settings.section.appearance_desc": "Tema, yazı tipi ve dil",
  "settings.section.help": "Yardım ve geri bildirim",
  "settings.section.help_desc": "Bize yaz, hata bildir ya da SSS'yi oku",
  "settings.section.support": "Destek",
  "settings.section.support_desc": "Geliştirmenin sürmesine yardım et",
  "settings.section.about": "Hakkında",
  "settings.section.about_desc": "Sürüm, değişiklik listesi ve kaynak kodu",

  // ---- Settings: general ----
  "settings.general.undo": "Göndermeyi geri alma",
  "settings.general.feature_ai": "Yapay zekâ",
  "settings.general.feature_wallet": "Cüzdan",
  "settings.general.undo_seconds": "{count} saniye",
  "settings.general.undo_a11y": "Göndermeyi geri alma: {value}",
  "settings.general.quality_a11y": "Yükleme kalitesini {value} yap",
  "settings.general.undo_desc":
    "Gönderilen mesajı kısa süre bekletir, böylece çıkmadan önce geri alabilirsin",
  "settings.general.undo_off_desc": "Hemen gönder, geri alma yok",
  "settings.general.undo_2": "2 saniye",
  "settings.general.undo_2_desc": "Geri almak için kısa bir fırsat",
  "settings.general.undo_10": "10 saniye",
  "settings.general.undo_10_desc": "En uzun aralık",
  "settings.general.quality": "Yükleme kalitesi",
  "settings.general.quality_desc":
    "Kameradan ya da galeriden gönderilen fotoğraflar için geçerlidir. Her fotoğraf zaten mesh'e göre boyutlandırılır.",
  "settings.general.quality_low": "Düşük",
  "settings.general.quality_low_desc":
    "En küçük fotoğraflar, en hızlı gönderim",
  "settings.general.quality_medium": "Orta",
  "settings.general.quality_medium_desc": "Ayrıntı ve hız dengesi",
  "settings.general.quality_high": "Yüksek",
  "settings.general.quality_high_desc": "En çok ayrıntıyı korur",
  "settings.general.feature_wallet_desc":
    "Mesh üzerinden eşten eşe Cashu ecash gönder",
  "settings.general.feature_wallet_a11y": "Cüzdan (her zaman açık)",
  "settings.general.feature_ai_desc":
    "Cihaz üzerinde çalışan özel yardımcı, ağ çağrısı yok",
  "settings.general.feature_feeds": "Akışlar",
  "settings.general.feature_feeds_desc":
    "Bluesky ve Mastodon akışlarını oku ve buralara gönderi paylaş",
  "settings.general.show_media": "Medyayı otomatik göster",
  "settings.general.show_media_desc":
    "Fotoğraflar ve videolar sohbette görünür ya da bir dokunuşun ardında bekler",
  "settings.general.reset": "Ayarları sıfırla",
  "settings.general.media_retention": "Medyayı şu kadar sakla",
  "settings.general.media_retention_desc":
    "Fotoğraflar, videolar ve sesli notlar seçilen sürenin ardından silinir",
  "settings.general.media_retention_sheet":
    "Medyanın bu cihazda ne kadar kalacağını seç. Silinen medya geri getirilemez.",
  "settings.general.retention_7_desc":
    "Geriye en az iz kalır. Riskin telefonun kendisi olduğu durumlar için en iyisi.",
  "settings.general.retention_14_desc":
    "Kapsama dışında geçen bir iki hafta için orta yol.",
  "settings.general.retention_30_desc":
    "Konuşmaları en uzun süre okunabilir tutar ve diskte en çok yer kaplar.",
  "settings.general.reset_desc":
    "Her tercihi varsayılanına döndürür; kimliğine, mesajlarına, kişilerine ve cüzdanına dokunmaz",
  "settings.general.reset_title": "Ayarlar sıfırlansın mı?",
  "settings.general.reset_body":
    "Her tercih varsayılanına döner: görünüm, göndermeyi geri alma ve bağlantı (internet, Tor, geçit, köprü, aktarıcılar). Kimliğin, mesajların, kişilerin ve cüzdanın dokunulmadan kalır.",
  "settings.general.reset_confirm": "Sıfırla",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Doğrudan mesajlar için Double Ratchet her zaman açıktır",
  "settings.security.signed_packets": "İmzalı paketler",
  "settings.security.signed_packets_desc": "Her paket Ed25519 ile imzalanır",
  "settings.security.hide_previews": "Bildirim önizlemelerini gizle",
  "settings.security.hide_previews_desc":
    "Göndereni ve mesajı, kilidi açmadan gösteren kilit ekranından uzak tutar",
  "settings.security.no_blocked": "Engellenen eş yok",
  "settings.security.no_blocked_desc":
    "Engellenen eşler sana yazamaz ve Mesh sekmesinde görünemez",
  "settings.security.unblock_title": "Bu eşin engelini kaldır",
  "settings.security.unblock": "Engeli kaldır",
  "settings.security.unblock_peer": "{name} engelini kaldır",
  "settings.security.unblock_body":
    "{name} yeniden sana yazabilecek ve yakındayken Mesh sekmesinde tekrar görünecek.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "İnternet yedeği",
  "settings.network.internet_desc":
    "Mesh eşleri menzil dışındayken Nostr aktarıcıları üzerinden devam et",
  "settings.network.internet_off_title": "İnternet kapatılsın mı?",
  "settings.network.internet_off_body":
    "Airhop yalnızca Bluetooth üzerinde çalışacak. Hiçbir Nostr aktarıcısıyla iletişim kurmayı bırakır; Tor, internet geçidi ve mesh köprüsü kapanır. Yakındaki Bluetooth sohbeti çalışmayı sürdürür.",
  "settings.network.turn_off": "Kapat",
  "settings.network.discovery": "Coğrafi aktarıcı keşfi",
  "settings.network.discovery_desc":
    "Bir konum hücresi için 300'den fazla dağıtık aktarıcı arasından en yakınlarını kendiliğinden seç",
  "settings.network.discovery_needs_relay": "Önce özel bir aktarıcı ekle",
  "settings.network.discovery_needs_relay_body":
    "Airhop'u en yakın aktarıcılara yönlendiren şey bu kendiliğinden keşiftir. Kapatmak ancak aşağıya kendi aktarıcılarını sabitledikten sonra anlam kazanır, o yüzden önce en az bir tane ekle.",
  "settings.network.custom_only_title":
    "Yalnızca kendi aktarıcıların kullanılsın mı?",
  "settings.network.custom_only_body":
    "Konum kanalları ve mesh köprüsü en yakın aktarıcıları kendiliğinden seçmeyi bırakıp yalnızca senin eklediklerini kullanacak. Bu erişimi daraltabilir ve en yakın aktarıcılarda toplanan bitchat kullanıcılarıyla karşılaşmayı bırakabilirsin.",
  "settings.network.custom": "Özel aktarıcılar",
  "settings.network.custom_desc":
    "Konum kanalları ve mesh köprüsü için kendi aktarıcılarını ekle",
  "settings.network.custom_added": "{max} taneden {count} tanesi eklendi",
  "settings.network.dm_relays": "Mesaj aktarıcıları",
  "settings.network.dm_relays_desc":
    "Doğrudan mesajlar ve özel kanallar her zaman bunları kullanır. Özel aktarıcılar bunları değiştirmez.",
  "settings.network.discovery_back_on": "Coğrafi aktarıcı keşfi yeniden açık",
  "settings.network.discovery_back_on_body":
    "Bu son özel aktarıcındı. Konum kanallarının yayın yapacak bir yere ihtiyacı var, bu yüzden Airhop yeniden en yakın aktarıcıları kendiliğinden seçiyor.",
  "settings.network.add_relay": "Aktarıcı ekle",
  "settings.network.remove_relay": "{url} kaldır",
  "settings.network.add_short": "Ekle",
  "settings.network.relay_limit":
    "{count} aktarıcı ekleyebilirsin. Başka bir tane eklemek için birini kaldır.",
  "settings.network.relay_duplicate": "O aktarıcı zaten listende.",
  "settings.network.relay_invalid":
    "Geçerli bir aktarıcı adresi gir, örneğin relay.example.com. Bağlantı noktası yalnızca aktarıcı varsayılanı kullanmıyorsa gerekir. IP adresleri ve yerel adlar kabul edilmez.",
  "settings.network.bitchat": "bitchat uyumluluğu",
  "settings.network.bitchat_desc":
    "bitchat ile aynı BLE mesh ağı, tümüyle birlikte çalışabilir. Bu her zaman açıktır ve kapatılamaz.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Arka planda çalıştır",
  "settings.conn.background_desc": "Airhop kapalıyken mesh'i çalışır tut",
  "settings.conn.background_on_title": "Mesh çalışır tutulsun mu?",
  "settings.conn.background_on_body":
    "Airhop kapalıyken de aktarmayı ve almayı sürdürür, böylece sen yokken mesajlar ulaşır. Android bu sırada kalıcı bir bildirim gösterir.",
  "settings.conn.background_off_title": "Airhop kapanınca mesh dursun mu?",
  "settings.conn.background_off_body":
    "Mesajlar yalnızca Airhop açıkken ulaşır ve bu telefon yakındakiler için aktarmayı bırakır. Kalıcı bildirim kaybolur.",
  "settings.conn.live_voice": "Canlı ses",
  "settings.conn.live_voice_desc": "Yakındaki insanlarla telsiz gibi konuş",
  "settings.conn.live_voice_on_title": "Canlı ses açılsın mı?",
  "settings.conn.live_voice_on_body":
    "Mikrofonu basılı tutmak, sen konuştukça sesini Bluetooth menzilindeki herkese gönderir ve onların sesi senin telefonunda çalar. Hiçbir şey kaydedilmez.",
  "settings.conn.live_voice_off_title": "Canlı ses kapatılsın mı?",
  "settings.conn.live_voice_off_body":
    "Mikrofonu basılı tutmak bunun yerine sesli not kaydeder. Bıraktığında gönderilir ve oynatana kadar kimse duymaz.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor yönlendirmesi",
  "settings.conn.tor_desc":
    "Ek gizlilik için Nostr trafiğini Tor üzerinden yönlendir",
  "settings.conn.tor_on_title":
    "Nostr trafiği Tor üzerinden yönlendirilsin mi?",
  "settings.conn.tor_on_body":
    "Aktarıcılar IP adresini görmeyi bırakır. Bağlanmak daha uzun sürer ve mesajlar daha yavaş ulaşır. Bluetooth etkilenmez.",
  "settings.conn.tor_off_title": "Tor yönlendirmesi kapatılsın mı?",
  "settings.conn.tor_off_body":
    "Nostr trafiği olağan bağlantına döner, dolayısıyla aktarıcılar IP adresini yeniden görür. Bluetooth her iki durumda da etkilenmez.",
  "settings.conn.tor_orbot_idle":
    "Orbot kurulu ama bağlı değil. Orbot'u aç, VPN'ini başlat, sonra bunu aç.",
  "settings.conn.tor_unavailable": "Tor yönlendirmesi bu yapıda yok.",
  "settings.conn.tor_timeout":
    "Tor'un bağlanması bir dakikadan uzun sürüyor. Açık kalır ve denemeyi sürdürür; Mesh sekmesi yönlendirmenin başladığını ya da bu ağın engellediğini söyleyecek.",
  "settings.conn.tor_failed":
    "Tor başlatılamadı. Uygulamanın ağ erişimi olduğundan emin ol.",
  "settings.conn.mint_clearnet":
    "Darphane trafiğine açık ağ üzerinden izin ver",
  "settings.conn.mint_clearnet_desc":
    "iOS'ta Tor yalnızca Nostr'ı kapsar. Darphane isteklerini engellemek için kapalı bırak; mesh üzerinden ecash her iki durumda da çalışır.",
  "settings.conn.gateway": "İnternet geçidi",
  "settings.conn.gateway_desc":
    "Bağlantını yakındaki çevrimdışı bir telefona ödünç ver, böylece konum kanallarına yine de ulaşabilsin",
  "settings.conn.gateway_on_title": "İnternet geçidi açılsın mı?",
  "settings.conn.gateway_on_body":
    "Kendi bağlantısı olmayan yakındaki telefonlar konum kanalı mesajlarını seninki üzerinden gönderip alacak. Bu senin mobil verini ve pilini kullanır; mesajları uçtan uca şifreli kalır, dolayısıyla üzerinden geçeni okuyamazsın.",
  "settings.conn.gateway_off_title": "İnternet geçidi kapatılsın mı?",
  "settings.conn.gateway_off_body":
    "Yakındaki çevrimdışı telefonlar konum kanallarına seninki üzerinden ulaşmayı bırakır. Kendi mesajların etkilenmez.",
  "settings.conn.bridge": "Mesh köprüsü",
  "settings.conn.bridge_desc":
    "Bu alanın herkese açık #bluetooth sohbetini, menzil dışındaki başka bir Bluetooth kalabalığıyla internet üzerinden birleştir",
  "settings.conn.bridge_on_title": "Mesh köprüsü açılsın mı?",
  "settings.conn.bridge_on_body":
    "Herkese açık #bluetooth mesajların internet üzerinden mahallene yayımlanacak, böylece Bluetooth menzilinin ötesindekiler de okuyabilecek. Özel mesajlar asla köprülenmez ve “yalnızca yakında” tek bir mesajı yerel tutar.",
  "settings.conn.bridge_off_title": "Mesh köprüsü kapatılsın mı?",
  "settings.conn.bridge_off_body":
    "Herkese açık #bluetooth mesajların yeniden Bluetooth menzilinde kalır ve köprülenen kalabalıktan gelen mesajlar buraya ulaşmayı bırakır.",
  "settings.conn.bridge_needs_location": "Mesh köprüsü konum gerektiriyor",
  "settings.conn.bridge_needs_location_desc":
    "Mahalleni bir konum tespitinden bulur. Köprülemeyi başlatmak için konum izni ver.",
  "settings.conn.grant_location": "Konum izni ver",
  "settings.conn.grant_short": "İzin ver",
  "settings.conn.orbot_body":
    "Airhop, Tor trafiğini Orbot üzerinden yönlendirir. Orbot'u Play Store'dan kurup etkinleştir, sonra bunu aç.",
  "settings.conn.internet_off": "İnternet kapalı",
  "settings.conn.internet_off_desc":
    "Tor, köprü ve geçit interneti kullanır. Bunları kullanmak için Ağ altındaki İnternet yedeğini aç.",
  "settings.conn.turn_on": "Aç",
  "settings.conn.turn_off": "Kapat",
  "settings.conn.orbot_title": "Android'de Tor",
  "settings.conn.get_orbot": "Orbot'u indir",
  "settings.conn.later": "Sonra",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Yakındaki cihazları bulur ve mesajları aralarında aktarır. Bu olmadan mesh çalışamaz.",
  "settings.permissions.location": "Konum",
  "settings.permissions.location_desc":
    "Yakın alan kanallarını açar. Bu olmadan o kanallar kapalı kalır ve Bluetooth mesh'i her zamanki gibi sürer.",
  "settings.permissions.notifications": "Bildirimler",
  "settings.permissions.notifications_desc":
    "Uygulama kapalıyken bile yeni mesajlar için uyarı al. Bu olmadan onları yalnızca Airhop'u açtığında görürsün.",
  "settings.permissions.camera": "Kamera",
  "settings.permissions.camera_desc":
    "QR kodları tarar ve gönderilecek fotoğraf ya da video çeker. Bu olmadan da galerinden medya paylaşabilirsin.",
  "settings.permissions.photos": "Fotoğraflar",
  "settings.permissions.photos_desc":
    "Galerinden fotoğraf gönderir ve gelen medyayı kaydeder. Bu olmadan da kamerayla yeni fotoğraf çekip gönderebilirsin.",
  "settings.permissions.microphone": "Mikrofon",
  "settings.permissions.microphone_desc":
    "Sesli mesaj kaydeder ve gönderir ya da canlı sesi çalıştırır. Bu olmadan sesli mesajlar ve canlı ses çalışmaz.",
  "settings.permissions.allow": "Bu izni ver",
  "settings.permissions.open_settings":
    "Bu izni değiştirmek için sistem ayarlarını aç",
  "settings.permissions.system": "Sistem",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Ağ kullanımı",
  "settings.storage.storage_usage": "Depolama kullanımı",
  "settings.storage.storage_usage_desc":
    "Mesajlar, cüzdan kanıtları ve önbellekteki ekler",
  "settings.storage.session_usage":
    "Bu oturum · {sent} gönderildi, {received} alındı",
  "settings.storage.cache": "Önbellek",
  "settings.storage.cache_desc": "{size} ek",
  "settings.storage.clear_cache": "Ek önbelleğini temizle",
  "settings.storage.clear": "Temizle",
  "settings.storage.clear_title": "Önbellekteki medya temizlensin mi?",
  "settings.storage.clear_body":
    "Fotoğraflar, videolar, sesli notlar ve dosyalar bu cihazdan kaldırılır; gönderilenler de alınanlar da. Yeniden indirilemezler: baloncukları bunu söyler ve gönderenden yeniden göndermesini isteyebilirsin. Mesajlar ve cüzdan dokunulmadan kalır.",
  "settings.storage.cleared": "Önbellek temizlendi",
  "settings.storage.freed": "{size} boşaltıldı.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Görünümü {value} yap",
  "settings.font.set_a11y": "Eş aralıklı yazı tipini {value} yap",
  "settings.font.system": "Sistem",
  "settings.font.system_desc":
    "Cihazının varsayılan eş aralıklı yazı tipini kullanır",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Modern ve okunması kolay",
  "settings.language.en": "İngilizce",
  "settings.language.am": "Amharca",
  "settings.language.ar": "Arapça",
  "settings.language.bn": "Bengalce",
  "settings.language.my": "Birmanca",
  "settings.language.zh_hans": "Çince (Basitleştirilmiş)",
  "settings.language.zh_hant": "Çince (Geleneksel)",
  "settings.language.nl": "Felemenkçe",
  "settings.language.fil": "Filipince",
  "settings.language.fr": "Fransızca",
  "settings.language.ka": "Gürcüce",
  "settings.language.de": "Almanca",
  "settings.language.hi": "Hintçe",
  "settings.language.id": "Endonezce",
  "settings.language.it": "İtalyanca",
  "settings.language.ja": "Japonca",
  "settings.language.ko": "Korece",
  "settings.language.mg": "Malgaşça",
  "settings.language.ms": "Malayca",
  "settings.language.ne": "Nepalce",
  "settings.language.fa": "Farsça",
  "settings.language.pl": "Lehçe",
  "settings.language.pt_br": "Portekizce (Brezilya)",
  "settings.language.pt_pt": "Portekizce (Portekiz)",
  "settings.language.pa": "Pencapça",
  "settings.language.ru": "Rusça",
  "settings.language.es": "İspanyolca",
  "settings.language.sw": "Svahili",
  "settings.language.sv": "İsveççe",
  "settings.language.ta": "Tamilce",
  "settings.language.th": "Tayca",
  "settings.language.tr": "Türkçe",
  "settings.language.uk": "Ukraynaca",
  "settings.language.ur": "Urduca",
  "settings.language.vi": "Vietnamca",
  "settings.language.pseudo": "Sözde yerel ayar",
  "settings.language.soon": "Yakında",
  "settings.language.soon_a11y": "{value}, yakında",
  "settings.language.set_a11y": "Dili {value} yap",
  "settings.language.pending": "Bir sonraki açılışta",
  "settings.language.pending_a11y":
    "{value}, Airhop'u bir sonraki açışında geçerli olur",
  "settings.language.rtl_title": "Bitirmek için Airhop'u yeniden aç",
  "settings.language.rtl_body":
    "{value} sağdan sola okunur ve Airhop yönünü yalnızca başlarken değiştirebilir. Geçişi tamamlamak için kapat ve yeniden aç. Hiçbir şey kaybolmaz ve o ana kadar mesh'in bağlı kalır.",
  "settings.theme.light": "Açık",
  "settings.theme.light_desc": "Her zaman açık paleti kullan",
  "settings.theme.dark": "Koyu",
  "settings.theme.dark_desc": "Her zaman koyu paleti kullan",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Çevrimiçi",
  "settings.status.online_desc": "Keşfedilebilir, yayın yapıyor ve tarıyor",
  "settings.status.away": "Uzakta",
  "settings.status.away_desc": "Mesh duraklatıldı, tarama ve yayın yok",
  "settings.status.invisible": "Görünmez",
  "settings.status.invisible_desc": "Tarıyor ama keşiften gizli",
  "settings.status.title": "Durum",
  "settings.status.set_a11y": "Durumu {value} yap",
  "settings.status.edit": "Durumu düzenle",
  "settings.status.desc": "Mesh üzerinde ne kadar görünür olacağını seç.",
  "settings.transfer.identity": "Kimlik ve anahtarlar",
  "settings.transfer.identity_desc": "Eş kimliğin, kullanıcı adın ve kişilerin",
  "settings.transfer.chats": "Sohbetler ve geçmiş",
  "settings.transfer.chats_desc": "Konuşmalar, gruplar ve katıldığın kanallar",
  "settings.transfer.wallet": "Cüzdan bakiyesi",
  "settings.transfer.wallet_desc": "Cashu kanıtları ve işlem geçmişi",
  "settings.transfer.title": "Yeni telefona taşı",
  "settings.transfer.desc":
    "Kimliğini, sohbetlerini ve cüzdanını başka bir cihaza taşı",
  "settings.transfer.coming_soon_a11y": "Yeni telefona taşı, yakında",
  "settings.transfer.body":
    "İki telefonu yan yana tut ve her şeyi Bluetooth üzerinden aktar. Hiçbir şey bir sunucudan geçmez, bu yüzden internetsiz çalışır.",
  "settings.qr.permission_label": "Fotoğraf erişimi",
  "settings.qr.permission_purpose": "QR kodunu kaydetmek",
  "settings.qr.saved": "Kaydedildi",
  "settings.qr.saved_body": "QR kod fotoğraf galerine kaydedildi.",
  "settings.qr.save_failed": "Kaydedilemedi",
  "settings.qr.save_failed_body": "QR kod kaydedilemedi. Yeniden dene.",
  "settings.qr.share_message": "Beni Airhop'ta ekle",
  "settings.qr.share_body":
    "Beni Airhop'ta ekle — önce çevrimdışı çalışan, özel mesh mesajlaşma.",
  "settings.qr.show_short": "QR göster",
  "settings.qr.title": "QR kodun",
  "settings.qr.note":
    "Bu, başkalarının sana her yerden yazmasını sağlayan açık anahtarlarını içerir. Yalnızca güvendiğin kişilerle paylaş. Kimliğini silmediğin sürece değişmez.",
  "settings.qr.code_label": "Kişi kodu",
  "settings.qr.copy_code": "Kişi kodunu kopyala",
  "settings.qr.share": "QR kodu paylaş",
  "settings.qr.share_short": "QR paylaş",
  "settings.qr.download": "QR kodu indir",
  "settings.qr.download_short": "QR indir",
  "settings.qr.show": "QR kodu göster",
  "settings.wipe.trigger": "Panik temizliğini başlat",
  "settings.wipe.trigger_desc":
    "Onay almadan hemen temizlemek için üç kez dokun",
  "settings.wipe.title": "Panik temizliği",
  "settings.wipe.now": "Şimdi temizle",
  "settings.wipe.desc":
    "Tüm anahtarları, mesajları ve kanıtları anında yok eder",
  "settings.wipe.body":
    "Bu, tüm anahtarlarını, mesajlarını ve cüzdan kanıtlarını anında yok eder. Geri alınamaz.",
  "settings.wipe.in_progress": "Temizleniyor",
  "settings.wipe.in_progress_body":
    "Anahtarların, mesajların ve dosyaların yok ediliyor. Bu birkaç saniye sürer ve uygulama kapansa bile kendiliğinden tamamlanır.",
  "settings.wipe.got_it": "Anladım",
  "settings.wipe.keys_failed": "Anahtarlar yok edilemedi",
  "settings.wipe.keys_failed_body":
    "Mesajların, kişilerin ve cüzdanın gitti ama cihaz anahtarlarını bırakmayı reddetti. Cihazın kilidini aç ve yeniden temizle.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Bize yaz",
  "settings.help.contact_a11y": "{address} adresine e-posta gönder",
  "settings.help.bug": "Hata bildir",
  "settings.help.bug_desc": "GitHub üzerinde bir konu aç",
  "settings.help.bug_a11y": "GitHub üzerinde hata bildir",
  "settings.help.faq": "Sıkça sorulan sorular",
  "settings.help.faq_desc": "Yaygın soruların yanıtları",
  "settings.help.faq_a11y": "SSS'yi aç",
  "settings.help.terms_desc": "Airhop nasıl kullanılabilir",
  "settings.help.terms_a11y": "Kullanım Koşulları'nı aç",
  "settings.help.privacy_desc": "Neleri toplamıyoruz",
  "settings.help.privacy_a11y": "Gizlilik Politikası'nı aç",

  // ---- Settings: support ----
  "settings.support.card": "Kart ya da UPI",
  "settings.support.card_desc":
    "İnternet bankacılığı ve cüzdanlar, dünya genelinde",
  "settings.support.card_a11y":
    "Kart, UPI, internet bankacılığı ya da cüzdanla destek ol",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Aylık ya da tek seferlik, platform ücreti yok",
  "settings.support.sponsors_a11y": "GitHub Sponsors üzerinden destek ol",
  "settings.support.note":
    "Airhop'u boş vaktimde geliştiriyorum. Yatırımcı yok, reklam yok. İşine yarıyorsa bir katkı, geliştirmenin sürmesine çok yardım eder. Her özellik yine de ücretsiz kalır.",

  // ---- Settings: about and version ----
  "settings.about.version": "Sürüm",
  "settings.about.version_desc": "Şu anki yayın",
  "settings.about.version_a11y": "Sürümü gör ve güncelleme denetle",
  "settings.about.release_notes": "Sürüm notları",
  "settings.about.release_notes_desc": "En son yayında neler yeni",
  "settings.about.release_notes_a11y":
    "En son sürüm notlarını GitHub üzerinde aç",
  "settings.about.source": "Kaynak kodu",
  "settings.about.source_a11y": "Kaynak kodunu GitHub üzerinde aç",
  "settings.about.licenses": "Açık kaynak lisansları",
  "settings.about.open_repo": "{name} deposunu aç",
  "settings.about.licenses_desc": "Üçüncü taraf açık kaynak paketleri",
  "settings.about.licenses_a11y": "Üçüncü taraf lisanslarını gör",
  "settings.version.codename": "Kod adı",
  "settings.version.checking": "Denetleniyor",
  "settings.version.check": "Güncelleme denetle",
  "settings.version.checking_title": "Güncellemeler denetleniyor",
  "settings.version.up_to_date": "En son sürümü kullanıyorsun.",
  "settings.version.release_notes": "Sürüm notlarını gör",
  "settings.version.made_with": "Şununla yapıldı:",
  "settings.version.number": "Sürüm {version}",
  "settings.version.update_to": "{version} sürümüne güncelle",
  "settings.version.update_to_a11y": "{version} sürümüne güncelle",
  "settings.version.released_under": "{license} altında yayımlandı",
  "settings.version.notes_a11y": "{version} sürümünün notlarını gör",
  "settings.version.tor_paused":
    "IP adresini sızdırmasın diye, Tor açıkken güncelleme denetimi duraklatılır. Yayınlar sayfasına bir tarayıcıdan bak.",
  "settings.version.check_failed":
    "Güncellemeler denetlenemedi. Bağlantını denetleyip yeniden dene.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} {size} KiB, {cap} KiB sınırının üzerinde.",
  "transfer.failed.malformed":
    "Bir ek bozuk geldi ve açılamadı. Yeniden göndermelerini iste.",
  "transfer.failed.unsupported_type":
    "Bir ek, bu uygulamanın açamadığı bir biçimde geldi.",
  "transfer.failed.type_mismatch":
    "Bir ek geri çevrildi: içeriği, bildirdiği dosya türüyle uyuşmuyor.",
  "transfer.failed.storage":
    "Bir ek geldi ama kaydedilemedi. Boş alanını denetle.",
  "transfer.badge.waiting": "Bekliyor · {name}",
  "transfer.badge.active_count": "{count} aktarım",
  "transfer.badge.sending": "{name} gönderiliyor",
  "transfer.badge.receiving": "{name} alınıyor",
  "transfer.badge.a11y": "{label}, yüzde {percent}. Konuşmayı aç.",
  "transfer.kind.photo": "Fotoğraf",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Sesli not",
  "transfer.this.photo": "Bu fotoğraf",
  "transfer.this.video": "Bu video",
  "transfer.this.voice": "Bu sesli not",
  "transfer.this.file": "Bu dosya",
  "transfer.kind.document": "Belge",
  "transfer.kind.voice_preview": "Sesli not",
  "transfer.kind.photo_preview": "Fotoğraf",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Belge",

  // ---- System notifications ----
  "notif.channel.messages": "Mesajlar",
  "notif.channel.nearby": "Yakındaki eşler",
  "notif.channel.nearby_desc":
    "Mesh, Bluetooth menzilinde insan bulduğunda ara sıra gelen bir bildirim.",
  "notif.nearby.body": "Şu anda Bluetooth menzilinde. Mesh'i açmak için dokun.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Biri",
  "notif.notice_urgent": "Acil duyuru · {content}",
  "notif.notice": "Duyuru · {content}",
  "notif.incoming_file": "Gelen dosya",
  "notif.preview.photo": "📷 Fotoğraf",
  "notif.preview.voice": "🎤 Sesli mesaj",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Belge",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Yeni mesaj",
  "notif.hidden.channel": "Yeni etkinlik",
  "notif.hidden.mention": "Senden söz edildi",
  "notif.mention.title": "{sender} senden söz etti",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "{count} tane daha göster",
    other: "{count} tane daha göster",
  },
  "chat.channels.show_more_a11y": {
    one: "{count} varsayılan kanal daha göster",
    other: "{count} varsayılan kanal daha göster",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} okunmamış",
    other: "{label}, {count} okunmamış",
  },
  "a11y.new_count": {
    one: "{label}, {count} yeni",
    other: "{label}, {count} yeni",
  },
  "chat.a11y.unread": {
    one: "{count} okunmamış",
    other: "{count} okunmamış",
  },
  "chat.thread.length_left": {
    one: "{count} kaldı",
    other: "{count} kaldı",
  },
  "settings.general.retention_days": {
    one: "{count} gün",
    other: "{count} gün",
  },
  "chat.info.group_reach": {
    one: "{count} üyeden {reachable} tanesine ulaşılabiliyor",
    other: "{count} üyeden {reachable} tanesine ulaşılabiliyor",
  },
  "chat.group_members": {
    one: "Özel grup  ·  {count} üye",
    other: "Özel grup  ·  {count} üye",
  },
  "chat.select.count": {
    one: "{count} seçildi",
    other: "{count} seçildi",
  },
  "chat.select.forward": {
    one: "{count} mesajı ilet",
    other: "{count} mesajı ilet",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} kişi konuşuyor",
    other: "{count} kişi konuşuyor",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "menzilde {count} eş",
    other: "menzilde {count} eş",
  },
  "mesh.peer.hops_away": {
    one: "{count} sıçrama uzakta",
    other: "{count} sıçrama uzakta",
  },
  "chat.presence.active": {
    one: "{count} etkin",
    other: "{count} etkin",
  },
  "chat.presence.nearby": {
    one: "yakında {count}",
    other: "yakında {count}",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} darphane",
    other: "{count} darphane",
  },
  "wallet.mint.remove_body": {
    one: "{mint}, {count} kanıt içinde {balance} {unit} tutuyor. Kaldırmak o kanıtı bu cihazdan kalıcı olarak siler ve yedeği yoktur. Önce bakiyeyi çek ya da gönder.",
    other:
      "{mint}, {count} kanıt içinde {balance} {unit} tutuyor. Kaldırmak o kanıtları bu cihazdan kalıcı olarak siler ve yedeği yoktur. Önce bakiyeyi çek ya da gönder.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} yatırma ödeme bekliyor. Uygulama her açıldığında yeniden denetleniyor.",
    other:
      "{count} yatırma ödeme bekliyor. Uygulama her açıldığında yeniden denetleniyor.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints} kaynağından {count} harcanmamış kanıt kurtarıldı.",
    other: "{mints} kaynağından {count} harcanmamış kanıt kurtarıldı.",
  },
  "wallet.backup.already_spent": {
    one: "{count} jeton bulundu ama zaten harcanmıştı, bu yüzden karşılığında hiçbir şey yazılmadı. Bu normaldir: şimdiye kadar harcadığın her jeton darphanenin tuttuğu kayıtlarda görünmeye devam eder.",
    other:
      "{count} jeton bulundu ama zaten harcanmıştı, bu yüzden karşılığında hiçbir şey yazılmadı. Bu normaldir: şimdiye kadar harcadığın her jeton darphanenin tuttuğu kayıtlarda görünmeye devam eder.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "{count} tane daha göster",
    other: "{count} tane daha göster",
  },
  "wallet.activity.show_more_a11y": {
    one: "{count} ödeme daha göster",
    other: "{count} ödeme daha göster",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} onaylanmamış",
    other: "{count} onaylanmamış",
  },
  "wallet.proof_count": {
    one: "{count} kanıt",
    other: "{count} kanıt",
  },
  "wallet.spent_removed_detail": {
    one: "{count} kanıt zaten harcanmıştı ve kaldırıldı.",
    other: "{count} kanıt zaten harcanmıştı ve kaldırıldı.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Yakında biri var",
    other: "Yakında {count} kişi var",
  },
};

export const tr = { strings, plurals };
