import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Quay lại trang chủ",
  "common.last_updated": "Cập nhật lần cuối: {date}",

  "nav.aria": "Điều hướng chính",
  "nav.home": "Trang chủ Airhop",
  "nav.skip": "Chuyển tới nội dung",
  "nav.menu.open": "Mở menu",
  "nav.menu.close": "Đóng menu",
  "nav.how_it_works": "Cách hoạt động",
  "nav.architecture": "Kiến trúc",
  "nav.faq": "Câu hỏi thường gặp",

  "footer.aria": "Chân trang",
  "footer.tagline": "Liên lạc mesh riêng tư",
  "footer.credit": "© Được làm với {heart} bởi {author}",
  "footer.group.download": "Tải về",
  "footer.group.resources": "Tài nguyên",
  "footer.group.social": "Mạng xã hội",
  "footer.group.legal": "Pháp lý",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "Kiến trúc",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "Câu hỏi thường gặp",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Điều khoản dịch vụ",
  "footer.link.privacy": "Chính sách quyền riêng tư",
  "footer.link.license": "Giấy phép dự án",

  "settings.theme.group": "Bảng màu",
  "settings.theme.light": "Giao diện sáng",
  "settings.theme.dark": "Giao diện tối",
  "settings.language.label": "Ngôn ngữ",
  "settings.language.suggestion": "Xem trang này bằng tiếng Việt",
  "settings.language.dismiss": "Đóng",

  "home.hero.release": "Bản phát hành mới nhất",
  "home.hero.title": "Nhắn tin hoạt động không cần internet.",
  "home.hero.body":
    "Các điện thoại ở gần tạo thành một mạng mesh Bluetooth và chuyển tiếp tin nhắn của bạn qua tối đa bảy chặng, mã hóa đầu cuối. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Không máy chủ",
  "home.hero.body.no_accounts": "không tài khoản",
  "home.hero.body.no_tracking": "không theo dõi",
  "home.hero.download": "Tải ứng dụng",
  "home.hero.badges": "Giấy phép MIT · Miễn phí và mã nguồn mở · Tương thích bitchat",
  "home.hero.group.mobile": "Di động",
  "home.hero.group.desktop": "Máy tính",
  "home.hero.option.zapstore": "Được ký trên Nostr",
  "home.hero.option.apk": "Tải trực tiếp",
  "home.hero.option.soon": "Sắp có",

  "home.about.eyebrow": "Airhop là gì",
  "home.about.title": "Hầu hết ứng dụng đều phụ thuộc vào một máy chủ trung tâm.",
  "home.about.sub":
    "Máy chủ có thể bị giám sát, tắt đi hoặc chặn. Airhop không có máy chủ nào, nên không có công ty nào để gây sức ép và không có dịch vụ nào để đóng.",
  "home.about.card": "Tổng quan kỹ thuật",
  "home.about.link.mesh": "mạng mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "giao thức truyền",
  "home.about.body.built":
    "Airhop là ứng dụng mã nguồn mở cho iOS và Android, dùng để nhắn tin riêng tư ngang hàng qua {mesh}. Ứng dụng được xây trên nền tảng của {bitchat}, tái sử dụng {wire_protocol} và mô hình bảo mật của nó, rồi mở rộng thêm thanh toán {ecash} ngoại tuyến và AI ngoại tuyến. Nó hoạt động khi hoàn toàn không có internet, và tin nhắn được chuyển tiếp tự động giữa các thiết bị ở gần (khoảng 10 đến 30 mét mỗi chặng trong nhà, xa hơn ở ngoài trời), tối đa 7 chặng.",
  "home.about.body.identity":
    "Danh tính của bạn là một cặp khóa {ed25519} được tạo trên thiết bị của bạn và lưu trong {ios_keychain} hoặc {android_keystore}. Không có tài khoản, không đăng ký, và không có gì chạm tới máy chủ nào, tức là có thể dùng như một ứng dụng dùng một lần, sau khi xóa không để lại gì dẫn ngược về bạn.",
  "home.about.body.crypto":
    "Mỗi phiên dùng giao thức {noise} cho bước bắt tay có xác thực. Tin nhắn đã lưu dùng thuật toán {ratchet}, tức là ngay cả khi thiết bị của bạn bị xâm nhập về sau, những tin nhắn cũ vẫn không đọc được. Xóa khẩn cấp hủy mọi khóa và tin nhắn trong chưa đầy một giây.",
  "home.about.body.internet":
    "Khi bạn và người liên hệ ở ngoài tầm Bluetooth, các relay {nostr} đóng vai trò cầu nối qua internet, dùng tin nhắn trực tiếp được bọc theo định dạng {nip17}, nhờ vậy mạng mesh vươn ra toàn cầu mỗi khi cả hai đều trực tuyến. Hỗ trợ {tor} có trên cả iOS và Android, qua {arti}, kèm bridge {obfs4} và {snowflake} cho những mạng chặn Tor.",
  "home.about.optional.title": "Airhop có những tính năng tùy chọn mà bạn có thể bật:",
  "home.about.optional.payments.label": "Thanh toán ngoại tuyến:",
  "home.about.optional.payments.body":
    "Gửi và nhận thanh toán qua mạng mesh bằng giao thức {cashu} (chỉ Bitcoin).",
  "home.about.optional.ai.label": "AI ngoại tuyến:",
  "home.about.optional.ai.body":
    "Một trợ lý AI nhỏ chạy trên thiết bị, trả lời được những câu hỏi quan trọng. Toàn bộ xử lý và dữ liệu đều ở lại trên thiết bị của bạn.",
  "home.about.body.compatible":
    "Airhop tương thích với bitchat ở mức giao thức. Một thiết bị Airhop và một thiết bị bitchat trong cùng mạng mesh tự tìm thấy nhau và có thể trao đổi tin nhắn cùng tin nhắn trực tiếp mà không cần cấu hình gì.",

  "home.situations.eyebrow": "Khi nào bạn cần",
  "home.situations.title": "Cho ngày mạng sập.",
  "home.situations.sub":
    "Thiên tai, mất internet, biểu tình lớn, hoặc một cuối tuần bình thường ngoài vùng phủ sóng.",
  "home.situations.disaster.label": "Thảm họa",
  "home.situations.disaster.line":
    "Các trạm phát đã sập. Một thông báo trên bảng tin đến được với bất kỳ ai đi ngang qua.",
  "home.situations.offgrid.label": "Ngoài lưới",
  "home.situations.offgrid.line":
    "Ngày thứ hai trên đường mòn. Vạch sóng cuối cùng đã biến mất từ hôm qua.",
  "home.situations.protest.label": "Biểu tình",
  "home.situations.protest.line": "Một mã QR trên tờ rơi mở ra một kênh mã hóa cho đoàn tuần hành.",
  "home.situations.festival.label": "Lễ hội",
  "home.situations.festival.line":
    "Không có sóng trong khuôn viên. Tin nhắn nhảy qua điện thoại của những người lạ.",

  "home.showcase.eyebrow": "Xem ứng dụng",
  "home.showcase.title": "Một ứng dụng nhắn tin bình thường, ngoại tuyến.",
  "home.showcase.sub":
    "Trò chuyện, kênh, ví và danh tính. Quen thuộc ở bề mặt, bên dưới là mạng mesh làm việc.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Mọi người trong tầm, sắp xếp theo mức độ gần. Không cần thêm ai trước.",
  "home.showcase.mesh.alt":
    "Màn hình Mesh của ứng dụng Airhop, hiển thị bốn thiết bị ở gần được sắp trên một radar theo cường độ tín hiệu.",
  "home.showcase.chats.title": "Trò chuyện",
  "home.showcase.chats.caption":
    "Những cuộc trò chuyện bình thường. Các điện thoại chuyển tiếp từng tin nhắn không thể mở nó.",
  "home.showcase.chats.alt":
    "Một cuộc trò chuyện riêng trong Airhop lúc mất điện, được chuyển tiếp qua ba điện thoại.",
  "home.showcase.channels.title": "Kênh",
  "home.showcase.channels.caption":
    "Phòng công khai nhỏ như một dãy phố hoặc rộng như cả một vùng, mở cho bất kỳ ai ở đó.",
  "home.showcase.channels.alt":
    "Màn hình trò chuyện của ứng dụng Airhop, liệt kê các kênh công khai giới hạn theo dãy phố, khu phố, thành phố và vùng.",
  "home.showcase.wallet.title": "Ví",
  "home.showcase.wallet.caption":
    "Đưa ecash cho người bên cạnh qua Bluetooth, khi không máy nào trực tuyến.",
  "home.showcase.wallet.alt":
    "Màn hình ví của ứng dụng Airhop, hiển thị số dư ecash có thể gửi qua Bluetooth.",
  "home.showcase.identity.title": "Danh tính",
  "home.showcase.identity.caption":
    "Không đăng ký, không số điện thoại, không email. Chỉ một khóa không bao giờ rời khỏi máy này.",
  "home.showcase.identity.alt":
    "Màn hình hồ sơ của ứng dụng Airhop, hiển thị danh tính được tạo trên thiết bị mà không có tài khoản.",

  "home.how.eyebrow": "Cách hoạt động",
  "home.how.title": "Mạng mesh tự hình thành.",
  "home.how.sub":
    "Các nút ở gần tạo thành một mạng mesh tự phục hồi qua Bluetooth. Khi có internet, các relay Nostr mở rộng nó, không có hạ tầng nào do ai đó kiểm soát.",
  "home.how.cta": "Đọc toàn bộ kiến trúc",
  "home.how.discover.title": "Phát hiện",
  "home.how.discover.line":
    "Các điện thoại chạy Airhop hoặc bitchat tự tìm thấy nhau qua Bluetooth. Không ghép đôi, không thiết lập.",
  "home.how.relay.title": "Chuyển tiếp",
  "home.how.relay.line":
    "Một tin nhắn nhảy từ máy này sang máy khác, tối đa bảy chặng. Các máy ở giữa không bao giờ thấy thứ chúng mang.",
  "home.how.reach.title": "Đi xa hơn",
  "home.how.reach.line":
    "Khi có internet, các relay Nostr đưa cùng cuộc trò chuyện đi xa hơn, có thể qua Tor nếu muốn.",
  "home.how.swipe": "vuốt để xem",
  "home.how.diagram": "Mạng mesh BLE · mạng ngang hàng cục bộ",
  "home.how.legend.node": "Nút mạng mesh BLE (ngoại tuyến)",
  "home.how.legend.relay": "Chuyển tiếp nhiều chặng (mã hóa Noise XX)",
  "home.how.legend.bitchat": "Tương thích bitchat trên cùng mạng mesh",
  "home.how.legend.nostr": "Cầu Nostr (internet, khi trực tuyến)",

  "home.map.aria": "Bản đồ thế giới các vị trí relay Nostr",
  "home.map.summary": "Cầu Nostr · {relays} tại {locations} trên khắp thế giới",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Nó làm được gì",
  "home.features.title": "Một ứng dụng nhắn tin thực thụ, không phải bản demo.",
  "home.features.sub":
    "Trò chuyện, danh tính, mạng và tiền. Tất cả được dựng để chạy khi không sóng, không tài khoản và không có gì ở giữa.",

  "home.features.messaging.title": "Nhắn tin",
  "home.features.messaging.summary":
    "Mọi thứ một ứng dụng nhắn tin có, với hạ tầng phía sau bằng không.",
  "home.features.messaging.dms.name": "Tin nhắn riêng",
  "home.features.messaging.dms.line": "Mã hóa đầu cuối, có báo đã gửi và đã đọc.",
  "home.features.messaging.location.name": "Kênh theo vị trí",
  "home.features.messaging.location.line":
    "Các phòng gắn với một nơi, từ một dãy phố tới cả một vùng.",
  "home.features.messaging.groups.name": "Kênh và nhóm riêng",
  "home.features.messaging.groups.line":
    "Liên kết mời vào phòng, hoặc một danh sách có chữ ký tối đa 16 người.",
  "home.features.messaging.board.name": "Bảng tin",
  "home.features.messaging.board.line": "Thông báo ghim vào một khu vực tối đa bảy ngày.",
  "home.features.messaging.voice.name": "Thoại trực tiếp",
  "home.features.messaging.voice.line": "Giữ micro và nói với bất kỳ ai trong tầm, như bộ đàm.",
  "home.features.messaging.notes.name": "Tin nhắn thoại",
  "home.features.messaging.notes.line": "Âm thanh đã ghi, nhanh hơn gõ chỉ đường.",
  "home.features.messaging.files.name": "Ảnh, video và tệp",
  "home.features.messaging.files.line": "Mọi định dạng, tối đa 1 MiB, không cần sóng.",
  "home.features.messaging.forward.name": "Lưu và chuyển tiếp",
  "home.features.messaging.forward.line":
    "Được niêm phong và mang theo bởi một điện thoại ở gần cho tới khi đến nơi.",

  "home.features.identity.title": "Danh tính",
  "home.features.identity.summary": "Không có gì để đăng ký, không có gì để tịch thu.",
  "home.features.identity.keys.name": "Danh tính bằng cặp khóa",
  "home.features.identity.keys.line":
    "Tạo trên chính máy này, lưu trong kho khóa của hệ điều hành.",
  "home.features.identity.names.name": "Tên dễ đọc",
  "home.features.identity.names.line": "Suy ra từ khóa của bạn, nên không ai lấy được tên của bạn.",
  "home.features.identity.qr.name": "Danh bạ qua QR",
  "home.features.identity.qr.line": "Một lần quét mang theo khóa của họ, không chỉ tên.",
  "home.features.identity.panic.name": "Xóa khẩn cấp",
  "home.features.identity.panic.line": "Mọi khóa và mọi tin nhắn bị hủy trong chưa đầy một giây.",

  "home.features.networking.title": "Mạng",
  "home.features.networking.summary": "Chính các điện thoại là mạng.",
  "home.features.networking.mesh.name": "Mạng mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Không internet, không router, trên những điện thoại mọi người đã có.",
  "home.features.networking.bridge.name": "Cầu mesh",
  "home.features.networking.bridge.line":
    "Nối cuộc trò chuyện công khai của bạn với một nhóm ở gần nhưng ngoài tầm.",
  "home.features.networking.wifi.name": "Đường nhanh WiFi",
  "home.features.networking.wifi.line": "Truyền nhanh hơn giữa hai máy Android hoặc hai iPhone.",
  "home.features.networking.bitchat.name": "Tương thích bitchat",
  "home.features.networking.bitchat.line":
    "Cả hai ứng dụng vào cùng một mạng mesh mà không cần thiết lập.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Một phần mở rộng, không bao giờ là điều kiện bắt buộc.",
  "home.features.internet.nostr.name": "Dự phòng qua Nostr",
  "home.features.internet.nostr.line":
    "Tin nhắn riêng và kênh theo vị trí vẫn chạy khi đã ra ngoài tầm sóng.",
  "home.features.internet.relays.name": "Tìm geo-relay",
  "home.features.internet.relays.line":
    "Hơn 300 relay công cộng độc lập, không cái nào là của chúng tôi.",
  "home.features.internet.gateway.name": "Cổng internet",
  "home.features.internet.gateway.line":
    "Cho mượn kết nối của bạn để một máy ngoại tuyến ở gần vào được các kênh theo vị trí.",
  "home.features.internet.tor.name": "Tích hợp Tor",
  "home.features.internet.tor.line":
    "Được định tuyến trên cả hai nền tảng, nên các relay không bao giờ thấy IP của bạn.",

  "home.features.optional.title": "Tùy chọn",
  "home.features.optional.summary": "Mặc định tắt. Bật khi bạn muốn.",
  "home.features.optional.cashu.name": "Ecash Cashu",
  "home.features.optional.cashu.line": "Trả tiền cho người bên cạnh khi không máy nào trực tuyến.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Nạp hoặc rút bằng bitcoin qua mạng Lightning.",
  "home.features.optional.ai.name": "AI cục bộ",
  "home.features.optional.ai.line": "Trả lời ngay trên máy, không gì rời khỏi điện thoại.",
  "home.features.optional.social.name": "Cầu nối mạng xã hội",
  "home.features.optional.social.line": "Bluesky và Mastodon với cùng một danh tính.",

  "home.compare.eyebrow": "So sánh",
  "home.compare.title": "Ngoại tuyến, không cần thiết bị thêm, và mở.",
  "home.compare.sub":
    "Mỗi ứng dụng ở đây đều giỏi ở điểm nào đó. Chỉ một số vẫn chạy khi mạng thì không.",
  "home.compare.col.project": "Dự án",
  "home.compare.col.transport": "Đường truyền",
  "home.compare.col.encryption": "Mã hóa",
  "home.compare.col.offline": "Chạy ngoại tuyến",
  "home.compare.col.hardware_free": "Không cần thiết bị thêm",
  "home.compare.col.open_source": "Mã nguồn mở",
  "home.compare.mark.yes": "Có",
  "home.compare.mark.no": "Không",
  "home.compare.mark.partial": "Một phần, ứng dụng khách là mã nguồn mở, máy chủ thì không",
  "home.compare.mark.partial_hint": "Ứng dụng khách là mã nguồn mở, máy chủ thì không",
  "home.compare.transport.servers": "Máy chủ tập trung",
  "home.compare.transport.onion": "Định tuyến củ hành (nút dịch vụ)",
  "home.compare.transport.nostr": "Relay Nostr",
  "home.compare.transport.lora": "Sóng LoRa",
  "home.compare.transport.sub_ghz": "Sóng sub-GHz độc quyền",

  "home.explore.eyebrow": "Mở và thẳng thắn",
  "home.explore.title": "Mọi tuyên bố ở đây đều kiểm chứng được.",
  "home.explore.sub":
    "Mã nguồn, giao thức và kế hoạch đều công khai. Các giới hạn cũng vậy. Hãy tự kiểm tra trước khi tin lời chúng tôi.",
  "home.explore.audit.chip": "Chờ kiểm định",
  "home.explore.audit.headline": "Airhop chưa từng qua kiểm định an ninh từ bên ngoài.",
  "home.explore.audit.body":
    "{headline} Toàn bộ mã nguồn được tự tay rà soát và chạy qua một {review} trước khi phát hành, và thư viện mật mã mà nó dùng đã được Cure53 kiểm định, nhưng điều đó không thay thế một cuộc kiểm định chính thức cho chính ứng dụng. Một cuộc kiểm định được lên kế hoạch cho {version}. Từ nay đến lúc đó, đừng dựa vào nó cho những tình huống nhạy cảm.",
  "home.explore.audit.link.review": "tác nhân rà soát an ninh",
  "home.explore.source.title": "Mã nguồn",
  "home.explore.source.desc":
    "Toàn bộ trên GitHub theo giấy phép MIT. Issue, pull request và thảo luận đều mở.",
  "home.explore.protocol.title": "Đặc tả giao thức",
  "home.explore.protocol.desc":
    "Định dạng truyền chính xác, các UUID của BLE và các hằng số, dùng chung với bitchat.",
  "home.explore.architecture.title": "Kiến trúc",
  "home.explore.architecture.desc":
    "Toàn bộ phân tích kỹ thuật, từ lúc chạm nút gửi tới những byte trên sóng.",
  "home.explore.roadmap.title": "Lộ trình",
  "home.explore.roadmap.desc":
    "Mục tiêu các phiên bản từ v0.5.0 tới v2.0.0, gồm cả cuộc kiểm định đã lên kế hoạch.",
  "home.explore.vision.title": "Tầm nhìn",
  "home.explore.vision.desc": "Vì sao Airhop tồn tại, và những nguyên tắc không đổi dưới áp lực.",
  "home.explore.brand.title": "Bộ nhận diện",
  "home.explore.brand.desc":
    "Chú chim pixel, các token màu và kiểu chữ, tài nguyên báo chí và văn bản mẫu.",

  "home.contribute.eyebrow": "Ủng hộ dự án này",
  "home.contribute.title": "Độc lập, và công khai.",
  "home.contribute.sub":
    "Không có nhà đầu tư, không quảng cáo, không bản trả phí. Mọi tính năng vẫn miễn phí, và công việc được tài trợ bởi những người thấy nó hữu ích.",
  "home.contribute.contribute.chip": "Đóng góp",
  "home.contribute.contribute.body":
    "Gắn sao cho kho mã, mở issue và gửi pull request. Báo lỗi, đề xuất tính năng và đóng góp mã đều được chào đón.",
  "home.contribute.contribute.cta": "Xem trên GitHub",
  "home.contribute.sponsor.chip": "Tài trợ",
  "home.contribute.sponsor.body":
    "Nếu Airhop hữu ích với bạn, một khoản quyên góp một lần hoặc tài trợ định kỳ giúp rất nhiều để giữ việc phát triển tiếp tục.",
  "home.contribute.sponsor.donate": "Quyên góp một lần",
  "home.contribute.sponsor.github": "Tài trợ trên GitHub",

  "page.architecture.eyebrow": "Tài liệu",
  "page.architecture.title": "Kiến trúc",
  "page.architecture.toc": "Trên trang này",

  "page.faq.eyebrow": "Câu hỏi thường gặp",
  "page.faq.title": "Những câu hỏi thường gặp",
  "page.faq.meta": "Các thắc mắc phổ biến về Airhop.",
  "page.faq.contact":
    "Những câu hỏi chưa được trả lời ở đây có thể gửi tới {email} hoặc nêu ra bằng cách mở một thảo luận trên {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Sắp có",
  "page.blogs.body": "Các bài viết về mạng mesh, quyền riêng tư và phần mềm ưu tiên ngoại tuyến.",

  "page.brand.eyebrow": "Thương hiệu",
  "page.brand.title": "Bộ nhận diện",
  "page.brand.meta":
    "Tài nguyên và quy tắc để đưa Airhop vào một bài viết, một trang cửa hàng, một buổi nói chuyện hay một tệp README. Tự do dùng để tham chiếu và cho báo chí.",

  "page.legal.eyebrow": "Pháp lý",
  "page.privacy.title": "Chính sách quyền riêng tư",
  "page.terms.title": "Điều khoản dịch vụ",

  "page.notfound.title": "Không tìm thấy trang",
  "page.notfound.body": "Trang bạn tìm không tồn tại hoặc đã được chuyển đi.",

  "page.english_only": "Trang này chỉ có bằng tiếng Anh.",

  "seo.breadcrumb.home": "Trang chủ",

  "seo.home.title": "Airhop — Ứng dụng nhắn tin riêng tư, ưu tiên ngoại tuyến",
  "seo.home.description":
    "Nhắn tin riêng tư ngang hàng cho iOS và Android. Không internet, không máy chủ, không tài khoản. Liên lạc qua mạng mesh Bluetooth ở bất cứ đâu.",

  "seo.architecture.title": "Kiến trúc — Airhop",
  "seo.architecture.description":
    "Airhop hoạt động ra sao từ trên xuống dưới: danh tính, chọn đường truyền, mạng mesh Bluetooth, mã hóa, lớp internet, Tor, ecash ngoại tuyến, AI trên thiết bị và định dạng truyền tương thích bitchat.",
  "seo.architecture.breadcrumb": "Kiến trúc",
  "seo.architecture.headline": "Kiến trúc Airhop",
  "seo.architecture.summary":
    "Phân tích kỹ thuật đầy đủ về Airhop: danh tính, các đường truyền, mạng mesh Bluetooth, mã hóa, lớp internet Nostr, Tor, ví Cashu, trợ lý AI trên thiết bị và định dạng truyền.",

  "seo.faq.title": "Câu hỏi thường gặp — Airhop",
  "seo.faq.description":
    "Giải đáp về nhắn tin qua mạng mesh Bluetooth của Airhop, mã hóa, thanh toán ngoại tuyến, lớp internet Nostr và khả năng tương thích với bitchat.",
  "seo.faq.breadcrumb": "Câu hỏi thường gặp",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description":
    "Các bài viết về mạng mesh, quyền riêng tư và phần mềm ưu tiên ngoại tuyến.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Bộ nhận diện — Airhop",
  "seo.brand.description":
    "Bộ nhận diện Airhop: biểu tượng chim pixel, chữ ký thương hiệu, các token màu và kiểu chữ, tài nguyên báo chí và văn bản mẫu.",
  "seo.brand.breadcrumb": "Bộ nhận diện",

  "seo.privacy.title": "Chính sách quyền riêng tư — Airhop",
  "seo.privacy.description":
    "Cách Airhop xử lý dữ liệu: không tài khoản, không máy chủ, không theo dõi. Danh tính và tin nhắn của bạn ở lại trên thiết bị của bạn.",
  "seo.privacy.breadcrumb": "Chính sách quyền riêng tư",

  "seo.terms.title": "Điều khoản dịch vụ — Airhop",
  "seo.terms.description": "Các điều khoản điều chỉnh việc sử dụng ứng dụng và trang web Airhop.",
  "seo.terms.breadcrumb": "Điều khoản dịch vụ",

  "seo.notfound.title": "Không tìm thấy trang — Airhop",
  "seo.notfound.description": "Trang bạn tìm không tồn tại hoặc đã được chuyển đi.",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "{count} relay",
  },
  "home.map.locations": {
    other: "{count} địa điểm",
  },
};

export const locale: Locale = { strings, plurals };
