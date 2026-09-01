// ja: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "キャンセル",
  "common.done": "完了",
  "common.ok": "OK",
  "common.close": "閉じる",
  "common.back": "戻る",
  "common.delete": "削除",
  "common.remove": "取り除く",
  "common.add": "追加",
  "common.copy": "コピー",
  "common.copied": "コピーしました",
  "common.share": "共有",
  "common.continue": "続ける",
  "common.try_again": "もう一度試す",
  "common.settings": "設定",
  "common.off": "オフ",

  // ---- Dates ----
  "format.today": "今日",
  "format.yesterday": "昨日",
  "format.minutes_ago": "{count}分前",
  "format.hours_ago": "{count}時間前",
  "format.days_ago": "{count}日前",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "チャット",
  "nav.tab.mesh": "メッシュ",
  "nav.tab.wallet": "ウォレット",
  "nav.tab.profile": "あなた",
  "a11y.tab.new_peers": "{label}、近くに新しい人がいます",
  "nav.notifications": "通知",
  "chat.subtab.channels": "チャンネル",
  "chat.subtab.direct": "ダイレクト",
  "chat.subtab.dms": "ダイレクトメッセージ",
  "chat.search.placeholder": "チャットを検索…",
  "chat.search.a11y": "チャットとメッセージを検索",
  "chat.search.close": "検索を閉じる",
  "chat.search.clear": "検索をクリア",
  "mesh.view.radar": "レーダー表示",
  "mesh.view.list": "リスト表示",
  "mesh.view.radar_short": "レーダー",
  "mesh.view.list_short": "リスト",

  // ---- Legal document names ----
  "legal.last_updated": "最終更新: {date}",
  "legal.terms": "利用規約",
  "legal.privacy": "プライバシーポリシー",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "プライベートなメッシュ通信",
  "onboarding.welcome.cta": "はじめる",
  "onboarding.welcome.cta_hint": "続けるには下の規約に同意してください",
  "onboarding.welcome.consent_a11y": "利用規約とプライバシーポリシーに同意する",
  "onboarding.welcome.open_terms": "利用規約を開く",
  "onboarding.welcome.open_privacy": "プライバシーポリシーを開く",
  "onboarding.welcome.consent":
    "{cta}をタップすると、{terms}と{privacy}に同意したことになります。",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "あなたの識別情報を作成中",
  "onboarding.identity.body":
    "この端末でEd25519の鍵ペアを作成しています。\nどこにも送信されません。",
  "onboarding.identity.failed_heading": "鍵を作成できませんでした",
  "onboarding.identity.failed_body":
    "この端末がAirhopに安全な保存を許可しませんでした。もう一度試すか、端末を再起動してAirhopを開き直してください。",
  "onboarding.identity.steps_a11y": "手順: {steps}",
  "onboarding.identity.step.x25519": "X25519の静的鍵ペアを生成中",
  "onboarding.identity.step.ed25519": "Ed25519の署名鍵を生成中",
  "onboarding.identity.step.keychain": "OSのキーチェーンに鍵を保存中",
  "onboarding.identity.step.peer_id": "ピアIDを導出中",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "メッシュ上でのあなたの名前",
  "onboarding.username.peer_id": "ピアID",
  "onboarding.username.card_a11y":
    "メッシュ上でのあなたの名前は{username}です。ピアID {peerID}。{props}。",
  "onboarding.username.explanation":
    "このユーザー名は公開鍵から決定的に導出されます。あなたのピアIDを見るどの端末でも同じ名前になります。",
  "onboarding.username.cta": "Airhopに入る",
  "onboarding.username.prop.algorithm": "アルゴリズム",
  "onboarding.username.prop.storage": "保存先",
  "onboarding.username.prop.storage_value": "OSのキーチェーンのみ",
  "onboarding.username.prop.account": "アカウント",
  "onboarding.username.prop.account_value": "不要",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhopへようこそ",
  "onboarding.hello.p1":
    "こんにちは。Airhopはbitchatを土台にした、独立したオープンソースの個人プロジェクトです。bitchatプロジェクトやpermissionless techとは提携しておらず、承認も受けていません。ただ、作って共有するのが楽しいから続けているものです。",
  "onboarding.hello.p2":
    "これはiOSとAndroidの最初のリリースです。友人と試してはいますが、いくつか不具合に出会うと思います。もし見つけたら、あるいは機能の案があれば、ぜひ知らせてください。{github}でissueを立てるか、{email}までメールをください。",
  "onboarding.hello.p3":
    "Airhopが役に立ったら、{github}でスターを付けるか、{store}でレビューを残してもらえると助かります。より多くの人がこのプロジェクトを見つけられます。試してくれてありがとう。",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "端末が尋ねる前に",
  "onboarding.primer.lede":
    "それぞれの権限が何をして、何をしないかを説明します。",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "近くの端末を見つけ、その間でメッセージを中継します。これがメッシュを作り、インターネットなしで動きます。",
  "onboarding.primer.location.title": "位置情報",
  "onboarding.primer.location.body":
    "街区から地域まで、近くのエリアチャンネルにあなたを配置します。Airhopがあなたを追跡することはなく、正確な位置が端末の外に出ることもありません。",
  "onboarding.primer.notifications.title": "通知",
  "onboarding.primer.notifications.body":
    "アプリを閉じていても新着メッセージの通知を受け取れます。通知は端末内で作られ、サーバーは関与しません。",
  "onboarding.primer.footnote":
    "断ってもかまいません。メッセージはインターネット経由で届きますし、あとから設定で変更できます。",
  "onboarding.primer.cta_a11y": "権限の確認へ進む",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Bluetoothへのアクセス",
  "permission.bluetooth.purpose": "メッシュで近くの端末を見つける",
  "permission.open_settings": "設定を開く",
  "permission.not_now": "今はしない",
  "permission.blocked_title": "{label}はオフです",
  "permission.blocked_body": "{purpose}ために、設定でオンにしてください。",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "問題が発生しました",
  "error.boundary.body": "Airhopで予期しない問題が起き、表示を中断しました。",

  // ---- Chats: channel list ----
  "chat.channels.default": "標準チャンネル",
  "chat.channels.yours": "あなたのチャンネル",
  "chat.channels.none": "チャンネルはまだありません",
  "chat.channels.none_hint":
    "上の{plus}をタップして参加するか、新しく作成してください。",
  "chat.channels.none_desc":
    "チャンネルはまだありません。ヘッダーの追加ボタンから参加するか、新しく作成してください。",
  "chat.channels.show_fewer": "標準チャンネルの表示を減らす",
  "chat.channels.show_less": "表示を減らす",
  "chat.channels.info": "チャンネル情報",
  "chat.channels.pin": "チャンネルをピン留め",
  "chat.channels.unpin": "ピン留めを解除",
  "chat.channels.mute": "チャンネルをミュート",
  "chat.channels.unmute": "ミュートを解除",
  "chat.channels.leave": "チャンネルを退出",
  "chat.channels.leave_confirm": "退出",
  "chat.channels.clear_body":
    "{name}のメッセージをすべて削除しますか。元に戻せません。",
  "chat.channels.leave_body":
    "{name}を退出しますか。以後メッセージは届かず、履歴はこの端末から削除されます。",
  "chat.channels.more_options": "{name}のその他の操作",
  "chat.channels.teleported_tag": "{level}  ·  テレポート中",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "チャットを消去",
  "chat.dm.remove_contact": "連絡先を削除",
  "chat.dm.block": "このピアをブロック",
  "chat.dm.block_confirm": "ブロック",
  "chat.dm.delete": "チャットを削除",
  "chat.dm.delete_body":
    "会話が一覧から消え、そのメッセージも削除されます。連絡先は残るので、相手から新しくメッセージが来れば新しいチャットが始まります。",
  "chat.dm.in_range": "圏内",
  "chat.dm.row_hint": "ダブルタップして長押しでその他の操作",
  "chat.channels.row_hint": "ダブルタップして長押しでその他の操作",
  "chat.dm.you_prefix": "あなた:",
  "chat.dm.none": "ダイレクトメッセージはありません",
  "chat.dm.none_desc":
    "メッシュタブでピアをタップすると、暗号化されたDMを始められます。",
  "chat.dm.contact_info": "連絡先情報",
  "chat.dm.pin": "チャットをピン留め",
  "chat.dm.unpin": "ピン留めを解除",
  "chat.dm.mute": "チャットをミュート",
  "chat.dm.unmute": "ミュートを解除",
  "chat.dm.clear_body":
    "{name}とのメッセージをすべて削除しますか。元に戻せません。",
  "chat.dm.remove_contact_body":
    "{name}を削除しますか。会話が削除され、連絡先も忘れられます。相手からまたメッセージが来れば連絡は取れます。",
  "chat.dm.block_body":
    "{name}をブロックしますか。メッシュタブに表示されなくなり、近くにいてもメッセージは届きません。",
  "chat.dm.more_options": "{name}のその他の操作",
  "chat.dm.remove_contact_short": "連絡先を削除",
  "chat.dm.block_short": "連絡先をブロック",
  "chat.dm.delete_short": "チャットを削除",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "メッセージを消去",
  "chat.clear_confirm": "消去",
  "chat.group_badge": "グループ",
  "chat.more": "その他",
  "chat.no_messages": "メッセージはまだありません",
  "chat.you": "あなた",
  "chat.a11y.channel": "チャンネル {name}",
  "chat.a11y.group": "グループ {name}",
  "chat.a11y.muted": "ミュート中",
  "chat.a11y.pinned": "ピン留め中",

  // ---- Chats: start something new ----
  "chat.new.title": "新しく始める",
  "chat.new.channel": "プライベートチャンネルを作成",
  "chat.new.channel_label": "プライベートチャンネル",
  "chat.new.channel_desc":
    "リンクを持つ人なら誰でも参加できる部屋です。新しく作るか、届いたリンクで参加してください。",
  "chat.new.group": "プライベートグループを作成",
  "chat.new.group_label": "プライベートグループ",
  "chat.new.group_desc":
    "特定の人を選びます。最大16人。Bluetoothの中だけで動きます。",
  "chat.new.place": "ジオハッシュで場所へ移動",
  "chat.new.place_label": "場所へ移動",
  "chat.new.place_desc":
    "ジオハッシュを使って、どこの位置チャンネルでも開けます。",
  "chat.new.reach": "到達範囲",
  "chat.new.reach_internet":
    "Bluetoothとインターネットの両方でメンバーに届きます。",
  "chat.new.reach_mesh": "Bluetooth圏内で動作し、インターネットは使いません。",
  "chat.new.reach_internet_desc":
    "インターネット経由でもメンバーに届きます。リレーにはチャンネルが動いていることは見えますが、メッセージや参加者は決して見えません。",
  "chat.new.reach_mesh_desc":
    "ローカルメッシュの中に留まります。最もプライベートで、Bluetooth圏外には何も出ません。",
  "chat.new.join_link": "招待リンクでプライベートチャンネルに参加",
  "chat.new.back_to_chooser": "選択に戻る",
  "chat.new.create_channel": "チャンネルを作成",
  "chat.new.name_required": "先にチャンネル名を入力してください",
  "chat.new.name_taken": "その名前はすでに使われています",
  "chat.new.create": "作成",
  "chat.new.e2ee":
    "エンドツーエンド暗号化。メッセージを読めるのはメンバーだけです。",
  "chat.new.invite_only":
    "招待制です。リンクを共有した相手なら誰でも参加できます。それ以外の人には、近くのピアにも見えません。",
  "chat.new.name_exists": "この名前のチャンネルはすでに存在します。",
  "chat.new.reach_bluetooth_chip": "Bluetoothのみ",
  "chat.new.reach_internet_chip": "Bluetooth + インターネット",
  "chat.new.have_link": "招待リンクで参加",

  // ---- Chats: join by link ----
  "chat.join.title": "リンクで参加",
  "chat.join.not_airhop": "これはAirhopのリンクではありません。",
  "chat.join.reach_internet":
    "Bluetoothとインターネットの両方でメンバーに届きます。",
  "chat.join.reach_mesh": "Bluetooth圏内に留まります。",
  "chat.join.contact_card":
    "連絡先カードです。連絡先に追加してチャットを開きます。",
  "chat.join.unverified": "このリンクは検証できませんでした",
  "chat.join.unverified_body":
    "連絡先カードが自身の鍵と一致しないため、追加しませんでした。新しいものを送ってもらってください。",
  "chat.join.paste": "クリップボードから貼り付け",
  "chat.join.join": "参加",
  "chat.join.public_channel":
    "公開チャンネル {name}。近くにいる人なら誰でも読めます。",
  "chat.join.private_channel": "プライベートチャンネル {name}。{reach}",
  "chat.join.dm_with": "{name}とのダイレクトメッセージ。",
  "chat.join.joined_as": "{name}として参加しました",
  "chat.join.name_clash_body":
    "すでに別の{name}に参加しています。チャンネル名はただのラベルなので、この招待は独自のチャンネルを開き、元のチャンネルはそのまま残っています。どちらもチャンネル情報から名前を変えられます。",
  "chat.join.paste_hint":
    "airhop://で始まる招待を貼り付けてください。リンクをタップしても参加できます。これはタップできないリンク用です。",
  "chat.join.key_note":
    "プライベートチャンネルの招待には鍵が含まれるので、参加はすぐに完了し、ほかの誰にも手間はかかりません。",
  "chat.join.offline_note":
    "オフラインでも使えます。リンクはこの端末で読み取られ、チャンネルの到達範囲は作成者の設定どおりです。",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "そのセルを開けませんでした。少ししてからもう一度お試しください。",
  "chat.jump.title": "場所へ移動",
  "chat.jump.saved": "保存した場所",
  "chat.jump.anywhere":
    "自分がいない場所でも、どこの公開位置チャンネルでも開けます。",
  "chat.jump.geohash_note":
    "ジオハッシュを入力してください。そのセルに位置が入る人全員がチャンネルを共有します。",
  "chat.jump.teleport_note":
    "近くにいる人ではなく、テレポート中として表示されます。到達はインターネット経由のみです。",
  "chat.jump.level_cell": "{level}のセル",
  "chat.jump.already_here":
    "すでにここにいます。「移動」を押すと{name}チャンネルが開きます。",
  "chat.jump.open_direction": "{direction}のセルを開く",
  "chat.jump.open_place": "{name}を開く",
  "chat.jump.remove_place": "{name}を保存した場所から削除",
  "chat.jump.go": "移動",
  "chat.jump.how":
    "ジオハッシュの調べ方: 位置チャンネルを開く > 名前をタップ > そこからコピー。",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "全員には届きませんでした。相手が近くにいるときにもう一度お試しください。",
  "chat.group.you_were_added": "{name}に追加されました。",
  "chat.group.added_you": "{name}にあなたを追加しました",
  "chat.group.you_were_removed":
    "{name}から削除されました。ここでの読み書きはできません。",
  "chat.group.removed_you": "{name}からあなたを削除しました",
  "chat.group.add_failed": "追加できませんでした",
  "chat.group.add_failed_body":
    "何も変わっていません。相手が今つながらないか、グループが16人でいっぱいか、あなたが作成者ではないかのいずれかです。",
  "chat.group.remove_failed": "削除できませんでした",
  "chat.group.remove_failed_body":
    "何も変わっていません。メンバーを変更できるのはグループを作った人だけです。",
  "chat.group.e2ee":
    "エンドツーエンド暗号化。メッセージを読めるのはメンバーだけです。",
  "chat.group.cap":
    "あなたが選んだ最大16人です。招待リンクはないので、転送されて誰かが入ってくることはありません。",
  "chat.group.bluetooth":
    "Bluetoothのみ。圏外のメンバーには、戻ってきた時点でメッセージが届きます。",
  "chat.group.members_label": "メンバー",
  "chat.group.none_in_range":
    "圏内に誰もいません。グループを作るときはメンバーが近くにいる必要があります。",
  "chat.group.create_title": "グループを作成",
  "chat.group.name_placeholder": "グループ名",
  "chat.group.create": "作成",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "ローカルメッシュ · Bluetoothのみ",
  "chat.scope.mesh_desc":
    "Bluetooth圏内（およそ10〜100メートル）の端末に届きます。インターネットは不要です。その場での連携に向いています。",
  "chat.scope.block": "街区 · 約100m",
  "chat.scope.block_desc":
    "街区レベルの範囲です。メッセージはインターネット経由で橋渡しされ、Bluetooth圏外でも近くにいるピアが参加できます。",
  "chat.scope.neighborhood": "地区 · 約1km",
  "chat.scope.neighborhood_desc":
    "地区レベルの範囲です。リレーの助けで、直接Bluetoothがつながらなくても地域内のピアに届きます。",
  "chat.scope.city": "市 · 約10km",
  "chat.scope.city_desc":
    "市全体のチャンネルです。位置に紐づいたインターネットリレーを使い、都市圏のピアに届きます。",
  "chat.scope.province": "県または州 · 約100km",
  "chat.scope.province_desc":
    "県や州レベルの範囲です。インターネット経由で橋渡しし、数百キロの広域に届きます。",
  "chat.scope.country": "国または地域 · 約1000km",
  "chat.scope.country_desc":
    "国全体の範囲です。その地域のAirhopまたはbitchatの利用者なら誰でも参加して読めます。",
  "chat.transport.bluetooth": "Bluetoothのみ",
  "chat.transport.both": "Bluetooth + インターネット",
  "chat.transport.internet": "インターネットのみ",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "コマンド /{cmd}: {hint}",
  "chat.cmd.hug_hint": "温かいハグを送る",
  "chat.cmd.slap_hint": "大きなマスで叩く",
  "chat.status.sending": "送信中…",
  "chat.status.undo_send": "送信を取り消す",
  "chat.status.undo": "取り消す",
  "chat.status.sent": "送信済み",
  "chat.status.received": "受信済み",
  "chat.status.failed": "失敗",
  "chat.status.canceled": "取り消し済み",
  "chat.status.waiting": "待機中",
  "chat.status.sending_short": "送信",
  "chat.status.receiving": "受信",
  "chat.thread.not_available": "ここでは利用できません",
  "chat.thread.private_channel": "プライベートチャンネル",
  "chat.thread.location_channel": "位置チャンネル",
  "chat.thread.public_channel": "公開チャンネル",
  "chat.thread.notices": "このチャンネルのお知らせ",
  "chat.thread.invite": "このチャンネルに誰かを招待",
  "chat.thread.not_in_range":
    "Bluetooth圏外です。インターネット経由で届けます。",
  "chat.thread.not_nearby":
    "近くにいません。圏内に戻るかオンラインになったときに届けます。",
  "chat.thread.no_keys":
    "メッセージを送るには、Bluetooth圏内にいるか、相手のコードを読み取る必要があります。",
  "chat.geo.card_received":
    "{name}が連絡先を共有しました。どちらかが移動しても話し続けられるよう、あなたの連絡先も返してください。",
  "chat.geo.exchange_complete":
    "連絡先を交換しました。これでどこからでも連絡を取り合えます。",
  "chat.geo.keep_person": "この人を残す",
  "chat.geo.keep_person_desc":
    "どちらかが移動しても話し続けられるよう、連絡先を共有します。相手にあなたの恒久的な識別情報が伝わります。",
  "chat.geo.card_sent": "共有済み · 相手の分を待っています",
  "chat.thread.left_cell":
    "このエリアを離れたため、ここでは相手から届きません。どこでも話し続けるにはコードを交換してください。",
  "chat.thread.no_route":
    "今は届きません。経路ができ次第、メッセージを送ります。",
  "chat.thread.empty": "メッセージはまだありません",
  "chat.thread.empty_desc": "暗号化された会話を始めましょう。",
  "chat.thread.jump_latest": "最新のメッセージへ移動",
  "chat.thread.back_to_members": "メンバーに戻る",
  "chat.thread.nostr_key": "Nostr公開鍵",
  "chat.thread.in_range": "圏内",
  "chat.voice.not_recorded": "ボイスメモを録音できませんでした",
  "chat.thread.message": "メッセージ",
  "chat.thread.message_placeholder": "メッセージ…",
  "chat.thread.length_full": "メッセージが上限です",
  "chat.thread.waiting_for": "{name}の復帰を待っています · {percent}%",
  "chat.thread.peer": "ピア",
  "chat.thread.cancel_transfer": "{name}をキャンセル",
  "chat.thread.queued_more": "他に{count}件が送信待ちです",
  "chat.thread.across_bridge": "ブリッジ越しに{count}人",
  "chat.thread.bridged": "ブリッジ経由",
  "chat.thread.invite_body":
    "Airhopの{channel}に来ませんか — インターネットなしで動く、プライベートなメッシュメッセージング。",
  "chat.thread.go_back_unread": "戻る、未読{count}件",
  "chat.thread.view_info": "{name}の情報を見る",
  "chat.thread.notices_new": "このチャンネルのお知らせ、新着{count}件",
  "chat.thread.say_something": "{channel}で何か話しましょう。",
  "chat.thread.jump_latest_new": "最新のメッセージへ移動、新着{count}件",
  "chat.thread.unconfirmed_since": "{date}以降、配信の確認が取れていません",
  "chat.thread.no_reach": "近くにピアがいません · まだ誰にも届いていません",
  "chat.thread.channel_needs_internet":
    "インターネットがオフです · このチャンネルはBluetooth圏内の人にしか届きません",
  "chat.thread.cell_needs_internet":
    "インターネットがオフです · このセルはインターネット経由でしか届きません",
  "chat.thread.geo_dm_needs_internet":
    "インターネットがオフです · この会話はインターネット経由でのみ運ばれます",
  "chat.thread.via_gateway":
    "インターネットがオフです · 近くの端末が代わりにオンラインへ運んでいます",
  "chat.thread.group_queued":
    "このグループの人はまだ近くにいません。近くに来たら届きます。",
  "chat.thread.no_group_key":
    "このグループのメンバーではなくなったため、送信できません",
  "chat.thread.no_reach_offline":
    "インターネットがオフで、近くにピアもいません · まだ誰にも届いていません",
  "chat.thread.mention": "{name}にメンション",
  "chat.thread.someone_talking": "{hold}。今は{name}が話しています。",
  "chat.thread.attach_note":
    "ファイルはBluetooth圏内にのみ送られます。テキストと支払いはインターネット上の連絡先にも届きますが、添付は届きません。",
  "chat.thread.message_peer": "{name}にメッセージ",
  "chat.thread.send": "メッセージを送信",
  "chat.thread.group": "グループ",
  "chat.bridge.nearby_only":
    "近くのみ: このメッセージをメッシュブリッジに載せない",
  "chat.bridge.nearby_label": "近くのみ · Bluetoothに留まります",
  "chat.bridge.bridging_label": "近隣エリアへブリッジ中 · タップで近くのみ",
  "chat.screenshot.you_took": "スクリーンショットを撮りました",
  "chat.screenshot.you_took_private":
    "スクリーンショットを撮りました · 誰にも通知されていません",
  "chat.screenshot.heads_up": "お知らせ",
  "chat.screenshot.notice": "* {name}がスクリーンショットを撮りました *",
  "chat.screenshot.notified_dm":
    "この会話のスクリーンショットを撮ったことが{name}に通知されました。",
  "chat.screenshot.notified":
    "スクリーンショットを撮ったことがこのチャンネルの全員に通知されました。",
  "chat.screenshot.not_notified":
    "誰にも通知していません。このチャンネルは公開なので、スクリーンショットを知らせるとあなたがここにいた記録が残ってしまいます。",
  "chat.thread.error": "エラー",
  "chat.thread.go_back": "戻る",
  "chat.bubble.via_bridge": "メッシュブリッジ経由",
  "chat.bubble.view_profile": "{name}のプロフィールを見る",
  "chat.bubble.forwarded": "転送済み",
  "chat.bubble.attachment": "添付",
  "chat.bubble.a11y": "{sender}: {body}。長押しでその他の操作。",
  "chat.bubble.failed_retry": "送信できませんでした。タップで再試行。",

  // ---- Chats: message actions and info ----
  "chat.info.title": "メッセージの詳細",
  "chat.info.delivered_to": "{name}に配信済み",
  "chat.info.read_by": "{name}が既読",
  "chat.info.group_reach_desc":
    "今つながっている人数で、配信の確認ではありません",
  "chat.info.group_alone": "他のメンバーはいません",
  "chat.info.today_at": "今日 {time}",
  "chat.info.sending": "送信中…",
  "chat.info.failed": "送信できませんでした",
  "chat.info.courier": "別の人が運んでいます",
  "chat.info.sent": "送信済み",
  "chat.info.queued": "送信待ち",
  "chat.info.waiting": "待機中…",
  "chat.action.info": "メッセージの詳細",
  "chat.action.save_photos": "写真に保存",
  "chat.action.save_copy": "コピーを保存",
  "chat.action.forward": "転送",
  "chat.action.select": "選択",
  "chat.select.cancel": "選択を解除",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "カメラ",
  "chat.attach.camera_desc": "写真または動画を撮る",
  "chat.attach.library": "フォトライブラリ",
  "chat.attach.library_desc": "ライブラリから選ぶ",
  "chat.attach.document": "書類",
  "chat.attach.document_desc": "任意のファイルやPDFを送る",
  "chat.attach.voice": "ボイスメモ",
  "chat.attach.voice_desc": "音声メッセージを録音して送る",
  "chat.attach.ecash": "ecashを送る",
  "chat.attach.ecash_desc": "ウォレットからCashuのサトシを送る",
  "chat.attach.location": "位置情報",
  "chat.attach.location_desc": "今いる場所を送る",
  "chat.attach.title": "添付",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "位置情報を共有しました",
  "chat.location.received_summary": "位置情報を共有しました",
  "chat.location.title": "位置情報",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago}前に取得",
  "chat.location.open_maps": "マップで開く",
  "chat.location.no_forward": "位置情報は転送されません",
  "chat.location.no_forward_body":
    "位置情報は一人に向けて送られます。他の人にも渡したい場合は、自分の位置情報を送ってください。",
  "chat.location.no_fix": "距離を見るには位置情報を許可してください",
  "chat.location.send_title": "位置情報を送る",
  "chat.location.send_body":
    "{name}には今の場所という一点だけが見えます。更新され続けることはありません。",
  "chat.location.send": "位置情報を送信",
  "chat.location.finding": "位置情報を取得中…",
  "chat.location.no_location": "位置情報を取得できませんでした",
  "chat.location.no_location_body":
    "位置情報へのアクセスを許可し、位置情報サービスがオンになっていることを確認してから、もう一度お試しください。",
  "chat.location.not_delivered": "位置情報を送信できませんでした",
  "chat.location.not_delivered_body":
    "位置情報は今のものだからこそ意味があるので、あとで送るために保留はしません。{name}とつながったときにもう一度お試しください。",
  "chat.location.direction.n": "北",
  "chat.location.direction.ne": "北東",
  "chat.location.direction.e": "東",
  "chat.location.direction.se": "南東",
  "chat.location.direction.s": "南",
  "chat.location.direction.sw": "南西",
  "chat.location.direction.w": "西",
  "chat.location.direction.nw": "北西",
  "chat.attach.send_anyway": "それでも送信",
  "chat.attach.bitchat_too_big": "これは届かないかもしれません",
  "chat.attach.bitchat_too_big_body":
    "{name}はbitchatを使っていて、大きなファイルは途中であきらめてしまいます。およそ350KiB以下なら確実です。Airhopの連絡先に送る場合はこの制限はありません。",
  "chat.attach.bitchat_unopenable": "相手が開けないかもしれません",
  "chat.attach.bitchat_unopenable_body":
    "{name}はbitchatを使っていて、写真とボイスメモは表示できますが、それ以外は開けないファイルとして並ぶだけです。届きはしますが、見られない可能性があります。",
  "chat.attach.file": "ファイルを添付",
  "chat.attach.unavailable": "ここでは添付を使えません",
  "chat.attach.not_sent": "添付を送信できませんでした",
  "chat.attach.read_failed":
    "そのファイルの読み込みで問題が起きました。別のファイルをお試しください。",
  "chat.attach.caption": "キャプションを追加…",
  "chat.attach.send": "添付を送信",
  "chat.attach.generic": "添付",
  "chat.media.view_full": "写真を全画面で見る",
  "chat.media.gone_photo": "この端末に写真はありません",
  "chat.media.gone_video": "この端末に動画はありません",
  "chat.media.gone_voice": "この端末にボイスメモはありません",
  "chat.media.gone_file": "この端末にファイルはありません",
  "chat.media.gone_note":
    "7日後、またはキャッシュを消去したときに削除されました",
  "chat.media.ask_resend": "もう一度頼む",
  "chat.media.resend_draft": "{kind}をもう一度送ってもらえますか。",
  "chat.media.kind_photo": "その写真",
  "chat.media.kind_video": "その動画",
  "chat.media.kind_voice": "そのボイスメモ",
  "chat.media.kind_file": "そのファイル",
  "chat.media.pause_voice": "ボイスメモを一時停止",
  "chat.media.play_voice": "ボイスメモを再生",
  "chat.media.voice_position": "ボイスメモの再生位置",
  "chat.media.voice_scrub": "バーをタップするとその位置に移動します",
  "chat.media.image": "画像",
  "chat.media.tap_load_photo": "タップして写真を読み込む",
  "chat.media.open_document": "{name}を開く",
  "chat.media.document": "書類",
  "chat.media.tap_load_video": "タップして動画を読み込む",
  "chat.media.video": "動画",
  "chat.media.photo": "写真",
  "chat.media.close_photo": "写真を閉じる",
  "chat.media.save_photo": "写真をライブラリに保存",
  "chat.media.share_photo": "写真を共有",
  "chat.media.saved_videos": "ビデオに保存しました",
  "chat.media.saved_photos": "写真に保存しました",
  "chat.media.not_saved": "保存されていません",
  "chat.media.cant_open": "ファイルを開けません",
  "chat.media.no_app":
    "この端末には、このファイルを開いたり共有したりできるアプリがありません。",
  "chat.media.open_failed":
    "ファイルを開けませんでした。キャッシュから消えている可能性があります。",
  "media.blocked.nostr_only":
    "この人とはリレー経由でしかつながっていません。使えるのはテキストだけです。写真、ファイル、ボイスメモにはBluetoothが必要です。",
  "media.blocked.private_channel":
    "ブロードキャストの添付は署名はされますが暗号化はされないため、プライベートチャンネルに送ると、ここのテキストが暗号化されたままなのに添付だけ平文になってしまいます。",
  "media.blocked.private_group":
    "ブロードキャストの添付は署名はされますが暗号化はされないため、プライベートグループに送ると、ここのテキストが暗号化されたままなのに添付だけ平文になってしまいます。",
  "media.blocked.location_channel":
    "位置チャンネルはインターネット経由で人に届き、写真、ファイル、ボイスメモはBluetoothを通るため、決して届きません。",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "ここではボイスメモを使えません",
  "chat.voice.hold_live": "長押しでライブ通話",
  "chat.voice.hold_record": "長押しでボイスメモを録音",
  "chat.voice.cancel_recording": "録音をキャンセル",
  "chat.voice.slide_cancel": "スライドでキャンセル",
  "chat.voice.release_cancel": "離すとキャンセル",
  "chat.voice.a11y_toggle": "ダブルタップで話し始めるか、話し終えます。",
  "chat.voice.limit_reached": "2分の上限に達しました、離すと送信します",
  "chat.voice.limit_sent": "2分の上限に達し、メモを送信しました",
  "chat.voice.stop_send": "録音を止めて送信",
  "chat.voice.lift_lock": "上にスライドすると手を離して録音できます",
  "chat.voice.live_speaking": "{name}が話しています",
  "voice.unavailable": "ライブ通話を使えません",
  "voice.recording_stopped": "録音を停止しました",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "カメラへのアクセス",
  "chat.perm.camera_purpose": "送る写真を撮る",
  "chat.perm.photo_label": "写真へのアクセス",
  "chat.perm.photo_purpose": "送る写真や動画を選ぶ",
  "chat.perm.photo_save_purpose": "これを写真に保存する",
  "chat.perm.mic_label": "マイクへのアクセス",
  "chat.perm.mic_live_purpose": "近くの人と話す",
  "chat.perm.mic_note_purpose": "ボイスメモを録音する",
  "chat.perm.recording_stopped": "録音を停止しました",
  "chat.perm.record_failed":
    "録音を開始できませんでした。マイクの権限を確認してください。",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "受け取り済み",
  "chat.ecash.reclaimed": "回収済み",
  "chat.ecash.claiming": "受け取り中…",
  "chat.ecash.claim": "受け取る",
  "chat.ecash.claim_amount": "{amount} {unit}を受け取る",
  "chat.ecash.already_claimed": "受け取り済みです",
  "chat.ecash.already_claimed_body":
    "このトークンのプルーフはすべてすでにウォレットにあるため、何も追加されませんでした。",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "できる限り届けるようメッシュに委ねました",
  "chat.info.queued_desc": "相手への経路ができるまでこの端末で保持しています",
  "chat.info.reclaimed": "回収済み",
  "chat.info.reclaimed_desc":
    "この支払いをウォレットに戻したため、配信されません",
  "chat.info.about": "概要",
  "chat.info.group_desc":
    "プライベートグループです。作成者が追加したメンバーだけが読め、Bluetoothの中に留まります。",
  "chat.info.teleported_desc":
    "このジオハッシュセルの公開位置チャンネルです。Airhopでもbitchatでも、このセルにいる人全員がインターネット経由で共有します。あなたはテレポート中で、実際にここにいるわけではありません。",
  "chat.info.custom_desc":
    "カスタムチャンネルです。名前を知っていれば、どのAirhopまたはbitchatの端末からでも参加できます。",
  "chat.info.private_e2ee": "プライベート · エンドツーエンド暗号化",
  "chat.info.public_plain": "公開 · 暗号化なし",
  "chat.info.group_privacy":
    "このグループを読めるのは下に表示されているメンバーだけです。メッセージはBluetoothに留まるため、圏外のメンバーには戻ってきた時点で届きます。",
  "chat.info.teleport_privacy":
    "テレポートしてきた場所です。インターネット経由でこのセルの全員に届き、Bluetooth圏内の誰にも届きません。",
  "chat.info.location_off_privacy":
    "位置情報がオフのため、このチャンネルはBluetoothで近くの端末にしか届きません。エリアのセルにインターネット経由で届けるには位置情報をオンにしてください。",
  "chat.info.invite_privacy":
    "リンクで招待した人だけが読めます。それ以外の人には、近くのピアにも見えません。",
  "chat.info.public_privacy":
    "参加した人は誰でもすべてのメッセージを読めます。プライベートな会話にはダイレクトメッセージを使ってください。DMはエンドツーエンドで暗号化されています。",
  "chat.info.remove_member": "メンバーを削除",
  "chat.info.remove_member_body":
    "{name}をグループから削除しますか。グループ鍵が更新されるので、以後の新しいメッセージは読めなくなります。",
  "chat.info.message_member": "{name}にメッセージ",
  "chat.info.remove_member_a11y": "{name}を削除",
  "chat.info.no_addable":
    "追加できるピアがいません。メンバーは近くにいる必要があります。",
  "chat.info.add_count": "{count}人を追加",
  "chat.info.teleported_tag": "{level}  ·  テレポート中",
  "chat.info.active": "アクティブ",
  "chat.info.members": "メンバー",
  "chat.info.bookmark": "この場所をブックマーク",
  "chat.info.remove_bookmark": "ブックマークを削除",
  "chat.info.default_notice":
    "標準チャンネルは退出できません。Airhopのメッシュプロトコルの一部です。",
  "chat.info.custom_channel": "カスタムチャンネル",
  "chat.info.geohash": "ジオハッシュ",
  "chat.info.copy_geohash": "ジオハッシュをコピー",
  "chat.info.relays": "リレー",
  "chat.info.show_relays": "このチャンネルを運んでいるリレーを表示",
  "chat.info.relay_custom": "カスタム",
  "chat.info.relays_none": "ありません。今このセルはBluetoothのみです。",
  "chat.info.search_members": "メンバーを検索",
  "chat.info.search_members_placeholder": "メンバーを検索…",
  "chat.info.teleported": "テレポート中",
  "chat.info.creator": "作成者",
  "chat.info.no_matches": "一致するものがありません",
  "chat.info.no_one_here": "まだ誰もいません",
  "chat.info.add_members": "メンバーを追加",
  "chat.info.add_selected": "選択したメンバーを追加",
  "chat.info.add": "追加",
  "chat.info.leave_group": "グループを退出",
  "chat.info.leave_channel": "チャンネルを退出",
  "chat.info.leave": "退出",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date}から会話しています",
  "chat.contact.verified_since": "{date}から検証済み",
  "chat.contact.anonymous": "匿名",
  "chat.contact.anonymous_desc":
    "検証できる恒久的な識別情報を持たない、ジオハッシュ上の仮名です",
  "chat.contact.verified": "検証済み",
  "chat.contact.verified_desc": "相手のQRコードを読み取りました",
  "chat.contact.verified_desc_compared": "お互いにコードを照合しました",
  "chat.contact.not_verified": "未検証",
  "chat.contact.not_verified_desc":
    "本人だと確かめるには、コードを読み取るか、通話でコードを照合してください",
  "chat.contact.e2ee": "エンドツーエンド暗号化",
  "chat.contact.e2ee_nostr": "NIP-17のギフトラップにより、リレーは読めません",
  "chat.contact.e2ee_mesh": "Noise XXに加え、Airhop端末間ではDouble Ratchet",
  "chat.contact.copy_nostr": "Nostr公開鍵をコピー",
  "chat.contact.nostr_key": "Nostr公開鍵",
  "chat.contact.cell_key_note":
    "この鍵は出会ったエリアに紐づいています。どちらかが移動すると鍵は変わり、会話もそこで終わります。どこでも話し続けるには連絡先を交換してください。",
  "chat.contact.peer_name": "ピア名",
  "chat.contact.peer_id": "ピアID",
  "chat.contact.rename": "名前を変更",
  "chat.contact.rename_needs_contact":
    "鍵を持っている相手なら名前を変えられます。先に連絡先カードを交換すると、あなたにだけ見える名前を付けられます。",
  "chat.contact.rename_needs_keys":
    "この連絡先の鍵はまだありません。メッセージを送るかコードを読み取ると、あなたにだけ見える名前を付けられます。",
  "chat.contact.renamed_by_you": "あなたが付けた名前",
  "chat.contact.copy_peer_id": "ピアIDをコピー",
  "chat.contact.verify": "連絡先を検証",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "お知らせ",
  "chat.notices.post_area": "このエリアにお知らせを掲示",
  "chat.notices.post_mesh": "メッシュにお知らせを掲示",
  "chat.notices.mark_urgent": "緊急としてマーク",
  "chat.notices.post": "お知らせを掲示",
  "chat.notices.post_short": "掲示",
  "chat.notices.delete": "お知らせを削除",
  "chat.notices.just_now": "たった今",
  "chat.notices.fades_soon": "まもなく消えます",
  "chat.notices.1_day": "1日",
  "chat.notices.3_days": "3日",
  "chat.notices.7_days": "7日",
  "chat.notices.fading": "消えかけ",
  "chat.notices.fades_in_hours": "あと{count}時間で消えます",
  "chat.notices.fades_in_days": "あと{count}日で消えます",
  "chat.notices.scope_geo": "ジオ",
  "chat.notices.scope_mesh": "メッシュ",
  "chat.notices.urgent_short": "緊急",
  "chat.notices.permanent_warning":
    "決して消えません。公開され、このエリアに紐づき、取り消すこともできません。",
  "chat.notices.none":
    "お知らせはまだありません。掲示すると、ここに残って他の人に届きます。",

  // ---- Chats: search results ----
  "chat.search.photos": "写真",
  "chat.search.videos": "動画",
  "chat.search.audio": "音声",
  "chat.search.documents": "書類",
  "chat.search.links": "リンク",
  "chat.search.ecash": "ecash",
  "chat.search.filter_by": "{filter}で絞り込む",
  "chat.search.no_matches": "「{query}」に一致する{filter}はありません",
  "chat.search.no_media": "{filter}はまだありません",
  "chat.search.result_a11y": "{chat}、{sender}からの{kind}",
  "chat.search.you": "あなた",
  "chat.search.section_chats": "チャット",
  "chat.search.section_messages": "メッセージ",
  "chat.search.section_notices": "お知らせ",
  "chat.search.hint":
    "メッセージとチャットを検索するか、上のフィルタを選んでください。",
  "chat.search.no_results": "「{query}」の結果はありません",
  "chat.search.open_chat": "{name}を開く",
  "chat.search.message_a11y": "{chat}、{sender}からのメッセージ: {snippet}",
  "chat.search.notice_a11y": "{chat}の{author}からのお知らせ: {snippet}",
  "chat.search.urgent": "緊急 ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "この一覧に{count}件あります。消去してもここから消えるだけで、メッセージは会話の中で未読のまま残ります。すべて既読にすると、両方が片付きます。",
  "chat.notif.mark_all_read": "すべて既読にする",
  "chat.notif.clear_list": "一覧を消去",
  "chat.notif.clear_all_a11y": "{count}件の通知をすべて消去",
  "chat.notif.title": "通知",
  "chat.notif.clear_short": "消去",
  "chat.notif.close": "通知を閉じる",
  "chat.notif.none": "通知はまだありません",
  "chat.notif.none_desc":
    "チャンネルやチャットからのメッセージ、メンション、お知らせがここに表示されます。",
  "chat.notif.new": "新着",
  "chat.notif.notice_in": "{channel}のお知らせ",

  // ---- Chats: forward ----
  "chat.forward.title": "転送先…",
  "chat.forward.to": "{name}に転送",
  "chat.forward.cant_send_here": "ここには転送できません",
  "chat.forward.cant_send_to": "{name}には転送できません",
  "chat.forward.channels": "チャンネル",
  "chat.forward.groups": "グループ",
  "chat.forward.locations": "場所",
  "chat.forward.dms": "ダイレクトメッセージ",
  "chat.forward.none": "他のチャットはまだありません",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "メッシュを起動中…",
  "mesh.banner.no_bluetooth":
    "この端末にBluetoothがありません · インターネットのみ",
  "mesh.banner.bluetooth_off": "Bluetoothがオフです · メッシュを使えません",
  "mesh.banner.permission_needed": "Bluetoothの権限が必要です",
  "mesh.banner.blocked":
    "Bluetoothがブロックされています · 設定で許可してください",
  "mesh.banner.location_permission": "ピアを見つけるには位置情報が必要です",
  "mesh.banner.advertising_unsupported":
    "この端末は他の端末を見つけられますが、自分は見つけてもらえません",
  "mesh.banner.location_off_android":
    "位置情報がオフです · Androidはピアを見つけるためにこれを必要とします",
  "mesh.banner.paused": "メッシュを一時停止中 · 離席中です",
  "mesh.banner.location_off": "位置情報がオフです · 位置チャンネルを使えません",
  "mesh.banner.battery_saver":
    "バッテリーセーバー · スキャン間隔を長くしています",
  "mesh.banner.wipe_incomplete":
    "消去が未完了です · データが残っている可能性があり、開き直すと再試行します",
  "mesh.banner.wifi_off":
    "Wi-Fiがオフです · 大きなファイルの送信が遅くなります",
  "mesh.banner.clock_skew":
    "この端末の時計がずれています · 日付と時刻を自動に設定してください",
  "mesh.banner.internet_off": "インターネットがオフです · Bluetoothのみ",
  "mesh.banner.relaying":
    "ローカルのピアがいません · Nostr経由で中継しています",
  "mesh.banner.tor": "Torがオン · インターネット通信を経由させています",
  "mesh.banner.tor_starting": "Torを起動中 · 接続しています",
  "mesh.banner.tor_blocked":
    "Torが接続できませんでした · メッシュは動作しています",
  "mesh.banner.gateway":
    "インターネットゲートウェイがオン · 近くのピアを中継中",
  "mesh.banner.bridge":
    "メッシュブリッジがオン · 公開チャットがつながっています",
  "mesh.banner.background_limits":
    "{brand}はバックグラウンドでメッシュを止めることがあります",
  "mesh.banner.bridge_across":
    "メッシュブリッジがオン · ブリッジ越しに{count}人",
  "mesh.banner.action.turn_on": "オンにする",
  "mesh.banner.action.allow": "許可",
  "mesh.banner.action.resume": "再開",
  "mesh.banner.action.fix": "修正",
  "mesh.banner.hint.resume": "Bluetoothの発信とスキャンを再開します",
  "mesh.banner.hint.enable_bluetooth":
    "AndroidにBluetoothをオンにするよう求めます",
  "mesh.banner.hint.location_settings": "システムの位置情報設定を開きます",
  "mesh.banner.hint.app_settings": "システム設定でAirhopの権限を開きます",
  "mesh.banner.hint.battery_settings":
    "この端末のバックグラウンド動作の設定を開きます",
  "mesh.banner.dismiss": "非表示: {label}",
  "mesh.banner.hint.dismiss": "この注意書きを今後表示しません",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "近くのピアを探しています…",
  "mesh.radar.starting": "メッシュを起動中…",
  "mesh.radar.no_bluetooth": "この端末にBluetoothがありません",
  "mesh.radar.bluetooth_off": "Bluetoothがオフです · スキャンしていません",
  "mesh.radar.permission_needed": "Bluetoothの権限が必要です",
  "mesh.radar.blocked": "Bluetoothがブロックされています",
  "mesh.radar.location_permission": "位置情報の権限が必要です",
  "mesh.radar.location_off": "位置情報がオフです · スキャンしていません",
  "mesh.radar.hint_rings": "リングは距離ではなくBLEの電波強度を表します",
  "mesh.radar.hint_checking": "Bluetoothと権限を確認しています",
  "mesh.radar.hint_internet": "メッセージはインターネット経由では届いています",
  "mesh.radar.hint_turn_on": "ピアを見つけるにはBluetoothをオンにしてください",
  "mesh.radar.hint_allow": "ピアを見つけるにはBluetoothを許可してください",
  "mesh.radar.hint_allow_settings":
    "ピアを見つけるには設定でBluetoothを許可してください",
  "mesh.radar.hint_location_permission":
    "Android 11以前はBluetoothでスキャンするのに位置情報が必要です",
  "mesh.radar.hint_android_location":
    "AndroidはBluetoothのスキャン結果を返すのに位置情報のオンを必要とします",
  "mesh.radar.signal_strong": "強い",
  "mesh.radar.signal_medium": "普通",
  "mesh.radar.signal_weak": "弱い",
  "mesh.radar.you_center": "あなた、メッシュの中心",
  "mesh.radar.sonar_hint":
    "ソナー音を鳴らします。スキャンはもともと連続して行われています。",
  "mesh.radar.paused": "メッシュを一時停止中 · 離席中です",
  "mesh.radar.ring_hint": "リングの位置は距離ではなく電波強度を表します",
  "mesh.radar.set_online":
    "ピアを見つけるにはプロフィールでステータスをオンラインにしてください",
  "mesh.radar.in_range": "圏内",
  "mesh.radar.recently_seen": "最近見かけました",
  "mesh.radar.peer_hint":
    "このピアにメッセージを送るか支払うための操作を開きます",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "たった今",
  "mesh.peer.none": "近くにピアがいません",
  "mesh.peer.none_desc":
    "Bluetooth圏内にある他のAirhopまたはbitchatの端末がここに表示されます。",
  "mesh.peer.id_copied": "ピアIDをコピーしました",
  "mesh.peer.copy_id": "ピアIDをコピー",
  "mesh.peer.their_name": "{name}と名乗っています",
  "mesh.peer.in_range": "圏内",
  "mesh.peer.relay": "リレーノード",
  "mesh.peer.relay_body":
    "誰かがメッシュを広げるために動かしている無線機です。読めないメッセージを運びます。ここに話し相手はいません。",
  "mesh.peer.send_dm": "ダイレクトメッセージを送る",
  "mesh.peer.message": "メッセージ",
  "mesh.peer.send_sats": "ecashを送る",
  "mesh.peer.amount_placeholder": "サトシで金額",
  "mesh.peer.amount_first": "ecashを送るには、先に金額を入力してください",
  "mesh.peer.cancel_send": "ecashの送信をキャンセル",
  "mesh.peer.view_peer": "ピア{name}を表示",
  "mesh.peer.view_peer_online": "ピア{name}を表示、オンライン",
  "mesh.peer.last_seen": "{ago}前に確認",
  "mesh.peer.send_amount": "{amount}サトシを送る",
  "mesh.peer.direct": "直接接続",
  "mesh.peer.check_distance": "距離を測る",
  "mesh.peer.checking": "測定中",
  "mesh.peer.no_reply": "応答なし",
  "mesh.peer.no_reply_hint":
    "移動したか、相手のアプリが応答していない可能性があります",
  "mesh.peer.rtt": "{ms}ミリ秒",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "地域",
  "mesh.level.province": "県",
  "mesh.level.city": "市",
  "mesh.level.neighborhood": "地区",
  "mesh.level.block": "街区",
  "mesh.level.building": "建物",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "利用可能",
  "wallet.balance.unit_hint": "サトシとビットコインを切り替えます",
  "wallet.balance.a11y": "残高 {value} {unit}",
  "wallet.balance.locked":
    "ウォレットの保存領域がロックされています。ecashのプルーフは暗号化ファイルに入っていて、その鍵は端末のキーチェーンにありますが、開けませんでした。端末のロックを解除してAirhopを開き直してください。",
  "wallet.balance.tor_blocked":
    "Torがオンのため、ミントへのリクエストはブロックされています。素のネットワークを通ってしまい、あなたのIPとプルーフが結び付くからです。メッシュ経由の送受信は引き続き使えます。ミントへの通信は設定のセキュリティから許可できます。",
  "wallet.balance.unconfirmed_note": "{amount}はミントでまだ確認されていません",
  "wallet.balance.reserved_note": "{amount}は送信中のために確保されています",
  "wallet.balance.other_mint_note": "{amount}は別のミントの口座にあります",
  "wallet.balance.test_mint_note":
    "テスト用ミントの遊び金が含まれます。ビットコインではなく、出金もできません。",
  "wallet.token": "トークン",
  "wallet.action.send": "ecashトークンを送る",
  "wallet.action.send_disabled":
    "ecashトークンを送る、残高がないため使えません",
  "wallet.action.receive": "ecashトークンを受け取る",
  "wallet.action.zap": "Nostrの連絡先にzapを送る",
  "wallet.action.zap_disabled":
    "Nostrの連絡先にzapを送る、残高がないため使えません",
  "wallet.action.add_mint": "Cashuのミントを追加",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "トークンを作成できませんでした",
  "wallet.send.title": "ecashを送る",
  "wallet.send.amount_in": "{unit}で金額",
  "wallet.send.body":
    "すでに持っているプルーフからオフラインで作られます。届いたと確認するまで、残高から完全に出ていくことはありません。",
  "wallet.send.stale_fee_note":
    "手数料を最後に確認したのは{days}日前です。それ以降にこのミントが手数料を上げていた場合、送信費用が少し高くなることがあります。",
  "wallet.send.fee_note":
    "残高から出るのは{spend} {unit}で、追加の{fee}は本来相手が払うミント手数料を負担する分です",
  "wallet.send.qr_too_big":
    "このトークンはコインに細かく分かれすぎていて、QRコードに収まりません。共有かコピーを使うか、ミントで更新してまとめてください。",
  "wallet.send.bearer_note":
    "この文字列を持っている人がそのお金の持ち主です。プルーフは使用済みではなく確保された状態なので、誰にも届かなかった場合は「保留中」から回収できます。",
  "wallet.send.qr_too_big_short":
    "このトークンはコインに細かく分かれすぎていて、QRコードに収まりません。共有かコピーを使ってください。",
  "wallet.send.scan_note":
    "相手のウォレットからこれを読み取ってもらってください。配信済みにするまでは回収できます。",
  "wallet.send.mesh_note":
    "トークンは暗号化されたDMとしてメッシュ経由で送られます。インターネットは不要です。",
  "wallet.send.no_peers_note":
    "メッシュタブを開いて近くの端末を探すか、別の方法でトークンを共有してください。",
  "wallet.send.send_to": "{name}に送る",
  "wallet.send.memo": "メモ（任意、トークンと一緒に届きます）",
  "wallet.send.building": "作成中…",
  "wallet.send.build": "トークンを作成",
  "wallet.send.inexact_body":
    "お持ちのプルーフでは、オフラインでちょうど{amount} {unit}を作れません。作れる最小のトークンは{spend} {unit}で、オフラインではお釣りがないため、余分な{extra} {unit}は受取人のものになります。\n\nオンラインのうちにミントで更新すると、ちょうどの額を作れる単位に分割されます。",
  "wallet.send.send_amount": "{amount}を送る",
  "wallet.send.sent_to": "{amount} {unit}を{name}に送りました",
  "wallet.send.sent_to_body":
    "{route} 相手が受け取ったと確認するか、ミントからプルーフが引き換え済みと知らされるまで、「保留中」から回収できます。",
  "wallet.send.copy_token": "トークンをコピー",
  "wallet.send.share_token": "トークンを共有",
  "wallet.send.open_in_wallet": "このトークンを別のウォレットで開く",
  "wallet.send.open_in_wallet_short": "ウォレットで開く",
  "wallet.send.to_peer": "近くのピアにトークンを送る",
  "wallet.send.to_peer_short": "ピアに送る",
  "wallet.send.mark_delivered": "配信済みにして完了",
  "wallet.send.they_got_it": "受け取られました",
  "wallet.send.keep_pending": "この送信を保留のままにする",
  "wallet.send.decide_later": "あとで決める",
  "wallet.send.no_peers": "圏内にピアがいません",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "これはあなた自身の支払いです",
  "wallet.receive.own_payment_body":
    "このコインはまだ精算していない送信のために確保されているので、受け取るものはありません。その支払いで「回収」を使うと、そのまま残高に戻せます。",
  "wallet.receive.already_have": "すでにウォレットにあります",
  "wallet.receive.already_have_body":
    "このトークンのプルーフはすべてここに保存済みのため、何も追加されませんでした。残高は変わりません。",
  "wallet.receive.stored_unconfirmed":
    "{mint}から保存しましたが、ミントではまだ確認されていません（{reason}）。",
  "wallet.receive.offline": "オフライン",
  "wallet.receive.redeemed_here":
    "{mint}で引き換えました。このプルーフはあなただけのものになり、送信者の控えはもう使えません。",
  "wallet.receive.memo_quoted": "\n\n「{memo}」",
  "wallet.receive.redeemed_at":
    "{mint}で引き換えました。これで証明可能にあなたのものとなり、送信者側のこのトークンの控えはもう使えません。",
  "wallet.receive.stored_pending":
    "{mint}から保存しましたが、ミントは未使用だとまだ確認していません{dleq}。オンラインになったらウォレットタブから更新してください。",
  "wallet.receive.dleq_inline": "（署名自体は正しいので、トークンは本物です）",
  "wallet.receive.dleq_ok": "ミントの署名は正しく、トークンは本物です。",
  "wallet.receive.dleq_uncached":
    "ミントの鍵がここに保存されていないため、オフラインでは署名を確認できませんでした。",
  "wallet.receive.dleq_warning":
    "オンラインで更新するまでは、送信者が別の場所で使っていた可能性も原理的には残ります。",
  "wallet.receive.failed": "受け取れませんでした",
  "wallet.receive.title": "ecashを受け取る",
  "wallet.receive.body":
    "Cashuのトークンを貼り付けてください。オンラインならその場でミントで引き換えられ、オフラインなら保存して次の更新時に確認します。",
  "wallet.receive.scan": "ecashのQRコードを読み取る",
  "wallet.receive.scan_short": "QRを読み取る",
  "wallet.receive.receiving": "受け取り中…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}…からnutzapを受け取り、ウォレットに引き換えました。",
  "wallet.zap.title": "Nostrの相手にzapを送る",
  "wallet.zap.not_npub": "npubではありません",
  "wallet.zap.bad_key": "無効な鍵",
  "wallet.zap.invalid_pubkey": "無効な公開鍵",
  "wallet.zap.invalid_pubkey_body":
    "npub1…または64文字の16進数のNostr公開鍵を入力してください。",
  "wallet.zap.sent": "nutzapを送信しました",
  "wallet.zap.failed": "zapに失敗しました",
  "wallet.zap.body":
    "相手がNIP-61のnutzap情報を公開していれば、ecashはその鍵に結び付けられ、他の誰にも使えず、取り消すこともできません。公開していなければ、回収できるトークンとして送られます。どちらになったかはお知らせします。",
  "wallet.zap.contact": "{name}にzapを送る",
  "wallet.zap.pubkey_placeholder": "npub1…または16進数64文字",
  "wallet.zap.sending": "送信中…",
  "wallet.nostr.copied_body":
    "これを渡せば、相手はAirhopでも他のNostrウォレットでもzapを送れます。Bluetoothは要りません。",
  "wallet.nostr.copy_key": "zapを受け取れるよう、Nostrの鍵をコピーします",
  "wallet.nostr.your_key": "あなたのNostrの鍵",

  // ---- Wallet: mints ----
  "wallet.mint.added": "ミントを追加しました",
  "wallet.mint.add_failed": "ミントを追加できませんでした",
  "wallet.mint.added_named": "{name}を追加しました",
  "wallet.mint.added_body":
    "{mint}は{units}を発行します。その鍵はこの端末に保存されたので、インターネットがなくてもこのミントのトークンを検証できます。",
  "wallet.mint.remove_plain":
    "{mint}をウォレットから削除しますか。保存された鍵も一緒に消えるので、このミントのトークンはオフラインで検証できなくなります。",
  "wallet.mint.title": "ミント",
  "wallet.mint.none": "ミントがまだありません",
  "wallet.mint.none_desc":
    "ミントはあなたのecashを発行し、引き換えます。Lightningで入金するには追加してください。トークンを受け取れば、そのミントは自動的に追加されます。",
  "wallet.mint.add": "ミントを追加",
  "wallet.mint.add_body":
    "ミントはあなたのecashを裏付けるビットコインを預かるので、そこに置く残高を任せられる相手を選んでください。URLは保存前に検証されます。誰も信頼したくない場合はNutshellで自分のミントを運用できます。",
  "wallet.mint.consolidate_body":
    "トークンが指定できるミントは常に1つだけなので、複数に分かれた残高では、最大のミントが持つ額より大きな支払いはできません。Airhopはこれを移動できます。選んだミントが発行したLightningの請求書を、他の各ミントが支払う仕組みです。わずかな経路手数料がかかり、インターネットが必要です。",
  "wallet.mint.add_short": "ミントを追加",
  "wallet.mint.checking": "確認中…",
  "wallet.mint.remove_with_balance": "残高のあるミントを削除しますか",
  "wallet.mint.remove": "ミントを削除",
  "wallet.mint.delete_anyway": "それでも削除",
  "wallet.mint.consolidate": "すべての残高を1つのミントへ移動",
  "wallet.mint.confirm_with": "{mint}でプルーフを確認",
  "wallet.mint.remove_a11y": "{mint}を削除",
  "wallet.mint.available_amount": "{amount} {unit}が利用可能",
  "wallet.mint.split_across":
    "残高が{count}のミントに分かれています。1つにまとめてください。",
  "wallet.mint.move_everything_to": "すべてを{mint}へ移動",
  "wallet.mint.consolidate_title": "1つのミントへ移動",
  "wallet.mint.moving": "移動中…",
  "wallet.mint.move": "移動",
  "wallet.mint.moved": "移動しました",
  "wallet.mint.moved_body":
    "{fees} {unit}のLightning経路手数料のあと、{amount} {unit}が{mint}に入りました。",
  "wallet.mint.nothing_moved": "何も移動しませんでした",
  "wallet.mint.destination": "· 移動先",
  "wallet.mint.will_move": "· 移動されます",
  "wallet.mint.issued_by": "発行元",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhopウォレットへの入金",
  "wallet.ln.invoice_failed": "請求書を作成できませんでした",
  "wallet.ln.price_failed": "この請求書の金額を計算できませんでした",
  "wallet.ln.paid": "支払い済み",
  "wallet.ln.deposit_credited":
    "請求書が支払われ、{mint}が{amount} {unit}を発行しました。この残高は確認済みなので、すぐにオフラインで使えます。",
  "wallet.ln.withdrawn":
    "Lightningで{paid}サトシを支払いました。ミントは経路手数料として{fee}サトシを差し引きました。",
  "wallet.ln.withdrawn_with_change":
    "Lightningで{paid}サトシを支払いました。ミントは経路手数料として{fee}サトシを差し引き、準備金のうち{change}サトシを残高に戻しました。",
  "wallet.ln.payment_failed": "支払いに失敗しました",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightningのサトシを、オフラインで使えるecashに変えられます。逆に、ecashを任意のLightning請求書へ出金することもできます。どちらもインターネットとミントが必要です。",
  "wallet.ln.deposit_body":
    "ミントが請求書を発行します。任意のLightningウォレットで支払うと、サトシがオフラインで使えるecashとして戻ってきます。",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit}のこの請求書を支払ってください。ウォレットが支払いを見張り、自動でecashを発行します。",
  "wallet.ln.expired_body":
    "この請求書は期限切れです。すでに支払っていれば、残高は自動で反映されます。",
  "wallet.ln.waiting_expires": "支払い待ち · あと{countdown}で期限切れ",
  "wallet.ln.withdraw_body":
    "bolt11の請求書を貼り付けると、ミントがあなたのecashから支払います。先に経路の準備金が提示され、経路で使われなかった分は残高に戻ります。",
  "wallet.ln.up_to": "最大{amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit}を支払う",
  "wallet.ln.deposit": "Lightningでサトシを入金",
  "wallet.ln.deposit_short": "入金",
  "wallet.ln.withdraw": "Lightning請求書へ出金",
  "wallet.ln.withdraw_short": "出金",
  "wallet.ln.deposit_title": "Lightningで入金",
  "wallet.ln.amount_placeholder": "サトシで金額",
  "wallet.ln.requesting": "リクエスト中…",
  "wallet.ln.get_invoice": "請求書を取得",
  "wallet.ln.copy_invoice": "請求書をコピー",
  "wallet.ln.open_wallet": "Lightningウォレットで開く",
  "wallet.ln.open_wallet_short": "ウォレットで開く",
  "wallet.ln.waiting": "支払いを待っています…",
  "wallet.ln.new_invoice": "新しい請求書を作る",
  "wallet.ln.new_invoice_short": "新しい請求書",
  "wallet.ln.withdraw_title": "Lightningへ出金",
  "wallet.ln.scan_invoice": "Lightning請求書のQRコードを読み取る",
  "wallet.ln.paid_from": "支払い元",
  "wallet.ln.invoice": "請求書",
  "wallet.ln.routing_reserve": "経路の準備金",
  "wallet.ln.reserved": "残高から確保",
  "wallet.ln.paying": "支払い中…",
  "wallet.ln.get_quote": "見積もりを取得",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "バックアップ",
  "wallet.backup.setup_failed": "バックアップを設定できませんでした",
  "wallet.backup.on": "バックアップがオン",
  "wallet.backup.on_body":
    "この12個の単語から残高を復元できるようになりました。\n\n他の人からもらったものは、ミントで更新するまでこのフレーズの対象外です。また復元にはミントの一覧が必要なので、単語と一緒に書き留めておいてください。",
  "wallet.backup.no_phrase": "フレーズが保存されていません",
  "wallet.backup.no_phrase_body":
    "端末のキーチェーンから復元フレーズを読み出せませんでした。端末のロックを解除してもう一度お試しください。",
  "wallet.backup.replace_title": "現在のフレーズを置き換えますか",
  "wallet.backup.replace_body":
    "すでに復元フレーズがあります。別のフレーズを復元すると置き換わります。古いフレーズが対象としていたコインはこの端末では引き続き使えますが、復元はできなくなるので、続ける前に古い単語を書き留めてあることを確かめてください。",
  "wallet.backup.replace": "置き換える",
  "wallet.backup.invalid_phrase": "このフレーズは無効です",
  "wallet.backup.invalid_phrase_body":
    "フレーズにはチェックサムが組み込まれていて、これはそれを通りません。打ち間違い、抜け、入れ替わりがないか確認してください。",
  "wallet.backup.not_bip39":
    "これらはBIP-39の単語ではありません: {words}。綴りを確認してください。",
  "wallet.backup.add_mint_first": "先にミントを追加してください",
  "wallet.backup.add_mint_first_body":
    "復元は、どのコインに署名したかをミントに尋ねる仕組みなので、どのミントに尋ねるかを知る必要があります。使っていたミントを追加してから復元してください。",
  "wallet.backup.restore_failed": "復元に失敗しました",
  "wallet.backup.phrase": "復元フレーズ",
  "wallet.backup.state_unconfirmed": "バックアップはオンですが未確認です",
  "wallet.backup.state_off": "バックアップはオフ",
  "wallet.backup.badge_on": "オン",
  "wallet.backup.badge_unconfirmed": "未確認",
  "wallet.backup.badge_off": "オフ",
  "wallet.backup.view": "復元フレーズを表示",
  "wallet.backup.setup": "復元フレーズを設定",
  "wallet.backup.view_short": "フレーズを表示",
  "wallet.backup.setup_short": "設定",
  "wallet.backup.restore": "復元フレーズからウォレットを復元",
  "wallet.backup.restore_short": "復元",
  "wallet.backup.setup_title": "復元フレーズを設定",
  "wallet.backup.on_body_short":
    "12個の単語があれば、新しい端末で残高を復元できます。",
  "wallet.backup.unconfirmed_body":
    "書き留めた控えをまだ確認していません。今のところ単語はこの端末にしかなく、バックアップが備えるべきなのはまさにその端末を失う事態です。フレーズを表示して書き留めてください。",
  "wallet.backup.not_covered":
    "{amount}はまだ対象外です。もらったコインは送り主の秘密を持っているので、交換して初めてあなたのフレーズの対象になります。ミントで更新して確保してください。",
  "wallet.backup.off_body":
    "あなたのecashはこの端末にしかありません。失えば、あなたを含め誰も取り戻せません。復元フレーズは、どこでも残高を作り直せる12個の単語です。",
  "wallet.backup.about_to_see":
    "これから12個の単語が表示されます。それ自体がお金です。",
  "wallet.backup.exact_order":
    "12個の単語を、この順序どおりに。持っている人があなたの残高を持つことになります。",
  "wallet.backup.verify_body":
    "誰も書き留めていないフレーズは、ないより悪いものです。ありもしない安全網に見えるからです。確認のため2語だけ入力してください。",
  "wallet.backup.verify_mismatch":
    "一致しません。書き留めた控えを確認してください。",
  "wallet.backup.restore_body":
    "12個の単語を入力してください。Airhopがコインを導き直し、各ミントにどれに署名したかを尋ねるので、ミントが持つ記録から残高が戻ります。",
  "wallet.backup.warn_secret":
    "読んだ人は誰でもあなたの残高を持ち去れます。スクリーンショットを撮らず、この端末に保存しないでください。",
  "wallet.backup.warn_paper":
    "紙に書いて安全な場所に保管してください。端末を失ったあと、Airhopが再び表示することはできません。",
  "wallet.backup.warn_scope":
    "復元されるのはecashだけです。識別情報、チャット、連絡先は対象外です。",
  "wallet.backup.warn_mints":
    "復元はどのコインに署名したかをミントに尋ねる必要があるので、ミントの一覧を単語と一緒に書き留めてください。",
  "wallet.backup.preparing": "準備中…",
  "wallet.backup.show_phrase": "フレーズを表示する",
  "wallet.backup.your_phrase": "あなたの復元フレーズ",
  "wallet.backup.write_down": "これを書き留めてください",
  "wallet.backup.copy_phrase": "復元フレーズをクリップボードにコピー",
  "wallet.backup.copy_clipboard": "クリップボードにコピー",
  "wallet.backup.written_down": "書き留めました",
  "wallet.backup.check_copy": "控えを確認",
  "wallet.backup.confirm": "確認",
  "wallet.backup.restore_title": "フレーズから復元",
  "wallet.backup.phrase_placeholder": "12個の単語をスペース区切りで",
  "wallet.backup.no_mints_yet":
    "ミントがまだ追加されていません。復元は特定のミントに尋ねる必要があるので、使っていたものを先に追加してください。",
  "wallet.backup.scanning": "スキャン中…",
  "wallet.backup.restore_progress": "{mint} · キーセット {step}／{total}",
  "wallet.backup.will_scan":
    "スキャン対象: {mints}。追加していないミントには尋ねないので、そこの残高は見えないままです。",
  "wallet.backup.word_n": "{position}番目の単語",
  "wallet.backup.unreachable_mints":
    "接続できませんでした: {mints}。そこにある残高はなくなっていません。通信状態のよいところでもう一度お試しください。",
  "wallet.backup.nothing_recovered":
    "スキャンしたミントからは何も復元されませんでした。",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "受け取り済みにしますか",
  "wallet.delivered.body":
    "{amount} {unit}を完全に手放します。実際には届いていなかった場合、回収はできません。",
  "wallet.delivered.body_generic":
    "確保していた額を完全に手放します。実際には届いていなかった場合、回収はできません。",
  "wallet.delivered.cancel": "まだです",
  "wallet.delivered.confirm": "受け取られました",
  "wallet.reclaim.title": "このトークンを回収しますか",
  "wallet.reclaim.body":
    "{amount} {unit}が残高に戻ります。トークンが誰にも届かなかった場合にのみ行ってください。相手がすでに文字列を持っている場合、先にミントで引き換えた側がそのお金を得ることになり、それが相手である可能性があります。",
  "wallet.reclaim.keep": "保留のままにする",
  "wallet.reclaim.confirm": "回収",
  "wallet.copied.token_body":
    "トークンをクリップボードにコピーしました。配信済みにするまでここで確保されたままなので、最初の試みが失敗しても貼り直せます。",
  "wallet.copied.phrase_body":
    "パスワードマネージャーに貼り付けてから、クリップボードを消去してください。他のアプリはクリップボードを読めますし、設定によっては他の端末と同期されます。",
  "wallet.refresh.failed": "更新に失敗しました",
  "wallet.refresh.partly": "一部だけ更新しました",
  "wallet.refresh.done": "更新しました",
  "wallet.refresh.unreachable":
    "{mints}に接続できませんでした。それ以外はすべて最新です。",
  "wallet.refresh.swapped":
    "{amount} {unit}を確認し、新しいプルーフと交換しました。",
  "wallet.refresh.secured": "{amount} {unit}が復元フレーズの対象になりました。",
  "wallet.refresh.all_confirmed":
    "ここにあるものはすべて、すでにミントで確認済みでした。",
  "wallet.pending.title": "保留中",
  "wallet.pending.reserved_desc":
    "作成して確保済み、配信は未確認です。二重に使えないよう、プルーフは残高から外して保持されています。",
  "wallet.pending.locked_desc":
    "すでに受取人の鍵に結び付けられているので、使えるのは相手だけです。ただ、まだ届いていません。トークンを共有して完了してください。",
  "wallet.pending.show_qr": "このトークンをQRコードで表示",
  "wallet.pending.copy_again": "トークンをもう一度コピー",
  "wallet.pending.share_again": "トークンをもう一度共有",
  "wallet.pending.mark_delivered": "このトークンを配信済みにする",
  "wallet.pending.delivered": "配信済み",
  "wallet.pending.reclaim_into": "このトークンを残高に回収",
  "wallet.activity.title": "履歴",
  "wallet.activity.none": "まだ何もありません",
  "wallet.activity.none_desc":
    "送受信した支払いが、新しい順に、それぞれのミントと手数料とともにここに表示されます。",
  "wallet.activity.show_fewer": "表示する支払いを減らす",
  "wallet.activity.show_less": "表示を減らす",
  "wallet.activity.received_unconfirmed": "受け取り済み、未確認",
  "wallet.activity.received": "受け取り済み",
  "wallet.activity.receive_failed": "受け取りに失敗",
  "wallet.activity.reclaimed": "回収済み",
  "wallet.activity.send_failed": "送信に失敗",
  "wallet.activity.sent": "送信済み",
  "wallet.activity.status_pending": "保留中",
  "wallet.activity.status_failed": "失敗",
  "wallet.activity.status_reclaimed": "回収済み",
  "wallet.activity.status_expired": "期限切れ",
  "wallet.activity.ln_deposit": "Lightningでの入金",
  "wallet.activity.ln_withdrawal": "Lightningでの出金",
  "wallet.activity.nutzap_received": "nutzapを受け取りました",
  "wallet.activity.spent_removed": "使用済みプルーフを削除",
  "wallet.activity.refreshed": "プルーフを更新しました",
  "wallet.activity.refreshing": "プルーフを更新中",
  "wallet.activity.just_now": "たった今",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "メッシュがオフラインです",
  "wallet.mesh_offline_body":
    "メッシュのサービスが動いていないため、トークンを渡す相手がいません。「保留中」で確保されたままです。",
  "wallet.xfer.route_mesh": "メッシュ経由で相手の端末に直接渡しました。",
  "wallet.xfer.route_nostr":
    "相手がBluetooth圏外だったため、代わりにインターネット経由で送りました。",
  "wallet.xfer.route_courier":
    "今は相手への経路がありません。他の端末が運び、いずれ相手に届いたときに渡されます。",
  "wallet.xfer.route_queued":
    "相手にはまだつながりません。順番待ちにしてあり、つながり次第送ります。",
  "wallet.xfer.mesh_offline_body":
    "メッシュのサービスが動いていないため、トークンを渡す手段がありません。何も引かれていません。",
  "wallet.xfer.could_not_send": "送信できませんでした",
  "wallet.xfer.inexact_body":
    "お持ちのプルーフでは、オフラインでちょうど{amount} {unit}を作れません。作れる最小のトークンは{spend} {unit}で、余分な{extra} {unit}は取り戻す手立てなく相手のものになります。\n\nオンラインのうちにミントで更新すると、ちょうどの額を作れる単位に分割されます。",
  "wallet.xfer.send_amount": "{amount}を送る",
  "wallet.xfer.mesh_offline": "メッシュがオフラインです",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "相手の鍵に結び付けてNostrに公開しました。相手がオンラインかどうかに関わらず、これは相手のものです。",
  "wallet.pay.rail_nutzap_dm":
    "相手の鍵に結び付けました。リレーが受け付けなかったため、メッセージとして相手に送りました。",
  "wallet.pay.rail_nutzap_undelivered":
    "相手の鍵に結び付けましたが、まだ運べていません。順番待ちで、トークンは「保留中」にあります。",
  "wallet.pay.final":
    "結び付けた支払いは回収できません。このコインを使えるのは相手の鍵だけです。",
  "wallet.pay.reclaimable":
    "届いたと確認するまで、ウォレットタブから回収できます。",
  "wallet.pay.why": "{reason}ため、この方法で送りました。",
  "wallet.pay.sent_title": "{amount} {unit}を{name}へ",
  "wallet.pay.thread_receipt":
    "{amount} {unit}を相手の鍵に結び付けて送りました。",
  "wallet.pay.title": "ecashを送る",
  "wallet.pay.to": "宛先: {name}",
  "wallet.pay.amount": "サトシで金額",
  "wallet.pay.memo": "メモ（任意、公開されます）",
  "wallet.pay.send": "送信",
  "wallet.pay.sending": "送信中…",
  "wallet.pay.action": "ecashを送る",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "カメラへのアクセス",
  "wallet.scan.camera_purpose": "ecashのQRコードを読み取る",
  "wallet.scan.photo_label": "写真へのアクセス",
  "wallet.scan.photo_purpose": "画像からecashのQRコードを読み取る",
  "wallet.scan.no_token": "その画像にecashトークンは見つかりませんでした。",
  "wallet.scan.no_invoice":
    "その画像にLightningの請求書は見つかりませんでした。",
  "wallet.scan.unreadable": "その画像を読み取れませんでした。",
  "wallet.scan.camera_failed":
    "カメラを起動できませんでした。他のカメラアプリを閉じてもう一度お試しください。",
  "wallet.scan.close": "スキャナーを閉じる",
  "wallet.scan.on_device":
    "この端末の中で読み取ります。どこにも送信されません。",
  "wallet.scan.aim_token": "ecashのQRコードにカメラを向けてください。",
  "wallet.scan.aim_invoice": "LightningのQRコードにカメラを向けてください。",
  "wallet.scan.title_token": "ecashを読み取る",
  "wallet.scan.title_invoice": "請求書を読み取る",
  "wallet.scan.desc_token":
    "別のウォレットのCashuトークンを読み取ります。Airhopに限らず、どのCashuウォレットでも使えます。",
  "wallet.scan.desc_invoice":
    "残高から支払うために、Lightningの請求書を読み取ります。",
  "wallet.scan.use_camera_a11y": "カメラで読み取る",
  "wallet.scan.use_camera": "カメラを使う",
  "wallet.scan.pick_image_a11y": "保存した画像からQRコードを読み取る",
  "wallet.scan.pick_image": "写真から選ぶ",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashuとは",
  "wallet.explain.intro":
    "Cashuはビットコインのためのecashです。トークンは、持っている人にとって価値のある文字列で、ミントがブラインド署名するため、ミントは誰が何に使ったかを知りません。アカウントもログインも要りません。",
  "wallet.explain.send": "送信",
  "wallet.explain.send_desc":
    "金額をトークンに変え、Bluetoothで近くのピアに手渡すか、テキストとして共有できます。インターネットは不要です。届いたと確認するまで、プルーフは確保されたままです。",
  "wallet.explain.receive": "受け取り",
  "wallet.explain.receive_desc":
    "トークンを貼り付けて追加します。オンラインならすぐミントで交換され、証明可能にあなたのものになります。オフラインなら保存され、更新するまで未確認として扱われます。",
  "wallet.explain.zap": "zap",
  "wallet.explain.zap_desc":
    "Nostrの相手に支払います。相手がNIP-61のnutzap情報を公開していれば、ecashはその鍵に結び付けられ、相手だけが使えます。そうでなければ暗号化されたDMに切り替わります。インターネットが必要です。",
  "wallet.explain.add_mint": "ミントを追加",
  "wallet.explain.add_mint_desc":
    "あなたのecashを発行し引き換えるミントを保存し、その公開鍵も保存するので、そのミントのトークンをオフラインで検証できます。そこに置く残高を任せられるミントを選んでください。",
  "wallet.explain.phrase": "復元フレーズ",
  "wallet.explain.phrase_desc":
    "コインは、ウォレットが最初に生成する12個の単語から導かれます。新しい端末は、どのコインに署名したかをミントに尋ねることで残高を作り直せます。表示して書き留めるまで、単語はこの端末にしかありません。",

  // ---- Wallet: failures ----
  "wallet.err.locked": "ウォレットがロックされています",
  "wallet.err.mint_unreachable": "ミントに接続できません",
  "wallet.err.tor_blocked": "Torがオンの間はブロックされます",
  "wallet.err.insufficient": "残高が足りません",
  "wallet.err.exact_amount": "その金額ちょうどは送れません",
  "wallet.err.no_mint": "ミントがありません",
  "wallet.err.mint_unsupported": "ミントが対応していません",
  "wallet.err.mint_refused": "ミントが拒否しました",
  "wallet.err.unreadable": "読み取れないトークン",
  "wallet.err.rejected": "トークンが拒否されました",
  "wallet.err.already_spent": "使用済みです",
  "wallet.err.change_pending": "支払い済み、お釣りは保留中",
  "wallet.svc.mint_unreachable": "ミントに接続できませんでした。",
  "wallet.svc.tor_ios": "iOSではミントへのリクエストはTorを通りません。",
  "wallet.svc.tor_ios_body":
    "ArtiがくるむのはNostrのWebSocketだけなので、このリクエストは素のネットワークでミントに届き、あなたのIPとこのプルーフを結び付けてしまいます。設定＞セキュリティで許可するか、先にTorをオフにしてください。メッシュ経由のecashの送受信は引き続き使えます。",
  "wallet.svc.keys_uncached": "このミントの鍵はこの端末に保存されていません。",
  "wallet.svc.keys_uncached_body":
    "オンラインのときにウォレットを一度開いて取得してください。",
  "wallet.svc.phrase_invalid": "その復元フレーズは無効です。",
  "wallet.svc.phrase_invalid_body":
    "打ち間違いや抜けがないか確認してください。フレーズにはチェックサムが組み込まれているので、1語違うだけで全体が無効になります。",
  "wallet.svc.need_mint": "先にミントを少なくとも1つ追加してください。",
  "wallet.svc.need_mint_body":
    "復元は、どのコインに署名したかをミントに尋ねる仕組みなので、どのミントに尋ねるかを知る必要があります。",
  "wallet.svc.restored": "復元フレーズから復元しました",
  "wallet.svc.storage_locked": "ウォレットの保存領域がロックされています。",
  "wallet.svc.storage_locked_body":
    "Airhopはecashのプルーフを暗号化ファイルに保存し、その鍵は端末のキーチェーンにあります。端末のロックを解除してアプリを開き直してください。",
  "wallet.svc.bad_url": "有効なURLではありません。",
  "wallet.svc.needs_https": "ミントのURLはhttps://で始まる必要があります。",
  "wallet.svc.refuse_http": "素のhttpでのミント利用は拒否します。",
  "wallet.svc.refuse_http_body":
    "経路上の誰でもあなたのプルーフを読んだり書き換えたりできてしまいます。https://のミントを使ってください。",
  "wallet.svc.mint_not_saved": "ミントを保存できませんでした。",
  "wallet.svc.unreadable_token": "読み取れるCashuトークンではありません。",
  "wallet.svc.unreadable_token_body":
    "トークンはcashuAまたはcashuBで始まります。コピー時に切れていないか確認してください。",
  "wallet.svc.wrong_mint":
    "このトークンは、名乗っているミントが署名したものではありません。",
  "wallet.svc.already_spent": "このプルーフはすでに使用されています。",
  "wallet.svc.already_spent_body":
    "このトークンを送った人が先に引き換えたか、同じトークンを別の人にも送ったかのどちらかです。",
  "wallet.svc.receiving_offline": "オフラインで受け取り中",
  "wallet.svc.amount_positive": "0より大きい金額を入力してください。",
  "wallet.svc.coins_raced": "そのコインは、たった今別の支払いで使われました。",
  "wallet.svc.coins_raced_body":
    "何も引かれていません。もう一度試すと、ウォレットが別の組み合わせを選びます。",
  "wallet.svc.no_ecash": "ecashがまだありません。",
  "wallet.svc.no_ecash_body":
    "ミントを追加してLightningで入金するか、誰かからトークンを受け取ってください。",
  "wallet.svc.split_across_mints": "残高が複数のミントに分かれています。",
  "wallet.svc.mint_says_spent":
    "ミントはこのプルーフを使用済みだと報告しました。",
  "wallet.svc.issue_against_invoice":
    "Lightningの請求書に対してecashを発行する",
  "wallet.svc.pay_invoice": "Lightningの請求書を支払う",
  "wallet.svc.unknown_deposit": "不明な入金です。",
  "wallet.svc.invoice_expired_before":
    "支払われる前に請求書の期限が切れました。",
  "wallet.svc.invoice_expired": "その請求書は期限切れです。",
  "wallet.svc.invoice_unpaid": "請求書はまだ支払われていません。",
  "wallet.svc.payment_unknown":
    "支払い状況が不明です。次の更新時に再度確認します。",
  "wallet.svc.melt_change_pending": "請求書は支払われました。",
  "wallet.svc.melt_change_pending_body":
    "ミントは未使用の経路手数料をまだ返していません。次の更新時に自動で受け取るので、その間に失われるものはありません。",
  "wallet.svc.mint_did_not_pay":
    "ミントはこの請求書を支払いませんでした。残高は変わっていません。",
  "wallet.svc.not_an_invoice": "Lightningの請求書ではありません。",
  "wallet.svc.not_an_invoice_body":
    "lnbcで始まるbolt11の請求書を貼り付けてください。",
  "wallet.svc.insufficient_for_invoice": "この請求書に足りる残高がありません。",
  "wallet.svc.coins_raced_invoice_body":
    "何も引かれておらず、請求書も支払われていません。もう一度お試しください。",
  "wallet.svc.same_mint": "別の移動先ミントを選んでください。",
  "wallet.svc.same_mint_body":
    "移動元と移動先が同じミントなので、移動するものがありません。",
  "wallet.svc.quote_failed_retried":
    "見積もりに失敗し、まとめ直しを再試行しました",
  "wallet.svc.amount_unfit_retried": "金額が合わず、まとめ直しを再試行しました",
  "wallet.svc.cannot_size": "この移動の金額を決められませんでした。",
  "wallet.svc.insufficient_at_mint": "{mint}の残高が足りません。",
  "wallet.svc.inexact_title":
    "お持ちのプルーフでは、オフラインでちょうど{amount} {unit}を作れません。",
  "wallet.svc.inexact_detail":
    "送れる最小のトークンは{spend} {unit}です。オフラインではお釣りがないため、余分な{extra} {unit}は受取人のものになります。",
  "wallet.svc.no_single_mint":
    "{amount} {unit}を1つで持っているミントがありません。異なるミントのecashは1つのトークンにまとめられないので、先に1つのミントにまとめるか、金額を分けて送ってください。",
  "wallet.svc.have_tried_send":
    "残高は{total} {unit}で、{amount}を送ろうとしました。",
  "wallet.svc.invoice_needs":
    "この請求書は経路の準備金を含めて{total} {unit}必要ですが、残高は{balance}です。",
  "wallet.svc.nothing_to_move": "{mint}には移動できる{unit}がありません。",
  "wallet.svc.consolidate_memo": "{mint}からまとめる",
  "wallet.svc.cannot_size_detail":
    "Lightningの経路手数料を差し引くと、{from}から{to}へ意味のある額を移動できません。金額を指定して、もう少し少なく移動してみてください。",
  "wallet.svc.mint_cannot": "{mint}は{action}ことができません。",
  "wallet.svc.no_nut": "ミントはNUT-{nut}への対応を公表していません。",
  "wallet.svc.unknown_mint":
    "その支払いは、あなたが使っていないミントを指しています。",
  "wallet.svc.unknown_mint_body":
    "信頼できるなら、まず自分でそのミントを追加してください。自分で選んでいないミントからは何も引き換えません。",
  "wallet.svc.no_relay": "リレーに接続していません",
  "wallet.svc.no_shared_mint": "十分な残高のある共通のミントがありません",
  "wallet.svc.no_nutzap_info":
    "受取人がnutzapの情報を公開していません（NIP-61 kind 10019）",
  "wallet.svc.locked_undelivered":
    "相手の鍵に結び付けましたが、まだ届いていません。この取引のトークンを共有して完了してください。",
  "wallet.svc.swap_lost":
    "ミントがこの交換を完了しなかったため、それに対して何も発行されていません。",
  "wallet.svc.swap_unreadable":
    "この交換は、このバージョンでは再実行できない形式で保存されています。",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QRコードで検証済み",
  "contacts.qr.keys_unverified": "鍵を受け取り済み、未検証",
  "contacts.qr.not_verified": "まだ検証していません",
  "contacts.qr.message": "メッセージ",
  "contacts.qr.add": "連絡先を追加",
  "contacts.qr.scan_title": "QRコードを読み取る",
  "contacts.qr.aim": "相手のQRコードにカメラを向けてください",
  "contacts.qr.add_desc": "メッシュの近くにいない人とつながります。",
  "contacts.qr.peer_id_hint":
    "ピアIDは16文字です。連絡先コードはairhop:で始まります。",
  "contacts.qr.or_scan": "または相手のQRを読み取る",
  "contacts.qr.trust_note":
    "相手の鍵を検証できるのは、自分のカメラで読み取ったQRだけです。貼り付けたコードは鍵を含んでいますが、本人から来た証明にはなりません。",
  "contacts.qr.peer_id": "ピアIDまたは連絡先コード",
  "contacts.qr.peer_id_placeholder": "IDまたは連絡先コードを貼り付け",
  "contacts.qr.scan_camera_a11y": "カメラでQRコードを読み取る",
  "contacts.qr.scan_camera_desc": "カメラを使う",
  "contacts.qr.upload_a11y": "ギャラリーからQR画像をアップロード",
  "contacts.qr.upload": "ギャラリーからアップロード",
  "contacts.qr.upload_desc": "保存したQR画像を選ぶ",
  "contacts.qr.scan_a11y": "QRコードを読み取って連絡先を追加",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16文字のピアID、airhop://peer/…のリンク、または連絡先コードを貼り付けてください。",
  "contacts.scan.camera_label": "カメラへのアクセス",
  "contacts.scan.camera_purpose": "連絡先のQRコードを読み取る",
  "contacts.scan.camera_needed":
    "読み取りにはカメラへのアクセスが必要です。ピアIDでの追加は引き続き使えます。",
  "contacts.scan.camera_failed":
    "カメラを起動できませんでした。他のカメラアプリを閉じてもう一度お試しください。",
  "contacts.scan.photo_label": "写真へのアクセス",
  "contacts.scan.photo_purpose": "保存したQRコードを読み取る",
  "contacts.scan.photo_needed":
    "画像を選ぶには写真へのアクセスが必要です。ピアIDでの追加は引き続き使えます。",
  "contacts.scan.no_qr": "その画像にAirhopのQRコードは見つかりませんでした。",
  "contacts.scan.unreadable": "その画像からQRコードを読み取れませんでした。",
  "contacts.scan.bitchat_expired":
    "そのbitchatのコードは期限切れです。QRを開き直してもらってください。",
  "contacts.scan.tampered":
    "このQRコードは無効です。ピアIDが鍵と一致しません。改ざんされている可能性があります。",
  "contacts.scan.already_added": "すでに連絡先にあります",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "カメラへのアクセスを待っています…",
  "contacts.verify.camera_off": "カメラがオフです",
  "contacts.verify.open_settings": "設定を開く",
  "contacts.verify.verified": "検証済み",
  "contacts.verify.different": "別の連絡先",
  "contacts.verify.scan_again": "もう一度読み取る",
  "contacts.verify.failed": "検証できませんでした",
  "contacts.verify.done": "完了",
  "contacts.verify.title": "{name}を検証",
  "contacts.verify.aim": "相手のQRコードにカメラを向けてください",
  "contacts.verify.camera_off_body":
    "QRで検証するには、設定でカメラへのアクセスをオンにしてください。",
  "contacts.verify.match_body":
    "{name}の鍵が一致しました。この連絡先は信頼できます。",
  "contacts.verify.different_body":
    "このQRは別の人のものです。{name}に本人のコードを見せてもらってください。",
  "contacts.verify.tampered_body":
    "このQRは改ざんされているようです。IDが鍵と一致しません。",
  "contacts.verify.choose_title": "どの方法で確認しますか",
  "contacts.verify.choose_body":
    "どちらも、この端末にある鍵が本当に{name}のものだと確認できます。",
  "contacts.verify.method_scan": "相手のコードを読み取る",
  "contacts.verify.method_scan_sub": "相手がその場にいる場合",
  "contacts.verify.method_compare": "コードを照合する",
  "contacts.verify.method_compare_sub": "通話でお互いに読み上げる",
  "contacts.verify.no_keys":
    "この連絡先の鍵はまだありません。メッセージを送るか、会ったときにコードを読み取ってください。",
  "contacts.verify.compare_title": "お互いに読み上げてください",
  "contacts.verify.compare_body":
    "{name}にも同じ6語が表示されています。一致すれば、鍵が本物だとお互いに確認できます。",
  "contacts.verify.codes_match": "一致します",
  "contacts.verify.codes_differ": "一致しません",
  "contacts.verify.compared_body":
    "あなたと{name}が同じコードを確認しました。この連絡先は検証済みです。",

  // ---- Settings: shared chrome ----
  "settings.back": "戻る",
  "settings.coming_soon": "近日対応",
  "settings.opens_externally": "{label}、アプリの外で開きます",
  "settings.peer_id": "ピアID",
  "settings.share_peer_id": "自分のピアIDを共有",
  "settings.share_id_short": "IDを共有",
  "settings.peer_id_sheet.title": "あなたのピアID",
  "settings.peer_id_sheet.copy": "ピアIDをコピー",
  "settings.peer_id_sheet.note":
    "これはお互いがBluetooth圏内にいるときだけ使えます。どこからでもメッセージを受け取れるようにするには、QRコードを共有してください。",

  // ---- Settings: hub rows ----
  "settings.section.general": "一般",
  "settings.section.general_desc":
    "任意の機能、送信の取り消し、メディア、リセット",
  "settings.section.privacy": "プライバシーとセキュリティ",
  "settings.section.privacy_desc":
    "前方秘匿性、署名付きパケット、ブロックしたピア",
  "settings.section.network": "ネットワークとリレー",
  "settings.section.network_desc":
    "インターネットへの切り替え、nostrリレー、bitchatとの互換性",
  "settings.section.permissions": "権限",
  "settings.section.permissions_desc":
    "Bluetooth、位置情報、通知、カメラ、マイク",
  "settings.section.storage": "ストレージとデータ",
  "settings.section.diagnostics": "診断",

  // ---- Settings: group headings ----
  "settings.group.transports": "通信経路",
  "settings.group.internet": "インターネット",
  "settings.group.nearby": "近く",
  "settings.group.sync": "同期",
  "settings.group.features": "機能",
  "settings.group.messages": "メッセージ",
  "settings.group.local": "ローカル",
  "settings.group.media": "メディア",
  "settings.group.reset": "リセット",
  "settings.group.always_on": "常時オン",
  "settings.group.notifications": "通知",
  "settings.group.blocked": "ブロック中",
  "settings.group.theme": "テーマ",
  "settings.group.font": "フォント",
  "settings.group.language": "言語",
  "settings.section.diagnostics_desc": "接続状況と近くの端末",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Bluetooth接続",
  "settings.diag.ble_links_desc": "この端末が直接つながっている端末",
  "settings.diag.lan": "ローカルネットワーク",
  "settings.diag.lan_desc": "同じ Wi-Fi につながった端末同士",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "ルーターを使わない端末同士の通信",
  "settings.diag.wifi_active": "動作中",
  "settings.diag.wifi_unsupported": "この端末では対応していません",
  "settings.diag.wifi_permission": "権限によりブロックされています",
  "settings.diag.wifi_unavailable": "今は利用できません",
  "settings.diag.wifi_unpaired": "ペアリングなし",
  "settings.diag.wifi_unknown": "無線モジュールを待っています",
  "settings.diag.relays": "Nostrリレー",
  "settings.diag.relays_desc":
    "位置チャンネルとインターネット経由の到達に使われます",
  "settings.diag.connected": "接続済み",
  "settings.diag.disconnected": "未接続",
  "settings.diag.peer_direct": "直接リンク",
  "settings.diag.peer_relayed": "別の端末を経由して受信",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "電波強度の値がありません",
  "settings.diag.no_peers": "圏内に誰もいません",
  "settings.diag.no_peers_desc": "無線リンク{links}本が開いています",
  "settings.diag.gcs_size": "フィルタのサイズ",
  "settings.diag.gcs_size_desc": "電波に載せた最大の同期フィルタ",
  "settings.diag.fpr": "誤検出率",
  "settings.diag.fpr_desc": "手元にないパケットがあるとフィルタが言う頻度",
  "settings.diag.bytes": "{n}バイト",
  "settings.diag.footnote":
    "ここでは何も変更できません。Airhopがbitchatとの互換性を保つため、これらの値は固定です。",
  "settings.section.storage_desc": "使用量とキャッシュ",
  "settings.section.appearance": "外観",
  "settings.section.appearance_desc": "テーマ、フォント、言語",
  "settings.section.help": "ヘルプとフィードバック",
  "settings.section.help_desc": "問い合わせ、不具合の報告、よくある質問",
  "settings.section.support": "サポート",
  "settings.section.support_desc": "開発の継続を支える",
  "settings.section.about": "このアプリについて",
  "settings.section.about_desc": "バージョン、変更履歴、ソースコード",

  // ---- Settings: general ----
  "settings.general.undo": "送信の取り消し",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "ウォレット",
  "settings.general.undo_seconds": "{count}秒",
  "settings.general.undo_a11y": "送信の取り消し: {value}",
  "settings.general.quality_a11y": "アップロード品質を{value}に設定",
  "settings.general.undo_desc":
    "送信したメッセージを少しの間だけ保留し、出ていく前に取り消せるようにします",
  "settings.general.undo_off_desc": "すぐ送信し、取り消しはしません",
  "settings.general.undo_2": "2秒",
  "settings.general.undo_2_desc": "取り消すためのわずかな猶予",
  "settings.general.undo_10": "10秒",
  "settings.general.undo_10_desc": "最も長い猶予",
  "settings.general.quality": "アップロード品質",
  "settings.general.quality_desc":
    "カメラやライブラリから送る写真に適用されます。どちらにしても、写真はメッシュに合わせて調整されます。",
  "settings.general.quality_low": "低",
  "settings.general.quality_low_desc": "最も小さく、最も速く送れます",
  "settings.general.quality_medium": "中",
  "settings.general.quality_medium_desc": "画質と速度のバランス",
  "settings.general.quality_high": "高",
  "settings.general.quality_high_desc": "最も多くのディテールを保ちます",
  "settings.general.feature_wallet_desc":
    "メッシュ経由で端末間に直接Cashuのecashを送ります",
  "settings.general.feature_wallet_a11y": "ウォレット（常時オン）",
  "settings.general.feature_ai_desc":
    "端末内で完結するプライベートなアシスタントで、ネットワーク通信はありません",
  "settings.general.feature_feeds": "フィード",
  "settings.general.feature_feeds_desc":
    "BlueskyとMastodonのフィードを読み、投稿します",
  "settings.general.show_media": "メディアを自動表示",
  "settings.general.show_media_desc":
    "写真と動画をチャットに表示するか、タップするまで隠しておきます",
  "settings.general.reset": "設定をリセット",
  "settings.general.media_retention": "メディアの保存期間",
  "settings.general.media_retention_desc":
    "写真、動画、ボイスメモは選んだ期間のあとに削除されます",
  "settings.general.media_retention_sheet":
    "メディアをこの端末にどれだけ残すか選んでください。削除したメディアは元に戻せません。",
  "settings.general.retention_7_desc":
    "残るものが最も少なくなります。端末そのものが危険なときに向いています。",
  "settings.general.retention_14_desc":
    "電波の届かない場所で1〜2週間過ごす場合の中間案です。",
  "settings.general.retention_30_desc":
    "会話を最も長く読める状態に保ち、その分ディスクも使います。",
  "settings.general.reset_desc":
    "識別情報、メッセージ、連絡先、ウォレットはそのままに、すべての設定を初期値へ戻します",
  "settings.general.reset_title": "設定をリセットしますか",
  "settings.general.reset_body":
    "すべての設定が初期値に戻ります。外観、送信の取り消し、接続まわり（インターネット、Tor、ゲートウェイ、ブリッジ、リレー）が対象です。識別情報、メッセージ、連絡先、ウォレットはそのままです。",
  "settings.general.reset_confirm": "リセット",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "前方秘匿性",
  "settings.security.forward_secrecy_desc":
    "DMではDouble Ratchetが常に有効です",
  "settings.security.signed_packets": "署名付きパケット",
  "settings.security.signed_packets_desc":
    "すべてのパケットにEd25519の署名があります",
  "settings.security.hide_previews": "通知のプレビューを隠す",
  "settings.security.hide_previews_desc":
    "ロック解除なしで表示されるロック画面から、送信者と本文を隠します",
  "settings.security.no_blocked": "ブロックしたピアはいません",
  "settings.security.no_blocked_desc":
    "ブロックしたピアはメッセージを送れず、メッシュタブにも表示されません",
  "settings.security.unblock_title": "このピアのブロックを解除",
  "settings.security.unblock": "ブロックを解除",
  "settings.security.unblock_peer": "{name}のブロックを解除",
  "settings.security.unblock_body":
    "{name}は再びあなたにメッセージを送れるようになり、近くにいるときはメッシュタブにも表示されます。",

  // ---- Settings: network and relays ----
  "settings.network.internet": "インターネットへの切り替え",
  "settings.network.internet_desc":
    "メッシュのピアが圏外のとき、Nostrリレー経由で続けます",
  "settings.network.internet_off_title": "インターネットをオフにしますか",
  "settings.network.internet_off_body":
    "AirhopはBluetoothのみで動きます。Nostrリレーへの接続をやめ、Tor、インターネットゲートウェイ、メッシュブリッジもすべてオフになります。近くとのBluetoothチャットは引き続き使えます。",
  "settings.network.turn_off": "オフにする",
  "settings.network.discovery": "ジオリレーの自動検出",
  "settings.network.discovery_desc":
    "300を超える分散リレーの中から、位置セルに最も近いリレーを自動で選びます",
  "settings.network.discovery_needs_relay":
    "先に独自のリレーを追加してください",
  "settings.network.discovery_needs_relay_body":
    "自動検出こそが、Airhopを最も近いリレーへ向けている仕組みです。オフにして意味があるのは、下で自分のリレーを指定したあとなので、まず1つ追加してください。",
  "settings.network.custom_only_title": "自分のリレーだけを使いますか",
  "settings.network.custom_only_body":
    "位置チャンネルとメッシュブリッジは、最も近いリレーの自動選択をやめ、あなたが追加したものだけを使います。到達範囲が狭まる可能性があり、最も近いリレーに集まるbitchatの利用者と出会えなくなることもあります。",
  "settings.network.custom": "独自のリレー",
  "settings.network.custom_desc":
    "位置チャンネルとメッシュブリッジ用に、自分のリレーを追加します",
  "settings.network.custom_added": "{max}件中{count}件を追加済み",
  "settings.network.dm_relays": "メッセージ用リレー",
  "settings.network.dm_relays_desc":
    "ダイレクトメッセージとプライベートチャンネルは常にこれらを使います。独自のリレーを追加しても変わりません。",
  "settings.network.discovery_back_on": "ジオリレーの自動検出を再開しました",
  "settings.network.discovery_back_on_body":
    "最後の独自リレーがなくなりました。位置チャンネルには公開先が必要なので、Airhopは再び最も近いリレーを自動で選びます。",
  "settings.network.add_relay": "リレーを追加",
  "settings.network.remove_relay": "{url}を削除",
  "settings.network.add_short": "追加",
  "settings.network.relay_limit":
    "追加できるリレーは{count}件です。別のものを追加するには1つ削除してください。",
  "settings.network.relay_duplicate": "そのリレーはすでに一覧にあります。",
  "settings.network.relay_invalid":
    "relay.example.comのような有効なリレーのホスト名を入力してください。ポートは、リレーが既定のポートを使っていない場合にのみ必要です。IPアドレスやローカル名は使えません。",
  "settings.network.lan": "ローカルネットワーク",
  "settings.network.lan_desc":
    "同じWiFi上の相手に届きます。iPhoneとAndroidの間でも使えます。ネットワーク上の他の端末からは、Airhopを使っていることが見えます。",
  "settings.network.lan_searching":
    "このネットワークにAirhopの端末はありません",
  "settings.network.lan_active": "このネットワークで接続中",
  "settings.network.lan_unavailable": "WiFiネットワークに接続していません",
  "settings.network.lan_permission":
    "Airhopのローカルネットワークアクセスがオフです",
  "settings.network.lan_unsupported": "この端末では利用できません",
  "settings.network.lan_foreground":
    "Airhopがバックグラウンドになると停止します。Bluetoothは動き続けます。",
  "settings.network.wifi_pair": "ペアリング",
  "settings.network.wifi_paired": "ペアリング済みデバイス",
  "settings.network.wifi_pair_find": "デバイスを探す",
  "settings.network.wifi_pair_find_desc":
    "自分を表示している近くのiPhoneを探します。両方の端末にiOS 26以降が必要です。",
  "settings.network.wifi_pair_show": "このiPhoneを表示",
  "settings.network.wifi_pair_show_desc":
    "近くのiPhoneにこの端末を見つけてもらいます。どちらかが探し、もう一方が表示します。同時に行ってください。",
  "settings.network.wifi_pair_find_action": "近くのiPhoneを選ぶ",
  "settings.network.wifi_pair_show_action": "このiPhoneを検出可能にする",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Awareは現在利用できません",
  "settings.network.wifi_pair_forget": "Settingsアプリでペアリングを解除",
  "settings.network.bitchat": "bitchatとの互換性",
  "settings.network.bitchat_desc":
    "bitchatと同じBLEメッシュで、完全に相互運用できます。これは常にオンで、無効にはできません。",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "バックグラウンドで動作",
  "settings.conn.background_desc": "Airhopを閉じてもメッシュを動かし続けます",
  "settings.conn.background_on_title": "メッシュを動かし続けますか",
  "settings.conn.background_on_body":
    "Airhopは閉じている間も中継と受信を続けるので、離れている間もメッセージが届きます。その間、Androidは常時表示の通知を出します。",
  "settings.conn.background_off_title": "Airhopを閉じたらメッシュを止めますか",
  "settings.conn.background_off_body":
    "メッセージはAirhopを開いている間しか届かなくなり、この端末は近くの人のための中継もやめます。常時表示の通知は消えます。",
  "settings.conn.live_voice": "ライブ通話",
  "settings.conn.live_voice_desc": "トランシーバーのように近くの人と話します",
  "settings.conn.live_voice_on_title": "ライブ通話をオンにしますか",
  "settings.conn.live_voice_on_body":
    "マイクを押している間、話す声がBluetooth圏内の全員に届き、相手の声もこの端末で再生されます。録音はされません。",
  "settings.conn.live_voice_off_title": "ライブ通話をオフにしますか",
  "settings.conn.live_voice_off_body":
    "マイクを押すと、代わりにボイスメモを録音します。指を離すと送信され、相手が再生するまで誰にも聞かれません。",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor経由の通信",
  "settings.conn.tor_desc":
    "プライバシーを高めるため、Nostrの通信をTor経由にします",
  "settings.conn.tor_on_title": "Nostrの通信をTor経由にしますか",
  "settings.conn.tor_on_body":
    "リレーからあなたのIPアドレスが見えなくなります。接続に時間がかかり、メッセージの到着も遅くなります。Bluetoothには影響しません。",
  "settings.conn.tor_off_title": "Tor経由の通信をオフにしますか",
  "settings.conn.tor_off_body":
    "Nostrの通信は通常の接続に戻るので、リレーから再びIPアドレスが見えます。どちらにしてもBluetoothには影響しません。",
  "settings.conn.tor_unavailable": "このビルドではTor経由の通信を使えません。",
  "settings.conn.tor_timeout":
    "Torの接続に1分以上かかっています。オンのまま試み続けます。中継が始まったか、このネットワークが遮断しているかは、メッシュタブでお知らせします。",
  "settings.conn.tor_failed":
    "Torを起動できませんでした。アプリにネットワークへのアクセスがあるか確認してください。",
  "settings.conn.mint_clearnet": "素のネットワークでのミント通信を許可",
  "settings.conn.mint_clearnet_desc":
    "iOSではTorはNostrしか覆いません。オフのままにするとミントへのリクエストを遮断します。メッシュ経由のecashはどちらでも使えます。",
  "settings.conn.gateway": "インターネットゲートウェイ",
  "settings.conn.gateway_desc":
    "近くのオフラインの端末に接続を貸し、位置チャンネルに届くようにします",
  "settings.conn.gateway_on_title":
    "インターネットゲートウェイをオンにしますか",
  "settings.conn.gateway_on_body":
    "自分の接続を持たない近くの端末が、あなたの接続を通して位置チャンネルのメッセージを送受信します。あなたのモバイル通信とバッテリーを使いますが、相手のメッセージはエンドツーエンドで暗号化されたままなので、通る内容を読むことはできません。",
  "settings.conn.gateway_off_title":
    "インターネットゲートウェイをオフにしますか",
  "settings.conn.gateway_off_body":
    "近くのオフラインの端末は、あなたの接続を通して位置チャンネルに届かなくなります。あなた自身のメッセージには影響しません。",
  "settings.conn.bridge": "メッシュブリッジ",
  "settings.conn.bridge_desc":
    "このエリアの公開#bluetoothチャットを、インターネット経由で圏外の別のBluetoothの集まりとつなぎます",
  "settings.conn.bridge_on_title": "メッシュブリッジをオンにしますか",
  "settings.conn.bridge_on_body":
    "あなたの公開#bluetoothメッセージがインターネット経由で近隣に公開され、Bluetooth圏外の人も読めるようになります。プライベートメッセージが橋渡しされることはなく、「近くのみ」にすればそのメッセージだけをローカルに留められます。",
  "settings.conn.bridge_off_title": "メッシュブリッジをオフにしますか",
  "settings.conn.bridge_off_body":
    "あなたの公開#bluetoothメッセージは再びBluetooth圏内に留まり、橋渡し先からのメッセージもここには届かなくなります。",
  "settings.conn.bridge_needs_location":
    "メッシュブリッジには位置情報が必要です",
  "settings.conn.bridge_needs_location_desc":
    "位置の測定から近隣エリアを判断します。橋渡しを始めるには位置情報を許可してください。",
  "settings.conn.grant_location": "位置情報の権限を許可",
  "settings.conn.grant_short": "許可",
  "settings.conn.internet_off": "インターネットがオフです",
  "settings.conn.internet_off_desc":
    "Tor、ブリッジ、ゲートウェイはいずれもインターネットを使います。使うには、ネットワークの設定でインターネットへの切り替えをオンにしてください。",
  "settings.conn.turn_on": "オンにする",
  "settings.conn.turn_off": "オフにする",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "近くの端末を見つけ、その間でメッセージを中継します。これがないとメッシュは動きません。",
  "settings.permissions.location": "位置情報",
  "settings.permissions.location_desc":
    "近くのエリアチャンネルを開きます。これがないとそれらのチャンネルは閉じたままですが、Bluetoothメッシュは通常どおり動きます。",
  "settings.permissions.notifications": "通知",
  "settings.permissions.notifications_desc":
    "アプリを閉じていても新着メッセージの通知を受け取れます。これがないと、Airhopを開いたときにしか気づけません。",
  "settings.permissions.camera": "カメラ",
  "settings.permissions.camera_desc":
    "QRコードを読み取り、送る写真や動画を撮ります。これがなくても、ライブラリからメディアを共有できます。",
  "settings.permissions.photos": "写真",
  "settings.permissions.photos_desc":
    "ライブラリから写真を送り、受け取ったメディアを保存します。これがなくても、カメラで新しい写真を撮って送れます。",
  "settings.permissions.microphone": "マイク",
  "settings.permissions.microphone_desc":
    "音声メッセージを録音して送るほか、ライブ通話にも使います。これがないと音声メッセージもライブ通話も使えません。",
  "settings.permissions.allow": "この権限を許可",
  "settings.permissions.open_settings": "システム設定を開いてこの権限を変更",
  "settings.permissions.system": "システム",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "通信量",
  "settings.storage.storage_usage": "ストレージ使用量",
  "settings.storage.storage_usage_desc":
    "メッセージ、ウォレットのプルーフ、キャッシュした添付",
  "settings.storage.session_usage": "今回の起動 · 送信{sent}、受信{received}",
  "settings.storage.cache": "キャッシュ",
  "settings.storage.cache_desc": "添付{size}",
  "settings.storage.clear_cache": "添付のキャッシュを消去",
  "settings.storage.clear": "消去",
  "settings.storage.clear_title": "キャッシュしたメディアを消去しますか",
  "settings.storage.clear_body":
    "送ったものも受け取ったものも含め、写真、動画、ボイスメモ、ファイルがこの端末から削除されます。再ダウンロードはできません。吹き出しにその旨が表示され、送信者に送り直してもらうことはできます。メッセージとウォレットはそのままです。",
  "settings.storage.cleared": "キャッシュを消去しました",
  "settings.storage.freed": "{size}を解放しました。",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "外観を{value}に設定",
  "settings.font.set_a11y": "等幅フォントを{value}に設定",
  "settings.font.system": "システム",
  "settings.font.system_desc": "端末の既定の等幅フォントを使います",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "現代的で読みやすい書体",
  "settings.language.en": "英語",
  "settings.language.am": "アムハラ語",
  "settings.language.ar": "アラビア語",
  "settings.language.bn": "ベンガル語",
  "settings.language.my": "ビルマ語",
  "settings.language.zh_hans": "中国語（簡体字）",
  "settings.language.zh_hant": "中国語（繁体字）",
  "settings.language.nl": "オランダ語",
  "settings.language.fil": "フィリピン語",
  "settings.language.fr": "フランス語",
  "settings.language.ka": "ジョージア語",
  "settings.language.de": "ドイツ語",
  "settings.language.hi": "ヒンディー語",
  "settings.language.id": "インドネシア語",
  "settings.language.it": "イタリア語",
  "settings.language.ja": "日本語",
  "settings.language.ko": "韓国語",
  "settings.language.mg": "マダガスカル語",
  "settings.language.ms": "マレー語",
  "settings.language.ne": "ネパール語",
  "settings.language.fa": "ペルシャ語",
  "settings.language.pl": "ポーランド語",
  "settings.language.pt_br": "ポルトガル語（ブラジル）",
  "settings.language.pt_pt": "ポルトガル語（ポルトガル）",
  "settings.language.pa": "パンジャブ語",
  "settings.language.ru": "ロシア語",
  "settings.language.es": "スペイン語",
  "settings.language.sw": "スワヒリ語",
  "settings.language.sv": "スウェーデン語",
  "settings.language.ta": "タミル語",
  "settings.language.th": "タイ語",
  "settings.language.tr": "トルコ語",
  "settings.language.uk": "ウクライナ語",
  "settings.language.ur": "ウルドゥー語",
  "settings.language.vi": "ベトナム語",
  "settings.language.pseudo": "疑似ロケール",
  "settings.language.soon": "近日対応",
  "settings.language.soon_a11y": "{value}、近日対応",
  "settings.language.set_a11y": "言語を{value}に設定",
  "settings.language.pending": "次回起動時",
  "settings.language.pending_a11y":
    "{value}、次にAirhopを開いたときに適用されます",
  "settings.language.rtl_restart": "今すぐ開き直す",
  "settings.language.rtl_title": "Airhopを開き直すと完了します",
  "settings.language.rtl_body":
    "{value}は右から左へ読む言語で、Airhopが表示方向を変えられるのは起動時だけです。いったん閉じて開き直すと切り替えが完了します。失われるものはなく、それまでメッシュはつながったままです。",
  "settings.theme.light": "ライト",
  "settings.theme.light_desc": "常にライトの配色を使います",
  "settings.theme.dark": "ダーク",
  "settings.theme.dark_desc": "常にダークの配色を使います",

  // ---- Settings: profile and identity ----
  "settings.status.online": "オンライン",
  "settings.status.online_desc": "発見可能で、発信とスキャンをします",
  "settings.status.away": "離席中",
  "settings.status.away_desc":
    "メッシュは一時停止中で、スキャンも発信もしません",
  "settings.status.invisible": "非表示",
  "settings.status.invisible_desc": "スキャンはしますが、発見はされません",
  "settings.status.title": "ステータス",
  "settings.status.set_a11y": "ステータスを{value}に設定",
  "settings.status.edit": "ステータスを編集",
  "settings.status.desc": "メッシュ上でどれだけ見えるかを選びます。",
  "settings.transfer.identity": "識別情報と鍵",
  "settings.transfer.identity_desc": "ピアID、ユーザー名、連絡先",
  "settings.transfer.chats": "チャットと履歴",
  "settings.transfer.chats_desc": "会話、グループ、参加しているチャンネル",
  "settings.transfer.wallet": "ウォレットの残高",
  "settings.transfer.wallet_desc": "Cashuのプルーフと取引履歴",
  "settings.transfer.title": "新しい端末へ移行",
  "settings.transfer.desc":
    "識別情報、チャット、ウォレットを別の端末へ移します",
  "settings.transfer.coming_soon_a11y": "新しい端末へ移行、近日対応",
  "settings.transfer.body":
    "両方の端末を近づけて、Bluetoothですべてを移します。サーバーを一切通らないので、インターネットがなくても使えます。",
  "settings.qr.permission_label": "写真へのアクセス",
  "settings.qr.permission_purpose": "QRコードを保存する",
  "settings.qr.saved": "保存しました",
  "settings.qr.saved_body": "QRコードをフォトライブラリに保存しました。",
  "settings.qr.save_failed": "保存できませんでした",
  "settings.qr.save_failed_body":
    "QRコードを保存できませんでした。もう一度お試しください。",
  "settings.qr.share_message": "Airhopで私を追加してください",
  "settings.qr.share_body":
    "Airhopで私を追加してください — インターネットなしで動く、プライベートなメッシュメッセージング。",
  "settings.qr.show_short": "QRを表示",
  "settings.qr.title": "あなたのQRコード",
  "settings.qr.note":
    "これにはあなたの公開鍵が含まれ、他の人がどこからでもメッセージを送れるようになります。信頼できる相手にだけ共有してください。識別情報を消去しない限り変わりません。",
  "settings.qr.code_label": "連絡先コード",
  "settings.qr.copy_code": "連絡先コードをコピー",
  "settings.qr.share": "QRコードを共有",
  "settings.qr.share_short": "QRを共有",
  "settings.qr.download": "QRコードをダウンロード",
  "settings.qr.download_short": "QRを保存",
  "settings.qr.show": "QRコードを表示",
  "settings.wipe.trigger": "緊急消去を実行",
  "settings.wipe.trigger_desc": "3回タップで、確認なしにただちに消去します",
  "settings.wipe.title": "緊急消去",
  "settings.wipe.now": "今すぐ消去",
  "settings.wipe.desc": "すべての鍵、メッセージ、プルーフをただちに破棄します",
  "settings.wipe.body":
    "すべての鍵、メッセージ、ウォレットのプルーフをただちに破棄します。元に戻せません。",
  "settings.wipe.in_progress": "消去中",
  "settings.wipe.in_progress_body":
    "鍵、メッセージ、ファイルを破棄しています。数秒かかりますが、アプリを閉じても最後まで実行されます。",
  "settings.wipe.got_it": "わかりました",
  "settings.wipe.keys_failed": "鍵を破棄できませんでした",
  "settings.wipe.keys_failed_body":
    "メッセージ、連絡先、ウォレットは消えましたが、端末が鍵の解放を拒みました。端末のロックを解除してもう一度消去してください。",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "お問い合わせ",
  "settings.help.contact_a11y": "{address}にメールする",
  "settings.help.bug": "不具合を報告",
  "settings.help.bug_desc": "GitHubでissueを開きます",
  "settings.help.bug_a11y": "GitHubで不具合を報告",
  "settings.help.faq": "よくある質問",
  "settings.help.faq_desc": "よく寄せられる質問への回答",
  "settings.help.faq_a11y": "よくある質問を開く",
  "settings.help.terms_desc": "Airhopの使い方の決まり",
  "settings.help.terms_a11y": "利用規約を開く",
  "settings.help.privacy_desc": "収集しないもの",
  "settings.help.privacy_a11y": "プライバシーポリシーを開く",

  // ---- Settings: support ----
  "settings.support.card": "カードまたはUPI",
  "settings.support.card_desc": "ネットバンキングとウォレット、世界中から",
  "settings.support.card_a11y":
    "カード、UPI、ネットバンキング、ウォレットで支援",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "毎月または一回だけ、プラットフォーム手数料なし",
  "settings.support.sponsors_a11y": "GitHub Sponsorsで支援",
  "settings.support.note":
    "Airhopは空いた時間に作っています。出資者も広告もありません。役に立っているなら、支援は開発を続ける大きな助けになります。どちらにしても、すべての機能は無料のままです。",

  // ---- Settings: about and version ----
  "settings.about.version": "バージョン",
  "settings.about.version_desc": "現在のリリース",
  "settings.about.version_a11y": "バージョンを確認し、更新を調べる",
  "settings.about.release_notes": "リリースノート",
  "settings.about.release_notes_desc": "最新リリースの新着情報",
  "settings.about.release_notes_a11y": "GitHubで最新のリリースノートを開く",
  "settings.about.source": "ソースコード",
  "settings.about.source_a11y": "GitHubでソースコードを開く",
  "settings.about.licenses": "オープンソースライセンス",
  "settings.about.open_repo": "{name}のリポジトリを開く",
  "settings.about.licenses_desc": "サードパーティのオープンソースパッケージ",
  "settings.about.licenses_a11y": "サードパーティのライセンスを見る",
  "settings.version.codename": "コードネーム",
  "settings.version.checking": "確認中",
  "settings.version.check": "更新を確認",
  "settings.version.checking_title": "更新を確認しています",
  "settings.version.up_to_date": "最新のバージョンです。",
  "settings.version.release_notes": "リリースノートを見る",
  "settings.version.made_with": "使用技術",
  "settings.version.number": "バージョン {version}",
  "settings.version.update_to": "{version}に更新",
  "settings.version.update_to_a11y": "バージョン{version}に更新",
  "settings.version.released_under": "{license}のもとで公開",
  "settings.version.notes_a11y": "バージョン{version}のリリースノートを見る",
  "settings.version.tor_paused":
    "IPが漏れないよう、Torがオンの間は更新の確認を止めています。ブラウザでリリースのページをご覧ください。",
  "settings.version.check_failed":
    "更新を確認できませんでした。接続を確認してもう一度お試しください。",
  "settings.version.downloading": "ダウンロード中 {percent}%",
  "settings.version.install": "インストール",
  "settings.version.download_failed":
    "ダウンロードに失敗しました。接続を確認してもう一度お試しください。",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind}は{size}KiBで、{cap}KiBの上限を超えています。",
  "transfer.failed.malformed":
    "添付が壊れた状態で届き、開けませんでした。もう一度送ってもらってください。",
  "transfer.failed.unsupported_type":
    "このアプリでは開けない形式の添付が届きました。",
  "transfer.failed.type_mismatch":
    "添付を拒否しました。中身が申告されたファイル形式と一致しません。",
  "transfer.failed.storage":
    "添付が届きましたが保存できませんでした。空き容量を確認してください。",
  "transfer.badge.waiting": "待機中 · {name}",
  "transfer.badge.active_count": "{count}件の転送",
  "transfer.badge.sending": "{name}を送信中",
  "transfer.badge.receiving": "{name}を受信中",
  "transfer.badge.a11y": "{label}、{percent}パーセント。会話を開きます。",
  "transfer.kind.photo": "写真",
  "transfer.kind.video": "動画",
  "transfer.kind.voice": "ボイスメモ",
  "transfer.this.photo": "この写真",
  "transfer.this.video": "この動画",
  "transfer.this.voice": "このボイスメモ",
  "transfer.this.file": "このファイル",
  "transfer.kind.document": "書類",
  "transfer.kind.voice_preview": "ボイスメモ",
  "transfer.kind.photo_preview": "写真",
  "transfer.kind.video_preview": "動画",
  "transfer.kind.document_preview": "書類",

  // ---- System notifications ----
  "notif.channel.messages": "メッセージ",
  "notif.channel.nearby": "近くのピア",
  "notif.channel.nearby_desc":
    "Bluetooth圏内に人を見つけたときに、ときどきお知らせします。",
  "notif.nearby.body": "今Bluetooth圏内にいます。タップでメッシュを開きます。",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "誰か",
  "notif.notice_urgent": "緊急のお知らせ · {content}",
  "notif.notice": "お知らせ · {content}",
  "notif.incoming_file": "受信中のファイル",
  "notif.preview.photo": "📷 写真",
  "notif.preview.voice": "🎤 音声メッセージ",
  "notif.preview.video": "🎥 動画",
  "notif.preview.document": "📄 書類",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "新しいメッセージ",
  "notif.hidden.channel": "新しい動き",
  "notif.hidden.mention": "メンションされました",
  "notif.mention.title": "{sender}があなたをメンションしました",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "他{count}件を表示",
  },
  "chat.channels.show_more_a11y": {
    other: "他{count}件の標準チャンネルを表示",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}、未読{count}件",
  },
  "a11y.new_count": {
    other: "{label}、新着{count}件",
  },
  "chat.a11y.unread": {
    other: "未読{count}件",
  },
  "chat.thread.length_left": {
    other: "残り{count}",
  },
  "settings.general.retention_days": {
    other: "{count}日",
  },
  "chat.info.group_reach": {
    other: "{count}人中{reachable}人がつながっています",
  },
  "chat.group_members": {
    other: "プライベートグループ  ·  {count}人",
  },
  "chat.select.count": {
    other: "{count}件を選択中",
  },
  "chat.select.forward": {
    other: "{count}件のメッセージを転送",
  },
  "chat.voice.live_speaking_count": {
    other: "{count}人が話しています",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "圏内に{count}台のピア",
  },
  "mesh.peer.hops_away": {
    other: "{count}ホップ先",
  },
  "chat.presence.active": {
    other: "{count}人がアクティブ",
  },
  "chat.presence.nearby": {
    other: "近くに{count}人",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "{count}件のミント",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint}は{count}個のプルーフに{balance} {unit}を保持しています。削除するとそのプルーフはこの端末から永久に消え、バックアップもありません。先に残高を出金するか送ってください。",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other: "{count}件の入金が支払い待ちです。アプリを開くたびに再確認します。",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "{mints}から未使用のプルーフを{count}個復元しました。",
  },
  "wallet.backup.already_spent": {
    other:
      "{count}枚のコインが見つかりましたが、すでに使用済みだったため、その分は反映されていません。これは正常です。かつて使ったコインは、ミントが持つ記録に残り続けます。",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "他{count}件を表示",
  },
  "wallet.activity.show_more_a11y": {
    other: "他{count}件の支払いを表示",
  },
  "wallet.mint.unconfirmed_count": {
    other: "{count}件が未確認",
  },
  "wallet.proof_count": {
    other: "{count}個のプルーフ",
  },
  "wallet.spent_removed_detail": {
    other: "{count}個のプルーフはすでに使用済みだったため削除しました。",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "近くに{count}人",
  },
};

export const ja = { strings, plurals };
