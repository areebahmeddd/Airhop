// id: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Batal",
  "common.done": "Selesai",
  "common.ok": "Oke",
  "common.close": "Tutup",
  "common.back": "Kembali",
  "common.delete": "Hapus",
  "common.remove": "Singkirkan",
  "common.add": "Tambah",
  "common.copy": "Salin",
  "common.copied": "Tersalin",
  "common.share": "Bagikan",
  "common.continue": "Lanjut",
  "common.try_again": "Coba lagi",
  "common.settings": "Pengaturan",
  "common.off": "Mati",

  // ---- Dates ----
  "format.today": "Hari ini",
  "format.yesterday": "Kemarin",
  "format.minutes_ago": "{count} mnt lalu",
  "format.hours_ago": "{count} jam lalu",
  "format.days_ago": "{count} hr lalu",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Obrolan",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Dompet",
  "nav.tab.profile": "Kamu",
  "a11y.tab.new_peers": "{label}, ada orang baru di dekat sini",
  "nav.notifications": "Notifikasi",
  "chat.subtab.channels": "Kanal",
  "chat.subtab.direct": "Langsung",
  "chat.subtab.dms": "Pesan langsung",
  "chat.search.placeholder": "Cari di obrolan…",
  "chat.search.a11y": "Cari di obrolan dan pesan",
  "chat.search.close": "Tutup pencarian",
  "chat.search.clear": "Bersihkan pencarian",
  "mesh.view.radar": "Tampilan radar",
  "mesh.view.list": "Tampilan daftar",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Daftar",

  // ---- Legal document names ----
  "legal.last_updated": "Terakhir diperbarui: {date}",
  "legal.terms": "Ketentuan Layanan",
  "legal.privacy": "Kebijakan Privasi",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Komunikasi mesh yang privat",
  "onboarding.welcome.cta": "Mulai",
  "onboarding.welcome.cta_hint": "Setujui ketentuan di bawah untuk melanjutkan",
  "onboarding.welcome.consent_a11y":
    "Setujui Ketentuan Layanan dan Kebijakan Privasi",
  "onboarding.welcome.open_terms": "Buka Ketentuan Layanan",
  "onboarding.welcome.open_privacy": "Buka Kebijakan Privasi",
  "onboarding.welcome.consent":
    "Dengan menekan {cta}, kamu menyetujui {terms} dan {privacy} kami.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Membuat identitasmu",
  "onboarding.identity.body":
    "Membuat pasangan kunci Ed25519 di perangkat ini.\nTidak ada yang dikirim ke mana pun.",
  "onboarding.identity.failed_heading": "Kunci kamu tidak bisa dibuat",
  "onboarding.identity.failed_body":
    "Perangkat ini tidak mengizinkan Airhop menyimpannya dengan aman. Coba lagi, atau mulai ulang ponselmu lalu buka Airhop kembali.",
  "onboarding.identity.steps_a11y": "Langkah: {steps}",
  "onboarding.identity.step.x25519": "Membuat pasangan kunci statis X25519",
  "onboarding.identity.step.ed25519":
    "Membuat pasangan kunci penanda tangan Ed25519",
  "onboarding.identity.step.keychain":
    "Menyimpan kunci di gantungan kunci sistem",
  "onboarding.identity.step.peer_id": "Menurunkan ID rekan",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Namamu di mesh",
  "onboarding.username.peer_id": "ID rekan",
  "onboarding.username.card_a11y":
    "Namamu di mesh adalah {username}. ID rekan {peerID}. {props}.",
  "onboarding.username.explanation":
    "Nama pengguna ini diturunkan secara deterministik dari kunci publikmu. Namanya sama di setiap perangkat yang melihat ID rekanmu.",
  "onboarding.username.cta": "Masuk ke Airhop",
  "onboarding.username.prop.algorithm": "Algoritma",
  "onboarding.username.prop.storage": "Penyimpanan",
  "onboarding.username.prop.storage_value": "Hanya gantungan kunci sistem",
  "onboarding.username.prop.account": "Perlu akun",
  "onboarding.username.prop.account_value": "Tidak ada",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Selamat datang di Airhop",
  "onboarding.hello.p1":
    "Halo. Airhop dibangun di atas bitchat sebagai proyek sampingan sumber terbuka yang berdiri sendiri. Airhop tidak berafiliasi dengan dan tidak didukung oleh proyek bitchat maupun permissionless tech, hanya sesuatu yang senang saya bangun dan bagikan ke komunitas.",
  "onboarding.hello.p2":
    "Ini rilis pertama untuk iOS dan Android, jadi meski sudah saya uji bersama teman-teman, kamu mungkin masih menemui beberapa bug. Kalau begitu, atau kalau kamu punya ide fitur, saya senang mendengarnya. Buka isu di {github} atau kirim email ke {email}.",
  "onboarding.hello.p3":
    "Kalau Airhop berguna buatmu, pertimbangkan meninggalkan bintang di {github} atau ulasan di {store}. Itu membantu lebih banyak orang menemukan proyek ini. Terima kasih sudah mencoba!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Sebelum ponselmu bertanya",
  "onboarding.primer.lede":
    "Inilah yang dilakukan masing-masing, dan yang tidak.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Menemukan perangkat di dekat sini dan meneruskan pesan di antaranya. Begitulah mesh terbentuk, dan ia bekerja tanpa koneksi internet.",
  "onboarding.primer.location.title": "Lokasi",
  "onboarding.primer.location.body":
    "Menempatkanmu di kanal wilayah terdekat, dari satu blok sampai satu kawasan. Airhop tidak pernah melacakmu atau mengirim lokasi persismu keluar dari perangkat.",
  "onboarding.primer.notifications.title": "Notifikasi",
  "onboarding.primer.notifications.body":
    "Terima peringatan untuk pesan baru bahkan saat aplikasi tertutup. Notifikasi dibuat secara lokal di perangkatmu, tanpa keterlibatan server.",
  "onboarding.primer.footnote":
    "Kamu boleh menolak. Pesan tetap berjalan lewat internet, dan kamu bisa berubah pikiran nanti di Pengaturan.",
  "onboarding.primer.cta_a11y": "Lanjut ke permintaan izin",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Akses Bluetooth",
  "permission.bluetooth.purpose":
    "menemukan perangkat di dekat sini lewat mesh",
  "permission.open_settings": "Buka Pengaturan",
  "permission.not_now": "Nanti saja",
  "permission.blocked_title": "{label} mati",
  "permission.blocked_body": "Nyalakan di Pengaturan untuk {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Ada yang tidak beres",
  "error.boundary.body":
    "Airhop menemui masalah tak terduga dan harus menghentikan apa yang sedang ditampilkan.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Kanal bawaan",
  "chat.channels.yours": "Kanalmu",
  "chat.channels.none": "Belum ada kanal",
  "chat.channels.none_hint":
    "Ketuk {plus} di atas untuk bergabung atau membuat kanal.",
  "chat.channels.none_desc":
    "Belum ada kanal. Pakai tombol tambah di kepala halaman untuk bergabung atau membuat kanal.",
  "chat.channels.show_fewer": "Tampilkan lebih sedikit kanal bawaan",
  "chat.channels.show_less": "Tampilkan lebih sedikit",
  "chat.channels.info": "Info kanal",
  "chat.channels.pin": "Sematkan kanal",
  "chat.channels.unpin": "Lepas sematan kanal",
  "chat.channels.mute": "Bisukan kanal",
  "chat.channels.unmute": "Bunyikan kanal",
  "chat.channels.leave": "Tinggalkan kanal",
  "chat.channels.leave_confirm": "Tinggalkan",
  "chat.channels.clear_body":
    "Hapus semua pesan di {name}? Ini tidak bisa dibatalkan.",
  "chat.channels.leave_body":
    "Tinggalkan {name}? Kamu berhenti menerima pesannya, dan riwayatnya disingkirkan dari perangkat ini.",
  "chat.channels.more_options": "Pilihan lain untuk {name}",
  "chat.channels.teleported_tag": "{level}  ·  berteleportasi",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Bersihkan obrolan",
  "chat.dm.remove_contact": "Singkirkan kontak",
  "chat.dm.block": "Blokir rekan ini",
  "chat.dm.block_confirm": "Blokir",
  "chat.dm.delete": "Hapus obrolan",
  "chat.dm.delete_body":
    "Ini menyingkirkan percakapan dari daftarmu dan menghapus pesannya. Kontaknya tetap disimpan, dan pesan baru dari mereka memulai obrolan yang baru.",
  "chat.dm.in_range": "dalam jangkauan",
  "chat.dm.row_hint": "Ketuk dua kali lalu tahan untuk pilihan lain",
  "chat.channels.row_hint": "Ketuk dua kali lalu tahan untuk pilihan lain",
  "chat.dm.you_prefix": "Kamu:",
  "chat.dm.none": "Tidak ada pesan langsung",
  "chat.dm.none_desc":
    "Buka tab Mesh lalu ketuk seorang rekan untuk memulai pesan langsung yang terenkripsi.",
  "chat.dm.contact_info": "Info kontak",
  "chat.dm.pin": "Sematkan obrolan",
  "chat.dm.unpin": "Lepas sematan obrolan",
  "chat.dm.mute": "Bisukan obrolan",
  "chat.dm.unmute": "Bunyikan obrolan",
  "chat.dm.clear_body":
    "Hapus semua pesan dengan {name}? Ini tidak bisa dibatalkan.",
  "chat.dm.remove_contact_body":
    "Singkirkan {name}? Ini menghapus percakapannya dan melupakan kontaknya. Mereka masih bisa menjangkaumu kalau mengirim pesan lagi.",
  "chat.dm.block_body":
    "Blokir {name}? Kamu tidak akan melihat mereka di tab Mesh atau menerima pesan dari mereka, bahkan saat mereka di dekat sini.",
  "chat.dm.more_options": "Pilihan lain untuk {name}",
  "chat.dm.remove_contact_short": "Singkirkan kontak",
  "chat.dm.block_short": "Blokir kontak",
  "chat.dm.delete_short": "Hapus obrolan",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Bersihkan pesan",
  "chat.clear_confirm": "Bersihkan",
  "chat.group_badge": "Grup",
  "chat.more": "Lainnya",
  "chat.no_messages": "Belum ada pesan",
  "chat.you": "Kamu",
  "chat.a11y.channel": "Kanal {name}",
  "chat.a11y.group": "Grup {name}",
  "chat.a11y.muted": "dibisukan",
  "chat.a11y.pinned": "disematkan",

  // ---- Chats: start something new ----
  "chat.new.title": "Mulai sesuatu yang baru",
  "chat.new.channel": "Buat kanal pribadi",
  "chat.new.channel_label": "Kanal pribadi",
  "chat.new.channel_desc":
    "Ruang yang bisa dimasuki siapa pun yang punya tautannya. Buat satu, atau bergabung dengan tautan yang dikirimkan kepadamu.",
  "chat.new.group": "Buat grup pribadi",
  "chat.new.group_label": "Grup pribadi",
  "chat.new.group_desc":
    "Pilih orang tertentu. Sampai 16. Bertahan di Bluetooth.",
  "chat.new.place": "Pergi ke suatu tempat lewat geohash",
  "chat.new.place_label": "Pergi ke suatu tempat",
  "chat.new.place_desc": "Buka kanal lokasi di mana pun lewat geohash-nya.",
  "chat.new.reach": "Jangkauan",
  "chat.new.reach_internet": "Menjangkau anggota lewat Bluetooth dan internet.",
  "chat.new.reach_mesh":
    "Bekerja dalam jangkauan Bluetooth, bukan lewat internet.",
  "chat.new.reach_internet_desc":
    "Menjangkau anggota lewat internet juga. Relai bisa melihat bahwa kanalnya aktif, tidak pernah pesannya atau siapa yang ada di dalamnya.",
  "chat.new.reach_mesh_desc":
    "Bertahan di mesh lokal. Paling privat, tidak ada yang keluar dari jangkauan Bluetooth.",
  "chat.new.join_link": "Bergabung ke kanal pribadi dengan tautan undangan",
  "chat.new.back_to_chooser": "Kembali ke pilihan",
  "chat.new.create_channel": "Buat kanal",
  "chat.new.name_required": "Masukkan nama kanal dulu",
  "chat.new.name_taken": "Nama itu sudah dipakai",
  "chat.new.create": "Buat",
  "chat.new.e2ee":
    "Terenkripsi ujung ke ujung. Hanya anggota yang bisa membaca pesannya.",
  "chat.new.invite_only":
    "Hanya lewat undangan. Siapa pun yang kamu beri tautannya bisa bergabung. Kanalnya tetap tersembunyi dari semua orang lain, bahkan dari rekan di dekat sini.",
  "chat.new.name_exists": "Kanal dengan nama ini sudah ada.",
  "chat.new.reach_bluetooth_chip": "Hanya Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Bergabung dengan tautan undangan",

  // ---- Chats: join by link ----
  "chat.join.title": "Bergabung lewat tautan",
  "chat.join.not_airhop": "Itu bukan tautan Airhop.",
  "chat.join.reach_internet":
    "Menjangkau anggota lewat Bluetooth dan internet.",
  "chat.join.reach_mesh": "Bertahan dalam jangkauan Bluetooth.",
  "chat.join.contact_card":
    "Sebuah kartu kontak. Menambahkan mereka ke kontakmu dan membuka obrolannya.",
  "chat.join.unverified": "Tautan itu tidak bisa diverifikasi",
  "chat.join.unverified_body":
    "Kartu kontaknya tidak cocok dengan kuncinya sendiri, jadi ia tidak ditambahkan. Minta mereka mengirim yang baru.",
  "chat.join.paste": "Tempel dari papan klip",
  "chat.join.join": "Bergabung",
  "chat.join.public_channel":
    "Kanal publik {name}. Siapa pun di dekat sini bisa membacanya.",
  "chat.join.private_channel": "Kanal pribadi {name}. {reach}",
  "chat.join.dm_with": "Pesan langsung dengan {name}.",
  "chat.join.joined_as": "Bergabung sebagai {name}",
  "chat.join.name_clash_body":
    "Kamu sudah berada di {name} yang berbeda. Nama kanal hanyalah label, jadi undangan ini membuka kanalnya sendiri dan kanal yang kamu ikuti tidak tersentuh. Kamu bisa mengganti nama keduanya dari info kanalnya.",
  "chat.join.paste_hint":
    "Tempel undangan yang diawali airhop://. Mengetuk tautan juga bisa; ini untuk tautan yang tidak bisa kamu ketuk.",
  "chat.join.key_note":
    "Undangan kanal pribadi membawa kuncinya, jadi bergabung berlangsung seketika dan tidak ada yang perlu dimintai apa pun.",
  "chat.join.offline_note":
    "Bekerja secara luring. Tautannya dibaca di perangkat ini, dan kanalnya menjangkau sejauh yang disiapkan pembuatnya.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Sel itu tidak bisa dibuka. Coba lagi sebentar lagi.",
  "chat.jump.title": "Pergi ke suatu tempat",
  "chat.jump.saved": "TEMPAT TERSIMPAN",
  "chat.jump.anywhere":
    "Buka kanal lokasi publik di mana pun, bahkan tempat yang tidak kamu tempati.",
  "chat.jump.geohash_note":
    "Masukkan geohash-nya. Semua orang yang lokasinya jatuh di sel itu berbagi kanalnya.",
  "chat.jump.teleport_note":
    "Kamu tampak berteleportasi, bukan berada di dekat sini. Ia hanya menjangkau lewat internet.",
  "chat.jump.level_cell": "Sel tingkat {level}",
  "chat.jump.already_here":
    "Kamu sudah di sini. Pergi akan membuka kanal {name}-mu.",
  "chat.jump.open_direction": "Buka sel di sebelah {direction}",
  "chat.jump.open_place": "Buka {name}",
  "chat.jump.remove_place": "Singkirkan {name} dari tempat tersimpan",
  "chat.jump.go": "Pergi",
  "chat.jump.how":
    "Cara menemukan geohash: buka kanal lokasi > ketuk namanya > salin dari sana.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Tidak semua anggota bisa dijangkau. Coba lagi selagi mereka di dekat sini.",
  "chat.group.you_were_added": "Kamu ditambahkan ke {name}.",
  "chat.group.added_you": "Menambahkanmu ke {name}",
  "chat.group.you_were_removed":
    "Kamu dikeluarkan dari {name}. Kamu tidak bisa lagi membaca atau mengirim pesan di sini.",
  "chat.group.removed_you": "Mengeluarkanmu dari {name}",
  "chat.group.add_failed": "Mereka tidak bisa ditambahkan",
  "chat.group.add_failed_body":
    "Tidak ada yang berubah. Entah mereka sedang tidak bisa dijangkau, grupnya sudah penuh di 16, atau kamu bukan pembuatnya.",
  "chat.group.remove_failed": "Mereka tidak bisa dikeluarkan",
  "chat.group.remove_failed_body":
    "Tidak ada yang berubah. Hanya orang yang membuat grupnya yang bisa mengubah isinya.",
  "chat.group.e2ee":
    "Terenkripsi ujung ke ujung. Hanya anggota yang bisa membaca pesannya.",
  "chat.group.cap":
    "Sampai 16 orang, kamu yang memilih. Tidak ada tautan undangan, jadi tidak ada yang masuk gara-gara diteruskan tautan.",
  "chat.group.bluetooth":
    "Hanya Bluetooth. Anggota di luar jangkauan menerima pesannya begitu mereka kembali.",
  "chat.group.members_label": "ANGGOTA",
  "chat.group.none_in_range":
    "Tidak ada siapa pun dalam jangkauan. Anggota harus ada di dekat sini saat kamu membuat grupnya.",
  "chat.group.create_title": "Buat sebuah grup",
  "chat.group.name_placeholder": "Nama grup",
  "chat.group.create": "Buat",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Mesh lokal · hanya Bluetooth",
  "chat.scope.mesh_desc":
    "Menjangkau perangkat dalam jangkauan Bluetooth (kira-kira 10 sampai 100 meter). Tidak butuh internet. Cocok untuk koordinasi di tempat.",
  "chat.scope.block": "Blok kota · ~100 m",
  "chat.scope.block_desc":
    "Cakupan seluas satu blok kota. Pesan dijembatani lewat internet supaya rekan yang tepat di luar jangkauan Bluetooth tetap bisa ikut.",
  "chat.scope.neighborhood": "Lingkungan · ~1 km",
  "chat.scope.neighborhood_desc":
    "Cakupan tingkat lingkungan. Dibantu relai sehingga rekan di seluruh wilayah bisa dijangkau bahkan tanpa tautan Bluetooth langsung.",
  "chat.scope.city": "Kota · ~10 km",
  "chat.scope.city_desc":
    "Kanal se-kota. Memakai relai internet berbasis lokasi untuk menjangkau rekan di seluruh wilayah metropolitan.",
  "chat.scope.province": "Provinsi · ~100 km",
  "chat.scope.province_desc":
    "Cakupan tingkat provinsi. Dijembatani lewat internet untuk jangkauan kewilayahan sejauh ratusan kilometer.",
  "chat.scope.country": "Negara atau kawasan · ~1000 km",
  "chat.scope.country_desc":
    "Cakupan se-negara. Setiap pengguna Airhop atau bitchat di kawasan itu bisa bergabung dan membaca pesannya.",
  "chat.transport.bluetooth": "Hanya Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Hanya internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Perintah /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Kirim pelukan hangat",
  "chat.cmd.slap_hint": "Tampar dengan ikan trout besar",
  "chat.status.sending": "Mengirim…",
  "chat.status.undo_send": "Batalkan kirim",
  "chat.status.undo": "Batalkan",
  "chat.status.sent": "Terkirim",
  "chat.status.received": "Diterima",
  "chat.status.failed": "Gagal",
  "chat.status.canceled": "Dibatalkan",
  "chat.status.waiting": "Menunggu",
  "chat.status.sending_short": "Mengirim",
  "chat.status.receiving": "Menerima",
  "chat.thread.not_available": "Tidak tersedia di sini",
  "chat.thread.private_channel": "Kanal pribadi",
  "chat.thread.location_channel": "Kanal lokasi",
  "chat.thread.public_channel": "Kanal publik",
  "chat.thread.notices": "Pengumuman untuk kanal ini",
  "chat.thread.invite": "Undang seseorang ke kanal ini",
  "chat.thread.not_in_range":
    "Tidak dalam jangkauan Bluetooth. Dikirim lewat internet.",
  "chat.thread.not_nearby":
    "Tidak di dekat sini. Kami akan mengirimkannya saat mereka kembali dalam jangkauan atau daring.",
  "chat.thread.no_keys":
    "Kamu perlu berada dalam jangkauan Bluetooth, atau memindai kode mereka, untuk mengirimi mereka pesan.",
  "chat.geo.card_received":
    "{name} membagikan kontaknya. Bagikan kontakmu balik supaya kalian bisa terus mengobrol setelah salah satu dari kalian berpindah.",
  "chat.geo.exchange_complete":
    "Kontak sudah dipertukarkan. Kini kalian bisa saling menjangkau dari mana saja.",
  "chat.geo.keep_person": "Simpan orang ini",
  "chat.geo.keep_person_desc":
    "Bagikan kontakmu supaya kalian bisa terus mengobrol setelah salah satu dari kalian berpindah. Mereka akan mengetahui identitas tetapmu.",
  "chat.geo.card_sent": "Dibagikan · menunggu punya mereka",
  "chat.thread.left_cell":
    "Kamu sudah meninggalkan wilayah ini, jadi mereka tidak bisa menjangkaumu di sini. Tukar kode supaya bisa terus mengobrol di mana saja.",
  "chat.thread.no_route":
    "Mereka tidak bisa dijangkau saat ini. Pesannya akan terkirim saat ada jalur yang tersedia.",
  "chat.thread.empty": "Belum ada pesan",
  "chat.thread.empty_desc": "Mulai percakapan yang terenkripsi.",
  "chat.thread.jump_latest": "Lompat ke pesan terbaru",
  "chat.thread.back_to_members": "Kembali ke anggota",
  "chat.thread.nostr_key": "Kunci publik Nostr",
  "chat.thread.in_range": "Dalam jangkauan",
  "chat.voice.not_recorded": "Catatan suaranya tidak terekam",
  "chat.thread.message": "Pesan",
  "chat.thread.message_placeholder": "Pesan…",
  "chat.thread.length_full": "Pesannya sudah penuh",
  "chat.thread.waiting_for": "Menunggu {name} kembali · {percent}%",
  "chat.thread.peer": "rekan",
  "chat.thread.cancel_transfer": "Batalkan {name}",
  "chat.thread.queued_more": "{count} lagi menunggu untuk dikirim",
  "chat.thread.across_bridge": "{count} di seberang jembatan",
  "chat.thread.bridged": "lewat jembatan",
  "chat.thread.invite_body":
    "Gabung denganku di {channel} pada Airhop — perpesanan mesh yang privat dan mengutamakan luring.",
  "chat.thread.go_back_unread": "Kembali, {count} belum dibaca",
  "chat.thread.view_info": "Lihat info untuk {name}",
  "chat.thread.notices_new": "Pengumuman untuk kanal ini, {count} baru",
  "chat.thread.say_something": "Katakan sesuatu di {channel}.",
  "chat.thread.jump_latest_new": "Lompat ke pesan terbaru, {count} baru",
  "chat.thread.unconfirmed_since":
    "Tidak ada pengiriman yang dipastikan sejak {date}",
  "chat.thread.no_reach":
    "Tidak ada rekan di dekat sini · belum ada yang menerima ini",
  "chat.thread.channel_needs_internet":
    "Internet mati · kanal ini hanya menjangkau orang dalam jangkauan Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet mati · sel ini hanya bisa dijangkau lewat internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet mati · percakapan ini hanya dibawa lewat internet",
  "chat.thread.via_gateway":
    "Internet mati · perangkat di dekat sini sedang membawakan ini ke jaringan untukmu",
  "chat.thread.group_queued":
    "Belum ada anggota grup ini di dekat sini. Pesannya akan sampai begitu mereka ada.",
  "chat.thread.no_group_key":
    "Kamu tidak lagi berada di grup ini, jadi ini tidak bisa dikirim",
  "chat.thread.no_reach_offline":
    "Internet mati dan tidak ada rekan di dekat sini · belum ada yang menerima ini",
  "chat.thread.mention": "Sebut {name}",
  "chat.thread.someone_talking": "{hold}. {name} sedang bicara.",
  "chat.thread.attach_note":
    "Berkas hanya terkirim dalam jangkauan Bluetooth. Teks dan pembayaran menjangkau kontak lewat internet; lampiran tidak.",
  "chat.thread.message_peer": "Kirimi {name} pesan",
  "chat.thread.send": "Kirim pesan",
  "chat.thread.group": "Grup",
  "chat.bridge.nearby_only":
    "Hanya di dekat sini: jauhkan pesan ini dari jembatan mesh",
  "chat.bridge.nearby_label": "Hanya di dekat sini · bertahan di Bluetooth",
  "chat.bridge.bridging_label":
    "Menjembatani ke wilayah sekitar · ketuk untuk hanya di dekat sini",
  "chat.screenshot.you_took": "Kamu mengambil tangkapan layar",
  "chat.screenshot.you_took_private":
    "Kamu mengambil tangkapan layar · tidak ada yang diberi tahu",
  "chat.screenshot.heads_up": "Perhatian",
  "chat.screenshot.notice": "* {name} mengambil tangkapan layar *",
  "chat.screenshot.notified_dm":
    "{name} diberi tahu bahwa kamu mengambil tangkapan layar percakapan ini.",
  "chat.screenshot.notified":
    "Semua orang di kanal ini diberi tahu bahwa kamu mengambil tangkapan layar.",
  "chat.screenshot.not_notified":
    "Tidak ada yang diberi tahu. Kanal ini publik, jadi mengumumkan tangkapan layar justru akan mencatat bahwa kamu ada di sini.",
  "chat.thread.error": "Galat",
  "chat.thread.go_back": "Kembali",
  "chat.bubble.via_bridge": "lewat jembatan mesh",
  "chat.bubble.view_profile": "Lihat profil {name}",
  "chat.bubble.forwarded": "Diteruskan",
  "chat.bubble.attachment": "lampiran",
  "chat.bubble.a11y": "{sender}: {body}. Tekan lama untuk pilihan lain.",
  "chat.bubble.failed_retry": "Gagal terkirim. Ketuk untuk mencoba lagi.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Info pesan",
  "chat.info.delivered_to": "Terkirim ke {name}",
  "chat.info.read_by": "Dibaca oleh {name}",
  "chat.info.group_reach_desc":
    "Bisa dijangkau sekarang, bukan pemastian pengiriman",
  "chat.info.group_alone": "Tidak ada anggota lain",
  "chat.info.today_at": "Hari ini {time}",
  "chat.info.sending": "Mengirim…",
  "chat.info.failed": "Gagal terkirim",
  "chat.info.courier": "Dibawa seorang teman",
  "chat.info.sent": "Terkirim",
  "chat.info.queued": "Menunggu untuk dikirim",
  "chat.info.waiting": "Menunggu…",
  "chat.action.info": "Info pesan",
  "chat.action.save_photos": "Simpan ke foto",
  "chat.action.save_copy": "Simpan salinannya",
  "chat.action.forward": "Teruskan",
  "chat.action.select": "Pilih",
  "chat.select.cancel": "Batalkan pemilihan",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Kamera",
  "chat.attach.camera_desc": "Ambil foto atau video",
  "chat.attach.library": "Galeri foto",
  "chat.attach.library_desc": "Pilih dari galerimu",
  "chat.attach.document": "Dokumen",
  "chat.attach.document_desc": "Kirim berkas atau PDF apa pun",
  "chat.attach.voice": "Catatan suara",
  "chat.attach.voice_desc": "Rekam lalu kirim pesan suara",
  "chat.attach.ecash": "Kirim ecash",
  "chat.attach.ecash_desc": "Kirim sat Cashu dari dompetmu",
  "chat.attach.location": "Lokasi",
  "chat.attach.location_desc": "Kirim posisimu sekarang",
  "chat.attach.title": "Lampirkan",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Membagikan sebuah lokasi",
  "chat.location.received_summary": "Membagikan lokasinya",
  "chat.location.title": "Lokasi",
  "chat.location.away": "{distance} ke {direction}",
  "chat.location.taken": "Diambil {ago} lalu",
  "chat.location.open_maps": "Buka di Peta",
  "chat.location.no_forward": "Lokasi tidak diteruskan",
  "chat.location.no_forward_body":
    "Sebuah lokasi dikirim ke satu orang. Bagikan lokasimu sendiri kalau kamu ingin orang lain memilikinya.",
  "chat.location.no_fix": "Izinkan lokasi untuk melihat seberapa jauh ini",
  "chat.location.send_title": "Kirim lokasimu",
  "chat.location.send_body":
    "{name} akan melihat satu titik: posisimu sekarang. Ia tidak terus diperbarui.",
  "chat.location.send": "Kirim lokasi",
  "chat.location.finding": "Mencari lokasimu…",
  "chat.location.no_location": "Lokasimu tidak bisa diambil",
  "chat.location.no_location_body":
    "Izinkan akses lokasi dan pastikan layanan lokasi menyala, lalu coba lagi.",
  "chat.location.not_delivered": "Lokasimu tidak bisa dikirim",
  "chat.location.not_delivered_body":
    "Sebuah lokasi hanya layak dikirim selagi masih terkini, jadi ia tidak diantrekan untuk nanti. Coba lagi saat {name} bisa dijangkau.",
  "chat.location.direction.n": "utara",
  "chat.location.direction.ne": "timur laut",
  "chat.location.direction.e": "timur",
  "chat.location.direction.se": "tenggara",
  "chat.location.direction.s": "selatan",
  "chat.location.direction.sw": "barat daya",
  "chat.location.direction.w": "barat",
  "chat.location.direction.nw": "barat laut",
  "chat.attach.send_anyway": "Kirim saja",
  "chat.attach.bitchat_too_big": "Ini mungkin tidak sampai",
  "chat.attach.bitchat_too_big_body":
    "{name} memakai bitchat, yang menyerah di tengah jalan pada berkas besar. Di bawah kira-kira 350 KiB terbilang andal. Mengirimkannya ke kontak Airhop tidak punya batas seperti itu.",
  "chat.attach.bitchat_unopenable": "Mereka mungkin tidak bisa membuka ini",
  "chat.attach.bitchat_unopenable_body":
    "{name} memakai bitchat, yang menampilkan foto dan catatan suara tetapi mendaftar hal lain sebagai berkas yang tidak bisa dibukanya. Ia akan sampai, mereka saja yang mungkin tidak bisa melihatnya.",
  "chat.attach.file": "Lampirkan sebuah berkas",
  "chat.attach.unavailable": "Lampiran tidak tersedia di sini",
  "chat.attach.not_sent": "Lampiran tidak terkirim",
  "chat.attach.read_failed":
    "Ada yang tidak beres saat membaca berkas itu. Coba yang lain.",
  "chat.attach.caption": "Tambahkan keterangan…",
  "chat.attach.send": "Kirim lampiran",
  "chat.attach.generic": "Lampiran",
  "chat.media.view_full": "Lihat foto layar penuh",
  "chat.media.gone_photo": "Fotonya tidak ada di perangkat ini",
  "chat.media.gone_video": "Videonya tidak ada di perangkat ini",
  "chat.media.gone_voice": "Catatan suaranya tidak ada di perangkat ini",
  "chat.media.gone_file": "Berkasnya tidak ada di perangkat ini",
  "chat.media.gone_note":
    "Disingkirkan setelah 7 hari atau saat singgahannya dibersihkan",
  "chat.media.ask_resend": "Minta lagi",
  "chat.media.resend_draft": "Bisa kirim {kind} itu lagi?",
  "chat.media.kind_photo": "foto",
  "chat.media.kind_video": "video",
  "chat.media.kind_voice": "catatan suara",
  "chat.media.kind_file": "berkas",
  "chat.media.pause_voice": "Jeda catatan suara",
  "chat.media.play_voice": "Putar catatan suara",
  "chat.media.voice_position": "Posisi catatan suara",
  "chat.media.voice_scrub":
    "Ketuk sepanjang batangnya untuk melompat ke titik itu",
  "chat.media.image": "Gambar",
  "chat.media.tap_load_photo": "Ketuk untuk memuat foto",
  "chat.media.open_document": "Buka {name}",
  "chat.media.document": "dokumen",
  "chat.media.tap_load_video": "Ketuk untuk memuat video",
  "chat.media.video": "Video",
  "chat.media.photo": "Foto",
  "chat.media.close_photo": "Tutup foto",
  "chat.media.save_photo": "Simpan foto ke fotomu",
  "chat.media.share_photo": "Bagikan foto",
  "chat.media.saved_videos": "Tersimpan ke videomu",
  "chat.media.saved_photos": "Tersimpan ke fotomu",
  "chat.media.not_saved": "Tidak tersimpan",
  "chat.media.cant_open": "Berkas tidak bisa dibuka",
  "chat.media.no_app":
    "Perangkat ini tidak punya aplikasi untuk membuka atau membagikan berkas ini.",
  "chat.media.open_failed":
    "Berkasnya tidak bisa dibuka. Ia mungkin sudah dibersihkan dari singgahan.",
  "media.blocked.nostr_only":
    "Kamu hanya mengenal orang ini lewat relai. Hanya teks yang tersedia. Foto, berkas, dan catatan suara butuh Bluetooth.",
  "media.blocked.private_channel":
    "Lampiran siaran ditandatangani tetapi tidak dienkripsi, jadi mengirimnya ke kanal pribadi akan membuatnya terbuka sementara teks di sini tetap terenkripsi.",
  "media.blocked.private_group":
    "Lampiran siaran ditandatangani tetapi tidak dienkripsi, jadi mengirimnya ke grup pribadi akan membuatnya terbuka sementara teks di sini tetap terenkripsi.",
  "media.blocked.location_channel":
    "Kanal lokasi menjangkau orang lewat internet, sedangkan foto, berkas, dan catatan suara berjalan lewat Bluetooth, jadi semuanya tidak akan pernah sampai.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Catatan suara tidak tersedia di sini",
  "chat.voice.hold_live": "Tahan untuk bicara langsung",
  "chat.voice.hold_record": "Tahan untuk merekam catatan suara",
  "chat.voice.cancel_recording": "Batalkan perekaman",
  "chat.voice.slide_cancel": "Geser untuk membatalkan",
  "chat.voice.release_cancel": "Lepaskan untuk membatalkan",
  "chat.voice.a11y_toggle": "Ketuk dua kali untuk mulai atau berhenti bicara.",
  "chat.voice.limit_reached":
    "Batas dua menit tercapai, lepaskan untuk mengirim",
  "chat.voice.limit_sent": "Batas dua menit tercapai, catatannya terkirim",
  "chat.voice.stop_send": "Hentikan perekaman lalu kirim",
  "chat.voice.lift_lock": "Geser ke atas untuk merekam bebas genggam",
  "chat.voice.live_speaking": "{name} sedang bicara",
  "voice.unavailable": "Suara langsung tidak tersedia",
  "voice.recording_stopped": "Perekaman dihentikan",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Akses kamera",
  "chat.perm.camera_purpose": "mengambil foto untuk dikirim",
  "chat.perm.photo_label": "Akses foto",
  "chat.perm.photo_purpose": "memilih foto atau video untuk dikirim",
  "chat.perm.photo_save_purpose": "menyimpan ini ke fotomu",
  "chat.perm.mic_label": "Akses mikrofon",
  "chat.perm.mic_live_purpose": "bicara dengan orang di dekat sini",
  "chat.perm.mic_note_purpose": "merekam catatan suara",
  "chat.perm.recording_stopped": "Perekaman dihentikan",
  "chat.perm.record_failed":
    "Perekaman tidak bisa dimulai. Periksa izin mikrofon.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Diklaim",
  "chat.ecash.reclaimed": "Ditarik kembali",
  "chat.ecash.claiming": "Mengklaim…",
  "chat.ecash.claim": "Klaim",
  "chat.ecash.claim_amount": "Klaim {amount} {unit}",
  "chat.ecash.already_claimed": "Sudah diklaim",
  "chat.ecash.already_claimed_body":
    "Setiap bukti dalam token ini sudah ada di dompetmu, jadi tidak ada yang bertambah.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "Diserahkan ke mesh untuk pengiriman sebisanya",
  "chat.info.queued_desc": "Ditahan di ponsel ini sampai ada jalur ke mereka",
  "chat.info.reclaimed": "Ditarik kembali",
  "chat.info.reclaimed_desc":
    "Kamu menarik pembayaran ini kembali ke dompetmu, jadi ia tidak akan dikirimkan",
  "chat.info.about": "Tentang",
  "chat.info.group_desc":
    "Sebuah grup pribadi. Hanya anggota yang ditambahkan pembuatnya yang bisa membacanya, dan ia bertahan di Bluetooth.",
  "chat.info.teleported_desc":
    "Kanal lokasi publik untuk sel geohash ini. Siapa pun di sel itu, di Airhop maupun bitchat, berbagi kanalnya lewat internet. Kamu berteleportasi, tidak berada di sini secara fisik.",
  "chat.info.custom_desc":
    "Kanal buatan sendiri. Siapa pun yang tahu namanya bisa bergabung dari perangkat Airhop atau bitchat mana pun.",
  "chat.info.private_e2ee": "Pribadi · terenkripsi ujung ke ujung",
  "chat.info.public_plain": "Publik · tanpa enkripsi",
  "chat.info.group_privacy":
    "Hanya anggota yang ditampilkan di bawah yang bisa membaca grup ini. Pesan bertahan di Bluetooth, jadi anggota di luar jangkauan menerimanya begitu mereka kembali.",
  "chat.info.teleport_privacy":
    "Tempat yang kamu tuju lewat teleportasi. Ia menjangkau semua orang di sel ini lewat internet, dan tidak seorang pun dalam jangkauan Bluetooth.",
  "chat.info.location_off_privacy":
    "Lokasi mati, jadi kanal ini menjangkau perangkat di dekat sini hanya lewat Bluetooth. Nyalakan lokasi untuk menjangkau sel wilayahnya lewat internet.",
  "chat.info.invite_privacy":
    "Hanya orang yang kamu undang lewat tautan yang bisa membacanya. Kanalnya tetap tersembunyi dari semua orang lain, bahkan dari rekan di dekat sini.",
  "chat.info.public_privacy":
    "Siapa pun yang bergabung bisa membaca setiap pesan. Pakai pesan langsung untuk percakapan pribadi; pesan langsung terenkripsi ujung ke ujung.",
  "chat.info.remove_member": "Keluarkan anggota",
  "chat.info.remove_member_body":
    "Keluarkan {name} dari grup? Kunci grupnya diputar sehingga mereka tidak bisa lagi membaca pesan baru.",
  "chat.info.message_member": "Kirimi {name} pesan",
  "chat.info.remove_member_a11y": "Keluarkan {name}",
  "chat.info.no_addable":
    "Tidak ada rekan terjangkau untuk ditambahkan. Anggota harus ada di dekat sini.",
  "chat.info.add_count": "Tambah {count}",
  "chat.info.teleported_tag": "{level}  ·  berteleportasi",
  "chat.info.active": "Aktif",
  "chat.info.members": "Anggota",
  "chat.info.bookmark": "Tandai tempat ini",
  "chat.info.remove_bookmark": "Hapus penanda",
  "chat.info.default_notice":
    "Kanal bawaan tidak bisa ditinggalkan. Kanal-kanal itu bagian dari protokol mesh Airhop.",
  "chat.info.custom_channel": "Kanal buatan sendiri",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Salin geohash",
  "chat.info.relays": "Relai",
  "chat.info.show_relays": "Tampilkan relai yang membawa kanal ini",
  "chat.info.relay_custom": "sendiri",
  "chat.info.relays_none": "Tidak ada. Sel ini saat ini hanya Bluetooth.",
  "chat.info.search_members": "Cari anggota",
  "chat.info.search_members_placeholder": "Cari anggota…",
  "chat.info.teleported": "Berteleportasi",
  "chat.info.creator": "Pembuat",
  "chat.info.no_matches": "Tidak ada yang cocok",
  "chat.info.no_one_here": "Belum ada siapa pun di sini",
  "chat.info.add_members": "Tambah anggota",
  "chat.info.add_selected": "Tambahkan anggota terpilih",
  "chat.info.add": "Tambah",
  "chat.info.leave_group": "Tinggalkan grup",
  "chat.info.leave_channel": "Tinggalkan kanal",
  "chat.info.leave": "Tinggalkan",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Mengobrol sejak {date}",
  "chat.contact.verified_since": "Terverifikasi sejak {date}",
  "chat.contact.anonymous": "Anonim",
  "chat.contact.anonymous_desc":
    "Nama samaran geohash tanpa identitas tetap untuk diverifikasi",
  "chat.contact.verified": "Terverifikasi",
  "chat.contact.verified_desc": "Memindai kode QR mereka",
  "chat.contact.verified_desc_compared": "Membandingkan kode dengan mereka",
  "chat.contact.not_verified": "Belum terverifikasi",
  "chat.contact.not_verified_desc":
    "Pindai kode mereka, atau bandingkan satu kode lewat telepon, untuk memastikan bahwa ini memang mereka",
  "chat.contact.e2ee": "Terenkripsi ujung ke ujung",
  "chat.contact.e2ee_nostr":
    "Dibungkus NIP-17, jadi relai tidak bisa membacanya",
  "chat.contact.e2ee_mesh":
    "Noise XX, ditambah Double Ratchet antarperangkat Airhop",
  "chat.contact.copy_nostr": "Salin kunci publik Nostr",
  "chat.contact.nostr_key": "Kunci publik Nostr",
  "chat.contact.cell_key_note":
    "Kunci ini milik wilayah tempat kalian bertemu. Ia berubah kalau salah satu dari kalian berpindah, dan percakapannya berhenti bersamanya. Tukar kontak supaya bisa terus mengobrol di mana saja.",
  "chat.contact.peer_name": "Nama rekan",
  "chat.contact.peer_id": "ID rekan",
  "chat.contact.rename": "Ganti nama",
  "chat.contact.rename_needs_contact":
    "Kamu bisa mengganti nama orang yang kuncinya kamu pegang. Tukar kartu kontak dulu, lalu ini menjadi nama yang hanya kamu yang melihatnya.",
  "chat.contact.rename_needs_keys":
    "Belum ada kunci untuk kontak ini. Kirimi mereka pesan, atau pindai kode mereka, lalu kamu bisa memberi mereka nama yang hanya kamu yang melihatnya.",
  "chat.contact.renamed_by_you": "Namamu untuk mereka",
  "chat.contact.copy_peer_id": "Salin ID rekan",
  "chat.contact.verify": "Verifikasi kontak",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Pengumuman",
  "chat.notices.post_area": "Tempel pengumuman di wilayah ini",
  "chat.notices.post_mesh": "Tempel pengumuman di mesh",
  "chat.notices.mark_urgent": "Tandai mendesak",
  "chat.notices.post": "Tempel pengumuman",
  "chat.notices.post_short": "Tempel",
  "chat.notices.delete": "Hapus pengumuman",
  "chat.notices.just_now": "baru saja",
  "chat.notices.fades_soon": "segera memudar",
  "chat.notices.1_day": "1 hari",
  "chat.notices.3_days": "3 hari",
  "chat.notices.7_days": "7 hari",
  "chat.notices.fading": "memudar",
  "chat.notices.fades_in_hours": "memudar dalam {count} jam",
  "chat.notices.fades_in_days": "memudar dalam {count} hari",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Mendesak",
  "chat.notices.permanent_warning":
    "Tidak pernah memudar. Terbuka untuk umum dan terikat ke wilayah ini, dan kamu tidak bisa menariknya kembali.",
  "chat.notices.none":
    "Belum ada pengumuman. Tempel satu supaya ia bertahan di sini untuk orang lain.",

  // ---- Chats: search results ----
  "chat.search.photos": "Foto",
  "chat.search.videos": "Video",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Dokumen",
  "chat.search.links": "Tautan",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Saring menurut {filter}",
  "chat.search.no_matches": "Tidak ada {filter} yang cocok dengan “{query}”",
  "chat.search.no_media": "Belum ada {filter}",
  "chat.search.result_a11y": "{chat}, {kind} dari {sender}",
  "chat.search.you": "kamu",
  "chat.search.section_chats": "Obrolan",
  "chat.search.section_messages": "Pesan",
  "chat.search.section_notices": "Pengumuman",
  "chat.search.hint": "Cari di pesan dan obrolan, atau pilih saringan di atas.",
  "chat.search.no_results": "Tidak ada hasil untuk “{query}”",
  "chat.search.open_chat": "Buka {name}",
  "chat.search.message_a11y": "{chat}, pesan dari {sender}: {snippet}",
  "chat.search.notice_a11y": "Pengumuman di {chat} dari {author}: {snippet}",
  "chat.search.urgent": "Mendesak ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Ada {count} di daftar ini. Membersihkannya hanya menyingkirkannya dari sini, dan pesannya tetap belum dibaca di percakapan masing-masing. Menandai semuanya terbaca membereskan keduanya.",
  "chat.notif.mark_all_read": "Tandai semua terbaca",
  "chat.notif.clear_list": "Bersihkan daftar",
  "chat.notif.clear_all_a11y": "Bersihkan semua {count} notifikasi",
  "chat.notif.title": "Notifikasi",
  "chat.notif.clear_short": "Bersihkan",
  "chat.notif.close": "Tutup notifikasi",
  "chat.notif.none": "Belum ada notifikasi",
  "chat.notif.none_desc":
    "Pesan, sebutan, dan pengumuman dari kanal dan obrolanmu muncul di sini.",
  "chat.notif.new": "Baru",
  "chat.notif.notice_in": "pengumuman di {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Teruskan ke…",
  "chat.forward.to": "Teruskan ke {name}",
  "chat.forward.cant_send_here": "Tidak bisa diteruskan ke sini",
  "chat.forward.cant_send_to": "Tidak bisa diteruskan ke {name}",
  "chat.forward.channels": "Kanal",
  "chat.forward.groups": "Grup",
  "chat.forward.locations": "Lokasi",
  "chat.forward.dms": "Pesan langsung",
  "chat.forward.none": "Belum ada obrolan lain",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Menyalakan mesh…",
  "mesh.banner.no_bluetooth":
    "Tidak ada Bluetooth di perangkat ini · hanya internet",
  "mesh.banner.bluetooth_off": "Bluetooth mati · mesh tidak tersedia",
  "mesh.banner.permission_needed": "Perlu izin Bluetooth",
  "mesh.banner.blocked": "Bluetooth diblokir · izinkan di Pengaturan",
  "mesh.banner.location_permission": "Perlu lokasi untuk menemukan rekan",
  "mesh.banner.advertising_unsupported":
    "Ponsel ini bisa melihat yang lain tetapi tidak bisa ditemukan",
  "mesh.banner.location_off_android":
    "Lokasi mati · Android membutuhkannya untuk menemukan rekan",
  "mesh.banner.paused": "Mesh dijeda · kamu sedang tidak ada",
  "mesh.banner.location_off": "Lokasi mati · kanal lokasi tidak tersedia",
  "mesh.banner.battery_saver": "Penghemat baterai · memindai lebih jarang",
  "mesh.banner.wipe_incomplete":
    "Pembersihan belum tuntas · sebagian data mungkin tersisa, dicoba lagi saat dibuka kembali",
  "mesh.banner.wifi_off": "Wi-Fi mati · berkas besar terkirim lebih lambat",
  "mesh.banner.clock_skew":
    "Jam ponsel ini salah · setel tanggal dan waktu ke otomatis",
  "mesh.banner.internet_off": "Internet mati · hanya Bluetooth",
  "mesh.banner.relaying":
    "Tidak ada rekan di dekat sini · meneruskan lewat Nostr",
  "mesh.banner.tor": "Tor menyala · lalu lintas internet dialihkan",
  "mesh.banner.tor_starting": "Menyalakan Tor · menyambung",
  "mesh.banner.tor_blocked": "Tor tidak bisa tersambung · mesh tetap bekerja",
  "mesh.banner.gateway":
    "Gerbang internet menyala · meneruskan untuk rekan di dekat sini",
  "mesh.banner.bridge": "Jembatan mesh menyala · obrolan publik tersambung",
  "mesh.banner.background_limits":
    "{brand} bisa menjeda mesh di latar belakang",
  "mesh.banner.bridge_across":
    "Jembatan mesh menyala · {count} di seberang jembatan",
  "mesh.banner.action.turn_on": "Nyalakan",
  "mesh.banner.action.allow": "Izinkan",
  "mesh.banner.action.resume": "Lanjutkan",
  "mesh.banner.action.fix": "Perbaiki",
  "mesh.banner.hint.resume":
    "Menyalakan kembali penyiaran dan pemindaian Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Meminta Android menyalakan Bluetooth",
  "mesh.banner.hint.location_settings": "Membuka pengaturan lokasi sistem",
  "mesh.banner.hint.app_settings": "Membuka izin Airhop di pengaturan sistem",
  "mesh.banner.hint.battery_settings":
    "Membuka pengaturan aktivitas latar belakang ponsel ini",
  "mesh.banner.dismiss": "Tutup: {label}",
  "mesh.banner.hint.dismiss": "Menyembunyikan catatan ini untuk seterusnya",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Mencari rekan di dekat sini…",
  "mesh.radar.starting": "Menyalakan mesh…",
  "mesh.radar.no_bluetooth": "Tidak ada Bluetooth di perangkat ini",
  "mesh.radar.bluetooth_off": "Bluetooth mati · tidak memindai",
  "mesh.radar.permission_needed": "Perlu izin Bluetooth",
  "mesh.radar.blocked": "Bluetooth diblokir",
  "mesh.radar.location_permission": "Perlu izin lokasi",
  "mesh.radar.location_off": "Lokasi mati · tidak memindai",
  "mesh.radar.hint_rings":
    "Lingkaran menunjukkan kekuatan sinyal BLE, bukan jarak",
  "mesh.radar.hint_checking": "Memeriksa Bluetooth dan izin",
  "mesh.radar.hint_internet": "Pesan tetap berjalan lewat internet",
  "mesh.radar.hint_turn_on": "Nyalakan Bluetooth untuk menemukan rekan",
  "mesh.radar.hint_allow": "Izinkan Bluetooth untuk menemukan rekan",
  "mesh.radar.hint_allow_settings":
    "Izinkan Bluetooth di Pengaturan untuk menemukan rekan",
  "mesh.radar.hint_location_permission":
    "Android 11 ke bawah butuh lokasi untuk memindai lewat Bluetooth",
  "mesh.radar.hint_android_location":
    "Android butuh lokasi menyala agar mengembalikan hasil pemindaian Bluetooth",
  "mesh.radar.signal_strong": "Kuat",
  "mesh.radar.signal_medium": "Sedang",
  "mesh.radar.signal_weak": "Lemah",
  "mesh.radar.you_center": "Kamu, di pusat mesh",
  "mesh.radar.sonar_hint":
    "Memainkan sapuan sonar. Pemindaian memang sudah berjalan terus.",
  "mesh.radar.paused": "Mesh dijeda · kamu sedang tidak ada",
  "mesh.radar.ring_hint":
    "Posisi lingkaran mencerminkan kekuatan sinyal, bukan jarak",
  "mesh.radar.set_online":
    "Setel statusmu ke Daring di tab Kamu untuk menemukan rekan",
  "mesh.radar.in_range": "dalam jangkauan",
  "mesh.radar.recently_seen": "baru terlihat",
  "mesh.radar.peer_hint":
    "Membuka pilihan untuk mengirim pesan atau membayar rekan ini",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "baru saja",
  "mesh.peer.none": "Tidak ada rekan di dekat sini",
  "mesh.peer.none_desc":
    "Perangkat Airhop atau bitchat lain dalam jangkauan Bluetooth muncul di sini.",
  "mesh.peer.id_copied": "ID rekan tersalin",
  "mesh.peer.copy_id": "Salin ID rekan",
  "mesh.peer.their_name": "Memakai nama {name}",
  "mesh.peer.in_range": "Dalam jangkauan",
  "mesh.peer.relay": "Simpul relai",
  "mesh.peer.relay_body":
    "Radio yang seseorang biarkan menyala untuk memperluas mesh. Ia membawa pesan yang tidak bisa dibacanya. Tidak ada orang di sini untuk dikirimi pesan.",
  "mesh.peer.send_dm": "Kirim pesan langsung",
  "mesh.peer.message": "Pesan",
  "mesh.peer.send_sats": "Kirim ecash",
  "mesh.peer.amount_placeholder": "Jumlah dalam sat",
  "mesh.peer.amount_first": "Kirim ecash, isi jumlahnya dulu",
  "mesh.peer.cancel_send": "Batalkan kirim ecash",
  "mesh.peer.view_peer": "Lihat rekan {name}",
  "mesh.peer.view_peer_online": "Lihat rekan {name}, daring",
  "mesh.peer.last_seen": "Terakhir terlihat {ago} lalu",
  "mesh.peer.send_amount": "Kirim {amount} sat",
  "mesh.peer.direct": "Sambungan langsung",
  "mesh.peer.check_distance": "Periksa jarak",
  "mesh.peer.checking": "Memeriksa",
  "mesh.peer.no_reply": "Tidak ada jawaban",
  "mesh.peer.no_reply_hint":
    "Mereka mungkin sudah bergerak, atau aplikasinya tidak menjawab",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Kawasan",
  "mesh.level.province": "Provinsi",
  "mesh.level.city": "Kota",
  "mesh.level.neighborhood": "Lingkungan",
  "mesh.level.block": "Blok kota",
  "mesh.level.building": "Bangunan",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Bisa dibelanjakan",
  "wallet.balance.unit_hint": "Berganti antara satoshi dan bitcoin",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "Penyimpanan dompet terkunci. Bukti ecash disimpan dalam berkas terenkripsi yang kuncinya berada di gantungan kunci perangkat, dan berkas itu tidak bisa dibuka. Buka kunci perangkatmu lalu buka Airhop kembali.",
  "wallet.balance.tor_blocked":
    "Tor menyala, jadi permintaan ke mint diblokir: permintaan itu akan lewat jaringan terbuka dan mengaitkan IP-mu dengan buktimu. Mengirim dan menerima lewat mesh tetap bekerja. Izinkan lalu lintas mint di Pengaturan, Keamanan.",
  "wallet.balance.unconfirmed_note": "{amount} belum dikonfirmasi oleh mint",
  "wallet.balance.reserved_note":
    "{amount} dicadangkan untuk kiriman yang sedang berjalan",
  "wallet.balance.other_mint_note": "{amount} di mint terpisah",
  "wallet.balance.test_mint_note":
    "Termasuk uang mainan dari mint uji coba. Ini bukan bitcoin dan tidak bisa dicairkan.",
  "wallet.token": "Token",
  "wallet.action.send": "Kirim token ecash",
  "wallet.action.send_disabled":
    "Kirim token ecash, tidak tersedia saat saldo kosong",
  "wallet.action.receive": "Terima token ecash",
  "wallet.action.zap": "Zap sebuah kontak Nostr",
  "wallet.action.zap_disabled":
    "Zap sebuah kontak Nostr, tidak tersedia saat saldo kosong",
  "wallet.action.add_mint": "Tambah sebuah mint Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Token tidak bisa dirakit",
  "wallet.send.title": "Kirim ecash",
  "wallet.send.amount_in": "Jumlah dalam {unit}",
  "wallet.send.body":
    "Dirakit luring dari bukti yang sudah kamu pegang. Tidak ada yang meninggalkan saldomu untuk selamanya sampai kamu memastikan tokennya sampai.",
  "wallet.send.stale_fee_note":
    "Biaya terakhir diperiksa {days} hari lalu. Kalau mint ini sudah menaikkannya sejak itu, pengiriman bisa jadi sedikit lebih mahal.",
  "wallet.send.fee_note":
    "{spend} {unit} keluar dari saldomu; tambahan {fee} menutup biaya mint yang seharusnya mereka bayar",
  "wallet.send.qr_too_big":
    "Token ini terbelah ke terlalu banyak koin untuk muat dalam kode QR. Bagikan atau salin saja, atau segarkan di mint untuk menyatukannya.",
  "wallet.send.bearer_note":
    "Siapa pun yang memegang deret ini memiliki uangnya. Buktinya dicadangkan, bukan dibelanjakan: kalau tidak pernah sampai ke siapa pun, kamu bisa menariknya kembali di bagian Tertunda.",
  "wallet.send.qr_too_big_short":
    "Token ini terbelah ke terlalu banyak koin untuk muat dalam kode QR. Bagikan atau salin saja.",
  "wallet.send.scan_note":
    "Minta mereka memindai ini dari dompet mereka. Masih bisa ditarik kembali sampai kamu menandainya terkirim.",
  "wallet.send.mesh_note":
    "Token dikirim sebagai pesan langsung terenkripsi lewat mesh. Tidak butuh internet.",
  "wallet.send.no_peers_note":
    "Buka tab Mesh untuk menemukan perangkat di dekat sini, atau bagikan tokennya dengan cara lain.",
  "wallet.send.send_to": "Kirim ke {name}",
  "wallet.send.memo": "Catatan (opsional, ikut bersama token)",
  "wallet.send.building": "Merakit…",
  "wallet.send.build": "Rakit token",
  "wallet.send.inexact_body":
    "Buktimu tidak bisa membentuk tepat {amount} {unit} secara luring. Token terkecil yang bisa kamu rakit adalah {spend} {unit}, dan saat luring tidak ada kembalian: tambahan {extra} {unit} jatuh ke penerima.\n\nMenyegarkan di mint selagi daring akan memecah buktimu menjadi pecahan yang pas.",
  "wallet.send.send_amount": "Kirim {amount}",
  "wallet.send.sent_to": "{amount} {unit} terkirim ke {name}",
  "wallet.send.sent_to_body":
    "{route} Ini tetap bisa ditarik kembali di bagian Tertunda sampai kamu memastikan mereka menerimanya, atau sampai mint memberi tahu kami bahwa buktinya sudah ditukar.",
  "wallet.send.copy_token": "Salin token",
  "wallet.send.share_token": "Bagikan token",
  "wallet.send.open_in_wallet": "Buka token ini di dompet lain",
  "wallet.send.open_in_wallet_short": "Buka di dompet",
  "wallet.send.to_peer": "Kirim token ke rekan di dekat sini",
  "wallet.send.to_peer_short": "Kirim ke rekan",
  "wallet.send.mark_delivered": "Tandai terkirim lalu selesai",
  "wallet.send.they_got_it": "Mereka menerimanya",
  "wallet.send.keep_pending": "Biarkan kiriman ini tertunda",
  "wallet.send.decide_later": "Putuskan nanti",
  "wallet.send.no_peers": "Tidak ada rekan dalam jangkauan",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Ini pembayaranmu sendiri",
  "wallet.receive.own_payment_body":
    "Koin-koin ini masih dicadangkan untuk kiriman yang belum kamu tuntaskan, jadi tidak ada yang bisa diklaim. Pakai Tarik kembali pada pembayaran itu untuk mengembalikannya langsung ke saldomu.",
  "wallet.receive.already_have": "Sudah ada di dompetmu",
  "wallet.receive.already_have_body":
    "Setiap bukti dalam token ini sudah tersimpan di sini, jadi tidak ada yang bertambah. Saldo tidak berubah.",
  "wallet.receive.stored_unconfirmed":
    "Tersimpan dari {mint}, tetapi belum dikonfirmasi oleh mint ({reason}).",
  "wallet.receive.offline": "luring",
  "wallet.receive.redeemed_here":
    "Ditukar di {mint}. Bukti-bukti ini kini milikmu seorang: salinan pengirim tidak lagi bekerja.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Ditukar di {mint}. Kini terbukti milikmu: salinan token ini di pengirim tidak lagi bekerja.",
  "wallet.receive.stored_pending":
    "Tersimpan dari {mint}, tetapi mint belum memastikan bahwa token ini belum terpakai{dleq}. Segarkan dari tab Dompet begitu kamu daring.",
  "wallet.receive.dleq_inline":
    " (tanda tangannya memang cocok, jadi tokennya asli)",
  "wallet.receive.dleq_ok": "Tanda tangan mint cocok, jadi tokennya asli.",
  "wallet.receive.dleq_uncached":
    "Kunci mint tidak tersimpan di sini, jadi tanda tangannya tidak bisa diperiksa secara luring.",
  "wallet.receive.dleq_warning":
    "Sampai kamu menyegarkannya saat daring, pengirim pada prinsipnya bisa saja sudah membelanjakannya di tempat lain.",
  "wallet.receive.failed": "Tidak bisa menerima",
  "wallet.receive.title": "Terima ecash",
  "wallet.receive.body":
    "Tempel sebuah token Cashu. Saat daring ia langsung ditukar di mint; saat luring ia disimpan dan dikonfirmasi pada penyegaran berikutnya.",
  "wallet.receive.scan": "Pindai kode QR ecash",
  "wallet.receive.scan_short": "Pindai QR",
  "wallet.receive.receiving": "Menerima…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap diterima dari {from}… dan ditukar ke dompetmu.",
  "wallet.zap.title": "Zap sebuah identitas Nostr",
  "wallet.zap.not_npub": "bukan npub",
  "wallet.zap.bad_key": "kunci keliru",
  "wallet.zap.invalid_pubkey": "Kunci publik tidak sah",
  "wallet.zap.invalid_pubkey_body":
    "Masukkan npub1… atau kunci publik Nostr heksadesimal 64 karakter.",
  "wallet.zap.sent": "Nutzap terkirim",
  "wallet.zap.failed": "Zap gagal",
  "wallet.zap.body":
    "Kalau mereka menerbitkan info nutzap NIP-61, ecash-nya dikunci ke kunci mereka sehingga tidak ada orang lain yang bisa membelanjakannya, dan tidak bisa ditarik kembali. Kalau tidak, ia dikirim sebagai token yang bisa ditarik kembali. Kamu akan diberi tahu mana yang terjadi.",
  "wallet.zap.contact": "Zap {name}",
  "wallet.zap.pubkey_placeholder": "npub1… atau heksadesimal 64 karakter",
  "wallet.zap.sending": "Mengirim…",
  "wallet.nostr.copied_body":
    "Berikan ini kepada seseorang dan mereka bisa mengirimimu zap dari Airhop atau dompet Nostr mana pun, tanpa perlu Bluetooth.",
  "wallet.nostr.copy_key":
    "Salin kunci Nostr-mu supaya orang bisa mengirimimu zap",
  "wallet.nostr.your_key": "Kunci Nostr-mu",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mint ditambahkan",
  "wallet.mint.add_failed": "Mint tidak bisa ditambahkan",
  "wallet.mint.added_named": "{name} ditambahkan",
  "wallet.mint.added_body":
    "{mint} menerbitkan {units}. Kuncinya tersimpan di perangkat ini, jadi token darinya kini bisa diperiksa bahkan tanpa internet.",
  "wallet.mint.remove_plain":
    "Singkirkan {mint} dari dompetmu? Kunci yang tersimpan ikut hilang, jadi token darinya tidak lagi bisa diperiksa secara luring.",
  "wallet.mint.title": "Mint",
  "wallet.mint.none": "Belum ada mint",
  "wallet.mint.none_desc":
    "Sebuah mint menerbitkan dan menukar ecash-mu. Tambahkan satu untuk menyetor lewat Lightning, atau cukup terima sebuah token dan mint-nya ditambahkan untukmu.",
  "wallet.mint.add": "Tambah sebuah mint",
  "wallet.mint.add_body":
    "Sebuah mint memegang Bitcoin yang menopang ecash-mu, jadi pilih yang kamu percaya memegang saldo yang kamu simpan di sana. Alamatnya diperiksa sebelum disimpan. Jalankan sendiri dengan Nutshell kalau kamu lebih suka tidak memercayai siapa pun.",
  "wallet.mint.consolidate_body":
    "Sebuah token hanya pernah bisa menyebut satu mint, jadi saldo yang tersebar di beberapa mint tidak bisa membayar jumlah yang lebih besar daripada yang dipegang mint terbesarnya. Airhop bisa memindahkannya: setiap mint lain membayar faktur Lightning yang diterbitkan mint pilihanmu. Ada biaya perutean kecil dan butuh internet.",
  "wallet.mint.add_short": "Tambah mint",
  "wallet.mint.checking": "Memeriksa…",
  "wallet.mint.remove_with_balance": "Singkirkan mint yang punya saldo?",
  "wallet.mint.remove": "Singkirkan mint",
  "wallet.mint.delete_anyway": "Hapus saja",
  "wallet.mint.consolidate": "Pindahkan semua saldo ke satu mint",
  "wallet.mint.confirm_with": "Konfirmasi bukti dengan {mint}",
  "wallet.mint.remove_a11y": "Singkirkan {mint}",
  "wallet.mint.available_amount": "{amount} {unit} tersedia",
  "wallet.mint.split_across":
    "Saldo terbelah di {count} mint. Pindahkan ke satu saja.",
  "wallet.mint.move_everything_to": "Pindahkan semuanya ke {mint}",
  "wallet.mint.consolidate_title": "Pindahkan ke satu mint",
  "wallet.mint.moving": "Memindahkan…",
  "wallet.mint.move": "Pindahkan",
  "wallet.mint.moved": "Dipindahkan",
  "wallet.mint.moved_body":
    "{amount} {unit} kini berada di {mint}, setelah {fees} {unit} biaya perutean Lightning.",
  "wallet.mint.nothing_moved": "Tidak ada yang dipindahkan",
  "wallet.mint.destination": "· tujuan",
  "wallet.mint.will_move": "· akan dipindahkan",
  "wallet.mint.issued_by": "Diterbitkan oleh",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Isi ulang dompet Airhop",
  "wallet.ln.invoice_failed": "Faktur tidak bisa dibuat",
  "wallet.ln.price_failed": "Faktur ini tidak bisa dihitung harganya",
  "wallet.ln.paid": "Terbayar",
  "wallet.ln.deposit_credited":
    "Faktur terbayar dan {amount} {unit} diterbitkan oleh {mint}. Saldo ini sudah dikonfirmasi: kamu bisa langsung membelanjakannya secara luring.",
  "wallet.ln.withdrawn":
    "{paid} sat terbayar lewat Lightning. Mint menarik {fee} sat sebagai biaya perutean.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sat terbayar lewat Lightning. Mint menarik {fee} sat sebagai biaya perutean, lalu mengembalikan {change} sat dari cadangan ke saldomu.",
  "wallet.ln.payment_failed": "Pembayaran gagal",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Ubah sat Lightning menjadi ecash yang bisa kamu belanjakan secara luring, atau cairkan ecash ke faktur Lightning mana pun. Keduanya butuh internet dan sebuah mint.",
  "wallet.ln.deposit_body":
    "Mint memberimu sebuah faktur. Bayar dari dompet Lightning mana pun dan sat-nya kembali sebagai ecash yang bisa kamu belanjakan secara luring.",
  "wallet.ln.pay_invoice_for":
    "Bayar faktur ini sebesar {amount} {unit}. Dompet sedang mengawasi pembayarannya dan akan menerbitkan ecash-mu dengan sendirinya.",
  "wallet.ln.expired_body":
    "Faktur ini kedaluwarsa. Kalau kamu sudah membayarnya, saldonya dikreditkan dengan sendirinya.",
  "wallet.ln.waiting_expires":
    "Menunggu pembayaran · kedaluwarsa dalam {countdown}",
  "wallet.ln.withdraw_body":
    "Tempel sebuah faktur bolt11 dan mint akan membayarnya dari ecash-mu. Cadangan peruteannya diberitahukan lebih dulu; sisa yang tidak terpakai perutean kembali ke saldomu.",
  "wallet.ln.up_to": "sampai {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Bayar {amount} {unit}",
  "wallet.ln.deposit": "Setor sat lewat Lightning",
  "wallet.ln.deposit_short": "Setor",
  "wallet.ln.withdraw": "Tarik ke sebuah faktur Lightning",
  "wallet.ln.withdraw_short": "Tarik",
  "wallet.ln.deposit_title": "Setor lewat Lightning",
  "wallet.ln.amount_placeholder": "Jumlah dalam sat",
  "wallet.ln.requesting": "Meminta…",
  "wallet.ln.get_invoice": "Ambil faktur",
  "wallet.ln.copy_invoice": "Salin faktur",
  "wallet.ln.open_wallet": "Buka di dompet Lightning",
  "wallet.ln.open_wallet_short": "Buka di dompet",
  "wallet.ln.waiting": "Menunggu pembayaran…",
  "wallet.ln.new_invoice": "Buat faktur baru",
  "wallet.ln.new_invoice_short": "Faktur baru",
  "wallet.ln.withdraw_title": "Tarik ke Lightning",
  "wallet.ln.scan_invoice": "Pindai kode QR faktur Lightning",
  "wallet.ln.paid_from": "Dibayar dari",
  "wallet.ln.invoice": "Faktur",
  "wallet.ln.routing_reserve": "Cadangan perutean",
  "wallet.ln.reserved": "Dicadangkan dari saldo",
  "wallet.ln.paying": "Membayar…",
  "wallet.ln.get_quote": "Ambil penawaran",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Cadangan",
  "wallet.backup.setup_failed": "Cadangan tidak bisa disiapkan",
  "wallet.backup.on": "Cadangan menyala",
  "wallet.backup.on_body":
    "Saldomu kini bisa dibangun ulang dari dua belas kata itu.\n\nApa pun yang diberikan orang lain kepadamu berada di luar frasa itu sampai kamu menyegarkannya di mint, dan pemulihan butuh daftar mint-mu, jadi simpan daftarnya tertulis di samping kata-katanya.",
  "wallet.backup.no_phrase": "Tidak ada frasa tersimpan",
  "wallet.backup.no_phrase_body":
    "Frasa pemulihan tidak bisa dibaca dari gantungan kunci perangkat. Buka kunci perangkat lalu coba lagi.",
  "wallet.backup.replace_title": "Ganti frasamu yang sekarang?",
  "wallet.backup.replace_body":
    "Kamu sudah punya frasa pemulihan. Memulihkan frasa lain akan menggantikannya. Koin yang sudah dicakup frasa lama tetap bisa dibelanjakan di perangkat ini, tetapi berhenti bisa dipulihkan, jadi pastikan kata-kata lamanya sudah tertulis sebelum kamu lanjut.",
  "wallet.backup.replace": "Ganti",
  "wallet.backup.invalid_phrase": "Frasa itu tidak sah",
  "wallet.backup.invalid_phrase_body":
    "Frasa ini punya jumlah periksa bawaan dan yang satu ini tidak lolos. Cari kata yang salah ketik, hilang, atau tertukar.",
  "wallet.backup.not_bip39":
    "Ini bukan kata BIP-39: {words}. Periksa ejaannya.",
  "wallet.backup.add_mint_first": "Tambahkan sebuah mint dulu",
  "wallet.backup.add_mint_first_body":
    "Pemulihan bekerja dengan menanyai sebuah mint koin mana yang ditandatanganinya untukmu, jadi ia perlu tahu mint mana yang harus ditanya. Tambahkan mint yang dulu kamu pakai, lalu pulihkan.",
  "wallet.backup.restore_failed": "Pemulihan gagal",
  "wallet.backup.phrase": "Frasa pemulihan",
  "wallet.backup.state_unconfirmed": "Cadangan menyala tetapi belum dipastikan",
  "wallet.backup.state_off": "Cadangan mati",
  "wallet.backup.badge_on": "Nyala",
  "wallet.backup.badge_unconfirmed": "Belum dipastikan",
  "wallet.backup.badge_off": "Mati",
  "wallet.backup.view": "Lihat frasa pemulihan",
  "wallet.backup.setup": "Siapkan frasa pemulihan",
  "wallet.backup.view_short": "Lihat frasa",
  "wallet.backup.setup_short": "Siapkan",
  "wallet.backup.restore": "Pulihkan dompet dari frasa pemulihan",
  "wallet.backup.restore_short": "Pulihkan",
  "wallet.backup.setup_title": "Siapkan sebuah frasa pemulihan",
  "wallet.backup.on_body_short":
    "Saldomu bisa dibangun ulang di perangkat baru dari dua belas katamu.",
  "wallet.backup.unconfirmed_body":
    "Kamu belum pernah memastikan adanya salinan tertulis. Saat ini kata-katanya hanya ada di ponsel ini, padahal itulah satu hal yang seharusnya bisa dilewati sebuah cadangan. Lihat frasanya lalu tuliskan.",
  "wallet.backup.not_covered":
    "{amount} belum tercakup. Koin yang diberikan kepadamu membawa rahasia pengirimnya, jadi baru masuk ke bawah frasamu setelah ditukar. Segarkan sebuah mint untuk mengamankannya.",
  "wallet.backup.off_body":
    "Ecash-mu hanya ada di ponsel ini. Kalau kamu kehilangannya, tidak ada yang bisa memulihkan uangnya, termasuk kamu. Frasa pemulihan adalah dua belas kata yang bisa membangun ulang saldomu di mana saja.",
  "wallet.backup.about_to_see":
    "Kamu akan melihat dua belas kata. Kata-kata itulah uangnya.",
  "wallet.backup.exact_order":
    "Dua belas kata, tepat dalam urutan ini. Siapa pun yang memilikinya memiliki saldomu.",
  "wallet.backup.verify_body":
    "Frasa yang tidak ditulis siapa pun lebih buruk daripada tidak punya frasa, karena tampak seperti jaring pengaman yang sebenarnya tidak ada. Dua kata untuk memastikan.",
  "wallet.backup.verify_mismatch":
    "Itu tidak cocok. Periksa salinan tertulismu.",
  "wallet.backup.restore_body":
    "Masukkan dua belas katanya. Airhop menurunkan ulang koinmu lalu menanyai setiap mint koin mana yang ditandatanganinya, sehingga saldonya kembali dari catatan yang disimpan mint.",
  "wallet.backup.warn_secret":
    "Siapa pun yang membacanya bisa mengambil saldomu. Jangan memotretnya dan jangan menyimpannya di ponsel ini.",
  "wallet.backup.warn_paper":
    "Tulis di kertas lalu simpan di tempat yang aman. Airhop tidak bisa menunjukkannya lagi kalau ponselnya hilang.",
  "wallet.backup.warn_scope":
    "Kata-kata itu hanya membangun ulang ecash-mu. Identitas, obrolan, dan kontakmu tidak tercakup.",
  "wallet.backup.warn_mints":
    "Pemulihan harus menanyai sebuah mint koin mana yang ditandatanganinya, jadi tulis daftar mint-mu di samping kata-katanya.",
  "wallet.backup.preparing": "Menyiapkan…",
  "wallet.backup.show_phrase": "Tampilkan frasaku",
  "wallet.backup.your_phrase": "Frasa pemulihanmu",
  "wallet.backup.write_down": "Tuliskan ini",
  "wallet.backup.copy_phrase": "Salin frasa pemulihan ke papan klip",
  "wallet.backup.copy_clipboard": "Salin ke papan klip",
  "wallet.backup.written_down": "Saya sudah menuliskannya",
  "wallet.backup.check_copy": "Periksa salinanmu",
  "wallet.backup.confirm": "Pastikan",
  "wallet.backup.restore_title": "Pulihkan dari sebuah frasa",
  "wallet.backup.phrase_placeholder": "dua belas kata, dipisahkan spasi",
  "wallet.backup.no_mints_yet":
    "Belum ada mint yang ditambahkan. Pemulihan harus menanyai mint tertentu, jadi tambahkan dulu yang dulu kamu pakai.",
  "wallet.backup.scanning": "Menelusuri…",
  "wallet.backup.restore_progress": "{mint} · set kunci {step} dari {total}",
  "wallet.backup.will_scan":
    "Akan ditelusuri: {mints}. Mint yang belum kamu tambahkan tidak pernah ditanya, jadi saldonya tetap tak terlihat.",
  "wallet.backup.word_n": "Kata {position}",
  "wallet.backup.unreachable_mints":
    "Tidak bisa menjangkau: {mints}. Saldo di sana masih ada. Coba lagi saat sambunganmu lebih baik.",
  "wallet.backup.nothing_recovered":
    "Tidak ada yang dipulihkan dari mint yang ditelusuri.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Tandai sudah diterima?",
  "wallet.delivered.body":
    "Ini melepaskan {amount} {unit} untuk selamanya. Kalau ternyata tidak pernah sampai, kamu tidak akan bisa menariknya kembali.",
  "wallet.delivered.body_generic":
    "Ini melepaskan jumlah yang dicadangkan untuk selamanya. Kalau ternyata tidak pernah sampai, kamu tidak akan bisa menariknya kembali.",
  "wallet.delivered.cancel": "Belum",
  "wallet.delivered.confirm": "Mereka menerimanya",
  "wallet.reclaim.title": "Tarik kembali token ini?",
  "wallet.reclaim.body":
    "{amount} {unit} kembali ke saldomu. Lakukan ini hanya kalau tokennya tidak pernah sampai ke siapa pun: kalau deretnya sudah ada pada mereka, siapa pun yang lebih dulu menukarkannya di mint akan memegang uangnya, dan itu bisa saja mereka.",
  "wallet.reclaim.keep": "Biarkan tertunda",
  "wallet.reclaim.confirm": "Tarik kembali",
  "wallet.copied.token_body":
    "Tokennya ada di papan klipmu. Ia tetap dicadangkan di sini sampai kamu menandainya terkirim, jadi kamu bisa menempelnya lagi kalau percobaan pertama gagal.",
  "wallet.copied.phrase_body":
    "Tempel ke pengelola kata sandi, lalu bersihkan papan klipmu. Aplikasi lain bisa membaca papan klip, dan pada sebagian pengaturan ia tersinkron ke perangkatmu yang lain.",
  "wallet.refresh.failed": "Penyegaran gagal",
  "wallet.refresh.partly": "Tersegarkan sebagian",
  "wallet.refresh.done": "Tersegarkan",
  "wallet.refresh.unreachable":
    "Tidak bisa menjangkau {mints}. Selebihnya sudah mutakhir.",
  "wallet.refresh.swapped":
    "{amount} {unit} dikonfirmasi dan ditukar dengan bukti baru.",
  "wallet.refresh.secured":
    "{amount} {unit} kini tercakup oleh frasa pemulihanmu.",
  "wallet.refresh.all_confirmed":
    "Semua yang ada di sini sudah dikonfirmasi oleh mint.",
  "wallet.pending.title": "Tertunda",
  "wallet.pending.reserved_desc":
    "Dirakit dan dicadangkan, pengirimannya belum dipastikan. Buktinya ditahan di luar saldomu supaya tidak bisa dibelanjakan dua kali.",
  "wallet.pending.locked_desc":
    "Sudah dikunci ke kunci penerima, jadi hanya mereka yang bisa membelanjakannya. Hanya saja belum sampai ke mereka. Bagikan tokennya untuk menuntaskannya.",
  "wallet.pending.show_qr": "Tampilkan token ini sebagai kode QR",
  "wallet.pending.copy_again": "Salin lagi tokennya",
  "wallet.pending.share_again": "Bagikan lagi tokennya",
  "wallet.pending.mark_delivered": "Tandai token ini sudah terkirim",
  "wallet.pending.delivered": "Terkirim",
  "wallet.pending.reclaim_into": "Tarik token ini kembali ke saldomu",
  "wallet.activity.title": "Aktivitas",
  "wallet.activity.none": "Belum ada apa-apa",
  "wallet.activity.none_desc":
    "Pembayaran yang kamu kirim dan terima muncul di sini, terbaru lebih dulu, lengkap dengan mint dan biaya masing-masing.",
  "wallet.activity.show_fewer": "Tampilkan lebih sedikit pembayaran",
  "wallet.activity.show_less": "Tampilkan lebih sedikit",
  "wallet.activity.received_unconfirmed": "Diterima, belum dikonfirmasi",
  "wallet.activity.received": "Diterima",
  "wallet.activity.receive_failed": "Penerimaan gagal",
  "wallet.activity.reclaimed": "Ditarik kembali",
  "wallet.activity.send_failed": "Pengiriman gagal",
  "wallet.activity.sent": "Terkirim",
  "wallet.activity.status_pending": "tertunda",
  "wallet.activity.status_failed": "gagal",
  "wallet.activity.status_reclaimed": "ditarik kembali",
  "wallet.activity.status_expired": "kedaluwarsa",
  "wallet.activity.ln_deposit": "Setoran Lightning",
  "wallet.activity.ln_withdrawal": "Penarikan Lightning",
  "wallet.activity.nutzap_received": "Nutzap diterima",
  "wallet.activity.spent_removed": "Bukti terpakai disingkirkan",
  "wallet.activity.refreshed": "Bukti tersegarkan",
  "wallet.activity.refreshing": "Menyegarkan bukti",
  "wallet.activity.just_now": "baru saja",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh luring",
  "wallet.mesh_offline_body":
    "Layanan mesh tidak berjalan, jadi tidak ada yang bisa diserahi tokennya. Ia tetap dicadangkan di bagian Tertunda.",
  "wallet.xfer.route_mesh":
    "Diserahkan langsung ke perangkat mereka lewat mesh.",
  "wallet.xfer.route_nostr":
    "Mereka di luar jangkauan Bluetooth, jadi ia lewat internet.",
  "wallet.xfer.route_courier":
    "Saat ini tidak ada jalur ke mereka. Perangkat lain akan membawanya dan mengantarkannya begitu ada yang sampai ke mereka.",
  "wallet.xfer.route_queued":
    "Mereka belum bisa dijangkau. Ia mengantre dan akan berangkat begitu mereka bisa dijangkau.",
  "wallet.xfer.mesh_offline_body":
    "Layanan mesh tidak berjalan, jadi tidak ada cara menyerahkan tokennya. Tidak ada yang dipotong.",
  "wallet.xfer.could_not_send": "Tidak bisa mengirim",
  "wallet.xfer.inexact_body":
    "Buktimu tidak bisa membentuk tepat {amount} {unit} secara luring. Token terkecil yang bisa kamu rakit adalah {spend} {unit}, dan tambahan {extra} {unit} jatuh ke mereka tanpa cara untuk mengambilnya kembali.\n\nMenyegarkan di mint selagi daring akan memecah buktimu menjadi pecahan yang pas.",
  "wallet.xfer.send_amount": "Kirim {amount}",
  "wallet.xfer.mesh_offline": "Mesh luring",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Dikunci ke kunci mereka dan diterbitkan ke Nostr. Ini milik mereka, daring atau tidak.",
  "wallet.pay.rail_nutzap_dm":
    "Dikunci ke kunci mereka. Relai tidak mau menerimanya, jadi ia dikirim ke mereka sebagai pesan.",
  "wallet.pay.rail_nutzap_undelivered":
    "Dikunci ke kunci mereka, tetapi belum ada yang bisa membawanya. Ia mengantre, dan tokennya ada di bagian Tertunda.",
  "wallet.pay.final":
    "Pembayaran yang terkunci tidak bisa ditarik kembali: kini hanya kunci mereka yang bisa membelanjakan koin-koin ini.",
  "wallet.pay.reclaimable":
    "Ia tetap bisa ditarik kembali dari tab Dompet sampai kamu memastikan bahwa ia sampai.",
  "wallet.pay.why": "Dikirim lewat jalur ini karena {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} ke {name}",
  "wallet.pay.thread_receipt":
    "Kamu mengirim {amount} {unit}, terkunci ke kunci mereka.",
  "wallet.pay.title": "Kirim ecash",
  "wallet.pay.to": "Ke {name}",
  "wallet.pay.amount": "Jumlah dalam sat",
  "wallet.pay.memo": "Catatan (opsional, terbuka untuk umum)",
  "wallet.pay.send": "Kirim",
  "wallet.pay.sending": "Mengirim…",
  "wallet.pay.action": "Kirim ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Akses kamera",
  "wallet.scan.camera_purpose": "memindai kode QR ecash",
  "wallet.scan.photo_label": "Akses foto",
  "wallet.scan.photo_purpose": "membaca QR ecash dari sebuah gambar",
  "wallet.scan.no_token": "Tidak ada token ecash pada gambar itu.",
  "wallet.scan.no_invoice": "Tidak ada faktur Lightning pada gambar itu.",
  "wallet.scan.unreadable": "Gambar itu tidak bisa dibaca.",
  "wallet.scan.camera_failed":
    "Kamera tidak bisa dinyalakan. Tutup aplikasi kamera lain lalu coba lagi.",
  "wallet.scan.close": "Tutup pemindai",
  "wallet.scan.on_device":
    "Ia dibaca di perangkat ini; tidak ada yang dikirim ke mana pun.",
  "wallet.scan.aim_token": "Arahkan ke kode QR ecash.",
  "wallet.scan.aim_invoice": "Arahkan ke kode QR faktur Lightning.",
  "wallet.scan.title_token": "Pindai ecash",
  "wallet.scan.title_invoice": "Pindai faktur",
  "wallet.scan.desc_token":
    "Baca token Cashu dari dompet lain. Bekerja dengan dompet Cashu mana pun, bukan hanya Airhop.",
  "wallet.scan.desc_invoice":
    "Baca faktur Lightning untuk membayarnya dari saldomu.",
  "wallet.scan.use_camera_a11y": "Pindai dengan kamera",
  "wallet.scan.use_camera": "Pakai kamera",
  "wallet.scan.pick_image_a11y": "Baca kode QR dari gambar tersimpan",
  "wallet.scan.pick_image": "Pilih dari foto",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Apa itu Cashu?",
  "wallet.explain.intro":
    "Cashu adalah ecash untuk Bitcoin. Sebuah token adalah deret yang bernilai uang bagi siapa pun yang memegangnya, ditandatangani secara buta oleh mint sehingga mint tidak bisa tahu siapa membelanjakan apa. Tanpa akun, tanpa masuk.",
  "wallet.explain.send": "Kirim",
  "wallet.explain.send_desc":
    "Mengubah sejumlah nilai menjadi token yang bisa kamu serahkan ke rekan di dekat sini lewat Bluetooth, atau kamu bagikan sebagai teks. Bekerja tanpa internet. Buktinya tetap dicadangkan sampai kamu memastikan ia sampai.",
  "wallet.explain.receive": "Terima",
  "wallet.explain.receive_desc":
    "Tempel sebuah token untuk menambahkannya. Saat daring ia langsung ditukar di mint, yang membuatnya terbukti milikmu. Saat luring ia disimpan dan ditandai belum dikonfirmasi sampai kamu menyegarkannya.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Membayar sebuah identitas Nostr. Kalau mereka menerbitkan info nutzap NIP-61, ecash-nya dikunci ke kunci mereka sehingga hanya mereka yang bisa membelanjakannya. Kalau tidak, ia jatuh kembali ke pesan langsung terenkripsi. Butuh internet.",
  "wallet.explain.add_mint": "Tambah mint",
  "wallet.explain.add_mint_desc":
    "Menyimpan mint yang menerbitkan dan menukar ecash-mu, serta menyimpan kunci publiknya supaya token darinya bisa diperiksa secara luring. Pilih mint yang kamu percaya memegang saldo yang kamu simpan di sana.",
  "wallet.explain.phrase": "Frasa pemulihan",
  "wallet.explain.phrase_desc":
    "Koinmu diturunkan dari dua belas kata yang dibuat dompet di awal, sehingga ponsel baru bisa membangun ulang saldonya dengan menanyai mint-mu koin mana yang mereka tandatangani. Sampai kamu melihat dan menuliskannya, kata-kata itu hanya ada di ponsel ini.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Dompet terkunci",
  "wallet.err.mint_unreachable": "Mint tak terjangkau",
  "wallet.err.tor_blocked": "Diblokir selagi Tor menyala",
  "wallet.err.insufficient": "Saldo tidak cukup",
  "wallet.err.exact_amount": "Tidak bisa mengirim jumlah setepat itu",
  "wallet.err.no_mint": "Tidak ada mint",
  "wallet.err.mint_unsupported": "Mint tidak bisa melakukannya",
  "wallet.err.mint_refused": "Mint menolak",
  "wallet.err.unreadable": "Token tak terbaca",
  "wallet.err.rejected": "Token ditolak",
  "wallet.err.already_spent": "Sudah terpakai",
  "wallet.err.change_pending": "Terbayar, kembalian tertunda",
  "wallet.svc.mint_unreachable": "Mint tidak bisa dijangkau.",
  "wallet.svc.tor_ios": "Permintaan ke mint tidak lewat Tor di iOS.",
  "wallet.svc.tor_ios_body":
    "Arti hanya membungkus WebSocket Nostr, jadi permintaan ini akan mencapai mint lewat jaringan terbuka dan mengaitkan IP-mu dengan bukti-bukti ini. Izinkan di Pengaturan > Keamanan, atau matikan Tor dulu. Mengirim dan menerima ecash lewat mesh tetap bekerja.",
  "wallet.svc.tor_paused": "Tor menyala tapi tidak terhubung.",
  "wallet.svc.tor_paused_body":
    "Orbot berhenti merutekan, jadi permintaan ini akan mencapai mint lewat jaringan terbuka dan mengaitkan IP-mu dengan bukti-bukti ini. Nyalakan lagi Orbot, atau matikan Tor. Mengirim dan menerima ecash lewat mesh tetap bekerja.",
  "wallet.svc.keys_uncached":
    "Kunci mint ini tidak tersimpan di perangkat ini.",
  "wallet.svc.keys_uncached_body":
    "Buka dompet sekali selagi daring untuk mengambilnya.",
  "wallet.svc.phrase_invalid": "Frasa pemulihan itu tidak sah.",
  "wallet.svc.phrase_invalid_body":
    "Cari kata yang salah ketik atau hilang. Frasa ini punya jumlah periksa bawaan, jadi satu kata yang keliru membuat keseluruhannya tidak sah.",
  "wallet.svc.need_mint": "Tambahkan setidaknya satu mint dulu.",
  "wallet.svc.need_mint_body":
    "Pemulihan bekerja dengan menanyai sebuah mint koin mana yang ditandatanganinya untukmu, jadi ia perlu tahu mint mana yang harus ditanya.",
  "wallet.svc.restored": "Dipulihkan dari frasa pemulihan",
  "wallet.svc.storage_locked": "Penyimpanan dompet terkunci.",
  "wallet.svc.storage_locked_body":
    "Airhop menyimpan bukti ecash dalam berkas terenkripsi yang kuncinya berada di gantungan kunci perangkat. Buka kunci perangkat lalu buka aplikasinya kembali.",
  "wallet.svc.bad_url": "Itu bukan alamat yang sah.",
  "wallet.svc.needs_https": "Alamat sebuah mint harus diawali https://.",
  "wallet.svc.refuse_http": "Kami menolak memakai mint lewat http polos.",
  "wallet.svc.refuse_http_body":
    "Siapa pun di jalur jaringan bisa membaca atau mengubah buktimu. Pakai mint dengan https://.",
  "wallet.svc.mint_not_saved": "Mint tidak bisa disimpan.",
  "wallet.svc.unreadable_token": "Itu bukan token Cashu yang terbaca.",
  "wallet.svc.unreadable_token_body":
    "Token diawali cashuA atau cashuB. Pastikan tidak ada yang terpotong saat disalin.",
  "wallet.svc.wrong_mint":
    "Token ini tidak ditandatangani oleh mint yang disebutnya.",
  "wallet.svc.already_spent": "Bukti-bukti ini sudah terpakai.",
  "wallet.svc.already_spent_body":
    "Pengirim token ini menukarkannya lebih dulu, atau mengirim token yang sama ke orang lain juga.",
  "wallet.svc.receiving_offline": "menerima secara luring",
  "wallet.svc.amount_positive": "Masukkan jumlah yang lebih besar dari nol.",
  "wallet.svc.coins_raced":
    "Koin-koin itu baru saja terpakai oleh pembayaran lain.",
  "wallet.svc.coins_raced_body":
    "Tidak ada yang dipotong. Coba lagi dan dompet akan memilih kumpulan yang berbeda.",
  "wallet.svc.no_ecash": "Belum ada ecash.",
  "wallet.svc.no_ecash_body":
    "Tambahkan sebuah mint lalu setor lewat Lightning, atau terima token dari seseorang.",
  "wallet.svc.split_across_mints": "Saldomu terbelah di beberapa mint.",
  "wallet.svc.mint_says_spent":
    "Mint melaporkan bukti-bukti ini sudah terpakai.",
  "wallet.svc.issue_against_invoice":
    "menerbitkan ecash atas sebuah faktur Lightning",
  "wallet.svc.pay_invoice": "membayar sebuah faktur Lightning",
  "wallet.svc.unknown_deposit": "Setoran tidak dikenal.",
  "wallet.svc.invoice_expired_before":
    "Fakturnya kedaluwarsa sebelum terbayar.",
  "wallet.svc.invoice_expired": "Faktur itu kedaluwarsa.",
  "wallet.svc.invoice_unpaid": "Fakturnya belum terbayar.",
  "wallet.svc.payment_unknown":
    "Status pembayaran tidak diketahui; diperiksa lagi pada penyegaran berikutnya.",
  "wallet.svc.melt_change_pending": "Fakturmu sudah terbayar.",
  "wallet.svc.melt_change_pending_body":
    "Mint belum mengembalikan biaya perutean yang tidak terpakai. Ia diambil dengan sendirinya pada penyegaran berikutnya, dan tidak ada yang hilang sementara itu.",
  "wallet.svc.mint_did_not_pay":
    "Mint tidak membayar faktur ini. Saldomu tidak berubah.",
  "wallet.svc.not_an_invoice": "Itu bukan faktur Lightning.",
  "wallet.svc.not_an_invoice_body": "Tempel faktur bolt11 yang diawali lnbc.",
  "wallet.svc.insufficient_for_invoice": "Saldo tidak cukup untuk faktur ini.",
  "wallet.svc.coins_raced_invoice_body":
    "Tidak ada yang dipotong dan fakturnya tidak terbayar. Coba lagi.",
  "wallet.svc.same_mint": "Pilih mint tujuan yang berbeda.",
  "wallet.svc.same_mint_body":
    "Sumber dan tujuannya mint yang sama, jadi tidak ada yang perlu dipindahkan.",
  "wallet.svc.quote_failed_retried": "Penawaran gagal, penyatuan dicoba lagi",
  "wallet.svc.amount_unfit_retried":
    "Jumlahnya tidak pas, penyatuan dicoba lagi",
  "wallet.svc.cannot_size": "Ukuran pemindahan ini tidak bisa ditentukan.",
  "wallet.svc.insufficient_at_mint": "Saldo tidak cukup di {mint}.",
  "wallet.svc.inexact_title":
    "Buktimu tidak bisa membentuk tepat {amount} {unit} secara luring.",
  "wallet.svc.inexact_detail":
    "Token terkecil yang bisa kamu kirim adalah {spend} {unit}. Saat luring tidak ada kembalian, jadi tambahan {extra} {unit} jatuh ke penerima.",
  "wallet.svc.no_single_mint":
    "Tidak ada satu pun mint yang memegang {amount} {unit}. Ecash dari mint berbeda tidak bisa digabung ke dalam satu token: satukan dulu di satu mint, atau kirim dalam jumlah terpisah.",
  "wallet.svc.have_tried_send":
    "Kamu punya {total} {unit}, dan mencoba mengirim {amount}.",
  "wallet.svc.invoice_needs":
    "Faktur ini butuh {total} {unit} termasuk cadangan perutean, sedangkan kamu punya {balance}.",
  "wallet.svc.nothing_to_move": "{mint} tidak punya {unit} untuk dipindahkan.",
  "wallet.svc.consolidate_memo": "Penyatuan dari {mint}",
  "wallet.svc.cannot_size_detail":
    "Setelah biaya perutean Lightning, {from} tidak bisa memindahkan jumlah yang berguna ke {to}. Coba pindahkan jumlah tertentu yang lebih kecil.",
  "wallet.svc.mint_cannot": "{mint} tidak bisa {action}.",
  "wallet.svc.no_nut": "Mint tidak mengumumkan NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Pembayaran itu menyebut mint yang tidak kamu pakai.",
  "wallet.svc.unknown_mint_body":
    "Tambahkan sendiri mint-nya kalau kamu memercayainya; tidak ada yang ditukar di mint yang tidak kamu pilih.",
  "wallet.svc.no_relay": "tidak ada sambungan relai",
  "wallet.svc.no_shared_mint": "tidak ada mint bersama dengan saldo yang cukup",
  "wallet.svc.no_nutzap_info":
    "penerima belum menerbitkan info nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Terkunci ke kunci mereka tetapi belum terkirim. Bagikan token dari transaksi ini untuk menuntaskannya.",
  "wallet.svc.swap_lost":
    "Mint tidak pernah menuntaskan penukaran ini, jadi tidak ada yang diterbitkan atasnya.",
  "wallet.svc.swap_unreadable":
    "Penukaran ini tersimpan dalam bentuk yang tidak bisa diputar ulang oleh versi ini.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Terverifikasi lewat QR",
  "contacts.qr.keys_unverified": "Kunci diterima, belum diverifikasi",
  "contacts.qr.not_verified": "Belum diverifikasi",
  "contacts.qr.message": "Pesan",
  "contacts.qr.add": "Tambah kontak",
  "contacts.qr.scan_title": "Pindai kode QR",
  "contacts.qr.aim": "Arahkan kameramu ke kode QR mereka",
  "contacts.qr.add_desc":
    "Jangkau seseorang yang tidak ada di dekat sini pada mesh.",
  "contacts.qr.peer_id_hint":
    "ID rekan terdiri dari 16 karakter. Kode kontak diawali airhop:.",
  "contacts.qr.or_scan": "atau pindai QR mereka",
  "contacts.qr.trust_note":
    "Hanya QR yang kamu pindai dengan kamera yang memverifikasi kunci mereka. Kode yang ditempel membawa kunci mereka tetapi bukan bukti bahwa kode itu berasal dari mereka.",
  "contacts.qr.peer_id": "ID rekan atau kode kontak",
  "contacts.qr.peer_id_placeholder": "Tempel sebuah ID atau kode kontak",
  "contacts.qr.scan_camera_a11y": "Pindai kode QR dengan kamera",
  "contacts.qr.scan_camera_desc": "Pakai kameramu",
  "contacts.qr.upload_a11y": "Unggah gambar QR dari galeri",
  "contacts.qr.upload": "Unggah dari galeri",
  "contacts.qr.upload_desc": "Pilih gambar QR yang tersimpan",
  "contacts.qr.scan_a11y": "Tambah kontak dengan memindai kode QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Tempel ID rekan 16 karakter, tautan airhop://peer/…, atau kode kontak.",
  "contacts.scan.camera_label": "Akses kamera",
  "contacts.scan.camera_purpose": "memindai kode QR sebuah kontak",
  "contacts.scan.camera_needed":
    "Akses kamera diperlukan untuk memindai. Kamu tetap bisa menambah lewat ID rekan.",
  "contacts.scan.camera_failed":
    "Kamera tidak bisa dinyalakan. Tutup aplikasi kamera lain lalu coba lagi.",
  "contacts.scan.photo_label": "Akses foto",
  "contacts.scan.photo_purpose": "memindai kode QR yang sudah kamu simpan",
  "contacts.scan.photo_needed":
    "Akses foto diperlukan untuk memilih gambar. Kamu tetap bisa menambah lewat ID rekan.",
  "contacts.scan.no_qr": "Tidak ada kode QR Airhop pada gambar itu.",
  "contacts.scan.unreadable": "Tidak bisa membaca kode QR dari gambar itu.",
  "contacts.scan.bitchat_expired":
    "Kode bitchat itu sudah kedaluwarsa. Minta mereka membuka QR mereka lagi.",
  "contacts.scan.tampered":
    "Kode QR ini tidak sah: ID rekannya tidak cocok dengan kuncinya. Kode itu mungkin sudah diutak-atik.",
  "contacts.scan.already_added": "Sudah ada di kontakmu",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Menunggu akses kamera…",
  "contacts.verify.camera_off": "Kamera mati",
  "contacts.verify.open_settings": "Buka Pengaturan",
  "contacts.verify.verified": "Terverifikasi",
  "contacts.verify.different": "Kontak berbeda",
  "contacts.verify.scan_again": "Pindai lagi",
  "contacts.verify.failed": "Tidak bisa diverifikasi",
  "contacts.verify.done": "Selesai",
  "contacts.verify.title": "Verifikasi {name}",
  "contacts.verify.aim": "Arahkan kameramu ke kode QR mereka",
  "contacts.verify.camera_off_body":
    "Nyalakan akses kamera di Pengaturan untuk memverifikasi lewat QR.",
  "contacts.verify.match_body":
    "Kunci {name} cocok. Kamu bisa memercayai kontak ini.",
  "contacts.verify.different_body":
    "QR ini milik orang lain. Minta {name} menunjukkan kodenya sendiri.",
  "contacts.verify.tampered_body":
    "QR ini tampak diutak-atik: ID-nya tidak cocok dengan kuncinya.",
  "contacts.verify.choose_title": "Bagaimana kamu ingin memeriksanya?",
  "contacts.verify.choose_body":
    "Keduanya memastikan bahwa kunci di ponsel ini benar-benar milik {name}.",
  "contacts.verify.method_scan": "Pindai kode mereka",
  "contacts.verify.method_scan_sub": "Mereka ada bersamamu",
  "contacts.verify.method_compare": "Bandingkan sebuah kode",
  "contacts.verify.method_compare_sub": "Bacakan satu sama lain lewat telepon",
  "contacts.verify.no_keys":
    "Belum ada kunci untuk kontak ini. Kirimi mereka pesan, atau pindai kode mereka saat bertemu.",
  "contacts.verify.compare_title": "Bacakan ini satu sama lain",
  "contacts.verify.compare_body":
    "{name} melihat enam kata yang sama. Kalau cocok, kalian berdua tahu kuncinya asli.",
  "contacts.verify.codes_match": "Ini cocok",
  "contacts.verify.codes_differ": "Tidak cocok",
  "contacts.verify.compared_body":
    "Kamu dan {name} memastikan kode yang sama. Kontak ini terverifikasi.",

  // ---- Settings: shared chrome ----
  "settings.back": "Kembali",
  "settings.coming_soon": "Segera hadir",
  "settings.opens_externally": "{label}, terbuka di luar aplikasi",
  "settings.peer_id": "ID rekan",
  "settings.share_peer_id": "Bagikan ID rekanmu",
  "settings.share_id_short": "Bagikan ID",
  "settings.peer_id_sheet.title": "ID rekanmu",
  "settings.peer_id_sheet.copy": "Salin ID rekan",
  "settings.peer_id_sheet.note":
    "Ini hanya bekerja saat kalian berdua dalam jangkauan Bluetooth. Agar orang bisa mengirimimu pesan dari mana saja, bagikan kode QR-mu.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Umum",
  "settings.section.general_desc":
    "Fitur opsional, batalkan kirim, media, setel ulang",
  "settings.section.privacy": "Privasi dan keamanan",
  "settings.section.privacy_desc":
    "Forward secrecy, paket bertanda tangan, rekan yang diblokir",
  "settings.section.network": "Jaringan dan relai",
  "settings.section.network_desc":
    "Cadangan internet, relai nostr, kecocokan dengan bitchat",
  "settings.section.permissions": "Izin",
  "settings.section.permissions_desc":
    "Bluetooth, lokasi, notifikasi, kamera, mikrofon",
  "settings.section.storage": "Penyimpanan dan data",
  "settings.section.diagnostics": "Diagnostik",

  // ---- Settings: group headings ----
  "settings.group.transports": "Pengangkut",
  "settings.group.nearby": "Di dekat sini",
  "settings.group.sync": "Sinkronisasi",
  "settings.group.features": "Fitur",
  "settings.group.messages": "Pesan",
  "settings.group.media": "Media",
  "settings.group.reset": "Setel ulang",
  "settings.group.always_on": "Selalu menyala",
  "settings.group.notifications": "Notifikasi",
  "settings.group.blocked": "Diblokir",
  "settings.group.theme": "Tema",
  "settings.group.font": "Fon",
  "settings.group.language": "Bahasa",
  "settings.section.diagnostics_desc":
    "Status sambungan dan perangkat di dekat sini",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Tautan Bluetooth",
  "settings.diag.ble_links_desc":
    "Perangkat yang tersambung langsung dengan ponsel ini",
  "settings.diag.lan": "Jaringan lokal",
  "settings.diag.lan_desc": "Ponsel di satu jaringan Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Ponsel ke ponsel tanpa perute",
  "settings.diag.wifi_active": "Berjalan",
  "settings.diag.wifi_unsupported": "Tidak didukung di perangkat ini",
  "settings.diag.wifi_permission": "Diblokir oleh sebuah izin",
  "settings.diag.wifi_unavailable": "Tidak tersedia saat ini",
  "settings.diag.wifi_unknown": "Menunggu radio",
  "settings.diag.relays": "Relai Nostr",
  "settings.diag.relays_desc":
    "Dipakai untuk kanal lokasi dan jangkauan lewat internet",
  "settings.diag.connected": "Tersambung",
  "settings.diag.disconnected": "Tidak tersambung",
  "settings.diag.peer_direct": "Tautan langsung",
  "settings.diag.peer_relayed": "Terdengar lewat perangkat lain",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Tidak ada pembacaan sinyal",
  "settings.diag.no_peers": "Tidak ada siapa pun dalam jangkauan",
  "settings.diag.no_peers_desc": "{links} tautan radio terbuka",
  "settings.diag.gcs_size": "Ukuran filter",
  "settings.diag.gcs_size_desc":
    "Filter sinkronisasi terbesar yang dilepas ke udara",
  "settings.diag.fpr": "Tingkat positif palsu",
  "settings.diag.fpr_desc":
    "Seberapa sering filter mengaku punya paket yang justru tidak kita punya",
  "settings.diag.bytes": "{n} bita",
  "settings.diag.footnote":
    "Tidak ada yang bisa diubah di sini. Nilai-nilai ini dipatok agar Airhop tetap cocok dengan bitchat.",
  "settings.section.storage_desc": "Pemakaian dan singgahan",
  "settings.section.appearance": "Tampilan",
  "settings.section.appearance_desc": "Tema, fon, dan bahasa",
  "settings.section.help": "Bantuan dan masukan",
  "settings.section.help_desc": "Hubungi kami, laporkan bug, atau baca FAQ",
  "settings.section.support": "Dukungan",
  "settings.section.support_desc": "Bantu agar pengembangan terus berjalan",
  "settings.section.about": "Tentang",
  "settings.section.about_desc": "Versi, daftar perubahan, dan kode sumber",

  // ---- Settings: general ----
  "settings.general.undo": "Batalkan kirim",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Dompet",
  "settings.general.undo_seconds": "{count} detik",
  "settings.general.undo_a11y": "Batalkan kirim: {value}",
  "settings.general.quality_a11y": "Setel kualitas unggahan ke {value}",
  "settings.general.undo_desc":
    "Menahan pesan terkirim sebentar supaya kamu sempat menariknya sebelum keluar",
  "settings.general.undo_off_desc": "Kirim langsung, tanpa pembatalan",
  "settings.general.undo_2": "2 detik",
  "settings.general.undo_2_desc": "Kesempatan singkat untuk menariknya",
  "settings.general.undo_10": "10 detik",
  "settings.general.undo_10_desc": "Jeda terpanjang",
  "settings.general.quality": "Kualitas unggahan",
  "settings.general.quality_desc":
    "Berlaku untuk foto yang dikirim dari kamera atau galerimu. Setiap foto tetap disesuaikan dengan mesh.",
  "settings.general.quality_low": "Rendah",
  "settings.general.quality_low_desc": "Foto terkecil, paling cepat dikirim",
  "settings.general.quality_medium": "Sedang",
  "settings.general.quality_medium_desc":
    "Seimbang antara detail dan kecepatan",
  "settings.general.quality_high": "Tinggi",
  "settings.general.quality_high_desc": "Menjaga detail paling banyak",
  "settings.general.feature_wallet_desc":
    "Kirim ecash Cashu antarrekan lewat mesh",
  "settings.general.feature_wallet_a11y": "Dompet (selalu menyala)",
  "settings.general.feature_ai_desc":
    "Asisten pribadi di perangkat, tanpa panggilan jaringan",
  "settings.general.feature_feeds": "Umpan",
  "settings.general.feature_feeds_desc":
    "Baca dan kirim kiriman ke umpan Bluesky dan Mastodon",
  "settings.general.show_media": "Tampilkan media otomatis",
  "settings.general.show_media_desc":
    "Foto dan video muncul di obrolan, atau menunggu di balik satu ketukan",
  "settings.general.reset": "Setel ulang pengaturan",
  "settings.general.media_retention": "Simpan media selama",
  "settings.general.media_retention_desc":
    "Foto, video, dan catatan suara dihapus setelah waktu yang dipilih",
  "settings.general.media_retention_sheet":
    "Pilih berapa lama media bertahan di perangkat ini. Media yang terhapus tidak bisa dipulihkan.",
  "settings.general.retention_7_desc":
    "Paling sedikit jejak yang tertinggal. Terbaik kalau ponselnya sendiri yang berisiko.",
  "settings.general.retention_14_desc":
    "Jalan tengah untuk satu dua pekan tanpa sinyal.",
  "settings.general.retention_30_desc":
    "Menjaga utasnya paling lama terbaca, sekaligus paling banyak memakan ruang.",
  "settings.general.reset_desc":
    "Mengembalikan setiap preferensi ke bawaannya, tanpa menyentuh identitas, pesan, kontak, dan dompetmu",
  "settings.general.reset_title": "Setel ulang pengaturan?",
  "settings.general.reset_body":
    "Setiap preferensi kembali ke bawaannya: tampilan, batalkan kirim, dan konektivitas (internet, Tor, gerbang, jembatan, relai). Identitas, pesan, kontak, dan dompetmu tidak tersentuh.",
  "settings.general.reset_confirm": "Setel ulang",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet selalu menyala untuk pesan langsung",
  "settings.security.signed_packets": "Paket bertanda tangan",
  "settings.security.signed_packets_desc":
    "Setiap paket ditandatangani dengan Ed25519",
  "settings.security.hide_previews": "Sembunyikan pratinjau notifikasi",
  "settings.security.hide_previews_desc":
    "Menjauhkan pengirim dan isi pesan dari layar kunci, yang menampilkannya tanpa perlu membuka kunci",
  "settings.security.no_blocked": "Tidak ada rekan yang diblokir",
  "settings.security.no_blocked_desc":
    "Rekan yang diblokir tidak bisa mengirimimu pesan atau muncul di tab Mesh",
  "settings.security.unblock_title": "Buka blokir rekan ini",
  "settings.security.unblock": "Buka blokir",
  "settings.security.unblock_peer": "Buka blokir {name}",
  "settings.security.unblock_body":
    "{name} akan bisa mengirimimu pesan lagi dan muncul kembali di tab Mesh saat berada di dekat sini.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Cadangan internet",
  "settings.network.internet_desc":
    "Lanjutkan lewat relai Nostr saat rekan mesh di luar jangkauan",
  "settings.network.internet_off_title": "Matikan internet?",
  "settings.network.internet_off_body":
    "Airhop akan berjalan hanya lewat Bluetooth. Ia berhenti menghubungi relai Nostr mana pun, dan Tor, gerbang internet, serta jembatan mesh semuanya mati. Obrolan Bluetooth di dekat sini tetap bekerja.",
  "settings.network.turn_off": "Matikan",
  "settings.network.discovery": "Penemuan geo-relai",
  "settings.network.discovery_desc":
    "Pilih sendiri relai terdekat untuk sebuah sel lokasi dari 300+ relai yang tersebar",
  "settings.network.discovery_needs_relay": "Tambahkan relai sendiri dulu",
  "settings.network.discovery_needs_relay_body":
    "Penemuan otomatislah yang mengarahkan Airhop ke relai terdekat. Mematikannya baru masuk akal setelah kamu menyematkan relai sendiri di bawah, jadi tambahkan setidaknya satu dulu.",
  "settings.network.custom_only_title": "Pakai hanya relai buatanmu?",
  "settings.network.custom_only_body":
    "Kanal lokasi dan jembatan mesh akan berhenti memilih relai terdekat secara otomatis dan hanya memakai yang kamu tambahkan. Ini bisa mempersempit jangkauan, dan kamu mungkin berhenti bertemu pengguna bitchat, yang berkumpul di relai terdekat.",
  "settings.network.custom": "Relai sendiri",
  "settings.network.custom_desc":
    "Tambahkan relaimu sendiri untuk kanal lokasi dan jembatan mesh",
  "settings.network.custom_added": "{count} dari {max} ditambahkan",
  "settings.network.dm_relays": "Relai pesan",
  "settings.network.dm_relays_desc":
    "Pesan langsung dan kanal pribadi selalu memakai relai ini. Relai buatanmu tidak mengubahnya.",
  "settings.network.discovery_back_on": "Penemuan geo-relai menyala lagi",
  "settings.network.discovery_back_on_body":
    "Itu relai buatanmu yang terakhir. Kanal lokasi butuh tempat untuk menerbitkan, jadi Airhop kembali memilih relai terdekat secara otomatis.",
  "settings.network.add_relay": "Tambah relai",
  "settings.network.remove_relay": "Singkirkan {url}",
  "settings.network.add_short": "Tambah",
  "settings.network.relay_limit":
    "Kamu bisa menambahkan {count} relai. Singkirkan satu untuk menambah yang lain.",
  "settings.network.relay_duplicate": "Relai itu sudah ada di daftarmu.",
  "settings.network.relay_invalid":
    "Masukkan host relai yang sah, misalnya relay.example.com. Porta hanya perlu kalau relainya tidak memakai porta bawaan. Alamat IP dan nama lokal tidak diizinkan.",
  "settings.network.bitchat": "Kecocokan dengan bitchat",
  "settings.network.bitchat_desc":
    "Mesh BLE yang sama dengan bitchat, sepenuhnya bisa saling bekerja. Ini selalu menyala dan tidak bisa dimatikan.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Jalankan di latar belakang",
  "settings.conn.background_desc": "Biarkan mesh berjalan saat Airhop tertutup",
  "settings.conn.background_on_title": "Biarkan mesh berjalan?",
  "settings.conn.background_on_body":
    "Airhop terus meneruskan dan menerima saat tertutup, jadi pesan tiba selagi kamu pergi. Android menampilkan notifikasi berjalan selama itu.",
  "settings.conn.background_off_title": "Hentikan mesh saat Airhop tertutup?",
  "settings.conn.background_off_body":
    "Pesan hanya akan tiba selagi Airhop terbuka, dan ponsel ini berhenti meneruskan untuk orang di dekat sini. Notifikasi berjalannya hilang.",
  "settings.conn.live_voice": "Suara langsung",
  "settings.conn.live_voice_desc":
    "Bicara dengan orang di dekat sini seperti walkie-talkie",
  "settings.conn.live_voice_on_title": "Nyalakan suara langsung?",
  "settings.conn.live_voice_on_body":
    "Menahan mikrofon mengirim suaramu ke semua orang dalam jangkauan Bluetooth selagi kamu bicara, dan suara mereka diputar di ponselmu. Tidak ada yang direkam.",
  "settings.conn.live_voice_off_title": "Matikan suara langsung?",
  "settings.conn.live_voice_off_body":
    "Menahan mikrofon akan merekam catatan suara. Ia terkirim saat kamu lepaskan, dan tidak ada yang mendengarnya sampai mereka memutarnya.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Perutean Tor",
  "settings.conn.tor_desc":
    "Alirkan lalu lintas Nostr lewat Tor demi privasi tambahan",
  "settings.conn.tor_on_title": "Alirkan lalu lintas Nostr lewat Tor?",
  "settings.conn.tor_on_body":
    "Relai berhenti melihat alamat IP-mu. Menyambung jadi lebih lama dan pesan tiba lebih lambat. Bluetooth tidak terpengaruh.",
  "settings.conn.tor_off_title": "Matikan perutean Tor?",
  "settings.conn.tor_off_body":
    "Lalu lintas Nostr kembali lewat sambungan biasamu, jadi relai melihat alamat IP-mu lagi. Bluetooth tetap tidak terpengaruh.",
  "settings.conn.tor_orbot_idle":
    "Orbot terpasang tetapi belum tersambung. Buka Orbot, nyalakan VPN-nya, lalu nyalakan ini.",
  "settings.conn.tor_unavailable":
    "Perutean Tor tidak tersedia di versi rakitan ini.",
  "settings.conn.tor_timeout":
    "Tor butuh lebih dari semenit untuk menyambung. Ia tetap menyala dan terus mencoba; tab Mesh akan memberi tahu saat perutean berjalan, atau kalau jaringan ini memblokirnya.",
  "settings.conn.tor_failed":
    "Tor tidak bisa dinyalakan. Pastikan aplikasi punya akses jaringan.",
  "settings.conn.mint_clearnet":
    "Izinkan lalu lintas mint lewat jaringan terbuka",
  "settings.conn.mint_clearnet_desc":
    "Tor di iOS hanya menutupi Nostr. Biarkan mati untuk memblokir permintaan mint; ecash lewat mesh tetap bekerja.",
  "settings.conn.gateway": "Gerbang internet",
  "settings.conn.gateway_desc":
    "Pinjamkan sambunganmu ke ponsel luring di dekat sini agar ia tetap bisa menjangkau kanal lokasi",
  "settings.conn.gateway_on_title": "Nyalakan gerbang internet?",
  "settings.conn.gateway_on_body":
    "Ponsel di dekat sini yang tidak punya sambungan sendiri akan mengirim dan menerima pesan kanal lokasi lewat sambunganmu. Ini memakai data seluler dan bateraimu, dan pesan mereka tetap terenkripsi ujung ke ujung, jadi kamu tidak bisa membaca apa yang lewat.",
  "settings.conn.gateway_off_title": "Matikan gerbang internet?",
  "settings.conn.gateway_off_body":
    "Ponsel luring di dekat sini berhenti menjangkau kanal lokasi lewat sambunganmu. Pesanmu sendiri tidak terpengaruh.",
  "settings.conn.bridge": "Jembatan mesh",
  "settings.conn.bridge_desc":
    "Sambungkan obrolan publik #bluetooth wilayah ini dengan kerumunan Bluetooth lain di luar jangkauan lewat internet",
  "settings.conn.bridge_on_title": "Nyalakan jembatan mesh?",
  "settings.conn.bridge_on_body":
    "Pesan publik #bluetooth-mu akan diterbitkan ke lingkunganmu lewat internet, jadi orang di luar jangkauan Bluetooth bisa membacanya. Pesan pribadi tidak pernah dijembatani, dan “hanya di dekat sini” menjaga satu pesan tetap lokal.",
  "settings.conn.bridge_off_title": "Matikan jembatan mesh?",
  "settings.conn.bridge_off_body":
    "Pesan publik #bluetooth-mu kembali bertahan dalam jangkauan Bluetooth, dan pesan dari kerumunan seberang berhenti tiba di sini.",
  "settings.conn.bridge_needs_location": "Jembatan mesh butuh lokasi",
  "settings.conn.bridge_needs_location_desc":
    "Ia menemukan lingkunganmu dari penentuan posisi. Beri izin lokasi untuk mulai menjembatani.",
  "settings.conn.grant_location": "Beri izin lokasi",
  "settings.conn.grant_short": "Beri izin",
  "settings.conn.orbot_body":
    "Airhop mengalirkan lalu lintas Tor lewat Orbot. Pasang dan aktifkan Orbot dari Play Store, lalu nyalakan ini.",
  "settings.conn.internet_off": "Internet mati",
  "settings.conn.internet_off_desc":
    "Tor, jembatan, dan gerbang sama-sama memakai internet. Nyalakan Cadangan internet di bagian Jaringan untuk memakainya.",
  "settings.conn.turn_on": "Nyalakan",
  "settings.conn.turn_off": "Matikan",
  "settings.conn.orbot_title": "Tor di Android",
  "settings.conn.get_orbot": "Dapatkan Orbot",
  "settings.conn.later": "Nanti",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Menemukan perangkat di dekat sini dan meneruskan pesan di antaranya. Tanpa ini mesh tidak bisa bekerja.",
  "settings.permissions.location": "Lokasi",
  "settings.permissions.location_desc":
    "Membuka kanal wilayah terdekat. Tanpa ini kanal-kanal itu tetap tertutup dan mesh Bluetooth berjalan seperti biasa.",
  "settings.permissions.notifications": "Notifikasi",
  "settings.permissions.notifications_desc":
    "Terima peringatan untuk pesan baru bahkan saat aplikasi tertutup. Tanpa ini kamu baru melihatnya saat membuka Airhop.",
  "settings.permissions.camera": "Kamera",
  "settings.permissions.camera_desc":
    "Memindai kode QR dan mengambil foto atau video untuk dikirim. Tanpa ini kamu tetap bisa membagikan media dari galerimu.",
  "settings.permissions.photos": "Foto",
  "settings.permissions.photos_desc":
    "Mengirim foto dari galerimu dan menyimpan media yang diterima. Tanpa ini kamu tetap bisa mengambil dan mengirim foto baru dengan kamera.",
  "settings.permissions.microphone": "Mikrofon",
  "settings.permissions.microphone_desc":
    "Merekam dan mengirim pesan suara atau memakai suara langsung. Tanpa ini pesan suara dan suara langsung tidak akan bekerja.",
  "settings.permissions.allow": "Beri izin ini",
  "settings.permissions.open_settings":
    "Buka pengaturan sistem untuk mengubah izin ini",
  "settings.permissions.system": "Sistem",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Pemakaian jaringan",
  "settings.storage.storage_usage": "Pemakaian penyimpanan",
  "settings.storage.storage_usage_desc":
    "Pesan, bukti dompet, dan lampiran di singgahan",
  "settings.storage.session_usage":
    "Sesi ini · {sent} terkirim, {received} diterima",
  "settings.storage.cache": "Singgahan",
  "settings.storage.cache_desc": "{size} lampiran",
  "settings.storage.clear_cache": "Bersihkan singgahan lampiran",
  "settings.storage.clear": "Bersihkan",
  "settings.storage.clear_title": "Bersihkan media di singgahan?",
  "settings.storage.clear_body":
    "Foto, video, catatan suara, dan berkas disingkirkan dari perangkat ini, baik yang terkirim maupun yang diterima. Semuanya tidak bisa diunduh lagi: gelembungnya akan mengatakan begitu, dan kamu bisa meminta pengirimnya mengirim ulang. Pesan dan dompet tidak tersentuh.",
  "settings.storage.cleared": "Singgahan dibersihkan",
  "settings.storage.freed": "Membebaskan {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Setel tampilan ke {value}",
  "settings.font.set_a11y": "Setel fon lebar tetap ke {value}",
  "settings.font.system": "Sistem",
  "settings.font.system_desc": "Memakai fon lebar tetap bawaan perangkatmu",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Modern dan mudah dibaca",
  "settings.language.en": "Inggris",
  "settings.language.am": "Amhara",
  "settings.language.ar": "Arab",
  "settings.language.bn": "Bengali",
  "settings.language.my": "Burma",
  "settings.language.zh_hans": "Tionghoa (Sederhana)",
  "settings.language.zh_hant": "Tionghoa (Tradisional)",
  "settings.language.nl": "Belanda",
  "settings.language.fil": "Filipina",
  "settings.language.fr": "Prancis",
  "settings.language.ka": "Georgia",
  "settings.language.de": "Jerman",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesia",
  "settings.language.it": "Italia",
  "settings.language.ja": "Jepang",
  "settings.language.ko": "Korea",
  "settings.language.mg": "Malagasi",
  "settings.language.ms": "Melayu",
  "settings.language.ne": "Nepali",
  "settings.language.fa": "Persia",
  "settings.language.pl": "Polandia",
  "settings.language.pt_br": "Portugis (Brasil)",
  "settings.language.pt_pt": "Portugis (Portugal)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Rusia",
  "settings.language.es": "Spanyol",
  "settings.language.sw": "Swahili",
  "settings.language.sv": "Swedia",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Thai",
  "settings.language.tr": "Turki",
  "settings.language.uk": "Ukraina",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnam",
  "settings.language.pseudo": "Pseudolokal",
  "settings.language.soon": "Segera hadir",
  "settings.language.soon_a11y": "{value}, segera hadir",
  "settings.language.set_a11y": "Setel bahasa ke {value}",
  "settings.language.pending": "Saat dibuka berikutnya",
  "settings.language.pending_a11y":
    "{value}, berlaku saat kamu membuka Airhop berikutnya",
  "settings.language.rtl_title": "Buka lagi Airhop untuk menuntaskannya",
  "settings.language.rtl_body":
    "{value} dibaca dari kanan ke kiri, dan Airhop hanya bisa mengubah arah saat mulai berjalan. Tutup lalu buka lagi untuk menuntaskan peralihannya. Tidak ada yang hilang, dan mesh-mu tetap tersambung sampai kamu melakukannya.",
  "settings.theme.light": "Terang",
  "settings.theme.light_desc": "Selalu pakai palet terang",
  "settings.theme.dark": "Gelap",
  "settings.theme.dark_desc": "Selalu pakai palet gelap",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Daring",
  "settings.status.online_desc": "Bisa ditemukan, menyiarkan dan memindai",
  "settings.status.away": "Sedang pergi",
  "settings.status.away_desc": "Mesh dijeda, tidak memindai atau menyiarkan",
  "settings.status.invisible": "Tak terlihat",
  "settings.status.invisible_desc":
    "Memindai, tetapi tersembunyi dari penemuan",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Setel status ke {value}",
  "settings.status.edit": "Ubah status",
  "settings.status.desc": "Pilih seberapa terlihat kamu di mesh.",
  "settings.transfer.identity": "Identitas dan kunci",
  "settings.transfer.identity_desc": "ID rekan, nama pengguna, dan kontakmu",
  "settings.transfer.chats": "Obrolan dan riwayat",
  "settings.transfer.chats_desc": "Percakapan, grup, dan kanal yang kamu ikuti",
  "settings.transfer.wallet": "Saldo dompet",
  "settings.transfer.wallet_desc": "Bukti Cashu dan riwayat transaksi",
  "settings.transfer.title": "Pindahkan ke ponsel baru",
  "settings.transfer.desc":
    "Pindahkan identitas, obrolan, dan dompetmu ke perangkat lain",
  "settings.transfer.coming_soon_a11y":
    "Pindahkan ke ponsel baru, segera hadir",
  "settings.transfer.body":
    "Dekatkan kedua ponsel lalu pindahkan semuanya lewat Bluetooth. Tidak ada yang melewati server, jadi ini bekerja tanpa internet.",
  "settings.qr.permission_label": "Akses foto",
  "settings.qr.permission_purpose": "menyimpan kode QR-mu",
  "settings.qr.saved": "Tersimpan",
  "settings.qr.saved_body": "Kode QR tersimpan di galeri fotomu.",
  "settings.qr.save_failed": "Tidak bisa disimpan",
  "settings.qr.save_failed_body": "Kode QR tidak bisa disimpan. Coba lagi.",
  "settings.qr.share_message": "Tambahkan aku di Airhop",
  "settings.qr.share_body":
    "Tambahkan aku di Airhop — perpesanan mesh yang privat dan mengutamakan luring.",
  "settings.qr.show_short": "Tampilkan QR",
  "settings.qr.title": "Kode QR-mu",
  "settings.qr.note":
    "Ini berisi kunci publikmu, yang memungkinkan orang lain mengirimimu pesan dari mana saja. Bagikan hanya kepada orang yang kamu percaya. Kode ini tidak berubah kecuali kamu menghapus identitasmu.",
  "settings.qr.code_label": "Kode kontak",
  "settings.qr.copy_code": "Salin kode kontak",
  "settings.qr.share": "Bagikan kode QR",
  "settings.qr.share_short": "Bagikan QR",
  "settings.qr.download": "Unduh kode QR",
  "settings.qr.download_short": "Unduh QR",
  "settings.qr.show": "Tampilkan kode QR",
  "settings.wipe.trigger": "Picu pembersihan darurat",
  "settings.wipe.trigger_desc":
    "Ketuk tiga kali untuk membersihkan seketika tanpa konfirmasi",
  "settings.wipe.title": "Pembersihan darurat",
  "settings.wipe.now": "Bersihkan sekarang",
  "settings.wipe.desc": "Memusnahkan seketika semua kunci, pesan, dan bukti",
  "settings.wipe.body":
    "Ini akan memusnahkan seketika semua kunci, pesan, dan bukti dompetmu. Ini tidak bisa dibatalkan.",
  "settings.wipe.in_progress": "Membersihkan",
  "settings.wipe.in_progress_body":
    "Memusnahkan kunci, pesan, dan berkasmu. Ini makan waktu beberapa detik dan selesai sendiri kalau aplikasinya ditutup.",
  "settings.wipe.got_it": "Mengerti",
  "settings.wipe.keys_failed": "Kunci tidak bisa dimusnahkan",
  "settings.wipe.keys_failed_body":
    "Pesan, kontak, dan dompetmu sudah hilang, tetapi perangkat menolak melepaskan kuncimu. Buka kunci perangkat lalu bersihkan lagi.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Hubungi kami",
  "settings.help.contact_a11y": "Kirim email ke {address}",
  "settings.help.bug": "Laporkan bug",
  "settings.help.bug_desc": "Buka isu di GitHub",
  "settings.help.bug_a11y": "Laporkan bug di GitHub",
  "settings.help.faq": "Pertanyaan yang sering diajukan",
  "settings.help.faq_desc": "Jawaban untuk pertanyaan umum",
  "settings.help.faq_a11y": "Buka FAQ",
  "settings.help.terms_desc": "Bagaimana Airhop boleh dipakai",
  "settings.help.terms_a11y": "Buka Ketentuan Layanan",
  "settings.help.privacy_desc": "Apa yang tidak kami kumpulkan",
  "settings.help.privacy_a11y": "Buka Kebijakan Privasi",

  // ---- Settings: support ----
  "settings.support.card": "Kartu atau UPI",
  "settings.support.card_desc":
    "Perbankan daring dan dompet digital, di seluruh dunia",
  "settings.support.card_a11y":
    "Dukung lewat kartu, UPI, perbankan daring, atau dompet digital",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Bulanan atau sekali saja, tanpa biaya platform",
  "settings.support.sponsors_a11y": "Dukung lewat GitHub Sponsors",
  "settings.support.note":
    "Saya membangun Airhop di waktu luang. Tidak ada investor dan tidak ada iklan. Kalau ini berguna buatmu, sumbanganmu sangat membantu agar pengembangan terus berjalan. Setiap fitur tetap gratis bagaimanapun juga.",

  // ---- Settings: about and version ----
  "settings.about.version": "Versi",
  "settings.about.version_desc": "Rilis saat ini",
  "settings.about.version_a11y": "Lihat versi dan periksa pembaruan",
  "settings.about.release_notes": "Catatan rilis",
  "settings.about.release_notes_desc": "Apa yang baru di rilis terakhir",
  "settings.about.release_notes_a11y": "Buka catatan rilis terakhir di GitHub",
  "settings.about.source": "Kode sumber",
  "settings.about.source_a11y": "Buka kode sumber di GitHub",
  "settings.about.licenses": "Lisensi sumber terbuka",
  "settings.about.open_repo": "Buka repositori {name}",
  "settings.about.licenses_desc": "Paket sumber terbuka pihak ketiga",
  "settings.about.licenses_a11y": "Lihat lisensi pihak ketiga",
  "settings.version.codename": "Nama sandi",
  "settings.version.checking": "Memeriksa",
  "settings.version.check": "Periksa pembaruan",
  "settings.version.checking_title": "Memeriksa pembaruan",
  "settings.version.up_to_date": "Kamu memakai versi terbaru.",
  "settings.version.release_notes": "Lihat catatan rilis",
  "settings.version.made_with": "Dibuat dengan",
  "settings.version.number": "Versi {version}",
  "settings.version.update_to": "Perbarui ke {version}",
  "settings.version.update_to_a11y": "Perbarui ke versi {version}",
  "settings.version.released_under": "Dirilis di bawah {license}",
  "settings.version.notes_a11y": "Lihat catatan rilis untuk versi {version}",
  "settings.version.tor_paused":
    "Pemeriksaan pembaruan dijeda selagi Tor menyala, supaya tidak membocorkan IP-mu. Lihat halaman rilis lewat peramban.",
  "settings.version.check_failed":
    "Tidak bisa memeriksa pembaruan. Periksa sambunganmu lalu coba lagi.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} berukuran {size} KiB, melewati batas {cap} KiB.",
  "transfer.failed.malformed":
    "Sebuah lampiran tiba dalam keadaan rusak dan tidak bisa dibuka. Minta mereka mengirimnya lagi.",
  "transfer.failed.unsupported_type":
    "Sebuah lampiran tiba dalam format yang tidak bisa dibuka aplikasi ini.",
  "transfer.failed.type_mismatch":
    "Sebuah lampiran ditolak: isinya tidak cocok dengan jenis berkas yang diakuinya.",
  "transfer.failed.storage":
    "Sebuah lampiran tiba tetapi tidak bisa disimpan. Periksa ruang kosongmu.",
  "transfer.badge.waiting": "Menunggu · {name}",
  "transfer.badge.active_count": "{count} transfer",
  "transfer.badge.sending": "Mengirim {name}",
  "transfer.badge.receiving": "Menerima {name}",
  "transfer.badge.a11y": "{label}, {percent} persen. Buka percakapan.",
  "transfer.kind.photo": "Foto",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Catatan suara",
  "transfer.this.photo": "Foto ini",
  "transfer.this.video": "Video ini",
  "transfer.this.voice": "Catatan suara ini",
  "transfer.this.file": "Berkas ini",
  "transfer.kind.document": "Dokumen",
  "transfer.kind.voice_preview": "Catatan suara",
  "transfer.kind.photo_preview": "Foto",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Dokumen",

  // ---- System notifications ----
  "notif.channel.messages": "Pesan",
  "notif.channel.nearby": "Rekan di dekat sini",
  "notif.channel.nearby_desc":
    "Pemberitahuan sesekali saat mesh menemukan orang dalam jangkauan Bluetooth.",
  "notif.nearby.body":
    "Sedang dalam jangkauan Bluetooth. Ketuk untuk membuka mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Seseorang",
  "notif.notice_urgent": "Pengumuman mendesak · {content}",
  "notif.notice": "Pengumuman · {content}",
  "notif.incoming_file": "Berkas masuk",
  "notif.preview.photo": "📷 Foto",
  "notif.preview.voice": "🎤 Pesan suara",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Dokumen",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Pesan baru",
  "notif.hidden.channel": "Aktivitas baru",
  "notif.hidden.mention": "Kamu disebut",
  "notif.mention.title": "{sender} menyebutmu",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "Tampilkan {count} lagi",
  },
  "chat.channels.show_more_a11y": {
    other: "Tampilkan {count} kanal bawaan lagi",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}, {count} belum dibaca",
  },
  "a11y.new_count": {
    other: "{label}, {count} baru",
  },
  "chat.a11y.unread": {
    other: "{count} belum dibaca",
  },
  "chat.thread.length_left": {
    other: "sisa {count}",
  },
  "settings.general.retention_days": {
    other: "{count} hari",
  },
  "chat.info.group_reach": {
    other: "{reachable} dari {count} anggota dapat dijangkau",
  },
  "chat.group_members": {
    other: "Grup pribadi  ·  {count} anggota",
  },
  "chat.select.count": {
    other: "{count} dipilih",
  },
  "chat.select.forward": {
    other: "Teruskan {count} pesan",
  },
  "chat.voice.live_speaking_count": {
    other: "{count} sedang bicara",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "{count} rekan dalam jangkauan",
  },
  "mesh.peer.hops_away": {
    other: "{count} lompatan dari sini",
  },
  "chat.presence.active": {
    other: "{count} aktif",
  },
  "chat.presence.nearby": {
    other: "{count} di dekat sini",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "{count} mint",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint} menyimpan {balance} {unit} dalam {count} bukti. Menghapusnya menghapus bukti itu dari perangkat ini secara permanen dan tidak ada cadangannya. Tarik atau kirim saldonya lebih dulu.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other:
      "{count} setoran menunggu pembayaran. Diperiksa ulang setiap kali aplikasi dibuka.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "Memulihkan {count} bukti yang belum terpakai dari {mints}.",
  },
  "wallet.backup.already_spent": {
    other:
      "{count} koin ditemukan tetapi sudah terpakai, jadi tidak ada yang dikreditkan untuknya. Ini normal: setiap koin yang pernah kamu belanjakan tetap muncul dalam catatan yang disimpan mint.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "Tampilkan {count} lagi",
  },
  "wallet.activity.show_more_a11y": {
    other: "Tampilkan {count} pembayaran lagi",
  },
  "wallet.mint.unconfirmed_count": {
    other: "{count} belum dikonfirmasi",
  },
  "wallet.proof_count": {
    other: "{count} bukti",
  },
  "wallet.spent_removed_detail": {
    other: "{count} bukti sudah terpakai dan telah dihapus.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "{count} orang di dekat sini",
  },
};

export const id = { strings, plurals };
