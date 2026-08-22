import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Powrót na stronę główną",
  "common.last_updated": "Ostatnia aktualizacja: {date}",

  "nav.aria": "Nawigacja główna",
  "nav.home": "Strona główna Airhop",
  "nav.skip": "Przejdź do treści",
  "nav.menu.open": "Otwórz menu",
  "nav.menu.close": "Zamknij menu",
  "nav.how_it_works": "Jak to działa",
  "nav.architecture": "Architektura",
  "nav.faq": "FAQ",

  "footer.aria": "Stopka",
  "footer.tagline": "Prywatna komunikacja mesh",
  "footer.credit": "© Zrobione z {heart} przez {author}",
  "footer.group.download": "Pobierz",
  "footer.group.resources": "Materiały",
  "footer.group.social": "Społeczności",
  "footer.group.legal": "Prawne",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Architektura",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "FAQ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Regulamin",
  "footer.link.privacy": "Polityka prywatności",
  "footer.link.license": "Licencja projektu",

  "settings.theme.group": "Motyw kolorystyczny",
  "settings.theme.light": "Motyw jasny",
  "settings.theme.dark": "Motyw ciemny",
  "settings.language.label": "Język",
  "settings.language.suggestion": "Zobacz tę stronę po polsku",
  "settings.language.dismiss": "Zamknij",

  "home.hero.release": "Najnowsza wersja",
  "home.hero.title": "Wiadomości, które działają bez internetu.",
  "home.hero.body":
    "Telefony w pobliżu tworzą sieć mesh przez Bluetooth i przekazują twoje wiadomości nawet przez siedem przeskoków, szyfrowane od końca do końca. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Bez serwerów",
  "home.hero.body.no_accounts": "bez kont",
  "home.hero.body.no_tracking": "bez śledzenia",
  "home.hero.download": "Pobierz aplikację",
  "home.hero.badges": "Licencja MIT · Wolna i otwartoźródłowa · Działa z bitchat",
  "home.hero.group.mobile": "Mobilne",
  "home.hero.group.desktop": "Komputer",
  "home.hero.option.f_droid": "Katalog otwartego oprogramowania",
  "home.hero.option.apk": "Pobieranie bezpośrednie",
  "home.hero.option.soon": "Wkrótce",

  "home.about.eyebrow": "Czym jest Airhop",
  "home.about.title": "Większość aplikacji zależy od centralnego serwera.",
  "home.about.sub":
    "Serwer można obserwować, wyłączyć albo zablokować. Airhop nie ma żadnego, więc nie ma firmy, na którą można naciskać, ani usługi, którą można zamknąć.",
  "home.about.card": "Przegląd techniczny",
  "home.about.link.mesh": "sieć mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protokół transmisji",
  "home.about.body.built":
    "Airhop to otwartoźródłowa aplikacja na iOS i Androida do prywatnych wiadomości bezpośrednio między urządzeniami przez {mesh}. Powstała na fundamencie {bitchat}, wykorzystuje jego {wire_protocol} i model bezpieczeństwa, a następnie rozszerza je o płatności {ecash} offline i sztuczną inteligencję offline. Działa całkowicie bez internetu, a wiadomości są automatycznie przekazywane między urządzeniami w pobliżu (około 10 do 30 metrów na przeskok w budynku, dalej na otwartej przestrzeni), nawet przez 7 przeskoków.",
  "home.about.body.identity":
    "Twoja tożsamość to para kluczy {ed25519} generowana na twoim urządzeniu i przechowywana w {ios_keychain} albo {android_keystore}. Nie ma kont, rejestracji ani niczego, co dotyka serwera, czyli można używać aplikacji jak jednorazowej, która po usunięciu nie zostawia nic, co prowadziłoby do ciebie.",
  "home.about.body.crypto":
    "Każda sesja korzysta z protokołu {noise} do uwierzytelnionego uzgadniania. Zapisane wiadomości korzystają z algorytmu {ratchet}, czyli nawet jeśli twoje urządzenie zostanie później przejęte, dawne wiadomości pozostaną nieczytelne. Awaryjne czyszczenie niszczy wszystkie klucze i wiadomości w niecałą sekundę.",
  "home.about.body.internet":
    "Kiedy ty i twój kontakt jesteście poza zasięgiem Bluetootha, przekaźniki {nostr} służą jako most przez internet, z wiadomościami bezpośrednimi zapakowanymi w formacie {nip17}, więc sieć mesh sięga całego świata, kiedy oboje jesteście online. Obsługa {tor} jest dostępna zarówno na iOS (przez {arti}), jak i na Androidzie (przez {orbot}).",
  "home.about.optional.title": "Airhop ma opcjonalne funkcje, które możesz włączyć:",
  "home.about.optional.payments.label": "Płatności offline:",
  "home.about.optional.payments.body":
    "Wysyłaj i odbieraj płatności przez sieć mesh za pomocą protokołu {cashu} (tylko Bitcoin).",
  "home.about.optional.ai.label": "Sztuczna inteligencja offline:",
  "home.about.optional.ai.body":
    "Mały asystent AI działający na urządzeniu, który odpowiada na ważne pytania. Całe przetwarzanie i dane zostają na twoim urządzeniu.",
  "home.about.body.compatible":
    "Airhop jest zgodny z bitchat na poziomie protokołu. Urządzenie z Airhop i urządzenie z bitchat w tej samej sieci mesh znajdują się automatycznie i mogą wymieniać wiadomości oraz wiadomości bezpośrednie bez żadnej konfiguracji.",

  "home.situations.eyebrow": "Kiedy jest potrzebny",
  "home.situations.title": "Na dzień, w którym sieć padnie.",
  "home.situations.sub":
    "Klęski żywiołowe, blokady internetu, masowe protesty albo zwykły weekend poza zasięgiem.",
  "home.situations.disaster.label": "Katastrofa",
  "home.situations.disaster.line":
    "Maszty nie działają. Ogłoszenie na tablicy dociera do każdego, kto przechodzi obok.",
  "home.situations.offgrid.label": "Poza siecią",
  "home.situations.offgrid.line":
    "Drugi dzień na szlaku. Ostatnia kreska zasięgu zniknęła wczoraj.",
  "home.situations.protest.label": "Protest",
  "home.situations.protest.line": "Kod QR na ulotce otwiera szyfrowany kanał dla marszu.",
  "home.situations.festival.label": "Festiwal",
  "home.situations.festival.line":
    "Brak zasięgu na terenie. Wiadomości skaczą przez telefony nieznajomych.",

  "home.showcase.eyebrow": "Zobacz aplikację",
  "home.showcase.title": "Zwykły komunikator, bez sieci.",
  "home.showcase.sub":
    "Rozmowy, kanały, portfel i tożsamość. Na powierzchni znajome, a pod spodem mesh, który wykonuje pracę.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Wszyscy w zasięgu, ułożeni według tego, jak blisko są. Nikogo nie trzeba wcześniej dodawać.",
  "home.showcase.mesh.alt":
    "Ekran Mesh aplikacji Airhop, pokazujący cztery pobliskie urządzenia rozmieszczone na radarze według siły sygnału.",
  "home.showcase.chats.title": "Rozmowy",
  "home.showcase.chats.caption":
    "Zwyczajne rozmowy. Telefony, które przekazują każdą wiadomość, nie mogą jej otworzyć.",
  "home.showcase.chats.alt":
    "Rozmowa prywatna w Airhop podczas przerwy w dostawie prądu, przekazana przez trzy telefony.",
  "home.showcase.channels.title": "Kanały",
  "home.showcase.channels.caption":
    "Publiczne pokoje wielkości jednej przecznicy albo całego regionu, otwarte dla każdego, kto tam jest.",
  "home.showcase.channels.alt":
    "Ekran rozmów aplikacji Airhop, z publicznymi kanałami ograniczonymi do przecznicy, dzielnicy, miasta i regionu.",
  "home.showcase.wallet.title": "Portfel",
  "home.showcase.wallet.caption":
    "Przekaż ecash osobie obok przez Bluetooth, kiedy żaden z telefonów nie jest online.",
  "home.showcase.wallet.alt":
    "Ekran portfela aplikacji Airhop, pokazujący saldo ecash, które można wysłać przez Bluetooth.",
  "home.showcase.identity.title": "Tożsamość",
  "home.showcase.identity.caption":
    "Bez rejestracji, bez numeru telefonu, bez e-maila. Tylko klucz, który nigdy nie opuszcza tego telefonu.",
  "home.showcase.identity.alt":
    "Ekran profilu aplikacji Airhop, pokazujący tożsamość wygenerowaną na urządzeniu, bez konta.",

  "home.how.eyebrow": "Jak to działa",
  "home.how.title": "Sieć mesh tworzy się sama.",
  "home.how.sub":
    "Pobliskie węzły tworzą samonaprawiającą się sieć mesh przez Bluetooth. Kiedy jest internet, przekaźniki Nostr ją rozszerzają, bez infrastruktury, którą ktokolwiek kontroluje.",
  "home.how.cta": "Przeczytaj pełną architekturę",
  "home.how.discover.title": "Wykrywanie",
  "home.how.discover.line":
    "Telefony z Airhop albo bitchat znajdują się automatycznie przez Bluetooth. Bez parowania, bez konfiguracji.",
  "home.how.relay.title": "Przekazywanie",
  "home.how.relay.line":
    "Wiadomość skacze z telefonu na telefon, nawet przez siedem przeskoków. Telefony pośrednie nigdy nie widzą tego, co przenoszą.",
  "home.how.reach.title": "Dalszy zasięg",
  "home.how.reach.line":
    "Kiedy jest internet, przekaźniki Nostr niosą tę samą rozmowę dalej, w razie potrzeby przez Tor.",
  "home.how.swipe": "przesuń, aby zobaczyć",
  "home.how.diagram": "Sieć mesh BLE · lokalna sieć między urządzeniami",
  "home.how.legend.node": "Węzeł sieci mesh BLE (offline)",
  "home.how.legend.relay": "Przekazywanie wieloprzeskokowe (szyfrowane Noise XX)",
  "home.how.legend.bitchat": "Zgodny z bitchat w tej samej sieci mesh",
  "home.how.legend.nostr": "Most Nostr (internet, gdy online)",

  "home.map.aria": "Mapa świata z lokalizacjami przekaźników Nostr",
  "home.map.summary": "Most Nostr · {relays} w {locations} na całym świecie",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Co potrafi",
  "home.features.title": "Prawdziwy komunikator, nie demo.",
  "home.features.sub":
    "Rozmowy, tożsamość, sieć i pieniądze. Wszystko zbudowane tak, by działało bez zasięgu, bez konta i bez niczego pośrodku.",

  "home.features.messaging.title": "Wiadomości",
  "home.features.messaging.summary":
    "Wszystko, co ma komunikator, przy zerowej infrastrukturze za nim.",
  "home.features.messaging.dms.name": "Prywatne wiadomości bezpośrednie",
  "home.features.messaging.dms.line":
    "Szyfrowane od końca do końca, z potwierdzeniem dostarczenia i odczytania.",
  "home.features.messaging.location.name": "Kanały lokalizacyjne",
  "home.features.messaging.location.line": "Pokoje przypisane do miejsca, od przecznicy po region.",
  "home.features.messaging.groups.name": "Prywatne kanały i grupy",
  "home.features.messaging.groups.line":
    "Linki z zaproszeniem do pokoju albo podpisana lista do 16 osób.",
  "home.features.messaging.board.name": "Tablica ogłoszeń",
  "home.features.messaging.board.line": "Ogłoszenia przypięte do obszaru nawet na siedem dni.",
  "home.features.messaging.voice.name": "Głos na żywo",
  "home.features.messaging.voice.line":
    "Przytrzymaj mikrofon i mów do wszystkich w zasięgu, jak przez krótkofalówkę.",
  "home.features.messaging.notes.name": "Notatki głosowe",
  "home.features.messaging.notes.line": "Nagrany dźwięk, szybszy niż pisanie wskazówek.",
  "home.features.messaging.files.name": "Zdjęcia, wideo i pliki",
  "home.features.messaging.files.line": "Dowolny format, do 1 MiB, bez potrzeby zasięgu.",
  "home.features.messaging.forward.name": "Zapisz i przekaż",
  "home.features.messaging.forward.line":
    "Zapieczętowana i niesiona przez pobliski telefon, aż dotrze do adresata.",

  "home.features.identity.title": "Tożsamość",
  "home.features.identity.summary": "Nie ma czego rejestrować ani czego zająć.",
  "home.features.identity.keys.name": "Tożsamość na parze kluczy",
  "home.features.identity.keys.line":
    "Tworzona na tym telefonie, przechowywana w pęku kluczy systemu.",
  "home.features.identity.names.name": "Czytelne nazwy",
  "home.features.identity.names.line":
    "Wyprowadzone z twojego klucza, więc nikt nie zabierze ci twojej.",
  "home.features.identity.qr.name": "Kontakty przez QR",
  "home.features.identity.qr.line": "Jedno skanowanie przenosi ich klucze, nie tylko nazwę.",
  "home.features.identity.panic.name": "Awaryjne czyszczenie",
  "home.features.identity.panic.line":
    "Każdy klucz i każda wiadomość zniszczone w niecałą sekundę.",

  "home.features.networking.title": "Sieć",
  "home.features.networking.summary": "To telefony są siecią.",
  "home.features.networking.mesh.name": "Sieć mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Bez internetu, bez routera, na telefonach, które ludzie już mają.",
  "home.features.networking.bridge.name": "Most mesh",
  "home.features.networking.bridge.line":
    "Łączy twoją publiczną rozmowę z pobliskim tłumem poza zasięgiem.",
  "home.features.networking.wifi.name": "Szybka ścieżka WiFi",
  "home.features.networking.wifi.line":
    "Szybsze przesyłanie między dwoma Androidami albo dwoma iPhone'ami.",
  "home.features.networking.bitchat.name": "Zgodny z bitchat",
  "home.features.networking.bitchat.line":
    "Obie aplikacje dołączają do tej samej sieci mesh bez konfiguracji.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Rozszerzenie, nigdy wymóg.",
  "home.features.internet.nostr.name": "Zapas przez Nostr",
  "home.features.internet.nostr.line":
    "Wiadomości bezpośrednie i kanały lokalizacyjne działają dalej poza zasięgiem radiowym.",
  "home.features.internet.relays.name": "Wyszukiwanie geoprzekaźników",
  "home.features.internet.relays.line":
    "Ponad 300 niezależnych publicznych przekaźników, żaden nie jest nasz.",
  "home.features.internet.gateway.name": "Brama internetowa",
  "home.features.internet.gateway.line":
    "Użycz swojego połączenia, by pobliski telefon bez sieci dotarł do kanałów lokalizacyjnych.",
  "home.features.internet.tor.name": "Integracja z Tor",
  "home.features.internet.tor.line":
    "Trasowane na obu platformach, więc przekaźniki nigdy nie widzą twojego IP.",

  "home.features.optional.title": "Opcjonalne",
  "home.features.optional.summary": "Domyślnie wyłączone. Włączone, kiedy zechcesz.",
  "home.features.optional.cashu.name": "Ecash Cashu",
  "home.features.optional.cashu.line": "Zapłać osobie obok, gdy żaden telefon nie jest online.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Doładuj albo wypłać w bitcoinie przez sieć Lightning.",
  "home.features.optional.ai.name": "Lokalna sztuczna inteligencja",
  "home.features.optional.ai.line": "Odpowiedzi na urządzeniu, nic nie opuszcza telefonu.",
  "home.features.optional.social.name": "Mosty społecznościowe",
  "home.features.optional.social.line": "Bluesky i Mastodon z tą samą tożsamością.",

  "home.compare.eyebrow": "Jak wypada",
  "home.compare.title": "Offline, bez dodatkowego sprzętu i otwarty.",
  "home.compare.sub":
    "Każda aplikacja tutaj jest w czymś dobra. Tylko część działa dalej, kiedy sieć przestaje.",
  "home.compare.col.project": "Projekt",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Szyfrowanie",
  "home.compare.col.offline": "Działa offline",
  "home.compare.col.hardware_free": "Bez dodatkowego sprzętu",
  "home.compare.col.open_source": "Otwarte źródła",
  "home.compare.mark.yes": "Tak",
  "home.compare.mark.no": "Nie",
  "home.compare.mark.partial": "Częściowo, klienty są otwarte, serwery nie",
  "home.compare.mark.partial_hint": "Klienty są otwarte, serwery nie",
  "home.compare.transport.servers": "Serwery scentralizowane",
  "home.compare.transport.onion": "Trasowanie cebulowe (węzły usługowe)",
  "home.compare.transport.nostr": "Przekaźniki Nostr",
  "home.compare.transport.lora": "Radio LoRa",
  "home.compare.transport.sub_ghz": "Zamknięte radio sub-GHz",

  "home.explore.eyebrow": "Otwarcie i uczciwie",
  "home.explore.title": "Każde stwierdzenie tutaj da się sprawdzić.",
  "home.explore.sub":
    "Kod, protokół i plany są publiczne. Ograniczenia też. Sprawdź sam, zanim uwierzysz nam na słowo.",
  "home.explore.audit.chip": "Audyt w toku",
  "home.explore.audit.headline": "Airhop nie przeszedł jeszcze zewnętrznego audytu bezpieczeństwa.",
  "home.explore.audit.body":
    "{headline} Cały kod jest osobiście przeglądany i przepuszczany przez {review} przed wydaniem, a używana biblioteka kryptograficzna została zaudytowana przez Cure53, ale to nie zastępuje formalnego audytu samej aplikacji. Jeden jest planowany na {version}. Do tego czasu nie polegaj na niej w sytuacjach wrażliwych.",
  "home.explore.audit.link.review": "agenta przeglądu bezpieczeństwa",
  "home.explore.source.title": "Kod źródłowy",
  "home.explore.source.desc":
    "Wszystko na GitHubie na licencji MIT. Zgłoszenia, pull requesty i dyskusje otwarte.",
  "home.explore.protocol.title": "Specyfikacja protokołu",
  "home.explore.protocol.desc":
    "Dokładny format transmisji, identyfikatory UUID dla BLE i stałe, wspólne z bitchat.",
  "home.explore.architecture.title": "Architektura",
  "home.explore.architecture.desc":
    "Pełny rozbiór techniczny, od naciśnięcia wyślij po bajty w eterze.",
  "home.explore.roadmap.title": "Plan rozwoju",
  "home.explore.roadmap.desc": "Cele wersji od v0.5.0 do v2.0.0, w tym planowany audyt.",
  "home.explore.vision.title": "Wizja",
  "home.explore.vision.desc":
    "Dlaczego Airhop istnieje i jakie zasady nie zmieniają się pod presją.",
  "home.explore.brand.title": "Materiały marki",
  "home.explore.brand.desc":
    "Pikselowy ptak, tokeny koloru i typografii, materiały prasowe i gotowe teksty.",

  "home.contribute.eyebrow": "Wesprzyj ten projekt",
  "home.contribute.title": "Niezależny i na widoku.",
  "home.contribute.sub":
    "Nie ma inwestorów, reklam ani wersji płatnej. Wszystkie funkcje i tak zostają darmowe, a pracę finansują ci, którym się przydaje.",
  "home.contribute.contribute.chip": "Współtwórz",
  "home.contribute.contribute.body":
    "Daj gwiazdkę repozytorium, zgłaszaj problemy i wysyłaj pull requesty. Zgłoszenia błędów, propozycje funkcji i wkład w kod są mile widziane.",
  "home.contribute.contribute.cta": "Zobacz na GitHubie",
  "home.contribute.sponsor.chip": "Sponsoruj",
  "home.contribute.sponsor.body":
    "Jeśli Airhop ci się przydaje, jednorazowa darowizna albo stałe wsparcie bardzo pomagają utrzymać rozwój.",
  "home.contribute.sponsor.donate": "Wpłać jednorazowo",
  "home.contribute.sponsor.github": "Sponsoruj na GitHubie",

  "page.architecture.eyebrow": "Dokumentacja",
  "page.architecture.title": "Architektura",
  "page.architecture.toc": "Na tej stronie",

  "page.faq.eyebrow": "FAQ",
  "page.faq.title": "Najczęstsze pytania",
  "page.faq.meta": "Częste pytania o Airhop.",
  "page.faq.contact":
    "Pytania bez odpowiedzi tutaj można wysłać na {email} albo zadać, otwierając dyskusję na {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Wkrótce",
  "page.blogs.body":
    "Teksty o sieciach mesh, prywatności i oprogramowaniu działającym najpierw offline.",

  "page.brand.eyebrow": "Marka",
  "page.brand.title": "Materiały marki",
  "page.brand.meta":
    "Materiały i zasady użycia Airhop w artykule, na stronie sklepu, w prelekcji albo w pliku README. Do swobodnego użytku jako źródło i dla prasy.",

  "page.legal.eyebrow": "Prawne",
  "page.privacy.title": "Polityka prywatności",
  "page.terms.title": "Regulamin",

  "page.notfound.title": "Nie znaleziono strony",
  "page.notfound.body": "Strona, której szukasz, nie istnieje albo została przeniesiona.",

  "page.english_only": "Ta strona jest dostępna tylko po angielsku.",

  "seo.breadcrumb.home": "Strona główna",

  "seo.home.title": "Airhop — Prywatny komunikator działający najpierw offline",
  "seo.home.description":
    "Prywatne wiadomości bezpośrednio między urządzeniami na iOS i Androida. Bez internetu, bez serwerów, bez kont. Komunikuj się przez sieć mesh Bluetooth wszędzie.",

  "seo.architecture.title": "Architektura — Airhop",
  "seo.architecture.description":
    "Jak działa Airhop od góry do dołu: tożsamość, wybór transportu, sieć mesh Bluetooth, szyfrowanie, warstwa internetowa, Tor, ecash offline, sztuczna inteligencja na urządzeniu i format transmisji zgodny z bitchat.",
  "seo.architecture.breadcrumb": "Architektura",
  "seo.architecture.headline": "Architektura Airhop",
  "seo.architecture.summary":
    "Pełny rozbiór techniczny Airhop: tożsamość, transporty, sieć mesh Bluetooth, szyfrowanie, warstwa internetowa Nostr, Tor, portfel Cashu, asystent AI na urządzeniu i format transmisji.",

  "seo.faq.title": "Najczęstsze pytania — Airhop",
  "seo.faq.description":
    "Odpowiedzi o wiadomościach przez sieć mesh Bluetooth w Airhop, szyfrowaniu, płatnościach offline, warstwie internetowej Nostr i zgodności z bitchat.",
  "seo.faq.breadcrumb": "FAQ",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description":
    "Teksty o sieciach mesh, prywatności i oprogramowaniu działającym najpierw offline.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Materiały marki — Airhop",
  "seo.brand.description":
    "Materiały marki Airhop: pikselowy ptak, znak słowny, tokeny koloru i typografii, materiały prasowe i gotowe teksty.",
  "seo.brand.breadcrumb": "Materiały marki",

  "seo.privacy.title": "Polityka prywatności — Airhop",
  "seo.privacy.description":
    "Jak Airhop obchodzi się z danymi: bez kont, bez serwerów, bez śledzenia. Twoja tożsamość i wiadomości zostają na twoim urządzeniu.",
  "seo.privacy.breadcrumb": "Polityka prywatności",

  "seo.terms.title": "Regulamin — Airhop",
  "seo.terms.description": "Warunki korzystania z aplikacji i strony Airhop.",
  "seo.terms.breadcrumb": "Regulamin",

  "seo.notfound.title": "Nie znaleziono strony — Airhop",
  "seo.notfound.description": "Strona, której szukasz, nie istnieje albo została przeniesiona.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} przekaźnik",
    few: "{count} przekaźniki",
    many: "{count} przekaźników",
    other: "{count} przekaźnika",
  },
  "home.map.locations": {
    one: "{count} lokalizacji",
    few: "{count} lokalizacjach",
    many: "{count} lokalizacjach",
    other: "{count} lokalizacjach",
  },
};

export const locale: Locale = { strings, plurals };
