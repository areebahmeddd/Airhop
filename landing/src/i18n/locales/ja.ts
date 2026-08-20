import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "ホームに戻る",
  "common.last_updated": "最終更新: {date}",

  "nav.aria": "メインナビゲーション",
  "nav.home": "Airhop ホーム",
  "nav.skip": "本文へスキップ",
  "nav.menu.open": "メニューを開く",
  "nav.menu.close": "メニューを閉じる",
  "nav.how_it_works": "仕組み",
  "nav.architecture": "アーキテクチャ",
  "nav.faq": "よくある質問",

  "footer.aria": "フッター",
  "footer.tagline": "プライベートなメッシュ通信",
  "footer.credit": "© {author} が {heart} を込めて制作",
  "footer.group.download": "ダウンロード",
  "footer.group.resources": "リソース",
  "footer.group.social": "ソーシャル",
  "footer.group.legal": "法的事項",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "アーキテクチャ",
  "footer.link.blogs": "ブログ",
  "footer.link.faq": "よくある質問",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "利用規約",
  "footer.link.privacy": "プライバシーポリシー",
  "footer.link.license": "プロジェクトのライセンス",

  "settings.theme.group": "カラーテーマ",
  "settings.theme.light": "ライトテーマ",
  "settings.theme.dark": "ダークテーマ",
  "settings.language.label": "言語",
  "settings.language.suggestion": "このページを日本語で表示",
  "settings.language.dismiss": "閉じる",

  "home.hero.release": "最新リリース",
  "home.hero.title": "インターネットなしで使えるメッセージング。",
  "home.hero.body":
    "近くのスマートフォンが Bluetooth メッシュを形成し、エンドツーエンドで暗号化したまま最大 7 ホップまでメッセージを中継します。{no_servers}、{no_accounts}、{no_tracking}。",
  "home.hero.body.no_servers": "サーバーなし",
  "home.hero.body.no_accounts": "アカウントなし",
  "home.hero.body.no_tracking": "追跡なし",
  "home.hero.download": "アプリをダウンロード",
  "home.hero.badges": "MIT ライセンス · 無料・オープンソース · bitchat と相互運用",
  "home.hero.group.mobile": "モバイル",
  "home.hero.group.desktop": "デスクトップ",
  "home.hero.option.f_droid": "オープンソースのカタログ",
  "home.hero.option.apk": "直接ダウンロード",
  "home.hero.option.soon": "近日公開",

  "home.about.eyebrow": "Airhop とは",
  "home.about.title": "ほとんどのアプリは中央サーバーに依存しています。",
  "home.about.sub":
    "サーバーは監視も、停止も、遮断もできます。Airhop にはサーバーがないため、圧力をかける企業も、閉鎖できるサービスもありません。",
  "home.about.card": "技術概要",
  "home.about.link.mesh": "Bluetooth Low Energy メッシュ",
  "home.about.link.wire_protocol": "ワイヤプロトコル",
  "home.about.body.built":
    "Airhop は、{mesh} 上でのプライベートなピアツーピア通信のための iOS・Android 向けオープンソースアプリです。{bitchat} を土台とし、その {wire_protocol} とセキュリティモデルを再利用したうえで、オフラインの {ecash} 決済とオフライン AI を加えています。インターネット接続がまったくなくても動作し、メッセージは近くの端末を経由して自動的に中継されます (屋内では 1 ホップあたりおよそ 10〜30 メートル、屋外ではさらに遠く)。最大 7 ホップです。",
  "home.about.body.identity":
    "あなたの識別情報は端末上で生成される {ed25519} の鍵ペアで、{ios_keychain} または {android_keystore} に保存されます。アカウントも登録もなく、サーバーに触れるものは何もありません。つまり、削除すればあなたにつながる痕跡が何も残らない使い捨てアプリとしても使えます。",
  "home.about.body.crypto":
    "各セッションは認証付きハンドシェイクに {noise} プロトコルを使います。保存されたメッセージは {ratchet} アルゴリズムを使うため、後から端末が侵害されても過去のメッセージは読めないままです。緊急消去はすべての鍵とメッセージを 1 秒未満で破棄します。",
  "home.about.body.internet":
    "あなたと相手が Bluetooth の圏外にいるときは、{nostr} リレーがインターネット経由の橋渡しとなり、{nip17} 形式でギフトラップしたダイレクトメッセージを使います。そのため二人ともオンラインであれば、メッシュは世界規模に広がります。{tor} は iOS ({arti} 経由) でも Android ({orbot} 経由) でも利用できます。",
  "home.about.optional.title": "Airhop には、自分で有効にできる任意の機能があります:",
  "home.about.optional.payments.label": "オフライン決済:",
  "home.about.optional.payments.body":
    "{cashu} プロトコルを使い、メッシュ上で送金と受け取りができます (Bitcoin のみ)。",
  "home.about.optional.ai.label": "オフライン AI:",
  "home.about.optional.ai.body":
    "重要な質問に答えられる、端末上で動く小さな AI アシスタント。処理もデータもすべて端末内にとどまります。",
  "home.about.body.compatible":
    "Airhop はプロトコルの層で bitchat と互換です。同じメッシュ上の Airhop 端末と bitchat 端末は自動的に互いを検出し、設定なしでメッセージとダイレクトメッセージをやり取りできます。",

  "home.situations.eyebrow": "必要になるとき",
  "home.situations.title": "ネットワークが落ちた日のために。",
  "home.situations.sub":
    "自然災害、インターネット遮断、大規模な抗議、あるいは圏外で過ごすふつうの週末。",
  "home.situations.disaster.label": "災害",
  "home.situations.disaster.line":
    "基地局が停止。掲示板の知らせが、通りかかった人すべてに届きます。",
  "home.situations.offgrid.label": "圏外",
  "home.situations.offgrid.line": "山道に入って 2 日目。最後のアンテナは昨日消えました。",
  "home.situations.protest.label": "抗議",
  "home.situations.protest.line":
    "ビラの QR コードが、行進のための暗号化されたチャンネルを開きます。",
  "home.situations.festival.label": "フェス",
  "home.situations.festival.line":
    "会場に電波はありません。メッセージは見知らぬ人の端末を跳ねていきます。",

  "home.showcase.eyebrow": "アプリを見る",
  "home.showcase.title": "ごくふつうのメッセンジャー、オフラインで。",
  "home.showcase.sub":
    "チャット、チャンネル、ウォレット、そして識別情報。表面は見慣れたまま、下でメッシュが働いています。",
  "home.showcase.mesh.title": "メッシュ",
  "home.showcase.mesh.caption":
    "圏内にいる全員が、近さの順に並びます。事前に誰かを追加する必要はありません。",
  "home.showcase.mesh.alt":
    "Airhop アプリのメッシュ画面。近くの 4 台が電波の強さに応じてレーダー上に配置されています。",
  "home.showcase.chats.title": "チャット",
  "home.showcase.chats.caption":
    "ごくふつうの会話。メッセージを中継する端末は、その中身を開けません。",
  "home.showcase.chats.alt":
    "停電中の Airhop でのダイレクトメッセージの会話。3 台の端末を経由して中継されています。",
  "home.showcase.channels.title": "チャンネル",
  "home.showcase.channels.caption":
    "ひと区画ほどの小ささから地域全体の広さまで、そこにいる誰にでも開かれた公開ルーム。",
  "home.showcase.channels.alt":
    "Airhop アプリのチャット画面。区画、近隣、市、地域ごとに区切られた公開チャンネルが並んでいます。",
  "home.showcase.wallet.title": "ウォレット",
  "home.showcase.wallet.caption":
    "どちらの端末もオフラインのまま、Bluetooth で隣の人に ecash を手渡せます。",
  "home.showcase.wallet.alt":
    "Airhop アプリのウォレット画面。Bluetooth で送れる ecash の残高が表示されています。",
  "home.showcase.identity.title": "識別情報",
  "home.showcase.identity.caption":
    "登録なし、電話番号なし、メールなし。この端末から決して出ていかない鍵だけ。",
  "home.showcase.identity.alt":
    "Airhop アプリのプロフィール画面。アカウントなしで端末上に生成された識別情報が表示されています。",

  "home.how.eyebrow": "仕組み",
  "home.how.title": "メッシュはひとりでにできあがる。",
  "home.how.sub":
    "近くのノードが Bluetooth 上で自己修復するメッシュをつくります。インターネットがあれば Nostr リレーがそれを広げます。誰かが握る基盤はありません。",
  "home.how.cta": "アーキテクチャ全文を読む",
  "home.how.discover.title": "発見",
  "home.how.discover.line":
    "Airhop や bitchat が動いている端末どうしは、Bluetooth で自動的に見つけ合います。ペアリングも設定も不要です。",
  "home.how.relay.title": "中継",
  "home.how.relay.line":
    "メッセージは端末から端末へ、最大 7 ホップまで跳ねていきます。あいだの端末が中身を見ることはありません。",
  "home.how.reach.title": "さらに遠くへ",
  "home.how.reach.line":
    "インターネットがあれば、Nostr リレーが同じ会話をさらに遠くまで運びます。必要なら Tor 経由で。",
  "home.how.swipe": "スワイプして見る",
  "home.how.diagram": "BLE メッシュ · ローカルのピアツーピアネットワーク",
  "home.how.legend.node": "BLE メッシュのノード (オフライン)",
  "home.how.legend.relay": "マルチホップ中継 (Noise XX で暗号化)",
  "home.how.legend.bitchat": "同じメッシュ上で bitchat と互換",
  "home.how.legend.nostr": "Nostr ブリッジ (オンライン時にインターネット経由)",

  "home.map.aria": "Nostr リレーの所在地を示す世界地図",
  "home.map.summary": "Nostr ブリッジ · 世界の {locations} に {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}、{relays}",

  "home.features.eyebrow": "できること",
  "home.features.title": "デモではなく、本物のメッセンジャー。",
  "home.features.sub":
    "チャット、識別情報、ネットワーク、そしてお金。電波なし、アカウントなし、あいだに何も挟まずに動くよう作られています。",

  "home.features.messaging.title": "メッセージ",
  "home.features.messaging.summary": "メッセンジャーにあるものすべてを、背後の基盤ゼロで。",
  "home.features.messaging.dms.name": "プライベートなダイレクトメッセージ",
  "home.features.messaging.dms.line": "エンドツーエンド暗号化。送信済みと既読の通知つき。",
  "home.features.messaging.location.name": "位置チャンネル",
  "home.features.messaging.location.line": "場所に結びついたルーム。ひと区画から地域まで。",
  "home.features.messaging.groups.name": "プライベートなチャンネルとグループ",
  "home.features.messaging.groups.line": "ルームへの招待リンク、または最大 16 人の署名済みリスト。",
  "home.features.messaging.board.name": "掲示板",
  "home.features.messaging.board.line": "最大 7 日間、その地域に貼り出される告知。",
  "home.features.messaging.voice.name": "ライブ音声",
  "home.features.messaging.voice.line":
    "マイクを押している間、圏内の相手と話せます。トランシーバーのように。",
  "home.features.messaging.notes.name": "ボイスメモ",
  "home.features.messaging.notes.line": "録音した音声。道順を打ち込むより速い。",
  "home.features.messaging.files.name": "写真・動画・ファイル",
  "home.features.messaging.files.line": "形式は自由、1 MB まで、電波は不要。",
  "home.features.messaging.forward.name": "蓄積して転送",
  "home.features.messaging.forward.line":
    "封をしたまま近くの端末が運び、相手に届くまで預かります。",

  "home.features.identity.title": "識別情報",
  "home.features.identity.summary": "登録するものも、押収されるものもありません。",
  "home.features.identity.keys.name": "鍵ペアによる識別",
  "home.features.identity.keys.line": "この端末で生成し、OS のキーチェーンに保管します。",
  "home.features.identity.names.name": "読める名前",
  "home.features.identity.names.line": "あなたの鍵から導かれるので、誰にも奪われません。",
  "home.features.identity.qr.name": "QR での連絡先",
  "home.features.identity.qr.line": "一度読み取れば名前だけでなく鍵も受け取れます。",
  "home.features.identity.panic.name": "緊急消去",
  "home.features.identity.panic.line": "すべての鍵とメッセージを 1 秒未満で破棄。",

  "home.features.networking.title": "ネットワーク",
  "home.features.networking.summary": "端末そのものがネットワークです。",
  "home.features.networking.mesh.name": "Bluetooth メッシュ",
  "home.features.networking.mesh.line":
    "インターネットもルーターも不要。みんながすでに持っている端末で。",
  "home.features.networking.bridge.name": "メッシュブリッジ",
  "home.features.networking.bridge.line": "公開チャットを、圏外にいる近くの集団とつなぎます。",
  "home.features.networking.wifi.name": "WiFi の高速経路",
  "home.features.networking.wifi.line": "Android どうし、iPhone どうしなら転送がより速く。",
  "home.features.networking.bitchat.name": "bitchat と互換",
  "home.features.networking.bitchat.line": "どちらのアプリも設定なしで同じメッシュに参加します。",

  "home.features.internet.title": "インターネット",
  "home.features.internet.summary": "あくまで拡張であって、前提ではありません。",
  "home.features.internet.nostr.name": "Nostr へのフォールバック",
  "home.features.internet.nostr.line":
    "電波の届く範囲を越えても、ダイレクトメッセージと位置チャンネルは流れ続けます。",
  "home.features.internet.relays.name": "ジオリレーの探索",
  "home.features.internet.relays.line":
    "300 を超える独立した公開リレー。どれも私たちのものではありません。",
  "home.features.internet.gateway.name": "インターネットゲートウェイ",
  "home.features.internet.gateway.line":
    "接続を貸して、近くのオフライン端末が位置チャンネルに届くようにします。",
  "home.features.internet.tor.name": "Tor 連携",
  "home.features.internet.tor.line":
    "どちらのプラットフォームでも経路を通すので、リレーがあなたの IP を見ることはありません。",

  "home.features.optional.title": "任意",
  "home.features.optional.summary": "既定ではオフ。使いたいときにオン。",
  "home.features.optional.cashu.name": "Cashu の ecash",
  "home.features.optional.cashu.line": "どちらの端末もオフラインのまま、隣の人に支払えます。",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Lightning ネットワーク経由で bitcoin をチャージ、または引き出し。",
  "home.features.optional.ai.name": "ローカル AI",
  "home.features.optional.ai.line": "端末上で回答。端末から出ていくものはありません。",
  "home.features.optional.social.name": "ソーシャル連携",
  "home.features.optional.social.line": "同じ識別情報で Bluesky と Mastodon へ。",

  "home.compare.eyebrow": "他との比較",
  "home.compare.title": "オフラインで、追加機材なしで、オープン。",
  "home.compare.sub":
    "ここにあるアプリはどれも何かに優れています。ただ、ネットワークが止まっても動き続けるのは一部だけです。",
  "home.compare.col.project": "プロジェクト",
  "home.compare.col.transport": "通信手段",
  "home.compare.col.encryption": "暗号化",
  "home.compare.col.offline": "オフライン動作",
  "home.compare.col.hardware_free": "追加機材なし",
  "home.compare.col.open_source": "オープンソース",
  "home.compare.mark.yes": "はい",
  "home.compare.mark.no": "いいえ",
  "home.compare.mark.partial": "一部。クライアントはオープンソース、サーバーは非公開",
  "home.compare.mark.partial_hint": "クライアントはオープンソース、サーバーは非公開",
  "home.compare.transport.servers": "中央集権サーバー",
  "home.compare.transport.onion": "オニオンルーティング (サービスノード)",
  "home.compare.transport.nostr": "Nostr リレー",
  "home.compare.transport.lora": "LoRa 無線",
  "home.compare.transport.sub_ghz": "独自のサブ GHz 無線",

  "home.explore.eyebrow": "開かれていて、正直に",
  "home.explore.title": "ここに書いたことはすべて確かめられます。",
  "home.explore.sub":
    "コードもプロトコルも計画も公開しています。限界も同じく。私たちの言葉を信じる前に、ご自分で確かめてください。",
  "home.explore.audit.chip": "監査は未実施",
  "home.explore.audit.headline": "Airhop はまだ外部のセキュリティ監査を受けていません。",
  "home.explore.audit.body":
    "{headline} すべてのコードは自分の目で確認し、公開前に {review} を通しています。使用している暗号ライブラリは Cure53 の監査済みですが、それはアプリ自体の正式な監査の代わりにはなりません。監査は {version} で予定しています。それまでは、機微な用途で頼らないでください。",
  "home.explore.audit.link.review": "セキュリティレビューエージェント",
  "home.explore.source.title": "ソースコード",
  "home.explore.source.desc":
    "すべて GitHub に MIT ライセンスで公開。Issue、プルリクエスト、ディスカッションも開いています。",
  "home.explore.protocol.title": "プロトコル仕様",
  "home.explore.protocol.desc":
    "正確なワイヤ形式、BLE の UUID、各種定数。bitchat と共有しています。",
  "home.explore.architecture.title": "アーキテクチャ",
  "home.explore.architecture.desc": "送信をタップしてから電波に乗るバイトまで、技術的な全体像。",
  "home.explore.roadmap.title": "ロードマップ",
  "home.explore.roadmap.desc":
    "v0.5.0 から v2.0.0 までのバージョン目標。予定している監査も含みます。",
  "home.explore.vision.title": "ビジョン",
  "home.explore.vision.desc": "Airhop が存在する理由と、圧力がかかっても変えない原則。",
  "home.explore.brand.title": "ブランドキット",
  "home.explore.brand.desc": "ピクセルの鳥、色と文字のトークン、報道向け素材と定型文。",

  "home.contribute.eyebrow": "このプロジェクトを支える",
  "home.contribute.title": "独立して、開かれたまま。",
  "home.contribute.sub":
    "投資家も広告も有料版もありません。どの機能もいずれにせよ無料のままで、この仕事は役に立つと感じた人たちが支えています。",
  "home.contribute.contribute.chip": "貢献する",
  "home.contribute.contribute.body":
    "リポジトリにスターを付け、Issue を立て、プルリクエストを送ってください。不具合の報告も、機能の提案も、コードの貢献も歓迎します。",
  "home.contribute.contribute.cta": "GitHub で見る",
  "home.contribute.sponsor.chip": "スポンサー",
  "home.contribute.sponsor.body":
    "Airhop が役に立っているなら、一度きりの寄付でも継続的な支援でも、開発を続ける大きな助けになります。",
  "home.contribute.sponsor.donate": "一度だけ寄付する",
  "home.contribute.sponsor.github": "GitHub でスポンサーになる",

  "page.architecture.eyebrow": "ドキュメント",
  "page.architecture.title": "アーキテクチャ",
  "page.architecture.toc": "このページの内容",

  "page.faq.eyebrow": "よくある質問",
  "page.faq.title": "よくある質問",
  "page.faq.meta": "Airhop についてよく寄せられる質問。",
  "page.faq.contact":
    "ここで答えが見つからない質問は {email} に送るか、{github} でディスカッションを開いてお尋ねください。",

  "page.blogs.eyebrow": "ブログ",
  "page.blogs.title": "近日公開",
  "page.blogs.body":
    "メッシュネットワーク、プライバシー、オフラインファーストのソフトウェアについての記事。",

  "page.brand.eyebrow": "ブランド",
  "page.brand.title": "ブランドキット",
  "page.brand.meta":
    "記事、ストアの掲載、講演、README で Airhop を扱うための素材とルール。参照用にも報道用にも自由にお使いいただけます。",

  "page.legal.eyebrow": "法的事項",
  "page.privacy.title": "プライバシーポリシー",
  "page.terms.title": "利用規約",

  "page.notfound.title": "ページが見つかりません",
  "page.notfound.body": "お探しのページは存在しないか、移動されました。",

  "page.english_only": "このページは英語でのみ提供されています。",

  "seo.breadcrumb.home": "ホーム",

  "seo.home.title": "Airhop — プライベートでオフラインファーストのメッセンジャー",
  "seo.home.description":
    "iOS と Android のためのプライベートなピアツーピア通信。インターネットもサーバーもアカウントも不要。どこでも Bluetooth メッシュでつながります。",

  "seo.architecture.title": "アーキテクチャ — Airhop",
  "seo.architecture.description":
    "Airhop の仕組みを上から下まで: 識別情報、通信手段の選択、Bluetooth メッシュ、暗号化、インターネット層、Tor、オフライン ecash、端末内 AI、そして bitchat 互換のワイヤ形式。",
  "seo.architecture.breadcrumb": "アーキテクチャ",
  "seo.architecture.headline": "Airhop のアーキテクチャ",
  "seo.architecture.summary":
    "Airhop の完全な技術解説: 識別情報、通信手段、Bluetooth メッシュ、暗号化、Nostr のインターネット層、Tor、Cashu ウォレット、端末内 AI アシスタント、ワイヤ形式。",

  "seo.faq.title": "よくある質問 — Airhop",
  "seo.faq.description":
    "Airhop の Bluetooth メッシュ通信、暗号化、オフライン決済、Nostr のインターネット層、bitchat との互換性についての回答。",
  "seo.faq.breadcrumb": "よくある質問",

  "seo.blogs.title": "ブログ — Airhop",
  "seo.blogs.description":
    "メッシュネットワーク、プライバシー、オフラインファーストのソフトウェアについての記事。",
  "seo.blogs.breadcrumb": "ブログ",

  "seo.brand.title": "ブランドキット — Airhop",
  "seo.brand.description":
    "Airhop のブランドキット: ピクセルの鳥のマーク、ワードマーク、色と文字のトークン、報道向け素材と定型文。",
  "seo.brand.breadcrumb": "ブランドキット",

  "seo.privacy.title": "プライバシーポリシー — Airhop",
  "seo.privacy.description":
    "Airhop のデータの扱い方: アカウントなし、サーバーなし、追跡なし。識別情報もメッセージも端末内にとどまります。",
  "seo.privacy.breadcrumb": "プライバシーポリシー",

  "seo.terms.title": "利用規約 — Airhop",
  "seo.terms.description": "Airhop アプリとウェブサイトの利用に関する規約。",
  "seo.terms.breadcrumb": "利用規約",

  "seo.notfound.title": "ページが見つかりません — Airhop",
  "seo.notfound.description": "お探しのページは存在しないか、移動されました。",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "{count} 台のリレー",
  },
  "home.map.locations": {
    other: "{count} か所",
  },
};

export const locale: Locale = { strings, plurals };
