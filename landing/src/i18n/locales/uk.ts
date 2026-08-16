import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Повернутися на головну",
  "common.last_updated": "Останнє оновлення: {date}",

  "nav.aria": "Основна навігація",
  "nav.home": "Головна Airhop",
  "nav.skip": "Перейти до вмісту",
  "nav.menu.open": "Відкрити меню",
  "nav.menu.close": "Закрити меню",
  "nav.how_it_works": "Як це працює",
  "nav.architecture": "Архітектура",
  "nav.faq": "Питання та відповіді",

  "footer.aria": "Нижній колонтитул",
  "footer.tagline": "Приватний mesh-зв’язок",
  "footer.credit": "© Зроблено з {heart} автором {author}",
  "footer.group.download": "Завантажити",
  "footer.group.resources": "Матеріали",
  "footer.group.social": "Соцмережі",
  "footer.group.legal": "Правове",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Архітектура",
  "footer.link.blogs": "Блог",
  "footer.link.faq": "Питання та відповіді",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Умови використання",
  "footer.link.privacy": "Політика конфіденційності",
  "footer.link.license": "Ліцензія проєкту",

  "settings.theme.group": "Кольорова тема",
  "settings.theme.light": "Світла тема",
  "settings.theme.dark": "Темна тема",
  "settings.language.label": "Мова",
  "settings.language.suggestion": "Переглянути цю сторінку українською",
  "settings.language.dismiss": "Закрити",

  "home.hero.release": "Останній випуск",
  "home.hero.title": "Листування, що працює без інтернету.",
  "home.hero.body":
    "Телефони поблизу утворюють Bluetooth-mesh і передають ваші повідомлення до семи переходів, із наскрізним шифруванням. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Без серверів",
  "home.hero.body.no_accounts": "без облікових записів",
  "home.hero.body.no_tracking": "без стеження",
  "home.hero.download": "Завантажити застосунок",
  "home.hero.badges": "Ліцензія MIT · Вільний і з відкритим кодом · Працює з bitchat",
  "home.hero.group.mobile": "Мобільні",
  "home.hero.group.desktop": "Комп’ютер",
  "home.hero.option.f_droid": "Каталог відкритого ПЗ",
  "home.hero.option.apk": "Пряме завантаження",
  "home.hero.option.soon": "Незабаром",

  "home.about.eyebrow": "Що таке Airhop",
  "home.about.title": "Більшість застосунків залежать від центрального сервера.",
  "home.about.sub":
    "За сервером можна стежити, його можна вимкнути чи заблокувати. В Airhop його немає, тож немає компанії, на яку тиснути, і сервісу, який закрити.",
  "home.about.card": "Технічний огляд",
  "home.about.link.mesh": "mesh на Bluetooth Low Energy",
  "home.about.link.wire_protocol": "протокол передавання",
  "home.about.body.built":
    "Airhop — застосунок з відкритим кодом для iOS та Android для приватного листування напряму між пристроями через {mesh}. Він побудований на основі {bitchat}, повторно використовує його {wire_protocol} і модель безпеки, а потім розширює їх підтримкою Tor, офлайн-платежами {ecash} та офлайн-ШІ. Він працює взагалі без інтернету, а повідомлення автоматично передаються між пристроями поблизу (приблизно 10–30 метрів на перехід у приміщенні, далі на відкритій місцевості), до 7 переходів.",
  "home.about.body.identity":
    "Ваша особистість — це пара ключів {ed25519}, створена на вашому пристрої та збережена в {ios_keychain} або {android_keystore}. Немає ні облікових записів, ні реєстрації, ні чогось, що торкається сервера, тобто застосунок можна використовувати як одноразовий, який після видалення не лишає нічого, що вело б до вас.",
  "home.about.body.crypto":
    "Кожен сеанс використовує протокол {noise} для автентифікованого рукостискання. Збережені повідомлення використовують алгоритм {ratchet}, тобто навіть якщо ваш пристрій згодом зламають, минулі повідомлення лишаться нечитними. Екстрене стирання знищує всі ключі та повідомлення менш ніж за секунду.",
  "home.about.body.internet":
    "Коли ви та ваш контакт поза межами Bluetooth, ретранслятори {nostr} слугують мостом через інтернет із приватними повідомленнями, загорнутими у форматі {nip17}, тож mesh сягає всього світу, поки ви обоє в мережі. Підтримка {tor} доступна і на iOS (через {arti}), і на Android (через {orbot}).",
  "home.about.optional.title": "В Airhop є додаткові можливості, які можна ввімкнути:",
  "home.about.optional.payments.label": "Офлайн-платежі:",
  "home.about.optional.payments.body":
    "Надсилайте й отримуйте платежі через mesh за протоколом {cashu} (лише Bitcoin).",
  "home.about.optional.ai.label": "Офлайн-ШІ:",
  "home.about.optional.ai.body":
    "Невеликий ШІ-помічник на пристрої, який відповідає на важливі запитання. Усі обчислення й дані лишаються на вашому пристрої.",
  "home.about.body.compatible":
    "Airhop сумісний із bitchat на рівні протоколу. Пристрій з Airhop і пристрій з bitchat в одному mesh знаходять одне одного автоматично й можуть обмінюватися повідомленнями та приватними повідомленнями без жодних налаштувань.",

  "home.situations.eyebrow": "Коли це потрібно",
  "home.situations.title": "На день, коли мережа впаде.",
  "home.situations.sub":
    "Стихійні лиха, вимкнення інтернету, масові протести або звичайні вихідні поза покриттям.",
  "home.situations.disaster.label": "Лихо",
  "home.situations.disaster.line":
    "Вежі не працюють. Оголошення на дошці доходить до кожного, хто проходить повз.",
  "home.situations.offgrid.label": "Поза мережею",
  "home.situations.offgrid.line": "Другий день на маршруті. Остання поділка сигналу зникла вчора.",
  "home.situations.protest.label": "Протест",
  "home.situations.protest.line": "QR-код на листівці відкриває зашифрований канал для ходи.",
  "home.situations.festival.label": "Фестиваль",
  "home.situations.festival.line":
    "На майданчику немає сигналу. Повідомлення стрибають через телефони незнайомців.",

  "home.showcase.eyebrow": "Подивитися застосунок",
  "home.showcase.title": "Звичайний месенджер, офлайн.",
  "home.showcase.sub":
    "Чати, канали, гаманець і особистість. Знайоме назовні, а всередині працює mesh.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Усі в межах досяжності, розставлені за близькістю. Нікого не треба додавати наперед.",
  "home.showcase.mesh.alt":
    "Екран Mesh застосунку Airhop із чотирма сусідніми вузлами, розміщеними на радарі за силою сигналу.",
  "home.showcase.chats.title": "Чати",
  "home.showcase.chats.caption":
    "Звичайні розмови. Телефони, що передають кожне повідомлення, не можуть його відкрити.",
  "home.showcase.chats.alt":
    "Приватна розмова в Airhop під час вимкнення світла, передана через три телефони.",
  "home.showcase.channels.title": "Канали",
  "home.showcase.channels.caption":
    "Публічні кімнати завбільшки з квартал або з цілий регіон, відкриті для всіх, хто там є.",
  "home.showcase.channels.alt":
    "Екран чатів застосунку Airhop зі списком публічних каналів рівня кварталу, району, міста й регіону.",
  "home.showcase.wallet.title": "Гаманець",
  "home.showcase.wallet.caption":
    "Передайте ecash людині поруч через Bluetooth, коли жоден телефон не в мережі.",
  "home.showcase.wallet.alt":
    "Екран гаманця застосунку Airhop із балансом ecash, який можна надіслати через Bluetooth.",
  "home.showcase.identity.title": "Особистість",
  "home.showcase.identity.caption":
    "Без реєстрації, без номера телефону, без пошти. Лише ключ, який ніколи не залишає цей телефон.",
  "home.showcase.identity.alt":
    "Екран профілю застосунку Airhop з особистістю, створеною на пристрої, без облікового запису.",

  "home.how.eyebrow": "Як це працює",
  "home.how.title": "Mesh збирається сам.",
  "home.how.sub":
    "Сусідні вузли утворюють самовідновну mesh через Bluetooth. Коли є інтернет, ретранслятори Nostr її розширюють, без інфраструктури, якою хтось володіє.",
  "home.how.cta": "Читати повну архітектуру",
  "home.how.discover.title": "Виявлення",
  "home.how.discover.line":
    "Телефони з Airhop або bitchat знаходять одне одного автоматично через Bluetooth. Без пар’ювання, без налаштування.",
  "home.how.relay.title": "Передавання",
  "home.how.relay.line":
    "Повідомлення стрибає з телефона на телефон, до семи переходів. Телефони між ними ніколи не бачать, що несуть.",
  "home.how.reach.title": "Далі",
  "home.how.reach.line":
    "Коли є інтернет, ретранслятори Nostr несуть ту саму розмову далі, за бажанням через Tor.",
  "home.how.swipe": "проведіть, щоб роздивитися",
  "home.how.diagram": "BLE mesh · локальна мережа між пристроями",
  "home.how.legend.node": "Вузол BLE mesh (офлайн)",
  "home.how.legend.relay": "Багатоперехідне передавання (шифрування Noise XX)",
  "home.how.legend.bitchat": "Сумісність із bitchat у тій самій mesh",
  "home.how.legend.nostr": "Міст Nostr (інтернет, коли є мережа)",

  "home.map.aria": "Карта світу з розташуванням ретрансляторів Nostr",
  "home.map.summary": "Міст Nostr · {relays} у {locations} по всьому світу",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Що він уміє",
  "home.features.title": "Справжній месенджер, а не демо.",
  "home.features.sub":
    "Чат, особистість, мережа та гроші. Усе зроблено так, щоб працювати без сигналу, без облікового запису й без посередників.",

  "home.features.messaging.title": "Повідомлення",
  "home.features.messaging.summary": "Усе, що є в месенджері, за нульової інфраструктури позаду.",
  "home.features.messaging.dms.name": "Приватні повідомлення",
  "home.features.messaging.dms.line": "Наскрізне шифрування, позначки про доставку та прочитання.",
  "home.features.messaging.location.name": "Канали за місцем",
  "home.features.messaging.location.line": "Кімнати, прив’язані до місця, від кварталу до регіону.",
  "home.features.messaging.groups.name": "Приватні канали та групи",
  "home.features.messaging.groups.line":
    "Запрошення до кімнати або підписаний список до 16 учасників.",
  "home.features.messaging.board.name": "Дошка оголошень",
  "home.features.messaging.board.line": "Оголошення, закріплені за місцевістю до семи днів.",
  "home.features.messaging.voice.name": "Живий голос",
  "home.features.messaging.voice.line":
    "Утримуйте мікрофон і говоріть з усіма поблизу, як по рації.",
  "home.features.messaging.notes.name": "Голосові нотатки",
  "home.features.messaging.notes.line": "Записаний звук, швидше, ніж набирати вказівки.",
  "home.features.messaging.files.name": "Фото, відео та файли",
  "home.features.messaging.files.line": "Будь-який формат, до 1 МБ, без сигналу.",
  "home.features.messaging.forward.name": "Зберегти й передати",
  "home.features.messaging.forward.line":
    "Запечатане й перенесене телефоном поблизу, доки не дійде до адресата.",

  "home.features.identity.title": "Особистість",
  "home.features.identity.summary": "Нема чого реєструвати й нема чого вилучати.",
  "home.features.identity.keys.name": "Особистість як пара ключів",
  "home.features.identity.keys.line":
    "Створена на цьому телефоні, збережена у сховищі ключів системи.",
  "home.features.identity.names.name": "Читні імена",
  "home.features.identity.names.line": "Виводяться з вашого ключа, тож ваше ім’я ніхто не забере.",
  "home.features.identity.qr.name": "Контакти через QR",
  "home.features.identity.qr.line": "Одне сканування передає їхні ключі, а не лише ім’я.",
  "home.features.identity.panic.name": "Екстрене стирання",
  "home.features.identity.panic.line":
    "Кожен ключ і кожне повідомлення знищуються менш ніж за секунду.",

  "home.features.networking.title": "Мережа",
  "home.features.networking.summary": "Телефони і є мережею.",
  "home.features.networking.mesh.name": "Bluetooth-mesh",
  "home.features.networking.mesh.line":
    "Без інтернету, без роутера, на телефонах, які в людей уже є.",
  "home.features.networking.bridge.name": "Міст між mesh",
  "home.features.networking.bridge.line":
    "Зв’язує ваш публічний чат із групою поблизу поза межами досяжності.",
  "home.features.networking.wifi.name": "Швидкий шлях через WiFi",
  "home.features.networking.wifi.line": "Швидша передача між двома Android або двома iPhone.",
  "home.features.networking.bitchat.name": "Сумісність із bitchat",
  "home.features.networking.bitchat.line": "Обидва застосунки входять в одну mesh без налаштувань.",

  "home.features.internet.title": "Інтернет",
  "home.features.internet.summary": "Доповнення, але ніколи не вимога.",
  "home.features.internet.nostr.name": "Запасний шлях через Nostr",
  "home.features.internet.nostr.line":
    "Приватні повідомлення та канали за місцем працюють і поза радіодосяжністю.",
  "home.features.internet.relays.name": "Пошук гео-ретрансляторів",
  "home.features.internet.relays.line":
    "Понад 300 незалежних публічних ретрансляторів, жоден з них не наш.",
  "home.features.internet.gateway.name": "Інтернет-шлюз",
  "home.features.internet.gateway.line":
    "Позичте своє з’єднання, щоб телефон поблизу без мережі дістався каналів за місцем.",
  "home.features.internet.tor.name": "Інтеграція з Tor",
  "home.features.internet.tor.line":
    "Маршрутизація на обох платформах, щоб ретранслятори ніколи не бачили вашу IP.",

  "home.features.optional.title": "Додатково",
  "home.features.optional.summary": "Типово вимкнено. Вмикається, коли захочете.",
  "home.features.optional.cashu.name": "Ecash на Cashu",
  "home.features.optional.cashu.line": "Платіть людині поруч, коли жоден телефон не в мережі.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Поповнення й виведення в біткоїні через мережу Lightning.",
  "home.features.optional.ai.name": "Локальний ШІ",
  "home.features.optional.ai.line": "Відповіді на пристрої, нічого не залишає телефон.",
  "home.features.optional.social.name": "Мости в соцмережі",
  "home.features.optional.social.line": "Bluesky та Mastodon з тією самою особистістю.",

  "home.compare.eyebrow": "Порівняння",
  "home.compare.title": "Офлайн, без окремого обладнання й відкритий.",
  "home.compare.sub":
    "Кожен застосунок тут у чомусь добрий. Але лише деякі працюють далі, коли мережа перестає.",
  "home.compare.col.project": "Проєкт",
  "home.compare.col.transport": "Транспорт",
  "home.compare.col.encryption": "Шифрування",
  "home.compare.col.offline": "Працює офлайн",
  "home.compare.col.hardware_free": "Без окремого обладнання",
  "home.compare.col.open_source": "Відкритий код",
  "home.compare.mark.yes": "Так",
  "home.compare.mark.no": "Ні",
  "home.compare.mark.partial": "Частково, клієнти відкриті, сервери ні",
  "home.compare.mark.partial_hint": "Клієнти відкриті, сервери ні",
  "home.compare.transport.servers": "Централізовані сервери",
  "home.compare.transport.onion": "Цибулева маршрутизація (сервісні вузли)",
  "home.compare.transport.nostr": "Ретранслятори Nostr",
  "home.compare.transport.lora": "Радіо LoRa",
  "home.compare.transport.sub_ghz": "Пропрієтарне радіо суб-ГГц",

  "home.explore.eyebrow": "Відкрито й чесно",
  "home.explore.title": "Кожне твердження тут можна перевірити.",
  "home.explore.sub":
    "Код, протокол і плани відкриті. Обмеження теж. Перевірте самі, перш ніж вірити нам на слово.",
  "home.explore.audit.chip": "Аудит очікується",
  "home.explore.audit.headline": "Airhop ще не проходив зовнішнього аудиту безпеки.",
  "home.explore.audit.body":
    "{headline} Увесь код переглядається особисто й перед випуском проходить через {review}, а криптографічна бібліотека, яку він використовує, пройшла аудит Cure53, але це не замінює формального аудиту самого застосунку. Його заплановано на {version}. До того не покладайтеся на нього в чутливих випадках.",
  "home.explore.audit.link.review": "агент перевірки безпеки",
  "home.explore.source.title": "Вихідний код",
  "home.explore.source.desc":
    "Усе на GitHub за ліцензією MIT. Issue, pull request та обговорення відкриті.",
  "home.explore.protocol.title": "Специфікація протоколу",
  "home.explore.protocol.desc":
    "Точний формат передавання, UUID для BLE та константи, спільні з bitchat.",
  "home.explore.architecture.title": "Архітектура",
  "home.explore.architecture.desc":
    "Повний технічний розбір, від натискання «надіслати» до байтів в ефірі.",
  "home.explore.roadmap.title": "Дорожня карта",
  "home.explore.roadmap.desc": "Цілі версій від v0.5.0 до v2.0.0, включно із запланованим аудитом.",
  "home.explore.vision.title": "Бачення",
  "home.explore.vision.desc": "Навіщо існує Airhop і які принципи не змінюються під тиском.",
  "home.explore.brand.title": "Бренд-кит",
  "home.explore.brand.desc":
    "Піксельний птах, токени кольору й типографіки, матеріали для преси та готові тексти.",

  "home.contribute.eyebrow": "Підтримати проєкт",
  "home.contribute.title": "Незалежно й відкрито.",
  "home.contribute.sub":
    "Немає інвесторів, реклами й платного тарифу. Усі можливості й так лишаються безкоштовними, а роботу оплачують ті, кому вона стала в пригоді.",
  "home.contribute.contribute.chip": "Долучитися",
  "home.contribute.contribute.body":
    "Поставте зірку репозиторію, відкривайте issue та надсилайте pull request. Звіти про помилки, пропозиції можливостей і внесок у код — усе вітається.",
  "home.contribute.contribute.cta": "Відкрити на GitHub",
  "home.contribute.sponsor.chip": "Підтримати",
  "home.contribute.sponsor.body":
    "Якщо Airhop вам корисний, разова пожертва або регулярна підтримка дуже допомагають тримати розробку живою.",
  "home.contribute.sponsor.donate": "Пожертвувати один раз",
  "home.contribute.sponsor.github": "Підтримати на GitHub",

  "page.architecture.eyebrow": "Документація",
  "page.architecture.title": "Архітектура",
  "page.architecture.toc": "На цій сторінці",

  "page.faq.eyebrow": "Питання та відповіді",
  "page.faq.title": "Часті запитання",
  "page.faq.meta": "Часті запитання про Airhop.",
  "page.faq.contact":
    "Запитання, на які тут немає відповіді, можна надіслати на {email} або поставити, відкривши обговорення на {github}.",

  "page.blogs.eyebrow": "Блог",
  "page.blogs.title": "Незабаром",
  "page.blogs.body":
    "Тексти про mesh-мережі, приватність і програми, що працюють насамперед офлайн.",

  "page.brand.eyebrow": "Бренд",
  "page.brand.title": "Бренд-кит",
  "page.brand.meta":
    "Матеріали та правила використання Airhop у статті, картці магазину, доповіді чи README. Вільно для посилань і преси.",

  "page.legal.eyebrow": "Правове",
  "page.privacy.title": "Політика конфіденційності",
  "page.terms.title": "Умови використання",

  "page.notfound.title": "Сторінку не знайдено",
  "page.notfound.body": "Сторінка, яку ви шукаєте, не існує або була переміщена.",

  "page.english_only": "Ця сторінка доступна лише англійською.",

  "seo.breadcrumb.home": "Головна",

  "seo.home.title": "Airhop — приватний месенджер, що працює насамперед офлайн",
  "seo.home.description":
    "Приватне листування напряму між пристроями для iOS та Android. Без інтернету, без серверів, без облікових записів. Спілкуйтеся через Bluetooth-mesh будь-де.",

  "seo.architecture.title": "Архітектура — Airhop",
  "seo.architecture.description":
    "Як Airhop влаштований згори донизу: особистість, вибір транспорту, Bluetooth-mesh, шифрування, інтернет-шар, Tor, офлайн-ecash, ШІ на пристрої та формат передавання, сумісний із bitchat.",
  "seo.architecture.breadcrumb": "Архітектура",
  "seo.architecture.headline": "Архітектура Airhop",
  "seo.architecture.summary":
    "Повний технічний розбір Airhop: особистість, транспорти, Bluetooth-mesh, шифрування, інтернет-шар Nostr, Tor, гаманець Cashu, ШІ-помічник на пристрої та формат передавання.",

  "seo.faq.title": "Часті запитання — Airhop",
  "seo.faq.description":
    "Відповіді про листування через Bluetooth-mesh в Airhop, шифрування, офлайн-платежі, інтернет-шар Nostr і сумісність із bitchat.",
  "seo.faq.breadcrumb": "Питання та відповіді",

  "seo.blogs.title": "Блог — Airhop",
  "seo.blogs.description":
    "Тексти про mesh-мережі, приватність і програми, що працюють насамперед офлайн.",
  "seo.blogs.breadcrumb": "Блог",

  "seo.brand.title": "Бренд-кит — Airhop",
  "seo.brand.description":
    "Бренд-кит Airhop: піксельний птах, логотип, токени кольору й типографіки, матеріали для преси та готові тексти.",
  "seo.brand.breadcrumb": "Бренд-кит",

  "seo.privacy.title": "Політика конфіденційності — Airhop",
  "seo.privacy.description":
    "Як Airhop поводиться з даними: без облікових записів, без серверів, без стеження. Ваша особистість і повідомлення лишаються на вашому пристрої.",
  "seo.privacy.breadcrumb": "Політика конфіденційності",

  "seo.terms.title": "Умови використання — Airhop",
  "seo.terms.description": "Умови, що регулюють користування застосунком і сайтом Airhop.",
  "seo.terms.breadcrumb": "Умови використання",

  "seo.notfound.title": "Сторінку не знайдено — Airhop",
  "seo.notfound.description": "Сторінка, яку ви шукаєте, не існує або була переміщена.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} ретранслятор",
    few: "{count} ретранслятори",
    many: "{count} ретрансляторів",
    other: "{count} ретранслятора",
  },
  "home.map.locations": {
    one: "{count} локації",
    few: "{count} локаціях",
    many: "{count} локаціях",
    other: "{count} локаціях",
  },
};

export const locale: Locale = { strings, plurals };
