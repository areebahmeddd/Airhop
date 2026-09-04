// ms: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Batal",
  "common.done": "Selesai",
  "common.ok": "OK",
  "common.close": "Tutup",
  "common.back": "Kembali",
  "common.delete": "Padam",
  "common.remove": "Buang",
  "common.add": "Tambah",
  "common.copy": "Salin",
  "common.copied": "Disalin",
  "common.share": "Kongsi",
  "common.continue": "Teruskan",
  "common.try_again": "Cuba lagi",
  "common.settings": "Tetapan",
  "common.on": "Hidup",
  "common.off": "Mati",

  // ---- Dates ----
  "format.today": "Hari ini",
  "format.yesterday": "Semalam",
  "format.minutes_ago": "{count} min lalu",
  "format.hours_ago": "{count} jam lalu",
  "format.days_ago": "{count} hari lalu",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Sembang",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Dompet",
  "nav.tab.profile": "Anda",
  "a11y.tab.new_peers": "{label}, ada orang baharu berdekatan",
  "nav.notifications": "Pemberitahuan",
  "chat.subtab.channels": "Saluran",
  "chat.subtab.direct": "Terus",
  "chat.subtab.dms": "Mesej terus",
  "chat.search.placeholder": "Cari dalam sembang…",
  "chat.search.a11y": "Cari dalam sembang dan mesej",
  "chat.search.close": "Tutup carian",
  "chat.search.clear": "Kosongkan carian",
  "mesh.view.radar": "Paparan radar",
  "mesh.view.list": "Paparan senarai",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Senarai",

  // ---- Legal document names ----
  "legal.last_updated": "Kemas kini terakhir: {date}",
  "legal.terms": "Terma Perkhidmatan",
  "legal.privacy": "Dasar Privasi",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Komunikasi mesh yang peribadi",
  "onboarding.welcome.cta": "Mulakan",
  "onboarding.welcome.cta_hint": "Setujui terma di bawah untuk meneruskan",
  "onboarding.welcome.consent_a11y":
    "Setujui Terma Perkhidmatan dan Dasar Privasi",
  "onboarding.welcome.open_terms": "Buka Terma Perkhidmatan",
  "onboarding.welcome.open_privacy": "Buka Dasar Privasi",
  "onboarding.welcome.consent":
    "Dengan menekan {cta}, anda bersetuju dengan {terms} dan {privacy} kami.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Menjana identiti anda",
  "onboarding.identity.body":
    "Menjana pasangan kunci Ed25519 pada peranti ini.\nTiada apa-apa dihantar ke mana-mana.",
  "onboarding.identity.failed_heading": "Kunci anda tidak dapat dicipta",
  "onboarding.identity.failed_body":
    "Peranti ini tidak membenarkan Airhop menyimpannya dengan selamat. Cuba lagi, atau mulakan semula telefon anda dan buka Airhop sekali lagi.",
  "onboarding.identity.steps_a11y": "Langkah: {steps}",
  "onboarding.identity.step.x25519": "Menjana pasangan kunci statik X25519",
  "onboarding.identity.step.ed25519":
    "Menjana pasangan kunci tandatangan Ed25519",
  "onboarding.identity.step.keychain":
    "Menyimpan kunci dalam rantai kunci sistem",
  "onboarding.identity.step.peer_id": "Menerbitkan ID rakan",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Nama anda pada mesh",
  "onboarding.username.peer_id": "ID rakan",
  "onboarding.username.card_a11y":
    "Nama anda pada mesh ialah {username}. ID rakan {peerID}. {props}.",
  "onboarding.username.explanation":
    "Nama pengguna ini diterbitkan secara berketentuan daripada kunci awam anda. Ia sama pada setiap peranti yang melihat ID rakan anda.",
  "onboarding.username.cta": "Masuk ke Airhop",
  "onboarding.username.prop.algorithm": "Algoritma",
  "onboarding.username.prop.storage": "Simpanan",
  "onboarding.username.prop.storage_value": "Rantai kunci sistem sahaja",
  "onboarding.username.prop.account": "Akaun diperlukan",
  "onboarding.username.prop.account_value": "Tiada",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Selamat datang ke Airhop",
  "onboarding.hello.p1":
    "Hai. Airhop dibina di atas bitchat sebagai projek sampingan sumber terbuka yang berdiri sendiri. Ia tidak bergabung dengan dan tidak disokong oleh projek bitchat mahupun permissionless tech, cuma sesuatu yang saya seronok bina dan kongsikan dengan komuniti.",
  "onboarding.hello.p2":
    "Ini keluaran pertama untuk iOS dan Android, jadi walaupun saya sudah mengujinya bersama rakan-rakan, anda mungkin masih terjumpa beberapa pepijat. Kalau begitu, atau kalau anda ada idea ciri, saya ingin mendengarnya. Buka isu di {github} atau e-mel saya di {email}.",
  "onboarding.hello.p3":
    "Kalau Airhop berguna kepada anda, pertimbangkan untuk meninggalkan bintang di {github} atau ulasan di {store}. Ia membantu lebih ramai orang menemui projek ini. Terima kasih kerana mencuba!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Sebelum telefon anda bertanya",
  "onboarding.primer.lede": "Inilah yang setiap satu lakukan, dan yang tidak.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Mencari peranti berdekatan dan menyampaikan mesej antara mereka. Begitulah mesh terbentuk, dan ia berfungsi tanpa sambungan internet.",
  "onboarding.primer.location.title": "Lokasi",
  "onboarding.primer.location.body":
    "Meletakkan anda dalam saluran kawasan berdekatan, daripada satu blok sehingga satu wilayah. Airhop tidak pernah menjejaki anda atau menghantar lokasi tepat anda keluar daripada peranti.",
  "onboarding.primer.notifications.title": "Pemberitahuan",
  "onboarding.primer.notifications.body":
    "Terima makluman untuk mesej baharu walaupun aplikasi ditutup. Pemberitahuan dicipta secara setempat pada peranti anda, tanpa penglibatan pelayan.",
  "onboarding.primer.footnote":
    "Anda boleh menolak. Mesej tetap bergerak melalui internet, dan anda boleh berubah fikiran kemudian dalam Tetapan.",
  "onboarding.primer.cta_a11y": "Teruskan ke permintaan kebenaran",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Capaian Bluetooth",
  "permission.bluetooth.purpose": "menemui peranti berdekatan melalui mesh",
  "permission.open_settings": "Buka Tetapan",
  "permission.not_now": "Bukan sekarang",
  "permission.blocked_title": "{label} dimatikan",
  "permission.blocked_body": "Hidupkannya dalam Tetapan untuk {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Ada sesuatu tidak kena",
  "error.boundary.body":
    "Airhop menemui masalah tidak dijangka dan terpaksa menghentikan apa yang sedang dipaparkan.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Saluran lalai",
  "chat.channels.yours": "Saluran anda",
  "chat.channels.none": "Belum ada saluran",
  "chat.channels.none_hint":
    "Ketik {plus} di atas untuk menyertai atau mencipta satu.",
  "chat.channels.none_desc":
    "Belum ada saluran. Guna butang tambah pada pengepala untuk menyertai atau mencipta satu.",
  "chat.channels.show_fewer": "Tunjuk lebih sedikit saluran lalai",
  "chat.channels.show_less": "Tunjuk lebih sedikit",
  "chat.channels.info": "Maklumat saluran",
  "chat.channels.pin": "Sematkan saluran",
  "chat.channels.unpin": "Nyahsemat saluran",
  "chat.channels.mute": "Bisukan saluran",
  "chat.channels.unmute": "Nyahbisukan saluran",
  "chat.channels.leave": "Tinggalkan saluran",
  "chat.channels.leave_confirm": "Tinggalkan",
  "chat.channels.clear_body":
    "Padam semua mesej dalam {name}? Ia tidak boleh dibatalkan.",
  "chat.channels.leave_body":
    "Tinggalkan {name}? Anda berhenti menerima mesejnya, dan sejarahnya dibuang daripada peranti ini.",
  "chat.channels.more_options": "Pilihan lain untuk {name}",
  "chat.channels.teleported_tag": "{level}  ·  terpindah",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Kosongkan sembang",
  "chat.dm.remove_contact": "Buang kenalan",
  "chat.dm.block": "Sekat rakan ini",
  "chat.dm.block_confirm": "Sekat",
  "chat.dm.delete": "Padam sembang",
  "chat.dm.delete_body":
    "Ini membuang perbualan daripada senarai anda dan memadam mesejnya. Kenalannya dikekalkan, dan mesej baharu daripada mereka memulakan sembang yang baharu.",
  "chat.dm.in_range": "dalam jangkauan",
  "chat.dm.row_hint": "Ketik dua kali dan tahan untuk pilihan lain",
  "chat.channels.row_hint": "Ketik dua kali dan tahan untuk pilihan lain",
  "chat.dm.you_prefix": "Anda:",
  "chat.dm.none": "Tiada mesej terus",
  "chat.dm.none_desc":
    "Pergi ke tab Mesh dan ketik seorang rakan untuk memulakan mesej terus yang disulitkan.",
  "chat.dm.contact_info": "Maklumat kenalan",
  "chat.dm.pin": "Sematkan sembang",
  "chat.dm.unpin": "Nyahsemat sembang",
  "chat.dm.mute": "Bisukan sembang",
  "chat.dm.unmute": "Nyahbisukan sembang",
  "chat.dm.clear_body":
    "Padam semua mesej dengan {name}? Ia tidak boleh dibatalkan.",
  "chat.dm.remove_contact_body":
    "Buang {name}? Ini memadam perbualan itu dan melupakan kenalannya. Mereka masih boleh menghubungi anda kalau mereka menghantar mesej lagi.",
  "chat.dm.block_body":
    "Sekat {name}? Anda tidak akan melihat mereka dalam tab Mesh atau menerima mesej daripada mereka, walaupun mereka berdekatan.",
  "chat.dm.more_options": "Pilihan lain untuk {name}",
  "chat.dm.remove_contact_short": "Buang kenalan",
  "chat.dm.block_short": "Sekat kenalan",
  "chat.dm.delete_short": "Padam sembang",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Kosongkan mesej",
  "chat.clear_confirm": "Kosongkan",
  "chat.group_badge": "Kumpulan",
  "chat.more": "Lagi",
  "chat.no_messages": "Belum ada mesej",
  "chat.you": "Anda",
  "chat.a11y.channel": "Saluran {name}",
  "chat.a11y.group": "Kumpulan {name}",
  "chat.a11y.muted": "dibisukan",
  "chat.a11y.pinned": "disematkan",

  // ---- Chats: start something new ----
  "chat.new.title": "Mulakan sesuatu yang baharu",
  "chat.new.channel": "Cipta saluran peribadi",
  "chat.new.channel_label": "Saluran peribadi",
  "chat.new.channel_desc":
    "Sebuah bilik yang boleh disertai sesiapa yang ada pautannya. Ciptakan satu, atau sertai dengan pautan yang dihantar kepada anda.",
  "chat.new.group": "Cipta kumpulan peribadi",
  "chat.new.group_label": "Kumpulan peribadi",
  "chat.new.group_desc":
    "Pilih orang tertentu. Sehingga 16. Kekal pada Bluetooth.",
  "chat.new.place": "Pergi ke suatu tempat melalui geohash",
  "chat.new.place_label": "Pergi ke suatu tempat",
  "chat.new.place_desc": "Buka saluran lokasi di mana-mana melalui geohashnya.",
  "chat.new.reach": "Jangkauan",
  "chat.new.reach_internet": "Mencapai ahli melalui Bluetooth dan internet.",
  "chat.new.reach_mesh":
    "Berfungsi dalam jangkauan Bluetooth, bukan melalui internet.",
  "chat.new.reach_internet_desc":
    "Mencapai ahli melalui internet juga. Geganti boleh melihat bahawa salurannya aktif, tidak pernah mesejnya atau siapa yang ada di dalamnya.",
  "chat.new.reach_mesh_desc":
    "Kekal pada mesh setempat. Paling peribadi, tiada apa-apa keluar daripada jangkauan Bluetooth.",
  "chat.new.join_link": "Sertai saluran peribadi dengan pautan jemputan",
  "chat.new.back_to_chooser": "Kembali ke pilihan",
  "chat.new.create_channel": "Cipta saluran",
  "chat.new.name_required": "Masukkan nama saluran dahulu",
  "chat.new.name_taken": "Nama itu sudah diambil",
  "chat.new.create": "Cipta",
  "chat.new.e2ee":
    "Disulitkan hujung ke hujung. Hanya ahli boleh membaca mesejnya.",
  "chat.new.invite_only":
    "Melalui jemputan sahaja. Sesiapa yang anda kongsikan pautannya boleh menyertai. Ia kekal tersembunyi daripada semua orang lain, malah daripada rakan berdekatan.",
  "chat.new.name_exists": "Saluran dengan nama ini sudah wujud.",
  "chat.new.reach_bluetooth_chip": "Bluetooth sahaja",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Sertai dengan pautan jemputan",

  // ---- Chats: join by link ----
  "chat.join.title": "Sertai dengan pautan",
  "chat.join.not_airhop": "Itu bukan pautan Airhop.",
  "chat.join.reach_internet": "Mencapai ahli melalui Bluetooth dan internet.",
  "chat.join.reach_mesh": "Kekal dalam jangkauan Bluetooth.",
  "chat.join.contact_card":
    "Sebuah kad kenalan. Ia menambah mereka ke dalam kenalan anda dan membuka sembangnya.",
  "chat.join.unverified": "Pautan itu tidak dapat disahkan",
  "chat.join.unverified_body":
    "Kad kenalan itu tidak sepadan dengan kuncinya sendiri, jadi ia tidak ditambah. Minta mereka menghantar yang baharu.",
  "chat.join.paste": "Tampal daripada papan keratan",
  "chat.join.join": "Sertai",
  "chat.join.public_channel":
    "Saluran awam {name}. Sesiapa yang berdekatan boleh membacanya.",
  "chat.join.private_channel": "Saluran peribadi {name}. {reach}",
  "chat.join.dm_with": "Mesej terus dengan {name}.",
  "chat.join.joined_as": "Menyertai sebagai {name}",
  "chat.join.name_clash_body":
    "Anda sudah berada dalam {name} yang berbeza. Nama saluran hanyalah label, jadi jemputan ini membuka salurannya sendiri dan saluran yang anda sertai tidak disentuh. Anda boleh menamakan semula kedua-duanya daripada maklumat salurannya.",
  "chat.join.paste_hint":
    "Tampal jemputan yang bermula dengan airhop://. Mengetik pautan juga berfungsi; ini untuk pautan yang tidak boleh anda ketik.",
  "chat.join.key_note":
    "Jemputan saluran peribadi membawa kuncinya, jadi penyertaan berlaku serta-merta dan tiada sesiapa lain perlu ditanya apa-apa.",
  "chat.join.offline_note":
    "Berfungsi secara luar talian. Pautannya dibaca pada peranti ini, dan salurannya mencapai sejauh yang ditetapkan penciptanya.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Sel itu tidak dapat dibuka. Cuba lagi sebentar lagi.",
  "chat.jump.title": "Pergi ke suatu tempat",
  "chat.jump.saved": "TEMPAT DISIMPAN",
  "chat.jump.anywhere":
    "Buka saluran lokasi awam di mana-mana, malah tempat yang anda tidak berada.",
  "chat.jump.geohash_note":
    "Masukkan geohashnya. Semua orang yang lokasinya jatuh dalam sel itu berkongsi salurannya.",
  "chat.jump.teleport_note":
    "Anda kelihatan terpindah, bukan berdekatan. Ia mencapai melalui internet sahaja.",
  "chat.jump.level_cell": "Sel peringkat {level}",
  "chat.jump.already_here":
    "Anda sudah ada di sini. Pergi akan membuka saluran {name} anda.",
  "chat.jump.open_direction": "Buka sel di sebelah {direction} anda",
  "chat.jump.open_place": "Buka {name}",
  "chat.jump.remove_place": "Buang {name} daripada tempat disimpan",
  "chat.jump.go": "Pergi",
  "chat.jump.how":
    "Cara mencari geohash: buka saluran lokasi > ketik namanya > salin daripada sana.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Tidak semua ahli dapat dicapai. Cuba lagi semasa mereka berdekatan.",
  "chat.group.you_were_added": "Anda ditambah ke dalam {name}.",
  "chat.group.added_you": "Menambah anda ke dalam {name}",
  "chat.group.you_were_removed":
    "Anda dikeluarkan daripada {name}. Anda tidak lagi boleh membaca atau menghantar mesej di sini.",
  "chat.group.removed_you": "Mengeluarkan anda daripada {name}",
  "chat.group.add_failed": "Mereka tidak dapat ditambah",
  "chat.group.add_failed_body":
    "Tiada apa-apa berubah. Sama ada mereka tidak dapat dicapai buat masa ini, kumpulannya sudah penuh pada 16, atau anda bukan penciptanya.",
  "chat.group.remove_failed": "Mereka tidak dapat dikeluarkan",
  "chat.group.remove_failed_body":
    "Tiada apa-apa berubah. Hanya orang yang mencipta kumpulan itu boleh mengubah siapa yang ada di dalamnya.",
  "chat.group.e2ee":
    "Disulitkan hujung ke hujung. Hanya ahli boleh membaca mesejnya.",
  "chat.group.cap":
    "Sehingga 16 orang, dipilih oleh anda. Tiada pautan jemputan, jadi tiada sesiapa masuk kerana pautan yang dikirimkan orang lain.",
  "chat.group.bluetooth":
    "Bluetooth sahaja. Ahli di luar jangkauan menerima mesejnya sebaik mereka kembali.",
  "chat.group.members_label": "AHLI",
  "chat.group.none_in_range":
    "Tiada sesiapa dalam jangkauan. Ahli mesti berdekatan semasa anda mencipta kumpulan itu.",
  "chat.group.create_title": "Cipta sebuah kumpulan",
  "chat.group.name_placeholder": "Nama kumpulan",
  "chat.group.create": "Cipta",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Mesh setempat · Bluetooth sahaja",
  "chat.scope.mesh_desc":
    "Mencapai peranti dalam jangkauan Bluetooth (lebih kurang 10 hingga 100 meter). Tidak perlu internet. Sesuai untuk penyelarasan di tempat.",
  "chat.scope.block": "Blok bandar · ~100 m",
  "chat.scope.block_desc":
    "Liputan seluas satu blok bandar. Mesej dijambatani melalui internet supaya rakan yang berada tepat di luar jangkauan Bluetooth tetap boleh menyertainya.",
  "chat.scope.neighborhood": "Kejiranan · ~1 km",
  "chat.scope.neighborhood_desc":
    "Liputan peringkat kejiranan. Dibantu geganti supaya rakan di seluruh kawasan boleh dicapai walaupun tanpa pautan Bluetooth terus.",
  "chat.scope.city": "Bandar · ~10 km",
  "chat.scope.city_desc":
    "Saluran seluruh bandar. Menggunakan geganti internet berasaskan lokasi untuk mencapai rakan di seluruh kawasan metropolitan.",
  "chat.scope.province": "Negeri · ~100 km",
  "chat.scope.province_desc":
    "Liputan peringkat negeri. Dijambatani melalui internet untuk jangkauan serantau sejauh ratusan kilometer.",
  "chat.scope.country": "Negara atau wilayah · ~1000 km",
  "chat.scope.country_desc":
    "Liputan seluruh negara. Mana-mana pengguna Airhop atau bitchat di wilayah itu boleh menyertainya dan membaca mesejnya.",
  "chat.transport.bluetooth": "Bluetooth sahaja",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Internet sahaja",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Perintah /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Hantar pelukan hangat",
  "chat.cmd.slap_hint": "Tampar dengan ikan trout besar",
  "chat.status.sending": "Menghantar…",
  "chat.status.undo_send": "Batalkan hantaran",
  "chat.status.undo": "Batalkan",
  "chat.status.sent": "Dihantar",
  "chat.status.received": "Diterima",
  "chat.status.failed": "Gagal",
  "chat.status.canceled": "Dibatalkan",
  "chat.status.waiting": "Menunggu",
  "chat.status.sending_short": "Menghantar",
  "chat.status.receiving": "Menerima",
  "chat.thread.not_available": "Tidak tersedia di sini",
  "chat.thread.private_channel": "Saluran peribadi",
  "chat.thread.location_channel": "Saluran lokasi",
  "chat.thread.public_channel": "Saluran awam",
  "chat.thread.notices": "Notis untuk saluran ini",
  "chat.thread.invite": "Jemput seseorang ke saluran ini",
  "chat.thread.not_in_range":
    "Tidak dalam jangkauan Bluetooth. Dihantar melalui internet.",
  "chat.thread.not_nearby":
    "Tidak berdekatan. Kami akan menghantarnya apabila mereka kembali dalam jangkauan atau dalam talian.",
  "chat.thread.no_keys":
    "Anda perlu berada dalam jangkauan Bluetooth, atau mengimbas kod mereka, untuk menghantar mesej kepada mereka.",
  "chat.geo.card_received":
    "{name} berkongsi kenalannya. Kongsikan kenalan anda balik supaya boleh terus berbual selepas salah seorang daripada anda berpindah.",
  "chat.geo.exchange_complete":
    "Kenalan sudah ditukar. Kini anda boleh mencapai satu sama lain dari mana-mana.",
  "chat.geo.keep_person": "Simpan orang ini",
  "chat.geo.keep_person_desc":
    "Kongsikan kenalan anda supaya boleh terus berbual selepas salah seorang daripada anda berpindah. Mereka akan mengetahui identiti kekal anda.",
  "chat.geo.card_sent": "Dikongsi · menunggu kenalan mereka",
  "chat.thread.left_cell":
    "Anda sudah meninggalkan kawasan ini, jadi mereka tidak boleh mencapai anda di sini. Tukar kod supaya boleh terus berbual di mana-mana.",
  "chat.thread.no_route":
    "Tidak dapat mencapai mereka buat masa ini. Mesej akan dihantar apabila ada laluan yang tersedia.",
  "chat.thread.empty": "Belum ada mesej",
  "chat.thread.empty_desc": "Mulakan perbualan yang disulitkan.",
  "chat.thread.jump_latest": "Lompat ke mesej terkini",
  "chat.thread.back_to_members": "Kembali ke ahli",
  "chat.thread.nostr_key": "Kunci awam Nostr",
  "chat.thread.in_range": "Dalam jangkauan",
  "chat.voice.not_recorded": "Nota suara tidak terakam",
  "chat.thread.message": "Mesej",
  "chat.thread.message_placeholder": "Mesej…",
  "chat.thread.length_full": "Mesej sudah penuh",
  "chat.thread.waiting_for": "Menunggu {name} kembali · {percent}%",
  "chat.thread.peer": "rakan",
  "chat.thread.cancel_transfer": "Batalkan {name}",
  "chat.thread.queued_more": "{count} lagi menunggu untuk dihantar",
  "chat.thread.across_bridge": "{count} di seberang jambatan",
  "chat.thread.bridged": "dijambatani",
  "chat.thread.invite_body":
    "Sertai saya dalam {channel} pada Airhop — pemesejan mesh peribadi yang mengutamakan luar talian.",
  "chat.thread.go_back_unread": "Kembali, {count} belum dibaca",
  "chat.thread.view_info": "Lihat maklumat untuk {name}",
  "chat.thread.notices_new": "Notis untuk saluran ini, {count} baharu",
  "chat.thread.say_something": "Katakan sesuatu dalam {channel}.",
  "chat.thread.jump_latest_new": "Lompat ke mesej terkini, {count} baharu",
  "chat.thread.unconfirmed_since": "Tiada penghantaran disahkan sejak {date}",
  "chat.thread.no_reach":
    "Tiada rakan berdekatan · belum ada sesiapa menerima ini",
  "chat.thread.channel_needs_internet":
    "Internet dimatikan · saluran ini hanya mencapai orang dalam jangkauan Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet dimatikan · sel ini hanya boleh dicapai melalui internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet dimatikan · perbualan ini hanya dibawa melalui internet",
  "chat.thread.via_gateway":
    "Internet dimatikan · sebuah peranti berdekatan sedang membawa ini ke rangkaian untuk anda",
  "chat.thread.group_queued":
    "Belum ada ahli kumpulan ini yang berdekatan. Ia akan sampai kepada mereka apabila mereka ada.",
  "chat.thread.no_group_key":
    "Anda tidak lagi berada dalam kumpulan ini, jadi ini tidak boleh dihantar",
  "chat.thread.no_reach_offline":
    "Internet dimatikan dan tiada rakan berdekatan · belum ada sesiapa menerima ini",
  "chat.thread.mention": "Sebut {name}",
  "chat.thread.someone_talking": "{hold}. {name} sedang bercakap.",
  "chat.thread.attach_note":
    "Fail dihantar dalam jangkauan Bluetooth sahaja. Teks dan bayaran mencapai kenalan melalui internet; lampiran tidak.",
  "chat.thread.message_peer": "Hantar mesej kepada {name}",
  "chat.thread.send": "Hantar mesej",
  "chat.thread.group": "Kumpulan",
  "chat.bridge.nearby_only":
    "Berdekatan sahaja: jauhkan mesej ini daripada jambatan mesh",
  "chat.bridge.nearby_label": "Berdekatan sahaja · kekal pada Bluetooth",
  "chat.bridge.bridging_label":
    "Menjambatani ke kawasan berdekatan · ketik untuk berdekatan sahaja",
  "chat.screenshot.you_took": "Anda mengambil tangkapan skrin",
  "chat.screenshot.you_took_private":
    "Anda mengambil tangkapan skrin · tiada sesiapa diberitahu",
  "chat.screenshot.heads_up": "Perhatian",
  "chat.screenshot.notice": "* {name} mengambil tangkapan skrin *",
  "chat.screenshot.notified_dm":
    "{name} telah diberitahu bahawa anda mengambil tangkapan skrin perbualan ini.",
  "chat.screenshot.notified":
    "Semua orang dalam saluran ini telah diberitahu bahawa anda mengambil tangkapan skrin.",
  "chat.screenshot.not_notified":
    "Tiada sesiapa diberitahu. Saluran ini awam, jadi mengumumkan tangkapan skrin akan merekodkan bahawa anda pernah di sini.",
  "chat.thread.error": "Ralat",
  "chat.thread.go_back": "Kembali",
  "chat.bubble.via_bridge": "melalui jambatan mesh",
  "chat.bubble.view_profile": "Lihat profil {name}",
  "chat.bubble.forwarded": "Dikirimkan",
  "chat.bubble.attachment": "lampiran",
  "chat.bubble.a11y": "{sender}: {body}. Tekan lama untuk pilihan lain.",
  "chat.bubble.failed_retry": "Gagal dihantar. Ketik untuk mencuba lagi.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Maklumat mesej",
  "chat.info.delivered_to": "Dihantar kepada {name}",
  "chat.info.read_by": "Dibaca oleh {name}",
  "chat.info.group_reach_desc":
    "Boleh dicapai sekarang, bukan pengesahan penghantaran",
  "chat.info.group_alone": "Tiada ahli lain",
  "chat.info.today_at": "Hari ini {time}",
  "chat.info.sending": "Menghantar…",
  "chat.info.failed": "Gagal dihantar",
  "chat.info.courier": "Dibawa oleh seorang kawan",
  "chat.info.sent": "Dihantar",
  "chat.info.queued": "Menunggu untuk dihantar",
  "chat.info.waiting": "Menunggu…",
  "chat.action.info": "Maklumat mesej",
  "chat.action.save_photos": "Simpan ke gambar",
  "chat.action.save_copy": "Simpan satu salinan",
  "chat.action.forward": "Kirim",
  "chat.action.select": "Pilih",
  "chat.select.cancel": "Batalkan pemilihan",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Kamera",
  "chat.attach.camera_desc": "Ambil gambar atau video",
  "chat.attach.library": "Galeri gambar",
  "chat.attach.library_desc": "Pilih daripada galeri anda",
  "chat.attach.document": "Dokumen",
  "chat.attach.document_desc": "Hantar mana-mana fail atau PDF",
  "chat.attach.voice": "Nota suara",
  "chat.attach.voice_desc": "Rakam dan hantar mesej suara",
  "chat.attach.ecash": "Hantar ecash",
  "chat.attach.ecash_desc": "Hantar sat Cashu daripada dompet anda",
  "chat.attach.location": "Lokasi",
  "chat.attach.location_desc": "Hantar kedudukan anda sekarang",
  "chat.attach.title": "Lampirkan",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Berkongsi satu lokasi",
  "chat.location.received_summary": "Berkongsi lokasinya",
  "chat.location.title": "Lokasi",
  "chat.location.away": "{distance} ke {direction}",
  "chat.location.taken": "Diambil {ago} lalu",
  "chat.location.open_maps": "Buka dalam Peta",
  "chat.location.no_forward": "Lokasi tidak dikirimkan",
  "chat.location.no_forward_body":
    "Satu lokasi dihantar kepada seorang sahaja. Kongsikan lokasi anda sendiri kalau anda mahu orang lain memilikinya.",
  "chat.location.no_fix": "Benarkan lokasi untuk melihat sejauh mana ini",
  "chat.location.send_title": "Hantar lokasi anda",
  "chat.location.send_body":
    "{name} akan melihat satu titik: kedudukan anda sekarang. Ia tidak terus dikemas kini.",
  "chat.location.send": "Hantar lokasi",
  "chat.location.finding": "Mencari lokasi anda…",
  "chat.location.no_location": "Lokasi anda tidak dapat diperoleh",
  "chat.location.no_location_body":
    "Benarkan capaian lokasi dan pastikan perkhidmatan lokasi dihidupkan, kemudian cuba lagi.",
  "chat.location.not_delivered": "Lokasi anda tidak dapat dihantar",
  "chat.location.not_delivered_body":
    "Satu lokasi hanya berbaloi dihantar selagi ia terkini, jadi ia tidak diaturkan untuk kemudian. Cuba lagi apabila {name} boleh dicapai.",
  "chat.location.direction.n": "utara",
  "chat.location.direction.ne": "timur laut",
  "chat.location.direction.e": "timur",
  "chat.location.direction.se": "tenggara",
  "chat.location.direction.s": "selatan",
  "chat.location.direction.sw": "barat daya",
  "chat.location.direction.w": "barat",
  "chat.location.direction.nw": "barat laut",
  "chat.attach.send_anyway": "Hantar juga",
  "chat.attach.bitchat_too_big": "Ini mungkin tidak sampai",
  "chat.attach.bitchat_too_big_body":
    "{name} menggunakan bitchat, yang mengalah di pertengahan jalan bagi fail besar. Di bawah kira-kira 350 KiB adalah boleh diharap. Menghantarnya kepada kenalan Airhop tidak mempunyai had sebegitu.",
  "chat.attach.bitchat_unopenable": "Mereka mungkin tidak dapat membukanya",
  "chat.attach.bitchat_unopenable_body":
    "{name} menggunakan bitchat, yang memaparkan gambar dan nota suara tetapi menyenaraikan apa-apa lain sebagai fail yang tidak boleh dibukanya. Ia akan sampai, cuma mereka mungkin tidak dapat melihatnya.",
  "chat.attach.file": "Lampirkan satu fail",
  "chat.attach.unavailable": "Lampiran tidak tersedia di sini",
  "chat.attach.not_sent": "Lampiran tidak dihantar",
  "chat.attach.read_failed":
    "Ada sesuatu tidak kena semasa membaca fail itu. Cuba yang lain.",
  "chat.attach.caption": "Tambah kapsyen…",
  "chat.attach.send": "Hantar lampiran",
  "chat.attach.generic": "Lampiran",
  "chat.media.view_full": "Lihat gambar skrin penuh",
  "chat.media.gone_photo": "Gambar itu tiada pada peranti ini",
  "chat.media.gone_video": "Video itu tiada pada peranti ini",
  "chat.media.gone_voice": "Nota suara itu tiada pada peranti ini",
  "chat.media.gone_file": "Fail itu tiada pada peranti ini",
  "chat.media.gone_note":
    "Dibuang selepas 7 hari atau semasa cache dikosongkan",
  "chat.media.ask_resend": "Minta lagi",
  "chat.media.resend_draft": "Boleh hantar {kind} itu sekali lagi?",
  "chat.media.kind_photo": "gambar",
  "chat.media.kind_video": "video",
  "chat.media.kind_voice": "nota suara",
  "chat.media.kind_file": "fail",
  "chat.media.pause_voice": "Jeda nota suara",
  "chat.media.play_voice": "Mainkan nota suara",
  "chat.media.voice_position": "Kedudukan nota suara",
  "chat.media.voice_scrub":
    "Ketik di sepanjang batangnya untuk melompat ke titik itu",
  "chat.media.image": "Imej",
  "chat.media.tap_load_photo": "Ketik untuk memuatkan gambar",
  "chat.media.open_document": "Buka {name}",
  "chat.media.document": "dokumen",
  "chat.media.tap_load_video": "Ketik untuk memuatkan video",
  "chat.media.video": "Video",
  "chat.media.photo": "Gambar",
  "chat.media.close_photo": "Tutup gambar",
  "chat.media.save_photo": "Simpan gambar ke gambar anda",
  "chat.media.share_photo": "Kongsi gambar",
  "chat.media.saved_videos": "Disimpan ke video anda",
  "chat.media.saved_photos": "Disimpan ke gambar anda",
  "chat.media.not_saved": "Tidak disimpan",
  "chat.media.cant_open": "Fail tidak boleh dibuka",
  "chat.media.no_app":
    "Peranti ini tiada aplikasi untuk membuka atau berkongsi fail ini.",
  "chat.media.open_failed":
    "Fail itu tidak dapat dibuka. Ia mungkin sudah dikosongkan daripada cache.",
  "media.blocked.nostr_only":
    "Anda hanya mengenali orang ini melalui geganti. Hanya teks tersedia. Gambar, fail dan nota suara memerlukan Bluetooth.",
  "media.blocked.private_channel":
    "Lampiran siaran ditandatangani tetapi tidak disulitkan, jadi menghantarnya ke saluran peribadi akan mendedahkannya sedangkan teks di sini kekal disulitkan.",
  "media.blocked.private_group":
    "Lampiran siaran ditandatangani tetapi tidak disulitkan, jadi menghantarnya ke kumpulan peribadi akan mendedahkannya sedangkan teks di sini kekal disulitkan.",
  "media.blocked.location_channel":
    "Saluran lokasi mencapai orang melalui internet, manakala gambar, fail dan nota suara bergerak melalui Bluetooth, jadi semuanya tidak akan sampai.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Nota suara tidak tersedia di sini",
  "chat.voice.hold_live": "Tahan untuk bercakap secara langsung",
  "chat.voice.hold_record": "Tahan untuk merakam nota suara",
  "chat.voice.cancel_recording": "Batalkan rakaman",
  "chat.voice.slide_cancel": "Luncurkan untuk membatalkan",
  "chat.voice.release_cancel": "Lepaskan untuk membatalkan",
  "chat.voice.a11y_toggle": "Ketik dua kali untuk mula atau berhenti bercakap.",
  "chat.voice.limit_reached":
    "Had dua minit dicapai, lepaskan untuk menghantar",
  "chat.voice.limit_sent": "Had dua minit dicapai, nota dihantar",
  "chat.voice.stop_send": "Hentikan rakaman dan hantar",
  "chat.voice.lift_lock": "Luncurkan ke atas untuk merakam tanpa memegang",
  "chat.voice.live_speaking": "{name} sedang bercakap",
  "voice.unavailable": "Suara langsung tidak tersedia",
  "voice.recording_stopped": "Rakaman dihentikan",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Capaian kamera",
  "chat.perm.camera_purpose": "mengambil gambar untuk dihantar",
  "chat.perm.photo_label": "Capaian gambar",
  "chat.perm.photo_purpose": "memilih gambar atau video untuk dihantar",
  "chat.perm.photo_save_purpose": "menyimpan ini ke gambar anda",
  "chat.perm.mic_label": "Capaian mikrofon",
  "chat.perm.mic_live_purpose": "bercakap dengan orang berdekatan",
  "chat.perm.mic_note_purpose": "merakam nota suara",
  "chat.perm.recording_stopped": "Rakaman dihentikan",
  "chat.perm.record_failed":
    "Rakaman tidak dapat dimulakan. Semak kebenaran mikrofon.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Dituntut",
  "chat.ecash.reclaimed": "Dituntut semula",
  "chat.ecash.claiming": "Menuntut…",
  "chat.ecash.claim": "Tuntut",
  "chat.ecash.claim_amount": "Tuntut {amount} {unit}",
  "chat.ecash.already_claimed": "Sudah dituntut",
  "chat.ecash.already_claimed_body":
    "Setiap bukti dalam token ini sudah ada dalam dompet anda, jadi tiada apa-apa ditambah.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Diserahkan kepada mesh untuk penghantaran sedaya upaya",
  "chat.info.queued_desc":
    "Ditahan pada telefon ini sehingga ada laluan kepada mereka",
  "chat.info.reclaimed": "Dituntut semula",
  "chat.info.reclaimed_desc":
    "Anda menarik bayaran ini semula ke dalam dompet anda, jadi ia tidak akan dihantar",
  "chat.info.about": "Perihal",
  "chat.info.group_desc":
    "Sebuah kumpulan peribadi. Hanya ahli yang ditambah penciptanya boleh membacanya, dan ia kekal pada Bluetooth.",
  "chat.info.teleported_desc":
    "Saluran lokasi awam untuk sel geohash ini. Sesiapa dalam sel itu, pada Airhop atau bitchat, berkongsinya melalui internet. Anda terpindah, bukan berada di sini secara fizikal.",
  "chat.info.custom_desc":
    "Saluran tersuai. Sesiapa yang tahu namanya boleh menyertainya daripada mana-mana peranti Airhop atau bitchat.",
  "chat.info.private_e2ee": "Peribadi · disulitkan hujung ke hujung",
  "chat.info.public_plain": "Awam · tidak disulitkan",
  "chat.info.group_privacy":
    "Hanya ahli yang dipaparkan di bawah boleh membaca kumpulan ini. Mesej kekal pada Bluetooth, jadi ahli di luar jangkauan menerimanya sebaik mereka kembali.",
  "chat.info.teleport_privacy":
    "Sebuah tempat yang anda pindah ke sana. Ia mencapai semua orang dalam sel ini melalui internet, dan tiada sesiapa dalam jangkauan Bluetooth.",
  "chat.info.location_off_privacy":
    "Lokasi dimatikan, jadi saluran ini mencapai peranti berdekatan melalui Bluetooth sahaja. Hidupkan lokasi untuk mencapai sel kawasannya melalui internet.",
  "chat.info.invite_privacy":
    "Hanya orang yang anda jemput melalui pautan boleh membacanya. Ia kekal tersembunyi daripada semua orang lain, malah daripada rakan berdekatan.",
  "chat.info.public_privacy":
    "Sesiapa yang menyertainya boleh membaca setiap mesej. Guna mesej terus untuk perbualan peribadi; mesej terus disulitkan hujung ke hujung.",
  "chat.info.remove_member": "Keluarkan ahli",
  "chat.info.remove_member_body":
    "Keluarkan {name} daripada kumpulan? Kunci kumpulan itu diputar supaya mereka tidak lagi boleh membaca mesej baharu.",
  "chat.info.message_member": "Hantar mesej kepada {name}",
  "chat.info.remove_member_a11y": "Keluarkan {name}",
  "chat.info.no_addable":
    "Tiada rakan boleh dicapai untuk ditambah. Ahli mesti berdekatan.",
  "chat.info.add_count": "Tambah {count}",
  "chat.info.teleported_tag": "{level}  ·  terpindah",
  "chat.info.active": "Aktif",
  "chat.info.members": "Ahli",
  "chat.info.bookmark": "Tandakan tempat ini",
  "chat.info.remove_bookmark": "Buang penanda",
  "chat.info.default_notice":
    "Saluran lalai tidak boleh ditinggalkan. Ia sebahagian daripada protokol mesh Airhop.",
  "chat.info.custom_channel": "Saluran tersuai",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Salin geohash",
  "chat.info.relays": "Geganti",
  "chat.info.show_relays": "Tunjuk geganti yang membawa saluran ini",
  "chat.info.relay_custom": "tersuai",
  "chat.info.relays_none": "Tiada. Sel ini Bluetooth sahaja buat masa ini.",
  "chat.info.search_members": "Cari ahli",
  "chat.info.search_members_placeholder": "Cari ahli…",
  "chat.info.teleported": "Terpindah",
  "chat.info.creator": "Pencipta",
  "chat.info.no_matches": "Tiada padanan",
  "chat.info.no_one_here": "Belum ada sesiapa di sini",
  "chat.info.add_members": "Tambah ahli",
  "chat.info.add_selected": "Tambah ahli yang dipilih",
  "chat.info.add": "Tambah",
  "chat.info.leave_group": "Tinggalkan kumpulan",
  "chat.info.leave_channel": "Tinggalkan saluran",
  "chat.info.leave": "Tinggalkan",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Bersembang sejak {date}",
  "chat.contact.verified_since": "Disahkan sejak {date}",
  "chat.contact.anonymous": "Awanama",
  "chat.contact.anonymous_desc":
    "Nama samaran geohash tanpa identiti kekal untuk disahkan",
  "chat.contact.verified": "Disahkan",
  "chat.contact.verified_desc": "Mengimbas kod QR mereka",
  "chat.contact.verified_desc_compared": "Membandingkan kod dengan mereka",
  "chat.contact.not_verified": "Belum disahkan",
  "chat.contact.not_verified_desc":
    "Imbas kod mereka, atau bandingkan satu kod melalui panggilan, untuk mengesahkan bahawa ini memang mereka",
  "chat.contact.e2ee": "Disulitkan hujung ke hujung",
  "chat.contact.e2ee_nostr":
    "Dibalut mengikut NIP-17, jadi geganti tidak boleh membacanya",
  "chat.contact.e2ee_mesh":
    "Noise XX, serta Double Ratchet antara peranti Airhop",
  "chat.contact.copy_nostr": "Salin kunci awam Nostr",
  "chat.contact.nostr_key": "Kunci awam Nostr",
  "chat.contact.cell_key_note":
    "Kunci ini milik kawasan tempat anda bertemu. Ia berubah kalau salah seorang daripada anda berpindah, dan perbualannya berhenti bersamanya. Tukar kenalan supaya boleh terus berbual di mana-mana.",
  "chat.contact.peer_name": "Nama rakan",
  "chat.contact.peer_id": "ID rakan",
  "chat.contact.rename": "Namakan semula",
  "chat.contact.rename_needs_contact":
    "Anda boleh menamakan semula orang yang kuncinya anda pegang. Tukar kad kenalan dahulu, kemudian ini menjadi nama yang hanya anda melihatnya.",
  "chat.contact.rename_needs_keys":
    "Belum ada kunci untuk kenalan ini. Hantar mesej kepada mereka, atau imbas kod mereka, kemudian anda boleh memberi mereka nama yang hanya anda melihatnya.",
  "chat.contact.renamed_by_you": "Nama anda untuk mereka",
  "chat.contact.copy_peer_id": "Salin ID rakan",
  "chat.contact.verify": "Sahkan kenalan",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Notis",
  "chat.notices.post_area": "Tampal satu notis di kawasan ini",
  "chat.notices.post_mesh": "Tampal satu notis pada mesh",
  "chat.notices.mark_urgent": "Tandakan mendesak",
  "chat.notices.post": "Tampal notis",
  "chat.notices.post_short": "Tampal",
  "chat.notices.delete": "Padam notis",
  "chat.notices.just_now": "sebentar tadi",
  "chat.notices.fades_soon": "akan pudar tidak lama lagi",
  "chat.notices.1_day": "1 hari",
  "chat.notices.3_days": "3 hari",
  "chat.notices.7_days": "7 hari",
  "chat.notices.fading": "sedang pudar",
  "chat.notices.fades_in_hours": "pudar dalam {count} jam",
  "chat.notices.fades_in_days": "pudar dalam {count} hari",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Mendesak",
  "chat.notices.permanent_warning":
    "Tidak pernah pudar. Terbuka kepada umum dan terikat pada kawasan ini, dan anda tidak boleh menariknya balik.",
  "chat.notices.none":
    "Belum ada notis. Tampalkan satu supaya ia kekal di sini untuk orang lain.",

  // ---- Chats: search results ----
  "chat.search.photos": "Gambar",
  "chat.search.videos": "Video",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Dokumen",
  "chat.search.links": "Pautan",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Tapis mengikut {filter}",
  "chat.search.no_matches": "Tiada {filter} yang sepadan dengan “{query}”",
  "chat.search.no_media": "Belum ada {filter}",
  "chat.search.result_a11y": "{chat}, {kind} daripada {sender}",
  "chat.search.you": "anda",
  "chat.search.section_chats": "Sembang",
  "chat.search.section_messages": "Mesej",
  "chat.search.section_notices": "Notis",
  "chat.search.hint":
    "Cari dalam mesej dan sembang, atau pilih satu penapis di atas.",
  "chat.search.no_results": "Tiada hasil untuk “{query}”",
  "chat.search.open_chat": "Buka {name}",
  "chat.search.message_a11y": "{chat}, mesej daripada {sender}: {snippet}",
  "chat.search.notice_a11y": "Notis dalam {chat} daripada {author}: {snippet}",
  "chat.search.urgent": "Mendesak ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Ada {count} dalam senarai ini. Mengosongkannya hanya membuangnya dari sini, dan mesejnya kekal belum dibaca dalam perbualan masing-masing. Menandakan semuanya sudah dibaca mengemaskan kedua-duanya.",
  "chat.notif.mark_all_read": "Tandakan semua sudah dibaca",
  "chat.notif.clear_list": "Kosongkan senarai",
  "chat.notif.clear_all_a11y": "Kosongkan kesemua {count} pemberitahuan",
  "chat.notif.title": "Pemberitahuan",
  "chat.notif.clear_short": "Kosongkan",
  "chat.notif.close": "Tutup pemberitahuan",
  "chat.notif.none": "Belum ada pemberitahuan",
  "chat.notif.none_desc":
    "Mesej, sebutan dan notis daripada saluran dan sembang anda muncul di sini.",
  "chat.notif.new": "Baharu",
  "chat.notif.notice_in": "notis dalam {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Kirim kepada…",
  "chat.forward.to": "Kirim kepada {name}",
  "chat.forward.cant_send_here": "Tidak boleh dikirim ke sini",
  "chat.forward.cant_send_to": "Tidak boleh dikirim kepada {name}",
  "chat.forward.channels": "Saluran",
  "chat.forward.groups": "Kumpulan",
  "chat.forward.locations": "Lokasi",
  "chat.forward.dms": "Mesej terus",
  "chat.forward.none": "Belum ada sembang lain",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Menghidupkan mesh…",
  "mesh.banner.no_bluetooth":
    "Tiada Bluetooth pada peranti ini · internet sahaja",
  "mesh.banner.bluetooth_off": "Bluetooth dimatikan · mesh tidak tersedia",
  "mesh.banner.permission_needed": "Kebenaran Bluetooth diperlukan",
  "mesh.banner.blocked": "Bluetooth disekat · benarkannya dalam Tetapan",
  "mesh.banner.location_permission": "Lokasi diperlukan untuk mencari rakan",
  "mesh.banner.advertising_unsupported":
    "Telefon ini boleh melihat yang lain tetapi tidak boleh ditemui",
  "mesh.banner.location_off_android":
    "Lokasi dimatikan · Android memerlukannya untuk mencari rakan",
  "mesh.banner.paused": "Mesh dijeda · anda sedang tiada",
  "mesh.banner.location_off":
    "Lokasi dimatikan · saluran lokasi tidak tersedia",
  "mesh.banner.battery_saver": "Penjimat bateri · mengimbas lebih jarang",
  "mesh.banner.wipe_incomplete":
    "Pembersihan belum selesai · sebahagian data mungkin tinggal, dicuba lagi apabila dibuka semula",
  "mesh.banner.wifi_off":
    "Wi-Fi dimatikan · fail besar dihantar lebih perlahan",
  "mesh.banner.clock_skew":
    "Jam telefon ini salah · tetapkan tarikh dan masa kepada automatik",
  "mesh.banner.internet_off": "Internet dimatikan · Bluetooth sahaja",
  "mesh.banner.relaying": "Tiada rakan berdekatan · menyampaikan melalui Nostr",
  "mesh.banner.tor": "Tor dihidupkan · trafik internet dilencongkan",
  "mesh.banner.tor_starting": "Menghidupkan Tor · sedang menyambung",
  "mesh.banner.tor_blocked":
    "Tor tidak dapat menyambung · mesh tetap berfungsi",
  "mesh.banner.gateway":
    "Get internet dihidupkan · menyampaikan untuk rakan berdekatan",
  "mesh.banner.bridge": "Jambatan mesh dihidupkan · sembang awam disambungkan",
  "mesh.banner.background_limits":
    "{brand} mungkin menjeda mesh di latar belakang",
  "mesh.banner.bridge_across":
    "Jambatan mesh dihidupkan · {count} di seberang jambatan",
  "mesh.banner.action.turn_on": "Hidupkan",
  "mesh.banner.action.allow": "Benarkan",
  "mesh.banner.action.resume": "Sambung semula",
  "mesh.banner.action.fix": "Betulkan",
  "mesh.banner.hint.resume":
    "Menghidupkan semula pengiklanan dan pengimbasan Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Meminta Android menghidupkan Bluetooth",
  "mesh.banner.hint.location_settings": "Membuka tetapan lokasi sistem",
  "mesh.banner.hint.app_settings":
    "Membuka kebenaran Airhop dalam tetapan sistem",
  "mesh.banner.hint.battery_settings":
    "Membuka tetapan aktiviti latar belakang telefon ini",
  "mesh.banner.dismiss": "Tolak: {label}",
  "mesh.banner.hint.dismiss": "Menyembunyikan nota ini buat selamanya",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Mencari rakan berdekatan…",
  "mesh.radar.starting": "Menghidupkan mesh…",
  "mesh.radar.no_bluetooth": "Tiada Bluetooth pada peranti ini",
  "mesh.radar.bluetooth_off": "Bluetooth dimatikan · tidak mengimbas",
  "mesh.radar.permission_needed": "Kebenaran Bluetooth diperlukan",
  "mesh.radar.blocked": "Bluetooth disekat",
  "mesh.radar.location_permission": "Kebenaran lokasi diperlukan",
  "mesh.radar.location_off": "Lokasi dimatikan · tidak mengimbas",
  "mesh.radar.hint_rings":
    "Gelang menunjukkan kekuatan isyarat BLE, bukan jarak",
  "mesh.radar.hint_checking": "Memeriksa Bluetooth dan kebenaran",
  "mesh.radar.hint_internet": "Mesej tetap bergerak melalui internet",
  "mesh.radar.hint_turn_on": "Hidupkan Bluetooth untuk menemui rakan",
  "mesh.radar.hint_allow": "Benarkan Bluetooth untuk menemui rakan",
  "mesh.radar.hint_allow_settings":
    "Benarkan Bluetooth dalam Tetapan untuk menemui rakan",
  "mesh.radar.hint_location_permission":
    "Android 11 dan lebih lama memerlukan lokasi untuk mengimbas melalui Bluetooth",
  "mesh.radar.hint_android_location":
    "Android memerlukan lokasi dihidupkan untuk memulangkan hasil imbasan Bluetooth",
  "mesh.radar.signal_strong": "Kuat",
  "mesh.radar.signal_medium": "Sederhana",
  "mesh.radar.signal_weak": "Lemah",
  "mesh.radar.you_center": "Anda, di tengah-tengah mesh",
  "mesh.radar.sonar_hint":
    "Memainkan sapuan sonar. Pengimbasan memang sudah berterusan.",
  "mesh.radar.paused": "Mesh dijeda · anda sedang tiada",
  "mesh.radar.ring_hint":
    "Kedudukan pada gelang mencerminkan kekuatan isyarat, bukan jarak",
  "mesh.radar.set_online":
    "Tetapkan status anda kepada Dalam talian dalam tab Anda untuk menemui rakan",
  "mesh.radar.in_range": "dalam jangkauan",
  "mesh.radar.recently_seen": "baru dilihat",
  "mesh.radar.peer_hint":
    "Membuka pilihan untuk menghantar mesej atau membayar rakan ini",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "sebentar tadi",
  "mesh.peer.none": "Tiada rakan berdekatan",
  "mesh.peer.none_desc":
    "Peranti Airhop atau bitchat lain dalam jangkauan Bluetooth muncul di sini.",
  "mesh.peer.id_copied": "ID rakan disalin",
  "mesh.peer.copy_id": "Salin ID rakan",
  "mesh.peer.their_name": "Menggunakan nama {name}",
  "mesh.peer.in_range": "Dalam jangkauan",
  "mesh.peer.relay": "Nod geganti",
  "mesh.peer.relay_body":
    "Radio yang seseorang biarkan hidup untuk meluaskan mesh. Ia membawa mesej yang tidak boleh dibacanya. Tiada sesiapa di sini untuk dihantar mesej.",
  "mesh.peer.send_dm": "Hantar mesej terus",
  "mesh.peer.message": "Mesej",
  "mesh.peer.send_sats": "Hantar ecash",
  "mesh.peer.amount_placeholder": "Jumlah dalam sat",
  "mesh.peer.amount_first": "Hantar ecash, masukkan jumlah dahulu",
  "mesh.peer.cancel_send": "Batalkan penghantaran ecash",
  "mesh.peer.view_peer": "Lihat rakan {name}",
  "mesh.peer.view_peer_online": "Lihat rakan {name}, dalam talian",
  "mesh.peer.last_seen": "Kali terakhir dilihat {ago} lalu",
  "mesh.peer.send_amount": "Hantar {amount} sat",
  "mesh.peer.direct": "Sambungan terus",
  "mesh.peer.check_distance": "Periksa jarak",
  "mesh.peer.checking": "Memeriksa",
  "mesh.peer.no_reply": "Tiada jawapan",
  "mesh.peer.no_reply_hint":
    "Mereka mungkin sudah beralih, atau aplikasi mereka tidak menjawab",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Wilayah",
  "mesh.level.province": "Negeri",
  "mesh.level.city": "Bandar",
  "mesh.level.neighborhood": "Kejiranan",
  "mesh.level.block": "Blok bandar",
  "mesh.level.building": "Bangunan",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Boleh dibelanjakan",
  "wallet.balance.unit_hint": "Bertukar antara satoshi dan bitcoin",
  "wallet.balance.a11y": "Baki {value} {unit}",
  "wallet.balance.locked":
    "Storan dompet dikunci. Bukti ecash disimpan dalam fail tersulit yang kuncinya berada dalam rantai kunci peranti, dan fail itu tidak dapat dibuka. Buka kunci peranti anda dan buka Airhop semula.",
  "wallet.balance.tor_blocked":
    "Tor dihidupkan, jadi permintaan mint disekat: ia akan keluar melalui rangkaian terbuka dan mengaitkan IP anda dengan bukti anda. Menghantar dan menerima melalui mesh tetap berfungsi. Benarkan trafik mint di bawah Tetapan, Keselamatan.",
  "wallet.balance.unconfirmed_note": "{amount} belum disahkan dengan mint",
  "wallet.balance.reserved_note":
    "{amount} disimpan untuk hantaran yang sedang berjalan",
  "wallet.balance.other_mint_note": "{amount} pada mint yang berasingan",
  "wallet.balance.test_mint_note":
    "Termasuk wang mainan daripada mint ujian. Ia bukan bitcoin dan tidak boleh ditunaikan.",
  "wallet.token": "Token",
  "wallet.action.send": "Hantar token ecash",
  "wallet.action.send_disabled":
    "Hantar token ecash, tidak tersedia dengan baki kosong",
  "wallet.action.receive": "Terima token ecash",
  "wallet.action.zap": "Zap seorang kenalan Nostr",
  "wallet.action.zap_disabled":
    "Zap seorang kenalan Nostr, tidak tersedia dengan baki kosong",
  "wallet.action.add_mint": "Tambah satu mint Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Token tidak dapat dibina",
  "wallet.send.title": "Hantar ecash",
  "wallet.send.amount_in": "Jumlah dalam {unit}",
  "wallet.send.body":
    "Dibina luar talian daripada bukti yang sudah anda pegang. Tiada apa-apa meninggalkan baki anda buat selamanya sehingga anda mengesahkan token itu sampai.",
  "wallet.send.stale_fee_note":
    "Yuran kali terakhir disemak {days} hari lalu. Kalau mint ini sudah menaikkannya sejak itu, hantaran mungkin sedikit lebih mahal.",
  "wallet.send.fee_note":
    "{spend} {unit} keluar daripada baki anda; tambahan {fee} menampung yuran mint yang sepatutnya mereka bayar",
  "wallet.send.qr_too_big":
    "Token ini terbelah kepada terlalu banyak syiling untuk muat dalam kod QR. Kongsi atau salin sahaja, atau segar semula di mint untuk menyatukannya.",
  "wallet.send.bearer_note":
    "Sesiapa yang memegang rentetan ini memiliki wangnya. Buktinya disimpan, bukan dibelanjakan: kalau ia tidak sampai kepada sesiapa, anda boleh menuntutnya semula di bawah Tertunda.",
  "wallet.send.qr_too_big_short":
    "Token ini terbelah kepada terlalu banyak syiling untuk muat dalam kod QR. Kongsi atau salin sahaja.",
  "wallet.send.scan_note":
    "Minta mereka mengimbas ini daripada dompet mereka. Masih boleh dituntut semula sehingga anda menandakannya sudah dihantar.",
  "wallet.send.mesh_note":
    "Token keluar sebagai mesej terus yang disulitkan melalui mesh. Tidak perlu internet.",
  "wallet.send.no_peers_note":
    "Buka tab Mesh untuk mencari peranti berdekatan, atau kongsikan token itu dengan cara lain.",
  "wallet.send.send_to": "Hantar kepada {name}",
  "wallet.send.memo": "Memo (pilihan, bergerak bersama token)",
  "wallet.send.building": "Membina…",
  "wallet.send.build": "Bina token",
  "wallet.send.inexact_body":
    "Bukti anda tidak boleh membentuk tepat {amount} {unit} secara luar talian. Token terkecil yang boleh anda bina ialah {spend} {unit}, dan secara luar talian tiada baki tukaran: tambahan {extra} {unit} jatuh kepada penerima.\n\nMenyegar semula di mint semasa dalam talian akan memecahkan bukti anda kepada denominasi yang menepatinya.",
  "wallet.send.send_amount": "Hantar {amount}",
  "wallet.send.sent_to": "{amount} {unit} dihantar kepada {name}",
  "wallet.send.sent_to_body":
    "{route} Ia kekal boleh dituntut semula di bawah Tertunda sehingga anda mengesahkan mereka menerimanya, atau sehingga mint memberitahu kami buktinya sudah ditebus.",
  "wallet.send.copy_token": "Salin token",
  "wallet.send.share_token": "Kongsi token",
  "wallet.send.open_in_wallet": "Buka token ini dalam dompet lain",
  "wallet.send.open_in_wallet_short": "Buka dalam dompet",
  "wallet.send.to_peer": "Hantar token kepada rakan berdekatan",
  "wallet.send.to_peer_short": "Hantar kepada rakan",
  "wallet.send.mark_delivered": "Tandakan sudah dihantar dan selesaikan",
  "wallet.send.they_got_it": "Mereka menerimanya",
  "wallet.send.keep_pending": "Biarkan hantaran ini tertunda",
  "wallet.send.decide_later": "Putuskan kemudian",
  "wallet.send.no_peers": "Tiada rakan dalam jangkauan",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Ini bayaran anda sendiri",
  "wallet.receive.own_payment_body":
    "Syiling ini masih disimpan untuk hantaran yang belum anda selesaikan, jadi tiada apa-apa untuk dituntut. Guna Tuntut semula pada bayaran itu untuk mengembalikannya terus ke baki anda.",
  "wallet.receive.already_have": "Sudah ada dalam dompet anda",
  "wallet.receive.already_have_body":
    "Setiap bukti dalam token ini sudah tersimpan di sini, jadi tiada apa-apa ditambah. Baki tidak berubah.",
  "wallet.receive.stored_unconfirmed":
    "Disimpan daripada {mint}, tetapi belum disahkan dengan mint ({reason}).",
  "wallet.receive.offline": "luar talian",
  "wallet.receive.redeemed_here":
    "Ditebus di {mint}. Bukti ini kini milik anda seorang: salinan pengirim tidak lagi berfungsi.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Ditebus di {mint}. Ia kini terbukti milik anda: salinan token ini pada pengirim tidak lagi berfungsi.",
  "wallet.receive.stored_pending":
    "Disimpan daripada {mint}, tetapi mint belum mengesahkan ia belum dibelanjakan{dleq}. Segar semula daripada tab Dompet sebaik anda dalam talian.",
  "wallet.receive.dleq_inline":
    " (tandatangannya memang menepati, jadi tokennya tulen)",
  "wallet.receive.dleq_ok": "Tandatangan mint menepati, jadi tokennya tulen.",
  "wallet.receive.dleq_uncached":
    "Kunci mint tidak tersimpan di sini, jadi tandatangannya tidak dapat disemak secara luar talian.",
  "wallet.receive.dleq_warning":
    "Sehingga anda menyegar semula dalam talian, pengirim pada dasarnya mungkin sudah membelanjakannya di tempat lain.",
  "wallet.receive.failed": "Tidak dapat menerima",
  "wallet.receive.title": "Terima ecash",
  "wallet.receive.body":
    "Tampal satu token Cashu. Dalam talian ia ditebus di mint serta-merta; luar talian ia disimpan dan disahkan pada penyegaran berikutnya.",
  "wallet.receive.scan": "Imbas kod QR ecash",
  "wallet.receive.scan_short": "Imbas QR",
  "wallet.receive.receiving": "Menerima…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap diterima daripada {from}… dan ditebus ke dalam dompet anda.",
  "wallet.zap.title": "Zap satu identiti Nostr",
  "wallet.zap.not_npub": "bukan npub",
  "wallet.zap.bad_key": "kunci salah",
  "wallet.zap.invalid_pubkey": "Kunci awam tidak sah",
  "wallet.zap.invalid_pubkey_body":
    "Masukkan npub1… atau kunci awam Nostr heksadesimal 64 aksara.",
  "wallet.zap.sent": "Nutzap dihantar",
  "wallet.zap.failed": "Zap gagal",
  "wallet.zap.body":
    "Kalau mereka menerbitkan maklumat nutzap NIP-61, ecash itu dikunci kepada kunci mereka supaya tiada orang lain boleh membelanjakannya, dan ia tidak boleh ditarik balik. Kalau tidak, ia dihantar sebagai token yang boleh dituntut semula. Anda akan diberitahu yang mana berlaku.",
  "wallet.zap.contact": "Zap {name}",
  "wallet.zap.pubkey_placeholder": "npub1… atau heksadesimal 64 aksara",
  "wallet.zap.sending": "Menghantar…",
  "wallet.nostr.copied_body":
    "Berikan ini kepada seseorang dan mereka boleh zap anda daripada Airhop atau mana-mana dompet Nostr lain, tanpa perlu Bluetooth.",
  "wallet.nostr.copy_key": "Salin kunci Nostr anda supaya orang boleh zap anda",
  "wallet.nostr.your_key": "Kunci Nostr anda",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint ditambah",
  "wallet.mint.add_failed": "Mint tidak dapat ditambah",
  "wallet.mint.added_named": "{name} ditambah",
  "wallet.mint.added_body":
    "{mint} mengeluarkan {units}. Kuncinya tersimpan pada peranti ini, jadi token daripadanya kini boleh disahkan walaupun tanpa internet.",
  "wallet.mint.remove_plain":
    "Buang {mint} daripada dompet anda? Kunci tersimpannya turut hilang, jadi token daripadanya tidak lagi boleh disahkan secara luar talian.",
  "wallet.mint.title": "Mint",
  "wallet.mint.none": "Belum ada mint",
  "wallet.mint.none_desc":
    "Sebuah mint mengeluarkan dan menebus ecash anda. Tambah satu untuk mendeposit melalui Lightning, atau terima sahaja satu token dan mintnya ditambah untuk anda.",
  "wallet.mint.add": "Tambah satu mint",
  "wallet.mint.add_body":
    "Sebuah mint memegang Bitcoin yang menyokong ecash anda, jadi pilih yang anda percaya untuk memegang baki yang anda simpan di sana. URLnya disemak sebelum disimpan. Jalankan mint sendiri dengan Nutshell kalau anda lebih suka tidak mempercayai sesiapa.",
  "wallet.mint.consolidate_body":
    "Satu token hanya boleh menamakan satu mint, jadi baki yang tersebar merentasi beberapa mint tidak boleh membayar jumlah yang lebih besar daripada yang dipegang mint terbesarnya. Airhop boleh memindahkannya: setiap mint lain membayar invois Lightning yang dikeluarkan oleh mint pilihan anda. Ia mengenakan yuran penghalaan kecil dan memerlukan internet.",
  "wallet.mint.add_short": "Tambah mint",
  "wallet.mint.checking": "Menyemak…",
  "wallet.mint.remove_with_balance": "Buang mint yang ada baki?",
  "wallet.mint.remove": "Buang mint",
  "wallet.mint.delete_anyway": "Padam juga",
  "wallet.mint.consolidate": "Pindahkan semua baki ke satu mint",
  "wallet.mint.confirm_with": "Sahkan bukti dengan {mint}",
  "wallet.mint.remove_a11y": "Buang {mint}",
  "wallet.mint.available_amount": "{amount} {unit} tersedia",
  "wallet.mint.split_across":
    "Baki terbelah merentasi {count} mint. Pindahkannya ke satu.",
  "wallet.mint.move_everything_to": "Pindahkan semuanya ke {mint}",
  "wallet.mint.consolidate_title": "Pindah ke satu mint",
  "wallet.mint.moving": "Memindahkan…",
  "wallet.mint.move": "Pindahkan",
  "wallet.mint.moved": "Dipindahkan",
  "wallet.mint.moved_body":
    "{amount} {unit} kini berada di {mint}, selepas {fees} {unit} yuran penghalaan Lightning.",
  "wallet.mint.nothing_moved": "Tiada apa-apa dipindahkan",
  "wallet.mint.destination": "· destinasi",
  "wallet.mint.will_move": "· akan dipindahkan",
  "wallet.mint.issued_by": "Dikeluarkan oleh",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Tambah nilai dompet Airhop",
  "wallet.ln.invoice_failed": "Invois tidak dapat dicipta",
  "wallet.ln.price_failed": "Invois ini tidak dapat diberi harga",
  "wallet.ln.paid": "Dibayar",
  "wallet.ln.deposit_credited":
    "Invois dibayar dan {amount} {unit} dikeluarkan oleh {mint}. Baki ini sudah disahkan: anda boleh membelanjakannya secara luar talian serta-merta.",
  "wallet.ln.withdrawn":
    "{paid} sat dibayar melalui Lightning. Mint mengenakan {fee} sat sebagai yuran penghalaan.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sat dibayar melalui Lightning. Mint mengenakan {fee} sat sebagai yuran penghalaan, dan memulangkan {change} sat daripada rizab ke baki anda.",
  "wallet.ln.payment_failed": "Bayaran gagal",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Tukarkan sat Lightning menjadi ecash yang boleh anda belanjakan secara luar talian, atau tunaikan ecash ke mana-mana invois Lightning. Kedua-duanya memerlukan internet dan sebuah mint.",
  "wallet.ln.deposit_body":
    "Mint memberi anda satu invois. Bayarnya daripada mana-mana dompet Lightning dan satnya kembali sebagai ecash yang boleh anda belanjakan secara luar talian.",
  "wallet.ln.pay_invoice_for":
    "Bayar invois ini sebanyak {amount} {unit}. Dompet sedang memerhati bayaran itu dan akan mengeluarkan ecash anda secara automatik.",
  "wallet.ln.expired_body":
    "Invois ini sudah luput. Kalau anda sudah membayarnya, bakinya dikreditkan secara automatik.",
  "wallet.ln.waiting_expires": "Menunggu bayaran · luput dalam {countdown}",
  "wallet.ln.withdraw_body":
    "Tampal satu invois bolt11 dan mint akan membayarnya daripada ecash anda. Rizab penghalaan diberitahu kepada anda dahulu; apa yang tidak digunakan penghalaan kembali ke baki anda.",
  "wallet.ln.up_to": "sehingga {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Bayar {amount} {unit}",
  "wallet.ln.deposit": "Deposit sat melalui Lightning",
  "wallet.ln.deposit_short": "Deposit",
  "wallet.ln.withdraw": "Keluarkan ke satu invois Lightning",
  "wallet.ln.withdraw_short": "Keluarkan",
  "wallet.ln.deposit_title": "Deposit melalui Lightning",
  "wallet.ln.amount_placeholder": "Jumlah dalam sat",
  "wallet.ln.requesting": "Meminta…",
  "wallet.ln.get_invoice": "Dapatkan invois",
  "wallet.ln.copy_invoice": "Salin invois",
  "wallet.ln.open_wallet": "Buka dalam dompet Lightning",
  "wallet.ln.open_wallet_short": "Buka dalam dompet",
  "wallet.ln.waiting": "Menunggu bayaran…",
  "wallet.ln.new_invoice": "Cipta invois baharu",
  "wallet.ln.new_invoice_short": "Invois baharu",
  "wallet.ln.withdraw_title": "Keluarkan ke Lightning",
  "wallet.ln.scan_invoice": "Imbas kod QR invois Lightning",
  "wallet.ln.paid_from": "Dibayar daripada",
  "wallet.ln.invoice": "Invois",
  "wallet.ln.routing_reserve": "Rizab penghalaan",
  "wallet.ln.reserved": "Disimpan daripada baki",
  "wallet.ln.paying": "Membayar…",
  "wallet.ln.get_quote": "Dapatkan sebut harga",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Sandaran",
  "wallet.backup.setup_failed": "Sandaran tidak dapat disediakan",
  "wallet.backup.on": "Sandaran dihidupkan",
  "wallet.backup.on_body":
    "Baki anda kini boleh dibina semula daripada dua belas perkataan itu.\n\nApa-apa yang diberikan orang lain kepada anda berada di luar frasa itu sehingga anda menyegar semula di mint, dan pemulihan memerlukan senarai mint anda, jadi simpan senarai itu bertulis di sebelah perkataannya.",
  "wallet.backup.no_phrase": "Tiada frasa tersimpan",
  "wallet.backup.no_phrase_body":
    "Frasa pemulihan tidak dapat dibaca daripada rantai kunci peranti. Buka kunci peranti dan cuba lagi.",
  "wallet.backup.replace_title": "Gantikan frasa anda yang sekarang?",
  "wallet.backup.replace_body":
    "Anda sudah ada frasa pemulihan. Memulihkan frasa lain akan menggantikannya. Syiling yang sudah dilindungi frasa lama kekal boleh dibelanjakan pada peranti ini, tetapi berhenti boleh dipulihkan, jadi pastikan perkataan lama itu sudah ditulis sebelum anda meneruskan.",
  "wallet.backup.replace": "Gantikan",
  "wallet.backup.invalid_phrase": "Frasa itu tidak sah",
  "wallet.backup.invalid_phrase_body":
    "Frasa itu mempunyai jumlah semak terbina dan yang ini tidak lulus. Cari perkataan yang tersalah taip, tertinggal atau tertukar.",
  "wallet.backup.not_bip39":
    "Ini bukan perkataan BIP-39: {words}. Semak ejaannya.",
  "wallet.backup.add_mint_first": "Tambah satu mint dahulu",
  "wallet.backup.add_mint_first_body":
    "Pemulihan berfungsi dengan bertanya kepada sebuah mint syiling mana yang ditandatanganinya untuk anda, jadi ia perlu tahu mint mana yang hendak ditanya. Tambah mint yang anda gunakan dahulu, kemudian pulihkan.",
  "wallet.backup.restore_failed": "Pemulihan gagal",
  "wallet.backup.phrase": "Frasa pemulihan",
  "wallet.backup.state_unconfirmed":
    "Sandaran dihidupkan tetapi belum disahkan",
  "wallet.backup.state_off": "Sandaran dimatikan",
  "wallet.backup.badge_on": "Hidup",
  "wallet.backup.badge_unconfirmed": "Belum disahkan",
  "wallet.backup.badge_off": "Mati",
  "wallet.backup.view": "Lihat frasa pemulihan",
  "wallet.backup.setup": "Sediakan frasa pemulihan",
  "wallet.backup.view_short": "Lihat frasa",
  "wallet.backup.setup_short": "Sediakan",
  "wallet.backup.restore": "Pulihkan dompet daripada frasa pemulihan",
  "wallet.backup.restore_short": "Pulihkan",
  "wallet.backup.setup_title": "Sediakan satu frasa pemulihan",
  "wallet.backup.on_body_short":
    "Baki anda boleh dibina semula pada peranti baharu daripada dua belas perkataan anda.",
  "wallet.backup.unconfirmed_body":
    "Anda tidak pernah mengesahkan adanya salinan bertulis. Buat masa ini perkataan itu hanya wujud pada telefon ini, sedangkan itulah satu-satunya perkara yang sepatutnya dapat diharungi oleh sandaran. Lihat frasanya dan tuliskannya.",
  "wallet.backup.not_covered":
    "{amount} belum dilindungi. Syiling yang diberikan kepada anda membawa rahsia sesiapa yang menghantarnya, jadi ia hanya masuk ke bawah frasa anda setelah ditukar. Segar semula sebuah mint untuk mengamankannya.",
  "wallet.backup.off_body":
    "Ecash anda hanya wujud pada telefon ini. Kalau anda kehilangannya, tiada siapa boleh memulihkan wang itu, termasuk anda. Frasa pemulihan ialah dua belas perkataan yang boleh membina semula baki anda di mana-mana.",
  "wallet.backup.about_to_see":
    "Anda akan melihat dua belas perkataan. Perkataan itulah wangnya.",
  "wallet.backup.exact_order":
    "Dua belas perkataan, tepat mengikut susunan ini. Sesiapa yang memilikinya memiliki baki anda.",
  "wallet.backup.verify_body":
    "Frasa yang tidak ditulis sesiapa lebih buruk daripada tiada frasa, kerana ia kelihatan seperti jaring keselamatan yang sebenarnya tidak ada. Dua perkataan untuk mengesahkan.",
  "wallet.backup.verify_mismatch":
    "Itu tidak sepadan. Semak salinan bertulis anda.",
  "wallet.backup.restore_body":
    "Masukkan dua belas perkataan itu. Airhop menerbitkan semula syiling anda dan bertanya kepada setiap mint yang mana antaranya ditandatangani, jadi bakinya kembali daripada rekod yang disimpan mint.",
  "wallet.backup.warn_secret":
    "Sesiapa yang membacanya boleh mengambil baki anda. Jangan tangkap skrinnya dan jangan simpannya pada telefon ini.",
  "wallet.backup.warn_paper":
    "Tuliskannya di atas kertas dan simpannya di tempat selamat. Airhop tidak boleh menunjukkannya kepada anda sekali lagi kalau telefon itu hilang.",
  "wallet.backup.warn_scope":
    "Ia membina semula ecash anda sahaja. Identiti, sembang dan kenalan anda tidak dilindungi.",
  "wallet.backup.warn_mints":
    "Pemulihan perlu bertanya kepada sebuah mint syiling mana yang ditandatanganinya, jadi tulis senarai mint anda di sebelah perkataan itu.",
  "wallet.backup.preparing": "Menyediakan…",
  "wallet.backup.show_phrase": "Tunjukkan frasa saya",
  "wallet.backup.your_phrase": "Frasa pemulihan anda",
  "wallet.backup.write_down": "Tuliskan ini",
  "wallet.backup.copy_phrase": "Salin frasa pemulihan ke papan keratan",
  "wallet.backup.copy_clipboard": "Salin ke papan keratan",
  "wallet.backup.written_down": "Saya sudah menuliskannya",
  "wallet.backup.check_copy": "Semak salinan anda",
  "wallet.backup.confirm": "Sahkan",
  "wallet.backup.restore_title": "Pulihkan daripada satu frasa",
  "wallet.backup.phrase_placeholder":
    "dua belas perkataan, dipisahkan dengan ruang",
  "wallet.backup.no_mints_yet":
    "Belum ada mint ditambah. Pemulihan perlu bertanya kepada mint tertentu, jadi tambah dahulu yang anda gunakan.",
  "wallet.backup.scanning": "Mengimbas…",
  "wallet.backup.restore_progress":
    "{mint} · set kunci {step} daripada {total}",
  "wallet.backup.will_scan":
    "Akan diimbas: {mints}. Mint yang belum anda tambah tidak pernah ditanya, jadi bakinya kekal tidak kelihatan.",
  "wallet.backup.word_n": "Perkataan {position}",
  "wallet.backup.unreachable_mints":
    "Tidak dapat dicapai: {mints}. Baki di sana masih ada. Cuba lagi apabila sambungan anda lebih baik.",
  "wallet.backup.nothing_recovered":
    "Tiada apa-apa dipulihkan daripada mint yang diimbas.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Tandakan sudah diterima?",
  "wallet.delivered.body":
    "Ini melepaskan {amount} {unit} buat selamanya. Kalau ia sebenarnya tidak pernah sampai, anda tidak akan dapat menuntutnya semula.",
  "wallet.delivered.body_generic":
    "Ini melepaskan jumlah yang disimpan buat selamanya. Kalau ia sebenarnya tidak pernah sampai, anda tidak akan dapat menuntutnya semula.",
  "wallet.delivered.cancel": "Belum lagi",
  "wallet.delivered.confirm": "Mereka menerimanya",
  "wallet.reclaim.title": "Tuntut semula token ini?",
  "wallet.reclaim.body":
    "{amount} {unit} kembali ke baki anda. Lakukan ini hanya kalau token itu tidak pernah sampai kepada sesiapa: kalau rentetannya sudah ada pada mereka, sesiapa yang menebusnya di mint dahulu akan memegang wangnya, dan itu mungkin mereka.",
  "wallet.reclaim.keep": "Biarkan tertunda",
  "wallet.reclaim.confirm": "Tuntut semula",
  "wallet.copied.token_body":
    "Token itu ada pada papan keratan anda. Ia kekal disimpan di sini sehingga anda menandakannya sudah dihantar, jadi anda boleh menampalnya sekali lagi kalau percubaan pertama gagal.",
  "wallet.copied.phrase_body":
    "Tampalnya ke dalam pengurus kata laluan, kemudian kosongkan papan keratan anda. Aplikasi lain boleh membaca papan keratan, dan pada sesetengah tetapan ia disegerakkan ke peranti anda yang lain.",
  "wallet.refresh.failed": "Penyegaran gagal",
  "wallet.refresh.partly": "Disegar semula sebahagian",
  "wallet.refresh.done": "Disegar semula",
  "wallet.refresh.unreachable":
    "Tidak dapat mencapai {mints}. Selebihnya sudah terkini.",
  "wallet.refresh.swapped":
    "{amount} {unit} disahkan dan ditukar dengan bukti baharu.",
  "wallet.refresh.secured":
    "{amount} {unit} kini dilindungi oleh frasa pemulihan anda.",
  "wallet.refresh.all_confirmed":
    "Semua yang ada di sini sudah disahkan dengan mint.",
  "wallet.pending.title": "Tertunda",
  "wallet.pending.reserved_desc":
    "Dibina dan disimpan, penghantarannya belum disahkan. Buktinya ditahan di luar baki anda supaya ia tidak boleh dibelanjakan dua kali.",
  "wallet.pending.locked_desc":
    "Sudah dikunci kepada kunci penerima, jadi hanya mereka boleh membelanjakannya. Cuma ia belum sampai kepada mereka. Kongsikan tokennya untuk menyelesaikannya.",
  "wallet.pending.show_qr": "Tunjuk token ini sebagai kod QR",
  "wallet.pending.copy_again": "Salin token itu sekali lagi",
  "wallet.pending.share_again": "Kongsi token itu sekali lagi",
  "wallet.pending.mark_delivered": "Tandakan token ini sudah dihantar",
  "wallet.pending.delivered": "Sudah dihantar",
  "wallet.pending.reclaim_into": "Tuntut semula token ini ke dalam baki anda",
  "wallet.activity.title": "Aktiviti",
  "wallet.activity.none": "Belum ada apa-apa",
  "wallet.activity.none_desc":
    "Bayaran yang anda hantar dan terima muncul di sini, terbaharu dahulu, lengkap dengan mint dan yuran bagi setiap satu.",
  "wallet.activity.show_fewer": "Tunjuk lebih sedikit bayaran",
  "wallet.activity.show_less": "Tunjuk lebih sedikit",
  "wallet.activity.received_unconfirmed": "Diterima, belum disahkan",
  "wallet.activity.received": "Diterima",
  "wallet.activity.receive_failed": "Penerimaan gagal",
  "wallet.activity.reclaimed": "Dituntut semula",
  "wallet.activity.send_failed": "Penghantaran gagal",
  "wallet.activity.sent": "Dihantar",
  "wallet.activity.status_pending": "tertunda",
  "wallet.activity.status_failed": "gagal",
  "wallet.activity.status_reclaimed": "dituntut semula",
  "wallet.activity.status_expired": "luput",
  "wallet.activity.ln_deposit": "Deposit Lightning",
  "wallet.activity.ln_withdrawal": "Pengeluaran Lightning",
  "wallet.activity.nutzap_received": "Nutzap diterima",
  "wallet.activity.spent_removed": "Bukti terbelanja dibuang",
  "wallet.activity.refreshed": "Bukti disegar semula",
  "wallet.activity.refreshing": "Menyegar semula bukti",
  "wallet.activity.just_now": "sebentar tadi",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh luar talian",
  "wallet.mesh_offline_body":
    "Perkhidmatan mesh tidak berjalan, jadi tiada sesiapa untuk diserahkan tokennya. Ia kekal disimpan di bawah Tertunda.",
  "wallet.xfer.route_mesh":
    "Diserahkan terus kepada peranti mereka melalui mesh.",
  "wallet.xfer.route_nostr":
    "Mereka berada di luar jangkauan Bluetooth, jadi ia bergerak melalui internet.",
  "wallet.xfer.route_courier":
    "Tiada laluan kepada mereka buat masa ini. Peranti lain akan membawanya dan menyampaikannya sebaik salah satu daripadanya sampai kepada mereka.",
  "wallet.xfer.route_queued":
    "Mereka belum boleh dicapai. Ia beratur dan akan keluar sebaik mereka boleh dicapai.",
  "wallet.xfer.mesh_offline_body":
    "Perkhidmatan mesh tidak berjalan, jadi tiada cara untuk menyerahkan tokennya. Tiada apa-apa ditolak.",
  "wallet.xfer.could_not_send": "Tidak dapat menghantar",
  "wallet.xfer.inexact_body":
    "Bukti anda tidak boleh membentuk tepat {amount} {unit} secara luar talian. Token terkecil yang boleh anda bina ialah {spend} {unit}, dan tambahan {extra} {unit} jatuh kepada mereka tanpa cara untuk mendapatkannya semula.\n\nMenyegar semula di mint semasa dalam talian akan memecahkan bukti anda kepada denominasi yang menepatinya.",
  "wallet.xfer.send_amount": "Hantar {amount}",
  "wallet.xfer.mesh_offline": "Mesh luar talian",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Dikunci kepada kunci mereka dan diterbitkan ke Nostr. Ia milik mereka sama ada mereka dalam talian atau tidak.",
  "wallet.pay.rail_nutzap_dm":
    "Dikunci kepada kunci mereka. Geganti enggan menerimanya, jadi ia dihantar kepada mereka sebagai mesej.",
  "wallet.pay.rail_nutzap_undelivered":
    "Dikunci kepada kunci mereka, tetapi belum ada apa-apa yang dapat membawanya. Ia beratur, dan tokennya berada di bawah Tertunda.",
  "wallet.pay.final":
    "Bayaran yang dikunci tidak boleh dituntut semula: hanya kunci mereka boleh membelanjakan syiling ini sekarang.",
  "wallet.pay.reclaimable":
    "Ia kekal boleh dituntut semula daripada tab Dompet sehingga anda mengesahkan ia sampai.",
  "wallet.pay.why": "Dihantar melalui laluan ini kerana {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} kepada {name}",
  "wallet.pay.thread_receipt":
    "Anda menghantar {amount} {unit}, dikunci kepada kunci mereka.",
  "wallet.pay.title": "Hantar ecash",
  "wallet.pay.to": "Kepada {name}",
  "wallet.pay.amount": "Jumlah dalam sat",
  "wallet.pay.memo": "Nota (pilihan, terbuka kepada umum)",
  "wallet.pay.send": "Hantar",
  "wallet.pay.sending": "Menghantar…",
  "wallet.pay.action": "Hantar ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Capaian kamera",
  "wallet.scan.camera_purpose": "mengimbas kod QR ecash",
  "wallet.scan.photo_label": "Capaian gambar",
  "wallet.scan.photo_purpose": "membaca QR ecash daripada satu imej",
  "wallet.scan.no_token": "Tiada token ecash ditemui dalam imej itu.",
  "wallet.scan.no_invoice": "Tiada invois Lightning ditemui dalam imej itu.",
  "wallet.scan.unreadable": "Imej itu tidak dapat dibaca.",
  "wallet.scan.camera_failed":
    "Kamera tidak dapat dihidupkan. Tutup aplikasi kamera lain dan cuba lagi.",
  "wallet.scan.close": "Tutup pengimbas",
  "wallet.scan.on_device":
    "Ia dibaca pada peranti ini; tiada apa-apa dihantar ke mana-mana.",
  "wallet.scan.aim_token": "Halakan ke kod QR ecash.",
  "wallet.scan.aim_invoice": "Halakan ke kod QR invois Lightning.",
  "wallet.scan.title_token": "Imbas ecash",
  "wallet.scan.title_invoice": "Imbas invois",
  "wallet.scan.desc_token":
    "Baca token Cashu daripada dompet lain. Berfungsi dengan mana-mana dompet Cashu, bukan Airhop sahaja.",
  "wallet.scan.desc_invoice":
    "Baca invois Lightning untuk membayarnya daripada baki anda.",
  "wallet.scan.use_camera_a11y": "Imbas dengan kamera",
  "wallet.scan.use_camera": "Guna kamera",
  "wallet.scan.pick_image_a11y": "Baca kod QR daripada imej tersimpan",
  "wallet.scan.pick_image": "Pilih daripada gambar",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Apakah itu Cashu?",
  "wallet.explain.intro":
    "Cashu ialah ecash untuk Bitcoin. Satu token ialah rentetan yang bernilai wang bagi sesiapa yang memegangnya, ditandatangani secara buta oleh sebuah mint supaya mint itu tidak dapat mengetahui siapa membelanjakan apa. Tiada akaun, tiada log masuk.",
  "wallet.explain.send": "Hantar",
  "wallet.explain.send_desc":
    "Menukarkan satu jumlah menjadi token yang boleh anda serahkan kepada rakan berdekatan melalui Bluetooth, atau kongsikan sebagai teks. Berfungsi tanpa internet. Buktinya kekal disimpan sehingga anda mengesahkan ia sampai.",
  "wallet.explain.receive": "Terima",
  "wallet.explain.receive_desc":
    "Tampal satu token untuk menambahnya. Dalam talian ia ditukar di mint serta-merta, yang menjadikannya terbukti milik anda. Luar talian ia disimpan dan ditandakan belum disahkan sehingga anda menyegar semula.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Membayar satu identiti Nostr. Kalau mereka menerbitkan maklumat nutzap NIP-61, ecash itu dikunci kepada kunci mereka supaya hanya mereka boleh membelanjakannya. Kalau tidak, ia kembali kepada mesej terus yang disulitkan. Memerlukan internet.",
  "wallet.explain.add_mint": "Tambah mint",
  "wallet.explain.add_mint_desc":
    "Menyimpan mint yang mengeluarkan dan menebus ecash anda, serta menyimpan kunci awamnya supaya token daripadanya boleh disahkan secara luar talian. Pilih mint yang anda percaya untuk memegang baki yang anda simpan di sana.",
  "wallet.explain.phrase": "Frasa pemulihan",
  "wallet.explain.phrase_desc":
    "Syiling anda diterbitkan daripada dua belas perkataan yang dijana dompet pada mulanya, jadi telefon baharu boleh membina semula bakinya dengan bertanya kepada mint anda syiling mana yang mereka tandatangani. Sehingga anda melihat dan menuliskannya, ia hanya wujud pada telefon ini.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Dompet dikunci",
  "wallet.err.mint_unreachable": "Mint tidak dapat dicapai",
  "wallet.err.tor_blocked": "Disekat semasa Tor dihidupkan",
  "wallet.err.insufficient": "Baki tidak mencukupi",
  "wallet.err.exact_amount": "Tidak boleh menghantar jumlah setepat itu",
  "wallet.err.no_mint": "Tiada mint",
  "wallet.err.mint_unsupported": "Mint tidak boleh melakukannya",
  "wallet.err.mint_refused": "Mint menolak",
  "wallet.err.unreadable": "Token tidak boleh dibaca",
  "wallet.err.rejected": "Token ditolak",
  "wallet.err.already_spent": "Sudah dibelanjakan",
  "wallet.err.change_pending": "Dibayar, baki tukaran tertunda",
  "wallet.svc.mint_unreachable": "Mint tidak dapat dicapai.",
  "wallet.svc.tor_ios": "Permintaan mint tidak melalui Tor pada iOS.",
  "wallet.svc.tor_ios_body":
    "Arti hanya membalut WebSocket Nostr, jadi permintaan ini akan sampai kepada mint melalui rangkaian terbuka dan mengaitkan IP anda dengan bukti ini. Benarkannya di bawah Tetapan > Keselamatan, atau matikan Tor dahulu. Menghantar dan menerima ecash melalui mesh tetap berfungsi.",
  "wallet.svc.keys_uncached":
    "Kunci mint ini tidak tersimpan pada peranti ini.",
  "wallet.svc.keys_uncached_body":
    "Buka dompet sekali semasa dalam talian untuk mengambilnya.",
  "wallet.svc.phrase_invalid": "Frasa pemulihan itu tidak sah.",
  "wallet.svc.phrase_invalid_body":
    "Cari perkataan yang tersalah taip atau tertinggal. Frasa itu mempunyai jumlah semak terbina, jadi satu perkataan yang salah membatalkan keseluruhannya.",
  "wallet.svc.need_mint": "Tambah sekurang-kurangnya satu mint dahulu.",
  "wallet.svc.need_mint_body":
    "Pemulihan berfungsi dengan bertanya kepada sebuah mint syiling mana yang ditandatanganinya untuk anda, jadi ia perlu tahu mint mana yang hendak ditanya.",
  "wallet.svc.restored": "Dipulihkan daripada frasa pemulihan",
  "wallet.svc.storage_locked": "Storan dompet dikunci.",
  "wallet.svc.storage_locked_body":
    "Airhop menyimpan bukti ecash dalam fail tersulit yang kuncinya berada dalam rantai kunci peranti. Buka kunci peranti dan buka aplikasi semula.",
  "wallet.svc.bad_url": "Itu bukan URL yang sah.",
  "wallet.svc.needs_https": "URL sebuah mint mesti bermula dengan https://.",
  "wallet.svc.refuse_http": "Enggan menggunakan mint melalui http biasa.",
  "wallet.svc.refuse_http_body":
    "Sesiapa pada laluan rangkaian boleh membaca atau mengubah bukti anda. Guna mint dengan https://.",
  "wallet.svc.mint_not_saved": "Mint tidak dapat disimpan.",
  "wallet.svc.unreadable_token": "Itu bukan token Cashu yang boleh dibaca.",
  "wallet.svc.unreadable_token_body":
    "Token bermula dengan cashuA atau cashuB. Pastikan tiada apa-apa terpotong semasa ia disalin.",
  "wallet.svc.wrong_mint":
    "Token ini tidak ditandatangani oleh mint yang dinamakannya.",
  "wallet.svc.already_spent": "Bukti ini sudah dibelanjakan.",
  "wallet.svc.already_spent_body":
    "Sesiapa yang menghantar token ini menebusnya dahulu, atau menghantar token yang sama kepada orang lain juga.",
  "wallet.svc.receiving_offline": "menerima secara luar talian",
  "wallet.svc.amount_positive":
    "Masukkan jumlah yang lebih besar daripada sifar.",
  "wallet.svc.coins_raced":
    "Syiling itu baru sahaja digunakan oleh bayaran lain.",
  "wallet.svc.coins_raced_body":
    "Tiada apa-apa ditolak. Cuba lagi dan dompet akan memilih set yang berbeza.",
  "wallet.svc.no_ecash": "Belum ada ecash.",
  "wallet.svc.no_ecash_body":
    "Tambah sebuah mint dan deposit melalui Lightning, atau terima token daripada seseorang.",
  "wallet.svc.split_across_mints":
    "Baki anda terbelah merentasi beberapa mint.",
  "wallet.svc.mint_says_spent": "Mint melaporkan bukti ini sudah dibelanjakan.",
  "wallet.svc.issue_against_invoice":
    "mengeluarkan ecash terhadap satu invois Lightning",
  "wallet.svc.pay_invoice": "membayar satu invois Lightning",
  "wallet.svc.unknown_deposit": "Deposit tidak dikenali.",
  "wallet.svc.invoice_expired_before": "Invois itu luput sebelum ia dibayar.",
  "wallet.svc.invoice_expired": "Invois itu sudah luput.",
  "wallet.svc.invoice_unpaid": "Invois itu belum dibayar.",
  "wallet.svc.payment_unknown":
    "Status bayaran tidak diketahui; disemak semula pada penyegaran berikutnya.",
  "wallet.svc.melt_change_pending": "Invois anda sudah dibayar.",
  "wallet.svc.melt_change_pending_body":
    "Mint belum memulangkan yuran penghalaan yang tidak digunakan. Ia dituntut secara automatik pada penyegaran berikutnya, dan tiada apa-apa hilang sementara itu.",
  "wallet.svc.mint_did_not_pay":
    "Mint tidak membayar invois ini. Baki anda tidak berubah.",
  "wallet.svc.not_an_invoice": "Itu bukan invois Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Tampal invois bolt11 yang bermula dengan lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Baki tidak mencukupi untuk invois ini.",
  "wallet.svc.coins_raced_invoice_body":
    "Tiada apa-apa ditolak dan invois itu tidak dibayar. Cuba lagi.",
  "wallet.svc.same_mint": "Pilih mint destinasi yang berbeza.",
  "wallet.svc.same_mint_body":
    "Sumber dan destinasinya mint yang sama, jadi tiada apa-apa untuk dipindahkan.",
  "wallet.svc.quote_failed_retried": "Sebut harga gagal, penyatuan dicuba lagi",
  "wallet.svc.amount_unfit_retried":
    "Jumlah tidak menepati, penyatuan dicuba lagi",
  "wallet.svc.cannot_size": "Saiz pemindahan ini tidak dapat ditentukan.",
  "wallet.svc.insufficient_at_mint": "Baki tidak mencukupi di {mint}.",
  "wallet.svc.inexact_title":
    "Bukti anda tidak boleh membentuk tepat {amount} {unit} secara luar talian.",
  "wallet.svc.inexact_detail":
    "Token terkecil yang boleh anda hantar ialah {spend} {unit}. Secara luar talian tiada baki tukaran, jadi tambahan {extra} {unit} jatuh kepada penerima.",
  "wallet.svc.no_single_mint":
    "Tiada satu pun mint memegang {amount} {unit}. Ecash daripada mint berbeza tidak boleh digabungkan ke dalam satu token: satukannya di satu mint dahulu, atau hantar dalam jumlah berasingan.",
  "wallet.svc.have_tried_send":
    "Anda ada {total} {unit}, dan cuba menghantar {amount}.",
  "wallet.svc.invoice_needs":
    "Invois ini memerlukan {total} {unit} termasuk rizab penghalaan, sedangkan anda ada {balance}.",
  "wallet.svc.nothing_to_move": "{mint} tiada {unit} untuk dipindahkan.",
  "wallet.svc.consolidate_memo": "Penyatuan daripada {mint}",
  "wallet.svc.cannot_size_detail":
    "Selepas yuran penghalaan Lightning, {from} tidak boleh memindahkan jumlah yang berguna ke {to}. Cuba pindahkan jumlah tertentu yang lebih kecil sebaliknya.",
  "wallet.svc.mint_cannot": "{mint} tidak boleh {action}.",
  "wallet.svc.no_nut": "Mint tidak mengiklankan NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Bayaran itu menamakan mint yang anda tidak gunakan.",
  "wallet.svc.unknown_mint_body":
    "Tambah mint itu sendiri kalau anda mempercayainya; tiada apa-apa ditebus daripada mint yang anda tidak pilih.",
  "wallet.svc.no_relay": "tiada sambungan geganti",
  "wallet.svc.no_shared_mint": "tiada mint dikongsi dengan baki yang mencukupi",
  "wallet.svc.no_nutzap_info":
    "penerima belum menerbitkan maklumat nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Dikunci kepada kunci mereka tetapi belum dihantar. Kongsikan token daripada urus niaga ini untuk melengkapkannya.",
  "wallet.svc.swap_lost":
    "Mint tidak pernah melengkapkan pertukaran ini, jadi tiada apa-apa dikeluarkan terhadapnya.",
  "wallet.svc.swap_unreadable":
    "Pertukaran ini disimpan dalam bentuk yang tidak boleh dimainkan semula oleh versi ini.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Disahkan melalui QR",
  "contacts.qr.keys_unverified": "Kunci diterima, belum disahkan",
  "contacts.qr.not_verified": "Belum disahkan",
  "contacts.qr.message": "Mesej",
  "contacts.qr.add": "Tambah kenalan",
  "contacts.qr.scan_title": "Imbas kod QR",
  "contacts.qr.aim": "Halakan kamera anda ke kod QR mereka",
  "contacts.qr.add_desc": "Capai seseorang yang tidak berdekatan pada mesh.",
  "contacts.qr.peer_id_hint":
    "ID rakan ialah 16 aksara. Kod kenalan bermula dengan airhop:.",
  "contacts.qr.or_scan": "atau imbas QR mereka",
  "contacts.qr.trust_note":
    "Hanya QR yang anda imbas dengan kamera mengesahkan kunci mereka. Kod yang ditampal membawa kunci mereka tetapi bukan bukti bahawa ia datang daripada mereka.",
  "contacts.qr.peer_id": "ID rakan atau kod kenalan",
  "contacts.qr.peer_id_placeholder": "Tampal ID atau kod kenalan",
  "contacts.qr.scan_camera_a11y": "Imbas kod QR dengan kamera",
  "contacts.qr.scan_camera_desc": "Guna kamera anda",
  "contacts.qr.upload_a11y": "Muat naik imej QR daripada galeri",
  "contacts.qr.upload": "Muat naik daripada galeri",
  "contacts.qr.upload_desc": "Pilih imej QR yang disimpan",
  "contacts.qr.scan_a11y": "Tambah kenalan dengan mengimbas kod QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Tampal ID rakan 16 aksara, pautan airhop://peer/…, atau kod kenalan.",
  "contacts.scan.camera_label": "Capaian kamera",
  "contacts.scan.camera_purpose": "mengimbas kod QR seorang kenalan",
  "contacts.scan.camera_needed":
    "Capaian kamera diperlukan untuk mengimbas. Anda masih boleh menambah melalui ID rakan.",
  "contacts.scan.camera_failed":
    "Kamera tidak dapat dihidupkan. Tutup aplikasi kamera lain dan cuba lagi.",
  "contacts.scan.photo_label": "Capaian gambar",
  "contacts.scan.photo_purpose": "mengimbas kod QR yang anda simpan",
  "contacts.scan.photo_needed":
    "Capaian gambar diperlukan untuk memilih imej. Anda masih boleh menambah melalui ID rakan.",
  "contacts.scan.no_qr": "Tiada kod QR Airhop ditemui dalam imej itu.",
  "contacts.scan.unreadable": "Tidak dapat membaca kod QR daripada imej itu.",
  "contacts.scan.bitchat_expired":
    "Kod bitchat itu sudah luput. Minta mereka membuka QR mereka sekali lagi.",
  "contacts.scan.tampered":
    "Kod QR ini tidak sah: ID rakannya tidak sepadan dengan kuncinya. Ia mungkin sudah diubah.",
  "contacts.scan.already_added": "Sudah ada dalam kenalan anda",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Menunggu capaian kamera…",
  "contacts.verify.camera_off": "Kamera dimatikan",
  "contacts.verify.open_settings": "Buka Tetapan",
  "contacts.verify.verified": "Disahkan",
  "contacts.verify.different": "Kenalan berbeza",
  "contacts.verify.scan_again": "Imbas lagi",
  "contacts.verify.failed": "Tidak dapat disahkan",
  "contacts.verify.done": "Selesai",
  "contacts.verify.title": "Sahkan {name}",
  "contacts.verify.aim": "Halakan kamera anda ke kod QR mereka",
  "contacts.verify.camera_off_body":
    "Hidupkan capaian kamera dalam Tetapan untuk mengesahkan melalui QR.",
  "contacts.verify.match_body":
    "Kunci {name} sepadan. Anda boleh mempercayai kenalan ini.",
  "contacts.verify.different_body":
    "QR ini milik orang lain. Minta {name} menunjukkan kod mereka sendiri.",
  "contacts.verify.tampered_body":
    "QR ini kelihatan sudah diubah: IDnya tidak sepadan dengan kuncinya.",
  "contacts.verify.choose_title": "Bagaimana anda mahu menyemaknya?",
  "contacts.verify.choose_body":
    "Kedua-duanya mengesahkan bahawa kunci pada telefon ini benar-benar milik {name}.",
  "contacts.verify.method_scan": "Imbas kod mereka",
  "contacts.verify.method_scan_sub": "Mereka ada bersama anda",
  "contacts.verify.method_compare": "Bandingkan satu kod",
  "contacts.verify.method_compare_sub":
    "Bacakan kepada satu sama lain melalui panggilan",
  "contacts.verify.no_keys":
    "Belum ada kunci untuk kenalan ini. Hantar mesej kepada mereka, atau imbas kod mereka apabila anda bertemu.",
  "contacts.verify.compare_title": "Bacakan ini kepada satu sama lain",
  "contacts.verify.compare_body":
    "{name} melihat enam perkataan yang sama. Kalau ia sepadan, anda berdua tahu kuncinya tulen.",
  "contacts.verify.codes_match": "Ia sepadan",
  "contacts.verify.codes_differ": "Ia tidak sepadan",
  "contacts.verify.compared_body":
    "Anda dan {name} mengesahkan kod yang sama. Kenalan ini telah disahkan.",

  // ---- Settings: shared chrome ----
  "settings.back": "Kembali",
  "settings.coming_soon": "Akan datang",
  "settings.opens_externally": "{label}, dibuka di luar aplikasi",
  "settings.peer_id": "ID rakan",
  "settings.share_peer_id": "Kongsi ID rakan anda",
  "settings.share_id_short": "Kongsi ID",
  "settings.peer_id_sheet.title": "ID rakan anda",
  "settings.peer_id_sheet.copy": "Salin ID rakan",
  "settings.peer_id_sheet.note":
    "Ini hanya berfungsi apabila anda berdua berada dalam jangkauan Bluetooth. Untuk membolehkan seseorang menghantar mesej kepada anda dari mana-mana, kongsikan kod QR anda sebaliknya.",
  "settings.search.placeholder": "Cari dalam tetapan…",
  "settings.search.a11y": "Cari dalam tetapan",
  "settings.search.close": "Tutup carian",
  "settings.search.clear": "Kosongkan carian",
  "settings.search.hint":
    "Cari mana-mana tetapan mengikut namanya, di mana jua ia berada.",
  "settings.search.no_results": "Tiada tetapan sepadan dengan “{query}”",

  // ---- Settings: hub rows ----
  "settings.section.general": "Umum",
  "settings.section.general_desc":
    "Ciri pilihan, batalkan hantaran, media, tetap semula",
  "settings.section.privacy": "Privasi dan keselamatan",
  "settings.section.privacy_desc":
    "Forward secrecy, paket bertandatangan, rakan disekat",
  "settings.section.network": "Rangkaian dan geganti",
  "settings.section.network_desc":
    "Sandaran internet, geganti nostr, keserasian bitchat",
  "settings.section.permissions": "Kebenaran",
  "settings.section.permissions_desc":
    "Bluetooth, lokasi, pemberitahuan, kamera, mikrofon",
  "settings.section.storage": "Storan dan data",
  "settings.section.diagnostics": "Diagnostik",

  // ---- Settings: group headings ----
  "settings.group.transports": "Pengangkut",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "Berdekatan",
  "settings.group.sync": "Penyegerakan",
  "settings.group.features": "Ciri",
  "settings.group.messages": "Mesej",
  "settings.group.local": "Setempat",
  "settings.group.media": "Media",
  "settings.group.reset": "Tetap semula",
  "settings.group.always_on": "Sentiasa hidup",
  "settings.group.notifications": "Pemberitahuan",
  "settings.group.blocked": "Disekat",
  "settings.group.theme": "Tema",
  "settings.group.font": "Fon",
  "settings.group.language": "Bahasa",
  "settings.section.diagnostics_desc":
    "Status sambungan dan peranti berdekatan",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Pautan Bluetooth",
  "settings.diag.ble_links_desc":
    "Peranti yang bersambung terus dengan telefon ini",
  "settings.diag.lan": "Rangkaian setempat",
  "settings.diag.lan_desc": "Telefon dalam satu rangkaian Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Telefon ke telefon tanpa penghala",
  "settings.diag.wifi_active": "Sedang berjalan",
  "settings.diag.wifi_unsupported": "Tidak disokong pada peranti ini",
  "settings.diag.wifi_permission": "Disekat oleh satu kebenaran",
  "settings.diag.wifi_unavailable": "Tidak tersedia buat masa ini",
  "settings.diag.wifi_unpaired": "Tiada gandingan",
  "settings.diag.wifi_unknown": "Menunggu radio",
  "settings.diag.relays": "Geganti Nostr",
  "settings.diag.relays_desc":
    "Digunakan untuk saluran lokasi dan jangkauan internet",
  "settings.diag.connected": "Bersambung",
  "settings.diag.disconnected": "Tidak bersambung",
  "settings.diag.peer_direct": "Pautan terus",
  "settings.diag.peer_relayed": "Didengari melalui peranti lain",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Tiada bacaan isyarat",
  "settings.diag.no_peers": "Tiada sesiapa dalam jangkauan",
  "settings.diag.no_peers_desc": "{links} pautan radio terbuka",
  "settings.diag.gcs_size": "Saiz penapis",
  "settings.diag.gcs_size_desc":
    "Penapis penyegerakan terbesar yang dilepaskan ke udara",
  "settings.diag.fpr": "Kadar positif palsu",
  "settings.diag.fpr_desc":
    "Sekerap mana penapis mendakwa ada paket yang sebenarnya kita tiada",
  "settings.diag.bytes": "{n} bait",
  "settings.diag.footnote":
    "Tiada apa-apa di sini boleh diubah. Nilai ini ditetapkan supaya Airhop kekal serasi dengan bitchat.",
  "settings.section.storage_desc": "Penggunaan dan cache",
  "settings.section.appearance": "Penampilan",
  "settings.section.appearance_desc": "Tema, fon dan bahasa",
  "settings.section.help": "Bantuan dan maklum balas",
  "settings.section.help_desc":
    "Hubungi kami, laporkan pepijat, atau baca Soalan Lazim",
  "settings.section.support": "Sokongan",
  "settings.section.support_desc": "Bantu pembangunan terus berjalan",
  "settings.section.about": "Perihal",
  "settings.section.about_desc": "Versi, senarai perubahan dan kod sumber",

  // ---- Settings: general ----
  "settings.general.undo": "Batalkan hantaran",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Dompet",
  "settings.general.undo_seconds": "{count} saat",
  "settings.general.undo_a11y": "Batalkan hantaran: {value}",
  "settings.general.quality_a11y": "Tetapkan kualiti muat naik kepada {value}",
  "settings.general.undo_desc":
    "Menahan mesej yang dihantar seketika supaya anda sempat menariknya balik sebelum ia keluar",
  "settings.general.undo_off_desc": "Hantar terus, tanpa pembatalan",
  "settings.general.undo_2": "2 saat",
  "settings.general.undo_2_desc": "Peluang singkat untuk menariknya balik",
  "settings.general.undo_10": "10 saat",
  "settings.general.undo_10_desc": "Tempoh paling panjang",
  "settings.general.quality": "Kualiti muat naik",
  "settings.general.quality_desc":
    "Terpakai pada gambar yang dihantar daripada kamera atau galeri anda. Setiap gambar tetap dipadankan dengan mesh.",
  "settings.general.quality_low": "Rendah",
  "settings.general.quality_low_desc":
    "Gambar terkecil, paling pantas dihantar",
  "settings.general.quality_medium": "Sederhana",
  "settings.general.quality_medium_desc":
    "Seimbang antara perincian dan kelajuan",
  "settings.general.quality_high": "Tinggi",
  "settings.general.quality_high_desc": "Mengekalkan perincian paling banyak",
  "settings.general.feature_wallet_desc":
    "Hantar ecash Cashu antara rakan melalui mesh",
  "settings.general.feature_wallet_a11y": "Dompet (sentiasa hidup)",
  "settings.general.feature_ai_desc":
    "Pembantu peribadi pada peranti, tanpa panggilan rangkaian",
  "settings.general.feature_feeds": "Suapan",
  "settings.general.feature_feeds_desc":
    "Baca dan hantar kiriman ke suapan Bluesky dan Mastodon",
  "settings.general.show_media": "Tunjuk media secara automatik",
  "settings.general.show_media_desc":
    "Gambar dan video muncul dalam sembang, atau menunggu di sebalik satu ketikan",
  "settings.general.reset": "Tetap semula tetapan",
  "settings.general.media_retention": "Simpan media selama",
  "settings.general.media_retention_desc":
    "Gambar, video dan nota suara dipadam selepas tempoh yang dipilih",
  "settings.general.media_retention_sheet":
    "Pilih berapa lama media kekal pada peranti ini. Media yang dipadam tidak boleh dipulihkan.",
  "settings.general.retention_7_desc":
    "Paling sedikit tinggalan. Terbaik kalau telefon itu sendiri yang berisiko.",
  "settings.general.retention_14_desc":
    "Jalan tengah untuk satu dua minggu tanpa liputan.",
  "settings.general.retention_30_desc":
    "Mengekalkan perbualan boleh dibaca paling lama, dan paling banyak memakan ruang cakera.",
  "settings.general.reset_desc":
    "Mengembalikan setiap keutamaan kepada nilai lalainya, tanpa menyentuh identiti, mesej, kenalan dan dompet anda",
  "settings.general.reset_title": "Tetap semula tetapan?",
  "settings.general.reset_body":
    "Setiap keutamaan kembali kepada nilai lalainya: penampilan, batalkan hantaran, dan sambungan (internet, Tor, get, jambatan, geganti). Identiti, mesej, kenalan dan dompet anda tidak disentuh.",
  "settings.general.reset_confirm": "Tetap semula",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet sentiasa hidup untuk mesej terus",
  "settings.security.signed_packets": "Paket bertandatangan",
  "settings.security.signed_packets_desc":
    "Setiap paket ditandatangani dengan Ed25519",
  "settings.security.hide_previews": "Sembunyikan pratonton pemberitahuan",
  "settings.security.hide_previews_desc":
    "Menjauhkan pengirim dan isi mesej daripada skrin kunci, yang memaparkannya tanpa perlu dibuka kunci",
  "settings.security.no_blocked": "Tiada rakan disekat",
  "settings.security.no_blocked_desc":
    "Rakan yang disekat tidak boleh menghantar mesej kepada anda atau muncul dalam tab Mesh",
  "settings.security.unblock_title": "Nyahsekat rakan ini",
  "settings.security.unblock": "Nyahsekat",
  "settings.security.unblock_peer": "Nyahsekat {name}",
  "settings.security.unblock_body":
    "{name} akan boleh menghantar mesej kepada anda semula dan muncul kembali dalam tab Mesh apabila berdekatan.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Sandaran internet",
  "settings.network.internet_desc":
    "Teruskan melalui geganti Nostr apabila rakan mesh berada di luar jangkauan",
  "settings.network.internet_off_title": "Matikan internet?",
  "settings.network.internet_off_body":
    "Airhop akan berjalan pada Bluetooth sahaja. Ia berhenti menghubungi mana-mana geganti Nostr, dan Tor, get internet serta jambatan mesh semuanya dimatikan. Sembang Bluetooth berdekatan terus berfungsi.",
  "settings.network.turn_off": "Matikan",
  "settings.network.discovery": "Penemuan geo-geganti",
  "settings.network.discovery_desc":
    "Pilih sendiri geganti terdekat untuk sel lokasi daripada 300+ geganti yang tersebar",
  "settings.network.discovery_needs_relay": "Tambah geganti sendiri dahulu",
  "settings.network.discovery_needs_relay_body":
    "Penemuan automatiklah yang menghalakan Airhop ke geganti terdekat. Mematikannya hanya masuk akal selepas anda menyematkan geganti sendiri di bawah, jadi tambah sekurang-kurangnya satu dahulu.",
  "settings.network.custom_only_title": "Guna geganti sendiri sahaja?",
  "settings.network.custom_only_body":
    "Saluran lokasi dan jambatan mesh akan berhenti memilih geganti terdekat secara automatik dan hanya menggunakan yang anda tambah. Ini boleh mengurangkan jangkauan, dan anda mungkin berhenti bertemu pengguna bitchat, yang berkumpul di geganti terdekat.",
  "settings.network.custom": "Geganti sendiri",
  "settings.network.custom_desc":
    "Tambah geganti anda sendiri untuk saluran lokasi dan jambatan mesh",
  "settings.network.custom_added": "{count} daripada {max} ditambah",
  "settings.network.dm_relays": "Geganti mesej",
  "settings.network.dm_relays_desc":
    "Mesej terus dan saluran peribadi sentiasa menggunakan geganti ini. Geganti sendiri tidak mengubahnya.",
  "settings.network.discovery_back_on":
    "Penemuan geo-geganti dihidupkan semula",
  "settings.network.discovery_back_on_body":
    "Itu geganti sendiri anda yang terakhir. Saluran lokasi memerlukan tempat untuk menerbitkan, jadi Airhop kembali memilih geganti terdekat secara automatik.",
  "settings.network.add_relay": "Tambah geganti",
  "settings.network.remove_relay": "Buang {url}",
  "settings.network.add_short": "Tambah",
  "settings.network.relay_limit":
    "Anda boleh menambah {count} geganti. Buang satu untuk menambah yang lain.",
  "settings.network.relay_duplicate":
    "Geganti itu sudah ada dalam senarai anda.",
  "settings.network.relay_invalid":
    "Masukkan hos geganti yang sah, contohnya relay.example.com. Port hanya diperlukan kalau geganti itu tidak menggunakan port lalai. Alamat IP dan nama setempat tidak dibenarkan.",
  "settings.network.lan": "Rangkaian setempat",
  "settings.network.lan_desc":
    "Hubungi orang pada WiFi yang sama, termasuk antara iPhone dan Android. Peranti lain pada rangkaian boleh melihat bahawa anda menggunakan Airhop.",
  "settings.network.lan_searching": "Tiada peranti Airhop pada rangkaian ini",
  "settings.network.lan_active": "Bersambung pada rangkaian ini",
  "settings.network.lan_unavailable": "Tiada pada rangkaian WiFi",
  "settings.network.lan_permission":
    "Akses rangkaian setempat dimatikan untuk Airhop",
  "settings.network.lan_unsupported": "Tidak tersedia pada peranti ini",
  "settings.network.lan_foreground":
    "Berhenti apabila Airhop di latar belakang. Bluetooth terus berjalan.",
  "settings.network.wifi_pair": "Gandingan",
  "settings.network.wifi_paired": "Peranti bergandingan",
  "settings.network.wifi_pair_find": "Cari peranti",
  "settings.network.wifi_pair_find_desc":
    "Cari iPhone berdekatan yang sedang menunjukkan dirinya. Kedua-dua telefon perlukan iOS 26 atau lebih baharu.",
  "settings.network.wifi_pair_show": "Tunjukkan iPhone ini",
  "settings.network.wifi_pair_show_desc":
    "Biarkan iPhone berdekatan menemui yang ini. Seorang mencari, seorang lagi menunjukkan, pada masa yang sama.",
  "settings.network.wifi_pair_find_action": "Pilih iPhone berdekatan",
  "settings.network.wifi_pair_show_action": "Jadikan iPhone ini boleh ditemui",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware tidak tersedia buat masa ini",
  "settings.network.wifi_pair_forget":
    "Buang gandingan dalam aplikasi Settings",
  "settings.network.bitchat": "Keserasian bitchat",
  "settings.network.bitchat_desc":
    "Mesh BLE yang sama dengan bitchat, saling beroperasi sepenuhnya. Ini sentiasa hidup dan tidak boleh dimatikan.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Jalan di latar belakang",
  "settings.conn.background_desc":
    "Biarkan mesh berjalan apabila Airhop ditutup",
  "settings.conn.background_on_title": "Biarkan mesh berjalan?",
  "settings.conn.background_on_body":
    "Airhop terus menyampaikan dan menerima apabila ia ditutup, jadi mesej sampai semasa anda tiada. Android memaparkan pemberitahuan berterusan sepanjang itu.",
  "settings.conn.background_off_title": "Hentikan mesh apabila Airhop ditutup?",
  "settings.conn.background_off_body":
    "Mesej hanya akan sampai semasa Airhop dibuka, dan telefon ini berhenti menyampaikan untuk orang berdekatan. Pemberitahuan berterusan itu hilang.",
  "settings.conn.live_voice": "Suara langsung",
  "settings.conn.live_voice_desc":
    "Bercakap dengan orang berdekatan seperti walkie-talkie",
  "settings.conn.live_voice_on_title": "Hidupkan suara langsung?",
  "settings.conn.live_voice_on_body":
    "Menahan mikrofon menghantar suara anda kepada semua orang dalam jangkauan Bluetooth sambil anda bercakap, dan suara mereka dimainkan pada telefon anda. Tiada apa-apa dirakam.",
  "settings.conn.live_voice_off_title": "Matikan suara langsung?",
  "settings.conn.live_voice_off_body":
    "Menahan mikrofon akan merakam nota suara sebaliknya. Ia dihantar apabila anda lepaskan, dan tiada siapa mendengarnya sehingga mereka memainkannya.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Penghalaan Tor",
  "settings.conn.tor_desc":
    "Halakan trafik Nostr melalui Tor untuk privasi tambahan",
  "settings.conn.tor_on_title": "Halakan trafik Nostr melalui Tor?",
  "settings.conn.tor_on_body":
    "Geganti berhenti melihat alamat IP anda. Menyambung mengambil masa lebih lama dan mesej sampai lebih perlahan. Bluetooth tidak terjejas.",
  "settings.conn.tor_off_title": "Matikan penghalaan Tor?",
  "settings.conn.tor_off_body":
    "Trafik Nostr kembali melalui sambungan biasa anda, jadi geganti melihat alamat IP anda semula. Bluetooth tetap tidak terjejas.",
  "settings.conn.tor_unavailable":
    "Penghalaan Tor tidak tersedia dalam binaan ini.",
  "settings.conn.tor_timeout":
    "Tor mengambil masa lebih daripada seminit untuk menyambung. Ia kekal hidup dan terus mencuba; tab Mesh akan memberitahu bila ia mula menghala, atau kalau rangkaian ini menyekatnya.",
  "settings.conn.tor_failed":
    "Tor tidak dapat dimulakan. Cuba lagi sebentar lagi.",
  "settings.tor.status": "Status Tor",
  "settings.tor.connection": "Sambungan",
  "settings.tor.mode_off": "Terus",
  "settings.tor.mode_off_desc":
    "Menyambung terus ke Tor. Paling laju, tetapi sesiapa yang memerhati rangkaian ini nampak anda menggunakan Tor.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Menyembunyikan penggunaan Tor, dan tetap berfungsi di tempat jambatan disekat. Paling perlahan untuk menyambung.",
  "settings.tor.mode_obfs4": "obfs4",
  "settings.tor.mode_obfs4_desc":
    "Menyembunyikan penggunaan Tor. Lebih laju daripada Snowflake, tetapi jambatan ini awam dan sesetengah rangkaian menyekatnya.",
  "settings.tor.mode_webtunnel": "webtunnel",
  "settings.tor.mode_webtunnel_desc":
    "Menyembunyikan penggunaan Tor dengan kelihatan seperti lawatan laman web biasa. Lebih sukar disekat daripada yang lain.",
  "settings.tor.mode_custom": "Jambatan sendiri",
  "settings.tor.mode_custom_desc":
    "Gunakan baris jambatan obfs4 daripada bridges.torproject.org. Cuba ini apabila yang lain gagal.",
  "settings.tor.custom_placeholder": "Tampal satu baris jambatan setiap baris",
  "settings.tor.custom_apply_hint": "Ketik di luar kotak untuk menyambung.",
  "settings.tor.custom_empty":
    "Tambah sekurang-kurangnya satu baris jambatan dahulu.",
  "settings.tor.recovered":
    "Tor dimatikan kerana ia tidak selesai dimulakan kali terakhir. Hidupkannya semula untuk cuba lagi.",
  "settings.conn.mint_clearnet":
    "Benarkan trafik mint melalui rangkaian terbuka",
  "settings.conn.mint_clearnet_desc":
    "Tor pada iOS hanya meliputi Nostr. Biarkan mati untuk menyekat permintaan mint; ecash melalui mesh tetap berfungsi.",
  "settings.conn.gateway": "Get internet",
  "settings.conn.gateway_desc":
    "Pinjamkan sambungan anda kepada telefon luar talian berdekatan supaya ia tetap boleh mencapai saluran lokasi",
  "settings.conn.gateway_on_title": "Hidupkan get internet?",
  "settings.conn.gateway_on_body":
    "Telefon berdekatan yang tiada sambungan sendiri akan menghantar dan menerima mesej saluran lokasi melalui sambungan anda. Ia menggunakan data mudah alih dan bateri anda, dan mesej mereka kekal disulitkan hujung ke hujung, jadi anda tidak boleh membaca apa yang melaluinya.",
  "settings.conn.gateway_off_title": "Matikan get internet?",
  "settings.conn.gateway_off_body":
    "Telefon luar talian berdekatan berhenti mencapai saluran lokasi melalui sambungan anda. Mesej anda sendiri tidak terjejas.",
  "settings.conn.bridge": "Jambatan mesh",
  "settings.conn.bridge_desc":
    "Sambungkan sembang awam #bluetooth kawasan ini dengan kumpulan Bluetooth lain di luar jangkauan melalui internet",
  "settings.conn.bridge_on_title": "Hidupkan jambatan mesh?",
  "settings.conn.bridge_on_body":
    "Mesej awam #bluetooth anda akan diterbitkan ke kejiranan anda melalui internet, jadi orang di luar jangkauan Bluetooth boleh membacanya. Mesej peribadi tidak pernah dijambatani, dan “berdekatan sahaja” mengekalkan satu mesej tertentu di tempatan.",
  "settings.conn.bridge_off_title": "Matikan jambatan mesh?",
  "settings.conn.bridge_off_body":
    "Mesej awam #bluetooth anda kembali kekal dalam jangkauan Bluetooth, dan mesej daripada kumpulan seberang berhenti sampai ke sini.",
  "settings.conn.bridge_needs_location": "Jambatan mesh memerlukan lokasi",
  "settings.conn.bridge_needs_location_desc":
    "Ia mencari kejiranan anda daripada penetapan kedudukan. Berikan kebenaran lokasi untuk mula menjambatani.",
  "settings.conn.grant_location": "Berikan kebenaran lokasi",
  "settings.conn.grant_short": "Berikan",
  "settings.conn.internet_off": "Internet dimatikan",
  "settings.conn.internet_off_desc":
    "Tor, jambatan dan get semuanya menggunakan internet. Hidupkan Sandaran internet di bawah Rangkaian untuk menggunakannya.",
  "settings.conn.turn_on": "Hidupkan",
  "settings.conn.turn_off": "Matikan",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Mencari peranti berdekatan dan menyampaikan mesej antara mereka. Tanpanya mesh tidak boleh berfungsi.",
  "settings.permissions.location": "Lokasi",
  "settings.permissions.location_desc":
    "Membuka saluran kawasan berdekatan. Tanpanya saluran itu kekal tertutup dan mesh Bluetooth berjalan seperti biasa.",
  "settings.permissions.notifications": "Pemberitahuan",
  "settings.permissions.notifications_desc":
    "Terima makluman untuk mesej baharu walaupun aplikasi ditutup. Tanpanya anda hanya melihatnya apabila membuka Airhop.",
  "settings.permissions.camera": "Kamera",
  "settings.permissions.camera_desc":
    "Mengimbas kod QR serta merakam gambar atau video untuk dihantar. Tanpanya anda masih boleh berkongsi media daripada galeri anda.",
  "settings.permissions.photos": "Gambar",
  "settings.permissions.photos_desc":
    "Menghantar gambar daripada galeri anda dan menyimpan media yang diterima. Tanpanya anda masih boleh merakam dan menghantar gambar baharu dengan kamera.",
  "settings.permissions.microphone": "Mikrofon",
  "settings.permissions.microphone_desc":
    "Merakam dan menghantar mesej suara atau menggunakan suara langsung. Tanpanya mesej suara dan suara langsung tidak akan berfungsi.",
  "settings.permissions.allow": "Berikan kebenaran ini",
  "settings.permissions.open_settings":
    "Buka tetapan sistem untuk mengubah kebenaran ini",
  "settings.permissions.system": "Sistem",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Penggunaan rangkaian",
  "settings.storage.storage_usage": "Penggunaan storan",
  "settings.storage.storage_usage_desc":
    "Mesej, bukti dompet dan lampiran dalam cache",
  "settings.storage.session_usage":
    "Sesi ini · {sent} dihantar, {received} diterima",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} lampiran",
  "settings.storage.clear_cache": "Kosongkan cache lampiran",
  "settings.storage.clear": "Kosongkan",
  "settings.storage.clear_title": "Kosongkan media dalam cache?",
  "settings.storage.clear_body":
    "Gambar, video, nota suara dan fail dibuang daripada peranti ini, yang dihantar mahupun yang diterima. Semuanya tidak boleh dimuat turun semula: gelembungnya akan menyatakan begitu, dan anda boleh meminta pengirim menghantarnya semula. Mesej dan dompet tidak disentuh.",
  "settings.storage.cleared": "Cache dikosongkan",
  "settings.storage.freed": "Membebaskan {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Tetapkan penampilan kepada {value}",
  "settings.font.set_a11y": "Tetapkan fon lebar tetap kepada {value}",
  "settings.font.system": "Sistem",
  "settings.font.system_desc": "Menggunakan fon lebar tetap lalai peranti anda",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Moden dan mudah dibaca",
  "settings.language.en": "Inggeris",
  "settings.language.am": "Amhara",
  "settings.language.ar": "Arab",
  "settings.language.bn": "Benggali",
  "settings.language.my": "Burma",
  "settings.language.zh_hans": "Cina (Ringkas)",
  "settings.language.zh_hant": "Cina (Tradisional)",
  "settings.language.nl": "Belanda",
  "settings.language.fil": "Filipina",
  "settings.language.fr": "Perancis",
  "settings.language.ka": "Georgia",
  "settings.language.de": "Jerman",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesia",
  "settings.language.it": "Itali",
  "settings.language.ja": "Jepun",
  "settings.language.ko": "Korea",
  "settings.language.mg": "Malagasi",
  "settings.language.ms": "Melayu",
  "settings.language.ne": "Nepal",
  "settings.language.fa": "Parsi",
  "settings.language.pl": "Poland",
  "settings.language.pt_br": "Portugis (Brazil)",
  "settings.language.pt_pt": "Portugis (Portugal)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Rusia",
  "settings.language.es": "Sepanyol",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Sweden",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thai",
  "settings.language.tr": "Turki",
  "settings.language.uk": "Ukraine",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnam",
  "settings.language.pseudo": "Pseudolokal",
  "settings.language.soon": "Akan datang",
  "settings.language.soon_a11y": "{value}, akan datang",
  "settings.language.set_a11y": "Tetapkan bahasa kepada {value}",
  "settings.language.pending": "Pada pembukaan seterusnya",
  "settings.language.pending_a11y":
    "{value}, berkuat kuasa apabila anda membuka Airhop kali seterusnya",
  "settings.language.rtl_restart": "Buka semula sekarang",
  "settings.language.rtl_title": "Buka semula Airhop untuk menyelesaikannya",
  "settings.language.rtl_body":
    "{value} dibaca dari kanan ke kiri, dan Airhop hanya boleh menukar arah semasa ia bermula. Tutup dan bukanya semula untuk menyelesaikan pertukaran. Tiada apa-apa hilang, dan mesh anda kekal bersambung sehingga anda melakukannya.",
  "settings.theme.light": "Cerah",
  "settings.theme.light_desc": "Sentiasa guna palet cerah",
  "settings.theme.dark": "Gelap",
  "settings.theme.dark_desc": "Sentiasa guna palet gelap",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Dalam talian",
  "settings.status.online_desc": "Boleh ditemui, mengiklan dan mengimbas",
  "settings.status.away": "Tiada di sini",
  "settings.status.away_desc": "Mesh dijeda, tidak mengimbas atau mengiklan",
  "settings.status.invisible": "Halimunan",
  "settings.status.invisible_desc":
    "Mengimbas, tetapi tersembunyi daripada penemuan",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Tetapkan status kepada {value}",
  "settings.status.edit": "Ubah status",
  "settings.status.desc": "Pilih sejauh mana anda kelihatan pada mesh.",
  "settings.transfer.identity": "Identiti dan kunci",
  "settings.transfer.identity_desc": "ID rakan, nama pengguna dan kenalan anda",
  "settings.transfer.chats": "Sembang dan sejarah",
  "settings.transfer.chats_desc":
    "Perbualan, kumpulan dan saluran yang anda sertai",
  "settings.transfer.wallet": "Baki dompet",
  "settings.transfer.wallet_desc": "Bukti Cashu dan sejarah urus niaga",
  "settings.transfer.title": "Pindahkan ke telefon baharu",
  "settings.transfer.desc":
    "Pindahkan identiti, sembang dan dompet anda ke peranti lain",
  "settings.transfer.coming_soon_a11y":
    "Pindahkan ke telefon baharu, akan datang",
  "settings.transfer.body":
    "Rapatkan kedua-dua telefon dan pindahkan semuanya melalui Bluetooth. Tiada apa-apa melalui pelayan, jadi ia berfungsi tanpa internet.",
  "settings.qr.permission_label": "Capaian gambar",
  "settings.qr.permission_purpose": "menyimpan kod QR anda",
  "settings.qr.saved": "Disimpan",
  "settings.qr.saved_body": "Kod QR disimpan ke galeri gambar anda.",
  "settings.qr.save_failed": "Tidak dapat disimpan",
  "settings.qr.save_failed_body": "Kod QR tidak dapat disimpan. Cuba lagi.",
  "settings.qr.share_message": "Tambah saya pada Airhop",
  "settings.qr.share_body":
    "Tambah saya pada Airhop — pemesejan mesh peribadi yang mengutamakan luar talian.",
  "settings.qr.show_short": "Tunjuk QR",
  "settings.qr.title": "Kod QR anda",
  "settings.qr.note":
    "Ini mengandungi kunci awam anda, yang membolehkan orang lain menghantar mesej kepada anda dari mana-mana. Kongsikannya hanya dengan orang yang anda percayai. Ia tidak akan berubah melainkan anda membersihkan identiti anda.",
  "settings.qr.code_label": "Kod kenalan",
  "settings.qr.copy_code": "Salin kod kenalan",
  "settings.qr.share": "Kongsi kod QR",
  "settings.qr.share_short": "Kongsi QR",
  "settings.qr.download": "Muat turun kod QR",
  "settings.qr.download_short": "Muat turun QR",
  "settings.qr.show": "Tunjuk kod QR",
  "settings.wipe.trigger": "Cetuskan pembersihan panik",
  "settings.wipe.trigger_desc":
    "Ketik tiga kali untuk membersihkan serta-merta tanpa pengesahan",
  "settings.wipe.title": "Pembersihan panik",
  "settings.wipe.now": "Bersihkan sekarang",
  "settings.wipe.desc": "Memusnahkan serta-merta semua kunci, mesej dan bukti",
  "settings.wipe.body":
    "Ini akan memusnahkan serta-merta semua kunci, mesej dan bukti dompet anda. Ia tidak boleh dibatalkan.",
  "settings.wipe.in_progress": "Membersihkan",
  "settings.wipe.in_progress_body":
    "Memusnahkan kunci, mesej dan fail anda. Ia mengambil beberapa saat dan selesai dengan sendirinya walaupun aplikasi ditutup.",
  "settings.wipe.got_it": "Faham",
  "settings.wipe.keys_failed": "Kunci tidak dapat dimusnahkan",
  "settings.wipe.keys_failed_body":
    "Mesej, kenalan dan dompet anda sudah hilang, tetapi peranti enggan melepaskan kunci anda. Buka kunci peranti dan bersihkan sekali lagi.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Hubungi kami",
  "settings.help.contact_a11y": "E-mel {address}",
  "settings.help.bug": "Laporkan pepijat",
  "settings.help.bug_desc": "Buka isu di GitHub",
  "settings.help.bug_a11y": "Laporkan pepijat di GitHub",
  "settings.help.faq": "Soalan lazim",
  "settings.help.faq_desc": "Jawapan kepada soalan biasa",
  "settings.help.faq_a11y": "Buka Soalan Lazim",
  "settings.help.terms_desc": "Bagaimana Airhop boleh digunakan",
  "settings.help.terms_a11y": "Buka Terma Perkhidmatan",
  "settings.help.privacy_desc": "Apa yang kami tidak kumpulkan",
  "settings.help.privacy_a11y": "Buka Dasar Privasi",

  // ---- Settings: support ----
  "settings.support.card": "Kad atau UPI",
  "settings.support.card_desc":
    "Perbankan internet dan dompet digital, di seluruh dunia",
  "settings.support.card_a11y":
    "Sokong melalui kad, UPI, perbankan internet atau dompet digital",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Bulanan atau sekali sahaja, tanpa yuran platform",
  "settings.support.sponsors_a11y": "Sokong melalui GitHub Sponsors",
  "settings.support.note":
    "Saya membina Airhop pada masa lapang saya. Tiada pelabur dan tiada iklan. Kalau ia berguna kepada anda, sumbangan amat membantu pembangunan terus berjalan. Setiap ciri kekal percuma walau apa pun.",

  // ---- Settings: about and version ----
  "settings.about.version": "Versi",
  "settings.about.version_desc": "Keluaran semasa",
  "settings.about.version_a11y": "Lihat versi dan semak kemas kini",
  "settings.about.release_notes": "Nota keluaran",
  "settings.about.release_notes_desc": "Apa yang baharu dalam keluaran terkini",
  "settings.about.release_notes_a11y": "Buka nota keluaran terkini di GitHub",
  "settings.about.source": "Kod sumber",
  "settings.about.source_a11y": "Buka kod sumber di GitHub",
  "settings.about.licenses": "Lesen sumber terbuka",
  "settings.about.open_repo": "Buka repositori {name}",
  "settings.about.licenses_desc": "Pakej sumber terbuka pihak ketiga",
  "settings.about.licenses_a11y": "Lihat lesen pihak ketiga",
  "settings.version.codename": "Nama kod",
  "settings.version.checking": "Menyemak",
  "settings.version.check": "Semak kemas kini",
  "settings.version.checking_title": "Menyemak kemas kini",
  "settings.version.up_to_date": "Anda menggunakan versi terkini.",
  "settings.version.release_notes": "Lihat nota keluaran",
  "settings.version.made_with": "Dibuat dengan",
  "settings.version.number": "Versi {version}",
  "settings.version.update_to": "Kemas kini kepada {version}",
  "settings.version.update_to_a11y": "Kemas kini kepada versi {version}",
  "settings.version.released_under": "Dikeluarkan di bawah {license}",
  "settings.version.notes_a11y": "Lihat nota keluaran untuk versi {version}",
  "settings.version.tor_paused":
    "Semakan kemas kini dijeda semasa Tor dihidupkan, supaya ia tidak membocorkan IP anda. Lihat halaman keluaran melalui pelayar.",
  "settings.version.check_failed":
    "Tidak dapat menyemak kemas kini. Periksa sambungan anda dan cuba lagi.",
  "settings.version.downloading": "Memuat turun {percent}%",
  "settings.version.install": "Pasang",
  "settings.version.download_failed":
    "Muat turun gagal. Semak sambungan anda dan cuba lagi.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} bersaiz {size} KiB, melebihi had {cap} KiB.",
  "transfer.failed.malformed":
    "Satu lampiran tiba dalam keadaan rosak dan tidak dapat dibuka. Minta mereka menghantarnya sekali lagi.",
  "transfer.failed.unsupported_type":
    "Satu lampiran tiba dalam format yang tidak boleh dibuka aplikasi ini.",
  "transfer.failed.type_mismatch":
    "Satu lampiran ditolak: kandungannya tidak sepadan dengan jenis fail yang didakwanya.",
  "transfer.failed.storage":
    "Satu lampiran tiba tetapi tidak dapat disimpan. Periksa ruang kosong anda.",
  "transfer.badge.waiting": "Menunggu · {name}",
  "transfer.badge.active_count": "{count} pemindahan",
  "transfer.badge.sending": "Menghantar {name}",
  "transfer.badge.receiving": "Menerima {name}",
  "transfer.badge.a11y": "{label}, {percent} peratus. Buka perbualan.",
  "transfer.kind.photo": "Gambar",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Nota suara",
  "transfer.this.photo": "Gambar ini",
  "transfer.this.video": "Video ini",
  "transfer.this.voice": "Nota suara ini",
  "transfer.this.file": "Fail ini",
  "transfer.kind.document": "Dokumen",
  "transfer.kind.voice_preview": "Nota suara",
  "transfer.kind.photo_preview": "Gambar",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Dokumen",

  // ---- System notifications ----
  "notif.channel.messages": "Mesej",
  "notif.channel.nearby": "Rakan berdekatan",
  "notif.channel.nearby_desc":
    "Nota sekali-sekala apabila mesh menemui orang dalam jangkauan Bluetooth.",
  "notif.nearby.body":
    "Dalam jangkauan Bluetooth sekarang. Ketik untuk membuka mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Seseorang",
  "notif.notice_urgent": "Notis mendesak · {content}",
  "notif.notice": "Notis · {content}",
  "notif.incoming_file": "Fail masuk",
  "notif.preview.photo": "📷 Gambar",
  "notif.preview.voice": "🎤 Mesej suara",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Dokumen",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Mesej baharu",
  "notif.hidden.channel": "Aktiviti baharu",
  "notif.hidden.mention": "Anda disebut",
  "notif.mention.title": "{sender} menyebut anda",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "Tunjuk {count} lagi",
  },
  "chat.channels.show_more_a11y": {
    other: "Tunjuk {count} saluran lalai lagi",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}, {count} belum dibaca",
  },
  "a11y.new_count": {
    other: "{label}, {count} baharu",
  },
  "chat.a11y.unread": {
    other: "{count} belum dibaca",
  },
  "chat.thread.length_left": {
    other: "{count} berbaki",
  },
  "settings.general.retention_days": {
    other: "{count} hari",
  },
  "chat.info.group_reach": {
    other: "{reachable} daripada {count} ahli boleh dicapai",
  },
  "chat.group_members": {
    other: "Kumpulan peribadi  ·  {count} ahli",
  },
  "chat.select.count": {
    other: "{count} dipilih",
  },
  "chat.select.forward": {
    other: "Kirim {count} mesej",
  },
  "chat.voice.live_speaking_count": {
    other: "{count} sedang bercakap",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "{count} rakan dalam jangkauan",
  },
  "mesh.peer.hops_away": {
    other: "{count} lompatan dari sini",
  },
  "chat.presence.active": {
    other: "{count} aktif",
  },
  "chat.presence.nearby": {
    other: "{count} berdekatan",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "{count} mint",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint} memegang {balance} {unit} dalam {count} bukti. Membuangnya memadam bukti itu daripada peranti ini secara kekal dan tiada sandarannya. Keluarkan atau hantar bakinya dahulu.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other:
      "{count} deposit menunggu bayaran. Diperiksa semula setiap kali aplikasi dibuka.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "Memulihkan {count} bukti yang belum dibelanjakan daripada {mints}.",
  },
  "wallet.backup.already_spent": {
    other:
      "{count} syiling dijumpai tetapi sudah dibelanjakan, jadi tiada apa-apa dikreditkan untuknya. Ini normal: setiap syiling yang pernah anda belanjakan tetap muncul dalam rekod yang disimpan mint.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "Tunjuk {count} lagi",
  },
  "wallet.activity.show_more_a11y": {
    other: "Tunjuk {count} bayaran lagi",
  },
  "wallet.mint.unconfirmed_count": {
    other: "{count} belum disahkan",
  },
  "wallet.proof_count": {
    other: "{count} bukti",
  },
  "wallet.spent_removed_detail": {
    other: "{count} bukti sudah dibelanjakan dan telah dibuang.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "{count} orang berdekatan",
  },
};

export const ms = { strings, plurals };
