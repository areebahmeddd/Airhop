import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "ပင်မစာမျက်နှာသို့ ပြန်သွားရန်",
  "common.last_updated": "နောက်ဆုံးမွမ်းမံချိန်: {date}",

  "nav.aria": "အဓိကလမ်းညွှန်",
  "nav.home": "Airhop ပင်မစာမျက်နှာ",
  "nav.skip": "အကြောင်းအရာသို့ ကျော်သွားရန်",
  "nav.menu.open": "မီနူးဖွင့်ရန်",
  "nav.menu.close": "မီနူးပိတ်ရန်",
  "nav.how_it_works": "ဘယ်လိုအလုပ်လုပ်သလဲ",
  "nav.architecture": "ဖွဲ့စည်းပုံ",
  "nav.faq": "မေးလေ့ရှိသောမေးခွန်းများ",

  "footer.aria": "အောက်ခြေ",
  "footer.tagline": "သီးသန့် mesh ဆက်သွယ်ရေး",
  "footer.credit": "© {author} က {heart} ဖြင့် ဖန်တီးထားသည်",
  "footer.group.download": "ဒေါင်းလုဒ်",
  "footer.group.resources": "အရင်းအမြစ်များ",
  "footer.group.social": "လူမှုကွန်ရက်",
  "footer.group.legal": "ဥပဒေဆိုင်ရာ",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "ဖွဲ့စည်းပုံ",
  "footer.link.blogs": "ဘလော့",
  "footer.link.faq": "မေးလေ့ရှိသောမေးခွန်းများ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "ဝန်ဆောင်မှုစည်းကမ်းများ",
  "footer.link.privacy": "ကိုယ်ရေးလုံခြုံမှုမူဝါဒ",
  "footer.link.license": "ပရောဂျက်လိုင်စင်",

  "settings.theme.group": "အရောင်အပြင်အဆင်",
  "settings.theme.light": "အလင်းအပြင်အဆင်",
  "settings.theme.dark": "အမှောင်အပြင်အဆင်",
  "settings.language.label": "ဘာသာစကား",
  "settings.language.suggestion": "ဤစာမျက်နှာကို မြန်မာဘာသာဖြင့် ကြည့်ရန်",
  "settings.language.dismiss": "ပိတ်ရန်",

  "home.hero.release": "နောက်ဆုံးထွက်ဗားရှင်း",
  "home.hero.title": "အင်တာနက်မလိုဘဲ အလုပ်လုပ်သော စာပို့စနစ်။",
  "home.hero.body":
    "အနီးအနားရှိ ဖုန်းများသည် Bluetooth mesh ကို ဖွဲ့စည်းပြီး သင့်စာများကို အဆုံးမှအဆုံး စာဝှက်ထားလျက် ခုနစ်ဆင့်အထိ ဆက်လက်ပို့ဆောင်ပေးသည်။ {no_servers}၊ {no_accounts}၊ {no_tracking}။",
  "home.hero.body.no_servers": "ဆာဗာမရှိ",
  "home.hero.body.no_accounts": "အကောင့်မရှိ",
  "home.hero.body.no_tracking": "ခြေရာခံမှုမရှိ",
  "home.hero.download": "အက်ပ်ဒေါင်းလုဒ်လုပ်ရန်",
  "home.hero.badges": "MIT လိုင်စင် · အခမဲ့နှင့် ပွင့်လင်းအရင်းအမြစ် · bitchat နှင့် တွဲသုံးနိုင်",
  "home.hero.group.mobile": "မိုဘိုင်း",
  "home.hero.group.desktop": "ကွန်ပျူတာ",
  "home.hero.option.f_droid": "ပွင့်လင်းအရင်းအမြစ်စာရင်း",
  "home.hero.option.apk": "တိုက်ရိုက်ဒေါင်းလုဒ်",
  "home.hero.option.soon": "မကြာမီလာမည်",

  "home.about.eyebrow": "Airhop ဆိုတာဘာလဲ",
  "home.about.title": "အက်ပ်အများစုသည် ဗဟိုဆာဗာတစ်ခုအပေါ် မှီခိုနေသည်။",
  "home.about.sub":
    "ဆာဗာကို စောင့်ကြည့်နိုင်သည်၊ ပိတ်နိုင်သည်၊ ပိတ်ဆို့နိုင်သည်။ Airhop တွင် ဆာဗာမရှိသဖြင့် ဖိအားပေးရန် ကုမ္ပဏီလည်းမရှိ၊ ပိတ်ရန် ဝန်ဆောင်မှုလည်းမရှိပါ။",
  "home.about.card": "နည်းပညာအကျဉ်းချုပ်",
  "home.about.link.mesh": "Bluetooth Low Energy mesh",
  "home.about.link.wire_protocol": "ပို့လွှတ်မှုပရိုတိုကော",
  "home.about.body.built":
    "Airhop သည် {mesh} ပေါ်တွင် စက်ပစ္စည်းအချင်းချင်း တိုက်ရိုက် သီးသန့်စာပို့ရန်အတွက် iOS နှင့် Android အတွက် ပွင့်လင်းအရင်းအမြစ်အက်ပ်တစ်ခုဖြစ်သည်။ ၎င်းကို {bitchat} အခြေခံပေါ်တွင် တည်ဆောက်ထားပြီး ၎င်း၏ {wire_protocol} နှင့် လုံခြုံရေးပုံစံကို ပြန်လည်အသုံးပြုကာ အွန်လိုင်းမလိုသော {ecash} ငွေပေးချေမှုနှင့် အွန်လိုင်းမလိုသော AI တို့ဖြင့် တိုးချဲ့ထားသည်။ အင်တာနက်လုံးဝမရှိဘဲ အလုပ်လုပ်ပြီး စာများသည် အနီးအနားရှိစက်များမှတစ်ဆင့် အလိုအလျောက် ဆက်လက်ရောက်ရှိသည် (အိမ်တွင်း တစ်ဆင့်လျှင် ခန့်မှန်း ၁၀ မှ ၃၀ မီတာ၊ ကွင်းပြင်တွင် ပိုဝေး)၊ ခုနစ်ဆင့်အထိ။",
  "home.about.body.identity":
    "သင့်အထောက်အထားမှာ သင့်စက်ပေါ်တွင် ဖန်တီးပြီး {ios_keychain} သို့မဟုတ် {android_keystore} ထဲတွင် သိမ်းဆည်းထားသော {ed25519} သော့တွဲဖြစ်သည်။ အကောင့်မရှိ၊ မှတ်ပုံတင်ရန်မလို၊ ဆာဗာတစ်ခုကို ထိတွေ့သည့်အရာလည်း မရှိပါ။ ဆိုလိုသည်မှာ ဖျက်လိုက်သည်နှင့် သင့်ဆီပြန်လမ်းကြောင်းပေးမည့် အရာတစ်စုံတစ်ရာ မကျန်ခဲ့သော ယာယီအက်ပ်အဖြစ် သုံးနိုင်သည်။",
  "home.about.body.crypto":
    "အသုံးပြုမှုတိုင်းသည် အတည်ပြုထားသော လက်ဆွဲနှုတ်ဆက်မှုအတွက် {noise} ပရိုတိုကောကို သုံးသည်။ သိမ်းဆည်းထားသောစာများသည် {ratchet} အယ်လဂိုရီသမ်ကို သုံးသည်။ ဆိုလိုသည်မှာ နောင်တွင် သင့်စက်ကို ဖောက်ထွင်းခံရလျှင်ပင် အရင်စာများသည် ဖတ်၍မရဘဲ ကျန်နေမည်ဖြစ်သည်။ အရေးပေါ်ဖျက်ခြင်းသည် သော့နှင့်စာအားလုံးကို တစ်စက္ကန့်အတွင်း ဖျက်ဆီးပစ်သည်။",
  "home.about.body.internet":
    "သင်နှင့် သင့်အဆက်အသွယ်သည် Bluetooth အကွာအဝေးပြင်ပတွင် ရှိနေချိန်တွင် {nostr} ရီလေများသည် အင်တာနက်မှတစ်ဆင့် တံတားအဖြစ် ဆောင်ရွက်ပေးပြီး {nip17} ပုံစံဖြင့် ထုပ်ပိုးထားသော တိုက်ရိုက်စာများကို သုံးသည်။ ထို့ကြောင့် နှစ်ဦးစလုံး အွန်လိုင်းရောက်နေချိန်တွင် mesh သည် ကမ္ဘာအနှံ့ ကျယ်ပြန့်သွားသည်။ {tor} အထောက်အပံ့ကိုလည်း iOS ({arti} မှတစ်ဆင့်) နှင့် Android ({orbot} မှတစ်ဆင့်) နှစ်ခုစလုံးတွင် ရနိုင်သည်။",
  "home.about.optional.title":
    "Airhop တွင် သင်ကိုယ်တိုင် ဖွင့်နိုင်သော ရွေးချယ်စရာလုပ်ဆောင်ချက်များ ရှိသည်:",
  "home.about.optional.payments.label": "အွန်လိုင်းမလိုသော ငွေပေးချေမှု:",
  "home.about.optional.payments.body":
    "{cashu} ပရိုတိုကောကို သုံးပြီး mesh ပေါ်တွင် ငွေပေး၊ ငွေလက်ခံပါ (Bitcoin သာ)။",
  "home.about.optional.ai.label": "အွန်လိုင်းမလိုသော AI:",
  "home.about.optional.ai.body":
    "အရေးကြီးမေးခွန်းများကို ဖြေနိုင်သော၊ စက်ပေါ်တွင်တိုက်ရိုက်လည်ပတ်သည့် သေးငယ်သော AI လက်ထောက်။ လုပ်ဆောင်မှုနှင့် ဒေတာအားလုံး သင့်စက်ပေါ်တွင်သာ ရှိနေသည်။",
  "home.about.body.compatible":
    "Airhop သည် ပရိုတိုကောအဆင့်တွင် bitchat နှင့် တွဲသုံးနိုင်သည်။ တူညီသော mesh ပေါ်ရှိ Airhop စက်နှင့် bitchat စက်တို့သည် အချင်းချင်း အလိုအလျောက် ရှာတွေ့ပြီး မည်သည့်ပြင်ဆင်မှုမျှမလိုဘဲ စာများနှင့် တိုက်ရိုက်စာများ ဖလှယ်နိုင်သည်။",

  "home.situations.eyebrow": "ဘယ်အချိန်လိုအပ်သလဲ",
  "home.situations.title": "ကွန်ရက်ပြုတ်သွားသောနေ့အတွက်။",
  "home.situations.sub":
    "သဘာဝဘေးအန္တရာယ်များ၊ အင်တာနက်ဖြတ်တောက်မှုများ၊ လူထုဆန္ဒပြပွဲများ၊ သို့မဟုတ် လိုင်းမမိသော သာမန်စနေတနင်္ဂနွေ။",
  "home.situations.disaster.label": "ဘေးအန္တရာယ်",
  "home.situations.disaster.line":
    "တာဝါတိုင်များ ပြုတ်သွားပြီ။ ကြေညာစာပေါ်ရှိ အကြောင်းကြားချက်သည် ဖြတ်သွားသူတိုင်းထံ ရောက်သည်။",
  "home.situations.offgrid.label": "ကွန်ရက်ပြင်ပ",
  "home.situations.offgrid.line": "လမ်းပေါ် ဒုတိယနေ့။ နောက်ဆုံးလိုင်းတံသည် မနေ့က ပျောက်သွားပြီ။",
  "home.situations.protest.label": "ဆန္ဒပြပွဲ",
  "home.situations.protest.line":
    "လက်ကမ်းစာစောင်ပေါ်ရှိ QR ကုဒ်တစ်ခုက ချီတက်ပွဲအတွက် စာဝှက်ထားသောလိုင်းကို ဖွင့်ပေးသည်။",
  "home.situations.festival.label": "ပွဲတော်",
  "home.situations.festival.line":
    "ပွဲခင်းတွင် လိုင်းမမိပါ။ စာများသည် မသိသောသူများ၏ ဖုန်းများမှတစ်ဆင့် ခုန်ကူးသွားသည်။",

  "home.showcase.eyebrow": "အက်ပ်ကို ကြည့်ရန်",
  "home.showcase.title": "သာမန်စာပို့အက်ပ်တစ်ခု၊ အွန်လိုင်းမလိုဘဲ။",
  "home.showcase.sub":
    "စကားပြောခန်းများ၊ လိုင်းများ၊ ပိုက်ဆံအိတ်နှင့် အထောက်အထား။ အပေါ်ယံမှာ ရင်းနှီးပြီး အောက်တွင် mesh က အလုပ်လုပ်နေသည်။",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "အကွာအဝေးအတွင်းရှိ လူတိုင်းကို နီးစပ်မှုအလိုက် စီထားသည်။ ဘယ်သူ့ကိုမှ အရင်ထည့်စရာမလိုပါ။",
  "home.showcase.mesh.alt":
    "Airhop အက်ပ်၏ Mesh မျက်နှာပြင်၊ အနီးအနားရှိ စက်လေးလုံးကို လိုင်းအားအလိုက် ရေဒါပေါ်တွင် စီထားသည်။",
  "home.showcase.chats.title": "စကားပြောခန်းများ",
  "home.showcase.chats.caption":
    "သာမန်စကားပြောဆိုမှုများ။ စာတစ်စောင်ချင်းစီကို လက်ဆင့်ကမ်းပေးသော ဖုန်းများသည် ၎င်းကို ဖွင့်၍မရပါ။",
  "home.showcase.chats.alt":
    "မီးပျက်နေချိန်တွင် Airhop ပေါ်ရှိ တိုက်ရိုက်စကားပြောဆိုမှုတစ်ခု၊ ဖုန်းသုံးလုံးမှတစ်ဆင့် ပို့ဆောင်ခဲ့သည်။",
  "home.showcase.channels.title": "လိုင်းများ",
  "home.showcase.channels.caption":
    "လမ်းတစ်လမ်းလောက်သေးသည်မှ ဒေသတစ်ခုလုံးလောက်ကျယ်သည်အထိ အများပြည်သူအခန်းများ၊ ထိုနေရာရှိ မည်သူမဆိုအတွက် ဖွင့်ထားသည်။",
  "home.showcase.channels.alt":
    "Airhop အက်ပ်၏ စကားပြောမျက်နှာပြင်၊ လမ်း၊ ရပ်ကွက်၊ မြို့နှင့် ဒေသအလိုက် ကန့်သတ်ထားသော အများပြည်သူလိုင်းများကို စာရင်းပြထားသည်။",
  "home.showcase.wallet.title": "ပိုက်ဆံအိတ်",
  "home.showcase.wallet.caption":
    "ဖုန်းနှစ်လုံးစလုံး အွန်လိုင်းမရှိချိန်တွင် Bluetooth မှတစ်ဆင့် ဘေးနားကလူကို ecash ပေးလိုက်ပါ။",
  "home.showcase.wallet.alt":
    "Airhop အက်ပ်၏ ပိုက်ဆံအိတ်မျက်နှာပြင်၊ Bluetooth ဖြင့် ပို့နိုင်သော ecash လက်ကျန်ကို ပြထားသည်။",
  "home.showcase.identity.title": "အထောက်အထား",
  "home.showcase.identity.caption":
    "စာရင်းသွင်းစရာမလို၊ ဖုန်းနံပါတ်မလို၊ အီးမေးလ်မလို။ ဤဖုန်းမှ ဘယ်တော့မှမထွက်သော သော့တစ်ခုသာ။",
  "home.showcase.identity.alt":
    "Airhop အက်ပ်၏ ကိုယ်ရေးအချက်အလက်မျက်နှာပြင်၊ အကောင့်မလိုဘဲ စက်ပေါ်တွင်ဖန်တီးထားသော အထောက်အထားကို ပြထားသည်။",

  "home.how.eyebrow": "ဘယ်လိုအလုပ်လုပ်သလဲ",
  "home.how.title": "Mesh က သူ့ဘာသာသူ ဖွဲ့စည်းသည်။",
  "home.how.sub":
    "အနီးအနားရှိ node များသည် Bluetooth ပေါ်တွင် ကိုယ်တိုင်ပြန်ပြင်နိုင်သော mesh ကို ဖွဲ့စည်းသည်။ အင်တာနက်ရှိချိန်တွင် Nostr ရီလေများက ၎င်းကို ချဲ့ထွင်ပေးသည်၊ မည်သူမျှ ထိန်းချုပ်ထားသော အခြေခံအဆောက်အအုံမရှိဘဲ။",
  "home.how.cta": "ဖွဲ့စည်းပုံအပြည့်အစုံ ဖတ်ရန်",
  "home.how.discover.title": "ရှာဖွေတွေ့ရှိခြင်း",
  "home.how.discover.line":
    "Airhop သို့မဟုတ် bitchat လည်ပတ်နေသော ဖုန်းများသည် Bluetooth မှတစ်ဆင့် အချင်းချင်း အလိုအလျောက် ရှာတွေ့သည်။ တွဲချိတ်စရာမလို၊ ပြင်ဆင်စရာမလို။",
  "home.how.relay.title": "ဆက်လက်ပို့ဆောင်ခြင်း",
  "home.how.relay.line":
    "စာတစ်စောင်သည် ဖုန်းတစ်လုံးမှတစ်လုံးသို့ ခုနစ်ဆင့်အထိ ခုန်ကူးသွားသည်။ ကြားထဲရှိ ဖုန်းများသည် မိမိသယ်ဆောင်နေသည့်အရာကို ဘယ်တော့မှ မမြင်ရပါ။",
  "home.how.reach.title": "ပိုဝေးအောင်",
  "home.how.reach.line":
    "အင်တာနက်ရှိချိန်တွင် Nostr ရီလေများက ထိုစကားပြောဆိုမှုကိုပင် ပိုဝေးအောင် သယ်ဆောင်ပေးသည်၊ လိုအပ်လျှင် Tor မှတစ်ဆင့်။",
  "home.how.swipe": "လေ့လာရန် ပွတ်ဆွဲပါ",
  "home.how.diagram": "BLE mesh · စက်အချင်းချင်း ဒေသတွင်းကွန်ရက်",
  "home.how.legend.node": "BLE mesh node (အွန်လိုင်းမရှိ)",
  "home.how.legend.relay": "အဆင့်များစွာ ပို့ဆောင်ခြင်း (Noise XX ဖြင့် စာဝှက်ထား)",
  "home.how.legend.bitchat": "တူညီသော mesh ပေါ်တွင် bitchat နှင့် တွဲသုံးနိုင်",
  "home.how.legend.nostr": "Nostr တံတား (အွန်လိုင်းရှိချိန် အင်တာနက်မှတစ်ဆင့်)",

  "home.map.aria": "Nostr ရီလေတည်နေရာများပြ ကမ္ဘာ့မြေပုံ",
  "home.map.summary": "Nostr တံတား · ကမ္ဘာတစ်ဝှမ်း {locations} တွင် {relays}",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}၊ {relays}",

  "home.features.eyebrow": "ဘာလုပ်နိုင်သလဲ",
  "home.features.title": "အစစ်အမှန်စာပို့အက်ပ်တစ်ခု၊ နမူနာပြမဟုတ်ပါ။",
  "home.features.sub":
    "စကားပြော၊ အထောက်အထား၊ ကွန်ရက်နှင့် ငွေကြေး။ အားလုံးကို လိုင်းမလို၊ အကောင့်မလို၊ ကြားထဲမှာ ဘာမှမပါဘဲ အလုပ်လုပ်ရန် တည်ဆောက်ထားသည်။",

  "home.features.messaging.title": "စာပို့ခြင်း",
  "home.features.messaging.summary":
    "စာပို့အက်ပ်တစ်ခုတွင် ရှိသင့်သမျှ၊ နောက်ကွယ်တွင် အခြေခံအဆောက်အအုံ လုံးဝမပါဘဲ။",
  "home.features.messaging.dms.name": "သီးသန့်တိုက်ရိုက်စာများ",
  "home.features.messaging.dms.line":
    "အဆုံးမှအဆုံး စာဝှက်ထားပြီး ရောက်ကြောင်းနှင့် ဖတ်ကြောင်း အသိပေးချက်ပါဝင်သည်။",
  "home.features.messaging.location.name": "တည်နေရာလိုင်းများ",
  "home.features.messaging.location.line":
    "နေရာတစ်ခုနှင့် ချိတ်ဆက်ထားသောအခန်းများ၊ လမ်းတစ်လမ်းမှ ဒေသတစ်ခုအထိ။",
  "home.features.messaging.groups.name": "သီးသန့်လိုင်းများနှင့် အုပ်စုများ",
  "home.features.messaging.groups.line":
    "အခန်းအတွက် ဖိတ်ကြားလင့်ခ်များ၊ သို့မဟုတ် ၁၆ ဦးအထိ လက်မှတ်ထိုးထားသောစာရင်း။",
  "home.features.messaging.board.name": "ကြေညာစာအုပ်",
  "home.features.messaging.board.line":
    "ဧရိယာတစ်ခုတွင် ခုနစ်ရက်အထိ ကပ်ထားသော အကြောင်းကြားချက်များ။",
  "home.features.messaging.voice.name": "တိုက်ရိုက်အသံ",
  "home.features.messaging.voice.line":
    "မိုက်ကို ဖိထားပြီး အကွာအဝေးအတွင်းရှိ မည်သူနှင့်မဆို စကားပြောပါ၊ ဝါကီတောကီကဲ့သို့။",
  "home.features.messaging.notes.name": "အသံမှတ်စု",
  "home.features.messaging.notes.line": "အသံသွင်းထားသောအရာ၊ လမ်းညွှန်ရိုက်ထည့်ရသည်ထက် မြန်သည်။",
  "home.features.messaging.files.name": "ဓာတ်ပုံ၊ ဗီဒီယိုနှင့် ဖိုင်များ",
  "home.features.messaging.files.line": "မည်သည့်ပုံစံမဆို၊ ၁ MB အထိ၊ လိုင်းမလိုဘဲ။",
  "home.features.messaging.forward.name": "သိမ်းပြီးဆက်ပို့ခြင်း",
  "home.features.messaging.forward.line":
    "ချိပ်ပိတ်ထားပြီး လက်ခံသူထံရောက်သည်အထိ အနီးအနားရှိဖုန်းက သယ်ဆောင်သွားသည်။",

  "home.features.identity.title": "အထောက်အထား",
  "home.features.identity.summary": "မှတ်ပုံတင်စရာမရှိ၊ သိမ်းဆည်းစရာလည်း မရှိ။",
  "home.features.identity.keys.name": "သော့တွဲအထောက်အထား",
  "home.features.identity.keys.line":
    "ဤဖုန်းပေါ်တွင် ဖန်တီးပြီး စနစ်၏သော့သိုလှောင်ရာတွင် သိမ်းထားသည်။",
  "home.features.identity.names.name": "ဖတ်၍ရသောအမည်များ",
  "home.features.identity.names.line": "သင့်သော့မှ ဆင်းသက်လာသဖြင့် သင့်အမည်ကို မည်သူမျှ ယူ၍မရပါ။",
  "home.features.identity.qr.name": "QR အဆက်အသွယ်များ",
  "home.features.identity.qr.line": "တစ်ကြိမ်စကင်ဖတ်ရုံဖြင့် အမည်သာမက ၎င်းတို့၏သော့များပါ ပါလာသည်။",
  "home.features.identity.panic.name": "အရေးပေါ်ဖျက်ခြင်း",
  "home.features.identity.panic.line": "သော့တိုင်းနှင့် စာတိုင်းကို တစ်စက္ကန့်အတွင်း ဖျက်ဆီးသည်။",

  "home.features.networking.title": "ကွန်ရက်",
  "home.features.networking.summary": "ဖုန်းများကိုယ်တိုင်က ကွန်ရက်ဖြစ်သည်။",
  "home.features.networking.mesh.name": "Bluetooth mesh",
  "home.features.networking.mesh.line":
    "အင်တာနက်မလို၊ ရောက်တာမလို၊ လူများလက်ထဲမှာ ရှိပြီးသားဖုန်းများပေါ်တွင်။",
  "home.features.networking.bridge.name": "Mesh တံတား",
  "home.features.networking.bridge.line":
    "သင့်အများပြည်သူစကားပြောခန်းကို အကွာအဝေးပြင်ပရှိ အနီးအနားလူစုနှင့် ချိတ်ဆက်ပေးသည်။",
  "home.features.networking.wifi.name": "WiFi အမြန်လမ်း",
  "home.features.networking.wifi.line":
    "Android နှစ်လုံး သို့မဟုတ် iPhone နှစ်လုံးကြား ပိုမြန်သောလွှဲပြောင်းမှု။",
  "home.features.networking.bitchat.name": "bitchat နှင့် တွဲသုံးနိုင်",
  "home.features.networking.bitchat.line":
    "အက်ပ်နှစ်ခုစလုံး ပြင်ဆင်စရာမလိုဘဲ တူညီသော mesh သို့ ဝင်သည်။",

  "home.features.internet.title": "အင်တာနက်",
  "home.features.internet.summary": "ဖြည့်စွက်ချက်တစ်ခုသာ၊ ဘယ်တော့မှ မဖြစ်မနေလိုအပ်ချက် မဟုတ်ပါ။",
  "home.features.internet.nostr.name": "Nostr အရံလမ်းကြောင်း",
  "home.features.internet.nostr.line":
    "တိုက်ရိုက်စာများနှင့် တည်နေရာလိုင်းများသည် ရေဒီယိုအကွာအဝေးကျော်လွန်၍လည်း ဆက်လက်စီးဆင်းနေသည်။",
  "home.features.internet.relays.name": "ပထဝီရီလေရှာဖွေမှု",
  "home.features.internet.relays.line":
    "လွတ်လပ်သော အများပြည်သူရီလေ ၃၀၀ ကျော်၊ တစ်ခုမှ ကျွန်ုပ်တို့၏မဟုတ်ပါ။",
  "home.features.internet.gateway.name": "အင်တာနက်တံခါးပေါက်",
  "home.features.internet.gateway.line":
    "အနီးအနားရှိ အွန်လိုင်းမရှိသောဖုန်းက တည်နေရာလိုင်းများသို့ ရောက်နိုင်ရန် သင့်ချိတ်ဆက်မှုကို ချေးပေးပါ။",
  "home.features.internet.tor.name": "Tor ပေါင်းစပ်မှု",
  "home.features.internet.tor.line":
    "ပလက်ဖောင်းနှစ်ခုစလုံးတွင် လမ်းကြောင်းပေးထားသဖြင့် ရီလေများသည် သင့် IP ကို ဘယ်တော့မှ မမြင်ရပါ။",

  "home.features.optional.title": "ရွေးချယ်စရာ",
  "home.features.optional.summary": "မူလအားဖြင့် ပိတ်ထားသည်။ လိုချင်သည့်အခါ ဖွင့်ပါ။",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line":
    "ဖုန်းတစ်လုံးမှ အွန်လိုင်းမရှိချိန်တွင် ဘေးနားကလူကို ငွေပေးပါ။",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Lightning ကွန်ရက်မှတစ်ဆင့် bitcoin ဖြင့် ဖြည့်ပါ သို့မဟုတ် ထုတ်ယူပါ။",
  "home.features.optional.ai.name": "စက်တွင်း AI",
  "home.features.optional.ai.line": "စက်ပေါ်တွင်ပင် အဖြေပေးသည်၊ ဖုန်းမှ ဘာမျှ မထွက်သွားပါ။",
  "home.features.optional.social.name": "လူမှုကွန်ရက်တံတားများ",
  "home.features.optional.social.line": "တူညီသောအထောက်အထားဖြင့် Bluesky နှင့် Mastodon။",

  "home.compare.eyebrow": "နှိုင်းယှဉ်ချက်",
  "home.compare.title": "အွန်လိုင်းမလို၊ အပိုပစ္စည်းမလို၊ ပွင့်လင်းသည်။",
  "home.compare.sub":
    "ဤနေရာရှိ အက်ပ်တိုင်းသည် တစ်ခုခုတွင် ကောင်းသည်။ သို့သော် ကွန်ရက်ရပ်သွားချိန်တွင် ဆက်အလုပ်လုပ်နိုင်သည်မှာ အနည်းငယ်သာ။",
  "home.compare.col.project": "ပရောဂျက်",
  "home.compare.col.transport": "ပို့လွှတ်နည်း",
  "home.compare.col.encryption": "စာဝှက်ခြင်း",
  "home.compare.col.offline": "အွန်လိုင်းမလိုဘဲအလုပ်လုပ်",
  "home.compare.col.hardware_free": "အပိုပစ္စည်းမလို",
  "home.compare.col.open_source": "ပွင့်လင်းအရင်းအမြစ်",
  "home.compare.mark.yes": "ဟုတ်သည်",
  "home.compare.mark.no": "မဟုတ်ပါ",
  "home.compare.mark.partial":
    "တစ်စိတ်တစ်ပိုင်း၊ client များ ပွင့်လင်းသော်လည်း ဆာဗာများ မပွင့်လင်းပါ",
  "home.compare.mark.partial_hint": "client များ ပွင့်လင်းသော်လည်း ဆာဗာများ မပွင့်လင်းပါ",
  "home.compare.transport.servers": "ဗဟိုချုပ်ကိုင်ဆာဗာများ",
  "home.compare.transport.onion": "ကြက်သွန်လမ်းကြောင်း (ဝန်ဆောင်မှု node များ)",
  "home.compare.transport.nostr": "Nostr ရီလေများ",
  "home.compare.transport.lora": "LoRa ရေဒီယို",
  "home.compare.transport.sub_ghz": "မူပိုင် sub-GHz ရေဒီယို",

  "home.explore.eyebrow": "ပွင့်လင်းပြီး ရိုးသား",
  "home.explore.title": "ဤနေရာရှိ ပြောဆိုချက်တိုင်းကို စစ်ဆေးနိုင်သည်။",
  "home.explore.sub":
    "ကုဒ်၊ ပရိုတိုကောနှင့် အစီအစဉ်များ အားလုံး အများပြည်သူသိရှိနိုင်သည်။ ကန့်သတ်ချက်များလည်း ထို့အတူ။ ကျွန်ုပ်တို့စကားကို မယုံမီ ကိုယ်တိုင်စစ်ဆေးပါ။",
  "home.explore.audit.chip": "စာရင်းစစ်ဆေးမှု စောင့်ဆိုင်းဆဲ",
  "home.explore.audit.headline": "Airhop သည် ပြင်ပလုံခြုံရေးစစ်ဆေးမှု ယခုအထိ မခံယူရသေးပါ။",
  "home.explore.audit.body":
    "{headline} ကုဒ်အားလုံးကို ကိုယ်တိုင်ပြန်လည်စစ်ဆေးပြီး ထုတ်ဝေမီ {review} တစ်ခုမှတစ်ဆင့် ဖြတ်သန်းစေသည်။ သုံးထားသော စာဝှက်စာကြည့်တိုက်ကိုလည်း Cure53 က စစ်ဆေးပြီးဖြစ်သည်။ သို့သော် ၎င်းသည် အက်ပ်ကိုယ်တိုင်၏ တရားဝင်စစ်ဆေးမှုကို အစားထိုး၍မရပါ။ စစ်ဆေးမှုတစ်ခုကို {version} အတွက် စီစဉ်ထားသည်။ ထိုအချိန်အထိ ထိခိုက်လွယ်သောကိစ္စများအတွက် ဤအက်ပ်ကို အားမကိုးပါနှင့်။",
  "home.explore.audit.link.review": "လုံခြုံရေးပြန်လည်သုံးသပ်ရေးအေးဂျင့်",
  "home.explore.source.title": "အရင်းအမြစ်ကုဒ်",
  "home.explore.source.desc":
    "အားလုံး GitHub ပေါ်တွင် MIT လိုင်စင်ဖြင့်။ Issue၊ pull request နှင့် ဆွေးနွေးမှုများ ဖွင့်ထားသည်။",
  "home.explore.protocol.title": "ပရိုတိုကောသတ်မှတ်ချက်",
  "home.explore.protocol.desc":
    "တိကျသောပို့လွှတ်မှုပုံစံ၊ BLE UUID များနှင့် ကိန်းသေများ၊ bitchat နှင့် မျှဝေထားသည်။",
  "home.explore.architecture.title": "ဖွဲ့စည်းပုံ",
  "home.explore.architecture.desc":
    "ပို့မည်ကို နှိပ်သည်မှစ၍ ရေဒီယိုပေါ်ရှိ ဘိုက်များအထိ နည်းပညာအပြည့်အစုံ ခွဲခြမ်းစိတ်ဖြာချက်။",
  "home.explore.roadmap.title": "လမ်းပြမြေပုံ",
  "home.explore.roadmap.desc":
    "v0.5.0 မှ v2.0.0 အထိ ဗားရှင်းရည်မှန်းချက်များ၊ စီစဉ်ထားသောစစ်ဆေးမှုအပါအဝင်။",
  "home.explore.vision.title": "မျှော်မှန်းချက်",
  "home.explore.vision.desc":
    "Airhop ဘာကြောင့်ရှိသလဲ၊ ဖိအားအောက်တွင်လည်း မပြောင်းလဲသော အခြေခံမူများ။",
  "home.explore.brand.title": "အမှတ်တံဆိပ်အစုံ",
  "home.explore.brand.desc":
    "ပစ်ဆယ်ငှက်၊ အရောင်နှင့် စာလုံးတိုကင်များ၊ သတင်းမီဒီယာပစ္စည်းများနှင့် အသင့်သုံးစာသားများ။",

  "home.contribute.eyebrow": "ဤပရောဂျက်ကို ပံ့ပိုးပါ",
  "home.contribute.title": "လွတ်လပ်ပြီး ပွင့်လင်းစွာ။",
  "home.contribute.sub":
    "ရင်းနှီးမြှုပ်နှံသူမရှိ၊ ကြော်ငြာမရှိ၊ ငွေပေးရသောအဆင့်လည်းမရှိ။ လုပ်ဆောင်ချက်အားလုံး မည်သို့ပင်ဖြစ်စေ အခမဲ့ဖြစ်နေမည်ဖြစ်ပြီး ဤအလုပ်ကို အသုံးဝင်သည်ဟု ယူဆသူများက ထောက်ပံ့ထားသည်။",
  "home.contribute.contribute.chip": "ပါဝင်ကူညီရန်",
  "home.contribute.contribute.body":
    "သိုလှောင်ရာကို ကြယ်ပေးပါ၊ issue ဖွင့်ပါ၊ pull request ပို့ပါ။ ချွတ်ယွင်းချက်အစီရင်ခံစာများ၊ လုပ်ဆောင်ချက်အကြံပြုချက်များနှင့် ကုဒ်ပါဝင်မှုများ အားလုံးကို ကြိုဆိုပါသည်။",
  "home.contribute.contribute.cta": "GitHub တွင် ကြည့်ရန်",
  "home.contribute.sponsor.chip": "ပံ့ပိုးရန်",
  "home.contribute.sponsor.body":
    "Airhop သည် သင့်အတွက် အသုံးဝင်ပါက တစ်ကြိမ်တည်းလှူဒါန်းမှု သို့မဟုတ် ပုံမှန်ပံ့ပိုးမှုသည် ဖွံ့ဖြိုးတိုးတက်မှုဆက်လက်လုပ်ဆောင်ရန် များစွာအထောက်အကူပြုသည်။",
  "home.contribute.sponsor.donate": "တစ်ကြိမ်လှူဒါန်းရန်",
  "home.contribute.sponsor.github": "GitHub တွင် ပံ့ပိုးရန်",

  "page.architecture.eyebrow": "စာရွက်စာတမ်း",
  "page.architecture.title": "ဖွဲ့စည်းပုံ",
  "page.architecture.toc": "ဤစာမျက်နှာတွင်",

  "page.faq.eyebrow": "မေးလေ့ရှိသောမေးခွန်းများ",
  "page.faq.title": "မေးလေ့ရှိသောမေးခွန်းများ",
  "page.faq.meta": "Airhop နှင့်ပတ်သက်၍ အများမေးလေ့ရှိသောမေးခွန်းများ။",
  "page.faq.contact":
    "ဤနေရာတွင် အဖြေမရသောမေးခွန်းများကို {email} သို့ပို့နိုင်သည် သို့မဟုတ် {github} တွင် ဆွေးနွေးမှုဖွင့်၍ မေးနိုင်သည်။",

  "page.blogs.eyebrow": "ဘလော့",
  "page.blogs.title": "မကြာမီလာမည်",
  "page.blogs.body":
    "Mesh ကွန်ရက်၊ ကိုယ်ရေးလုံခြုံမှုနှင့် အွန်လိုင်းမလိုသောဆော့ဖ်ဝဲအကြောင်း ရေးသားချက်များ။",

  "page.brand.eyebrow": "အမှတ်တံဆိပ်",
  "page.brand.title": "အမှတ်တံဆိပ်အစုံ",
  "page.brand.meta":
    "ဆောင်းပါး၊ စတိုးစာရင်း၊ ဟောပြောပွဲ သို့မဟုတ် README တွင် Airhop ကို ဖော်ပြရန် ပစ္စည်းများနှင့် စည်းမျဉ်းများ။ ကိုးကားရန်နှင့် သတင်းမီဒီယာအတွက် လွတ်လပ်စွာသုံးနိုင်သည်။",

  "page.legal.eyebrow": "ဥပဒေဆိုင်ရာ",
  "page.privacy.title": "ကိုယ်ရေးလုံခြုံမှုမူဝါဒ",
  "page.terms.title": "ဝန်ဆောင်မှုစည်းကမ်းများ",

  "page.notfound.title": "စာမျက်နှာ မတွေ့ပါ",
  "page.notfound.body": "သင်ရှာနေသောစာမျက်နှာ မရှိပါ သို့မဟုတ် ရွှေ့ပြောင်းထားပါသည်။",

  "page.english_only": "ဤစာမျက်နှာကို အင်္ဂလိပ်ဘာသာဖြင့်သာ ရရှိနိုင်ပါသည်။",

  "seo.breadcrumb.home": "ပင်မစာမျက်နှာ",

  "seo.home.title": "Airhop — သီးသန့်၊ အွန်လိုင်းမလိုသော စာပို့အက်ပ်",
  "seo.home.description":
    "iOS နှင့် Android အတွက် စက်အချင်းချင်း တိုက်ရိုက် သီးသန့်စာပို့ခြင်း။ အင်တာနက်မလို၊ ဆာဗာမလို၊ အကောင့်မလို။ မည်သည့်နေရာတွင်မဆို Bluetooth mesh မှတစ်ဆင့် ဆက်သွယ်ပါ။",

  "seo.architecture.title": "ဖွဲ့စည်းပုံ — Airhop",
  "seo.architecture.description":
    "Airhop အပေါ်မှအောက်အထိ မည်သို့အလုပ်လုပ်သည်: အထောက်အထား၊ ပို့လွှတ်နည်းရွေးချယ်မှု၊ Bluetooth mesh၊ စာဝှက်ခြင်း၊ အင်တာနက်အလွှာ၊ Tor၊ အွန်လိုင်းမလိုသော ecash၊ စက်တွင်း AI နှင့် bitchat နှင့်တွဲသုံးနိုင်သော ပို့လွှတ်မှုပုံစံ။",
  "seo.architecture.breadcrumb": "ဖွဲ့စည်းပုံ",
  "seo.architecture.headline": "Airhop ဖွဲ့စည်းပုံ",
  "seo.architecture.summary":
    "Airhop ၏ နည်းပညာအပြည့်အစုံ ခွဲခြမ်းစိတ်ဖြာချက်: အထောက်အထား၊ ပို့လွှတ်နည်းများ၊ Bluetooth mesh၊ စာဝှက်ခြင်း၊ Nostr အင်တာနက်အလွှာ၊ Tor၊ Cashu ပိုက်ဆံအိတ်၊ စက်တွင်း AI လက်ထောက်နှင့် ပို့လွှတ်မှုပုံစံ။",

  "seo.faq.title": "မေးလေ့ရှိသောမေးခွန်းများ — Airhop",
  "seo.faq.description":
    "Airhop ၏ Bluetooth mesh စာပို့ခြင်း၊ စာဝှက်ခြင်း၊ အွန်လိုင်းမလိုသောငွေပေးချေမှု၊ Nostr အင်တာနက်အလွှာနှင့် bitchat တွဲသုံးနိုင်မှုအကြောင်း အဖြေများ။",
  "seo.faq.breadcrumb": "မေးလေ့ရှိသောမေးခွန်းများ",

  "seo.blogs.title": "ဘလော့ — Airhop",
  "seo.blogs.description":
    "Mesh ကွန်ရက်၊ ကိုယ်ရေးလုံခြုံမှုနှင့် အွန်လိုင်းမလိုသောဆော့ဖ်ဝဲအကြောင်း ရေးသားချက်များ။",
  "seo.blogs.breadcrumb": "ဘလော့",

  "seo.brand.title": "အမှတ်တံဆိပ်အစုံ — Airhop",
  "seo.brand.description":
    "Airhop အမှတ်တံဆိပ်အစုံ: ပစ်ဆယ်ငှက်အမှတ်အသား၊ စာလုံးအမှတ်အသား၊ အရောင်နှင့် စာလုံးတိုကင်များ၊ သတင်းမီဒီယာပစ္စည်းများနှင့် အသင့်သုံးစာသားများ။",
  "seo.brand.breadcrumb": "အမှတ်တံဆိပ်အစုံ",

  "seo.privacy.title": "ကိုယ်ရေးလုံခြုံမှုမူဝါဒ — Airhop",
  "seo.privacy.description":
    "Airhop က ဒေတာကို မည်သို့ကိုင်တွယ်သနည်း: အကောင့်မရှိ၊ ဆာဗာမရှိ၊ ခြေရာခံမှုမရှိ။ သင့်အထောက်အထားနှင့် စာများသည် သင့်စက်ပေါ်တွင်သာ ရှိနေသည်။",
  "seo.privacy.breadcrumb": "ကိုယ်ရေးလုံခြုံမှုမူဝါဒ",

  "seo.terms.title": "ဝန်ဆောင်မှုစည်းကမ်းများ — Airhop",
  "seo.terms.description": "Airhop အက်ပ်နှင့် ဝဘ်ဆိုက်အသုံးပြုမှုကို ထိန်းညှိသော စည်းကမ်းများ။",
  "seo.terms.breadcrumb": "ဝန်ဆောင်မှုစည်းကမ်းများ",

  "seo.notfound.title": "စာမျက်နှာ မတွေ့ပါ — Airhop",
  "seo.notfound.description": "သင်ရှာနေသောစာမျက်နှာ မရှိပါ သို့မဟုတ် ရွှေ့ပြောင်းထားပါသည်။",
};

const plurals: Plurals = {
  "home.map.relays": {
    other: "ရီလေ {count} ခု",
  },
  "home.map.locations": {
    other: "နေရာ {count} ခု",
  },
};

export const locale: Locale = { strings, plurals };
