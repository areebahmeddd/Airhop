// uk: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Скасувати",
  "common.done": "Готово",
  "common.ok": "Гаразд",
  "common.close": "Закрити",
  "common.back": "Назад",
  "common.delete": "Видалити",
  "common.remove": "Вилучити",
  "common.add": "Додати",
  "common.copy": "Копіювати",
  "common.copied": "Скопійовано",
  "common.share": "Поділитися",
  "common.continue": "Далі",
  "common.try_again": "Спробувати ще раз",
  "common.settings": "Налаштування",
  "common.off": "Вимкнено",

  // ---- Dates ----
  "format.today": "Сьогодні",
  "format.yesterday": "Учора",
  "format.minutes_ago": "{count} хв тому",
  "format.hours_ago": "{count} год тому",
  "format.days_ago": "{count} дн тому",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Чати",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Гаманець",
  "nav.tab.profile": "Ви",
  "a11y.tab.new_peers": "{label}, поблизу хтось новий",
  "nav.notifications": "Сповіщення",
  "chat.subtab.channels": "Канали",
  "chat.subtab.direct": "Прямі",
  "chat.subtab.dms": "Прямі повідомлення",
  "chat.search.placeholder": "Пошук у чатах…",
  "chat.search.a11y": "Пошук у чатах і повідомленнях",
  "chat.search.close": "Закрити пошук",
  "chat.search.clear": "Очистити пошук",
  "mesh.view.radar": "Вигляд радара",
  "mesh.view.list": "Вигляд списку",
  "mesh.view.radar_short": "Радар",
  "mesh.view.list_short": "Список",

  // ---- Legal document names ----
  "legal.last_updated": "Останнє оновлення: {date}",
  "legal.terms": "Умови користування",
  "legal.privacy": "Політика приватності",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Приватний зв’язок через mesh",
  "onboarding.welcome.cta": "Почати",
  "onboarding.welcome.cta_hint": "Погодьтеся з умовами нижче, щоб продовжити",
  "onboarding.welcome.consent_a11y":
    "Погодитися з Умовами користування та Політикою приватності",
  "onboarding.welcome.open_terms": "Відкрити Умови користування",
  "onboarding.welcome.open_privacy": "Відкрити Політику приватності",
  "onboarding.welcome.consent":
    "Натискаючи {cta}, ви погоджуєтеся з нашими {terms} та {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Створюємо вашу особистість",
  "onboarding.identity.body":
    "Створюємо пару ключів Ed25519 на цьому пристрої.\nНічого нікуди не надсилається.",
  "onboarding.identity.failed_heading": "Не вдалося створити ваші ключі",
  "onboarding.identity.failed_body":
    "Цей пристрій не дозволив Airhop зберегти їх безпечно. Спробуйте ще раз або перезапустіть телефон і відкрийте Airhop знову.",
  "onboarding.identity.steps_a11y": "Кроки: {steps}",
  "onboarding.identity.step.x25519": "Створюємо статичну пару ключів X25519",
  "onboarding.identity.step.ed25519": "Створюємо пару ключів підпису Ed25519",
  "onboarding.identity.step.keychain":
    "Зберігаємо ключі у сховищі ключів системи",
  "onboarding.identity.step.peer_id": "Виводимо ідентифікатор піра",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Ваше ім’я в mesh",
  "onboarding.username.peer_id": "Ідентифікатор піра",
  "onboarding.username.card_a11y":
    "Ваше ім’я в mesh — {username}. Ідентифікатор піра {peerID}. {props}.",
  "onboarding.username.explanation":
    "Це ім’я користувача детерміновано виводиться з вашого відкритого ключа. Воно однакове на кожному пристрої, який бачить ваш ідентифікатор піра.",
  "onboarding.username.cta": "Увійти в Airhop",
  "onboarding.username.prop.algorithm": "Алгоритм",
  "onboarding.username.prop.storage": "Зберігання",
  "onboarding.username.prop.storage_value": "Лише сховище ключів системи",
  "onboarding.username.prop.account": "Потрібен обліковий запис",
  "onboarding.username.prop.account_value": "Немає",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Ласкаво просимо до Airhop",
  "onboarding.hello.p1":
    "Вітаю. Airhop побудований поверх bitchat як самостійний побічний проєкт з відкритим кодом. Він не пов’язаний із проєктом bitchat чи permissionless tech і не схвалений ними, це просто те, що мені подобається створювати й ділитися зі спільнотою.",
  "onboarding.hello.p2":
    "Це перший випуск для iOS та Android, тож хоча я випробував його з друзями, ви, найімовірніше, натрапите на кілька помилок. Якщо так станеться або якщо у вас є ідея функції, я радо про це почую. Відкрийте запит на {github} або напишіть мені на {email}.",
  "onboarding.hello.p3":
    "Якщо Airhop вам корисний, подумайте про зірочку на {github} чи відгук у {store}. Це допомагає більшій кількості людей знайти проєкт. Дякую, що спробували!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Перш ніж телефон запитає",
  "onboarding.primer.lede": "Ось що робить кожен із них, а чого не робить.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Знаходить пристрої поблизу та передає повідомлення між ними. Саме так утворюється mesh, і працює це без інтернету.",
  "onboarding.primer.location.title": "Місцезнаходження",
  "onboarding.primer.location.body":
    "Розміщує вас у сусідніх каналах місцевості, від кварталу до цілого регіону. Airhop ніколи не стежить за вами й не надсилає ваше точне місцезнаходження за межі пристрою.",
  "onboarding.primer.notifications.title": "Сповіщення",
  "onboarding.primer.notifications.body":
    "Отримуйте сигнали про нові повідомлення, навіть коли застосунок закрито. Сповіщення створюються локально на вашому пристрої, без жодного сервера.",
  "onboarding.primer.footnote":
    "Ви можете відмовитися. Повідомлення все одно ходять через інтернет, а передумати можна згодом у Налаштуваннях.",
  "onboarding.primer.cta_a11y": "Перейти до запитів дозволів",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Доступ до Bluetooth",
  "permission.bluetooth.purpose": "знаходити пристрої поблизу через mesh",
  "permission.open_settings": "Відкрити Налаштування",
  "permission.not_now": "Не зараз",
  "permission.blocked_title": "{label} вимкнено",
  "permission.blocked_body": "Увімкніть його в Налаштуваннях, щоб {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Щось пішло не так",
  "error.boundary.body":
    "Airhop натрапив на несподівану проблему й мусив зупинити те, що показував.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Типові канали",
  "chat.channels.yours": "Ваші канали",
  "chat.channels.none": "Каналів поки немає",
  "chat.channels.none_hint":
    "Торкніться {plus} угорі, щоб приєднатися до каналу чи створити його.",
  "chat.channels.none_desc":
    "Каналів поки немає. Скористайтеся кнопкою додавання в заголовку, щоб приєднатися до каналу чи створити його.",
  "chat.channels.show_fewer": "Показати менше типових каналів",
  "chat.channels.show_less": "Показати менше",
  "chat.channels.info": "Відомості про канал",
  "chat.channels.pin": "Закріпити канал",
  "chat.channels.unpin": "Відкріпити канал",
  "chat.channels.mute": "Вимкнути звук каналу",
  "chat.channels.unmute": "Увімкнути звук каналу",
  "chat.channels.leave": "Покинути канал",
  "chat.channels.leave_confirm": "Покинути",
  "chat.channels.clear_body":
    "Видалити всі повідомлення в {name}? Скасувати це неможливо.",
  "chat.channels.leave_body":
    "Покинути {name}? Ви перестанете отримувати його повідомлення, а історію буде вилучено з цього пристрою.",
  "chat.channels.more_options": "Більше варіантів для {name}",
  "chat.channels.teleported_tag": "{level}  ·  телепортовано",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Очистити чат",
  "chat.dm.remove_contact": "Вилучити контакт",
  "chat.dm.block": "Заблокувати цього піра",
  "chat.dm.block_confirm": "Заблокувати",
  "chat.dm.delete": "Видалити чат",
  "chat.dm.delete_body":
    "Це прибирає розмову зі списку й видаляє її повідомлення. Контакт лишається, а нове повідомлення від нього починає новий чат.",
  "chat.dm.in_range": "у радіусі",
  "chat.dm.row_hint":
    "Торкніться двічі й утримуйте, щоб побачити більше варіантів",
  "chat.channels.row_hint":
    "Торкніться двічі й утримуйте, щоб побачити більше варіантів",
  "chat.dm.you_prefix": "Ви:",
  "chat.dm.none": "Немає прямих повідомлень",
  "chat.dm.none_desc":
    "Перейдіть на вкладку Mesh і торкніться піра, щоб почати зашифроване пряме повідомлення.",
  "chat.dm.contact_info": "Відомості про контакт",
  "chat.dm.pin": "Закріпити чат",
  "chat.dm.unpin": "Відкріпити чат",
  "chat.dm.mute": "Вимкнути звук чату",
  "chat.dm.unmute": "Увімкнути звук чату",
  "chat.dm.clear_body":
    "Видалити всі повідомлення з {name}? Скасувати це неможливо.",
  "chat.dm.remove_contact_body":
    "Вилучити {name}? Це видаляє розмову й забуває контакт. Вони все одно зможуть до вас достукатися, написавши знову.",
  "chat.dm.block_body":
    "Заблокувати {name}? Ви не бачитимете їх на вкладці Mesh і не отримуватимете від них повідомлень, навіть коли вони поруч.",
  "chat.dm.more_options": "Більше варіантів для {name}",
  "chat.dm.remove_contact_short": "Вилучити контакт",
  "chat.dm.block_short": "Заблокувати контакт",
  "chat.dm.delete_short": "Видалити чат",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Очистити повідомлення",
  "chat.clear_confirm": "Очистити",
  "chat.group_badge": "Група",
  "chat.more": "Ще",
  "chat.no_messages": "Повідомлень поки немає",
  "chat.you": "Ви",
  "chat.a11y.channel": "Канал {name}",
  "chat.a11y.group": "Група {name}",
  "chat.a11y.muted": "звук вимкнено",
  "chat.a11y.pinned": "закріплено",

  // ---- Chats: start something new ----
  "chat.new.title": "Почати щось нове",
  "chat.new.channel": "Створити приватний канал",
  "chat.new.channel_label": "Приватний канал",
  "chat.new.channel_desc":
    "Кімната, до якої може приєднатися будь-хто з посиланням. Створіть її або приєднайтеся за надісланим вам посиланням.",
  "chat.new.group": "Створити приватну групу",
  "chat.new.group_label": "Приватна група",
  "chat.new.group_desc":
    "Виберіть конкретних людей. До 16. Лишається на Bluetooth.",
  "chat.new.place": "Перейти до місця за geohash",
  "chat.new.place_label": "Перейти до місця",
  "chat.new.place_desc": "Відкрийте канал місцевості будь-де за його geohash.",
  "chat.new.reach": "Охоплення",
  "chat.new.reach_internet": "Дістає учасників через Bluetooth та інтернет.",
  "chat.new.reach_mesh": "Працює в радіусі Bluetooth, не через інтернет.",
  "chat.new.reach_internet_desc":
    "Дістає учасників і через інтернет. Релеї бачать, що канал активний, але ніколи його повідомлення чи те, хто в ньому.",
  "chat.new.reach_mesh_desc":
    "Лишається в місцевому mesh. Найприватніше, ніщо не виходить за радіус Bluetooth.",
  "chat.new.join_link":
    "Приєднатися до приватного каналу за посиланням-запрошенням",
  "chat.new.back_to_chooser": "Назад до вибору",
  "chat.new.create_channel": "Створити канал",
  "chat.new.name_required": "Спершу введіть назву каналу",
  "chat.new.name_taken": "Цю назву вже зайнято",
  "chat.new.create": "Створити",
  "chat.new.e2ee":
    "Наскрізне шифрування. Читати повідомлення можуть лише учасники.",
  "chat.new.invite_only":
    "Лише за запрошенням. Приєднатися може будь-хто, з ким ви поділитеся посиланням. Для решти він лишається прихованим, навіть для пірів поблизу.",
  "chat.new.name_exists": "Канал із такою назвою вже існує.",
  "chat.new.reach_bluetooth_chip": "Лише Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + інтернет",
  "chat.new.have_link": "Приєднатися за посиланням-запрошенням",

  // ---- Chats: join by link ----
  "chat.join.title": "Приєднатися за посиланням",
  "chat.join.not_airhop": "Це не посилання Airhop.",
  "chat.join.reach_internet": "Дістає учасників через Bluetooth та інтернет.",
  "chat.join.reach_mesh": "Лишається в радіусі Bluetooth.",
  "chat.join.contact_card":
    "Картка контакту. Додає людину до ваших контактів і відкриває чат.",
  "chat.join.unverified": "Не вдалося перевірити те посилання",
  "chat.join.unverified_body":
    "Картка контакту не збігається з власними ключами, тож її не додано. Попросіть надіслати свіжу.",
  "chat.join.paste": "Вставити з буфера обміну",
  "chat.join.join": "Приєднатися",
  "chat.join.public_channel":
    "Публічний канал {name}. Читати його може будь-хто поблизу.",
  "chat.join.private_channel": "Приватний канал {name}. {reach}",
  "chat.join.dm_with": "Пряме повідомлення з {name}.",
  "chat.join.joined_as": "Приєдналися як {name}",
  "chat.join.name_clash_body":
    "Ви вже в іншому {name}. Назви каналів — це лише мітки, тож це запрошення відкрило власний канал, а той, у якому ви були, лишився недоторканим. Перейменувати будь-який можна з його відомостей.",
  "chat.join.paste_hint":
    "Вставте запрошення, що починається з airhop://. Торкнутися посилання теж працює; це для посилання, якого торкнутися не вийде.",
  "chat.join.key_note":
    "Запрошення до приватного каналу несе ключ, тож приєднання миттєве і ні в кого нічого не питають.",
  "chat.join.offline_note":
    "Працює офлайн. Посилання читається на цьому пристрої, а канал сягає настільки, наскільки налаштував його творець.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Не вдалося відкрити ту комірку. Спробуйте за мить.",
  "chat.jump.title": "Перейти до місця",
  "chat.jump.saved": "ЗБЕРЕЖЕНІ МІСЦЯ",
  "chat.jump.anywhere":
    "Відкрийте публічний канал місцевості будь-де, навіть там, де вас немає.",
  "chat.jump.geohash_note":
    "Введіть його geohash. Канал спільний для всіх, чиє місцезнаходження потрапляє в цю комірку.",
  "chat.jump.teleport_note":
    "Ви показуєтеся як телепортований, а не як поруч. Це дістає лише через інтернет.",
  "chat.jump.level_cell": "Комірка рівня {level}",
  "chat.jump.already_here": "Ви вже тут. Перейти відкриє ваш канал {name}.",
  "chat.jump.open_direction": "Відкрити комірку на {direction} від вас",
  "chat.jump.open_place": "Відкрити {name}",
  "chat.jump.remove_place": "Вилучити {name} зі збережених місць",
  "chat.jump.go": "Перейти",
  "chat.jump.how":
    "Щоб знайти geohash: відкрийте канал місцевості > торкніться його назви > скопіюйте його звідти.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Не вдалося дістатися кожного учасника. Спробуйте ще раз, поки вони поблизу.",
  "chat.group.you_were_added": "Вас додано до {name}.",
  "chat.group.added_you": "Додає вас до {name}",
  "chat.group.you_were_removed":
    "Вас вилучено з {name}. Ви більше не можете тут читати чи надсилати повідомлення.",
  "chat.group.removed_you": "Вилучає вас із {name}",
  "chat.group.add_failed": "Не вдалося їх додати",
  "chat.group.add_failed_body":
    "Нічого не змінилося. Або зараз до них не дістатися, або група заповнена на 16, або творець не ви.",
  "chat.group.remove_failed": "Не вдалося їх вилучити",
  "chat.group.remove_failed_body":
    "Нічого не змінилося. Змінювати склад групи може лише той, хто її створив.",
  "chat.group.e2ee":
    "Наскрізне шифрування. Читати повідомлення можуть лише учасники.",
  "chat.group.cap":
    "До 16 людей, вибраних вами. Посилання-запрошення немає, тож ніхто не потрапляє сюди через переслане посилання.",
  "chat.group.bluetooth":
    "Лише Bluetooth. Учасники поза радіусом отримають повідомлення, щойно повернуться.",
  "chat.group.members_label": "УЧАСНИКИ",
  "chat.group.none_in_range":
    "У радіусі нікого немає. Учасники мають бути поблизу, коли ви створюєте групу.",
  "chat.group.create_title": "Створити групу",
  "chat.group.name_placeholder": "Назва групи",
  "chat.group.create": "Створити",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Місцевий mesh · лише Bluetooth",
  "chat.scope.mesh_desc":
    "Дістає пристрої в радіусі Bluetooth (приблизно від 10 до 100 метрів). Інтернет не потрібен. Ідеально, щоб домовлятися на місці.",
  "chat.scope.block": "Квартал · ~100 м",
  "chat.scope.block_desc":
    "Охоплення розміром із квартал. Повідомлення мостяться через інтернет, щоб піри трохи за межами радіуса Bluetooth теж могли долучитися.",
  "chat.scope.neighborhood": "Район · ~1 км",
  "chat.scope.neighborhood_desc":
    "Охоплення рівня району. За допомоги релеїв піри по всій окрузі досяжні навіть без прямого зв’язку Bluetooth.",
  "chat.scope.city": "Місто · ~10 км",
  "chat.scope.city_desc":
    "Канал на все місто. Використовує геоприв’язані інтернет-релеї, щоб дістати пірів по всій агломерації.",
  "chat.scope.province": "Область · ~100 км",
  "chat.scope.province_desc":
    "Охоплення рівня області. Змощене через інтернет для регіонального охоплення в сотні кілометрів.",
  "chat.scope.country": "Країна чи регіон · ~1000 км",
  "chat.scope.country_desc":
    "Охоплення всієї країни. Приєднатися й читати повідомлення може будь-який користувач Airhop чи bitchat у регіоні.",
  "chat.transport.bluetooth": "Лише Bluetooth",
  "chat.transport.both": "Bluetooth + інтернет",
  "chat.transport.internet": "Лише інтернет",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Команда /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Надіслати теплі обійми",
  "chat.cmd.slap_hint": "Ляснути великою фореллю",
  "chat.status.sending": "Надсилаємо…",
  "chat.status.undo_send": "Скасувати надсилання",
  "chat.status.undo": "Скасувати",
  "chat.status.sent": "Надіслано",
  "chat.status.received": "Отримано",
  "chat.status.failed": "Не вдалося",
  "chat.status.canceled": "Скасовано",
  "chat.status.waiting": "Очікує",
  "chat.status.sending_short": "Надсилаємо",
  "chat.status.receiving": "Отримуємо",
  "chat.thread.not_available": "Тут недоступно",
  "chat.thread.private_channel": "Приватний канал",
  "chat.thread.location_channel": "Канал місцевості",
  "chat.thread.public_channel": "Публічний канал",
  "chat.thread.notices": "Оголошення цього каналу",
  "chat.thread.invite": "Запросити когось до цього каналу",
  "chat.thread.not_in_range":
    "Не в радіусі Bluetooth. Доставляємо через інтернет.",
  "chat.thread.not_nearby":
    "Немає поблизу. Доставимо, коли вони повернуться в радіус або будуть онлайн.",
  "chat.thread.no_keys":
    "Щоб їм написати, вам треба бути в радіусі Bluetooth або відсканувати їхній код.",
  "chat.geo.card_received":
    "{name} поділився своїм контактом. Поділіться своїм у відповідь, щоб продовжити розмову після того, як хтось із вас переїде.",
  "chat.geo.exchange_complete":
    "Контактами обмінялися. Тепер ви можете дістатися одне одного звідусіль.",
  "chat.geo.keep_person": "Зберегти цю людину",
  "chat.geo.keep_person_desc":
    "Поділіться своїм контактом, щоб продовжити розмову після того, як хтось із вас переїде. Вони дізнаються вашу постійну особистість.",
  "chat.geo.card_sent": "Поділилися · чекаємо на їхній",
  "chat.thread.left_cell":
    "Ви покинули цю місцевість, тож вони не дістануться вас тут. Обміняйтеся кодами, щоб продовжувати розмову будь-де.",
  "chat.thread.no_route":
    "Зараз до них не дістатися. Повідомлення піде, коли з’явиться шлях.",
  "chat.thread.empty": "Повідомлень поки немає",
  "chat.thread.empty_desc": "Почніть зашифровану розмову.",
  "chat.thread.jump_latest": "Перейти до найновішого повідомлення",
  "chat.thread.back_to_members": "Назад до учасників",
  "chat.thread.nostr_key": "Відкритий ключ Nostr",
  "chat.thread.in_range": "У радіусі",
  "chat.voice.not_recorded": "Голосову нотатку не записано",
  "chat.thread.message": "Повідомлення",
  "chat.thread.message_placeholder": "Повідомлення…",
  "chat.thread.length_full": "Повідомлення заповнене",
  "chat.thread.waiting_for": "Чекаємо, поки {name} повернеться · {percent}%",
  "chat.thread.peer": "пір",
  "chat.thread.cancel_transfer": "Скасувати {name}",
  "chat.thread.queued_more": "Ще {count} чекають на надсилання",
  "chat.thread.across_bridge": "{count} по той бік мосту",
  "chat.thread.bridged": "змощено",
  "chat.thread.invite_body":
    "Приєднуйтеся до мене в {channel} на Airhop — приватні повідомлення через mesh, спершу офлайн.",
  "chat.thread.go_back_unread": "Назад, {count} непрочитаних",
  "chat.thread.view_info": "Переглянути відомості про {name}",
  "chat.thread.notices_new": "Оголошення цього каналу, {count} нових",
  "chat.thread.say_something": "Скажіть щось у {channel}.",
  "chat.thread.jump_latest_new":
    "Перейти до найновішого повідомлення, {count} нових",
  "chat.thread.unconfirmed_since":
    "Жодного підтвердженого доставлення від {date}",
  "chat.thread.no_reach": "Немає пірів поблизу · це поки ніхто не отримав",
  "chat.thread.channel_needs_internet":
    "Інтернет вимкнено · цей канал дістає лише людей у радіусі Bluetooth",
  "chat.thread.cell_needs_internet":
    "Інтернет вимкнено · до цієї комірки можна дістатися лише через інтернет",
  "chat.thread.geo_dm_needs_internet":
    "Інтернет вимкнено · цю розмову несе лише інтернет",
  "chat.thread.via_gateway":
    "Інтернет вимкнено · пристрій поблизу виносить це в мережу за вас",
  "chat.thread.group_queued":
    "Нікого з цієї групи поки немає поблизу. Воно дійде до них, щойно вони будуть.",
  "chat.thread.no_group_key":
    "Ви більше не в цій групі, тож надіслати це не вийде",
  "chat.thread.no_reach_offline":
    "Інтернет вимкнено, і немає пірів поблизу · це поки ніхто не отримав",
  "chat.thread.mention": "Згадати {name}",
  "chat.thread.someone_talking": "{hold}. {name} говорить.",
  "chat.thread.attach_note":
    "Файли йдуть лише в радіусі Bluetooth. Текст і платежі дістають контактів через інтернет; вкладення — ні.",
  "chat.thread.message_peer": "Написати {name}",
  "chat.thread.send": "Надіслати повідомлення",
  "chat.thread.group": "Група",
  "chat.bridge.nearby_only":
    "Лише поблизу: тримайте це повідомлення осторонь мосту mesh",
  "chat.bridge.nearby_label": "Лише поблизу · лишається на Bluetooth",
  "chat.bridge.bridging_label":
    "Мостимо до сусідніх місцевостей · торкніться для «лише поблизу»",
  "chat.screenshot.you_took": "Ви зробили знімок екрана",
  "chat.screenshot.you_took_private":
    "Ви зробили знімок екрана · нікому не сказали",
  "chat.screenshot.heads_up": "Увага",
  "chat.screenshot.notice": "* {name} зробив знімок екрана *",
  "chat.screenshot.notified_dm":
    "{name} дізнався, що ви зробили знімок екрана цієї розмови.",
  "chat.screenshot.notified":
    "Усі в цьому каналі дізналися, що ви зробили знімок екрана.",
  "chat.screenshot.not_notified":
    "Ніхто не дізнався. Цей канал публічний, тож оголошення про знімок екрана зафіксувало б, що ви тут були.",
  "chat.thread.error": "Помилка",
  "chat.thread.go_back": "Назад",
  "chat.bubble.via_bridge": "через міст mesh",
  "chat.bubble.view_profile": "Переглянути профіль {name}",
  "chat.bubble.forwarded": "Переслано",
  "chat.bubble.attachment": "вкладення",
  "chat.bubble.a11y":
    "{sender}: {body}. Утримуйте, щоб побачити більше варіантів.",
  "chat.bubble.failed_retry":
    "Не вдалося надіслати. Торкніться, щоб спробувати ще раз.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Відомості про повідомлення",
  "chat.info.delivered_to": "Доставлено {name}",
  "chat.info.read_by": "Прочитано {name}",
  "chat.info.group_reach_desc":
    "Досяжні зараз, це не підтвердження доставлення",
  "chat.info.group_alone": "Інших учасників немає",
  "chat.info.today_at": "Сьогодні {time}",
  "chat.info.sending": "Надсилаємо…",
  "chat.info.failed": "Не вдалося надіслати",
  "chat.info.courier": "Переніс друг",
  "chat.info.sent": "Надіслано",
  "chat.info.queued": "Чекає на надсилання",
  "chat.info.waiting": "Чекаємо…",
  "chat.action.info": "Відомості про повідомлення",
  "chat.action.save_photos": "Зберегти у фото",
  "chat.action.save_copy": "Зберегти копію",
  "chat.action.forward": "Переслати",
  "chat.action.select": "Вибрати",
  "chat.select.cancel": "Скасувати вибір",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Камера",
  "chat.attach.camera_desc": "Зняти фото чи відео",
  "chat.attach.library": "Галерея фото",
  "chat.attach.library_desc": "Виберіть із галереї",
  "chat.attach.document": "Документ",
  "chat.attach.document_desc": "Надішліть будь-який файл чи PDF",
  "chat.attach.voice": "Голосова нотатка",
  "chat.attach.voice_desc": "Запишіть і надішліть голосове повідомлення",
  "chat.attach.ecash": "Надіслати ecash",
  "chat.attach.ecash_desc": "Надішліть сати Cashu зі свого гаманця",
  "chat.attach.location": "Місцезнаходження",
  "chat.attach.location_desc": "Надішліть, де ви зараз",
  "chat.attach.title": "Прикріпити",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Поділився місцем",
  "chat.location.received_summary": "Поділився своїм місцем",
  "chat.location.title": "Місцезнаходження",
  "chat.location.away": "{distance} на {direction}",
  "chat.location.taken": "Знято {ago} тому",
  "chat.location.open_maps": "Відкрити в Картах",
  "chat.location.no_forward": "Місця не пересилаються",
  "chat.location.no_forward_body":
    "Місце надсилається одній людині. Поділіться натомість своїм, якщо хочете, щоб воно було в когось іншого.",
  "chat.location.no_fix":
    "Дозвольте місцезнаходження, щоб побачити, як це далеко",
  "chat.location.send_title": "Надіслати ваше місцезнаходження",
  "chat.location.send_body":
    "{name} побачить одну точку: де ви зараз. Воно не оновлюється далі.",
  "chat.location.send": "Надіслати місцезнаходження",
  "chat.location.finding": "Шукаємо ваше місцезнаходження…",
  "chat.location.no_location": "Не вдалося отримати ваше місцезнаходження",
  "chat.location.no_location_body":
    "Дозвольте доступ до місцезнаходження й переконайтеся, що служби місцезнаходження увімкнено, а тоді спробуйте ще раз.",
  "chat.location.not_delivered": "Не вдалося надіслати ваше місцезнаходження",
  "chat.location.not_delivered_body":
    "Місце варто надсилати, лише поки воно свіже, тож у чергу на потім воно не стає. Спробуйте ще раз, коли до {name} можна буде дістатися.",
  "chat.location.direction.n": "північ",
  "chat.location.direction.ne": "північний схід",
  "chat.location.direction.e": "схід",
  "chat.location.direction.se": "південний схід",
  "chat.location.direction.s": "південь",
  "chat.location.direction.sw": "південний захід",
  "chat.location.direction.w": "захід",
  "chat.location.direction.nw": "північний захід",
  "chat.attach.send_anyway": "Усе одно надіслати",
  "chat.attach.bitchat_too_big": "Це може не дійти",
  "chat.attach.bitchat_too_big_body":
    "{name} користується bitchat, який здається на півдорозі, коли файл великий. Приблизно до 350 KiB надійно. Надсилання контакту в Airhop такої межі не має.",
  "chat.attach.bitchat_unopenable": "Вони можуть не зуміти це відкрити",
  "chat.attach.bitchat_unopenable_body":
    "{name} користується bitchat, який показує фото й голосові нотатки, але все інше подає як файл, що його він не може відкрити. Воно дійде, вони просто можуть не зуміти його переглянути.",
  "chat.attach.file": "Прикріпити файл",
  "chat.attach.unavailable": "Вкладення тут недоступні",
  "chat.attach.not_sent": "Вкладення не надіслано",
  "chat.attach.read_failed":
    "Щось пішло не так під час читання того файлу. Спробуйте інший.",
  "chat.attach.caption": "Додайте підпис…",
  "chat.attach.send": "Надіслати вкладення",
  "chat.attach.generic": "Вкладення",
  "chat.media.view_full": "Переглянути фото на весь екран",
  "chat.media.gone_photo": "Фото немає на цьому пристрої",
  "chat.media.gone_video": "Відео немає на цьому пристрої",
  "chat.media.gone_voice": "Голосової нотатки немає на цьому пристрої",
  "chat.media.gone_file": "Файлу немає на цьому пристрої",
  "chat.media.gone_note": "Вилучено через 7 днів або коли кеш очистили",
  "chat.media.ask_resend": "Попросити ще раз",
  "chat.media.resend_draft": "Можеш надіслати {kind} ще раз?",
  "chat.media.kind_photo": "те фото",
  "chat.media.kind_video": "те відео",
  "chat.media.kind_voice": "ту голосову нотатку",
  "chat.media.kind_file": "той файл",
  "chat.media.pause_voice": "Призупинити голосову нотатку",
  "chat.media.play_voice": "Відтворити голосову нотатку",
  "chat.media.voice_position": "Позиція в голосовій нотатці",
  "chat.media.voice_scrub":
    "Торкайтеся вздовж смужок, щоб перескочити в те місце",
  "chat.media.image": "Зображення",
  "chat.media.tap_load_photo": "Торкніться, щоб завантажити фото",
  "chat.media.open_document": "Відкрити {name}",
  "chat.media.document": "документ",
  "chat.media.tap_load_video": "Торкніться, щоб завантажити відео",
  "chat.media.video": "Відео",
  "chat.media.photo": "Фото",
  "chat.media.close_photo": "Закрити фото",
  "chat.media.save_photo": "Зберегти фото у ваші фото",
  "chat.media.share_photo": "Поділитися фото",
  "chat.media.saved_videos": "Збережено у ваші відео",
  "chat.media.saved_photos": "Збережено у ваші фото",
  "chat.media.not_saved": "Не збережено",
  "chat.media.cant_open": "Не вдається відкрити файл",
  "chat.media.no_app":
    "На цьому пристрої немає застосунку, який відкриє чи надішле цей файл.",
  "chat.media.open_failed":
    "Не вдалося відкрити файл. Можливо, його прибрали з кешу.",
  "media.blocked.nostr_only":
    "Ви знаєте цю людину лише через релей. Доступний лише текст. Фото, файли та голосові нотатки потребують Bluetooth.",
  "media.blocked.private_channel":
    "Транслюване вкладення підписується, але не шифрується, тож надсилання його в приватний канал залишило б його відкритим, тоді як текст тут лишається зашифрованим.",
  "media.blocked.private_group":
    "Транслюване вкладення підписується, але не шифрується, тож надсилання його в приватну групу залишило б його відкритим, тоді як текст тут лишається зашифрованим.",
  "media.blocked.location_channel":
    "Канал місцевості дістає людей через інтернет, а фото, файли та голосові нотатки йдуть через Bluetooth, тож вони ніколи б не дійшли.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Голосові нотатки тут недоступні",
  "chat.voice.hold_live": "Утримуйте, щоб говорити наживо",
  "chat.voice.hold_record": "Утримуйте, щоб записати голосову нотатку",
  "chat.voice.cancel_recording": "Скасувати запис",
  "chat.voice.slide_cancel": "Проведіть, щоб скасувати",
  "chat.voice.release_cancel": "Відпустіть, щоб скасувати",
  "chat.voice.a11y_toggle":
    "Торкніться двічі, щоб почати або припинити говорити.",
  "chat.voice.limit_reached":
    "Досягнуто межі у дві хвилини, відпустіть, щоб надіслати",
  "chat.voice.limit_sent": "Досягнуто межі у дві хвилини, нотатку надіслано",
  "chat.voice.stop_send": "Зупинити запис і надіслати",
  "chat.voice.lift_lock": "Проведіть угору, щоб записувати без утримання",
  "chat.voice.live_speaking": "{name} говорить",
  "voice.unavailable": "Живий голос недоступний",
  "voice.recording_stopped": "Запис зупинено",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Доступ до камери",
  "chat.perm.camera_purpose": "зняти фото для надсилання",
  "chat.perm.photo_label": "Доступ до фото",
  "chat.perm.photo_purpose": "вибрати фото чи відео для надсилання",
  "chat.perm.photo_save_purpose": "зберегти це у ваші фото",
  "chat.perm.mic_label": "Доступ до мікрофона",
  "chat.perm.mic_live_purpose": "говорити з людьми поблизу",
  "chat.perm.mic_note_purpose": "записати голосову нотатку",
  "chat.perm.recording_stopped": "Запис зупинено",
  "chat.perm.record_failed":
    "Не вдалося почати запис. Перевірте дозволи мікрофона.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Отримано",
  "chat.ecash.reclaimed": "Забрано",
  "chat.ecash.claiming": "Отримуємо…",
  "chat.ecash.claim": "Отримати",
  "chat.ecash.claim_amount": "Отримати {amount} {unit}",
  "chat.ecash.already_claimed": "Уже отримано",
  "chat.ecash.already_claimed_body":
    "Кожен доказ у цьому токені вже у вашому гаманці, тож нічого не додалося.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "Передано в mesh для доставлення в міру можливості",
  "chat.info.queued_desc":
    "Тримається на цьому телефоні, доки не з’явиться шлях до них",
  "chat.info.reclaimed": "Забрано",
  "chat.info.reclaimed_desc":
    "Ви забрали цей платіж назад у гаманець, тож доставлено його не буде",
  "chat.info.about": "Про це",
  "chat.info.group_desc":
    "Приватна група. Читати її можуть лише учасники, яких додав творець, і вона лишається на Bluetooth.",
  "chat.info.teleported_desc":
    "Публічний канал місцевості для цієї комірки geohash. Ним діляться через інтернет усі в комірці, і на Airhop, і на bitchat. Ви телепортовані, а не тут фізично.",
  "chat.info.custom_desc":
    "Власний канал. Приєднатися може будь-хто, хто знає назву, з будь-якого пристрою з Airhop чи bitchat.",
  "chat.info.private_e2ee": "Приватний · наскрізне шифрування",
  "chat.info.public_plain": "Публічний · без шифрування",
  "chat.info.group_privacy":
    "Читати цю групу можуть лише учасники, показані нижче. Повідомлення лишаються на Bluetooth, тож учасники поза радіусом отримають їх, щойно повернуться.",
  "chat.info.teleport_privacy":
    "Місце, куди ви телепортувалися. Воно дістає всіх у цій комірці через інтернет і нікого в радіусі Bluetooth.",
  "chat.info.location_off_privacy":
    "Місцезнаходження вимкнено, тож цей канал дістає пристрої поблизу лише через Bluetooth. Увімкніть місцезнаходження, щоб дістати його комірку місцевості через інтернет.",
  "chat.info.invite_privacy":
    "Читати його можуть лише люди, яких ви запросили посиланням. Для решти він лишається прихованим, навіть для пірів поблизу.",
  "chat.info.public_privacy":
    "Кожен, хто приєднається, може прочитати будь-яке повідомлення. Для приватної розмови користуйтеся прямим повідомленням; прямі повідомлення мають наскрізне шифрування.",
  "chat.info.remove_member": "Вилучити учасника",
  "chat.info.remove_member_body":
    "Вилучити {name} з групи? Ключ групи змінюється, тож нових повідомлень вони вже не прочитають.",
  "chat.info.message_member": "Написати {name}",
  "chat.info.remove_member_a11y": "Вилучити {name}",
  "chat.info.no_addable":
    "Немає досяжних пірів, щоб додати. Учасники мають бути поблизу.",
  "chat.info.add_count": "Додати {count}",
  "chat.info.teleported_tag": "{level}  ·  телепортовано",
  "chat.info.active": "Активні",
  "chat.info.members": "Учасники",
  "chat.info.bookmark": "Зберегти це місце",
  "chat.info.remove_bookmark": "Вилучити зі збережених",
  "chat.info.default_notice":
    "Типові канали покинути не можна. Вони є частиною протоколу mesh застосунку Airhop.",
  "chat.info.custom_channel": "Власний канал",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Копіювати geohash",
  "chat.info.relays": "Релеї",
  "chat.info.show_relays": "Показати релеї, що несуть цей канал",
  "chat.info.relay_custom": "власний",
  "chat.info.relays_none": "Немає. Ця комірка зараз лише на Bluetooth.",
  "chat.info.search_members": "Пошук учасників",
  "chat.info.search_members_placeholder": "Пошук учасників…",
  "chat.info.teleported": "Телепортовано",
  "chat.info.creator": "Творець",
  "chat.info.no_matches": "Збігів немає",
  "chat.info.no_one_here": "Тут поки нікого",
  "chat.info.add_members": "Додати учасників",
  "chat.info.add_selected": "Додати вибраних учасників",
  "chat.info.add": "Додати",
  "chat.info.leave_group": "Покинути групу",
  "chat.info.leave_channel": "Покинути канал",
  "chat.info.leave": "Покинути",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Спілкуєтеся з {date}",
  "chat.contact.verified_since": "Підтверджено з {date}",
  "chat.contact.anonymous": "Анонім",
  "chat.contact.anonymous_desc":
    "Псевдонім geohash без тривалої особистості, яку можна підтвердити",
  "chat.contact.verified": "Підтверджено",
  "chat.contact.verified_desc": "Ви відсканували їхній QR-код",
  "chat.contact.verified_desc_compared": "Ви звірили коди",
  "chat.contact.not_verified": "Не підтверджено",
  "chat.contact.not_verified_desc":
    "Відскануйте їхній код або звірте один під час дзвінка, щоб упевнитися, що це справді вони",
  "chat.contact.e2ee": "Наскрізне шифрування",
  "chat.contact.e2ee_nostr":
    "Загорнуто за NIP-17, тож релеї цього не прочитають",
  "chat.contact.e2ee_mesh":
    "Noise XX, плюс Double Ratchet між пристроями з Airhop",
  "chat.contact.copy_nostr": "Копіювати відкритий ключ Nostr",
  "chat.contact.nostr_key": "Відкритий ключ Nostr",
  "chat.contact.cell_key_note":
    "Цей ключ належить місцевості, де ви зустрілися. Він змінюється, якщо хтось із вас переїде, і разом із ним уривається розмова. Обміняйтеся контактами, щоб говорити будь-де.",
  "chat.contact.peer_name": "Ім’я піра",
  "chat.contact.peer_id": "Ідентифікатор піра",
  "chat.contact.rename": "Перейменувати",
  "chat.contact.rename_needs_contact":
    "Ви можете перейменовувати людей, чиї ключі маєте. Спершу обміняйтеся картками контактів, і тоді це стане ім’ям, яке бачите лише ви.",
  "chat.contact.rename_needs_keys":
    "Ключів для цього контакту ще немає. Напишіть їм або відскануйте їхній код, і тоді зможете дати ім’я, яке бачите лише ви.",
  "chat.contact.renamed_by_you": "Ваше ім’я для них",
  "chat.contact.copy_peer_id": "Копіювати ідентифікатор піра",
  "chat.contact.verify": "Підтвердити контакт",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Оголошення",
  "chat.notices.post_area": "Розмістити оголошення в цій місцевості",
  "chat.notices.post_mesh": "Розмістити оголошення в mesh",
  "chat.notices.mark_urgent": "Позначити терміновим",
  "chat.notices.post": "Розмістити оголошення",
  "chat.notices.post_short": "Розмістити",
  "chat.notices.delete": "Видалити оголошення",
  "chat.notices.just_now": "щойно",
  "chat.notices.fades_soon": "скоро зникне",
  "chat.notices.1_day": "1 день",
  "chat.notices.3_days": "3 дні",
  "chat.notices.7_days": "7 днів",
  "chat.notices.fading": "зникає",
  "chat.notices.fades_in_hours": "зникне через {count} год",
  "chat.notices.fades_in_days": "зникне через {count} дн",
  "chat.notices.scope_geo": "Гео",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Терміново",
  "chat.notices.permanent_warning":
    "Не зникає ніколи. Публічне й прив’язане до цієї місцевості, і забрати його назад ви не зможете.",
  "chat.notices.none":
    "Оголошень поки немає. Розмістіть одне, щоб воно лишилося тут для інших.",

  // ---- Chats: search results ----
  "chat.search.photos": "Фото",
  "chat.search.videos": "Відео",
  "chat.search.audio": "Аудіо",
  "chat.search.documents": "Документи",
  "chat.search.links": "Посилання",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Фільтрувати за {filter}",
  "chat.search.no_matches": "Немає {filter}, що відповідають «{query}»",
  "chat.search.no_media": "{filter} поки немає",
  "chat.search.result_a11y": "{chat}, {kind} від {sender}",
  "chat.search.you": "ви",
  "chat.search.section_chats": "Чати",
  "chat.search.section_messages": "Повідомлення",
  "chat.search.section_notices": "Оголошення",
  "chat.search.hint":
    "Шукайте в повідомленнях і чатах або виберіть фільтр угорі.",
  "chat.search.no_results": "Немає результатів для «{query}»",
  "chat.search.open_chat": "Відкрити {name}",
  "chat.search.message_a11y": "{chat}, повідомлення від {sender}: {snippet}",
  "chat.search.notice_a11y": "Оголошення в {chat} від {author}: {snippet}",
  "chat.search.urgent": "Терміново ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "У цьому списку {count}. Очищення прибирає їх лише звідси, а повідомлення лишаються непрочитаними у своїх розмовах. Позначення всіх прочитаними прибирає й те, й те.",
  "chat.notif.mark_all_read": "Позначити всі прочитаними",
  "chat.notif.clear_list": "Очистити список",
  "chat.notif.clear_all_a11y": "Очистити всі {count} сповіщень",
  "chat.notif.title": "Сповіщення",
  "chat.notif.clear_short": "Очистити",
  "chat.notif.close": "Закрити сповіщення",
  "chat.notif.none": "Сповіщень поки немає",
  "chat.notif.none_desc":
    "Повідомлення, згадки та оголошення з ваших каналів і чатів з’являються тут.",
  "chat.notif.new": "Нове",
  "chat.notif.notice_in": "оголошення в {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Переслати…",
  "chat.forward.to": "Переслати {name}",
  "chat.forward.cant_send_here": "Сюди переслати не можна",
  "chat.forward.cant_send_to": "Переслати {name} не можна",
  "chat.forward.channels": "Канали",
  "chat.forward.groups": "Групи",
  "chat.forward.locations": "Місцевості",
  "chat.forward.dms": "Прямі повідомлення",
  "chat.forward.none": "Інших чатів поки немає",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Запускаємо mesh…",
  "mesh.banner.no_bluetooth":
    "На цьому пристрої немає Bluetooth · лише інтернет",
  "mesh.banner.bluetooth_off": "Bluetooth вимкнено · mesh недоступний",
  "mesh.banner.permission_needed": "Потрібен дозвіл на Bluetooth",
  "mesh.banner.blocked":
    "Bluetooth заблоковано · дозвольте його в Налаштуваннях",
  "mesh.banner.location_permission":
    "Щоб знаходити пірів, потрібне місцезнаходження",
  "mesh.banner.advertising_unsupported":
    "Цей телефон бачить інших, але сам не може бути виявлений",
  "mesh.banner.location_off_android":
    "Місцезнаходження вимкнено · Android потребує його, щоб знаходити пірів",
  "mesh.banner.paused": "Mesh призупинено · вас немає",
  "mesh.banner.location_off":
    "Місцезнаходження вимкнено · канали місцевості недоступні",
  "mesh.banner.battery_saver": "Заощадження заряду · сканує рідше",
  "mesh.banner.wipe_incomplete":
    "Очищення незавершене · частина даних могла лишитися, спробуємо знову після повторного відкриття",
  "mesh.banner.wifi_off": "Wi-Fi вимкнено · великі файли йдуть повільніше",
  "mesh.banner.clock_skew":
    "Годинник цього телефона неправильний · встановіть автоматичні дату й час",
  "mesh.banner.internet_off": "Інтернет вимкнено · лише Bluetooth",
  "mesh.banner.relaying": "Немає пірів поблизу · передаємо через Nostr",
  "mesh.banner.tor": "Tor увімкнено · інтернет-трафік перенаправляється",
  "mesh.banner.tor_starting": "Запускаємо Tor · з’єднуємося",
  "mesh.banner.tor_blocked": "Tor не зміг з’єднатися · mesh усе одно працює",
  "mesh.banner.gateway":
    "Інтернет-шлюз увімкнено · передаємо для пірів поблизу",
  "mesh.banner.bridge": "Міст mesh увімкнено · публічний чат сполучено",
  "mesh.banner.background_limits": "{brand} може призупиняти mesh у фоні",
  "mesh.banner.bridge_across": "Міст mesh увімкнено · {count} по той бік мосту",
  "mesh.banner.action.turn_on": "Увімкнути",
  "mesh.banner.action.allow": "Дозволити",
  "mesh.banner.action.resume": "Відновити",
  "mesh.banner.action.fix": "Виправити",
  "mesh.banner.hint.resume": "Знову вмикає оголошення та сканування Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Просить Android увімкнути Bluetooth",
  "mesh.banner.hint.location_settings":
    "Відкриває системні налаштування місцезнаходження",
  "mesh.banner.hint.app_settings":
    "Відкриває дозволи Airhop у системних налаштуваннях",
  "mesh.banner.hint.battery_settings":
    "Відкриває налаштування фонової активності цього телефона",
  "mesh.banner.dismiss": "Приховати: {label}",
  "mesh.banner.hint.dismiss": "Ховає цю примітку назавжди",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Шукаємо пірів поблизу…",
  "mesh.radar.starting": "Запускаємо mesh…",
  "mesh.radar.no_bluetooth": "На цьому пристрої немає Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth вимкнено · не скануємо",
  "mesh.radar.permission_needed": "Потрібен дозвіл на Bluetooth",
  "mesh.radar.blocked": "Bluetooth заблоковано",
  "mesh.radar.location_permission": "Потрібен дозвіл на місцезнаходження",
  "mesh.radar.location_off": "Місцезнаходження вимкнено · не скануємо",
  "mesh.radar.hint_rings": "Кільця показують силу сигналу BLE, а не відстань",
  "mesh.radar.hint_checking": "Перевіряємо Bluetooth і дозволи",
  "mesh.radar.hint_internet": "Повідомлення все одно ходять через інтернет",
  "mesh.radar.hint_turn_on": "Увімкніть Bluetooth, щоб знаходити пірів",
  "mesh.radar.hint_allow": "Дозвольте Bluetooth, щоб знаходити пірів",
  "mesh.radar.hint_allow_settings":
    "Дозвольте Bluetooth у Налаштуваннях, щоб знаходити пірів",
  "mesh.radar.hint_location_permission":
    "Android 11 і старіші потребують місцезнаходження, щоб сканувати через Bluetooth",
  "mesh.radar.hint_android_location":
    "Android потребує увімкненого місцезнаходження, щоб повертати результати сканування Bluetooth",
  "mesh.radar.signal_strong": "Сильний",
  "mesh.radar.signal_medium": "Середній",
  "mesh.radar.signal_weak": "Слабкий",
  "mesh.radar.you_center": "Ви, у центрі mesh",
  "mesh.radar.sonar_hint":
    "Відтворює сигнал сонара. Сканування й так триває безперервно.",
  "mesh.radar.paused": "Mesh призупинено · вас немає",
  "mesh.radar.ring_hint":
    "Положення на кільці відображає силу сигналу, а не відстань",
  "mesh.radar.set_online":
    "Установіть статус Онлайн на вкладці Ви, щоб знаходити пірів",
  "mesh.radar.in_range": "у радіусі",
  "mesh.radar.recently_seen": "нещодавно бачили",
  "mesh.radar.peer_hint": "Відкриває варіанти написати чи заплатити цьому піру",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "щойно",
  "mesh.peer.none": "Поблизу немає пірів",
  "mesh.peer.none_desc":
    "Інші пристрої з Airhop або bitchat у радіусі Bluetooth з’являються тут.",
  "mesh.peer.id_copied": "Ідентифікатор піра скопійовано",
  "mesh.peer.copy_id": "Копіювати ідентифікатор піра",
  "mesh.peer.their_name": "Називає себе {name}",
  "mesh.peer.in_range": "У радіусі",
  "mesh.peer.relay": "Вузол-релей",
  "mesh.peer.relay_body":
    "Радіо, яке хтось лишив увімкненим, щоб розширити mesh. Воно переносить повідомлення, яких не може прочитати. Тут немає кому писати.",
  "mesh.peer.send_dm": "Надіслати пряме повідомлення",
  "mesh.peer.message": "Повідомлення",
  "mesh.peer.send_sats": "Надіслати ecash",
  "mesh.peer.amount_placeholder": "Сума в сатах",
  "mesh.peer.amount_first": "Надіслати ecash, спершу введіть суму",
  "mesh.peer.cancel_send": "Скасувати надсилання ecash",
  "mesh.peer.view_peer": "Переглянути піра {name}",
  "mesh.peer.view_peer_online": "Переглянути піра {name}, онлайн",
  "mesh.peer.last_seen": "Востаннє бачили {ago} тому",
  "mesh.peer.send_amount": "Надіслати {amount} сатів",
  "mesh.peer.direct": "Пряме з’єднання",
  "mesh.peer.check_distance": "Перевірити відстань",
  "mesh.peer.checking": "Перевіряємо",
  "mesh.peer.no_reply": "Немає відповіді",
  "mesh.peer.no_reply_hint":
    "Можливо, вони перемістилися або їхній застосунок не відповідає",
  "mesh.peer.rtt": "{ms} мс",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Регіон",
  "mesh.level.province": "Область",
  "mesh.level.city": "Місто",
  "mesh.level.neighborhood": "Район",
  "mesh.level.block": "Квартал",
  "mesh.level.building": "Будівля",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Доступно до витрат",
  "wallet.balance.unit_hint": "Перемикає між сатоші та біткоїном",
  "wallet.balance.a11y": "Баланс {value} {unit}",
  "wallet.balance.locked":
    "Сховище гаманця заблоковано. Докази ecash зберігаються в зашифрованому файлі, ключ до якого живе у сховищі ключів пристрою, і його не вдалося відкрити. Розблокуйте пристрій і відкрийте Airhop знову.",
  "wallet.balance.tor_blocked":
    "Tor увімкнено, тож запити до мінта заблоковано: вони пішли б відкритою мережею і пов’язали б вашу IP-адресу з вашими доказами. Надсилання й отримання через mesh працює далі. Дозвольте трафік мінта в Налаштуваннях, Безпека.",
  "wallet.balance.unconfirmed_note": "{amount} ще не підтверджено мінтом",
  "wallet.balance.reserved_note": "{amount} відкладено для надсилання в дорозі",
  "wallet.balance.other_mint_note": "{amount} в іншому мінті",
  "wallet.balance.test_mint_note":
    "Містить іграшкові гроші з тестового мінта. Це не біткоїн, і вивести їх не можна.",
  "wallet.token": "Токен",
  "wallet.action.send": "Надіслати токен ecash",
  "wallet.action.send_disabled":
    "Надіслати токен ecash, недоступно за порожнього балансу",
  "wallet.action.receive": "Отримати токен ecash",
  "wallet.action.zap": "Надіслати zap контакту в Nostr",
  "wallet.action.zap_disabled":
    "Надіслати zap контакту в Nostr, недоступно за порожнього балансу",
  "wallet.action.add_mint": "Додати мінт Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Не вдалося зібрати токен",
  "wallet.send.title": "Надіслати ecash",
  "wallet.send.amount_in": "Сума в {unit}",
  "wallet.send.body":
    "Зібрано офлайн із доказів, які ви вже маєте. Нічого не покидає ваш баланс остаточно, доки ви не підтвердите, що токен дійшов.",
  "wallet.send.stale_fee_note":
    "Комісії востаннє перевіряли {days} днів тому. Якщо цей мінт відтоді їх підвищив, надсилання може коштувати трохи більше.",
  "wallet.send.fee_note":
    "{spend} {unit} піде з вашого балансу; додаткові {fee} покривають комісію мінта, яку інакше платили б вони",
  "wallet.send.qr_too_big":
    "Цей токен розбито на забагато монет, щоб він умістився в QR-код. Поділіться ним або скопіюйте, чи оновіть у мінті, щоб їх об’єднати.",
  "wallet.send.bearer_note":
    "Хто тримає цей рядок, той володіє грошима. Докази відкладено, а не витрачено: якщо він нікого не досягне, ви зможете забрати їх у розділі Очікують.",
  "wallet.send.qr_too_big_short":
    "Цей токен розбито на забагато монет, щоб він умістився в QR-код. Поділіться ним або скопіюйте.",
  "wallet.send.scan_note":
    "Хай відсканують це зі свого гаманця. Забрати назад можна, доки ви не позначите його як доставлений.",
  "wallet.send.mesh_note":
    "Токен іде як зашифроване пряме повідомлення через mesh. Інтернет не потрібен.",
  "wallet.send.no_peers_note":
    "Відкрийте вкладку Mesh, щоб знайти пристрої поблизу, або поділіться токеном іншим шляхом.",
  "wallet.send.send_to": "Надіслати {name}",
  "wallet.send.memo": "Примітка (необов’язкова, мандрує разом із токеном)",
  "wallet.send.building": "Збираємо…",
  "wallet.send.build": "Зібрати токен",
  "wallet.send.inexact_body":
    "Ваші докази не складуть офлайн рівно {amount} {unit}. Найменший токен, який ви можете зібрати, це {spend} {unit}, а офлайн решти не буває: додаткові {extra} {unit} дістануться одержувачу.\n\nОновлення в мінті, поки ви онлайн, розбило б ваші докази на номінали, які складаються рівно.",
  "wallet.send.send_amount": "Надіслати {amount}",
  "wallet.send.sent_to": "{amount} {unit} надіслано {name}",
  "wallet.send.sent_to_body":
    "{route} Забрати назад можна в розділі Очікують, доки ви не підтвердите, що вони це отримали, або доки мінт не скаже нам, що докази викуплено.",
  "wallet.send.copy_token": "Копіювати токен",
  "wallet.send.share_token": "Поділитися токеном",
  "wallet.send.open_in_wallet": "Відкрити цей токен в іншому гаманці",
  "wallet.send.open_in_wallet_short": "Відкрити в гаманці",
  "wallet.send.to_peer": "Надіслати токен піру поблизу",
  "wallet.send.to_peer_short": "Надіслати піру",
  "wallet.send.mark_delivered": "Позначити доставленим і завершити",
  "wallet.send.they_got_it": "Вони отримали",
  "wallet.send.keep_pending": "Лишити це надсилання в очікуванні",
  "wallet.send.decide_later": "Вирішити пізніше",
  "wallet.send.no_peers": "У радіусі немає пірів",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Це ваш власний платіж",
  "wallet.receive.own_payment_body":
    "Ці монети досі відкладено для надсилання, яке ви не завершили, тож брати нічого. Скористайтеся кнопкою Забрати на тому платежі, щоб повернути їх просто на баланс.",
  "wallet.receive.already_have": "Уже у вашому гаманці",
  "wallet.receive.already_have_body":
    "Кожен доказ у цьому токені вже зберігається тут, тож нічого не додалося. Баланси не змінилися.",
  "wallet.receive.stored_unconfirmed":
    "Збережено з {mint}, але ще не підтверджено мінтом ({reason}).",
  "wallet.receive.offline": "офлайн",
  "wallet.receive.redeemed_here":
    "Викуплено в {mint}. Ці докази тепер лише ваші: копія відправника більше не працює.",
  "wallet.receive.memo_quoted": "\n\n«{memo}»",
  "wallet.receive.redeemed_at":
    "Викуплено в {mint}. Тепер це доказово ваше: копія цього токена у відправника більше не працює.",
  "wallet.receive.stored_pending":
    "Збережено з {mint}, але мінт ще не підтвердив, що воно не витрачене{dleq}. Оновіть із вкладки Гаманець, щойно будете онлайн.",
  "wallet.receive.dleq_inline":
    " (підпис таки збігається, тож токен справжній)",
  "wallet.receive.dleq_ok": "Підпис мінта збігається, тож токен справжній.",
  "wallet.receive.dleq_uncached":
    "Ключів мінта тут немає, тож підпис не вдалося перевірити офлайн.",
  "wallet.receive.dleq_warning":
    "Доки ви не оновите онлайн, відправник у принципі міг витратити це деінде.",
  "wallet.receive.failed": "Не вдалося отримати",
  "wallet.receive.title": "Отримати ecash",
  "wallet.receive.body":
    "Вставте токен Cashu. Онлайн його одразу викуповують у мінті; офлайн його зберігають і підтверджують під час наступного оновлення.",
  "wallet.receive.scan": "Сканувати QR-код ecash",
  "wallet.receive.scan_short": "Сканувати QR",
  "wallet.receive.receiving": "Отримуємо…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap отримано від {from}… і викуплено у ваш гаманець.",
  "wallet.zap.title": "Надіслати zap особистості в Nostr",
  "wallet.zap.not_npub": "не npub",
  "wallet.zap.bad_key": "хибний ключ",
  "wallet.zap.invalid_pubkey": "Недійсний відкритий ключ",
  "wallet.zap.invalid_pubkey_body":
    "Введіть npub1… або 64-символьний шістнадцятковий відкритий ключ Nostr.",
  "wallet.zap.sent": "Nutzap надіслано",
  "wallet.zap.failed": "Zap не вдався",
  "wallet.zap.body":
    "Якщо вони публікують дані nutzap за NIP-61, ecash прив’язується до їхнього ключа, тож ніхто інший його не витратить, і забрати його назад не вийде. Якщо ні, він піде як токен, який можна забрати. Вам скажуть, що саме сталося.",
  "wallet.zap.contact": "Надіслати zap {name}",
  "wallet.zap.pubkey_placeholder": "npub1… або 64 шістнадцяткові символи",
  "wallet.zap.sending": "Надсилаємо…",
  "wallet.nostr.copied_body":
    "Дайте це комусь, і вони зможуть надіслати вам zap з Airhop чи будь-якого іншого гаманця Nostr, без Bluetooth.",
  "wallet.nostr.copy_key":
    "Скопіюйте свій ключ Nostr, щоб люди могли надсилати вам zap",
  "wallet.nostr.your_key": "Ваш ключ Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Мінт додано",
  "wallet.mint.add_failed": "Не вдалося додати мінт",
  "wallet.mint.added_named": "{name} додано",
  "wallet.mint.added_body":
    "{mint} випускає {units}. Його ключі зберігаються на цьому пристрої, тож токени від нього тепер можна перевірити навіть без інтернету.",
  "wallet.mint.remove_plain":
    "Вилучити {mint} з вашого гаманця? Збережені ключі підуть разом із ним, тож токени від нього більше не перевірити офлайн.",
  "wallet.mint.title": "Мінти",
  "wallet.mint.none": "Мінта ще немає",
  "wallet.mint.none_desc":
    "Мінт випускає та викуповує ваш ecash. Додайте один, щоб поповнити через Lightning, або просто отримайте токен, і його мінт додасться сам.",
  "wallet.mint.add": "Додати мінт",
  "wallet.mint.add_body":
    "Мінт тримає біткоїн, що стоїть за вашим ecash, тож виберіть той, якому довірили б баланс, що зберігаєте там. URL перевіряється перед збереженням. Запустіть власний на Nutshell, якщо волієте нікому не довіряти.",
  "wallet.mint.consolidate_body":
    "Токен завжди може назвати лише один мінт, тож баланс, розкиданий по кількох, не заплатить суму більшу за ту, що тримає найбільший із них. Airhop може його перенести: кожен інший мінт оплачує рахунок Lightning, виставлений тим, який ви оберете. Це коштує невелику комісію за маршрутизацію і потребує інтернету.",
  "wallet.mint.add_short": "Додати мінт",
  "wallet.mint.checking": "Перевіряємо…",
  "wallet.mint.remove_with_balance": "Вилучити мінт із балансом?",
  "wallet.mint.remove": "Вилучити мінт",
  "wallet.mint.delete_anyway": "Усе одно видалити",
  "wallet.mint.consolidate": "Перенести всі баланси в один мінт",
  "wallet.mint.confirm_with": "Підтвердити докази в {mint}",
  "wallet.mint.remove_a11y": "Вилучити {mint}",
  "wallet.mint.available_amount": "Доступно {amount} {unit}",
  "wallet.mint.split_across":
    "Баланс розкидано по {count} мінтах. Перенесіть його в один.",
  "wallet.mint.move_everything_to": "Перенести все в {mint}",
  "wallet.mint.consolidate_title": "Перенести в один мінт",
  "wallet.mint.moving": "Переносимо…",
  "wallet.mint.move": "Перенести",
  "wallet.mint.moved": "Перенесено",
  "wallet.mint.moved_body":
    "{amount} {unit} тепер лежать у {mint}, після {fees} {unit} комісій за маршрутизацію Lightning.",
  "wallet.mint.nothing_moved": "Нічого не перенесено",
  "wallet.mint.destination": "· призначення",
  "wallet.mint.will_move": "· буде перенесено",
  "wallet.mint.issued_by": "Випущено",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Поповнення гаманця Airhop",
  "wallet.ln.invoice_failed": "Не вдалося створити рахунок",
  "wallet.ln.price_failed": "Не вдалося оцінити цей рахунок",
  "wallet.ln.paid": "Оплачено",
  "wallet.ln.deposit_credited":
    "Рахунок оплачено, і {mint} випустив {amount} {unit}. Цей баланс підтверджено: ви можете витрачати його офлайн просто зараз.",
  "wallet.ln.withdrawn":
    "{paid} сатів оплачено через Lightning. Мінт узяв {fee} сатів комісії за маршрутизацію.",
  "wallet.ln.withdrawn_with_change":
    "{paid} сатів оплачено через Lightning. Мінт узяв {fee} сатів комісії за маршрутизацію і повернув {change} сатів резерву на ваш баланс.",
  "wallet.ln.payment_failed": "Платіж не вдався",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Оберніть сати Lightning на ecash, який можна витрачати офлайн, або виведіть ecash на будь-який рахунок Lightning. Обидва потребують інтернету та мінта.",
  "wallet.ln.deposit_body":
    "Мінт дає вам рахунок. Оплатіть його з будь-якого гаманця Lightning, і сати повернуться як ecash, який можна витрачати офлайн.",
  "wallet.ln.pay_invoice_for":
    "Оплатіть цей рахунок на {amount} {unit}. Гаманець стежить за платежем і випустить ваш ecash сам.",
  "wallet.ln.expired_body":
    "Термін дії цього рахунку минув. Якщо ви його вже оплатили, баланс зарахується сам.",
  "wallet.ln.waiting_expires": "Чекаємо на оплату · спливає через {countdown}",
  "wallet.ln.withdraw_body":
    "Вставте рахунок bolt11, і мінт оплатить його з вашого ecash. Спершу вам назвуть резерв на маршрутизацію; те, чого маршрутизація не використає, повернеться на баланс.",
  "wallet.ln.up_to": "до {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Оплатити {amount} {unit}",
  "wallet.ln.deposit": "Поповнити сатами через Lightning",
  "wallet.ln.deposit_short": "Поповнити",
  "wallet.ln.withdraw": "Вивести на рахунок Lightning",
  "wallet.ln.withdraw_short": "Вивести",
  "wallet.ln.deposit_title": "Поповнення через Lightning",
  "wallet.ln.amount_placeholder": "Сума в сатах",
  "wallet.ln.requesting": "Запитуємо…",
  "wallet.ln.get_invoice": "Отримати рахунок",
  "wallet.ln.copy_invoice": "Копіювати рахунок",
  "wallet.ln.open_wallet": "Відкрити в гаманці Lightning",
  "wallet.ln.open_wallet_short": "Відкрити в гаманці",
  "wallet.ln.waiting": "Чекаємо на оплату…",
  "wallet.ln.new_invoice": "Створити новий рахунок",
  "wallet.ln.new_invoice_short": "Новий рахунок",
  "wallet.ln.withdraw_title": "Виведення на Lightning",
  "wallet.ln.scan_invoice": "Сканувати QR-код рахунку Lightning",
  "wallet.ln.paid_from": "Оплачено з",
  "wallet.ln.invoice": "Рахунок",
  "wallet.ln.routing_reserve": "Резерв на маршрутизацію",
  "wallet.ln.reserved": "Відкладено з балансу",
  "wallet.ln.paying": "Оплачуємо…",
  "wallet.ln.get_quote": "Отримати розрахунок",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Резервна копія",
  "wallet.backup.setup_failed": "Не вдалося налаштувати резервну копію",
  "wallet.backup.on": "Резервну копію увімкнено",
  "wallet.backup.on_body":
    "Ваш баланс тепер можна відбудувати з тих дванадцяти слів.\n\nУсе, що вам дав хтось інший, лишається поза цією фразою, доки ви не оновите в мінті, а для відновлення потрібен ваш перелік мінтів, тож тримайте його записаним поруч зі словами.",
  "wallet.backup.no_phrase": "Фразу не збережено",
  "wallet.backup.no_phrase_body":
    "Не вдалося прочитати фразу відновлення зі сховища ключів пристрою. Розблокуйте пристрій і спробуйте ще раз.",
  "wallet.backup.replace_title": "Замінити вашу теперішню фразу?",
  "wallet.backup.replace_body":
    "У вас уже є фраза відновлення. Відновлення іншої замінить її. Монети, які стара фраза вже покривала, лишаться придатними до витрат на цьому пристрої, але перестануть відновлюватися, тож переконайтеся, що старі слова записані, перш ніж продовжувати.",
  "wallet.backup.replace": "Замінити",
  "wallet.backup.invalid_phrase": "Ця фраза недійсна",
  "wallet.backup.invalid_phrase_body":
    "Фраза має вбудовану контрольну суму, і ця її не проходить. Пошукайте слово з друкарською помилкою, пропущене чи переставлене.",
  "wallet.backup.not_bip39":
    "Це не слова BIP-39: {words}. Перевірте написання.",
  "wallet.backup.add_mint_first": "Спершу додайте мінт",
  "wallet.backup.add_mint_first_body":
    "Відновлення працює так: воно питає мінт, які монети той підписав для вас, тож йому треба знати, який мінт питати. Додайте мінти, якими ви користувалися, а тоді відновлюйте.",
  "wallet.backup.restore_failed": "Відновлення не вдалося",
  "wallet.backup.phrase": "Фраза відновлення",
  "wallet.backup.state_unconfirmed":
    "Резервну копію увімкнено, але не підтверджено",
  "wallet.backup.state_off": "Резервну копію вимкнено",
  "wallet.backup.badge_on": "Увімкнено",
  "wallet.backup.badge_unconfirmed": "Не підтверджено",
  "wallet.backup.badge_off": "Вимкнено",
  "wallet.backup.view": "Переглянути фразу відновлення",
  "wallet.backup.setup": "Налаштувати фразу відновлення",
  "wallet.backup.view_short": "Переглянути фразу",
  "wallet.backup.setup_short": "Налаштувати",
  "wallet.backup.restore": "Відновити гаманець із фрази відновлення",
  "wallet.backup.restore_short": "Відновити",
  "wallet.backup.setup_title": "Налаштувати фразу відновлення",
  "wallet.backup.on_body_short":
    "Ваш баланс можна відбудувати на новому пристрої з ваших дванадцяти слів.",
  "wallet.backup.unconfirmed_body":
    "Ви ніколи не підтверджували, що записали їх. Просто зараз слова існують лише на цьому телефоні, а саме це резервна копія й має пережити. Перегляньте фразу та запишіть її.",
  "wallet.backup.not_covered":
    "{amount} ще не покрито. Монети, які вам дали, несуть секрети того, хто їх надіслав, тож вони потрапляють під вашу фразу лише після обміну. Оновіть мінт, щоб їх убезпечити.",
  "wallet.backup.off_body":
    "Ваш ecash існує лише на цьому телефоні. Якщо ви його втратите, гроші не поверне ніхто, зокрема й ви. Фраза відновлення — це дванадцять слів, які можуть відбудувати ваш баланс будь-де.",
  "wallet.backup.about_to_see":
    "Зараз ви побачите дванадцять слів. Вони і є гроші.",
  "wallet.backup.exact_order":
    "Дванадцять слів, саме в цьому порядку. Хто їх має, той має ваш баланс.",
  "wallet.backup.verify_body":
    "Фраза, яку ніхто не записав, гірша за відсутність фрази, бо вона схожа на страхувальну сітку, якої немає. Два слова для підтвердження.",
  "wallet.backup.verify_mismatch":
    "Це не збігається. Перевірте свою записану копію.",
  "wallet.backup.restore_body":
    "Введіть дванадцять слів. Airhop заново виводить ваші монети й питає кожен мінт, які з них він підписав, тож баланс повертається із записів, що їх веде мінт.",
  "wallet.backup.warn_secret":
    "Будь-хто, хто їх прочитає, може забрати ваш баланс. Не робіть із них знімка екрана й не зберігайте їх на цьому телефоні.",
  "wallet.backup.warn_paper":
    "Запишіть їх на папері й тримайте в безпечному місці. Airhop не покаже їх вам знову, якщо телефон зникне.",
  "wallet.backup.warn_scope":
    "Вони відбудовують лише ваш ecash. Ваша особистість, чати та контакти не покриваються.",
  "wallet.backup.warn_mints":
    "Відновлення мусить питати мінт, які монети він підписав, тож запишіть свій перелік мінтів поруч зі словами.",
  "wallet.backup.preparing": "Готуємо…",
  "wallet.backup.show_phrase": "Показати мою фразу",
  "wallet.backup.your_phrase": "Ваша фраза відновлення",
  "wallet.backup.write_down": "Запишіть їх",
  "wallet.backup.copy_phrase": "Копіювати фразу відновлення в буфер обміну",
  "wallet.backup.copy_clipboard": "Копіювати в буфер обміну",
  "wallet.backup.written_down": "Я їх записав",
  "wallet.backup.check_copy": "Перевірте свою копію",
  "wallet.backup.confirm": "Підтвердити",
  "wallet.backup.restore_title": "Відновлення з фрази",
  "wallet.backup.phrase_placeholder": "дванадцять слів, розділених пробілами",
  "wallet.backup.no_mints_yet":
    "Мінтів ще не додано. Відновлення мусить питати конкретний мінт, тож спершу додайте ті, якими ви користувалися.",
  "wallet.backup.scanning": "Переглядаємо…",
  "wallet.backup.restore_progress": "{mint} · набір ключів {step} із {total}",
  "wallet.backup.will_scan":
    "Буде переглянуто: {mints}. Мінт, якого ви не додали, ніколи не питають, тож його баланс лишається невидимим.",
  "wallet.backup.word_n": "Слово {position}",
  "wallet.backup.unreachable_mints":
    "Не вдалося дістатися: {mints}. Баланс, що там лежить, нікуди не подівся. Спробуйте ще раз за кращого з’єднання.",
  "wallet.backup.nothing_recovered":
    "З переглянутих мінтів нічого не відновлено.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Позначити як отримане?",
  "wallet.delivered.body":
    "Це остаточно звільняє {amount} {unit}. Якщо насправді воно так і не дійшло, забрати його ви вже не зможете.",
  "wallet.delivered.body_generic":
    "Це остаточно звільняє відкладену суму. Якщо насправді вона так і не дійшла, забрати її ви вже не зможете.",
  "wallet.delivered.cancel": "Ще ні",
  "wallet.delivered.confirm": "Вони отримали",
  "wallet.reclaim.title": "Забрати цей токен?",
  "wallet.reclaim.body":
    "{amount} {unit} повернуться на ваш баланс. Робіть це, лише якщо токен нікого не досяг: якщо рядок уже в них, гроші дістануться тому, хто перший викупить його в мінті, а це можуть бути вони.",
  "wallet.reclaim.keep": "Лишити в очікуванні",
  "wallet.reclaim.confirm": "Забрати",
  "wallet.copied.token_body":
    "Токен у вашому буфері обміну. Він лишається відкладеним тут, доки ви не позначите його доставленим, тож ви зможете вставити його знову, якщо перша спроба не вдасться.",
  "wallet.copied.phrase_body":
    "Вставте її в менеджер паролів, а тоді очистіть буфер обміну. Інші застосунки можуть читати буфер, а за деяких налаштувань він синхронізується з вашими іншими пристроями.",
  "wallet.refresh.failed": "Оновлення не вдалося",
  "wallet.refresh.partly": "Оновлено частково",
  "wallet.refresh.done": "Оновлено",
  "wallet.refresh.unreachable":
    "Не вдалося дістатися {mints}. Усе інше актуальне.",
  "wallet.refresh.swapped":
    "{amount} {unit} підтверджено й обміняно на свіжі докази.",
  "wallet.refresh.secured":
    "{amount} {unit} тепер покриває ваша фраза відновлення.",
  "wallet.refresh.all_confirmed": "Усе тут уже було підтверджено мінтом.",
  "wallet.pending.title": "Очікують",
  "wallet.pending.reserved_desc":
    "Зібрано й відкладено, доставлення не підтверджено. Докази тримають поза вашим балансом, щоб їх не витратили двічі.",
  "wallet.pending.locked_desc":
    "Уже прив’язано до ключа одержувача, тож витратити це може лише він. Просто воно ще до нього не дійшло. Поділіться токеном, щоб завершити.",
  "wallet.pending.show_qr": "Показати цей токен як QR-код",
  "wallet.pending.copy_again": "Скопіювати токен ще раз",
  "wallet.pending.share_again": "Поділитися токеном ще раз",
  "wallet.pending.mark_delivered": "Позначити цей токен доставленим",
  "wallet.pending.delivered": "Доставлено",
  "wallet.pending.reclaim_into": "Забрати цей токен на ваш баланс",
  "wallet.activity.title": "Активність",
  "wallet.activity.none": "Поки нічого",
  "wallet.activity.none_desc":
    "Платежі, які ви надсилаєте й отримуєте, з’являються тут, найновіші згори, разом із мінтом і комісією кожного з них.",
  "wallet.activity.show_fewer": "Показати менше платежів",
  "wallet.activity.show_less": "Показати менше",
  "wallet.activity.received_unconfirmed": "Отримано, не підтверджено",
  "wallet.activity.received": "Отримано",
  "wallet.activity.receive_failed": "Отримання не вдалося",
  "wallet.activity.reclaimed": "Забрано",
  "wallet.activity.send_failed": "Надсилання не вдалося",
  "wallet.activity.sent": "Надіслано",
  "wallet.activity.status_pending": "очікує",
  "wallet.activity.status_failed": "не вдалося",
  "wallet.activity.status_reclaimed": "забрано",
  "wallet.activity.status_expired": "термін минув",
  "wallet.activity.ln_deposit": "Поповнення через Lightning",
  "wallet.activity.ln_withdrawal": "Виведення через Lightning",
  "wallet.activity.nutzap_received": "Nutzap отримано",
  "wallet.activity.spent_removed": "Витрачені докази вилучено",
  "wallet.activity.refreshed": "Докази оновлено",
  "wallet.activity.refreshing": "Оновлюємо докази",
  "wallet.activity.just_now": "щойно",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mesh офлайн",
  "wallet.mesh_offline_body":
    "Служба mesh не працює, тож немає кому передати токен. Він лишається відкладеним у розділі Очікують.",
  "wallet.xfer.route_mesh": "Передано просто на їхній пристрій через mesh.",
  "wallet.xfer.route_nostr":
    "Вони були поза радіусом Bluetooth, тож воно пішло через інтернет.",
  "wallet.xfer.route_courier":
    "Зараз до них немає шляху. Інші пристрої понесуть це і доставлять, коли хтось із них їх дістане.",
  "wallet.xfer.route_queued":
    "Вони ще недосяжні. Воно в черзі й піде, щойно вони стануть досяжними.",
  "wallet.xfer.mesh_offline_body":
    "Служба mesh не працює, тож передати токен ніяк. Нічого не списано.",
  "wallet.xfer.could_not_send": "Не вдалося надіслати",
  "wallet.xfer.inexact_body":
    "Ваші докази не складуть офлайн рівно {amount} {unit}. Найменший токен, який ви можете зібрати, це {spend} {unit}, а додаткові {extra} {unit} дістануться їм без змоги повернути їх назад.\n\nОновлення в мінті, поки ви онлайн, розбиває ваші докази на номінали, які складаються рівно.",
  "wallet.xfer.send_amount": "Надіслати {amount}",
  "wallet.xfer.mesh_offline": "Mesh офлайн",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Прив’язано до їхнього ключа й опубліковано в Nostr. Це їхнє, онлайн вони чи ні.",
  "wallet.pay.rail_nutzap_dm":
    "Прив’язано до їхнього ключа. Релей це не прийняв, тож воно пішло до них повідомленням.",
  "wallet.pay.rail_nutzap_undelivered":
    "Прив’язано до їхнього ключа, але понести це поки ніхто не зміг. Воно в черзі, а токен у розділі Очікують.",
  "wallet.pay.final":
    "Прив’язані платежі забрати не можна: витратити ці монети тепер здатен лише їхній ключ.",
  "wallet.pay.reclaimable":
    "Забрати це можна з вкладки Гаманець, доки ви не підтвердите, що воно дійшло.",
  "wallet.pay.why": "Надіслано цим шляхом, бо {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} для {name}",
  "wallet.pay.thread_receipt":
    "Ви надіслали {amount} {unit}, прив’язані до їхнього ключа.",
  "wallet.pay.title": "Надіслати ecash",
  "wallet.pay.to": "Для {name}",
  "wallet.pay.amount": "Сума в сатах",
  "wallet.pay.memo": "Нотатка (необов’язкова, публічна)",
  "wallet.pay.send": "Надіслати",
  "wallet.pay.sending": "Надсилаємо…",
  "wallet.pay.action": "Надіслати ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Доступ до камери",
  "wallet.scan.camera_purpose": "сканувати QR-код ecash",
  "wallet.scan.photo_label": "Доступ до фото",
  "wallet.scan.photo_purpose": "прочитати QR ecash із зображення",
  "wallet.scan.no_token": "На тому зображенні не знайдено токена ecash.",
  "wallet.scan.no_invoice": "На тому зображенні не знайдено рахунку Lightning.",
  "wallet.scan.unreadable": "Не вдалося прочитати те зображення.",
  "wallet.scan.camera_failed":
    "Не вдалося запустити камеру. Закрийте інші застосунки камери й спробуйте ще раз.",
  "wallet.scan.close": "Закрити сканер",
  "wallet.scan.on_device":
    "Це читається на цьому пристрої; нічого нікуди не надсилається.",
  "wallet.scan.aim_token": "Наведіть на QR-код ecash.",
  "wallet.scan.aim_invoice": "Наведіть на QR-код рахунку Lightning.",
  "wallet.scan.title_token": "Сканування ecash",
  "wallet.scan.title_invoice": "Сканування рахунку",
  "wallet.scan.desc_token":
    "Прочитайте токен Cashu з іншого гаманця. Працює з будь-яким гаманцем Cashu, не лише з Airhop.",
  "wallet.scan.desc_invoice":
    "Прочитайте рахунок Lightning, щоб оплатити його зі свого балансу.",
  "wallet.scan.use_camera_a11y": "Сканувати камерою",
  "wallet.scan.use_camera": "Скористатися камерою",
  "wallet.scan.pick_image_a11y": "Прочитати QR-код зі збереженого зображення",
  "wallet.scan.pick_image": "Вибрати з фото",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Що таке Cashu?",
  "wallet.explain.intro":
    "Cashu — це ecash для біткоїна. Токен — це рядок, що вартий грошей для того, хто його тримає, підписаний мінтом наосліп, щоб мінт не бачив, хто що витратив. Без облікових записів, без входу.",
  "wallet.explain.send": "Надіслати",
  "wallet.explain.send_desc":
    "Обертає суму на токен, який ви можете передати піру поблизу через Bluetooth або надіслати текстом. Працює без інтернету. Докази лишаються відкладеними, доки ви не підтвердите, що воно дійшло.",
  "wallet.explain.receive": "Отримати",
  "wallet.explain.receive_desc":
    "Вставте токен, щоб додати його. Онлайн його одразу обмінюють у мінті, що робить його доказово вашим. Офлайн його зберігають і позначають непідтвердженим, доки ви не оновите.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Платить особистості в Nostr. Якщо вони публікують дані nutzap за NIP-61, ecash прив’язується до їхнього ключа, тож витратити його можуть лише вони. Інакше воно відступає до зашифрованого прямого повідомлення. Потребує інтернету.",
  "wallet.explain.add_mint": "Додати мінт",
  "wallet.explain.add_mint_desc":
    "Зберігає мінт, що випускає та викуповує ваш ecash, і тримає його відкриті ключі, щоб токени від нього можна було перевірити офлайн. Виберіть мінт, якому довірили б баланс, що зберігаєте там.",
  "wallet.explain.phrase": "Фраза відновлення",
  "wallet.explain.phrase_desc":
    "Ваші монети виводяться з дванадцяти слів, які гаманець створює на початку, тож новий телефон може відбудувати баланс, спитавши ваші мінти, які монети вони підписали. Доки ви їх не переглянете й не запишете, вони існують лише на цьому телефоні.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Гаманець заблоковано",
  "wallet.err.mint_unreachable": "Мінт недосяжний",
  "wallet.err.tor_blocked": "Заблоковано, поки увімкнено Tor",
  "wallet.err.insufficient": "Недостатньо балансу",
  "wallet.err.exact_amount": "Не вдається надіслати саме таку суму",
  "wallet.err.no_mint": "Немає мінта",
  "wallet.err.mint_unsupported": "Мінт так не вміє",
  "wallet.err.mint_refused": "Мінт відмовив",
  "wallet.err.unreadable": "Нечитабельний токен",
  "wallet.err.rejected": "Токен відхилено",
  "wallet.err.already_spent": "Уже витрачено",
  "wallet.err.change_pending": "Оплачено, решта очікує",
  "wallet.svc.mint_unreachable": "Не вдалося дістатися мінта.",
  "wallet.svc.tor_ios": "На iOS запити до мінта не йдуть через Tor.",
  "wallet.svc.tor_ios_body":
    "Arti загортає лише вебсокети Nostr, тож цей запит дістався б мінта відкритою мережею і пов’язав би вашу IP-адресу з цими доказами. Дозвольте це в Налаштуваннях > Безпека або спершу вимкніть Tor. Надсилання й отримання ecash через mesh працює далі.",
  "wallet.svc.tor_paused": "Tor увімкнено, але з’єднання немає.",
  "wallet.svc.tor_paused_body":
    "Orbot перестав спрямовувати трафік, тож цей запит дістався б мінта відкритою мережею і пов’язав би вашу IP-адресу з цими доказами. Запустіть Orbot знову або вимкніть Tor. Надсилання й отримання ecash через mesh працює далі.",
  "wallet.svc.keys_uncached":
    "Ключі цього мінта не збережено на цьому пристрої.",
  "wallet.svc.keys_uncached_body":
    "Відкрийте гаманець один раз онлайн, щоб їх отримати.",
  "wallet.svc.phrase_invalid": "Ця фраза відновлення недійсна.",
  "wallet.svc.phrase_invalid_body":
    "Пошукайте слово з друкарською помилкою або пропущене. Фраза має вбудовану контрольну суму, тож одне хибне слово робить недійсною всю.",
  "wallet.svc.need_mint": "Спершу додайте принаймні один мінт.",
  "wallet.svc.need_mint_body":
    "Відновлення працює так: воно питає мінт, які монети той підписав для вас, тож йому треба знати, який мінт питати.",
  "wallet.svc.restored": "Відновлено з фрази відновлення",
  "wallet.svc.storage_locked": "Сховище гаманця заблоковано.",
  "wallet.svc.storage_locked_body":
    "Airhop тримає докази ecash у зашифрованому файлі, ключ до якого живе у сховищі ключів пристрою. Розблокуйте пристрій і відкрийте застосунок знову.",
  "wallet.svc.bad_url": "Це недійсна URL-адреса.",
  "wallet.svc.needs_https": "URL мінта має починатися з https://.",
  "wallet.svc.refuse_http":
    "Відмовляємося користуватися мінтом через звичайний http.",
  "wallet.svc.refuse_http_body":
    "Будь-хто на шляху мережі міг би прочитати чи змінити ваші докази. Скористайтеся мінтом із https://.",
  "wallet.svc.mint_not_saved": "Не вдалося зберегти мінт.",
  "wallet.svc.unreadable_token": "Це не читабельний токен Cashu.",
  "wallet.svc.unreadable_token_body":
    "Токени починаються з cashuA або cashuB. Перевірте, чи нічого не обрізалося під час копіювання.",
  "wallet.svc.wrong_mint": "Цей токен не підписаний мінтом, який він називає.",
  "wallet.svc.already_spent": "Ці докази вже витрачено.",
  "wallet.svc.already_spent_body":
    "Той, хто надіслав цей токен, викупив його першим або надіслав той самий токен ще комусь.",
  "wallet.svc.receiving_offline": "отримання офлайн",
  "wallet.svc.amount_positive": "Введіть суму, більшу за нуль.",
  "wallet.svc.coins_raced": "Ті монети щойно використав інший платіж.",
  "wallet.svc.coins_raced_body":
    "Нічого не списано. Спробуйте ще раз, і гаманець вибере інший набір.",
  "wallet.svc.no_ecash": "Ecash ще немає.",
  "wallet.svc.no_ecash_body":
    "Додайте мінт і поповніть через Lightning або отримайте токен від когось.",
  "wallet.svc.split_across_mints": "Ваш баланс розкидано по мінтах.",
  "wallet.svc.mint_says_spent": "Мінт повідомив, що ці докази вже витрачено.",
  "wallet.svc.issue_against_invoice": "випустити ecash під рахунок Lightning",
  "wallet.svc.pay_invoice": "оплатити рахунок Lightning",
  "wallet.svc.unknown_deposit": "Невідоме поповнення.",
  "wallet.svc.invoice_expired_before":
    "Термін дії рахунку минув, перш ніж його оплатили.",
  "wallet.svc.invoice_expired": "Термін дії того рахунку минув.",
  "wallet.svc.invoice_unpaid": "Рахунок ще не оплачено.",
  "wallet.svc.payment_unknown":
    "Стан платежу невідомий; перевіримо ще раз під час наступного оновлення.",
  "wallet.svc.melt_change_pending": "Ваш рахунок оплачено.",
  "wallet.svc.melt_change_pending_body":
    "Мінт ще не повернув невикористану комісію за маршрутизацію. Її заберуть самі під час наступного оновлення, і тим часом нічого не втрачається.",
  "wallet.svc.mint_did_not_pay":
    "Мінт не оплатив цей рахунок. Ваш баланс не змінився.",
  "wallet.svc.not_an_invoice": "Це не рахунок Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Вставте рахунок bolt11, що починається з lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Недостатньо балансу для цього рахунку.",
  "wallet.svc.coins_raced_invoice_body":
    "Нічого не списано, і рахунок не оплачено. Спробуйте ще раз.",
  "wallet.svc.same_mint": "Виберіть інший мінт призначення.",
  "wallet.svc.same_mint_body":
    "Джерело й призначення — той самий мінт, тож переносити нічого.",
  "wallet.svc.quote_failed_retried":
    "Розрахунок не вдався, об’єднання повторено",
  "wallet.svc.amount_unfit_retried": "Сума не підійшла, об’єднання повторено",
  "wallet.svc.cannot_size": "Не вдалося визначити обсяг цього перенесення.",
  "wallet.svc.insufficient_at_mint": "Недостатньо балансу в {mint}.",
  "wallet.svc.inexact_title":
    "Ваші докази не складуть офлайн рівно {amount} {unit}.",
  "wallet.svc.inexact_detail":
    "Найменший токен, який ви можете надіслати, це {spend} {unit}. Офлайн решти не буває, тож додаткові {extra} {unit} дістануться одержувачу.",
  "wallet.svc.no_single_mint":
    "Жоден окремий мінт не тримає {amount} {unit}. Ecash із різних мінтів не поєднати в один токен: спершу зведіть його в одному мінті або надішліть окремими сумами.",
  "wallet.svc.have_tried_send":
    "У вас {total} {unit}, а ви спробували надіслати {amount}.",
  "wallet.svc.invoice_needs":
    "Цей рахунок потребує {total} {unit} разом із резервом на маршрутизацію, а у вас {balance}.",
  "wallet.svc.nothing_to_move": "У {mint} немає {unit} для перенесення.",
  "wallet.svc.consolidate_memo": "Зведення з {mint}",
  "wallet.svc.cannot_size_detail":
    "Після комісій за маршрутизацію Lightning {from} не може перенести корисну суму до {to}. Спробуйте натомість перенести конкретну меншу суму.",
  "wallet.svc.mint_cannot": "{mint} не може {action}.",
  "wallet.svc.no_nut": "Мінт не оголошує NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Той платіж називає мінт, яким ви не користуєтеся.",
  "wallet.svc.unknown_mint_body":
    "Додайте мінт самі, якщо йому довіряєте; нічого не викуповується з мінта, якого ви не вибрали.",
  "wallet.svc.no_relay": "немає з’єднання з релеєм",
  "wallet.svc.no_shared_mint": "немає спільного мінта з достатнім балансом",
  "wallet.svc.no_nutzap_info":
    "одержувач не опублікував дані nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Прив’язано до їхнього ключа, але ще не доставлено. Поділіться токеном із цієї операції, щоб її завершити.",
  "wallet.svc.swap_lost":
    "Мінт так і не завершив цей обмін, тож під нього нічого не випущено.",
  "wallet.svc.swap_unreadable":
    "Цей обмін збережено у вигляді, який ця версія не може відтворити.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Підтверджено через QR",
  "contacts.qr.keys_unverified": "Ключі отримано, не підтверджено",
  "contacts.qr.not_verified": "Ще не підтверджено",
  "contacts.qr.message": "Повідомлення",
  "contacts.qr.add": "Додати контакт",
  "contacts.qr.scan_title": "Сканувати QR-код",
  "contacts.qr.aim": "Наведіть камеру на їхній QR-код",
  "contacts.qr.add_desc": "Дістаньтеся до того, кого немає поблизу в mesh.",
  "contacts.qr.peer_id_hint":
    "Ідентифікатор піра має 16 символів. Код контакту починається з airhop:.",
  "contacts.qr.or_scan": "або скануйте їхній QR",
  "contacts.qr.trust_note":
    "Лише QR, який ви скануєте камерою, підтверджує їхній ключ. Вставлений код несе їхні ключі, але не доказ, що він походить від них.",
  "contacts.qr.peer_id": "Ідентифікатор піра або код контакту",
  "contacts.qr.peer_id_placeholder": "Вставте ідентифікатор або код контакту",
  "contacts.qr.scan_camera_a11y": "Сканувати QR-код камерою",
  "contacts.qr.scan_camera_desc": "Скористайтеся камерою",
  "contacts.qr.upload_a11y": "Завантажити зображення QR із галереї",
  "contacts.qr.upload": "Завантажити з галереї",
  "contacts.qr.upload_desc": "Виберіть збережене зображення QR",
  "contacts.qr.scan_a11y": "Додати контакт, сканувавши QR-код",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Вставте 16-символьний ідентифікатор піра, посилання airhop://peer/… або код контакту.",
  "contacts.scan.camera_label": "Доступ до камери",
  "contacts.scan.camera_purpose": "сканувати QR-код контакту",
  "contacts.scan.camera_needed":
    "Щоб сканувати, потрібен доступ до камери. Ви все одно можете додати за ідентифікатором піра.",
  "contacts.scan.camera_failed":
    "Не вдалося запустити камеру. Закрийте інші застосунки камери й спробуйте ще раз.",
  "contacts.scan.photo_label": "Доступ до фото",
  "contacts.scan.photo_purpose": "сканувати збережений QR-код",
  "contacts.scan.photo_needed":
    "Щоб вибрати зображення, потрібен доступ до фото. Ви все одно можете додати за ідентифікатором піра.",
  "contacts.scan.no_qr": "На тому зображенні не знайдено QR-коду Airhop.",
  "contacts.scan.unreadable": "Не вдалося прочитати QR-код із того зображення.",
  "contacts.scan.bitchat_expired":
    "Термін дії того коду bitchat минув. Попросіть їх відкрити свій QR знову.",
  "contacts.scan.tampered":
    "Цей QR-код недійсний: його ідентифікатор піра не збігається з ключами. Можливо, його підмінили.",
  "contacts.scan.already_added": "Уже у ваших контактах",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Чекаємо на доступ до камери…",
  "contacts.verify.camera_off": "Камеру вимкнено",
  "contacts.verify.open_settings": "Відкрити Налаштування",
  "contacts.verify.verified": "Підтверджено",
  "contacts.verify.different": "Інший контакт",
  "contacts.verify.scan_again": "Сканувати ще раз",
  "contacts.verify.failed": "Не вдалося підтвердити",
  "contacts.verify.done": "Готово",
  "contacts.verify.title": "Підтвердити {name}",
  "contacts.verify.aim": "Наведіть камеру на їхній QR-код",
  "contacts.verify.camera_off_body":
    "Увімкніть доступ до камери в Налаштуваннях, щоб підтвердити через QR.",
  "contacts.verify.match_body":
    "Ключ {name} збігається. Цьому контакту можна довіряти.",
  "contacts.verify.different_body":
    "Цей QR належить комусь іншому. Попросіть {name} показати власний код.",
  "contacts.verify.tampered_body":
    "Цей QR виглядає підміненим: його ідентифікатор не збігається з ключем.",
  "contacts.verify.choose_title": "Як хочете перевірити?",
  "contacts.verify.choose_body":
    "Обидва способи підтверджують, що ключі на цьому телефоні справді належать {name}.",
  "contacts.verify.method_scan": "Сканувати їхній код",
  "contacts.verify.method_scan_sub": "Вони поруч із вами",
  "contacts.verify.method_compare": "Порівняти код",
  "contacts.verify.method_compare_sub":
    "Прочитайте його одне одному під час дзвінка",
  "contacts.verify.no_keys":
    "Для цього контакту ще немає ключів. Напишіть їм або скануйте їхній код, коли зустрінетеся.",
  "contacts.verify.compare_title": "Прочитайте це одне одному",
  "contacts.verify.compare_body":
    "{name} бачить ті самі шість слів. Якщо вони збігаються, ви обоє знаєте, що ключі справжні.",
  "contacts.verify.codes_match": "Вони збігаються",
  "contacts.verify.codes_differ": "Вони не збігаються",
  "contacts.verify.compared_body":
    "Ви та {name} підтвердили той самий код. Цей контакт підтверджено.",

  // ---- Settings: shared chrome ----
  "settings.back": "Повернутися",
  "settings.coming_soon": "Незабаром",
  "settings.opens_externally": "{label}, відкривається поза застосунком",
  "settings.peer_id": "Ідентифікатор піра",
  "settings.share_peer_id": "Поділитися своїм ідентифікатором піра",
  "settings.share_id_short": "Поділитися ID",
  "settings.peer_id_sheet.title": "Ваш ідентифікатор піра",
  "settings.peer_id_sheet.copy": "Копіювати ідентифікатор піра",
  "settings.peer_id_sheet.note":
    "Це працює, лише коли ви обоє в радіусі Bluetooth. Щоб вам могли написати звідусіль, поділіться натомість своїм QR-кодом.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Загальні",
  "settings.section.general_desc":
    "Необов’язкові функції, скасування надсилання, медіа, скидання",
  "settings.section.privacy": "Приватність і безпека",
  "settings.section.privacy_desc":
    "Forward secrecy, підписані пакети, заблоковані піри",
  "settings.section.network": "Мережа й релеї",
  "settings.section.network_desc":
    "Запасний інтернет, релеї nostr, сумісність із bitchat",
  "settings.section.permissions": "Дозволи",
  "settings.section.permissions_desc":
    "Bluetooth, місцезнаходження, сповіщення, камера, мікрофон",
  "settings.section.storage": "Сховище й дані",
  "settings.section.diagnostics": "Діагностика",

  // ---- Settings: group headings ----
  "settings.group.transports": "Транспорти",
  "settings.group.nearby": "Поблизу",
  "settings.group.sync": "Синхронізація",
  "settings.group.features": "Функції",
  "settings.group.messages": "Повідомлення",
  "settings.group.media": "Медіа",
  "settings.group.reset": "Скидання",
  "settings.group.always_on": "Завжди увімкнено",
  "settings.group.notifications": "Сповіщення",
  "settings.group.blocked": "Заблоковані",
  "settings.group.theme": "Тема",
  "settings.group.font": "Шрифт",
  "settings.group.language": "Мова",
  "settings.section.diagnostics_desc": "Стан з’єднання та пристрої поблизу",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Зв’язки Bluetooth",
  "settings.diag.ble_links_desc":
    "Пристрої, з якими цей телефон з’єднаний напряму",
  "settings.diag.lan": "Локальна мережа",
  "settings.diag.lan_desc": "Телефони в одній мережі Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Телефон до телефона без маршрутизатора",
  "settings.diag.wifi_active": "Працює",
  "settings.diag.wifi_unsupported": "Не підтримується на цьому пристрої",
  "settings.diag.wifi_permission": "Заблоковано дозволом",
  "settings.diag.wifi_unavailable": "Зараз недоступно",
  "settings.diag.wifi_unpaired": "Нічого не з’єднано",
  "settings.diag.wifi_unknown": "Чекаємо на радіо",
  "settings.diag.relays": "Релеї Nostr",
  "settings.diag.relays_desc":
    "Використовуються для каналів місцевості та охоплення через інтернет",
  "settings.diag.connected": "З’єднано",
  "settings.diag.disconnected": "Не з’єднано",
  "settings.diag.peer_direct": "Прямий зв’язок",
  "settings.diag.peer_relayed": "Почуто через інший пристрій",
  "settings.diag.rssi": "{dbm} дБм",
  "settings.diag.no_rssi": "Немає показника сигналу",
  "settings.diag.no_peers": "У радіусі нікого немає",
  "settings.diag.no_peers_desc": "Відкритих радіозв’язків: {links}",
  "settings.diag.gcs_size": "Розмір фільтра",
  "settings.diag.gcs_size_desc":
    "Найбільший фільтр синхронізації, випущений в ефір",
  "settings.diag.fpr": "Частка хибних збігів",
  "settings.diag.fpr_desc":
    "Як часто фільтр стверджує, що має пакет, якого нам бракує",
  "settings.diag.bytes": "{n} байтів",
  "settings.diag.footnote":
    "Тут нічого не можна змінити. Ці значення закріплені, щоб Airhop лишався сумісним із bitchat.",
  "settings.section.storage_desc": "Використання та кеш",
  "settings.section.appearance": "Вигляд",
  "settings.section.appearance_desc": "Тема, шрифт і мова",
  "settings.section.help": "Довідка та відгуки",
  "settings.section.help_desc":
    "Напишіть нам, повідомте про помилку або прочитайте поширені запитання",
  "settings.section.support": "Підтримка",
  "settings.section.support_desc": "Допоможіть розробці тривати",
  "settings.section.about": "Про застосунок",
  "settings.section.about_desc": "Версія, перелік змін і код",

  // ---- Settings: general ----
  "settings.general.undo": "Скасування надсилання",
  "settings.general.feature_ai": "ШІ",
  "settings.general.feature_wallet": "Гаманець",
  "settings.general.undo_seconds": "{count} секунд",
  "settings.general.undo_a11y": "Скасування надсилання: {value}",
  "settings.general.quality_a11y": "Установити якість вивантаження на {value}",
  "settings.general.undo_desc":
    "Ненадовго притримує надіслане повідомлення, щоб ви встигли його забрати до відправлення",
  "settings.general.undo_off_desc": "Надсилати одразу, без скасування",
  "settings.general.undo_2": "2 секунди",
  "settings.general.undo_2_desc": "Швидка нагода забрати його назад",
  "settings.general.undo_10": "10 секунд",
  "settings.general.undo_10_desc": "Найдовше вікно",
  "settings.general.quality": "Якість вивантаження",
  "settings.general.quality_desc":
    "Стосується фото, надісланих із камери чи галереї. Кожне фото так чи інакше припасовується під mesh.",
  "settings.general.quality_low": "Низька",
  "settings.general.quality_low_desc": "Найменші фото, найшвидше надсилання",
  "settings.general.quality_medium": "Середня",
  "settings.general.quality_medium_desc": "Рівновага деталей і швидкості",
  "settings.general.quality_high": "Висока",
  "settings.general.quality_high_desc": "Зберігає найбільше деталей",
  "settings.general.feature_wallet_desc":
    "Надсилайте Cashu ecash від піра до піра через mesh",
  "settings.general.feature_wallet_a11y": "Гаманець (завжди увімкнено)",
  "settings.general.feature_ai_desc":
    "Приватний помічник на пристрої, без звернень до мережі",
  "settings.general.feature_feeds": "Стрічки",
  "settings.general.feature_feeds_desc":
    "Читайте стрічки Bluesky і Mastodon та дописуйте в них",
  "settings.general.show_media": "Показувати медіа автоматично",
  "settings.general.show_media_desc":
    "Фото й відео з’являються в чаті або лишаються за одним дотиком",
  "settings.general.reset": "Скинути налаштування",
  "settings.general.media_retention": "Зберігати медіа",
  "settings.general.media_retention_desc":
    "Фото, відео та голосові нотатки видаляються після вибраного часу",
  "settings.general.media_retention_sheet":
    "Виберіть, як довго медіа лишається на цьому пристрої. Видалене медіа не відновити.",
  "settings.general.retention_7_desc":
    "Лишає найменше слідів. Найкраще, коли ризиком є сам телефон.",
  "settings.general.retention_14_desc":
    "Золота середина на тиждень-два без зв’язку.",
  "settings.general.retention_30_desc":
    "Найдовше тримає розмови читабельними й найбільше займає на диску.",
  "settings.general.reset_desc":
    "Повертає кожне налаштування до типового, не чіпаючи вашу особистість, повідомлення, контакти та гаманець",
  "settings.general.reset_title": "Скинути налаштування?",
  "settings.general.reset_body":
    "Кожне налаштування повертається до типового: вигляд, скасування надсилання та зв’язок (інтернет, Tor, шлюз, міст, релеї). Ваша особистість, повідомлення, контакти та гаманець лишаються недоторканими.",
  "settings.general.reset_confirm": "Скинути",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet завжди увімкнено для прямих повідомлень",
  "settings.security.signed_packets": "Підписані пакети",
  "settings.security.signed_packets_desc": "Кожен пакет підписано за Ed25519",
  "settings.security.hide_previews": "Ховати попередній перегляд у сповіщеннях",
  "settings.security.hide_previews_desc":
    "Тримає відправника й повідомлення подалі від екрана блокування, який показує їх без розблокування",
  "settings.security.no_blocked": "Немає заблокованих пірів",
  "settings.security.no_blocked_desc":
    "Заблоковані піри не можуть вам писати й не з’являються на вкладці Mesh",
  "settings.security.unblock_title": "Розблокувати цього піра",
  "settings.security.unblock": "Розблокувати",
  "settings.security.unblock_peer": "Розблокувати {name}",
  "settings.security.unblock_body":
    "{name} знову зможе вам писати і з’явиться на вкладці Mesh, коли буде поблизу.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Запасний інтернет",
  "settings.network.internet_desc":
    "Продовжувати через релеї Nostr, коли піри mesh поза радіусом",
  "settings.network.internet_off_title": "Вимкнути інтернет?",
  "settings.network.internet_off_body":
    "Airhop працюватиме лише через Bluetooth. Він перестане звертатися до будь-яких релеїв Nostr, а Tor, інтернет-шлюз і міст mesh вимкнуться. Чат через Bluetooth поблизу працюватиме далі.",
  "settings.network.turn_off": "Вимкнути",
  "settings.network.discovery": "Пошук гео-релеїв",
  "settings.network.discovery_desc":
    "Автоматично добирати найближчі релеї для комірки місцевості з-поміж 300+ розподілених релеїв",
  "settings.network.discovery_needs_relay": "Спершу додайте власний релей",
  "settings.network.discovery_needs_relay_body":
    "Саме автоматичний пошук спрямовує Airhop до найближчих релеїв. Вимикати його має сенс лише тоді, коли ви закріпили власні релеї нижче, тож спершу додайте хоча б один.",
  "settings.network.custom_only_title": "Використовувати лише власні релеї?",
  "settings.network.custom_only_body":
    "Канали місцевості та міст mesh перестануть автоматично добирати найближчі релеї й користуватимуться лише доданими вами. Це може звузити охоплення, і ви можете перестати зустрічати користувачів bitchat, які збираються на найближчих релеях.",
  "settings.network.custom": "Власні релеї",
  "settings.network.custom_desc":
    "Додайте власні релеї для каналів місцевості та мосту mesh",
  "settings.network.custom_added": "Додано {count} із {max}",
  "settings.network.dm_relays": "Релеї повідомлень",
  "settings.network.dm_relays_desc":
    "Прямі повідомлення та приватні канали завжди користуються цими. Власні релеї їх не змінюють.",
  "settings.network.discovery_back_on": "Пошук гео-релеїв знову увімкнено",
  "settings.network.discovery_back_on_body":
    "Це був ваш останній власний релей. Каналам місцевості потрібно десь публікувати, тож Airhop знову автоматично добирає найближчі релеї.",
  "settings.network.add_relay": "Додати релей",
  "settings.network.remove_relay": "Вилучити {url}",
  "settings.network.add_short": "Додати",
  "settings.network.relay_limit":
    "Ви можете додати {count} релеїв. Вилучіть один, щоб додати інший.",
  "settings.network.relay_duplicate": "Цей релей уже є у вашому списку.",
  "settings.network.relay_invalid":
    "Введіть дійсний хост релея, наприклад relay.example.com. Порт потрібен, лише якщо релей не використовує типовий. IP-адреси та локальні імена не дозволені.",
  "settings.network.wifi_pair": "Спарювання",
  "settings.network.wifi_paired": "З’єднані пристрої",
  "settings.network.wifi_pair_find": "Знайти пристрій",
  "settings.network.wifi_pair_find_desc":
    "Шукати поблизу iPhone, який показує себе. Обом потрібна iOS 26 або новіша.",
  "settings.network.wifi_pair_show": "Показати цей iPhone",
  "settings.network.wifi_pair_show_desc":
    "Дозвольте iPhone поблизу знайти цей. Один шукає, інший показує себе, одночасно.",
  "settings.network.wifi_pair_find_action": "Виберіть iPhone поблизу",
  "settings.network.wifi_pair_show_action": "Зробити цей iPhone видимим",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware зараз недоступний",
  "settings.network.wifi_pair_forget": "Видаліть з’єднання у програмі Settings",
  "settings.network.bitchat": "Сумісність із bitchat",
  "settings.network.bitchat_desc":
    "Той самий BLE-mesh, що й у bitchat, цілком сумісний. Це завжди увімкнено й не вимикається.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Працювати у фоні",
  "settings.conn.background_desc":
    "Тримати mesh запущеним, коли Airhop закрито",
  "settings.conn.background_on_title": "Тримати mesh запущеним?",
  "settings.conn.background_on_body":
    "Airhop продовжує передавати й отримувати, коли його закрито, тож повідомлення надходять, поки вас немає. Android увесь цей час показує постійне сповіщення.",
  "settings.conn.background_off_title":
    "Зупиняти mesh, коли Airhop закривається?",
  "settings.conn.background_off_body":
    "Повідомлення надходитимуть, лише поки Airhop відкрито, а цей телефон перестане передавати для людей поблизу. Постійне сповіщення зникне.",
  "settings.conn.live_voice": "Живий голос",
  "settings.conn.live_voice_desc":
    "Говоріть із людьми поблизу, наче через рацію",
  "settings.conn.live_voice_on_title": "Увімкнути живий голос?",
  "settings.conn.live_voice_on_body":
    "Утримання мікрофона надсилає ваш голос усім у радіусі Bluetooth, поки ви говорите, а їхній голос лунає на вашому телефоні. Нічого не записується.",
  "settings.conn.live_voice_off_title": "Вимкнути живий голос?",
  "settings.conn.live_voice_off_body":
    "Утримання мікрофона натомість записує голосову нотатку. Вона надсилається, коли ви відпускаєте, і ніхто її не чує, доки не відтворить.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Маршрутизація через Tor",
  "settings.conn.tor_desc":
    "Спрямовувати трафік Nostr через Tor задля додаткової приватності",
  "settings.conn.tor_on_title": "Спрямовувати трафік Nostr через Tor?",
  "settings.conn.tor_on_body":
    "Релеї перестануть бачити вашу IP-адресу. З’єднання триває довше, а повідомлення надходять повільніше. На Bluetooth це не впливає.",
  "settings.conn.tor_off_title": "Вимкнути маршрутизацію через Tor?",
  "settings.conn.tor_off_body":
    "Трафік Nostr повертається до вашого звичайного з’єднання, тож релеї знову бачать вашу IP-адресу. На Bluetooth це не впливає в жодному разі.",
  "settings.conn.tor_orbot_idle":
    "Orbot встановлено, але не з’єднано. Відкрийте Orbot, запустіть його VPN, а тоді увімкніть це.",
  "settings.conn.tor_unavailable":
    "Маршрутизація через Tor недоступна в цій збірці.",
  "settings.conn.tor_timeout":
    "Tor з’єднується довше за хвилину. Він лишається увімкненим і продовжує спроби; вкладка Mesh скаже, коли маршрутизація запрацює або якщо ця мережа її блокує.",
  "settings.conn.tor_failed":
    "Не вдалося запустити Tor. Переконайтеся, що застосунок має доступ до мережі.",
  "settings.conn.mint_clearnet": "Дозволити трафік мінта через відкриту мережу",
  "settings.conn.mint_clearnet_desc":
    "Tor на iOS охоплює лише Nostr. Лишіть вимкненим, щоб блокувати запити до мінта; ecash через mesh працює в будь-якому разі.",
  "settings.conn.gateway": "Інтернет-шлюз",
  "settings.conn.gateway_desc":
    "Позичте своє з’єднання телефону поблизу без мережі, щоб він усе одно діставав канали місцевості",
  "settings.conn.gateway_on_title": "Увімкнути інтернет-шлюз?",
  "settings.conn.gateway_on_body":
    "Телефони поблизу без власного з’єднання надсилатимуть і отримуватимуть повідомлення каналів місцевості через ваше. Це витрачає ваш мобільний трафік і заряд, а їхні повідомлення лишаються зашифрованими наскрізь, тож ви не прочитаєте те, що проходить.",
  "settings.conn.gateway_off_title": "Вимкнути інтернет-шлюз?",
  "settings.conn.gateway_off_body":
    "Телефони поблизу без мережі перестануть діставати канали місцевості через ваше з’єднання. На ваші власні повідомлення це не впливає.",
  "settings.conn.bridge": "Міст mesh",
  "settings.conn.bridge_desc":
    "Сполучіть публічний чат #bluetooth цієї місцевості з іншим гуртом у Bluetooth поза радіусом через інтернет",
  "settings.conn.bridge_on_title": "Увімкнути міст mesh?",
  "settings.conn.bridge_on_body":
    "Ваші публічні повідомлення #bluetooth публікуватимуться у вашому районі через інтернет, тож люди поза радіусом Bluetooth зможуть їх читати. Приватні повідомлення ніколи не мостяться, а «лише поблизу» тримає окреме повідомлення на місці.",
  "settings.conn.bridge_off_title": "Вимкнути міст mesh?",
  "settings.conn.bridge_off_body":
    "Ваші публічні повідомлення #bluetooth знову лишаються в радіусі Bluetooth, а повідомлення від гурту по той бік перестають сюди надходити.",
  "settings.conn.bridge_needs_location": "Мосту mesh потрібне місцезнаходження",
  "settings.conn.bridge_needs_location_desc":
    "Він визначає ваш район за координатами. Надайте дозвіл на місцезнаходження, щоб почати мостити.",
  "settings.conn.grant_location": "Надати дозвіл на місцезнаходження",
  "settings.conn.grant_short": "Надати",
  "settings.conn.orbot_body":
    "Airhop спрямовує трафік Tor через Orbot. Установіть і увімкніть Orbot із Play Store, а тоді увімкніть це.",
  "settings.conn.internet_off": "Інтернет вимкнено",
  "settings.conn.internet_off_desc":
    "Tor, міст і шлюз користуються інтернетом. Увімкніть Запасний інтернет у розділі Мережа, щоб ними скористатися.",
  "settings.conn.turn_on": "Увімкнути",
  "settings.conn.turn_off": "Вимкнути",
  "settings.conn.orbot_title": "Tor на Android",
  "settings.conn.get_orbot": "Отримати Orbot",
  "settings.conn.later": "Пізніше",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Знаходить пристрої поблизу та передає повідомлення між ними. Без нього mesh не працює.",
  "settings.permissions.location": "Місцезнаходження",
  "settings.permissions.location_desc":
    "Відкриває сусідні канали місцевості. Без нього ті канали лишаються закритими, а mesh через Bluetooth працює як звичайно.",
  "settings.permissions.notifications": "Сповіщення",
  "settings.permissions.notifications_desc":
    "Отримуйте сигнали про нові повідомлення, навіть коли застосунок закрито. Без них ви побачите їх, лише відкривши Airhop.",
  "settings.permissions.camera": "Камера",
  "settings.permissions.camera_desc":
    "Сканує QR-коди та знімає фото чи відео для надсилання. Без неї ви все одно можете ділитися медіа з галереї.",
  "settings.permissions.photos": "Фото",
  "settings.permissions.photos_desc":
    "Надсилає фото з вашої галереї та зберігає отримане медіа. Без цього ви все одно можете знімати й надсилати нові фото камерою.",
  "settings.permissions.microphone": "Мікрофон",
  "settings.permissions.microphone_desc":
    "Записує й надсилає голосові повідомлення або вмикає живий голос. Без нього голосові повідомлення та живий голос не працюватимуть.",
  "settings.permissions.allow": "Надати цей дозвіл",
  "settings.permissions.open_settings":
    "Відкрити системні налаштування, щоб змінити цей дозвіл",
  "settings.permissions.system": "Система",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Використання мережі",
  "settings.storage.storage_usage": "Використання сховища",
  "settings.storage.storage_usage_desc":
    "Повідомлення, докази гаманця та вкладення в кеші",
  "settings.storage.session_usage":
    "Цей сеанс · надіслано {sent}, отримано {received}",
  "settings.storage.cache": "Кеш",
  "settings.storage.cache_desc": "{size} вкладень",
  "settings.storage.clear_cache": "Очистити кеш вкладень",
  "settings.storage.clear": "Очистити",
  "settings.storage.clear_title": "Очистити медіа з кешу?",
  "settings.storage.clear_body":
    "Фото, відео, голосові нотатки та файли вилучаються з цього пристрою, як надіслані, так і отримані. Завантажити їх знову не вийде: їхні бульбашки про це скажуть, і ви зможете попросити відправника надіслати ще раз. Повідомлення та гаманець лишаються недоторканими.",
  "settings.storage.cleared": "Кеш очищено",
  "settings.storage.freed": "Звільнено {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Установити вигляд на {value}",
  "settings.font.set_a11y": "Установити моноширинний шрифт на {value}",
  "settings.font.system": "Системний",
  "settings.font.system_desc":
    "Використовує типовий моноширинний шрифт вашого пристрою",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Сучасний і легкий для читання",
  "settings.language.en": "Англійська",
  "settings.language.am": "Амхарська",
  "settings.language.ar": "Арабська",
  "settings.language.bn": "Бенгальська",
  "settings.language.my": "Бірманська",
  "settings.language.zh_hans": "Китайська (спрощена)",
  "settings.language.zh_hant": "Китайська (традиційна)",
  "settings.language.nl": "Нідерландська",
  "settings.language.fil": "Філіппінська",
  "settings.language.fr": "Французька",
  "settings.language.ka": "Грузинська",
  "settings.language.de": "Німецька",
  "settings.language.hi": "Гінді",
  "settings.language.id": "Індонезійська",
  "settings.language.it": "Італійська",
  "settings.language.ja": "Японська",
  "settings.language.ko": "Корейська",
  "settings.language.mg": "Малагасійська",
  "settings.language.ms": "Малайська",
  "settings.language.ne": "Непальська",
  "settings.language.fa": "Перська",
  "settings.language.pl": "Польська",
  "settings.language.pt_br": "Португальська (Бразилія)",
  "settings.language.pt_pt": "Португальська (Португалія)",
  "settings.language.pa": "Панджабі",
  "settings.language.ru": "Російська",
  "settings.language.es": "Іспанська",
  "settings.language.sw": "Суахілі",
  "settings.language.sv": "Шведська",
  "settings.language.ta": "Тамільська",
  "settings.language.th": "Тайська",
  "settings.language.tr": "Турецька",
  "settings.language.uk": "Українська",
  "settings.language.ur": "Урду",
  "settings.language.vi": "В’єтнамська",
  "settings.language.pseudo": "Псевдолокаль",
  "settings.language.soon": "Незабаром",
  "settings.language.soon_a11y": "{value}, незабаром",
  "settings.language.set_a11y": "Установити мову на {value}",
  "settings.language.pending": "Під час наступного відкриття",
  "settings.language.pending_a11y":
    "{value}, застосується, коли ви наступного разу відкриєте Airhop",
  "settings.language.rtl_title": "Відкрийте Airhop знову, щоб завершити",
  "settings.language.rtl_body":
    "{value} читається справа наліво, а Airhop може змінити напрям лише під час запуску. Закрийте його й відкрийте знову, щоб завершити перехід. Нічого не втрачається, і ваш mesh лишається з’єднаним, доки ви цього не зробите.",
  "settings.theme.light": "Світла",
  "settings.theme.light_desc": "Завжди використовувати світлу палітру",
  "settings.theme.dark": "Темна",
  "settings.theme.dark_desc": "Завжди використовувати темну палітру",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Онлайн",
  "settings.status.online_desc": "Помітний, оголошує й сканує",
  "settings.status.away": "Відсутній",
  "settings.status.away_desc": "Mesh призупинено, не сканує й не оголошує",
  "settings.status.invisible": "Невидимий",
  "settings.status.invisible_desc": "Сканує, але прихований від виявлення",
  "settings.status.title": "Статус",
  "settings.status.set_a11y": "Установити статус на {value}",
  "settings.status.edit": "Змінити статус",
  "settings.status.desc": "Виберіть, наскільки ви помітні в mesh.",
  "settings.transfer.identity": "Особистість і ключі",
  "settings.transfer.identity_desc":
    "Ваш ідентифікатор піра, ім’я користувача та контакти",
  "settings.transfer.chats": "Чати та історія",
  "settings.transfer.chats_desc":
    "Розмови, групи та канали, до яких ви приєдналися",
  "settings.transfer.wallet": "Баланс гаманця",
  "settings.transfer.wallet_desc": "Докази Cashu та історія операцій",
  "settings.transfer.title": "Перенести на новий телефон",
  "settings.transfer.desc":
    "Перенесіть свою особистість, чати та гаманець на інший пристрій",
  "settings.transfer.coming_soon_a11y": "Перенести на новий телефон, незабаром",
  "settings.transfer.body":
    "Тримайте обидва телефони поруч і перенесіть усе через Bluetooth. Ніщо не проходить через сервер, тож це працює без інтернету.",
  "settings.qr.permission_label": "Доступ до фото",
  "settings.qr.permission_purpose": "зберегти ваш QR-код",
  "settings.qr.saved": "Збережено",
  "settings.qr.saved_body": "QR-код збережено у вашій галереї.",
  "settings.qr.save_failed": "Не вдалося зберегти",
  "settings.qr.save_failed_body":
    "Не вдалося зберегти QR-код. Спробуйте ще раз.",
  "settings.qr.share_message": "Додайте мене в Airhop",
  "settings.qr.share_body":
    "Додайте мене в Airhop — приватні повідомлення через mesh, спершу офлайн.",
  "settings.qr.show_short": "Показати QR",
  "settings.qr.title": "Ваш QR-код",
  "settings.qr.note":
    "Він містить ваші відкриті ключі, які дають іншим змогу написати вам звідусіль. Діліться ним лише з людьми, яким довіряєте. Він не зміниться, доки ви не зітрете свою особистість.",
  "settings.qr.code_label": "Код контакту",
  "settings.qr.copy_code": "Копіювати код контакту",
  "settings.qr.share": "Поділитися QR-кодом",
  "settings.qr.share_short": "Поділитися QR",
  "settings.qr.download": "Завантажити QR-код",
  "settings.qr.download_short": "Завантажити QR",
  "settings.qr.show": "Показати QR-код",
  "settings.wipe.trigger": "Запустити екстрене стирання",
  "settings.wipe.trigger_desc":
    "Торкніться тричі, щоб стерти негайно без підтвердження",
  "settings.wipe.title": "Екстрене стирання",
  "settings.wipe.now": "Стерти зараз",
  "settings.wipe.desc": "Миттєво знищує всі ключі, повідомлення та докази",
  "settings.wipe.body":
    "Це миттєво знищить усі ваші ключі, повідомлення та докази гаманця. Скасувати це неможливо.",
  "settings.wipe.in_progress": "Стираємо",
  "settings.wipe.in_progress_body":
    "Знищуємо ваші ключі, повідомлення та файли. Це триває кілька секунд і завершується саме, навіть якщо застосунок закрити.",
  "settings.wipe.got_it": "Зрозуміло",
  "settings.wipe.keys_failed": "Не вдалося знищити ключі",
  "settings.wipe.keys_failed_body":
    "Ваші повідомлення, контакти та гаманець зникли, але пристрій відмовився віддати ваші ключі. Розблокуйте пристрій і зітріть ще раз.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Напишіть нам",
  "settings.help.contact_a11y": "Надіслати листа на {address}",
  "settings.help.bug": "Повідомити про помилку",
  "settings.help.bug_desc": "Відкрити запит на GitHub",
  "settings.help.bug_a11y": "Повідомити про помилку на GitHub",
  "settings.help.faq": "Поширені запитання",
  "settings.help.faq_desc": "Відповіді на звичні запитання",
  "settings.help.faq_a11y": "Відкрити поширені запитання",
  "settings.help.terms_desc": "Як можна користуватися Airhop",
  "settings.help.terms_a11y": "Відкрити Умови користування",
  "settings.help.privacy_desc": "Чого ми не збираємо",
  "settings.help.privacy_a11y": "Відкрити Політику приватності",

  // ---- Settings: support ----
  "settings.support.card": "Картка або UPI",
  "settings.support.card_desc": "Інтернет-банкінг і гаманці, по всьому світу",
  "settings.support.card_a11y":
    "Підтримати карткою, через UPI, інтернет-банкінг або гаманець",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Щомісяця або разово, без комісії платформи",
  "settings.support.sponsors_a11y": "Підтримати через GitHub Sponsors",
  "settings.support.note":
    "Я створюю Airhop у вільний час. Немає ні інвесторів, ні реклами. Якщо він вам корисний, внесок дуже допомагає розробці тривати. Кожна функція так чи інакше лишається безкоштовною.",

  // ---- Settings: about and version ----
  "settings.about.version": "Версія",
  "settings.about.version_desc": "Поточний випуск",
  "settings.about.version_a11y": "Переглянути версію та перевірити оновлення",
  "settings.about.release_notes": "Нотатки випуску",
  "settings.about.release_notes_desc": "Що нового в останньому випуску",
  "settings.about.release_notes_a11y":
    "Відкрити нотатки останнього випуску на GitHub",
  "settings.about.source": "Код",
  "settings.about.source_a11y": "Відкрити код на GitHub",
  "settings.about.licenses": "Ліцензії відкритого коду",
  "settings.about.open_repo": "Відкрити репозиторій {name}",
  "settings.about.licenses_desc": "Сторонні пакунки з відкритим кодом",
  "settings.about.licenses_a11y": "Переглянути сторонні ліцензії",
  "settings.version.codename": "Кодова назва",
  "settings.version.checking": "Перевіряємо",
  "settings.version.check": "Перевірити оновлення",
  "settings.version.checking_title": "Перевіряємо оновлення",
  "settings.version.up_to_date": "У вас найновіша версія.",
  "settings.version.release_notes": "Переглянути нотатки випуску",
  "settings.version.made_with": "Зроблено з",
  "settings.version.number": "Версія {version}",
  "settings.version.update_to": "Оновити до {version}",
  "settings.version.update_to_a11y": "Оновити до версії {version}",
  "settings.version.released_under": "Випущено за {license}",
  "settings.version.notes_a11y": "Переглянути нотатки випуску версії {version}",
  "settings.version.tor_paused":
    "Перевірку оновлень призупинено, поки Tor увімкнено, щоб вона не розкрила вашу IP-адресу. Загляньте на сторінку випусків у браузері.",
  "settings.version.check_failed":
    "Не вдалося перевірити оновлення. Перевірте з’єднання та спробуйте ще раз.",
  "settings.version.downloading": "Завантаження {percent}%",
  "settings.version.install": "Встановити",
  "settings.version.download_failed":
    "Не вдалося завантажити. Перевірте з’єднання та повторіть спробу.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} має {size} KiB, це понад межу в {cap} KiB.",
  "transfer.failed.malformed":
    "Вкладення надійшло пошкодженим і не відкрилося. Попросіть надіслати його ще раз.",
  "transfer.failed.unsupported_type":
    "Вкладення надійшло у форматі, який цей застосунок не може відкрити.",
  "transfer.failed.type_mismatch":
    "Вкладення відхилено: його вміст не збігається із заявленим типом файлу.",
  "transfer.failed.storage":
    "Вкладення надійшло, але його не вдалося зберегти. Перевірте вільне місце.",
  "transfer.badge.waiting": "Очікує · {name}",
  "transfer.badge.active_count": "Передач: {count}",
  "transfer.badge.sending": "Надсилаємо {name}",
  "transfer.badge.receiving": "Отримуємо {name}",
  "transfer.badge.a11y": "{label}, {percent} відсотків. Відкрити розмову.",
  "transfer.kind.photo": "Фото",
  "transfer.kind.video": "Відео",
  "transfer.kind.voice": "Голосова нотатка",
  "transfer.this.photo": "Це фото",
  "transfer.this.video": "Це відео",
  "transfer.this.voice": "Ця голосова нотатка",
  "transfer.this.file": "Цей файл",
  "transfer.kind.document": "Документ",
  "transfer.kind.voice_preview": "Голосова нотатка",
  "transfer.kind.photo_preview": "Фото",
  "transfer.kind.video_preview": "Відео",
  "transfer.kind.document_preview": "Документ",

  // ---- System notifications ----
  "notif.channel.messages": "Повідомлення",
  "notif.channel.nearby": "Піри поблизу",
  "notif.channel.nearby_desc":
    "Нечасте сповіщення, коли mesh знаходить людей у радіусі Bluetooth.",
  "notif.nearby.body":
    "Зараз у радіусі Bluetooth. Торкніться, щоб відкрити mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Хтось",
  "notif.notice_urgent": "Термінове оголошення · {content}",
  "notif.notice": "Оголошення · {content}",
  "notif.incoming_file": "Вхідний файл",
  "notif.preview.photo": "📷 Фото",
  "notif.preview.voice": "🎤 Голосове повідомлення",
  "notif.preview.video": "🎥 Відео",
  "notif.preview.document": "📄 Документ",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Нове повідомлення",
  "notif.hidden.channel": "Нова активність",
  "notif.hidden.mention": "Вас згадали",
  "notif.mention.title": "{sender} згадує вас",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Показати ще {count}",
    few: "Показати ще {count}",
    many: "Показати ще {count}",
    other: "Показати ще {count}",
  },
  "chat.channels.show_more_a11y": {
    one: "Показати ще {count} типовий канал",
    few: "Показати ще {count} типові канали",
    many: "Показати ще {count} типових каналів",
    other: "Показати ще {count} типового каналу",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} непрочитане",
    few: "{label}, {count} непрочитані",
    many: "{label}, {count} непрочитаних",
    other: "{label}, {count} непрочитаного",
  },
  "a11y.new_count": {
    one: "{label}, {count} нове",
    few: "{label}, {count} нові",
    many: "{label}, {count} нових",
    other: "{label}, {count} нового",
  },
  "chat.a11y.unread": {
    one: "{count} непрочитане",
    few: "{count} непрочитані",
    many: "{count} непрочитаних",
    other: "{count} непрочитаного",
  },
  "chat.thread.length_left": {
    one: "залишилося {count}",
    few: "залишилося {count}",
    many: "залишилося {count}",
    other: "залишилося {count}",
  },
  "settings.general.retention_days": {
    one: "{count} день",
    few: "{count} дні",
    many: "{count} днів",
    other: "{count} дня",
  },
  "chat.info.group_reach": {
    one: "{reachable} з {count} учасника доступно",
    few: "{reachable} з {count} учасників доступно",
    many: "{reachable} з {count} учасників доступно",
    other: "{reachable} з {count} учасника доступно",
  },
  "chat.group_members": {
    one: "Приватна група  ·  {count} учасник",
    few: "Приватна група  ·  {count} учасники",
    many: "Приватна група  ·  {count} учасників",
    other: "Приватна група  ·  {count} учасника",
  },
  "chat.select.count": {
    one: "{count} вибрано",
    few: "{count} вибрано",
    many: "{count} вибрано",
    other: "{count} вибрано",
  },
  "chat.select.forward": {
    one: "Переслати {count} повідомлення",
    few: "Переслати {count} повідомлення",
    many: "Переслати {count} повідомлень",
    other: "Переслати {count} повідомлення",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} говорить",
    few: "{count} говорять",
    many: "{count} говорять",
    other: "{count} говорить",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} пір у радіусі",
    few: "{count} піри у радіусі",
    many: "{count} пірів у радіусі",
    other: "{count} піра у радіусі",
  },
  "mesh.peer.hops_away": {
    one: "{count} стрибок звідси",
    few: "{count} стрибки звідси",
    many: "{count} стрибків звідси",
    other: "{count} стрибка звідси",
  },
  "chat.presence.active": {
    one: "{count} активний",
    few: "{count} активні",
    many: "{count} активних",
    other: "{count} активного",
  },
  "chat.presence.nearby": {
    one: "{count} поблизу",
    few: "{count} поблизу",
    many: "{count} поблизу",
    other: "{count} поблизу",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} мінт",
    few: "{count} мінти",
    many: "{count} мінтів",
    other: "{count} мінта",
  },
  "wallet.mint.remove_body": {
    one: "{mint} тримає {balance} {unit} в {count} доказі. Видалення назавжди стирає цей доказ із цього пристрою, і резервної копії немає. Спершу виведіть або надішліть баланс.",
    few: "{mint} тримає {balance} {unit} у {count} доказах. Видалення назавжди стирає ці докази з цього пристрою, і резервної копії немає. Спершу виведіть або надішліть баланс.",
    many: "{mint} тримає {balance} {unit} у {count} доказах. Видалення назавжди стирає ці докази з цього пристрою, і резервної копії немає. Спершу виведіть або надішліть баланс.",
    other:
      "{mint} тримає {balance} {unit} в {count} доказі. Видалення назавжди стирає цей доказ із цього пристрою, і резервної копії немає. Спершу виведіть або надішліть баланс.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} депозит очікує оплати. Перевіряється щоразу, коли застосунок відкривається.",
    few: "{count} депозити очікують оплати. Перевіряються щоразу, коли застосунок відкривається.",
    many: "{count} депозитів очікують оплати. Перевіряються щоразу, коли застосунок відкривається.",
    other:
      "{count} депозита очікує оплати. Перевіряється щоразу, коли застосунок відкривається.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Відновлено {count} невитрачений доказ із {mints}.",
    few: "Відновлено {count} невитрачені докази з {mints}.",
    many: "Відновлено {count} невитрачених доказів із {mints}.",
    other: "Відновлено {count} невитраченого доказу з {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "Знайдено {count} монету, але її вже витрачено, тож за неї нічого не зараховано. Це нормально: кожна монета, яку ви колись витратили, залишається в записах, що їх веде мінт.",
    few: "Знайдено {count} монети, але їх уже витрачено, тож за них нічого не зараховано. Це нормально: кожна монета, яку ви колись витратили, залишається в записах, що їх веде мінт.",
    many: "Знайдено {count} монет, але їх уже витрачено, тож за них нічого не зараховано. Це нормально: кожна монета, яку ви колись витратили, залишається в записах, що їх веде мінт.",
    other:
      "Знайдено {count} монети, але її вже витрачено, тож за неї нічого не зараховано. Це нормально: кожна монета, яку ви колись витратили, залишається в записах, що їх веде мінт.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Показати ще {count}",
    few: "Показати ще {count}",
    many: "Показати ще {count}",
    other: "Показати ще {count}",
  },
  "wallet.activity.show_more_a11y": {
    one: "Показати ще {count} платіж",
    few: "Показати ще {count} платежі",
    many: "Показати ще {count} платежів",
    other: "Показати ще {count} платежу",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} непідтверджений",
    few: "{count} непідтверджені",
    many: "{count} непідтверджених",
    other: "{count} непідтвердженого",
  },
  "wallet.proof_count": {
    one: "{count} доказ",
    few: "{count} докази",
    many: "{count} доказів",
    other: "{count} доказу",
  },
  "wallet.spent_removed_detail": {
    one: "{count} доказ уже було витрачено, і його вилучено.",
    few: "{count} докази вже було витрачено, і їх вилучено.",
    many: "{count} доказів уже було витрачено, і їх вилучено.",
    other: "{count} доказу вже було витрачено, і його вилучено.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Хтось поблизу",
    few: "{count} особи поблизу",
    many: "{count} осіб поблизу",
    other: "{count} особи поблизу",
  },
};

export const uk = { strings, plurals };
