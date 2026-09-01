// es: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Cancelar",
  "common.done": "Listo",
  "common.ok": "Aceptar",
  "common.close": "Cerrar",
  "common.back": "Atrás",
  "common.delete": "Eliminar",
  "common.remove": "Quitar",
  "common.add": "Añadir",
  "common.copy": "Copiar",
  "common.copied": "Copiado",
  "common.share": "Compartir",
  "common.continue": "Continuar",
  "common.try_again": "Inténtalo de nuevo",
  "common.settings": "Ajustes",
  "common.off": "Desactivado",

  // ---- Dates ----
  "format.today": "Hoy",
  "format.yesterday": "Ayer",
  "format.minutes_ago": "hace {count} min",
  "format.hours_ago": "hace {count} h",
  "format.days_ago": "hace {count} d",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Chats",
  "nav.tab.mesh": "Malla",
  "nav.tab.wallet": "Cartera",
  "nav.tab.profile": "Tú",
  "a11y.tab.new_peers": "{label}, alguien nuevo cerca",
  "nav.notifications": "Notificaciones",
  "chat.subtab.channels": "Canales",
  "chat.subtab.direct": "Directos",
  "chat.subtab.dms": "Mensajes directos",
  "chat.search.placeholder": "Buscar en los chats…",
  "chat.search.a11y": "Buscar en chats y mensajes",
  "chat.search.close": "Cerrar la búsqueda",
  "chat.search.clear": "Borrar la búsqueda",
  "mesh.view.radar": "Vista de radar",
  "mesh.view.list": "Vista de lista",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Lista",

  // ---- Legal document names ----
  "legal.last_updated": "Última actualización: {date}",
  "legal.terms": "Términos del servicio",
  "legal.privacy": "Política de privacidad",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Comunicación privada en malla",
  "onboarding.welcome.cta": "Empezar",
  "onboarding.welcome.cta_hint": "Acepta los términos de abajo para continuar",
  "onboarding.welcome.consent_a11y":
    "Aceptar los Términos del servicio y la Política de privacidad",
  "onboarding.welcome.open_terms": "Abrir los Términos del servicio",
  "onboarding.welcome.open_privacy": "Abrir la Política de privacidad",
  "onboarding.welcome.consent":
    "Al tocar {cta}, aceptas nuestros {terms} y nuestra {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Generando tu identidad",
  "onboarding.identity.body":
    "Creando un par de claves Ed25519 en este dispositivo.\nNo se envía nada a ninguna parte.",
  "onboarding.identity.failed_heading": "No se pudieron crear tus claves",
  "onboarding.identity.failed_body":
    "Este dispositivo no dejó que Airhop las guardara de forma segura. Inténtalo de nuevo o reinicia el teléfono y vuelve a abrir Airhop.",
  "onboarding.identity.steps_a11y": "Pasos: {steps}",
  "onboarding.identity.step.x25519":
    "Generando el par de claves estáticas X25519",
  "onboarding.identity.step.ed25519":
    "Generando el par de claves de firma Ed25519",
  "onboarding.identity.step.keychain":
    "Guardando las claves en el llavero del sistema",
  "onboarding.identity.step.peer_id": "Derivando el ID de par",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Tu nombre en la malla",
  "onboarding.username.peer_id": "ID de par",
  "onboarding.username.card_a11y":
    "Tu nombre en la malla es {username}. ID de par {peerID}. {props}.",
  "onboarding.username.explanation":
    "Este nombre de usuario se deriva de forma determinista de tu clave pública. Es el mismo en todos los dispositivos que vean tu ID de par.",
  "onboarding.username.cta": "Entrar en Airhop",
  "onboarding.username.prop.algorithm": "Algoritmo",
  "onboarding.username.prop.storage": "Almacenamiento",
  "onboarding.username.prop.storage_value": "Solo el llavero del sistema",
  "onboarding.username.prop.account": "Cuenta necesaria",
  "onboarding.username.prop.account_value": "Ninguna",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Te damos la bienvenida a Airhop",
  "onboarding.hello.p1":
    "Hola. Airhop está construido sobre bitchat como un proyecto paralelo independiente y de código abierto. No está afiliado ni respaldado por el proyecto bitchat ni por permissionless tech; simplemente es algo que disfruto construyendo y compartiendo con la comunidad.",
  "onboarding.hello.p2":
    "Esta es la primera versión para iOS y Android, así que aunque la he probado con amigos, seguramente te encuentres con algún fallo. Si es así, o si tienes una idea para una función, me encantaría saberlo. Abre una incidencia en {github} o escríbeme a {email}.",
  "onboarding.hello.p3":
    "Si Airhop te resulta útil, plantéate dejar una estrella en {github} o una reseña en {store}. Ayuda a que más gente descubra el proyecto. ¡Gracias por probarlo!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Antes de que tu teléfono pregunte",
  "onboarding.primer.lede":
    "Esto es lo que hace cada permiso, y lo que no hace.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Encuentra dispositivos cercanos y retransmite mensajes entre ellos. Así se crea la malla, y funciona sin conexión a internet.",
  "onboarding.primer.location.title": "Ubicación",
  "onboarding.primer.location.body":
    "Te sitúa en los canales de las zonas cercanas, desde una manzana hasta una región. Airhop nunca te rastrea ni envía tu ubicación exacta fuera del dispositivo.",
  "onboarding.primer.notifications.title": "Notificaciones",
  "onboarding.primer.notifications.body":
    "Recibe avisos de mensajes nuevos incluso con la app cerrada. Las notificaciones se crean en tu dispositivo, sin que intervenga ningún servidor.",
  "onboarding.primer.footnote":
    "Puedes decir que no. Los mensajes seguirán viajando por internet y podrás cambiar de opinión más adelante en los ajustes.",
  "onboarding.primer.cta_a11y": "Continuar a las solicitudes de permisos",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Acceso al Bluetooth",
  "permission.bluetooth.purpose": "descubrir dispositivos cercanos en la malla",
  "permission.open_settings": "Abrir ajustes",
  "permission.not_now": "Ahora no",
  "permission.blocked_title": "{label} está desactivado",
  "permission.blocked_body": "Actívalo en los ajustes para {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Algo ha salido mal",
  "error.boundary.body":
    "Airhop encontró un problema inesperado y tuvo que detener lo que estaba mostrando.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Canales predeterminados",
  "chat.channels.yours": "Tus canales",
  "chat.channels.none": "Todavía no hay canales",
  "chat.channels.none_hint":
    "Toca {plus} arriba para unirte a uno o crear uno.",
  "chat.channels.none_desc":
    "Todavía no hay canales. Usa el botón de añadir de la cabecera para unirte a uno o crear uno.",
  "chat.channels.show_fewer": "Mostrar menos canales predeterminados",
  "chat.channels.show_less": "Mostrar menos",
  "chat.channels.info": "Información del canal",
  "chat.channels.pin": "Fijar el canal",
  "chat.channels.unpin": "Dejar de fijar el canal",
  "chat.channels.mute": "Silenciar el canal",
  "chat.channels.unmute": "Dejar de silenciar el canal",
  "chat.channels.leave": "Salir del canal",
  "chat.channels.leave_confirm": "Salir",
  "chat.channels.clear_body":
    "¿Eliminar todos los mensajes de {name}? No se puede deshacer.",
  "chat.channels.leave_body":
    "¿Salir de {name}? Dejarás de recibir sus mensajes y su historial se borrará de este dispositivo.",
  "chat.channels.more_options": "Más opciones para {name}",
  "chat.channels.teleported_tag": "{level}  ·  teletransportado",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Vaciar el chat",
  "chat.dm.remove_contact": "Quitar el contacto",
  "chat.dm.block": "Bloquear a este par",
  "chat.dm.block_confirm": "Bloquear",
  "chat.dm.delete": "Eliminar el chat",
  "chat.dm.delete_body":
    "Esto quita la conversación de tu lista y elimina sus mensajes. El contacto se conserva, y un mensaje nuevo suyo iniciará un chat nuevo.",
  "chat.dm.in_range": "al alcance",
  "chat.dm.row_hint": "Toca dos veces y mantén para ver más opciones",
  "chat.channels.row_hint": "Toca dos veces y mantén para ver más opciones",
  "chat.dm.you_prefix": "Tú:",
  "chat.dm.none": "No hay mensajes directos",
  "chat.dm.none_desc":
    "Ve a la pestaña Malla y toca un par para empezar un mensaje directo cifrado.",
  "chat.dm.contact_info": "Información del contacto",
  "chat.dm.pin": "Fijar el chat",
  "chat.dm.unpin": "Dejar de fijar el chat",
  "chat.dm.mute": "Silenciar el chat",
  "chat.dm.unmute": "Dejar de silenciar el chat",
  "chat.dm.clear_body":
    "¿Eliminar todos los mensajes con {name}? No se puede deshacer.",
  "chat.dm.remove_contact_body":
    "¿Quitar a {name}? Esto elimina la conversación y olvida el contacto. Aún podrán llegar a ti si vuelven a escribirte.",
  "chat.dm.block_body":
    "¿Bloquear a {name}? No los verás en la pestaña Malla ni recibirás sus mensajes, aunque estén cerca.",
  "chat.dm.more_options": "Más opciones para {name}",
  "chat.dm.remove_contact_short": "Quitar el contacto",
  "chat.dm.block_short": "Bloquear el contacto",
  "chat.dm.delete_short": "Eliminar el chat",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Vaciar los mensajes",
  "chat.clear_confirm": "Vaciar",
  "chat.group_badge": "Grupo",
  "chat.more": "Más",
  "chat.no_messages": "Todavía no hay mensajes",
  "chat.you": "Tú",
  "chat.a11y.channel": "Canal {name}",
  "chat.a11y.group": "Grupo {name}",
  "chat.a11y.muted": "silenciado",
  "chat.a11y.pinned": "fijado",

  // ---- Chats: start something new ----
  "chat.new.title": "Empezar algo nuevo",
  "chat.new.channel": "Crear un canal privado",
  "chat.new.channel_label": "Canal privado",
  "chat.new.channel_desc":
    "Una sala a la que puede unirse cualquiera con el enlace. Crea una o únete con un enlace que te hayan enviado.",
  "chat.new.group": "Crear un grupo privado",
  "chat.new.group_label": "Grupo privado",
  "chat.new.group_desc":
    "Elige personas concretas. Hasta 16. Se queda en Bluetooth.",
  "chat.new.place": "Ir a un lugar por geohash",
  "chat.new.place_label": "Ir a un lugar",
  "chat.new.place_desc":
    "Abre el canal de ubicación de cualquier sitio por su geohash.",
  "chat.new.reach": "Alcance",
  "chat.new.reach_internet":
    "Llega a los miembros por Bluetooth y por internet.",
  "chat.new.reach_mesh": "Funciona al alcance del Bluetooth, no por internet.",
  "chat.new.reach_internet_desc":
    "También llega a los miembros por internet. Los relés pueden ver que el canal está activo, nunca sus mensajes ni quién está en él.",
  "chat.new.reach_mesh_desc":
    "Se queda en la malla local. Lo más privado; nada sale del alcance del Bluetooth.",
  "chat.new.join_link": "Unirse a un canal privado con un enlace de invitación",
  "chat.new.back_to_chooser": "Volver a la selección",
  "chat.new.create_channel": "Crear el canal",
  "chat.new.name_required": "Introduce antes un nombre de canal",
  "chat.new.name_taken": "Ese nombre ya está ocupado",
  "chat.new.create": "Crear",
  "chat.new.e2ee":
    "Cifrado de extremo a extremo. Solo los miembros pueden leer los mensajes.",
  "chat.new.invite_only":
    "Solo por invitación. Puede unirse cualquiera con quien compartas el enlace. Permanece oculto para el resto, incluso para los pares cercanos.",
  "chat.new.name_exists": "Ya existe un canal con este nombre.",
  "chat.new.reach_bluetooth_chip": "Solo Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Unirse con un enlace de invitación",

  // ---- Chats: join by link ----
  "chat.join.title": "Unirse con un enlace",
  "chat.join.not_airhop": "Ese no es un enlace de Airhop.",
  "chat.join.reach_internet":
    "Llega a los miembros por Bluetooth y por internet.",
  "chat.join.reach_mesh": "Se queda al alcance del Bluetooth.",
  "chat.join.contact_card":
    "Una tarjeta de contacto. Los añade a tus contactos y abre el chat.",
  "chat.join.unverified": "No se pudo verificar ese enlace",
  "chat.join.unverified_body":
    "La tarjeta de contacto no coincide con sus propias claves, así que no se añadió. Pídeles que envíen una nueva.",
  "chat.join.paste": "Pegar del portapapeles",
  "chat.join.join": "Unirse",
  "chat.join.public_channel":
    "Canal público {name}. Puede leerlo cualquiera que esté cerca.",
  "chat.join.private_channel": "Canal privado {name}. {reach}",
  "chat.join.dm_with": "Mensaje directo con {name}.",
  "chat.join.joined_as": "Te has unido como {name}",
  "chat.join.name_clash_body":
    "Ya estás en otro {name} distinto. Los nombres de canal son solo etiquetas, así que esta invitación abrió su propio canal y el que ya tenías queda intacto. Puedes renombrar cualquiera de los dos desde su información de canal.",
  "chat.join.paste_hint":
    "Pega una invitación que empiece por airhop://. Tocar una también funciona; esto es para un enlace que no puedes tocar.",
  "chat.join.key_note":
    "La invitación a un canal privado lleva la clave, así que unirse es inmediato y no se le pide nada a nadie más.",
  "chat.join.offline_note":
    "Funciona sin conexión. El enlace se lee en este dispositivo, y el canal llega hasta donde lo configurara quien lo creó.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "No se pudo abrir esa celda. Inténtalo dentro de un momento.",
  "chat.jump.title": "Ir a un lugar",
  "chat.jump.saved": "LUGARES GUARDADOS",
  "chat.jump.anywhere":
    "Abre un canal de ubicación público de cualquier sitio, incluso de uno en el que no estés.",
  "chat.jump.geohash_note":
    "Introduce su geohash. Todo el que esté dentro de esa celda comparte el canal.",
  "chat.jump.teleport_note":
    "Apareces como teletransportado, no como cercano. Solo llega por internet.",
  "chat.jump.level_cell": "Celda de {level}",
  "chat.jump.already_here": "Ya estás aquí. Ir abre tu canal {name}.",
  "chat.jump.open_direction": "Abrir la celda al {direction}",
  "chat.jump.open_place": "Abrir {name}",
  "chat.jump.remove_place": "Quitar {name} de los lugares guardados",
  "chat.jump.go": "Ir",
  "chat.jump.how":
    "Para encontrar un geohash: abre un canal de ubicación > toca su nombre > cópialo de ahí.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "No se pudo llegar a todos los miembros. Inténtalo cuando estén cerca.",
  "chat.group.you_were_added": "Te han añadido a {name}.",
  "chat.group.added_you": "Te añadió a {name}",
  "chat.group.you_were_removed":
    "Te han quitado de {name}. Ya no puedes leer ni enviar mensajes aquí.",
  "chat.group.removed_you": "Te quitó de {name}",
  "chat.group.add_failed": "No se pudo añadirlos",
  "chat.group.add_failed_body":
    "No ha cambiado nada. O no se puede contactar con ellos ahora, o el grupo está lleno con 16, o no eres quien lo creó.",
  "chat.group.remove_failed": "No se pudo quitarlos",
  "chat.group.remove_failed_body":
    "No ha cambiado nada. Solo quien creó el grupo puede cambiar quién está en él.",
  "chat.group.e2ee":
    "Cifrado de extremo a extremo. Solo los miembros pueden leer los mensajes.",
  "chat.group.cap":
    "Hasta 16 personas, elegidas por ti. No hay enlace de invitación, así que nadie entra por reenvío.",
  "chat.group.bluetooth":
    "Solo Bluetooth. Los miembros fuera de alcance reciben los mensajes cuando vuelven.",
  "chat.group.members_label": "MIEMBROS",
  "chat.group.none_in_range":
    "No hay nadie al alcance. Los miembros deben estar cerca cuando creas el grupo.",
  "chat.group.create_title": "Crear un grupo",
  "chat.group.name_placeholder": "Nombre del grupo",
  "chat.group.create": "Crear",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Malla local · solo Bluetooth",
  "chat.scope.mesh_desc":
    "Llega a los dispositivos al alcance del Bluetooth (entre 10 y 100 metros aproximadamente). No requiere internet. Ideal para coordinarse sobre el terreno.",
  "chat.scope.block": "Manzana · ~100 m",
  "chat.scope.block_desc":
    "Cobertura a nivel de manzana. Los mensajes se enlazan por internet para que también participen pares cercanos que estén fuera del alcance del Bluetooth.",
  "chat.scope.neighborhood": "Barrio · ~1 km",
  "chat.scope.neighborhood_desc":
    "Cobertura de barrio. Con ayuda de relés, se llega a pares de toda la zona incluso sin un enlace Bluetooth directo.",
  "chat.scope.city": "Ciudad · ~10 km",
  "chat.scope.city_desc":
    "Canal para toda la ciudad. Usa relés de internet geolocalizados para llegar a pares de toda el área metropolitana.",
  "chat.scope.province": "Provincia o comunidad · ~100 km",
  "chat.scope.province_desc":
    "Cobertura provincial o autonómica. Enlazada por internet para un alcance regional de cientos de kilómetros.",
  "chat.scope.country": "País o región · ~1000 km",
  "chat.scope.country_desc":
    "Cobertura de todo el país. Cualquier usuario de Airhop o bitchat de la región puede unirse y leer los mensajes.",
  "chat.transport.bluetooth": "Solo Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Solo internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Comando /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Manda un abrazo",
  "chat.cmd.slap_hint": "Da un tortazo con una trucha grande",
  "chat.status.sending": "Enviando…",
  "chat.status.undo_send": "Deshacer el envío",
  "chat.status.undo": "Deshacer",
  "chat.status.sent": "Enviado",
  "chat.status.received": "Recibido",
  "chat.status.failed": "Fallido",
  "chat.status.canceled": "Cancelado",
  "chat.status.waiting": "Esperando",
  "chat.status.sending_short": "Enviando",
  "chat.status.receiving": "Recibiendo",
  "chat.thread.not_available": "No disponible aquí",
  "chat.thread.private_channel": "Canal privado",
  "chat.thread.location_channel": "Canal de ubicación",
  "chat.thread.public_channel": "Canal público",
  "chat.thread.notices": "Avisos de este canal",
  "chat.thread.invite": "Invitar a alguien a este canal",
  "chat.thread.not_in_range":
    "Fuera del alcance del Bluetooth. Entregando por internet.",
  "chat.thread.not_nearby":
    "No está cerca. Lo entregaremos cuando vuelva al alcance o se conecte.",
  "chat.thread.no_keys":
    "Tendrás que estar al alcance del Bluetooth, o escanear su código, para escribirles.",
  "chat.geo.card_received":
    "{name} ha compartido su contacto. Comparte el tuyo para seguir hablando después de que cualquiera de los dos se mueva.",
  "chat.geo.exchange_complete":
    "Contactos intercambiados. Ya podéis localizaros desde cualquier sitio.",
  "chat.geo.keep_person": "Conservar a esta persona",
  "chat.geo.keep_person_desc":
    "Comparte tu contacto para seguir hablando después de que cualquiera de los dos se mueva. Conocerán tu identidad permanente.",
  "chat.geo.card_sent": "Compartido · esperando el suyo",
  "chat.thread.left_cell":
    "Has salido de esta zona, así que no pueden localizarte aquí. Intercambiad códigos para seguir hablando desde cualquier sitio.",
  "chat.thread.no_route":
    "Ahora mismo no se puede llegar a ellos. El mensaje se enviará cuando haya una ruta disponible.",
  "chat.thread.empty": "Todavía no hay mensajes",
  "chat.thread.empty_desc": "Empieza una conversación cifrada.",
  "chat.thread.jump_latest": "Ir al último mensaje",
  "chat.thread.back_to_members": "Volver a los miembros",
  "chat.thread.nostr_key": "Clave pública de Nostr",
  "chat.thread.in_range": "Al alcance",
  "chat.voice.not_recorded": "La nota de voz no se grabó",
  "chat.thread.message": "Mensaje",
  "chat.thread.message_placeholder": "Mensaje…",
  "chat.thread.length_full": "El mensaje está lleno",
  "chat.thread.waiting_for": "Esperando a que vuelva {name} · {percent} %",
  "chat.thread.peer": "par",
  "chat.thread.cancel_transfer": "Cancelar {name}",
  "chat.thread.queued_more": "{count} más esperando para enviarse",
  "chat.thread.across_bridge": "{count} al otro lado del puente",
  "chat.thread.bridged": "enlazado",
  "chat.thread.invite_body":
    "Únete a mí en {channel} en Airhop — mensajería en malla privada y con prioridad sin conexión.",
  "chat.thread.go_back_unread": "Volver, {count} sin leer",
  "chat.thread.view_info": "Ver la información de {name}",
  "chat.thread.notices_new": "Avisos de este canal, {count} nuevos",
  "chat.thread.say_something": "Di algo en {channel}.",
  "chat.thread.jump_latest_new": "Ir al último mensaje, {count} nuevos",
  "chat.thread.unconfirmed_since": "Sin entregas confirmadas desde el {date}",
  "chat.thread.no_reach": "No hay pares cerca · nadie lo ha recibido todavía",
  "chat.thread.channel_needs_internet":
    "Internet desactivado · este canal solo llega a quien esté al alcance del Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet desactivado · a esta celda solo se llega por internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet desactivado · esta conversación viaja solo por internet",
  "chat.thread.via_gateway":
    "Internet desactivado · un dispositivo cercano lo está llevando en línea por ti",
  "chat.thread.group_queued":
    "Todavía no hay nadie de este grupo cerca. Les llegará cuando lo estén.",
  "chat.thread.no_group_key":
    "Ya no estás en este grupo, así que esto no se puede enviar",
  "chat.thread.no_reach_offline":
    "Internet desactivado y sin pares cerca · nadie lo ha recibido todavía",
  "chat.thread.mention": "Mencionar a {name}",
  "chat.thread.someone_talking": "{hold}. {name} está hablando.",
  "chat.thread.attach_note":
    "Los archivos solo se envían al alcance del Bluetooth. El texto y los pagos llegan a los contactos por internet; los adjuntos no.",
  "chat.thread.message_peer": "Escribir a {name}",
  "chat.thread.send": "Enviar el mensaje",
  "chat.thread.group": "Grupo",
  "chat.bridge.nearby_only":
    "Solo cerca: mantén este mensaje fuera del puente de malla",
  "chat.bridge.nearby_label": "Solo cerca · se queda en Bluetooth",
  "chat.bridge.bridging_label":
    "Enlazando con zonas cercanas · toca para solo cerca",
  "chat.screenshot.you_took": "Has hecho una captura de pantalla",
  "chat.screenshot.you_took_private":
    "Has hecho una captura de pantalla · no se avisó a nadie",
  "chat.screenshot.heads_up": "Atención",
  "chat.screenshot.notice": "* {name} ha hecho una captura de pantalla *",
  "chat.screenshot.notified_dm":
    "Se avisó a {name} de que hiciste una captura de esta conversación.",
  "chat.screenshot.notified":
    "Se avisó a todos los de este canal de que hiciste una captura.",
  "chat.screenshot.not_notified":
    "No se avisó a nadie. Este canal es público, así que anunciar una captura dejaría constancia de que estuviste aquí.",
  "chat.thread.error": "Error",
  "chat.thread.go_back": "Volver",
  "chat.bubble.via_bridge": "por el puente de malla",
  "chat.bubble.view_profile": "Ver el perfil de {name}",
  "chat.bubble.forwarded": "Reenviado",
  "chat.bubble.attachment": "adjunto",
  "chat.bubble.a11y": "{sender}: {body}. Mantén pulsado para ver más opciones.",
  "chat.bubble.failed_retry": "No se pudo enviar. Toca para reintentar.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Información del mensaje",
  "chat.info.delivered_to": "Entregado a {name}",
  "chat.info.read_by": "Leído por {name}",
  "chat.info.group_reach_desc":
    "Accesibles ahora, no es una confirmación de entrega",
  "chat.info.group_alone": "No hay más miembros",
  "chat.info.today_at": "Hoy a las {time}",
  "chat.info.sending": "Enviando…",
  "chat.info.failed": "No se pudo enviar",
  "chat.info.courier": "Transportado por un amigo",
  "chat.info.sent": "Enviado",
  "chat.info.queued": "Esperando para enviarse",
  "chat.info.waiting": "Esperando…",
  "chat.action.info": "Información del mensaje",
  "chat.action.save_photos": "Guardar en las fotos",
  "chat.action.save_copy": "Guardar una copia",
  "chat.action.forward": "Reenviar",
  "chat.action.select": "Seleccionar",
  "chat.select.cancel": "Cancelar la selección",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Cámara",
  "chat.attach.camera_desc": "Haz una foto o un vídeo",
  "chat.attach.library": "Galería de fotos",
  "chat.attach.library_desc": "Elige de tu galería",
  "chat.attach.document": "Documento",
  "chat.attach.document_desc": "Envía cualquier archivo o PDF",
  "chat.attach.voice": "Nota de voz",
  "chat.attach.voice_desc": "Graba y envía un mensaje de voz",
  "chat.attach.ecash": "Enviar ecash",
  "chat.attach.ecash_desc": "Envía sats de Cashu desde tu cartera",
  "chat.attach.location": "Ubicación",
  "chat.attach.location_desc": "Envía dónde estás ahora mismo",
  "chat.attach.title": "Adjuntar",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Compartió una ubicación",
  "chat.location.received_summary": "Compartió su ubicación",
  "chat.location.title": "Ubicación",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Tomada hace {ago}",
  "chat.location.open_maps": "Abrir en Maps",
  "chat.location.no_forward": "Las ubicaciones no se reenvían",
  "chat.location.no_forward_body":
    "Una ubicación se envía a una sola persona. Comparte la tuya si quieres que la tenga alguien más.",
  "chat.location.no_fix": "Permite la ubicación para ver a qué distancia está",
  "chat.location.send_title": "Enviar tu ubicación",
  "chat.location.send_body":
    "{name} verá un solo punto: dónde estás ahora. No se sigue actualizando.",
  "chat.location.send": "Enviar la ubicación",
  "chat.location.finding": "Buscando tu ubicación…",
  "chat.location.no_location": "No se pudo obtener tu ubicación",
  "chat.location.no_location_body":
    "Permite el acceso a la ubicación y comprueba que los servicios de ubicación estén activados; luego inténtalo de nuevo.",
  "chat.location.not_delivered": "No se pudo enviar tu ubicación",
  "chat.location.not_delivered_body":
    "Una ubicación solo vale la pena mientras es actual, así que no se pone en cola para más tarde. Inténtalo cuando se pueda contactar con {name}.",
  "chat.location.direction.n": "al norte",
  "chat.location.direction.ne": "al noreste",
  "chat.location.direction.e": "al este",
  "chat.location.direction.se": "al sureste",
  "chat.location.direction.s": "al sur",
  "chat.location.direction.sw": "al suroeste",
  "chat.location.direction.w": "al oeste",
  "chat.location.direction.nw": "al noroeste",
  "chat.attach.send_anyway": "Enviar igualmente",
  "chat.attach.bitchat_too_big": "Puede que no llegue",
  "chat.attach.bitchat_too_big_body":
    "{name} usa bitchat, que abandona a medio camino con archivos grandes. Por debajo de unos 350 KiB es fiable. Enviárselo a un contacto de Airhop no tiene ese límite.",
  "chat.attach.bitchat_unopenable": "Puede que no consigan abrirlo",
  "chat.attach.bitchat_unopenable_body":
    "{name} usa bitchat, que muestra fotos y notas de voz pero lista todo lo demás como un archivo que no puede abrir. Llegará, solo que quizá no puedan verlo.",
  "chat.attach.file": "Adjuntar un archivo",
  "chat.attach.unavailable": "Aquí no hay adjuntos disponibles",
  "chat.attach.not_sent": "Adjunto no enviado",
  "chat.attach.read_failed":
    "Algo salió mal al leer ese archivo. Prueba con otro.",
  "chat.attach.caption": "Añade un pie…",
  "chat.attach.send": "Enviar el adjunto",
  "chat.attach.generic": "Adjunto",
  "chat.media.view_full": "Ver la foto a pantalla completa",
  "chat.media.gone_photo": "La foto no está en este dispositivo",
  "chat.media.gone_video": "El vídeo no está en este dispositivo",
  "chat.media.gone_voice": "La nota de voz no está en este dispositivo",
  "chat.media.gone_file": "El archivo no está en este dispositivo",
  "chat.media.gone_note": "Eliminado a los 7 días o al vaciar la caché",
  "chat.media.ask_resend": "Volver a pedirlo",
  "chat.media.resend_draft": "¿Puedes enviarme otra vez {kind}?",
  "chat.media.kind_photo": "esa foto",
  "chat.media.kind_video": "ese vídeo",
  "chat.media.kind_voice": "esa nota de voz",
  "chat.media.kind_file": "ese archivo",
  "chat.media.pause_voice": "Pausar la nota de voz",
  "chat.media.play_voice": "Reproducir la nota de voz",
  "chat.media.voice_position": "Posición de la nota de voz",
  "chat.media.voice_scrub":
    "Toca a lo largo de las barras para saltar a ese punto",
  "chat.media.image": "Imagen",
  "chat.media.tap_load_photo": "Toca para cargar la foto",
  "chat.media.open_document": "Abrir {name}",
  "chat.media.document": "documento",
  "chat.media.tap_load_video": "Toca para cargar el vídeo",
  "chat.media.video": "Vídeo",
  "chat.media.photo": "Foto",
  "chat.media.close_photo": "Cerrar la foto",
  "chat.media.save_photo": "Guardar la foto en tus fotos",
  "chat.media.share_photo": "Compartir la foto",
  "chat.media.saved_videos": "Guardado en tus vídeos",
  "chat.media.saved_photos": "Guardado en tus fotos",
  "chat.media.not_saved": "No se guardó",
  "chat.media.cant_open": "No se puede abrir el archivo",
  "chat.media.no_app":
    "Este dispositivo no tiene ninguna app para abrir o compartir este archivo.",
  "chat.media.open_failed":
    "No se pudo abrir el archivo. Puede que se haya vaciado de la caché.",
  "media.blocked.nostr_only":
    "Solo conoces a esta persona a través de un relé. Únicamente se puede enviar texto. Las fotos, los archivos y las notas de voz requieren Bluetooth.",
  "media.blocked.private_channel":
    "Un adjunto de difusión va firmado pero no cifrado, así que enviarlo a un canal privado lo dejaría al descubierto mientras el texto de aquí sigue cifrado.",
  "media.blocked.private_group":
    "Un adjunto de difusión va firmado pero no cifrado, así que enviarlo a un grupo privado lo dejaría al descubierto mientras el texto de aquí sigue cifrado.",
  "media.blocked.location_channel":
    "Un canal de ubicación llega a la gente por internet, y las fotos, los archivos y las notas de voz viajan por Bluetooth, así que nunca llegarían.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Aquí no hay notas de voz disponibles",
  "chat.voice.hold_live": "Mantén pulsado para hablar en directo",
  "chat.voice.hold_record": "Mantén pulsado para grabar una nota de voz",
  "chat.voice.cancel_recording": "Cancelar la grabación",
  "chat.voice.slide_cancel": "Desliza para cancelar",
  "chat.voice.release_cancel": "Suelta para cancelar",
  "chat.voice.a11y_toggle": "Toca dos veces para empezar o dejar de hablar.",
  "chat.voice.limit_reached":
    "Límite de dos minutos alcanzado, suelta para enviar",
  "chat.voice.limit_sent": "Límite de dos minutos alcanzado, nota enviada",
  "chat.voice.stop_send": "Detener la grabación y enviar",
  "chat.voice.lift_lock": "Desliza hacia arriba para grabar sin manos",
  "chat.voice.live_speaking": "{name} está hablando",
  "voice.unavailable": "Voz en directo no disponible",
  "voice.recording_stopped": "Grabación detenida",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Acceso a la cámara",
  "chat.perm.camera_purpose": "hacer una foto para enviar",
  "chat.perm.photo_label": "Acceso a las fotos",
  "chat.perm.photo_purpose": "elegir una foto o un vídeo para enviar",
  "chat.perm.photo_save_purpose": "guardar esto en tus fotos",
  "chat.perm.mic_label": "Acceso al micrófono",
  "chat.perm.mic_live_purpose": "hablar con quien esté cerca",
  "chat.perm.mic_note_purpose": "grabar una nota de voz",
  "chat.perm.recording_stopped": "Grabación detenida",
  "chat.perm.record_failed":
    "No se pudo iniciar la grabación. Revisa los permisos del micrófono.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Reclamado",
  "chat.ecash.reclaimed": "Recuperado",
  "chat.ecash.claiming": "Reclamando…",
  "chat.ecash.claim": "Reclamar",
  "chat.ecash.claim_amount": "Reclamar {amount} {unit}",
  "chat.ecash.already_claimed": "Ya reclamado",
  "chat.ecash.already_claimed_body":
    "Todas las pruebas de este token ya están en tu cartera, así que no se ha añadido nada.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc":
    "Entregado a la malla para que haga lo posible por llevarlo",
  "chat.info.queued_desc":
    "Retenido en este teléfono hasta que haya una ruta hasta ellos",
  "chat.info.reclaimed": "Recuperado",
  "chat.info.reclaimed_desc":
    "Devolviste este pago a tu cartera, así que no se entregará",
  "chat.info.about": "Acerca de",
  "chat.info.group_desc":
    "Un grupo privado. Solo pueden leerlo los miembros que añadió quien lo creó, y se queda en Bluetooth.",
  "chat.info.teleported_desc":
    "Un canal de ubicación público para esta celda de geohash. Cualquiera dentro de la celda, con Airhop o con bitchat, lo comparte por internet. Estás teletransportado, no físicamente aquí.",
  "chat.info.custom_desc":
    "Un canal personalizado. Cualquiera que sepa el nombre puede unirse desde cualquier dispositivo con Airhop o bitchat.",
  "chat.info.private_e2ee": "Privado · cifrado de extremo a extremo",
  "chat.info.public_plain": "Público · sin cifrar",
  "chat.info.group_privacy":
    "Solo los miembros que se muestran abajo pueden leer este grupo. Los mensajes se quedan en Bluetooth, así que los miembros fuera de alcance los reciben al volver.",
  "chat.info.teleport_privacy":
    "Un lugar al que te has teletransportado. Llega a todos los de esta celda por internet, y a nadie al alcance del Bluetooth.",
  "chat.info.location_off_privacy":
    "La ubicación está desactivada, así que este canal solo llega a los dispositivos cercanos por Bluetooth. Actívala para alcanzar su celda de zona por internet.",
  "chat.info.invite_privacy":
    "Solo pueden leerlo las personas a las que invites con el enlace. Permanece oculto para el resto, incluso para los pares cercanos.",
  "chat.info.public_privacy":
    "Cualquiera que se una puede leer todos los mensajes. Usa un mensaje directo para hablar en privado; los mensajes directos van cifrados de extremo a extremo.",
  "chat.info.remove_member": "Quitar al miembro",
  "chat.info.remove_member_body":
    "¿Quitar a {name} del grupo? La clave del grupo rota para que ya no pueda leer los mensajes nuevos.",
  "chat.info.message_member": "Escribir a {name}",
  "chat.info.remove_member_a11y": "Quitar a {name}",
  "chat.info.no_addable":
    "No hay pares accesibles que añadir. Los miembros deben estar cerca.",
  "chat.info.add_count": "Añadir {count}",
  "chat.info.teleported_tag": "{level}  ·  teletransportado",
  "chat.info.active": "Activo",
  "chat.info.members": "Miembros",
  "chat.info.bookmark": "Guardar este lugar",
  "chat.info.remove_bookmark": "Quitar de los guardados",
  "chat.info.default_notice":
    "No se puede salir de los canales predeterminados. Forman parte del protocolo de malla de Airhop.",
  "chat.info.custom_channel": "Canal personalizado",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Copiar el geohash",
  "chat.info.relays": "Relés",
  "chat.info.show_relays": "Mostrar los relés que transportan este canal",
  "chat.info.relay_custom": "propio",
  "chat.info.relays_none": "Ninguno. Ahora mismo esta celda es solo Bluetooth.",
  "chat.info.search_members": "Buscar miembros",
  "chat.info.search_members_placeholder": "Buscar miembros…",
  "chat.info.teleported": "Teletransportado",
  "chat.info.creator": "Creador",
  "chat.info.no_matches": "Sin coincidencias",
  "chat.info.no_one_here": "Todavía no hay nadie aquí",
  "chat.info.add_members": "Añadir miembros",
  "chat.info.add_selected": "Añadir los miembros seleccionados",
  "chat.info.add": "Añadir",
  "chat.info.leave_group": "Salir del grupo",
  "chat.info.leave_channel": "Salir del canal",
  "chat.info.leave": "Salir",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Hablando desde el {date}",
  "chat.contact.verified_since": "Verificado desde el {date}",
  "chat.contact.anonymous": "Anónimo",
  "chat.contact.anonymous_desc":
    "Un seudónimo de geohash sin una identidad duradera que verificar",
  "chat.contact.verified": "Verificado",
  "chat.contact.verified_desc": "Escaneaste su código QR",
  "chat.contact.verified_desc_compared": "Comparaste códigos con esta persona",
  "chat.contact.not_verified": "Sin verificar",
  "chat.contact.not_verified_desc":
    "Escanea su código, o comparad uno en una llamada, para confirmar que son realmente ellos",
  "chat.contact.e2ee": "Cifrado de extremo a extremo",
  "chat.contact.e2ee_nostr":
    "Envuelto con NIP-17, así que los relés no pueden leerlo",
  "chat.contact.e2ee_mesh":
    "Noise XX, más Double Ratchet entre dispositivos con Airhop",
  "chat.contact.copy_nostr": "Copiar la clave pública de Nostr",
  "chat.contact.nostr_key": "Clave pública de Nostr",
  "chat.contact.cell_key_note":
    "Esta clave pertenece a la zona donde os conocisteis. Cambia si cualquiera de los dos se mueve, y la conversación termina con ella. Intercambiad contactos para seguir hablando desde cualquier sitio.",
  "chat.contact.peer_name": "Nombre del par",
  "chat.contact.peer_id": "ID de par",
  "chat.contact.rename": "Renombrar",
  "chat.contact.rename_needs_contact":
    "Puedes renombrar a las personas cuyas claves tengas. Intercambiad primero las tarjetas de contacto y esto pasará a ser un nombre que solo ves tú.",
  "chat.contact.rename_needs_keys":
    "Todavía no hay claves de este contacto. Escríbeles o escanea su código y podrás darles un nombre que solo verás tú.",
  "chat.contact.renamed_by_you": "Tu nombre para esta persona",
  "chat.contact.copy_peer_id": "Copiar el ID de par",
  "chat.contact.verify": "Verificar el contacto",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Avisos",
  "chat.notices.post_area": "Publicar un aviso en esta zona",
  "chat.notices.post_mesh": "Publicar un aviso en la malla",
  "chat.notices.mark_urgent": "Marcar como urgente",
  "chat.notices.post": "Publicar el aviso",
  "chat.notices.post_short": "Publicar",
  "chat.notices.delete": "Eliminar el aviso",
  "chat.notices.just_now": "ahora mismo",
  "chat.notices.fades_soon": "desaparece pronto",
  "chat.notices.1_day": "1 día",
  "chat.notices.3_days": "3 días",
  "chat.notices.7_days": "7 días",
  "chat.notices.fading": "desapareciendo",
  "chat.notices.fades_in_hours": "desaparece en {count} h",
  "chat.notices.fades_in_days": "desaparece en {count} d",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Malla",
  "chat.notices.urgent_short": "Urgente",
  "chat.notices.permanent_warning":
    "No desaparece nunca. Es público, está ligado a esta zona y no puedes retirarlo.",
  "chat.notices.none":
    "Todavía no hay avisos. Publica uno para que se quede aquí para los demás.",

  // ---- Chats: search results ----
  "chat.search.photos": "Fotos",
  "chat.search.videos": "Vídeos",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Documentos",
  "chat.search.links": "Enlaces",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filtrar por {filter}",
  "chat.search.no_matches": "No hay {filter} que coincidan con «{query}»",
  "chat.search.no_media": "Todavía no hay {filter}",
  "chat.search.result_a11y": "{chat}, {kind} de {sender}",
  "chat.search.you": "tú",
  "chat.search.section_chats": "Chats",
  "chat.search.section_messages": "Mensajes",
  "chat.search.section_notices": "Avisos",
  "chat.search.hint": "Busca mensajes y chats, o elige un filtro arriba.",
  "chat.search.no_results": "Sin resultados para «{query}»",
  "chat.search.open_chat": "Abrir {name}",
  "chat.search.message_a11y": "{chat}, mensaje de {sender}: {snippet}",
  "chat.search.notice_a11y": "Aviso en {chat} de {author}: {snippet}",
  "chat.search.urgent": "Urgente ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Hay {count} en esta lista. Vaciarla las quita solo de aquí, y los mensajes siguen sin leer en sus conversaciones. Marcar todo como leído despeja ambas cosas.",
  "chat.notif.mark_all_read": "Marcar todo como leído",
  "chat.notif.clear_list": "Vaciar la lista",
  "chat.notif.clear_all_a11y": "Vaciar las {count} notificaciones",
  "chat.notif.title": "Notificaciones",
  "chat.notif.clear_short": "Vaciar",
  "chat.notif.close": "Cerrar las notificaciones",
  "chat.notif.none": "Todavía no hay notificaciones",
  "chat.notif.none_desc":
    "Aquí aparecen los mensajes, las menciones y los avisos de tus canales y chats.",
  "chat.notif.new": "Nuevo",
  "chat.notif.notice_in": "aviso en {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Reenviar a…",
  "chat.forward.to": "Reenviar a {name}",
  "chat.forward.cant_send_here": "Aquí no se puede reenviar",
  "chat.forward.cant_send_to": "No se puede reenviar a {name}",
  "chat.forward.channels": "Canales",
  "chat.forward.groups": "Grupos",
  "chat.forward.locations": "Ubicaciones",
  "chat.forward.dms": "Mensajes directos",
  "chat.forward.none": "Todavía no hay otros chats",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Iniciando la malla…",
  "mesh.banner.no_bluetooth":
    "Sin Bluetooth en este dispositivo · solo internet",
  "mesh.banner.bluetooth_off": "Bluetooth desactivado · malla no disponible",
  "mesh.banner.permission_needed": "Se necesita permiso de Bluetooth",
  "mesh.banner.blocked": "Bluetooth bloqueado · permítelo en los ajustes",
  "mesh.banner.location_permission":
    "Se necesita la ubicación para encontrar pares",
  "mesh.banner.advertising_unsupported":
    "Este teléfono puede ver a otros pero no ser descubierto",
  "mesh.banner.location_off_android":
    "Ubicación desactivada · Android la necesita para encontrar pares",
  "mesh.banner.paused": "Malla en pausa · estás ausente",
  "mesh.banner.location_off":
    "Ubicación desactivada · canales de ubicación no disponibles",
  "mesh.banner.battery_saver":
    "Ahorro de batería · se busca con menos frecuencia",
  "mesh.banner.wipe_incomplete":
    "Borrado incompleto · pueden quedar datos, al reabrir se reintenta",
  "mesh.banner.wifi_off":
    "Wi-Fi desactivado · los archivos grandes se envían más despacio",
  "mesh.banner.clock_skew":
    "El reloj de este teléfono está mal · pon la fecha y la hora en automático",
  "mesh.banner.internet_off": "Internet desactivado · solo Bluetooth",
  "mesh.banner.relaying": "Sin pares cerca · retransmitiendo por Nostr",
  "mesh.banner.tor": "Tor activado · tráfico de internet enrutado",
  "mesh.banner.tor_starting": "Iniciando Tor · conectando",
  "mesh.banner.tor_blocked":
    "Tor no pudo conectarse · la malla sigue funcionando",
  "mesh.banner.gateway":
    "Pasarela de internet activada · retransmitiendo a pares cercanos",
  "mesh.banner.bridge": "Puente de malla activado · chat público enlazado",
  "mesh.banner.background_limits":
    "{brand} puede pausar la malla en segundo plano",
  "mesh.banner.bridge_across":
    "Puente de malla activado · {count} al otro lado del puente",
  "mesh.banner.action.turn_on": "Activar",
  "mesh.banner.action.allow": "Permitir",
  "mesh.banner.action.resume": "Reanudar",
  "mesh.banner.action.fix": "Arreglar",
  "mesh.banner.hint.resume":
    "Vuelve a activar el anuncio y la búsqueda por Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Pide a Android que active el Bluetooth",
  "mesh.banner.hint.location_settings":
    "Abre los ajustes de ubicación del sistema",
  "mesh.banner.hint.app_settings":
    "Abre los permisos de Airhop en los ajustes del sistema",
  "mesh.banner.hint.battery_settings":
    "Abre los ajustes de actividad en segundo plano de este teléfono",
  "mesh.banner.dismiss": "Descartar: {label}",
  "mesh.banner.hint.dismiss": "Oculta este aviso para siempre",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Buscando pares cercanos…",
  "mesh.radar.starting": "Iniciando la malla…",
  "mesh.radar.no_bluetooth": "Este dispositivo no tiene Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth desactivado · sin buscar",
  "mesh.radar.permission_needed": "Se necesita permiso de Bluetooth",
  "mesh.radar.blocked": "Bluetooth bloqueado",
  "mesh.radar.location_permission": "Se necesita permiso de ubicación",
  "mesh.radar.location_off": "Ubicación desactivada · sin buscar",
  "mesh.radar.hint_rings":
    "Los anillos indican la intensidad de la señal BLE, no la distancia",
  "mesh.radar.hint_checking": "Comprobando el Bluetooth y los permisos",
  "mesh.radar.hint_internet": "Los mensajes siguen viajando por internet",
  "mesh.radar.hint_turn_on": "Activa el Bluetooth para descubrir pares",
  "mesh.radar.hint_allow": "Permite el Bluetooth para descubrir pares",
  "mesh.radar.hint_allow_settings":
    "Permite el Bluetooth en los ajustes para descubrir pares",
  "mesh.radar.hint_location_permission":
    "Android 11 y anteriores necesitan la ubicación para buscar por Bluetooth",
  "mesh.radar.hint_android_location":
    "Android necesita la ubicación activada para devolver resultados de búsqueda por Bluetooth",
  "mesh.radar.signal_strong": "Fuerte",
  "mesh.radar.signal_medium": "Media",
  "mesh.radar.signal_weak": "Débil",
  "mesh.radar.you_center": "Tú, en el centro de la malla",
  "mesh.radar.sonar_hint":
    "Reproduce un barrido de sonar. La búsqueda ya es continua.",
  "mesh.radar.paused": "Malla en pausa · estás ausente",
  "mesh.radar.ring_hint":
    "La posición del anillo refleja la intensidad de la señal, no la distancia",
  "mesh.radar.set_online":
    "Pon tu estado en Conectado en el perfil para descubrir pares",
  "mesh.radar.in_range": "al alcance",
  "mesh.radar.recently_seen": "vistos hace poco",
  "mesh.radar.peer_hint": "Abre las opciones para escribir o pagar a este par",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "ahora mismo",
  "mesh.peer.none": "No hay pares cerca",
  "mesh.peer.none_desc":
    "Aquí aparecen otros dispositivos con Airhop o bitchat que estén al alcance del Bluetooth.",
  "mesh.peer.id_copied": "ID de par copiado",
  "mesh.peer.copy_id": "Copiar el ID de par",
  "mesh.peer.their_name": "Se hace llamar {name}",
  "mesh.peer.in_range": "Al alcance",
  "mesh.peer.relay": "Nodo repetidor",
  "mesh.peer.relay_body":
    "Una radio que alguien dejó encendida para ampliar la malla. Transporta mensajes que no puede leer. Aquí no hay nadie a quien escribir.",
  "mesh.peer.send_dm": "Enviar un mensaje directo",
  "mesh.peer.message": "Mensaje",
  "mesh.peer.send_sats": "Enviar ecash",
  "mesh.peer.amount_placeholder": "Cantidad en sats",
  "mesh.peer.amount_first": "Enviar ecash, introduce antes una cantidad",
  "mesh.peer.cancel_send": "Cancelar el envío de ecash",
  "mesh.peer.view_peer": "Ver el par {name}",
  "mesh.peer.view_peer_online": "Ver el par {name}, conectado",
  "mesh.peer.last_seen": "Visto hace {ago}",
  "mesh.peer.send_amount": "Enviar {amount} sats",
  "mesh.peer.direct": "Conexión directa",
  "mesh.peer.check_distance": "Comprobar la distancia",
  "mesh.peer.checking": "Comprobando",
  "mesh.peer.no_reply": "Sin respuesta",
  "mesh.peer.no_reply_hint":
    "Puede que se hayan movido o que su app no responda",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Región",
  "mesh.level.province": "Provincia",
  "mesh.level.city": "Ciudad",
  "mesh.level.neighborhood": "Barrio",
  "mesh.level.block": "Manzana",
  "mesh.level.building": "Edificio",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Disponible",
  "wallet.balance.unit_hint": "Alterna entre satoshis y bitcoin",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "El almacenamiento de la cartera está bloqueado. Las pruebas de ecash se guardan en un archivo cifrado cuya clave vive en el llavero del dispositivo, y no se pudo abrir. Desbloquea el dispositivo y vuelve a abrir Airhop.",
  "wallet.balance.tor_blocked":
    "Tor está activo, así que las peticiones a la casa de cambio están bloqueadas: saldrían por la red abierta y vincularían tu IP con tus pruebas. Enviar y recibir por la malla sigue funcionando. Permite el tráfico con la casa de cambio en Ajustes, Seguridad.",
  "wallet.balance.unconfirmed_note":
    "{amount} sin confirmar aún con la casa de cambio",
  "wallet.balance.reserved_note": "{amount} reservados para un envío en curso",
  "wallet.balance.other_mint_note":
    "{amount} en una cuenta de otra casa de cambio",
  "wallet.balance.test_mint_note":
    "Incluye dinero de prueba de una casa de cambio de pruebas. No es bitcoin y no se puede cobrar.",
  "wallet.token": "Token",
  "wallet.action.send": "Enviar un token de ecash",
  "wallet.action.send_disabled":
    "Enviar un token de ecash, no disponible sin saldo",
  "wallet.action.receive": "Recibir un token de ecash",
  "wallet.action.zap": "Enviar un zap a un contacto de Nostr",
  "wallet.action.zap_disabled":
    "Enviar un zap a un contacto de Nostr, no disponible sin saldo",
  "wallet.action.add_mint": "Añadir una casa de cambio de Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "No se pudo construir el token",
  "wallet.send.title": "Enviar ecash",
  "wallet.send.amount_in": "Cantidad en {unit}",
  "wallet.send.body":
    "Construido sin conexión a partir de pruebas que ya tienes. Nada sale de tu saldo de forma definitiva hasta que confirmes que el token llegó.",
  "wallet.send.stale_fee_note":
    "Las comisiones se comprobaron por última vez hace {days} días. Si esta casa de cambio ha subido la suya desde entonces, el envío puede costar un poco más.",
  "wallet.send.fee_note":
    "{spend} {unit} salen de tu saldo; los {fee} adicionales cubren la comisión de la casa de cambio que si no pagarían ellos",
  "wallet.send.qr_too_big":
    "Este token está repartido entre demasiadas monedas para caber en un código QR. Compártelo o cópialo, o actualiza en la casa de cambio para consolidarlo.",
  "wallet.send.bearer_note":
    "Quien tenga esta cadena es el dueño del dinero. Las pruebas están reservadas, no gastadas: si nunca llega a nadie, puedes recuperarlas en Pendientes.",
  "wallet.send.qr_too_big_short":
    "Este token está repartido entre demasiadas monedas para caber en un código QR. Compártelo o cópialo.",
  "wallet.send.scan_note":
    "Pídeles que lo escaneen desde su cartera. Se puede recuperar hasta que lo marques como entregado.",
  "wallet.send.mesh_note":
    "El token sale como un mensaje directo cifrado por la malla. No hace falta internet.",
  "wallet.send.no_peers_note":
    "Abre la pestaña Malla para encontrar dispositivos cercanos, o comparte el token de otra forma.",
  "wallet.send.send_to": "Enviar a {name}",
  "wallet.send.memo": "Nota (opcional, viaja con el token)",
  "wallet.send.building": "Construyendo…",
  "wallet.send.build": "Construir el token",
  "wallet.send.inexact_body":
    "Tus pruebas no pueden formar exactamente {amount} {unit} sin conexión. El token más pequeño que puedes construir es de {spend} {unit}, y sin conexión no hay cambio: los {extra} {unit} de más van al destinatario.\n\nActualizar en la casa de cambio con conexión dividiría tus pruebas en denominaciones que dan la cifra exacta.",
  "wallet.send.send_amount": "Enviar {amount}",
  "wallet.send.sent_to": "{amount} {unit} enviados a {name}",
  "wallet.send.sent_to_body":
    "{route} Se puede recuperar en Pendientes hasta que confirmes que lo recibieron, o hasta que la casa de cambio nos diga que las pruebas se canjearon.",
  "wallet.send.copy_token": "Copiar el token",
  "wallet.send.share_token": "Compartir el token",
  "wallet.send.open_in_wallet": "Abrir este token en otra cartera",
  "wallet.send.open_in_wallet_short": "Abrir en una cartera",
  "wallet.send.to_peer": "Enviar el token a un par cercano",
  "wallet.send.to_peer_short": "Enviar a un par",
  "wallet.send.mark_delivered": "Marcar como entregado y terminar",
  "wallet.send.they_got_it": "Lo han recibido",
  "wallet.send.keep_pending": "Dejar este envío pendiente",
  "wallet.send.decide_later": "Decidir más tarde",
  "wallet.send.no_peers": "No hay pares al alcance",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Este es tu propio pago",
  "wallet.receive.own_payment_body":
    "Estas monedas siguen reservadas para un envío que no has liquidado, así que no hay nada que reclamar. Usa Recuperar en ese pago para devolverlas directamente a tu saldo.",
  "wallet.receive.already_have": "Ya está en tu cartera",
  "wallet.receive.already_have_body":
    "Todas las pruebas de este token ya están guardadas aquí, así que no se ha añadido nada. Los saldos no cambian.",
  "wallet.receive.stored_unconfirmed":
    "Guardado de {mint}, pero aún sin confirmar con la casa de cambio ({reason}).",
  "wallet.receive.offline": "sin conexión",
  "wallet.receive.redeemed_here":
    "Canjeado en {mint}. Estas pruebas ahora son solo tuyas: la copia del remitente ya no funciona.",
  "wallet.receive.memo_quoted": "\n\n«{memo}»",
  "wallet.receive.redeemed_at":
    "Canjeado en {mint}. Ahora es tuyo de forma demostrable: la copia de este token que tiene el remitente ya no funciona.",
  "wallet.receive.stored_pending":
    "Guardado de {mint}, pero la casa de cambio aún no ha confirmado que esté sin gastar{dleq}. Actualiza desde la pestaña Cartera cuando tengas conexión.",
  "wallet.receive.dleq_inline":
    " (su firma sí cuadra, así que el token es auténtico)",
  "wallet.receive.dleq_ok":
    "La firma de la casa de cambio cuadra, así que el token es auténtico.",
  "wallet.receive.dleq_uncached":
    "Las claves de la casa de cambio no están guardadas aquí, así que la firma no se pudo comprobar sin conexión.",
  "wallet.receive.dleq_warning":
    "Hasta que actualices con conexión, el remitente podría en principio haberlo gastado en otro sitio.",
  "wallet.receive.failed": "No se pudo recibir",
  "wallet.receive.title": "Recibir ecash",
  "wallet.receive.body":
    "Pega un token de Cashu. Con conexión se canjea en la casa de cambio al momento; sin conexión se guarda y se confirma la próxima vez que actualices.",
  "wallet.receive.scan": "Escanear un código QR de ecash",
  "wallet.receive.scan_short": "Escanear QR",
  "wallet.receive.receiving": "Recibiendo…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap recibido de {from}… y canjeado en tu cartera.",
  "wallet.zap.title": "Enviar un zap a una identidad de Nostr",
  "wallet.zap.not_npub": "no es un npub",
  "wallet.zap.bad_key": "clave incorrecta",
  "wallet.zap.invalid_pubkey": "Clave pública no válida",
  "wallet.zap.invalid_pubkey_body":
    "Introduce un npub1… o una clave pública de Nostr en hexadecimal de 64 caracteres.",
  "wallet.zap.sent": "Nutzap enviado",
  "wallet.zap.failed": "El zap ha fallado",
  "wallet.zap.body":
    "Si publican información de nutzap de NIP-61, el ecash queda bloqueado a su clave para que nadie más pueda gastarlo, y no se puede recuperar. Si no, va como un token recuperable. Se te dirá qué ha ocurrido.",
  "wallet.zap.contact": "Enviar un zap a {name}",
  "wallet.zap.pubkey_placeholder": "npub1… o hex de 64 caracteres",
  "wallet.zap.sending": "Enviando…",
  "wallet.nostr.copied_body":
    "Dale esto a alguien y podrá enviarte zaps desde Airhop o desde cualquier otra cartera de Nostr, sin necesidad de Bluetooth.",
  "wallet.nostr.copy_key":
    "Copia tu clave de Nostr para que puedan enviarte zaps",
  "wallet.nostr.your_key": "Tu clave de Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Casa de cambio añadida",
  "wallet.mint.add_failed": "No se pudo añadir la casa de cambio",
  "wallet.mint.added_named": "{name} añadida",
  "wallet.mint.added_body":
    "{mint} emite {units}. Sus claves están guardadas en este dispositivo, así que sus tokens ya se pueden verificar incluso sin internet.",
  "wallet.mint.remove_plain":
    "¿Quitar {mint} de tu cartera? Sus claves guardadas también se van, así que sus tokens ya no se podrán verificar sin conexión.",
  "wallet.mint.title": "Casas de cambio",
  "wallet.mint.none": "Aún no hay ninguna casa de cambio",
  "wallet.mint.none_desc":
    "Una casa de cambio emite y canjea tu ecash. Añade una para ingresar por Lightning, o recibe un token y la suya se añade sola.",
  "wallet.mint.add": "Añadir una casa de cambio",
  "wallet.mint.add_body":
    "Una casa de cambio guarda el Bitcoin que respalda tu ecash, así que elige una a la que confiarías el saldo que mantengas ahí. La URL se comprueba antes de guardarla. Monta la tuya con Nutshell si prefieres no confiar en nadie.",
  "wallet.mint.consolidate_body":
    "Un token solo puede nombrar una casa de cambio, así que un saldo repartido entre varias no puede pagar una cantidad mayor que la que tenga la más grande. Airhop puede moverlo: cada una de las demás paga una factura de Lightning emitida por la que elijas. Cuesta una pequeña comisión de enrutado y necesita internet.",
  "wallet.mint.add_short": "Añadir",
  "wallet.mint.checking": "Comprobando…",
  "wallet.mint.remove_with_balance": "¿Quitar una casa de cambio con saldo?",
  "wallet.mint.remove": "Quitar la casa de cambio",
  "wallet.mint.delete_anyway": "Eliminar igualmente",
  "wallet.mint.consolidate": "Mover todos los saldos a una casa de cambio",
  "wallet.mint.confirm_with": "Confirmar las pruebas con {mint}",
  "wallet.mint.remove_a11y": "Quitar {mint}",
  "wallet.mint.available_amount": "{amount} {unit} disponibles",
  "wallet.mint.split_across":
    "Saldo repartido entre {count} casas de cambio. Muévelo a una.",
  "wallet.mint.move_everything_to": "Mover todo a {mint}",
  "wallet.mint.consolidate_title": "Mover a una sola casa de cambio",
  "wallet.mint.moving": "Moviendo…",
  "wallet.mint.move": "Mover",
  "wallet.mint.moved": "Movido",
  "wallet.mint.moved_body":
    "{amount} {unit} están ahora en {mint}, tras {fees} {unit} en comisiones de enrutado de Lightning.",
  "wallet.mint.nothing_moved": "No se movió nada",
  "wallet.mint.destination": "· destino",
  "wallet.mint.will_move": "· se moverá",
  "wallet.mint.issued_by": "Emitido por",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Recarga de la cartera de Airhop",
  "wallet.ln.invoice_failed": "No se pudo crear la factura",
  "wallet.ln.price_failed": "No se pudo calcular el importe de esta factura",
  "wallet.ln.paid": "Pagado",
  "wallet.ln.deposit_credited":
    "Factura pagada y {amount} {unit} emitidos por {mint}. Este saldo está confirmado: puedes gastarlo sin conexión al momento.",
  "wallet.ln.withdrawn":
    "{paid} sats pagados por Lightning. La casa de cambio cobró {fee} sats en comisiones de enrutado.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats pagados por Lightning. La casa de cambio cobró {fee} sats en comisiones de enrutado y devolvió {change} sats de la reserva a tu saldo.",
  "wallet.ln.payment_failed": "El pago ha fallado",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Convierte sats de Lightning en ecash que puedes gastar sin conexión, o saca ecash a cualquier factura de Lightning. Ambas cosas necesitan internet y una casa de cambio.",
  "wallet.ln.deposit_body":
    "La casa de cambio te da una factura. Págala desde cualquier cartera de Lightning y los sats vuelven como ecash que puedes gastar sin conexión.",
  "wallet.ln.pay_invoice_for":
    "Paga esta factura de {amount} {unit}. La cartera está pendiente del pago y emitirá tu ecash automáticamente.",
  "wallet.ln.expired_body":
    "Esta factura ha caducado. Si ya la pagaste, el saldo se acredita automáticamente.",
  "wallet.ln.waiting_expires": "Esperando el pago · caduca en {countdown}",
  "wallet.ln.withdraw_body":
    "Pega una factura bolt11 y la casa de cambio la paga con tu ecash. Primero se te indica la reserva de enrutado; lo que el enrutado no use vuelve a tu saldo.",
  "wallet.ln.up_to": "hasta {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Pagar {amount} {unit}",
  "wallet.ln.deposit": "Ingresar sats por Lightning",
  "wallet.ln.deposit_short": "Ingresar",
  "wallet.ln.withdraw": "Retirar a una factura de Lightning",
  "wallet.ln.withdraw_short": "Retirar",
  "wallet.ln.deposit_title": "Ingresar por Lightning",
  "wallet.ln.amount_placeholder": "Cantidad en sats",
  "wallet.ln.requesting": "Solicitando…",
  "wallet.ln.get_invoice": "Obtener una factura",
  "wallet.ln.copy_invoice": "Copiar la factura",
  "wallet.ln.open_wallet": "Abrir en una cartera de Lightning",
  "wallet.ln.open_wallet_short": "Abrir en una cartera",
  "wallet.ln.waiting": "Esperando el pago…",
  "wallet.ln.new_invoice": "Crear una factura nueva",
  "wallet.ln.new_invoice_short": "Nueva factura",
  "wallet.ln.withdraw_title": "Retirar a Lightning",
  "wallet.ln.scan_invoice": "Escanear el código QR de una factura de Lightning",
  "wallet.ln.paid_from": "Pagado desde",
  "wallet.ln.invoice": "Factura",
  "wallet.ln.routing_reserve": "Reserva de enrutado",
  "wallet.ln.reserved": "Reservado del saldo",
  "wallet.ln.paying": "Pagando…",
  "wallet.ln.get_quote": "Obtener un presupuesto",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Copia de seguridad",
  "wallet.backup.setup_failed": "No se pudo configurar la copia de seguridad",
  "wallet.backup.on": "Copia de seguridad activada",
  "wallet.backup.on_body":
    "Tu saldo ya se puede reconstruir a partir de esas doce palabras.\n\nTodo lo que te haya dado otra persona queda fuera de la frase hasta que actualices en la casa de cambio, y la recuperación necesita tu lista de casas de cambio, así que anótala junto a las palabras.",
  "wallet.backup.no_phrase": "No hay ninguna frase guardada",
  "wallet.backup.no_phrase_body":
    "No se pudo leer la frase de recuperación del llavero del dispositivo. Desbloquéalo e inténtalo de nuevo.",
  "wallet.backup.replace_title": "¿Sustituir tu frase actual?",
  "wallet.backup.replace_body":
    "Ya tienes una frase de recuperación. Restaurar otra la sustituye. Las monedas que cubría la frase antigua siguen siendo gastables en este dispositivo, pero dejan de ser restaurables, así que asegúrate de tener anotadas las palabras antiguas antes de continuar.",
  "wallet.backup.replace": "Sustituir",
  "wallet.backup.invalid_phrase": "Esa frase no es válida",
  "wallet.backup.invalid_phrase_body":
    "La frase lleva una suma de verificación incorporada y esta no la pasa. Busca una palabra mal escrita, ausente o cambiada de sitio.",
  "wallet.backup.not_bip39":
    "Estas no son palabras BIP-39: {words}. Revisa la ortografía.",
  "wallet.backup.add_mint_first": "Añade antes una casa de cambio",
  "wallet.backup.add_mint_first_body":
    "La recuperación funciona preguntando a una casa de cambio qué monedas firmó para ti, así que necesita saber a cuál preguntar. Añade las que usabas y luego restaura.",
  "wallet.backup.restore_failed": "La restauración ha fallado",
  "wallet.backup.phrase": "Frase de recuperación",
  "wallet.backup.state_unconfirmed": "Copia activada pero sin confirmar",
  "wallet.backup.state_off": "Copia de seguridad desactivada",
  "wallet.backup.badge_on": "Activada",
  "wallet.backup.badge_unconfirmed": "Sin confirmar",
  "wallet.backup.badge_off": "Desactivada",
  "wallet.backup.view": "Ver la frase de recuperación",
  "wallet.backup.setup": "Configurar una frase de recuperación",
  "wallet.backup.view_short": "Ver la frase",
  "wallet.backup.setup_short": "Configurar",
  "wallet.backup.restore":
    "Restaurar una cartera desde una frase de recuperación",
  "wallet.backup.restore_short": "Restaurar",
  "wallet.backup.setup_title": "Configurar una frase de recuperación",
  "wallet.backup.on_body_short":
    "Tu saldo se puede reconstruir en un dispositivo nuevo con tus doce palabras.",
  "wallet.backup.unconfirmed_body":
    "Nunca confirmaste tener una copia escrita. Ahora mismo las palabras solo existen en este teléfono, que es justo lo que una copia de seguridad debería sobrevivir. Mira la frase y anótala.",
  "wallet.backup.not_covered":
    "{amount} aún no están cubiertos. Las monedas que te han dado llevan los secretos de quien las envió, así que solo entran bajo tu frase una vez intercambiadas. Actualiza una casa de cambio para asegurarlas.",
  "wallet.backup.off_body":
    "Tu ecash solo existe en este teléfono. Si lo pierdes, nadie puede recuperar el dinero, tú incluido. Una frase de recuperación son doce palabras que pueden reconstruir tu saldo en cualquier parte.",
  "wallet.backup.about_to_see":
    "Estás a punto de ver doce palabras. Son el dinero.",
  "wallet.backup.exact_order":
    "Doce palabras, exactamente en este orden. Quien las tenga, tiene tu saldo.",
  "wallet.backup.verify_body":
    "Una frase que nadie ha anotado es peor que no tener frase, porque parece una red de seguridad que no está ahí. Dos palabras para confirmar.",
  "wallet.backup.verify_mismatch": "No coincide. Revisa tu copia escrita.",
  "wallet.backup.restore_body":
    "Introduce las doce palabras. Airhop vuelve a derivar tus monedas y pregunta a cada casa de cambio cuáles firmó, así que el saldo regresa desde los registros que ella guarda.",
  "wallet.backup.warn_secret":
    "Cualquiera que las lea puede llevarse tu saldo. No hagas capturas ni las guardes en este teléfono.",
  "wallet.backup.warn_paper":
    "Escríbelas en papel y guárdalas en un sitio seguro. Airhop no puede volver a mostrártelas si pierdes el teléfono.",
  "wallet.backup.warn_scope":
    "Solo reconstruyen tu ecash. Tu identidad, tus chats y tus contactos no están cubiertos.",
  "wallet.backup.warn_mints":
    "La recuperación tiene que preguntar a una casa de cambio qué monedas firmó, así que anota tu lista de casas de cambio junto a las palabras.",
  "wallet.backup.preparing": "Preparando…",
  "wallet.backup.show_phrase": "Mostrar mi frase",
  "wallet.backup.your_phrase": "Tu frase de recuperación",
  "wallet.backup.write_down": "Anota esto",
  "wallet.backup.copy_phrase":
    "Copiar la frase de recuperación al portapapeles",
  "wallet.backup.copy_clipboard": "Copiar al portapapeles",
  "wallet.backup.written_down": "Ya las he anotado",
  "wallet.backup.check_copy": "Revisa tu copia",
  "wallet.backup.confirm": "Confirmar",
  "wallet.backup.restore_title": "Restaurar desde una frase",
  "wallet.backup.phrase_placeholder": "doce palabras separadas por espacios",
  "wallet.backup.no_mints_yet":
    "Aún no has añadido ninguna casa de cambio. La recuperación tiene que preguntar a una en concreto, así que añade antes las que usabas.",
  "wallet.backup.scanning": "Explorando…",
  "wallet.backup.restore_progress":
    "{mint} · conjunto de claves {step} de {total}",
  "wallet.backup.will_scan":
    "Se explorarán: {mints}. A una casa de cambio que no hayas añadido nunca se le pregunta, así que su saldo queda invisible.",
  "wallet.backup.word_n": "Palabra {position}",
  "wallet.backup.unreachable_mints":
    "No se pudo contactar con: {mints}. El saldo que haya ahí sigue existiendo. Inténtalo de nuevo con mejor conexión.",
  "wallet.backup.nothing_recovered":
    "No se recuperó nada de las casas de cambio exploradas.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "¿Marcar como recibido?",
  "wallet.delivered.body":
    "Esto libera {amount} {unit} de forma definitiva. Si en realidad nunca llegó, no podrás recuperarlo.",
  "wallet.delivered.body_generic":
    "Esto libera la cantidad reservada de forma definitiva. Si en realidad nunca llegó, no podrás recuperarla.",
  "wallet.delivered.cancel": "Todavía no",
  "wallet.delivered.confirm": "Lo han recibido",
  "wallet.reclaim.title": "¿Recuperar este token?",
  "wallet.reclaim.body":
    "Los {amount} {unit} vuelven a tu saldo. Hazlo solo si el token nunca llegó a nadie: si ya tienen la cadena, quien lo canjee primero en la casa de cambio se queda el dinero, y podrían ser ellos.",
  "wallet.reclaim.keep": "Dejar pendiente",
  "wallet.reclaim.confirm": "Recuperar",
  "wallet.copied.token_body":
    "El token está en tu portapapeles. Sigue reservado aquí hasta que lo marques como entregado, así que puedes volver a pegarlo si el primer intento falla.",
  "wallet.copied.phrase_body":
    "Pégala en un gestor de contraseñas y luego vacía el portapapeles. Otras apps pueden leerlo, y en algunas configuraciones se sincroniza con tus demás dispositivos.",
  "wallet.refresh.failed": "La actualización ha fallado",
  "wallet.refresh.partly": "Actualizado en parte",
  "wallet.refresh.done": "Actualizado",
  "wallet.refresh.unreachable":
    "No se pudo contactar con {mints}. Todo lo demás está al día.",
  "wallet.refresh.swapped":
    "{amount} {unit} confirmados e intercambiados por pruebas nuevas.",
  "wallet.refresh.secured":
    "{amount} {unit} ya están cubiertos por tu frase de recuperación.",
  "wallet.refresh.all_confirmed":
    "Todo lo de aquí ya estaba confirmado con la casa de cambio.",
  "wallet.pending.title": "Pendientes",
  "wallet.pending.reserved_desc":
    "Construido y reservado, entrega sin confirmar. Las pruebas se mantienen fuera de tu saldo para que no se puedan gastar dos veces.",
  "wallet.pending.locked_desc":
    "Ya está bloqueado a la clave del destinatario, así que solo él puede gastarlo. Simplemente aún no le ha llegado. Comparte el token para terminar.",
  "wallet.pending.show_qr": "Mostrar este token como código QR",
  "wallet.pending.copy_again": "Volver a copiar el token",
  "wallet.pending.share_again": "Volver a compartir el token",
  "wallet.pending.mark_delivered": "Marcar este token como entregado",
  "wallet.pending.delivered": "Entregado",
  "wallet.pending.reclaim_into": "Recuperar este token en tu saldo",
  "wallet.activity.title": "Actividad",
  "wallet.activity.none": "Todavía nada",
  "wallet.activity.none_desc":
    "Los pagos que envías y recibes aparecen aquí, los más recientes primero, con la casa de cambio y la comisión de cada uno.",
  "wallet.activity.show_fewer": "Mostrar menos pagos",
  "wallet.activity.show_less": "Mostrar menos",
  "wallet.activity.received_unconfirmed": "Recibido, sin confirmar",
  "wallet.activity.received": "Recibido",
  "wallet.activity.receive_failed": "Fallo al recibir",
  "wallet.activity.reclaimed": "Recuperado",
  "wallet.activity.send_failed": "Fallo al enviar",
  "wallet.activity.sent": "Enviado",
  "wallet.activity.status_pending": "pendiente",
  "wallet.activity.status_failed": "fallido",
  "wallet.activity.status_reclaimed": "recuperado",
  "wallet.activity.status_expired": "caducado",
  "wallet.activity.ln_deposit": "Ingreso por Lightning",
  "wallet.activity.ln_withdrawal": "Retirada por Lightning",
  "wallet.activity.nutzap_received": "Nutzap recibido",
  "wallet.activity.spent_removed": "Pruebas gastadas eliminadas",
  "wallet.activity.refreshed": "Pruebas actualizadas",
  "wallet.activity.refreshing": "Actualizando las pruebas",
  "wallet.activity.just_now": "ahora mismo",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Malla sin conexión",
  "wallet.mesh_offline_body":
    "El servicio de malla no está en marcha, así que no hay a quién entregar el token. Sigue reservado en Pendientes.",
  "wallet.xfer.route_mesh":
    "Entregado directamente a su dispositivo por la malla.",
  "wallet.xfer.route_nostr":
    "Estaban fuera del alcance del Bluetooth, así que fue por internet.",
  "wallet.xfer.route_courier":
    "Ahora mismo no hay ruta hasta ellos. Otros dispositivos lo transportarán y lo entregarán cuando alguno les alcance.",
  "wallet.xfer.route_queued":
    "Todavía no se puede contactar con ellos. Está en cola y se enviará en cuanto sea posible.",
  "wallet.xfer.mesh_offline_body":
    "El servicio de malla no está en marcha, así que no hay forma de entregar el token. No se ha descontado nada.",
  "wallet.xfer.could_not_send": "No se pudo enviar",
  "wallet.xfer.inexact_body":
    "Tus pruebas no pueden formar exactamente {amount} {unit} sin conexión. El token más pequeño que puedes construir es de {spend} {unit}, y los {extra} {unit} de más van a parar a ellos sin forma de recuperarlos.\n\nActualizar en la casa de cambio con conexión divide tus pruebas en denominaciones que dan la cifra exacta.",
  "wallet.xfer.send_amount": "Enviar {amount}",
  "wallet.xfer.mesh_offline": "Malla sin conexión",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Bloqueado a su clave y publicado en Nostr. Es suyo estén conectados o no.",
  "wallet.pay.rail_nutzap_dm":
    "Bloqueado a su clave. El relé no lo aceptó, así que les llegó como un mensaje.",
  "wallet.pay.rail_nutzap_undelivered":
    "Bloqueado a su clave, pero todavía no ha podido transportarlo nada. Está en cola y el token está en Pendientes.",
  "wallet.pay.final":
    "Los pagos bloqueados no se pueden recuperar: ahora solo su clave puede gastar estas monedas.",
  "wallet.pay.reclaimable":
    "Se puede recuperar desde la pestaña Cartera hasta que confirmes que llegó.",
  "wallet.pay.why": "Se envió así porque {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} para {name}",
  "wallet.pay.thread_receipt":
    "Has enviado {amount} {unit}, bloqueados a su clave.",
  "wallet.pay.title": "Enviar ecash",
  "wallet.pay.to": "Para {name}",
  "wallet.pay.amount": "Cantidad en sats",
  "wallet.pay.memo": "Nota (opcional, pública)",
  "wallet.pay.send": "Enviar",
  "wallet.pay.sending": "Enviando…",
  "wallet.pay.action": "Enviar ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Acceso a la cámara",
  "wallet.scan.camera_purpose": "escanear un código QR de ecash",
  "wallet.scan.photo_label": "Acceso a las fotos",
  "wallet.scan.photo_purpose": "leer un QR de ecash desde una imagen",
  "wallet.scan.no_token": "No se encontró ningún token de ecash en esa imagen.",
  "wallet.scan.no_invoice":
    "No se encontró ninguna factura de Lightning en esa imagen.",
  "wallet.scan.unreadable": "No se pudo leer esa imagen.",
  "wallet.scan.camera_failed":
    "No se pudo iniciar la cámara. Cierra otras apps de cámara e inténtalo de nuevo.",
  "wallet.scan.close": "Cerrar el escáner",
  "wallet.scan.on_device":
    "Se lee en este dispositivo; no se envía nada a ninguna parte.",
  "wallet.scan.aim_token": "Apunta a un código QR de ecash.",
  "wallet.scan.aim_invoice": "Apunta al código QR de una factura de Lightning.",
  "wallet.scan.title_token": "Escanear ecash",
  "wallet.scan.title_invoice": "Escanear una factura",
  "wallet.scan.desc_token":
    "Lee un token de Cashu de otra cartera. Funciona con cualquier cartera de Cashu, no solo con Airhop.",
  "wallet.scan.desc_invoice":
    "Lee una factura de Lightning para pagarla con tu saldo.",
  "wallet.scan.use_camera_a11y": "Escanear con la cámara",
  "wallet.scan.use_camera": "Usar la cámara",
  "wallet.scan.pick_image_a11y": "Leer un código QR de una imagen guardada",
  "wallet.scan.pick_image": "Elegir de las fotos",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "¿Qué es Cashu?",
  "wallet.explain.intro":
    "Cashu es ecash para Bitcoin. Un token es una cadena que vale dinero para quien la tenga, firmada a ciegas por una casa de cambio para que esta no pueda saber quién gastó qué. Sin cuentas ni inicios de sesión.",
  "wallet.explain.send": "Enviar",
  "wallet.explain.send_desc":
    "Convierte una cantidad en un token que puedes entregar a un par cercano por Bluetooth o compartir como texto. Funciona sin internet. Las pruebas siguen reservadas hasta que confirmes que llegó.",
  "wallet.explain.receive": "Recibir",
  "wallet.explain.receive_desc":
    "Pega un token para añadirlo. Con conexión se intercambia en la casa de cambio al momento, lo que lo hace tuyo de forma demostrable. Sin conexión se guarda y se marca como no confirmado hasta que actualices.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Paga a una identidad de Nostr. Si publican información de nutzap de NIP-61, el ecash queda bloqueado a su clave para que solo ellos puedan gastarlo. Si no, recurre a un mensaje directo cifrado. Necesita internet.",
  "wallet.explain.add_mint": "Añadir una casa de cambio",
  "wallet.explain.add_mint_desc":
    "Guarda la casa de cambio que emite y canjea tu ecash, y almacena sus claves públicas para poder verificar sus tokens sin conexión. Elige una a la que confiarías el saldo que mantengas ahí.",
  "wallet.explain.phrase": "Frase de recuperación",
  "wallet.explain.phrase_desc":
    "Tus monedas se derivan de doce palabras que la cartera genera al principio, así que un teléfono nuevo puede reconstruir el saldo preguntando a tus casas de cambio qué monedas firmaron. Hasta que las veas y las anotes, solo existen en este teléfono.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Cartera bloqueada",
  "wallet.err.mint_unreachable": "Casa de cambio inaccesible",
  "wallet.err.tor_blocked": "Bloqueado con Tor activo",
  "wallet.err.insufficient": "Saldo insuficiente",
  "wallet.err.exact_amount": "No se puede enviar esa cantidad exacta",
  "wallet.err.no_mint": "Sin casa de cambio",
  "wallet.err.mint_unsupported": "La casa de cambio no puede hacerlo",
  "wallet.err.mint_refused": "La casa de cambio lo rechazó",
  "wallet.err.unreadable": "Token ilegible",
  "wallet.err.rejected": "Token rechazado",
  "wallet.err.already_spent": "Ya gastado",
  "wallet.err.change_pending": "Pagado, cambio pendiente",
  "wallet.svc.mint_unreachable": "No se pudo contactar con la casa de cambio.",
  "wallet.svc.tor_ios":
    "En iOS, las peticiones a la casa de cambio no pasan por Tor.",
  "wallet.svc.tor_ios_body":
    "Arti solo envuelve los WebSockets de Nostr, así que esta petición llegaría a la casa de cambio por la red abierta y vincularía tu IP con estas pruebas. Permítelo en Ajustes > Seguridad, o desactiva Tor antes. Enviar y recibir ecash por la malla sigue funcionando.",
  "wallet.svc.keys_uncached":
    "Las claves de esta casa de cambio no están guardadas en este dispositivo.",
  "wallet.svc.keys_uncached_body":
    "Abre la cartera una vez con conexión para obtenerlas.",
  "wallet.svc.phrase_invalid": "Esa frase de recuperación no es válida.",
  "wallet.svc.phrase_invalid_body":
    "Busca una palabra mal escrita o ausente. La frase lleva una suma de verificación incorporada, así que una sola palabra incorrecta invalida el conjunto.",
  "wallet.svc.need_mint": "Añade antes al menos una casa de cambio.",
  "wallet.svc.need_mint_body":
    "La recuperación funciona preguntando a una casa de cambio qué monedas firmó para ti, así que necesita saber a cuál preguntar.",
  "wallet.svc.restored": "Restaurado desde la frase de recuperación",
  "wallet.svc.storage_locked":
    "El almacenamiento de la cartera está bloqueado.",
  "wallet.svc.storage_locked_body":
    "Airhop guarda las pruebas de ecash en un archivo cifrado cuya clave vive en el llavero del dispositivo. Desbloquéalo y vuelve a abrir la app.",
  "wallet.svc.bad_url": "Esa no es una URL válida.",
  "wallet.svc.needs_https":
    "La URL de una casa de cambio debe empezar por https://.",
  "wallet.svc.refuse_http":
    "Nos negamos a usar una casa de cambio por http sin cifrar.",
  "wallet.svc.refuse_http_body":
    "Cualquiera en el camino de la red podría leer o alterar tus pruebas. Usa una casa de cambio con https://.",
  "wallet.svc.mint_not_saved": "No se pudo guardar la casa de cambio.",
  "wallet.svc.unreadable_token": "Ese no es un token de Cashu legible.",
  "wallet.svc.unreadable_token_body":
    "Los tokens empiezan por cashuA o cashuB. Comprueba que no se cortara nada al copiarlo.",
  "wallet.svc.wrong_mint": "Este token no lo firmó la casa de cambio que dice.",
  "wallet.svc.already_spent": "Estas pruebas ya se han gastado.",
  "wallet.svc.already_spent_body":
    "Quien envió este token lo canjeó antes, o envió el mismo token a otra persona.",
  "wallet.svc.receiving_offline": "recibiendo sin conexión",
  "wallet.svc.amount_positive": "Introduce una cantidad mayor que cero.",
  "wallet.svc.coins_raced": "Otro pago acaba de usar esas monedas.",
  "wallet.svc.coins_raced_body":
    "No se ha descontado nada. Inténtalo de nuevo y la cartera elegirá otro conjunto.",
  "wallet.svc.no_ecash": "Todavía no tienes ecash.",
  "wallet.svc.no_ecash_body":
    "Añade una casa de cambio e ingresa por Lightning, o recibe un token de alguien.",
  "wallet.svc.split_across_mints":
    "Tu saldo está repartido entre varias casas de cambio.",
  "wallet.svc.mint_says_spent":
    "La casa de cambio informó de que estas pruebas ya estaban gastadas.",
  "wallet.svc.issue_against_invoice":
    "emitir ecash contra una factura de Lightning",
  "wallet.svc.pay_invoice": "pagar una factura de Lightning",
  "wallet.svc.unknown_deposit": "Ingreso desconocido.",
  "wallet.svc.invoice_expired_before":
    "La factura caducó antes de que se pagara.",
  "wallet.svc.invoice_expired": "Esa factura ha caducado.",
  "wallet.svc.invoice_unpaid": "La factura todavía no se ha pagado.",
  "wallet.svc.payment_unknown":
    "Estado del pago desconocido; se comprobará de nuevo en la próxima actualización.",
  "wallet.svc.melt_change_pending": "Tu factura se ha pagado.",
  "wallet.svc.melt_change_pending_body":
    "La casa de cambio aún no ha devuelto la comisión de enrutado no utilizada. Se reclama automáticamente en la próxima actualización, y mientras tanto no se pierde nada.",
  "wallet.svc.mint_did_not_pay":
    "La casa de cambio no pagó esta factura. Tu saldo no ha cambiado.",
  "wallet.svc.not_an_invoice": "Esa no es una factura de Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Pega una factura bolt11 que empiece por lnbc.",
  "wallet.svc.insufficient_for_invoice":
    "Saldo insuficiente para esta factura.",
  "wallet.svc.coins_raced_invoice_body":
    "No se ha descontado nada y la factura no se pagó. Inténtalo de nuevo.",
  "wallet.svc.same_mint": "Elige otra casa de cambio de destino.",
  "wallet.svc.same_mint_body":
    "El origen y el destino son la misma casa de cambio, así que no hay nada que mover.",
  "wallet.svc.quote_failed_retried":
    "Presupuesto fallido, consolidación reintentada",
  "wallet.svc.amount_unfit_retried":
    "La cantidad no encajaba, consolidación reintentada",
  "wallet.svc.cannot_size":
    "No se pudo calcular el tamaño de esta transferencia.",
  "wallet.svc.insufficient_at_mint": "Saldo insuficiente en {mint}.",
  "wallet.svc.inexact_title":
    "Tus pruebas no pueden formar exactamente {amount} {unit} sin conexión.",
  "wallet.svc.inexact_detail":
    "El token más pequeño que puedes enviar es de {spend} {unit}. Sin conexión no hay cambio, así que los {extra} {unit} de más van al destinatario.",
  "wallet.svc.no_single_mint":
    "Ninguna casa de cambio tiene por sí sola {amount} {unit}. El ecash de casas distintas no se puede combinar en un solo token: consolida antes en una, o envíalo en cantidades separadas.",
  "wallet.svc.have_tried_send":
    "Tienes {total} {unit} y has intentado enviar {amount}.",
  "wallet.svc.invoice_needs":
    "Esta factura necesita {total} {unit} contando la reserva de enrutado, y tú tienes {balance}.",
  "wallet.svc.nothing_to_move": "{mint} no tiene {unit} que mover.",
  "wallet.svc.consolidate_memo": "Consolidación desde {mint}",
  "wallet.svc.cannot_size_detail":
    "Tras las comisiones de enrutado de Lightning, {from} no puede mover una cantidad útil a {to}. Prueba a mover una cantidad concreta más pequeña.",
  "wallet.svc.mint_cannot": "{mint} no puede {action}.",
  "wallet.svc.no_nut": "La casa de cambio no anuncia NUT-{nut}.",
  "wallet.svc.unknown_mint": "Ese pago nombra una casa de cambio que no usas.",
  "wallet.svc.unknown_mint_body":
    "Añádela tú mismo si confías en ella; no se canjea nada de una casa de cambio que no hayas elegido.",
  "wallet.svc.no_relay": "sin conexión con ningún relé",
  "wallet.svc.no_shared_mint":
    "no hay una casa de cambio común con saldo suficiente",
  "wallet.svc.no_nutzap_info":
    "el destinatario no ha publicado información de nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Bloqueado a su clave pero aún sin entregar. Comparte el token de esta transacción para completarlo.",
  "wallet.svc.swap_lost":
    "La casa de cambio nunca completó este intercambio, así que no se emitió nada a cambio.",
  "wallet.svc.swap_unreadable":
    "Este intercambio se guardó en un formato que esta versión no puede reproducir.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Verificado por QR",
  "contacts.qr.keys_unverified": "Claves recibidas, sin verificar",
  "contacts.qr.not_verified": "Aún sin verificar",
  "contacts.qr.message": "Mensaje",
  "contacts.qr.add": "Añadir contacto",
  "contacts.qr.scan_title": "Escanear código QR",
  "contacts.qr.aim": "Apunta con la cámara a su código QR",
  "contacts.qr.add_desc": "Llega a alguien que no esté cerca en la malla.",
  "contacts.qr.peer_id_hint":
    "Un ID de par tiene 16 caracteres. Un código de contacto empieza por airhop:.",
  "contacts.qr.or_scan": "o escanea su QR",
  "contacts.qr.trust_note":
    "Solo un QR que escanees con tu cámara verifica su clave. Un código pegado trae sus claves, pero no la prueba de que venga de ellos.",
  "contacts.qr.peer_id": "ID de par o código de contacto",
  "contacts.qr.peer_id_placeholder": "Pega un ID o un código de contacto",
  "contacts.qr.scan_camera_a11y": "Escanear el código QR con la cámara",
  "contacts.qr.scan_camera_desc": "Usa tu cámara",
  "contacts.qr.upload_a11y": "Subir una imagen QR desde la galería",
  "contacts.qr.upload": "Subir desde la galería",
  "contacts.qr.upload_desc": "Elige una imagen QR guardada",
  "contacts.qr.scan_a11y": "Añadir un contacto escaneando un código QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Pega un ID de par de 16 caracteres, un enlace airhop://peer/… o un código de contacto.",
  "contacts.scan.camera_label": "Acceso a la cámara",
  "contacts.scan.camera_purpose": "escanear el código QR de un contacto",
  "contacts.scan.camera_needed":
    "Se necesita acceso a la cámara para escanear. Aún puedes añadirlo por ID de par.",
  "contacts.scan.camera_failed":
    "No se pudo iniciar la cámara. Cierra otras apps de cámara e inténtalo de nuevo.",
  "contacts.scan.photo_label": "Acceso a las fotos",
  "contacts.scan.photo_purpose": "escanear un código QR que hayas guardado",
  "contacts.scan.photo_needed":
    "Se necesita acceso a las fotos para elegir una imagen. Aún puedes añadirlo por ID de par.",
  "contacts.scan.no_qr":
    "No se encontró ningún código QR de Airhop en esa imagen.",
  "contacts.scan.unreadable": "No se pudo leer un código QR en esa imagen.",
  "contacts.scan.bitchat_expired":
    "Ese código de bitchat ha caducado. Pídeles que vuelvan a abrir su QR.",
  "contacts.scan.tampered":
    "Este código QR no es válido: su ID de par no coincide con sus claves. Puede que lo hayan manipulado.",
  "contacts.scan.already_added": "Ya está en tus contactos",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Esperando el acceso a la cámara…",
  "contacts.verify.camera_off": "La cámara está desactivada",
  "contacts.verify.open_settings": "Abrir ajustes",
  "contacts.verify.verified": "Verificado",
  "contacts.verify.different": "Contacto distinto",
  "contacts.verify.scan_again": "Escanear de nuevo",
  "contacts.verify.failed": "No se pudo verificar",
  "contacts.verify.done": "Listo",
  "contacts.verify.title": "Verificar a {name}",
  "contacts.verify.aim": "Apunta con la cámara a su código QR",
  "contacts.verify.camera_off_body":
    "Activa el acceso a la cámara en los ajustes para verificar por QR.",
  "contacts.verify.match_body":
    "La clave de {name} coincide. Puedes confiar en este contacto.",
  "contacts.verify.different_body":
    "Este QR pertenece a otra persona. Pide a {name} que muestre su propio código.",
  "contacts.verify.tampered_body":
    "Este QR parece manipulado: su ID no coincide con su clave.",
  "contacts.verify.choose_title": "¿Cómo quieres comprobarlo?",
  "contacts.verify.choose_body":
    "Ambos métodos confirman que las claves de este teléfono son realmente de {name}.",
  "contacts.verify.method_scan": "Escanear su código",
  "contacts.verify.method_scan_sub": "Están aquí contigo",
  "contacts.verify.method_compare": "Comparar un código",
  "contacts.verify.method_compare_sub": "Leerlo en voz alta en una llamada",
  "contacts.verify.no_keys":
    "Todavía no hay claves de este contacto. Escríbeles o escanea su código cuando os veáis.",
  "contacts.verify.compare_title": "Leed esto en voz alta",
  "contacts.verify.compare_body":
    "{name} ve las mismas seis palabras. Si coinciden, ambos sabéis que las claves son auténticas.",
  "contacts.verify.codes_match": "Coinciden",
  "contacts.verify.codes_differ": "No coinciden",
  "contacts.verify.compared_body":
    "{name} y tú habéis confirmado el mismo código. Este contacto está verificado.",

  // ---- Settings: shared chrome ----
  "settings.back": "Volver",
  "settings.coming_soon": "Muy pronto",
  "settings.opens_externally": "{label}, se abre fuera de la app",
  "settings.peer_id": "ID de par",
  "settings.share_peer_id": "Comparte tu ID de par",
  "settings.share_id_short": "Compartir ID",
  "settings.peer_id_sheet.title": "Tu ID de par",
  "settings.peer_id_sheet.copy": "Copiar el ID de par",
  "settings.peer_id_sheet.note":
    "Esto solo funciona cuando ambos estáis al alcance del Bluetooth. Para que alguien pueda escribirte desde cualquier sitio, comparte tu código QR.",

  // ---- Settings: hub rows ----
  "settings.section.general": "General",
  "settings.section.general_desc":
    "Funciones opcionales, deshacer el envío, medios, restablecer",
  "settings.section.privacy": "Privacidad y seguridad",
  "settings.section.privacy_desc":
    "Secreto hacia delante, paquetes firmados, pares bloqueados",
  "settings.section.network": "Red y relés",
  "settings.section.network_desc":
    "Respaldo por internet, relés de nostr, compatibilidad con bitchat",
  "settings.section.permissions": "Permisos",
  "settings.section.permissions_desc":
    "Bluetooth, ubicación, notificaciones, cámara, micrófono",
  "settings.section.storage": "Almacenamiento y datos",
  "settings.section.diagnostics": "Diagnóstico",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transportes",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "Cerca",
  "settings.group.sync": "Sincronización",
  "settings.group.features": "Funciones",
  "settings.group.messages": "Mensajes",
  "settings.group.local": "Local",
  "settings.group.media": "Medios",
  "settings.group.reset": "Restablecer",
  "settings.group.always_on": "Siempre activo",
  "settings.group.notifications": "Notificaciones",
  "settings.group.blocked": "Bloqueados",
  "settings.group.theme": "Tema",
  "settings.group.font": "Fuente",
  "settings.group.language": "Idioma",
  "settings.section.diagnostics_desc":
    "Estado de la conexión y dispositivos cercanos",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Enlaces Bluetooth",
  "settings.diag.ble_links_desc":
    "Dispositivos a los que este teléfono está conectado directamente",
  "settings.diag.lan": "Red local",
  "settings.diag.lan_desc": "Teléfonos en una misma red Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "De teléfono a teléfono sin router",
  "settings.diag.wifi_active": "En marcha",
  "settings.diag.wifi_unsupported": "No compatible con este dispositivo",
  "settings.diag.wifi_permission": "Bloqueado por un permiso",
  "settings.diag.wifi_unavailable": "No disponible ahora mismo",
  "settings.diag.wifi_unpaired": "Nada vinculado",
  "settings.diag.wifi_unknown": "Esperando a la radio",
  "settings.diag.relays": "Relés de Nostr",
  "settings.diag.relays_desc":
    "Se usan para los canales de ubicación y el alcance por internet",
  "settings.diag.connected": "Conectado",
  "settings.diag.disconnected": "Sin conexión",
  "settings.diag.peer_direct": "Enlace directo",
  "settings.diag.peer_relayed": "Oído a través de otro dispositivo",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Sin lectura de señal",
  "settings.diag.no_peers": "No hay nadie al alcance",
  "settings.diag.no_peers_desc": "{links} enlaces de radio abiertos",
  "settings.diag.gcs_size": "Tamaño del filtro",
  "settings.diag.gcs_size_desc": "El mayor filtro de sincronización emitido",
  "settings.diag.fpr": "Tasa de falsos positivos",
  "settings.diag.fpr_desc":
    "Con qué frecuencia el filtro afirma tener un paquete que nos falta",
  "settings.diag.bytes": "{n} bytes",
  "settings.diag.footnote":
    "Aquí no se puede cambiar nada. Estos valores son fijos para que Airhop siga siendo compatible con bitchat.",
  "settings.section.storage_desc": "Uso y caché",
  "settings.section.appearance": "Apariencia",
  "settings.section.appearance_desc": "Tema, fuente e idioma",
  "settings.section.help": "Ayuda y comentarios",
  "settings.section.help_desc":
    "Escríbenos, informa de un fallo o lee las preguntas frecuentes",
  "settings.section.support": "Apoyo",
  "settings.section.support_desc": "Ayuda a mantener el desarrollo activo",
  "settings.section.about": "Acerca de",
  "settings.section.about_desc": "Versión, registro de cambios y código fuente",

  // ---- Settings: general ----
  "settings.general.undo": "Deshacer el envío",
  "settings.general.feature_ai": "IA",
  "settings.general.feature_wallet": "Cartera",
  "settings.general.undo_seconds": "{count} segundos",
  "settings.general.undo_a11y": "Deshacer el envío: {value}",
  "settings.general.quality_a11y": "Poner la calidad de subida en {value}",
  "settings.general.undo_desc":
    "Retiene un momento el mensaje enviado para que puedas retirarlo antes de que salga",
  "settings.general.undo_off_desc": "Enviar al momento, sin poder deshacer",
  "settings.general.undo_2": "2 segundos",
  "settings.general.undo_2_desc": "Una oportunidad rápida de retirarlo",
  "settings.general.undo_10": "10 segundos",
  "settings.general.undo_10_desc": "El margen más largo",
  "settings.general.quality": "Calidad de subida",
  "settings.general.quality_desc":
    "Se aplica a las fotos enviadas desde la cámara o la galería. En cualquier caso, todas las fotos se ajustan a la malla.",
  "settings.general.quality_low": "Baja",
  "settings.general.quality_low_desc": "Fotos más pequeñas, envío más rápido",
  "settings.general.quality_medium": "Media",
  "settings.general.quality_medium_desc":
    "Equilibrio entre detalle y velocidad",
  "settings.general.quality_high": "Alta",
  "settings.general.quality_high_desc": "Conserva el máximo detalle",
  "settings.general.feature_wallet_desc":
    "Envía ecash de Cashu de igual a igual por la malla",
  "settings.general.feature_wallet_a11y": "Cartera (siempre activa)",
  "settings.general.feature_ai_desc":
    "Asistente privado en el dispositivo, sin llamadas de red",
  "settings.general.feature_feeds": "Feeds",
  "settings.general.feature_feeds_desc":
    "Lee y publica en los feeds de Bluesky y Mastodon",
  "settings.general.show_media": "Mostrar los medios automáticamente",
  "settings.general.show_media_desc":
    "Las fotos y los vídeos aparecen en el chat, o se quedan tras un toque",
  "settings.general.reset": "Restablecer los ajustes",
  "settings.general.media_retention": "Conservar los medios durante",
  "settings.general.media_retention_desc":
    "Las fotos, los vídeos y las notas de voz se eliminan pasado el tiempo elegido",
  "settings.general.media_retention_sheet":
    "Elige cuánto tiempo permanecen los medios en este dispositivo. Los medios eliminados no se pueden recuperar.",
  "settings.general.retention_7_desc":
    "Lo que menos rastro deja. Es lo mejor si el riesgo es el propio teléfono.",
  "settings.general.retention_14_desc":
    "Un término medio para una o dos semanas sin cobertura.",
  "settings.general.retention_30_desc":
    "Mantiene las conversaciones legibles más tiempo y ocupa más disco.",
  "settings.general.reset_desc":
    "Devuelve cada preferencia a su valor por defecto y deja intactos tu identidad, tus mensajes, tus contactos y tu cartera",
  "settings.general.reset_title": "¿Restablecer los ajustes?",
  "settings.general.reset_body":
    "Cada preferencia vuelve a su valor por defecto: apariencia, deshacer el envío y conectividad (internet, Tor, pasarela, puente, relés). Tu identidad, tus mensajes, tus contactos y tu cartera quedan intactos.",
  "settings.general.reset_confirm": "Restablecer",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Secreto hacia delante",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet siempre está activo en los mensajes directos",
  "settings.security.signed_packets": "Paquetes firmados",
  "settings.security.signed_packets_desc":
    "Cada paquete va firmado con Ed25519",
  "settings.security.hide_previews":
    "Ocultar las vistas previas de las notificaciones",
  "settings.security.hide_previews_desc":
    "Mantiene al remitente y el mensaje fuera de la pantalla de bloqueo, que los muestra sin desbloquear",
  "settings.security.no_blocked": "No hay pares bloqueados",
  "settings.security.no_blocked_desc":
    "Los pares bloqueados no pueden escribirte ni aparecen en la pestaña Malla",
  "settings.security.unblock_title": "Desbloquear a este par",
  "settings.security.unblock": "Desbloquear",
  "settings.security.unblock_peer": "Desbloquear a {name}",
  "settings.security.unblock_body":
    "{name} podrá volver a escribirte y reaparecerá en la pestaña Malla cuando esté cerca.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Respaldo por internet",
  "settings.network.internet_desc":
    "Continúa por los relés de Nostr cuando los pares de la malla quedan fuera de alcance",
  "settings.network.internet_off_title": "¿Desactivar internet?",
  "settings.network.internet_off_body":
    "Airhop funcionará solo por Bluetooth. Dejará de contactar con los relés de Nostr, y Tor, la pasarela de internet y el puente de malla se apagarán. El chat cercano por Bluetooth sigue funcionando.",
  "settings.network.turn_off": "Desactivar",
  "settings.network.discovery": "Descubrimiento geográfico de relés",
  "settings.network.discovery_desc":
    "Selecciona automáticamente los relés más cercanos a una celda de ubicación entre más de 300 relés distribuidos",
  "settings.network.discovery_needs_relay": "Añade antes un relé propio",
  "settings.network.discovery_needs_relay_body":
    "El descubrimiento automático es lo que dirige Airhop a los relés más cercanos. Desactivarlo solo tiene sentido una vez que has fijado tus propios relés abajo, así que añade al menos uno primero.",
  "settings.network.custom_only_title": "¿Usar solo tus relés?",
  "settings.network.custom_only_body":
    "Los canales de ubicación y el puente de malla dejarán de elegir automáticamente los relés más cercanos y usarán solo los que hayas añadido. Esto puede reducir el alcance, y puede que dejes de coincidir con usuarios de bitchat, que se concentran en los relés más cercanos.",
  "settings.network.custom": "Relés propios",
  "settings.network.custom_desc":
    "Añade tus propios relés para los canales de ubicación y el puente de malla",
  "settings.network.custom_added": "{count} de {max} añadidos",
  "settings.network.dm_relays": "Relés de mensajes",
  "settings.network.dm_relays_desc":
    "Los mensajes directos y los canales privados usan siempre estos. Los relés propios no los cambian.",
  "settings.network.discovery_back_on": "Descubrimiento geográfico reactivado",
  "settings.network.discovery_back_on_body":
    "Ese era tu último relé propio. Los canales de ubicación necesitan dónde publicar, así que Airhop vuelve a elegir automáticamente los relés más cercanos.",
  "settings.network.add_relay": "Añadir un relé",
  "settings.network.remove_relay": "Quitar {url}",
  "settings.network.add_short": "Añadir",
  "settings.network.relay_limit":
    "Puedes añadir {count} relés. Quita uno para añadir otro.",
  "settings.network.relay_duplicate": "Ese relé ya está en tu lista.",
  "settings.network.relay_invalid":
    "Introduce un host de relé válido, por ejemplo relay.example.com. El puerto solo hace falta si el relé no usa el predeterminado. No se admiten direcciones IP ni nombres locales.",
  "settings.network.lan": "Red local",
  "settings.network.lan_desc":
    "Llega a quienes están en la misma WiFi, incluso entre iPhone y Android. Otros dispositivos de la red pueden ver que usas Airhop.",
  "settings.network.lan_searching": "No hay dispositivos Airhop en esta red",
  "settings.network.lan_active": "Conectado en esta red",
  "settings.network.lan_unavailable": "No estás en una red WiFi",
  "settings.network.lan_permission":
    "El acceso a la red local está desactivado para Airhop",
  "settings.network.lan_unsupported": "No disponible en este dispositivo",
  "settings.network.lan_foreground":
    "Se pausa cuando Airhop está en segundo plano. El Bluetooth sigue funcionando.",
  "settings.network.wifi_pair": "Vinculación",
  "settings.network.wifi_paired": "Dispositivos vinculados",
  "settings.network.wifi_pair_find": "Buscar un dispositivo",
  "settings.network.wifi_pair_find_desc":
    "Buscar un iPhone cercano que se esté mostrando. Ambos necesitan iOS 26 o posterior.",
  "settings.network.wifi_pair_show": "Mostrar este iPhone",
  "settings.network.wifi_pair_show_desc":
    "Deja que un iPhone cercano encuentre este. Uno busca y el otro se muestra, al mismo tiempo.",
  "settings.network.wifi_pair_find_action": "Elegir un iPhone cercano",
  "settings.network.wifi_pair_show_action": "Hacer visible este iPhone",
  "settings.network.wifi_pair_unavailable":
    "Wi-Fi Aware no está disponible ahora mismo",
  "settings.network.wifi_pair_forget":
    "Quita una vinculación en la app Settings",
  "settings.network.bitchat": "Compatibilidad con bitchat",
  "settings.network.bitchat_desc":
    "La misma malla BLE que bitchat, totalmente interoperable. Está siempre activa y no se puede desactivar.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Ejecutar en segundo plano",
  "settings.conn.background_desc":
    "Mantén la malla en marcha cuando Airhop esté cerrada",
  "settings.conn.background_on_title": "¿Mantener la malla en marcha?",
  "settings.conn.background_on_body":
    "Airhop sigue retransmitiendo y recibiendo con la app cerrada, así que los mensajes llegan mientras no estás. Android muestra una notificación permanente mientras lo hace.",
  "settings.conn.background_off_title": "¿Detener la malla al cerrar Airhop?",
  "settings.conn.background_off_body":
    "Los mensajes solo llegarán con Airhop abierta, y este teléfono dejará de retransmitir para quienes estén cerca. La notificación permanente desaparece.",
  "settings.conn.live_voice": "Voz en directo",
  "settings.conn.live_voice_desc":
    "Habla con quien esté cerca como con un walkie-talkie",
  "settings.conn.live_voice_on_title": "¿Activar la voz en directo?",
  "settings.conn.live_voice_on_body":
    "Al mantener pulsado el micrófono, tu voz llega a todos los que estén al alcance del Bluetooth según hablas, y la suya suena en tu teléfono. No se graba nada.",
  "settings.conn.live_voice_off_title": "¿Desactivar la voz en directo?",
  "settings.conn.live_voice_off_body":
    "Mantener pulsado el micrófono grabará una nota de voz. Se envía al soltar, y nadie la oye hasta que la reproduce.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Enrutado por Tor",
  "settings.conn.tor_desc":
    "Envía el tráfico de Nostr por Tor para más privacidad",
  "settings.conn.tor_on_title": "¿Enviar el tráfico de Nostr por Tor?",
  "settings.conn.tor_on_body":
    "Los relés dejarán de ver tu dirección IP. Conectarse lleva más tiempo y los mensajes llegan más despacio. El Bluetooth no se ve afectado.",
  "settings.conn.tor_off_title": "¿Desactivar el enrutado por Tor?",
  "settings.conn.tor_off_body":
    "El tráfico de Nostr vuelve por tu conexión normal, así que los relés verán de nuevo tu dirección IP. En ambos casos el Bluetooth no se ve afectado.",
  "settings.conn.tor_unavailable":
    "El enrutado por Tor no está disponible en esta versión.",
  "settings.conn.tor_timeout":
    "Tor tarda más de un minuto en conectarse. Sigue activo e intentándolo; la pestaña Malla dirá cuándo está enrutando, o si esta red lo está bloqueando.",
  "settings.conn.tor_failed":
    "No se pudo iniciar Tor. Comprueba que la app tenga acceso a la red.",
  "settings.conn.mint_clearnet":
    "Permitir el tráfico con la casa de cambio por la red abierta",
  "settings.conn.mint_clearnet_desc":
    "En iOS, Tor solo cubre Nostr. Déjalo desactivado para bloquear las peticiones a la casa de cambio; en cualquier caso, el ecash por la malla sigue funcionando.",
  "settings.conn.gateway": "Pasarela de internet",
  "settings.conn.gateway_desc":
    "Presta tu conexión a un teléfono cercano sin acceso para que pueda llegar a los canales de ubicación",
  "settings.conn.gateway_on_title": "¿Activar la pasarela de internet?",
  "settings.conn.gateway_on_body":
    "Los teléfonos cercanos sin conexión propia enviarán y recibirán mensajes de los canales de ubicación a través de la tuya. Usa tus datos móviles y tu batería, y sus mensajes van cifrados de extremo a extremo, así que no puedes leer lo que pasa por ahí.",
  "settings.conn.gateway_off_title": "¿Desactivar la pasarela de internet?",
  "settings.conn.gateway_off_body":
    "Los teléfonos cercanos sin conexión dejarán de llegar a los canales de ubicación a través de la tuya. Tus mensajes no se ven afectados.",
  "settings.conn.bridge": "Puente de malla",
  "settings.conn.bridge_desc":
    "Enlaza el chat público #bluetooth de esta zona con otro grupo Bluetooth fuera de alcance a través de internet",
  "settings.conn.bridge_on_title": "¿Activar el puente de malla?",
  "settings.conn.bridge_on_body":
    "Tus mensajes públicos de #bluetooth se publicarán en tu barrio por internet, para que puedan leerlos personas fuera del alcance del Bluetooth. Los mensajes privados nunca cruzan el puente, y «solo cerca» mantiene local cualquier mensaje concreto.",
  "settings.conn.bridge_off_title": "¿Desactivar el puente de malla?",
  "settings.conn.bridge_off_body":
    "Tus mensajes públicos de #bluetooth vuelven a quedarse al alcance del Bluetooth, y los del grupo enlazado dejan de llegar aquí.",
  "settings.conn.bridge_needs_location":
    "El puente de malla necesita la ubicación",
  "settings.conn.bridge_needs_location_desc":
    "Encuentra tu barrio a partir de una lectura de ubicación. Concede la ubicación para empezar a enlazar.",
  "settings.conn.grant_location": "Conceder el permiso de ubicación",
  "settings.conn.grant_short": "Conceder",
  "settings.conn.internet_off": "Internet está desactivado",
  "settings.conn.internet_off_desc":
    "Tor, el puente y la pasarela usan internet. Activa el respaldo por internet en Red para usarlos.",
  "settings.conn.turn_on": "Activar",
  "settings.conn.turn_off": "Desactivar",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Encuentra dispositivos cercanos y retransmite mensajes entre ellos. Sin él, la malla no puede funcionar.",
  "settings.permissions.location": "Ubicación",
  "settings.permissions.location_desc":
    "Abre los canales de las zonas cercanas. Sin ella, esos canales quedan cerrados y la malla Bluetooth sigue funcionando con normalidad.",
  "settings.permissions.notifications": "Notificaciones",
  "settings.permissions.notifications_desc":
    "Recibe avisos de mensajes nuevos incluso con la app cerrada. Sin ellas, solo los verás al abrir Airhop.",
  "settings.permissions.camera": "Cámara",
  "settings.permissions.camera_desc":
    "Escanea códigos QR y haz fotos o vídeos para enviar. Sin ella, aún puedes compartir medios desde la galería.",
  "settings.permissions.photos": "Fotos",
  "settings.permissions.photos_desc":
    "Envía fotos desde la galería y guarda los medios recibidos. Sin ellas, aún puedes hacer y enviar fotos nuevas con la cámara.",
  "settings.permissions.microphone": "Micrófono",
  "settings.permissions.microphone_desc":
    "Graba y envía mensajes de voz o usa la voz en directo. Sin él, los mensajes de voz y la voz en directo no funcionarán.",
  "settings.permissions.allow": "Conceder este permiso",
  "settings.permissions.open_settings":
    "Abrir los ajustes del sistema para cambiar este permiso",
  "settings.permissions.system": "Sistema",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Uso de red",
  "settings.storage.storage_usage": "Uso de almacenamiento",
  "settings.storage.storage_usage_desc":
    "Mensajes, pruebas de la cartera y adjuntos en caché",
  "settings.storage.session_usage":
    "Esta sesión · {sent} enviados, {received} recibidos",
  "settings.storage.cache": "Caché",
  "settings.storage.cache_desc": "{size} de adjuntos",
  "settings.storage.clear_cache": "Vaciar la caché de adjuntos",
  "settings.storage.clear": "Vaciar",
  "settings.storage.clear_title": "¿Vaciar los medios en caché?",
  "settings.storage.clear_body":
    "Las fotos, los vídeos, las notas de voz y los archivos se eliminan de este dispositivo, tanto los enviados como los recibidos. No se pueden volver a descargar: sus burbujas lo indicarán y puedes pedir al remitente que los reenvíe. Los mensajes y la cartera quedan intactos.",
  "settings.storage.cleared": "Caché vaciada",
  "settings.storage.freed": "Se han liberado {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Poner la apariencia en {value}",
  "settings.font.set_a11y": "Poner la fuente monoespaciada en {value}",
  "settings.font.system": "Sistema",
  "settings.font.system_desc":
    "Usa la fuente monoespaciada predeterminada de tu dispositivo",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Moderna y fácil de leer",
  "settings.language.en": "Inglés",
  "settings.language.am": "Amárico",
  "settings.language.ar": "Árabe",
  "settings.language.bn": "Bengalí",
  "settings.language.my": "Birmano",
  "settings.language.zh_hans": "Chino (simplificado)",
  "settings.language.zh_hant": "Chino (tradicional)",
  "settings.language.nl": "Neerlandés",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "Francés",
  "settings.language.ka": "Georgiano",
  "settings.language.de": "Alemán",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonesio",
  "settings.language.it": "Italiano",
  "settings.language.ja": "Japonés",
  "settings.language.ko": "Coreano",
  "settings.language.mg": "Malgache",
  "settings.language.ms": "Malayo",
  "settings.language.ne": "Nepalí",
  "settings.language.fa": "Persa",
  "settings.language.pl": "Polaco",
  "settings.language.pt_br": "Portugués (Brasil)",
  "settings.language.pt_pt": "Portugués (Portugal)",
  "settings.language.pa": "Panyabí",
  "settings.language.ru": "Ruso",
  "settings.language.es": "Español",
  "settings.language.sw": "Suajili",
  "settings.language.sv": "Sueco",
  "settings.language.ta": "Tamil",
  "settings.language.th": "Tailandés",
  "settings.language.tr": "Turco",
  "settings.language.uk": "Ucraniano",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamita",
  "settings.language.pseudo": "Seudolocalización",
  "settings.language.soon": "Muy pronto",
  "settings.language.soon_a11y": "{value}, muy pronto",
  "settings.language.set_a11y": "Poner el idioma en {value}",
  "settings.language.pending": "Al abrir de nuevo",
  "settings.language.pending_a11y":
    "{value}, se aplicará la próxima vez que abras Airhop",
  "settings.language.rtl_restart": "Reabrir ahora",
  "settings.language.rtl_title": "Vuelve a abrir Airhop para terminar",
  "settings.language.rtl_body":
    "{value} se lee de derecha a izquierda, y Airhop solo puede cambiar de dirección al arrancar. Ciérrala y vuelve a abrirla para terminar el cambio. No se pierde nada, y hasta entonces tu malla sigue conectada.",
  "settings.theme.light": "Claro",
  "settings.theme.light_desc": "Usar siempre la paleta clara",
  "settings.theme.dark": "Oscuro",
  "settings.theme.dark_desc": "Usar siempre la paleta oscura",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Conectado",
  "settings.status.online_desc": "Visible, anunciándose y buscando",
  "settings.status.away": "Ausente",
  "settings.status.away_desc": "Malla en pausa, sin buscar ni anunciarse",
  "settings.status.invisible": "Invisible",
  "settings.status.invisible_desc": "Buscando, pero oculto al descubrimiento",
  "settings.status.title": "Estado",
  "settings.status.set_a11y": "Poner el estado en {value}",
  "settings.status.edit": "Editar el estado",
  "settings.status.desc": "Elige cuánto se te ve en la malla.",
  "settings.transfer.identity": "Identidad y claves",
  "settings.transfer.identity_desc":
    "Tu ID de par, tu nombre de usuario y tus contactos",
  "settings.transfer.chats": "Chats e historial",
  "settings.transfer.chats_desc":
    "Conversaciones, grupos y los canales a los que te has unido",
  "settings.transfer.wallet": "Saldo de la cartera",
  "settings.transfer.wallet_desc":
    "Pruebas de Cashu e historial de transacciones",
  "settings.transfer.title": "Pasar a un teléfono nuevo",
  "settings.transfer.desc":
    "Lleva tu identidad, tus chats y tu cartera a otro dispositivo",
  "settings.transfer.coming_soon_a11y": "Pasar a un teléfono nuevo, muy pronto",
  "settings.transfer.body":
    "Junta los dos teléfonos y pásalo todo por Bluetooth. Nada atraviesa un servidor, así que funciona sin internet.",
  "settings.qr.permission_label": "Acceso a las fotos",
  "settings.qr.permission_purpose": "guardar tu código QR",
  "settings.qr.saved": "Guardado",
  "settings.qr.saved_body": "Código QR guardado en tu galería de fotos.",
  "settings.qr.save_failed": "No se pudo guardar",
  "settings.qr.save_failed_body":
    "No se pudo guardar el código QR. Inténtalo de nuevo.",
  "settings.qr.share_message": "Añádeme en Airhop",
  "settings.qr.share_body":
    "Añádeme en Airhop — mensajería en malla privada y con prioridad sin conexión.",
  "settings.qr.show_short": "Ver QR",
  "settings.qr.title": "Tu código QR",
  "settings.qr.note":
    "Contiene tus claves públicas, que permiten a otros escribirte desde cualquier sitio. Compártelo solo con gente de confianza. No cambiará a menos que borres tu identidad.",
  "settings.qr.code_label": "Código de contacto",
  "settings.qr.copy_code": "Copiar el código de contacto",
  "settings.qr.share": "Compartir el código QR",
  "settings.qr.share_short": "Compartir QR",
  "settings.qr.download": "Descargar el código QR",
  "settings.qr.download_short": "Descargar QR",
  "settings.qr.show": "Ver el código QR",
  "settings.wipe.trigger": "Activar el borrado de emergencia",
  "settings.wipe.trigger_desc":
    "Toca tres veces para borrar al instante sin confirmar",
  "settings.wipe.title": "Borrado de emergencia",
  "settings.wipe.now": "Borrar ahora",
  "settings.wipe.desc":
    "Destruye al instante todas las claves, los mensajes y las pruebas",
  "settings.wipe.body":
    "Esto destruirá al instante todas tus claves, tus mensajes y las pruebas de tu cartera. No se puede deshacer.",
  "settings.wipe.in_progress": "Borrando",
  "settings.wipe.in_progress_body":
    "Destruyendo tus claves, mensajes y archivos. Tarda unos segundos y termina por su cuenta aunque se cierre la app.",
  "settings.wipe.got_it": "Entendido",
  "settings.wipe.keys_failed": "No se pudieron destruir las claves",
  "settings.wipe.keys_failed_body":
    "Tus mensajes, contactos y cartera han desaparecido, pero el dispositivo se negó a liberar tus claves. Desbloquéalo y vuelve a borrar.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Escríbenos",
  "settings.help.contact_a11y": "Enviar un correo a {address}",
  "settings.help.bug": "Informar de un fallo",
  "settings.help.bug_desc": "Abre una incidencia en GitHub",
  "settings.help.bug_a11y": "Informar de un fallo en GitHub",
  "settings.help.faq": "Preguntas frecuentes",
  "settings.help.faq_desc": "Respuestas a las dudas más comunes",
  "settings.help.faq_a11y": "Abrir las preguntas frecuentes",
  "settings.help.terms_desc": "Cómo se puede usar Airhop",
  "settings.help.terms_a11y": "Abrir los Términos del servicio",
  "settings.help.privacy_desc": "Lo que no recopilamos",
  "settings.help.privacy_a11y": "Abrir la Política de privacidad",

  // ---- Settings: support ----
  "settings.support.card": "Tarjeta o UPI",
  "settings.support.card_desc": "Banca en línea y monederos, en todo el mundo",
  "settings.support.card_a11y":
    "Apoyar con tarjeta, UPI, banca en línea o monedero",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Mensual o una sola vez, sin comisión de plataforma",
  "settings.support.sponsors_a11y": "Apoyar a través de GitHub Sponsors",
  "settings.support.note":
    "Construyo Airhop en mi tiempo libre. No hay inversores ni anuncios. Si te resulta útil, una aportación ayuda mucho a mantener el desarrollo activo. En cualquier caso, todas las funciones seguirán siendo gratuitas.",

  // ---- Settings: about and version ----
  "settings.about.version": "Versión",
  "settings.about.version_desc": "Versión actual",
  "settings.about.version_a11y": "Ver la versión y buscar actualizaciones",
  "settings.about.release_notes": "Notas de la versión",
  "settings.about.release_notes_desc": "Novedades de la última versión",
  "settings.about.release_notes_a11y":
    "Abrir las notas de la última versión en GitHub",
  "settings.about.source": "Código fuente",
  "settings.about.source_a11y": "Abrir el código fuente en GitHub",
  "settings.about.licenses": "Licencias de código abierto",
  "settings.about.open_repo": "Abrir el repositorio de {name}",
  "settings.about.licenses_desc": "Paquetes de código abierto de terceros",
  "settings.about.licenses_a11y": "Ver las licencias de terceros",
  "settings.version.codename": "Nombre en clave",
  "settings.version.checking": "Comprobando",
  "settings.version.check": "Buscar actualizaciones",
  "settings.version.checking_title": "Buscando actualizaciones",
  "settings.version.up_to_date": "Tienes la última versión.",
  "settings.version.release_notes": "Ver las notas de la versión",
  "settings.version.made_with": "Hecho con",
  "settings.version.number": "Versión {version}",
  "settings.version.update_to": "Actualizar a {version}",
  "settings.version.update_to_a11y": "Actualizar a la versión {version}",
  "settings.version.released_under": "Publicado bajo {license}",
  "settings.version.notes_a11y": "Ver las notas de la versión {version}",
  "settings.version.tor_paused":
    "La búsqueda de actualizaciones se pausa con Tor activado para no filtrar tu IP. Consulta la página de versiones en un navegador.",
  "settings.version.check_failed":
    "No se pudieron buscar actualizaciones. Comprueba tu conexión e inténtalo de nuevo.",
  "settings.version.downloading": "Descargando {percent}%",
  "settings.version.install": "Instalar",
  "settings.version.download_failed":
    "Error en la descarga. Comprueba tu conexión e inténtalo de nuevo.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large":
    "{kind} ocupa {size} KiB y supera el límite de {cap} KiB.",
  "transfer.failed.malformed":
    "Llegó un adjunto dañado que no se pudo abrir. Pídeles que lo envíen otra vez.",
  "transfer.failed.unsupported_type":
    "Llegó un adjunto en un formato que esta app no puede abrir.",
  "transfer.failed.type_mismatch":
    "Se rechazó un adjunto: su contenido no coincide con el tipo de archivo que declaraba.",
  "transfer.failed.storage":
    "Llegó un adjunto pero no se pudo guardar. Comprueba el espacio libre.",
  "transfer.badge.waiting": "Esperando · {name}",
  "transfer.badge.active_count": "{count} transferencias",
  "transfer.badge.sending": "Enviando {name}",
  "transfer.badge.receiving": "Recibiendo {name}",
  "transfer.badge.a11y":
    "{label}, {percent} por ciento. Abrir la conversación.",
  "transfer.kind.photo": "Foto",
  "transfer.kind.video": "Vídeo",
  "transfer.kind.voice": "Nota de voz",
  "transfer.this.photo": "Esta foto",
  "transfer.this.video": "Este vídeo",
  "transfer.this.voice": "Esta nota de voz",
  "transfer.this.file": "Este archivo",
  "transfer.kind.document": "Documento",
  "transfer.kind.voice_preview": "Nota de voz",
  "transfer.kind.photo_preview": "Foto",
  "transfer.kind.video_preview": "Vídeo",
  "transfer.kind.document_preview": "Documento",

  // ---- System notifications ----
  "notif.channel.messages": "Mensajes",
  "notif.channel.nearby": "Pares cercanos",
  "notif.channel.nearby_desc":
    "Un aviso ocasional cuando la malla encuentra gente al alcance del Bluetooth.",
  "notif.nearby.body":
    "Ahora al alcance del Bluetooth. Toca para abrir la malla.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Alguien",
  "notif.notice_urgent": "Aviso urgente · {content}",
  "notif.notice": "Aviso · {content}",
  "notif.incoming_file": "Archivo entrante",
  "notif.preview.photo": "📷 Foto",
  "notif.preview.voice": "🎤 Mensaje de voz",
  "notif.preview.video": "🎥 Vídeo",
  "notif.preview.document": "📄 Documento",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Mensaje nuevo",
  "notif.hidden.channel": "Actividad nueva",
  "notif.hidden.mention": "Te han mencionado",
  "notif.mention.title": "{sender} te ha mencionado",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Mostrar {count} más",
    many: "Mostrar {count} más",
    other: "Mostrar {count} más",
  },
  "chat.channels.show_more_a11y": {
    one: "Mostrar {count} canal predeterminado más",
    many: "Mostrar {count} canales predeterminados más",
    other: "Mostrar {count} canales predeterminados más",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} sin leer",
    many: "{label}, {count} sin leer",
    other: "{label}, {count} sin leer",
  },
  "a11y.new_count": {
    one: "{label}, {count} nuevo",
    many: "{label}, {count} nuevos",
    other: "{label}, {count} nuevos",
  },
  "chat.a11y.unread": {
    one: "{count} sin leer",
    many: "{count} sin leer",
    other: "{count} sin leer",
  },
  "chat.thread.length_left": {
    one: "queda {count}",
    many: "quedan {count}",
    other: "quedan {count}",
  },
  "settings.general.retention_days": {
    one: "{count} día",
    many: "{count} días",
    other: "{count} días",
  },
  "chat.info.group_reach": {
    one: "{reachable} de {count} miembro accesible",
    many: "{reachable} de {count} miembros accesibles",
    other: "{reachable} de {count} miembros accesibles",
  },
  "chat.group_members": {
    one: "Grupo privado  ·  {count} miembro",
    many: "Grupo privado  ·  {count} miembros",
    other: "Grupo privado  ·  {count} miembros",
  },
  "chat.select.count": {
    one: "{count} seleccionado",
    many: "{count} seleccionados",
    other: "{count} seleccionados",
  },
  "chat.select.forward": {
    one: "Reenviar {count} mensaje",
    many: "Reenviar {count} mensajes",
    other: "Reenviar {count} mensajes",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} hablando",
    many: "{count} hablando",
    other: "{count} hablando",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} par al alcance",
    many: "{count} pares al alcance",
    other: "{count} pares al alcance",
  },
  "mesh.peer.hops_away": {
    one: "a {count} salto",
    many: "a {count} saltos",
    other: "a {count} saltos",
  },
  "chat.presence.active": {
    one: "{count} activo",
    many: "{count} activos",
    other: "{count} activos",
  },
  "chat.presence.nearby": {
    one: "{count} cerca",
    many: "{count} cerca",
    other: "{count} cerca",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} casa de cambio",
    many: "{count} casas de cambio",
    other: "{count} casas de cambio",
  },
  "wallet.mint.remove_body": {
    one: "{mint} guarda {balance} {unit} en {count} prueba. Quitarla borra esa prueba de este dispositivo de forma permanente y no hay copia de seguridad. Retira o envía el saldo primero.",
    many: "{mint} guarda {balance} {unit} en {count} pruebas. Quitarla borra esas pruebas de este dispositivo de forma permanente y no hay copia de seguridad. Retira o envía el saldo primero.",
    other:
      "{mint} guarda {balance} {unit} en {count} pruebas. Quitarla borra esas pruebas de este dispositivo de forma permanente y no hay copia de seguridad. Retira o envía el saldo primero.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} depósito esperando el pago. Se comprueba de nuevo cada vez que se abre la app.",
    many: "{count} depósitos esperando el pago. Se comprueban de nuevo cada vez que se abre la app.",
    other:
      "{count} depósitos esperando el pago. Se comprueban de nuevo cada vez que se abre la app.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "Se recuperó {count} prueba sin gastar de {mints}.",
    many: "Se recuperaron {count} pruebas sin gastar de {mints}.",
    other: "Se recuperaron {count} pruebas sin gastar de {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "Se encontró {count} moneda, pero ya estaba gastada, así que no se acreditó nada por ella. Es normal: todas las monedas que has gastado siguen apareciendo en los registros que guarda la casa de cambio.",
    many: "Se encontraron {count} monedas, pero ya estaban gastadas, así que no se acreditó nada por ellas. Es normal: todas las monedas que has gastado siguen apareciendo en los registros que guarda la casa de cambio.",
    other:
      "Se encontraron {count} monedas, pero ya estaban gastadas, así que no se acreditó nada por ellas. Es normal: todas las monedas que has gastado siguen apareciendo en los registros que guarda la casa de cambio.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Mostrar {count} más",
    many: "Mostrar {count} más",
    other: "Mostrar {count} más",
  },
  "wallet.activity.show_more_a11y": {
    one: "Mostrar {count} pago más",
    many: "Mostrar {count} pagos más",
    other: "Mostrar {count} pagos más",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} sin confirmar",
    many: "{count} sin confirmar",
    other: "{count} sin confirmar",
  },
  "wallet.proof_count": {
    one: "{count} prueba",
    many: "{count} pruebas",
    other: "{count} pruebas",
  },
  "wallet.spent_removed_detail": {
    one: "{count} prueba ya estaba gastada y se ha eliminado.",
    many: "{count} pruebas ya estaban gastadas y se han eliminado.",
    other: "{count} pruebas ya estaban gastadas y se han eliminado.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Alguien cerca",
    many: "{count} personas cerca",
    other: "{count} personas cerca",
  },
};

export const es = { strings, plurals };
