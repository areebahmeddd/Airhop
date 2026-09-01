// ru: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Отмена",
  "common.done": "Готово",
  "common.ok": "ОК",
  "common.close": "Закрыть",
  "common.back": "Назад",
  "common.delete": "Удалить",
  "common.remove": "Убрать",
  "common.add": "Добавить",
  "common.copy": "Копировать",
  "common.copied": "Скопировано",
  "common.share": "Поделиться",
  "common.continue": "Продолжить",
  "common.try_again": "Попробовать снова",
  "common.settings": "Настройки",
  "common.off": "Выкл.",

  // ---- Dates ----
  "format.today": "Сегодня",
  "format.yesterday": "Вчера",
  "format.minutes_ago": "{count} мин назад",
  "format.hours_ago": "{count} ч назад",
  "format.days_ago": "{count} д назад",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Чаты",
  "nav.tab.mesh": "Сеть",
  "nav.tab.wallet": "Кошелёк",
  "nav.tab.profile": "Вы",
  "a11y.tab.new_peers": "{label}, рядом кто-то новый",
  "nav.notifications": "Уведомления",
  "chat.subtab.channels": "Каналы",
  "chat.subtab.direct": "Личные",
  "chat.subtab.dms": "Личные сообщения",
  "chat.search.placeholder": "Поиск по чатам…",
  "chat.search.a11y": "Поиск по чатам и сообщениям",
  "chat.search.close": "Закрыть поиск",
  "chat.search.clear": "Очистить поиск",
  "mesh.view.radar": "Вид радара",
  "mesh.view.list": "Вид списка",
  "mesh.view.radar_short": "Радар",
  "mesh.view.list_short": "Список",

  // ---- Legal document names ----
  "legal.last_updated": "Обновлено: {date}",
  "legal.terms": "Условия использования",
  "legal.privacy": "Политика конфиденциальности",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Приватное общение по mesh-сети",
  "onboarding.welcome.cta": "Начать",
  "onboarding.welcome.cta_hint": "Примите условия ниже, чтобы продолжить",
  "onboarding.welcome.consent_a11y":
    "Принять условия использования и политику конфиденциальности",
  "onboarding.welcome.open_terms": "Открыть условия использования",
  "onboarding.welcome.open_privacy": "Открыть политику конфиденциальности",
  "onboarding.welcome.consent":
    "Нажимая {cta}, вы принимаете наши {terms} и {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Создаём вашу личность",
  "onboarding.identity.body":
    "На этом устройстве создаётся пара ключей Ed25519.\nНичего никуда не отправляется.",
  "onboarding.identity.failed_heading": "Не удалось создать ключи",
  "onboarding.identity.failed_body":
    "Устройство не позволило Airhop сохранить их безопасно. Попробуйте снова или перезагрузите телефон и откройте Airhop заново.",
  "onboarding.identity.steps_a11y": "Шаги: {steps}",
  "onboarding.identity.step.x25519": "Создаём статическую пару ключей X25519",
  "onboarding.identity.step.ed25519": "Создаём ключ подписи Ed25519",
  "onboarding.identity.step.keychain": "Сохраняем ключи в хранилище ОС",
  "onboarding.identity.step.peer_id": "Выводим идентификатор узла",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Ваше имя в сети",
  "onboarding.username.peer_id": "Идентификатор узла",
  "onboarding.username.card_a11y":
    "Ваше имя в сети — {username}. Идентификатор узла {peerID}. {props}.",
  "onboarding.username.explanation":
    "Это имя детерминированно выводится из вашего публичного ключа. Оно одинаково на каждом устройстве, которое видит ваш идентификатор узла.",
  "onboarding.username.cta": "Войти в Airhop",
  "onboarding.username.prop.algorithm": "Алгоритм",
  "onboarding.username.prop.storage": "Хранение",
  "onboarding.username.prop.storage_value": "Только хранилище ОС",
  "onboarding.username.prop.account": "Нужен аккаунт",
  "onboarding.username.prop.account_value": "Нет",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Добро пожаловать в Airhop",
  "onboarding.hello.p1":
    "Привет. Airhop построен на основе bitchat как независимый проект с открытым исходным кодом. Он не связан с проектом bitchat или permissionless tech и не одобрен ими — это просто то, что мне нравится делать и чем я делюсь с сообществом.",
  "onboarding.hello.p2":
    "Это первый выпуск для iOS и Android, и хотя я тестировал его с друзьями, вы наверняка наткнётесь на пару ошибок. Если так — или если у вас есть идея для функции, — буду рад услышать. Откройте issue на {github} или напишите мне на {email}.",
  "onboarding.hello.p3":
    "Если Airhop вам пригодился, поставьте звезду на {github} или оставьте отзыв в {store}. Это помогает большему числу людей найти проект. Спасибо, что попробовали!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Прежде чем телефон спросит",
  "onboarding.primer.lede":
    "Вот что делает каждое разрешение и чего не делает.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Находит устройства поблизости и передаёт сообщения между ними. Так возникает сеть, и она работает без интернета.",
  "onboarding.primer.location.title": "Геопозиция",
  "onboarding.primer.location.body":
    "Помещает вас в каналы окрестных зон — от квартала до региона. Airhop никогда не отслеживает вас и не отправляет вашу точную геопозицию с устройства.",
  "onboarding.primer.notifications.title": "Уведомления",
  "onboarding.primer.notifications.body":
    "Получайте оповещения о новых сообщениях, даже когда приложение закрыто. Уведомления создаются локально на вашем устройстве, без участия сервера.",
  "onboarding.primer.footnote":
    "Вы можете отказаться. Сообщения всё равно будут идти через интернет, а передумать можно позже в настройках.",
  "onboarding.primer.cta_a11y": "Перейти к запросам разрешений",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Доступ к Bluetooth",
  "permission.bluetooth.purpose": "находить устройства поблизости через сеть",
  "permission.open_settings": "Открыть настройки",
  "permission.not_now": "Не сейчас",
  "permission.blocked_title": "{label} отключён",
  "permission.blocked_body": "Включите его в настройках, чтобы {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Что-то пошло не так",
  "error.boundary.body":
    "Airhop столкнулся с неожиданной проблемой и был вынужден прервать отображение.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Стандартные каналы",
  "chat.channels.yours": "Ваши каналы",
  "chat.channels.none": "Каналов пока нет",
  "chat.channels.none_hint":
    "Нажмите {plus} вверху, чтобы присоединиться к каналу или создать свой.",
  "chat.channels.none_desc":
    "Каналов пока нет. Используйте кнопку добавления в шапке, чтобы присоединиться к каналу или создать свой.",
  "chat.channels.show_fewer": "Показать меньше стандартных каналов",
  "chat.channels.show_less": "Показать меньше",
  "chat.channels.info": "О канале",
  "chat.channels.pin": "Закрепить канал",
  "chat.channels.unpin": "Открепить канал",
  "chat.channels.mute": "Отключить уведомления канала",
  "chat.channels.unmute": "Включить уведомления",
  "chat.channels.leave": "Покинуть канал",
  "chat.channels.leave_confirm": "Покинуть",
  "chat.channels.clear_body":
    "Удалить все сообщения в {name}? Это нельзя отменить.",
  "chat.channels.leave_body":
    "Покинуть {name}? Вы перестанете получать сообщения, а история будет удалена с этого устройства.",
  "chat.channels.more_options": "Ещё действия для {name}",
  "chat.channels.teleported_tag": "{level}  ·  телепорт",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Очистить чат",
  "chat.dm.remove_contact": "Удалить контакт",
  "chat.dm.block": "Заблокировать узел",
  "chat.dm.block_confirm": "Заблокировать",
  "chat.dm.delete": "Удалить чат",
  "chat.dm.delete_body":
    "Разговор исчезнет из списка, а его сообщения будут удалены. Контакт сохранится, и новое сообщение от него начнёт чат заново.",
  "chat.dm.in_range": "в зоне действия",
  "chat.dm.row_hint": "Дважды коснитесь и удерживайте для других действий",
  "chat.channels.row_hint":
    "Дважды коснитесь и удерживайте для других действий",
  "chat.dm.you_prefix": "Вы:",
  "chat.dm.none": "Личных сообщений нет",
  "chat.dm.none_desc":
    "Перейдите на вкладку «Сеть» и коснитесь узла, чтобы начать зашифрованную переписку.",
  "chat.dm.contact_info": "О контакте",
  "chat.dm.pin": "Закрепить чат",
  "chat.dm.unpin": "Открепить чат",
  "chat.dm.mute": "Отключить уведомления чата",
  "chat.dm.unmute": "Включить уведомления",
  "chat.dm.clear_body": "Удалить все сообщения с {name}? Это нельзя отменить.",
  "chat.dm.remove_contact_body":
    "Удалить {name}? Разговор будет удалён, а контакт забыт. Этот человек по-прежнему сможет написать вам снова.",
  "chat.dm.block_body":
    "Заблокировать {name}? Вы не увидите этого человека на вкладке «Сеть» и не получите от него сообщений, даже если он рядом.",
  "chat.dm.more_options": "Ещё действия для {name}",
  "chat.dm.remove_contact_short": "Удалить контакт",
  "chat.dm.block_short": "Заблокировать контакт",
  "chat.dm.delete_short": "Удалить чат",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Очистить сообщения",
  "chat.clear_confirm": "Очистить",
  "chat.group_badge": "Группа",
  "chat.more": "Ещё",
  "chat.no_messages": "Сообщений пока нет",
  "chat.you": "Вы",
  "chat.a11y.channel": "Канал {name}",
  "chat.a11y.group": "Группа {name}",
  "chat.a11y.muted": "без уведомлений",
  "chat.a11y.pinned": "закреплён",

  // ---- Chats: start something new ----
  "chat.new.title": "Начать что-то новое",
  "chat.new.channel": "Создать приватный канал",
  "chat.new.channel_label": "Приватный канал",
  "chat.new.channel_desc":
    "Комната, куда может войти любой, у кого есть ссылка. Создайте свою или войдите по присланной ссылке.",
  "chat.new.group": "Создать приватную группу",
  "chat.new.group_label": "Приватная группа",
  "chat.new.group_desc":
    "Выберите конкретных людей. До 16. Остаётся на Bluetooth.",
  "chat.new.place": "Перейти к месту по geohash",
  "chat.new.place_label": "Перейти к месту",
  "chat.new.place_desc":
    "Откройте канал местоположения где угодно по его geohash.",
  "chat.new.reach": "Охват",
  "chat.new.reach_internet":
    "Доходит до участников через Bluetooth и интернет.",
  "chat.new.reach_mesh":
    "Работает в зоне действия Bluetooth, не через интернет.",
  "chat.new.reach_internet_desc":
    "Доходит до участников и через интернет. Ретрансляторы видят, что канал активен, но никогда не видят его сообщений и того, кто в нём.",
  "chat.new.reach_mesh_desc":
    "Остаётся в локальной сети. Максимум приватности: ничего не покидает зону действия Bluetooth.",
  "chat.new.join_link": "Войти в приватный канал по ссылке-приглашению",
  "chat.new.back_to_chooser": "Назад к выбору",
  "chat.new.create_channel": "Создать канал",
  "chat.new.name_required": "Сначала введите название канала",
  "chat.new.name_taken": "Это название уже занято",
  "chat.new.create": "Создать",
  "chat.new.e2ee":
    "Сквозное шифрование. Читать сообщения могут только участники.",
  "chat.new.invite_only":
    "Только по приглашению. Войти может любой, кому вы дадите ссылку. От всех остальных канал скрыт, даже от узлов поблизости.",
  "chat.new.name_exists": "Канал с таким названием уже существует.",
  "chat.new.reach_bluetooth_chip": "Только Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + интернет",
  "chat.new.have_link": "Войти по ссылке-приглашению",

  // ---- Chats: join by link ----
  "chat.join.title": "Вход по ссылке",
  "chat.join.not_airhop": "Это не ссылка Airhop.",
  "chat.join.reach_internet":
    "Доходит до участников через Bluetooth и интернет.",
  "chat.join.reach_mesh": "Остаётся в зоне действия Bluetooth.",
  "chat.join.contact_card":
    "Карточка контакта. Добавит человека в контакты и откроет чат.",
  "chat.join.unverified": "Не удалось проверить эту ссылку",
  "chat.join.unverified_body":
    "Карточка контакта не совпадает со своими же ключами, поэтому не была добавлена. Попросите прислать новую.",
  "chat.join.paste": "Вставить из буфера обмена",
  "chat.join.join": "Войти",
  "chat.join.public_channel":
    "Открытый канал {name}. Читать может любой, кто рядом.",
  "chat.join.private_channel": "Приватный канал {name}. {reach}",
  "chat.join.dm_with": "Личная переписка с {name}.",
  "chat.join.joined_as": "Вы вошли как {name}",
  "chat.join.name_clash_body":
    "Вы уже состоите в другом {name}. Названия каналов — просто ярлыки, поэтому это приглашение открыло собственный канал, а тот, в котором вы были, не затронут. Переименуйте любой из них в сведениях о канале.",
  "chat.join.paste_hint":
    "Вставьте приглашение, начинающееся с airhop://. Нажатие на ссылку тоже работает; это для ссылки, на которую нажать нельзя.",
  "chat.join.key_note":
    "Приглашение в приватный канал несёт ключ, поэтому вход мгновенный и ни от кого больше ничего не требуется.",
  "chat.join.offline_note":
    "Работает офлайн. Ссылка читается на этом устройстве, а охват канала такой, каким его задал создатель.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Не удалось открыть эту ячейку. Попробуйте через минуту.",
  "chat.jump.title": "Перейти к месту",
  "chat.jump.saved": "СОХРАНЁННЫЕ МЕСТА",
  "chat.jump.anywhere":
    "Откройте открытый канал местоположения где угодно, даже там, где вас нет.",
  "chat.jump.geohash_note":
    "Введите его geohash. Канал разделяют все, чья геопозиция попадает в эту ячейку.",
  "chat.jump.teleport_note":
    "Вы отображаетесь как телепортировавшийся, а не как находящийся рядом. Канал доходит только через интернет.",
  "chat.jump.level_cell": "Ячейка: {level}",
  "chat.jump.already_here": "Вы уже здесь. «Перейти» откроет ваш канал {name}.",
  "chat.jump.open_direction": "Открыть ячейку {direction}",
  "chat.jump.open_place": "Открыть {name}",
  "chat.jump.remove_place": "Убрать {name} из сохранённых мест",
  "chat.jump.go": "Перейти",
  "chat.jump.how":
    "Как найти geohash: откройте канал местоположения > коснитесь его названия > скопируйте оттуда.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Удалось связаться не со всеми участниками. Попробуйте снова, когда они будут рядом.",
  "chat.group.you_were_added": "Вас добавили в {name}.",
  "chat.group.added_you": "Добавил вас в {name}",
  "chat.group.you_were_removed":
    "Вас удалили из {name}. Здесь больше нельзя читать и писать.",
  "chat.group.removed_you": "Удалил вас из {name}",
  "chat.group.add_failed": "Не удалось добавить",
  "chat.group.add_failed_body":
    "Ничего не изменилось. Либо человек сейчас недоступен, либо в группе уже 16 участников, либо вы не её создатель.",
  "chat.group.remove_failed": "Не удалось удалить",
  "chat.group.remove_failed_body":
    "Ничего не изменилось. Менять состав может только тот, кто создал группу.",
  "chat.group.e2ee":
    "Сквозное шифрование. Читать сообщения могут только участники.",
  "chat.group.cap":
    "До 16 человек, которых выбираете вы. Ссылки-приглашения нет, поэтому никто не войдёт из-за того, что ему её переслали.",
  "chat.group.bluetooth":
    "Только Bluetooth. Участники вне зоны действия получат сообщения, как только вернутся.",
  "chat.group.members_label": "УЧАСТНИКИ",
  "chat.group.none_in_range":
    "Рядом никого нет. При создании группы участники должны быть поблизости.",
  "chat.group.create_title": "Создать группу",
  "chat.group.name_placeholder": "Название группы",
  "chat.group.create": "Создать",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Локальная сеть · только Bluetooth",
  "chat.scope.mesh_desc":
    "Доходит до устройств в зоне действия Bluetooth (примерно 10–100 метров). Интернет не нужен. Идеально для координации на месте.",
  "chat.scope.block": "Квартал · ~100 м",
  "chat.scope.block_desc":
    "Охват уровня квартала. Сообщения передаются через интернет, чтобы участвовать могли и те, кто вне зоны Bluetooth, но поблизости.",
  "chat.scope.neighborhood": "Район · ~1 км",
  "chat.scope.neighborhood_desc":
    "Охват района. С помощью ретрансляторов узлы по всей округе доступны даже без прямой связи по Bluetooth.",
  "chat.scope.city": "Город · ~10 км",
  "chat.scope.city_desc":
    "Общегородской канал. Использует геопривязанные интернет-ретрансляторы, чтобы дотянуться до узлов по всей агломерации.",
  "chat.scope.province": "Область или штат · ~100 км",
  "chat.scope.province_desc":
    "Охват области или штата. Передаётся через интернет для регионального охвата в сотни километров.",
  "chat.scope.country": "Страна или регион · ~1000 км",
  "chat.scope.country_desc":
    "Охват уровня страны. Присоединиться и читать может любой пользователь Airhop или bitchat в регионе.",
  "chat.transport.bluetooth": "Только Bluetooth",
  "chat.transport.both": "Bluetooth + интернет",
  "chat.transport.internet": "Только интернет",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Команда /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Отправить тёплые объятия",
  "chat.cmd.slap_hint": "Шлёпнуть большой форелью",
  "chat.status.sending": "Отправка…",
  "chat.status.undo_send": "Отменить отправку",
  "chat.status.undo": "Отменить",
  "chat.status.sent": "Отправлено",
  "chat.status.received": "Получено",
  "chat.status.failed": "Ошибка",
  "chat.status.canceled": "Отменено",
  "chat.status.waiting": "Ожидание",
  "chat.status.sending_short": "Отправка",
  "chat.status.receiving": "Приём",
  "chat.thread.not_available": "Здесь недоступно",
  "chat.thread.private_channel": "Приватный канал",
  "chat.thread.location_channel": "Канал местоположения",
  "chat.thread.public_channel": "Открытый канал",
  "chat.thread.notices": "Объявления этого канала",
  "chat.thread.invite": "Пригласить кого-нибудь в этот канал",
  "chat.thread.not_in_range":
    "Вне зоны действия Bluetooth. Доставляем через интернет.",
  "chat.thread.not_nearby":
    "Нет рядом. Доставим, когда человек вернётся в зону действия или выйдет в сеть.",
  "chat.thread.no_keys":
    "Чтобы написать, нужно быть в зоне действия Bluetooth или отсканировать их код.",
  "chat.geo.card_received":
    "{name} поделился контактом. Поделитесь своим в ответ, чтобы продолжить общение, когда кто-то из вас уйдёт.",
  "chat.geo.exchange_complete":
    "Контактами обменялись. Теперь вы можете связаться друг с другом откуда угодно.",
  "chat.geo.keep_person": "Сохранить этого человека",
  "chat.geo.keep_person_desc":
    "Поделитесь своим контактом, чтобы продолжить общение, когда кто-то из вас уйдёт. Человек узнает вашу постоянную личность.",
  "chat.geo.card_sent": "Отправлено · ждём их карточку",
  "chat.thread.left_cell":
    "Вы покинули эту зону, поэтому здесь до вас не дотянуться. Обменяйтесь кодами, чтобы общаться откуда угодно.",
  "chat.thread.no_route":
    "Сейчас не дотянуться. Сообщение уйдёт, как только появится маршрут.",
  "chat.thread.empty": "Сообщений пока нет",
  "chat.thread.empty_desc": "Начните зашифрованный разговор.",
  "chat.thread.jump_latest": "Перейти к последнему сообщению",
  "chat.thread.back_to_members": "Назад к участникам",
  "chat.thread.nostr_key": "Публичный ключ Nostr",
  "chat.thread.in_range": "В зоне действия",
  "chat.voice.not_recorded": "Голосовая заметка не записалась",
  "chat.thread.message": "Сообщение",
  "chat.thread.message_placeholder": "Сообщение…",
  "chat.thread.length_full": "Сообщение заполнено",
  "chat.thread.waiting_for": "Ждём возвращения {name} · {percent}%",
  "chat.thread.peer": "узел",
  "chat.thread.cancel_transfer": "Отменить {name}",
  "chat.thread.queued_more": "Ещё {count} ждут отправки",
  "chat.thread.across_bridge": "{count} через мост",
  "chat.thread.bridged": "через мост",
  "chat.thread.invite_body":
    "Присоединяйтесь ко мне в {channel} на Airhop — приватные сообщения по mesh-сети, работающие без интернета.",
  "chat.thread.go_back_unread": "Назад, {count} непрочитанных",
  "chat.thread.view_info": "Показать сведения о {name}",
  "chat.thread.notices_new": "Объявления этого канала, {count} новых",
  "chat.thread.say_something": "Скажите что-нибудь в {channel}.",
  "chat.thread.jump_latest_new":
    "Перейти к последнему сообщению, {count} новых",
  "chat.thread.unconfirmed_since": "С {date} доставка не подтверждалась",
  "chat.thread.no_reach": "Рядом нет узлов · это ещё никто не получил",
  "chat.thread.channel_needs_internet":
    "Интернет выключен · этот канал доходит только до тех, кто в зоне действия Bluetooth",
  "chat.thread.cell_needs_internet":
    "Интернет выключен · эта ячейка доступна только через интернет",
  "chat.thread.geo_dm_needs_internet":
    "Интернет выключен · этот разговор идёт только через интернет",
  "chat.thread.via_gateway":
    "Интернет выключен · устройство поблизости выводит это в сеть за вас",
  "chat.thread.group_queued":
    "Пока никого из этой группы нет рядом. Сообщение дойдёт, когда они появятся.",
  "chat.thread.no_group_key":
    "Вы больше не в этой группе, поэтому отправить не получится",
  "chat.thread.no_reach_offline":
    "Интернет выключен и рядом нет узлов · это ещё никто не получил",
  "chat.thread.mention": "Упомянуть {name}",
  "chat.thread.someone_talking": "{hold}. Сейчас говорит {name}.",
  "chat.thread.attach_note":
    "Файлы уходят только в зоне действия Bluetooth. Текст и платежи доходят до интернет-контактов, вложения — нет.",
  "chat.thread.message_peer": "Написать {name}",
  "chat.thread.send": "Отправить сообщение",
  "chat.thread.group": "Группа",
  "chat.bridge.nearby_only":
    "Только рядом: не пускать это сообщение на мост сети",
  "chat.bridge.nearby_label": "Только рядом · остаётся на Bluetooth",
  "chat.bridge.bridging_label":
    "Передаётся в соседние зоны · нажмите, чтобы оставить только рядом",
  "chat.screenshot.you_took": "Вы сделали снимок экрана",
  "chat.screenshot.you_took_private":
    "Вы сделали снимок экрана · никого не уведомили",
  "chat.screenshot.heads_up": "Обратите внимание",
  "chat.screenshot.notice": "* {name} сделал снимок экрана *",
  "chat.screenshot.notified_dm":
    "{name} уведомлён о том, что вы сделали снимок экрана этого разговора.",
  "chat.screenshot.notified":
    "Все в этом канале уведомлены о том, что вы сделали снимок экрана.",
  "chat.screenshot.not_notified":
    "Никого не уведомили. Этот канал открытый, и объявление о снимке экрана зафиксировало бы, что вы здесь были.",
  "chat.thread.error": "Ошибка",
  "chat.thread.go_back": "Назад",
  "chat.bubble.via_bridge": "через мост сети",
  "chat.bubble.view_profile": "Открыть профиль {name}",
  "chat.bubble.forwarded": "Переслано",
  "chat.bubble.attachment": "вложение",
  "chat.bubble.a11y":
    "{sender}: {body}. Нажмите и удерживайте для других действий.",
  "chat.bubble.failed_retry": "Не отправлено. Нажмите, чтобы повторить.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Сведения о сообщении",
  "chat.info.delivered_to": "Доставлено: {name}",
  "chat.info.read_by": "Прочитано: {name}",
  "chat.info.group_reach_desc":
    "Доступны сейчас, это не подтверждение доставки",
  "chat.info.group_alone": "Других участников нет",
  "chat.info.today_at": "Сегодня {time}",
  "chat.info.sending": "Отправка…",
  "chat.info.failed": "Не отправлено",
  "chat.info.courier": "Несёт другой человек",
  "chat.info.sent": "Отправлено",
  "chat.info.queued": "Ждёт отправки",
  "chat.info.waiting": "Ожидание…",
  "chat.action.info": "Сведения о сообщении",
  "chat.action.save_photos": "Сохранить в фото",
  "chat.action.save_copy": "Сохранить копию",
  "chat.action.forward": "Переслать",
  "chat.action.select": "Выбрать",
  "chat.select.cancel": "Отменить выбор",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Камера",
  "chat.attach.camera_desc": "Снять фото или видео",
  "chat.attach.library": "Медиатека",
  "chat.attach.library_desc": "Выбрать из медиатеки",
  "chat.attach.document": "Документ",
  "chat.attach.document_desc": "Отправить любой файл или PDF",
  "chat.attach.voice": "Голосовая заметка",
  "chat.attach.voice_desc": "Записать и отправить голосовое сообщение",
  "chat.attach.ecash": "Отправить ecash",
  "chat.attach.ecash_desc": "Отправить сатоши Cashu из кошелька",
  "chat.attach.location": "Геопозиция",
  "chat.attach.location_desc": "Отправить, где вы сейчас",
  "chat.attach.title": "Вложить",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Отправлена геопозиция",
  "chat.location.received_summary": "Поделился геопозицией",
  "chat.location.title": "Геопозиция",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Снято {ago} назад",
  "chat.location.open_maps": "Открыть в картах",
  "chat.location.no_forward": "Геопозиция не пересылается",
  "chat.location.no_forward_body":
    "Геопозиция отправляется одному человеку. Если она нужна кому-то ещё, отправьте свою.",
  "chat.location.no_fix": "Разрешите геопозицию, чтобы увидеть расстояние",
  "chat.location.send_title": "Отправить геопозицию",
  "chat.location.send_body":
    "{name} увидит одну точку: где вы сейчас. Она не обновляется.",
  "chat.location.send": "Отправить геопозицию",
  "chat.location.finding": "Определяем вашу геопозицию…",
  "chat.location.no_location": "Не удалось определить геопозицию",
  "chat.location.no_location_body":
    "Разрешите доступ к геопозиции, убедитесь, что службы геолокации включены, и попробуйте снова.",
  "chat.location.not_delivered": "Не удалось отправить геопозицию",
  "chat.location.not_delivered_body":
    "Геопозицию стоит отправлять, только пока она актуальна, поэтому она не откладывается на потом. Попробуйте снова, когда {name} будет доступен.",
  "chat.location.direction.n": "к северу",
  "chat.location.direction.ne": "к северо-востоку",
  "chat.location.direction.e": "к востоку",
  "chat.location.direction.se": "к юго-востоку",
  "chat.location.direction.s": "к югу",
  "chat.location.direction.sw": "к юго-западу",
  "chat.location.direction.w": "к западу",
  "chat.location.direction.nw": "к северо-западу",
  "chat.attach.send_anyway": "Всё равно отправить",
  "chat.attach.bitchat_too_big": "Это может не дойти",
  "chat.attach.bitchat_too_big_body":
    "{name} пользуется bitchat, а он бросает большой файл на полпути. Примерно до 350 KiB надёжно. При отправке контакту в Airhop такого ограничения нет.",
  "chat.attach.bitchat_unopenable": "Возможно, они не смогут это открыть",
  "chat.attach.bitchat_unopenable_body":
    "{name} пользуется bitchat: он показывает фото и голосовые заметки, а всё остальное перечисляет как файл, который не может открыть. Файл дойдёт, но открыть его может не получиться.",
  "chat.attach.file": "Вложить файл",
  "chat.attach.unavailable": "Вложения здесь недоступны",
  "chat.attach.not_sent": "Вложение не отправлено",
  "chat.attach.read_failed":
    "Что-то пошло не так при чтении файла. Попробуйте другой.",
  "chat.attach.caption": "Добавить подпись…",
  "chat.attach.send": "Отправить вложение",
  "chat.attach.generic": "Вложение",
  "chat.media.view_full": "Открыть фото на весь экран",
  "chat.media.gone_photo": "Фото нет на этом устройстве",
  "chat.media.gone_video": "Видео нет на этом устройстве",
  "chat.media.gone_voice": "Голосовой заметки нет на этом устройстве",
  "chat.media.gone_file": "Файла нет на этом устройстве",
  "chat.media.gone_note": "Удалено через 7 дней или при очистке кэша",
  "chat.media.ask_resend": "Попросить снова",
  "chat.media.resend_draft": "Можешь ещё раз прислать {kind}?",
  "chat.media.kind_photo": "фото",
  "chat.media.kind_video": "видео",
  "chat.media.kind_voice": "голосовую заметку",
  "chat.media.kind_file": "файл",
  "chat.media.pause_voice": "Пауза голосовой заметки",
  "chat.media.play_voice": "Воспроизвести голосовую заметку",
  "chat.media.voice_position": "Позиция в голосовой заметке",
  "chat.media.voice_scrub": "Коснитесь полосок, чтобы перейти к нужному месту",
  "chat.media.image": "Изображение",
  "chat.media.tap_load_photo": "Нажмите, чтобы загрузить фото",
  "chat.media.open_document": "Открыть {name}",
  "chat.media.document": "документ",
  "chat.media.tap_load_video": "Нажмите, чтобы загрузить видео",
  "chat.media.video": "Видео",
  "chat.media.photo": "Фото",
  "chat.media.close_photo": "Закрыть фото",
  "chat.media.save_photo": "Сохранить фото в вашу медиатеку",
  "chat.media.share_photo": "Поделиться фото",
  "chat.media.saved_videos": "Сохранено в ваши видео",
  "chat.media.saved_photos": "Сохранено в ваши фото",
  "chat.media.not_saved": "Не сохранено",
  "chat.media.cant_open": "Не удалось открыть файл",
  "chat.media.no_app":
    "На этом устройстве нет приложения, способного открыть этот файл или поделиться им.",
  "chat.media.open_failed": "Файл не открылся. Возможно, он удалён из кэша.",
  "media.blocked.nostr_only":
    "Вы знаете этого человека только через ретранслятор. Доступен только текст. Для фото, файлов и голосовых заметок нужен Bluetooth.",
  "media.blocked.private_channel":
    "Широковещательное вложение подписано, но не зашифровано, поэтому в приватном канале оно оказалось бы открытым, тогда как текст здесь остаётся зашифрованным.",
  "media.blocked.private_group":
    "Широковещательное вложение подписано, но не зашифровано, поэтому в приватной группе оно оказалось бы открытым, тогда как текст здесь остаётся зашифрованным.",
  "media.blocked.location_channel":
    "Канал местоположения доходит до людей через интернет, а фото, файлы и голосовые заметки идут по Bluetooth, поэтому они никогда не дойдут.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Голосовые заметки здесь недоступны",
  "chat.voice.hold_live": "Удерживайте, чтобы говорить в эфир",
  "chat.voice.hold_record": "Удерживайте, чтобы записать голосовую заметку",
  "chat.voice.cancel_recording": "Отменить запись",
  "chat.voice.slide_cancel": "Проведите, чтобы отменить",
  "chat.voice.release_cancel": "Отпустите, чтобы отменить",
  "chat.voice.a11y_toggle":
    "Дважды коснитесь, чтобы начать или закончить говорить.",
  "chat.voice.limit_reached":
    "Достигнут предел в две минуты, отпустите для отправки",
  "chat.voice.limit_sent": "Достигнут предел в две минуты, заметка отправлена",
  "chat.voice.stop_send": "Остановить запись и отправить",
  "chat.voice.lift_lock": "Проведите вверх для записи без рук",
  "chat.voice.live_speaking": "{name} говорит",
  "voice.unavailable": "Голосовая связь недоступна",
  "voice.recording_stopped": "Запись остановлена",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Доступ к камере",
  "chat.perm.camera_purpose": "снять фото для отправки",
  "chat.perm.photo_label": "Доступ к фото",
  "chat.perm.photo_purpose": "выбрать фото или видео для отправки",
  "chat.perm.photo_save_purpose": "сохранить это в ваши фото",
  "chat.perm.mic_label": "Доступ к микрофону",
  "chat.perm.mic_live_purpose": "говорить с людьми поблизости",
  "chat.perm.mic_note_purpose": "записать голосовую заметку",
  "chat.perm.recording_stopped": "Запись остановлена",
  "chat.perm.record_failed":
    "Не удалось начать запись. Проверьте разрешения микрофона.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Получено",
  "chat.ecash.reclaimed": "Возвращено",
  "chat.ecash.claiming": "Получаем…",
  "chat.ecash.claim": "Получить",
  "chat.ecash.claim_amount": "Получить {amount} {unit}",
  "chat.ecash.already_claimed": "Уже получено",
  "chat.ecash.already_claimed_body":
    "Все доказательства из этого токена уже в вашем кошельке, поэтому ничего не добавилось.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "Передано сети для доставки по возможности",
  "chat.info.queued_desc":
    "Хранится на этом телефоне, пока не появится маршрут",
  "chat.info.reclaimed": "Возвращено",
  "chat.info.reclaimed_desc":
    "Вы вернули этот платёж в кошелёк, поэтому он не будет доставлен",
  "chat.info.about": "О канале",
  "chat.info.group_desc":
    "Приватная группа. Читать могут только участники, добавленные создателем, и она остаётся на Bluetooth.",
  "chat.info.teleported_desc":
    "Открытый канал местоположения для этой ячейки geohash. Им делятся через интернет все, кто в ячейке, на Airhop или bitchat. Вы телепортировались, а не находитесь здесь физически.",
  "chat.info.custom_desc":
    "Свой канал. Присоединиться может любой, кто знает название, с любого устройства Airhop или bitchat.",
  "chat.info.private_e2ee": "Приватный · сквозное шифрование",
  "chat.info.public_plain": "Открытый · без шифрования",
  "chat.info.group_privacy":
    "Читать эту группу могут только участники, показанные ниже. Сообщения остаются на Bluetooth, поэтому те, кто вне зоны действия, получат их по возвращении.",
  "chat.info.teleport_privacy":
    "Место, куда вы телепортировались. Канал доходит через интернет до всех в этой ячейке и ни до кого в зоне действия Bluetooth.",
  "chat.info.location_off_privacy":
    "Геопозиция отключена, поэтому этот канал доходит только до устройств поблизости по Bluetooth. Включите геопозицию, чтобы дотянуться до его зоны через интернет.",
  "chat.info.invite_privacy":
    "Читать могут только те, кого вы пригласили по ссылке. От всех остальных канал скрыт, даже от узлов поблизости.",
  "chat.info.public_privacy":
    "Любой, кто присоединится, может читать все сообщения. Для приватного разговора используйте личные сообщения: в них сквозное шифрование.",
  "chat.info.remove_member": "Удалить участника",
  "chat.info.remove_member_body":
    "Удалить {name} из группы? Ключ группы сменится, поэтому новые сообщения человек читать не сможет.",
  "chat.info.message_member": "Написать {name}",
  "chat.info.remove_member_a11y": "Удалить {name}",
  "chat.info.no_addable":
    "Нет доступных узлов для добавления. Участники должны быть поблизости.",
  "chat.info.add_count": "Добавить: {count}",
  "chat.info.teleported_tag": "{level}  ·  телепорт",
  "chat.info.active": "Активен",
  "chat.info.members": "Участники",
  "chat.info.bookmark": "Сохранить это место",
  "chat.info.remove_bookmark": "Убрать из сохранённых",
  "chat.info.default_notice":
    "Стандартные каналы нельзя покинуть. Они часть протокола сети Airhop.",
  "chat.info.custom_channel": "Свой канал",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Копировать geohash",
  "chat.info.relays": "Ретрансляторы",
  "chat.info.show_relays": "Показать ретрансляторы, несущие этот канал",
  "chat.info.relay_custom": "свой",
  "chat.info.relays_none":
    "Нет. Сейчас эта ячейка работает только по Bluetooth.",
  "chat.info.search_members": "Поиск участников",
  "chat.info.search_members_placeholder": "Поиск участников…",
  "chat.info.teleported": "Телепорт",
  "chat.info.creator": "Создатель",
  "chat.info.no_matches": "Совпадений нет",
  "chat.info.no_one_here": "Здесь пока никого нет",
  "chat.info.add_members": "Добавить участников",
  "chat.info.add_selected": "Добавить выбранных участников",
  "chat.info.add": "Добавить",
  "chat.info.leave_group": "Покинуть группу",
  "chat.info.leave_channel": "Покинуть канал",
  "chat.info.leave": "Покинуть",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Общаетесь с {date}",
  "chat.contact.verified_since": "Подтверждён с {date}",
  "chat.contact.anonymous": "Аноним",
  "chat.contact.anonymous_desc":
    "Псевдоним, привязанный к geohash, без постоянной личности для проверки",
  "chat.contact.verified": "Подтверждён",
  "chat.contact.verified_desc": "Вы отсканировали их QR-код",
  "chat.contact.verified_desc_compared": "Вы сверили коды друг с другом",
  "chat.contact.not_verified": "Не подтверждён",
  "chat.contact.not_verified_desc":
    "Отсканируйте код или сверьте его по звонку, чтобы убедиться, что это действительно он",
  "chat.contact.e2ee": "Сквозное шифрование",
  "chat.contact.e2ee_nostr":
    "Упаковано по NIP-17, поэтому ретрансляторы не могут это прочитать",
  "chat.contact.e2ee_mesh":
    "Noise XX плюс Double Ratchet между устройствами Airhop",
  "chat.contact.copy_nostr": "Копировать публичный ключ Nostr",
  "chat.contact.nostr_key": "Публичный ключ Nostr",
  "chat.contact.cell_key_note":
    "Этот ключ принадлежит зоне, где вы встретились. Он изменится, если кто-то из вас уйдёт, и разговор на этом закончится. Обменяйтесь контактами, чтобы общаться откуда угодно.",
  "chat.contact.peer_name": "Имя узла",
  "chat.contact.peer_id": "Идентификатор узла",
  "chat.contact.rename": "Переименовать",
  "chat.contact.rename_needs_contact":
    "Переименовывать можно тех, чьи ключи у вас есть. Сначала обменяйтесь карточками контактов, и тогда это станет именем, которое видите только вы.",
  "chat.contact.rename_needs_keys":
    "Для этого контакта пока нет ключей. Напишите человеку или отсканируйте его код, и тогда сможете дать ему имя, которое видите только вы.",
  "chat.contact.renamed_by_you": "Ваше имя для него",
  "chat.contact.copy_peer_id": "Копировать идентификатор узла",
  "chat.contact.verify": "Подтвердить контакт",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Объявления",
  "chat.notices.post_area": "Опубликовать объявление в этой зоне",
  "chat.notices.post_mesh": "Опубликовать объявление в сети",
  "chat.notices.mark_urgent": "Пометить как срочное",
  "chat.notices.post": "Опубликовать объявление",
  "chat.notices.post_short": "Опубликовать",
  "chat.notices.delete": "Удалить объявление",
  "chat.notices.just_now": "только что",
  "chat.notices.fades_soon": "скоро исчезнет",
  "chat.notices.1_day": "1 день",
  "chat.notices.3_days": "3 дня",
  "chat.notices.7_days": "7 дней",
  "chat.notices.fading": "исчезает",
  "chat.notices.fades_in_hours": "исчезнет через {count} ч",
  "chat.notices.fades_in_days": "исчезнет через {count} д",
  "chat.notices.scope_geo": "Гео",
  "chat.notices.scope_mesh": "Сеть",
  "chat.notices.urgent_short": "Срочно",
  "chat.notices.permanent_warning":
    "Не исчезает никогда. Публично и привязано к этой зоне, отозвать нельзя.",
  "chat.notices.none":
    "Объявлений пока нет. Опубликуйте своё, и оно останется здесь для других.",

  // ---- Chats: search results ----
  "chat.search.photos": "Фото",
  "chat.search.videos": "Видео",
  "chat.search.audio": "Аудио",
  "chat.search.documents": "Документы",
  "chat.search.links": "Ссылки",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Фильтр: {filter}",
  "chat.search.no_matches":
    "Нет совпадений в разделе «{filter}» по запросу «{query}»",
  "chat.search.no_media": "В разделе «{filter}» пока пусто",
  "chat.search.result_a11y": "{chat}, {kind} от {sender}",
  "chat.search.you": "вы",
  "chat.search.section_chats": "Чаты",
  "chat.search.section_messages": "Сообщения",
  "chat.search.section_notices": "Объявления",
  "chat.search.hint": "Ищите по сообщениям и чатам или выберите фильтр выше.",
  "chat.search.no_results": "Нет результатов по запросу «{query}»",
  "chat.search.open_chat": "Открыть {name}",
  "chat.search.message_a11y": "{chat}, сообщение от {sender}: {snippet}",
  "chat.search.notice_a11y": "Объявление в {chat} от {author}: {snippet}",
  "chat.search.urgent": "Срочно ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "{count} в этом списке. Очистка убирает их только отсюда, а сообщения остаются непрочитанными в своих разговорах. «Отметить все прочитанными» очищает и то, и другое.",
  "chat.notif.mark_all_read": "Отметить все прочитанными",
  "chat.notif.clear_list": "Очистить список",
  "chat.notif.clear_all_a11y": "Удалить все уведомления: {count}",
  "chat.notif.title": "Уведомления",
  "chat.notif.clear_short": "Очистить",
  "chat.notif.close": "Закрыть уведомления",
  "chat.notif.none": "Уведомлений пока нет",
  "chat.notif.none_desc":
    "Сообщения, упоминания и объявления из ваших каналов и чатов появятся здесь.",
  "chat.notif.new": "Новое",
  "chat.notif.notice_in": "объявление в {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Переслать в…",
  "chat.forward.to": "Переслать: {name}",
  "chat.forward.cant_send_here": "Сюда переслать нельзя",
  "chat.forward.cant_send_to": "Нельзя переслать: {name}",
  "chat.forward.channels": "Каналы",
  "chat.forward.groups": "Группы",
  "chat.forward.locations": "Места",
  "chat.forward.dms": "Личные сообщения",
  "chat.forward.none": "Других чатов пока нет",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Запускаем сеть…",
  "mesh.banner.no_bluetooth":
    "На этом устройстве нет Bluetooth · только интернет",
  "mesh.banner.bluetooth_off": "Bluetooth выключен · сеть недоступна",
  "mesh.banner.permission_needed": "Нужно разрешение на Bluetooth",
  "mesh.banner.blocked": "Bluetooth заблокирован · разрешите его в настройках",
  "mesh.banner.location_permission": "Для поиска узлов нужна геопозиция",
  "mesh.banner.advertising_unsupported":
    "Этот телефон видит других, но его самого найти нельзя",
  "mesh.banner.location_off_android":
    "Геопозиция выключена · Android нужна она для поиска узлов",
  "mesh.banner.paused": "Сеть приостановлена · вы отошли",
  "mesh.banner.location_off":
    "Геопозиция выключена · каналы местоположения недоступны",
  "mesh.banner.battery_saver": "Энергосбережение · сканируем реже",
  "mesh.banner.wipe_incomplete":
    "Очистка не завершена · часть данных могла остаться, повторим при открытии",
  "mesh.banner.wifi_off": "Wi-Fi выключен · большие файлы уходят медленнее",
  "mesh.banner.clock_skew":
    "Часы этого телефона идут неверно · включите автоматические дату и время",
  "mesh.banner.internet_off": "Интернет выключен · только Bluetooth",
  "mesh.banner.relaying": "Локальных узлов нет · передаём через Nostr",
  "mesh.banner.tor": "Tor включён · трафик направляется через него",
  "mesh.banner.tor_starting": "Запускаем Tor · подключаемся",
  "mesh.banner.tor_blocked":
    "Tor не смог подключиться · сеть всё равно работает",
  "mesh.banner.gateway":
    "Интернет-шлюз включён · передаём для узлов поблизости",
  "mesh.banner.bridge": "Мост сети включён · открытый чат связан",
  "mesh.banner.background_limits": "{brand} может приостанавливать сеть в фоне",
  "mesh.banner.bridge_across": "Мост сети включён · {count} через мост",
  "mesh.banner.action.turn_on": "Включить",
  "mesh.banner.action.allow": "Разрешить",
  "mesh.banner.action.resume": "Возобновить",
  "mesh.banner.action.fix": "Исправить",
  "mesh.banner.hint.resume":
    "Снова включает вещание и сканирование по Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Просит Android включить Bluetooth",
  "mesh.banner.hint.location_settings":
    "Открывает системные настройки геопозиции",
  "mesh.banner.hint.app_settings":
    "Открывает разрешения Airhop в системных настройках",
  "mesh.banner.hint.battery_settings":
    "Открывает настройки фоновой активности этого телефона",
  "mesh.banner.dismiss": "Скрыть: {label}",
  "mesh.banner.hint.dismiss": "Скрывает это уведомление насовсем",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Ищем узлы поблизости…",
  "mesh.radar.starting": "Запускаем сеть…",
  "mesh.radar.no_bluetooth": "На этом устройстве нет Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth выключен · не сканируем",
  "mesh.radar.permission_needed": "Нужно разрешение на Bluetooth",
  "mesh.radar.blocked": "Bluetooth заблокирован",
  "mesh.radar.location_permission": "Нужно разрешение на геопозицию",
  "mesh.radar.location_off": "Геопозиция выключена · не сканируем",
  "mesh.radar.hint_rings":
    "Кольца показывают силу сигнала BLE, а не расстояние",
  "mesh.radar.hint_checking": "Проверяем Bluetooth и разрешения",
  "mesh.radar.hint_internet": "Сообщения всё равно идут через интернет",
  "mesh.radar.hint_turn_on": "Включите Bluetooth, чтобы находить узлы",
  "mesh.radar.hint_allow": "Разрешите Bluetooth, чтобы находить узлы",
  "mesh.radar.hint_allow_settings":
    "Разрешите Bluetooth в настройках, чтобы находить узлы",
  "mesh.radar.hint_location_permission":
    "Android 11 и старше нужна геопозиция для сканирования по Bluetooth",
  "mesh.radar.hint_android_location":
    "Android нужна включённая геопозиция, чтобы возвращать результаты сканирования Bluetooth",
  "mesh.radar.signal_strong": "Сильный",
  "mesh.radar.signal_medium": "Средний",
  "mesh.radar.signal_weak": "Слабый",
  "mesh.radar.you_center": "Вы, в центре сети",
  "mesh.radar.sonar_hint":
    "Проигрывает звук сонара. Сканирование и так идёт постоянно.",
  "mesh.radar.paused": "Сеть приостановлена · вы отошли",
  "mesh.radar.ring_hint":
    "Положение кольца отражает силу сигнала, а не расстояние",
  "mesh.radar.set_online":
    "Поставьте статус «В сети» в профиле, чтобы находить узлы",
  "mesh.radar.in_range": "в зоне действия",
  "mesh.radar.recently_seen": "недавно виден",
  "mesh.radar.peer_hint":
    "Открывает действия: написать этому узлу или заплатить",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "только что",
  "mesh.peer.none": "Узлов поблизости нет",
  "mesh.peer.none_desc":
    "Другие устройства Airhop или bitchat в зоне действия Bluetooth появятся здесь.",
  "mesh.peer.id_copied": "Идентификатор узла скопирован",
  "mesh.peer.copy_id": "Копировать идентификатор узла",
  "mesh.peer.their_name": "Известен как {name}",
  "mesh.peer.in_range": "В зоне действия",
  "mesh.peer.relay": "Узел-ретранслятор",
  "mesh.peer.relay_body":
    "Приёмник, который кто-то оставил работать, чтобы расширить сеть. Он несёт сообщения, которые не может прочитать. Здесь некому писать.",
  "mesh.peer.send_dm": "Отправить личное сообщение",
  "mesh.peer.message": "Сообщение",
  "mesh.peer.send_sats": "Отправить ecash",
  "mesh.peer.amount_placeholder": "Сумма в сатоши",
  "mesh.peer.amount_first": "Отправить ecash, сначала введите сумму",
  "mesh.peer.cancel_send": "Отменить отправку ecash",
  "mesh.peer.view_peer": "Открыть узел {name}",
  "mesh.peer.view_peer_online": "Открыть узел {name}, в сети",
  "mesh.peer.last_seen": "Был виден {ago} назад",
  "mesh.peer.send_amount": "Отправить {amount} сатоши",
  "mesh.peer.direct": "Прямое соединение",
  "mesh.peer.check_distance": "Измерить расстояние",
  "mesh.peer.checking": "Измеряем",
  "mesh.peer.no_reply": "Нет ответа",
  "mesh.peer.no_reply_hint":
    "Возможно, человек ушёл или его приложение не отвечает",
  "mesh.peer.rtt": "{ms} мс",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Регион",
  "mesh.level.province": "Область",
  "mesh.level.city": "Город",
  "mesh.level.neighborhood": "Район",
  "mesh.level.block": "Квартал",
  "mesh.level.building": "Здание",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Доступно",
  "wallet.balance.unit_hint": "Переключает между сатоши и биткойном",
  "wallet.balance.a11y": "Баланс {value} {unit}",
  "wallet.balance.locked":
    "Хранилище кошелька заблокировано. Доказательства ecash лежат в зашифрованном файле, ключ от которого хранится в связке ключей устройства, и открыть его не удалось. Разблокируйте устройство и откройте Airhop заново.",
  "wallet.balance.tor_blocked":
    "Tor включён, поэтому запросы к монетному двору заблокированы: они пошли бы по открытой сети и связали ваш IP с вашими доказательствами. Отправка и приём через сеть по-прежнему работают. Разрешите трафик к монетному двору в разделе «Настройки», «Безопасность».",
  "wallet.balance.unconfirmed_note":
    "{amount} ещё не подтверждено монетным двором",
  "wallet.balance.reserved_note":
    "{amount} зарезервировано для отправки в процессе",
  "wallet.balance.other_mint_note": "{amount} на счёте другого монетного двора",
  "wallet.balance.test_mint_note":
    "Включает игровые деньги с тестового монетного двора. Это не биткойн, и обналичить их нельзя.",
  "wallet.token": "Токен",
  "wallet.action.send": "Отправить токен ecash",
  "wallet.action.send_disabled":
    "Отправить токен ecash — недоступно при нулевом балансе",
  "wallet.action.receive": "Получить токен ecash",
  "wallet.action.zap": "Отправить zap контакту в Nostr",
  "wallet.action.zap_disabled":
    "Отправить zap контакту в Nostr — недоступно при нулевом балансе",
  "wallet.action.add_mint": "Добавить монетный двор Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Не удалось собрать токен",
  "wallet.send.title": "Отправить ecash",
  "wallet.send.amount_in": "Сумма в {unit}",
  "wallet.send.body":
    "Собран офлайн из доказательств, которые у вас уже есть. Ничего не уходит с баланса окончательно, пока вы не подтвердите доставку токена.",
  "wallet.send.stale_fee_note":
    "Комиссии проверялись {days} дн. назад. Если этот монетный двор с тех пор поднял комиссию, отправка может стоить чуть дороже.",
  "wallet.send.fee_note":
    "{spend} {unit} уходит с баланса; дополнительные {fee} покрывают комиссию монетного двора, которую иначе заплатил бы получатель",
  "wallet.send.qr_too_big":
    "Этот токен разбит на слишком много монет, чтобы поместиться в QR-код. Поделитесь им или скопируйте его либо обновите доказательства у монетного двора, чтобы объединить их.",
  "wallet.send.bearer_note":
    "Деньги принадлежат тому, у кого эта строка. Доказательства зарезервированы, а не потрачены: если строка никого не достигнет, их можно вернуть в разделе «Ожидающие».",
  "wallet.send.qr_too_big_short":
    "Этот токен разбит на слишком много монет, чтобы поместиться в QR-код. Поделитесь им или скопируйте его.",
  "wallet.send.scan_note":
    "Попросите отсканировать это из их кошелька. До отметки о доставке токен можно вернуть.",
  "wallet.send.mesh_note":
    "Токен уходит как зашифрованное личное сообщение по сети. Интернет не нужен.",
  "wallet.send.no_peers_note":
    "Откройте вкладку «Сеть», чтобы найти устройства поблизости, или передайте токен другим способом.",
  "wallet.send.send_to": "Отправить: {name}",
  "wallet.send.memo": "Заметка (необязательно, идёт вместе с токеном)",
  "wallet.send.building": "Собираем…",
  "wallet.send.build": "Собрать токен",
  "wallet.send.inexact_body":
    "Ваши доказательства не составляют ровно {amount} {unit} офлайн. Наименьший токен, который можно собрать, — {spend} {unit}, а офлайн сдачи не бывает: лишние {extra} {unit} достанутся получателю.\n\nОбновление доказательств у монетного двора в сети разделило бы их на номиналы, дающие точную сумму.",
  "wallet.send.send_amount": "Отправить {amount}",
  "wallet.send.sent_to": "{amount} {unit} отправлено: {name}",
  "wallet.send.sent_to_body":
    "{route} Токен остаётся возвратным в разделе «Ожидающие», пока вы не подтвердите получение или пока монетный двор не сообщит, что доказательства погашены.",
  "wallet.send.copy_token": "Копировать токен",
  "wallet.send.share_token": "Поделиться токеном",
  "wallet.send.open_in_wallet": "Открыть этот токен в другом кошельке",
  "wallet.send.open_in_wallet_short": "Открыть в кошельке",
  "wallet.send.to_peer": "Отправить токен узлу поблизости",
  "wallet.send.to_peer_short": "Отправить узлу",
  "wallet.send.mark_delivered": "Отметить доставленным и завершить",
  "wallet.send.they_got_it": "Получено",
  "wallet.send.keep_pending": "Оставить отправку в ожидании",
  "wallet.send.decide_later": "Решить позже",
  "wallet.send.no_peers": "В зоне действия нет узлов",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Это ваш собственный платёж",
  "wallet.receive.own_payment_body":
    "Эти монеты всё ещё зарезервированы под неурегулированную отправку, поэтому получать нечего. Нажмите «Вернуть» у того платежа, чтобы сразу положить их обратно на баланс.",
  "wallet.receive.already_have": "Уже в вашем кошельке",
  "wallet.receive.already_have_body":
    "Все доказательства из этого токена уже хранятся здесь, поэтому ничего не добавилось. Балансы не изменились.",
  "wallet.receive.stored_unconfirmed":
    "Сохранено от {mint}, но ещё не подтверждено монетным двором ({reason}).",
  "wallet.receive.offline": "офлайн",
  "wallet.receive.redeemed_here":
    "Погашено в {mint}. Эти доказательства теперь только ваши: копия отправителя больше не работает.",
  "wallet.receive.memo_quoted": "\n\n«{memo}»",
  "wallet.receive.redeemed_at":
    "Погашено в {mint}. Теперь это доказуемо ваше: копия этого токена у отправителя больше не работает.",
  "wallet.receive.stored_pending":
    "Сохранено от {mint}, но монетный двор ещё не подтвердил, что оно не потрачено{dleq}. Обновите на вкладке «Кошелёк», как только выйдете в сеть.",
  "wallet.receive.dleq_inline":
    " (подпись при этом сходится, так что токен подлинный)",
  "wallet.receive.dleq_ok":
    "Подпись монетного двора сходится, значит токен подлинный.",
  "wallet.receive.dleq_uncached":
    "Ключи монетного двора здесь не сохранены, поэтому подпись нельзя было проверить офлайн.",
  "wallet.receive.dleq_warning":
    "Пока вы не обновите данные в сети, отправитель в принципе мог потратить их где-то ещё.",
  "wallet.receive.failed": "Не удалось получить",
  "wallet.receive.title": "Получить ecash",
  "wallet.receive.body":
    "Вставьте токен Cashu. В сети он сразу гасится у монетного двора; офлайн сохраняется и подтверждается при следующем обновлении.",
  "wallet.receive.scan": "Отсканировать QR-код ecash",
  "wallet.receive.scan_short": "Сканировать QR",
  "wallet.receive.receiving": "Получаем…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap получен от {from}… и зачислен в ваш кошелёк.",
  "wallet.zap.title": "Отправить zap личности в Nostr",
  "wallet.zap.not_npub": "не npub",
  "wallet.zap.bad_key": "неверный ключ",
  "wallet.zap.invalid_pubkey": "Неверный публичный ключ",
  "wallet.zap.invalid_pubkey_body":
    "Введите npub1… или 64-символьный шестнадцатеричный публичный ключ Nostr.",
  "wallet.zap.sent": "Nutzap отправлен",
  "wallet.zap.failed": "Zap не удался",
  "wallet.zap.body":
    "Если человек публикует сведения nutzap по NIP-61, ecash привязывается к его ключу, так что потратить их не может никто другой и вернуть их нельзя. Если нет, платёж уйдёт возвратным токеном. Мы сообщим, что именно произошло.",
  "wallet.zap.contact": "Отправить zap: {name}",
  "wallet.zap.pubkey_placeholder": "npub1… или 64 символа hex",
  "wallet.zap.sending": "Отправка…",
  "wallet.nostr.copied_body":
    "Передайте это кому-нибудь, и он сможет отправить вам zap из Airhop или любого другого кошелька Nostr, без всякого Bluetooth.",
  "wallet.nostr.copy_key":
    "Скопируйте свой ключ Nostr, чтобы вам могли отправлять zap",
  "wallet.nostr.your_key": "Ваш ключ Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Монетный двор добавлен",
  "wallet.mint.add_failed": "Не удалось добавить монетный двор",
  "wallet.mint.added_named": "Добавлен {name}",
  "wallet.mint.added_body":
    "{mint} выпускает {units}. Его ключи сохранены на этом устройстве, поэтому токены от него теперь можно проверять даже без интернета.",
  "wallet.mint.remove_plain":
    "Убрать {mint} из кошелька? Сохранённые ключи уйдут вместе с ним, и токены от него больше нельзя будет проверить офлайн.",
  "wallet.mint.title": "Монетные дворы",
  "wallet.mint.none": "Монетного двора пока нет",
  "wallet.mint.none_desc":
    "Монетный двор выпускает и гасит ваши ecash. Добавьте его, чтобы пополнять через Lightning, или просто получите токен — и его двор добавится сам.",
  "wallet.mint.add": "Добавить монетный двор",
  "wallet.mint.add_body":
    "Монетный двор держит биткойн, обеспечивающий ваши ecash, поэтому выбирайте тот, которому доверили бы хранимый там баланс. Адрес проверяется перед сохранением. Запустите свой через Nutshell, если не хотите доверять никому.",
  "wallet.mint.consolidate_body":
    "Токен всегда указывает только один монетный двор, поэтому баланс, разбросанный по нескольким, не оплатит сумму больше той, что лежит в самом крупном. Airhop может его перенести: каждый другой двор оплатит счёт Lightning, выставленный выбранным вами. Это стоит небольшой комиссии за маршрутизацию и требует интернета.",
  "wallet.mint.add_short": "Добавить двор",
  "wallet.mint.checking": "Проверяем…",
  "wallet.mint.remove_with_balance": "Убрать монетный двор с балансом?",
  "wallet.mint.remove": "Убрать монетный двор",
  "wallet.mint.delete_anyway": "Всё равно удалить",
  "wallet.mint.consolidate": "Перенести все балансы в один двор",
  "wallet.mint.confirm_with": "Подтвердить доказательства в {mint}",
  "wallet.mint.remove_a11y": "Убрать {mint}",
  "wallet.mint.available_amount": "Доступно {amount} {unit}",
  "wallet.mint.split_across":
    "Баланс разбит по монетным дворам: {count}. Перенесите его в один.",
  "wallet.mint.move_everything_to": "Перенести всё в {mint}",
  "wallet.mint.consolidate_title": "Перенос в один монетный двор",
  "wallet.mint.moving": "Переносим…",
  "wallet.mint.move": "Перенести",
  "wallet.mint.moved": "Перенесено",
  "wallet.mint.moved_body":
    "{amount} {unit} теперь лежит в {mint}, после {fees} {unit} комиссии за маршрутизацию Lightning.",
  "wallet.mint.nothing_moved": "Ничего не перенесено",
  "wallet.mint.destination": "· назначение",
  "wallet.mint.will_move": "· будет перенесено",
  "wallet.mint.issued_by": "Выпущено",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Пополнение кошелька Airhop",
  "wallet.ln.invoice_failed": "Не удалось создать счёт",
  "wallet.ln.price_failed": "Не удалось рассчитать этот счёт",
  "wallet.ln.paid": "Оплачено",
  "wallet.ln.deposit_credited":
    "Счёт оплачен, и {mint} выпустил {amount} {unit}. Этот баланс подтверждён: тратить его офлайн можно сразу.",
  "wallet.ln.withdrawn":
    "{paid} сатоши оплачено через Lightning. Монетный двор удержал {fee} сатоши комиссии за маршрутизацию.",
  "wallet.ln.withdrawn_with_change":
    "{paid} сатоши оплачено через Lightning. Монетный двор удержал {fee} сатоши комиссии за маршрутизацию и вернул {change} сатоши резерва на ваш баланс.",
  "wallet.ln.payment_failed": "Платёж не прошёл",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Превратите сатоши из Lightning в ecash, который можно тратить офлайн, или обналичьте ecash на любой счёт Lightning. И то, и другое требует интернета и монетного двора.",
  "wallet.ln.deposit_body":
    "Монетный двор выставит вам счёт. Оплатите его из любого кошелька Lightning, и сатоши вернутся как ecash, который можно тратить офлайн.",
  "wallet.ln.pay_invoice_for":
    "Оплатите этот счёт на {amount} {unit}. Кошелёк следит за платежом и выпустит ваши ecash автоматически.",
  "wallet.ln.expired_body":
    "Срок действия счёта истёк. Если вы уже оплатили его, баланс зачислится автоматически.",
  "wallet.ln.waiting_expires": "Ждём оплату · истекает через {countdown}",
  "wallet.ln.withdraw_body":
    "Вставьте счёт bolt11, и монетный двор оплатит его из ваших ecash. Сначала вам назовут резерв на маршрутизацию; всё, что маршрутизация не израсходует, вернётся на баланс.",
  "wallet.ln.up_to": "до {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Оплатить {amount} {unit}",
  "wallet.ln.deposit": "Пополнить сатоши через Lightning",
  "wallet.ln.deposit_short": "Пополнить",
  "wallet.ln.withdraw": "Вывести на счёт Lightning",
  "wallet.ln.withdraw_short": "Вывести",
  "wallet.ln.deposit_title": "Пополнение через Lightning",
  "wallet.ln.amount_placeholder": "Сумма в сатоши",
  "wallet.ln.requesting": "Запрашиваем…",
  "wallet.ln.get_invoice": "Получить счёт",
  "wallet.ln.copy_invoice": "Копировать счёт",
  "wallet.ln.open_wallet": "Открыть в кошельке Lightning",
  "wallet.ln.open_wallet_short": "Открыть в кошельке",
  "wallet.ln.waiting": "Ждём оплату…",
  "wallet.ln.new_invoice": "Создать новый счёт",
  "wallet.ln.new_invoice_short": "Новый счёт",
  "wallet.ln.withdraw_title": "Вывод в Lightning",
  "wallet.ln.scan_invoice": "Отсканировать QR-код счёта Lightning",
  "wallet.ln.paid_from": "Оплачено из",
  "wallet.ln.invoice": "Счёт",
  "wallet.ln.routing_reserve": "Резерв на маршрутизацию",
  "wallet.ln.reserved": "Зарезервировано с баланса",
  "wallet.ln.paying": "Оплачиваем…",
  "wallet.ln.get_quote": "Получить расчёт",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Резервная копия",
  "wallet.backup.setup_failed": "Не удалось настроить резервную копию",
  "wallet.backup.on": "Резервная копия включена",
  "wallet.backup.on_body":
    "Теперь ваш баланс можно восстановить по этим двенадцати словам.\n\nВсё, что вам передали другие, остаётся вне фразы, пока вы не обновите доказательства у монетного двора, а для восстановления нужен список ваших дворов, так что запишите его рядом со словами.",
  "wallet.backup.no_phrase": "Фраза не сохранена",
  "wallet.backup.no_phrase_body":
    "Не удалось прочитать фразу восстановления из связки ключей устройства. Разблокируйте устройство и попробуйте снова.",
  "wallet.backup.replace_title": "Заменить текущую фразу?",
  "wallet.backup.replace_body":
    "У вас уже есть фраза восстановления. Восстановление другой заменит её. Монеты, уже покрытые старой фразой, останутся доступными на этом устройстве, но перестанут быть восстановимыми, поэтому убедитесь, что старые слова записаны, прежде чем продолжать.",
  "wallet.backup.replace": "Заменить",
  "wallet.backup.invalid_phrase": "Эта фраза недействительна",
  "wallet.backup.invalid_phrase_body":
    "У фразы есть встроенная контрольная сумма, и эта её не проходит. Проверьте, нет ли опечатки, пропущенного или переставленного слова.",
  "wallet.backup.not_bip39":
    "Это не слова BIP-39: {words}. Проверьте написание.",
  "wallet.backup.add_mint_first": "Сначала добавьте монетный двор",
  "wallet.backup.add_mint_first_body":
    "Восстановление работает так: у монетного двора спрашивают, какие монеты он вам подписал, поэтому нужно знать, у какого именно спрашивать. Добавьте дворы, которыми пользовались, и затем восстанавливайте.",
  "wallet.backup.restore_failed": "Восстановление не удалось",
  "wallet.backup.phrase": "Фраза восстановления",
  "wallet.backup.state_unconfirmed":
    "Резервная копия включена, но не подтверждена",
  "wallet.backup.state_off": "Резервная копия выключена",
  "wallet.backup.badge_on": "Вкл.",
  "wallet.backup.badge_unconfirmed": "Не подтверждено",
  "wallet.backup.badge_off": "Выкл.",
  "wallet.backup.view": "Показать фразу восстановления",
  "wallet.backup.setup": "Настроить фразу восстановления",
  "wallet.backup.view_short": "Показать фразу",
  "wallet.backup.setup_short": "Настроить",
  "wallet.backup.restore": "Восстановить кошелёк по фразе восстановления",
  "wallet.backup.restore_short": "Восстановить",
  "wallet.backup.setup_title": "Настройка фразы восстановления",
  "wallet.backup.on_body_short":
    "Ваш баланс можно восстановить на новом устройстве по вашим двенадцати словам.",
  "wallet.backup.unconfirmed_body":
    "Вы так и не подтвердили, что записали их. Сейчас слова есть только на этом телефоне, а ведь именно его потерю резервная копия и должна пережить. Откройте фразу и запишите её.",
  "wallet.backup.not_covered":
    "{amount} пока не покрыто. Монеты, которые вам передали, несут секреты отправителя, поэтому попадают под вашу фразу только после обмена. Обновите доказательства у монетного двора, чтобы защитить их.",
  "wallet.backup.off_body":
    "Ваши ecash существуют только на этом телефоне. Если вы его потеряете, деньги не восстановит никто, включая вас. Фраза восстановления — двенадцать слов, по которым баланс можно собрать заново где угодно.",
  "wallet.backup.about_to_see":
    "Сейчас вы увидите двенадцать слов. Это и есть деньги.",
  "wallet.backup.exact_order":
    "Двенадцать слов, ровно в этом порядке. У кого они есть, у того и ваш баланс.",
  "wallet.backup.verify_body":
    "Фраза, которую никто не записал, хуже её отсутствия: она выглядит страховкой, которой нет. Два слова для подтверждения.",
  "wallet.backup.verify_mismatch": "Не совпадает. Сверьтесь со своей записью.",
  "wallet.backup.restore_body":
    "Введите двенадцать слов. Airhop заново выведет ваши монеты и спросит у каждого монетного двора, какие из них он подписал, и баланс вернётся из записей, которые двор ведёт.",
  "wallet.backup.warn_secret":
    "Кто их прочитает, тот заберёт ваш баланс. Не делайте снимков экрана и не храните их на этом телефоне.",
  "wallet.backup.warn_paper":
    "Запишите их на бумаге и храните в надёжном месте. Airhop не сможет показать их снова, если телефон пропадёт.",
  "wallet.backup.warn_scope":
    "Они восстанавливают только ваши ecash. Личность, чаты и контакты не покрываются.",
  "wallet.backup.warn_mints":
    "Восстановление вынуждено спрашивать монетный двор, какие монеты он подписал, поэтому запишите список ваших дворов рядом со словами.",
  "wallet.backup.preparing": "Готовим…",
  "wallet.backup.show_phrase": "Показать мою фразу",
  "wallet.backup.your_phrase": "Ваша фраза восстановления",
  "wallet.backup.write_down": "Запишите это",
  "wallet.backup.copy_phrase": "Копировать фразу восстановления в буфер обмена",
  "wallet.backup.copy_clipboard": "Копировать в буфер обмена",
  "wallet.backup.written_down": "Я их записал",
  "wallet.backup.check_copy": "Сверьтесь со своей записью",
  "wallet.backup.confirm": "Подтвердить",
  "wallet.backup.restore_title": "Восстановление по фразе",
  "wallet.backup.phrase_placeholder": "двенадцать слов через пробел",
  "wallet.backup.no_mints_yet":
    "Монетные дворы пока не добавлены. Восстановление должно спрашивать конкретный двор, поэтому сначала добавьте те, которыми вы пользовались.",
  "wallet.backup.scanning": "Сканируем…",
  "wallet.backup.restore_progress": "{mint} · набор ключей {step} из {total}",
  "wallet.backup.will_scan":
    "Будут просканированы: {mints}. Двор, который вы не добавили, никогда не спрашивают, поэтому его баланс останется невидимым.",
  "wallet.backup.word_n": "Слово {position}",
  "wallet.backup.unreachable_mints":
    "Не удалось связаться: {mints}. Баланс там никуда не делся. Попробуйте снова при лучшем соединении.",
  "wallet.backup.nothing_recovered":
    "С просканированных монетных дворов ничего не восстановлено.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Отметить как полученное?",
  "wallet.delivered.body":
    "Это окончательно освободит {amount} {unit}. Если платёж на самом деле не дошёл, вернуть его будет нельзя.",
  "wallet.delivered.body_generic":
    "Это окончательно освободит зарезервированную сумму. Если она на самом деле не дошла, вернуть её будет нельзя.",
  "wallet.delivered.cancel": "Ещё нет",
  "wallet.delivered.confirm": "Получено",
  "wallet.reclaim.title": "Вернуть этот токен?",
  "wallet.reclaim.body":
    "{amount} {unit} вернутся на ваш баланс. Делайте это, только если токен никого не достиг: если строка уже у них, деньги достанутся тому, кто первым погасит её у монетного двора, и это может быть они.",
  "wallet.reclaim.keep": "Оставить в ожидании",
  "wallet.reclaim.confirm": "Вернуть",
  "wallet.copied.token_body":
    "Токен в буфере обмена. Он остаётся зарезервированным здесь, пока вы не отметите доставку, так что при неудачной первой попытке его можно вставить снова.",
  "wallet.copied.phrase_body":
    "Вставьте её в менеджер паролей, затем очистите буфер обмена. Другие приложения могут читать буфер, а в некоторых конфигурациях он синхронизируется с вашими другими устройствами.",
  "wallet.refresh.failed": "Обновление не удалось",
  "wallet.refresh.partly": "Обновлено частично",
  "wallet.refresh.done": "Обновлено",
  "wallet.refresh.unreachable":
    "Не удалось связаться: {mints}. Всё остальное актуально.",
  "wallet.refresh.swapped":
    "{amount} {unit} подтверждено и обменяно на свежие доказательства.",
  "wallet.refresh.secured":
    "{amount} {unit} теперь покрыто вашей фразой восстановления.",
  "wallet.refresh.all_confirmed":
    "Здесь всё уже было подтверждено монетным двором.",
  "wallet.pending.title": "Ожидающие",
  "wallet.pending.reserved_desc":
    "Собрано и зарезервировано, доставка не подтверждена. Доказательства выведены из баланса, чтобы их нельзя было потратить дважды.",
  "wallet.pending.locked_desc":
    "Уже привязано к ключу получателя, поэтому потратить может только он. Просто пока не дошло. Передайте токен, чтобы завершить.",
  "wallet.pending.show_qr": "Показать этот токен как QR-код",
  "wallet.pending.copy_again": "Снова скопировать токен",
  "wallet.pending.share_again": "Снова поделиться токеном",
  "wallet.pending.mark_delivered": "Отметить этот токен доставленным",
  "wallet.pending.delivered": "Доставлено",
  "wallet.pending.reclaim_into": "Вернуть этот токен на баланс",
  "wallet.activity.title": "Активность",
  "wallet.activity.none": "Пока ничего",
  "wallet.activity.none_desc":
    "Платежи, которые вы отправляете и получаете, появятся здесь, начиная с новых, с монетным двором и комиссией для каждого.",
  "wallet.activity.show_fewer": "Показать меньше платежей",
  "wallet.activity.show_less": "Показать меньше",
  "wallet.activity.received_unconfirmed": "Получено, не подтверждено",
  "wallet.activity.received": "Получено",
  "wallet.activity.receive_failed": "Приём не удался",
  "wallet.activity.reclaimed": "Возвращено",
  "wallet.activity.send_failed": "Отправка не удалась",
  "wallet.activity.sent": "Отправлено",
  "wallet.activity.status_pending": "в ожидании",
  "wallet.activity.status_failed": "ошибка",
  "wallet.activity.status_reclaimed": "возвращено",
  "wallet.activity.status_expired": "истекло",
  "wallet.activity.ln_deposit": "Пополнение Lightning",
  "wallet.activity.ln_withdrawal": "Вывод через Lightning",
  "wallet.activity.nutzap_received": "Nutzap получен",
  "wallet.activity.spent_removed": "Потраченные доказательства удалены",
  "wallet.activity.refreshed": "Доказательства обновлены",
  "wallet.activity.refreshing": "Обновляем доказательства",
  "wallet.activity.just_now": "только что",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Сеть отключена",
  "wallet.mesh_offline_body":
    "Служба сети не работает, поэтому передать токен некому. Он остаётся зарезервированным в разделе «Ожидающие».",
  "wallet.xfer.route_mesh": "Передано прямо на их устройство по сети.",
  "wallet.xfer.route_nostr":
    "Человек был вне зоны действия Bluetooth, поэтому платёж ушёл через интернет.",
  "wallet.xfer.route_courier":
    "Сейчас маршрута до него нет. Токен понесут другие устройства и доставят, когда одно из них его встретит.",
  "wallet.xfer.route_queued":
    "Человек пока недоступен. Платёж в очереди и уйдёт, как только он появится.",
  "wallet.xfer.mesh_offline_body":
    "Служба сети не работает, поэтому передать токен невозможно. Ничего не списано.",
  "wallet.xfer.could_not_send": "Не удалось отправить",
  "wallet.xfer.inexact_body":
    "Ваши доказательства не составляют ровно {amount} {unit} офлайн. Наименьший токен, который можно собрать, — {spend} {unit}, и лишние {extra} {unit} уйдут им без возможности вернуть.\n\nОбновление доказательств у монетного двора в сети разделит их на номиналы, дающие точную сумму.",
  "wallet.xfer.send_amount": "Отправить {amount}",
  "wallet.xfer.mesh_offline": "Сеть отключена",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Привязано к их ключу и опубликовано в Nostr. Платёж принадлежит им, в сети они или нет.",
  "wallet.pay.rail_nutzap_dm":
    "Привязано к их ключу. Ретранслятор его не принял, поэтому платёж ушёл им сообщением.",
  "wallet.pay.rail_nutzap_undelivered":
    "Привязано к их ключу, но донести пока не удалось. Платёж в очереди, а токен в разделе «Ожидающие».",
  "wallet.pay.final":
    "Привязанные платежи вернуть нельзя: потратить эти монеты теперь может только их ключ.",
  "wallet.pay.reclaimable":
    "Платёж можно вернуть на вкладке «Кошелёк», пока вы не подтвердите получение.",
  "wallet.pay.why": "Отправлено так, потому что {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} для {name}",
  "wallet.pay.thread_receipt":
    "Вы отправили {amount} {unit}, привязано к их ключу.",
  "wallet.pay.title": "Отправить ecash",
  "wallet.pay.to": "Кому: {name}",
  "wallet.pay.amount": "Сумма в сатоши",
  "wallet.pay.memo": "Заметка (необязательно, публичная)",
  "wallet.pay.send": "Отправить",
  "wallet.pay.sending": "Отправка…",
  "wallet.pay.action": "Отправить ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Доступ к камере",
  "wallet.scan.camera_purpose": "отсканировать QR-код ecash",
  "wallet.scan.photo_label": "Доступ к фото",
  "wallet.scan.photo_purpose": "прочитать QR-код ecash с изображения",
  "wallet.scan.no_token": "На этом изображении не найден токен ecash.",
  "wallet.scan.no_invoice": "На этом изображении не найден счёт Lightning.",
  "wallet.scan.unreadable": "Не удалось прочитать это изображение.",
  "wallet.scan.camera_failed":
    "Не удалось запустить камеру. Закройте другие приложения камеры и попробуйте снова.",
  "wallet.scan.close": "Закрыть сканер",
  "wallet.scan.on_device":
    "Читается на этом устройстве; никуда ничего не отправляется.",
  "wallet.scan.aim_token": "Наведите камеру на QR-код ecash.",
  "wallet.scan.aim_invoice": "Наведите камеру на QR-код счёта Lightning.",
  "wallet.scan.title_token": "Сканировать ecash",
  "wallet.scan.title_invoice": "Сканировать счёт",
  "wallet.scan.desc_token":
    "Прочитайте токен Cashu из другого кошелька. Работает с любым кошельком Cashu, не только с Airhop.",
  "wallet.scan.desc_invoice":
    "Прочитайте счёт Lightning, чтобы оплатить его с баланса.",
  "wallet.scan.use_camera_a11y": "Сканировать камерой",
  "wallet.scan.use_camera": "Использовать камеру",
  "wallet.scan.pick_image_a11y": "Прочитать QR-код из сохранённого изображения",
  "wallet.scan.pick_image": "Выбрать из фото",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Что такое Cashu?",
  "wallet.explain.intro":
    "Cashu — это ecash для биткойна. Токен — строка, которая стоит денег тому, у кого она есть, вслепую подписанная монетным двором, так что двор не может определить, кто и что потратил. Ни аккаунтов, ни входов.",
  "wallet.explain.send": "Отправка",
  "wallet.explain.send_desc":
    "Превращает сумму в токен, который можно передать узлу поблизости по Bluetooth или отправить текстом. Работает без интернета. Доказательства остаются зарезервированными, пока вы не подтвердите доставку.",
  "wallet.explain.receive": "Приём",
  "wallet.explain.receive_desc":
    "Вставьте токен, чтобы добавить его. В сети он сразу обменивается у монетного двора, и это делает его доказуемо вашим. Офлайн он сохраняется и помечается неподтверждённым до обновления.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Платит личности в Nostr. Если человек публикует сведения nutzap по NIP-61, ecash привязывается к его ключу, так что потратить может только он. Иначе платёж уходит зашифрованным личным сообщением. Нужен интернет.",
  "wallet.explain.add_mint": "Добавить монетный двор",
  "wallet.explain.add_mint_desc":
    "Сохраняет монетный двор, который выпускает и гасит ваши ecash, и кэширует его публичные ключи, чтобы токены от него можно было проверять офлайн. Выбирайте двор, которому доверили бы хранимый там баланс.",
  "wallet.explain.phrase": "Фраза восстановления",
  "wallet.explain.phrase_desc":
    "Ваши монеты выводятся из двенадцати слов, которые кошелёк создаёт в самом начале, поэтому новый телефон может собрать баланс заново, спросив у ваших монетных дворов, какие монеты они подписали. Пока вы их не откроете и не запишете, они существуют только на этом телефоне.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Кошелёк заблокирован",
  "wallet.err.mint_unreachable": "Монетный двор недоступен",
  "wallet.err.tor_blocked": "Заблокировано, пока включён Tor",
  "wallet.err.insufficient": "Недостаточно средств",
  "wallet.err.exact_amount": "Такую точную сумму отправить нельзя",
  "wallet.err.no_mint": "Нет монетного двора",
  "wallet.err.mint_unsupported": "Монетный двор так не умеет",
  "wallet.err.mint_refused": "Монетный двор отказал",
  "wallet.err.unreadable": "Нечитаемый токен",
  "wallet.err.rejected": "Токен отклонён",
  "wallet.err.already_spent": "Уже потрачено",
  "wallet.err.change_pending": "Оплачено, сдача в ожидании",
  "wallet.svc.mint_unreachable": "Не удалось связаться с монетным двором.",
  "wallet.svc.tor_ios": "Запросы к монетному двору на iOS не идут через Tor.",
  "wallet.svc.tor_ios_body":
    "Arti оборачивает только веб-сокеты Nostr, поэтому этот запрос дошёл бы до монетного двора по открытой сети и связал ваш IP с этими доказательствами. Разрешите это в разделе «Настройки» > «Безопасность» или сначала выключите Tor. Отправка и приём ecash по сети по-прежнему работают.",
  "wallet.svc.keys_uncached":
    "Ключи этого монетного двора не сохранены на этом устройстве.",
  "wallet.svc.keys_uncached_body":
    "Откройте кошелёк один раз в сети, чтобы получить их.",
  "wallet.svc.phrase_invalid": "Эта фраза восстановления недействительна.",
  "wallet.svc.phrase_invalid_body":
    "Проверьте, нет ли опечатки или пропущенного слова. У фразы есть встроенная контрольная сумма, поэтому одно неверное слово делает недействительной всю фразу.",
  "wallet.svc.need_mint": "Сначала добавьте хотя бы один монетный двор.",
  "wallet.svc.need_mint_body":
    "Восстановление работает так: у монетного двора спрашивают, какие монеты он вам подписал, поэтому нужно знать, у какого именно спрашивать.",
  "wallet.svc.restored": "Восстановлено по фразе восстановления",
  "wallet.svc.storage_locked": "Хранилище кошелька заблокировано.",
  "wallet.svc.storage_locked_body":
    "Airhop хранит доказательства ecash в зашифрованном файле, ключ от которого лежит в связке ключей устройства. Разблокируйте устройство и откройте приложение заново.",
  "wallet.svc.bad_url": "Это недействительный адрес.",
  "wallet.svc.needs_https":
    "Адрес монетного двора должен начинаться с https://.",
  "wallet.svc.refuse_http":
    "Отказываемся работать с монетным двором по обычному http.",
  "wallet.svc.refuse_http_body":
    "Любой на пути в сети смог бы прочитать или изменить ваши доказательства. Используйте монетный двор на https://.",
  "wallet.svc.mint_not_saved": "Не удалось сохранить монетный двор.",
  "wallet.svc.unreadable_token": "Это не читаемый токен Cashu.",
  "wallet.svc.unreadable_token_body":
    "Токены начинаются с cashuA или cashuB. Проверьте, не обрезалось ли что-то при копировании.",
  "wallet.svc.wrong_mint":
    "Этот токен подписан не тем монетным двором, который в нём указан.",
  "wallet.svc.already_spent": "Эти доказательства уже потрачены.",
  "wallet.svc.already_spent_body":
    "Отправитель погасил токен первым или отправил тот же токен кому-то ещё.",
  "wallet.svc.receiving_offline": "приём офлайн",
  "wallet.svc.amount_positive": "Введите сумму больше нуля.",
  "wallet.svc.coins_raced": "Эти монеты только что использовал другой платёж.",
  "wallet.svc.coins_raced_body":
    "Ничего не списано. Попробуйте снова, и кошелёк выберет другой набор.",
  "wallet.svc.no_ecash": "Ecash пока нет.",
  "wallet.svc.no_ecash_body":
    "Добавьте монетный двор и пополните счёт через Lightning или получите токен от кого-нибудь.",
  "wallet.svc.split_across_mints":
    "Ваш баланс разбит по нескольким монетным дворам.",
  "wallet.svc.mint_says_spent":
    "Монетный двор сообщил, что эти доказательства уже потрачены.",
  "wallet.svc.issue_against_invoice": "выпустить ecash под счёт Lightning",
  "wallet.svc.pay_invoice": "оплатить счёт Lightning",
  "wallet.svc.unknown_deposit": "Неизвестное пополнение.",
  "wallet.svc.invoice_expired_before": "Срок действия счёта истёк до оплаты.",
  "wallet.svc.invoice_expired": "Срок действия этого счёта истёк.",
  "wallet.svc.invoice_unpaid": "Счёт ещё не оплачен.",
  "wallet.svc.payment_unknown":
    "Статус платежа неизвестен; проверим снова при следующем обновлении.",
  "wallet.svc.melt_change_pending": "Ваш счёт оплачен.",
  "wallet.svc.melt_change_pending_body":
    "Монетный двор ещё не вернул неизрасходованную комиссию за маршрутизацию. Она заберётся автоматически при следующем обновлении, и ничего тем временем не теряется.",
  "wallet.svc.mint_did_not_pay":
    "Монетный двор не оплатил этот счёт. Ваш баланс не изменился.",
  "wallet.svc.not_an_invoice": "Это не счёт Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Вставьте счёт bolt11, начинающийся с lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "На балансе не хватает средств для этого счёта.",
  "wallet.svc.coins_raced_invoice_body":
    "Ничего не списано, и счёт не оплачен. Попробуйте снова.",
  "wallet.svc.same_mint": "Выберите другой монетный двор назначения.",
  "wallet.svc.same_mint_body":
    "Источник и назначение — один и тот же монетный двор, поэтому переносить нечего.",
  "wallet.svc.quote_failed_retried": "Расчёт не удался, объединение повторено",
  "wallet.svc.amount_unfit_retried": "Сумма не подошла, объединение повторено",
  "wallet.svc.cannot_size": "Не удалось рассчитать размер этого перевода.",
  "wallet.svc.insufficient_at_mint": "Недостаточно средств в {mint}.",
  "wallet.svc.inexact_title":
    "Ваши доказательства не составляют ровно {amount} {unit} офлайн.",
  "wallet.svc.inexact_detail":
    "Наименьший токен, который можно отправить, — {spend} {unit}. Офлайн сдачи не бывает, поэтому лишние {extra} {unit} достанутся получателю.",
  "wallet.svc.no_single_mint":
    "Ни один монетный двор не держит {amount} {unit}. Ecash с разных дворов нельзя объединить в один токен: сначала соберите всё в одном дворе или отправляйте отдельными суммами.",
  "wallet.svc.have_tried_send":
    "У вас {total} {unit}, а вы пытались отправить {amount}.",
  "wallet.svc.invoice_needs":
    "Этому счёту нужно {total} {unit} вместе с резервом на маршрутизацию, а у вас {balance}.",
  "wallet.svc.nothing_to_move": "В {mint} нет {unit} для переноса.",
  "wallet.svc.consolidate_memo": "Объединение из {mint}",
  "wallet.svc.cannot_size_detail":
    "После комиссий за маршрутизацию Lightning {from} не может перенести полезную сумму в {to}. Попробуйте перенести конкретную меньшую сумму.",
  "wallet.svc.mint_cannot": "{mint} не может {action}.",
  "wallet.svc.no_nut": "Монетный двор не заявляет поддержку NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "В этом платеже указан монетный двор, которым вы не пользуетесь.",
  "wallet.svc.unknown_mint_body":
    "Сначала добавьте двор сами, если доверяете ему; с двора, который вы не выбирали, ничего не гасится.",
  "wallet.svc.no_relay": "нет связи с ретранслятором",
  "wallet.svc.no_shared_mint":
    "нет общего монетного двора с достаточным балансом",
  "wallet.svc.no_nutzap_info":
    "получатель не опубликовал сведения nutzap (NIP-61, вид 10019)",
  "wallet.svc.locked_undelivered":
    "Привязано к их ключу, но пока не доставлено. Передайте токен из этой операции, чтобы завершить её.",
  "wallet.svc.swap_lost":
    "Монетный двор так и не завершил этот обмен, поэтому взамен ничего не выпущено.",
  "wallet.svc.swap_unreadable":
    "Этот обмен сохранён в формате, который эта версия не может воспроизвести.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Подтверждён по QR-коду",
  "contacts.qr.keys_unverified": "Ключи получены, не подтверждены",
  "contacts.qr.not_verified": "Пока не подтверждён",
  "contacts.qr.message": "Сообщение",
  "contacts.qr.add": "Добавить контакт",
  "contacts.qr.scan_title": "Сканировать QR-код",
  "contacts.qr.aim": "Наведите камеру на их QR-код",
  "contacts.qr.add_desc": "Свяжитесь с тем, кого нет рядом в сети.",
  "contacts.qr.peer_id_hint":
    "Идентификатор узла — 16 символов. Код контакта начинается с airhop:.",
  "contacts.qr.or_scan": "или отсканируйте их QR",
  "contacts.qr.trust_note":
    "Только QR-код, отсканированный вашей камерой, подтверждает их ключ. Вставленный код несёт их ключи, но не доказывает, что он от них.",
  "contacts.qr.peer_id": "Идентификатор узла или код контакта",
  "contacts.qr.peer_id_placeholder": "Вставьте идентификатор или код контакта",
  "contacts.qr.scan_camera_a11y": "Сканировать QR-код камерой",
  "contacts.qr.scan_camera_desc": "Используйте камеру",
  "contacts.qr.upload_a11y": "Загрузить изображение QR-кода из галереи",
  "contacts.qr.upload": "Загрузить из галереи",
  "contacts.qr.upload_desc": "Выберите сохранённое изображение QR-кода",
  "contacts.qr.scan_a11y": "Добавить контакт, отсканировав QR-код",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Вставьте 16-символьный идентификатор узла, ссылку airhop://peer/… или код контакта.",
  "contacts.scan.camera_label": "Доступ к камере",
  "contacts.scan.camera_purpose": "отсканировать QR-код контакта",
  "contacts.scan.camera_needed":
    "Для сканирования нужен доступ к камере. Добавить по идентификатору узла всё ещё можно.",
  "contacts.scan.camera_failed":
    "Не удалось запустить камеру. Закройте другие приложения камеры и попробуйте снова.",
  "contacts.scan.photo_label": "Доступ к фото",
  "contacts.scan.photo_purpose": "отсканировать сохранённый QR-код",
  "contacts.scan.photo_needed":
    "Для выбора изображения нужен доступ к фото. Добавить по идентификатору узла всё ещё можно.",
  "contacts.scan.no_qr": "На этом изображении не найден QR-код Airhop.",
  "contacts.scan.unreadable":
    "Не удалось прочитать QR-код с этого изображения.",
  "contacts.scan.bitchat_expired":
    "Срок действия этого кода bitchat истёк. Попросите открыть их QR заново.",
  "contacts.scan.tampered":
    "Этот QR-код недействителен: его идентификатор узла не совпадает с ключами. Возможно, его подменили.",
  "contacts.scan.already_added": "Уже в ваших контактах",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Ждём доступ к камере…",
  "contacts.verify.camera_off": "Камера отключена",
  "contacts.verify.open_settings": "Открыть настройки",
  "contacts.verify.verified": "Подтверждён",
  "contacts.verify.different": "Другой контакт",
  "contacts.verify.scan_again": "Сканировать снова",
  "contacts.verify.failed": "Не удалось подтвердить",
  "contacts.verify.done": "Готово",
  "contacts.verify.title": "Подтвердить {name}",
  "contacts.verify.aim": "Наведите камеру на их QR-код",
  "contacts.verify.camera_off_body":
    "Включите доступ к камере в настройках, чтобы подтвердить по QR-коду.",
  "contacts.verify.match_body":
    "Ключ {name} совпадает. Этому контакту можно доверять.",
  "contacts.verify.different_body":
    "Этот QR-код принадлежит другому человеку. Попросите {name} показать свой код.",
  "contacts.verify.tampered_body":
    "Похоже, этот QR-код подменили: его идентификатор не совпадает с ключом.",
  "contacts.verify.choose_title": "Как хотите проверить?",
  "contacts.verify.choose_body":
    "Оба способа подтверждают, что ключи на этом телефоне действительно принадлежат {name}.",
  "contacts.verify.method_scan": "Отсканировать их код",
  "contacts.verify.method_scan_sub": "Человек рядом с вами",
  "contacts.verify.method_compare": "Сверить код",
  "contacts.verify.method_compare_sub": "Прочитайте его друг другу по звонку",
  "contacts.verify.no_keys":
    "Для этого контакта пока нет ключей. Напишите человеку или отсканируйте его код при встрече.",
  "contacts.verify.compare_title": "Прочитайте это друг другу",
  "contacts.verify.compare_body":
    "{name} видит те же шесть слов. Если они совпадают, вы оба знаете, что ключи настоящие.",
  "contacts.verify.codes_match": "Совпадают",
  "contacts.verify.codes_differ": "Не совпадают",
  "contacts.verify.compared_body":
    "Вы и {name} подтвердили один и тот же код. Контакт подтверждён.",

  // ---- Settings: shared chrome ----
  "settings.back": "Назад",
  "settings.coming_soon": "Скоро",
  "settings.opens_externally": "{label}, открывается вне приложения",
  "settings.peer_id": "Идентификатор узла",
  "settings.share_peer_id": "Поделиться своим идентификатором узла",
  "settings.share_id_short": "Поделиться ID",
  "settings.peer_id_sheet.title": "Ваш идентификатор узла",
  "settings.peer_id_sheet.copy": "Копировать идентификатор узла",
  "settings.peer_id_sheet.note":
    "Это работает, только когда вы оба в зоне действия Bluetooth. Чтобы вам могли писать откуда угодно, поделитесь своим QR-кодом.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Основные",
  "settings.section.general_desc":
    "Дополнительные функции, отмена отправки, медиа, сброс",
  "settings.section.privacy": "Приватность и безопасность",
  "settings.section.privacy_desc":
    "Прямая секретность, подписанные пакеты, заблокированные узлы",
  "settings.section.network": "Сеть и ретрансляторы",
  "settings.section.network_desc":
    "Резервный интернет, ретрансляторы nostr, совместимость с bitchat",
  "settings.section.permissions": "Разрешения",
  "settings.section.permissions_desc":
    "Bluetooth, геопозиция, уведомления, камера, микрофон",
  "settings.section.storage": "Хранилище и данные",
  "settings.section.diagnostics": "Диагностика",

  // ---- Settings: group headings ----
  "settings.group.transports": "Транспорты",
  "settings.group.internet": "Интернет",
  "settings.group.nearby": "Поблизости",
  "settings.group.sync": "Синхронизация",
  "settings.group.features": "Функции",
  "settings.group.messages": "Сообщения",
  "settings.group.local": "Локально",
  "settings.group.media": "Медиа",
  "settings.group.reset": "Сброс",
  "settings.group.always_on": "Всегда включено",
  "settings.group.notifications": "Уведомления",
  "settings.group.blocked": "Заблокированные",
  "settings.group.theme": "Оформление",
  "settings.group.font": "Шрифт",
  "settings.group.language": "Язык",
  "settings.section.diagnostics_desc":
    "Состояние соединения и устройства поблизости",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Соединения Bluetooth",
  "settings.diag.ble_links_desc":
    "Устройства, с которыми этот телефон соединён напрямую",
  "settings.diag.lan": "Локальная сеть",
  "settings.diag.lan_desc": "Телефоны в одной сети Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Телефон к телефону без роутера",
  "settings.diag.wifi_active": "Работает",
  "settings.diag.wifi_unsupported": "Не поддерживается на этом устройстве",
  "settings.diag.wifi_permission": "Заблокировано разрешением",
  "settings.diag.wifi_unavailable": "Сейчас недоступно",
  "settings.diag.wifi_unpaired": "Ничего не связано",
  "settings.diag.wifi_unknown": "Ждём радиомодуль",
  "settings.diag.relays": "Ретрансляторы Nostr",
  "settings.diag.relays_desc":
    "Используются для каналов местоположения и охвата через интернет",
  "settings.diag.connected": "Подключено",
  "settings.diag.disconnected": "Не подключено",
  "settings.diag.peer_direct": "Прямая связь",
  "settings.diag.peer_relayed": "Слышно через другое устройство",
  "settings.diag.rssi": "{dbm} дБм",
  "settings.diag.no_rssi": "Нет данных о сигнале",
  "settings.diag.no_peers": "В зоне действия никого",
  "settings.diag.no_peers_desc": "Открытых радиосоединений: {links}",
  "settings.diag.gcs_size": "Размер фильтра",
  "settings.diag.gcs_size_desc":
    "Самый большой фильтр синхронизации, отправленный в эфир",
  "settings.diag.fpr": "Доля ложных срабатываний",
  "settings.diag.fpr_desc":
    "Как часто фильтр заявляет о пакете, которого у нас нет",
  "settings.diag.bytes": "{n} байт",
  "settings.diag.footnote":
    "Здесь ничего нельзя изменить. Эти значения зафиксированы, чтобы Airhop оставался совместимым с bitchat.",
  "settings.section.storage_desc": "Использование и кэш",
  "settings.section.appearance": "Оформление",
  "settings.section.appearance_desc": "Тема, шрифт и язык",
  "settings.section.help": "Помощь и отзывы",
  "settings.section.help_desc":
    "Свяжитесь с нами, сообщите об ошибке или прочитайте вопросы и ответы",
  "settings.section.support": "Поддержка",
  "settings.section.support_desc": "Помогите продолжать разработку",
  "settings.section.about": "О приложении",
  "settings.section.about_desc": "Версия, список изменений и исходный код",

  // ---- Settings: general ----
  "settings.general.undo": "Отмена отправки",
  "settings.general.feature_ai": "ИИ",
  "settings.general.feature_wallet": "Кошелёк",
  "settings.general.undo_seconds": "{count} секунд",
  "settings.general.undo_a11y": "Отмена отправки: {value}",
  "settings.general.quality_a11y": "Установить качество загрузки: {value}",
  "settings.general.undo_desc":
    "Ненадолго придерживает отправленное сообщение, чтобы его можно было вернуть до отправки",
  "settings.general.undo_off_desc": "Отправлять сразу, без отмены",
  "settings.general.undo_2": "2 секунды",
  "settings.general.undo_2_desc": "Быстрая возможность передумать",
  "settings.general.undo_10": "10 секунд",
  "settings.general.undo_10_desc": "Самое длинное окно",
  "settings.general.quality": "Качество загрузки",
  "settings.general.quality_desc":
    "Относится к фото, отправленным с камеры или из медиатеки. Каждое фото в любом случае подгоняется под сеть.",
  "settings.general.quality_low": "Низкое",
  "settings.general.quality_low_desc":
    "Самые маленькие фото, быстрее всего отправляются",
  "settings.general.quality_medium": "Среднее",
  "settings.general.quality_medium_desc": "Баланс детализации и скорости",
  "settings.general.quality_high": "Высокое",
  "settings.general.quality_high_desc": "Сохраняет больше всего деталей",
  "settings.general.feature_wallet_desc":
    "Отправляйте ecash Cashu напрямую между устройствами по сети",
  "settings.general.feature_wallet_a11y": "Кошелёк (всегда включён)",
  "settings.general.feature_ai_desc":
    "Приватный помощник на устройстве, без обращений к сети",
  "settings.general.feature_feeds": "Ленты",
  "settings.general.feature_feeds_desc":
    "Читайте и публикуйте в лентах Bluesky и Mastodon",
  "settings.general.show_media": "Показывать медиа автоматически",
  "settings.general.show_media_desc":
    "Фото и видео появляются в чате или остаются за одним касанием",
  "settings.general.reset": "Сбросить настройки",
  "settings.general.media_retention": "Хранить медиа",
  "settings.general.media_retention_desc":
    "Фото, видео и голосовые заметки удаляются по истечении выбранного срока",
  "settings.general.media_retention_sheet":
    "Выберите, сколько медиа остаётся на этом устройстве. Удалённые медиа восстановить нельзя.",
  "settings.general.retention_7_desc":
    "Оставляет меньше всего следов. Лучше всего, если риск — сам телефон.",
  "settings.general.retention_14_desc":
    "Золотая середина на неделю-другую без связи.",
  "settings.general.retention_30_desc":
    "Дольше всего сохраняет переписку читаемой и занимает больше всего места.",
  "settings.general.reset_desc":
    "Возвращает каждую настройку к значению по умолчанию, не трогая вашу личность, сообщения, контакты и кошелёк",
  "settings.general.reset_title": "Сбросить настройки?",
  "settings.general.reset_body":
    "Каждая настройка вернётся к значению по умолчанию: оформление, отмена отправки и подключения (интернет, Tor, шлюз, мост, ретрансляторы). Ваша личность, сообщения, контакты и кошелёк не затрагиваются.",
  "settings.general.reset_confirm": "Сбросить",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Прямая секретность",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet всегда включён для личных сообщений",
  "settings.security.signed_packets": "Подписанные пакеты",
  "settings.security.signed_packets_desc": "Каждый пакет подписан Ed25519",
  "settings.security.hide_previews": "Скрывать содержимое в уведомлениях",
  "settings.security.hide_previews_desc":
    "Убирает отправителя и текст с экрана блокировки, который показывает их без разблокировки",
  "settings.security.no_blocked": "Заблокированных узлов нет",
  "settings.security.no_blocked_desc":
    "Заблокированные узлы не могут вам писать и не появляются на вкладке «Сеть»",
  "settings.security.unblock_title": "Разблокировать этот узел",
  "settings.security.unblock": "Разблокировать",
  "settings.security.unblock_peer": "Разблокировать {name}",
  "settings.security.unblock_body":
    "{name} снова сможет вам писать и появится на вкладке «Сеть», когда будет поблизости.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Резервный интернет",
  "settings.network.internet_desc":
    "Продолжать через ретрансляторы Nostr, когда узлы сети вне зоны действия",
  "settings.network.internet_off_title": "Отключить интернет?",
  "settings.network.internet_off_body":
    "Airhop будет работать только по Bluetooth. Он перестанет обращаться к ретрансляторам Nostr, а Tor, интернет-шлюз и мост сети отключатся. Чат по Bluetooth поблизости продолжит работать.",
  "settings.network.turn_off": "Отключить",
  "settings.network.discovery": "Поиск гео-ретрансляторов",
  "settings.network.discovery_desc":
    "Автоматически выбирать ближайшие ретрансляторы для ячейки местоположения из 300 с лишним распределённых",
  "settings.network.discovery_needs_relay":
    "Сначала добавьте свой ретранслятор",
  "settings.network.discovery_needs_relay_body":
    "Автопоиск и указывает Airhop на ближайшие ретрансляторы. Отключать его имеет смысл только после того, как вы задали свои ниже, поэтому сначала добавьте хотя бы один.",
  "settings.network.custom_only_title":
    "Использовать только свои ретрансляторы?",
  "settings.network.custom_only_body":
    "Каналы местоположения и мост сети перестанут автоматически выбирать ближайшие ретрансляторы и будут использовать только добавленные вами. Это может сузить охват, и вы можете перестать встречать пользователей bitchat, которые сходятся на ближайших ретрансляторах.",
  "settings.network.custom": "Свои ретрансляторы",
  "settings.network.custom_desc":
    "Добавьте свои ретрансляторы для каналов местоположения и моста сети",
  "settings.network.custom_added": "Добавлено {count} из {max}",
  "settings.network.dm_relays": "Ретрансляторы сообщений",
  "settings.network.dm_relays_desc":
    "Личные сообщения и приватные каналы всегда используют их. Свои ретрансляторы этого не меняют.",
  "settings.network.discovery_back_on":
    "Поиск гео-ретрансляторов снова включён",
  "settings.network.discovery_back_on_body":
    "Это был ваш последний свой ретранслятор. Каналам местоположения нужно куда-то публиковать, поэтому Airhop снова подбирает ближайшие ретрансляторы автоматически.",
  "settings.network.add_relay": "Добавить ретранслятор",
  "settings.network.remove_relay": "Убрать {url}",
  "settings.network.add_short": "Добавить",
  "settings.network.relay_limit":
    "Можно добавить ретрансляторов: {count}. Уберите один, чтобы добавить другой.",
  "settings.network.relay_duplicate":
    "Этот ретранслятор уже есть в вашем списке.",
  "settings.network.relay_invalid":
    "Введите корректный хост ретранслятора, например relay.example.com. Порт нужен, только если ретранслятор не использует стандартный. IP-адреса и локальные имена не допускаются.",
  "settings.network.lan": "Локальная сеть",
  "settings.network.lan_desc":
    "Связывайтесь с теми, кто в той же сети WiFi, в том числе между iPhone и Android. Другие устройства в сети видят, что вы используете Airhop.",
  "settings.network.lan_searching": "В этой сети нет устройств Airhop",
  "settings.network.lan_active": "Подключено в этой сети",
  "settings.network.lan_unavailable": "Вы не в сети WiFi",
  "settings.network.lan_permission":
    "Доступ к локальной сети для Airhop выключен",
  "settings.network.lan_unsupported": "Недоступно на этом устройстве",
  "settings.network.lan_foreground":
    "Останавливается, когда Airhop уходит в фон. Bluetooth продолжает работать.",
  "settings.network.wifi_pair": "Сопряжение",
  "settings.network.wifi_paired": "Связанные устройства",
  "settings.network.wifi_pair_find": "Найти устройство",
  "settings.network.wifi_pair_find_desc":
    "Искать ближайший iPhone, который показывает себя. Обоим нужна iOS 26 или новее.",
  "settings.network.wifi_pair_show": "Показать этот iPhone",
  "settings.network.wifi_pair_show_desc":
    "Позвольте ближайшему iPhone найти этот. Один ищет, другой показывает себя, в одно и то же время.",
  "settings.network.wifi_pair_find_action": "Выберите ближайший iPhone",
  "settings.network.wifi_pair_show_action": "Сделать этот iPhone видимым",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware сейчас недоступен",
  "settings.network.wifi_pair_forget": "Удалите связь в приложении Settings",
  "settings.network.bitchat": "Совместимость с bitchat",
  "settings.network.bitchat_desc":
    "Та же BLE-сеть, что и у bitchat, полностью совместима. Это всегда включено и не отключается.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Работать в фоне",
  "settings.conn.background_desc":
    "Держать сеть работающей, когда Airhop закрыт",
  "settings.conn.background_on_title": "Держать сеть работающей?",
  "settings.conn.background_on_body":
    "Airhop продолжит передавать и принимать в закрытом виде, поэтому сообщения будут приходить, пока вас нет. Android при этом показывает постоянное уведомление.",
  "settings.conn.background_off_title":
    "Останавливать сеть при закрытии Airhop?",
  "settings.conn.background_off_body":
    "Сообщения будут приходить, только пока Airhop открыт, и этот телефон перестанет передавать для тех, кто рядом. Постоянное уведомление исчезнет.",
  "settings.conn.live_voice": "Голосовая связь",
  "settings.conn.live_voice_desc": "Говорите с людьми поблизости как по рации",
  "settings.conn.live_voice_on_title": "Включить голосовую связь?",
  "settings.conn.live_voice_on_body":
    "Пока вы удерживаете микрофон, ваш голос идёт всем в зоне действия Bluetooth, а их голос звучит на вашем телефоне. Ничего не записывается.",
  "settings.conn.live_voice_off_title": "Выключить голосовую связь?",
  "settings.conn.live_voice_off_body":
    "Удержание микрофона будет записывать голосовую заметку. Она уйдёт, когда вы отпустите, и никто не услышит её, пока не включит.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Маршрутизация через Tor",
  "settings.conn.tor_desc":
    "Направлять трафик Nostr через Tor для большей приватности",
  "settings.conn.tor_on_title": "Направлять трафик Nostr через Tor?",
  "settings.conn.tor_on_body":
    "Ретрансляторы перестанут видеть ваш IP-адрес. Подключение займёт больше времени, а сообщения будут приходить медленнее. Bluetooth это не затрагивает.",
  "settings.conn.tor_off_title": "Выключить маршрутизацию через Tor?",
  "settings.conn.tor_off_body":
    "Трафик Nostr вернётся на обычное соединение, и ретрансляторы снова увидят ваш IP-адрес. Bluetooth это не затрагивает в любом случае.",
  "settings.conn.tor_unavailable":
    "Маршрутизация через Tor недоступна в этой сборке.",
  "settings.conn.tor_timeout":
    "Tor подключается дольше минуты. Он остаётся включённым и продолжает попытки; вкладка «Сеть» сообщит, когда маршрутизация заработает или если эта сеть её блокирует.",
  "settings.conn.tor_failed":
    "Не удалось запустить Tor. Убедитесь, что у приложения есть доступ к сети.",
  "settings.conn.mint_clearnet":
    "Разрешить трафик к монетному двору по открытой сети",
  "settings.conn.mint_clearnet_desc":
    "На iOS Tor покрывает только Nostr. Оставьте выключенным, чтобы блокировать запросы к монетному двору; ecash по сети работает в любом случае.",
  "settings.conn.gateway": "Интернет-шлюз",
  "settings.conn.gateway_desc":
    "Одолжите своё соединение телефону поблизости без интернета, чтобы он всё же добрался до каналов местоположения",
  "settings.conn.gateway_on_title": "Включить интернет-шлюз?",
  "settings.conn.gateway_on_body":
    "Телефоны поблизости без собственного соединения будут отправлять и получать сообщения каналов местоположения через ваше. Это расходует ваш мобильный трафик и батарею, а их сообщения остаются зашифрованными сквозным шифрованием, так что прочитать проходящее вы не можете.",
  "settings.conn.gateway_off_title": "Выключить интернет-шлюз?",
  "settings.conn.gateway_off_body":
    "Телефоны поблизости без интернета перестанут добираться до каналов местоположения через ваш. Ваши собственные сообщения это не затрагивает.",
  "settings.conn.bridge": "Мост сети",
  "settings.conn.bridge_desc":
    "Свяжите открытый чат #bluetooth этой зоны с другой группой Bluetooth вне зоны действия через интернет",
  "settings.conn.bridge_on_title": "Включить мост сети?",
  "settings.conn.bridge_on_body":
    "Ваши открытые сообщения #bluetooth будут публиковаться в вашем районе через интернет, чтобы их могли читать люди вне зоны действия Bluetooth. Личные сообщения через мост не идут никогда, а «только рядом» оставляет любое отдельное сообщение локальным.",
  "settings.conn.bridge_off_title": "Выключить мост сети?",
  "settings.conn.bridge_off_body":
    "Ваши открытые сообщения #bluetooth снова останутся в зоне действия Bluetooth, а сообщения из связанной группы перестанут сюда приходить.",
  "settings.conn.bridge_needs_location": "Мосту сети нужна геопозиция",
  "settings.conn.bridge_needs_location_desc":
    "Он определяет ваш район по геопозиции. Разрешите её, чтобы начать связывание.",
  "settings.conn.grant_location": "Дать разрешение на геопозицию",
  "settings.conn.grant_short": "Разрешить",
  "settings.conn.internet_off": "Интернет выключен",
  "settings.conn.internet_off_desc":
    "Tor, мост и шлюз используют интернет. Включите резервный интернет в разделе «Сеть», чтобы пользоваться ими.",
  "settings.conn.turn_on": "Включить",
  "settings.conn.turn_off": "Выключить",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Находит устройства поблизости и передаёт сообщения между ними. Без него сеть работать не может.",
  "settings.permissions.location": "Геопозиция",
  "settings.permissions.location_desc":
    "Открывает каналы окрестных зон. Без неё эти каналы остаются закрытыми, а сеть Bluetooth работает как обычно.",
  "settings.permissions.notifications": "Уведомления",
  "settings.permissions.notifications_desc":
    "Получайте оповещения о новых сообщениях, даже когда приложение закрыто. Без них вы увидите их только при открытии Airhop.",
  "settings.permissions.camera": "Камера",
  "settings.permissions.camera_desc":
    "Сканируйте QR-коды и снимайте фото или видео для отправки. Без неё вы всё ещё можете делиться медиа из медиатеки.",
  "settings.permissions.photos": "Фото",
  "settings.permissions.photos_desc":
    "Отправляйте фото из медиатеки и сохраняйте полученные медиа. Без этого вы всё ещё можете снимать и отправлять новые фото камерой.",
  "settings.permissions.microphone": "Микрофон",
  "settings.permissions.microphone_desc":
    "Записывайте и отправляйте голосовые сообщения или пользуйтесь голосовой связью. Без него голосовые сообщения и голосовая связь работать не будут.",
  "settings.permissions.allow": "Дать это разрешение",
  "settings.permissions.open_settings":
    "Открыть системные настройки, чтобы изменить это разрешение",
  "settings.permissions.system": "Система",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Сетевой трафик",
  "settings.storage.storage_usage": "Использование памяти",
  "settings.storage.storage_usage_desc":
    "Сообщения, доказательства кошелька и кэшированные вложения",
  "settings.storage.session_usage":
    "Эта сессия · отправлено {sent}, получено {received}",
  "settings.storage.cache": "Кэш",
  "settings.storage.cache_desc": "{size} вложений",
  "settings.storage.clear_cache": "Очистить кэш вложений",
  "settings.storage.clear": "Очистить",
  "settings.storage.clear_title": "Очистить кэшированные медиа?",
  "settings.storage.clear_body":
    "Фото, видео, голосовые заметки и файлы будут удалены с этого устройства — и отправленные, и полученные. Скачать их снова нельзя: их сообщения так и скажут, а отправителя можно попросить прислать заново. Сообщения и кошелёк не затрагиваются.",
  "settings.storage.cleared": "Кэш очищен",
  "settings.storage.freed": "Освобождено {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Установить оформление: {value}",
  "settings.font.set_a11y": "Установить моноширинный шрифт: {value}",
  "settings.font.system": "Системный",
  "settings.font.system_desc":
    "Использует моноширинный шрифт вашего устройства по умолчанию",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Современный и легко читается",
  "settings.language.en": "Английский",
  "settings.language.am": "Амхарский",
  "settings.language.ar": "Арабский",
  "settings.language.bn": "Бенгальский",
  "settings.language.my": "Бирманский",
  "settings.language.zh_hans": "Китайский (упрощённый)",
  "settings.language.zh_hant": "Китайский (традиционный)",
  "settings.language.nl": "Нидерландский",
  "settings.language.fil": "Филиппинский",
  "settings.language.fr": "Французский",
  "settings.language.ka": "Грузинский",
  "settings.language.de": "Немецкий",
  "settings.language.hi": "Хинди",
  "settings.language.id": "Индонезийский",
  "settings.language.it": "Итальянский",
  "settings.language.ja": "Японский",
  "settings.language.ko": "Корейский",
  "settings.language.mg": "Малагасийский",
  "settings.language.ms": "Малайский",
  "settings.language.ne": "Непальский",
  "settings.language.fa": "Персидский",
  "settings.language.pl": "Польский",
  "settings.language.pt_br": "Португальский (Бразилия)",
  "settings.language.pt_pt": "Португальский (Португалия)",
  "settings.language.pa": "Панджаби",
  "settings.language.ru": "Русский",
  "settings.language.es": "Испанский",
  "settings.language.sw": "Суахили",
  "settings.language.sv": "Шведский",
  "settings.language.ta": "Тамильский",
  "settings.language.th": "Тайский",
  "settings.language.tr": "Турецкий",
  "settings.language.uk": "Украинский",
  "settings.language.ur": "Урду",
  "settings.language.vi": "Вьетнамский",
  "settings.language.pseudo": "Псевдоязык",
  "settings.language.soon": "Скоро",
  "settings.language.soon_a11y": "{value}, скоро",
  "settings.language.set_a11y": "Установить язык: {value}",
  "settings.language.pending": "При следующем запуске",
  "settings.language.pending_a11y":
    "{value}, применится при следующем открытии Airhop",
  "settings.language.rtl_restart": "Открыть заново",
  "settings.language.rtl_title": "Откройте Airhop заново, чтобы завершить",
  "settings.language.rtl_body":
    "{value} читается справа налево, а Airhop может сменить направление только при запуске. Закройте приложение и откройте снова, чтобы завершить переключение. Ничего не потеряется, и до тех пор ваша сеть остаётся на связи.",
  "settings.theme.light": "Светлое",
  "settings.theme.light_desc": "Всегда использовать светлую палитру",
  "settings.theme.dark": "Тёмное",
  "settings.theme.dark_desc": "Всегда использовать тёмную палитру",

  // ---- Settings: profile and identity ----
  "settings.status.online": "В сети",
  "settings.status.online_desc": "Виден другим, вещает и сканирует",
  "settings.status.away": "Отошёл",
  "settings.status.away_desc": "Сеть приостановлена, не сканирует и не вещает",
  "settings.status.invisible": "Невидимка",
  "settings.status.invisible_desc": "Сканирует, но скрыт от обнаружения",
  "settings.status.title": "Статус",
  "settings.status.set_a11y": "Установить статус: {value}",
  "settings.status.edit": "Изменить статус",
  "settings.status.desc": "Выберите, насколько вы заметны в сети.",
  "settings.transfer.identity": "Личность и ключи",
  "settings.transfer.identity_desc": "Ваш идентификатор узла, имя и контакты",
  "settings.transfer.chats": "Чаты и история",
  "settings.transfer.chats_desc":
    "Разговоры, группы и каналы, к которым вы присоединились",
  "settings.transfer.wallet": "Баланс кошелька",
  "settings.transfer.wallet_desc": "Доказательства Cashu и история операций",
  "settings.transfer.title": "Перенос на новый телефон",
  "settings.transfer.desc":
    "Перенесите вашу личность, чаты и кошелёк на другое устройство",
  "settings.transfer.coming_soon_a11y": "Перенос на новый телефон, скоро",
  "settings.transfer.body":
    "Поднесите телефоны друг к другу и перенесите всё по Bluetooth. Ничего не проходит через сервер, поэтому это работает без интернета.",
  "settings.qr.permission_label": "Доступ к фото",
  "settings.qr.permission_purpose": "сохранить ваш QR-код",
  "settings.qr.saved": "Сохранено",
  "settings.qr.saved_body": "QR-код сохранён в вашу медиатеку.",
  "settings.qr.save_failed": "Не удалось сохранить",
  "settings.qr.save_failed_body": "QR-код не сохранился. Попробуйте снова.",
  "settings.qr.share_message": "Добавьте меня в Airhop",
  "settings.qr.share_body":
    "Добавьте меня в Airhop — приватные сообщения по mesh-сети, работающие без интернета.",
  "settings.qr.show_short": "Показать QR",
  "settings.qr.title": "Ваш QR-код",
  "settings.qr.note":
    "В нём ваши публичные ключи, которые позволяют другим писать вам откуда угодно. Делитесь им только с теми, кому доверяете. Он не изменится, пока вы не сотрёте свою личность.",
  "settings.qr.code_label": "Код контакта",
  "settings.qr.copy_code": "Копировать код контакта",
  "settings.qr.share": "Поделиться QR-кодом",
  "settings.qr.share_short": "Поделиться QR",
  "settings.qr.download": "Скачать QR-код",
  "settings.qr.download_short": "Скачать QR",
  "settings.qr.show": "Показать QR-код",
  "settings.wipe.trigger": "Запустить экстренную очистку",
  "settings.wipe.trigger_desc":
    "Тройное касание стирает всё немедленно, без подтверждения",
  "settings.wipe.title": "Экстренная очистка",
  "settings.wipe.now": "Стереть сейчас",
  "settings.wipe.desc":
    "Немедленно уничтожить все ключи, сообщения и доказательства",
  "settings.wipe.body":
    "Это немедленно уничтожит все ваши ключи, сообщения и доказательства кошелька. Отменить это нельзя.",
  "settings.wipe.in_progress": "Стираем",
  "settings.wipe.in_progress_body":
    "Уничтожаем ваши ключи, сообщения и файлы. Это займёт несколько секунд и завершится само, даже если приложение закрыть.",
  "settings.wipe.got_it": "Понятно",
  "settings.wipe.keys_failed": "Не удалось уничтожить ключи",
  "settings.wipe.keys_failed_body":
    "Ваши сообщения, контакты и кошелёк удалены, но устройство отказалось отдать ключи. Разблокируйте устройство и сотрите ещё раз.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Свяжитесь с нами",
  "settings.help.contact_a11y": "Написать на {address}",
  "settings.help.bug": "Сообщить об ошибке",
  "settings.help.bug_desc": "Открыть issue на GitHub",
  "settings.help.bug_a11y": "Сообщить об ошибке на GitHub",
  "settings.help.faq": "Частые вопросы",
  "settings.help.faq_desc": "Ответы на распространённые вопросы",
  "settings.help.faq_a11y": "Открыть частые вопросы",
  "settings.help.terms_desc": "Как можно пользоваться Airhop",
  "settings.help.terms_a11y": "Открыть условия использования",
  "settings.help.privacy_desc": "Что мы не собираем",
  "settings.help.privacy_a11y": "Открыть политику конфиденциальности",

  // ---- Settings: support ----
  "settings.support.card": "Карта или UPI",
  "settings.support.card_desc": "Интернет-банк и кошельки, по всему миру",
  "settings.support.card_a11y":
    "Поддержать картой, UPI, через интернет-банк или кошелёк",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Ежемесячно или разово, без комиссии платформы",
  "settings.support.sponsors_a11y": "Поддержать через GitHub Sponsors",
  "settings.support.note":
    "Я делаю Airhop в свободное время. Ни инвесторов, ни рекламы. Если он вам пригодился, взнос очень помогает продолжать разработку. Все функции в любом случае остаются бесплатными.",

  // ---- Settings: about and version ----
  "settings.about.version": "Версия",
  "settings.about.version_desc": "Текущий выпуск",
  "settings.about.version_a11y": "Посмотреть версию и проверить обновления",
  "settings.about.release_notes": "Что нового",
  "settings.about.release_notes_desc": "Что нового в последнем выпуске",
  "settings.about.release_notes_a11y":
    "Открыть заметки о последнем выпуске на GitHub",
  "settings.about.source": "Исходный код",
  "settings.about.source_a11y": "Открыть исходный код на GitHub",
  "settings.about.licenses": "Лицензии открытого кода",
  "settings.about.open_repo": "Открыть репозиторий {name}",
  "settings.about.licenses_desc": "Сторонние пакеты с открытым кодом",
  "settings.about.licenses_a11y": "Посмотреть лицензии сторонних пакетов",
  "settings.version.codename": "Кодовое имя",
  "settings.version.checking": "Проверяем",
  "settings.version.check": "Проверить обновления",
  "settings.version.checking_title": "Проверяем обновления",
  "settings.version.up_to_date": "У вас последняя версия.",
  "settings.version.release_notes": "Посмотреть, что нового",
  "settings.version.made_with": "Сделано с",
  "settings.version.number": "Версия {version}",
  "settings.version.update_to": "Обновить до {version}",
  "settings.version.update_to_a11y": "Обновить до версии {version}",
  "settings.version.released_under": "Выпущено под {license}",
  "settings.version.notes_a11y": "Посмотреть, что нового в версии {version}",
  "settings.version.tor_paused":
    "Проверка обновлений приостановлена, пока включён Tor, чтобы не раскрыть ваш IP. Загляните на страницу выпусков в браузере.",
  "settings.version.check_failed":
    "Не удалось проверить обновления. Проверьте соединение и попробуйте снова.",
  "settings.version.downloading": "Загрузка {percent}%",
  "settings.version.install": "Установить",
  "settings.version.download_failed":
    "Не удалось загрузить. Проверьте подключение и повторите попытку.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind}: {size} KiB, это больше предела в {cap} KiB.",
  "transfer.failed.malformed":
    "Вложение пришло повреждённым и не открылось. Попросите отправить его снова.",
  "transfer.failed.unsupported_type":
    "Вложение пришло в формате, который это приложение открыть не может.",
  "transfer.failed.type_mismatch":
    "Вложение отклонено: его содержимое не соответствует заявленному типу файла.",
  "transfer.failed.storage":
    "Вложение пришло, но сохранить его не удалось. Проверьте свободное место.",
  "transfer.badge.waiting": "Ожидание · {name}",
  "transfer.badge.active_count": "Передач: {count}",
  "transfer.badge.sending": "Отправляем {name}",
  "transfer.badge.receiving": "Получаем {name}",
  "transfer.badge.a11y": "{label}, {percent} процентов. Открыть разговор.",
  "transfer.kind.photo": "Фото",
  "transfer.kind.video": "Видео",
  "transfer.kind.voice": "Голосовая заметка",
  "transfer.this.photo": "Это фото",
  "transfer.this.video": "Это видео",
  "transfer.this.voice": "Эта голосовая заметка",
  "transfer.this.file": "Этот файл",
  "transfer.kind.document": "Документ",
  "transfer.kind.voice_preview": "Голосовая заметка",
  "transfer.kind.photo_preview": "Фото",
  "transfer.kind.video_preview": "Видео",
  "transfer.kind.document_preview": "Документ",

  // ---- System notifications ----
  "notif.channel.messages": "Сообщения",
  "notif.channel.nearby": "Узлы поблизости",
  "notif.channel.nearby_desc":
    "Редкое уведомление, когда сеть находит людей в зоне действия Bluetooth.",
  "notif.nearby.body":
    "Сейчас в зоне действия Bluetooth. Нажмите, чтобы открыть сеть.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Кто-то",
  "notif.notice_urgent": "Срочное объявление · {content}",
  "notif.notice": "Объявление · {content}",
  "notif.incoming_file": "Входящий файл",
  "notif.preview.photo": "📷 Фото",
  "notif.preview.voice": "🎤 Голосовое сообщение",
  "notif.preview.video": "🎥 Видео",
  "notif.preview.document": "📄 Документ",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Новое сообщение",
  "notif.hidden.channel": "Новая активность",
  "notif.hidden.mention": "Вас упомянули",
  "notif.mention.title": "{sender} упомянул вас",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Показать ещё {count}",
    few: "Показать ещё {count}",
    many: "Показать ещё {count}",
    other: "Показать ещё {count}",
  },
  "chat.channels.show_more_a11y": {
    one: "Показать ещё {count} стандартный канал",
    few: "Показать ещё {count} стандартных канала",
    many: "Показать ещё {count} стандартных каналов",
    other: "Показать ещё {count} стандартного канала",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} непрочитанное",
    few: "{label}, {count} непрочитанных",
    many: "{label}, {count} непрочитанных",
    other: "{label}, {count} непрочитанного",
  },
  "a11y.new_count": {
    one: "{label}, {count} новое",
    few: "{label}, {count} новых",
    many: "{label}, {count} новых",
    other: "{label}, {count} нового",
  },
  "chat.a11y.unread": {
    one: "{count} непрочитанное",
    few: "{count} непрочитанных",
    many: "{count} непрочитанных",
    other: "{count} непрочитанного",
  },
  "chat.thread.length_left": {
    one: "остался {count}",
    few: "осталось {count}",
    many: "осталось {count}",
    other: "осталось {count}",
  },
  "settings.general.retention_days": {
    one: "{count} день",
    few: "{count} дня",
    many: "{count} дней",
    other: "{count} дня",
  },
  "chat.info.group_reach": {
    one: "{reachable} из {count} участника доступен",
    few: "{reachable} из {count} участников доступны",
    many: "{reachable} из {count} участников доступны",
    other: "{reachable} из {count} участника доступны",
  },
  "chat.group_members": {
    one: "Приватная группа  ·  {count} участник",
    few: "Приватная группа  ·  {count} участника",
    many: "Приватная группа  ·  {count} участников",
    other: "Приватная группа  ·  {count} участника",
  },
  "chat.select.count": {
    one: "Выбрано {count}",
    few: "Выбрано {count}",
    many: "Выбрано {count}",
    other: "Выбрано {count}",
  },
  "chat.select.forward": {
    one: "Переслать {count} сообщение",
    few: "Переслать {count} сообщения",
    many: "Переслать {count} сообщений",
    other: "Переслать {count} сообщения",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} говорит",
    few: "{count} говорят",
    many: "{count} говорят",
    other: "{count} говорит",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} узел в зоне действия",
    few: "{count} узла в зоне действия",
    many: "{count} узлов в зоне действия",
    other: "{count} узла в зоне действия",
  },
  "mesh.peer.hops_away": {
    one: "в {count} переходе",
    few: "в {count} переходах",
    many: "в {count} переходах",
    other: "в {count} перехода",
  },
  "chat.presence.active": {
    one: "{count} активен",
    few: "{count} активны",
    many: "{count} активны",
    other: "{count} активно",
  },
  "chat.presence.nearby": {
    one: "{count} поблизости",
    few: "{count} поблизости",
    many: "{count} поблизости",
    other: "{count} поблизости",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} монетный двор",
    few: "{count} монетных двора",
    many: "{count} монетных дворов",
    other: "{count} монетного двора",
  },
  "wallet.mint.remove_body": {
    one: "{mint} держит {balance} {unit} в {count} доказательстве. Удаление навсегда сотрёт его с этого устройства, а резервной копии нет. Сначала выведите или отправьте баланс.",
    few: "{mint} держит {balance} {unit} в {count} доказательствах. Удаление навсегда сотрёт их с этого устройства, а резервной копии нет. Сначала выведите или отправьте баланс.",
    many: "{mint} держит {balance} {unit} в {count} доказательствах. Удаление навсегда сотрёт их с этого устройства, а резервной копии нет. Сначала выведите или отправьте баланс.",
    other:
      "{mint} держит {balance} {unit} в {count} доказательства. Удаление навсегда сотрёт их с этого устройства, а резервной копии нет. Сначала выведите или отправьте баланс.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} пополнение ждёт оплаты. Проверяется заново при каждом открытии приложения.",
    few: "{count} пополнения ждут оплаты. Проверяются заново при каждом открытии приложения.",
    many: "{count} пополнений ждут оплаты. Проверяются заново при каждом открытии приложения.",
    other:
      "{count} пополнения ждут оплаты. Проверяются заново при каждом открытии приложения.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Восстановлено {count} непотраченное доказательство из {mints}.",
    few: "Восстановлено {count} непотраченных доказательства из {mints}.",
    many: "Восстановлено {count} непотраченных доказательств из {mints}.",
    other: "Восстановлено {count} непотраченного доказательства из {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "Найдена {count} монета, но она уже потрачена, поэтому за неё ничего не зачислено. Это нормально: каждая когда-либо потраченная вами монета остаётся в записях монетного двора.",
    few: "Найдено {count} монеты, но они уже потрачены, поэтому за них ничего не зачислено. Это нормально: каждая когда-либо потраченная вами монета остаётся в записях монетного двора.",
    many: "Найдено {count} монет, но они уже потрачены, поэтому за них ничего не зачислено. Это нормально: каждая когда-либо потраченная вами монета остаётся в записях монетного двора.",
    other:
      "Найдено {count} монеты, но они уже потрачены, поэтому за них ничего не зачислено. Это нормально: каждая когда-либо потраченная вами монета остаётся в записях монетного двора.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Показать ещё {count}",
    few: "Показать ещё {count}",
    many: "Показать ещё {count}",
    other: "Показать ещё {count}",
  },
  "wallet.activity.show_more_a11y": {
    one: "Показать ещё {count} платёж",
    few: "Показать ещё {count} платежа",
    many: "Показать ещё {count} платежей",
    other: "Показать ещё {count} платежа",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} не подтверждено",
    few: "{count} не подтверждено",
    many: "{count} не подтверждено",
    other: "{count} не подтверждено",
  },
  "wallet.proof_count": {
    one: "{count} доказательство",
    few: "{count} доказательства",
    many: "{count} доказательств",
    other: "{count} доказательства",
  },
  "wallet.spent_removed_detail": {
    one: "{count} доказательство было уже потрачено и удалено.",
    few: "{count} доказательства были уже потрачены и удалены.",
    many: "{count} доказательств были уже потрачены и удалены.",
    other: "{count} доказательства были уже потрачены и удалены.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "{count} человек поблизости",
    few: "{count} человека поблизости",
    many: "{count} человек поблизости",
    other: "{count} человека поблизости",
  },
};

export const ru = { strings, plurals };
