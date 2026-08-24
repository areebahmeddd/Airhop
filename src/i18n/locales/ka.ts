// ka: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "გაუქმება",
  "common.done": "მზადაა",
  "common.ok": "კარგი",
  "common.close": "დახურვა",
  "common.back": "უკან",
  "common.delete": "წაშლა",
  "common.remove": "მოცილება",
  "common.add": "დამატება",
  "common.copy": "კოპირება",
  "common.copied": "დაკოპირდა",
  "common.share": "გაზიარება",
  "common.continue": "გაგრძელება",
  "common.try_again": "ხელახლა ცდა",
  "common.settings": "პარამეტრები",
  "common.off": "გამორთული",

  // ---- Dates ----
  "format.today": "დღეს",
  "format.yesterday": "გუშინ",
  "format.minutes_ago": "{count} წთ წინ",
  "format.hours_ago": "{count} სთ წინ",
  "format.days_ago": "{count} დღის წინ",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "მიმოწერები",
  "nav.tab.mesh": "მეში",
  "nav.tab.wallet": "საფულე",
  "nav.tab.profile": "შენ",
  "a11y.tab.new_peers": "{label}, ახლოს ვიღაც ახალია",
  "nav.notifications": "შეტყობინებები",
  "chat.subtab.channels": "არხები",
  "chat.subtab.direct": "პირადი",
  "chat.subtab.dms": "პირადი შეტყობინებები",
  "chat.search.placeholder": "ძებნა მიმოწერებში…",
  "chat.search.a11y": "ძებნა მიმოწერებსა და შეტყობინებებში",
  "chat.search.close": "ძებნის დახურვა",
  "chat.search.clear": "ძებნის გასუფთავება",
  "mesh.view.radar": "რადარის ხედი",
  "mesh.view.list": "სიის ხედი",
  "mesh.view.radar_short": "რადარი",
  "mesh.view.list_short": "სია",

  // ---- Legal document names ----
  "legal.last_updated": "ბოლო განახლება: {date}",
  "legal.terms": "მომსახურების პირობები",
  "legal.privacy": "კონფიდენციალურობის პოლიტიკა",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "პირადი მეშ-კომუნიკაცია",
  "onboarding.welcome.cta": "დაწყება",
  "onboarding.welcome.cta_hint":
    "გასაგრძელებლად დაეთანხმე ქვემოთ მოცემულ პირობებს",
  "onboarding.welcome.consent_a11y":
    "მომსახურების პირობებსა და კონფიდენციალურობის პოლიტიკაზე დათანხმება",
  "onboarding.welcome.open_terms": "მომსახურების პირობების გახსნა",
  "onboarding.welcome.open_privacy": "კონფიდენციალურობის პოლიტიკის გახსნა",
  "onboarding.welcome.consent":
    "{cta}-ზე შეხებით ეთანხმები ჩვენს {terms}-სა და {privacy}-ს.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "შენი ვინაობა იქმნება",
  "onboarding.identity.body":
    "ამ მოწყობილობაზე იქმნება Ed25519 გასაღებების წყვილი.\nარაფერი არსად არ იგზავნება.",
  "onboarding.identity.failed_heading": "შენი გასაღებების შექმნა ვერ მოხერხდა",
  "onboarding.identity.failed_body":
    "ამ მოწყობილობამ Airhop-ს მათი უსაფრთხოდ შენახვის საშუალება არ მისცა. სცადე ხელახლა, ან გადატვირთე ტელეფონი და ხელახლა გახსენი Airhop.",
  "onboarding.identity.steps_a11y": "ნაბიჯები: {steps}",
  "onboarding.identity.step.x25519":
    "იქმნება X25519 სტატიკური გასაღებების წყვილი",
  "onboarding.identity.step.ed25519":
    "იქმნება Ed25519 ხელმოწერის გასაღებების წყვილი",
  "onboarding.identity.step.keychain": "გასაღებები ინახება სისტემის საკვანძოში",
  "onboarding.identity.step.peer_id": "გამოითვლება კვანძის ID",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "შენი სახელი მეშში",
  "onboarding.username.peer_id": "კვანძის ID",
  "onboarding.username.card_a11y":
    "შენი სახელი მეშში არის {username}. კვანძის ID {peerID}. {props}.",
  "onboarding.username.explanation":
    "ეს მომხმარებლის სახელი დეტერმინისტულად გამოითვლება შენი საჯარო გასაღებიდან. ის ერთი და იგივეა ყველა მოწყობილობაზე, რომელიც შენს კვანძის ID-ს ხედავს.",
  "onboarding.username.cta": "Airhop-ში შესვლა",
  "onboarding.username.prop.algorithm": "ალგორითმი",
  "onboarding.username.prop.storage": "შენახვა",
  "onboarding.username.prop.storage_value": "მხოლოდ სისტემის საკვანძო",
  "onboarding.username.prop.account": "საჭიროა ანგარიში",
  "onboarding.username.prop.account_value": "არა",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "კეთილი იყოს შენი მობრძანება Airhop-ში",
  "onboarding.hello.p1":
    "გამარჯობა. Airhop აგებულია bitchat-ის საფუძველზე, როგორც დამოუკიდებელი, ღია კოდის პარალელური პროექტი. ის არ არის დაკავშირებული bitchat-ის პროექტთან ან permissionless tech-თან და მათ მიერ მოწონებულიც არ არის — უბრალოდ რაღაც, რისი შექმნაც და საზოგადოებასთან გაზიარებაც მსიამოვნებს.",
  "onboarding.hello.p2":
    "ეს პირველი iOS-ისა და Android-ის გამოშვებაა, ამიტომ მიუხედავად იმისა, რომ მეგობრებთან ერთად გამოვცადე, სავარაუდოდ რამდენიმე შეცდომას წააწყდები. თუ ასე მოხდა, ან თუ ფუნქციის იდეა გაქვს, სიამოვნებით მოგისმენ. გახსენი issue {github}-ზე ან მომწერე {email}-ზე.",
  "onboarding.hello.p3":
    "თუ Airhop შენთვის სასარგებლოა, იფიქრე ვარსკვლავის დატოვებაზე {github}-ზე ან შეფასების დაწერაზე {store}-ში. ეს ეხმარება, რომ მეტმა ადამიანმა აღმოაჩინოს პროექტი. მადლობა, რომ სცადე!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "სანამ შენი ტელეფონი გკითხავს",
  "onboarding.primer.lede": "აი, რას აკეთებს თითოეული და რას არა.",
  "onboarding.primer.bluetooth.title": "ბლუთუზი",
  "onboarding.primer.bluetooth.body":
    "პოულობს ახლომდებარე მოწყობილობებს და მათ შორის შეტყობინებებს გადასცემს. სწორედ ასე იქმნება მეში და მუშაობს ინტერნეტ-კავშირის გარეშე.",
  "onboarding.primer.location.title": "მდებარეობა",
  "onboarding.primer.location.body":
    "გათავსებს ახლომდებარე ზონის არხებში, კვარტლიდან რეგიონამდე. Airhop არასოდეს გადევნებს თვალს და შენს ზუსტ მდებარეობას მოწყობილობიდან არ გზავნის.",
  "onboarding.primer.notifications.title": "შეტყობინებები",
  "onboarding.primer.notifications.body":
    "მიიღე ახალი შეტყობინებების შესახებ ცნობები მაშინაც, როცა აპლიკაცია დახურულია. შეტყობინებები შენს მოწყობილობაზე იქმნება, სერვერის ჩარევის გარეშე.",
  "onboarding.primer.footnote":
    "შეგიძლია უარი თქვა. შეტყობინებები მაინც ინტერნეტით მოძრაობს, და აზრი მოგვიანებით პარამეტრებში შეგიძლია შეიცვალო.",
  "onboarding.primer.cta_a11y": "გაგრძელება ნებართვების მოთხოვნებამდე",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "ბლუთუზთან წვდომა",
  "permission.bluetooth.purpose": "იპოვო ახლომდებარე მოწყობილობები მეშში",
  "permission.open_settings": "პარამეტრების გახსნა",
  "permission.not_now": "ახლა არა",
  "permission.blocked_title": "{label} გამორთულია",
  "permission.blocked_body": "ჩართე პარამეტრებში, რომ {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "რაღაც შეცდომა მოხდა",
  "error.boundary.body":
    "Airhop მოულოდნელ პრობლემას წააწყდა და იძულებული გახდა, შეეწყვიტა ის, რასაც აჩვენებდა.",

  // ---- Chats: channel list ----
  "chat.channels.default": "ნაგულისხმევი არხები",
  "chat.channels.yours": "შენი არხები",
  "chat.channels.none": "ჯერ არხები არ არის",
  "chat.channels.none_hint":
    "შეეხე ზემოთ {plus}-ს, რომ შეუერთდე ან შექმნა ერთი.",
  "chat.channels.none_desc":
    "ჯერ არხები არ არის. გამოიყენე სათაურის დამატების ღილაკი, რომ შეუერთდე ან შექმნა ერთი.",
  "chat.channels.show_fewer": "ნაკლები ნაგულისხმევი არხის ჩვენება",
  "chat.channels.show_less": "ნაკლების ჩვენება",
  "chat.channels.info": "არხის ინფორმაცია",
  "chat.channels.pin": "არხის მიმაგრება",
  "chat.channels.unpin": "არხის მოხსნა",
  "chat.channels.mute": "არხის დადუმება",
  "chat.channels.unmute": "არხის დადუმების მოხსნა",
  "chat.channels.leave": "არხის დატოვება",
  "chat.channels.leave_confirm": "დატოვება",
  "chat.channels.clear_body":
    "წავშალოთ {name}-ის ყველა შეტყობინება? ამის დაბრუნება შეუძლებელია.",
  "chat.channels.leave_body":
    "დავტოვოთ {name}? მისი შეტყობინებების მიღებას შეწყვეტ, ისტორია კი ამ მოწყობილობიდან წაიშლება.",
  "chat.channels.more_options": "{name}-ის დამატებითი პარამეტრები",
  "chat.channels.teleported_tag": "{level}  ·  შორიდან",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "მიმოწერის გასუფთავება",
  "chat.dm.remove_contact": "კონტაქტის წაშლა",
  "chat.dm.block": "ამ კვანძის დაბლოკვა",
  "chat.dm.block_confirm": "დაბლოკვა",
  "chat.dm.delete": "მიმოწერის წაშლა",
  "chat.dm.delete_body":
    "ეს შლის საუბარს შენი სიიდან და შლის მის შეტყობინებებს. კონტაქტი რჩება, და მისი ახალი შეტყობინება ახალ მიმოწერას იწყებს.",
  "chat.dm.in_range": "მიღწევადია",
  "chat.dm.row_hint": "შეეხე ორჯერ და დააკავე დამატებითი პარამეტრებისთვის",
  "chat.channels.row_hint":
    "შეეხე ორჯერ და დააკავე დამატებითი პარამეტრებისთვის",
  "chat.dm.you_prefix": "შენ:",
  "chat.dm.none": "პირადი შეტყობინებები არ არის",
  "chat.dm.none_desc":
    "გადადი მეშის ჩანართზე და შეეხე კვანძს, რომ დაიწყო დაშიფრული პირადი მიმოწერა.",
  "chat.dm.contact_info": "კონტაქტის ინფორმაცია",
  "chat.dm.pin": "მიმოწერის მიმაგრება",
  "chat.dm.unpin": "მიმოწერის მოხსნა",
  "chat.dm.mute": "მიმოწერის დადუმება",
  "chat.dm.unmute": "მიმოწერის დადუმების მოხსნა",
  "chat.dm.clear_body":
    "წავშალოთ ყველა შეტყობინება {name}-თან? ამის დაბრუნება შეუძლებელია.",
  "chat.dm.remove_contact_body":
    "წავშალოთ {name}? ეს შლის საუბარს და ივიწყებს კონტაქტს. თუ ისევ მოგწერს, მაინც მოგწვდება.",
  "chat.dm.block_body":
    "დავბლოკოთ {name}? მას მეშის ჩანართზე ვეღარ ნახავ და მისგან შეტყობინებებს ვეღარ მიიღებ, თუნდაც ახლოს იყოს.",
  "chat.dm.more_options": "{name}-ის დამატებითი პარამეტრები",
  "chat.dm.remove_contact_short": "კონტაქტის წაშლა",
  "chat.dm.block_short": "კონტაქტის დაბლოკვა",
  "chat.dm.delete_short": "მიმოწერის წაშლა",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "შეტყობინებების გასუფთავება",
  "chat.clear_confirm": "გასუფთავება",
  "chat.group_badge": "ჯგუფი",
  "chat.more": "მეტი",
  "chat.no_messages": "ჯერ შეტყობინებები არ არის",
  "chat.you": "შენ",
  "chat.a11y.channel": "არხი {name}",
  "chat.a11y.group": "ჯგუფი {name}",
  "chat.a11y.muted": "დადუმებული",
  "chat.a11y.pinned": "მიმაგრებული",

  // ---- Chats: start something new ----
  "chat.new.title": "დაიწყე რაღაც ახალი",
  "chat.new.channel": "პირადი არხის შექმნა",
  "chat.new.channel_label": "პირადი არხი",
  "chat.new.channel_desc":
    "ოთახი, სადაც ბმულის მქონე ნებისმიერს შეუძლია შესვლა. შექმენი ერთი, ან შედი გამოგზავნილი ბმულით.",
  "chat.new.group": "პირადი ჯგუფის შექმნა",
  "chat.new.group_label": "პირადი ჯგუფი",
  "chat.new.group_desc":
    "აირჩიე კონკრეტული ადამიანები. მაქსიმუმ 16. რჩება ბლუთუზზე.",
  "chat.new.place": "გადადი ადგილას geohash-ით",
  "chat.new.place_label": "გადადი ადგილას",
  "chat.new.place_desc":
    "გახსენი ნებისმიერი ადგილის მდებარეობის არხი მისი geohash-ით.",
  "chat.new.reach": "მისაწვდომობა",
  "chat.new.reach_internet": "წევრებს წვდება ბლუთუზითა და ინტერნეტით.",
  "chat.new.reach_mesh": "მუშაობს ბლუთუზის რადიუსში, ინტერნეტით არა.",
  "chat.new.reach_internet_desc":
    "წევრებს ინტერნეტითაც წვდება. რელეები ხედავენ, რომ არხი აქტიურია, მაგრამ არასოდეს მის შეტყობინებებს ან იმას, ვინ არის შიგნით.",
  "chat.new.reach_mesh_desc":
    "რჩება ადგილობრივ მეშში. ყველაზე პირადი: არაფერი გადის ბლუთუზის რადიუსიდან.",
  "chat.new.join_link": "პირად არხში შესვლა მოსაწვევი ბმულით",
  "chat.new.back_to_chooser": "არჩევანთან დაბრუნება",
  "chat.new.create_channel": "არხის შექმნა",
  "chat.new.name_required": "ჯერ შეიყვანე არხის სახელი",
  "chat.new.name_taken": "ეს სახელი უკვე დაკავებულია",
  "chat.new.create": "შექმნა",
  "chat.new.e2ee":
    "ბოლომდე დაშიფრული. შეტყობინებების წაკითხვა მხოლოდ წევრებს შეუძლიათ.",
  "chat.new.invite_only":
    "მხოლოდ მოწვევით. შესვლა შეუძლია ყველას, ვისაც ბმულს გაუზიარებ. დანარჩენებისთვის დამალული რჩება, ახლომდებარე კვანძებისთვისაც კი.",
  "chat.new.name_exists": "ამ სახელით არხი უკვე არსებობს.",
  "chat.new.reach_bluetooth_chip": "მხოლოდ ბლუთუზი",
  "chat.new.reach_internet_chip": "ბლუთუზი + ინტერნეტი",
  "chat.new.have_link": "შესვლა მოსაწვევი ბმულით",

  // ---- Chats: join by link ----
  "chat.join.title": "შესვლა ბმულით",
  "chat.join.not_airhop": "ეს Airhop-ის ბმული არ არის.",
  "chat.join.reach_internet": "წევრებს წვდება ბლუთუზითა და ინტერნეტით.",
  "chat.join.reach_mesh": "რჩება ბლუთუზის რადიუსში.",
  "chat.join.contact_card":
    "საკონტაქტო ბარათი. ამატებს ადამიანს შენს კონტაქტებში და ხსნის მიმოწერას.",
  "chat.join.unverified": "ამ ბმულის გადამოწმება ვერ მოხერხდა",
  "chat.join.unverified_body":
    "საკონტაქტო ბარათი საკუთარ გასაღებებს არ ემთხვევა, ამიტომ არ დამატებულა. სთხოვე, ახალი გამოგზავნოს.",
  "chat.join.paste": "ჩასმა ბუფერიდან",
  "chat.join.join": "შესვლა",
  "chat.join.public_channel":
    "საჯარო არხი {name}. წაკითხვა ახლომდებარე ნებისმიერს შეუძლია.",
  "chat.join.private_channel": "პირადი არხი {name}. {reach}",
  "chat.join.dm_with": "პირადი შეტყობინება {name}-თან.",
  "chat.join.joined_as": "შეხვედი როგორც {name}",
  "chat.join.name_clash_body":
    "შენ უკვე სხვა {name}-ში ხარ. არხის სახელები მხოლოდ იარლიყებია, ამიტომ ამ მოწვევამ საკუთარი არხი გახსნა, ის კი, სადაც იყავი, ხელუხლებელი დარჩა. ორივეს სახელი არხის ინფორმაციიდან შეგიძლია შეცვალო.",
  "chat.join.paste_hint":
    "ჩასვი მოწვევა, რომელიც airhop://-ით იწყება. ბმულზე შეხებაც მუშაობს; ეს იმ ბმულისთვისაა, რომელსაც ვერ შეეხები.",
  "chat.join.key_note":
    "პირადი არხის მოწვევას გასაღები თან მოაქვს, ამიტომ შესვლა მყისიერია და არავის არაფერი ეკითხება.",
  "chat.join.offline_note":
    "მუშაობს ოფლაინში. ბმული ამ მოწყობილობაზე იკითხება, არხი კი იქამდე წვდება, სადამდეც შემქმნელმა განსაზღვრა.",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "ამ უჯრის გახსნა ვერ მოხერხდა. სცადე ცოტა ხანში.",
  "chat.jump.title": "გადადი ადგილას",
  "chat.jump.saved": "შენახული ადგილები",
  "chat.jump.anywhere":
    "გახსენი ნებისმიერი ადგილის საჯარო მდებარეობის არხი, თუნდაც იმისა, სადაც არ ხარ.",
  "chat.jump.geohash_note":
    "შეიყვანე მისი geohash. ყველა, ვისი მდებარეობაც ამ უჯრაში ხვდება, ამ არხს იზიარებს.",
  "chat.jump.teleport_note":
    "შენ გამოჩნდები როგორც შორიდან მოსული, და არა ახლომდებარე. წვდომა მხოლოდ ინტერნეტითაა.",
  "chat.jump.level_cell": "{level} უჯრა",
  "chat.jump.already_here":
    "შენ უკვე აქ ხარ. გადასვლა შენს {name} არხს გახსნის.",
  "chat.jump.open_direction": "გახსენი უჯრა {direction}-ით",
  "chat.jump.open_place": "{name}-ის გახსნა",
  "chat.jump.remove_place": "{name}-ის წაშლა შენახული ადგილებიდან",
  "chat.jump.go": "გადასვლა",
  "chat.jump.how":
    "geohash-ის საპოვნელად: გახსენი მდებარეობის არხი > შეეხე მის სახელს > დააკოპირე იქიდან.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "ყველა წევრს ვერ მივწვდით. სცადე მაშინ, როცა ახლოს იქნებიან.",
  "chat.group.you_were_added": "დაგამატეს {name}-ში.",
  "chat.group.added_you": "დაგამატა {name}-ში",
  "chat.group.you_were_removed":
    "წაგშალეს {name}-იდან. აქ ვეღარ წაიკითხავ და ვეღარ გააგზავნი შეტყობინებებს.",
  "chat.group.removed_you": "წაგშალა {name}-იდან",
  "chat.group.add_failed": "მისი დამატება ვერ მოხერხდა",
  "chat.group.add_failed_body":
    "არაფერი შეცვლილა. ან ახლა მიუწვდომელია, ან ჯგუფი 16-ზეა შევსებული, ან შენ არ ხარ მისი შემქმნელი.",
  "chat.group.remove_failed": "მისი წაშლა ვერ მოხერხდა",
  "chat.group.remove_failed_body":
    "არაფერი შეცვლილა. ვინ არის ჯგუფში, მხოლოდ მის შემქმნელს შეუძლია შეცვალოს.",
  "chat.group.e2ee":
    "ბოლომდე დაშიფრული. შეტყობინებების წაკითხვა მხოლოდ წევრებს შეუძლიათ.",
  "chat.group.cap":
    "მაქსიმუმ 16 ადამიანი, შენ მიერ არჩეული. მოსაწვევი ბმული არ არსებობს, ამიტომ გადაგზავნილი ბმულით ვერავინ შემოვა.",
  "chat.group.bluetooth":
    "მხოლოდ ბლუთუზი. რადიუსს გარეთ მყოფი წევრები შეტყობინებებს დაბრუნებისთანავე მიიღებენ.",
  "chat.group.members_label": "წევრები",
  "chat.group.none_in_range":
    "მიღწევადობის ზონაში არავინაა. ჯგუფის შექმნისას წევრები ახლოს უნდა იყვნენ.",
  "chat.group.create_title": "ჯგუფის შექმნა",
  "chat.group.name_placeholder": "ჯგუფის სახელი",
  "chat.group.create": "შექმნა",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "ადგილობრივი მეში · მხოლოდ ბლუთუზი",
  "chat.scope.mesh_desc":
    "წვდება ბლუთუზის რადიუსში მყოფ მოწყობილობებს (დაახლოებით 10-დან 100 მეტრამდე). ინტერნეტი არ სჭირდება. იდეალურია ადგილზე შეთანხმებისთვის.",
  "chat.scope.block": "კვარტალი · ~100 მ",
  "chat.scope.block_desc":
    "კვარტლის დონის დაფარვა. შეტყობინებები ინტერნეტით გადადის ხიდით, რომ ბლუთუზის რადიუსს გარეთ, მაგრამ ახლოს მყოფმა კვანძებმაც მიიღონ მონაწილეობა.",
  "chat.scope.neighborhood": "უბანი · ~1 კმ",
  "chat.scope.neighborhood_desc":
    "უბნის დონის დაფარვა. რელეების დახმარებით, მთელი უბნის კვანძები მიღწევადია პირდაპირი ბლუთუზ-კავშირის გარეშეც.",
  "chat.scope.city": "ქალაქი · ~10 კმ",
  "chat.scope.city_desc":
    "მთელი ქალაქის არხი. იყენებს მდებარეობით შერჩეულ ინტერნეტ-რელეებს, რომ მთელი აგლომერაციის კვანძებს მიწვდეს.",
  "chat.scope.province": "მხარე ან შტატი · ~100 კმ",
  "chat.scope.province_desc":
    "მხარის ან შტატის დონის დაფარვა. ინტერნეტით გადებული ხიდი ასობით კილომეტრზე რეგიონულ მისაწვდომობას იძლევა.",
  "chat.scope.country": "ქვეყანა ან რეგიონი · ~1000 კმ",
  "chat.scope.country_desc":
    "მთელი ქვეყნის დაფარვა. რეგიონში მყოფ ნებისმიერ Airhop-ის ან bitchat-ის მომხმარებელს შეუძლია შემოსვლა და შეტყობინებების წაკითხვა.",
  "chat.transport.bluetooth": "მხოლოდ ბლუთუზი",
  "chat.transport.both": "ბლუთუზი + ინტერნეტი",
  "chat.transport.internet": "მხოლოდ ინტერნეტი",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "ბრძანება /{cmd}: {hint}",
  "chat.cmd.hug_hint": "გაუგზავნე თბილი ჩახუტება",
  "chat.cmd.slap_hint": "გააწანწკარე დიდი კალმახით",
  "chat.status.sending": "იგზავნება…",
  "chat.status.undo_send": "გაგზავნის გაუქმება",
  "chat.status.undo": "გაუქმება",
  "chat.status.sent": "გაგზავნილია",
  "chat.status.received": "მიღებულია",
  "chat.status.failed": "ვერ მოხერხდა",
  "chat.status.canceled": "გაუქმებულია",
  "chat.status.waiting": "ელოდება",
  "chat.status.sending_short": "იგზავნება",
  "chat.status.receiving": "მიიღება",
  "chat.thread.not_available": "აქ მიუწვდომელია",
  "chat.thread.private_channel": "პირადი არხი",
  "chat.thread.location_channel": "მდებარეობის არხი",
  "chat.thread.public_channel": "საჯარო არხი",
  "chat.thread.notices": "ამ არხის განცხადებები",
  "chat.thread.invite": "მოიწვიე ვინმე ამ არხში",
  "chat.thread.not_in_range":
    "ბლუთუზის რადიუსში არ არის. მიწოდება ინტერნეტით მიმდინარეობს.",
  "chat.thread.not_nearby":
    "ახლოს არ არის. მივიტანთ, როცა რადიუსში დაბრუნდება ან ონლაინ გამოჩნდება.",
  "chat.thread.no_keys":
    "იმისთვის, რომ მისწერო, ბლუთუზის რადიუსში უნდა იყო, ან მისი კოდი უნდა დაასკანერო.",
  "chat.geo.card_received":
    "{name}-მა თავისი კონტაქტი გაგიზიარა. გაუზიარე შენიც, რომ საუბარი გააგრძელოთ მას შემდეგაც, რაც ერთ-ერთი ადგილს შეიცვლის.",
  "chat.geo.exchange_complete":
    "კონტაქტები გაცვლილია. ახლა ერთმანეთს ნებისმიერი ადგილიდან მისწვდებით.",
  "chat.geo.keep_person": "შეინახე ეს ადამიანი",
  "chat.geo.keep_person_desc":
    "გაუზიარე შენი კონტაქტი, რომ საუბარი გააგრძელოთ მას შემდეგაც, რაც ერთ-ერთი ადგილს შეიცვლის. ის შენს მუდმივ ვინაობას გაიგებს.",
  "chat.geo.card_sent": "გაზიარებულია · ელოდება მისას",
  "chat.thread.left_cell":
    "შენ ეს ზონა დატოვე, ამიტომ აქ ვერ მოგწვდება. გაცვალეთ კოდები, რომ საუბარი ნებისმიერ ადგილას გააგრძელოთ.",
  "chat.thread.no_route":
    "ახლა ვერ მივწვდებით. შეტყობინება გაიგზავნება, როგორც კი გზა გაჩნდება.",
  "chat.thread.empty": "ჯერ შეტყობინებები არ არის",
  "chat.thread.empty_desc": "დაიწყე დაშიფრული საუბარი.",
  "chat.thread.jump_latest": "უახლეს შეტყობინებაზე გადასვლა",
  "chat.thread.back_to_members": "წევრებთან დაბრუნება",
  "chat.thread.nostr_key": "Nostr-ის საჯარო გასაღები",
  "chat.thread.in_range": "მიღწევადია",
  "chat.voice.not_recorded": "ხმოვანი ჩანაწერი არ ჩაიწერა",
  "chat.thread.message": "შეტყობინება",
  "chat.thread.message_placeholder": "შეტყობინება…",
  "chat.thread.length_full": "შეტყობინება სავსეა",
  "chat.thread.waiting_for": "{name}-ის დაბრუნებას ელოდება · {percent}%",
  "chat.thread.peer": "კვანძი",
  "chat.thread.cancel_transfer": "{name}-ის გაუქმება",
  "chat.thread.queued_more": "კიდევ {count} ელოდება გაგზავნას",
  "chat.thread.across_bridge": "{count} ხიდის მიღმა",
  "chat.thread.bridged": "ხიდით გადავიდა",
  "chat.thread.invite_body":
    "შემომიერთდი {channel}-ში Airhop-ზე — პირადი მეშ-შეტყობინებები, უპირველესად ოფლაინისთვის.",
  "chat.thread.go_back_unread": "უკან, {count} წაუკითხავი",
  "chat.thread.view_info": "{name}-ის ინფორმაციის ნახვა",
  "chat.thread.notices_new": "ამ არხის განცხადებები, {count} ახალი",
  "chat.thread.say_something": "თქვი რამე {channel}-ში.",
  "chat.thread.jump_latest_new": "უახლეს შეტყობინებაზე გადასვლა, {count} ახალი",
  "chat.thread.unconfirmed_since": "{date}-იდან მიწოდება არ დადასტურებულა",
  "chat.thread.no_reach": "ახლოს კვანძები არ არის · ეს ჯერ არავის მიუღია",
  "chat.thread.channel_needs_internet":
    "ინტერნეტი გამორთულია · ეს არხი მხოლოდ ბლუთუზის რადიუსში მყოფებს წვდება",
  "chat.thread.cell_needs_internet":
    "ინტერნეტი გამორთულია · ამ უჯრასთან წვდომა მხოლოდ ინტერნეტითაა",
  "chat.thread.geo_dm_needs_internet":
    "ინტერნეტი გამორთულია · ეს საუბარი მხოლოდ ინტერნეტით მიდის",
  "chat.thread.via_gateway":
    "ინტერნეტი გამორთულია · ახლომდებარე მოწყობილობა ამას შენს ნაცვლად ონლაინში გაიტანს",
  "chat.thread.group_queued":
    "ამ ჯგუფიდან ჯერ არავინაა ახლოს. მიაღწევს, როცა იქნებიან.",
  "chat.thread.no_group_key":
    "შენ ამ ჯგუფში აღარ ხარ, ამიტომ ამის გაგზავნა შეუძლებელია",
  "chat.thread.no_reach_offline":
    "ინტერნეტი გამორთულია და ახლოს კვანძებიც არ არის · ეს ჯერ არავის მიუღია",
  "chat.thread.mention": "{name}-ის მოხსენიება",
  "chat.thread.someone_talking": "{hold}. {name} საუბრობს.",
  "chat.thread.attach_note":
    "ფაილები მხოლოდ ბლუთუზის რადიუსში იგზავნება. ტექსტი და გადახდები ინტერნეტის კონტაქტებსაც წვდება; დანართები არა.",
  "chat.thread.message_peer": "მისწერე {name}-ს",
  "chat.thread.send": "შეტყობინების გაგზავნა",
  "chat.thread.group": "ჯგუფი",
  "chat.bridge.nearby_only":
    "მხოლოდ ახლოს: დატოვე ეს შეტყობინება მეშ-ხიდის გარეთ",
  "chat.bridge.nearby_label": "მხოლოდ ახლოს · რჩება ბლუთუზზე",
  "chat.bridge.bridging_label":
    "ხიდი ახლომდებარე ზონებთან · შეეხე მხოლოდ ახლოსთვის",
  "chat.screenshot.you_took": "ეკრანის სურათი გადაიღე",
  "chat.screenshot.you_took_private":
    "ეკრანის სურათი გადაიღე · არავის შეუტყვია",
  "chat.screenshot.heads_up": "გაითვალისწინე",
  "chat.screenshot.notice": "* {name}-მა ეკრანის სურათი გადაიღო *",
  "chat.screenshot.notified_dm":
    "{name}-ს ეცნობა, რომ ამ საუბრის ეკრანის სურათი გადაიღე.",
  "chat.screenshot.notified":
    "ამ არხში ყველას ეცნობა, რომ ეკრანის სურათი გადაიღე.",
  "chat.screenshot.not_notified":
    "არავის ეცნობა. ეს არხი საჯაროა, ამიტომ ეკრანის სურათის გამოცხადება იმას დააფიქსირებდა, რომ აქ იყავი.",
  "chat.thread.error": "შეცდომა",
  "chat.thread.go_back": "უკან",
  "chat.bubble.via_bridge": "მეშ-ხიდით",
  "chat.bubble.view_profile": "{name}-ის პროფილის ნახვა",
  "chat.bubble.forwarded": "გადაგზავნილი",
  "chat.bubble.attachment": "დანართი",
  "chat.bubble.a11y": "{sender}: {body}. დააკავე დამატებითი პარამეტრებისთვის.",
  "chat.bubble.failed_retry": "გაგზავნა ვერ მოხერხდა. შეეხე ხელახლა საცდელად.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "შეტყობინების ინფორმაცია",
  "chat.info.delivered_to": "მიწოდებულია {name}-ს",
  "chat.info.read_by": "წაიკითხა {name}-მა",
  "chat.info.group_reach_desc": "ახლა მიღწევადია, და არა მიწოდების დადასტურება",
  "chat.info.group_alone": "სხვა წევრები არ არიან",
  "chat.info.today_at": "დღეს {time}",
  "chat.info.sending": "იგზავნება…",
  "chat.info.failed": "გაგზავნა ვერ მოხერხდა",
  "chat.info.courier": "მეგობარმა წაიღო",
  "chat.info.sent": "გაგზავნილია",
  "chat.info.queued": "ელოდება გაგზავნას",
  "chat.info.waiting": "ელოდება…",
  "chat.action.info": "შეტყობინების ინფორმაცია",
  "chat.action.save_photos": "ფოტოებში შენახვა",
  "chat.action.save_copy": "ასლის შენახვა",
  "chat.action.forward": "გადაგზავნა",
  "chat.action.select": "არჩევა",
  "chat.select.cancel": "არჩევის გაუქმება",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "კამერა",
  "chat.attach.camera_desc": "გადაიღე ფოტო ან ვიდეო",
  "chat.attach.library": "ფოტოების ბიბლიოთეკა",
  "chat.attach.library_desc": "აირჩიე შენი ბიბლიოთეკიდან",
  "chat.attach.document": "დოკუმენტი",
  "chat.attach.document_desc": "გააგზავნე ნებისმიერი ფაილი ან PDF",
  "chat.attach.voice": "ხმოვანი ჩანაწერი",
  "chat.attach.voice_desc": "ჩაწერე და გააგზავნე ხმოვანი შეტყობინება",
  "chat.attach.ecash": "ecash-ის გაგზავნა",
  "chat.attach.ecash_desc": "გააგზავნე Cashu sat-ები შენი საფულიდან",
  "chat.attach.location": "მდებარეობა",
  "chat.attach.location_desc": "გააგზავნე, სად ხარ ახლა",
  "chat.attach.title": "მიმაგრება",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "გააზიარა მდებარეობა",
  "chat.location.received_summary": "გააზიარა თავისი მდებარეობა",
  "chat.location.title": "მდებარეობა",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "აღებულია {ago} წინ",
  "chat.location.open_maps": "რუკებში გახსნა",
  "chat.location.no_forward": "მდებარეობები არ გადაიგზავნება",
  "chat.location.no_forward_body":
    "მდებარეობა ერთ ადამიანს ეგზავნება. თუ გინდა, სხვასაც ჰქონდეს, გააზიარე შენი.",
  "chat.location.no_fix": "დაუშვი მდებარეობა, რომ ნახო, რამდენად შორსაა ეს",
  "chat.location.send_title": "შენი მდებარეობის გაგზავნა",
  "chat.location.send_body":
    "{name} ერთ წერტილს დაინახავს: სად ხარ ახლა. ის განუწყვეტლივ არ განახლდება.",
  "chat.location.send": "მდებარეობის გაგზავნა",
  "chat.location.finding": "შენი მდებარეობის ძებნა…",
  "chat.location.no_location": "შენი მდებარეობის მიღება ვერ მოხერხდა",
  "chat.location.no_location_body":
    "დაუშვი მდებარეობასთან წვდომა და დარწმუნდი, რომ მდებარეობის სერვისები ჩართულია, შემდეგ კი სცადე ხელახლა.",
  "chat.location.not_delivered": "შენი მდებარეობის გაგზავნა ვერ მოხერხდა",
  "chat.location.not_delivered_body":
    "მდებარეობა მხოლოდ მაშინ ღირს გასაგზავნად, სანამ მიმდინარეა, ამიტომ რიგში არ ჩერდება. სცადე, როცა {name} მიღწევადი იქნება.",
  "chat.location.direction.n": "ჩრდილოეთით",
  "chat.location.direction.ne": "ჩრდილო-აღმოსავლეთით",
  "chat.location.direction.e": "აღმოსავლეთით",
  "chat.location.direction.se": "სამხრეთ-აღმოსავლეთით",
  "chat.location.direction.s": "სამხრეთით",
  "chat.location.direction.sw": "სამხრეთ-დასავლეთით",
  "chat.location.direction.w": "დასავლეთით",
  "chat.location.direction.nw": "ჩრდილო-დასავლეთით",
  "chat.attach.send_anyway": "მაინც გაგზავნა",
  "chat.attach.bitchat_too_big": "ეს შეიძლება ვერ მივიდეს",
  "chat.attach.bitchat_too_big_body":
    "{name} bitchat-ზეა, რომელიც დიდ ფაილს შუა გზაზე ანებებს თავს. დაახლოებით 350 KiB-ზე ნაკლები საიმედოა. Airhop-ის კონტაქტისთვის გაგზავნას ასეთი ზღვარი არ აქვს.",
  "chat.attach.bitchat_unopenable": "მან შეიძლება ეს ვერ გახსნას",
  "chat.attach.bitchat_unopenable_body":
    "{name} bitchat-ზეა, რომელიც ფოტოებსა და ხმოვან ჩანაწერებს აჩვენებს, დანარჩენ ყველაფერს კი ისეთ ფაილად ასახელებს, რომელსაც ვერ ხსნის. მივა, უბრალოდ შეიძლება ვერ ნახოს.",
  "chat.attach.file": "ფაილის მიმაგრება",
  "chat.attach.unavailable": "აქ დანართები მიუწვდომელია",
  "chat.attach.not_sent": "დანართი არ გაიგზავნა",
  "chat.attach.read_failed":
    "ამ ფაილის წაკითხვისას რაღაც შეცდომა მოხდა. სცადე სხვა.",
  "chat.attach.caption": "დაამატე წარწერა…",
  "chat.attach.send": "დანართის გაგზავნა",
  "chat.attach.generic": "დანართი",
  "chat.media.view_full": "ფოტოს ნახვა სრულ ეკრანზე",
  "chat.media.gone_photo": "ფოტო ამ მოწყობილობაზე არ არის",
  "chat.media.gone_video": "ვიდეო ამ მოწყობილობაზე არ არის",
  "chat.media.gone_voice": "ხმოვანი ჩანაწერი ამ მოწყობილობაზე არ არის",
  "chat.media.gone_file": "ფაილი ამ მოწყობილობაზე არ არის",
  "chat.media.gone_note": "წაიშალა 7 დღის შემდეგ ან ქეშის გასუფთავებისას",
  "chat.media.ask_resend": "ხელახლა თხოვნა",
  "chat.media.resend_draft": "შეგიძლია ის {kind} ხელახლა გამომიგზავნო?",
  "chat.media.kind_photo": "ფოტო",
  "chat.media.kind_video": "ვიდეო",
  "chat.media.kind_voice": "ხმოვანი ჩანაწერი",
  "chat.media.kind_file": "ფაილი",
  "chat.media.pause_voice": "ხმოვანი ჩანაწერის პაუზა",
  "chat.media.play_voice": "ხმოვანი ჩანაწერის დაკვრა",
  "chat.media.voice_position": "პოზიცია ხმოვან ჩანაწერში",
  "chat.media.voice_scrub": "შეეხე ზოლებს, რომ იმ წერტილზე გადახვიდე",
  "chat.media.image": "სურათი",
  "chat.media.tap_load_photo": "შეეხე ფოტოს ჩასატვირთად",
  "chat.media.open_document": "{name}-ის გახსნა",
  "chat.media.document": "დოკუმენტი",
  "chat.media.tap_load_video": "შეეხე ვიდეოს ჩასატვირთად",
  "chat.media.video": "ვიდეო",
  "chat.media.photo": "ფოტო",
  "chat.media.close_photo": "ფოტოს დახურვა",
  "chat.media.save_photo": "ფოტოს შენახვა შენს ფოტოებში",
  "chat.media.share_photo": "ფოტოს გაზიარება",
  "chat.media.saved_videos": "შენახულია შენს ვიდეოებში",
  "chat.media.saved_photos": "შენახულია შენს ფოტოებში",
  "chat.media.not_saved": "არ შენახულა",
  "chat.media.cant_open": "ფაილის გახსნა შეუძლებელია",
  "chat.media.no_app":
    "ამ მოწყობილობაზე არ არის აპლიკაცია, რომელიც ამ ფაილს გახსნის ან გააზიარებს.",
  "chat.media.open_failed":
    "ფაილის გახსნა ვერ მოხერხდა. შესაძლოა ქეშიდან წაშლილია.",
  "media.blocked.nostr_only":
    "ამ ადამიანს მხოლოდ რელეს მეშვეობით იცნობ. ხელმისაწვდომია მხოლოდ ტექსტი. ფოტოებს, ფაილებსა და ხმოვან ჩანაწერებს ბლუთუზი სჭირდება.",
  "media.blocked.private_channel":
    "მაუწყებლობის დანართი ხელმოწერილია, მაგრამ არა დაშიფრული, ამიტომ პირად არხში მისი გაგზავნა მას ღიად დატოვებდა, მაშინ როცა აქაური ტექსტი დაშიფრული რჩება.",
  "media.blocked.private_group":
    "მაუწყებლობის დანართი ხელმოწერილია, მაგრამ არა დაშიფრული, ამიტომ პირად ჯგუფში მისი გაგზავნა მას ღიად დატოვებდა, მაშინ როცა აქაური ტექსტი დაშიფრული რჩება.",
  "media.blocked.location_channel":
    "მდებარეობის არხი ადამიანებს ინტერნეტით წვდება, ფოტოები, ფაილები და ხმოვანი ჩანაწერები კი ბლუთუზით მოძრაობს, ამიტომ ისინი ვერასოდეს მიაღწევდნენ.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "აქ ხმოვანი ჩანაწერები მიუწვდომელია",
  "chat.voice.hold_live": "დააკავე პირდაპირ სასაუბროდ",
  "chat.voice.hold_record": "დააკავე ხმოვანი ჩანაწერის ჩასაწერად",
  "chat.voice.cancel_recording": "ჩაწერის გაუქმება",
  "chat.voice.slide_cancel": "გადაასრიალე გასაუქმებლად",
  "chat.voice.release_cancel": "გაუშვი გასაუქმებლად",
  "chat.voice.a11y_toggle": "შეეხე ორჯერ საუბრის დასაწყებად ან შესაწყვეტად.",
  "chat.voice.limit_reached": "ორწუთიან ზღვარს მიაღწიე, გაუშვი გასაგზავნად",
  "chat.voice.limit_sent": "ორწუთიან ზღვარს მიაღწიე, ჩანაწერი გაიგზავნა",
  "chat.voice.stop_send": "ჩაწერის შეწყვეტა და გაგზავნა",
  "chat.voice.lift_lock": "გადაასრიალე ზემოთ ხელის აშვებით ჩასაწერად",
  "chat.voice.live_speaking": "{name} საუბრობს",
  "voice.unavailable": "პირდაპირი ხმა მიუწვდომელია",
  "voice.recording_stopped": "ჩაწერა შეწყდა",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "კამერასთან წვდომა",
  "chat.perm.camera_purpose": "გადაიღო ფოტო გასაგზავნად",
  "chat.perm.photo_label": "ფოტოებთან წვდომა",
  "chat.perm.photo_purpose": "აირჩიო ფოტო ან ვიდეო გასაგზავნად",
  "chat.perm.photo_save_purpose": "შეინახო ეს შენს ფოტოებში",
  "chat.perm.mic_label": "მიკროფონთან წვდომა",
  "chat.perm.mic_live_purpose": "ესაუბრო ახლომდებარე ადამიანებს",
  "chat.perm.mic_note_purpose": "ჩაწერო ხმოვანი ჩანაწერი",
  "chat.perm.recording_stopped": "ჩაწერა შეწყდა",
  "chat.perm.record_failed":
    "ჩაწერის დაწყება ვერ მოხერხდა. შეამოწმე მიკროფონის ნებართვები.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "მიღებულია",
  "chat.ecash.reclaimed": "დაბრუნებულია",
  "chat.ecash.claiming": "მიიღება…",
  "chat.ecash.claim": "მიღება",
  "chat.ecash.claim_amount": "{amount} {unit}-ის მიღება",
  "chat.ecash.already_claimed": "უკვე მიღებულია",
  "chat.ecash.already_claimed_body":
    "ამ ტოკენის ყველა დასტური უკვე შენს საფულეშია, ამიტომ არაფერი დამატებულა.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "გადაეცა მეშს, რომ შეძლებისდაგვარად მიიტანოს",
  "chat.info.queued_desc": "ინახება ამ ტელეფონზე, სანამ მისკენ გზა გაჩნდება",
  "chat.info.reclaimed": "დაბრუნებულია",
  "chat.info.reclaimed_desc":
    "ეს გადახდა შენს საფულეში დაიბრუნე, ამიტომ ის არ მიიტანება",
  "chat.info.about": "შესახებ",
  "chat.info.group_desc":
    "პირადი ჯგუფი. მისი წაკითხვა მხოლოდ იმ წევრებს შეუძლიათ, რომლებიც შემქმნელმა დაამატა, და ის ბლუთუზზე რჩება.",
  "chat.info.teleported_desc":
    "ამ geohash უჯრის საჯარო მდებარეობის არხი. უჯრაში მყოფი ნებისმიერი, Airhop-ზე თუ bitchat-ზე, მას ინტერნეტით იზიარებს. შენ შორიდან ხარ მოსული, ფიზიკურად აქ არ ხარ.",
  "chat.info.custom_desc":
    "მორგებული არხი. ნებისმიერს, ვინც სახელს იცის, შეუძლია შემოვიდეს ნებისმიერი Airhop-ის ან bitchat-ის მოწყობილობიდან.",
  "chat.info.private_e2ee": "პირადი · ბოლომდე დაშიფრული",
  "chat.info.public_plain": "საჯარო · დაუშიფრავი",
  "chat.info.group_privacy":
    "ამ ჯგუფის წაკითხვა მხოლოდ ქვემოთ ნაჩვენებ წევრებს შეუძლიათ. შეტყობინებები ბლუთუზზე რჩება, ამიტომ რადიუსს გარეთ მყოფი წევრები დაბრუნებისთანავე მიიღებენ.",
  "chat.info.teleport_privacy":
    "ადგილი, სადაც შორიდან გადახვედი. ის ამ უჯრაში ყველას წვდება ინტერნეტით, და ბლუთუზის რადიუსში არავის.",
  "chat.info.location_off_privacy":
    "მდებარეობა გამორთულია, ამიტომ ეს არხი ახლომდებარე მოწყობილობებს მხოლოდ ბლუთუზით წვდება. ჩართე მდებარეობა, რომ მის ზონის უჯრას ინტერნეტით მისწვდე.",
  "chat.info.invite_privacy":
    "წაკითხვა მხოლოდ იმათ შეუძლიათ, ვისაც ბმულით მოიწვევ. დანარჩენებისთვის დამალული რჩება, ახლომდებარე კვანძებისთვისაც კი.",
  "chat.info.public_privacy":
    "ნებისმიერს, ვინც შემოვა, ყველა შეტყობინების წაკითხვა შეუძლია. პირადი საუბრისთვის გამოიყენე პირადი შეტყობინება; ისინი ბოლომდე დაშიფრულია.",
  "chat.info.remove_member": "წევრის წაშლა",
  "chat.info.remove_member_body":
    "წავშალოთ {name} ჯგუფიდან? ჯგუფის გასაღები შეიცვლება, ამიტომ ის ახალ შეტყობინებებს ვეღარ წაიკითხავს.",
  "chat.info.message_member": "მისწერე {name}-ს",
  "chat.info.remove_member_a11y": "{name}-ის წაშლა",
  "chat.info.no_addable":
    "დასამატებელი მიღწევადი კვანძები არ არის. წევრები ახლოს უნდა იყვნენ.",
  "chat.info.add_count": "{count}-ის დამატება",
  "chat.info.teleported_tag": "{level}  ·  შორიდან",
  "chat.info.active": "აქტიური",
  "chat.info.members": "წევრები",
  "chat.info.bookmark": "ამ ადგილის შენახვა",
  "chat.info.remove_bookmark": "შენახულებიდან წაშლა",
  "chat.info.default_notice":
    "ნაგულისხმევი არხების დატოვება შეუძლებელია. ისინი Airhop-ის მეშ-პროტოკოლის ნაწილია.",
  "chat.info.custom_channel": "მორგებული არხი",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "geohash-ის კოპირება",
  "chat.info.relays": "რელეები",
  "chat.info.show_relays": "აჩვენე რელეები, რომლებიც ამ არხს ატარებენ",
  "chat.info.relay_custom": "მორგებული",
  "chat.info.relays_none": "არცერთი. ეს უჯრა ახლა მხოლოდ ბლუთუზზეა.",
  "chat.info.search_members": "წევრების ძებნა",
  "chat.info.search_members_placeholder": "წევრების ძებნა…",
  "chat.info.teleported": "შორიდან",
  "chat.info.creator": "შემქმნელი",
  "chat.info.no_matches": "დამთხვევა არ არის",
  "chat.info.no_one_here": "აქ ჯერ არავინაა",
  "chat.info.add_members": "წევრების დამატება",
  "chat.info.add_selected": "არჩეული წევრების დამატება",
  "chat.info.add": "დამატება",
  "chat.info.leave_group": "ჯგუფის დატოვება",
  "chat.info.leave_channel": "არხის დატოვება",
  "chat.info.leave": "დატოვება",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "მიმოწერა {date}-იდან",
  "chat.contact.verified_since": "გადამოწმებულია {date}-იდან",
  "chat.contact.anonymous": "ანონიმური",
  "chat.contact.anonymous_desc":
    "geohash-ფსევდონიმი, რომელსაც გადასამოწმებელი მუდმივი ვინაობა არ აქვს",
  "chat.contact.verified": "გადამოწმებულია",
  "chat.contact.verified_desc": "მისი QR კოდი დაასკანერე",
  "chat.contact.verified_desc_compared": "მასთან კოდები შეადარე",
  "chat.contact.not_verified": "გადამოწმებული არ არის",
  "chat.contact.not_verified_desc":
    "დაასკანერე მისი კოდი, ან შეადარეთ ერთი ზარის დროს, რომ დარწმუნდე, რომ ეს ნამდვილად ისაა",
  "chat.contact.e2ee": "ბოლომდე დაშიფრული",
  "chat.contact.e2ee_nostr":
    "NIP-17-ით შეფუთული, ამიტომ რელეები ვერ კითხულობენ",
  "chat.contact.e2ee_mesh":
    "Noise XX, პლუს Double Ratchet Airhop-ის მოწყობილობებს შორის",
  "chat.contact.copy_nostr": "Nostr-ის საჯარო გასაღების კოპირება",
  "chat.contact.nostr_key": "Nostr-ის საჯარო გასაღები",
  "chat.contact.cell_key_note":
    "ეს გასაღები იმ ზონას ეკუთვნის, სადაც შეხვდით ერთმანეთს. ის იცვლება, თუ ერთ-ერთი ადგილს შეიცვლის, და საუბარიც მასთან ერთად წყდება. გაცვალეთ კონტაქტები, რომ საუბარი ნებისმიერ ადგილას გააგრძელოთ.",
  "chat.contact.peer_name": "კვანძის სახელი",
  "chat.contact.peer_id": "კვანძის ID",
  "chat.contact.rename": "სახელის შეცვლა",
  "chat.contact.rename_needs_contact":
    "სახელი იმათ შეგიძლია შეუცვალო, ვისი გასაღებებიც გაქვს. ჯერ გაცვალეთ საკონტაქტო ბარათები, შემდეგ კი ეს მხოლოდ შენთვის ხილული სახელი გახდება.",
  "chat.contact.rename_needs_keys":
    "ამ კონტაქტის გასაღებები ჯერ არ არის. მისწერე, ან დაასკანერე მისი კოდი, და შემდეგ მხოლოდ შენთვის ხილულ სახელს დაარქმევ.",
  "chat.contact.renamed_by_you": "სახელი, რომელიც შენ დაარქვი",
  "chat.contact.copy_peer_id": "კვანძის ID-ის კოპირება",
  "chat.contact.verify": "კონტაქტის გადამოწმება",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "განცხადებები",
  "chat.notices.post_area": "გამოაქვეყნე განცხადება ამ ზონაში",
  "chat.notices.post_mesh": "გამოაქვეყნე განცხადება მეშში",
  "chat.notices.mark_urgent": "სასწრაფოდ მონიშვნა",
  "chat.notices.post": "განცხადების გამოქვეყნება",
  "chat.notices.post_short": "გამოქვეყნება",
  "chat.notices.delete": "განცხადების წაშლა",
  "chat.notices.just_now": "ახლახან",
  "chat.notices.fades_soon": "მალე ქრება",
  "chat.notices.1_day": "1 დღე",
  "chat.notices.3_days": "3 დღე",
  "chat.notices.7_days": "7 დღე",
  "chat.notices.fading": "ქრება",
  "chat.notices.fades_in_hours": "ქრება {count} საათში",
  "chat.notices.fades_in_days": "ქრება {count} დღეში",
  "chat.notices.scope_geo": "გეო",
  "chat.notices.scope_mesh": "მეში",
  "chat.notices.urgent_short": "სასწრაფო",
  "chat.notices.permanent_warning":
    "არასოდეს ქრება. საჯაროა, ამ ზონაზეა მიბმული, და უკან ვერ წაიღებ.",
  "chat.notices.none":
    "ჯერ განცხადებები არ არის. გამოაქვეყნე ერთი, რომ სხვებისთვის აქ დარჩეს.",

  // ---- Chats: search results ----
  "chat.search.photos": "ფოტოები",
  "chat.search.videos": "ვიდეოები",
  "chat.search.audio": "აუდიო",
  "chat.search.documents": "დოკუმენტები",
  "chat.search.links": "ბმულები",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "ფილტრი: {filter}",
  "chat.search.no_matches": "„{query}“-ს არცერთი {filter} არ ემთხვევა",
  "chat.search.no_media": "ჯერ {filter} არ არის",
  "chat.search.result_a11y": "{chat}, {kind} {sender}-ისგან",
  "chat.search.you": "შენ",
  "chat.search.section_chats": "მიმოწერები",
  "chat.search.section_messages": "შეტყობინებები",
  "chat.search.section_notices": "განცხადებები",
  "chat.search.hint":
    "მოძებნე შეტყობინებებსა და მიმოწერებში, ან აირჩიე ფილტრი ზემოთ.",
  "chat.search.no_results": "„{query}“-ზე შედეგები არ არის",
  "chat.search.open_chat": "{name}-ის გახსნა",
  "chat.search.message_a11y": "{chat}, შეტყობინება {sender}-ისგან: {snippet}",
  "chat.search.notice_a11y": "განცხადება {chat}-ში {author}-ისგან: {snippet}",
  "chat.search.urgent": "სასწრაფო ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "ამ სიაში {count}-ია. გასუფთავება მათ მხოლოდ აქედან შლის, შეტყობინებები კი თავიანთ საუბრებში წაუკითხავი რჩება. ყველას წაკითხულად მონიშვნა ორივეს ასუფთავებს.",
  "chat.notif.mark_all_read": "ყველას წაკითხულად მონიშვნა",
  "chat.notif.clear_list": "სიის გასუფთავება",
  "chat.notif.clear_all_a11y": "ყველა {count} შეტყობინების გასუფთავება",
  "chat.notif.title": "შეტყობინებები",
  "chat.notif.clear_short": "გასუფთავება",
  "chat.notif.close": "შეტყობინებების დახურვა",
  "chat.notif.none": "ჯერ შეტყობინებები არ არის",
  "chat.notif.none_desc":
    "შენი არხებისა და მიმოწერების შეტყობინებები, ხსენებები და განცხადებები აქ გამოჩნდება.",
  "chat.notif.new": "ახალი",
  "chat.notif.notice_in": "განცხადება {channel}-ში",

  // ---- Chats: forward ----
  "chat.forward.title": "გადაგზავნა…",
  "chat.forward.to": "გადაგზავნა {name}-ს",
  "chat.forward.cant_send_here": "აქ გადაგზავნა შეუძლებელია",
  "chat.forward.cant_send_to": "{name}-ს გადაგზავნა შეუძლებელია",
  "chat.forward.channels": "არხები",
  "chat.forward.groups": "ჯგუფები",
  "chat.forward.locations": "მდებარეობები",
  "chat.forward.dms": "პირადი შეტყობინებები",
  "chat.forward.none": "ჯერ სხვა მიმოწერები არ არის",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "მეში ეშვება…",
  "mesh.banner.no_bluetooth":
    "ამ მოწყობილობაზე ბლუთუზი არ არის · მხოლოდ ინტერნეტი",
  "mesh.banner.bluetooth_off": "ბლუთუზი გამორთულია · მეში მიუწვდომელია",
  "mesh.banner.permission_needed": "საჭიროა ბლუთუზის ნებართვა",
  "mesh.banner.blocked": "ბლუთუზი დაბლოკილია · დაუშვი პარამეტრებში",
  "mesh.banner.location_permission": "კვანძების საპოვნელად საჭიროა მდებარეობა",
  "mesh.banner.advertising_unsupported":
    "ეს ტელეფონი სხვებს ხედავს, მაგრამ თვითონ ვერ აღმოაჩენენ",
  "mesh.banner.location_off_android":
    "მდებარეობა გამორთულია · Android-ს ის კვანძების საპოვნელად სჭირდება",
  "mesh.banner.paused": "მეში შეჩერებულია · შენ არ ხარ",
  "mesh.banner.location_off":
    "მდებარეობა გამორთულია · მდებარეობის არხები მიუწვდომელია",
  "mesh.banner.battery_saver": "ბატარეის დაზოგვა · სკანირება უფრო იშვიათად",
  "mesh.banner.wipe_incomplete":
    "წაშლა დაუსრულებელია · შესაძლოა მონაცემები დარჩა, ხელახლა გახსნა კვლავ ცდის",
  "mesh.banner.wifi_off": "Wi-Fi გამორთულია · დიდი ფაილები უფრო ნელა იგზავნება",
  "mesh.banner.clock_skew":
    "ამ ტელეფონის საათი არასწორია · დააყენე თარიღი და დრო ავტომატურზე",
  "mesh.banner.internet_off": "ინტერნეტი გამორთულია · მხოლოდ ბლუთუზი",
  "mesh.banner.relaying": "ადგილობრივი კვანძები არ არის · გადაცემა Nostr-ით",
  "mesh.banner.tor": "Tor ჩართულია · ინტერნეტ-ტრაფიკი მიმართულია",
  "mesh.banner.tor_starting": "Tor ეშვება · უკავშირდება",
  "mesh.banner.tor_blocked": "Tor ვერ დაუკავშირდა · მეში მაინც მუშაობს",
  "mesh.banner.gateway":
    "ინტერნეტ-კარიბჭე ჩართულია · გადასცემს ახლომდებარე კვანძებს",
  "mesh.banner.bridge": "მეშ-ხიდი ჩართულია · საჯარო მიმოწერა დაკავშირებულია",
  "mesh.banner.background_limits":
    "{brand}-მა შესაძლოა მეში ფონურ რეჟიმში შეაჩეროს",
  "mesh.banner.bridge_across": "მეშ-ხიდი ჩართულია · {count} ხიდის მიღმა",
  "mesh.banner.action.turn_on": "ჩართვა",
  "mesh.banner.action.allow": "დაშვება",
  "mesh.banner.action.resume": "გაგრძელება",
  "mesh.banner.action.fix": "გასწორება",
  "mesh.banner.hint.resume":
    "ხელახლა რთავს ბლუთუზის გამოცხადებასა და სკანირებას",
  "mesh.banner.hint.enable_bluetooth": "სთხოვს Android-ს ბლუთუზის ჩართვას",
  "mesh.banner.hint.location_settings":
    "ხსნის სისტემის მდებარეობის პარამეტრებს",
  "mesh.banner.hint.app_settings":
    "ხსნის Airhop-ის ნებართვებს სისტემის პარამეტრებში",
  "mesh.banner.hint.battery_settings":
    "ხსნის ამ ტელეფონის ფონური აქტივობის პარამეტრებს",
  "mesh.banner.dismiss": "დახურვა: {label}",
  "mesh.banner.hint.dismiss": "სამუდამოდ მალავს ამ შენიშვნას",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "ახლომდებარე კვანძების ძებნა…",
  "mesh.radar.starting": "მეში ეშვება…",
  "mesh.radar.no_bluetooth": "ამ მოწყობილობას ბლუთუზი არ აქვს",
  "mesh.radar.bluetooth_off": "ბლუთუზი გამორთულია · სკანირება არ მიმდინარეობს",
  "mesh.radar.permission_needed": "საჭიროა ბლუთუზის ნებართვა",
  "mesh.radar.blocked": "ბლუთუზი დაბლოკილია",
  "mesh.radar.location_permission": "საჭიროა მდებარეობის ნებართვა",
  "mesh.radar.location_off":
    "მდებარეობა გამორთულია · სკანირება არ მიმდინარეობს",
  "mesh.radar.hint_rings":
    "რგოლები BLE სიგნალის სიძლიერეს აჩვენებს, და არა მანძილს",
  "mesh.radar.hint_checking": "მოწმდება ბლუთუზი და ნებართვები",
  "mesh.radar.hint_internet": "შეტყობინებები მაინც ინტერნეტით მოძრაობს",
  "mesh.radar.hint_turn_on": "ჩართე ბლუთუზი კვანძების აღმოსაჩენად",
  "mesh.radar.hint_allow": "დაუშვი ბლუთუზი კვანძების აღმოსაჩენად",
  "mesh.radar.hint_allow_settings":
    "დაუშვი ბლუთუზი პარამეტრებში კვანძების აღმოსაჩენად",
  "mesh.radar.hint_location_permission":
    "Android 11-სა და უფრო ძველებს ბლუთუზით სკანირებისთვის მდებარეობა სჭირდებათ",
  "mesh.radar.hint_android_location":
    "Android-ს ბლუთუზ-სკანირების შედეგების დასაბრუნებლად მდებარეობა ჩართული სჭირდება",
  "mesh.radar.signal_strong": "ძლიერი",
  "mesh.radar.signal_medium": "საშუალო",
  "mesh.radar.signal_weak": "სუსტი",
  "mesh.radar.you_center": "შენ, მეშის ცენტრში",
  "mesh.radar.sonar_hint": "უკრავს სონარის ერთ გავლას. ძებნა ისედაც უწყვეტია.",
  "mesh.radar.paused": "მეში შეჩერებულია · შენ არ ხარ",
  "mesh.radar.ring_hint":
    "რგოლზე პოზიცია სიგნალის სიძლიერეს ასახავს, და არა მანძილს",
  "mesh.radar.set_online":
    "დააყენე შენი სტატუსი პროფილში ონლაინზე, რომ კვანძები აღმოაჩინო",
  "mesh.radar.in_range": "მიღწევადია",
  "mesh.radar.recently_seen": "ცოტა ხნის წინ ნანახი",
  "mesh.radar.peer_hint":
    "ხსნის ამ კვანძისთვის მიწერის ან გადახდის პარამეტრებს",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "ახლახან",
  "mesh.peer.none": "ახლოს კვანძები არ არის",
  "mesh.peer.none_desc":
    "ბლუთუზის რადიუსში მყოფი სხვა Airhop-ის ან bitchat-ის მოწყობილობები აქ გამოჩნდება.",
  "mesh.peer.id_copied": "კვანძის ID დაკოპირდა",
  "mesh.peer.copy_id": "კვანძის ID-ის კოპირება",
  "mesh.peer.their_name": "ჰქვია {name}",
  "mesh.peer.in_range": "მიღწევადია",
  "mesh.peer.relay": "სარელეო კვანძი",
  "mesh.peer.relay_body":
    "რადიო, რომელიც ვიღაცამ ჩართული დატოვა მეშის გასაფართოებლად. ის ატარებს შეტყობინებებს, რომლებსაც ვერ კითხულობს. აქ არავინაა, ვისაც მისწერდი.",
  "mesh.peer.send_dm": "პირადი შეტყობინების გაგზავნა",
  "mesh.peer.message": "შეტყობინება",
  "mesh.peer.send_sats": "ecash-ის გაგზავნა",
  "mesh.peer.amount_placeholder": "თანხა sat-ებში",
  "mesh.peer.amount_first": "ecash-ის გაგზავნა, ჯერ შეიყვანე თანხა",
  "mesh.peer.cancel_send": "ecash-ის გაგზავნის გაუქმება",
  "mesh.peer.view_peer": "კვანძის {name} ნახვა",
  "mesh.peer.view_peer_online": "კვანძის {name} ნახვა, ონლაინ",
  "mesh.peer.last_seen": "ბოლოს ნანახი {ago} წინ",
  "mesh.peer.send_amount": "{amount} sat-ის გაგზავნა",
  "mesh.peer.direct": "პირდაპირი კავშირი",
  "mesh.peer.check_distance": "მანძილის შემოწმება",
  "mesh.peer.checking": "მოწმდება",
  "mesh.peer.no_reply": "პასუხი არ არის",
  "mesh.peer.no_reply_hint":
    "შესაძლოა გადავიდნენ, ან მათი აპლიკაცია არ პასუხობს",
  "mesh.peer.rtt": "{ms} მწმ",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "რეგიონი",
  "mesh.level.province": "მხარე",
  "mesh.level.city": "ქალაქი",
  "mesh.level.neighborhood": "უბანი",
  "mesh.level.block": "კვარტალი",
  "mesh.level.building": "შენობა",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "დასახარჯი",
  "wallet.balance.unit_hint": "გადართავს სატოშსა და ბიტკოინს შორის",
  "wallet.balance.a11y": "ბალანსი {value} {unit}",
  "wallet.balance.locked":
    "საფულის საცავი ჩაკეტილია. Ecash-ის დასტურები ინახება დაშიფრულ ფაილში, რომლის გასაღებიც მოწყობილობის საკვანძოშია, და მისი გახსნა ვერ მოხერხდა. განბლოკე მოწყობილობა და ხელახლა გახსენი Airhop.",
  "wallet.balance.tor_blocked":
    "Tor ჩართულია, ამიტომ ზარაფხანასთან მოთხოვნები დაბლოკილია: ისინი ღია ქსელით გავიდოდა და შენს IP-ს დასტურებთან დააკავშირებდა. მეშით გაგზავნა და მიღება მაინც მუშაობს. დაუშვი ზარაფხანის ტრაფიკი პარამეტრებში, უსაფრთხოებაში.",
  "wallet.balance.unconfirmed_note": "{amount} ჯერ არ დადასტურდა ზარაფხანასთან",
  "wallet.balance.reserved_note":
    "{amount} დარეზერვებულია მიმდინარე გაგზავნისთვის",
  "wallet.balance.other_mint_note": "{amount} სხვა ზარაფხანის ანგარიშზე",
  "wallet.balance.test_mint_note":
    "მოიცავს სატესტო ზარაფხანის სათამაშო ფულს. ეს არ არის ბიტკოინი და გატანა შეუძლებელია.",
  "wallet.token": "ტოკენი",
  "wallet.action.send": "ecash ტოკენის გაგზავნა",
  "wallet.action.send_disabled":
    "ecash ტოკენის გაგზავნა, ნულოვანი ბალანსით მიუწვდომელია",
  "wallet.action.receive": "ecash ტოკენის მიღება",
  "wallet.action.zap": "Nostr-ის კონტაქტისთვის zap-ის გაგზავნა",
  "wallet.action.zap_disabled":
    "Nostr-ის კონტაქტისთვის zap-ის გაგზავნა, ნულოვანი ბალანსით მიუწვდომელია",
  "wallet.action.add_mint": "Cashu ზარაფხანის დამატება",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "ტოკენის აწყობა ვერ მოხერხდა",
  "wallet.send.title": "ecash-ის გაგზავნა",
  "wallet.send.amount_in": "თანხა {unit}-ში",
  "wallet.send.body":
    "აწყობილია ოფლაინში იმ დასტურებისგან, რომლებიც უკვე გაქვს. ბალანსიდან საბოლოოდ არაფერი გადის, სანამ არ დაადასტურებ, რომ ტოკენი მივიდა.",
  "wallet.send.stale_fee_note":
    "საკომისიოები ბოლოს {days} დღის წინ შემოწმდა. თუ ამ ზარაფხანამ მას შემდეგ საკომისიო გაზარდა, გაგზავნა ოდნავ მეტი დაჯდება.",
  "wallet.send.fee_note":
    "{spend} {unit} შენი ბალანსიდან გადის; დამატებული {fee} ფარავს ზარაფხანის საკომისიოს, რომელსაც სხვა შემთხვევაში ის გადაიხდიდა",
  "wallet.send.qr_too_big":
    "ეს ტოკენი ძალიან ბევრ მონეტადაა დაყოფილი, რომ QR კოდში ჩაეტიოს. სანაცვლოდ გააზიარე ან დააკოპირე, ან განაახლე ზარაფხანაში გასაერთიანებლად.",
  "wallet.send.bearer_note":
    "ვისაც ეს სტრიქონი უჭირავს, ფული მისია. დასტურები დარეზერვებულია და არა დახარჯული: თუ ის ვერავის მიაღწევს, შეგიძლია დაიბრუნო „მოლოდინში“-დან.",
  "wallet.send.qr_too_big_short":
    "ეს ტოკენი ძალიან ბევრ მონეტადაა დაყოფილი, რომ QR კოდში ჩაეტიოს. სანაცვლოდ გააზიარე ან დააკოპირე.",
  "wallet.send.scan_note":
    "სთხოვე, თავისი საფულიდან დაასკანეროს ეს. დაბრუნებადი რჩება, სანამ მიწოდებულად არ მონიშნავ.",
  "wallet.send.mesh_note":
    "ტოკენი მეშით გადის დაშიფრული პირადი შეტყობინების სახით. ინტერნეტი არ სჭირდება.",
  "wallet.send.no_peers_note":
    "გახსენი მეშის ჩანართი ახლომდებარე მოწყობილობების საპოვნელად, ან ტოკენი სხვაგვარად გააზიარე.",
  "wallet.send.send_to": "გაგზავნა {name}-ს",
  "wallet.send.memo": "შენიშვნა (არასავალდებულო, ტოკენთან ერთად მიდის)",
  "wallet.send.building": "იწყობა…",
  "wallet.send.build": "ტოკენის აწყობა",
  "wallet.send.inexact_body":
    "შენი დასტურები ოფლაინში ზუსტად {amount} {unit}-ს ვერ ქმნიან. ყველაზე პატარა ტოკენი, რომელსაც ააწყობ, არის {spend} {unit}, ოფლაინში კი ხურდა არ არსებობს: დამატებული {extra} {unit} მიმღებს რჩება.\n\nინტერნეტთან დაკავშირებულ მდგომარეობაში ზარაფხანაში განახლება შენს დასტურებს ისეთ ნომინალებად დაყოფდა, რომ ზუსტი გამოსულიყო.",
  "wallet.send.send_amount": "{amount}-ის გაგზავნა",
  "wallet.send.sent_to": "{amount} {unit} გაეგზავნა {name}-ს",
  "wallet.send.sent_to_body":
    "{route} ის „მოლოდინში“ დაბრუნებადი რჩება, სანამ არ დაადასტურებ, რომ მიიღო, ან სანამ ზარაფხანა არ გვეტყვის, რომ დასტურები გამოსყიდულია.",
  "wallet.send.copy_token": "ტოკენის კოპირება",
  "wallet.send.share_token": "ტოკენის გაზიარება",
  "wallet.send.open_in_wallet": "ამ ტოკენის სხვა საფულეში გახსნა",
  "wallet.send.open_in_wallet_short": "საფულეში გახსნა",
  "wallet.send.to_peer": "ტოკენის გაგზავნა ახლომდებარე კვანძთან",
  "wallet.send.to_peer_short": "კვანძთან გაგზავნა",
  "wallet.send.mark_delivered": "მიწოდებულად მონიშვნა და დასრულება",
  "wallet.send.they_got_it": "მან მიიღო",
  "wallet.send.keep_pending": "ეს გაგზავნა მოლოდინში დატოვე",
  "wallet.send.decide_later": "მოგვიანებით გადაწყვეტ",
  "wallet.send.no_peers": "მიღწევადობის ზონაში კვანძები არ არის",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "ეს შენივე გადახდაა",
  "wallet.receive.own_payment_body":
    "ეს მონეტები ჯერ კიდევ დარეზერვებულია გაგზავნისთვის, რომელიც არ დაგისრულებია, ამიტომ მისაღები არაფერია. გამოიყენე „დაბრუნება“ იმ გადახდაზე, რომ პირდაპირ ბალანსში დაიბრუნო.",
  "wallet.receive.already_have": "უკვე შენს საფულეშია",
  "wallet.receive.already_have_body":
    "ამ ტოკენის ყველა დასტური უკვე აქ ინახება, ამიტომ არაფერი დამატებულა. ბალანსები არ შეცვლილა.",
  "wallet.receive.stored_unconfirmed":
    "შენახულია {mint}-იდან, მაგრამ ჯერ არ დადასტურებულა ზარაფხანასთან ({reason}).",
  "wallet.receive.offline": "ოფლაინ",
  "wallet.receive.redeemed_here":
    "გამოსყიდულია {mint}-ში. ეს დასტურები ახლა მხოლოდ შენია: გამგზავნის ასლი აღარ მუშაობს.",
  "wallet.receive.memo_quoted": "\n\n„{memo}“",
  "wallet.receive.redeemed_at":
    "გამოსყიდულია {mint}-ში. ახლა დამტკიცებულად შენია: ამ ტოკენის გამგზავნისეული ასლი აღარ მუშაობს.",
  "wallet.receive.stored_pending":
    "შენახულია {mint}-იდან, მაგრამ ზარაფხანას ჯერ არ დაუდასტურებია, რომ დაუხარჯავია{dleq}. განაახლე საფულის ჩანართიდან, როგორც კი ონლაინ იქნები.",
  "wallet.receive.dleq_inline":
    " (მისი ხელმოწერა მართლაც სწორია, ამიტომ ტოკენი ნამდვილია)",
  "wallet.receive.dleq_ok":
    "ზარაფხანის ხელმოწერა სწორია, ამიტომ ტოკენი ნამდვილია.",
  "wallet.receive.dleq_uncached":
    "ამ ზარაფხანის გასაღებები აქ არ ინახება, ამიტომ ხელმოწერის ოფლაინში შემოწმება ვერ მოხერხდა.",
  "wallet.receive.dleq_warning":
    "სანამ ონლაინ არ განაახლებ, გამგზავნს პრინციპში შეეძლო ის სხვაგან დაეხარჯა.",
  "wallet.receive.failed": "მიღება ვერ მოხერხდა",
  "wallet.receive.title": "ecash-ის მიღება",
  "wallet.receive.body":
    "ჩასვი Cashu ტოკენი. ონლაინ ის მაშინვე გამოისყიდება ზარაფხანაში; ოფლაინში ინახება და დასტურდება მომდევნო განახლებისას.",
  "wallet.receive.scan": "ecash QR კოდის სკანირება",
  "wallet.receive.scan_short": "QR-ის სკანირება",
  "wallet.receive.receiving": "მიიღება…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap მიღებულია {from}…-იდან და გამოსყიდულია შენს საფულეში.",
  "wallet.zap.title": "Nostr-ის ვინაობისთვის zap-ის გაგზავნა",
  "wallet.zap.not_npub": "არ არის npub",
  "wallet.zap.bad_key": "არასწორი გასაღები",
  "wallet.zap.invalid_pubkey": "საჯარო გასაღები არასწორია",
  "wallet.zap.invalid_pubkey_body":
    "შეიყვანე npub1… ან 64-სიმბოლოიანი თექვსმეტობითი Nostr-ის საჯარო გასაღები.",
  "wallet.zap.sent": "Nutzap გაიგზავნა",
  "wallet.zap.failed": "Zap ვერ მოხერხდა",
  "wallet.zap.body":
    "თუ ის NIP-61 nutzap-ის ინფორმაციას აქვეყნებს, ecash მის გასაღებზე იკეტება, ამიტომ სხვას ვერ დახარჯავს და უკან წაღებაც შეუძლებელია. თუ არა, ის დაბრუნებადი ტოკენის სახით მიდის. შეგატყობინებთ, რომელი მოხდა.",
  "wallet.zap.contact": "{name}-ისთვის zap-ის გაგზავნა",
  "wallet.zap.pubkey_placeholder": "npub1… ან 64-სიმბოლოიანი თექვსმეტობითი",
  "wallet.zap.sending": "იგზავნება…",
  "wallet.nostr.copied_body":
    "მიეცი ეს ვინმეს და შეეძლება, zap გამოგიგზავნოს Airhop-იდან ან ნებისმიერი სხვა Nostr საფულიდან, ბლუთუზის გარეშე.",
  "wallet.nostr.copy_key":
    "დააკოპირე შენი Nostr გასაღები, რომ zap-ები გამოგიგზავნონ",
  "wallet.nostr.your_key": "შენი Nostr გასაღები",

  // ---- Wallet: mints ----
  "wallet.mint.added": "ზარაფხანა დაემატა",
  "wallet.mint.add_failed": "ზარაფხანის დამატება ვერ მოხერხდა",
  "wallet.mint.added_named": "{name} დაემატა",
  "wallet.mint.added_body":
    "{mint} გამოსცემს {units}-ს. მისი გასაღებები ამ მოწყობილობაზე ინახება, ამიტომ მისი ტოკენების შემოწმება ახლა ინტერნეტის გარეშეც შეიძლება.",
  "wallet.mint.remove_plain":
    "წავშალოთ {mint} შენი საფულიდან? მისი შენახული გასაღებებიც წაიშლება, ამიტომ მისი ტოკენების ოფლაინში შემოწმება აღარ იქნება შესაძლებელი.",
  "wallet.mint.title": "ზარაფხანები",
  "wallet.mint.none": "ჯერ ზარაფხანა არ არის",
  "wallet.mint.none_desc":
    "ზარაფხანა გამოსცემს და გამოისყიდის შენს ecash-ს. დაამატე ერთი, რომ Lightning-ით შეიტანო, ან უბრალოდ მიიღე ტოკენი და მისი ზარაფხანა შენთვის თავად დაემატება.",
  "wallet.mint.add": "ზარაფხანის დამატება",
  "wallet.mint.add_body":
    "ზარაფხანა ინახავს ბიტკოინს, რომელიც შენს ecash-ს უზრუნველყოფს, ამიტომ აირჩიე ისეთი, რომელსაც იქ დაგროვილ ბალანსს ანდობდი. URL შენახვამდე მოწმდება. თუ არავის ენდობი, გაუშვი შენი საკუთარი Nutshell-ით.",
  "wallet.mint.consolidate_body":
    "ტოკენს მხოლოდ ერთი ზარაფხანის დასახელება შეუძლია, ამიტომ რამდენიმეზე გაბნეული ბალანსით ვერ გადაიხდი იმაზე მეტს, ვიდრე ყველაზე დიდს აქვს. Airhop-ს შეუძლია გადაიტანოს: დანარჩენი თითოეული ზარაფხანა იხდის Lightning ინვოისს, რომელსაც შენ მიერ არჩეული გამოსცემს. ჯდება მცირე მარშრუტიზაციის საკომისიო და სჭირდება ინტერნეტი.",
  "wallet.mint.add_short": "დამატება",
  "wallet.mint.checking": "მოწმდება…",
  "wallet.mint.remove_with_balance": "წავშალოთ ბალანსიანი ზარაფხანა?",
  "wallet.mint.remove": "ზარაფხანის წაშლა",
  "wallet.mint.delete_anyway": "მაინც წაშლა",
  "wallet.mint.consolidate": "ყველა ბალანსის ერთ ზარაფხანაში გადატანა",
  "wallet.mint.confirm_with": "დასტურების დადასტურება {mint}-თან",
  "wallet.mint.remove_a11y": "{mint}-ის წაშლა",
  "wallet.mint.available_amount": "ხელმისაწვდომია {amount} {unit}",
  "wallet.mint.split_across":
    "ბალანსი {count} ზარაფხანაშია გაბნეული. გადაიტანე ერთში.",
  "wallet.mint.move_everything_to": "ყველაფრის გადატანა {mint}-ში",
  "wallet.mint.consolidate_title": "ერთ ზარაფხანაში გადატანა",
  "wallet.mint.moving": "გადააქვს…",
  "wallet.mint.move": "გადატანა",
  "wallet.mint.moved": "გადატანილია",
  "wallet.mint.moved_body":
    "{amount} {unit} ახლა {mint}-შია, {fees} {unit} Lightning-ის მარშრუტიზაციის საკომისიოს შემდეგ.",
  "wallet.mint.nothing_moved": "არაფერი გადატანილა",
  "wallet.mint.destination": "· დანიშნულება",
  "wallet.mint.will_move": "· გადატანილი იქნება",
  "wallet.mint.issued_by": "გამომცემი",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop-ის საფულის შევსება",
  "wallet.ln.invoice_failed": "ინვოისის შექმნა ვერ მოხერხდა",
  "wallet.ln.price_failed": "ამ ინვოისის ფასის დათვლა ვერ მოხერხდა",
  "wallet.ln.paid": "გადახდილია",
  "wallet.ln.deposit_credited":
    "ინვოისი გადახდილია და {mint}-მა გამოსცა {amount} {unit}. ეს ბალანსი დადასტურებულია: მაშინვე შეგიძლია ოფლაინში დახარჯო.",
  "wallet.ln.withdrawn":
    "{paid} sat გადახდილია Lightning-ით. ზარაფხანამ {fee} sat მარშრუტიზაციის საკომისიო ჩამოჭრა.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sat გადახდილია Lightning-ით. ზარაფხანამ {fee} sat მარშრუტიზაციის საკომისიო ჩამოჭრა და რეზერვიდან {change} sat შენს ბალანსს დაუბრუნა.",
  "wallet.ln.payment_failed": "გადახდა ვერ მოხერხდა",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "აქციე Lightning-ის sat-ები ecash-ად, რომელსაც ოფლაინში დახარჯავ, ან გაიტანე ecash ნებისმიერ Lightning ინვოისზე. ორივეს ინტერნეტი და ზარაფხანა სჭირდება.",
  "wallet.ln.deposit_body":
    "ზარაფხანა გაძლევს ინვოისს. გადაიხადე ნებისმიერი Lightning საფულიდან და sat-ები დაბრუნდება ecash-ად, რომელსაც ოფლაინში დახარჯავ.",
  "wallet.ln.pay_invoice_for":
    "გადაიხადე ეს {amount} {unit}-იანი ინვოისი. საფულე გადახდას აკვირდება და შენს ecash-ს ავტომატურად გამოსცემს.",
  "wallet.ln.expired_body":
    "ამ ინვოისს ვადა გაუვიდა. თუ უკვე გადაიხადე, ბალანსი ავტომატურად ჩაირიცხება.",
  "wallet.ln.waiting_expires": "ელოდება გადახდას · ვადა იწურება {countdown}-ში",
  "wallet.ln.withdraw_body":
    "ჩასვი bolt11 ინვოისი და ზარაფხანა მას შენი ecash-იდან გადაიხდის. ჯერ მარშრუტიზაციის რეზერვს გამოგითვლიან; რასაც მარშრუტიზაცია არ გამოიყენებს, ბალანსში დაბრუნდება.",
  "wallet.ln.up_to": "მაქსიმუმ {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit}-ის გადახდა",
  "wallet.ln.deposit": "sat-ების შეტანა Lightning-ით",
  "wallet.ln.deposit_short": "შეტანა",
  "wallet.ln.withdraw": "გატანა Lightning ინვოისზე",
  "wallet.ln.withdraw_short": "გატანა",
  "wallet.ln.deposit_title": "შეტანა Lightning-ით",
  "wallet.ln.amount_placeholder": "თანხა sat-ებში",
  "wallet.ln.requesting": "ითხოვს…",
  "wallet.ln.get_invoice": "ინვოისის მიღება",
  "wallet.ln.copy_invoice": "ინვოისის კოპირება",
  "wallet.ln.open_wallet": "Lightning საფულეში გახსნა",
  "wallet.ln.open_wallet_short": "საფულეში გახსნა",
  "wallet.ln.waiting": "ელოდება გადახდას…",
  "wallet.ln.new_invoice": "ახალი ინვოისის შექმნა",
  "wallet.ln.new_invoice_short": "ახალი ინვოისი",
  "wallet.ln.withdraw_title": "გატანა Lightning-ზე",
  "wallet.ln.scan_invoice": "Lightning ინვოისის QR კოდის სკანირება",
  "wallet.ln.paid_from": "გადახდილია",
  "wallet.ln.invoice": "ინვოისი",
  "wallet.ln.routing_reserve": "მარშრუტიზაციის რეზერვი",
  "wallet.ln.reserved": "დარეზერვებულია ბალანსიდან",
  "wallet.ln.paying": "იხდის…",
  "wallet.ln.get_quote": "შეთავაზების მიღება",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "სარეზერვო ასლი",
  "wallet.backup.setup_failed": "სარეზერვო ასლის დაყენება ვერ მოხერხდა",
  "wallet.backup.on": "სარეზერვო ასლი ჩართულია",
  "wallet.backup.on_body":
    "შენი ბალანსი ახლა იმ თორმეტი სიტყვიდან აღდგება.\n\nყველაფერი, რაც სხვამ მოგცა, ფრაზის მიღმა რჩება, სანამ ზარაფხანაში არ განაახლებ, აღდგენას კი შენი ზარაფხანების სია სჭირდება, ამიტომ ჩაიწერე ის სიტყვების გვერდით.",
  "wallet.backup.no_phrase": "ფრაზა შენახული არ არის",
  "wallet.backup.no_phrase_body":
    "აღდგენის ფრაზის წაკითხვა მოწყობილობის საკვანძოდან ვერ მოხერხდა. განბლოკე მოწყობილობა და სცადე ხელახლა.",
  "wallet.backup.replace_title": "შევცვალოთ შენი ამჟამინდელი ფრაზა?",
  "wallet.backup.replace_body":
    "შენ უკვე გაქვს აღდგენის ფრაზა. სხვის აღდგენა მას ჩაანაცვლებს. ძველი ფრაზით დაფარული მონეტები ამ მოწყობილობაზე დასახარჯი რჩება, მაგრამ აღდგენადი აღარ იქნება, ამიტომ სანამ გააგრძელებ, დარწმუნდი, რომ ძველი სიტყვები ჩაწერილი გაქვს.",
  "wallet.backup.replace": "ჩანაცვლება",
  "wallet.backup.invalid_phrase": "ეს ფრაზა არასწორია",
  "wallet.backup.invalid_phrase_body":
    "ფრაზას ჩაშენებული საკონტროლო ჯამი აქვს და ეს მას ვერ გადის. მოძებნე არასწორად აკრეფილი, გამოტოვებული ან ადგილნაცვალი სიტყვა.",
  "wallet.backup.not_bip39":
    "ეს არ არის BIP-39-ის სიტყვები: {words}. შეამოწმე მართლწერა.",
  "wallet.backup.add_mint_first": "ჯერ დაამატე ზარაფხანა",
  "wallet.backup.add_mint_first_body":
    "აღდგენა მუშაობს ზარაფხანისთვის კითხვით, თუ რომელ მონეტებს აწერდა ხელს შენთვის, ამიტომ მან უნდა იცოდეს, ვის ჰკითხოს. დაამატე ის ზარაფხანები, რომლებსაც იყენებდი, და შემდეგ აღადგინე.",
  "wallet.backup.restore_failed": "აღდგენა ვერ მოხერხდა",
  "wallet.backup.phrase": "აღდგენის ფრაზა",
  "wallet.backup.state_unconfirmed":
    "სარეზერვო ასლი ჩართულია, მაგრამ დაუდასტურებელია",
  "wallet.backup.state_off": "სარეზერვო ასლი გამორთულია",
  "wallet.backup.badge_on": "ჩართული",
  "wallet.backup.badge_unconfirmed": "დაუდასტურებელი",
  "wallet.backup.badge_off": "გამორთული",
  "wallet.backup.view": "აღდგენის ფრაზის ნახვა",
  "wallet.backup.setup": "აღდგენის ფრაზის დაყენება",
  "wallet.backup.view_short": "ფრაზის ნახვა",
  "wallet.backup.setup_short": "დაყენება",
  "wallet.backup.restore": "საფულის აღდგენა აღდგენის ფრაზიდან",
  "wallet.backup.restore_short": "აღდგენა",
  "wallet.backup.setup_title": "აღდგენის ფრაზის დაყენება",
  "wallet.backup.on_body_short":
    "შენი ბალანსი ახალ მოწყობილობაზე შენი თორმეტი სიტყვიდან აღდგება.",
  "wallet.backup.unconfirmed_body":
    "შენ არასოდეს დაგიდასტურებია, რომ ჩაწერილი ასლი გაქვს. ახლა სიტყვები მხოლოდ ამ ტელეფონზეა, სწორედ იმაზე, რასაც სარეზერვო ასლი უნდა გადაურჩეს. ნახე ფრაზა და ჩაიწერე.",
  "wallet.backup.not_covered":
    "{amount} ჯერ არ არის დაფარული. მონეტებს, რომლებიც მოგცეს, გამგზავნის საიდუმლოები აქვთ, ამიტომ შენს ფრაზაში მხოლოდ გაცვლის შემდეგ ხვდებიან. განაახლე ზარაფხანა, რომ დაიცვა ისინი.",
  "wallet.backup.off_body":
    "შენი ecash მხოლოდ ამ ტელეფონზე არსებობს. თუ დაკარგავ, ფულს ვერავინ დააბრუნებს, შენც კი. აღდგენის ფრაზა თორმეტი სიტყვაა, რომელსაც შენი ბალანსის ნებისმიერ ადგილას აღდგენა შეუძლია.",
  "wallet.backup.about_to_see":
    "შენ თორმეტ სიტყვას დაინახავ. ისინი თავად არის ფული.",
  "wallet.backup.exact_order":
    "თორმეტი სიტყვა, ზუსტად ამ თანმიმდევრობით. ვისაც ისინი აქვს, შენი ბალანსიც აქვს.",
  "wallet.backup.verify_body":
    "ფრაზა, რომელიც არავის ჩაუწერია, უარესია, ვიდრე ფრაზის არქონა, რადგან უსაფრთხოების ბადესავით გამოიყურება, რომელიც სინამდვილეში არ არსებობს. ორი სიტყვა დასადასტურებლად.",
  "wallet.backup.verify_mismatch": "არ ემთხვევა. შეამოწმე შენი ჩაწერილი ასლი.",
  "wallet.backup.restore_body":
    "შეიყვანე თორმეტი სიტყვა. Airhop თავიდან გამოითვლის შენს მონეტებს და თითოეულ ზარაფხანას ჰკითხავს, რომელს აწერდა ხელს, ასე რომ ბალანსი ზარაფხანის ჩანაწერებიდან ბრუნდება.",
  "wallet.backup.warn_secret":
    "ვინც მათ წაიკითხავს, შენს ბალანსს წაიღებს. ნუ გადაიღებ ეკრანის სურათს და ნუ შეინახავ ამ ტელეფონზე.",
  "wallet.backup.warn_paper":
    "ჩაწერე ისინი ქაღალდზე და შეინახე უსაფრთხო ადგილას. თუ ტელეფონი დაიკარგა, Airhop მათ ხელახლა ვერ გაჩვენებს.",
  "wallet.backup.warn_scope":
    "ისინი მხოლოდ შენს ecash-ს აღადგენს. შენი ვინაობა, მიმოწერები და კონტაქტები არ არის დაფარული.",
  "wallet.backup.warn_mints":
    "აღდგენას ზარაფხანისთვის კითხვა უწევს, თუ რომელ მონეტებს აწერდა ხელს, ამიტომ ჩაიწერე შენი ზარაფხანების სია სიტყვების გვერდით.",
  "wallet.backup.preparing": "მზადდება…",
  "wallet.backup.show_phrase": "ჩემი ფრაზის ჩვენება",
  "wallet.backup.your_phrase": "შენი აღდგენის ფრაზა",
  "wallet.backup.write_down": "ჩაიწერე ესენი",
  "wallet.backup.copy_phrase": "აღდგენის ფრაზის კოპირება ბუფერში",
  "wallet.backup.copy_clipboard": "ბუფერში კოპირება",
  "wallet.backup.written_down": "ჩავიწერე",
  "wallet.backup.check_copy": "შეამოწმე შენი ასლი",
  "wallet.backup.confirm": "დადასტურება",
  "wallet.backup.restore_title": "აღდგენა ფრაზიდან",
  "wallet.backup.phrase_placeholder": "თორმეტი სიტყვა, გამოყოფილი ხარვეზებით",
  "wallet.backup.no_mints_yet":
    "ჯერ ზარაფხანები დამატებული არ არის. აღდგენას კონკრეტული ზარაფხანისთვის კითხვა უწევს, ამიტომ ჯერ დაამატე ის, რომლებსაც იყენებდი.",
  "wallet.backup.scanning": "სკანირდება…",
  "wallet.backup.restore_progress":
    "{mint} · გასაღებების ნაკრები {step} / {total}",
  "wallet.backup.will_scan":
    "დასკანერდება: {mints}. ზარაფხანას, რომელიც არ დაგიმატებია, არასოდეს ეკითხებიან, ამიტომ იქაური ბალანსი უხილავი რჩება.",
  "wallet.backup.word_n": "სიტყვა {position}",
  "wallet.backup.unreachable_mints":
    "ვერ მივწვდით: {mints}. იქაური ბალანსი კვლავ არსებობს. სცადე უკეთესი კავშირისას.",
  "wallet.backup.nothing_recovered":
    "დასკანერებული ზარაფხანებიდან არაფერი აღდგა.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "მოვნიშნოთ მიღებულად?",
  "wallet.delivered.body":
    "ეს საბოლოოდ ათავისუფლებს {amount} {unit}-ს. თუ სინამდვილეში არასოდეს მისულა, დაბრუნებას ვეღარ შეძლებ.",
  "wallet.delivered.body_generic":
    "ეს საბოლოოდ ათავისუფლებს დარეზერვებულ თანხას. თუ სინამდვილეში არასოდეს მისულა, დაბრუნებას ვეღარ შეძლებ.",
  "wallet.delivered.cancel": "ჯერ არა",
  "wallet.delivered.confirm": "მან მიიღო",
  "wallet.reclaim.title": "დავაბრუნოთ ეს ტოკენი?",
  "wallet.reclaim.body":
    "{amount} {unit} შენს ბალანსში ბრუნდება. გააკეთე ეს მხოლოდ მაშინ, თუ ტოკენი ვერავის მიაღწია: თუ მას უკვე აქვს სტრიქონი, ვინც პირველი გამოისყიდის ზარაფხანაში, ფული მას რჩება, და ეს შეიძლება ის იყოს.",
  "wallet.reclaim.keep": "მოლოდინში დატოვება",
  "wallet.reclaim.confirm": "დაბრუნება",
  "wallet.copied.token_body":
    "ტოკენი შენს ბუფერშია. ის აქ დარეზერვებული რჩება, სანამ მიწოდებულად არ მონიშნავ, ამიტომ თუ პირველი მცდელობა ჩავარდა, ხელახლა ჩასვამ.",
  "wallet.copied.phrase_body":
    "ჩასვი პაროლების მენეჯერში და შემდეგ გაასუფთავე ბუფერი. სხვა აპლიკაციებს ბუფერის წაკითხვა შეუძლიათ, ზოგიერთ კონფიგურაციაში კი ის შენს სხვა მოწყობილობებზეც სინქრონდება.",
  "wallet.refresh.failed": "განახლება ვერ მოხერხდა",
  "wallet.refresh.partly": "ნაწილობრივ განახლდა",
  "wallet.refresh.done": "განახლდა",
  "wallet.refresh.unreachable":
    "ვერ მივწვდით {mints}-ს. დანარჩენი ყველაფერი განახლებულია.",
  "wallet.refresh.swapped":
    "{amount} {unit} დადასტურდა და ახალ დასტურებზე გაიცვალა.",
  "wallet.refresh.secured":
    "{amount} {unit} ახლა შენი აღდგენის ფრაზითაა დაფარული.",
  "wallet.refresh.all_confirmed":
    "აქ ყველაფერი უკვე დადასტურებული იყო ზარაფხანასთან.",
  "wallet.pending.title": "მოლოდინში",
  "wallet.pending.reserved_desc":
    "აწყობილი და დარეზერვებული, მიწოდება დაუდასტურებელი. დასტურები შენი ბალანსიდან გამოტანილია, რომ ორჯერ ვერ დაიხარჯოს.",
  "wallet.pending.locked_desc":
    "უკვე დაკეტილია მიმღების გასაღებზე, ამიტომ მხოლოდ მას შეუძლია დახარჯოს. უბრალოდ ჯერ არ მიუღწევია. გააზიარე ტოკენი დასასრულებლად.",
  "wallet.pending.show_qr": "ამ ტოკენის QR კოდად ჩვენება",
  "wallet.pending.copy_again": "ტოკენის ხელახლა კოპირება",
  "wallet.pending.share_again": "ტოკენის ხელახლა გაზიარება",
  "wallet.pending.mark_delivered": "ამ ტოკენის მიწოდებულად მონიშვნა",
  "wallet.pending.delivered": "მიწოდებულია",
  "wallet.pending.reclaim_into": "ამ ტოკენის დაბრუნება შენს ბალანსში",
  "wallet.activity.title": "აქტივობა",
  "wallet.activity.none": "ჯერ არაფერია",
  "wallet.activity.none_desc":
    "გადახდები, რომლებსაც გზავნი და იღებ, აქ გამოჩნდება, უახლესი პირველი, თითოეულის ზარაფხანითა და საკომისიოთი.",
  "wallet.activity.show_fewer": "ნაკლები გადახდის ჩვენება",
  "wallet.activity.show_less": "ნაკლების ჩვენება",
  "wallet.activity.received_unconfirmed": "მიღებულია, დაუდასტურებელი",
  "wallet.activity.received": "მიღებულია",
  "wallet.activity.receive_failed": "მიღება ვერ მოხერხდა",
  "wallet.activity.reclaimed": "დაბრუნებულია",
  "wallet.activity.send_failed": "გაგზავნა ვერ მოხერხდა",
  "wallet.activity.sent": "გაგზავნილია",
  "wallet.activity.status_pending": "მოლოდინში",
  "wallet.activity.status_failed": "ვერ მოხერხდა",
  "wallet.activity.status_reclaimed": "დაბრუნებული",
  "wallet.activity.status_expired": "ვადაგასული",
  "wallet.activity.ln_deposit": "Lightning-ის შეტანა",
  "wallet.activity.ln_withdrawal": "Lightning-ის გატანა",
  "wallet.activity.nutzap_received": "Nutzap მიღებულია",
  "wallet.activity.spent_removed": "დახარჯული დასტურები წაიშალა",
  "wallet.activity.refreshed": "დასტურები განახლდა",
  "wallet.activity.refreshing": "დასტურები ახლდება",
  "wallet.activity.just_now": "ახლახან",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "მეში ოფლაინია",
  "wallet.mesh_offline_body":
    "მეშის სერვისი არ მუშაობს, ამიტომ ტოკენის გადასაცემი არავინაა. ის დარეზერვებული რჩება „მოლოდინში“.",
  "wallet.xfer.route_mesh": "პირდაპირ მის მოწყობილობას გადაეცა მეშით.",
  "wallet.xfer.route_nostr":
    "ის ბლუთუზის რადიუსს გარეთ იყო, ამიტომ ინტერნეტით წავიდა.",
  "wallet.xfer.route_courier":
    "ახლა მისკენ გზა არ არის. სხვა მოწყობილობები წაიღებენ და მიიტანენ, როცა რომელიმე მას მიწვდება.",
  "wallet.xfer.route_queued":
    "ჯერ ვერ მივწვდებით. რიგშია და გაიგზავნება, როგორც კი შესაძლებელი გახდება.",
  "wallet.xfer.mesh_offline_body":
    "მეშის სერვისი არ მუშაობს, ამიტომ ტოკენის გადაცემის გზა არ არსებობს. არაფერი ჩამოჭრილა.",
  "wallet.xfer.could_not_send": "გაგზავნა ვერ მოხერხდა",
  "wallet.xfer.inexact_body":
    "შენი დასტურები ოფლაინში ზუსტად {amount} {unit}-ს ვერ ქმნიან. ყველაზე პატარა ტოკენი, რომელსაც ააწყობ, არის {spend} {unit}, დამატებული {extra} {unit} კი მას რჩება დაბრუნების გარეშე.\n\nინტერნეტთან დაკავშირებულ მდგომარეობაში ზარაფხანაში განახლება შენს დასტურებს ისეთ ნომინალებად ყოფს, რომ ზუსტი გამოვიდეს.",
  "wallet.xfer.send_amount": "{amount}-ის გაგზავნა",
  "wallet.xfer.mesh_offline": "მეში ოფლაინია",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "დაკეტილია მის გასაღებზე და გამოქვეყნებულია Nostr-ზე. ის მისია, ონლაინ არის თუ არა.",
  "wallet.pay.rail_nutzap_dm":
    "დაკეტილია მის გასაღებზე. რელემ არ მიიღო, ამიტომ შეტყობინების სახით მივიდა.",
  "wallet.pay.rail_nutzap_undelivered":
    "დაკეტილია მის გასაღებზე, მაგრამ ჯერ ვერაფერმა წაიღო. რიგშია, ტოკენი კი „მოლოდინში“.",
  "wallet.pay.final":
    "დაკეტილი გადახდები არ ბრუნდება: ახლა ამ მონეტების დახარჯვა მხოლოდ მის გასაღებს შეუძლია.",
  "wallet.pay.reclaimable":
    "საფულის ჩანართიდან დაბრუნებადი რჩება, სანამ არ დაადასტურებ, რომ მივიდა.",
  "wallet.pay.why": "ასე გაიგზავნა, რადგან {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} {name}-ს",
  "wallet.pay.thread_receipt":
    "გააგზავნე {amount} {unit}, დაკეტილი მის გასაღებზე.",
  "wallet.pay.title": "ecash-ის გაგზავნა",
  "wallet.pay.to": "{name}-ს",
  "wallet.pay.amount": "თანხა sat-ებში",
  "wallet.pay.memo": "შენიშვნა (არასავალდებულო, საჯარო)",
  "wallet.pay.send": "გაგზავნა",
  "wallet.pay.sending": "იგზავნება…",
  "wallet.pay.action": "ecash-ის გაგზავნა",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "კამერასთან წვდომა",
  "wallet.scan.camera_purpose": "დაასკანერო ecash QR კოდი",
  "wallet.scan.photo_label": "ფოტოებთან წვდომა",
  "wallet.scan.photo_purpose": "წაიკითხო ecash QR სურათიდან",
  "wallet.scan.no_token": "ამ სურათში ecash ტოკენი არ მოიძებნა.",
  "wallet.scan.no_invoice": "ამ სურათში Lightning ინვოისი არ მოიძებნა.",
  "wallet.scan.unreadable": "ამ სურათის წაკითხვა ვერ მოხერხდა.",
  "wallet.scan.camera_failed":
    "კამერის გაშვება ვერ მოხერხდა. დახურე სხვა კამერის აპლიკაციები და სცადე ხელახლა.",
  "wallet.scan.close": "სკანერის დახურვა",
  "wallet.scan.on_device":
    "ის ამ მოწყობილობაზე იკითხება; არაფერი არსად არ იგზავნება.",
  "wallet.scan.aim_token": "მიმართე ecash QR კოდზე.",
  "wallet.scan.aim_invoice": "მიმართე Lightning ინვოისის QR კოდზე.",
  "wallet.scan.title_token": "ecash-ის სკანირება",
  "wallet.scan.title_invoice": "ინვოისის სკანირება",
  "wallet.scan.desc_token":
    "წაიკითხე Cashu ტოკენი სხვა საფულიდან. მუშაობს ნებისმიერ Cashu საფულესთან, არა მხოლოდ Airhop-თან.",
  "wallet.scan.desc_invoice":
    "წაიკითხე Lightning ინვოისი, რომ შენი ბალანსიდან გადაიხადო.",
  "wallet.scan.use_camera_a11y": "სკანირება კამერით",
  "wallet.scan.use_camera": "კამერის გამოყენება",
  "wallet.scan.pick_image_a11y": "QR კოდის წაკითხვა შენახული სურათიდან",
  "wallet.scan.pick_image": "ფოტოებიდან არჩევა",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "რა არის Cashu?",
  "wallet.explain.intro":
    "Cashu არის ecash ბიტკოინისთვის. ტოკენი არის სტრიქონი, რომელიც ფულად ღირს ყველასთვის, ვისაც უჭირავს, და რომელსაც ზარაფხანა ბრმად აწერს ხელს, ისე რომ ვერ იგებს, ვინ რა დახარჯა. ანგარიშების და შესვლის გარეშე.",
  "wallet.explain.send": "გაგზავნა",
  "wallet.explain.send_desc":
    "თანხას აქცევს ტოკენად, რომელსაც ახლომდებარე კვანძს ბლუთუზით გადასცემ, ან ტექსტად გააზიარებ. მუშაობს ინტერნეტის გარეშე. დასტურები დარეზერვებული რჩება, სანამ არ დაადასტურებ, რომ მივიდა.",
  "wallet.explain.receive": "მიღება",
  "wallet.explain.receive_desc":
    "ჩასვი ტოკენი დასამატებლად. ონლაინ ის მაშინვე იცვლება ზარაფხანაში, რაც მას დამტკიცებულად შენს ხდის. ოფლაინში ინახება და დაუდასტურებლად მოინიშნება, სანამ არ განაახლებ.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "იხდის Nostr-ის ვინაობისთვის. თუ ის NIP-61 nutzap-ის ინფორმაციას აქვეყნებს, ecash მის გასაღებზე იკეტება, ისე რომ მხოლოდ მას შეუძლია დახარჯოს. თუ არა, უკან იხევს დაშიფრულ პირად შეტყობინებამდე. სჭირდება ინტერნეტი.",
  "wallet.explain.add_mint": "ზარაფხანის დამატება",
  "wallet.explain.add_mint_desc":
    "ინახავს ზარაფხანას, რომელიც შენს ecash-ს გამოსცემს და გამოისყიდის, და ინახავს მის საჯარო გასაღებებს, რომ მისი ტოკენები ოფლაინში შემოწმდეს. აირჩიე ისეთი, რომელსაც იქ დაგროვილ ბალანსს ანდობდი.",
  "wallet.explain.phrase": "აღდგენის ფრაზა",
  "wallet.explain.phrase_desc":
    "შენი მონეტები გამოითვლება თორმეტი სიტყვიდან, რომელსაც საფულე თავიდანვე ქმნის, ამიტომ ახალ ტელეფონს შეუძლია ბალანსი აღადგინოს იმით, რომ შენს ზარაფხანებს ჰკითხოს, რომელ მონეტებს აწერდნენ ხელს. სანამ არ ნახავ და ჩაიწერ, ისინი მხოლოდ ამ ტელეფონზე არსებობს.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "საფულე ჩაკეტილია",
  "wallet.err.mint_unreachable": "ზარაფხანა მიუწვდომელია",
  "wallet.err.tor_blocked": "დაბლოკილია Tor-ის ჩართვისას",
  "wallet.err.insufficient": "ბალანსი არ არის საკმარისი",
  "wallet.err.exact_amount": "ზუსტად ამ თანხის გაგზავნა შეუძლებელია",
  "wallet.err.no_mint": "ზარაფხანა არ არის",
  "wallet.err.mint_unsupported": "ზარაფხანას ეს არ შეუძლია",
  "wallet.err.mint_refused": "ზარაფხანამ უარი თქვა",
  "wallet.err.unreadable": "წაუკითხავი ტოკენი",
  "wallet.err.rejected": "ტოკენი უარყოფილია",
  "wallet.err.already_spent": "უკვე დახარჯულია",
  "wallet.err.change_pending": "გადახდილია, ხურდა მოლოდინშია",
  "wallet.svc.mint_unreachable": "ზარაფხანას ვერ მივწვდით.",
  "wallet.svc.tor_ios": "iOS-ზე ზარაფხანასთან მოთხოვნები Tor-ით არ გადის.",
  "wallet.svc.tor_ios_body":
    "Arti მხოლოდ Nostr-ის WebSocket-ებს ფარავს, ამიტომ ეს მოთხოვნა ზარაფხანას ღია ქსელით მიაღწევდა და შენს IP-ს ამ დასტურებთან დააკავშირებდა. დაუშვი პარამეტრები > უსაფრთხოება-ში, ან ჯერ გამორთე Tor. მეშით ecash-ის გაგზავნა და მიღება მაინც მუშაობს.",
  "wallet.svc.tor_paused": "Tor ჩართულია, მაგრამ არ არის დაკავშირებული.",
  "wallet.svc.tor_paused_body":
    "Orbot-მა მიმართვა შეწყვიტა, ამიტომ ეს მოთხოვნა ზარაფხანას ღია ქსელით მიაღწევდა და შენს IP-ს ამ დასტურებთან დააკავშირებდა. ხელახლა გახსენი Orbot, ან გამორთე Tor. მეშით ecash-ის გაგზავნა და მიღება მაინც მუშაობს.",
  "wallet.svc.keys_uncached":
    "ამ ზარაფხანის გასაღებები ამ მოწყობილობაზე არ ინახება.",
  "wallet.svc.keys_uncached_body":
    "გახსენი საფულე ერთხელ ონლაინ, რომ ჩამოიტანო ისინი.",
  "wallet.svc.phrase_invalid": "ეს აღდგენის ფრაზა არასწორია.",
  "wallet.svc.phrase_invalid_body":
    "მოძებნე არასწორად აკრეფილი ან გამოტოვებული სიტყვა. ფრაზას ჩაშენებული საკონტროლო ჯამი აქვს, ამიტომ ერთი არასწორი სიტყვა მთელს აფუჭებს.",
  "wallet.svc.need_mint": "ჯერ დაამატე მინიმუმ ერთი ზარაფხანა.",
  "wallet.svc.need_mint_body":
    "აღდგენა მუშაობს ზარაფხანისთვის კითხვით, თუ რომელ მონეტებს აწერდა ხელს შენთვის, ამიტომ მან უნდა იცოდეს, ვის ჰკითხოს.",
  "wallet.svc.restored": "აღდგენილია აღდგენის ფრაზიდან",
  "wallet.svc.storage_locked": "საფულის საცავი ჩაკეტილია.",
  "wallet.svc.storage_locked_body":
    "Airhop ecash-ის დასტურებს ინახავს დაშიფრულ ფაილში, რომლის გასაღებიც მოწყობილობის საკვანძოშია. განბლოკე მოწყობილობა და ხელახლა გახსენი აპლიკაცია.",
  "wallet.svc.bad_url": "ეს სწორი URL არ არის.",
  "wallet.svc.needs_https": "ზარაფხანის URL უნდა იწყებოდეს https://-ით.",
  "wallet.svc.refuse_http":
    "უარს ვამბობთ ზარაფხანის გამოყენებაზე დაუცველი http-ით.",
  "wallet.svc.refuse_http_body":
    "ქსელის გზაზე მყოფ ნებისმიერს შეეძლო შენი დასტურების წაკითხვა ან შეცვლა. გამოიყენე https:// ზარაფხანა.",
  "wallet.svc.mint_not_saved": "ზარაფხანის შენახვა ვერ მოხერხდა.",
  "wallet.svc.unreadable_token": "ეს წაკითხვადი Cashu ტოკენი არ არის.",
  "wallet.svc.unreadable_token_body":
    "ტოკენები იწყება cashuA-ით ან cashuB-ით. შეამოწმე, ხომ არაფერი მოწყდა კოპირებისას.",
  "wallet.svc.wrong_mint":
    "ამ ტოკენს ხელი არ მოაწერა იმ ზარაფხანამ, რომელსაც ის ასახელებს.",
  "wallet.svc.already_spent": "ეს დასტურები უკვე დახარჯულია.",
  "wallet.svc.already_spent_body":
    "ვინც ეს ტოკენი გამოგზავნა, ჯერ თვითონ გამოისყიდა, ან იგივე ტოკენი სხვასაც გაუგზავნა.",
  "wallet.svc.receiving_offline": "მიღება ოფლაინში",
  "wallet.svc.amount_positive": "შეიყვანე ნულზე მეტი თანხა.",
  "wallet.svc.coins_raced": "ეს მონეტები ახლახან სხვა გადახდამ გამოიყენა.",
  "wallet.svc.coins_raced_body":
    "არაფერი ჩამოჭრილა. სცადე ხელახლა და საფულე სხვა ნაკრებს აირჩევს.",
  "wallet.svc.no_ecash": "ჯერ ecash არ არის.",
  "wallet.svc.no_ecash_body":
    "დაამატე ზარაფხანა და შეიტანე Lightning-ით, ან მიიღე ტოკენი ვინმესგან.",
  "wallet.svc.split_across_mints":
    "შენი ბალანსი რამდენიმე ზარაფხანაშია გაბნეული.",
  "wallet.svc.mint_says_spent":
    "ზარაფხანამ ეს დასტურები უკვე დახარჯულად დააფიქსირა.",
  "wallet.svc.issue_against_invoice":
    "გამოსცეს ecash Lightning ინვოისის საფუძველზე",
  "wallet.svc.pay_invoice": "გადაიხადოს Lightning ინვოისი",
  "wallet.svc.unknown_deposit": "უცნობი შენატანი.",
  "wallet.svc.invoice_expired_before": "ინვოისს ვადა გაუვიდა გადახდამდე.",
  "wallet.svc.invoice_expired": "ამ ინვოისს ვადა გაუვიდა.",
  "wallet.svc.invoice_unpaid": "ინვოისი ჯერ არ გადახდილა.",
  "wallet.svc.payment_unknown":
    "გადახდის სტატუსი უცნობია; შემოწმდება მომდევნო განახლებისას.",
  "wallet.svc.melt_change_pending": "შენი ინვოისი გადახდილია.",
  "wallet.svc.melt_change_pending_body":
    "ზარაფხანას ჯერ არ დაუბრუნებია გამოუყენებელი მარშრუტიზაციის საკომისიო. ის ავტომატურად მიიღება მომდევნო განახლებისას, და ამასობაში არაფერი იკარგება.",
  "wallet.svc.mint_did_not_pay":
    "ზარაფხანამ ეს ინვოისი არ გადაიხადა. შენი ბალანსი არ შეცვლილა.",
  "wallet.svc.not_an_invoice": "ეს Lightning ინვოისი არ არის.",
  "wallet.svc.not_an_invoice_body":
    "ჩასვი bolt11 ინვოისი, რომელიც lnbc-ით იწყება.",
  "wallet.svc.insufficient_for_invoice":
    "ამ ინვოისისთვის ბალანსი არ არის საკმარისი.",
  "wallet.svc.coins_raced_invoice_body":
    "არაფერი ჩამოჭრილა და ინვოისიც არ გადახდილა. სცადე ხელახლა.",
  "wallet.svc.same_mint": "აირჩიე სხვა დანიშნულების ზარაფხანა.",
  "wallet.svc.same_mint_body":
    "წყარო და დანიშნულება ერთი და იგივე ზარაფხანაა, ამიტომ გადასატანი არაფერია.",
  "wallet.svc.quote_failed_retried":
    "შეთავაზება ვერ მოხერხდა, გაერთიანება ხელახლა სცადეს",
  "wallet.svc.amount_unfit_retried":
    "თანხა არ მოერგო, გაერთიანება ხელახლა სცადეს",
  "wallet.svc.cannot_size": "ამ გადარიცხვის ზომის განსაზღვრა ვერ მოხერხდა.",
  "wallet.svc.insufficient_at_mint": "{mint}-ში ბალანსი არ არის საკმარისი.",
  "wallet.svc.inexact_title":
    "შენი დასტურები ოფლაინში ზუსტად {amount} {unit}-ს ვერ ქმნიან.",
  "wallet.svc.inexact_detail":
    "ყველაზე პატარა ტოკენი, რომელსაც გააგზავნი, არის {spend} {unit}. ოფლაინში ხურდა არ არსებობს, ამიტომ დამატებული {extra} {unit} მიმღებს რჩება.",
  "wallet.svc.no_single_mint":
    "არცერთ ცალკეულ ზარაფხანას არ აქვს {amount} {unit}. სხვადასხვა ზარაფხანის ecash ერთ ტოკენში ვერ გაერთიანდება: ჯერ გააერთიანე ერთ ზარაფხანაში, ან გააგზავნე ცალკეული თანხებით.",
  "wallet.svc.have_tried_send":
    "გაქვს {total} {unit}, გაგზავნა კი სცადე {amount}.",
  "wallet.svc.invoice_needs":
    "ამ ინვოისს სჭირდება {total} {unit} მარშრუტიზაციის რეზერვის ჩათვლით, შენ კი გაქვს {balance}.",
  "wallet.svc.nothing_to_move": "{mint}-ს გადასატანი {unit} არ აქვს.",
  "wallet.svc.consolidate_memo": "გაერთიანება {mint}-იდან",
  "wallet.svc.cannot_size_detail":
    "Lightning-ის მარშრუტიზაციის საკომისიოს შემდეგ {from}-ს {to}-ში სასარგებლო თანხის გადატანა არ შეუძლია. სცადე კონკრეტული, უფრო მცირე თანხის გადატანა.",
  "wallet.svc.mint_cannot": "{mint}-ს არ შეუძლია {action}.",
  "wallet.svc.no_nut": "ზარაფხანა NUT-{nut}-ს არ აცხადებს.",
  "wallet.svc.unknown_mint":
    "ეს გადახდა ისეთ ზარაფხანას ასახელებს, რომელსაც არ იყენებ.",
  "wallet.svc.unknown_mint_body":
    "თუ ენდობი, ჯერ თვითონ დაამატე ეს ზარაფხანა; არაფერი გამოისყიდება იმ ზარაფხანიდან, რომელიც არ აგირჩევია.",
  "wallet.svc.no_relay": "რელესთან კავშირი არ არის",
  "wallet.svc.no_shared_mint":
    "საკმარისი ბალანსის მქონე საერთო ზარაფხანა არ არის",
  "wallet.svc.no_nutzap_info":
    "მიმღებს nutzap-ის ინფორმაცია არ გამოუქვეყნებია (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "დაკეტილია მის გასაღებზე, მაგრამ ჯერ არ მიწოდებულა. გააზიარე ტოკენი ამ ტრანზაქციიდან დასასრულებლად.",
  "wallet.svc.swap_lost":
    "ზარაფხანამ ეს გაცვლა არასოდეს დაასრულა, ამიტომ მის საფუძველზე არაფერი გამოცემულა.",
  "wallet.svc.swap_unreadable":
    "ეს გაცვლა ისეთი სახით შეინახა, რომელსაც ეს ვერსია ვერ იმეორებს.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "გადამოწმებულია QR-ით",
  "contacts.qr.keys_unverified": "გასაღებები მიღებულია, გადამოწმებული არა",
  "contacts.qr.not_verified": "ჯერ გადამოწმებული არ არის",
  "contacts.qr.message": "შეტყობინება",
  "contacts.qr.add": "კონტაქტის დამატება",
  "contacts.qr.scan_title": "QR კოდის სკანირება",
  "contacts.qr.aim": "მიმართე კამერა მის QR კოდზე",
  "contacts.qr.add_desc": "მისწვდი იმას, ვინც მეშში ახლოს არ არის.",
  "contacts.qr.peer_id_hint":
    "კვანძის ID 16 სიმბოლოა. საკონტაქტო კოდი airhop:-ით იწყება.",
  "contacts.qr.or_scan": "ან დაასკანერე მისი QR",
  "contacts.qr.trust_note":
    "მხოლოდ ის QR, რომელსაც შენი კამერით სკანერებ, ადასტურებს მის გასაღებს. ჩასმულ კოდს მისი გასაღებები მოაქვს, მაგრამ არა იმის მტკიცებულება, რომ მისგანაა.",
  "contacts.qr.peer_id": "კვანძის ID ან საკონტაქტო კოდი",
  "contacts.qr.peer_id_placeholder": "ჩასვი ID ან საკონტაქტო კოდი",
  "contacts.qr.scan_camera_a11y": "QR კოდის სკანირება კამერით",
  "contacts.qr.scan_camera_desc": "გამოიყენე შენი კამერა",
  "contacts.qr.upload_a11y": "QR სურათის ატვირთვა გალერეიდან",
  "contacts.qr.upload": "ატვირთვა გალერეიდან",
  "contacts.qr.upload_desc": "აირჩიე შენახული QR სურათი",
  "contacts.qr.scan_a11y": "კონტაქტის დამატება QR კოდის სკანირებით",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "ჩასვი 16-სიმბოლოიანი კვანძის ID, airhop://peer/… ბმული, ან საკონტაქტო კოდი.",
  "contacts.scan.camera_label": "კამერასთან წვდომა",
  "contacts.scan.camera_purpose": "დაასკანერო კონტაქტის QR კოდი",
  "contacts.scan.camera_needed":
    "სკანირებისთვის საჭიროა კამერასთან წვდომა. კვანძის ID-ით მაინც შეგიძლია დამატება.",
  "contacts.scan.camera_failed":
    "კამერის გაშვება ვერ მოხერხდა. დახურე სხვა კამერის აპლიკაციები და სცადე ხელახლა.",
  "contacts.scan.photo_label": "ფოტოებთან წვდომა",
  "contacts.scan.photo_purpose": "დაასკანერო შენახული QR კოდი",
  "contacts.scan.photo_needed":
    "სურათის ასარჩევად საჭიროა ფოტოებთან წვდომა. კვანძის ID-ით მაინც შეგიძლია დამატება.",
  "contacts.scan.no_qr": "ამ სურათში Airhop-ის QR კოდი არ მოიძებნა.",
  "contacts.scan.unreadable": "ამ სურათიდან QR კოდის წაკითხვა ვერ მოხერხდა.",
  "contacts.scan.bitchat_expired":
    "ამ bitchat-ის კოდს ვადა გაუვიდა. სთხოვე, ხელახლა გახსნას თავისი QR.",
  "contacts.scan.tampered":
    "ეს QR კოდი არასწორია: მისი კვანძის ID გასაღებებს არ ემთხვევა. შესაძლოა შეცვლილია.",
  "contacts.scan.already_added": "უკვე შენს კონტაქტებშია",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "ელოდება კამერასთან წვდომას…",
  "contacts.verify.camera_off": "კამერა გამორთულია",
  "contacts.verify.open_settings": "პარამეტრების გახსნა",
  "contacts.verify.verified": "გადამოწმებულია",
  "contacts.verify.different": "სხვა კონტაქტი",
  "contacts.verify.scan_again": "ხელახლა სკანირება",
  "contacts.verify.failed": "გადამოწმება ვერ მოხერხდა",
  "contacts.verify.done": "მზადაა",
  "contacts.verify.title": "{name}-ის გადამოწმება",
  "contacts.verify.aim": "მიმართე კამერა მის QR კოდზე",
  "contacts.verify.camera_off_body":
    "ჩართე კამერასთან წვდომა პარამეტრებში, რომ QR-ით გადაამოწმო.",
  "contacts.verify.match_body":
    "{name}-ის გასაღები ემთხვევა. ამ კონტაქტს ენდობი.",
  "contacts.verify.different_body":
    "ეს QR სხვას ეკუთვნის. სთხოვე {name}-ს, თავისი კოდი აჩვენოს.",
  "contacts.verify.tampered_body":
    "ეს QR შეცვლილს ჰგავს: მისი ID გასაღებს არ ემთხვევა.",
  "contacts.verify.choose_title": "როგორ გინდა შემოწმება?",
  "contacts.verify.choose_body":
    "ორივე ადასტურებს, რომ ამ ტელეფონზე არსებული გასაღებები ნამდვილად {name}-ისაა.",
  "contacts.verify.method_scan": "მისი კოდის სკანირება",
  "contacts.verify.method_scan_sub": "ის შენთან ერთადაა",
  "contacts.verify.method_compare": "კოდის შედარება",
  "contacts.verify.method_compare_sub": "წაუკითხეთ ერთმანეთს ზარის დროს",
  "contacts.verify.no_keys":
    "ამ კონტაქტის გასაღებები ჯერ არ არის. მისწერე, ან დაასკანერე მისი კოდი, როცა შეხვდებით.",
  "contacts.verify.compare_title": "წაუკითხეთ ეს ერთმანეთს",
  "contacts.verify.compare_body":
    "{name} იმავე ექვს სიტყვას ხედავს. თუ ემთხვევა, ორივემ იცით, რომ გასაღებები ნამდვილია.",
  "contacts.verify.codes_match": "ემთხვევა",
  "contacts.verify.codes_differ": "არ ემთხვევა",
  "contacts.verify.compared_body":
    "შენ და {name}-მა ერთი და იგივე კოდი დაადასტურეთ. ეს კონტაქტი გადამოწმებულია.",

  // ---- Settings: shared chrome ----
  "settings.back": "უკან",
  "settings.coming_soon": "მალე",
  "settings.opens_externally": "{label}, იხსნება აპლიკაციის გარეთ",
  "settings.peer_id": "კვანძის ID",
  "settings.share_peer_id": "შენი კვანძის ID-ის გაზიარება",
  "settings.share_id_short": "ID-ის გაზიარება",
  "settings.peer_id_sheet.title": "შენი კვანძის ID",
  "settings.peer_id_sheet.copy": "კვანძის ID-ის კოპირება",
  "settings.peer_id_sheet.note":
    "ეს მხოლოდ მაშინ მუშაობს, როცა ორივე ბლუთუზის რადიუსში ხართ. იმისთვის, რომ ვინმემ ნებისმიერი ადგილიდან მოგწეროს, სანაცვლოდ შენი QR კოდი გააზიარე.",

  // ---- Settings: hub rows ----
  "settings.section.general": "ზოგადი",
  "settings.section.general_desc":
    "არჩევითი ფუნქციები, გაგზავნის გაუქმება, მედია, საწყისზე დაბრუნება",
  "settings.section.privacy": "პირადულობა და უსაფრთხოება",
  "settings.section.privacy_desc":
    "წინსვლის საიდუმლოება, ხელმოწერილი პაკეტები, დაბლოკილი კვანძები",
  "settings.section.network": "ქსელი და რელეები",
  "settings.section.network_desc":
    "ინტერნეტზე გადასვლა, nostr რელეები, bitchat-თან თავსებადობა",
  "settings.section.permissions": "ნებართვები",
  "settings.section.permissions_desc":
    "ბლუთუზი, მდებარეობა, შეტყობინებები, კამერა, მიკროფონი",
  "settings.section.storage": "საცავი და მონაცემები",
  "settings.section.diagnostics": "დიაგნოსტიკა",

  // ---- Settings: group headings ----
  "settings.group.transports": "გადამზიდები",
  "settings.group.nearby": "ახლოს",
  "settings.group.sync": "სინქრონიზაცია",
  "settings.group.features": "ფუნქციები",
  "settings.group.messages": "შეტყობინებები",
  "settings.group.media": "მედია",
  "settings.group.reset": "საწყისზე დაბრუნება",
  "settings.group.always_on": "ყოველთვის ჩართული",
  "settings.group.notifications": "შეტყობინებები",
  "settings.group.blocked": "დაბლოკილი",
  "settings.group.theme": "თემა",
  "settings.group.font": "შრიფტი",
  "settings.group.language": "ენა",
  "settings.section.diagnostics_desc":
    "კავშირის მდგომარეობა და ახლომდებარე მოწყობილობები",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "ბლუთუზ-კავშირები",
  "settings.diag.ble_links_desc":
    "მოწყობილობები, რომლებთანაც ეს ტელეფონი პირდაპირაა დაკავშირებული",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about":
    "ტელეფონიდან ტელეფონამდე, როუტერისა და ინტერნეტის გარეშე",
  "settings.diag.wifi_active": "მუშაობს",
  "settings.diag.wifi_unsupported": "ამ მოწყობილობაზე მხარდაჭერილი არ არის",
  "settings.diag.wifi_permission": "დაბლოკილია ნებართვით",
  "settings.diag.wifi_unavailable": "ამჟამად მიუწვდომელია",
  "settings.diag.wifi_unknown": "ელოდება რადიოს",
  "settings.diag.relays": "Nostr რელეები",
  "settings.diag.relays_desc":
    "გამოიყენება მდებარეობის არხებისა და ინტერნეტით მისაწვდომობისთვის",
  "settings.diag.connected": "დაკავშირებულია",
  "settings.diag.disconnected": "არ არის დაკავშირებული",
  "settings.diag.peer_direct": "პირდაპირი კავშირი",
  "settings.diag.peer_relayed": "მოისმინა სხვა მოწყობილობის მეშვეობით",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "სიგნალის მაჩვენებელი არ არის",
  "settings.diag.no_peers": "მიღწევადობის ზონაში არავინაა",
  "settings.diag.no_peers_desc": "გახსნილია {links} რადიოკავშირი",
  "settings.diag.gcs_size": "ფილტრის ზომა",
  "settings.diag.gcs_size_desc":
    "ყველაზე დიდი სინქრონიზაციის ფილტრი, რომელიც ეთერში გავიდა",
  "settings.diag.fpr": "ცრუ დადებითის მაჩვენებელი",
  "settings.diag.fpr_desc": "რამდენად ხშირად ამბობს ფილტრი, რომ პაკეტი გვაკლია",
  "settings.diag.bytes": "{n} ბაიტი",
  "settings.diag.footnote":
    "აქ არაფრის შეცვლა შეიძლება. ეს მნიშვნელობები ფიქსირებულია, რომ Airhop bitchat-თან თავსებადი დარჩეს.",
  "settings.section.storage_desc": "მოხმარება და ქეში",
  "settings.section.appearance": "გარეგნობა",
  "settings.section.appearance_desc": "თემა, შრიფტი და ენა",
  "settings.section.help": "დახმარება და უკუკავშირი",
  "settings.section.help_desc":
    "დაგვიკავშირდი, შეგვატყობინე შეცდომა, ან წაიკითხე ხშირად დასმული კითხვები",
  "settings.section.support": "მხარდაჭერა",
  "settings.section.support_desc": "დაეხმარე, რომ განვითარება არ შეწყდეს",
  "settings.section.about": "შესახებ",
  "settings.section.about_desc": "ვერსია, ცვლილებების ჩამონათვალი და კოდი",

  // ---- Settings: general ----
  "settings.general.undo": "გაგზავნის გაუქმება",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "საფულე",
  "settings.general.undo_seconds": "{count} წამი",
  "settings.general.undo_a11y": "გაგზავნის გაუქმება: {value}",
  "settings.general.quality_a11y": "ატვირთვის ხარისხის დაყენება {value}-ზე",
  "settings.general.undo_desc":
    "ცოტა ხნით აკავებს გაგზავნილ შეტყობინებას, რომ გასვლამდე უკან წაიღო",
  "settings.general.undo_off_desc": "იგზავნება მაშინვე, გაუქმების გარეშე",
  "settings.general.undo_2": "2 წამი",
  "settings.general.undo_2_desc": "სწრაფი შანსი, უკან წაიღო",
  "settings.general.undo_10": "10 წამი",
  "settings.general.undo_10_desc": "ყველაზე გრძელი ფანჯარა",
  "settings.general.quality": "ატვირთვის ხარისხი",
  "settings.general.quality_desc":
    "ეხება კამერიდან ან ბიბლიოთეკიდან გაგზავნილ ფოტოებს. ნებისმიერ შემთხვევაში, ყოველი ფოტო მეშისთვის მორგებულია.",
  "settings.general.quality_low": "დაბალი",
  "settings.general.quality_low_desc":
    "ყველაზე პატარა ფოტოები, ყველაზე სწრაფად იგზავნება",
  "settings.general.quality_medium": "საშუალო",
  "settings.general.quality_medium_desc": "დეტალისა და სიჩქარის ბალანსი",
  "settings.general.quality_high": "მაღალი",
  "settings.general.quality_high_desc": "ინარჩუნებს ყველაზე მეტ დეტალს",
  "settings.general.feature_wallet_desc":
    "გააგზავნე Cashu ecash კვანძიდან კვანძამდე მეშით",
  "settings.general.feature_wallet_a11y": "საფულე (ყოველთვის ჩართული)",
  "settings.general.feature_ai_desc":
    "პირადი ასისტენტი თავად მოწყობილობაზე, ქსელური მიმართვების გარეშე",
  "settings.general.feature_feeds": "ნაკადები",
  "settings.general.feature_feeds_desc":
    "წაიკითხე და დაწერე Bluesky-სა და Mastodon-ის ნაკადებში",
  "settings.general.show_media": "მედიის ავტომატური ჩვენება",
  "settings.general.show_media_desc":
    "ფოტოები და ვიდეოები ჩნდება მიმოწერაში, ან შეხებამდე დამალული რჩება",
  "settings.general.reset": "პარამეტრების საწყისზე დაბრუნება",
  "settings.general.media_retention": "მედიის შენახვა",
  "settings.general.media_retention_desc":
    "ფოტოები, ვიდეოები და ხმოვანი ჩანაწერები არჩეული დროის შემდეგ იშლება",
  "settings.general.media_retention_sheet":
    "აირჩიე, რამდენ ხანს დარჩეს მედია ამ მოწყობილობაზე. წაშლილი მედია აღდგენას არ ექვემდებარება.",
  "settings.general.retention_7_desc":
    "ყველაზე ნაკლები კვალი. საუკეთესოა, თუ რისკი თავად ტელეფონია.",
  "settings.general.retention_14_desc":
    "შუალედური ვარიანტი ერთი-ორი კვირისთვის სიგნალის გარეშე.",
  "settings.general.retention_30_desc":
    "ყველაზე დიდხანს ინახავს მიმოწერებს წასაკითხად და დისკზეც ყველაზე მეტს იკავებს.",
  "settings.general.reset_desc":
    "აბრუნებს ყველა პარამეტრს საწყის მდგომარეობაში, შენს ვინაობას, შეტყობინებებს, კონტაქტებსა და საფულეს კი ხელუხლებლად ტოვებს",
  "settings.general.reset_title": "დავაბრუნოთ პარამეტრები საწყისზე?",
  "settings.general.reset_body":
    "ყველა პარამეტრი საწყისს უბრუნდება: გარეგნობა, გაგზავნის გაუქმება და კავშირი (ინტერნეტი, Tor, კარიბჭე, ხიდი, რელეები). შენი ვინაობა, შეტყობინებები, კონტაქტები და საფულე ხელუხლებელი რჩება.",
  "settings.general.reset_confirm": "დაბრუნება",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "წინსვლის საიდუმლოება",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet პირად შეტყობინებებზე ყოველთვის ჩართულია",
  "settings.security.signed_packets": "ხელმოწერილი პაკეტები",
  "settings.security.signed_packets_desc":
    "ყოველი პაკეტი ხელმოწერილია Ed25519-ით",
  "settings.security.hide_previews": "შეტყობინებების წინასწარი ხედის დამალვა",
  "settings.security.hide_previews_desc":
    "გამგზავნსა და შეტყობინებას ჩაკეტილი ეკრანიდან შორს ინახავს, რომელიც მათ განბლოკვის გარეშე აჩვენებს",
  "settings.security.no_blocked": "დაბლოკილი კვანძები არ არის",
  "settings.security.no_blocked_desc":
    "დაბლოკილ კვანძებს არ შეუძლიათ მოგწერონ და მეშის ჩანართზეც არ ჩანან",
  "settings.security.unblock_title": "ამ კვანძის განბლოკვა",
  "settings.security.unblock": "განბლოკვა",
  "settings.security.unblock_peer": "{name}-ის განბლოკვა",
  "settings.security.unblock_body":
    "{name} ისევ შეძლებს მოგწეროს და ახლოს ყოფნისას მეშის ჩანართზეც დაბრუნდება.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "ინტერნეტზე გადასვლა",
  "settings.network.internet_desc":
    "აგრძელებს Nostr რელეებით, როცა მეშის კვანძები რადიუსს გარეთაა",
  "settings.network.internet_off_title": "გამოვრთოთ ინტერნეტი?",
  "settings.network.internet_off_body":
    "Airhop მხოლოდ ბლუთუზზე იმუშავებს. ის წყვეტს ნებისმიერ Nostr რელესთან კავშირს, ხოლო Tor, ინტერნეტ-კარიბჭე და მეშ-ხიდი გამოირთვება. ახლომდებარე ბლუთუზ-მიმოწერა მაინც მუშაობს.",
  "settings.network.turn_off": "გამორთვა",
  "settings.network.discovery": "გეო-რელეების აღმოჩენა",
  "settings.network.discovery_desc":
    "ავტომატურად ირჩევს უახლოეს რელეებს მდებარეობის უჯრისთვის 300-ზე მეტი განაწილებული რელედან",
  "settings.network.discovery_needs_relay": "ჯერ დაამატე მორგებული რელე",
  "settings.network.discovery_needs_relay_body":
    "სწორედ ავტომატური აღმოჩენა მიმართავს Airhop-ს უახლოეს რელეებზე. მისი გამორთვა მხოლოდ მაშინ აქვს აზრი, როცა ქვემოთ საკუთარ რელეებს დაამაგრებ, ამიტომ ჯერ დაამატე ერთი მაინც.",
  "settings.network.custom_only_title":
    "გამოვიყენოთ მხოლოდ შენი მორგებული რელეები?",
  "settings.network.custom_only_body":
    "მდებარეობის არხები და მეშ-ხიდი შეწყვეტს უახლოესი რელეების ავტომატურ არჩევას და მხოლოდ შენს დამატებულებს გამოიყენებს. ამან შეიძლება მისაწვდომობა შეამციროს, და შესაძლოა bitchat-ის მომხმარებლებს აღარ შეხვდე, რომლებიც უახლოეს რელეებზე იყრიან თავს.",
  "settings.network.custom": "მორგებული რელეები",
  "settings.network.custom_desc":
    "დაამატე შენი რელეები მდებარეობის არხებისა და მეშ-ხიდისთვის",
  "settings.network.custom_added": "დამატებულია {count} / {max}",
  "settings.network.dm_relays": "შეტყობინებების რელეები",
  "settings.network.dm_relays_desc":
    "პირადი შეტყობინებები და პირადი არხები ყოველთვის ამათ იყენებენ. მორგებული რელეები მათ არ ცვლის.",
  "settings.network.discovery_back_on": "გეო-რელეების აღმოჩენა ისევ ჩართულია",
  "settings.network.discovery_back_on_body":
    "ეს შენი უკანასკნელი მორგებული რელე იყო. მდებარეობის არხებს გამოსაქვეყნებელი ადგილი სჭირდებათ, ამიტომ Airhop-მა ისევ დაიწყო უახლოესი რელეების ავტომატური არჩევა.",
  "settings.network.add_relay": "რელეს დამატება",
  "settings.network.remove_relay": "{url}-ის წაშლა",
  "settings.network.add_short": "დამატება",
  "settings.network.relay_limit":
    "შეგიძლია {count} რელეს დამატება. ერთი წაშალე, რომ სხვა დაამატო.",
  "settings.network.relay_duplicate": "ეს რელე უკვე შენს სიაშია.",
  "settings.network.relay_invalid":
    "შეიყვანე რელეს სწორი ჰოსტი, მაგალითად relay.example.com. პორტი მხოლოდ მაშინაა საჭირო, თუ რელე ნაგულისხმევს არ იყენებს. IP მისამართები და ლოკალური სახელები დაუშვებელია.",
  "settings.network.bitchat": "bitchat-თან თავსებადობა",
  "settings.network.bitchat_desc":
    "იგივე BLE მეში, რაც bitchat-ს, სრულად თავსებადი. ეს ყოველთვის ჩართულია და გამორთვა შეუძლებელია.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "ფონურ რეჟიმში მუშაობა",
  "settings.conn.background_desc":
    "მეში მუშაობს მაშინაც, როცა Airhop დახურულია",
  "settings.conn.background_on_title": "დავტოვოთ მეში მომუშავე?",
  "settings.conn.background_on_body":
    "Airhop აგრძელებს გადაცემასა და მიღებას დახურვის შემდეგაც, ამიტომ შეტყობინებები შენს გარეშეც მოდის. ამ დროს Android მუდმივ შეტყობინებას აჩვენებს.",
  "settings.conn.background_off_title": "შევაჩეროთ მეში Airhop-ის დახურვისას?",
  "settings.conn.background_off_body":
    "შეტყობინებები მხოლოდ Airhop-ის გახსნისას მოვა, და ეს ტელეფონი ახლომდებარეებისთვის გადაცემას შეწყვეტს. მუდმივი შეტყობინება გაქრება.",
  "settings.conn.live_voice": "პირდაპირი ხმა",
  "settings.conn.live_voice_desc": "ესაუბრე ახლომდებარე ადამიანებს რაციასავით",
  "settings.conn.live_voice_on_title": "ჩავრთოთ პირდაპირი ხმა?",
  "settings.conn.live_voice_on_body":
    "მიკროფონის დაკავებისას შენი ხმა ბლუთუზის რადიუსში ყველას მიდის მაშინვე, როცა ლაპარაკობ, მათი ხმა კი შენს ტელეფონზე ისმის. არაფერი იწერება.",
  "settings.conn.live_voice_off_title": "გამოვრთოთ პირდაპირი ხმა?",
  "settings.conn.live_voice_off_body":
    "მიკროფონის დაკავებისას სანაცვლოდ ხმოვანი ჩანაწერი იწერება. ის იგზავნება, როცა ხელს გაუშვებ, და სანამ არ ჩართავენ, არავინ გაიგონებს.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor-ით მიმართვა",
  "settings.conn.tor_desc":
    "მიმართე Nostr-ის ტრაფიკი Tor-ით დამატებითი პირადულობისთვის",
  "settings.conn.tor_on_title": "მივმართოთ Nostr-ის ტრაფიკი Tor-ით?",
  "settings.conn.tor_on_body":
    "რელეები შენს IP მისამართს ვეღარ დაინახავენ. დაკავშირება უფრო დიდხანს გრძელდება და შეტყობინებებიც უფრო ნელა მოდის. ბლუთუზზე ეს არ მოქმედებს.",
  "settings.conn.tor_off_title": "გამოვრთოთ Tor-ით მიმართვა?",
  "settings.conn.tor_off_body":
    "Nostr-ის ტრაფიკი შენს ჩვეულებრივ კავშირს უბრუნდება, ამიტომ რელეები შენს IP მისამართს ისევ დაინახავენ. ორივე შემთხვევაში ბლუთუზზე ეს არ მოქმედებს.",
  "settings.conn.tor_orbot_idle":
    "Orbot დაინსტალირებულია, მაგრამ არ არის დაკავშირებული. გახსენი Orbot, გაუშვი მისი VPN, შემდეგ კი ეს ჩართე.",
  "settings.conn.tor_unavailable": "ამ ბილდში Tor-ით მიმართვა მიუწვდომელია.",
  "settings.conn.tor_timeout":
    "Tor-ს დაკავშირებას ერთ წუთზე მეტი სჭირდება. ის ჩართული რჩება და ცდას აგრძელებს; მეშის ჩანართი გეტყვის, როდის დაიწყო მიმართვა, ან თუ ეს ქსელი მას ბლოკავს.",
  "settings.conn.tor_failed":
    "Tor-ის გაშვება ვერ მოხერხდა. დარწმუნდი, რომ აპლიკაციას ქსელთან წვდომა აქვს.",
  "settings.conn.mint_clearnet": "ზარაფხანის ტრაფიკის დაშვება ღია ქსელით",
  "settings.conn.mint_clearnet_desc":
    "iOS-ზე Tor მხოლოდ Nostr-ს ფარავს. დატოვე გამორთული, რომ ზარაფხანის მოთხოვნები დაიბლოკოს; ორივე შემთხვევაში მეშით ecash მაინც მუშაობს.",
  "settings.conn.gateway": "ინტერნეტ-კარიბჭე",
  "settings.conn.gateway_desc":
    "ასესხე შენი კავშირი ახლომდებარე ოფლაინ ტელეფონს, რომ მან მაინც მისწვდეს მდებარეობის არხებს",
  "settings.conn.gateway_on_title": "ჩავრთოთ ინტერნეტ-კარიბჭე?",
  "settings.conn.gateway_on_body":
    "ახლომდებარე ტელეფონები, რომლებსაც საკუთარი კავშირი არ აქვთ, მდებარეობის არხების შეტყობინებებს შენით გააგზავნიან და მიიღებენ. ეს იყენებს შენს მობილურ ინტერნეტსა და ბატარეას, მათი შეტყობინებები კი ბოლომდე დაშიფრული რჩება, ამიტომ იმას, რაც გადის, ვერ წაიკითხავ.",
  "settings.conn.gateway_off_title": "გამოვრთოთ ინტერნეტ-კარიბჭე?",
  "settings.conn.gateway_off_body":
    "ახლომდებარე ოფლაინ ტელეფონები შენით მდებარეობის არხებს ვეღარ მისწვდებიან. შენს შეტყობინებებზე ეს არ მოქმედებს.",
  "settings.conn.bridge": "მეშ-ხიდი",
  "settings.conn.bridge_desc":
    "დააკავშირე ამ ზონის საჯარო #bluetooth მიმოწერა რადიუსს გარეთ მყოფ სხვა ბლუთუზ-ჯგუფთან ინტერნეტით",
  "settings.conn.bridge_on_title": "ჩავრთოთ მეშ-ხიდი?",
  "settings.conn.bridge_on_body":
    "შენი საჯარო #bluetooth შეტყობინებები ინტერნეტით შენს უბანში გამოქვეყნდება, ამიტომ ბლუთუზის რადიუსს მიღმა მყოფებიც წაიკითხავენ. პირადი შეტყობინებები ხიდით არასოდეს გადადის, „მხოლოდ ახლოს“ კი ცალკეულ შეტყობინებას ადგილზე ტოვებს.",
  "settings.conn.bridge_off_title": "გამოვრთოთ მეშ-ხიდი?",
  "settings.conn.bridge_off_body":
    "შენი საჯარო #bluetooth შეტყობინებები ისევ ბლუთუზის რადიუსში რჩება, ხიდის მიღმა მყოფი ჯგუფის შეტყობინებები კი აქ აღარ მოვა.",
  "settings.conn.bridge_needs_location": "მეშ-ხიდს მდებარეობა სჭირდება",
  "settings.conn.bridge_needs_location_desc":
    "ის შენს უბანს მდებარეობის მიხედვით პოულობს. დაუშვი მდებარეობა, რომ ხიდი ამუშავდეს.",
  "settings.conn.grant_location": "მდებარეობის ნებართვის მიცემა",
  "settings.conn.grant_short": "დაშვება",
  "settings.conn.orbot_body":
    "Airhop Tor-ის ტრაფიკს Orbot-ით მიმართავს. დააინსტალირე და ჩართე Orbot Play Store-იდან, შემდეგ კი ეს ჩართე.",
  "settings.conn.internet_off": "ინტერნეტი გამორთულია",
  "settings.conn.internet_off_desc":
    "Tor, ხიდი და კარიბჭე ინტერნეტს იყენებენ. მათ გამოსაყენებლად ჩართე ინტერნეტზე გადასვლა ქსელის განყოფილებაში.",
  "settings.conn.turn_on": "ჩართვა",
  "settings.conn.turn_off": "გამორთვა",
  "settings.conn.orbot_title": "Tor Android-ზე",
  "settings.conn.get_orbot": "Orbot-ის მიღება",
  "settings.conn.later": "მოგვიანებით",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "ბლუთუზი",
  "settings.permissions.bluetooth_desc":
    "პოულობს ახლომდებარე მოწყობილობებს და მათ შორის შეტყობინებებს გადასცემს. ამის გარეშე მეში ვერ იმუშავებს.",
  "settings.permissions.location": "მდებარეობა",
  "settings.permissions.location_desc":
    "ხსნის ახლომდებარე ზონის არხებს. ამის გარეშე ის არხები დახურული რჩება, ბლუთუზ-მეში კი ჩვეულებრივ აგრძელებს.",
  "settings.permissions.notifications": "შეტყობინებები",
  "settings.permissions.notifications_desc":
    "მიიღე ცნობები ახალი შეტყობინებების შესახებ მაშინაც, როცა აპლიკაცია დახურულია. ამის გარეშე მათ მხოლოდ Airhop-ის გახსნისას დაინახავ.",
  "settings.permissions.camera": "კამერა",
  "settings.permissions.camera_desc":
    "სკანერებს QR კოდებს და იღებს ფოტოებსა და ვიდეოებს გასაგზავნად. ამის გარეშეც შეგიძლია მედია ბიბლიოთეკიდან გააზიარო.",
  "settings.permissions.photos": "ფოტოები",
  "settings.permissions.photos_desc":
    "აგზავნის ფოტოებს შენი ბიბლიოთეკიდან და ინახავს მიღებულ მედიას. ამის გარეშეც შეგიძლია კამერით ახალი ფოტოები გადაიღო და გააგზავნო.",
  "settings.permissions.microphone": "მიკროფონი",
  "settings.permissions.microphone_desc":
    "იწერს და აგზავნის ხმოვან შეტყობინებებს ან იყენებს პირდაპირ ხმას. ამის გარეშე ხმოვანი შეტყობინებები და პირდაპირი ხმა არ იმუშავებს.",
  "settings.permissions.allow": "ამ ნებართვის დაშვება",
  "settings.permissions.open_settings":
    "სისტემის პარამეტრების გახსნა ამ ნებართვის შესაცვლელად",
  "settings.permissions.system": "სისტემა",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "ქსელის მოხმარება",
  "settings.storage.storage_usage": "საცავის მოხმარება",
  "settings.storage.storage_usage_desc":
    "შეტყობინებები, საფულის დასტურები და ქეშირებული დანართები",
  "settings.storage.session_usage":
    "ეს სესია · {sent} გაგზავნილი, {received} მიღებული",
  "settings.storage.cache": "ქეში",
  "settings.storage.cache_desc": "{size} დანართები",
  "settings.storage.clear_cache": "დანართების ქეშის გასუფთავება",
  "settings.storage.clear": "გასუფთავება",
  "settings.storage.clear_title": "გავასუფთაოთ ქეშირებული მედია?",
  "settings.storage.clear_body":
    "ფოტოები, ვიდეოები, ხმოვანი ჩანაწერები და ფაილები წაიშლება ამ მოწყობილობიდან, გაგზავნილიც და მიღებულიც. მათი ხელახლა ჩამოტვირთვა შეუძლებელია: მათ ბუშტებში ეს წერია, და გამგზავნს ხელახლა გამოგზავნას სთხოვ. შეტყობინებები და საფულე ხელუხლებელი რჩება.",
  "settings.storage.cleared": "ქეში გასუფთავდა",
  "settings.storage.freed": "გათავისუფლდა {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "გარეგნობის დაყენება {value}-ზე",
  "settings.font.set_a11y": "თანაბარსიგანიანი შრიფტის დაყენება {value}-ზე",
  "settings.font.system": "სისტემური",
  "settings.font.system_desc":
    "იყენებს შენი მოწყობილობის ნაგულისხმევ თანაბარსიგანიან შრიფტს",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "თანამედროვე და ადვილად წასაკითხი",
  "settings.language.en": "ინგლისური",
  "settings.language.am": "ამჰარული",
  "settings.language.ar": "არაბული",
  "settings.language.bn": "ბენგალური",
  "settings.language.my": "ბირმული",
  "settings.language.zh_hans": "ჩინური (გამარტივებული)",
  "settings.language.zh_hant": "ჩინური (ტრადიციული)",
  "settings.language.nl": "ჰოლანდიური",
  "settings.language.fil": "ფილიპინური",
  "settings.language.fr": "ფრანგული",
  "settings.language.ka": "ქართული",
  "settings.language.de": "გერმანული",
  "settings.language.hi": "ჰინდი",
  "settings.language.id": "ინდონეზიური",
  "settings.language.it": "იტალიური",
  "settings.language.ja": "იაპონური",
  "settings.language.ko": "კორეული",
  "settings.language.mg": "მალაგასიური",
  "settings.language.ms": "მალაიური",
  "settings.language.ne": "ნეპალური",
  "settings.language.fa": "სპარსული",
  "settings.language.pl": "პოლონური",
  "settings.language.pt_br": "პორტუგალიური (ბრაზილია)",
  "settings.language.pt_pt": "პორტუგალიური (პორტუგალია)",
  "settings.language.pa": "პენჯაბური",
  "settings.language.ru": "რუსული",
  "settings.language.es": "ესპანური",
  "settings.language.sw": "სუაჰილი",
  "settings.language.sv": "შვედური",
  "settings.language.ta": "ტამილური",
  "settings.language.th": "ტაილანდური",
  "settings.language.tr": "თურქული",
  "settings.language.uk": "უკრაინული",
  "settings.language.ur": "ურდუ",
  "settings.language.vi": "ვიეტნამური",
  "settings.language.pseudo": "ფსევდოლოკალი",
  "settings.language.soon": "მალე",
  "settings.language.soon_a11y": "{value}, მალე",
  "settings.language.set_a11y": "ენის დაყენება {value}-ზე",
  "settings.language.pending": "შემდეგი გახსნისას",
  "settings.language.pending_a11y":
    "{value}, ამოქმედდება Airhop-ის შემდეგი გახსნისას",
  "settings.language.rtl_title": "დასასრულებლად ხელახლა გახსენი Airhop",
  "settings.language.rtl_body":
    "{value} მარჯვნიდან მარცხნივ იკითხება, Airhop-ს კი მიმართულების შეცვლა მხოლოდ გაშვებისას შეუძლია. დახურე და ხელახლა გახსენი, რომ გადართვა დასრულდეს. არაფერი იკარგება, და მანამდე შენი მეში დაკავშირებული რჩება.",
  "settings.theme.light": "ღია",
  "settings.theme.light_desc": "ყოველთვის ღია პალიტრის გამოყენება",
  "settings.theme.dark": "მუქი",
  "settings.theme.dark_desc": "ყოველთვის მუქი პალიტრის გამოყენება",

  // ---- Settings: profile and identity ----
  "settings.status.online": "ონლაინ",
  "settings.status.online_desc": "აღმოჩენადი, აცხადებს და სკანერებს",
  "settings.status.away": "არ არის",
  "settings.status.away_desc": "მეში შეჩერებულია, არ სკანერებს და არ აცხადებს",
  "settings.status.invisible": "უხილავი",
  "settings.status.invisible_desc": "სკანერებს, მაგრამ აღმოჩენისგან დამალულია",
  "settings.status.title": "სტატუსი",
  "settings.status.set_a11y": "სტატუსის დაყენება {value}-ზე",
  "settings.status.edit": "სტატუსის რედაქტირება",
  "settings.status.desc": "აირჩიე, რამდენად ხილული ხარ მეშში.",
  "settings.transfer.identity": "ვინაობა და გასაღებები",
  "settings.transfer.identity_desc":
    "შენი კვანძის ID, მომხმარებლის სახელი და კონტაქტები",
  "settings.transfer.chats": "მიმოწერები და ისტორია",
  "settings.transfer.chats_desc":
    "საუბრები, ჯგუფები და არხები, რომლებსაც შეუერთდი",
  "settings.transfer.wallet": "საფულის ბალანსი",
  "settings.transfer.wallet_desc": "Cashu-ს დასტურები და ტრანზაქციების ისტორია",
  "settings.transfer.title": "ახალ ტელეფონზე გადატანა",
  "settings.transfer.desc":
    "გადაიტანე შენი ვინაობა, მიმოწერები და საფულე სხვა მოწყობილობაზე",
  "settings.transfer.coming_soon_a11y": "ახალ ტელეფონზე გადატანა, მალე",
  "settings.transfer.body":
    "მიადე ორი ტელეფონი ერთმანეთს და ყველაფერი ბლუთუზით გადაიტანე. არაფერი გადის სერვერზე, ამიტომ ინტერნეტის გარეშეც მუშაობს.",
  "settings.qr.permission_label": "ფოტოებთან წვდომა",
  "settings.qr.permission_purpose": "შეინახო შენი QR კოდი",
  "settings.qr.saved": "შენახულია",
  "settings.qr.saved_body": "QR კოდი შენახულია შენს ფოტოების ბიბლიოთეკაში.",
  "settings.qr.save_failed": "შენახვა ვერ მოხერხდა",
  "settings.qr.save_failed_body":
    "QR კოდის შენახვა ვერ მოხერხდა. სცადე ხელახლა.",
  "settings.qr.share_message": "დამამატე Airhop-ზე",
  "settings.qr.share_body":
    "დამამატე Airhop-ზე — პირადი მეშ-შეტყობინებები, უპირველესად ოფლაინისთვის.",
  "settings.qr.show_short": "QR-ის ჩვენება",
  "settings.qr.title": "შენი QR კოდი",
  "settings.qr.note":
    "ის შენს საჯარო გასაღებებს შეიცავს, რომლებიც სხვებს ნებისმიერი ადგილიდან მოწერის საშუალებას აძლევს. გააზიარე მხოლოდ მათთან, ვისაც ენდობი. ის არ შეიცვლება, სანამ შენს ვინაობას არ წაშლი.",
  "settings.qr.code_label": "საკონტაქტო კოდი",
  "settings.qr.copy_code": "საკონტაქტო კოდის კოპირება",
  "settings.qr.share": "QR კოდის გაზიარება",
  "settings.qr.share_short": "QR-ის გაზიარება",
  "settings.qr.download": "QR კოდის ჩამოტვირთვა",
  "settings.qr.download_short": "QR-ის ჩამოტვირთვა",
  "settings.qr.show": "QR კოდის ჩვენება",
  "settings.wipe.trigger": "საგანგებო წაშლის გაშვება",
  "settings.wipe.trigger_desc":
    "შეეხე სამჯერ, რომ მაშინვე წაშალო დადასტურების გარეშე",
  "settings.wipe.title": "საგანგებო წაშლა",
  "settings.wipe.now": "წაშლა ახლავე",
  "settings.wipe.desc":
    "მაშინვე ანადგურებს ყველა გასაღებს, შეტყობინებასა და დასტურს",
  "settings.wipe.body":
    "ეს მაშინვე გაანადგურებს შენს ყველა გასაღებს, შეტყობინებასა და საფულის დასტურს. ამის დაბრუნება შეუძლებელია.",
  "settings.wipe.in_progress": "იშლება",
  "settings.wipe.in_progress_body":
    "ნადგურდება შენი გასაღებები, შეტყობინებები და ფაილები. ეს რამდენიმე წამს გრძელდება და თავად სრულდება, მაშინაც კი, თუ აპლიკაცია დაიხურა.",
  "settings.wipe.got_it": "გასაგებია",
  "settings.wipe.keys_failed": "გასაღებების განადგურება ვერ მოხერხდა",
  "settings.wipe.keys_failed_body":
    "შენი შეტყობინებები, კონტაქტები და საფულე წაშლილია, მაგრამ მოწყობილობამ შენი გასაღებების გათავისუფლებაზე უარი თქვა. განბლოკე მოწყობილობა და ხელახლა წაშალე.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "დაგვიკავშირდი",
  "settings.help.contact_a11y": "მიწერე {address}-ზე",
  "settings.help.bug": "შეცდომის შეტყობინება",
  "settings.help.bug_desc": "გახსენი issue GitHub-ზე",
  "settings.help.bug_a11y": "შეცდომის შეტყობინება GitHub-ზე",
  "settings.help.faq": "ხშირად დასმული კითხვები",
  "settings.help.faq_desc": "პასუხები ჩვეულებრივ კითხვებზე",
  "settings.help.faq_a11y": "ხშირად დასმული კითხვების გახსნა",
  "settings.help.terms_desc": "როგორ შეიძლება Airhop-ის გამოყენება",
  "settings.help.terms_a11y": "მომსახურების პირობების გახსნა",
  "settings.help.privacy_desc": "რას არ ვაგროვებთ",
  "settings.help.privacy_a11y": "კონფიდენციალურობის პოლიტიკის გახსნა",

  // ---- Settings: support ----
  "settings.support.card": "ბარათი ან UPI",
  "settings.support.card_desc": "ინტერნეტბანკი და საფულეები, მთელ მსოფლიოში",
  "settings.support.card_a11y":
    "მხარდაჭერა ბარათით, UPI-ით, ინტერნეტბანკით ან საფულით",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "ყოველთვიურად ან ერთჯერადად, პლატფორმის საკომისიოს გარეშე",
  "settings.support.sponsors_a11y": "მხარდაჭერა GitHub Sponsors-ის მეშვეობით",
  "settings.support.note":
    "Airhop-ს თავისუფალ დროს ვაკეთებ. არც ინვესტორები არიან და არც რეკლამა. თუ ის შენთვის სასარგებლოა, შენატანი დიდად ეხმარება იმას, რომ განვითარება არ შეწყდეს. ორივე შემთხვევაში ყველა ფუნქცია უფასო რჩება.",

  // ---- Settings: about and version ----
  "settings.about.version": "ვერსია",
  "settings.about.version_desc": "მიმდინარე გამოშვება",
  "settings.about.version_a11y": "ვერსიის ნახვა და განახლებების შემოწმება",
  "settings.about.release_notes": "გამოშვების შენიშვნები",
  "settings.about.release_notes_desc": "რა არის ახალი უახლეს გამოშვებაში",
  "settings.about.release_notes_a11y":
    "უახლესი გამოშვების შენიშვნების გახსნა GitHub-ზე",
  "settings.about.source": "საწყისი კოდი",
  "settings.about.source_a11y": "საწყისი კოდის გახსნა GitHub-ზე",
  "settings.about.licenses": "ღია კოდის ლიცენზიები",
  "settings.about.open_repo": "{name} რეპოზიტორიის გახსნა",
  "settings.about.licenses_desc": "მესამე მხარის ღია კოდის პაკეტები",
  "settings.about.licenses_a11y": "მესამე მხარის ლიცენზიების ნახვა",
  "settings.version.codename": "კოდური სახელი",
  "settings.version.checking": "მოწმდება",
  "settings.version.check": "განახლებების შემოწმება",
  "settings.version.checking_title": "მოწმდება განახლებები",
  "settings.version.up_to_date": "შენ უახლეს ვერსიაზე ხარ.",
  "settings.version.release_notes": "გამოშვების შენიშვნების ნახვა",
  "settings.version.made_with": "შექმნილია",
  "settings.version.number": "ვერსია {version}",
  "settings.version.update_to": "განახლება {version}-ზე",
  "settings.version.update_to_a11y": "განახლება ვერსია {version}-ზე",
  "settings.version.released_under": "გამოშვებულია {license}-ით",
  "settings.version.notes_a11y":
    "ვერსია {version}-ის გამოშვების შენიშვნების ნახვა",
  "settings.version.tor_paused":
    "განახლებების შემოწმება შეჩერებულია Tor-ის ჩართვისას, რომ შენი IP არ გაჟონოს. ნახე გამოშვებების გვერდი ბრაუზერში.",
  "settings.version.check_failed":
    "განახლებების შემოწმება ვერ მოხერხდა. შეამოწმე კავშირი და სცადე ხელახლა.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} არის {size} KiB, რაც {cap} KiB-ის ზღვარს აჭარბებს.",
  "transfer.failed.malformed":
    "დანართი დაზიანებული ჩამოვიდა და ვერ გაიხსნა. სთხოვე, ხელახლა გამოგზავნოს.",
  "transfer.failed.unsupported_type":
    "დანართი ისეთ ფორმატში ჩამოვიდა, რომელსაც ეს აპლიკაცია ვერ ხსნის.",
  "transfer.failed.type_mismatch":
    "დანართი უარყოფილია: მისი შიგთავსი გამოცხადებულ ფაილის ტიპს არ ემთხვევა.",
  "transfer.failed.storage":
    "დანართი ჩამოვიდა, მაგრამ ვერ შეინახა. შეამოწმე თავისუფალი ადგილი.",
  "transfer.badge.waiting": "ელოდება · {name}",
  "transfer.badge.active_count": "{count} გადაცემა",
  "transfer.badge.sending": "იგზავნება {name}",
  "transfer.badge.receiving": "მიიღება {name}",
  "transfer.badge.a11y": "{label}, {percent} პროცენტი. საუბრის გახსნა.",
  "transfer.kind.photo": "ფოტო",
  "transfer.kind.video": "ვიდეო",
  "transfer.kind.voice": "ხმოვანი ჩანაწერი",
  "transfer.this.photo": "ეს ფოტო",
  "transfer.this.video": "ეს ვიდეო",
  "transfer.this.voice": "ეს ხმოვანი ჩანაწერი",
  "transfer.this.file": "ეს ფაილი",
  "transfer.kind.document": "დოკუმენტი",
  "transfer.kind.voice_preview": "ხმოვანი ჩანაწერი",
  "transfer.kind.photo_preview": "ფოტო",
  "transfer.kind.video_preview": "ვიდეო",
  "transfer.kind.document_preview": "დოკუმენტი",

  // ---- System notifications ----
  "notif.channel.messages": "შეტყობინებები",
  "notif.channel.nearby": "ახლომდებარე კვანძები",
  "notif.channel.nearby_desc":
    "დროდადრო შეტყობინება, როცა მეში ბლუთუზის რადიუსში ადამიანებს პოულობს.",
  "notif.nearby.body": "ახლა ბლუთუზის რადიუსშია. შეეხე მეშის გასახსნელად.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "ვიღაც",
  "notif.notice_urgent": "სასწრაფო განცხადება · {content}",
  "notif.notice": "განცხადება · {content}",
  "notif.incoming_file": "შემომავალი ფაილი",
  "notif.preview.photo": "📷 ფოტო",
  "notif.preview.voice": "🎤 ხმოვანი შეტყობინება",
  "notif.preview.video": "🎥 ვიდეო",
  "notif.preview.document": "📄 დოკუმენტი",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "ახალი შეტყობინება",
  "notif.hidden.channel": "ახალი აქტივობა",
  "notif.hidden.mention": "შენ მოგიხსენიეს",
  "notif.mention.title": "{sender}-მა შენ მოგიხსენია",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "კიდევ {count}-ის ჩვენება",
    other: "კიდევ {count}-ის ჩვენება",
  },
  "chat.channels.show_more_a11y": {
    one: "კიდევ {count} ნაგულისხმევი არხის ჩვენება",
    other: "კიდევ {count} ნაგულისხმევი არხის ჩვენება",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} წაუკითხავი",
    other: "{label}, {count} წაუკითხავი",
  },
  "a11y.new_count": {
    one: "{label}, {count} ახალი",
    other: "{label}, {count} ახალი",
  },
  "chat.a11y.unread": {
    one: "{count} წაუკითხავი",
    other: "{count} წაუკითხავი",
  },
  "chat.thread.length_left": {
    one: "დარჩა {count}",
    other: "დარჩა {count}",
  },
  "settings.general.retention_days": {
    one: "{count} დღე",
    other: "{count} დღე",
  },
  "chat.info.group_reach": {
    one: "{count} წევრიდან {reachable} მისაწვდომია",
    other: "{count} წევრიდან {reachable} მისაწვდომია",
  },
  "chat.group_members": {
    one: "პირადი ჯგუფი  ·  {count} წევრი",
    other: "პირადი ჯგუფი  ·  {count} წევრი",
  },
  "chat.select.count": {
    one: "არჩეულია {count}",
    other: "არჩეულია {count}",
  },
  "chat.select.forward": {
    one: "{count} შეტყობინების გადაგზავნა",
    other: "{count} შეტყობინების გადაგზავნა",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} საუბრობს",
    other: "{count} საუბრობს",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} კვანძი მიღწევადია",
    other: "{count} კვანძი მიღწევადია",
  },
  "mesh.peer.hops_away": {
    one: "{count} გადასვლის მოშორებით",
    other: "{count} გადასვლის მოშორებით",
  },
  "chat.presence.active": {
    one: "{count} აქტიური",
    other: "{count} აქტიური",
  },
  "chat.presence.nearby": {
    one: "{count} ახლოს",
    other: "{count} ახლოს",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} ზარაფხანა",
    other: "{count} ზარაფხანა",
  },
  "wallet.mint.remove_body": {
    one: "{mint}-ს აქვს {balance} {unit} {count} დასტურში. მისი წაშლა ამ დასტურს სამუდამოდ შლის ამ მოწყობილობიდან, და მისი სარეზერვო ასლი არ არსებობს. ჯერ გაიტანე ან გააგზავნე ბალანსი.",
    other:
      "{mint}-ს აქვს {balance} {unit} {count} დასტურში. მისი წაშლა ამ დასტურებს სამუდამოდ შლის ამ მოწყობილობიდან, და მათი სარეზერვო ასლი არ არსებობს. ჯერ გაიტანე ან გააგზავნე ბალანსი.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} შენატანი გადახდას ელოდება. აპლიკაციის ყოველი გახსნისას ხელახლა მოწმდება.",
    other:
      "{count} შენატანი გადახდას ელოდება. აპლიკაციის ყოველი გახსნისას ხელახლა მოწმდება.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{mints}-იდან აღდგა {count} დაუხარჯავი დასტური.",
    other: "{mints}-იდან აღდგა {count} დაუხარჯავი დასტური.",
  },
  "wallet.backup.already_spent": {
    one: "მოიძებნა {count} მონეტა, მაგრამ ის უკვე დახარჯულია, ამიტომ მისთვის არაფერი ჩაირიცხა. ეს ნორმალურია: ყოველი მონეტა, რომელიც ოდესმე დახარჯე, რჩება ზარაფხანის ჩანაწერებში.",
    other:
      "მოიძებნა {count} მონეტა, მაგრამ ისინი უკვე დახარჯულია, ამიტომ მათთვის არაფერი ჩაირიცხა. ეს ნორმალურია: ყოველი მონეტა, რომელიც ოდესმე დახარჯე, რჩება ზარაფხანის ჩანაწერებში.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "კიდევ {count}-ის ჩვენება",
    other: "კიდევ {count}-ის ჩვენება",
  },
  "wallet.activity.show_more_a11y": {
    one: "კიდევ {count} გადახდის ჩვენება",
    other: "კიდევ {count} გადახდის ჩვენება",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} დაუდასტურებელი",
    other: "{count} დაუდასტურებელი",
  },
  "wallet.proof_count": {
    one: "{count} დასტური",
    other: "{count} დასტური",
  },
  "wallet.spent_removed_detail": {
    one: "{count} დასტური უკვე დახარჯული იყო და წაიშალა.",
    other: "{count} დასტური უკვე დახარჯული იყო და წაიშალა.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "ახლოს ვიღაცაა",
    other: "ახლოს {count} ადამიანია",
  },
};

export const ka = { strings, plurals };
