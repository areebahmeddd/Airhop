// vi: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Hủy",
  "common.done": "Xong",
  "common.ok": "OK",
  "common.close": "Đóng",
  "common.back": "Quay lại",
  "common.delete": "Xóa",
  "common.remove": "Gỡ",
  "common.add": "Thêm",
  "common.copy": "Sao chép",
  "common.copied": "Đã sao chép",
  "common.share": "Chia sẻ",
  "common.continue": "Tiếp tục",
  "common.try_again": "Thử lại",
  "common.settings": "Cài đặt",
  "common.on": "Bật",
  "common.off": "Tắt",

  // ---- Dates ----
  "format.today": "Hôm nay",
  "format.yesterday": "Hôm qua",
  "format.minutes_ago": "{count} phút trước",
  "format.hours_ago": "{count} giờ trước",
  "format.days_ago": "{count} ngày trước",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Trò chuyện",
  "nav.tab.mesh": "Mạng lưới",
  "nav.tab.wallet": "Ví",
  "nav.tab.profile": "Bạn",
  "a11y.tab.new_peers": "{label}, có người mới ở gần",
  "nav.notifications": "Thông báo",
  "chat.subtab.channels": "Kênh",
  "chat.subtab.direct": "Riêng",
  "chat.subtab.dms": "Tin nhắn riêng",
  "chat.search.placeholder": "Tìm trong các cuộc trò chuyện…",
  "chat.search.a11y": "Tìm trong cuộc trò chuyện và tin nhắn",
  "chat.search.close": "Đóng tìm kiếm",
  "chat.search.clear": "Xóa nội dung tìm kiếm",
  "mesh.view.radar": "Dạng ra đa",
  "mesh.view.list": "Dạng danh sách",
  "mesh.view.radar_short": "Ra đa",
  "mesh.view.list_short": "Danh sách",

  // ---- Legal document names ----
  "legal.last_updated": "Cập nhật lần cuối: {date}",
  "legal.terms": "Điều khoản dịch vụ",
  "legal.privacy": "Chính sách quyền riêng tư",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Liên lạc riêng tư qua mạng lưới",
  "onboarding.welcome.cta": "Bắt đầu",
  "onboarding.welcome.cta_hint":
    "Hãy đồng ý với các điều khoản bên dưới để tiếp tục",
  "onboarding.welcome.consent_a11y":
    "Đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư",
  "onboarding.welcome.open_terms": "Mở Điều khoản dịch vụ",
  "onboarding.welcome.open_privacy": "Mở Chính sách quyền riêng tư",
  "onboarding.welcome.consent":
    "Khi chạm {cta}, bạn đồng ý với {terms} và {privacy} của chúng tôi.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Đang tạo danh tính của bạn",
  "onboarding.identity.body":
    "Đang tạo một cặp khóa Ed25519 trên thiết bị này.\nKhông có gì được gửi đi đâu cả.",
  "onboarding.identity.failed_heading": "Không tạo được khóa cho bạn",
  "onboarding.identity.failed_body":
    "Thiết bị này không cho Airhop lưu chúng một cách an toàn. Hãy thử lại, hoặc khởi động lại điện thoại rồi mở lại Airhop.",
  "onboarding.identity.steps_a11y": "Các bước: {steps}",
  "onboarding.identity.step.x25519": "Đang tạo cặp khóa tĩnh X25519",
  "onboarding.identity.step.ed25519": "Đang tạo cặp khóa ký Ed25519",
  "onboarding.identity.step.keychain":
    "Đang lưu khóa vào chuỗi khóa của hệ điều hành",
  "onboarding.identity.step.peer_id": "Đang dẫn ra ID nút mạng",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Tên của bạn trên mạng lưới",
  "onboarding.username.peer_id": "ID nút mạng",
  "onboarding.username.card_a11y":
    "Tên của bạn trên mạng lưới là {username}. ID nút mạng {peerID}. {props}.",
  "onboarding.username.explanation":
    "Tên người dùng này được dẫn ra một cách xác định từ khóa công khai của bạn. Nó giống nhau trên mọi thiết bị nhìn thấy ID nút mạng của bạn.",
  "onboarding.username.cta": "Vào Airhop",
  "onboarding.username.prop.algorithm": "Thuật toán",
  "onboarding.username.prop.storage": "Nơi lưu",
  "onboarding.username.prop.storage_value": "Chỉ chuỗi khóa hệ điều hành",
  "onboarding.username.prop.account": "Cần tài khoản",
  "onboarding.username.prop.account_value": "Không",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Chào mừng đến với Airhop",
  "onboarding.hello.p1":
    "Xin chào. Airhop được dựng trên nền bitchat như một dự án phụ nguồn mở, độc lập. Nó không trực thuộc và cũng không được bảo trợ bởi dự án bitchat hay permissionless tech, chỉ là thứ tôi thích làm và chia sẻ với cộng đồng.",
  "onboarding.hello.p2":
    "Đây là bản phát hành iOS và Android đầu tiên, nên dù tôi đã thử với bạn bè, bạn hẳn vẫn sẽ gặp vài lỗi. Nếu gặp, hoặc nếu bạn có ý tưởng cho một tính năng, tôi rất muốn nghe. Hãy mở một issue trên {github} hoặc gửi thư cho tôi ở {email}.",
  "onboarding.hello.p3":
    "Nếu Airhop hữu ích với bạn, hãy cân nhắc để lại một sao trên {github} hoặc một đánh giá trên {store}. Điều đó giúp nhiều người biết tới dự án hơn. Cảm ơn bạn đã thử!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Trước khi điện thoại của bạn hỏi",
  "onboarding.primer.lede":
    "Đây là việc mà mỗi quyền làm, và việc nó không làm.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Tìm các thiết bị ở gần và chuyển tiếp tin nhắn giữa chúng. Đây là thứ tạo nên mạng lưới và chạy được mà không cần kết nối Internet.",
  "onboarding.primer.location.title": "Vị trí",
  "onboarding.primer.location.body":
    "Đặt bạn vào các kênh khu vực ở gần, từ một khu phố tới cả một vùng. Airhop không bao giờ theo dõi bạn hay gửi vị trí chính xác của bạn ra khỏi thiết bị.",
  "onboarding.primer.notifications.title": "Thông báo",
  "onboarding.primer.notifications.body":
    "Nhận báo tin nhắn mới ngay cả khi ứng dụng đã đóng. Thông báo được tạo ngay trên thiết bị của bạn, không có máy chủ nào tham gia.",
  "onboarding.primer.footnote":
    "Bạn có thể từ chối. Tin nhắn vẫn đi qua Internet được, và bạn có thể đổi ý sau trong Cài đặt.",
  "onboarding.primer.cta_a11y": "Tiếp tục tới phần hỏi quyền",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Quyền truy cập Bluetooth",
  "permission.bluetooth.purpose": "tìm các thiết bị ở gần trên mạng lưới",
  "permission.open_settings": "Mở Cài đặt",
  "permission.not_now": "Để sau",
  "permission.blocked_title": "{label} đang tắt",
  "permission.blocked_body": "Hãy bật nó trong Cài đặt để {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Có gì đó trục trặc",
  "error.boundary.body":
    "Airhop gặp một sự cố ngoài dự tính và phải dừng thứ đang hiển thị.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Kênh mặc định",
  "chat.channels.yours": "Kênh của bạn",
  "chat.channels.none": "Chưa có kênh nào",
  "chat.channels.none_hint":
    "Chạm {plus} ở trên để tham gia hoặc tạo một kênh.",
  "chat.channels.none_desc":
    "Chưa có kênh nào. Dùng nút thêm trên thanh tiêu đề để tham gia hoặc tạo một kênh.",
  "chat.channels.show_fewer": "Hiện ít kênh mặc định hơn",
  "chat.channels.show_less": "Thu gọn",
  "chat.channels.info": "Thông tin kênh",
  "chat.channels.pin": "Ghim kênh",
  "chat.channels.unpin": "Bỏ ghim kênh",
  "chat.channels.mute": "Tắt tiếng kênh",
  "chat.channels.unmute": "Bật tiếng kênh",
  "chat.channels.leave": "Rời kênh",
  "chat.channels.leave_confirm": "Rời",
  "chat.channels.clear_body":
    "Xóa mọi tin nhắn trong {name}? Việc này không thể hoàn tác.",
  "chat.channels.leave_body":
    "Rời {name}? Bạn sẽ không nhận tin nhắn của kênh nữa, và lịch sử của nó bị gỡ khỏi thiết bị này.",
  "chat.channels.more_options": "Thêm tùy chọn cho {name}",
  "chat.channels.teleported_tag": "{level}  ·  từ xa",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Xóa cuộc trò chuyện",
  "chat.dm.remove_contact": "Gỡ liên hệ",
  "chat.dm.block": "Chặn nút mạng này",
  "chat.dm.block_confirm": "Chặn",
  "chat.dm.delete": "Xóa cuộc trò chuyện",
  "chat.dm.delete_body":
    "Việc này gỡ cuộc trò chuyện khỏi danh sách của bạn và xóa tin nhắn của nó. Liên hệ vẫn được giữ, và một tin nhắn mới từ họ sẽ mở một cuộc trò chuyện mới.",
  "chat.dm.in_range": "trong tầm",
  "chat.dm.row_hint": "Chạm hai lần rồi giữ để xem thêm tùy chọn",
  "chat.channels.row_hint": "Chạm hai lần rồi giữ để xem thêm tùy chọn",
  "chat.dm.you_prefix": "Bạn:",
  "chat.dm.none": "Không có tin nhắn riêng",
  "chat.dm.none_desc":
    "Vào thẻ Mạng lưới và chạm một nút mạng để bắt đầu tin nhắn riêng được mã hóa.",
  "chat.dm.contact_info": "Thông tin liên hệ",
  "chat.dm.pin": "Ghim cuộc trò chuyện",
  "chat.dm.unpin": "Bỏ ghim cuộc trò chuyện",
  "chat.dm.mute": "Tắt tiếng cuộc trò chuyện",
  "chat.dm.unmute": "Bật tiếng cuộc trò chuyện",
  "chat.dm.clear_body":
    "Xóa mọi tin nhắn với {name}? Việc này không thể hoàn tác.",
  "chat.dm.remove_contact_body":
    "Gỡ {name}? Việc này xóa cuộc trò chuyện và quên liên hệ đó. Họ vẫn liên lạc được với bạn nếu nhắn tin lần nữa.",
  "chat.dm.block_body":
    "Chặn {name}? Bạn sẽ không thấy họ trên thẻ Mạng lưới và không nhận tin nhắn từ họ, kể cả khi họ ở gần.",
  "chat.dm.more_options": "Thêm tùy chọn cho {name}",
  "chat.dm.remove_contact_short": "Gỡ liên hệ",
  "chat.dm.block_short": "Chặn liên hệ",
  "chat.dm.delete_short": "Xóa cuộc trò chuyện",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Xóa tin nhắn",
  "chat.clear_confirm": "Xóa",
  "chat.group_badge": "Nhóm",
  "chat.more": "Thêm",
  "chat.no_messages": "Chưa có tin nhắn nào",
  "chat.you": "Bạn",
  "chat.a11y.channel": "Kênh {name}",
  "chat.a11y.group": "Nhóm {name}",
  "chat.a11y.muted": "đã tắt tiếng",
  "chat.a11y.pinned": "đã ghim",

  // ---- Chats: start something new ----
  "chat.new.title": "Bắt đầu một cuộc trò chuyện mới",
  "chat.new.channel": "Tạo một kênh riêng tư",
  "chat.new.channel_label": "Kênh riêng tư",
  "chat.new.channel_desc":
    "Một phòng mà ai có đường liên kết đều vào được. Tạo một kênh, hoặc tham gia bằng liên kết ai đó gửi cho bạn.",
  "chat.new.group": "Tạo một nhóm riêng tư",
  "chat.new.group_label": "Nhóm riêng tư",
  "chat.new.group_desc":
    "Chọn từng người cụ thể. Tối đa 16. Chỉ chạy trên Bluetooth.",
  "chat.new.place": "Đến một nơi bằng geohash",
  "chat.new.place_label": "Đến một nơi",
  "chat.new.place_desc":
    "Mở kênh vị trí của bất cứ nơi nào bằng geohash của nó.",
  "chat.new.reach": "Tầm với",
  "chat.new.reach_internet": "Tới được thành viên qua Bluetooth và Internet.",
  "chat.new.reach_mesh": "Chạy trong tầm Bluetooth, không qua Internet.",
  "chat.new.reach_internet_desc":
    "Tới được thành viên qua cả Internet. Bộ chuyển tiếp thấy được kênh đang hoạt động, nhưng không bao giờ thấy tin nhắn hay ai đang ở trong đó.",
  "chat.new.reach_mesh_desc":
    "Ở lại trong mạng lưới cục bộ. Riêng tư nhất, không gì rời khỏi tầm Bluetooth.",
  "chat.new.join_link": "Tham gia kênh riêng tư bằng liên kết mời",
  "chat.new.back_to_chooser": "Quay lại phần chọn",
  "chat.new.create_channel": "Tạo kênh",
  "chat.new.name_required": "Hãy nhập tên kênh trước",
  "chat.new.name_taken": "Tên đó đã có người dùng rồi",
  "chat.new.create": "Tạo",
  "chat.new.e2ee": "Mã hóa đầu cuối. Chỉ thành viên đọc được tin nhắn.",
  "chat.new.invite_only":
    "Chỉ theo lời mời. Ai được bạn chia sẻ liên kết đều vào được. Kênh vẫn ẩn với tất cả những người khác, kể cả các nút mạng ở gần.",
  "chat.new.name_exists": "Đã có một kênh mang tên này.",
  "chat.new.reach_bluetooth_chip": "Chỉ Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + Internet",
  "chat.new.have_link": "Tham gia bằng liên kết mời",

  // ---- Chats: join by link ----
  "chat.join.title": "Tham gia bằng liên kết",
  "chat.join.not_airhop": "Đó không phải liên kết Airhop.",
  "chat.join.reach_internet": "Tới được thành viên qua Bluetooth và Internet.",
  "chat.join.reach_mesh": "Ở lại trong tầm Bluetooth.",
  "chat.join.contact_card":
    "Một thẻ liên hệ. Thêm họ vào danh bạ của bạn và mở cuộc trò chuyện.",
  "chat.join.unverified": "Không xác minh được liên kết đó",
  "chat.join.unverified_body":
    "Thẻ liên hệ không khớp với chính khóa của nó, nên nó không được thêm vào. Hãy nhờ họ gửi lại một thẻ mới.",
  "chat.join.paste": "Dán từ bảng nhớ tạm",
  "chat.join.join": "Tham gia",
  "chat.join.public_channel": "Kênh công khai {name}. Ai ở gần cũng đọc được.",
  "chat.join.private_channel": "Kênh riêng tư {name}. {reach}",
  "chat.join.dm_with": "Tin nhắn riêng với {name}.",
  "chat.join.joined_as": "Đã tham gia với tên {name}",
  "chat.join.name_clash_body":
    "Bạn đã ở trong một {name} khác rồi. Tên kênh chỉ là nhãn, nên lời mời này đã mở kênh riêng của nó, còn kênh bạn đang ở vẫn nguyên vẹn. Bạn có thể đổi tên cả hai từ phần thông tin kênh.",
  "chat.join.paste_hint":
    "Dán một lời mời bắt đầu bằng airhop://. Chạm vào liên kết cũng được; phần này dành cho liên kết không chạm được.",
  "chat.join.key_note":
    "Lời mời vào kênh riêng tư mang sẵn khóa, nên việc tham gia là tức thì và không phải hỏi xin ai điều gì.",
  "chat.join.offline_note":
    "Hoạt động ngoại tuyến. Liên kết được đọc ngay trên thiết bị này, và kênh vươn xa tới đâu là do người tạo đặt.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "Không mở được ô đó. Hãy thử lại sau ít phút.",
  "chat.jump.title": "Đến một nơi",
  "chat.jump.saved": "NƠI ĐÃ LƯU",
  "chat.jump.anywhere":
    "Mở kênh vị trí công khai của bất cứ nơi nào, kể cả nơi bạn không có mặt.",
  "chat.jump.geohash_note":
    "Nhập geohash của nơi đó. Tất cả những ai có vị trí nằm trong ô đó đều dùng chung kênh này.",
  "chat.jump.teleport_note":
    "Bạn hiện ra là đến từ xa, không phải ở gần. Kênh chỉ vươn tới qua Internet.",
  "chat.jump.level_cell": "Ô cấp {level}",
  "chat.jump.already_here": "Bạn đã ở đây rồi. Đến sẽ mở kênh {name} của bạn.",
  "chat.jump.open_direction": "Mở ô ở phía {direction} của bạn",
  "chat.jump.open_place": "Mở {name}",
  "chat.jump.remove_place": "Gỡ {name} khỏi các nơi đã lưu",
  "chat.jump.go": "Đến",
  "chat.jump.how":
    "Để tìm một geohash: mở một kênh vị trí > chạm vào tên kênh > sao chép từ đó.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Không tới được mọi thành viên. Hãy thử lại khi họ ở gần.",
  "chat.group.you_were_added": "Bạn đã được thêm vào {name}.",
  "chat.group.added_you": "Đã thêm bạn vào {name}",
  "chat.group.you_were_removed":
    "Bạn đã bị gỡ khỏi {name}. Bạn không còn đọc hay gửi tin nhắn ở đây được nữa.",
  "chat.group.removed_you": "Đã gỡ bạn khỏi {name}",
  "chat.group.add_failed": "Không thêm được họ",
  "chat.group.add_failed_body":
    "Không có gì thay đổi. Có thể hiện không liên lạc được với họ, hoặc nhóm đã đủ 16 người, hoặc bạn không phải người tạo nhóm.",
  "chat.group.remove_failed": "Không gỡ được họ",
  "chat.group.remove_failed_body":
    "Không có gì thay đổi. Chỉ người tạo nhóm mới đổi được thành phần nhóm.",
  "chat.group.e2ee": "Mã hóa đầu cuối. Chỉ thành viên đọc được tin nhắn.",
  "chat.group.cap":
    "Tối đa 16 người, do bạn chọn. Không có liên kết mời, nên không ai vào được nhờ được chuyển tiếp một liên kết.",
  "chat.group.bluetooth":
    "Chỉ Bluetooth. Thành viên ngoài tầm sẽ nhận tin nhắn khi họ quay lại.",
  "chat.group.members_label": "THÀNH VIÊN",
  "chat.group.none_in_range":
    "Không có ai trong tầm. Thành viên phải ở gần khi bạn tạo nhóm.",
  "chat.group.create_title": "Tạo một nhóm",
  "chat.group.name_placeholder": "Tên nhóm",
  "chat.group.create": "Tạo",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Mạng lưới cục bộ · chỉ Bluetooth",
  "chat.scope.mesh_desc":
    "Tới được các thiết bị trong tầm Bluetooth (khoảng 10 đến 100 mét). Không cần Internet. Lý tưởng cho việc phối hợp tại chỗ.",
  "chat.scope.block": "Khu phố · khoảng 100 m",
  "chat.scope.block_desc":
    "Phủ ở mức một khu phố. Tin nhắn được bắc cầu qua Internet để những nút mạng ngoài tầm Bluetooth nhưng vẫn ở gần có thể tham gia.",
  "chat.scope.neighborhood": "Khu dân cư · khoảng 1 km",
  "chat.scope.neighborhood_desc":
    "Phủ ở mức khu dân cư. Có bộ chuyển tiếp hỗ trợ nên tới được các nút mạng khắp khu vực kể cả khi không có liên kết Bluetooth trực tiếp.",
  "chat.scope.city": "Thành phố · khoảng 10 km",
  "chat.scope.city_desc":
    "Kênh phủ toàn thành phố. Dùng các bộ chuyển tiếp Internet chọn theo vị trí để tới được các nút mạng khắp vùng đô thị.",
  "chat.scope.province": "Tỉnh hoặc bang · khoảng 100 km",
  "chat.scope.province_desc":
    "Phủ ở mức tỉnh hoặc bang. Bắc cầu qua Internet để vươn tới cả một vùng rộng hàng trăm ki lô mét.",
  "chat.scope.country": "Quốc gia hoặc khu vực · khoảng 1000 km",
  "chat.scope.country_desc":
    "Phủ toàn quốc. Bất kỳ người dùng Airhop hay bitchat nào trong khu vực đều có thể tham gia và đọc tin nhắn.",
  "chat.transport.bluetooth": "Chỉ Bluetooth",
  "chat.transport.both": "Bluetooth + Internet",
  "chat.transport.internet": "Chỉ Internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Lệnh /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Gửi một cái ôm ấm áp",
  "chat.cmd.slap_hint": "Tát bằng một con cá hồi to",
  "chat.status.sending": "Đang gửi…",
  "chat.status.undo_send": "Hoàn tác gửi",
  "chat.status.undo": "Hoàn tác",
  "chat.status.sent": "Đã gửi",
  "chat.status.received": "Đã nhận",
  "chat.status.failed": "Thất bại",
  "chat.status.canceled": "Đã hủy",
  "chat.status.waiting": "Đang chờ",
  "chat.status.sending_short": "Đang gửi",
  "chat.status.receiving": "Đang nhận",
  "chat.thread.not_available": "Không dùng được ở đây",
  "chat.thread.private_channel": "Kênh riêng tư",
  "chat.thread.location_channel": "Kênh vị trí",
  "chat.thread.public_channel": "Kênh công khai",
  "chat.thread.notices": "Bản tin của kênh này",
  "chat.thread.invite": "Mời ai đó vào kênh này",
  "chat.thread.not_in_range":
    "Không trong tầm Bluetooth. Đang chuyển qua Internet.",
  "chat.thread.not_nearby":
    "Không ở gần. Chúng tôi sẽ chuyển khi họ trở lại trong tầm hoặc lên mạng.",
  "chat.thread.no_keys":
    "Bạn cần ở trong tầm Bluetooth, hoặc quét mã của họ, mới nhắn tin cho họ được.",
  "chat.geo.card_received":
    "{name} đã chia sẻ liên hệ của họ. Hãy chia sẻ lại liên hệ của bạn để còn nói chuyện tiếp sau khi một trong hai đi nơi khác.",
  "chat.geo.exchange_complete":
    "Đã trao đổi liên hệ. Giờ hai bạn liên lạc được với nhau từ bất cứ đâu.",
  "chat.geo.keep_person": "Giữ lại người này",
  "chat.geo.keep_person_desc":
    "Chia sẻ liên hệ của bạn để còn nói chuyện tiếp sau khi một trong hai đi nơi khác. Họ sẽ biết danh tính lâu dài của bạn.",
  "chat.geo.card_sent": "Đã chia sẻ · đang đợi của họ",
  "chat.thread.left_cell":
    "Bạn đã rời khu vực này, nên họ không liên lạc được với bạn ở đây. Hãy trao đổi mã để nói chuyện tiếp ở bất cứ đâu.",
  "chat.thread.no_route":
    "Hiện không liên lạc được với họ. Tin nhắn sẽ gửi khi có đường đi.",
  "chat.thread.empty": "Chưa có tin nhắn nào",
  "chat.thread.empty_desc": "Bắt đầu một cuộc trò chuyện được mã hóa.",
  "chat.thread.jump_latest": "Nhảy tới tin nhắn mới nhất",
  "chat.thread.back_to_members": "Quay lại danh sách thành viên",
  "chat.thread.nostr_key": "Khóa công khai Nostr",
  "chat.thread.in_range": "Trong tầm",
  "chat.voice.not_recorded": "Tin nhắn thoại không ghi được",
  "chat.thread.message": "Tin nhắn",
  "chat.thread.message_placeholder": "Tin nhắn…",
  "chat.thread.length_full": "Tin nhắn đã đầy",
  "chat.thread.waiting_for": "Đang đợi {name} quay lại · {percent}%",
  "chat.thread.peer": "nút mạng",
  "chat.thread.cancel_transfer": "Hủy {name}",
  "chat.thread.queued_more": "Còn {count} nữa đang đợi gửi",
  "chat.thread.across_bridge": "{count} ở bên kia cầu nối",
  "chat.thread.bridged": "đã bắc cầu",
  "chat.thread.invite_body":
    "Vào {channel} với mình trên Airhop — nhắn tin qua mạng lưới, riêng tư và ưu tiên ngoại tuyến.",
  "chat.thread.go_back_unread": "Quay lại, {count} chưa đọc",
  "chat.thread.view_info": "Xem thông tin của {name}",
  "chat.thread.notices_new": "Bản tin của kênh này, {count} mới",
  "chat.thread.say_something": "Nói gì đó trong {channel} đi.",
  "chat.thread.jump_latest_new": "Nhảy tới tin nhắn mới nhất, {count} mới",
  "chat.thread.unconfirmed_since":
    "Chưa xác nhận chuyển thành công kể từ {date}",
  "chat.thread.no_reach":
    "Không có nút mạng nào ở gần · chưa ai nhận được tin này",
  "chat.thread.channel_needs_internet":
    "Internet đã tắt · kênh này chỉ tới được người trong tầm Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet đã tắt · ô này chỉ tới được qua Internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet đã tắt · cuộc trò chuyện này chỉ đi qua Internet",
  "chat.thread.via_gateway":
    "Internet đã tắt · một thiết bị ở gần đang mang nó lên mạng giúp bạn",
  "chat.thread.group_queued":
    "Chưa có ai trong nhóm này ở gần. Tin nhắn sẽ tới họ khi có người ở gần.",
  "chat.thread.no_group_key":
    "Bạn không còn trong nhóm này nữa, nên không gửi được",
  "chat.thread.no_reach_offline":
    "Internet đã tắt và không có nút mạng nào ở gần · chưa ai nhận được tin này",
  "chat.thread.mention": "Nhắc tới {name}",
  "chat.thread.someone_talking": "{hold}. {name} đang nói.",
  "chat.thread.attach_note":
    "Tệp chỉ gửi được trong tầm Bluetooth. Văn bản và thanh toán tới được các liên hệ trên Internet; tệp đính kèm thì không.",
  "chat.thread.message_peer": "Nhắn tin cho {name}",
  "chat.thread.send": "Gửi tin nhắn",
  "chat.thread.group": "Nhóm",
  "chat.bridge.nearby_only":
    "Chỉ ở gần: giữ tin nhắn này ngoài cầu nối mạng lưới",
  "chat.bridge.nearby_label": "Chỉ ở gần · ở lại trên Bluetooth",
  "chat.bridge.bridging_label":
    "Đang bắc cầu tới các khu vực lân cận · chạm để chuyển sang chỉ ở gần",
  "chat.screenshot.you_took": "Bạn đã chụp màn hình",
  "chat.screenshot.you_took_private":
    "Bạn đã chụp màn hình · không ai được báo",
  "chat.screenshot.heads_up": "Lưu ý",
  "chat.screenshot.notice": "* {name} đã chụp màn hình *",
  "chat.screenshot.notified_dm":
    "{name} đã được báo rằng bạn chụp màn hình cuộc trò chuyện này.",
  "chat.screenshot.notified":
    "Mọi người trong kênh này đã được báo rằng bạn chụp màn hình.",
  "chat.screenshot.not_notified":
    "Không ai được báo. Kênh này là công khai, nên loan báo một lần chụp màn hình sẽ ghi lại rằng bạn từng có mặt ở đây.",
  "chat.thread.error": "Lỗi",
  "chat.thread.go_back": "Quay lại",
  "chat.bubble.via_bridge": "qua cầu nối mạng lưới",
  "chat.bubble.view_profile": "Xem hồ sơ của {name}",
  "chat.bubble.forwarded": "Đã chuyển tiếp",
  "chat.bubble.attachment": "tệp đính kèm",
  "chat.bubble.a11y": "{sender}: {body}. Nhấn giữ để xem thêm tùy chọn.",
  "chat.bubble.failed_retry": "Gửi thất bại. Chạm để thử lại.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Thông tin tin nhắn",
  "chat.info.delivered_to": "Đã chuyển tới {name}",
  "chat.info.read_by": "{name} đã đọc",
  "chat.info.group_reach_desc":
    "Tới được ngay bây giờ, không phải xác nhận đã chuyển",
  "chat.info.group_alone": "Không còn thành viên nào khác",
  "chat.info.today_at": "Hôm nay {time}",
  "chat.info.sending": "Đang gửi…",
  "chat.info.failed": "Gửi thất bại",
  "chat.info.courier": "Được một người bạn mang giúp",
  "chat.info.sent": "Đã gửi",
  "chat.info.queued": "Đang đợi gửi",
  "chat.info.waiting": "Đang chờ…",
  "chat.action.info": "Thông tin tin nhắn",
  "chat.action.save_photos": "Lưu vào ảnh",
  "chat.action.save_copy": "Lưu một bản",
  "chat.action.forward": "Chuyển tiếp",
  "chat.action.select": "Chọn",
  "chat.select.cancel": "Hủy chọn",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Máy ảnh",
  "chat.attach.camera_desc": "Chụp ảnh hoặc quay video",
  "chat.attach.library": "Thư viện ảnh",
  "chat.attach.library_desc": "Chọn từ thư viện của bạn",
  "chat.attach.document": "Tài liệu",
  "chat.attach.document_desc": "Gửi bất kỳ tệp nào hoặc PDF",
  "chat.attach.voice": "Tin nhắn thoại",
  "chat.attach.voice_desc": "Ghi và gửi một tin nhắn thoại",
  "chat.attach.ecash": "Gửi ecash",
  "chat.attach.ecash_desc": "Gửi sat Cashu từ ví của bạn",
  "chat.attach.location": "Vị trí",
  "chat.attach.location_desc": "Gửi nơi bạn đang ở ngay lúc này",
  "chat.attach.title": "Đính kèm",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Đã chia sẻ một vị trí",
  "chat.location.received_summary": "Đã chia sẻ vị trí của họ",
  "chat.location.title": "Vị trí",
  "chat.location.away": "{distance} về phía {direction}",
  "chat.location.taken": "Lấy {ago} trước",
  "chat.location.open_maps": "Mở trong Bản đồ",
  "chat.location.no_forward": "Vị trí không được chuyển tiếp",
  "chat.location.no_forward_body":
    "Một vị trí chỉ gửi cho một người. Hãy chia sẻ vị trí của chính bạn nếu bạn muốn người khác có nó.",
  "chat.location.no_fix": "Cho phép định vị để biết chỗ này cách bao xa",
  "chat.location.send_title": "Gửi vị trí của bạn",
  "chat.location.send_body":
    "{name} sẽ thấy một điểm: nơi bạn đang ở lúc này. Nó không cập nhật liên tục.",
  "chat.location.send": "Gửi vị trí",
  "chat.location.finding": "Đang tìm vị trí của bạn…",
  "chat.location.no_location": "Không lấy được vị trí của bạn",
  "chat.location.no_location_body":
    "Hãy cho phép truy cập vị trí và bảo đảm dịch vụ định vị đang bật, rồi thử lại.",
  "chat.location.not_delivered": "Không gửi được vị trí của bạn",
  "chat.location.not_delivered_body":
    "Một vị trí chỉ đáng gửi khi nó còn hiện thời, nên nó không xếp hàng để gửi sau. Hãy thử lại khi liên lạc được với {name}.",
  "chat.location.direction.n": "bắc",
  "chat.location.direction.ne": "đông bắc",
  "chat.location.direction.e": "đông",
  "chat.location.direction.se": "đông nam",
  "chat.location.direction.s": "nam",
  "chat.location.direction.sw": "tây nam",
  "chat.location.direction.w": "tây",
  "chat.location.direction.nw": "tây bắc",
  "chat.attach.send_anyway": "Vẫn gửi",
  "chat.attach.bitchat_too_big": "Tệp này có thể không tới nơi",
  "chat.attach.bitchat_too_big_body":
    "{name} đang dùng bitchat, ứng dụng này bỏ dở giữa chừng với tệp lớn. Dưới khoảng 350 KiB thì đáng tin cậy. Gửi cho một liên hệ Airhop thì không có giới hạn như vậy.",
  "chat.attach.bitchat_unopenable": "Họ có thể không mở được tệp này",
  "chat.attach.bitchat_unopenable_body":
    "{name} đang dùng bitchat, ứng dụng này hiện được ảnh và tin nhắn thoại nhưng liệt mọi thứ khác thành tệp nó không mở được. Tệp sẽ tới nơi, chỉ là họ có thể không xem được.",
  "chat.attach.file": "Đính kèm một tệp",
  "chat.attach.unavailable": "Không đính kèm được ở đây",
  "chat.attach.not_sent": "Tệp đính kèm chưa được gửi",
  "chat.attach.read_failed":
    "Có gì đó trục trặc khi đọc tệp đó. Hãy thử tệp khác.",
  "chat.attach.caption": "Thêm chú thích…",
  "chat.attach.send": "Gửi tệp đính kèm",
  "chat.attach.generic": "Tệp đính kèm",
  "chat.media.view_full": "Xem ảnh toàn màn hình",
  "chat.media.gone_photo": "Ảnh không còn trên thiết bị này",
  "chat.media.gone_video": "Video không còn trên thiết bị này",
  "chat.media.gone_voice": "Tin nhắn thoại không còn trên thiết bị này",
  "chat.media.gone_file": "Tệp không còn trên thiết bị này",
  "chat.media.gone_note": "Đã gỡ sau 7 ngày hoặc khi bộ nhớ đệm bị xóa",
  "chat.media.ask_resend": "Hỏi lại",
  "chat.media.resend_draft": "Bạn gửi lại {kind} đó được không?",
  "chat.media.kind_photo": "tấm ảnh",
  "chat.media.kind_video": "video",
  "chat.media.kind_voice": "tin nhắn thoại",
  "chat.media.kind_file": "tệp",
  "chat.media.pause_voice": "Tạm dừng tin nhắn thoại",
  "chat.media.play_voice": "Phát tin nhắn thoại",
  "chat.media.voice_position": "Vị trí trong tin nhắn thoại",
  "chat.media.voice_scrub": "Chạm dọc các vạch để nhảy tới điểm đó",
  "chat.media.image": "Hình ảnh",
  "chat.media.tap_load_photo": "Chạm để tải ảnh",
  "chat.media.open_document": "Mở {name}",
  "chat.media.document": "tài liệu",
  "chat.media.tap_load_video": "Chạm để tải video",
  "chat.media.video": "Video",
  "chat.media.photo": "Ảnh",
  "chat.media.close_photo": "Đóng ảnh",
  "chat.media.save_photo": "Lưu ảnh vào thư viện ảnh của bạn",
  "chat.media.share_photo": "Chia sẻ ảnh",
  "chat.media.saved_videos": "Đã lưu vào video của bạn",
  "chat.media.saved_photos": "Đã lưu vào ảnh của bạn",
  "chat.media.not_saved": "Chưa lưu",
  "chat.media.cant_open": "Không mở được tệp",
  "chat.media.no_app":
    "Thiết bị này không có ứng dụng nào để mở hoặc chia sẻ tệp này.",
  "chat.media.open_failed":
    "Không mở được tệp. Có thể nó đã bị xóa khỏi bộ nhớ đệm.",
  "media.blocked.nostr_only":
    "Bạn chỉ biết người này qua một bộ chuyển tiếp. Chỉ gửi được văn bản. Ảnh, tệp và tin nhắn thoại cần Bluetooth.",
  "media.blocked.private_channel":
    "Tệp đính kèm phát quảng bá thì được ký nhưng không được mã hóa, nên gửi một tệp như vậy vào kênh riêng tư sẽ để nó phơi ra rõ ràng trong khi văn bản ở đây vẫn được mã hóa.",
  "media.blocked.private_group":
    "Tệp đính kèm phát quảng bá thì được ký nhưng không được mã hóa, nên gửi một tệp như vậy vào nhóm riêng tư sẽ để nó phơi ra rõ ràng trong khi văn bản ở đây vẫn được mã hóa.",
  "media.blocked.location_channel":
    "Kênh vị trí tới được mọi người qua Internet, còn ảnh, tệp và tin nhắn thoại thì đi bằng Bluetooth, nên chúng sẽ chẳng bao giờ tới nơi.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Không dùng được tin nhắn thoại ở đây",
  "chat.voice.hold_live": "Giữ để nói trực tiếp",
  "chat.voice.hold_record": "Giữ để ghi một tin nhắn thoại",
  "chat.voice.cancel_recording": "Hủy ghi âm",
  "chat.voice.slide_cancel": "Trượt để hủy",
  "chat.voice.release_cancel": "Thả ra để hủy",
  "chat.voice.a11y_toggle": "Chạm hai lần để bắt đầu hoặc dừng nói.",
  "chat.voice.limit_reached": "Đã đạt giới hạn hai phút, thả ra để gửi",
  "chat.voice.limit_sent": "Đã đạt giới hạn hai phút, tin nhắn đã gửi",
  "chat.voice.stop_send": "Dừng ghi âm và gửi",
  "chat.voice.lift_lock": "Trượt lên để ghi âm rảnh tay",
  "chat.voice.live_speaking": "{name} đang nói",
  "voice.unavailable": "Không dùng được thoại trực tiếp",
  "voice.recording_stopped": "Đã dừng ghi âm",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Quyền truy cập máy ảnh",
  "chat.perm.camera_purpose": "chụp một tấm ảnh để gửi",
  "chat.perm.photo_label": "Quyền truy cập ảnh",
  "chat.perm.photo_purpose": "chọn một tấm ảnh hoặc video để gửi",
  "chat.perm.photo_save_purpose": "lưu thứ này vào ảnh của bạn",
  "chat.perm.mic_label": "Quyền truy cập micrô",
  "chat.perm.mic_live_purpose": "nói chuyện với người ở gần",
  "chat.perm.mic_note_purpose": "ghi một tin nhắn thoại",
  "chat.perm.recording_stopped": "Đã dừng ghi âm",
  "chat.perm.record_failed":
    "Không bắt đầu ghi âm được. Hãy kiểm tra quyền micrô.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Đã nhận",
  "chat.ecash.reclaimed": "Đã thu hồi",
  "chat.ecash.claiming": "Đang nhận…",
  "chat.ecash.claim": "Nhận",
  "chat.ecash.claim_amount": "Nhận {amount} {unit}",
  "chat.ecash.already_claimed": "Đã nhận rồi",
  "chat.ecash.already_claimed_body":
    "Mọi chứng từ trong token này đã có sẵn trong ví của bạn, nên không có gì được thêm vào.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Đã giao cho mạng lưới chuyển đi trong khả năng tốt nhất",
  "chat.info.queued_desc":
    "Được giữ trên điện thoại này cho tới khi có đường tới họ",
  "chat.info.reclaimed": "Đã thu hồi",
  "chat.info.reclaimed_desc":
    "Bạn đã lấy khoản thanh toán này về ví của mình, nên nó sẽ không được chuyển đi",
  "chat.info.about": "Giới thiệu",
  "chat.info.group_desc":
    "Một nhóm riêng tư. Chỉ những thành viên do người tạo thêm vào mới đọc được, và nó chỉ chạy trên Bluetooth.",
  "chat.info.teleported_desc":
    "Một kênh vị trí công khai cho ô geohash này. Bất kỳ ai trong ô, dù dùng Airhop hay bitchat, đều dùng chung nó qua Internet. Bạn đến từ xa, không có mặt trực tiếp ở đây.",
  "chat.info.custom_desc":
    "Một kênh tùy chỉnh. Ai biết tên đều có thể tham gia từ bất kỳ thiết bị Airhop hay bitchat nào.",
  "chat.info.private_e2ee": "Riêng tư · mã hóa đầu cuối",
  "chat.info.public_plain": "Công khai · không mã hóa",
  "chat.info.group_privacy":
    "Chỉ những thành viên hiện bên dưới mới đọc được nhóm này. Tin nhắn ở lại trên Bluetooth, nên thành viên ngoài tầm sẽ nhận được khi họ quay lại.",
  "chat.info.teleport_privacy":
    "Một nơi bạn đến từ xa. Nó tới được mọi người trong ô này qua Internet, và không tới được ai trong tầm Bluetooth.",
  "chat.info.location_off_privacy":
    "Định vị đang tắt, nên kênh này chỉ tới được các thiết bị ở gần qua Bluetooth. Hãy bật định vị để tới được ô khu vực của nó qua Internet.",
  "chat.info.invite_privacy":
    "Chỉ những người bạn mời qua liên kết mới đọc được. Kênh vẫn ẩn với tất cả những người khác, kể cả các nút mạng ở gần.",
  "chat.info.public_privacy":
    "Ai tham gia cũng đọc được mọi tin nhắn. Hãy dùng tin nhắn riêng cho chuyện riêng tư; tin nhắn riêng được mã hóa đầu cuối.",
  "chat.info.remove_member": "Gỡ thành viên",
  "chat.info.remove_member_body":
    "Gỡ {name} khỏi nhóm? Khóa nhóm sẽ được xoay vòng nên họ không đọc được tin nhắn mới nữa.",
  "chat.info.message_member": "Nhắn tin cho {name}",
  "chat.info.remove_member_a11y": "Gỡ {name}",
  "chat.info.no_addable":
    "Không có nút mạng nào tới được để thêm. Thành viên phải ở gần.",
  "chat.info.add_count": "Thêm {count}",
  "chat.info.teleported_tag": "{level}  ·  từ xa",
  "chat.info.active": "Đang hoạt động",
  "chat.info.members": "Thành viên",
  "chat.info.bookmark": "Đánh dấu nơi này",
  "chat.info.remove_bookmark": "Bỏ đánh dấu",
  "chat.info.default_notice":
    "Không rời được các kênh mặc định. Chúng là một phần của giao thức mạng lưới Airhop.",
  "chat.info.custom_channel": "Kênh tùy chỉnh",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Sao chép geohash",
  "chat.info.relays": "Bộ chuyển tiếp",
  "chat.info.show_relays": "Hiện các bộ chuyển tiếp đang mang kênh này",
  "chat.info.relay_custom": "tùy chỉnh",
  "chat.info.relays_none": "Không có. Hiện ô này chỉ chạy trên Bluetooth.",
  "chat.info.search_members": "Tìm thành viên",
  "chat.info.search_members_placeholder": "Tìm thành viên…",
  "chat.info.teleported": "Đến từ xa",
  "chat.info.creator": "Người tạo",
  "chat.info.no_matches": "Không có kết quả khớp",
  "chat.info.no_one_here": "Chưa có ai ở đây",
  "chat.info.add_members": "Thêm thành viên",
  "chat.info.add_selected": "Thêm các thành viên đã chọn",
  "chat.info.add": "Thêm",
  "chat.info.leave_group": "Rời nhóm",
  "chat.info.leave_channel": "Rời kênh",
  "chat.info.leave": "Rời",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Trò chuyện từ {date}",
  "chat.contact.verified_since": "Đã xác minh từ {date}",
  "chat.contact.anonymous": "Ẩn danh",
  "chat.contact.anonymous_desc":
    "Một biệt danh geohash, không có danh tính lâu dài nào để xác minh",
  "chat.contact.verified": "Đã xác minh",
  "chat.contact.verified_desc": "Bạn đã quét mã QR của họ",
  "chat.contact.verified_desc_compared": "Bạn đã đối chiếu mã với họ",
  "chat.contact.not_verified": "Chưa xác minh",
  "chat.contact.not_verified_desc":
    "Hãy quét mã của họ, hoặc đối chiếu một mã qua cuộc gọi, để chắc rằng đúng là họ",
  "chat.contact.e2ee": "Mã hóa đầu cuối",
  "chat.contact.e2ee_nostr":
    "Được gói theo NIP-17 nên bộ chuyển tiếp không đọc được",
  "chat.contact.e2ee_mesh":
    "Noise XX, cộng thêm Double Ratchet giữa các thiết bị Airhop",
  "chat.contact.copy_nostr": "Sao chép khóa công khai Nostr",
  "chat.contact.nostr_key": "Khóa công khai Nostr",
  "chat.contact.cell_key_note":
    "Khóa này thuộc về khu vực nơi hai bạn gặp nhau. Nó thay đổi nếu một trong hai đi nơi khác, và cuộc trò chuyện dừng theo. Hãy trao đổi liên hệ để nói chuyện tiếp ở bất cứ đâu.",
  "chat.contact.peer_name": "Tên nút mạng",
  "chat.contact.peer_id": "ID nút mạng",
  "chat.contact.rename": "Đổi tên",
  "chat.contact.rename_needs_contact":
    "Bạn đổi tên được cho những người mà bạn giữ khóa của họ. Hãy trao đổi thẻ liên hệ trước, rồi cái tên này chỉ mình bạn thấy.",
  "chat.contact.rename_needs_keys":
    "Chưa có khóa cho liên hệ này. Hãy nhắn tin cho họ, hoặc quét mã của họ, rồi bạn có thể đặt cho họ một cái tên chỉ mình bạn thấy.",
  "chat.contact.renamed_by_you": "Tên bạn đặt cho họ",
  "chat.contact.copy_peer_id": "Sao chép ID nút mạng",
  "chat.contact.verify": "Xác minh liên hệ",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Bản tin",
  "chat.notices.post_area": "Đăng một bản tin cho khu vực này",
  "chat.notices.post_mesh": "Đăng một bản tin lên mạng lưới",
  "chat.notices.mark_urgent": "Đánh dấu khẩn",
  "chat.notices.post": "Đăng bản tin",
  "chat.notices.post_short": "Đăng",
  "chat.notices.delete": "Xóa bản tin",
  "chat.notices.just_now": "vừa xong",
  "chat.notices.fades_soon": "sắp mờ đi",
  "chat.notices.1_day": "1 ngày",
  "chat.notices.3_days": "3 ngày",
  "chat.notices.7_days": "7 ngày",
  "chat.notices.fading": "đang mờ đi",
  "chat.notices.fades_in_hours": "mờ đi sau {count} giờ",
  "chat.notices.fades_in_days": "mờ đi sau {count} ngày",
  "chat.notices.scope_geo": "Địa lý",
  "chat.notices.scope_mesh": "Mạng lưới",
  "chat.notices.urgent_short": "Khẩn",
  "chat.notices.permanent_warning":
    "Không bao giờ mờ đi. Nó công khai, gắn với khu vực này, và bạn không lấy lại được.",
  "chat.notices.none":
    "Chưa có bản tin nào. Hãy đăng một bản để nó ở lại đây cho người khác.",

  // ---- Chats: search results ----
  "chat.search.photos": "Ảnh",
  "chat.search.videos": "Video",
  "chat.search.audio": "Âm thanh",
  "chat.search.documents": "Tài liệu",
  "chat.search.links": "Liên kết",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Lọc theo {filter}",
  "chat.search.no_matches": "Không có {filter} nào khớp với “{query}”",
  "chat.search.no_media": "Chưa có {filter} nào",
  "chat.search.result_a11y": "{chat}, {kind} từ {sender}",
  "chat.search.you": "bạn",
  "chat.search.section_chats": "Cuộc trò chuyện",
  "chat.search.section_messages": "Tin nhắn",
  "chat.search.section_notices": "Bản tin",
  "chat.search.hint":
    "Tìm trong tin nhắn và cuộc trò chuyện, hoặc chọn một bộ lọc ở trên.",
  "chat.search.no_results": "Không có kết quả cho “{query}”",
  "chat.search.open_chat": "Mở {name}",
  "chat.search.message_a11y": "{chat}, tin nhắn từ {sender}: {snippet}",
  "chat.search.notice_a11y": "Bản tin trong {chat} từ {author}: {snippet}",
  "chat.search.urgent": "Khẩn ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "{count} trong danh sách này. Xóa chỉ gỡ chúng khỏi đây thôi, còn tin nhắn vẫn chưa đọc trong cuộc trò chuyện của chúng. Đánh dấu tất cả đã đọc thì xóa cả hai bên.",
  "chat.notif.mark_all_read": "Đánh dấu tất cả đã đọc",
  "chat.notif.clear_list": "Xóa danh sách",
  "chat.notif.clear_all_a11y": "Xóa toàn bộ {count} thông báo",
  "chat.notif.title": "Thông báo",
  "chat.notif.clear_short": "Xóa",
  "chat.notif.close": "Đóng thông báo",
  "chat.notif.none": "Chưa có thông báo nào",
  "chat.notif.none_desc":
    "Tin nhắn, lượt nhắc tên và bản tin từ các kênh và cuộc trò chuyện của bạn sẽ hiện ở đây.",
  "chat.notif.new": "Mới",
  "chat.notif.notice_in": "bản tin trong {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Chuyển tiếp tới…",
  "chat.forward.to": "Chuyển tiếp tới {name}",
  "chat.forward.cant_send_here": "Không chuyển tiếp được ở đây",
  "chat.forward.cant_send_to": "Không chuyển tiếp được tới {name}",
  "chat.forward.channels": "Kênh",
  "chat.forward.groups": "Nhóm",
  "chat.forward.locations": "Vị trí",
  "chat.forward.dms": "Tin nhắn riêng",
  "chat.forward.none": "Chưa có cuộc trò chuyện nào khác",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Đang khởi động mạng lưới…",
  "mesh.banner.no_bluetooth": "Thiết bị này không có Bluetooth · chỉ Internet",
  "mesh.banner.bluetooth_off": "Bluetooth đã tắt · không dùng được mạng lưới",
  "mesh.banner.permission_needed": "Cần quyền Bluetooth",
  "mesh.banner.blocked": "Bluetooth bị chặn · hãy cho phép trong Cài đặt",
  "mesh.banner.location_permission": "Cần vị trí để tìm nút mạng",
  "mesh.banner.advertising_unsupported":
    "Điện thoại này thấy được người khác nhưng không để bị tìm thấy",
  "mesh.banner.location_off_android":
    "Vị trí đã tắt · Android cần nó để tìm nút mạng",
  "mesh.banner.paused": "Mạng lưới tạm dừng · bạn đang vắng mặt",
  "mesh.banner.location_off": "Vị trí đã tắt · không dùng được kênh vị trí",
  "mesh.banner.battery_saver": "Tiết kiệm pin · quét thưa hơn",
  "mesh.banner.wipe_incomplete":
    "Xóa chưa xong · có thể còn sót dữ liệu, mở lại sẽ thử tiếp",
  "mesh.banner.wifi_off": "Wi-Fi đã tắt · tệp lớn gửi chậm hơn",
  "mesh.banner.clock_skew":
    "Đồng hồ của điện thoại này sai · hãy đặt ngày giờ về tự động",
  "mesh.banner.internet_off": "Internet đã tắt · chỉ Bluetooth",
  "mesh.banner.relaying":
    "Không có nút mạng cục bộ · đang chuyển tiếp qua Nostr",
  "mesh.banner.tor": "Tor đang bật · lưu lượng Internet đã được định tuyến",
  "mesh.banner.tor_starting": "Đang khởi động Tor · kết nối",
  "mesh.banner.tor_blocked": "Tor không kết nối được · mạng lưới vẫn chạy",
  "mesh.banner.gateway":
    "Cổng kết nối Internet đang bật · đang chuyển tiếp cho nút mạng ở gần",
  "mesh.banner.bridge":
    "Cầu nối mạng lưới đang bật · đã nối cuộc trò chuyện công khai",
  "mesh.banner.background_limits":
    "{brand} có thể tạm dừng mạng lưới khi chạy nền",
  "mesh.banner.bridge_across":
    "Cầu nối mạng lưới đang bật · {count} ở bên kia cầu",
  "mesh.banner.action.turn_on": "Bật",
  "mesh.banner.action.allow": "Cho phép",
  "mesh.banner.action.resume": "Tiếp tục",
  "mesh.banner.action.fix": "Sửa",
  "mesh.banner.hint.resume": "Bật lại việc phát và quét Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Yêu cầu Android bật Bluetooth",
  "mesh.banner.hint.location_settings": "Mở phần cài đặt vị trí của hệ thống",
  "mesh.banner.hint.app_settings":
    "Mở phần quyền của Airhop trong cài đặt hệ thống",
  "mesh.banner.hint.battery_settings":
    "Mở cài đặt hoạt động nền của điện thoại này",
  "mesh.banner.dismiss": "Bỏ qua: {label}",
  "mesh.banner.hint.dismiss": "Ẩn hẳn ghi chú này",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Đang quét tìm nút mạng ở gần…",
  "mesh.radar.starting": "Đang khởi động mạng lưới…",
  "mesh.radar.no_bluetooth": "Thiết bị này không có Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth đã tắt · không quét",
  "mesh.radar.permission_needed": "Cần quyền Bluetooth",
  "mesh.radar.blocked": "Bluetooth bị chặn",
  "mesh.radar.location_permission": "Cần quyền vị trí",
  "mesh.radar.location_off": "Vị trí đã tắt · không quét",
  "mesh.radar.hint_rings":
    "Các vòng thể hiện cường độ tín hiệu BLE, không phải khoảng cách",
  "mesh.radar.hint_checking": "Đang kiểm tra Bluetooth và các quyền",
  "mesh.radar.hint_internet": "Tin nhắn vẫn đi qua Internet được",
  "mesh.radar.hint_turn_on": "Hãy bật Bluetooth để tìm ra nút mạng",
  "mesh.radar.hint_allow": "Hãy cho phép Bluetooth để tìm ra nút mạng",
  "mesh.radar.hint_allow_settings":
    "Hãy cho phép Bluetooth trong Cài đặt để tìm ra nút mạng",
  "mesh.radar.hint_location_permission":
    "Android 11 trở về trước cần vị trí mới quét được qua Bluetooth",
  "mesh.radar.hint_android_location":
    "Android cần bật vị trí mới trả về kết quả quét Bluetooth",
  "mesh.radar.signal_strong": "Mạnh",
  "mesh.radar.signal_medium": "Vừa",
  "mesh.radar.signal_weak": "Yếu",
  "mesh.radar.you_center": "Bạn, ở tâm của mạng lưới",
  "mesh.radar.sonar_hint":
    "Phát một lượt quét kiểu định vị thủy âm. Việc quét vốn đã diễn ra liên tục.",
  "mesh.radar.paused": "Mạng lưới tạm dừng · bạn đang vắng mặt",
  "mesh.radar.ring_hint":
    "Vị trí trên vòng phản ánh cường độ tín hiệu, không phải khoảng cách",
  "mesh.radar.set_online":
    "Hãy đặt trạng thái của bạn thành Trực tuyến trong phần Hồ sơ để tìm ra nút mạng",
  "mesh.radar.in_range": "trong tầm",
  "mesh.radar.recently_seen": "vừa thấy gần đây",
  "mesh.radar.peer_hint":
    "Mở các tùy chọn để nhắn tin hoặc trả tiền cho nút mạng này",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "vừa xong",
  "mesh.peer.none": "Không có nút mạng nào ở gần",
  "mesh.peer.none_desc":
    "Các thiết bị Airhop hoặc bitchat khác trong tầm Bluetooth sẽ hiện ở đây.",
  "mesh.peer.id_copied": "Đã sao chép ID nút mạng",
  "mesh.peer.copy_id": "Sao chép ID nút mạng",
  "mesh.peer.their_name": "Tự xưng là {name}",
  "mesh.peer.in_range": "Trong tầm",
  "mesh.peer.relay": "Nút chuyển tiếp",
  "mesh.peer.relay_body":
    "Một máy phát ai đó để chạy nhằm nới rộng mạng lưới. Nó mang những tin nhắn mà chính nó không đọc được. Ở đây không có ai để nhắn tin cả.",
  "mesh.peer.send_dm": "Gửi một tin nhắn riêng",
  "mesh.peer.message": "Tin nhắn",
  "mesh.peer.send_sats": "Gửi ecash",
  "mesh.peer.amount_placeholder": "Số tiền tính bằng sat",
  "mesh.peer.amount_first": "Gửi ecash, hãy nhập số tiền trước",
  "mesh.peer.cancel_send": "Hủy gửi ecash",
  "mesh.peer.view_peer": "Xem nút mạng {name}",
  "mesh.peer.view_peer_online": "Xem nút mạng {name}, đang trực tuyến",
  "mesh.peer.last_seen": "Thấy lần cuối {ago} trước",
  "mesh.peer.send_amount": "Gửi {amount} sat",
  "mesh.peer.direct": "Kết nối trực tiếp",
  "mesh.peer.check_distance": "Đo khoảng cách",
  "mesh.peer.checking": "Đang đo",
  "mesh.peer.no_reply": "Không có hồi đáp",
  "mesh.peer.no_reply_hint":
    "Có thể họ đã đi khỏi, hoặc ứng dụng của họ không trả lời",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Vùng",
  "mesh.level.province": "Tỉnh",
  "mesh.level.city": "Thành phố",
  "mesh.level.neighborhood": "Khu dân cư",
  "mesh.level.block": "Khu phố",
  "mesh.level.building": "Tòa nhà",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Có thể tiêu",
  "wallet.balance.unit_hint": "Chuyển qua lại giữa satoshi và bitcoin",
  "wallet.balance.a11y": "Số dư {value} {unit}",
  "wallet.balance.locked":
    "Kho ví đang bị khóa. Chứng từ ecash được giữ trong một tệp mã hóa có khóa nằm trong chuỗi khóa của thiết bị, và tệp đó không mở được. Hãy mở khóa thiết bị rồi mở lại Airhop.",
  "wallet.balance.tor_blocked":
    "Tor đang bật, nên các yêu cầu tới nhà đúc bị chặn: chúng sẽ đi ra qua mạng trần và gắn IP của bạn với chứng từ của bạn. Gửi và nhận qua mạng lưới vẫn chạy. Hãy cho phép lưu lượng nhà đúc trong Cài đặt, Bảo mật.",
  "wallet.balance.unconfirmed_note": "{amount} chưa được nhà đúc xác nhận",
  "wallet.balance.reserved_note":
    "{amount} đang giữ cho một lần gửi đang trên đường",
  "wallet.balance.other_mint_note": "{amount} ở một tài khoản nhà đúc riêng",
  "wallet.balance.test_mint_note":
    "Bao gồm tiền chơi từ một nhà đúc thử nghiệm. Đó không phải bitcoin và không rút ra được.",
  "wallet.token": "Token",
  "wallet.action.send": "Gửi token ecash",
  "wallet.action.send_disabled":
    "Gửi token ecash, không dùng được khi số dư bằng không",
  "wallet.action.receive": "Nhận token ecash",
  "wallet.action.zap": "Zap một liên hệ Nostr",
  "wallet.action.zap_disabled":
    "Zap một liên hệ Nostr, không dùng được khi số dư bằng không",
  "wallet.action.add_mint": "Thêm một nhà đúc Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Không dựng được token",
  "wallet.send.title": "Gửi ecash",
  "wallet.send.amount_in": "Số tiền tính bằng {unit}",
  "wallet.send.body":
    "Được dựng ngoại tuyến từ những chứng từ bạn đã có. Không có gì rời số dư của bạn vĩnh viễn cho tới khi bạn xác nhận token đã tới nơi.",
  "wallet.send.stale_fee_note":
    "Phí được kiểm tra lần cuối cách đây {days} ngày. Nếu nhà đúc này đã tăng phí kể từ đó, lần gửi này có thể tốn hơn một chút.",
  "wallet.send.fee_note":
    "{spend} {unit} rời số dư của bạn; phần {fee} thêm vào bù cho khoản phí nhà đúc mà họ lẽ ra phải trả",
  "wallet.send.qr_too_big":
    "Token này bị chia thành quá nhiều đồng để vừa một mã QR. Hãy chia sẻ hoặc sao chép nó, hoặc làm mới ở nhà đúc để gộp lại.",
  "wallet.send.bearer_note":
    "Ai giữ chuỗi ký tự này thì người đó sở hữu số tiền. Các chứng từ đang được giữ chứ chưa tiêu: nếu nó không bao giờ tới tay ai, bạn có thể thu hồi trong mục Đang chờ.",
  "wallet.send.qr_too_big_short":
    "Token này bị chia thành quá nhiều đồng để vừa một mã QR. Hãy chia sẻ hoặc sao chép nó.",
  "wallet.send.scan_note":
    "Hãy để họ quét mã này từ ví của họ. Vẫn thu hồi được cho tới khi bạn đánh dấu là đã chuyển.",
  "wallet.send.mesh_note":
    "Token đi ra dưới dạng tin nhắn riêng được mã hóa qua mạng lưới. Không cần Internet.",
  "wallet.send.no_peers_note":
    "Hãy mở thẻ Mạng lưới để tìm thiết bị ở gần, hoặc chia sẻ token theo cách khác.",
  "wallet.send.send_to": "Gửi cho {name}",
  "wallet.send.memo": "Ghi chú (không bắt buộc, đi kèm token)",
  "wallet.send.building": "Đang dựng…",
  "wallet.send.build": "Dựng token",
  "wallet.send.inexact_body":
    "Chứng từ của bạn không tạo ra được đúng {amount} {unit} khi ngoại tuyến. Token nhỏ nhất bạn dựng được là {spend} {unit}, mà ngoại tuyến thì không có tiền thối: phần dư {extra} {unit} sẽ thuộc về người nhận.\n\nLàm mới ở nhà đúc khi có mạng sẽ chia chứng từ của bạn thành các mệnh giá tạo ra đúng số này.",
  "wallet.send.send_amount": "Gửi {amount}",
  "wallet.send.sent_to": "Đã gửi {amount} {unit} cho {name}",
  "wallet.send.sent_to_body":
    "{route} Nó vẫn thu hồi được trong mục Đang chờ cho tới khi bạn xác nhận họ đã nhận, hoặc cho tới khi nhà đúc báo rằng các chứng từ đã được đổi.",
  "wallet.send.copy_token": "Sao chép token",
  "wallet.send.share_token": "Chia sẻ token",
  "wallet.send.open_in_wallet": "Mở token này trong một ví khác",
  "wallet.send.open_in_wallet_short": "Mở trong ví",
  "wallet.send.to_peer": "Gửi token cho một nút mạng ở gần",
  "wallet.send.to_peer_short": "Gửi cho nút mạng",
  "wallet.send.mark_delivered": "Đánh dấu đã chuyển và kết thúc",
  "wallet.send.they_got_it": "Họ đã nhận được",
  "wallet.send.keep_pending": "Giữ lần gửi này ở trạng thái đang chờ",
  "wallet.send.decide_later": "Quyết định sau",
  "wallet.send.no_peers": "Không có nút mạng nào trong tầm",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Đây là khoản thanh toán của chính bạn",
  "wallet.receive.own_payment_body":
    "Những đồng này vẫn đang được giữ cho một lần gửi bạn chưa tất toán, nên không có gì để nhận. Hãy dùng Thu hồi trên khoản thanh toán đó để đưa chúng thẳng về số dư.",
  "wallet.receive.already_have": "Đã có trong ví của bạn",
  "wallet.receive.already_have_body":
    "Mọi chứng từ trong token này đã được lưu ở đây, nên không có gì được thêm vào. Số dư không đổi.",
  "wallet.receive.stored_unconfirmed":
    "Đã lưu từ {mint}, nhưng chưa được nhà đúc xác nhận ({reason}).",
  "wallet.receive.offline": "ngoại tuyến",
  "wallet.receive.redeemed_here":
    "Đã đổi tại {mint}. Các chứng từ này giờ chỉ thuộc về mình bạn: bản sao của người gửi không còn dùng được.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Đã đổi tại {mint}. Giờ nó chứng minh được là của bạn: bản sao token này của người gửi không còn dùng được.",
  "wallet.receive.stored_pending":
    "Đã lưu từ {mint}, nhưng nhà đúc chưa xác nhận nó chưa bị tiêu{dleq}. Hãy làm mới từ thẻ Ví khi bạn có mạng.",
  "wallet.receive.dleq_inline":
    " (chữ ký của nó đúng là hợp lệ, nên token là thật)",
  "wallet.receive.dleq_ok": "Chữ ký của nhà đúc hợp lệ, nên token là thật.",
  "wallet.receive.dleq_uncached":
    "Khóa của nhà đúc không được lưu sẵn ở đây, nên không kiểm tra được chữ ký khi ngoại tuyến.",
  "wallet.receive.dleq_warning":
    "Cho tới khi bạn làm mới lúc có mạng, về lý thuyết người gửi có thể đã tiêu nó ở nơi khác.",
  "wallet.receive.failed": "Không nhận được",
  "wallet.receive.title": "Nhận ecash",
  "wallet.receive.body":
    "Dán một token Cashu. Khi có mạng, nó được đổi ngay tại nhà đúc; khi ngoại tuyến, nó được lưu lại và xác nhận vào lần làm mới kế tiếp.",
  "wallet.receive.scan": "Quét một mã QR ecash",
  "wallet.receive.scan_short": "Quét QR",
  "wallet.receive.receiving": "Đang nhận…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Đã nhận Nutzap từ {from}… và đổi vào ví của bạn.",
  "wallet.zap.title": "Zap một danh tính Nostr",
  "wallet.zap.not_npub": "không phải npub",
  "wallet.zap.bad_key": "khóa hỏng",
  "wallet.zap.invalid_pubkey": "Khóa công khai không hợp lệ",
  "wallet.zap.invalid_pubkey_body":
    "Hãy nhập một npub1… hoặc một khóa công khai Nostr dạng hex 64 ký tự.",
  "wallet.zap.sent": "Đã gửi Nutzap",
  "wallet.zap.failed": "Zap thất bại",
  "wallet.zap.body":
    "Nếu họ công bố thông tin nutzap NIP-61, khoản ecash sẽ bị khóa vào khóa của họ nên không ai khác tiêu được, và cũng không lấy lại được. Nếu không, nó đi dưới dạng một token có thể thu hồi. Bạn sẽ được báo là trường hợp nào đã xảy ra.",
  "wallet.zap.contact": "Zap {name}",
  "wallet.zap.pubkey_placeholder": "npub1… hoặc hex 64 ký tự",
  "wallet.zap.sending": "Đang gửi…",
  "wallet.nostr.copied_body":
    "Đưa cái này cho ai đó và họ có thể zap bạn từ Airhop hay bất kỳ ví Nostr nào khác, không cần Bluetooth.",
  "wallet.nostr.copy_key":
    "Sao chép khóa Nostr của bạn để mọi người zap được cho bạn",
  "wallet.nostr.your_key": "Khóa Nostr của bạn",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Đã thêm nhà đúc",
  "wallet.mint.add_failed": "Không thêm được nhà đúc",
  "wallet.mint.added_named": "Đã thêm {name}",
  "wallet.mint.added_body":
    "{mint} phát hành {units}. Khóa của nó đã được lưu sẵn trên thiết bị này, nên token từ nó giờ kiểm tra được kể cả khi không có mạng.",
  "wallet.mint.remove_plain":
    "Gỡ {mint} khỏi ví của bạn? Khóa lưu sẵn của nó cũng mất theo, nên token từ nó không kiểm tra được khi ngoại tuyến nữa.",
  "wallet.mint.title": "Nhà đúc",
  "wallet.mint.none": "Chưa có nhà đúc nào",
  "wallet.mint.none_desc":
    "Nhà đúc phát hành và đổi ecash của bạn. Hãy thêm một nhà đúc để nạp qua Lightning, hoặc cứ nhận một token thì nhà đúc của nó tự được thêm giúp bạn.",
  "wallet.mint.add": "Thêm một nhà đúc",
  "wallet.mint.add_body":
    "Nhà đúc giữ số Bitcoin bảo chứng cho ecash của bạn, nên hãy chọn một nơi bạn tin tưởng với số dư bạn để ở đó. URL được kiểm tra trước khi lưu. Hãy tự chạy một nhà đúc bằng Nutshell nếu bạn không muốn tin ai cả.",
  "wallet.mint.consolidate_body":
    "Một token chỉ nêu tên được đúng một nhà đúc, nên số dư trải khắp nhiều nhà đúc không trả nổi một khoản lớn hơn phần lớn nhất trong đó. Airhop có thể dời nó: mỗi nhà đúc còn lại trả một hóa đơn Lightning do nhà đúc bạn chọn phát hành. Tốn một khoản phí định tuyến nhỏ và cần Internet.",
  "wallet.mint.add_short": "Thêm nhà đúc",
  "wallet.mint.checking": "Đang kiểm tra…",
  "wallet.mint.remove_with_balance": "Gỡ nhà đúc còn số dư?",
  "wallet.mint.remove": "Gỡ nhà đúc",
  "wallet.mint.delete_anyway": "Vẫn xóa",
  "wallet.mint.consolidate": "Dời toàn bộ số dư về một nhà đúc",
  "wallet.mint.confirm_with": "Xác nhận chứng từ với {mint}",
  "wallet.mint.remove_a11y": "Gỡ {mint}",
  "wallet.mint.available_amount": "Có sẵn {amount} {unit}",
  "wallet.mint.split_across":
    "Số dư trải khắp {count} nhà đúc. Hãy dời về một nơi.",
  "wallet.mint.move_everything_to": "Dời mọi thứ về {mint}",
  "wallet.mint.consolidate_title": "Dời về một nhà đúc",
  "wallet.mint.moving": "Đang dời…",
  "wallet.mint.move": "Dời",
  "wallet.mint.moved": "Đã dời",
  "wallet.mint.moved_body":
    "{amount} {unit} giờ nằm ở {mint}, sau khi trả {fees} {unit} phí định tuyến Lightning.",
  "wallet.mint.nothing_moved": "Không dời được gì",
  "wallet.mint.destination": "· đích đến",
  "wallet.mint.will_move": "· sẽ được dời",
  "wallet.mint.issued_by": "Phát hành bởi",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Nạp tiền ví Airhop",
  "wallet.ln.invoice_failed": "Không tạo được hóa đơn",
  "wallet.ln.price_failed": "Không định giá được hóa đơn này",
  "wallet.ln.paid": "Đã trả",
  "wallet.ln.deposit_credited":
    "Hóa đơn đã trả và {mint} đã phát hành {amount} {unit}. Số dư này đã được xác nhận: bạn tiêu được ngoại tuyến ngay lập tức.",
  "wallet.ln.withdrawn":
    "Đã trả {paid} sat qua Lightning. Nhà đúc thu {fee} sat phí định tuyến.",
  "wallet.ln.withdrawn_with_change":
    "Đã trả {paid} sat qua Lightning. Nhà đúc thu {fee} sat phí định tuyến, và trả lại {change} sat trong phần dự phòng về số dư của bạn.",
  "wallet.ln.payment_failed": "Thanh toán thất bại",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Biến sat trên Lightning thành ecash tiêu được khi ngoại tuyến, hoặc rút ecash ra trả cho bất kỳ hóa đơn Lightning nào. Cả hai đều cần Internet và một nhà đúc.",
  "wallet.ln.deposit_body":
    "Nhà đúc đưa bạn một hóa đơn. Hãy trả nó từ bất kỳ ví Lightning nào và số sat sẽ quay về dưới dạng ecash tiêu được khi ngoại tuyến.",
  "wallet.ln.pay_invoice_for":
    "Trả hóa đơn {amount} {unit} này. Ví đang theo dõi khoản thanh toán và sẽ tự phát hành ecash cho bạn.",
  "wallet.ln.expired_body":
    "Hóa đơn này đã hết hạn. Nếu bạn đã trả rồi, số dư sẽ được cộng tự động.",
  "wallet.ln.waiting_expires": "Đang đợi thanh toán · hết hạn sau {countdown}",
  "wallet.ln.withdraw_body":
    "Dán một hóa đơn bolt11 và nhà đúc trả nó bằng ecash của bạn. Bạn được báo giá phần dự phòng định tuyến trước; phần định tuyến không dùng tới sẽ quay về số dư của bạn.",
  "wallet.ln.up_to": "tối đa {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Trả {amount} {unit}",
  "wallet.ln.deposit": "Nạp sat qua Lightning",
  "wallet.ln.deposit_short": "Nạp",
  "wallet.ln.withdraw": "Rút về một hóa đơn Lightning",
  "wallet.ln.withdraw_short": "Rút",
  "wallet.ln.deposit_title": "Nạp qua Lightning",
  "wallet.ln.amount_placeholder": "Số tiền tính bằng sat",
  "wallet.ln.requesting": "Đang yêu cầu…",
  "wallet.ln.get_invoice": "Lấy hóa đơn",
  "wallet.ln.copy_invoice": "Sao chép hóa đơn",
  "wallet.ln.open_wallet": "Mở trong một ví Lightning",
  "wallet.ln.open_wallet_short": "Mở trong ví",
  "wallet.ln.waiting": "Đang đợi thanh toán…",
  "wallet.ln.new_invoice": "Tạo một hóa đơn mới",
  "wallet.ln.new_invoice_short": "Hóa đơn mới",
  "wallet.ln.withdraw_title": "Rút về Lightning",
  "wallet.ln.scan_invoice": "Quét mã QR của một hóa đơn Lightning",
  "wallet.ln.paid_from": "Trả từ",
  "wallet.ln.invoice": "Hóa đơn",
  "wallet.ln.routing_reserve": "Dự phòng định tuyến",
  "wallet.ln.reserved": "Đã giữ từ số dư",
  "wallet.ln.paying": "Đang trả…",
  "wallet.ln.get_quote": "Lấy báo giá",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Sao lưu",
  "wallet.backup.setup_failed": "Không thiết lập được sao lưu",
  "wallet.backup.on": "Sao lưu đang bật",
  "wallet.backup.on_body":
    "Số dư của bạn giờ có thể dựng lại từ mười hai từ đó.\n\nNhững gì người khác đưa bạn nằm ngoài cụm từ cho tới khi bạn làm mới ở nhà đúc, và việc khôi phục cần danh sách nhà đúc của bạn, nên hãy ghi nó lại bên cạnh các từ.",
  "wallet.backup.no_phrase": "Không có cụm từ nào được lưu",
  "wallet.backup.no_phrase_body":
    "Không đọc được cụm từ khôi phục từ chuỗi khóa của thiết bị. Hãy mở khóa thiết bị rồi thử lại.",
  "wallet.backup.replace_title": "Thay cụm từ hiện tại của bạn?",
  "wallet.backup.replace_body":
    "Bạn đã có một cụm từ khôi phục rồi. Khôi phục một cụm khác sẽ thay thế nó. Những đồng đã được cụm từ cũ bao phủ vẫn tiêu được trên thiết bị này, nhưng không khôi phục lại được nữa, nên hãy chắc rằng các từ cũ đã được ghi lại trước khi tiếp tục.",
  "wallet.backup.replace": "Thay",
  "wallet.backup.invalid_phrase": "Cụm từ đó không hợp lệ",
  "wallet.backup.invalid_phrase_body":
    "Cụm từ có sẵn một mã kiểm tra và cụm này không qua được. Hãy tìm xem có từ nào gõ sai, thiếu hay bị đổi chỗ không.",
  "wallet.backup.not_bip39":
    "Đây không phải các từ BIP-39: {words}. Hãy kiểm tra chính tả.",
  "wallet.backup.add_mint_first": "Hãy thêm một nhà đúc trước",
  "wallet.backup.add_mint_first_body":
    "Việc khôi phục hoạt động bằng cách hỏi nhà đúc xem nó đã ký những đồng nào cho bạn, nên nó cần biết phải hỏi nhà đúc nào. Hãy thêm những nhà đúc bạn đang dùng, rồi khôi phục.",
  "wallet.backup.restore_failed": "Khôi phục thất bại",
  "wallet.backup.phrase": "Cụm từ khôi phục",
  "wallet.backup.state_unconfirmed":
    "Sao lưu đang bật nhưng chưa được xác nhận",
  "wallet.backup.state_off": "Sao lưu đang tắt",
  "wallet.backup.badge_on": "Bật",
  "wallet.backup.badge_unconfirmed": "Chưa xác nhận",
  "wallet.backup.badge_off": "Tắt",
  "wallet.backup.view": "Xem cụm từ khôi phục",
  "wallet.backup.setup": "Thiết lập cụm từ khôi phục",
  "wallet.backup.view_short": "Xem cụm từ",
  "wallet.backup.setup_short": "Thiết lập",
  "wallet.backup.restore": "Khôi phục một ví từ cụm từ khôi phục",
  "wallet.backup.restore_short": "Khôi phục",
  "wallet.backup.setup_title": "Thiết lập một cụm từ khôi phục",
  "wallet.backup.on_body_short":
    "Số dư của bạn có thể dựng lại trên thiết bị mới từ mười hai từ của bạn.",
  "wallet.backup.unconfirmed_body":
    "Bạn chưa bao giờ xác nhận đã ghi lại một bản. Ngay lúc này các từ chỉ tồn tại trên chiếc điện thoại này, mà đó lại chính là thứ một bản sao lưu phải sống sót qua được. Hãy xem cụm từ và ghi nó ra giấy.",
  "wallet.backup.not_covered":
    "{amount} chưa được bao phủ. Những đồng người khác đưa bạn mang bí mật của người gửi, nên chúng chỉ thuộc cụm từ của bạn sau khi được hoán đổi. Hãy làm mới một nhà đúc để giữ chắc chúng.",
  "wallet.backup.off_body":
    "Ecash của bạn chỉ tồn tại trên chiếc điện thoại này. Nếu mất nó, không ai lấy lại được số tiền, kể cả bạn. Cụm từ khôi phục gồm mười hai từ có thể dựng lại số dư của bạn ở bất cứ đâu.",
  "wallet.backup.about_to_see":
    "Bạn sắp thấy mười hai từ. Chúng chính là tiền.",
  "wallet.backup.exact_order":
    "Mười hai từ, đúng thứ tự này. Ai có chúng thì có số dư của bạn.",
  "wallet.backup.verify_body":
    "Một cụm từ không ai ghi lại còn tệ hơn không có cụm từ nào, vì nó trông như một tấm lưới an toàn mà thực ra không có ở đó. Hãy xác nhận hai từ.",
  "wallet.backup.verify_mismatch": "Không khớp. Hãy đối chiếu bản bạn đã ghi.",
  "wallet.backup.restore_body":
    "Hãy nhập mười hai từ. Airhop dẫn lại các đồng của bạn và hỏi từng nhà đúc xem nó đã ký những đồng nào, nhờ vậy số dư quay về từ chính sổ sách nhà đúc lưu giữ.",
  "wallet.backup.warn_secret":
    "Bất kỳ ai đọc được chúng đều lấy được số dư của bạn. Đừng chụp màn hình và đừng lưu chúng trên chiếc điện thoại này.",
  "wallet.backup.warn_paper":
    "Hãy viết chúng ra giấy và cất ở nơi an toàn. Airhop không thể hiện lại chúng cho bạn nếu chiếc điện thoại không còn.",
  "wallet.backup.warn_scope":
    "Chúng chỉ dựng lại ecash của bạn. Danh tính, cuộc trò chuyện và liên hệ của bạn không nằm trong đó.",
  "wallet.backup.warn_mints":
    "Việc khôi phục buộc phải hỏi nhà đúc xem nó đã ký những đồng nào, nên hãy ghi danh sách nhà đúc của bạn bên cạnh các từ.",
  "wallet.backup.preparing": "Đang chuẩn bị…",
  "wallet.backup.show_phrase": "Hiện cụm từ của tôi",
  "wallet.backup.your_phrase": "Cụm từ khôi phục của bạn",
  "wallet.backup.write_down": "Hãy ghi những từ này lại",
  "wallet.backup.copy_phrase": "Sao chép cụm từ khôi phục vào bảng nhớ tạm",
  "wallet.backup.copy_clipboard": "Sao chép vào bảng nhớ tạm",
  "wallet.backup.written_down": "Tôi đã ghi chúng lại",
  "wallet.backup.check_copy": "Đối chiếu bản bạn đã ghi",
  "wallet.backup.confirm": "Xác nhận",
  "wallet.backup.restore_title": "Khôi phục từ một cụm từ",
  "wallet.backup.phrase_placeholder": "mười hai từ, cách nhau bằng dấu cách",
  "wallet.backup.no_mints_yet":
    "Chưa thêm nhà đúc nào. Việc khôi phục buộc phải hỏi một nhà đúc cụ thể, nên hãy thêm những nhà đúc bạn đang dùng trước.",
  "wallet.backup.scanning": "Đang quét…",
  "wallet.backup.restore_progress": "{mint} · bộ khóa {step} trên {total}",
  "wallet.backup.will_scan":
    "Sẽ quét: {mints}. Một nhà đúc bạn chưa thêm sẽ không bao giờ được hỏi tới, nên số dư ở đó vẫn vô hình.",
  "wallet.backup.word_n": "Từ {position}",
  "wallet.backup.unreachable_mints":
    "Không kết nối được: {mints}. Số dư ở đó vẫn còn nguyên ngoài kia. Hãy thử lại khi bạn có kết nối tốt hơn.",
  "wallet.backup.nothing_recovered":
    "Không khôi phục được gì từ các nhà đúc đã quét.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Đánh dấu là đã nhận?",
  "wallet.delivered.body":
    "Việc này nhả {amount} {unit} ra vĩnh viễn. Nếu thực ra nó chưa từng tới nơi, bạn sẽ không thu hồi được nữa.",
  "wallet.delivered.body_generic":
    "Việc này nhả khoản đang giữ ra vĩnh viễn. Nếu thực ra nó chưa từng tới nơi, bạn sẽ không thu hồi được nữa.",
  "wallet.delivered.cancel": "Chưa đâu",
  "wallet.delivered.confirm": "Họ đã nhận được",
  "wallet.reclaim.title": "Thu hồi token này?",
  "wallet.reclaim.body":
    "{amount} {unit} sẽ quay về số dư của bạn. Chỉ làm vậy nếu token chưa từng tới tay ai: nếu họ đã có chuỗi ký tự đó, ai đổi nó ở nhà đúc trước thì người đó giữ số tiền, và người đó có thể chính là họ.",
  "wallet.reclaim.keep": "Giữ đang chờ",
  "wallet.reclaim.confirm": "Thu hồi",
  "wallet.copied.token_body":
    "Token đang nằm trên bảng nhớ tạm của bạn. Nó vẫn được giữ ở đây cho tới khi bạn đánh dấu là đã chuyển, nên bạn dán lại được nếu lần đầu không thành.",
  "wallet.copied.phrase_body":
    "Hãy dán nó vào một trình quản lý mật khẩu, rồi xóa bảng nhớ tạm. Các ứng dụng khác đọc được bảng nhớ tạm, và trên một số thiết lập nó còn đồng bộ sang các thiết bị khác của bạn.",
  "wallet.refresh.failed": "Làm mới thất bại",
  "wallet.refresh.partly": "Đã làm mới một phần",
  "wallet.refresh.done": "Đã làm mới",
  "wallet.refresh.unreachable":
    "Không kết nối được {mints}. Mọi thứ khác đều đã cập nhật.",
  "wallet.refresh.swapped":
    "{amount} {unit} đã được xác nhận và hoán đổi lấy chứng từ mới.",
  "wallet.refresh.secured":
    "{amount} {unit} giờ đã được cụm từ khôi phục của bạn bao phủ.",
  "wallet.refresh.all_confirmed":
    "Mọi thứ ở đây đều đã được nhà đúc xác nhận từ trước.",
  "wallet.pending.title": "Đang chờ",
  "wallet.pending.reserved_desc":
    "Đã dựng và đang giữ, chưa xác nhận chuyển thành công. Các chứng từ được tách khỏi số dư của bạn để không bị tiêu hai lần.",
  "wallet.pending.locked_desc":
    "Đã khóa vào khóa của người nhận, nên chỉ họ tiêu được. Chỉ là nó chưa tới tay họ thôi. Hãy chia sẻ token để hoàn tất.",
  "wallet.pending.show_qr": "Hiện token này dưới dạng mã QR",
  "wallet.pending.copy_again": "Sao chép lại token",
  "wallet.pending.share_again": "Chia sẻ lại token",
  "wallet.pending.mark_delivered": "Đánh dấu token này là đã chuyển",
  "wallet.pending.delivered": "Đã chuyển",
  "wallet.pending.reclaim_into": "Thu hồi token này về số dư của bạn",
  "wallet.activity.title": "Hoạt động",
  "wallet.activity.none": "Chưa có gì",
  "wallet.activity.none_desc":
    "Các khoản bạn gửi và nhận sẽ hiện ở đây, mới nhất trước, kèm nhà đúc và mức phí của từng khoản.",
  "wallet.activity.show_fewer": "Hiện ít khoản thanh toán hơn",
  "wallet.activity.show_less": "Thu gọn",
  "wallet.activity.received_unconfirmed": "Đã nhận, chưa xác nhận",
  "wallet.activity.received": "Đã nhận",
  "wallet.activity.receive_failed": "Nhận thất bại",
  "wallet.activity.reclaimed": "Đã thu hồi",
  "wallet.activity.send_failed": "Gửi thất bại",
  "wallet.activity.sent": "Đã gửi",
  "wallet.activity.status_pending": "đang chờ",
  "wallet.activity.status_failed": "thất bại",
  "wallet.activity.status_reclaimed": "đã thu hồi",
  "wallet.activity.status_expired": "đã hết hạn",
  "wallet.activity.ln_deposit": "Nạp qua Lightning",
  "wallet.activity.ln_withdrawal": "Rút qua Lightning",
  "wallet.activity.nutzap_received": "Đã nhận Nutzap",
  "wallet.activity.spent_removed": "Đã gỡ các chứng từ đã tiêu",
  "wallet.activity.refreshed": "Đã làm mới chứng từ",
  "wallet.activity.refreshing": "Đang làm mới chứng từ",
  "wallet.activity.just_now": "vừa xong",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Mạng lưới ngoại tuyến",
  "wallet.mesh_offline_body":
    "Dịch vụ mạng lưới không chạy, nên không có nơi nào để giao token. Nó vẫn được giữ trong mục Đang chờ.",
  "wallet.xfer.route_mesh": "Đã giao thẳng tới thiết bị của họ qua mạng lưới.",
  "wallet.xfer.route_nostr":
    "Họ ở ngoài tầm Bluetooth, nên nó đi qua Internet thay vì vậy.",
  "wallet.xfer.route_courier":
    "Hiện không có đường tới họ. Nó sẽ được các thiết bị khác mang đi và chuyển tới khi có máy nào gặp được họ.",
  "wallet.xfer.route_queued":
    "Chưa liên lạc được với họ. Nó đã vào hàng đợi và sẽ gửi ngay khi liên lạc được.",
  "wallet.xfer.mesh_offline_body":
    "Dịch vụ mạng lưới không chạy, nên không có cách nào giao token đi. Chưa có khoản nào bị trừ.",
  "wallet.xfer.could_not_send": "Không gửi được",
  "wallet.xfer.inexact_body":
    "Chứng từ của bạn không tạo ra được đúng {amount} {unit} khi ngoại tuyến. Token nhỏ nhất bạn dựng được là {spend} {unit}, và phần dư {extra} {unit} sẽ về tay họ mà không có cách nào lấy lại.\n\nLàm mới ở nhà đúc khi có mạng sẽ chia chứng từ của bạn thành các mệnh giá tạo ra đúng số này.",
  "wallet.xfer.send_amount": "Gửi {amount}",
  "wallet.xfer.mesh_offline": "Mạng lưới ngoại tuyến",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Đã khóa vào khóa của họ và đăng lên Nostr. Nó thuộc về họ dù họ có đang trực tuyến hay không.",
  "wallet.pay.rail_nutzap_dm":
    "Đã khóa vào khóa của họ. Bộ chuyển tiếp không nhận, nên nó đi tới họ dưới dạng một tin nhắn.",
  "wallet.pay.rail_nutzap_undelivered":
    "Đã khóa vào khóa của họ, nhưng chưa có gì mang nó đi được. Nó đã vào hàng đợi, và token nằm trong mục Đang chờ.",
  "wallet.pay.final":
    "Các khoản thanh toán đã khóa thì không thu hồi được: giờ chỉ khóa của họ mới tiêu được những đồng này.",
  "wallet.pay.reclaimable":
    "Nó vẫn thu hồi được từ thẻ Ví cho tới khi bạn xác nhận nó đã tới nơi.",
  "wallet.pay.why": "Được gửi theo cách này vì {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} cho {name}",
  "wallet.pay.thread_receipt":
    "Bạn đã gửi {amount} {unit}, khóa vào khóa của họ.",
  "wallet.pay.title": "Gửi ecash",
  "wallet.pay.to": "Cho {name}",
  "wallet.pay.amount": "Số tiền tính bằng sat",
  "wallet.pay.memo": "Ghi chú (không bắt buộc, công khai)",
  "wallet.pay.send": "Gửi",
  "wallet.pay.sending": "Đang gửi…",
  "wallet.pay.action": "Gửi ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Quyền truy cập máy ảnh",
  "wallet.scan.camera_purpose": "quét một mã QR ecash",
  "wallet.scan.photo_label": "Quyền truy cập ảnh",
  "wallet.scan.photo_purpose": "đọc một mã QR ecash từ một hình ảnh",
  "wallet.scan.no_token": "Không tìm thấy token ecash nào trong hình đó.",
  "wallet.scan.no_invoice":
    "Không tìm thấy hóa đơn Lightning nào trong hình đó.",
  "wallet.scan.unreadable": "Không đọc được hình đó.",
  "wallet.scan.camera_failed":
    "Không khởi động được máy ảnh. Hãy đóng các ứng dụng máy ảnh khác rồi thử lại.",
  "wallet.scan.close": "Đóng trình quét",
  "wallet.scan.on_device":
    "Nó được đọc ngay trên thiết bị này; không có gì được gửi đi đâu cả.",
  "wallet.scan.aim_token": "Hãy hướng vào một mã QR ecash.",
  "wallet.scan.aim_invoice": "Hãy hướng vào mã QR của một hóa đơn Lightning.",
  "wallet.scan.title_token": "Quét ecash",
  "wallet.scan.title_invoice": "Quét hóa đơn",
  "wallet.scan.desc_token":
    "Đọc một token Cashu từ ví khác. Dùng được với mọi ví Cashu, không riêng gì Airhop.",
  "wallet.scan.desc_invoice":
    "Đọc một hóa đơn Lightning để trả nó từ số dư của bạn.",
  "wallet.scan.use_camera_a11y": "Quét bằng máy ảnh",
  "wallet.scan.use_camera": "Dùng máy ảnh",
  "wallet.scan.pick_image_a11y": "Đọc một mã QR từ hình ảnh đã lưu",
  "wallet.scan.pick_image": "Chọn từ ảnh",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu là gì?",
  "wallet.explain.intro":
    "Cashu là ecash cho Bitcoin. Một token là chuỗi ký tự đáng giá tiền với bất cứ ai giữ nó, được nhà đúc ký mù nên nhà đúc không biết ai đã tiêu khoản nào. Không tài khoản, không đăng nhập.",
  "wallet.explain.send": "Gửi",
  "wallet.explain.send_desc":
    "Biến một khoản tiền thành token bạn có thể trao cho một nút mạng ở gần qua Bluetooth, hoặc chia sẻ dưới dạng văn bản. Chạy được khi không có Internet. Chứng từ vẫn được giữ cho tới khi bạn xác nhận nó đã tới nơi.",
  "wallet.explain.receive": "Nhận",
  "wallet.explain.receive_desc":
    "Dán một token để thêm nó vào. Khi có mạng, nó được hoán đổi ngay tại nhà đúc, nhờ vậy chứng minh được là của bạn. Khi ngoại tuyến, nó được lưu lại và đánh dấu chưa xác nhận cho tới khi bạn làm mới.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Trả cho một danh tính Nostr. Nếu họ công bố thông tin nutzap NIP-61, khoản ecash sẽ bị khóa vào khóa của họ nên chỉ họ tiêu được. Nếu không, nó lùi về một tin nhắn riêng được mã hóa. Cần Internet.",
  "wallet.explain.add_mint": "Thêm nhà đúc",
  "wallet.explain.add_mint_desc":
    "Lưu nhà đúc phát hành và đổi ecash của bạn, và lưu sẵn khóa công khai của nó để token từ nó kiểm tra được khi ngoại tuyến. Hãy chọn một nhà đúc bạn tin tưởng với số dư bạn để ở đó.",
  "wallet.explain.phrase": "Cụm từ khôi phục",
  "wallet.explain.phrase_desc":
    "Các đồng của bạn được dẫn ra từ mười hai từ mà ví sinh ra lúc ban đầu, nên một chiếc điện thoại mới có thể dựng lại số dư bằng cách hỏi các nhà đúc của bạn xem chúng đã ký những đồng nào. Cho tới khi bạn xem và ghi chúng lại, chúng chỉ tồn tại trên chiếc điện thoại này.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Ví đang khóa",
  "wallet.err.mint_unreachable": "Không kết nối được nhà đúc",
  "wallet.err.tor_blocked": "Bị chặn khi Tor đang bật",
  "wallet.err.insufficient": "Số dư không đủ",
  "wallet.err.exact_amount": "Không gửi được đúng khoản đó",
  "wallet.err.no_mint": "Không có nhà đúc",
  "wallet.err.mint_unsupported": "Nhà đúc không làm được việc đó",
  "wallet.err.mint_refused": "Nhà đúc từ chối",
  "wallet.err.unreadable": "Token không đọc được",
  "wallet.err.rejected": "Token bị từ chối",
  "wallet.err.already_spent": "Đã tiêu rồi",
  "wallet.err.change_pending": "Đã trả, đang chờ tiền thối",
  "wallet.svc.mint_unreachable": "Không kết nối được tới nhà đúc.",
  "wallet.svc.tor_ios": "Trên iOS, các yêu cầu tới nhà đúc không đi qua Tor.",
  "wallet.svc.tor_ios_body":
    "Arti chỉ bọc WebSocket của Nostr, nên yêu cầu này sẽ tới nhà đúc qua mạng trần và gắn IP của bạn với những chứng từ này. Hãy cho phép nó trong Cài đặt > Bảo mật, hoặc tắt Tor trước. Gửi và nhận ecash qua mạng lưới vẫn chạy.",
  "wallet.svc.keys_uncached":
    "Khóa của nhà đúc này không được lưu sẵn trên thiết bị này.",
  "wallet.svc.keys_uncached_body":
    "Hãy mở ví một lần khi có mạng để lấy chúng về.",
  "wallet.svc.phrase_invalid": "Cụm từ khôi phục đó không hợp lệ.",
  "wallet.svc.phrase_invalid_body":
    "Hãy tìm xem có từ nào gõ sai hay thiếu không. Cụm từ có sẵn một mã kiểm tra, nên chỉ một từ sai là cả cụm hỏng.",
  "wallet.svc.need_mint": "Hãy thêm ít nhất một nhà đúc trước.",
  "wallet.svc.need_mint_body":
    "Việc khôi phục hoạt động bằng cách hỏi nhà đúc xem nó đã ký những đồng nào cho bạn, nên nó cần biết phải hỏi nhà đúc nào.",
  "wallet.svc.restored": "Đã khôi phục từ cụm từ khôi phục",
  "wallet.svc.storage_locked": "Kho ví đang bị khóa.",
  "wallet.svc.storage_locked_body":
    "Airhop giữ chứng từ ecash trong một tệp mã hóa có khóa nằm trong chuỗi khóa của thiết bị. Hãy mở khóa thiết bị rồi mở lại ứng dụng.",
  "wallet.svc.bad_url": "Đó không phải một URL hợp lệ.",
  "wallet.svc.needs_https": "URL của nhà đúc phải bắt đầu bằng https://.",
  "wallet.svc.refuse_http": "Từ chối dùng một nhà đúc qua http trần.",
  "wallet.svc.refuse_http_body":
    "Bất cứ ai trên đường mạng đều đọc hay sửa được chứng từ của bạn. Hãy dùng một nhà đúc https://.",
  "wallet.svc.mint_not_saved": "Không lưu được nhà đúc.",
  "wallet.svc.unreadable_token": "Đó không phải một token Cashu đọc được.",
  "wallet.svc.unreadable_token_body":
    "Token bắt đầu bằng cashuA hoặc cashuB. Hãy kiểm tra xem có bị cắt mất phần nào khi sao chép không.",
  "wallet.svc.wrong_mint": "Token này không do nhà đúc mà nó nêu tên ký.",
  "wallet.svc.already_spent": "Những chứng từ này đã bị tiêu rồi.",
  "wallet.svc.already_spent_body":
    "Người gửi token này đã đổi nó trước, hoặc đã gửi cùng token đó cho người khác.",
  "wallet.svc.receiving_offline": "nhận khi ngoại tuyến",
  "wallet.svc.amount_positive": "Hãy nhập một số tiền lớn hơn không.",
  "wallet.svc.coins_raced":
    "Những đồng đó vừa bị một khoản thanh toán khác dùng mất.",
  "wallet.svc.coins_raced_body":
    "Chưa có khoản nào bị trừ. Hãy thử lại và ví sẽ chọn một bộ khác.",
  "wallet.svc.no_ecash": "Chưa có ecash.",
  "wallet.svc.no_ecash_body":
    "Hãy thêm một nhà đúc và nạp qua Lightning, hoặc nhận một token từ ai đó.",
  "wallet.svc.split_across_mints": "Số dư của bạn trải khắp nhiều nhà đúc.",
  "wallet.svc.mint_says_spent":
    "Nhà đúc báo rằng những chứng từ này đã bị tiêu.",
  "wallet.svc.issue_against_invoice":
    "phát hành ecash dựa trên một hóa đơn Lightning",
  "wallet.svc.pay_invoice": "trả một hóa đơn Lightning",
  "wallet.svc.unknown_deposit": "Khoản nạp không rõ.",
  "wallet.svc.invoice_expired_before": "Hóa đơn đã hết hạn trước khi được trả.",
  "wallet.svc.invoice_expired": "Hóa đơn đó đã hết hạn.",
  "wallet.svc.invoice_unpaid": "Hóa đơn này chưa được trả.",
  "wallet.svc.payment_unknown":
    "Không rõ trạng thái thanh toán; sẽ kiểm tra lại vào lần làm mới sau.",
  "wallet.svc.melt_change_pending": "Hóa đơn của bạn đã được trả.",
  "wallet.svc.melt_change_pending_body":
    "Nhà đúc chưa trả lại phần phí định tuyến không dùng tới. Nó được nhận tự động vào lần làm mới sau, và trong lúc đó không mất mát gì.",
  "wallet.svc.mint_did_not_pay":
    "Nhà đúc đã không trả hóa đơn này. Số dư của bạn không đổi.",
  "wallet.svc.not_an_invoice": "Đó không phải một hóa đơn Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Hãy dán một hóa đơn bolt11 bắt đầu bằng lnbc.",
  "wallet.svc.insufficient_for_invoice": "Số dư không đủ cho hóa đơn này.",
  "wallet.svc.coins_raced_invoice_body":
    "Chưa có khoản nào bị trừ và hóa đơn cũng chưa được trả. Hãy thử lại.",
  "wallet.svc.same_mint": "Hãy chọn một nhà đúc đích khác.",
  "wallet.svc.same_mint_body":
    "Nguồn và đích là cùng một nhà đúc, nên không có gì để dời.",
  "wallet.svc.quote_failed_retried": "Báo giá thất bại, đã thử gộp lại",
  "wallet.svc.amount_unfit_retried": "Số tiền không vừa, đã thử gộp lại",
  "wallet.svc.cannot_size": "Không xác định được quy mô cho lần chuyển này.",
  "wallet.svc.insufficient_at_mint": "Số dư ở {mint} không đủ.",
  "wallet.svc.inexact_title":
    "Chứng từ của bạn không tạo ra được đúng {amount} {unit} khi ngoại tuyến.",
  "wallet.svc.inexact_detail":
    "Token nhỏ nhất bạn gửi được là {spend} {unit}. Ngoại tuyến thì không có tiền thối, nên phần dư {extra} {unit} sẽ thuộc về người nhận.",
  "wallet.svc.no_single_mint":
    "Không nhà đúc đơn lẻ nào giữ {amount} {unit}. Ecash từ các nhà đúc khác nhau không gộp được vào một token: hãy gộp về một nhà đúc trước, hoặc gửi thành nhiều khoản riêng.",
  "wallet.svc.have_tried_send":
    "Bạn có {total} {unit}, và đã thử gửi {amount}.",
  "wallet.svc.invoice_needs":
    "Hóa đơn này cần {total} {unit} kể cả phần dự phòng định tuyến, còn bạn có {balance}.",
  "wallet.svc.nothing_to_move": "{mint} không có {unit} nào để dời.",
  "wallet.svc.consolidate_memo": "Gộp từ {mint}",
  "wallet.svc.cannot_size_detail":
    "Sau phí định tuyến Lightning, {from} không dời nổi một khoản đáng kể sang {to}. Hãy thử dời một khoản nhỏ cụ thể thay vì vậy.",
  "wallet.svc.mint_cannot": "{mint} không thể {action}.",
  "wallet.svc.no_nut": "Nhà đúc không công bố hỗ trợ NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Khoản thanh toán đó nêu tên một nhà đúc bạn không dùng.",
  "wallet.svc.unknown_mint_body":
    "Hãy tự thêm nhà đúc đó trước nếu bạn tin nó; không có gì được đổi từ một nhà đúc bạn chưa chọn.",
  "wallet.svc.no_relay": "không có kết nối tới bộ chuyển tiếp",
  "wallet.svc.no_shared_mint": "không có nhà đúc chung nào đủ số dư",
  "wallet.svc.no_nutzap_info":
    "người nhận chưa công bố thông tin nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Đã khóa vào khóa của họ nhưng chưa chuyển tới. Hãy chia sẻ token từ giao dịch này để hoàn tất.",
  "wallet.svc.swap_lost":
    "Nhà đúc chưa bao giờ hoàn tất lần hoán đổi này, nên không có gì được phát hành dựa trên nó.",
  "wallet.svc.swap_unreadable":
    "Lần hoán đổi này được lưu ở dạng mà phiên bản hiện tại không phát lại được.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Đã xác minh qua QR",
  "contacts.qr.keys_unverified": "Đã nhận khóa, chưa xác minh",
  "contacts.qr.not_verified": "Chưa xác minh",
  "contacts.qr.message": "Tin nhắn",
  "contacts.qr.add": "Thêm liên hệ",
  "contacts.qr.scan_title": "Quét mã QR",
  "contacts.qr.aim": "Hãy hướng máy ảnh vào mã QR của họ",
  "contacts.qr.add_desc": "Liên lạc với người không ở gần trên mạng lưới.",
  "contacts.qr.peer_id_hint":
    "ID nút mạng dài 16 ký tự. Mã liên hệ bắt đầu bằng airhop:.",
  "contacts.qr.or_scan": "hoặc quét mã QR của họ",
  "contacts.qr.trust_note":
    "Chỉ mã QR bạn tự quét bằng máy ảnh mới xác minh được khóa của họ. Một mã dán vào mang khóa của họ nhưng không mang bằng chứng rằng nó đến từ họ.",
  "contacts.qr.peer_id": "ID nút mạng hoặc mã liên hệ",
  "contacts.qr.peer_id_placeholder": "Dán một ID hoặc mã liên hệ",
  "contacts.qr.scan_camera_a11y": "Quét mã QR bằng máy ảnh",
  "contacts.qr.scan_camera_desc": "Dùng máy ảnh của bạn",
  "contacts.qr.upload_a11y": "Tải ảnh mã QR lên từ thư viện",
  "contacts.qr.upload": "Tải lên từ thư viện",
  "contacts.qr.upload_desc": "Chọn một ảnh mã QR đã lưu",
  "contacts.qr.scan_a11y": "Thêm liên hệ bằng cách quét mã QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Hãy dán một ID nút mạng 16 ký tự, một liên kết airhop://peer/…, hoặc một mã liên hệ.",
  "contacts.scan.camera_label": "Quyền truy cập máy ảnh",
  "contacts.scan.camera_purpose": "quét mã QR của một liên hệ",
  "contacts.scan.camera_needed":
    "Cần quyền truy cập máy ảnh để quét. Bạn vẫn thêm bằng ID nút mạng được.",
  "contacts.scan.camera_failed":
    "Không khởi động được máy ảnh. Hãy đóng các ứng dụng máy ảnh khác rồi thử lại.",
  "contacts.scan.photo_label": "Quyền truy cập ảnh",
  "contacts.scan.photo_purpose": "quét một mã QR bạn đã lưu",
  "contacts.scan.photo_needed":
    "Cần quyền truy cập ảnh để chọn hình. Bạn vẫn thêm bằng ID nút mạng được.",
  "contacts.scan.no_qr": "Không tìm thấy mã QR Airhop nào trong hình đó.",
  "contacts.scan.unreadable": "Không đọc được mã QR nào từ hình đó.",
  "contacts.scan.bitchat_expired":
    "Mã bitchat đó đã hết hạn. Hãy nhờ họ mở lại mã QR của mình.",
  "contacts.scan.tampered":
    "Mã QR này không hợp lệ: ID nút mạng của nó không khớp với khóa của nó. Có thể nó đã bị can thiệp.",
  "contacts.scan.already_added": "Đã có trong danh bạ của bạn",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Đang đợi quyền truy cập máy ảnh…",
  "contacts.verify.camera_off": "Máy ảnh đang tắt",
  "contacts.verify.open_settings": "Mở Cài đặt",
  "contacts.verify.verified": "Đã xác minh",
  "contacts.verify.different": "Liên hệ khác",
  "contacts.verify.scan_again": "Quét lại",
  "contacts.verify.failed": "Không xác minh được",
  "contacts.verify.done": "Xong",
  "contacts.verify.title": "Xác minh {name}",
  "contacts.verify.aim": "Hãy hướng máy ảnh vào mã QR của họ",
  "contacts.verify.camera_off_body":
    "Hãy bật quyền truy cập máy ảnh trong Cài đặt để xác minh bằng QR.",
  "contacts.verify.match_body":
    "Khóa của {name} khớp. Bạn có thể tin liên hệ này.",
  "contacts.verify.different_body":
    "Mã QR này thuộc về người khác. Hãy nhờ {name} đưa mã của chính họ.",
  "contacts.verify.tampered_body":
    "Mã QR này trông như đã bị can thiệp: ID của nó không khớp với khóa của nó.",
  "contacts.verify.choose_title": "Bạn muốn kiểm tra bằng cách nào?",
  "contacts.verify.choose_body":
    "Cả hai cách đều xác nhận rằng những khóa trên điện thoại này thực sự là của {name}.",
  "contacts.verify.method_scan": "Quét mã của họ",
  "contacts.verify.method_scan_sub": "Họ đang ở đây cùng bạn",
  "contacts.verify.method_compare": "Đối chiếu một mã",
  "contacts.verify.method_compare_sub": "Đọc cho nhau nghe qua điện thoại",
  "contacts.verify.no_keys":
    "Chưa có khóa cho liên hệ này. Hãy nhắn tin cho họ, hoặc quét mã của họ khi gặp mặt.",
  "contacts.verify.compare_title": "Hãy đọc những từ này cho nhau nghe",
  "contacts.verify.compare_body":
    "{name} thấy đúng sáu từ đó. Nếu chúng khớp, cả hai bạn đều biết các khóa là thật.",
  "contacts.verify.codes_match": "Chúng khớp",
  "contacts.verify.codes_differ": "Chúng không khớp",
  "contacts.verify.compared_body":
    "Bạn và {name} đã xác nhận cùng một mã. Liên hệ này đã được xác minh.",

  // ---- Settings: shared chrome ----
  "settings.back": "Quay lại",
  "settings.coming_soon": "Sắp có",
  "settings.opens_externally": "{label}, mở bên ngoài ứng dụng",
  "settings.peer_id": "ID nút mạng",
  "settings.share_peer_id": "Chia sẻ ID nút mạng của bạn",
  "settings.share_id_short": "Chia sẻ ID",
  "settings.peer_id_sheet.title": "ID nút mạng của bạn",
  "settings.peer_id_sheet.copy": "Sao chép ID nút mạng",
  "settings.peer_id_sheet.note":
    "Cách này chỉ chạy khi cả hai bạn cùng ở trong tầm Bluetooth. Để ai đó nhắn tin cho bạn từ bất cứ đâu, hãy chia sẻ mã QR của bạn.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Chung",
  "settings.section.general_desc":
    "Tính năng tùy chọn, hoàn tác gửi, phương tiện, đặt lại",
  "settings.section.privacy": "Riêng tư và bảo mật",
  "settings.section.privacy_desc":
    "Bí mật chuyển tiếp, gói tin đã ký, nút mạng bị chặn",
  "settings.section.network": "Mạng và bộ chuyển tiếp",
  "settings.section.network_desc":
    "Dự phòng Internet, bộ chuyển tiếp nostr, tương thích bitchat",
  "settings.section.permissions": "Quyền",
  "settings.section.permissions_desc":
    "Bluetooth, vị trí, thông báo, máy ảnh, micrô",
  "settings.section.storage": "Lưu trữ và dữ liệu",
  "settings.section.diagnostics": "Chẩn đoán",

  // ---- Settings: group headings ----
  "settings.group.transports": "Kênh truyền",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "Ở gần",
  "settings.group.sync": "Đồng bộ",
  "settings.group.features": "Tính năng",
  "settings.group.messages": "Tin nhắn",
  "settings.group.local": "Nội bộ",
  "settings.group.media": "Phương tiện",
  "settings.group.reset": "Đặt lại",
  "settings.group.always_on": "Luôn bật",
  "settings.group.notifications": "Thông báo",
  "settings.group.blocked": "Đã chặn",
  "settings.group.theme": "Giao diện",
  "settings.group.font": "Phông chữ",
  "settings.group.language": "Ngôn ngữ",
  "settings.section.diagnostics_desc": "Trạng thái kết nối và thiết bị ở gần",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Liên kết Bluetooth",
  "settings.diag.ble_links_desc":
    "Các thiết bị mà điện thoại này đang nối trực tiếp",
  "settings.diag.lan": "Mạng nội bộ",
  "settings.diag.lan_desc": "Điện thoại trong cùng mạng Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about":
    "Điện thoại tới điện thoại không cần bộ định tuyến",
  "settings.diag.wifi_active": "Đang chạy",
  "settings.diag.wifi_unsupported": "Không hỗ trợ trên thiết bị này",
  "settings.diag.wifi_permission": "Bị một quyền chặn lại",
  "settings.diag.wifi_unavailable": "Hiện không dùng được",
  "settings.diag.wifi_unpaired": "Chưa ghép đôi gì",
  "settings.diag.wifi_unknown": "Đang đợi bộ thu phát",
  "settings.diag.relays": "Bộ chuyển tiếp Nostr",
  "settings.diag.relays_desc": "Dùng cho kênh vị trí và tầm với qua Internet",
  "settings.diag.connected": "Đã kết nối",
  "settings.diag.disconnected": "Chưa kết nối",
  "settings.diag.peer_direct": "Liên kết trực tiếp",
  "settings.diag.peer_relayed": "Nghe được qua một thiết bị khác",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Không có chỉ số tín hiệu",
  "settings.diag.no_peers": "Không có ai trong tầm",
  "settings.diag.no_peers_desc": "Đang mở {links} liên kết vô tuyến",
  "settings.diag.gcs_size": "Kích thước bộ lọc",
  "settings.diag.gcs_size_desc": "Bộ lọc đồng bộ lớn nhất từng phát lên sóng",
  "settings.diag.fpr": "Tỉ lệ báo nhầm",
  "settings.diag.fpr_desc":
    "Bộ lọc bao lâu lại nhận nhầm là ta thiếu một gói tin",
  "settings.diag.bytes": "{n} byte",
  "settings.diag.footnote":
    "Không có gì ở đây đổi được. Các giá trị này cố định để Airhop giữ được tính tương thích với bitchat.",
  "settings.section.storage_desc": "Mức dùng và bộ nhớ đệm",
  "settings.section.appearance": "Giao diện",
  "settings.section.appearance_desc": "Giao diện, phông chữ và ngôn ngữ",
  "settings.section.help": "Trợ giúp và phản hồi",
  "settings.section.help_desc":
    "Liên hệ với chúng tôi, báo lỗi, hoặc đọc phần Hỏi đáp",
  "settings.section.support": "Ủng hộ",
  "settings.section.support_desc": "Giúp việc phát triển tiếp tục",
  "settings.section.about": "Giới thiệu",
  "settings.section.about_desc": "Phiên bản, nhật ký thay đổi và mã nguồn",

  // ---- Settings: general ----
  "settings.general.undo": "Hoàn tác gửi",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Ví",
  "settings.general.undo_seconds": "{count} giây",
  "settings.general.undo_a11y": "Hoàn tác gửi: {value}",
  "settings.general.quality_a11y": "Đặt chất lượng tải lên thành {value}",
  "settings.general.undo_desc":
    "Giữ tin nhắn vừa gửi lại một chút để bạn kịp lấy lại trước khi nó đi ra",
  "settings.general.undo_off_desc": "Gửi ngay, không hoàn tác được",
  "settings.general.undo_2": "2 giây",
  "settings.general.undo_2_desc": "Một cơ hội nhanh để lấy lại",
  "settings.general.undo_10": "10 giây",
  "settings.general.undo_10_desc": "Khoảng thời gian dài nhất",
  "settings.general.quality": "Chất lượng tải lên",
  "settings.general.quality_desc":
    "Áp dụng cho ảnh gửi từ máy ảnh hoặc thư viện của bạn. Dù chọn mức nào, mọi tấm ảnh đều được chỉnh cho vừa mạng lưới.",
  "settings.general.quality_low": "Thấp",
  "settings.general.quality_low_desc": "Ảnh nhỏ nhất, gửi nhanh nhất",
  "settings.general.quality_medium": "Vừa",
  "settings.general.quality_medium_desc": "Cân bằng giữa chi tiết và tốc độ",
  "settings.general.quality_high": "Cao",
  "settings.general.quality_high_desc": "Giữ được nhiều chi tiết nhất",
  "settings.general.feature_wallet_desc":
    "Gửi ecash Cashu ngang hàng qua mạng lưới",
  "settings.general.feature_wallet_a11y": "Ví (luôn bật)",
  "settings.general.feature_ai_desc":
    "Trợ lý riêng tư chạy ngay trên máy, không gọi mạng",
  "settings.general.feature_feeds": "Bảng tin",
  "settings.general.feature_feeds_desc":
    "Đọc và đăng lên bảng tin Bluesky và Mastodon",
  "settings.general.show_media": "Tự động hiện phương tiện",
  "settings.general.show_media_desc":
    "Ảnh và video hiện ngay trong cuộc trò chuyện, hoặc phải chạm mới hiện",
  "settings.general.reset": "Đặt lại cài đặt",
  "settings.general.media_retention": "Giữ phương tiện trong",
  "settings.general.media_retention_desc":
    "Ảnh, video và tin nhắn thoại bị xóa sau khoảng thời gian đã chọn",
  "settings.general.media_retention_sheet":
    "Hãy chọn phương tiện ở lại trên thiết bị này bao lâu. Phương tiện đã xóa thì không khôi phục được.",
  "settings.general.retention_7_desc":
    "Để lại ít dấu vết nhất. Hợp nhất khi chính chiếc điện thoại là rủi ro.",
  "settings.general.retention_14_desc":
    "Mức trung dung cho một hai tuần xa sóng.",
  "settings.general.retention_30_desc":
    "Giữ cuộc trò chuyện đọc được lâu nhất, và cũng chiếm đĩa nhiều nhất.",
  "settings.general.reset_desc":
    "Đưa mọi tùy chọn về mặc định, còn danh tính, tin nhắn, liên hệ và ví của bạn vẫn nguyên vẹn",
  "settings.general.reset_title": "Đặt lại cài đặt?",
  "settings.general.reset_body":
    "Mọi tùy chọn quay về mặc định: giao diện, hoàn tác gửi, và kết nối (Internet, Tor, cổng kết nối, cầu nối, bộ chuyển tiếp). Danh tính, tin nhắn, liên hệ và ví của bạn vẫn nguyên vẹn.",
  "settings.general.reset_confirm": "Đặt lại",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Bí mật chuyển tiếp",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet luôn bật cho tin nhắn riêng",
  "settings.security.signed_packets": "Gói tin đã ký",
  "settings.security.signed_packets_desc":
    "Mọi gói tin đều được ký bằng Ed25519",
  "settings.security.hide_previews": "Ẩn xem trước trong thông báo",
  "settings.security.hide_previews_desc":
    "Giữ tên người gửi và nội dung tin nhắn khỏi màn hình khóa, vốn hiện chúng ra mà không cần mở khóa",
  "settings.security.no_blocked": "Không có nút mạng nào bị chặn",
  "settings.security.no_blocked_desc":
    "Nút mạng bị chặn không nhắn tin cho bạn được và không hiện trên thẻ Mạng lưới",
  "settings.security.unblock_title": "Bỏ chặn nút mạng này",
  "settings.security.unblock": "Bỏ chặn",
  "settings.security.unblock_peer": "Bỏ chặn {name}",
  "settings.security.unblock_body":
    "{name} sẽ nhắn tin lại cho bạn được và sẽ hiện lại trên thẻ Mạng lưới khi ở gần.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Dự phòng Internet",
  "settings.network.internet_desc":
    "Tiếp tục qua các bộ chuyển tiếp Nostr khi nút mạng lưới ở ngoài tầm",
  "settings.network.internet_off_title": "Tắt Internet?",
  "settings.network.internet_off_body":
    "Airhop sẽ chỉ chạy trên Bluetooth. Nó ngừng liên hệ với mọi bộ chuyển tiếp Nostr, còn Tor, cổng kết nối Internet và cầu nối mạng lưới đều tắt theo. Trò chuyện Bluetooth ở gần vẫn chạy.",
  "settings.network.turn_off": "Tắt",
  "settings.network.discovery": "Tự tìm bộ chuyển tiếp theo vị trí",
  "settings.network.discovery_desc":
    "Tự chọn các bộ chuyển tiếp gần nhất cho một ô vị trí trong hơn 300 bộ phân tán",
  "settings.network.discovery_needs_relay":
    "Hãy thêm một bộ chuyển tiếp tùy chỉnh trước",
  "settings.network.discovery_needs_relay_body":
    "Chính việc tự tìm là thứ chỉ cho Airhop các bộ chuyển tiếp gần nhất. Tắt nó chỉ hợp lý khi bạn đã ghim bộ chuyển tiếp của riêng mình ở dưới, nên hãy thêm ít nhất một cái trước.",
  "settings.network.custom_only_title":
    "Chỉ dùng bộ chuyển tiếp tùy chỉnh của bạn?",
  "settings.network.custom_only_body":
    "Kênh vị trí và cầu nối mạng lưới sẽ ngừng tự chọn các bộ chuyển tiếp gần nhất và chỉ dùng những bộ bạn đã thêm. Việc này có thể thu hẹp tầm với, và bạn có thể không còn gặp người dùng bitchat, vốn tụ về các bộ chuyển tiếp gần nhất.",
  "settings.network.custom": "Bộ chuyển tiếp tùy chỉnh",
  "settings.network.custom_desc":
    "Thêm bộ chuyển tiếp của riêng bạn cho kênh vị trí và cầu nối mạng lưới",
  "settings.network.custom_added": "Đã thêm {count} trên {max}",
  "settings.network.dm_relays": "Bộ chuyển tiếp tin nhắn",
  "settings.network.dm_relays_desc":
    "Tin nhắn riêng và kênh riêng tư luôn dùng những bộ này. Bộ chuyển tiếp tùy chỉnh không thay đổi chúng.",
  "settings.network.discovery_back_on":
    "Đã bật lại việc tự tìm bộ chuyển tiếp theo vị trí",
  "settings.network.discovery_back_on_body":
    "Đó là bộ chuyển tiếp tùy chỉnh cuối cùng của bạn. Kênh vị trí cần chỗ để đăng, nên Airhop lại tự chọn các bộ chuyển tiếp gần nhất.",
  "settings.network.add_relay": "Thêm bộ chuyển tiếp",
  "settings.network.remove_relay": "Gỡ {url}",
  "settings.network.add_short": "Thêm",
  "settings.network.relay_limit":
    "Bạn thêm được {count} bộ chuyển tiếp. Hãy gỡ một cái để thêm cái khác.",
  "settings.network.relay_duplicate":
    "Bộ chuyển tiếp đó đã có trong danh sách của bạn.",
  "settings.network.relay_invalid":
    "Hãy nhập một máy chủ chuyển tiếp hợp lệ, ví dụ relay.example.com. Chỉ cần ghi cổng nếu bộ chuyển tiếp không dùng cổng mặc định. Không cho phép địa chỉ IP và tên cục bộ.",
  "settings.network.lan": "Mạng nội bộ",
  "settings.network.lan_desc":
    "Kết nối với những người trên cùng WiFi, kể cả giữa iPhone và Android. Các thiết bị khác trên mạng có thể thấy bạn đang chạy Airhop.",
  "settings.network.lan_searching":
    "Không có thiết bị Airhop nào trên mạng này",
  "settings.network.lan_active": "Đã kết nối trên mạng này",
  "settings.network.lan_unavailable": "Không ở trên mạng WiFi nào",
  "settings.network.lan_permission":
    "Quyền truy cập mạng nội bộ đang tắt cho Airhop",
  "settings.network.lan_unsupported": "Không khả dụng trên thiết bị này",
  "settings.network.lan_foreground":
    "Tạm dừng khi Airhop chạy nền. Bluetooth vẫn tiếp tục.",
  "settings.network.wifi_pair": "Ghép đôi",
  "settings.network.wifi_paired": "Thiết bị đã ghép đôi",
  "settings.network.wifi_pair_find": "Tìm một thiết bị",
  "settings.network.wifi_pair_find_desc":
    "Tìm một iPhone gần đó đang tự hiển thị. Cả hai máy đều cần iOS 26 trở lên.",
  "settings.network.wifi_pair_show": "Hiển thị iPhone này",
  "settings.network.wifi_pair_show_desc":
    "Để một iPhone gần đó tìm thấy máy này. Một người tìm, người kia hiển thị, cùng lúc.",
  "settings.network.wifi_pair_find_action": "Chọn một iPhone gần đó",
  "settings.network.wifi_pair_show_action": "Cho phép tìm thấy iPhone này",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware hiện không khả dụng",
  "settings.network.wifi_pair_forget":
    "Gỡ một liên kết ghép đôi trong ứng dụng Settings",
  "settings.network.bitchat": "Tương thích bitchat",
  "settings.network.bitchat_desc":
    "Cùng một mạng lưới BLE với bitchat, tương thích hoàn toàn. Mục này luôn bật và không tắt được.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Chạy nền",
  "settings.conn.background_desc": "Giữ mạng lưới chạy khi Airhop đã đóng",
  "settings.conn.background_on_title": "Giữ mạng lưới chạy?",
  "settings.conn.background_on_body":
    "Airhop vẫn tiếp tục chuyển tiếp và nhận khi đã đóng, nên tin nhắn tới nơi lúc bạn đi vắng. Trong lúc đó Android hiện một thông báo thường trực.",
  "settings.conn.background_off_title": "Dừng mạng lưới khi Airhop đóng?",
  "settings.conn.background_off_body":
    "Tin nhắn chỉ tới nơi khi Airhop đang mở, và chiếc điện thoại này ngừng chuyển tiếp giúp những người ở gần. Thông báo thường trực sẽ biến mất.",
  "settings.conn.live_voice": "Thoại trực tiếp",
  "settings.conn.live_voice_desc": "Nói chuyện với người ở gần như dùng bộ đàm",
  "settings.conn.live_voice_on_title": "Bật thoại trực tiếp?",
  "settings.conn.live_voice_on_body":
    "Giữ micrô sẽ truyền giọng bạn tới mọi người trong tầm Bluetooth ngay khi bạn nói, và giọng họ phát trên điện thoại của bạn. Không có gì được ghi lại.",
  "settings.conn.live_voice_off_title": "Tắt thoại trực tiếp?",
  "settings.conn.live_voice_off_body":
    "Giữ micrô sẽ ghi một tin nhắn thoại thay vì vậy. Nó gửi khi bạn thả tay, và không ai nghe được cho tới khi họ bấm phát.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Định tuyến qua Tor",
  "settings.conn.tor_desc": "Đưa lưu lượng Nostr qua Tor để riêng tư hơn",
  "settings.conn.tor_on_title": "Đưa lưu lượng Nostr qua Tor?",
  "settings.conn.tor_on_body":
    "Các bộ chuyển tiếp sẽ không còn thấy địa chỉ IP của bạn. Việc kết nối lâu hơn và tin nhắn tới chậm hơn. Bluetooth không bị ảnh hưởng.",
  "settings.conn.tor_off_title": "Tắt định tuyến qua Tor?",
  "settings.conn.tor_off_body":
    "Lưu lượng Nostr quay về đường kết nối thông thường của bạn, nên các bộ chuyển tiếp lại thấy địa chỉ IP của bạn. Dù thế nào Bluetooth cũng không bị ảnh hưởng.",
  "settings.conn.tor_unavailable": "Bản dựng này không có định tuyến qua Tor.",
  "settings.conn.tor_timeout":
    "Tor đang mất hơn một phút để kết nối. Nó vẫn bật và tiếp tục thử; thẻ Mạng lưới sẽ báo khi nó bắt đầu định tuyến, hoặc khi mạng này đang chặn nó.",
  "settings.conn.tor_failed":
    "Không khởi động được Tor. Hãy bảo đảm ứng dụng có quyền truy cập mạng.",
  "settings.tor.connection": "Kết nối",
  "settings.tor.mode_off": "Trực tiếp",
  "settings.tor.mode_off_desc":
    "Kết nối thẳng tới Tor. Nhanh nhất, nhưng ai theo dõi mạng này đều thấy bạn dùng Tor.",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Che giấu việc bạn dùng Tor và vẫn chạy ở nơi cầu nối bị chặn. Kết nối chậm nhất.",
  "settings.tor.mode_obfs4": "Cầu nối",
  "settings.tor.mode_obfs4_desc":
    "Che giấu việc bạn dùng Tor. Nhanh hơn Snowflake, nhưng các cầu nối này công khai và một số mạng chặn chúng.",
  "settings.tor.mode_custom": "Cầu nối riêng",
  "settings.tor.mode_custom_desc":
    "Dùng cầu nối lấy từ bridges.torproject.org. Thử cách này khi các cách khác không được.",
  "settings.tor.custom_placeholder": "Dán mỗi dòng một dòng cầu nối",
  "settings.tor.custom_empty": "Hãy thêm ít nhất một dòng cầu nối trước.",
  "settings.conn.mint_clearnet": "Cho phép lưu lượng nhà đúc qua mạng trần",
  "settings.conn.mint_clearnet_desc":
    "Tor trên iOS chỉ bao được Nostr. Hãy để tắt để chặn các yêu cầu tới nhà đúc; dù thế nào ecash qua mạng lưới vẫn chạy.",
  "settings.conn.gateway": "Cổng kết nối Internet",
  "settings.conn.gateway_desc":
    "Cho một chiếc điện thoại ngoại tuyến ở gần mượn kết nối của bạn để nó vẫn tới được các kênh vị trí",
  "settings.conn.gateway_on_title": "Bật cổng kết nối Internet?",
  "settings.conn.gateway_on_body":
    "Những điện thoại ở gần không có kết nối riêng sẽ gửi và nhận tin nhắn kênh vị trí qua kết nối của bạn. Việc này dùng dữ liệu di động và pin của bạn, còn tin nhắn của họ vẫn được mã hóa đầu cuối, nên bạn không đọc được thứ đi qua.",
  "settings.conn.gateway_off_title": "Tắt cổng kết nối Internet?",
  "settings.conn.gateway_off_body":
    "Những điện thoại ngoại tuyến ở gần thôi không tới được các kênh vị trí qua kết nối của bạn nữa. Tin nhắn của chính bạn không bị ảnh hưởng.",
  "settings.conn.bridge": "Cầu nối mạng lưới",
  "settings.conn.bridge_desc":
    "Nối cuộc trò chuyện #bluetooth công khai của khu vực này với một nhóm Bluetooth khác ngoài tầm, qua Internet",
  "settings.conn.bridge_on_title": "Bật cầu nối mạng lưới?",
  "settings.conn.bridge_on_body":
    "Tin nhắn #bluetooth công khai của bạn sẽ được đăng ra khu dân cư của bạn qua Internet, nên người ngoài tầm Bluetooth cũng đọc được. Tin nhắn riêng tư không bao giờ được bắc cầu, và “chỉ ở gần” giữ riêng từng tin nhắn ở lại tại chỗ.",
  "settings.conn.bridge_off_title": "Tắt cầu nối mạng lưới?",
  "settings.conn.bridge_off_body":
    "Tin nhắn #bluetooth công khai của bạn lại ở trong tầm Bluetooth, và tin nhắn từ nhóm bên kia cầu thôi không tới đây nữa.",
  "settings.conn.bridge_needs_location": "Cầu nối mạng lưới cần vị trí",
  "settings.conn.bridge_needs_location_desc":
    "Nó tìm ra khu dân cư của bạn từ một lần định vị. Hãy cấp quyền vị trí để bắt đầu bắc cầu.",
  "settings.conn.grant_location": "Cấp quyền vị trí",
  "settings.conn.grant_short": "Cấp",
  "settings.conn.internet_off": "Internet đang tắt",
  "settings.conn.internet_off_desc":
    "Tor, cầu nối và cổng kết nối đều dùng Internet. Hãy bật Dự phòng Internet trong mục Mạng để dùng chúng.",
  "settings.conn.turn_on": "Bật",
  "settings.conn.turn_off": "Tắt",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Tìm các thiết bị ở gần và chuyển tiếp tin nhắn giữa chúng. Không có nó, mạng lưới không chạy được.",
  "settings.permissions.location": "Vị trí",
  "settings.permissions.location_desc":
    "Mở các kênh khu vực ở gần. Không có nó, những kênh đó vẫn đóng và mạng lưới Bluetooth vẫn chạy như thường.",
  "settings.permissions.notifications": "Thông báo",
  "settings.permissions.notifications_desc":
    "Nhận báo tin nhắn mới ngay cả khi ứng dụng đã đóng. Không có nó, bạn chỉ thấy chúng khi mở Airhop.",
  "settings.permissions.camera": "Máy ảnh",
  "settings.permissions.camera_desc":
    "Quét mã QR và chụp ảnh hay quay video để gửi. Không có nó, bạn vẫn chia sẻ được phương tiện từ thư viện.",
  "settings.permissions.photos": "Ảnh",
  "settings.permissions.photos_desc":
    "Gửi ảnh từ thư viện của bạn và lưu phương tiện nhận được. Không có nó, bạn vẫn chụp và gửi ảnh mới bằng máy ảnh được.",
  "settings.permissions.microphone": "Micrô",
  "settings.permissions.microphone_desc":
    "Ghi và gửi tin nhắn thoại hoặc dùng thoại trực tiếp. Không có nó, tin nhắn thoại và thoại trực tiếp đều không chạy.",
  "settings.permissions.allow": "Cho phép quyền này",
  "settings.permissions.open_settings": "Mở cài đặt hệ thống để đổi quyền này",
  "settings.permissions.system": "Hệ thống",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Mức dùng mạng",
  "settings.storage.storage_usage": "Mức dùng bộ nhớ",
  "settings.storage.storage_usage_desc":
    "Tin nhắn, chứng từ ví và tệp đính kèm lưu đệm",
  "settings.storage.session_usage": "Phiên này · gửi {sent}, nhận {received}",
  "settings.storage.cache": "Bộ nhớ đệm",
  "settings.storage.cache_desc": "{size} tệp đính kèm",
  "settings.storage.clear_cache": "Xóa bộ nhớ đệm tệp đính kèm",
  "settings.storage.clear": "Xóa",
  "settings.storage.clear_title": "Xóa phương tiện đã lưu đệm?",
  "settings.storage.clear_body":
    "Ảnh, video, tin nhắn thoại và tệp đều bị gỡ khỏi thiết bị này, cả thứ gửi lẫn thứ nhận. Chúng không tải lại được: bong bóng tin nhắn sẽ ghi rõ điều đó, và bạn có thể nhờ người gửi gửi lại. Tin nhắn và ví vẫn nguyên vẹn.",
  "settings.storage.cleared": "Đã xóa bộ nhớ đệm",
  "settings.storage.freed": "Đã giải phóng {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Đặt giao diện thành {value}",
  "settings.font.set_a11y": "Đặt phông chữ đơn cách thành {value}",
  "settings.font.system": "Hệ thống",
  "settings.font.system_desc":
    "Dùng phông chữ đơn cách mặc định của thiết bị bạn",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Hiện đại và dễ đọc",
  "settings.language.en": "Tiếng Anh",
  "settings.language.am": "Tiếng Amhara",
  "settings.language.ar": "Tiếng Ả Rập",
  "settings.language.bn": "Tiếng Bengal",
  "settings.language.my": "Tiếng Miến Điện",
  "settings.language.zh_hans": "Tiếng Trung (Giản thể)",
  "settings.language.zh_hant": "Tiếng Trung (Phồn thể)",
  "settings.language.nl": "Tiếng Hà Lan",
  "settings.language.fil": "Tiếng Philippines",
  "settings.language.fr": "Tiếng Pháp",
  "settings.language.ka": "Tiếng Gruzia",
  "settings.language.de": "Tiếng Đức",
  "settings.language.hi": "Tiếng Hindi",
  "settings.language.id": "Tiếng Indonesia",
  "settings.language.it": "Tiếng Ý",
  "settings.language.ja": "Tiếng Nhật",
  "settings.language.ko": "Tiếng Hàn",
  "settings.language.mg": "Tiếng Malagasy",
  "settings.language.ms": "Tiếng Mã Lai",
  "settings.language.ne": "Tiếng Nepal",
  "settings.language.fa": "Tiếng Ba Tư",
  "settings.language.pl": "Tiếng Ba Lan",
  "settings.language.pt_br": "Tiếng Bồ Đào Nha (Brazil)",
  "settings.language.pt_pt": "Tiếng Bồ Đào Nha (Bồ Đào Nha)",
  "settings.language.pa": "Tiếng Punjab",
  "settings.language.ru": "Tiếng Nga",
  "settings.language.es": "Tiếng Tây Ban Nha",
  "settings.language.sw": "Tiếng Swahili",
  "settings.language.sv": "Tiếng Thụy Điển",
  "settings.language.ta": "Tiếng Tamil",
  "settings.language.th": "Tiếng Thái",
  "settings.language.tr": "Tiếng Thổ Nhĩ Kỳ",
  "settings.language.uk": "Tiếng Ukraina",
  "settings.language.ur": "Tiếng Urdu",
  "settings.language.vi": "Tiếng Việt",
  "settings.language.pseudo": "Ngôn ngữ giả lập",
  "settings.language.soon": "Sắp có",
  "settings.language.soon_a11y": "{value}, sắp có",
  "settings.language.set_a11y": "Đặt ngôn ngữ thành {value}",
  "settings.language.pending": "Vào lần mở tới",
  "settings.language.pending_a11y":
    "{value}, áp dụng vào lần tới bạn mở Airhop",
  "settings.language.rtl_restart": "Mở lại ngay",
  "settings.language.rtl_title": "Hãy mở lại Airhop để hoàn tất",
  "settings.language.rtl_body":
    "{value} đọc từ phải sang trái, và Airhop chỉ đổi được chiều lúc khởi động. Hãy đóng rồi mở lại để hoàn tất việc chuyển. Không mất gì cả, và mạng lưới của bạn vẫn kết nối cho tới lúc đó.",
  "settings.theme.light": "Sáng",
  "settings.theme.light_desc": "Luôn dùng bảng màu sáng",
  "settings.theme.dark": "Tối",
  "settings.theme.dark_desc": "Luôn dùng bảng màu tối",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Trực tuyến",
  "settings.status.online_desc": "Có thể tìm thấy, đang phát và quét",
  "settings.status.away": "Vắng mặt",
  "settings.status.away_desc": "Mạng lưới tạm dừng, không quét cũng không phát",
  "settings.status.invisible": "Ẩn",
  "settings.status.invisible_desc": "Vẫn quét, nhưng không để bị tìm thấy",
  "settings.status.title": "Trạng thái",
  "settings.status.set_a11y": "Đặt trạng thái thành {value}",
  "settings.status.edit": "Sửa trạng thái",
  "settings.status.desc": "Hãy chọn mức bạn hiện diện trên mạng lưới.",
  "settings.transfer.identity": "Danh tính và khóa",
  "settings.transfer.identity_desc":
    "ID nút mạng, tên người dùng và liên hệ của bạn",
  "settings.transfer.chats": "Cuộc trò chuyện và lịch sử",
  "settings.transfer.chats_desc":
    "Các cuộc trò chuyện, nhóm và những kênh bạn đã tham gia",
  "settings.transfer.wallet": "Số dư ví",
  "settings.transfer.wallet_desc": "Chứng từ Cashu và lịch sử giao dịch",
  "settings.transfer.title": "Chuyển sang điện thoại mới",
  "settings.transfer.desc":
    "Dời danh tính, cuộc trò chuyện và ví của bạn sang một thiết bị khác",
  "settings.transfer.coming_soon_a11y": "Chuyển sang điện thoại mới, sắp có",
  "settings.transfer.body":
    "Hãy để hai điện thoại sát nhau và dời mọi thứ qua Bluetooth. Không có gì đi qua máy chủ, nên nó chạy được khi không có Internet.",
  "settings.qr.permission_label": "Quyền truy cập ảnh",
  "settings.qr.permission_purpose": "lưu mã QR của bạn",
  "settings.qr.saved": "Đã lưu",
  "settings.qr.saved_body": "Đã lưu mã QR vào thư viện ảnh của bạn.",
  "settings.qr.save_failed": "Không lưu được",
  "settings.qr.save_failed_body": "Không lưu được mã QR. Hãy thử lại.",
  "settings.qr.share_message": "Thêm tôi trên Airhop",
  "settings.qr.share_body":
    "Thêm tôi trên Airhop — nhắn tin qua mạng lưới, riêng tư và ưu tiên ngoại tuyến.",
  "settings.qr.show_short": "Hiện QR",
  "settings.qr.title": "Mã QR của bạn",
  "settings.qr.note":
    "Mã này chứa các khóa công khai của bạn, cho phép người khác nhắn tin cho bạn từ bất cứ đâu. Chỉ chia sẻ nó với những người bạn tin. Nó không đổi trừ khi bạn xóa sạch danh tính của mình.",
  "settings.qr.code_label": "Mã liên hệ",
  "settings.qr.copy_code": "Sao chép mã liên hệ",
  "settings.qr.share": "Chia sẻ mã QR",
  "settings.qr.share_short": "Chia sẻ QR",
  "settings.qr.download": "Tải mã QR về",
  "settings.qr.download_short": "Tải QR",
  "settings.qr.show": "Hiện mã QR",
  "settings.wipe.trigger": "Kích hoạt xóa khẩn cấp",
  "settings.wipe.trigger_desc": "Chạm ba lần để xóa ngay mà không hỏi lại",
  "settings.wipe.title": "Xóa khẩn cấp",
  "settings.wipe.now": "Xóa ngay",
  "settings.wipe.desc": "Hủy ngay mọi khóa, tin nhắn và chứng từ",
  "settings.wipe.body":
    "Việc này sẽ hủy ngay mọi khóa, tin nhắn và chứng từ ví của bạn. Không thể hoàn tác.",
  "settings.wipe.in_progress": "Đang xóa",
  "settings.wipe.in_progress_body":
    "Đang hủy khóa, tin nhắn và tệp của bạn. Việc này mất vài giây, và tự hoàn tất kể cả khi ứng dụng bị đóng.",
  "settings.wipe.got_it": "Đã hiểu",
  "settings.wipe.keys_failed": "Không hủy được khóa",
  "settings.wipe.keys_failed_body":
    "Tin nhắn, liên hệ và ví của bạn đã mất, nhưng thiết bị từ chối nhả khóa của bạn ra. Hãy mở khóa thiết bị và xóa lại.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Liên hệ với chúng tôi",
  "settings.help.contact_a11y": "Gửi thư tới {address}",
  "settings.help.bug": "Báo lỗi",
  "settings.help.bug_desc": "Mở một issue trên GitHub",
  "settings.help.bug_a11y": "Báo lỗi trên GitHub",
  "settings.help.faq": "Câu hỏi thường gặp",
  "settings.help.faq_desc": "Giải đáp những thắc mắc phổ biến",
  "settings.help.faq_a11y": "Mở phần Hỏi đáp",
  "settings.help.terms_desc": "Airhop được dùng như thế nào",
  "settings.help.terms_a11y": "Mở Điều khoản dịch vụ",
  "settings.help.privacy_desc": "Những gì chúng tôi không thu thập",
  "settings.help.privacy_a11y": "Mở Chính sách quyền riêng tư",

  // ---- Settings: support ----
  "settings.support.card": "Thẻ hoặc UPI",
  "settings.support.card_desc": "Ngân hàng trực tuyến và ví điện tử, toàn cầu",
  "settings.support.card_a11y":
    "Ủng hộ bằng thẻ, UPI, ngân hàng trực tuyến hoặc ví điện tử",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Hằng tháng hoặc một lần, không mất phí nền tảng",
  "settings.support.sponsors_a11y": "Ủng hộ qua GitHub Sponsors",
  "settings.support.note":
    "Tôi làm Airhop lúc rảnh rỗi. Không có nhà đầu tư và không có quảng cáo. Nếu nó hữu ích với bạn, một khoản đóng góp giúp việc phát triển tiếp tục rất nhiều. Dù thế nào thì mọi tính năng vẫn luôn miễn phí.",

  // ---- Settings: about and version ----
  "settings.about.version": "Phiên bản",
  "settings.about.version_desc": "Bản phát hành hiện tại",
  "settings.about.version_a11y": "Xem phiên bản và kiểm tra bản cập nhật",
  "settings.about.release_notes": "Ghi chú phát hành",
  "settings.about.release_notes_desc": "Có gì mới trong bản phát hành mới nhất",
  "settings.about.release_notes_a11y":
    "Mở ghi chú phát hành mới nhất trên GitHub",
  "settings.about.source": "Mã nguồn",
  "settings.about.source_a11y": "Mở mã nguồn trên GitHub",
  "settings.about.licenses": "Giấy phép nguồn mở",
  "settings.about.open_repo": "Mở kho mã {name}",
  "settings.about.licenses_desc": "Các gói nguồn mở của bên thứ ba",
  "settings.about.licenses_a11y": "Xem giấy phép của bên thứ ba",
  "settings.version.codename": "Tên mã",
  "settings.version.checking": "Đang kiểm tra",
  "settings.version.check": "Kiểm tra bản cập nhật",
  "settings.version.checking_title": "Đang kiểm tra bản cập nhật",
  "settings.version.up_to_date": "Bạn đang dùng phiên bản mới nhất.",
  "settings.version.release_notes": "Xem ghi chú phát hành",
  "settings.version.made_with": "Làm bằng",
  "settings.version.number": "Phiên bản {version}",
  "settings.version.update_to": "Cập nhật lên {version}",
  "settings.version.update_to_a11y": "Cập nhật lên phiên bản {version}",
  "settings.version.released_under": "Phát hành theo {license}",
  "settings.version.notes_a11y":
    "Xem ghi chú phát hành cho phiên bản {version}",
  "settings.version.tor_paused":
    "Việc kiểm tra cập nhật tạm dừng khi Tor đang bật, để nó không lộ IP của bạn. Hãy xem trang phát hành trong trình duyệt.",
  "settings.version.check_failed":
    "Không kiểm tra được bản cập nhật. Hãy kiểm tra kết nối của bạn rồi thử lại.",
  "settings.version.downloading": "Đang tải xuống {percent}%",
  "settings.version.install": "Cài đặt",
  "settings.version.download_failed":
    "Tải xuống thất bại. Kiểm tra kết nối và thử lại.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} nặng {size} KiB, vượt giới hạn {cap} KiB.",
  "transfer.failed.malformed":
    "Một tệp đính kèm tới nơi trong tình trạng hỏng và không mở được. Hãy nhờ họ gửi lại.",
  "transfer.failed.unsupported_type":
    "Một tệp đính kèm tới nơi ở định dạng mà ứng dụng này không mở được.",
  "transfer.failed.type_mismatch":
    "Một tệp đính kèm bị từ chối: nội dung của nó không khớp với kiểu tệp nó khai.",
  "transfer.failed.storage":
    "Một tệp đính kèm đã tới nơi nhưng không lưu được. Hãy kiểm tra dung lượng trống.",
  "transfer.badge.waiting": "Đang chờ · {name}",
  "transfer.badge.active_count": "{count} lượt truyền",
  "transfer.badge.sending": "Đang gửi {name}",
  "transfer.badge.receiving": "Đang nhận {name}",
  "transfer.badge.a11y": "{label}, {percent} phần trăm. Mở cuộc trò chuyện.",
  "transfer.kind.photo": "Ảnh",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Tin nhắn thoại",
  "transfer.this.photo": "Tấm ảnh này",
  "transfer.this.video": "Video này",
  "transfer.this.voice": "Tin nhắn thoại này",
  "transfer.this.file": "Tệp này",
  "transfer.kind.document": "Tài liệu",
  "transfer.kind.voice_preview": "Tin nhắn thoại",
  "transfer.kind.photo_preview": "Ảnh",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Tài liệu",

  // ---- System notifications ----
  "notif.channel.messages": "Tin nhắn",
  "notif.channel.nearby": "Nút mạng ở gần",
  "notif.channel.nearby_desc":
    "Thỉnh thoảng báo một lần khi mạng lưới tìm thấy người trong tầm Bluetooth.",
  "notif.nearby.body": "Đang trong tầm Bluetooth. Chạm để mở mạng lưới.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Ai đó",
  "notif.notice_urgent": "Bản tin khẩn · {content}",
  "notif.notice": "Bản tin · {content}",
  "notif.incoming_file": "Tệp đang tới",
  "notif.preview.photo": "📷 Ảnh",
  "notif.preview.voice": "🎤 Tin nhắn thoại",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Tài liệu",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Tin nhắn mới",
  "notif.hidden.channel": "Hoạt động mới",
  "notif.hidden.mention": "Bạn được nhắc tới",
  "notif.mention.title": "{sender} đã nhắc tới bạn",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "Hiện thêm {count}",
  },
  "chat.channels.show_more_a11y": {
    other: "Hiện thêm {count} kênh mặc định",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}, {count} chưa đọc",
  },
  "a11y.new_count": {
    other: "{label}, {count} mới",
  },
  "chat.a11y.unread": {
    other: "{count} chưa đọc",
  },
  "chat.thread.length_left": {
    other: "còn {count}",
  },
  "settings.general.retention_days": {
    other: "{count} ngày",
  },
  "chat.info.group_reach": {
    other: "Tới được {reachable} trên {count} thành viên",
  },
  "chat.group_members": {
    other: "Nhóm riêng tư  ·  {count} thành viên",
  },
  "chat.select.count": {
    other: "Đã chọn {count}",
  },
  "chat.select.forward": {
    other: "Chuyển tiếp {count} tin nhắn",
  },
  "chat.voice.live_speaking_count": {
    other: "{count} người đang nói",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "{count} nút mạng trong tầm",
  },
  "mesh.peer.hops_away": {
    other: "Cách {count} chặng",
  },
  "chat.presence.active": {
    other: "{count} đang hoạt động",
  },
  "chat.presence.nearby": {
    other: "{count} ở gần",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "{count} nhà đúc",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint} giữ {balance} {unit} trong {count} chứng từ. Gỡ nó đi sẽ hủy vĩnh viễn những chứng từ đó khỏi thiết bị này, và chúng không có bản sao lưu. Hãy rút hoặc gửi số dư đi trước.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other:
      "{count} khoản nạp đang đợi thanh toán. Chúng được kiểm tra lại mỗi lần ứng dụng mở lên.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "Đã khôi phục {count} chứng từ chưa tiêu từ {mints}.",
  },
  "wallet.backup.already_spent": {
    other:
      "Tìm thấy {count} đồng, nhưng chúng đã bị tiêu rồi nên không có gì được cộng vào cho chúng. Đó là chuyện bình thường: mọi đồng bạn từng tiêu đều nằm mãi trong sổ sách mà nhà đúc lưu giữ.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "Hiện thêm {count}",
  },
  "wallet.activity.show_more_a11y": {
    other: "Hiện thêm {count} khoản thanh toán",
  },
  "wallet.mint.unconfirmed_count": {
    other: "{count} chưa xác nhận",
  },
  "wallet.proof_count": {
    other: "{count} chứng từ",
  },
  "wallet.spent_removed_detail": {
    other: "{count} chứng từ đã bị tiêu từ trước, và chúng đã được gỡ đi.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "{count} người ở gần",
  },
};

export const vi = { strings, plurals };
