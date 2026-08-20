import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "返回首页",
  "common.last_updated": "最后更新：{date}",

  "nav.aria": "主导航",
  "nav.home": "Airhop 首页",
  "nav.skip": "跳到正文",
  "nav.menu.open": "打开菜单",
  "nav.menu.close": "关闭菜单",
  "nav.how_it_works": "工作原理",
  "nav.architecture": "架构",
  "nav.faq": "常见问题",

  "footer.aria": "页脚",
  "footer.tagline": "私密的网状通信",
  "footer.credit": "© 由 {author} 用 {heart} 打造",
  "footer.group.download": "下载",
  "footer.group.resources": "资源",
  "footer.group.social": "社交",
  "footer.group.legal": "法律",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "架构",
  "footer.link.blogs": "博客",
  "footer.link.faq": "常见问题",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "服务条款",
  "footer.link.privacy": "隐私政策",
  "footer.link.license": "项目许可证",

  "settings.theme.group": "配色主题",
  "settings.theme.light": "浅色主题",
  "settings.theme.dark": "深色主题",
  "settings.language.label": "语言",
  "settings.language.suggestion": "用简体中文查看本页",
  "settings.language.dismiss": "关闭",

  "home.hero.release": "最新版本",
  "home.hero.title": "没有网络也能用的即时通讯。",
  "home.hero.body":
    "附近的手机组成 Bluetooth 网状网络，端到端加密地把你的消息转发最多七跳。{no_servers}、{no_accounts}、{no_tracking}。",
  "home.hero.body.no_servers": "没有服务器",
  "home.hero.body.no_accounts": "没有账号",
  "home.hero.body.no_tracking": "没有追踪",
  "home.hero.download": "下载应用",
  "home.hero.badges": "MIT 许可 · 免费开源 · 兼容 bitchat",
  "home.hero.group.mobile": "移动端",
  "home.hero.group.desktop": "桌面端",
  "home.hero.option.f_droid": "开源应用目录",
  "home.hero.option.apk": "直接下载",
  "home.hero.option.soon": "即将推出",

  "home.about.eyebrow": "什么是 Airhop",
  "home.about.title": "大多数应用都依赖一台中心服务器。",
  "home.about.sub":
    "服务器可以被监控、关停或封锁。Airhop 没有服务器，所以既没有可以施压的公司，也没有可以关停的服务。",
  "home.about.card": "技术概览",
  "home.about.link.mesh": "Bluetooth Low Energy 网状网络",
  "home.about.link.wire_protocol": "传输协议",
  "home.about.body.built":
    "Airhop 是一款面向 iOS 和 Android 的开源应用，基于 {mesh} 提供私密的点对点通讯。它建立在 {bitchat} 的基础之上，沿用其 {wire_protocol} 和安全模型，并在此之上加入离线 {ecash} 支付和离线 AI。它在完全没有网络的情况下也能工作，消息会在附近设备之间自动转发（室内每跳约 10 到 30 米，空旷处更远），最多 7 跳。",
  "home.about.body.identity":
    "你的身份是一对在本机生成的 {ed25519} 密钥，保存在 {ios_keychain} 或 {android_keystore} 中。没有账号，没有注册，也没有任何东西会接触服务器，也就是说它可以当作一次性应用使用，删除后不会留下任何指向你的线索。",
  "home.about.body.crypto":
    "每个会话都使用 {noise} 协议完成经过认证的握手。已存储的消息使用 {ratchet} 算法，也就是说即使你的设备日后被攻破，过去的消息依然无法解读。紧急擦除会在一秒内销毁所有密钥和消息。",
  "home.about.body.internet":
    "当你和联系人都超出 Bluetooth 范围时，{nostr} 中继会充当互联网桥梁，使用 {nip17} 形式的礼物包装私信，因此只要你们双方都在线，网状网络就能延伸到全球。{tor} 支持在 iOS（通过 {arti}）和 Android（通过 {orbot}）上都可用。",
  "home.about.optional.title": "Airhop 提供了一些可以自行开启的功能：",
  "home.about.optional.payments.label": "离线支付：",
  "home.about.optional.payments.body": "使用 {cashu} 协议在网状网络上收发款项（仅限 Bitcoin）。",
  "home.about.optional.ai.label": "离线 AI：",
  "home.about.optional.ai.body":
    "一个运行在本机的小型 AI 助手，可以回答重要问题。所有处理和数据都留在你的设备上。",
  "home.about.body.compatible":
    "Airhop 在协议层与 bitchat 兼容。同一网状网络中的 Airhop 设备和 bitchat 设备会自动互相发现，无需任何配置即可交换消息和私信。",

  "home.situations.eyebrow": "什么时候用得上",
  "home.situations.title": "为网络中断的那一天准备。",
  "home.situations.sub": "自然灾害、断网、大规模抗议，或者只是一个没有信号的普通周末。",
  "home.situations.disaster.label": "灾害",
  "home.situations.disaster.line": "基站瘫痪。公告栏上的通知能传给每一个路过的人。",
  "home.situations.offgrid.label": "离网",
  "home.situations.offgrid.line": "上路第二天。最后一格信号昨天就消失了。",
  "home.situations.protest.label": "抗议",
  "home.situations.protest.line": "传单上的一个二维码就能为游行开启一条加密频道。",
  "home.situations.festival.label": "音乐节",
  "home.situations.festival.line": "场地里没有信号。消息在陌生人的手机之间跳跃传递。",

  "home.showcase.eyebrow": "看看应用",
  "home.showcase.title": "一个普通的通讯工具，只是不用联网。",
  "home.showcase.sub": "聊天、频道、钱包和身份。表面上一切如常，底下由网状网络承担全部工作。",
  "home.showcase.mesh.title": "网状网络",
  "home.showcase.mesh.caption": "范围内的所有人，按距离远近排列。不需要先添加任何人。",
  "home.showcase.mesh.alt": "Airhop 应用的网状网络界面，按信号强度在雷达图上排列了四个附近节点。",
  "home.showcase.chats.title": "聊天",
  "home.showcase.chats.caption": "再普通不过的对话。转发消息的手机无法打开它。",
  "home.showcase.chats.alt": "停电期间 Airhop 中的一次私信对话，经过三部手机转发。",
  "home.showcase.channels.title": "频道",
  "home.showcase.channels.caption": "公共房间小到一个街区，大到整个地区，对身处其中的任何人开放。",
  "home.showcase.channels.alt":
    "Airhop 应用的聊天界面，列出了按街区、社区、城市和地区划分的公共频道。",
  "home.showcase.wallet.title": "钱包",
  "home.showcase.wallet.caption":
    "在双方手机都不联网的情况下，通过 Bluetooth 把 ecash 交给身边的人。",
  "home.showcase.wallet.alt": "Airhop 应用的钱包界面，显示可通过 Bluetooth 发送的 ecash 余额。",
  "home.showcase.identity.title": "身份",
  "home.showcase.identity.caption":
    "无需注册，无需手机号，无需邮箱。只有一把永远不离开这部手机的密钥。",
  "home.showcase.identity.alt": "Airhop 应用的个人资料界面，显示在设备上生成、无需账号的身份。",

  "home.how.eyebrow": "工作原理",
  "home.how.title": "网状网络会自己形成。",
  "home.how.sub":
    "附近的节点通过 Bluetooth 组成可自愈的网状网络。有网络时，Nostr 中继会把它延伸出去，而这些基础设施不受任何人控制。",
  "home.how.cta": "阅读完整架构",
  "home.how.discover.title": "发现",
  "home.how.discover.line":
    "运行 Airhop 或 bitchat 的手机通过 Bluetooth 自动找到彼此。无需配对，无需设置。",
  "home.how.relay.title": "转发",
  "home.how.relay.line": "消息在手机之间跳跃，最多七跳。中间的手机永远看不到自己转发的内容。",
  "home.how.reach.title": "传得更远",
  "home.how.reach.line": "有网络时，Nostr 中继会把同一场对话带得更远，还可以选择经由 Tor 转发。",
  "home.how.swipe": "滑动查看",
  "home.how.diagram": "BLE 网状网络 · 本地点对点网络",
  "home.how.legend.node": "BLE 网状网络节点（离线）",
  "home.how.legend.relay": "多跳转发（Noise XX 加密）",
  "home.how.legend.bitchat": "同一网状网络中兼容 bitchat",
  "home.how.legend.nostr": "Nostr 桥接（联网时经互联网）",

  "home.map.aria": "Nostr 中继位置世界地图",
  "home.map.summary": "Nostr 桥接 · 全球 {locations}，共 {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}，{relays}",

  "home.features.eyebrow": "它能做什么",
  "home.features.title": "一个真正的通讯工具，不是演示。",
  "home.features.sub":
    "聊天、身份、组网和支付。所有功能都为没有信号、没有账号、中间没有任何人而设计。",

  "home.features.messaging.title": "消息",
  "home.features.messaging.summary": "通讯工具该有的一切，背后却没有任何基础设施。",
  "home.features.messaging.dms.name": "私密私信",
  "home.features.messaging.dms.line": "端到端加密，带送达和已读回执。",
  "home.features.messaging.location.name": "位置频道",
  "home.features.messaging.location.line": "与地点绑定的房间，从一个街区到一整个地区。",
  "home.features.messaging.groups.name": "私密频道和群组",
  "home.features.messaging.groups.line": "房间邀请链接，或最多 16 人的签名名单。",
  "home.features.messaging.board.name": "公告栏",
  "home.features.messaging.board.line": "钉在某个区域最多七天的通知。",
  "home.features.messaging.voice.name": "实时语音",
  "home.features.messaging.voice.line": "按住麦克风就能对范围内的人讲话，像对讲机一样。",
  "home.features.messaging.notes.name": "语音留言",
  "home.features.messaging.notes.line": "录好的音频，比打字描述路线更快。",
  "home.features.messaging.files.name": "照片、视频和文件",
  "home.features.messaging.files.line": "任意格式，最大 1 MB，无需信号。",
  "home.features.messaging.forward.name": "存储转发",
  "home.features.messaging.forward.line": "封装后由附近的手机携带，直到送达对方。",

  "home.features.identity.title": "身份",
  "home.features.identity.summary": "没有什么需要注册，也没有什么可以被没收。",
  "home.features.identity.keys.name": "密钥对身份",
  "home.features.identity.keys.line": "在这部手机上生成，保存在系统钥匙串中。",
  "home.features.identity.names.name": "可读的名字",
  "home.features.identity.names.line": "由你的密钥推导而来，别人抢不走。",
  "home.features.identity.qr.name": "二维码联系人",
  "home.features.identity.qr.line": "扫一次带走的是对方的密钥，而不只是名字。",
  "home.features.identity.panic.name": "紧急擦除",
  "home.features.identity.panic.line": "所有密钥和消息在一秒内销毁。",

  "home.features.networking.title": "组网",
  "home.features.networking.summary": "手机本身就是网络。",
  "home.features.networking.mesh.name": "Bluetooth 网状网络",
  "home.features.networking.mesh.line": "不用网络，不用路由器，就在人们已有的手机上。",
  "home.features.networking.bridge.name": "网状桥接",
  "home.features.networking.bridge.line": "把你的公开聊天和范围外的邻近人群连起来。",
  "home.features.networking.wifi.name": "WiFi 快速通道",
  "home.features.networking.wifi.line": "两台 Android 或两台 iPhone 之间传输更快。",
  "home.features.networking.bitchat.name": "兼容 bitchat",
  "home.features.networking.bitchat.line": "两个应用无需设置即可加入同一个网状网络。",

  "home.features.internet.title": "互联网",
  "home.features.internet.summary": "是补充，从来不是前提。",
  "home.features.internet.nostr.name": "Nostr 兜底",
  "home.features.internet.nostr.line": "私信和位置频道在无线电范围之外照常收发。",
  "home.features.internet.relays.name": "地理中继发现",
  "home.features.internet.relays.line": "300 多个独立公共中继，没有一个是我们的。",
  "home.features.internet.gateway.name": "互联网网关",
  "home.features.internet.gateway.line": "借出你的连接，让附近离线的手机也能进入位置频道。",
  "home.features.internet.tor.name": "Tor 集成",
  "home.features.internet.tor.line": "两个平台都走 Tor，中继永远看不到你的 IP。",

  "home.features.optional.title": "可选",
  "home.features.optional.summary": "默认关闭。想开再开。",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line": "双方手机都不联网，也能付钱给身边的人。",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "通过 Lightning 网络用 bitcoin 充值或提现。",
  "home.features.optional.ai.name": "本地 AI",
  "home.features.optional.ai.line": "在设备上作答，没有任何内容离开手机。",
  "home.features.optional.social.name": "社交桥接",
  "home.features.optional.social.line": "用同一个身份连接 Bluesky 和 Mastodon。",

  "home.compare.eyebrow": "横向对比",
  "home.compare.title": "离线可用、无需额外硬件、完全开放。",
  "home.compare.sub": "这里的每个应用都有各自的长处。但只有一部分在网络失效时仍然可用。",
  "home.compare.col.project": "项目",
  "home.compare.col.transport": "传输方式",
  "home.compare.col.encryption": "加密",
  "home.compare.col.offline": "离线可用",
  "home.compare.col.hardware_free": "无需额外硬件",
  "home.compare.col.open_source": "开源",
  "home.compare.mark.yes": "是",
  "home.compare.mark.no": "否",
  "home.compare.mark.partial": "部分，客户端开源，服务端不开源",
  "home.compare.mark.partial_hint": "客户端开源，服务端不开源",
  "home.compare.transport.servers": "中心化服务器",
  "home.compare.transport.onion": "洋葱路由（服务节点）",
  "home.compare.transport.nostr": "Nostr 中继",
  "home.compare.transport.lora": "LoRa 无线电",
  "home.compare.transport.sub_ghz": "专有的次 GHz 无线电",

  "home.explore.eyebrow": "开放且坦诚",
  "home.explore.title": "这里的每一条说法都可以核实。",
  "home.explore.sub": "代码、协议和计划都是公开的，局限也是。在相信我们之前，请自己核实。",
  "home.explore.audit.chip": "审计待进行",
  "home.explore.audit.headline": "Airhop 尚未接受外部安全审计。",
  "home.explore.audit.body":
    "{headline} 所有代码都经过人工审阅，并在发布前通过{review}检查，其使用的密码学库已通过 Cure53 审计，但这并不能替代对应用本身的正式审计。审计计划在 {version} 进行。在那之前，请勿在敏感场景中依赖它。",
  "home.explore.audit.link.review": "安全审查代理",
  "home.explore.source.title": "源代码",
  "home.explore.source.desc": "全部在 GitHub 上以 MIT 许可开放。议题、拉取请求和讨论均已开放。",
  "home.explore.protocol.title": "协议规范",
  "home.explore.protocol.desc": "确切的传输格式、BLE UUID 和常量，与 bitchat 共用。",
  "home.explore.architecture.title": "架构",
  "home.explore.architecture.desc": "完整的技术拆解，从点击发送到无线电上的字节。",
  "home.explore.roadmap.title": "路线图",
  "home.explore.roadmap.desc": "从 v0.5.0 到 v2.0.0 的版本目标，包括计划中的审计。",
  "home.explore.vision.title": "愿景",
  "home.explore.vision.desc": "Airhop 存在的理由，以及在压力下也不会改变的原则。",
  "home.explore.brand.title": "品牌资源",
  "home.explore.brand.desc": "像素小鸟、颜色与字体变量、媒体素材和标准文案。",

  "home.contribute.eyebrow": "支持这个项目",
  "home.contribute.title": "独立，且公开。",
  "home.contribute.sub":
    "没有投资人，没有广告，也没有付费版。所有功能无论如何都保持免费，这份工作由觉得它有用的人资助。",
  "home.contribute.contribute.chip": "参与贡献",
  "home.contribute.contribute.body":
    "给仓库点个星标、提交议题、发起拉取请求。缺陷报告、功能提案和代码贡献都欢迎。",
  "home.contribute.contribute.cta": "在 GitHub 上查看",
  "home.contribute.sponsor.chip": "赞助",
  "home.contribute.sponsor.body":
    "如果 Airhop 对你有用，一次性捐赠或定期赞助都能大大帮助开发持续下去。",
  "home.contribute.sponsor.donate": "捐赠一次",
  "home.contribute.sponsor.github": "在 GitHub 上赞助",

  "page.architecture.eyebrow": "文档",
  "page.architecture.title": "架构",
  "page.architecture.toc": "本页目录",

  "page.faq.eyebrow": "常见问题",
  "page.faq.title": "常见问题",
  "page.faq.meta": "关于 Airhop 的常见疑问。",
  "page.faq.contact": "这里没有解答的问题，可以发送到 {email}，或在 {github} 上发起讨论。",

  "page.blogs.eyebrow": "博客",
  "page.blogs.title": "即将推出",
  "page.blogs.body": "关于网状网络、隐私和离线优先软件的文章。",

  "page.brand.eyebrow": "品牌",
  "page.brand.title": "品牌资源",
  "page.brand.meta":
    "在文章、商店页面、演讲或 README 中使用 Airhop 的素材与规范。可自由用于引用和媒体报道。",

  "page.legal.eyebrow": "法律",
  "page.privacy.title": "隐私政策",
  "page.terms.title": "服务条款",

  "page.notfound.title": "页面未找到",
  "page.notfound.body": "你要找的页面不存在或已被移动。",

  "page.english_only": "本页面仅提供英文版本。",

  "seo.breadcrumb.home": "首页",

  "seo.home.title": "Airhop — 私密、离线优先的通讯工具",
  "seo.home.description":
    "面向 iOS 和 Android 的私密点对点通讯。无需网络、无需服务器、无需账号。随时随地通过 Bluetooth 网状网络交流。",

  "seo.architecture.title": "架构 — Airhop",
  "seo.architecture.description":
    "Airhop 自上而下的工作方式：身份、传输方式选择、Bluetooth 网状网络、加密、互联网层、Tor、离线 ecash、设备端 AI，以及兼容 bitchat 的传输格式。",
  "seo.architecture.breadcrumb": "架构",
  "seo.architecture.headline": "Airhop 架构",
  "seo.architecture.summary":
    "Airhop 的完整技术拆解：身份、传输方式、Bluetooth 网状网络、加密、Nostr 互联网层、Tor、Cashu 钱包、设备端 AI 助手，以及传输格式。",

  "seo.faq.title": "常见问题 — Airhop",
  "seo.faq.description":
    "关于 Airhop 的 Bluetooth 网状通讯、加密、离线支付、Nostr 互联网层以及 bitchat 兼容性的解答。",
  "seo.faq.breadcrumb": "常见问题",

  "seo.blogs.title": "博客 — Airhop",
  "seo.blogs.description": "关于网状网络、隐私和离线优先软件的文章。",
  "seo.blogs.breadcrumb": "博客",

  "seo.brand.title": "品牌资源 — Airhop",
  "seo.brand.description":
    "Airhop 品牌资源：像素小鸟标志、文字商标、颜色与字体变量、媒体素材和标准文案。",
  "seo.brand.breadcrumb": "品牌资源",

  "seo.privacy.title": "隐私政策 — Airhop",
  "seo.privacy.description":
    "Airhop 如何处理数据：没有账号、没有服务器、没有追踪。你的身份和消息都留在你的设备上。",
  "seo.privacy.breadcrumb": "隐私政策",

  "seo.terms.title": "服务条款 — Airhop",
  "seo.terms.description": "管理 Airhop 应用和网站使用的条款。",
  "seo.terms.breadcrumb": "服务条款",

  "seo.notfound.title": "页面未找到 — Airhop",
  "seo.notfound.description": "你要找的页面不存在或已被移动。",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "{count} 个中继",
  },
  "home.map.locations": {
    other: "{count} 个地点",
  },
};

export const locale: Locale = { strings, plurals };
