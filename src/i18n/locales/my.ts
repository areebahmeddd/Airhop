// my: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "မလုပ်တော့",
  "common.done": "ပြီးပါပြီ",
  "common.ok": "ကောင်းပြီ",
  "common.close": "ပိတ်ပါ",
  "common.back": "နောက်သို့",
  "common.delete": "ဖျက်ပါ",
  "common.remove": "ဖယ်ရှားပါ",
  "common.add": "ထည့်ပါ",
  "common.copy": "ကူးပါ",
  "common.copied": "ကူးပြီးပါပြီ",
  "common.share": "မျှဝေပါ",
  "common.continue": "ဆက်လုပ်ပါ",
  "common.try_again": "ထပ်စမ်းကြည့်ပါ",
  "common.settings": "ဆက်တင်များ",
  "common.on": "ဖွင့်",
  "common.off": "ပိတ်",

  // ---- Dates ----
  "format.today": "ယနေ့",
  "format.yesterday": "မနေ့က",
  "format.minutes_ago": "လွန်ခဲ့သော {count} မိနစ်",
  "format.hours_ago": "လွန်ခဲ့သော {count} နာရီ",
  "format.days_ago": "လွန်ခဲ့သော {count} ရက်",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "စကားပြောများ",
  "nav.tab.mesh": "မက်ရှ်",
  "nav.tab.wallet": "ပိုက်ဆံအိတ်",
  "nav.tab.profile": "သင်",
  "a11y.tab.new_peers": "{label}၊ အနီးအနားတွင် လူသစ်",
  "nav.notifications": "အသိပေးချက်များ",
  "chat.subtab.channels": "ချန်နယ်များ",
  "chat.subtab.direct": "တိုက်ရိုက်",
  "chat.subtab.dms": "တိုက်ရိုက်မက်ဆေ့ဂျ်များ",
  "chat.search.placeholder": "စကားပြောများ ရှာပါ…",
  "chat.search.a11y": "စကားပြောများနှင့် မက်ဆေ့ဂျ်များ ရှာပါ",
  "chat.search.close": "ရှာဖွေမှု ပိတ်ပါ",
  "chat.search.clear": "ရှာဖွေမှု ရှင်းပါ",
  "mesh.view.radar": "ရေဒါမြင်ကွင်း",
  "mesh.view.list": "စာရင်းမြင်ကွင်း",
  "mesh.view.radar_short": "ရေဒါ",
  "mesh.view.list_short": "စာရင်း",

  // ---- Legal document names ----
  "legal.last_updated": "နောက်ဆုံးမွမ်းမံသည့်အချိန် — {date}",
  "legal.terms": "ဝန်ဆောင်မှုစည်းမျဉ်းများ",
  "legal.privacy": "ကိုယ်ရေးအချက်အလက်မူဝါဒ",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "သီးသန့် မက်ရှ်ဆက်သွယ်ရေး",
  "onboarding.welcome.cta": "စတင်ပါ",
  "onboarding.welcome.cta_hint": "ဆက်လက်ရန် အောက်ပါစည်းမျဉ်းများကို သဘောတူပါ",
  "onboarding.welcome.consent_a11y":
    "ဝန်ဆောင်မှုစည်းမျဉ်းများနှင့် ကိုယ်ရေးအချက်အလက်မူဝါဒကို သဘောတူပါ",
  "onboarding.welcome.open_terms": "ဝန်ဆောင်မှုစည်းမျဉ်းများကို ဖွင့်ပါ",
  "onboarding.welcome.open_privacy": "ကိုယ်ရေးအချက်အလက်မူဝါဒကို ဖွင့်ပါ",
  "onboarding.welcome.consent":
    "{cta} ကို နှိပ်ခြင်းဖြင့် ကျွန်ုပ်တို့၏ {terms} နှင့် {privacy} ကို သင်သဘောတူပါသည်။",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "သင့်အထောက်အထားကို ဖန်တီးနေသည်",
  "onboarding.identity.body":
    "ဤစက်ပေါ်တွင် Ed25519 သော့တွဲကို ဖန်တီးနေပါသည်။\nဘာမျှ မည်သည့်နေရာသို့မျှ မပို့ပါ။",
  "onboarding.identity.failed_heading": "သင့်သော့များကို ဖန်တီး၍ မရပါ",
  "onboarding.identity.failed_body":
    "ဤစက်သည် Airhop ကို သော့များ လုံခြုံစွာသိမ်းဆည်းခွင့် မပြုခဲ့ပါ။ ထပ်စမ်းကြည့်ပါ၊ သို့မဟုတ် ဖုန်းကို ပြန်ဖွင့်ပြီး Airhop ကို ပြန်ဖွင့်ပါ။",
  "onboarding.identity.steps_a11y": "အဆင့်များ — {steps}",
  "onboarding.identity.step.x25519": "X25519 အမြဲတမ်းသော့တွဲ ဖန်တီးနေသည်",
  "onboarding.identity.step.ed25519": "Ed25519 လက်မှတ်ထိုးသော့တွဲ ဖန်တီးနေသည်",
  "onboarding.identity.step.keychain":
    "သော့များကို စနစ်၏သော့သိမ်းတွင် သိမ်းနေသည်",
  "onboarding.identity.step.peer_id": "လုပ်ဖော်ကိုင်ဖက် ID ကို ထုတ်ယူနေသည်",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "မက်ရှ်ပေါ်ရှိ သင့်နာမည်",
  "onboarding.username.peer_id": "လုပ်ဖော်ကိုင်ဖက် ID",
  "onboarding.username.card_a11y":
    "မက်ရှ်ပေါ်ရှိ သင့်နာမည်မှာ {username} ဖြစ်သည်။ လုပ်ဖော်ကိုင်ဖက် ID {peerID}။ {props}။",
  "onboarding.username.explanation":
    "ဤအသုံးပြုသူအမည်ကို သင့်အများသုံးသော့မှ တိကျစွာ ထုတ်ယူထားသည်။ သင့်လုပ်ဖော်ကိုင်ဖက် ID ကို မြင်သည့် စက်တိုင်းတွင် တူညီပါသည်။",
  "onboarding.username.cta": "Airhop သို့ ဝင်ပါ",
  "onboarding.username.prop.algorithm": "အယ်လဂိုရီသမ်",
  "onboarding.username.prop.storage": "သိမ်းဆည်းရာ",
  "onboarding.username.prop.storage_value": "စနစ်၏သော့သိမ်းတွင်သာ",
  "onboarding.username.prop.account": "အကောင့် လိုအပ်မှု",
  "onboarding.username.prop.account_value": "မလိုပါ",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Airhop မှ ကြိုဆိုပါသည်",
  "onboarding.hello.p1":
    "မင်္ဂလာပါ။ Airhop ကို bitchat အပေါ်တွင် တည်ဆောက်ထားသော သီးခြားလွတ်လပ်သည့် ပွင့်လင်းအရင်းအမြစ် ဘေးထွက်စီမံကိန်းတစ်ခုအဖြစ် ရေးသားထားပါသည်။ bitchat စီမံကိန်း သို့မဟုတ် permissionless tech နှင့် ဆက်စပ်မှုမရှိသလို ၎င်းတို့၏ ထောက်ခံမှုလည်း မရရှိထားပါ။ ကျွန်ုပ်တည်ဆောက်ရတာ နှစ်သက်ပြီး အသိုက်အဝန်းနှင့် မျှဝေလိုသည့် အရာတစ်ခုသာ ဖြစ်ပါသည်။",
  "onboarding.hello.p2":
    "ဤသည်မှာ ပထမဆုံး iOS နှင့် Android ထုတ်ဝေမှုဖြစ်သဖြင့် သူငယ်ချင်းများနှင့် စမ်းသပ်ထားသော်လည်း ချွတ်ယွင်းချက်အနည်းငယ် တွေ့နိုင်ပါသည်။ တွေ့ခဲ့လျှင်၊ သို့မဟုတ် လုပ်ဆောင်ချက်အတွက် အကြံရှိလျှင် ကြားလိုပါသည်။ {github} တွင် issue ဖွင့်ပါ သို့မဟုတ် {email} သို့ အီးမေးလ်ပို့ပါ။",
  "onboarding.hello.p3":
    "Airhop က သင့်အတွက် အသုံးဝင်ခဲ့လျှင် {github} တွင် ကြယ်ပေးရန် သို့မဟုတ် {store} တွင် သုံးသပ်ချက်ရေးရန် စဉ်းစားပါ။ ဤသည်က ပိုမိုများပြားသောသူများ စီမံကိန်းကို ရှာတွေ့စေရန် အထောက်အကူပြုပါသည်။ စမ်းသုံးပေးသည့်အတွက် ကျေးဇူးတင်ပါသည်။",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "သင့်ဖုန်းက မမေးမီ",
  "onboarding.primer.lede":
    "တစ်ခုချင်းစီက ဘာလုပ်ပြီး ဘာမလုပ်သည်ကို ဤတွင် ဖော်ပြထားသည်။",
  "onboarding.primer.bluetooth.title": "ဘလူးတုသ်",
  "onboarding.primer.bluetooth.body":
    "အနီးအနားရှိ စက်များကို ရှာဖွေပြီး ၎င်းတို့အကြား မက်ဆေ့ဂျ်များကို ထပ်ဆင့်ပို့ပေးသည်။ မက်ရှ်ကို ဤနည်းဖြင့် တည်ဆောက်ပြီး အင်တာနက်မလိုဘဲ အလုပ်လုပ်သည်။",
  "onboarding.primer.location.title": "တည်နေရာ",
  "onboarding.primer.location.body":
    "ရပ်ကွက်မှ ဒေသအထိ အနီးအနားရှိ ဧရိယာချန်နယ်များတွင် သင့်ကို ထည့်သွင်းပေးသည်။ Airhop သည် သင့်ကို ဘယ်တော့မှ မခြေရာခံသလို သင့်တိကျသောတည်နေရာကိုလည်း စက်ပြင်ပသို့ မပို့ပါ။",
  "onboarding.primer.notifications.title": "အသိပေးချက်များ",
  "onboarding.primer.notifications.body":
    "အက်ပ်ပိတ်ထားချိန်တွင်ပင် မက်ဆေ့ဂျ်အသစ်များအတွက် အသိပေးချက် ရယူပါ။ အသိပေးချက်များကို သင့်စက်ပေါ်တွင်သာ ဖန်တီးပြီး ဆာဗာ မပါဝင်ပါ။",
  "onboarding.primer.footnote":
    "ငြင်းဆိုနိုင်ပါသည်။ မက်ဆေ့ဂျ်များသည် အင်တာနက်မှတစ်ဆင့် ဆက်လက်သွားလာနေဆဲဖြစ်ပြီး နောက်ပိုင်း ဆက်တင်များတွင် စိတ်ပြောင်းနိုင်ပါသည်။",
  "onboarding.primer.cta_a11y": "ခွင့်ပြုချက်တောင်းဆိုမှုများသို့ ဆက်သွားပါ",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "ဘလူးတုသ် အသုံးပြုခွင့်",
  "permission.bluetooth.purpose":
    "မက်ရှ်ပေါ်တွင် အနီးအနားရှိစက်များကို ရှာဖွေရန်",
  "permission.open_settings": "ဆက်တင်များ ဖွင့်ပါ",
  "permission.not_now": "ယခုမဟုတ်သေး",
  "permission.blocked_title": "{label} ပိတ်ထားသည်",
  "permission.blocked_body": "{purpose} အတွက် ဆက်တင်များတွင် ဖွင့်ပါ။",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "တစ်ခုခု မှားယွင်းသွားသည်",
  "error.boundary.body":
    "Airhop တွင် မမျှော်လင့်သော ပြဿနာတစ်ခု ကြုံခဲ့ရသဖြင့် ပြသနေသည်များကို ရပ်တန့်ရပါသည်။",

  // ---- Chats: channel list ----
  "chat.channels.default": "မူလ ချန်နယ်များ",
  "chat.channels.yours": "သင့် ချန်နယ်များ",
  "chat.channels.none": "ချန်နယ် မရှိသေးပါ",
  "chat.channels.none_hint":
    "ဝင်ရန် သို့မဟုတ် ဖန်တီးရန် အပေါ်က {plus} ကို နှိပ်ပါ။",
  "chat.channels.none_desc":
    "ချန်နယ် မရှိသေးပါ။ ဝင်ရန် သို့မဟုတ် ဖန်တီးရန် ခေါင်းစီးရှိ ထည့်ရန်ခလုတ်ကို သုံးပါ။",
  "chat.channels.show_fewer": "မူလချန်နယ် နည်းနည်း ပြပါ",
  "chat.channels.show_less": "နည်းနည်း ပြပါ",
  "chat.channels.info": "ချန်နယ် အချက်အလက်",
  "chat.channels.pin": "ချန်နယ် ပင်ထိုးပါ",
  "chat.channels.unpin": "ချန်နယ် ပင်ဖြုတ်ပါ",
  "chat.channels.mute": "ချန်နယ် အသံပိတ်ပါ",
  "chat.channels.unmute": "ချန်နယ် အသံဖွင့်ပါ",
  "chat.channels.leave": "ချန်နယ်မှ ထွက်ပါ",
  "chat.channels.leave_confirm": "ထွက်ပါ",
  "chat.channels.clear_body":
    "{name} ရှိ မက်ဆေ့ဂျ်အားလုံးကို ဖျက်မလား? ဤအရာကို ပြန်ပြင်၍ မရပါ။",
  "chat.channels.leave_body":
    "{name} မှ ထွက်မလား? ၎င်း၏မက်ဆေ့ဂျ်များ ရရှိတော့မည် မဟုတ်ဘဲ မှတ်တမ်းကိုလည်း ဤစက်မှ ဖယ်ရှားပါမည်။",
  "chat.channels.more_options": "{name} အတွက် ထပ်မံရွေးချယ်စရာများ",
  "chat.channels.teleported_tag": "{level}  ·  အဝေးမှ",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "စကားပြော ရှင်းပါ",
  "chat.dm.remove_contact": "အဆက်အသွယ် ဖယ်ပါ",
  "chat.dm.block": "ဤလုပ်ဖော်ကိုင်ဖက်ကို ပိတ်ဆို့ပါ",
  "chat.dm.block_confirm": "ပိတ်ဆို့ပါ",
  "chat.dm.delete": "စကားပြော ဖျက်ပါ",
  "chat.dm.delete_body":
    "ဤသည်က စကားပြောကို သင့်စာရင်းမှ ဖယ်ရှားပြီး ၎င်း၏မက်ဆေ့ဂျ်များကို ဖျက်ပါသည်။ အဆက်အသွယ်မှာ ကျန်နေပြီး ၎င်းတို့ထံမှ မက်ဆေ့ဂျ်အသစ်တစ်ခုက စကားပြောအသစ်တစ်ခု စတင်ပါလိမ့်မည်။",
  "chat.dm.in_range": "အကွာအဝေးအတွင်း",
  "chat.dm.row_hint": "ထပ်မံရွေးချယ်စရာများအတွက် နှစ်ချက်နှိပ်ပြီး ဖိထားပါ",
  "chat.channels.row_hint":
    "ထပ်မံရွေးချယ်စရာများအတွက် နှစ်ချက်နှိပ်ပြီး ဖိထားပါ",
  "chat.dm.you_prefix": "သင် —",
  "chat.dm.none": "တိုက်ရိုက်မက်ဆေ့ဂျ် မရှိပါ",
  "chat.dm.none_desc":
    "စာဝှက်ထားသော တိုက်ရိုက်မက်ဆေ့ဂျ် စတင်ရန် မက်ရှ်တဘ်သို့သွား၍ လုပ်ဖော်ကိုင်ဖက်တစ်ဦးကို နှိပ်ပါ။",
  "chat.dm.contact_info": "အဆက်အသွယ် အချက်အလက်",
  "chat.dm.pin": "စကားပြော ပင်ထိုးပါ",
  "chat.dm.unpin": "စကားပြော ပင်ဖြုတ်ပါ",
  "chat.dm.mute": "စကားပြော အသံပိတ်ပါ",
  "chat.dm.unmute": "စကားပြော အသံဖွင့်ပါ",
  "chat.dm.clear_body":
    "{name} နှင့် မက်ဆေ့ဂျ်အားလုံးကို ဖျက်မလား? ဤအရာကို ပြန်ပြင်၍ မရပါ။",
  "chat.dm.remove_contact_body":
    "{name} ကို ဖယ်မလား? ဤသည်က စကားပြောကို ဖျက်ပြီး အဆက်အသွယ်ကို မေ့ပစ်ပါသည်။ ၎င်းတို့ ထပ်မံမက်ဆေ့ဂျ်ပို့ပါက သင့်ထံ ရောက်နိုင်ဆဲဖြစ်သည်။",
  "chat.dm.block_body":
    "{name} ကို ပိတ်ဆို့မလား? မက်ရှ်တဘ်တွင် ၎င်းတို့ကို မမြင်ရတော့သလို မက်ဆေ့ဂျ်လည်း မရရှိတော့ပါ၊ အနီးအနားရှိနေလျှင်ပင် ဖြစ်သည်။",
  "chat.dm.more_options": "{name} အတွက် ထပ်မံရွေးချယ်စရာများ",
  "chat.dm.remove_contact_short": "အဆက်အသွယ် ဖယ်ပါ",
  "chat.dm.block_short": "အဆက်အသွယ် ပိတ်ဆို့ပါ",
  "chat.dm.delete_short": "စကားပြော ဖျက်ပါ",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "မက်ဆေ့ဂျ်များ ရှင်းပါ",
  "chat.clear_confirm": "ရှင်းပါ",
  "chat.group_badge": "အဖွဲ့",
  "chat.more": "ထပ်မံ",
  "chat.no_messages": "မက်ဆေ့ဂျ် မရှိသေးပါ",
  "chat.you": "သင်",
  "chat.a11y.channel": "ချန်နယ် {name}",
  "chat.a11y.group": "အဖွဲ့ {name}",
  "chat.a11y.muted": "အသံပိတ်ထားသည်",
  "chat.a11y.pinned": "ပင်ထိုးထားသည်",

  // ---- Chats: start something new ----
  "chat.new.title": "အသစ်တစ်ခု စတင်ပါ",
  "chat.new.channel": "သီးသန့်ချန်နယ် ဖန်တီးပါ",
  "chat.new.channel_label": "သီးသန့် ချန်နယ်",
  "chat.new.channel_desc":
    "လင့်ခ်ရှိသူတိုင်း ဝင်နိုင်သော အခန်းတစ်ခု။ တစ်ခု ဖန်တီးပါ၊ သို့မဟုတ် သင့်ထံပို့ထားသော လင့်ခ်ဖြင့် ဝင်ပါ။",
  "chat.new.group": "သီးသန့်အဖွဲ့ ဖန်တီးပါ",
  "chat.new.group_label": "သီးသန့် အဖွဲ့",
  "chat.new.group_desc":
    "သီးခြားလူများကို ရွေးပါ။ 16 ဦးအထိ။ ဘလူးတုသ်ပေါ်တွင် ကျန်နေသည်။",
  "chat.new.place": "ဂျီအိုဟက်ရှ်ဖြင့် နေရာတစ်ခုသို့ သွားပါ",
  "chat.new.place_label": "နေရာတစ်ခုသို့ သွားပါ",
  "chat.new.place_desc":
    "မည်သည့်နေရာ၏ တည်နေရာချန်နယ်ကိုမဆို ဂျီအိုဟက်ရှ်ဖြင့် ဖွင့်ပါ။",
  "chat.new.reach": "ရောက်ရှိနိုင်မှု",
  "chat.new.reach_internet":
    "အဖွဲ့ဝင်များထံ ဘလူးတုသ်နှင့် အင်တာနက်မှတစ်ဆင့် ရောက်သည်။",
  "chat.new.reach_mesh":
    "ဘလူးတုသ်အကွာအဝေးအတွင်း အလုပ်လုပ်ပြီး အင်တာနက်မှ မဟုတ်ပါ။",
  "chat.new.reach_internet_desc":
    "အဖွဲ့ဝင်များထံ အင်တာနက်မှလည်း ရောက်သည်။ ထပ်ဆင့်လွှင့်စက်များက ချန်နယ် အသုံးပြုနေကြောင်း မြင်နိုင်သော်လည်း ၎င်း၏မက်ဆေ့ဂျ်များ သို့မဟုတ် မည်သူပါဝင်သည်ကို ဘယ်တော့မှ မမြင်ရပါ။",
  "chat.new.reach_mesh_desc":
    "ဒေသတွင်းမက်ရှ်ပေါ်တွင်သာ ကျန်နေသည်။ အသီးသန့်ဆုံးဖြစ်ပြီး ဘလူးတုသ်အကွာအဝေးပြင်ပသို့ ဘာမျှ မထွက်ပါ။",
  "chat.new.join_link": "ဖိတ်ကြားလင့်ခ်ဖြင့် သီးသန့်ချန်နယ်သို့ ဝင်ပါ",
  "chat.new.back_to_chooser": "ရွေးချယ်မှုသို့ ပြန်သွားပါ",
  "chat.new.create_channel": "ချန်နယ် ဖန်တီးပါ",
  "chat.new.name_required": "ချန်နယ်အမည်ကို အရင်ထည့်ပါ",
  "chat.new.name_taken": "ထိုအမည်ကို သုံးထားပြီးဖြစ်သည်",
  "chat.new.create": "ဖန်တီးပါ",
  "chat.new.e2ee":
    "အစမှအဆုံး စာဝှက်ထားသည်။ မက်ဆေ့ဂျ်များကို အဖွဲ့ဝင်များသာ ဖတ်နိုင်သည်။",
  "chat.new.invite_only":
    "ဖိတ်ကြားမှုဖြင့်သာ။ သင်လင့်ခ်မျှဝေထားသူတိုင်း ဝင်နိုင်သည်။ အခြားသူအားလုံးထံမှ ဖုံးကွယ်ထားပြီး အနီးအနားရှိလုပ်ဖော်ကိုင်ဖက်များထံမှပင် ဖြစ်သည်။",
  "chat.new.name_exists": "ဤအမည်ဖြင့် ချန်နယ်တစ်ခု ရှိပြီးသားဖြစ်သည်။",
  "chat.new.reach_bluetooth_chip": "ဘလူးတုသ်သာ",
  "chat.new.reach_internet_chip": "ဘလူးတုသ် + အင်တာနက်",
  "chat.new.have_link": "ဖိတ်ကြားလင့်ခ်ဖြင့် ဝင်ပါ",

  // ---- Chats: join by link ----
  "chat.join.title": "လင့်ခ်ဖြင့် ဝင်ပါ",
  "chat.join.not_airhop": "ထိုအရာသည် Airhop လင့်ခ် မဟုတ်ပါ။",
  "chat.join.reach_internet":
    "အဖွဲ့ဝင်များထံ ဘလူးတုသ်နှင့် အင်တာနက်မှတစ်ဆင့် ရောက်သည်။",
  "chat.join.reach_mesh": "ဘလူးတုသ်အကွာအဝေးအတွင်း ကျန်နေသည်။",
  "chat.join.contact_card":
    "အဆက်အသွယ်ကတ်တစ်ခု။ ၎င်းတို့ကို သင့်အဆက်အသွယ်များထဲ ထည့်ပြီး စကားပြောကို ဖွင့်ပေးသည်။",
  "chat.join.unverified": "ထိုလင့်ခ်ကို အတည်မပြုနိုင်ခဲ့ပါ",
  "chat.join.unverified_body":
    "အဆက်အသွယ်ကတ်သည် ကိုယ့်သော့များနှင့် မကိုက်ညီသဖြင့် မထည့်ခဲ့ပါ။ အသစ်တစ်ခု ပို့ပေးရန် တောင်းဆိုပါ။",
  "chat.join.paste": "ကလစ်ဘုတ်မှ ကူးထည့်ပါ",
  "chat.join.join": "ဝင်ပါ",
  "chat.join.public_channel":
    "အများသုံးချန်နယ် {name}။ အနီးအနားရှိသူတိုင်း ဖတ်နိုင်သည်။",
  "chat.join.private_channel": "သီးသန့်ချန်နယ် {name}။ {reach}",
  "chat.join.dm_with": "{name} နှင့် တိုက်ရိုက်မက်ဆေ့ဂျ်။",
  "chat.join.joined_as": "{name} အဖြစ် ဝင်ပြီးပါပြီ",
  "chat.join.name_clash_body":
    "သင်သည် အခြား {name} တစ်ခုတွင် ရှိနေပြီးဖြစ်သည်။ ချန်နယ်အမည်များသည် အညွှန်းသာဖြစ်၍ ဤဖိတ်ကြားချက်က ကိုယ်ပိုင်ချန်နယ်တစ်ခု ဖွင့်ခဲ့ပြီး သင်ရှိနေခဲ့သည်ကို မထိပါ။ မည်သည့်ချန်နယ်ကိုမဆို ၎င်း၏ချန်နယ်အချက်အလက်မှ အမည်ပြောင်းနိုင်သည်။",
  "chat.join.paste_hint":
    "airhop:// ဖြင့် စတင်သော ဖိတ်ကြားချက်ကို ကူးထည့်ပါ။ လင့်ခ်တစ်ခုကို နှိပ်ခြင်းလည်း အလုပ်လုပ်သည်။ ဤနည်းမှာ မနှိပ်နိုင်သောလင့်ခ်အတွက် ဖြစ်သည်။",
  "chat.join.key_note":
    "သီးသန့်ချန်နယ်ဖိတ်ကြားချက်သည် သော့ကို သယ်ဆောင်လာသဖြင့် ဝင်ရောက်မှုမှာ ချက်ချင်းဖြစ်ပြီး အခြားမည်သူ့ထံမှမျှ ဘာမျှ မတောင်းဆိုပါ။",
  "chat.join.offline_note":
    "အော့ဖ်လိုင်းတွင် အလုပ်လုပ်သည်။ လင့်ခ်ကို ဤစက်ပေါ်တွင် ဖတ်ပြီး ချန်နယ်သည် ဖန်တီးသူ သတ်မှတ်ထားသည့်အတိုင်း ရောက်ရှိပါသည်။",

  // ---- Chats: go to a place ----
  "chat.jump.failed": "ထိုဆဲလ်ကို မဖွင့်နိုင်ခဲ့ပါ။ ခဏနေ ထပ်စမ်းကြည့်ပါ။",
  "chat.jump.title": "နေရာတစ်ခုသို့ သွားပါ",
  "chat.jump.saved": "သိမ်းထားသော နေရာများ",
  "chat.jump.anywhere":
    "မည်သည့်နေရာ၏ အများသုံးတည်နေရာချန်နယ်ကိုမဆို ဖွင့်ပါ၊ သင်မရှိသောနေရာပင် ဖြစ်စေ။",
  "chat.jump.geohash_note":
    "၎င်း၏ ဂျီအိုဟက်ရှ်ကို ထည့်ပါ။ တည်နေရာသည် ထိုဆဲလ်အတွင်း ကျရောက်သူတိုင်း ချန်နယ်ကို မျှဝေသုံးသည်။",
  "chat.jump.teleport_note":
    "သင်သည် အနီးအနားမဟုတ်ဘဲ အဝေးမှလာသူအဖြစ် ပေါ်မည်။ အင်တာနက်မှသာ ရောက်သည်။",
  "chat.jump.level_cell": "{level} ဆဲလ်",
  "chat.jump.already_here":
    "သင် ဤနေရာတွင် ရှိပြီးသားဖြစ်သည်။ သွားပါ က သင့် {name} ချန်နယ်ကို ဖွင့်ပေးသည်။",
  "chat.jump.open_direction": "သင့် {direction} ဘက်ရှိ ဆဲလ်ကို ဖွင့်ပါ",
  "chat.jump.open_place": "{name} ကို ဖွင့်ပါ",
  "chat.jump.remove_place": "{name} ကို သိမ်းထားသောနေရာများမှ ဖယ်ပါ",
  "chat.jump.go": "သွားပါ",
  "chat.jump.how":
    "ဂျီအိုဟက်ရှ်ရှာရန် — တည်နေရာချန်နယ်တစ်ခု ဖွင့်ပါ > ၎င်း၏အမည်ကို နှိပ်ပါ > ထိုနေရာမှ ကူးပါ။",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "အဖွဲ့ဝင်တိုင်းထံ မရောက်နိုင်ခဲ့ပါ။ ၎င်းတို့ အနီးအနားရှိချိန်တွင် ထပ်စမ်းကြည့်ပါ။",
  "chat.group.you_were_added": "သင့်ကို {name} ထဲသို့ ထည့်လိုက်ပါပြီ။",
  "chat.group.added_you": "သင့်ကို {name} ထဲသို့ ထည့်ခဲ့သည်",
  "chat.group.you_were_removed":
    "သင့်ကို {name} မှ ဖယ်ရှားလိုက်ပါပြီ။ ဤနေရာတွင် ဖတ်ခြင်း၊ ပို့ခြင်း မလုပ်နိုင်တော့ပါ။",
  "chat.group.removed_you": "သင့်ကို {name} မှ ဖယ်ရှားခဲ့သည်",
  "chat.group.add_failed": "၎င်းတို့ကို မထည့်နိုင်ခဲ့ပါ",
  "chat.group.add_failed_body":
    "ဘာမျှ မပြောင်းလဲပါ။ ယခုအချိန် ၎င်းတို့ကို မဆက်သွယ်နိုင်ခြင်း၊ အဖွဲ့သည် 16 ဦးဖြင့် ပြည့်နေခြင်း၊ သို့မဟုတ် သင်သည် ဖန်တီးသူမဟုတ်ခြင်း ဖြစ်နိုင်သည်။",
  "chat.group.remove_failed": "၎င်းတို့ကို မဖယ်ရှားနိုင်ခဲ့ပါ",
  "chat.group.remove_failed_body":
    "ဘာမျှ မပြောင်းလဲပါ။ အဖွဲ့တွင် မည်သူပါဝင်သည်ကို ပြောင်းနိုင်သူမှာ အဖွဲ့ဖန်တီးသူသာ ဖြစ်သည်။",
  "chat.group.e2ee":
    "အစမှအဆုံး စာဝှက်ထားသည်။ မက်ဆေ့ဂျ်များကို အဖွဲ့ဝင်များသာ ဖတ်နိုင်သည်။",
  "chat.group.cap":
    "သင်ရွေးထားသော 16 ဦးအထိ။ ဖိတ်ကြားလင့်ခ် မရှိသဖြင့် လင့်ခ်ထပ်ဆင့်ရရှိ၍ ဝင်လာသူ မရှိပါ။",
  "chat.group.bluetooth":
    "ဘလူးတုသ်သာ။ အကွာအဝေးပြင်ပရှိ အဖွဲ့ဝင်များသည် ပြန်ရောက်လာလျှင် မက်ဆေ့ဂျ်များ ရရှိပါမည်။",
  "chat.group.members_label": "အဖွဲ့ဝင်များ",
  "chat.group.none_in_range":
    "အကွာအဝေးအတွင်း မည်သူမျှ မရှိပါ။ အဖွဲ့ဖန်တီးချိန်တွင် အဖွဲ့ဝင်များ အနီးအနား ရှိရမည်။",
  "chat.group.create_title": "အဖွဲ့ ဖန်တီးပါ",
  "chat.group.name_placeholder": "အဖွဲ့အမည်",
  "chat.group.create": "ဖန်တီးပါ",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "ဒေသတွင်း မက်ရှ် · ဘလူးတုသ်သာ",
  "chat.scope.mesh_desc":
    "ဘလူးတုသ်အကွာအဝေး (ခန့်မှန်းခြေ 10 မှ 100 မီတာ) အတွင်းရှိ စက်များထံ ရောက်သည်။ အင်တာနက် မလိုပါ။ ဒေသတွင်း ညှိနှိုင်းမှုအတွက် သင့်တော်သည်။",
  "chat.scope.block": "မြို့ပြအကွက် · ~100 မီတာ",
  "chat.scope.block_desc":
    "မြို့ပြအကွက်အဆင့် လွှမ်းခြုံမှု။ ဘလူးတုသ်အကွာအဝေးပြင်ပ ဖြစ်သော်လည်း အနီးအနားရှိ လုပ်ဖော်ကိုင်ဖက်များ ပါဝင်နိုင်ရန် မက်ဆေ့ဂျ်များကို အင်တာနက်မှတစ်ဆင့် ချိတ်ဆက်ပေးသည်။",
  "chat.scope.neighborhood": "ရပ်ကွက် · ~1 ကီလိုမီတာ",
  "chat.scope.neighborhood_desc":
    "ရပ်ကွက်အဆင့် လွှမ်းခြုံမှု။ ထပ်ဆင့်လွှင့်စက်အကူအညီဖြင့် တိုက်ရိုက်ဘလူးတုသ်ချိတ်ဆက်မှုမရှိလည်း ဧရိယာတစ်ဝိုက်ရှိ လုပ်ဖော်ကိုင်ဖက်များထံ ရောက်နိုင်သည်။",
  "chat.scope.city": "မြို့ · ~10 ကီလိုမီတာ",
  "chat.scope.city_desc":
    "မြို့တစ်ခုလုံးအတိုင်းအတာ ချန်နယ်။ မြို့ကြီးတစ်ဝိုက်ရှိ လုပ်ဖော်ကိုင်ဖက်များထံ ရောက်ရန် တည်နေရာအခြေပြု အင်တာနက်ထပ်ဆင့်လွှင့်စက်များကို သုံးသည်။",
  "chat.scope.province": "ပြည်နယ် သို့မဟုတ် တိုင်း · ~100 ကီလိုမီတာ",
  "chat.scope.province_desc":
    "ပြည်နယ် သို့မဟုတ် တိုင်းအဆင့် လွှမ်းခြုံမှု။ ကီလိုမီတာရာနှင့်ချီသော ဒေသဆိုင်ရာအကွာအဝေးအတွက် အင်တာနက်မှတစ်ဆင့် ချိတ်ဆက်ထားသည်။",
  "chat.scope.country": "နိုင်ငံ သို့မဟုတ် ဒေသ · ~1000 ကီလိုမီတာ",
  "chat.scope.country_desc":
    "နိုင်ငံတစ်ခုလုံး လွှမ်းခြုံမှု။ ထိုဒေသရှိ မည်သည့် Airhop သို့မဟုတ် bitchat အသုံးပြုသူမဆို ဝင်ရောက်ပြီး မက်ဆေ့ဂျ်များ ဖတ်နိုင်သည်။",
  "chat.transport.bluetooth": "ဘလူးတုသ်သာ",
  "chat.transport.both": "ဘလူးတုသ် + အင်တာနက်",
  "chat.transport.internet": "အင်တာနက်သာ",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "အမိန့် /{cmd} — {hint}",
  "chat.cmd.hug_hint": "နွေးထွေးသော ဖက်တွယ်မှုတစ်ခု ပို့ပါ",
  "chat.cmd.slap_hint": "ငါးကြီးတစ်ကောင်ဖြင့် ရိုက်ပါ",
  "chat.status.sending": "ပို့နေသည်…",
  "chat.status.undo_send": "ပို့ခြင်း ပြန်ရုပ်သိမ်းပါ",
  "chat.status.undo": "ပြန်ရုပ်သိမ်းပါ",
  "chat.status.sent": "ပို့ပြီး",
  "chat.status.received": "လက်ခံရရှိပြီး",
  "chat.status.failed": "မအောင်မြင်ပါ",
  "chat.status.canceled": "ပယ်ဖျက်ပြီး",
  "chat.status.waiting": "စောင့်ဆိုင်းဆဲ",
  "chat.status.sending_short": "ပို့နေသည်",
  "chat.status.receiving": "လက်ခံနေသည်",
  "chat.thread.not_available": "ဤနေရာတွင် မရနိုင်ပါ",
  "chat.thread.private_channel": "သီးသန့် ချန်နယ်",
  "chat.thread.location_channel": "တည်နေရာ ချန်နယ်",
  "chat.thread.public_channel": "အများသုံး ချန်နယ်",
  "chat.thread.notices": "ဤချန်နယ်၏ အသိပေးချက်များ",
  "chat.thread.invite": "ဤချန်နယ်သို့ တစ်စုံတစ်ဦးကို ဖိတ်ပါ",
  "chat.thread.not_in_range":
    "ဘလူးတုသ်အကွာအဝေးအတွင်း မဟုတ်ပါ။ အင်တာနက်မှတစ်ဆင့် ပို့နေသည်။",
  "chat.thread.not_nearby":
    "အနီးအနားတွင် မရှိပါ။ ၎င်းတို့ အကွာအဝေးအတွင်း ပြန်ရောက်လာလျှင် သို့မဟုတ် အွန်လိုင်းရောက်လျှင် ပို့ပေးပါမည်။",
  "chat.thread.no_keys":
    "၎င်းတို့ကို မက်ဆေ့ဂျ်ပို့ရန် ဘလူးတုသ်အကွာအဝေးအတွင်း ရှိရမည် သို့မဟုတ် ၎င်းတို့၏ကုဒ်ကို စကန်ဖတ်ရမည်။",
  "chat.geo.card_received":
    "{name} က ၎င်းတို့၏အဆက်အသွယ်ကို မျှဝေခဲ့သည်။ တစ်ဦးဦး နေရာရွှေ့ပြီးနောက်လည်း ဆက်ပြောနိုင်ရန် သင့်အဆက်အသွယ်ကို ပြန်မျှဝေပါ။",
  "chat.geo.exchange_complete":
    "အဆက်အသွယ်များ ဖလှယ်ပြီးပါပြီ။ ယခု မည်သည့်နေရာမှမဆို အပြန်အလှန် ဆက်သွယ်နိုင်ပါပြီ။",
  "chat.geo.keep_person": "ဤသူကို သိမ်းထားပါ",
  "chat.geo.keep_person_desc":
    "တစ်ဦးဦး နေရာရွှေ့ပြီးနောက်လည်း ဆက်ပြောနိုင်ရန် သင့်အဆက်အသွယ်ကို မျှဝေပါ။ ၎င်းတို့သည် သင့်အမြဲတမ်းအထောက်အထားကို သိသွားပါမည်။",
  "chat.geo.card_sent": "မျှဝေပြီး · ၎င်းတို့၏အရာကို စောင့်နေသည်",
  "chat.thread.left_cell":
    "သင် ဤဧရိယာမှ ထွက်ခွာသွားပြီဖြစ်၍ ၎င်းတို့ ဤနေရာတွင် သင့်ထံ မရောက်နိုင်ပါ။ မည်သည့်နေရာမှမဆို ဆက်ပြောနိုင်ရန် ကုဒ်များ ဖလှယ်ပါ။",
  "chat.thread.no_route":
    "ယခုအချိန် ၎င်းတို့ထံ မရောက်နိုင်ပါ။ လမ်းကြောင်းရရှိလျှင် မက်ဆေ့ဂျ်ကို ပို့ပါမည်။",
  "chat.thread.empty": "မက်ဆေ့ဂျ် မရှိသေးပါ",
  "chat.thread.empty_desc": "စာဝှက်ထားသော စကားပြောတစ်ခု စတင်ပါ။",
  "chat.thread.jump_latest": "နောက်ဆုံးမက်ဆေ့ဂျ်သို့ ခုန်ပါ",
  "chat.thread.back_to_members": "အဖွဲ့ဝင်များသို့ ပြန်သွားပါ",
  "chat.thread.nostr_key": "Nostr အများသုံးသော့",
  "chat.thread.in_range": "အကွာအဝေးအတွင်း",
  "chat.voice.not_recorded": "အသံမှတ်စု အသံမဖမ်းခဲ့ပါ",
  "chat.thread.message": "မက်ဆေ့ဂျ်",
  "chat.thread.message_placeholder": "မက်ဆေ့ဂျ်…",
  "chat.thread.length_full": "မက်ဆေ့ဂျ် ပြည့်နေပါပြီ",
  "chat.thread.waiting_for": "{name} ပြန်လာရန် စောင့်နေသည် · {percent}%",
  "chat.thread.peer": "လုပ်ဖော်ကိုင်ဖက်",
  "chat.thread.cancel_transfer": "{name} ကို ပယ်ဖျက်ပါ",
  "chat.thread.queued_more": "နောက်ထပ် {count} ခု ပို့ရန် စောင့်နေသည်",
  "chat.thread.across_bridge": "တံတားတစ်ဖက်တွင် {count} ဦး",
  "chat.thread.bridged": "တံတားဖြင့် ချိတ်ဆက်ထားသည်",
  "chat.thread.invite_body":
    "Airhop ရှိ {channel} တွင် ကျွန်ုပ်နှင့် ပူးပေါင်းပါ — အော့ဖ်လိုင်းဦးစားပေး သီးသန့်မက်ရှ်စကားပြောစနစ်။",
  "chat.thread.go_back_unread": "ပြန်သွားပါ၊ မဖတ်ရသေးသည် {count} ခု",
  "chat.thread.view_info": "{name} ၏ အချက်အလက်ကို ကြည့်ပါ",
  "chat.thread.notices_new": "ဤချန်နယ်၏ အသိပေးချက်များ၊ အသစ် {count} ခု",
  "chat.thread.say_something": "{channel} တွင် တစ်ခုခု ပြောပါ။",
  "chat.thread.jump_latest_new":
    "နောက်ဆုံးမက်ဆေ့ဂျ်သို့ ခုန်ပါ၊ အသစ် {count} ခု",
  "chat.thread.unconfirmed_since": "{date} ကတည်းက ရောက်ရှိမှု အတည်မပြုရသေးပါ",
  "chat.thread.no_reach":
    "အနီးအနားတွင် လုပ်ဖော်ကိုင်ဖက် မရှိပါ · ဤအရာကို မည်သူမျှ မရရှိသေးပါ",
  "chat.thread.channel_needs_internet":
    "အင်တာနက် ပိတ်ထားသည် · ဤချန်နယ်သည် ဘလူးတုသ်အကွာအဝေးအတွင်းရှိသူများထံသာ ရောက်သည်",
  "chat.thread.cell_needs_internet":
    "အင်တာနက် ပိတ်ထားသည် · ဤဆဲလ်သို့ အင်တာနက်မှသာ ရောက်နိုင်သည်",
  "chat.thread.geo_dm_needs_internet":
    "အင်တာနက် ပိတ်ထားသည် · ဤစကားပြောကို အင်တာနက်မှသာ သယ်ဆောင်သည်",
  "chat.thread.via_gateway":
    "အင်တာနက် ပိတ်ထားသည် · အနီးအနားရှိစက်တစ်ခုက သင့်အတွက် ဤအရာကို အွန်လိုင်းတွင် သယ်ဆောင်ပေးနေသည်",
  "chat.thread.group_queued":
    "ဤအဖွဲ့မှ မည်သူမျှ အနီးအနားတွင် မရှိသေးပါ။ ရှိလာလျှင် ၎င်းတို့ထံ ရောက်ပါမည်။",
  "chat.thread.no_group_key":
    "သင်သည် ဤအဖွဲ့တွင် မရှိတော့သဖြင့် ဤအရာကို မပို့နိုင်ပါ",
  "chat.thread.no_reach_offline":
    "အင်တာနက် ပိတ်ထားပြီး အနီးအနားတွင်လည်း လုပ်ဖော်ကိုင်ဖက် မရှိပါ · ဤအရာကို မည်သူမျှ မရရှိသေးပါ",
  "chat.thread.mention": "{name} ကို ဖော်ပြပါ",
  "chat.thread.someone_talking": "{hold}။ {name} စကားပြောနေသည်။",
  "chat.thread.attach_note":
    "ဖိုင်များကို ဘလူးတုသ်အကွာအဝေးအတွင်းသာ ပို့သည်။ စာသားနှင့် ငွေပေးချေမှုများသည် အင်တာနက်အဆက်အသွယ်များထံ ရောက်သော်လည်း ပူးတွဲဖိုင်များ မရောက်ပါ။",
  "chat.thread.message_peer": "{name} ကို မက်ဆေ့ဂျ်ပို့ပါ",
  "chat.thread.send": "မက်ဆေ့ဂျ် ပို့ပါ",
  "chat.thread.group": "အဖွဲ့",
  "chat.bridge.nearby_only":
    "အနီးအနားသာ — ဤမက်ဆေ့ဂျ်ကို မက်ရှ်တံတားမှ ဝေးရာတွင် ထားပါ",
  "chat.bridge.nearby_label": "အနီးအနားသာ · ဘလူးတုသ်ပေါ်တွင် ကျန်နေသည်",
  "chat.bridge.bridging_label":
    "အနီးအနားဧရိယာများသို့ ချိတ်ဆက်နေသည် · အနီးအနားသာအတွက် နှိပ်ပါ",
  "chat.screenshot.you_took": "သင် ဖန်သားပြင်ဓာတ်ပုံ ရိုက်ခဲ့သည်",
  "chat.screenshot.you_took_private":
    "သင် ဖန်သားပြင်ဓာတ်ပုံ ရိုက်ခဲ့သည် · မည်သူ့ကိုမျှ မပြောပါ",
  "chat.screenshot.heads_up": "သတိပြုပါ",
  "chat.screenshot.notice": "* {name} က ဖန်သားပြင်ဓာတ်ပုံ ရိုက်ခဲ့သည် *",
  "chat.screenshot.notified_dm":
    "ဤစကားပြော၏ ဖန်သားပြင်ဓာတ်ပုံ သင်ရိုက်ခဲ့ကြောင်း {name} ကို အသိပေးထားပါသည်။",
  "chat.screenshot.notified":
    "ဖန်သားပြင်ဓာတ်ပုံ သင်ရိုက်ခဲ့ကြောင်း ဤချန်နယ်ရှိ လူတိုင်းကို အသိပေးထားပါသည်။",
  "chat.screenshot.not_notified":
    "မည်သူ့ကိုမျှ မအသိပေးပါ။ ဤချန်နယ်သည် အများသုံးဖြစ်၍ ဖန်သားပြင်ဓာတ်ပုံရိုက်ကြောင်း ကြေညာခြင်းက သင် ဤနေရာတွင် ရှိခဲ့ကြောင်း မှတ်တမ်းတင်သွားမည် ဖြစ်သည်။",
  "chat.thread.error": "အမှား",
  "chat.thread.go_back": "ပြန်သွားပါ",
  "chat.bubble.via_bridge": "မက်ရှ်တံတားမှတစ်ဆင့်",
  "chat.bubble.view_profile": "{name} ၏ ပရိုဖိုင်ကို ကြည့်ပါ",
  "chat.bubble.forwarded": "ထပ်ဆင့်ပို့ထားသည်",
  "chat.bubble.attachment": "ပူးတွဲဖိုင်",
  "chat.bubble.a11y": "{sender} — {body}။ ထပ်မံရွေးချယ်စရာများအတွက် ဖိထားပါ။",
  "chat.bubble.failed_retry": "ပို့၍ မရပါ။ ထပ်စမ်းရန် နှိပ်ပါ။",

  // ---- Chats: message actions and info ----
  "chat.info.title": "မက်ဆေ့ဂျ် အချက်အလက်",
  "chat.info.delivered_to": "{name} ထံ ရောက်ပြီး",
  "chat.info.read_by": "{name} က ဖတ်ပြီး",
  "chat.info.group_reach_desc":
    "ယခုအချိန် ဆက်သွယ်နိုင်သည်၊ ရောက်ရှိမှု အတည်ပြုချက် မဟုတ်ပါ",
  "chat.info.group_alone": "အခြားအဖွဲ့ဝင် မရှိပါ",
  "chat.info.today_at": "ယနေ့ {time}",
  "chat.info.sending": "ပို့နေသည်…",
  "chat.info.failed": "ပို့၍ မရပါ",
  "chat.info.courier": "မိတ်ဆွေတစ်ဦးက သယ်ဆောင်ပေးသည်",
  "chat.info.sent": "ပို့ပြီး",
  "chat.info.queued": "ပို့ရန် စောင့်နေသည်",
  "chat.info.waiting": "စောင့်နေသည်…",
  "chat.action.info": "မက်ဆေ့ဂျ် အချက်အလက်",
  "chat.action.save_photos": "ဓာတ်ပုံများသို့ သိမ်းပါ",
  "chat.action.save_copy": "မိတ္တူတစ်ခု သိမ်းပါ",
  "chat.action.forward": "ထပ်ဆင့်ပို့ပါ",
  "chat.action.select": "ရွေးပါ",
  "chat.select.cancel": "ရွေးချယ်မှု ပယ်ဖျက်ပါ",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "ကင်မရာ",
  "chat.attach.camera_desc": "ဓာတ်ပုံ သို့မဟုတ် ဗီဒီယို ရိုက်ပါ",
  "chat.attach.library": "ဓာတ်ပုံပြခန်း",
  "chat.attach.library_desc": "သင့်ပြခန်းမှ ရွေးပါ",
  "chat.attach.document": "စာရွက်စာတမ်း",
  "chat.attach.document_desc": "မည်သည့်ဖိုင် သို့မဟုတ် PDF မဆို ပို့ပါ",
  "chat.attach.voice": "အသံမှတ်စု",
  "chat.attach.voice_desc": "အသံမက်ဆေ့ဂျ် ဖမ်းပြီး ပို့ပါ",
  "chat.attach.ecash": "ecash ပို့ပါ",
  "chat.attach.ecash_desc": "သင့်ပိုက်ဆံအိတ်မှ Cashu sats ပို့ပါ",
  "chat.attach.location": "တည်နေရာ",
  "chat.attach.location_desc": "သင် ယခုရှိသည့်နေရာကို ပို့ပါ",
  "chat.attach.title": "ပူးတွဲပါ",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "တည်နေရာ မျှဝေခဲ့သည်",
  "chat.location.received_summary": "၎င်းတို့၏ တည်နေရာကို မျှဝေခဲ့သည်",
  "chat.location.title": "တည်နေရာ",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "လွန်ခဲ့သော {ago} က ယူထားသည်",
  "chat.location.open_maps": "Maps တွင် ဖွင့်ပါ",
  "chat.location.no_forward": "တည်နေရာများကို ထပ်ဆင့်မပို့ပါ",
  "chat.location.no_forward_body":
    "တည်နေရာကို လူတစ်ဦးထံသာ ပို့သည်။ အခြားသူတစ်ဦး ရစေလိုပါက ယင်းအစား သင့်ကိုယ်ပိုင်တည်နေရာကို မျှဝေပါ။",
  "chat.location.no_fix":
    "ဤနေရာ မည်မျှဝေးသည်ကို ကြည့်ရန် တည်နေရာကို ခွင့်ပြုပါ",
  "chat.location.send_title": "သင့်တည်နေရာ ပို့ပါ",
  "chat.location.send_body":
    "{name} သည် အမှတ်တစ်ခုသာ မြင်ရမည် — သင် ယခုရှိသည့်နေရာ။ ဆက်တိုက် အပ်ဒိတ်မလုပ်ပါ။",
  "chat.location.send": "တည်နေရာ ပို့ပါ",
  "chat.location.finding": "သင့်တည်နေရာကို ရှာနေသည်…",
  "chat.location.no_location": "သင့်တည်နေရာကို မရရှိနိုင်ပါ",
  "chat.location.no_location_body":
    "တည်နေရာအသုံးပြုခွင့်ကို ခွင့်ပြုပြီး တည်နေရာဝန်ဆောင်မှုများ ဖွင့်ထားကြောင်း စစ်ဆေးပါ၊ ထို့နောက် ထပ်စမ်းကြည့်ပါ။",
  "chat.location.not_delivered": "သင့်တည်နေရာကို မပို့နိုင်ခဲ့ပါ",
  "chat.location.not_delivered_body":
    "တည်နေရာသည် လက်ရှိဖြစ်နေမှသာ ပို့ထိုက်သဖြင့် နောက်မှပို့ရန် တန်းစီမထားပါ။ {name} ကို ဆက်သွယ်နိုင်သည့်အခါ ထပ်စမ်းကြည့်ပါ။",
  "chat.location.direction.n": "မြောက်",
  "chat.location.direction.ne": "အရှေ့မြောက်",
  "chat.location.direction.e": "အရှေ့",
  "chat.location.direction.se": "အရှေ့တောင်",
  "chat.location.direction.s": "တောင်",
  "chat.location.direction.sw": "အနောက်တောင်",
  "chat.location.direction.w": "အနောက်",
  "chat.location.direction.nw": "အနောက်မြောက်",
  "chat.attach.send_anyway": "မည်သို့ပင်ဖြစ်စေ ပို့ပါ",
  "chat.attach.bitchat_too_big": "ဤအရာ မရောက်နိုင်ပါ",
  "chat.attach.bitchat_too_big_body":
    "{name} သည် bitchat ပေါ်တွင် ရှိပြီး ၎င်းက ဖိုင်ကြီးကို လမ်းတစ်ဝက်တွင် စွန့်ပစ်တတ်သည်။ 350 KiB ခန့်အောက်သည် စိတ်ချရသည်။ Airhop အဆက်အသွယ်ထံ ပို့လျှင် ထိုကန့်သတ်ချက် မရှိပါ။",
  "chat.attach.bitchat_unopenable":
    "၎င်းတို့ ဤအရာကို မဖွင့်နိုင်ဘဲ ဖြစ်နိုင်သည်",
  "chat.attach.bitchat_unopenable_body":
    "{name} သည် bitchat ပေါ်တွင် ရှိပြီး ၎င်းက ဓာတ်ပုံနှင့် အသံမှတ်စုများကို ပြသော်လည်း ကျန်အရာများကို မဖွင့်နိုင်သောဖိုင်အဖြစ် စာရင်းပြုစုသည်။ ရောက်ပါလိမ့်မည်၊ သို့သော် ကြည့်၍မရဘဲ ဖြစ်နိုင်သည်။",
  "chat.attach.file": "ဖိုင်တစ်ခု ပူးတွဲပါ",
  "chat.attach.unavailable": "ဤနေရာတွင် ပူးတွဲဖိုင်များ မရနိုင်ပါ",
  "chat.attach.not_sent": "ပူးတွဲဖိုင် မပို့ခဲ့ပါ",
  "chat.attach.read_failed":
    "ထိုဖိုင်ကို ဖတ်ရာတွင် တစ်ခုခု မှားယွင်းသွားသည်။ အခြားတစ်ခု စမ်းကြည့်ပါ။",
  "chat.attach.caption": "စာတန်း ထည့်ပါ…",
  "chat.attach.send": "ပူးတွဲဖိုင် ပို့ပါ",
  "chat.attach.generic": "ပူးတွဲဖိုင်",
  "chat.media.view_full": "ဓာတ်ပုံကို ဖန်သားပြင်အပြည့် ကြည့်ပါ",
  "chat.media.gone_photo": "ဓာတ်ပုံသည် ဤစက်ပေါ်တွင် မရှိပါ",
  "chat.media.gone_video": "ဗီဒီယိုသည် ဤစက်ပေါ်တွင် မရှိပါ",
  "chat.media.gone_voice": "အသံမှတ်စုသည် ဤစက်ပေါ်တွင် မရှိပါ",
  "chat.media.gone_file": "ဖိုင်သည် ဤစက်ပေါ်တွင် မရှိပါ",
  "chat.media.gone_note":
    "7 ရက်ကြာပြီးနောက် သို့မဟုတ် ကက်ရှ်ရှင်းလင်းသည့်အခါ ဖယ်ရှားခဲ့သည်",
  "chat.media.ask_resend": "ထပ်တောင်းပါ",
  "chat.media.resend_draft": "ထို {kind} ကို ထပ်ပို့ပေးနိုင်မလား?",
  "chat.media.kind_photo": "ဓာတ်ပုံ",
  "chat.media.kind_video": "ဗီဒီယို",
  "chat.media.kind_voice": "အသံမှတ်စု",
  "chat.media.kind_file": "ဖိုင်",
  "chat.media.pause_voice": "အသံမှတ်စု ခဏရပ်ပါ",
  "chat.media.play_voice": "အသံမှတ်စု ဖွင့်ပါ",
  "chat.media.voice_position": "အသံမှတ်စု အနေအထား",
  "chat.media.voice_scrub": "ထိုနေရာသို့ ခုန်ရန် တန်းများပေါ်တွင် နှိပ်ပါ",
  "chat.media.image": "ရုပ်ပုံ",
  "chat.media.tap_load_photo": "ဓာတ်ပုံ ဖွင့်ရန် နှိပ်ပါ",
  "chat.media.open_document": "{name} ကို ဖွင့်ပါ",
  "chat.media.document": "စာရွက်စာတမ်း",
  "chat.media.tap_load_video": "ဗီဒီယို ဖွင့်ရန် နှိပ်ပါ",
  "chat.media.video": "ဗီဒီယို",
  "chat.media.photo": "ဓာတ်ပုံ",
  "chat.media.close_photo": "ဓာတ်ပုံ ပိတ်ပါ",
  "chat.media.save_photo": "ဓာတ်ပုံကို သင့်ဓာတ်ပုံများသို့ သိမ်းပါ",
  "chat.media.share_photo": "ဓာတ်ပုံ မျှဝေပါ",
  "chat.media.saved_videos": "သင့်ဗီဒီယိုများသို့ သိမ်းပြီးပါပြီ",
  "chat.media.saved_photos": "သင့်ဓာတ်ပုံများသို့ သိမ်းပြီးပါပြီ",
  "chat.media.not_saved": "မသိမ်းခဲ့ပါ",
  "chat.media.cant_open": "ဖိုင်ကို မဖွင့်နိုင်ပါ",
  "chat.media.no_app":
    "ဤစက်တွင် ဤဖိုင်ကို ဖွင့်ရန် သို့မဟုတ် မျှဝေရန် အက်ပ် မရှိပါ။",
  "chat.media.open_failed":
    "ဖိုင်ကို မဖွင့်နိုင်ခဲ့ပါ။ ကက်ရှ်မှ ရှင်းလင်းခံရနိုင်သည်။",
  "media.blocked.nostr_only":
    "ဤသူကို ထပ်ဆင့်လွှင့်စက်မှတစ်ဆင့်သာ သင်သိပါသည်။ စာသားသာ ရနိုင်သည်။ ဓာတ်ပုံ၊ ဖိုင်နှင့် အသံမှတ်စုများသည် ဘလူးတုသ် လိုအပ်သည်။",
  "media.blocked.private_channel":
    "ထုတ်လွှင့်ချက် ပူးတွဲဖိုင်ကို လက်မှတ်ထိုးသော်လည်း စာဝှက်မထားပါ။ ထို့ကြောင့် သီးသန့်ချန်နယ်သို့ ပို့လျှင် ၎င်းသည် ဖွင့်ဟနေမည်ဖြစ်ပြီး ဤနေရာရှိ စာသားကမူ စာဝှက်ထားဆဲ ဖြစ်ပါလိမ့်မည်။",
  "media.blocked.private_group":
    "ထုတ်လွှင့်ချက် ပူးတွဲဖိုင်ကို လက်မှတ်ထိုးသော်လည်း စာဝှက်မထားပါ။ ထို့ကြောင့် သီးသန့်အဖွဲ့သို့ ပို့လျှင် ၎င်းသည် ဖွင့်ဟနေမည်ဖြစ်ပြီး ဤနေရာရှိ စာသားကမူ စာဝှက်ထားဆဲ ဖြစ်ပါလိမ့်မည်။",
  "media.blocked.location_channel":
    "တည်နေရာချန်နယ်သည် အင်တာနက်မှတစ်ဆင့် လူများထံ ရောက်ရှိပြီး ဓာတ်ပုံ၊ ဖိုင်နှင့် အသံမှတ်စုများမှာ ဘလူးတုသ်မှ သွားလာသဖြင့် ဘယ်တော့မှ ရောက်မည်မဟုတ်ပါ။",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "ဤနေရာတွင် အသံမှတ်စုများ မရနိုင်ပါ",
  "chat.voice.hold_live": "တိုက်ရိုက်ပြောရန် ဖိထားပါ",
  "chat.voice.hold_record": "အသံမှတ်စု ဖမ်းရန် ဖိထားပါ",
  "chat.voice.cancel_recording": "အသံဖမ်းခြင်း ပယ်ဖျက်ပါ",
  "chat.voice.slide_cancel": "ပယ်ဖျက်ရန် ဆွဲပါ",
  "chat.voice.release_cancel": "ပယ်ဖျက်ရန် လွှတ်ပါ",
  "chat.voice.a11y_toggle":
    "စကားပြောခြင်း စတင်ရန် သို့မဟုတ် ရပ်ရန် နှစ်ချက်နှိပ်ပါ။",
  "chat.voice.limit_reached":
    "နှစ်မိနစ် ကန့်သတ်ချက် ရောက်ပါပြီ၊ ပို့ရန် လွှတ်ပါ",
  "chat.voice.limit_sent":
    "နှစ်မိနစ် ကန့်သတ်ချက်ရောက်၍ မှတ်စုကို ပို့လိုက်ပါပြီ",
  "chat.voice.stop_send": "အသံဖမ်းခြင်း ရပ်ပြီး ပို့ပါ",
  "chat.voice.lift_lock": "လက်လွှတ်၍ အသံဖမ်းရန် အပေါ်သို့ ဆွဲပါ",
  "chat.voice.live_speaking": "{name} စကားပြောနေသည်",
  "voice.unavailable": "တိုက်ရိုက်အသံ မရနိုင်ပါ",
  "voice.recording_stopped": "အသံဖမ်းခြင်း ရပ်သွားသည်",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "ကင်မရာ အသုံးပြုခွင့်",
  "chat.perm.camera_purpose": "ပို့ရန် ဓာတ်ပုံရိုက်ရန်",
  "chat.perm.photo_label": "ဓာတ်ပုံ အသုံးပြုခွင့်",
  "chat.perm.photo_purpose": "ပို့ရန် ဓာတ်ပုံ သို့မဟုတ် ဗီဒီယို ရွေးရန်",
  "chat.perm.photo_save_purpose": "ဤအရာကို သင့်ဓာတ်ပုံများသို့ သိမ်းရန်",
  "chat.perm.mic_label": "မိုက်ခရိုဖုန်း အသုံးပြုခွင့်",
  "chat.perm.mic_live_purpose": "အနီးအနားရှိသူများနှင့် စကားပြောရန်",
  "chat.perm.mic_note_purpose": "အသံမှတ်စု ဖမ်းရန်",
  "chat.perm.recording_stopped": "အသံဖမ်းခြင်း ရပ်သွားသည်",
  "chat.perm.record_failed":
    "အသံဖမ်းခြင်း မစတင်နိုင်ပါ။ မိုက်ခရိုဖုန်းခွင့်ပြုချက်များကို စစ်ဆေးပါ။",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "ရယူပြီး",
  "chat.ecash.reclaimed": "ပြန်ယူပြီး",
  "chat.ecash.claiming": "ရယူနေသည်…",
  "chat.ecash.claim": "ရယူပါ",
  "chat.ecash.claim_amount": "{amount} {unit} ရယူပါ",
  "chat.ecash.already_claimed": "ရယူပြီးဖြစ်သည်",
  "chat.ecash.already_claimed_body":
    "ဤတိုကင်ရှိ သက်သေတိုင်းသည် သင့်ပိုက်ဆံအိတ်တွင် ရှိပြီးဖြစ်၍ ဘာမျှ ထပ်မထည့်ပါ။",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "အတတ်နိုင်ဆုံး ပို့ဆောင်ရန် မက်ရှ်ထံ အပ်နှံထားသည်",
  "chat.info.queued_desc":
    "၎င်းတို့ထံ လမ်းကြောင်းရရှိသည်အထိ ဤဖုန်းပေါ်တွင် ထိန်းထားသည်",
  "chat.info.reclaimed": "ပြန်ယူပြီး",
  "chat.info.reclaimed_desc":
    "ဤငွေပေးချေမှုကို သင့်ပိုက်ဆံအိတ်သို့ ပြန်ယူထားသဖြင့် ပို့ဆောင်မည် မဟုတ်ပါ",
  "chat.info.about": "အကြောင်း",
  "chat.info.group_desc":
    "သီးသန့်အဖွဲ့တစ်ခု။ ဖန်တီးသူထည့်ထားသော အဖွဲ့ဝင်များသာ ဖတ်နိုင်ပြီး ဘလူးတုသ်ပေါ်တွင် ကျန်နေသည်။",
  "chat.info.teleported_desc":
    "ဤဂျီအိုဟက်ရှ်ဆဲလ်အတွက် အများသုံးတည်နေရာချန်နယ်။ ဆဲလ်အတွင်းရှိသူတိုင်းသည် Airhop ဖြစ်စေ bitchat ဖြစ်စေ အင်တာနက်မှတစ်ဆင့် မျှဝေသုံးသည်။ သင်သည် ကိုယ်တိုင်ရောက်နေသည် မဟုတ်ဘဲ အဝေးမှ ဖြစ်သည်။",
  "chat.info.custom_desc":
    "စိတ်ကြိုက်ချန်နယ်တစ်ခု။ အမည်သိသူတိုင်း မည်သည့် Airhop သို့မဟုတ် bitchat စက်မှမဆို ဝင်နိုင်သည်။",
  "chat.info.private_e2ee": "သီးသန့် · အစမှအဆုံး စာဝှက်ထားသည်",
  "chat.info.public_plain": "အများသုံး · စာမဝှက်ထားပါ",
  "chat.info.group_privacy":
    "ဤအဖွဲ့ကို အောက်တွင်ပြထားသော အဖွဲ့ဝင်များသာ ဖတ်နိုင်သည်။ မက်ဆေ့ဂျ်များသည် ဘလူးတုသ်ပေါ်တွင် ကျန်နေသဖြင့် အကွာအဝေးပြင်ပရှိအဖွဲ့ဝင်များသည် ပြန်ရောက်လာလျှင် ရရှိပါမည်။",
  "chat.info.teleport_privacy":
    "သင် အဝေးမှရောက်လာသောနေရာ။ ဤဆဲလ်အတွင်းရှိလူတိုင်းထံ အင်တာနက်မှတစ်ဆင့် ရောက်ပြီး ဘလူးတုသ်အကွာအဝေးအတွင်းရှိ မည်သူ့ထံမျှ မရောက်ပါ။",
  "chat.info.location_off_privacy":
    "တည်နေရာ ပိတ်ထားသဖြင့် ဤချန်နယ်သည် အနီးအနားရှိစက်များထံ ဘလူးတုသ်မှသာ ရောက်သည်။ ၎င်း၏ဧရိယာဆဲလ်ထံ အင်တာနက်မှရောက်ရန် တည်နေရာကို ဖွင့်ပါ။",
  "chat.info.invite_privacy":
    "လင့်ခ်ဖြင့် သင်ဖိတ်ကြားထားသူများသာ ဖတ်နိုင်သည်။ အခြားသူအားလုံးထံမှ ဖုံးကွယ်ထားပြီး အနီးအနားရှိလုပ်ဖော်ကိုင်ဖက်များထံမှပင် ဖြစ်သည်။",
  "chat.info.public_privacy":
    "ဝင်ရောက်သူတိုင်း မက်ဆေ့ဂျ်တိုင်းကို ဖတ်နိုင်သည်။ သီးသန့်စကားပြောအတွက် တိုက်ရိုက်မက်ဆေ့ဂျ်ကို သုံးပါ။ တိုက်ရိုက်မက်ဆေ့ဂျ်များသည် အစမှအဆုံး စာဝှက်ထားသည်။",
  "chat.info.remove_member": "အဖွဲ့ဝင် ဖယ်ရှားပါ",
  "chat.info.remove_member_body":
    "{name} ကို အဖွဲ့မှ ဖယ်မလား? အဖွဲ့သော့ကို လှည့်ပြောင်းသဖြင့် မက်ဆေ့ဂျ်အသစ်များကို ဖတ်နိုင်တော့မည် မဟုတ်ပါ။",
  "chat.info.message_member": "{name} ကို မက်ဆေ့ဂျ်ပို့ပါ",
  "chat.info.remove_member_a11y": "{name} ဖယ်ရှားပါ",
  "chat.info.no_addable":
    "ထည့်ရန် ဆက်သွယ်နိုင်သော လုပ်ဖော်ကိုင်ဖက် မရှိပါ။ အဖွဲ့ဝင်များ အနီးအနား ရှိရမည်။",
  "chat.info.add_count": "{count} ဦး ထည့်ပါ",
  "chat.info.teleported_tag": "{level}  ·  အဝေးမှ",
  "chat.info.active": "လှုပ်ရှားနေသည်",
  "chat.info.members": "အဖွဲ့ဝင်များ",
  "chat.info.bookmark": "ဤနေရာကို မှတ်သားပါ",
  "chat.info.remove_bookmark": "မှတ်သားချက် ဖယ်ပါ",
  "chat.info.default_notice":
    "မူလချန်နယ်များမှ ထွက်၍ မရပါ။ ၎င်းတို့သည် Airhop မက်ရှ်ပရိုတိုကော၏ အစိတ်အပိုင်း ဖြစ်သည်။",
  "chat.info.custom_channel": "စိတ်ကြိုက် ချန်နယ်",
  "chat.info.geohash": "ဂျီအိုဟက်ရှ်",
  "chat.info.copy_geohash": "ဂျီအိုဟက်ရှ် ကူးပါ",
  "chat.info.relays": "ထပ်ဆင့်လွှင့်စက်များ",
  "chat.info.show_relays":
    "ဤချန်နယ်ကို သယ်ဆောင်နေသော ထပ်ဆင့်လွှင့်စက်များကို ပြပါ",
  "chat.info.relay_custom": "စိတ်ကြိုက်",
  "chat.info.relays_none": "မရှိပါ။ ဤဆဲလ်သည် ယခုအချိန် ဘလူးတုသ်သာ ဖြစ်သည်။",
  "chat.info.search_members": "အဖွဲ့ဝင်များ ရှာပါ",
  "chat.info.search_members_placeholder": "အဖွဲ့ဝင်များ ရှာပါ…",
  "chat.info.teleported": "အဝေးမှ",
  "chat.info.creator": "ဖန်တီးသူ",
  "chat.info.no_matches": "ကိုက်ညီမှု မရှိပါ",
  "chat.info.no_one_here": "ဤနေရာတွင် မည်သူမျှ မရှိသေးပါ",
  "chat.info.add_members": "အဖွဲ့ဝင်များ ထည့်ပါ",
  "chat.info.add_selected": "ရွေးထားသော အဖွဲ့ဝင်များ ထည့်ပါ",
  "chat.info.add": "ထည့်ပါ",
  "chat.info.leave_group": "အဖွဲ့မှ ထွက်ပါ",
  "chat.info.leave_channel": "ချန်နယ်မှ ထွက်ပါ",
  "chat.info.leave": "ထွက်ပါ",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "{date} ကတည်းက စကားပြောနေသည်",
  "chat.contact.verified_since": "{date} ကတည်းက အတည်ပြုထားသည်",
  "chat.contact.anonymous": "အမည်မသိ",
  "chat.contact.anonymous_desc":
    "အတည်ပြုစရာ တည်မြဲအထောက်အထား မရှိသော ဂျီအိုဟက်ရှ်အမည်ဝှက်",
  "chat.contact.verified": "အတည်ပြုပြီး",
  "chat.contact.verified_desc": "၎င်းတို့၏ QR ကုဒ်ကို စကန်ဖတ်ခဲ့သည်",
  "chat.contact.verified_desc_compared":
    "၎င်းတို့နှင့် ကုဒ်များ နှိုင်းယှဉ်ခဲ့သည်",
  "chat.contact.not_verified": "အတည်မပြုရသေးပါ",
  "chat.contact.not_verified_desc":
    "တကယ်ပင် ၎င်းတို့ဖြစ်ကြောင်း အတည်ပြုရန် ကုဒ်ကို စကန်ဖတ်ပါ သို့မဟုတ် ဖုန်းခေါ်ဆိုစဉ် ကုဒ်တစ်ခုကို နှိုင်းယှဉ်ပါ",
  "chat.contact.e2ee": "အစမှအဆုံး စာဝှက်ထားသည်",
  "chat.contact.e2ee_nostr":
    "NIP-17 လက်ဆောင်ထုပ်ပိုးထားသဖြင့် ထပ်ဆင့်လွှင့်စက်များ မဖတ်နိုင်ပါ",
  "chat.contact.e2ee_mesh":
    "Noise XX၊ Airhop စက်များအကြားတွင် Double Ratchet ပါ ထပ်ဆောင်းထားသည်",
  "chat.contact.copy_nostr": "Nostr အများသုံးသော့ ကူးပါ",
  "chat.contact.nostr_key": "Nostr အများသုံးသော့",
  "chat.contact.cell_key_note":
    "ဤသော့သည် သင်တို့ တွေ့ဆုံခဲ့သောဧရိယာနှင့် သက်ဆိုင်သည်။ တစ်ဦးဦး နေရာရွှေ့လျှင် ပြောင်းသွားပြီး စကားပြောလည်း ထိုနှင့်အတူ ရပ်တန့်သွားမည်။ မည်သည့်နေရာမှမဆို ဆက်ပြောနိုင်ရန် အဆက်အသွယ်များ ဖလှယ်ပါ။",
  "chat.contact.peer_name": "လုပ်ဖော်ကိုင်ဖက် အမည်",
  "chat.contact.peer_id": "လုပ်ဖော်ကိုင်ဖက် ID",
  "chat.contact.rename": "အမည် ပြောင်းပါ",
  "chat.contact.rename_needs_contact":
    "သော့များကို သင်ကိုင်ထားသူများကိုသာ အမည်ပြောင်းနိုင်သည်။ အဆက်အသွယ်ကတ်များကို အရင်ဖလှယ်ပါ၊ ထို့နောက် ဤအရာသည် သင်တစ်ဦးတည်း မြင်ရသောအမည် ဖြစ်လာမည်။",
  "chat.contact.rename_needs_keys":
    "ဤအဆက်အသွယ်အတွက် သော့များ မရှိသေးပါ။ ၎င်းတို့ကို မက်ဆေ့ဂျ်ပို့ပါ သို့မဟုတ် ကုဒ်ကို စကန်ဖတ်ပါ၊ ထို့နောက် သင်တစ်ဦးတည်း မြင်ရသောအမည် ပေးနိုင်ပါမည်။",
  "chat.contact.renamed_by_you": "သင်ပေးထားသော အမည်",
  "chat.contact.copy_peer_id": "လုပ်ဖော်ကိုင်ဖက် ID ကူးပါ",
  "chat.contact.verify": "အဆက်အသွယ် အတည်ပြုပါ",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "အသိပေးချက်များ",
  "chat.notices.post_area": "ဤဧရိယာသို့ အသိပေးချက် တင်ပါ",
  "chat.notices.post_mesh": "မက်ရှ်သို့ အသိပေးချက် တင်ပါ",
  "chat.notices.mark_urgent": "အရေးပေါ်ဟု မှတ်သားပါ",
  "chat.notices.post": "အသိပေးချက် တင်ပါ",
  "chat.notices.post_short": "တင်ပါ",
  "chat.notices.delete": "အသိပေးချက် ဖျက်ပါ",
  "chat.notices.just_now": "ယခုလေးတင်",
  "chat.notices.fades_soon": "မကြာမီ မှိန်သွားမည်",
  "chat.notices.1_day": "1 ရက်",
  "chat.notices.3_days": "3 ရက်",
  "chat.notices.7_days": "7 ရက်",
  "chat.notices.fading": "မှိန်နေသည်",
  "chat.notices.fades_in_hours": "{count} နာရီအတွင်း မှိန်သွားမည်",
  "chat.notices.fades_in_days": "{count} ရက်အတွင်း မှိန်သွားမည်",
  "chat.notices.scope_geo": "ဂျီအို",
  "chat.notices.scope_mesh": "မက်ရှ်",
  "chat.notices.urgent_short": "အရေးပေါ်",
  "chat.notices.permanent_warning":
    "ဘယ်တော့မှ မမှိန်ပါ။ အများမြင်နိုင်ပြီး ဤဧရိယာနှင့် ချည်နှောင်ထားသဖြင့် ပြန်ယူ၍ မရပါ။",
  "chat.notices.none":
    "အသိပေးချက် မရှိသေးပါ။ အခြားသူများအတွက် ဤနေရာတွင် ကျန်နေစေရန် တစ်ခု တင်ပါ။",

  // ---- Chats: search results ----
  "chat.search.photos": "ဓာတ်ပုံများ",
  "chat.search.videos": "ဗီဒီယိုများ",
  "chat.search.audio": "အသံ",
  "chat.search.documents": "စာရွက်စာတမ်းများ",
  "chat.search.links": "လင့်ခ်များ",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "{filter} ဖြင့် စစ်ထုတ်ပါ",
  "chat.search.no_matches": "“{query}” နှင့် ကိုက်ညီသော {filter} မရှိပါ",
  "chat.search.no_media": "{filter} မရှိသေးပါ",
  "chat.search.result_a11y": "{chat}၊ {sender} ထံမှ {kind}",
  "chat.search.you": "သင်",
  "chat.search.section_chats": "စကားပြောများ",
  "chat.search.section_messages": "မက်ဆေ့ဂျ်များ",
  "chat.search.section_notices": "အသိပေးချက်များ",
  "chat.search.hint":
    "မက်ဆေ့ဂျ်များနှင့် စကားပြောများကို ရှာပါ၊ သို့မဟုတ် အပေါ်မှ စစ်ထုတ်မှုတစ်ခု ရွေးပါ။",
  "chat.search.no_results": "“{query}” အတွက် ရလဒ် မရှိပါ",
  "chat.search.open_chat": "{name} ကို ဖွင့်ပါ",
  "chat.search.message_a11y": "{chat}၊ {sender} ထံမှ မက်ဆေ့ဂျ် — {snippet}",
  "chat.search.notice_a11y": "{chat} ရှိ {author} ထံမှ အသိပေးချက် — {snippet}",
  "chat.search.urgent": "အရေးပေါ် ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "ဤစာရင်းတွင် {count} ခု ရှိသည်။ ရှင်းလင်းခြင်းက ၎င်းတို့ကို ဤနေရာမှသာ ဖယ်ရှားပြီး မက်ဆေ့ဂျ်များမှာ ၎င်းတို့၏စကားပြောများတွင် မဖတ်ရသေးဘဲ ကျန်နေမည်။ အားလုံးဖတ်ပြီးဟု မှတ်သားခြင်းက နှစ်ခုစလုံးကို ရှင်းပေးသည်။",
  "chat.notif.mark_all_read": "အားလုံး ဖတ်ပြီးဟု မှတ်သားပါ",
  "chat.notif.clear_list": "စာရင်း ရှင်းပါ",
  "chat.notif.clear_all_a11y": "အသိပေးချက် {count} ခုလုံး ရှင်းပါ",
  "chat.notif.title": "အသိပေးချက်များ",
  "chat.notif.clear_short": "ရှင်းပါ",
  "chat.notif.close": "အသိပေးချက်များ ပိတ်ပါ",
  "chat.notif.none": "အသိပေးချက် မရှိသေးပါ",
  "chat.notif.none_desc":
    "သင့်ချန်နယ်များနှင့် စကားပြောများမှ မက်ဆေ့ဂျ်များ၊ ဖော်ပြချက်များနှင့် အသိပေးချက်များသည် ဤနေရာတွင် ပေါ်လာပါမည်။",
  "chat.notif.new": "အသစ်",
  "chat.notif.notice_in": "{channel} ရှိ အသိပေးချက်",

  // ---- Chats: forward ----
  "chat.forward.title": "ထပ်ဆင့်ပို့ရန်…",
  "chat.forward.to": "{name} ထံ ထပ်ဆင့်ပို့ပါ",
  "chat.forward.cant_send_here": "ဤနေရာသို့ ထပ်ဆင့်မပို့နိုင်ပါ",
  "chat.forward.cant_send_to": "{name} ထံ ထပ်ဆင့်မပို့နိုင်ပါ",
  "chat.forward.channels": "ချန်နယ်များ",
  "chat.forward.groups": "အဖွဲ့များ",
  "chat.forward.locations": "တည်နေရာများ",
  "chat.forward.dms": "တိုက်ရိုက်မက်ဆေ့ဂျ်များ",
  "chat.forward.none": "အခြားစကားပြောများ မရှိသေးပါ",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "မက်ရှ်ကို စတင်နေသည်…",
  "mesh.banner.no_bluetooth": "ဤစက်တွင် ဘလူးတုသ် မရှိပါ · အင်တာနက်သာ",
  "mesh.banner.bluetooth_off": "ဘလူးတုသ် ပိတ်ထားသည် · မက်ရှ် မရနိုင်ပါ",
  "mesh.banner.permission_needed": "ဘလူးတုသ် ခွင့်ပြုချက် လိုအပ်သည်",
  "mesh.banner.blocked": "ဘလူးတုသ် ပိတ်ဆို့ထားသည် · ဆက်တင်များတွင် ခွင့်ပြုပါ",
  "mesh.banner.location_permission":
    "လုပ်ဖော်ကိုင်ဖက်များ ရှာရန် တည်နေရာ လိုအပ်သည်",
  "mesh.banner.advertising_unsupported":
    "ဤဖုန်းသည် အခြားသူများကို မြင်နိုင်သော်လည်း ကိုယ်တိုင် အတွေ့မခံနိုင်ပါ",
  "mesh.banner.location_off_android":
    "တည်နေရာ ပိတ်ထားသည် · Android သည် လုပ်ဖော်ကိုင်ဖက်ရှာရန် ၎င်းကို လိုအပ်သည်",
  "mesh.banner.paused": "မက်ရှ် ရပ်ထားသည် · သင် ဝေးနေသည်",
  "mesh.banner.location_off":
    "တည်နေရာ ပိတ်ထားသည် · တည်နေရာချန်နယ်များ မရနိုင်ပါ",
  "mesh.banner.battery_saver": "ဘက်ထရီချွေတာမှု · ရှာဖွေမှု လျော့နည်းသည်",
  "mesh.banner.wipe_incomplete":
    "ဖျက်ခြင်း မပြီးဆုံးပါ · အချက်အလက်အချို့ ကျန်နိုင်ပြီး ပြန်ဖွင့်လျှင် ထပ်ကြိုးစားပါမည်",
  "mesh.banner.wifi_off":
    "Wi-Fi ပိတ်ထားသည် · ဖိုင်ကြီးများ ပို့ရာတွင် နှေးပါမည်",
  "mesh.banner.clock_skew":
    "ဤဖုန်း၏ နာရီ မမှန်ပါ · ရက်စွဲနှင့် အချိန်ကို အလိုအလျောက်သို့ ပြောင်းပါ",
  "mesh.banner.internet_off": "အင်တာနက် ပိတ်ထားသည် · ဘလူးတုသ်သာ",
  "mesh.banner.relaying":
    "အနီးအနားတွင် လုပ်ဖော်ကိုင်ဖက် မရှိပါ · Nostr မှတစ်ဆင့် ထပ်ဆင့်ပို့နေသည်",
  "mesh.banner.tor": "Tor ဖွင့်ထားသည် · အင်တာနက်လမ်းကြောင်း ပြောင်းလဲပြီး",
  "mesh.banner.tor_starting": "Tor စတင်နေသည် · ချိတ်ဆက်နေသည်",
  "mesh.banner.tor_blocked": "Tor ချိတ်ဆက်၍ မရပါ · မက်ရှ် ဆက်အလုပ်လုပ်နေဆဲ",
  "mesh.banner.gateway":
    "အင်တာနက်ဝင်ပေါက် ဖွင့်ထားသည် · အနီးအနားရှိ လုပ်ဖော်ကိုင်ဖက်များအတွက် ထပ်ဆင့်ပို့နေသည်",
  "mesh.banner.bridge":
    "မက်ရှ်တံတား ဖွင့်ထားသည် · အများသုံးစကားပြော ချိတ်ဆက်ပြီး",
  "mesh.banner.background_limits":
    "{brand} သည် နောက်ခံတွင် မက်ရှ်ကို ရပ်တန့်နိုင်သည်",
  "mesh.banner.bridge_across":
    "မက်ရှ်တံတား ဖွင့်ထားသည် · တံတားတစ်ဖက်တွင် {count} ဦး",
  "mesh.banner.action.turn_on": "ဖွင့်ပါ",
  "mesh.banner.action.allow": "ခွင့်ပြုပါ",
  "mesh.banner.action.resume": "ဆက်လုပ်ပါ",
  "mesh.banner.action.fix": "ပြင်ပါ",
  "mesh.banner.hint.resume":
    "ဘလူးတုသ် ကြေညာခြင်းနှင့် ရှာဖွေခြင်းကို ပြန်ဖွင့်ပေးသည်",
  "mesh.banner.hint.enable_bluetooth":
    "ဘလူးတုသ်ဖွင့်ရန် Android ကို တောင်းဆိုသည်",
  "mesh.banner.hint.location_settings": "စနစ်၏ တည်နေရာဆက်တင်များကို ဖွင့်သည်",
  "mesh.banner.hint.app_settings":
    "စနစ်ဆက်တင်များတွင် Airhop ၏ ခွင့်ပြုချက်များကို ဖွင့်သည်",
  "mesh.banner.hint.battery_settings":
    "ဤဖုန်း၏ နောက်ခံလှုပ်ရှားမှုဆက်တင်များကို ဖွင့်သည်",
  "mesh.banner.dismiss": "ဖယ်ရှားပါ — {label}",
  "mesh.banner.hint.dismiss": "ဤမှတ်ချက်ကို အပြီးအပိုင် ဝှက်ထားသည်",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "အနီးအနားရှိ လုပ်ဖော်ကိုင်ဖက်များကို ရှာနေသည်…",
  "mesh.radar.starting": "မက်ရှ်ကို စတင်နေသည်…",
  "mesh.radar.no_bluetooth": "ဤစက်တွင် ဘလူးတုသ် မရှိပါ",
  "mesh.radar.bluetooth_off": "ဘလူးတုသ် ပိတ်ထားသည် · မရှာဖွေပါ",
  "mesh.radar.permission_needed": "ဘလူးတုသ် ခွင့်ပြုချက် လိုအပ်သည်",
  "mesh.radar.blocked": "ဘလူးတုသ် ပိတ်ဆို့ထားသည်",
  "mesh.radar.location_permission": "တည်နေရာ ခွင့်ပြုချက် လိုအပ်သည်",
  "mesh.radar.location_off": "တည်နေရာ ပိတ်ထားသည် · မရှာဖွေပါ",
  "mesh.radar.hint_rings":
    "အကွင်းများသည် အကွာအဝေးမဟုတ်ဘဲ BLE အချက်ပြအားကို ပြသည်",
  "mesh.radar.hint_checking": "ဘလူးတုသ်နှင့် ခွင့်ပြုချက်များကို စစ်ဆေးနေသည်",
  "mesh.radar.hint_internet":
    "မက်ဆေ့ဂျ်များသည် အင်တာနက်မှတစ်ဆင့် ဆက်လက်သွားလာနေဆဲဖြစ်သည်",
  "mesh.radar.hint_turn_on": "လုပ်ဖော်ကိုင်ဖက်များ ရှာရန် ဘလူးတုသ်ကို ဖွင့်ပါ",
  "mesh.radar.hint_allow": "လုပ်ဖော်ကိုင်ဖက်များ ရှာရန် ဘလူးတုသ်ကို ခွင့်ပြုပါ",
  "mesh.radar.hint_allow_settings":
    "လုပ်ဖော်ကိုင်ဖက်များ ရှာရန် ဆက်တင်များတွင် ဘလူးတုသ်ကို ခွင့်ပြုပါ",
  "mesh.radar.hint_location_permission":
    "Android 11 နှင့် အောက်ပိုင်းများသည် ဘလူးတုသ်ဖြင့် ရှာဖွေရန် တည်နေရာ လိုအပ်သည်",
  "mesh.radar.hint_android_location":
    "Android သည် ဘလူးတုသ်ရှာဖွေမှုရလဒ်များ ပြန်ပေးရန် တည်နေရာ ဖွင့်ထားရန် လိုအပ်သည်",
  "mesh.radar.signal_strong": "အားကောင်း",
  "mesh.radar.signal_medium": "အလယ်အလတ်",
  "mesh.radar.signal_weak": "အားနည်း",
  "mesh.radar.you_center": "သင်၊ မက်ရှ်၏ အလယ်တွင်",
  "mesh.radar.sonar_hint":
    "ဆိုနာလှည့်သံကို ဖွင့်ပေးသည်။ ရှာဖွေမှုမှာ အဆက်မပြတ် လုပ်နေပြီးဖြစ်သည်။",
  "mesh.radar.paused": "မက်ရှ် ရပ်ထားသည် · သင် ဝေးနေသည်",
  "mesh.radar.ring_hint":
    "အကွင်း၏နေရာသည် အကွာအဝေးမဟုတ်ဘဲ အချက်ပြအားကို ထင်ဟပ်သည်",
  "mesh.radar.set_online":
    "လုပ်ဖော်ကိုင်ဖက်များ ရှာရန် ပရိုဖိုင်တွင် သင့်အခြေအနေကို အွန်လိုင်းအဖြစ် ထားပါ",
  "mesh.radar.in_range": "အကွာအဝေးအတွင်း",
  "mesh.radar.recently_seen": "မကြာမီက တွေ့ခဲ့သည်",
  "mesh.radar.peer_hint":
    "ဤလုပ်ဖော်ကိုင်ဖက်ကို မက်ဆေ့ဂျ်ပို့ရန် သို့မဟုတ် ငွေပေးရန် ရွေးချယ်စရာများကို ဖွင့်သည်",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "ယခုလေးတင်",
  "mesh.peer.none": "အနီးအနားတွင် လုပ်ဖော်ကိုင်ဖက် မရှိပါ",
  "mesh.peer.none_desc":
    "ဘလူးတုသ်အကွာအဝေးအတွင်းရှိ အခြား Airhop သို့မဟုတ် bitchat စက်များ ဤနေရာတွင် ပေါ်လာပါမည်။",
  "mesh.peer.id_copied": "လုပ်ဖော်ကိုင်ဖက် ID ကူးပြီးပါပြီ",
  "mesh.peer.copy_id": "လုပ်ဖော်ကိုင်ဖက် ID ကူးပါ",
  "mesh.peer.their_name": "{name} ဟု ခေါ်သည်",
  "mesh.peer.in_range": "အကွာအဝေးအတွင်း",
  "mesh.peer.relay": "ထပ်ဆင့်လွှင့်ဆုံမှတ်",
  "mesh.peer.relay_body":
    "မက်ရှ်ကို ကျယ်ပြန့်စေရန် တစ်စုံတစ်ဦးက ဖွင့်ထားခဲ့သော ရေဒီယိုတစ်လုံးဖြစ်သည်။ ကိုယ်တိုင်မဖတ်နိုင်သော မက်ဆေ့ဂျ်များကို သယ်ဆောင်ပေးသည်။ ဤနေရာတွင် မက်ဆေ့ဂျ်ပို့စရာ လူမရှိပါ။",
  "mesh.peer.send_dm": "တိုက်ရိုက်မက်ဆေ့ဂျ် ပို့ပါ",
  "mesh.peer.message": "မက်ဆေ့ဂျ်",
  "mesh.peer.send_sats": "ecash ပို့ပါ",
  "mesh.peer.amount_placeholder": "ပမာဏ sats ဖြင့်",
  "mesh.peer.amount_first": "ecash ပို့ပါ၊ ပမာဏကို အရင်ထည့်ပါ",
  "mesh.peer.cancel_send": "ecash ပို့ခြင်းကို ပယ်ဖျက်ပါ",
  "mesh.peer.view_peer": "လုပ်ဖော်ကိုင်ဖက် {name} ကို ကြည့်ပါ",
  "mesh.peer.view_peer_online":
    "လုပ်ဖော်ကိုင်ဖက် {name} ကို ကြည့်ပါ၊ အွန်လိုင်း",
  "mesh.peer.last_seen": "လွန်ခဲ့သော {ago} က တွေ့ခဲ့သည်",
  "mesh.peer.send_amount": "{amount} sats ပို့ပါ",
  "mesh.peer.direct": "တိုက်ရိုက်ချိတ်ဆက်မှု",
  "mesh.peer.check_distance": "အကွာအဝေး စစ်ပါ",
  "mesh.peer.checking": "စစ်ဆေးနေသည်",
  "mesh.peer.no_reply": "အကြောင်းပြန်ခြင်း မရှိပါ",
  "mesh.peer.no_reply_hint":
    "ရွှေ့သွားနိုင်သည်၊ သို့မဟုတ် ၎င်းတို့၏အက်ပ်က အကြောင်းမပြန်နိုင်ပါ",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "ဒေသ",
  "mesh.level.province": "ပြည်နယ်",
  "mesh.level.city": "မြို့",
  "mesh.level.neighborhood": "ရပ်ကွက်",
  "mesh.level.block": "မြို့ပြအကွက်",
  "mesh.level.building": "အဆောက်အအုံ",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "သုံးစွဲနိုင်သည်",
  "wallet.balance.unit_hint": "ဆာတိုရှိနှင့် ဘစ်ကွိုင်အကြား ပြောင်းသည်",
  "wallet.balance.a11y": "လက်ကျန် {value} {unit}",
  "wallet.balance.locked":
    "ပိုက်ဆံအိတ်သိုလှောင်မှု သော့ခတ်ထားသည်။ ecash သက်သေများကို စက်၏သော့သိမ်းတွင် သော့ရှိသည့် စာဝှက်ဖိုင်တစ်ခုအတွင်း သိမ်းထားပြီး ထိုဖိုင်ကို မဖွင့်နိုင်ခဲ့ပါ။ သင့်စက်၏သော့ကို ဖွင့်ပြီး Airhop ကို ပြန်ဖွင့်ပါ။",
  "wallet.balance.tor_blocked":
    "Tor ဖွင့်ထားသဖြင့် မင့်တောင်းဆိုမှုများကို ပိတ်ဆို့ထားသည် — ၎င်းတို့သည် ပွင့်လင်းကွန်ရက်ပေါ်မှ ထွက်သွားပြီး သင့် IP ကို သင့်သက်သေများနှင့် ချိတ်ဆက်စေမည်။ မက်ရှ်ပေါ်တွင် ပို့ခြင်းနှင့် လက်ခံခြင်းမှာ ဆက်လုပ်နိုင်ဆဲဖြစ်သည်။ ဆက်တင်များ၊ လုံခြုံရေးအောက်တွင် မင့်အသွားအလာကို ခွင့်ပြုပါ။",
  "wallet.balance.unconfirmed_note": "{amount} ကို မင့်နှင့် အတည်မပြုရသေးပါ",
  "wallet.balance.reserved_note": "{amount} ကို ပို့နေဆဲငွေအတွက် သီးသန့်ထားသည်",
  "wallet.balance.other_mint_note":
    "{amount} သည် သီးခြားမင့်အကောင့်တွင် ရှိသည်",
  "wallet.balance.test_mint_note":
    "စမ်းသပ်မင့်မှ ကစားငွေ ပါဝင်သည်။ ဘစ်ကွိုင် မဟုတ်သလို ငွေအဖြစ် ထုတ်၍လည်း မရပါ။",
  "wallet.token": "တိုကင်",
  "wallet.action.send": "ecash တိုကင် ပို့ပါ",
  "wallet.action.send_disabled":
    "ecash တိုကင် ပို့ပါ၊ လက်ကျန်ဗလာဖြစ်နေချိန် မရနိုင်ပါ",
  "wallet.action.receive": "ecash တိုကင် လက်ခံပါ",
  "wallet.action.zap": "Nostr အဆက်အသွယ်တစ်ဦးကို zap ပို့ပါ",
  "wallet.action.zap_disabled":
    "Nostr အဆက်အသွယ်တစ်ဦးကို zap ပို့ပါ၊ လက်ကျန်ဗလာဖြစ်နေချိန် မရနိုင်ပါ",
  "wallet.action.add_mint": "Cashu မင့်တစ်ခု ထည့်ပါ",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "တိုကင်ကို မတည်ဆောက်နိုင်ပါ",
  "wallet.send.title": "ecash ပို့ပါ",
  "wallet.send.amount_in": "ပမာဏ {unit} ဖြင့်",
  "wallet.send.body":
    "သင့်တွင်ရှိပြီးသား သက်သေများမှ အော့ဖ်လိုင်းတွင် တည်ဆောက်ထားသည်။ တိုကင်ရောက်ကြောင်း အတည်မပြုမချင်း သင့်လက်ကျန်မှ အပြီးအပိုင် ထွက်သွားမည့်အရာ မရှိပါ။",
  "wallet.send.stale_fee_note":
    "အခကြေးငွေများကို နောက်ဆုံးစစ်ဆေးခဲ့သည်မှာ လွန်ခဲ့သော {days} ရက်က ဖြစ်သည်။ ဤမင့်က ထိုအချိန်မှစ၍ အခကြေးငွေတိုးထားပါက ပို့ခြင်းသည် အနည်းငယ် ပိုကုန်ကျနိုင်သည်။",
  "wallet.send.fee_note":
    "{spend} {unit} သည် သင့်လက်ကျန်မှ ထွက်သွားမည်၊ ပိုသော {fee} က ၎င်းတို့ ပေးရမည့် မင့်အခကြေးငွေကို ဖုံးအုပ်ပေးသည်",
  "wallet.send.qr_too_big":
    "ဤတိုကင်သည် အကြွေစေ့အလွန်များစွာ ခွဲထားသဖြင့် QR ကုဒ်တွင် မဆံ့ပါ။ ယင်းအစား မျှဝေပါ သို့မဟုတ် ကူးပါ၊ သို့မဟုတ် စုစည်းရန် မင့်တွင် ပြန်လည်စစ်ဆေးပါ။",
  "wallet.send.bearer_note":
    "ဤစာကြောင်းကို ကိုင်ထားသူတိုင်း ငွေပိုင်ရှင်ဖြစ်သည်။ သက်သေများကို သီးသန့်ထားသည်၊ သုံးလိုက်သည် မဟုတ်ပါ — မည်သူ့ထံမျှ မရောက်ခဲ့လျှင် စောင့်ဆိုင်းဆဲအောက်တွင် ပြန်ယူနိုင်သည်။",
  "wallet.send.qr_too_big_short":
    "ဤတိုကင်သည် အကြွေစေ့အလွန်များစွာ ခွဲထားသဖြင့် QR ကုဒ်တွင် မဆံ့ပါ။ ယင်းအစား မျှဝေပါ သို့မဟုတ် ကူးပါ။",
  "wallet.send.scan_note":
    "၎င်းတို့၏ ပိုက်ဆံအိတ်မှ ဤအရာကို စကန်ဖတ်ခိုင်းပါ။ ရောက်ပြီဟု မှတ်သားမချင်း ပြန်ယူနိုင်ဆဲဖြစ်သည်။",
  "wallet.send.mesh_note":
    "တိုကင်သည် မက်ရှ်ပေါ်တွင် စာဝှက်ထားသော တိုက်ရိုက်မက်ဆေ့ဂျ်အဖြစ် ထွက်သွားသည်။ အင်တာနက် မလိုပါ။",
  "wallet.send.no_peers_note":
    "အနီးအနားရှိစက်များ ရှာရန် မက်ရှ်တဘ်ကို ဖွင့်ပါ၊ သို့မဟုတ် တိုကင်ကို အခြားနည်းဖြင့် မျှဝေပါ။",
  "wallet.send.send_to": "{name} ထံ ပို့ပါ",
  "wallet.send.memo": "မှတ်စု (ရွေးချယ်နိုင်သည်၊ တိုကင်နှင့်အတူ သွားသည်)",
  "wallet.send.building": "တည်ဆောက်နေသည်…",
  "wallet.send.build": "တိုကင် တည်ဆောက်ပါ",
  "wallet.send.inexact_body":
    "သင့်သက်သေများသည် အော့ဖ်လိုင်းတွင် {amount} {unit} အတိအကျ မဖြစ်နိုင်ပါ။ တည်ဆောက်နိုင်သည့် အသေးဆုံးတိုကင်မှာ {spend} {unit} ဖြစ်ပြီး အော့ဖ်လိုင်းတွင် အကြွေပြန်အမ်းခြင်း မရှိပါ — ပိုသော {extra} {unit} သည် လက်ခံသူထံ ရောက်သွားမည်။\n\nအွန်လိုင်းဖြစ်စဉ် မင့်တွင် ပြန်လည်စစ်ဆေးခြင်းက သင့်သက်သေများကို ဤပမာဏအတိအကျ ဖြစ်စေမည့် အစိတ်အပိုင်းများအဖြစ် ခွဲပေးပါမည်။",
  "wallet.send.send_amount": "{amount} ပို့ပါ",
  "wallet.send.sent_to": "{amount} {unit} ကို {name} ထံ ပို့ပြီးပါပြီ",
  "wallet.send.sent_to_body":
    "{route} ၎င်းတို့ရရှိကြောင်း သင်အတည်မပြုမချင်း၊ သို့မဟုတ် သက်သေများ ရွေးနုတ်ပြီးကြောင်း မင့်က မပြောမချင်း စောင့်ဆိုင်းဆဲအောက်တွင် ပြန်ယူနိုင်ဆဲ ဖြစ်ပါမည်။",
  "wallet.send.copy_token": "တိုကင် ကူးပါ",
  "wallet.send.share_token": "တိုကင် မျှဝေပါ",
  "wallet.send.open_in_wallet": "ဤတိုကင်ကို အခြားပိုက်ဆံအိတ်တွင် ဖွင့်ပါ",
  "wallet.send.open_in_wallet_short": "ပိုက်ဆံအိတ်တွင် ဖွင့်ပါ",
  "wallet.send.to_peer": "အနီးအနားရှိ လုပ်ဖော်ကိုင်ဖက်ထံ တိုကင် ပို့ပါ",
  "wallet.send.to_peer_short": "လုပ်ဖော်ကိုင်ဖက်ထံ ပို့ပါ",
  "wallet.send.mark_delivered": "ရောက်ပြီဟု မှတ်သားပြီး ပြီးဆုံးပါ",
  "wallet.send.they_got_it": "၎င်းတို့ ရရှိပါပြီ",
  "wallet.send.keep_pending": "ဤပို့မှုကို စောင့်ဆိုင်းဆဲအဖြစ် ထားပါ",
  "wallet.send.decide_later": "နောက်မှ ဆုံးဖြတ်ပါ",
  "wallet.send.no_peers": "အကွာအဝေးအတွင်း လုပ်ဖော်ကိုင်ဖက် မရှိပါ",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "ဤသည်မှာ သင့်ကိုယ်ပိုင် ငွေပေးချေမှုဖြစ်သည်",
  "wallet.receive.own_payment_body":
    "ဤအကြွေစေ့များကို သင်မပြီးပြတ်သေးသော ပို့မှုတစ်ခုအတွက် သီးသန့်ထားဆဲဖြစ်၍ တောင်းဆိုစရာ မရှိပါ။ သင့်လက်ကျန်သို့ တိုက်ရိုက်ပြန်ထည့်ရန် ထိုငွေပေးချေမှုတွင် ပြန်ယူခြင်းကို သုံးပါ။",
  "wallet.receive.already_have": "သင့်ပိုက်ဆံအိတ်တွင် ရှိပြီးသား",
  "wallet.receive.already_have_body":
    "ဤတိုကင်ရှိ သက်သေတိုင်းကို ဤနေရာတွင် သိမ်းထားပြီးဖြစ်၍ ဘာမျှ ထပ်မထည့်ပါ။ လက်ကျန်များ မပြောင်းလဲပါ။",
  "wallet.receive.stored_unconfirmed":
    "{mint} မှ သိမ်းထားသော်လည်း မင့်နှင့် အတည်မပြုရသေးပါ ({reason})။",
  "wallet.receive.offline": "အော့ဖ်လိုင်း",
  "wallet.receive.redeemed_here":
    "{mint} တွင် ရွေးနုတ်ပြီးပါပြီ။ ဤသက်သေများသည် ယခု သင်တစ်ဦးတည်း၏ ဖြစ်သည် — ပေးပို့သူ၏ မိတ္တူ အလုပ်မလုပ်တော့ပါ။",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "{mint} တွင် ရွေးနုတ်ပြီးပါပြီ။ ယခု သက်သေပြနိုင်စွာ သင့်အရာဖြစ်သည် — ပေးပို့သူ၏ ဤတိုကင်မိတ္တူ အလုပ်မလုပ်တော့ပါ။",
  "wallet.receive.stored_pending":
    "{mint} မှ သိမ်းထားသော်လည်း မသုံးရသေးကြောင်း မင့်က မအတည်ပြုရသေးပါ{dleq}။ အွန်လိုင်းရောက်လျှင် ပိုက်ဆံအိတ်တဘ်မှ ပြန်လည်စစ်ဆေးပါ။",
  "wallet.receive.dleq_inline":
    " (၎င်း၏လက်မှတ်မှာမူ မှန်ကန်သဖြင့် တိုကင်သည် စစ်မှန်သည်)",
  "wallet.receive.dleq_ok": "မင့်၏လက်မှတ် မှန်ကန်သဖြင့် တိုကင်သည် စစ်မှန်သည်။",
  "wallet.receive.dleq_uncached":
    "မင့်၏သော့များကို ဤနေရာတွင် မသိမ်းထားသဖြင့် လက်မှတ်ကို အော့ဖ်လိုင်းတွင် မစစ်ဆေးနိုင်ခဲ့ပါ။",
  "wallet.receive.dleq_warning":
    "အွန်လိုင်းတွင် ပြန်လည်မစစ်ဆေးမချင်း ပေးပို့သူသည် ၎င်းကို အခြားနေရာတွင် သုံးပြီးဖြစ်နိုင်သည်။",
  "wallet.receive.failed": "လက်မခံနိုင်ပါ",
  "wallet.receive.title": "ecash လက်ခံပါ",
  "wallet.receive.body":
    "Cashu တိုကင်တစ်ခု ကူးထည့်ပါ။ အွန်လိုင်းဖြစ်လျှင် မင့်တွင် ချက်ချင်း ရွေးနုတ်ပါသည်။ အော့ဖ်လိုင်းဖြစ်လျှင် သိမ်းထားပြီး နောက်တစ်ကြိမ် ပြန်လည်စစ်ဆေးချိန်တွင် အတည်ပြုပါသည်။",
  "wallet.receive.scan": "ecash QR ကုဒ်တစ်ခု စကန်ဖတ်ပါ",
  "wallet.receive.scan_short": "QR စကန်ဖတ်ပါ",
  "wallet.receive.receiving": "လက်ခံနေသည်…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "{from}… ထံမှ Nutzap လက်ခံရရှိပြီး သင့်ပိုက်ဆံအိတ်ထဲသို့ ရွေးနုတ်ပြီးပါပြီ။",
  "wallet.zap.title": "Nostr အထောက်အထားတစ်ခုကို zap ပို့ပါ",
  "wallet.zap.not_npub": "npub မဟုတ်ပါ",
  "wallet.zap.bad_key": "သော့ မမှန်ပါ",
  "wallet.zap.invalid_pubkey": "မမှန်ကန်သော pubkey",
  "wallet.zap.invalid_pubkey_body":
    "npub1… သို့မဟုတ် စာလုံး 64 လုံးပါ hex Nostr pubkey ကို ထည့်ပါ။",
  "wallet.zap.sent": "Nutzap ပို့ပြီးပါပြီ",
  "wallet.zap.failed": "Zap မအောင်မြင်ပါ",
  "wallet.zap.body":
    "၎င်းတို့က NIP-61 nutzap အချက်အလက်ကို ထုတ်ဝေထားပါက ecash ကို ၎င်းတို့၏သော့ဖြင့် သော့ခတ်ထားသဖြင့် အခြားမည်သူမျှ မသုံးနိုင်ဘဲ ပြန်ယူ၍လည်း မရပါ။ မထုတ်ဝေထားပါက ယင်းအစား ပြန်ယူနိုင်သော တိုကင်အဖြစ် သွားပါမည်။ မည်သည့်အခြေအနေဖြစ်သည်ကို သင့်အား အသိပေးပါမည်။",
  "wallet.zap.contact": "{name} ကို zap ပို့ပါ",
  "wallet.zap.pubkey_placeholder": "npub1… သို့မဟုတ် စာလုံး 64 လုံး hex",
  "wallet.zap.sending": "ပို့နေသည်…",
  "wallet.nostr.copied_body":
    "ဤအရာကို တစ်စုံတစ်ဦးအား ပေးလိုက်ပါက ဘလူးတုသ်မလိုဘဲ Airhop သို့မဟုတ် အခြားမည်သည့် Nostr ပိုက်ဆံအိတ်မှမဆို သင့်ကို zap ပို့နိုင်ပါသည်။",
  "wallet.nostr.copy_key":
    "လူများက သင့်ကို zap ပို့နိုင်ရန် သင့် Nostr သော့ကို ကူးပါ",
  "wallet.nostr.your_key": "သင့် Nostr သော့",

  // ---- Wallet: mints ----
  "wallet.mint.added": "မင့် ထည့်ပြီးပါပြီ",
  "wallet.mint.add_failed": "မင့်ကို မထည့်နိုင်ပါ",
  "wallet.mint.added_named": "{name} ကို ထည့်ပြီးပါပြီ",
  "wallet.mint.added_body":
    "{mint} သည် {units} ကို ထုတ်ပေးသည်။ ၎င်း၏သော့များကို ဤစက်ပေါ်တွင် သိမ်းထားသဖြင့် ယခု အင်တာနက်မရှိလည်း ၎င်း၏တိုကင်များကို စစ်ဆေးနိုင်ပါပြီ။",
  "wallet.mint.remove_plain":
    "{mint} ကို သင့်ပိုက်ဆံအိတ်မှ ဖယ်မလား? သိမ်းထားသောသော့များလည်း ပါသွားမည်ဖြစ်၍ ၎င်း၏တိုကင်များကို အော့ဖ်လိုင်းတွင် မစစ်ဆေးနိုင်တော့ပါ။",
  "wallet.mint.title": "မင့်များ",
  "wallet.mint.none": "မင့် မရှိသေးပါ",
  "wallet.mint.none_desc":
    "မင့်သည် သင့် ecash ကို ထုတ်ပေးပြီး ရွေးနုတ်ပေးသည်။ Lightning ဖြင့် ငွေသွင်းရန် တစ်ခုထည့်ပါ၊ သို့မဟုတ် တိုကင်တစ်ခု လက်ခံလိုက်ရုံဖြင့် ၎င်း၏မင့်ကို သင့်အတွက် ထည့်ပေးပါမည်။",
  "wallet.mint.add": "မင့်တစ်ခု ထည့်ပါ",
  "wallet.mint.add_body":
    "မင့်သည် သင့် ecash ကို ထောက်ပံ့ထားသော Bitcoin ကို ကိုင်ထားသဖြင့် ထိုနေရာတွင် သိမ်းမည့်လက်ကျန်ကို အပ်နှံရန် ယုံကြည်ရသောတစ်ခုကို ရွေးပါ။ လိပ်စာကို မသိမ်းမီ စစ်ဆေးပါသည်။ မည်သူ့ကိုမျှ မယုံကြည်လိုပါက Nutshell ဖြင့် ကိုယ်ပိုင်တစ်ခု လည်ပတ်ပါ။",
  "wallet.mint.consolidate_body":
    "တိုကင်တစ်ခုသည် မင့်တစ်ခုတည်းကိုသာ အမြဲညွှန်းနိုင်သဖြင့် မင့်များစွာတွင် ခွဲထားသောလက်ကျန်သည် အကြီးဆုံးမင့်ကိုင်ထားသည်ထက် ပိုကြီးသောပမာဏကို မပေးချေနိုင်ပါ။ Airhop က ရွှေ့ပေးနိုင်သည် — အခြားမင့်တစ်ခုစီသည် သင်ရွေးထားသောမင့်ထုတ်ပေးသည့် Lightning ငွေတောင်းခံလွှာကို ပေးချေပါသည်။ လမ်းကြောင်းအခကြေးငွေ အနည်းငယ် ကုန်ကျပြီး အင်တာနက် လိုအပ်သည်။",
  "wallet.mint.add_short": "မင့် ထည့်ပါ",
  "wallet.mint.checking": "စစ်ဆေးနေသည်…",
  "wallet.mint.remove_with_balance": "လက်ကျန်ရှိသော မင့်ကို ဖယ်မလား?",
  "wallet.mint.remove": "မင့် ဖယ်ပါ",
  "wallet.mint.delete_anyway": "မည်သို့ပင်ဖြစ်စေ ဖျက်ပါ",
  "wallet.mint.consolidate": "လက်ကျန်အားလုံးကို မင့်တစ်ခုတည်းသို့ ရွှေ့ပါ",
  "wallet.mint.confirm_with": "{mint} နှင့် သက်သေများ အတည်ပြုပါ",
  "wallet.mint.remove_a11y": "{mint} ဖယ်ပါ",
  "wallet.mint.available_amount": "{amount} {unit} ရနိုင်သည်",
  "wallet.mint.split_across":
    "လက်ကျန်ကို မင့် {count} ခုတွင် ခွဲထားသည်။ တစ်ခုတည်းသို့ ရွှေ့ပါ။",
  "wallet.mint.move_everything_to": "အားလုံးကို {mint} သို့ ရွှေ့ပါ",
  "wallet.mint.consolidate_title": "မင့်တစ်ခုတည်းသို့ ရွှေ့ပါ",
  "wallet.mint.moving": "ရွှေ့နေသည်…",
  "wallet.mint.move": "ရွှေ့ပါ",
  "wallet.mint.moved": "ရွှေ့ပြီးပါပြီ",
  "wallet.mint.moved_body":
    "Lightning လမ်းကြောင်းအခကြေးငွေ {fees} {unit} ပေးပြီးနောက် ယခု {amount} {unit} သည် {mint} တွင် ရှိပါသည်။",
  "wallet.mint.nothing_moved": "ဘာမျှ မရွှေ့ခဲ့ပါ",
  "wallet.mint.destination": "· ဦးတည်ရာ",
  "wallet.mint.will_move": "· ရွှေ့ပါမည်",
  "wallet.mint.issued_by": "ထုတ်ပေးသူ",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Airhop ပိုက်ဆံအိတ် ငွေဖြည့်",
  "wallet.ln.invoice_failed": "ငွေတောင်းခံလွှာကို မဖန်တီးနိုင်ပါ",
  "wallet.ln.price_failed": "ဤငွေတောင်းခံလွှာ၏ တန်ဖိုးကို မတွက်နိုင်ပါ",
  "wallet.ln.paid": "ပေးချေပြီး",
  "wallet.ln.deposit_credited":
    "ငွေတောင်းခံလွှာ ပေးချေပြီး {mint} က {amount} {unit} ထုတ်ပေးပါပြီ။ ဤလက်ကျန်ကို အတည်ပြုပြီးဖြစ်၍ ချက်ချင်း အော့ဖ်လိုင်းတွင် သုံးနိုင်သည်။",
  "wallet.ln.withdrawn":
    "{paid} sats ကို Lightning မှတစ်ဆင့် ပေးချေပြီးပါပြီ။ မင့်က လမ်းကြောင်းအခကြေးငွေ {fee} sats ကောက်ခံခဲ့သည်။",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats ကို Lightning မှတစ်ဆင့် ပေးချေပြီးပါပြီ။ မင့်က လမ်းကြောင်းအခကြေးငွေ {fee} sats ကောက်ခံပြီး သီးသန့်ထားငွေမှ {change} sats ကို သင့်လက်ကျန်သို့ ပြန်ပေးခဲ့သည်။",
  "wallet.ln.payment_failed": "ငွေပေးချေမှု မအောင်မြင်ပါ",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Lightning sats ကို အော့ဖ်လိုင်းတွင် သုံးနိုင်သော ecash အဖြစ် ပြောင်းပါ၊ သို့မဟုတ် ecash ကို မည်သည့် Lightning ငွေတောင်းခံလွှာသို့မဆို ပြန်ထုတ်ပါ။ နှစ်မျိုးလုံး အင်တာနက်နှင့် မင့်တစ်ခု လိုအပ်သည်။",
  "wallet.ln.deposit_body":
    "မင့်က သင့်အား ငွေတောင်းခံလွှာတစ်ခု ပေးသည်။ မည်သည့် Lightning ပိုက်ဆံအိတ်မှမဆို ပေးချေလိုက်လျှင် sats သည် အော့ဖ်လိုင်းတွင် သုံးနိုင်သော ecash အဖြစ် ပြန်ရောက်လာမည်။",
  "wallet.ln.pay_invoice_for":
    "{amount} {unit} အတွက် ဤငွေတောင်းခံလွှာကို ပေးချေပါ။ ပိုက်ဆံအိတ်က ငွေပေးချေမှုကို စောင့်ကြည့်နေပြီး သင့် ecash ကို အလိုအလျောက် ထုတ်ပေးပါမည်။",
  "wallet.ln.expired_body":
    "ဤငွေတောင်းခံလွှာ သက်တမ်းကုန်သွားပါပြီ။ ပေးချေပြီးဖြစ်ပါက လက်ကျန်ကို အလိုအလျောက် ထည့်ပေးပါမည်။",
  "wallet.ln.waiting_expires":
    "ငွေပေးချေမှုကို စောင့်နေသည် · {countdown} အတွင်း သက်တမ်းကုန်မည်",
  "wallet.ln.withdraw_body":
    "bolt11 ငွေတောင်းခံလွှာကို ကူးထည့်လျှင် မင့်က သင့် ecash မှ ပေးချေပေးသည်။ လမ်းကြောင်းသီးသန့်ထားငွေကို အရင်ပြောပြပါမည်။ လမ်းကြောင်းက မသုံးလိုက်သမျှ သင့်လက်ကျန်သို့ ပြန်ရောက်လာမည်။",
  "wallet.ln.up_to": "{amount} {unit} အထိ",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "{amount} {unit} ပေးချေပါ",
  "wallet.ln.deposit": "Lightning မှတစ်ဆင့် sats သွင်းပါ",
  "wallet.ln.deposit_short": "သွင်းပါ",
  "wallet.ln.withdraw": "Lightning ငွေတောင်းခံလွှာသို့ ထုတ်ပါ",
  "wallet.ln.withdraw_short": "ထုတ်ပါ",
  "wallet.ln.deposit_title": "Lightning မှတစ်ဆင့် သွင်းပါ",
  "wallet.ln.amount_placeholder": "ပမာဏ sats ဖြင့်",
  "wallet.ln.requesting": "တောင်းဆိုနေသည်…",
  "wallet.ln.get_invoice": "ငွေတောင်းခံလွှာ ရယူပါ",
  "wallet.ln.copy_invoice": "ငွေတောင်းခံလွှာ ကူးပါ",
  "wallet.ln.open_wallet": "Lightning ပိုက်ဆံအိတ်တွင် ဖွင့်ပါ",
  "wallet.ln.open_wallet_short": "ပိုက်ဆံအိတ်တွင် ဖွင့်ပါ",
  "wallet.ln.waiting": "ငွေပေးချေမှုကို စောင့်နေသည်…",
  "wallet.ln.new_invoice": "ငွေတောင်းခံလွှာအသစ် ဖန်တီးပါ",
  "wallet.ln.new_invoice_short": "လွှာအသစ်",
  "wallet.ln.withdraw_title": "Lightning သို့ ထုတ်ပါ",
  "wallet.ln.scan_invoice": "Lightning ငွေတောင်းခံလွှာ QR ကုဒ် စကန်ဖတ်ပါ",
  "wallet.ln.paid_from": "ပေးချေရာ",
  "wallet.ln.invoice": "ငွေတောင်းခံလွှာ",
  "wallet.ln.routing_reserve": "လမ်းကြောင်း သီးသန့်ထားငွေ",
  "wallet.ln.reserved": "လက်ကျန်မှ သီးသန့်ထားသည်",
  "wallet.ln.paying": "ပေးချေနေသည်…",
  "wallet.ln.get_quote": "ခန့်မှန်းချက် ရယူပါ",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "အရန်သိမ်းခြင်း",
  "wallet.backup.setup_failed": "အရန်သိမ်းခြင်းကို မတည်ဆောက်နိုင်ပါ",
  "wallet.backup.on": "အရန်သိမ်းခြင်း ဖွင့်ထားသည်",
  "wallet.backup.on_body":
    "သင့်လက်ကျန်ကို ယခု ထိုစကားလုံး 12 လုံးမှ ပြန်တည်ဆောက်နိုင်ပါပြီ။\n\nအခြားသူတစ်ဦးက သင့်အား ပေးထားသည်များသည် မင့်တွင် ပြန်လည်မစစ်ဆေးမချင်း ဤစကားစုအပြင်ဘက်တွင် ကျန်နေပြီး ပြန်လည်ရယူခြင်းသည် သင့်မင့်စာရင်းကို လိုအပ်သဖြင့် စကားလုံးများနှင့်အတူ ချရေးထားပါ။",
  "wallet.backup.no_phrase": "သိမ်းထားသော စကားစု မရှိပါ",
  "wallet.backup.no_phrase_body":
    "ပြန်လည်ရယူရေးစကားစုကို စက်၏သော့သိမ်းမှ မဖတ်နိုင်ခဲ့ပါ။ စက်၏သော့ကို ဖွင့်ပြီး ထပ်စမ်းကြည့်ပါ။",
  "wallet.backup.replace_title": "သင့်လက်ရှိစကားစုကို အစားထိုးမလား?",
  "wallet.backup.replace_body":
    "သင့်တွင် ပြန်လည်ရယူရေးစကားစု ရှိပြီးသားဖြစ်သည်။ အခြားတစ်ခုကို ပြန်လည်ရယူခြင်းက ၎င်းကို အစားထိုးပါမည်။ စကားစုဟောင်းက လွှမ်းခြုံထားသော အကြွေစေ့များသည် ဤစက်ပေါ်တွင် သုံးနိုင်ဆဲဖြစ်သော်လည်း ပြန်လည်ရယူ၍ မရတော့ပါ။ ထို့ကြောင့် မဆက်လုပ်မီ စကားလုံးဟောင်းများကို ချရေးထားကြောင်း သေချာပါစေ။",
  "wallet.backup.replace": "အစားထိုးပါ",
  "wallet.backup.invalid_phrase": "ထိုစကားစု မမှန်ကန်ပါ",
  "wallet.backup.invalid_phrase_body":
    "စကားစုတွင် အတွင်းစစ်ဆေးရေးတန်ဖိုးပါဝင်ပြီး ဤတစ်ခုက မအောင်မြင်ပါ။ စာလုံးမှား၊ ကျန်ခဲ့သော သို့မဟုတ် နေရာလွဲနေသော စကားလုံးကို ရှာပါ။",
  "wallet.backup.not_bip39":
    "ဤအရာများသည် BIP-39 စကားလုံးများ မဟုတ်ပါ — {words}။ စာလုံးပေါင်းကို စစ်ဆေးပါ။",
  "wallet.backup.add_mint_first": "မင့်တစ်ခုကို အရင်ထည့်ပါ",
  "wallet.backup.add_mint_first_body":
    "ပြန်လည်ရယူခြင်းသည် မင့်တစ်ခုအား သင့်အတွက် မည်သည့်အကြွေစေ့များကို လက်မှတ်ထိုးပေးခဲ့သည်ဟု မေးခြင်းဖြင့် အလုပ်လုပ်သဖြင့် မည်သည့်မင့်ကို မေးရမည် သိရန် လိုအပ်သည်။ သင်သုံးခဲ့သောမင့်များကို ထည့်ပြီးမှ ပြန်လည်ရယူပါ။",
  "wallet.backup.restore_failed": "ပြန်လည်ရယူခြင်း မအောင်မြင်ပါ",
  "wallet.backup.phrase": "ပြန်လည်ရယူရေး စကားစု",
  "wallet.backup.state_unconfirmed":
    "အရန်သိမ်းခြင်း ဖွင့်ထားသော်လည်း အတည်မပြုရသေး",
  "wallet.backup.state_off": "အရန်သိမ်းခြင်း ပိတ်ထားသည်",
  "wallet.backup.badge_on": "ဖွင့်",
  "wallet.backup.badge_unconfirmed": "အတည်မပြုရသေး",
  "wallet.backup.badge_off": "ပိတ်",
  "wallet.backup.view": "ပြန်လည်ရယူရေးစကားစုကို ကြည့်ပါ",
  "wallet.backup.setup": "ပြန်လည်ရယူရေးစကားစု တည်ဆောက်ပါ",
  "wallet.backup.view_short": "စကားစု ကြည့်ပါ",
  "wallet.backup.setup_short": "တည်ဆောက်ပါ",
  "wallet.backup.restore": "ပြန်လည်ရယူရေးစကားစုမှ ပိုက်ဆံအိတ်ကို ပြန်ယူပါ",
  "wallet.backup.restore_short": "ပြန်ယူပါ",
  "wallet.backup.setup_title": "ပြန်လည်ရယူရေးစကားစု တည်ဆောက်ပါ",
  "wallet.backup.on_body_short":
    "သင့်လက်ကျန်ကို သင့်စကားလုံး 12 လုံးမှ စက်အသစ်တွင် ပြန်တည်ဆောက်နိုင်သည်။",
  "wallet.backup.unconfirmed_body":
    "ချရေးထားသောမိတ္တူရှိကြောင်း သင် ဘယ်တော့မှ အတည်မပြုခဲ့ပါ။ ယခုအချိန်တွင် စကားလုံးများသည် ဤဖုန်းပေါ်၌သာ ရှိနေပြီး အရန်သိမ်းခြင်းက ရှင်သန်ရမည့်အရာမှာ ထိုဖုန်းပျောက်ခြင်းပင် ဖြစ်သည်။ စကားစုကို ကြည့်ပြီး ချရေးပါ။",
  "wallet.backup.not_covered":
    "{amount} ကို မလွှမ်းခြုံရသေးပါ။ သင့်အား ပေးထားသောအကြွေစေ့များသည် ပေးပို့သူ၏ လျှို့ဝှက်ချက်များကို သယ်ဆောင်လာသဖြင့် လဲလှယ်ပြီးမှသာ သင့်စကားစုအောက်သို့ ရောက်လာသည်။ ၎င်းတို့ကို လုံခြုံစေရန် မင့်တစ်ခုကို ပြန်လည်စစ်ဆေးပါ။",
  "wallet.backup.off_body":
    "သင့် ecash သည် ဤဖုန်းပေါ်၌သာ ရှိသည်။ ပျောက်သွားလျှင် သင်အပါအဝင် မည်သူမျှ ငွေကို ပြန်မရနိုင်ပါ။ ပြန်လည်ရယူရေးစကားစုသည် သင့်လက်ကျန်ကို မည်သည့်နေရာတွင်မဆို ပြန်တည်ဆောက်နိုင်သော စကားလုံး 12 လုံး ဖြစ်သည်။",
  "wallet.backup.about_to_see":
    "စကားလုံး 12 လုံးကို မြင်တော့မည်။ ၎င်းတို့သည် ငွေပင် ဖြစ်သည်။",
  "wallet.backup.exact_order":
    "စကားလုံး 12 လုံး၊ ဤအစီအစဉ်အတိအကျဖြင့်။ ၎င်းတို့ကို ရရှိသူတိုင်း သင့်လက်ကျန်ကို ရရှိသည်။",
  "wallet.backup.verify_body":
    "မည်သူမျှ မချရေးထားသော စကားစုသည် စကားစုမရှိသည်ထက် ဆိုးသည်။ အဘယ်ကြောင့်ဆိုသော် မရှိသော ကယ်တင်ကွန်ရက်တစ်ခုလို ထင်ရသောကြောင့် ဖြစ်သည်။ အတည်ပြုရန် စကားလုံးနှစ်လုံး။",
  "wallet.backup.verify_mismatch":
    "ကိုက်ညီမှု မရှိပါ။ သင်ချရေးထားသောမိတ္တူကို စစ်ဆေးပါ။",
  "wallet.backup.restore_body":
    "စကားလုံး 12 လုံးကို ထည့်ပါ။ Airhop က သင့်အကြွေစေ့များကို ပြန်တွက်ချက်ပြီး မင့်တစ်ခုစီအား မည်သည့်အကြွေစေ့များကို လက်မှတ်ထိုးခဲ့သည်ဟု မေးသဖြင့် လက်ကျန်သည် မင့်သိမ်းထားသောမှတ်တမ်းများမှ ပြန်ရောက်လာသည်။",
  "wallet.backup.warn_secret":
    "ဤအရာများကို ဖတ်ရသူတိုင်း သင့်လက်ကျန်ကို ယူသွားနိုင်သည်။ ဖန်သားပြင်မဖမ်းပါနှင့်၊ ဤဖုန်းပေါ်တွင်လည်း မသိမ်းပါနှင့်။",
  "wallet.backup.warn_paper":
    "စက္ကူပေါ်တွင် ရေးပြီး လုံခြုံသောနေရာတွင် သိမ်းပါ။ ဖုန်းပျောက်သွားလျှင် Airhop က သင့်အား ပြန်မပြနိုင်တော့ပါ။",
  "wallet.backup.warn_scope":
    "ဤအရာများသည် သင့် ecash ကိုသာ ပြန်တည်ဆောက်ပေးသည်။ သင့်အထောက်အထား၊ စကားပြောများနှင့် အဆက်အသွယ်များကို မလွှမ်းခြုံပါ။",
  "wallet.backup.warn_mints":
    "ပြန်လည်ရယူခြင်းသည် မင့်တစ်ခုအား မည်သည့်အကြွေစေ့များ လက်မှတ်ထိုးခဲ့သည်ဟု မေးရသဖြင့် သင့်မင့်စာရင်းကို စကားလုံးများနှင့်အတူ ချရေးထားပါ။",
  "wallet.backup.preparing": "ပြင်ဆင်နေသည်…",
  "wallet.backup.show_phrase": "ကျွန်ုပ်၏ စကားစုကို ပြပါ",
  "wallet.backup.your_phrase": "သင့် ပြန်လည်ရယူရေးစကားစု",
  "wallet.backup.write_down": "ဤအရာများကို ချရေးပါ",
  "wallet.backup.copy_phrase": "ပြန်လည်ရယူရေးစကားစုကို ကလစ်ဘုတ်သို့ ကူးပါ",
  "wallet.backup.copy_clipboard": "ကလစ်ဘုတ်သို့ ကူးပါ",
  "wallet.backup.written_down": "ချရေးပြီးပါပြီ",
  "wallet.backup.check_copy": "သင့်မိတ္တူကို စစ်ဆေးပါ",
  "wallet.backup.confirm": "အတည်ပြုပါ",
  "wallet.backup.restore_title": "စကားစုမှ ပြန်ယူပါ",
  "wallet.backup.phrase_placeholder":
    "စကားလုံး 12 လုံး၊ နေရာလွတ်ဖြင့် ခြားထားသည်",
  "wallet.backup.no_mints_yet":
    "မင့်များ မထည့်ရသေးပါ။ ပြန်လည်ရယူခြင်းသည် သီးခြားမင့်တစ်ခုကို မေးရသဖြင့် သင်သုံးခဲ့သည်များကို အရင်ထည့်ပါ။",
  "wallet.backup.scanning": "ရှာဖွေနေသည်…",
  "wallet.backup.restore_progress": "{mint} · သော့အစုံ {total} ခုအနက် {step}",
  "wallet.backup.will_scan":
    "ရှာဖွေမည် — {mints}။ သင်မထည့်ထားသောမင့်ကို ဘယ်တော့မှ မမေးသဖြင့် ထိုနေရာရှိလက်ကျန်ကို မမြင်ရပါ။",
  "wallet.backup.word_n": "စကားလုံး {position}",
  "wallet.backup.unreachable_mints":
    "မဆက်သွယ်နိုင်ခဲ့ပါ — {mints}။ ထိုနေရာရှိ လက်ကျန်များ ရှိနေဆဲဖြစ်သည်။ ချိတ်ဆက်မှုပိုကောင်းသည့်အခါ ထပ်စမ်းကြည့်ပါ။",
  "wallet.backup.nothing_recovered":
    "ရှာဖွေခဲ့သောမင့်များမှ ဘာမျှ ပြန်မရခဲ့ပါ။",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "လက်ခံရရှိပြီဟု မှတ်သားမလား?",
  "wallet.delivered.body":
    "ဤသည်က {amount} {unit} ကို အပြီးအပိုင် လွှတ်ပေးလိုက်ပါမည်။ တကယ်တမ်း မရောက်ခဲ့ပါက ပြန်ယူနိုင်တော့မည် မဟုတ်ပါ။",
  "wallet.delivered.body_generic":
    "ဤသည်က သီးသန့်ထားသောပမာဏကို အပြီးအပိုင် လွှတ်ပေးလိုက်ပါမည်။ တကယ်တမ်း မရောက်ခဲ့ပါက ပြန်ယူနိုင်တော့မည် မဟုတ်ပါ။",
  "wallet.delivered.cancel": "မလုပ်သေးပါ",
  "wallet.delivered.confirm": "၎င်းတို့ ရရှိပါပြီ",
  "wallet.reclaim.title": "ဤတိုကင်ကို ပြန်ယူမလား?",
  "wallet.reclaim.body":
    "{amount} {unit} သည် သင့်လက်ကျန်သို့ ပြန်ရောက်လာမည်။ တိုကင်သည် မည်သူ့ထံမျှ မရောက်ခဲ့မှသာ ဤသို့လုပ်ပါ — စာကြောင်းကို ၎င်းတို့ရရှိထားပြီးဖြစ်ပါက မင့်တွင် အရင်ရွေးနုတ်သူက ငွေကို ရရှိမည်ဖြစ်ပြီး ထိုသူမှာ ၎င်းတို့ ဖြစ်နိုင်သည်။",
  "wallet.reclaim.keep": "စောင့်ဆိုင်းဆဲ ထားပါ",
  "wallet.reclaim.confirm": "ပြန်ယူပါ",
  "wallet.copied.token_body":
    "တိုကင်သည် သင့်ကလစ်ဘုတ်တွင် ရှိသည်။ ရောက်ပြီဟု မှတ်သားမချင်း ဤနေရာတွင် သီးသန့်ထားဆဲဖြစ်၍ ပထမကြိုးစားမှု မအောင်မြင်လျှင် ထပ်ကူးထည့်နိုင်သည်။",
  "wallet.copied.phrase_body":
    "စကားဝှက်စီမံခန့်ခွဲမှုတွင် ကူးထည့်ပြီး သင့်ကလစ်ဘုတ်ကို ရှင်းပါ။ အခြားအက်ပ်များက ကလစ်ဘုတ်ကို ဖတ်နိုင်ပြီး အချို့ဖွဲ့စည်းမှုများတွင် သင့်အခြားစက်များသို့ ထပ်တူညီစေပါသည်။",
  "wallet.refresh.failed": "ပြန်လည်စစ်ဆေးခြင်း မအောင်မြင်ပါ",
  "wallet.refresh.partly": "တစ်စိတ်တစ်ပိုင်း ပြန်လည်စစ်ဆေးပြီး",
  "wallet.refresh.done": "ပြန်လည်စစ်ဆေးပြီးပါပြီ",
  "wallet.refresh.unreachable":
    "{mints} ကို မဆက်သွယ်နိုင်ခဲ့ပါ။ ကျန်အားလုံးမှာ နောက်ဆုံးအခြေအနေဖြစ်သည်။",
  "wallet.refresh.swapped":
    "{amount} {unit} ကို အတည်ပြုပြီး သက်သေအသစ်များနှင့် လဲလှယ်ပြီးပါပြီ။",
  "wallet.refresh.secured":
    "ယခု {amount} {unit} ကို သင့်ပြန်လည်ရယူရေးစကားစုက လွှမ်းခြုံထားပါပြီ။",
  "wallet.refresh.all_confirmed":
    "ဤနေရာရှိ အားလုံးကို မင့်နှင့် အတည်ပြုပြီးဖြစ်ပါသည်။",
  "wallet.pending.title": "စောင့်ဆိုင်းဆဲ",
  "wallet.pending.reserved_desc":
    "တည်ဆောက်ပြီး သီးသန့်ထားသည်၊ ရောက်ရှိမှုကို အတည်မပြုရသေး။ နှစ်ကြိမ်မသုံးမိစေရန် သက်သေများကို သင့်လက်ကျန်မှ ခွဲထုတ်ထားသည်။",
  "wallet.pending.locked_desc":
    "လက်ခံသူ၏သော့ဖြင့် သော့ခတ်ပြီးဖြစ်၍ ၎င်းတို့သာလျှင် သုံးနိုင်သည်။ ၎င်းတို့ထံ မရောက်သေးရုံသာ ဖြစ်သည်။ ပြီးမြောက်စေရန် တိုကင်ကို မျှဝေပါ။",
  "wallet.pending.show_qr": "ဤတိုကင်ကို QR ကုဒ်အဖြစ် ပြပါ",
  "wallet.pending.copy_again": "တိုကင်ကို ထပ်ကူးပါ",
  "wallet.pending.share_again": "တိုကင်ကို ထပ်မျှဝေပါ",
  "wallet.pending.mark_delivered": "ဤတိုကင်ကို ရောက်ပြီဟု မှတ်သားပါ",
  "wallet.pending.delivered": "ရောက်ပြီ",
  "wallet.pending.reclaim_into": "ဤတိုကင်ကို သင့်လက်ကျန်သို့ ပြန်ယူပါ",
  "wallet.activity.title": "လှုပ်ရှားမှု",
  "wallet.activity.none": "ဘာမျှ မရှိသေးပါ",
  "wallet.activity.none_desc":
    "သင်ပို့ပြီး လက်ခံသော ငွေပေးချေမှုများသည် အသစ်ဆုံးမှစ၍ မင့်နှင့် အခကြေးငွေတစ်ခုစီနှင့်အတူ ဤနေရာတွင် ပေါ်လာပါမည်။",
  "wallet.activity.show_fewer": "ငွေပေးချေမှု နည်းနည်း ပြပါ",
  "wallet.activity.show_less": "နည်းနည်း ပြပါ",
  "wallet.activity.received_unconfirmed": "လက်ခံရရှိ၊ အတည်မပြုရသေး",
  "wallet.activity.received": "လက်ခံရရှိပြီး",
  "wallet.activity.receive_failed": "လက်ခံခြင်း မအောင်မြင်ပါ",
  "wallet.activity.reclaimed": "ပြန်ယူပြီး",
  "wallet.activity.send_failed": "ပို့ခြင်း မအောင်မြင်ပါ",
  "wallet.activity.sent": "ပို့ပြီး",
  "wallet.activity.status_pending": "စောင့်ဆိုင်းဆဲ",
  "wallet.activity.status_failed": "မအောင်မြင်ပါ",
  "wallet.activity.status_reclaimed": "ပြန်ယူပြီး",
  "wallet.activity.status_expired": "သက်တမ်းကုန်",
  "wallet.activity.ln_deposit": "Lightning ငွေသွင်း",
  "wallet.activity.ln_withdrawal": "Lightning ငွေထုတ်",
  "wallet.activity.nutzap_received": "Nutzap လက်ခံရရှိ",
  "wallet.activity.spent_removed": "သုံးပြီးသောသက်သေများ ဖယ်ရှားပြီး",
  "wallet.activity.refreshed": "သက်သေများ ပြန်လည်စစ်ဆေးပြီး",
  "wallet.activity.refreshing": "သက်သေများ ပြန်လည်စစ်ဆေးနေသည်",
  "wallet.activity.just_now": "ယခုလေးတင်",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "မက်ရှ် အော့ဖ်လိုင်း",
  "wallet.mesh_offline_body":
    "မက်ရှ်ဝန်ဆောင်မှု အလုပ်မလုပ်နေသဖြင့် တိုကင်ကို ပေးအပ်စရာ မရှိပါ။ စောင့်ဆိုင်းဆဲအောက်တွင် သီးသန့်ထားဆဲ ဖြစ်ပါမည်။",
  "wallet.xfer.route_mesh":
    "မက်ရှ်မှတစ်ဆင့် ၎င်းတို့၏စက်ထံ တိုက်ရိုက် ပေးအပ်ပြီးပါပြီ။",
  "wallet.xfer.route_nostr":
    "၎င်းတို့သည် ဘလူးတုသ်အကွာအဝေးပြင်ပတွင် ရှိနေသဖြင့် ယင်းအစား အင်တာနက်မှတစ်ဆင့် သွားခဲ့သည်။",
  "wallet.xfer.route_courier":
    "ယခုအချိန် ၎င်းတို့ထံ လမ်းကြောင်း မရှိပါ။ အခြားစက်များက သယ်ဆောင်သွားမည်ဖြစ်ပြီး တစ်ခုခုက ၎င်းတို့ထံရောက်လျှင် ပေးအပ်ပါမည်။",
  "wallet.xfer.route_queued":
    "၎င်းတို့ကို မဆက်သွယ်နိုင်သေးပါ။ တန်းစီထားပြီး ဆက်သွယ်နိုင်သည်နှင့် ချက်ချင်း ပို့ပါမည်။",
  "wallet.xfer.mesh_offline_body":
    "မက်ရှ်ဝန်ဆောင်မှု အလုပ်မလုပ်နေသဖြင့် တိုကင်ကို ပေးအပ်ရန် နည်းလမ်း မရှိပါ။ ဘာမျှ မနုတ်ယူထားပါ။",
  "wallet.xfer.could_not_send": "မပို့နိုင်ပါ",
  "wallet.xfer.inexact_body":
    "သင့်သက်သေများသည် အော့ဖ်လိုင်းတွင် {amount} {unit} အတိအကျ မဖြစ်နိုင်ပါ။ တည်ဆောက်နိုင်သည့် အသေးဆုံးတိုကင်မှာ {spend} {unit} ဖြစ်ပြီး ပိုသော {extra} {unit} သည် ပြန်ယူ၍မရဘဲ ၎င်းတို့ထံ ရောက်သွားမည်။\n\nအွန်လိုင်းဖြစ်စဉ် မင့်တွင် ပြန်လည်စစ်ဆေးခြင်းက သင့်သက်သေများကို ဤပမာဏအတိအကျ ဖြစ်စေမည့် အစိတ်အပိုင်းများအဖြစ် ခွဲပေးပါသည်။",
  "wallet.xfer.send_amount": "{amount} ပို့ပါ",
  "wallet.xfer.mesh_offline": "မက်ရှ် အော့ဖ်လိုင်း",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "၎င်းတို့၏သော့ဖြင့် သော့ခတ်ပြီး Nostr သို့ ထုတ်ဝေပြီးပါပြီ။ အွန်လိုင်းရှိသည်ဖြစ်စေ မရှိသည်ဖြစ်စေ ၎င်းတို့၏ ဖြစ်သည်။",
  "wallet.pay.rail_nutzap_dm":
    "၎င်းတို့၏သော့ဖြင့် သော့ခတ်ထားသည်။ ထပ်ဆင့်လွှင့်စက်က လက်မခံသဖြင့် ယင်းအစား မက်ဆေ့ဂျ်တစ်ခုအဖြစ် ၎င်းတို့ထံ သွားခဲ့သည်။",
  "wallet.pay.rail_nutzap_undelivered":
    "၎င်းတို့၏သော့ဖြင့် သော့ခတ်ထားသော်လည်း သယ်ဆောင်နိုင်သည့်အရာ မရှိသေးပါ။ တန်းစီထားပြီး တိုကင်မှာ စောင့်ဆိုင်းဆဲအောက်တွင် ရှိသည်။",
  "wallet.pay.final":
    "သော့ခတ်ထားသော ငွေပေးချေမှုများကို ပြန်ယူ၍ မရပါ — ယခုအခါ ဤအကြွေစေ့များကို ၎င်းတို့၏သော့သာလျှင် သုံးနိုင်တော့သည်။",
  "wallet.pay.reclaimable":
    "ရောက်ကြောင်း သင်အတည်မပြုမချင်း ပိုက်ဆံအိတ်တဘ်မှ ပြန်ယူနိုင်ဆဲ ဖြစ်ပါမည်။",
  "wallet.pay.why": "{reason} ဖြစ်သောကြောင့် ဤနည်းဖြင့် ပို့ခဲ့သည်။",
  "wallet.pay.sent_title": "{amount} {unit} ကို {name} ထံ",
  "wallet.pay.thread_receipt":
    "သင်သည် {amount} {unit} ကို ၎င်းတို့၏သော့ဖြင့် သော့ခတ်၍ ပို့ခဲ့သည်။",
  "wallet.pay.title": "ecash ပို့ပါ",
  "wallet.pay.to": "{name} ထံ",
  "wallet.pay.amount": "ပမာဏ sats ဖြင့်",
  "wallet.pay.memo": "မှတ်ချက် (ရွေးချယ်နိုင်သည်၊ အများမြင်နိုင်သည်)",
  "wallet.pay.send": "ပို့ပါ",
  "wallet.pay.sending": "ပို့နေသည်…",
  "wallet.pay.action": "ecash ပို့ပါ",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "ကင်မရာ အသုံးပြုခွင့်",
  "wallet.scan.camera_purpose": "ecash QR ကုဒ်တစ်ခု စကန်ဖတ်ရန်",
  "wallet.scan.photo_label": "ဓာတ်ပုံ အသုံးပြုခွင့်",
  "wallet.scan.photo_purpose": "ပုံတစ်ခုမှ ecash QR ကို ဖတ်ရန်",
  "wallet.scan.no_token": "ထိုပုံတွင် ecash တိုကင် မတွေ့ပါ။",
  "wallet.scan.no_invoice": "ထိုပုံတွင် Lightning ငွေတောင်းခံလွှာ မတွေ့ပါ။",
  "wallet.scan.unreadable": "ထိုပုံကို မဖတ်နိုင်ပါ။",
  "wallet.scan.camera_failed":
    "ကင်မရာကို စတင်၍ မရပါ။ အခြားကင်မရာအက်ပ်များကို ပိတ်ပြီး ထပ်စမ်းကြည့်ပါ။",
  "wallet.scan.close": "စကင်နာကို ပိတ်ပါ",
  "wallet.scan.on_device":
    "ဤစက်ပေါ်တွင်သာ ဖတ်သည်၊ ဘာမျှ မည်သည့်နေရာသို့မျှ မပို့ပါ။",
  "wallet.scan.aim_token": "ecash QR ကုဒ်ဆီ ချိန်ပါ။",
  "wallet.scan.aim_invoice": "Lightning ငွေတောင်းခံလွှာ QR ကုဒ်ဆီ ချိန်ပါ။",
  "wallet.scan.title_token": "ecash စကန်ဖတ်ပါ",
  "wallet.scan.title_invoice": "ငွေတောင်းခံလွှာ စကန်ဖတ်ပါ",
  "wallet.scan.desc_token":
    "အခြားပိုက်ဆံအိတ်မှ Cashu တိုကင်ကို ဖတ်ပါ။ Airhop သာမက မည်သည့် Cashu ပိုက်ဆံအိတ်နှင့်မဆို အလုပ်လုပ်သည်။",
  "wallet.scan.desc_invoice":
    "သင့်လက်ကျန်မှ ပေးချေရန် Lightning ငွေတောင်းခံလွှာကို ဖတ်ပါ။",
  "wallet.scan.use_camera_a11y": "ကင်မရာဖြင့် စကန်ဖတ်ပါ",
  "wallet.scan.use_camera": "ကင်မရာ သုံးပါ",
  "wallet.scan.pick_image_a11y": "သိမ်းထားသောပုံမှ QR ကုဒ်ကို ဖတ်ပါ",
  "wallet.scan.pick_image": "ဓာတ်ပုံများမှ ရွေးပါ",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "Cashu ဆိုသည်မှာ ဘာလဲ?",
  "wallet.explain.intro":
    "Cashu သည် Bitcoin အတွက် ecash ဖြစ်သည်။ တိုကင်ဆိုသည်မှာ ကိုင်ထားသူအတွက် ငွေတန်ဖိုးရှိသော စာကြောင်းတစ်ခုဖြစ်ပြီး မည်သူက ဘာသုံးသည်ကို မင့်မသိစေရန် မျက်စိပိတ်လက်မှတ်ထိုးထားသည်။ အကောင့်လည်း မလို၊ လော့ဂ်အင်လည်း မလိုပါ။",
  "wallet.explain.send": "ပို့ပါ",
  "wallet.explain.send_desc":
    "ပမာဏတစ်ခုကို ဘလူးတုသ်မှတစ်ဆင့် အနီးအနားရှိလုပ်ဖော်ကိုင်ဖက်ထံ ပေးအပ်နိုင်သော သို့မဟုတ် စာသားအဖြစ် မျှဝေနိုင်သော တိုကင်အဖြစ် ပြောင်းပေးသည်။ အင်တာနက်မလိုဘဲ အလုပ်လုပ်သည်။ ရောက်ကြောင်း အတည်မပြုမချင်း သက်သေများကို သီးသန့်ထားပါသည်။",
  "wallet.explain.receive": "လက်ခံပါ",
  "wallet.explain.receive_desc":
    "ထည့်ရန် တိုကင်တစ်ခု ကူးထည့်ပါ။ အွန်လိုင်းဖြစ်လျှင် မင့်တွင် ချက်ချင်း လဲလှယ်ပေးပြီး သက်သေပြနိုင်စွာ သင့်အရာ ဖြစ်စေသည်။ အော့ဖ်လိုင်းဖြစ်လျှင် သိမ်းထားပြီး ပြန်လည်မစစ်ဆေးမချင်း အတည်မပြုရသေးဟု မှတ်သားထားသည်။",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Nostr အထောက်အထားတစ်ခုကို ပေးချေသည်။ ၎င်းတို့က NIP-61 nutzap အချက်အလက်ကို ထုတ်ဝေထားပါက ecash ကို ၎င်းတို့သာ သုံးနိုင်စေရန် ၎င်းတို့၏သော့ဖြင့် သော့ခတ်ထားသည်။ မဟုတ်ပါက စာဝှက်ထားသော တိုက်ရိုက်မက်ဆေ့ဂျ်သို့ ပြန်ကျသည်။ အင်တာနက် လိုအပ်သည်။",
  "wallet.explain.add_mint": "မင့် ထည့်ပါ",
  "wallet.explain.add_mint_desc":
    "သင့် ecash ကို ထုတ်ပေးပြီး ရွေးနုတ်ပေးသော မင့်ကို သိမ်းထားပြီး ၎င်း၏တိုကင်များကို အော့ဖ်လိုင်းတွင် စစ်ဆေးနိုင်ရန် အများသုံးသော့များကိုပါ သိမ်းထားသည်။ ထိုနေရာတွင် သိမ်းမည့်လက်ကျန်ကို အပ်နှံရန် ယုံကြည်ရသောမင့်ကို ရွေးပါ။",
  "wallet.explain.phrase": "ပြန်လည်ရယူရေး စကားစု",
  "wallet.explain.phrase_desc":
    "သင့်အကြွေစေ့များကို ပိုက်ဆံအိတ်က အစပိုင်းတွင် ထုတ်ပေးသော စကားလုံး 12 လုံးမှ တွက်ချက်ထားသဖြင့် ဖုန်းအသစ်တစ်လုံးသည် သင့်မင့်များအား မည်သည့်အကြွေစေ့များ လက်မှတ်ထိုးခဲ့သည်ဟု မေးကာ လက်ကျန်ကို ပြန်တည်ဆောက်နိုင်သည်။ ၎င်းတို့ကို ကြည့်ပြီး ချမရေးမချင်း ဤဖုန်းပေါ်၌သာ ရှိနေပါသည်။",

  // ---- Wallet: failures ----
  "wallet.err.locked": "ပိုက်ဆံအိတ် သော့ခတ်ထားသည်",
  "wallet.err.mint_unreachable": "မင့်ကို မဆက်သွယ်နိုင်ပါ",
  "wallet.err.tor_blocked": "Tor ဖွင့်ထားစဉ် ပိတ်ဆို့ထားသည်",
  "wallet.err.insufficient": "လက်ကျန် မလုံလောက်ပါ",
  "wallet.err.exact_amount": "ထိုပမာဏအတိအကျ မပို့နိုင်ပါ",
  "wallet.err.no_mint": "မင့် မရှိပါ",
  "wallet.err.mint_unsupported": "မင့်က ထိုအရာကို မလုပ်နိုင်ပါ",
  "wallet.err.mint_refused": "မင့်က ငြင်းပယ်လိုက်သည်",
  "wallet.err.unreadable": "မဖတ်နိုင်သော တိုကင်",
  "wallet.err.rejected": "တိုကင်ကို ငြင်းပယ်လိုက်သည်",
  "wallet.err.already_spent": "သုံးပြီးဖြစ်သည်",
  "wallet.err.change_pending": "ပေးချေပြီး၊ အကြွေ စောင့်ဆိုင်းဆဲ",
  "wallet.svc.mint_unreachable": "မင့်ကို မဆက်သွယ်နိုင်ခဲ့ပါ။",
  "wallet.svc.tor_ios":
    "iOS ပေါ်တွင် မင့်တောင်းဆိုမှုများသည် Tor မှ မဖြတ်သန်းပါ။",
  "wallet.svc.tor_ios_body":
    "Arti သည် Nostr WebSocket များကိုသာ ဖုံးအုပ်ပေးသဖြင့် ဤတောင်းဆိုမှုသည် ပွင့်လင်းကွန်ရက်မှတစ်ဆင့် မင့်ထံရောက်ပြီး သင့် IP ကို ဤသက်သေများနှင့် ချိတ်ဆက်စေမည်။ ဆက်တင်များ > လုံခြုံရေးအောက်တွင် ခွင့်ပြုပါ၊ သို့မဟုတ် Tor ကို အရင်ပိတ်ပါ။ မက်ရှ်ပေါ်တွင် ecash ပို့ခြင်းနှင့် လက်ခံခြင်းမှာ ဆက်လုပ်နိုင်ဆဲဖြစ်သည်။",
  "wallet.svc.keys_uncached": "ဤမင့်၏သော့များကို ဤစက်ပေါ်တွင် မသိမ်းထားပါ။",
  "wallet.svc.keys_uncached_body":
    "၎င်းတို့ကို ရယူရန် အွန်လိုင်းဖြစ်စဉ် ပိုက်ဆံအိတ်ကို တစ်ကြိမ် ဖွင့်ပါ။",
  "wallet.svc.phrase_invalid": "ထိုပြန်လည်ရယူရေးစကားစု မမှန်ကန်ပါ။",
  "wallet.svc.phrase_invalid_body":
    "စာလုံးမှားနေသော သို့မဟုတ် ကျန်ခဲ့သော စကားလုံးကို ရှာပါ။ စကားစုတွင် အတွင်းစစ်ဆေးရေးတန်ဖိုးပါဝင်သဖြင့် စကားလုံးတစ်လုံးမှားရုံဖြင့် တစ်ခုလုံး မမှန်ကန်တော့ပါ။",
  "wallet.svc.need_mint": "အနည်းဆုံး မင့်တစ်ခုကို အရင်ထည့်ပါ။",
  "wallet.svc.need_mint_body":
    "ပြန်လည်ရယူခြင်းသည် မင့်တစ်ခုအား သင့်အတွက် မည်သည့်အကြွေစေ့များကို လက်မှတ်ထိုးပေးခဲ့သည်ဟု မေးခြင်းဖြင့် အလုပ်လုပ်သဖြင့် မည်သည့်မင့်ကို မေးရမည် သိရန် လိုအပ်သည်။",
  "wallet.svc.restored": "ပြန်လည်ရယူရေးစကားစုမှ ပြန်ယူပြီးပါပြီ",
  "wallet.svc.storage_locked": "ပိုက်ဆံအိတ်သိုလှောင်မှု သော့ခတ်ထားသည်။",
  "wallet.svc.storage_locked_body":
    "Airhop သည် ecash သက်သေများကို စက်၏သော့သိမ်းတွင် သော့ရှိသည့် စာဝှက်ဖိုင်တစ်ခုအတွင်း သိမ်းထားသည်။ စက်၏သော့ကို ဖွင့်ပြီး အက်ပ်ကို ပြန်ဖွင့်ပါ။",
  "wallet.svc.bad_url": "ထိုအရာသည် မှန်ကန်သောလိပ်စာ မဟုတ်ပါ။",
  "wallet.svc.needs_https": "မင့်လိပ်စာသည် https:// ဖြင့် စတင်ရမည်။",
  "wallet.svc.refuse_http":
    "သာမန် http ပေါ်တွင် မင့်ကို သုံးရန် ငြင်းပယ်ပါသည်။",
  "wallet.svc.refuse_http_body":
    "ကွန်ရက်လမ်းကြောင်းပေါ်ရှိ မည်သူမဆို သင့်သက်သေများကို ဖတ်နိုင် ပြောင်းလဲနိုင်သည်။ https:// မင့်တစ်ခုကို သုံးပါ။",
  "wallet.svc.mint_not_saved": "မင့်ကို မသိမ်းနိုင်ပါ။",
  "wallet.svc.unreadable_token": "ထိုအရာသည် ဖတ်နိုင်သော Cashu တိုကင် မဟုတ်ပါ။",
  "wallet.svc.unreadable_token_body":
    "တိုကင်များသည် cashuA သို့မဟုတ် cashuB ဖြင့် စတင်သည်။ ကူးယူစဉ် ဘာမျှ ဖြတ်တောက်မခံရကြောင်း စစ်ဆေးပါ။",
  "wallet.svc.wrong_mint":
    "ဤတိုကင်ကို ၎င်းညွှန်းထားသောမင့်က လက်မှတ်မထိုးထားပါ။",
  "wallet.svc.already_spent": "ဤသက်သေများကို သုံးပြီးဖြစ်သည်။",
  "wallet.svc.already_spent_body":
    "ဤတိုကင်ကို ပို့သူက အရင်ရွေးနုတ်လိုက်သည်၊ သို့မဟုတ် တူညီသောတိုကင်ကို အခြားသူတစ်ဦးထံ ပို့ခဲ့သည်။",
  "wallet.svc.receiving_offline": "အော့ဖ်လိုင်းတွင် လက်ခံနေသည်",
  "wallet.svc.amount_positive": "သုညထက်ကြီးသော ပမာဏကို ထည့်ပါ။",
  "wallet.svc.coins_raced":
    "ထိုအကြွေစေ့များကို အခြားငွေပေးချေမှုတစ်ခုက ခုနက သုံးလိုက်ပါပြီ။",
  "wallet.svc.coins_raced_body":
    "ဘာမျှ မနုတ်ယူပါ။ ထပ်စမ်းကြည့်ပါက ပိုက်ဆံအိတ်က အခြားအစုံတစ်ခုကို ရွေးပါလိမ့်မည်။",
  "wallet.svc.no_ecash": "ecash မရှိသေးပါ။",
  "wallet.svc.no_ecash_body":
    "မင့်တစ်ခုထည့်ပြီး Lightning ဖြင့် ငွေသွင်းပါ၊ သို့မဟုတ် တစ်စုံတစ်ဦးထံမှ တိုကင်တစ်ခု လက်ခံပါ။",
  "wallet.svc.split_across_mints": "သင့်လက်ကျန်ကို မင့်များစွာတွင် ခွဲထားသည်။",
  "wallet.svc.mint_says_spent":
    "ဤသက်သေများကို သုံးပြီးဖြစ်ကြောင်း မင့်က အစီရင်ခံသည်။",
  "wallet.svc.issue_against_invoice":
    "Lightning ငွေတောင်းခံလွှာအပေါ် အခြေခံ၍ ecash ထုတ်ပေးခြင်း",
  "wallet.svc.pay_invoice": "Lightning ငွေတောင်းခံလွှာ ပေးချေခြင်း",
  "wallet.svc.unknown_deposit": "အမည်မသိ ငွေသွင်းမှု။",
  "wallet.svc.invoice_expired_before":
    "ငွေတောင်းခံလွှာသည် မပေးချေမီ သက်တမ်းကုန်သွားသည်။",
  "wallet.svc.invoice_expired": "ထိုငွေတောင်းခံလွှာ သက်တမ်းကုန်သွားပါပြီ။",
  "wallet.svc.invoice_unpaid": "ငွေတောင်းခံလွှာကို မပေးချေရသေးပါ။",
  "wallet.svc.payment_unknown":
    "ငွေပေးချေမှုအခြေအနေ မသိရပါ။ နောက်တစ်ကြိမ် ပြန်လည်စစ်ဆေးချိန်တွင် ထပ်စစ်ပါမည်။",
  "wallet.svc.melt_change_pending": "သင့်ငွေတောင်းခံလွှာကို ပေးချေပြီးပါပြီ။",
  "wallet.svc.melt_change_pending_body":
    "မသုံးလိုက်သော လမ်းကြောင်းအခကြေးငွေကို မင့်က မပြန်ပေးရသေးပါ။ နောက်တစ်ကြိမ် ပြန်လည်စစ်ဆေးချိန်တွင် အလိုအလျောက် တောင်းယူပါမည်။ ထိုကာလအတွင်း ဘာမျှ ဆုံးရှုံးမည် မဟုတ်ပါ။",
  "wallet.svc.mint_did_not_pay":
    "မင့်က ဤငွေတောင်းခံလွှာကို မပေးချေခဲ့ပါ။ သင့်လက်ကျန် မပြောင်းလဲပါ။",
  "wallet.svc.not_an_invoice": "ထိုအရာသည် Lightning ငွေတောင်းခံလွှာ မဟုတ်ပါ။",
  "wallet.svc.not_an_invoice_body":
    "lnbc ဖြင့် စတင်သော bolt11 ငွေတောင်းခံလွှာကို ကူးထည့်ပါ။",
  "wallet.svc.insufficient_for_invoice":
    "ဤငွေတောင်းခံလွှာအတွက် လက်ကျန် မလုံလောက်ပါ။",
  "wallet.svc.coins_raced_invoice_body":
    "ဘာမျှ မနုတ်ယူဘဲ ငွေတောင်းခံလွှာကိုလည်း မပေးချေခဲ့ပါ။ ထပ်စမ်းကြည့်ပါ။",
  "wallet.svc.same_mint": "အခြားဦးတည်ရာမင့်တစ်ခုကို ရွေးပါ။",
  "wallet.svc.same_mint_body":
    "မူလနေရာနှင့် ဦးတည်ရာသည် တူညီသောမင့်ဖြစ်၍ ရွှေ့စရာ မရှိပါ။",
  "wallet.svc.quote_failed_retried":
    "ခန့်မှန်းချက် မအောင်မြင်၊ စုစည်းခြင်းကို ထပ်ကြိုးစားပြီး",
  "wallet.svc.amount_unfit_retried":
    "ပမာဏ မကိုက်ညီ၊ စုစည်းခြင်းကို ထပ်ကြိုးစားပြီး",
  "wallet.svc.cannot_size": "ဤလွှဲပြောင်းမှု၏ ပမာဏကို မသတ်မှတ်နိုင်ပါ။",
  "wallet.svc.insufficient_at_mint": "{mint} တွင် လက်ကျန် မလုံလောက်ပါ။",
  "wallet.svc.inexact_title":
    "သင့်သက်သေများသည် အော့ဖ်လိုင်းတွင် {amount} {unit} အတိအကျ မဖြစ်နိုင်ပါ။",
  "wallet.svc.inexact_detail":
    "ပို့နိုင်သည့် အသေးဆုံးတိုကင်မှာ {spend} {unit} ဖြစ်သည်။ အော့ဖ်လိုင်းတွင် အကြွေပြန်အမ်းခြင်း မရှိသဖြင့် ပိုသော {extra} {unit} သည် လက်ခံသူထံ ရောက်သွားမည်။",
  "wallet.svc.no_single_mint":
    "{amount} {unit} ကို ကိုင်ထားသော မင့်တစ်ခုတည်း မရှိပါ။ မတူညီသောမင့်များမှ ecash ကို တိုကင်တစ်ခုတည်းအဖြစ် ပေါင်း၍ မရပါ — မင့်တစ်ခုတည်းတွင် အရင်စုစည်းပါ၊ သို့မဟုတ် ပမာဏခွဲ၍ ပို့ပါ။",
  "wallet.svc.have_tried_send":
    "သင့်တွင် {total} {unit} ရှိပြီး {amount} ပို့ရန် ကြိုးစားခဲ့သည်။",
  "wallet.svc.invoice_needs":
    "ဤငွေတောင်းခံလွှာသည် လမ်းကြောင်းသီးသန့်ထားငွေအပါအဝင် {total} {unit} လိုအပ်ပြီး သင့်တွင် {balance} ရှိသည်။",
  "wallet.svc.nothing_to_move": "{mint} တွင် ရွှေ့စရာ {unit} မရှိပါ။",
  "wallet.svc.consolidate_memo": "{mint} မှ စုစည်းခြင်း",
  "wallet.svc.cannot_size_detail":
    "Lightning လမ်းကြောင်းအခကြေးငွေများပြီးနောက် {from} သည် {to} သို့ အသုံးဝင်သောပမာဏကို မရွှေ့နိုင်ပါ။ ယင်းအစား သီးခြားပမာဏငယ်တစ်ခုကို ရွှေ့ကြည့်ပါ။",
  "wallet.svc.mint_cannot": "{mint} သည် {action} မလုပ်နိုင်ပါ။",
  "wallet.svc.no_nut": "မင့်က NUT-{nut} ကို ထောက်ပံ့ကြောင်း မကြေညာပါ။",
  "wallet.svc.unknown_mint":
    "ထိုငွေပေးချေမှုသည် သင်မသုံးသောမင့်တစ်ခုကို ညွှန်းထားသည်။",
  "wallet.svc.unknown_mint_body":
    "ယုံကြည်ပါက ထိုမင့်ကို သင်ကိုယ်တိုင် အရင်ထည့်ပါ။ သင်မရွေးထားသောမင့်မှ ဘာမျှ မရွေးနုတ်ပါ။",
  "wallet.svc.no_relay": "ထပ်ဆင့်လွှင့်စက် ချိတ်ဆက်မှု မရှိပါ",
  "wallet.svc.no_shared_mint": "လက်ကျန်လုံလောက်သော မျှဝေမင့် မရှိပါ",
  "wallet.svc.no_nutzap_info":
    "လက်ခံသူက nutzap အချက်အလက်ကို မထုတ်ဝေထားပါ (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "၎င်းတို့၏သော့ဖြင့် သော့ခတ်ထားသော်လည်း မရောက်သေးပါ။ ပြီးမြောက်စေရန် ဤငွေလွှဲမှု၏တိုကင်ကို မျှဝေပါ။",
  "wallet.svc.swap_lost":
    "မင့်သည် ဤလဲလှယ်မှုကို ဘယ်တော့မှ မပြီးဆုံးစေခဲ့သဖြင့် ၎င်းအတွက် ဘာမျှ မထုတ်ပေးခဲ့ပါ။",
  "wallet.svc.swap_unreadable":
    "ဤလဲလှယ်မှုကို ဤဗားရှင်း ပြန်မလုပ်ဆောင်နိုင်သော ပုံစံဖြင့် သိမ်းထားခဲ့သည်။",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "QR ဖြင့် အတည်ပြုပြီး",
  "contacts.qr.keys_unverified": "သော့များ ရရှိပြီး၊ အတည်မပြုရသေး",
  "contacts.qr.not_verified": "မအတည်ပြုရသေးပါ",
  "contacts.qr.message": "မက်ဆေ့ဂျ်",
  "contacts.qr.add": "အဆက်အသွယ် ထည့်ပါ",
  "contacts.qr.scan_title": "QR ကုဒ် စကန်ဖတ်ပါ",
  "contacts.qr.aim": "သင့်ကင်မရာကို ၎င်းတို့၏ QR ကုဒ်ဆီ ချိန်ပါ",
  "contacts.qr.add_desc": "မက်ရှ်ပေါ်တွင် အနီးအနား မရှိသူထံ ဆက်သွယ်ပါ။",
  "contacts.qr.peer_id_hint":
    "လုပ်ဖော်ကိုင်ဖက် ID သည် စာလုံး 16 လုံးဖြစ်သည်။ အဆက်အသွယ်ကုဒ်သည် airhop: ဖြင့် စတင်သည်။",
  "contacts.qr.or_scan": "သို့မဟုတ် ၎င်းတို့၏ QR ကို စကန်ဖတ်ပါ",
  "contacts.qr.trust_note":
    "သင့်ကင်မရာဖြင့် ကိုယ်တိုင်စကန်ဖတ်သော QR သာလျှင် ၎င်းတို့၏သော့ကို အတည်ပြုပေးသည်။ ကူးထည့်လိုက်သောကုဒ်သည် ၎င်းတို့၏သော့များကို ယူဆောင်လာသော်လည်း ၎င်းတို့ထံမှ လာကြောင်း သက်သေမပြနိုင်ပါ။",
  "contacts.qr.peer_id": "လုပ်ဖော်ကိုင်ဖက် ID သို့မဟုတ် အဆက်အသွယ်ကုဒ်",
  "contacts.qr.peer_id_placeholder": "ID သို့မဟုတ် အဆက်အသွယ်ကုဒ် ကူးထည့်ပါ",
  "contacts.qr.scan_camera_a11y": "ကင်မရာဖြင့် QR ကုဒ် စကန်ဖတ်ပါ",
  "contacts.qr.scan_camera_desc": "သင့်ကင်မရာကို သုံးပါ",
  "contacts.qr.upload_a11y": "ပြခန်းမှ QR ပုံကို တင်ပါ",
  "contacts.qr.upload": "ပြခန်းမှ တင်ပါ",
  "contacts.qr.upload_desc": "သိမ်းထားသော QR ပုံကို ရွေးပါ",
  "contacts.qr.scan_a11y": "QR ကုဒ် စကန်ဖတ်၍ အဆက်အသွယ် ထည့်ပါ",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "စာလုံး 16 လုံးပါ လုပ်ဖော်ကိုင်ဖက် ID၊ airhop://peer/… လင့်ခ်၊ သို့မဟုတ် အဆက်အသွယ်ကုဒ်ကို ကူးထည့်ပါ။",
  "contacts.scan.camera_label": "ကင်မရာ အသုံးပြုခွင့်",
  "contacts.scan.camera_purpose": "အဆက်အသွယ်တစ်ဦး၏ QR ကုဒ်ကို စကန်ဖတ်ရန်",
  "contacts.scan.camera_needed":
    "စကန်ဖတ်ရန် ကင်မရာအသုံးပြုခွင့် လိုအပ်သည်။ လုပ်ဖော်ကိုင်ဖက် ID ဖြင့်လည်း ထည့်နိုင်ပါသေးသည်။",
  "contacts.scan.camera_failed":
    "ကင်မရာကို စတင်၍ မရပါ။ အခြားကင်မရာအက်ပ်များကို ပိတ်ပြီး ထပ်စမ်းကြည့်ပါ။",
  "contacts.scan.photo_label": "ဓာတ်ပုံ အသုံးပြုခွင့်",
  "contacts.scan.photo_purpose": "သင်သိမ်းထားသော QR ကုဒ်ကို စကန်ဖတ်ရန်",
  "contacts.scan.photo_needed":
    "ပုံရွေးရန် ဓာတ်ပုံအသုံးပြုခွင့် လိုအပ်သည်။ လုပ်ဖော်ကိုင်ဖက် ID ဖြင့်လည်း ထည့်နိုင်ပါသေးသည်။",
  "contacts.scan.no_qr": "ထိုပုံတွင် Airhop QR ကုဒ် မတွေ့ပါ။",
  "contacts.scan.unreadable": "ထိုပုံမှ QR ကုဒ်ကို မဖတ်နိုင်ပါ။",
  "contacts.scan.bitchat_expired":
    "ထို bitchat ကုဒ် သက်တမ်းကုန်သွားပါပြီ။ ၎င်းတို့၏ QR ကို ပြန်ဖွင့်ပေးရန် တောင်းဆိုပါ။",
  "contacts.scan.tampered":
    "ဤ QR ကုဒ် မမှန်ကန်ပါ — ၎င်း၏ လုပ်ဖော်ကိုင်ဖက် ID သည် သော့များနှင့် မကိုက်ညီပါ။ ပြုပြင်ခံထားရနိုင်သည်။",
  "contacts.scan.already_added": "သင့်အဆက်အသွယ်များတွင် ရှိပြီးသား",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "ကင်မရာအသုံးပြုခွင့်ကို စောင့်နေသည်…",
  "contacts.verify.camera_off": "ကင်မရာ ပိတ်ထားသည်",
  "contacts.verify.open_settings": "ဆက်တင်များ ဖွင့်ပါ",
  "contacts.verify.verified": "အတည်ပြုပြီး",
  "contacts.verify.different": "မတူညီသော အဆက်အသွယ်",
  "contacts.verify.scan_again": "ထပ်စကန်ဖတ်ပါ",
  "contacts.verify.failed": "အတည်မပြုနိုင်ပါ",
  "contacts.verify.done": "ပြီးပါပြီ",
  "contacts.verify.title": "{name} ကို အတည်ပြုပါ",
  "contacts.verify.aim": "သင့်ကင်မရာကို ၎င်းတို့၏ QR ကုဒ်ဆီ ချိန်ပါ",
  "contacts.verify.camera_off_body":
    "QR ဖြင့် အတည်ပြုရန် ဆက်တင်များတွင် ကင်မရာအသုံးပြုခွင့်ကို ဖွင့်ပါ။",
  "contacts.verify.match_body":
    "{name} ၏ သော့ ကိုက်ညီပါသည်။ ဤအဆက်အသွယ်ကို ယုံကြည်နိုင်ပါသည်။",
  "contacts.verify.different_body":
    "ဤ QR သည် အခြားသူတစ်ဦး၏ ဖြစ်သည်။ {name} ကို ၎င်း၏ကိုယ်ပိုင်ကုဒ်ကို ပြရန် တောင်းဆိုပါ။",
  "contacts.verify.tampered_body":
    "ဤ QR သည် ပြုပြင်ခံထားရပုံရသည် — ၎င်း၏ ID သည် သော့နှင့် မကိုက်ညီပါ။",
  "contacts.verify.choose_title": "မည်သို့ စစ်ဆေးလိုပါသလဲ?",
  "contacts.verify.choose_body":
    "နှစ်မျိုးလုံးက ဤဖုန်းပေါ်ရှိ သော့များသည် {name} ၏ အမှန်တကယ် ဖြစ်ကြောင်း အတည်ပြုပေးသည်။",
  "contacts.verify.method_scan": "၎င်းတို့၏ကုဒ်ကို စကန်ဖတ်ပါ",
  "contacts.verify.method_scan_sub": "သူတို့ သင်နှင့်အတူ ရှိနေသည်",
  "contacts.verify.method_compare": "ကုဒ်တစ်ခုကို နှိုင်းယှဉ်ပါ",
  "contacts.verify.method_compare_sub": "ဖုန်းခေါ်ဆိုစဉ် အပြန်အလှန် ဖတ်ပြပါ",
  "contacts.verify.no_keys":
    "ဤအဆက်အသွယ်အတွက် သော့များ မရှိသေးပါ။ ၎င်းတို့ကို မက်ဆေ့ဂျ်ပို့ပါ၊ သို့မဟုတ် တွေ့ဆုံသည့်အခါ ၎င်းတို့၏ကုဒ်ကို စကန်ဖတ်ပါ။",
  "contacts.verify.compare_title": "ဤအရာများကို အပြန်အလှန် ဖတ်ပြပါ",
  "contacts.verify.compare_body":
    "{name} သည် တူညီသော စကားလုံးခြောက်လုံးကို မြင်ရသည်။ ကိုက်ညီပါက သော့များ အစစ်အမှန်ဖြစ်ကြောင်း နှစ်ဦးစလုံး သိရှိပါလိမ့်မည်။",
  "contacts.verify.codes_match": "ဤအရာများ ကိုက်ညီသည်",
  "contacts.verify.codes_differ": "မကိုက်ညီပါ",
  "contacts.verify.compared_body":
    "သင်နှင့် {name} တူညီသောကုဒ်ကို အတည်ပြုခဲ့ကြသည်။ ဤအဆက်အသွယ်ကို အတည်ပြုပြီးပါပြီ။",

  // ---- Settings: shared chrome ----
  "settings.back": "နောက်သို့ ပြန်သွားပါ",
  "settings.coming_soon": "မကြာမီ လာမည်",
  "settings.opens_externally": "{label}၊ အက်ပ်ပြင်ပတွင် ဖွင့်သည်",
  "settings.peer_id": "လုပ်ဖော်ကိုင်ဖက် ID",
  "settings.share_peer_id": "သင့်လုပ်ဖော်ကိုင်ဖက် ID ကို မျှဝေပါ",
  "settings.share_id_short": "ID မျှဝေပါ",
  "settings.peer_id_sheet.title": "သင့်လုပ်ဖော်ကိုင်ဖက် ID",
  "settings.peer_id_sheet.copy": "လုပ်ဖော်ကိုင်ဖက် ID ကူးပါ",
  "settings.peer_id_sheet.note":
    "ဤနည်းသည် နှစ်ဦးစလုံး ဘလူးတုသ်အကွာအဝေးအတွင်း ရှိမှသာ အလုပ်လုပ်သည်။ တစ်စုံတစ်ဦးက မည်သည့်နေရာမှမဆို မက်ဆေ့ဂျ်ပို့နိုင်စေရန် သင့် QR ကုဒ်ကို မျှဝေပါ။",
  "settings.search.placeholder": "ဆက်တင်များ ရှာပါ…",
  "settings.search.a11y": "ဆက်တင်များ ရှာပါ",
  "settings.search.close": "ရှာဖွေမှု ပိတ်ပါ",
  "settings.search.clear": "ရှာဖွေမှု ရှင်းပါ",
  "settings.search.hint": "ဆက်တင်တစ်ခုကို ဘယ်နေရာမှာရှိရှိ အမည်ဖြင့် ရှာပါ။",
  "settings.search.no_results": "“{query}” နှင့် ကိုက်ညီသော ဆက်တင် မရှိပါ",

  // ---- Settings: hub rows ----
  "settings.section.general": "အထွေထွေ",
  "settings.section.general_desc":
    "ရွေးချယ်နိုင်သော လုပ်ဆောင်ချက်များ၊ ပို့ခြင်းပြန်ရုပ်သိမ်းခြင်း၊ မီဒီယာ၊ ပြန်လည်သတ်မှတ်ခြင်း",
  "settings.section.privacy": "ကိုယ်ရေးလုံခြုံမှုနှင့် လုံခြုံရေး",
  "settings.section.privacy_desc":
    "ရှေ့ဆက်လျှို့ဝှက်မှု၊ လက်မှတ်ထိုးထားသော ပက်ကတ်များ၊ ပိတ်ဆို့ထားသော လုပ်ဖော်ကိုင်ဖက်များ",
  "settings.section.network": "ကွန်ရက်နှင့် ထပ်ဆင့်လွှင့်စက်များ",
  "settings.section.network_desc":
    "အင်တာနက်အရန်၊ nostr ထပ်ဆင့်လွှင့်စက်များ၊ bitchat ကိုက်ညီမှု",
  "settings.section.permissions": "ခွင့်ပြုချက်များ",
  "settings.section.permissions_desc":
    "ဘလူးတုသ်၊ တည်နေရာ၊ အသိပေးချက်များ၊ ကင်မရာ၊ မိုက်",
  "settings.section.storage": "သိုလှောင်မှုနှင့် အချက်အလက်",
  "settings.section.diagnostics": "ရောဂါရှာဖွေမှု",

  // ---- Settings: group headings ----
  "settings.group.transports": "သယ်ဆောင်ရေးလမ်းကြောင်းများ",
  "settings.group.internet": "အင်တာနက်",
  "settings.group.nearby": "အနီးအနား",
  "settings.group.sync": "ထပ်တူညီစေခြင်း",
  "settings.group.features": "လုပ်ဆောင်ချက်များ",
  "settings.group.messages": "မက်ဆေ့ဂျ်များ",
  "settings.group.local": "စက်တွင်း",
  "settings.group.media": "မီဒီယာ",
  "settings.group.reset": "ပြန်လည်သတ်မှတ်ခြင်း",
  "settings.group.always_on": "အမြဲဖွင့်ထား",
  "settings.group.notifications": "အသိပေးချက်များ",
  "settings.group.blocked": "ပိတ်ဆို့ထားသည်",
  "settings.group.theme": "အပြင်အဆင်",
  "settings.group.font": "ဖောင့်",
  "settings.group.language": "ဘာသာစကား",
  "settings.section.diagnostics_desc":
    "ချိတ်ဆက်မှုအခြေအနေနှင့် အနီးအနားရှိစက်များ",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "ဘလူးတုသ် ချိတ်ဆက်မှုများ",
  "settings.diag.ble_links_desc": "ဤဖုန်း တိုက်ရိုက်ချိတ်ဆက်ထားသော စက်များ",
  "settings.diag.lan": "စက်တွင်းကွန်ရက်",
  "settings.diag.lan_desc": "တူညီသော Wi-Fi ကွန်ရက်ရှိ ဖုန်းများ",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "ရောက်တာ မလိုဘဲ ဖုန်းမှဖုန်းသို့",
  "settings.diag.wifi_active": "အလုပ်လုပ်နေသည်",
  "settings.diag.wifi_unsupported": "ဤစက်တွင် မထောက်ပံ့ပါ",
  "settings.diag.wifi_permission": "ခွင့်ပြုချက်တစ်ခုကြောင့် ပိတ်ဆို့ထားသည်",
  "settings.diag.wifi_unavailable": "ယခုအချိန် မရနိုင်ပါ",
  "settings.diag.wifi_unpaired": "တွဲထားမှု မရှိပါ",
  "settings.diag.wifi_unknown": "ရေဒီယိုကို စောင့်နေသည်",
  "settings.diag.relays": "Nostr ထပ်ဆင့်လွှင့်စက်များ",
  "settings.diag.relays_desc":
    "တည်နေရာချန်နယ်များနှင့် အင်တာနက်ဆက်သွယ်မှုအတွက် အသုံးပြုသည်",
  "settings.diag.connected": "ချိတ်ဆက်ထားသည်",
  "settings.diag.disconnected": "မချိတ်ဆက်ထားပါ",
  "settings.diag.peer_direct": "တိုက်ရိုက်ချိတ်ဆက်မှု",
  "settings.diag.peer_relayed": "အခြားစက်မှတစ်ဆင့် ကြားရသည်",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "အချက်ပြဖတ်ချက် မရှိပါ",
  "settings.diag.no_peers": "အကွာအဝေးအတွင်း မည်သူမျှ မရှိပါ",
  "settings.diag.no_peers_desc": "ရေဒီယိုချိတ်ဆက်မှု {links} ခု ဖွင့်ထားသည်",
  "settings.diag.gcs_size": "စစ်ထုတ်ကိရိယာ အရွယ်အစား",
  "settings.diag.gcs_size_desc":
    "လေထဲသို့ ထုတ်လွှင့်ခဲ့သော အကြီးဆုံး ထပ်တူညီစေမှုစစ်ထုတ်ကိရိယာ",
  "settings.diag.fpr": "မှားယွင်းသောအပြုသဘောနှုန်း",
  "settings.diag.fpr_desc":
    "ကျွန်ုပ်တို့တွင်မရှိသော ပက်ကတ်ရှိသည်ဟု စစ်ထုတ်ကိရိယာက အခိုက်အတန့်ဆိုသည့်နှုန်း",
  "settings.diag.bytes": "{n} ဘိုက်",
  "settings.diag.footnote":
    "ဤနေရာတွင် ဘာမျှ ပြောင်းလဲ၍ မရပါ။ Airhop သည် bitchat နှင့် ကိုက်ညီနေစေရန် ဤတန်ဖိုးများကို သတ်မှတ်ထားပါသည်။",
  "settings.section.storage_desc": "အသုံးပြုမှုနှင့် ကက်ရှ်",
  "settings.section.appearance": "အသွင်အပြင်",
  "settings.section.appearance_desc": "အပြင်အဆင်၊ ဖောင့်နှင့် ဘာသာစကား",
  "settings.section.help": "အကူအညီနှင့် အကြံပြုချက်",
  "settings.section.help_desc":
    "ဆက်သွယ်ပါ၊ ချွတ်ယွင်းချက်တင်ပြပါ၊ သို့မဟုတ် မေးလေ့ရှိသောမေးခွန်းများကို ဖတ်ပါ",
  "settings.section.support": "ပံ့ပိုးမှု",
  "settings.section.support_desc":
    "ဖွံ့ဖြိုးတိုးတက်မှု ဆက်လက်လုပ်ဆောင်နိုင်ရန် ကူညီပါ",
  "settings.section.about": "အကြောင်း",
  "settings.section.about_desc":
    "ဗားရှင်း၊ ပြောင်းလဲမှုမှတ်တမ်းနှင့် အရင်းအမြစ်",

  // ---- Settings: general ----
  "settings.general.undo": "ပို့ခြင်းကို ပြန်ရုပ်သိမ်းပါ",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "ပိုက်ဆံအိတ်",
  "settings.general.undo_seconds": "{count} စက္ကန့်",
  "settings.general.undo_a11y": "ပို့ခြင်းပြန်ရုပ်သိမ်းခြင်း — {value}",
  "settings.general.quality_a11y":
    "အပ်လုဒ်အရည်အသွေးကို {value} အဖြစ် သတ်မှတ်ပါ",
  "settings.general.undo_desc":
    "ပို့လိုက်သောမက်ဆေ့ဂျ်ကို ခဏထိန်းထားပေးသဖြင့် မထွက်သွားမီ ပြန်ရုပ်သိမ်းနိုင်သည်",
  "settings.general.undo_off_desc": "ချက်ချင်းပို့ပါ၊ ပြန်ရုပ်သိမ်း၍ မရပါ",
  "settings.general.undo_2": "2 စက္ကန့်",
  "settings.general.undo_2_desc": "ပြန်ရုပ်သိမ်းရန် အခွင့်အရေးတိုတစ်ခု",
  "settings.general.undo_10": "10 စက္ကန့်",
  "settings.general.undo_10_desc": "အရှည်ဆုံးအချိန်",
  "settings.general.quality": "အပ်လုဒ် အရည်အသွေး",
  "settings.general.quality_desc":
    "သင့်ကင်မရာ သို့မဟုတ် ပြခန်းမှ ပို့သောဓာတ်ပုံများအတွက် သက်ဆိုင်သည်။ မည်သို့ပင်ဖြစ်စေ ဓာတ်ပုံတိုင်းကို မက်ရှ်နှင့် ကိုက်ညီအောင် ချိန်ညှိပေးသည်။",
  "settings.general.quality_low": "နိမ့်",
  "settings.general.quality_low_desc":
    "အသေးဆုံးဓာတ်ပုံများ၊ အမြန်ဆုံးပို့နိုင်သည်",
  "settings.general.quality_medium": "အလယ်အလတ်",
  "settings.general.quality_medium_desc": "အသေးစိတ်နှင့် အမြန်နှုန်း မျှတမှု",
  "settings.general.quality_high": "မြင့်",
  "settings.general.quality_high_desc": "အသေးစိတ်ကို အများဆုံး ထိန်းသိမ်းသည်",
  "settings.general.feature_wallet_desc":
    "မက်ရှ်မှတစ်ဆင့် တစ်ဦးမှတစ်ဦးသို့ Cashu ecash ပို့ပါ",
  "settings.general.feature_wallet_a11y": "ပိုက်ဆံအိတ် (အမြဲဖွင့်ထား)",
  "settings.general.feature_ai_desc":
    "စက်ပေါ်တွင်သာ လုပ်ဆောင်သည့် သီးသန့်လက်ထောက်၊ ကွန်ရက်ခေါ်ဆိုမှု မရှိပါ",
  "settings.general.feature_feeds": "ဖိဒ်များ",
  "settings.general.feature_feeds_desc":
    "Bluesky နှင့် Mastodon ဖိဒ်များကို ဖတ်ပြီး ပို့စ်တင်ပါ",
  "settings.general.show_media": "မီဒီယာကို အလိုအလျောက် ပြပါ",
  "settings.general.show_media_desc":
    "ဓာတ်ပုံနှင့် ဗီဒီယိုများကို စကားပြောထဲတွင် ပြသည်၊ သို့မဟုတ် တစ်ချက်နှိပ်မှ ပေါ်စေသည်",
  "settings.general.reset": "ဆက်တင်များ ပြန်လည်သတ်မှတ်ပါ",
  "settings.general.media_retention": "မီဒီယာကို သိမ်းထားမည့်ကာလ",
  "settings.general.media_retention_desc":
    "ရွေးချယ်ထားသောအချိန်ကုန်ဆုံးပြီးနောက် ဓာတ်ပုံ၊ ဗီဒီယိုနှင့် အသံမှတ်စုများကို ဖျက်ပစ်ပါမည်",
  "settings.general.media_retention_sheet":
    "မီဒီယာကို ဤစက်ပေါ်တွင် မည်မျှကြာအောင် ထားမည်ကို ရွေးပါ။ ဖျက်ပြီးသောမီဒီယာကို ပြန်မရနိုင်ပါ။",
  "settings.general.retention_7_desc":
    "အခြေအရာ အနည်းဆုံး ကျန်ရစ်စေသည်။ ဖုန်းကိုယ်တိုင်က အန္တရာယ်ဖြစ်ပါက အကောင်းဆုံးဖြစ်သည်။",
  "settings.general.retention_14_desc":
    "လိုင်းလွတ်ရာမှ တစ်ပတ်နှစ်ပတ်ခန့် ကွာနေချိန်အတွက် အလယ်အလတ်ရွေးချယ်မှု။",
  "settings.general.retention_30_desc":
    "စကားပြောများကို အကြာဆုံး ဖတ်နိုင်စေပြီး နေရာလည်း အများဆုံး ယူပါသည်။",
  "settings.general.reset_desc":
    "သင့်အထောက်အထား၊ မက်ဆေ့ဂျ်များ၊ အဆက်အသွယ်များနှင့် ပိုက်ဆံအိတ်ကို မထိဘဲ ဦးစားပေးချက်တိုင်းကို မူလအတိုင်း ပြန်ထားပေးသည်",
  "settings.general.reset_title": "ဆက်တင်များ ပြန်လည်သတ်မှတ်မလား?",
  "settings.general.reset_body":
    "ဦးစားပေးချက်တိုင်း မူလအတိုင်း ပြန်ဖြစ်သွားမည် — အသွင်အပြင်၊ ပို့ခြင်းပြန်ရုပ်သိမ်းခြင်းနှင့် ချိတ်ဆက်မှု (အင်တာနက်၊ Tor၊ ဝင်ပေါက်၊ တံတား၊ ထပ်ဆင့်လွှင့်စက်များ)။ သင့်အထောက်အထား၊ မက်ဆေ့ဂျ်များ၊ အဆက်အသွယ်များနှင့် ပိုက်ဆံအိတ်ကို မထိပါ။",
  "settings.general.reset_confirm": "ပြန်လည်သတ်မှတ်ပါ",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "ရှေ့ဆက်လျှို့ဝှက်မှု",
  "settings.security.forward_secrecy_desc":
    "တိုက်ရိုက်မက်ဆေ့ဂျ်များအတွက် Double Ratchet ကို အမြဲဖွင့်ထားသည်",
  "settings.security.signed_packets": "လက်မှတ်ထိုးထားသော ပက်ကတ်များ",
  "settings.security.signed_packets_desc":
    "ပက်ကတ်တိုင်းကို Ed25519 ဖြင့် လက်မှတ်ထိုးထားသည်",
  "settings.security.hide_previews":
    "အသိပေးချက် အကြိုကြည့်ရှုမှုများကို ဖျောက်ပါ",
  "settings.security.hide_previews_desc":
    "လော့ခ်စခရင်သည် သော့မဖွင့်ဘဲ ပြသတတ်သဖြင့် ပေးပို့သူနှင့် မက်ဆေ့ဂျ်ကို ထိုနေရာမှ ဖယ်ထားသည်",
  "settings.security.no_blocked": "ပိတ်ဆို့ထားသော လုပ်ဖော်ကိုင်ဖက် မရှိပါ",
  "settings.security.no_blocked_desc":
    "ပိတ်ဆို့ထားသော လုပ်ဖော်ကိုင်ဖက်များသည် သင့်ကို မက်ဆေ့ဂျ်မပို့နိုင်သလို မက်ရှ်တဘ်တွင်လည်း မပေါ်ပါ",
  "settings.security.unblock_title": "ဤလုပ်ဖော်ကိုင်ဖက်၏ ပိတ်ဆို့မှုကို ဖြေပါ",
  "settings.security.unblock": "ပိတ်ဆို့မှု ဖြေပါ",
  "settings.security.unblock_peer": "{name} ၏ ပိတ်ဆို့မှုကို ဖြေပါ",
  "settings.security.unblock_body":
    "{name} သည် သင့်ကို ပြန်လည်မက်ဆေ့ဂျ်ပို့နိုင်မည်ဖြစ်ပြီး အနီးအနားရောက်လာလျှင် မက်ရှ်တဘ်တွင် ပြန်ပေါ်လာပါမည်။",

  // ---- Settings: network and relays ----
  "settings.network.internet": "အင်တာနက်အရန်",
  "settings.network.internet_desc":
    "မက်ရှ်လုပ်ဖော်ကိုင်ဖက်များ အကွာအဝေးပြင်ပရောက်သွားလျှင် Nostr ထပ်ဆင့်လွှင့်စက်များဖြင့် ဆက်လုပ်ပါ",
  "settings.network.internet_off_title": "အင်တာနက်ကို ပိတ်မလား?",
  "settings.network.internet_off_body":
    "Airhop သည် ဘလူးတုသ်ဖြင့်သာ အလုပ်လုပ်ပါလိမ့်မည်။ မည်သည့် Nostr ထပ်ဆင့်လွှင့်စက်နှင့်မျှ ဆက်သွယ်ခြင်း ရပ်တန့်မည်ဖြစ်ပြီး Tor၊ အင်တာနက်ဝင်ပေါက်နှင့် မက်ရှ်တံတား အားလုံး ပိတ်သွားပါမည်။ အနီးအနားရှိ ဘလူးတုသ်စကားပြောမှာမူ ဆက်လက်အလုပ်လုပ်နေပါမည်။",
  "settings.network.turn_off": "ပိတ်ပါ",
  "settings.network.discovery": "ပထဝီထပ်ဆင့်လွှင့်စက် ရှာဖွေခြင်း",
  "settings.network.discovery_desc":
    "ဖြန့်ကျက်ထားသော ထပ်ဆင့်လွှင့်စက် 300 ကျော်မှ တည်နေရာဆဲလ်အတွက် အနီးဆုံးများကို အလိုအလျောက် ရွေးပါ",
  "settings.network.discovery_needs_relay":
    "စိတ်ကြိုက်ထပ်ဆင့်လွှင့်စက်တစ်ခုကို အရင်ထည့်ပါ",
  "settings.network.discovery_needs_relay_body":
    "Airhop ကို အနီးဆုံးထပ်ဆင့်လွှင့်စက်များဆီ ညွှန်းပေးသည်မှာ အလိုအလျောက်ရှာဖွေမှုပင် ဖြစ်သည်။ ၎င်းကို ပိတ်ခြင်းသည် အောက်တွင် သင့်ကိုယ်ပိုင်စက်များကို သတ်မှတ်ပြီးမှသာ အဓိပ္ပာယ်ရှိသဖြင့် အနည်းဆုံး တစ်ခုကို အရင်ထည့်ပါ။",
  "settings.network.custom_only_title":
    "သင့်စိတ်ကြိုက်ထပ်ဆင့်လွှင့်စက်များကိုသာ သုံးမလား?",
  "settings.network.custom_only_body":
    "တည်နေရာချန်နယ်များနှင့် မက်ရှ်တံတားသည် အနီးဆုံးထပ်ဆင့်လွှင့်စက်များကို အလိုအလျောက်ရွေးခြင်း ရပ်တန့်ပြီး သင်ထည့်ထားသည်များကိုသာ သုံးပါလိမ့်မည်။ ဤသည်က ဆက်သွယ်နိုင်မှုကို လျော့ကျစေနိုင်ပြီး အနီးဆုံးထပ်ဆင့်လွှင့်စက်များတွင် စုစည်းလေ့ရှိသော bitchat အသုံးပြုသူများနှင့် မတွေ့တော့ဘဲ ဖြစ်နိုင်သည်။",
  "settings.network.custom": "စိတ်ကြိုက်ထပ်ဆင့်လွှင့်စက်များ",
  "settings.network.custom_desc":
    "တည်နေရာချန်နယ်များနှင့် မက်ရှ်တံတားအတွက် သင့်ကိုယ်ပိုင်ထပ်ဆင့်လွှင့်စက်များ ထည့်ပါ",
  "settings.network.custom_added": "{max} ခုအနက် {count} ခု ထည့်ပြီး",
  "settings.network.dm_relays": "မက်ဆေ့ဂျ် ထပ်ဆင့်လွှင့်စက်များ",
  "settings.network.dm_relays_desc":
    "တိုက်ရိုက်မက်ဆေ့ဂျ်များနှင့် သီးသန့်ချန်နယ်များသည် ဤစက်များကို အမြဲအသုံးပြုသည်။ စိတ်ကြိုက်ထပ်ဆင့်လွှင့်စက်များက ၎င်းတို့ကို မပြောင်းလဲပါ။",
  "settings.network.discovery_back_on":
    "ပထဝီထပ်ဆင့်လွှင့်စက် ရှာဖွေခြင်း ပြန်ဖွင့်ပြီး",
  "settings.network.discovery_back_on_body":
    "ထိုသည်မှာ သင့်နောက်ဆုံးစိတ်ကြိုက်ထပ်ဆင့်လွှင့်စက် ဖြစ်ခဲ့သည်။ တည်နေရာချန်နယ်များသည် ထုတ်ဝေရန်နေရာလိုအပ်သဖြင့် Airhop က အနီးဆုံးထပ်ဆင့်လွှင့်စက်များကို ပြန်၍ အလိုအလျောက် ရွေးနေပါသည်။",
  "settings.network.add_relay": "ထပ်ဆင့်လွှင့်စက် ထည့်ပါ",
  "settings.network.remove_relay": "{url} ကို ဖယ်ရှားပါ",
  "settings.network.add_short": "ထည့်ပါ",
  "settings.network.relay_limit":
    "ထပ်ဆင့်လွှင့်စက် {count} ခုအထိ ထည့်နိုင်သည်။ နောက်တစ်ခုထည့်ရန် တစ်ခုကို ဖယ်ပါ။",
  "settings.network.relay_duplicate":
    "ထိုထပ်ဆင့်လွှင့်စက်သည် သင့်စာရင်းတွင် ရှိပြီးသားဖြစ်သည်။",
  "settings.network.relay_invalid":
    "မှန်ကန်သော ထပ်ဆင့်လွှင့်စက်လိပ်စာကို ထည့်ပါ၊ ဥပမာ relay.example.com။ ပို့တ်သည် စက်က မူလတန်ဖိုးကို မသုံးမှသာ လိုအပ်သည်။ IP လိပ်စာများနှင့် ဒေသတွင်းအမည်များကို ခွင့်မပြုပါ။",
  "settings.network.lan": "စက်တွင်းကွန်ရက်",
  "settings.network.lan_desc":
    "တူညီသော WiFi ပေါ်ရှိ လူများထံ ရောက်ရှိပါ၊ iPhone နှင့် Android ကြားတွင်လည်း ရပါသည်။ ကွန်ရက်ပေါ်ရှိ အခြားစက်များက သင် Airhop သုံးနေကြောင်း မြင်နိုင်ပါသည်။",
  "settings.network.lan_searching": "ဤကွန်ရက်ပေါ်တွင် Airhop စက် မရှိပါ",
  "settings.network.lan_active": "ဤကွန်ရက်တွင် ချိတ်ဆက်ထားသည်",
  "settings.network.lan_unavailable": "WiFi ကွန်ရက်ပေါ်တွင် မရှိပါ",
  "settings.network.lan_permission":
    "Airhop အတွက် စက်တွင်းကွန်ရက် သုံးခွင့် ပိတ်ထားသည်",
  "settings.network.lan_unsupported": "ဤစက်တွင် မရရှိနိုင်ပါ",
  "settings.network.lan_foreground":
    "Airhop နောက်ကွယ်သို့ ရောက်သောအခါ ရပ်သွားသည်။ ဘလူးတုသ်က ဆက်လက်အလုပ်လုပ်သည်။",
  "settings.network.wifi_pair": "တွဲချိတ်ခြင်း",
  "settings.network.wifi_paired": "တွဲထားသော ကိရိယာများ",
  "settings.network.wifi_pair_find": "ကိရိယာ ရှာပါ",
  "settings.network.wifi_pair_find_desc":
    "မိမိကိုယ်ကို ပြသနေသော အနီးအနားရှိ iPhone ကို ရှာပါ။ ဖုန်းနှစ်လုံးစလုံး iOS 26 သို့မဟုတ် နောက်ပိုင်း လိုအပ်သည်။",
  "settings.network.wifi_pair_show": "ဤ iPhone ကို ပြပါ",
  "settings.network.wifi_pair_show_desc":
    "အနီးအနားရှိ iPhone အား ဤကိရိယာကို ရှာတွေ့ခွင့်ပြုပါ။ တစ်ဦးက ရှာပြီး နောက်တစ်ဦးက ပြသည်၊ တစ်ချိန်တည်းတွင်။",
  "settings.network.wifi_pair_find_action": "အနီးအနားရှိ iPhone ကို ရွေးပါ",
  "settings.network.wifi_pair_show_action":
    "ဤ iPhone ကို ရှာတွေ့နိုင်အောင် လုပ်ပါ",
  "settings.network.wifi_pair_unavailable": "Wi-Fi Aware ကို ယခု မရနိုင်ပါ",
  "settings.network.wifi_pair_forget":
    "Settings အက်ပ်တွင် တွဲထားမှုကို ဖယ်ရှားပါ",
  "settings.network.bitchat": "bitchat ကိုက်ညီမှု",
  "settings.network.bitchat_desc":
    "bitchat နှင့် တူညီသော BLE မက်ရှ်ဖြစ်ပြီး အပြည့်အဝ အတူတကွ အလုပ်လုပ်နိုင်သည်။ ဤအရာကို အမြဲဖွင့်ထားပြီး ပိတ်၍ မရပါ။",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "နောက်ခံတွင် လုပ်ဆောင်ပါ",
  "settings.conn.background_desc":
    "Airhop ပိတ်ထားချိန်တွင်လည်း မက်ရှ်ကို ဆက်လက်လုပ်ဆောင်စေပါ",
  "settings.conn.background_on_title": "မက်ရှ်ကို ဆက်လုပ်ဆောင်စေမလား?",
  "settings.conn.background_on_body":
    "Airhop သည် ပိတ်ထားချိန်တွင်လည်း ထပ်ဆင့်ပို့ခြင်းနှင့် လက်ခံခြင်းကို ဆက်လုပ်သဖြင့် သင်မရှိချိန်တွင် မက်ဆေ့ဂျ်များ ရောက်လာပါမည်။ ထိုအချိန်တွင် Android က အသိပေးချက်တစ်ခု ဆက်တိုက်ပြသနေပါမည်။",
  "settings.conn.background_off_title": "Airhop ပိတ်လျှင် မက်ရှ်ကိုပါ ရပ်မလား?",
  "settings.conn.background_off_body":
    "မက်ဆေ့ဂျ်များသည် Airhop ဖွင့်ထားချိန်တွင်သာ ရောက်လာမည်ဖြစ်ပြီး ဤဖုန်းသည် အနီးအနားရှိသူများအတွက် ထပ်ဆင့်ပို့ခြင်း ရပ်တန့်ပါမည်။ ဆက်တိုက်ပြသနေသော အသိပေးချက်လည်း ပျောက်သွားပါမည်။",
  "settings.conn.live_voice": "တိုက်ရိုက်အသံ",
  "settings.conn.live_voice_desc":
    "အနီးအနားရှိသူများနှင့် ဝေါ်ကီတော်ကီကဲ့သို့ စကားပြောပါ",
  "settings.conn.live_voice_on_title": "တိုက်ရိုက်အသံကို ဖွင့်မလား?",
  "settings.conn.live_voice_on_body":
    "မိုက်ကို ဖိထားစဉ် သင်စကားပြောသည်နှင့်တစ်ပြိုင်နက် သင့်အသံသည် ဘလူးတုသ်အကွာအဝေးအတွင်းရှိ လူတိုင်းထံ ရောက်သွားပြီး ၎င်းတို့၏အသံလည်း သင့်ဖုန်းတွင် ထွက်ပါမည်။ ဘာမျှ အသံဖမ်းမထားပါ။",
  "settings.conn.live_voice_off_title": "တိုက်ရိုက်အသံကို ပိတ်မလား?",
  "settings.conn.live_voice_off_body":
    "မိုက်ကို ဖိထားလျှင် ယင်းအစား အသံမှတ်စုတစ်ခု အသံဖမ်းပါမည်။ လွှတ်လိုက်လျှင် ပို့ပြီး ၎င်းတို့ဖွင့်နားမထောင်မချင်း မည်သူမျှ မကြားရပါ။",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor လမ်းကြောင်း",
  "settings.conn.tor_desc":
    "ကိုယ်ရေးလုံခြုံမှု ပိုမိုရရှိရန် Nostr အသွားအလာကို Tor မှတစ်ဆင့် ပို့ပါ",
  "settings.conn.tor_on_title": "Nostr အသွားအလာကို Tor မှတစ်ဆင့် ပို့မလား?",
  "settings.conn.tor_on_body":
    "ထပ်ဆင့်လွှင့်စက်များသည် သင့် IP လိပ်စာကို မမြင်တော့ပါ။ ချိတ်ဆက်ရာတွင် ပိုကြာပြီး မက်ဆေ့ဂျ်များလည်း ပိုနှေးပါမည်။ ဘလူးတုသ်ကို မထိခိုက်ပါ။",
  "settings.conn.tor_off_title": "Tor လမ်းကြောင်းကို ပိတ်မလား?",
  "settings.conn.tor_off_body":
    "Nostr အသွားအလာသည် သင့်ပုံမှန်ချိတ်ဆက်မှုသို့ ပြန်သွားမည်ဖြစ်၍ ထပ်ဆင့်လွှင့်စက်များက သင့် IP လိပ်စာကို ပြန်မြင်ပါမည်။ မည်သို့ပင်ဖြစ်စေ ဘလူးတုသ်ကို မထိခိုက်ပါ။",
  "settings.conn.tor_unavailable":
    "ဤတည်ဆောက်မှုတွင် Tor လမ်းကြောင်း မရနိုင်ပါ။",
  "settings.conn.tor_timeout":
    "Tor ချိတ်ဆက်ရန် တစ်မိနစ်ကျော် ကြာနေပါသည်။ ၎င်းသည် ဖွင့်ထားဆဲဖြစ်ပြီး ဆက်ကြိုးစားနေပါသည်။ လမ်းကြောင်းရသည့်အခါ သို့မဟုတ် ဤကွန်ရက်က ပိတ်ဆို့နေသည်ဆိုပါက မက်ရှ်တဘ်က အသိပေးပါလိမ့်မည်။",
  "settings.conn.tor_failed": "Tor ကို စတင်၍မရပါ။ ခဏနေ ထပ်စမ်းပါ။",
  "settings.tor.status": "Tor အခြေအနေ",
  "settings.tor.connection": "ချိတ်ဆက်မှု",
  "settings.tor.mode_off": "တိုက်ရိုက်",
  "settings.tor.mode_off_desc":
    "Tor သို့ တိုက်ရိုက်ချိတ်ဆက်သည်။ အမြန်ဆုံးဖြစ်သော်လည်း ဤကွန်ရက်ကို စောင့်ကြည့်သူများ သင် Tor သုံးနေကြောင်း မြင်နိုင်သည်။",
  "settings.tor.mode_snowflake": "Snowflake",
  "settings.tor.mode_snowflake_desc":
    "Tor သုံးနေကြောင်း ဖုံးကွယ်ပေးပြီး တံတားများ ပိတ်ဆို့ခံရသည့်နေရာတွင်လည်း အလုပ်လုပ်သည်။ ချိတ်ဆက်ရန် အနှေးဆုံး။",
  "settings.tor.mode_obfs4": "obfs4",
  "settings.tor.mode_obfs4_desc":
    "Tor သုံးနေကြောင်း ဖုံးကွယ်ပေးသည်။ Snowflake ထက် မြန်သော်လည်း ဤတံတားများမှာ အများသိဖြစ်ပြီး အချို့ကွန်ရက်များက ပိတ်ဆို့သည်။",
  "settings.tor.mode_webtunnel": "webtunnel",
  "settings.tor.mode_webtunnel_desc":
    "သာမန်ဝဘ်ဆိုက်လည်ပတ်မှုပုံစံဖြင့် Tor သုံးနေကြောင်း ဖုံးကွယ်ပေးသည်။ အခြားနည်းများထက် ပိတ်ဆို့ရန် ခက်သည်။",
  "settings.tor.mode_custom": "ကိုယ်ပိုင်တံတားများ",
  "settings.tor.mode_custom_desc":
    "bridges.torproject.org မှ obfs4 တံတားလိုင်းများကို သုံးပါ။ အခြားနည်းများ မအောင်မြင်လျှင် ဤနည်းကို စမ်းပါ။",
  "settings.tor.custom_placeholder":
    "တစ်ကြောင်းလျှင် တံတားတစ်ကြောင်း ကူးထည့်ပါ",
  "settings.tor.custom_apply_hint": "ချိတ်ဆက်ရန် အကွက်ပြင်ပကို တို့ပါ။",
  "settings.tor.custom_empty": "ဦးစွာ တံတားလိုင်း အနည်းဆုံးတစ်ခု ထည့်ပါ။",
  "settings.tor.recovered":
    "Tor သည် ယခင်တစ်ကြိမ်က စတင်ခြင်း မပြီးဆုံးခဲ့သဖြင့် ပိတ်လိုက်ပါပြီ။ ထပ်စမ်းရန် ပြန်ဖွင့်ပါ။",
  "settings.conn.mint_clearnet":
    "မင့်အသွားအလာကို ပွင့်လင်းကွန်ရက်ပေါ်တွင် ခွင့်ပြုပါ",
  "settings.conn.mint_clearnet_desc":
    "iOS ပေါ်ရှိ Tor သည် Nostr ကိုသာ လွှမ်းခြုံသည်။ မင့်တောင်းဆိုမှုများကို ပိတ်ဆို့ရန် ပိတ်ထားပါ။ မည်သို့ပင်ဖြစ်စေ မက်ရှ်ပေါ်ရှိ ecash မှာ ဆက်လက်အလုပ်လုပ်နေပါမည်။",
  "settings.conn.gateway": "အင်တာနက် ဝင်ပေါက်",
  "settings.conn.gateway_desc":
    "အနီးအနားရှိ အော့ဖ်လိုင်းဖုန်းတစ်လုံးအား တည်နေရာချန်နယ်များသို့ ရောက်နိုင်စေရန် သင့်ချိတ်ဆက်မှုကို ငှားပေးပါ",
  "settings.conn.gateway_on_title": "အင်တာနက်ဝင်ပေါက်ကို ဖွင့်မလား?",
  "settings.conn.gateway_on_body":
    "ကိုယ်ပိုင်ချိတ်ဆက်မှုမရှိသော အနီးအနားရှိဖုန်းများသည် တည်နေရာချန်နယ်မက်ဆေ့ဂျ်များကို သင့်ဖုန်းမှတစ်ဆင့် ပို့ပြီး လက်ခံပါမည်။ သင့်မိုဘိုင်းဒေတာနှင့် ဘက်ထရီကို သုံးပြီး ၎င်းတို့၏မက်ဆေ့ဂျ်များမှာ အစမှအဆုံး စာဝှက်ထားသဖြင့် ဖြတ်သန်းသွားသည်များကို သင် မဖတ်နိုင်ပါ။",
  "settings.conn.gateway_off_title": "အင်တာနက်ဝင်ပေါက်ကို ပိတ်မလား?",
  "settings.conn.gateway_off_body":
    "အနီးအနားရှိ အော့ဖ်လိုင်းဖုန်းများသည် သင့်ဖုန်းမှတစ်ဆင့် တည်နေရာချန်နယ်များသို့ ရောက်ခြင်း ရပ်တန့်ပါမည်။ သင့်ကိုယ်ပိုင်မက်ဆေ့ဂျ်များကို မထိခိုက်ပါ။",
  "settings.conn.bridge": "မက်ရှ်တံတား",
  "settings.conn.bridge_desc":
    "ဤဧရိယာ၏ အများသုံး #bluetooth စကားပြောကို အင်တာနက်မှတစ်ဆင့် အကွာအဝေးပြင်ပရှိ အခြားဘလူးတုသ်အုပ်စုတစ်ခုနှင့် ချိတ်ဆက်ပါ",
  "settings.conn.bridge_on_title": "မက်ရှ်တံတားကို ဖွင့်မလား?",
  "settings.conn.bridge_on_body":
    "သင့် အများသုံး #bluetooth မက်ဆေ့ဂျ်များကို အင်တာနက်မှတစ်ဆင့် သင့်ရပ်ကွက်သို့ ထုတ်ဝေပါမည်။ ထို့ကြောင့် ဘလူးတုသ်အကွာအဝေးပြင်ပရှိသူများလည်း ဖတ်နိုင်ပါမည်။ သီးသန့်မက်ဆေ့ဂျ်များကို ဘယ်တော့မှ တံတားမကူးစေပါ။ “အနီးအနားသာ” က မက်ဆေ့ဂျ်တစ်ခုချင်းစီကို ဒေသတွင်း ကန့်သတ်ထားပေးသည်။",
  "settings.conn.bridge_off_title": "မက်ရှ်တံတားကို ပိတ်မလား?",
  "settings.conn.bridge_off_body":
    "သင့် အများသုံး #bluetooth မက်ဆေ့ဂျ်များသည် ဘလူးတုသ်အကွာအဝေးအတွင်း ပြန်ကျန်နေမည်ဖြစ်ပြီး တံတားတစ်ဖက်ရှိအုပ်စုမှ မက်ဆေ့ဂျ်များလည်း ဤနေရာသို့ ရောက်လာခြင်း ရပ်တန့်ပါမည်။",
  "settings.conn.bridge_needs_location": "မက်ရှ်တံတားသည် တည်နေရာ လိုအပ်သည်",
  "settings.conn.bridge_needs_location_desc":
    "တည်နေရာဖတ်ချက်မှ သင့်ရပ်ကွက်ကို ရှာသည်။ တံတားစတင်ရန် တည်နေရာခွင့်ပြုချက် ပေးပါ။",
  "settings.conn.grant_location": "တည်နေရာ ခွင့်ပြုချက် ပေးပါ",
  "settings.conn.grant_short": "ခွင့်ပြုပါ",
  "settings.conn.internet_off": "အင်တာနက် ပိတ်ထားသည်",
  "settings.conn.internet_off_desc":
    "Tor၊ တံတားနှင့် ဝင်ပေါက် အားလုံးသည် အင်တာနက်ကို သုံးသည်။ ၎င်းတို့ကို သုံးရန် ကွန်ရက်အောက်ရှိ အင်တာနက်အရန်ကို ဖွင့်ပါ။",
  "settings.conn.turn_on": "ဖွင့်ပါ",
  "settings.conn.turn_off": "ပိတ်ပါ",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "ဘလူးတုသ်",
  "settings.permissions.bluetooth_desc":
    "အနီးအနားရှိစက်များကို ရှာဖွေပြီး ၎င်းတို့အကြား မက်ဆေ့ဂျ်များကို ထပ်ဆင့်ပို့သည်။ ၎င်းမပါဘဲ မက်ရှ် အလုပ်မလုပ်နိုင်ပါ။",
  "settings.permissions.location": "တည်နေရာ",
  "settings.permissions.location_desc":
    "အနီးအနားရှိ ဧရိယာချန်နယ်များကို ဖွင့်ပေးသည်။ ၎င်းမပါဘဲ ထိုချန်နယ်များ ပိတ်နေမည်ဖြစ်ပြီး ဘလူးတုသ်မက်ရှ်မှာ ပုံမှန်အတိုင်း ဆက်လုပ်ဆောင်နေပါမည်။",
  "settings.permissions.notifications": "အသိပေးချက်များ",
  "settings.permissions.notifications_desc":
    "အက်ပ်ပိတ်ထားချိန်တွင်ပင် မက်ဆေ့ဂျ်အသစ်များအတွက် အသိပေးချက် ရယူပါ။ ၎င်းမပါဘဲ Airhop ဖွင့်မှသာ မြင်ရပါမည်။",
  "settings.permissions.camera": "ကင်မရာ",
  "settings.permissions.camera_desc":
    "QR ကုဒ်များ စကန်ဖတ်ပြီး ပို့ရန် ဓာတ်ပုံ သို့မဟုတ် ဗီဒီယို ရိုက်ပါ။ ၎င်းမပါဘဲလည်း ပြခန်းမှ မီဒီယာကို မျှဝေနိုင်ပါသေးသည်။",
  "settings.permissions.photos": "ဓာတ်ပုံများ",
  "settings.permissions.photos_desc":
    "သင့်ပြခန်းမှ ဓာတ်ပုံများ ပို့ပြီး လက်ခံရရှိသောမီဒီယာကို သိမ်းပါ။ ၎င်းမပါဘဲလည်း ကင်မရာဖြင့် ဓာတ်ပုံအသစ်ရိုက်၍ ပို့နိုင်ပါသေးသည်။",
  "settings.permissions.microphone": "မိုက်ခရိုဖုန်း",
  "settings.permissions.microphone_desc":
    "အသံမက်ဆေ့ဂျ်များ ဖမ်းပြီး ပို့ပါ သို့မဟုတ် တိုက်ရိုက်အသံကို သုံးပါ။ ၎င်းမပါဘဲ အသံမက်ဆေ့ဂျ်နှင့် တိုက်ရိုက်အသံ အလုပ်မလုပ်ပါ။",
  "settings.permissions.allow": "ဤခွင့်ပြုချက်ကို ခွင့်ပြုပါ",
  "settings.permissions.open_settings":
    "ဤခွင့်ပြုချက်ကို ပြောင်းရန် စနစ်ဆက်တင်များကို ဖွင့်ပါ",
  "settings.permissions.system": "စနစ်",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "ကွန်ရက်အသုံးပြုမှု",
  "settings.storage.storage_usage": "သိုလှောင်မှုအသုံးပြုမှု",
  "settings.storage.storage_usage_desc":
    "မက်ဆေ့ဂျ်များ၊ ပိုက်ဆံအိတ်သက်သေများနှင့် သိမ်းထားသော ပူးတွဲဖိုင်များ",
  "settings.storage.session_usage":
    "ဤအကြိမ် · ပို့ပြီး {sent}၊ လက်ခံပြီး {received}",
  "settings.storage.cache": "ကက်ရှ်",
  "settings.storage.cache_desc": "ပူးတွဲဖိုင် {size}",
  "settings.storage.clear_cache": "ပူးတွဲဖိုင်ကက်ရှ်ကို ရှင်းပါ",
  "settings.storage.clear": "ရှင်းပါ",
  "settings.storage.clear_title": "သိမ်းထားသောမီဒီယာကို ရှင်းမလား?",
  "settings.storage.clear_body":
    "ဓာတ်ပုံ၊ ဗီဒီယို၊ အသံမှတ်စုနှင့် ဖိုင်များကို ပို့သည်ဖြစ်စေ လက်ခံသည်ဖြစ်စေ ဤစက်မှ ဖယ်ရှားပါမည်။ ပြန်ဒေါင်းလုဒ်လုပ်၍ မရတော့ပါ — ၎င်းတို့၏ပူဖောင်းများက ထိုသို့ ဖော်ပြပါမည်၊ ပေးပို့သူကို ပြန်ပို့ခိုင်းနိုင်ပါသည်။ မက်ဆေ့ဂျ်များနှင့် ပိုက်ဆံအိတ်ကို မထိပါ။",
  "settings.storage.cleared": "ကက်ရှ်ကို ရှင်းပြီးပါပြီ",
  "settings.storage.freed": "{size} လွတ်သွားပါပြီ။",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "အသွင်အပြင်ကို {value} အဖြစ် သတ်မှတ်ပါ",
  "settings.font.set_a11y": "အကျယ်တူဖောင့်ကို {value} အဖြစ် သတ်မှတ်ပါ",
  "settings.font.system": "စနစ်",
  "settings.font.system_desc": "သင့်စက်၏ မူလအကျယ်တူဖောင့်ကို သုံးသည်",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "ခေတ်မီပြီး ဖတ်ရလွယ်ကူသည်",
  "settings.language.en": "အင်္ဂလိပ်",
  "settings.language.am": "အမ်ဟာရစ်",
  "settings.language.ar": "အာရဗီ",
  "settings.language.bn": "ဘင်္ဂါလီ",
  "settings.language.my": "မြန်မာ",
  "settings.language.zh_hans": "တရုတ် (ရိုးရှင်း)",
  "settings.language.zh_hant": "တရုတ် (ရိုးရာ)",
  "settings.language.nl": "ဒတ်ချ်",
  "settings.language.fil": "ဖိလစ်ပိုင်",
  "settings.language.fr": "ပြင်သစ်",
  "settings.language.ka": "ဂျော်ဂျီယာ",
  "settings.language.de": "ဂျာမန်",
  "settings.language.hi": "ဟိန္ဒီ",
  "settings.language.id": "အင်ဒိုနီးရှား",
  "settings.language.it": "အီတလီ",
  "settings.language.ja": "ဂျပန်",
  "settings.language.ko": "ကိုရီးယား",
  "settings.language.mg": "မာလာဂါစီ",
  "settings.language.ms": "မလေး",
  "settings.language.ne": "နီပေါ",
  "settings.language.fa": "ပါရှန်",
  "settings.language.pl": "ပိုလန်",
  "settings.language.pt_br": "ပေါ်တူဂီ (ဘရာဇီး)",
  "settings.language.pt_pt": "ပေါ်တူဂီ (ပေါ်တူဂယ်)",
  "settings.language.pa": "ပန်ချာဘီ",
  "settings.language.ru": "ရုရှား",
  "settings.language.es": "စပိန်",
  "settings.language.sw": "ဆွာဟီလီ",
  "settings.language.sv": "ဆွီဒင်",
  "settings.language.ta": "တမီး",
  "settings.language.th": "ထိုင်း",
  "settings.language.tr": "တူရကီ",
  "settings.language.uk": "ယူကရိန်း",
  "settings.language.ur": "အူရဒူ",
  "settings.language.vi": "ဗီယက်နမ်",
  "settings.language.pseudo": "စမ်းသပ်ဘာသာစကား",
  "settings.language.soon": "မကြာမီ လာမည်",
  "settings.language.soon_a11y": "{value}၊ မကြာမီ လာမည်",
  "settings.language.set_a11y": "ဘာသာစကားကို {value} အဖြစ် သတ်မှတ်ပါ",
  "settings.language.pending": "နောက်တစ်ကြိမ် ဖွင့်သည့်အခါ",
  "settings.language.pending_a11y":
    "{value}၊ နောက်တစ်ကြိမ် Airhop ဖွင့်သည့်အခါ အကျိုးသက်ရောက်မည်",
  "settings.language.rtl_restart": "ယခုပြန်ဖွင့်ပါ",
  "settings.language.rtl_title": "ပြီးမြောက်စေရန် Airhop ကို ပြန်ဖွင့်ပါ",
  "settings.language.rtl_body":
    "{value} သည် ညာမှဘယ်သို့ ဖတ်ရပြီး Airhop သည် စတင်ချိန်တွင်သာ ဦးတည်ချက်ကို ပြောင်းနိုင်သည်။ ပြောင်းလဲမှုပြီးမြောက်စေရန် ပိတ်ပြီး ပြန်ဖွင့်ပါ။ ဘာမျှ ဆုံးရှုံးမည်မဟုတ်ဘဲ ထိုအချိန်အထိ သင့်မက်ရှ် ချိတ်ဆက်ထားဆဲ ဖြစ်ပါမည်။",
  "settings.theme.light": "အလင်း",
  "settings.theme.light_desc": "အလင်းအရောင်စဉ်ကို အမြဲသုံးပါ",
  "settings.theme.dark": "အမှောင်",
  "settings.theme.dark_desc": "အမှောင်အရောင်စဉ်ကို အမြဲသုံးပါ",

  // ---- Settings: profile and identity ----
  "settings.status.online": "အွန်လိုင်း",
  "settings.status.online_desc": "ရှာတွေ့နိုင်သည်၊ ကြေညာလျက် ရှာဖွေလျက်",
  "settings.status.away": "ဝေးနေသည်",
  "settings.status.away_desc": "မက်ရှ် ရပ်ထားသည်၊ မရှာဖွေ မကြေညာ",
  "settings.status.invisible": "မမြင်ရ",
  "settings.status.invisible_desc":
    "ရှာဖွေနေသော်လည်း ရှာတွေ့ခြင်းမှ ဖျောက်ထားသည်",
  "settings.status.title": "အခြေအနေ",
  "settings.status.set_a11y": "အခြေအနေကို {value} အဖြစ် သတ်မှတ်ပါ",
  "settings.status.edit": "အခြေအနေ ပြင်ပါ",
  "settings.status.desc": "မက်ရှ်ပေါ်တွင် မည်မျှ မြင်သာမည်ကို ရွေးပါ။",
  "settings.transfer.identity": "အထောက်အထားနှင့် သော့များ",
  "settings.transfer.identity_desc":
    "သင့်လုပ်ဖော်ကိုင်ဖက် ID၊ အသုံးပြုသူအမည်နှင့် အဆက်အသွယ်များ",
  "settings.transfer.chats": "စကားပြောများနှင့် မှတ်တမ်း",
  "settings.transfer.chats_desc":
    "စကားပြောများ၊ အဖွဲ့များနှင့် သင်ဝင်ရောက်ထားသော ချန်နယ်များ",
  "settings.transfer.wallet": "ပိုက်ဆံအိတ် လက်ကျန်",
  "settings.transfer.wallet_desc": "Cashu သက်သေများနှင့် ငွေလွှဲမှတ်တမ်း",
  "settings.transfer.title": "ဖုန်းအသစ်သို့ လွှဲပြောင်းပါ",
  "settings.transfer.desc":
    "သင့်အထောက်အထား၊ စကားပြောများနှင့် ပိုက်ဆံအိတ်ကို အခြားစက်သို့ ရွှေ့ပါ",
  "settings.transfer.coming_soon_a11y":
    "ဖုန်းအသစ်သို့ လွှဲပြောင်းခြင်း၊ မကြာမီ လာမည်",
  "settings.transfer.body":
    "ဖုန်းနှစ်လုံးကို အတူကပ်ထားပြီး ဘလူးတုသ်ဖြင့် အားလုံးကို ရွှေ့ပါ။ ဘာမျှ ဆာဗာမှ မဖြတ်သန်းသဖြင့် အင်တာနက်မလိုဘဲ အလုပ်လုပ်သည်။",
  "settings.qr.permission_label": "ဓာတ်ပုံ အသုံးပြုခွင့်",
  "settings.qr.permission_purpose": "သင့် QR ကုဒ်ကို သိမ်းရန်",
  "settings.qr.saved": "သိမ်းပြီးပါပြီ",
  "settings.qr.saved_body": "QR ကုဒ်ကို သင့်ဓာတ်ပုံပြခန်းတွင် သိမ်းလိုက်ပါပြီ။",
  "settings.qr.save_failed": "မသိမ်းနိုင်ပါ",
  "settings.qr.save_failed_body": "QR ကုဒ်ကို မသိမ်းနိုင်ပါ။ ထပ်စမ်းကြည့်ပါ။",
  "settings.qr.share_message": "Airhop တွင် ကျွန်ုပ်ကို ထည့်ပါ",
  "settings.qr.share_body":
    "Airhop တွင် ကျွန်ုပ်ကို ထည့်ပါ — အော့ဖ်လိုင်းဦးစားပေး သီးသန့်မက်ရှ်စကားပြောစနစ်။",
  "settings.qr.show_short": "QR ပြပါ",
  "settings.qr.title": "သင့် QR ကုဒ်",
  "settings.qr.note":
    "ဤအရာတွင် သင့်အများသုံးသော့များ ပါဝင်ပြီး အခြားသူများက မည်သည့်နေရာမှမဆို သင့်ကို မက်ဆေ့ဂျ်ပို့နိုင်စေသည်။ ယုံကြည်ရသူများနှင့်သာ မျှဝေပါ။ သင့်အထောက်အထားကို မဖျက်မချင်း ပြောင်းလဲမည် မဟုတ်ပါ။",
  "settings.qr.code_label": "အဆက်အသွယ်ကုဒ်",
  "settings.qr.copy_code": "အဆက်အသွယ်ကုဒ် ကူးပါ",
  "settings.qr.share": "QR ကုဒ် မျှဝေပါ",
  "settings.qr.share_short": "QR မျှဝေပါ",
  "settings.qr.download": "QR ကုဒ် ဒေါင်းလုဒ်လုပ်ပါ",
  "settings.qr.download_short": "QR ဒေါင်းလုဒ်",
  "settings.qr.show": "QR ကုဒ် ပြပါ",
  "settings.wipe.trigger": "အရေးပေါ်ဖျက်ခြင်းကို စတင်ပါ",
  "settings.wipe.trigger_desc": "အတည်မပြုဘဲ ချက်ချင်းဖျက်ရန် သုံးကြိမ်နှိပ်ပါ",
  "settings.wipe.title": "အရေးပေါ် ဖျက်ခြင်း",
  "settings.wipe.now": "ယခု ဖျက်ပါ",
  "settings.wipe.desc":
    "သော့၊ မက်ဆေ့ဂျ်နှင့် သက်သေအားလုံးကို ချက်ချင်း ဖျက်ဆီးပါ",
  "settings.wipe.body":
    "ဤသည်က သင့်သော့၊ မက်ဆေ့ဂျ်နှင့် ပိုက်ဆံအိတ်သက်သေအားလုံးကို ချက်ချင်း ဖျက်ဆီးပါလိမ့်မည်။ ဤအရာကို ပြန်ပြင်၍ မရပါ။",
  "settings.wipe.in_progress": "ဖျက်နေသည်",
  "settings.wipe.in_progress_body":
    "သင့်သော့၊ မက်ဆေ့ဂျ်နှင့် ဖိုင်များကို ဖျက်ဆီးနေပါသည်။ စက္ကန့်အနည်းငယ်ကြာပြီး အက်ပ်ပိတ်လိုက်လျှင်လည်း အလိုအလျောက် ပြီးဆုံးပါမည်။",
  "settings.wipe.got_it": "နားလည်ပါပြီ",
  "settings.wipe.keys_failed": "သော့များကို မဖျက်ဆီးနိုင်ပါ",
  "settings.wipe.keys_failed_body":
    "သင့်မက်ဆေ့ဂျ်၊ အဆက်အသွယ်နှင့် ပိုက်ဆံအိတ် ပျောက်သွားပါပြီ။ သို့သော် စက်က သင့်သော့များကို လွှတ်မပေးခဲ့ပါ။ စက်၏သော့ကို ဖွင့်ပြီး ထပ်ဖျက်ပါ။",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "ဆက်သွယ်ပါ",
  "settings.help.contact_a11y": "{address} သို့ အီးမေးလ်ပို့ပါ",
  "settings.help.bug": "ချွတ်ယွင်းချက် တင်ပြပါ",
  "settings.help.bug_desc": "GitHub တွင် issue ဖွင့်ပါ",
  "settings.help.bug_a11y": "GitHub တွင် ချွတ်ယွင်းချက် တင်ပြပါ",
  "settings.help.faq": "မေးလေ့ရှိသော မေးခွန်းများ",
  "settings.help.faq_desc": "အများမေးလေ့ရှိသော မေးခွန်းများ၏ အဖြေများ",
  "settings.help.faq_a11y": "မေးလေ့ရှိသောမေးခွန်းများကို ဖွင့်ပါ",
  "settings.help.terms_desc": "Airhop ကို မည်သို့ အသုံးပြုနိုင်သနည်း",
  "settings.help.terms_a11y": "ဝန်ဆောင်မှုစည်းမျဉ်းများကို ဖွင့်ပါ",
  "settings.help.privacy_desc": "ကျွန်ုပ်တို့ မစုဆောင်းသည်များ",
  "settings.help.privacy_a11y": "ကိုယ်ရေးအချက်အလက်မူဝါဒကို ဖွင့်ပါ",

  // ---- Settings: support ----
  "settings.support.card": "ကတ် သို့မဟုတ် UPI",
  "settings.support.card_desc":
    "အွန်လိုင်းဘဏ်နှင့် ပိုက်ဆံအိတ်များ၊ ကမ္ဘာတစ်ဝန်း",
  "settings.support.card_a11y":
    "ကတ်၊ UPI၊ အွန်လိုင်းဘဏ် သို့မဟုတ် ပိုက်ဆံအိတ်ဖြင့် ပံ့ပိုးပါ",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "လစဉ် သို့မဟုတ် တစ်ကြိမ်တည်း၊ ပလက်ဖောင်းအခကြေးငွေ မရှိပါ",
  "settings.support.sponsors_a11y": "GitHub Sponsors မှတစ်ဆင့် ပံ့ပိုးပါ",
  "settings.support.note":
    "Airhop ကို အားလပ်ချိန်တွင် တည်ဆောက်ပါသည်။ ရင်းနှီးမြှုပ်နှံသူများနှင့် ကြော်ငြာများ မရှိပါ။ သင့်အတွက် အသုံးဝင်ပါက သင့်ပံ့ပိုးမှုသည် ဖွံ့ဖြိုးတိုးတက်မှု ဆက်လက်လုပ်ဆောင်နိုင်ရန် များစွာ အထောက်အကူပြုပါသည်။ မည်သို့ပင်ဖြစ်စေ လုပ်ဆောင်ချက်တိုင်း အခမဲ့ ဖြစ်နေပါမည်။",

  // ---- Settings: about and version ----
  "settings.about.version": "ဗားရှင်း",
  "settings.about.version_desc": "လက်ရှိ ထုတ်ဝေမှု",
  "settings.about.version_a11y": "ဗားရှင်းကို ကြည့်ပြီး အပ်ဒိတ်များ စစ်ဆေးပါ",
  "settings.about.release_notes": "ထုတ်ဝေမှု မှတ်စုများ",
  "settings.about.release_notes_desc": "နောက်ဆုံးထုတ်ဝေမှုတွင် ဘာအသစ်ရှိသနည်း",
  "settings.about.release_notes_a11y":
    "နောက်ဆုံးထုတ်ဝေမှုမှတ်စုများကို GitHub တွင် ဖွင့်ပါ",
  "settings.about.source": "အရင်းအမြစ်ကုဒ်",
  "settings.about.source_a11y": "အရင်းအမြစ်ကုဒ်ကို GitHub တွင် ဖွင့်ပါ",
  "settings.about.licenses": "ပွင့်လင်းအရင်းအမြစ် လိုင်စင်များ",
  "settings.about.open_repo": "{name} သိုလှောင်ရာကို ဖွင့်ပါ",
  "settings.about.licenses_desc":
    "တတိယအဖွဲ့အစည်း ပွင့်လင်းအရင်းအမြစ် ပက်ကေ့ဂျ်များ",
  "settings.about.licenses_a11y": "တတိယအဖွဲ့အစည်း လိုင်စင်များကို ကြည့်ပါ",
  "settings.version.codename": "ကုဒ်အမည်",
  "settings.version.checking": "စစ်ဆေးနေသည်",
  "settings.version.check": "အပ်ဒိတ်များ စစ်ဆေးပါ",
  "settings.version.checking_title": "အပ်ဒိတ်များ စစ်ဆေးနေသည်",
  "settings.version.up_to_date": "သင်သည် နောက်ဆုံးဗားရှင်းကို သုံးနေပါသည်။",
  "settings.version.release_notes": "ထုတ်ဝေမှုမှတ်စုများကို ကြည့်ပါ",
  "settings.version.made_with": "ဖြင့် ပြုလုပ်သည်",
  "settings.version.number": "ဗားရှင်း {version}",
  "settings.version.update_to": "{version} သို့ အပ်ဒိတ်လုပ်ပါ",
  "settings.version.update_to_a11y": "ဗားရှင်း {version} သို့ အပ်ဒိတ်လုပ်ပါ",
  "settings.version.released_under": "{license} အောက်တွင် ထုတ်ဝေသည်",
  "settings.version.notes_a11y":
    "ဗားရှင်း {version} ၏ ထုတ်ဝေမှုမှတ်စုများကို ကြည့်ပါ",
  "settings.version.tor_paused":
    "သင့် IP မပေါက်ကြားစေရန် Tor ဖွင့်ထားစဉ် အပ်ဒိတ်စစ်ဆေးမှုကို ရပ်ထားသည်။ ထုတ်ဝေမှုစာမျက်နှာကို ဘရောက်ဇာတွင် ကြည့်ပါ။",
  "settings.version.check_failed":
    "အပ်ဒိတ်များ မစစ်ဆေးနိုင်ပါ။ သင့်ချိတ်ဆက်မှုကို စစ်ပြီး ထပ်စမ်းကြည့်ပါ။",
  "settings.version.downloading": "ဒေါင်းလုဒ်လုပ်နေသည် {percent}%",
  "settings.version.install": "ထည့်သွင်းရန်",
  "settings.version.download_failed":
    "ဒေါင်းလုဒ်မအောင်မြင်ပါ။ ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} သည် {size} KiB ဖြစ်ပြီး {cap} KiB ကန့်သတ်ချက်ထက် ကျော်လွန်နေသည်။",
  "transfer.failed.malformed":
    "ပူးတွဲဖိုင်တစ်ခု ပျက်စီးလျက် ရောက်လာသဖြင့် မဖွင့်နိုင်ပါ။ ပြန်ပို့ပေးရန် တောင်းဆိုပါ။",
  "transfer.failed.unsupported_type":
    "ဤအက်ပ်မဖွင့်နိုင်သော ဖော်မတ်ဖြင့် ပူးတွဲဖိုင်တစ်ခု ရောက်လာသည်။",
  "transfer.failed.type_mismatch":
    "ပူးတွဲဖိုင်တစ်ခုကို ငြင်းပယ်လိုက်သည် — ၎င်း၏အကြောင်းအရာသည် ကြေညာထားသည့် ဖိုင်အမျိုးအစားနှင့် မကိုက်ညီပါ။",
  "transfer.failed.storage":
    "ပူးတွဲဖိုင်တစ်ခု ရောက်လာသော်လည်း မသိမ်းနိုင်ပါ။ သင့်နေရာလွတ်ကို စစ်ဆေးပါ။",
  "transfer.badge.waiting": "စောင့်နေသည် · {name}",
  "transfer.badge.active_count": "လွှဲပြောင်းမှု {count} ခု",
  "transfer.badge.sending": "{name} ကို ပို့နေသည်",
  "transfer.badge.receiving": "{name} ကို လက်ခံနေသည်",
  "transfer.badge.a11y":
    "{label}၊ {percent} ရာခိုင်နှုန်း။ စကားပြောကို ဖွင့်ပါ။",
  "transfer.kind.photo": "ဓာတ်ပုံ",
  "transfer.kind.video": "ဗီဒီယို",
  "transfer.kind.voice": "အသံမှတ်စု",
  "transfer.this.photo": "ဤဓာတ်ပုံ",
  "transfer.this.video": "ဤဗီဒီယို",
  "transfer.this.voice": "ဤအသံမှတ်စု",
  "transfer.this.file": "ဤဖိုင်",
  "transfer.kind.document": "စာရွက်စာတမ်း",
  "transfer.kind.voice_preview": "အသံမှတ်စု",
  "transfer.kind.photo_preview": "ဓာတ်ပုံ",
  "transfer.kind.video_preview": "ဗီဒီယို",
  "transfer.kind.document_preview": "စာရွက်စာတမ်း",

  // ---- System notifications ----
  "notif.channel.messages": "မက်ဆေ့ဂျ်များ",
  "notif.channel.nearby": "အနီးအနားရှိ လုပ်ဖော်ကိုင်ဖက်များ",
  "notif.channel.nearby_desc":
    "မက်ရှ်က ဘလူးတုသ်အကွာအဝေးအတွင်း လူများကို တွေ့သည့်အခါ ရံဖန်ရံခါ အသိပေးသည်။",
  "notif.nearby.body":
    "ယခု ဘလူးတုသ်အကွာအဝေးအတွင်း ရှိနေသည်။ မက်ရှ်ဖွင့်ရန် နှိပ်ပါ။",
  "notif.channel_message": "{sender} — {preview}",
  "notif.someone": "တစ်စုံတစ်ဦး",
  "notif.notice_urgent": "အရေးပေါ် အသိပေးချက် · {content}",
  "notif.notice": "အသိပေးချက် · {content}",
  "notif.incoming_file": "ဝင်လာသော ဖိုင်",
  "notif.preview.photo": "📷 ဓာတ်ပုံ",
  "notif.preview.voice": "🎤 အသံမက်ဆေ့ဂျ်",
  "notif.preview.video": "🎥 ဗီဒီယို",
  "notif.preview.document": "📄 စာရွက်စာတမ်း",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "မက်ဆေ့ဂျ်အသစ်",
  "notif.hidden.channel": "လှုပ်ရှားမှုအသစ်",
  "notif.hidden.mention": "သင့်ကို ဖော်ပြခဲ့သည်",
  "notif.mention.title": "{sender} က သင့်ကို ဖော်ပြခဲ့သည်",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    other: "နောက်ထပ် {count} ခု ပြပါ",
  },
  "chat.channels.show_more_a11y": {
    other: "နောက်ထပ် မူလချန်နယ် {count} ခု ပြပါ",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    other: "{label}၊ မဖတ်ရသေးသည် {count} ခု",
  },
  "a11y.new_count": {
    other: "{label}၊ အသစ် {count} ခု",
  },
  "chat.a11y.unread": {
    other: "မဖတ်ရသေးသည် {count} ခု",
  },
  "chat.thread.length_left": {
    other: "{count} လုံး ကျန်သည်",
  },
  "settings.general.retention_days": {
    other: "{count} ရက်",
  },
  "chat.info.group_reach": {
    other: "အဖွဲ့ဝင် {count} ဦးအနက် {reachable} ဦးကို ဆက်သွယ်နိုင်သည်",
  },
  "chat.group_members": {
    other: "သီးသန့်အဖွဲ့  ·  အဖွဲ့ဝင် {count} ဦး",
  },
  "chat.select.count": {
    other: "{count} ခု ရွေးထားသည်",
  },
  "chat.select.forward": {
    other: "မက်ဆေ့ဂျ် {count} ခု ထပ်ဆင့်ပို့ပါ",
  },
  "chat.voice.live_speaking_count": {
    other: "{count} ဦး စကားပြောနေသည်",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    other: "အကွာအဝေးအတွင်း လုပ်ဖော်ကိုင်ဖက် {count} ဦး",
  },
  "mesh.peer.hops_away": {
    other: "{count} ခုန် အကွာ",
  },
  "chat.presence.active": {
    other: "{count} ဦး လှုပ်ရှားနေသည်",
  },
  "chat.presence.nearby": {
    other: "အနီးအနားတွင် {count} ဦး",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    other: "မင့် {count} ခု",
  },
  "wallet.mint.remove_body": {
    other:
      "{mint} တွင် {balance} {unit} ကို သက်သေ {count} ခုအဖြစ် သိမ်းထားသည်။ ဖယ်ရှားလိုက်လျှင် ထိုသက်သေများသည် ဤစက်မှ အပြီးအပိုင် ပျက်သွားပြီး အရန်သိမ်းထားခြင်းလည်း မရှိပါ။ လက်ကျန်ငွေကို အရင်ထုတ်ပါ သို့မဟုတ် ပို့ပါ။",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    other:
      "အပ်ငွေ {count} ခု ငွေပေးချေမှုကို စောင့်နေသည်။ အက်ပ်ဖွင့်တိုင်း ပြန်စစ်ဆေးပါသည်။",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    other: "{mints} မှ မသုံးရသေးသော သက်သေ {count} ခု ပြန်ရရှိခဲ့သည်။",
  },
  "wallet.backup.already_spent": {
    other:
      "အကြွေစေ့ {count} ခု တွေ့ရှိသော်လည်း သုံးပြီးဖြစ်နေသဖြင့် ဘာမျှ ပေါင်းထည့်မထားပါ။ ဤသည် ပုံမှန်ဖြစ်သည်။ သင်သုံးဖူးသမျှ အကြွေစေ့တိုင်းသည် မင့်သိမ်းထားသော မှတ်တမ်းများတွင် ကျန်နေဆဲဖြစ်သည်။",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    other: "နောက်ထပ် {count} ခု ပြပါ",
  },
  "wallet.activity.show_more_a11y": {
    other: "နောက်ထပ် ငွေပေးချေမှု {count} ခု ပြပါ",
  },
  "wallet.mint.unconfirmed_count": {
    other: "အတည်မပြုရသေးသည် {count} ခု",
  },
  "wallet.proof_count": {
    other: "သက်သေ {count} ခု",
  },
  "wallet.spent_removed_detail": {
    other: "သက်သေ {count} ခုကို သုံးပြီးဖြစ်သဖြင့် ဖယ်ရှားလိုက်ပါပြီ။",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    other: "အနီးအနားတွင် {count} ဦး",
  },
};

export const my = { strings, plurals };
