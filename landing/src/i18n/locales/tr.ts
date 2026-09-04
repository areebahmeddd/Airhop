import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Ana sayfaya dön",
  "common.last_updated": "Son güncelleme: {date}",

  "nav.aria": "Ana gezinme",
  "nav.home": "Airhop ana sayfa",
  "nav.skip": "İçeriğe geç",
  "nav.menu.open": "Menüyü aç",
  "nav.menu.close": "Menüyü kapat",
  "nav.how_it_works": "Nasıl çalışır",
  "nav.architecture": "Mimari",
  "nav.faq": "SSS",

  "footer.aria": "Alt bilgi",
  "footer.tagline": "Özel mesh iletişimi",
  "footer.credit": "© {author} tarafından {heart} ile yapıldı",
  "footer.group.download": "İndir",
  "footer.group.resources": "Kaynaklar",
  "footer.group.social": "Sosyal",
  "footer.group.legal": "Hukuki",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "Mimari",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "SSS",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Kullanım Koşulları",
  "footer.link.privacy": "Gizlilik Politikası",
  "footer.link.license": "Proje Lisansı",

  "settings.theme.group": "Renk teması",
  "settings.theme.light": "Açık tema",
  "settings.theme.dark": "Koyu tema",
  "settings.language.label": "Dil",
  "settings.language.suggestion": "Bu sayfayı Türkçe görüntüle",
  "settings.language.dismiss": "Kapat",

  "home.hero.release": "En son sürüm",
  "home.hero.title": "İnternetsiz çalışan mesajlaşma.",
  "home.hero.body":
    "Yakındaki telefonlar bir Bluetooth mesh ağı kurar ve mesajlarınızı uçtan uca şifreli olarak iletir. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Sunucu yok",
  "home.hero.body.no_accounts": "hesap yok",
  "home.hero.body.no_tracking": "takip yok",
  "home.hero.download": "Uygulamayı indir",
  "home.hero.badges": "MIT lisanslı · Ücretsiz ve açık kaynak · bitchat ile uyumlu",
  "home.hero.group.mobile": "Mobil",
  "home.hero.group.desktop": "Masaüstü",
  "home.hero.option.zapstore": "Nostr üzerinde imzalı",
  "home.hero.option.apk": "Doğrudan indirme",
  "home.hero.option.soon": "Yakında",

  "home.about.eyebrow": "Airhop nedir",
  "home.about.title": "Çoğu uygulama merkezi bir sunucuya bağımlıdır.",
  "home.about.sub":
    "Bir sunucu izlenebilir, kapatılabilir ya da engellenebilir. Airhop'un sunucusu yok, dolayısıyla baskı yapılacak bir şirket ve kapatılacak bir hizmet de yok.",
  "home.about.card": "Teknik bakış",
  "home.about.link.mesh": "Bluetooth Low Energy mesh ağı",
  "home.about.link.wire_protocol": "iletim protokolü",
  "home.about.body.built":
    "Airhop, {mesh} üzerinden özel eşler arası mesajlaşma için iOS ve Android'e yönelik açık kaynaklı bir uygulamadır. {bitchat} temeli üzerine kurulmuştur; onun {wire_protocol} ve güvenlik modelini yeniden kullanır, ardından bunları çevrimdışı {ecash} ödemeleri ve çevrimdışı yapay zekâ ile genişletir. Hiçbir internet bağlantısı olmadan çalışır ve mesajlar yakındaki cihazlar arasında otomatik olarak iletilir (iç mekânda sekme başına yaklaşık 10 ila 30 metre, açık alanda daha fazla), 7 sekmeye kadar.",
  "home.about.body.identity":
    "Kimliğiniz, cihazınızda üretilen ve {ios_keychain} ya da {android_keystore} içinde saklanan bir {ed25519} anahtar çiftidir. Hesap yok, kayıt yok ve herhangi bir sunucuya dokunan hiçbir şey yok; yani silindikten sonra size geri götürecek hiçbir iz bırakmayan tek kullanımlık bir uygulama olarak kullanılabilir.",
  "home.about.body.crypto":
    "Her oturum, kimliği doğrulanmış bir el sıkışma için {noise} protokolünü kullanır. Saklanan mesajlar {ratchet} algoritmasını kullanır; yani cihazınız daha sonra ele geçirilse bile geçmiş mesajlarınız okunamaz kalır. Acil silme, tüm anahtarları ve mesajları bir saniyeden kısa sürede yok eder.",
  "home.about.body.internet":
    "Siz ve bir kişiniz Bluetooth menzilinin dışındayken {nostr} röleleri internet üzerinden köprü görevi görür; {nip17} biçiminde paketlenmiş doğrudan mesajlar kullanılır, böylece ikiniz de çevrimiçi olduğunuzda mesh ağı dünya geneline uzanır. {tor} desteği hem iOS'ta hem de Android'de {arti} ile mevcuttur; Tor’u engelleyen ağlar için {obfs4} ve {snowflake} köprüleri de var.",
  "home.about.optional.title": "Airhop'ta açabileceğiniz isteğe bağlı özellikler var:",
  "home.about.optional.payments.label": "Çevrimdışı ödemeler:",
  "home.about.optional.payments.body":
    "{cashu} protokolünü kullanarak mesh ağı üzerinden ödeme gönderin ve alın (yalnızca Bitcoin).",
  "home.about.optional.ai.label": "Çevrimdışı yapay zekâ:",
  "home.about.optional.ai.body":
    "Önemli soruları yanıtlayabilen, cihaz üzerinde çalışan küçük bir yapay zekâ asistanı. Tüm işlem ve veriler cihazınızda kalır.",
  "home.about.body.compatible":
    "Airhop, protokol düzeyinde bitchat ile uyumludur. Aynı mesh ağındaki bir Airhop cihazı ile bir bitchat cihazı birbirini otomatik olarak bulur ve hiçbir ayar yapmadan mesaj ve doğrudan mesaj alışverişi yapabilir.",

  "home.situations.eyebrow": "Ne zaman gerekir",
  "home.situations.title": "Şebekenin çöktüğü gün için.",
  "home.situations.sub":
    "Doğal afetler, internet kesintileri, kitlesel protestolar ya da kapsama alanı dışında sıradan bir hafta sonu.",
  "home.situations.disaster.label": "Afet",
  "home.situations.disaster.line":
    "Baz istasyonları çökmüş. Panodaki bir duyuru oradan geçen herkese ulaşır.",
  "home.situations.offgrid.label": "Şebeke dışı",
  "home.situations.offgrid.line": "Patikada ikinci gün. Son sinyal çubuğu dün kayboldu.",
  "home.situations.protest.label": "Protesto",
  "home.situations.protest.line": "Bir el ilanındaki QR kodu, yürüyüş için şifreli bir kanal açar.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Alanda sinyal yok. Mesajlar yabancıların telefonları üzerinden sekiyor.",

  "home.showcase.eyebrow": "Uygulamayı gör",
  "home.showcase.title": "Sıradan bir mesajlaşma uygulaması, çevrimdışı.",
  "home.showcase.sub":
    "Sohbetler, kanallar, bir cüzdan ve bir kimlik. Yüzeyde tanıdık, altında işi yapan bir mesh ağı.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Menzildeki herkes, ne kadar yakın olduklarına göre yerleştirilmiş. Kimseyi önceden eklemek gerekmiyor.",
  "home.showcase.mesh.alt":
    "Airhop uygulamasının Mesh ekranı; yakındaki dört eş, sinyal gücüne göre bir radar üzerinde dizilmiş.",
  "home.showcase.chats.title": "Sohbetler",
  "home.showcase.chats.caption": "Sıradan konuşmalar. Her mesajı ileten telefonlar onu açamaz.",
  "home.showcase.chats.alt":
    "Elektrik kesintisi sırasında Airhop'ta üç telefon üzerinden iletilen bir doğrudan mesaj konuşması.",
  "home.showcase.channels.title": "Kanallar",
  "home.showcase.channels.caption":
    "Bir sokak kadar küçük ya da bir bölge kadar geniş açık odalar, orada olan herkese açık.",
  "home.showcase.channels.alt":
    "Airhop uygulamasının sohbet ekranı; sokak, mahalle, şehir ve bölge ile sınırlı açık kanalları listeliyor.",
  "home.showcase.wallet.title": "Cüzdan",
  "home.showcase.wallet.caption":
    "Yanınızdaki kişiye Bluetooth ile ecash verin, iki telefon da çevrimdışıyken.",
  "home.showcase.wallet.alt":
    "Airhop uygulamasının cüzdan ekranı; Bluetooth ile gönderilebilen bir ecash bakiyesi gösteriliyor.",
  "home.showcase.identity.title": "Kimlik",
  "home.showcase.identity.caption":
    "Kayıt yok, telefon numarası yok, e-posta yok. Yalnızca bu telefondan hiç çıkmayan bir anahtar.",
  "home.showcase.identity.alt":
    "Airhop uygulamasının profil ekranı; cihazda üretilmiş, hesapsız bir kimlik gösteriliyor.",

  "home.how.eyebrow": "Nasıl çalışır",
  "home.how.title": "Mesh ağı kendiliğinden kurulur.",
  "home.how.sub":
    "Yakındaki düğümler Bluetooth üzerinden kendini onaran bir mesh ağı kurar. İnternet olduğunda Nostr röleleri bunu genişletir; kimsenin denetlediği bir altyapı olmadan.",
  "home.how.cta": "Mimarinin tamamını okuyun",
  "home.how.discover.title": "Keşif",
  "home.how.discover.line":
    "Airhop ya da bitchat çalıştıran telefonlar Bluetooth üzerinden birbirini otomatik bulur. Eşleştirme yok, kurulum yok.",
  "home.how.relay.title": "İletim",
  "home.how.relay.line":
    "Bir mesaj telefondan telefona, yedi sekmeye kadar sıçrar. Aradaki telefonlar taşıdıkları şeyi asla görmez.",
  "home.how.reach.title": "Daha uzağa",
  "home.how.reach.line":
    "İnternet olduğunda Nostr röleleri aynı konuşmayı daha uzağa taşır, istenirse Tor üzerinden.",
  "home.how.swipe": "keşfetmek için kaydırın",
  "home.how.diagram": "BLE mesh · yerel eşler arası ağ",
  "home.how.legend.node": "BLE mesh düğümü (çevrimdışı)",
  "home.how.legend.relay": "Çok sekmeli iletim (Noise XX şifreli)",
  "home.how.legend.bitchat": "Aynı mesh ağında bitchat uyumlu",
  "home.how.legend.nostr": "Nostr köprüsü (internet, çevrimiçiyken)",

  "home.map.aria": "Nostr rölelerinin konumlarının dünya haritası",
  "home.map.summary": "Nostr köprüsü · dünya genelinde {locations} içinde {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Neler yapar",
  "home.features.title": "Gerçek bir mesajlaşma uygulaması, demo değil.",
  "home.features.sub":
    "Sohbet, kimlik, ağ ve para. Hepsi sinyal olmadan, hesap olmadan ve arada hiçbir şey olmadan çalışmak üzere kurulmuş.",

  "home.features.messaging.title": "Mesajlaşma",
  "home.features.messaging.summary":
    "Bir mesajlaşma uygulamasında olan her şey, arkasında sıfır altyapıyla.",
  "home.features.messaging.dms.name": "Özel doğrudan mesajlar",
  "home.features.messaging.dms.line": "Uçtan uca şifreli, iletim ve okundu bilgisiyle.",
  "home.features.messaging.location.name": "Konum kanalları",
  "home.features.messaging.location.line": "Bir yere bağlı odalar, bir sokaktan bir bölgeye kadar.",
  "home.features.messaging.groups.name": "Özel kanallar ve gruplar",
  "home.features.messaging.groups.line":
    "Bir oda için davet bağlantıları ya da en fazla 16 kişilik imzalı bir liste.",
  "home.features.messaging.board.name": "İlan panosu",
  "home.features.messaging.board.line":
    "Bir alana en fazla yedi gün boyunca iliştirilen duyurular.",
  "home.features.messaging.voice.name": "Canlı ses",
  "home.features.messaging.voice.line":
    "Mikrofonu basılı tutun ve menzildeki herkesle konuşun, telsiz gibi.",
  "home.features.messaging.notes.name": "Sesli notlar",
  "home.features.messaging.notes.line": "Kaydedilmiş ses, tarif yazmaktan daha hızlı.",
  "home.features.messaging.files.name": "Fotoğraf, video ve dosyalar",
  "home.features.messaging.files.line": "Her biçim, 1 MiB'a kadar, sinyale gerek olmadan.",
  "home.features.messaging.forward.name": "Sakla ve ilet",
  "home.features.messaging.forward.line":
    "Mühürlenir ve alıcısına ulaşana dek yakındaki bir telefon tarafından taşınır.",

  "home.features.identity.title": "Kimlik",
  "home.features.identity.summary": "Kaydedilecek bir şey yok, el konulacak bir şey yok.",
  "home.features.identity.keys.name": "Anahtar çifti kimliği",
  "home.features.identity.keys.line":
    "Bu telefonda üretilir, sistemin anahtar zincirinde saklanır.",
  "home.features.identity.names.name": "Okunabilir adlar",
  "home.features.identity.names.line": "Anahtarınızdan türetilir, böylece kimse sizinkini alamaz.",
  "home.features.identity.qr.name": "QR ile kişiler",
  "home.features.identity.qr.line": "Tek tarama yalnızca adlarını değil, anahtarlarını da taşır.",
  "home.features.identity.panic.name": "Acil silme",
  "home.features.identity.panic.line":
    "Her anahtar ve her mesaj bir saniyeden kısa sürede yok edilir.",

  "home.features.networking.title": "Ağ",
  "home.features.networking.summary": "Telefonların kendisi ağdır.",
  "home.features.networking.mesh.name": "Bluetooth mesh",
  "home.features.networking.mesh.line":
    "İnternet yok, yönlendirici yok; insanların zaten sahip olduğu telefonlarda.",
  "home.features.networking.bridge.name": "Mesh köprüsü",
  "home.features.networking.bridge.line":
    "Açık sohbetinizi menzil dışındaki yakın bir kalabalıkla birleştirir.",
  "home.features.networking.wifi.name": "WiFi hızlı yolu",
  "home.features.networking.wifi.line": "İki Android ya da iki iPhone arasında daha hızlı aktarım.",
  "home.features.networking.bitchat.name": "bitchat uyumlu",
  "home.features.networking.bitchat.line":
    "İki uygulama da hiçbir kurulum olmadan aynı mesh ağına katılır.",

  "home.features.internet.title": "İnternet",
  "home.features.internet.summary": "Bir uzantı, asla bir zorunluluk değil.",
  "home.features.internet.nostr.name": "Nostr yedeği",
  "home.features.internet.nostr.line":
    "Doğrudan mesajlar ve konum kanalları telsiz menzilinin ötesinde de akmayı sürdürür.",
  "home.features.internet.relays.name": "Coğrafi röle keşfi",
  "home.features.internet.relays.line": "300'den fazla bağımsız açık röle, hiçbiri bize ait değil.",
  "home.features.internet.gateway.name": "İnternet ağ geçidi",
  "home.features.internet.gateway.line":
    "Bağlantınızı ödünç verin ki yakındaki çevrimdışı bir telefon konum kanallarına ulaşsın.",
  "home.features.internet.tor.name": "Tor entegrasyonu",
  "home.features.internet.tor.line":
    "Her iki platformda da yönlendirilir, böylece röleler IP adresinizi asla görmez.",

  "home.features.optional.title": "İsteğe bağlı",
  "home.features.optional.summary": "Varsayılan olarak kapalı. İstediğinizde açık.",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "Hiçbir telefon çevrimiçi değilken yanınızdaki kişiye ödeme yapın.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Lightning ağı üzerinden bitcoin ile yükleyin ya da çekin.",
  "home.features.optional.ai.name": "Yerel yapay zekâ",
  "home.features.optional.ai.line": "Cihaz üzerinde yanıtlar, telefondan hiçbir şey çıkmaz.",
  "home.features.optional.social.name": "Sosyal köprüler",
  "home.features.optional.social.line": "Aynı kimlikle Bluesky ve Mastodon.",

  "home.compare.eyebrow": "Karşılaştırma",
  "home.compare.title": "Çevrimdışı, ek donanımsız ve açık.",
  "home.compare.sub":
    "Buradaki her uygulama bir konuda iyi. Ama yalnızca bazıları şebeke çalışmadığında çalışmayı sürdürüyor.",
  "home.compare.col.project": "Proje",
  "home.compare.col.transport": "Taşıma",
  "home.compare.col.encryption": "Şifreleme",
  "home.compare.col.offline": "Çevrimdışı çalışır",
  "home.compare.col.hardware_free": "Ek donanımsız",
  "home.compare.col.open_source": "Açık kaynak",
  "home.compare.mark.yes": "Evet",
  "home.compare.mark.no": "Hayır",
  "home.compare.mark.partial": "Kısmen, istemciler açık kaynak, sunucular değil",
  "home.compare.mark.partial_hint": "İstemciler açık kaynak, sunucular değil",
  "home.compare.transport.servers": "Merkezi sunucular",
  "home.compare.transport.onion": "Soğan yönlendirme (hizmet düğümleri)",
  "home.compare.transport.nostr": "Nostr röleleri",
  "home.compare.transport.lora": "LoRa telsiz",
  "home.compare.transport.sub_ghz": "Tescilli sub-GHz telsiz",

  "home.explore.eyebrow": "Açık ve dürüst",
  "home.explore.title": "Buradaki her iddia doğrulanabilir.",
  "home.explore.sub":
    "Kod, protokol ve planlar herkese açık. Sınırlar da öyle. Bize inanmadan önce kendiniz doğrulayın.",
  "home.explore.audit.chip": "Denetim bekleniyor",
  "home.explore.audit.headline": "Airhop henüz dış bir güvenlik denetiminden geçmedi.",
  "home.explore.audit.body":
    "{headline} Tüm kod bizzat gözden geçirilir ve yayımlanmadan önce bir {review} üzerinden geçirilir; kullandığı kriptografi kütüphanesi de Cure53 tarafından denetlenmiştir, ancak bu, uygulamanın kendisinin resmi denetiminin yerini tutmaz. {version} için bir denetim planlanıyor. O zamana kadar hassas kullanımlar için buna güvenmeyin.",
  "home.explore.audit.link.review": "güvenlik incelemesi aracı",
  "home.explore.source.title": "Kaynak kodu",
  "home.explore.source.desc":
    "Her şey GitHub'da MIT lisansıyla. Konular, çekme istekleri ve tartışmalar açık.",
  "home.explore.protocol.title": "Protokol belirtimi",
  "home.explore.protocol.desc":
    "Tam iletim biçimi, BLE UUID'leri ve sabitler, bitchat ile paylaşılıyor.",
  "home.explore.architecture.title": "Mimari",
  "home.explore.architecture.desc":
    "Gönder'e dokunmaktan telsizdeki baytlara kadar tam teknik döküm.",
  "home.explore.roadmap.title": "Yol haritası",
  "home.explore.roadmap.desc": "v0.5.0'dan v2.0.0'a sürüm hedefleri, planlanan denetim dahil.",
  "home.explore.vision.title": "Vizyon",
  "home.explore.vision.desc": "Airhop neden var ve baskı altında değişmeyen ilkeler.",
  "home.explore.brand.title": "Marka kiti",
  "home.explore.brand.desc":
    "Piksel kuş, renk ve tipografi belirteçleri, basın malzemeleri ve hazır metinler.",

  "home.contribute.eyebrow": "Bu projeyi destekleyin",
  "home.contribute.title": "Bağımsız ve açıkta.",
  "home.contribute.sub":
    "Yatırımcı yok, reklam yok, ücretli sürüm yok. Tüm özellikler her hâlükârda ücretsiz kalıyor ve bu iş, onu faydalı bulan insanlarca finanse ediliyor.",
  "home.contribute.contribute.chip": "Katkıda bulun",
  "home.contribute.contribute.body":
    "Depoya yıldız verin, konu açın ve çekme isteği gönderin. Hata bildirimleri, özellik önerileri ve kod katkıları hepsi memnuniyetle karşılanır.",
  "home.contribute.contribute.cta": "GitHub'da görüntüle",
  "home.contribute.sponsor.chip": "Sponsor ol",
  "home.contribute.sponsor.body":
    "Airhop size faydalı oluyorsa, tek seferlik bir bağış ya da düzenli bir sponsorluk geliştirmeyi sürdürmeye çok yardımcı olur.",
  "home.contribute.sponsor.donate": "Bir kez bağış yap",
  "home.contribute.sponsor.github": "GitHub'da sponsor ol",

  "page.architecture.eyebrow": "Belgeler",
  "page.architecture.title": "Mimari",
  "page.architecture.toc": "Bu sayfada",

  "page.faq.eyebrow": "SSS",
  "page.faq.title": "Sıkça sorulan sorular",
  "page.faq.meta": "Airhop hakkında sık sorulanlar.",
  "page.faq.contact":
    "Burada yanıtlanmayan sorular {email} adresine gönderilebilir ya da {github} üzerinde bir tartışma açılarak sorulabilir.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Yakında",
  "page.blogs.body": "Mesh ağları, gizlilik ve çevrimdışı öncelikli yazılım üzerine yazılar.",

  "page.brand.eyebrow": "Marka",
  "page.brand.title": "Marka Kiti",
  "page.brand.meta":
    "Airhop'u bir yazıda, bir mağaza sayfasında, bir sunumda ya da bir README'de kullanmak için malzemeler ve kurallar. Kaynak göstermek ve basın için serbestçe kullanılabilir.",

  "page.legal.eyebrow": "Hukuki",
  "page.privacy.title": "Gizlilik Politikası",
  "page.terms.title": "Kullanım Koşulları",

  "page.notfound.title": "Sayfa bulunamadı",
  "page.notfound.body": "Aradığınız sayfa mevcut değil ya da taşınmış.",

  "page.english_only": "Bu sayfa yalnızca İngilizce olarak mevcuttur.",

  "seo.breadcrumb.home": "Ana sayfa",

  "seo.home.title": "Airhop — Özel, çevrimdışı öncelikli mesajlaşma",
  "seo.home.description":
    "iOS ve Android için özel eşler arası mesajlaşma. İnternet yok, sunucu yok, hesap yok. Her yerde Bluetooth mesh ağı üzerinden iletişim kurun.",

  "seo.architecture.title": "Mimari — Airhop",
  "seo.architecture.description":
    "Airhop'un baştan sona nasıl çalıştığı: kimlik, taşıma seçimi, Bluetooth mesh ağı, şifreleme, internet katmanı, Tor, çevrimdışı ecash, cihaz üstü yapay zekâ ve bitchat uyumlu iletim biçimi.",
  "seo.architecture.breadcrumb": "Mimari",
  "seo.architecture.headline": "Airhop Mimarisi",
  "seo.architecture.summary":
    "Airhop'un tam teknik dökümü: kimlik, taşımalar, Bluetooth mesh ağı, şifreleme, Nostr internet katmanı, Tor, Cashu cüzdanı, cihaz üstü yapay zekâ asistanı ve iletim biçimi.",

  "seo.faq.title": "Sıkça Sorulan Sorular — Airhop",
  "seo.faq.description":
    "Airhop'un Bluetooth mesh mesajlaşması, şifreleme, çevrimdışı ödemeler, Nostr internet katmanı ve bitchat uyumluluğu hakkında yanıtlar.",
  "seo.faq.breadcrumb": "SSS",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Mesh ağları, gizlilik ve çevrimdışı öncelikli yazılım üzerine yazılar.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Marka Kiti — Airhop",
  "seo.brand.description":
    "Airhop marka kiti: piksel kuş simgesi, kelime markası, renk ve tipografi belirteçleri, basın malzemeleri ve hazır metinler.",
  "seo.brand.breadcrumb": "Marka Kiti",

  "seo.privacy.title": "Gizlilik Politikası — Airhop",
  "seo.privacy.description":
    "Airhop verileri nasıl ele alır: hesap yok, sunucu yok, takip yok. Kimliğiniz ve mesajlarınız cihazınızda kalır.",
  "seo.privacy.breadcrumb": "Gizlilik Politikası",

  "seo.terms.title": "Kullanım Koşulları — Airhop",
  "seo.terms.description": "Airhop uygulamasının ve web sitesinin kullanımını düzenleyen koşullar.",
  "seo.terms.breadcrumb": "Kullanım Koşulları",

  "seo.notfound.title": "Sayfa Bulunamadı — Airhop",
  "seo.notfound.description": "Aradığınız sayfa mevcut değil ya da taşınmış.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} röle",
    other: "{count} röle",
  },
  "home.map.locations": {
    one: "{count} konum",
    other: "{count} konum",
  },
};

export const locale: Locale = { strings, plurals };
