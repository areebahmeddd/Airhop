import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "返回首頁",
  "common.last_updated": "最後更新：{date}",

  "nav.aria": "主導覽",
  "nav.home": "Airhop 首頁",
  "nav.skip": "跳至內容",
  "nav.menu.open": "開啟選單",
  "nav.menu.close": "關閉選單",
  "nav.how_it_works": "運作方式",
  "nav.architecture": "架構",
  "nav.faq": "常見問題",

  "footer.aria": "頁尾",
  "footer.tagline": "私密的網狀通訊",
  "footer.credit": "© 由 {author} 用 {heart} 打造",
  "footer.group.download": "下載",
  "footer.group.resources": "資源",
  "footer.group.social": "社群",
  "footer.group.legal": "法律",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "架構",
  "footer.link.blogs": "部落格",
  "footer.link.faq": "常見問題",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "服務條款",
  "footer.link.privacy": "隱私權政策",
  "footer.link.license": "專案授權",

  "settings.theme.group": "配色主題",
  "settings.theme.light": "淺色主題",
  "settings.theme.dark": "深色主題",
  "settings.language.label": "語言",
  "settings.language.suggestion": "以繁體中文檢視本頁",
  "settings.language.dismiss": "關閉",

  "home.hero.release": "最新版本",
  "home.hero.title": "沒有網路也能用的即時通訊。",
  "home.hero.body":
    "附近的手機組成 Bluetooth 網狀網路，以端對端加密將你的訊息轉送最多七跳。{no_servers}、{no_accounts}、{no_tracking}。",
  "home.hero.body.no_servers": "沒有伺服器",
  "home.hero.body.no_accounts": "沒有帳號",
  "home.hero.body.no_tracking": "沒有追蹤",
  "home.hero.download": "下載應用程式",
  "home.hero.badges": "MIT 授權 · 免費開源 · 相容 bitchat",
  "home.hero.group.mobile": "行動裝置",
  "home.hero.group.desktop": "桌面",
  "home.hero.option.f_droid": "開源應用程式目錄",
  "home.hero.option.apk": "直接下載",
  "home.hero.option.soon": "即將推出",

  "home.about.eyebrow": "什麼是 Airhop",
  "home.about.title": "大多數應用程式都依賴一台中央伺服器。",
  "home.about.sub":
    "伺服器可以被監控、關停或封鎖。Airhop 沒有伺服器，所以既沒有可以施壓的公司，也沒有可以關停的服務。",
  "home.about.card": "技術概覽",
  "home.about.link.mesh": "Bluetooth Low Energy 網狀網路",
  "home.about.link.wire_protocol": "傳輸協定",
  "home.about.body.built":
    "Airhop 是一款給 iOS 與 Android 的開源應用程式，透過 {mesh} 提供私密的點對點通訊。它建立在 {bitchat} 的基礎之上，沿用其 {wire_protocol} 與安全模型，並在此之上加入離線 {ecash} 支付與離線 AI。它在完全沒有網路的情況下也能運作，訊息會在附近的裝置之間自動轉送（室內每跳約 10 到 30 公尺，空曠處更遠），最多 7 跳。",
  "home.about.body.identity":
    "你的身分是一組在本機產生的 {ed25519} 金鑰，保存在 {ios_keychain} 或 {android_keystore} 之中。沒有帳號，沒有註冊，也沒有任何東西會接觸伺服器，也就是說它可以當作一次性應用程式使用，刪除後不會留下任何指向你的線索。",
  "home.about.body.crypto":
    "每個工作階段都使用 {noise} 協定完成經過驗證的交握。已儲存的訊息使用 {ratchet} 演算法，也就是說即使你的裝置日後遭到入侵，過去的訊息依然無法解讀。緊急抹除會在一秒內銷毀所有金鑰與訊息。",
  "home.about.body.internet":
    "當你和聯絡人都超出 Bluetooth 範圍時，{nostr} 中繼會作為透過網際網路的橋樑，使用 {nip17} 形式包裝的私訊，因此只要你們雙方都在線上，網狀網路就能延伸到全世界。{tor} 支援在 iOS（透過 {arti}）與 Android（透過 {orbot}）上皆可使用。",
  "home.about.optional.title": "Airhop 提供了一些可以自行開啟的功能：",
  "home.about.optional.payments.label": "離線支付：",
  "home.about.optional.payments.body": "使用 {cashu} 協定在網狀網路上收付款項（僅限 Bitcoin）。",
  "home.about.optional.ai.label": "離線 AI：",
  "home.about.optional.ai.body":
    "一個在本機運作的小型 AI 助理，可以回答重要問題。所有處理與資料都留在你的裝置上。",
  "home.about.body.compatible":
    "Airhop 在協定層與 bitchat 相容。同一網狀網路中的 Airhop 裝置與 bitchat 裝置會自動互相發現，無需任何設定即可交換訊息與私訊。",

  "home.situations.eyebrow": "什麼時候用得上",
  "home.situations.title": "為網路中斷的那一天準備。",
  "home.situations.sub": "天災、網路封鎖、大規模抗議，或者只是一個沒有訊號的普通週末。",
  "home.situations.disaster.label": "災害",
  "home.situations.disaster.line": "基地台癱瘓。公佈欄上的通知能傳給每一個路過的人。",
  "home.situations.offgrid.label": "離網",
  "home.situations.offgrid.line": "上山第二天。最後一格訊號昨天就消失了。",
  "home.situations.protest.label": "抗議",
  "home.situations.protest.line": "傳單上的一個 QR 碼就能為遊行開啟一條加密頻道。",
  "home.situations.festival.label": "音樂節",
  "home.situations.festival.line": "場地裡沒有訊號。訊息在陌生人的手機之間跳躍傳遞。",

  "home.showcase.eyebrow": "看看應用程式",
  "home.showcase.title": "一個普通的通訊軟體，只是不用連網。",
  "home.showcase.sub": "聊天、頻道、錢包與身分。表面上一切如常，底下由網狀網路承擔全部工作。",
  "home.showcase.mesh.title": "網狀網路",
  "home.showcase.mesh.caption": "範圍內的所有人，依距離遠近排列。不需要先加任何人。",
  "home.showcase.mesh.alt":
    "Airhop 應用程式的網狀網路畫面，依訊號強度在雷達圖上排列了四個附近的節點。",
  "home.showcase.chats.title": "聊天",
  "home.showcase.chats.caption": "再普通不過的對話。轉送訊息的手機無法開啟它。",
  "home.showcase.chats.alt": "停電期間 Airhop 中的一次私訊對話，經過三支手機轉送。",
  "home.showcase.channels.title": "頻道",
  "home.showcase.channels.caption": "公開房間小到一個街區，大到整個區域，對身處其中的任何人開放。",
  "home.showcase.channels.alt":
    "Airhop 應用程式的聊天畫面，列出依街區、社區、城市與區域劃分的公開頻道。",
  "home.showcase.wallet.title": "錢包",
  "home.showcase.wallet.caption":
    "在雙方手機都沒連網的情況下，透過 Bluetooth 把 ecash 交給身邊的人。",
  "home.showcase.wallet.alt": "Airhop 應用程式的錢包畫面，顯示可透過 Bluetooth 傳送的 ecash 餘額。",
  "home.showcase.identity.title": "身分",
  "home.showcase.identity.caption":
    "無需註冊，無需手機號碼，無需電子郵件。只有一把永遠不離開這支手機的金鑰。",
  "home.showcase.identity.alt": "Airhop 應用程式的個人資料畫面，顯示在裝置上產生、無需帳號的身分。",

  "home.how.eyebrow": "運作方式",
  "home.how.title": "網狀網路會自己形成。",
  "home.how.sub":
    "附近的節點透過 Bluetooth 組成可自我修復的網狀網路。有網路時，Nostr 中繼會把它延伸出去，而這些基礎設施不受任何人控制。",
  "home.how.cta": "閱讀完整架構",
  "home.how.discover.title": "發現",
  "home.how.discover.line":
    "執行 Airhop 或 bitchat 的手機會透過 Bluetooth 自動找到彼此。無需配對，無需設定。",
  "home.how.relay.title": "轉送",
  "home.how.relay.line": "訊息在手機之間跳躍，最多七跳。中間的手機永遠看不到自己轉送的內容。",
  "home.how.reach.title": "傳得更遠",
  "home.how.reach.line": "有網路時，Nostr 中繼會把同一場對話帶得更遠，也可以選擇經由 Tor 轉送。",
  "home.how.swipe": "滑動查看",
  "home.how.diagram": "BLE 網狀網路 · 本地點對點網路",
  "home.how.legend.node": "BLE 網狀網路節點（離線）",
  "home.how.legend.relay": "多跳轉送（Noise XX 加密）",
  "home.how.legend.bitchat": "同一網狀網路中相容 bitchat",
  "home.how.legend.nostr": "Nostr 橋接（連網時經網際網路）",

  "home.map.aria": "Nostr 中繼位置世界地圖",
  "home.map.summary": "Nostr 橋接 · 全球 {locations}，共 {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}，{relays}",

  "home.features.eyebrow": "它能做什麼",
  "home.features.title": "一個真正的通訊軟體，不是展示品。",
  "home.features.sub":
    "聊天、身分、組網與支付。所有功能都為沒有訊號、沒有帳號、中間沒有任何人而設計。",

  "home.features.messaging.title": "訊息",
  "home.features.messaging.summary": "通訊軟體該有的一切，背後卻沒有任何基礎設施。",
  "home.features.messaging.dms.name": "私密私訊",
  "home.features.messaging.dms.line": "端對端加密，附送達與已讀回條。",
  "home.features.messaging.location.name": "位置頻道",
  "home.features.messaging.location.line": "與地點綁定的房間，從一個街區到一整個區域。",
  "home.features.messaging.groups.name": "私密頻道與群組",
  "home.features.messaging.groups.line": "房間邀請連結，或最多 16 人的簽署名單。",
  "home.features.messaging.board.name": "公佈欄",
  "home.features.messaging.board.line": "釘在某個區域最多七天的通知。",
  "home.features.messaging.voice.name": "即時語音",
  "home.features.messaging.voice.line": "按住麥克風就能對範圍內的人講話，像對講機一樣。",
  "home.features.messaging.notes.name": "語音留言",
  "home.features.messaging.notes.line": "錄好的音訊，比打字說明路線更快。",
  "home.features.messaging.files.name": "照片、影片與檔案",
  "home.features.messaging.files.line": "任意格式，最大 1 MiB，無需訊號。",
  "home.features.messaging.forward.name": "儲存轉送",
  "home.features.messaging.forward.line": "封裝後由附近的手機攜帶，直到送達對方。",

  "home.features.identity.title": "身分",
  "home.features.identity.summary": "沒有什麼需要註冊，也沒有什麼可以被沒收。",
  "home.features.identity.keys.name": "金鑰對身分",
  "home.features.identity.keys.line": "在這支手機上產生，保存在系統的鑰匙圈中。",
  "home.features.identity.names.name": "可讀的名字",
  "home.features.identity.names.line": "由你的金鑰推導而來，別人搶不走。",
  "home.features.identity.qr.name": "QR 聯絡人",
  "home.features.identity.qr.line": "掃一次帶走的是對方的金鑰，而不只是名字。",
  "home.features.identity.panic.name": "緊急抹除",
  "home.features.identity.panic.line": "所有金鑰與訊息在一秒內銷毀。",

  "home.features.networking.title": "組網",
  "home.features.networking.summary": "手機本身就是網路。",
  "home.features.networking.mesh.name": "Bluetooth 網狀網路",
  "home.features.networking.mesh.line": "不用網路，不用路由器，就在人們已有的手機上。",
  "home.features.networking.bridge.name": "網狀橋接",
  "home.features.networking.bridge.line": "把你的公開聊天和範圍外的鄰近人群連起來。",
  "home.features.networking.wifi.name": "WiFi 快速通道",
  "home.features.networking.wifi.line": "兩台 Android 或兩台 iPhone 之間傳輸更快。",
  "home.features.networking.bitchat.name": "相容 bitchat",
  "home.features.networking.bitchat.line": "兩個應用程式無需設定即可加入同一個網狀網路。",

  "home.features.internet.title": "網際網路",
  "home.features.internet.summary": "是補充，從來不是前提。",
  "home.features.internet.nostr.name": "Nostr 備援",
  "home.features.internet.nostr.line": "私訊與位置頻道在無線電範圍之外照常收發。",
  "home.features.internet.relays.name": "地理中繼探索",
  "home.features.internet.relays.line": "300 多個獨立的公共中繼，沒有一個是我們的。",
  "home.features.internet.gateway.name": "網際網路閘道",
  "home.features.internet.gateway.line": "借出你的連線，讓附近離線的手機也能進入位置頻道。",
  "home.features.internet.tor.name": "Tor 整合",
  "home.features.internet.tor.line": "兩個平台都走 Tor，中繼永遠看不到你的 IP。",

  "home.features.optional.title": "選用",
  "home.features.optional.summary": "預設關閉。想開再開。",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line": "雙方手機都沒連網，也能付錢給身邊的人。",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "透過 Lightning 網路用 bitcoin 儲值或提領。",
  "home.features.optional.ai.name": "本機 AI",
  "home.features.optional.ai.line": "在裝置上作答，沒有任何內容離開手機。",
  "home.features.optional.social.name": "社群橋接",
  "home.features.optional.social.line": "用同一個身分連接 Bluesky 與 Mastodon。",

  "home.compare.eyebrow": "橫向比較",
  "home.compare.title": "離線可用、無需額外硬體、完全開放。",
  "home.compare.sub": "這裡的每個應用程式都有各自的長處。但只有一部分在網路失效時仍然可用。",
  "home.compare.col.project": "專案",
  "home.compare.col.transport": "傳輸方式",
  "home.compare.col.encryption": "加密",
  "home.compare.col.offline": "離線可用",
  "home.compare.col.hardware_free": "無需額外硬體",
  "home.compare.col.open_source": "開源",
  "home.compare.mark.yes": "是",
  "home.compare.mark.no": "否",
  "home.compare.mark.partial": "部分，用戶端開源，伺服器不開源",
  "home.compare.mark.partial_hint": "用戶端開源，伺服器不開源",
  "home.compare.transport.servers": "中心化伺服器",
  "home.compare.transport.onion": "洋蔥路由（服務節點）",
  "home.compare.transport.nostr": "Nostr 中繼",
  "home.compare.transport.lora": "LoRa 無線電",
  "home.compare.transport.sub_ghz": "專有的次 GHz 無線電",

  "home.explore.eyebrow": "開放且坦誠",
  "home.explore.title": "這裡的每一條說法都可以查證。",
  "home.explore.sub": "程式碼、協定與計畫都是公開的，限制也是。在相信我們之前，請自己查證。",
  "home.explore.audit.chip": "稽核待進行",
  "home.explore.audit.headline": "Airhop 尚未接受外部安全稽核。",
  "home.explore.audit.body":
    "{headline} 所有程式碼都經過人工審閱，並在發布前通過{review}檢查，其使用的密碼學函式庫已通過 Cure53 稽核，但這並不能取代對應用程式本身的正式稽核。稽核計畫在 {version} 進行。在那之前，請勿在敏感情境中依賴它。",
  "home.explore.audit.link.review": "安全審查代理",
  "home.explore.source.title": "原始碼",
  "home.explore.source.desc": "全部在 GitHub 上以 MIT 授權開放。議題、拉取請求與討論皆已開放。",
  "home.explore.protocol.title": "協定規格",
  "home.explore.protocol.desc": "確切的傳輸格式、BLE UUID 與常數，與 bitchat 共用。",
  "home.explore.architecture.title": "架構",
  "home.explore.architecture.desc": "完整的技術拆解，從點擊傳送到無線電上的位元組。",
  "home.explore.roadmap.title": "藍圖",
  "home.explore.roadmap.desc": "從 v0.5.0 到 v2.0.0 的版本目標，包括計畫中的稽核。",
  "home.explore.vision.title": "願景",
  "home.explore.vision.desc": "Airhop 存在的理由，以及在壓力下也不會改變的原則。",
  "home.explore.brand.title": "品牌資源",
  "home.explore.brand.desc": "像素小鳥、顏色與字體變數、媒體素材與標準文案。",

  "home.contribute.eyebrow": "支持這個專案",
  "home.contribute.title": "獨立，且公開。",
  "home.contribute.sub":
    "沒有投資人，沒有廣告，也沒有付費版。所有功能無論如何都保持免費，這份工作由覺得它有用的人資助。",
  "home.contribute.contribute.chip": "參與貢獻",
  "home.contribute.contribute.body":
    "給儲存庫點個星、提交議題、發起拉取請求。錯誤回報、功能提案與程式碼貢獻都歡迎。",
  "home.contribute.contribute.cta": "在 GitHub 上檢視",
  "home.contribute.sponsor.chip": "贊助",
  "home.contribute.sponsor.body":
    "如果 Airhop 對你有用，一次性捐款或定期贊助都能大大幫助開發持續下去。",
  "home.contribute.sponsor.donate": "捐款一次",
  "home.contribute.sponsor.github": "在 GitHub 上贊助",

  "page.architecture.eyebrow": "文件",
  "page.architecture.title": "架構",
  "page.architecture.toc": "本頁目錄",

  "page.faq.eyebrow": "常見問題",
  "page.faq.title": "常見問題",
  "page.faq.meta": "關於 Airhop 的常見疑問。",
  "page.faq.contact": "這裡沒有解答的問題，可以寄到 {email}，或在 {github} 上發起討論。",

  "page.blogs.eyebrow": "部落格",
  "page.blogs.title": "即將推出",
  "page.blogs.body": "關於網狀網路、隱私與離線優先軟體的文章。",

  "page.brand.eyebrow": "品牌",
  "page.brand.title": "品牌資源",
  "page.brand.meta":
    "在文章、商店頁面、演講或 README 中使用 Airhop 的素材與規範。可自由用於引用與媒體報導。",

  "page.legal.eyebrow": "法律",
  "page.privacy.title": "隱私權政策",
  "page.terms.title": "服務條款",

  "page.notfound.title": "找不到頁面",
  "page.notfound.body": "你要找的頁面不存在或已被移動。",

  "page.english_only": "本頁面僅提供英文版本。",

  "seo.breadcrumb.home": "首頁",

  "seo.home.title": "Airhop — 私密、離線優先的通訊軟體",
  "seo.home.description":
    "給 iOS 與 Android 的私密點對點通訊。無需網路、無需伺服器、無需帳號。隨時隨地透過 Bluetooth 網狀網路交流。",

  "seo.architecture.title": "架構 — Airhop",
  "seo.architecture.description":
    "Airhop 由上而下的運作方式：身分、傳輸方式選擇、Bluetooth 網狀網路、加密、網際網路層、Tor、離線 ecash、裝置端 AI，以及相容 bitchat 的傳輸格式。",
  "seo.architecture.breadcrumb": "架構",
  "seo.architecture.headline": "Airhop 架構",
  "seo.architecture.summary":
    "Airhop 的完整技術拆解：身分、傳輸方式、Bluetooth 網狀網路、加密、Nostr 網際網路層、Tor、Cashu 錢包、裝置端 AI 助理，以及傳輸格式。",

  "seo.faq.title": "常見問題 — Airhop",
  "seo.faq.description":
    "關於 Airhop 的 Bluetooth 網狀通訊、加密、離線支付、Nostr 網際網路層以及 bitchat 相容性的解答。",
  "seo.faq.breadcrumb": "常見問題",

  "seo.blogs.title": "部落格 — Airhop",
  "seo.blogs.description": "關於網狀網路、隱私與離線優先軟體的文章。",
  "seo.blogs.breadcrumb": "部落格",

  "seo.brand.title": "品牌資源 — Airhop",
  "seo.brand.description":
    "Airhop 品牌資源：像素小鳥標誌、文字商標、顏色與字體變數、媒體素材與標準文案。",
  "seo.brand.breadcrumb": "品牌資源",

  "seo.privacy.title": "隱私權政策 — Airhop",
  "seo.privacy.description":
    "Airhop 如何處理資料：沒有帳號、沒有伺服器、沒有追蹤。你的身分與訊息都留在你的裝置上。",
  "seo.privacy.breadcrumb": "隱私權政策",

  "seo.terms.title": "服務條款 — Airhop",
  "seo.terms.description": "規範 Airhop 應用程式與網站使用的條款。",
  "seo.terms.breadcrumb": "服務條款",

  "seo.notfound.title": "找不到頁面 — Airhop",
  "seo.notfound.description": "你要找的頁面不存在或已被移動。",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "{count} 個中繼",
  },
  "home.map.locations": {
    other: "{count} 個地點",
  },
};

export const locale: Locale = { strings, plurals };
