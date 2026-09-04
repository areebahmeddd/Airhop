// ko: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "취소",
  "common.done": "완료",
  "common.ok": "확인",
  "common.close": "닫기",
  "common.back": "뒤로",
  "common.delete": "삭제",
  "common.remove": "제거",
  "common.add": "추가",
  "common.copy": "복사",
  "common.copied": "복사됨",
  "common.share": "공유",
  "common.continue": "계속",
  "common.try_again": "다시 시도",
  "common.settings": "설정",
  "common.on": "켜짐",
  "common.off": "끔",

  // ---- Dates ----
  "format.today": "오늘",
  "format.yesterday": "어제",
  "format.minutes_ago": "{count}분 전",
  "format.hours_ago": "{count}시간 전",
  "format.days_ago": "{count}일 전",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "채팅",
  "nav.tab.mesh": "메시",
  "nav.tab.wallet": "지갑",
  "nav.tab.profile": "나",
  "a11y.tab.new_peers": "{label}, 근처에 새로운 사람",
  "nav.notifications": "알림",
  "chat.subtab.channels": "채널",
  "chat.subtab.direct": "다이렉트",
  "chat.subtab.dms": "다이렉트 메시지",
  "chat.search.placeholder": "채팅 검색…",
  "chat.search.a11y": "채팅과 메시지 검색",
  "chat.search.close": "검색 닫기",
  "chat.search.clear": "검색 지우기",
  "mesh.view.radar": "레이더 보기",
  "mesh.view.list": "목록 보기",
  "mesh.view.radar_short": "레이더",
  "mesh.view.list_short": "목록",

  // ---- Legal document names ----
  "legal.last_updated": "최종 업데이트: {date}",
  "legal.terms": "서비스 약관",
  "legal.privacy": "개인정보 처리방침",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "비공개 메시 통신",
  "onboarding.welcome.cta": "시작하기",
  "onboarding.welcome.cta_hint": "계속하려면 아래 약관에 동의하세요",
  "onboarding.welcome.consent_a11y": "서비스 약관 및 개인정보 처리방침에 동의",
  "onboarding.welcome.open_terms": "서비스 약관 열기",
  "onboarding.welcome.open_privacy": "개인정보 처리방침 열기",
  "onboarding.welcome.consent":
    "{cta}을(를) 누르면 {terms} 및 {privacy}에 동의하는 것입니다.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "신원을 생성하는 중",
  "onboarding.identity.body":
    "이 기기에서 Ed25519 키 쌍을 생성하고 있습니다.\n어디로도 전송되지 않습니다.",
  "onboarding.identity.failed_heading": "키를 생성하지 못했습니다",
  "onboarding.identity.failed_body":
    "이 기기가 Airhop이 키를 안전하게 저장하도록 허용하지 않았습니다. 다시 시도하거나, 휴대폰을 재시작한 뒤 Airhop을 다시 여세요.",
  "onboarding.identity.steps_a11y": "단계: {steps}",
  "onboarding.identity.step.x25519": "X25519 고정 키 쌍 생성 중",
  "onboarding.identity.step.ed25519": "Ed25519 서명 키 쌍 생성 중",
  "onboarding.identity.step.keychain": "OS 키체인에 키 저장 중",
  "onboarding.identity.step.peer_id": "피어 ID 도출 중",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "메시에서의 내 이름",
  "onboarding.username.peer_id": "피어 ID",
  "onboarding.username.card_a11y":
    "메시에서의 내 이름은 {username}입니다. 피어 ID {peerID}. {props}.",
  "onboarding.username.explanation":
    "이 사용자 이름은 공개 키에서 결정론적으로 도출됩니다. 내 피어 ID를 보는 모든 기기에서 동일하게 표시됩니다.",
  "onboarding.username.cta": "Airhop 시작",
  "onboarding.username.prop.algorithm": "알고리즘",
  "onboarding.username.prop.storage": "저장 위치",
  "onboarding.username.prop.storage_value": "OS 키체인에만",
  "onboarding.username.prop.account": "계정 필요",
  "onboarding.username.prop.account_value": "없음",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop에 오신 것을 환영합니다",
  "onboarding.hello.p1":
    "안녕하세요. Airhop은 bitchat 위에 만든 독립적인 오픈 소스 사이드 프로젝트입니다. bitchat 프로젝트나 permissionless tech와 제휴하거나 승인받은 관계가 아니며, 그저 제가 만들고 커뮤니티와 나누는 것을 즐기는 결과물입니다.",
  "onboarding.hello.p2":
    "이번이 첫 iOS 및 Android 릴리스입니다. 친구들과 테스트하긴 했지만 몇 가지 버그를 만나실 겁니다. 그런 일이 있거나 기능 아이디어가 있다면 꼭 들려주세요. {github}에 이슈를 열거나 {email}로 이메일을 보내주세요.",
  "onboarding.hello.p3":
    "Airhop이 도움이 되었다면 {github}에 별을 남기거나 {store}에 리뷰를 써주시면 좋겠습니다. 더 많은 사람이 이 프로젝트를 발견하는 데 도움이 됩니다. 사용해 주셔서 감사합니다.",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "휴대폰이 묻기 전에",
  "onboarding.primer.lede":
    "각 권한이 무엇을 하고, 무엇을 하지 않는지 알려드립니다.",
  "onboarding.primer.bluetooth.title": "블루투스",
  "onboarding.primer.bluetooth.body":
    "근처 기기를 찾고 그 사이에서 메시지를 중계합니다. 이렇게 메시가 만들어지며 인터넷 연결 없이 작동합니다.",
  "onboarding.primer.location.title": "위치",
  "onboarding.primer.location.body":
    "블록 단위부터 지역 단위까지 근처 지역 채널에 참여시켜 줍니다. Airhop은 절대 사용자를 추적하지 않으며 정확한 위치를 기기 밖으로 보내지 않습니다.",
  "onboarding.primer.notifications.title": "알림",
  "onboarding.primer.notifications.body":
    "앱이 닫혀 있을 때도 새 메시지 알림을 받습니다. 알림은 기기 안에서 만들어지며 서버는 관여하지 않습니다.",
  "onboarding.primer.footnote":
    "거절해도 됩니다. 메시지는 여전히 인터넷을 통해 오가며, 나중에 설정에서 마음을 바꿀 수 있습니다.",
  "onboarding.primer.cta_a11y": "권한 요청으로 계속",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "블루투스 접근",
  "permission.bluetooth.purpose": "메시에서 근처 기기를 찾기",
  "permission.open_settings": "설정 열기",
  "permission.not_now": "나중에",
  "permission.blocked_title": "{label}이(가) 꺼져 있습니다",
  "permission.blocked_body": "{purpose} 위해 설정에서 켜세요.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "문제가 발생했습니다",
  "error.boundary.body":
    "Airhop에 예기치 않은 문제가 생겨 표시 중이던 화면을 중단해야 했습니다.",

  // ---- Chats: channel list ----
  "chat.channels.default": "기본 채널",
  "chat.channels.yours": "내 채널",
  "chat.channels.none": "아직 채널이 없습니다",
  "chat.channels.none_hint": "위의 {plus}을(를) 눌러 참여하거나 만드세요.",
  "chat.channels.none_desc":
    "아직 채널이 없습니다. 헤더의 추가 버튼으로 참여하거나 만드세요.",
  "chat.channels.show_fewer": "기본 채널 적게 보기",
  "chat.channels.show_less": "적게 보기",
  "chat.channels.info": "채널 정보",
  "chat.channels.pin": "채널 고정",
  "chat.channels.unpin": "채널 고정 해제",
  "chat.channels.mute": "채널 음소거",
  "chat.channels.unmute": "채널 음소거 해제",
  "chat.channels.leave": "채널 나가기",
  "chat.channels.leave_confirm": "나가기",
  "chat.channels.clear_body":
    "{name}의 모든 메시지를 삭제할까요? 되돌릴 수 없습니다.",
  "chat.channels.leave_body":
    "{name}에서 나갈까요? 이 채널의 메시지를 더 이상 받지 않으며, 기록은 이 기기에서 제거됩니다.",
  "chat.channels.more_options": "{name}의 추가 옵션",
  "chat.channels.teleported_tag": "{level}  ·  텔레포트",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "채팅 지우기",
  "chat.dm.remove_contact": "연락처 제거",
  "chat.dm.block": "이 피어 차단",
  "chat.dm.block_confirm": "차단",
  "chat.dm.delete": "채팅 삭제",
  "chat.dm.delete_body":
    "목록에서 대화를 없애고 메시지를 삭제합니다. 연락처는 남으며, 상대가 새 메시지를 보내면 새 채팅이 시작됩니다.",
  "chat.dm.in_range": "범위 내",
  "chat.dm.row_hint": "두 번 탭한 뒤 길게 눌러 추가 옵션 보기",
  "chat.channels.row_hint": "두 번 탭한 뒤 길게 눌러 추가 옵션 보기",
  "chat.dm.you_prefix": "나:",
  "chat.dm.none": "다이렉트 메시지가 없습니다",
  "chat.dm.none_desc": "메시 탭에서 피어를 탭해 암호화된 DM을 시작하세요.",
  "chat.dm.contact_info": "연락처 정보",
  "chat.dm.pin": "채팅 고정",
  "chat.dm.unpin": "채팅 고정 해제",
  "chat.dm.mute": "채팅 음소거",
  "chat.dm.unmute": "채팅 음소거 해제",
  "chat.dm.clear_body":
    "{name}과(와) 주고받은 모든 메시지를 삭제할까요? 되돌릴 수 없습니다.",
  "chat.dm.remove_contact_body":
    "{name}을(를) 제거할까요? 대화가 삭제되고 연락처도 잊힙니다. 상대가 다시 메시지를 보내면 연결될 수 있습니다.",
  "chat.dm.block_body":
    "{name}을(를) 차단할까요? 메시 탭에서 보이지 않고 메시지도 받지 않으며, 근처에 있어도 마찬가지입니다.",
  "chat.dm.more_options": "{name}의 추가 옵션",
  "chat.dm.remove_contact_short": "연락처 제거",
  "chat.dm.block_short": "연락처 차단",
  "chat.dm.delete_short": "채팅 삭제",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "메시지 지우기",
  "chat.clear_confirm": "지우기",
  "chat.group_badge": "그룹",
  "chat.more": "더 보기",
  "chat.no_messages": "아직 메시지가 없습니다",
  "chat.you": "나",
  "chat.a11y.channel": "채널 {name}",
  "chat.a11y.group": "그룹 {name}",
  "chat.a11y.muted": "음소거됨",
  "chat.a11y.pinned": "고정됨",

  // ---- Chats: start something new ----
  "chat.new.title": "새로 시작하기",
  "chat.new.channel": "비공개 채널 만들기",
  "chat.new.channel_label": "비공개 채널",
  "chat.new.channel_desc":
    "링크가 있는 사람은 누구나 들어올 수 있는 방입니다. 직접 만들거나, 받은 링크로 참여하세요.",
  "chat.new.group": "비공개 그룹 만들기",
  "chat.new.group_label": "비공개 그룹",
  "chat.new.group_desc":
    "원하는 사람을 직접 고릅니다. 최대 16명. 블루투스에만 머무릅니다.",
  "chat.new.place": "지오해시로 장소 이동",
  "chat.new.place_label": "장소로 이동",
  "chat.new.place_desc": "지오해시로 어디든 위치 채널을 엽니다.",
  "chat.new.reach": "도달 범위",
  "chat.new.reach_internet": "블루투스와 인터넷 양쪽으로 멤버에게 닿습니다.",
  "chat.new.reach_mesh":
    "블루투스 범위 안에서 작동하며 인터넷으로는 닿지 않습니다.",
  "chat.new.reach_internet_desc":
    "인터넷으로도 멤버에게 닿습니다. 릴레이는 채널이 활성 상태인 것만 볼 수 있고, 메시지나 참여자는 결코 볼 수 없습니다.",
  "chat.new.reach_mesh_desc":
    "로컬 메시에만 머무릅니다. 가장 사적이며 블루투스 범위 밖으로 아무것도 나가지 않습니다.",
  "chat.new.join_link": "초대 링크로 비공개 채널 참여",
  "chat.new.back_to_chooser": "선택 화면으로 돌아가기",
  "chat.new.create_channel": "채널 만들기",
  "chat.new.name_required": "먼저 채널 이름을 입력하세요",
  "chat.new.name_taken": "이미 사용 중인 이름입니다",
  "chat.new.create": "만들기",
  "chat.new.e2ee": "종단 간 암호화. 멤버만 메시지를 읽을 수 있습니다.",
  "chat.new.invite_only":
    "초대 전용. 링크를 공유한 사람은 누구나 참여할 수 있습니다. 그 외에는 근처 피어에게도 보이지 않습니다.",
  "chat.new.name_exists": "이 이름의 채널이 이미 있습니다.",
  "chat.new.reach_bluetooth_chip": "블루투스 전용",
  "chat.new.reach_internet_chip": "블루투스 + 인터넷",
  "chat.new.have_link": "초대 링크로 참여",

  // ---- Chats: join by link ----
  "chat.join.title": "링크로 참여",
  "chat.join.not_airhop": "Airhop 링크가 아닙니다.",
  "chat.join.reach_internet": "블루투스와 인터넷 양쪽으로 멤버에게 닿습니다.",
  "chat.join.reach_mesh": "블루투스 범위 안에만 머무릅니다.",
  "chat.join.contact_card":
    "연락처 카드입니다. 연락처에 추가하고 채팅을 엽니다.",
  "chat.join.unverified": "그 링크를 확인하지 못했습니다",
  "chat.join.unverified_body":
    "연락처 카드가 자기 키와 일치하지 않아 추가하지 않았습니다. 상대에게 새로 보내달라고 하세요.",
  "chat.join.paste": "클립보드에서 붙여넣기",
  "chat.join.join": "참여",
  "chat.join.public_channel":
    "공개 채널 {name}. 근처에 있는 누구나 읽을 수 있습니다.",
  "chat.join.private_channel": "비공개 채널 {name}. {reach}",
  "chat.join.dm_with": "{name}과(와)의 다이렉트 메시지.",
  "chat.join.joined_as": "{name}(으)로 참여했습니다",
  "chat.join.name_clash_body":
    "이미 이름이 같은 다른 {name}에 참여해 있습니다. 채널 이름은 그저 이름표라서 이 초대는 별도의 채널을 열었고, 원래 있던 채널은 그대로입니다. 어느 쪽이든 채널 정보에서 이름을 바꿀 수 있습니다.",
  "chat.join.paste_hint":
    "airhop://로 시작하는 초대를 붙여넣으세요. 링크를 탭해도 되며, 이 방법은 탭할 수 없는 링크를 위한 것입니다.",
  "chat.join.key_note":
    "비공개 채널 초대는 키를 함께 담고 있어 참여가 즉시 이루어지며 다른 누구에게도 무언가를 요청하지 않습니다.",
  "chat.join.offline_note":
    "오프라인에서도 작동합니다. 링크는 이 기기에서 읽히며, 채널의 도달 범위는 만든 사람이 설정한 대로입니다.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "그 셀을 열지 못했습니다. 잠시 후 다시 시도하세요.",
  "chat.jump.title": "장소로 이동",
  "chat.jump.saved": "저장된 장소",
  "chat.jump.anywhere":
    "지금 있지 않은 곳이라도 어디든 공개 위치 채널을 엽니다.",
  "chat.jump.geohash_note":
    "지오해시를 입력하세요. 위치가 그 셀에 속하는 모든 사람이 채널을 함께 씁니다.",
  "chat.jump.teleport_note":
    "근처가 아니라 텔레포트한 것으로 표시됩니다. 인터넷으로만 닿습니다.",
  "chat.jump.level_cell": "{level} 셀",
  "chat.jump.already_here":
    "이미 여기 있습니다. 이동을 누르면 {name} 채널이 열립니다.",
  "chat.jump.open_direction": "{direction} 방향의 셀 열기",
  "chat.jump.open_place": "{name} 열기",
  "chat.jump.remove_place": "저장된 장소에서 {name} 제거",
  "chat.jump.go": "이동",
  "chat.jump.how":
    "지오해시를 찾으려면 위치 채널을 열고 > 이름을 탭한 뒤 > 거기서 복사하세요.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "모든 멤버에게 닿지는 못했습니다. 그들이 근처에 있을 때 다시 시도하세요.",
  "chat.group.you_were_added": "{name}에 추가되었습니다.",
  "chat.group.added_you": "{name}에 나를 추가했습니다",
  "chat.group.you_were_removed":
    "{name}에서 제외되었습니다. 여기서는 더 이상 읽거나 보낼 수 없습니다.",
  "chat.group.removed_you": "{name}에서 나를 제외했습니다",
  "chat.group.add_failed": "추가하지 못했습니다",
  "chat.group.add_failed_body":
    "바뀐 것은 없습니다. 지금 연결할 수 없거나, 그룹이 16명으로 가득 찼거나, 내가 만든 그룹이 아닐 수 있습니다.",
  "chat.group.remove_failed": "제외하지 못했습니다",
  "chat.group.remove_failed_body":
    "바뀐 것은 없습니다. 그룹 구성원을 바꿀 수 있는 사람은 그룹을 만든 사람뿐입니다.",
  "chat.group.e2ee": "종단 간 암호화. 멤버만 메시지를 읽을 수 있습니다.",
  "chat.group.cap":
    "내가 고른 최대 16명. 초대 링크가 없으므로 링크를 전달받아 들어오는 사람은 없습니다.",
  "chat.group.bluetooth":
    "블루투스 전용. 범위 밖의 멤버는 돌아오면 메시지를 받습니다.",
  "chat.group.members_label": "멤버",
  "chat.group.none_in_range":
    "범위 안에 아무도 없습니다. 그룹을 만들 때 멤버가 근처에 있어야 합니다.",
  "chat.group.create_title": "그룹 만들기",
  "chat.group.name_placeholder": "그룹 이름",
  "chat.group.create": "만들기",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "로컬 메시 · 블루투스 전용",
  "chat.scope.mesh_desc":
    "블루투스 범위(대략 10~100미터) 안의 기기에 닿습니다. 인터넷이 필요 없습니다. 현장 조율에 알맞습니다.",
  "chat.scope.block": "도시 블록 · 약 100m",
  "chat.scope.block_desc":
    "도시 블록 수준의 범위입니다. 메시지가 인터넷으로 연결되어 블루투스 범위 밖이지만 가까이 있는 피어도 참여할 수 있습니다.",
  "chat.scope.neighborhood": "동네 · 약 1km",
  "chat.scope.neighborhood_desc":
    "동네 수준의 범위입니다. 릴레이가 도와주어 직접 블루투스 연결이 없어도 지역 곳곳의 피어에게 닿습니다.",
  "chat.scope.city": "도시 · 약 10km",
  "chat.scope.city_desc":
    "도시 전역 채널입니다. 위치 기반 인터넷 릴레이로 도시권 전역의 피어에게 닿습니다.",
  "chat.scope.province": "도 또는 주 · 약 100km",
  "chat.scope.province_desc":
    "도나 주 수준의 범위입니다. 인터넷으로 연결되어 수백 킬로미터에 걸친 지역까지 닿습니다.",
  "chat.scope.country": "국가 또는 지역 · 약 1000km",
  "chat.scope.country_desc":
    "국가 전역 범위입니다. 해당 지역의 Airhop 또는 bitchat 사용자라면 누구나 참여해 메시지를 읽을 수 있습니다.",
  "chat.transport.bluetooth": "블루투스 전용",
  "chat.transport.both": "블루투스 + 인터넷",
  "chat.transport.internet": "인터넷 전용",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "명령 /{cmd}: {hint}",
  "chat.cmd.hug_hint": "따뜻한 포옹 보내기",
  "chat.cmd.slap_hint": "커다란 송어로 찰싹 때리기",
  "chat.status.sending": "보내는 중…",
  "chat.status.undo_send": "보내기 취소",
  "chat.status.undo": "취소",
  "chat.status.sent": "보냄",
  "chat.status.received": "받음",
  "chat.status.failed": "실패",
  "chat.status.canceled": "취소됨",
  "chat.status.waiting": "대기 중",
  "chat.status.sending_short": "보내는 중",
  "chat.status.receiving": "받는 중",
  "chat.thread.not_available": "여기서는 사용할 수 없음",
  "chat.thread.private_channel": "비공개 채널",
  "chat.thread.location_channel": "위치 채널",
  "chat.thread.public_channel": "공개 채널",
  "chat.thread.notices": "이 채널의 공지",
  "chat.thread.invite": "이 채널에 초대하기",
  "chat.thread.not_in_range": "블루투스 범위 밖입니다. 인터넷으로 전달합니다.",
  "chat.thread.not_nearby":
    "근처에 없습니다. 다시 범위에 들어오거나 온라인이 되면 전달합니다.",
  "chat.thread.no_keys":
    "메시지를 보내려면 블루투스 범위 안에 있거나 상대의 코드를 스캔해야 합니다.",
  "chat.geo.card_received":
    "{name}이(가) 연락처를 공유했습니다. 서로 자리를 옮긴 뒤에도 대화를 이어가려면 내 연락처도 공유하세요.",
  "chat.geo.exchange_complete":
    "연락처를 교환했습니다. 이제 어디서든 서로 연결할 수 있습니다.",
  "chat.geo.keep_person": "이 사람 유지하기",
  "chat.geo.keep_person_desc":
    "서로 자리를 옮긴 뒤에도 대화를 이어가도록 연락처를 공유합니다. 상대가 내 영구 신원을 알게 됩니다.",
  "chat.geo.card_sent": "공유함 · 상대의 것을 기다리는 중",
  "chat.thread.left_cell":
    "이 지역을 벗어나 상대가 여기서 나에게 닿을 수 없습니다. 어디서든 대화를 이어가려면 코드를 교환하세요.",
  "chat.thread.no_route":
    "지금은 상대에게 닿을 수 없습니다. 경로가 생기면 메시지가 전송됩니다.",
  "chat.thread.empty": "아직 메시지가 없습니다",
  "chat.thread.empty_desc": "암호화된 대화를 시작하세요.",
  "chat.thread.jump_latest": "최신 메시지로 이동",
  "chat.thread.back_to_members": "멤버로 돌아가기",
  "chat.thread.nostr_key": "Nostr 공개 키",
  "chat.thread.in_range": "범위 내",
  "chat.voice.not_recorded": "음성 메모가 녹음되지 않았습니다",
  "chat.thread.message": "메시지",
  "chat.thread.message_placeholder": "메시지…",
  "chat.thread.length_full": "메시지가 가득 찼습니다",
  "chat.thread.waiting_for": "{name}이(가) 돌아오기를 기다리는 중 · {percent}%",
  "chat.thread.peer": "피어",
  "chat.thread.cancel_transfer": "{name} 취소",
  "chat.thread.queued_more": "{count}개가 더 전송을 기다리는 중",
  "chat.thread.across_bridge": "브리지 건너편에 {count}명",
  "chat.thread.bridged": "브리지됨",
  "chat.thread.invite_body":
    "Airhop의 {channel}에서 함께해요 — 오프라인 우선 비공개 메시 메시징.",
  "chat.thread.go_back_unread": "뒤로 가기, 읽지 않음 {count}개",
  "chat.thread.view_info": "{name}의 정보 보기",
  "chat.thread.notices_new": "이 채널의 공지, 새 항목 {count}개",
  "chat.thread.say_something": "{channel}에서 한마디 하세요.",
  "chat.thread.jump_latest_new": "최신 메시지로 이동, 새 항목 {count}개",
  "chat.thread.unconfirmed_since": "{date} 이후 전달이 확인되지 않음",
  "chat.thread.no_reach": "근처에 피어 없음 · 아직 아무도 받지 못했습니다",
  "chat.thread.channel_needs_internet":
    "인터넷 꺼짐 · 이 채널은 블루투스 범위 안의 사람에게만 닿습니다",
  "chat.thread.cell_needs_internet":
    "인터넷 꺼짐 · 이 셀은 인터넷으로만 닿을 수 있습니다",
  "chat.thread.geo_dm_needs_internet":
    "인터넷 꺼짐 · 이 대화는 인터넷으로만 오갑니다",
  "chat.thread.via_gateway":
    "인터넷 꺼짐 · 근처 기기가 나를 대신해 온라인으로 실어 나르는 중",
  "chat.thread.group_queued":
    "이 그룹에서 아직 근처에 있는 사람이 없습니다. 근처에 오면 전달됩니다.",
  "chat.thread.no_group_key":
    "이 그룹에 더 이상 속해 있지 않아 보낼 수 없습니다",
  "chat.thread.no_reach_offline":
    "인터넷 꺼짐이고 근처에 피어도 없음 · 아직 아무도 받지 못했습니다",
  "chat.thread.mention": "{name} 언급하기",
  "chat.thread.someone_talking": "{hold}. {name}이(가) 말하는 중입니다.",
  "chat.thread.attach_note":
    "파일은 블루투스 범위 안에서만 전송됩니다. 텍스트와 결제는 인터넷 연락처에도 닿지만 첨부 파일은 닿지 않습니다.",
  "chat.thread.message_peer": "{name}에게 메시지 보내기",
  "chat.thread.send": "메시지 보내기",
  "chat.thread.group": "그룹",
  "chat.bridge.nearby_only": "근처만: 이 메시지를 메시 브리지에 올리지 않기",
  "chat.bridge.nearby_label": "근처만 · 블루투스에 머무름",
  "chat.bridge.bridging_label": "근처 지역으로 브리지하는 중 · 탭하면 근처만",
  "chat.screenshot.you_took": "화면을 캡처했습니다",
  "chat.screenshot.you_took_private":
    "화면을 캡처했습니다 · 아무에게도 알리지 않았습니다",
  "chat.screenshot.heads_up": "알려드립니다",
  "chat.screenshot.notice": "* {name}이(가) 화면을 캡처했습니다 *",
  "chat.screenshot.notified_dm": "{name}에게 이 대화를 캡처했다고 알렸습니다.",
  "chat.screenshot.notified":
    "이 채널의 모두에게 화면을 캡처했다고 알렸습니다.",
  "chat.screenshot.not_notified":
    "아무에게도 알리지 않았습니다. 이 채널은 공개라서 캡처 사실을 알리면 내가 여기 있었다는 것이 기록으로 남습니다.",
  "chat.thread.error": "오류",
  "chat.thread.go_back": "뒤로 가기",
  "chat.bubble.via_bridge": "메시 브리지를 통해",
  "chat.bubble.view_profile": "{name}의 프로필 보기",
  "chat.bubble.forwarded": "전달됨",
  "chat.bubble.attachment": "첨부 파일",
  "chat.bubble.a11y": "{sender}: {body}. 길게 눌러 추가 옵션 보기.",
  "chat.bubble.failed_retry": "보내지 못했습니다. 탭하여 다시 시도하세요.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "메시지 정보",
  "chat.info.delivered_to": "{name}에게 전달됨",
  "chat.info.read_by": "{name}이(가) 읽음",
  "chat.info.group_reach_desc":
    "지금 연결 가능하다는 뜻이며 전달 확인은 아닙니다",
  "chat.info.group_alone": "다른 멤버 없음",
  "chat.info.today_at": "오늘 {time}",
  "chat.info.sending": "보내는 중…",
  "chat.info.failed": "보내지 못함",
  "chat.info.courier": "다른 기기가 실어 나름",
  "chat.info.sent": "보냄",
  "chat.info.queued": "전송 대기 중",
  "chat.info.waiting": "기다리는 중…",
  "chat.action.info": "메시지 정보",
  "chat.action.save_photos": "사진에 저장",
  "chat.action.save_copy": "사본 저장",
  "chat.action.forward": "전달",
  "chat.action.select": "선택",
  "chat.select.cancel": "선택 취소",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "카메라",
  "chat.attach.camera_desc": "사진이나 동영상 촬영",
  "chat.attach.library": "사진 라이브러리",
  "chat.attach.library_desc": "라이브러리에서 선택",
  "chat.attach.document": "문서",
  "chat.attach.document_desc": "아무 파일이나 PDF 보내기",
  "chat.attach.voice": "음성 메모",
  "chat.attach.voice_desc": "음성 메시지를 녹음해 보내기",
  "chat.attach.ecash": "ecash 보내기",
  "chat.attach.ecash_desc": "지갑에서 Cashu sats 보내기",
  "chat.attach.location": "위치",
  "chat.attach.location_desc": "지금 있는 곳 보내기",
  "chat.attach.title": "첨부",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "위치를 공유했습니다",
  "chat.location.received_summary": "위치를 공유했습니다",
  "chat.location.title": "위치",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "{ago} 전에 측정됨",
  "chat.location.open_maps": "Maps에서 열기",
  "chat.location.no_forward": "위치는 전달되지 않습니다",
  "chat.location.no_forward_body":
    "위치는 한 사람에게만 보냅니다. 다른 사람에게도 알리고 싶다면 내 위치를 직접 공유하세요.",
  "chat.location.no_fix": "얼마나 떨어져 있는지 보려면 위치를 허용하세요",
  "chat.location.send_title": "내 위치 보내기",
  "chat.location.send_body":
    "{name}에게는 지금 있는 곳 한 지점만 보입니다. 계속 갱신되지 않습니다.",
  "chat.location.send": "위치 보내기",
  "chat.location.finding": "위치를 찾는 중…",
  "chat.location.no_location": "위치를 가져오지 못했습니다",
  "chat.location.no_location_body":
    "위치 접근을 허용하고 위치 서비스가 켜져 있는지 확인한 다음 다시 시도하세요.",
  "chat.location.not_delivered": "위치를 보내지 못했습니다",
  "chat.location.not_delivered_body":
    "위치는 최신일 때만 보낼 가치가 있어 나중을 위해 대기시키지 않습니다. {name}에게 닿을 수 있을 때 다시 시도하세요.",
  "chat.location.direction.n": "북쪽",
  "chat.location.direction.ne": "북동쪽",
  "chat.location.direction.e": "동쪽",
  "chat.location.direction.se": "남동쪽",
  "chat.location.direction.s": "남쪽",
  "chat.location.direction.sw": "남서쪽",
  "chat.location.direction.w": "서쪽",
  "chat.location.direction.nw": "북서쪽",
  "chat.attach.send_anyway": "그래도 보내기",
  "chat.attach.bitchat_too_big": "도착하지 않을 수 있습니다",
  "chat.attach.bitchat_too_big_body":
    "{name}은(는) bitchat을 쓰는데, 큰 파일은 중간에 포기합니다. 약 350 KiB 이하가 안정적입니다. Airhop 연락처에게 보낼 때는 이런 제한이 없습니다.",
  "chat.attach.bitchat_unopenable": "상대가 열지 못할 수 있습니다",
  "chat.attach.bitchat_unopenable_body":
    "{name}은(는) bitchat을 쓰는데, 사진과 음성 메모는 보여주지만 나머지는 열 수 없는 파일로 표시합니다. 도착은 하지만 볼 수 없을 수 있습니다.",
  "chat.attach.file": "파일 첨부",
  "chat.attach.unavailable": "여기서는 첨부할 수 없습니다",
  "chat.attach.not_sent": "첨부 파일이 전송되지 않음",
  "chat.attach.read_failed":
    "그 파일을 읽는 중 문제가 생겼습니다. 다른 파일로 시도하세요.",
  "chat.attach.caption": "설명 추가…",
  "chat.attach.send": "첨부 파일 보내기",
  "chat.attach.generic": "첨부 파일",
  "chat.media.view_full": "사진 전체 화면으로 보기",
  "chat.media.gone_photo": "사진이 이 기기에 없습니다",
  "chat.media.gone_video": "동영상이 이 기기에 없습니다",
  "chat.media.gone_voice": "음성 메모가 이 기기에 없습니다",
  "chat.media.gone_file": "파일이 이 기기에 없습니다",
  "chat.media.gone_note": "7일이 지나거나 캐시를 지웠을 때 제거됨",
  "chat.media.ask_resend": "다시 요청",
  "chat.media.resend_draft": "그 {kind} 다시 보내주실 수 있나요?",
  "chat.media.kind_photo": "사진",
  "chat.media.kind_video": "동영상",
  "chat.media.kind_voice": "음성 메모",
  "chat.media.kind_file": "파일",
  "chat.media.pause_voice": "음성 메모 일시정지",
  "chat.media.play_voice": "음성 메모 재생",
  "chat.media.voice_position": "음성 메모 위치",
  "chat.media.voice_scrub": "막대를 따라 탭하면 그 지점으로 이동합니다",
  "chat.media.image": "이미지",
  "chat.media.tap_load_photo": "탭하여 사진 불러오기",
  "chat.media.open_document": "{name} 열기",
  "chat.media.document": "문서",
  "chat.media.tap_load_video": "탭하여 동영상 불러오기",
  "chat.media.video": "동영상",
  "chat.media.photo": "사진",
  "chat.media.close_photo": "사진 닫기",
  "chat.media.save_photo": "사진을 내 사진에 저장",
  "chat.media.share_photo": "사진 공유",
  "chat.media.saved_videos": "동영상에 저장했습니다",
  "chat.media.saved_photos": "사진에 저장했습니다",
  "chat.media.not_saved": "저장되지 않음",
  "chat.media.cant_open": "파일을 열 수 없음",
  "chat.media.no_app": "이 기기에는 이 파일을 열거나 공유할 앱이 없습니다.",
  "chat.media.open_failed":
    "파일을 열지 못했습니다. 캐시에서 지워졌을 수 있습니다.",
  "media.blocked.nostr_only":
    "이 사람과는 릴레이를 통해서만 아는 사이입니다. 텍스트만 보낼 수 있습니다. 사진, 파일, 음성 메모에는 블루투스가 필요합니다.",
  "media.blocked.private_channel":
    "브로드캐스트 첨부 파일은 서명은 되지만 암호화되지 않습니다. 비공개 채널로 보내면 여기 텍스트는 암호화된 채로 남는데 첨부 파일만 그대로 노출됩니다.",
  "media.blocked.private_group":
    "브로드캐스트 첨부 파일은 서명은 되지만 암호화되지 않습니다. 비공개 그룹으로 보내면 여기 텍스트는 암호화된 채로 남는데 첨부 파일만 그대로 노출됩니다.",
  "media.blocked.location_channel":
    "위치 채널은 인터넷으로 사람들에게 도달하고, 사진과 파일과 음성 메모는 블루투스로 오갑니다. 그래서 결코 도착하지 못합니다.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "여기서는 음성 메모를 쓸 수 없습니다",
  "chat.voice.hold_live": "길게 눌러 실시간으로 말하기",
  "chat.voice.hold_record": "길게 눌러 음성 메모 녹음",
  "chat.voice.cancel_recording": "녹음 취소",
  "chat.voice.slide_cancel": "밀어서 취소",
  "chat.voice.release_cancel": "놓으면 취소",
  "chat.voice.a11y_toggle": "두 번 탭하여 말하기를 시작하거나 멈춥니다.",
  "chat.voice.limit_reached": "2분 제한에 도달했으니 놓으면 전송됩니다",
  "chat.voice.limit_sent": "2분 제한에 도달해 메모를 보냈습니다",
  "chat.voice.stop_send": "녹음을 멈추고 보내기",
  "chat.voice.lift_lock": "위로 밀면 손을 떼고 녹음",
  "chat.voice.live_speaking": "{name}이(가) 말하는 중",
  "voice.unavailable": "실시간 음성을 사용할 수 없음",
  "voice.recording_stopped": "녹음이 중지되었습니다",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "카메라 접근",
  "chat.perm.camera_purpose": "보낼 사진을 찍기",
  "chat.perm.photo_label": "사진 접근",
  "chat.perm.photo_purpose": "보낼 사진이나 동영상을 고르기",
  "chat.perm.photo_save_purpose": "이것을 내 사진에 저장하기",
  "chat.perm.mic_label": "마이크 접근",
  "chat.perm.mic_live_purpose": "근처 사람들과 대화하기",
  "chat.perm.mic_note_purpose": "음성 메모를 녹음하기",
  "chat.perm.recording_stopped": "녹음이 중지되었습니다",
  "chat.perm.record_failed":
    "녹음을 시작하지 못했습니다. 마이크 권한을 확인하세요.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "받음",
  "chat.ecash.reclaimed": "회수됨",
  "chat.ecash.claiming": "받는 중…",
  "chat.ecash.claim": "받기",
  "chat.ecash.claim_amount": "{amount} {unit} 받기",
  "chat.ecash.already_claimed": "이미 받았습니다",
  "chat.ecash.already_claimed_body":
    "이 토큰의 모든 증명이 이미 지갑에 있어 추가된 것이 없습니다.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "최선 전달을 위해 메시에 넘겨짐",
  "chat.info.queued_desc": "상대에게 갈 경로가 생길 때까지 이 휴대폰에 보관됨",
  "chat.info.reclaimed": "회수됨",
  "chat.info.reclaimed_desc":
    "이 결제를 지갑으로 되돌렸으므로 전달되지 않습니다",
  "chat.info.about": "정보",
  "chat.info.group_desc":
    "비공개 그룹입니다. 만든 사람이 추가한 멤버만 읽을 수 있고 블루투스에 머무릅니다.",
  "chat.info.teleported_desc":
    "이 지오해시 셀의 공개 위치 채널입니다. Airhop이든 bitchat이든 이 셀에 있는 누구나 인터넷으로 함께 씁니다. 나는 실제로 여기 있는 것이 아니라 텔레포트한 상태입니다.",
  "chat.info.custom_desc":
    "사용자 지정 채널입니다. 이름을 아는 사람은 어떤 Airhop 또는 bitchat 기기에서든 참여할 수 있습니다.",
  "chat.info.private_e2ee": "비공개 · 종단 간 암호화",
  "chat.info.public_plain": "공개 · 암호화되지 않음",
  "chat.info.group_privacy":
    "아래 표시된 멤버만 이 그룹을 읽을 수 있습니다. 메시지는 블루투스에 머무르므로 범위 밖의 멤버는 돌아왔을 때 받습니다.",
  "chat.info.teleport_privacy":
    "텔레포트해서 온 장소입니다. 인터넷으로 이 셀의 모두에게 닿으며, 블루투스 범위 안의 누구에게도 닿지 않습니다.",
  "chat.info.location_off_privacy":
    "위치가 꺼져 있어 이 채널은 블루투스로만 근처 기기에 닿습니다. 인터넷으로 이 지역 셀에 닿으려면 위치를 켜세요.",
  "chat.info.invite_privacy":
    "링크로 초대한 사람만 읽을 수 있습니다. 그 외에는 근처 피어에게도 보이지 않습니다.",
  "chat.info.public_privacy":
    "참여한 사람은 누구나 모든 메시지를 읽을 수 있습니다. 사적인 대화에는 다이렉트 메시지를 쓰세요. DM은 종단 간 암호화됩니다.",
  "chat.info.remove_member": "멤버 제외",
  "chat.info.remove_member_body":
    "{name}을(를) 그룹에서 제외할까요? 그룹 키가 교체되어 새 메시지를 읽을 수 없게 됩니다.",
  "chat.info.message_member": "{name}에게 메시지 보내기",
  "chat.info.remove_member_a11y": "{name} 제외",
  "chat.info.no_addable":
    "추가할 수 있는 피어가 없습니다. 멤버가 근처에 있어야 합니다.",
  "chat.info.add_count": "{count}명 추가",
  "chat.info.teleported_tag": "{level}  ·  텔레포트",
  "chat.info.active": "활동 중",
  "chat.info.members": "멤버",
  "chat.info.bookmark": "이 장소 북마크",
  "chat.info.remove_bookmark": "북마크 제거",
  "chat.info.default_notice":
    "기본 채널은 나갈 수 없습니다. Airhop 메시 프로토콜의 일부이기 때문입니다.",
  "chat.info.custom_channel": "사용자 지정 채널",
  "chat.info.geohash": "지오해시",
  "chat.info.copy_geohash": "지오해시 복사",
  "chat.info.relays": "릴레이",
  "chat.info.show_relays": "이 채널을 실어 나르는 릴레이 표시",
  "chat.info.relay_custom": "사용자 지정",
  "chat.info.relays_none": "없음. 이 셀은 지금 블루투스 전용입니다.",
  "chat.info.search_members": "멤버 검색",
  "chat.info.search_members_placeholder": "멤버 검색…",
  "chat.info.teleported": "텔레포트",
  "chat.info.creator": "만든 사람",
  "chat.info.no_matches": "일치하는 항목 없음",
  "chat.info.no_one_here": "아직 아무도 없습니다",
  "chat.info.add_members": "멤버 추가",
  "chat.info.add_selected": "선택한 멤버 추가",
  "chat.info.add": "추가",
  "chat.info.leave_group": "그룹 나가기",
  "chat.info.leave_channel": "채널 나가기",
  "chat.info.leave": "나가기",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date}부터 대화",
  "chat.contact.verified_since": "{date}부터 확인됨",
  "chat.contact.anonymous": "익명",
  "chat.contact.anonymous_desc": "확인할 지속적인 신원이 없는 지오해시 가명",
  "chat.contact.verified": "확인됨",
  "chat.contact.verified_desc": "상대의 QR 코드를 스캔했습니다",
  "chat.contact.verified_desc_compared": "상대와 코드를 대조했습니다",
  "chat.contact.not_verified": "확인되지 않음",
  "chat.contact.not_verified_desc":
    "정말 본인인지 확인하려면 코드를 스캔하거나 통화하며 코드를 대조하세요",
  "chat.contact.e2ee": "종단 간 암호화",
  "chat.contact.e2ee_nostr":
    "NIP-17 기프트랩 방식이라 릴레이가 읽을 수 없습니다",
  "chat.contact.e2ee_mesh":
    "Noise XX, 그리고 Airhop 기기 사이에는 Double Ratchet까지",
  "chat.contact.copy_nostr": "Nostr 공개 키 복사",
  "chat.contact.nostr_key": "Nostr 공개 키",
  "chat.contact.cell_key_note":
    "이 키는 두 사람이 만난 지역에 속합니다. 어느 한쪽이 자리를 옮기면 키가 바뀌고 대화도 거기서 끊깁니다. 어디서든 대화를 이어가려면 연락처를 교환하세요.",
  "chat.contact.peer_name": "피어 이름",
  "chat.contact.peer_id": "피어 ID",
  "chat.contact.rename": "이름 바꾸기",
  "chat.contact.rename_needs_contact":
    "키를 가지고 있는 사람만 이름을 바꿀 수 있습니다. 먼저 연락처 카드를 교환하면, 나에게만 보이는 이름을 붙일 수 있습니다.",
  "chat.contact.rename_needs_keys":
    "이 연락처의 키가 아직 없습니다. 메시지를 보내거나 코드를 스캔하면 나에게만 보이는 이름을 붙일 수 있습니다.",
  "chat.contact.renamed_by_you": "내가 붙인 이름",
  "chat.contact.copy_peer_id": "피어 ID 복사",
  "chat.contact.verify": "연락처 확인",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "공지",
  "chat.notices.post_area": "이 지역에 공지 올리기",
  "chat.notices.post_mesh": "메시에 공지 올리기",
  "chat.notices.mark_urgent": "긴급으로 표시",
  "chat.notices.post": "공지 올리기",
  "chat.notices.post_short": "올리기",
  "chat.notices.delete": "공지 삭제",
  "chat.notices.just_now": "방금",
  "chat.notices.fades_soon": "곧 사라짐",
  "chat.notices.1_day": "1일",
  "chat.notices.3_days": "3일",
  "chat.notices.7_days": "7일",
  "chat.notices.fading": "사라지는 중",
  "chat.notices.fades_in_hours": "{count}시간 후 사라짐",
  "chat.notices.fades_in_days": "{count}일 후 사라짐",
  "chat.notices.scope_geo": "지오",
  "chat.notices.scope_mesh": "메시",
  "chat.notices.urgent_short": "긴급",
  "chat.notices.permanent_warning":
    "절대 사라지지 않습니다. 공개이며 이 지역에 묶여 있고, 되돌릴 수 없습니다.",
  "chat.notices.none":
    "아직 공지가 없습니다. 하나 올려 다른 사람들을 위해 남겨두세요.",

  // ---- Chats: search results ----
  "chat.search.photos": "사진",
  "chat.search.videos": "동영상",
  "chat.search.audio": "오디오",
  "chat.search.documents": "문서",
  "chat.search.links": "링크",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "{filter}(으)로 필터",
  "chat.search.no_matches": "“{query}”와(과) 일치하는 {filter} 없음",
  "chat.search.no_media": "아직 {filter} 없음",
  "chat.search.result_a11y": "{chat}, {sender}의 {kind}",
  "chat.search.you": "나",
  "chat.search.section_chats": "채팅",
  "chat.search.section_messages": "메시지",
  "chat.search.section_notices": "공지",
  "chat.search.hint": "메시지와 채팅을 검색하거나 위에서 필터를 고르세요.",
  "chat.search.no_results": "“{query}”에 대한 결과 없음",
  "chat.search.open_chat": "{name} 열기",
  "chat.search.message_a11y": "{chat}, {sender}의 메시지: {snippet}",
  "chat.search.notice_a11y": "{chat}의 {author} 공지: {snippet}",
  "chat.search.urgent": "긴급 ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "이 목록에 {count}개가 있습니다. 지우면 여기서만 없어지고 메시지는 각 대화에서 읽지 않은 상태로 남습니다. 모두 읽음으로 표시하면 둘 다 정리됩니다.",
  "chat.notif.mark_all_read": "모두 읽음으로 표시",
  "chat.notif.clear_list": "목록 지우기",
  "chat.notif.clear_all_a11y": "알림 {count}개 모두 지우기",
  "chat.notif.title": "알림",
  "chat.notif.clear_short": "지우기",
  "chat.notif.close": "알림 닫기",
  "chat.notif.none": "아직 알림이 없습니다",
  "chat.notif.none_desc":
    "채널과 채팅에서 온 메시지, 언급, 공지가 여기에 표시됩니다.",
  "chat.notif.new": "새 항목",
  "chat.notif.notice_in": "{channel}의 공지",

  // ---- Chats: forward ----
  "chat.forward.title": "전달할 대상…",
  "chat.forward.to": "{name}에게 전달",
  "chat.forward.cant_send_here": "여기로는 전달할 수 없음",
  "chat.forward.cant_send_to": "{name}에게는 전달할 수 없음",
  "chat.forward.channels": "채널",
  "chat.forward.groups": "그룹",
  "chat.forward.locations": "위치",
  "chat.forward.dms": "다이렉트 메시지",
  "chat.forward.none": "아직 다른 채팅이 없습니다",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "메시를 시작하는 중…",
  "mesh.banner.no_bluetooth": "이 기기에 블루투스 없음 · 인터넷만 사용",
  "mesh.banner.bluetooth_off": "블루투스 꺼짐 · 메시 사용 불가",
  "mesh.banner.permission_needed": "블루투스 권한이 필요합니다",
  "mesh.banner.blocked": "블루투스 차단됨 · 설정에서 허용하세요",
  "mesh.banner.location_permission": "피어를 찾으려면 위치가 필요합니다",
  "mesh.banner.advertising_unsupported":
    "이 휴대폰은 다른 기기를 볼 수는 있지만 발견되지는 않습니다",
  "mesh.banner.location_off_android":
    "위치 꺼짐 · Android는 피어를 찾는 데 위치가 필요합니다",
  "mesh.banner.paused": "메시 일시 중지 · 자리 비움 상태",
  "mesh.banner.location_off": "위치 꺼짐 · 위치 채널 사용 불가",
  "mesh.banner.battery_saver": "배터리 절약 모드 · 스캔 빈도 감소",
  "mesh.banner.wipe_incomplete":
    "삭제 미완료 · 일부 데이터가 남아 있을 수 있으며 다시 열면 재시도합니다",
  "mesh.banner.wifi_off": "Wi-Fi 꺼짐 · 큰 파일 전송이 느려집니다",
  "mesh.banner.clock_skew":
    "이 휴대폰의 시계가 맞지 않습니다 · 날짜와 시간을 자동으로 설정하세요",
  "mesh.banner.internet_off": "인터넷 꺼짐 · 블루투스만 사용",
  "mesh.banner.relaying": "근처에 피어 없음 · Nostr를 통해 중계 중",
  "mesh.banner.tor": "Tor 켜짐 · 인터넷 트래픽 경로 설정됨",
  "mesh.banner.tor_starting": "Tor 시작 중 · 연결하는 중",
  "mesh.banner.tor_blocked":
    "Tor가 연결되지 않았습니다 · 메시는 계속 작동합니다",
  "mesh.banner.gateway": "인터넷 게이트웨이 켜짐 · 근처 피어를 중계하는 중",
  "mesh.banner.bridge": "메시 브리지 켜짐 · 공개 채팅 연결됨",
  "mesh.banner.background_limits":
    "{brand}이(가) 백그라운드에서 메시를 일시 중지할 수 있습니다",
  "mesh.banner.bridge_across": "메시 브리지 켜짐 · 브리지 건너편에 {count}명",
  "mesh.banner.action.turn_on": "켜기",
  "mesh.banner.action.allow": "허용",
  "mesh.banner.action.resume": "재개",
  "mesh.banner.action.fix": "해결",
  "mesh.banner.hint.resume": "블루투스 광고와 스캔을 다시 켭니다",
  "mesh.banner.hint.enable_bluetooth":
    "Android에 블루투스를 켜달라고 요청합니다",
  "mesh.banner.hint.location_settings": "시스템 위치 설정을 엽니다",
  "mesh.banner.hint.app_settings": "시스템 설정에서 Airhop의 권한을 엽니다",
  "mesh.banner.hint.battery_settings":
    "이 휴대폰의 백그라운드 활동 설정을 엽니다",
  "mesh.banner.dismiss": "닫기: {label}",
  "mesh.banner.hint.dismiss": "이 안내를 완전히 숨깁니다",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "근처 피어를 찾는 중…",
  "mesh.radar.starting": "메시를 시작하는 중…",
  "mesh.radar.no_bluetooth": "이 기기에 블루투스가 없습니다",
  "mesh.radar.bluetooth_off": "블루투스 꺼짐 · 스캔하지 않음",
  "mesh.radar.permission_needed": "블루투스 권한이 필요합니다",
  "mesh.radar.blocked": "블루투스 차단됨",
  "mesh.radar.location_permission": "위치 권한이 필요합니다",
  "mesh.radar.location_off": "위치 꺼짐 · 스캔하지 않음",
  "mesh.radar.hint_rings": "원은 거리가 아니라 BLE 신호 세기를 나타냅니다",
  "mesh.radar.hint_checking": "블루투스와 권한을 확인하는 중",
  "mesh.radar.hint_internet": "메시지는 여전히 인터넷을 통해 오갑니다",
  "mesh.radar.hint_turn_on": "피어를 찾으려면 블루투스를 켜세요",
  "mesh.radar.hint_allow": "피어를 찾으려면 블루투스를 허용하세요",
  "mesh.radar.hint_allow_settings":
    "피어를 찾으려면 설정에서 블루투스를 허용하세요",
  "mesh.radar.hint_location_permission":
    "Android 11 이하는 블루투스로 스캔하려면 위치가 필요합니다",
  "mesh.radar.hint_android_location":
    "Android는 블루투스 스캔 결과를 돌려주려면 위치가 켜져 있어야 합니다",
  "mesh.radar.signal_strong": "강함",
  "mesh.radar.signal_medium": "보통",
  "mesh.radar.signal_weak": "약함",
  "mesh.radar.you_center": "나, 메시의 중심",
  "mesh.radar.sonar_hint":
    "소나 스윕 소리를 재생합니다. 스캔은 이미 계속 진행 중입니다.",
  "mesh.radar.paused": "메시 일시 중지 · 자리 비움 상태",
  "mesh.radar.ring_hint": "원의 위치는 거리가 아니라 신호 세기를 반영합니다",
  "mesh.radar.set_online":
    "피어를 찾으려면 프로필에서 상태를 온라인으로 설정하세요",
  "mesh.radar.in_range": "범위 내",
  "mesh.radar.recently_seen": "최근에 본 사람",
  "mesh.radar.peer_hint":
    "이 피어에게 메시지를 보내거나 결제할 수 있는 옵션을 엽니다",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "방금",
  "mesh.peer.none": "근처에 피어가 없습니다",
  "mesh.peer.none_desc":
    "블루투스 범위 안에 있는 다른 Airhop 또는 bitchat 기기가 여기에 표시됩니다.",
  "mesh.peer.id_copied": "피어 ID가 복사되었습니다",
  "mesh.peer.copy_id": "피어 ID 복사",
  "mesh.peer.their_name": "{name}(으)로 통합니다",
  "mesh.peer.in_range": "범위 내",
  "mesh.peer.relay": "릴레이 노드",
  "mesh.peer.relay_body":
    "누군가 메시를 넓히려고 켜둔 무선 장치입니다. 읽을 수 없는 메시지를 실어 나릅니다. 여기에는 메시지를 보낼 사람이 없습니다.",
  "mesh.peer.send_dm": "다이렉트 메시지 보내기",
  "mesh.peer.message": "메시지",
  "mesh.peer.send_sats": "ecash 보내기",
  "mesh.peer.amount_placeholder": "sats 단위 금액",
  "mesh.peer.amount_first": "ecash 보내기, 먼저 금액을 입력하세요",
  "mesh.peer.cancel_send": "ecash 보내기 취소",
  "mesh.peer.view_peer": "피어 {name} 보기",
  "mesh.peer.view_peer_online": "피어 {name} 보기, 온라인",
  "mesh.peer.last_seen": "{ago} 전에 마지막으로 봄",
  "mesh.peer.send_amount": "{amount} sats 보내기",
  "mesh.peer.direct": "직접 연결",
  "mesh.peer.check_distance": "거리 확인",
  "mesh.peer.checking": "확인하는 중",
  "mesh.peer.no_reply": "응답 없음",
  "mesh.peer.no_reply_hint":
    "자리를 옮겼거나, 상대방 앱이 응답하지 않을 수 있습니다",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "지역",
  "mesh.level.province": "도 또는 주",
  "mesh.level.city": "도시",
  "mesh.level.neighborhood": "동네",
  "mesh.level.block": "도시 블록",
  "mesh.level.building": "건물",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "사용 가능",
  "wallet.balance.unit_hint": "사토시와 비트코인 사이를 전환합니다",
  "wallet.balance.a11y": "잔액 {value} {unit}",
  "wallet.balance.locked":
    "지갑 저장소가 잠겨 있습니다. ecash 증명은 기기 키체인에 키가 있는 암호화된 파일에 보관되는데, 그 파일을 열지 못했습니다. 기기 잠금을 풀고 Airhop을 다시 여세요.",
  "wallet.balance.tor_blocked":
    "Tor가 켜져 있어 민트 요청이 차단되었습니다. 요청이 일반 네트워크로 나가 IP와 증명이 연결되기 때문입니다. 메시를 통한 송수신은 계속 작동합니다. 설정, 보안에서 민트 트래픽을 허용하세요.",
  "wallet.balance.unconfirmed_note":
    "{amount}이(가) 아직 민트에서 확인되지 않음",
  "wallet.balance.reserved_note": "{amount}이(가) 진행 중인 전송을 위해 예약됨",
  "wallet.balance.other_mint_note": "{amount}이(가) 별도 민트 계정에 있음",
  "wallet.balance.test_mint_note":
    "테스트 민트의 모의 자금이 포함되어 있습니다. 비트코인이 아니며 현금화할 수 없습니다.",
  "wallet.token": "토큰",
  "wallet.action.send": "ecash 토큰 보내기",
  "wallet.action.send_disabled":
    "ecash 토큰 보내기, 잔액이 없어 사용할 수 없음",
  "wallet.action.receive": "ecash 토큰 받기",
  "wallet.action.zap": "Nostr 연락처에게 zap 보내기",
  "wallet.action.zap_disabled":
    "Nostr 연락처에게 zap 보내기, 잔액이 없어 사용할 수 없음",
  "wallet.action.add_mint": "Cashu 민트 추가",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "토큰을 만들지 못했습니다",
  "wallet.send.title": "ecash 보내기",
  "wallet.send.amount_in": "{unit} 단위 금액",
  "wallet.send.body":
    "이미 보유한 증명으로 오프라인에서 만들어집니다. 토큰이 전달되었음을 확인하기 전까지는 잔액에서 영구히 빠져나가는 것이 없습니다.",
  "wallet.send.stale_fee_note":
    "수수료를 마지막으로 확인한 것은 {days}일 전입니다. 그 이후 이 민트가 수수료를 올렸다면 전송 비용이 조금 더 들 수 있습니다.",
  "wallet.send.fee_note":
    "{spend} {unit}이(가) 잔액에서 빠져나가며, 추가 {fee}은(는) 상대방이 부담했을 민트 수수료를 대신합니다",
  "wallet.send.qr_too_big":
    "이 토큰은 너무 많은 코인으로 나뉘어 QR 코드에 담기지 않습니다. 대신 공유하거나 복사하세요. 또는 민트에서 새로 고쳐 하나로 합치세요.",
  "wallet.send.bearer_note":
    "이 문자열을 가진 사람이 곧 돈의 주인입니다. 증명은 사용된 것이 아니라 예약된 상태이므로, 아무에게도 닿지 않았다면 대기 중 항목에서 회수할 수 있습니다.",
  "wallet.send.qr_too_big_short":
    "이 토큰은 너무 많은 코인으로 나뉘어 QR 코드에 담기지 않습니다. 대신 공유하거나 복사하세요.",
  "wallet.send.scan_note":
    "상대방이 자기 지갑에서 이것을 스캔하게 하세요. 전달 완료로 표시하기 전까지는 회수할 수 있습니다.",
  "wallet.send.mesh_note":
    "토큰은 메시를 통해 암호화된 DM으로 나갑니다. 인터넷이 필요 없습니다.",
  "wallet.send.no_peers_note":
    "메시 탭을 열어 근처 기기를 찾거나, 다른 방법으로 토큰을 공유하세요.",
  "wallet.send.send_to": "{name}에게 보내기",
  "wallet.send.memo": "메모 (선택 사항, 토큰과 함께 전달됨)",
  "wallet.send.building": "만드는 중…",
  "wallet.send.build": "토큰 만들기",
  "wallet.send.inexact_body":
    "보유한 증명으로는 오프라인에서 정확히 {amount} {unit}을(를) 만들 수 없습니다. 만들 수 있는 가장 작은 토큰은 {spend} {unit}이며, 오프라인에서는 거스름돈이 없어 초과분 {extra} {unit}은(는) 받는 사람에게 갑니다.\n\n온라인 상태에서 민트에서 새로 고치면 증명이 이 금액에 딱 맞는 단위로 나뉩니다.",
  "wallet.send.send_amount": "{amount} 보내기",
  "wallet.send.sent_to": "{amount} {unit}을(를) {name}에게 보냈습니다",
  "wallet.send.sent_to_body":
    "{route} 상대방이 받았음을 확인하거나 민트가 증명이 사용되었다고 알려줄 때까지, 대기 중 항목에서 회수할 수 있습니다.",
  "wallet.send.copy_token": "토큰 복사",
  "wallet.send.share_token": "토큰 공유",
  "wallet.send.open_in_wallet": "이 토큰을 다른 지갑에서 열기",
  "wallet.send.open_in_wallet_short": "지갑에서 열기",
  "wallet.send.to_peer": "근처 피어에게 토큰 보내기",
  "wallet.send.to_peer_short": "피어에게 보내기",
  "wallet.send.mark_delivered": "전달 완료로 표시하고 마치기",
  "wallet.send.they_got_it": "상대방이 받았습니다",
  "wallet.send.keep_pending": "이 전송을 대기 상태로 두기",
  "wallet.send.decide_later": "나중에 결정",
  "wallet.send.no_peers": "범위 내에 피어 없음",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "내가 보낸 결제입니다",
  "wallet.receive.own_payment_body":
    "이 코인들은 아직 정산하지 않은 전송을 위해 예약된 상태라 받을 것이 없습니다. 해당 결제에서 회수를 사용하면 곧바로 잔액으로 되돌릴 수 있습니다.",
  "wallet.receive.already_have": "이미 지갑에 있습니다",
  "wallet.receive.already_have_body":
    "이 토큰의 모든 증명이 이미 여기 저장되어 있어 추가된 것이 없습니다. 잔액은 그대로입니다.",
  "wallet.receive.stored_unconfirmed":
    "{mint}에서 받아 저장했지만 아직 민트에서 확인되지 않았습니다 ({reason}).",
  "wallet.receive.offline": "오프라인",
  "wallet.receive.redeemed_here":
    "{mint}에서 교환했습니다. 이 증명들은 이제 온전히 내 것이며, 보낸 사람의 사본은 더 이상 작동하지 않습니다.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "{mint}에서 교환했습니다. 이제 증명 가능하게 내 것이며, 보낸 사람이 가진 이 토큰의 사본은 더 이상 작동하지 않습니다.",
  "wallet.receive.stored_pending":
    "{mint}에서 받아 저장했지만 민트가 아직 미사용 여부를 확인해 주지 않았습니다{dleq}. 온라인이 되면 지갑 탭에서 새로 고치세요.",
  "wallet.receive.dleq_inline": " (서명은 확인되므로 토큰 자체는 진짜입니다)",
  "wallet.receive.dleq_ok": "민트의 서명이 확인되므로 토큰은 진짜입니다.",
  "wallet.receive.dleq_uncached":
    "민트의 키가 여기에 캐시되어 있지 않아 서명을 오프라인에서 확인하지 못했습니다.",
  "wallet.receive.dleq_warning":
    "온라인에서 새로 고치기 전까지는 보낸 사람이 다른 곳에서 이미 썼을 가능성이 원칙적으로 남아 있습니다.",
  "wallet.receive.failed": "받지 못했습니다",
  "wallet.receive.title": "ecash 받기",
  "wallet.receive.body":
    "Cashu 토큰을 붙여넣으세요. 온라인이면 민트에서 즉시 교환되고, 오프라인이면 저장해 두었다가 다음에 새로 고칠 때 확인합니다.",
  "wallet.receive.scan": "ecash QR 코드 스캔",
  "wallet.receive.scan_short": "QR 스캔",
  "wallet.receive.receiving": "받는 중…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}…에게서 Nutzap을 받아 지갑으로 교환했습니다.",
  "wallet.zap.title": "Nostr 신원에게 zap 보내기",
  "wallet.zap.not_npub": "npub이 아님",
  "wallet.zap.bad_key": "잘못된 키",
  "wallet.zap.invalid_pubkey": "유효하지 않은 pubkey",
  "wallet.zap.invalid_pubkey_body":
    "npub1… 또는 64자 16진수 Nostr pubkey를 입력하세요.",
  "wallet.zap.sent": "Nutzap을 보냈습니다",
  "wallet.zap.failed": "Zap 실패",
  "wallet.zap.body":
    "상대가 NIP-61 nutzap 정보를 게시했다면 ecash가 상대의 키에 잠겨 다른 사람은 쓸 수 없게 되고, 되돌릴 수도 없습니다. 게시하지 않았다면 회수 가능한 토큰으로 전달됩니다. 어느 쪽인지 알려드립니다.",
  "wallet.zap.contact": "{name}에게 zap 보내기",
  "wallet.zap.pubkey_placeholder": "npub1… 또는 64자 16진수",
  "wallet.zap.sending": "보내는 중…",
  "wallet.nostr.copied_body":
    "이것을 다른 사람에게 주면 블루투스 없이도 Airhop이나 다른 Nostr 지갑에서 나에게 zap을 보낼 수 있습니다.",
  "wallet.nostr.copy_key": "사람들이 zap을 보낼 수 있도록 내 Nostr 키 복사하기",
  "wallet.nostr.your_key": "내 Nostr 키",

  // ---- Wallet: mints ----
  "wallet.mint.added": "민트를 추가했습니다",
  "wallet.mint.add_failed": "민트를 추가하지 못했습니다",
  "wallet.mint.added_named": "{name}을(를) 추가했습니다",
  "wallet.mint.added_body":
    "{mint}은(는) {units}을(를) 발행합니다. 키가 이 기기에 캐시되어 있어 이제 인터넷 없이도 이 민트의 토큰을 검증할 수 있습니다.",
  "wallet.mint.remove_plain":
    "{mint}을(를) 지갑에서 제거할까요? 캐시된 키도 함께 사라지므로 이 민트의 토큰을 오프라인에서 검증할 수 없게 됩니다.",
  "wallet.mint.title": "민트",
  "wallet.mint.none": "아직 민트가 없습니다",
  "wallet.mint.none_desc":
    "민트는 ecash를 발행하고 교환해 줍니다. Lightning으로 입금하려면 하나 추가하거나, 그냥 토큰을 받으면 해당 민트가 자동으로 추가됩니다.",
  "wallet.mint.add": "민트 추가",
  "wallet.mint.add_body":
    "민트는 ecash를 뒷받침하는 Bitcoin을 보유하므로, 거기 둘 잔액을 맡길 만큼 신뢰하는 곳을 고르세요. URL은 저장하기 전에 확인합니다. 아무도 신뢰하고 싶지 않다면 Nutshell로 직접 운영하세요.",
  "wallet.mint.consolidate_body":
    "토큰 하나는 언제나 민트 한 곳만 지정할 수 있어, 여러 곳에 나뉜 잔액으로는 가장 큰 곳이 보유한 액수보다 큰 금액을 낼 수 없습니다. Airhop이 옮겨줄 수 있습니다. 다른 민트들이 각각 선택한 민트가 발행한 Lightning 인보이스를 결제하는 방식입니다. 약간의 라우팅 수수료가 들고 인터넷이 필요합니다.",
  "wallet.mint.add_short": "민트 추가",
  "wallet.mint.checking": "확인하는 중…",
  "wallet.mint.remove_with_balance": "잔액이 있는 민트를 제거할까요?",
  "wallet.mint.remove": "민트 제거",
  "wallet.mint.delete_anyway": "그래도 삭제",
  "wallet.mint.consolidate": "모든 잔액을 한 민트로 옮기기",
  "wallet.mint.confirm_with": "{mint}에서 증명 확인",
  "wallet.mint.remove_a11y": "{mint} 제거",
  "wallet.mint.available_amount": "{amount} {unit} 사용 가능",
  "wallet.mint.split_across":
    "잔액이 민트 {count}곳에 나뉘어 있습니다. 한 곳으로 옮기세요.",
  "wallet.mint.move_everything_to": "모두 {mint}(으)로 옮기기",
  "wallet.mint.consolidate_title": "한 민트로 옮기기",
  "wallet.mint.moving": "옮기는 중…",
  "wallet.mint.move": "옮기기",
  "wallet.mint.moved": "옮겼습니다",
  "wallet.mint.moved_body":
    "Lightning 라우팅 수수료 {fees} {unit}을(를) 제하고 이제 {amount} {unit}이(가) {mint}에 있습니다.",
  "wallet.mint.nothing_moved": "옮겨진 것이 없습니다",
  "wallet.mint.destination": "· 대상",
  "wallet.mint.will_move": "· 옮겨질 예정",
  "wallet.mint.issued_by": "발행처",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop 지갑 충전",
  "wallet.ln.invoice_failed": "인보이스를 만들지 못했습니다",
  "wallet.ln.price_failed": "이 인보이스의 금액을 산정하지 못했습니다",
  "wallet.ln.paid": "결제됨",
  "wallet.ln.deposit_credited":
    "인보이스가 결제되어 {mint}이(가) {amount} {unit}을(를) 발행했습니다. 이 잔액은 확인된 상태이므로 바로 오프라인에서 쓸 수 있습니다.",
  "wallet.ln.withdrawn":
    "Lightning으로 {paid} sats을 지급했습니다. 민트가 라우팅 수수료로 {fee} sats을 받았습니다.",
  "wallet.ln.withdrawn_with_change":
    "Lightning으로 {paid} sats을 지급했습니다. 민트가 라우팅 수수료로 {fee} sats을 받고, 예약분 중 {change} sats을 잔액으로 돌려주었습니다.",
  "wallet.ln.payment_failed": "결제 실패",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning sats을 오프라인에서 쓸 수 있는 ecash로 바꾸거나, ecash를 어떤 Lightning 인보이스로든 현금화하세요. 둘 다 인터넷과 민트가 필요합니다.",
  "wallet.ln.deposit_body":
    "민트가 인보이스를 발행합니다. 아무 Lightning 지갑으로 결제하면 sats이 오프라인에서 쓸 수 있는 ecash로 돌아옵니다.",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit}짜리 이 인보이스를 결제하세요. 지갑이 결제를 지켜보다가 ecash를 자동으로 발행해 줍니다.",
  "wallet.ln.expired_body":
    "이 인보이스는 만료되었습니다. 이미 결제했다면 잔액은 자동으로 적립됩니다.",
  "wallet.ln.waiting_expires": "결제를 기다리는 중 · {countdown} 후 만료",
  "wallet.ln.withdraw_body":
    "bolt11 인보이스를 붙여넣으면 민트가 내 ecash로 결제합니다. 먼저 라우팅 예약분을 안내받으며, 라우팅에 쓰이지 않은 만큼은 잔액으로 돌아옵니다.",
  "wallet.ln.up_to": "최대 {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} 결제",
  "wallet.ln.deposit": "Lightning으로 sats 입금",
  "wallet.ln.deposit_short": "입금",
  "wallet.ln.withdraw": "Lightning 인보이스로 출금",
  "wallet.ln.withdraw_short": "출금",
  "wallet.ln.deposit_title": "Lightning으로 입금",
  "wallet.ln.amount_placeholder": "sats 단위 금액",
  "wallet.ln.requesting": "요청하는 중…",
  "wallet.ln.get_invoice": "인보이스 받기",
  "wallet.ln.copy_invoice": "인보이스 복사",
  "wallet.ln.open_wallet": "Lightning 지갑에서 열기",
  "wallet.ln.open_wallet_short": "지갑에서 열기",
  "wallet.ln.waiting": "결제를 기다리는 중…",
  "wallet.ln.new_invoice": "새 인보이스 만들기",
  "wallet.ln.new_invoice_short": "새 인보이스",
  "wallet.ln.withdraw_title": "Lightning으로 출금",
  "wallet.ln.scan_invoice": "Lightning 인보이스 QR 코드 스캔",
  "wallet.ln.paid_from": "결제 출처",
  "wallet.ln.invoice": "인보이스",
  "wallet.ln.routing_reserve": "라우팅 예약분",
  "wallet.ln.reserved": "잔액에서 예약됨",
  "wallet.ln.paying": "결제하는 중…",
  "wallet.ln.get_quote": "견적 받기",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "백업",
  "wallet.backup.setup_failed": "백업을 설정하지 못했습니다",
  "wallet.backup.on": "백업 켜짐",
  "wallet.backup.on_body":
    "이제 그 열두 단어로 잔액을 다시 만들 수 있습니다.\n\n다른 사람에게 받은 것은 민트에서 새로 고치기 전까지 이 문구의 범위 밖에 있으며, 복구에는 민트 목록이 필요하므로 단어와 함께 적어 두세요.",
  "wallet.backup.no_phrase": "저장된 문구 없음",
  "wallet.backup.no_phrase_body":
    "기기 키체인에서 복구 문구를 읽지 못했습니다. 기기 잠금을 풀고 다시 시도하세요.",
  "wallet.backup.replace_title": "현재 문구를 교체할까요?",
  "wallet.backup.replace_body":
    "이미 복구 문구가 있습니다. 다른 문구를 복원하면 기존 것을 대체합니다. 예전 문구가 보장하던 코인은 이 기기에서 계속 쓸 수 있지만 복원 대상에서는 빠지므로, 계속하기 전에 예전 단어들을 적어 두었는지 확인하세요.",
  "wallet.backup.replace": "교체",
  "wallet.backup.invalid_phrase": "유효하지 않은 문구입니다",
  "wallet.backup.invalid_phrase_body":
    "문구에는 자체 검사값이 들어 있는데 이 문구는 통과하지 못했습니다. 잘못 입력했거나 빠졌거나 순서가 바뀐 단어가 없는지 확인하세요.",
  "wallet.backup.not_bip39":
    "BIP-39 단어가 아닙니다: {words}. 철자를 확인하세요.",
  "wallet.backup.add_mint_first": "먼저 민트를 추가하세요",
  "wallet.backup.add_mint_first_body":
    "복구는 민트에게 어떤 코인에 서명했는지 물어보는 방식이라, 어느 민트에 물어볼지 알아야 합니다. 사용하던 민트를 추가한 다음 복원하세요.",
  "wallet.backup.restore_failed": "복원 실패",
  "wallet.backup.phrase": "복구 문구",
  "wallet.backup.state_unconfirmed": "백업은 켜졌지만 확인되지 않음",
  "wallet.backup.state_off": "백업 꺼짐",
  "wallet.backup.badge_on": "켜짐",
  "wallet.backup.badge_unconfirmed": "미확인",
  "wallet.backup.badge_off": "꺼짐",
  "wallet.backup.view": "복구 문구 보기",
  "wallet.backup.setup": "복구 문구 설정",
  "wallet.backup.view_short": "문구 보기",
  "wallet.backup.setup_short": "설정",
  "wallet.backup.restore": "복구 문구로 지갑 복원",
  "wallet.backup.restore_short": "복원",
  "wallet.backup.setup_title": "복구 문구 설정",
  "wallet.backup.on_body_short":
    "열두 단어만 있으면 새 기기에서 잔액을 다시 만들 수 있습니다.",
  "wallet.backup.unconfirmed_body":
    "적어 둔 사본이 있다고 확인한 적이 없습니다. 지금 그 단어들은 이 휴대폰에만 있는데, 백업이란 바로 그 휴대폰이 사라져도 남아 있어야 하는 것입니다. 문구를 보고 적어 두세요.",
  "wallet.backup.not_covered":
    "{amount}이(가) 아직 보장되지 않습니다. 받은 코인은 보낸 사람의 비밀을 지니고 있어, 교환된 뒤에야 내 문구의 범위에 들어옵니다. 민트를 새로 고쳐 안전하게 만드세요.",
  "wallet.backup.off_body":
    "ecash는 이 휴대폰에만 있습니다. 잃어버리면 나를 포함해 누구도 그 돈을 되찾을 수 없습니다. 복구 문구는 어디서든 잔액을 다시 만들 수 있는 열두 단어입니다.",
  "wallet.backup.about_to_see":
    "이제 열두 단어를 보게 됩니다. 그 단어들이 곧 돈입니다.",
  "wallet.backup.exact_order":
    "열두 단어를 정확히 이 순서로. 이것을 가진 사람이 내 잔액을 가집니다.",
  "wallet.backup.verify_body":
    "아무도 적어 두지 않은 문구는 없느니만 못합니다. 있지도 않은 안전망처럼 보이기 때문입니다. 두 단어로 확인합니다.",
  "wallet.backup.verify_mismatch":
    "일치하지 않습니다. 적어 둔 사본을 확인하세요.",
  "wallet.backup.restore_body":
    "열두 단어를 입력하세요. Airhop이 코인을 다시 도출한 뒤 각 민트에게 어떤 코인에 서명했는지 물어, 민트가 보관한 기록에서 잔액을 되살립니다.",
  "wallet.backup.warn_secret":
    "이 단어를 읽는 사람은 누구나 내 잔액을 가져갈 수 있습니다. 화면을 캡처하지 말고 이 휴대폰에 저장하지 마세요.",
  "wallet.backup.warn_paper":
    "종이에 적어 안전한 곳에 보관하세요. 휴대폰이 사라지면 Airhop은 이 단어들을 다시 보여줄 수 없습니다.",
  "wallet.backup.warn_scope":
    "이 단어들은 ecash만 되살립니다. 신원과 채팅, 연락처는 보장 범위가 아닙니다.",
  "wallet.backup.warn_mints":
    "복구하려면 민트에게 어떤 코인에 서명했는지 물어야 하므로, 민트 목록을 단어와 함께 적어 두세요.",
  "wallet.backup.preparing": "준비하는 중…",
  "wallet.backup.show_phrase": "내 문구 보기",
  "wallet.backup.your_phrase": "내 복구 문구",
  "wallet.backup.write_down": "이것을 적어 두세요",
  "wallet.backup.copy_phrase": "복구 문구를 클립보드에 복사",
  "wallet.backup.copy_clipboard": "클립보드에 복사",
  "wallet.backup.written_down": "적어 두었습니다",
  "wallet.backup.check_copy": "사본을 확인하세요",
  "wallet.backup.confirm": "확인",
  "wallet.backup.restore_title": "문구로 복원",
  "wallet.backup.phrase_placeholder": "열두 단어, 공백으로 구분",
  "wallet.backup.no_mints_yet":
    "아직 추가된 민트가 없습니다. 복구는 특정 민트에게 물어야 하므로, 사용하던 민트를 먼저 추가하세요.",
  "wallet.backup.scanning": "검색하는 중…",
  "wallet.backup.restore_progress": "{mint} · 키셋 {total}개 중 {step}번째",
  "wallet.backup.will_scan":
    "검색 대상: {mints}. 추가하지 않은 민트에는 묻지 않으므로 그곳의 잔액은 보이지 않습니다.",
  "wallet.backup.word_n": "{position}번째 단어",
  "wallet.backup.unreachable_mints":
    "연결하지 못했습니다: {mints}. 그곳의 잔액은 그대로 남아 있습니다. 연결 상태가 나아지면 다시 시도하세요.",
  "wallet.backup.nothing_recovered": "검색한 민트에서 복구된 것이 없습니다.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "받은 것으로 표시할까요?",
  "wallet.delivered.body":
    "{amount} {unit}이(가) 영구히 풀립니다. 실제로 도착하지 않았다면 회수할 수 없게 됩니다.",
  "wallet.delivered.body_generic":
    "예약된 금액이 영구히 풀립니다. 실제로 도착하지 않았다면 회수할 수 없게 됩니다.",
  "wallet.delivered.cancel": "아직 아님",
  "wallet.delivered.confirm": "상대방이 받았습니다",
  "wallet.reclaim.title": "이 토큰을 회수할까요?",
  "wallet.reclaim.body":
    "{amount} {unit}이(가) 잔액으로 돌아옵니다. 토큰이 아무에게도 닿지 않은 경우에만 하세요. 상대가 이미 그 문자열을 가지고 있다면, 민트에서 먼저 교환하는 쪽이 돈을 갖게 되고 그것이 상대일 수 있습니다.",
  "wallet.reclaim.keep": "대기 상태로 두기",
  "wallet.reclaim.confirm": "회수",
  "wallet.copied.token_body":
    "토큰이 클립보드에 있습니다. 전달 완료로 표시하기 전까지는 여기 예약된 채로 남으므로, 첫 시도가 실패하면 다시 붙여넣을 수 있습니다.",
  "wallet.copied.phrase_body":
    "비밀번호 관리자에 붙여넣은 다음 클립보드를 비우세요. 다른 앱이 클립보드를 읽을 수 있고, 설정에 따라 다른 기기로 동기화되기도 합니다.",
  "wallet.refresh.failed": "새로 고치지 못했습니다",
  "wallet.refresh.partly": "일부만 새로 고쳐짐",
  "wallet.refresh.done": "새로 고쳤습니다",
  "wallet.refresh.unreachable":
    "{mints}에 연결하지 못했습니다. 나머지는 모두 최신 상태입니다.",
  "wallet.refresh.swapped":
    "{amount} {unit}을(를) 확인하고 새 증명으로 교환했습니다.",
  "wallet.refresh.secured":
    "이제 {amount} {unit}이(가) 복구 문구로 보장됩니다.",
  "wallet.refresh.all_confirmed":
    "여기 있는 것은 모두 이미 민트에서 확인된 상태였습니다.",
  "wallet.pending.title": "대기 중",
  "wallet.pending.reserved_desc":
    "생성해 예약했으며 전달은 확인되지 않았습니다. 이중 지출을 막기 위해 증명을 잔액에서 빼두었습니다.",
  "wallet.pending.locked_desc":
    "이미 받는 사람의 키에 잠겨 그들만 쓸 수 있습니다. 아직 그들에게 닿지 않았을 뿐입니다. 토큰을 공유해 마무리하세요.",
  "wallet.pending.show_qr": "이 토큰을 QR 코드로 표시",
  "wallet.pending.copy_again": "토큰 다시 복사",
  "wallet.pending.share_again": "토큰 다시 공유",
  "wallet.pending.mark_delivered": "이 토큰을 전달 완료로 표시",
  "wallet.pending.delivered": "전달됨",
  "wallet.pending.reclaim_into": "이 토큰을 잔액으로 회수",
  "wallet.activity.title": "활동",
  "wallet.activity.none": "아직 없음",
  "wallet.activity.none_desc":
    "보내고 받은 결제가 최신순으로 여기에 표시되며, 각각의 민트와 수수료도 함께 나옵니다.",
  "wallet.activity.show_fewer": "결제 적게 보기",
  "wallet.activity.show_less": "적게 보기",
  "wallet.activity.received_unconfirmed": "받음, 미확인",
  "wallet.activity.received": "받음",
  "wallet.activity.receive_failed": "받기 실패",
  "wallet.activity.reclaimed": "회수됨",
  "wallet.activity.send_failed": "보내기 실패",
  "wallet.activity.sent": "보냄",
  "wallet.activity.status_pending": "대기 중",
  "wallet.activity.status_failed": "실패",
  "wallet.activity.status_reclaimed": "회수됨",
  "wallet.activity.status_expired": "만료됨",
  "wallet.activity.ln_deposit": "Lightning 입금",
  "wallet.activity.ln_withdrawal": "Lightning 출금",
  "wallet.activity.nutzap_received": "Nutzap 받음",
  "wallet.activity.spent_removed": "사용된 증명 제거됨",
  "wallet.activity.refreshed": "증명을 새로 고침",
  "wallet.activity.refreshing": "증명을 새로 고치는 중",
  "wallet.activity.just_now": "방금",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "메시 오프라인",
  "wallet.mesh_offline_body":
    "메시 서비스가 실행 중이 아니라 토큰을 건넬 곳이 없습니다. 대기 중 항목에 예약된 채로 남습니다.",
  "wallet.xfer.route_mesh": "메시를 통해 상대 기기에 곧바로 전달했습니다.",
  "wallet.xfer.route_nostr":
    "상대가 블루투스 범위 밖에 있어 인터넷으로 보냈습니다.",
  "wallet.xfer.route_courier":
    "지금은 상대에게 갈 경로가 없습니다. 다른 기기들이 실어 나르다가 누군가 닿으면 전달합니다.",
  "wallet.xfer.route_queued":
    "아직 상대에게 닿을 수 없습니다. 대기열에 넣어 두었다가 닿는 즉시 보냅니다.",
  "wallet.xfer.mesh_offline_body":
    "메시 서비스가 실행 중이 아니라 토큰을 건넬 방법이 없습니다. 차감된 것은 없습니다.",
  "wallet.xfer.could_not_send": "보내지 못했습니다",
  "wallet.xfer.inexact_body":
    "보유한 증명으로는 오프라인에서 정확히 {amount} {unit}을(를) 만들 수 없습니다. 만들 수 있는 가장 작은 토큰은 {spend} {unit}이며, 초과분 {extra} {unit}은(는) 되찾을 방법 없이 상대에게 갑니다.\n\n온라인 상태에서 민트에서 새로 고치면 증명이 이 금액에 딱 맞는 단위로 나뉩니다.",
  "wallet.xfer.send_amount": "{amount} 보내기",
  "wallet.xfer.mesh_offline": "메시 오프라인",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "상대의 키에 잠겨 Nostr에 게시되었습니다. 상대가 온라인이든 아니든 그들의 것입니다.",
  "wallet.pay.rail_nutzap_dm":
    "상대의 키에 잠겼습니다. 릴레이가 받아주지 않아 메시지 형태로 전달되었습니다.",
  "wallet.pay.rail_nutzap_undelivered":
    "상대의 키에 잠겼지만 아직 실어 나를 경로가 없습니다. 대기열에 있으며 토큰은 대기 중 항목에 있습니다.",
  "wallet.pay.final":
    "잠긴 결제는 회수할 수 없습니다. 이제 이 코인들은 상대의 키로만 쓸 수 있습니다.",
  "wallet.pay.reclaimable":
    "도착했음을 확인하기 전까지는 지갑 탭에서 회수할 수 있습니다.",
  "wallet.pay.why": "{reason} 때문에 이 방법으로 보냈습니다.",
  "wallet.pay.sent_title": "{name}에게 {amount} {unit}",
  "wallet.pay.thread_receipt":
    "{amount} {unit}을(를) 상대의 키에 잠가 보냈습니다.",
  "wallet.pay.title": "ecash 보내기",
  "wallet.pay.to": "받는 사람: {name}",
  "wallet.pay.amount": "sats 단위 금액",
  "wallet.pay.memo": "메모 (선택 사항, 공개됨)",
  "wallet.pay.send": "보내기",
  "wallet.pay.sending": "보내는 중…",
  "wallet.pay.action": "ecash 보내기",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "카메라 접근",
  "wallet.scan.camera_purpose": "ecash QR 코드를 스캔하기",
  "wallet.scan.photo_label": "사진 접근",
  "wallet.scan.photo_purpose": "이미지에서 ecash QR을 읽기",
  "wallet.scan.no_token": "그 이미지에서 ecash 토큰을 찾지 못했습니다.",
  "wallet.scan.no_invoice":
    "그 이미지에서 Lightning 인보이스를 찾지 못했습니다.",
  "wallet.scan.unreadable": "그 이미지를 읽지 못했습니다.",
  "wallet.scan.camera_failed":
    "카메라를 시작하지 못했습니다. 다른 카메라 앱을 닫고 다시 시도하세요.",
  "wallet.scan.close": "스캐너 닫기",
  "wallet.scan.on_device": "이 기기에서 읽으며, 어디로도 전송되지 않습니다.",
  "wallet.scan.aim_token": "ecash QR 코드를 비추세요.",
  "wallet.scan.aim_invoice": "Lightning 인보이스 QR 코드를 비추세요.",
  "wallet.scan.title_token": "ecash 스캔",
  "wallet.scan.title_invoice": "인보이스 스캔",
  "wallet.scan.desc_token":
    "다른 지갑의 Cashu 토큰을 읽습니다. Airhop뿐 아니라 모든 Cashu 지갑과 함께 작동합니다.",
  "wallet.scan.desc_invoice": "잔액으로 결제할 Lightning 인보이스를 읽습니다.",
  "wallet.scan.use_camera_a11y": "카메라로 스캔",
  "wallet.scan.use_camera": "카메라 사용",
  "wallet.scan.pick_image_a11y": "저장된 이미지에서 QR 코드 읽기",
  "wallet.scan.pick_image": "사진에서 선택",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu란?",
  "wallet.explain.intro":
    "Cashu는 Bitcoin을 위한 ecash입니다. 토큰은 가진 사람에게 돈이 되는 문자열이며, 민트가 눈을 가린 채 서명하므로 누가 무엇을 썼는지 민트도 알 수 없습니다. 계정도 로그인도 없습니다.",
  "wallet.explain.send": "보내기",
  "wallet.explain.send_desc":
    "금액을 토큰으로 바꿔 블루투스로 근처 피어에게 건네거나 텍스트로 공유할 수 있게 합니다. 인터넷 없이 작동합니다. 도착을 확인하기 전까지 증명은 예약된 채로 남습니다.",
  "wallet.explain.receive": "받기",
  "wallet.explain.receive_desc":
    "토큰을 붙여넣어 추가합니다. 온라인이면 민트에서 즉시 교환되어 증명 가능하게 내 것이 됩니다. 오프라인이면 저장되고 새로 고칠 때까지 미확인으로 표시됩니다.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Nostr 신원에게 지급합니다. 상대가 NIP-61 nutzap 정보를 게시했다면 ecash가 상대의 키에 잠겨 그들만 쓸 수 있습니다. 그렇지 않으면 암호화된 DM으로 대체됩니다. 인터넷이 필요합니다.",
  "wallet.explain.add_mint": "민트 추가",
  "wallet.explain.add_mint_desc":
    "ecash를 발행하고 교환하는 민트를 저장하고, 공개 키를 캐시해 그 민트의 토큰을 오프라인에서 검증할 수 있게 합니다. 거기 둘 잔액을 맡길 만큼 신뢰하는 민트를 고르세요.",
  "wallet.explain.phrase": "복구 문구",
  "wallet.explain.phrase_desc":
    "코인은 지갑이 처음에 만든 열두 단어에서 도출되므로, 새 휴대폰에서도 민트에게 어떤 코인에 서명했는지 물어 잔액을 되살릴 수 있습니다. 문구를 보고 적어 두기 전까지 그 단어들은 이 휴대폰에만 있습니다.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "지갑 잠김",
  "wallet.err.mint_unreachable": "민트에 연결할 수 없음",
  "wallet.err.tor_blocked": "Tor가 켜져 있어 차단됨",
  "wallet.err.insufficient": "잔액 부족",
  "wallet.err.exact_amount": "그 금액을 정확히 보낼 수 없음",
  "wallet.err.no_mint": "민트 없음",
  "wallet.err.mint_unsupported": "민트가 지원하지 않음",
  "wallet.err.mint_refused": "민트가 거부함",
  "wallet.err.unreadable": "읽을 수 없는 토큰",
  "wallet.err.rejected": "토큰 거부됨",
  "wallet.err.already_spent": "이미 사용됨",
  "wallet.err.change_pending": "결제됨, 거스름돈 대기 중",
  "wallet.svc.mint_unreachable": "민트에 연결하지 못했습니다.",
  "wallet.svc.tor_ios": "iOS에서는 민트 요청이 Tor를 거치지 않습니다.",
  "wallet.svc.tor_ios_body":
    "Arti는 Nostr WebSocket만 감싸므로, 이 요청은 일반 네트워크로 민트에 닿아 IP와 이 증명들을 연결하게 됩니다. 설정 > 보안에서 허용하거나 Tor를 먼저 끄세요. 메시를 통한 ecash 송수신은 계속 작동합니다.",
  "wallet.svc.keys_uncached":
    "이 민트의 키가 이 기기에 캐시되어 있지 않습니다.",
  "wallet.svc.keys_uncached_body":
    "키를 가져오려면 온라인 상태에서 지갑을 한 번 여세요.",
  "wallet.svc.phrase_invalid": "그 복구 문구는 유효하지 않습니다.",
  "wallet.svc.phrase_invalid_body":
    "잘못 입력했거나 빠진 단어가 없는지 확인하세요. 문구에는 자체 검사값이 있어 단어 하나만 틀려도 전체가 무효가 됩니다.",
  "wallet.svc.need_mint": "먼저 민트를 하나 이상 추가하세요.",
  "wallet.svc.need_mint_body":
    "복구는 민트에게 어떤 코인에 서명했는지 물어보는 방식이라, 어느 민트에 물어볼지 알아야 합니다.",
  "wallet.svc.restored": "복구 문구로 복원했습니다",
  "wallet.svc.storage_locked": "지갑 저장소가 잠겨 있습니다.",
  "wallet.svc.storage_locked_body":
    "Airhop은 ecash 증명을 기기 키체인에 키가 있는 암호화된 파일에 보관합니다. 기기 잠금을 풀고 앱을 다시 여세요.",
  "wallet.svc.bad_url": "유효한 URL이 아닙니다.",
  "wallet.svc.needs_https": "민트 URL은 https://로 시작해야 합니다.",
  "wallet.svc.refuse_http": "일반 http로 민트를 사용하는 것을 거부합니다.",
  "wallet.svc.refuse_http_body":
    "네트워크 경로에 있는 누구든 증명을 읽거나 바꿀 수 있습니다. https:// 민트를 사용하세요.",
  "wallet.svc.mint_not_saved": "민트를 저장하지 못했습니다.",
  "wallet.svc.unreadable_token": "읽을 수 있는 Cashu 토큰이 아닙니다.",
  "wallet.svc.unreadable_token_body":
    "토큰은 cashuA 또는 cashuB로 시작합니다. 복사할 때 잘린 부분이 없는지 확인하세요.",
  "wallet.svc.wrong_mint":
    "이 토큰은 스스로 지목한 민트가 서명한 것이 아닙니다.",
  "wallet.svc.already_spent": "이 증명들은 이미 사용되었습니다.",
  "wallet.svc.already_spent_body":
    "이 토큰을 보낸 사람이 먼저 교환했거나, 같은 토큰을 다른 사람에게도 보냈습니다.",
  "wallet.svc.receiving_offline": "오프라인으로 받는 중",
  "wallet.svc.amount_positive": "0보다 큰 금액을 입력하세요.",
  "wallet.svc.coins_raced": "그 코인들은 방금 다른 결제에 사용되었습니다.",
  "wallet.svc.coins_raced_body":
    "차감된 것은 없습니다. 다시 시도하면 지갑이 다른 조합을 고릅니다.",
  "wallet.svc.no_ecash": "아직 ecash가 없습니다.",
  "wallet.svc.no_ecash_body":
    "민트를 추가하고 Lightning으로 입금하거나, 누군가에게 토큰을 받으세요.",
  "wallet.svc.split_across_mints": "잔액이 여러 민트에 나뉘어 있습니다.",
  "wallet.svc.mint_says_spent":
    "민트가 이 증명들을 이미 사용된 것으로 보고했습니다.",
  "wallet.svc.issue_against_invoice": "Lightning 인보이스를 근거로 ecash 발행",
  "wallet.svc.pay_invoice": "Lightning 인보이스 결제",
  "wallet.svc.unknown_deposit": "알 수 없는 입금입니다.",
  "wallet.svc.invoice_expired_before":
    "결제되기 전에 인보이스가 만료되었습니다.",
  "wallet.svc.invoice_expired": "그 인보이스는 만료되었습니다.",
  "wallet.svc.invoice_unpaid": "인보이스가 아직 결제되지 않았습니다.",
  "wallet.svc.payment_unknown":
    "결제 상태를 알 수 없습니다. 다음 새로 고침에서 다시 확인합니다.",
  "wallet.svc.melt_change_pending": "인보이스가 결제되었습니다.",
  "wallet.svc.melt_change_pending_body":
    "민트가 쓰이지 않은 라우팅 수수료를 아직 돌려주지 않았습니다. 다음 새로 고침에서 자동으로 회수하며, 그동안 잃는 것은 없습니다.",
  "wallet.svc.mint_did_not_pay":
    "민트가 이 인보이스를 결제하지 않았습니다. 잔액은 그대로입니다.",
  "wallet.svc.not_an_invoice": "Lightning 인보이스가 아닙니다.",
  "wallet.svc.not_an_invoice_body":
    "lnbc로 시작하는 bolt11 인보이스를 붙여넣으세요.",
  "wallet.svc.insufficient_for_invoice":
    "이 인보이스를 결제하기에 잔액이 부족합니다.",
  "wallet.svc.coins_raced_invoice_body":
    "차감된 것도 없고 인보이스도 결제되지 않았습니다. 다시 시도하세요.",
  "wallet.svc.same_mint": "다른 대상 민트를 고르세요.",
  "wallet.svc.same_mint_body":
    "출발지와 대상이 같은 민트라 옮길 것이 없습니다.",
  "wallet.svc.quote_failed_retried": "견적 실패, 통합을 다시 시도함",
  "wallet.svc.amount_unfit_retried": "금액이 맞지 않아 통합을 다시 시도함",
  "wallet.svc.cannot_size": "이 이체 금액을 산정하지 못했습니다.",
  "wallet.svc.insufficient_at_mint": "{mint}의 잔액이 부족합니다.",
  "wallet.svc.inexact_title":
    "보유한 증명으로는 오프라인에서 정확히 {amount} {unit}을(를) 만들 수 없습니다.",
  "wallet.svc.inexact_detail":
    "보낼 수 있는 가장 작은 토큰은 {spend} {unit}입니다. 오프라인에서는 거스름돈이 없으므로 초과분 {extra} {unit}은(는) 받는 사람에게 갑니다.",
  "wallet.svc.no_single_mint":
    "{amount} {unit}을(를) 보유한 단일 민트가 없습니다. 서로 다른 민트의 ecash는 하나의 토큰으로 합칠 수 없으니, 먼저 한 민트로 통합하거나 나누어 보내세요.",
  "wallet.svc.have_tried_send":
    "{total} {unit}을(를) 보유한 상태에서 {amount}을(를) 보내려 했습니다.",
  "wallet.svc.invoice_needs":
    "이 인보이스는 라우팅 예약분을 포함해 {total} {unit}이 필요한데, 보유액은 {balance}입니다.",
  "wallet.svc.nothing_to_move": "{mint}에는 옮길 {unit}이(가) 없습니다.",
  "wallet.svc.consolidate_memo": "{mint}에서 통합",
  "wallet.svc.cannot_size_detail":
    "Lightning 라우팅 수수료를 제하고 나면 {from}에서 {to}(으)로 의미 있는 금액을 옮길 수 없습니다. 대신 더 작은 금액을 지정해 옮겨 보세요.",
  "wallet.svc.mint_cannot": "{mint}은(는) {action}을(를) 할 수 없습니다.",
  "wallet.svc.no_nut": "민트가 NUT-{nut}을(를) 지원한다고 알리지 않습니다.",
  "wallet.svc.unknown_mint": "그 결제는 사용하지 않는 민트를 지목합니다.",
  "wallet.svc.unknown_mint_body":
    "신뢰한다면 그 민트를 직접 먼저 추가하세요. 선택하지 않은 민트에서는 아무것도 교환하지 않습니다.",
  "wallet.svc.no_relay": "릴레이 연결 없음",
  "wallet.svc.no_shared_mint": "잔액이 충분한 공통 민트 없음",
  "wallet.svc.no_nutzap_info":
    "받는 사람이 nutzap 정보를 게시하지 않음 (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "상대의 키에 잠겼지만 아직 전달되지 않았습니다. 이 거래의 토큰을 공유해 마무리하세요.",
  "wallet.svc.swap_lost":
    "민트가 이 교환을 끝내지 않아 그에 대해 발행된 것이 없습니다.",
  "wallet.svc.swap_unreadable":
    "이 교환은 이 버전이 다시 처리할 수 없는 형식으로 저장되었습니다.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR로 확인됨",
  "contacts.qr.keys_unverified": "키를 받았으나 확인되지 않음",
  "contacts.qr.not_verified": "아직 확인되지 않음",
  "contacts.qr.message": "메시지",
  "contacts.qr.add": "연락처 추가",
  "contacts.qr.scan_title": "QR 코드 스캔",
  "contacts.qr.aim": "상대방의 QR 코드에 카메라를 맞추세요",
  "contacts.qr.add_desc": "메시에서 근처에 없는 사람에게 연결합니다.",
  "contacts.qr.peer_id_hint":
    "피어 ID는 16자입니다. 연락처 코드는 airhop:으로 시작합니다.",
  "contacts.qr.or_scan": "또는 상대방의 QR을 스캔하세요",
  "contacts.qr.trust_note":
    "카메라로 직접 스캔한 QR만 상대방의 키를 확인해 줍니다. 붙여넣은 코드는 키를 담고 있을 뿐, 그 사람에게서 왔다는 증거는 되지 않습니다.",
  "contacts.qr.peer_id": "피어 ID 또는 연락처 코드",
  "contacts.qr.peer_id_placeholder": "ID 또는 연락처 코드를 붙여넣으세요",
  "contacts.qr.scan_camera_a11y": "카메라로 QR 코드 스캔",
  "contacts.qr.scan_camera_desc": "카메라 사용",
  "contacts.qr.upload_a11y": "갤러리에서 QR 이미지 업로드",
  "contacts.qr.upload": "갤러리에서 업로드",
  "contacts.qr.upload_desc": "저장된 QR 이미지 선택",
  "contacts.qr.scan_a11y": "QR 코드를 스캔해 연락처 추가",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "16자 피어 ID, airhop://peer/… 링크, 또는 연락처 코드를 붙여넣으세요.",
  "contacts.scan.camera_label": "카메라 접근",
  "contacts.scan.camera_purpose": "연락처의 QR 코드를 스캔하기",
  "contacts.scan.camera_needed":
    "스캔하려면 카메라 접근이 필요합니다. 피어 ID로도 추가할 수 있습니다.",
  "contacts.scan.camera_failed":
    "카메라를 시작하지 못했습니다. 다른 카메라 앱을 닫고 다시 시도하세요.",
  "contacts.scan.photo_label": "사진 접근",
  "contacts.scan.photo_purpose": "저장해 둔 QR 코드를 스캔하기",
  "contacts.scan.photo_needed":
    "이미지를 선택하려면 사진 접근이 필요합니다. 피어 ID로도 추가할 수 있습니다.",
  "contacts.scan.no_qr": "그 이미지에서 Airhop QR 코드를 찾지 못했습니다.",
  "contacts.scan.unreadable": "그 이미지에서 QR 코드를 읽지 못했습니다.",
  "contacts.scan.bitchat_expired":
    "그 bitchat 코드는 만료되었습니다. 상대방에게 QR을 다시 열어달라고 하세요.",
  "contacts.scan.tampered":
    "이 QR 코드는 유효하지 않습니다. 피어 ID가 키와 일치하지 않습니다. 변조되었을 수 있습니다.",
  "contacts.scan.already_added": "이미 연락처에 있습니다",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "카메라 접근을 기다리는 중…",
  "contacts.verify.camera_off": "카메라가 꺼져 있습니다",
  "contacts.verify.open_settings": "설정 열기",
  "contacts.verify.verified": "확인됨",
  "contacts.verify.different": "다른 연락처",
  "contacts.verify.scan_again": "다시 스캔",
  "contacts.verify.failed": "확인하지 못했습니다",
  "contacts.verify.done": "완료",
  "contacts.verify.title": "{name} 확인",
  "contacts.verify.aim": "상대방의 QR 코드에 카메라를 맞추세요",
  "contacts.verify.camera_off_body":
    "QR로 확인하려면 설정에서 카메라 접근을 켜세요.",
  "contacts.verify.match_body":
    "{name}의 키가 일치합니다. 이 연락처를 신뢰할 수 있습니다.",
  "contacts.verify.different_body":
    "이 QR은 다른 사람의 것입니다. {name}에게 본인 코드를 보여달라고 하세요.",
  "contacts.verify.tampered_body":
    "이 QR은 변조된 것으로 보입니다. ID가 키와 일치하지 않습니다.",
  "contacts.verify.choose_title": "어떤 방법으로 확인하시겠습니까?",
  "contacts.verify.choose_body":
    "두 방법 모두 이 휴대폰에 있는 키가 정말 {name}의 것인지 확인해 줍니다.",
  "contacts.verify.method_scan": "상대방 코드 스캔",
  "contacts.verify.method_scan_sub": "지금 함께 있는 경우",
  "contacts.verify.method_compare": "코드 대조",
  "contacts.verify.method_compare_sub": "통화하면서 서로 읽어주기",
  "contacts.verify.no_keys":
    "이 연락처의 키가 아직 없습니다. 메시지를 보내거나, 만났을 때 코드를 스캔하세요.",
  "contacts.verify.compare_title": "서로에게 읽어주세요",
  "contacts.verify.compare_body":
    "{name}에게도 같은 여섯 단어가 보입니다. 일치한다면 두 사람 모두 키가 진짜임을 알 수 있습니다.",
  "contacts.verify.codes_match": "일치합니다",
  "contacts.verify.codes_differ": "일치하지 않습니다",
  "contacts.verify.compared_body":
    "{name}과(와) 같은 코드를 확인했습니다. 이 연락처는 확인되었습니다.",

  // ---- Settings: shared chrome ----
  "settings.back": "뒤로 가기",
  "settings.coming_soon": "곧 제공",
  "settings.opens_externally": "{label}, 앱 외부에서 열림",
  "settings.peer_id": "피어 ID",
  "settings.share_peer_id": "내 피어 ID 공유",
  "settings.share_id_short": "ID 공유",
  "settings.peer_id_sheet.title": "내 피어 ID",
  "settings.peer_id_sheet.copy": "피어 ID 복사",
  "settings.peer_id_sheet.note":
    "이 방법은 두 사람이 모두 블루투스 범위 안에 있을 때만 작동합니다. 어디서든 메시지를 받으려면 QR 코드를 공유하세요.",

  // ---- Settings: hub rows ----
  "settings.section.general": "일반",
  "settings.section.general_desc": "선택 기능, 보내기 취소, 미디어, 초기화",
  "settings.section.privacy": "개인정보 및 보안",
  "settings.section.privacy_desc": "순방향 비밀성, 서명된 패킷, 차단된 피어",
  "settings.section.network": "네트워크 및 릴레이",
  "settings.section.network_desc":
    "인터넷 대체 경로, nostr 릴레이, bitchat 호환성",
  "settings.section.permissions": "권한",
  "settings.section.permissions_desc": "블루투스, 위치, 알림, 카메라, 마이크",
  "settings.section.storage": "저장 공간 및 데이터",
  "settings.section.diagnostics": "진단",

  // ---- Settings: group headings ----
  "settings.group.transports": "전송 방식",
  "settings.group.internet": "인터넷",
  "settings.group.nearby": "근처",
  "settings.group.sync": "동기화",
  "settings.group.features": "기능",
  "settings.group.messages": "메시지",
  "settings.group.local": "로컬",
  "settings.group.media": "미디어",
  "settings.group.reset": "초기화",
  "settings.group.always_on": "항상 켜짐",
  "settings.group.notifications": "알림",
  "settings.group.blocked": "차단됨",
  "settings.group.theme": "테마",
  "settings.group.font": "글꼴",
  "settings.group.language": "언어",
  "settings.section.diagnostics_desc": "연결 상태와 근처 기기",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "블루투스 링크",
  "settings.diag.ble_links_desc": "이 휴대폰이 직접 연결된 기기",
  "settings.diag.lan": "로컬 네트워크",
  "settings.diag.lan_desc": "같은 Wi-Fi에 연결된 휴대폰",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "공유기 없이 휴대폰 대 휴대폰",
  "settings.diag.wifi_active": "실행 중",
  "settings.diag.wifi_unsupported": "이 기기에서 지원되지 않음",
  "settings.diag.wifi_permission": "권한으로 차단됨",
  "settings.diag.wifi_unavailable": "지금은 사용할 수 없음",
  "settings.diag.wifi_unpaired": "페어링된 기기 없음",
  "settings.diag.wifi_unknown": "무선 장치를 기다리는 중",
  "settings.diag.relays": "Nostr 릴레이",
  "settings.diag.relays_desc": "위치 채널과 인터넷 도달에 사용됩니다",
  "settings.diag.connected": "연결됨",
  "settings.diag.disconnected": "연결되지 않음",
  "settings.diag.peer_direct": "직접 링크",
  "settings.diag.peer_relayed": "다른 기기를 통해 들음",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "신호 측정값 없음",
  "settings.diag.no_peers": "범위 내에 아무도 없음",
  "settings.diag.no_peers_desc": "무선 링크 {links}개 열림",
  "settings.diag.gcs_size": "필터 크기",
  "settings.diag.gcs_size_desc": "전파에 실어 보낸 가장 큰 동기화 필터",
  "settings.diag.fpr": "거짓 양성 비율",
  "settings.diag.fpr_desc": "우리에게 없는 패킷을 있다고 필터가 주장하는 빈도",
  "settings.diag.bytes": "{n} 바이트",
  "settings.diag.footnote":
    "여기서는 아무것도 바꿀 수 없습니다. Airhop이 bitchat과 계속 호환되도록 이 값들은 고정되어 있습니다.",
  "settings.section.storage_desc": "사용량과 캐시",
  "settings.section.appearance": "화면",
  "settings.section.appearance_desc": "테마, 글꼴, 언어",
  "settings.section.help": "도움말 및 의견",
  "settings.section.help_desc": "문의하기, 버그 신고, 자주 묻는 질문 읽기",
  "settings.section.support": "후원",
  "settings.section.support_desc": "개발이 계속되도록 도와주세요",
  "settings.section.about": "정보",
  "settings.section.about_desc": "버전, 변경 내역, 소스",

  // ---- Settings: general ----
  "settings.general.undo": "보내기 취소",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "지갑",
  "settings.general.undo_seconds": "{count}초",
  "settings.general.undo_a11y": "보내기 취소: {value}",
  "settings.general.quality_a11y": "업로드 품질을 {value}(으)로 설정",
  "settings.general.undo_desc":
    "보낸 메시지를 잠시 붙잡아 두어 나가기 전에 되돌릴 수 있게 합니다",
  "settings.general.undo_off_desc": "바로 보내고 취소하지 않음",
  "settings.general.undo_2": "2초",
  "settings.general.undo_2_desc": "되돌릴 짧은 기회",
  "settings.general.undo_10": "10초",
  "settings.general.undo_10_desc": "가장 긴 시간",
  "settings.general.quality": "업로드 품질",
  "settings.general.quality_desc":
    "카메라나 라이브러리에서 보내는 사진에 적용됩니다. 어느 쪽이든 모든 사진은 메시에 맞게 조정됩니다.",
  "settings.general.quality_low": "낮음",
  "settings.general.quality_low_desc": "가장 작은 사진, 가장 빠른 전송",
  "settings.general.quality_medium": "보통",
  "settings.general.quality_medium_desc": "세부 묘사와 속도의 균형",
  "settings.general.quality_high": "높음",
  "settings.general.quality_high_desc": "세부 묘사를 가장 많이 유지",
  "settings.general.feature_wallet_desc":
    "메시를 통해 개인 간에 Cashu ecash 보내기",
  "settings.general.feature_wallet_a11y": "지갑 (항상 켜짐)",
  "settings.general.feature_ai_desc":
    "기기 안에서 동작하는 비공개 어시스턴트, 네트워크 호출 없음",
  "settings.general.feature_feeds": "피드",
  "settings.general.feature_feeds_desc":
    "Bluesky와 Mastodon 피드를 읽고 게시하기",
  "settings.general.show_media": "미디어 자동 표시",
  "settings.general.show_media_desc":
    "사진과 동영상을 채팅에 바로 표시하거나, 탭해야 보이게 둡니다",
  "settings.general.reset": "설정 초기화",
  "settings.general.media_retention": "미디어 보관 기간",
  "settings.general.media_retention_desc":
    "선택한 기간이 지나면 사진, 동영상, 음성 메모가 삭제됩니다",
  "settings.general.media_retention_sheet":
    "미디어를 이 기기에 얼마나 둘지 선택하세요. 삭제된 미디어는 복구할 수 없습니다.",
  "settings.general.retention_7_desc":
    "남는 흔적이 가장 적습니다. 휴대폰 자체가 위험 요소일 때 가장 좋습니다.",
  "settings.general.retention_14_desc":
    "신호가 닿지 않는 곳에서 한두 주를 보낼 때의 절충안입니다.",
  "settings.general.retention_30_desc":
    "대화를 가장 오래 읽을 수 있게 해주며, 저장 공간도 가장 많이 씁니다.",
  "settings.general.reset_desc":
    "신원, 메시지, 연락처, 지갑은 그대로 둔 채 모든 환경설정을 기본값으로 되돌립니다",
  "settings.general.reset_title": "설정을 초기화할까요?",
  "settings.general.reset_body":
    "화면, 보내기 취소, 연결(인터넷, Tor, 게이트웨이, 브리지, 릴레이) 등 모든 환경설정이 기본값으로 돌아갑니다. 신원, 메시지, 연락처, 지갑은 그대로 유지됩니다.",
  "settings.general.reset_confirm": "초기화",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "순방향 비밀성",
  "settings.security.forward_secrecy_desc":
    "다이렉트 메시지에는 Double Ratchet이 항상 적용됩니다",
  "settings.security.signed_packets": "서명된 패킷",
  "settings.security.signed_packets_desc": "모든 패킷은 Ed25519로 서명됩니다",
  "settings.security.hide_previews": "알림 미리보기 숨기기",
  "settings.security.hide_previews_desc":
    "잠금 화면은 잠금을 풀지 않아도 내용을 보여주므로, 보낸 사람과 메시지를 거기에 띄우지 않습니다",
  "settings.security.no_blocked": "차단된 피어 없음",
  "settings.security.no_blocked_desc":
    "차단된 피어는 메시지를 보낼 수 없고 메시 탭에도 나타나지 않습니다",
  "settings.security.unblock_title": "이 피어 차단 해제",
  "settings.security.unblock": "차단 해제",
  "settings.security.unblock_peer": "{name} 차단 해제",
  "settings.security.unblock_body":
    "{name}이(가) 다시 메시지를 보낼 수 있게 되며, 근처에 있으면 메시 탭에 다시 나타납니다.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "인터넷 대체 경로",
  "settings.network.internet_desc":
    "메시 피어가 범위를 벗어나면 Nostr 릴레이로 계속 이어갑니다",
  "settings.network.internet_off_title": "인터넷을 끌까요?",
  "settings.network.internet_off_body":
    "Airhop이 블루투스로만 작동합니다. Nostr 릴레이와의 연결을 모두 중단하고, Tor와 인터넷 게이트웨이, 메시 브리지가 모두 꺼집니다. 근처 블루투스 채팅은 계속 작동합니다.",
  "settings.network.turn_off": "끄기",
  "settings.network.discovery": "지오 릴레이 탐색",
  "settings.network.discovery_desc":
    "300곳이 넘는 분산 릴레이 중에서 위치 셀에 가장 가까운 릴레이를 자동으로 선택합니다",
  "settings.network.discovery_needs_relay": "먼저 사용자 릴레이를 추가하세요",
  "settings.network.discovery_needs_relay_body":
    "자동 탐색이 Airhop을 가장 가까운 릴레이로 안내합니다. 이를 끄는 것은 아래에 직접 릴레이를 지정한 뒤에야 의미가 있으니, 먼저 하나 이상 추가하세요.",
  "settings.network.custom_only_title": "사용자 릴레이만 사용할까요?",
  "settings.network.custom_only_body":
    "위치 채널과 메시 브리지가 가장 가까운 릴레이를 자동으로 고르지 않고, 추가한 릴레이만 사용합니다. 도달 범위가 줄어들 수 있고, 가장 가까운 릴레이로 모이는 bitchat 사용자들을 만나지 못하게 될 수 있습니다.",
  "settings.network.custom": "사용자 릴레이",
  "settings.network.custom_desc":
    "위치 채널과 메시 브리지에 쓸 릴레이를 직접 추가하세요",
  "settings.network.custom_added": "{max}개 중 {count}개 추가됨",
  "settings.network.dm_relays": "메시지 릴레이",
  "settings.network.dm_relays_desc":
    "다이렉트 메시지와 비공개 채널은 항상 이 릴레이를 사용합니다. 사용자 릴레이는 이를 바꾸지 않습니다.",
  "settings.network.discovery_back_on": "지오 릴레이 탐색이 다시 켜짐",
  "settings.network.discovery_back_on_body":
    "그것이 마지막 사용자 릴레이였습니다. 위치 채널은 게시할 곳이 필요하므로 Airhop이 다시 가장 가까운 릴레이를 자동으로 고릅니다.",
  "settings.network.add_relay": "릴레이 추가",
  "settings.network.remove_relay": "{url} 제거",
  "settings.network.add_short": "추가",
  "settings.network.relay_limit":
    "릴레이는 {count}개까지 추가할 수 있습니다. 하나를 제거해야 다른 것을 추가할 수 있습니다.",
  "settings.network.relay_duplicate": "그 릴레이는 이미 목록에 있습니다.",
  "settings.network.relay_invalid":
    "relay.example.com 같은 올바른 릴레이 호스트를 입력하세요. 포트는 릴레이가 기본값을 쓰지 않을 때만 필요합니다. IP 주소와 로컬 이름은 허용되지 않습니다.",
  "settings.network.lan": "로컬 네트워크",
  "settings.network.lan_desc":
    "같은 WiFi에 있는 사람에게 연결합니다. iPhone과 Android 사이에서도 됩니다. 네트워크의 다른 기기는 당신이 Airhop을 쓰고 있다는 것을 볼 수 있습니다.",
  "settings.network.lan_searching": "이 네트워크에 Airhop 기기가 없습니다",
  "settings.network.lan_active": "이 네트워크에서 연결됨",
  "settings.network.lan_unavailable": "WiFi 네트워크에 있지 않습니다",
  "settings.network.lan_permission":
    "Airhop의 로컬 네트워크 접근이 꺼져 있습니다",
  "settings.network.lan_unsupported": "이 기기에서는 사용할 수 없습니다",
  "settings.network.lan_foreground":
    "Airhop이 백그라운드로 가면 멈춥니다. 블루투스는 계속 작동합니다.",
  "settings.network.wifi_pair": "페어링",
  "settings.network.wifi_paired": "페어링된 기기",
  "settings.network.wifi_pair_find": "기기 찾기",
  "settings.network.wifi_pair_find_desc":
    "자신을 표시하고 있는 근처 iPhone 찾기. 두 기기 모두 iOS 26 이상이 필요합니다.",
  "settings.network.wifi_pair_show": "이 iPhone 표시",
  "settings.network.wifi_pair_show_desc":
    "근처 iPhone이 이 기기를 찾도록 합니다. 한 사람은 찾고 다른 사람은 표시하며, 동시에 진행합니다.",
  "settings.network.wifi_pair_find_action": "근처 iPhone 선택",
  "settings.network.wifi_pair_show_action": "이 iPhone을 검색 가능하게 하기",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware를 지금은 사용할 수 없습니다",
  "settings.network.wifi_pair_forget": "Settings 앱에서 페어링 제거",
  "settings.network.bitchat": "bitchat 호환성",
  "settings.network.bitchat_desc":
    "bitchat과 동일한 BLE 메시로 완전히 상호 운용됩니다. 항상 켜져 있으며 끌 수 없습니다.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "백그라운드에서 실행",
  "settings.conn.background_desc":
    "Airhop이 닫혀 있어도 메시를 계속 실행합니다",
  "settings.conn.background_on_title": "메시를 계속 실행할까요?",
  "settings.conn.background_on_body":
    "Airhop이 닫혀 있어도 계속 중계하고 수신하므로 자리를 비운 동안에도 메시지가 도착합니다. 그동안 Android는 진행 중 알림을 표시합니다.",
  "settings.conn.background_off_title": "Airhop을 닫으면 메시를 중단할까요?",
  "settings.conn.background_off_body":
    "Airhop이 열려 있을 때만 메시지가 도착하며, 이 휴대폰은 근처 사람들을 위한 중계를 중단합니다. 진행 중 알림은 사라집니다.",
  "settings.conn.live_voice": "실시간 음성",
  "settings.conn.live_voice_desc": "근처 사람들과 무전기처럼 대화하기",
  "settings.conn.live_voice_on_title": "실시간 음성을 켤까요?",
  "settings.conn.live_voice_on_body":
    "마이크를 누르고 있으면 말하는 즉시 블루투스 범위 안의 모두에게 목소리가 전달되고, 상대방의 목소리도 내 휴대폰에서 재생됩니다. 아무것도 녹음되지 않습니다.",
  "settings.conn.live_voice_off_title": "실시간 음성을 끌까요?",
  "settings.conn.live_voice_off_body":
    "마이크를 누르고 있으면 대신 음성 메모가 녹음됩니다. 손을 떼면 전송되고, 상대가 재생하기 전까지는 아무도 듣지 못합니다.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor 경로 설정",
  "settings.conn.tor_desc":
    "추가 프라이버시를 위해 Nostr 트래픽을 Tor로 보냅니다",
  "settings.conn.tor_on_title": "Nostr 트래픽을 Tor로 보낼까요?",
  "settings.conn.tor_on_body":
    "릴레이가 내 IP 주소를 더 이상 보지 못합니다. 연결에 시간이 더 걸리고 메시지도 느리게 도착합니다. 블루투스에는 영향이 없습니다.",
  "settings.conn.tor_off_title": "Tor 경로 설정을 끌까요?",
  "settings.conn.tor_off_body":
    "Nostr 트래픽이 일반 연결로 돌아가므로 릴레이가 다시 내 IP 주소를 보게 됩니다. 어느 쪽이든 블루투스에는 영향이 없습니다.",
  "settings.conn.tor_unavailable":
    "이 빌드에서는 Tor 경로 설정을 사용할 수 없습니다.",
  "settings.conn.tor_timeout":
    "Tor 연결이 1분 넘게 걸리고 있습니다. 계속 켜진 채로 시도하며, 경로 설정이 되었는지 또는 이 네트워크가 차단하고 있는지는 메시 탭에서 알려줍니다.",
  "settings.conn.tor_failed":
    "Tor를 시작하지 못했습니다. 앱에 네트워크 접근 권한이 있는지 확인하세요.",
  "settings.tor.status": "Tor 상태",
  "settings.tor.connection": "연결 방식",
  "settings.tor.mode_off": "직접",
  "settings.tor.mode_off_desc":
    "Tor에 바로 연결합니다. 가장 빠르지만 이 네트워크를 지켜보는 쪽에서 Tor 사용 사실을 알 수 있습니다.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Tor 사용 사실을 숨기고, 브리지가 차단된 곳에서도 작동합니다. 연결이 가장 느립니다.",
  "settings.tor.mode_obfs4": "obfs4",
  "settings.tor.mode_obfs4_desc":
    "Tor 사용 사실을 숨깁니다. Snowflake보다 빠르지만 이 브리지는 공개되어 있어 차단하는 망도 있습니다.",
  "settings.tor.mode_custom": "사용자 브리지",
  "settings.tor.mode_custom_desc":
    "bridges.torproject.org에서 받은 브리지를 사용합니다. 다른 방식이 안 될 때 시도하세요.",
  "settings.tor.custom_placeholder": "한 줄에 브리지 한 줄씩 붙여넣기",
  "settings.tor.custom_apply_hint": "연결하려면 입력란 밖을 누르세요.",
  "settings.tor.custom_empty": "먼저 브리지 줄을 하나 이상 추가하세요.",
  "settings.tor.recovered":
    "Tor가 앱 실행을 막아 꺼졌습니다. 다시 시도하려면 켜 주세요.",
  "settings.conn.mint_clearnet": "민트 트래픽을 일반 네트워크로 허용",
  "settings.conn.mint_clearnet_desc":
    "iOS의 Tor는 Nostr만 감쌉니다. 민트 요청을 막으려면 꺼두세요. 어느 쪽이든 메시를 통한 ecash는 계속 작동합니다.",
  "settings.conn.gateway": "인터넷 게이트웨이",
  "settings.conn.gateway_desc":
    "근처의 오프라인 휴대폰에 내 연결을 빌려주어 위치 채널에 닿을 수 있게 합니다",
  "settings.conn.gateway_on_title": "인터넷 게이트웨이를 켤까요?",
  "settings.conn.gateway_on_body":
    "자체 연결이 없는 근처 휴대폰들이 내 연결을 통해 위치 채널 메시지를 주고받습니다. 내 모바일 데이터와 배터리를 사용하며, 그들의 메시지는 종단 간 암호화된 상태라 지나가는 내용을 읽을 수 없습니다.",
  "settings.conn.gateway_off_title": "인터넷 게이트웨이를 끌까요?",
  "settings.conn.gateway_off_body":
    "근처의 오프라인 휴대폰들이 내 연결을 통해 위치 채널에 닿지 못하게 됩니다. 내 메시지에는 영향이 없습니다.",
  "settings.conn.bridge": "메시 브리지",
  "settings.conn.bridge_desc":
    "이 지역의 공개 #bluetooth 채팅을 인터넷으로 범위 밖의 다른 블루투스 무리와 연결합니다",
  "settings.conn.bridge_on_title": "메시 브리지를 켤까요?",
  "settings.conn.bridge_on_body":
    "공개 #bluetooth 메시지가 인터넷을 통해 내 동네에 게시되어, 블루투스 범위 밖의 사람들도 읽을 수 있게 됩니다. 비공개 메시지는 절대 브리지되지 않으며, “근처만”을 쓰면 해당 메시지 하나는 지역에 머무릅니다.",
  "settings.conn.bridge_off_title": "메시 브리지를 끌까요?",
  "settings.conn.bridge_off_body":
    "공개 #bluetooth 메시지가 다시 블루투스 범위 안에만 머물고, 브리지된 무리의 메시지도 더 이상 도착하지 않습니다.",
  "settings.conn.bridge_needs_location": "메시 브리지에는 위치가 필요합니다",
  "settings.conn.bridge_needs_location_desc":
    "위치 측정으로 내 동네를 찾습니다. 브리지를 시작하려면 위치 권한을 허용하세요.",
  "settings.conn.grant_location": "위치 권한 허용",
  "settings.conn.grant_short": "허용",
  "settings.conn.internet_off": "인터넷이 꺼져 있습니다",
  "settings.conn.internet_off_desc":
    "Tor, 브리지, 게이트웨이는 모두 인터넷을 사용합니다. 사용하려면 네트워크 항목에서 인터넷 대체 경로를 켜세요.",
  "settings.conn.turn_on": "켜기",
  "settings.conn.turn_off": "끄기",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "블루투스",
  "settings.permissions.bluetooth_desc":
    "근처 기기를 찾고 그 사이에서 메시지를 중계합니다. 이것이 없으면 메시는 작동할 수 없습니다.",
  "settings.permissions.location": "위치",
  "settings.permissions.location_desc":
    "근처 지역 채널을 엽니다. 이것이 없으면 해당 채널은 닫힌 채로 있고 블루투스 메시는 평소대로 작동합니다.",
  "settings.permissions.notifications": "알림",
  "settings.permissions.notifications_desc":
    "앱이 닫혀 있을 때도 새 메시지 알림을 받습니다. 이것이 없으면 Airhop을 열었을 때만 보게 됩니다.",
  "settings.permissions.camera": "카메라",
  "settings.permissions.camera_desc":
    "QR 코드를 스캔하고 보낼 사진이나 동영상을 촬영합니다. 이것이 없어도 라이브러리에서 미디어를 공유할 수 있습니다.",
  "settings.permissions.photos": "사진",
  "settings.permissions.photos_desc":
    "라이브러리의 사진을 보내고 받은 미디어를 저장합니다. 이것이 없어도 카메라로 새 사진을 찍어 보낼 수 있습니다.",
  "settings.permissions.microphone": "마이크",
  "settings.permissions.microphone_desc":
    "음성 메시지를 녹음해 보내거나 실시간 음성을 사용합니다. 이것이 없으면 음성 메시지와 실시간 음성이 작동하지 않습니다.",
  "settings.permissions.allow": "이 권한 허용",
  "settings.permissions.open_settings": "이 권한을 바꾸려면 시스템 설정 열기",
  "settings.permissions.system": "시스템",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "네트워크 사용량",
  "settings.storage.storage_usage": "저장 공간 사용량",
  "settings.storage.storage_usage_desc": "메시지, 지갑 증명, 캐시된 첨부 파일",
  "settings.storage.session_usage": "이번 세션 · 보냄 {sent}, 받음 {received}",
  "settings.storage.cache": "캐시",
  "settings.storage.cache_desc": "첨부 파일 {size}",
  "settings.storage.clear_cache": "첨부 파일 캐시 지우기",
  "settings.storage.clear": "지우기",
  "settings.storage.clear_title": "캐시된 미디어를 지울까요?",
  "settings.storage.clear_body":
    "보낸 것과 받은 것 모두, 사진과 동영상, 음성 메모, 파일이 이 기기에서 제거됩니다. 다시 다운로드할 수 없으며, 해당 말풍선에 그렇게 표시되고 보낸 사람에게 다시 보내달라고 요청할 수 있습니다. 메시지와 지갑은 그대로 유지됩니다.",
  "settings.storage.cleared": "캐시를 지웠습니다",
  "settings.storage.freed": "{size}을(를) 확보했습니다.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "화면을 {value}(으)로 설정",
  "settings.font.set_a11y": "고정폭 글꼴을 {value}(으)로 설정",
  "settings.font.system": "시스템",
  "settings.font.system_desc": "기기의 기본 고정폭 글꼴을 사용합니다",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "현대적이고 읽기 쉬움",
  "settings.language.en": "영어",
  "settings.language.am": "암하라어",
  "settings.language.ar": "아랍어",
  "settings.language.bn": "벵골어",
  "settings.language.my": "버마어",
  "settings.language.zh_hans": "중국어 (간체)",
  "settings.language.zh_hant": "중국어 (번체)",
  "settings.language.nl": "네덜란드어",
  "settings.language.fil": "필리핀어",
  "settings.language.fr": "프랑스어",
  "settings.language.ka": "조지아어",
  "settings.language.de": "독일어",
  "settings.language.hi": "힌디어",
  "settings.language.id": "인도네시아어",
  "settings.language.it": "이탈리아어",
  "settings.language.ja": "일본어",
  "settings.language.ko": "한국어",
  "settings.language.mg": "말라가시어",
  "settings.language.ms": "말레이어",
  "settings.language.ne": "네팔어",
  "settings.language.fa": "페르시아어",
  "settings.language.pl": "폴란드어",
  "settings.language.pt_br": "포르투갈어 (브라질)",
  "settings.language.pt_pt": "포르투갈어 (포르투갈)",
  "settings.language.pa": "펀자브어",
  "settings.language.ru": "러시아어",
  "settings.language.es": "스페인어",
  "settings.language.sw": "스와힐리어",
  "settings.language.sv": "스웨덴어",
  "settings.language.ta": "타밀어",
  "settings.language.th": "태국어",
  "settings.language.tr": "튀르키예어",
  "settings.language.uk": "우크라이나어",
  "settings.language.ur": "우르두어",
  "settings.language.vi": "베트남어",
  "settings.language.pseudo": "의사 로캘",
  "settings.language.soon": "곧 제공",
  "settings.language.soon_a11y": "{value}, 곧 제공",
  "settings.language.set_a11y": "언어를 {value}(으)로 설정",
  "settings.language.pending": "다음에 열 때 적용",
  "settings.language.pending_a11y": "{value}, 다음에 Airhop을 열 때 적용됩니다",
  "settings.language.rtl_restart": "지금 다시 열기",
  "settings.language.rtl_title": "Airhop을 다시 열어 마무리하세요",
  "settings.language.rtl_body":
    "{value}은(는) 오른쪽에서 왼쪽으로 읽으며, Airhop은 시작할 때만 방향을 바꿀 수 있습니다. 닫았다가 다시 열어 전환을 마치세요. 잃는 것은 없으며, 그때까지 메시 연결도 유지됩니다.",
  "settings.theme.light": "밝게",
  "settings.theme.light_desc": "항상 밝은 색상표 사용",
  "settings.theme.dark": "어둡게",
  "settings.theme.dark_desc": "항상 어두운 색상표 사용",

  // ---- Settings: profile and identity ----
  "settings.status.online": "온라인",
  "settings.status.online_desc": "발견 가능, 광고와 스캔 모두 수행",
  "settings.status.away": "자리 비움",
  "settings.status.away_desc": "메시 일시 중지, 스캔도 광고도 하지 않음",
  "settings.status.invisible": "보이지 않음",
  "settings.status.invisible_desc": "스캔은 하지만 발견되지 않음",
  "settings.status.title": "상태",
  "settings.status.set_a11y": "상태를 {value}(으)로 설정",
  "settings.status.edit": "상태 편집",
  "settings.status.desc": "메시에서 얼마나 드러날지 선택하세요.",
  "settings.transfer.identity": "신원과 키",
  "settings.transfer.identity_desc": "피어 ID, 사용자 이름, 연락처",
  "settings.transfer.chats": "채팅과 기록",
  "settings.transfer.chats_desc": "대화, 그룹, 참여한 채널",
  "settings.transfer.wallet": "지갑 잔액",
  "settings.transfer.wallet_desc": "Cashu 증명과 거래 내역",
  "settings.transfer.title": "새 휴대폰으로 옮기기",
  "settings.transfer.desc": "신원, 채팅, 지갑을 다른 기기로 옮깁니다",
  "settings.transfer.coming_soon_a11y": "새 휴대폰으로 옮기기, 곧 제공",
  "settings.transfer.body":
    "두 휴대폰을 가까이 두고 블루투스로 모든 것을 옮깁니다. 서버를 거치지 않으므로 인터넷 없이도 작동합니다.",
  "settings.qr.permission_label": "사진 접근",
  "settings.qr.permission_purpose": "QR 코드를 저장하기",
  "settings.qr.saved": "저장됨",
  "settings.qr.saved_body": "QR 코드를 사진 라이브러리에 저장했습니다.",
  "settings.qr.save_failed": "저장하지 못했습니다",
  "settings.qr.save_failed_body":
    "QR 코드를 저장하지 못했습니다. 다시 시도하세요.",
  "settings.qr.share_message": "Airhop에서 나를 추가하세요",
  "settings.qr.share_body":
    "Airhop에서 나를 추가하세요 — 오프라인 우선 비공개 메시 메시징.",
  "settings.qr.show_short": "QR 보기",
  "settings.qr.title": "내 QR 코드",
  "settings.qr.note":
    "여기에는 공개 키가 담겨 있어 다른 사람이 어디서든 메시지를 보낼 수 있습니다. 신뢰하는 사람에게만 공유하세요. 신원을 지우지 않는 한 바뀌지 않습니다.",
  "settings.qr.code_label": "연락처 코드",
  "settings.qr.copy_code": "연락처 코드 복사",
  "settings.qr.share": "QR 코드 공유",
  "settings.qr.share_short": "QR 공유",
  "settings.qr.download": "QR 코드 다운로드",
  "settings.qr.download_short": "QR 다운로드",
  "settings.qr.show": "QR 코드 보기",
  "settings.wipe.trigger": "긴급 삭제 실행",
  "settings.wipe.trigger_desc": "확인 없이 즉시 삭제하려면 세 번 탭하세요",
  "settings.wipe.title": "긴급 삭제",
  "settings.wipe.now": "지금 삭제",
  "settings.wipe.desc": "모든 키와 메시지, 증명을 즉시 파기합니다",
  "settings.wipe.body":
    "모든 키와 메시지, 지갑 증명이 즉시 파기됩니다. 되돌릴 수 없습니다.",
  "settings.wipe.in_progress": "삭제하는 중",
  "settings.wipe.in_progress_body":
    "키와 메시지, 파일을 파기하고 있습니다. 몇 초 걸리며, 앱을 닫아도 알아서 끝까지 진행됩니다.",
  "settings.wipe.got_it": "확인했습니다",
  "settings.wipe.keys_failed": "키를 파기하지 못했습니다",
  "settings.wipe.keys_failed_body":
    "메시지와 연락처, 지갑은 사라졌지만 기기가 키를 놓아주지 않았습니다. 기기 잠금을 풀고 다시 삭제하세요.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "문의하기",
  "settings.help.contact_a11y": "{address}로 이메일 보내기",
  "settings.help.bug": "버그 신고",
  "settings.help.bug_desc": "GitHub에 이슈 열기",
  "settings.help.bug_a11y": "GitHub에 버그 신고하기",
  "settings.help.faq": "자주 묻는 질문",
  "settings.help.faq_desc": "일반적인 질문에 대한 답변",
  "settings.help.faq_a11y": "자주 묻는 질문 열기",
  "settings.help.terms_desc": "Airhop을 어떻게 사용할 수 있는지",
  "settings.help.terms_a11y": "서비스 약관 열기",
  "settings.help.privacy_desc": "우리가 수집하지 않는 것",
  "settings.help.privacy_a11y": "개인정보 처리방침 열기",

  // ---- Settings: support ----
  "settings.support.card": "카드 또는 UPI",
  "settings.support.card_desc": "인터넷뱅킹과 전자지갑, 전 세계",
  "settings.support.card_a11y": "카드, UPI, 인터넷뱅킹, 전자지갑으로 후원하기",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "매월 또는 한 번, 플랫폼 수수료 없음",
  "settings.support.sponsors_a11y": "GitHub Sponsors로 후원하기",
  "settings.support.note":
    "저는 여유 시간에 Airhop을 만듭니다. 투자자도 광고도 없습니다. 도움이 되었다면 여러분의 후원이 개발을 이어가는 데 큰 힘이 됩니다. 어느 쪽이든 모든 기능은 계속 무료입니다.",

  // ---- Settings: about and version ----
  "settings.about.version": "버전",
  "settings.about.version_desc": "현재 릴리스",
  "settings.about.version_a11y": "버전 보기 및 업데이트 확인",
  "settings.about.release_notes": "릴리스 노트",
  "settings.about.release_notes_desc": "최신 릴리스의 새로운 점",
  "settings.about.release_notes_a11y": "GitHub에서 최신 릴리스 노트 열기",
  "settings.about.source": "소스 코드",
  "settings.about.source_a11y": "GitHub에서 소스 코드 열기",
  "settings.about.licenses": "오픈 소스 라이선스",
  "settings.about.open_repo": "{name} 저장소 열기",
  "settings.about.licenses_desc": "서드파티 오픈 소스 패키지",
  "settings.about.licenses_a11y": "서드파티 라이선스 보기",
  "settings.version.codename": "코드네임",
  "settings.version.checking": "확인하는 중",
  "settings.version.check": "업데이트 확인",
  "settings.version.checking_title": "업데이트를 확인하는 중",
  "settings.version.up_to_date": "최신 버전을 사용 중입니다.",
  "settings.version.release_notes": "릴리스 노트 보기",
  "settings.version.made_with": "만든 도구",
  "settings.version.number": "버전 {version}",
  "settings.version.update_to": "{version}(으)로 업데이트",
  "settings.version.update_to_a11y": "버전 {version}(으)로 업데이트",
  "settings.version.released_under": "{license}에 따라 배포됨",
  "settings.version.notes_a11y": "버전 {version}의 릴리스 노트 보기",
  "settings.version.tor_paused":
    "IP가 새지 않도록 Tor가 켜져 있는 동안에는 업데이트 확인이 중지됩니다. 브라우저에서 릴리스 페이지를 확인하세요.",
  "settings.version.check_failed":
    "업데이트를 확인하지 못했습니다. 연결을 확인하고 다시 시도하세요.",
  "settings.version.downloading": "다운로드 중 {percent}%",
  "settings.version.install": "설치",
  "settings.version.download_failed":
    "다운로드에 실패했습니다. 연결을 확인한 후 다시 시도하세요.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind}이(가) {size} KiB로 {cap} KiB 제한을 넘습니다.",
  "transfer.failed.malformed":
    "첨부 파일이 손상된 상태로 도착해 열 수 없었습니다. 상대방에게 다시 보내달라고 하세요.",
  "transfer.failed.unsupported_type":
    "이 앱이 열 수 없는 형식의 첨부 파일이 도착했습니다.",
  "transfer.failed.type_mismatch":
    "첨부 파일이 거부되었습니다. 내용이 명시된 파일 형식과 일치하지 않습니다.",
  "transfer.failed.storage":
    "첨부 파일이 도착했지만 저장하지 못했습니다. 여유 공간을 확인하세요.",
  "transfer.badge.waiting": "대기 중 · {name}",
  "transfer.badge.active_count": "전송 {count}건",
  "transfer.badge.sending": "{name} 보내는 중",
  "transfer.badge.receiving": "{name} 받는 중",
  "transfer.badge.a11y": "{label}, {percent} 퍼센트. 대화 열기.",
  "transfer.kind.photo": "사진",
  "transfer.kind.video": "동영상",
  "transfer.kind.voice": "음성 메모",
  "transfer.this.photo": "이 사진",
  "transfer.this.video": "이 동영상",
  "transfer.this.voice": "이 음성 메모",
  "transfer.this.file": "이 파일",
  "transfer.kind.document": "문서",
  "transfer.kind.voice_preview": "음성 메모",
  "transfer.kind.photo_preview": "사진",
  "transfer.kind.video_preview": "동영상",
  "transfer.kind.document_preview": "문서",

  // ---- System notifications ----
  "notif.channel.messages": "메시지",
  "notif.channel.nearby": "근처 피어",
  "notif.channel.nearby_desc":
    "메시가 블루투스 범위 안에서 사람을 찾았을 때 가끔 보내는 알림입니다.",
  "notif.nearby.body":
    "지금 블루투스 범위 안에 있습니다. 탭하여 메시를 여세요.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "누군가",
  "notif.notice_urgent": "긴급 공지 · {content}",
  "notif.notice": "공지 · {content}",
  "notif.incoming_file": "수신 중인 파일",
  "notif.preview.photo": "📷 사진",
  "notif.preview.voice": "🎤 음성 메시지",
  "notif.preview.video": "🎥 동영상",
  "notif.preview.document": "📄 문서",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "새 메시지",
  "notif.hidden.channel": "새 활동",
  "notif.hidden.mention": "누군가 나를 언급했습니다",
  "notif.mention.title": "{sender}이(가) 나를 언급했습니다",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "{count}개 더 보기",
  },
  "chat.channels.show_more_a11y": {
    other: "기본 채널 {count}개 더 보기",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}, 읽지 않음 {count}개",
  },
  "a11y.new_count": {
    other: "{label}, 새 항목 {count}개",
  },
  "chat.a11y.unread": {
    other: "읽지 않음 {count}개",
  },
  "chat.thread.length_left": {
    other: "{count}자 남음",
  },
  "settings.general.retention_days": {
    other: "{count}일",
  },
  "chat.info.group_reach": {
    other: "멤버 {count}명 중 {reachable}명에게 연결 가능",
  },
  "chat.group_members": {
    other: "비공개 그룹  ·  멤버 {count}명",
  },
  "chat.select.count": {
    other: "{count}개 선택됨",
  },
  "chat.select.forward": {
    other: "메시지 {count}개 전달",
  },
  "chat.voice.live_speaking_count": {
    other: "{count}명이 말하는 중",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "범위 내 피어 {count}명",
  },
  "mesh.peer.hops_away": {
    other: "{count}홉 거리",
  },
  "chat.presence.active": {
    other: "활동 중 {count}명",
  },
  "chat.presence.nearby": {
    other: "근처에 {count}명",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "민트 {count}곳",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint}이(가) 증명 {count}개에 {balance} {unit}을(를) 보유하고 있습니다. 제거하면 해당 증명이 이 기기에서 영구히 삭제되며 백업은 없습니다. 잔액을 먼저 인출하거나 보내세요.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other:
      "입금 {count}건이 결제를 기다리고 있습니다. 앱을 열 때마다 다시 확인합니다.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "{mints}에서 사용하지 않은 증명 {count}개를 복구했습니다.",
  },
  "wallet.backup.already_spent": {
    other:
      "코인 {count}개를 찾았지만 이미 사용된 상태라 적립된 것은 없습니다. 정상입니다. 지금까지 사용한 모든 코인은 민트가 보관하는 기록에 그대로 남습니다.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "{count}개 더 보기",
  },
  "wallet.activity.show_more_a11y": {
    other: "결제 {count}건 더 보기",
  },
  "wallet.mint.unconfirmed_count": {
    other: "미확인 {count}개",
  },
  "wallet.proof_count": {
    other: "증명 {count}개",
  },
  "wallet.spent_removed_detail": {
    other: "증명 {count}개가 이미 사용되어 제거되었습니다.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "근처에 {count}명",
  },
};

export const ko = { strings, plurals };
