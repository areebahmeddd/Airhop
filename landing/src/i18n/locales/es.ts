import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Volver al inicio",
  "common.last_updated": "Última actualización: {date}",

  "nav.aria": "Principal",
  "nav.home": "Inicio de Airhop",
  "nav.skip": "Ir al contenido",
  "nav.menu.open": "Abrir menú",
  "nav.menu.close": "Cerrar menú",
  "nav.how_it_works": "Cómo funciona",
  "nav.architecture": "Arquitectura",
  "nav.faq": "Preguntas frecuentes",

  "footer.aria": "Pie de página",
  "footer.tagline": "Comunicación mesh privada",
  "footer.credit": "© Hecho con {heart} por {author}",
  "footer.group.download": "Descargar",
  "footer.group.resources": "Recursos",
  "footer.group.social": "Redes",
  "footer.group.legal": "Legal",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.zapstore": "Zapstore",
  "footer.link.architecture": "Arquitectura",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "Preguntas frecuentes",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Términos del servicio",
  "footer.link.privacy": "Política de privacidad",
  "footer.link.license": "Licencia del proyecto",

  "settings.theme.group": "Tema de color",
  "settings.theme.light": "Tema claro",
  "settings.theme.dark": "Tema oscuro",
  "settings.language.label": "Idioma",
  "settings.language.suggestion": "Ver esta página en español",
  "settings.language.dismiss": "Cerrar",

  "home.hero.release": "Última versión",
  "home.hero.title": "Mensajería que funciona sin internet.",
  "home.hero.body":
    "Los teléfonos cercanos forman una red mesh por Bluetooth y retransmiten tus mensajes, cifrados de extremo a extremo. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Sin servidores",
  "home.hero.body.no_accounts": "sin cuentas",
  "home.hero.body.no_tracking": "sin rastreo",
  "home.hero.download": "Descargar la app",
  "home.hero.badges": "Licencia MIT · Libre y de código abierto · Compatible con bitchat",
  "home.hero.group.mobile": "Móvil",
  "home.hero.group.desktop": "Escritorio",
  "home.hero.option.zapstore": "Firmado en Nostr",
  "home.hero.option.apk": "Descarga directa",
  "home.hero.option.soon": "Próximamente",

  "home.about.eyebrow": "Qué es Airhop",
  "home.about.title": "Casi todas las apps dependen de un servidor central.",
  "home.about.sub":
    "Un servidor se puede vigilar, apagar o bloquear. Airhop no tiene ninguno, así que no hay empresa a la que presionar ni servicio que cerrar.",
  "home.about.card": "Resumen técnico",
  "home.about.link.mesh": "red mesh de Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protocolo de transmisión",
  "home.about.body.built":
    "Airhop es una app de código abierto para iOS y Android de mensajería privada entre pares sobre {mesh}. Está construida sobre la base de {bitchat}, reutilizando su {wire_protocol} y su modelo de seguridad, y ampliándolo con pagos {ecash} sin conexión e IA sin conexión. Funciona sin ninguna conexión a internet y los mensajes se retransmiten automáticamente entre dispositivos cercanos (unos 10 a 30 metros por salto en interiores, más al aire libre), hasta 7 saltos.",
  "home.about.body.identity":
    "Tu identidad es un par de claves {ed25519} generado en tu dispositivo y guardado en {ios_keychain} o {android_keystore}. No hay cuentas ni registros, y nada que toque ningún servidor, es decir, se puede usar como app desechable que no deja nada que apunte a ti una vez eliminada.",
  "home.about.body.crypto":
    "Cada sesión usa el protocolo {noise} para un handshake autenticado. Los mensajes almacenados usan el algoritmo {ratchet}, es decir, aunque tu dispositivo se vea comprometido más adelante, tus mensajes anteriores siguen siendo ilegibles. El borrado de pánico destruye todas las claves y mensajes en menos de un segundo.",
  "home.about.body.internet":
    "Cuando tú y un contacto estáis fuera del alcance de Bluetooth, los relés de {nostr} sirven de puente por internet, usando mensajes directos envueltos con el formato {nip17}, así que la red mesh se extiende globalmente siempre que ambos estéis en línea. También hay soporte de {tor} en iOS y Android, mediante {arti}, con puentes {obfs4} y {snowflake} para las redes que bloquean Tor.",
  "home.about.optional.title": "Airhop tiene funciones opcionales que puedes activar:",
  "home.about.optional.payments.label": "Pagos sin conexión:",
  "home.about.optional.payments.body":
    "Envía y recibe pagos por la red mesh usando el protocolo {cashu} (solo Bitcoin).",
  "home.about.optional.ai.label": "IA sin conexión:",
  "home.about.optional.ai.body":
    "Un pequeño asistente de IA en el dispositivo que responde preguntas importantes. Todo el procesamiento y los datos se quedan en tu dispositivo.",
  "home.about.body.compatible":
    "Airhop es compatible a nivel de protocolo con bitchat. Un dispositivo con Airhop y uno con bitchat en la misma red mesh se descubren automáticamente y pueden intercambiar mensajes y mensajes directos sin ninguna configuración.",

  "home.situations.eyebrow": "Cuándo lo necesitas",
  "home.situations.title": "Para el día en que la red se cae.",
  "home.situations.sub":
    "Desastres naturales, apagones de internet, protestas masivas o un fin de semana cualquiera fuera de cobertura.",
  "home.situations.disaster.label": "Desastre",
  "home.situations.disaster.line":
    "Las antenas están caídas. Un aviso en el tablón llega a quien pase por allí.",
  "home.situations.offgrid.label": "Sin cobertura",
  "home.situations.offgrid.line": "Dos días de ruta. La última raya de cobertura desapareció ayer.",
  "home.situations.protest.label": "Protesta",
  "home.situations.protest.line":
    "Un código QR en un panfleto abre un canal cifrado para la marcha.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Sin señal en el recinto. Los mensajes saltan entre los teléfonos de desconocidos.",

  "home.showcase.eyebrow": "Ver la app",
  "home.showcase.title": "Una mensajería normal, sin conexión.",
  "home.showcase.sub":
    "Chats, canales, una cartera y una identidad. Familiar por fuera, con una red mesh debajo haciendo el trabajo.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Todos los que están al alcance, colocados según lo cerca que estén. No hace falta añadir a nadie primero.",
  "home.showcase.mesh.alt":
    "La pantalla Mesh de la app Airhop, con cuatro pares cercanos colocados en un radar según la potencia de la señal.",
  "home.showcase.chats.title": "Chats",
  "home.showcase.chats.caption":
    "Conversaciones normales. Los teléfonos que pasan cada mensaje no pueden abrirlo.",
  "home.showcase.chats.alt":
    "Una conversación de mensaje directo en Airhop durante un apagón, retransmitida a través de tres teléfonos.",
  "home.showcase.channels.title": "Canales",
  "home.showcase.channels.caption":
    "Salas públicas tan pequeñas como una manzana o tan amplias como una región, abiertas a quien esté allí.",
  "home.showcase.channels.alt":
    "La pantalla de chats de la app Airhop, con canales públicos delimitados a una manzana, un barrio, una ciudad y una región.",
  "home.showcase.wallet.title": "Cartera",
  "home.showcase.wallet.caption":
    "Entrega ecash a quien tienes al lado por Bluetooth, sin que ninguno de los dos teléfonos esté en línea.",
  "home.showcase.wallet.alt":
    "La pantalla de cartera de la app Airhop, con un saldo de ecash que se puede enviar por Bluetooth.",
  "home.showcase.identity.title": "Identidad",
  "home.showcase.identity.caption":
    "Sin registro, sin número de teléfono, sin correo. Solo una clave que nunca sale de este teléfono.",
  "home.showcase.identity.alt":
    "La pantalla de perfil de la app Airhop, con una identidad generada en el dispositivo y sin cuenta.",

  "home.how.eyebrow": "Cómo funciona",
  "home.how.title": "La red mesh se forma sola.",
  "home.how.sub":
    "Los nodos cercanos forman una red mesh que se repara sola por Bluetooth. Cuando hay internet, los relés de Nostr la extienden, sin infraestructura que nadie controle.",
  "home.how.cta": "Leer la arquitectura completa",
  "home.how.discover.title": "Descubrir",
  "home.how.discover.line":
    "Los teléfonos con Airhop o bitchat se encuentran automáticamente por Bluetooth. Sin emparejar, sin configurar.",
  "home.how.relay.title": "Retransmitir",
  "home.how.relay.line":
    "Un mensaje salta de teléfono en teléfono, hasta siete saltos. Los teléfonos intermedios nunca ven lo que transportan.",
  "home.how.reach.title": "Llegar más lejos",
  "home.how.reach.line":
    "Cuando hay internet, los relés de Nostr llevan la misma conversación más lejos, opcionalmente a través de Tor.",
  "home.how.swipe": "desliza para explorar",
  "home.how.diagram": "Red mesh BLE · red local entre pares",
  "home.how.legend.node": "Nodo de la red mesh BLE (sin conexión)",
  "home.how.legend.relay": "Retransmisión multisalto (cifrada con Noise XX)",
  "home.how.legend.bitchat": "Compatible con bitchat en la misma red mesh",
  "home.how.legend.nostr": "Puente Nostr (internet, cuando hay conexión)",

  "home.map.aria": "Mapa mundial de las ubicaciones de los relés Nostr",
  "home.map.summary": "Puente Nostr · {relays} en {locations} de todo el mundo",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "Qué hace",
  "home.features.title": "Una mensajería de verdad, no una demo.",
  "home.features.sub":
    "Chat, identidad, red y dinero. Todo construido para funcionar sin señal, sin cuenta y sin nada en medio.",

  "home.features.messaging.title": "Mensajería",
  "home.features.messaging.summary":
    "Todo lo que tiene una app de mensajería, con cero infraestructura detrás.",
  "home.features.messaging.dms.name": "Mensajes directos privados",
  "home.features.messaging.dms.line":
    "Cifrados de extremo a extremo, con confirmación de entrega y de lectura.",
  "home.features.messaging.location.name": "Canales por ubicación",
  "home.features.messaging.location.line":
    "Salas ligadas a un lugar, desde una manzana hasta una región.",
  "home.features.messaging.groups.name": "Canales y grupos privados",
  "home.features.messaging.groups.line":
    "Enlaces de invitación para una sala, o una lista firmada de hasta 16.",
  "home.features.messaging.board.name": "Tablón de anuncios",
  "home.features.messaging.board.line":
    "Avisos fijados a una zona durante un máximo de siete días.",
  "home.features.messaging.voice.name": "Voz en directo",
  "home.features.messaging.voice.line":
    "Mantén pulsado el micro y habla con quien esté al alcance, estilo walkie-talkie.",
  "home.features.messaging.notes.name": "Notas de voz",
  "home.features.messaging.notes.line": "Audio grabado, más rápido que escribir indicaciones.",
  "home.features.messaging.files.name": "Fotos, vídeo y archivos",
  "home.features.messaging.files.line": "Cualquier formato, hasta 1 MiB, sin necesidad de señal.",
  "home.features.messaging.forward.name": "Almacenar y reenviar",
  "home.features.messaging.forward.line":
    "Sellado y transportado por un teléfono cercano hasta que llega a su destino.",

  "home.features.identity.title": "Identidad",
  "home.features.identity.summary": "Nada que registrar, nada que incautar.",
  "home.features.identity.keys.name": "Identidad por par de claves",
  "home.features.identity.keys.line":
    "Creada en este teléfono, guardada en el llavero del sistema.",
  "home.features.identity.names.name": "Nombres legibles",
  "home.features.identity.names.line":
    "Derivados de tu clave, así nadie puede quedarse con el tuyo.",
  "home.features.identity.qr.name": "Contactos por QR",
  "home.features.identity.qr.line": "Un escaneo lleva sus claves, no solo su nombre.",
  "home.features.identity.panic.name": "Borrado de pánico",
  "home.features.identity.panic.line":
    "Todas las claves y mensajes destruidos en menos de un segundo.",

  "home.features.networking.title": "Red",
  "home.features.networking.summary": "Los teléfonos son la red.",
  "home.features.networking.mesh.name": "Red mesh por Bluetooth",
  "home.features.networking.mesh.line":
    "Sin internet, sin router, en teléfonos que la gente ya tiene.",
  "home.features.networking.bridge.name": "Puente mesh",
  "home.features.networking.bridge.line":
    "Conecta tu chat público con un grupo cercano fuera de alcance.",
  "home.features.networking.wifi.name": "Vía rápida WiFi",
  "home.features.networking.wifi.line":
    "Transferencias más rápidas entre dos Android o dos iPhone.",
  "home.features.networking.bitchat.name": "Compatible con bitchat",
  "home.features.networking.bitchat.line":
    "Ambas apps se unen a la misma red mesh sin configurar nada.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Una extensión, nunca un requisito.",
  "home.features.internet.nostr.name": "Respaldo por Nostr",
  "home.features.internet.nostr.line":
    "Los mensajes directos y los canales por ubicación siguen fluyendo más allá del alcance de radio.",
  "home.features.internet.relays.name": "Descubrimiento de georelés",
  "home.features.internet.relays.line":
    "Más de 300 relés públicos independientes, ninguno nuestro.",
  "home.features.internet.gateway.name": "Pasarela a internet",
  "home.features.internet.gateway.line":
    "Presta tu conexión para que un teléfono cercano sin conexión llegue a los canales por ubicación.",
  "home.features.internet.tor.name": "Integración con Tor",
  "home.features.internet.tor.line":
    "Enrutado en ambas plataformas, así los relés nunca ven tu IP.",

  "home.features.optional.title": "Opcional",
  "home.features.optional.summary": "Desactivado por defecto. Activo cuando tú quieras.",
  "home.features.optional.cashu.name": "Ecash con Cashu",
  "home.features.optional.cashu.line":
    "Paga a quien tienes al lado sin que ningún teléfono esté en línea.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Recarga o retira en bitcoin por la red Lightning.",
  "home.features.optional.ai.name": "IA local",
  "home.features.optional.ai.line": "Respuestas en el dispositivo, nada sale del teléfono.",
  "home.features.optional.social.name": "Puentes sociales",
  "home.features.optional.social.line": "Bluesky y Mastodon con la misma identidad.",

  "home.compare.eyebrow": "Cómo se compara",
  "home.compare.title": "Sin conexión, sin hardware y abierta.",
  "home.compare.sub":
    "Cada app de aquí es buena en algo. Solo algunas siguen funcionando cuando la red no lo hace.",
  "home.compare.col.project": "Proyecto",
  "home.compare.col.transport": "Transporte",
  "home.compare.col.encryption": "Cifrado",
  "home.compare.col.offline": "Funciona sin conexión",
  "home.compare.col.hardware_free": "Sin hardware extra",
  "home.compare.col.open_source": "Código abierto",
  "home.compare.mark.yes": "Sí",
  "home.compare.mark.no": "No",
  "home.compare.mark.partial": "Parcial, los clientes son de código abierto, los servidores no",
  "home.compare.mark.partial_hint": "Los clientes son de código abierto, los servidores no",
  "home.compare.transport.servers": "Servidores centralizados",
  "home.compare.transport.onion": "Enrutado cebolla (nodos de servicio)",
  "home.compare.transport.nostr": "Relés Nostr",
  "home.compare.transport.lora": "Radio LoRa",
  "home.compare.transport.sub_ghz": "Radio sub-GHz propietaria",

  "home.explore.eyebrow": "Abierto y honesto",
  "home.explore.title": "Todo lo que decimos aquí se puede comprobar.",
  "home.explore.sub":
    "El código, el protocolo y los planes son públicos. Las limitaciones también. Compruébalo tú mismo antes de creernos.",
  "home.explore.audit.chip": "Auditoría pendiente",
  "home.explore.audit.headline": "Airhop aún no ha pasado una auditoría de seguridad externa.",
  "home.explore.audit.body":
    "{headline} Todo el código se revisa personalmente y se pasa por un {review} antes de publicarlo, y la biblioteca criptográfica que usa está auditada por Cure53, pero eso no sustituye a una auditoría formal de la app en sí. Hay una prevista para {version}. No confíes en ella para casos de uso sensibles hasta entonces.",
  "home.explore.audit.link.review": "agente de revisión de seguridad",
  "home.explore.source.title": "Código fuente",
  "home.explore.source.desc":
    "Todo en GitHub bajo licencia MIT. Issues, pull requests y discusiones abiertas.",
  "home.explore.protocol.title": "Especificación del protocolo",
  "home.explore.protocol.desc":
    "El formato exacto de transmisión, los UUID de BLE y las constantes, compartidos con bitchat.",
  "home.explore.architecture.title": "Arquitectura",
  "home.explore.architecture.desc":
    "El desglose técnico completo, desde pulsar enviar hasta los bytes en la radio.",
  "home.explore.roadmap.title": "Hoja de ruta",
  "home.explore.roadmap.desc":
    "Objetivos por versión, de la v0.5.0 a la v2.0.0, incluida la auditoría prevista.",
  "home.explore.vision.title": "Visión",
  "home.explore.vision.desc": "Por qué existe Airhop y los principios que no cambian bajo presión.",
  "home.explore.brand.title": "Kit de marca",
  "home.explore.brand.desc":
    "El pájaro de píxeles, los tokens de color y tipografía, recursos de prensa y textos base.",

  "home.contribute.eyebrow": "Apoya este proyecto",
  "home.contribute.title": "Independiente y a la vista de todos.",
  "home.contribute.sub":
    "No hay inversores, ni anuncios, ni versión de pago. Todas las funciones siguen siendo gratuitas de todos modos, y el trabajo lo financia la gente que lo encuentra útil.",
  "home.contribute.contribute.chip": "Contribuir",
  "home.contribute.contribute.body":
    "Dale una estrella al repositorio, abre issues y envía pull requests. Los informes de errores, las propuestas de funciones y las contribuciones de código son bienvenidos.",
  "home.contribute.contribute.cta": "Ver en GitHub",
  "home.contribute.sponsor.chip": "Patrocinar",
  "home.contribute.sponsor.body":
    "Si Airhop te resulta útil, una donación puntual o un patrocinio recurrente ayuda mucho a mantener el desarrollo activo.",
  "home.contribute.sponsor.donate": "Donar una vez",
  "home.contribute.sponsor.github": "Patrocinar en GitHub",

  "page.architecture.eyebrow": "Documentación",
  "page.architecture.title": "Arquitectura",
  "page.architecture.toc": "En esta página",

  "page.faq.eyebrow": "Preguntas frecuentes",
  "page.faq.title": "Preguntas frecuentes",
  "page.faq.meta": "Dudas habituales sobre Airhop.",
  "page.faq.contact":
    "Las preguntas que no se respondan aquí se pueden enviar a {email} o plantear abriendo una discusión en {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Próximamente",
  "page.blogs.body": "Artículos sobre redes mesh, privacidad y software offline-first.",

  "page.brand.eyebrow": "Marca",
  "page.brand.title": "Kit de marca",
  "page.brand.meta":
    "Recursos y reglas para usar Airhop en un artículo, una ficha de tienda, una charla o un README. De uso libre como referencia y para prensa.",

  "page.legal.eyebrow": "Legal",
  "page.privacy.title": "Política de privacidad",
  "page.terms.title": "Términos del servicio",

  "page.notfound.title": "Página no encontrada",
  "page.notfound.body": "La página que buscas no existe o se ha movido.",

  "page.english_only": "Esta página solo está disponible en inglés.",

  "seo.breadcrumb.home": "Inicio",

  "seo.home.title": "Airhop — Mensajería privada y offline-first",
  "seo.home.description":
    "Mensajería privada entre pares para iOS y Android. Sin internet, sin servidores, sin cuentas. Comunícate por red mesh Bluetooth en cualquier lugar.",

  "seo.architecture.title": "Arquitectura — Airhop",
  "seo.architecture.description":
    "Cómo funciona Airhop, de arriba abajo: identidad, selección de transporte, la red mesh Bluetooth, el cifrado, la capa de internet, Tor, ecash sin conexión, IA en el dispositivo y el formato de transmisión compatible con bitchat.",
  "seo.architecture.breadcrumb": "Arquitectura",
  "seo.architecture.headline": "Arquitectura de Airhop",
  "seo.architecture.summary":
    "Un desglose técnico completo de Airhop: identidad, transportes, la red mesh Bluetooth, el cifrado, la capa de internet Nostr, Tor, la cartera Cashu, el asistente de IA en el dispositivo y el formato de transmisión.",

  "seo.faq.title": "Preguntas frecuentes — Airhop",
  "seo.faq.description":
    "Respuestas sobre la mensajería por red mesh Bluetooth de Airhop, el cifrado, los pagos sin conexión, la capa de internet Nostr y la compatibilidad con bitchat.",
  "seo.faq.breadcrumb": "Preguntas frecuentes",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Artículos sobre redes mesh, privacidad y software offline-first.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Kit de marca — Airhop",
  "seo.brand.description":
    "El kit de marca de Airhop: el pájaro de píxeles, el logotipo, los tokens de color y tipografía, recursos de prensa y textos base.",
  "seo.brand.breadcrumb": "Kit de marca",

  "seo.privacy.title": "Política de privacidad — Airhop",
  "seo.privacy.description":
    "Cómo trata Airhop los datos: sin cuentas, sin servidores, sin rastreo. Tu identidad y tus mensajes se quedan en tu dispositivo.",
  "seo.privacy.breadcrumb": "Política de privacidad",

  "seo.terms.title": "Términos del servicio — Airhop",
  "seo.terms.description": "Términos que rigen el uso de la app y el sitio web de Airhop.",
  "seo.terms.breadcrumb": "Términos del servicio",

  "seo.notfound.title": "Página no encontrada — Airhop",
  "seo.notfound.description": "La página que buscas no existe o se ha movido.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} relé",
    other: "{count} relés",
  },
  "home.map.locations": {
    one: "{count} ubicación",
    other: "{count} ubicaciones",
  },
};

export const locale: Locale = { strings, plurals };
