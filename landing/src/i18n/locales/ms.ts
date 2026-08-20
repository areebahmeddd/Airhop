import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Kembali ke laman utama",
  "common.last_updated": "Kemas kini terakhir: {date}",

  "nav.aria": "Utama",
  "nav.home": "Laman utama Airhop",
  "nav.skip": "Langkau ke kandungan",
  "nav.menu.open": "Buka menu",
  "nav.menu.close": "Tutup menu",
  "nav.how_it_works": "Cara ia berfungsi",
  "nav.architecture": "Seni bina",
  "nav.faq": "Soalan lazim",

  "footer.aria": "Pengaki",
  "footer.tagline": "Komunikasi mesh peribadi",
  "footer.credit": "© Dibuat dengan {heart} oleh {author}",
  "footer.group.download": "Muat turun",
  "footer.group.resources": "Sumber",
  "footer.group.social": "Sosial",
  "footer.group.legal": "Perundangan",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Seni bina",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "Soalan lazim",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Terma Perkhidmatan",
  "footer.link.privacy": "Dasar Privasi",
  "footer.link.license": "Lesen Projek",

  "settings.theme.group": "Tema warna",
  "settings.theme.light": "Tema cerah",
  "settings.theme.dark": "Tema gelap",
  "settings.language.label": "Bahasa",
  "settings.language.suggestion": "Lihat halaman ini dalam bahasa Melayu",
  "settings.language.dismiss": "Tutup",

  "home.hero.release": "Keluaran terkini",
  "home.hero.title": "Pemesejan yang berfungsi tanpa internet.",
  "home.hero.body":
    "Telefon berdekatan membentuk rangkaian mesh Bluetooth dan menyampaikan mesej anda sehingga tujuh lompatan, disulitkan hujung ke hujung. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Tiada pelayan",
  "home.hero.body.no_accounts": "tiada akaun",
  "home.hero.body.no_tracking": "tiada penjejakan",
  "home.hero.download": "Muat turun aplikasi",
  "home.hero.badges": "Berlesen MIT · Percuma dan sumber terbuka · Serasi dengan bitchat",
  "home.hero.group.mobile": "Mudah alih",
  "home.hero.group.desktop": "Desktop",
  "home.hero.option.f_droid": "Katalog sumber terbuka",
  "home.hero.option.apk": "Muat turun terus",
  "home.hero.option.soon": "Akan datang",

  "home.about.eyebrow": "Apakah Airhop",
  "home.about.title": "Kebanyakan aplikasi bergantung pada pelayan pusat.",
  "home.about.sub":
    "Pelayan boleh dipantau, dimatikan atau disekat. Airhop tidak mempunyai satu pun, jadi tiada syarikat untuk ditekan dan tiada perkhidmatan untuk ditutup.",
  "home.about.card": "Gambaran teknikal",
  "home.about.link.mesh": "rangkaian mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protokol penghantaran",
  "home.about.body.built":
    "Airhop ialah aplikasi sumber terbuka untuk iOS dan Android bagi pemesejan peribadi antara peranti melalui {mesh}. Ia dibina atas asas {bitchat}, menggunakan semula {wire_protocol} dan model keselamatannya, kemudian meluaskannya dengan pembayaran {ecash} luar talian dan AI luar talian. Ia berfungsi tanpa sebarang sambungan internet, dan mesej dihantar secara automatik melalui peranti berdekatan (kira-kira 10 hingga 30 meter setiap lompatan di dalam bangunan, lebih jauh di kawasan lapang), sehingga 7 lompatan.",
  "home.about.body.identity":
    "Identiti anda ialah pasangan kunci {ed25519} yang dijana pada peranti anda dan disimpan dalam {ios_keychain} atau {android_keystore}. Tiada akaun, tiada pendaftaran, dan tiada apa-apa yang menyentuh mana-mana pelayan, iaitu ia boleh digunakan sebagai aplikasi sekali guna yang tidak meninggalkan apa-apa yang menjejaki anda selepas dipadamkan.",
  "home.about.body.crypto":
    "Setiap sesi menggunakan protokol {noise} untuk jabat tangan yang disahkan. Mesej yang disimpan menggunakan algoritma {ratchet}, iaitu walaupun peranti anda dikompromi kemudian, mesej lama anda kekal tidak boleh dibaca. Pemadaman kecemasan memusnahkan semua kunci dan mesej dalam masa kurang satu saat.",
  "home.about.body.internet":
    "Apabila anda dan kenalan anda berada di luar jangkauan Bluetooth, geganti {nostr} bertindak sebagai jambatan melalui internet, menggunakan mesej terus yang dibalut mengikut format {nip17}, jadi rangkaian mesh meluas ke seluruh dunia setiap kali anda berdua dalam talian. Sokongan {tor} juga tersedia pada iOS (melalui {arti}) dan Android (melalui {orbot}).",
  "home.about.optional.title": "Airhop mempunyai ciri pilihan yang boleh anda hidupkan:",
  "home.about.optional.payments.label": "Pembayaran luar talian:",
  "home.about.optional.payments.body":
    "Hantar dan terima pembayaran melalui rangkaian mesh menggunakan protokol {cashu} (Bitcoin sahaja).",
  "home.about.optional.ai.label": "AI luar talian:",
  "home.about.optional.ai.body":
    "Pembantu AI kecil pada peranti yang boleh menjawab soalan penting. Semua pemprosesan dan data kekal pada peranti anda.",
  "home.about.body.compatible":
    "Airhop serasi dengan bitchat pada peringkat protokol. Sebuah peranti Airhop dan sebuah peranti bitchat pada rangkaian mesh yang sama menemui satu sama lain secara automatik dan boleh bertukar mesej serta mesej terus tanpa sebarang konfigurasi.",

  "home.situations.eyebrow": "Bila anda memerlukannya",
  "home.situations.title": "Untuk hari rangkaian tumbang.",
  "home.situations.sub":
    "Bencana alam, gangguan internet, perhimpunan besar, atau hujung minggu biasa di luar liputan.",
  "home.situations.disaster.label": "Bencana",
  "home.situations.disaster.line":
    "Menara tumbang. Notis di papan sampai kepada sesiapa yang lalu di situ.",
  "home.situations.offgrid.label": "Luar grid",
  "home.situations.offgrid.line": "Hari kedua di denai. Bar isyarat terakhir hilang semalam.",
  "home.situations.protest.label": "Perhimpunan",
  "home.situations.protest.line": "Kod QR pada risalah membuka saluran tersulit untuk perarakan.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Tiada isyarat di kawasan itu. Mesej melompat melalui telefon orang yang tidak dikenali.",

  "home.showcase.eyebrow": "Lihat aplikasi",
  "home.showcase.title": "Aplikasi pemesejan biasa, luar talian.",
  "home.showcase.sub":
    "Perbualan, saluran, dompet dan identiti. Biasa di permukaan, dengan rangkaian mesh di bawah yang melakukan kerja.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Semua orang dalam jangkauan, disusun mengikut jarak. Tiada siapa perlu ditambah dahulu.",
  "home.showcase.mesh.alt":
    "Skrin Mesh aplikasi Airhop, memaparkan empat peranti berdekatan yang disusun pada radar mengikut kekuatan isyarat.",
  "home.showcase.chats.title": "Perbualan",
  "home.showcase.chats.caption":
    "Perbualan biasa. Telefon yang menyampaikan setiap mesej tidak boleh membukanya.",
  "home.showcase.chats.alt":
    "Perbualan mesej terus dalam Airhop semasa bekalan elektrik terputus, disampaikan melalui tiga telefon.",
  "home.showcase.channels.title": "Saluran",
  "home.showcase.channels.caption":
    "Bilik awam sekecil satu blok atau seluas satu wilayah, terbuka kepada sesiapa yang berada di situ.",
  "home.showcase.channels.alt":
    "Skrin perbualan aplikasi Airhop, menyenaraikan saluran awam yang terhad kepada satu blok, kejiranan, bandar dan wilayah.",
  "home.showcase.wallet.title": "Dompet",
  "home.showcase.wallet.caption":
    "Serahkan ecash kepada orang di sebelah anda melalui Bluetooth, tanpa satu pun telefon dalam talian.",
  "home.showcase.wallet.alt":
    "Skrin dompet aplikasi Airhop, memaparkan baki ecash yang boleh dihantar melalui Bluetooth.",
  "home.showcase.identity.title": "Identiti",
  "home.showcase.identity.caption":
    "Tiada pendaftaran, tiada nombor telefon, tiada e-mel. Hanya satu kunci yang tidak pernah meninggalkan telefon ini.",
  "home.showcase.identity.alt":
    "Skrin profil aplikasi Airhop, memaparkan identiti yang dijana pada peranti tanpa akaun.",

  "home.how.eyebrow": "Cara ia berfungsi",
  "home.how.title": "Rangkaian mesh terbentuk dengan sendirinya.",
  "home.how.sub":
    "Nod berdekatan membentuk rangkaian mesh yang membaiki diri melalui Bluetooth. Apabila ada internet, geganti Nostr meluaskannya, tanpa infrastruktur yang dikawal sesiapa.",
  "home.how.cta": "Baca seni bina penuh",
  "home.how.discover.title": "Menemui",
  "home.how.discover.line":
    "Telefon yang menjalankan Airhop atau bitchat menemui satu sama lain secara automatik melalui Bluetooth. Tiada pemasangan, tiada persediaan.",
  "home.how.relay.title": "Menyampaikan",
  "home.how.relay.line":
    "Mesej melompat dari telefon ke telefon, sehingga tujuh lompatan. Telefon di antaranya tidak pernah melihat apa yang dibawanya.",
  "home.how.reach.title": "Menjangkau lebih jauh",
  "home.how.reach.line":
    "Apabila ada internet, geganti Nostr membawa perbualan yang sama lebih jauh, jika mahu melalui Tor.",
  "home.how.swipe": "leret untuk meneroka",
  "home.how.diagram": "Mesh BLE · rangkaian tempatan antara peranti",
  "home.how.legend.node": "Nod mesh BLE (luar talian)",
  "home.how.legend.relay": "Penyampaian berbilang lompatan (disulitkan Noise XX)",
  "home.how.legend.bitchat": "Serasi bitchat pada rangkaian mesh yang sama",
  "home.how.legend.nostr": "Jambatan Nostr (internet, apabila dalam talian)",

  "home.map.aria": "Peta dunia lokasi geganti Nostr",
  "home.map.summary": "Jambatan Nostr · {relays} di {locations} di seluruh dunia",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Apa yang ia lakukan",
  "home.features.title": "Aplikasi pemesejan sebenar, bukan demo.",
  "home.features.sub":
    "Perbualan, identiti, rangkaian dan wang. Semuanya dibina untuk berfungsi tanpa isyarat, tanpa akaun, dan tanpa apa-apa di tengah.",

  "home.features.messaging.title": "Pemesejan",
  "home.features.messaging.summary":
    "Semua yang ada pada aplikasi pemesejan, dengan sifar infrastruktur di belakangnya.",
  "home.features.messaging.dms.name": "Mesej terus peribadi",
  "home.features.messaging.dms.line":
    "Disulitkan hujung ke hujung, dengan pengesahan hantar dan baca.",
  "home.features.messaging.location.name": "Saluran lokasi",
  "home.features.messaging.location.line":
    "Bilik yang terikat pada sesuatu tempat, dari satu blok hingga satu wilayah.",
  "home.features.messaging.groups.name": "Saluran dan kumpulan peribadi",
  "home.features.messaging.groups.line":
    "Pautan jemputan untuk sebuah bilik, atau senarai bertandatangan sehingga 16 orang.",
  "home.features.messaging.board.name": "Papan notis",
  "home.features.messaging.board.line":
    "Notis yang disematkan pada sesuatu kawasan sehingga tujuh hari.",
  "home.features.messaging.voice.name": "Suara langsung",
  "home.features.messaging.voice.line":
    "Tekan dan tahan mikrofon lalu bercakap dengan sesiapa dalam jangkauan, seperti walkie-talkie.",
  "home.features.messaging.notes.name": "Nota suara",
  "home.features.messaging.notes.line":
    "Audio yang dirakam, lebih pantas daripada menaip arah jalan.",
  "home.features.messaging.files.name": "Foto, video dan fail",
  "home.features.messaging.files.line": "Sebarang format, sehingga 1 MB, tanpa perlukan isyarat.",
  "home.features.messaging.forward.name": "Simpan dan sampaikan",
  "home.features.messaging.forward.line":
    "Dimeterai dan dibawa oleh telefon berdekatan sehingga sampai kepada penerima.",

  "home.features.identity.title": "Identiti",
  "home.features.identity.summary": "Tiada apa untuk didaftarkan, tiada apa untuk dirampas.",
  "home.features.identity.keys.name": "Identiti pasangan kunci",
  "home.features.identity.keys.line":
    "Dijana pada telefon ini, disimpan dalam rantai kunci sistem.",
  "home.features.identity.names.name": "Nama yang mudah dibaca",
  "home.features.identity.names.line":
    "Diterbitkan daripada kunci anda, jadi tiada siapa boleh mengambil nama anda.",
  "home.features.identity.qr.name": "Kenalan melalui QR",
  "home.features.identity.qr.line": "Satu imbasan membawa kunci mereka, bukan hanya nama.",
  "home.features.identity.panic.name": "Pemadaman kecemasan",
  "home.features.identity.panic.line":
    "Setiap kunci dan setiap mesej dimusnahkan dalam masa kurang satu saat.",

  "home.features.networking.title": "Rangkaian",
  "home.features.networking.summary": "Telefon itulah rangkaiannya.",
  "home.features.networking.mesh.name": "Mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Tanpa internet, tanpa penghala, pada telefon yang orang sudah miliki.",
  "home.features.networking.bridge.name": "Jambatan mesh",
  "home.features.networking.bridge.line":
    "Menghubungkan perbualan awam anda dengan kumpulan berdekatan yang di luar jangkauan.",
  "home.features.networking.wifi.name": "Laluan pantas WiFi",
  "home.features.networking.wifi.line":
    "Pemindahan lebih pantas antara dua Android atau dua iPhone.",
  "home.features.networking.bitchat.name": "Serasi dengan bitchat",
  "home.features.networking.bitchat.line":
    "Kedua-dua aplikasi menyertai rangkaian mesh yang sama tanpa persediaan.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Satu tambahan, bukan syarat.",
  "home.features.internet.nostr.name": "Sandaran Nostr",
  "home.features.internet.nostr.line":
    "Mesej terus dan saluran lokasi terus mengalir di luar jangkauan radio.",
  "home.features.internet.relays.name": "Penemuan geo-geganti",
  "home.features.internet.relays.line": "Lebih 300 geganti awam bebas, tiada satu pun milik kami.",
  "home.features.internet.gateway.name": "Get laluan internet",
  "home.features.internet.gateway.line":
    "Pinjamkan sambungan anda supaya telefon luar talian berdekatan dapat mencapai saluran lokasi.",
  "home.features.internet.tor.name": "Penyepaduan Tor",
  "home.features.internet.tor.line":
    "Dilalukan pada kedua-dua platform, jadi geganti tidak pernah melihat IP anda.",

  "home.features.optional.title": "Pilihan",
  "home.features.optional.summary": "Dimatikan secara lalai. Dihidupkan bila anda mahu.",
  "home.features.optional.cashu.name": "Ecash Cashu",
  "home.features.optional.cashu.line":
    "Bayar orang di sebelah anda tanpa satu pun telefon dalam talian.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Tambah nilai atau keluarkan dalam bitcoin melalui rangkaian Lightning.",
  "home.features.optional.ai.name": "AI setempat",
  "home.features.optional.ai.line": "Jawapan pada peranti, tiada apa keluar dari telefon.",
  "home.features.optional.social.name": "Jambatan sosial",
  "home.features.optional.social.line": "Bluesky dan Mastodon dengan identiti yang sama.",

  "home.compare.eyebrow": "Perbandingan",
  "home.compare.title": "Luar talian, tanpa perkakasan tambahan, dan terbuka.",
  "home.compare.sub":
    "Setiap aplikasi di sini bagus dalam sesuatu. Hanya sebahagian yang masih berfungsi apabila rangkaian tidak.",
  "home.compare.col.project": "Projek",
  "home.compare.col.transport": "Pengangkutan",
  "home.compare.col.encryption": "Penyulitan",
  "home.compare.col.offline": "Berfungsi luar talian",
  "home.compare.col.hardware_free": "Tanpa perkakasan tambahan",
  "home.compare.col.open_source": "Sumber terbuka",
  "home.compare.mark.yes": "Ya",
  "home.compare.mark.no": "Tidak",
  "home.compare.mark.partial": "Sebahagian, kliennya sumber terbuka, pelayannya tidak",
  "home.compare.mark.partial_hint": "Kliennya sumber terbuka, pelayannya tidak",
  "home.compare.transport.servers": "Pelayan berpusat",
  "home.compare.transport.onion": "Penghalaan bawang (nod perkhidmatan)",
  "home.compare.transport.nostr": "Geganti Nostr",
  "home.compare.transport.lora": "Radio LoRa",
  "home.compare.transport.sub_ghz": "Radio sub-GHz proprietari",

  "home.explore.eyebrow": "Terbuka dan jujur",
  "home.explore.title": "Setiap dakwaan di sini boleh disemak.",
  "home.explore.sub":
    "Kod, protokol dan rancangan adalah umum. Batasannya juga. Semak sendiri sebelum mempercayai kata-kata kami.",
  "home.explore.audit.chip": "Audit belum dijalankan",
  "home.explore.audit.headline": "Airhop belum menjalani audit keselamatan luaran.",
  "home.explore.audit.body":
    "{headline} Semua kod disemak sendiri dan dilalukan melalui {review} sebelum dikeluarkan, dan pustaka kriptografi yang digunakannya telah diaudit oleh Cure53, tetapi itu bukan pengganti audit rasmi bagi aplikasi itu sendiri. Satu audit dirancang untuk {version}. Sehingga itu, jangan bergantung padanya untuk kegunaan sensitif.",
  "home.explore.audit.link.review": "ejen semakan keselamatan",
  "home.explore.source.title": "Kod sumber",
  "home.explore.source.desc":
    "Semuanya di GitHub di bawah lesen MIT. Isu, pull request dan perbincangan terbuka.",
  "home.explore.protocol.title": "Spesifikasi protokol",
  "home.explore.protocol.desc":
    "Format penghantaran yang tepat, UUID BLE dan pemalar, dikongsi dengan bitchat.",
  "home.explore.architecture.title": "Seni bina",
  "home.explore.architecture.desc":
    "Pecahan teknikal penuh, daripada menekan hantar hingga bait pada radio.",
  "home.explore.roadmap.title": "Pelan hala tuju",
  "home.explore.roadmap.desc":
    "Sasaran versi dari v0.5.0 hingga v2.0.0, termasuk audit yang dirancang.",
  "home.explore.vision.title": "Visi",
  "home.explore.vision.desc":
    "Mengapa Airhop wujud, dan prinsip yang tidak berubah di bawah tekanan.",
  "home.explore.brand.title": "Kit jenama",
  "home.explore.brand.desc":
    "Burung piksel, token warna dan tipografi, bahan akhbar dan teks siap sedia.",

  "home.contribute.eyebrow": "Sokong projek ini",
  "home.contribute.title": "Bebas, dan terbuka.",
  "home.contribute.sub":
    "Tiada pelabur, tiada iklan, dan tiada versi berbayar. Semua ciri kekal percuma pada mana-mana keadaan, dan kerja ini dibiayai oleh mereka yang mendapati ia berguna.",
  "home.contribute.contribute.chip": "Menyumbang",
  "home.contribute.contribute.body":
    "Beri bintang kepada repositori, buka isu dan hantar pull request. Laporan pepijat, cadangan ciri dan sumbangan kod semuanya dialu-alukan.",
  "home.contribute.contribute.cta": "Lihat di GitHub",
  "home.contribute.sponsor.chip": "Tajaan",
  "home.contribute.sponsor.body":
    "Jika Airhop berguna kepada anda, sumbangan sekali sahaja atau tajaan berulang banyak membantu memastikan pembangunan berterusan.",
  "home.contribute.sponsor.donate": "Derma sekali",
  "home.contribute.sponsor.github": "Tajaan di GitHub",

  "page.architecture.eyebrow": "Dokumentasi",
  "page.architecture.title": "Seni bina",
  "page.architecture.toc": "Pada halaman ini",

  "page.faq.eyebrow": "Soalan lazim",
  "page.faq.title": "Soalan lazim",
  "page.faq.meta": "Soalan biasa tentang Airhop.",
  "page.faq.contact":
    "Soalan yang tidak dijawab di sini boleh dihantar ke {email} atau dibangkitkan dengan membuka perbincangan di {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Akan datang",
  "page.blogs.body":
    "Tulisan tentang rangkaian mesh, privasi dan perisian mengutamakan luar talian.",

  "page.brand.eyebrow": "Jenama",
  "page.brand.title": "Kit Jenama",
  "page.brand.meta":
    "Bahan dan peraturan untuk memaparkan Airhop dalam artikel, penyenaraian gedung, ceramah atau README. Bebas digunakan sebagai rujukan dan untuk media.",

  "page.legal.eyebrow": "Perundangan",
  "page.privacy.title": "Dasar Privasi",
  "page.terms.title": "Terma Perkhidmatan",

  "page.notfound.title": "Halaman tidak ditemui",
  "page.notfound.body": "Halaman yang anda cari tidak wujud atau telah dipindahkan.",

  "page.english_only": "Halaman ini hanya tersedia dalam bahasa Inggeris.",

  "seo.breadcrumb.home": "Laman utama",

  "seo.home.title": "Airhop — Aplikasi pemesejan peribadi, mengutamakan luar talian",
  "seo.home.description":
    "Pemesejan peribadi antara peranti untuk iOS dan Android. Tanpa internet, tanpa pelayan, tanpa akaun. Berhubung melalui rangkaian mesh Bluetooth di mana-mana.",

  "seo.architecture.title": "Seni bina — Airhop",
  "seo.architecture.description":
    "Cara Airhop berfungsi dari atas ke bawah: identiti, pemilihan pengangkutan, rangkaian mesh Bluetooth, penyulitan, lapisan internet, Tor, ecash luar talian, AI pada peranti, dan format penghantaran yang serasi dengan bitchat.",
  "seo.architecture.breadcrumb": "Seni bina",
  "seo.architecture.headline": "Seni bina Airhop",
  "seo.architecture.summary":
    "Pecahan teknikal penuh Airhop: identiti, pengangkutan, rangkaian mesh Bluetooth, penyulitan, lapisan internet Nostr, Tor, dompet Cashu, pembantu AI pada peranti, dan format penghantaran.",

  "seo.faq.title": "Soalan Lazim — Airhop",
  "seo.faq.description":
    "Jawapan tentang pemesejan mesh Bluetooth Airhop, penyulitan, pembayaran luar talian, lapisan internet Nostr dan keserasian dengan bitchat.",
  "seo.faq.breadcrumb": "Soalan lazim",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description":
    "Tulisan tentang rangkaian mesh, privasi dan perisian mengutamakan luar talian.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Kit Jenama — Airhop",
  "seo.brand.description":
    "Kit jenama Airhop: lambang burung piksel, tanda perkataan, token warna dan tipografi, bahan akhbar dan teks siap sedia.",
  "seo.brand.breadcrumb": "Kit Jenama",

  "seo.privacy.title": "Dasar Privasi — Airhop",
  "seo.privacy.description":
    "Cara Airhop mengendalikan data: tanpa akaun, tanpa pelayan, tanpa penjejakan. Identiti dan mesej anda kekal pada peranti anda.",
  "seo.privacy.breadcrumb": "Dasar Privasi",

  "seo.terms.title": "Terma Perkhidmatan — Airhop",
  "seo.terms.description": "Terma yang mengawal penggunaan aplikasi dan laman web Airhop.",
  "seo.terms.breadcrumb": "Terma Perkhidmatan",

  "seo.notfound.title": "Halaman Tidak Ditemui — Airhop",
  "seo.notfound.description": "Halaman yang anda cari tidak wujud atau telah dipindahkan.",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "{count} geganti",
  },
  "home.map.locations": {
    other: "{count} lokasi",
  },
};

export const locale: Locale = { strings, plurals };
