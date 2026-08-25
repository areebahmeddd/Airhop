// zh-Hans: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "取消",
  "common.done": "完成",
  "common.ok": "好",
  "common.close": "关闭",
  "common.back": "返回",
  "common.delete": "删除",
  "common.remove": "移除",
  "common.add": "添加",
  "common.copy": "复制",
  "common.copied": "已复制",
  "common.share": "分享",
  "common.continue": "继续",
  "common.try_again": "再试一次",
  "common.settings": "设置",
  "common.off": "关",

  // ---- Dates ----
  "format.today": "今天",
  "format.yesterday": "昨天",
  "format.minutes_ago": "{count} 分钟前",
  "format.hours_ago": "{count} 小时前",
  "format.days_ago": "{count} 天前",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "聊天",
  "nav.tab.mesh": "网状网",
  "nav.tab.wallet": "钱包",
  "nav.tab.profile": "我",
  "a11y.tab.new_peers": "{label}，附近有新的人",
  "nav.notifications": "通知",
  "chat.subtab.channels": "频道",
  "chat.subtab.direct": "私信",
  "chat.subtab.dms": "私信",
  "chat.search.placeholder": "搜索聊天…",
  "chat.search.a11y": "搜索聊天和消息",
  "chat.search.close": "关闭搜索",
  "chat.search.clear": "清除搜索",
  "mesh.view.radar": "雷达视图",
  "mesh.view.list": "列表视图",
  "mesh.view.radar_short": "雷达",
  "mesh.view.list_short": "列表",

  // ---- Legal document names ----
  "legal.last_updated": "最后更新：{date}",
  "legal.terms": "服务条款",
  "legal.privacy": "隐私政策",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "私密的网状网络通信",
  "onboarding.welcome.cta": "开始使用",
  "onboarding.welcome.cta_hint": "同意下方条款才能继续",
  "onboarding.welcome.consent_a11y": "同意服务条款和隐私政策",
  "onboarding.welcome.open_terms": "打开服务条款",
  "onboarding.welcome.open_privacy": "打开隐私政策",
  "onboarding.welcome.consent":
    "点按{cta}即表示你同意我们的{terms}和{privacy}。",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "正在生成你的身份",
  "onboarding.identity.body":
    "正在这台设备上创建一对 Ed25519 密钥。\n什么都不会发往别处。",
  "onboarding.identity.failed_heading": "无法创建你的密钥",
  "onboarding.identity.failed_body":
    "这台设备不让 Airhop 安全地保存它们。请再试一次，或者重启手机后重新打开 Airhop。",
  "onboarding.identity.steps_a11y": "步骤：{steps}",
  "onboarding.identity.step.x25519": "正在生成 X25519 静态密钥对",
  "onboarding.identity.step.ed25519": "正在生成 Ed25519 签名密钥对",
  "onboarding.identity.step.keychain": "正在把密钥存入系统钥匙串",
  "onboarding.identity.step.peer_id": "正在推导节点 ID",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "你在网状网络上的名字",
  "onboarding.username.peer_id": "节点 ID",
  "onboarding.username.card_a11y":
    "你在网状网络上的名字是 {username}。节点 ID {peerID}。{props}。",
  "onboarding.username.explanation":
    "这个用户名是由你的公钥确定性推导出来的。在任何看得到你节点 ID 的设备上，它都一样。",
  "onboarding.username.cta": "进入 Airhop",
  "onboarding.username.prop.algorithm": "算法",
  "onboarding.username.prop.storage": "存储",
  "onboarding.username.prop.storage_value": "仅系统钥匙串",
  "onboarding.username.prop.account": "需要账户",
  "onboarding.username.prop.account_value": "无",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "欢迎来到 Airhop",
  "onboarding.hello.p1":
    "你好。Airhop 是基于 bitchat 构建的一个独立开源业余项目。它与 bitchat 项目或 permissionless tech 没有从属关系，也未获其背书，只是我乐于打造并分享给社区的东西。",
  "onboarding.hello.p2":
    "这是第一个 iOS 和 Android 发行版，虽然我和朋友们一起测试过，你多半还是会碰上一些问题。如果碰上了，或者你有什么功能上的想法，我很想听听。可以在 {github} 上提一个 issue，或者发邮件到 {email}。",
  "onboarding.hello.p3":
    "如果 Airhop 对你有用，不妨在 {github} 上点个星，或者在{store}留个评价。这能让更多人发现这个项目。谢谢你愿意试一试！",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "在你的手机开口之前",
  "onboarding.primer.lede": "下面是每一项权限做什么，以及不做什么。",
  "onboarding.primer.bluetooth.title": "蓝牙",
  "onboarding.primer.bluetooth.body":
    "用于发现附近设备并在它们之间中继消息。网状网络由此形成，没有互联网连接也能用。",
  "onboarding.primer.location.title": "定位",
  "onboarding.primer.location.body":
    "把你放进附近的区域频道，小到一个街区，大到一整个地区。Airhop 从不追踪你，也不会把你的精确位置发出这台设备。",
  "onboarding.primer.notifications.title": "通知",
  "onboarding.primer.notifications.body":
    "即使应用已关闭也能收到新消息提醒。通知在你的设备本地生成，不经过任何服务器。",
  "onboarding.primer.footnote":
    "你可以拒绝。消息仍然能通过互联网传递，你之后也可以在设置里改主意。",
  "onboarding.primer.cta_a11y": "继续，进入权限询问",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "蓝牙访问权限",
  "permission.bluetooth.purpose": "在网状网络上发现附近设备",
  "permission.open_settings": "打开设置",
  "permission.not_now": "暂不",
  "permission.blocked_title": "{label}已关闭",
  "permission.blocked_body": "请在设置中开启它，以便{purpose}。",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "出了点问题",
  "error.boundary.body":
    "Airhop 遇到了一个意外问题，不得不停下正在显示的内容。",

  // ---- Chats: channel list ----
  "chat.channels.default": "默认频道",
  "chat.channels.yours": "你的频道",
  "chat.channels.none": "还没有频道",
  "chat.channels.none_hint": "点按上方的 {plus} 加入或新建一个。",
  "chat.channels.none_desc": "还没有频道。用标题栏的添加按钮加入或新建一个。",
  "chat.channels.show_fewer": "少显示一些默认频道",
  "chat.channels.show_less": "收起",
  "chat.channels.info": "频道信息",
  "chat.channels.pin": "置顶频道",
  "chat.channels.unpin": "取消置顶频道",
  "chat.channels.mute": "静音频道",
  "chat.channels.unmute": "取消静音频道",
  "chat.channels.leave": "退出频道",
  "chat.channels.leave_confirm": "退出",
  "chat.channels.clear_body": "删除 {name} 中的所有消息？此操作无法撤销。",
  "chat.channels.leave_body":
    "退出 {name}？你将不再收到它的消息，它的历史记录也会从这台设备上移除。",
  "chat.channels.more_options": "{name} 的更多选项",
  "chat.channels.teleported_tag": "{level}  ·  远程",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "清空聊天",
  "chat.dm.remove_contact": "移除联系人",
  "chat.dm.block": "屏蔽此节点",
  "chat.dm.block_confirm": "屏蔽",
  "chat.dm.delete": "删除聊天",
  "chat.dm.delete_body":
    "这会把该对话从你的列表中移除并删除它的消息。联系人会保留，对方再次发来消息时会开启一段新的聊天。",
  "chat.dm.in_range": "在范围内",
  "chat.dm.row_hint": "双击并按住可查看更多选项",
  "chat.channels.row_hint": "双击并按住可查看更多选项",
  "chat.dm.you_prefix": "你：",
  "chat.dm.none": "没有私信",
  "chat.dm.none_desc": "前往网状网络标签页，点按一个节点即可开始加密私信。",
  "chat.dm.contact_info": "联系人信息",
  "chat.dm.pin": "置顶聊天",
  "chat.dm.unpin": "取消置顶聊天",
  "chat.dm.mute": "静音聊天",
  "chat.dm.unmute": "取消静音聊天",
  "chat.dm.clear_body": "删除与 {name} 的所有消息？此操作无法撤销。",
  "chat.dm.remove_contact_body":
    "移除 {name}？这会删除该对话并忘记这位联系人。如果对方再次发来消息，仍然可以联系到你。",
  "chat.dm.block_body":
    "屏蔽 {name}？你不会在网状网络标签页中看到对方，也不会收到对方的消息，即使对方就在附近。",
  "chat.dm.more_options": "{name} 的更多选项",
  "chat.dm.remove_contact_short": "移除联系人",
  "chat.dm.block_short": "屏蔽联系人",
  "chat.dm.delete_short": "删除聊天",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "清空消息",
  "chat.clear_confirm": "清空",
  "chat.group_badge": "群组",
  "chat.more": "更多",
  "chat.no_messages": "还没有消息",
  "chat.you": "你",
  "chat.a11y.channel": "频道 {name}",
  "chat.a11y.group": "群组 {name}",
  "chat.a11y.muted": "已静音",
  "chat.a11y.pinned": "已置顶",

  // ---- Chats: start something new ----
  "chat.new.title": "开始新的对话",
  "chat.new.channel": "创建私密频道",
  "chat.new.channel_label": "私密频道",
  "chat.new.channel_desc":
    "拿到链接的人都能加入的房间。可以新建一个，也可以用别人发来的链接加入。",
  "chat.new.group": "创建私密群组",
  "chat.new.group_label": "私密群组",
  "chat.new.group_desc": "挑选特定的人，最多 16 位。只走蓝牙。",
  "chat.new.place": "按 geohash 前往某地",
  "chat.new.place_label": "前往某地",
  "chat.new.place_desc": "用 geohash 打开任意地点的位置频道。",
  "chat.new.reach": "覆盖范围",
  "chat.new.reach_internet": "通过蓝牙和互联网触达成员。",
  "chat.new.reach_mesh": "在蓝牙范围内可用，不经过互联网。",
  "chat.new.reach_internet_desc":
    "也会通过互联网触达成员。中继能看到频道处于活跃状态，但永远看不到它的消息或成员。",
  "chat.new.reach_mesh_desc":
    "只留在本地网状网络。最为私密，任何内容都不会离开蓝牙范围。",
  "chat.new.join_link": "用邀请链接加入私密频道",
  "chat.new.back_to_chooser": "返回选择器",
  "chat.new.create_channel": "创建频道",
  "chat.new.name_required": "请先输入频道名称",
  "chat.new.name_taken": "该名称已被占用",
  "chat.new.create": "创建",
  "chat.new.e2ee": "端到端加密。只有成员能读到消息。",
  "chat.new.invite_only":
    "仅限邀请。你把链接分享给谁，谁就能加入。对其他所有人都是隐藏的，附近的节点也一样。",
  "chat.new.name_exists": "已经存在同名的频道。",
  "chat.new.reach_bluetooth_chip": "仅蓝牙",
  "chat.new.reach_internet_chip": "蓝牙 + 互联网",
  "chat.new.have_link": "用邀请链接加入",

  // ---- Chats: join by link ----
  "chat.join.title": "用链接加入",
  "chat.join.not_airhop": "那不是 Airhop 链接。",
  "chat.join.reach_internet": "通过蓝牙和互联网触达成员。",
  "chat.join.reach_mesh": "只留在蓝牙范围内。",
  "chat.join.contact_card":
    "一张联系人名片。会把对方加入你的联系人并打开聊天。",
  "chat.join.unverified": "无法验证该链接",
  "chat.join.unverified_body":
    "这张联系人名片与它自己的密钥对不上，因此没有被添加。请对方重新发一张。",
  "chat.join.paste": "从剪贴板粘贴",
  "chat.join.join": "加入",
  "chat.join.public_channel": "公开频道 {name}。附近的任何人都能读到。",
  "chat.join.private_channel": "私密频道 {name}。{reach}",
  "chat.join.dm_with": "与 {name} 的私信。",
  "chat.join.joined_as": "已以 {name} 身份加入",
  "chat.join.name_clash_body":
    "你已经在另一个 {name} 里了。频道名只是标签，所以这个邀请打开了它自己的频道，你原来那个不受影响。可以在各自的频道信息里重命名。",
  "chat.join.paste_hint":
    "粘贴以 airhop:// 开头的邀请。直接点按链接也可以；这里是为无法点按的链接准备的。",
  "chat.join.key_note":
    "私密频道邀请自带密钥，所以加入是即时的，也不需要向任何人索取什么。",
  "chat.join.offline_note":
    "离线可用。链接在这台设备上解析，频道的覆盖范围由创建者设定。",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "无法打开该网格。请稍后再试。",
  "chat.jump.title": "前往某地",
  "chat.jump.saved": "已保存的地点",
  "chat.jump.anywhere": "打开任意地点的公开位置频道，哪怕你并不在那里。",
  "chat.jump.geohash_note":
    "输入它的 geohash。位置落在该网格内的每个人共享同一个频道。",
  "chat.jump.teleport_note":
    "你会显示为远程接入，而不是就在附近。它只通过互联网触达。",
  "chat.jump.level_cell": "{level} 网格",
  "chat.jump.already_here": "你已经在这里了。前往会打开你的 {name} 频道。",
  "chat.jump.open_direction": "打开你{direction}方向的网格",
  "chat.jump.open_place": "打开 {name}",
  "chat.jump.remove_place": "从已保存的地点中移除 {name}",
  "chat.jump.go": "前往",
  "chat.jump.how":
    "查找 geohash：打开一个位置频道 > 点按它的名称 > 从那里复制。",

  // ---- Chats: private groups ----
  "chat.group.unreachable": "无法触达所有成员。等对方在附近时再试一次。",
  "chat.group.you_were_added": "你被加入了 {name}。",
  "chat.group.added_you": "把你加入了 {name}",
  "chat.group.you_were_removed":
    "你被移出了 {name}。你在这里不能再阅读或发送消息了。",
  "chat.group.removed_you": "把你移出了 {name}",
  "chat.group.add_failed": "无法添加对方",
  "chat.group.add_failed_body":
    "没有任何变化。可能是现在联系不上对方，或者群组已满 16 人，又或者你不是它的创建者。",
  "chat.group.remove_failed": "无法移除对方",
  "chat.group.remove_failed_body":
    "没有任何变化。只有创建群组的人才能更改群成员。",
  "chat.group.e2ee": "端到端加密。只有成员能读到消息。",
  "chat.group.cap":
    "由你挑选，最多 16 人。没有邀请链接，所以不会有人靠转发来的链接进来。",
  "chat.group.bluetooth": "仅蓝牙。超出范围的成员回来后就会收到消息。",
  "chat.group.members_label": "成员",
  "chat.group.none_in_range": "范围内没有人。创建群组时成员必须在附近。",
  "chat.group.create_title": "创建群组",
  "chat.group.name_placeholder": "群组名称",
  "chat.group.create": "创建",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "本地网状网络 · 仅蓝牙",
  "chat.scope.mesh_desc":
    "触达蓝牙范围内的设备（大约 10 到 100 米）。无需互联网。最适合就地协调。",
  "chat.scope.block": "街区 · 约 100 米",
  "chat.scope.block_desc":
    "街区级别的覆盖。消息通过互联网桥接，让超出蓝牙范围但就在附近的节点也能参与。",
  "chat.scope.neighborhood": "社区 · 约 1 公里",
  "chat.scope.neighborhood_desc":
    "社区级别的覆盖。借助中继，即使没有直连蓝牙也能触达整片区域的节点。",
  "chat.scope.city": "城市 · 约 10 公里",
  "chat.scope.city_desc":
    "覆盖全城的频道。使用按地理位置选取的互联网中继，触达整个都市区的节点。",
  "chat.scope.province": "省或州 · 约 100 公里",
  "chat.scope.province_desc":
    "省或州级别的覆盖。通过互联网桥接，触达数百公里的区域范围。",
  "chat.scope.country": "国家或地区 · 约 1000 公里",
  "chat.scope.country_desc":
    "覆盖全国。该地区任何 Airhop 或 bitchat 用户都能加入并阅读消息。",
  "chat.transport.bluetooth": "仅蓝牙",
  "chat.transport.both": "蓝牙 + 互联网",
  "chat.transport.internet": "仅互联网",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "命令 /{cmd}：{hint}",
  "chat.cmd.hug_hint": "送上一个温暖的拥抱",
  "chat.cmd.slap_hint": "用一条大鳟鱼拍打",
  "chat.status.sending": "发送中…",
  "chat.status.undo_send": "撤回发送",
  "chat.status.undo": "撤回",
  "chat.status.sent": "已发送",
  "chat.status.received": "已收到",
  "chat.status.failed": "失败",
  "chat.status.canceled": "已取消",
  "chat.status.waiting": "等待中",
  "chat.status.sending_short": "发送中",
  "chat.status.receiving": "接收中",
  "chat.thread.not_available": "此处不可用",
  "chat.thread.private_channel": "私密频道",
  "chat.thread.location_channel": "位置频道",
  "chat.thread.public_channel": "公开频道",
  "chat.thread.notices": "本频道的公告",
  "chat.thread.invite": "邀请他人加入本频道",
  "chat.thread.not_in_range": "不在蓝牙范围内。正通过互联网送达。",
  "chat.thread.not_nearby": "不在附近。等对方回到范围内或上线后，我们会送达。",
  "chat.thread.no_keys":
    "你需要在蓝牙范围内，或者扫描对方的二维码，才能给对方发消息。",
  "chat.geo.card_received":
    "{name} 分享了自己的联系方式。把你的也分享回去，这样你们中任何一方换了地方也能继续聊。",
  "chat.geo.exchange_complete":
    "联系方式已交换。现在你们在任何地方都能联系到彼此。",
  "chat.geo.keep_person": "保留这个人",
  "chat.geo.keep_person_desc":
    "分享你的联系方式，这样你们中任何一方换了地方也能继续聊。对方会知道你的长期身份。",
  "chat.geo.card_sent": "已分享 · 等待对方的",
  "chat.thread.left_cell":
    "你已经离开这片区域，对方在这里联系不到你了。交换二维码就能在任何地方继续聊。",
  "chat.thread.no_route": "现在联系不上对方。有可用路径时消息就会发出。",
  "chat.thread.empty": "还没有消息",
  "chat.thread.empty_desc": "开始一段加密对话。",
  "chat.thread.jump_latest": "跳到最新消息",
  "chat.thread.back_to_members": "返回成员列表",
  "chat.thread.nostr_key": "Nostr 公钥",
  "chat.thread.in_range": "在范围内",
  "chat.voice.not_recorded": "语音留言没有录上",
  "chat.thread.message": "消息",
  "chat.thread.message_placeholder": "消息…",
  "chat.thread.length_full": "消息已达上限",
  "chat.thread.waiting_for": "等待 {name} 回来 · {percent}%",
  "chat.thread.peer": "节点",
  "chat.thread.cancel_transfer": "取消 {name}",
  "chat.thread.queued_more": "还有 {count} 条等待发送",
  "chat.thread.across_bridge": "桥接对面 {count} 位",
  "chat.thread.bridged": "已桥接",
  "chat.thread.invite_body":
    "来 Airhop 的 {channel} 一起聊吧 — 离线优先的私密网状网络通信。",
  "chat.thread.go_back_unread": "返回，{count} 条未读",
  "chat.thread.view_info": "查看 {name} 的信息",
  "chat.thread.notices_new": "本频道的公告，{count} 条新的",
  "chat.thread.say_something": "在 {channel} 里说点什么吧。",
  "chat.thread.jump_latest_new": "跳到最新消息，{count} 条新的",
  "chat.thread.unconfirmed_since": "自 {date} 起没有确认过送达",
  "chat.thread.no_reach": "附近没有节点 · 还没有人收到这条消息",
  "chat.thread.channel_needs_internet":
    "互联网已关 · 本频道只能触达蓝牙范围内的人",
  "chat.thread.cell_needs_internet": "互联网已关 · 该网格只能通过互联网触达",
  "chat.thread.geo_dm_needs_internet": "互联网已关 · 本对话只通过互联网传输",
  "chat.thread.via_gateway": "互联网已关 · 附近有一台设备正替你把它带上网",
  "chat.thread.group_queued":
    "这个群组里还没有人在附近。等他们到了，消息就会送达。",
  "chat.thread.no_group_key": "你已不在这个群组中，因此无法发送",
  "chat.thread.no_reach_offline":
    "互联网已关且附近没有节点 · 还没有人收到这条消息",
  "chat.thread.mention": "提及 {name}",
  "chat.thread.someone_talking": "{hold}。{name} 正在说话。",
  "chat.thread.attach_note":
    "文件只在蓝牙范围内发送。文字和付款能触达互联网上的联系人，附件不行。",
  "chat.thread.message_peer": "给 {name} 发消息",
  "chat.thread.send": "发送消息",
  "chat.thread.group": "群组",
  "chat.bridge.nearby_only": "仅限附近：让这条消息不走网状网络桥接",
  "chat.bridge.nearby_label": "仅限附近 · 只走蓝牙",
  "chat.bridge.bridging_label": "正桥接到附近区域 · 点按可改为仅限附近",
  "chat.screenshot.you_took": "你截了屏",
  "chat.screenshot.you_took_private": "你截了屏 · 没有告诉任何人",
  "chat.screenshot.heads_up": "提醒一下",
  "chat.screenshot.notice": "* {name} 截了屏 *",
  "chat.screenshot.notified_dm": "{name} 已被告知你截了这段对话的屏。",
  "chat.screenshot.notified": "本频道的所有人都已被告知你截了屏。",
  "chat.screenshot.not_notified":
    "没有通知任何人。本频道是公开的，宣布一次截屏反而会记录下你曾经在这里。",
  "chat.thread.error": "错误",
  "chat.thread.go_back": "返回",
  "chat.bubble.via_bridge": "经由网状网络桥接",
  "chat.bubble.view_profile": "查看 {name} 的个人资料",
  "chat.bubble.forwarded": "已转发",
  "chat.bubble.attachment": "附件",
  "chat.bubble.a11y": "{sender}：{body}。长按查看更多选项。",
  "chat.bubble.failed_retry": "发送失败。点按重试。",

  // ---- Chats: message actions and info ----
  "chat.info.title": "消息信息",
  "chat.info.delivered_to": "已送达 {name}",
  "chat.info.read_by": "{name} 已读",
  "chat.info.group_reach_desc": "现在可以触达，不代表已送达",
  "chat.info.group_alone": "没有其他成员",
  "chat.info.today_at": "今天 {time}",
  "chat.info.sending": "发送中…",
  "chat.info.failed": "发送失败",
  "chat.info.courier": "由一位朋友捎带",
  "chat.info.sent": "已发送",
  "chat.info.queued": "等待发送",
  "chat.info.waiting": "等待中…",
  "chat.action.info": "消息信息",
  "chat.action.save_photos": "保存到照片",
  "chat.action.save_copy": "保存副本",
  "chat.action.forward": "转发",
  "chat.action.select": "选择",
  "chat.select.cancel": "取消选择",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "相机",
  "chat.attach.camera_desc": "拍一张照片或一段视频",
  "chat.attach.library": "照片图库",
  "chat.attach.library_desc": "从你的图库中选择",
  "chat.attach.document": "文档",
  "chat.attach.document_desc": "发送任意文件或 PDF",
  "chat.attach.voice": "语音留言",
  "chat.attach.voice_desc": "录制并发送一条语音消息",
  "chat.attach.ecash": "发送 ecash",
  "chat.attach.ecash_desc": "从你的钱包发送 Cashu sat",
  "chat.attach.location": "位置",
  "chat.attach.location_desc": "发送你此刻所在的位置",
  "chat.attach.title": "附件",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "分享了一个位置",
  "chat.location.received_summary": "分享了自己的位置",
  "chat.location.title": "位置",
  "chat.location.away": "{direction}{distance}",
  "chat.location.taken": "{ago}前取得",
  "chat.location.open_maps": "在地图中打开",
  "chat.location.no_forward": "位置不能转发",
  "chat.location.no_forward_body":
    "一个位置只发给一个人。如果你想让别人也拿到，请分享你自己的位置。",
  "chat.location.no_fix": "允许定位即可看到这里有多远",
  "chat.location.send_title": "发送你的位置",
  "chat.location.send_body":
    "{name} 只会看到一个点：你此刻所在的位置。它不会持续更新。",
  "chat.location.send": "发送位置",
  "chat.location.finding": "正在查找你的位置…",
  "chat.location.no_location": "无法获取你的位置",
  "chat.location.no_location_body":
    "请允许定位访问并确认定位服务已开启，然后重试。",
  "chat.location.not_delivered": "无法发送你的位置",
  "chat.location.not_delivered_body":
    "位置只在当下才有意义，所以它不会排队等到以后再发。等能联系到 {name} 时再试一次。",
  "chat.location.direction.n": "正北",
  "chat.location.direction.ne": "东北",
  "chat.location.direction.e": "正东",
  "chat.location.direction.se": "东南",
  "chat.location.direction.s": "正南",
  "chat.location.direction.sw": "西南",
  "chat.location.direction.w": "正西",
  "chat.location.direction.nw": "西北",
  "chat.attach.send_anyway": "仍然发送",
  "chat.attach.bitchat_too_big": "这可能送不到",
  "chat.attach.bitchat_too_big_body":
    "{name} 用的是 bitchat，它遇到大文件会传到一半就放弃。大约 350 KiB 以下比较可靠。发给 Airhop 联系人则没有这个限制。",
  "chat.attach.bitchat_unopenable": "对方可能打不开这个",
  "chat.attach.bitchat_unopenable_body":
    "{name} 用的是 bitchat，它能显示照片和语音留言，其余一律列为打不开的文件。文件会送到，只是对方可能看不了。",
  "chat.attach.file": "添加附件",
  "chat.attach.unavailable": "此处不支持附件",
  "chat.attach.not_sent": "附件未发送",
  "chat.attach.read_failed": "读取那个文件时出了问题。换一个试试。",
  "chat.attach.caption": "添加说明…",
  "chat.attach.send": "发送附件",
  "chat.attach.generic": "附件",
  "chat.media.view_full": "全屏查看照片",
  "chat.media.gone_photo": "这台设备上没有该照片",
  "chat.media.gone_video": "这台设备上没有该视频",
  "chat.media.gone_voice": "这台设备上没有该语音留言",
  "chat.media.gone_file": "这台设备上没有该文件",
  "chat.media.gone_note": "已在 7 天后或缓存被清空时移除",
  "chat.media.ask_resend": "再问一次",
  "chat.media.resend_draft": "能再发一次那{kind}吗？",
  "chat.media.kind_photo": "张照片",
  "chat.media.kind_video": "段视频",
  "chat.media.kind_voice": "条语音留言",
  "chat.media.kind_file": "个文件",
  "chat.media.pause_voice": "暂停语音留言",
  "chat.media.play_voice": "播放语音留言",
  "chat.media.voice_position": "语音留言位置",
  "chat.media.voice_scrub": "沿着音条点按可跳到该处",
  "chat.media.image": "图片",
  "chat.media.tap_load_photo": "点按加载照片",
  "chat.media.open_document": "打开 {name}",
  "chat.media.document": "文档",
  "chat.media.tap_load_video": "点按加载视频",
  "chat.media.video": "视频",
  "chat.media.photo": "照片",
  "chat.media.close_photo": "关闭照片",
  "chat.media.save_photo": "把照片保存到你的照片",
  "chat.media.share_photo": "分享照片",
  "chat.media.saved_videos": "已保存到你的视频",
  "chat.media.saved_photos": "已保存到你的照片",
  "chat.media.not_saved": "未保存",
  "chat.media.cant_open": "打不开文件",
  "chat.media.no_app": "这台设备上没有可用来打开或分享此文件的应用。",
  "chat.media.open_failed": "无法打开该文件。它可能已被从缓存中清除。",
  "media.blocked.nostr_only":
    "你只是通过中继认识这个人。只有文字可用。照片、文件和语音留言需要蓝牙。",
  "media.blocked.private_channel":
    "广播附件只有签名而没有加密，所以把它发进私密频道会让它以明文形式暴露，而这里的文字仍然是加密的。",
  "media.blocked.private_group":
    "广播附件只有签名而没有加密，所以把它发进私密群组会让它以明文形式暴露，而这里的文字仍然是加密的。",
  "media.blocked.location_channel":
    "位置频道通过互联网触达他人，而照片、文件和语音留言走的是蓝牙，所以它们永远送不到。",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "此处不支持语音留言",
  "chat.voice.hold_live": "按住实时通话",
  "chat.voice.hold_record": "按住录制语音留言",
  "chat.voice.cancel_recording": "取消录制",
  "chat.voice.slide_cancel": "滑动取消",
  "chat.voice.release_cancel": "松开取消",
  "chat.voice.a11y_toggle": "双击开始或停止说话。",
  "chat.voice.limit_reached": "已达两分钟上限，松开即可发送",
  "chat.voice.limit_sent": "已达两分钟上限，留言已发送",
  "chat.voice.stop_send": "停止录制并发送",
  "chat.voice.lift_lock": "向上滑动可免手持录制",
  "chat.voice.live_speaking": "{name} 正在说话",
  "voice.unavailable": "实时语音不可用",
  "voice.recording_stopped": "录制已停止",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "相机访问权限",
  "chat.perm.camera_purpose": "拍一张照片发送",
  "chat.perm.photo_label": "照片访问权限",
  "chat.perm.photo_purpose": "挑选一张照片或一段视频发送",
  "chat.perm.photo_save_purpose": "把它保存到你的照片",
  "chat.perm.mic_label": "麦克风访问权限",
  "chat.perm.mic_live_purpose": "和附近的人说话",
  "chat.perm.mic_note_purpose": "录制一条语音留言",
  "chat.perm.recording_stopped": "录制已停止",
  "chat.perm.record_failed": "无法开始录制。请检查麦克风权限。",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "已领取",
  "chat.ecash.reclaimed": "已收回",
  "chat.ecash.claiming": "领取中…",
  "chat.ecash.claim": "领取",
  "chat.ecash.claim_amount": "领取 {amount} {unit}",
  "chat.ecash.already_claimed": "已经领取过了",
  "chat.ecash.already_claimed_body":
    "这个代币里的每一份凭证都已经在你的钱包里了，所以没有新增任何东西。",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "已交给网状网络尽力送达",
  "chat.info.queued_desc": "先留在这台手机上，直到有路径能送到对方",
  "chat.info.reclaimed": "已收回",
  "chat.info.reclaimed_desc": "你已把这笔付款收回自己的钱包，因此它不会送达",
  "chat.info.about": "关于",
  "chat.info.group_desc":
    "一个私密群组。只有创建者添加的成员能读到，而且它只走蓝牙。",
  "chat.info.teleported_desc":
    "这个 geohash 网格的公开位置频道。网格内的任何人，无论用 Airhop 还是 bitchat，都通过互联网共享它。你是远程接入的，人并不在这里。",
  "chat.info.custom_desc":
    "一个自定义频道。知道名称的人都能从任意 Airhop 或 bitchat 设备加入。",
  "chat.info.private_e2ee": "私密 · 端到端加密",
  "chat.info.public_plain": "公开 · 未加密",
  "chat.info.group_privacy":
    "只有下面列出的成员能读到这个群组。消息只走蓝牙，所以超出范围的成员回来后就会收到。",
  "chat.info.teleport_privacy":
    "你远程接入的一个地方。它通过互联网触达这个网格里的每个人，而不会触达蓝牙范围内的任何人。",
  "chat.info.location_off_privacy":
    "定位已关闭，因此本频道只能通过蓝牙触达附近设备。开启定位即可通过互联网触达它所在的区域网格。",
  "chat.info.invite_privacy":
    "只有你用链接邀请的人能读到。对其他所有人都是隐藏的，附近的节点也一样。",
  "chat.info.public_privacy":
    "任何加入的人都能读到每一条消息。私下交谈请用私信；私信是端到端加密的。",
  "chat.info.remove_member": "移除成员",
  "chat.info.remove_member_body":
    "把 {name} 移出群组？群组密钥会轮换，对方将无法再读到新消息。",
  "chat.info.message_member": "给 {name} 发消息",
  "chat.info.remove_member_a11y": "移除 {name}",
  "chat.info.no_addable": "没有可添加的可达节点。成员必须在附近。",
  "chat.info.add_count": "添加 {count} 位",
  "chat.info.teleported_tag": "{level}  ·  远程",
  "chat.info.active": "活跃",
  "chat.info.members": "成员",
  "chat.info.bookmark": "收藏这个地点",
  "chat.info.remove_bookmark": "取消收藏",
  "chat.info.default_notice":
    "默认频道无法退出。它们是 Airhop 网状网络协议的一部分。",
  "chat.info.custom_channel": "自定义频道",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "复制 geohash",
  "chat.info.relays": "中继",
  "chat.info.show_relays": "显示承载本频道的中继",
  "chat.info.relay_custom": "自定义",
  "chat.info.relays_none": "没有。这个网格现在只走蓝牙。",
  "chat.info.search_members": "搜索成员",
  "chat.info.search_members_placeholder": "搜索成员…",
  "chat.info.teleported": "远程接入",
  "chat.info.creator": "创建者",
  "chat.info.no_matches": "没有匹配项",
  "chat.info.no_one_here": "这里还没有人",
  "chat.info.add_members": "添加成员",
  "chat.info.add_selected": "添加所选成员",
  "chat.info.add": "添加",
  "chat.info.leave_group": "退出群组",
  "chat.info.leave_channel": "退出频道",
  "chat.info.leave": "退出",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "自 {date} 起开始聊天",
  "chat.contact.verified_since": "自 {date} 起已验证",
  "chat.contact.anonymous": "匿名",
  "chat.contact.anonymous_desc": "一个 geohash 化名，没有可供验证的长期身份",
  "chat.contact.verified": "已验证",
  "chat.contact.verified_desc": "你扫过对方的二维码",
  "chat.contact.verified_desc_compared": "你和对方核对过二维码",
  "chat.contact.not_verified": "未验证",
  "chat.contact.not_verified_desc":
    "扫描对方的二维码，或者在通话中核对一次，以确认这真的是本人",
  "chat.contact.e2ee": "端到端加密",
  "chat.contact.e2ee_nostr": "按 NIP-17 礼物包装，因此中继读不到",
  "chat.contact.e2ee_mesh": "Noise XX，Airhop 设备之间还有 Double Ratchet",
  "chat.contact.copy_nostr": "复制 Nostr 公钥",
  "chat.contact.nostr_key": "Nostr 公钥",
  "chat.contact.cell_key_note":
    "这个密钥属于你们相遇的那片区域。你们中任何一方移动它就会变，对话也随之中断。交换联系方式就能在任何地方继续聊。",
  "chat.contact.peer_name": "节点名称",
  "chat.contact.peer_id": "节点 ID",
  "chat.contact.rename": "重命名",
  "chat.contact.rename_needs_contact":
    "你可以重命名手里握有密钥的人。先交换联系人名片，之后这就成了只有你看得到的名字。",
  "chat.contact.rename_needs_keys":
    "这位联系人还没有密钥。给对方发条消息，或者扫描对方的二维码，你就能给对方起一个只有你看得到的名字。",
  "chat.contact.renamed_by_you": "你给对方起的名字",
  "chat.contact.copy_peer_id": "复制节点 ID",
  "chat.contact.verify": "验证联系人",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "公告",
  "chat.notices.post_area": "向这片区域发布公告",
  "chat.notices.post_mesh": "向网状网络发布公告",
  "chat.notices.mark_urgent": "标为紧急",
  "chat.notices.post": "发布公告",
  "chat.notices.post_short": "发布",
  "chat.notices.delete": "删除公告",
  "chat.notices.just_now": "刚刚",
  "chat.notices.fades_soon": "即将消退",
  "chat.notices.1_day": "1 天",
  "chat.notices.3_days": "3 天",
  "chat.notices.7_days": "7 天",
  "chat.notices.fading": "消退中",
  "chat.notices.fades_in_hours": "{count} 小时后消退",
  "chat.notices.fades_in_days": "{count} 天后消退",
  "chat.notices.scope_geo": "地理",
  "chat.notices.scope_mesh": "网状网",
  "chat.notices.urgent_short": "紧急",
  "chat.notices.permanent_warning":
    "永不消退。它是公开的，绑定在这片区域上，而且你收不回来。",
  "chat.notices.none": "还没有公告。发一条，让它留在这里给别人看。",

  // ---- Chats: search results ----
  "chat.search.photos": "照片",
  "chat.search.videos": "视频",
  "chat.search.audio": "音频",
  "chat.search.documents": "文档",
  "chat.search.links": "链接",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "按{filter}筛选",
  "chat.search.no_matches": "没有与“{query}”匹配的{filter}",
  "chat.search.no_media": "还没有{filter}",
  "chat.search.result_a11y": "{chat}，来自 {sender} 的{kind}",
  "chat.search.you": "你",
  "chat.search.section_chats": "聊天",
  "chat.search.section_messages": "消息",
  "chat.search.section_notices": "公告",
  "chat.search.hint": "搜索消息和聊天，或者从上面选一个筛选条件。",
  "chat.search.no_results": "没有“{query}”的结果",
  "chat.search.open_chat": "打开 {name}",
  "chat.search.message_a11y": "{chat}，来自 {sender} 的消息：{snippet}",
  "chat.search.notice_a11y": "{chat} 中来自 {author} 的公告：{snippet}",
  "chat.search.urgent": "紧急 ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "这个列表里有 {count} 条。清空只会把它们从这里移除，消息在各自的对话中仍然未读。全部标为已读则两边都会清掉。",
  "chat.notif.mark_all_read": "全部标为已读",
  "chat.notif.clear_list": "清空列表",
  "chat.notif.clear_all_a11y": "清空全部 {count} 条通知",
  "chat.notif.title": "通知",
  "chat.notif.clear_short": "清空",
  "chat.notif.close": "关闭通知",
  "chat.notif.none": "还没有通知",
  "chat.notif.none_desc": "来自你的频道和聊天的消息、提及和公告会显示在这里。",
  "chat.notif.new": "新",
  "chat.notif.notice_in": "{channel} 中的公告",

  // ---- Chats: forward ----
  "chat.forward.title": "转发给…",
  "chat.forward.to": "转发给 {name}",
  "chat.forward.cant_send_here": "这里不能转发",
  "chat.forward.cant_send_to": "不能转发给 {name}",
  "chat.forward.channels": "频道",
  "chat.forward.groups": "群组",
  "chat.forward.locations": "位置",
  "chat.forward.dms": "私信",
  "chat.forward.none": "还没有其他聊天",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "正在启动网状网络…",
  "mesh.banner.no_bluetooth": "这台设备没有蓝牙 · 仅互联网",
  "mesh.banner.bluetooth_off": "蓝牙已关 · 网状网络不可用",
  "mesh.banner.permission_needed": "需要蓝牙权限",
  "mesh.banner.blocked": "蓝牙被拦截 · 请在设置中允许",
  "mesh.banner.location_permission": "需要定位才能找到节点",
  "mesh.banner.advertising_unsupported": "这台手机能看到别人，但自己不会被发现",
  "mesh.banner.location_off_android": "定位已关 · Android 需要它才能找到节点",
  "mesh.banner.paused": "网状网络已暂停 · 你处于离开状态",
  "mesh.banner.location_off": "定位已关 · 位置频道不可用",
  "mesh.banner.battery_saver": "省电模式 · 扫描频率降低",
  "mesh.banner.wipe_incomplete":
    "抹除未完成 · 可能还有残留数据，重新打开会再试一次",
  "mesh.banner.wifi_off": "Wi-Fi 已关 · 大文件发得更慢",
  "mesh.banner.clock_skew": "这台手机的时钟不对 · 请把日期和时间设为自动",
  "mesh.banner.internet_off": "互联网已关 · 仅蓝牙",
  "mesh.banner.relaying": "附近没有本地节点 · 正经由 Nostr 中继",
  "mesh.banner.tor": "Tor 已开 · 互联网流量已转发",
  "mesh.banner.tor_starting": "正在启动 Tor · 连接中",
  "mesh.banner.tor_blocked": "Tor 无法连接 · 网状网络照常可用",
  "mesh.banner.gateway": "互联网网关已开 · 正为附近节点中继",
  "mesh.banner.bridge": "网状网络桥接已开 · 公开聊天已连通",
  "mesh.banner.background_limits": "{brand} 可能会在后台暂停网状网络",
  "mesh.banner.bridge_across": "网状网络桥接已开 · 桥接对面有 {count} 位",
  "mesh.banner.action.turn_on": "开启",
  "mesh.banner.action.allow": "允许",
  "mesh.banner.action.resume": "恢复",
  "mesh.banner.action.fix": "修复",
  "mesh.banner.hint.resume": "重新开启蓝牙广播和扫描",
  "mesh.banner.hint.enable_bluetooth": "请求 Android 打开蓝牙",
  "mesh.banner.hint.location_settings": "打开系统定位设置",
  "mesh.banner.hint.app_settings": "在系统设置中打开 Airhop 的权限",
  "mesh.banner.hint.battery_settings": "打开这台手机的后台活动设置",
  "mesh.banner.dismiss": "忽略：{label}",
  "mesh.banner.hint.dismiss": "永久隐藏这条提示",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "正在扫描附近的节点…",
  "mesh.radar.starting": "正在启动网状网络…",
  "mesh.radar.no_bluetooth": "这台设备没有蓝牙",
  "mesh.radar.bluetooth_off": "蓝牙已关 · 未在扫描",
  "mesh.radar.permission_needed": "需要蓝牙权限",
  "mesh.radar.blocked": "蓝牙被拦截",
  "mesh.radar.location_permission": "需要定位权限",
  "mesh.radar.location_off": "定位已关 · 未在扫描",
  "mesh.radar.hint_rings": "圆环表示 BLE 信号强度，不是距离",
  "mesh.radar.hint_checking": "正在检查蓝牙和权限",
  "mesh.radar.hint_internet": "消息仍然能通过互联网传递",
  "mesh.radar.hint_turn_on": "打开蓝牙即可发现节点",
  "mesh.radar.hint_allow": "允许蓝牙即可发现节点",
  "mesh.radar.hint_allow_settings": "在设置中允许蓝牙即可发现节点",
  "mesh.radar.hint_location_permission":
    "Android 11 及更早版本需要定位才能通过蓝牙扫描",
  "mesh.radar.hint_android_location":
    "Android 需要开启定位才会返回蓝牙扫描结果",
  "mesh.radar.signal_strong": "强",
  "mesh.radar.signal_medium": "中",
  "mesh.radar.signal_weak": "弱",
  "mesh.radar.you_center": "你，在网状网络的中心",
  "mesh.radar.sonar_hint": "播放一次声呐扫描。扫描本来就是持续进行的。",
  "mesh.radar.paused": "网状网络已暂停 · 你处于离开状态",
  "mesh.radar.ring_hint": "圆环位置反映的是信号强度，不是距离",
  "mesh.radar.set_online": "在个人页把状态设为在线即可发现节点",
  "mesh.radar.in_range": "在范围内",
  "mesh.radar.recently_seen": "最近见过",
  "mesh.radar.peer_hint": "打开给这个节点发消息或付款的选项",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "刚刚",
  "mesh.peer.none": "附近没有节点",
  "mesh.peer.none_desc":
    "蓝牙范围内其他的 Airhop 或 bitchat 设备会出现在这里。",
  "mesh.peer.id_copied": "节点 ID 已复制",
  "mesh.peer.copy_id": "复制节点 ID",
  "mesh.peer.their_name": "自称 {name}",
  "mesh.peer.in_range": "在范围内",
  "mesh.peer.relay": "中继节点",
  "mesh.peer.relay_body":
    "有人开着不管、专门用来扩大网状网络的一台电台。它转运自己读不懂的消息。这里没有人可以聊天。",
  "mesh.peer.send_dm": "发一条私信",
  "mesh.peer.message": "消息",
  "mesh.peer.send_sats": "发送 ecash",
  "mesh.peer.amount_placeholder": "金额（sat）",
  "mesh.peer.amount_first": "发送 ecash，请先输入金额",
  "mesh.peer.cancel_send": "取消发送 ecash",
  "mesh.peer.view_peer": "查看节点 {name}",
  "mesh.peer.view_peer_online": "查看节点 {name}，在线",
  "mesh.peer.last_seen": "上次出现在 {ago}前",
  "mesh.peer.send_amount": "发送 {amount} sat",
  "mesh.peer.direct": "直接连接",
  "mesh.peer.check_distance": "测一下距离",
  "mesh.peer.checking": "测量中",
  "mesh.peer.no_reply": "没有回应",
  "mesh.peer.no_reply_hint": "对方可能已经走开，也可能他们的应用不作应答",
  "mesh.peer.rtt": "{ms} 毫秒",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "地区",
  "mesh.level.province": "省",
  "mesh.level.city": "城市",
  "mesh.level.neighborhood": "社区",
  "mesh.level.block": "街区",
  "mesh.level.building": "楼宇",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "可花费",
  "wallet.balance.unit_hint": "在聪和比特币之间切换",
  "wallet.balance.a11y": "余额 {value} {unit}",
  "wallet.balance.locked":
    "钱包存储已锁定。Ecash 凭证保存在一个加密文件中，它的密钥存放在设备钥匙串里，现在无法打开。请解锁设备并重新打开 Airhop。",
  "wallet.balance.tor_blocked":
    "Tor 已开启，因此铸币厂请求被拦截：它们会走明网发出，把你的 IP 和你的凭证关联起来。通过网状网络收发仍然可用。可在设置的安全里允许铸币厂流量。",
  "wallet.balance.unconfirmed_note": "{amount} 尚未与铸币厂确认",
  "wallet.balance.reserved_note": "{amount} 已为一笔在途发送预留",
  "wallet.balance.other_mint_note": "{amount} 存在另一个铸币厂账户里",
  "wallet.balance.test_mint_note":
    "其中包含来自测试铸币厂的游戏币。它不是比特币，也无法兑现。",
  "wallet.token": "代币",
  "wallet.action.send": "发送 ecash 代币",
  "wallet.action.send_disabled": "发送 ecash 代币，余额为零时不可用",
  "wallet.action.receive": "接收 ecash 代币",
  "wallet.action.zap": "给 Nostr 联系人打闪",
  "wallet.action.zap_disabled": "给 Nostr 联系人打闪，余额为零时不可用",
  "wallet.action.add_mint": "添加 Cashu 铸币厂",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "无法构建该代币",
  "wallet.send.title": "发送 ecash",
  "wallet.send.amount_in": "金额（{unit}）",
  "wallet.send.body":
    "用你已经持有的凭证离线构建。在你确认代币已送达之前，余额不会被永久扣除。",
  "wallet.send.stale_fee_note":
    "手续费上次核对是在 {days} 天前。如果这个铸币厂之后调高了费率，这笔发送可能会略贵一些。",
  "wallet.send.fee_note":
    "{spend} {unit} 从你的余额中扣除；多出的 {fee} 用于抵消对方本来要付的铸币厂手续费",
  "wallet.send.qr_too_big":
    "这个代币拆成的币太多，装不进一个二维码。请改用分享或复制，或者在铸币厂刷新以合并。",
  "wallet.send.bearer_note":
    "谁拿着这串字符，钱就是谁的。这些凭证是被预留而不是已花掉：如果它始终没有送到任何人手上，你可以在待处理里收回。",
  "wallet.send.qr_too_big_short":
    "这个代币拆成的币太多，装不进一个二维码。请改用分享或复制。",
  "wallet.send.scan_note":
    "让对方用自己的钱包扫这个。在你标记为已送达之前仍然可以收回。",
  "wallet.send.mesh_note": "代币会作为加密私信通过网状网络发出。无需互联网。",
  "wallet.send.no_peers_note":
    "打开网状网络标签页寻找附近设备，或者换一种方式分享代币。",
  "wallet.send.send_to": "发送给 {name}",
  "wallet.send.memo": "备注（可选，随代币一起传递）",
  "wallet.send.building": "构建中…",
  "wallet.send.build": "构建代币",
  "wallet.send.inexact_body":
    "你的凭证在离线状态下凑不出正好 {amount} {unit}。能构建的最小代币是 {spend} {unit}，而离线是没有找零的：多出的 {extra} {unit} 会归接收方。\n\n联网时在铸币厂刷新一次，可以把你的凭证拆成能凑出这个精确金额的面额。",
  "wallet.send.send_amount": "发送 {amount}",
  "wallet.send.sent_to": "{amount} {unit} 已发送给 {name}",
  "wallet.send.sent_to_body":
    "{route} 在你确认对方收到之前，或者在铸币厂告知这些凭证已被兑付之前，它都留在待处理里可以收回。",
  "wallet.send.copy_token": "复制代币",
  "wallet.send.share_token": "分享代币",
  "wallet.send.open_in_wallet": "在另一个钱包中打开这个代币",
  "wallet.send.open_in_wallet_short": "在钱包中打开",
  "wallet.send.to_peer": "把代币发给附近的节点",
  "wallet.send.to_peer_short": "发给节点",
  "wallet.send.mark_delivered": "标记为已送达并结束",
  "wallet.send.they_got_it": "对方收到了",
  "wallet.send.keep_pending": "让这笔发送保持待处理",
  "wallet.send.decide_later": "稍后再定",
  "wallet.send.no_peers": "范围内没有节点",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "这是你自己的付款",
  "wallet.receive.own_payment_body":
    "这些币仍在为一笔你尚未结清的发送预留着，所以没有可领取的东西。对那笔付款使用收回，就能把它们直接放回你的余额。",
  "wallet.receive.already_have": "已经在你的钱包里",
  "wallet.receive.already_have_body":
    "这个代币里的每一份凭证都已经存在这里了，所以没有新增任何东西。余额没有变化。",
  "wallet.receive.stored_unconfirmed":
    "已从 {mint} 存入，但尚未与铸币厂确认（{reason}）。",
  "wallet.receive.offline": "离线",
  "wallet.receive.redeemed_here":
    "已在 {mint} 兑付。这些凭证现在只属于你：发送方手里的副本不再有效。",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "已在 {mint} 兑付。现在它可被证明属于你：发送方手里的这份代币副本不再有效。",
  "wallet.receive.stored_pending":
    "已从 {mint} 存入，但铸币厂尚未确认它未被花费{dleq}。联网后请在钱包标签页刷新。",
  "wallet.receive.dleq_inline": "（它的签名确实对得上，所以这个代币是真的）",
  "wallet.receive.dleq_ok": "铸币厂的签名对得上，所以这个代币是真的。",
  "wallet.receive.dleq_uncached":
    "这个铸币厂的密钥没有缓存在这里，所以无法离线核验签名。",
  "wallet.receive.dleq_warning":
    "在你联网刷新之前，发送方理论上有可能已经把它花在别处。",
  "wallet.receive.failed": "无法接收",
  "wallet.receive.title": "接收 ecash",
  "wallet.receive.body":
    "粘贴一个 Cashu 代币。联网时它会立刻在铸币厂兑付；离线时它会被存下来，等你下次刷新时再确认。",
  "wallet.receive.scan": "扫描 ecash 二维码",
  "wallet.receive.scan_short": "扫描二维码",
  "wallet.receive.receiving": "接收中…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "收到来自 {from}… 的 Nutzap，已兑付进你的钱包。",
  "wallet.zap.title": "给一个 Nostr 身份打闪",
  "wallet.zap.not_npub": "不是 npub",
  "wallet.zap.bad_key": "密钥有误",
  "wallet.zap.invalid_pubkey": "公钥无效",
  "wallet.zap.invalid_pubkey_body":
    "请输入 npub1… 开头的公钥，或者 64 位十六进制的 Nostr 公钥。",
  "wallet.zap.sent": "Nutzap 已发送",
  "wallet.zap.failed": "打闪失败",
  "wallet.zap.body":
    "如果对方公布了 NIP-61 nutzap 信息，这笔 ecash 会锁定到对方的密钥上，别人花不了，也收不回来。如果没有，它会改为以可收回的代币形式发出。系统会告诉你实际走了哪一种。",
  "wallet.zap.contact": "给 {name} 打闪",
  "wallet.zap.pubkey_placeholder": "npub1… 或 64 位十六进制",
  "wallet.zap.sending": "发送中…",
  "wallet.nostr.copied_body":
    "把这个给别人，对方就能从 Airhop 或任何其他 Nostr 钱包给你打闪，完全不需要蓝牙。",
  "wallet.nostr.copy_key": "复制你的 Nostr 密钥，好让别人给你打闪",
  "wallet.nostr.your_key": "你的 Nostr 密钥",

  // ---- Wallet: mints ----
  "wallet.mint.added": "铸币厂已添加",
  "wallet.mint.add_failed": "无法添加铸币厂",
  "wallet.mint.added_named": "已添加 {name}",
  "wallet.mint.added_body":
    "{mint} 发行 {units}。它的密钥已缓存在这台设备上，因此即使没有互联网，来自它的代币现在也能核验。",
  "wallet.mint.remove_plain":
    "把 {mint} 从你的钱包中移除？它缓存的密钥也会一并删除，来自它的代币将无法再离线核验。",
  "wallet.mint.title": "铸币厂",
  "wallet.mint.none": "还没有铸币厂",
  "wallet.mint.none_desc":
    "铸币厂负责发行和兑付你的 ecash。添加一个即可通过 Lightning 存入，或者干脆收一个代币，它的铸币厂就会自动为你添加。",
  "wallet.mint.add": "添加铸币厂",
  "wallet.mint.add_body":
    "铸币厂替你的 ecash 保管背后的比特币，所以请挑一个你愿意托付这笔余额的。URL 在保存前会被核查。如果你不想信任任何人，可以用 Nutshell 自建一个。",
  "wallet.mint.consolidate_body":
    "一个代币只能指明一个铸币厂，所以分散在多个铸币厂的余额，付不了超过其中最大那份的金额。Airhop 可以帮你搬：其余每个铸币厂各去支付一张由你选定的那个开出的 Lightning 发票。会花一点路由费，也需要互联网。",
  "wallet.mint.add_short": "添加铸币厂",
  "wallet.mint.checking": "核查中…",
  "wallet.mint.remove_with_balance": "移除还有余额的铸币厂？",
  "wallet.mint.remove": "移除铸币厂",
  "wallet.mint.delete_anyway": "仍然删除",
  "wallet.mint.consolidate": "把所有余额归拢到一个铸币厂",
  "wallet.mint.confirm_with": "向 {mint} 确认凭证",
  "wallet.mint.remove_a11y": "移除 {mint}",
  "wallet.mint.available_amount": "可用 {amount} {unit}",
  "wallet.mint.split_across": "余额分散在 {count} 个铸币厂。把它归拢到一个。",
  "wallet.mint.move_everything_to": "把全部转到 {mint}",
  "wallet.mint.consolidate_title": "归拢到一个铸币厂",
  "wallet.mint.moving": "转移中…",
  "wallet.mint.move": "转移",
  "wallet.mint.moved": "已转移",
  "wallet.mint.moved_body":
    "扣除 {fees} {unit} 的 Lightning 路由费后，{amount} {unit} 现在存放在 {mint}。",
  "wallet.mint.nothing_moved": "没有转移任何东西",
  "wallet.mint.destination": "· 目标",
  "wallet.mint.will_move": "· 将被转移",
  "wallet.mint.issued_by": "发行方",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop 钱包充值",
  "wallet.ln.invoice_failed": "无法创建发票",
  "wallet.ln.price_failed": "无法为这张发票定价",
  "wallet.ln.paid": "已支付",
  "wallet.ln.deposit_credited":
    "发票已支付，{mint} 已发行 {amount} {unit}。这笔余额已确认：你马上就能离线花掉它。",
  "wallet.ln.withdrawn":
    "已通过 Lightning 支付 {paid} sat。铸币厂收取了 {fee} sat 的路由费。",
  "wallet.ln.withdrawn_with_change":
    "已通过 Lightning 支付 {paid} sat。铸币厂收取了 {fee} sat 的路由费，并把预留中剩下的 {change} sat 退回你的余额。",
  "wallet.ln.payment_failed": "支付失败",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "把 Lightning 上的 sat 变成可以离线花的 ecash，或者把 ecash 兑付到任意一张 Lightning 发票。两者都需要互联网和一个铸币厂。",
  "wallet.ln.deposit_body":
    "铸币厂给你一张发票。用任意 Lightning 钱包付掉它，这些 sat 就会以 ecash 的形式回来，可以离线花。",
  "wallet.ln.pay_invoice_for":
    "支付这张 {amount} {unit} 的发票。钱包正在盯着这笔付款，到账后会自动为你发行 ecash。",
  "wallet.ln.expired_body":
    "这张发票已过期。如果你已经付过了，余额会自动入账。",
  "wallet.ln.waiting_expires": "等待付款 · {countdown} 后过期",
  "wallet.ln.withdraw_body":
    "粘贴一张 bolt11 发票，铸币厂会用你的 ecash 去付。系统先给你报出路由预留额；路由没用掉的部分会退回你的余额。",
  "wallet.ln.up_to": "最多 {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "支付 {amount} {unit}",
  "wallet.ln.deposit": "通过 Lightning 存入 sat",
  "wallet.ln.deposit_short": "存入",
  "wallet.ln.withdraw": "提现到一张 Lightning 发票",
  "wallet.ln.withdraw_short": "提现",
  "wallet.ln.deposit_title": "通过 Lightning 存入",
  "wallet.ln.amount_placeholder": "金额（sat）",
  "wallet.ln.requesting": "请求中…",
  "wallet.ln.get_invoice": "获取发票",
  "wallet.ln.copy_invoice": "复制发票",
  "wallet.ln.open_wallet": "在 Lightning 钱包中打开",
  "wallet.ln.open_wallet_short": "在钱包中打开",
  "wallet.ln.waiting": "等待付款…",
  "wallet.ln.new_invoice": "创建一张新发票",
  "wallet.ln.new_invoice_short": "新发票",
  "wallet.ln.withdraw_title": "提现到 Lightning",
  "wallet.ln.scan_invoice": "扫描 Lightning 发票二维码",
  "wallet.ln.paid_from": "付款来源",
  "wallet.ln.invoice": "发票",
  "wallet.ln.routing_reserve": "路由预留",
  "wallet.ln.reserved": "从余额中预留",
  "wallet.ln.paying": "支付中…",
  "wallet.ln.get_quote": "获取报价",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "备份",
  "wallet.backup.setup_failed": "无法设置备份",
  "wallet.backup.on": "备份已开启",
  "wallet.backup.on_body":
    "现在可以用那十二个词重建你的余额。\n\n别人给你的东西在你去铸币厂刷新之前不受助记词覆盖，而且恢复时需要你的铸币厂清单，所以请把它和这些词一起记下来。",
  "wallet.backup.no_phrase": "没有存储助记词",
  "wallet.backup.no_phrase_body":
    "无法从设备钥匙串中读取恢复助记词。请解锁设备后重试。",
  "wallet.backup.replace_title": "替换你当前的助记词？",
  "wallet.backup.replace_body":
    "你已经有一组恢复助记词了。恢复另一组会把它替换掉。旧助记词已覆盖的币在这台设备上仍然可以花，但不再可恢复，所以请先确认旧的词已经抄写下来，再继续。",
  "wallet.backup.replace": "替换",
  "wallet.backup.invalid_phrase": "那组助记词无效",
  "wallet.backup.invalid_phrase_body":
    "助记词自带校验和，而这一组没有通过。请检查是否有拼错、遗漏或顺序颠倒的词。",
  "wallet.backup.not_bip39":
    "这些不是 BIP-39 词表中的词：{words}。请检查拼写。",
  "wallet.backup.add_mint_first": "请先添加铸币厂",
  "wallet.backup.add_mint_first_body":
    "恢复的原理是去问铸币厂它为你签过哪些币，所以它得知道该问哪个铸币厂。先把你用过的铸币厂加上，再恢复。",
  "wallet.backup.restore_failed": "恢复失败",
  "wallet.backup.phrase": "恢复助记词",
  "wallet.backup.state_unconfirmed": "备份已开启但未确认",
  "wallet.backup.state_off": "备份已关闭",
  "wallet.backup.badge_on": "开",
  "wallet.backup.badge_unconfirmed": "未确认",
  "wallet.backup.badge_off": "关",
  "wallet.backup.view": "查看恢复助记词",
  "wallet.backup.setup": "设置恢复助记词",
  "wallet.backup.view_short": "查看助记词",
  "wallet.backup.setup_short": "设置",
  "wallet.backup.restore": "用恢复助记词还原一个钱包",
  "wallet.backup.restore_short": "还原",
  "wallet.backup.setup_title": "设置恢复助记词",
  "wallet.backup.on_body_short": "你的余额可以用那十二个词在新设备上重建。",
  "wallet.backup.unconfirmed_body":
    "你从未确认过已经抄写副本。现在这些词只存在于这台手机上，而备份本来就是为了在手机没了之后还能用。请查看助记词并把它抄下来。",
  "wallet.backup.not_covered":
    "{amount} 尚未被覆盖。别人给你的币带着对方的秘密，只有换过一次之后才会归入你的助记词。刷新一下铸币厂即可把它们保全。",
  "wallet.backup.off_body":
    "你的 ecash 只存在于这台手机上。如果它丢了，没有人能把钱找回来，包括你自己。恢复助记词是十二个词，能在任何地方重建你的余额。",
  "wallet.backup.about_to_see": "你即将看到十二个词。它们就是钱本身。",
  "wallet.backup.exact_order":
    "十二个词，顺序必须完全一致。谁拿到它们，谁就拿到了你的余额。",
  "wallet.backup.verify_body":
    "没人抄下来的助记词比没有助记词更糟，因为它看起来像一张安全网，实际上并不存在。请确认其中两个词。",
  "wallet.backup.verify_mismatch": "对不上。请核对你抄写的副本。",
  "wallet.backup.restore_body":
    "输入这十二个词。Airhop 会重新推导出你的币，并逐一询问每个铸币厂签过其中哪些，于是余额就从铸币厂保存的记录中回来了。",
  "wallet.backup.warn_secret":
    "任何读到它们的人都能拿走你的余额。不要截屏，也不要存在这台手机上。",
  "wallet.backup.warn_paper":
    "把它们写在纸上，收在安全的地方。如果手机没了，Airhop 无法再把它们显示给你。",
  "wallet.backup.warn_scope":
    "它们只能重建你的 ecash。你的身份、聊天和联系人不在覆盖范围内。",
  "wallet.backup.warn_mints":
    "恢复必须去问铸币厂它签过哪些币，所以请把你的铸币厂清单和这些词写在一起。",
  "wallet.backup.preparing": "准备中…",
  "wallet.backup.show_phrase": "显示我的助记词",
  "wallet.backup.your_phrase": "你的恢复助记词",
  "wallet.backup.write_down": "把这些抄下来",
  "wallet.backup.copy_phrase": "把恢复助记词复制到剪贴板",
  "wallet.backup.copy_clipboard": "复制到剪贴板",
  "wallet.backup.written_down": "我已经抄下来了",
  "wallet.backup.check_copy": "核对你的副本",
  "wallet.backup.confirm": "确认",
  "wallet.backup.restore_title": "用助记词还原",
  "wallet.backup.phrase_placeholder": "十二个词，用空格分隔",
  "wallet.backup.no_mints_yet":
    "还没有添加铸币厂。恢复必须去问某个具体的铸币厂，所以请先把你用过的加上。",
  "wallet.backup.scanning": "扫描中…",
  "wallet.backup.restore_progress": "{mint} · 密钥集 {step}/{total}",
  "wallet.backup.will_scan":
    "将扫描：{mints}。没有添加过的铸币厂永远不会被问到，所以那里的余额是看不见的。",
  "wallet.backup.word_n": "第 {position} 个词",
  "wallet.backup.unreachable_mints":
    "无法连接：{mints}。那里的余额仍然在。等网络好一些时再试。",
  "wallet.backup.nothing_recovered": "从扫描过的铸币厂中没有恢复出任何东西。",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "标记为已收到？",
  "wallet.delivered.body":
    "这会永久释放 {amount} {unit}。如果它其实从未送到，你将无法再收回。",
  "wallet.delivered.body_generic":
    "这会永久释放预留的金额。如果它其实从未送到，你将无法再收回。",
  "wallet.delivered.cancel": "还不行",
  "wallet.delivered.confirm": "对方收到了",
  "wallet.reclaim.title": "收回这个代币？",
  "wallet.reclaim.body":
    "这 {amount} {unit} 会回到你的余额。只有在代币确实没到任何人手上时才这么做：如果对方已经拿到了那串字符，谁先在铸币厂兑付谁就拿走这笔钱，而那有可能是对方。",
  "wallet.reclaim.keep": "保持待处理",
  "wallet.reclaim.confirm": "收回",
  "wallet.copied.token_body":
    "代币已在你的剪贴板上。在你标记为已送达之前它一直预留在这里，所以第一次没成的话可以再粘贴一次。",
  "wallet.copied.phrase_body":
    "把它粘进密码管理器，然后清空剪贴板。其他应用能读取剪贴板，而且在有些设置下它还会同步到你的其他设备。",
  "wallet.refresh.failed": "刷新失败",
  "wallet.refresh.partly": "部分刷新",
  "wallet.refresh.done": "已刷新",
  "wallet.refresh.unreachable": "无法连接 {mints}。其余部分都是最新的。",
  "wallet.refresh.swapped": "{amount} {unit} 已确认并换成了新的凭证。",
  "wallet.refresh.secured": "{amount} {unit} 现在已被你的恢复助记词覆盖。",
  "wallet.refresh.all_confirmed": "这里的一切都已经与铸币厂确认过了。",
  "wallet.pending.title": "待处理",
  "wallet.pending.reserved_desc":
    "已构建并预留，送达未确认。这些凭证被从你的余额中扣住，以免被花两次。",
  "wallet.pending.locked_desc":
    "已经锁定到接收方的密钥上，所以只有对方能花。只是还没送到对方手上。分享这个代币即可完成。",
  "wallet.pending.show_qr": "把这个代币显示为二维码",
  "wallet.pending.copy_again": "再复制一次代币",
  "wallet.pending.share_again": "再分享一次代币",
  "wallet.pending.mark_delivered": "把这个代币标记为已送达",
  "wallet.pending.delivered": "已送达",
  "wallet.pending.reclaim_into": "把这个代币收回你的余额",
  "wallet.activity.title": "动态",
  "wallet.activity.none": "还没有内容",
  "wallet.activity.none_desc":
    "你发出和收到的付款会显示在这里，最新的在前，并附上各自的铸币厂和手续费。",
  "wallet.activity.show_fewer": "少显示一些付款",
  "wallet.activity.show_less": "收起",
  "wallet.activity.received_unconfirmed": "已收到，未确认",
  "wallet.activity.received": "已收到",
  "wallet.activity.receive_failed": "接收失败",
  "wallet.activity.reclaimed": "已收回",
  "wallet.activity.send_failed": "发送失败",
  "wallet.activity.sent": "已发送",
  "wallet.activity.status_pending": "待处理",
  "wallet.activity.status_failed": "失败",
  "wallet.activity.status_reclaimed": "已收回",
  "wallet.activity.status_expired": "已过期",
  "wallet.activity.ln_deposit": "Lightning 存入",
  "wallet.activity.ln_withdrawal": "Lightning 提现",
  "wallet.activity.nutzap_received": "收到 Nutzap",
  "wallet.activity.spent_removed": "已花费的凭证被移除",
  "wallet.activity.refreshed": "凭证已刷新",
  "wallet.activity.refreshing": "正在刷新凭证",
  "wallet.activity.just_now": "刚刚",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "网状网络已离线",
  "wallet.mesh_offline_body":
    "网状网络服务没有在运行，所以没有地方可以把代币交出去。它会留在待处理里保持预留。",
  "wallet.xfer.route_mesh": "已通过网状网络直接交到对方设备上。",
  "wallet.xfer.route_nostr": "对方不在蓝牙范围内，所以改走了互联网。",
  "wallet.xfer.route_courier":
    "现在没有通往对方的路径。它会由其他设备捎带，等某台设备遇到对方时送达。",
  "wallet.xfer.route_queued":
    "现在还联系不上对方。它已排队，等对方可达时立刻发出。",
  "wallet.xfer.mesh_offline_body":
    "网状网络服务没有在运行，所以没有办法把代币交出去。没有扣除任何金额。",
  "wallet.xfer.could_not_send": "无法发送",
  "wallet.xfer.inexact_body":
    "你的凭证在离线状态下凑不出正好 {amount} {unit}。能构建的最小代币是 {spend} {unit}，多出的 {extra} {unit} 会归对方，并且要不回来。\n\n联网时在铸币厂刷新一次，会把你的凭证拆成能凑出这个精确金额的面额。",
  "wallet.xfer.send_amount": "发送 {amount}",
  "wallet.xfer.mesh_offline": "网状网络已离线",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "已锁定到对方的密钥并发布到 Nostr。不管对方在不在线，它都属于对方。",
  "wallet.pay.rail_nutzap_dm":
    "已锁定到对方的密钥。中继不肯收，所以它改以消息的形式发给了对方。",
  "wallet.pay.rail_nutzap_undelivered":
    "已锁定到对方的密钥，但还没有东西能把它带过去。它已排队，代币在待处理里。",
  "wallet.pay.final": "已锁定的付款无法收回：现在只有对方的密钥能花这些币。",
  "wallet.pay.reclaimable": "在你确认它已送达之前，都可以从钱包标签页收回。",
  "wallet.pay.why": "之所以走这条路，是因为{reason}。",
  "wallet.pay.sent_title": "{amount} {unit} 给 {name}",
  "wallet.pay.thread_receipt": "你发出了 {amount} {unit}，已锁定到对方的密钥。",
  "wallet.pay.title": "发送 ecash",
  "wallet.pay.to": "给 {name}",
  "wallet.pay.amount": "金额（sat）",
  "wallet.pay.memo": "备注（可选，公开）",
  "wallet.pay.send": "发送",
  "wallet.pay.sending": "发送中…",
  "wallet.pay.action": "发送 ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "相机访问权限",
  "wallet.scan.camera_purpose": "扫描 ecash 二维码",
  "wallet.scan.photo_label": "照片访问权限",
  "wallet.scan.photo_purpose": "从图片中读取 ecash 二维码",
  "wallet.scan.no_token": "那张图里没有找到 ecash 代币。",
  "wallet.scan.no_invoice": "那张图里没有找到 Lightning 发票。",
  "wallet.scan.unreadable": "无法读取那张图。",
  "wallet.scan.camera_failed": "无法启动相机。请关闭其他相机应用后重试。",
  "wallet.scan.close": "关闭扫描器",
  "wallet.scan.on_device": "它在这台设备上读取；任何内容都不会发往别处。",
  "wallet.scan.aim_token": "对准一个 ecash 二维码。",
  "wallet.scan.aim_invoice": "对准一个 Lightning 发票二维码。",
  "wallet.scan.title_token": "扫描 ecash",
  "wallet.scan.title_invoice": "扫描发票",
  "wallet.scan.desc_token":
    "读取来自另一个钱包的 Cashu 代币。适用于任何 Cashu 钱包，不限于 Airhop。",
  "wallet.scan.desc_invoice": "读取一张 Lightning 发票，用你的余额支付它。",
  "wallet.scan.use_camera_a11y": "用相机扫描",
  "wallet.scan.use_camera": "使用相机",
  "wallet.scan.pick_image_a11y": "从已保存的图片中读取二维码",
  "wallet.scan.pick_image": "从照片中选取",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu 是什么？",
  "wallet.explain.intro":
    "Cashu 是比特币的 ecash。代币是一串字符，谁拿着它就等于拿着钱，它由铸币厂盲签，因此铸币厂分不出是谁花了哪一笔。没有账户，也不用登录。",
  "wallet.explain.send": "发送",
  "wallet.explain.send_desc":
    "把一笔金额变成代币，可以通过蓝牙交给附近的节点，也可以当作文本分享。无需互联网。在你确认它已到手之前，凭证一直保持预留。",
  "wallet.explain.receive": "接收",
  "wallet.explain.receive_desc":
    "粘贴一个代币即可入账。联网时它会立刻在铸币厂换新，从而可被证明属于你。离线时它会被存下并标为未确认，直到你刷新。",
  "wallet.explain.zap": "打闪",
  "wallet.explain.zap_desc":
    "向一个 Nostr 身份付款。如果对方公布了 NIP-61 nutzap 信息，这笔 ecash 会锁定到对方的密钥上，只有对方能花。否则会退回到加密私信的方式。需要互联网。",
  "wallet.explain.add_mint": "添加铸币厂",
  "wallet.explain.add_mint_desc":
    "保存发行和兑付你 ecash 的铸币厂，并缓存它的公钥，好让来自它的代币能够离线核验。请选一个你愿意托付这笔余额的铸币厂。",
  "wallet.explain.phrase": "恢复助记词",
  "wallet.explain.phrase_desc":
    "你的币是从钱包一开始生成的十二个词推导出来的，所以一台新手机可以通过询问你的铸币厂签过哪些币来重建余额。在你查看并抄下它们之前，它们只存在于这台手机上。",

  // ---- Wallet: failures ----
  "wallet.err.locked": "钱包已锁定",
  "wallet.err.mint_unreachable": "铸币厂无法连接",
  "wallet.err.tor_blocked": "Tor 开启期间被拦截",
  "wallet.err.insufficient": "余额不足",
  "wallet.err.exact_amount": "发不出这个精确金额",
  "wallet.err.no_mint": "没有铸币厂",
  "wallet.err.mint_unsupported": "铸币厂做不到这一点",
  "wallet.err.mint_refused": "铸币厂拒绝了",
  "wallet.err.unreadable": "无法读取的代币",
  "wallet.err.rejected": "代币被拒绝",
  "wallet.err.already_spent": "已被花费",
  "wallet.err.change_pending": "已支付，找零待返还",
  "wallet.svc.mint_unreachable": "无法连接到铸币厂。",
  "wallet.svc.tor_ios": "在 iOS 上，铸币厂请求不走 Tor。",
  "wallet.svc.tor_ios_body":
    "Arti 只包裹 Nostr 的 WebSocket，所以这个请求会走明网到达铸币厂，把你的 IP 和这些凭证关联起来。可以在设置 > 安全里允许它，或者先关掉 Tor。通过网状网络收发 ecash 仍然可用。",
  "wallet.svc.tor_paused": "Tor 已开启但没有连上。",
  "wallet.svc.tor_paused_body":
    "Orbot 已经停止转发，所以这个请求会走明网到达铸币厂，把你的 IP 和这些凭证关联起来。可以重新启动 Orbot，或者关掉 Tor。通过网状网络收发 ecash 仍然可用。",
  "wallet.svc.keys_uncached": "这个铸币厂的密钥没有缓存在这台设备上。",
  "wallet.svc.keys_uncached_body": "联网时打开一次钱包即可取回它们。",
  "wallet.svc.phrase_invalid": "那组恢复助记词无效。",
  "wallet.svc.phrase_invalid_body":
    "请检查是否有拼错或遗漏的词。助记词自带校验和，所以只要错一个词，整组就无效。",
  "wallet.svc.need_mint": "请先添加至少一个铸币厂。",
  "wallet.svc.need_mint_body":
    "恢复的原理是去问铸币厂它为你签过哪些币，所以它得知道该问哪个铸币厂。",
  "wallet.svc.restored": "已从恢复助记词还原",
  "wallet.svc.storage_locked": "钱包存储已锁定。",
  "wallet.svc.storage_locked_body":
    "Airhop 把 ecash 凭证保存在一个加密文件中，它的密钥存放在设备钥匙串里。请解锁设备并重新打开应用。",
  "wallet.svc.bad_url": "那不是一个有效的 URL。",
  "wallet.svc.needs_https": "铸币厂 URL 必须以 https:// 开头。",
  "wallet.svc.refuse_http": "拒绝通过明文 http 使用铸币厂。",
  "wallet.svc.refuse_http_body":
    "网络路径上的任何人都能读取或篡改你的凭证。请使用 https:// 的铸币厂。",
  "wallet.svc.mint_not_saved": "铸币厂无法保存。",
  "wallet.svc.unreadable_token": "那不是一个可读的 Cashu 代币。",
  "wallet.svc.unreadable_token_body":
    "代币以 cashuA 或 cashuB 开头。请检查复制时有没有被截断。",
  "wallet.svc.wrong_mint": "这个代币并非由它所指明的铸币厂签发。",
  "wallet.svc.already_spent": "这些凭证已经被花掉了。",
  "wallet.svc.already_spent_body":
    "发这个代币的人自己先兑付了，或者把同一个代币也发给了别人。",
  "wallet.svc.receiving_offline": "离线接收",
  "wallet.svc.amount_positive": "请输入大于零的金额。",
  "wallet.svc.coins_raced": "那些币刚刚被另一笔付款用掉了。",
  "wallet.svc.coins_raced_body": "没有扣除任何金额。再试一次，钱包会挑另一组。",
  "wallet.svc.no_ecash": "还没有 ecash。",
  "wallet.svc.no_ecash_body":
    "添加一个铸币厂并通过 Lightning 存入，或者从别人那里收一个代币。",
  "wallet.svc.split_across_mints": "你的余额分散在多个铸币厂。",
  "wallet.svc.mint_says_spent": "铸币厂报告这些凭证已被花费。",
  "wallet.svc.issue_against_invoice": "凭 Lightning 发票发行 ecash",
  "wallet.svc.pay_invoice": "支付 Lightning 发票",
  "wallet.svc.unknown_deposit": "未知的存入。",
  "wallet.svc.invoice_expired_before": "这张发票在被支付之前就过期了。",
  "wallet.svc.invoice_expired": "那张发票已过期。",
  "wallet.svc.invoice_unpaid": "这张发票还没有被支付。",
  "wallet.svc.payment_unknown": "付款状态未知；下次刷新时会再查一遍。",
  "wallet.svc.melt_change_pending": "你的发票已支付。",
  "wallet.svc.melt_change_pending_body":
    "铸币厂还没有退回没用掉的路由费。它会在下次刷新时自动领回，这期间不会有任何损失。",
  "wallet.svc.mint_did_not_pay": "铸币厂没有支付这张发票。你的余额没有变化。",
  "wallet.svc.not_an_invoice": "那不是一张 Lightning 发票。",
  "wallet.svc.not_an_invoice_body": "请粘贴以 lnbc 开头的 bolt11 发票。",
  "wallet.svc.insufficient_for_invoice": "余额不足以支付这张发票。",
  "wallet.svc.coins_raced_invoice_body":
    "没有扣除任何金额，发票也没有被支付。请再试一次。",
  "wallet.svc.same_mint": "请选一个不同的目标铸币厂。",
  "wallet.svc.same_mint_body":
    "来源和目标是同一个铸币厂，所以没有什么可转移的。",
  "wallet.svc.quote_failed_retried": "报价失败，已重试归拢",
  "wallet.svc.amount_unfit_retried": "金额不合适，已重试归拢",
  "wallet.svc.cannot_size": "无法确定这笔转移的额度。",
  "wallet.svc.insufficient_at_mint": "{mint} 的余额不足。",
  "wallet.svc.inexact_title":
    "你的凭证在离线状态下凑不出正好 {amount} {unit}。",
  "wallet.svc.inexact_detail":
    "你能发出的最小代币是 {spend} {unit}。离线是没有找零的，所以多出的 {extra} {unit} 会归接收方。",
  "wallet.svc.no_single_mint":
    "没有哪一个铸币厂单独持有 {amount} {unit}。来自不同铸币厂的 ecash 无法合并成一个代币：请先在一个铸币厂归拢，或者分几笔发送。",
  "wallet.svc.have_tried_send": "你有 {total} {unit}，却想发送 {amount}。",
  "wallet.svc.invoice_needs":
    "这张发票连同路由预留共需 {total} {unit}，而你有 {balance}。",
  "wallet.svc.nothing_to_move": "{mint} 没有可转移的 {unit}。",
  "wallet.svc.consolidate_memo": "从 {mint} 归拢",
  "wallet.svc.cannot_size_detail":
    "扣掉 Lightning 路由费后，{from} 无法向 {to} 转出有意义的金额。可以试着改为转移一笔具体的小额。",
  "wallet.svc.mint_cannot": "{mint} 无法{action}。",
  "wallet.svc.no_nut": "该铸币厂没有声明支持 NUT-{nut}。",
  "wallet.svc.unknown_mint": "那笔付款指明的铸币厂你并没有在用。",
  "wallet.svc.unknown_mint_body":
    "如果你信任它，请先自己把这个铸币厂添加上；不会从你没有选择过的铸币厂兑付任何东西。",
  "wallet.svc.no_relay": "没有中继连接",
  "wallet.svc.no_shared_mint": "没有余额足够的共同铸币厂",
  "wallet.svc.no_nutzap_info":
    "接收方没有公布 nutzap 信息（NIP-61 kind 10019）",
  "wallet.svc.locked_undelivered":
    "已锁定到对方的密钥但尚未送达。从这笔交易分享代币即可完成。",
  "wallet.svc.swap_lost":
    "铸币厂始终没有完成这次换新，因此没有凭它发行任何东西。",
  "wallet.svc.swap_unreadable": "这次换新保存的格式，当前版本无法重放。",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "已通过二维码验证",
  "contacts.qr.keys_unverified": "已收到密钥，尚未验证",
  "contacts.qr.not_verified": "尚未验证",
  "contacts.qr.message": "消息",
  "contacts.qr.add": "添加联系人",
  "contacts.qr.scan_title": "扫描二维码",
  "contacts.qr.aim": "把相机对准对方的二维码",
  "contacts.qr.add_desc": "联系上那些不在网状网络附近的人。",
  "contacts.qr.peer_id_hint":
    "节点 ID 是 16 个字符。联系人代码以 airhop: 开头。",
  "contacts.qr.or_scan": "或者扫描对方的二维码",
  "contacts.qr.trust_note":
    "只有你用相机亲自扫到的二维码才算验证过对方的密钥。粘贴来的代码带着对方的密钥，却没有它确实出自对方的证明。",
  "contacts.qr.peer_id": "节点 ID 或联系人代码",
  "contacts.qr.peer_id_placeholder": "粘贴一个 ID 或联系人代码",
  "contacts.qr.scan_camera_a11y": "用相机扫描二维码",
  "contacts.qr.scan_camera_desc": "使用你的相机",
  "contacts.qr.upload_a11y": "从相册上传二维码图片",
  "contacts.qr.upload": "从相册上传",
  "contacts.qr.upload_desc": "挑一张保存过的二维码图片",
  "contacts.qr.scan_a11y": "通过扫描二维码添加联系人",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "请粘贴一个 16 个字符的节点 ID、一个 airhop://peer/… 链接，或者一个联系人代码。",
  "contacts.scan.camera_label": "相机访问权限",
  "contacts.scan.camera_purpose": "扫描联系人的二维码",
  "contacts.scan.camera_needed":
    "扫描需要相机访问权限。你仍然可以用节点 ID 添加。",
  "contacts.scan.camera_failed": "无法启动相机。请关闭其他相机应用后重试。",
  "contacts.scan.photo_label": "照片访问权限",
  "contacts.scan.photo_purpose": "扫描你保存过的二维码",
  "contacts.scan.photo_needed":
    "选取图片需要照片访问权限。你仍然可以用节点 ID 添加。",
  "contacts.scan.no_qr": "那张图里没有找到 Airhop 二维码。",
  "contacts.scan.unreadable": "无法从那张图里读出二维码。",
  "contacts.scan.bitchat_expired":
    "那个 bitchat 代码已过期。请对方重新打开自己的二维码。",
  "contacts.scan.tampered":
    "这个二维码无效：它的节点 ID 和它的密钥对不上。它可能被人动过手脚。",
  "contacts.scan.already_added": "已经在你的联系人里",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "正在等待相机访问权限…",
  "contacts.verify.camera_off": "相机已关闭",
  "contacts.verify.open_settings": "打开设置",
  "contacts.verify.verified": "已验证",
  "contacts.verify.different": "是别的联系人",
  "contacts.verify.scan_again": "再扫一次",
  "contacts.verify.failed": "无法验证",
  "contacts.verify.done": "完成",
  "contacts.verify.title": "验证 {name}",
  "contacts.verify.aim": "把相机对准对方的二维码",
  "contacts.verify.camera_off_body":
    "请在设置中开启相机访问权限，以便用二维码验证。",
  "contacts.verify.match_body": "{name} 的密钥对得上。你可以信任这位联系人。",
  "contacts.verify.different_body":
    "这个二维码属于别人。请 {name} 出示自己的代码。",
  "contacts.verify.tampered_body":
    "这个二维码看起来被动过手脚：它的 ID 和它的密钥对不上。",
  "contacts.verify.choose_title": "你想怎么核对？",
  "contacts.verify.choose_body":
    "两种方式都能确认这台手机上的密钥确实属于 {name}。",
  "contacts.verify.method_scan": "扫描对方的代码",
  "contacts.verify.method_scan_sub": "对方就在你身边",
  "contacts.verify.method_compare": "核对一段代码",
  "contacts.verify.method_compare_sub": "在通话中念给彼此听",
  "contacts.verify.no_keys":
    "这位联系人还没有密钥。给对方发条消息，或者见面时扫一下对方的代码。",
  "contacts.verify.compare_title": "把这些念给彼此听",
  "contacts.verify.compare_body":
    "{name} 看到的是同样的六个词。如果对得上，你们双方就都知道这些密钥是真的。",
  "contacts.verify.codes_match": "对得上",
  "contacts.verify.codes_differ": "对不上",
  "contacts.verify.compared_body":
    "你和 {name} 确认了同一段代码。这位联系人已验证。",

  // ---- Settings: shared chrome ----
  "settings.back": "返回",
  "settings.coming_soon": "即将推出",
  "settings.opens_externally": "{label}，在应用外打开",
  "settings.peer_id": "节点 ID",
  "settings.share_peer_id": "分享你的节点 ID",
  "settings.share_id_short": "分享 ID",
  "settings.peer_id_sheet.title": "你的节点 ID",
  "settings.peer_id_sheet.copy": "复制节点 ID",
  "settings.peer_id_sheet.note":
    "只有你们双方都在蓝牙范围内时才管用。想让别人从任何地方给你发消息，请改为分享你的二维码。",

  // ---- Settings: hub rows ----
  "settings.section.general": "通用",
  "settings.section.general_desc": "可选功能、撤回发送、媒体、重置",
  "settings.section.privacy": "隐私与安全",
  "settings.section.privacy_desc": "前向保密、签名数据包、已屏蔽的节点",
  "settings.section.network": "网络与中继",
  "settings.section.network_desc": "互联网回退、nostr 中继、bitchat 兼容",
  "settings.section.permissions": "权限",
  "settings.section.permissions_desc": "蓝牙、定位、通知、相机、麦克风",
  "settings.section.storage": "存储与数据",
  "settings.section.diagnostics": "诊断",

  // ---- Settings: group headings ----
  "settings.group.transports": "传输方式",
  "settings.group.nearby": "附近",
  "settings.group.sync": "同步",
  "settings.group.features": "功能",
  "settings.group.messages": "消息",
  "settings.group.media": "媒体",
  "settings.group.reset": "重置",
  "settings.group.always_on": "始终开启",
  "settings.group.notifications": "通知",
  "settings.group.blocked": "已屏蔽",
  "settings.group.theme": "主题",
  "settings.group.font": "字体",
  "settings.group.language": "语言",
  "settings.section.diagnostics_desc": "连接状态与附近设备",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "蓝牙链路",
  "settings.diag.ble_links_desc": "这台手机直接连着的设备",
  "settings.diag.lan": "局域网",
  "settings.diag.lan_desc": "同一 Wi-Fi 网络下的手机",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "不需要路由器的手机对手机",
  "settings.diag.wifi_active": "运行中",
  "settings.diag.wifi_unsupported": "这台设备不支持",
  "settings.diag.wifi_permission": "被某项权限拦截",
  "settings.diag.wifi_unavailable": "现在不可用",
  "settings.diag.wifi_unknown": "等待无线模块",
  "settings.diag.relays": "Nostr 中继",
  "settings.diag.relays_desc": "用于位置频道和互联网触达",
  "settings.diag.connected": "已连接",
  "settings.diag.disconnected": "未连接",
  "settings.diag.peer_direct": "直连链路",
  "settings.diag.peer_relayed": "经由另一台设备听到",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "没有信号读数",
  "settings.diag.no_peers": "范围内没有人",
  "settings.diag.no_peers_desc": "已打开 {links} 条无线链路",
  "settings.diag.gcs_size": "过滤器大小",
  "settings.diag.gcs_size_desc": "发到空中的最大同步过滤器",
  "settings.diag.fpr": "误报率",
  "settings.diag.fpr_desc": "过滤器多久会误称我们缺了某个数据包",
  "settings.diag.bytes": "{n} 字节",
  "settings.diag.footnote":
    "这里的内容都不能改。这些数值是固定的，好让 Airhop 保持与 bitchat 兼容。",
  "settings.section.storage_desc": "用量与缓存",
  "settings.section.appearance": "外观",
  "settings.section.appearance_desc": "主题、字体和语言",
  "settings.section.help": "帮助与反馈",
  "settings.section.help_desc": "联系我们、报告问题，或阅读常见问题",
  "settings.section.support": "支持",
  "settings.section.support_desc": "帮助开发持续下去",
  "settings.section.about": "关于",
  "settings.section.about_desc": "版本、更新日志和源码",

  // ---- Settings: general ----
  "settings.general.undo": "撤回发送",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "钱包",
  "settings.general.undo_seconds": "{count} 秒",
  "settings.general.undo_a11y": "撤回发送：{value}",
  "settings.general.quality_a11y": "把上传质量设为 {value}",
  "settings.general.undo_desc":
    "把发出的消息短暂扣住，好让你在它真正发出前收回",
  "settings.general.undo_off_desc": "立刻发送，不能撤回",
  "settings.general.undo_2": "2 秒",
  "settings.general.undo_2_desc": "一个快速收回的机会",
  "settings.general.undo_10": "10 秒",
  "settings.general.undo_10_desc": "最长的时间窗",
  "settings.general.quality": "上传质量",
  "settings.general.quality_desc":
    "适用于从相机或图库发出的照片。不管哪一档，每张照片都会被调整到适合网状网络的尺寸。",
  "settings.general.quality_low": "低",
  "settings.general.quality_low_desc": "照片最小，发得最快",
  "settings.general.quality_medium": "中",
  "settings.general.quality_medium_desc": "细节与速度兼顾",
  "settings.general.quality_high": "高",
  "settings.general.quality_high_desc": "保留最多细节",
  "settings.general.feature_wallet_desc": "通过网状网络点对点发送 Cashu ecash",
  "settings.general.feature_wallet_a11y": "钱包（始终开启）",
  "settings.general.feature_ai_desc": "私密的设备端助手，不发起任何网络请求",
  "settings.general.feature_feeds": "信息流",
  "settings.general.feature_feeds_desc":
    "阅读 Bluesky 和 Mastodon 的信息流并发帖",
  "settings.general.show_media": "自动显示媒体",
  "settings.general.show_media_desc":
    "照片和视频直接出现在聊天里，或者点一下才显示",
  "settings.general.reset": "重置设置",
  "settings.general.media_retention": "媒体保留时长",
  "settings.general.media_retention_desc":
    "照片、视频和语音留言会在所选时长后被删除",
  "settings.general.media_retention_sheet":
    "选择媒体在这台设备上保留多久。删掉的媒体无法恢复。",
  "settings.general.retention_7_desc":
    "留下的痕迹最少。如果风险来自手机本身，这一档最合适。",
  "settings.general.retention_14_desc": "折中选择，适合一两周没有信号的情况。",
  "settings.general.retention_30_desc":
    "对话可读的时间最长，占用的磁盘也最多。",
  "settings.general.reset_desc":
    "把每一项偏好设置恢复为默认值，你的身份、消息、联系人和钱包都不受影响",
  "settings.general.reset_title": "重置设置？",
  "settings.general.reset_body":
    "每一项偏好设置都会恢复默认：外观、撤回发送，以及连接相关项（互联网、Tor、网关、桥接、中继）。你的身份、消息、联系人和钱包不受影响。",
  "settings.general.reset_confirm": "重置",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "前向保密",
  "settings.security.forward_secrecy_desc": "私信始终启用 Double Ratchet",
  "settings.security.signed_packets": "签名数据包",
  "settings.security.signed_packets_desc": "每个数据包都经 Ed25519 签名",
  "settings.security.hide_previews": "隐藏通知预览",
  "settings.security.hide_previews_desc":
    "不让发件人和消息出现在锁屏上，因为锁屏不解锁就能看到它们",
  "settings.security.no_blocked": "没有被屏蔽的节点",
  "settings.security.no_blocked_desc":
    "被屏蔽的节点不能给你发消息，也不会出现在网状网络标签页",
  "settings.security.unblock_title": "解除屏蔽这个节点",
  "settings.security.unblock": "解除屏蔽",
  "settings.security.unblock_peer": "解除屏蔽 {name}",
  "settings.security.unblock_body":
    "{name} 将可以再次给你发消息，在附近时也会重新出现在网状网络标签页。",

  // ---- Settings: network and relays ----
  "settings.network.internet": "互联网回退",
  "settings.network.internet_desc":
    "当网状网络节点不在范围内时，改由 Nostr 中继继续",
  "settings.network.internet_off_title": "关闭互联网？",
  "settings.network.internet_off_body":
    "Airhop 将只走蓝牙。它会停止联系任何 Nostr 中继，Tor、互联网网关和网状网络桥接也都会关闭。附近的蓝牙聊天照常可用。",
  "settings.network.turn_off": "关闭",
  "settings.network.discovery": "地理中继发现",
  "settings.network.discovery_desc":
    "从 300 多个分布式中继中，为某个位置网格自动选出最近的那些",
  "settings.network.discovery_needs_relay": "请先添加一个自定义中继",
  "settings.network.discovery_needs_relay_body":
    "正是自动发现在为 Airhop 指出最近的中继。只有当你在下面固定了自己的中继之后，关掉它才说得通，所以请先至少加一个。",
  "settings.network.custom_only_title": "只使用你的自定义中继？",
  "settings.network.custom_only_body":
    "位置频道和网状网络桥接将不再自动选取最近的中继，只用你添加的那些。这可能会缩小覆盖范围，而且你可能再也遇不到 bitchat 用户，因为他们都汇聚在最近的中继上。",
  "settings.network.custom": "自定义中继",
  "settings.network.custom_desc": "为位置频道和网状网络桥接添加你自己的中继",
  "settings.network.custom_added": "已添加 {count} 个，上限 {max} 个",
  "settings.network.dm_relays": "消息中继",
  "settings.network.dm_relays_desc":
    "私信和私密频道始终使用这些。自定义中继不会改变它们。",
  "settings.network.discovery_back_on": "地理中继发现已重新开启",
  "settings.network.discovery_back_on_body":
    "那是你最后一个自定义中继。位置频道总得有地方发布，所以 Airhop 又开始自动选取最近的中继了。",
  "settings.network.add_relay": "添加中继",
  "settings.network.remove_relay": "移除 {url}",
  "settings.network.add_short": "添加",
  "settings.network.relay_limit":
    "你最多能添加 {count} 个中继。先移除一个才能再加。",
  "settings.network.relay_duplicate": "那个中继已经在你的列表里了。",
  "settings.network.relay_invalid":
    "请输入有效的中继主机名，例如 relay.example.com。只有当中继不使用默认端口时才需要写端口。不允许使用 IP 地址和本地名称。",
  "settings.network.bitchat": "bitchat 兼容",
  "settings.network.bitchat_desc":
    "与 bitchat 使用同一套 BLE 网状网络，完全互通。这一项始终开启，无法关闭。",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "后台运行",
  "settings.conn.background_desc": "关掉 Airhop 后让网状网络继续运行",
  "settings.conn.background_on_title": "让网状网络继续运行？",
  "settings.conn.background_on_body":
    "Airhop 在关闭后仍会继续中继和接收，所以你不在时消息也能送到。运行期间 Android 会显示一条常驻通知。",
  "settings.conn.background_off_title": "Airhop 关闭时停止网状网络？",
  "settings.conn.background_off_body":
    "只有 Airhop 打开时消息才会送达，这台手机也不再为附近的人做中继。那条常驻通知会消失。",
  "settings.conn.live_voice": "实时语音",
  "settings.conn.live_voice_desc": "像对讲机一样和附近的人说话",
  "settings.conn.live_voice_on_title": "开启实时语音？",
  "settings.conn.live_voice_on_body":
    "按住麦克风时，你说的话会边说边发给蓝牙范围内的每个人，他们的声音也会在你手机上播放。什么都不会被录下来。",
  "settings.conn.live_voice_off_title": "关闭实时语音？",
  "settings.conn.live_voice_off_body":
    "按住麦克风会改为录一条语音留言。松手后才发出，别人不点开就听不到。",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor 路由",
  "settings.conn.tor_desc": "把 Nostr 流量经 Tor 转发，进一步保护隐私",
  "settings.conn.tor_on_title": "把 Nostr 流量经 Tor 转发？",
  "settings.conn.tor_on_body":
    "中继将看不到你的 IP 地址。连接会更慢，消息也来得更慢。蓝牙不受影响。",
  "settings.conn.tor_off_title": "关闭 Tor 路由？",
  "settings.conn.tor_off_body":
    "Nostr 流量会回到你的普通连接上，中继又能看到你的 IP 地址了。无论哪种方式，蓝牙都不受影响。",
  "settings.conn.tor_orbot_idle":
    "已安装 Orbot 但尚未连接。请打开 Orbot，启动它的 VPN，然后再开启这一项。",
  "settings.conn.tor_unavailable": "这个版本不支持 Tor 路由。",
  "settings.conn.tor_timeout":
    "Tor 连接已经花了一分多钟。它会保持开启并继续尝试；网状网络标签页会告诉你它何时开始转发，或者这个网络是否在拦截它。",
  "settings.conn.tor_failed": "无法启动 Tor。请确认应用有网络访问权限。",
  "settings.conn.mint_clearnet": "允许铸币厂流量走明网",
  "settings.conn.mint_clearnet_desc":
    "iOS 上的 Tor 只覆盖 Nostr。保持关闭即可拦截铸币厂请求；无论如何，通过网状网络收发 ecash 都照常可用。",
  "settings.conn.gateway": "互联网网关",
  "settings.conn.gateway_desc":
    "把你的连接借给附近离线的手机，让它仍然能连上位置频道",
  "settings.conn.gateway_on_title": "开启互联网网关？",
  "settings.conn.gateway_on_body":
    "附近没有自己连接的手机，会通过你的连接收发位置频道消息。这会用到你的移动数据和电量，而他们的消息始终端到端加密，所以你读不到经过的内容。",
  "settings.conn.gateway_off_title": "关闭互联网网关？",
  "settings.conn.gateway_off_body":
    "附近离线的手机将不再通过你的连接访问位置频道。你自己的消息不受影响。",
  "settings.conn.bridge": "网状网络桥接",
  "settings.conn.bridge_desc":
    "通过互联网，把这片区域的公开 #bluetooth 聊天和另一群超出蓝牙范围的人连起来",
  "settings.conn.bridge_on_title": "开启网状网络桥接？",
  "settings.conn.bridge_on_body":
    "你在公开 #bluetooth 里的消息会通过互联网发布到你所在的社区，所以蓝牙范围之外的人也能读到。私密消息永远不会被桥接，而“仅限附近”能让某一条消息留在本地。",
  "settings.conn.bridge_off_title": "关闭网状网络桥接？",
  "settings.conn.bridge_off_body":
    "你在公开 #bluetooth 里的消息又只留在蓝牙范围内，桥接那一头的消息也不会再传到这里。",
  "settings.conn.bridge_needs_location": "网状网络桥接需要定位",
  "settings.conn.bridge_needs_location_desc":
    "它靠一次定位来确定你所在的社区。授予定位权限即可开始桥接。",
  "settings.conn.grant_location": "授予定位权限",
  "settings.conn.grant_short": "授予",
  "settings.conn.orbot_body":
    "Airhop 通过 Orbot 转发 Tor 流量。请从 Play 商店安装并启用 Orbot，然后再开启这一项。",
  "settings.conn.internet_off": "互联网已关闭",
  "settings.conn.internet_off_desc":
    "Tor、桥接和网关都要用互联网。请在网络里开启互联网回退才能使用它们。",
  "settings.conn.turn_on": "开启",
  "settings.conn.turn_off": "关闭",
  "settings.conn.orbot_title": "Android 上的 Tor",
  "settings.conn.get_orbot": "获取 Orbot",
  "settings.conn.later": "稍后",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "蓝牙",
  "settings.permissions.bluetooth_desc":
    "用于发现附近设备并在它们之间中继消息。没有它，网状网络就无法运作。",
  "settings.permissions.location": "定位",
  "settings.permissions.location_desc":
    "用于打开附近的区域频道。没有它，那些频道会保持关闭，蓝牙网状网络照常运作。",
  "settings.permissions.notifications": "通知",
  "settings.permissions.notifications_desc":
    "即使应用已关闭也能收到新消息提醒。没有它，你只有打开 Airhop 时才看得到。",
  "settings.permissions.camera": "相机",
  "settings.permissions.camera_desc":
    "用于扫描二维码、拍摄照片或视频来发送。没有它，你仍然可以从图库分享媒体。",
  "settings.permissions.photos": "照片",
  "settings.permissions.photos_desc":
    "用于从图库发送照片并保存收到的媒体。没有它，你仍然可以用相机现拍现发。",
  "settings.permissions.microphone": "麦克风",
  "settings.permissions.microphone_desc":
    "用于录制和发送语音消息，或使用实时语音。没有它，语音消息和实时语音都用不了。",
  "settings.permissions.allow": "允许该权限",
  "settings.permissions.open_settings": "打开系统设置以更改该权限",
  "settings.permissions.system": "系统",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "网络用量",
  "settings.storage.storage_usage": "存储用量",
  "settings.storage.storage_usage_desc": "消息、钱包凭证和缓存的附件",
  "settings.storage.session_usage": "本次会话 · 发送 {sent}，接收 {received}",
  "settings.storage.cache": "缓存",
  "settings.storage.cache_desc": "{size} 的附件",
  "settings.storage.clear_cache": "清除附件缓存",
  "settings.storage.clear": "清除",
  "settings.storage.clear_title": "清除缓存的媒体？",
  "settings.storage.clear_body":
    "照片、视频、语音留言和文件都会从这台设备上移除，收到的和发出的一样。它们无法再次下载：气泡里会写明这一点，你可以请发送方重发。消息和钱包不受影响。",
  "settings.storage.cleared": "缓存已清除",
  "settings.storage.freed": "释放了 {size}。",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "把外观设为 {value}",
  "settings.font.set_a11y": "把等宽字体设为 {value}",
  "settings.font.system": "系统",
  "settings.font.system_desc": "使用你设备的默认等宽字体",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "现代，易读",
  "settings.language.en": "英语",
  "settings.language.am": "阿姆哈拉语",
  "settings.language.ar": "阿拉伯语",
  "settings.language.bn": "孟加拉语",
  "settings.language.my": "缅甸语",
  "settings.language.zh_hans": "中文（简体）",
  "settings.language.zh_hant": "中文（繁体）",
  "settings.language.nl": "荷兰语",
  "settings.language.fil": "菲律宾语",
  "settings.language.fr": "法语",
  "settings.language.ka": "格鲁吉亚语",
  "settings.language.de": "德语",
  "settings.language.hi": "印地语",
  "settings.language.id": "印尼语",
  "settings.language.it": "意大利语",
  "settings.language.ja": "日语",
  "settings.language.ko": "韩语",
  "settings.language.mg": "马达加斯加语",
  "settings.language.ms": "马来语",
  "settings.language.ne": "尼泊尔语",
  "settings.language.fa": "波斯语",
  "settings.language.pl": "波兰语",
  "settings.language.pt_br": "葡萄牙语（巴西）",
  "settings.language.pt_pt": "葡萄牙语（葡萄牙）",
  "settings.language.pa": "旁遮普语",
  "settings.language.ru": "俄语",
  "settings.language.es": "西班牙语",
  "settings.language.sw": "斯瓦希里语",
  "settings.language.sv": "瑞典语",
  "settings.language.ta": "泰米尔语",
  "settings.language.th": "泰语",
  "settings.language.tr": "土耳其语",
  "settings.language.uk": "乌克兰语",
  "settings.language.ur": "乌尔都语",
  "settings.language.vi": "越南语",
  "settings.language.pseudo": "伪语言环境",
  "settings.language.soon": "即将推出",
  "settings.language.soon_a11y": "{value}，即将推出",
  "settings.language.set_a11y": "把语言设为 {value}",
  "settings.language.pending": "下次打开时生效",
  "settings.language.pending_a11y": "{value}，将在你下次打开 Airhop 时生效",
  "settings.language.rtl_title": "重新打开 Airhop 以完成切换",
  "settings.language.rtl_body":
    "{value} 是从右往左读的，而 Airhop 只能在启动时改变方向。请关掉再打开一次以完成切换。什么都不会丢失，在此之前你的网状网络也保持连接。",
  "settings.theme.light": "浅色",
  "settings.theme.light_desc": "始终使用浅色配色",
  "settings.theme.dark": "深色",
  "settings.theme.dark_desc": "始终使用深色配色",

  // ---- Settings: profile and identity ----
  "settings.status.online": "在线",
  "settings.status.online_desc": "可被发现，正在广播和扫描",
  "settings.status.away": "离开",
  "settings.status.away_desc": "网状网络已暂停，不扫描也不广播",
  "settings.status.invisible": "隐身",
  "settings.status.invisible_desc": "正在扫描，但不会被发现",
  "settings.status.title": "状态",
  "settings.status.set_a11y": "把状态设为 {value}",
  "settings.status.edit": "编辑状态",
  "settings.status.desc": "选择你在网状网络上有多显眼。",
  "settings.transfer.identity": "身份与密钥",
  "settings.transfer.identity_desc": "你的节点 ID、用户名和联系人",
  "settings.transfer.chats": "聊天与历史记录",
  "settings.transfer.chats_desc": "对话、群组，以及你加入过的频道",
  "settings.transfer.wallet": "钱包余额",
  "settings.transfer.wallet_desc": "Cashu 凭证与交易记录",
  "settings.transfer.title": "转移到新手机",
  "settings.transfer.desc": "把你的身份、聊天和钱包搬到另一台设备",
  "settings.transfer.coming_soon_a11y": "转移到新手机，即将推出",
  "settings.transfer.body":
    "把两台手机靠在一起，通过蓝牙把所有内容搬过去。不经过任何服务器，所以没有互联网也能用。",
  "settings.qr.permission_label": "照片访问权限",
  "settings.qr.permission_purpose": "保存你的二维码",
  "settings.qr.saved": "已保存",
  "settings.qr.saved_body": "二维码已保存到你的照片图库。",
  "settings.qr.save_failed": "无法保存",
  "settings.qr.save_failed_body": "二维码无法保存。请再试一次。",
  "settings.qr.share_message": "在 Airhop 上加我",
  "settings.qr.share_body": "在 Airhop 上加我 — 离线优先的私密网状网络通信。",
  "settings.qr.show_short": "显示二维码",
  "settings.qr.title": "你的二维码",
  "settings.qr.note":
    "它包含你的公钥，别人凭它就能从任何地方给你发消息。只分享给你信任的人。除非你抹除自己的身份，否则它不会变。",
  "settings.qr.code_label": "联系人代码",
  "settings.qr.copy_code": "复制联系人代码",
  "settings.qr.share": "分享二维码",
  "settings.qr.share_short": "分享二维码",
  "settings.qr.download": "下载二维码",
  "settings.qr.download_short": "下载二维码",
  "settings.qr.show": "显示二维码",
  "settings.wipe.trigger": "触发紧急抹除",
  "settings.wipe.trigger_desc": "连点三下立即抹除，不再确认",
  "settings.wipe.title": "紧急抹除",
  "settings.wipe.now": "立即抹除",
  "settings.wipe.desc": "立刻销毁所有密钥、消息和凭证",
  "settings.wipe.body":
    "这会立刻销毁你所有的密钥、消息和钱包凭证。此操作无法撤销。",
  "settings.wipe.in_progress": "抹除中",
  "settings.wipe.in_progress_body":
    "正在销毁你的密钥、消息和文件。这需要几秒钟，即使应用被关掉也会自己完成。",
  "settings.wipe.got_it": "知道了",
  "settings.wipe.keys_failed": "密钥无法销毁",
  "settings.wipe.keys_failed_body":
    "你的消息、联系人和钱包都已清除，但设备拒绝释放你的密钥。请解锁设备后再抹除一次。",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "联系我们",
  "settings.help.contact_a11y": "发邮件到 {address}",
  "settings.help.bug": "报告问题",
  "settings.help.bug_desc": "在 GitHub 上提一个 issue",
  "settings.help.bug_a11y": "在 GitHub 上报告问题",
  "settings.help.faq": "常见问题",
  "settings.help.faq_desc": "常见疑问的解答",
  "settings.help.faq_a11y": "打开常见问题",
  "settings.help.terms_desc": "Airhop 可以怎样使用",
  "settings.help.terms_a11y": "打开服务条款",
  "settings.help.privacy_desc": "我们不收集什么",
  "settings.help.privacy_a11y": "打开隐私政策",

  // ---- Settings: support ----
  "settings.support.card": "银行卡或 UPI",
  "settings.support.card_desc": "网银和电子钱包，全球通用",
  "settings.support.card_a11y": "用银行卡、UPI、网银或电子钱包支持",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "按月或一次性，平台不抽成",
  "settings.support.sponsors_a11y": "通过 GitHub Sponsors 支持",
  "settings.support.note":
    "我利用业余时间开发 Airhop。没有投资人，也没有广告。如果它对你有用，一份贡献能让开发持续下去。无论如何，每一项功能都会一直免费。",

  // ---- Settings: about and version ----
  "settings.about.version": "版本",
  "settings.about.version_desc": "当前发行版",
  "settings.about.version_a11y": "查看版本并检查更新",
  "settings.about.release_notes": "发行说明",
  "settings.about.release_notes_desc": "最新版本有哪些新东西",
  "settings.about.release_notes_a11y": "在 GitHub 上打开最新的发行说明",
  "settings.about.source": "源代码",
  "settings.about.source_a11y": "在 GitHub 上打开源代码",
  "settings.about.licenses": "开源许可",
  "settings.about.open_repo": "打开 {name} 仓库",
  "settings.about.licenses_desc": "第三方开源软件包",
  "settings.about.licenses_a11y": "查看第三方许可",
  "settings.version.codename": "代号",
  "settings.version.checking": "检查中",
  "settings.version.check": "检查更新",
  "settings.version.checking_title": "正在检查更新",
  "settings.version.up_to_date": "你用的已经是最新版本。",
  "settings.version.release_notes": "查看发行说明",
  "settings.version.made_with": "用",
  "settings.version.number": "版本 {version}",
  "settings.version.update_to": "更新到 {version}",
  "settings.version.update_to_a11y": "更新到版本 {version}",
  "settings.version.released_under": "以 {license} 发布",
  "settings.version.notes_a11y": "查看 {version} 版的发行说明",
  "settings.version.tor_paused":
    "Tor 开启期间会暂停检查更新，以免泄露你的 IP。请在浏览器里查看发行页面。",
  "settings.version.check_failed": "无法检查更新。请检查你的网络连接后重试。",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind}有 {size} KiB，超过了 {cap} KiB 的上限。",
  "transfer.failed.malformed":
    "一个附件到达时已损坏，无法打开。请对方重新发一次。",
  "transfer.failed.unsupported_type":
    "一个附件到达了，但它的格式这个应用打不开。",
  "transfer.failed.type_mismatch":
    "一个附件被拒收：它的内容和它声称的文件类型对不上。",
  "transfer.failed.storage": "一个附件到达了，但无法保存。请检查可用空间。",
  "transfer.badge.waiting": "等待中 · {name}",
  "transfer.badge.active_count": "{count} 项传输",
  "transfer.badge.sending": "正在发送{name}",
  "transfer.badge.receiving": "正在接收{name}",
  "transfer.badge.a11y": "{label}，{percent}%。打开对话。",
  "transfer.kind.photo": "照片",
  "transfer.kind.video": "视频",
  "transfer.kind.voice": "语音留言",
  "transfer.this.photo": "这张照片",
  "transfer.this.video": "这段视频",
  "transfer.this.voice": "这条语音留言",
  "transfer.this.file": "这个文件",
  "transfer.kind.document": "文档",
  "transfer.kind.voice_preview": "语音留言",
  "transfer.kind.photo_preview": "照片",
  "transfer.kind.video_preview": "视频",
  "transfer.kind.document_preview": "文档",

  // ---- System notifications ----
  "notif.channel.messages": "消息",
  "notif.channel.nearby": "附近的节点",
  "notif.channel.nearby_desc": "网状网络在蓝牙范围内找到人时，偶尔发一条提示。",
  "notif.nearby.body": "现在就在蓝牙范围内。点按可打开网状网络。",
  "notif.channel_message": "{sender}：{preview}",
  "notif.someone": "某人",
  "notif.notice_urgent": "紧急公告 · {content}",
  "notif.notice": "公告 · {content}",
  "notif.incoming_file": "有文件传来",
  "notif.preview.photo": "📷 照片",
  "notif.preview.voice": "🎤 语音消息",
  "notif.preview.video": "🎥 视频",
  "notif.preview.document": "📄 文档",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "新消息",
  "notif.hidden.channel": "有新动态",
  "notif.hidden.mention": "有人提到了你",
  "notif.mention.title": "{sender} 提到了你",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "再显示 {count} 个",
  },
  "chat.channels.show_more_a11y": {
    other: "再显示 {count} 个默认频道",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}，{count} 条未读",
  },
  "a11y.new_count": {
    other: "{label}，{count} 条新的",
  },
  "chat.a11y.unread": {
    other: "{count} 条未读",
  },
  "chat.thread.length_left": {
    other: "还剩 {count}",
  },
  "settings.general.retention_days": {
    other: "{count} 天",
  },
  "chat.info.group_reach": {
    other: "{count} 位成员中有 {reachable} 位可以触达",
  },
  "chat.group_members": {
    other: "私密群组  ·  {count} 位成员",
  },
  "chat.select.count": {
    other: "已选择 {count} 条",
  },
  "chat.select.forward": {
    other: "转发 {count} 条消息",
  },
  "chat.voice.live_speaking_count": {
    other: "{count} 人正在说话",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "范围内有 {count} 个节点",
  },
  "mesh.peer.hops_away": {
    other: "隔 {count} 跳",
  },
  "chat.presence.active": {
    other: "{count} 位活跃",
  },
  "chat.presence.nearby": {
    other: "{count} 位在附近",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "{count} 个铸币厂",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint} 处有 {count} 份凭证，共 {balance} {unit}。移除会把这些凭证从这台设备上永久抹掉，而且它们没有备份。请先把余额取走或发出去。",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other: "{count} 笔存入正在等待到账。每次打开应用时都会重新检查。",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "从 {mints} 恢复出 {count} 份未花费的凭证。",
  },
  "wallet.backup.already_spent": {
    other:
      "找到了 {count} 枚币，但它们已经被花掉了，所以没有为它们入账。这很正常：你花过的每一枚币，都会一直留在铸币厂保存的记录里。",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "再显示 {count} 条",
  },
  "wallet.activity.show_more_a11y": {
    other: "再显示 {count} 笔付款",
  },
  "wallet.mint.unconfirmed_count": {
    other: "{count} 份未确认",
  },
  "wallet.proof_count": {
    other: "{count} 份凭证",
  },
  "wallet.spent_removed_detail": {
    other: "有 {count} 份凭证早已被花掉，它们已被移除。",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "附近有 {count} 人",
  },
};

export const zhHans = { strings, plurals };
