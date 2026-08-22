import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "กลับสู่หน้าแรก",
  "common.last_updated": "อัปเดตล่าสุด: {date}",

  "nav.aria": "การนำทางหลัก",
  "nav.home": "หน้าแรกของ Airhop",
  "nav.skip": "ข้ามไปยังเนื้อหา",
  "nav.menu.open": "เปิดเมนู",
  "nav.menu.close": "ปิดเมนู",
  "nav.how_it_works": "วิธีการทำงาน",
  "nav.architecture": "สถาปัตยกรรม",
  "nav.faq": "คำถามที่พบบ่อย",

  "footer.aria": "ส่วนท้าย",
  "footer.tagline": "การสื่อสารแบบเมชที่เป็นส่วนตัว",
  "footer.credit": "© สร้างด้วย {heart} โดย {author}",
  "footer.group.download": "ดาวน์โหลด",
  "footer.group.resources": "แหล่งข้อมูล",
  "footer.group.social": "โซเชียล",
  "footer.group.legal": "ข้อกฎหมาย",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "สถาปัตยกรรม",
  "footer.link.blogs": "บล็อก",
  "footer.link.faq": "คำถามที่พบบ่อย",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "ข้อกำหนดในการให้บริการ",
  "footer.link.privacy": "นโยบายความเป็นส่วนตัว",
  "footer.link.license": "สัญญาอนุญาตของโครงการ",

  "settings.theme.group": "ธีมสี",
  "settings.theme.light": "ธีมสว่าง",
  "settings.theme.dark": "ธีมมืด",
  "settings.language.label": "ภาษา",
  "settings.language.suggestion": "ดูหน้านี้เป็นภาษาไทย",
  "settings.language.dismiss": "ปิด",

  "home.hero.release": "รุ่นล่าสุด",
  "home.hero.title": "การส่งข้อความที่ใช้ได้โดยไม่ต้องมีอินเทอร์เน็ต",
  "home.hero.body":
    "โทรศัพท์ที่อยู่ใกล้กันรวมตัวเป็นเครือข่ายเมชผ่าน Bluetooth และส่งต่อข้อความของคุณได้สูงสุดเจ็ดทอด โดยเข้ารหัสตลอดเส้นทาง {no_servers} {no_accounts} {no_tracking}",
  "home.hero.body.no_servers": "ไม่มีเซิร์ฟเวอร์",
  "home.hero.body.no_accounts": "ไม่มีบัญชี",
  "home.hero.body.no_tracking": "ไม่มีการติดตาม",
  "home.hero.download": "ดาวน์โหลดแอป",
  "home.hero.badges": "สัญญาอนุญาต MIT · ฟรีและโอเพนซอร์ส · ใช้ร่วมกับ bitchat ได้",
  "home.hero.group.mobile": "มือถือ",
  "home.hero.group.desktop": "เดสก์ท็อป",
  "home.hero.option.f_droid": "แคตตาล็อกโอเพนซอร์ส",
  "home.hero.option.apk": "ดาวน์โหลดโดยตรง",
  "home.hero.option.soon": "เร็ว ๆ นี้",

  "home.about.eyebrow": "Airhop คืออะไร",
  "home.about.title": "แอปส่วนใหญ่ต้องพึ่งเซิร์ฟเวอร์ส่วนกลาง",
  "home.about.sub":
    "เซิร์ฟเวอร์ถูกสอดส่อง ปิด หรือบล็อกได้ Airhop ไม่มีเซิร์ฟเวอร์เลย จึงไม่มีบริษัทให้กดดันและไม่มีบริการให้ปิด",
  "home.about.card": "ภาพรวมทางเทคนิค",
  "home.about.link.mesh": "เครือข่ายเมช Bluetooth Low Energy",
  "home.about.link.wire_protocol": "โปรโตคอลการรับส่ง",
  "home.about.body.built":
    "Airhop เป็นแอปโอเพนซอร์สสำหรับ iOS และ Android สำหรับการส่งข้อความส่วนตัวระหว่างเครื่องโดยตรงผ่าน {mesh} แอปนี้สร้างบนรากฐานของ {bitchat} โดยนำ {wire_protocol} และแบบจำลองความปลอดภัยมาใช้ซ้ำ แล้วขยายด้วยการชำระเงิน {ecash} แบบออฟไลน์ และ AI แบบออฟไลน์ ทำงานได้โดยไม่ต้องมีอินเทอร์เน็ตเลย และข้อความจะถูกส่งต่ออัตโนมัติผ่านอุปกรณ์ที่อยู่ใกล้เคียง (ราว 10 ถึง 30 เมตรต่อทอดในอาคาร และไกลกว่านั้นในที่โล่ง) สูงสุด 7 ทอด",
  "home.about.body.identity":
    "ตัวตนของคุณคือคู่กุญแจ {ed25519} ที่สร้างขึ้นบนเครื่องของคุณและเก็บไว้ใน {ios_keychain} หรือ {android_keystore} ไม่มีบัญชี ไม่มีการลงทะเบียน และไม่มีสิ่งใดที่แตะเซิร์ฟเวอร์ กล่าวคือใช้เป็นแอปชั่วคราวที่เมื่อลบแล้วไม่เหลือสิ่งใดย้อนกลับมาถึงคุณ",
  "home.about.body.crypto":
    "ทุกเซสชันใช้โปรโตคอล {noise} สำหรับการจับมือที่ยืนยันตัวตน ข้อความที่เก็บไว้ใช้อัลกอริทึม {ratchet} กล่าวคือแม้เครื่องของคุณจะถูกเจาะในภายหลัง ข้อความเก่าก็ยังอ่านไม่ได้ การล้างฉุกเฉินจะทำลายกุญแจและข้อความทั้งหมดภายในไม่ถึงหนึ่งวินาที",
  "home.about.body.internet":
    "เมื่อคุณกับผู้ติดต่ออยู่นอกระยะ Bluetooth รีเลย์ของ {nostr} จะทำหน้าที่เป็นสะพานผ่านอินเทอร์เน็ต โดยใช้ข้อความส่วนตัวที่ห่อในรูปแบบ {nip17} เครือข่ายเมชจึงขยายไปทั่วโลกเมื่อทั้งสองฝ่ายออนไลน์ การรองรับ {tor} ก็มีทั้งบน iOS (ผ่าน {arti}) และ Android (ผ่าน {orbot})",
  "home.about.optional.title": "Airhop มีคุณสมบัติเสริมที่คุณเปิดใช้เองได้:",
  "home.about.optional.payments.label": "การชำระเงินออฟไลน์:",
  "home.about.optional.payments.body":
    "ส่งและรับเงินผ่านเครือข่ายเมชด้วยโปรโตคอล {cashu} (รองรับเฉพาะ Bitcoin)",
  "home.about.optional.ai.label": "AI ออฟไลน์:",
  "home.about.optional.ai.body":
    "ผู้ช่วย AI ขนาดเล็กที่ทำงานบนเครื่อง ตอบคำถามสำคัญได้ การประมวลผลและข้อมูลทั้งหมดอยู่บนเครื่องของคุณ",
  "home.about.body.compatible":
    "Airhop ใช้ร่วมกับ bitchat ได้ในระดับโปรโตคอล เครื่องที่ใช้ Airhop และเครื่องที่ใช้ bitchat บนเมชเดียวกันจะค้นพบกันเองโดยอัตโนมัติ และแลกเปลี่ยนข้อความและข้อความส่วนตัวได้โดยไม่ต้องตั้งค่าใด ๆ",

  "home.situations.eyebrow": "เมื่อคุณต้องใช้",
  "home.situations.title": "สำหรับวันที่เครือข่ายล่ม",
  "home.situations.sub":
    "ภัยธรรมชาติ การตัดอินเทอร์เน็ต การชุมนุมขนาดใหญ่ หรือสุดสัปดาห์ธรรมดานอกพื้นที่สัญญาณ",
  "home.situations.disaster.label": "ภัยพิบัติ",
  "home.situations.disaster.line": "เสาสัญญาณล่ม ประกาศบนกระดานส่งถึงทุกคนที่เดินผ่าน",
  "home.situations.offgrid.label": "นอกเครือข่าย",
  "home.situations.offgrid.line": "วันที่สองบนเส้นทาง ขีดสัญญาณสุดท้ายหายไปเมื่อวาน",
  "home.situations.protest.label": "การชุมนุม",
  "home.situations.protest.line": "คิวอาร์โค้ดบนใบปลิวเปิดช่องทางเข้ารหัสสำหรับขบวน",
  "home.situations.festival.label": "เทศกาล",
  "home.situations.festival.line": "ไม่มีสัญญาณในพื้นที่ ข้อความกระโดดผ่านโทรศัพท์ของคนแปลกหน้า",

  "home.showcase.eyebrow": "ดูแอป",
  "home.showcase.title": "แอปส่งข้อความธรรมดา ที่ใช้ได้แบบออฟไลน์",
  "home.showcase.sub":
    "แชท ช่อง กระเป๋าเงิน และตัวตน คุ้นเคยที่ผิวหน้า โดยมีเมชอยู่ข้างล่างคอยทำงาน",
  "home.showcase.mesh.title": "เมช",
  "home.showcase.mesh.caption": "ทุกคนที่อยู่ในระยะ เรียงตามความใกล้ ไม่ต้องเพิ่มใครก่อน",
  "home.showcase.mesh.alt":
    "หน้าจอเมชของแอป Airhop แสดงอุปกรณ์ใกล้เคียงสี่เครื่องเรียงบนเรดาร์ตามความแรงของสัญญาณ",
  "home.showcase.chats.title": "แชท",
  "home.showcase.chats.caption": "บทสนทนาธรรมดา โทรศัพท์ที่ส่งต่อข้อความแต่ละชิ้นเปิดอ่านไม่ได้",
  "home.showcase.chats.alt": "บทสนทนาส่วนตัวใน Airhop ระหว่างไฟดับ ส่งต่อผ่านโทรศัพท์สามเครื่อง",
  "home.showcase.channels.title": "ช่อง",
  "home.showcase.channels.caption":
    "ห้องสาธารณะ เล็กเท่าหนึ่งช่วงตึกหรือกว้างเท่าหนึ่งภูมิภาค เปิดให้ทุกคนที่อยู่ตรงนั้น",
  "home.showcase.channels.alt":
    "หน้าจอแชทของแอป Airhop แสดงช่องสาธารณะที่กำหนดขอบเขตเป็นช่วงตึก ย่าน เมือง และภูมิภาค",
  "home.showcase.wallet.title": "กระเป๋าเงิน",
  "home.showcase.wallet.caption":
    "ส่ง ecash ให้คนข้าง ๆ ผ่าน Bluetooth โดยที่ทั้งสองเครื่องไม่ต้องออนไลน์",
  "home.showcase.wallet.alt":
    "หน้าจอกระเป๋าเงินของแอป Airhop แสดงยอด ecash ที่ส่งผ่าน Bluetooth ได้",
  "home.showcase.identity.title": "ตัวตน",
  "home.showcase.identity.caption":
    "ไม่ต้องสมัคร ไม่ต้องใช้เบอร์โทร ไม่ต้องใช้อีเมล มีเพียงกุญแจที่ไม่เคยออกจากเครื่องนี้",
  "home.showcase.identity.alt":
    "หน้าจอโปรไฟล์ของแอป Airhop แสดงตัวตนที่สร้างบนเครื่องโดยไม่มีบัญชี",

  "home.how.eyebrow": "วิธีการทำงาน",
  "home.how.title": "เมชก่อตัวขึ้นเอง",
  "home.how.sub":
    "โหนดที่อยู่ใกล้กันก่อตัวเป็นเมชที่ซ่อมแซมตัวเองผ่าน Bluetooth เมื่อมีอินเทอร์เน็ต รีเลย์ของ Nostr จะขยายมันออกไป โดยไม่มีโครงสร้างพื้นฐานที่ใครควบคุม",
  "home.how.cta": "อ่านสถาปัตยกรรมฉบับเต็ม",
  "home.how.discover.title": "ค้นพบ",
  "home.how.discover.line":
    "โทรศัพท์ที่ใช้ Airhop หรือ bitchat จะค้นพบกันเองผ่าน Bluetooth ไม่ต้องจับคู่ ไม่ต้องตั้งค่า",
  "home.how.relay.title": "ส่งต่อ",
  "home.how.relay.line":
    "ข้อความกระโดดจากเครื่องหนึ่งไปอีกเครื่อง สูงสุดเจ็ดทอด เครื่องที่อยู่ตรงกลางไม่เคยเห็นสิ่งที่ตัวเองพาไป",
  "home.how.reach.title": "ไปได้ไกลขึ้น",
  "home.how.reach.line":
    "เมื่อมีอินเทอร์เน็ต รีเลย์ของ Nostr จะพาบทสนทนาเดียวกันไปได้ไกลขึ้น และจะผ่าน Tor ก็ได้",
  "home.how.swipe": "ปัดเพื่อสำรวจ",
  "home.how.diagram": "เมช BLE · เครือข่ายเฉพาะที่ระหว่างเครื่อง",
  "home.how.legend.node": "โหนดเมช BLE (ออฟไลน์)",
  "home.how.legend.relay": "การส่งต่อหลายทอด (เข้ารหัสด้วย Noise XX)",
  "home.how.legend.bitchat": "ใช้ร่วมกับ bitchat ได้บนเมชเดียวกัน",
  "home.how.legend.nostr": "สะพาน Nostr (อินเทอร์เน็ต เมื่อออนไลน์)",

  "home.map.aria": "แผนที่โลกแสดงตำแหน่งรีเลย์ของ Nostr",
  "home.map.summary": "สะพาน Nostr · {relays} ใน {locations} ทั่วโลก",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "ทำอะไรได้บ้าง",
  "home.features.title": "แอปส่งข้อความของจริง ไม่ใช่ตัวอย่างสาธิต",
  "home.features.sub":
    "แชท ตัวตน เครือข่าย และเงิน ทั้งหมดสร้างมาให้ทำงานได้โดยไม่มีสัญญาณ ไม่มีบัญชี และไม่มีอะไรอยู่ตรงกลาง",

  "home.features.messaging.title": "การส่งข้อความ",
  "home.features.messaging.summary":
    "ทุกอย่างที่แอปส่งข้อความมี โดยไม่มีโครงสร้างพื้นฐานอยู่เบื้องหลังเลย",
  "home.features.messaging.dms.name": "ข้อความส่วนตัวโดยตรง",
  "home.features.messaging.dms.line": "เข้ารหัสตลอดเส้นทาง พร้อมสถานะส่งถึงและอ่านแล้ว",
  "home.features.messaging.location.name": "ช่องตามตำแหน่ง",
  "home.features.messaging.location.line":
    "ห้องที่ผูกกับสถานที่ ตั้งแต่หนึ่งช่วงตึกจนถึงหนึ่งภูมิภาค",
  "home.features.messaging.groups.name": "ช่องและกลุ่มส่วนตัว",
  "home.features.messaging.groups.line": "ลิงก์เชิญเข้าห้อง หรือรายชื่อที่ลงนามได้สูงสุด 16 คน",
  "home.features.messaging.board.name": "กระดานประกาศ",
  "home.features.messaging.board.line": "ประกาศที่ปักไว้ในพื้นที่หนึ่งได้นานถึงเจ็ดวัน",
  "home.features.messaging.voice.name": "เสียงสด",
  "home.features.messaging.voice.line":
    "กดไมค์ค้างแล้วพูดกับใครก็ได้ที่อยู่ในระยะ เหมือนวิทยุสื่อสาร",
  "home.features.messaging.notes.name": "ข้อความเสียง",
  "home.features.messaging.notes.line": "เสียงที่บันทึกไว้ เร็วกว่าพิมพ์บอกทาง",
  "home.features.messaging.files.name": "รูป วิดีโอ และไฟล์",
  "home.features.messaging.files.line": "รูปแบบใดก็ได้ ไม่เกิน 1 MiB โดยไม่ต้องมีสัญญาณ",
  "home.features.messaging.forward.name": "เก็บแล้วส่งต่อ",
  "home.features.messaging.forward.line":
    "ถูกผนึกไว้และให้โทรศัพท์ที่อยู่ใกล้พาไปจนกว่าจะถึงผู้รับ",

  "home.features.identity.title": "ตัวตน",
  "home.features.identity.summary": "ไม่มีอะไรให้ลงทะเบียน ไม่มีอะไรให้ยึด",
  "home.features.identity.keys.name": "ตัวตนแบบคู่กุญแจ",
  "home.features.identity.keys.line": "สร้างบนเครื่องนี้ เก็บไว้ในพวงกุญแจของระบบ",
  "home.features.identity.names.name": "ชื่อที่อ่านออก",
  "home.features.identity.names.line": "ได้มาจากกุญแจของคุณ จึงไม่มีใครแย่งชื่อคุณไปได้",
  "home.features.identity.qr.name": "ผู้ติดต่อผ่าน QR",
  "home.features.identity.qr.line": "สแกนครั้งเดียวได้กุญแจของเขาไป ไม่ใช่แค่ชื่อ",
  "home.features.identity.panic.name": "การล้างฉุกเฉิน",
  "home.features.identity.panic.line": "ทุกกุญแจและทุกข้อความถูกทำลายภายในไม่ถึงหนึ่งวินาที",

  "home.features.networking.title": "เครือข่าย",
  "home.features.networking.summary": "ตัวโทรศัพท์นั่นแหละคือเครือข่าย",
  "home.features.networking.mesh.name": "เมช Bluetooth",
  "home.features.networking.mesh.line":
    "ไม่ต้องมีอินเทอร์เน็ต ไม่ต้องมีเราเตอร์ บนโทรศัพท์ที่ผู้คนมีอยู่แล้ว",
  "home.features.networking.bridge.name": "สะพานเมช",
  "home.features.networking.bridge.line": "เชื่อมแชทสาธารณะของคุณกับกลุ่มคนใกล้ ๆ ที่อยู่นอกระยะ",
  "home.features.networking.wifi.name": "ทางลัด WiFi",
  "home.features.networking.wifi.line":
    "โอนถ่ายเร็วขึ้นระหว่าง Android สองเครื่อง หรือ iPhone สองเครื่อง",
  "home.features.networking.bitchat.name": "ใช้ร่วมกับ bitchat ได้",
  "home.features.networking.bitchat.line": "ทั้งสองแอปเข้าร่วมเมชเดียวกันได้โดยไม่ต้องตั้งค่า",

  "home.features.internet.title": "อินเทอร์เน็ต",
  "home.features.internet.summary": "เป็นส่วนเสริม ไม่เคยเป็นเงื่อนไข",
  "home.features.internet.nostr.name": "ทางสำรองผ่าน Nostr",
  "home.features.internet.nostr.line":
    "ข้อความส่วนตัวและช่องตามตำแหน่งยังไหลต่อได้แม้พ้นระยะคลื่นวิทยุ",
  "home.features.internet.relays.name": "การค้นหารีเลย์ตามภูมิภาค",
  "home.features.internet.relays.line": "รีเลย์สาธารณะอิสระกว่า 300 แห่ง ไม่มีแห่งใดเป็นของเรา",
  "home.features.internet.gateway.name": "เกตเวย์อินเทอร์เน็ต",
  "home.features.internet.gateway.line":
    "ให้ยืมการเชื่อมต่อของคุณ เพื่อให้เครื่องออฟไลน์ที่อยู่ใกล้เข้าถึงช่องตามตำแหน่งได้",
  "home.features.internet.tor.name": "การเชื่อมกับ Tor",
  "home.features.internet.tor.line": "จัดเส้นทางบนทั้งสองแพลตฟอร์ม รีเลย์จึงไม่เคยเห็น IP ของคุณ",

  "home.features.optional.title": "ตัวเลือกเสริม",
  "home.features.optional.summary": "ปิดไว้เป็นค่าเริ่มต้น เปิดเมื่อคุณต้องการ",
  "home.features.optional.cashu.name": "ecash ของ Cashu",
  "home.features.optional.cashu.line": "จ่ายเงินให้คนข้าง ๆ โดยที่ไม่มีเครื่องไหนออนไลน์",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "เติมหรือถอนเป็น bitcoin ผ่านเครือข่าย Lightning",
  "home.features.optional.ai.name": "AI ในเครื่อง",
  "home.features.optional.ai.line": "ตอบบนเครื่อง ไม่มีอะไรออกจากโทรศัพท์",
  "home.features.optional.social.name": "สะพานโซเชียล",
  "home.features.optional.social.line": "Bluesky และ Mastodon ด้วยตัวตนเดียวกัน",

  "home.compare.eyebrow": "เทียบกับที่อื่น",
  "home.compare.title": "ออฟไลน์ ไม่ต้องมีอุปกรณ์เสริม และเปิดเผย",
  "home.compare.sub":
    "ทุกแอปที่นี่เก่งอย่างใดอย่างหนึ่ง แต่มีเพียงบางแอปที่ยังทำงานได้เมื่อเครือข่ายใช้ไม่ได้",
  "home.compare.col.project": "โครงการ",
  "home.compare.col.transport": "ช่องทางรับส่ง",
  "home.compare.col.encryption": "การเข้ารหัส",
  "home.compare.col.offline": "ทำงานออฟไลน์",
  "home.compare.col.hardware_free": "ไม่ต้องมีอุปกรณ์เสริม",
  "home.compare.col.open_source": "โอเพนซอร์ส",
  "home.compare.mark.yes": "ใช่",
  "home.compare.mark.no": "ไม่",
  "home.compare.mark.partial": "บางส่วน ฝั่งไคลเอนต์เป็นโอเพนซอร์ส ฝั่งเซิร์ฟเวอร์ไม่ใช่",
  "home.compare.mark.partial_hint": "ฝั่งไคลเอนต์เป็นโอเพนซอร์ส ฝั่งเซิร์ฟเวอร์ไม่ใช่",
  "home.compare.transport.servers": "เซิร์ฟเวอร์รวมศูนย์",
  "home.compare.transport.onion": "การจัดเส้นทางแบบหัวหอม (โหนดบริการ)",
  "home.compare.transport.nostr": "รีเลย์ Nostr",
  "home.compare.transport.lora": "วิทยุ LoRa",
  "home.compare.transport.sub_ghz": "วิทยุ sub-GHz เฉพาะเจ้าของ",

  "home.explore.eyebrow": "เปิดเผยและตรงไปตรงมา",
  "home.explore.title": "ทุกข้อความที่กล่าวไว้ที่นี่ตรวจสอบได้",
  "home.explore.sub":
    "โค้ด โปรโตคอล และแผนงานเปิดเผยทั้งหมด ข้อจำกัดก็เช่นกัน ตรวจสอบด้วยตัวเองก่อนจะเชื่อคำของเรา",
  "home.explore.audit.chip": "รอการตรวจสอบ",
  "home.explore.audit.headline": "Airhop ยังไม่เคยผ่านการตรวจสอบความปลอดภัยจากภายนอก",
  "home.explore.audit.body":
    "{headline} โค้ดทั้งหมดได้รับการตรวจทานด้วยตนเองและผ่าน {review} ก่อนเผยแพร่ อีกทั้งไลบรารีเข้ารหัสที่ใช้ผ่านการตรวจสอบจาก Cure53 แล้ว แต่สิ่งเหล่านั้นไม่ได้แทนการตรวจสอบอย่างเป็นทางการของตัวแอปเอง มีแผนตรวจสอบใน {version} จนกว่าจะถึงตอนนั้น อย่าพึ่งพาแอปนี้ในกรณีที่อ่อนไหว",
  "home.explore.audit.link.review": "ตัวช่วยตรวจทานความปลอดภัย",
  "home.explore.source.title": "ซอร์สโค้ด",
  "home.explore.source.desc":
    "ทั้งหมดอยู่บน GitHub ภายใต้สัญญาอนุญาต MIT อิชชู พูลรีเควสต์ และการอภิปรายเปิดอยู่",
  "home.explore.protocol.title": "ข้อกำหนดโปรโตคอล",
  "home.explore.protocol.desc":
    "รูปแบบการรับส่งที่แน่นอน UUID ของ BLE และค่าคงที่ ใช้ร่วมกับ bitchat",
  "home.explore.architecture.title": "สถาปัตยกรรม",
  "home.explore.architecture.desc": "การแยกแยะทางเทคนิคทั้งหมด ตั้งแต่กดส่งจนถึงไบต์บนคลื่นวิทยุ",
  "home.explore.roadmap.title": "แผนงาน",
  "home.explore.roadmap.desc": "เป้าหมายรุ่นตั้งแต่ v0.5.0 ถึง v2.0.0 รวมถึงการตรวจสอบที่วางแผนไว้",
  "home.explore.vision.title": "วิสัยทัศน์",
  "home.explore.vision.desc": "เหตุผลที่ Airhop มีอยู่ และหลักการที่ไม่เปลี่ยนแม้ถูกกดดัน",
  "home.explore.brand.title": "ชุดแบรนด์",
  "home.explore.brand.desc": "นกพิกเซล โทเคนสีและตัวอักษร สื่อสำหรับสื่อมวลชน และข้อความสำเร็จรูป",

  "home.contribute.eyebrow": "สนับสนุนโครงการนี้",
  "home.contribute.title": "อิสระ และเปิดเผย",
  "home.contribute.sub":
    "ไม่มีนักลงทุน ไม่มีโฆษณา และไม่มีรุ่นเสียเงิน ทุกฟีเจอร์ยังคงฟรีอยู่ดี และงานนี้ได้ทุนจากผู้ที่เห็นว่ามันมีประโยชน์",
  "home.contribute.contribute.chip": "ร่วมพัฒนา",
  "home.contribute.contribute.body":
    "กดดาวให้ที่เก็บโค้ด เปิดอิชชู และส่งพูลรีเควสต์ รายงานข้อบกพร่อง ข้อเสนอฟีเจอร์ และการร่วมเขียนโค้ด ยินดีต้อนรับทั้งหมด",
  "home.contribute.contribute.cta": "ดูบน GitHub",
  "home.contribute.sponsor.chip": "สนับสนุน",
  "home.contribute.sponsor.body":
    "ถ้า Airhop มีประโยชน์กับคุณ การบริจาคครั้งเดียวหรือการสนับสนุนต่อเนื่องช่วยให้การพัฒนาดำเนินต่อไปได้มาก",
  "home.contribute.sponsor.donate": "บริจาคครั้งเดียว",
  "home.contribute.sponsor.github": "สนับสนุนบน GitHub",

  "page.architecture.eyebrow": "เอกสาร",
  "page.architecture.title": "สถาปัตยกรรม",
  "page.architecture.toc": "ในหน้านี้",

  "page.faq.eyebrow": "คำถามที่พบบ่อย",
  "page.faq.title": "คำถามที่พบบ่อย",
  "page.faq.meta": "คำถามทั่วไปเกี่ยวกับ Airhop",
  "page.faq.contact":
    "คำถามที่ไม่ได้ตอบไว้ที่นี่ ส่งไปที่ {email} ได้ หรือเปิดการอภิปรายบน {github}",

  "page.blogs.eyebrow": "บล็อก",
  "page.blogs.title": "เร็ว ๆ นี้",
  "page.blogs.body":
    "บทความเกี่ยวกับเครือข่ายเมช ความเป็นส่วนตัว และซอฟต์แวร์ที่ทำงานออฟไลน์เป็นหลัก",

  "page.brand.eyebrow": "แบรนด์",
  "page.brand.title": "ชุดแบรนด์",
  "page.brand.meta":
    "สื่อและกฎเกณฑ์สำหรับใช้ Airhop ในบทความ หน้าร้านค้า การบรรยาย หรือไฟล์ README ใช้ได้อย่างอิสระเพื่ออ้างอิงและสำหรับสื่อมวลชน",

  "page.legal.eyebrow": "ข้อกฎหมาย",
  "page.privacy.title": "นโยบายความเป็นส่วนตัว",
  "page.terms.title": "ข้อกำหนดในการให้บริการ",

  "page.notfound.title": "ไม่พบหน้านี้",
  "page.notfound.body": "หน้าที่คุณกำลังหาไม่มีอยู่ หรือถูกย้ายไปแล้ว",

  "page.english_only": "หน้านี้มีให้บริการเป็นภาษาอังกฤษเท่านั้น",

  "seo.breadcrumb.home": "หน้าแรก",

  "seo.home.title": "Airhop — แอปส่งข้อความส่วนตัวที่ทำงานออฟไลน์เป็นหลัก",
  "seo.home.description":
    "การส่งข้อความส่วนตัวระหว่างเครื่องโดยตรงสำหรับ iOS และ Android ไม่ต้องมีอินเทอร์เน็ต ไม่ต้องมีเซิร์ฟเวอร์ ไม่ต้องมีบัญชี สื่อสารผ่านเมช Bluetooth ได้ทุกที่",

  "seo.architecture.title": "สถาปัตยกรรม — Airhop",
  "seo.architecture.description":
    "Airhop ทำงานอย่างไรตั้งแต่บนลงล่าง: ตัวตน การเลือกช่องทางรับส่ง เมช Bluetooth การเข้ารหัส ชั้นอินเทอร์เน็ต Tor ecash แบบออฟไลน์ AI บนเครื่อง และรูปแบบการรับส่งที่ใช้ร่วมกับ bitchat ได้",
  "seo.architecture.breadcrumb": "สถาปัตยกรรม",
  "seo.architecture.headline": "สถาปัตยกรรมของ Airhop",
  "seo.architecture.summary":
    "การแยกแยะทางเทคนิคทั้งหมดของ Airhop: ตัวตน ช่องทางรับส่ง เมช Bluetooth การเข้ารหัส ชั้นอินเทอร์เน็ต Nostr, Tor, กระเป๋าเงิน Cashu, ผู้ช่วย AI บนเครื่อง และรูปแบบการรับส่ง",

  "seo.faq.title": "คำถามที่พบบ่อย — Airhop",
  "seo.faq.description":
    "คำตอบเกี่ยวกับการส่งข้อความผ่านเมช Bluetooth ของ Airhop การเข้ารหัส การชำระเงินออฟไลน์ ชั้นอินเทอร์เน็ต Nostr และความเข้ากันได้กับ bitchat",
  "seo.faq.breadcrumb": "คำถามที่พบบ่อย",

  "seo.blogs.title": "บล็อก — Airhop",
  "seo.blogs.description":
    "บทความเกี่ยวกับเครือข่ายเมช ความเป็นส่วนตัว และซอฟต์แวร์ที่ทำงานออฟไลน์เป็นหลัก",
  "seo.blogs.breadcrumb": "บล็อก",

  "seo.brand.title": "ชุดแบรนด์ — Airhop",
  "seo.brand.description":
    "ชุดแบรนด์ของ Airhop: สัญลักษณ์นกพิกเซล เวิร์ดมาร์ก โทเคนสีและตัวอักษร สื่อสำหรับสื่อมวลชน และข้อความสำเร็จรูป",
  "seo.brand.breadcrumb": "ชุดแบรนด์",

  "seo.privacy.title": "นโยบายความเป็นส่วนตัว — Airhop",
  "seo.privacy.description":
    "Airhop จัดการข้อมูลอย่างไร: ไม่มีบัญชี ไม่มีเซิร์ฟเวอร์ ไม่มีการติดตาม ตัวตนและข้อความของคุณอยู่บนเครื่องของคุณ",
  "seo.privacy.breadcrumb": "นโยบายความเป็นส่วนตัว",

  "seo.terms.title": "ข้อกำหนดในการให้บริการ — Airhop",
  "seo.terms.description": "ข้อกำหนดที่ควบคุมการใช้แอปและเว็บไซต์ Airhop",
  "seo.terms.breadcrumb": "ข้อกำหนดในการให้บริการ",

  "seo.notfound.title": "ไม่พบหน้านี้ — Airhop",
  "seo.notfound.description": "หน้าที่คุณกำลังหาไม่มีอยู่ หรือถูกย้ายไปแล้ว",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "รีเลย์ {count} แห่ง",
  },
  "home.map.locations": {
    other: "{count} แห่ง",
  },
};

export const locale: Locale = { strings, plurals };
