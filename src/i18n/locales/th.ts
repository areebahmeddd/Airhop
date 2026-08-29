// th: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "ยกเลิก",
  "common.done": "เสร็จสิ้น",
  "common.ok": "ตกลง",
  "common.close": "ปิด",
  "common.back": "กลับ",
  "common.delete": "ลบ",
  "common.remove": "นำออก",
  "common.add": "เพิ่ม",
  "common.copy": "คัดลอก",
  "common.copied": "คัดลอกแล้ว",
  "common.share": "แชร์",
  "common.continue": "ดำเนินการต่อ",
  "common.try_again": "ลองอีกครั้ง",
  "common.settings": "การตั้งค่า",
  "common.off": "ปิด",

  // ---- Dates ----
  "format.today": "วันนี้",
  "format.yesterday": "เมื่อวาน",
  "format.minutes_ago": "{count} นาทีที่แล้ว",
  "format.hours_ago": "{count} ชม. ที่แล้ว",
  "format.days_ago": "{count} วันที่แล้ว",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "แชท",
  "nav.tab.mesh": "เมช",
  "nav.tab.wallet": "กระเป๋าเงิน",
  "nav.tab.profile": "คุณ",
  "a11y.tab.new_peers": "{label}, มีคนใหม่อยู่ใกล้",
  "nav.notifications": "การแจ้งเตือน",
  "chat.subtab.channels": "ช่อง",
  "chat.subtab.direct": "โดยตรง",
  "chat.subtab.dms": "ข้อความโดยตรง",
  "chat.search.placeholder": "ค้นหาแชท…",
  "chat.search.a11y": "ค้นหาแชทและข้อความ",
  "chat.search.close": "ปิดการค้นหา",
  "chat.search.clear": "ล้างการค้นหา",
  "mesh.view.radar": "มุมมองเรดาร์",
  "mesh.view.list": "มุมมองรายการ",
  "mesh.view.radar_short": "เรดาร์",
  "mesh.view.list_short": "รายการ",

  // ---- Legal document names ----
  "legal.last_updated": "อัปเดตล่าสุด: {date}",
  "legal.terms": "ข้อกำหนดในการให้บริการ",
  "legal.privacy": "นโยบายความเป็นส่วนตัว",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "การสื่อสารผ่านเมชแบบส่วนตัว",
  "onboarding.welcome.cta": "เริ่มต้นใช้งาน",
  "onboarding.welcome.cta_hint": "ยอมรับข้อกำหนดด้านล่างเพื่อดำเนินการต่อ",
  "onboarding.welcome.consent_a11y":
    "ยอมรับข้อกำหนดในการให้บริการและนโยบายความเป็นส่วนตัว",
  "onboarding.welcome.open_terms": "เปิดข้อกำหนดในการให้บริการ",
  "onboarding.welcome.open_privacy": "เปิดนโยบายความเป็นส่วนตัว",
  "onboarding.welcome.consent":
    "เมื่อแตะ {cta} แสดงว่าคุณยอมรับ {terms} และ {privacy} ของเรา",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "กำลังสร้างตัวตนของคุณ",
  "onboarding.identity.body":
    "กำลังสร้างคู่กุญแจ Ed25519 บนเครื่องนี้\nไม่มีสิ่งใดถูกส่งออกไปที่ใด",
  "onboarding.identity.failed_heading": "สร้างกุญแจของคุณไม่สำเร็จ",
  "onboarding.identity.failed_body":
    "เครื่องนี้ไม่ยอมให้ Airhop เก็บกุญแจไว้อย่างปลอดภัย ลองอีกครั้ง หรือรีสตาร์ทโทรศัพท์แล้วเปิด Airhop ใหม่",
  "onboarding.identity.steps_a11y": "ขั้นตอน: {steps}",
  "onboarding.identity.step.x25519": "กำลังสร้างคู่กุญแจถาวร X25519",
  "onboarding.identity.step.ed25519": "กำลังสร้างคู่กุญแจลงลายเซ็น Ed25519",
  "onboarding.identity.step.keychain": "กำลังเก็บกุญแจไว้ใน OS Keychain",
  "onboarding.identity.step.peer_id": "กำลังหาค่า ID ของเพียร์",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "ชื่อของคุณบนเมช",
  "onboarding.username.peer_id": "ID ของเพียร์",
  "onboarding.username.card_a11y":
    "ชื่อของคุณบนเมชคือ {username} ID ของเพียร์ {peerID} {props}",
  "onboarding.username.explanation":
    "ชื่อผู้ใช้นี้ได้มาจากกุญแจสาธารณะของคุณอย่างแน่นอนตายตัว ทุกเครื่องที่เห็น ID ของเพียร์ของคุณจะเห็นชื่อเดียวกัน",
  "onboarding.username.cta": "เข้าสู่ Airhop",
  "onboarding.username.prop.algorithm": "อัลกอริทึม",
  "onboarding.username.prop.storage": "ที่จัดเก็บ",
  "onboarding.username.prop.storage_value": "OS Keychain เท่านั้น",
  "onboarding.username.prop.account": "ต้องมีบัญชี",
  "onboarding.username.prop.account_value": "ไม่ต้อง",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "ยินดีต้อนรับสู่ Airhop",
  "onboarding.hello.p1":
    "สวัสดีครับ Airhop สร้างขึ้นบน bitchat ในฐานะโปรเจกต์เสริมโอเพนซอร์สที่เป็นอิสระ ไม่ได้มีความเกี่ยวข้องกับหรือได้รับการรับรองจากโปรเจกต์ bitchat หรือ permissionless tech เป็นเพียงสิ่งที่ผมสนุกกับการสร้างและแบ่งปันกับชุมชน",
  "onboarding.hello.p2":
    "นี่เป็นรุ่นแรกสำหรับ iOS และ Android แม้ผมจะทดสอบกับเพื่อน ๆ แล้ว คุณก็คงเจอข้อผิดพลาดอยู่บ้าง หากเจอ หรือหากคุณมีไอเดียสำหรับฟีเจอร์ใหม่ ผมยินดีรับฟัง เปิด issue ที่ {github} หรือส่งอีเมลถึงผมที่ {email}",
  "onboarding.hello.p3":
    "หาก Airhop มีประโยชน์กับคุณ ลองพิจารณากดดาวที่ {github} หรือเขียนรีวิวที่ {store} สิ่งนี้ช่วยให้ผู้คนได้รู้จักโปรเจกต์นี้มากขึ้น ขอบคุณที่ลองใช้งาน",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "ก่อนที่โทรศัพท์ของคุณจะถาม",
  "onboarding.primer.lede": "นี่คือสิ่งที่แต่ละอย่างทำ และสิ่งที่มันไม่ทำ",
  "onboarding.primer.bluetooth.title": "บลูทูธ",
  "onboarding.primer.bluetooth.body":
    "ค้นหาอุปกรณ์ที่อยู่ใกล้เคียงและส่งต่อข้อความระหว่างกัน สิ่งนี้สร้างเมชขึ้นมาและทำงานได้โดยไม่ต้องเชื่อมต่ออินเทอร์เน็ต",
  "onboarding.primer.location.title": "ตำแหน่ง",
  "onboarding.primer.location.body":
    "จัดคุณเข้าช่องพื้นที่ใกล้เคียง ตั้งแต่ระดับบล็อกไปจนถึงระดับภูมิภาค Airhop ไม่เคยติดตามคุณและไม่ส่งตำแหน่งที่แม่นยำของคุณออกจากเครื่อง",
  "onboarding.primer.notifications.title": "การแจ้งเตือน",
  "onboarding.primer.notifications.body":
    "รับการแจ้งเตือนข้อความใหม่แม้ในขณะที่ปิดแอปอยู่ การแจ้งเตือนถูกสร้างขึ้นภายในเครื่องของคุณ โดยไม่มีเซิร์ฟเวอร์เข้ามาเกี่ยวข้อง",
  "onboarding.primer.footnote":
    "คุณปฏิเสธได้ ข้อความยังคงเดินทางผ่านอินเทอร์เน็ต และคุณเปลี่ยนใจภายหลังได้ในการตั้งค่า",
  "onboarding.primer.cta_a11y": "ไปยังคำขออนุญาต",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "การเข้าถึงบลูทูธ",
  "permission.bluetooth.purpose": "ค้นหาอุปกรณ์ใกล้เคียงบนเมช",
  "permission.open_settings": "เปิดการตั้งค่า",
  "permission.not_now": "ไว้ก่อน",
  "permission.blocked_title": "{label} ปิดอยู่",
  "permission.blocked_body": "เปิดใช้ในการตั้งค่าเพื่อ {purpose}",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "มีบางอย่างผิดพลาด",
  "error.boundary.body":
    "Airhop พบปัญหาที่ไม่คาดคิดและต้องหยุดสิ่งที่กำลังแสดงอยู่",

  // ---- Chats: channel list ----
  "chat.channels.default": "ช่องเริ่มต้น",
  "chat.channels.yours": "ช่องของคุณ",
  "chat.channels.none": "ยังไม่มีช่อง",
  "chat.channels.none_hint": "แตะ {plus} ด้านบนเพื่อเข้าร่วมหรือสร้างช่อง",
  "chat.channels.none_desc":
    "ยังไม่มีช่อง ใช้ปุ่มเพิ่มในส่วนหัวเพื่อเข้าร่วมหรือสร้างช่อง",
  "chat.channels.show_fewer": "แสดงช่องเริ่มต้นน้อยลง",
  "chat.channels.show_less": "แสดงน้อยลง",
  "chat.channels.info": "ข้อมูลช่อง",
  "chat.channels.pin": "ปักหมุดช่อง",
  "chat.channels.unpin": "เลิกปักหมุดช่อง",
  "chat.channels.mute": "ปิดเสียงช่อง",
  "chat.channels.unmute": "เปิดเสียงช่อง",
  "chat.channels.leave": "ออกจากช่อง",
  "chat.channels.leave_confirm": "ออก",
  "chat.channels.clear_body":
    "ลบข้อความทั้งหมดใน {name} หรือไม่ การกระทำนี้ย้อนกลับไม่ได้",
  "chat.channels.leave_body":
    "ออกจาก {name} หรือไม่ คุณจะหยุดรับข้อความของช่องนี้ และประวัติของมันจะถูกลบออกจากเครื่องนี้",
  "chat.channels.more_options": "ตัวเลือกเพิ่มเติมสำหรับ {name}",
  "chat.channels.teleported_tag": "{level}  ·  เทเลพอร์ต",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "ล้างแชท",
  "chat.dm.remove_contact": "นำผู้ติดต่อออก",
  "chat.dm.block": "บล็อกเพียร์นี้",
  "chat.dm.block_confirm": "บล็อก",
  "chat.dm.delete": "ลบแชท",
  "chat.dm.delete_body":
    "การกระทำนี้จะนำบทสนทนาออกจากรายการของคุณและลบข้อความของมัน ผู้ติดต่อจะยังอยู่ และข้อความใหม่จากพวกเขาจะเริ่มแชทใหม่",
  "chat.dm.in_range": "อยู่ในระยะ",
  "chat.dm.row_hint": "แตะสองครั้งค้างไว้เพื่อดูตัวเลือกเพิ่มเติม",
  "chat.channels.row_hint": "แตะสองครั้งค้างไว้เพื่อดูตัวเลือกเพิ่มเติม",
  "chat.dm.you_prefix": "คุณ:",
  "chat.dm.none": "ไม่มีข้อความโดยตรง",
  "chat.dm.none_desc": "ไปที่แท็บเมชแล้วแตะเพียร์เพื่อเริ่ม DM ที่เข้ารหัส",
  "chat.dm.contact_info": "ข้อมูลผู้ติดต่อ",
  "chat.dm.pin": "ปักหมุดแชท",
  "chat.dm.unpin": "เลิกปักหมุดแชท",
  "chat.dm.mute": "ปิดเสียงแชท",
  "chat.dm.unmute": "เปิดเสียงแชท",
  "chat.dm.clear_body":
    "ลบข้อความทั้งหมดกับ {name} หรือไม่ การกระทำนี้ย้อนกลับไม่ได้",
  "chat.dm.remove_contact_body":
    "นำ {name} ออกหรือไม่ การกระทำนี้จะลบบทสนทนาและลืมผู้ติดต่อรายนี้ พวกเขายังติดต่อคุณได้หากส่งข้อความมาอีก",
  "chat.dm.block_body":
    "บล็อก {name} หรือไม่ คุณจะไม่เห็นพวกเขาบนแท็บเมชและจะไม่ได้รับข้อความจากพวกเขา แม้พวกเขาจะอยู่ใกล้ก็ตาม",
  "chat.dm.more_options": "ตัวเลือกเพิ่มเติมสำหรับ {name}",
  "chat.dm.remove_contact_short": "นำผู้ติดต่อออก",
  "chat.dm.block_short": "บล็อกผู้ติดต่อ",
  "chat.dm.delete_short": "ลบแชท",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "ล้างข้อความ",
  "chat.clear_confirm": "ล้าง",
  "chat.group_badge": "กลุ่ม",
  "chat.more": "เพิ่มเติม",
  "chat.no_messages": "ยังไม่มีข้อความ",
  "chat.you": "คุณ",
  "chat.a11y.channel": "ช่อง {name}",
  "chat.a11y.group": "กลุ่ม {name}",
  "chat.a11y.muted": "ปิดเสียงอยู่",
  "chat.a11y.pinned": "ปักหมุดอยู่",

  // ---- Chats: start something new ----
  "chat.new.title": "เริ่มสิ่งใหม่",
  "chat.new.channel": "สร้างช่องส่วนตัว",
  "chat.new.channel_label": "ช่องส่วนตัว",
  "chat.new.channel_desc":
    "ห้องที่ใครก็ตามที่มีลิงก์เข้าร่วมได้ สร้างขึ้นเอง หรือเข้าร่วมด้วยลิงก์ที่มีคนส่งมาให้",
  "chat.new.group": "สร้างกลุ่มส่วนตัว",
  "chat.new.group_label": "กลุ่มส่วนตัว",
  "chat.new.group_desc": "เลือกคนที่ต้องการ ได้ถึง 16 คน อยู่บนบลูทูธเท่านั้น",
  "chat.new.place": "ไปยังสถานที่ด้วยจีโอแฮช",
  "chat.new.place_label": "ไปยังสถานที่",
  "chat.new.place_desc": "เปิดช่องตำแหน่งที่ใดก็ได้ด้วยจีโอแฮชของมัน",
  "chat.new.reach": "การเข้าถึง",
  "chat.new.reach_internet": "เข้าถึงสมาชิกผ่านทั้งบลูทูธและอินเทอร์เน็ต",
  "chat.new.reach_mesh": "ทำงานในระยะบลูทูธ ไม่ผ่านอินเทอร์เน็ต",
  "chat.new.reach_internet_desc":
    "เข้าถึงสมาชิกผ่านอินเทอร์เน็ตด้วย รีเลย์เห็นได้ว่าช่องนี้มีการใช้งาน แต่ไม่เห็นข้อความหรือว่าใครอยู่ในนั้นเลย",
  "chat.new.reach_mesh_desc":
    "อยู่บนเมชในพื้นที่เท่านั้น เป็นส่วนตัวที่สุด ไม่มีสิ่งใดออกนอกระยะบลูทูธ",
  "chat.new.join_link": "เข้าร่วมช่องส่วนตัวด้วยลิงก์เชิญ",
  "chat.new.back_to_chooser": "กลับไปหน้าเลือก",
  "chat.new.create_channel": "สร้างช่อง",
  "chat.new.name_required": "ใส่ชื่อช่องก่อน",
  "chat.new.name_taken": "ชื่อนั้นถูกใช้ไปแล้ว",
  "chat.new.create": "สร้าง",
  "chat.new.e2ee":
    "เข้ารหัสจากต้นทางถึงปลายทาง มีเพียงสมาชิกเท่านั้นที่อ่านข้อความได้",
  "chat.new.invite_only":
    "เข้าร่วมด้วยคำเชิญเท่านั้น ใครก็ตามที่คุณแชร์ลิงก์ให้จะเข้าร่วมได้ ช่องนี้ยังซ่อนจากคนอื่นทั้งหมด แม้แต่เพียร์ที่อยู่ใกล้",
  "chat.new.name_exists": "มีช่องชื่อนี้อยู่แล้ว",
  "chat.new.reach_bluetooth_chip": "บลูทูธเท่านั้น",
  "chat.new.reach_internet_chip": "บลูทูธ + อินเทอร์เน็ต",
  "chat.new.have_link": "เข้าร่วมด้วยลิงก์เชิญ",

  // ---- Chats: join by link ----
  "chat.join.title": "เข้าร่วมด้วยลิงก์",
  "chat.join.not_airhop": "นั่นไม่ใช่ลิงก์ของ Airhop",
  "chat.join.reach_internet": "เข้าถึงสมาชิกผ่านทั้งบลูทูธและอินเทอร์เน็ต",
  "chat.join.reach_mesh": "อยู่ในระยะบลูทูธเท่านั้น",
  "chat.join.contact_card":
    "การ์ดผู้ติดต่อ เพิ่มพวกเขาเข้าผู้ติดต่อของคุณและเปิดแชท",
  "chat.join.unverified": "ยืนยันลิงก์นั้นไม่ได้",
  "chat.join.unverified_body":
    "การ์ดผู้ติดต่อไม่ตรงกับกุญแจของตัวเอง จึงไม่ถูกเพิ่ม ขอให้พวกเขาส่งอันใหม่มา",
  "chat.join.paste": "วางจากคลิปบอร์ด",
  "chat.join.join": "เข้าร่วม",
  "chat.join.public_channel": "ช่องสาธารณะ {name} ใครก็ตามที่อยู่ใกล้อ่านได้",
  "chat.join.private_channel": "ช่องส่วนตัว {name} {reach}",
  "chat.join.dm_with": "ข้อความโดยตรงกับ {name}",
  "chat.join.joined_as": "เข้าร่วมในชื่อ {name}",
  "chat.join.name_clash_body":
    "คุณอยู่ใน {name} อีกช่องหนึ่งอยู่แล้ว ชื่อช่องเป็นเพียงป้ายกำกับ คำเชิญนี้จึงเปิดช่องของตัวเองขึ้นมา และช่องที่คุณอยู่ไม่ถูกแตะต้อง เปลี่ยนชื่อช่องใดก็ได้จากข้อมูลช่องของมัน",
  "chat.join.paste_hint":
    "วางคำเชิญที่ขึ้นต้นด้วย airhop:// การแตะลิงก์ก็ใช้ได้ ส่วนนี้มีไว้สำหรับลิงก์ที่คุณแตะไม่ได้",
  "chat.join.key_note":
    "คำเชิญของช่องส่วนตัวพากุญแจมาด้วย การเข้าร่วมจึงเกิดขึ้นทันทีและไม่ต้องขออะไรจากใครเลย",
  "chat.join.offline_note":
    "ใช้งานได้แบบออฟไลน์ ลิงก์ถูกอ่านบนเครื่องนี้ และช่องจะเข้าถึงได้ตามที่ผู้สร้างตั้งไว้",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "เปิดเซลล์นั้นไม่ได้ ลองอีกครั้งในอีกสักครู่",
  "chat.jump.title": "ไปยังสถานที่",
  "chat.jump.saved": "สถานที่ที่บันทึกไว้",
  "chat.jump.anywhere":
    "เปิดช่องตำแหน่งสาธารณะที่ใดก็ได้ แม้แต่ที่ที่คุณไม่ได้อยู่",
  "chat.jump.geohash_note":
    "ใส่จีโอแฮชของมัน ทุกคนที่ตำแหน่งอยู่ในเซลล์นั้นจะใช้ช่องนี้ร่วมกัน",
  "chat.jump.teleport_note":
    "คุณจะปรากฏว่าเทเลพอร์ตมา ไม่ใช่อยู่ใกล้ ๆ มันเข้าถึงได้ผ่านอินเทอร์เน็ตเท่านั้น",
  "chat.jump.level_cell": "เซลล์ระดับ{level}",
  "chat.jump.already_here":
    "คุณอยู่ที่นี่อยู่แล้ว ปุ่มไปจะเปิดช่อง {name} ของคุณ",
  "chat.jump.open_direction": "เปิดเซลล์ทาง{direction}ของคุณ",
  "chat.jump.open_place": "เปิด {name}",
  "chat.jump.remove_place": "นำ {name} ออกจากสถานที่ที่บันทึกไว้",
  "chat.jump.go": "ไป",
  "chat.jump.how":
    "วิธีหาจีโอแฮช: เปิดช่องตำแหน่ง > แตะชื่อของมัน > คัดลอกจากตรงนั้น",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "ติดต่อสมาชิกไม่ครบทุกคน ลองอีกครั้งขณะที่พวกเขาอยู่ใกล้",
  "chat.group.you_were_added": "คุณถูกเพิ่มเข้า {name}",
  "chat.group.added_you": "เพิ่มคุณเข้า {name}",
  "chat.group.you_were_removed":
    "คุณถูกนำออกจาก {name} คุณอ่านหรือส่งข้อความที่นี่ไม่ได้อีกต่อไป",
  "chat.group.removed_you": "นำคุณออกจาก {name}",
  "chat.group.add_failed": "เพิ่มพวกเขาไม่สำเร็จ",
  "chat.group.add_failed_body":
    "ไม่มีอะไรเปลี่ยนแปลง อาจเป็นเพราะติดต่อพวกเขาไม่ได้ในตอนนี้ กลุ่มเต็มที่ 16 คน หรือคุณไม่ใช่ผู้สร้างกลุ่ม",
  "chat.group.remove_failed": "นำพวกเขาออกไม่สำเร็จ",
  "chat.group.remove_failed_body":
    "ไม่มีอะไรเปลี่ยนแปลง มีเพียงผู้สร้างกลุ่มเท่านั้นที่เปลี่ยนสมาชิกในกลุ่มได้",
  "chat.group.e2ee":
    "เข้ารหัสจากต้นทางถึงปลายทาง มีเพียงสมาชิกเท่านั้นที่อ่านข้อความได้",
  "chat.group.cap":
    "ได้ถึง 16 คน โดยคุณเป็นผู้เลือก ไม่มีลิงก์เชิญ จึงไม่มีใครเข้าร่วมได้จากการที่มีคนส่งต่อลิงก์ให้",
  "chat.group.bluetooth":
    "บลูทูธเท่านั้น สมาชิกที่อยู่นอกระยะจะได้รับข้อความเมื่อกลับเข้ามา",
  "chat.group.members_label": "สมาชิก",
  "chat.group.none_in_range":
    "ไม่มีใครอยู่ในระยะ สมาชิกต้องอยู่ใกล้ตอนที่คุณสร้างกลุ่ม",
  "chat.group.create_title": "สร้างกลุ่ม",
  "chat.group.name_placeholder": "ชื่อกลุ่ม",
  "chat.group.create": "สร้าง",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "เมชในพื้นที่ · บลูทูธเท่านั้น",
  "chat.scope.mesh_desc":
    "เข้าถึงอุปกรณ์ในระยะบลูทูธ (ราว 10 ถึง 100 เมตร) ไม่ต้องใช้อินเทอร์เน็ต เหมาะสำหรับการประสานงานในพื้นที่",
  "chat.scope.block": "บล็อกเมือง · ~100 ม.",
  "chat.scope.block_desc":
    "ครอบคลุมระดับบล็อกเมือง ข้อความถูกเชื่อมผ่านอินเทอร์เน็ต เพียร์ที่อยู่นอกระยะบลูทูธแต่อยู่ใกล้จึงร่วมวงได้",
  "chat.scope.neighborhood": "ย่าน · ~1 กม.",
  "chat.scope.neighborhood_desc":
    "ครอบคลุมระดับย่าน มีรีเลย์ช่วย เพียร์ทั่วพื้นที่จึงติดต่อได้แม้ไม่มีลิงก์บลูทูธโดยตรง",
  "chat.scope.city": "เมือง · ~10 กม.",
  "chat.scope.city_desc":
    "ช่องระดับทั้งเมือง ใช้รีเลย์อินเทอร์เน็ตตามพิกัดเพื่อเข้าถึงเพียร์ทั่วเขตมหานคร",
  "chat.scope.province": "จังหวัดหรือรัฐ · ~100 กม.",
  "chat.scope.province_desc":
    "ครอบคลุมระดับจังหวัดหรือรัฐ เชื่อมผ่านอินเทอร์เน็ตเพื่อการเข้าถึงระดับภูมิภาคเป็นระยะหลายร้อยกิโลเมตร",
  "chat.scope.country": "ประเทศหรือภูมิภาค · ~1000 กม.",
  "chat.scope.country_desc":
    "ครอบคลุมทั้งประเทศ ผู้ใช้ Airhop หรือ bitchat คนใดในภูมิภาคก็เข้าร่วมและอ่านข้อความได้",
  "chat.transport.bluetooth": "บลูทูธเท่านั้น",
  "chat.transport.both": "บลูทูธ + อินเทอร์เน็ต",
  "chat.transport.internet": "อินเทอร์เน็ตเท่านั้น",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "คำสั่ง /{cmd}: {hint}",
  "chat.cmd.hug_hint": "ส่งอ้อมกอดอบอุ่น",
  "chat.cmd.slap_hint": "ตบด้วยปลาเทราต์ตัวใหญ่",
  "chat.status.sending": "กำลังส่ง…",
  "chat.status.undo_send": "เลิกทำการส่ง",
  "chat.status.undo": "เลิกทำ",
  "chat.status.sent": "ส่งแล้ว",
  "chat.status.received": "ได้รับแล้ว",
  "chat.status.failed": "ไม่สำเร็จ",
  "chat.status.canceled": "ยกเลิกแล้ว",
  "chat.status.waiting": "กำลังรอ",
  "chat.status.sending_short": "กำลังส่ง",
  "chat.status.receiving": "กำลังรับ",
  "chat.thread.not_available": "ใช้ไม่ได้ที่นี่",
  "chat.thread.private_channel": "ช่องส่วนตัว",
  "chat.thread.location_channel": "ช่องตำแหน่ง",
  "chat.thread.public_channel": "ช่องสาธารณะ",
  "chat.thread.notices": "ประกาศสำหรับช่องนี้",
  "chat.thread.invite": "เชิญใครสักคนเข้าช่องนี้",
  "chat.thread.not_in_range": "ไม่อยู่ในระยะบลูทูธ กำลังส่งผ่านอินเทอร์เน็ต",
  "chat.thread.not_nearby":
    "ไม่ได้อยู่ใกล้ เราจะส่งให้เมื่อพวกเขากลับเข้าระยะหรือออนไลน์",
  "chat.thread.no_keys":
    "คุณต้องอยู่ในระยะบลูทูธ หรือสแกนรหัสของพวกเขา จึงจะส่งข้อความถึงพวกเขาได้",
  "chat.geo.card_received":
    "{name} แชร์ผู้ติดต่อของพวกเขา แชร์ของคุณกลับไปเพื่อคุยกันต่อได้หลังจากที่ฝ่ายใดฝ่ายหนึ่งย้ายที่",
  "chat.geo.exchange_complete":
    "แลกเปลี่ยนผู้ติดต่อแล้ว ตอนนี้คุณติดต่อกันได้จากทุกที่",
  "chat.geo.keep_person": "เก็บคนนี้ไว้",
  "chat.geo.keep_person_desc":
    "แชร์ผู้ติดต่อของคุณเพื่อให้คุยกันต่อได้หลังจากที่ฝ่ายใดฝ่ายหนึ่งย้ายที่ พวกเขาจะได้รู้จักตัวตนถาวรของคุณ",
  "chat.geo.card_sent": "แชร์แล้ว · กำลังรอของพวกเขา",
  "chat.thread.left_cell":
    "คุณออกจากพื้นที่นี้แล้ว พวกเขาจึงติดต่อคุณที่นี่ไม่ได้ แลกรหัสกันเพื่อคุยกันต่อได้จากทุกที่",
  "chat.thread.no_route":
    "ติดต่อพวกเขาไม่ได้ในตอนนี้ ข้อความจะถูกส่งเมื่อมีเส้นทางว่าง",
  "chat.thread.empty": "ยังไม่มีข้อความ",
  "chat.thread.empty_desc": "เริ่มบทสนทนาที่เข้ารหัส",
  "chat.thread.jump_latest": "ข้ามไปยังข้อความล่าสุด",
  "chat.thread.back_to_members": "กลับไปที่สมาชิก",
  "chat.thread.nostr_key": "กุญแจสาธารณะ Nostr",
  "chat.thread.in_range": "อยู่ในระยะ",
  "chat.voice.not_recorded": "ข้อความเสียงไม่ได้ถูกบันทึก",
  "chat.thread.message": "ข้อความ",
  "chat.thread.message_placeholder": "ข้อความ…",
  "chat.thread.length_full": "ข้อความเต็มแล้ว",
  "chat.thread.waiting_for": "กำลังรอ {name} กลับมา · {percent}%",
  "chat.thread.peer": "เพียร์",
  "chat.thread.cancel_transfer": "ยกเลิก {name}",
  "chat.thread.queued_more": "อีก {count} รายการรอส่ง",
  "chat.thread.across_bridge": "{count} คนอีกฝั่งของบริดจ์",
  "chat.thread.bridged": "เชื่อมผ่านบริดจ์",
  "chat.thread.invite_body":
    "มาร่วมกับฉันใน {channel} บน Airhop — แชทผ่านเมชแบบส่วนตัวที่เน้นการใช้งานออฟไลน์",
  "chat.thread.go_back_unread": "กลับ ยังไม่อ่าน {count}",
  "chat.thread.view_info": "ดูข้อมูลของ {name}",
  "chat.thread.notices_new": "ประกาศสำหรับช่องนี้ ใหม่ {count}",
  "chat.thread.say_something": "พูดอะไรสักอย่างใน {channel}",
  "chat.thread.jump_latest_new": "ข้ามไปยังข้อความล่าสุด ใหม่ {count}",
  "chat.thread.unconfirmed_since": "ไม่มีการยืนยันการส่งถึงตั้งแต่ {date}",
  "chat.thread.no_reach": "ไม่มีเพียร์อยู่ใกล้ · ยังไม่มีใครได้รับข้อความนี้",
  "chat.thread.channel_needs_internet":
    "อินเทอร์เน็ตปิดอยู่ · ช่องนี้เข้าถึงได้เฉพาะคนที่อยู่ในระยะบลูทูธ",
  "chat.thread.cell_needs_internet":
    "อินเทอร์เน็ตปิดอยู่ · เซลล์นี้เข้าถึงได้ผ่านอินเทอร์เน็ตเท่านั้น",
  "chat.thread.geo_dm_needs_internet":
    "อินเทอร์เน็ตปิดอยู่ · บทสนทนานี้ส่งผ่านอินเทอร์เน็ตเท่านั้น",
  "chat.thread.via_gateway":
    "อินเทอร์เน็ตปิดอยู่ · อุปกรณ์ใกล้เคียงกำลังขนข้อมูลนี้ขึ้นออนไลน์ให้คุณ",
  "chat.thread.group_queued":
    "ยังไม่มีใครจากกลุ่มนี้อยู่ใกล้ ข้อความจะไปถึงพวกเขาเมื่อพวกเขาอยู่ใกล้",
  "chat.thread.no_group_key":
    "คุณไม่ได้อยู่ในกลุ่มนี้แล้ว จึงส่งข้อความนี้ไม่ได้",
  "chat.thread.no_reach_offline":
    "อินเทอร์เน็ตปิดอยู่และไม่มีเพียร์อยู่ใกล้ · ยังไม่มีใครได้รับข้อความนี้",
  "chat.thread.mention": "กล่าวถึง {name}",
  "chat.thread.someone_talking": "{hold} {name} กำลังพูดอยู่",
  "chat.thread.attach_note":
    "ไฟล์ส่งได้ในระยะบลูทูธเท่านั้น ข้อความตัวอักษรและการชำระเงินไปถึงผู้ติดต่อทางอินเทอร์เน็ตได้ แต่ไฟล์แนบไปไม่ถึง",
  "chat.thread.message_peer": "ส่งข้อความถึง {name}",
  "chat.thread.send": "ส่งข้อความ",
  "chat.thread.group": "กลุ่ม",
  "chat.bridge.nearby_only":
    "เฉพาะบริเวณใกล้เคียง: ไม่ให้ข้อความนี้ผ่านบริดจ์เมช",
  "chat.bridge.nearby_label": "เฉพาะบริเวณใกล้เคียง · อยู่บนบลูทูธ",
  "chat.bridge.bridging_label":
    "กำลังเชื่อมไปยังพื้นที่ใกล้เคียง · แตะเพื่อจำกัดเฉพาะบริเวณใกล้เคียง",
  "chat.screenshot.you_took": "คุณถ่ายภาพหน้าจอ",
  "chat.screenshot.you_took_private": "คุณถ่ายภาพหน้าจอ · ไม่มีใครถูกแจ้ง",
  "chat.screenshot.heads_up": "โปรดทราบ",
  "chat.screenshot.notice": "* {name} ถ่ายภาพหน้าจอ *",
  "chat.screenshot.notified_dm":
    "{name} ได้รับแจ้งแล้วว่าคุณถ่ายภาพหน้าจอบทสนทนานี้",
  "chat.screenshot.notified": "ทุกคนในช่องนี้ได้รับแจ้งแล้วว่าคุณถ่ายภาพหน้าจอ",
  "chat.screenshot.not_notified":
    "ไม่มีใครถูกแจ้ง ช่องนี้เป็นสาธารณะ การประกาศว่ามีการถ่ายภาพหน้าจอจึงจะเป็นการบันทึกว่าคุณเคยอยู่ที่นี่",
  "chat.thread.error": "ข้อผิดพลาด",
  "chat.thread.go_back": "กลับ",
  "chat.bubble.via_bridge": "ผ่านบริดจ์เมช",
  "chat.bubble.view_profile": "ดูโปรไฟล์ของ {name}",
  "chat.bubble.forwarded": "ส่งต่อมา",
  "chat.bubble.attachment": "ไฟล์แนบ",
  "chat.bubble.a11y": "{sender}: {body} กดค้างเพื่อดูตัวเลือกเพิ่มเติม",
  "chat.bubble.failed_retry": "ส่งไม่สำเร็จ แตะเพื่อลองใหม่",

  // ---- Chats: message actions and info ----
  "chat.info.title": "ข้อมูลข้อความ",
  "chat.info.delivered_to": "ส่งถึง {name} แล้ว",
  "chat.info.read_by": "{name} อ่านแล้ว",
  "chat.info.group_reach_desc": "ติดต่อได้ในตอนนี้ ไม่ใช่การยืนยันการส่งถึง",
  "chat.info.group_alone": "ไม่มีสมาชิกคนอื่น",
  "chat.info.today_at": "วันนี้ {time}",
  "chat.info.sending": "กำลังส่ง…",
  "chat.info.failed": "ส่งไม่สำเร็จ",
  "chat.info.courier": "มีเพื่อนช่วยขนไป",
  "chat.info.sent": "ส่งแล้ว",
  "chat.info.queued": "รอส่ง",
  "chat.info.waiting": "กำลังรอ…",
  "chat.action.info": "ข้อมูลข้อความ",
  "chat.action.save_photos": "บันทึกลงรูปภาพ",
  "chat.action.save_copy": "บันทึกสำเนา",
  "chat.action.forward": "ส่งต่อ",
  "chat.action.select": "เลือก",
  "chat.select.cancel": "ยกเลิกการเลือก",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "กล้อง",
  "chat.attach.camera_desc": "ถ่ายรูปหรือวิดีโอ",
  "chat.attach.library": "คลังภาพ",
  "chat.attach.library_desc": "เลือกจากคลังภาพของคุณ",
  "chat.attach.document": "เอกสาร",
  "chat.attach.document_desc": "ส่งไฟล์ใดก็ได้หรือ PDF",
  "chat.attach.voice": "ข้อความเสียง",
  "chat.attach.voice_desc": "บันทึกและส่งข้อความเสียง",
  "chat.attach.ecash": "ส่ง ecash",
  "chat.attach.ecash_desc": "ส่ง Cashu sats จากกระเป๋าเงินของคุณ",
  "chat.attach.location": "ตำแหน่ง",
  "chat.attach.location_desc": "ส่งตำแหน่งที่คุณอยู่ตอนนี้",
  "chat.attach.title": "แนบ",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "แชร์ตำแหน่งแล้ว",
  "chat.location.received_summary": "แชร์ตำแหน่งของพวกเขา",
  "chat.location.title": "ตำแหน่ง",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "บันทึกเมื่อ {ago} ที่แล้ว",
  "chat.location.open_maps": "เปิดใน Maps",
  "chat.location.no_forward": "ตำแหน่งไม่ถูกส่งต่อ",
  "chat.location.no_forward_body":
    "ตำแหน่งถูกส่งให้คนเดียว หากคุณอยากให้คนอื่นมีตำแหน่งด้วย ให้แชร์ตำแหน่งของคุณเองแทน",
  "chat.location.no_fix": "อนุญาตตำแหน่งเพื่อดูว่าที่นี่อยู่ห่างแค่ไหน",
  "chat.location.send_title": "ส่งตำแหน่งของคุณ",
  "chat.location.send_body":
    "{name} จะเห็นจุดเดียว คือที่ที่คุณอยู่ตอนนี้ มันไม่ได้อัปเดตต่อเนื่อง",
  "chat.location.send": "ส่งตำแหน่ง",
  "chat.location.finding": "กำลังค้นหาตำแหน่งของคุณ…",
  "chat.location.no_location": "ไม่ได้รับตำแหน่งของคุณ",
  "chat.location.no_location_body":
    "อนุญาตการเข้าถึงตำแหน่งและตรวจสอบว่าเปิดบริการตำแหน่งอยู่ แล้วลองอีกครั้ง",
  "chat.location.not_delivered": "ส่งตำแหน่งของคุณไม่สำเร็จ",
  "chat.location.not_delivered_body":
    "ตำแหน่งมีค่าควรส่งก็ต่อเมื่อยังเป็นปัจจุบัน จึงไม่ถูกเก็บเข้าคิวไว้ส่งภายหลัง ลองอีกครั้งเมื่อติดต่อ {name} ได้",
  "chat.location.direction.n": "ทิศเหนือ",
  "chat.location.direction.ne": "ทิศตะวันออกเฉียงเหนือ",
  "chat.location.direction.e": "ทิศตะวันออก",
  "chat.location.direction.se": "ทิศตะวันออกเฉียงใต้",
  "chat.location.direction.s": "ทิศใต้",
  "chat.location.direction.sw": "ทิศตะวันตกเฉียงใต้",
  "chat.location.direction.w": "ทิศตะวันตก",
  "chat.location.direction.nw": "ทิศตะวันตกเฉียงเหนือ",
  "chat.attach.send_anyway": "ส่งต่อไป",
  "chat.attach.bitchat_too_big": "สิ่งนี้อาจไปไม่ถึง",
  "chat.attach.bitchat_too_big_body":
    "{name} ใช้ bitchat ซึ่งจะล้มเลิกกลางคันกับไฟล์ขนาดใหญ่ ต่ำกว่าราว 350 KiB จะเชื่อถือได้ การส่งให้ผู้ติดต่อที่ใช้ Airhop ไม่มีขีดจำกัดแบบนี้",
  "chat.attach.bitchat_unopenable": "พวกเขาอาจเปิดสิ่งนี้ไม่ได้",
  "chat.attach.bitchat_unopenable_body":
    "{name} ใช้ bitchat ซึ่งแสดงรูปภาพและข้อความเสียงได้ แต่จะแสดงอย่างอื่นเป็นไฟล์ที่เปิดไม่ได้ มันจะไปถึง เพียงแต่พวกเขาอาจดูไม่ได้",
  "chat.attach.file": "แนบไฟล์",
  "chat.attach.unavailable": "แนบไฟล์ไม่ได้ที่นี่",
  "chat.attach.not_sent": "ไฟล์แนบไม่ได้ถูกส่ง",
  "chat.attach.read_failed": "เกิดข้อผิดพลาดขณะอ่านไฟล์นั้น ลองไฟล์อื่น",
  "chat.attach.caption": "เพิ่มคำบรรยาย…",
  "chat.attach.send": "ส่งไฟล์แนบ",
  "chat.attach.generic": "ไฟล์แนบ",
  "chat.media.view_full": "ดูรูปแบบเต็มหน้าจอ",
  "chat.media.gone_photo": "รูปภาพไม่ได้อยู่บนเครื่องนี้",
  "chat.media.gone_video": "วิดีโอไม่ได้อยู่บนเครื่องนี้",
  "chat.media.gone_voice": "ข้อความเสียงไม่ได้อยู่บนเครื่องนี้",
  "chat.media.gone_file": "ไฟล์ไม่ได้อยู่บนเครื่องนี้",
  "chat.media.gone_note": "ถูกลบหลัง 7 วันหรือเมื่อล้างแคช",
  "chat.media.ask_resend": "ขออีกครั้ง",
  "chat.media.resend_draft": "ช่วยส่ง{kind}นั้นมาอีกครั้งได้ไหม",
  "chat.media.kind_photo": "รูปภาพ",
  "chat.media.kind_video": "วิดีโอ",
  "chat.media.kind_voice": "ข้อความเสียง",
  "chat.media.kind_file": "ไฟล์",
  "chat.media.pause_voice": "หยุดข้อความเสียงชั่วคราว",
  "chat.media.play_voice": "เล่นข้อความเสียง",
  "chat.media.voice_position": "ตำแหน่งในข้อความเสียง",
  "chat.media.voice_scrub": "แตะตามแท่งเพื่อข้ามไปยังจุดนั้น",
  "chat.media.image": "รูปภาพ",
  "chat.media.tap_load_photo": "แตะเพื่อโหลดรูปภาพ",
  "chat.media.open_document": "เปิด {name}",
  "chat.media.document": "เอกสาร",
  "chat.media.tap_load_video": "แตะเพื่อโหลดวิดีโอ",
  "chat.media.video": "วิดีโอ",
  "chat.media.photo": "รูปภาพ",
  "chat.media.close_photo": "ปิดรูปภาพ",
  "chat.media.save_photo": "บันทึกรูปลงรูปภาพของคุณ",
  "chat.media.share_photo": "แชร์รูปภาพ",
  "chat.media.saved_videos": "บันทึกลงวิดีโอของคุณแล้ว",
  "chat.media.saved_photos": "บันทึกลงรูปภาพของคุณแล้ว",
  "chat.media.not_saved": "ไม่ได้บันทึก",
  "chat.media.cant_open": "เปิดไฟล์ไม่ได้",
  "chat.media.no_app": "เครื่องนี้ไม่มีแอปสำหรับเปิดหรือแชร์ไฟล์นี้",
  "chat.media.open_failed": "เปิดไฟล์ไม่สำเร็จ มันอาจถูกล้างออกจากแคชไปแล้ว",
  "media.blocked.nostr_only":
    "คุณรู้จักคนนี้ผ่านรีเลย์เท่านั้น จึงส่งได้เฉพาะข้อความตัวอักษร รูปภาพ ไฟล์ และข้อความเสียงต้องใช้บลูทูธ",
  "media.blocked.private_channel":
    "ไฟล์แนบแบบบรอดแคสต์มีลายเซ็นแต่ไม่ได้เข้ารหัส การส่งเข้าช่องส่วนตัวจึงทำให้ไฟล์นั้นเปิดเผย ในขณะที่ข้อความตัวอักษรที่นี่ยังคงเข้ารหัสอยู่",
  "media.blocked.private_group":
    "ไฟล์แนบแบบบรอดแคสต์มีลายเซ็นแต่ไม่ได้เข้ารหัส การส่งเข้ากลุ่มส่วนตัวจึงทำให้ไฟล์นั้นเปิดเผย ในขณะที่ข้อความตัวอักษรที่นี่ยังคงเข้ารหัสอยู่",
  "media.blocked.location_channel":
    "ช่องตำแหน่งเข้าถึงผู้คนผ่านอินเทอร์เน็ต ส่วนรูปภาพ ไฟล์ และข้อความเสียงเดินทางผ่านบลูทูธ จึงไม่มีทางไปถึงได้เลย",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "ใช้ข้อความเสียงไม่ได้ที่นี่",
  "chat.voice.hold_live": "กดค้างเพื่อพูดสด",
  "chat.voice.hold_record": "กดค้างเพื่อบันทึกข้อความเสียง",
  "chat.voice.cancel_recording": "ยกเลิกการบันทึก",
  "chat.voice.slide_cancel": "เลื่อนเพื่อยกเลิก",
  "chat.voice.release_cancel": "ปล่อยเพื่อยกเลิก",
  "chat.voice.a11y_toggle": "แตะสองครั้งเพื่อเริ่มหรือหยุดพูด",
  "chat.voice.limit_reached": "ถึงขีดจำกัดสองนาทีแล้ว ปล่อยเพื่อส่ง",
  "chat.voice.limit_sent": "ถึงขีดจำกัดสองนาทีแล้ว ส่งข้อความเสียงไปแล้ว",
  "chat.voice.stop_send": "หยุดบันทึกแล้วส่ง",
  "chat.voice.lift_lock": "เลื่อนขึ้นเพื่อบันทึกแบบไม่ต้องกดค้าง",
  "chat.voice.live_speaking": "{name} กำลังพูด",
  "voice.unavailable": "ใช้เสียงสดไม่ได้",
  "voice.recording_stopped": "หยุดบันทึกแล้ว",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "การเข้าถึงกล้อง",
  "chat.perm.camera_purpose": "ถ่ายรูปเพื่อส่ง",
  "chat.perm.photo_label": "การเข้าถึงรูปภาพ",
  "chat.perm.photo_purpose": "เลือกรูปหรือวิดีโอเพื่อส่ง",
  "chat.perm.photo_save_purpose": "บันทึกสิ่งนี้ลงรูปภาพของคุณ",
  "chat.perm.mic_label": "การเข้าถึงไมโครโฟน",
  "chat.perm.mic_live_purpose": "คุยกับคนที่อยู่ใกล้",
  "chat.perm.mic_note_purpose": "บันทึกข้อความเสียง",
  "chat.perm.recording_stopped": "หยุดบันทึกแล้ว",
  "chat.perm.record_failed": "เริ่มบันทึกไม่สำเร็จ ตรวจสอบสิทธิ์ไมโครโฟน",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "เคลมแล้ว",
  "chat.ecash.reclaimed": "เรียกคืนแล้ว",
  "chat.ecash.claiming": "กำลังเคลม…",
  "chat.ecash.claim": "เคลม",
  "chat.ecash.claim_amount": "เคลม {amount} {unit}",
  "chat.ecash.already_claimed": "เคลมไปแล้ว",
  "chat.ecash.already_claimed_body":
    "พรูฟทุกรายการในโทเคนนี้อยู่ในกระเป๋าเงินของคุณแล้ว จึงไม่มีอะไรถูกเพิ่ม",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "ส่งมอบให้เมชเพื่อพยายามนำส่งอย่างดีที่สุด",
  "chat.info.queued_desc":
    "เก็บไว้บนโทรศัพท์เครื่องนี้จนกว่าจะมีเส้นทางไปถึงพวกเขา",
  "chat.info.reclaimed": "เรียกคืนแล้ว",
  "chat.info.reclaimed_desc":
    "คุณนำการชำระเงินนี้กลับเข้ากระเป๋าเงินของคุณแล้ว มันจึงจะไม่ถูกส่งไป",
  "chat.info.about": "เกี่ยวกับ",
  "chat.info.group_desc":
    "กลุ่มส่วนตัว มีเพียงสมาชิกที่ผู้สร้างเพิ่มไว้เท่านั้นที่อ่านได้ และมันอยู่บนบลูทูธ",
  "chat.info.teleported_desc":
    "ช่องตำแหน่งสาธารณะสำหรับเซลล์จีโอแฮชนี้ ใครก็ตามที่อยู่ในเซลล์ ไม่ว่าจะใช้ Airhop หรือ bitchat ใช้ช่องนี้ร่วมกันผ่านอินเทอร์เน็ต คุณเทเลพอร์ตมา ไม่ได้อยู่ที่นี่จริง",
  "chat.info.custom_desc":
    "ช่องที่ตั้งเอง ใครก็ตามที่รู้ชื่อเข้าร่วมได้จากอุปกรณ์ Airhop หรือ bitchat เครื่องใดก็ได้",
  "chat.info.private_e2ee": "ส่วนตัว · เข้ารหัสจากต้นทางถึงปลายทาง",
  "chat.info.public_plain": "สาธารณะ · ไม่ได้เข้ารหัส",
  "chat.info.group_privacy":
    "มีเพียงสมาชิกที่แสดงด้านล่างเท่านั้นที่อ่านกลุ่มนี้ได้ ข้อความอยู่บนบลูทูธ สมาชิกที่อยู่นอกระยะจึงได้รับเมื่อกลับเข้ามา",
  "chat.info.teleport_privacy":
    "สถานที่ที่คุณเทเลพอร์ตไป มันเข้าถึงทุกคนในเซลล์นี้ผ่านอินเทอร์เน็ต และไม่ถึงใครในระยะบลูทูธเลย",
  "chat.info.location_off_privacy":
    "ตำแหน่งปิดอยู่ ช่องนี้จึงเข้าถึงอุปกรณ์ใกล้เคียงผ่านบลูทูธเท่านั้น เปิดตำแหน่งเพื่อเข้าถึงเซลล์พื้นที่ของมันผ่านอินเทอร์เน็ต",
  "chat.info.invite_privacy":
    "มีเพียงคนที่คุณเชิญผ่านลิงก์เท่านั้นที่อ่านได้ ช่องนี้ยังซ่อนจากคนอื่นทั้งหมด แม้แต่เพียร์ที่อยู่ใกล้",
  "chat.info.public_privacy":
    "ใครก็ตามที่เข้าร่วมอ่านได้ทุกข้อความ ใช้ข้อความโดยตรงสำหรับบทสนทนาส่วนตัว DM เข้ารหัสจากต้นทางถึงปลายทาง",
  "chat.info.remove_member": "นำสมาชิกออก",
  "chat.info.remove_member_body":
    "นำ {name} ออกจากกลุ่มหรือไม่ กุญแจกลุ่มจะถูกหมุนเปลี่ยน พวกเขาจึงอ่านข้อความใหม่ไม่ได้อีก",
  "chat.info.message_member": "ส่งข้อความถึง {name}",
  "chat.info.remove_member_a11y": "นำ {name} ออก",
  "chat.info.no_addable": "ไม่มีเพียร์ที่ติดต่อได้ให้เพิ่ม สมาชิกต้องอยู่ใกล้",
  "chat.info.add_count": "เพิ่ม {count}",
  "chat.info.teleported_tag": "{level}  ·  เทเลพอร์ต",
  "chat.info.active": "ใช้งานอยู่",
  "chat.info.members": "สมาชิก",
  "chat.info.bookmark": "บุ๊กมาร์กสถานที่นี้",
  "chat.info.remove_bookmark": "นำบุ๊กมาร์กออก",
  "chat.info.default_notice":
    "ช่องเริ่มต้นออกไม่ได้ เพราะเป็นส่วนหนึ่งของโปรโตคอลเมชของ Airhop",
  "chat.info.custom_channel": "ช่องที่ตั้งเอง",
  "chat.info.geohash": "จีโอแฮช",
  "chat.info.copy_geohash": "คัดลอกจีโอแฮช",
  "chat.info.relays": "รีเลย์",
  "chat.info.show_relays": "แสดงรีเลย์ที่ขนช่องนี้อยู่",
  "chat.info.relay_custom": "ตั้งเอง",
  "chat.info.relays_none": "ไม่มี เซลล์นี้ใช้บลูทูธเท่านั้นในตอนนี้",
  "chat.info.search_members": "ค้นหาสมาชิก",
  "chat.info.search_members_placeholder": "ค้นหาสมาชิก…",
  "chat.info.teleported": "เทเลพอร์ต",
  "chat.info.creator": "ผู้สร้าง",
  "chat.info.no_matches": "ไม่พบรายการที่ตรงกัน",
  "chat.info.no_one_here": "ยังไม่มีใครที่นี่",
  "chat.info.add_members": "เพิ่มสมาชิก",
  "chat.info.add_selected": "เพิ่มสมาชิกที่เลือก",
  "chat.info.add": "เพิ่ม",
  "chat.info.leave_group": "ออกจากกลุ่ม",
  "chat.info.leave_channel": "ออกจากช่อง",
  "chat.info.leave": "ออก",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "คุยกันตั้งแต่ {date}",
  "chat.contact.verified_since": "ยืนยันตั้งแต่ {date}",
  "chat.contact.anonymous": "ไม่ระบุตัวตน",
  "chat.contact.anonymous_desc": "นามแฝงตามจีโอแฮชที่ไม่มีตัวตนถาวรให้ยืนยัน",
  "chat.contact.verified": "ยืนยันแล้ว",
  "chat.contact.verified_desc": "สแกนคิวอาร์โค้ดของพวกเขาแล้ว",
  "chat.contact.verified_desc_compared": "เทียบรหัสกับพวกเขาแล้ว",
  "chat.contact.not_verified": "ยังไม่ยืนยัน",
  "chat.contact.not_verified_desc":
    "สแกนรหัสของพวกเขา หรือเทียบรหัสกันระหว่างโทรคุย เพื่อยืนยันว่านี่คือพวกเขาจริง",
  "chat.contact.e2ee": "เข้ารหัสจากต้นทางถึงปลายทาง",
  "chat.contact.e2ee_nostr": "ห่อของขวัญตาม NIP-17 รีเลย์จึงอ่านไม่ได้",
  "chat.contact.e2ee_mesh":
    "Noise XX พร้อม Double Ratchet ระหว่างอุปกรณ์ Airhop",
  "chat.contact.copy_nostr": "คัดลอกกุญแจสาธารณะ Nostr",
  "chat.contact.nostr_key": "กุญแจสาธารณะ Nostr",
  "chat.contact.cell_key_note":
    "กุญแจนี้เป็นของพื้นที่ที่คุณพบกัน มันจะเปลี่ยนหากฝ่ายใดฝ่ายหนึ่งย้ายที่ และบทสนทนาก็จะจบลงพร้อมกัน แลกผู้ติดต่อกันเพื่อคุยกันต่อได้จากทุกที่",
  "chat.contact.peer_name": "ชื่อเพียร์",
  "chat.contact.peer_id": "ID ของเพียร์",
  "chat.contact.rename": "เปลี่ยนชื่อ",
  "chat.contact.rename_needs_contact":
    "คุณเปลี่ยนชื่อได้เฉพาะคนที่คุณถือกุญแจของเขาอยู่ แลกการ์ดผู้ติดต่อกันก่อน แล้วสิ่งนี้จะกลายเป็นชื่อที่คุณเห็นคนเดียว",
  "chat.contact.rename_needs_keys":
    "ยังไม่มีกุญแจของผู้ติดต่อรายนี้ ส่งข้อความถึงพวกเขา หรือสแกนรหัสของพวกเขา แล้วคุณจะตั้งชื่อที่คุณเห็นคนเดียวให้พวกเขาได้",
  "chat.contact.renamed_by_you": "ชื่อที่คุณตั้งให้พวกเขา",
  "chat.contact.copy_peer_id": "คัดลอก ID ของเพียร์",
  "chat.contact.verify": "ยืนยันผู้ติดต่อ",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "ประกาศ",
  "chat.notices.post_area": "โพสต์ประกาศไปยังพื้นที่นี้",
  "chat.notices.post_mesh": "โพสต์ประกาศไปยังเมช",
  "chat.notices.mark_urgent": "ทำเครื่องหมายว่าด่วน",
  "chat.notices.post": "โพสต์ประกาศ",
  "chat.notices.post_short": "โพสต์",
  "chat.notices.delete": "ลบประกาศ",
  "chat.notices.just_now": "เมื่อครู่นี้",
  "chat.notices.fades_soon": "จะจางหายเร็ว ๆ นี้",
  "chat.notices.1_day": "1 วัน",
  "chat.notices.3_days": "3 วัน",
  "chat.notices.7_days": "7 วัน",
  "chat.notices.fading": "กำลังจางหาย",
  "chat.notices.fades_in_hours": "จางหายในอีก {count} ชม.",
  "chat.notices.fades_in_days": "จางหายในอีก {count} วัน",
  "chat.notices.scope_geo": "จีโอ",
  "chat.notices.scope_mesh": "เมช",
  "chat.notices.urgent_short": "ด่วน",
  "chat.notices.permanent_warning":
    "ไม่จางหายเลย เป็นสาธารณะและผูกกับพื้นที่นี้ และคุณเรียกคืนไม่ได้",
  "chat.notices.none":
    "ยังไม่มีประกาศ โพสต์สักอันเพื่อให้มันอยู่ที่นี่สำหรับคนอื่น",

  // ---- Chats: search results ----
  "chat.search.photos": "รูปภาพ",
  "chat.search.videos": "วิดีโอ",
  "chat.search.audio": "เสียง",
  "chat.search.documents": "เอกสาร",
  "chat.search.links": "ลิงก์",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "กรองตาม {filter}",
  "chat.search.no_matches": "ไม่มี{filter}ที่ตรงกับ “{query}”",
  "chat.search.no_media": "ยังไม่มี{filter}",
  "chat.search.result_a11y": "{chat}, {kind} จาก {sender}",
  "chat.search.you": "คุณ",
  "chat.search.section_chats": "แชท",
  "chat.search.section_messages": "ข้อความ",
  "chat.search.section_notices": "ประกาศ",
  "chat.search.hint": "ค้นหาข้อความและแชท หรือเลือกตัวกรองด้านบน",
  "chat.search.no_results": "ไม่พบผลลัพธ์สำหรับ “{query}”",
  "chat.search.open_chat": "เปิด {name}",
  "chat.search.message_a11y": "{chat}, ข้อความจาก {sender}: {snippet}",
  "chat.search.notice_a11y": "ประกาศใน {chat} จาก {author}: {snippet}",
  "chat.search.urgent": "ด่วน ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "มี {count} รายการในรายการนี้ การล้างจะนำออกจากที่นี่เท่านั้น และข้อความจะยังไม่ถูกอ่านอยู่ในบทสนทนาของมัน การทำเครื่องหมายว่าอ่านทั้งหมดจะล้างทั้งสองอย่าง",
  "chat.notif.mark_all_read": "ทำเครื่องหมายว่าอ่านทั้งหมด",
  "chat.notif.clear_list": "ล้างรายการ",
  "chat.notif.clear_all_a11y": "ล้างการแจ้งเตือนทั้งหมด {count} รายการ",
  "chat.notif.title": "การแจ้งเตือน",
  "chat.notif.clear_short": "ล้าง",
  "chat.notif.close": "ปิดการแจ้งเตือน",
  "chat.notif.none": "ยังไม่มีการแจ้งเตือน",
  "chat.notif.none_desc":
    "ข้อความ การกล่าวถึง และประกาศจากช่องและแชทของคุณจะปรากฏที่นี่",
  "chat.notif.new": "ใหม่",
  "chat.notif.notice_in": "ประกาศใน {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "ส่งต่อไปยัง…",
  "chat.forward.to": "ส่งต่อไปยัง {name}",
  "chat.forward.cant_send_here": "ส่งต่อที่นี่ไม่ได้",
  "chat.forward.cant_send_to": "ส่งต่อไปยัง {name} ไม่ได้",
  "chat.forward.channels": "ช่อง",
  "chat.forward.groups": "กลุ่ม",
  "chat.forward.locations": "ตำแหน่ง",
  "chat.forward.dms": "ข้อความโดยตรง",
  "chat.forward.none": "ยังไม่มีแชทอื่น",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "กำลังเริ่มเมช…",
  "mesh.banner.no_bluetooth": "เครื่องนี้ไม่มีบลูทูธ · อินเทอร์เน็ตเท่านั้น",
  "mesh.banner.bluetooth_off": "บลูทูธปิดอยู่ · ใช้เมชไม่ได้",
  "mesh.banner.permission_needed": "ต้องได้รับอนุญาตให้ใช้บลูทูธ",
  "mesh.banner.blocked": "บลูทูธถูกบล็อก · อนุญาตในการตั้งค่า",
  "mesh.banner.location_permission": "ต้องใช้ตำแหน่งเพื่อค้นหาเพียร์",
  "mesh.banner.advertising_unsupported":
    "โทรศัพท์นี้เห็นเครื่องอื่นได้แต่ไม่ถูกค้นพบ",
  "mesh.banner.location_off_android":
    "ตำแหน่งปิดอยู่ · Android ต้องใช้เพื่อค้นหาเพียร์",
  "mesh.banner.paused": "เมชหยุดชั่วคราว · คุณไม่อยู่",
  "mesh.banner.location_off": "ตำแหน่งปิดอยู่ · ใช้ช่องตำแหน่งไม่ได้",
  "mesh.banner.battery_saver": "โหมดประหยัดแบตเตอรี่ · สแกนถี่น้อยลง",
  "mesh.banner.wipe_incomplete":
    "ล้างข้อมูลไม่ครบ · อาจมีข้อมูลบางส่วนหลงเหลือ เปิดใหม่แล้วจะลองอีกครั้ง",
  "mesh.banner.wifi_off": "Wi-Fi ปิดอยู่ · ไฟล์ขนาดใหญ่จะส่งช้าลง",
  "mesh.banner.clock_skew":
    "นาฬิกาของโทรศัพท์เครื่องนี้ผิด · ตั้งวันที่และเวลาเป็นอัตโนมัติ",
  "mesh.banner.internet_off": "อินเทอร์เน็ตปิดอยู่ · บลูทูธเท่านั้น",
  "mesh.banner.relaying": "ไม่มีเพียร์ในพื้นที่ · กำลังส่งต่อผ่าน Nostr",
  "mesh.banner.tor":
    "Tor เปิดอยู่ · การรับส่งข้อมูลอินเทอร์เน็ตถูกกำหนดเส้นทางแล้ว",
  "mesh.banner.tor_starting": "กำลังเริ่ม Tor · กำลังเชื่อมต่อ",
  "mesh.banner.tor_blocked": "Tor เชื่อมต่อไม่ได้ · เมชยังทำงานอยู่",
  "mesh.banner.gateway":
    "เกตเวย์อินเทอร์เน็ตเปิดอยู่ · กำลังส่งต่อให้เพียร์ใกล้เคียง",
  "mesh.banner.bridge": "บริดจ์เมชเปิดอยู่ · เชื่อมแชทสาธารณะแล้ว",
  "mesh.banner.background_limits":
    "{brand} อาจหยุดเมชชั่วคราวเมื่ออยู่เบื้องหลัง",
  "mesh.banner.bridge_across":
    "บริดจ์เมชเปิดอยู่ · {count} คนอยู่อีกฝั่งของบริดจ์",
  "mesh.banner.action.turn_on": "เปิด",
  "mesh.banner.action.allow": "อนุญาต",
  "mesh.banner.action.resume": "ทำต่อ",
  "mesh.banner.action.fix": "แก้ไข",
  "mesh.banner.hint.resume": "เปิดการประกาศตัวและการสแกนบลูทูธอีกครั้ง",
  "mesh.banner.hint.enable_bluetooth": "ขอให้ Android เปิดบลูทูธ",
  "mesh.banner.hint.location_settings": "เปิดการตั้งค่าตำแหน่งของระบบ",
  "mesh.banner.hint.app_settings": "เปิดสิทธิ์ของ Airhop ในการตั้งค่าระบบ",
  "mesh.banner.hint.battery_settings":
    "เปิดการตั้งค่ากิจกรรมเบื้องหลังของโทรศัพท์เครื่องนี้",
  "mesh.banner.dismiss": "ปิด: {label}",
  "mesh.banner.hint.dismiss": "ซ่อนข้อความนี้อย่างถาวร",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "กำลังค้นหาเพียร์ใกล้เคียง…",
  "mesh.radar.starting": "กำลังเริ่มเมช…",
  "mesh.radar.no_bluetooth": "เครื่องนี้ไม่มีบลูทูธ",
  "mesh.radar.bluetooth_off": "บลูทูธปิดอยู่ · ไม่ได้สแกน",
  "mesh.radar.permission_needed": "ต้องได้รับอนุญาตให้ใช้บลูทูธ",
  "mesh.radar.blocked": "บลูทูธถูกบล็อก",
  "mesh.radar.location_permission": "ต้องได้รับอนุญาตให้ใช้ตำแหน่ง",
  "mesh.radar.location_off": "ตำแหน่งปิดอยู่ · ไม่ได้สแกน",
  "mesh.radar.hint_rings": "วงแหวนแสดงความแรงสัญญาณ BLE ไม่ใช่ระยะทาง",
  "mesh.radar.hint_checking": "กำลังตรวจสอบบลูทูธและสิทธิ์",
  "mesh.radar.hint_internet": "ข้อความยังคงเดินทางผ่านอินเทอร์เน็ต",
  "mesh.radar.hint_turn_on": "เปิดบลูทูธเพื่อค้นหาเพียร์",
  "mesh.radar.hint_allow": "อนุญาตบลูทูธเพื่อค้นหาเพียร์",
  "mesh.radar.hint_allow_settings": "อนุญาตบลูทูธในการตั้งค่าเพื่อค้นหาเพียร์",
  "mesh.radar.hint_location_permission":
    "Android 11 และเก่ากว่าต้องใช้ตำแหน่งเพื่อสแกนผ่านบลูทูธ",
  "mesh.radar.hint_android_location":
    "Android ต้องเปิดตำแหน่งจึงจะคืนผลการสแกนบลูทูธ",
  "mesh.radar.signal_strong": "แรง",
  "mesh.radar.signal_medium": "ปานกลาง",
  "mesh.radar.signal_weak": "อ่อน",
  "mesh.radar.you_center": "คุณ อยู่ตรงกลางของเมช",
  "mesh.radar.sonar_hint": "เล่นเสียงกวาดโซนาร์ การสแกนทำงานต่อเนื่องอยู่แล้ว",
  "mesh.radar.paused": "เมชหยุดชั่วคราว · คุณไม่อยู่",
  "mesh.radar.ring_hint": "ตำแหน่งของวงแหวนสะท้อนความแรงสัญญาณ ไม่ใช่ระยะทาง",
  "mesh.radar.set_online":
    "ตั้งสถานะของคุณเป็นออนไลน์ในโปรไฟล์เพื่อค้นหาเพียร์",
  "mesh.radar.in_range": "อยู่ในระยะ",
  "mesh.radar.recently_seen": "เพิ่งเห็นล่าสุด",
  "mesh.radar.peer_hint": "เปิดตัวเลือกเพื่อส่งข้อความหรือจ่ายเงินให้เพียร์นี้",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "เมื่อครู่นี้",
  "mesh.peer.none": "ไม่มีเพียร์อยู่ใกล้",
  "mesh.peer.none_desc":
    "อุปกรณ์ Airhop หรือ bitchat เครื่องอื่นที่อยู่ในระยะบลูทูธจะปรากฏที่นี่",
  "mesh.peer.id_copied": "คัดลอก ID ของเพียร์แล้ว",
  "mesh.peer.copy_id": "คัดลอก ID ของเพียร์",
  "mesh.peer.their_name": "ใช้ชื่อว่า {name}",
  "mesh.peer.in_range": "อยู่ในระยะ",
  "mesh.peer.relay": "โหนดรีเลย์",
  "mesh.peer.relay_body":
    "วิทยุที่มีคนเปิดทิ้งไว้เพื่อขยายเมช มันขนส่งข้อความที่ตัวมันเองอ่านไม่ได้ ที่นี่จึงไม่มีใครให้ส่งข้อความถึง",
  "mesh.peer.send_dm": "ส่งข้อความโดยตรง",
  "mesh.peer.message": "ข้อความ",
  "mesh.peer.send_sats": "ส่ง ecash",
  "mesh.peer.amount_placeholder": "จำนวนเป็น sats",
  "mesh.peer.amount_first": "ส่ง ecash โปรดใส่จำนวนก่อน",
  "mesh.peer.cancel_send": "ยกเลิกการส่ง ecash",
  "mesh.peer.view_peer": "ดูเพียร์ {name}",
  "mesh.peer.view_peer_online": "ดูเพียร์ {name}, ออนไลน์",
  "mesh.peer.last_seen": "เห็นล่าสุด {ago} ที่แล้ว",
  "mesh.peer.send_amount": "ส่ง {amount} sats",
  "mesh.peer.direct": "การเชื่อมต่อโดยตรง",
  "mesh.peer.check_distance": "ตรวจระยะ",
  "mesh.peer.checking": "กำลังตรวจ",
  "mesh.peer.no_reply": "ไม่มีการตอบกลับ",
  "mesh.peer.no_reply_hint":
    "พวกเขาอาจย้ายไปแล้ว หรือแอปของพวกเขาอาจไม่ตอบกลับ",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "ภูมิภาค",
  "mesh.level.province": "จังหวัด",
  "mesh.level.city": "เมือง",
  "mesh.level.neighborhood": "ย่าน",
  "mesh.level.block": "บล็อกเมือง",
  "mesh.level.building": "อาคาร",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "ใช้จ่ายได้",
  "wallet.balance.unit_hint": "สลับระหว่างซาโตชิกับบิตคอยน์",
  "wallet.balance.a11y": "ยอดคงเหลือ {value} {unit}",
  "wallet.balance.locked":
    "ที่จัดเก็บของกระเป๋าเงินถูกล็อกอยู่ พรูฟ ecash ถูกเก็บไว้ในไฟล์ที่เข้ารหัสซึ่งกุญแจอยู่ใน keychain ของเครื่อง และเปิดไฟล์นั้นไม่ได้ ปลดล็อกเครื่องของคุณแล้วเปิด Airhop ใหม่",
  "wallet.balance.tor_blocked":
    "Tor เปิดอยู่ คำขอไปยังมินต์จึงถูกบล็อก เพราะจะออกไปทางเครือข่ายเปิดและเชื่อม IP ของคุณเข้ากับพรูฟของคุณ การส่งและรับผ่านเมชยังทำงานอยู่ อนุญาตการรับส่งข้อมูลกับมินต์ได้ในการตั้งค่า ความปลอดภัย",
  "wallet.balance.unconfirmed_note": "{amount} ยังไม่ได้ยืนยันกับมินต์",
  "wallet.balance.reserved_note":
    "{amount} ถูกกันไว้สำหรับการส่งที่กำลังดำเนินอยู่",
  "wallet.balance.other_mint_note": "{amount} อยู่ในบัญชีมินต์อีกแห่ง",
  "wallet.balance.test_mint_note":
    "รวมเงินทดลองจากมินต์สำหรับทดสอบ ไม่ใช่บิตคอยน์และถอนออกไม่ได้",
  "wallet.token": "โทเคน",
  "wallet.action.send": "ส่งโทเคน ecash",
  "wallet.action.send_disabled":
    "ส่งโทเคน ecash ใช้ไม่ได้เมื่อยอดคงเหลือเป็นศูนย์",
  "wallet.action.receive": "รับโทเคน ecash",
  "wallet.action.zap": "Zap ผู้ติดต่อบน Nostr",
  "wallet.action.zap_disabled":
    "Zap ผู้ติดต่อบน Nostr ใช้ไม่ได้เมื่อยอดคงเหลือเป็นศูนย์",
  "wallet.action.add_mint": "เพิ่มมินต์ Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "สร้างโทเคนไม่สำเร็จ",
  "wallet.send.title": "ส่ง ecash",
  "wallet.send.amount_in": "จำนวนเป็น {unit}",
  "wallet.send.body":
    "สร้างแบบออฟไลน์จากพรูฟที่คุณถืออยู่แล้ว จะไม่มีสิ่งใดออกจากยอดคงเหลือของคุณอย่างถาวรจนกว่าคุณจะยืนยันว่าโทเคนไปถึงแล้ว",
  "wallet.send.stale_fee_note":
    "ตรวจสอบค่าธรรมเนียมครั้งล่าสุดเมื่อ {days} วันที่แล้ว หากมินต์นี้ขึ้นค่าธรรมเนียมหลังจากนั้น การส่งอาจมีค่าใช้จ่ายสูงขึ้นเล็กน้อย",
  "wallet.send.fee_note":
    "{spend} {unit} จะออกจากยอดคงเหลือของคุณ ส่วน {fee} ที่เพิ่มมาครอบคลุมค่าธรรมเนียมมินต์ที่พวกเขาต้องจ่ายเอง",
  "wallet.send.qr_too_big":
    "โทเคนนี้ถูกแบ่งเป็นเหรียญมากเกินกว่าจะใส่ในคิวอาร์โค้ดได้ ใช้การแชร์หรือคัดลอกแทน หรือรีเฟรชที่มินต์เพื่อรวมเข้าด้วยกัน",
  "wallet.send.bearer_note":
    "ใครก็ตามที่ถือสตริงนี้คือเจ้าของเงิน พรูฟถูกกันไว้ ไม่ใช่ถูกใช้ไป หากมันไม่ไปถึงใครเลย คุณเรียกคืนได้ในหัวข้อรอดำเนินการ",
  "wallet.send.qr_too_big_short":
    "โทเคนนี้ถูกแบ่งเป็นเหรียญมากเกินกว่าจะใส่ในคิวอาร์โค้ดได้ ใช้การแชร์หรือคัดลอกแทน",
  "wallet.send.scan_note":
    "ให้พวกเขาสแกนสิ่งนี้จากกระเป๋าเงินของตัวเอง ยังเรียกคืนได้จนกว่าคุณจะทำเครื่องหมายว่าส่งถึงแล้ว",
  "wallet.send.mesh_note":
    "โทเคนจะออกไปเป็น DM ที่เข้ารหัสผ่านเมช ไม่ต้องใช้อินเทอร์เน็ต",
  "wallet.send.no_peers_note":
    "เปิดแท็บเมชเพื่อค้นหาอุปกรณ์ใกล้เคียง หรือแชร์โทเคนด้วยวิธีอื่น",
  "wallet.send.send_to": "ส่งถึง {name}",
  "wallet.send.memo": "บันทึกย่อ (ไม่บังคับ ไปพร้อมกับโทเคน)",
  "wallet.send.building": "กำลังสร้าง…",
  "wallet.send.build": "สร้างโทเคน",
  "wallet.send.inexact_body":
    "พรูฟของคุณสร้างยอด {amount} {unit} แบบพอดีเป๊ะขณะออฟไลน์ไม่ได้ โทเคนที่เล็กที่สุดที่สร้างได้คือ {spend} {unit} และเมื่อออฟไลน์จะไม่มีเงินทอน ส่วนเกิน {extra} {unit} จะตกเป็นของผู้รับ\n\nการรีเฟรชที่มินต์ขณะออนไลน์จะแบ่งพรูฟของคุณออกเป็นหน่วยย่อยที่ทำให้ได้ยอดพอดีเป๊ะ",
  "wallet.send.send_amount": "ส่ง {amount}",
  "wallet.send.sent_to": "ส่ง {amount} {unit} ถึง {name} แล้ว",
  "wallet.send.sent_to_body":
    "{route} มันยังเรียกคืนได้ในหัวข้อรอดำเนินการจนกว่าคุณจะยืนยันว่าพวกเขาได้รับ หรือจนกว่ามินต์จะแจ้งว่าพรูฟถูกแลกไปแล้ว",
  "wallet.send.copy_token": "คัดลอกโทเคน",
  "wallet.send.share_token": "แชร์โทเคน",
  "wallet.send.open_in_wallet": "เปิดโทเคนนี้ในกระเป๋าเงินอื่น",
  "wallet.send.open_in_wallet_short": "เปิดในกระเป๋าเงิน",
  "wallet.send.to_peer": "ส่งโทเคนให้เพียร์ที่อยู่ใกล้",
  "wallet.send.to_peer_short": "ส่งให้เพียร์",
  "wallet.send.mark_delivered": "ทำเครื่องหมายว่าส่งถึงแล้วและจบ",
  "wallet.send.they_got_it": "พวกเขาได้รับแล้ว",
  "wallet.send.keep_pending": "คงการส่งนี้ไว้เป็นรอดำเนินการ",
  "wallet.send.decide_later": "ตัดสินใจภายหลัง",
  "wallet.send.no_peers": "ไม่มีเพียร์อยู่ในระยะ",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "นี่คือการชำระเงินของคุณเอง",
  "wallet.receive.own_payment_body":
    "เหรียญเหล่านี้ยังถูกกันไว้สำหรับการส่งที่คุณยังไม่ได้ปิด จึงไม่มีอะไรให้เคลม ใช้เรียกคืนกับการชำระเงินนั้นเพื่อนำกลับเข้ายอดคงเหลือของคุณโดยตรง",
  "wallet.receive.already_have": "อยู่ในกระเป๋าเงินของคุณแล้ว",
  "wallet.receive.already_have_body":
    "พรูฟทุกรายการในโทเคนนี้ถูกเก็บไว้ที่นี่แล้ว จึงไม่มีอะไรถูกเพิ่ม ยอดคงเหลือไม่เปลี่ยนแปลง",
  "wallet.receive.stored_unconfirmed":
    "เก็บไว้จาก {mint} แล้ว แต่ยังไม่ได้ยืนยันกับมินต์ ({reason})",
  "wallet.receive.offline": "ออฟไลน์",
  "wallet.receive.redeemed_here":
    "แลกที่ {mint} แล้ว พรูฟเหล่านี้เป็นของคุณแต่ผู้เดียว สำเนาของผู้ส่งใช้ไม่ได้อีกต่อไป",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "แลกที่ {mint} แล้ว ตอนนี้มันเป็นของคุณอย่างพิสูจน์ได้ สำเนาโทเคนนี้ของผู้ส่งใช้ไม่ได้อีกต่อไป",
  "wallet.receive.stored_pending":
    "เก็บไว้จาก {mint} แล้ว แต่มินต์ยังไม่ได้ยืนยันว่ามันยังไม่ถูกใช้{dleq} รีเฟรชจากแท็บกระเป๋าเงินเมื่อคุณออนไลน์",
  "wallet.receive.dleq_inline":
    " (ลายเซ็นของมันตรวจสอบผ่าน โทเคนจึงเป็นของแท้)",
  "wallet.receive.dleq_ok": "ลายเซ็นของมินต์ตรวจสอบผ่าน โทเคนจึงเป็นของแท้",
  "wallet.receive.dleq_uncached":
    "กุญแจของมินต์ไม่ได้แคชไว้ที่นี่ จึงตรวจสอบลายเซ็นแบบออฟไลน์ไม่ได้",
  "wallet.receive.dleq_warning":
    "จนกว่าคุณจะรีเฟรชขณะออนไลน์ ผู้ส่งอาจใช้มันไปที่อื่นแล้วก็เป็นได้",
  "wallet.receive.failed": "รับไม่สำเร็จ",
  "wallet.receive.title": "รับ ecash",
  "wallet.receive.body":
    "วางโทเคน Cashu เมื่อออนไลน์มันจะถูกแลกที่มินต์ทันที เมื่อออฟไลน์มันจะถูกเก็บไว้และยืนยันในครั้งถัดไปที่คุณรีเฟรช",
  "wallet.receive.scan": "สแกนคิวอาร์โค้ด ecash",
  "wallet.receive.scan_short": "สแกน QR",
  "wallet.receive.receiving": "กำลังรับ…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "ได้รับ Nutzap จาก {from}… และแลกเข้ากระเป๋าเงินของคุณแล้ว",
  "wallet.zap.title": "Zap ตัวตนบน Nostr",
  "wallet.zap.not_npub": "ไม่ใช่ npub",
  "wallet.zap.bad_key": "กุญแจไม่ถูกต้อง",
  "wallet.zap.invalid_pubkey": "pubkey ไม่ถูกต้อง",
  "wallet.zap.invalid_pubkey_body":
    "ใส่ npub1… หรือ pubkey ของ Nostr แบบเลขฐานสิบหก 64 อักขระ",
  "wallet.zap.sent": "ส่ง Nutzap แล้ว",
  "wallet.zap.failed": "Zap ไม่สำเร็จ",
  "wallet.zap.body":
    "หากพวกเขาเผยแพร่ข้อมูล nutzap ตาม NIP-61 ecash จะถูกล็อกไว้กับกุญแจของพวกเขาเพื่อไม่ให้ใครอื่นใช้ได้ และเรียกคืนไม่ได้ หากไม่ได้เผยแพร่ มันจะไปเป็นโทเคนที่เรียกคืนได้แทน ระบบจะแจ้งให้คุณทราบว่าเกิดกรณีใด",
  "wallet.zap.contact": "Zap {name}",
  "wallet.zap.pubkey_placeholder": "npub1… หรือเลขฐานสิบหก 64 อักขระ",
  "wallet.zap.sending": "กำลังส่ง…",
  "wallet.nostr.copied_body":
    "มอบสิ่งนี้ให้ใครสักคน แล้วพวกเขาจะ zap คุณได้จาก Airhop หรือกระเป๋าเงิน Nostr อื่นใด โดยไม่ต้องใช้บลูทูธ",
  "wallet.nostr.copy_key": "คัดลอกกุญแจ Nostr ของคุณเพื่อให้ผู้คน zap คุณได้",
  "wallet.nostr.your_key": "กุญแจ Nostr ของคุณ",

  // ---- Wallet: mints ----
  "wallet.mint.added": "เพิ่มมินต์แล้ว",
  "wallet.mint.add_failed": "เพิ่มมินต์ไม่สำเร็จ",
  "wallet.mint.added_named": "เพิ่ม {name} แล้ว",
  "wallet.mint.added_body":
    "{mint} ออก {units} กุญแจของมันถูกแคชไว้บนเครื่องนี้ โทเคนจากมินต์นี้จึงตรวจสอบได้แม้ไม่มีอินเทอร์เน็ต",
  "wallet.mint.remove_plain":
    "นำ {mint} ออกจากกระเป๋าเงินของคุณหรือไม่ กุญแจที่แคชไว้จะหายไปด้วย โทเคนจากมินต์นี้จึงตรวจสอบแบบออฟไลน์ไม่ได้อีก",
  "wallet.mint.title": "มินต์",
  "wallet.mint.none": "ยังไม่มีมินต์",
  "wallet.mint.none_desc":
    "มินต์เป็นผู้ออกและแลก ecash ของคุณ เพิ่มสักแห่งเพื่อฝากผ่าน Lightning หรือเพียงรับโทเคนมาแล้วมินต์ของมันจะถูกเพิ่มให้คุณเอง",
  "wallet.mint.add": "เพิ่มมินต์",
  "wallet.mint.add_body":
    "มินต์ถือ Bitcoin ที่หนุนหลัง ecash ของคุณ จึงควรเลือกแห่งที่คุณไว้ใจกับยอดเงินที่คุณเก็บไว้ที่นั่น URL จะถูกตรวจสอบก่อนบันทึก หากไม่อยากไว้ใจใครเลย ให้รันมินต์ของคุณเองด้วย Nutshell",
  "wallet.mint.consolidate_body":
    "โทเคนหนึ่งใบระบุมินต์ได้เพียงแห่งเดียวเสมอ ยอดเงินที่กระจายอยู่หลายแห่งจึงจ่ายยอดที่ใหญ่กว่าที่แห่งใหญ่สุดถืออยู่ไม่ได้ Airhop ย้ายให้ได้ โดยมินต์แต่ละแห่งจะจ่ายใบแจ้งหนี้ Lightning ที่ออกโดยแห่งที่คุณเลือก มีค่าธรรมเนียมกำหนดเส้นทางเล็กน้อยและต้องใช้อินเทอร์เน็ต",
  "wallet.mint.add_short": "เพิ่มมินต์",
  "wallet.mint.checking": "กำลังตรวจสอบ…",
  "wallet.mint.remove_with_balance": "นำมินต์ที่มียอดคงเหลือออกหรือไม่",
  "wallet.mint.remove": "นำมินต์ออก",
  "wallet.mint.delete_anyway": "ลบต่อไป",
  "wallet.mint.consolidate": "ย้ายยอดทั้งหมดไปมินต์เดียว",
  "wallet.mint.confirm_with": "ยืนยันพรูฟกับ {mint}",
  "wallet.mint.remove_a11y": "นำ {mint} ออก",
  "wallet.mint.available_amount": "ใช้ได้ {amount} {unit}",
  "wallet.mint.split_across":
    "ยอดคงเหลือกระจายอยู่ใน {count} มินต์ ย้ายไปรวมที่เดียว",
  "wallet.mint.move_everything_to": "ย้ายทุกอย่างไปที่ {mint}",
  "wallet.mint.consolidate_title": "ย้ายไปมินต์เดียว",
  "wallet.mint.moving": "กำลังย้าย…",
  "wallet.mint.move": "ย้าย",
  "wallet.mint.moved": "ย้ายแล้ว",
  "wallet.mint.moved_body":
    "ตอนนี้ {amount} {unit} อยู่ที่ {mint} หลังหักค่าธรรมเนียมกำหนดเส้นทาง Lightning {fees} {unit}",
  "wallet.mint.nothing_moved": "ไม่มีอะไรถูกย้าย",
  "wallet.mint.destination": "· ปลายทาง",
  "wallet.mint.will_move": "· จะถูกย้าย",
  "wallet.mint.issued_by": "ออกโดย",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "เติมเงินกระเป๋า Airhop",
  "wallet.ln.invoice_failed": "สร้างใบแจ้งหนี้ไม่สำเร็จ",
  "wallet.ln.price_failed": "คำนวณราคาใบแจ้งหนี้นี้ไม่สำเร็จ",
  "wallet.ln.paid": "ชำระแล้ว",
  "wallet.ln.deposit_credited":
    "ชำระใบแจ้งหนี้แล้วและ {mint} ออก {amount} {unit} ให้ ยอดนี้ได้รับการยืนยันแล้ว คุณใช้จ่ายแบบออฟไลน์ได้ทันที",
  "wallet.ln.withdrawn":
    "จ่าย {paid} sats ผ่าน Lightning แล้ว มินต์เก็บค่าธรรมเนียมกำหนดเส้นทาง {fee} sats",
  "wallet.ln.withdrawn_with_change":
    "จ่าย {paid} sats ผ่าน Lightning แล้ว มินต์เก็บค่าธรรมเนียมกำหนดเส้นทาง {fee} sats และคืนเงินกันไว้ {change} sats กลับเข้ายอดคงเหลือของคุณ",
  "wallet.ln.payment_failed": "การชำระเงินไม่สำเร็จ",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "เปลี่ยน sats บน Lightning ให้เป็น ecash ที่ใช้จ่ายแบบออฟไลน์ได้ หรือถอน ecash ออกไปยังใบแจ้งหนี้ Lightning ใดก็ได้ ทั้งสองอย่างต้องใช้อินเทอร์เน็ตและมินต์",
  "wallet.ln.deposit_body":
    "มินต์จะออกใบแจ้งหนี้ให้คุณ ชำระจากกระเป๋าเงิน Lightning ใดก็ได้ แล้ว sats จะกลับมาเป็น ecash ที่คุณใช้จ่ายแบบออฟไลน์ได้",
  "wallet.ln.pay_invoice_for":
    "ชำระใบแจ้งหนี้นี้จำนวน {amount} {unit} กระเป๋าเงินกำลังเฝ้าดูการชำระเงินและจะออก ecash ให้คุณโดยอัตโนมัติ",
  "wallet.ln.expired_body":
    "ใบแจ้งหนี้นี้หมดอายุแล้ว หากคุณชำระไปแล้ว ยอดจะถูกเพิ่มให้โดยอัตโนมัติ",
  "wallet.ln.waiting_expires": "กำลังรอการชำระเงิน · หมดอายุใน {countdown}",
  "wallet.ln.withdraw_body":
    "วางใบแจ้งหนี้ bolt11 แล้วมินต์จะจ่ายจาก ecash ของคุณ คุณจะได้รับแจ้งยอดกันไว้สำหรับกำหนดเส้นทางก่อน ส่วนที่การกำหนดเส้นทางไม่ได้ใช้จะกลับเข้ายอดคงเหลือของคุณ",
  "wallet.ln.up_to": "ไม่เกิน {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "จ่าย {amount} {unit}",
  "wallet.ln.deposit": "ฝาก sats ผ่าน Lightning",
  "wallet.ln.deposit_short": "ฝาก",
  "wallet.ln.withdraw": "ถอนไปยังใบแจ้งหนี้ Lightning",
  "wallet.ln.withdraw_short": "ถอน",
  "wallet.ln.deposit_title": "ฝากผ่าน Lightning",
  "wallet.ln.amount_placeholder": "จำนวนเป็น sats",
  "wallet.ln.requesting": "กำลังขอ…",
  "wallet.ln.get_invoice": "ขอใบแจ้งหนี้",
  "wallet.ln.copy_invoice": "คัดลอกใบแจ้งหนี้",
  "wallet.ln.open_wallet": "เปิดในกระเป๋าเงิน Lightning",
  "wallet.ln.open_wallet_short": "เปิดในกระเป๋าเงิน",
  "wallet.ln.waiting": "กำลังรอการชำระเงิน…",
  "wallet.ln.new_invoice": "สร้างใบแจ้งหนี้ใหม่",
  "wallet.ln.new_invoice_short": "ใบแจ้งหนี้ใหม่",
  "wallet.ln.withdraw_title": "ถอนไปยัง Lightning",
  "wallet.ln.scan_invoice": "สแกนคิวอาร์โค้ดใบแจ้งหนี้ Lightning",
  "wallet.ln.paid_from": "จ่ายจาก",
  "wallet.ln.invoice": "ใบแจ้งหนี้",
  "wallet.ln.routing_reserve": "ยอดกันไว้สำหรับกำหนดเส้นทาง",
  "wallet.ln.reserved": "กันไว้จากยอดคงเหลือ",
  "wallet.ln.paying": "กำลังจ่าย…",
  "wallet.ln.get_quote": "ขอใบเสนอราคา",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "ข้อมูลสำรอง",
  "wallet.backup.setup_failed": "ตั้งค่าข้อมูลสำรองไม่สำเร็จ",
  "wallet.backup.on": "เปิดข้อมูลสำรองแล้ว",
  "wallet.backup.on_body":
    "ตอนนี้ยอดคงเหลือของคุณสร้างขึ้นใหม่จากคำสิบสองคำนั้นได้แล้ว\n\nสิ่งที่คนอื่นให้คุณมาจะอยู่นอกวลีนั้นจนกว่าคุณจะรีเฟรชที่มินต์ และการกู้คืนต้องใช้รายชื่อมินต์ของคุณ จึงควรจดไว้ข้างคำเหล่านั้น",
  "wallet.backup.no_phrase": "ไม่มีวลีที่เก็บไว้",
  "wallet.backup.no_phrase_body":
    "อ่านวลีกู้คืนจาก keychain ของเครื่องไม่ได้ ปลดล็อกเครื่องแล้วลองอีกครั้ง",
  "wallet.backup.replace_title": "แทนที่วลีปัจจุบันของคุณหรือไม่",
  "wallet.backup.replace_body":
    "คุณมีวลีกู้คืนอยู่แล้ว การกู้คืนวลีอื่นจะแทนที่ของเดิม เหรียญที่วลีเดิมครอบคลุมอยู่จะยังใช้จ่ายได้บนเครื่องนี้ แต่จะกู้คืนไม่ได้อีก จึงควรแน่ใจว่าได้จดคำชุดเดิมไว้แล้วก่อนดำเนินการต่อ",
  "wallet.backup.replace": "แทนที่",
  "wallet.backup.invalid_phrase": "วลีนั้นไม่ถูกต้อง",
  "wallet.backup.invalid_phrase_body":
    "วลีมีค่าตรวจสอบในตัวและวลีนี้ไม่ผ่าน ลองตรวจหาคำที่พิมพ์ผิด ตกหล่น หรือสลับที่กัน",
  "wallet.backup.not_bip39":
    "เหล่านี้ไม่ใช่คำตาม BIP-39: {words} ตรวจสอบการสะกด",
  "wallet.backup.add_mint_first": "เพิ่มมินต์ก่อน",
  "wallet.backup.add_mint_first_body":
    "การกู้คืนทำงานด้วยการถามมินต์ว่าลงลายเซ็นเหรียญใดให้คุณบ้าง จึงต้องรู้ว่าจะถามมินต์ไหน เพิ่มมินต์ที่คุณเคยใช้ แล้วจึงกู้คืน",
  "wallet.backup.restore_failed": "กู้คืนไม่สำเร็จ",
  "wallet.backup.phrase": "วลีกู้คืน",
  "wallet.backup.state_unconfirmed": "เปิดข้อมูลสำรองแล้วแต่ยังไม่ยืนยัน",
  "wallet.backup.state_off": "ปิดข้อมูลสำรอง",
  "wallet.backup.badge_on": "เปิด",
  "wallet.backup.badge_unconfirmed": "ยังไม่ยืนยัน",
  "wallet.backup.badge_off": "ปิด",
  "wallet.backup.view": "ดูวลีกู้คืน",
  "wallet.backup.setup": "ตั้งค่าวลีกู้คืน",
  "wallet.backup.view_short": "ดูวลี",
  "wallet.backup.setup_short": "ตั้งค่า",
  "wallet.backup.restore": "กู้คืนกระเป๋าเงินจากวลีกู้คืน",
  "wallet.backup.restore_short": "กู้คืน",
  "wallet.backup.setup_title": "ตั้งค่าวลีกู้คืน",
  "wallet.backup.on_body_short":
    "ยอดคงเหลือของคุณสร้างขึ้นใหม่บนเครื่องใหม่ได้จากคำสิบสองคำของคุณ",
  "wallet.backup.unconfirmed_body":
    "คุณไม่เคยยืนยันว่ามีสำเนาที่จดไว้ ตอนนี้คำเหล่านั้นอยู่แค่บนโทรศัพท์เครื่องนี้ ซึ่งเป็นสิ่งเดียวที่ข้อมูลสำรองควรอยู่รอดจากมันไปได้ ดูวลีแล้วจดเอาไว้",
  "wallet.backup.not_covered":
    "{amount} ยังไม่ได้ถูกครอบคลุม เหรียญที่คนอื่นให้คุณมาพกความลับของผู้ส่งมาด้วย จึงเข้ามาอยู่ใต้วลีของคุณต่อเมื่อถูกสับเปลี่ยนแล้วเท่านั้น รีเฟรชมินต์เพื่อทำให้มันปลอดภัย",
  "wallet.backup.off_body":
    "ecash ของคุณอยู่บนโทรศัพท์เครื่องนี้เท่านั้น หากคุณทำหาย ไม่มีใครกู้เงินคืนได้ รวมถึงตัวคุณเอง วลีกู้คืนคือคำสิบสองคำที่สร้างยอดคงเหลือของคุณขึ้นใหม่ได้ทุกที่",
  "wallet.backup.about_to_see": "คุณกำลังจะเห็นคำสิบสองคำ คำเหล่านั้นคือเงิน",
  "wallet.backup.exact_order":
    "คำสิบสองคำ ตามลำดับนี้เป๊ะ ใครก็ตามที่มีคำเหล่านี้ก็มียอดคงเหลือของคุณ",
  "wallet.backup.verify_body":
    "วลีที่ไม่มีใครจดไว้แย่กว่าการไม่มีวลีเลย เพราะมันดูเหมือนตาข่ายนิรภัยที่จริง ๆ แล้วไม่มีอยู่ ยืนยันด้วยสองคำ",
  "wallet.backup.verify_mismatch": "ไม่ตรงกัน ตรวจสอบสำเนาที่คุณจดไว้",
  "wallet.backup.restore_body":
    "ใส่คำสิบสองคำ Airhop จะสร้างเหรียญของคุณขึ้นใหม่และถามแต่ละมินต์ว่าลงลายเซ็นเหรียญใดบ้าง ยอดคงเหลือจึงกลับมาจากบันทึกที่มินต์เก็บไว้",
  "wallet.backup.warn_secret":
    "ใครก็ตามที่อ่านคำเหล่านี้ได้สามารถเอายอดคงเหลือของคุณไปได้ อย่าถ่ายภาพหน้าจอและอย่าเก็บไว้บนโทรศัพท์เครื่องนี้",
  "wallet.backup.warn_paper":
    "เขียนลงกระดาษแล้วเก็บไว้ในที่ปลอดภัย หากโทรศัพท์หายไป Airhop จะแสดงคำเหล่านี้ให้คุณอีกไม่ได้",
  "wallet.backup.warn_scope":
    "คำเหล่านี้สร้างขึ้นใหม่ได้เฉพาะ ecash ของคุณ ตัวตน แชท และผู้ติดต่อของคุณไม่ได้ถูกครอบคลุม",
  "wallet.backup.warn_mints":
    "การกู้คืนต้องถามมินต์ว่าลงลายเซ็นเหรียญใดบ้าง จึงควรจดรายชื่อมินต์ของคุณไว้ข้างคำเหล่านั้น",
  "wallet.backup.preparing": "กำลังเตรียม…",
  "wallet.backup.show_phrase": "แสดงวลีของฉัน",
  "wallet.backup.your_phrase": "วลีกู้คืนของคุณ",
  "wallet.backup.write_down": "จดสิ่งเหล่านี้ไว้",
  "wallet.backup.copy_phrase": "คัดลอกวลีกู้คืนไปยังคลิปบอร์ด",
  "wallet.backup.copy_clipboard": "คัดลอกไปยังคลิปบอร์ด",
  "wallet.backup.written_down": "ฉันจดไว้แล้ว",
  "wallet.backup.check_copy": "ตรวจสอบสำเนาของคุณ",
  "wallet.backup.confirm": "ยืนยัน",
  "wallet.backup.restore_title": "กู้คืนจากวลี",
  "wallet.backup.phrase_placeholder": "คำสิบสองคำ คั่นด้วยเว้นวรรค",
  "wallet.backup.no_mints_yet":
    "ยังไม่ได้เพิ่มมินต์ใด การกู้คืนต้องถามมินต์ที่เจาะจง จึงควรเพิ่มมินต์ที่คุณเคยใช้ก่อน",
  "wallet.backup.scanning": "กำลังสแกน…",
  "wallet.backup.restore_progress": "{mint} · คีย์เซ็ต {step} จาก {total}",
  "wallet.backup.will_scan":
    "จะสแกน: {mints} มินต์ที่คุณไม่ได้เพิ่มจะไม่ถูกถามเลย ยอดคงเหลือที่นั่นจึงมองไม่เห็น",
  "wallet.backup.word_n": "คำที่ {position}",
  "wallet.backup.unreachable_mints":
    "ติดต่อไม่ได้: {mints} ยอดคงเหลือที่นั่นยังคงอยู่ ลองอีกครั้งเมื่อการเชื่อมต่อดีขึ้น",
  "wallet.backup.nothing_recovered": "ไม่มีอะไรถูกกู้คืนจากมินต์ที่สแกน",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "ทำเครื่องหมายว่าได้รับแล้วหรือไม่",
  "wallet.delivered.body":
    "สิ่งนี้จะปล่อย {amount} {unit} ออกไปอย่างถาวร หากมันไม่เคยไปถึงจริง คุณจะเรียกคืนไม่ได้",
  "wallet.delivered.body_generic":
    "สิ่งนี้จะปล่อยยอดที่กันไว้ออกไปอย่างถาวร หากมันไม่เคยไปถึงจริง คุณจะเรียกคืนไม่ได้",
  "wallet.delivered.cancel": "ยังก่อน",
  "wallet.delivered.confirm": "พวกเขาได้รับแล้ว",
  "wallet.reclaim.title": "เรียกคืนโทเคนนี้หรือไม่",
  "wallet.reclaim.body":
    "{amount} {unit} จะกลับเข้ายอดคงเหลือของคุณ ทำเช่นนี้ก็ต่อเมื่อโทเคนไม่เคยไปถึงใครเลย หากพวกเขามีสตริงนั้นอยู่แล้ว ใครก็ตามที่แลกมันที่มินต์ก่อนจะได้เงินไป และนั่นอาจเป็นพวกเขา",
  "wallet.reclaim.keep": "คงไว้เป็นรอดำเนินการ",
  "wallet.reclaim.confirm": "เรียกคืน",
  "wallet.copied.token_body":
    "โทเคนอยู่บนคลิปบอร์ดของคุณแล้ว มันยังถูกกันไว้ที่นี่จนกว่าคุณจะทำเครื่องหมายว่าส่งถึงแล้ว คุณจึงวางซ้ำได้หากครั้งแรกไม่สำเร็จ",
  "wallet.copied.phrase_body":
    "วางลงในโปรแกรมจัดการรหัสผ่าน แล้วล้างคลิปบอร์ดของคุณ แอปอื่นอ่านคลิปบอร์ดได้ และในบางการตั้งค่ามันจะซิงค์ไปยังอุปกรณ์อื่นของคุณ",
  "wallet.refresh.failed": "รีเฟรชไม่สำเร็จ",
  "wallet.refresh.partly": "รีเฟรชได้บางส่วน",
  "wallet.refresh.done": "รีเฟรชแล้ว",
  "wallet.refresh.unreachable":
    "ติดต่อ {mints} ไม่ได้ ส่วนที่เหลือทั้งหมดเป็นข้อมูลล่าสุดแล้ว",
  "wallet.refresh.swapped":
    "ยืนยัน {amount} {unit} และสับเปลี่ยนเป็นพรูฟใหม่แล้ว",
  "wallet.refresh.secured":
    "ตอนนี้ {amount} {unit} อยู่ภายใต้วลีกู้คืนของคุณแล้ว",
  "wallet.refresh.all_confirmed": "ทุกอย่างที่นี่ได้รับการยืนยันกับมินต์ไปแล้ว",
  "wallet.pending.title": "รอดำเนินการ",
  "wallet.pending.reserved_desc":
    "สร้างและกันไว้แล้ว ยังไม่ยืนยันการส่งถึง พรูฟถูกกันออกจากยอดคงเหลือของคุณเพื่อไม่ให้ถูกใช้ซ้ำ",
  "wallet.pending.locked_desc":
    "ถูกล็อกไว้กับกุญแจของผู้รับแล้ว มีเพียงพวกเขาเท่านั้นที่ใช้ได้ เพียงแต่มันยังไปไม่ถึงพวกเขา แชร์โทเคนเพื่อทำให้เสร็จ",
  "wallet.pending.show_qr": "แสดงโทเคนนี้เป็นคิวอาร์โค้ด",
  "wallet.pending.copy_again": "คัดลอกโทเคนอีกครั้ง",
  "wallet.pending.share_again": "แชร์โทเคนอีกครั้ง",
  "wallet.pending.mark_delivered": "ทำเครื่องหมายว่าโทเคนนี้ส่งถึงแล้ว",
  "wallet.pending.delivered": "ส่งถึงแล้ว",
  "wallet.pending.reclaim_into": "เรียกคืนโทเคนนี้เข้ายอดคงเหลือของคุณ",
  "wallet.activity.title": "กิจกรรม",
  "wallet.activity.none": "ยังไม่มีอะไร",
  "wallet.activity.none_desc":
    "การชำระเงินที่คุณส่งและรับจะปรากฏที่นี่ ใหม่สุดก่อน พร้อมมินต์และค่าธรรมเนียมของแต่ละรายการ",
  "wallet.activity.show_fewer": "แสดงการชำระเงินน้อยลง",
  "wallet.activity.show_less": "แสดงน้อยลง",
  "wallet.activity.received_unconfirmed": "ได้รับ ยังไม่ยืนยัน",
  "wallet.activity.received": "ได้รับ",
  "wallet.activity.receive_failed": "รับไม่สำเร็จ",
  "wallet.activity.reclaimed": "เรียกคืนแล้ว",
  "wallet.activity.send_failed": "ส่งไม่สำเร็จ",
  "wallet.activity.sent": "ส่งแล้ว",
  "wallet.activity.status_pending": "รอดำเนินการ",
  "wallet.activity.status_failed": "ไม่สำเร็จ",
  "wallet.activity.status_reclaimed": "เรียกคืนแล้ว",
  "wallet.activity.status_expired": "หมดอายุ",
  "wallet.activity.ln_deposit": "ฝากผ่าน Lightning",
  "wallet.activity.ln_withdrawal": "ถอนผ่าน Lightning",
  "wallet.activity.nutzap_received": "ได้รับ Nutzap",
  "wallet.activity.spent_removed": "นำพรูฟที่ถูกใช้แล้วออก",
  "wallet.activity.refreshed": "รีเฟรชพรูฟแล้ว",
  "wallet.activity.refreshing": "กำลังรีเฟรชพรูฟ",
  "wallet.activity.just_now": "เมื่อครู่นี้",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "เมชออฟไลน์",
  "wallet.mesh_offline_body":
    "บริการเมชไม่ได้ทำงานอยู่ จึงไม่มีที่ให้ส่งมอบโทเคน มันจะยังถูกกันไว้ในหัวข้อรอดำเนินการ",
  "wallet.xfer.route_mesh": "ส่งมอบตรงถึงเครื่องของพวกเขาผ่านเมชแล้ว",
  "wallet.xfer.route_nostr":
    "พวกเขาอยู่นอกระยะบลูทูธ มันจึงไปทางอินเทอร์เน็ตแทน",
  "wallet.xfer.route_courier":
    "ตอนนี้ยังไม่มีเส้นทางไปถึงพวกเขา อุปกรณ์อื่นจะช่วยขนไปและส่งให้เมื่อมีเครื่องใดไปถึงพวกเขา",
  "wallet.xfer.route_queued":
    "ยังติดต่อพวกเขาไม่ได้ มันอยู่ในคิวและจะถูกส่งทันทีที่ติดต่อได้",
  "wallet.xfer.mesh_offline_body":
    "บริการเมชไม่ได้ทำงานอยู่ จึงไม่มีทางส่งมอบโทเคนได้ ไม่มีการหักยอดใด ๆ",
  "wallet.xfer.could_not_send": "ส่งไม่สำเร็จ",
  "wallet.xfer.inexact_body":
    "พรูฟของคุณสร้างยอด {amount} {unit} แบบพอดีเป๊ะขณะออฟไลน์ไม่ได้ โทเคนที่เล็กที่สุดที่สร้างได้คือ {spend} {unit} และส่วนเกิน {extra} {unit} จะตกเป็นของพวกเขาโดยไม่มีทางเอาคืน\n\nการรีเฟรชที่มินต์ขณะออนไลน์จะแบ่งพรูฟของคุณออกเป็นหน่วยย่อยที่ทำให้ได้ยอดพอดีเป๊ะ",
  "wallet.xfer.send_amount": "ส่ง {amount}",
  "wallet.xfer.mesh_offline": "เมชออฟไลน์",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "ล็อกไว้กับกุญแจของพวกเขาและเผยแพร่ไปยัง Nostr แล้ว มันเป็นของพวกเขาไม่ว่าจะออนไลน์อยู่หรือไม่",
  "wallet.pay.rail_nutzap_dm":
    "ล็อกไว้กับกุญแจของพวกเขาแล้ว รีเลย์ไม่ยอมรับมัน มันจึงไปหาพวกเขาในรูปข้อความแทน",
  "wallet.pay.rail_nutzap_undelivered":
    "ล็อกไว้กับกุญแจของพวกเขาแล้ว แต่ยังไม่มีอะไรขนมันไปได้ มันอยู่ในคิว และโทเคนอยู่ในหัวข้อรอดำเนินการ",
  "wallet.pay.final":
    "การชำระเงินที่ล็อกไว้เรียกคืนไม่ได้ ตอนนี้มีเพียงกุญแจของพวกเขาเท่านั้นที่ใช้เหรียญเหล่านี้ได้",
  "wallet.pay.reclaimable":
    "มันยังเรียกคืนได้จากแท็บกระเป๋าเงินจนกว่าคุณจะยืนยันว่ามันไปถึงแล้ว",
  "wallet.pay.why": "ส่งด้วยวิธีนี้เพราะ {reason}",
  "wallet.pay.sent_title": "{amount} {unit} ถึง {name}",
  "wallet.pay.thread_receipt":
    "คุณส่ง {amount} {unit} ล็อกไว้กับกุญแจของพวกเขา",
  "wallet.pay.title": "ส่ง ecash",
  "wallet.pay.to": "ถึง {name}",
  "wallet.pay.amount": "จำนวนเป็น sats",
  "wallet.pay.memo": "หมายเหตุ (ไม่บังคับ เปิดเผยสู่สาธารณะ)",
  "wallet.pay.send": "ส่ง",
  "wallet.pay.sending": "กำลังส่ง…",
  "wallet.pay.action": "ส่ง ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "การเข้าถึงกล้อง",
  "wallet.scan.camera_purpose": "สแกนคิวอาร์โค้ด ecash",
  "wallet.scan.photo_label": "การเข้าถึงรูปภาพ",
  "wallet.scan.photo_purpose": "อ่าน QR ของ ecash จากรูปภาพ",
  "wallet.scan.no_token": "ไม่พบโทเคน ecash ในรูปนั้น",
  "wallet.scan.no_invoice": "ไม่พบใบแจ้งหนี้ Lightning ในรูปนั้น",
  "wallet.scan.unreadable": "อ่านรูปนั้นไม่ได้",
  "wallet.scan.camera_failed":
    "เริ่มกล้องไม่สำเร็จ ปิดแอปกล้องอื่นแล้วลองอีกครั้ง",
  "wallet.scan.close": "ปิดเครื่องสแกน",
  "wallet.scan.on_device": "มันถูกอ่านบนเครื่องนี้ ไม่มีสิ่งใดถูกส่งออกไปที่ใด",
  "wallet.scan.aim_token": "หันไปที่คิวอาร์โค้ด ecash",
  "wallet.scan.aim_invoice": "หันไปที่คิวอาร์โค้ดใบแจ้งหนี้ Lightning",
  "wallet.scan.title_token": "สแกน ecash",
  "wallet.scan.title_invoice": "สแกนใบแจ้งหนี้",
  "wallet.scan.desc_token":
    "อ่านโทเคน Cashu จากกระเป๋าเงินอื่น ใช้ได้กับกระเป๋าเงิน Cashu ทุกแบบ ไม่ใช่แค่ Airhop",
  "wallet.scan.desc_invoice":
    "อ่านใบแจ้งหนี้ Lightning เพื่อจ่ายจากยอดคงเหลือของคุณ",
  "wallet.scan.use_camera_a11y": "สแกนด้วยกล้อง",
  "wallet.scan.use_camera": "ใช้กล้อง",
  "wallet.scan.pick_image_a11y": "อ่านคิวอาร์โค้ดจากรูปที่บันทึกไว้",
  "wallet.scan.pick_image": "เลือกจากรูปภาพ",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu คืออะไร",
  "wallet.explain.intro":
    "Cashu คือ ecash สำหรับ Bitcoin โทเคนคือสตริงที่มีค่าเป็นเงินสำหรับผู้ที่ถือมัน ลงลายเซ็นแบบปิดตาโดยมินต์ เพื่อให้มินต์บอกไม่ได้ว่าใครใช้อะไร ไม่มีบัญชี ไม่มีการเข้าสู่ระบบ",
  "wallet.explain.send": "ส่ง",
  "wallet.explain.send_desc":
    "เปลี่ยนจำนวนเงินให้เป็นโทเคนที่คุณส่งมอบให้เพียร์ที่อยู่ใกล้ผ่านบลูทูธได้ หรือแชร์เป็นข้อความก็ได้ ใช้งานได้โดยไม่ต้องมีอินเทอร์เน็ต พรูฟจะยังถูกกันไว้จนกว่าคุณจะยืนยันว่ามันไปถึงแล้ว",
  "wallet.explain.receive": "รับ",
  "wallet.explain.receive_desc":
    "วางโทเคนเพื่อเพิ่มเข้ามา เมื่อออนไลน์มันจะถูกสับเปลี่ยนที่มินต์ทันที ซึ่งทำให้มันเป็นของคุณอย่างพิสูจน์ได้ เมื่อออฟไลน์มันจะถูกเก็บไว้และทำเครื่องหมายว่ายังไม่ยืนยันจนกว่าคุณจะรีเฟรช",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "จ่ายให้ตัวตนบน Nostr หากพวกเขาเผยแพร่ข้อมูล nutzap ตาม NIP-61 ecash จะถูกล็อกไว้กับกุญแจของพวกเขาเพื่อให้มีเพียงพวกเขาที่ใช้ได้ มิฉะนั้นมันจะย้อนกลับไปใช้ DM ที่เข้ารหัส ต้องใช้อินเทอร์เน็ต",
  "wallet.explain.add_mint": "เพิ่มมินต์",
  "wallet.explain.add_mint_desc":
    "บันทึกมินต์ที่ออกและแลก ecash ของคุณ และแคชกุญแจสาธารณะของมันไว้เพื่อให้ตรวจสอบโทเคนจากมินต์นั้นแบบออฟไลน์ได้ เลือกมินต์ที่คุณไว้ใจกับยอดเงินที่คุณเก็บไว้ที่นั่น",
  "wallet.explain.phrase": "วลีกู้คืน",
  "wallet.explain.phrase_desc":
    "เหรียญของคุณได้มาจากคำสิบสองคำที่กระเป๋าเงินสร้างขึ้นตั้งแต่แรก โทรศัพท์เครื่องใหม่จึงสร้างยอดคงเหลือขึ้นใหม่ได้ด้วยการถามมินต์ของคุณว่าลงลายเซ็นเหรียญใดบ้าง จนกว่าคุณจะดูและจดคำเหล่านั้นไว้ มันจะอยู่แค่บนโทรศัพท์เครื่องนี้",

  // ---- Wallet: failures ----
  "wallet.err.locked": "กระเป๋าเงินถูกล็อก",
  "wallet.err.mint_unreachable": "ติดต่อมินต์ไม่ได้",
  "wallet.err.tor_blocked": "ถูกบล็อกขณะที่ Tor เปิดอยู่",
  "wallet.err.insufficient": "ยอดคงเหลือไม่พอ",
  "wallet.err.exact_amount": "ส่งยอดพอดีเป๊ะเท่านั้นไม่ได้",
  "wallet.err.no_mint": "ไม่มีมินต์",
  "wallet.err.mint_unsupported": "มินต์ทำสิ่งนั้นไม่ได้",
  "wallet.err.mint_refused": "มินต์ปฏิเสธ",
  "wallet.err.unreadable": "โทเคนอ่านไม่ได้",
  "wallet.err.rejected": "โทเคนถูกปฏิเสธ",
  "wallet.err.already_spent": "ถูกใช้ไปแล้ว",
  "wallet.err.change_pending": "จ่ายแล้ว เงินทอนรอดำเนินการ",
  "wallet.svc.mint_unreachable": "ติดต่อมินต์ไม่ได้",
  "wallet.svc.tor_ios": "คำขอไปยังมินต์ไม่ได้ผ่าน Tor บน iOS",
  "wallet.svc.tor_ios_body":
    "Arti ห่อหุ้มเฉพาะ WebSocket ของ Nostr คำขอนี้จึงจะไปถึงมินต์ผ่านเครือข่ายเปิดและเชื่อม IP ของคุณเข้ากับพรูฟเหล่านี้ อนุญาตได้ที่การตั้งค่า > ความปลอดภัย หรือปิด Tor ก่อน การส่งและรับ ecash ผ่านเมชยังทำงานอยู่",
  "wallet.svc.tor_paused": "Tor เปิดอยู่แต่ยังไม่เชื่อมต่อ",
  "wallet.svc.tor_paused_body":
    "Orbot หยุดส่งต่อทราฟฟิกแล้ว คำขอนี้จึงจะไปถึงมินต์ผ่านเครือข่ายเปิดและเชื่อม IP ของคุณเข้ากับพรูฟเหล่านี้ เปิด Orbot อีกครั้ง หรือปิด Tor การส่งและรับ ecash ผ่านเมชยังทำงานอยู่",
  "wallet.svc.keys_uncached": "กุญแจของมินต์นี้ไม่ได้แคชไว้บนเครื่องนี้",
  "wallet.svc.keys_uncached_body":
    "เปิดกระเป๋าเงินสักครั้งขณะออนไลน์เพื่อดึงกุญแจมา",
  "wallet.svc.phrase_invalid": "วลีกู้คืนนั้นไม่ถูกต้อง",
  "wallet.svc.phrase_invalid_body":
    "ตรวจหาคำที่พิมพ์ผิดหรือตกหล่น วลีมีค่าตรวจสอบในตัว คำผิดเพียงคำเดียวก็ทำให้ทั้งวลีใช้ไม่ได้",
  "wallet.svc.need_mint": "เพิ่มมินต์อย่างน้อยหนึ่งแห่งก่อน",
  "wallet.svc.need_mint_body":
    "การกู้คืนทำงานด้วยการถามมินต์ว่าลงลายเซ็นเหรียญใดให้คุณบ้าง จึงต้องรู้ว่าจะถามมินต์ไหน",
  "wallet.svc.restored": "กู้คืนจากวลีกู้คืนแล้ว",
  "wallet.svc.storage_locked": "ที่จัดเก็บของกระเป๋าเงินถูกล็อกอยู่",
  "wallet.svc.storage_locked_body":
    "Airhop เก็บพรูฟ ecash ไว้ในไฟล์ที่เข้ารหัสซึ่งกุญแจอยู่ใน keychain ของเครื่อง ปลดล็อกเครื่องแล้วเปิดแอปใหม่",
  "wallet.svc.bad_url": "นั่นไม่ใช่ URL ที่ถูกต้อง",
  "wallet.svc.needs_https": "URL ของมินต์ต้องขึ้นต้นด้วย https://",
  "wallet.svc.refuse_http": "ปฏิเสธการใช้มินต์ผ่าน http ธรรมดา",
  "wallet.svc.refuse_http_body":
    "ใครก็ตามบนเส้นทางเครือข่ายอ่านหรือแก้ไขพรูฟของคุณได้ ใช้มินต์แบบ https:// แทน",
  "wallet.svc.mint_not_saved": "บันทึกมินต์ไม่สำเร็จ",
  "wallet.svc.unreadable_token": "นั่นไม่ใช่โทเคน Cashu ที่อ่านได้",
  "wallet.svc.unreadable_token_body":
    "โทเคนขึ้นต้นด้วย cashuA หรือ cashuB ตรวจสอบว่าไม่มีส่วนใดขาดหายไปตอนคัดลอก",
  "wallet.svc.wrong_mint": "โทเคนนี้ไม่ได้ลงลายเซ็นโดยมินต์ที่มันระบุชื่อไว้",
  "wallet.svc.already_spent": "พรูฟเหล่านี้ถูกใช้ไปแล้ว",
  "wallet.svc.already_spent_body":
    "ผู้ที่ส่งโทเคนนี้แลกมันไปก่อน หรือส่งโทเคนใบเดียวกันให้คนอื่นด้วย",
  "wallet.svc.receiving_offline": "กำลังรับแบบออฟไลน์",
  "wallet.svc.amount_positive": "ใส่จำนวนที่มากกว่าศูนย์",
  "wallet.svc.coins_raced": "เหรียญเหล่านั้นเพิ่งถูกใช้โดยการชำระเงินอีกรายการ",
  "wallet.svc.coins_raced_body":
    "ไม่มีการหักยอดใด ๆ ลองอีกครั้งแล้วกระเป๋าเงินจะเลือกชุดอื่น",
  "wallet.svc.no_ecash": "ยังไม่มี ecash",
  "wallet.svc.no_ecash_body":
    "เพิ่มมินต์แล้วฝากผ่าน Lightning หรือรับโทเคนจากใครสักคน",
  "wallet.svc.split_across_mints": "ยอดคงเหลือของคุณกระจายอยู่หลายมินต์",
  "wallet.svc.mint_says_spent": "มินต์รายงานว่าพรูฟเหล่านี้ถูกใช้ไปแล้ว",
  "wallet.svc.issue_against_invoice": "ออก ecash โดยอิงใบแจ้งหนี้ Lightning",
  "wallet.svc.pay_invoice": "จ่ายใบแจ้งหนี้ Lightning",
  "wallet.svc.unknown_deposit": "รายการฝากที่ไม่รู้จัก",
  "wallet.svc.invoice_expired_before": "ใบแจ้งหนี้หมดอายุก่อนที่จะถูกชำระ",
  "wallet.svc.invoice_expired": "ใบแจ้งหนี้นั้นหมดอายุแล้ว",
  "wallet.svc.invoice_unpaid": "ใบแจ้งหนี้ยังไม่ได้ถูกชำระ",
  "wallet.svc.payment_unknown":
    "ไม่ทราบสถานะการชำระเงิน จะตรวจสอบอีกครั้งในการรีเฟรชครั้งถัดไป",
  "wallet.svc.melt_change_pending": "ใบแจ้งหนี้ของคุณถูกชำระแล้ว",
  "wallet.svc.melt_change_pending_body":
    "มินต์ยังไม่ได้คืนค่าธรรมเนียมกำหนดเส้นทางส่วนที่ไม่ได้ใช้ ระบบจะเรียกคืนให้เองในการรีเฟรชครั้งถัดไป และระหว่างนี้ไม่มีอะไรสูญหาย",
  "wallet.svc.mint_did_not_pay":
    "มินต์ไม่ได้ชำระใบแจ้งหนี้นี้ ยอดคงเหลือของคุณไม่เปลี่ยนแปลง",
  "wallet.svc.not_an_invoice": "นั่นไม่ใช่ใบแจ้งหนี้ Lightning",
  "wallet.svc.not_an_invoice_body": "วางใบแจ้งหนี้ bolt11 ที่ขึ้นต้นด้วย lnbc",
  "wallet.svc.insufficient_for_invoice": "ยอดคงเหลือไม่พอสำหรับใบแจ้งหนี้นี้",
  "wallet.svc.coins_raced_invoice_body":
    "ไม่มีการหักยอดและใบแจ้งหนี้ไม่ได้ถูกชำระ ลองอีกครั้ง",
  "wallet.svc.same_mint": "เลือกมินต์ปลายทางอื่น",
  "wallet.svc.same_mint_body":
    "ต้นทางและปลายทางเป็นมินต์เดียวกัน จึงไม่มีอะไรให้ย้าย",
  "wallet.svc.quote_failed_retried": "ขอใบเสนอราคาไม่สำเร็จ ลองรวมยอดใหม่แล้ว",
  "wallet.svc.amount_unfit_retried": "จำนวนไม่ลงตัว ลองรวมยอดใหม่แล้ว",
  "wallet.svc.cannot_size": "กำหนดขนาดการโอนนี้ไม่ได้",
  "wallet.svc.insufficient_at_mint": "ยอดคงเหลือที่ {mint} ไม่พอ",
  "wallet.svc.inexact_title":
    "พรูฟของคุณสร้างยอด {amount} {unit} แบบพอดีเป๊ะขณะออฟไลน์ไม่ได้",
  "wallet.svc.inexact_detail":
    "โทเคนที่เล็กที่สุดที่คุณส่งได้คือ {spend} {unit} เมื่อออฟไลน์จะไม่มีเงินทอน ส่วนเกิน {extra} {unit} จึงตกเป็นของผู้รับ",
  "wallet.svc.no_single_mint":
    "ไม่มีมินต์แห่งใดแห่งเดียวที่ถือ {amount} {unit} ecash จากมินต์ต่างแห่งรวมเป็นโทเคนใบเดียวไม่ได้ ให้รวมยอดไว้ที่มินต์เดียวก่อน หรือแยกส่งเป็นหลายจำนวน",
  "wallet.svc.have_tried_send": "คุณมี {total} {unit} และพยายามส่ง {amount}",
  "wallet.svc.invoice_needs":
    "ใบแจ้งหนี้นี้ต้องใช้ {total} {unit} รวมยอดกันไว้สำหรับกำหนดเส้นทาง และคุณมี {balance}",
  "wallet.svc.nothing_to_move": "{mint} ไม่มี {unit} ให้ย้าย",
  "wallet.svc.consolidate_memo": "รวมยอดจาก {mint}",
  "wallet.svc.cannot_size_detail":
    "หลังหักค่าธรรมเนียมกำหนดเส้นทาง Lightning แล้ว {from} ย้ายยอดที่คุ้มค่าไปยัง {to} ไม่ได้ ลองย้ายยอดที่เล็กลงและระบุจำนวนเองแทน",
  "wallet.svc.mint_cannot": "{mint} ทำ {action} ไม่ได้",
  "wallet.svc.no_nut": "มินต์ไม่ได้ประกาศรองรับ NUT-{nut}",
  "wallet.svc.unknown_mint": "การชำระเงินนั้นระบุมินต์ที่คุณไม่ได้ใช้",
  "wallet.svc.unknown_mint_body":
    "หากคุณไว้ใจ ให้เพิ่มมินต์นั้นด้วยตัวเองก่อน ไม่มีการแลกใด ๆ จากมินต์ที่คุณไม่ได้เลือก",
  "wallet.svc.no_relay": "ไม่มีการเชื่อมต่อรีเลย์",
  "wallet.svc.no_shared_mint": "ไม่มีมินต์ร่วมที่มียอดคงเหลือเพียงพอ",
  "wallet.svc.no_nutzap_info":
    "ผู้รับยังไม่ได้เผยแพร่ข้อมูล nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "ล็อกไว้กับกุญแจของพวกเขาแล้วแต่ยังไม่ได้ส่งถึง แชร์โทเคนจากธุรกรรมนี้เพื่อทำให้เสร็จ",
  "wallet.svc.swap_lost":
    "มินต์ไม่เคยทำการสับเปลี่ยนนี้จนเสร็จ จึงไม่มีอะไรถูกออกให้",
  "wallet.svc.swap_unreadable":
    "การสับเปลี่ยนนี้ถูกบันทึกไว้ในรูปแบบที่เวอร์ชันนี้เล่นซ้ำไม่ได้",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "ยืนยันผ่าน QR แล้ว",
  "contacts.qr.keys_unverified": "ได้รับกุญแจแล้ว ยังไม่ยืนยัน",
  "contacts.qr.not_verified": "ยังไม่ได้ยืนยัน",
  "contacts.qr.message": "ข้อความ",
  "contacts.qr.add": "เพิ่มผู้ติดต่อ",
  "contacts.qr.scan_title": "สแกนคิวอาร์โค้ด",
  "contacts.qr.aim": "หันกล้องไปที่คิวอาร์โค้ดของพวกเขา",
  "contacts.qr.add_desc": "ติดต่อคนที่ไม่ได้อยู่ใกล้บนเมช",
  "contacts.qr.peer_id_hint":
    "ID ของเพียร์มี 16 อักขระ ส่วนรหัสผู้ติดต่อขึ้นต้นด้วย airhop:",
  "contacts.qr.or_scan": "หรือสแกน QR ของพวกเขา",
  "contacts.qr.trust_note":
    "มีเพียง QR ที่คุณสแกนด้วยกล้องเท่านั้นที่ยืนยันกุญแจของพวกเขาได้ รหัสที่วางมาจะพากุญแจของพวกเขามาด้วย แต่ไม่ได้พิสูจน์ว่ามาจากพวกเขาจริง",
  "contacts.qr.peer_id": "ID ของเพียร์หรือรหัสผู้ติดต่อ",
  "contacts.qr.peer_id_placeholder": "วาง ID หรือรหัสผู้ติดต่อ",
  "contacts.qr.scan_camera_a11y": "สแกนคิวอาร์โค้ดด้วยกล้อง",
  "contacts.qr.scan_camera_desc": "ใช้กล้องของคุณ",
  "contacts.qr.upload_a11y": "อัปโหลดรูปคิวอาร์โค้ดจากแกลเลอรี",
  "contacts.qr.upload": "อัปโหลดจากแกลเลอรี",
  "contacts.qr.upload_desc": "เลือกรูป QR ที่บันทึกไว้",
  "contacts.qr.scan_a11y": "เพิ่มผู้ติดต่อโดยสแกนคิวอาร์โค้ด",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "วาง ID ของเพียร์ 16 อักขระ ลิงก์ airhop://peer/… หรือรหัสผู้ติดต่อ",
  "contacts.scan.camera_label": "การเข้าถึงกล้อง",
  "contacts.scan.camera_purpose": "สแกนคิวอาร์โค้ดของผู้ติดต่อ",
  "contacts.scan.camera_needed":
    "ต้องเข้าถึงกล้องจึงจะสแกนได้ คุณยังเพิ่มด้วย ID ของเพียร์ได้",
  "contacts.scan.camera_failed":
    "เริ่มกล้องไม่สำเร็จ ปิดแอปกล้องอื่นแล้วลองอีกครั้ง",
  "contacts.scan.photo_label": "การเข้าถึงรูปภาพ",
  "contacts.scan.photo_purpose": "สแกนคิวอาร์โค้ดที่คุณบันทึกไว้",
  "contacts.scan.photo_needed":
    "ต้องเข้าถึงรูปภาพจึงจะเลือกรูปได้ คุณยังเพิ่มด้วย ID ของเพียร์ได้",
  "contacts.scan.no_qr": "ไม่พบคิวอาร์โค้ดของ Airhop ในรูปนั้น",
  "contacts.scan.unreadable": "อ่านคิวอาร์โค้ดจากรูปนั้นไม่ได้",
  "contacts.scan.bitchat_expired":
    "รหัส bitchat นั้นหมดอายุแล้ว ขอให้พวกเขาเปิด QR ขึ้นมาใหม่",
  "contacts.scan.tampered":
    "คิวอาร์โค้ดนี้ใช้ไม่ได้ ID ของเพียร์ไม่ตรงกับกุญแจ อาจถูกดัดแปลง",
  "contacts.scan.already_added": "อยู่ในผู้ติดต่อของคุณแล้ว",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "กำลังรอการเข้าถึงกล้อง…",
  "contacts.verify.camera_off": "กล้องปิดอยู่",
  "contacts.verify.open_settings": "เปิดการตั้งค่า",
  "contacts.verify.verified": "ยืนยันแล้ว",
  "contacts.verify.different": "คนละผู้ติดต่อ",
  "contacts.verify.scan_again": "สแกนอีกครั้ง",
  "contacts.verify.failed": "ยืนยันไม่สำเร็จ",
  "contacts.verify.done": "เสร็จสิ้น",
  "contacts.verify.title": "ยืนยัน {name}",
  "contacts.verify.aim": "หันกล้องไปที่คิวอาร์โค้ดของพวกเขา",
  "contacts.verify.camera_off_body":
    "เปิดการเข้าถึงกล้องในการตั้งค่าเพื่อยืนยันด้วย QR",
  "contacts.verify.match_body":
    "กุญแจของ {name} ตรงกัน คุณเชื่อถือผู้ติดต่อรายนี้ได้",
  "contacts.verify.different_body":
    "QR นี้เป็นของคนอื่น ขอให้ {name} แสดงรหัสของตัวเอง",
  "contacts.verify.tampered_body": "QR นี้ดูเหมือนถูกดัดแปลง ID ไม่ตรงกับกุญแจ",
  "contacts.verify.choose_title": "คุณอยากตรวจสอบด้วยวิธีใด",
  "contacts.verify.choose_body":
    "ทั้งสองวิธียืนยันว่ากุญแจบนโทรศัพท์เครื่องนี้เป็นของ {name} จริง",
  "contacts.verify.method_scan": "สแกนรหัสของพวกเขา",
  "contacts.verify.method_scan_sub": "พวกเขาอยู่กับคุณตรงนี้",
  "contacts.verify.method_compare": "เทียบรหัส",
  "contacts.verify.method_compare_sub": "อ่านให้กันฟังระหว่างโทรคุย",
  "contacts.verify.no_keys":
    "ยังไม่มีกุญแจของผู้ติดต่อรายนี้ ส่งข้อความถึงพวกเขา หรือสแกนรหัสเมื่อได้เจอกัน",
  "contacts.verify.compare_title": "อ่านสิ่งเหล่านี้ให้กันฟัง",
  "contacts.verify.compare_body":
    "{name} เห็นคำหกคำเดียวกัน ถ้าตรงกัน คุณทั้งคู่ก็รู้ว่ากุญแจนั้นเป็นของจริง",
  "contacts.verify.codes_match": "ตรงกัน",
  "contacts.verify.codes_differ": "ไม่ตรงกัน",
  "contacts.verify.compared_body":
    "คุณและ {name} ยืนยันรหัสเดียวกันแล้ว ผู้ติดต่อรายนี้ได้รับการยืนยัน",

  // ---- Settings: shared chrome ----
  "settings.back": "กลับ",
  "settings.coming_soon": "เร็ว ๆ นี้",
  "settings.opens_externally": "{label}, เปิดนอกแอป",
  "settings.peer_id": "ID ของเพียร์",
  "settings.share_peer_id": "แชร์ ID ของเพียร์ของคุณ",
  "settings.share_id_short": "แชร์ ID",
  "settings.peer_id_sheet.title": "ID ของเพียร์ของคุณ",
  "settings.peer_id_sheet.copy": "คัดลอก ID ของเพียร์",
  "settings.peer_id_sheet.note":
    "วิธีนี้ใช้ได้เมื่อคุณทั้งคู่อยู่ในระยะบลูทูธเท่านั้น หากต้องการให้ใครส่งข้อความถึงคุณจากที่ไหนก็ได้ ให้แชร์คิวอาร์โค้ดของคุณแทน",

  // ---- Settings: hub rows ----
  "settings.section.general": "ทั่วไป",
  "settings.section.general_desc": "ฟีเจอร์เสริม เลิกทำการส่ง สื่อ รีเซ็ต",
  "settings.section.privacy": "ความเป็นส่วนตัวและความปลอดภัย",
  "settings.section.privacy_desc":
    "ฟอร์เวิร์ดซีเครซี แพ็กเก็ตที่ลงลายเซ็น เพียร์ที่ถูกบล็อก",
  "settings.section.network": "เครือข่ายและรีเลย์",
  "settings.section.network_desc":
    "การใช้อินเทอร์เน็ตสำรอง รีเลย์ nostr ความเข้ากันได้กับ bitchat",
  "settings.section.permissions": "สิทธิ์",
  "settings.section.permissions_desc":
    "บลูทูธ ตำแหน่ง การแจ้งเตือน กล้อง ไมโครโฟน",
  "settings.section.storage": "ที่จัดเก็บและข้อมูล",
  "settings.section.diagnostics": "การวินิจฉัย",

  // ---- Settings: group headings ----
  "settings.group.transports": "ช่องทางรับส่ง",
  "settings.group.nearby": "ใกล้เคียง",
  "settings.group.sync": "ซิงค์",
  "settings.group.features": "ฟีเจอร์",
  "settings.group.messages": "ข้อความ",
  "settings.group.media": "สื่อ",
  "settings.group.reset": "รีเซ็ต",
  "settings.group.always_on": "เปิดอยู่เสมอ",
  "settings.group.notifications": "การแจ้งเตือน",
  "settings.group.blocked": "ถูกบล็อก",
  "settings.group.theme": "ธีม",
  "settings.group.font": "แบบอักษร",
  "settings.group.language": "ภาษา",
  "settings.section.diagnostics_desc": "สถานะการเชื่อมต่อและอุปกรณ์ใกล้เคียง",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "ลิงก์บลูทูธ",
  "settings.diag.ble_links_desc":
    "อุปกรณ์ที่โทรศัพท์เครื่องนี้เชื่อมต่ออยู่โดยตรง",
  "settings.diag.lan": "เครือข่ายท้องถิ่น",
  "settings.diag.lan_desc": "โทรศัพท์บนเครือข่าย Wi-Fi เดียวกัน",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "จากโทรศัพท์ถึงโทรศัพท์ โดยไม่ต้องใช้เราเตอร์",
  "settings.diag.wifi_active": "กำลังทำงาน",
  "settings.diag.wifi_unsupported": "ไม่รองรับบนเครื่องนี้",
  "settings.diag.wifi_permission": "ถูกบล็อกด้วยสิทธิ์",
  "settings.diag.wifi_unavailable": "ใช้ไม่ได้ในขณะนี้",
  "settings.diag.wifi_unpaired": "ยังไม่ได้จับคู่",
  "settings.diag.wifi_unknown": "กำลังรอวิทยุ",
  "settings.diag.relays": "รีเลย์ Nostr",
  "settings.diag.relays_desc":
    "ใช้สำหรับช่องตำแหน่งและการเข้าถึงผ่านอินเทอร์เน็ต",
  "settings.diag.connected": "เชื่อมต่อแล้ว",
  "settings.diag.disconnected": "ไม่ได้เชื่อมต่อ",
  "settings.diag.peer_direct": "ลิงก์โดยตรง",
  "settings.diag.peer_relayed": "ได้ยินผ่านอุปกรณ์อื่น",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "ไม่มีค่าอ่านสัญญาณ",
  "settings.diag.no_peers": "ไม่มีใครอยู่ในระยะ",
  "settings.diag.no_peers_desc": "เปิดลิงก์วิทยุอยู่ {links} ลิงก์",
  "settings.diag.gcs_size": "ขนาดตัวกรอง",
  "settings.diag.gcs_size_desc": "ตัวกรองซิงค์ที่ใหญ่ที่สุดที่ส่งออกอากาศ",
  "settings.diag.fpr": "อัตราผลบวกลวง",
  "settings.diag.fpr_desc": "ความถี่ที่ตัวกรองอ้างว่ามีแพ็กเก็ตที่เราไม่มี",
  "settings.diag.bytes": "{n} ไบต์",
  "settings.diag.footnote":
    "ที่นี่เปลี่ยนอะไรไม่ได้ ค่าเหล่านี้ถูกกำหนดตายตัวเพื่อให้ Airhop ยังเข้ากันได้กับ bitchat",
  "settings.section.storage_desc": "การใช้งานและแคช",
  "settings.section.appearance": "รูปลักษณ์",
  "settings.section.appearance_desc": "ธีม แบบอักษร และภาษา",
  "settings.section.help": "ความช่วยเหลือและข้อเสนอแนะ",
  "settings.section.help_desc":
    "ติดต่อเรา รายงานข้อบกพร่อง หรืออ่านคำถามที่พบบ่อย",
  "settings.section.support": "สนับสนุน",
  "settings.section.support_desc": "ช่วยให้การพัฒนาดำเนินต่อไป",
  "settings.section.about": "เกี่ยวกับ",
  "settings.section.about_desc": "เวอร์ชัน บันทึกการเปลี่ยนแปลง และซอร์ส",

  // ---- Settings: general ----
  "settings.general.undo": "เลิกทำการส่ง",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "กระเป๋าเงิน",
  "settings.general.undo_seconds": "{count} วินาที",
  "settings.general.undo_a11y": "เลิกทำการส่ง: {value}",
  "settings.general.quality_a11y": "ตั้งคุณภาพการอัปโหลดเป็น {value}",
  "settings.general.undo_desc":
    "หน่วงข้อความที่ส่งไว้ครู่หนึ่งเพื่อให้คุณดึงกลับได้ก่อนที่มันจะออกไป",
  "settings.general.undo_off_desc": "ส่งทันที ไม่มีการเลิกทำ",
  "settings.general.undo_2": "2 วินาที",
  "settings.general.undo_2_desc": "โอกาสสั้น ๆ ที่จะดึงกลับ",
  "settings.general.undo_10": "10 วินาที",
  "settings.general.undo_10_desc": "ช่วงเวลาที่ยาวที่สุด",
  "settings.general.quality": "คุณภาพการอัปโหลด",
  "settings.general.quality_desc":
    "ใช้กับรูปภาพที่ส่งจากกล้องหรือคลังภาพของคุณ ไม่ว่าทางใดรูปทุกรูปจะถูกปรับให้พอดีกับเมช",
  "settings.general.quality_low": "ต่ำ",
  "settings.general.quality_low_desc": "รูปเล็กที่สุด ส่งเร็วที่สุด",
  "settings.general.quality_medium": "ปานกลาง",
  "settings.general.quality_medium_desc": "สมดุลระหว่างรายละเอียดกับความเร็ว",
  "settings.general.quality_high": "สูง",
  "settings.general.quality_high_desc": "เก็บรายละเอียดไว้มากที่สุด",
  "settings.general.feature_wallet_desc":
    "ส่ง Cashu ecash จากเครื่องถึงเครื่องผ่านเมช",
  "settings.general.feature_wallet_a11y": "กระเป๋าเงิน (เปิดอยู่เสมอ)",
  "settings.general.feature_ai_desc":
    "ผู้ช่วยส่วนตัวที่ทำงานในเครื่อง ไม่มีการเรียกผ่านเครือข่าย",
  "settings.general.feature_feeds": "ฟีด",
  "settings.general.feature_feeds_desc":
    "อ่านและโพสต์ไปยังฟีด Bluesky และ Mastodon",
  "settings.general.show_media": "แสดงสื่อโดยอัตโนมัติ",
  "settings.general.show_media_desc":
    "รูปภาพและวิดีโอปรากฏในแชท หรือซ่อนไว้หลังการแตะ",
  "settings.general.reset": "รีเซ็ตการตั้งค่า",
  "settings.general.media_retention": "เก็บสื่อไว้เป็นเวลา",
  "settings.general.media_retention_desc":
    "รูปภาพ วิดีโอ และข้อความเสียงจะถูกลบหลังจากเวลาที่เลือก",
  "settings.general.media_retention_sheet":
    "เลือกว่าสื่อจะอยู่บนเครื่องนี้นานเท่าใด สื่อที่ถูกลบแล้วกู้คืนไม่ได้",
  "settings.general.retention_7_desc":
    "ทิ้งร่องรอยไว้น้อยที่สุด ดีที่สุดหากความเสี่ยงคือตัวโทรศัพท์เอง",
  "settings.general.retention_14_desc":
    "ทางสายกลางสำหรับช่วงหนึ่งถึงสองสัปดาห์ที่ห่างจากสัญญาณ",
  "settings.general.retention_30_desc":
    "ทำให้อ่านบทสนทนาย้อนหลังได้นานที่สุด และกินพื้นที่มากที่สุด",
  "settings.general.reset_desc":
    "คืนทุกการตั้งค่ากลับเป็นค่าเริ่มต้น โดยไม่แตะต้องตัวตน ข้อความ ผู้ติดต่อ และกระเป๋าเงินของคุณ",
  "settings.general.reset_title": "รีเซ็ตการตั้งค่าหรือไม่",
  "settings.general.reset_body":
    "ทุกการตั้งค่าจะกลับเป็นค่าเริ่มต้น ทั้งรูปลักษณ์ การเลิกทำการส่ง และการเชื่อมต่อ (อินเทอร์เน็ต Tor เกตเวย์ บริดจ์ รีเลย์) ตัวตน ข้อความ ผู้ติดต่อ และกระเป๋าเงินของคุณจะไม่ถูกแตะต้อง",
  "settings.general.reset_confirm": "รีเซ็ต",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "ฟอร์เวิร์ดซีเครซี",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet เปิดอยู่เสมอสำหรับข้อความโดยตรง",
  "settings.security.signed_packets": "แพ็กเก็ตที่ลงลายเซ็น",
  "settings.security.signed_packets_desc": "ทุกแพ็กเก็ตลงลายเซ็นด้วย Ed25519",
  "settings.security.hide_previews": "ซ่อนตัวอย่างในการแจ้งเตือน",
  "settings.security.hide_previews_desc":
    "ไม่ให้ชื่อผู้ส่งและข้อความปรากฏบนหน้าจอล็อก ซึ่งแสดงสิ่งเหล่านั้นโดยไม่ต้องปลดล็อก",
  "settings.security.no_blocked": "ไม่มีเพียร์ที่ถูกบล็อก",
  "settings.security.no_blocked_desc":
    "เพียร์ที่ถูกบล็อกส่งข้อความถึงคุณไม่ได้และไม่ปรากฏบนแท็บเมช",
  "settings.security.unblock_title": "เลิกบล็อกเพียร์นี้",
  "settings.security.unblock": "เลิกบล็อก",
  "settings.security.unblock_peer": "เลิกบล็อก {name}",
  "settings.security.unblock_body":
    "{name} จะส่งข้อความถึงคุณได้อีกครั้ง และจะปรากฏบนแท็บเมชเมื่ออยู่ใกล้",

  // ---- Settings: network and relays ----
  "settings.network.internet": "อินเทอร์เน็ตสำรอง",
  "settings.network.internet_desc":
    "ใช้รีเลย์ Nostr ต่อไปเมื่อเพียร์บนเมชอยู่นอกระยะ",
  "settings.network.internet_off_title": "ปิดอินเทอร์เน็ตหรือไม่",
  "settings.network.internet_off_body":
    "Airhop จะทำงานผ่านบลูทูธเท่านั้น มันจะหยุดติดต่อรีเลย์ Nostr ทั้งหมด และ Tor เกตเวย์อินเทอร์เน็ต กับบริดจ์เมชจะปิดทั้งหมด แชทบลูทูธในบริเวณใกล้เคียงยังทำงานอยู่",
  "settings.network.turn_off": "ปิด",
  "settings.network.discovery": "การค้นหารีเลย์ตามพิกัด",
  "settings.network.discovery_desc":
    "เลือกรีเลย์ที่ใกล้ที่สุดสำหรับเซลล์ตำแหน่งโดยอัตโนมัติ จากรีเลย์แบบกระจายกว่า 300 แห่ง",
  "settings.network.discovery_needs_relay": "เพิ่มรีเลย์ของคุณเองก่อน",
  "settings.network.discovery_needs_relay_body":
    "การค้นหาอัตโนมัติคือสิ่งที่ชี้ให้ Airhop ไปยังรีเลย์ที่ใกล้ที่สุด การปิดมันจะสมเหตุสมผลก็ต่อเมื่อคุณกำหนดรีเลย์ของคุณเองไว้ด้านล่างแล้ว จึงควรเพิ่มอย่างน้อยหนึ่งแห่งก่อน",
  "settings.network.custom_only_title": "ใช้เฉพาะรีเลย์ของคุณเองหรือไม่",
  "settings.network.custom_only_body":
    "ช่องตำแหน่งและบริดจ์เมชจะหยุดเลือกรีเลย์ที่ใกล้ที่สุดโดยอัตโนมัติ และใช้เฉพาะรีเลย์ที่คุณเพิ่มไว้ สิ่งนี้อาจลดการเข้าถึง และคุณอาจไม่ได้เจอผู้ใช้ bitchat ซึ่งมารวมกันอยู่ที่รีเลย์ที่ใกล้ที่สุด",
  "settings.network.custom": "รีเลย์ของคุณเอง",
  "settings.network.custom_desc":
    "เพิ่มรีเลย์ของคุณเองสำหรับช่องตำแหน่งและบริดจ์เมช",
  "settings.network.custom_added": "เพิ่มแล้ว {count} จาก {max}",
  "settings.network.dm_relays": "รีเลย์ข้อความ",
  "settings.network.dm_relays_desc":
    "ข้อความโดยตรงและช่องส่วนตัวใช้รีเลย์เหล่านี้เสมอ รีเลย์ของคุณเองไม่เปลี่ยนแปลงสิ่งนี้",
  "settings.network.discovery_back_on": "เปิดการค้นหารีเลย์ตามพิกัดอีกครั้ง",
  "settings.network.discovery_back_on_body":
    "นั่นเป็นรีเลย์ของคุณเองแห่งสุดท้าย ช่องตำแหน่งต้องมีที่สำหรับเผยแพร่ Airhop จึงกลับมาเลือกรีเลย์ที่ใกล้ที่สุดโดยอัตโนมัติอีกครั้ง",
  "settings.network.add_relay": "เพิ่มรีเลย์",
  "settings.network.remove_relay": "นำ {url} ออก",
  "settings.network.add_short": "เพิ่ม",
  "settings.network.relay_limit":
    "คุณเพิ่มรีเลย์ได้ {count} แห่ง นำออกหนึ่งแห่งเพื่อเพิ่มอีกแห่ง",
  "settings.network.relay_duplicate": "รีเลย์นั้นอยู่ในรายการของคุณแล้ว",
  "settings.network.relay_invalid":
    "ใส่โฮสต์รีเลย์ที่ถูกต้อง เช่น relay.example.com พอร์ตจำเป็นเมื่อรีเลย์ไม่ได้ใช้ค่าเริ่มต้นเท่านั้น ไม่อนุญาตให้ใช้ที่อยู่ IP และชื่อภายในเครือข่าย",
  "settings.network.wifi_pair": "การจับคู่",
  "settings.network.wifi_paired": "อุปกรณ์ที่จับคู่แล้ว",
  "settings.network.wifi_pair_find": "ค้นหาอุปกรณ์",
  "settings.network.wifi_pair_find_desc":
    "มองหา iPhone ที่อยู่ใกล้เคียงซึ่งกำลังแสดงตัว ทั้งสองเครื่องต้องใช้ iOS 26 ขึ้นไป",
  "settings.network.wifi_pair_show": "แสดง iPhone เครื่องนี้",
  "settings.network.wifi_pair_show_desc":
    "ให้ iPhone ที่อยู่ใกล้เคียงค้นหาเครื่องนี้ คนหนึ่งค้นหา อีกคนแสดงตัว ในเวลาเดียวกัน",
  "settings.network.wifi_pair_find_action": "เลือก iPhone ที่อยู่ใกล้เคียง",
  "settings.network.wifi_pair_show_action": "ทำให้ iPhone เครื่องนี้ค้นพบได้",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware ไม่พร้อมใช้งานในขณะนี้",
  "settings.network.wifi_pair_forget": "ลบการจับคู่ในแอป Settings",
  "settings.network.bitchat": "ความเข้ากันได้กับ bitchat",
  "settings.network.bitchat_desc":
    "เมช BLE เดียวกันกับ bitchat ทำงานร่วมกันได้อย่างสมบูรณ์ สิ่งนี้เปิดอยู่เสมอและปิดไม่ได้",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "ทำงานเบื้องหลัง",
  "settings.conn.background_desc": "ให้เมชทำงานต่อเมื่อปิด Airhop แล้ว",
  "settings.conn.background_on_title": "ให้เมชทำงานต่อหรือไม่",
  "settings.conn.background_on_body":
    "Airhop จะส่งต่อและรับข้อความต่อไปเมื่อถูกปิด เพื่อให้ข้อความมาถึงขณะที่คุณไม่อยู่ Android จะแสดงการแจ้งเตือนค้างไว้ระหว่างนั้น",
  "settings.conn.background_off_title": "หยุดเมชเมื่อปิด Airhop หรือไม่",
  "settings.conn.background_off_body":
    "ข้อความจะมาถึงเฉพาะตอนที่ Airhop เปิดอยู่ และโทรศัพท์เครื่องนี้จะหยุดส่งต่อให้ผู้คนที่อยู่ใกล้ การแจ้งเตือนค้างจะหายไป",
  "settings.conn.live_voice": "เสียงสด",
  "settings.conn.live_voice_desc": "คุยกับคนใกล้เคียงเหมือนวิทยุสื่อสาร",
  "settings.conn.live_voice_on_title": "เปิดเสียงสดหรือไม่",
  "settings.conn.live_voice_on_body":
    "การกดไมค์ค้างไว้จะส่งเสียงของคุณไปยังทุกคนในระยะบลูทูธขณะที่คุณพูด และเสียงของพวกเขาจะดังบนโทรศัพท์ของคุณ ไม่มีการบันทึกใด ๆ",
  "settings.conn.live_voice_off_title": "ปิดเสียงสดหรือไม่",
  "settings.conn.live_voice_off_body":
    "การกดไมค์ค้างไว้จะบันทึกเป็นข้อความเสียงแทน มันจะถูกส่งเมื่อคุณปล่อย และไม่มีใครได้ยินจนกว่าจะกดเล่น",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "การกำหนดเส้นทางผ่าน Tor",
  "settings.conn.tor_desc":
    "ส่งการรับส่งข้อมูล Nostr ผ่าน Tor เพื่อความเป็นส่วนตัวเพิ่มเติม",
  "settings.conn.tor_on_title": "ส่งการรับส่งข้อมูล Nostr ผ่าน Tor หรือไม่",
  "settings.conn.tor_on_body":
    "รีเลย์จะไม่เห็นที่อยู่ IP ของคุณอีกต่อไป การเชื่อมต่อจะใช้เวลานานขึ้นและข้อความจะมาถึงช้าลง บลูทูธไม่ได้รับผลกระทบ",
  "settings.conn.tor_off_title": "ปิดการกำหนดเส้นทางผ่าน Tor หรือไม่",
  "settings.conn.tor_off_body":
    "การรับส่งข้อมูล Nostr จะกลับไปใช้การเชื่อมต่อปกติของคุณ รีเลย์จึงเห็นที่อยู่ IP ของคุณอีกครั้ง ไม่ว่าทางใดบลูทูธก็ไม่ได้รับผลกระทบ",
  "settings.conn.tor_orbot_idle":
    "ติดตั้ง Orbot แล้วแต่ยังไม่ได้เชื่อมต่อ เปิด Orbot เริ่ม VPN ของมัน แล้วจึงเปิดสิ่งนี้",
  "settings.conn.tor_unavailable":
    "การกำหนดเส้นทางผ่าน Tor ใช้ไม่ได้ในบิลด์นี้",
  "settings.conn.tor_timeout":
    "Tor ใช้เวลาเชื่อมต่อนานกว่าหนึ่งนาที มันยังเปิดอยู่และพยายามต่อไป แท็บเมชจะบอกเมื่อมันกำหนดเส้นทางได้แล้ว หรือเมื่อเครือข่ายนี้กำลังบล็อกมันอยู่",
  "settings.conn.tor_failed":
    "เริ่ม Tor ไม่สำเร็จ ตรวจสอบว่าแอปเข้าถึงเครือข่ายได้",
  "settings.conn.mint_clearnet":
    "อนุญาตการรับส่งข้อมูลกับมินต์ผ่านเครือข่ายเปิด",
  "settings.conn.mint_clearnet_desc":
    "Tor บน iOS ครอบคลุมเฉพาะ Nostr ปล่อยไว้ปิดเพื่อบล็อกคำขอไปยังมินต์ ไม่ว่าทางใด ecash ผ่านเมชก็ยังทำงานอยู่",
  "settings.conn.gateway": "เกตเวย์อินเทอร์เน็ต",
  "settings.conn.gateway_desc":
    "ให้ยืมการเชื่อมต่อของคุณแก่โทรศัพท์ออฟไลน์ที่อยู่ใกล้ เพื่อให้เครื่องนั้นยังเข้าถึงช่องตำแหน่งได้",
  "settings.conn.gateway_on_title": "เปิดเกตเวย์อินเทอร์เน็ตหรือไม่",
  "settings.conn.gateway_on_body":
    "โทรศัพท์ใกล้เคียงที่ไม่มีการเชื่อมต่อของตัวเองจะส่งและรับข้อความในช่องตำแหน่งผ่านเครื่องของคุณ สิ่งนี้ใช้เน็ตมือถือและแบตเตอรี่ของคุณ และข้อความของพวกเขายังเข้ารหัสจากต้นทางถึงปลายทาง คุณจึงอ่านสิ่งที่ผ่านไปไม่ได้",
  "settings.conn.gateway_off_title": "ปิดเกตเวย์อินเทอร์เน็ตหรือไม่",
  "settings.conn.gateway_off_body":
    "โทรศัพท์ออฟไลน์ที่อยู่ใกล้จะหยุดเข้าถึงช่องตำแหน่งผ่านเครื่องของคุณ ข้อความของคุณเองไม่ได้รับผลกระทบ",
  "settings.conn.bridge": "บริดจ์เมช",
  "settings.conn.bridge_desc":
    "เชื่อมแชท #bluetooth สาธารณะของพื้นที่นี้กับกลุ่มบลูทูธอีกกลุ่มที่อยู่นอกระยะผ่านอินเทอร์เน็ต",
  "settings.conn.bridge_on_title": "เปิดบริดจ์เมชหรือไม่",
  "settings.conn.bridge_on_body":
    "ข้อความ #bluetooth สาธารณะของคุณจะถูกเผยแพร่ไปยังย่านของคุณผ่านอินเทอร์เน็ต ผู้คนที่อยู่นอกระยะบลูทูธจึงอ่านได้ ข้อความส่วนตัวจะไม่ถูกเชื่อมข้ามเลย และ “เฉพาะบริเวณใกล้เคียง” ทำให้ข้อความใดข้อความหนึ่งอยู่ในพื้นที่เท่านั้น",
  "settings.conn.bridge_off_title": "ปิดบริดจ์เมชหรือไม่",
  "settings.conn.bridge_off_body":
    "ข้อความ #bluetooth สาธารณะของคุณจะกลับมาอยู่ในระยะบลูทูธอีกครั้ง และข้อความจากกลุ่มที่เชื่อมไว้จะหยุดเข้ามาที่นี่",
  "settings.conn.bridge_needs_location": "บริดจ์เมชต้องใช้ตำแหน่ง",
  "settings.conn.bridge_needs_location_desc":
    "มันหาย่านของคุณจากค่าพิกัดที่ได้ ให้สิทธิ์ตำแหน่งเพื่อเริ่มเชื่อมบริดจ์",
  "settings.conn.grant_location": "ให้สิทธิ์ตำแหน่ง",
  "settings.conn.grant_short": "ให้สิทธิ์",
  "settings.conn.orbot_body":
    "Airhop ส่งการรับส่งข้อมูล Tor ผ่าน Orbot ติดตั้งและเปิดใช้ Orbot จาก Play Store แล้วจึงเปิดสิ่งนี้",
  "settings.conn.internet_off": "อินเทอร์เน็ตปิดอยู่",
  "settings.conn.internet_off_desc":
    "Tor บริดจ์ และเกตเวย์ล้วนใช้อินเทอร์เน็ต เปิดอินเทอร์เน็ตสำรองใต้หัวข้อเครือข่ายเพื่อใช้งานสิ่งเหล่านี้",
  "settings.conn.turn_on": "เปิด",
  "settings.conn.turn_off": "ปิด",
  "settings.conn.orbot_title": "Tor บน Android",
  "settings.conn.get_orbot": "ดาวน์โหลด Orbot",
  "settings.conn.later": "ไว้ทีหลัง",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "บลูทูธ",
  "settings.permissions.bluetooth_desc":
    "ค้นหาอุปกรณ์ใกล้เคียงและส่งต่อข้อความระหว่างกัน หากไม่มีสิ่งนี้ เมชก็ทำงานไม่ได้",
  "settings.permissions.location": "ตำแหน่ง",
  "settings.permissions.location_desc":
    "เปิดช่องพื้นที่ใกล้เคียง หากไม่มีสิ่งนี้ ช่องเหล่านั้นจะปิดอยู่ และเมชบลูทูธยังทำงานตามปกติ",
  "settings.permissions.notifications": "การแจ้งเตือน",
  "settings.permissions.notifications_desc":
    "รับการแจ้งเตือนข้อความใหม่แม้ในขณะที่ปิดแอปอยู่ หากไม่มีสิ่งนี้ คุณจะเห็นข้อความเมื่อเปิด Airhop เท่านั้น",
  "settings.permissions.camera": "กล้อง",
  "settings.permissions.camera_desc":
    "สแกนคิวอาร์โค้ดและถ่ายรูปหรือวิดีโอเพื่อส่ง หากไม่มีสิ่งนี้ คุณยังแชร์สื่อจากคลังภาพได้",
  "settings.permissions.photos": "รูปภาพ",
  "settings.permissions.photos_desc":
    "ส่งรูปภาพจากคลังภาพของคุณและบันทึกสื่อที่ได้รับ หากไม่มีสิ่งนี้ คุณยังถ่ายและส่งรูปใหม่ด้วยกล้องได้",
  "settings.permissions.microphone": "ไมโครโฟน",
  "settings.permissions.microphone_desc":
    "บันทึกและส่งข้อความเสียงหรือใช้เสียงสด หากไม่มีสิ่งนี้ ข้อความเสียงและเสียงสดจะใช้ไม่ได้",
  "settings.permissions.allow": "อนุญาตสิทธิ์นี้",
  "settings.permissions.open_settings":
    "เปิดการตั้งค่าระบบเพื่อเปลี่ยนสิทธิ์นี้",
  "settings.permissions.system": "ระบบ",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "การใช้เครือข่าย",
  "settings.storage.storage_usage": "การใช้ที่จัดเก็บ",
  "settings.storage.storage_usage_desc":
    "ข้อความ พรูฟในกระเป๋าเงิน และไฟล์แนบที่แคชไว้",
  "settings.storage.session_usage": "เซสชันนี้ · ส่ง {sent} รับ {received}",
  "settings.storage.cache": "แคช",
  "settings.storage.cache_desc": "ไฟล์แนบ {size}",
  "settings.storage.clear_cache": "ล้างแคชไฟล์แนบ",
  "settings.storage.clear": "ล้าง",
  "settings.storage.clear_title": "ล้างสื่อที่แคชไว้หรือไม่",
  "settings.storage.clear_body":
    "รูปภาพ วิดีโอ ข้อความเสียง และไฟล์จะถูกนำออกจากเครื่องนี้ ทั้งที่ส่งและที่ได้รับ ไฟล์เหล่านั้นดาวน์โหลดใหม่ไม่ได้ กล่องข้อความของมันจะบอกไว้ และคุณขอให้ผู้ส่งส่งมาใหม่ได้ ข้อความและกระเป๋าเงินจะไม่ถูกแตะต้อง",
  "settings.storage.cleared": "ล้างแคชแล้ว",
  "settings.storage.freed": "คืนพื้นที่ได้ {size}",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "ตั้งรูปลักษณ์เป็น {value}",
  "settings.font.set_a11y": "ตั้งแบบอักษรความกว้างคงที่เป็น {value}",
  "settings.font.system": "ระบบ",
  "settings.font.system_desc": "ใช้แบบอักษรความกว้างคงที่เริ่มต้นของเครื่องคุณ",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "ทันสมัยและอ่านง่าย",
  "settings.language.en": "อังกฤษ",
  "settings.language.am": "อัมฮารา",
  "settings.language.ar": "อาหรับ",
  "settings.language.bn": "เบงกาลี",
  "settings.language.my": "พม่า",
  "settings.language.zh_hans": "จีน (ตัวย่อ)",
  "settings.language.zh_hant": "จีน (ตัวเต็ม)",
  "settings.language.nl": "ดัตช์",
  "settings.language.fil": "ฟิลิปปินส์",
  "settings.language.fr": "ฝรั่งเศส",
  "settings.language.ka": "จอร์เจีย",
  "settings.language.de": "เยอรมัน",
  "settings.language.hi": "ฮินดี",
  "settings.language.id": "อินโดนีเซีย",
  "settings.language.it": "อิตาลี",
  "settings.language.ja": "ญี่ปุ่น",
  "settings.language.ko": "เกาหลี",
  "settings.language.mg": "มาลากาซี",
  "settings.language.ms": "มาเลย์",
  "settings.language.ne": "เนปาล",
  "settings.language.fa": "เปอร์เซีย",
  "settings.language.pl": "โปแลนด์",
  "settings.language.pt_br": "โปรตุเกส (บราซิล)",
  "settings.language.pt_pt": "โปรตุเกส (โปรตุเกส)",
  "settings.language.pa": "ปัญจาบ",
  "settings.language.ru": "รัสเซีย",
  "settings.language.es": "สเปน",
  "settings.language.sw": "สวาฮีลี",
  "settings.language.sv": "สวีเดน",
  "settings.language.ta": "ทมิฬ",
  "settings.language.th": "ไทย",
  "settings.language.tr": "ตุรกี",
  "settings.language.uk": "ยูเครน",
  "settings.language.ur": "อูรดู",
  "settings.language.vi": "เวียดนาม",
  "settings.language.pseudo": "ภาษาจำลอง",
  "settings.language.soon": "เร็ว ๆ นี้",
  "settings.language.soon_a11y": "{value}, เร็ว ๆ นี้",
  "settings.language.set_a11y": "ตั้งภาษาเป็น {value}",
  "settings.language.pending": "เมื่อเปิดครั้งถัดไป",
  "settings.language.pending_a11y":
    "{value}, จะมีผลเมื่อคุณเปิด Airhop ครั้งถัดไป",
  "settings.language.rtl_title": "เปิด Airhop ใหม่เพื่อให้เสร็จสมบูรณ์",
  "settings.language.rtl_body":
    "{value} อ่านจากขวาไปซ้าย และ Airhop เปลี่ยนทิศทางได้เฉพาะตอนเริ่มทำงานเท่านั้น ปิดแล้วเปิดใหม่เพื่อสลับให้เสร็จ ไม่มีอะไรสูญหาย และเมชของคุณยังเชื่อมต่ออยู่จนกว่าคุณจะทำ",
  "settings.theme.light": "สว่าง",
  "settings.theme.light_desc": "ใช้ชุดสีสว่างเสมอ",
  "settings.theme.dark": "มืด",
  "settings.theme.dark_desc": "ใช้ชุดสีมืดเสมอ",

  // ---- Settings: profile and identity ----
  "settings.status.online": "ออนไลน์",
  "settings.status.online_desc": "ถูกค้นพบได้ ทั้งประกาศตัวและสแกน",
  "settings.status.away": "ไม่อยู่",
  "settings.status.away_desc": "เมชหยุดชั่วคราว ไม่สแกนและไม่ประกาศตัว",
  "settings.status.invisible": "ล่องหน",
  "settings.status.invisible_desc": "สแกนอยู่ แต่ซ่อนจากการค้นพบ",
  "settings.status.title": "สถานะ",
  "settings.status.set_a11y": "ตั้งสถานะเป็น {value}",
  "settings.status.edit": "แก้ไขสถานะ",
  "settings.status.desc": "เลือกว่าคุณจะปรากฏบนเมชมากน้อยเพียงใด",
  "settings.transfer.identity": "ตัวตนและกุญแจ",
  "settings.transfer.identity_desc":
    "ID ของเพียร์ ชื่อผู้ใช้ และผู้ติดต่อของคุณ",
  "settings.transfer.chats": "แชทและประวัติ",
  "settings.transfer.chats_desc": "บทสนทนา กลุ่ม และช่องที่คุณเข้าร่วม",
  "settings.transfer.wallet": "ยอดในกระเป๋าเงิน",
  "settings.transfer.wallet_desc": "พรูฟ Cashu และประวัติธุรกรรม",
  "settings.transfer.title": "ย้ายไปยังโทรศัพท์เครื่องใหม่",
  "settings.transfer.desc": "ย้ายตัวตน แชท และกระเป๋าเงินของคุณไปยังอีกเครื่อง",
  "settings.transfer.coming_soon_a11y":
    "ย้ายไปยังโทรศัพท์เครื่องใหม่ เร็ว ๆ นี้",
  "settings.transfer.body":
    "วางโทรศัพท์ทั้งสองเครื่องไว้ด้วยกันแล้วย้ายทุกอย่างผ่านบลูทูธ ไม่มีสิ่งใดผ่านเซิร์ฟเวอร์ จึงใช้งานได้โดยไม่ต้องมีอินเทอร์เน็ต",
  "settings.qr.permission_label": "การเข้าถึงรูปภาพ",
  "settings.qr.permission_purpose": "บันทึกคิวอาร์โค้ดของคุณ",
  "settings.qr.saved": "บันทึกแล้ว",
  "settings.qr.saved_body": "บันทึกคิวอาร์โค้ดลงในคลังภาพของคุณแล้ว",
  "settings.qr.save_failed": "บันทึกไม่สำเร็จ",
  "settings.qr.save_failed_body": "บันทึกคิวอาร์โค้ดไม่สำเร็จ ลองอีกครั้ง",
  "settings.qr.share_message": "เพิ่มฉันบน Airhop",
  "settings.qr.share_body":
    "เพิ่มฉันบน Airhop — แชทผ่านเมชแบบส่วนตัวที่เน้นการใช้งานออฟไลน์",
  "settings.qr.show_short": "แสดง QR",
  "settings.qr.title": "คิวอาร์โค้ดของคุณ",
  "settings.qr.note":
    "สิ่งนี้บรรจุกุญแจสาธารณะของคุณ ซึ่งทำให้คนอื่นส่งข้อความถึงคุณจากที่ไหนก็ได้ แชร์กับคนที่คุณไว้ใจเท่านั้น มันจะไม่เปลี่ยนเว้นแต่คุณจะล้างตัวตนของตัวเอง",
  "settings.qr.code_label": "รหัสผู้ติดต่อ",
  "settings.qr.copy_code": "คัดลอกรหัสผู้ติดต่อ",
  "settings.qr.share": "แชร์คิวอาร์โค้ด",
  "settings.qr.share_short": "แชร์ QR",
  "settings.qr.download": "ดาวน์โหลดคิวอาร์โค้ด",
  "settings.qr.download_short": "ดาวน์โหลด QR",
  "settings.qr.show": "แสดงคิวอาร์โค้ด",
  "settings.wipe.trigger": "สั่งล้างข้อมูลฉุกเฉิน",
  "settings.wipe.trigger_desc": "แตะสามครั้งเพื่อล้างทันทีโดยไม่ต้องยืนยัน",
  "settings.wipe.title": "ล้างข้อมูลฉุกเฉิน",
  "settings.wipe.now": "ล้างเดี๋ยวนี้",
  "settings.wipe.desc": "ทำลายกุญแจ ข้อความ และพรูฟทั้งหมดทันที",
  "settings.wipe.body":
    "สิ่งนี้จะทำลายกุญแจ ข้อความ และพรูฟในกระเป๋าเงินทั้งหมดของคุณทันที และย้อนกลับไม่ได้",
  "settings.wipe.in_progress": "กำลังล้าง",
  "settings.wipe.in_progress_body":
    "กำลังทำลายกุญแจ ข้อความ และไฟล์ของคุณ ใช้เวลาไม่กี่วินาที และจะทำจนเสร็จเองแม้ปิดแอปไปแล้ว",
  "settings.wipe.got_it": "เข้าใจแล้ว",
  "settings.wipe.keys_failed": "ทำลายกุญแจไม่สำเร็จ",
  "settings.wipe.keys_failed_body":
    "ข้อความ ผู้ติดต่อ และกระเป๋าเงินของคุณหายไปแล้ว แต่เครื่องปฏิเสธที่จะปล่อยกุญแจของคุณ ปลดล็อกเครื่องแล้วล้างอีกครั้ง",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "ติดต่อเรา",
  "settings.help.contact_a11y": "ส่งอีเมลถึง {address}",
  "settings.help.bug": "รายงานข้อบกพร่อง",
  "settings.help.bug_desc": "เปิด issue บน GitHub",
  "settings.help.bug_a11y": "รายงานข้อบกพร่องบน GitHub",
  "settings.help.faq": "คำถามที่พบบ่อย",
  "settings.help.faq_desc": "คำตอบสำหรับคำถามทั่วไป",
  "settings.help.faq_a11y": "เปิดคำถามที่พบบ่อย",
  "settings.help.terms_desc": "Airhop ใช้งานได้อย่างไรบ้าง",
  "settings.help.terms_a11y": "เปิดข้อกำหนดในการให้บริการ",
  "settings.help.privacy_desc": "สิ่งที่เราไม่เก็บ",
  "settings.help.privacy_a11y": "เปิดนโยบายความเป็นส่วนตัว",

  // ---- Settings: support ----
  "settings.support.card": "บัตรหรือ UPI",
  "settings.support.card_desc": "เน็ตแบงกิงและกระเป๋าเงินดิจิทัล ทั่วโลก",
  "settings.support.card_a11y":
    "สนับสนุนด้วยบัตร UPI เน็ตแบงกิง หรือกระเป๋าเงินดิจิทัล",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "รายเดือนหรือครั้งเดียว ไม่มีค่าธรรมเนียมแพลตฟอร์ม",
  "settings.support.sponsors_a11y": "สนับสนุนผ่าน GitHub Sponsors",
  "settings.support.note":
    "ผมสร้าง Airhop ในเวลาว่าง ไม่มีนักลงทุนและไม่มีโฆษณา หากมันมีประโยชน์กับคุณ การสนับสนุนจะช่วยให้การพัฒนาดำเนินต่อไปได้อีกยาว ไม่ว่าทางใดทุกฟีเจอร์ก็ยังคงใช้ฟรี",

  // ---- Settings: about and version ----
  "settings.about.version": "เวอร์ชัน",
  "settings.about.version_desc": "รุ่นปัจจุบัน",
  "settings.about.version_a11y": "ดูเวอร์ชันและตรวจหาการอัปเดต",
  "settings.about.release_notes": "บันทึกประจำรุ่น",
  "settings.about.release_notes_desc": "มีอะไรใหม่ในรุ่นล่าสุด",
  "settings.about.release_notes_a11y": "เปิดบันทึกประจำรุ่นล่าสุดบน GitHub",
  "settings.about.source": "ซอร์สโค้ด",
  "settings.about.source_a11y": "เปิดซอร์สโค้ดบน GitHub",
  "settings.about.licenses": "สัญญาอนุญาตโอเพนซอร์ส",
  "settings.about.open_repo": "เปิดที่เก็บโค้ด {name}",
  "settings.about.licenses_desc": "แพ็กเกจโอเพนซอร์สของบุคคลที่สาม",
  "settings.about.licenses_a11y": "ดูสัญญาอนุญาตของบุคคลที่สาม",
  "settings.version.codename": "ชื่อรหัส",
  "settings.version.checking": "กำลังตรวจสอบ",
  "settings.version.check": "ตรวจหาการอัปเดต",
  "settings.version.checking_title": "กำลังตรวจหาการอัปเดต",
  "settings.version.up_to_date": "คุณใช้เวอร์ชันล่าสุดอยู่แล้ว",
  "settings.version.release_notes": "ดูบันทึกประจำรุ่น",
  "settings.version.made_with": "สร้างด้วย",
  "settings.version.number": "เวอร์ชัน {version}",
  "settings.version.update_to": "อัปเดตเป็น {version}",
  "settings.version.update_to_a11y": "อัปเดตเป็นเวอร์ชัน {version}",
  "settings.version.released_under": "เผยแพร่ภายใต้ {license}",
  "settings.version.notes_a11y": "ดูบันทึกประจำรุ่นสำหรับเวอร์ชัน {version}",
  "settings.version.tor_paused":
    "การตรวจหาการอัปเดตหยุดไว้ขณะที่ Tor เปิดอยู่ เพื่อไม่ให้ IP ของคุณรั่วไหล ดูหน้ารุ่นเผยแพร่ในเบราว์เซอร์แทน",
  "settings.version.check_failed":
    "ตรวจหาการอัปเดตไม่สำเร็จ ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง",
  "settings.version.downloading": "กำลังดาวน์โหลด {percent}%",
  "settings.version.install": "ติดตั้ง",
  "settings.version.download_failed":
    "ดาวน์โหลดไม่สำเร็จ ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} มีขนาด {size} KiB เกินขีดจำกัด {cap} KiB",
  "transfer.failed.malformed":
    "ไฟล์แนบมาถึงในสภาพเสียหายและเปิดไม่ได้ ขอให้พวกเขาส่งมาใหม่",
  "transfer.failed.unsupported_type": "ไฟล์แนบมาถึงในรูปแบบที่แอปนี้เปิดไม่ได้",
  "transfer.failed.type_mismatch":
    "ไฟล์แนบถูกปฏิเสธ เนื้อหาไม่ตรงกับชนิดไฟล์ที่อ้างไว้",
  "transfer.failed.storage":
    "ไฟล์แนบมาถึงแต่บันทึกไม่ได้ ตรวจสอบพื้นที่ว่างของคุณ",
  "transfer.badge.waiting": "กำลังรอ · {name}",
  "transfer.badge.active_count": "{count} การถ่ายโอน",
  "transfer.badge.sending": "กำลังส่ง {name}",
  "transfer.badge.receiving": "กำลังรับ {name}",
  "transfer.badge.a11y": "{label}, {percent} เปอร์เซ็นต์ เปิดบทสนทนา",
  "transfer.kind.photo": "รูปภาพ",
  "transfer.kind.video": "วิดีโอ",
  "transfer.kind.voice": "ข้อความเสียง",
  "transfer.this.photo": "รูปภาพนี้",
  "transfer.this.video": "วิดีโอนี้",
  "transfer.this.voice": "ข้อความเสียงนี้",
  "transfer.this.file": "ไฟล์นี้",
  "transfer.kind.document": "เอกสาร",
  "transfer.kind.voice_preview": "ข้อความเสียง",
  "transfer.kind.photo_preview": "รูปภาพ",
  "transfer.kind.video_preview": "วิดีโอ",
  "transfer.kind.document_preview": "เอกสาร",

  // ---- System notifications ----
  "notif.channel.messages": "ข้อความ",
  "notif.channel.nearby": "เพียร์ใกล้เคียง",
  "notif.channel.nearby_desc":
    "การแจ้งเตือนเป็นครั้งคราวเมื่อเมชพบผู้คนอยู่ในระยะบลูทูธ",
  "notif.nearby.body": "อยู่ในระยะบลูทูธแล้ว แตะเพื่อเปิดเมช",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "บางคน",
  "notif.notice_urgent": "ประกาศด่วน · {content}",
  "notif.notice": "ประกาศ · {content}",
  "notif.incoming_file": "ไฟล์ที่กำลังเข้ามา",
  "notif.preview.photo": "📷 รูปภาพ",
  "notif.preview.voice": "🎤 ข้อความเสียง",
  "notif.preview.video": "🎥 วิดีโอ",
  "notif.preview.document": "📄 เอกสาร",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "ข้อความใหม่",
  "notif.hidden.channel": "กิจกรรมใหม่",
  "notif.hidden.mention": "คุณถูกกล่าวถึง",
  "notif.mention.title": "{sender} กล่าวถึงคุณ",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "แสดงอีก {count} รายการ",
  },
  "chat.channels.show_more_a11y": {
    other: "แสดงช่องเริ่มต้นอีก {count} ช่อง",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}, ยังไม่อ่าน {count}",
  },
  "a11y.new_count": {
    other: "{label}, ใหม่ {count}",
  },
  "chat.a11y.unread": {
    other: "ยังไม่อ่าน {count}",
  },
  "chat.thread.length_left": {
    other: "เหลือ {count}",
  },
  "settings.general.retention_days": {
    other: "{count} วัน",
  },
  "chat.info.group_reach": {
    other: "ติดต่อได้ {reachable} จากสมาชิก {count} คน",
  },
  "chat.group_members": {
    other: "กลุ่มส่วนตัว  ·  สมาชิก {count} คน",
  },
  "chat.select.count": {
    other: "เลือกแล้ว {count}",
  },
  "chat.select.forward": {
    other: "ส่งต่อ {count} ข้อความ",
  },
  "chat.voice.live_speaking_count": {
    other: "{count} คนกำลังพูด",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "อยู่ในระยะ {count} เครื่อง",
  },
  "mesh.peer.hops_away": {
    other: "ห่าง {count} ฮอป",
  },
  "chat.presence.active": {
    other: "ใช้งานอยู่ {count}",
  },
  "chat.presence.nearby": {
    other: "อยู่ใกล้ {count}",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "{count} มินต์",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint} ถือ {balance} {unit} อยู่ใน {count} พรูฟ การลบออกจะลบพรูฟเหล่านั้นจากเครื่องนี้อย่างถาวรและไม่มีข้อมูลสำรอง โปรดถอนหรือส่งยอดคงเหลือออกไปก่อน",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other:
      "{count} รายการฝากกำลังรอการชำระเงิน ระบบจะตรวจสอบอีกครั้งทุกครั้งที่เปิดแอป",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "กู้คืนพรูฟที่ยังไม่ถูกใช้ {count} รายการจาก {mints}",
  },
  "wallet.backup.already_spent": {
    other:
      "พบเหรียญ {count} เหรียญแต่ถูกใช้ไปแล้ว จึงไม่มีการเพิ่มยอดให้ นี่เป็นเรื่องปกติ เหรียญทุกเหรียญที่คุณเคยใช้จะยังปรากฏอยู่ในบันทึกที่มินต์เก็บไว้",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "แสดงอีก {count} รายการ",
  },
  "wallet.activity.show_more_a11y": {
    other: "แสดงการชำระเงินอีก {count} รายการ",
  },
  "wallet.mint.unconfirmed_count": {
    other: "ยังไม่ยืนยัน {count}",
  },
  "wallet.proof_count": {
    other: "{count} พรูฟ",
  },
  "wallet.spent_removed_detail": {
    other: "พรูฟ {count} รายการถูกใช้ไปแล้วและถูกลบออก",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "มี {count} คนอยู่ใกล้",
  },
};

export const th = { strings, plurals };
