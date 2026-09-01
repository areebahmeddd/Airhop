import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "На главную",
  "common.last_updated": "Обновлено: {date}",

  "nav.aria": "Основная навигация",
  "nav.home": "Главная Airhop",
  "nav.skip": "Перейти к содержимому",
  "nav.menu.open": "Открыть меню",
  "nav.menu.close": "Закрыть меню",
  "nav.how_it_works": "Как это работает",
  "nav.architecture": "Архитектура",
  "nav.faq": "Вопросы и ответы",

  "footer.aria": "Подвал",
  "footer.tagline": "Приватная mesh-связь",
  "footer.credit": "© Сделано с {heart} автором {author}",
  "footer.group.download": "Загрузка",
  "footer.group.resources": "Материалы",
  "footer.group.social": "Соцсети",
  "footer.group.legal": "Правовое",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Архитектура",
  "footer.link.blogs": "Блог",
  "footer.link.faq": "Вопросы и ответы",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Условия использования",
  "footer.link.privacy": "Политика конфиденциальности",
  "footer.link.license": "Лицензия проекта",

  "settings.theme.group": "Цветовая тема",
  "settings.theme.light": "Светлая тема",
  "settings.theme.dark": "Тёмная тема",
  "settings.language.label": "Язык",
  "settings.language.suggestion": "Посмотреть эту страницу на русском",
  "settings.language.dismiss": "Закрыть",

  "home.hero.release": "Последний релиз",
  "home.hero.title": "Сообщения, которые работают без интернета.",
  "home.hero.body":
    "Телефоны поблизости образуют Bluetooth-mesh и передают ваши сообщения до семи переходов, со сквозным шифрованием. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Без серверов",
  "home.hero.body.no_accounts": "без аккаунтов",
  "home.hero.body.no_tracking": "без слежки",
  "home.hero.download": "Скачать приложение",
  "home.hero.badges": "Лицензия MIT · Бесплатно и с открытым кодом · Работает с bitchat",
  "home.hero.group.mobile": "Мобильные",
  "home.hero.group.desktop": "Настольные",
  "home.hero.option.f_droid": "Каталог открытого ПО",
  "home.hero.option.apk": "Прямая загрузка",
  "home.hero.option.soon": "Скоро",

  "home.about.eyebrow": "Что такое Airhop",
  "home.about.title": "Большинство приложений зависит от центрального сервера.",
  "home.about.sub":
    "За сервером можно следить, его можно отключить или заблокировать. У Airhop его нет, поэтому нет компании, на которую можно надавить, и сервиса, который можно закрыть.",
  "home.about.card": "Технический обзор",
  "home.about.link.mesh": "Bluetooth Low Energy mesh",
  "home.about.link.wire_protocol": "проводной протокол",
  "home.about.body.built":
    "Airhop — это приложение с открытым кодом для iOS и Android для приватного однорангового обмена сообщениями через {mesh}. Оно построено на основе {bitchat}, повторно использует его {wire_protocol} и модель безопасности, а затем расширяет их офлайн-платежами {ecash} и офлайн-ИИ. Оно работает вообще без интернета, а сообщения автоматически передаются между устройствами поблизости (примерно 10–30 метров за переход в помещении, дальше на открытой местности), до 7 переходов.",
  "home.about.body.identity":
    "Ваша личность — это пара ключей {ed25519}, созданная на вашем устройстве и хранящаяся в {ios_keychain} или {android_keystore}. Нет ни аккаунтов, ни регистрации, ничего, что обращалось бы к серверу, то есть приложение можно использовать как одноразовое, которое после удаления не оставляет ничего, что вело бы к вам.",
  "home.about.body.crypto":
    "Каждая сессия использует протокол {noise} для аутентифицированного рукопожатия. Сохранённые сообщения используют алгоритм {ratchet}, то есть даже если ваше устройство позже будет скомпрометировано, прошлые сообщения останутся нечитаемыми. Экстренное стирание уничтожает все ключи и сообщения меньше чем за секунду.",
  "home.about.body.internet":
    "Когда вы и ваш собеседник вне зоны действия Bluetooth, реле {nostr} служат мостом через интернет, используя личные сообщения в обёртке формата {nip17}, поэтому mesh расширяется до глобальной, пока вы оба в сети. Поддержка {tor} доступна на iOS и Android, через {arti}.",
  "home.about.optional.title": "В Airhop есть дополнительные функции, которые можно включить:",
  "home.about.optional.payments.label": "Офлайн-платежи:",
  "home.about.optional.payments.body":
    "Отправляйте и получайте платежи через mesh по протоколу {cashu} (только Bitcoin).",
  "home.about.optional.ai.label": "Офлайн-ИИ:",
  "home.about.optional.ai.body":
    "Небольшой ИИ-ассистент на устройстве, который отвечает на важные вопросы. Все вычисления и данные остаются на вашем устройстве.",
  "home.about.body.compatible":
    "Airhop совместим с bitchat на уровне протокола. Устройство с Airhop и устройство с bitchat в одной mesh находят друг друга автоматически и могут обмениваться сообщениями и личными сообщениями без какой-либо настройки.",

  "home.situations.eyebrow": "Когда это нужно",
  "home.situations.title": "Для дня, когда сеть отключится.",
  "home.situations.sub":
    "Стихийные бедствия, отключения интернета, массовые протесты или обычные выходные вне зоны покрытия.",
  "home.situations.disaster.label": "Бедствие",
  "home.situations.disaster.line":
    "Вышки не работают. Объявление на доске доходит до каждого, кто проходит мимо.",
  "home.situations.offgrid.label": "Вне сети",
  "home.situations.offgrid.line":
    "Второй день на маршруте. Последняя палочка сигнала пропала вчера.",
  "home.situations.protest.label": "Протест",
  "home.situations.protest.line": "QR-код на листовке открывает зашифрованный канал для шествия.",
  "home.situations.festival.label": "Фестиваль",
  "home.situations.festival.line":
    "На площадке нет сигнала. Сообщения перескакивают через телефоны незнакомцев.",

  "home.showcase.eyebrow": "Посмотреть приложение",
  "home.showcase.title": "Обычный мессенджер, офлайн.",
  "home.showcase.sub":
    "Чаты, каналы, кошелёк и личность. Снаружи всё привычно, а внизу работает mesh.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Все, кто в зоне действия, расставлены по близости. Никого не нужно сначала добавлять.",
  "home.showcase.mesh.alt":
    "Экран Mesh приложения Airhop с четырьмя ближайшими узлами, расставленными на радаре по уровню сигнала.",
  "home.showcase.chats.title": "Чаты",
  "home.showcase.chats.caption":
    "Обычные разговоры. Телефоны, которые передают каждое сообщение, не могут его открыть.",
  "home.showcase.chats.alt":
    "Личная переписка в Airhop во время отключения электричества, переданная через три телефона.",
  "home.showcase.channels.title": "Каналы",
  "home.showcase.channels.caption":
    "Открытые комнаты размером с квартал или с целый регион, доступные всем, кто там находится.",
  "home.showcase.channels.alt":
    "Экран чатов приложения Airhop со списком публичных каналов уровня квартала, района, города и региона.",
  "home.showcase.wallet.title": "Кошелёк",
  "home.showcase.wallet.caption":
    "Передайте ecash человеку рядом через Bluetooth, когда ни один телефон не в сети.",
  "home.showcase.wallet.alt":
    "Экран кошелька приложения Airhop с балансом ecash, который можно отправить через Bluetooth.",
  "home.showcase.identity.title": "Личность",
  "home.showcase.identity.caption":
    "Без регистрации, без номера телефона, без почты. Только ключ, который никогда не покидает этот телефон.",
  "home.showcase.identity.alt":
    "Экран профиля приложения Airhop с личностью, созданной на устройстве, без аккаунта.",

  "home.how.eyebrow": "Как это работает",
  "home.how.title": "Mesh собирается сама.",
  "home.how.sub":
    "Соседние узлы образуют самовосстанавливающуюся mesh по Bluetooth. Когда есть интернет, реле Nostr расширяют её, без инфраструктуры, которой кто-то владеет.",
  "home.how.cta": "Читать полную архитектуру",
  "home.how.discover.title": "Обнаружение",
  "home.how.discover.line":
    "Телефоны с Airhop или bitchat находят друг друга автоматически по Bluetooth. Без сопряжения, без настройки.",
  "home.how.relay.title": "Передача",
  "home.how.relay.line":
    "Сообщение перескакивает с телефона на телефон, до семи переходов. Телефоны между ними никогда не видят, что переносят.",
  "home.how.reach.title": "Дальше",
  "home.how.reach.line":
    "Когда есть интернет, реле Nostr уносят тот же разговор дальше, при желании через Tor.",
  "home.how.swipe": "проведите, чтобы посмотреть",
  "home.how.diagram": "BLE mesh · локальная одноранговая сеть",
  "home.how.legend.node": "Узел BLE mesh (офлайн)",
  "home.how.legend.relay": "Многопереходная передача (шифрование Noise XX)",
  "home.how.legend.bitchat": "Совместимость с bitchat в той же mesh",
  "home.how.legend.nostr": "Мост Nostr (интернет, когда есть сеть)",

  "home.map.aria": "Карта мира с расположением реле Nostr",
  "home.map.summary": "Мост Nostr · {relays} в {locations} по всему миру",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Что оно умеет",
  "home.features.title": "Настоящий мессенджер, а не демо.",
  "home.features.sub":
    "Чат, личность, сеть и деньги. Всё сделано так, чтобы работать без сигнала, без аккаунта и без посредников.",

  "home.features.messaging.title": "Сообщения",
  "home.features.messaging.summary":
    "Всё, что есть у мессенджера, при нулевой инфраструктуре позади.",
  "home.features.messaging.dms.name": "Приватные личные сообщения",
  "home.features.messaging.dms.line": "Сквозное шифрование, отметки о доставке и прочтении.",
  "home.features.messaging.location.name": "Каналы по местоположению",
  "home.features.messaging.location.line": "Комнаты, привязанные к месту, от квартала до региона.",
  "home.features.messaging.groups.name": "Приватные каналы и группы",
  "home.features.messaging.groups.line":
    "Ссылки-приглашения в комнату или подписанный список до 16 участников.",
  "home.features.messaging.board.name": "Доска объявлений",
  "home.features.messaging.board.line": "Объявления, закреплённые за районом на срок до семи дней.",
  "home.features.messaging.voice.name": "Живой голос",
  "home.features.messaging.voice.line":
    "Удерживайте микрофон и говорите со всеми в зоне действия, как по рации.",
  "home.features.messaging.notes.name": "Голосовые заметки",
  "home.features.messaging.notes.line": "Запись голоса, быстрее, чем набирать указания.",
  "home.features.messaging.files.name": "Фото, видео и файлы",
  "home.features.messaging.files.line": "Любой формат, до 1 МиБ, сигнал не нужен.",
  "home.features.messaging.forward.name": "Сохранить и передать",
  "home.features.messaging.forward.line":
    "Запечатано и перенесено телефоном поблизости, пока не дойдёт до адресата.",

  "home.features.identity.title": "Личность",
  "home.features.identity.summary": "Нечего регистрировать, нечего изымать.",
  "home.features.identity.keys.name": "Личность как пара ключей",
  "home.features.identity.keys.line": "Создана на этом телефоне, хранится в хранилище ключей ОС.",
  "home.features.identity.names.name": "Читаемые имена",
  "home.features.identity.names.line":
    "Выводятся из вашего ключа, поэтому ваше имя никто не займёт.",
  "home.features.identity.qr.name": "Контакты по QR",
  "home.features.identity.qr.line": "Одно сканирование передаёт их ключи, а не только имя.",
  "home.features.identity.panic.name": "Экстренное стирание",
  "home.features.identity.panic.line": "Все ключи и сообщения уничтожаются меньше чем за секунду.",

  "home.features.networking.title": "Сеть",
  "home.features.networking.summary": "Телефоны и есть сеть.",
  "home.features.networking.mesh.name": "Bluetooth-mesh",
  "home.features.networking.mesh.line":
    "Без интернета, без роутера, на телефонах, которые у людей уже есть.",
  "home.features.networking.bridge.name": "Мост между mesh",
  "home.features.networking.bridge.line":
    "Связывает ваш публичный чат с группой поблизости за пределами зоны действия.",
  "home.features.networking.wifi.name": "Быстрый путь по WiFi",
  "home.features.networking.wifi.line": "Быстрее передача между двумя Android или двумя iPhone.",
  "home.features.networking.bitchat.name": "Совместимость с bitchat",
  "home.features.networking.bitchat.line": "Оба приложения входят в одну mesh без настройки.",

  "home.features.internet.title": "Интернет",
  "home.features.internet.summary": "Дополнение, но никогда не требование.",
  "home.features.internet.nostr.name": "Запасной путь через Nostr",
  "home.features.internet.nostr.line":
    "Личные сообщения и каналы по местоположению продолжают работать за пределами радиосвязи.",
  "home.features.internet.relays.name": "Поиск гео-реле",
  "home.features.internet.relays.line":
    "Более 300 независимых публичных реле, ни одно из них не наше.",
  "home.features.internet.gateway.name": "Интернет-шлюз",
  "home.features.internet.gateway.line":
    "Одолжите своё соединение, чтобы телефон поблизости без сети добрался до каналов по местоположению.",
  "home.features.internet.tor.name": "Интеграция с Tor",
  "home.features.internet.tor.line":
    "Маршрутизация на обеих платформах, чтобы реле никогда не видели ваш IP.",

  "home.features.optional.title": "Дополнительно",
  "home.features.optional.summary": "По умолчанию выключено. Включается, когда захотите.",
  "home.features.optional.cashu.name": "Ecash на Cashu",
  "home.features.optional.cashu.line": "Платите человеку рядом, когда ни один телефон не в сети.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Пополнение и вывод в биткоине через сеть Lightning.",
  "home.features.optional.ai.name": "Локальный ИИ",
  "home.features.optional.ai.line": "Ответы на устройстве, ничего не покидает телефон.",
  "home.features.optional.social.name": "Мосты в соцсети",
  "home.features.optional.social.line": "Bluesky и Mastodon с той же личностью.",

  "home.compare.eyebrow": "Сравнение",
  "home.compare.title": "Офлайн, без отдельного железа и открыто.",
  "home.compare.sub":
    "Каждое приложение здесь в чём-то хорошо. Но лишь некоторые продолжают работать, когда сеть перестаёт.",
  "home.compare.col.project": "Проект",
  "home.compare.col.transport": "Транспорт",
  "home.compare.col.encryption": "Шифрование",
  "home.compare.col.offline": "Работает офлайн",
  "home.compare.col.hardware_free": "Без отдельного железа",
  "home.compare.col.open_source": "Открытый код",
  "home.compare.mark.yes": "Да",
  "home.compare.mark.no": "Нет",
  "home.compare.mark.partial": "Частично, клиенты открыты, серверы нет",
  "home.compare.mark.partial_hint": "Клиенты открыты, серверы нет",
  "home.compare.transport.servers": "Централизованные серверы",
  "home.compare.transport.onion": "Луковая маршрутизация (сервисные узлы)",
  "home.compare.transport.nostr": "Реле Nostr",
  "home.compare.transport.lora": "Радио LoRa",
  "home.compare.transport.sub_ghz": "Проприетарное радио суб-ГГц",

  "home.explore.eyebrow": "Открыто и честно",
  "home.explore.title": "Любое утверждение здесь можно проверить.",
  "home.explore.sub":
    "Код, протокол и планы открыты. Ограничения тоже. Проверьте сами, прежде чем верить нам на слово.",
  "home.explore.audit.chip": "Аудит ожидается",
  "home.explore.audit.headline": "Airhop ещё не проходил внешний аудит безопасности.",
  "home.explore.audit.body":
    "{headline} Весь код проверяется лично и прогоняется через {review} перед выпуском, а используемая криптографическая библиотека прошла аудит Cure53, но это не заменяет формальный аудит самого приложения. Он запланирован на {version}. До тех пор не полагайтесь на приложение в чувствительных сценариях.",
  "home.explore.audit.link.review": "агент проверки безопасности",
  "home.explore.source.title": "Исходный код",
  "home.explore.source.desc":
    "Всё на GitHub под лицензией MIT. Issue, pull request и обсуждения открыты.",
  "home.explore.protocol.title": "Спецификация протокола",
  "home.explore.protocol.desc":
    "Точный формат передачи, UUID для BLE и константы, общие с bitchat.",
  "home.explore.architecture.title": "Архитектура",
  "home.explore.architecture.desc":
    "Полный технический разбор, от нажатия «отправить» до байтов в эфире.",
  "home.explore.roadmap.title": "Дорожная карта",
  "home.explore.roadmap.desc": "Цели версий от v0.5.0 до v2.0.0, включая запланированный аудит.",
  "home.explore.vision.title": "Видение",
  "home.explore.vision.desc": "Зачем существует Airhop и какие принципы не меняются под давлением.",
  "home.explore.brand.title": "Брендбук",
  "home.explore.brand.desc":
    "Пиксельная птица, токены цвета и типографики, материалы для прессы и заготовки текстов.",

  "home.contribute.eyebrow": "Поддержать проект",
  "home.contribute.title": "Независимо и в открытую.",
  "home.contribute.sub":
    "Нет инвесторов, нет рекламы и нет платного тарифа. Все функции в любом случае остаются бесплатными, а работу оплачивают те, кому она пригодилась.",
  "home.contribute.contribute.chip": "Участвовать",
  "home.contribute.contribute.body":
    "Поставьте звезду репозиторию, открывайте issue и присылайте pull request. Отчёты об ошибках, предложения функций и вклад в код — всё это приветствуется.",
  "home.contribute.contribute.cta": "Открыть на GitHub",
  "home.contribute.sponsor.chip": "Спонсировать",
  "home.contribute.sponsor.body":
    "Если Airhop вам полезен, разовое пожертвование или регулярное спонсорство очень помогает поддерживать разработку.",
  "home.contribute.sponsor.donate": "Пожертвовать один раз",
  "home.contribute.sponsor.github": "Спонсировать на GitHub",

  "page.architecture.eyebrow": "Документация",
  "page.architecture.title": "Архитектура",
  "page.architecture.toc": "На этой странице",

  "page.faq.eyebrow": "Вопросы и ответы",
  "page.faq.title": "Часто задаваемые вопросы",
  "page.faq.meta": "Частые вопросы об Airhop.",
  "page.faq.contact":
    "Вопросы, на которые здесь нет ответа, можно отправить на {email} или задать, открыв обсуждение на {github}.",

  "page.blogs.eyebrow": "Блог",
  "page.blogs.title": "Скоро",
  "page.blogs.body": "Тексты о mesh-сетях, приватности и offline-first программах.",

  "page.brand.eyebrow": "Бренд",
  "page.brand.title": "Брендбук",
  "page.brand.meta":
    "Материалы и правила для использования Airhop в статье, карточке магазина, докладе или README. Свободно для справки и прессы.",

  "page.legal.eyebrow": "Правовое",
  "page.privacy.title": "Политика конфиденциальности",
  "page.terms.title": "Условия использования",

  "page.notfound.title": "Страница не найдена",
  "page.notfound.body": "Страница, которую вы ищете, не существует или была перемещена.",

  "page.english_only": "Эта страница доступна только на английском языке.",

  "seo.breadcrumb.home": "Главная",

  "seo.home.title": "Airhop — приватный офлайн-первый мессенджер",
  "seo.home.description":
    "Приватный одноранговый обмен сообщениями для iOS и Android. Без интернета, без серверов, без аккаунтов. Общайтесь через Bluetooth-mesh где угодно.",

  "seo.architecture.title": "Архитектура — Airhop",
  "seo.architecture.description":
    "Как устроен Airhop сверху донизу: личность, выбор транспорта, Bluetooth-mesh, шифрование, интернет-слой, Tor, офлайн-ecash, ИИ на устройстве и формат передачи, совместимый с bitchat.",
  "seo.architecture.breadcrumb": "Архитектура",
  "seo.architecture.headline": "Архитектура Airhop",
  "seo.architecture.summary":
    "Полный технический разбор Airhop: личность, транспорты, Bluetooth-mesh, шифрование, интернет-слой Nostr, Tor, кошелёк Cashu, ИИ-ассистент на устройстве и формат передачи.",

  "seo.faq.title": "Часто задаваемые вопросы — Airhop",
  "seo.faq.description":
    "Ответы о сообщениях через Bluetooth-mesh в Airhop, шифровании, офлайн-платежах, интернет-слое Nostr и совместимости с bitchat.",
  "seo.faq.breadcrumb": "Вопросы и ответы",

  "seo.blogs.title": "Блог — Airhop",
  "seo.blogs.description": "Тексты о mesh-сетях, приватности и offline-first программах.",
  "seo.blogs.breadcrumb": "Блог",

  "seo.brand.title": "Брендбук — Airhop",
  "seo.brand.description":
    "Брендбук Airhop: пиксельная птица, логотип, токены цвета и типографики, материалы для прессы и заготовки текстов.",
  "seo.brand.breadcrumb": "Брендбук",

  "seo.privacy.title": "Политика конфиденциальности — Airhop",
  "seo.privacy.description":
    "Как Airhop обращается с данными: без аккаунтов, без серверов, без слежки. Ваша личность и сообщения остаются на вашем устройстве.",
  "seo.privacy.breadcrumb": "Политика конфиденциальности",

  "seo.terms.title": "Условия использования — Airhop",
  "seo.terms.description": "Условия, регулирующие использование приложения и сайта Airhop.",
  "seo.terms.breadcrumb": "Условия использования",

  "seo.notfound.title": "Страница не найдена — Airhop",
  "seo.notfound.description": "Страница, которую вы ищете, не существует или была перемещена.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} реле",
    few: "{count} реле",
    many: "{count} реле",
    other: "{count} реле",
  },
  "home.map.locations": {
    one: "{count} точке",
    few: "{count} точках",
    many: "{count} точках",
    other: "{count} точках",
  },
};

export const locale: Locale = { strings, plurals };
