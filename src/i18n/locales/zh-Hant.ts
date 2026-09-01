// zh-Hant: translated from src/i18n/locales/en.ts, which carries
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
  "common.close": "關閉",
  "common.back": "返回",
  "common.delete": "刪除",
  "common.remove": "移除",
  "common.add": "新增",
  "common.copy": "複製",
  "common.copied": "已複製",
  "common.share": "分享",
  "common.continue": "繼續",
  "common.try_again": "再試一次",
  "common.settings": "設定",
  "common.off": "關",

  // ---- Dates ----
  "format.today": "今天",
  "format.yesterday": "昨天",
  "format.minutes_ago": "{count} 分鐘前",
  "format.hours_ago": "{count} 小時前",
  "format.days_ago": "{count} 天前",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "聊天",
  "nav.tab.mesh": "網狀網",
  "nav.tab.wallet": "錢包",
  "nav.tab.profile": "我",
  "a11y.tab.new_peers": "{label}，附近有新的人",
  "nav.notifications": "通知",
  "chat.subtab.channels": "頻道",
  "chat.subtab.direct": "私訊",
  "chat.subtab.dms": "私訊",
  "chat.search.placeholder": "搜尋聊天…",
  "chat.search.a11y": "搜尋聊天與訊息",
  "chat.search.close": "關閉搜尋",
  "chat.search.clear": "清除搜尋",
  "mesh.view.radar": "雷達檢視",
  "mesh.view.list": "清單檢視",
  "mesh.view.radar_short": "雷達",
  "mesh.view.list_short": "清單",

  // ---- Legal document names ----
  "legal.last_updated": "最後更新：{date}",
  "legal.terms": "服務條款",
  "legal.privacy": "隱私權政策",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "私密的網狀網路通訊",
  "onboarding.welcome.cta": "開始使用",
  "onboarding.welcome.cta_hint": "同意下方條款才能繼續",
  "onboarding.welcome.consent_a11y": "同意服務條款和隱私權政策",
  "onboarding.welcome.open_terms": "開啟服務條款",
  "onboarding.welcome.open_privacy": "開啟隱私權政策",
  "onboarding.welcome.consent":
    "點一下{cta}即表示你同意我們的{terms}和{privacy}。",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "正在產生你的身分",
  "onboarding.identity.body":
    "正在這台裝置上建立一對 Ed25519 金鑰。\n什麼都不會送往別處。",
  "onboarding.identity.failed_heading": "無法建立你的金鑰",
  "onboarding.identity.failed_body":
    "這台裝置不讓 Airhop 安全地存放它們。請再試一次，或者重新開機後重新開啟 Airhop。",
  "onboarding.identity.steps_a11y": "步驟：{steps}",
  "onboarding.identity.step.x25519": "正在產生 X25519 靜態金鑰對",
  "onboarding.identity.step.ed25519": "正在產生 Ed25519 簽章金鑰對",
  "onboarding.identity.step.keychain": "正在把金鑰存入系統鑰匙圈",
  "onboarding.identity.step.peer_id": "正在推導節點 ID",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "你在網狀網路上的名字",
  "onboarding.username.peer_id": "節點 ID",
  "onboarding.username.card_a11y":
    "你在網狀網路上的名字是 {username}。節點 ID {peerID}。{props}。",
  "onboarding.username.explanation":
    "這個使用者名稱是由你的公鑰確定性推導出來的。在任何看得到你節點 ID 的裝置上，它都一樣。",
  "onboarding.username.cta": "進入 Airhop",
  "onboarding.username.prop.algorithm": "演算法",
  "onboarding.username.prop.storage": "存放位置",
  "onboarding.username.prop.storage_value": "僅系統鑰匙圈",
  "onboarding.username.prop.account": "需要帳戶",
  "onboarding.username.prop.account_value": "不需要",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "歡迎來到 Airhop",
  "onboarding.hello.p1":
    "你好。Airhop 是以 bitchat 為基礎打造的一個獨立開源業餘專案。它和 bitchat 專案或 permissionless tech 沒有從屬關係，也未獲其背書，只是我樂於打造並分享給社群的東西。",
  "onboarding.hello.p2":
    "這是第一個 iOS 和 Android 發行版，雖然我和朋友們一起測試過，你多半還是會遇到一些問題。如果遇到了，或者你對功能有什麼想法，我很想聽聽。可以在 {github} 上開一個 issue，或者寄電子郵件到 {email}。",
  "onboarding.hello.p3":
    "如果 Airhop 對你有用，不妨在 {github} 上給顆星，或者到{store}留個評價。這能讓更多人發現這個專案。謝謝你願意試試看！",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "在你的手機開口之前",
  "onboarding.primer.lede": "下面是每一項權限做什麼，以及不做什麼。",
  "onboarding.primer.bluetooth.title": "藍牙",
  "onboarding.primer.bluetooth.body":
    "用來找出附近裝置並在它們之間中繼訊息。網狀網路由此成形，沒有網路連線也能用。",
  "onboarding.primer.location.title": "定位",
  "onboarding.primer.location.body":
    "把你放進附近的區域頻道，小到一個街廓，大到一整個地區。Airhop 從不追蹤你，也不會把你的精確位置送出這台裝置。",
  "onboarding.primer.notifications.title": "通知",
  "onboarding.primer.notifications.body":
    "就算 App 關著也能收到新訊息提醒。通知是在你的裝置本機產生的，不經過任何伺服器。",
  "onboarding.primer.footnote":
    "你可以拒絕。訊息仍然能透過網路傳遞，你之後也可以在設定裡改變主意。",
  "onboarding.primer.cta_a11y": "繼續，進入權限詢問",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "藍牙存取權",
  "permission.bluetooth.purpose": "在網狀網路上找出附近裝置",
  "permission.open_settings": "開啟設定",
  "permission.not_now": "暫時不要",
  "permission.blocked_title": "{label}已關閉",
  "permission.blocked_body": "請在設定中開啟它，以便{purpose}。",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "出了點問題",
  "error.boundary.body":
    "Airhop 遇到了一個意外問題，不得不停下正在顯示的內容。",

  // ---- Chats: channel list ----
  "chat.channels.default": "預設頻道",
  "chat.channels.yours": "你的頻道",
  "chat.channels.none": "還沒有頻道",
  "chat.channels.none_hint": "點一下上方的 {plus} 即可加入或建立一個。",
  "chat.channels.none_desc": "還沒有頻道。用標題列的新增按鈕加入或建立一個。",
  "chat.channels.show_fewer": "少顯示一些預設頻道",
  "chat.channels.show_less": "收合",
  "chat.channels.info": "頻道資訊",
  "chat.channels.pin": "置頂頻道",
  "chat.channels.unpin": "取消置頂頻道",
  "chat.channels.mute": "靜音頻道",
  "chat.channels.unmute": "取消靜音頻道",
  "chat.channels.leave": "離開頻道",
  "chat.channels.leave_confirm": "離開",
  "chat.channels.clear_body": "刪除 {name} 裡的所有訊息？此動作無法復原。",
  "chat.channels.leave_body":
    "離開 {name}？你將不再收到它的訊息，它的歷史紀錄也會從這台裝置上移除。",
  "chat.channels.more_options": "{name} 的更多選項",
  "chat.channels.teleported_tag": "{level}  ·  遠端",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "清空聊天",
  "chat.dm.remove_contact": "移除聯絡人",
  "chat.dm.block": "封鎖這個節點",
  "chat.dm.block_confirm": "封鎖",
  "chat.dm.delete": "刪除聊天",
  "chat.dm.delete_body":
    "這會把該對話從你的清單中移除並刪除它的訊息。聯絡人會保留，對方再次傳來訊息時會開啟一段新的聊天。",
  "chat.dm.in_range": "在範圍內",
  "chat.dm.row_hint": "點兩下並按住可查看更多選項",
  "chat.channels.row_hint": "點兩下並按住可查看更多選項",
  "chat.dm.you_prefix": "你：",
  "chat.dm.none": "沒有私訊",
  "chat.dm.none_desc": "前往網狀網路分頁，點一下某個節點即可開始加密私訊。",
  "chat.dm.contact_info": "聯絡人資訊",
  "chat.dm.pin": "置頂聊天",
  "chat.dm.unpin": "取消置頂聊天",
  "chat.dm.mute": "靜音聊天",
  "chat.dm.unmute": "取消靜音聊天",
  "chat.dm.clear_body": "刪除與 {name} 的所有訊息？此動作無法復原。",
  "chat.dm.remove_contact_body":
    "移除 {name}？這會刪除該對話並忘記這位聯絡人。如果對方再次傳來訊息，仍然可以聯絡到你。",
  "chat.dm.block_body":
    "封鎖 {name}？你不會在網狀網路分頁看到對方，也不會收到對方的訊息，就算對方就在附近。",
  "chat.dm.more_options": "{name} 的更多選項",
  "chat.dm.remove_contact_short": "移除聯絡人",
  "chat.dm.block_short": "封鎖聯絡人",
  "chat.dm.delete_short": "刪除聊天",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "清空訊息",
  "chat.clear_confirm": "清空",
  "chat.group_badge": "群組",
  "chat.more": "更多",
  "chat.no_messages": "還沒有訊息",
  "chat.you": "你",
  "chat.a11y.channel": "頻道 {name}",
  "chat.a11y.group": "群組 {name}",
  "chat.a11y.muted": "已靜音",
  "chat.a11y.pinned": "已置頂",

  // ---- Chats: start something new ----
  "chat.new.title": "開始新的對話",
  "chat.new.channel": "建立私密頻道",
  "chat.new.channel_label": "私密頻道",
  "chat.new.channel_desc":
    "拿到連結的人都能加入的房間。可以建立一個，也可以用別人傳來的連結加入。",
  "chat.new.group": "建立私密群組",
  "chat.new.group_label": "私密群組",
  "chat.new.group_desc": "挑選特定的人，最多 16 位。只走藍牙。",
  "chat.new.place": "用 geohash 前往某個地方",
  "chat.new.place_label": "前往某個地方",
  "chat.new.place_desc": "用 geohash 開啟任何地方的位置頻道。",
  "chat.new.reach": "涵蓋範圍",
  "chat.new.reach_internet": "透過藍牙和網路觸及成員。",
  "chat.new.reach_mesh": "在藍牙範圍內可用，不經過網路。",
  "chat.new.reach_internet_desc":
    "也會透過網路觸及成員。中繼看得到頻道正在活躍，卻永遠看不到它的訊息或成員。",
  "chat.new.reach_mesh_desc":
    "只留在本地網狀網路。最為私密，任何內容都不會離開藍牙範圍。",
  "chat.new.join_link": "用邀請連結加入私密頻道",
  "chat.new.back_to_chooser": "回到選擇畫面",
  "chat.new.create_channel": "建立頻道",
  "chat.new.name_required": "請先輸入頻道名稱",
  "chat.new.name_taken": "這個名稱已經有人用了",
  "chat.new.create": "建立",
  "chat.new.e2ee": "端對端加密。只有成員讀得到訊息。",
  "chat.new.invite_only":
    "僅限邀請。你把連結分享給誰，誰就能加入。它對其他所有人都是隱藏的，附近的節點也一樣。",
  "chat.new.name_exists": "已經有同名的頻道了。",
  "chat.new.reach_bluetooth_chip": "僅藍牙",
  "chat.new.reach_internet_chip": "藍牙 + 網路",
  "chat.new.have_link": "用邀請連結加入",

  // ---- Chats: join by link ----
  "chat.join.title": "用連結加入",
  "chat.join.not_airhop": "那不是 Airhop 連結。",
  "chat.join.reach_internet": "透過藍牙和網路觸及成員。",
  "chat.join.reach_mesh": "只留在藍牙範圍內。",
  "chat.join.contact_card":
    "一張聯絡人名片。會把對方加進你的聯絡人並開啟聊天。",
  "chat.join.unverified": "無法驗證這個連結",
  "chat.join.unverified_body":
    "這張聯絡人名片和它自己的金鑰對不上，因此沒有被加入。請對方重新傳一張。",
  "chat.join.paste": "從剪貼簿貼上",
  "chat.join.join": "加入",
  "chat.join.public_channel": "公開頻道 {name}。附近的任何人都讀得到。",
  "chat.join.private_channel": "私密頻道 {name}。{reach}",
  "chat.join.dm_with": "與 {name} 的私訊。",
  "chat.join.joined_as": "已用 {name} 的身分加入",
  "chat.join.name_clash_body":
    "你已經在另一個 {name} 裡了。頻道名稱只是標籤，所以這個邀請開了它自己的頻道，你原本那個不受影響。可以在各自的頻道資訊裡重新命名。",
  "chat.join.paste_hint":
    "貼上以 airhop:// 開頭的邀請。直接點連結也可以；這裡是為了那些點不了的連結。",
  "chat.join.key_note":
    "私密頻道邀請本身帶著金鑰，所以加入是立即的，也不必向任何人索取什麼。",
  "chat.join.offline_note":
    "離線也能用。連結是在這台裝置上解讀的，頻道能觸及多遠由建立者決定。",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "無法開啟該網格。請稍後再試。",
  "chat.jump.title": "前往某個地方",
  "chat.jump.saved": "已儲存的地點",
  "chat.jump.anywhere": "開啟任何地方的公開位置頻道，就算你人不在那裡。",
  "chat.jump.geohash_note":
    "輸入它的 geohash。位置落在該網格內的每個人共用同一個頻道。",
  "chat.jump.teleport_note":
    "你會顯示為遠端接入，而不是就在附近。它只透過網路觸及。",
  "chat.jump.level_cell": "{level} 網格",
  "chat.jump.already_here": "你已經在這裡了。前往會開啟你的 {name} 頻道。",
  "chat.jump.open_direction": "開啟你{direction}方的網格",
  "chat.jump.open_place": "開啟 {name}",
  "chat.jump.remove_place": "把 {name} 從已儲存的地點中移除",
  "chat.jump.go": "前往",
  "chat.jump.how":
    "要找 geohash：開啟一個位置頻道 > 點一下它的名稱 > 從那裡複製。",

  // ---- Chats: private groups ----
  "chat.group.unreachable": "無法觸及每一位成員。等對方在附近時再試一次。",
  "chat.group.you_were_added": "你被加進了 {name}。",
  "chat.group.added_you": "把你加進了 {name}",
  "chat.group.you_were_removed":
    "你被移出了 {name}。你在這裡不能再閱讀或傳送訊息了。",
  "chat.group.removed_you": "把你移出了 {name}",
  "chat.group.add_failed": "無法加入對方",
  "chat.group.add_failed_body":
    "什麼都沒變。可能是現在聯絡不上對方，或者群組已滿 16 人，又或者你不是它的建立者。",
  "chat.group.remove_failed": "無法移除對方",
  "chat.group.remove_failed_body":
    "什麼都沒變。只有建立群組的人才能更動群組成員。",
  "chat.group.e2ee": "端對端加密。只有成員讀得到訊息。",
  "chat.group.cap":
    "由你挑選，最多 16 人。沒有邀請連結，所以不會有人靠轉來的連結進來。",
  "chat.group.bluetooth": "僅藍牙。超出範圍的成員回來後就會收到訊息。",
  "chat.group.members_label": "成員",
  "chat.group.none_in_range": "範圍內沒有人。建立群組時成員必須在附近。",
  "chat.group.create_title": "建立群組",
  "chat.group.name_placeholder": "群組名稱",
  "chat.group.create": "建立",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "本地網狀網路 · 僅藍牙",
  "chat.scope.mesh_desc":
    "觸及藍牙範圍內的裝置（大約 10 到 100 公尺）。不需要網路。最適合就地協調。",
  "chat.scope.block": "街廓 · 約 100 公尺",
  "chat.scope.block_desc":
    "街廓層級的涵蓋範圍。訊息會透過網路橋接，讓超出藍牙範圍但就在附近的節點也能參與。",
  "chat.scope.neighborhood": "鄰里 · 約 1 公里",
  "chat.scope.neighborhood_desc":
    "鄰里層級的涵蓋範圍。有中繼協助，就算沒有直接的藍牙連線也能觸及整片區域的節點。",
  "chat.scope.city": "城市 · 約 10 公里",
  "chat.scope.city_desc":
    "涵蓋整座城市的頻道。使用依地理位置挑選的網路中繼，觸及整個都會區的節點。",
  "chat.scope.province": "省或州 · 約 100 公里",
  "chat.scope.province_desc":
    "省或州層級的涵蓋範圍。透過網路橋接，觸及數百公里的區域範圍。",
  "chat.scope.country": "國家或地區 · 約 1000 公里",
  "chat.scope.country_desc":
    "涵蓋整個國家。該地區任何 Airhop 或 bitchat 使用者都能加入並閱讀訊息。",
  "chat.transport.bluetooth": "僅藍牙",
  "chat.transport.both": "藍牙 + 網路",
  "chat.transport.internet": "僅網路",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "指令 /{cmd}：{hint}",
  "chat.cmd.hug_hint": "送上一個溫暖的擁抱",
  "chat.cmd.slap_hint": "用一條大鱒魚拍打",
  "chat.status.sending": "傳送中…",
  "chat.status.undo_send": "收回傳送",
  "chat.status.undo": "收回",
  "chat.status.sent": "已傳送",
  "chat.status.received": "已收到",
  "chat.status.failed": "失敗",
  "chat.status.canceled": "已取消",
  "chat.status.waiting": "等待中",
  "chat.status.sending_short": "傳送中",
  "chat.status.receiving": "接收中",
  "chat.thread.not_available": "這裡無法使用",
  "chat.thread.private_channel": "私密頻道",
  "chat.thread.location_channel": "位置頻道",
  "chat.thread.public_channel": "公開頻道",
  "chat.thread.notices": "本頻道的公告",
  "chat.thread.invite": "邀請別人加入本頻道",
  "chat.thread.not_in_range": "不在藍牙範圍內。正透過網路遞送。",
  "chat.thread.not_nearby": "不在附近。等對方回到範圍內或上線後，我們會遞送。",
  "chat.thread.no_keys":
    "你得在藍牙範圍內，或者掃描對方的 QR 碼，才能傳訊息給對方。",
  "chat.geo.card_received":
    "{name} 分享了自己的聯絡方式。把你的也分享回去，這樣你們其中一方換了地方也能繼續聊。",
  "chat.geo.exchange_complete":
    "聯絡方式已交換。現在你們在任何地方都能聯絡到彼此。",
  "chat.geo.keep_person": "留住這個人",
  "chat.geo.keep_person_desc":
    "分享你的聯絡方式，這樣你們其中一方換了地方也能繼續聊。對方會知道你的長期身分。",
  "chat.geo.card_sent": "已分享 · 等待對方的",
  "chat.thread.left_cell":
    "你已經離開這片區域，對方在這裡聯絡不到你了。交換 QR 碼就能在任何地方繼續聊。",
  "chat.thread.no_route": "現在聯絡不上對方。有路徑可走時訊息就會送出。",
  "chat.thread.empty": "還沒有訊息",
  "chat.thread.empty_desc": "開始一段加密對話。",
  "chat.thread.jump_latest": "跳到最新訊息",
  "chat.thread.back_to_members": "回到成員清單",
  "chat.thread.nostr_key": "Nostr 公鑰",
  "chat.thread.in_range": "在範圍內",
  "chat.voice.not_recorded": "語音留言沒有錄到",
  "chat.thread.message": "訊息",
  "chat.thread.message_placeholder": "訊息…",
  "chat.thread.length_full": "訊息已達上限",
  "chat.thread.waiting_for": "等待 {name} 回來 · {percent}%",
  "chat.thread.peer": "節點",
  "chat.thread.cancel_transfer": "取消 {name}",
  "chat.thread.queued_more": "還有 {count} 則等著傳送",
  "chat.thread.across_bridge": "橋接另一端 {count} 位",
  "chat.thread.bridged": "已橋接",
  "chat.thread.invite_body":
    "來 Airhop 的 {channel} 一起聊吧 — 離線優先的私密網狀網路通訊。",
  "chat.thread.go_back_unread": "返回，{count} 則未讀",
  "chat.thread.view_info": "查看 {name} 的資訊",
  "chat.thread.notices_new": "本頻道的公告，{count} 則新的",
  "chat.thread.say_something": "在 {channel} 裡說點什麼吧。",
  "chat.thread.jump_latest_new": "跳到最新訊息，{count} 則新的",
  "chat.thread.unconfirmed_since": "自 {date} 起沒有確認過遞送",
  "chat.thread.no_reach": "附近沒有節點 · 還沒有人收到這則訊息",
  "chat.thread.channel_needs_internet":
    "網路已關 · 本頻道只觸及得到藍牙範圍內的人",
  "chat.thread.cell_needs_internet": "網路已關 · 這個網格只能透過網路觸及",
  "chat.thread.geo_dm_needs_internet": "網路已關 · 這段對話只走網路",
  "chat.thread.via_gateway": "網路已關 · 附近有一台裝置正替你把它帶上網",
  "chat.thread.group_queued":
    "這個群組裡還沒有人在附近。等他們到了，訊息就會送到。",
  "chat.thread.no_group_key": "你已經不在這個群組裡，所以無法傳送",
  "chat.thread.no_reach_offline":
    "網路已關且附近沒有節點 · 還沒有人收到這則訊息",
  "chat.thread.mention": "提及 {name}",
  "chat.thread.someone_talking": "{hold}。{name} 正在說話。",
  "chat.thread.attach_note":
    "檔案只在藍牙範圍內傳送。文字和付款觸及得到網路上的聯絡人，附件則不行。",
  "chat.thread.message_peer": "傳訊息給 {name}",
  "chat.thread.send": "傳送訊息",
  "chat.thread.group": "群組",
  "chat.bridge.nearby_only": "僅限附近：讓這則訊息不走網狀網路橋接",
  "chat.bridge.nearby_label": "僅限附近 · 只走藍牙",
  "chat.bridge.bridging_label": "正橋接到附近區域 · 點一下可改為僅限附近",
  "chat.screenshot.you_took": "你截了圖",
  "chat.screenshot.you_took_private": "你截了圖 · 沒有告訴任何人",
  "chat.screenshot.heads_up": "提醒你一下",
  "chat.screenshot.notice": "* {name} 截了圖 *",
  "chat.screenshot.notified_dm": "{name} 已經知道你截了這段對話的圖。",
  "chat.screenshot.notified": "本頻道的所有人都已經知道你截了圖。",
  "chat.screenshot.not_notified":
    "沒有通知任何人。本頻道是公開的，宣布一次截圖反而會留下你曾經在這裡的紀錄。",
  "chat.thread.error": "錯誤",
  "chat.thread.go_back": "返回",
  "chat.bubble.via_bridge": "經由網狀網路橋接",
  "chat.bubble.view_profile": "查看 {name} 的個人檔案",
  "chat.bubble.forwarded": "已轉傳",
  "chat.bubble.attachment": "附件",
  "chat.bubble.a11y": "{sender}：{body}。長按查看更多選項。",
  "chat.bubble.failed_retry": "傳送失敗。點一下重試。",

  // ---- Chats: message actions and info ----
  "chat.info.title": "訊息資訊",
  "chat.info.delivered_to": "已送達 {name}",
  "chat.info.read_by": "{name} 已讀",
  "chat.info.group_reach_desc": "現在觸及得到，不代表已送達",
  "chat.info.group_alone": "沒有其他成員",
  "chat.info.today_at": "今天 {time}",
  "chat.info.sending": "傳送中…",
  "chat.info.failed": "傳送失敗",
  "chat.info.courier": "由一位朋友捎帶",
  "chat.info.sent": "已傳送",
  "chat.info.queued": "等著傳送",
  "chat.info.waiting": "等待中…",
  "chat.action.info": "訊息資訊",
  "chat.action.save_photos": "儲存到照片",
  "chat.action.save_copy": "儲存一份副本",
  "chat.action.forward": "轉傳",
  "chat.action.select": "選取",
  "chat.select.cancel": "取消選取",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "相機",
  "chat.attach.camera_desc": "拍一張照片或一段影片",
  "chat.attach.library": "照片圖庫",
  "chat.attach.library_desc": "從你的圖庫挑選",
  "chat.attach.document": "文件",
  "chat.attach.document_desc": "傳送任何檔案或 PDF",
  "chat.attach.voice": "語音留言",
  "chat.attach.voice_desc": "錄製並傳送一則語音訊息",
  "chat.attach.ecash": "傳送 ecash",
  "chat.attach.ecash_desc": "從你的錢包傳送 Cashu sat",
  "chat.attach.location": "位置",
  "chat.attach.location_desc": "傳送你此刻所在的位置",
  "chat.attach.title": "附加",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "分享了一個位置",
  "chat.location.received_summary": "分享了自己的位置",
  "chat.location.title": "位置",
  "chat.location.away": "{direction}方{distance}",
  "chat.location.taken": "{ago}前取得",
  "chat.location.open_maps": "在地圖中開啟",
  "chat.location.no_forward": "位置無法轉傳",
  "chat.location.no_forward_body":
    "一個位置只會傳給一個人。如果你想讓別人也拿到，請分享你自己的位置。",
  "chat.location.no_fix": "允許定位就能看到這裡有多遠",
  "chat.location.send_title": "傳送你的位置",
  "chat.location.send_body":
    "{name} 只會看到一個點：你此刻所在的位置。它不會持續更新。",
  "chat.location.send": "傳送位置",
  "chat.location.finding": "正在尋找你的位置…",
  "chat.location.no_location": "無法取得你的位置",
  "chat.location.no_location_body":
    "請允許定位存取並確認定位服務已開啟，然後再試一次。",
  "chat.location.not_delivered": "無法傳送你的位置",
  "chat.location.not_delivered_body":
    "位置只有在當下才值得傳送，所以它不會排隊等以後再送。等聯絡得上 {name} 時再試一次。",
  "chat.location.direction.n": "正北",
  "chat.location.direction.ne": "東北",
  "chat.location.direction.e": "正東",
  "chat.location.direction.se": "東南",
  "chat.location.direction.s": "正南",
  "chat.location.direction.sw": "西南",
  "chat.location.direction.w": "正西",
  "chat.location.direction.nw": "西北",
  "chat.attach.send_anyway": "還是傳送",
  "chat.attach.bitchat_too_big": "這可能送不到",
  "chat.attach.bitchat_too_big_body":
    "{name} 用的是 bitchat，它遇到大檔案會傳到一半就放棄。大約 350 KiB 以下比較可靠。傳給 Airhop 聯絡人則沒有這種限制。",
  "chat.attach.bitchat_unopenable": "對方可能打不開這個",
  "chat.attach.bitchat_unopenable_body":
    "{name} 用的是 bitchat，它能顯示照片和語音留言，其餘一律列為打不開的檔案。檔案會送到，只是對方可能看不了。",
  "chat.attach.file": "附加一個檔案",
  "chat.attach.unavailable": "這裡無法附加檔案",
  "chat.attach.not_sent": "附件未傳送",
  "chat.attach.read_failed": "讀取那個檔案時出了問題。換一個試試。",
  "chat.attach.caption": "加上說明…",
  "chat.attach.send": "傳送附件",
  "chat.attach.generic": "附件",
  "chat.media.view_full": "全螢幕檢視照片",
  "chat.media.gone_photo": "這台裝置上沒有這張照片",
  "chat.media.gone_video": "這台裝置上沒有這段影片",
  "chat.media.gone_voice": "這台裝置上沒有這則語音留言",
  "chat.media.gone_file": "這台裝置上沒有這個檔案",
  "chat.media.gone_note": "已在 7 天後或快取被清除時移除",
  "chat.media.ask_resend": "再問一次",
  "chat.media.resend_draft": "可以再傳一次那{kind}嗎？",
  "chat.media.kind_photo": "張照片",
  "chat.media.kind_video": "段影片",
  "chat.media.kind_voice": "則語音留言",
  "chat.media.kind_file": "個檔案",
  "chat.media.pause_voice": "暫停語音留言",
  "chat.media.play_voice": "播放語音留言",
  "chat.media.voice_position": "語音留言位置",
  "chat.media.voice_scrub": "沿著音條點一下就能跳到那個位置",
  "chat.media.image": "圖片",
  "chat.media.tap_load_photo": "點一下載入照片",
  "chat.media.open_document": "開啟 {name}",
  "chat.media.document": "文件",
  "chat.media.tap_load_video": "點一下載入影片",
  "chat.media.video": "影片",
  "chat.media.photo": "照片",
  "chat.media.close_photo": "關閉照片",
  "chat.media.save_photo": "把照片儲存到你的照片",
  "chat.media.share_photo": "分享照片",
  "chat.media.saved_videos": "已儲存到你的影片",
  "chat.media.saved_photos": "已儲存到你的照片",
  "chat.media.not_saved": "未儲存",
  "chat.media.cant_open": "打不開檔案",
  "chat.media.no_app": "這台裝置上沒有可以開啟或分享這個檔案的 App。",
  "chat.media.open_failed": "無法開啟這個檔案。它可能已經被從快取中清掉了。",
  "media.blocked.nostr_only":
    "你只是透過中繼認識這個人。只有文字可用。照片、檔案和語音留言需要藍牙。",
  "media.blocked.private_channel":
    "廣播附件只有簽章而沒有加密，所以把它送進私密頻道會讓它以明文暴露，而這裡的文字仍然是加密的。",
  "media.blocked.private_group":
    "廣播附件只有簽章而沒有加密，所以把它送進私密群組會讓它以明文暴露，而這裡的文字仍然是加密的。",
  "media.blocked.location_channel":
    "位置頻道透過網路觸及別人，而照片、檔案和語音留言走的是藍牙，所以它們永遠送不到。",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "這裡無法使用語音留言",
  "chat.voice.hold_live": "按住即可即時通話",
  "chat.voice.hold_record": "按住即可錄製語音留言",
  "chat.voice.cancel_recording": "取消錄製",
  "chat.voice.slide_cancel": "滑動取消",
  "chat.voice.release_cancel": "放開取消",
  "chat.voice.a11y_toggle": "點兩下開始或停止說話。",
  "chat.voice.limit_reached": "已達兩分鐘上限，放開即可傳送",
  "chat.voice.limit_sent": "已達兩分鐘上限，留言已傳送",
  "chat.voice.stop_send": "停止錄製並傳送",
  "chat.voice.lift_lock": "向上滑動即可免持錄製",
  "chat.voice.live_speaking": "{name} 正在說話",
  "voice.unavailable": "即時語音無法使用",
  "voice.recording_stopped": "錄製已停止",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "相機存取權",
  "chat.perm.camera_purpose": "拍一張照片來傳送",
  "chat.perm.photo_label": "照片存取權",
  "chat.perm.photo_purpose": "挑一張照片或一段影片來傳送",
  "chat.perm.photo_save_purpose": "把它儲存到你的照片",
  "chat.perm.mic_label": "麥克風存取權",
  "chat.perm.mic_live_purpose": "和附近的人說話",
  "chat.perm.mic_note_purpose": "錄製一則語音留言",
  "chat.perm.recording_stopped": "錄製已停止",
  "chat.perm.record_failed": "無法開始錄製。請檢查麥克風權限。",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "已領取",
  "chat.ecash.reclaimed": "已收回",
  "chat.ecash.claiming": "領取中…",
  "chat.ecash.claim": "領取",
  "chat.ecash.claim_amount": "領取 {amount} {unit}",
  "chat.ecash.already_claimed": "已經領過了",
  "chat.ecash.already_claimed_body":
    "這個代幣裡的每一份憑證都已經在你的錢包裡了，所以沒有新增任何東西。",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "已交給網狀網路盡力遞送",
  "chat.info.queued_desc": "先留在這支手機上，直到有路徑能送到對方",
  "chat.info.reclaimed": "已收回",
  "chat.info.reclaimed_desc": "你已經把這筆付款收回自己的錢包，所以它不會送達",
  "chat.info.about": "關於",
  "chat.info.group_desc":
    "一個私密群組。只有建立者加入的成員讀得到，而且它只走藍牙。",
  "chat.info.teleported_desc":
    "這個 geohash 網格的公開位置頻道。網格內的任何人，不管是用 Airhop 還是 bitchat，都透過網路共用它。你是遠端接入的，人並不在這裡。",
  "chat.info.custom_desc":
    "一個自訂頻道。知道名稱的人都能從任何 Airhop 或 bitchat 裝置加入。",
  "chat.info.private_e2ee": "私密 · 端對端加密",
  "chat.info.public_plain": "公開 · 未加密",
  "chat.info.group_privacy":
    "只有下面列出的成員讀得到這個群組。訊息只走藍牙，所以超出範圍的成員回來後就會收到。",
  "chat.info.teleport_privacy":
    "你遠端接入的一個地方。它透過網路觸及這個網格裡的每個人，而不會觸及藍牙範圍內的任何人。",
  "chat.info.location_off_privacy":
    "定位已關閉，所以本頻道只能透過藍牙觸及附近裝置。開啟定位即可透過網路觸及它所在的區域網格。",
  "chat.info.invite_privacy":
    "只有你用連結邀請的人讀得到。它對其他所有人都是隱藏的，附近的節點也一樣。",
  "chat.info.public_privacy":
    "任何加入的人都讀得到每一則訊息。私下交談請用私訊；私訊是端對端加密的。",
  "chat.info.remove_member": "移除成員",
  "chat.info.remove_member_body":
    "把 {name} 移出群組？群組金鑰會輪替，對方將無法再讀到新訊息。",
  "chat.info.message_member": "傳訊息給 {name}",
  "chat.info.remove_member_a11y": "移除 {name}",
  "chat.info.no_addable": "沒有可加入的可觸及節點。成員必須在附近。",
  "chat.info.add_count": "加入 {count} 位",
  "chat.info.teleported_tag": "{level}  ·  遠端",
  "chat.info.active": "活躍",
  "chat.info.members": "成員",
  "chat.info.bookmark": "收藏這個地點",
  "chat.info.remove_bookmark": "取消收藏",
  "chat.info.default_notice":
    "預設頻道無法離開。它們是 Airhop 網狀網路協定的一部分。",
  "chat.info.custom_channel": "自訂頻道",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "複製 geohash",
  "chat.info.relays": "中繼",
  "chat.info.show_relays": "顯示承載本頻道的中繼",
  "chat.info.relay_custom": "自訂",
  "chat.info.relays_none": "沒有。這個網格現在只走藍牙。",
  "chat.info.search_members": "搜尋成員",
  "chat.info.search_members_placeholder": "搜尋成員…",
  "chat.info.teleported": "遠端接入",
  "chat.info.creator": "建立者",
  "chat.info.no_matches": "沒有符合的項目",
  "chat.info.no_one_here": "這裡還沒有人",
  "chat.info.add_members": "加入成員",
  "chat.info.add_selected": "加入所選成員",
  "chat.info.add": "加入",
  "chat.info.leave_group": "離開群組",
  "chat.info.leave_channel": "離開頻道",
  "chat.info.leave": "離開",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "自 {date} 起開始聊天",
  "chat.contact.verified_since": "自 {date} 起已驗證",
  "chat.contact.anonymous": "匿名",
  "chat.contact.anonymous_desc": "一個 geohash 化名，沒有可供驗證的長期身分",
  "chat.contact.verified": "已驗證",
  "chat.contact.verified_desc": "你掃過對方的 QR 碼",
  "chat.contact.verified_desc_compared": "你和對方核對過代碼",
  "chat.contact.not_verified": "未驗證",
  "chat.contact.not_verified_desc":
    "掃描對方的 QR 碼，或者在通話中核對一次，以確認這真的是本人",
  "chat.contact.e2ee": "端對端加密",
  "chat.contact.e2ee_nostr": "依 NIP-17 禮物包裝，所以中繼讀不到",
  "chat.contact.e2ee_mesh": "Noise XX，Airhop 裝置之間還有 Double Ratchet",
  "chat.contact.copy_nostr": "複製 Nostr 公鑰",
  "chat.contact.nostr_key": "Nostr 公鑰",
  "chat.contact.cell_key_note":
    "這把金鑰屬於你們相遇的那片區域。你們其中一方移動它就會變，對話也隨之中斷。交換聯絡方式就能在任何地方繼續聊。",
  "chat.contact.peer_name": "節點名稱",
  "chat.contact.peer_id": "節點 ID",
  "chat.contact.rename": "重新命名",
  "chat.contact.rename_needs_contact":
    "你可以為手上握有金鑰的人重新命名。先交換聯絡人名片，之後這就成了只有你看得到的名字。",
  "chat.contact.rename_needs_keys":
    "這位聯絡人還沒有金鑰。傳則訊息給對方，或者掃描對方的 QR 碼，你就能給對方取一個只有你看得到的名字。",
  "chat.contact.renamed_by_you": "你為對方取的名字",
  "chat.contact.copy_peer_id": "複製節點 ID",
  "chat.contact.verify": "驗證聯絡人",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "公告",
  "chat.notices.post_area": "向這片區域張貼公告",
  "chat.notices.post_mesh": "向網狀網路張貼公告",
  "chat.notices.mark_urgent": "標為緊急",
  "chat.notices.post": "張貼公告",
  "chat.notices.post_short": "張貼",
  "chat.notices.delete": "刪除公告",
  "chat.notices.just_now": "剛剛",
  "chat.notices.fades_soon": "即將淡去",
  "chat.notices.1_day": "1 天",
  "chat.notices.3_days": "3 天",
  "chat.notices.7_days": "7 天",
  "chat.notices.fading": "淡去中",
  "chat.notices.fades_in_hours": "{count} 小時後淡去",
  "chat.notices.fades_in_days": "{count} 天後淡去",
  "chat.notices.scope_geo": "地理",
  "chat.notices.scope_mesh": "網狀網",
  "chat.notices.urgent_short": "緊急",
  "chat.notices.permanent_warning":
    "永不淡去。它是公開的，綁在這片區域上，而且你收不回來。",
  "chat.notices.none": "還沒有公告。張貼一則，讓它留在這裡給別人看。",

  // ---- Chats: search results ----
  "chat.search.photos": "照片",
  "chat.search.videos": "影片",
  "chat.search.audio": "音訊",
  "chat.search.documents": "文件",
  "chat.search.links": "連結",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "依{filter}篩選",
  "chat.search.no_matches": "沒有符合「{query}」的{filter}",
  "chat.search.no_media": "還沒有{filter}",
  "chat.search.result_a11y": "{chat}，來自 {sender} 的{kind}",
  "chat.search.you": "你",
  "chat.search.section_chats": "聊天",
  "chat.search.section_messages": "訊息",
  "chat.search.section_notices": "公告",
  "chat.search.hint": "搜尋訊息和聊天，或者從上面挑一個篩選條件。",
  "chat.search.no_results": "沒有「{query}」的結果",
  "chat.search.open_chat": "開啟 {name}",
  "chat.search.message_a11y": "{chat}，來自 {sender} 的訊息：{snippet}",
  "chat.search.notice_a11y": "{chat} 中來自 {author} 的公告：{snippet}",
  "chat.search.urgent": "緊急 ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "這份清單裡有 {count} 則。清空只會把它們從這裡移除，訊息在各自的對話中仍然未讀。全部標為已讀則兩邊都會清掉。",
  "chat.notif.mark_all_read": "全部標為已讀",
  "chat.notif.clear_list": "清空清單",
  "chat.notif.clear_all_a11y": "清空全部 {count} 則通知",
  "chat.notif.title": "通知",
  "chat.notif.clear_short": "清空",
  "chat.notif.close": "關閉通知",
  "chat.notif.none": "還沒有通知",
  "chat.notif.none_desc": "來自你的頻道和聊天的訊息、提及和公告會顯示在這裡。",
  "chat.notif.new": "新",
  "chat.notif.notice_in": "{channel} 中的公告",

  // ---- Chats: forward ----
  "chat.forward.title": "轉傳給…",
  "chat.forward.to": "轉傳給 {name}",
  "chat.forward.cant_send_here": "這裡不能轉傳",
  "chat.forward.cant_send_to": "不能轉傳給 {name}",
  "chat.forward.channels": "頻道",
  "chat.forward.groups": "群組",
  "chat.forward.locations": "位置",
  "chat.forward.dms": "私訊",
  "chat.forward.none": "還沒有其他聊天",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "正在啟動網狀網路…",
  "mesh.banner.no_bluetooth": "這台裝置沒有藍牙 · 僅網路",
  "mesh.banner.bluetooth_off": "藍牙已關 · 網狀網路無法使用",
  "mesh.banner.permission_needed": "需要藍牙權限",
  "mesh.banner.blocked": "藍牙被擋下 · 請在設定中允許",
  "mesh.banner.location_permission": "需要定位才找得到節點",
  "mesh.banner.advertising_unsupported": "這支手機看得到別人，但自己不會被發現",
  "mesh.banner.location_off_android": "定位已關 · Android 需要它才找得到節點",
  "mesh.banner.paused": "網狀網路已暫停 · 你處於離開狀態",
  "mesh.banner.location_off": "定位已關 · 位置頻道無法使用",
  "mesh.banner.battery_saver": "省電模式 · 掃描次數減少",
  "mesh.banner.wipe_incomplete":
    "抹除未完成 · 可能還有殘留資料，重新開啟會再試一次",
  "mesh.banner.wifi_off": "Wi-Fi 已關 · 大檔案傳得比較慢",
  "mesh.banner.clock_skew": "這支手機的時鐘不對 · 請把日期與時間設為自動",
  "mesh.banner.internet_off": "網路已關 · 僅藍牙",
  "mesh.banner.relaying": "附近沒有本地節點 · 正經由 Nostr 中繼",
  "mesh.banner.tor": "Tor 已開 · 網路流量已轉送",
  "mesh.banner.tor_starting": "正在啟動 Tor · 連線中",
  "mesh.banner.tor_blocked": "Tor 無法連線 · 網狀網路照常運作",
  "mesh.banner.gateway": "網路閘道已開 · 正替附近節點中繼",
  "mesh.banner.bridge": "網狀網路橋接已開 · 公開聊天已連通",
  "mesh.banner.background_limits": "{brand} 可能會在背景暫停網狀網路",
  "mesh.banner.bridge_across": "網狀網路橋接已開 · 橋接另一端有 {count} 位",
  "mesh.banner.action.turn_on": "開啟",
  "mesh.banner.action.allow": "允許",
  "mesh.banner.action.resume": "恢復",
  "mesh.banner.action.fix": "修正",
  "mesh.banner.hint.resume": "重新開啟藍牙廣播和掃描",
  "mesh.banner.hint.enable_bluetooth": "請 Android 打開藍牙",
  "mesh.banner.hint.location_settings": "開啟系統定位設定",
  "mesh.banner.hint.app_settings": "在系統設定中開啟 Airhop 的權限",
  "mesh.banner.hint.battery_settings": "開啟這支手機的背景活動設定",
  "mesh.banner.dismiss": "忽略：{label}",
  "mesh.banner.hint.dismiss": "永久隱藏這則提示",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "正在掃描附近的節點…",
  "mesh.radar.starting": "正在啟動網狀網路…",
  "mesh.radar.no_bluetooth": "這台裝置沒有藍牙",
  "mesh.radar.bluetooth_off": "藍牙已關 · 未在掃描",
  "mesh.radar.permission_needed": "需要藍牙權限",
  "mesh.radar.blocked": "藍牙被擋下",
  "mesh.radar.location_permission": "需要定位權限",
  "mesh.radar.location_off": "定位已關 · 未在掃描",
  "mesh.radar.hint_rings": "圓環表示 BLE 訊號強度，不是距離",
  "mesh.radar.hint_checking": "正在檢查藍牙和權限",
  "mesh.radar.hint_internet": "訊息仍然能透過網路傳遞",
  "mesh.radar.hint_turn_on": "打開藍牙就能找到節點",
  "mesh.radar.hint_allow": "允許藍牙就能找到節點",
  "mesh.radar.hint_allow_settings": "在設定中允許藍牙就能找到節點",
  "mesh.radar.hint_location_permission":
    "Android 11 和更舊的版本需要定位才能用藍牙掃描",
  "mesh.radar.hint_android_location":
    "Android 需要開著定位才會回傳藍牙掃描結果",
  "mesh.radar.signal_strong": "強",
  "mesh.radar.signal_medium": "中",
  "mesh.radar.signal_weak": "弱",
  "mesh.radar.you_center": "你，在網狀網路的中心",
  "mesh.radar.sonar_hint": "播放一次聲納掃描。掃描本來就是持續進行的。",
  "mesh.radar.paused": "網狀網路已暫停 · 你處於離開狀態",
  "mesh.radar.ring_hint": "圓環位置反映的是訊號強度，不是距離",
  "mesh.radar.set_online": "在個人頁把狀態設為上線就能找到節點",
  "mesh.radar.in_range": "在範圍內",
  "mesh.radar.recently_seen": "最近見過",
  "mesh.radar.peer_hint": "開啟傳訊息給這個節點或付款給它的選項",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "剛剛",
  "mesh.peer.none": "附近沒有節點",
  "mesh.peer.none_desc":
    "藍牙範圍內其他的 Airhop 或 bitchat 裝置會出現在這裡。",
  "mesh.peer.id_copied": "節點 ID 已複製",
  "mesh.peer.copy_id": "複製節點 ID",
  "mesh.peer.their_name": "自稱 {name}",
  "mesh.peer.in_range": "在範圍內",
  "mesh.peer.relay": "中繼節點",
  "mesh.peer.relay_body":
    "有人擺著讓它一直跑、專門用來擴大網狀網路的一台無線電。它轉運自己讀不懂的訊息。這裡沒有人可以聊天。",
  "mesh.peer.send_dm": "傳一則私訊",
  "mesh.peer.message": "訊息",
  "mesh.peer.send_sats": "傳送 ecash",
  "mesh.peer.amount_placeholder": "金額（sat）",
  "mesh.peer.amount_first": "傳送 ecash，請先輸入金額",
  "mesh.peer.cancel_send": "取消傳送 ecash",
  "mesh.peer.view_peer": "查看節點 {name}",
  "mesh.peer.view_peer_online": "查看節點 {name}，上線中",
  "mesh.peer.last_seen": "上次出現在 {ago}前",
  "mesh.peer.send_amount": "傳送 {amount} sat",
  "mesh.peer.direct": "直接連線",
  "mesh.peer.check_distance": "量一下距離",
  "mesh.peer.checking": "量測中",
  "mesh.peer.no_reply": "沒有回應",
  "mesh.peer.no_reply_hint": "對方可能已經走開，也可能他們的 App 不作回應",
  "mesh.peer.rtt": "{ms} 毫秒",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "地區",
  "mesh.level.province": "省",
  "mesh.level.city": "城市",
  "mesh.level.neighborhood": "鄰里",
  "mesh.level.block": "街廓",
  "mesh.level.building": "建築物",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "可花用",
  "wallet.balance.unit_hint": "在聰和比特幣之間切換",
  "wallet.balance.a11y": "餘額 {value} {unit}",
  "wallet.balance.locked":
    "錢包儲存已鎖定。Ecash 憑證存在一個加密檔案裡，它的金鑰放在裝置鑰匙圈中，現在打不開。請解鎖裝置並重新開啟 Airhop。",
  "wallet.balance.tor_blocked":
    "Tor 已開啟，所以鑄幣廠請求被擋下：它們會走明網送出，把你的 IP 和你的憑證連在一起。透過網狀網路收付仍然可用。可在設定的安全裡允許鑄幣廠流量。",
  "wallet.balance.unconfirmed_note": "{amount} 尚未向鑄幣廠確認",
  "wallet.balance.reserved_note": "{amount} 已為一筆在途的傳送保留",
  "wallet.balance.other_mint_note": "{amount} 放在另一個鑄幣廠帳戶裡",
  "wallet.balance.test_mint_note":
    "其中包含測試鑄幣廠發的遊戲幣。它不是比特幣，也無法兌現。",
  "wallet.token": "代幣",
  "wallet.action.send": "傳送 ecash 代幣",
  "wallet.action.send_disabled": "傳送 ecash 代幣，餘額為零時無法使用",
  "wallet.action.receive": "接收 ecash 代幣",
  "wallet.action.zap": "打閃給 Nostr 聯絡人",
  "wallet.action.zap_disabled": "打閃給 Nostr 聯絡人，餘額為零時無法使用",
  "wallet.action.add_mint": "新增 Cashu 鑄幣廠",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "無法建立這個代幣",
  "wallet.send.title": "傳送 ecash",
  "wallet.send.amount_in": "金額（{unit}）",
  "wallet.send.body":
    "用你手上已有的憑證離線建立。在你確認代幣已送達之前，餘額不會被永久扣掉。",
  "wallet.send.stale_fee_note":
    "手續費上次核對是在 {days} 天前。如果這個鑄幣廠之後調高了費率，這筆傳送可能會稍微貴一點。",
  "wallet.send.fee_note":
    "{spend} {unit} 會從你的餘額扣掉；多出的 {fee} 用來抵掉對方本來要付的鑄幣廠手續費",
  "wallet.send.qr_too_big":
    "這個代幣拆成的幣太多，塞不進一個 QR 碼。請改用分享或複製，或者到鑄幣廠重新整理以合併。",
  "wallet.send.bearer_note":
    "誰拿著這串字，錢就是誰的。這些憑證是被保留而不是花掉：如果它始終沒有送到任何人手上，你可以在待處理裡收回。",
  "wallet.send.qr_too_big_short":
    "這個代幣拆成的幣太多，塞不進一個 QR 碼。請改用分享或複製。",
  "wallet.send.scan_note":
    "讓對方用自己的錢包掃這個。在你標記為已送達之前仍然可以收回。",
  "wallet.send.mesh_note":
    "代幣會以加密私訊的形式透過網狀網路送出。不需要網路。",
  "wallet.send.no_peers_note":
    "開啟網狀網路分頁尋找附近裝置，或者換個方式分享代幣。",
  "wallet.send.send_to": "傳送給 {name}",
  "wallet.send.memo": "備註（選填，會隨代幣一起帶著）",
  "wallet.send.building": "建立中…",
  "wallet.send.build": "建立代幣",
  "wallet.send.inexact_body":
    "你的憑證在離線狀態下湊不出剛好 {amount} {unit}。能建立的最小代幣是 {spend} {unit}，而離線是沒有找零的：多出的 {extra} {unit} 會歸收款方。\n\n連上網路時到鑄幣廠重新整理一次，可以把你的憑證拆成湊得出這個精確金額的面額。",
  "wallet.send.send_amount": "傳送 {amount}",
  "wallet.send.sent_to": "{amount} {unit} 已傳送給 {name}",
  "wallet.send.sent_to_body":
    "{route} 在你確認對方收到之前，或者在鑄幣廠告知這些憑證已被兌付之前，它都留在待處理裡可以收回。",
  "wallet.send.copy_token": "複製代幣",
  "wallet.send.share_token": "分享代幣",
  "wallet.send.open_in_wallet": "在另一個錢包中開啟這個代幣",
  "wallet.send.open_in_wallet_short": "在錢包中開啟",
  "wallet.send.to_peer": "把代幣傳給附近的節點",
  "wallet.send.to_peer_short": "傳給節點",
  "wallet.send.mark_delivered": "標記為已送達並結束",
  "wallet.send.they_got_it": "對方收到了",
  "wallet.send.keep_pending": "讓這筆傳送保持待處理",
  "wallet.send.decide_later": "稍後再決定",
  "wallet.send.no_peers": "範圍內沒有節點",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "這是你自己的付款",
  "wallet.receive.own_payment_body":
    "這些幣仍為一筆你還沒結清的傳送保留著，所以沒有可領取的東西。對那筆付款使用收回，就能把它們直接放回你的餘額。",
  "wallet.receive.already_have": "已經在你的錢包裡",
  "wallet.receive.already_have_body":
    "這個代幣裡的每一份憑證都已經存在這裡了，所以沒有新增任何東西。餘額沒有變動。",
  "wallet.receive.stored_unconfirmed":
    "已從 {mint} 存入，但尚未向鑄幣廠確認（{reason}）。",
  "wallet.receive.offline": "離線",
  "wallet.receive.redeemed_here":
    "已在 {mint} 兌付。這些憑證現在只屬於你：傳送方手上的副本不再有效。",
  "wallet.receive.memo_quoted": "\n\n「{memo}」",
  "wallet.receive.redeemed_at":
    "已在 {mint} 兌付。現在它可以被證明屬於你：傳送方手上的這份代幣副本不再有效。",
  "wallet.receive.stored_pending":
    "已從 {mint} 存入，但鑄幣廠還沒確認它未被花用{dleq}。連上網路後請到錢包分頁重新整理。",
  "wallet.receive.dleq_inline": "（它的簽章確實對得上，所以這個代幣是真的）",
  "wallet.receive.dleq_ok": "鑄幣廠的簽章對得上，所以這個代幣是真的。",
  "wallet.receive.dleq_uncached":
    "這個鑄幣廠的金鑰沒有快取在這裡，所以無法離線核對簽章。",
  "wallet.receive.dleq_warning":
    "在你連上網路重新整理之前，傳送方理論上有可能已經把它花在別處。",
  "wallet.receive.failed": "無法接收",
  "wallet.receive.title": "接收 ecash",
  "wallet.receive.body":
    "貼上一個 Cashu 代幣。連上網路時它會立刻在鑄幣廠兌付；離線時它會被存起來，等你下次重新整理時再確認。",
  "wallet.receive.scan": "掃描 ecash QR 碼",
  "wallet.receive.scan_short": "掃描 QR 碼",
  "wallet.receive.receiving": "接收中…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "收到來自 {from}… 的 Nutzap，已兌付進你的錢包。",
  "wallet.zap.title": "打閃給一個 Nostr 身分",
  "wallet.zap.not_npub": "不是 npub",
  "wallet.zap.bad_key": "金鑰有誤",
  "wallet.zap.invalid_pubkey": "公鑰無效",
  "wallet.zap.invalid_pubkey_body":
    "請輸入 npub1… 開頭的公鑰，或者 64 位十六進位的 Nostr 公鑰。",
  "wallet.zap.sent": "Nutzap 已送出",
  "wallet.zap.failed": "打閃失敗",
  "wallet.zap.body":
    "如果對方公布了 NIP-61 nutzap 資訊，這筆 ecash 會鎖到對方的金鑰上，別人花不了，也收不回來。如果沒有，它會改以可收回的代幣送出。系統會告訴你實際走了哪一種。",
  "wallet.zap.contact": "打閃給 {name}",
  "wallet.zap.pubkey_placeholder": "npub1… 或 64 位十六進位",
  "wallet.zap.sending": "傳送中…",
  "wallet.nostr.copied_body":
    "把這個給別人，對方就能從 Airhop 或任何其他 Nostr 錢包打閃給你，完全不必用藍牙。",
  "wallet.nostr.copy_key": "複製你的 Nostr 金鑰，好讓別人打閃給你",
  "wallet.nostr.your_key": "你的 Nostr 金鑰",

  // ---- Wallet: mints ----
  "wallet.mint.added": "鑄幣廠已新增",
  "wallet.mint.add_failed": "無法新增鑄幣廠",
  "wallet.mint.added_named": "已新增 {name}",
  "wallet.mint.added_body":
    "{mint} 發行 {units}。它的金鑰已快取在這台裝置上，所以就算沒有網路，來自它的代幣現在也能核對。",
  "wallet.mint.remove_plain":
    "把 {mint} 從你的錢包移除？它快取的金鑰也會一併刪掉，來自它的代幣將無法再離線核對。",
  "wallet.mint.title": "鑄幣廠",
  "wallet.mint.none": "還沒有鑄幣廠",
  "wallet.mint.none_desc":
    "鑄幣廠負責發行和兌付你的 ecash。新增一個就能透過 Lightning 存入，或者乾脆收一個代幣，它的鑄幣廠就會自動幫你加上。",
  "wallet.mint.add": "新增鑄幣廠",
  "wallet.mint.add_body":
    "鑄幣廠替你的 ecash 保管背後的比特幣，所以請挑一個你願意託付這筆餘額的。URL 在儲存前會先核對。如果你不想信任任何人，可以用 Nutshell 自己架一個。",
  "wallet.mint.consolidate_body":
    "一個代幣只能指名一個鑄幣廠，所以分散在好幾個鑄幣廠的餘額，付不了超過其中最大那份的金額。Airhop 可以幫你搬：其餘每個鑄幣廠各去付一張由你選定的那個開出的 Lightning 發票。會花一點路由費，也需要網路。",
  "wallet.mint.add_short": "新增鑄幣廠",
  "wallet.mint.checking": "核對中…",
  "wallet.mint.remove_with_balance": "移除還有餘額的鑄幣廠？",
  "wallet.mint.remove": "移除鑄幣廠",
  "wallet.mint.delete_anyway": "還是刪除",
  "wallet.mint.consolidate": "把所有餘額整合到一個鑄幣廠",
  "wallet.mint.confirm_with": "向 {mint} 確認憑證",
  "wallet.mint.remove_a11y": "移除 {mint}",
  "wallet.mint.available_amount": "可用 {amount} {unit}",
  "wallet.mint.split_across": "餘額分散在 {count} 個鑄幣廠。把它整合到一個。",
  "wallet.mint.move_everything_to": "把全部搬到 {mint}",
  "wallet.mint.consolidate_title": "整合到一個鑄幣廠",
  "wallet.mint.moving": "搬移中…",
  "wallet.mint.move": "搬移",
  "wallet.mint.moved": "已搬移",
  "wallet.mint.moved_body":
    "扣掉 {fees} {unit} 的 Lightning 路由費後，{amount} {unit} 現在放在 {mint}。",
  "wallet.mint.nothing_moved": "什麼都沒搬",
  "wallet.mint.destination": "· 目的地",
  "wallet.mint.will_move": "· 將被搬移",
  "wallet.mint.issued_by": "發行方",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop 錢包儲值",
  "wallet.ln.invoice_failed": "無法建立發票",
  "wallet.ln.price_failed": "無法為這張發票定價",
  "wallet.ln.paid": "已付款",
  "wallet.ln.deposit_credited":
    "發票已付款，{mint} 已發行 {amount} {unit}。這筆餘額已確認：你馬上就能離線花掉它。",
  "wallet.ln.withdrawn":
    "已透過 Lightning 付出 {paid} sat。鑄幣廠收了 {fee} sat 的路由費。",
  "wallet.ln.withdrawn_with_change":
    "已透過 Lightning 付出 {paid} sat。鑄幣廠收了 {fee} sat 的路由費，並把保留額中剩下的 {change} sat 退回你的餘額。",
  "wallet.ln.payment_failed": "付款失敗",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "把 Lightning 上的 sat 變成可以離線花的 ecash，或者把 ecash 兌付到任何一張 Lightning 發票。兩者都需要網路和一個鑄幣廠。",
  "wallet.ln.deposit_body":
    "鑄幣廠給你一張發票。用任何 Lightning 錢包付掉它，這些 sat 就會以 ecash 的形式回來，可以離線花。",
  "wallet.ln.pay_invoice_for":
    "付掉這張 {amount} {unit} 的發票。錢包正盯著這筆付款，到帳後會自動幫你發行 ecash。",
  "wallet.ln.expired_body":
    "這張發票已過期。如果你已經付過了，餘額會自動入帳。",
  "wallet.ln.waiting_expires": "等待付款 · {countdown} 後過期",
  "wallet.ln.withdraw_body":
    "貼上一張 bolt11 發票，鑄幣廠會用你的 ecash 去付。系統會先報出路由保留額；路由沒用掉的部分會退回你的餘額。",
  "wallet.ln.up_to": "最多 {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "付 {amount} {unit}",
  "wallet.ln.deposit": "透過 Lightning 存入 sat",
  "wallet.ln.deposit_short": "存入",
  "wallet.ln.withdraw": "提領到一張 Lightning 發票",
  "wallet.ln.withdraw_short": "提領",
  "wallet.ln.deposit_title": "透過 Lightning 存入",
  "wallet.ln.amount_placeholder": "金額（sat）",
  "wallet.ln.requesting": "請求中…",
  "wallet.ln.get_invoice": "取得發票",
  "wallet.ln.copy_invoice": "複製發票",
  "wallet.ln.open_wallet": "在 Lightning 錢包中開啟",
  "wallet.ln.open_wallet_short": "在錢包中開啟",
  "wallet.ln.waiting": "等待付款…",
  "wallet.ln.new_invoice": "建立一張新發票",
  "wallet.ln.new_invoice_short": "新發票",
  "wallet.ln.withdraw_title": "提領到 Lightning",
  "wallet.ln.scan_invoice": "掃描 Lightning 發票 QR 碼",
  "wallet.ln.paid_from": "付款來源",
  "wallet.ln.invoice": "發票",
  "wallet.ln.routing_reserve": "路由保留額",
  "wallet.ln.reserved": "已從餘額保留",
  "wallet.ln.paying": "付款中…",
  "wallet.ln.get_quote": "取得報價",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "備份",
  "wallet.backup.setup_failed": "無法設定備份",
  "wallet.backup.on": "備份已開啟",
  "wallet.backup.on_body":
    "現在可以用那十二個字重建你的餘額。\n\n別人給你的東西在你到鑄幣廠重新整理之前不受助記詞涵蓋，而且復原時需要你的鑄幣廠清單，所以請把它和這些字一起記下來。",
  "wallet.backup.no_phrase": "沒有存放助記詞",
  "wallet.backup.no_phrase_body":
    "無法從裝置鑰匙圈讀出復原助記詞。請解鎖裝置後再試一次。",
  "wallet.backup.replace_title": "要換掉你目前的助記詞嗎？",
  "wallet.backup.replace_body":
    "你已經有一組復原助記詞了。復原另一組會把它換掉。舊助記詞已涵蓋的幣在這台裝置上仍然花得出去，但不再可以復原，所以請先確認舊的字已經抄下來，再繼續。",
  "wallet.backup.replace": "取代",
  "wallet.backup.invalid_phrase": "那組助記詞無效",
  "wallet.backup.invalid_phrase_body":
    "助記詞本身帶著檢查碼，而這一組沒有通過。請檢查有沒有打錯、漏掉或前後顛倒的字。",
  "wallet.backup.not_bip39":
    "這些不是 BIP-39 字表裡的字：{words}。請檢查拼法。",
  "wallet.backup.add_mint_first": "請先新增鑄幣廠",
  "wallet.backup.add_mint_first_body":
    "復原的原理是去問鑄幣廠它幫你簽過哪些幣，所以它得知道要問哪一個鑄幣廠。先把你用過的鑄幣廠加上，再復原。",
  "wallet.backup.restore_failed": "復原失敗",
  "wallet.backup.phrase": "復原助記詞",
  "wallet.backup.state_unconfirmed": "備份已開啟但未確認",
  "wallet.backup.state_off": "備份已關閉",
  "wallet.backup.badge_on": "開",
  "wallet.backup.badge_unconfirmed": "未確認",
  "wallet.backup.badge_off": "關",
  "wallet.backup.view": "查看復原助記詞",
  "wallet.backup.setup": "設定復原助記詞",
  "wallet.backup.view_short": "查看助記詞",
  "wallet.backup.setup_short": "設定",
  "wallet.backup.restore": "用復原助記詞還原一個錢包",
  "wallet.backup.restore_short": "還原",
  "wallet.backup.setup_title": "設定復原助記詞",
  "wallet.backup.on_body_short": "你的餘額可以用那十二個字在新裝置上重建。",
  "wallet.backup.unconfirmed_body":
    "你從來沒有確認過已經抄了一份。現在這些字只存在於這支手機上，而備份本來就是為了在手機沒了之後還能用。請查看助記詞並把它抄下來。",
  "wallet.backup.not_covered":
    "{amount} 還沒被涵蓋。別人給你的幣帶著對方的秘密，只有換過一次之後才會歸入你的助記詞。到鑄幣廠重新整理一下就能把它們保住。",
  "wallet.backup.off_body":
    "你的 ecash 只存在於這支手機上。如果它不見了，沒有人能把錢找回來，包括你自己。復原助記詞是十二個字，能在任何地方重建你的餘額。",
  "wallet.backup.about_to_see": "你即將看到十二個字。它們就是錢本身。",
  "wallet.backup.exact_order":
    "十二個字，順序必須完全一樣。誰拿到它們，誰就拿到了你的餘額。",
  "wallet.backup.verify_body":
    "沒人抄下來的助記詞比沒有助記詞更糟，因為它看起來像一張安全網，實際上並不存在。請確認其中兩個字。",
  "wallet.backup.verify_mismatch": "對不上。請核對你抄下來的那份。",
  "wallet.backup.restore_body":
    "輸入這十二個字。Airhop 會重新推導出你的幣，並逐一問每個鑄幣廠簽過其中哪些，於是餘額就從鑄幣廠留存的紀錄裡回來了。",
  "wallet.backup.warn_secret":
    "任何讀到它們的人都能拿走你的餘額。不要截圖，也不要存在這支手機上。",
  "wallet.backup.warn_paper":
    "把它們寫在紙上，收在安全的地方。如果手機沒了，Airhop 無法再把它們顯示給你。",
  "wallet.backup.warn_scope":
    "它們只能重建你的 ecash。你的身分、聊天和聯絡人不在涵蓋範圍內。",
  "wallet.backup.warn_mints":
    "復原一定得去問鑄幣廠它簽過哪些幣，所以請把你的鑄幣廠清單和這些字寫在一起。",
  "wallet.backup.preparing": "準備中…",
  "wallet.backup.show_phrase": "顯示我的助記詞",
  "wallet.backup.your_phrase": "你的復原助記詞",
  "wallet.backup.write_down": "把這些抄下來",
  "wallet.backup.copy_phrase": "把復原助記詞複製到剪貼簿",
  "wallet.backup.copy_clipboard": "複製到剪貼簿",
  "wallet.backup.written_down": "我已經抄下來了",
  "wallet.backup.check_copy": "核對你抄的那份",
  "wallet.backup.confirm": "確認",
  "wallet.backup.restore_title": "用助記詞還原",
  "wallet.backup.phrase_placeholder": "十二個字，用空格分隔",
  "wallet.backup.no_mints_yet":
    "還沒有新增鑄幣廠。復原一定得去問某個特定的鑄幣廠，所以請先把你用過的加上。",
  "wallet.backup.scanning": "掃描中…",
  "wallet.backup.restore_progress": "{mint} · 金鑰組 {step}/{total}",
  "wallet.backup.will_scan":
    "將掃描：{mints}。沒有新增過的鑄幣廠永遠不會被問到，所以那裡的餘額是看不見的。",
  "wallet.backup.word_n": "第 {position} 個字",
  "wallet.backup.unreachable_mints":
    "連不上：{mints}。那裡的餘額還在。等網路好一點時再試。",
  "wallet.backup.nothing_recovered": "從掃描過的鑄幣廠裡沒有復原出任何東西。",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "標記為已收到？",
  "wallet.delivered.body":
    "這會永久釋出 {amount} {unit}。如果它其實從來沒送到，你將無法再收回。",
  "wallet.delivered.body_generic":
    "這會永久釋出保留的金額。如果它其實從來沒送到，你將無法再收回。",
  "wallet.delivered.cancel": "還不要",
  "wallet.delivered.confirm": "對方收到了",
  "wallet.reclaim.title": "要收回這個代幣嗎？",
  "wallet.reclaim.body":
    "這 {amount} {unit} 會回到你的餘額。只有在代幣確實沒到任何人手上時才這麼做：如果對方已經拿到那串字，誰先在鑄幣廠兌付誰就拿走這筆錢，而那有可能是對方。",
  "wallet.reclaim.keep": "保持待處理",
  "wallet.reclaim.confirm": "收回",
  "wallet.copied.token_body":
    "代幣已經在你的剪貼簿上。在你標記為已送達之前它一直保留在這裡，所以第一次沒成的話可以再貼一次。",
  "wallet.copied.phrase_body":
    "把它貼進密碼管理程式，然後清空剪貼簿。其他 App 讀得到剪貼簿，而且在有些設定下它還會同步到你的其他裝置。",
  "wallet.refresh.failed": "重新整理失敗",
  "wallet.refresh.partly": "部分重新整理",
  "wallet.refresh.done": "已重新整理",
  "wallet.refresh.unreachable": "連不上 {mints}。其餘部分都是最新的。",
  "wallet.refresh.swapped": "{amount} {unit} 已確認並換成了新的憑證。",
  "wallet.refresh.secured": "{amount} {unit} 現在已被你的復原助記詞涵蓋。",
  "wallet.refresh.all_confirmed": "這裡的一切都已經向鑄幣廠確認過了。",
  "wallet.pending.title": "待處理",
  "wallet.pending.reserved_desc":
    "已建立並保留，送達未確認。這些憑證被從你的餘額扣住，以免被花兩次。",
  "wallet.pending.locked_desc":
    "已經鎖到收款方的金鑰上，所以只有對方花得了。只是還沒送到對方手上。分享這個代幣就能完成。",
  "wallet.pending.show_qr": "把這個代幣顯示成 QR 碼",
  "wallet.pending.copy_again": "再複製一次代幣",
  "wallet.pending.share_again": "再分享一次代幣",
  "wallet.pending.mark_delivered": "把這個代幣標記為已送達",
  "wallet.pending.delivered": "已送達",
  "wallet.pending.reclaim_into": "把這個代幣收回你的餘額",
  "wallet.activity.title": "動態",
  "wallet.activity.none": "還沒有內容",
  "wallet.activity.none_desc":
    "你送出和收到的付款會顯示在這裡，最新的在前，並附上各自的鑄幣廠和手續費。",
  "wallet.activity.show_fewer": "少顯示一些付款",
  "wallet.activity.show_less": "收合",
  "wallet.activity.received_unconfirmed": "已收到，未確認",
  "wallet.activity.received": "已收到",
  "wallet.activity.receive_failed": "接收失敗",
  "wallet.activity.reclaimed": "已收回",
  "wallet.activity.send_failed": "傳送失敗",
  "wallet.activity.sent": "已傳送",
  "wallet.activity.status_pending": "待處理",
  "wallet.activity.status_failed": "失敗",
  "wallet.activity.status_reclaimed": "已收回",
  "wallet.activity.status_expired": "已過期",
  "wallet.activity.ln_deposit": "Lightning 存入",
  "wallet.activity.ln_withdrawal": "Lightning 提領",
  "wallet.activity.nutzap_received": "收到 Nutzap",
  "wallet.activity.spent_removed": "已花用的憑證已移除",
  "wallet.activity.refreshed": "憑證已重新整理",
  "wallet.activity.refreshing": "正在重新整理憑證",
  "wallet.activity.just_now": "剛剛",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "網狀網路已離線",
  "wallet.mesh_offline_body":
    "網狀網路服務沒有在跑，所以沒有地方可以把代幣交出去。它會留在待處理裡保持保留。",
  "wallet.xfer.route_mesh": "已透過網狀網路直接交到對方裝置上。",
  "wallet.xfer.route_nostr": "對方不在藍牙範圍內，所以改走了網路。",
  "wallet.xfer.route_courier":
    "現在沒有通往對方的路徑。它會由其他裝置捎帶，等某台裝置遇到對方時送達。",
  "wallet.xfer.route_queued":
    "現在還聯絡不上對方。它已排隊，等對方觸及得到時馬上送出。",
  "wallet.xfer.mesh_offline_body":
    "網狀網路服務沒有在跑，所以沒有辦法把代幣交出去。沒有扣掉任何金額。",
  "wallet.xfer.could_not_send": "無法傳送",
  "wallet.xfer.inexact_body":
    "你的憑證在離線狀態下湊不出剛好 {amount} {unit}。能建立的最小代幣是 {spend} {unit}，多出的 {extra} {unit} 會歸對方，而且要不回來。\n\n連上網路時到鑄幣廠重新整理一次，會把你的憑證拆成湊得出這個精確金額的面額。",
  "wallet.xfer.send_amount": "傳送 {amount}",
  "wallet.xfer.mesh_offline": "網狀網路已離線",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "已鎖到對方的金鑰並發布到 Nostr。不管對方在不在線上，它都屬於對方。",
  "wallet.pay.rail_nutzap_dm":
    "已鎖到對方的金鑰。中繼不肯收，所以它改以訊息的形式送給了對方。",
  "wallet.pay.rail_nutzap_undelivered":
    "已鎖到對方的金鑰，但還沒有東西能把它帶過去。它已排隊，代幣在待處理裡。",
  "wallet.pay.final": "已鎖定的付款無法收回：現在只有對方的金鑰花得了這些幣。",
  "wallet.pay.reclaimable": "在你確認它已送達之前，都可以從錢包分頁收回。",
  "wallet.pay.why": "之所以走這條路，是因為{reason}。",
  "wallet.pay.sent_title": "{amount} {unit} 給 {name}",
  "wallet.pay.thread_receipt": "你送出了 {amount} {unit}，已鎖到對方的金鑰。",
  "wallet.pay.title": "傳送 ecash",
  "wallet.pay.to": "給 {name}",
  "wallet.pay.amount": "金額（sat）",
  "wallet.pay.memo": "備註（選填，公開）",
  "wallet.pay.send": "傳送",
  "wallet.pay.sending": "傳送中…",
  "wallet.pay.action": "傳送 ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "相機存取權",
  "wallet.scan.camera_purpose": "掃描 ecash QR 碼",
  "wallet.scan.photo_label": "照片存取權",
  "wallet.scan.photo_purpose": "從圖片中讀出 ecash QR 碼",
  "wallet.scan.no_token": "那張圖裡沒有找到 ecash 代幣。",
  "wallet.scan.no_invoice": "那張圖裡沒有找到 Lightning 發票。",
  "wallet.scan.unreadable": "無法讀取那張圖。",
  "wallet.scan.camera_failed": "無法啟動相機。請關掉其他相機 App 後再試一次。",
  "wallet.scan.close": "關閉掃描器",
  "wallet.scan.on_device": "它是在這台裝置上讀的；任何內容都不會送往別處。",
  "wallet.scan.aim_token": "對準一個 ecash QR 碼。",
  "wallet.scan.aim_invoice": "對準一個 Lightning 發票 QR 碼。",
  "wallet.scan.title_token": "掃描 ecash",
  "wallet.scan.title_invoice": "掃描發票",
  "wallet.scan.desc_token":
    "讀取來自另一個錢包的 Cashu 代幣。任何 Cashu 錢包都適用，不限於 Airhop。",
  "wallet.scan.desc_invoice": "讀取一張 Lightning 發票，用你的餘額付掉它。",
  "wallet.scan.use_camera_a11y": "用相機掃描",
  "wallet.scan.use_camera": "使用相機",
  "wallet.scan.pick_image_a11y": "從已儲存的圖片中讀取 QR 碼",
  "wallet.scan.pick_image": "從照片中挑選",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu 是什麼？",
  "wallet.explain.intro":
    "Cashu 是比特幣的 ecash。代幣是一串字，誰拿著它就等於拿著錢，它由鑄幣廠盲簽，所以鑄幣廠分不出是誰花了哪一筆。沒有帳戶，也不用登入。",
  "wallet.explain.send": "傳送",
  "wallet.explain.send_desc":
    "把一筆金額變成代幣，可以透過藍牙交給附近的節點，也可以當成文字分享。不需要網路。在你確認它已到手之前，憑證會一直保留著。",
  "wallet.explain.receive": "接收",
  "wallet.explain.receive_desc":
    "貼上一個代幣就能加進來。連上網路時它會立刻在鑄幣廠換新，因而可以被證明屬於你。離線時它會被存起來並標為未確認，直到你重新整理。",
  "wallet.explain.zap": "打閃",
  "wallet.explain.zap_desc":
    "付款給一個 Nostr 身分。如果對方公布了 NIP-61 nutzap 資訊，這筆 ecash 會鎖到對方的金鑰上，只有對方花得了。否則會退回到加密私訊的方式。需要網路。",
  "wallet.explain.add_mint": "新增鑄幣廠",
  "wallet.explain.add_mint_desc":
    "儲存發行和兌付你 ecash 的鑄幣廠，並快取它的公鑰，好讓來自它的代幣能夠離線核對。請挑一個你願意託付這筆餘額的鑄幣廠。",
  "wallet.explain.phrase": "復原助記詞",
  "wallet.explain.phrase_desc":
    "你的幣是從錢包一開始產生的十二個字推導出來的，所以一支新手機可以靠著問你的鑄幣廠簽過哪些幣來重建餘額。在你查看並抄下它們之前，它們只存在於這支手機上。",

  // ---- Wallet: failures ----
  "wallet.err.locked": "錢包已鎖定",
  "wallet.err.mint_unreachable": "連不上鑄幣廠",
  "wallet.err.tor_blocked": "Tor 開啟期間被擋下",
  "wallet.err.insufficient": "餘額不足",
  "wallet.err.exact_amount": "送不出這個精確金額",
  "wallet.err.no_mint": "沒有鑄幣廠",
  "wallet.err.mint_unsupported": "鑄幣廠做不到這件事",
  "wallet.err.mint_refused": "鑄幣廠拒絕了",
  "wallet.err.unreadable": "讀不出來的代幣",
  "wallet.err.rejected": "代幣被拒絕",
  "wallet.err.already_spent": "已被花用",
  "wallet.err.change_pending": "已付款，找零待退",
  "wallet.svc.mint_unreachable": "連不上鑄幣廠。",
  "wallet.svc.tor_ios": "在 iOS 上，鑄幣廠請求不走 Tor。",
  "wallet.svc.tor_ios_body":
    "Arti 只包住 Nostr 的 WebSocket，所以這個請求會走明網到鑄幣廠，把你的 IP 和這些憑證連在一起。可以在設定 > 安全裡允許它，或者先把 Tor 關掉。透過網狀網路收付 ecash 仍然可用。",
  "wallet.svc.keys_uncached": "這個鑄幣廠的金鑰沒有快取在這台裝置上。",
  "wallet.svc.keys_uncached_body": "連上網路時開啟一次錢包就能取回它們。",
  "wallet.svc.phrase_invalid": "那組復原助記詞無效。",
  "wallet.svc.phrase_invalid_body":
    "請檢查有沒有打錯或漏掉的字。助記詞本身帶著檢查碼，所以只要錯一個字，整組就無效。",
  "wallet.svc.need_mint": "請先至少新增一個鑄幣廠。",
  "wallet.svc.need_mint_body":
    "復原的原理是去問鑄幣廠它幫你簽過哪些幣，所以它得知道要問哪一個鑄幣廠。",
  "wallet.svc.restored": "已從復原助記詞還原",
  "wallet.svc.storage_locked": "錢包儲存已鎖定。",
  "wallet.svc.storage_locked_body":
    "Airhop 把 ecash 憑證存在一個加密檔案裡，它的金鑰放在裝置鑰匙圈中。請解鎖裝置並重新開啟 App。",
  "wallet.svc.bad_url": "那不是有效的 URL。",
  "wallet.svc.needs_https": "鑄幣廠 URL 必須以 https:// 開頭。",
  "wallet.svc.refuse_http": "拒絕透過明文 http 使用鑄幣廠。",
  "wallet.svc.refuse_http_body":
    "網路路徑上的任何人都讀得到或改得了你的憑證。請使用 https:// 的鑄幣廠。",
  "wallet.svc.mint_not_saved": "鑄幣廠無法儲存。",
  "wallet.svc.unreadable_token": "那不是一個讀得出來的 Cashu 代幣。",
  "wallet.svc.unreadable_token_body":
    "代幣以 cashuA 或 cashuB 開頭。請檢查複製時有沒有被截掉。",
  "wallet.svc.wrong_mint": "這個代幣並不是由它指名的鑄幣廠簽發的。",
  "wallet.svc.already_spent": "這些憑證已經被花掉了。",
  "wallet.svc.already_spent_body":
    "送這個代幣的人自己先兌付了，或者把同一個代幣也送給了別人。",
  "wallet.svc.receiving_offline": "離線接收",
  "wallet.svc.amount_positive": "請輸入大於零的金額。",
  "wallet.svc.coins_raced": "那些幣剛剛被另一筆付款用掉了。",
  "wallet.svc.coins_raced_body": "沒有扣掉任何金額。再試一次，錢包會挑另一組。",
  "wallet.svc.no_ecash": "還沒有 ecash。",
  "wallet.svc.no_ecash_body":
    "新增一個鑄幣廠並透過 Lightning 存入，或者從別人那裡收一個代幣。",
  "wallet.svc.split_across_mints": "你的餘額分散在好幾個鑄幣廠。",
  "wallet.svc.mint_says_spent": "鑄幣廠回報這些憑證已被花用。",
  "wallet.svc.issue_against_invoice": "憑 Lightning 發票發行 ecash",
  "wallet.svc.pay_invoice": "付掉一張 Lightning 發票",
  "wallet.svc.unknown_deposit": "未知的存入。",
  "wallet.svc.invoice_expired_before": "這張發票在被付掉之前就過期了。",
  "wallet.svc.invoice_expired": "那張發票已過期。",
  "wallet.svc.invoice_unpaid": "這張發票還沒有被付掉。",
  "wallet.svc.payment_unknown": "付款狀態未知；下次重新整理時會再查一遍。",
  "wallet.svc.melt_change_pending": "你的發票已付款。",
  "wallet.svc.melt_change_pending_body":
    "鑄幣廠還沒退回沒用掉的路由費。它會在下次重新整理時自動領回，這期間不會有任何損失。",
  "wallet.svc.mint_did_not_pay": "鑄幣廠沒有付掉這張發票。你的餘額沒有變動。",
  "wallet.svc.not_an_invoice": "那不是一張 Lightning 發票。",
  "wallet.svc.not_an_invoice_body": "請貼上以 lnbc 開頭的 bolt11 發票。",
  "wallet.svc.insufficient_for_invoice": "餘額不足以付掉這張發票。",
  "wallet.svc.coins_raced_invoice_body":
    "沒有扣掉任何金額，發票也沒有被付掉。請再試一次。",
  "wallet.svc.same_mint": "請挑一個不同的目的地鑄幣廠。",
  "wallet.svc.same_mint_body":
    "來源和目的地是同一個鑄幣廠，所以沒有什麼好搬的。",
  "wallet.svc.quote_failed_retried": "報價失敗，已重試整合",
  "wallet.svc.amount_unfit_retried": "金額不合適，已重試整合",
  "wallet.svc.cannot_size": "無法決定這筆搬移的額度。",
  "wallet.svc.insufficient_at_mint": "{mint} 的餘額不足。",
  "wallet.svc.inexact_title":
    "你的憑證在離線狀態下湊不出剛好 {amount} {unit}。",
  "wallet.svc.inexact_detail":
    "你送得出的最小代幣是 {spend} {unit}。離線是沒有找零的，所以多出的 {extra} {unit} 會歸收款方。",
  "wallet.svc.no_single_mint":
    "沒有哪一個鑄幣廠單獨持有 {amount} {unit}。來自不同鑄幣廠的 ecash 無法併成一個代幣：請先在一個鑄幣廠整合，或者分成幾筆送出。",
  "wallet.svc.have_tried_send": "你有 {total} {unit}，卻想送出 {amount}。",
  "wallet.svc.invoice_needs":
    "這張發票連同路由保留額共需 {total} {unit}，而你有 {balance}。",
  "wallet.svc.nothing_to_move": "{mint} 沒有可搬移的 {unit}。",
  "wallet.svc.consolidate_memo": "從 {mint} 整合",
  "wallet.svc.cannot_size_detail":
    "扣掉 Lightning 路由費後，{from} 無法搬出有意義的金額到 {to}。可以試著改成搬一筆特定的小額。",
  "wallet.svc.mint_cannot": "{mint} 無法{action}。",
  "wallet.svc.no_nut": "該鑄幣廠沒有宣告支援 NUT-{nut}。",
  "wallet.svc.unknown_mint": "那筆付款指名的鑄幣廠你並沒有在用。",
  "wallet.svc.unknown_mint_body":
    "如果你信任它，請先自己把這個鑄幣廠加上；不會從你沒有選過的鑄幣廠兌付任何東西。",
  "wallet.svc.no_relay": "沒有中繼連線",
  "wallet.svc.no_shared_mint": "沒有餘額足夠的共同鑄幣廠",
  "wallet.svc.no_nutzap_info":
    "收款方沒有公布 nutzap 資訊（NIP-61 kind 10019）",
  "wallet.svc.locked_undelivered":
    "已鎖到對方的金鑰但尚未送達。從這筆交易分享代幣就能完成。",
  "wallet.svc.swap_lost":
    "鑄幣廠始終沒有完成這次換新，所以沒有憑它發行任何東西。",
  "wallet.svc.swap_unreadable": "這次換新存下來的格式，目前版本無法重放。",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "已透過 QR 碼驗證",
  "contacts.qr.keys_unverified": "已收到金鑰，尚未驗證",
  "contacts.qr.not_verified": "尚未驗證",
  "contacts.qr.message": "訊息",
  "contacts.qr.add": "新增聯絡人",
  "contacts.qr.scan_title": "掃描 QR 碼",
  "contacts.qr.aim": "把相機對準對方的 QR 碼",
  "contacts.qr.add_desc": "聯絡上那些不在網狀網路附近的人。",
  "contacts.qr.peer_id_hint":
    "節點 ID 是 16 個字元。聯絡人代碼以 airhop: 開頭。",
  "contacts.qr.or_scan": "或者掃描對方的 QR 碼",
  "contacts.qr.trust_note":
    "只有你用相機親自掃到的 QR 碼才算驗證過對方的金鑰。貼上的代碼帶著對方的金鑰，卻沒有它確實出自對方的證明。",
  "contacts.qr.peer_id": "節點 ID 或聯絡人代碼",
  "contacts.qr.peer_id_placeholder": "貼上一個 ID 或聯絡人代碼",
  "contacts.qr.scan_camera_a11y": "用相機掃描 QR 碼",
  "contacts.qr.scan_camera_desc": "使用你的相機",
  "contacts.qr.upload_a11y": "從相簿上傳 QR 碼圖片",
  "contacts.qr.upload": "從相簿上傳",
  "contacts.qr.upload_desc": "挑一張存過的 QR 碼圖片",
  "contacts.qr.scan_a11y": "透過掃描 QR 碼新增聯絡人",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "請貼上一個 16 個字元的節點 ID、一個 airhop://peer/… 連結，或者一個聯絡人代碼。",
  "contacts.scan.camera_label": "相機存取權",
  "contacts.scan.camera_purpose": "掃描聯絡人的 QR 碼",
  "contacts.scan.camera_needed":
    "掃描需要相機存取權。你仍然可以用節點 ID 新增。",
  "contacts.scan.camera_failed":
    "無法啟動相機。請關掉其他相機 App 後再試一次。",
  "contacts.scan.photo_label": "照片存取權",
  "contacts.scan.photo_purpose": "掃描你存過的 QR 碼",
  "contacts.scan.photo_needed":
    "挑選圖片需要照片存取權。你仍然可以用節點 ID 新增。",
  "contacts.scan.no_qr": "那張圖裡沒有找到 Airhop QR 碼。",
  "contacts.scan.unreadable": "無法從那張圖裡讀出 QR 碼。",
  "contacts.scan.bitchat_expired":
    "那個 bitchat 代碼已過期。請對方重新開啟自己的 QR 碼。",
  "contacts.scan.tampered":
    "這個 QR 碼無效：它的節點 ID 和它的金鑰對不上。它可能被人動過手腳。",
  "contacts.scan.already_added": "已經在你的聯絡人裡",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "正在等待相機存取權…",
  "contacts.verify.camera_off": "相機已關閉",
  "contacts.verify.open_settings": "開啟設定",
  "contacts.verify.verified": "已驗證",
  "contacts.verify.different": "是別的聯絡人",
  "contacts.verify.scan_again": "再掃一次",
  "contacts.verify.failed": "無法驗證",
  "contacts.verify.done": "完成",
  "contacts.verify.title": "驗證 {name}",
  "contacts.verify.aim": "把相機對準對方的 QR 碼",
  "contacts.verify.camera_off_body":
    "請在設定中開啟相機存取權，以便用 QR 碼驗證。",
  "contacts.verify.match_body": "{name} 的金鑰對得上。你可以信任這位聯絡人。",
  "contacts.verify.different_body":
    "這個 QR 碼屬於別人。請 {name} 出示自己的代碼。",
  "contacts.verify.tampered_body":
    "這個 QR 碼看起來被動過手腳：它的 ID 和它的金鑰對不上。",
  "contacts.verify.choose_title": "你想怎麼核對？",
  "contacts.verify.choose_body":
    "兩種方式都能確認這支手機上的金鑰確實屬於 {name}。",
  "contacts.verify.method_scan": "掃描對方的代碼",
  "contacts.verify.method_scan_sub": "對方就在你身邊",
  "contacts.verify.method_compare": "核對一段代碼",
  "contacts.verify.method_compare_sub": "在通話中念給彼此聽",
  "contacts.verify.no_keys":
    "這位聯絡人還沒有金鑰。傳則訊息給對方，或者見面時掃一下對方的代碼。",
  "contacts.verify.compare_title": "把這些念給彼此聽",
  "contacts.verify.compare_body":
    "{name} 看到的是同樣的六個字。如果對得上，你們雙方就都知道這些金鑰是真的。",
  "contacts.verify.codes_match": "對得上",
  "contacts.verify.codes_differ": "對不上",
  "contacts.verify.compared_body":
    "你和 {name} 確認了同一段代碼。這位聯絡人已驗證。",

  // ---- Settings: shared chrome ----
  "settings.back": "返回",
  "settings.coming_soon": "即將推出",
  "settings.opens_externally": "{label}，會在 App 外開啟",
  "settings.peer_id": "節點 ID",
  "settings.share_peer_id": "分享你的節點 ID",
  "settings.share_id_short": "分享 ID",
  "settings.peer_id_sheet.title": "你的節點 ID",
  "settings.peer_id_sheet.copy": "複製節點 ID",
  "settings.peer_id_sheet.note":
    "只有你們雙方都在藍牙範圍內時才有用。想讓別人從任何地方傳訊息給你，請改為分享你的 QR 碼。",

  // ---- Settings: hub rows ----
  "settings.section.general": "一般",
  "settings.section.general_desc": "選用功能、收回傳送、媒體、重設",
  "settings.section.privacy": "隱私與安全",
  "settings.section.privacy_desc": "前向保密、簽章封包、已封鎖的節點",
  "settings.section.network": "網路與中繼",
  "settings.section.network_desc": "網路備援、nostr 中繼、bitchat 相容",
  "settings.section.permissions": "權限",
  "settings.section.permissions_desc": "藍牙、定位、通知、相機、麥克風",
  "settings.section.storage": "儲存與資料",
  "settings.section.diagnostics": "診斷",

  // ---- Settings: group headings ----
  "settings.group.transports": "傳輸方式",
  "settings.group.internet": "網際網路",
  "settings.group.nearby": "附近",
  "settings.group.sync": "同步",
  "settings.group.features": "功能",
  "settings.group.messages": "訊息",
  "settings.group.local": "本機",
  "settings.group.media": "媒體",
  "settings.group.reset": "重設",
  "settings.group.always_on": "永遠開啟",
  "settings.group.notifications": "通知",
  "settings.group.blocked": "已封鎖",
  "settings.group.theme": "主題",
  "settings.group.font": "字體",
  "settings.group.language": "語言",
  "settings.section.diagnostics_desc": "連線狀態與附近裝置",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "藍牙連線",
  "settings.diag.ble_links_desc": "這支手機直接連著的裝置",
  "settings.diag.lan": "區域網路",
  "settings.diag.lan_desc": "同一 Wi-Fi 網路下的手機",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "不需要路由器的手機對手機",
  "settings.diag.wifi_active": "執行中",
  "settings.diag.wifi_unsupported": "這台裝置不支援",
  "settings.diag.wifi_permission": "被某項權限擋下",
  "settings.diag.wifi_unavailable": "現在無法使用",
  "settings.diag.wifi_unpaired": "未配對",
  "settings.diag.wifi_unknown": "等待無線模組",
  "settings.diag.relays": "Nostr 中繼",
  "settings.diag.relays_desc": "用於位置頻道和網路觸及",
  "settings.diag.connected": "已連線",
  "settings.diag.disconnected": "未連線",
  "settings.diag.peer_direct": "直接連線",
  "settings.diag.peer_relayed": "經由另一台裝置聽到",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "沒有訊號讀數",
  "settings.diag.no_peers": "範圍內沒有人",
  "settings.diag.no_peers_desc": "已開啟 {links} 條無線連線",
  "settings.diag.gcs_size": "篩選器大小",
  "settings.diag.gcs_size_desc": "送上空中的最大同步篩選器",
  "settings.diag.fpr": "誤判率",
  "settings.diag.fpr_desc": "篩選器多常會誤稱我們少了某個封包",
  "settings.diag.bytes": "{n} 位元組",
  "settings.diag.footnote":
    "這裡的內容都不能改。這些數值是固定的，好讓 Airhop 保持與 bitchat 相容。",
  "settings.section.storage_desc": "用量與快取",
  "settings.section.appearance": "外觀",
  "settings.section.appearance_desc": "主題、字體和語言",
  "settings.section.help": "說明與意見回饋",
  "settings.section.help_desc": "聯絡我們、回報問題，或閱讀常見問題",
  "settings.section.support": "支持",
  "settings.section.support_desc": "幫助開發持續下去",
  "settings.section.about": "關於",
  "settings.section.about_desc": "版本、變更紀錄和原始碼",

  // ---- Settings: general ----
  "settings.general.undo": "收回傳送",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "錢包",
  "settings.general.undo_seconds": "{count} 秒",
  "settings.general.undo_a11y": "收回傳送：{value}",
  "settings.general.quality_a11y": "把上傳品質設為 {value}",
  "settings.general.undo_desc":
    "把送出的訊息短暫留住，好讓你在它真正送出前收回",
  "settings.general.undo_off_desc": "立刻傳送，不能收回",
  "settings.general.undo_2": "2 秒",
  "settings.general.undo_2_desc": "一個快速收回的機會",
  "settings.general.undo_10": "10 秒",
  "settings.general.undo_10_desc": "最長的時間窗",
  "settings.general.quality": "上傳品質",
  "settings.general.quality_desc":
    "適用於從相機或圖庫送出的照片。不管哪一檔，每張照片都會被調整到適合網狀網路的尺寸。",
  "settings.general.quality_low": "低",
  "settings.general.quality_low_desc": "照片最小，送得最快",
  "settings.general.quality_medium": "中",
  "settings.general.quality_medium_desc": "細節與速度兼顧",
  "settings.general.quality_high": "高",
  "settings.general.quality_high_desc": "保留最多細節",
  "settings.general.feature_wallet_desc": "透過網狀網路點對點傳送 Cashu ecash",
  "settings.general.feature_wallet_a11y": "錢包（永遠開啟）",
  "settings.general.feature_ai_desc": "私密的裝置端助理，不發出任何網路請求",
  "settings.general.feature_feeds": "動態消息",
  "settings.general.feature_feeds_desc":
    "閱讀 Bluesky 和 Mastodon 的動態消息並發文",
  "settings.general.show_media": "自動顯示媒體",
  "settings.general.show_media_desc":
    "照片和影片直接出現在聊天裡，或者點一下才顯示",
  "settings.general.reset": "重設設定",
  "settings.general.media_retention": "媒體保留時間",
  "settings.general.media_retention_desc":
    "照片、影片和語音留言會在所選時間後被刪除",
  "settings.general.media_retention_sheet":
    "選擇媒體在這台裝置上留多久。刪掉的媒體無法復原。",
  "settings.general.retention_7_desc":
    "留下的痕跡最少。如果風險來自手機本身，這一檔最合適。",
  "settings.general.retention_14_desc":
    "折衷的選擇，適合一兩週沒有訊號的情況。",
  "settings.general.retention_30_desc":
    "對話讀得到的時間最長，佔用的磁碟也最多。",
  "settings.general.reset_desc":
    "把每一項偏好設定回復為預設值，你的身分、訊息、聯絡人和錢包都不受影響",
  "settings.general.reset_title": "重設設定？",
  "settings.general.reset_body":
    "每一項偏好設定都會回復預設：外觀、收回傳送，以及連線相關項目（網路、Tor、閘道、橋接、中繼）。你的身分、訊息、聯絡人和錢包不受影響。",
  "settings.general.reset_confirm": "重設",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "前向保密",
  "settings.security.forward_secrecy_desc": "私訊永遠啟用 Double Ratchet",
  "settings.security.signed_packets": "簽章封包",
  "settings.security.signed_packets_desc": "每個封包都經過 Ed25519 簽章",
  "settings.security.hide_previews": "隱藏通知預覽",
  "settings.security.hide_previews_desc":
    "不讓寄件者和訊息出現在鎖定畫面上，因為鎖定畫面不解鎖就看得到它們",
  "settings.security.no_blocked": "沒有被封鎖的節點",
  "settings.security.no_blocked_desc":
    "被封鎖的節點不能傳訊息給你，也不會出現在網狀網路分頁",
  "settings.security.unblock_title": "解除封鎖這個節點",
  "settings.security.unblock": "解除封鎖",
  "settings.security.unblock_peer": "解除封鎖 {name}",
  "settings.security.unblock_body":
    "{name} 將可以再次傳訊息給你，在附近時也會重新出現在網狀網路分頁。",

  // ---- Settings: network and relays ----
  "settings.network.internet": "網路備援",
  "settings.network.internet_desc":
    "當網狀網路節點不在範圍內時，改由 Nostr 中繼接手",
  "settings.network.internet_off_title": "要關閉網路嗎？",
  "settings.network.internet_off_body":
    "Airhop 將只走藍牙。它會停止聯絡任何 Nostr 中繼，Tor、網路閘道和網狀網路橋接也都會關閉。附近的藍牙聊天照常可用。",
  "settings.network.turn_off": "關閉",
  "settings.network.discovery": "地理中繼探索",
  "settings.network.discovery_desc":
    "從 300 多個分散式中繼中，為某個位置網格自動選出最近的那些",
  "settings.network.discovery_needs_relay": "請先新增一個自訂中繼",
  "settings.network.discovery_needs_relay_body":
    "正是自動探索在為 Airhop 指出最近的中繼。只有等你在下面釘好自己的中繼之後，把它關掉才說得通，所以請先至少加一個。",
  "settings.network.custom_only_title": "只用你的自訂中繼嗎？",
  "settings.network.custom_only_body":
    "位置頻道和網狀網路橋接將不再自動挑選最近的中繼，只用你新增的那些。這可能會縮小涵蓋範圍，而且你可能再也遇不到 bitchat 使用者，因為他們都聚在最近的中繼上。",
  "settings.network.custom": "自訂中繼",
  "settings.network.custom_desc": "為位置頻道和網狀網路橋接新增你自己的中繼",
  "settings.network.custom_added": "已新增 {count} 個，上限 {max} 個",
  "settings.network.dm_relays": "訊息中繼",
  "settings.network.dm_relays_desc":
    "私訊和私密頻道永遠使用這些。自訂中繼不會改變它們。",
  "settings.network.discovery_back_on": "地理中繼探索已重新開啟",
  "settings.network.discovery_back_on_body":
    "那是你最後一個自訂中繼。位置頻道總得有地方發布，所以 Airhop 又開始自動挑選最近的中繼了。",
  "settings.network.add_relay": "新增中繼",
  "settings.network.remove_relay": "移除 {url}",
  "settings.network.add_short": "新增",
  "settings.network.relay_limit":
    "你最多能新增 {count} 個中繼。先移除一個才能再加。",
  "settings.network.relay_duplicate": "那個中繼已經在你的清單裡了。",
  "settings.network.relay_invalid":
    "請輸入有效的中繼主機名稱，例如 relay.example.com。只有當中繼不用預設連接埠時才需要寫連接埠。不允許使用 IP 位址和本機名稱。",
  "settings.network.lan": "本機網路",
  "settings.network.lan_desc":
    "聯繫同一 WiFi 上的人，iPhone 與 Android 之間也可以。網路上的其他裝置能看到你正在執行 Airhop。",
  "settings.network.lan_searching": "此網路上沒有 Airhop 裝置",
  "settings.network.lan_active": "已在此網路上連線",
  "settings.network.lan_unavailable": "未連上 WiFi 網路",
  "settings.network.lan_permission": "Airhop 的本機網路存取已關閉",
  "settings.network.lan_unsupported": "此裝置不支援",
  "settings.network.lan_foreground":
    "Airhop 進入背景時會暫停。藍牙會繼續運作。",
  "settings.network.wifi_pair": "配對",
  "settings.network.wifi_paired": "已配對的裝置",
  "settings.network.wifi_pair_find": "尋找裝置",
  "settings.network.wifi_pair_find_desc":
    "尋找附近正在顯示自己的iPhone。兩台裝置都需為iOS 26或更新版本。",
  "settings.network.wifi_pair_show": "顯示這台iPhone",
  "settings.network.wifi_pair_show_desc":
    "讓附近的iPhone找到這台。一人尋找，另一人顯示，同時進行。",
  "settings.network.wifi_pair_find_action": "選擇附近的iPhone",
  "settings.network.wifi_pair_show_action": "讓這台iPhone可被發現",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware目前無法使用",
  "settings.network.wifi_pair_forget": "在Settings App中移除配對",
  "settings.network.bitchat": "bitchat 相容",
  "settings.network.bitchat_desc":
    "和 bitchat 用同一套 BLE 網狀網路，完全互通。這一項永遠開啟，無法關閉。",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "在背景執行",
  "settings.conn.background_desc": "關掉 Airhop 後讓網狀網路繼續跑",
  "settings.conn.background_on_title": "要讓網狀網路繼續跑嗎？",
  "settings.conn.background_on_body":
    "Airhop 關掉後仍會繼續中繼和接收，所以你不在時訊息也送得到。執行期間 Android 會顯示一則常駐通知。",
  "settings.conn.background_off_title": "Airhop 關掉時停止網狀網路嗎？",
  "settings.conn.background_off_body":
    "只有 Airhop 開著時訊息才會送到，這支手機也不再替附近的人做中繼。那則常駐通知會消失。",
  "settings.conn.live_voice": "即時語音",
  "settings.conn.live_voice_desc": "像對講機一樣和附近的人說話",
  "settings.conn.live_voice_on_title": "要開啟即時語音嗎？",
  "settings.conn.live_voice_on_body":
    "按住麥克風時，你說的話會邊說邊送給藍牙範圍內的每個人，他們的聲音也會在你手機上播放。什麼都不會被錄下來。",
  "settings.conn.live_voice_off_title": "要關閉即時語音嗎？",
  "settings.conn.live_voice_off_body":
    "按住麥克風會改成錄一則語音留言。放開後才送出，別人不點開就聽不到。",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor 路由",
  "settings.conn.tor_desc": "把 Nostr 流量經 Tor 轉送，多一層隱私",
  "settings.conn.tor_on_title": "要把 Nostr 流量經 Tor 轉送嗎？",
  "settings.conn.tor_on_body":
    "中繼將看不到你的 IP 位址。連線會比較久，訊息也來得比較慢。藍牙不受影響。",
  "settings.conn.tor_off_title": "要關閉 Tor 路由嗎？",
  "settings.conn.tor_off_body":
    "Nostr 流量會回到你原本的連線上，中繼又看得到你的 IP 位址了。不管哪一種，藍牙都不受影響。",
  "settings.conn.tor_unavailable": "這個版本不支援 Tor 路由。",
  "settings.conn.tor_timeout":
    "Tor 連線已經花了一分多鐘。它會保持開啟並繼續嘗試；網狀網路分頁會告訴你它何時開始轉送，或者這個網路是不是在擋它。",
  "settings.conn.tor_failed": "無法啟動 Tor。請確認 App 有網路存取權。",
  "settings.conn.mint_clearnet": "允許鑄幣廠流量走明網",
  "settings.conn.mint_clearnet_desc":
    "iOS 上的 Tor 只涵蓋 Nostr。保持關閉就能擋下鑄幣廠請求；不管怎樣，透過網狀網路收付 ecash 都照常可用。",
  "settings.conn.gateway": "網路閘道",
  "settings.conn.gateway_desc":
    "把你的連線借給附近離線的手機，讓它仍然連得上位置頻道",
  "settings.conn.gateway_on_title": "要開啟網路閘道嗎？",
  "settings.conn.gateway_on_body":
    "附近沒有自己連線的手機，會透過你的連線收發位置頻道訊息。這會用到你的行動數據和電量，而他們的訊息始終端對端加密，所以你讀不到經過的內容。",
  "settings.conn.gateway_off_title": "要關閉網路閘道嗎？",
  "settings.conn.gateway_off_body":
    "附近離線的手機將不再透過你的連線存取位置頻道。你自己的訊息不受影響。",
  "settings.conn.bridge": "網狀網路橋接",
  "settings.conn.bridge_desc":
    "透過網路，把這片區域的公開 #bluetooth 聊天和另一群超出藍牙範圍的人連起來",
  "settings.conn.bridge_on_title": "要開啟網狀網路橋接嗎？",
  "settings.conn.bridge_on_body":
    "你在公開 #bluetooth 裡的訊息會透過網路發布到你所在的鄰里，所以藍牙範圍外的人也讀得到。私密訊息永遠不會被橋接，而「僅限附近」能讓某一則訊息留在本地。",
  "settings.conn.bridge_off_title": "要關閉網狀網路橋接嗎？",
  "settings.conn.bridge_off_body":
    "你在公開 #bluetooth 裡的訊息又只留在藍牙範圍內，橋接那一端的訊息也不會再傳到這裡。",
  "settings.conn.bridge_needs_location": "網狀網路橋接需要定位",
  "settings.conn.bridge_needs_location_desc":
    "它靠一次定位來確定你所在的鄰里。授予定位權限即可開始橋接。",
  "settings.conn.grant_location": "授予定位權限",
  "settings.conn.grant_short": "授予",
  "settings.conn.internet_off": "網路已關閉",
  "settings.conn.internet_off_desc":
    "Tor、橋接和閘道都要用網路。請在網路裡開啟網路備援才能使用它們。",
  "settings.conn.turn_on": "開啟",
  "settings.conn.turn_off": "關閉",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "藍牙",
  "settings.permissions.bluetooth_desc":
    "用來找出附近裝置並在它們之間中繼訊息。沒有它，網狀網路就無法運作。",
  "settings.permissions.location": "定位",
  "settings.permissions.location_desc":
    "用來開啟附近的區域頻道。沒有它，那些頻道會保持關閉，藍牙網狀網路照常運作。",
  "settings.permissions.notifications": "通知",
  "settings.permissions.notifications_desc":
    "就算 App 關著也能收到新訊息提醒。沒有它，你只有開啟 Airhop 時才看得到。",
  "settings.permissions.camera": "相機",
  "settings.permissions.camera_desc":
    "用來掃描 QR 碼、拍攝照片或影片來傳送。沒有它，你仍然可以從圖庫分享媒體。",
  "settings.permissions.photos": "照片",
  "settings.permissions.photos_desc":
    "用來從圖庫傳送照片並儲存收到的媒體。沒有它，你仍然可以用相機現拍現傳。",
  "settings.permissions.microphone": "麥克風",
  "settings.permissions.microphone_desc":
    "用來錄製和傳送語音訊息，或使用即時語音。沒有它，語音訊息和即時語音都用不了。",
  "settings.permissions.allow": "允許這項權限",
  "settings.permissions.open_settings": "開啟系統設定以更改這項權限",
  "settings.permissions.system": "系統",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "網路用量",
  "settings.storage.storage_usage": "儲存用量",
  "settings.storage.storage_usage_desc": "訊息、錢包憑證和快取的附件",
  "settings.storage.session_usage":
    "本次工作階段 · 送出 {sent}，收到 {received}",
  "settings.storage.cache": "快取",
  "settings.storage.cache_desc": "{size} 的附件",
  "settings.storage.clear_cache": "清除附件快取",
  "settings.storage.clear": "清除",
  "settings.storage.clear_title": "要清除快取的媒體嗎？",
  "settings.storage.clear_body":
    "照片、影片、語音留言和檔案都會從這台裝置上移除，收到的和送出的一樣。它們無法再次下載：泡泡裡會寫明這一點，你可以請傳送方重傳。訊息和錢包不受影響。",
  "settings.storage.cleared": "快取已清除",
  "settings.storage.freed": "釋出了 {size}。",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "把外觀設為 {value}",
  "settings.font.set_a11y": "把等寬字體設為 {value}",
  "settings.font.system": "系統",
  "settings.font.system_desc": "使用你裝置的預設等寬字體",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "現代，易讀",
  "settings.language.en": "英文",
  "settings.language.am": "阿姆哈拉文",
  "settings.language.ar": "阿拉伯文",
  "settings.language.bn": "孟加拉文",
  "settings.language.my": "緬甸文",
  "settings.language.zh_hans": "中文（簡體）",
  "settings.language.zh_hant": "中文（繁體）",
  "settings.language.nl": "荷蘭文",
  "settings.language.fil": "菲律賓文",
  "settings.language.fr": "法文",
  "settings.language.ka": "喬治亞文",
  "settings.language.de": "德文",
  "settings.language.hi": "印地文",
  "settings.language.id": "印尼文",
  "settings.language.it": "義大利文",
  "settings.language.ja": "日文",
  "settings.language.ko": "韓文",
  "settings.language.mg": "馬達加斯加文",
  "settings.language.ms": "馬來文",
  "settings.language.ne": "尼泊爾文",
  "settings.language.fa": "波斯文",
  "settings.language.pl": "波蘭文",
  "settings.language.pt_br": "葡萄牙文（巴西）",
  "settings.language.pt_pt": "葡萄牙文（葡萄牙）",
  "settings.language.pa": "旁遮普文",
  "settings.language.ru": "俄文",
  "settings.language.es": "西班牙文",
  "settings.language.sw": "史瓦希里文",
  "settings.language.sv": "瑞典文",
  "settings.language.ta": "坦米爾文",
  "settings.language.th": "泰文",
  "settings.language.tr": "土耳其文",
  "settings.language.uk": "烏克蘭文",
  "settings.language.ur": "烏爾都文",
  "settings.language.vi": "越南文",
  "settings.language.pseudo": "偽語言環境",
  "settings.language.soon": "即將推出",
  "settings.language.soon_a11y": "{value}，即將推出",
  "settings.language.set_a11y": "把語言設為 {value}",
  "settings.language.pending": "下次開啟時生效",
  "settings.language.pending_a11y": "{value}，會在你下次開啟 Airhop 時生效",
  "settings.language.rtl_restart": "立即重新開啟",
  "settings.language.rtl_title": "重新開啟 Airhop 以完成切換",
  "settings.language.rtl_body":
    "{value} 是從右往左讀的，而 Airhop 只能在啟動時改變方向。請關掉再開一次以完成切換。什麼都不會遺失，在那之前你的網狀網路也保持連線。",
  "settings.theme.light": "淺色",
  "settings.theme.light_desc": "永遠使用淺色配色",
  "settings.theme.dark": "深色",
  "settings.theme.dark_desc": "永遠使用深色配色",

  // ---- Settings: profile and identity ----
  "settings.status.online": "上線",
  "settings.status.online_desc": "可被發現，正在廣播和掃描",
  "settings.status.away": "離開",
  "settings.status.away_desc": "網狀網路已暫停，不掃描也不廣播",
  "settings.status.invisible": "隱形",
  "settings.status.invisible_desc": "正在掃描，但不會被發現",
  "settings.status.title": "狀態",
  "settings.status.set_a11y": "把狀態設為 {value}",
  "settings.status.edit": "編輯狀態",
  "settings.status.desc": "選擇你在網狀網路上有多顯眼。",
  "settings.transfer.identity": "身分與金鑰",
  "settings.transfer.identity_desc": "你的節點 ID、使用者名稱和聯絡人",
  "settings.transfer.chats": "聊天與歷史紀錄",
  "settings.transfer.chats_desc": "對話、群組，以及你加入過的頻道",
  "settings.transfer.wallet": "錢包餘額",
  "settings.transfer.wallet_desc": "Cashu 憑證與交易紀錄",
  "settings.transfer.title": "轉移到新手機",
  "settings.transfer.desc": "把你的身分、聊天和錢包搬到另一台裝置",
  "settings.transfer.coming_soon_a11y": "轉移到新手機，即將推出",
  "settings.transfer.body":
    "把兩支手機靠在一起，透過藍牙把所有內容搬過去。不經過任何伺服器，所以沒有網路也能用。",
  "settings.qr.permission_label": "照片存取權",
  "settings.qr.permission_purpose": "儲存你的 QR 碼",
  "settings.qr.saved": "已儲存",
  "settings.qr.saved_body": "QR 碼已儲存到你的照片圖庫。",
  "settings.qr.save_failed": "無法儲存",
  "settings.qr.save_failed_body": "QR 碼無法儲存。請再試一次。",
  "settings.qr.share_message": "在 Airhop 上加我",
  "settings.qr.share_body": "在 Airhop 上加我 — 離線優先的私密網狀網路通訊。",
  "settings.qr.show_short": "顯示 QR 碼",
  "settings.qr.title": "你的 QR 碼",
  "settings.qr.note":
    "它包含你的公鑰，別人憑它就能從任何地方傳訊息給你。只分享給你信任的人。除非你抹除自己的身分，否則它不會變。",
  "settings.qr.code_label": "聯絡人代碼",
  "settings.qr.copy_code": "複製聯絡人代碼",
  "settings.qr.share": "分享 QR 碼",
  "settings.qr.share_short": "分享 QR 碼",
  "settings.qr.download": "下載 QR 碼",
  "settings.qr.download_short": "下載 QR 碼",
  "settings.qr.show": "顯示 QR 碼",
  "settings.wipe.trigger": "觸發緊急抹除",
  "settings.wipe.trigger_desc": "連點三下立刻抹除，不再確認",
  "settings.wipe.title": "緊急抹除",
  "settings.wipe.now": "立刻抹除",
  "settings.wipe.desc": "立刻銷毀所有金鑰、訊息和憑證",
  "settings.wipe.body":
    "這會立刻銷毀你所有的金鑰、訊息和錢包憑證。此動作無法復原。",
  "settings.wipe.in_progress": "抹除中",
  "settings.wipe.in_progress_body":
    "正在銷毀你的金鑰、訊息和檔案。這需要幾秒鐘，就算 App 被關掉也會自己完成。",
  "settings.wipe.got_it": "知道了",
  "settings.wipe.keys_failed": "金鑰無法銷毀",
  "settings.wipe.keys_failed_body":
    "你的訊息、聯絡人和錢包都已清除，但裝置拒絕釋出你的金鑰。請解鎖裝置後再抹除一次。",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "聯絡我們",
  "settings.help.contact_a11y": "寄電子郵件到 {address}",
  "settings.help.bug": "回報問題",
  "settings.help.bug_desc": "在 GitHub 上開一個 issue",
  "settings.help.bug_a11y": "在 GitHub 上回報問題",
  "settings.help.faq": "常見問題",
  "settings.help.faq_desc": "常見疑問的解答",
  "settings.help.faq_a11y": "開啟常見問題",
  "settings.help.terms_desc": "Airhop 可以怎麼使用",
  "settings.help.terms_a11y": "開啟服務條款",
  "settings.help.privacy_desc": "我們不蒐集什麼",
  "settings.help.privacy_a11y": "開啟隱私權政策",

  // ---- Settings: support ----
  "settings.support.card": "信用卡或 UPI",
  "settings.support.card_desc": "網路銀行和電子錢包，全球適用",
  "settings.support.card_a11y": "用信用卡、UPI、網路銀行或電子錢包支持",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "每月或單次，平台不抽成",
  "settings.support.sponsors_a11y": "透過 GitHub Sponsors 支持",
  "settings.support.note":
    "我利用空閒時間開發 Airhop。沒有投資人，也沒有廣告。如果它對你有用，一份贊助能讓開發持續下去。不管怎樣，每一項功能都會一直免費。",

  // ---- Settings: about and version ----
  "settings.about.version": "版本",
  "settings.about.version_desc": "目前的發行版",
  "settings.about.version_a11y": "查看版本並檢查更新",
  "settings.about.release_notes": "發行說明",
  "settings.about.release_notes_desc": "最新版本有哪些新東西",
  "settings.about.release_notes_a11y": "在 GitHub 上開啟最新的發行說明",
  "settings.about.source": "原始碼",
  "settings.about.source_a11y": "在 GitHub 上開啟原始碼",
  "settings.about.licenses": "開源授權",
  "settings.about.open_repo": "開啟 {name} 儲存庫",
  "settings.about.licenses_desc": "第三方開源套件",
  "settings.about.licenses_a11y": "查看第三方授權",
  "settings.version.codename": "代號",
  "settings.version.checking": "檢查中",
  "settings.version.check": "檢查更新",
  "settings.version.checking_title": "正在檢查更新",
  "settings.version.up_to_date": "你用的已經是最新版本。",
  "settings.version.release_notes": "查看發行說明",
  "settings.version.made_with": "用",
  "settings.version.number": "版本 {version}",
  "settings.version.update_to": "更新到 {version}",
  "settings.version.update_to_a11y": "更新到版本 {version}",
  "settings.version.released_under": "以 {license} 發布",
  "settings.version.notes_a11y": "查看 {version} 版的發行說明",
  "settings.version.tor_paused":
    "Tor 開啟期間會暫停檢查更新，以免洩漏你的 IP。請在瀏覽器裡查看發行頁面。",
  "settings.version.check_failed":
    "無法檢查更新。請檢查你的網路連線後再試一次。",
  "settings.version.downloading": "正在下載 {percent}%",
  "settings.version.install": "安裝",
  "settings.version.download_failed": "下載失敗。請檢查網路連線後再試一次。",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind}有 {size} KiB，超過了 {cap} KiB 的上限。",
  "transfer.failed.malformed":
    "有個附件送到時已損壞，無法開啟。請對方重傳一次。",
  "transfer.failed.unsupported_type":
    "有個附件送到了，但它的格式這個 App 打不開。",
  "transfer.failed.type_mismatch":
    "有個附件被拒收：它的內容和它宣稱的檔案類型對不上。",
  "transfer.failed.storage": "有個附件送到了，但無法儲存。請檢查可用空間。",
  "transfer.badge.waiting": "等待中 · {name}",
  "transfer.badge.active_count": "{count} 項傳輸",
  "transfer.badge.sending": "正在傳送{name}",
  "transfer.badge.receiving": "正在接收{name}",
  "transfer.badge.a11y": "{label}，{percent}%。開啟對話。",
  "transfer.kind.photo": "照片",
  "transfer.kind.video": "影片",
  "transfer.kind.voice": "語音留言",
  "transfer.this.photo": "這張照片",
  "transfer.this.video": "這段影片",
  "transfer.this.voice": "這則語音留言",
  "transfer.this.file": "這個檔案",
  "transfer.kind.document": "文件",
  "transfer.kind.voice_preview": "語音留言",
  "transfer.kind.photo_preview": "照片",
  "transfer.kind.video_preview": "影片",
  "transfer.kind.document_preview": "文件",

  // ---- System notifications ----
  "notif.channel.messages": "訊息",
  "notif.channel.nearby": "附近的節點",
  "notif.channel.nearby_desc": "網狀網路在藍牙範圍內找到人時，偶爾發一則提示。",
  "notif.nearby.body": "現在就在藍牙範圍內。點一下可開啟網狀網路。",
  "notif.channel_message": "{sender}：{preview}",
  "notif.someone": "某人",
  "notif.notice_urgent": "緊急公告 · {content}",
  "notif.notice": "公告 · {content}",
  "notif.incoming_file": "有檔案傳來",
  "notif.preview.photo": "📷 照片",
  "notif.preview.voice": "🎤 語音訊息",
  "notif.preview.video": "🎥 影片",
  "notif.preview.document": "📄 文件",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "新訊息",
  "notif.hidden.channel": "有新動態",
  "notif.hidden.mention": "有人提到了你",
  "notif.mention.title": "{sender} 提到了你",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "再顯示 {count} 個",
  },
  "chat.channels.show_more_a11y": {
    other: "再顯示 {count} 個預設頻道",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}，{count} 則未讀",
  },
  "a11y.new_count": {
    other: "{label}，{count} 則新的",
  },
  "chat.a11y.unread": {
    other: "{count} 則未讀",
  },
  "chat.thread.length_left": {
    other: "還剩 {count}",
  },
  "settings.general.retention_days": {
    other: "{count} 天",
  },
  "chat.info.group_reach": {
    other: "{count} 位成員中有 {reachable} 位觸及得到",
  },
  "chat.group_members": {
    other: "私密群組  ·  {count} 位成員",
  },
  "chat.select.count": {
    other: "已選取 {count} 則",
  },
  "chat.select.forward": {
    other: "轉傳 {count} 則訊息",
  },
  "chat.voice.live_speaking_count": {
    other: "{count} 人正在說話",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "範圍內有 {count} 個節點",
  },
  "mesh.peer.hops_away": {
    other: "隔 {count} 跳",
  },
  "chat.presence.active": {
    other: "{count} 位活躍",
  },
  "chat.presence.nearby": {
    other: "{count} 位在附近",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "{count} 個鑄幣廠",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint} 那裡有 {count} 份憑證，共 {balance} {unit}。移除會把這些憑證從這台裝置上永久抹掉，而且它們沒有備份。請先把餘額領走或送出去。",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other: "{count} 筆存入正在等待入帳。每次開啟 App 時都會重新檢查。",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "從 {mints} 復原出 {count} 份未花用的憑證。",
  },
  "wallet.backup.already_spent": {
    other:
      "找到了 {count} 枚幣，但它們已經被花掉了，所以沒有為它們入帳。這很正常：你花過的每一枚幣，都會一直留在鑄幣廠留存的紀錄裡。",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "再顯示 {count} 筆",
  },
  "wallet.activity.show_more_a11y": {
    other: "再顯示 {count} 筆付款",
  },
  "wallet.mint.unconfirmed_count": {
    other: "{count} 份未確認",
  },
  "wallet.proof_count": {
    other: "{count} 份憑證",
  },
  "wallet.spent_removed_detail": {
    other: "有 {count} 份憑證早就被花掉了，它們已經被移除。",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "附近有 {count} 人",
  },
};

export const zhHant = { strings, plurals };
