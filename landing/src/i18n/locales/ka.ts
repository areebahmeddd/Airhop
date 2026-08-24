import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "მთავარზე დაბრუნება",
  "common.last_updated": "ბოლოს განახლდა: {date}",

  "nav.aria": "მთავარი",
  "nav.home": "Airhop-ის მთავარი",
  "nav.skip": "შიგთავსზე გადასვლა",
  "nav.menu.open": "მენიუს გახსნა",
  "nav.menu.close": "მენიუს დახურვა",
  "nav.how_it_works": "როგორ მუშაობს",
  "nav.architecture": "არქიტექტურა",
  "nav.faq": "ხშირი კითხვები",

  "footer.aria": "ქვედა ნაწილი",
  "footer.tagline": "პირადი მეშ-კომუნიკაცია",
  "footer.credit": "© შექმნა {author}-მა {heart}-ით",
  "footer.group.download": "ჩამოტვირთვა",
  "footer.group.resources": "რესურსები",
  "footer.group.social": "სოციალური",
  "footer.group.legal": "სამართლებრივი",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "არქიტექტურა",
  "footer.link.blogs": "ბლოგი",
  "footer.link.faq": "ხშირი კითხვები",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "მომსახურების პირობები",
  "footer.link.privacy": "კონფიდენციალურობის პოლიტიკა",
  "footer.link.license": "პროექტის ლიცენზია",

  "settings.theme.group": "ფერის თემა",
  "settings.theme.light": "ღია თემა",
  "settings.theme.dark": "მუქი თემა",
  "settings.language.label": "ენა",
  "settings.language.suggestion": "იხილეთ ეს გვერდი ქართულად",
  "settings.language.dismiss": "დახურვა",

  "home.hero.release": "უახლესი გამოშვება",
  "home.hero.title": "შეტყობინებები, რომლებიც ინტერნეტის გარეშე მუშაობს.",
  "home.hero.body":
    "ახლომდებარე ტელეფონები ბლუთუზ-მეშს ქმნიან და თქვენს შეტყობინებებს შვიდ ბიჯამდე გადასცემენ, ბოლოდან ბოლომდე დაშიფრულად. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "სერვერების გარეშე",
  "home.hero.body.no_accounts": "ანგარიშების გარეშე",
  "home.hero.body.no_tracking": "თვალყურის დევნების გარეშე",
  "home.hero.download": "აპლიკაციის ჩამოტვირთვა",
  "home.hero.badges": "MIT ლიცენზია · უფასო და ღია კოდით · მუშაობს bitchat-თან",
  "home.hero.group.mobile": "მობილური",
  "home.hero.group.desktop": "დესკტოპი",
  "home.hero.option.f_droid": "ღია კოდის კატალოგი",
  "home.hero.option.apk": "პირდაპირი ჩამოტვირთვა",
  "home.hero.option.soon": "მალე",

  "home.about.eyebrow": "რა არის Airhop",
  "home.about.title": "აპლიკაციების უმეტესობა ცენტრალურ სერვერზეა დამოკიდებული.",
  "home.about.sub":
    "სერვერზე შეიძლება თვალყური ადევნონ, გამორთონ ან დაბლოკონ. Airhop-ს ასეთი არ აქვს, ამიტომ არც კომპანიაა, ვისზეც ზეწოლა მოხდება, და არც სერვისი, რომელსაც დახურავენ.",
  "home.about.card": "ტექნიკური მიმოხილვა",
  "home.about.link.mesh": "Bluetooth Low Energy მეში",
  "home.about.link.wire_protocol": "გადაცემის პროტოკოლი",
  "home.about.body.built":
    "Airhop არის ღია კოდის აპლიკაცია iOS-სა და Android-ისთვის, პირადი კვანძიდან კვანძამდე მიმოწერისთვის {mesh}-ზე. ის {bitchat}-ის საფუძველზეა აგებული, იყენებს მის {wire_protocol}-სა და უსაფრთხოების მოდელს, შემდეგ კი ავრცელებს ოფლაინ {ecash} გადახდებითა და ოფლაინ AI-ით. ის მუშაობს ინტერნეტის სრული არარსებობისასაც, შეტყობინებები კი ავტომატურად გადაეცემა ახლომდებარე მოწყობილობებს (შენობაში დაახლოებით 10-დან 30 მეტრამდე თითო ბიჯზე, ღია სივრცეში მეტიც), 7 ბიჯამდე.",
  "home.about.body.identity":
    "თქვენი ვინაობა არის {ed25519} გასაღებების წყვილი, რომელიც თქვენს მოწყობილობაზე იქმნება და ინახება {ios_keychain}-ში ან {android_keystore}-ში. არც ანგარიშებია, არც რეგისტრაცია და არაფერი, რაც სერვერს შეეხება, ამიტომ მისი გამოყენება ერთჯერად აპლიკაციადაც შეიძლება, რომელიც წაშლის შემდეგ არაფერს ტოვებს თქვენამდე მისასვლელად.",
  "home.about.body.crypto":
    "თითოეული სესია ავთენტიფიცირებული ხელის ჩამორთმევისთვის {noise} პროტოკოლს იყენებს. შენახული შეტყობინებები {ratchet} ალგორითმს იყენებს, ამიტომ მოგვიანებით მოწყობილობის ხელში ჩაგდების შემთხვევაშიც კი წარსული შეტყობინებები წაუკითხავი რჩება. საგანგებო წაშლა ყველა გასაღებსა და შეტყობინებას წამზე ნაკლებში ანადგურებს.",
  "home.about.body.internet":
    "როცა თქვენ და კონტაქტი ბლუთუზის მიღმა ხართ, {nostr} რელეები ინტერნეტ-ხიდად მუშაობს და {nip17} ფორმის შეფუთულ პირად შეტყობინებებს იყენებს, ასე რომ მეში გლობალურად ვრცელდება, სანამ ორივე ონლაინ ხართ. {tor}-ის მხარდაჭერაც არსებობს როგორც iOS-ზე ({arti}-ით), ისე Android-ზე ({orbot}-ით).",
  "home.about.optional.title":
    "Airhop-ს აქვს არასავალდებულო შესაძლებლობები, რომლებიც შეგიძლიათ ჩართოთ:",
  "home.about.optional.payments.label": "ოფლაინ გადახდები:",
  "home.about.optional.payments.body":
    "გაგზავნეთ და მიიღეთ გადახდები მეშით, {cashu} პროტოკოლის მეშვეობით (მხოლოდ Bitcoin).",
  "home.about.optional.ai.label": "ოფლაინ AI:",
  "home.about.optional.ai.body":
    "მცირე AI-ასისტენტი თავად მოწყობილობაზე, რომელსაც მნიშვნელოვან კითხვებზე პასუხის გაცემა შეუძლია. მთელი დამუშავება და მონაცემები თქვენს მოწყობილობაზე რჩება.",
  "home.about.body.compatible":
    "Airhop bitchat-თან თავსებადია გადაცემის დონეზე. ერთსა და იმავე მეშში მყოფი Airhop-ისა და bitchat-ის მოწყობილობები ერთმანეთს ავტომატურად აღმოაჩენენ და შეუძლიათ შეტყობინებებისა და პირადი შეტყობინებების გაცვლა ყოველგვარი კონფიგურაციის გარეშე.",

  "home.situations.eyebrow": "როცა გჭირდებათ",
  "home.situations.title": "იმ დღისთვის, როცა ქსელი დაეცემა.",
  "home.situations.sub":
    "სტიქიური უბედურებები, ინტერნეტის გათიშვა, მასობრივი აქციები ან ჩვეულებრივი შაბათ-კვირა ქსელის მიღმა.",
  "home.situations.disaster.label": "კატასტროფა",
  "home.situations.disaster.line":
    "ანძები დაცემულია. დაფაზე გაკრული განცხადება ყველას წვდება, ვინც გვერდით ჩაივლის.",
  "home.situations.offgrid.label": "ქსელს გარეთ",
  "home.situations.offgrid.line": "ბილიკზე მეორე დღეა. ბოლო ზოლი გუშინ გაქრა.",
  "home.situations.protest.label": "აქცია",
  "home.situations.protest.line": "ფლაერზე დატანილი QR კოდი მსვლელობისთვის დაშიფრულ არხს ხსნის.",
  "home.situations.festival.label": "ფესტივალი",
  "home.situations.festival.line":
    "ტერიტორიაზე კავშირი არ არის. შეტყობინებები უცნობების ტელეფონებით მიდის.",

  "home.showcase.eyebrow": "იხილეთ აპლიკაცია",
  "home.showcase.title": "ჩვეულებრივი მესენჯერი, ოფლაინ.",
  "home.showcase.sub":
    "მიმოწერები, არხები, საფულე და ვინაობა. ზედაპირზე ნაცნობი, ქვემოთ კი მეში აკეთებს საქმეს.",
  "home.showcase.mesh.title": "მეში",
  "home.showcase.mesh.caption":
    "ყველა, ვინც მიწვდომაშია, სიახლოვის მიხედვით განლაგებული. წინასწარ არავის დამატება არ სჭირდება.",
  "home.showcase.mesh.alt":
    "Airhop-ის აპლიკაციის მეშის ეკრანი, სადაც ოთხი ახლომდებარე კვანძი სიგნალის სიძლიერის მიხედვითაა რადარზე განლაგებული.",
  "home.showcase.chats.title": "მიმოწერები",
  "home.showcase.chats.caption":
    "ჩვეულებრივი საუბრები. ტელეფონები, რომლებიც თითოეულ შეტყობინებას გადასცემენ, მას ვერ ხსნიან.",
  "home.showcase.chats.alt":
    "პირადი მიმოწერა Airhop-ში დენის გათიშვისას, სამი ტელეფონით გადაცემული.",
  "home.showcase.channels.title": "არხები",
  "home.showcase.channels.caption":
    "საჯარო ოთახები ერთი კვარტლის ან მთელი რეგიონის ზომის, ღია ყველასთვის, ვინც იქაა.",
  "home.showcase.channels.alt":
    "Airhop-ის აპლიკაციის მიმოწერების ეკრანი, სადაც ჩამოთვლილია კვარტლის, უბნის, ქალაქისა და რეგიონის საჯარო არხები.",
  "home.showcase.wallet.title": "საფულე",
  "home.showcase.wallet.caption":
    "გადაეცით ecash გვერდით მდგომს ბლუთუზით, ისე რომ არცერთი ტელეფონი ონლაინ არ იყოს.",
  "home.showcase.wallet.alt":
    "Airhop-ის აპლიკაციის საფულის ეკრანი, სადაც ჩანს ecash-ის ბალანსი, რომლის გაგზავნაც ბლუთუზით შეიძლება.",
  "home.showcase.identity.title": "ვინაობა",
  "home.showcase.identity.caption":
    "არც რეგისტრაცია, არც ტელეფონის ნომერი, არც ელფოსტა. მხოლოდ გასაღები, რომელიც ამ ტელეფონს არასდროს ტოვებს.",
  "home.showcase.identity.alt":
    "Airhop-ის აპლიკაციის პროფილის ეკრანი, სადაც ჩანს მოწყობილობაზე შექმნილი ვინაობა ანგარიშის გარეშე.",

  "home.how.eyebrow": "როგორ მუშაობს",
  "home.how.title": "მეში თავად იქმნება.",
  "home.how.sub":
    "ახლომდებარე კვანძები ბლუთუზით თვითაღმდგენ მეშს ქმნიან. როცა ინტერნეტია, Nostr-ის რელეები მას აგრძელებენ, ისე რომ არავის კონტროლირებადი ინფრასტრუქტურა არ ერევა.",
  "home.how.cta": "სრული არქიტექტურის წაკითხვა",
  "home.how.discover.title": "აღმოჩენა",
  "home.how.discover.line":
    "Airhop-ის ან bitchat-ის მქონე ტელეფონები ერთმანეთს ბლუთუზით ავტომატურად პოულობენ. არც დაწყვილება, არც კონფიგურაცია.",
  "home.how.relay.title": "გადაცემა",
  "home.how.relay.line":
    "შეტყობინება ტელეფონიდან ტელეფონზე გადადის, შვიდ ბიჯამდე. შუალედური ტელეფონები ვერასდროს ხედავენ, რას ატარებენ.",
  "home.how.reach.title": "უფრო შორს მიწვდომა",
  "home.how.reach.line":
    "როცა ინტერნეტია, Nostr-ის რელეები იმავე საუბარს უფრო შორს მიაქვთ, სურვილისამებრ Tor-ის გავლით.",
  "home.how.swipe": "გადაასრიალეთ დასათვალიერებლად",
  "home.how.diagram": "BLE მეში · ლოკალური კვანძიდან კვანძამდე ქსელი",
  "home.how.legend.node": "BLE მეშის კვანძი (ოფლაინ)",
  "home.how.legend.relay": "მრავალბიჯიანი გადაცემა (Noise XX-ით დაშიფრული)",
  "home.how.legend.bitchat": "bitchat-თან თავსებადი იმავე მეშში",
  "home.how.legend.nostr": "Nostr-ხიდი (ინტერნეტი, როცა ონლაინ ხართ)",

  "home.map.aria": "Nostr-ის რელეების მდებარეობის მსოფლიო რუკა",
  "home.map.summary": "Nostr-ხიდი · {relays} {locations}-ში მსოფლიოს მასშტაბით",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "რას აკეთებს",
  "home.features.title": "ნამდვილი მესენჯერი, და არა დემო.",
  "home.features.sub":
    "მიმოწერა, ვინაობა, ქსელი და ფული. ყველაფერი ისეა აგებული, რომ იმუშაოს კავშირის, ანგარიშისა და შუამავლის გარეშე.",

  "home.features.messaging.title": "მიმოწერა",
  "home.features.messaging.summary":
    "ყველაფერი, რაც მესენჯერს აქვს, უკან ნულოვანი ინფრასტრუქტურით.",
  "home.features.messaging.dms.name": "პირადი შეტყობინებები",
  "home.features.messaging.dms.line":
    "ბოლოდან ბოლომდე დაშიფრული, მიწოდებისა და წაკითხვის დადასტურებით.",
  "home.features.messaging.location.name": "მდებარეობის არხები",
  "home.features.messaging.location.line": "ადგილთან მიბმული ოთახები, ერთი კვარტლიდან რეგიონამდე.",
  "home.features.messaging.groups.name": "პირადი არხები და ჯგუფები",
  "home.features.messaging.groups.line":
    "მოსაწვევი ბმულები ოთახისთვის, ან ხელმოწერილი სია 16 კაცამდე.",
  "home.features.messaging.board.name": "საინფორმაციო დაფა",
  "home.features.messaging.board.line": "ზონაზე მიმაგრებული განცხადებები შვიდ დღემდე.",
  "home.features.messaging.voice.name": "ცოცხალი ხმა",
  "home.features.messaging.voice.line":
    "დააჭირეთ მიკროფონს და ესაუბრეთ ყველას, ვინც მიწვდომაშია, რაციასავით.",
  "home.features.messaging.notes.name": "ხმოვანი ჩანაწერები",
  "home.features.messaging.notes.line": "ჩაწერილი აუდიო, მიმართულებების აკრეფაზე სწრაფი.",
  "home.features.messaging.files.name": "ფოტოები, ვიდეო და ფაილები",
  "home.features.messaging.files.line": "ნებისმიერი ფორმატი, 1 MiB-მდე, კავშირის გარეშე.",
  "home.features.messaging.forward.name": "შენახვა და გადაცემა",
  "home.features.messaging.forward.line":
    "დალუქული და ახლომდებარე ტელეფონით ტარებული, სანამ მათ არ მიაღწევს.",

  "home.features.identity.title": "ვინაობა",
  "home.features.identity.summary": "არაფერია დასარეგისტრირებელი, არაფერია ჩამოსართმევი.",
  "home.features.identity.keys.name": "გასაღებების წყვილი როგორც ვინაობა",
  "home.features.identity.keys.line":
    "ამ ტელეფონზე შექმნილი, სისტემის გასაღებთა სათავსოში შენახული.",
  "home.features.identity.names.name": "წასაკითხად გასაგები სახელები",
  "home.features.identity.names.line":
    "თქვენი გასაღებიდან მიღებული, ამიტომ თქვენსას ვერავინ წაგართმევთ.",
  "home.features.identity.qr.name": "QR-კონტაქტები",
  "home.features.identity.qr.line": "ერთი სკანირება მათ გასაღებებს ატარებს, და არა მხოლოდ სახელს.",
  "home.features.identity.panic.name": "საგანგებო წაშლა",
  "home.features.identity.panic.line": "ყველა გასაღები და შეტყობინება წამზე ნაკლებში ნადგურდება.",

  "home.features.networking.title": "ქსელი",
  "home.features.networking.summary": "ტელეფონები თავად არიან ქსელი.",
  "home.features.networking.mesh.name": "ბლუთუზ-მეში",
  "home.features.networking.mesh.line":
    "არც ინტერნეტი, არც როუტერი, იმ ტელეფონებზე, რომლებიც ხალხს უკვე აქვს.",
  "home.features.networking.bridge.name": "მეშ-ხიდი",
  "home.features.networking.bridge.line":
    "აკავშირებს თქვენს საჯარო მიმოწერას ახლომდებარე, მიწვდომის მიღმა მყოფ ჯგუფთან.",
  "home.features.networking.wifi.name": "WiFi-ის სწრაფი გზა",
  "home.features.networking.wifi.line": "უფრო სწრაფი გადაცემა ორ Android-ს ან ორ iPhone-ს შორის.",
  "home.features.networking.bitchat.name": "bitchat-თან თავსებადი",
  "home.features.networking.bitchat.line":
    "ორივე აპლიკაცია იმავე მეშს უერთდება კონფიგურაციის გარეშე.",

  "home.features.internet.title": "ინტერნეტი",
  "home.features.internet.summary": "გაფართოება და არასდროს მოთხოვნა.",
  "home.features.internet.nostr.name": "Nostr-ის სათადარიგო გზა",
  "home.features.internet.nostr.line":
    "პირადი შეტყობინებები და მდებარეობის არხები რადიოს მიღმაც აგრძელებს დინებას.",
  "home.features.internet.relays.name": "გეო-რელეების აღმოჩენა",
  "home.features.internet.relays.line":
    "300-ზე მეტი დამოუკიდებელი საჯარო რელე, არცერთი მათგანი ჩვენი არაა.",
  "home.features.internet.gateway.name": "ინტერნეტ-კარიბჭე",
  "home.features.internet.gateway.line":
    "ასესხეთ თქვენი კავშირი, რომ ახლომდებარე ოფლაინ ტელეფონმა მდებარეობის არხებს მიაღწიოს.",
  "home.features.internet.tor.name": "Tor-ის ინტეგრაცია",
  "home.features.internet.tor.line":
    "ორივე პლატფორმაზე გატარებული, ამიტომ რელეები თქვენს IP-ს ვერასდროს ხედავენ.",

  "home.features.optional.title": "არასავალდებულო",
  "home.features.optional.summary": "ნაგულისხმევად გამორთული. ჩართული, როცა მოგინდებათ.",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "გადაუხადეთ გვერდით მდგომს, ისე რომ არცერთი ტელეფონი ონლაინ არ იყოს.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "შეავსეთ ან გაიტანეთ bitcoin-ში Lightning-ის ქსელით.",
  "home.features.optional.ai.name": "ლოკალური AI",
  "home.features.optional.ai.line": "პასუხები თავად მოწყობილობაზე, ტელეფონს არაფერი ტოვებს.",
  "home.features.optional.social.name": "სოციალური ხიდები",
  "home.features.optional.social.line": "Bluesky და Mastodon იმავე ვინაობით.",

  "home.compare.eyebrow": "როგორ ედრება",
  "home.compare.title": "ოფლაინ, დამატებითი მოწყობილობის გარეშე და ღია.",
  "home.compare.sub":
    "აქ ყველა აპლიკაცია რაღაცაში კარგია. მხოლოდ ზოგი აგრძელებს მუშაობას მაშინ, როცა ქსელი აღარ მუშაობს.",
  "home.compare.col.project": "პროექტი",
  "home.compare.col.transport": "ტრანსპორტი",
  "home.compare.col.encryption": "დაშიფვრა",
  "home.compare.col.offline": "მუშაობს ოფლაინ",
  "home.compare.col.hardware_free": "დამატებითი მოწყობილობის გარეშე",
  "home.compare.col.open_source": "ღია კოდი",
  "home.compare.mark.yes": "დიახ",
  "home.compare.mark.no": "არა",
  "home.compare.mark.partial": "ნაწილობრივ, კლიენტები ღია კოდისაა, სერვერები არა",
  "home.compare.mark.partial_hint": "კლიენტები ღია კოდისაა, სერვერები არა",
  "home.compare.transport.servers": "ცენტრალიზებული სერვერები",
  "home.compare.transport.onion": "ხახვისებრი მარშრუტიზაცია (სერვის-კვანძები)",
  "home.compare.transport.nostr": "Nostr-ის რელეები",
  "home.compare.transport.lora": "LoRa რადიო",
  "home.compare.transport.sub_ghz": "საკუთრებაში მყოფი sub-GHz რადიო",

  "home.explore.eyebrow": "ღია და პატიოსანი",
  "home.explore.title": "აქ ყოველი მტკიცება შემოწმებადია.",
  "home.explore.sub":
    "კოდი, პროტოკოლი და გეგმები საჯაროა. შეზღუდვებიც. შეამოწმეთ თავად, სანამ ჩვენს სიტყვას დაუჯერებთ.",
  "home.explore.audit.chip": "აუდიტი მოსალოდნელია",
  "home.explore.audit.headline": "Airhop-ს ჯერ არ ჩაუტარებია გარე უსაფრთხოების აუდიტი.",
  "home.explore.audit.body":
    "{headline} მთელი კოდი პირადად მოწმდება და გამოშვებამდე {review}-ს გაივლის, ხოლო კრიპტოგრაფიული ბიბლიოთეკა, რომელსაც ის იყენებს, Cure53-ის მიერ არის აუდიტირებული, მაგრამ ეს თავად აპლიკაციის ფორმალურ აუდიტს არ ანაცვლებს. ერთი დაგეგმილია {version}-ისთვის. მანამდე ნუ დაეყრდნობით მას მგრძნობიარე შემთხვევებში.",
  "home.explore.audit.link.review": "უსაფრთხოების მიმოხილვის აგენტი",
  "home.explore.source.title": "წყაროს კოდი",
  "home.explore.source.desc":
    "ყველაფერი GitHub-ზე MIT-ის ქვეშ. ღიაა issue-ები, pull request-ები და განხილვები.",
  "home.explore.protocol.title": "პროტოკოლის სპეციფიკაცია",
  "home.explore.protocol.desc":
    "ზუსტი გადაცემის ფორმატი, BLE UUID-ები და მუდმივები, bitchat-თან საერთო.",
  "home.explore.architecture.title": "არქიტექტურა",
  "home.explore.architecture.desc":
    "სრული ტექნიკური ანალიზი, გაგზავნაზე დაჭერიდან რადიოში მიმავალ ბაიტებამდე.",
  "home.explore.roadmap.title": "გეგმა",
  "home.explore.roadmap.desc":
    "ვერსიების მიზნები v0.5.0-დან v2.0.0-მდე, დაგეგმილი აუდიტის ჩათვლით.",
  "home.explore.vision.title": "ხედვა",
  "home.explore.vision.desc":
    "რატომ არსებობს Airhop და პრინციპები, რომლებიც ზეწოლის ქვეშაც არ იცვლება.",
  "home.explore.brand.title": "ბრენდის ნაკრები",
  "home.explore.brand.desc":
    "პიქსელური ჩიტი, ფერისა და შრიფტის ტოკენები, პრესმასალები და მზა ტექსტები.",

  "home.contribute.eyebrow": "დაუჭირეთ მხარი ამ პროექტს",
  "home.contribute.title": "დამოუკიდებელი და ღიად.",
  "home.contribute.sub":
    "არც ინვესტორებია, არც რეკლამა და არც ფასიანი დონე. ყველა შესაძლებლობა ისედაც უფასო რჩება, სამუშაოს კი ისინი აფინანსებენ, ვისაც ის სასარგებლოდ მიაჩნია.",
  "home.contribute.contribute.chip": "წვლილის შეტანა",
  "home.contribute.contribute.body":
    "დაუყენეთ ვარსკვლავი რეპოზიტორიას, გახსენით issue-ები და გამოაგზავნეთ pull request-ები. შეცდომების შესახებ ცნობები, შესაძლებლობების წინადადებები და კოდში შეტანილი წვლილი, ყველაფერი მისასალმებელია.",
  "home.contribute.contribute.cta": "ნახვა GitHub-ზე",
  "home.contribute.sponsor.chip": "სპონსორობა",
  "home.contribute.sponsor.body":
    "თუ Airhop თქვენთვის სასარგებლოა, ერთჯერადი შემოწირულობა ან მუდმივი სპონსორობა დიდად დაეხმარება განვითარების გაგრძელებას.",
  "home.contribute.sponsor.donate": "ერთჯერადი შემოწირულობა",
  "home.contribute.sponsor.github": "სპონსორობა GitHub-ზე",

  "page.architecture.eyebrow": "დოკუმენტაცია",
  "page.architecture.title": "არქიტექტურა",
  "page.architecture.toc": "ამ გვერდზე",

  "page.faq.eyebrow": "ხშირი კითხვები",
  "page.faq.title": "ხშირად დასმული კითხვები",
  "page.faq.meta": "გავრცელებული კითხვები Airhop-ის შესახებ.",
  "page.faq.contact":
    "კითხვები, რომლებზეც აქ პასუხი არ არის, შეგიძლიათ გამოაგზავნოთ {email}-ზე ან დასვათ {github}-ზე განხილვის გახსნით.",

  "page.blogs.eyebrow": "ბლოგი",
  "page.blogs.title": "მალე",
  "page.blogs.body":
    "ტექსტები მეშ-ქსელებზე, კონფიდენციალურობასა და ოფლაინზე ორიენტირებულ პროგრამებზე.",

  "page.brand.eyebrow": "ბრენდი",
  "page.brand.title": "ბრენდის ნაკრები",
  "page.brand.meta":
    "მასალები და წესები Airhop-ის სტატიაში, მაღაზიის გვერდზე, გამოსვლაში ან README-ში მოსახსენიებლად. თავისუფლად გამოსაყენებელია მითითებისა და პრესისთვის.",

  "page.legal.eyebrow": "სამართლებრივი",
  "page.privacy.title": "კონფიდენციალურობის პოლიტიკა",
  "page.terms.title": "მომსახურების პირობები",

  "page.notfound.title": "გვერდი ვერ მოიძებნა",
  "page.notfound.body": "გვერდი, რომელსაც ეძებთ, არ არსებობს ან გადატანილია.",

  "page.english_only": "ეს გვერდი მხოლოდ ინგლისურადაა ხელმისაწვდომი.",

  "seo.breadcrumb.home": "მთავარი",

  "seo.home.title": "Airhop — პირადი, ოფლაინზე ორიენტირებული მესენჯერი",
  "seo.home.description":
    "პირადი კვანძიდან კვანძამდე მიმოწერა iOS-სა და Android-ისთვის. არც ინტერნეტი, არც სერვერები, არც ანგარიშები. დაუკავშირდით ბლუთუზ-მეშით ნებისმიერ ადგილას.",

  "seo.architecture.title": "არქიტექტურა — Airhop",
  "seo.architecture.description":
    "როგორ მუშაობს Airhop, ზემოდან ქვემოთ: ვინაობა, ტრანსპორტის შერჩევა, ბლუთუზ-მეში, დაშიფვრა, ინტერნეტის ფენა, Tor, ოფლაინ ecash, მოწყობილობაზე მომუშავე AI და bitchat-თან თავსებადი გადაცემის ფორმატი.",
  "seo.architecture.breadcrumb": "არქიტექტურა",
  "seo.architecture.headline": "Airhop-ის არქიტექტურა",
  "seo.architecture.summary":
    "Airhop-ის სრული ტექნიკური ანალიზი: ვინაობა, ტრანსპორტები, ბლუთუზ-მეში, დაშიფვრა, Nostr-ის ინტერნეტ-ფენა, Tor, Cashu-ს საფულე, მოწყობილობაზე მომუშავე AI-ასისტენტი და გადაცემის ფორმატი.",

  "seo.faq.title": "ხშირად დასმული კითხვები — Airhop",
  "seo.faq.description":
    "პასუხები Airhop-ის ბლუთუზ-მეშით მიმოწერაზე, დაშიფვრაზე, ოფლაინ გადახდებზე, Nostr-ის ინტერნეტ-ფენასა და bitchat-თან თავსებადობაზე.",
  "seo.faq.breadcrumb": "ხშირი კითხვები",

  "seo.blogs.title": "ბლოგი — Airhop",
  "seo.blogs.description":
    "ტექსტები მეშ-ქსელებზე, კონფიდენციალურობასა და ოფლაინზე ორიენტირებულ პროგრამებზე.",
  "seo.blogs.breadcrumb": "ბლოგი",

  "seo.brand.title": "ბრენდის ნაკრები — Airhop",
  "seo.brand.description":
    "Airhop-ის ბრენდის ნაკრები: პიქსელური ჩიტის ნიშანი, სიტყვიერი ნიშანი, ფერისა და შრიფტის ტოკენები, პრესმასალები და მზა ტექსტები.",
  "seo.brand.breadcrumb": "ბრენდის ნაკრები",

  "seo.privacy.title": "კონფიდენციალურობის პოლიტიკა — Airhop",
  "seo.privacy.description":
    "როგორ ეპყრობა Airhop მონაცემებს: არც ანგარიშები, არც სერვერები, არც თვალყურის დევნება. თქვენი ვინაობა და შეტყობინებები თქვენს მოწყობილობაზე რჩება.",
  "seo.privacy.breadcrumb": "კონფიდენციალურობის პოლიტიკა",

  "seo.terms.title": "მომსახურების პირობები — Airhop",
  "seo.terms.description":
    "პირობები, რომლებიც არეგულირებს Airhop-ის აპლიკაციისა და საიტის გამოყენებას.",
  "seo.terms.breadcrumb": "მომსახურების პირობები",

  "seo.notfound.title": "გვერდი ვერ მოიძებნა — Airhop",
  "seo.notfound.description": "გვერდი, რომელსაც ეძებთ, არ არსებობს ან გადატანილია.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} რელე",
    other: "{count} რელე",
  },
  "home.map.locations": {
    one: "{count} ადგილი",
    other: "{count} ადგილი",
  },
};

export const locale: Locale = { strings, plurals };
