import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "홈으로 돌아가기",
  "common.last_updated": "마지막 업데이트: {date}",

  "nav.aria": "주요 탐색",
  "nav.home": "Airhop 홈",
  "nav.skip": "본문으로 건너뛰기",
  "nav.menu.open": "메뉴 열기",
  "nav.menu.close": "메뉴 닫기",
  "nav.how_it_works": "작동 방식",
  "nav.architecture": "아키텍처",
  "nav.faq": "자주 묻는 질문",

  "footer.aria": "바닥글",
  "footer.tagline": "사적인 메시 통신",
  "footer.credit": "© {author}가 {heart}을 담아 만듦",
  "footer.group.download": "다운로드",
  "footer.group.resources": "자료",
  "footer.group.social": "소셜",
  "footer.group.legal": "법적 고지",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "아키텍처",
  "footer.link.blogs": "블로그",
  "footer.link.faq": "자주 묻는 질문",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "이용약관",
  "footer.link.privacy": "개인정보 처리방침",
  "footer.link.license": "프로젝트 라이선스",

  "settings.theme.group": "색상 테마",
  "settings.theme.light": "밝은 테마",
  "settings.theme.dark": "어두운 테마",
  "settings.language.label": "언어",
  "settings.language.suggestion": "이 페이지를 한국어로 보기",
  "settings.language.dismiss": "닫기",

  "home.hero.release": "최신 릴리스",
  "home.hero.title": "인터넷 없이도 되는 메시징.",
  "home.hero.body":
    "가까운 휴대폰들이 Bluetooth 메시를 이루어, 종단 간 암호화된 상태로 최대 일곱 홉까지 메시지를 전달합니다. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "서버 없음",
  "home.hero.body.no_accounts": "계정 없음",
  "home.hero.body.no_tracking": "추적 없음",
  "home.hero.download": "앱 다운로드",
  "home.hero.badges": "MIT 라이선스 · 무료 오픈소스 · bitchat과 호환",
  "home.hero.group.mobile": "모바일",
  "home.hero.group.desktop": "데스크톱",
  "home.hero.option.zapstore": "Nostr에서 서명됨",
  "home.hero.option.apk": "직접 다운로드",
  "home.hero.option.soon": "곧 제공",

  "home.about.eyebrow": "Airhop이란",
  "home.about.title": "대부분의 앱은 중앙 서버에 의존합니다.",
  "home.about.sub":
    "서버는 감시하거나 끄거나 차단할 수 있습니다. Airhop에는 서버가 없으므로 압박할 회사도, 닫을 서비스도 없습니다.",
  "home.about.card": "기술 개요",
  "home.about.link.mesh": "Bluetooth Low Energy 메시",
  "home.about.link.wire_protocol": "전송 프로토콜",
  "home.about.body.built":
    "Airhop은 {mesh}를 통해 기기 간에 사적으로 메시지를 주고받기 위한 iOS·Android용 오픈소스 앱입니다. {bitchat}의 기반 위에 세워졌고, 그 {wire_protocol}과 보안 모델을 다시 사용한 뒤 오프라인 {ecash} 결제와 오프라인 AI로 확장했습니다. 인터넷 연결이 전혀 없어도 작동하며, 메시지는 주변 기기를 거쳐 자동으로 전달됩니다 (실내에서는 홉당 대략 10~30미터, 야외에서는 더 멀리). 최대 7홉입니다.",
  "home.about.body.identity":
    "당신의 신원은 기기에서 생성되어 {ios_keychain} 또는 {android_keystore}에 저장되는 {ed25519} 키 쌍입니다. 계정도 가입도 없고 서버에 닿는 것도 없습니다. 즉 삭제하면 당신으로 이어지는 흔적이 남지 않는 일회용 앱처럼 쓸 수 있습니다.",
  "home.about.body.crypto":
    "모든 세션은 인증된 핸드셰이크에 {noise} 프로토콜을 사용합니다. 저장된 메시지는 {ratchet} 알고리즘을 사용하므로, 나중에 기기가 침해되더라도 지난 메시지는 읽을 수 없는 상태로 남습니다. 긴급 삭제는 모든 키와 메시지를 1초 안에 파기합니다.",
  "home.about.body.internet":
    "당신과 상대가 Bluetooth 범위를 벗어나면 {nostr} 릴레이가 인터넷을 통한 다리 역할을 하며, {nip17} 형식으로 감싼 다이렉트 메시지를 사용합니다. 그래서 둘 다 온라인이면 메시는 전 세계로 넓어집니다. {tor} 지원은 iOS와 Android 모두에서 {arti}로 제공되며, Tor를 차단하는 네트워크를 위한 {obfs4}와 {snowflake} 브리지도 있습니다.",
  "home.about.optional.title": "Airhop에는 직접 켤 수 있는 선택 기능이 있습니다:",
  "home.about.optional.payments.label": "오프라인 결제:",
  "home.about.optional.payments.body":
    "{cashu} 프로토콜을 사용해 메시 위에서 결제를 주고받습니다 (Bitcoin만 지원).",
  "home.about.optional.ai.label": "오프라인 AI:",
  "home.about.optional.ai.body":
    "중요한 질문에 답할 수 있는, 기기에서 도는 작은 AI 도우미. 모든 처리와 데이터가 기기 안에 머뭅니다.",
  "home.about.body.compatible":
    "Airhop은 프로토콜 수준에서 bitchat과 호환됩니다. 같은 메시에 있는 Airhop 기기와 bitchat 기기는 자동으로 서로를 찾고, 아무 설정 없이 메시지와 다이렉트 메시지를 주고받을 수 있습니다.",

  "home.situations.eyebrow": "필요해지는 순간",
  "home.situations.title": "네트워크가 멈추는 날을 위해.",
  "home.situations.sub": "자연재해, 인터넷 차단, 대규모 시위, 또는 통신이 닿지 않는 평범한 주말.",
  "home.situations.disaster.label": "재해",
  "home.situations.disaster.line":
    "기지국이 죽었습니다. 게시판의 공지가 지나가는 모든 사람에게 닿습니다.",
  "home.situations.offgrid.label": "통신망 밖",
  "home.situations.offgrid.line": "산길에 들어선 지 이틀째. 마지막 신호 막대는 어제 사라졌습니다.",
  "home.situations.protest.label": "시위",
  "home.situations.protest.line": "전단의 QR 코드가 행진을 위한 암호화된 채널을 엽니다.",
  "home.situations.festival.label": "페스티벌",
  "home.situations.festival.line":
    "행사장에 신호가 없습니다. 메시지가 낯선 사람들의 휴대폰을 건너 이동합니다.",

  "home.showcase.eyebrow": "앱 살펴보기",
  "home.showcase.title": "평범한 메신저, 인터넷 없이.",
  "home.showcase.sub": "대화, 채널, 지갑, 그리고 신원. 겉은 익숙하고, 아래에서는 메시가 일합니다.",
  "home.showcase.mesh.title": "메시",
  "home.showcase.mesh.caption":
    "범위 안의 모든 사람이 가까운 순서대로 놓입니다. 먼저 추가할 사람은 없습니다.",
  "home.showcase.mesh.alt":
    "Airhop 앱의 메시 화면. 가까운 기기 네 대가 신호 세기에 따라 레이더 위에 배치되어 있습니다.",
  "home.showcase.chats.title": "대화",
  "home.showcase.chats.caption":
    "평범한 대화. 메시지를 건네주는 휴대폰들은 그 내용을 열 수 없습니다.",
  "home.showcase.chats.alt":
    "정전 중 Airhop에서 이루어진 다이렉트 메시지 대화. 휴대폰 세 대를 거쳐 전달되었습니다.",
  "home.showcase.channels.title": "채널",
  "home.showcase.channels.caption":
    "한 블록만큼 작거나 한 지역만큼 넓은 공개 방. 그곳에 있는 누구에게나 열려 있습니다.",
  "home.showcase.channels.alt":
    "Airhop 앱의 대화 화면. 블록, 동네, 도시, 지역 단위로 구분된 공개 채널이 나열되어 있습니다.",
  "home.showcase.wallet.title": "지갑",
  "home.showcase.wallet.caption":
    "두 휴대폰 모두 오프라인인 채로, Bluetooth로 옆 사람에게 ecash를 건넵니다.",
  "home.showcase.wallet.alt":
    "Airhop 앱의 지갑 화면. Bluetooth로 보낼 수 있는 ecash 잔액이 표시되어 있습니다.",
  "home.showcase.identity.title": "신원",
  "home.showcase.identity.caption":
    "가입도, 전화번호도, 이메일도 없습니다. 이 휴대폰을 떠나지 않는 키 하나뿐입니다.",
  "home.showcase.identity.alt":
    "Airhop 앱의 프로필 화면. 계정 없이 기기에서 생성된 신원이 표시되어 있습니다.",

  "home.how.eyebrow": "작동 방식",
  "home.how.title": "메시는 스스로 만들어집니다.",
  "home.how.sub":
    "가까운 노드들이 Bluetooth 위에서 스스로 복구하는 메시를 이룹니다. 인터넷이 있으면 Nostr 릴레이가 이를 넓히며, 누구도 통제하는 기반 시설은 없습니다.",
  "home.how.cta": "전체 아키텍처 읽기",
  "home.how.discover.title": "발견",
  "home.how.discover.line":
    "Airhop이나 bitchat을 실행하는 휴대폰들은 Bluetooth로 자동으로 서로를 찾습니다. 페어링도 설정도 없습니다.",
  "home.how.relay.title": "전달",
  "home.how.relay.line":
    "메시지는 휴대폰에서 휴대폰으로 최대 일곱 홉까지 건너갑니다. 사이에 있는 휴대폰들은 무엇을 나르는지 결코 보지 못합니다.",
  "home.how.reach.title": "더 멀리",
  "home.how.reach.line":
    "인터넷이 있으면 Nostr 릴레이가 같은 대화를 더 멀리 나릅니다. 원한다면 Tor를 거쳐서.",
  "home.how.swipe": "밀어서 살펴보기",
  "home.how.diagram": "BLE 메시 · 로컬 기기 간 네트워크",
  "home.how.legend.node": "BLE 메시 노드 (오프라인)",
  "home.how.legend.relay": "다중 홉 전달 (Noise XX 암호화)",
  "home.how.legend.bitchat": "같은 메시에서 bitchat과 호환",
  "home.how.legend.nostr": "Nostr 브리지 (온라인일 때 인터넷 경유)",

  "home.map.aria": "Nostr 릴레이 위치를 보여주는 세계 지도",
  "home.map.summary": "Nostr 브리지 · 전 세계 {locations}에 {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "무엇을 하나",
  "home.features.title": "데모가 아니라 진짜 메신저.",
  "home.features.sub":
    "대화, 신원, 네트워크, 그리고 돈. 모두 신호 없이, 계정 없이, 중간에 아무것도 없이 작동하도록 만들었습니다.",

  "home.features.messaging.title": "메시징",
  "home.features.messaging.summary": "메신저가 갖춘 모든 것을, 뒤에 아무 기반 시설도 없이.",
  "home.features.messaging.dms.name": "사적인 다이렉트 메시지",
  "home.features.messaging.dms.line": "종단 간 암호화, 전송 및 읽음 표시 포함.",
  "home.features.messaging.location.name": "위치 채널",
  "home.features.messaging.location.line": "장소에 묶인 방. 한 블록에서 한 지역까지.",
  "home.features.messaging.groups.name": "비공개 채널과 그룹",
  "home.features.messaging.groups.line": "방 초대 링크, 또는 최대 16명의 서명된 명단.",
  "home.features.messaging.board.name": "게시판",
  "home.features.messaging.board.line": "한 지역에 최대 7일 동안 붙어 있는 공지.",
  "home.features.messaging.voice.name": "실시간 음성",
  "home.features.messaging.voice.line":
    "마이크를 누른 채 범위 안의 누구와도 이야기합니다. 무전기처럼.",
  "home.features.messaging.notes.name": "음성 메모",
  "home.features.messaging.notes.line": "녹음된 음성. 길 안내를 입력하는 것보다 빠릅니다.",
  "home.features.messaging.files.name": "사진, 영상, 파일",
  "home.features.messaging.files.line": "형식은 자유롭게, 최대 1 MiB, 신호 없이도.",
  "home.features.messaging.forward.name": "저장 후 전달",
  "home.features.messaging.forward.line":
    "봉인된 채 가까운 휴대폰이 상대에게 닿을 때까지 지니고 갑니다.",

  "home.features.identity.title": "신원",
  "home.features.identity.summary": "등록할 것도, 압수당할 것도 없습니다.",
  "home.features.identity.keys.name": "키 쌍 신원",
  "home.features.identity.keys.line": "이 휴대폰에서 만들어 OS 키체인에 보관합니다.",
  "home.features.identity.names.name": "읽을 수 있는 이름",
  "home.features.identity.names.line":
    "당신의 키에서 파생되므로 누구도 당신의 이름을 가져갈 수 없습니다.",
  "home.features.identity.qr.name": "QR 연락처",
  "home.features.identity.qr.line": "한 번 스캔하면 이름뿐 아니라 키까지 전해집니다.",
  "home.features.identity.panic.name": "긴급 삭제",
  "home.features.identity.panic.line": "모든 키와 메시지를 1초 안에 파기합니다.",

  "home.features.networking.title": "네트워킹",
  "home.features.networking.summary": "휴대폰 자체가 네트워크입니다.",
  "home.features.networking.mesh.name": "Bluetooth 메시",
  "home.features.networking.mesh.line": "인터넷도 공유기도 없이, 이미 가지고 있는 휴대폰에서.",
  "home.features.networking.bridge.name": "메시 브리지",
  "home.features.networking.bridge.line": "공개 대화를 범위 밖에 있는 가까운 무리와 잇습니다.",
  "home.features.networking.wifi.name": "WiFi 고속 경로",
  "home.features.networking.wifi.line": "Android끼리 또는 iPhone끼리는 더 빠르게 주고받습니다.",
  "home.features.networking.bitchat.name": "bitchat 호환",
  "home.features.networking.bitchat.line": "두 앱 모두 설정 없이 같은 메시에 참여합니다.",

  "home.features.internet.title": "인터넷",
  "home.features.internet.summary": "확장일 뿐, 결코 조건이 아닙니다.",
  "home.features.internet.nostr.name": "Nostr 대체 경로",
  "home.features.internet.nostr.line":
    "전파가 닿는 범위를 넘어서도 다이렉트 메시지와 위치 채널은 계속 흐릅니다.",
  "home.features.internet.relays.name": "지리 릴레이 탐색",
  "home.features.internet.relays.line":
    "300개가 넘는 독립 공개 릴레이. 그중 우리 것은 하나도 없습니다.",
  "home.features.internet.gateway.name": "인터넷 게이트웨이",
  "home.features.internet.gateway.line":
    "연결을 빌려주어 가까이 있는 오프라인 휴대폰이 위치 채널에 닿게 합니다.",
  "home.features.internet.tor.name": "Tor 연동",
  "home.features.internet.tor.line":
    "두 플랫폼 모두에서 경로를 통하므로 릴레이는 당신의 IP를 보지 못합니다.",

  "home.features.optional.title": "선택 기능",
  "home.features.optional.summary": "기본은 꺼짐. 원할 때 켜기.",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line": "어느 휴대폰도 온라인이 아닌 채로 옆 사람에게 지불합니다.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Lightning 네트워크로 bitcoin을 충전하거나 인출합니다.",
  "home.features.optional.ai.name": "로컬 AI",
  "home.features.optional.ai.line": "기기에서 답합니다. 휴대폰을 벗어나는 것은 없습니다.",
  "home.features.optional.social.name": "소셜 브리지",
  "home.features.optional.social.line": "같은 신원으로 Bluesky와 Mastodon에.",

  "home.compare.eyebrow": "비교하면",
  "home.compare.title": "오프라인에서, 추가 장비 없이, 열린 채로.",
  "home.compare.sub":
    "여기 있는 앱은 모두 무언가를 잘합니다. 다만 네트워크가 멈춰도 계속 되는 것은 일부뿐입니다.",
  "home.compare.col.project": "프로젝트",
  "home.compare.col.transport": "전송 방식",
  "home.compare.col.encryption": "암호화",
  "home.compare.col.offline": "오프라인 작동",
  "home.compare.col.hardware_free": "추가 장비 불필요",
  "home.compare.col.open_source": "오픈소스",
  "home.compare.mark.yes": "예",
  "home.compare.mark.no": "아니오",
  "home.compare.mark.partial": "일부. 클라이언트는 오픈소스이고 서버는 아닙니다",
  "home.compare.mark.partial_hint": "클라이언트는 오픈소스이고 서버는 아닙니다",
  "home.compare.transport.servers": "중앙 서버",
  "home.compare.transport.onion": "어니언 라우팅 (서비스 노드)",
  "home.compare.transport.nostr": "Nostr 릴레이",
  "home.compare.transport.lora": "LoRa 무선",
  "home.compare.transport.sub_ghz": "독자 규격 서브 GHz 무선",

  "home.explore.eyebrow": "열려 있고 솔직하게",
  "home.explore.title": "여기 적은 모든 주장은 확인할 수 있습니다.",
  "home.explore.sub":
    "코드도 프로토콜도 계획도 공개되어 있습니다. 한계도 마찬가지입니다. 우리 말을 믿기 전에 직접 확인하세요.",
  "home.explore.audit.chip": "감사 예정",
  "home.explore.audit.headline": "Airhop은 아직 외부 보안 감사를 받지 않았습니다.",
  "home.explore.audit.body":
    "{headline} 모든 코드는 직접 검토하고 배포 전에 {review}를 거치며, 사용하는 암호 라이브러리는 Cure53의 감사를 받았습니다. 하지만 그것이 앱 자체에 대한 공식 감사를 대신하지는 않습니다. 감사는 {version}에 예정되어 있습니다. 그때까지는 민감한 용도로 의존하지 마세요.",
  "home.explore.audit.link.review": "보안 검토 에이전트",
  "home.explore.source.title": "소스 코드",
  "home.explore.source.desc":
    "모두 GitHub에 MIT 라이선스로. 이슈, 풀 리퀘스트, 토론이 열려 있습니다.",
  "home.explore.protocol.title": "프로토콜 명세",
  "home.explore.protocol.desc": "정확한 전송 형식, BLE UUID, 상수. bitchat과 공유합니다.",
  "home.explore.architecture.title": "아키텍처",
  "home.explore.architecture.desc":
    "보내기를 누른 순간부터 전파에 실리는 바이트까지, 전체 기술 해설.",
  "home.explore.roadmap.title": "로드맵",
  "home.explore.roadmap.desc": "v0.5.0부터 v2.0.0까지의 버전 목표. 예정된 감사도 포함합니다.",
  "home.explore.vision.title": "비전",
  "home.explore.vision.desc": "Airhop이 존재하는 이유와, 압박 속에서도 바뀌지 않는 원칙.",
  "home.explore.brand.title": "브랜드 키트",
  "home.explore.brand.desc": "픽셀 새, 색상과 서체 토큰, 보도 자료와 정형 문구.",

  "home.contribute.eyebrow": "이 프로젝트를 후원하기",
  "home.contribute.title": "독립적으로, 공개된 채로.",
  "home.contribute.sub":
    "투자자도 광고도 유료 등급도 없습니다. 모든 기능은 어떤 경우에도 무료로 남고, 이 일은 쓸모를 느낀 사람들이 지탱합니다.",
  "home.contribute.contribute.chip": "기여하기",
  "home.contribute.contribute.body":
    "저장소에 별을 주고, 이슈를 열고, 풀 리퀘스트를 보내주세요. 버그 신고, 기능 제안, 코드 기여 모두 환영합니다.",
  "home.contribute.contribute.cta": "GitHub에서 보기",
  "home.contribute.sponsor.chip": "후원",
  "home.contribute.sponsor.body":
    "Airhop이 도움이 되었다면, 한 번의 기부나 정기 후원이 개발을 이어가는 데 큰 힘이 됩니다.",
  "home.contribute.sponsor.donate": "한 번 기부하기",
  "home.contribute.sponsor.github": "GitHub에서 후원하기",

  "page.architecture.eyebrow": "문서",
  "page.architecture.title": "아키텍처",
  "page.architecture.toc": "이 페이지의 목차",

  "page.faq.eyebrow": "자주 묻는 질문",
  "page.faq.title": "자주 묻는 질문",
  "page.faq.meta": "Airhop에 대해 자주 묻는 질문.",
  "page.faq.contact":
    "여기서 답을 찾지 못한 질문은 {email}로 보내거나 {github}에서 토론을 열어 물어보세요.",

  "page.blogs.eyebrow": "블로그",
  "page.blogs.title": "곧 제공",
  "page.blogs.body": "메시 네트워크, 프라이버시, 오프라인 우선 소프트웨어에 대한 글.",

  "page.brand.eyebrow": "브랜드",
  "page.brand.title": "브랜드 키트",
  "page.brand.meta":
    "기사, 스토어 페이지, 발표, README에 Airhop을 실을 때 쓰는 자료와 규칙. 인용과 보도 목적으로 자유롭게 사용할 수 있습니다.",

  "page.legal.eyebrow": "법적 고지",
  "page.privacy.title": "개인정보 처리방침",
  "page.terms.title": "이용약관",

  "page.notfound.title": "페이지를 찾을 수 없습니다",
  "page.notfound.body": "찾으시는 페이지가 없거나 옮겨졌습니다.",

  "page.english_only": "이 페이지는 영어로만 제공됩니다.",

  "seo.breadcrumb.home": "홈",

  "seo.home.title": "Airhop — 사적이고 오프라인 우선인 메신저",
  "seo.home.description":
    "iOS와 Android를 위한 사적인 기기 간 메시징. 인터넷도 서버도 계정도 없습니다. 어디서나 Bluetooth 메시로 소통하세요.",

  "seo.architecture.title": "아키텍처 — Airhop",
  "seo.architecture.description":
    "Airhop의 작동 방식을 위에서 아래까지: 신원, 전송 방식 선택, Bluetooth 메시, 암호화, 인터넷 계층, Tor, 오프라인 ecash, 기기 내 AI, 그리고 bitchat 호환 전송 형식.",
  "seo.architecture.breadcrumb": "아키텍처",
  "seo.architecture.headline": "Airhop 아키텍처",
  "seo.architecture.summary":
    "Airhop의 완전한 기술 해설: 신원, 전송 방식, Bluetooth 메시, 암호화, Nostr 인터넷 계층, Tor, Cashu 지갑, 기기 내 AI 도우미, 전송 형식.",

  "seo.faq.title": "자주 묻는 질문 — Airhop",
  "seo.faq.description":
    "Airhop의 Bluetooth 메시 메시징, 암호화, 오프라인 결제, Nostr 인터넷 계층, bitchat 호환성에 대한 답변.",
  "seo.faq.breadcrumb": "자주 묻는 질문",

  "seo.blogs.title": "블로그 — Airhop",
  "seo.blogs.description": "메시 네트워크, 프라이버시, 오프라인 우선 소프트웨어에 대한 글.",
  "seo.blogs.breadcrumb": "블로그",

  "seo.brand.title": "브랜드 키트 — Airhop",
  "seo.brand.description":
    "Airhop 브랜드 키트: 픽셀 새 마크, 워드마크, 색상과 서체 토큰, 보도 자료와 정형 문구.",
  "seo.brand.breadcrumb": "브랜드 키트",

  "seo.privacy.title": "개인정보 처리방침 — Airhop",
  "seo.privacy.description":
    "Airhop이 데이터를 다루는 방식: 계정 없음, 서버 없음, 추적 없음. 신원과 메시지는 기기 안에 머뭅니다.",
  "seo.privacy.breadcrumb": "개인정보 처리방침",

  "seo.terms.title": "이용약관 — Airhop",
  "seo.terms.description": "Airhop 앱과 웹사이트 이용에 적용되는 약관.",
  "seo.terms.breadcrumb": "이용약관",

  "seo.notfound.title": "페이지를 찾을 수 없습니다 — Airhop",
  "seo.notfound.description": "찾으시는 페이지가 없거나 옮겨졌습니다.",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "릴레이 {count}개",
  },
  "home.map.locations": {
    other: "{count}곳",
  },
};

export const locale: Locale = { strings, plurals };
