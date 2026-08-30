// pl: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Anuluj",
  "common.done": "Gotowe",
  "common.ok": "OK",
  "common.close": "Zamknij",
  "common.back": "Wstecz",
  "common.delete": "Usuń",
  "common.remove": "Usuń",
  "common.add": "Dodaj",
  "common.copy": "Kopiuj",
  "common.copied": "Skopiowano",
  "common.share": "Udostępnij",
  "common.continue": "Dalej",
  "common.try_again": "Spróbuj ponownie",
  "common.settings": "Ustawienia",
  "common.off": "Wył.",

  // ---- Dates ----
  "format.today": "Dziś",
  "format.yesterday": "Wczoraj",
  "format.minutes_ago": "{count} min temu",
  "format.hours_ago": "{count} h temu",
  "format.days_ago": "{count} dni temu",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Czaty",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Portfel",
  "nav.tab.profile": "Ty",
  "a11y.tab.new_peers": "{label}, ktoś nowy w pobliżu",
  "nav.notifications": "Powiadomienia",
  "chat.subtab.channels": "Kanały",
  "chat.subtab.direct": "Bezpośrednie",
  "chat.subtab.dms": "Wiadomości bezpośrednie",
  "chat.search.placeholder": "Szukaj w czatach…",
  "chat.search.a11y": "Szukaj w czatach i wiadomościach",
  "chat.search.close": "Zamknij wyszukiwanie",
  "chat.search.clear": "Wyczyść wyszukiwanie",
  "mesh.view.radar": "Widok radaru",
  "mesh.view.list": "Widok listy",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Lista",

  // ---- Legal document names ----
  "legal.last_updated": "Ostatnia aktualizacja: {date}",
  "legal.terms": "Regulamin",
  "legal.privacy": "Polityka prywatności",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Prywatna łączność w sieci mesh",
  "onboarding.welcome.cta": "Zaczynajmy",
  "onboarding.welcome.cta_hint":
    "Zaakceptuj poniższe warunki, żeby przejść dalej",
  "onboarding.welcome.consent_a11y":
    "Zaakceptuj regulamin i politykę prywatności",
  "onboarding.welcome.open_terms": "Otwórz regulamin",
  "onboarding.welcome.open_privacy": "Otwórz politykę prywatności",
  "onboarding.welcome.consent":
    "Naciskając {cta}, akceptujesz nasz {terms} i naszą {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Tworzenie tożsamości",
  "onboarding.identity.body":
    "Na tym urządzeniu powstaje para kluczy Ed25519.\nNic nigdzie nie jest wysyłane.",
  "onboarding.identity.failed_heading": "Nie udało się utworzyć kluczy",
  "onboarding.identity.failed_body":
    "To urządzenie nie pozwoliło Airhop bezpiecznie ich zapisać. Spróbuj ponownie albo uruchom telefon na nowo i otwórz Airhop jeszcze raz.",
  "onboarding.identity.steps_a11y": "Kroki: {steps}",
  "onboarding.identity.step.x25519": "Tworzenie statycznej pary kluczy X25519",
  "onboarding.identity.step.ed25519":
    "Tworzenie pary kluczy podpisujących Ed25519",
  "onboarding.identity.step.keychain":
    "Zapisywanie kluczy w pęku kluczy systemu",
  "onboarding.identity.step.peer_id": "Wyprowadzanie identyfikatora peera",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Twoja nazwa w sieci mesh",
  "onboarding.username.peer_id": "Identyfikator peera",
  "onboarding.username.card_a11y":
    "Twoja nazwa w sieci mesh to {username}. Identyfikator peera {peerID}. {props}.",
  "onboarding.username.explanation":
    "Ta nazwa jest deterministycznie wyprowadzona z twojego klucza publicznego. Jest taka sama na każdym urządzeniu, które widzi twój identyfikator peera.",
  "onboarding.username.cta": "Wejdź do Airhop",
  "onboarding.username.prop.algorithm": "Algorytm",
  "onboarding.username.prop.storage": "Przechowywanie",
  "onboarding.username.prop.storage_value": "Tylko pęk kluczy systemu",
  "onboarding.username.prop.account": "Wymagane konto",
  "onboarding.username.prop.account_value": "Brak",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Witaj w Airhop",
  "onboarding.hello.p1":
    "Cześć. Airhop powstał na bazie aplikacji bitchat jako niezależny projekt poboczny o otwartym kodzie. Nie jest powiązany ani firmowany przez projekt bitchat czy permissionless tech, to po prostu coś, co lubię budować i dzielić się tym ze społecznością.",
  "onboarding.hello.p2":
    "To pierwsze wydanie na iOS i Androida, więc choć testowałem je ze znajomymi, pewnie natrafisz na kilka błędów. Jeśli tak, albo jeśli masz pomysł na funkcję, chętnie o tym usłyszę. Załóż zgłoszenie na {github} albo napisz do mnie na {email}.",
  "onboarding.hello.p3":
    "Jeśli Airhop ci się przydaje, zostaw gwiazdkę na {github} albo opinię w {store}. To pomaga dotrzeć do większej liczby osób. Dzięki, że próbujesz!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Zanim telefon zapyta",
  "onboarding.primer.lede": "Oto co każde z nich robi, a czego nie.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Znajduje urządzenia w pobliżu i przekazuje wiadomości między nimi. Tak powstaje sieć mesh i działa bez internetu.",
  "onboarding.primer.location.title": "Lokalizacja",
  "onboarding.primer.location.body":
    "Umieszcza cię w kanałach okolicy, od kwartału po region. Airhop nigdy cię nie śledzi ani nie wysyła twojej dokładnej lokalizacji poza urządzenie.",
  "onboarding.primer.notifications.title": "Powiadomienia",
  "onboarding.primer.notifications.body":
    "Dostajesz alerty o nowych wiadomościach, nawet gdy aplikacja jest zamknięta. Powiadomienia powstają lokalnie na urządzeniu, bez udziału serwera.",
  "onboarding.primer.footnote":
    "Możesz odmówić. Wiadomości i tak podróżują przez internet, a zdanie możesz zmienić później w Ustawieniach.",
  "onboarding.primer.cta_a11y": "Przejdź do pytań o uprawnienia",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Dostęp do Bluetooth",
  "permission.bluetooth.purpose":
    "znajdować urządzenia w pobliżu przez sieć mesh",
  "permission.open_settings": "Otwórz Ustawienia",
  "permission.not_now": "Nie teraz",
  "permission.blocked_title": "{label} jest wyłączony",
  "permission.blocked_body": "Włącz go w Ustawieniach, żeby {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Coś poszło nie tak",
  "error.boundary.body":
    "Airhop natrafił na nieoczekiwany problem i musiał przerwać to, co pokazywał.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Kanały domyślne",
  "chat.channels.yours": "Twoje kanały",
  "chat.channels.none": "Jeszcze żadnych kanałów",
  "chat.channels.none_hint":
    "Naciśnij {plus} powyżej, żeby dołączyć do jakiegoś albo utworzyć własny.",
  "chat.channels.none_desc":
    "Jeszcze żadnych kanałów. Użyj przycisku dodawania w nagłówku, żeby dołączyć do jakiegoś albo utworzyć własny.",
  "chat.channels.show_fewer": "Pokaż mniej kanałów domyślnych",
  "chat.channels.show_less": "Pokaż mniej",
  "chat.channels.info": "Informacje o kanale",
  "chat.channels.pin": "Przypnij kanał",
  "chat.channels.unpin": "Odepnij kanał",
  "chat.channels.mute": "Wycisz kanał",
  "chat.channels.unmute": "Wyłącz wyciszenie kanału",
  "chat.channels.leave": "Opuść kanał",
  "chat.channels.leave_confirm": "Opuść",
  "chat.channels.clear_body":
    "Usunąć wszystkie wiadomości w {name}? Nie da się tego cofnąć.",
  "chat.channels.leave_body":
    "Opuścić {name}? Przestaniesz dostawać jego wiadomości, a historia zniknie z tego urządzenia.",
  "chat.channels.more_options": "Więcej opcji dla {name}",
  "chat.channels.teleported_tag": "{level}  ·  teleportacja",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Wyczyść czat",
  "chat.dm.remove_contact": "Usuń kontakt",
  "chat.dm.block": "Zablokuj tego peera",
  "chat.dm.block_confirm": "Zablokuj",
  "chat.dm.delete": "Usuń czat",
  "chat.dm.delete_body":
    "To usuwa rozmowę z twojej listy i kasuje jej wiadomości. Kontakt zostaje, a nowa wiadomość od tej osoby zaczyna świeży czat.",
  "chat.dm.in_range": "w zasięgu",
  "chat.dm.row_hint":
    "Naciśnij dwukrotnie i przytrzymaj, żeby zobaczyć więcej opcji",
  "chat.channels.row_hint":
    "Naciśnij dwukrotnie i przytrzymaj, żeby zobaczyć więcej opcji",
  "chat.dm.you_prefix": "Ty:",
  "chat.dm.none": "Brak wiadomości bezpośrednich",
  "chat.dm.none_desc":
    "Przejdź do zakładki Mesh i naciśnij peera, żeby zacząć zaszyfrowaną rozmowę bezpośrednią.",
  "chat.dm.contact_info": "Informacje o kontakcie",
  "chat.dm.pin": "Przypnij czat",
  "chat.dm.unpin": "Odepnij czat",
  "chat.dm.mute": "Wycisz czat",
  "chat.dm.unmute": "Wyłącz wyciszenie czatu",
  "chat.dm.clear_body":
    "Usunąć wszystkie wiadomości z {name}? Nie da się tego cofnąć.",
  "chat.dm.remove_contact_body":
    "Usunąć {name}? To kasuje rozmowę i zapomina kontakt. Ta osoba nadal może się do ciebie odezwać, pisząc ponownie.",
  "chat.dm.block_body":
    "Zablokować {name}? Nie zobaczysz tej osoby w zakładce Mesh ani nie dostaniesz od niej wiadomości, nawet gdy będzie w pobliżu.",
  "chat.dm.more_options": "Więcej opcji dla {name}",
  "chat.dm.remove_contact_short": "Usuń kontakt",
  "chat.dm.block_short": "Zablokuj kontakt",
  "chat.dm.delete_short": "Usuń czat",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Wyczyść wiadomości",
  "chat.clear_confirm": "Wyczyść",
  "chat.group_badge": "Grupa",
  "chat.more": "Więcej",
  "chat.no_messages": "Jeszcze żadnych wiadomości",
  "chat.you": "Ty",
  "chat.a11y.channel": "Kanał {name}",
  "chat.a11y.group": "Grupa {name}",
  "chat.a11y.muted": "wyciszony",
  "chat.a11y.pinned": "przypięty",

  // ---- Chats: start something new ----
  "chat.new.title": "Zacznij coś nowego",
  "chat.new.channel": "Utwórz kanał prywatny",
  "chat.new.channel_label": "Kanał prywatny",
  "chat.new.channel_desc":
    "Pokój, do którego dołączy każdy, kto ma link. Utwórz własny albo dołącz linkiem, który dostałeś.",
  "chat.new.group": "Utwórz grupę prywatną",
  "chat.new.group_label": "Grupa prywatna",
  "chat.new.group_desc":
    "Wybierz konkretne osoby. Do 16. Zostaje na Bluetooth.",
  "chat.new.place": "Przejdź do miejsca po geohashu",
  "chat.new.place_label": "Przejdź do miejsca",
  "chat.new.place_desc":
    "Otwórz kanał lokalizacyjny gdziekolwiek po jego geohashu.",
  "chat.new.reach": "Zasięg",
  "chat.new.reach_internet": "Dociera do członków przez Bluetooth i internet.",
  "chat.new.reach_mesh": "Działa w zasięgu Bluetooth, nie przez internet.",
  "chat.new.reach_internet_desc":
    "Dociera do członków także przez internet. Przekaźniki widzą, że kanał jest aktywny, nigdy jego wiadomości ani tego, kto w nim jest.",
  "chat.new.reach_mesh_desc":
    "Zostaje w lokalnej sieci mesh. Najbardziej prywatne, nic nie opuszcza zasięgu Bluetooth.",
  "chat.new.join_link": "Dołącz do kanału prywatnego linkiem z zaproszeniem",
  "chat.new.back_to_chooser": "Wróć do wyboru",
  "chat.new.create_channel": "Utwórz kanał",
  "chat.new.name_required": "Najpierw podaj nazwę kanału",
  "chat.new.name_taken": "Ta nazwa jest już zajęta",
  "chat.new.create": "Utwórz",
  "chat.new.e2ee":
    "Szyfrowanie na całej trasie. Tylko członkowie mogą czytać wiadomości.",
  "chat.new.invite_only":
    "Tylko z zaproszenia. Dołączy każdy, komu udostępnisz link. Przed resztą pozostaje ukryty, nawet przed peerami w pobliżu.",
  "chat.new.name_exists": "Kanał o tej nazwie już istnieje.",
  "chat.new.reach_bluetooth_chip": "Tylko Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Dołącz linkiem z zaproszeniem",

  // ---- Chats: join by link ----
  "chat.join.title": "Dołącz linkiem",
  "chat.join.not_airhop": "To nie jest link Airhop.",
  "chat.join.reach_internet": "Dociera do członków przez Bluetooth i internet.",
  "chat.join.reach_mesh": "Zostaje w zasięgu Bluetooth.",
  "chat.join.contact_card":
    "Wizytówka kontaktu. Dodaje tę osobę do twoich kontaktów i otwiera czat.",
  "chat.join.unverified": "Nie udało się zweryfikować tego linku",
  "chat.join.unverified_body":
    "Wizytówka nie zgadza się z własnymi kluczami, więc nie została dodana. Poproś o świeżą.",
  "chat.join.paste": "Wklej ze schowka",
  "chat.join.join": "Dołącz",
  "chat.join.public_channel":
    "Kanał publiczny {name}. Każdy w pobliżu może go czytać.",
  "chat.join.private_channel": "Kanał prywatny {name}. {reach}",
  "chat.join.dm_with": "Rozmowa bezpośrednia z {name}.",
  "chat.join.joined_as": "Dołączono jako {name}",
  "chat.join.name_clash_body":
    "Jesteś już w innym {name}. Nazwy kanałów to tylko etykiety, więc to zaproszenie otworzyło własny kanał, a ten, w którym byłeś, pozostaje nietknięty. Każdy z nich możesz przemianować w jego informacjach.",
  "chat.join.paste_hint":
    "Wklej zaproszenie zaczynające się od airhop://. Naciśnięcie linku też działa; to jest na wypadek linku, którego nie da się nacisnąć.",
  "chat.join.key_note":
    "Zaproszenie do kanału prywatnego niesie klucz, więc dołączenie jest natychmiastowe i nikt inny o nic nie jest pytany.",
  "chat.join.offline_note":
    "Działa offline. Link jest odczytywany na tym urządzeniu, a kanał sięga tam, gdzie ustawił to jego twórca.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Nie udało się otworzyć tej komórki. Spróbuj za chwilę.",
  "chat.jump.title": "Przejdź do miejsca",
  "chat.jump.saved": "ZAPISANE MIEJSCA",
  "chat.jump.anywhere":
    "Otwórz publiczny kanał lokalizacyjny gdziekolwiek, nawet w miejscu, w którym cię nie ma.",
  "chat.jump.geohash_note":
    "Podaj jego geohash. Kanał dzielą wszyscy, których lokalizacja wypada w tej komórce.",
  "chat.jump.teleport_note":
    "Pokazujesz się jako teleportowany, nie jako obecny w pobliżu. Dociera to wyłącznie przez internet.",
  "chat.jump.level_cell": "Komórka na poziomie: {level}",
  "chat.jump.already_here": "Już tu jesteś. Idź otwiera twój kanał {name}.",
  "chat.jump.open_direction": "Otwórz komórkę na {direction} od ciebie",
  "chat.jump.open_place": "Otwórz {name}",
  "chat.jump.remove_place": "Usuń {name} z zapisanych miejsc",
  "chat.jump.go": "Idź",
  "chat.jump.how":
    "Jak znaleźć geohash: otwórz kanał lokalizacyjny > naciśnij jego nazwę > skopiuj go stamtąd.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Nie udało się dotrzeć do każdego członka. Spróbuj ponownie, gdy będą w pobliżu.",
  "chat.group.you_were_added": "Dodano cię do {name}.",
  "chat.group.added_you": "Dodał cię do {name}",
  "chat.group.you_were_removed":
    "Usunięto cię z {name}. Nie możesz już tu czytać ani wysyłać wiadomości.",
  "chat.group.removed_you": "Usunął cię z {name}",
  "chat.group.add_failed": "Nie udało się ich dodać",
  "chat.group.add_failed_body":
    "Nic się nie zmieniło. Albo w tej chwili nie da się do nich dotrzeć, albo grupa jest pełna przy 16, albo nie jesteś jej twórcą.",
  "chat.group.remove_failed": "Nie udało się ich usunąć",
  "chat.group.remove_failed_body":
    "Nic się nie zmieniło. Tylko osoba, która utworzyła grupę, może zmieniać jej skład.",
  "chat.group.e2ee":
    "Szyfrowanie na całej trasie. Tylko członkowie mogą czytać wiadomości.",
  "chat.group.cap":
    "Do 16 osób wybranych przez ciebie. Nie ma linku z zaproszeniem, więc nikt nie wejdzie dzięki przesłaniu go dalej.",
  "chat.group.bluetooth":
    "Tylko Bluetooth. Członkowie poza zasięgiem dostają wiadomości, gdy wrócą.",
  "chat.group.members_label": "CZŁONKOWIE",
  "chat.group.none_in_range":
    "Nikogo nie ma w zasięgu. Członkowie muszą być w pobliżu, gdy tworzysz grupę.",
  "chat.group.create_title": "Utwórz grupę",
  "chat.group.name_placeholder": "Nazwa grupy",
  "chat.group.create": "Utwórz",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Lokalna sieć mesh · tylko Bluetooth",
  "chat.scope.mesh_desc":
    "Dociera do urządzeń w zasięgu Bluetooth (mniej więcej 10 do 100 metrów). Internet niepotrzebny. Idealne do koordynacji na miejscu.",
  "chat.scope.block": "Kwartał · ~100 m",
  "chat.scope.block_desc":
    "Zasięg na skalę kwartału. Wiadomości idą też przez internet, żeby peerzy tuż poza zasięgiem Bluetooth mogli brać udział.",
  "chat.scope.neighborhood": "Dzielnica · ~1 km",
  "chat.scope.neighborhood_desc":
    "Zasięg na poziomie dzielnicy. Z pomocą przekaźników peerzy z całej okolicy są osiągalni nawet bez bezpośredniego łącza Bluetooth.",
  "chat.scope.city": "Miasto · ~10 km",
  "chat.scope.city_desc":
    "Kanał na całe miasto. Korzysta z geolokalizowanych przekaźników internetowych, żeby dosięgnąć peerów w całej aglomeracji.",
  "chat.scope.province": "Województwo · ~100 km",
  "chat.scope.province_desc":
    "Zasięg wojewódzki. Połączony przez internet, sięga regionalnie na setki kilometrów.",
  "chat.scope.country": "Kraj albo region · ~1000 km",
  "chat.scope.country_desc":
    "Zasięg ogólnokrajowy. Każdy użytkownik Airhop albo bitchat w regionie może dołączyć i czytać wiadomości.",
  "chat.transport.bluetooth": "Tylko Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Tylko internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Polecenie /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Wyślij ciepłego uścisku",
  "chat.cmd.slap_hint": "Uderz dużym pstrągiem",
  "chat.status.sending": "Wysyłanie…",
  "chat.status.undo_send": "Cofnij wysyłkę",
  "chat.status.undo": "Cofnij",
  "chat.status.sent": "Wysłane",
  "chat.status.received": "Odebrane",
  "chat.status.failed": "Nieudane",
  "chat.status.canceled": "Anulowane",
  "chat.status.waiting": "Czekanie",
  "chat.status.sending_short": "Wysyłanie",
  "chat.status.receiving": "Odbieranie",
  "chat.thread.not_available": "Niedostępne tutaj",
  "chat.thread.private_channel": "Kanał prywatny",
  "chat.thread.location_channel": "Kanał lokalizacyjny",
  "chat.thread.public_channel": "Kanał publiczny",
  "chat.thread.notices": "Ogłoszenia z tego kanału",
  "chat.thread.invite": "Zaproś kogoś do tego kanału",
  "chat.thread.not_in_range":
    "Poza zasięgiem Bluetooth. Dostarczamy przez internet.",
  "chat.thread.not_nearby":
    "Nie ma tej osoby w pobliżu. Dostarczymy, gdy wróci w zasięg albo pojawi się online.",
  "chat.thread.no_keys":
    "Żeby do nich napisać, musisz być w zasięgu Bluetooth albo zeskanować ich kod.",
  "chat.geo.card_received":
    "{name} udostępnił swój kontakt. Udostępnij swój w zamian, żeby dało się rozmawiać dalej, gdy któreś z was się przeniesie.",
  "chat.geo.exchange_complete":
    "Kontakty wymienione. Teraz możecie się nawzajem dosięgnąć skądkolwiek.",
  "chat.geo.keep_person": "Zachowaj tę osobę",
  "chat.geo.keep_person_desc":
    "Udostępnij swój kontakt, żeby dało się rozmawiać dalej, gdy któreś z was się przeniesie. Ta osoba pozna twoją stałą tożsamość.",
  "chat.geo.card_sent": "Udostępniono · czekanie na ich",
  "chat.thread.left_cell":
    "Opuściłeś tę okolicę, więc nie dosięgną cię tutaj. Wymieńcie kody, żeby rozmawiać dalej gdziekolwiek.",
  "chat.thread.no_route":
    "W tej chwili nie da się do nich dotrzeć. Wiadomość wyjdzie, gdy pojawi się trasa.",
  "chat.thread.empty": "Jeszcze żadnych wiadomości",
  "chat.thread.empty_desc": "Zacznij zaszyfrowaną rozmowę.",
  "chat.thread.jump_latest": "Przejdź do najnowszej wiadomości",
  "chat.thread.back_to_members": "Wróć do członków",
  "chat.thread.nostr_key": "Klucz publiczny Nostr",
  "chat.thread.in_range": "W zasięgu",
  "chat.voice.not_recorded": "Notatka głosowa się nie nagrała",
  "chat.thread.message": "Wiadomość",
  "chat.thread.message_placeholder": "Wiadomość…",
  "chat.thread.length_full": "Wiadomość jest pełna",
  "chat.thread.waiting_for": "Czekanie na powrót osoby {name} · {percent}%",
  "chat.thread.peer": "peer",
  "chat.thread.cancel_transfer": "Anuluj {name}",
  "chat.thread.queued_more": "jeszcze {count} czeka na wysłanie",
  "chat.thread.across_bridge": "{count} po drugiej stronie mostu",
  "chat.thread.bridged": "przez most",
  "chat.thread.invite_body":
    "Dołącz do mnie w {channel} na Airhop — prywatne wiadomości w sieci mesh, działające przede wszystkim offline.",
  "chat.thread.go_back_unread": "Wstecz, {count} nieprzeczytanych",
  "chat.thread.view_info": "Pokaż informacje o {name}",
  "chat.thread.notices_new": "Ogłoszenia z tego kanału, {count} nowych",
  "chat.thread.say_something": "Powiedz coś w {channel}.",
  "chat.thread.jump_latest_new":
    "Przejdź do najnowszej wiadomości, {count} nowych",
  "chat.thread.unconfirmed_since": "Brak potwierdzonej dostawy od {date}",
  "chat.thread.no_reach":
    "Brak peerów w pobliżu · nikt tego jeszcze nie dostał",
  "chat.thread.channel_needs_internet":
    "Internet wyłączony · ten kanał dociera tylko do ludzi w zasięgu Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet wyłączony · do tej komórki da się dotrzeć wyłącznie przez internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet wyłączony · ta rozmowa idzie wyłącznie przez internet",
  "chat.thread.via_gateway":
    "Internet wyłączony · urządzenie w pobliżu wynosi to za ciebie do sieci",
  "chat.thread.group_queued":
    "Nikogo z tej grupy nie ma jeszcze w pobliżu. Dotrze do nich, gdy się pojawią.",
  "chat.thread.no_group_key":
    "Nie jesteś już w tej grupie, więc nie da się tego wysłać",
  "chat.thread.no_reach_offline":
    "Internet wyłączony i brak peerów w pobliżu · nikt tego jeszcze nie dostał",
  "chat.thread.mention": "Wspomnij {name}",
  "chat.thread.someone_talking": "{hold}. {name} mówi.",
  "chat.thread.attach_note":
    "Pliki idą tylko w zasięgu Bluetooth. Tekst i płatności docierają do kontaktów przez internet; załączniki nie.",
  "chat.thread.message_peer": "Napisz do {name}",
  "chat.thread.send": "Wyślij wiadomość",
  "chat.thread.group": "Grupa",
  "chat.bridge.nearby_only":
    "Tylko w pobliżu: trzymaj tę wiadomość z dala od mostu mesh",
  "chat.bridge.nearby_label": "Tylko w pobliżu · zostaje na Bluetooth",
  "chat.bridge.bridging_label":
    "Mostkowanie do okolicznych obszarów · naciśnij, żeby zostawić tylko w pobliżu",
  "chat.screenshot.you_took": "Zrobiłeś zrzut ekranu",
  "chat.screenshot.you_took_private":
    "Zrobiłeś zrzut ekranu · nikomu nie powiedziano",
  "chat.screenshot.heads_up": "Uwaga",
  "chat.screenshot.notice": "* {name} zrobił zrzut ekranu *",
  "chat.screenshot.notified_dm":
    "{name} został poinformowany, że zrobiłeś zrzut ekranu tej rozmowy.",
  "chat.screenshot.notified":
    "Wszyscy w tym kanale zostali poinformowani, że zrobiłeś zrzut ekranu.",
  "chat.screenshot.not_notified":
    "Nikogo nie poinformowano. Ten kanał jest publiczny, więc ogłoszenie zrzutu ekranu odnotowałoby, że tu byłeś.",
  "chat.thread.error": "Błąd",
  "chat.thread.go_back": "Wstecz",
  "chat.bubble.via_bridge": "przez most mesh",
  "chat.bubble.view_profile": "Pokaż profil osoby {name}",
  "chat.bubble.forwarded": "Przesłane dalej",
  "chat.bubble.attachment": "załącznik",
  "chat.bubble.a11y":
    "{sender}: {body}. Przytrzymaj, żeby zobaczyć więcej opcji.",
  "chat.bubble.failed_retry":
    "Nie udało się wysłać. Naciśnij, żeby spróbować ponownie.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Informacje o wiadomości",
  "chat.info.delivered_to": "Dostarczono do {name}",
  "chat.info.read_by": "Przeczytane przez {name}",
  "chat.info.group_reach_desc": "Osiągalni teraz, to nie potwierdzenie dostawy",
  "chat.info.group_alone": "Brak innych członków",
  "chat.info.today_at": "Dziś {time}",
  "chat.info.sending": "Wysyłanie…",
  "chat.info.failed": "Nie udało się wysłać",
  "chat.info.courier": "Niesione przez znajomego",
  "chat.info.sent": "Wysłane",
  "chat.info.queued": "Czeka na wysłanie",
  "chat.info.waiting": "Czekanie…",
  "chat.action.info": "Informacje o wiadomości",
  "chat.action.save_photos": "Zapisz w zdjęciach",
  "chat.action.save_copy": "Zapisz kopię",
  "chat.action.forward": "Prześlij dalej",
  "chat.action.select": "Wybierz",
  "chat.select.cancel": "Anuluj wybór",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Aparat",
  "chat.attach.camera_desc": "Zrób zdjęcie albo film",
  "chat.attach.library": "Galeria zdjęć",
  "chat.attach.library_desc": "Wybierz z galerii",
  "chat.attach.document": "Dokument",
  "chat.attach.document_desc": "Wyślij dowolny plik albo PDF",
  "chat.attach.voice": "Notatka głosowa",
  "chat.attach.voice_desc": "Nagraj i wyślij wiadomość głosową",
  "chat.attach.ecash": "Wyślij ecash",
  "chat.attach.ecash_desc": "Wyślij saty Cashu ze swojego portfela",
  "chat.attach.location": "Lokalizacja",
  "chat.attach.location_desc": "Wyślij, gdzie teraz jesteś",
  "chat.attach.title": "Załącz",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Udostępnił lokalizację",
  "chat.location.received_summary": "Udostępnił swoją lokalizację",
  "chat.location.title": "Lokalizacja",
  "chat.location.away": "{distance} na {direction}",
  "chat.location.taken": "Pobrana {ago} temu",
  "chat.location.open_maps": "Otwórz w Mapach",
  "chat.location.no_forward": "Lokalizacje nie są przesyłane dalej",
  "chat.location.no_forward_body":
    "Lokalizacja idzie do jednej osoby. Udostępnij swoją, jeśli chcesz, żeby miał ją ktoś inny.",
  "chat.location.no_fix":
    "Zezwól na lokalizację, żeby zobaczyć, jak daleko to jest",
  "chat.location.send_title": "Wyślij swoją lokalizację",
  "chat.location.send_body":
    "{name} zobaczy jeden punkt: gdzie jesteś teraz. Nie będzie się dalej odświeżać.",
  "chat.location.send": "Wyślij lokalizację",
  "chat.location.finding": "Ustalanie twojej lokalizacji…",
  "chat.location.no_location": "Nie udało się pobrać twojej lokalizacji",
  "chat.location.no_location_body":
    "Zezwól na dostęp do lokalizacji i upewnij się, że usługi lokalizacji są włączone, a potem spróbuj ponownie.",
  "chat.location.not_delivered": "Nie udało się wysłać twojej lokalizacji",
  "chat.location.not_delivered_body":
    "Lokalizację warto wysyłać, tylko dopóki jest aktualna, więc nie czeka w kolejce na później. Spróbuj ponownie, gdy da się dotrzeć do {name}.",
  "chat.location.direction.n": "północ",
  "chat.location.direction.ne": "północny wschód",
  "chat.location.direction.e": "wschód",
  "chat.location.direction.se": "południowy wschód",
  "chat.location.direction.s": "południe",
  "chat.location.direction.sw": "południowy zachód",
  "chat.location.direction.w": "zachód",
  "chat.location.direction.nw": "północny zachód",
  "chat.attach.send_anyway": "Wyślij mimo to",
  "chat.attach.bitchat_too_big": "To może nie dotrzeć",
  "chat.attach.bitchat_too_big_body":
    "{name} używa aplikacji bitchat, która poddaje się w połowie przy dużym pliku. Poniżej mniej więcej 350 KiB jest niezawodnie. Wysyłka do kontaktu z Airhop nie ma takiego limitu.",
  "chat.attach.bitchat_unopenable": "Mogą tego nie otworzyć",
  "chat.attach.bitchat_unopenable_body":
    "{name} używa aplikacji bitchat, która pokazuje zdjęcia i notatki głosowe, ale wszystko inne wypisuje jako plik, którego nie umie otworzyć. Dotrze, tylko mogą nie dać rady tego obejrzeć.",
  "chat.attach.file": "Załącz plik",
  "chat.attach.unavailable": "Załączniki są tutaj niedostępne",
  "chat.attach.not_sent": "Załącznik niewysłany",
  "chat.attach.read_failed":
    "Coś poszło nie tak przy odczycie tego pliku. Spróbuj innego.",
  "chat.attach.caption": "Dodaj podpis…",
  "chat.attach.send": "Wyślij załącznik",
  "chat.attach.generic": "Załącznik",
  "chat.media.view_full": "Pokaż zdjęcie na pełnym ekranie",
  "chat.media.gone_photo": "Zdjęcia nie ma na tym urządzeniu",
  "chat.media.gone_video": "Filmu nie ma na tym urządzeniu",
  "chat.media.gone_voice": "Notatki głosowej nie ma na tym urządzeniu",
  "chat.media.gone_file": "Pliku nie ma na tym urządzeniu",
  "chat.media.gone_note":
    "Usunięte po 7 dniach albo przy czyszczeniu pamięci podręcznej",
  "chat.media.ask_resend": "Poproś ponownie",
  "chat.media.resend_draft": "Możesz wysłać {kind} jeszcze raz?",
  "chat.media.kind_photo": "tamto zdjęcie",
  "chat.media.kind_video": "tamten film",
  "chat.media.kind_voice": "tamtą notatkę głosową",
  "chat.media.kind_file": "tamten plik",
  "chat.media.pause_voice": "Wstrzymaj notatkę głosową",
  "chat.media.play_voice": "Odtwórz notatkę głosową",
  "chat.media.voice_position": "Pozycja w notatce głosowej",
  "chat.media.voice_scrub":
    "Naciśnij wzdłuż słupków, żeby przeskoczyć w to miejsce",
  "chat.media.image": "Obraz",
  "chat.media.tap_load_photo": "Naciśnij, żeby wczytać zdjęcie",
  "chat.media.open_document": "Otwórz {name}",
  "chat.media.document": "dokument",
  "chat.media.tap_load_video": "Naciśnij, żeby wczytać film",
  "chat.media.video": "Wideo",
  "chat.media.photo": "Zdjęcie",
  "chat.media.close_photo": "Zamknij zdjęcie",
  "chat.media.save_photo": "Zapisz zdjęcie w swoich zdjęciach",
  "chat.media.share_photo": "Udostępnij zdjęcie",
  "chat.media.saved_videos": "Zapisano w twoich filmach",
  "chat.media.saved_photos": "Zapisano w twoich zdjęciach",
  "chat.media.not_saved": "Niezapisane",
  "chat.media.cant_open": "Nie da się otworzyć pliku",
  "chat.media.no_app":
    "To urządzenie nie ma aplikacji, która otworzy albo udostępni ten plik.",
  "chat.media.open_failed":
    "Nie udało się otworzyć pliku. Mógł zostać usunięty z pamięci podręcznej.",
  "media.blocked.nostr_only":
    "Znasz tę osobę tylko przez przekaźnik. Dostępny jest wyłącznie tekst. Zdjęcia, pliki i notatki głosowe wymagają Bluetooth.",
  "media.blocked.private_channel":
    "Rozgłaszany załącznik jest podpisany, ale nieszyfrowany, więc wysłanie go na kanał prywatny wystawiłoby go otwarcie, podczas gdy tekst tutaj pozostaje zaszyfrowany.",
  "media.blocked.private_group":
    "Rozgłaszany załącznik jest podpisany, ale nieszyfrowany, więc wysłanie go do grupy prywatnej wystawiłoby go otwarcie, podczas gdy tekst tutaj pozostaje zaszyfrowany.",
  "media.blocked.location_channel":
    "Kanał lokalizacyjny dociera przez internet, a zdjęcia, pliki i notatki głosowe idą przez Bluetooth, więc nigdy by nie dotarły.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Notatki głosowe są tutaj niedostępne",
  "chat.voice.hold_live": "Przytrzymaj, żeby mówić na żywo",
  "chat.voice.hold_record": "Przytrzymaj, żeby nagrać notatkę głosową",
  "chat.voice.cancel_recording": "Anuluj nagrywanie",
  "chat.voice.slide_cancel": "Przesuń, żeby anulować",
  "chat.voice.release_cancel": "Puść, żeby anulować",
  "chat.voice.a11y_toggle":
    "Naciśnij dwukrotnie, żeby zacząć albo przestać mówić.",
  "chat.voice.limit_reached": "Osiągnięto limit dwóch minut, puść, żeby wysłać",
  "chat.voice.limit_sent": "Osiągnięto limit dwóch minut, notatka wysłana",
  "chat.voice.stop_send": "Zatrzymaj nagrywanie i wyślij",
  "chat.voice.lift_lock": "Przesuń w górę, żeby nagrywać bez trzymania",
  "chat.voice.live_speaking": "{name} mówi",
  "voice.unavailable": "Głos na żywo niedostępny",
  "voice.recording_stopped": "Nagrywanie zatrzymane",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Dostęp do aparatu",
  "chat.perm.camera_purpose": "zrobić zdjęcie do wysłania",
  "chat.perm.photo_label": "Dostęp do zdjęć",
  "chat.perm.photo_purpose": "wybrać zdjęcie albo film do wysłania",
  "chat.perm.photo_save_purpose": "zapisać to w twoich zdjęciach",
  "chat.perm.mic_label": "Dostęp do mikrofonu",
  "chat.perm.mic_live_purpose": "rozmawiać z ludźmi w pobliżu",
  "chat.perm.mic_note_purpose": "nagrać notatkę głosową",
  "chat.perm.recording_stopped": "Nagrywanie zatrzymane",
  "chat.perm.record_failed":
    "Nie udało się rozpocząć nagrywania. Sprawdź uprawnienia do mikrofonu.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Odebrane",
  "chat.ecash.reclaimed": "Odzyskane",
  "chat.ecash.claiming": "Odbieranie…",
  "chat.ecash.claim": "Odbierz",
  "chat.ecash.claim_amount": "Odbierz {amount} {unit}",
  "chat.ecash.already_claimed": "Już odebrane",
  "chat.ecash.already_claimed_body":
    "Każdy dowód z tego tokena już jest w twoim portfelu, więc nic nie przybyło.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Przekazane sieci mesh z dostawą w miarę możliwości",
  "chat.info.queued_desc":
    "Trzymane na tym telefonie, dopóki nie pojawi się do nich trasa",
  "chat.info.reclaimed": "Odzyskane",
  "chat.info.reclaimed_desc":
    "Wziąłeś tę płatność z powrotem do portfela, więc nie zostanie dostarczona",
  "chat.info.about": "O tym",
  "chat.info.group_desc":
    "Grupa prywatna. Czytać mogą ją tylko członkowie dodani przez twórcę, a ona sama zostaje na Bluetooth.",
  "chat.info.teleported_desc":
    "Publiczny kanał lokalizacyjny dla tej komórki geohash. Dzielą go przez internet wszyscy w tej komórce, na Airhop albo bitchat. Jesteś teleportowany, nie ma cię tu fizycznie.",
  "chat.info.custom_desc":
    "Kanał własny. Dołączy każdy, kto zna nazwę, z dowolnego urządzenia z Airhop albo bitchat.",
  "chat.info.private_e2ee": "Prywatny · szyfrowany na całej trasie",
  "chat.info.public_plain": "Publiczny · nieszyfrowany",
  "chat.info.group_privacy":
    "Tylko członkowie pokazani poniżej mogą czytać tę grupę. Wiadomości zostają na Bluetooth, więc członkowie poza zasięgiem dostają je po powrocie.",
  "chat.info.teleport_privacy":
    "Miejsce, do którego się teleportowałeś. Dociera przez internet do wszystkich w tej komórce i do nikogo w zasięgu Bluetooth.",
  "chat.info.location_off_privacy":
    "Lokalizacja jest wyłączona, więc ten kanał dociera do urządzeń w pobliżu wyłącznie przez Bluetooth. Włącz lokalizację, żeby sięgnąć jego komórki obszaru przez internet.",
  "chat.info.invite_privacy":
    "Czytać mogą go tylko ludzie zaproszeni przez ciebie linkiem. Przed resztą pozostaje ukryty, nawet przed peerami w pobliżu.",
  "chat.info.public_privacy":
    "Każdy, kto dołączy, może przeczytać każdą wiadomość. Do prywatnej rozmowy użyj wiadomości bezpośredniej; te są szyfrowane na całej trasie.",
  "chat.info.remove_member": "Usuń członka",
  "chat.info.remove_member_body":
    "Usunąć {name} z grupy? Klucz grupy zostanie wymieniony, więc ta osoba nie przeczyta już nowych wiadomości.",
  "chat.info.message_member": "Napisz do {name}",
  "chat.info.remove_member_a11y": "Usuń {name}",
  "chat.info.no_addable":
    "Brak osiągalnych peerów do dodania. Członkowie muszą być w pobliżu.",
  "chat.info.add_count": "Dodaj {count}",
  "chat.info.teleported_tag": "{level}  ·  teleportacja",
  "chat.info.active": "Aktywni",
  "chat.info.members": "Członkowie",
  "chat.info.bookmark": "Zapisz to miejsce",
  "chat.info.remove_bookmark": "Usuń z zapisanych miejsc",
  "chat.info.default_notice":
    "Kanałów domyślnych nie da się opuścić. Należą do protokołu sieci mesh aplikacji Airhop.",
  "chat.info.custom_channel": "Kanał własny",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Kopiuj geohash",
  "chat.info.relays": "Przekaźniki",
  "chat.info.show_relays": "Pokaż przekaźniki niosące ten kanał",
  "chat.info.relay_custom": "własny",
  "chat.info.relays_none":
    "Żadnych. Ta komórka jest w tej chwili tylko na Bluetooth.",
  "chat.info.search_members": "Szukaj członków",
  "chat.info.search_members_placeholder": "Szukaj członków…",
  "chat.info.teleported": "Teleportowany",
  "chat.info.creator": "Twórca",
  "chat.info.no_matches": "Brak wyników",
  "chat.info.no_one_here": "Jeszcze nikogo tu nie ma",
  "chat.info.add_members": "Dodaj członków",
  "chat.info.add_selected": "Dodaj wybranych członków",
  "chat.info.add": "Dodaj",
  "chat.info.leave_group": "Opuść grupę",
  "chat.info.leave_channel": "Opuść kanał",
  "chat.info.leave": "Opuść",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Rozmawiacie od {date}",
  "chat.contact.verified_since": "Zweryfikowany od {date}",
  "chat.contact.anonymous": "Anonimowy",
  "chat.contact.anonymous_desc":
    "Pseudonim z geohasha bez trwałej tożsamości do zweryfikowania",
  "chat.contact.verified": "Zweryfikowany",
  "chat.contact.verified_desc": "Zeskanowałeś ich kod QR",
  "chat.contact.verified_desc_compared": "Porównaliście kody",
  "chat.contact.not_verified": "Niezweryfikowany",
  "chat.contact.not_verified_desc":
    "Zeskanuj ich kod albo porównajcie jakiś przez telefon, żeby potwierdzić, że to naprawdę oni",
  "chat.contact.e2ee": "Szyfrowane na całej trasie",
  "chat.contact.e2ee_nostr":
    "Opakowane wedle NIP-17, więc przekaźniki tego nie odczytają",
  "chat.contact.e2ee_mesh":
    "Noise XX, plus Double Ratchet między urządzeniami z Airhop",
  "chat.contact.copy_nostr": "Kopiuj klucz publiczny Nostr",
  "chat.contact.nostr_key": "Klucz publiczny Nostr",
  "chat.contact.cell_key_note":
    "Ten klucz należy do okolicy, w której się spotkaliście. Zmienia się, gdy któreś z was się przeniesie, i rozmowa kończy się razem z nim. Wymieńcie kontakty, żeby rozmawiać dalej gdziekolwiek.",
  "chat.contact.peer_name": "Nazwa peera",
  "chat.contact.peer_id": "Identyfikator peera",
  "chat.contact.rename": "Zmień nazwę",
  "chat.contact.rename_needs_contact":
    "Możesz zmieniać nazwy osobom, których klucze masz. Najpierw wymieńcie wizytówki, a wtedy stanie się to nazwą, którą widzisz tylko ty.",
  "chat.contact.rename_needs_keys":
    "Brak jeszcze kluczy do tego kontaktu. Napisz do nich albo zeskanuj ich kod, a wtedy nadasz im nazwę, którą widzisz tylko ty.",
  "chat.contact.renamed_by_you": "Twoja nazwa dla tej osoby",
  "chat.contact.copy_peer_id": "Kopiuj identyfikator peera",
  "chat.contact.verify": "Zweryfikuj kontakt",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Ogłoszenia",
  "chat.notices.post_area": "Wywieś ogłoszenie w tej okolicy",
  "chat.notices.post_mesh": "Wywieś ogłoszenie w sieci mesh",
  "chat.notices.mark_urgent": "Oznacz jako pilne",
  "chat.notices.post": "Wywieś ogłoszenie",
  "chat.notices.post_short": "Wywieś",
  "chat.notices.delete": "Usuń ogłoszenie",
  "chat.notices.just_now": "przed chwilą",
  "chat.notices.fades_soon": "wkrótce zniknie",
  "chat.notices.1_day": "1 dzień",
  "chat.notices.3_days": "3 dni",
  "chat.notices.7_days": "7 dni",
  "chat.notices.fading": "znika",
  "chat.notices.fades_in_hours": "zniknie za {count} h",
  "chat.notices.fades_in_days": "zniknie za {count} dni",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Mesh",
  "chat.notices.urgent_short": "Pilne",
  "chat.notices.permanent_warning":
    "Nigdy nie znika. Publiczne i przypisane do tej okolicy, a ty nie możesz tego cofnąć.",
  "chat.notices.none":
    "Jeszcze żadnych ogłoszeń. Wywieś jedno, żeby zostało tu dla innych.",

  // ---- Chats: search results ----
  "chat.search.photos": "Zdjęcia",
  "chat.search.videos": "Filmy",
  "chat.search.audio": "Dźwięk",
  "chat.search.documents": "Dokumenty",
  "chat.search.links": "Linki",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filtruj: {filter}",
  "chat.search.no_matches": "Brak wyników w kategorii {filter} dla „{query}”",
  "chat.search.no_media": "Jeszcze nic w kategorii {filter}",
  "chat.search.result_a11y": "{chat}, {kind} od {sender}",
  "chat.search.you": "ty",
  "chat.search.section_chats": "Czaty",
  "chat.search.section_messages": "Wiadomości",
  "chat.search.section_notices": "Ogłoszenia",
  "chat.search.hint":
    "Szukaj w wiadomościach i czatach albo wybierz filtr powyżej.",
  "chat.search.no_results": "Brak wyników dla „{query}”",
  "chat.search.open_chat": "Otwórz {name}",
  "chat.search.message_a11y": "{chat}, wiadomość od {sender}: {snippet}",
  "chat.search.notice_a11y": "Ogłoszenie w {chat} od {author}: {snippet}",
  "chat.search.urgent": "Pilne ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Na tej liście jest {count}. Wyczyszczenie usuwa je tylko stąd, a wiadomości zostają nieprzeczytane w swoich rozmowach. Oznaczenie wszystkich jako przeczytane porządkuje jedno i drugie.",
  "chat.notif.mark_all_read": "Oznacz wszystkie jako przeczytane",
  "chat.notif.clear_list": "Wyczyść listę",
  "chat.notif.clear_all_a11y": "Wyczyść wszystkie powiadomienia: {count}",
  "chat.notif.title": "Powiadomienia",
  "chat.notif.clear_short": "Wyczyść",
  "chat.notif.close": "Zamknij powiadomienia",
  "chat.notif.none": "Jeszcze żadnych powiadomień",
  "chat.notif.none_desc":
    "Wiadomości, wzmianki i ogłoszenia z twoich kanałów i czatów pojawiają się tutaj.",
  "chat.notif.new": "Nowe",
  "chat.notif.notice_in": "ogłoszenie w {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Prześlij dalej do…",
  "chat.forward.to": "Prześlij dalej do {name}",
  "chat.forward.cant_send_here": "Nie da się tu przesłać dalej",
  "chat.forward.cant_send_to": "Nie da się przesłać dalej do {name}",
  "chat.forward.channels": "Kanały",
  "chat.forward.groups": "Grupy",
  "chat.forward.locations": "Lokalizacje",
  "chat.forward.dms": "Wiadomości bezpośrednie",
  "chat.forward.none": "Jeszcze żadnych innych czatów",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Uruchamianie sieci mesh…",
  "mesh.banner.no_bluetooth":
    "Brak Bluetooth na tym urządzeniu · tylko internet",
  "mesh.banner.bluetooth_off": "Bluetooth wyłączony · sieć mesh niedostępna",
  "mesh.banner.permission_needed": "Potrzebne uprawnienie do Bluetooth",
  "mesh.banner.blocked":
    "Bluetooth zablokowany · zezwól na niego w Ustawieniach",
  "mesh.banner.location_permission":
    "Lokalizacja potrzebna, żeby znaleźć peerów",
  "mesh.banner.advertising_unsupported":
    "Ten telefon widzi innych, ale sam nie da się wykryć",
  "mesh.banner.location_off_android":
    "Lokalizacja wyłączona · Android potrzebuje jej, żeby znaleźć peerów",
  "mesh.banner.paused": "Sieć mesh wstrzymana · jesteś niedostępny",
  "mesh.banner.location_off":
    "Lokalizacja wyłączona · kanały lokalizacyjne niedostępne",
  "mesh.banner.battery_saver": "Oszczędzanie baterii · rzadsze skanowanie",
  "mesh.banner.wipe_incomplete":
    "Czyszczenie niedokończone · część danych może zostać, ponowna próba po otwarciu",
  "mesh.banner.wifi_off": "Wi-Fi wyłączone · duże pliki idą wolniej",
  "mesh.banner.clock_skew":
    "Zegar tego telefonu jest przestawiony · ustaw datę i godzinę na automatyczne",
  "mesh.banner.internet_off": "Internet wyłączony · tylko Bluetooth",
  "mesh.banner.relaying": "Brak peerów w pobliżu · przekazywanie przez Nostr",
  "mesh.banner.tor": "Tor włączony · ruch internetowy przekierowany",
  "mesh.banner.tor_starting": "Uruchamianie Tor · łączenie",
  "mesh.banner.tor_blocked":
    "Tor nie mógł się połączyć · sieć mesh nadal działa",
  "mesh.banner.gateway":
    "Brama internetowa włączona · przekazywanie dla peerów w pobliżu",
  "mesh.banner.bridge": "Most mesh włączony · czat publiczny połączony",
  "mesh.banner.background_limits": "{brand} może wstrzymać sieć mesh w tle",
  "mesh.banner.bridge_across":
    "Most mesh włączony · {count} po drugiej stronie mostu",
  "mesh.banner.action.turn_on": "Włącz",
  "mesh.banner.action.allow": "Zezwól",
  "mesh.banner.action.resume": "Wznów",
  "mesh.banner.action.fix": "Napraw",
  "mesh.banner.hint.resume":
    "Ponownie włącza rozgłaszanie i skanowanie Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Prosi Androida o włączenie Bluetooth",
  "mesh.banner.hint.location_settings":
    "Otwiera systemowe ustawienia lokalizacji",
  "mesh.banner.hint.app_settings":
    "Otwiera uprawnienia aplikacji Airhop w ustawieniach systemu",
  "mesh.banner.hint.battery_settings":
    "Otwiera ustawienia aktywności w tle tego telefonu",
  "mesh.banner.dismiss": "Odrzuć: {label}",
  "mesh.banner.hint.dismiss": "Ukrywa tę informację na dobre",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Szukanie peerów w pobliżu…",
  "mesh.radar.starting": "Uruchamianie sieci mesh…",
  "mesh.radar.no_bluetooth": "Brak Bluetooth na tym urządzeniu",
  "mesh.radar.bluetooth_off": "Bluetooth wyłączony · brak skanowania",
  "mesh.radar.permission_needed": "Potrzebne uprawnienie do Bluetooth",
  "mesh.radar.blocked": "Bluetooth zablokowany",
  "mesh.radar.location_permission": "Potrzebne uprawnienie do lokalizacji",
  "mesh.radar.location_off": "Lokalizacja wyłączona · brak skanowania",
  "mesh.radar.hint_rings":
    "Pierścienie pokazują siłę sygnału BLE, nie odległość",
  "mesh.radar.hint_checking": "Sprawdzanie Bluetooth i uprawnień",
  "mesh.radar.hint_internet": "Wiadomości i tak podróżują przez internet",
  "mesh.radar.hint_turn_on": "Włącz Bluetooth, żeby znaleźć peerów",
  "mesh.radar.hint_allow": "Zezwól na Bluetooth, żeby znaleźć peerów",
  "mesh.radar.hint_allow_settings":
    "Zezwól na Bluetooth w Ustawieniach, żeby znaleźć peerów",
  "mesh.radar.hint_location_permission":
    "Android 11 i starsze potrzebują lokalizacji do skanowania przez Bluetooth",
  "mesh.radar.hint_android_location":
    "Android potrzebuje włączonej lokalizacji, żeby zwrócić wyniki skanowania Bluetooth",
  "mesh.radar.signal_strong": "Silny",
  "mesh.radar.signal_medium": "Średni",
  "mesh.radar.signal_weak": "Słaby",
  "mesh.radar.you_center": "Ty, w środku sieci mesh",
  "mesh.radar.sonar_hint":
    "Odtwarza omiatanie sonaru. Skanowanie i tak trwa bez przerwy.",
  "mesh.radar.paused": "Sieć mesh wstrzymana · jesteś niedostępny",
  "mesh.radar.ring_hint":
    "Położenie na pierścieniu odzwierciedla siłę sygnału, nie odległość",
  "mesh.radar.set_online":
    "Ustaw status na Dostępny w zakładce Ty, żeby znaleźć peerów",
  "mesh.radar.in_range": "w zasięgu",
  "mesh.radar.recently_seen": "widziani niedawno",
  "mesh.radar.peer_hint":
    "Otwiera opcje napisania do tego peera albo zapłacenia mu",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "przed chwilą",
  "mesh.peer.none": "Brak peerów w pobliżu",
  "mesh.peer.none_desc":
    "Inne urządzenia z Airhop albo bitchat w zasięgu Bluetooth pojawiają się tutaj.",
  "mesh.peer.id_copied": "Skopiowano identyfikator peera",
  "mesh.peer.copy_id": "Kopiuj identyfikator peera",
  "mesh.peer.their_name": "Podaje się za {name}",
  "mesh.peer.in_range": "W zasięgu",
  "mesh.peer.relay": "Węzeł przekaźnikowy",
  "mesh.peer.relay_body":
    "Radio, które ktoś zostawił włączone, żeby poszerzyć sieć mesh. Przenosi wiadomości, których nie potrafi odczytać. Nie ma tu do kogo napisać.",
  "mesh.peer.send_dm": "Wyślij wiadomość bezpośrednią",
  "mesh.peer.message": "Wiadomość",
  "mesh.peer.send_sats": "Wyślij ecash",
  "mesh.peer.amount_placeholder": "Kwota w satach",
  "mesh.peer.amount_first": "Wyślij ecash, najpierw podaj kwotę",
  "mesh.peer.cancel_send": "Anuluj wysyłanie ecash",
  "mesh.peer.view_peer": "Pokaż peera {name}",
  "mesh.peer.view_peer_online": "Pokaż peera {name}, dostępny",
  "mesh.peer.last_seen": "Widziany {ago} temu",
  "mesh.peer.send_amount": "Wyślij {amount} satów",
  "mesh.peer.direct": "Połączenie bezpośrednie",
  "mesh.peer.check_distance": "Sprawdź odległość",
  "mesh.peer.checking": "Sprawdzanie",
  "mesh.peer.no_reply": "Brak odpowiedzi",
  "mesh.peer.no_reply_hint":
    "Mogli się przemieścić albo ich aplikacja nie odpowiada",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Region",
  "mesh.level.province": "Województwo",
  "mesh.level.city": "Miasto",
  "mesh.level.neighborhood": "Dzielnica",
  "mesh.level.block": "Kwartał",
  "mesh.level.building": "Budynek",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Do wydania",
  "wallet.balance.unit_hint": "Przełącza między satoshi a bitcoinem",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "Pamięć portfela jest zablokowana. Dowody ecash leżą w zaszyfrowanym pliku, którego klucz mieszka w pęku kluczy urządzenia, i nie dało się go otworzyć. Odblokuj urządzenie i otwórz Airhop ponownie.",
  "wallet.balance.tor_blocked":
    "Tor jest włączony, więc zapytania do mennicy są blokowane: poszłyby otwartą siecią i powiązały twoje IP z twoimi dowodami. Wysyłanie i odbieranie przez sieć mesh działa dalej. Zezwól na ruch do mennicy w Ustawieniach, w sekcji Bezpieczeństwo.",
  "wallet.balance.unconfirmed_note":
    "{amount} jeszcze niepotwierdzone przez mennicę",
  "wallet.balance.reserved_note": "{amount} zarezerwowane na wysyłkę w drodze",
  "wallet.balance.other_mint_note": "{amount} w innej mennicy",
  "wallet.balance.test_mint_note":
    "Zawiera zabawkowe pieniądze z mennicy testowej. To nie jest bitcoin i nie da się tego wypłacić.",
  "wallet.token": "Token",
  "wallet.action.send": "Wyślij token ecash",
  "wallet.action.send_disabled":
    "Wyślij token ecash, niedostępne przy pustym saldzie",
  "wallet.action.receive": "Odbierz token ecash",
  "wallet.action.zap": "Zapnij kontakt Nostr",
  "wallet.action.zap_disabled":
    "Zapnij kontakt Nostr, niedostępne przy pustym saldzie",
  "wallet.action.add_mint": "Dodaj mennicę Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Nie udało się zbudować tokena",
  "wallet.send.title": "Wyślij ecash",
  "wallet.send.amount_in": "Kwota w {unit}",
  "wallet.send.body":
    "Zbudowany offline z dowodów, które już masz. Nic nie znika z salda na dobre, dopóki nie potwierdzisz, że token dotarł.",
  "wallet.send.stale_fee_note":
    "Opłaty sprawdzano ostatnio {days} dni temu. Jeśli ta mennica od tego czasu je podniosła, wysyłka może kosztować odrobinę więcej.",
  "wallet.send.fee_note":
    "{spend} {unit} znika z twojego salda; dodatkowe {fee} pokrywa opłatę mennicy, którą inaczej zapłaciliby oni",
  "wallet.send.qr_too_big":
    "Ten token jest rozbity na zbyt wiele monet, żeby zmieścił się w kodzie QR. Udostępnij go albo skopiuj, albo odśwież w mennicy, żeby go scalić.",
  "wallet.send.bearer_note":
    "Kto ma ten ciąg znaków, ten ma pieniądze. Dowody są zarezerwowane, nie wydane: jeśli token nigdy do nikogo nie dotrze, możesz je odzyskać w sekcji Oczekujące.",
  "wallet.send.qr_too_big_short":
    "Ten token jest rozbity na zbyt wiele monet, żeby zmieścił się w kodzie QR. Udostępnij go albo skopiuj.",
  "wallet.send.scan_note":
    "Niech zeskanują to ze swojego portfela. Da się to odzyskać, dopóki nie oznaczysz jako dostarczone.",
  "wallet.send.mesh_note":
    "Token idzie jako zaszyfrowana wiadomość bezpośrednia przez sieć mesh. Internet niepotrzebny.",
  "wallet.send.no_peers_note":
    "Otwórz zakładkę Mesh, żeby znaleźć urządzenia w pobliżu, albo udostępnij token inaczej.",
  "wallet.send.send_to": "Wyślij do {name}",
  "wallet.send.memo": "Notatka (opcjonalna, podróżuje z tokenem)",
  "wallet.send.building": "Budowanie…",
  "wallet.send.build": "Zbuduj token",
  "wallet.send.inexact_body":
    "Twoje dowody nie złożą offline dokładnie {amount} {unit}. Najmniejszy token, jaki możesz zbudować, to {spend} {unit}, a offline nie ma reszty: dodatkowe {extra} {unit} trafia do odbiorcy.\n\nOdświeżenie w mennicy przy internecie rozbiłoby twoje dowody na nominały, które zejdą się co do jednostki.",
  "wallet.send.send_amount": "Wyślij {amount}",
  "wallet.send.sent_to": "Wysłano {amount} {unit} do {name}",
  "wallet.send.sent_to_body":
    "{route} Da się to odzyskać w sekcji Oczekujące, dopóki nie potwierdzisz, że dostali, albo dopóki mennica nie powie nam, że dowody zostały zrealizowane.",
  "wallet.send.copy_token": "Kopiuj token",
  "wallet.send.share_token": "Udostępnij token",
  "wallet.send.open_in_wallet": "Otwórz ten token w innym portfelu",
  "wallet.send.open_in_wallet_short": "Otwórz w portfelu",
  "wallet.send.to_peer": "Wyślij token peerowi w pobliżu",
  "wallet.send.to_peer_short": "Wyślij peerowi",
  "wallet.send.mark_delivered": "Oznacz jako dostarczone i zakończ",
  "wallet.send.they_got_it": "Dostali",
  "wallet.send.keep_pending": "Zostaw tę wysyłkę jako oczekującą",
  "wallet.send.decide_later": "Zdecyduj później",
  "wallet.send.no_peers": "Brak peerów w zasięgu",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "To twoja własna płatność",
  "wallet.receive.own_payment_body":
    "Te monety wciąż są zarezerwowane na wysyłkę, której nie rozliczyłeś, więc nie ma czego odbierać. Użyj Odzyskaj przy tej płatności, żeby wrzucić je prosto z powrotem na saldo.",
  "wallet.receive.already_have": "Już jest w twoim portfelu",
  "wallet.receive.already_have_body":
    "Każdy dowód z tego tokena już tu leży, więc nic nie przybyło. Salda bez zmian.",
  "wallet.receive.stored_unconfirmed":
    "Zapisane z {mint}, ale jeszcze niepotwierdzone przez mennicę ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Zrealizowane w {mint}. Te dowody należą teraz wyłącznie do ciebie: kopia nadawcy już nie działa.",
  "wallet.receive.memo_quoted": "\n\n„{memo}”",
  "wallet.receive.redeemed_at":
    "Zrealizowane w {mint}. Teraz w sposób sprawdzalny należy do ciebie: kopia tego tokena u nadawcy już nie działa.",
  "wallet.receive.stored_pending":
    "Zapisane z {mint}, ale mennica jeszcze nie potwierdziła, że jest niewydane{dleq}. Odśwież w zakładce Portfel, gdy będziesz mieć internet.",
  "wallet.receive.dleq_inline":
    " (podpis się zgadza, więc token jest prawdziwy)",
  "wallet.receive.dleq_ok":
    "Podpis mennicy się zgadza, więc token jest prawdziwy.",
  "wallet.receive.dleq_uncached":
    "Kluczy tej mennicy tu nie ma, więc podpisu nie dało się sprawdzić offline.",
  "wallet.receive.dleq_warning":
    "Dopóki nie odświeżysz przy internecie, nadawca mógł w zasadzie wydać to gdzie indziej.",
  "wallet.receive.failed": "Nie udało się odebrać",
  "wallet.receive.title": "Odbierz ecash",
  "wallet.receive.body":
    "Wklej token Cashu. Przy internecie realizuje się w mennicy od razu; offline zostaje zapisany i potwierdzony przy następnym odświeżeniu.",
  "wallet.receive.scan": "Zeskanuj kod QR z ecash",
  "wallet.receive.scan_short": "Skanuj QR",
  "wallet.receive.receiving": "Odbieranie…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap odebrany od {from}… i zrealizowany do twojego portfela.",
  "wallet.zap.title": "Zapnij tożsamość Nostr",
  "wallet.zap.not_npub": "to nie jest npub",
  "wallet.zap.bad_key": "zły klucz",
  "wallet.zap.invalid_pubkey": "Nieprawidłowy klucz publiczny",
  "wallet.zap.invalid_pubkey_body":
    "Podaj npub1… albo 64-znakowy szesnastkowy klucz publiczny Nostr.",
  "wallet.zap.sent": "Nutzap wysłany",
  "wallet.zap.failed": "Zap się nie udał",
  "wallet.zap.body":
    "Jeśli publikują dane nutzap wedle NIP-61, ecash zostaje przypisany do ich klucza, więc nikt inny go nie wyda i nie da się go cofnąć. Jeśli nie, idzie jako token, który możesz odzyskać. Dowiesz się, co się stało.",
  "wallet.zap.contact": "Zapnij {name}",
  "wallet.zap.pubkey_placeholder": "npub1… albo 64 znaki szesnastkowe",
  "wallet.zap.sending": "Wysyłanie…",
  "wallet.nostr.copied_body":
    "Daj to komuś, a będzie mógł zapnąć cię z Airhop albo dowolnego innego portfela Nostr, bez Bluetooth.",
  "wallet.nostr.copy_key":
    "Skopiuj swój klucz Nostr, żeby ludzie mogli cię zapinać",
  "wallet.nostr.your_key": "Twój klucz Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Mennica dodana",
  "wallet.mint.add_failed": "Nie udało się dodać mennicy",
  "wallet.mint.added_named": "Dodano {name}",
  "wallet.mint.added_body":
    "{mint} wydaje {units}. Jej klucze leżą na tym urządzeniu, więc tokeny z niej da się teraz sprawdzić nawet bez internetu.",
  "wallet.mint.remove_plain":
    "Usunąć {mint} z portfela? Zapisane klucze znikają razem z nią, więc tokenów z niej nie da się już sprawdzić offline.",
  "wallet.mint.title": "Mennice",
  "wallet.mint.none": "Jeszcze żadnej mennicy",
  "wallet.mint.none_desc":
    "Mennica wydaje i realizuje twój ecash. Dodaj jedną, żeby wpłacić przez Lightning, albo po prostu odbierz token, a jego mennica dopisze się sama.",
  "wallet.mint.add": "Dodaj mennicę",
  "wallet.mint.add_body":
    "Mennica trzyma bitcoiny stojące za twoim ecashem, więc wybierz taką, której powierzyłbyś trzymane tam saldo. Adres jest sprawdzany przed zapisaniem. Postaw własną na Nutshellu, jeśli wolisz nikomu nie ufać.",
  "wallet.mint.consolidate_body":
    "Token zawsze wskazuje tylko jedną mennicę, więc saldo rozrzucone po kilku nie zapłaci kwoty większej niż to, co trzyma największa z nich. Airhop potrafi je przenieść: każda inna mennica opłaca fakturę Lightning wystawioną przez tę, którą wybierzesz. Kosztuje to niewielką opłatę za trasowanie i wymaga internetu.",
  "wallet.mint.add_short": "Dodaj mennicę",
  "wallet.mint.checking": "Sprawdzanie…",
  "wallet.mint.remove_with_balance": "Usunąć mennicę z saldem?",
  "wallet.mint.remove": "Usuń mennicę",
  "wallet.mint.delete_anyway": "Mimo to usuń",
  "wallet.mint.consolidate": "Przenieś wszystkie salda do jednej mennicy",
  "wallet.mint.confirm_with": "Potwierdź dowody w {mint}",
  "wallet.mint.remove_a11y": "Usuń {mint}",
  "wallet.mint.available_amount": "dostępne: {amount} {unit}",
  "wallet.mint.split_across":
    "Saldo rozbite na {count} mennic. Przenieś je do jednej.",
  "wallet.mint.move_everything_to": "Przenieś wszystko do {mint}",
  "wallet.mint.consolidate_title": "Przenieś do jednej mennicy",
  "wallet.mint.moving": "Przenoszenie…",
  "wallet.mint.move": "Przenieś",
  "wallet.mint.moved": "Przeniesiono",
  "wallet.mint.moved_body":
    "{amount} {unit} leży teraz w {mint}, po {fees} {unit} opłat za trasowanie w Lightning.",
  "wallet.mint.nothing_moved": "Nic nie przeniesiono",
  "wallet.mint.destination": "· cel",
  "wallet.mint.will_move": "· zostanie przeniesione",
  "wallet.mint.issued_by": "Wydane przez",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Doładowanie portfela Airhop",
  "wallet.ln.invoice_failed": "Nie udało się utworzyć faktury",
  "wallet.ln.price_failed": "Nie udało się wycenić tej faktury",
  "wallet.ln.paid": "Opłacone",
  "wallet.ln.deposit_credited":
    "Faktura opłacona, a {mint} wydała {amount} {unit}. To saldo jest potwierdzone: możesz je wydać offline od razu.",
  "wallet.ln.withdrawn":
    "Zapłacono {paid} satów przez Lightning. Mennica pobrała {fee} satów opłat za trasowanie.",
  "wallet.ln.withdrawn_with_change":
    "Zapłacono {paid} satów przez Lightning. Mennica pobrała {fee} satów opłat za trasowanie i zwróciła {change} satów rezerwy na twoje saldo.",
  "wallet.ln.payment_failed": "Płatność się nie powiodła",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Zamień saty z Lightning na ecash, który wydasz offline, albo wypłać ecash na dowolną fakturę Lightning. Jedno i drugie wymaga internetu i mennicy.",
  "wallet.ln.deposit_body":
    "Mennica daje ci fakturę. Opłać ją z dowolnego portfela Lightning, a saty wrócą jako ecash, który wydasz offline.",
  "wallet.ln.pay_invoice_for":
    "Opłać tę fakturę na {amount} {unit}. Portfel wypatruje płatności i wyda twój ecash automatycznie.",
  "wallet.ln.expired_body":
    "Ta faktura wygasła. Jeśli już ją opłaciłeś, saldo zostanie dopisane automatycznie.",
  "wallet.ln.waiting_expires": "Czekanie na płatność · wygasa za {countdown}",
  "wallet.ln.withdraw_body":
    "Wklej fakturę bolt11, a mennica opłaci ją z twojego ecasha. Najpierw dostajesz wycenę rezerwy na trasowanie; czego trasowanie nie zużyje, wraca na twoje saldo.",
  "wallet.ln.up_to": "do {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Zapłać {amount} {unit}",
  "wallet.ln.deposit": "Wpłać saty przez Lightning",
  "wallet.ln.deposit_short": "Wpłać",
  "wallet.ln.withdraw": "Wypłać na fakturę Lightning",
  "wallet.ln.withdraw_short": "Wypłać",
  "wallet.ln.deposit_title": "Wpłata przez Lightning",
  "wallet.ln.amount_placeholder": "Kwota w satach",
  "wallet.ln.requesting": "Wysyłanie żądania…",
  "wallet.ln.get_invoice": "Pobierz fakturę",
  "wallet.ln.copy_invoice": "Kopiuj fakturę",
  "wallet.ln.open_wallet": "Otwórz w portfelu Lightning",
  "wallet.ln.open_wallet_short": "Otwórz w portfelu",
  "wallet.ln.waiting": "Czekanie na płatność…",
  "wallet.ln.new_invoice": "Utwórz nową fakturę",
  "wallet.ln.new_invoice_short": "Nowa faktura",
  "wallet.ln.withdraw_title": "Wypłata na Lightning",
  "wallet.ln.scan_invoice": "Zeskanuj kod QR faktury Lightning",
  "wallet.ln.paid_from": "Opłacone z",
  "wallet.ln.invoice": "Faktura",
  "wallet.ln.routing_reserve": "Rezerwa na trasowanie",
  "wallet.ln.reserved": "Zarezerwowane z salda",
  "wallet.ln.paying": "Płacenie…",
  "wallet.ln.get_quote": "Pobierz wycenę",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Kopia zapasowa",
  "wallet.backup.setup_failed": "Nie udało się skonfigurować kopii zapasowej",
  "wallet.backup.on": "Kopia zapasowa włączona",
  "wallet.backup.on_body":
    "Twoje saldo da się teraz odtworzyć z tych dwunastu słów.\n\nTo, co dostałeś od kogoś innego, zostaje poza frazą, dopóki nie odświeżysz w mennicy, a odzyskiwanie potrzebuje twojej listy mennic, więc zapisz ją obok słów.",
  "wallet.backup.no_phrase": "Nie zapisano frazy",
  "wallet.backup.no_phrase_body":
    "Nie udało się odczytać frazy odzyskiwania z pęku kluczy urządzenia. Odblokuj urządzenie i spróbuj ponownie.",
  "wallet.backup.replace_title": "Zastąpić obecną frazę?",
  "wallet.backup.replace_body":
    "Masz już frazę odzyskiwania. Przywrócenie innej ją zastąpi. Monety, które stara fraza już obejmowała, dalej da się wydać na tym urządzeniu, ale przestają być odzyskiwalne, więc upewnij się, że stare słowa są zapisane, zanim przejdziesz dalej.",
  "wallet.backup.replace": "Zastąp",
  "wallet.backup.invalid_phrase": "Ta fraza jest nieprawidłowa",
  "wallet.backup.invalid_phrase_body":
    "Fraza ma wbudowaną sumę kontrolną, a ta jej nie przechodzi. Poszukaj źle wpisanego, brakującego albo zamienionego słowa.",
  "wallet.backup.not_bip39":
    "To nie są słowa BIP-39: {words}. Sprawdź pisownię.",
  "wallet.backup.add_mint_first": "Najpierw dodaj mennicę",
  "wallet.backup.add_mint_first_body":
    "Odzyskiwanie polega na pytaniu mennicy, które monety dla ciebie podpisała, więc musi wiedzieć, którą mennicę zapytać. Dodaj mennice, z których korzystałeś, a potem przywróć.",
  "wallet.backup.restore_failed": "Przywracanie się nie powiodło",
  "wallet.backup.phrase": "Fraza odzyskiwania",
  "wallet.backup.state_unconfirmed":
    "Kopia zapasowa włączona, ale niepotwierdzona",
  "wallet.backup.state_off": "Kopia zapasowa wyłączona",
  "wallet.backup.badge_on": "Wł.",
  "wallet.backup.badge_unconfirmed": "Niepotwierdzona",
  "wallet.backup.badge_off": "Wył.",
  "wallet.backup.view": "Pokaż frazę odzyskiwania",
  "wallet.backup.setup": "Ustaw frazę odzyskiwania",
  "wallet.backup.view_short": "Pokaż frazę",
  "wallet.backup.setup_short": "Ustaw",
  "wallet.backup.restore": "Przywróć portfel z frazy odzyskiwania",
  "wallet.backup.restore_short": "Przywróć",
  "wallet.backup.setup_title": "Ustaw frazę odzyskiwania",
  "wallet.backup.on_body_short":
    "Twoje saldo da się odtworzyć na nowym urządzeniu z twoich dwunastu słów.",
  "wallet.backup.unconfirmed_body":
    "Nigdy nie potwierdziłeś, że masz je zapisane. W tej chwili słowa istnieją tylko na tym telefonie, a to właśnie jego utratę kopia zapasowa ma przetrwać. Pokaż frazę i zapisz ją.",
  "wallet.backup.not_covered":
    "{amount} nie jest jeszcze objęte. Monety, które dostałeś, niosą sekrety tego, kto je wysłał, więc trafiają pod twoją frazę dopiero po wymianie. Odśwież mennicę, żeby je zabezpieczyć.",
  "wallet.backup.off_body":
    "Twój ecash istnieje tylko na tym telefonie. Jeśli go zgubisz, nikt nie odzyska pieniędzy, ty też nie. Fraza odzyskiwania to dwanaście słów, które odtworzą twoje saldo gdziekolwiek.",
  "wallet.backup.about_to_see":
    "Za chwilę zobaczysz dwanaście słów. To one są pieniędzmi.",
  "wallet.backup.exact_order":
    "Dwanaście słów, dokładnie w tej kolejności. Kto je ma, ma twoje saldo.",
  "wallet.backup.verify_body":
    "Fraza, której nikt nie zapisał, jest gorsza niż jej brak, bo wygląda na zabezpieczenie, którego nie ma. Dwa słowa dla potwierdzenia.",
  "wallet.backup.verify_mismatch":
    "To się nie zgadza. Sprawdź swoją zapisaną kopię.",
  "wallet.backup.restore_body":
    "Wpisz dwanaście słów. Airhop wyprowadzi twoje monety na nowo i zapyta każdą mennicę, które z nich podpisała, więc saldo wraca z rejestru prowadzonego przez mennicę.",
  "wallet.backup.warn_secret":
    "Każdy, kto je przeczyta, może zabrać twoje saldo. Nie rób z nich zrzutu ekranu i nie trzymaj ich na tym telefonie.",
  "wallet.backup.warn_paper":
    "Zapisz je na papierze i schowaj w bezpiecznym miejscu. Airhop nie pokaże ci ich ponownie, gdy telefonu zabraknie.",
  "wallet.backup.warn_scope":
    "Odtwarzają tylko twój ecash. Tożsamość, czaty i kontakty nie są objęte.",
  "wallet.backup.warn_mints":
    "Odzyskiwanie musi zapytać mennicę, które monety podpisała, więc zapisz swoją listę mennic obok słów.",
  "wallet.backup.preparing": "Przygotowywanie…",
  "wallet.backup.show_phrase": "Pokaż moją frazę",
  "wallet.backup.your_phrase": "Twoja fraza odzyskiwania",
  "wallet.backup.write_down": "Zapisz je",
  "wallet.backup.copy_phrase": "Kopiuj frazę odzyskiwania do schowka",
  "wallet.backup.copy_clipboard": "Kopiuj do schowka",
  "wallet.backup.written_down": "Zapisałem je",
  "wallet.backup.check_copy": "Sprawdź swoją kopię",
  "wallet.backup.confirm": "Potwierdź",
  "wallet.backup.restore_title": "Przywracanie z frazy",
  "wallet.backup.phrase_placeholder": "dwanaście słów oddzielonych spacjami",
  "wallet.backup.no_mints_yet":
    "Nie dodano jeszcze żadnej mennicy. Odzyskiwanie musi zapytać konkretną mennicę, więc najpierw dodaj te, z których korzystałeś.",
  "wallet.backup.scanning": "Przeszukiwanie…",
  "wallet.backup.restore_progress": "{mint} · zestaw kluczy {step} z {total}",
  "wallet.backup.will_scan":
    "Zostaną przeszukane: {mints}. Mennica, której nie dodałeś, nigdy nie zostanie zapytana, więc jej saldo pozostaje niewidoczne.",
  "wallet.backup.word_n": "Słowo {position}",
  "wallet.backup.unreachable_mints":
    "Nie udało się połączyć z: {mints}. Saldo, które tam leży, wciąż tam jest. Spróbuj ponownie przy lepszym połączeniu.",
  "wallet.backup.nothing_recovered":
    "Z przeszukanych mennic nic nie odzyskano.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Oznaczyć jako odebrane?",
  "wallet.delivered.body":
    "To zwalnia {amount} {unit} na dobre. Jeśli w rzeczywistości nigdy nie dotarło, nie odzyskasz tego.",
  "wallet.delivered.body_generic":
    "To zwalnia zarezerwowaną kwotę na dobre. Jeśli w rzeczywistości nigdy nie dotarła, nie odzyskasz jej.",
  "wallet.delivered.cancel": "Jeszcze nie",
  "wallet.delivered.confirm": "Dostali",
  "wallet.reclaim.title": "Odzyskać ten token?",
  "wallet.reclaim.body":
    "{amount} {unit} wraca na twoje saldo. Zrób tak tylko wtedy, gdy token nigdy do nikogo nie dotarł: jeśli mają już ten ciąg znaków, pieniądze zatrzyma ten, kto pierwszy zrealizuje go w mennicy, a to mogą być oni.",
  "wallet.reclaim.keep": "Zostaw jako oczekujące",
  "wallet.reclaim.confirm": "Odzyskaj",
  "wallet.copied.token_body":
    "Token jest w schowku. Zostaje tu zarezerwowany, dopóki nie oznaczysz go jako dostarczonego, więc możesz go wkleić ponownie, jeśli pierwsza próba się nie uda.",
  "wallet.copied.phrase_body":
    "Wklej ją do menedżera haseł, a potem wyczyść schowek. Inne aplikacje potrafią czytać schowek, a przy niektórych ustawieniach synchronizuje się on z twoimi innymi urządzeniami.",
  "wallet.refresh.failed": "Odświeżanie się nie powiodło",
  "wallet.refresh.partly": "Częściowo odświeżone",
  "wallet.refresh.done": "Odświeżone",
  "wallet.refresh.unreachable":
    "Nie udało się połączyć z {mints}. Cała reszta jest aktualna.",
  "wallet.refresh.swapped":
    "{amount} {unit} potwierdzone i wymienione na świeże dowody.",
  "wallet.refresh.secured":
    "{amount} {unit} jest teraz objęte twoją frazą odzyskiwania.",
  "wallet.refresh.all_confirmed":
    "Wszystko tutaj było już potwierdzone przez mennicę.",
  "wallet.pending.title": "Oczekujące",
  "wallet.pending.reserved_desc":
    "Zbudowane i zarezerwowane, dostawa niepotwierdzona. Dowody są trzymane poza saldem, żeby nie dało się ich wydać dwa razy.",
  "wallet.pending.locked_desc":
    "Już przypisane do klucza odbiorcy, więc tylko on może to wydać. Po prostu jeszcze do niego nie dotarło. Udostępnij token, żeby zakończyć.",
  "wallet.pending.show_qr": "Pokaż ten token jako kod QR",
  "wallet.pending.copy_again": "Skopiuj token ponownie",
  "wallet.pending.share_again": "Udostępnij token ponownie",
  "wallet.pending.mark_delivered": "Oznacz ten token jako dostarczony",
  "wallet.pending.delivered": "Dostarczone",
  "wallet.pending.reclaim_into": "Odzyskaj ten token na swoje saldo",
  "wallet.activity.title": "Aktywność",
  "wallet.activity.none": "Jeszcze nic",
  "wallet.activity.none_desc":
    "Płatności, które wysyłasz i odbierasz, pojawiają się tutaj, od najnowszych, wraz z mennicą i opłatą przy każdej z nich.",
  "wallet.activity.show_fewer": "Pokaż mniej płatności",
  "wallet.activity.show_less": "Pokaż mniej",
  "wallet.activity.received_unconfirmed": "Odebrane, niepotwierdzone",
  "wallet.activity.received": "Odebrane",
  "wallet.activity.receive_failed": "Odbiór się nie powiódł",
  "wallet.activity.reclaimed": "Odzyskane",
  "wallet.activity.send_failed": "Wysyłka się nie powiodła",
  "wallet.activity.sent": "Wysłane",
  "wallet.activity.status_pending": "oczekujące",
  "wallet.activity.status_failed": "nieudane",
  "wallet.activity.status_reclaimed": "odzyskane",
  "wallet.activity.status_expired": "wygasłe",
  "wallet.activity.ln_deposit": "Wpłata przez Lightning",
  "wallet.activity.ln_withdrawal": "Wypłata przez Lightning",
  "wallet.activity.nutzap_received": "Odebrano nutzapa",
  "wallet.activity.spent_removed": "Usunięto wydane dowody",
  "wallet.activity.refreshed": "Dowody odświeżone",
  "wallet.activity.refreshing": "Odświeżanie dowodów",
  "wallet.activity.just_now": "przed chwilą",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Sieć mesh offline",
  "wallet.mesh_offline_body":
    "Usługa sieci mesh nie działa, więc nie ma komu wręczyć tokena. Zostaje zarezerwowany w sekcji Oczekujące.",
  "wallet.xfer.route_mesh": "Wręczone prosto ich urządzeniu przez sieć mesh.",
  "wallet.xfer.route_nostr":
    "Byli poza zasięgiem Bluetooth, więc poszło przez internet.",
  "wallet.xfer.route_courier":
    "Na razie nie ma do nich trasy. Poniosą to inne urządzenia i dostarczą, gdy któreś do nich dotrze.",
  "wallet.xfer.route_queued":
    "Jeszcze nie da się do nich dotrzeć. Czeka w kolejce i wyjdzie, gdy tylko będzie można.",
  "wallet.xfer.mesh_offline_body":
    "Usługa sieci mesh nie działa, więc nie ma jak przekazać tokena. Nic nie zostało pobrane.",
  "wallet.xfer.could_not_send": "Nie udało się wysłać",
  "wallet.xfer.inexact_body":
    "Twoje dowody nie złożą offline dokładnie {amount} {unit}. Najmniejszy token, jaki możesz zbudować, to {spend} {unit}, a dodatkowe {extra} {unit} trafia do nich bez możliwości odzyskania.\n\nOdświeżenie w mennicy przy internecie rozbija twoje dowody na nominały, które zejdą się co do jednostki.",
  "wallet.xfer.send_amount": "Wyślij {amount}",
  "wallet.xfer.mesh_offline": "Sieć mesh offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Przypisane do ich klucza i opublikowane w sieci Nostr. Należy do nich, niezależnie od tego, czy są online.",
  "wallet.pay.rail_nutzap_dm":
    "Przypisane do ich klucza. Przekaźnik tego nie przyjął, więc poszło do nich jako wiadomość.",
  "wallet.pay.rail_nutzap_undelivered":
    "Przypisane do ich klucza, ale nic nie mogło tego jeszcze ponieść. Czeka w kolejce, a token jest w sekcji Oczekujące.",
  "wallet.pay.final":
    "Przypisanych płatności nie da się odzyskać: tylko ich klucz może teraz wydać te monety.",
  "wallet.pay.reclaimable":
    "Da się to odzyskać w zakładce Portfel, dopóki nie potwierdzisz, że dotarło.",
  "wallet.pay.why": "Wysłane tą drogą, ponieważ {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} do {name}",
  "wallet.pay.thread_receipt":
    "Wysłałeś {amount} {unit}, przypisane do ich klucza.",
  "wallet.pay.title": "Wyślij ecash",
  "wallet.pay.to": "Do {name}",
  "wallet.pay.amount": "Kwota w satach",
  "wallet.pay.memo": "Notatka (opcjonalna, publiczna)",
  "wallet.pay.send": "Wyślij",
  "wallet.pay.sending": "Wysyłanie…",
  "wallet.pay.action": "Wyślij ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Dostęp do aparatu",
  "wallet.scan.camera_purpose": "zeskanować kod QR z ecash",
  "wallet.scan.photo_label": "Dostęp do zdjęć",
  "wallet.scan.photo_purpose": "odczytać kod QR z ecash z obrazu",
  "wallet.scan.no_token": "Nie znaleziono tokena ecash na tym obrazie.",
  "wallet.scan.no_invoice": "Nie znaleziono faktury Lightning na tym obrazie.",
  "wallet.scan.unreadable": "Nie udało się odczytać tego obrazu.",
  "wallet.scan.camera_failed":
    "Nie udało się uruchomić aparatu. Zamknij inne aplikacje aparatu i spróbuj ponownie.",
  "wallet.scan.close": "Zamknij skaner",
  "wallet.scan.on_device":
    "Odczyt odbywa się na tym urządzeniu; nic nigdzie nie jest wysyłane.",
  "wallet.scan.aim_token": "Wyceluj w kod QR z ecash.",
  "wallet.scan.aim_invoice": "Wyceluj w kod QR faktury Lightning.",
  "wallet.scan.title_token": "Skanowanie ecash",
  "wallet.scan.title_invoice": "Skanowanie faktury",
  "wallet.scan.desc_token":
    "Odczytaj token Cashu z innego portfela. Działa z dowolnym portfelem Cashu, nie tylko z Airhop.",
  "wallet.scan.desc_invoice":
    "Odczytaj fakturę Lightning, żeby opłacić ją ze swojego salda.",
  "wallet.scan.use_camera_a11y": "Skanuj aparatem",
  "wallet.scan.use_camera": "Użyj aparatu",
  "wallet.scan.pick_image_a11y": "Odczytaj kod QR z zapisanego obrazu",
  "wallet.scan.pick_image": "Wybierz ze zdjęć",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Czym jest Cashu?",
  "wallet.explain.intro":
    "Cashu to ecash dla Bitcoina. Token to ciąg znaków wart pieniądze dla tego, kto go ma, podpisany na ślepo przez mennicę, żeby mennica nie widziała, kto co wydał. Bez kont, bez logowania.",
  "wallet.explain.send": "Wyślij",
  "wallet.explain.send_desc":
    "Zamienia kwotę w token, który wręczysz peerowi w pobliżu przez Bluetooth albo udostępnisz jako tekst. Działa bez internetu. Dowody zostają zarezerwowane, dopóki nie potwierdzisz, że dotarło.",
  "wallet.explain.receive": "Odbierz",
  "wallet.explain.receive_desc":
    "Wklej token, żeby go dodać. Przy internecie wymienia się w mennicy od razu, co czyni go sprawdzalnie twoim. Offline zostaje zapisany i oznaczony jako niepotwierdzony, dopóki nie odświeżysz.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Płaci tożsamości Nostr. Jeśli publikują dane nutzap wedle NIP-61, ecash zostaje przypisany do ich klucza, więc tylko oni mogą go wydać. Inaczej wraca do zaszyfrowanej wiadomości bezpośredniej. Wymaga internetu.",
  "wallet.explain.add_mint": "Dodaj mennicę",
  "wallet.explain.add_mint_desc":
    "Zapisuje mennicę, która wydaje i realizuje twój ecash, i przechowuje jej klucze publiczne, żeby tokeny z niej dało się sprawdzić offline. Wybierz mennicę, której powierzyłbyś trzymane tam saldo.",
  "wallet.explain.phrase": "Fraza odzyskiwania",
  "wallet.explain.phrase_desc":
    "Twoje monety wyprowadzane są z dwunastu słów, które portfel tworzy na początku, więc nowy telefon odtworzy saldo, pytając twoje mennice, które monety podpisały. Dopóki ich nie zobaczysz i nie zapiszesz, istnieją tylko na tym telefonie.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Portfel zablokowany",
  "wallet.err.mint_unreachable": "Mennica nieosiągalna",
  "wallet.err.tor_blocked": "Zablokowane, gdy Tor jest włączony",
  "wallet.err.insufficient": "Za małe saldo",
  "wallet.err.exact_amount": "Nie da się wysłać dokładnie tej kwoty",
  "wallet.err.no_mint": "Brak mennicy",
  "wallet.err.mint_unsupported": "Mennica tego nie potrafi",
  "wallet.err.mint_refused": "Mennica odmówiła",
  "wallet.err.unreadable": "Nieczytelny token",
  "wallet.err.rejected": "Token odrzucony",
  "wallet.err.already_spent": "Już wydane",
  "wallet.err.change_pending": "Opłacone, reszta oczekuje",
  "wallet.svc.mint_unreachable": "Nie udało się połączyć z mennicą.",
  "wallet.svc.tor_ios": "Zapytania do mennicy nie idą przez Tor na iOS.",
  "wallet.svc.tor_ios_body":
    "Arti otacza tylko WebSockety Nostr, więc to zapytanie dotarłoby do mennicy otwartą siecią i powiązało twoje IP z tymi dowodami. Zezwól na to w Ustawieniach > Bezpieczeństwo albo najpierw wyłącz Tor. Wysyłanie i odbieranie ecash przez sieć mesh działa dalej.",
  "wallet.svc.tor_paused": "Tor jest włączony, ale bez połączenia.",
  "wallet.svc.tor_paused_body":
    "Orbot przestał kierować ruch, więc to zapytanie dotarłoby do mennicy otwartą siecią i powiązało twoje IP z tymi dowodami. Uruchom Orbot ponownie albo wyłącz Tor. Wysyłanie i odbieranie ecash przez sieć mesh działa dalej.",
  "wallet.svc.keys_uncached": "Kluczy tej mennicy nie ma na tym urządzeniu.",
  "wallet.svc.keys_uncached_body":
    "Otwórz portfel raz przy internecie, żeby je pobrać.",
  "wallet.svc.phrase_invalid": "Ta fraza odzyskiwania jest nieprawidłowa.",
  "wallet.svc.phrase_invalid_body":
    "Poszukaj źle wpisanego albo brakującego słowa. Fraza ma wbudowaną sumę kontrolną, więc jedno złe słowo unieważnia całość.",
  "wallet.svc.need_mint": "Najpierw dodaj przynajmniej jedną mennicę.",
  "wallet.svc.need_mint_body":
    "Odzyskiwanie polega na pytaniu mennicy, które monety dla ciebie podpisała, więc musi wiedzieć, którą mennicę zapytać.",
  "wallet.svc.restored": "Przywrócono z frazy odzyskiwania",
  "wallet.svc.storage_locked": "Pamięć portfela jest zablokowana.",
  "wallet.svc.storage_locked_body":
    "Airhop trzyma dowody ecash w zaszyfrowanym pliku, którego klucz mieszka w pęku kluczy urządzenia. Odblokuj urządzenie i otwórz aplikację ponownie.",
  "wallet.svc.bad_url": "To nie jest prawidłowy adres URL.",
  "wallet.svc.needs_https": "Adres mennicy musi zaczynać się od https://.",
  "wallet.svc.refuse_http": "Odmawiamy korzystania z mennicy po zwykłym http.",
  "wallet.svc.refuse_http_body":
    "Każdy po drodze w sieci mógłby odczytać albo zmienić twoje dowody. Użyj mennicy z https://.",
  "wallet.svc.mint_not_saved": "Nie udało się zapisać mennicy.",
  "wallet.svc.unreadable_token": "To nie jest czytelny token Cashu.",
  "wallet.svc.unreadable_token_body":
    "Tokeny zaczynają się od cashuA albo cashuB. Sprawdź, czy przy kopiowaniu nic nie zostało ucięte.",
  "wallet.svc.wrong_mint":
    "Ten token nie został podpisany przez mennicę, którą wskazuje.",
  "wallet.svc.already_spent": "Te dowody zostały już wydane.",
  "wallet.svc.already_spent_body":
    "Ten, kto wysłał ten token, zrealizował go pierwszy albo wysłał ten sam token jeszcze komuś innemu.",
  "wallet.svc.receiving_offline": "odbieranie offline",
  "wallet.svc.amount_positive": "Podaj kwotę większą od zera.",
  "wallet.svc.coins_raced": "Tych monet przed chwilą użyła inna płatność.",
  "wallet.svc.coins_raced_body":
    "Nic nie zostało pobrane. Spróbuj ponownie, a portfel wybierze inny zestaw.",
  "wallet.svc.no_ecash": "Jeszcze żadnego ecasha.",
  "wallet.svc.no_ecash_body":
    "Dodaj mennicę i wpłać przez Lightning albo odbierz od kogoś token.",
  "wallet.svc.split_across_mints": "Twoje saldo jest rozbite na kilka mennic.",
  "wallet.svc.mint_says_spent": "Mennica zgłosiła te dowody jako już wydane.",
  "wallet.svc.issue_against_invoice": "wydać ecash pod fakturę Lightning",
  "wallet.svc.pay_invoice": "opłacić faktury Lightning",
  "wallet.svc.unknown_deposit": "Nieznana wpłata.",
  "wallet.svc.invoice_expired_before":
    "Faktura wygasła, zanim została opłacona.",
  "wallet.svc.invoice_expired": "Ta faktura wygasła.",
  "wallet.svc.invoice_unpaid": "Faktura nie została jeszcze opłacona.",
  "wallet.svc.payment_unknown":
    "Stan płatności nieznany; sprawdzony ponownie przy następnym odświeżeniu.",
  "wallet.svc.melt_change_pending": "Twoja faktura została opłacona.",
  "wallet.svc.melt_change_pending_body":
    "Mennica nie zwróciła jeszcze niewykorzystanej opłaty za trasowanie. Zostanie odebrana automatycznie przy następnym odświeżeniu i nic w międzyczasie nie ginie.",
  "wallet.svc.mint_did_not_pay":
    "Mennica nie opłaciła tej faktury. Twoje saldo bez zmian.",
  "wallet.svc.not_an_invoice": "To nie jest faktura Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Wklej fakturę bolt11 zaczynającą się od lnbc.",
  "wallet.svc.insufficient_for_invoice": "Za małe saldo na tę fakturę.",
  "wallet.svc.coins_raced_invoice_body":
    "Nic nie zostało pobrane, a faktura nie została opłacona. Spróbuj ponownie.",
  "wallet.svc.same_mint": "Wybierz inną mennicę docelową.",
  "wallet.svc.same_mint_body":
    "Źródło i cel to ta sama mennica, więc nie ma czego przenosić.",
  "wallet.svc.quote_failed_retried":
    "Wycena się nie powiodła, ponowiono scalanie",
  "wallet.svc.amount_unfit_retried": "Kwota nie pasowała, ponowiono scalanie",
  "wallet.svc.cannot_size": "Nie udało się ustalić wielkości tego przelewu.",
  "wallet.svc.insufficient_at_mint": "Za małe saldo w {mint}.",
  "wallet.svc.inexact_title":
    "Twoje dowody nie złożą offline dokładnie {amount} {unit}.",
  "wallet.svc.inexact_detail":
    "Najmniejszy token, jaki możesz wysłać, to {spend} {unit}. Offline nie ma reszty, więc dodatkowe {extra} {unit} trafia do odbiorcy.",
  "wallet.svc.no_single_mint":
    "Żadna pojedyncza mennica nie trzyma {amount} {unit}. Ecasha z różnych mennic nie da się złączyć w jeden token: najpierw scal go w jednej mennicy albo wyślij w osobnych kwotach.",
  "wallet.svc.have_tried_send":
    "Masz {total} {unit}, a próbowałeś wysłać {amount}.",
  "wallet.svc.invoice_needs":
    "Ta faktura wymaga {total} {unit} razem z rezerwą na trasowanie, a ty masz {balance}.",
  "wallet.svc.nothing_to_move": "{mint} nie ma {unit} do przeniesienia.",
  "wallet.svc.consolidate_memo": "Scalanie z {mint}",
  "wallet.svc.cannot_size_detail":
    "Po opłatach za trasowanie w Lightning {from} nie przeniesie sensownej kwoty do {to}. Spróbuj zamiast tego przenieść konkretną mniejszą kwotę.",
  "wallet.svc.mint_cannot": "{mint} nie potrafi {action}.",
  "wallet.svc.no_nut": "Mennica nie ogłasza NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Ta płatność wskazuje mennicę, z której nie korzystasz.",
  "wallet.svc.unknown_mint_body":
    "Dodaj tę mennicę sam, jeśli jej ufasz; nic nie jest realizowane w mennicy, której nie wybrałeś.",
  "wallet.svc.no_relay": "brak połączenia z przekaźnikiem",
  "wallet.svc.no_shared_mint": "brak wspólnej mennicy z wystarczającym saldem",
  "wallet.svc.no_nutzap_info":
    "odbiorca nie opublikował danych nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Przypisane do ich klucza, ale jeszcze niedostarczone. Udostępnij token z tej transakcji, żeby ją dokończyć.",
  "wallet.svc.swap_lost":
    "Mennica nigdy nie dokończyła tej wymiany, więc nic pod nią nie wydano.",
  "wallet.svc.swap_unreadable":
    "Ta wymiana została zapisana w postaci, której ta wersja nie odtworzy.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Zweryfikowany kodem QR",
  "contacts.qr.keys_unverified": "Klucze odebrane, niezweryfikowane",
  "contacts.qr.not_verified": "Jeszcze niezweryfikowany",
  "contacts.qr.message": "Wiadomość",
  "contacts.qr.add": "Dodaj kontakt",
  "contacts.qr.scan_title": "Zeskanuj kod QR",
  "contacts.qr.aim": "Wyceluj aparat w ich kod QR",
  "contacts.qr.add_desc":
    "Dotrzyj do kogoś, kogo nie ma w pobliżu w sieci mesh.",
  "contacts.qr.peer_id_hint":
    "Identyfikator peera ma 16 znaków. Kod kontaktu zaczyna się od airhop:.",
  "contacts.qr.or_scan": "albo zeskanuj ich kod QR",
  "contacts.qr.trust_note":
    "Tylko kod QR zeskanowany aparatem weryfikuje ich klucz. Wklejony kod niesie ich klucze, ale nie dowód, że pochodzi od nich.",
  "contacts.qr.peer_id": "Identyfikator peera albo kod kontaktu",
  "contacts.qr.peer_id_placeholder": "Wklej identyfikator albo kod kontaktu",
  "contacts.qr.scan_camera_a11y": "Zeskanuj kod QR aparatem",
  "contacts.qr.scan_camera_desc": "Użyj aparatu",
  "contacts.qr.upload_a11y": "Wgraj obraz kodu QR z galerii",
  "contacts.qr.upload": "Wgraj z galerii",
  "contacts.qr.upload_desc": "Wybierz zapisany obraz kodu QR",
  "contacts.qr.scan_a11y": "Dodaj kontakt, skanując kod QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Wklej 16-znakowy identyfikator peera, link airhop://peer/… albo kod kontaktu.",
  "contacts.scan.camera_label": "Dostęp do aparatu",
  "contacts.scan.camera_purpose": "zeskanować kod QR kontaktu",
  "contacts.scan.camera_needed":
    "Do skanowania potrzebny jest dostęp do aparatu. Nadal możesz dodać kogoś po identyfikatorze peera.",
  "contacts.scan.camera_failed":
    "Nie udało się uruchomić aparatu. Zamknij inne aplikacje aparatu i spróbuj ponownie.",
  "contacts.scan.photo_label": "Dostęp do zdjęć",
  "contacts.scan.photo_purpose": "zeskanować zapisany kod QR",
  "contacts.scan.photo_needed":
    "Do wybrania obrazu potrzebny jest dostęp do zdjęć. Nadal możesz dodać kogoś po identyfikatorze peera.",
  "contacts.scan.no_qr": "Nie znaleziono kodu QR Airhop na tym obrazie.",
  "contacts.scan.unreadable": "Nie udało się odczytać kodu QR z tego obrazu.",
  "contacts.scan.bitchat_expired":
    "Ten kod bitchat wygasł. Poproś, żeby otworzyli swój kod QR jeszcze raz.",
  "contacts.scan.tampered":
    "Ten kod QR jest nieprawidłowy: identyfikator peera nie zgadza się z kluczami. Mógł zostać podmieniony.",
  "contacts.scan.already_added": "Już jest w twoich kontaktach",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Czekanie na dostęp do aparatu…",
  "contacts.verify.camera_off": "Aparat jest wyłączony",
  "contacts.verify.open_settings": "Otwórz Ustawienia",
  "contacts.verify.verified": "Zweryfikowany",
  "contacts.verify.different": "Inny kontakt",
  "contacts.verify.scan_again": "Zeskanuj ponownie",
  "contacts.verify.failed": "Nie udało się zweryfikować",
  "contacts.verify.done": "Gotowe",
  "contacts.verify.title": "Zweryfikuj {name}",
  "contacts.verify.aim": "Wyceluj aparat w ich kod QR",
  "contacts.verify.camera_off_body":
    "Włącz dostęp do aparatu w Ustawieniach, żeby zweryfikować kodem QR.",
  "contacts.verify.match_body":
    "Klucz osoby {name} się zgadza. Możesz zaufać temu kontaktowi.",
  "contacts.verify.different_body":
    "Ten kod QR należy do kogoś innego. Poproś {name} o pokazanie własnego kodu.",
  "contacts.verify.tampered_body":
    "Ten kod QR wygląda na podmieniony: jego identyfikator nie zgadza się z kluczem.",
  "contacts.verify.choose_title": "Jak chcesz to sprawdzić?",
  "contacts.verify.choose_body":
    "Oba sposoby potwierdzają, że klucze na tym telefonie naprawdę należą do {name}.",
  "contacts.verify.method_scan": "Zeskanuj ich kod",
  "contacts.verify.method_scan_sub": "Są tutaj z tobą",
  "contacts.verify.method_compare": "Porównajcie kod",
  "contacts.verify.method_compare_sub": "Odczytajcie go sobie przez telefon",
  "contacts.verify.no_keys":
    "Brak jeszcze kluczy do tego kontaktu. Napisz do nich albo zeskanuj ich kod, gdy się spotkacie.",
  "contacts.verify.compare_title": "Odczytajcie to sobie nawzajem",
  "contacts.verify.compare_body":
    "{name} widzi te same sześć słów. Jeśli się zgadzają, oboje wiecie, że klucze są prawdziwe.",
  "contacts.verify.codes_match": "Zgadzają się",
  "contacts.verify.codes_differ": "Nie zgadzają się",
  "contacts.verify.compared_body":
    "Ty i {name} potwierdziliście ten sam kod. Ten kontakt jest zweryfikowany.",

  // ---- Settings: shared chrome ----
  "settings.back": "Wstecz",
  "settings.coming_soon": "Wkrótce",
  "settings.opens_externally": "{label}, otwiera się poza aplikacją",
  "settings.peer_id": "Identyfikator peera",
  "settings.share_peer_id": "Udostępnij swój identyfikator peera",
  "settings.share_id_short": "Udostępnij ID",
  "settings.peer_id_sheet.title": "Twój identyfikator peera",
  "settings.peer_id_sheet.copy": "Kopiuj identyfikator peera",
  "settings.peer_id_sheet.note":
    "Działa tylko wtedy, gdy oboje jesteście w zasięgu Bluetooth. Żeby ktoś mógł napisać do ciebie skądkolwiek, udostępnij zamiast tego swój kod QR.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Ogólne",
  "settings.section.general_desc":
    "Funkcje opcjonalne, cofanie wysyłki, multimedia, reset",
  "settings.section.privacy": "Prywatność i bezpieczeństwo",
  "settings.section.privacy_desc":
    "Forward secrecy, podpisane pakiety, zablokowani peerzy",
  "settings.section.network": "Sieć i przekaźniki",
  "settings.section.network_desc":
    "Internet zapasowo, przekaźniki nostr, zgodność z bitchat",
  "settings.section.permissions": "Uprawnienia",
  "settings.section.permissions_desc":
    "Bluetooth, lokalizacja, powiadomienia, aparat, mikrofon",
  "settings.section.storage": "Pamięć i dane",
  "settings.section.diagnostics": "Diagnostyka",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transporty",
  "settings.group.nearby": "W pobliżu",
  "settings.group.sync": "Synchronizacja",
  "settings.group.features": "Funkcje",
  "settings.group.messages": "Wiadomości",
  "settings.group.media": "Multimedia",
  "settings.group.reset": "Reset",
  "settings.group.always_on": "Zawsze włączone",
  "settings.group.notifications": "Powiadomienia",
  "settings.group.blocked": "Zablokowani",
  "settings.group.theme": "Motyw",
  "settings.group.font": "Czcionka",
  "settings.group.language": "Język",
  "settings.section.diagnostics_desc": "Stan połączenia i urządzenia w pobliżu",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Łącza Bluetooth",
  "settings.diag.ble_links_desc":
    "Urządzenia, z którymi ten telefon jest połączony bezpośrednio",
  "settings.diag.lan": "Sieć lokalna",
  "settings.diag.lan_desc": "Telefony w jednej sieci Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Telefon do telefonu bez routera",
  "settings.diag.wifi_active": "Działa",
  "settings.diag.wifi_unsupported": "Nieobsługiwane na tym urządzeniu",
  "settings.diag.wifi_permission": "Zablokowane przez uprawnienie",
  "settings.diag.wifi_unavailable": "Chwilowo niedostępne",
  "settings.diag.wifi_unpaired": "Nic nie sparowano",
  "settings.diag.wifi_unknown": "Czekanie na radio",
  "settings.diag.relays": "Przekaźniki Nostr",
  "settings.diag.relays_desc":
    "Używane do kanałów lokalizacyjnych i zasięgu przez internet",
  "settings.diag.connected": "Połączono",
  "settings.diag.disconnected": "Brak połączenia",
  "settings.diag.peer_direct": "Łącze bezpośrednie",
  "settings.diag.peer_relayed": "Słyszany przez inne urządzenie",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Brak odczytu sygnału",
  "settings.diag.no_peers": "Nikogo w zasięgu",
  "settings.diag.no_peers_desc": "otwarte łącza radiowe: {links}",
  "settings.diag.gcs_size": "Rozmiar filtra",
  "settings.diag.gcs_size_desc":
    "Największy filtr synchronizacji wypuszczony w eter",
  "settings.diag.fpr": "Odsetek fałszywych trafień",
  "settings.diag.fpr_desc":
    "Jak często filtr twierdzi, że mamy pakiet, którego nam brakuje",
  "settings.diag.bytes": "{n} bajtów",
  "settings.diag.footnote":
    "Nic tutaj nie da się zmienić. Te wartości są ustalone, żeby Airhop pozostał zgodny z bitchat.",
  "settings.section.storage_desc": "Zużycie i pamięć podręczna",
  "settings.section.appearance": "Wygląd",
  "settings.section.appearance_desc": "Motyw, czcionka i język",
  "settings.section.help": "Pomoc i opinie",
  "settings.section.help_desc": "Napisz do nas, zgłoś błąd albo przeczytaj FAQ",
  "settings.section.support": "Wsparcie",
  "settings.section.support_desc": "Pomóż utrzymać rozwój w toku",
  "settings.section.about": "O aplikacji",
  "settings.section.about_desc": "Wersja, lista zmian i kod źródłowy",

  // ---- Settings: general ----
  "settings.general.undo": "Cofanie wysyłki",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Portfel",
  "settings.general.undo_seconds": "{count} sekund",
  "settings.general.undo_a11y": "Cofanie wysyłki: {value}",
  "settings.general.quality_a11y": "Ustaw jakość przesyłania na {value}",
  "settings.general.undo_desc":
    "Przytrzymuje wysłaną wiadomość przez chwilę, żebyś zdążył ją wycofać, zanim pójdzie dalej",
  "settings.general.undo_off_desc": "Wysyłaj od razu, bez cofania",
  "settings.general.undo_2": "2 sekundy",
  "settings.general.undo_2_desc": "Szybka szansa na wycofanie",
  "settings.general.undo_10": "10 sekund",
  "settings.general.undo_10_desc": "Najdłuższe okno",
  "settings.general.quality": "Jakość przesyłania",
  "settings.general.quality_desc":
    "Dotyczy zdjęć wysyłanych z aparatu albo z galerii. Każde zdjęcie i tak jest dopasowywane do sieci mesh.",
  "settings.general.quality_low": "Niska",
  "settings.general.quality_low_desc":
    "Najmniejsze zdjęcia, najszybsze do wysłania",
  "settings.general.quality_medium": "Średnia",
  "settings.general.quality_medium_desc": "Równowaga szczegółów i szybkości",
  "settings.general.quality_high": "Wysoka",
  "settings.general.quality_high_desc": "Zachowuje najwięcej szczegółów",
  "settings.general.feature_wallet_desc":
    "Wysyłaj ecash Cashu bezpośrednio przez sieć mesh",
  "settings.general.feature_wallet_a11y": "Portfel (zawsze włączony)",
  "settings.general.feature_ai_desc":
    "Prywatny asystent na urządzeniu, bez odwołań do sieci",
  "settings.general.feature_feeds": "Kanały społecznościowe",
  "settings.general.feature_feeds_desc":
    "Czytaj i publikuj w kanałach Bluesky i Mastodona",
  "settings.general.show_media": "Pokazuj multimedia automatycznie",
  "settings.general.show_media_desc":
    "Zdjęcia i filmy pojawiają się w czacie albo czekają na dotknięcie",
  "settings.general.reset": "Zresetuj ustawienia",
  "settings.general.media_retention": "Przechowuj multimedia przez",
  "settings.general.media_retention_desc":
    "Zdjęcia, filmy i notatki głosowe są usuwane po wybranym czasie",
  "settings.general.media_retention_sheet":
    "Wybierz, jak długo multimedia zostają na tym urządzeniu. Usuniętych nie da się odzyskać.",
  "settings.general.retention_7_desc":
    "Najmniej zostaje po sobie. Najlepsze, jeśli ryzykiem jest sam telefon.",
  "settings.general.retention_14_desc":
    "Złoty środek na tydzień albo dwa bez zasięgu.",
  "settings.general.retention_30_desc":
    "Najdłużej utrzymuje wątki czytelnymi i najwięcej trzyma na dysku.",
  "settings.general.reset_desc":
    "Przywraca każdemu ustawieniu wartość domyślną, nie ruszając tożsamości, wiadomości, kontaktów ani portfela",
  "settings.general.reset_title": "Zresetować ustawienia?",
  "settings.general.reset_body":
    "Każde ustawienie wraca do wartości domyślnej: wygląd, cofanie wysyłki i łączność (internet, Tor, brama, most, przekaźniki). Twoja tożsamość, wiadomości, kontakty i portfel pozostają nietknięte.",
  "settings.general.reset_confirm": "Zresetuj",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet jest zawsze włączony dla wiadomości bezpośrednich",
  "settings.security.signed_packets": "Podpisane pakiety",
  "settings.security.signed_packets_desc":
    "Każdy pakiet jest podpisany kluczem Ed25519",
  "settings.security.hide_previews": "Ukryj podgląd w powiadomieniach",
  "settings.security.hide_previews_desc":
    "Trzyma nadawcę i treść z dala od ekranu blokady, który pokazuje je bez odblokowania",
  "settings.security.no_blocked": "Brak zablokowanych peerów",
  "settings.security.no_blocked_desc":
    "Zablokowani peerzy nie mogą do ciebie pisać ani pojawiać się w zakładce Mesh",
  "settings.security.unblock_title": "Odblokuj tego peera",
  "settings.security.unblock": "Odblokuj",
  "settings.security.unblock_peer": "Odblokuj {name}",
  "settings.security.unblock_body":
    "{name} znów będzie mógł do ciebie pisać i pojawi się w zakładce Mesh, gdy będzie w pobliżu.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Internet zapasowo",
  "settings.network.internet_desc":
    "Kontynuuj przez przekaźniki Nostr, gdy peerzy w sieci mesh są poza zasięgiem",
  "settings.network.internet_off_title": "Wyłączyć internet?",
  "settings.network.internet_off_body":
    "Airhop będzie działać wyłącznie na Bluetooth. Przestaje kontaktować się z jakimkolwiek przekaźnikiem Nostr, a Tor, brama internetowa i most mesh wyłączają się. Czat przez Bluetooth w pobliżu działa dalej.",
  "settings.network.turn_off": "Wyłącz",
  "settings.network.discovery": "Wykrywanie geoprzekaźników",
  "settings.network.discovery_desc":
    "Automatycznie wybieraj najbliższe przekaźniki dla komórki lokalizacji spośród ponad 300 rozproszonych przekaźników",
  "settings.network.discovery_needs_relay": "Najpierw dodaj własny przekaźnik",
  "settings.network.discovery_needs_relay_body":
    "To automatyczne wykrywanie kieruje Airhop do najbliższych przekaźników. Wyłączenie go ma sens dopiero wtedy, gdy poniżej przypniesz własne przekaźniki, więc dodaj najpierw przynajmniej jeden.",
  "settings.network.custom_only_title": "Używać tylko własnych przekaźników?",
  "settings.network.custom_only_body":
    "Kanały lokalizacyjne i most mesh przestaną automatycznie wybierać najbliższe przekaźniki i będą korzystać wyłącznie z dodanych przez ciebie. Może to zmniejszyć zasięg i możesz przestać spotykać użytkowników aplikacji bitchat, którzy zbierają się na najbliższych przekaźnikach.",
  "settings.network.custom": "Własne przekaźniki",
  "settings.network.custom_desc":
    "Dodaj własne przekaźniki dla kanałów lokalizacyjnych i mostu mesh",
  "settings.network.custom_added": "dodano {count} z {max}",
  "settings.network.dm_relays": "Przekaźniki wiadomości",
  "settings.network.dm_relays_desc":
    "Wiadomości bezpośrednie i kanały prywatne zawsze korzystają z tych. Własne przekaźniki tego nie zmieniają.",
  "settings.network.discovery_back_on":
    "Wykrywanie geoprzekaźników znów włączone",
  "settings.network.discovery_back_on_body":
    "To był twój ostatni własny przekaźnik. Kanały lokalizacyjne potrzebują gdzieś publikować, więc Airhop znów automatycznie wybiera najbliższe przekaźniki.",
  "settings.network.add_relay": "Dodaj przekaźnik",
  "settings.network.remove_relay": "Usuń {url}",
  "settings.network.add_short": "Dodaj",
  "settings.network.relay_limit":
    "Możesz dodać {count} przekaźników. Usuń jeden, żeby dodać kolejny.",
  "settings.network.relay_duplicate":
    "Ten przekaźnik już jest na twojej liście.",
  "settings.network.relay_invalid":
    "Podaj prawidłowy adres przekaźnika, np. relay.example.com. Port jest potrzebny tylko wtedy, gdy przekaźnik nie używa domyślnego. Adresy IP i nazwy lokalne są niedozwolone.",
  "settings.network.wifi_pair": "Parowanie",
  "settings.network.wifi_paired": "Sparowane urządzenia",
  "settings.network.wifi_pair_find": "Znajdź urządzenie",
  "settings.network.wifi_pair_find_desc":
    "Poszukaj pobliskiego iPhone'a, który się pokazuje. Oba telefony potrzebują iOS 26 lub nowszego.",
  "settings.network.wifi_pair_show": "Pokaż tego iPhone'a",
  "settings.network.wifi_pair_show_desc":
    "Pozwól pobliskiemu iPhone'owi znaleźć ten. Jedna osoba szuka, druga się pokazuje, w tym samym czasie.",
  "settings.network.wifi_pair_find_action": "Wybierz pobliskiego iPhone'a",
  "settings.network.wifi_pair_show_action": "Uczyń tego iPhone'a wykrywalnym",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware jest teraz niedostępne",
  "settings.network.wifi_pair_forget": "Usuń sparowanie w aplikacji Settings",
  "settings.network.bitchat": "Zgodność z bitchat",
  "settings.network.bitchat_desc":
    "Ta sama sieć mesh BLE co w bitchat, w pełni współdziałająca. To jest zawsze włączone i nie da się tego wyłączyć.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Działaj w tle",
  "settings.conn.background_desc":
    "Utrzymuj sieć mesh, gdy Airhop jest zamknięty",
  "settings.conn.background_on_title": "Utrzymywać sieć mesh?",
  "settings.conn.background_on_body":
    "Airhop dalej przekazuje i odbiera, gdy jest zamknięty, więc wiadomości docierają, gdy cię nie ma. Android pokazuje w tym czasie stałe powiadomienie.",
  "settings.conn.background_off_title":
    "Zatrzymać sieć mesh po zamknięciu Airhop?",
  "settings.conn.background_off_body":
    "Wiadomości będą docierać tylko wtedy, gdy Airhop jest otwarty, a ten telefon przestanie przekazywać dla ludzi w pobliżu. Stałe powiadomienie znika.",
  "settings.conn.live_voice": "Głos na żywo",
  "settings.conn.live_voice_desc":
    "Rozmawiaj z ludźmi w pobliżu jak przez krótkofalówkę",
  "settings.conn.live_voice_on_title": "Włączyć głos na żywo?",
  "settings.conn.live_voice_on_body":
    "Przytrzymanie mikrofonu wysyła twój głos do wszystkich w zasięgu Bluetooth na bieżąco, a ich głos odtwarza się w twoim telefonie. Nic nie jest nagrywane.",
  "settings.conn.live_voice_off_title": "Wyłączyć głos na żywo?",
  "settings.conn.live_voice_off_body":
    "Przytrzymanie mikrofonu nagrywa zamiast tego notatkę głosową. Wysyła się po puszczeniu i nikt jej nie usłyszy, dopóki jej nie odtworzy.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Trasowanie przez Tor",
  "settings.conn.tor_desc":
    "Kieruj ruch Nostr przez Tor dla większej prywatności",
  "settings.conn.tor_on_title": "Kierować ruch Nostr przez Tor?",
  "settings.conn.tor_on_body":
    "Przekaźniki przestają widzieć twój adres IP. Łączenie trwa dłużej, a wiadomości docierają wolniej. Bluetooth pozostaje bez zmian.",
  "settings.conn.tor_off_title": "Wyłączyć trasowanie przez Tor?",
  "settings.conn.tor_off_body":
    "Ruch Nostr wraca na zwykłe połączenie, więc przekaźniki znów widzą twój adres IP. Bluetooth tak czy inaczej pozostaje bez zmian.",
  "settings.conn.tor_orbot_idle":
    "Orbot jest zainstalowany, ale niepołączony. Otwórz Orbota, uruchom jego VPN, a potem włącz to.",
  "settings.conn.tor_unavailable":
    "Trasowanie przez Tor jest niedostępne w tej kompilacji.",
  "settings.conn.tor_timeout":
    "Tor łączy się dłużej niż minutę. Zostaje włączony i próbuje dalej; zakładka Mesh powie, kiedy trasuje ruch albo czy ta sieć go blokuje.",
  "settings.conn.tor_failed":
    "Nie udało się uruchomić Tor. Upewnij się, że aplikacja ma dostęp do sieci.",
  "settings.conn.mint_clearnet": "Zezwól na ruch do mennicy przez otwartą sieć",
  "settings.conn.mint_clearnet_desc":
    "Tor na iOS obejmuje tylko Nostr. Zostaw wyłączone, żeby blokować zapytania do mennicy; ecash przez sieć mesh działa tak czy inaczej.",
  "settings.conn.gateway": "Brama internetowa",
  "settings.conn.gateway_desc":
    "Użycz swojego połączenia telefonowi bez internetu w pobliżu, żeby wciąż sięgał kanałów lokalizacyjnych",
  "settings.conn.gateway_on_title": "Włączyć bramę internetową?",
  "settings.conn.gateway_on_body":
    "Telefony w pobliżu bez własnego połączenia będą wysyłać i odbierać wiadomości z kanałów lokalizacyjnych przez twoje. Zużywa to twój transfer i baterię, a ich wiadomości pozostają zaszyfrowane na całej trasie, więc nie odczytasz tego, co przez ciebie przechodzi.",
  "settings.conn.gateway_off_title": "Wyłączyć bramę internetową?",
  "settings.conn.gateway_off_body":
    "Telefony bez internetu w pobliżu przestaną sięgać kanałów lokalizacyjnych przez twoje. Twoje własne wiadomości pozostają bez zmian.",
  "settings.conn.bridge": "Most mesh",
  "settings.conn.bridge_desc":
    "Połącz publiczny czat #bluetooth tej okolicy z inną grupą poza zasięgiem Bluetooth przez internet",
  "settings.conn.bridge_on_title": "Włączyć most mesh?",
  "settings.conn.bridge_on_body":
    "Twoje publiczne wiadomości #bluetooth będą publikowane w twojej dzielnicy przez internet, więc ludzie poza zasięgiem Bluetooth będą mogli je czytać. Wiadomości prywatne nigdy nie idą przez most, a „tylko w pobliżu” zatrzymuje pojedynczą wiadomość lokalnie.",
  "settings.conn.bridge_off_title": "Wyłączyć most mesh?",
  "settings.conn.bridge_off_body":
    "Twoje publiczne wiadomości #bluetooth znów zostają w zasięgu Bluetooth, a wiadomości z drugiej strony mostu przestają tu docierać.",
  "settings.conn.bridge_needs_location": "Most mesh potrzebuje lokalizacji",
  "settings.conn.bridge_needs_location_desc":
    "Znajduje twoją dzielnicę na podstawie ustalenia pozycji. Przyznaj lokalizację, żeby zacząć mostkowanie.",
  "settings.conn.grant_location": "Przyznaj uprawnienie do lokalizacji",
  "settings.conn.grant_short": "Przyznaj",
  "settings.conn.orbot_body":
    "Airhop kieruje ruch Tor przez Orbota. Zainstaluj i włącz Orbota ze Sklepu Play, a potem włącz to.",
  "settings.conn.internet_off": "Internet jest wyłączony",
  "settings.conn.internet_off_desc":
    "Tor, most i brama korzystają z internetu. Włącz Internet zapasowo w sekcji Sieć, żeby ich używać.",
  "settings.conn.turn_on": "Włącz",
  "settings.conn.turn_off": "Wyłącz",
  "settings.conn.orbot_title": "Tor na Androidzie",
  "settings.conn.get_orbot": "Pobierz Orbota",
  "settings.conn.later": "Później",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Znajduje urządzenia w pobliżu i przekazuje wiadomości między nimi. Bez tego sieć mesh nie zadziała.",
  "settings.permissions.location": "Lokalizacja",
  "settings.permissions.location_desc":
    "Otwiera kanały okolicy. Bez niej te kanały pozostają zamknięte, a sieć mesh na Bluetooth działa normalnie.",
  "settings.permissions.notifications": "Powiadomienia",
  "settings.permissions.notifications_desc":
    "Dostajesz alerty o nowych wiadomościach, nawet gdy aplikacja jest zamknięta. Bez nich zobaczysz je dopiero po otwarciu Airhop.",
  "settings.permissions.camera": "Aparat",
  "settings.permissions.camera_desc":
    "Skanuje kody QR i robi zdjęcia albo filmy do wysłania. Bez niego nadal możesz udostępniać multimedia z galerii.",
  "settings.permissions.photos": "Zdjęcia",
  "settings.permissions.photos_desc":
    "Wysyła zdjęcia z galerii i zapisuje odebrane multimedia. Bez tego nadal możesz robić i wysyłać nowe zdjęcia aparatem.",
  "settings.permissions.microphone": "Mikrofon",
  "settings.permissions.microphone_desc":
    "Nagrywa i wysyła wiadomości głosowe albo obsługuje głos na żywo. Bez niego wiadomości głosowe i głos na żywo nie zadziałają.",
  "settings.permissions.allow": "Zezwól na to uprawnienie",
  "settings.permissions.open_settings":
    "Otwórz ustawienia systemu, żeby zmienić to uprawnienie",
  "settings.permissions.system": "System",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Zużycie sieci",
  "settings.storage.storage_usage": "Zużycie pamięci",
  "settings.storage.storage_usage_desc":
    "Wiadomości, dowody portfela i załączniki w pamięci podręcznej",
  "settings.storage.session_usage":
    "Ta sesja · wysłano {sent}, odebrano {received}",
  "settings.storage.cache": "Pamięć podręczna",
  "settings.storage.cache_desc": "{size} załączników",
  "settings.storage.clear_cache": "Wyczyść pamięć podręczną załączników",
  "settings.storage.clear": "Wyczyść",
  "settings.storage.clear_title": "Wyczyścić multimedia z pamięci podręcznej?",
  "settings.storage.clear_body":
    "Zdjęcia, filmy, notatki głosowe i pliki znikają z tego urządzenia, zarówno wysłane, jak i odebrane. Nie da się ich pobrać ponownie: ich dymki to powiedzą, a ty możesz poprosić nadawcę o ponowne wysłanie. Wiadomości i portfel pozostają nietknięte.",
  "settings.storage.cleared": "Pamięć podręczna wyczyszczona",
  "settings.storage.freed": "Zwolniono {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Ustaw wygląd na {value}",
  "settings.font.set_a11y": "Ustaw czcionkę o stałej szerokości na {value}",
  "settings.font.system": "Systemowa",
  "settings.font.system_desc":
    "Używa domyślnej czcionki o stałej szerokości z twojego urządzenia",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Nowoczesna i łatwa do czytania",
  "settings.language.en": "angielski",
  "settings.language.am": "amharski",
  "settings.language.ar": "arabski",
  "settings.language.bn": "bengalski",
  "settings.language.my": "birmański",
  "settings.language.zh_hans": "chiński (uproszczony)",
  "settings.language.zh_hant": "chiński (tradycyjny)",
  "settings.language.nl": "niderlandzki",
  "settings.language.fil": "filipiński",
  "settings.language.fr": "francuski",
  "settings.language.ka": "gruziński",
  "settings.language.de": "niemiecki",
  "settings.language.hi": "hindi",
  "settings.language.id": "indonezyjski",
  "settings.language.it": "włoski",
  "settings.language.ja": "japoński",
  "settings.language.ko": "koreański",
  "settings.language.mg": "malgaski",
  "settings.language.ms": "malajski",
  "settings.language.ne": "nepalski",
  "settings.language.fa": "perski",
  "settings.language.pl": "polski",
  "settings.language.pt_br": "portugalski (Brazylia)",
  "settings.language.pt_pt": "portugalski (Portugalia)",
  "settings.language.pa": "pendżabski",
  "settings.language.ru": "rosyjski",
  "settings.language.es": "hiszpański",
  "settings.language.sw": "suahili",
  "settings.language.sv": "szwedzki",
  "settings.language.ta": "tamilski",
  "settings.language.th": "tajski",
  "settings.language.tr": "turecki",
  "settings.language.uk": "ukraiński",
  "settings.language.ur": "urdu",
  "settings.language.vi": "wietnamski",
  "settings.language.pseudo": "pseudojęzyk",
  "settings.language.soon": "Wkrótce",
  "settings.language.soon_a11y": "{value}, wkrótce",
  "settings.language.set_a11y": "Ustaw język na {value}",
  "settings.language.pending": "Po następnym otwarciu",
  "settings.language.pending_a11y":
    "{value}, zadziała przy następnym otwarciu Airhop",
  "settings.language.rtl_restart": "Otwórz ponownie",
  "settings.language.rtl_title": "Otwórz Airhop ponownie, żeby dokończyć",
  "settings.language.rtl_body":
    "{value} czyta się od prawej do lewej, a Airhop może zmienić kierunek tylko przy starcie. Zamknij aplikację i otwórz ją ponownie, żeby dokończyć zmianę. Nic nie ginie, a twoja sieć mesh zostaje połączona, dopóki tego nie zrobisz.",
  "settings.theme.light": "Jasny",
  "settings.theme.light_desc": "Zawsze używaj jasnej palety",
  "settings.theme.dark": "Ciemny",
  "settings.theme.dark_desc": "Zawsze używaj ciemnej palety",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Dostępny",
  "settings.status.online_desc": "Wykrywalny, rozgłasza i skanuje",
  "settings.status.away": "Niedostępny",
  "settings.status.away_desc":
    "Sieć mesh wstrzymana, brak skanowania i rozgłaszania",
  "settings.status.invisible": "Niewidoczny",
  "settings.status.invisible_desc": "Skanuje, ale ukryty przed wykrywaniem",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Ustaw status na {value}",
  "settings.status.edit": "Zmień status",
  "settings.status.desc": "Wybierz, jak bardzo jesteś widoczny w sieci mesh.",
  "settings.transfer.identity": "Tożsamość i klucze",
  "settings.transfer.identity_desc":
    "Twój identyfikator peera, nazwa i kontakty",
  "settings.transfer.chats": "Czaty i historia",
  "settings.transfer.chats_desc":
    "Rozmowy, grupy i kanały, do których dołączyłeś",
  "settings.transfer.wallet": "Saldo portfela",
  "settings.transfer.wallet_desc": "Dowody Cashu i historia transakcji",
  "settings.transfer.title": "Przenieś na nowy telefon",
  "settings.transfer.desc":
    "Przenieś tożsamość, czaty i portfel na inne urządzenie",
  "settings.transfer.coming_soon_a11y": "Przenieś na nowy telefon, wkrótce",
  "settings.transfer.body":
    "Przyłóż telefony do siebie i przenieś wszystko przez Bluetooth. Nic nie przechodzi przez serwer, więc działa bez internetu.",
  "settings.qr.permission_label": "Dostęp do zdjęć",
  "settings.qr.permission_purpose": "zapisać twój kod QR",
  "settings.qr.saved": "Zapisano",
  "settings.qr.saved_body": "Kod QR zapisany w galerii zdjęć.",
  "settings.qr.save_failed": "Nie udało się zapisać",
  "settings.qr.save_failed_body":
    "Nie udało się zapisać kodu QR. Spróbuj ponownie.",
  "settings.qr.share_message": "Dodaj mnie w Airhop",
  "settings.qr.share_body":
    "Dodaj mnie w Airhop — prywatne wiadomości w sieci mesh, działające przede wszystkim offline.",
  "settings.qr.show_short": "Pokaż QR",
  "settings.qr.title": "Twój kod QR",
  "settings.qr.note":
    "Zawiera twoje klucze publiczne, dzięki którym inni mogą napisać do ciebie skądkolwiek. Udostępniaj go tylko osobom, którym ufasz. Nie zmieni się, dopóki nie wyczyścisz swojej tożsamości.",
  "settings.qr.code_label": "Kod kontaktu",
  "settings.qr.copy_code": "Kopiuj kod kontaktu",
  "settings.qr.share": "Udostępnij kod QR",
  "settings.qr.share_short": "Udostępnij QR",
  "settings.qr.download": "Pobierz kod QR",
  "settings.qr.download_short": "Pobierz QR",
  "settings.qr.show": "Pokaż kod QR",
  "settings.wipe.trigger": "Uruchom awaryjne czyszczenie",
  "settings.wipe.trigger_desc":
    "Trzykrotne dotknięcie czyści natychmiast, bez potwierdzania",
  "settings.wipe.title": "Awaryjne czyszczenie",
  "settings.wipe.now": "Wyczyść teraz",
  "settings.wipe.desc":
    "Natychmiast niszczy wszystkie klucze, wiadomości i dowody",
  "settings.wipe.body":
    "To natychmiast zniszczy wszystkie twoje klucze, wiadomości i dowody portfela. Nie da się tego cofnąć.",
  "settings.wipe.in_progress": "Czyszczenie",
  "settings.wipe.in_progress_body":
    "Niszczenie kluczy, wiadomości i plików. Trwa to kilka sekund i kończy się samo, nawet gdy aplikacja zostanie zamknięta.",
  "settings.wipe.got_it": "Rozumiem",
  "settings.wipe.keys_failed": "Nie udało się zniszczyć kluczy",
  "settings.wipe.keys_failed_body":
    "Twoje wiadomości, kontakty i portfel zniknęły, ale urządzenie nie chciało wydać twoich kluczy. Odblokuj urządzenie i wyczyść jeszcze raz.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Napisz do nas",
  "settings.help.contact_a11y": "Wyślij e-mail na {address}",
  "settings.help.bug": "Zgłoś błąd",
  "settings.help.bug_desc": "Załóż zgłoszenie w serwisie GitHub",
  "settings.help.bug_a11y": "Zgłoś błąd w serwisie GitHub",
  "settings.help.faq": "Najczęstsze pytania",
  "settings.help.faq_desc": "Odpowiedzi na typowe pytania",
  "settings.help.faq_a11y": "Otwórz FAQ",
  "settings.help.terms_desc": "Jak można korzystać z Airhop",
  "settings.help.terms_a11y": "Otwórz regulamin",
  "settings.help.privacy_desc": "Czego nie zbieramy",
  "settings.help.privacy_a11y": "Otwórz politykę prywatności",

  // ---- Settings: support ----
  "settings.support.card": "Karta albo UPI",
  "settings.support.card_desc":
    "Bankowość internetowa i portfele, na całym świecie",
  "settings.support.card_a11y":
    "Wesprzyj kartą, przez UPI, bankowość internetową albo portfel",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Co miesiąc albo jednorazowo, bez prowizji platformy",
  "settings.support.sponsors_a11y": "Wesprzyj przez GitHub Sponsors",
  "settings.support.note":
    "Buduję Airhop po godzinach. Nie ma inwestorów ani reklam. Jeśli aplikacja ci się przydaje, wpłata bardzo pomaga utrzymać rozwój w toku. Każda funkcja i tak zostaje darmowa.",

  // ---- Settings: about and version ----
  "settings.about.version": "Wersja",
  "settings.about.version_desc": "Bieżące wydanie",
  "settings.about.version_a11y": "Pokaż wersję i sprawdź aktualizacje",
  "settings.about.release_notes": "Informacje o wydaniu",
  "settings.about.release_notes_desc": "Co nowego w najnowszym wydaniu",
  "settings.about.release_notes_a11y":
    "Otwórz najnowsze informacje o wydaniu w serwisie GitHub",
  "settings.about.source": "Kod źródłowy",
  "settings.about.source_a11y": "Otwórz kod źródłowy w serwisie GitHub",
  "settings.about.licenses": "Licencje otwartego oprogramowania",
  "settings.about.open_repo": "Otwórz repozytorium {name}",
  "settings.about.licenses_desc":
    "Pakiety otwartego oprogramowania od innych twórców",
  "settings.about.licenses_a11y": "Pokaż licencje innych twórców",
  "settings.version.codename": "Nazwa kodowa",
  "settings.version.checking": "Sprawdzanie",
  "settings.version.check": "Sprawdź aktualizacje",
  "settings.version.checking_title": "Sprawdzanie aktualizacji",
  "settings.version.up_to_date": "Masz najnowszą wersję.",
  "settings.version.release_notes": "Pokaż informacje o wydaniu",
  "settings.version.made_with": "Zrobione z",
  "settings.version.number": "Wersja {version}",
  "settings.version.update_to": "Zaktualizuj do {version}",
  "settings.version.update_to_a11y": "Zaktualizuj do wersji {version}",
  "settings.version.released_under": "Wydane na licencji {license}",
  "settings.version.notes_a11y": "Pokaż informacje o wydaniu wersji {version}",
  "settings.version.tor_paused":
    "Sprawdzanie aktualizacji jest wstrzymane, gdy Tor jest włączony, żeby nie ujawniło twojego IP. Zajrzyj na stronę wydań w przeglądarce.",
  "settings.version.check_failed":
    "Nie udało się sprawdzić aktualizacji. Sprawdź połączenie i spróbuj ponownie.",
  "settings.version.downloading": "Pobieranie {percent}%",
  "settings.version.install": "Zainstaluj",
  "settings.version.download_failed":
    "Pobieranie nie powiodło się. Sprawdź połączenie i spróbuj ponownie.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} ma {size} KiB, ponad limit {cap} KiB.",
  "transfer.failed.malformed":
    "Załącznik dotarł uszkodzony i nie dało się go otworzyć. Poproś o ponowne wysłanie.",
  "transfer.failed.unsupported_type":
    "Załącznik dotarł w formacie, którego ta aplikacja nie otworzy.",
  "transfer.failed.type_mismatch":
    "Załącznik został odrzucony: jego zawartość nie zgadza się z deklarowanym typem pliku.",
  "transfer.failed.storage":
    "Załącznik dotarł, ale nie dało się go zapisać. Sprawdź wolne miejsce.",
  "transfer.badge.waiting": "Czekanie · {name}",
  "transfer.badge.active_count": "{count} transferów",
  "transfer.badge.sending": "Wysyłanie: {name}",
  "transfer.badge.receiving": "Odbieranie: {name}",
  "transfer.badge.a11y": "{label}, {percent} procent. Otwórz rozmowę.",
  "transfer.kind.photo": "Zdjęcie",
  "transfer.kind.video": "Wideo",
  "transfer.kind.voice": "Notatka głosowa",
  "transfer.this.photo": "To zdjęcie",
  "transfer.this.video": "To wideo",
  "transfer.this.voice": "Ta notatka głosowa",
  "transfer.this.file": "Ten plik",
  "transfer.kind.document": "Dokument",
  "transfer.kind.voice_preview": "Notatka głosowa",
  "transfer.kind.photo_preview": "Zdjęcie",
  "transfer.kind.video_preview": "Wideo",
  "transfer.kind.document_preview": "Dokument",

  // ---- System notifications ----
  "notif.channel.messages": "Wiadomości",
  "notif.channel.nearby": "Peerzy w pobliżu",
  "notif.channel.nearby_desc":
    "Sporadyczna informacja, gdy sieć mesh znajdzie ludzi w zasięgu Bluetooth.",
  "notif.nearby.body":
    "W zasięgu Bluetooth. Naciśnij, żeby otworzyć sieć mesh.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Ktoś",
  "notif.notice_urgent": "Pilne ogłoszenie · {content}",
  "notif.notice": "Ogłoszenie · {content}",
  "notif.incoming_file": "Plik przychodzący",
  "notif.preview.photo": "📷 Zdjęcie",
  "notif.preview.voice": "🎤 Wiadomość głosowa",
  "notif.preview.video": "🎥 Wideo",
  "notif.preview.document": "📄 Dokument",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Nowa wiadomość",
  "notif.hidden.channel": "Nowa aktywność",
  "notif.hidden.mention": "Ktoś cię wspomniał",
  "notif.mention.title": "{sender} cię wspomniał",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Pokaż jeszcze {count}",
    few: "Pokaż jeszcze {count}",
    many: "Pokaż jeszcze {count}",
    other: "Pokaż jeszcze {count}",
  },
  "chat.channels.show_more_a11y": {
    one: "Pokaż jeszcze {count} kanał domyślny",
    few: "Pokaż jeszcze {count} kanały domyślne",
    many: "Pokaż jeszcze {count} kanałów domyślnych",
    other: "Pokaż jeszcze {count} kanału domyślnego",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} nieprzeczytana",
    few: "{label}, {count} nieprzeczytane",
    many: "{label}, {count} nieprzeczytanych",
    other: "{label}, {count} nieprzeczytanej",
  },
  "a11y.new_count": {
    one: "{label}, {count} nowa",
    few: "{label}, {count} nowe",
    many: "{label}, {count} nowych",
    other: "{label}, {count} nowej",
  },
  "chat.a11y.unread": {
    one: "{count} nieprzeczytana",
    few: "{count} nieprzeczytane",
    many: "{count} nieprzeczytanych",
    other: "{count} nieprzeczytanej",
  },
  "chat.thread.length_left": {
    one: "pozostało {count}",
    few: "pozostało {count}",
    many: "pozostało {count}",
    other: "pozostało {count}",
  },
  "settings.general.retention_days": {
    one: "{count} dzień",
    few: "{count} dni",
    many: "{count} dni",
    other: "{count} dnia",
  },
  "chat.info.group_reach": {
    one: "{reachable} z {count} członka w zasięgu",
    few: "{reachable} z {count} członków w zasięgu",
    many: "{reachable} z {count} członków w zasięgu",
    other: "{reachable} z {count} członka w zasięgu",
  },
  "chat.group_members": {
    one: "Grupa prywatna  ·  {count} członek",
    few: "Grupa prywatna  ·  {count} członkowie",
    many: "Grupa prywatna  ·  {count} członków",
    other: "Grupa prywatna  ·  {count} członka",
  },
  "chat.select.count": {
    one: "{count} wybrana",
    few: "{count} wybrane",
    many: "{count} wybranych",
    other: "{count} wybranej",
  },
  "chat.select.forward": {
    one: "Prześlij dalej {count} wiadomość",
    few: "Prześlij dalej {count} wiadomości",
    many: "Prześlij dalej {count} wiadomości",
    other: "Prześlij dalej {count} wiadomości",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} osoba mówi",
    few: "{count} osoby mówią",
    many: "{count} osób mówi",
    other: "{count} osoby mówi",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} peer w zasięgu",
    few: "{count} peery w zasięgu",
    many: "{count} peerów w zasięgu",
    other: "{count} peera w zasięgu",
  },
  "mesh.peer.hops_away": {
    one: "{count} przeskok stąd",
    few: "{count} przeskoki stąd",
    many: "{count} przeskoków stąd",
    other: "{count} przeskoku stąd",
  },
  "chat.presence.active": {
    one: "{count} aktywny",
    few: "{count} aktywni",
    many: "{count} aktywnych",
    other: "{count} aktywnego",
  },
  "chat.presence.nearby": {
    one: "{count} w pobliżu",
    few: "{count} w pobliżu",
    many: "{count} w pobliżu",
    other: "{count} w pobliżu",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mennica",
    few: "{count} mennice",
    many: "{count} mennic",
    other: "{count} mennicy",
  },
  "wallet.mint.remove_body": {
    one: "{mint} przechowuje {balance} {unit} w {count} dowodzie. Usunięcie kasuje ten dowód z tego urządzenia na stałe i nie ma kopii zapasowej. Najpierw wypłać albo wyślij saldo.",
    few: "{mint} przechowuje {balance} {unit} w {count} dowodach. Usunięcie kasuje te dowody z tego urządzenia na stałe i nie ma kopii zapasowej. Najpierw wypłać albo wyślij saldo.",
    many: "{mint} przechowuje {balance} {unit} w {count} dowodach. Usunięcie kasuje te dowody z tego urządzenia na stałe i nie ma kopii zapasowej. Najpierw wypłać albo wyślij saldo.",
    other:
      "{mint} przechowuje {balance} {unit} w {count} dowodu. Usunięcie kasuje ten dowód z tego urządzenia na stałe i nie ma kopii zapasowej. Najpierw wypłać albo wyślij saldo.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} wpłata czeka na płatność. Sprawdzana ponownie przy każdym otwarciu aplikacji.",
    few: "{count} wpłaty czekają na płatność. Sprawdzane ponownie przy każdym otwarciu aplikacji.",
    many: "{count} wpłat czeka na płatność. Sprawdzane ponownie przy każdym otwarciu aplikacji.",
    other:
      "{count} wpłaty czeka na płatność. Sprawdzana ponownie przy każdym otwarciu aplikacji.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Odzyskano {count} niewydany dowód z {mints}.",
    few: "Odzyskano {count} niewydane dowody z {mints}.",
    many: "Odzyskano {count} niewydanych dowodów z {mints}.",
    other: "Odzyskano {count} niewydanego dowodu z {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "Znaleziono {count} monetę, ale była już wydana, więc nic za nią nie dopisano. To normalne: każda moneta, którą kiedykolwiek wydałeś, zostaje w rejestrze prowadzonym przez mennicę.",
    few: "Znaleziono {count} monety, ale były już wydane, więc nic za nie nie dopisano. To normalne: każda moneta, którą kiedykolwiek wydałeś, zostaje w rejestrze prowadzonym przez mennicę.",
    many: "Znaleziono {count} monet, ale były już wydane, więc nic za nie nie dopisano. To normalne: każda moneta, którą kiedykolwiek wydałeś, zostaje w rejestrze prowadzonym przez mennicę.",
    other:
      "Znaleziono {count} monety, ale była już wydana, więc nic za nią nie dopisano. To normalne: każda moneta, którą kiedykolwiek wydałeś, zostaje w rejestrze prowadzonym przez mennicę.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Pokaż jeszcze {count}",
    few: "Pokaż jeszcze {count}",
    many: "Pokaż jeszcze {count}",
    other: "Pokaż jeszcze {count}",
  },
  "wallet.activity.show_more_a11y": {
    one: "Pokaż jeszcze {count} płatność",
    few: "Pokaż jeszcze {count} płatności",
    many: "Pokaż jeszcze {count} płatności",
    other: "Pokaż jeszcze {count} płatności",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} niepotwierdzony",
    few: "{count} niepotwierdzone",
    many: "{count} niepotwierdzonych",
    other: "{count} niepotwierdzonego",
  },
  "wallet.proof_count": {
    one: "{count} dowód",
    few: "{count} dowody",
    many: "{count} dowodów",
    other: "{count} dowodu",
  },
  "wallet.spent_removed_detail": {
    one: "{count} dowód był już wydany i został usunięty.",
    few: "{count} dowody były już wydane i zostały usunięte.",
    many: "{count} dowodów było już wydanych i zostało usuniętych.",
    other: "{count} dowodu było już wydane i zostało usunięte.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Ktoś w pobliżu",
    few: "{count} osoby w pobliżu",
    many: "{count} osób w pobliżu",
    other: "{count} osoby w pobliżu",
  },
};

export const pl = { strings, plurals };
