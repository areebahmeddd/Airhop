import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Kembali ke beranda",
  "common.last_updated": "Terakhir diperbarui: {date}",

  "nav.aria": "Utama",
  "nav.home": "Beranda Airhop",
  "nav.skip": "Lompat ke konten",
  "nav.menu.open": "Buka menu",
  "nav.menu.close": "Tutup menu",
  "nav.how_it_works": "Cara kerjanya",
  "nav.architecture": "Arsitektur",
  "nav.faq": "Tanya jawab",

  "footer.aria": "Footer",
  "footer.tagline": "Komunikasi mesh yang privat",
  "footer.credit": "© Dibuat dengan {heart} oleh {author}",
  "footer.group.download": "Unduh",
  "footer.group.resources": "Sumber daya",
  "footer.group.social": "Sosial",
  "footer.group.legal": "Legal",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Arsitektur",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "Tanya jawab",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Ketentuan Layanan",
  "footer.link.privacy": "Kebijakan Privasi",
  "footer.link.license": "Lisensi Proyek",

  "settings.theme.group": "Tema warna",
  "settings.theme.light": "Tema terang",
  "settings.theme.dark": "Tema gelap",
  "settings.language.label": "Bahasa",
  "settings.language.suggestion": "Lihat halaman ini dalam bahasa Indonesia",
  "settings.language.dismiss": "Tutup",

  "home.hero.release": "Rilis terbaru",
  "home.hero.title": "Pesan yang tetap jalan tanpa internet.",
  "home.hero.body":
    "Ponsel di sekitar membentuk mesh Bluetooth dan meneruskan pesan Anda hingga tujuh lompatan, terenkripsi ujung ke ujung. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Tanpa server",
  "home.hero.body.no_accounts": "tanpa akun",
  "home.hero.body.no_tracking": "tanpa pelacakan",
  "home.hero.download": "Unduh aplikasinya",
  "home.hero.badges": "Berlisensi MIT · Gratis dan sumber terbuka · Bekerja dengan bitchat",
  "home.hero.group.mobile": "Ponsel",
  "home.hero.group.desktop": "Desktop",
  "home.hero.option.f_droid": "Katalog sumber terbuka",
  "home.hero.option.apk": "Unduhan langsung",
  "home.hero.option.soon": "Segera hadir",

  "home.about.eyebrow": "Apa itu Airhop",
  "home.about.title": "Sebagian besar aplikasi bergantung pada server pusat.",
  "home.about.sub":
    "Server bisa diawasi, dimatikan, atau diblokir. Airhop tidak punya satu pun, jadi tidak ada perusahaan yang bisa ditekan dan tidak ada layanan yang bisa ditutup.",
  "home.about.card": "Gambaran teknis",
  "home.about.link.mesh": "mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protokol transmisi",
  "home.about.body.built":
    "Airhop adalah aplikasi sumber terbuka untuk iOS dan Android untuk perpesanan privat antarperangkat lewat {mesh}. Aplikasi ini dibangun di atas fondasi {bitchat}, memakai ulang {wire_protocol} dan model keamanannya, lalu memperluasnya dengan pembayaran {ecash} luring dan AI luring. Aplikasi ini bekerja tanpa koneksi internet sama sekali, dan pesan diteruskan otomatis melalui perangkat di sekitar (sekitar 10 sampai 30 meter per lompatan di dalam ruangan, lebih jauh di ruang terbuka), hingga 7 lompatan.",
  "home.about.body.identity":
    "Identitas Anda adalah pasangan kunci {ed25519} yang dibuat di perangkat Anda dan disimpan di {ios_keychain} atau {android_keystore}. Tidak ada akun, tidak ada pendaftaran, dan tidak ada yang menyentuh server mana pun, artinya aplikasi ini bisa dipakai sebagai aplikasi sekali pakai yang tidak meninggalkan apa pun yang mengarah kembali ke Anda setelah dihapus.",
  "home.about.body.crypto":
    "Setiap sesi memakai protokol {noise} untuk handshake terautentikasi. Pesan yang tersimpan memakai algoritme {ratchet}, artinya sekalipun perangkat Anda diretas di kemudian hari, pesan lama Anda tetap tidak terbaca. Hapus darurat memusnahkan semua kunci dan pesan dalam waktu kurang dari satu detik.",
  "home.about.body.internet":
    "Ketika Anda dan kontak berada di luar jangkauan Bluetooth, relai {nostr} berfungsi sebagai jembatan lewat internet, memakai pesan langsung terbungkus berformat {nip17}, sehingga mesh meluas ke seluruh dunia selama kalian berdua daring. Dukungan {tor} juga tersedia di iOS (lewat {arti}) dan Android (lewat {orbot}).",
  "home.about.optional.title": "Airhop punya fitur opsional yang bisa Anda aktifkan:",
  "home.about.optional.payments.label": "Pembayaran luring:",
  "home.about.optional.payments.body":
    "Kirim dan terima pembayaran lewat mesh memakai protokol {cashu} (hanya Bitcoin).",
  "home.about.optional.ai.label": "AI luring:",
  "home.about.optional.ai.body":
    "Asisten AI kecil di perangkat yang bisa menjawab pertanyaan penting. Seluruh pemrosesan dan datanya tetap di perangkat Anda.",
  "home.about.body.compatible":
    "Airhop kompatibel di tingkat protokol dengan bitchat. Perangkat Airhop dan perangkat bitchat pada mesh yang sama saling menemukan secara otomatis dan bisa bertukar pesan serta pesan langsung tanpa konfigurasi apa pun.",

  "home.situations.eyebrow": "Kapan Anda membutuhkannya",
  "home.situations.title": "Untuk hari ketika jaringan tumbang.",
  "home.situations.sub":
    "Bencana alam, pemadaman internet, aksi massa, atau akhir pekan biasa di luar jangkauan.",
  "home.situations.disaster.label": "Bencana",
  "home.situations.disaster.line":
    "Menara tumbang. Pengumuman di papan sampai ke siapa pun yang lewat.",
  "home.situations.offgrid.label": "Luar jaringan",
  "home.situations.offgrid.line": "Dua hari menyusuri jalur. Bar sinyal terakhir hilang kemarin.",
  "home.situations.protest.label": "Aksi",
  "home.situations.protest.line": "Kode QR di selebaran membuka kanal terenkripsi untuk pawai.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Tidak ada sinyal di lokasi. Pesan melompat lewat ponsel orang-orang asing.",

  "home.showcase.eyebrow": "Lihat aplikasinya",
  "home.showcase.title": "Aplikasi pesan biasa, tanpa jaringan.",
  "home.showcase.sub":
    "Obrolan, kanal, dompet, dan identitas. Terasa biasa di permukaan, dengan mesh di bawahnya yang bekerja.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Semua orang dalam jangkauan, ditempatkan sesuai seberapa dekat mereka. Tidak perlu menambahkan siapa pun lebih dulu.",
  "home.showcase.mesh.alt":
    "Layar Mesh aplikasi Airhop, menampilkan empat perangkat di sekitar yang ditata pada radar menurut kekuatan sinyal.",
  "home.showcase.chats.title": "Obrolan",
  "home.showcase.chats.caption":
    "Percakapan biasa. Ponsel yang meneruskan tiap pesan tidak bisa membukanya.",
  "home.showcase.chats.alt":
    "Percakapan pesan langsung di Airhop saat listrik padam, diteruskan lewat tiga ponsel.",
  "home.showcase.channels.title": "Kanal",
  "home.showcase.channels.caption":
    "Ruang publik sekecil satu blok atau seluas satu wilayah, terbuka untuk siapa pun di sana.",
  "home.showcase.channels.alt":
    "Layar obrolan aplikasi Airhop, menampilkan kanal publik yang dibatasi pada satu blok, lingkungan, kota, dan wilayah.",
  "home.showcase.wallet.title": "Dompet",
  "home.showcase.wallet.caption":
    "Serahkan ecash ke orang di sebelah Anda lewat Bluetooth, tanpa satu pun ponsel daring.",
  "home.showcase.wallet.alt":
    "Layar dompet aplikasi Airhop, menampilkan saldo ecash yang bisa dikirim lewat Bluetooth.",
  "home.showcase.identity.title": "Identitas",
  "home.showcase.identity.caption":
    "Tanpa pendaftaran, tanpa nomor telepon, tanpa surel. Hanya kunci yang tidak pernah keluar dari ponsel ini.",
  "home.showcase.identity.alt":
    "Layar profil aplikasi Airhop, menampilkan identitas yang dibuat di perangkat tanpa akun.",

  "home.how.eyebrow": "Cara kerjanya",
  "home.how.title": "Mesh terbentuk dengan sendirinya.",
  "home.how.sub":
    "Simpul di sekitar membentuk mesh yang memulihkan diri lewat Bluetooth. Ketika ada internet, relai Nostr memperluasnya, tanpa infrastruktur yang dikendalikan siapa pun.",
  "home.how.cta": "Baca arsitektur lengkapnya",
  "home.how.discover.title": "Menemukan",
  "home.how.discover.line":
    "Ponsel yang menjalankan Airhop atau bitchat saling menemukan otomatis lewat Bluetooth. Tanpa penyandingan, tanpa penyiapan.",
  "home.how.relay.title": "Meneruskan",
  "home.how.relay.line":
    "Pesan melompat dari ponsel ke ponsel, hingga tujuh lompatan. Ponsel di antaranya tidak pernah melihat apa yang mereka bawa.",
  "home.how.reach.title": "Menjangkau lebih jauh",
  "home.how.reach.line":
    "Ketika ada internet, relai Nostr membawa percakapan yang sama lebih jauh, opsional lewat Tor.",
  "home.how.swipe": "geser untuk menjelajah",
  "home.how.diagram": "Mesh BLE · jaringan lokal antarperangkat",
  "home.how.legend.node": "Simpul mesh BLE (luring)",
  "home.how.legend.relay": "Penerusan banyak lompatan (terenkripsi Noise XX)",
  "home.how.legend.bitchat": "Kompatibel dengan bitchat pada mesh yang sama",
  "home.how.legend.nostr": "Jembatan Nostr (internet, saat daring)",

  "home.map.aria": "Peta dunia lokasi relai Nostr",
  "home.map.summary": "Jembatan Nostr · {relays} di {locations} di seluruh dunia",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Apa yang bisa dilakukan",
  "home.features.title": "Aplikasi pesan sungguhan, bukan demo.",
  "home.features.sub":
    "Obrolan, identitas, jaringan, dan uang. Semuanya dibuat agar bekerja tanpa sinyal, tanpa akun, dan tanpa perantara.",

  "home.features.messaging.title": "Perpesanan",
  "home.features.messaging.summary":
    "Semua yang dimiliki aplikasi pesan, tanpa infrastruktur di belakangnya.",
  "home.features.messaging.dms.name": "Pesan langsung privat",
  "home.features.messaging.dms.line":
    "Terenkripsi ujung ke ujung, dengan tanda terkirim dan terbaca.",
  "home.features.messaging.location.name": "Kanal lokasi",
  "home.features.messaging.location.line":
    "Ruang yang terikat pada satu tempat, dari satu blok sampai satu wilayah.",
  "home.features.messaging.groups.name": "Kanal dan grup privat",
  "home.features.messaging.groups.line":
    "Tautan undangan untuk sebuah ruang, atau daftar bertanda tangan hingga 16 orang.",
  "home.features.messaging.board.name": "Papan pengumuman",
  "home.features.messaging.board.line":
    "Pengumuman yang tersemat pada suatu area hingga tujuh hari.",
  "home.features.messaging.voice.name": "Suara langsung",
  "home.features.messaging.voice.line":
    "Tahan mikrofon dan bicara ke siapa pun dalam jangkauan, ala walkie-talkie.",
  "home.features.messaging.notes.name": "Pesan suara",
  "home.features.messaging.notes.line":
    "Audio terekam, lebih cepat daripada mengetik petunjuk arah.",
  "home.features.messaging.files.name": "Foto, video, dan berkas",
  "home.features.messaging.files.line": "Format apa pun, hingga 1 MB, tanpa perlu sinyal.",
  "home.features.messaging.forward.name": "Simpan dan teruskan",
  "home.features.messaging.forward.line":
    "Disegel dan dibawa ponsel di sekitar sampai tiba di tujuan.",

  "home.features.identity.title": "Identitas",
  "home.features.identity.summary": "Tidak ada yang didaftarkan, tidak ada yang bisa disita.",
  "home.features.identity.keys.name": "Identitas pasangan kunci",
  "home.features.identity.keys.line": "Dibuat di ponsel ini, disimpan di keychain sistem.",
  "home.features.identity.names.name": "Nama yang mudah dibaca",
  "home.features.identity.names.line":
    "Diturunkan dari kunci Anda, jadi tidak ada yang bisa mengambilnya.",
  "home.features.identity.qr.name": "Kontak lewat QR",
  "home.features.identity.qr.line": "Sekali pindai membawa kunci mereka, bukan cuma namanya.",
  "home.features.identity.panic.name": "Hapus darurat",
  "home.features.identity.panic.line":
    "Semua kunci dan pesan dimusnahkan dalam waktu kurang dari satu detik.",

  "home.features.networking.title": "Jaringan",
  "home.features.networking.summary": "Ponsel-ponsel itulah jaringannya.",
  "home.features.networking.mesh.name": "Mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Tanpa internet, tanpa router, di ponsel yang sudah dimiliki orang.",
  "home.features.networking.bridge.name": "Jembatan mesh",
  "home.features.networking.bridge.line":
    "Menghubungkan obrolan publik Anda dengan kerumunan di dekatnya yang di luar jangkauan.",
  "home.features.networking.wifi.name": "Jalur cepat WiFi",
  "home.features.networking.wifi.line": "Transfer lebih cepat antara dua Android atau dua iPhone.",
  "home.features.networking.bitchat.name": "Kompatibel dengan bitchat",
  "home.features.networking.bitchat.line":
    "Kedua aplikasi bergabung ke mesh yang sama tanpa penyiapan.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Perluasan, bukan syarat.",
  "home.features.internet.nostr.name": "Cadangan lewat Nostr",
  "home.features.internet.nostr.line":
    "Pesan langsung dan kanal lokasi tetap mengalir di luar jangkauan radio.",
  "home.features.internet.relays.name": "Penemuan geo-relai",
  "home.features.internet.relays.line":
    "Lebih dari 300 relai publik independen, tidak satu pun milik kami.",
  "home.features.internet.gateway.name": "Gerbang internet",
  "home.features.internet.gateway.line":
    "Pinjamkan koneksi Anda agar ponsel luring di dekatnya bisa menjangkau kanal lokasi.",
  "home.features.internet.tor.name": "Integrasi Tor",
  "home.features.internet.tor.line":
    "Dirutekan di kedua platform, jadi relai tidak pernah melihat IP Anda.",

  "home.features.optional.title": "Opsional",
  "home.features.optional.summary": "Mati secara bawaan. Menyala saat Anda mau.",
  "home.features.optional.cashu.name": "Ecash Cashu",
  "home.features.optional.cashu.line": "Bayar orang di sebelah Anda tanpa satu pun ponsel daring.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Isi ulang atau cairkan dalam bitcoin lewat jaringan Lightning.",
  "home.features.optional.ai.name": "AI lokal",
  "home.features.optional.ai.line": "Jawaban di perangkat, tidak ada yang keluar dari ponsel.",
  "home.features.optional.social.name": "Jembatan sosial",
  "home.features.optional.social.line": "Bluesky dan Mastodon dengan identitas yang sama.",

  "home.compare.eyebrow": "Perbandingannya",
  "home.compare.title": "Luring, tanpa perangkat keras tambahan, dan terbuka.",
  "home.compare.sub":
    "Setiap aplikasi di sini punya kelebihannya. Hanya sebagian yang tetap bekerja ketika jaringan tidak.",
  "home.compare.col.project": "Proyek",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Enkripsi",
  "home.compare.col.offline": "Bekerja luring",
  "home.compare.col.hardware_free": "Tanpa perangkat tambahan",
  "home.compare.col.open_source": "Sumber terbuka",
  "home.compare.mark.yes": "Ya",
  "home.compare.mark.no": "Tidak",
  "home.compare.mark.partial": "Sebagian, kliennya sumber terbuka, servernya tidak",
  "home.compare.mark.partial_hint": "Kliennya sumber terbuka, servernya tidak",
  "home.compare.transport.servers": "Server terpusat",
  "home.compare.transport.onion": "Perutean onion (simpul layanan)",
  "home.compare.transport.nostr": "Relai Nostr",
  "home.compare.transport.lora": "Radio LoRa",
  "home.compare.transport.sub_ghz": "Radio sub-GHz berpemilik",

  "home.explore.eyebrow": "Terbuka dan jujur",
  "home.explore.title": "Setiap klaim di sini bisa diperiksa.",
  "home.explore.sub":
    "Kode, protokol, dan rencananya publik. Batasannya juga. Periksa sendiri sebelum percaya pada kata-kata kami.",
  "home.explore.audit.chip": "Audit tertunda",
  "home.explore.audit.headline": "Airhop belum menjalani audit keamanan eksternal.",
  "home.explore.audit.body":
    "{headline} Seluruh kode ditinjau secara pribadi dan dijalankan melalui {review} sebelum dirilis, dan pustaka kriptografi yang dipakainya telah diaudit Cure53, tetapi itu bukan pengganti audit formal atas aplikasinya sendiri. Satu audit direncanakan untuk {version}. Jangan mengandalkannya untuk kasus penggunaan sensitif sampai saat itu.",
  "home.explore.audit.link.review": "agen tinjauan keamanan",
  "home.explore.source.title": "Kode sumber",
  "home.explore.source.desc":
    "Semuanya di GitHub dengan lisensi MIT. Issue, pull request, dan diskusi terbuka.",
  "home.explore.protocol.title": "Spesifikasi protokol",
  "home.explore.protocol.desc":
    "Format transmisi persisnya, UUID BLE, dan konstanta, dipakai bersama bitchat.",
  "home.explore.architecture.title": "Arsitektur",
  "home.explore.architecture.desc":
    "Uraian teknis lengkap, dari menekan kirim sampai byte di radio.",
  "home.explore.roadmap.title": "Peta jalan",
  "home.explore.roadmap.desc":
    "Target versi dari v0.5.0 sampai v2.0.0, termasuk audit yang direncanakan.",
  "home.explore.vision.title": "Visi",
  "home.explore.vision.desc":
    "Mengapa Airhop ada, dan prinsip yang tidak berubah di bawah tekanan.",
  "home.explore.brand.title": "Kit merek",
  "home.explore.brand.desc": "Burung piksel, token warna dan tipografi, aset pers, dan teks baku.",

  "home.contribute.eyebrow": "Dukung proyek ini",
  "home.contribute.title": "Independen, dan terbuka.",
  "home.contribute.sub":
    "Tidak ada investor, tidak ada iklan, dan tidak ada versi berbayar. Semua fitur tetap gratis apa pun yang terjadi, dan pekerjaannya didanai orang-orang yang merasa terbantu.",
  "home.contribute.contribute.chip": "Berkontribusi",
  "home.contribute.contribute.body":
    "Beri bintang pada repositori, buka issue, dan kirim pull request. Laporan bug, usulan fitur, dan kontribusi kode semuanya disambut baik.",
  "home.contribute.contribute.cta": "Lihat di GitHub",
  "home.contribute.sponsor.chip": "Sponsori",
  "home.contribute.sponsor.body":
    "Kalau Airhop bermanfaat bagi Anda, donasi sekali atau sponsor berkala sangat membantu menjaga pengembangan tetap aktif.",
  "home.contribute.sponsor.donate": "Donasi sekali",
  "home.contribute.sponsor.github": "Sponsori di GitHub",

  "page.architecture.eyebrow": "Dokumentasi",
  "page.architecture.title": "Arsitektur",
  "page.architecture.toc": "Di halaman ini",

  "page.faq.eyebrow": "Tanya jawab",
  "page.faq.title": "Pertanyaan yang sering diajukan",
  "page.faq.meta": "Pertanyaan umum tentang Airhop.",
  "page.faq.contact":
    "Pertanyaan yang belum terjawab di sini bisa dikirim ke {email} atau diajukan dengan membuka diskusi di {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Segera hadir",
  "page.blogs.body": "Tulisan tentang jaringan mesh, privasi, dan perangkat lunak offline-first.",

  "page.brand.eyebrow": "Merek",
  "page.brand.title": "Kit Merek",
  "page.brand.meta":
    "Aset dan aturan untuk menampilkan Airhop di artikel, halaman toko, presentasi, atau README. Bebas dipakai sebagai rujukan dan untuk pers.",

  "page.legal.eyebrow": "Legal",
  "page.privacy.title": "Kebijakan Privasi",
  "page.terms.title": "Ketentuan Layanan",

  "page.notfound.title": "Halaman tidak ditemukan",
  "page.notfound.body": "Halaman yang Anda cari tidak ada atau telah dipindahkan.",

  "page.english_only": "Halaman ini hanya tersedia dalam bahasa Inggris.",

  "seo.breadcrumb.home": "Beranda",

  "seo.home.title": "Airhop — Aplikasi pesan privat dan offline-first",
  "seo.home.description":
    "Perpesanan privat antarperangkat untuk iOS dan Android. Tanpa internet, tanpa server, tanpa akun. Berkomunikasi lewat mesh Bluetooth di mana saja.",

  "seo.architecture.title": "Arsitektur — Airhop",
  "seo.architecture.description":
    "Cara kerja Airhop dari atas ke bawah: identitas, pemilihan transport, mesh Bluetooth, enkripsi, lapisan internet, Tor, ecash luring, AI di perangkat, dan format transmisi yang kompatibel dengan bitchat.",
  "seo.architecture.breadcrumb": "Arsitektur",
  "seo.architecture.headline": "Arsitektur Airhop",
  "seo.architecture.summary":
    "Uraian teknis lengkap Airhop: identitas, transport, mesh Bluetooth, enkripsi, lapisan internet Nostr, Tor, dompet Cashu, asisten AI di perangkat, dan format transmisi.",

  "seo.faq.title": "Pertanyaan yang Sering Diajukan — Airhop",
  "seo.faq.description":
    "Jawaban seputar perpesanan mesh Bluetooth Airhop, enkripsi, pembayaran luring, lapisan internet Nostr, dan kompatibilitas dengan bitchat.",
  "seo.faq.breadcrumb": "Tanya jawab",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description":
    "Tulisan tentang jaringan mesh, privasi, dan perangkat lunak offline-first.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Kit Merek — Airhop",
  "seo.brand.description":
    "Kit merek Airhop: burung piksel, wordmark, token warna dan tipografi, aset pers, dan teks baku.",
  "seo.brand.breadcrumb": "Kit Merek",

  "seo.privacy.title": "Kebijakan Privasi — Airhop",
  "seo.privacy.description":
    "Cara Airhop menangani data: tanpa akun, tanpa server, tanpa pelacakan. Identitas dan pesan Anda tetap di perangkat Anda.",
  "seo.privacy.breadcrumb": "Kebijakan Privasi",

  "seo.terms.title": "Ketentuan Layanan — Airhop",
  "seo.terms.description": "Ketentuan yang mengatur penggunaan aplikasi dan situs web Airhop.",
  "seo.terms.breadcrumb": "Ketentuan Layanan",

  "seo.notfound.title": "Halaman Tidak Ditemukan — Airhop",
  "seo.notfound.description": "Halaman yang Anda cari tidak ada atau telah dipindahkan.",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "{count} relai",
  },
  "home.map.locations": {
    other: "{count} lokasi",
  },
};

export const locale: Locale = { strings, plurals };
